"use client"

import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { Review } from "@/lib/types"

interface ReviewsState {
  items: Record<string, Review[]>
  loading: boolean
  error: string | null
}

const initialState: ReviewsState = {
  items: {},
  loading: false,
  error: null,
}

// In a real app, this would be an API call
export const addReviewAsync = createAsyncThunk(
  "reviews/addReview",
  async ({ productId, review }: { productId: string; review: Omit<Review, "id" | "date"> }) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return {
      productId,
      review: {
        ...review,
        id: Date.now(),
        date: new Date().toISOString(),
      },
    }
  },
)

export const reviewsSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {
    setProductReviews: (state, action: PayloadAction<{ productId: string; reviews: Review[] }>) => {
      const { productId, reviews } = action.payload
      state.items[productId] = reviews
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addReviewAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addReviewAsync.fulfilled, (state, action) => {
        state.loading = false
        const { productId, review } = action.payload
        if (!state.items[productId]) {
          state.items[productId] = []
        }
        state.items[productId].push(review)
      })
      .addCase(addReviewAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to add review"
      })
  },
})

export const { setProductReviews } = reviewsSlice.actions

export default reviewsSlice.reducer
