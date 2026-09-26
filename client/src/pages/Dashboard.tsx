import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Sidebar from "../components/Sidebar";
import { PackageSearch, AlertTriangle, Truck, ArrowDownToLine, ArrowRightLeft, Search, Filter, Plus, Settings, User, Bell, Shield, Moon, Save, ArrowDown, ArrowUp, RefreshCw, FileText, Download, Activity, Clock } from "lucide-react";

// Existing mock data
const kpis = [
  { title: "Total Products", value: "2,405", icon: PackageSearch, color: "text-blue-500", bg: "bg-blue-500/10" },
  { title: "Low / Out of Stock", value: "34", icon: AlertTriangle, color: "text-red-500", bg: "bg-red-500/10" },
  { title: "Pending Receipts", value: "12", icon: ArrowDownToLine, color: "text-green-500", bg: "bg-green-500/10" },
  { title: "Pending Deliveries", value: "8", icon: Truck, color: "text-amber-500", bg: "bg-amber-500/10" },
  { title: "Internal Transfers", value: "3", icon: ArrowRightLeft, color: "text-purple-500", bg: "bg-purple-500/10" },
];

const products = [
  { id: 1, name: "Premium Leather Sofa", sku: "FURN-SOF-01", price: "$1,299.00", stock: 12, category: "Living Room", image: "/sofa_1790404151421.jpg" },
  { id: 2, name: "Oak Dining Table", sku: "FURN-TBL-02", price: "$849.00", stock: 4, category: "Dining Room", image: "/dining_table_1790404166312.jpg" },
  { id: 3, name: "Glass Coffee Table", sku: "FURN-COF-03", price: "$349.00", stock: 0, category: "Living Room", image: "/coffee_table_1790404210385.jpg" },
  { id: 4, name: "Ergonomic Office Chair", sku: "FURN-CHR-04", price: "$299.00", stock: 45, category: "Office", image: "/office_chair_1790404225722.jpg" },
  { id: 5, name: "King Size Bed Frame", sku: "FURN-BED-05", price: "$999.00", stock: 8, category: "Bedroom", image: "/bed_frame_1790404238429.jpg" },
  { id: 6, name: "Modern Upholstered Dining Chair", sku: "FURN-DNC-06", price: "$149.00", stock: 24, category: "Dining Room", image: "/dining_chair_1790404644025.jpg" },
  { id: 7, name: "Tripod Shelf Floor Lamp", sku: "LIGH-FLR-07", price: "$129.00", stock: 15, category: "Lighting", image: "/custom_floor_lamp_1790405571407.jpg" }
];

const transactions = [
  { id: "TX-1042", type: "INBOUND", date: "Today, 10:45 AM", sku: "FURN-SOF-01", qty: "+5", user: "Admin", status: "Completed" },
  { id: "TX-1041", type: "OUTBOUND", date: "Today, 09:15 AM", sku: "LIGH-FLR-07", qty: "-2", user: "John Doe", status: "Completed" },
  { id: "TX-1040", type: "ADJUSTMENT", date: "Yesterday, 16:30 PM", sku: "FURN-COF-03", qty: "-1", user: "System", status: "Completed" },
  { id: "TX-1039", type: "INBOUND", date: "Yesterday, 11:20 AM", sku: "FURN-CHR-04", qty: "+20", user: "Admin", status: "Completed" },
  { id: "TX-1038", type: "OUTBOUND", date: "Sep 24, 14:00 PM", sku: "FURN-TBL-02", qty: "-1", user: "Jane Smith", status: "Pending" },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="w-full h-screen flex bg-[#f0f0f0] overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 h-full p-6 md:p-10 overflow-y-auto">
        <AnimatePresence mode="wait">
          
          {/* DASHBOARD TAB */}
          {activeTab === "dashboard" && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="max-w-7xl mx-auto flex flex-col gap-8"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-normal text-[rgba(30,50,90,0.9)] tracking-tight mb-1">Inventory Dashboard</h1>
                  <p className="text-sm text-[rgba(30,50,90,0.6)] font-normal">Real-time snapshot of your stock operations.</p>
                </div>
                {/* Action Bar */}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(30,50,90,0.4)]" />
                    <input type="text" placeholder="Search SKU..." className="pl-9 pr-4 py-2 rounded-full bg-white/50 backdrop-blur-md border border-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-[rgba(30,50,90,0.2)] text-[rgba(30,50,90,0.8)] placeholder-[rgba(30,50,90,0.4)] w-64" />
                  </div>
                </div>
              </div>

              {/* KPIs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {kpis.map((kpi) => {
                  const Icon = kpi.icon;
                  return (
                    <div key={kpi.title} className="p-5 rounded-[1.5rem] bg-white/40 backdrop-blur-xl border border-white/30 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${kpi.bg}`}>
                        <Icon className={`w-5 h-5 ${kpi.color}`} />
                      </div>
                      <div>
                        <h3 className="text-[28px] font-normal text-[rgba(30,50,90,0.95)] leading-none mb-1">{kpi.value}</h3>
                        <p className="text-[12px] font-normal text-[rgba(30,50,90,0.6)] uppercase tracking-wider">{kpi.title}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Dynamic Filters Section */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[rgba(30,50,90,0.6)]" />
                  <h2 className="text-sm font-normal text-[rgba(30,50,90,0.8)]">Dynamic Filters</h2>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="px-4 py-2 rounded-full bg-white/60 text-[rgba(30,50,90,0.9)] text-sm font-normal border border-white/50 cursor-pointer shadow-sm">All Types</div>
                  <div className="px-4 py-2 rounded-full bg-white/30 text-[rgba(30,50,90,0.6)] text-sm font-normal border border-transparent hover:bg-white/40 hover:border-white/20 cursor-pointer transition-all">Receipts</div>
                  <div className="px-4 py-2 rounded-full bg-white/30 text-[rgba(30,50,90,0.6)] text-sm font-normal border border-transparent hover:bg-white/40 hover:border-white/20 cursor-pointer transition-all">Deliveries</div>
                  <div className="px-4 py-2 rounded-full bg-white/30 text-[rgba(30,50,90,0.6)] text-sm font-normal border border-transparent hover:bg-white/40 hover:border-white/20 cursor-pointer transition-all">Internal Transfers</div>
                </div>
              </div>

              {/* Products Table */}
              <div className="flex-1 w-full bg-white/40 backdrop-blur-xl border border-white/30 rounded-[2rem] p-6 overflow-hidden flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-normal text-[rgba(30,50,90,0.9)]">Current Inventory</h3>
                  <button onClick={() => setActiveTab('products')} className="text-xs font-normal text-[rgba(30,50,90,0.8)] hover:underline cursor-pointer">View All Products &rarr;</button>
                </div>
                
                <div className="w-full overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/40">
                        <th className="py-3 px-4 text-xs font-medium text-[rgba(30,50,90,0.6)] uppercase tracking-wider">SKU</th>
                        <th className="py-3 px-4 text-xs font-medium text-[rgba(30,50,90,0.6)] uppercase tracking-wider">Product Name</th>
                        <th className="py-3 px-4 text-xs font-medium text-[rgba(30,50,90,0.6)] uppercase tracking-wider">Category</th>
                        <th className="py-3 px-4 text-xs font-medium text-[rgba(30,50,90,0.6)] uppercase tracking-wider">In Stock</th>
                        <th className="py-3 px-4 text-xs font-medium text-[rgba(30,50,90,0.6)] uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/20">
                      {products.map(p => (
                        <tr key={p.id} className="hover:bg-white/20 transition-colors cursor-pointer" onClick={() => setActiveTab('products')}>
                          <td className="py-3 px-4 text-sm font-medium text-[rgba(30,50,90,0.9)]">{p.sku}</td>
                          <td className="py-3 px-4 text-sm text-[rgba(30,50,90,0.8)]">{p.name}</td>
                          <td className="py-3 px-4 text-sm text-[rgba(30,50,90,0.6)]">{p.category}</td>
                          <td className="py-3 px-4 text-sm text-[rgba(30,50,90,0.8)]">{p.stock} Units</td>
                          <td className="py-3 px-4 text-sm">
                            <span className={`px-2 py-1 rounded-md text-xs ${p.stock > 10 ? 'bg-green-500/10 text-green-600' : p.stock > 0 ? 'bg-amber-500/10 text-amber-600' : 'bg-red-500/10 text-red-600'}`}>
                              {p.stock > 10 ? 'In Stock' : p.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* PRODUCTS TAB (E-COMMERCE VIEW) */}
          {activeTab === "products" && (
            <motion.div 
              key="products"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="max-w-7xl mx-auto flex flex-col gap-8 pb-10"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-normal text-[rgba(30,50,90,0.9)] tracking-tight mb-1">Product Catalog</h1>
                  <p className="text-sm text-[rgba(30,50,90,0.6)] font-normal">Manage your inventory items with a visual grid.</p>
                </div>
                {/* Action Bar */}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(30,50,90,0.4)]" />
                    <input type="text" placeholder="Search products..." className="pl-9 pr-4 py-2 rounded-full bg-white/50 backdrop-blur-md border border-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-[rgba(30,50,90,0.2)] text-[rgba(30,50,90,0.8)] placeholder-[rgba(30,50,90,0.4)] w-64" />
                  </div>
                  <button className="flex items-center gap-2 bg-[rgba(30,50,90,0.8)] hover:bg-[rgba(30,50,90,1)] text-white px-4 py-2 rounded-full transition-colors text-sm">
                    <Plus className="w-4 h-4" /> Add Product
                  </button>
                </div>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product, index) => (
                  <motion.div 
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-[1.5rem] overflow-hidden hover:shadow-lg transition-all group cursor-pointer flex flex-col"
                  >
                    <div className="relative w-full aspect-square overflow-hidden bg-white/80 flex items-center justify-center p-4">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                      />
                      {product.stock === 0 && (
                        <div className="absolute top-6 right-6 bg-red-500/90 text-white text-[10px] uppercase font-bold px-2 py-1 rounded-full backdrop-blur-sm">
                          Out of Stock
                        </div>
                      )}
                    </div>
                    <div className="p-4 flex flex-col flex-1 justify-between">
                      <div>
                        <div className="text-[10px] text-[rgba(30,50,90,0.5)] uppercase tracking-wider mb-1">{product.category}</div>
                        <h3 className="text-base font-medium text-[rgba(30,50,90,0.9)] leading-tight mb-1">{product.name}</h3>
                        <div className="text-xs text-[rgba(30,50,90,0.5)] mb-3">{product.sku}</div>
                      </div>
                      <div className="flex items-end justify-between mt-auto pt-4 border-t border-[rgba(30,50,90,0.1)]">
                        <span className="text-lg font-medium text-[rgba(30,50,90,0.95)]">{product.price}</span>
                        <span className={`text-xs font-medium ${product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-amber-600' : 'text-red-500'}`}>
                          {product.stock} in stock
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

            </motion.div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === "settings" && (
            <motion.div 
              key="settings"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="max-w-4xl mx-auto flex flex-col gap-8 pb-10"
            >
              {/* Header */}
              <div>
                <h1 className="text-3xl font-normal text-[rgba(30,50,90,0.9)] tracking-tight mb-1">Settings</h1>
                <p className="text-sm text-[rgba(30,50,90,0.6)] font-normal">Manage your account preferences and application settings.</p>
              </div>

              {/* Settings Sections */}
              <div className="flex flex-col gap-6">
                
                {/* Profile Section */}
                <div className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-[1.5rem] p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6 border-b border-white/40 pb-4">
                    <div className="bg-blue-500/10 p-2 rounded-xl">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <h2 className="text-lg font-medium text-[rgba(30,50,90,0.9)]">Profile Information</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-[rgba(30,50,90,0.7)]">Full Name</label>
                      <input type="text" defaultValue="John Doe" className="px-4 py-2 rounded-xl bg-white/50 border border-white/40 focus:outline-none focus:ring-2 focus:ring-[rgba(30,50,90,0.2)] text-[rgba(30,50,90,0.8)] shadow-sm" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-[rgba(30,50,90,0.7)]">Email Address</label>
                      <input type="email" defaultValue="admin@stocksense.com" className="px-4 py-2 rounded-xl bg-white/50 border border-white/40 focus:outline-none focus:ring-2 focus:ring-[rgba(30,50,90,0.2)] text-[rgba(30,50,90,0.8)] shadow-sm" />
                    </div>
                  </div>
                </div>

                {/* Preferences Section */}
                <div className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-[1.5rem] p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6 border-b border-white/40 pb-4">
                    <div className="bg-purple-500/10 p-2 rounded-xl">
                      <Moon className="w-5 h-5 text-purple-600" />
                    </div>
                    <h2 className="text-lg font-medium text-[rgba(30,50,90,0.9)]">Appearance & Preferences</h2>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-[rgba(30,50,90,0.9)]">Dark Mode</h3>
                        <p className="text-xs text-[rgba(30,50,90,0.5)]">Toggle dark mode interface.</p>
                      </div>
                      <div className="w-12 h-6 bg-white/50 rounded-full border border-white/40 flex items-center p-1 cursor-pointer">
                        <div className="w-4 h-4 bg-[rgba(30,50,90,0.3)] rounded-full transition-transform"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-[rgba(30,50,90,0.9)]">Compact View</h3>
                        <p className="text-xs text-[rgba(30,50,90,0.5)]">Reduce spacing in data tables.</p>
                      </div>
                      <div className="w-12 h-6 bg-[rgba(30,50,90,0.7)] rounded-full flex items-center justify-end p-1 cursor-pointer shadow-inner">
                        <div className="w-4 h-4 bg-white rounded-full shadow-sm transition-transform"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notifications Section */}
                <div className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-[1.5rem] p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6 border-b border-white/40 pb-4">
                    <div className="bg-amber-500/10 p-2 rounded-xl">
                      <Bell className="w-5 h-5 text-amber-600" />
                    </div>
                    <h2 className="text-lg font-medium text-[rgba(30,50,90,0.9)]">Notifications</h2>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-[rgba(30,50,90,0.9)]">Low Stock Alerts</h3>
                        <p className="text-xs text-[rgba(30,50,90,0.5)]">Receive email when items drop below threshold.</p>
                      </div>
                      <div className="w-12 h-6 bg-[rgba(30,50,90,0.7)] rounded-full flex items-center justify-end p-1 cursor-pointer shadow-inner">
                        <div className="w-4 h-4 bg-white rounded-full shadow-sm transition-transform"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-[rgba(30,50,90,0.9)]">Daily Summary</h3>
                        <p className="text-xs text-[rgba(30,50,90,0.5)]">Get a daily digest of inventory changes.</p>
                      </div>
                      <div className="w-12 h-6 bg-white/50 rounded-full border border-white/40 flex items-center p-1 cursor-pointer">
                        <div className="w-4 h-4 bg-[rgba(30,50,90,0.3)] rounded-full transition-transform"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-2">
                  <button className="flex items-center gap-2 bg-[rgba(30,50,90,0.8)] hover:bg-[rgba(30,50,90,1)] text-white px-6 py-2.5 rounded-full transition-colors text-sm shadow-md">
                    <Save className="w-4 h-4" /> Save Changes
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* OPERATIONS TAB */}
          {activeTab === "operations" && (
            <motion.div 
              key="operations"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="max-w-7xl mx-auto flex flex-col gap-8 pb-10"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-normal text-[rgba(30,50,90,0.9)] tracking-tight mb-1">Operations & Logistics</h1>
                  <p className="text-sm text-[rgba(30,50,90,0.6)] font-normal">Manage stock movements and view transaction history.</p>
                </div>
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 bg-white/50 hover:bg-white/70 border border-white/50 text-[rgba(30,50,90,0.8)] px-4 py-2 rounded-full transition-colors text-sm shadow-sm backdrop-blur-md">
                    <Download className="w-4 h-4" /> Export CSV
                  </button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-[1.5rem] p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group flex items-start gap-4">
                  <div className="bg-green-500/10 p-3 rounded-2xl group-hover:bg-green-500/20 transition-colors">
                    <ArrowDown className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-[rgba(30,50,90,0.9)] mb-1">Receive Stock</h3>
                    <p className="text-xs text-[rgba(30,50,90,0.6)] leading-relaxed">Log incoming shipments from suppliers to increase inventory.</p>
                  </div>
                </div>
                
                <div className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-[1.5rem] p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group flex items-start gap-4">
                  <div className="bg-blue-500/10 p-3 rounded-2xl group-hover:bg-blue-500/20 transition-colors">
                    <ArrowUp className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-[rgba(30,50,90,0.9)] mb-1">Dispatch Stock</h3>
                    <p className="text-xs text-[rgba(30,50,90,0.6)] leading-relaxed">Process outbound orders and deduct items from inventory.</p>
                  </div>
                </div>

                <div className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-[1.5rem] p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group flex items-start gap-4">
                  <div className="bg-amber-500/10 p-3 rounded-2xl group-hover:bg-amber-500/20 transition-colors">
                    <RefreshCw className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-[rgba(30,50,90,0.9)] mb-1">Stock Adjustment</h3>
                    <p className="text-xs text-[rgba(30,50,90,0.6)] leading-relaxed">Manually adjust quantities for damages, returns, or audits.</p>
                  </div>
                </div>
              </div>

              {/* Transaction History */}
              <div className="flex-1 w-full bg-white/60 backdrop-blur-xl border border-white/50 rounded-[2rem] p-6 overflow-hidden flex flex-col shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-[rgba(30,50,90,0.7)]" />
                    <h3 className="text-lg font-medium text-[rgba(30,50,90,0.9)]">Recent Transactions</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(30,50,90,0.4)]" />
                      <input type="text" placeholder="Search TX ID..." className="pl-9 pr-4 py-1.5 rounded-full bg-white/50 border border-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-[rgba(30,50,90,0.2)] text-[rgba(30,50,90,0.8)] placeholder-[rgba(30,50,90,0.4)] w-48" />
                    </div>
                  </div>
                </div>
                
                <div className="w-full overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/40">
                        <th className="py-3 px-4 text-xs font-medium text-[rgba(30,50,90,0.6)] uppercase tracking-wider">Transaction ID</th>
                        <th className="py-3 px-4 text-xs font-medium text-[rgba(30,50,90,0.6)] uppercase tracking-wider">Type</th>
                        <th className="py-3 px-4 text-xs font-medium text-[rgba(30,50,90,0.6)] uppercase tracking-wider">Date & Time</th>
                        <th className="py-3 px-4 text-xs font-medium text-[rgba(30,50,90,0.6)] uppercase tracking-wider">SKU</th>
                        <th className="py-3 px-4 text-xs font-medium text-[rgba(30,50,90,0.6)] uppercase tracking-wider">Qty</th>
                        <th className="py-3 px-4 text-xs font-medium text-[rgba(30,50,90,0.6)] uppercase tracking-wider">User</th>
                        <th className="py-3 px-4 text-xs font-medium text-[rgba(30,50,90,0.6)] uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/20">
                      {transactions.map(tx => (
                        <tr key={tx.id} className="hover:bg-white/40 transition-colors cursor-pointer">
                          <td className="py-3 px-4 text-sm font-medium text-[rgba(30,50,90,0.9)] flex items-center gap-2">
                            <FileText className="w-4 h-4 text-[rgba(30,50,90,0.4)]" /> {tx.id}
                          </td>
                          <td className="py-3 px-4 text-sm">
                            <span className={`px-2 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider ${
                              tx.type === 'INBOUND' ? 'bg-green-500/10 text-green-700' :
                              tx.type === 'OUTBOUND' ? 'bg-blue-500/10 text-blue-700' :
                              'bg-amber-500/10 text-amber-700'
                            }`}>
                              {tx.type}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-[rgba(30,50,90,0.7)] flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" /> {tx.date}
                          </td>
                          <td className="py-3 px-4 text-sm font-medium text-[rgba(30,50,90,0.8)]">{tx.sku}</td>
                          <td className={`py-3 px-4 text-sm font-bold ${tx.qty.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>{tx.qty}</td>
                          <td className="py-3 px-4 text-sm text-[rgba(30,50,90,0.8)]">{tx.user}</td>
                          <td className="py-3 px-4 text-sm">
                            <span className={`px-2 py-1 rounded-md text-xs ${tx.status === 'Completed' ? 'text-green-600 bg-green-500/10' : 'text-amber-600 bg-amber-500/10'}`}>
                              {tx.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* OTHER TABS PLACEHOLDERS */}
          {activeTab !== "dashboard" && activeTab !== "products" && activeTab !== "settings" && activeTab !== "operations" && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full flex flex-col items-center justify-center text-[rgba(30,50,90,0.5)]"
            >
              <Settings className="w-16 h-16 mb-4 opacity-50" />
              <h2 className="text-2xl font-normal text-[rgba(30,50,90,0.7)] capitalize">{activeTab}</h2>
              <p className="text-sm mt-2">This module is under construction.</p>
            </motion.div>
          )}
          
        </AnimatePresence>
      </main>
    </div>
  );
}
