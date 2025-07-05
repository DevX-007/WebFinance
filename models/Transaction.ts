import mongoose from 'mongoose';
import { Transaction } from '../types';

// Define the schema
const transactionSchema = new mongoose.Schema<Transaction>({
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount must be positive']
  },
  date: {
    type: String,
    required: [true, 'Date is required']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [200, 'Description cannot exceed 200 characters']
  },
  type: {
    type: String,
    required: [true, 'Type is required'],
    enum: ['income', 'expense']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Housing',
      'Food',
      'Transportation',
      'Entertainment',
      'Shopping',
      'Utilities',
      'Healthcare',
      'Education',
      'Travel',
      'Investments',
      'Income',
      'Other'
    ]
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
  toJSON: {
    transform: function(_doc, ret) {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Create indexes for better query performance
transactionSchema.index({ date: -1 });
transactionSchema.index({ type: 1 });
transactionSchema.index({ category: 1 });

// Create and export the model
const TransactionModel = mongoose.models.Transaction || mongoose.model<Transaction>('Transaction', transactionSchema);

export default TransactionModel;
