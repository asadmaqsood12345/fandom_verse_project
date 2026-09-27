# FandomVerse React

FandomVerse is a client-side single-page fandom portal rebuilt in React + JavaScript. This version is designed around the supplied FandomVerse SRS and keeps the required content visible even when animations are disabled or fail.

## Stack

- React + JavaScript (JSX)
- Vite
- Bootstrap 5.3
- Bootstrap Icons
- CSS3
- GSAP + ScrollTrigger
- Pre-populated JSON data (`src/data/data.json`) transformed by a small JavaScript data module
- LocalStorage and SessionStorage

No TypeScript is used.

## Run the project

```bash
npm install
npm run dev
```

For a production build:

```bash
npm run build
npm run preview
```

## Important project behavior

- No backend or server-side database is used.
- Content is pre-populated in `src/data/data.json` and prepared for React by `src/data/data.js`.
- Visitor count and bookmarks use LocalStorage.
- Bookmark notes use SessionStorage and are intentionally session-only.
- Login and Signup are dummy UI forms and do not authenticate users.
- Merchandise cart is temporary and calculates totals in the browser.
- Checkout and payment are not included.
- Chatbot responses come from a pre-scripted local dataset.
- GPS uses the browser Geolocation API only after the visitor presses the GPS button.
- The contact map is an embedded Google Maps view.
- Gallery images are locally generated SVG poster artwork, so the demo does not depend on an image API.
- The demo audio file is local: `public/media/fandom-tone.wav`.
- Video/trailer embeds use a public Creative Commons/open-movie demonstration source.

## SRS coverage checklist

### Home and navigation

- Responsive navigation
- Animated hero heading and introductory content
- All seven category hubs
- Featured content
- Chatbot launcher available globally

### Category hubs

Every category has:

- 5 character profiles
- Article content
- Video content
- Audio content
- 5 gallery images
- 3 events
- Merchandise item
- Upcoming releases
- Category/tag filtering
- Alphabetical, newest and popularity sorting
- Breadcrumb navigation

### Search

Global client-side search covers:

- Articles
- Characters
- Videos
- Audio
- Events
- Merchandise
- Releases
- Category filtering
- Content-type filtering
- Alphabetical/newest/popular sorting

### Galleries

- Every category has a gallery
- Lightbox view opens without leaving the page

### Media

- Video/trailer cards
- Local audio clip
- Dedicated trailer collection
- Trailer category filter
- Upcoming/recently-released filter

### Featured articles

- Featured article cards
- Full detail modal
- Related category information and tags

### Characters

- Five character profiles per category
- Name
- Image
- Series
- Biography/description
- Traits
- Category/franchise data

### Events

- Three events per category
- Title
- Date
- Location
- Description
- Category filtering

### Merchandise

- Product cards
- Image
- Product name
- Price range
- Description
- Add to temporary cart
- Quantity controls
- Total calculation
- No checkout/payment

### Chatbot

- Floating launcher
- Quick prompts
- Text input
- Pre-scripted responses
- Navigation/help answers
- No live external AI service

### Bookmarks

- Bookmark articles/media/characters/events
- Persistent LocalStorage bookmarks
- Session-only personal notes
- Export bookmarks as a formatted TXT list

### About and Contact

- About section
- Project team section
- Contact form
- Responsive contact information
- Embedded map
- Browser GPS button

### UI features

- Simulated visitor counter
- Real-time date/time
- Hover effects
- Smooth transitions
- Responsive Bootstrap layout
- Accessible labels and button names
- Keyboard-friendly native form controls

## Animation note

GSAP is intentionally used only for presentation:

- Hero entrance
- Hero floating elements
- Section heading entrance
- Card hover movement
- Detail modal entrance

The content cards are **not hidden with GSAP scroll animations**. This prevents a failed or interrupted animation from making required content disappear. The website remains usable if GSAP is removed.

## Project structure

```text
FandomVerse/
├── index.html
├── package.json
├── vite.config.js
├── README.md
├── public/
│   └── media/
│       └── fandom-tone.wav
└── src/
    ├── App.jsx
    ├── main.jsx
    ├── utils.js
    ├── styles.css
    ├── components/
    │   ├── ContentCard.jsx
    │   ├── Hero.jsx
    │   ├── Navbar.jsx
    │   ├── ProductCard.jsx
    │   └── Section.jsx
    ├── data/
    │   ├── data.json
    │   └── data.js
    └── hooks/
        └── useGsap.js
```

## Assumptions

- This is a frontend demonstration and does not write data back to JSON files.
- Event dates, releases, merchandise and fandom descriptions are demo data.
- The merchandise prices are demonstration values in PKR.
- Actual account authentication, checkout, payment processing and backend storage are outside the SRS scope.
- A Google Maps embed requires an internet connection.
- YouTube trailer embeds require an internet connection.

## AI usage acknowledgement

AI tools may be used as development assistance for debugging, implementation ideas and content organization. The final project should be reviewed, understood and meaningfully modified by the student/team before submission, in line with the SRS instructions.
