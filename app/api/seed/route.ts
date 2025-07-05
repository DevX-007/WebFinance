import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import TransactionModel from '../../../models/Transaction';
import { generateMockTransactions } from '../../../utils/mockData';

export async function POST() {
  try {
    await connectDB();
    
    // Check if we already have data
    const existingCount = await TransactionModel.countDocuments();
    
    if (existingCount > 0) {
      return NextResponse.json({
        success: false,
        message: `Database already has ${existingCount} transactions. Use DELETE first to reseed.`,
        count: existingCount
      });
    }

    // Generate and insert mock data
    const mockTransactions = generateMockTransactions();
    
    const transactionsToInsert = mockTransactions.map(transaction => ({
      amount: transaction.amount,
      date: transaction.date,
      description: transaction.description,
      type: transaction.type,
      category: transaction.category
    }));

    const insertedTransactions = await TransactionModel.insertMany(transactionsToInsert);

    return NextResponse.json({
      success: true,
      message: `Successfully seeded database with ${insertedTransactions.length} transactions`,
      count: insertedTransactions.length
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to seed database',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// DELETE all transactions (for reseeding)
export async function DELETE() {
  try {
    await connectDB();
    
    const result = await TransactionModel.deleteMany({});
    
    return NextResponse.json({
      success: true,
      message: `Deleted ${result.deletedCount} transactions`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error clearing database:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to clear database',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
