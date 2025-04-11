
import { useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";

import AdminLayout from "@/components/admin/AdminLayout";
import NotificationModal from "@/components/admin/NotificationModal";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { EventForm, EventFormValues, eventFormSchema } from "@/components/admin/events/EventForm";
import { EventCard } from "@/components/admin/events/EventCard";
import { EventTable } from "@/components/admin/events/EventTable";
import { Event } from "@/types/event";
import { EventNotificationData } from "@/services/notificationService";

const initialEvents: Event[] = [
  {
    id: '1',
    title: 'Community Outreach',
    description: 'Join us for a day of giving back to the community with various activities and initiatives.',
    location: 'Nairobi Community Center',
    date: new Date('2025-05-15'),
    time: '10:00 AM',
    image: '',
  },
  {
    id: '2',
    title: 'Fundraising Gala',
    description: 'Annual fundraising event to support our educational programs.',
    location: 'Serena Hotel',
    date: new Date('2025-06-20'),
    time: '7:00 PM',
    image: '',
  }
];

const AdminEvents = () => {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  const handleAddEvent = (data: EventFormValues) => {
    setIsLoading(true);
    
    try {
      setTimeout(() => {
        const newEvent: Event = {
          id: Date.now().toString(),
          title: data.title,
          description: data.description,
          location: data.location,
          date: data.date,
          time: data.time,
          image: data.image || '',
        };
        
        setEvents([...events, newEvent]);
        setIsAddDialogOpen(false);
        setIsLoading(false);
        
        toast.success("Event created successfully!");
      }, 800);
    } catch (error) {
      setIsLoading(false);
      toast.error("Failed to create event. Please try again.");
      console.error("Error creating event:", error);
    }
  };

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsEditDialogOpen(true);
  };

  const handleUpdateEvent = (data: EventFormValues) => {
    setIsLoading(true);
    
    if (!selectedEvent) {
      setIsLoading(false);
      return;
    }
    
    try {
      setTimeout(() => {
        const updatedEvents = events.map(event => 
          event.id === selectedEvent.id 
            ? { 
                ...event, 
                title: data.title,
                description: data.description,
                location: data.location,
                date: data.date,
                time: data.time,
                image: data.image || '',
              } 
            : event
        );
        
        setEvents(updatedEvents);
        setIsEditDialogOpen(false);
        setSelectedEvent(null);
        setIsLoading(false);
        
        toast.success("Event updated successfully!");
      }, 800);
    } catch (error) {
      setIsLoading(false);
      toast.error("Failed to update event. Please try again.");
      console.error("Error updating event:", error);
    }
  };

  const handleDeleteEvent = (id: string) => {
    setIsLoading(true);
    
    try {
      setTimeout(() => {
        const filteredEvents = events.filter(event => event.id !== id);
        setEvents(filteredEvents);
        setIsLoading(false);
        
        toast.success("Event deleted successfully!");
      }, 800);
    } catch (error) {
      setIsLoading(false);
      toast.error("Failed to delete event. Please try again.");
      console.error("Error deleting event:", error);
    }
  };

  const handleSendNotifications = (event: Event) => {
    setSelectedEvent(event);
    
    const eventData: EventNotificationData = {
      eventTitle: event.title,
      eventDate: new Date(event.date),
      eventTime: event.time,
      eventLocation: event.location,
      eventDescription: event.description
    };
    
    setIsNotificationModalOpen(true);
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Event Management</h1>
            <p className="text-muted-foreground">
              Create, edit, and manage events for Esther Nyasuba Foundation.
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add New Event
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
                <DialogDescription>
                  Fill in the details below to create a new event. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              
              <EventForm 
                onSubmit={handleAddEvent}
                onCancel={() => setIsAddDialogOpen(false)}
                isLoading={isLoading}
                submitLabel="Create Event"
              />
            </DialogContent>
          </Dialog>
        </div>

        {selectedEvent && (
          <>
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Edit Event</DialogTitle>
                  <DialogDescription>
                    Update the event details below.
                  </DialogDescription>
                </DialogHeader>
                
                <EventForm 
                  defaultValues={{
                    title: selectedEvent.title,
                    description: selectedEvent.description,
                    location: selectedEvent.location,
                    date: new Date(selectedEvent.date),
                    time: selectedEvent.time,
                    image: selectedEvent.image,
                  }}
                  onSubmit={handleUpdateEvent}
                  onCancel={() => setIsEditDialogOpen(false)}
                  isLoading={isLoading}
                  submitLabel="Update Event"
                />
              </DialogContent>
            </Dialog>

            <NotificationModal
              open={isNotificationModalOpen}
              onOpenChange={setIsNotificationModalOpen}
              eventData={{
                eventTitle: selectedEvent.title,
                eventDate: new Date(selectedEvent.date),
                eventTime: selectedEvent.time,
                eventLocation: selectedEvent.location,
                eventDescription: selectedEvent.description
              }}
            />
          </>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onEdit={handleEditEvent}
              onDelete={handleDeleteEvent}
              onNotify={handleSendNotifications}
            />
          ))}
        </div>

        {events.length === 0 && (
          <div className="text-center py-10">
            <p className="text-muted-foreground">No events found. Click "Add New Event" to create one.</p>
          </div>
        )}

        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
          <Card>
            <CardContent className="p-0">
              <EventTable
                events={events}
                onEdit={handleEditEvent}
                onDelete={handleDeleteEvent}
                onNotify={handleSendNotifications}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminEvents;
