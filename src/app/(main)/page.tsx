import { Suspense } from "react"
import { CompanySelectionScreen, CompanySkeleton } from "@/components/company/company-selection-screen"

function LoadingFallback() {
  return <CompanySkeleton />
}

export default function Page() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CompanySelectionScreen />
    </Suspense>
  )
}
