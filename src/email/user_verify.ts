import EmailTransporter from "@/lib/nodemailer";

export const user_verify_email = async (otp:string, user_email:string) => {
   
    const info = await EmailTransporter.sendMail({
      from: '"discount.com 👻" discount.verify@gmail.com', 
      to: user_email, 
      subject: "Verification", 
      text: "discount.com", 
      html: `Hi user this is your email verification OTP ${otp}` 
    });
  
    console.log("Message sent: %s", info.messageId);

  }
  
