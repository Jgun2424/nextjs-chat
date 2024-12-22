'use client';

import React from 'react';
import { Avatar, AvatarFallback } from './avatar';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

import { cn } from '@/lib/utils';

/**
 * Props for the AvatarGroup component.
 * @param children - The avatar elements to display in the group.
 * @param max - Maximum number of avatars to display before showing a count.
 * @param className - Additional class names for the container.
 * @param size - Size of the avatars in the group.
 */
type AvatarGroupProps = {
  children: React.ReactNode;
  max?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
};

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
};

/**
 * AvatarGroup displays a group of avatars with a maximum visible limit. If there are more avatars than the limit, 
 * the extra avatars are represented as a count.
 * @param {AvatarGroupProps} props - Props for the component.
 */
export function AvatarGroup({ children, max = 3, className, size = 'md' }: AvatarGroupProps) {
  const avatars = React.Children.toArray(children).slice(0, Math.max(max, 0));
  const extraCount = React.Children.count(children) - Math.max(max, 0);
  const hiddenAvatars = React.Children.toArray(children).slice(max);

  return (
    <div className={cn('flex items-center space-x-[-16px]', className)}>
      {avatars.map((child, index) =>
        React.cloneElement(child as React.ReactElement, {
          key: index,
          className: cn(
            (child as React.ReactElement).props.className,
            'border-2 border-sidebar',
            sizeClasses[size]
          ),
        })
      )}
      {extraCount > 0 && (
        <TooltipProvider>
            <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                    <Avatar
                    className={cn(
                      'border-2 border-sidebar bg-sidebar text-sm font-medium cursor-pointer',
                      sizeClasses[size]
                    )}
                    aria-label={`+${extraCount} more avatars`}
                    >
                    <AvatarFallback>+{extraCount}</AvatarFallback>
                    </Avatar>
                </TooltipTrigger>
                <TooltipContent className="p-4 bg-muted shadow-md rounded-md">
                    <div className="flex flex-col space-y-2">
                    {hiddenAvatars.map((child, index) =>
                        React.cloneElement(child as React.ReactElement, {
                        key: index,
                        className: cn(
                          (child as React.ReactElement).props.className,
                          'border-2 border-sidebar',
                          sizeClasses[size]
                        ),
                        })
                    )}
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}
