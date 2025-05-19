import { Row, Col } from "antd"
import ProductCard from "./product-card"
import type { Product } from "@/lib/types"

interface ProductListProps {
  products: Product[]
}

export default function ProductList({ products }: ProductListProps) {
  return (
    <Row gutter={[16, 16]}>
      {products.map((product) => (
        <Col xs={24} sm={12} md={8} lg={8} xl={6} key={product.id}>
          <ProductCard product={product} />
        </Col>
      ))}
    </Row>
  )
}
