import { auth } from "@/auth";
import { DoctorSidebar } from "@/app/dashboard/doctor/_components/doctor-sidebar";
import { Navbar } from "@/components/navbar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default async function DoctorDashboardLayout({
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
      <DoctorSidebar />
      <main className="flex flex-col w-full h-full py-7 px-9">
        <Navbar user={session.user} />
        {children}
      </main>
    </SidebarProvider>
  );
}
