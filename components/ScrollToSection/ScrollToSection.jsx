"use client";

import { useEffect } from "react";

export default function ScrollToSection() {
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const resetPageToTop = () => {
      // Refresh ke baad URL se #features jaise hash remove karega
      if (window.location.hash) {
        window.history.replaceState(
          null,
          "",
          window.location.pathname + window.location.search
        );
      }

      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto",
      });
    };

    resetPageToTop();

    // iPhone Safari content load hone ke baad scroll position
    // restore karta hai, isliye dobara top par reset kar rahe hain
    const firstTimer = window.setTimeout(resetPageToTop, 50);
    const secondTimer = window.setTimeout(resetPageToTop, 300);

    const handlePageShow = () => {
      resetPageToTop();
    };

    window.addEventListener("pageshow", handlePageShow);

    return () => {
      window.clearTimeout(firstTimer);
      window.clearTimeout(secondTimer);
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, []);

  return null;
}