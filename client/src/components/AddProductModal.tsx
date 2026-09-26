import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, PackageSearch, Tag, IndianRupee, Layers, Image as ImageIcon } from 'lucide-react';

export default function AddProductModal({ isOpen, onClose, onAdd }: any) {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    price: '',
    stock: '',
    category: '',
    image: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.sku || !formData.price || !formData.stock || !formData.category) return;

    onAdd({
      name: formData.name,
      sku: formData.sku.toUpperCase(),
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      category: formData.category,
      image: formData.image || "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800"
    });

    setFormData({ name: '', sku: '', price: '', stock: '', category: '', image: '' });
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
            className="bg-white/90 backdrop-blur-xl border border-white/50 rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-[rgba(30,50,90,0.1)]">
              <div>
                <h2 className="text-xl font-medium text-[rgba(30,50,90,0.9)]">Add New Product</h2>
                <p className="text-xs text-[rgba(30,50,90,0.6)] mt-1">Enter details to add to inventory.</p>
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
                <label className="text-xs font-medium text-[rgba(30,50,90,0.7)] flex items-center gap-1">
                  <PackageSearch className="w-3 h-3" /> Product Name
                </label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="px-4 py-2.5 rounded-xl bg-white/50 border border-white/40 focus:outline-none focus:ring-2 focus:ring-[rgba(30,50,90,0.2)] text-[rgba(30,50,90,0.8)] shadow-sm text-sm"
                  placeholder="e.g. Modern Bookshelf"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-[rgba(30,50,90,0.7)] flex items-center gap-1">
                  <Tag className="w-3 h-3" /> SKU
                </label>
                <input 
                  type="text" 
                  value={formData.sku}
                  onChange={e => setFormData({...formData, sku: e.target.value})}
                  className="px-4 py-2.5 rounded-xl bg-white/50 border border-white/40 focus:outline-none focus:ring-2 focus:ring-[rgba(30,50,90,0.2)] text-[rgba(30,50,90,0.8)] shadow-sm text-sm uppercase"
                  placeholder="e.g. FURN-BKS-01"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-[rgba(30,50,90,0.7)] flex items-center gap-1">
                    <IndianRupee className="w-3 h-3" /> Base Price
                  </label>
                  <input 
                    type="number" 
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: e.target.value})}
                    className="px-4 py-2.5 rounded-xl bg-white/50 border border-white/40 focus:outline-none focus:ring-2 focus:ring-[rgba(30,50,90,0.2)] text-[rgba(30,50,90,0.8)] shadow-sm text-sm"
                    placeholder="0.00"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-[rgba(30,50,90,0.7)] flex items-center gap-1">
                    <Layers className="w-3 h-3" /> Initial Stock
                  </label>
                  <input 
                    type="number" 
                    min="0"
                    value={formData.stock}
                    onChange={e => setFormData({...formData, stock: e.target.value})}
                    className="px-4 py-2.5 rounded-xl bg-white/50 border border-white/40 focus:outline-none focus:ring-2 focus:ring-[rgba(30,50,90,0.2)] text-[rgba(30,50,90,0.8)] shadow-sm text-sm"
                    placeholder="0"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-[rgba(30,50,90,0.7)] flex items-center gap-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  className="px-4 py-2.5 rounded-xl bg-white/50 border border-white/40 focus:outline-none focus:ring-2 focus:ring-[rgba(30,50,90,0.2)] text-[rgba(30,50,90,0.8)] shadow-sm text-sm cursor-pointer outline-none"
                  required
                >
                  <option value="" disabled>Select a category</option>
                  <option value="Living Room">Living Room</option>
                  <option value="Dining Room">Dining Room</option>
                  <option value="Bedroom">Bedroom</option>
                  <option value="Office">Office</option>
                  <option value="Lighting">Lighting</option>
                  <option value="Decor">Decor</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-[rgba(30,50,90,0.7)] flex items-center gap-1">
                  <ImageIcon className="w-3 h-3" /> Image URL (Optional)
                </label>
                <input 
                  type="url" 
                  value={formData.image}
                  onChange={e => setFormData({...formData, image: e.target.value})}
                  className="px-4 py-2.5 rounded-xl bg-white/50 border border-white/40 focus:outline-none focus:ring-2 focus:ring-[rgba(30,50,90,0.2)] text-[rgba(30,50,90,0.8)] shadow-sm text-sm"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="mt-4 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-full text-sm font-medium text-[rgba(30,50,90,0.6)] hover:bg-[rgba(30,50,90,0.05)] transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex items-center gap-2 bg-[rgba(30,50,90,0.8)] hover:bg-[rgba(30,50,90,1)] text-white px-6 py-2.5 rounded-full transition-colors text-sm shadow-md"
                >
                  <Plus className="w-4 h-4" /> Add Product
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
