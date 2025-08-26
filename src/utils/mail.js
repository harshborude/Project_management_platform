import Mailgen from "mailgen";
import nodemailer from "nodemailer";


const sendEmail = async (options) =>{
   const mailGenerator =  new Mailgen({
        theme : "default",
        product : {
            name : " Task Manager",
            link : "https://taskmanagelink.com"
        }
    })

   const emailTextual =  mailGenerator.generatePlaintext(options.mailgenContent)
   const emailHtml =  mailGenerator.generate(options.mailgenContent)



  const transporter = nodemailer.createTransport({
    host : process.env.MAILTRAP_SMTP_HOST,
    port : process.env.MAILTRAP_SMTP_PORT,
    auth :{
        user : process.env.MAILTRAP_SMTP_USER,
        pass : process.env.MAILTRAP_SMTP_PASS
    }
   })

   const mail = {
    from : "mail.taskmanager@example.com",
    to: options.email,
    subject : options.subject,
    text : emailTextual,
    html : emailHtml
   }
   try{
    await transporter.sendMail(mail)

   } catch(err){
    console.error("email service failed", err);
   }
}





const emailVerificationMailgenContent = (username, verificationURL) =>{
    return {
        body : {
            name : username,
            intro: "Welcome to our App! We are excited to have you on board.",
            action : {
                instructions: "To verify your email please click on the following button",
                button : {
                    color : "#18BC66",
                    text : "Verify your account",
                    link: verificationURL
                },
            },
            outro : "Need help, or have questions? Just reply to this email"
        }
    }
}


const forgotPasswordMailgenContent = (username, passwordResetUrl) =>{
    return {
        body : {
            name : username,
            intro: "We got a request to reset the password of your account",
            action : {
                instructions: "To reset your password please click on the following button",
                button : {
                    color : "#22BC66",
                    text : "Reset your password",
                    link: passwordResetUrl,
                },
            },
            outro : "Need help, or have questions? Just reply to this email"
        }
    }
}

export {
    emailVerificationMailgenContent,
    forgotPasswordMailgenContent,
    sendEmail
}