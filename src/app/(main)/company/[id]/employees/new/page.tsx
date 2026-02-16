import { EmployeeManagementScreen } from "@/components/employ/employee-management-screen"

interface NewEmployeePageProps {
  params: Promise<{ id: string }>
}

export default async function NewEmployeePage({ params }: NewEmployeePageProps) {
  const { id } = await params

  return <EmployeeManagementScreen companyId={id} employeeId="new" />
}
