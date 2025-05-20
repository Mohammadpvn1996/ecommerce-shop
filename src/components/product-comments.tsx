"use client"

import { useState, useEffect } from "react"
import { Form, Button, List, Input, Rate } from "antd"
import { Comment } from "@ant-design/compatible"
import { UserOutlined } from "@ant-design/icons"
import { Avatar } from "antd"
import { useAppDispatch, useAppSelector } from "../lib/hooks"
import { addReviewAsync, setProductReviews } from "../lib/features/reviews/reviewsSlice"
import type { Review } from "../lib/types"

const { TextArea } = Input

interface ProductCommentsProps {
  productId: string
  reviews: Review[]
}

export default function ProductComments({ productId, reviews = [] }: ProductCommentsProps) {
  const dispatch = useAppDispatch()
  const storeReviews = useAppSelector((state) => state.reviews.items[productId] || [])
  const isLoading = useAppSelector((state) => state.reviews.loading)

  const [value, setValue] = useState("")
  const [rating, setRating] = useState(5)

  // Initialize reviews in Redux store
  useEffect(() => {
    if (reviews.length > 0 && storeReviews.length === 0) {
      dispatch(setProductReviews({ productId, reviews }))
    }
  }, [dispatch, productId, reviews, storeReviews.length])

  const handleSubmit = () => {
    if (!value) return

    dispatch(
      addReviewAsync({
        productId,
        review: {
          user: "You",
          rating,
          comment: value,
        },
      }),
    ).then(() => {
      setValue("")
      setRating(5)
    })
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Customer Reviews</h2>

      {storeReviews.length > 0 ? (
        <List
          className="comment-list mb-8"
          header={`${storeReviews.length} reviews`}
          itemLayout="horizontal"
          dataSource={storeReviews}
          renderItem={(item) => (
            <li>
              <Comment
                author={item.user}
                avatar={<Avatar icon={<UserOutlined />} alt={item.user} />}
                content={
                  <div>
                    <Rate disabled defaultValue={item.rating} allowHalf className="mb-2" />
                    <p>{item.comment}</p>
                  </div>
                }
                datetime={new Date(item.date).toLocaleString()}
              />
            </li>
          )}
        />
      ) : (
        <div className="text-center py-8 text-gray-500 mb-8">No reviews yet. Be the first to review this product!</div>
      )}

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Write a Review</h3>

        <div className="mb-4">
          <p className="mb-2">Your Rating</p>
          <Rate value={rating} onChange={setRating} allowHalf />
        </div>

        <Form.Item>
          <TextArea
            rows={4}
            onChange={(e) => setValue(e.target.value)}
            value={value}
            placeholder="Write your review here..."
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" loading={isLoading} onClick={handleSubmit} disabled={!value.trim()}>
            Submit Review
          </Button>
        </Form.Item>
      </div>
    </div>
  )
}
