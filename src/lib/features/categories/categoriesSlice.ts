"use client"

import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { fetchCategories } from "../../api"
import type { Category } from "../../types"

interface CategoriesState {
  items: Category[]
  loading: boolean
  error: string | null
}

const initialState: CategoriesState = {
  items: [],
  loading: false,
  error: null,
}

export const fetchCategoriesAsync = createAsyncThunk("categories/fetchCategories", async () => {
  const response = await fetchCategories()
  return response
})

export const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategoriesAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCategoriesAsync.fulfilled, (state, action: PayloadAction<Category[]>) => {
        state.loading = false
        console.log(action.payload);
        
        state.items = action.payload
      })
      .addCase(fetchCategoriesAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch categories"
      })
  },
})

export default categoriesSlice.reducer
