import { auth } from "@/auth";
import { PatientSidebar } from "@/app/dashboard/patient/_components/patient-sidebar";
import { Navbar } from "@/components/navbar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default async function PatientDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    return <div>Unauthorized</div>;
  }

  return (
    <SidebarProvider>
      <PatientSidebar />
      <main className="flex flex-col w-full h-full py-7 px-9">
        <Navbar user={session.user} />
        {children}
      </main>
    </SidebarProvider>
  );
}
