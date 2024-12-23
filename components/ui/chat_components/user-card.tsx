import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../popover'
import { Badge } from '../badge'

interface UserCardProps {
  senderDisplayName: string;
  senderID: string;
}

export default function UserCard({ senderDisplayName, senderID }: UserCardProps) {
  

  return (
    <Popover>
      <PopoverTrigger className='flex items-center gap-2'>{senderDisplayName || 'Unknown User'} {senderID === "system" ? <Badge>System</Badge> : null}</PopoverTrigger>
      <PopoverContent side="right" sideOffset={5}>
          Place content for the popover here.
      </PopoverContent>
    </Popover>
  )
}
