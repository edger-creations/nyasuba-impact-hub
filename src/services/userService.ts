
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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
    // For demo purposes - in a real app, this would fetch users from Supabase
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
    // For demo purposes - in a real app, this would fetch users from Supabase
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
    // For demo purposes - in a real app, this would fetch the user from Supabase
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
 * Check if a user's email is verified
 */
export const isEmailVerified = async (userId: string): Promise<boolean> => {
  try {
    // In a production app, we'd check directly with Supabase
    const { data } = await supabase.auth.getUser();
    return data.user?.email_confirmed_at !== null;
  } catch (error) {
    console.error("Error checking email verification status:", error);
    return false;
  }
};

/**
 * Verify email with token - this is now handled by Supabase automatically
 */
export const verifyEmailWithToken = async (userId: string, token: string): Promise<boolean> => {
  // This function is now a stub since verification is handled by Supabase's built-in flow
  console.log("Email verification is now handled by Supabase automatically");
  return true;
};
