import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/Users';
import { Loan } from '../models/Loan';
import Payment from '../models/Payments';
import mongoose from 'mongoose';

const router = Router();
const key = process.env.jwtkey || "aG9wZXdhcmVjbG9uZ3NlcnZpY2VzdG9wZGF0YTJtOTQ0MTY5YXNkdGZrdXNs"; 

if (!key) {
  throw new Error('JWT_KEY is not defined in .env file');
}

// Signup route
router.post('/signup', async (req: Request, res: Response) => {
  const { name, email, password, isAdmin } = req.body;

  if (!name || !email || !password || typeof isAdmin !== 'boolean') {
    return res.status(400).send({ message: 'Name, email, password, and isAdmin are required' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      isAdmin,
    });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, key, { expiresIn: '1h' });

    res.status(201).send({ message: 'User created', token });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

// Signin route
router.post('/signin', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, key, { expiresIn: '1h' });

    res.status(200).send({ message: 'Sign in successful', token });
  } catch (error) {
    console.error('Error signing in:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

// Apply for loan
router.post('/apply-loan', async (req: Request, res: Response) => {
  const { name, tenure, reason, employmentStatus, amount, repaymentDueDate } = req.body;
  const token = req.headers.authorization?.split(' ')[1];

  if (!name || !tenure || !reason || !employmentStatus || !amount || !repaymentDueDate) {
    return res.status(400).send({ message: 'All fields are required' });
  }

  if (!token) {
    return res.status(401).send({ message: 'Authorization token is required' });
  }

  try {
    const decoded = jwt.verify(token, key) as { id: string };
    const borrowerId = decoded.id;

    const newLoan = new Loan({
      name,
      tenure,
      reason,
      employmentStatus,
      amount,
      borrowerId,
      repaymentDueDate,
    });

    await newLoan.save();

    res.status(201).send({ message: 'Loan application submitted', loan: newLoan });
  } catch (error) {
    console.error('Error applying for loan:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

// Get user loans
router.get('/loans', async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).send({ message: 'Authorization token is required' });
  }

  try {
    const decoded = jwt.verify(token, key) as { id: string };
    const userId = decoded.id;

    const userLoans = await Loan.find({ borrowerId: userId });

    if (!userLoans.length) {
      return res.status(404).send({ message: 'No loans found for this user' });
    }

    res.status(200).send({ message: 'Loans fetched successfully', loans: userLoans });
  } catch (error) {
    console.error('Error fetching loans:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

// Make a payment
router.post('/make-payment', async (req: Request, res: Response) => {
  const { loan_id, amount } = req.body;
  const token = req.headers.authorization?.split(' ')[1];

  if (!loan_id || !amount) {
    return res.status(400).json({ message: 'Please provide loan_id and amount' });
  }

  if (!token) {
    return res.status(401).json({ message: 'Authorization token is required' });
  }

  try {
    const decoded = jwt.verify(token, key) as { id: string };
    const userId = decoded.id;

    const session = await mongoose.startSession();
    session.startTransaction();

    const loan = await Loan.findById(loan_id).session(session);
    if (!loan) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Loan not found' });
    }

    if (amount <= 0 || amount > loan.amountRemaining) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Invalid payment amount' });
    }

    const payment = new Payment({
      userId,
      loan_id,
      amount,
      payment_date: new Date(),
    });

    await payment.save({ session });

    loan.amountRemaining -= amount;
    await loan.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ message: 'Payment made successfully', payment });
  } catch (error) {
    console.error('Error making payment:', error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
});

// Get user payments
router.get('/user-payments', async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authorization token is required' });
  }

  try {
    const decoded = jwt.verify(token, key) as { id: string };
    const userId = decoded.id;

    const userLoans = await Loan.find({ borrowerId: userId });

    if (!userLoans || userLoans.length === 0) {
      return res.status(404).json({ message: 'No loans found for the user' });
    }

    const loanIds = userLoans.map((loan) => loan._id);

    const payments = await Payment.find({ loan_id: { $in: loanIds } });

    if (!payments || payments.length === 0) {
      return res.status(404).json({ message: 'No payments found for this user' });
    }

    res.status(200).json({ payments });
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
});

export default router;
