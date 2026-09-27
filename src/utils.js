export function categoryById(id, categories) {
  return categories.find((item) => item.id === id);
}

export function categoryName(id, categories) {
  return categoryById(id, categories)?.name || "FandomVerse";
}

export function money(value) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function makePoster(title, subtitle, gradient = "#7c5cff,#00e5ff") {
  const [a, b] = gradient.split(",");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="600" viewBox="0 0 900 600">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>
    <rect width="900" height="600" fill="#070712"/><rect x="22" y="22" width="856" height="556" rx="34" fill="url(#g)" opacity=".9"/>
    <circle cx="735" cy="145" r="105" fill="#fff" opacity=".12"/><circle cx="150" cy="480" r="145" fill="#fff" opacity=".08"/>
    <text x="70" y="300" fill="#fff" font-family="Arial,sans-serif" font-size="56" font-weight="700">${escapeXml(title).slice(0, 22)}</text>
    <text x="70" y="350" fill="#fff" opacity=".85" font-family="Arial,sans-serif" font-size="26">${escapeXml(subtitle).slice(0, 34)}</text>
    <text x="70" y="510" fill="#fff" opacity=".65" font-family="Arial,sans-serif" font-size="18">FANDOMVERSE • ORIGINAL DEMO ART</text>
  </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function escapeXml(value) {
  return String(value).replace(/[<>&'\"]/g, (char) => ({
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    "'": "&apos;",
    '"': "&quot;",
  }[char]));
}
