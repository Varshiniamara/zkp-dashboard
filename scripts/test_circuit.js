const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

async function testCircuit() {
  const circuitName = 'simple_credit';
  const buildDir = path.join(__dirname, '../build/circuits');
  
  // Test input for simple credit check
  const input = {
    // Private input (known only to prover)
    creditScore: 750,
    
    // Public input (known to verifier)
    minScore: 700
  };

  try {
    console.log('🚀 Starting ZKP Test for Simple Credit Check...');
    
    // 1. Compile the circuit
    console.log('\n🔧 Step 1: Compiling circuit...');
    execSync(`node scripts/compile_circuits.js`, { stdio: 'inherit' });
    
    // 2. Generate witness
    console.log('\n🔍 Step 2: Generating witness...');
    const wasmPath = path.join(buildDir, `${circuitName}_js`, `${circuitName}.wasm`);
    const inputPath = path.join(buildDir, `${circuitName}_input.json`);
    const witnessPath = path.join(buildDir, `${circuitName}_witness.wtns`);
    
    // Save input to file
    fs.writeFileSync(inputPath, JSON.stringify(input, null, 2));
    
    // Generate witness
    execSync(`node ${path.join(buildDir, `${circuitName}_js`, 'generate_witness.js')} \
      ${wasmPath} \
      ${inputPath} \
      ${witnessPath}`, { stdio: 'inherit' });
    
    // 3. Generate proof
    console.log('\n🔑 Step 3: Generating proof...');
    const zkeyPath = path.join(buildDir, `${circuitName}.zkey`);
    const proofPath = path.join(buildDir, `${circuitName}_proof.json`);
    const publicPath = path.join(buildDir, `${circuitName}_public.json`);
    
    execSync(`npx snarkjs groth16 prove \
      ${zkeyPath} \
      ${witnessPath} \
      ${proofPath} \
      ${publicPath}`, { stdio: 'inherit' });
    
    // 4. Verify proof
    console.log('\n🔎 Step 4: Verifying proof...');
    const vkeyPath = path.join(buildDir, `${circuitName}_verification_key.json`);
    
    execSync(`npx snarkjs groth16 verify \
      ${vkeyPath} \
      ${publicPath} \
      ${proofPath}`, { stdio: 'inherit' });
    
    // 5. Display results
    console.log('\n✅ Test completed successfully!');
    console.log('\n📊 Input Values:');
    console.log(`- Credit Score: ${input.creditScore} (Min: ${input.minScore})`);
    
    const proof = JSON.parse(fs.readFileSync(proofPath));
    const publicSignals = JSON.parse(fs.readFileSync(publicPath));
    
    console.log('\n🔑 Proof generated successfully!');
    console.log('\n📝 Public Signals (on-chain):', JSON.stringify(publicSignals, null, 2));
    console.log('\n✅ Proof verified successfully!');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run the test
testCircuit().catch(console.error);
