import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowDown, ArrowUp, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function TransactionModal({ isOpen, onClose, onAdd, type, products, userName }: any) {
  const [formData, setFormData] = useState({
    sku: '',
    qty: ''
  });

  if (!isOpen || !type) return null;

  const config = {
    INBOUND: { title: "Receive Stock", icon: ArrowDown, color: "text-green-600", bg: "bg-green-500/10", btnBg: "bg-green-600 hover:bg-green-700" },
    OUTBOUND: { title: "Dispatch Stock", icon: ArrowUp, color: "text-blue-600", bg: "bg-blue-500/10", btnBg: "bg-blue-600 hover:bg-blue-700" },
    ADJUSTMENT: { title: "Stock Adjustment", icon: RefreshCw, color: "text-amber-600", bg: "bg-amber-500/10", btnBg: "bg-amber-600 hover:bg-amber-700" }
  }[type as "INBOUND" | "OUTBOUND" | "ADJUSTMENT"];

  const Icon = config.icon;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.sku || !formData.qty) return;

    const qtyNum = parseInt(formData.qty);
    const sign = type === "INBOUND" ? "+" : type === "OUTBOUND" ? "-" : (qtyNum > 0 ? "+" : "");
    const displayQty = `${sign}${Math.abs(qtyNum)}`;
    const actualChange = type === "OUTBOUND" ? -Math.abs(qtyNum) : type === "INBOUND" ? Math.abs(qtyNum) : qtyNum;

    onAdd({
      type,
      sku: formData.sku,
      qty: displayQty,
      qtyNum: actualChange,
      user: userName,
      date: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      status: "Completed"
    });

    setFormData({ sku: '', qty: '' });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="bg-white/90 backdrop-blur-xl border border-white/50 rounded-[2rem] w-full max-w-sm shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-[rgba(30,50,90,0.1)]">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${config.bg}`}>
                  <Icon className={`w-5 h-5 ${config.color}`} />
                </div>
                <div>
                  <h2 className="text-lg font-medium text-[rgba(30,50,90,0.9)]">{config.title}</h2>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 rounded-full hover:bg-[rgba(30,50,90,0.05)] text-[rgba(30,50,90,0.6)] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-[rgba(30,50,90,0.7)]">Select Product</label>
                <select
                  value={formData.sku}
                  onChange={e => setFormData({...formData, sku: e.target.value})}
                  className="px-4 py-2.5 rounded-xl bg-white/50 border border-white/40 focus:outline-none focus:ring-2 focus:ring-[rgba(30,50,90,0.2)] text-[rgba(30,50,90,0.8)] shadow-sm text-sm cursor-pointer outline-none"
                  required
                >
                  <option value="" disabled>Choose a product</option>
                  {products.map((p: any) => (
                    <option key={p.id} value={p.sku}>{p.name} ({p.sku}) - {p.stock} in stock</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-[rgba(30,50,90,0.7)]">
                  Quantity {type === 'ADJUSTMENT' ? '(use negative for deduction)' : ''}
                </label>
                <input 
                  type="number" 
                  min={type === 'ADJUSTMENT' ? undefined : "1"}
                  value={formData.qty}
                  onChange={e => setFormData({...formData, qty: e.target.value})}
                  className="px-4 py-2.5 rounded-xl bg-white/50 border border-white/40 focus:outline-none focus:ring-2 focus:ring-[rgba(30,50,90,0.2)] text-[rgba(30,50,90,0.8)] shadow-sm text-sm"
                  placeholder="e.g. 5"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-[rgba(30,50,90,0.7)]">Processed By</label>
                <input 
                  type="text" 
                  value={userName}
                  disabled
                  className="px-4 py-2.5 rounded-xl bg-[rgba(30,50,90,0.02)] border border-white/40 text-[rgba(30,50,90,0.5)] shadow-sm text-sm cursor-not-allowed"
                />
              </div>

              <div className="mt-2 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-full text-sm font-medium text-[rgba(30,50,90,0.6)] hover:bg-[rgba(30,50,90,0.05)] transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className={`flex items-center gap-2 text-white px-6 py-2.5 rounded-full transition-colors text-sm shadow-md ${config.btnBg}`}
                >
                  <CheckCircle2 className="w-4 h-4" /> Confirm
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
