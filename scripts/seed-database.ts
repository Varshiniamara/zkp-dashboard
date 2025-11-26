/**
 * Database seeding script
 * Generates sample users and dataset for the ZKP Dashboard
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import User from '../backend/src/models/User';
import Proof from '../backend/src/models/Proof';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../backend/.env') });

// Generate sample dataset
function generateSampleUsers(count: number = 100) {
  const countries = ['IN', 'US', 'CA', 'GB', 'AU', 'DE', 'FR', 'JP'];
  const users = [];

  for (let i = 1; i <= count; i++) {
    const age = 18 + Math.floor(Math.random() * 50); // Age 18-68
    const salary = 30000 + Math.floor(Math.random() * 150000); // $30k - $180k
    const creditScore = 400 + Math.floor(Math.random() * 450); // 400-850
    const balance = 1000 + Math.floor(Math.random() * 100000); // $1k - $100k
    const txCount = Math.floor(Math.random() * 100); // 0-100 transactions
    const country = countries[Math.floor(Math.random() * countries.length)];

    users.push({
      user_id: 1000 + i,
      age,
      country,
      salary,
      credit_score: creditScore,
      balance,
      tx_count: txCount,
    });
  }

  return users;
}

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Connect to MongoDB
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/zkp-dashboard';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data (optional - comment out to keep existing data)
    // await User.deleteMany({});
    // await Proof.deleteMany({});
    // console.log('🧹 Cleared existing data');

    // Create demo user
    const demoUserEmail = 'demo@zkpdashboard.com';
    let demoUser = await User.findOne({ email: demoUserEmail });

    if (!demoUser) {
      demoUser = await User.create({
        username: 'demo',
        email: demoUserEmail,
        password: 'demo123456', // Will be hashed automatically
        role: 'user',
      });
      console.log('✅ Created demo user:', demoUserEmail, '/ demo123456');
    } else {
      console.log('ℹ️  Demo user already exists:', demoUserEmail);
    }

    // Create admin user
    const adminEmail = 'admin@zkpdashboard.com';
    let adminUser = await User.findOne({ email: adminEmail });

    if (!adminUser) {
      adminUser = await User.create({
        username: 'admin',
        email: adminEmail,
        password: 'admin123456',
        role: 'admin',
      });
      console.log('✅ Created admin user:', adminEmail, '/ admin123456');
    } else {
      console.log('ℹ️  Admin user already exists:', adminEmail);
    }

    // Generate and save sample dataset
    const sampleUsers = generateSampleUsers(100);
    const dataDir = path.join(__dirname, '../data/test/data');
    
    // Ensure directory exists
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Save dataset to JSON file
    const datasetPath = path.join(dataDir, 'users.json');
    fs.writeFileSync(datasetPath, JSON.stringify(sampleUsers, null, 2));
    console.log(`✅ Generated ${sampleUsers.length} sample users in dataset`);

    console.log('');
    console.log('🎉 Database seeding completed successfully!');
    console.log('');
    console.log('📊 Summary:');
    console.log(`   - Users in database: ${await User.countDocuments()}`);
    console.log(`   - Proofs in database: ${await Proof.countDocuments()}`);
    console.log(`   - Sample dataset: ${sampleUsers.length} entries`);
    console.log('');
    console.log('🔐 Demo credentials:');
    console.log(`   - Email: ${demoUserEmail}`);
    console.log(`   - Password: demo123456`);
    console.log(`   - Admin Email: ${adminEmail}`);
    console.log(`   - Admin Password: admin123456`);

    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run seeding
seedDatabase();

