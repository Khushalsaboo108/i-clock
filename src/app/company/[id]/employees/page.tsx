"use client"

import { useParams } from "next/navigation"
import { EmployeeListScreen } from "@/components/employee-list-screen"

export default function EmployeesPage() {
  const params = useParams()
  const companyId = params.id as string

  return <EmployeeListScreen companyId={companyId} />
}
