
import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Edit, Trash, Plus, Search } from "lucide-react";

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
  const [programs, setPrograms] = useState(initialPrograms);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentProgram, setCurrentProgram] = useState({
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
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this program?")) {
      setPrograms(programs.filter(p => p.id !== id));
      toast.success("Program deleted successfully!");
    }
  };

  const handleEdit = (program: typeof currentProgram) => {
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
            <DialogContent className="sm:max-w-[625px]">
              <DialogHeader>
                <DialogTitle>{isEditing ? "Edit Program" : "Add New Program"}</DialogTitle>
                <DialogDescription>
                  {isEditing 
                    ? "Update the details of the existing program." 
                    : "Add a new program to the Esther Nyasuba Foundation."}
                </DialogDescription>
              </DialogHeader>
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
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  type="button" 
                  className="bg-enf-green hover:bg-enf-dark-green"
                  onClick={handleAddOrEdit}
                  disabled={!currentProgram.title || !currentProgram.description}
                >
                  {isEditing ? "Update Program" : "Add Program"}
                </Button>
              </DialogFooter>
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Link</TableHead>
                <TableHead className="text-right">Options</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPrograms.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No programs found
                  </TableCell>
                </TableRow>
              ) : (
                filteredPrograms.map((program) => (
                  <TableRow key={program.id}>
                    <TableCell className="font-medium">{program.title}</TableCell>
                    <TableCell className="max-w-[300px] truncate">{program.description}</TableCell>
                    <TableCell>{program.action}</TableCell>
                    <TableCell>{program.link}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(program)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(program.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/10"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ProgramsAdmin;
