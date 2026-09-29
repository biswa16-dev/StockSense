import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Sidebar from "../components/Sidebar";
import { PackageSearch, AlertTriangle, Truck, ArrowDownToLine, ArrowRightLeft, Search, Filter, Plus, Settings, ArrowDown, ArrowUp, RefreshCw, FileText, Download, Activity, Clock, Trash2 } from "lucide-react";
import SettingsTab from "../components/SettingsTab";
import AddProductModal from "../components/AddProductModal";
import TransactionModal from "../components/TransactionModal";
import { useSettings } from '../hooks/useSettings';

// Existing mock data
const kpis = [
  { title: "Total Inventory Value", value: 525000, isCurrency: true, icon: PackageSearch, color: "text-blue-500", bg: "bg-blue-500/10" },
  { title: "Low / Out of Stock", value: "34", icon: AlertTriangle, color: "text-red-500", bg: "bg-red-500/10" },
  { title: "Pending Receipts", value: "12", icon: ArrowDownToLine, color: "text-green-500", bg: "bg-green-500/10" },
  { title: "Pending Deliveries", value: "8", icon: Truck, color: "text-amber-500", bg: "bg-amber-500/10" },
  { title: "Internal Transfers", value: "3", icon: ArrowRightLeft, color: "text-purple-500", bg: "bg-purple-500/10" },
];

const initialProducts = [
  { id: 1, name: "Premium Leather Sofa", sku: "FURN-SOF-01", price: 107817.00, stock: 12, category: "Living Room", image: "/sofa_1790404151421.jpg" },
  { id: 2, name: "Oak Dining Table", sku: "FURN-TBL-02", price: 70467.00, stock: 4, category: "Dining Room", image: "/dining_table_1790404166312.jpg" },
  { id: 3, name: "Glass Coffee Table", sku: "FURN-COF-03", price: 28967.00, stock: 0, category: "Living Room", image: "/coffee_table_1790404210385.jpg" },
  { id: 4, name: "Ergonomic Office Chair", sku: "FURN-CHR-04", price: 24817.00, stock: 45, category: "Office", image: "/office_chair_1790404225722.jpg" },
  { id: 5, name: "King Size Bed Frame", sku: "FURN-BED-05", price: 82917.00, stock: 8, category: "Bedroom", image: "/bed_frame_1790404238429.jpg" },
  { id: 6, name: "Modern Upholstered Dining Chair", sku: "FURN-DNC-06", price: 12367.00, stock: 24, category: "Dining Room", image: "/dining_chair_1790404644025.jpg" },
  { id: 7, name: "Tripod Shelf Floor Lamp", sku: "LIGH-FLR-07", price: 10707.00, stock: 15, category: "Lighting", image: "/custom_floor_lamp_1790405571407.jpg" }
];

const getLocaleForCountry = (country: string, format: string) => {
  if (format === 'Indian') return 'en-IN';
  
  const locales: Record<string, string> = {
    'India': 'en-IN',
    'United States': 'en-US',
    'United Kingdom': 'en-GB',
    'Canada': 'en-CA',
    'Australia': 'en-AU',
    'UAE': 'ar-AE',
    'Singapore': 'en-SG',
    'Germany': 'de-DE',
    'France': 'fr-FR',
    'Japan': 'ja-JP',
    'Brazil': 'pt-BR',
    'South Africa': 'en-ZA',
    'Mexico': 'es-MX',
    'Italy': 'it-IT',
    'Spain': 'es-ES',
    'Netherlands': 'nl-NL'
  };
  return locales[country] || 'en-US';
};

// Removed static exchangeRates

const initialTransactions = [
  { id: "TX-1042", type: "INBOUND", date: "Today, 10:45 AM", sku: "FURN-SOF-01", qty: "+5", user: "Admin", status: "Completed" },
  { id: "TX-1041", type: "OUTBOUND", date: "Today, 09:15 AM", sku: "LIGH-FLR-07", qty: "-2", user: "John Doe", status: "Completed" },
  { id: "TX-1040", type: "ADJUSTMENT", date: "Yesterday, 16:30 PM", sku: "FURN-COF-03", qty: "-1", user: "System", status: "Completed" },
  { id: "TX-1039", type: "INBOUND", date: "Yesterday, 11:20 AM", sku: "FURN-CHR-04", qty: "+20", user: "Admin", status: "Completed" },
  { id: "TX-1038", type: "OUTBOUND", date: "Sep 24, 14:00 PM", sku: "FURN-TBL-02", qty: "-1", user: "Jane Smith", status: "Pending" },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [userName, setUserName] = useState("Demo User");

  const [dashboardSearch, setDashboardSearch] = useState("");
  const [dashboardFilter, setDashboardFilter] = useState("All Types");
  const [productsSearch, setProductsSearch] = useState("");
  const [opsSearch, setOpsSearch] = useState("");
  const [products, setProducts] = useState(initialProducts);
  const [transactions, setTransactions] = useState(initialTransactions);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [txModalType, setTxModalType] = useState<string | null>(null);

  interface Warehouse {
    id: number;
    name: string;
    shortCode: string;
    address: string;
    image?: string;
  }

  const defaultWarehouses: Warehouse[] = [
    { id: 1, name: "Delhi GTB", shortCode: "gtb1708", address: "GTB nagar new delhi" },
    { id: 2, name: "Jalandhar Central", shortCode: "jal01", address: "Central City, Jalandhar" },
    { id: 3, name: "Bangalore Tech Park", shortCode: "blr99", address: "Tech Park, Bangalore" },
    { id: 4, name: "Mumbai Central", shortCode: "bom01", address: "Andheri East, Mumbai", image: "/mumbai_warehouse.jpg" },
    { id: 5, name: "Chennai Hub", shortCode: "maa44", address: "Guindy Industrial Estate, Chennai", image: "/chennai_warehouse.jpg" },
    { id: 6, name: "Kolkata Port", shortCode: "ccu12", address: "Kidderpore, Kolkata", image: "/kolkata_warehouse.jpg" }
  ];

  const [warehouses, setWarehouses] = useState<Warehouse[]>(() => {
    const saved = localStorage.getItem("stockSenseWarehouses");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse warehouses");
      }
    }
    return defaultWarehouses;
  });
  const [isAddingWarehouse, setIsAddingWarehouse] = useState(false);
  const [newWarehouse, setNewWarehouse] = useState({ name: "", shortCode: "", address: "" });

  useEffect(() => {
    const user = localStorage.getItem("stockSenseUser");
    if (user) {
      try {
        setUserName(JSON.parse(user).name);
      } catch (e) {
        console.error("Failed to parse user");
      }
    }
  }, []);

  const { settings, loading, saving, hasUnsavedChanges, exchangeRates, updateSection, save, reset } = useSettings();

  const formatCurrency = (value: number) => {
    if (!settings) return `₹${value.toFixed(2)}`;
    
    const targetCurrency = settings.regional.currency;
    const rate = (exchangeRates && exchangeRates[targetCurrency]) ? exchangeRates[targetCurrency] : 1;
    const convertedValue = value * rate;

    const locale = getLocaleForCountry(settings.regional.country, settings.regional.numberFormat);
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: targetCurrency,
      }).format(convertedValue);
    } catch (e) {
      return `${targetCurrency} ${convertedValue.toFixed(2)}`;
    }
  };

  const filteredDashboardProducts = products.filter(p => {
    const searchMatch = p.sku.toLowerCase().includes(dashboardSearch.toLowerCase()) || p.name.toLowerCase().includes(dashboardSearch.toLowerCase());
    
    let filterMatch = true;
    if (dashboardFilter === "Receipts") {
      filterMatch = transactions.some(tx => tx.sku === p.sku && tx.type === "INBOUND");
    } else if (dashboardFilter === "Deliveries") {
      filterMatch = transactions.some(tx => tx.sku === p.sku && tx.type === "OUTBOUND");
    } else if (dashboardFilter === "Internal Transfers") {
      filterMatch = transactions.some(tx => tx.sku === p.sku && tx.type === "ADJUSTMENT");
    }
    
    return searchMatch && filterMatch;
  });

  const filteredProductsGrid = products.filter(p => 
    p.name.toLowerCase().includes(productsSearch.toLowerCase()) || 
    p.sku.toLowerCase().includes(productsSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(productsSearch.toLowerCase())
  );

  const filteredTransactions = transactions.filter(tx =>
    tx.id.toLowerCase().includes(opsSearch.toLowerCase()) ||
    tx.sku.toLowerCase().includes(opsSearch.toLowerCase()) ||
    tx.user.toLowerCase().includes(opsSearch.toLowerCase())
  );

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const handleAddTransaction = (newTx: any) => {
    const txId = `TX-${1000 + transactions.length + 50}`;
    const { qtyNum, ...txDataToSave } = newTx;
    
    setTransactions([{ ...txDataToSave, id: txId }, ...transactions]);

    setProducts(products.map(p => {
      if (p.sku === newTx.sku) {
        return { ...p, stock: Math.max(0, p.stock + newTx.qtyNum) };
      }
      return p;
    }));
    
    setTxModalType(null);
  };

  return (
    <div className="w-full h-screen flex bg-[#f0f0f0] overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} userName={userName} />
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
                    <input type="text" value={dashboardSearch} onChange={(e) => setDashboardSearch(e.target.value)} placeholder="Search SKU..." className="pl-9 pr-4 py-2 rounded-full bg-white/50 backdrop-blur-md border border-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-[rgba(30,50,90,0.2)] text-[rgba(30,50,90,0.8)] placeholder-[rgba(30,50,90,0.4)] w-64" />
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
                        <h3 className="text-[28px] font-normal text-[rgba(30,50,90,0.95)] leading-none mb-1">
                          {kpi.isCurrency ? formatCurrency(kpi.value as number) : kpi.value}
                        </h3>
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
                  {["All Types", "Receipts", "Deliveries", "Internal Transfers"].map(f => (
                    <div 
                      key={f}
                      onClick={() => setDashboardFilter(f)}
                      className={`px-4 py-2 rounded-full text-sm font-normal cursor-pointer transition-all shadow-sm ${dashboardFilter === f ? 'bg-white/60 text-[rgba(30,50,90,0.9)] border border-white/50' : 'bg-white/30 text-[rgba(30,50,90,0.6)] border border-transparent hover:bg-white/40 hover:border-white/20'}`}
                    >
                      {f}
                    </div>
                  ))}
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
                        <th className="py-3 px-4 text-xs font-medium text-[rgba(30,50,90,0.6)] uppercase tracking-wider text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/20">
                      {filteredDashboardProducts.map(p => (
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
                          <td className="py-3 px-4 text-right">
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleDeleteProduct(p.id); }}
                              className="p-1.5 rounded-full hover:bg-red-500/10 text-[rgba(30,50,90,0.4)] hover:text-red-500 transition-colors"
                              title="Delete Product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
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
                    <input type="text" value={productsSearch} onChange={(e) => setProductsSearch(e.target.value)} placeholder="Search products..." className="pl-9 pr-4 py-2 rounded-full bg-white/50 backdrop-blur-md border border-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-[rgba(30,50,90,0.2)] text-[rgba(30,50,90,0.8)] placeholder-[rgba(30,50,90,0.4)] w-64" />
                  </div>
                  <button onClick={() => setIsAddProductModalOpen(true)} className="flex items-center gap-2 bg-[rgba(30,50,90,0.8)] hover:bg-[rgba(30,50,90,1)] text-white px-4 py-2 rounded-full transition-colors text-sm">
                    <Plus className="w-4 h-4" /> Add Product
                  </button>
                </div>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProductsGrid.map((product, index) => (
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
                        <div className="absolute top-4 right-4 bg-red-500/90 text-white text-[10px] uppercase font-bold px-2 py-1 rounded-full backdrop-blur-sm shadow-sm z-10">
                          Out of Stock
                        </div>
                      )}
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDeleteProduct(product.id); }}
                        className="absolute top-4 left-4 p-2 bg-white/70 hover:bg-red-500 text-[rgba(30,50,90,0.5)] hover:text-white backdrop-blur-md rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-sm z-10"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="p-4 flex flex-col flex-1 justify-between">
                      <div>
                        <div className="text-[10px] text-[rgba(30,50,90,0.5)] uppercase tracking-wider mb-1">{product.category}</div>
                        <h3 className="text-base font-medium text-[rgba(30,50,90,0.9)] leading-tight mb-1">{product.name}</h3>
                        <div className="text-xs text-[rgba(30,50,90,0.5)] mb-3">{product.sku}</div>
                      </div>
                      <div className="flex items-end justify-between mt-auto pt-4 border-t border-[rgba(30,50,90,0.1)]">
                        <span className="text-lg font-medium text-[rgba(30,50,90,0.95)]">{formatCurrency(product.price)}</span>
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

          {/* WAREHOUSE TAB */}
          {activeTab === "warehouse" && (
            <motion.div 
              key="warehouse"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="max-w-7xl mx-auto flex flex-col gap-8 pb-10"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-normal text-[rgba(30,50,90,0.9)] tracking-tight mb-1">Warehouse</h1>
                  <p className="text-sm text-[rgba(30,50,90,0.6)] font-normal">This page contains the warehouse details & location.</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => setIsAddingWarehouse(!isAddingWarehouse)} className="flex items-center gap-2 bg-[rgba(30,50,90,0.8)] hover:bg-[rgba(30,50,90,1)] text-white px-4 py-2 rounded-full transition-colors text-sm">
                    <Plus className="w-4 h-4" /> {isAddingWarehouse ? "Cancel" : "Add Warehouse"}
                  </button>
                </div>
              </div>

              {/* Add Warehouse Form */}
              <AnimatePresence>
                {isAddingWarehouse && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: 'auto' }} 
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-[2rem] p-8 flex flex-col gap-6 shadow-sm overflow-hidden"
                  >
                    <h3 className="text-lg font-medium text-[rgba(30,50,90,0.9)]">Add New Warehouse</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex flex-col gap-2">
                        <label htmlFor="warehouseName" className="text-sm font-medium text-[rgba(30,50,90,0.8)]">Name:</label>
                        <input id="warehouseName" type="text" value={newWarehouse.name} onChange={e => setNewWarehouse({...newWarehouse, name: e.target.value})} className="px-4 py-2 rounded-xl bg-white/50 border border-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-[rgba(30,50,90,0.2)] text-[rgba(30,50,90,0.8)] placeholder-[rgba(30,50,90,0.4)]" placeholder="e.g. Delhi GTB" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label htmlFor="warehouseShortCode" className="text-sm font-medium text-[rgba(30,50,90,0.8)]">Short Code:</label>
                        <input id="warehouseShortCode" type="text" value={newWarehouse.shortCode} onChange={e => setNewWarehouse({...newWarehouse, shortCode: e.target.value})} className="px-4 py-2 rounded-xl bg-white/50 border border-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-[rgba(30,50,90,0.2)] text-[rgba(30,50,90,0.8)] placeholder-[rgba(30,50,90,0.4)]" placeholder="e.g. gtb1708" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label htmlFor="warehouseAddress" className="text-sm font-medium text-[rgba(30,50,90,0.8)]">Address:</label>
                        <input id="warehouseAddress" type="text" value={newWarehouse.address} onChange={e => setNewWarehouse({...newWarehouse, address: e.target.value})} className="px-4 py-2 rounded-xl bg-white/50 border border-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-[rgba(30,50,90,0.2)] text-[rgba(30,50,90,0.8)] placeholder-[rgba(30,50,90,0.4)]" placeholder="e.g. GTB nagar new delhi" />
                      </div>
                    </div>
                    <div className="flex justify-end mt-2">
                      <button 
                        onClick={() => {
                          if (newWarehouse.name && newWarehouse.shortCode && newWarehouse.address) {
                            const updatedWarehouses = [...warehouses, { id: Date.now(), ...newWarehouse }];
                            setWarehouses(updatedWarehouses);
                            localStorage.setItem("stockSenseWarehouses", JSON.stringify(updatedWarehouses));
                            setNewWarehouse({ name: "", shortCode: "", address: "" });
                            setIsAddingWarehouse(false);
                          }
                        }}
                        className="bg-[rgba(30,50,90,0.9)] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-[rgba(30,50,90,1)] transition-colors"
                      >
                        Save Warehouse
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form Content / Warehouse List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {warehouses.map(wh => (
                  <div key={wh.id} className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-[2rem] overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow">
                    {wh.image && (
                      <div className="w-full h-48 overflow-hidden">
                        <img src={wh.image} alt={wh.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                      </div>
                    )}
                    <div className="p-8 flex flex-col gap-6">
                      <div className="flex items-center gap-4">
                        <label className="w-24 text-sm font-medium text-[rgba(30,50,90,0.8)] text-right">Name:</label>
                        <div className="flex-1 px-4 py-2 rounded-xl bg-white/40 text-sm text-[rgba(30,50,90,0.9)]">{wh.name}</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <label className="w-24 text-sm font-medium text-[rgba(30,50,90,0.8)] text-right">Short Code:</label>
                        <div className="flex-1 px-4 py-2 rounded-xl bg-white/40 text-sm text-[rgba(30,50,90,0.9)]">{wh.shortCode}</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <label className="w-24 text-sm font-medium text-[rgba(30,50,90,0.8)] text-right">Address:</label>
                        <div className="flex-1 px-4 py-2 rounded-xl bg-white/40 text-sm text-[rgba(30,50,90,0.9)]">{wh.address}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === "settings" && (
            <SettingsTab
              settings={settings}
              loading={loading}
              saving={saving}
              hasUnsavedChanges={hasUnsavedChanges}
              updateSection={updateSection}
              save={save}
              reset={reset}
            />
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
                <div onClick={() => setTxModalType('INBOUND')} className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-[1.5rem] p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group flex items-start gap-4">
                  <div className="bg-green-500/10 p-3 rounded-2xl group-hover:bg-green-500/20 transition-colors">
                    <ArrowDown className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-[rgba(30,50,90,0.9)] mb-1">Receive Stock</h3>
                    <p className="text-xs text-[rgba(30,50,90,0.6)] leading-relaxed">Log incoming shipments from suppliers to increase inventory.</p>
                  </div>
                </div>
                
                <div onClick={() => setTxModalType('OUTBOUND')} className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-[1.5rem] p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group flex items-start gap-4">
                  <div className="bg-blue-500/10 p-3 rounded-2xl group-hover:bg-blue-500/20 transition-colors">
                    <ArrowUp className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-[rgba(30,50,90,0.9)] mb-1">Dispatch Stock</h3>
                    <p className="text-xs text-[rgba(30,50,90,0.6)] leading-relaxed">Process outbound orders and deduct items from inventory.</p>
                  </div>
                </div>

                <div onClick={() => setTxModalType('ADJUSTMENT')} className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-[1.5rem] p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group flex items-start gap-4">
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
                      <input type="text" value={opsSearch} onChange={(e) => setOpsSearch(e.target.value)} placeholder="Search TX ID..." className="pl-9 pr-4 py-1.5 rounded-full bg-white/50 border border-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-[rgba(30,50,90,0.2)] text-[rgba(30,50,90,0.8)] placeholder-[rgba(30,50,90,0.4)] w-48" />
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
                      {filteredTransactions.map(tx => (
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
          {activeTab !== "dashboard" && activeTab !== "products" && activeTab !== "warehouse" && activeTab !== "settings" && activeTab !== "operations" && (
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
      <AddProductModal 
        isOpen={isAddProductModalOpen} 
        onClose={() => setIsAddProductModalOpen(false)} 
        onAdd={(newProduct: any) => { 
          setProducts([ { ...newProduct, id: products.length + 1 }, ...products ]); 
          setIsAddProductModalOpen(false); 
        }} 
      />
      <TransactionModal
        isOpen={!!txModalType}
        onClose={() => setTxModalType(null)}
        onAdd={handleAddTransaction}
        type={txModalType}
        products={products}
        userName={userName}
      />
    </div>
  );
}
