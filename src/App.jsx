import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Section from "./components/Section";
import ContentCard from "./components/ContentCard";
import ProductCard from "./components/ProductCard";
import { categories, content, events, products, chatbot, galleries, trailers, releases, categoryImages } from "./data/data";
import { categoryById, categoryName, money } from "./utils";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./styles.css";

gsap.registerPlugin(ScrollTrigger);

const readJSON = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }
  catch { return fallback; }
};

const allBookmarkable = [...content, ...events];

export default function App() {
  const [bookmarks, setBookmarks] = useState(() => readJSON("fv_bookmarks", []));
  const [cart, setCart] = useState(() => readJSON("fv_cart", []));
  const [notes, setNotes] = useState(() => readJSON("fv_notes", {}));
  const [categoryId, setCategoryId] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [categoryTag, setCategoryTag] = useState("all");
  const [categorySort, setCategorySort] = useState("newest");
  const [search, setSearch] = useState("");
  const [searchCategory, setSearchCategory] = useState("all");
  const [searchType, setSearchType] = useState("all");
  const [searchSort, setSearchSort] = useState("relevance");
  const [selected, setSelected] = useState(null);
  const [lightbox, setLightbox] = useState(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([{ role: "bot", text: "Hi! I’m the FandomVerse Assistant. Ask me about categories, search, galleries, events, bookmarks or merchandise." }]);
  const [toast, setToast] = useState("");
  const [time, setTime] = useState(new Date());
  const [visitorCount, setVisitorCount] = useState(0);
  const [gps, setGps] = useState("");
  const [eventFilter, setEventFilter] = useState("all");
  const [trailerFilter, setTrailerFilter] = useState("all");
  const toastTimer = useRef(null);
  const visitorStarted = useRef(false);

  useEffect(() => {
    if (visitorStarted.current) return;
    visitorStarted.current = true;
    const next = Number(localStorage.getItem("fv_visitors") || 0) + 1;
    localStorage.setItem("fv_visitors", String(next));
    setVisitorCount(next);
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => localStorage.setItem("fv_bookmarks", JSON.stringify(bookmarks)), [bookmarks]);
  useEffect(() => localStorage.setItem("fv_cart", JSON.stringify(cart)), [cart]);
  useEffect(() => sessionStorage.setItem("fv_notes", JSON.stringify(notes)), [notes]);

  useEffect(() => {
    const readHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith("#category/")) {
        const id = hash.split("/")[1];
        if (categories.some((item) => item.id === id)) {
          setCategoryId(id);
          setCategoryFilter("all");
          setCategoryTag("all");
          setTimeout(() => document.getElementById("categoryView")?.scrollIntoView({ behavior: "smooth", block: "start" }), 40);
        }
      } else {
        setCategoryId(null);
      }
    };
    readHash();
    window.addEventListener("hashchange", readHash);
    return () => window.removeEventListener("hashchange", readHash);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("modal-open-custom", Boolean(selected || lightbox || loginOpen || signupOpen || cartOpen || chatOpen));
    return () => document.body.classList.remove("modal-open-custom");
  }, [selected, lightbox, loginOpen, signupOpen, cartOpen, chatOpen]);

  const showToast = (message) => {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2500);
  };

  const toggleBookmark = (id) => {
    setBookmarks((old) => {
      const exists = old.includes(id);
      showToast(exists ? "Removed from bookmarks" : "Added to bookmarks");
      return exists ? old.filter((item) => item !== id) : [...old, id];
    });
  };

  const updateNote = (id, value) => setNotes((old) => ({ ...old, [id]: value }));

  const addToCart = (id) => {
    const product = products.find((item) => item.id === id);
    setCart((old) => {
      const found = old.find((item) => item.id === id);
      return found ? old.map((item) => item.id === id ? { ...item, qty: item.qty + 1 } : item) : [...old, { id, qty: 1 }];
    });
    showToast(`${product.name} added to cart`);
  };

  const changeQty = (id, amount) => setCart((old) => old.map((item) => item.id === id ? { ...item, qty: item.qty + amount } : item).filter((item) => item.qty > 0));
  const removeFromCart = (id) => setCart((old) => old.filter((item) => item.id !== id));

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = cart.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.id);
    return sum + (product ? product.price * item.qty : 0);
  }, 0);

  const currentCategory = categoryById(categoryId, categories);
  const featured = content.filter((item) => item.featured);
  const bookmarkedItems = allBookmarkable.filter((item) => bookmarks.includes(item.id));

  const categoryContent = useMemo(() => {
    let list = content.filter((item) => item.cat === categoryId);
    if (categoryTag !== "all") list = list.filter((item) => item.tags?.includes(categoryTag));
    if (categoryFilter !== "all" && categoryFilter !== "gallery" && categoryFilter !== "event" && categoryFilter !== "merchandise" && categoryFilter !== "release") {
      list = list.filter((item) => item.type === categoryFilter);
    }
    if (categorySort === "alphabetical") list.sort((a, b) => a.title.localeCompare(b.title));
    if (categorySort === "popular") list.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    if (categorySort === "newest") list.sort((a, b) => String(b.date).localeCompare(String(a.date)));
    return list;
  }, [categoryId, categoryFilter, categoryTag, categorySort]);

  const searchItems = useMemo(() => {
    const term = search.trim().toLowerCase();
    const source = [
      ...content.map((item) => ({ ...item, searchType: item.type, searchTitle: item.title, searchText: `${item.title} ${item.desc} ${(item.tags || []).join(" ")} ${item.series || ""}` })),
      ...events.map((item) => ({ ...item, searchType: "event", searchTitle: item.title, searchText: `${item.title} ${item.desc} ${item.location} event` })),
      ...products.map((item) => ({ ...item, searchType: "merchandise", searchTitle: item.name, searchText: `${item.name} ${item.desc} merchandise` })),
      ...releases.map((item) => ({ ...item, searchType: "release", searchTitle: item.title, searchText: `${item.title} ${item.status} release` })),
    ];
    let result = source.filter((item) => (!term || item.searchText.toLowerCase().includes(term)) && (searchCategory === "all" || item.cat === searchCategory) && (searchType === "all" || item.searchType === searchType));
    if (searchSort === "alphabetical") result.sort((a, b) => a.searchTitle.localeCompare(b.searchTitle));
    if (searchSort === "newest") result.sort((a, b) => String(b.date).localeCompare(String(a.date)));
    if (searchSort === "popular") result.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    return result;
  }, [search, searchCategory, searchType, searchSort]);

  const stats = [
    [categories.length, "Fandoms"],
    [content.filter((item) => item.type === "character").length, "Characters"],
    [events.length, "Events"],
    [products.length, "Products"],
  ];

  const openDetails = (item) => {
    setSelected(item);
    requestAnimationFrame(() => gsap.fromTo(".details-dialog", { y: 25, opacity: 0, scale: .98 }, { y: 0, opacity: 1, scale: 1, duration: .35, ease: "power2.out" }));
  };

  const sendChat = (event, quickText = "") => {
    event?.preventDefault();
    const msg = (quickText || chatInput).trim();
    if (!msg) return;
    const lower = msg.toLowerCase();
    const found = chatbot.find((item) => lower.includes(item.q));
    const answer = found?.a || "Try asking about categories, search, galleries, events, bookmarks, releases or the merchandise cart.";
    setMessages((old) => [...old, { role: "user", text: msg }]);
    setChatInput("");
    setTimeout(() => setMessages((old) => [...old, { role: "bot", text: answer }]), 250);
  };

  const exportBookmarks = () => {
    const lines = bookmarkedItems.map((item) => {
      const title = item.title;
      const category = categoryName(item.cat, categories);
      return `${title}\nCategory: ${category}\nType: ${item.type || "event"}\nNote: ${notes[item.id] || "No note"}\n`;
    });
    const blob = new Blob([lines.length ? lines.join("\n--------------------\n") : "No bookmarks saved."], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "fandomverse-bookmarks.txt";
    link.click();
    URL.revokeObjectURL(url);
    showToast("Bookmarks exported");
  };

  const useGPS = () => {
    if (!navigator.geolocation) return showToast("GPS is not supported by this browser");
    navigator.geolocation.getCurrentPosition(
      (position) => setGps(`Latitude: ${position.coords.latitude.toFixed(5)}, Longitude: ${position.coords.longitude.toFixed(5)}`),
      () => setGps("Location permission was not granted.")
    );
  };

  const submitForm = (event, message) => {
    event.preventDefault();
    event.currentTarget.reset();
    showToast(message);
  };

  const goHome = () => {
    window.location.hash = "home";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <Navbar categories={categories} cartCount={cartCount} onLogin={() => setLoginOpen(true)} onSignup={() => setSignupOpen(true)} onCart={() => setCartOpen(true)} />

      <main>
        <Hero stats={stats} />

        <Section id="categories" eyebrow="EXPLORE" title="Fandom Categories" text="Seven category hubs with content, media, characters, events and releases.">
          <div className="row g-4">
            {categories.map((item) => <div className="col-md-6 col-lg-4" key={item.id}>
              <a className={`category-card ${item.gradient}`} href={`#category/${item.id}`}>
                <div className="category-icon"><i className={`bi ${item.icon}`}></i></div>
                <h3>{item.name}</h3><p>{item.desc}</p><span>Explore <i className="bi bi-arrow-right"></i></span>
              </a>
            </div>)}
          </div>
        </Section>

        <Section id="featured" alt eyebrow="DISCOVER" title="Featured Articles & Content" text="Long-form features and highlighted media from across the fandom universe.">
          <div className="row g-4">{featured.map((item) => <ContentCard key={item.id} item={item} categories={categories} bookmarked={bookmarks.includes(item.id)} onDetails={openDetails} onBookmark={toggleBookmark} />)}</div>
        </Section>

        <Section id="search" eyebrow="FIND ANYTHING" title="Global Search" text="Search across all categories, content types, events, merchandise and releases.">
          <div className="search-panel p-4 rounded-4 mb-4">
            <div className="row g-3">
              <div className="col-lg-4"><label className="form-label" htmlFor="searchInput">Search</label><input id="searchInput" value={search} onChange={(e) => setSearch(e.target.value)} className="form-control form-control-lg" placeholder="Naruto, Batman, gaming..." /></div>
              <div className="col-md-4 col-lg-2"><label className="form-label">Category</label><select value={searchCategory} onChange={(e) => setSearchCategory(e.target.value)} className="form-select form-select-lg"><option value="all">All</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
              <div className="col-md-4 col-lg-3"><label className="form-label">Type</label><select value={searchType} onChange={(e) => setSearchType(e.target.value)} className="form-select form-select-lg"><option value="all">All Types</option>{["article", "gallery", "video", "audio", "character", "event", "merchandise", "release"].map((type) => <option key={type} value={type}>{type}</option>)}</select></div>
              <div className="col-md-4 col-lg-3"><label className="form-label">Sort</label><select value={searchSort} onChange={(e) => setSearchSort(e.target.value)} className="form-select form-select-lg"><option value="relevance">Relevance</option><option value="alphabetical">Alphabetical</option><option value="newest">Newest</option><option value="popular">Popular</option></select></div>
            </div>
          </div>
          <div className="result-count mb-3">{searchItems.length} result{searchItems.length === 1 ? "" : "s"}</div>
          <div className="row g-4">
            {searchItems.map((item) => item.searchType === "merchandise" ? <ProductCard key={item.id} product={item} categories={categories} onAdd={addToCart} /> : item.searchType === "event" || item.searchType === "release" ? <div className="col-md-6 col-lg-4" key={item.id}><InfoCard item={item} bookmarked={bookmarks.includes(item.id)} onBookmark={toggleBookmark} /></div> : <ContentCard key={item.id} item={item} categories={categories} bookmarked={bookmarks.includes(item.id)} onDetails={openDetails} onBookmark={toggleBookmark} />)}
            {!searchItems.length && <Empty title="No results found" text="Try another keyword or change the filters." icon="bi-search" />}
          </div>
        </Section>

        {categoryId && currentCategory && <Section id="categoryView" alt eyebrow="CATEGORY HUB" title={currentCategory.name} text={currentCategory.desc} className="category-view">
          <div className={`category-hero ${currentCategory.gradient} rounded-4 p-4 p-lg-5 mb-4`}>
            <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
              <div><div className="category-icon"><i className={`bi ${currentCategory.icon}`}></i></div><div className="breadcrumb-line"><a href="#home">Home</a><span>/</span><a href="#categories">Categories</a><span>/</span><strong>{currentCategory.name}</strong></div></div>
              <button className="btn btn-outline-light" onClick={goHome}><i className="bi bi-arrow-up me-1"></i>Back to Home</button>
            </div>
          </div>
          <div className="filter-bar d-flex flex-wrap gap-2 mb-2">
            {["all", "article", "gallery", "video", "audio", "character", "event", "merchandise", "release"].map((type) => <button key={type} className={`btn btn-sm ${categoryFilter === type ? "btn-light" : "btn-outline-light"}`} onClick={() => { setCategoryFilter(type); setCategoryTag("all"); }}>{type === "all" ? "All" : type}</button>)}
            <select className="form-select form-select-sm sort-select" value={categorySort} onChange={(e) => setCategorySort(e.target.value)} aria-label="Sort category content"><option value="newest">Newest</option><option value="alphabetical">A-Z</option><option value="popular">Popular</option></select>
          </div>
          <div className="filter-bar d-flex flex-wrap gap-2 mb-4">
            <span className="small text-secondary align-self-center me-1">Tags:</span>
            {["all", ...new Set(content.filter((item) => item.cat === categoryId).flatMap((item) => item.tags || []))].slice(0, 9).map((tag) => <button key={tag} className={`btn btn-sm ${categoryTag === tag ? "btn-primary" : "btn-outline-light"}`} onClick={() => setCategoryTag(tag)}>{tag === "all" ? "All Tags" : tag}</button>)}
          </div>

          {categoryFilter === "gallery" ? <GalleryGrid items={galleries.filter((item) => item.cat === categoryId)} onOpen={setLightbox} /> : categoryFilter === "event" ? <div className="row g-4">{events.filter((item) => item.cat === categoryId).map((item) => <div className="col-md-6 col-lg-4" key={item.id}><InfoCard item={item} bookmarked={bookmarks.includes(item.id)} onBookmark={toggleBookmark} /></div>)}</div> : categoryFilter === "merchandise" ? <div className="row g-4">{products.filter((item) => item.cat === categoryId).map((item) => <ProductCard key={item.id} product={item} categories={categories} onAdd={addToCart} />)}</div> : categoryFilter === "release" ? <ReleaseGrid items={releases.filter((item) => item.cat === categoryId)} /> : <div className="row g-4">{categoryContent.map((item) => <ContentCard key={item.id} item={item} categories={categories} bookmarked={bookmarks.includes(item.id)} onDetails={openDetails} onBookmark={toggleBookmark} />)}</div>}
        </Section>}

        <Section id="gallery" eyebrow="VISUALS" title="Image Galleries" text="Every category includes its own gallery. Click an image to open the lightbox.">
          <GalleryGrid items={galleries.slice(0, 14)} onOpen={setLightbox} />
        </Section>

        <Section id="media" alt eyebrow="MEDIA" title="Videos & Audio Clips" text="Trailer, interview and podcast-style media slots loaded from the local data set.">
          <div className="row g-4">{content.filter((item) => item.type === "video" || item.type === "audio").map((item) => <div className="col-md-6 col-lg-4" key={item.id}><MediaCard item={item} categories={categories} onDetails={openDetails} /></div>)}</div>
        </Section>

        <Section id="trailers" eyebrow="TRAILERS" title="Trailer Collection" text="Filter the trailer collection by category or release status.">
          <div className="filter-bar d-flex flex-wrap gap-2 mb-4"><button className={`btn btn-sm ${trailerFilter === "all" ? "btn-primary" : "btn-outline-light"}`} onClick={() => setTrailerFilter("all")}>All</button>{categories.map((c) => <button key={c.id} className={`btn btn-sm ${trailerFilter === c.id ? "btn-primary" : "btn-outline-light"}`} onClick={() => setTrailerFilter(c.id)}>{c.name}</button>)}<button className={`btn btn-sm ${trailerFilter === "upcoming" ? "btn-primary" : "btn-outline-light"}`} onClick={() => setTrailerFilter("upcoming")}>Upcoming</button><button className={`btn btn-sm ${trailerFilter === "recently-released" ? "btn-primary" : "btn-outline-light"}`} onClick={() => setTrailerFilter("recently-released")}>Recently Released</button></div>
          <div className="row g-4">{trailers.filter((item) => trailerFilter === "all" || item.cat === trailerFilter || item.status === trailerFilter).map((item) => <div className="col-md-6 col-lg-4" key={item.id}><article className="media-card h-100"><div className="video-wrap"><iframe src={item.videoUrl} title={item.title} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe></div><div className="p-3"><span className="badge badge-soft">{item.status}</span><h5 className="mt-2">{item.title}</h5><p className="small text-secondary">{categoryName(item.cat, categories)} • {item.date}</p></div></article></div>)}</div>
        </Section>

        <Section id="events" alt eyebrow="COMMUNITY" title="Event Highlights" text="Each category includes three sample events with date, location and description.">
          <div className="filter-bar d-flex flex-wrap gap-2 mb-4"><button className={`btn btn-sm ${eventFilter === "all" ? "btn-primary" : "btn-outline-light"}`} onClick={() => setEventFilter("all")}>All</button>{categories.map((c) => <button key={c.id} className={`btn btn-sm ${eventFilter === c.id ? "btn-primary" : "btn-outline-light"}`} onClick={() => setEventFilter(c.id)}>{c.name}</button>)}</div>
          <div className="row g-4">{events.filter((item) => eventFilter === "all" || item.cat === eventFilter).map((item) => <div className="col-md-6 col-lg-4" key={item.id}><InfoCard item={item} bookmarked={bookmarks.includes(item.id)} onBookmark={toggleBookmark} /></div>)}</div>
        </Section>

        <Section id="releases" eyebrow="CALENDAR" title="Upcoming Releases" text="A client-side upcoming releases calendar using pre-populated JSON data.">
          <ReleaseGrid items={releases} showCategory />
        </Section>

        <Section id="merchandise" alt eyebrow="SHOP" title="Merchandise Showcase" text="Browse fan products and use the temporary shopping cart. Checkout and payment are not included.">
          <div className="row g-4">{products.map((product) => <ProductCard key={product.id} product={product} categories={categories} onAdd={addToCart} />)}</div>
        </Section>

        <Section id="bookmarks" eyebrow="SAVE" title="Bookmarks & Personal Notes" text="Bookmarks persist in Local Storage. Notes are session-only, as required by the SRS.">
          <div className="d-flex flex-wrap gap-2 mb-4"><button className="btn btn-primary" onClick={exportBookmarks}><i className="bi bi-download me-2"></i>Export Bookmarks</button><span className="bookmark-count">{bookmarkedItems.length} saved</span></div>
          {bookmarkedItems.length ? <div className="row g-4">{bookmarkedItems.map((item) => <div className="col-lg-6" key={item.id}><article className="bookmark-item"><div><strong>{item.title}</strong><div className="small text-secondary">{categoryName(item.cat, categories)} • {item.type || "event"}</div></div><button className="btn btn-sm btn-outline-danger" onClick={() => toggleBookmark(item.id)} aria-label={`Remove ${item.title}`}>Remove</button><textarea value={notes[item.id] || ""} onChange={(e) => updateNote(item.id, e.target.value)} className="form-control mt-3" rows="2" placeholder="Personal note (session only)"></textarea></article></div>)}</div> : <Empty title="No bookmarks yet" text="Use the bookmark icon on content or events to save them." icon="bi-bookmark" />}
        </Section>

        <Section id="about" alt eyebrow="ABOUT" title="About FandomVerse" text="A responsive single-page fandom information hub built for learning, discovery and demonstration.">
          <div className="row g-4">
            <div className="col-lg-7"><div className="info-panel h-100"><h4>Project Overview</h4><p>FandomVerse brings seven fandom communities into one interface. The project uses React, JavaScript, Bootstrap, CSS, GSAP and pre-populated local data. It does not use a backend database or server-side account system.</p><p>The shopping cart is temporary, the login/signup UI is a dummy interface, and the chatbot uses a pre-scripted question-and-answer data set.</p></div></div>
            <div className="col-lg-5"><div className="info-panel h-100"><h4>Project Team</h4><ul className="clean-list"><li><strong>Muhammad Omais</strong><span>Student1730197</span></li><li><strong>Asad Maqsood</strong><span>Student1729420</span></li></ul><p className="small text-secondary mt-3">ADSE project team • Aptech Metro Start Gate</p></div></div>
          </div>
        </Section>

        <Section id="contact" eyebrow="CONTACT" title="Contact Us" text="Responsive team contact information, map and browser GPS functionality.">
          <div className="row g-4">
            <div className="col-lg-5"><div className="info-panel h-100"><h4>FandomVerse Team</h4><p><i className="bi bi-envelope me-2"></i>hello@fandomverse.demo</p><p><i className="bi bi-telephone me-2"></i>+92 300 0000000</p><p><i className="bi bi-geo-alt me-2"></i>Karachi, Pakistan</p><button className="btn btn-outline-primary" onClick={useGPS}><i className="bi bi-crosshair me-2"></i>Use My GPS</button>{gps && <p className="small text-secondary mt-3">{gps}</p>}</div></div>
            <div className="col-lg-7"><div className="map-wrap"><iframe title="FandomVerse map" src="https://www.google.com/maps?q=Karachi%2C%20Pakistan&output=embed" loading="lazy"></iframe></div></div>
          </div>
          <div className="contact-form-wrap mt-4"><form onSubmit={(e) => submitForm(e, "Your message was submitted in demo mode.")}><div className="row g-3"><div className="col-md-6"><label className="form-label">Name</label><input required className="form-control" /></div><div className="col-md-6"><label className="form-label">Email</label><input required type="email" className="form-control" /></div><div className="col-12"><label className="form-label">Message</label><textarea required className="form-control" rows="4"></textarea></div><div className="col-12"><button className="btn btn-primary">Send Message</button></div></div></form></div>
        </Section>

        <footer className="site-footer"><div className="container"><div><strong className="brand-gradient">FandomVerse</strong><span> • Portal for Fandom World</span></div><div className="footer-links"><a href="#about">About</a><a href="#contact">Contact</a><a href="#bookmarks">Bookmarks</a><a href="#home">Back to top</a></div><div className="footer-meta">Visitors: {visitorCount.toLocaleString()} • {time.toLocaleString()}</div></div></footer>
      </main>

      <button className="chat-launcher" onClick={() => setChatOpen(true)} aria-label="Open chatbot"><i className="bi bi-chat-dots-fill"></i></button>
      <button className="to-top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Back to top"><i className="bi bi-arrow-up"></i></button>

      {selected && <div className="overlay" onMouseDown={() => setSelected(null)}><div className="details-dialog" onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Content details"><button className="close-btn" onClick={() => setSelected(null)} aria-label="Close"><i className="bi bi-x-lg"></i></button>{selected.image && <img
              src={selected.image}
              alt={selected.title}
              className="detail-image"
              onError={(e) => {
                e.currentTarget.onerror = null;
                if (selected.fallbackImage) e.currentTarget.src = selected.fallbackImage;
              }}
            />}<div className="p-4"><span className="badge badge-soft">{selected.type || "event"}</span><h2 className="mt-2">{selected.title}</h2><p className="text-secondary">{selected.desc || selected.bio}</p>{selected.series && <p><strong>Series:</strong> {selected.series}</p>}{selected.traits && <div className="tag-row mb-3">{selected.traits.map((trait) => <span key={trait}>{trait}</span>)}</div>}{selected.videoUrl && <div className="video-wrap mt-3"><iframe src={selected.videoUrl} title={selected.title} allowFullScreen></iframe></div>}{selected.audioUrl && <audio className="w-100 mt-3" controls src={selected.audioUrl}>Your browser does not support audio.</audio>}{selected.type !== "event" && <button className={`btn mt-3 ${bookmarks.includes(selected.id) ? "btn-primary" : "btn-outline-primary"}`} onClick={() => toggleBookmark(selected.id)}>{bookmarks.includes(selected.id) ? "Bookmarked" : "Bookmark this content"}</button>}</div></div></div>}

      {lightbox && <div className="overlay lightbox-overlay" onClick={() => setLightbox(null)}><button className="close-btn" onClick={() => setLightbox(null)} aria-label="Close gallery"><i className="bi bi-x-lg"></i></button><img
          className="lightbox-image"
          src={lightbox.image}
          alt={lightbox.alt}
          onError={(e) => {
            e.currentTarget.onerror = null;
            if (lightbox.fallbackImage) e.currentTarget.src = lightbox.fallbackImage;
          }}
        /></div>}

      {cartOpen && <SidePanel title="Temporary Cart" onClose={() => setCartOpen(false)}><div className="cart-list">{cart.length ? cart.map((item) => { const product = products.find((p) => p.id === item.id); return <div className="cart-row" key={item.id}><div><strong>{product.name}</strong><small>{money(product.price)} each</small></div><div className="qty"><button onClick={() => changeQty(item.id, -1)}>-</button><span>{item.qty}</span><button onClick={() => changeQty(item.id, 1)}>+</button></div><button className="btn btn-sm btn-outline-danger" onClick={() => removeFromCart(item.id)}>×</button></div>; }) : <Empty title="Cart is empty" text="Add merchandise to see it here." icon="bi-cart" />}</div><div className="cart-total"><span>Total</span><strong>{money(cartTotal)}</strong></div><p className="small text-secondary">Demo only. Checkout and payment are not included.</p></SidePanel>}

      {chatOpen && <SidePanel title="FandomVerse Assistant" onClose={() => setChatOpen(false)}><div className="chat-messages">{messages.map((message, index) => <div className={`chat-message ${message.role}`} key={`${message.role}-${index}`}>{message.text}</div>)}</div><div className="quick-prompts">{["categories", "gallery", "bookmarks", "events"].map((prompt) => <button key={prompt} onClick={() => sendChat(null, prompt)}>{prompt}</button>)}</div><form className="chat-form" onSubmit={sendChat}><input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Ask a question..." aria-label="Chat question" /><button className="btn btn-primary">Send</button></form></SidePanel>}

      {loginOpen && <AuthModal title="Dummy Login" onClose={() => setLoginOpen(false)} onSubmit={(e) => submitForm(e, "Demo login submitted. No authentication is performed.")} />}
      {signupOpen && <AuthModal title="Dummy Signup" onClose={() => setSignupOpen(false)} signup onSubmit={(e) => submitForm(e, "Demo signup submitted. No account was created.")} />}
      {toast && <div className="toast-custom"><i className="bi bi-check-circle me-2"></i>{toast}</div>}
    </div>
  );
}

function InfoCard({ item, bookmarked, onBookmark }) {
  return (
    <article className="info-card h-100 p-0 overflow-hidden">
      <div className="info-card-image">
        <img
          src={item.image || categoryImages[item.cat]}
          alt={item.title}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            if (item.fallbackImage) e.currentTarget.src = item.fallbackImage;
          }}
        />
      </div>
      <div className="p-3 p-lg-4">
        <div className="d-flex justify-content-between gap-3">
          <div>
            <span className="badge badge-soft">{item.type || "event"}</span>
            <h5 className="mt-2">{item.title}</h5>
            <p className="small text-secondary mb-2">{item.desc}</p>
            {item.date && <div className="small"><i className="bi bi-calendar3 me-1"></i>{item.date}{item.location ? ` • ${item.location}` : ""}</div>}
          </div>
          <button className={`bookmark-btn ${bookmarked ? "active" : ""}`} onClick={() => onBookmark(item.id)} aria-label={`Bookmark ${item.title}`}>
            <i className={`bi ${bookmarked ? "bi-bookmark-fill" : "bi-bookmark"}`}></i>
          </button>
        </div>
      </div>
    </article>
  );
}

function MediaCard({ item, categories, onDetails }) {
  return (
    <article className="media-card h-100">
      <img
        src={item.image}
        alt={item.title}
        loading="lazy"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = item.fallbackImage;
        }}
      />
      <div className="p-3">
        <span className="badge badge-soft">{item.type}</span>
        <h5 className="mt-2">{item.title}</h5>
        <p className="small text-secondary">{categoryName(item.cat, categories)}</p>
        {item.type === "audio" ? (
          <audio controls className="w-100" src={item.audioUrl}>Audio not supported.</audio>
        ) : (
          <button className="btn btn-sm btn-outline-primary" onClick={() => onDetails(item)}>Open Video</button>
        )}
      </div>
    </article>
  );
}

function GalleryGrid({ items, onOpen }) {
  return (
    <div className="gallery-grid">
      {items.map((item) => (
        <button className="gallery-item" key={item.id} onClick={() => onOpen(item)}>
          <img
            src={item.image}
            alt={item.alt}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = item.fallbackImage;
            }}
          />
          <span>{item.title}</span>
        </button>
      ))}
    </div>
  );
}

function ReleaseGrid({ items, showCategory = false }) {
  return (
    <div className="release-grid">
      {items.map((item) => (
        <article className="release-card p-0 overflow-hidden" key={item.id}>
          <img
            className="release-thumb"
            src={item.image || categoryImages[item.cat]}
            alt={item.title}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null;
              if (item.fallbackImage) e.currentTarget.src = item.fallbackImage;
            }}
          />
          <div className="release-body">
            <div className="release-date">
              <strong>{new Date(item.date).getDate()}</strong>
              <span>{new Date(item.date).toLocaleDateString("en", { month: "short" })}</span>
            </div>
            <div>
              <span className="badge badge-soft">{item.status}</span>
              <h5 className="mt-2">{item.title}</h5>
              {showCategory && <p className="small text-secondary mb-0">{categoryName(item.cat, categories)}</p>}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function SidePanel({ title, children, onClose }) {
  return <div className="panel-backdrop" onMouseDown={onClose}><aside className="side-panel" onMouseDown={(e) => e.stopPropagation()}><div className="side-panel-header"><h4>{title}</h4><button className="close-btn small-close" onClick={onClose} aria-label="Close"><i className="bi bi-x-lg"></i></button></div>{children}</aside></div>;
}

function AuthModal({ title, onClose, onSubmit, signup = false }) {
  return <div className="overlay" onMouseDown={onClose}><div className="auth-dialog" onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-modal="true"><button className="close-btn" onClick={onClose} aria-label="Close"><i className="bi bi-x-lg"></i></button><h3>{title}</h3><form onSubmit={onSubmit}><label className="form-label">Email</label><input required type="email" className="form-control mb-3" />{signup && <><label className="form-label">Name</label><input required className="form-control mb-3" /></>}<label className="form-label">Password</label><input required type="password" className="form-control mb-3" /><button className="btn btn-primary w-100">{signup ? "Create Demo Account" : "Login"}</button></form><p className="small text-secondary mt-3 mb-0">UI demonstration only. No authentication or server account is created.</p></div></div>;
}

function Empty({ title, text, icon }) {
  return <div className="col-12"><div className="empty-state"><i className={`bi ${icon} fs-1`}></i><h4>{title}</h4><p>{text}</p></div></div>;
}
