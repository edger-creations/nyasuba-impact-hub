
import { toast } from "sonner";

// Mock user data for demo purposes
const MOCK_USERS = [
  {
    id: "user1",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+254712345678",
    isRegistered: true,
    isVerified: true,
  },
  {
    id: "user2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+254723456789",
    isRegistered: true,
    isVerified: true,
  },
  {
    id: "user3",
    name: "Robert Johnson",
    email: "robert@example.com",
    phone: "+254734567890",
    isRegistered: true,
    isVerified: true,
  },
  {
    id: "user4",
    name: "Sarah Williams",
    email: "sarah@example.com",
    isRegistered: true,
    isVerified: true,
  },
  {
    id: "user5",
    name: "Michael Brown",
    email: "michael@example.com",
    phone: "+254745678901",
    isRegistered: true,
    isVerified: true,
  }
];

// SMTP Configuration
const SMTP_CONFIG = {
  host: "smtp.gmail.com",
  user: "nyasubaesther64@gmail.com",
  password: "gwfj fmhq hbqv ixwk",
  port: 587
};

// Store pending verifications with tokens
interface VerificationRequest {
  userId: string;
  token: string;
  expires: Date;
}

// Store pending verifications in localStorage for demo
const getPendingVerifications = (): VerificationRequest[] => {
  const stored = localStorage.getItem('enf-pending-verifications');
  return stored ? JSON.parse(stored) : [];
};

const savePendingVerifications = (verifications: VerificationRequest[]) => {
  localStorage.setItem('enf-pending-verifications', JSON.stringify(verifications));
};

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  isRegistered: boolean;
  isVerified?: boolean;
}

/**
 * Get all registered users
 */
export const getRegisteredUsers = async (): Promise<User[]> => {
  try {
    // Simulate API call with a delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return only registered users
    return MOCK_USERS.filter(user => user.isRegistered);
  } catch (error) {
    console.error("Error fetching registered users:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    toast.error(`Failed to fetch users: ${errorMessage}`);
    return [];
  }
};

/**
 * Get users with phone numbers
 */
export const getUsersWithPhoneNumbers = async (): Promise<User[]> => {
  try {
    // Simulate API call with a delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return only users with phone numbers
    return MOCK_USERS.filter(user => user.isRegistered && user.phone);
  } catch (error) {
    console.error("Error fetching users with phone numbers:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    toast.error(`Failed to fetch users with phone numbers: ${errorMessage}`);
    return [];
  }
};

/**
 * Get a user by ID
 */
export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    // Simulate API call with a delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const user = MOCK_USERS.find(user => user.id === userId);
    
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }
    
    return user;
  } catch (error) {
    console.error(`Error fetching user with ID ${userId}:`, error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    toast.error(`Failed to fetch user: ${errorMessage}`);
    return null;
  }
};

/**
 * Create verification token for a user
 */
export const createVerificationToken = (userId: string): string => {
  // Generate a random token
  const token = Math.random().toString(36).substring(2, 15) + 
               Math.random().toString(36).substring(2, 15);
  
  // Set expiration to 24 hours from now
  const expires = new Date();
  expires.setHours(expires.getHours() + 24);
  
  // Save to our "database"
  const verifications = getPendingVerifications();
  
  // Remove any existing verification for this user
  const filteredVerifications = verifications.filter(v => v.userId !== userId);
  
  // Add the new verification
  filteredVerifications.push({
    userId,
    token,
    expires
  });
  
  savePendingVerifications(filteredVerifications);
  
  console.log("Created verification token:", token, "for user:", userId);
  
  return token;
};

/**
 * Send verification email
 */
export const sendVerificationEmail = async (user: User): Promise<boolean> => {
  try {
    if (!user || !user.email) {
      throw new Error("Invalid user for verification email");
    }
    
    console.log("Preparing verification email for:", user.email);
    
    // Create a verification token
    const token = createVerificationToken(user.id);
    
    // Build verification URL - in a real app, this would be your deployed URL
    const baseUrl = window.location.origin;
    const verificationUrl = `${baseUrl}/verify-email?token=${token}&userId=${user.id}`;
    
    // In a real implementation, you would call your backend API to send the email
    // For demo purposes, we'll simulate sending an email and show a toast
    console.log("================================================================");
    console.log("VERIFICATION EMAIL DETAILS:");
    console.log("To:", user.email);
    console.log("Subject: Verify your email address");
    console.log("Verification URL:", verificationUrl);
    console.log("SMTP Configuration:", SMTP_CONFIG);
    console.log("================================================================");
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo purposes, we'll save the verification URL to localStorage so we can test it
    localStorage.setItem('enf-last-verification-url', verificationUrl);
    
    toast.success(`Verification email sent to ${user.email}`);
    toast.info("For testing: Check the console for the verification link");
    
    return true;
  } catch (error) {
    console.error("Error sending verification email:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    toast.error(`Failed to send verification email: ${errorMessage}`);
    return false;
  }
};

/**
 * Verify email with token
 */
export const verifyEmailWithToken = async (userId: string, token: string): Promise<boolean> => {
  try {
    console.log("Verifying email with token:", token, "for user:", userId);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Get pending verifications
    const verifications = getPendingVerifications();
    
    console.log("All pending verifications:", verifications);
    
    // Find matching verification
    const verification = verifications.find(v => 
      v.userId === userId && 
      v.token === token && 
      new Date(v.expires) > new Date()
    );
    
    if (!verification) {
      console.error("No matching verification found or token expired");
      throw new Error("Invalid or expired verification token");
    }
    
    console.log("Found valid verification:", verification);
    
    // In a real app, you would update the user's verified status in your database
    // For our mock implementation, we'll update our MOCK_USERS array
    const userIndex = MOCK_USERS.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      console.error("User not found in MOCK_USERS:", userId);
      throw new Error("User not found");
    }
    
    // Mark user as verified
    MOCK_USERS[userIndex].isVerified = true;
    
    // Update user in localStorage if present
    const storedUser = localStorage.getItem("enf-user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.id === userId) {
        user.isVerified = true;
        localStorage.setItem("enf-user", JSON.stringify(user));
        console.log("Updated user verification status in localStorage");
      }
    }
    
    // Remove verification from pending list
    const updatedVerifications = verifications.filter(v => !(v.userId === userId && v.token === token));
    savePendingVerifications(updatedVerifications);
    
    console.log("Email verification successful");
    return true;
  } catch (error) {
    console.error("Error verifying email:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    toast.error(`Email verification failed: ${errorMessage}`);
    return false;
  }
};

/**
 * Check if a user's email is verified
 */
export const isEmailVerified = async (userId: string): Promise<boolean> => {
  try {
    console.log("Checking verification status for user:", userId);
    const user = await getUserById(userId);
    
    if (!user) {
      console.log("User not found when checking verification status");
      return false;
    }
    
    console.log("User verification status:", user.isVerified);
    return user?.isVerified || false;
  } catch (error) {
    console.error("Error checking email verification status:", error);
    return false;
  }
};
