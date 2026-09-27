import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useGsap from "../hooks/useGsap";

gsap.registerPlugin(ScrollTrigger);

export default function Section({ id, alt = false, eyebrow, title, text, children, className = "" }) {
  const ref = useRef(null);

  useGsap(() => {
    const heading = ref.current?.querySelector(".section-heading");
    if (!heading) return;
    gsap.from(heading.children, {
      scrollTrigger: { trigger: heading, start: "top 88%", once: true },
      y: 22,
      opacity: 0,
      stagger: 0.08,
      duration: 0.55,
      ease: "power2.out",
    });
  }, []);

  return (
    <section ref={ref} id={id} className={`section-pad ${alt ? "section-alt" : ""} ${className}`}>
      <div className="container">
        <div className="section-heading">
          <span>{eyebrow}</span>
          <h2>{title}</h2>
          <p>{text}</p>
        </div>
        {children}
      </div>
    </section>
  );
}
