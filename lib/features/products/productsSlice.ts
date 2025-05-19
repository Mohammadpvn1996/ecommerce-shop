"use client"

import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { fetchProducts, fetchProductById } from "@/lib/api"
import type { Product, ProductsResponse } from "@/lib/types"

interface ProductsState {
  items: Product[]
  selectedProduct: Product | null
  loading: boolean
  error: string | null
  total: number
  skip: number
  limit: number
}

const initialState: ProductsState = {
  items: [],
  selectedProduct: null,
  loading: false,
  error: null,
  total: 0,
  skip: 0,
  limit: 10,
}

export const fetchProductsAsync = createAsyncThunk(
  "products/fetchProducts",
  async ({ limit, skip, category, q }: { limit: number; skip: number; category: string | null; q: string }) => {
    const response = await fetchProducts({ limit, skip, category, q })
    return response
  },
)

export const fetchProductByIdAsync = createAsyncThunk("products/fetchProductById", async (id: string) => {
  const response = await fetchProductById(id)
  return response
})

export const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    sortProducts: (state, action: PayloadAction<string>) => {
      const sortBy = action.payload
      if (sortBy === "price-asc") {
        state.items = [...state.items].sort((a, b) => a.price - b.price)
      } else if (sortBy === "price-desc") {
        state.items = [...state.items].sort((a, b) => b.price - a.price)
      } else if (sortBy === "rating") {
        state.items = [...state.items].sort((a, b) => b.rating - a.rating)
      }
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProductsAsync.fulfilled, (state, action: PayloadAction<ProductsResponse>) => {
        state.loading = false
        state.items = action.payload.products
        state.total = action.payload.total
        state.skip = action.payload.skip
        state.limit = action.payload.limit
      })
      .addCase(fetchProductsAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch products"
      })
      .addCase(fetchProductByIdAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProductByIdAsync.fulfilled, (state, action: PayloadAction<Product>) => {
        state.loading = false
        state.selectedProduct = action.payload
      })
      .addCase(fetchProductByIdAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch product"
      })
  },
})

export const { sortProducts, clearSelectedProduct } = productsSlice.actions

export default productsSlice.reducer
