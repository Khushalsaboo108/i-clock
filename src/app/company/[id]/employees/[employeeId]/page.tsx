"use client"

import { useParams } from "next/navigation"
import { EmployeeManagementScreen } from "@/components/employee-management-screen"

export default function EmployeeDetailPage() {
  const params = useParams()
  const employeeId = params.employeeId as string
  const companyId = params.id as string

  return <EmployeeManagementScreen employeeId={employeeId} companyId={companyId} />
}
