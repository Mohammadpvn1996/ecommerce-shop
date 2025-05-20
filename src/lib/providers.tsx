"use client"

import { useState, useEffect, type ReactNode } from "react"
import { Provider as ReduxProvider } from "react-redux"
import { ConfigProvider } from "antd"
import { store } from "./store"

export function Providers({ children }: { children: ReactNode }) {
 
  return (
    <ReduxProvider store={store}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#1677ff",
          },
        }}
      >
        {children}
      </ConfigProvider>
    </ReduxProvider>
  )
}
