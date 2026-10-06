"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SellerSignupPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the unified role selection screen where users choose Buyer, Seller, or Admin
    router.replace("/signup");
  }, [router]);

  return null;
}