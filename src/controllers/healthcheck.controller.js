import {ApiResponse} from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";


// const healthCheck = (req,res) =>{
//     try{
//         res.status(200).json(
//             new ApiResponse(200, {message : "Server is running"})
//         )
//     } catch(err){

//     }
// }

const healthCheck = asyncHandler(async (req,res)=>{
    console.log("healthcheck initiated")
    res.status(200).json(
        
        new ApiResponse(200,{ message: "Sever is still running"})
    );
})

export {healthCheck};