
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Plus, Loader2 } from "lucide-react";

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

import { EventForm, EventFormValues } from "@/components/admin/events/EventForm";
import { EventCard } from "@/components/admin/events/EventCard";
import { EventTable } from "@/components/admin/events/EventTable";
import { Event } from "@/types/event";
import { EventNotificationData } from "@/services/notificationService";
import { fetchEvents, createEvent, updateEvent, deleteEvent } from "@/services/eventService";

const AdminEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  // Load events from the database
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setIsFetching(true);
        const data = await fetchEvents();
        setEvents(data);
      } catch (error) {
        toast.error("Failed to load events. Please refresh the page to try again.");
        console.error("Error loading events:", error);
      } finally {
        setIsFetching(false);
      }
    };

    loadEvents();
  }, []);

  const handleAddEvent = async (data: EventFormValues) => {
    setIsLoading(true);
    
    try {
      const newEvent = await createEvent({
        title: data.title,
        description: data.description,
        location: data.location,
        date: data.date,
        time: data.time,
        image: data.image || '/placeholder.svg',
      });
      
      if (newEvent) {
        setEvents([...events, newEvent]);
        setIsAddDialogOpen(false);
        toast.success("Event created successfully!");
      }
    } catch (error) {
      toast.error("Failed to create event. Please try again.");
      console.error("Error creating event:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsEditDialogOpen(true);
  };

  const handleUpdateEvent = async (data: EventFormValues) => {
    setIsLoading(true);
    
    if (!selectedEvent) {
      setIsLoading(false);
      return;
    }
    
    try {
      const updatedEvent = await updateEvent(selectedEvent.id, {
        title: data.title,
        description: data.description,
        location: data.location,
        date: data.date,
        time: data.time,
        image: data.image || '/placeholder.svg',
      });
      
      if (updatedEvent) {
        setEvents(events.map(event => 
          event.id === selectedEvent.id ? updatedEvent : event
        ));
        setIsEditDialogOpen(false);
        setSelectedEvent(null);
        toast.success("Event updated successfully!");
      }
    } catch (error) {
      toast.error("Failed to update event. Please try again.");
      console.error("Error updating event:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    setIsLoading(true);
    
    try {
      const success = await deleteEvent(id);
      
      if (success) {
        setEvents(events.filter(event => event.id !== id));
        toast.success("Event deleted successfully!");
      }
    } catch (error) {
      toast.error("Failed to delete event. Please try again.");
      console.error("Error deleting event:", error);
    } finally {
      setIsLoading(false);
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

        {isFetching ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-enf-green" />
          </div>
        ) : (
          <>
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

            {events.length > 0 && (
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
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminEvents;
