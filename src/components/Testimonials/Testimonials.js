import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  TestiSection,
  Card,
  Controls,
  ArrowBtn,
  Dots,
  Dot,
} from "./TestimonialsElements";

const REVIEWS = [
  {
    quote:
      "The leche flan is silky and not too sweet. We order 10 tubs every fiesta and they always sell out first.",
    name: "Maria S. · Regular since 2022",
    stars: 5,
  },
  {
    quote:
      "Macaroons are chewy inside, golden outside. Delivery arrived warm and on time. Highly recommended!",
    name: "Jessa R. · Birthday order",
    stars: 5,
  },
  {
    quote:
      "Ordered the Combo Delights for office merienda. Easy checkout, COD available, everyone loved it.",
    name: "Mark D. · Office catering",
    stars: 5,
  },
  {
    quote:
      "Pancit palabok tastes homemade, generous toppings. Our go-to for family weekends now.",
    name: "Aiza L. · Weekend regular",
    stars: 4,
  },
];

const Testimonials = () => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef(null);

  const go = useCallback((dir) => {
    setIndex((i) => (i + dir + REVIEWS.length) % REVIEWS.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    timer.current = setInterval(() => {
      setIndex((i) => (i + 1) % REVIEWS.length);
    }, 5000);
    return () => clearInterval(timer.current);
  }, [paused]);

  const current = REVIEWS[index];

  return (
    <TestiSection
      aria-label="Customer reviews"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <h2>Loved by our suki</h2>
      <p className="sub">Real feedback from repeat customers</p>
      <Card aria-live="polite">
        <div className="stars" aria-label={`${current.stars} out of 5 stars`}>
          {"★".repeat(current.stars)}
          {"☆".repeat(5 - current.stars)}
        </div>
        <p className="quote">“{current.quote}”</p>
        <footer>— {current.name}</footer>
      </Card>
      <Controls>
        <ArrowBtn onClick={() => go(-1)} aria-label="Previous review">
          ‹
        </ArrowBtn>
        <Dots role="tablist" aria-label="Choose review">
          {REVIEWS.map((r, i) => (
            <Dot
              key={i}
              active={i === index}
              onClick={() => setIndex(i)}
              role="tab"
              aria-selected={i === index}
              aria-label={`Review ${i + 1} from ${r.name}`}
            />
          ))}
        </Dots>
        <ArrowBtn onClick={() => go(1)} aria-label="Next review">
          ›
        </ArrowBtn>
      </Controls>
    </TestiSection>
  );
};

export default Testimonials;
