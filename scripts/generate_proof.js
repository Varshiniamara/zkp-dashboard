const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Generates a zero-knowledge proof for the credit profile verification
 * @param {string} circuitName - Name of the circuit
 * @param {Object} input - Input values for the circuit
 * @returns {Promise<Object>} - Generated proof and public signals
 */
async function generateProof(circuitName, input) {
  console.log(`\n🔍 Generating proof for ${circuitName}...`);
  
  const buildDir = path.join(__dirname, '../build/circuits');
  const circuitDir = path.join(buildDir, `${circuitName}_js`);
  const inputPath = path.join(buildDir, `${circuitName}_input.json`);
  const wasmPath = path.join(circuitDir, `${circuitName}.wasm`);
  const zkeyPath = path.join(buildDir, `${circuitName}.zkey`);
  const proofPath = path.join(buildDir, `${circuitName}_proof.json`);
  const publicPath = path.join(buildDir, `${circuitName}_public.json`);
  const witnessPath = path.join(buildDir, 'witness.wtns');
  
  try {
    // Ensure directories exist
    if (!fs.existsSync(buildDir)) {
      fs.mkdirSync(buildDir, { recursive: true });
    }
    
    // Format input according to circuit requirements
    const circuitInput = {
      // Private inputs
      creditScore: input.creditScore,
      salary: input.salary,
      balance: input.balance,
      
      // Public inputs (verification parameters)
      minCreditScore: input.minCreditScore,
      minSalary: input.minSalary,
      minBalance: input.minBalance
    };
    
    // Save input to a file
    console.log('💾 Saving input parameters...');
    fs.writeFileSync(inputPath, JSON.stringify(circuitInput, null, 2));
    
    // Generate witness
    console.log('🔨 Generating witness...');
    const generateWitnessPath = path.join(circuitDir, 'generate_witness.js');
    
    if (!fs.existsSync(generateWitnessPath)) {
      throw new Error(`❌ generate_witness.js not found at ${generateWitnessPath}. Please compile the circuit first.`);
    }
    
    // Execute witness generation
    execSync(`node ${generateWitnessPath} ${wasmPath} ${inputPath} ${witnessPath}`, { 
      stdio: 'inherit' 
    });
    
    // Generate proof using Groth16
    console.log('🔐 Generating zk-SNARK proof (Groth16)...');
    execSync(
      `npx snarkjs groth16 prove ${zkeyPath} ${witnessPath} ${proofPath} ${publicPath}`, 
      { stdio: 'inherit' }
    );
    
    // Verify the generated proof
    console.log('✅ Verifying proof...');
    const vkeyPath = path.join(buildDir, `${circuitName}_verification_key.json`);
    
    if (!fs.existsSync(vkeyPath)) {
      throw new Error(`❌ Verification key not found at ${vkeyPath}`);
    }
    
    const verificationOutput = execSync(
      `npx snarkjs groth16 verify ${vkeyPath} ${publicPath} ${proofPath}`, 
      { stdio: 'pipe' }
    ).toString();
    
    console.log('\n🔗 Verification Result:');
    console.log(verificationOutput);
    
    // Read and return the generated proof and public signals
    const proof = JSON.parse(fs.readFileSync(proofPath));
    const publicSignals = JSON.parse(fs.readFileSync(publicPath));
    
    return {
      proof,
      publicSignals,
      verification: verificationOutput.includes('OK') ? '✅ Verified' : '❌ Verification failed'
    };
    
  } catch (error) {
    console.error('\n❌ Error in proof generation:', error.message);
    if (error.stderr) {
      console.error('Error details:', error.stderr.toString());
    }
    throw error;
  }
}

// Example usage (can be imported as a module)
if (require.main === module) {
  (async () => {
    const circuitName = 'credit_score';
    
    // Example input for testing
    const input = {
      // Private inputs (known only to prover)
      creditScore: 750,    // Actual credit score
      salary: 72000,       // Annual salary in USD
      balance: 87000,      // Account balance in USD
      
      // Public inputs (known to verifier)
      minCreditScore: 700,  // Minimum required credit score
      minSalary: 50000,     // Minimum required salary
      minBalance: 10000     // Minimum required balance
    };
    
    try {
      console.log('🚀 Starting proof generation with test data...');
      const result = await generateProof(circuitName, input);
      console.log('\n🎉 Proof generation completed successfully!');
    } catch (error) {
      console.error('\n❌ Failed to generate proof:', error.message);
      process.exit(1);
    }
  })();
}

module.exports = { generateProof };
