import jwt from "jsonwebtoken";

interface Payload {
  email: string;
  create_time: Date;
}

interface AuthResponse {
  authenticated: boolean;
  user: Payload | null;
  message: string;
}

export const authenticateUser = async (req: Request): Promise<AuthResponse> => {
  try {
   
    const authHeader = req.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return {
        authenticated: false,
        user: null,
        message: "Authorization header missing or invalid",
      };
    }

    // Extract the token
    const token = authHeader.split(" ")[1];
    if (!token) {
      return {
        authenticated: false,
        user: null,
        message: "Token missing in authorization header",
      };
    }

    // Ensure the JWT secret key is defined
    if (!process.env.JWT_SECRET_KEY) {
      throw new Error("JWT secret key is not set in environment variables.");
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY) as Payload;

    // Return success response with user data
    return {
      authenticated: true,
      user: decoded,
      message: "User authenticated successfully",
    };
  } catch (error: any) {
    // Handle specific JWT errors
    if (error.name === "TokenExpiredError") {
      return {
        authenticated: false,
        user: null,
        message: "Token has expired",
      };
    } else if (error.name === "JsonWebTokenError") {
      return {
        authenticated: false,
        user: null,
        message: "Invalid token",
      };
    }

    // Handle other errors
    return {
      authenticated: false,
      user: null,
      message: "Authentication failed: " + error.message,
    };
  }
};
