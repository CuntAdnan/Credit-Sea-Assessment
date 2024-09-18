import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/Users';
import jwt from 'jsonwebtoken';
import { Loan } from '../models/Loan';
import Payment from '../models/Payments';

const router = Router();
const key = process.env.jwtkey || "aG9wZXdhcmVjbG9uZ3NlcnZpY2VzdG9wZGF0YTJtOTQ0MTY5YXNkdGZrdXNs"; 

// Ensure JWT_KEY is defined
if (!key) {
  throw new Error('JWT_KEY is not defined in .env file');
}

// Sign up route
router.post('/signup', async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).send({ message: 'Name, email, and password are required' });
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
      isAdmin: true,
    });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, key, {
      expiresIn: '1h',
    });

    res.status(201).send({ message: 'User created', token });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

// Login route
router.post('/login', async (req: Request, res: Response) => {
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

    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, key, {
      expiresIn: '1h',
    });

    res.status(200).send({ message: 'Sign in successful', token });
  } catch (error) {
    console.error('Error signing in:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

// Get distinct borrowers count
router.get('/borrowers', async (req: Request, res: Response) => {
  try {
    const result = await Loan.aggregate([
      {
        $group: {
          _id: '$borrowerId', // Group by borrowerId
        },
      },
      {
        $count: 'distinctBorrowers', // Count the number of distinct borrowerId
      },
    ]);

    const count = result.length > 0 ? result[0].distinctBorrowers : 0;

    res.status(200).send({ count });
  } catch (error) {
    console.error('Error getting distinct borrowers count:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

// Get total payments amount
router.get('/payments', async (req: Request, res: Response) => {
  try {
    const result = await Payment.aggregate([
      {
        $group: {
          _id: null, // Group all documents together
          totalAmount: { $sum: '$amount' }, // Calculate the sum of the amount field
        },
      },
    ]);

    const totalAmount = result.length > 0 ? result[0].totalAmount : 0;

    res.status(200).send({ totalAmount });
  } catch (error) {
    console.error('Error getting sum of payments:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

// Get count of repaid loans
router.get('/repayments', async (req: Request, res: Response) => {
  try {
    const count = await Loan.countDocuments({ amountRemaining: 0 });
    res.status(200).send({ count });
  } catch (error) {
    console.error('Error counting loans with zero remaining amount:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

// Get total loan count
router.get('/loanCount', async (req: Request, res: Response) => {
  try {
    const count = await Loan.countDocuments();
    res.status(200).send({ count });
  } catch (error) {
    console.error('Error counting loans:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

// Get total disbursed amount
router.get('/disbursed', async (req: Request, res: Response) => {
  try {
    const result = await Loan.aggregate([
      { $match: { status: 'approved' } }, 
      { $group: { _id: null, totalAmount: { $sum: '$amount' } } },
    ]);

    const totalAmount = result.length > 0 ? result[0].totalAmount : 0;
    res.status(200).send({ totalAmount });
  } catch (error) {
    console.error('Error fetching approved loans sum:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

// Get all loans with details
router.get('/loans', async (req: Request, res: Response) => {
  try {
    const loans = await Loan.find().select('amount status applicationDate borrowerId').exec();

    const loanDetails = await Promise.all(loans.map(async (loan) => {
      const user = await User.findById(loan.borrowerId).select('name').exec();
      const borrowerName = user ? user.name : 'Unknown';

      return {
        loanId: loan._id, 
        borrowerName,
        amount: loan.amount,
        status: loan.status,
        applicationDate: loan.applicationDate.toDateString(),
      };
    }));

    res.status(200).json(loanDetails);
  } catch (error) {
    console.error('Error fetching loans:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

// Approve a loan by ID
router.post('/approveLoan/:loanId', async (req: Request, res: Response) => {
  const { loanId } = req.params;

  try {
    const loan = await Loan.findById(loanId);
    
    if (!loan) {
      return res.status(404).send({ message: 'Loan not found' });
    }

    if (loan.status === 'approved') {
      return res.status(400).send({ message: 'Loan is already approved' });
    }

    loan.status = 'approved';
    await loan.save();

    res.status(200).send({ message: 'Loan approved successfully' });
  } catch (error) {
    console.error('Error approving loan:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

// Get loan details
router.get('/loanDetails', async (req: Request, res: Response) => {
  try {
    const loans = await Loan.find().select('amount applicationDate borrowerId').exec();
    const loanDetails = await Promise.all(loans.map(async (loan) => {
      const user = await User.findById(loan.borrowerId).select('name').exec();
      const borrowerName = user ? user.name : 'Unknown';

      return {
        borrowerName,
        amount: loan.amount,
        loanTakenDate: loan.applicationDate ? loan.applicationDate.toDateString() : 'No application date',
      };
    }));

    res.status(200).json(loanDetails);
  } catch (error) {
    console.error('Error fetching loan details:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

// Get paid loans
router.get('/paidLoans', async (req: Request, res: Response) => {
  try {
    const paidLoans = await Loan.find({ amountRemaining: 0 }).exec();
    res.status(200).json(paidLoans);
  } catch (error) {
    console.error('Error fetching paid loans:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;
