
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, CheckCircle2, Users, UserCheck, CreditCard } from "lucide-react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  EventNotificationData, 
  sendEventNotifications,
  NotificationRecipient 
} from "@/services/notificationService";

interface NotificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventData: EventNotificationData;
}

export default function NotificationModal({
  open,
  onOpenChange,
  eventData,
}: NotificationModalProps) {
  const [isSending, setIsSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [recipientType, setRecipientType] = useState<"all" | "volunteers" | "donors" | "custom">("all");
  const [customMessage, setCustomMessage] = useState("");

  const handleSendNotifications = async () => {
    setIsSending(true);
    
    try {
      const result = await sendEventNotifications(
        eventData,
        recipientType,
      );
      
      if (result) {
        setSuccess(true);
        setTimeout(() => {
          onOpenChange(false);
          setSuccess(false);
          setCustomMessage("");
        }, 2000);
      }
    } catch (error) {
      console.error("Error in notification modal:", error);
    } finally {
      setIsSending(false);
    }
  };

  const resetForm = () => {
    setSuccess(false);
    setCustomMessage("");
    setRecipientType("all");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!newOpen) {
          resetForm();
        }
        onOpenChange(newOpen);
      }}
    >
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Send Event Notifications</DialogTitle>
          <DialogDescription>
            Notify users about this event. Choose who should receive the notification.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6 py-4">
          {success ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <CheckCircle2 className="mb-2 h-12 w-12 text-green-500" />
              <h3 className="text-xl font-medium">Notifications Sent!</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Your event notifications have been sent successfully.
              </p>
            </div>
          ) : (
            <>
              <div className="bg-muted p-4 rounded-md">
                <h3 className="font-medium mb-2">{eventData.eventTitle}</h3>
                <div className="text-sm text-muted-foreground">
                  <p>Date: {format(eventData.eventDate, "PPP")}</p>
                  <p>Time: {eventData.eventTime}</p>
                  <p>Location: {eventData.eventLocation}</p>
                </div>
              </div>

              <Tabs defaultValue="recipients" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="recipients">Recipients</TabsTrigger>
                  <TabsTrigger value="preview">Message Preview</TabsTrigger>
                </TabsList>
                
                <TabsContent value="recipients" className="space-y-4 pt-4">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-2">
                      <Checkbox 
                        id="all" 
                        checked={recipientType === "all"} 
                        onCheckedChange={() => setRecipientType("all")}
                      />
                      <div className="space-y-1 leading-none">
                        <Label htmlFor="all" className="flex items-center space-x-2">
                          <Users className="h-4 w-4" />
                          <span>All Users</span>
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Send to all registered users
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <Checkbox 
                        id="volunteers" 
                        checked={recipientType === "volunteers"} 
                        onCheckedChange={() => setRecipientType("volunteers")}
                      />
                      <div className="space-y-1 leading-none">
                        <Label htmlFor="volunteers" className="flex items-center space-x-2">
                          <UserCheck className="h-4 w-4" />
                          <span>Volunteers Only</span>
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Send to approved volunteers
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <Checkbox 
                        id="donors" 
                        checked={recipientType === "donors"} 
                        onCheckedChange={() => setRecipientType("donors")}
                      />
                      <div className="space-y-1 leading-none">
                        <Label htmlFor="donors" className="flex items-center space-x-2">
                          <CreditCard className="h-4 w-4" />
                          <span>Donors Only</span>
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Send to users who have donated
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 pt-2">
                    <Label htmlFor="custom-message">Add custom message (optional)</Label>
                    <Textarea
                      id="custom-message"
                      placeholder="Enter additional information about this event..."
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="preview" className="space-y-4 pt-4">
                  <div className="bg-muted p-4 rounded-md">
                    <h4 className="font-medium mb-2">Subject: Event: {eventData.eventTitle}</h4>
                    <div className="text-sm">
                      <p>Event: {eventData.eventTitle}</p>
                      <p>Date: {format(eventData.eventDate, "PPP")}</p>
                      <p>Time: {eventData.eventTime}</p>
                      <p>Location: {eventData.eventLocation}</p>
                      <p className="pt-4">{eventData.eventDescription}</p>
                      {customMessage && (
                        <p className="pt-2">{customMessage}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    This message will be sent to {
                      recipientType === "all" ? "all users" :
                      recipientType === "volunteers" ? "all volunteers" :
                      recipientType === "donors" ? "all donors" :
                      "selected recipients"
                    }.
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSendNotifications}
            disabled={isSending || success}
          >
            {isSending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : success ? (
              "Sent!"
            ) : (
              "Send Notifications"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
