"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import RoleGateway from "../../components/RoleGateway/RoleGateway.jsx";

function LoginContent() {
  const searchParams = useSearchParams();
  const initialRole = searchParams.get("role") || "user";

  return <RoleGateway initialRole={initialRole} initialMode="login" />;
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "80vh" }} />}>
      <LoginContent />
    </Suspense>
  );
}
