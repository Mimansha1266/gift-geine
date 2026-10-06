"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext.jsx";
import "./Navbar.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navbarRef = useRef(null);

  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const goToSection = (sectionId) => {
    setOpen(false);

    /*
      Agar user homepage ke alawa kisi aur page par hai,
      toh pehle homepage open hoga.

      Example:
      /seller/signup page par Home ya Gift Finder click karne par
      user homepage par redirect hoga.
    */
    if (pathname !== "/") {
      if (sectionId === "home") {
        router.push("/");
      } else {
        router.push(`/#${sectionId}`);
      }

      return;
    }

    requestAnimationFrame(() => {
      if (sectionId === "home") {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth",
        });

        window.history.replaceState(
          null,
          "",
          window.location.pathname + window.location.search
        );

        return;
      }

      const section = document.getElementById(sectionId);
      const navbar = document.querySelector(".navbar");

      if (!section) {
        console.warn(`Section not found: ${sectionId}`);
        return;
      }

      const navbarHeight = navbar
        ? navbar.getBoundingClientRect().height
        : 0;

      const sectionTop =
        section.getBoundingClientRect().top + window.scrollY;

      const gapBelowNavbar = 10;

      window.scrollTo({
        top: Math.max(
          sectionTop - navbarHeight - gapBelowNavbar,
          0
        ),
        left: 0,
        behavior: "smooth",
      });

      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search
      );
    });
  };

  const openSellerSignup = () => {
    setOpen(false);
    router.push("/signup");
  };

  const openSignup = () => {
    setOpen(false);
    router.push("/signup");
  };

  const openLogin = () => {
    setOpen(false);
    router.push("/login");
  };

  const handleLogout = async () => {
    setOpen(false);
    await logout();
    router.push("/");
  };

  // Resize, outside click aur Escape key handling
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1150) {
        setOpen(false);
      }
    };

    const handleOutsideClick = (event) => {
      if (
        open &&
        navbarRef.current &&
        !navbarRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);
    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
      document.removeEventListener(
        "touchstart",
        handleOutsideClick
      );
      document.removeEventListener(
        "keydown",
        handleEscapeKey
      );
    };
  }, [open]);

  /*
    Homepage refresh hone par page top se start karega.

    Important:
    Ye sirf homepage "/" par chalega.
    Seller signup jaise pages par scroll force nahi karega.
  */
  useEffect(() => {
    if (pathname !== "/") {
      return;
    }

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const hash = window.location.hash;

    /*
      Agar URL me section hash hai, jaise /#features,
      toh us section tak scroll karenge.
    */
    if (hash) {
      const sectionId = hash.replace("#", "");

      const timer = setTimeout(() => {
        const section = document.getElementById(sectionId);
        const navbar = document.querySelector(".navbar");

        if (!section) {
          return;
        }

        const navbarHeight = navbar
          ? navbar.getBoundingClientRect().height
          : 0;

        const sectionTop =
          section.getBoundingClientRect().top + window.scrollY;

        window.scrollTo({
          top: Math.max(sectionTop - navbarHeight - 10, 0),
          left: 0,
          behavior: "smooth",
        });

        window.history.replaceState(
          null,
          "",
          window.location.pathname + window.location.search
        );
      }, 150);

      return () => clearTimeout(timer);
    }

    const scrollToTop = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    scrollToTop();

    requestAnimationFrame(() => {
      scrollToTop();
    });

    const timer = setTimeout(scrollToTop, 100);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <header ref={navbarRef} className="navbar">
      {/* GiftGenie logo */}
      <button
        type="button"
        className="nav-logo"
        onClick={() => goToSection("home")}
        aria-label="Go to home"
      >
        <span aria-hidden="true">🎁</span>
        <h2>GiftGenie</h2>
      </button>

      {/* Main navigation links */}
      <nav
        id="main-navigation"
        className={`nav-links${open ? " active" : ""}`}
        aria-label="Main navigation"
      >
        <button
          type="button"
          onClick={() => goToSection("home")}
        >
          Home
        </button>

        <button
          type="button"
          onClick={() => goToSection("features")}
        >
          Features
        </button>

        <button
          type="button"
          onClick={() => goToSection("gift-finder-view")}
        >
          Gift Finder
        </button>

        <button
          type="button"
          onClick={() => goToSection("trending")}
        >
          Trending Gifts
        </button>

        <button
          type="button"
          onClick={() => goToSection("corporate")}
        >
          Corporate
        </button>

        <button
          type="button"
          onClick={() => goToSection("how-it-works")}
        >
          How It Works
        </button>

        <button
          type="button"
          onClick={() => goToSection("faq")}
        >
          FAQ
        </button>

        {/* Mobile screen ke buttons */}
        <div className="mobile-nav-actions">
          {user ? (
            <div className="mobile-user-container">
              <span className="nav-user-greeting">👤 {user.name}</span>
              {user.role === "seller" && (
                <button
                  type="button"
                  className="mobile-selling-btn"
                  onClick={() => {
                    setOpen(false);
                    router.push("/seller/dashboard");
                  }}
                >
                  Seller Dashboard ↗
                </button>
              )}
              {user.role === "admin" && (
                <button
                  type="button"
                  className="mobile-selling-btn"
                  onClick={() => {
                    setOpen(false);
                    router.push("/admin/dashboard");
                  }}
                >
                  Admin Dashboard ↗
                </button>
              )}
              <button
                type="button"
                className="mobile-login-btn"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <button
                type="button"
                className="mobile-login-btn"
                onClick={openLogin}
              >
                Sign In
              </button>
              <button
                type="button"
                className="mobile-selling-btn"
                onClick={openSignup}
              >
                Sign Up (Choose Role) ✨
              </button>
            </>
          )}

          <button
            type="button"
            className="mobile-start-btn"
            onClick={() => goToSection("gift-finder-view")}
          >
            Start Now
          </button>
        </div>
      </nav>

      {/* Desktop screen ke buttons */}
      <div className="nav-actions">
        {user ? (
          <div className="nav-user-container">
            {user.role === "seller" && (
              <button
                type="button"
                className="selling-btn"
                style={{ padding: "8px 14px", minHeight: "38px", fontSize: "13px" }}
                onClick={() => router.push("/seller/dashboard")}
              >
                Seller Hub ↗
              </button>
            )}
            {user.role === "admin" && (
              <button
                type="button"
                className="selling-btn"
                style={{ padding: "8px 14px", minHeight: "38px", fontSize: "13px" }}
                onClick={() => router.push("/admin/dashboard")}
              >
                Admin Hub ↗
              </button>
            )}
            <span className="nav-user-greeting">
              👤 {user.name?.split(" ")[0] || "User"}
            </span>
            <button
              type="button"
              className="login-btn nav-logout-btn"
              onClick={handleLogout}
              title="Sign out"
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            <button
              type="button"
              className="login-btn"
              onClick={openLogin}
            >
              Sign In
            </button>

            <button
              type="button"
              className="selling-btn"
              onClick={openSignup}
            >
              Sign Up ✨
            </button>
          </>
        )}

        <button
          type="button"
          className="start-btn"
          onClick={() => goToSection("gift-finder-view")}
        >
          Start Now
        </button>
      </div>

      {/* Mobile hamburger button */}
      <button
        type="button"
        className={`menu-btn${open ? " menu-open" : ""}`}
        onClick={() =>
          setOpen((currentValue) => !currentValue)
        }
        aria-label={
          open
            ? "Close navigation menu"
            : "Open navigation menu"
        }
        aria-expanded={open}
        aria-controls="main-navigation"
      >
        <span className="menu-line"></span>
        <span className="menu-line"></span>
        <span className="menu-line"></span>
      </button>
    </header>
  );
}