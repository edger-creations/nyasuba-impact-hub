
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Donation {
  id: string;
  name: string;
  email: string;
  amount: number;
  currency: string;
  method: string;
  status: string;
  date: string;
  program_id?: string;
}

/**
 * Process a new donation
 */
export const processDonation = async (donation: Omit<Donation, 'id' | 'date' | 'status'>): Promise<{ success: boolean; transactionId?: string }> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from('donations')
      .insert([{
        amount: donation.amount,
        currency: donation.currency,
        method: donation.method,
        program_id: donation.program_id,
        user_id: user?.id,
        transaction_id: `ENF-${Date.now()}-${Math.floor(Math.random() * 1000)}`
      }])
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    toast.success("Thank you for your donation!");
    return {
      success: true,
      transactionId: data.transaction_id
    };
  } catch (error) {
    console.error("Error processing donation:", error);
    toast.error("Failed to process donation. Please try again.");
    return { success: false };
  }
};

/**
 * Fetch donations (admin only)
 */
export const fetchDonations = async (): Promise<Donation[]> => {
  try {
    const { data, error } = await supabase
      .from('donations')
      .select('*, profiles(email)')
      .order('date', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data.map(donation => ({
      id: donation.id,
      name: "Anonymous", // We don't store names directly
      email: donation.profiles?.email || "anonymous@example.com",
      amount: donation.amount,
      currency: donation.currency,
      method: donation.method,
      status: donation.status,
      date: new Date(donation.date).toISOString().split('T')[0],
      program_id: donation.program_id
    }));
  } catch (error) {
    console.error("Error fetching donations:", error);
    toast.error("Failed to load donations. Please try again.");
    return [];
  }
};
