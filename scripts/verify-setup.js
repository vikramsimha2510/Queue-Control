#!/usr/bin/env node

/**
 * VenueTrix Setup Verification Script
 * Run this to verify your Supabase configuration is correct
 * 
 * Usage: node scripts/verify-setup.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 VenueTrix Setup Verification\n');

// Check for .env.local file
const envPath = path.join(process.cwd(), '.env.local');
const envExists = fs.existsSync(envPath);

if (!envExists) {
  console.log('❌ .env.local file not found');
  console.log('   Create it by running: cp .env.local.example .env.local');
  console.log('   Then add your Supabase credentials\n');
  process.exit(1);
}

console.log('✅ .env.local file exists');

// Read and parse .env.local
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, ...valueParts] = trimmed.split('=');
    envVars[key] = valueParts.join('=');
  }
});

// Check for required variables
const requiredVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY'
];

let allVarsPresent = true;

requiredVars.forEach(varName => {
  if (!envVars[varName] || envVars[varName].includes('your_')) {
    console.log(`❌ ${varName} is not configured`);
    allVarsPresent = false;
  } else {
    console.log(`✅ ${varName} is configured`);
  }
});

if (!allVarsPresent) {
  console.log('\n⚠️  Please update your .env.local file with actual Supabase credentials');
  console.log('   Get them from: https://app.supabase.com/project/_/settings/api\n');
  process.exit(1);
}

// Validate URL format
const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL'];
if (supabaseUrl && !supabaseUrl.startsWith('https://')) {
  console.log('⚠️  NEXT_PUBLIC_SUPABASE_URL should start with https://');
}

// Check if Supabase client can be imported
try {
  console.log('\n📦 Checking dependencies...');
  require('@supabase/supabase-js');
  console.log('✅ @supabase/supabase-js is installed');
} catch (error) {
  console.log('❌ @supabase/supabase-js is not installed');
  console.log('   Run: npm install\n');
  process.exit(1);
}

// Check for required files
console.log('\n📁 Checking project structure...');

const requiredFiles = [
  'src/lib/supabase/config.ts',
  'src/app/customer/page.tsx',
  'src/app/vendor/page.tsx',
  'supabase-schema.sql'
];

requiredFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} is missing`);
    allVarsPresent = false;
  }
});

if (!allVarsPresent) {
  console.log('\n⚠️  Some required files are missing');
  process.exit(1);
}

console.log('\n✨ Setup verification complete!');
console.log('\n📋 Next steps:');
console.log('   1. Make sure you\'ve run the SQL schema in Supabase');
console.log('   2. Run: npm run dev');
console.log('   3. Visit: http://localhost:3000');
console.log('   4. Test vendor page: http://localhost:3000/vendor');
console.log('   5. Test customer page: http://localhost:3000/customer');
console.log('\n📚 For detailed setup instructions, see SETUP.md\n');
