export interface Product {
  id: number
  title: string
  description: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  brand: string
  category: string
  thumbnail: string
  images: string[]
  reviews: Review[]
}

export interface Review {
  id: number
  user: string
  rating: number
  comment: string
  date: string
}

export interface ProductsResponse {
  products: Product[]
  total: number
  skip: number
  limit: number
}

export interface CartItem {
  id: number
  title: string
  price: number
  thumbnail: string
  quantity: number
}

export interface Category {
  name: string
  url: string
  slug: string
}
