import { motion } from "motion/react";
import { LayoutDashboard, Package, ArrowRightLeft, Settings, LogOut, User } from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userName?: string;
}

export default function Sidebar({ activeTab, setActiveTab, userName = "Alex Mercer" }: SidebarProps) {
  const menuItems = [
    { name: "Dashboard", id: "dashboard", icon: LayoutDashboard },
    { name: "Products", id: "products", icon: Package },
    { name: "Operations", id: "operations", icon: ArrowRightLeft },
    { name: "Settings", id: "settings", icon: Settings },
  ];

  return (
    <motion.aside 
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.1 }}
      className="w-64 h-full flex flex-col justify-between bg-white/40 backdrop-blur-2xl border-r border-white/20 p-6 shadow-[4px_0_24px_rgba(0,0,0,0.02)]"
    >
      <div>
        <a href="/" className="flex items-center gap-2 mb-12 cursor-pointer hover:opacity-80 transition-opacity">
          <div className="bg-[rgba(30,50,90,0.8)] p-2 rounded-xl">
            <Package className="w-5 h-5 text-white" />
          </div>
          <span className="font-regular tracking-tighter text-xl text-[rgba(30,50,90,0.9)]">StockSense</span>
        </a>
        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button 
                key={item.id} 
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 text-left ${
                  isActive 
                    ? "bg-white/60 text-[rgba(30,50,90,1)] shadow-sm" 
                    : "text-[rgba(30,50,90,0.6)] hover:bg-white/40 hover:text-[rgba(30,50,90,0.9)]"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-[rgba(30,50,90,0.9)]" : "text-[rgba(30,50,90,0.5)]"}`} />
                <span className="font-normal text-sm">{item.name}</span>
              </button>
            )
          })}
        </nav>
      </div>

      <div className="flex flex-col gap-2">
        <button 
          onClick={() => setActiveTab('settings')}
          className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 text-[rgba(30,50,90,0.6)] hover:bg-white/40 hover:text-[rgba(30,50,90,0.9)] text-left"
        >
          <User className="w-5 h-5 text-[rgba(30,50,90,0.5)]" />
          <span className="font-normal text-sm">{userName}</span>
        </button>
        <button 
          onClick={() => {
            localStorage.removeItem("stockSenseUser");
            window.location.href = '/';
          }}
          className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 text-[rgba(30,50,90,0.6)] hover:bg-[rgba(220,53,69,0.1)] hover:text-[#dc3545] text-left"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-normal text-sm">Logout</span>
        </button>
      </div>
    </motion.aside>
  );
}
