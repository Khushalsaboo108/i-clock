import { ClockingsScreen } from "@/components/clockings/clockings-screen"
import { Suspense } from "react"

export default function Page() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <ClockingsScreen />
    </Suspense>
  )
}
