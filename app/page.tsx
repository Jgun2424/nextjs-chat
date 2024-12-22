'use client'

import Image from "next/image";
import { useAuth } from "@/context/authContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="">
    </div>
  );
}
