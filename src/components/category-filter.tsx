"use client";

import { Radio, Space } from "antd";
import type { Category } from "../lib/types";

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onChange: (category: string | null) => void;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onChange,
}: CategoryFilterProps) {
  return (
    <Radio.Group
      value={selectedCategory || "all"}
      onChange={(e) => {
        onChange(e.target.value === "all" ? null : e.target.value);
      }}
      className="w-full"
    >
      <Space direction="vertical" className="w-full">
        <Radio value="all">All Categories</Radio>
        {categories.map((category) => (
          <Radio key={category.slug} value={category.slug}>
            {category.name}
          </Radio>
        ))}
      </Space>
    </Radio.Group>
  );
}
