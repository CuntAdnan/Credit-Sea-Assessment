import { Schema, model, Document } from 'mongoose';

export interface ILoan extends Document {
  name: string;
  tenure: number; 
  reason: string;
  employmentStatus: string; 
  amount: number;
  borrowerId: Schema.Types.ObjectId;
  status: 'approved' | 'rejected' | 'pending';
  applicationDate: Date;
  repaymentDueDate: Date;
  amountRemaining: number; 
}

const loanSchema = new Schema<ILoan>({
  name: { 
    type: String, 
    required: true 
  },
  tenure: { 
    type: Number, 
    required: true 
  },
  reason: { 
    type: String, 
    required: true 
  },
  employmentStatus: { 
    type: String, 
    required: true 
  },
  amount: { 
    type: Number, 
    required: true 
  },
  borrowerId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['approved', 'rejected', 'pending'], 
    default: 'pending' 
  },
  applicationDate: { 
    type: Date, 
    default: Date.now 
  },
  repaymentDueDate: { 
    type: Date, 
    required: true 
  },
  amountRemaining: { 
    type: Number, 
    default: function() { return this.amount; } // Set default value to be equal to amount
  }
});

export const Loan = model<ILoan>('Loan', loanSchema);
