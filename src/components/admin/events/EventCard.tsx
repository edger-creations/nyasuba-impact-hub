
import { format } from "date-fns";
import { Pencil, Trash2, Send } from "lucide-react";
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
import { Event } from "@/types/event";

interface EventCardProps {
  event: Event;
  onEdit: (event: Event) => void;
  onDelete: (id: string) => void;
  onNotify: (event: Event) => void;
}

export function EventCard({ event, onEdit, onDelete, onNotify }: EventCardProps) {
  return (
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
            onClick={() => onEdit(event)}
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
                  onClick={() => onDelete(event.id)}
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
          onClick={() => onNotify(event)}
        >
          <Send className="h-4 w-4 mr-1" /> Notify Users
        </Button>
      </CardFooter>
    </Card>
  );
}
