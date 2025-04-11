
import { toast } from "sonner";

// Mock user data for demo purposes
const MOCK_USERS = [
  {
    id: "user1",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+254712345678",
    isRegistered: true,
  },
  {
    id: "user2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+254723456789",
    isRegistered: true,
  },
  {
    id: "user3",
    name: "Robert Johnson",
    email: "robert@example.com",
    phone: "+254734567890",
    isRegistered: true,
  },
  {
    id: "user4",
    name: "Sarah Williams",
    email: "sarah@example.com",
    isRegistered: true,
  },
  {
    id: "user5",
    name: "Michael Brown",
    email: "michael@example.com",
    phone: "+254745678901",
    isRegistered: true,
  }
];

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  isRegistered: boolean;
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
