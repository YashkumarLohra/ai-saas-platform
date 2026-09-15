import 'dotenv/config';
import prisma from './src/lib/prisma';
import { workflowOrchestrator } from './src/services/workflowOrchestrator';
import { MockImageProvider } from './src/providers/MockImageProvider';
import { storageService } from './src/services/storageService';
import { ProviderError, StorageError, WorkflowError } from './src/lib/errors';

async function runTests() {
  process.env.DATABASE_URL = process.env.DIRECT_URL;
  console.log("=== STARTING DAY 143 TESTS ===");

  // Setup: Create a temporary test user
  const testUserId = `test-user-${Date.now()}`;
  await prisma.user.create({
    data: {
      id: testUserId,
      email: `${testUserId}@test.com`,
      credits: 20
    }
  });

  const provider = new MockImageProvider();
  let providerCalls = 0;
  
  // Wrap provider to count calls
  const originalGenerate = provider.generate.bind(provider);
  provider.generate = async (request) => {
    providerCalls++;
    return originalGenerate(request);
  };

  // Mock storageService to avoid hitting real Supabase Storage
  const originalUploadAsset = storageService.uploadAsset;
  let simulateStorageFailure = false;
  
  storageService.uploadAsset = async (workflowRunId: string, imageBuffer: Buffer | ArrayBuffer) => {
    if (simulateStorageFailure) {
      throw new StorageError("Simulated storage failure");
    }
    return `workflow-assets/${workflowRunId}_dummy.png`;
  };

  try {
    // 1. MOCK PROVIDER & WORKFLOW SUCCESS
    let result = await workflowOrchestrator.executeImageWorkflow(testUserId, "A beautiful sunset", provider, 1);
    let user = await prisma.user.findUniqueOrThrow({ where: { id: testUserId } });
    let run = await prisma.workflowRun.findUniqueOrThrow({ where: { id: result.runId } });
    
    console.assert(user.credits === 19, `Expected 19 credits, got ${user.credits}`);
    console.assert(run.status === 'SUCCESS', `Expected SUCCESS, got ${run.status}`);
    console.log("✓ Test 1: Workflow Success");

    // 2. PROVIDER FAILURE
    try {
      await workflowOrchestrator.executeImageWorkflow(testUserId, "FAIL_TEST", provider, 2);
    } catch (e: any) {
      user = await prisma.user.findUniqueOrThrow({ where: { id: testUserId } });
      const runs = await prisma.workflowRun.findMany({ where: { userId: testUserId }, orderBy: { createdAt: 'desc' } });
      console.assert(user.credits === 19, `Expected 19 credits (refunded), got ${user.credits}`);
      console.assert(runs[0].status === 'FAILED', `Expected FAILED, got ${runs[0].status}`);
      console.log("✓ Test 2: Provider Failure");
    }

    // 3. INSUFFICIENT CREDITS
    try {
      await workflowOrchestrator.executeImageWorkflow(testUserId, "Too expensive", provider, 100);
    } catch (e: any) {
      user = await prisma.user.findUniqueOrThrow({ where: { id: testUserId } });
      const runs = await prisma.workflowRun.findMany({ where: { userId: testUserId }, orderBy: { createdAt: 'desc' } });
      console.assert(user.credits === 19, `Expected 19 credits (unchanged), got ${user.credits}`);
      console.assert(runs[0].status === 'FAILED', `Expected FAILED, got ${runs[0].status}`);
      console.log("✓ Test 3: Insufficient Credits");
    }

    // 4. STORAGE FAILURE
    simulateStorageFailure = true;
    try {
      await workflowOrchestrator.executeImageWorkflow(testUserId, "A cool dog", provider, 1);
    } catch (e: any) {
      user = await prisma.user.findUniqueOrThrow({ where: { id: testUserId } });
      console.assert(user.credits === 18, `Expected 18 credits (no refund because cost incurred), got ${user.credits}`);
      console.log("✓ Test 4: Storage Failure");
    }
    simulateStorageFailure = false;

    // 5. DOUBLE REFUND PROTECTION (Day 142)
    const runs = await prisma.workflowRun.findMany({ where: { userId: testUserId }, orderBy: { createdAt: 'desc' } });
    const failedProviderRun = runs.find(r => r.prompt === "FAIL_TEST");
    if (failedProviderRun) {
      try {
        const { creditService } = require('./src/services/creditService');
        await creditService.refundCredits(failedProviderRun.id);
      } catch (e: any) {
        console.assert(e.message === 'WorkflowRun has already been refunded');
        console.log("✓ Test 5: Double Refund Protection");
      }
    }

    // 6. IDEMPOTENCY: CONCURRENT DUPLICATE REQUESTS
    const idempotencyKey = `idemp-${Date.now()}`;
    providerCalls = 0;
    const initialCredits = (await prisma.user.findUniqueOrThrow({ where: { id: testUserId } })).credits;
    
    const duplicateResults = await Promise.allSettled([
      workflowOrchestrator.executeImageWorkflow(testUserId, "Concurrent duplicate test", provider, 1, idempotencyKey),
      workflowOrchestrator.executeImageWorkflow(testUserId, "Concurrent duplicate test", provider, 1, idempotencyKey),
      workflowOrchestrator.executeImageWorkflow(testUserId, "Concurrent duplicate test", provider, 1, idempotencyKey)
    ]);
    
    const successes = duplicateResults.filter(r => r.status === 'fulfilled').map(r => (r as any).value);
    
    // All should succeed/return the same run, but only 1 should do actual work
    console.assert(successes.length === 3, "All should successfully return a run");
    const uniqueRunIds = new Set(successes.map(s => s.runId));
    console.assert(uniqueRunIds.size === 1, "All should return the exact same runId");
    
    // Check credits and provider calls
    user = await prisma.user.findUniqueOrThrow({ where: { id: testUserId } });
    console.assert(user.credits === initialCredits - 1, `Credits should be decremented only once`);
    console.assert(providerCalls === 1, `Provider should be called exactly once, got ${providerCalls}`);
    console.log("✓ Test 6: Concurrent Duplicate Requests (Idempotency Key works)");

    // 7. DIFFERENT REQUESTS
    providerCalls = 0;
    const initialCredits2 = user.credits;
    
    const differentResults = await Promise.allSettled([
      workflowOrchestrator.executeImageWorkflow(testUserId, "A red sports car", provider, 1, `key1-${Date.now()}`),
      workflowOrchestrator.executeImageWorkflow(testUserId, "A blue mountain landscape", provider, 1, `key2-${Date.now()}`)
    ]);
    
    console.assert(differentResults.filter(r => r.status === 'fulfilled').length === 2, "Both should succeed");
    
    user = await prisma.user.findUniqueOrThrow({ where: { id: testUserId } });
    console.assert(user.credits === initialCredits2 - 2, `Credits should be decremented twice`);
    console.assert(providerCalls === 2, `Provider should be called twice, got ${providerCalls}`);
    console.log("✓ Test 7: Different Requests execute independently");

  } finally {
    // Cleanup
    storageService.uploadAsset = originalUploadAsset;
    await prisma.user.delete({ where: { id: testUserId } });
    console.log("=== TESTS COMPLETE AND CLEANED UP ===");
  }
}

runTests().catch(console.error);
