"use client"

import Link from "next/link"
import { ShoppingCartOutlined, UserOutlined } from "@ant-design/icons"
import { Badge, Button } from "antd"
import { useAppSelector } from "../lib/hooks"


export default function Header() {
  const cartItems = useAppSelector((state) => state.cart.items)

  return (
    <header className="bg-white shadow-md py-4 px-6 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          SalonaShop
        </Link>

        <div className="flex items-center gap-4">
          <Badge count={cartItems.length} showZero>
            <Button type="text" icon={<ShoppingCartOutlined className="text-xl" />} size="large" />
          </Badge>

          <Button type="text" icon={<UserOutlined className="text-xl" />} size="large" />
        </div>
      </div>
    </header>
  )
}
