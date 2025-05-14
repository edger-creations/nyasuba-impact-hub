
import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Search, Loader2 } from "lucide-react";
import { ProgramForm } from "@/components/admin/programs/ProgramForm";
import { ProgramsTable } from "@/components/admin/programs/ProgramsTable";
import { Program } from "@/types/program";
import { fetchPrograms, createProgram, updateProgram, deleteProgram } from "@/services/programService";

const ProgramsAdmin = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentProgram, setCurrentProgram] = useState<Program>({
    id: "",
    title: "",
    description: "",
    action: "",
    link: "",
    image: "/placeholder.svg",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load programs from the database
  useEffect(() => {
    const loadPrograms = async () => {
      try {
        setLoading(true);
        const data = await fetchPrograms();
        setPrograms(data);
      } catch (error) {
        console.error("Error loading programs:", error);
        toast.error("Failed to load programs. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    loadPrograms();
  }, []);

  const filteredPrograms = programs.filter(program => 
    program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    program.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddOrEdit = async () => {
    try {
      let updatedProgram;
      
      if (isEditing) {
        // Update existing program
        updatedProgram = await updateProgram(currentProgram.id, currentProgram);
        if (updatedProgram) {
          setPrograms(programs.map(p => p.id === currentProgram.id ? { ...updatedProgram, id: currentProgram.id } : p));
          toast.success("Program updated successfully!");
        }
      } else {
        // Add new program
        const { id, ...programData } = currentProgram;
        updatedProgram = await createProgram(programData);
        if (updatedProgram) {
          setPrograms([...programs, updatedProgram]);
          toast.success("Program added successfully!");
        }
      }
      
      if (updatedProgram) {
        setIsDialogOpen(false);
        resetForm();
      }
    } catch (error) {
      toast.error("Failed to save program. Please try again.");
      console.error("Error saving program:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      if (confirm("Are you sure you want to delete this program?")) {
        const success = await deleteProgram(id);
        if (success) {
          setPrograms(programs.filter(p => p.id !== id));
          toast.success("Program deleted successfully!");
        }
      }
    } catch (error) {
      toast.error("Failed to delete program. Please try again.");
      console.error("Error deleting program:", error);
    }
  };

  const handleEdit = (program: Program) => {
    setCurrentProgram(program);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setCurrentProgram({
      id: "",
      title: "",
      description: "",
      action: "",
      link: "",
      image: "/placeholder.svg",
    });
    setIsEditing(false);
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manage Programs</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-enf-green hover:bg-enf-dark-green"
                onClick={() => {
                  resetForm();
                  setIsDialogOpen(true);
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Program
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[725px]">
              <DialogHeader>
                <DialogTitle>{isEditing ? "Edit Program" : "Add New Program"}</DialogTitle>
                <DialogDescription>
                  {isEditing 
                    ? "Update the details of the existing program." 
                    : "Add a new program to the Esther Nyasuba Foundation."}
                </DialogDescription>
              </DialogHeader>
              <ProgramForm
                currentProgram={currentProgram}
                setCurrentProgram={setCurrentProgram}
                onCancel={() => setIsDialogOpen(false)}
                onSubmit={handleAddOrEdit}
                isEditing={isEditing}
              />
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search programs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-enf-green" />
          </div>
        ) : (
          <div className="rounded-md border">
            <ProgramsTable
              programs={filteredPrograms}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ProgramsAdmin;
