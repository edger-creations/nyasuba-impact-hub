
import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Search } from "lucide-react";
import { ProgramForm } from "@/components/admin/programs/ProgramForm";
import { ProgramsTable } from "@/components/admin/programs/ProgramsTable";
import { Program } from "@/types/program";

// This would come from an API in a real application
const initialPrograms = [
  {
    id: "1",
    title: "Shelter for the Poor",
    description: "We build safe homes for vulnerable families, ensuring they have a secure place to thrive.",
    action: "Get Involved",
    link: "/volunteer",
    image: "/placeholder.svg",
  },
  {
    id: "2",
    title: "Education Assistance",
    description: "Providing scholarships and school supplies to underprivileged children for a brighter future.",
    action: "Sponsor a Child",
    link: "/donate",
    image: "/placeholder.svg",
  },
  {
    id: "3",
    title: "Tree Planting",
    description: "Promoting environmental sustainability through community-driven tree planting events.",
    action: "Join the Initiative",
    link: "/volunteer",
    image: "/placeholder.svg",
  },
  {
    id: "4",
    title: "Women Empowerment (Inua Miji)",
    description: "We empower women through training, resources, and micro-financing to uplift communities.",
    action: "Support Women",
    link: "/donate",
    image: "/placeholder.svg",
  },
  {
    id: "5",
    title: "Food Cultivation",
    description: "Creating sustainable food sources by cultivating community gardens and farms.",
    action: "Contribute Now",
    link: "/donate",
    image: "/placeholder.svg",
  },
  {
    id: "6",
    title: "Mobility for Disabled",
    description: "Financing medical treatment and providing mobility equipment for people with disabilities.",
    action: "Donate Equipment",
    link: "/donate",
    image: "/placeholder.svg",
  },
];

const ProgramsAdmin = () => {
  const [programs, setPrograms] = useState<Program[]>(initialPrograms);
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

  const filteredPrograms = programs.filter(program => 
    program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    program.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddOrEdit = () => {
    try {
      if (isEditing) {
        // Update existing program
        setPrograms(programs.map(p => p.id === currentProgram.id ? currentProgram : p));
        toast.success("Program updated successfully!");
      } else {
        // Add new program
        const newProgram = {
          ...currentProgram,
          id: Date.now().toString(),
        };
        setPrograms([...programs, newProgram]);
        toast.success("Program added successfully!");
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error("Failed to save program. Please try again.");
      console.error("Error saving program:", error);
    }
  };

  const handleDelete = (id: string) => {
    try {
      if (confirm("Are you sure you want to delete this program?")) {
        setPrograms(programs.filter(p => p.id !== id));
        toast.success("Program deleted successfully!");
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
        
        <div className="rounded-md border">
          <ProgramsTable
            programs={filteredPrograms}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default ProgramsAdmin;
