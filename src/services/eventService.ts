
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Event } from "@/types/event";

/**
 * Fetch all events from the database
 */
export const fetchEvents = async (): Promise<Event[]> => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true });
    
    if (error) {
      throw error;
    }
    
    return data.map(event => ({
      id: event.id,
      title: event.title,
      description: event.description,
      location: event.location,
      date: new Date(event.date),
      time: event.time,
      image: event.image || '/placeholder.svg'
    }));
  } catch (error) {
    console.error("Error fetching events:", error);
    toast.error("Failed to load events. Please try again.");
    return [];
  }
};

/**
 * Create a new event in the database
 */
export const createEvent = async (event: Omit<Event, 'id'>): Promise<Event | null> => {
  try {
    const { data, error } = await supabase
      .from('events')
      .insert([{
        title: event.title,
        description: event.description,
        location: event.location,
        date: event.date,
        time: event.time,
        image: event.image || '/placeholder.svg',
        created_by: (await supabase.auth.getUser()).data.user?.id
      }])
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      location: data.location,
      date: new Date(data.date),
      time: data.time,
      image: data.image || '/placeholder.svg'
    };
  } catch (error) {
    console.error("Error creating event:", error);
    toast.error("Failed to create event. Please try again.");
    return null;
  }
};

/**
 * Update an existing event in the database
 */
export const updateEvent = async (id: string, event: Partial<Event>): Promise<Event | null> => {
  try {
    const updateData: Record<string, any> = { ...event };
    
    // Convert Date object to ISO string for the database
    if (updateData.date instanceof Date) {
      updateData.date = updateData.date.toISOString().split('T')[0];
    }
    
    const { data, error } = await supabase
      .from('events')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      location: data.location,
      date: new Date(data.date),
      time: data.time,
      image: data.image || '/placeholder.svg'
    };
  } catch (error) {
    console.error(`Error updating event with ID ${id}:`, error);
    toast.error("Failed to update event. Please try again.");
    return null;
  }
};

/**
 * Delete an event from the database
 */
export const deleteEvent = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error(`Error deleting event with ID ${id}:`, error);
    toast.error("Failed to delete event. Please try again.");
    return false;
  }
};

/**
 * Register user for an event
 */
export const registerForEvent = async (eventId: string): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error("You must be logged in to register for events");
      return false;
    }
    
    const { error } = await supabase
      .from('event_registrations')
      .insert([{
        event_id: eventId,
        user_id: user.id,
        status: 'registered'
      }]);
    
    if (error) {
      // Check if it's a duplicate registration
      if (error.code === '23505') {
        toast.info("You are already registered for this event");
        return true;
      }
      throw error;
    }
    
    toast.success("Successfully registered for the event");
    return true;
  } catch (error) {
    console.error("Error registering for event:", error);
    toast.error("Failed to register for the event. Please try again.");
    return false;
  }
};

/**
 * Check if a user is registered for an event
 */
export const isUserRegisteredForEvent = async (eventId: string): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return false;
    }
    
    const { data, error } = await supabase
      .from('event_registrations')
      .select('*')
      .eq('event_id', eventId)
      .eq('user_id', user.id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No data found, user not registered
        return false;
      }
      throw error;
    }
    
    return !!data;
  } catch (error) {
    console.error("Error checking event registration:", error);
    return false;
  }
};
