import UserModel from "@/model/UserModel"; 

// Function to check if a user is an admin based on their email or user ID
export async function isAdmin(user_email: string): Promise<boolean> {
  try {
   
    const user = await UserModel.findOne({email: user_email});

    if (user && user.role === "admin") {
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error checking if user is admin:", error);
    return false; 
  }
}
