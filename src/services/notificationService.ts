
import { toast } from "sonner";

// Email configuration
const SMTP_CONFIG = {
  host: "smtp.gmail.com",
  user: "nyasubaesther64@gmail.com",
  password: "gwfj fmhq hbqv ixwk",
  port: 587
};

// Twilio configuration
const TWILIO_PHONE = "+254111889397";

export interface NotificationRecipient {
  email: string;
  name: string;
  phone?: string;
}

export interface EventNotificationData {
  eventTitle: string;
  eventDate: Date;
  eventTime: string;
  eventLocation: string;
  eventDescription: string;
}

/**
 * Send email notifications to users about an event
 */
export const sendEventEmailNotifications = async (
  recipients: NotificationRecipient[],
  eventData: EventNotificationData
): Promise<boolean> => {
  try {
    // In a real application, this would make an API call to a backend service
    // that would handle the actual sending of emails using the SMTP configuration
    
    // Simulate API call with a delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log("Sending email notifications with the following data:", {
      smtpConfig: SMTP_CONFIG,
      recipients,
      eventData
    });
    
    // Log success for demo purposes
    console.log(`Successfully sent ${recipients.length} email notifications`);
    
    return true;
  } catch (error) {
    console.error("Error sending email notifications:", error);
    toast.error("Failed to send email notifications");
    return false;
  }
};

/**
 * Send SMS notifications to users about an event
 */
export const sendEventSMSNotifications = async (
  recipients: NotificationRecipient[],
  eventData: EventNotificationData
): Promise<boolean> => {
  try {
    // Filter recipients who have phone numbers
    const recipientsWithPhones = recipients.filter(r => r.phone);
    
    if (recipientsWithPhones.length === 0) {
      toast.warning("No recipients with phone numbers found");
      return false;
    }
    
    // In a real application, this would make an API call to Twilio
    // Simulate API call with a delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    console.log("Sending SMS notifications with the following data:", {
      twilioPhone: TWILIO_PHONE,
      recipients: recipientsWithPhones,
      eventData
    });
    
    // Log success for demo purposes
    console.log(`Successfully sent ${recipientsWithPhones.length} SMS notifications`);
    
    return true;
  } catch (error) {
    console.error("Error sending SMS notifications:", error);
    toast.error("Failed to send SMS notifications");
    return false;
  }
};

/**
 * Send both email and SMS notifications for an event
 */
export const sendEventNotifications = async (
  recipients: NotificationRecipient[],
  eventData: EventNotificationData
): Promise<boolean> => {
  const emailResult = await sendEventEmailNotifications(recipients, eventData);
  const smsResult = await sendEventSMSNotifications(recipients, eventData);
  
  return emailResult || smsResult;
};
