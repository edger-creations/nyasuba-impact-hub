
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DialogFooter } from "@/components/ui/dialog";
import { Program } from "@/types/program";

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
