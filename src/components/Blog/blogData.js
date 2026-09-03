import lecheImg from "../../images/lecheflan.jpg";
import macImg from "../../images/Macaroons.jpg";
import comboImg from "../../images/Combo.jpg";

export const POSTS = [
  {
    slug: "perfect-leche-flan",
    title: "5 Secrets to Silky Leche Flan",
    date: "2026-06-12",
    read: "4 min read",
    img: lecheImg,
    excerpt: "No bubbles, glossy caramel, just-right sweetness. Our kitchen notes.",
    content: [
      "Steam low and slow. High heat makes bubbles. We cook at a gentle simmer and rest the flan before chilling.",
      "Strain twice. Eggs + milk through a fine sieve, twice, for that glassy texture.",
      "Caramel to amber, not dark. Light amber keeps it bittersweet, not burnt.",
      "Chill overnight. Flan sets and slices clean after 8 hours in the fridge.",
      "Serve cold in the tub. Our 120g tub is one generous serving, or two small ones if you share.",
    ],
  },
  {
    slug: "chewy-macaroons",
    title: "Why Our Macaroons Stay Chewy",
    date: "2026-07-03",
    read: "3 min read",
    img: macImg,
    excerpt: "Condensed milk ratio, bake time, and cooling racks matter more than you think.",
    content: [
      "We use desiccated coconut, not sweetened flakes, then balance with condensed milk.",
      "Bake to golden edges, pale tops. Overbaking dries them out.",
      "Cool on the tray 10 minutes, then rack. They firm up as they cool.",
      "Pair with our mojitos drink or black coffee for merienda.",
    ],
  },
  {
    slug: "fiesta-catering-guide",
    title: "Fiesta Catering: How Many Tubs for 50 Pax?",
    date: "2026-08-10",
    read: "5 min read",
    img: comboImg,
    excerpt: "A simple formula for sweets + snacks, plus lead times that save stress.",
    content: [
      "Rule of thumb: 1 tub leche flan per 5 guests, 1 macaroon per guest, 1 bilao pasta per 15 guests.",
      "For 50 pax: 10 tubs flan, 60 pcs macaroons, 3 trays spaghetti or palabok.",
      "Order 2 days ahead for 50+ pax. Same-day works for under 20 servings.",
      "Use our quote calculator on the catering section for an instant estimate, then send the inquiry in one click.",
    ],
  },
];

export function getPost(slug) {
  return POSTS.find((p) => p.slug === slug) || null;
}
