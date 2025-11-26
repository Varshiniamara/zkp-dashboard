const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  circuits: [
    'simple_credit',
    'credit_score'  // Added our credit score circuit
  ],
  buildDir: path.join(__dirname, '../build/circuits'),
  powersOfTau: {
    url: 'https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_10.ptau',
    localPath: path.join(__dirname, '../build/circuits/powersOfTau28_hez_final_10.ptau'),
    size: 10  // 2^10 = 1024 constraints (smaller for faster setup)
  },
  testInputs: {
    credit_score: {
      minScore: 700,   // Public input
      creditScore: 750 // Private input
    }
  }
};

// Ensure build directory exists
if (!fs.existsSync(CONFIG.buildDir)) {
  fs.mkdirSync(CONFIG.buildDir, { recursive: true });
}

// Run a command with better error handling
function runCommand(command, options = {}) {
  try {
    console.log(`$ ${command}`);
    return execSync(command, { stdio: 'inherit', ...options });
  } catch (error) {
    console.error(`❌ Command failed: ${command}`);
    throw error;
  }
}

// Download powers of tau file if it doesn't exist
// Generate powers of tau file locally
async function setupPowersOfTau() {
  if (!fs.existsSync(CONFIG.powersOfTau.localPath)) {
    console.log('\n⚙️  Generating powers of tau file locally...');
    const ptau0 = path.join(CONFIG.buildDir, 'pot10_0000.ptau');
    const ptau1 = path.join(CONFIG.buildDir, 'pot10_0001.ptau');

    // 1. Start a new powers of tau ceremony
    runCommand(`npx snarkjs powersoftau new bn128 ${CONFIG.powersOfTau.size} ${ptau0}`);

    // 2. Contribute to the ceremony
    runCommand(`npx snarkjs powersoftau contribute ${ptau0} ${ptau1} --name="First contribution" -v`);

    // 3. Prepare for phase 2
    runCommand(`npx snarkjs powersoftau prepare phase2 ${ptau1} ${CONFIG.powersOfTau.localPath} -v`);

    // Cleanup intermediate files
    if (fs.existsSync(ptau0)) fs.unlinkSync(ptau0);
    if (fs.existsSync(ptau1)) fs.unlinkSync(ptau1);

    console.log('✅ Powers of tau generated successfully');
  } else {
    console.log('\nℹ️  Using existing powers of tau file');
  }
}

// Compile a single circuit
async function compileCircuit(circuitName) {
  console.log(`\n🔧 Compiling ${circuitName} circuit...`);

  const circuitPath = path.join(__dirname, `../circuits/snark/${circuitName}.circom`);
  const outputPath = path.join(CONFIG.buildDir, circuitName);

  try {
    // Compile the circuit
    runCommand(`npx circom ${circuitPath} --r1cs --wasm --sym -o ${CONFIG.buildDir}`);

    // Paths for generated files
    const wasmPath = path.join(CONFIG.buildDir, `${circuitName}_js`, `${circuitName}.wasm`);
    const r1csPath = path.join(CONFIG.buildDir, `${circuitName}.r1cs`);
    const zkeyPath = path.join(CONFIG.buildDir, `${circuitName}.zkey`);

    // Generate zkey (trusted setup)
    runCommand(`npx snarkjs groth16 setup ${r1csPath} ${CONFIG.powersOfTau.localPath} ${zkeyPath}`);

    // Export verification key
    const vkeyPath = path.join(CONFIG.buildDir, `${circuitName}_verification_key.json`);
    runCommand(`npx snarkjs zkey export verificationkey ${zkeyPath} ${vkeyPath}`);

    // Generate a sample proof if test inputs are provided
    if (CONFIG.testInputs[circuitName]) {
      await generateSampleProof(circuitName, CONFIG.testInputs[circuitName]);
    }

    console.log(`✅ Successfully compiled and tested ${circuitName}`);
    return { wasmPath, zkeyPath, vkeyPath };

  } catch (error) {
    console.error(`❌ Error compiling ${circuitName}:`, error.message);
    throw error;
  }
}

// Generate a sample proof for testing
async function generateSampleProof(circuitName, input) {
  console.log(`\n🔍 Generating sample proof for ${circuitName}...`);

  const inputPath = path.join(CONFIG.buildDir, `${circuitName}_input.json`);
  const witnessPath = path.join(CONFIG.buildDir, `${circuitName}_witness.wtns`);
  const proofPath = path.join(CONFIG.buildDir, `${circuitName}_proof.json`);
  const publicPath = path.join(CONFIG.buildDir, `${circuitName}_public.json`);
  const wasmPath = path.join(CONFIG.buildDir, `${circuitName}_js`, `${circuitName}.wasm`);
  const zkeyPath = path.join(CONFIG.buildDir, `${circuitName}.zkey`);

  // Write input to file
  fs.writeFileSync(inputPath, JSON.stringify(input, null, 2));
  console.log(`📝 Input written to: ${inputPath}`);

  // Generate witness
  runCommand(`node ${CONFIG.buildDir}/${circuitName}_js/generate_witness.js ${wasmPath} ${inputPath} ${witnessPath}`);

  // Generate proof
  runCommand(`npx snarkjs groth16 prove ${zkeyPath} ${witnessPath} ${proofPath} ${publicPath}`);

  // Verify proof
  const vkeyPath = path.join(CONFIG.buildDir, `${circuitName}_verification_key.json`);
  runCommand(`npx snarkjs groth16 verify ${vkeyPath} ${publicPath} ${proofPath}`);

  console.log(`✅ Sample proof generated and verified for ${circuitName}`);
}

// Main function
async function main() {
  try {
    console.log('🚀 Starting ZKP Circuit Compilation');
    console.log('='.repeat(50));

    // Setup environment
    await setupPowersOfTau();

    // Compile all circuits
    for (const circuit of CONFIG.circuits) {
      console.log('\n' + '='.repeat(50));
      await compileCircuit(circuit);
    }

    console.log('\n' + '='.repeat(50));
    console.log('\n🎉 All circuits compiled successfully!');
    console.log('\nNext steps:');
    console.log('1. Check the build/circuits directory for generated files');
    console.log('2. Deploy the verifier contract to your blockchain');
    console.log('3. Use the generated proof in your application');

  } catch (error) {
    console.error('\n❌ Compilation failed:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('1. Make sure you have circom and snarkjs installed:');
    console.log('   npm install -g circom snarkjs');
    console.log('2. Ensure you have a C++ build environment (for circom)');
    console.log('3. Check circuit files for syntax errors');
    process.exit(1);
  }
}

// Run the main function
main().catch(console.error);
