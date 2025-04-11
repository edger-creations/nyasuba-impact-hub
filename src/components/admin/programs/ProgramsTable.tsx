
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Program } from "@/types/program";
import { Edit, Trash } from "lucide-react";

interface ProgramsTableProps {
  programs: Program[];
  onEdit: (program: Program) => void;
  onDelete: (id: string) => void;
}

export function ProgramsTable({ programs, onEdit, onDelete }: ProgramsTableProps) {
  return (
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
        {programs.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-4">
              No programs found
            </TableCell>
          </TableRow>
        ) : (
          programs.map((program) => (
            <TableRow key={program.id}>
              <TableCell className="font-medium">{program.title}</TableCell>
              <TableCell className="max-w-[300px] truncate">{program.description}</TableCell>
              <TableCell>{program.action}</TableCell>
              <TableCell>{program.link}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(program)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(program.id)}
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
  );
}
