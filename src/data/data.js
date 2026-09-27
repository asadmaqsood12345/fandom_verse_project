import rawData from "./data.json";
import { makePoster } from "../utils";

// Category artwork is kept in one place so every card has a real visual,
// while makePoster remains as a local fallback if an external image is unavailable.
const categoryImages = {
  anime: "https://seakoff.com/cdn/shop/articles/why-do-anime-characters-look-white-expert-answers-852339.webp?v=1716968910",
  gaming: "https://tshirt-factory.com/images/detailed/112/Game-World-469127332.png",
  movies: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/migrated/supabase/generated-articles/article-60138-cover-05b7319f.webp",
  tv: "https://g.foolcdn.com/editorial/images/691308/watching-netflix-streaming-tv.jpg",
  kpop: "https://resources.diariolibre.com/images/2025/02/11/whatsapp-image-2025-02-11-at-5.26.15-pm.jpeg",
  comics: "https://commons.wikimedia.org/wiki/Special:FilePath/Front_cover%2C_%22Wow_Comics%22_no._38_%28art_by_Jack_Binder%29.jpg",
  manga: "https://cdn.sanity.io/images/x0c10dda/production/1dc2dba21dd4d305f6f6f34e139a1a28695aea07-1600x1255.jpg?w=1200&q=80&auto=format",
};

const categoryFallbacks = {
  anime: "#6b3dff,#b22cff",
  gaming: "#007bff,#00c6ff",
  movies: "#ef3b63,#ff8a3d",
  tv: "#13a085,#0b6bff",
  kpop: "#ff3b9d,#743cff",
  comics: "#f59e0b,#ef4444",
  manga: "#10b981,#0ea5e9",
};

const withImage = (item, category) => {
  const safeCategory = category || { id: "anime", name: "FandomVerse", colors: "#7c5cff,#00e5ff" };

  return {
    ...item,
    image: categoryImages[safeCategory.id],
    fallbackImage: makePoster(
      item.title || item.name || safeCategory.name,
      item.series || item.type || safeCategory.name,
      categoryFallbacks[safeCategory.id] || safeCategory.colors
    ),
  };
};

const categories = rawData.categories;

const content = rawData.content.map((item) =>
  withImage(item, categories.find((category) => category.id === item.cat))
);

const events = rawData.events.map((item) =>
  withImage(item, categories.find((category) => category.id === item.cat))
);

const products = rawData.products.map((item) =>
  withImage(item, categories.find((category) => category.id === item.cat))
);

const chatbot = rawData.chatbot;

const galleries = rawData.galleries.map((item) =>
  withImage(item, categories.find((category) => category.id === item.cat))
);

const trailers = rawData.trailers.map((item) =>
  withImage(item, categories.find((category) => category.id === item.cat))
);

const releases = rawData.releases.map((item) =>
  withImage(item, categories.find((category) => category.id === item.cat))
);

export { categories, content, events, products, chatbot, galleries, trailers, releases, categoryImages };
