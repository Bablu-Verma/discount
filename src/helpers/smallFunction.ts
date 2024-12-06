import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';



export function generateOTP(): string {
    const otp: number = Math.floor(1000 + Math.random() * 9000);
    return otp.toString();
}


// HashPassword 
const saltRounds = 10;
export async function createHashPassword(password: string): Promise<string> {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    throw new Error('Error hashing password');
  }
}

export async function verifyHashPassword(userpassword: string, hashpassword: string): Promise<boolean> {
  try {
    const match = await bcrypt.compare(userpassword, hashpassword);
    return match;
  } catch (error) {
    throw new Error('Error verifying password');
  }
}


export function createExpiryTime(hoursToAdd: number, minutesToAdd: number): Date {
  const now = new Date();
  const expiryDate = new Date(now.getTime() + (hoursToAdd * 60 * 60 * 1000) + (minutesToAdd * 60 * 1000)); 
  return expiryDate;
}

// const oneHourThirtyMinutesExpiry = createExpiryTime(1, 30);
// console.log('Expiry Date (1 hour 30 minutes):', oneHourThirtyMinutesExpiry.toISOString());

export function isExpiredTime(expiryDate: Date): boolean {
  const now = new Date();
  return now > expiryDate;
}

// JwtToken
const SECRET_KEY = process.env.JWT_SECRET_KEY || 'secret-key';
interface Payload {
  email: string;
}
export const generateJwtToken = (payload: Payload, expiresIn: string = '1h'): string => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
};




export function setClientCookie(cookie_name:string, cookie_value:string, duration_in_minutes:number) {
  const now = new Date();
  if (duration_in_minutes === 0) {
     
      now.setTime(now.getTime() - 1);
  } else {
      now.setTime(now.getTime() + (duration_in_minutes * 60 * 1000)); 
  }

  const expires = `expires=${now.toUTCString()}`;
  // document.cookie = `${cookie_name}=${encodeURIComponent(JSON.stringify(cookie_value))}; ${expires}; path=/; secure; SameSite=Strict;`;
  document.cookie = `${cookie_name}=${cookie_value}; ${expires}; path=/; secure; SameSite=Strict;`;
}


export function getClientCookie(cookie_name: string):any{
  const cookies = document.cookie || "";

  const value = `; ${cookies}`;
  const parts = value.split(`; ${cookie_name}=`);

  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(';').shift(); 
    if (cookieValue) {
      return decodeURIComponent(cookieValue);
    }
  }
  return null;
}


export function parse_json_string(cookie_name:string) {
  const cookie_value = getClientCookie(cookie_name);

  if (cookie_value) {
      try {
          return JSON.parse(decodeURIComponent(cookie_value)); 
      } catch (error) {
          console.error("Failed to parse userInfo from cookie:", error);
          return null;
      }
  }
  return null; 
}