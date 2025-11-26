export type ProductCategory = 'book_fantasy' | 'book_history' | 'book_romance'

export type Product = {
  id: string;
  name: string;
  price: number;
  category: ProductCategory;
  imageUrl: string;
};
