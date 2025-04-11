
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
  // Simulate API call with a delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return only registered users
  return MOCK_USERS.filter(user => user.isRegistered);
};
