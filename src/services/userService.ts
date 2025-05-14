
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
  avatar_url?: string;
  is_verified?: boolean;
  created_at: Date;
  last_sign_in?: Date | null;
  roles?: string[];
}

/**
 * Fetch all users from the database
 */
export const fetchUsers = async (): Promise<User[]> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        user_roles(role)
      `);
    
    if (error) {
      throw error;
    }
    
    const { data: authUsers } = await supabase.auth.admin.listUsers();
    
    return data.map(profile => {
      // Fix: Check if authUsers exists and has users array before using find
      const authUser = authUsers && authUsers.users ? 
        authUsers.users.find(u => u.id === profile.id) : 
        undefined;
      
      return {
        id: profile.id,
        email: profile.email,
        name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
        avatar_url: profile.avatar_url,
        is_verified: profile.is_verified,
        roles: profile.user_roles ? profile.user_roles.map((r: any) => r.role) : ['user'],
        created_at: new Date(profile.created_at),
        last_sign_in: authUser?.last_sign_in_at ? new Date(authUser.last_sign_in_at) : null,
      };
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    
    // Fallback to just fetching profiles if auth admin API fails
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
      
      if (error) throw error;
      
      return data.map(profile => ({
        id: profile.id,
        email: profile.email,
        name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
        avatar_url: profile.avatar_url,
        is_verified: profile.is_verified,
        created_at: new Date(profile.created_at),
      }));
    } catch (fallbackError) {
      console.error("Fallback error fetching users:", fallbackError);
      toast.error("Failed to load users. Please try again.");
      return [];
    }
  }
};

/**
 * Update a user's verification status
 */
export const updateUserVerificationStatus = async (userId: string, isVerified: boolean): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ is_verified: isVerified })
      .eq('id', userId);
    
    if (error) {
      throw error;
    }
    
    toast.success(`User ${isVerified ? 'verified' : 'unverified'} successfully`);
    return true;
  } catch (error) {
    console.error("Error updating user verification status:", error);
    toast.error("Failed to update user verification status. Please try again.");
    return false;
  }
};

/**
 * Get user statistics
 */
export const getUserStats = async (): Promise<{
  totalUsers: number;
  verifiedUsers: number;
  adminUsers: number;
  recentUsers: User[];
}> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    const verifiedUsers = data.filter(user => user.is_verified).length;
    const adminUsers = data.filter(user => user.is_verified).length; // In this simple system, verified users are admins
    
    const recentUsers = data.slice(0, 5).map(profile => ({
      id: profile.id,
      email: profile.email,
      name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
      avatar_url: profile.avatar_url,
      is_verified: profile.is_verified,
      created_at: new Date(profile.created_at),
    }));
    
    return {
      totalUsers: data.length,
      verifiedUsers,
      adminUsers,
      recentUsers,
    };
  } catch (error) {
    console.error("Error fetching user statistics:", error);
    return {
      totalUsers: 0,
      verifiedUsers: 0,
      adminUsers: 0,
      recentUsers: [],
    };
  }
};
