// Master photographer quotes for the homepage. One is shown per calendar day in Adelaide.
export const PHOTOGRAPHY_QUOTES = [
  { text: "You don't take a photograph, you make it.", author: "Ansel Adams" },
  { text: "There is nothing worse than a sharp image of a fuzzy concept.", author: "Ansel Adams" },
  { text: "A good photograph is knowing where to stand.", author: "Ansel Adams" },
  {
    text: "The camera is an instrument that teaches people how to see without a camera.",
    author: "Dorothea Lange",
  },
  {
    text: "Photography takes an instant out of time, altering life by holding it still.",
    author: "Dorothea Lange",
  },
  {
    text: "To photograph is to put one's head, one's eye and one's heart on the same axis.",
    author: "Henri Cartier-Bresson",
  },
  { text: "In photography, the smallest thing can be a great subject.", author: "Henri Cartier-Bresson" },
] as const;

export type PhotographyQuote = (typeof PHOTOGRAPHY_QUOTES)[number];

// Picks the quote for the given day in Australia/Adelaide, so it rolls over at local midnight.
export function quoteOfTheDay(now = new Date()): PhotographyQuote {
  const ymd = now.toLocaleDateString("en-CA", { timeZone: "Australia/Adelaide" });
  const dayNumber = Math.floor(Date.parse(`${ymd}T00:00:00Z`) / 86_400_000);
  return PHOTOGRAPHY_QUOTES[dayNumber % PHOTOGRAPHY_QUOTES.length];
}
