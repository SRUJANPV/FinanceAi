import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

dotenv.config({ path: join(dirname(fileURLToPath(import.meta.url)), '.env') });

import { User } from './src/models/User.js';
import { Transaction } from './src/models/Transaction.js';
import { Budget } from './src/models/Budget.js';
import { Wallet } from './src/models/Wallet.js';
import { Goal } from './src/models/Goal.js';
import { Loan } from './src/models/Loan.js';
import { Bill } from './src/models/Bill.js';
import { Notification } from './src/models/Notification.js';

const mongoUri = process.env.MONGODB_URI;

async function seed() {
  try {
    console.log('🌱 Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected!');

    // Clear existing test data
    console.log('🗑️  Clearing existing test data...');
    await Promise.all([
      User.deleteOne({ email: 'test@example.com' }),
      Transaction.deleteMany({ userEmail: 'test@example.com' }),
      Budget.deleteMany({ userEmail: 'test@example.com' }),
      Wallet.deleteMany({ userEmail: 'test@example.com' }),
      Goal.deleteMany({ userEmail: 'test@example.com' }),
      Loan.deleteMany({ userEmail: 'test@example.com' }),
      Bill.deleteMany({ userEmail: 'test@example.com' }),
      Notification.deleteMany({ userEmail: 'test@example.com' }),
    ]);

    // Create test user
    console.log('👤 Creating test user...');
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'Test123456',
      isVerified: true,
      currency: 'INR',
      timezone: 'Asia/Kolkata',
    });
    console.log(`✅ User created: ${user.email}`);

    const now = new Date();
    const thisMonth = now.toISOString().slice(0, 7);
    const userId = user._id;

    // Create transactions (5 expenses, 2 income)
    console.log('💰 Creating transactions...');
    const transactions = await Transaction.create([
      {
        user: userId,
        type: 'income',
        amount: 125000,
        category: 'Salary',
        paymentMethod: 'bank',
        date: new Date(now.getFullYear(), now.getMonth(), 1),
        description: 'Monthly salary',
      },
      {
        user: userId,
        type: 'expense',
        amount: 2500,
        category: 'Food & dining',
        paymentMethod: 'card',
        date: new Date(now.getFullYear(), now.getMonth(), 5),
        description: 'Restaurant dinner',
      },
      {
        user: userId,
        type: 'expense',
        amount: 1200,
        category: 'Groceries',
        paymentMethod: 'cash',
        date: new Date(now.getFullYear(), now.getMonth(), 6),
        description: 'Weekly groceries',
      },
      {
        user: userId,
        type: 'expense',
        amount: 3500,
        category: 'Shopping',
        paymentMethod: 'card',
        date: new Date(now.getFullYear(), now.getMonth(), 8),
        description: 'Clothes shopping',
      },
      {
        user: userId,
        type: 'expense',
        amount: 2800,
        category: 'Utilities',
        paymentMethod: 'bank',
        date: new Date(now.getFullYear(), now.getMonth(), 10),
        description: 'Electricity & water bill',
      },
      {
        user: userId,
        type: 'expense',
        amount: 1500,
        category: 'Entertainment',
        paymentMethod: 'upi',
        date: new Date(now.getFullYear(), now.getMonth(), 12),
        description: 'Movie tickets & snacks',
      },
      {
        user: userId,
        type: 'expense',
        amount: 899,
        category: 'Transport',
        paymentMethod: 'upi',
        date: new Date(now.getFullYear(), now.getMonth(), 14),
        description: 'Uber & auto rides',
      },
      {
        user: userId,
        type: 'income',
        amount: 15000,
        category: 'Freelance',
        paymentMethod: 'bank',
        date: new Date(now.getFullYear(), now.getMonth(), 15),
        description: 'Freelance project payment',
      },
    ]);
    console.log(`✅ Created ${transactions.length} transactions`);

    // Create budgets
    console.log('📊 Creating budgets...');
    const budgets = await Budget.create([
      {
        user: userId,
        category: 'Food & dining',
        limit: 8000,
        month: thisMonth,
        alertThreshold: 80,
      },
      {
        user: userId,
        category: 'Shopping',
        limit: 10000,
        month: thisMonth,
        alertThreshold: 80,
      },
      {
        user: userId,
        category: 'Entertainment',
        limit: 5000,
        month: thisMonth,
        alertThreshold: 80,
      },
      {
        user: userId,
        category: 'Transport',
        limit: 3000,
        month: thisMonth,
        alertThreshold: 80,
      },
      {
        user: userId,
        category: 'Utilities',
        limit: 4000,
        month: thisMonth,
        alertThreshold: 80,
      },
    ]);
    console.log(`✅ Created ${budgets.length} budgets`);

    // Create wallets
    console.log('🏦 Creating wallets...');
    const wallets = await Wallet.create([
      {
        user: userId,
        name: 'Savings Account',
        balance: 250000,
        institution: 'HDFC Bank',
      },
      {
        user: userId,
        name: 'Credit Card',
        balance: -15000,
        institution: 'ICICI Bank',
      },
      {
        user: userId,
        name: 'Cash in hand',
        balance: 5000,
        institution: 'Personal',
      },
    ]);
    console.log(`✅ Created ${wallets.length} wallets`);

    // Create goals
    console.log('🎯 Creating savings goals...');
    const goals = await Goal.create([
      {
        user: userId,
        name: 'Emergency Fund',
        targetAmount: 300000,
        currentAmount: 180000,
        deadline: new Date(now.getFullYear() + 1, 11, 31),
        description: '6 months of expenses',
      },
      {
        user: userId,
        name: 'Vacation to Thailand',
        targetAmount: 500000,
        currentAmount: 150000,
        deadline: new Date(now.getFullYear(), now.getMonth() + 8, 30),
        description: 'Beach vacation with family',
      },
      {
        user: userId,
        name: 'New Laptop',
        targetAmount: 120000,
        currentAmount: 85000,
        deadline: new Date(now.getFullYear(), now.getMonth() + 3, 30),
        description: 'MacBook Pro 16-inch',
      },
      {
        user: userId,
        name: 'Car Down Payment',
        targetAmount: 500000,
        currentAmount: 250000,
        deadline: new Date(now.getFullYear() + 1, now.getMonth(), 31),
        description: 'For new car purchase',
      },
    ]);
    console.log(`✅ Created ${goals.length} savings goals`);

    // Create loans
    console.log('💳 Creating loans...');
    const loans = await Loan.create([
      {
        user: userId,
        name: 'Car Loan',
        principal: 500000,
        outstanding: 350000,
        emiAmount: 12000,
        tenure: 48,
        interestRate: 8.5,
        startDate: new Date(2024, 0, 15),
      },
      {
        user: userId,
        name: 'Personal Loan',
        principal: 200000,
        outstanding: 120000,
        emiAmount: 5000,
        tenure: 48,
        interestRate: 12.0,
        startDate: new Date(2024, 3, 1),
      },
    ]);
    console.log(`✅ Created ${loans.length} loans`);

    // Create bills
    console.log('📋 Creating bills...');
    const bills = await Bill.create([
      {
        user: userId,
        name: 'Internet Bill',
        amount: 999,
        dueDate: new Date(now.getFullYear(), now.getMonth(), 25),
        frequency: 'monthly',
        category: 'Utilities',
        reminderDays: 3,
        active: true,
      },
      {
        user: userId,
        name: 'Insurance',
        amount: 5000,
        dueDate: new Date(now.getFullYear(), now.getMonth() + 1, 1),
        frequency: 'monthly',
        category: 'Insurance',
        reminderDays: 5,
        active: true,
      },
      {
        user: userId,
        name: 'Gym Membership',
        amount: 500,
        dueDate: new Date(now.getFullYear(), now.getMonth(), 20),
        frequency: 'monthly',
        category: 'Entertainment',
        reminderDays: 2,
        active: true,
      },
    ]);
    console.log(`✅ Created ${bills.length} bills`);

    // Create notifications
    console.log('🔔 Creating notifications...');
    const notifications = await Notification.create([
      {
        user: userId,
        type: 'budget',
        title: 'Budget Alert',
        message: 'You have reached 85% of your Food budget',
        readAt: null,
      },
      {
        user: userId,
        type: 'goal',
        title: 'Goal Progress',
        message: 'Great! You are 60% towards your emergency fund',
        readAt: null,
      },
      {
        user: userId,
        type: 'bill',
        title: 'Bill Due Soon',
        message: 'Your internet bill is due on 25th July',
        readAt: null,
      },
    ]);
    console.log(`✅ Created ${notifications.length} notifications`);

    console.log('\n' + '='.repeat(60));
    console.log('✨ SEED COMPLETED SUCCESSFULLY! ✨');
    console.log('='.repeat(60));
    console.log('\n📧 TEST CREDENTIALS:');
    console.log('   Email: test@example.com');
    console.log('   Password: Test123456');
    console.log('\n📊 DATA CREATED:');
    console.log(`   ✓ ${transactions.length} Transactions`);
    console.log(`   ✓ ${budgets.length} Budgets`);
    console.log(`   ✓ ${wallets.length} Wallets`);
    console.log(`   ✓ ${goals.length} Savings Goals`);
    console.log(`   ✓ ${loans.length} Loans`);
    console.log(`   ✓ ${bills.length} Bills`);
    console.log(`   ✓ ${notifications.length} Notifications`);
    console.log('\n🚀 LOGIN & EXPLORE:');
    console.log('   1. Go to http://localhost:5173/login');
    console.log('   2. Use the credentials above');
    console.log('   3. You will see all sections populated with data!');
    console.log('\n' + '='.repeat(60) + '\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seed();
