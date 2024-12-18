import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import templateRoutes from './routes/templateRoutes.js';
import formRoutes from './routes/formRoutes.js';
import submissionRoutes from "./routes/formSubmissionRoutes.js";

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', templateRoutes);
app.use('/api', formRoutes);
app.use("/api", submissionRoutes);

export default app;
