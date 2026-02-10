import type React from "react"
import CommonHeader from "@/components/common-component/common-header"

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <CommonHeader />
      {children}
    </>
  )
}
