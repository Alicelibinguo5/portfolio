/**
 * Warm & nourishing quotes about food, cooking, and health.
 * These are displayed during loading states to make waiting more tolerable.
 */

export const FOOD_QUOTES = [
  {
    text: "One cannot think well, love well, sleep well, if one has not dined well.",
    author: "Virginia Woolf",
    context: "A Room of One's Own"
  },
  {
    text: "Food is our common ground, a universal experience.",
    author: "James Beard",
    context: null
  },
  {
    text: "The only thing I like better than talking about food is eating.",
    author: "John Walters",
    context: null
  },
  {
    text: "People who love to eat are always the best people.",
    author: "Julia Child",
    context: null
  },
  {
    text: "Cooking is like love. It should be entered into with abandon or not at all.",
    author: "Harriet Van Horne",
    context: null
  },
  {
    text: "To eat is a necessity, but to eat intelligently is an art.",
    author: "François de La Rochefoucauld",
    context: null
  },
  {
    text: "A recipe has no soul. You, as the cook, must bring soul to the recipe.",
    author: "Thomas Keller",
    context: null
  },
  {
    text: "Good food is the foundation of genuine happiness.",
    author: "Auguste Escoffier",
    context: null
  },
  {
    text: "Tell me what you eat, and I will tell you what you are.",
    author: "Jean Anthelme Brillat-Savarin",
    context: null
  },
  {
    text: "The secret of success in life is to eat what you like and let the food fight it out inside.",
    author: "Mark Twain",
    context: null
  },
  {
    text: "Life is uncertain. Eat dessert first.",
    author: "Ernestine Ulmer",
    context: null
  },
  {
    text: "There is no sincere love than the love of food.",
    author: "George Bernard Shaw",
    context: null
  },
  {
    text: "First we eat, then we do everything else.",
    author: "M.F.K. Fisher",
    context: null
  },
  {
    text: "He who distinguishes the true savor of his food can never be a glutton; he who does not cannot be otherwise.",
    author: "Henry David Thoreau",
    context: null
  },
  {
    text: "Your body is not a temple, it's an amusement park. Enjoy the ride.",
    author: "Anthony Bourdain",
    context: null
  },
  {
    text: "Food brings people together in a way nothing else can.",
    author: "Unknown",
    context: null
  },
  {
    text: "Happiness is a bowl of warm soup on a cold day.",
    author: "Unknown",
    context: null
  },
  {
    text: "The best memories are made around the table.",
    author: "Unknown",
    context: null
  },
  {
    text: "Nourishing yourself is a radical act of self-love.",
    author: "Unknown",
    context: null
  },
  {
    text: "A balanced diet is a cookie in each hand.",
    author: "Unknown",
    context: null
  }
]

/**
 * Get a random food quote.
 */
export function getRandomFoodQuote() {
  const index = Math.floor(Math.random() * FOOD_QUOTES.length)
  return FOOD_QUOTES[index]
}
