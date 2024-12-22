import React from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog';
import { Button } from './button';
import { useAuth } from '@/context/authContext';
import { DoorOpenIcon, UserMinusIcon } from 'lucide-react';

// Define props for the LeaveChat component
interface LeaveChatProps {
  chatId: string;
  userId: string;
}

export default function LeaveChat({ chatId, userId }: LeaveChatProps) {
  const { removeUserFromChat } = useAuth();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive" className="w-full h-full" size="default">
          <DoorOpenIcon size={24} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Leave Chat</DialogTitle>
          <DialogDescription>Are you sure you want to leave?</DialogDescription>
        </DialogHeader>
        <DialogFooter>
            <DialogClose asChild>
                <Button
                    onClick={() => {
                    removeUserFromChat(chatId, userId, 'leave');
                    }}
                >
                    Leave
                </Button>
            </DialogClose>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
