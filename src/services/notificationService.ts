
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
    if (!recipients || recipients.length === 0) {
      toast.warning("No recipients selected for email notifications");
      return false;
    }

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
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    toast.error(`Failed to send email notifications: ${errorMessage}`);
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
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    toast.error(`Failed to send SMS notifications: ${errorMessage}`);
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
  try {
    if (!recipients || recipients.length === 0) {
      toast.warning("No recipients selected for notifications");
      return false;
    }

    const emailResult = await sendEventEmailNotifications(recipients, eventData);
    const smsResult = await sendEventSMSNotifications(recipients, eventData);
    
    if (emailResult && smsResult) {
      toast.success("All notifications sent successfully");
    } else if (emailResult) {
      toast.success("Email notifications sent successfully");
      toast.warning("SMS notifications could not be sent");
    } else if (smsResult) {
      toast.success("SMS notifications sent successfully");
      toast.warning("Email notifications could not be sent");
    } else {
      toast.error("Failed to send any notifications");
      return false;
    }
    
    return emailResult || smsResult;
  } catch (error) {
    console.error("Error sending notifications:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    toast.error(`Failed to send notifications: ${errorMessage}`);
    return false;
  }
};
