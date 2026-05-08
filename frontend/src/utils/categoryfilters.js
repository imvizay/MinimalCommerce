import { Apple, Baby, Mars, Shapes,Spool,SportShoe,Venus, Cable,Footprints } from 'lucide-react';

const categoryConfig = {
  mens: {
    icon: Mars,
    label: "Mens",
  },

  womens: {
    icon: Venus,
    label: "Womens",
  },

  electronics: {
    icon: Cable,
    label: "Electronics",
  },

  shoes: {
    icon: Footprints ,
    label: "Shoes",
  },

  kids: {
    icon: Baby ,
    label: "Kids",
  },

  groceries: {
    icon: Apple ,
    label: "Groceries",
  },

  toys: {
    icon: Shapes ,
    label: "Toys",
  },

  blankets: {
    icon: Spool ,
    label: "Blankets",
  },
}

export const getCategoryData = (category) => {
    return categoryConfig[category.toLowerCase()]
}