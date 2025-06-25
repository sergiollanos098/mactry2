export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  features: string[];
  category: string;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Ramiro Llona Tote Bag",
    price: 25.00,
    image: "/1.jpg",
    description: "Premium canvas tote bag featuring Ramiro Llona's distinctive artwork. Perfect for carrying books, groceries, or everyday essentials.",
    features: ["100% Canvas", "Artistic Design", "Durable Construction", "Museum Quality"],
    category: "Accessories"
  },
  {
    id: 2,
    name: "Textured Art Bag",
    price: 34.50,
    image: "/2.jpg",
    description: "Unique textured fiber art bag with natural beige tones. A contemporary piece that combines functionality with artistic expression.",
    features: ["Handcrafted", "Natural Fibers", "Unique Texture", "Contemporary Design"],
    category: "Art & Crafts"
  },
  {
    id: 3,
    name: "Ramiro Llona Notebook",
    price: 18.00,
    image: "/3.jpg",
    description: "Spiral-bound notebook featuring Ramiro Llona's vibrant artwork. Perfect for sketching, note-taking, or journaling.",
    features: ["Spiral Bound", "High-Quality Paper", "Artistic Cover", "Portable Size"],
    category: "Stationery"
  },
  {
    id: 4,
    name: "Framed Art Print - Red Rose",
    price: 45.00,
    image: "/4.jpg",
    description: "Beautiful framed art print with wooden frame. Features poetic text arranged in a circular pattern with natural wood framing.",
    features: ["Wooden Frame", "High-Quality Print", "Poetic Design", "Ready to Hang"],
    category: "Wall Art"
  },
  {
    id: 5,
    name: "Abstract Tree Print",
    price: 38.00,
    image: "/5.jpg",
    description: "Modern abstract tree artwork in black frame. Minimalist design featuring the letters H, V, S, O, Y arranged on tree branches.",
    features: ["Black Frame", "Abstract Design", "Minimalist Style", "Modern Art"],
    category: "Wall Art"
  }
];
