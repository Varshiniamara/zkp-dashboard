const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m'
};

// Print section header
function printHeader(title) {
  console.log(`\n${colors.cyan}╔${'═'.repeat(title.length + 2)}╗`);
  console.log(`║ ${title} ║`);
  console.log(`╚${'═'.repeat(title.length + 2)}╝${colors.reset}`);
}

// Run a command with error handling
function runCommand(command, description) {
  console.log(`\n${colors.yellow}▶ ${description}...${colors.reset}`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`${colors.green}✓ ${description} completed successfully${colors.reset}`);
    return true;
  } catch (error) {
    console.error(`${colors.red}✗ Error during ${description.toLowerCase()}: ${error.message}${colors.reset}`);
    return false;
  }
}

// Main function
async function main() {
  console.clear();
  console.log(`${colors.cyan}🚀 Starting ZKP Framework Setup${colors.reset}\n`);

  // 1. Generate test data
  printHeader('1. GENERATING TEST DATA');
  if (!runCommand('node scripts/generate_test_data.js', 'Generating test user data')) {
    process.exit(1);
  }

  // 2. Install circuit dependencies
  printHeader('2. INSTALLING CIRCUIT DEPENDENCIES');
  if (!runCommand('npm install -g circom', 'Installing Circom (may require sudo)')) {
    console.log(`${colors.yellow}Continuing with local installation...${colors.reset}`);
  }

  // 3. Compile circuits
  printHeader('3. COMPILING CIRCUITS');
  if (!runCommand('node scripts/compile_circuits.js', 'Compiling zk-SNARK circuits')) {
    process.exit(1);
  }

  // 4. Generate and verify proofs
  printHeader('4. GENERATING AND VERIFYING PROOFS');
  if (!runCommand('node scripts/generate_proof.js', 'Generating zk-SNARK proofs')) {
    process.exit(1);
  }

  console.log(`\n${colors.green}🎉 ZKP Framework is ready!${colors.reset}`);
  console.log('\nNext steps:');
  console.log(`1. Check the ${colors.cyan}test/data/users.json${colors.reset} for generated test data`);
  console.log(`2. Review compiled circuits in ${colors.cyan}build/circuits/${colors.reset}`);
  console.log(`3. Run ${colors.cyan}node scripts/generate_proof.js${colors.reset} to test different inputs`);
  console.log(`4. Review ${colors.cyan}backend/src/routes/zkp.routes.ts${colors.reset} and ${colors.cyan}lib/api-client.ts${colors.reset} to see how the frontend talks to the backend`);
}

// Run the main function
main().catch(console.error);
