import 'dotenv/config';
import { creditService } from './src/services/creditService';
import { workflowRunService } from './src/services/workflowRunService';
import prisma from './src/lib/prisma';

async function runTests() {
  process.env.DATABASE_URL = process.env.DIRECT_URL;
  console.log("=== STARTING DAY 142 TESTS ===");

  // Setup: Create a temporary test user
  const testUserId = `test-user-${Date.now()}`;
  await prisma.user.create({
    data: {
      id: testUserId,
      email: `${testUserId}@test.com`,
      // Default credits should be 25
    }
  });

  try {
    // 1. Default user credits = 25
    let user = await prisma.user.findUniqueOrThrow({ where: { id: testUserId } });
    console.assert(user.credits === 25, `Expected 25 credits, got ${user.credits}`);
    console.log("✓ Test 1: Default user credits = 25");

    // 2. Reserve 5 from 25 -> 20
    await creditService.reserveCredits(testUserId, 5);
    user = await prisma.user.findUniqueOrThrow({ where: { id: testUserId } });
    console.assert(user.credits === 20, `Expected 20 credits, got ${user.credits}`);
    console.log("✓ Test 2: Reserve 5 from 25 -> 20");

    // 3. Reserve 5 from 20 -> 15
    await creditService.reserveCredits(testUserId, 5);
    user = await prisma.user.findUniqueOrThrow({ where: { id: testUserId } });
    console.assert(user.credits === 15, `Expected 15 credits, got ${user.credits}`);
    console.log("✓ Test 3: Reserve 5 from 20 -> 15");

    // Let's set credits to 3 for the next test
    await prisma.user.update({ where: { id: testUserId }, data: { credits: 3 } });

    // 4. Attempt reserve when balance < 5 -> rejected, balance unchanged
    try {
      await creditService.reserveCredits(testUserId, 5);
      console.error("✗ Test 4 Failed: Expected reserve to throw error");
    } catch (e: any) {
      user = await prisma.user.findUniqueOrThrow({ where: { id: testUserId } });
      console.assert(user.credits === 3, `Expected 3 credits, got ${user.credits}`);
      console.assert(e.name === 'InsufficientCreditsError', `Expected InsufficientCreditsError, got ${e.name}`);
      console.log("✓ Test 4: Attempt reserve when balance < 5 -> rejected, balance unchanged");
    }

    // 5. Refund 5 -> balance restored
    // (Need a WorkflowRun for refund now)
    let runForRefund = await workflowRunService.createPendingRun(testUserId, "Refund prompt", 5);
    await workflowRunService.markFailed(runForRefund.id, "Testing refund");
    await creditService.refundCredits(runForRefund.id);
    user = await prisma.user.findUniqueOrThrow({ where: { id: testUserId } });
    console.assert(user.credits === 8, `Expected 8 credits, got ${user.credits}`);
    console.log("✓ Test 5: Refund 5 -> balance restored");

    // 5b. Double-refund protection test
    try {
      await creditService.refundCredits(runForRefund.id);
      console.error("✗ Test 5b Failed: Expected double-refund to throw error");
    } catch (e: any) {
      user = await prisma.user.findUniqueOrThrow({ where: { id: testUserId } });
      console.assert(user.credits === 8, `Expected 8 credits remaining, got ${user.credits}`);
      console.assert(e.message === 'WorkflowRun has already been refunded', `Expected 'WorkflowRun has already been refunded', got ${e.message}`);
      console.log("✓ Test 5b: Attempt to refund the exact same WorkflowRun again does not increase user credits");
    }

    // 5c. Concurrent double-refund protection test
    let concurrentRun = await workflowRunService.createPendingRun(testUserId, "Concurrent refund test", 5);
    await workflowRunService.markFailed(concurrentRun.id, "Testing concurrent refund");
    const concurrentRefunds = [
      creditService.refundCredits(concurrentRun.id),
      creditService.refundCredits(concurrentRun.id),
      creditService.refundCredits(concurrentRun.id),
    ];
    let concurrentSuccesses = 0;
    let concurrentFailures = 0;
    const concurrentResults = await Promise.allSettled(concurrentRefunds);
    concurrentResults.forEach(r => {
      if (r.status === 'fulfilled') concurrentSuccesses++;
      else concurrentFailures++;
    });
    
    user = await prisma.user.findUniqueOrThrow({ where: { id: testUserId } });
    console.assert(concurrentSuccesses === 1, `Expected 1 success, got ${concurrentSuccesses}`);
    console.assert(concurrentFailures === 2, `Expected 2 failures, got ${concurrentFailures}`);
    console.assert(user.credits === 13, `Expected 13 credits, got ${user.credits}`); // 8 + 5
    console.log("✓ Test 5c: Concurrent double-refund protection prevents multiple refunds");


    // 6. Concurrent reservations cannot create negative balance
    await prisma.user.update({ where: { id: testUserId }, data: { credits: 7 } });
    const promises = [
      creditService.reserveCredits(testUserId, 5), // Should succeed
      creditService.reserveCredits(testUserId, 5), // Should fail
      creditService.reserveCredits(testUserId, 5), // Should fail
    ];
    
    let successes = 0;
    let failures = 0;
    
    const results = await Promise.allSettled(promises);
    results.forEach(r => {
      if (r.status === 'fulfilled') successes++;
      else failures++;
    });
    
    user = await prisma.user.findUniqueOrThrow({ where: { id: testUserId } });
    console.assert(successes === 1, `Expected 1 success, got ${successes}`);
    console.assert(failures === 2, `Expected 2 failures, got ${failures}`);
    console.assert(user.credits === 2, `Expected 2 credits remaining, got ${user.credits}`);
    console.log("✓ Test 6: Concurrent reservations cannot create negative balance");

    // 7. WorkflowRun PENDING creation
    let run = await workflowRunService.createPendingRun(testUserId, "A cool test prompt", 5);
    console.assert(run.status === 'PENDING', `Expected PENDING, got ${run.status}`);
    console.assert(run.prompt === "A cool test prompt", `Expected "A cool test prompt", got ${run.prompt}`);
    console.assert(run.creditsUsed === 5, `Expected 5 credits, got ${run.creditsUsed}`);
    console.log("✓ Test 7: WorkflowRun PENDING creation");

    // 8. WorkflowRun SUCCESS update
    run = await workflowRunService.markSuccess(run.id, "https://example.com/asset.png");
    console.assert(run.status === 'SUCCESS', `Expected SUCCESS, got ${run.status}`);
    console.assert(run.assetUrl === "https://example.com/asset.png", `Expected url, got ${run.assetUrl}`);
    console.log("✓ Test 8: WorkflowRun SUCCESS update");

    // 9. WorkflowRun FAILED update
    let run2 = await workflowRunService.createPendingRun(testUserId, "Another prompt", 5);
    run2 = await workflowRunService.markFailed(run2.id, "Safety filter triggered");
    console.assert(run2.status === 'FAILED', `Expected FAILED, got ${run2.status}`);
    console.assert(run2.errorDetails === "Safety filter triggered", `Expected error detail, got ${run2.errorDetails}`);
    console.log("✓ Test 9: WorkflowRun FAILED update");

    // 10. User ownership relation
    const runsForUser = await prisma.workflowRun.findMany({ where: { userId: testUserId } });
    console.assert(runsForUser.length === 4, `Expected 4 runs, got ${runsForUser.length}`);
    const fetchedUser = await prisma.user.findUnique({
      where: { id: testUserId },
      include: { workflowRuns: true }
    });
    console.assert(fetchedUser!.workflowRuns.length === 4, "Relation not working");
    console.log("✓ Test 10: User ownership relation works");

  } finally {
    // Cleanup
    await prisma.user.delete({ where: { id: testUserId } });
    console.log("=== TESTS COMPLETE AND CLEANED UP ===");
  }
}

runTests().catch(console.error);
