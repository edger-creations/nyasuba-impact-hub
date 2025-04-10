
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { PanelLeft, LayoutDashboard, FileText, Users, HandCoins, Image, MessageSquare, Settings, LogOut, UserCog } from "lucide-react";
import { useState } from "react";

const AdminSidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      path: "/admin/dashboard",
    },
    {
      title: "Programs",
      icon: <FileText className="h-5 w-5" />,
      path: "/admin/programs",
    },
    {
      title: "Volunteers",
      icon: <Users className="h-5 w-5" />,
      path: "/admin/volunteers",
    },
    {
      title: "Donations",
      icon: <HandCoins className="h-5 w-5" />,
      path: "/admin/donations",
    },
    {
      title: "Gallery",
      icon: <Image className="h-5 w-5" />,
      path: "/admin/gallery",
    },
    {
      title: "Reviews",
      icon: <MessageSquare className="h-5 w-5" />,
      path: "/admin/reviews",
    },
    {
      title: "Users",
      icon: <UserCog className="h-5 w-5" />,
      path: "/admin/users",
    },
    {
      title: "Settings",
      icon: <Settings className="h-5 w-5" />,
      path: "/admin/settings",
    },
  ];

  return (
    <div 
      className={`bg-white dark:bg-gray-800 shadow-md transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && (
          <h2 className="font-bold text-enf-green dark:text-enf-light-green">ENF Admin</h2>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto"
        >
          <PanelLeft className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex flex-col p-4">
        {menuItems.map((item) => (
          <Button
            key={item.path}
            variant="ghost"
            className={`justify-start mb-1 ${
              location.pathname === item.path
                ? "bg-enf-green/10 text-enf-green dark:bg-enf-light-green/10 dark:text-enf-light-green"
                : ""
            } ${collapsed ? "px-2" : "px-4"}`}
            onClick={() => navigate(item.path)}
          >
            {item.icon}
            {!collapsed && <span className="ml-2">{item.title}</span>}
          </Button>
        ))}
      </div>

      <div className="absolute bottom-4 left-0 right-0 px-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span className="ml-2">Logout</span>}
        </Button>
      </div>
    </div>
  );
};

export default AdminSidebar;
