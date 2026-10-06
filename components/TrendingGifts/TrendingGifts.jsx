"use client";

import { useEffect, useRef, useState } from "react";
import "./TrendingGifts.css";

const gifts = [
  {
    id: 1,
    title: "Sony Noise-Cancelling Headphones",
    category: "Tech",
    price: "₹24,999",
    rating: "4.8",
    reviews: "2.1K",
    image: "/images/products/sony-headphones.jpg",
    brand: "Amazon",
    searchQuery: "Sony WH1000XM6",
  },
  {
    id: 2,
    title: "Smart Watch",
    category: "Fitness",
    price: "₹4,999",
    rating: "4.6",
    reviews: "3.4K",
    image: "/images/products/apple-watch.jpg",
    brand: "Amazon",
    searchQuery: "smart watch",
  },
  {
    id: 3,
    title: "Luxury Perfume",
    category: "Fashion",
    price: "₹3,499",
    rating: "4.7",
    reviews: "1.8K",
    image: "/images/products/luxury-perfume.jpg",
    brand: "Amazon",
    searchQuery: "luxury perfume",
  },
  {
    id: 4,
    title: "Travel Backpack",
    category: "Travel",
    price: "₹2,999",
    rating: "4.5",
    reviews: "2.9K",
    image: "/images/products/travel-backpack.jpg",
    brand: "Amazon",
    searchQuery: "travel backpack",
  },
  {
    id: 5,
    title: "Personalised Photo Frame",
    category: "Personalised",
    price: "₹799",
    rating: "4.8",
    reviews: "4.2K",
    image: "/images/products/photo-frame.jpg",
    brand: "Amazon",
    searchQuery: "personalized photo frame",
  },
  {
    id: 6,
    title: "Chocolate Gift Hamper",
    category: "Food",
    price: "₹1,499",
    rating: "4.7",
    reviews: "5.1K",
    image: "/images/products/chocolate-hamper.jpg",
    brand: "Amazon",
    searchQuery: "chocolate gift hamper",
  },
  {
    id: 7,
    title: "Kindle Paperwhite",
    category: "Books",
    price: "₹14,999",
    rating: "4.9",
    reviews: "12K",
    image: "/images/products/kindle.jpg",
    brand: "Amazon",
    searchQuery: "Kindle Paperwhite",
  },
  {
    id: 8,
    title: "Coffee Hamper",
    category: "Coffee",
    price: "₹1,799",
    rating: "4.6",
    reviews: "2.7K",
    image: "/images/products/coffee-hamper.jpg",
    brand: "Amazon",
    searchQuery: "coffee gift hamper",
  },
  {
    id: 9,
    title: "JBL Bluetooth Speaker",
    category: "Music",
    price: "₹2,499",
    rating: "4.8",
    reviews: "9.3K",
    image: "/images/products/jbl-speaker.jpg",
    brand: "Amazon",
    searchQuery: "JBL Bluetooth Speaker",
  },
  {
    id: 10,
    title: "Leather Wallet",
    category: "Accessories",
    price: "₹999",
    rating: "4.5",
    reviews: "6.1K",
    image: "/images/products/wallet.jpg",
    brand: "Amazon",
    searchQuery: "leather wallet",
  },
  {
    id: 11,
    title: "Indoor Plant Gift",
    category: "Home",
    price: "₹699",
    rating: "4.7",
    reviews: "3.6K",
    image: "/images/products/plant.jpg",
    brand: "Amazon",
    searchQuery: "indoor plant gift",
  },
  {
    id: 12,
    title: "Premium Gift Box",
    category: "Luxury",
    price: "₹2,299",
    rating: "4.8",
    reviews: "2.2K",
    image: "/images/products/jewellery.jpg",
    brand: "Amazon",
    searchQuery: "premium gift box",
  },
];

export default function TrendingGifts() {
  const sliderRef = useRef(null);
  const animationRef = useRef(null);

  const [isMobile, setIsMobile] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const affiliateTag =
    process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_TAG || "";

  const createAmazonLink = (searchQuery) => {
    const url = new URL("https://www.amazon.in/s");

    url.searchParams.set("k", searchQuery);

    if (affiliateTag) {
      url.searchParams.set("tag", affiliateTag);
    }

    return url.toString();
  };

  useEffect(() => {
    const updateScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    updateScreenSize();

    window.addEventListener("resize", updateScreenSize);

    return () => {
      window.removeEventListener("resize", updateScreenSize);
    };
  }, []);

  useEffect(() => {
    if (!isMobile || isPaused || !sliderRef.current) {
      return undefined;
    }

    const slider = sliderRef.current;

    const autoScroll = () => {
      slider.scrollLeft += 0.45;

      const halfwayPoint = slider.scrollWidth / 2;

      if (slider.scrollLeft >= halfwayPoint) {
        slider.scrollLeft -= halfwayPoint;
      }

      animationRef.current = requestAnimationFrame(autoScroll);
    };

    animationRef.current = requestAnimationFrame(autoScroll);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isMobile, isPaused]);

  const scrollSlider = (direction) => {
    if (!sliderRef.current) {
      return;
    }

    const slider = sliderRef.current;
    const firstCard = slider.querySelector(".gift-card");

    const cardWidth = firstCard?.offsetWidth || 290;
    const gap = isMobile ? 14 : 20;

    const cardsToMove = isMobile ? 1 : 2;
    const scrollAmount = (cardWidth + gap) * cardsToMove;

    slider.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const displayedGifts = isMobile
    ? [...gifts, ...gifts]
    : gifts;

  const pauseSlider = () => {
    setIsPaused(true);
  };

  const resumeSlider = () => {
    window.setTimeout(() => {
      setIsPaused(false);
    }, 500);
  };

  return (
    <section className="trending-section" id="trending">
      <div className="trending-header">
        <div className="section-title">
          <span>🔥 Trending Gifts</span>

          <h2>Popular Gift Recommendations</h2>

          <p>
            Explore popular gifts and shop through GiftGenie&apos;s Amazon
            affiliate links.
          </p>
        </div>

        <div className="slider-controls">
          <button
            type="button"
            className="slider-arrow"
            onClick={() => scrollSlider("left")}
            aria-label="View previous trending gifts"
          >
            ←
          </button>

          <button
            type="button"
            className="slider-arrow"
            onClick={() => scrollSlider("right")}
            aria-label="View more trending gifts"
          >
            →
          </button>
        </div>
      </div>

      <div
        className="gift-slider"
        ref={sliderRef}
        onMouseEnter={pauseSlider}
        onMouseLeave={resumeSlider}
        onTouchStart={pauseSlider}
        onTouchEnd={resumeSlider}
        onTouchCancel={resumeSlider}
      >
        {displayedGifts.map((gift, index) => (
          <article
            className="gift-card"
            key={`${gift.id}-${index}`}
          >
            <div className="trending-badge">
              Trending
            </div>

            <div className="gift-image">
              <img
                src={gift.image}
                alt={gift.title}
                className="gift-photo"
              />
            </div>

            <span className="category">
              {gift.category}
            </span>

            <h3>{gift.title}</h3>

            <div className="rating-row">
              <span className="rating-star">★</span>

              <strong>{gift.rating}</strong>

              <span>({gift.reviews})</span>
            </div>

            <div className="price">
              {gift.price}
            </div>

            <a
              href={createAmazonLink(gift.searchQuery)}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="view-btn"
            >
              Buy on Amazon →
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}