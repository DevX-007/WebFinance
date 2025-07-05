import connectDB from '../lib/mongodb';
import TransactionModel from '../models/Transaction';
import { generateMockTransactions } from '../utils/mockData';

async function seedDatabase() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    // Check if we already have data
    const existingCount = await TransactionModel.countDocuments();
    
    if (existingCount > 0) {
      console.log(`Database already has ${existingCount} transactions. Skipping seed.`);
      return;
    }

    // Generate and insert mock data
    const mockTransactions = generateMockTransactions();
    console.log(`Seeding database with ${mockTransactions.length} transactions...`);

    for (const transaction of mockTransactions) {
      await TransactionModel.create({
        amount: transaction.amount,
        date: transaction.date,
        description: transaction.description,
        type: transaction.type,
        category: transaction.category
      });
    }

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

seedDatabase();
