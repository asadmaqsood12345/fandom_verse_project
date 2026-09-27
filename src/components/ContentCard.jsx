import { useRef } from "react";
import gsap from "gsap";
import { categoryName } from "../utils";

export default function ContentCard({ item, categories, bookmarked, onDetails, onBookmark }) {
  const ref = useRef(null);

  const move = (y) => gsap.to(ref.current, { y, duration: 0.25, ease: "power2.out" });

  return (
    <div className="col-md-6 col-lg-4">
      <article ref={ref} className="content-card h-100" onMouseEnter={() => move(-6)} onMouseLeave={() => move(0)}>
        <div className="card-image-wrap">
          <img
            src={item.image}
            alt={item.title}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = item.fallbackImage;
            }}
          />
          <span className="badge badge-soft">{item.type}</span>
          <div className="image-overlay"><button className="btn btn-light btn-sm" onClick={() => onDetails(item)}>View Details</button></div>
        </div>
        <div className="p-3 p-lg-4">
          <div className="small text-primary mb-2">{categoryName(item.cat, categories)}</div>
          <h5 className="fw-bold">{item.title}</h5>
          <p className="text-secondary small">{item.desc}</p>
          {item.tags?.length > 0 && <div className="tag-row mb-3">{item.tags.slice(0, 3).map((tag) => <span key={tag}>#{tag}</span>)}</div>}
          <div className="d-flex justify-content-between align-items-center gap-2">
            <button className="btn btn-sm btn-outline-primary" onClick={() => onDetails(item)}>Explore</button>
            <button className={`bookmark-btn ${bookmarked ? "active" : ""}`} onClick={() => onBookmark(item.id)} title="Bookmark" aria-label={`${bookmarked ? "Remove" : "Add"} ${item.title} bookmark`}><i className={`bi ${bookmarked ? "bi-bookmark-fill" : "bi-bookmark"}`}></i></button>
          </div>
        </div>
      </article>
    </div>
  );
}
