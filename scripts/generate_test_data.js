const fs = require('fs');
const path = require('path');

// Simple random number generator
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate synthetic user data without external dependencies
function generateUserData(count = 100) {
  const users = [];
  const countries = ['IN', 'US', 'CA', 'UK', 'AU'];
  const firstNames = ['John', 'Jane', 'Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];
  
  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const age = randomInt(18, 90);
    const country = countries[Math.floor(Math.random() * countries.length)];
    const creditScore = randomInt(300, 850);
    const salary = Math.round(randomInt(20000, 200000) / 1000) * 1000;
    const balance = Math.round(randomInt(0, 500000) / 100) * 100;
    const txCount = randomInt(1, 1000);
    
    users.push({
      user_id: 1000 + i,
      name: `${firstName} ${lastName}`,
      age,
      country,
      credit_score: creditScore,
      salary,
      balance,
      tx_count: txCount,
      eligible_for_loan: creditScore >= 700 && age >= 18 && ['IN', 'US', 'CA'].includes(country)
    });
  }
  
  return users;
}

// Create test directory if it doesn't exist
const testDataDir = path.join(__dirname, '../test/data');
if (!fs.existsSync(testDataDir)) {
  fs.mkdirSync(testDataDir, { recursive: true });
}

// Generate and save test data
const users = generateUserData(100);
const outputPath = path.join(testDataDir, 'users.json');
fs.writeFileSync(outputPath, JSON.stringify(users, null, 2));

console.log(`✅ Successfully generated ${users.length} test users at ${outputPath}`);
console.log('Sample user:', JSON.stringify(users[0], null, 2));
