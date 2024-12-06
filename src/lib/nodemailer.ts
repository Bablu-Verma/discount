import nodemailer from 'nodemailer';

export const EmailTransporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, 
  auth: {
    user: process.env.ethereal_user_name,
    pass: process.env.ethereal_user_password,
  },
});



export default EmailTransporter