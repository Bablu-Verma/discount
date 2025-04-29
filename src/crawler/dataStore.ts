import { Product } from "./scraper";


let products: Product[] = [];

export function setProducts(newProducts: Product[]) {
  products = newProducts;
}

export function getProducts(): Product[] {
  return products;
}
