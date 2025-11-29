export type ProductCategory = 'book_fantasy' | 'book_history' | 'book_romance'

export type Product = {
  id: string;
  name: string;
  price: number;
  category: ProductCategory;
  imageUrl: string;
};

export const CATEGORY_NAME_MAP: Record<ProductCategory, string> = {
  ['book_fantasy']: 'Fantasy Books',
  ['book_history']: 'History Books',
  ['book_romance']: 'Romance Books'
};
