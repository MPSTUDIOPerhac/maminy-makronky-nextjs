"use client";

import { useEffect, useRef } from "react";

/**
 * Hero carousel — přesně stejná logika jako v původním js/main.js:
 * první .hero-slide v DOM je aktivní, tečky se generují podle počtu
 * slidů a automaticky se střídají každých 5.5 s (pauza se nedělá,
 * stejně jako v originále).
 */
export default function HeroCarousel({ slides }) {
  const sectionRef = useRef(null);
  const dotsWrapRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const slideEls = section.querySelectorAll(".hero-slide");
    const dotsWrap = dotsWrapRef.current;
    if (!slideEls.length || !dotsWrap) return;

    dotsWrap.innerHTML = "";
    let current = 0;
    const dots = [];

    slideEls.forEach((_, i) => {
      const b = document.createElement("button");
      if (i === 0) b.classList.add("is-active");
      b.setAttribute("aria-label", "Zobrazit banner " + (i + 1));
      b.addEventListener("click", () => goTo(i));
      dotsWrap.appendChild(b);
      dots.push(b);
    });

    function goTo(i) {
      slideEls[current].classList.remove("is-active");
      dots[current]?.classList.remove("is-active");
      current = i;
      slideEls[current].classList.add("is-active");
      dots[current]?.classList.add("is-active");
    }

    const interval = setInterval(() => {
      goTo((current + 1) % slideEls.length);
    }, 5500);

    return () => {
      clearInterval(interval);
      dotsWrap.innerHTML = "";
    };
  }, []);

  return (
    <section className="hero" ref={sectionRef}>
      {slides.map((slide, i) => (
        <div key={slide.key} className={`hero-slide ${slide.className}${i === 0 ? " is-active" : ""}`}>
          <div className="hero-macarons">
            <div className="macaron m1"></div>
            <div className="macaron m2"></div>
            <div className="macaron m3"></div>
            <div className="macaron m4"></div>
          </div>
          <div className="hero-content">
            <div className="inner">
              <span className="hero-tag">{slide.tag}</span>
              <h1>{slide.title}</h1>
              <p>{slide.text}</p>
              <div className="hero-actions">
                <a href={slide.primaryHref} className="btn btn-primary">{slide.primaryLabel}</a>
                <a href={slide.secondaryHref} className="btn btn-outline">{slide.secondaryLabel}</a>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="hero-dots" ref={dotsWrapRef}></div>
      <div className="hero-scroll">Posuňte dolů</div>
    </section>
  );
}
