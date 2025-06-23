import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface EventNotificationData {
  eventTitle: string;
  eventDate: Date;
  eventTime: string;
  eventLocation: string;
  eventDescription: string;
}

export interface NotificationRecipient {
  id: string;
  email: string;
  name: string;
}

/**
 * Send notifications to users about upcoming events
 */
export const sendEventNotifications = async (
  eventData: EventNotificationData,
  recipientType: "all" | "volunteers" | "donors" | "custom",
  customRecipients?: NotificationRecipient[]
): Promise<boolean> => {
  try {
    // Get the admin user making the request
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("You must be logged in to send notifications");
    }
    
    // Fetch sender profile
    const { data: senderProfile } = await supabase
      .from('profiles')
      .select('first_name, last_name, is_verified')
      .eq('id', user.id)
      .single();
    
    if (!senderProfile?.is_verified) {
      throw new Error("Only verified admin users can send notifications");
    }
    
    // Get recipients based on type
    let recipients: NotificationRecipient[] = [];
    
    if (recipientType === "custom" && customRecipients) {
      recipients = customRecipients;
    } else {
      // Fetch recipients from database based on type
      const query = supabase
        .from('profiles')
        .select('id, email, first_name, last_name');
        
      if (recipientType === "volunteers") {
        const { data } = await supabase
          .from('volunteers')
          .select('user_id, email, first_name, last_name')
          .eq('status', 'approved');
          
        recipients = (data || []).map(volunteer => ({
          id: volunteer.user_id || '',
          email: volunteer.email,
          name: `${volunteer.first_name} ${volunteer.last_name}`
        }));
      } else if (recipientType === "donors") {
        const { data } = await supabase
          .from('donations')
          .select('user_id, profiles!inner(id, email, first_name, last_name)')
          .not('user_id', 'is', null)
          .order('date', { ascending: false })
          .limit(100); // Limit to recent donors
          
        // Extract unique donors
        const uniqueDonors = new Map();
        
        if (data) {
          data.forEach(item => {
            // Access the profiles object for the current item
            if (item.profiles && typeof item.profiles === 'object' && !Array.isArray(item.profiles)) {
              // Handle as object, not array
              const profile = item.profiles as { 
                id: string; 
                email: string; 
                first_name?: string; 
                last_name?: string; 
              };
              
              if (!uniqueDonors.has(profile.id)) {
                uniqueDonors.set(profile.id, {
                  id: profile.id,
                  email: profile.email,
                  name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
                });
              }
            }
          });
        }
        
        recipients = Array.from(uniqueDonors.values());
      } else {
        // All users (with registered emails)
        const { data } = await query;
        recipients = (data || []).map(profile => ({
          id: profile.id,
          email: profile.email,
          name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || profile.email.split('@')[0]
        }));
      }
    }
    
    // Filter out invalid emails
    recipients = recipients.filter(r => 
      r.email && r.email.includes('@') && r.email.includes('.')
    );
    
    if (recipients.length === 0) {
      throw new Error("No valid recipients found");
    }
    
    // Format event date nicely
    const formattedDate = new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(eventData.eventDate);
    
    // Log the notification to the database
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        sender_id: user.id,
        sender_name: `${senderProfile?.first_name || ''} ${senderProfile?.last_name || ''}`.trim(),
        subject: `Event: ${eventData.eventTitle}`,
        content: `
          Event: ${eventData.eventTitle}
          Date: ${formattedDate}
          Time: ${eventData.eventTime}
          Location: ${eventData.eventLocation}
          
          ${eventData.eventDescription}
        `,
        recipient_count: recipients.length,
        recipient_type: recipientType,
        status: 'sent'
      });
    
    if (error) throw error;
    
    toast.success(`Notifications sent to ${recipients.length} recipients`);
    return true;
  } catch (error) {
    console.error("Error sending notifications:", error);
    toast.error("Failed to send notifications. Please try again.");
    return false;
  }
};

/**
 * Get notification history
 */
export const getNotificationHistory = async (): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error("Error fetching notification history:", error);
    toast.error("Failed to load notification history. Please try again.");
    return [];
  }
};
