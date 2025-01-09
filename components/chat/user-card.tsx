import React, { useState, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Badge } from '../ui/badge';
import { useAuth } from '@/context/authContext';
import { Separator } from '../ui/separator';
import { usePalette } from 'color-thief-react';

interface UserCardProps {
  senderDisplayName: string;
  senderID: string;
}

const getGradient = (palette: number[][] | undefined) => {
  return palette
    ? `linear-gradient(180deg, rgba(${palette[0][0]}, ${palette[0][1]}, ${palette[0][2]}, 0.8), rgba(${palette[1][0]}, ${palette[1][1]}, ${palette[1][2]}, 0.4))`
    : 'linear-gradient(180deg, #ff7e5f, #feb47b)'; // Default gradient
};

export default function UserCard({ senderDisplayName, senderID }: UserCardProps) {
  const { getUserFromDatabase } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUserFromDatabase(senderID);
      setUser(user);
    };

    if (isOpen) {
      fetchUser();
    }
  }, [isOpen]);

  return (
    <Popover onOpenChange={setIsOpen}>
      <PopoverTrigger className='flex items-center gap-2 cursor-pointer'>
        {senderDisplayName || 'Unknown User'} {senderID === "system" ? <Badge>System</Badge> : null}
      </PopoverTrigger>
      <PopoverContent side="right" sideOffset={5} className="bg-sidebar text-white rounded-lg shadow-lg p-0">
        {user ? (
          <UserCardContent user={user} />
        ) : (
          <div className='w-full h-12 flex items-center justify-center'>
            <div className='w-4 h-4 border-t-2 border-b-2 border-white rounded-full animate-spin'></div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

export function UserCardContent({ user }: { user: any }) {
  const { data: palette } = usePalette(user?.photoURL, 5, 'rgbArray', { crossOrigin: 'Anonymous' });
  const gradient = getGradient(palette);

  return (
    <div className='flex flex-col gap-2'>
      <div>
        <div className='w-full h-24 object-cover rounded-t-lg' style={{ background: gradient }}></div>
        <Separator className='w-full' />
      </div>
      <div className='flex gap-2 items-start px-4 absolute'>
        <img src={user.photoURL} alt={user.displayName} className='h-24 w-24 rounded-full relative top-12 border-4 border-sidebar' />
      </div>
      <div className='flex flex-col gap-2 pt-12 px-4'>
        <span className='text-lg font-semibold'>{user.displayName}</span>
      </div>
      <Separator className='w-full' />
    </div>
  );
}
