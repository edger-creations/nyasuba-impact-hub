
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Review {
  id: string;
  name: string;
  content: string;
  avatar?: string;
  rating?: number;
  isApproved?: boolean;
}

/**
 * Fetch approved reviews from the database
 */
export const fetchApprovedReviews = async (): Promise<Review[]> => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('is_approved', true)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data.map(review => ({
      id: review.id,
      name: review.name,
      content: review.content,
      rating: review.rating,
      isApproved: review.is_approved
    }));
  } catch (error) {
    console.error("Error fetching reviews:", error);
    toast.error("Failed to load reviews. Please try again.");
    return [];
  }
};

/**
 * Fetch all reviews (for admin)
 */
export const fetchAllReviews = async (): Promise<Review[]> => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data.map(review => ({
      id: review.id,
      name: review.name,
      content: review.content,
      rating: review.rating,
      isApproved: review.is_approved
    }));
  } catch (error) {
    console.error("Error fetching all reviews:", error);
    toast.error("Failed to load reviews. Please try again.");
    return [];
  }
};

/**
 * Submit a new review
 */
export const submitReview = async (review: { name: string; content: string; rating?: number }): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase
      .from('reviews')
      .insert([{
        name: review.name,
        content: review.content,
        rating: review.rating || 5,
        user_id: user?.id,
        is_approved: false // Reviews require approval by default
      }]);
    
    if (error) {
      throw error;
    }
    
    toast.success("Your review has been submitted for approval. Thank you!");
    return true;
  } catch (error) {
    console.error("Error submitting review:", error);
    toast.error("Failed to submit review. Please try again.");
    return false;
  }
};

/**
 * Approve or reject a review (admin only)
 */
export const updateReviewStatus = async (reviewId: string, isApproved: boolean): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('reviews')
      .update({ is_approved: isApproved })
      .eq('id', reviewId);
    
    if (error) {
      throw error;
    }
    
    toast.success(`Review ${isApproved ? 'approved' : 'rejected'} successfully`);
    return true;
  } catch (error) {
    console.error("Error updating review status:", error);
    toast.error("Failed to update review status. Please try again.");
    return false;
  }
};
