import mongoose, { Schema, Document } from 'mongoose';

interface ICashTransaction extends Document {
  user_id: mongoose.Types.ObjectId;
  amount: number; 
  transaction_type: 'deposit' | 'withdrawal'; 
  transaction_date: Date; 
}

const CashTransactionSchema: Schema = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  transaction_type: {
    type: String,
    enum: ['deposit', 'withdrawal'], 
    required: true,
  },
  transaction_date: {
    type: Date,
    default: Date.now, 
  },
});

const CashTransaction = mongoose.model<ICashTransaction>(
  'CashTransaction',
  CashTransactionSchema
);
export default CashTransaction;
