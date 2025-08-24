// import express from "express";
import dotenv from 'dotenv';
import app from './app.js';


dotenv.config({
  path: "./.env",
})


// const app = express();
const PORT = process.env.PORT || 3000;

// app.use(express.json());

// app.get('/', (req,res)=>{
//   res.send("hellow");
// })



app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
