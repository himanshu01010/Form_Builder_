import mongoose from 'mongoose';
import dotenv from 'dotenv';  // To load environment variables

dotenv.config();  

const connectDB = () => {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => {
      console.log('MongoDB Connected');
    })
    .catch((err) => {
      console.error(`Error: ${err.message}`);
      process.exit(1);  
    });
};

export default connectDB;