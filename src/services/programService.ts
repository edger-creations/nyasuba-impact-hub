
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Program } from "@/types/program";

/**
 * Fetch all programs from the database
 */
export const fetchPrograms = async (): Promise<Program[]> => {
  try {
    const { data, error } = await supabase
      .from('programs')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data.map(program => ({
      id: program.id,
      title: program.title,
      description: program.description,
      action: program.action,
      link: program.link,
      image: program.image || '/placeholder.svg'
    }));
  } catch (error) {
    console.error("Error fetching programs:", error);
    toast.error("Failed to load programs. Please try again.");
    return [];
  }
};

/**
 * Create a new program in the database
 */
export const createProgram = async (program: Omit<Program, 'id'>): Promise<Program | null> => {
  try {
    const { data, error } = await supabase
      .from('programs')
      .insert([program])
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Error creating program:", error);
    toast.error("Failed to create program. Please try again.");
    return null;
  }
};

/**
 * Update an existing program in the database
 */
export const updateProgram = async (id: string, program: Partial<Program>): Promise<Program | null> => {
  try {
    const { data, error } = await supabase
      .from('programs')
      .update(program)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error(`Error updating program with ID ${id}:`, error);
    toast.error("Failed to update program. Please try again.");
    return null;
  }
};

/**
 * Delete a program from the database
 */
export const deleteProgram = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('programs')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error(`Error deleting program with ID ${id}:`, error);
    toast.error("Failed to delete program. Please try again.");
    return false;
  }
};
