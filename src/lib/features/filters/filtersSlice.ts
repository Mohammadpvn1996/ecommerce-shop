"use client"

import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface FiltersState {
  page: number
  pageSize: number
  selectedCategory: string | null
  sortBy: string
  searchTerm: string
}

const initialState: FiltersState = {
  page: 1,
  pageSize: 10,
  selectedCategory: null,
  sortBy: "default",
  searchTerm: "",
}

export const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload
    },
    setSelectedCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload
      state.page = 1 // Reset to first page when changing category
    },
    setSortBy: (state, action: PayloadAction<string>) => {
      state.sortBy = action.payload
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload
      state.page = 1 // Reset to first page when searching
    },
    setFiltersFromUrl: (state, action: PayloadAction<Partial<FiltersState>>) => {
      return { ...state, ...action.payload }
    },
    resetFilters: (state) => {
      state.page = 1
      state.selectedCategory = null
      state.sortBy = "default"
      state.searchTerm = ""
    },
  },
})

export const { setPage, setPageSize, setSelectedCategory, setSortBy, setSearchTerm, setFiltersFromUrl, resetFilters } =
  filtersSlice.actions

export default filtersSlice.reducer
