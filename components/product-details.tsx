"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Spin, Rate, Tabs, Button, Divider, Image as AntImage, Tag, Alert } from "antd"
import { ShoppingCartOutlined, HeartOutlined, ShareAltOutlined, ArrowLeftOutlined } from "@ant-design/icons"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { fetchProductByIdAsync, clearSelectedProduct } from "@/lib/features/products/productsSlice"
import { addToCart } from "@/lib/features/cart/cartSlice"
import ProductComments from "./product-comments"

interface ProductDetailsProps {
  productId: string
}

export default function ProductDetails({ productId }: ProductDetailsProps) {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { selectedProduct: product, loading, error } = useAppSelector((state) => state.products)

  // Get the category from URL if present
  const categoryFromUrl = searchParams.get("category")

  useEffect(() => {
    dispatch(fetchProductByIdAsync(productId))

    // Clean up when component unmounts
    return () => {
      dispatch(clearSelectedProduct())
    }
  }, [dispatch, productId])

  const handleAddToCart = () => {
    if (product) {
      dispatch(
        addToCart({
          id: product.id,
          title: product.title,
          price: product.price,
          thumbnail: product.thumbnail,
          quantity: 1,
        }),
      )
    }
  }

  const handleBackClick = () => {
    // Navigate back to products page with the category filter preserved
    if (categoryFromUrl) {
      router.push(`/?category=${categoryFromUrl}`)
    } else {
      router.push("/")
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spin size="large" />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Alert message="Error" description={error || "Product not found"} type="error" showIcon />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Button icon={<ArrowLeftOutlined />} onClick={handleBackClick} className="mb-6">
        Back to Products
      </Button>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          {/* Product Images */}
          <div>
            <div className="mb-4">
              <AntImage
                src={product.thumbnail}
                alt={product.title}
                className="rounded-lg w-full object-cover"
                style={{ height: "400px" }}
              />
            </div>

            <div className="grid grid-cols-5 gap-2">
              {product.images.map((image, index) => (
                <AntImage
                  key={index}
                  src={image}
                  alt={`${product.title} - ${index}`}
                  className="rounded-lg object-cover cursor-pointer"
                  style={{ height: "80px" }}
                />
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-4">
              <Tag color="blue">{product.category}</Tag>
              <Tag color="green">{product.brand}</Tag>
            </div>

            <h1 className="text-3xl font-bold mb-2">{product.title}</h1>

            <div className="flex items-center mb-4">
              <Rate disabled defaultValue={product.rating} allowHalf />
              <span className="ml-2 text-gray-500">({product.rating})</span>
            </div>

            <p className="text-gray-700 mb-6">{product.description}</p>

            <div className="flex items-baseline mb-6">
              <span className="text-3xl font-bold text-blue-600 mr-4">${product.price}</span>
              {product.discountPercentage > 0 && (
                <span className="text-lg text-gray-500 line-through">
                  ${Math.round(product.price / (1 - product.discountPercentage / 100))}
                </span>
              )}
            </div>

            <div className="mb-6">
              <p className="text-gray-700 mb-2">Stock: {product.stock} units</p>
            </div>

            <div className="flex space-x-4">
              <Button type="primary" size="large" icon={<ShoppingCartOutlined />} onClick={handleAddToCart}>
                Add to Cart
              </Button>
              <Button size="large" icon={<HeartOutlined />}>
                Wishlist
              </Button>
              <Button size="large" icon={<ShareAltOutlined />}>
                Share
              </Button>
            </div>
          </div>
        </div>

        <Divider style={{ margin: 0 }} />

        <Tabs
          defaultActiveKey="1"
          items={[
            {
              key: "1",
              label: "Description",
              children: (
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Product Description</h2>
                  <p className="text-gray-700">{product.description}</p>

                  <h3 className="text-lg font-semibold mt-6 mb-3">Specifications</h3>
                  <ul className="list-disc pl-5 text-gray-700">
                    <li>Brand: {product.brand}</li>
                    <li>Category: {product.category}</li>
                    <li>Rating: {product.rating}/5</li>
                    <li>Stock: {product.stock} units</li>
                  </ul>
                </div>
              ),
            },
            {
              key: "2",
              label: "Reviews",
              children: (
                <div className="p-6">
                  <ProductComments productId={productId} reviews={product.reviews || []} />
                </div>
              ),
            },
          ]}
        />
      </div>
    </div>
  )
}
