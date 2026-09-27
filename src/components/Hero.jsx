import { useRef } from "react";
import gsap from "gsap";
import useGsap from "../hooks/useGsap";

export default function Hero({ stats }) {
  const ref = useRef(null);

  useGsap(() => {
    const root = ref.current;
    const intro = root.querySelectorAll(".hero-kicker, .hero-title, .hero-copy, .hero-actions, .stat-card");
    gsap.from(intro, { y: 28, opacity: 0, stagger: 0.08, duration: 0.65, ease: "power3.out" });

    gsap.to(root.querySelector(".orbit-core"), { scale: 1.06, duration: 2.2, yoyo: true, repeat: -1, ease: "sine.inOut" });
    [".card-a", ".card-b", ".card-c"].forEach((selector, index) => {
      gsap.to(root.querySelector(selector), {
        x: [18, -16, 12][index], y: [-16, 14, 18][index], duration: [2.4, 2.7, 2.1][index], yoyo: true, repeat: -1, ease: "sine.inOut",
      });
    });
  }, []);

  return (
    <section ref={ref} id="home" className="hero-section d-flex align-items-center">
      <div className="container pt-5">
        <div className="row align-items-center min-vh-75">
          <div className="col-lg-7">
            <div className="hero-kicker text-uppercase text-info small fw-bold mb-3">Portal for Fandom World</div>
            <h1 className="hero-title display-2 fw-black">Explore <span className="text-gradient">Every Fandom</span> in One Place.</h1>
            <p className="hero-copy lead text-secondary mt-4">Discover anime, gaming, movies, TV shows, K-Pop, comics and manga through one interactive fandom hub.</p>
            <div className="hero-actions d-flex gap-3 flex-wrap mt-4">
              <a className="btn btn-primary btn-lg" href="#categories">Explore Categories <i className="bi bi-arrow-right ms-2"></i></a>
              <a className="btn btn-outline-light btn-lg" href="#search"><i className="bi bi-search me-2"></i>Search</a>
            </div>
            <div className="row mt-5 g-3">
              {stats.map(([number, label]) => <div className="col-6 col-md-3" key={label}><div className="stat-card"><strong>{number}</strong><span>{label}</span></div></div>)}
            </div>
          </div>
          <div className="col-lg-5 mt-5 mt-lg-0">
            <div className="hero-orbit" aria-hidden="true">
              <div className="orbit-card card-a">ANIME</div>
              <div className="orbit-card card-b">GAMING</div>
              <div className="orbit-card card-c">K-POP</div>
              <div className="orbit-core"><i className="bi bi-stars"></i><br />FANDOM<br />VERSE</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
