import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (supabaseUrl && supabaseKey) {
  const supabase = createClient(supabaseUrl, supabaseKey);
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = 'TestPassword123!';

  async function testFlow() {
    console.log(`--- SIGNUP ---`);
    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
    });
    
    if (signupError) {
      console.log("Signup Error:", signupError.status, signupError.message);
      return;
    }
    
    console.log("Signup Success.");
    console.log("User Data:", JSON.stringify(signupData.user, null, 2));

    console.log(`\n--- LOGIN ---`);
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    });

    if (loginError) {
      console.log("Login Error Status:", loginError.status);
      console.log("Login Error Message:", loginError.message);
      console.log("Login Error Code:", loginError.code);
      console.log("Login Error Name:", loginError.name);
    } else {
      console.log("Login Success.");
    }
  }

  testFlow();
} else {
  console.log("Missing env variables");
}
