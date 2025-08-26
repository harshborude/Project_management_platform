import { body } from "express-validator";

const userRegisterValidator = () =>{
return [
    body("email").trim().notEmpty().withMessage("email is required").isEmail().withMessage("Email is invalid"),
    body("username").trim().notEmpty().withMessage("Username required").isLowercase().withMessage("username must be lowercase").isLength({min: 3}).withMessage("username must be atleast 3 characters long"),
    body("password").notEmpty().withMessage("Password is required"),
    body("fullName").optional().trim(),
]
}


export {
    userRegisterValidator
}
