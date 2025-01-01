'use client'
import React, {useEffect} from 'react';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/context/authContext';
import { useSidebar } from '@/components/ui/sidebar';
import Image from 'next/image';


export default function page() {
    const { user } = useAuth()
    const { toggleSidebar, open } = useSidebar()
  
    useEffect(() => {
      if (open) {
        toggleSidebar()
      }
    }, [])

    if (!user) {
        return null
    }


  return (
    <div className="flex-1 mx-auto p-6 space-y-8 bg-sidebar overflow-y-scroll max-h-screen">
      <div className="flex items-start gap-6">

        <Card className="flex-1 p-6 space-y-8 bg-sidebar border-gray-800">
          <div className="flex items-start gap-4">
            <div className="h-16 w-16">
                <Image src={user.photoURL} alt={user.displayName} className="rounded-lg" width={64} height={64} />
            </div>
            <div className="space-y-1">
              <h1 className="text-xl font-semibold flex items-center gap-2">
                {user.displayName}
              </h1>
              <div className="text-sm text-gray-400">{user.email}</div>
            </div>
          </div>

          <section className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold">Your profile</h2>
              <p className="text-sm text-gray-400">Update your profile photo and details here.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Public Name</Label>
                <p className="text-sm text-gray-400">This will be displayed on your profile.</p>
                <Input defaultValue={user.displayName} />
              </div>
            </div>

            <Separator className="bg-gray-800" />

            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="font-semibold">Company logo</h3>
                <p className="text-sm text-gray-400">Update your company logo and then choose where you want it to display.</p>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-16 w-16 bg-lime-300 rounded-xl flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-black" />
                </div>
                <div className="flex-1 border border-dashed border-gray-700 rounded-lg p-8 text-center space-y-2">
                  <div className="mx-auto h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center">
                    <span className="text-gray-400">↑</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium underline">Click to upload</span>
                    <span className="text-sm text-gray-400"> or drag and drop</span>
                  </div>
                  <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                </div>
              </div>
            </div>

            <Separator className="bg-gray-800" />

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Branding</h3>
                <p className="text-sm text-gray-400">Add your logo to reports and emails.</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <Checkbox id="reports" />
                  <div className="space-y-1">
                    <Label htmlFor="reports">Reports</Label>
                    <p className="text-sm text-gray-400">Include my logo in summary reports.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Checkbox id="emails" />
                  <div className="space-y-1">
                    <Label htmlFor="emails">Emails</Label>
                    <p className="text-sm text-gray-400">Include my logo in customer emails.</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="bg-gray-800" />

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Social profiles</h3>
              </div>
              <div className="flex">
                <Input defaultValue="twitter.com/" className="rounded-r-none bg-gray-900 border-r-0" readOnly />
                <Input defaultValue="sisyphusvc" className="rounded-l-none" />
              </div>
            </div>
          </section>
        </Card>
      </div>
    </div>
  );
};
