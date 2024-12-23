'use client'
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function Home() {

  return (
    <div className="flex flex-1 items-center justify-center flex-col">
      <p>Hey There!</p>
      <p>Click Below To Get Started!</p>
      <SidebarTrigger />
    </div>
  );
}
