import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
//routes
import healthCheckRouter from './routes/healthcheck.routes.js';
import authRouter from './routes/auth.routes.js'



const app = express();


//basic configurations
app.use(express.json({limit : "16kb"}));
app.use(express.urlencoded({extended: true, limit : "16kb"}))
app.use(express.static("public"));

//cors configurations
app.use(cors({
    origin : process.env.CORS_ORIGIN?.split(".") || "http://localhost:5173",
    credentials : true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders : ["Content-Type", "Authorization"],
}))


app.use(cookieParser);

//Routes
app.use("/api/v1/healthcheck", healthCheckRouter);
app.use('/api/v1/auth', authRouter)
// app.get('/', (req,res)=>{
//   res.send("hellow");
// })



export default app;