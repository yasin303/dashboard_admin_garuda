// src/app/page.js
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "../../src/lib/api"; 

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  return (
    <div className="flex items-center justify-center min-h-screen">
      {loading && <p className="text-gray-600 text-lg">Loading...</p>}
    </div>
  );
}