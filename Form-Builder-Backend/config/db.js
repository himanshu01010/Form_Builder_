import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const connectDB = async () => {
  try {
    let mongoUri;
    if (process.env.VERCEL_ENV === 'production') {
      mongoUri = process.env.MONGO_URI_PRODUCTION;
    } else {
      mongoUri = process.env.MONGO_URI_DEVELOPMENT;
    }

    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected');
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};

export default connectDB;
