
import { useState } from "react";
import { toast } from "sonner";
import { Mail, MessageSquare, Send, RefreshCw, Check, X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { NotificationRecipient, EventNotificationData, sendEventEmailNotifications, sendEventSMSNotifications } from "@/services/notificationService";
import { User, getRegisteredUsers } from "@/services/userService";

interface NotificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventData: EventNotificationData;
}

const NotificationModal = ({ open, onOpenChange, eventData }: NotificationModalProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [notificationType, setNotificationType] = useState("email");
  
  // Load users when modal opens
  const loadUsers = async () => {
    if (open && users.length === 0) {
      setIsLoadingUsers(true);
      try {
        const registeredUsers = await getRegisteredUsers();
        setUsers(registeredUsers);
        // Select all users by default
        setSelectedUserIds(registeredUsers.map(user => user.id));
      } catch (error) {
        console.error("Error loading users:", error);
        toast.error("Failed to load users");
      } finally {
        setIsLoadingUsers(false);
      }
    }
  };
  
  // Call loadUsers when modal opens
  useState(() => {
    if (open) {
      loadUsers();
    }
  });
  
  const handleToggleUser = (userId: string) => {
    setSelectedUserIds(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };
  
  const handleToggleAll = () => {
    if (selectedUserIds.length === users.length) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(users.map(user => user.id));
    }
  };
  
  const handleSendNotifications = async () => {
    if (selectedUserIds.length === 0) {
      toast.warning("Please select at least one recipient");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Get selected users
      const selectedUsers = users.filter(user => selectedUserIds.includes(user.id));
      
      // Map to notification recipients
      const recipients: NotificationRecipient[] = selectedUsers.map(user => ({
        email: user.email,
        name: user.name,
        phone: user.phone
      }));
      
      let success = false;
      
      // Send based on notification type
      if (notificationType === "email") {
        success = await sendEventEmailNotifications(recipients, eventData);
      } else if (notificationType === "sms") {
        success = await sendEventSMSNotifications(recipients, eventData);
      } else {
        // Send both
        success = await Promise.all([
          sendEventEmailNotifications(recipients, eventData),
          sendEventSMSNotifications(recipients, eventData)
        ]).then(results => results.some(result => result));
      }
      
      if (success) {
        toast.success(`Notifications sent successfully to ${selectedUserIds.length} recipient(s)`);
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Error sending notifications:", error);
      toast.error("Failed to send notifications");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Send Event Notifications</DialogTitle>
          <DialogDescription>
            Send notifications about "{eventData.eventTitle}" to registered users.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="email" onValueChange={setNotificationType}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="email">
              <Mail className="h-4 w-4 mr-2" /> Email
            </TabsTrigger>
            <TabsTrigger value="sms">
              <MessageSquare className="h-4 w-4 mr-2" /> SMS
            </TabsTrigger>
            <TabsTrigger value="both">
              <Send className="h-4 w-4 mr-2" /> Both
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="email">
            <p className="text-sm text-muted-foreground mb-4">
              Send email notifications using the configured SMTP server.
            </p>
          </TabsContent>
          
          <TabsContent value="sms">
            <p className="text-sm text-muted-foreground mb-4">
              Send SMS notifications using Twilio messaging service.
              <span className="block mt-1 text-xs text-amber-600">
                Note: Only recipients with phone numbers will receive SMS notifications.
              </span>
            </p>
          </TabsContent>
          
          <TabsContent value="both">
            <p className="text-sm text-muted-foreground mb-4">
              Send both email and SMS notifications to all selected recipients.
            </p>
          </TabsContent>
        </Tabs>
        
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">Select Recipients</h3>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleToggleAll}
              className="text-xs h-8"
            >
              {selectedUserIds.length === users.length ? "Deselect All" : "Select All"}
            </Button>
          </div>
          
          <Card>
            <CardContent className="p-2 max-h-[200px] overflow-y-auto">
              {isLoadingUsers ? (
                <div className="flex items-center justify-center p-4">
                  <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-sm text-muted-foreground">Loading users...</span>
                </div>
              ) : users.length === 0 ? (
                <p className="text-sm text-muted-foreground p-2">No registered users found.</p>
              ) : (
                <div className="space-y-2">
                  {users.map(user => (
                    <div key={user.id} className="flex items-center space-x-2 p-2 hover:bg-muted/50 rounded">
                      <Checkbox 
                        id={`user-${user.id}`}
                        checked={selectedUserIds.includes(user.id)}
                        onCheckedChange={() => handleToggleUser(user.id)}
                      />
                      <div className="grid gap-0.5">
                        <label 
                          htmlFor={`user-${user.id}`}
                          className="text-sm font-medium cursor-pointer"
                        >
                          {user.name}
                        </label>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground flex items-center">
                            <Mail className="h-3 w-3 mr-1" /> {user.email}
                          </span>
                          {user.phone ? (
                            <span className="text-xs text-muted-foreground flex items-center">
                              <MessageSquare className="h-3 w-3 mr-1" /> {user.phone}
                            </span>
                          ) : notificationType === "sms" ? (
                            <span className="text-xs text-red-500 flex items-center">
                              <X className="h-3 w-3 mr-1" /> No phone number
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSendNotifications}
            disabled={isLoading || selectedUserIds.length === 0}
          >
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Notifications
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationModal;
