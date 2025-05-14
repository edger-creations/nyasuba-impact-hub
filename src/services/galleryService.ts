
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface GalleryItem {
  id: string;
  type: "image" | "video";
  src: string;
  alt: string;
  description: string;
  featured: boolean;
  category?: string;
}

/**
 * Fetch all gallery items from the database
 */
export const fetchGalleryItems = async (): Promise<GalleryItem[]> => {
  try {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data.map(item => ({
      id: item.id,
      type: item.category === 'video' ? 'video' : 'image',
      src: item.image_url || '/placeholder.svg',
      alt: item.title,
      description: item.description || '',
      featured: !!item.is_featured,
      category: item.category
    }));
  } catch (error) {
    console.error("Error fetching gallery items:", error);
    toast.error("Failed to load gallery items. Please try again.");
    return [];
  }
};

/**
 * Create a new gallery item in the database
 */
export const createGalleryItem = async (item: Omit<GalleryItem, 'id'>): Promise<GalleryItem | null> => {
  try {
    const { data, error } = await supabase
      .from('gallery')
      .insert([{
        title: item.alt,
        description: item.description,
        image_url: item.src,
        category: item.type === 'video' ? 'video' : item.category || 'image',
        is_featured: item.featured,
        is_published: true,
        created_by: (await supabase.auth.getUser()).data.user?.id
      }])
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return {
      id: data.id,
      type: data.category === 'video' ? 'video' : 'image',
      src: data.image_url || '/placeholder.svg',
      alt: data.title,
      description: data.description || '',
      featured: !!data.is_featured,
      category: data.category
    };
  } catch (error) {
    console.error("Error creating gallery item:", error);
    toast.error("Failed to create gallery item. Please try again.");
    return null;
  }
};

/**
 * Update an existing gallery item in the database
 */
export const updateGalleryItem = async (id: string, item: Partial<GalleryItem>): Promise<GalleryItem | null> => {
  try {
    const updateData: Record<string, any> = {};
    
    if (item.alt !== undefined) updateData.title = item.alt;
    if (item.description !== undefined) updateData.description = item.description;
    if (item.src !== undefined) updateData.image_url = item.src;
    if (item.type !== undefined) updateData.category = item.type === 'video' ? 'video' : item.category;
    if (item.featured !== undefined) updateData.is_featured = item.featured;
    
    const { data, error } = await supabase
      .from('gallery')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return {
      id: data.id,
      type: data.category === 'video' ? 'video' : 'image',
      src: data.image_url || '/placeholder.svg',
      alt: data.title,
      description: data.description || '',
      featured: !!data.is_featured,
      category: data.category
    };
  } catch (error) {
    console.error(`Error updating gallery item with ID ${id}:`, error);
    toast.error("Failed to update gallery item. Please try again.");
    return null;
  }
};

/**
 * Delete a gallery item from the database
 */
export const deleteGalleryItem = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('gallery')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error(`Error deleting gallery item with ID ${id}:`, error);
    toast.error("Failed to delete gallery item. Please try again.");
    return false;
  }
};
