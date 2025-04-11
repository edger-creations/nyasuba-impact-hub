import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Plus, Pencil, Trash2, Send, RefreshCw } from "lucide-react";
import * as z from "zod";
import { toast } from "sonner";

import AdminLayout from "@/components/admin/AdminLayout";
import NotificationModal from "@/components/admin/NotificationModal";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { EventNotificationData } from "@/services/notificationService";

const eventFormSchema = z.object({
  title: z.string().min(3, {
    message: "Event title must be at least 3 characters.",
  }),
  description: z.string().min(10, {
    message: "Event description must be at least 10 characters.",
  }),
  location: z.string().min(3, {
    message: "Location must be at least 3 characters.",
  }),
  date: z.date({
    required_error: "Please select a date for the event.",
  }),
  time: z.string().min(1, {
    message: "Please specify a time for the event.",
  }),
  image: z.string().optional(),
});

interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  date: Date;
  time: string;
  image: string;
}

type EventFormValues = z.infer<typeof eventFormSchema>;

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

  const addForm = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: '',
      description: '',
      location: '',
      time: '',
      image: '',
    },
  });

  const editForm = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: '',
      description: '',
      location: '',
      time: '',
      image: '',
    },
  });

  const onAddSubmit = (data: EventFormValues) => {
    setIsLoading(true);
    
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
      addForm.reset();
      setIsLoading(false);
      
      toast.success("Event created successfully!");
    }, 800);
  };

  const onEditSubmit = (data: EventFormValues) => {
    setIsLoading(true);
    
    if (!selectedEvent) {
      setIsLoading(false);
      return;
    }
    
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
  };

  const handleDeleteEvent = (id: string) => {
    setIsLoading(true);
    
    setTimeout(() => {
      const filteredEvents = events.filter(event => event.id !== id);
      setEvents(filteredEvents);
      setIsLoading(false);
      
      toast.success("Event deleted successfully!");
    }, 800);
  };

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    
    editForm.reset({
      title: event.title,
      description: event.description,
      location: event.location,
      date: new Date(event.date),
      time: event.time,
      image: event.image || '',
    });
    
    setIsEditDialogOpen(true);
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
              
              <Form {...addForm}>
                <form onSubmit={addForm.handleSubmit(onAddSubmit)} className="space-y-4">
                  <FormField
                    control={addForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter event title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={addForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter event description" 
                            className="min-h-[100px]" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={addForm.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter event location" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={addForm.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={addForm.control}
                      name="time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Time</FormLabel>
                          <FormControl>
                            <Input 
                              type="time"
                              placeholder="Enter event time" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={addForm.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image URL (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter image URL" {...field} />
                        </FormControl>
                        <FormDescription>
                          Provide a URL for an image related to this event
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        "Create Event"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {selectedEvent && (
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
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Card key={event.id}>
              <CardHeader>
                <CardTitle>{event.title}</CardTitle>
                <CardDescription>
                  {format(new Date(event.date), "MMMM d, yyyy")} at {event.time}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                <p className="text-sm font-medium">Location: {event.location}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleEditEvent(event)}
                  >
                    <Pencil className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700">
                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the event
                          and remove it from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteEvent(event.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-blue-500"
                  onClick={() => handleSendNotifications(event)}
                >
                  <Send className="h-4 w-4 mr-1" /> Notify Users
                </Button>
              </CardFooter>
            </Card>
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">{event.title}</TableCell>
                      <TableCell>
                        {format(new Date(event.date), "MMM d, yyyy")} at {event.time}
                      </TableCell>
                      <TableCell>{event.location}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleEditEvent(event)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-red-500">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the event.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteEvent(event.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                          
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-blue-500"
                            onClick={() => handleSendNotifications(event)}
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  
                  {events.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-6">
                        No upcoming events found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminEvents;
