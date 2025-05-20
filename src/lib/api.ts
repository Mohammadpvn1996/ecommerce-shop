import type { Product, ProductsResponse, Category } from "./types"

interface FetchProductsParams {
  limit?: number
  skip?: number
  category?: string | null
  q?: string
}

export async function fetchProducts({
  limit = 10,
  skip = 0,
  category = null,
  q = "",
}: FetchProductsParams): Promise<ProductsResponse> {
  let url = `https://dummyjson.com/products?limit=${limit}&skip=${skip}`

  if (category) {
    url = `https://dummyjson.com/products/category/${category}?limit=${limit}&skip=${skip}`
  }

  if (q) {
    url = `https://dummyjson.com/products/search?q=${q}&limit=${limit}&skip=${skip}`
  }

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error("Failed to fetch products")
  }

  return response.json()
}

export async function fetchProductById(id: string): Promise<Product> {
  const response = await fetch(`https://dummyjson.com/products/${id}`)

  if (!response.ok) {
    throw new Error("Failed to fetch product")
  }

  return response.json()
}

export async function fetchCategories(): Promise<Category[]> {
  // In a real app, this would fetch from the API
  // Since the DummyJSON API doesn't return categories in the format we need,
  // we'll transform the data here
  const response = await fetch("https://dummyjson.com/products/categories")

  if (!response.ok) {
    throw new Error("Failed to fetch categories")
  }

  const category =await response.json()

  // Transform the string array into our Category objects
  return category
}
