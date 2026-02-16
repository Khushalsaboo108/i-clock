import { redirect } from "next/navigation"
import { getSiteByIdAction } from "@/lib/actions/site.actions"
import { CompanyManagementScreen } from "@/components/company/company-management-screen"

export default async function EditCompanyPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const result = await getSiteByIdAction(id)

  if (!result.success || !result.data) {
    redirect("/")
  }

  // Map API data to Form Values structure if necessary
  // (In this case, the schema and API mostly align for site fields)
  const initialData = {
    name: result.data.name,
    site_code: result.data.site_code,
    contact: result.data.contact || "",
    site_password: result.data.site_password || "",
    agrigistics_site: !!result.data.agrigistics_site,
    send_agrigistics_gps: !!result.data.send_agrigistics_gps,
    pull_employees: !!result.data.pull_employees,
    send_attendance: !!result.data.send_attendance,
    easyroster: !!result.data.easyroster,
    eduman: !!result.data.eduman,
    auto_remove_emp: !!result.data.auto_remove_emp,
    access_user: !!result.data.access_user,
    easyroster_token: result.data.easyroster_token || "",
    data_format: result.data.data_format,
    data_format_other: result.data.data_format_other,
    server_ip: result.data.server_ip || "",
  }

  return <CompanyManagementScreen siteId={id} initialData={initialData} />
}
