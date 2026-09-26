import { motion } from "motion/react";
import Sidebar from "../components/Sidebar";
import { PackageSearch, AlertTriangle, Truck, ArrowDownToLine, ArrowRightLeft, Search, Filter } from "lucide-react";

const kpis = [
  { title: "Total Products", value: "2,405", icon: PackageSearch, color: "text-blue-500", bg: "bg-blue-500/10" },
  { title: "Low / Out of Stock", value: "34", icon: AlertTriangle, color: "text-red-500", bg: "bg-red-500/10" },
  { title: "Pending Receipts", value: "12", icon: ArrowDownToLine, color: "text-green-500", bg: "bg-green-500/10" },
  { title: "Pending Deliveries", value: "8", icon: Truck, color: "text-amber-500", bg: "bg-amber-500/10" },
  { title: "Internal Transfers", value: "3", icon: ArrowRightLeft, color: "text-purple-500", bg: "bg-purple-500/10" },
];

export default function Dashboard() {
  return (
    <div className="w-full h-screen flex bg-[#f0f0f0] overflow-hidden">
      <Sidebar />
      <main className="flex-1 h-full p-6 md:p-10 overflow-y-auto">
        <div className="max-w-7xl mx-auto flex flex-col gap-8">
          
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-3xl font-normal text-[rgba(30,50,90,0.9)] tracking-tight mb-1">Inventory Dashboard</h1>
              <p className="text-sm text-[rgba(30,50,90,0.6)] font-normal">Real-time snapshot of your stock operations.</p>
            </div>
            
            {/* Action Bar */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(30,50,90,0.4)]" />
                <input 
                  type="text" 
                  placeholder="Search SKU..." 
                  className="pl-9 pr-4 py-2 rounded-full bg-white/50 backdrop-blur-md border border-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-[rgba(30,50,90,0.2)] text-[rgba(30,50,90,0.8)] placeholder-[rgba(30,50,90,0.4)] w-64"
                />
              </div>
            </div>
          </motion.div>

          {/* KPIs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {kpis.map((kpi, index) => {
              const Icon = kpi.icon;
              return (
                <motion.div 
                  key={kpi.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="p-5 rounded-[1.5rem] bg-white/40 backdrop-blur-xl border border-white/30 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow group cursor-pointer"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${kpi.bg}`}>
                    <Icon className={`w-5 h-5 ${kpi.color}`} />
                  </div>
                  <div>
                    <h3 className="text-[28px] font-normal text-[rgba(30,50,90,0.95)] leading-none mb-1">{kpi.value}</h3>
                    <p className="text-[12px] font-normal text-[rgba(30,50,90,0.6)] uppercase tracking-wider">{kpi.title}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Dynamic Filters Section (Glassmorphism Tabs) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col gap-4"
          >
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[rgba(30,50,90,0.6)]" />
              <h2 className="text-sm font-normal text-[rgba(30,50,90,0.8)]">Dynamic Filters</h2>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="px-4 py-2 rounded-full bg-white/60 text-[rgba(30,50,90,0.9)] text-sm font-normal border border-white/50 cursor-pointer shadow-sm">All Types</div>
              <div className="px-4 py-2 rounded-full bg-white/30 text-[rgba(30,50,90,0.6)] text-sm font-normal border border-transparent hover:bg-white/40 hover:border-white/20 cursor-pointer transition-all">Receipts</div>
              <div className="px-4 py-2 rounded-full bg-white/30 text-[rgba(30,50,90,0.6)] text-sm font-normal border border-transparent hover:bg-white/40 hover:border-white/20 cursor-pointer transition-all">Deliveries</div>
              <div className="px-4 py-2 rounded-full bg-white/30 text-[rgba(30,50,90,0.6)] text-sm font-normal border border-transparent hover:bg-white/40 hover:border-white/20 cursor-pointer transition-all">Internal Transfers</div>
              <div className="h-6 w-px bg-[rgba(30,50,90,0.1)] mx-1"></div>
              <div className="px-4 py-2 rounded-full bg-white/30 text-[rgba(30,50,90,0.6)] text-sm font-normal border border-transparent hover:bg-white/40 hover:border-white/20 cursor-pointer transition-all flex items-center gap-2">
                Status <span className="bg-[rgba(30,50,90,0.1)] text-[10px] px-1.5 py-0.5 rounded-md">Any</span>
              </div>
              <div className="px-4 py-2 rounded-full bg-white/30 text-[rgba(30,50,90,0.6)] text-sm font-normal border border-transparent hover:bg-white/40 hover:border-white/20 cursor-pointer transition-all flex items-center gap-2">
                Warehouse <span className="bg-[rgba(30,50,90,0.1)] text-[10px] px-1.5 py-0.5 rounded-md">Main</span>
              </div>
            </div>
          </motion.div>

          {/* Main Content Area / Table Placeholder */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex-1 w-full bg-white/40 backdrop-blur-xl border border-white/30 rounded-[2rem] p-8 flex flex-col items-center justify-center min-h-[300px]"
          >
            <div className="w-16 h-16 bg-white/50 rounded-full flex items-center justify-center mb-4">
              <PackageSearch className="w-6 h-6 text-[rgba(30,50,90,0.4)]" />
            </div>
            <h3 className="text-lg font-normal text-[rgba(30,50,90,0.9)] mb-2">Operations Feed</h3>
            <p className="text-sm text-[rgba(30,50,90,0.5)] text-center max-w-sm">
              Select a filter above or search to view specific receipts, deliveries, and adjustments. Data table will appear here.
            </p>
          </motion.div>

        </div>
      </main>
    </div>
  );
}
