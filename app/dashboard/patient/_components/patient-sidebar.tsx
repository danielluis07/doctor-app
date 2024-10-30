import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Calendar,
  House,
  MessageCircle,
  UserPen,
  Users,
  CalendarSearch,
  Stethoscope,
} from "lucide-react";
import { LogoutBtn } from "@/components/auth/logout-btn";

const items = [
  {
    url: "/",
    icon: House,
    label: "Início",
  },
  {
    url: "/dashboard/patient/profile",
    icon: UserPen,
    label: "Meu Perfil",
  },
  {
    url: "/dashboard/patient/appointments",
    icon: CalendarSearch,
    label: "Minhas Consultas",
  },
  {
    url: "/dashboard/patient/doctors",
    icon: Stethoscope,
    label: "Procurar Médicos",
  },
];

export function PatientSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <h1 className="text-xl font-bold">MedFind</h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <LogoutBtn />
        <p className="text-[10px] text-gray-500 text-center">
          © 2024 MedFind. Todos os direitos reservados.
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
