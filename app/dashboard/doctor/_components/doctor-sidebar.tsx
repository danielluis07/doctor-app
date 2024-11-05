import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Calendar, House, MessageCircle, UserPen, Users } from "lucide-react";
import { LogoutBtn } from "@/components/auth/logout-btn";
import Image from "next/image";
import logo from "@/public/app-logo.png";

const items = [
  {
    url: "/",
    icon: House,
    label: "Início",
  },
  {
    url: "/dashboard/doctor/profile",
    icon: UserPen,
    label: "Meu Perfil",
  },
  {
    url: "/dashboard/doctor/availability",
    icon: Calendar,
    label: "Minhas Datas",
  },
  {
    url: "/dashboard/doctor/appointments",
    icon: Users,
    label: "Minhas Consultas",
  },
  {
    url: "/dashboard/doctor/comments",
    icon: MessageCircle,
    label: "Comentários",
  },
];

export function DoctorSidebar() {
  return (
    <Sidebar>
      <div className="flex items-center gap-2 p-4">
        <Image src={logo} width={40} height={40} alt="logo" />
        <h1 className="text-lg font-bold">MedFind</h1>
      </div>
      <SidebarContent>
        <SidebarGroup>
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
