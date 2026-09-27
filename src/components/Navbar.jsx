import { useState } from "react";

export default function Navbar({ categories, cartCount, onLogin, onSignup, onCart }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar navbar-expand-lg fixed-top glass-nav" aria-label="Main navigation">
      <div className="container">
        <a className="navbar-brand fw-black brand-gradient" href="#home" onClick={closeMenu}>FandomVerse</a>
        <button className="navbar-toggler" type="button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-controls="mainNav" aria-label="Toggle navigation">
          <i className="bi bi-list text-white fs-2"></i>
        </button>
        <div className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`} id="mainNav">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-1">
            <li className="nav-item"><a className="nav-link" href="#home" onClick={closeMenu}>Home</a></li>
            <li className="nav-item dropdown-custom">
              <button className="nav-link dropdown-button" type="button">Categories <i className="bi bi-chevron-down"></i></button>
              <div className="dropdown-panel">
                {categories.map((item) => <a key={item.id} href={`#category/${item.id}`} onClick={closeMenu}><i className={`bi ${item.icon}`}></i>{item.name}</a>)}
              </div>
            </li>
            <li className="nav-item"><a className="nav-link" href="#featured" onClick={closeMenu}>Featured</a></li>
            <li className="nav-item"><a className="nav-link" href="#search" onClick={closeMenu}>Search</a></li>
            <li className="nav-item"><a className="nav-link" href="#events" onClick={closeMenu}>Events</a></li>
            <li className="nav-item"><a className="nav-link" href="#merchandise" onClick={closeMenu}>Shop</a></li>
            <li className="nav-item"><a className="nav-link" href="#bookmarks" onClick={closeMenu}>Bookmarks</a></li>
            <li className="nav-item"><a className="nav-link" href="#contact" onClick={closeMenu}>Contact</a></li>
            <li className="nav-item d-flex gap-2 ms-lg-2 mt-2 mt-lg-0">
              <button className="btn btn-sm btn-outline-light" onClick={() => { closeMenu(); onSignup(); }}>Sign Up</button>
              <button className="btn btn-sm btn-primary" onClick={() => { closeMenu(); onLogin(); }}>Login</button>
            </li>
            <li className="nav-item"><button className="nav-link cart-link" onClick={() => { closeMenu(); onCart(); }} aria-label={`Cart with ${cartCount} items`}><i className="bi bi-cart3"></i><span>{cartCount}</span></button></li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
