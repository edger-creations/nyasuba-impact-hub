
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Volunteer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  skills: string[];
  interests?: string;
  availability?: string;
  status: 'pending' | 'approved' | 'rejected';
  userId?: string; 
  created_at: Date;
}

/**
 * Fetch all volunteers from the database
 */
export const fetchVolunteers = async (): Promise<Volunteer[]> => {
  try {
    const { data, error } = await supabase
      .from('volunteers')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data.map(volunteer => ({
      id: volunteer.id,
      firstName: volunteer.first_name,
      lastName: volunteer.last_name,
      email: volunteer.email,
      phone: volunteer.phone,
      address: volunteer.address,
      skills: volunteer.skills || [],
      interests: volunteer.interests,
      availability: volunteer.availability,
      status: volunteer.status,
      userId: volunteer.user_id,
      created_at: new Date(volunteer.created_at)
    }));
  } catch (error) {
    console.error("Error fetching volunteers:", error);
    toast.error("Failed to load volunteers. Please try again.");
    return [];
  }
};

/**
 * Update a volunteer's status
 */
export const updateVolunteerStatus = async (id: string, status: 'pending' | 'approved' | 'rejected'): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('volunteers')
      .update({ status })
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    toast.success(`Volunteer ${status === 'approved' ? 'approved' : status === 'rejected' ? 'rejected' : 'set to pending'} successfully`);
    return true;
  } catch (error) {
    console.error("Error updating volunteer status:", error);
    toast.error("Failed to update volunteer status. Please try again.");
    return false;
  }
};

/**
 * Submit volunteer application
 */
export const submitVolunteerApplication = async (volunteerData: Omit<Volunteer, 'id' | 'status' | 'created_at'>): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    // Transform the volunteer data to match the database schema
    const dbVolunteerData = {
      first_name: volunteerData.firstName,
      last_name: volunteerData.lastName,
      email: volunteerData.email,
      phone: volunteerData.phone,
      address: volunteerData.address,
      skills: volunteerData.skills,
      interests: volunteerData.interests,
      availability: volunteerData.availability,
      user_id: user?.id,
      status: 'pending'
    };
    
    const { error } = await supabase
      .from('volunteers')
      .insert([dbVolunteerData]);
    
    if (error) {
      // Check if this email is already registered as a volunteer
      if (error.code === '23505') { // Unique violation
        toast.error("You have already registered as a volunteer.");
        return false;
      }
      throw error;
    }
    
    toast.success("Volunteer application submitted successfully!");
    return true;
  } catch (error) {
    console.error("Error submitting volunteer application:", error);
    toast.error("Failed to submit volunteer application. Please try again.");
    return false;
  }
};

/**
 * Get volunteer statistics
 */
export const getVolunteerStats = async (): Promise<{
  totalVolunteers: number;
  pendingVolunteers: number;
  approvedVolunteers: number;
  rejectedVolunteers: number;
}> => {
  try {
    const { data, error } = await supabase
      .from('volunteers')
      .select('status');
    
    if (error) {
      throw error;
    }
    
    const pending = data.filter(v => v.status === 'pending').length;
    const approved = data.filter(v => v.status === 'approved').length;
    const rejected = data.filter(v => v.status === 'rejected').length;
    
    return {
      totalVolunteers: data.length,
      pendingVolunteers: pending,
      approvedVolunteers: approved,
      rejectedVolunteers: rejected
    };
  } catch (error) {
    console.error("Error fetching volunteer statistics:", error);
    return {
      totalVolunteers: 0,
      pendingVolunteers: 0,
      approvedVolunteers: 0,
      rejectedVolunteers: 0
    };
  }
};
