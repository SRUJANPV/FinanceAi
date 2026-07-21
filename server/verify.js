import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

dotenv.config({ path: join(dirname(fileURLToPath(import.meta.url)), '.env') });

import { User } from './src/models/User.js';
import { Transaction } from './src/models/Transaction.js';

const mongoUri = process.env.MONGODB_URI;

async function verify() {
  try {
    await mongoose.connect(mongoUri);
    
    // Find test user
    const user = await User.findOne({ email: 'test@example.com' });
    if (!user) {
      console.log('❌ User not found!');
      process.exit(1);
    }
    
    console.log('✅ User found:', user.email);
    console.log('   ID:', user._id);
    
    // Find transactions for this user
    const transactions = await Transaction.find({ user: user._id });
    console.log(`✅ Transactions: ${transactions.length} found`);
    
    if (transactions.length > 0) {
      console.log('\nSample transactions:');
      transactions.slice(0, 3).forEach(t => {
        console.log(`   - ${t.type.toUpperCase()}: ₹${t.amount} (${t.category})`);
      });
    }
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

verify();
