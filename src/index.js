// import express from "express";
import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './db/index.js';

dotenv.config({
  path: "./.env",
})


// const app = express();
const PORT = process.env.PORT || 3000;

// app.use(express.json());

// app.get('/', (req,res)=>{
//   res.send("hellow");
// })


connectDB()
  .then(()=>{
    
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});

  })
  .catch((err)=>{
    console.error("MongoDB connection error", err)
    process.exit(1)
  })