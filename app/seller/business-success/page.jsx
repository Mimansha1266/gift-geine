"use client";

import { useRouter } from "next/navigation";

export default function BusinessSuccessPage() {
  const router = useRouter();

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(circle at 15% 10%, rgba(209,150,240,.30), transparent 35%), radial-gradient(circle at 90% 90%, rgba(230,173,128,.25), transparent 35%), #f8f3f7",
      }}
    >
      <section
        style={{
          width: "min(100%, 560px)",
          padding: "48px 32px",
          border: "1px solid rgba(122,73,143,.12)",
          borderRadius: "28px",
          background: "rgba(255,255,255,.95)",
          boxShadow: "0 25px 65px rgba(78,35,98,.13)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: "76px",
            height: "76px",
            margin: "0 auto 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "24px",
            background:
              "linear-gradient(135deg,#efe2ff,#ffe4d2)",
            fontSize: "35px",
          }}
        >
          ✅
        </div>

        <p
          style={{
            margin: "0 0 10px",
            color: "#7b2cbf",
            fontSize: "12px",
            fontWeight: "900",
            letterSpacing: ".7px",
            textTransform: "uppercase",
          }}
        >
          SELLER APPLICATION SUBMITTED
        </p>

        <h1
          style={{
            margin: "0",
            color: "#2d183c",
            fontSize: "34px",
          }}
        >
          Congratulations! 🎉
        </h1>

        <p
          style={{
            margin: "18px auto 0",
            maxWidth: "440px",
            color: "#766c7d",
            fontSize: "14px",
            lineHeight: "1.7",
          }}
        >
          Your seller application has been submitted successfully.
          Our team will review your information and verify your
          business before activating your GiftGenie seller account.
        </p>

        <button
          type="button"
          onClick={() => router.push("/")}
          style={{
            width: "100%",
            minHeight: "50px",
            marginTop: "30px",
            border: "none",
            borderRadius: "14px",
            background:
              "linear-gradient(135deg,#6d2fc2,#b83a7d,#8b5a2b)",
            color: "#ffffff",
            fontFamily: "inherit",
            fontSize: "14px",
            fontWeight: "900",
            cursor: "pointer",
          }}
        >
          Return to GiftGenie
        </button>
      </section>
    </main>
  );
}