import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import TransactionModel from '../../../models/Transaction';

// GET /api/transactions - Fetch all transactions
export async function GET() {
  try {
    await connectDB();
    
    const transactions = await TransactionModel.find({})
      .sort({ date: -1 }) // Sort by date, newest first
      .lean(); // Use lean() for better performance
    
    return NextResponse.json({ 
      success: true, 
      data: transactions 
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

// POST /api/transactions - Create a new transaction
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { amount, date, description, type, category } = body;
    
    // Validate required fields
    if (!amount || !date || !description || !type || !category) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }
    
    // Create new transaction
    const transaction = await TransactionModel.create({
      amount: parseFloat(amount),
      date,
      description,
      type,
      category
    });
    
    return NextResponse.json({ 
      success: true, 
      data: transaction 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create transaction' },
      { status: 500 }
    );
  }
}
