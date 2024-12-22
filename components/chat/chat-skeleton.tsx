'use client';

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { SidebarTrigger } from '../ui/sidebar';

export function ChatSkeleton() {
  return (
    <div className='flex flex-col justify-between max-h-full w-full'>
      {/* Header */}
      <div className='bg-sidebar sticky top-0 z-10 p-4 border-b flex flex-row items-center justify-between min-h-[81px]'>
        <div className='flex items-center gap-3'>
          <SidebarTrigger className='-ml-1' />
          <Skeleton className="h-6 w-32" /> {/* Channel name skeleton */}
        </div>
      </div>

      {/* Messages Skeleton */}
      <div className='flex-1 flex flex-col-reverse overflow-y-auto p-4 gap-6 bg-sidebar'>
        {[...Array(8)].map((_, index) => (
          <div key={index} className='flex items-start gap-4 animate-pulse'>
            <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
            <div className='flex flex-col gap-2 flex-1'>
              <div className='flex items-center gap-2'>
                <Skeleton className='h-4 w-24' /> {/* Username */}
                <Skeleton className='h-3 w-16' /> {/* Timestamp */}
              </div>
              <div className="flex flex-col gap-2">
                {/* Skeleton Loader for messages */}
                <div className="flex gap-2">
                  <Skeleton className="h-4 w-[6%]" /> 
                  <Skeleton className="h-4 w-[2%]" />
                  <Skeleton className="h-4 w-[8%]" />
                  <Skeleton className="h-4 w-[3%]" />
                  <Skeleton className="h-4 w-[10%]" />
                  <Skeleton className="h-4 w-[8%]" />
                  <Skeleton className="h-4 w-[3%]" />
                  <Skeleton className="h-4 w-[10%]" />
                  <Skeleton className="h-4 w-[8%]" />
                  <Skeleton className="h-4 w-[3%]" />
                  <Skeleton className="h-4 w-[10%]" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Skeleton */}
      <div className='p-4 bg-sidebar border-t sticky bottom-0'>
        <div className='flex relative rounded-lg p-2'>
          <Skeleton className='h-8 flex-1 rounded-md' /> {/* Input field */}
        </div>
      </div>
    </div>
  );
}