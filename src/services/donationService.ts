
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Donation } from "@/types/donation";

/**
 * Fetch all donations from the database
 */
export const fetchDonations = async (): Promise<Donation[]> => {
  try {
    const { data, error } = await supabase
      .from('donations')
      .select(`
        *,
        programs(title),
        profiles(first_name, last_name)
      `)
      .order('date', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data.map(donation => ({
      id: donation.id,
      transaction_id: donation.transaction_id,
      status: donation.status,
      method: donation.method,
      currency: donation.currency,
      amount: Number(donation.amount),
      user_id: donation.user_id,
      program_id: donation.program_id,
      program_name: donation.programs?.title,
      user_name: donation.profiles ? 
        `${donation.profiles.first_name || ''} ${donation.profiles.last_name || ''}`.trim() : 
        undefined,
      date: new Date(donation.date),
    }));
  } catch (error) {
    console.error("Error fetching donations:", error);
    toast.error("Failed to load donations. Please try again.");
    return [];
  }
};

/**
 * Create a new donation record
 */
export const createDonation = async (donationData: Omit<Donation, 'id' | 'date'>): Promise<Donation | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from('donations')
      .insert([{
        transaction_id: donationData.transaction_id,
        status: donationData.status,
        method: donationData.method,
        currency: donationData.currency,
        amount: donationData.amount,
        user_id: user?.id || donationData.user_id,
        program_id: donationData.program_id,
      }])
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    toast.success("Donation recorded successfully!");
    
    return {
      id: data.id,
      transaction_id: data.transaction_id,
      status: data.status,
      method: data.method,
      currency: data.currency,
      amount: Number(data.amount),
      user_id: data.user_id,
      program_id: data.program_id,
      date: new Date(data.date),
    };
  } catch (error) {
    console.error("Error creating donation record:", error);
    toast.error("Failed to record donation. Please try again.");
    return null;
  }
};

/**
 * Update the status of a donation
 */
export const updateDonationStatus = async (id: string, status: 'processing' | 'completed' | 'failed'): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('donations')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    toast.success(`Donation status updated to ${status}`);
    return true;
  } catch (error) {
    console.error("Error updating donation status:", error);
    toast.error("Failed to update donation status. Please try again.");
    return false;
  }
};

/**
 * Get donation statistics
 */
export const getDonationStats = async (): Promise<{
  totalAmount: number;
  totalDonations: number;
  completedDonations: number;
  processingDonations: number;
  failedDonations: number;
  recentDonations: Donation[];
}> => {
  try {
    const { data: donationsData, error: donationsError } = await supabase
      .from('donations')
      .select('*')
      .order('date', { ascending: false });
    
    if (donationsError) {
      throw donationsError;
    }
    
    const completedDonations = donationsData.filter(d => d.status === 'completed');
    const processingDonations = donationsData.filter(d => d.status === 'processing');
    const failedDonations = donationsData.filter(d => d.status === 'failed');
    
    const totalAmount = completedDonations.reduce(
      (sum, donation) => sum + Number(donation.amount), 
      0
    );
    
    const recentDonations = donationsData
      .slice(0, 5)
      .map(donation => ({
        id: donation.id,
        transaction_id: donation.transaction_id,
        status: donation.status,
        method: donation.method,
        currency: donation.currency,
        amount: Number(donation.amount),
        user_id: donation.user_id,
        program_id: donation.program_id,
        date: new Date(donation.date),
      }));
    
    return {
      totalAmount,
      totalDonations: donationsData.length,
      completedDonations: completedDonations.length,
      processingDonations: processingDonations.length,
      failedDonations: failedDonations.length,
      recentDonations,
    };
  } catch (error) {
    console.error("Error fetching donation statistics:", error);
    return {
      totalAmount: 0,
      totalDonations: 0,
      completedDonations: 0,
      processingDonations: 0,
      failedDonations: 0,
      recentDonations: [],
    };
  }
};
