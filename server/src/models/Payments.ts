import mongoose, { Schema, Document } from 'mongoose';

interface IPayment extends Document {
  loan_id: mongoose.Types.ObjectId;
  amount: number;
  payment_date: Date;
}

const PaymentSchema: Schema = new Schema({
  
  loan_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Loan',
    required: true,
  },
  amount: {
    type: Number,   
    required: true,
  },
  payment_date: {
    type: Date,
    default: Date.now,
  },
});

const Payment = mongoose.model<IPayment>('Payment', PaymentSchema);
export default Payment;
