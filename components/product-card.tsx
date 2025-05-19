"use client"

import type React from "react"
import { Card, Rate, Badge, Button } from "antd"
import { ShoppingCartOutlined, HeartOutlined } from "@ant-design/icons"
import Image from "next/image"
import Link from "next/link"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { addToCart } from "@/lib/features/cart/cartSlice"
import type { Product } from "@/lib/types"

const { Meta } = Card

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const dispatch = useAppDispatch()
  const { selectedCategory } = useAppSelector((state) => state.filters)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
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

  const discountBadge =
    product.discountPercentage > 10 ? (
      <Badge.Ribbon text={`${Math.round(product.discountPercentage)}% OFF`} color="red" />
    ) : null

  // Build the URL with the current category preserved
  const productUrl = selectedCategory
    ? `/products/${product.id}?category=${selectedCategory}`
    : `/products/${product.id}`

  return (
    <Link href={productUrl}>
      <Card
        hoverable
        className="h-full flex flex-col"
        cover={
          <div className="relative pt-[75%]">
            {discountBadge}
            <Image
              src={product.thumbnail || "/placeholder.svg"}
              alt={product.title}
              fill
              className="object-cover rounded-t-lg"
            />
          </div>
        }
        actions={[
          <Button key="add-to-cart" type="text" icon={<ShoppingCartOutlined />} onClick={handleAddToCart} />,
          <Button key="favorite" type="text" icon={<HeartOutlined />} />,
        ]}
      >
        <Meta
          title={product.title}
          description={
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-bold text-blue-600">${product.price}</span>
                <Rate disabled defaultValue={product.rating} allowHalf className="text-xs" />
              </div>
              <p className="text-gray-500 text-sm line-clamp-2">{product.description}</p>
            </div>
          }
        />
      </Card>
    </Link>
  )
}
