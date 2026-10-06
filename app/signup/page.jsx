"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import RoleGateway from "../../components/RoleGateway/RoleGateway.jsx";

function SignupContent() {
  const searchParams = useSearchParams();
  const initialRole = searchParams.get("role") || "user";

  return <RoleGateway initialRole={initialRole} />;
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "80vh" }} />}>
      <SignupContent />
    </Suspense>
  );
}
