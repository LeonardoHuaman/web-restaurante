// src/types/Product.ts
export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image_url: string;
    is_active: boolean;
    categories: string[];
}
