import { useRef } from "react";
import gsap from "gsap";
import { categoryName, money } from "../utils";

export default function ProductCard({ product, categories, onAdd }) {
  const ref = useRef(null);
  return (
    <div className="col-sm-6 col-lg-3">
      <article ref={ref} className="content-card product-card h-100" onMouseEnter={() => gsap.to(ref.current, { y: -6, duration: .25 })} onMouseLeave={() => gsap.to(ref.current, { y: 0, duration: .3 })}>
        <div className="card-image-wrap">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = product.fallbackImage;
            }}
          />
          <span className="badge badge-soft">{categoryName(product.cat, categories)}</span>
        </div>
        <div className="p-3">
          <h5>{product.name}</h5><p className="small text-secondary">{product.desc}</p>
          <div className="d-flex justify-content-between align-items-center"><strong>{product.priceRange ? `PKR ${Number(product.priceRange[0]).toLocaleString()}–${Number(product.priceRange[1]).toLocaleString()}` : money(product.price)}</strong><button className="btn btn-sm btn-primary" onClick={() => onAdd(product.id)}><i className="bi bi-cart-plus me-1"></i>Add</button></div>
        </div>
      </article>
    </div>
  );
}
