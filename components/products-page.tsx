"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Select, Pagination, Spin, Alert, Input, Divider } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import ProductList from "./product-list";
import CategoryFilter from "./category-filter";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  fetchProductsAsync,
  sortProducts,
} from "@/lib/features/products/productsSlice";
import { fetchCategoriesAsync } from "@/lib/features/categories/categoriesSlice";
import {
  setPage,
  setPageSize,
  setSelectedCategory,
  setSortBy,
  setSearchTerm,
  setFiltersFromUrl,
} from "@/lib/features/filters/filtersSlice";
import { getFiltersFromUrl, buildUrlFromFilters } from "@/lib/utils/url-params";
import { log } from "node:console";
import { debounce } from "lodash";

const { Option } = Select;

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get state from Redux
  const {
    items: products,
    loading,
    error,
    total,
  } = useAppSelector((state) => state.products);
  const { items: categories } = useAppSelector((state) => state.categories);
  const { page, pageSize, selectedCategory, sortBy, searchTerm } =
    useAppSelector((state) => state.filters);

  // Initialize filters from URL on component mount
  useEffect(() => {
    const filtersFromUrl = getFiltersFromUrl(searchParams);
    dispatch(setFiltersFromUrl(filtersFromUrl));
  }, [dispatch, searchParams]);

  // Calculate skip for pagination
  const skip = (page - 1) * pageSize;

  // Fetch products when filters change
  useEffect(() => {
    dispatch(
      fetchProductsAsync({
        limit: pageSize,
        skip,
        category: selectedCategory,
        q: searchTerm,
      })
    );
  }, [dispatch, pageSize, skip, selectedCategory, searchTerm]);

  // Fetch categories on component mount
  useEffect(() => {
    dispatch(fetchCategoriesAsync());
  }, [dispatch]);

  // Apply client-side sorting when sortBy changes
  useEffect(() => {
    if (sortBy !== "default") {
      dispatch(sortProducts(sortBy));
    }
  }, [dispatch, sortBy]);

  // Update URL when filters change
  useEffect(() => {
    const url = buildUrlFromFilters({
      page,
      pageSize,
      selectedCategory,
      sortBy,
      searchTerm,
    });

   
    router.replace(url ? `/?${url}` : "/", { scroll: false });
  }, [router, page, pageSize, selectedCategory, sortBy, searchTerm]);

  const handlePageChange = (newPage: number, newPageSize: number) => {
    dispatch(setPage(newPage));
    dispatch(setPageSize(newPageSize));
  };

  const handleCategoryChange = (category: string | null) => {
    dispatch(setSelectedCategory(category));
  };

  const handleSortChange = (value: string) => {
    dispatch(setSortBy(value));
  };

  const handleSearch = (value: string) => {
    dispatch(setSearchTerm(value));
  };

  const debouncedHandleSearch = debounce(handleSearch, 500);
  useEffect(() => {
    dispatch(setSelectedCategory(null));
    debouncedHandleSearch(search);
  }, [search]);


  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Products</h1>

      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="w-full md:w-1/4">
          <div className="bg-white p-4 rounded shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Filters</h2>

            <div className="mb-4">
              <p className="mb-2 text-gray-700">Search</p>
              <Input
                placeholder="Search products"
                prefix={<SearchOutlined />}
                onChange={(e) => setSearch(e.target.value)}
                value={search}
                allowClear
              />
            </div>

            <Divider className="my-4" />

            <div className="mb-4">
              <p className="mb-2 text-gray-700">Category</p>
              <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onChange={handleCategoryChange}
              />
            </div>

            <Divider className="my-4" />

            <div>
              <p className="mb-2 text-gray-700">Sort By</p>
              <Select
                className="w-full"
                value={sortBy}
                onChange={handleSortChange}
              >
                <Option value="default">Default</Option>
                <Option value="price-asc">Price: Low to High</Option>
                <Option value="price-desc">Price: High to Low</Option>
                <Option value="rating">Rating</Option>
              </Select>
            </div>
          </div>
        </div>

        <div className="w-full md:w-3/4">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Spin size="large" />
            </div>
          ) : error ? (
            <Alert message="Error" description={error} type="error" showIcon />
          ) : (
            <>
              <ProductList products={products} />

              <div className="mt-8 flex justify-center">
                <Pagination
                  current={page}
                  pageSize={pageSize}
                  total={total}
                  onChange={handlePageChange}
                  showSizeChanger
                  pageSizeOptions={["5", "10", "20", "50"]}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
