
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DialogFooter } from "@/components/ui/dialog";
import { Program } from "@/types/program";
import { Image } from "lucide-react";
import { useState } from "react";

interface ProgramFormProps {
  currentProgram: Program;
  setCurrentProgram: (program: Program) => void;
  onCancel: () => void;
  onSubmit: () => void;
  isEditing: boolean;
}

export function ProgramForm({
  currentProgram,
  setCurrentProgram,
  onCancel,
  onSubmit,
  isEditing
}: ProgramFormProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    currentProgram.image && currentProgram.image !== "/placeholder.svg" 
      ? currentProgram.image 
      : null
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload this to your server or cloud storage
      // For now, we'll create a local object URL for preview
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      
      // In a real application, you would get the URL from your upload service
      // For now, we're just using the local preview URL
      setCurrentProgram({...currentProgram, image: objectUrl});
    }
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="title" className="text-right">
          Title
        </Label>
        <Input
          id="title"
          value={currentProgram.title}
          onChange={(e) => setCurrentProgram({...currentProgram, title: e.target.value})}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-start gap-4">
        <Label htmlFor="description" className="text-right pt-2">
          Description
        </Label>
        <Textarea
          id="description"
          value={currentProgram.description}
          onChange={(e) => setCurrentProgram({...currentProgram, description: e.target.value})}
          className="col-span-3"
          rows={4}
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="action" className="text-right">
          Action Button Text
        </Label>
        <Input
          id="action"
          value={currentProgram.action}
          onChange={(e) => setCurrentProgram({...currentProgram, action: e.target.value})}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="link" className="text-right">
          Link
        </Label>
        <Input
          id="link"
          value={currentProgram.link}
          onChange={(e) => setCurrentProgram({...currentProgram, link: e.target.value})}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-start gap-4">
        <Label htmlFor="image" className="text-right pt-2">
          Program Image
        </Label>
        <div className="col-span-3">
          <div className="flex items-center gap-4 mb-2">
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="flex-1"
            />
          </div>
          {previewUrl || currentProgram.image ? (
            <div className="mt-2 border rounded-md p-2 relative">
              <img 
                src={previewUrl || currentProgram.image} 
                alt="Program preview" 
                className="w-full h-48 object-cover rounded"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-48 bg-muted rounded-md border">
              <Image className="h-12 w-12 text-gray-400" />
              <p className="text-sm text-muted-foreground">No image selected</p>
            </div>
          )}
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          type="button" 
          className="bg-enf-green hover:bg-enf-dark-green"
          onClick={onSubmit}
          disabled={!currentProgram.title || !currentProgram.description}
        >
          {isEditing ? "Update Program" : "Add Program"}
        </Button>
      </DialogFooter>
    </div>
  );
}
