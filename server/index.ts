import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import express from 'express';

import mongoose from 'mongoose';
import campaignRouter  from './routes/campaign';
import  messageRouter from './routes/message';
import leadRouter from "./routes/leads"
const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors({
  origin:["http://localhost:5173","https://out-flo-assignment-two.vercel.app"]
}));
app.use(express.json());
console.log(process.env.GROQ_API_KEY)
// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/outflo')
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Routes
app.use('/api/campaigns', campaignRouter);
app.use('/api/personalized-message', messageRouter);
app.use('/api/leads', leadRouter);
app.get('/health',(req,res)=>{
  res.json({
    message:"Running"
  })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});