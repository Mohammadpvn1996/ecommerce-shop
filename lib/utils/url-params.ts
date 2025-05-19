import type { ReadonlyURLSearchParams } from "next/navigation"

export function getFiltersFromUrl(searchParams: ReadonlyURLSearchParams) {
  const page = searchParams.get("page") ? Number.parseInt(searchParams.get("page") as string, 10) : 1
  const pageSize = searchParams.get("pageSize") ? Number.parseInt(searchParams.get("pageSize") as string, 10) : 10
  const selectedCategory = searchParams.get("category")
  const sortBy = searchParams.get("sort") || "default"
  const searchTerm = searchParams.get("q") || ""

  return {
    page,
    pageSize,
    selectedCategory,
    sortBy,
    searchTerm,
  }
}

export function buildUrlFromFilters(filters: {
  page: number
  pageSize: number
  selectedCategory: string | null
  sortBy: string
  searchTerm: string
}) {
  const params = new URLSearchParams()

  if (filters.page > 1) {
    params.set("page", filters.page.toString())
  }

  if (filters.pageSize !== 10) {
    params.set("pageSize", filters.pageSize.toString())
  }

  if (filters.selectedCategory) {
    params.set("category", filters.selectedCategory)
  }

  if (filters.sortBy !== "default") {
    params.set("sort", filters.sortBy)
  }

  if (filters.searchTerm) {
    params.set("q", filters.searchTerm)
  }

  return params.toString()
}
