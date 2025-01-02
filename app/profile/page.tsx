'use client'
import { useState, useRef, useEffect } from 'react';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/authContext';
import { useSidebar } from '@/components/ui/sidebar';
import Image from 'next/image';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { uploadImage } from '@/utils/uploadImage';

export default function Page() {
  const { user, updateUserPhotoURL } = useAuth();
  const { toggleSidebar, open } = useSidebar();
  const isMobile = useIsMobile();
  const [changes, setChanges] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!user) {
    return null;
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setChanges(true);
    }
  };

  const convertBase64 = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result as string);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleUpload = async () => {
    if (image) {
      const base64 = await convertBase64(image);
      const uploadedImageUrl = await uploadImage(base64);
      return uploadedImageUrl;
    }
  };

  const handleSave = async () => {
    if (changes) {
      const url = await handleUpload();
      if (url) {
        await updateUserPhotoURL(url);
      }
      setChanges(false);
    }
  }

  return (
    <div className="flex-1 mx-auto p-6 space-y-8 bg-sidebar overflow-y-scroll max-h-screen">
      <div className="flex items-start gap-6">
        <Card className="flex-1 p-6 space-y-8 bg-sidebar border-gray-800">
          <div className="flex items-start gap-4">
            <div className="h-16 w-16">
              <Image src={user.photoURL} alt={user.displayName} className="rounded-lg min-w-[64px] min-h-[64px] max-w-[64px] max-h-[64px] object-cover" width={64} height={64} />
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
                <h3 className="font-semibold">Profile Photo</h3>
                <p className="text-sm text-gray-400">Your profile photo will be displayed on your profile and in chat</p>
              </div>

              <div className="flex items-start gap-4">
              <div className="h-16 w-16">
                <Image src={preview === null ? `${user.photoURL}` : `${preview}`} alt={user.displayName} className="rounded-lg min-w-[64px] min-h-[64px] max-w-[64px] max-h-[64px] object-cover" width={64} height={64} />
              </div>
                <div className="flex-1 border border-dashed border-gray-700 rounded-lg p-8 text-center space-y-2">
                  <div className="mx-auto h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center">
                    <span className="text-gray-400">↑</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium underline" onClick={() => fileRef.current?.click()}>Click to upload</span>
                    <span className="text-sm text-gray-400"> or drag and drop</span>
                    <input type="file" ref={fileRef} style={{ display: 'none' }} onChange={handleFileChange} />
                  </div>
                  <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                  {imageUrl && <img src={imageUrl} alt="Uploaded" className="mt-4" />}
                </div>
              </div>
            </div>
          </section>
          <Button className='w-full' disabled={!changes} onClick={handleSave}>Save changes</Button>
          {isMobile && <div className='mb-16'></div>}
        </Card>
      </div>
    </div>
  );
}
