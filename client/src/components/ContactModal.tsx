import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("");
    
    const formData = new FormData(e.currentTarget);
    // Add access key via env var if not already present from hidden input
    if (!formData.get("access_key")) {
      formData.append("access_key", import.meta.env.VITE_WEB3FORMS_ACCESS_KEY);
    }

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setStatus("Message sent successfully!");
        setTimeout(() => {
          onClose();
          setStatus("");
          setIsSubmitting(false);
        }, 2000);
      } else {
        setStatus("Failed to send. Please try again.");
        setIsSubmitting(false);
      }
    } catch (error) {
      setStatus("Something went wrong!");
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100]"
          />
          {/* Modal Content */}
          <div className="fixed inset-0 flex items-center justify-center z-[110] pointer-events-none p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-xl bg-white/80 backdrop-blur-2xl rounded-3xl shadow-xl border border-white/50 p-6 md:p-8 relative pointer-events-auto"
            >
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-[#1E325A]/5 hover:bg-[#1E325A]/10 rounded-full transition-colors cursor-pointer text-[#1E325A]"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="text-center mb-6">
                <h2 className="text-2xl md:text-3xl font-medium text-[#1E325A] tracking-tight mb-2">Get in Touch</h2>
                <p className="text-[#1E325A]/60 text-sm">Have a question or want to work together? Leave us a message below.</p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input type="hidden" name="access_key" value={import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || ""} />
                
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex flex-col gap-1.5 flex-1">
                    <label className="text-[11px] font-medium text-[#1E325A]/70 uppercase tracking-widest pl-1">Name</label>
                    <input 
                      type="text" 
                      name="name" 
                      required 
                      placeholder="Your Name" 
                      className="w-full bg-white/80 border border-[#1E325A]/10 rounded-xl px-4 py-3 text-[#1E325A] placeholder:text-[#1E325A]/30 focus:outline-none focus:border-[#1E325A]/30 focus:ring-1 focus:ring-[#1E325A]/30 transition-all shadow-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 flex-1">
                    <label className="text-[11px] font-medium text-[#1E325A]/70 uppercase tracking-widest pl-1">Email</label>
                    <input 
                      type="email" 
                      name="email" 
                      required 
                      placeholder="Your Email" 
                      className="w-full bg-white/80 border border-[#1E325A]/10 rounded-xl px-4 py-3 text-[#1E325A] placeholder:text-[#1E325A]/30 focus:outline-none focus:border-[#1E325A]/30 focus:ring-1 focus:ring-[#1E325A]/30 transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-medium text-[#1E325A]/70 uppercase tracking-widest pl-1">Message</label>
                  <textarea 
                    name="message" 
                    required 
                    placeholder="Your Message..." 
                    rows={4}
                    className="w-full bg-white/80 border border-[#1E325A]/10 rounded-xl px-4 py-3 text-[#1E325A] placeholder:text-[#1E325A]/30 focus:outline-none focus:border-[#1E325A]/30 focus:ring-1 focus:ring-[#1E325A]/30 transition-all shadow-sm resize-none"
                  />
                </div>

                <button disabled={isSubmitting} type="submit" className="mt-4 w-full bg-[rgba(30,50,90,0.9)] text-white font-semibold rounded-xl py-3.5 hover:bg-[#1E325A] active:scale-[0.98] transition-all shadow-md cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed">
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
                {status && (
                  <div className={`text-center text-sm font-medium ${status.includes("successfully") ? "text-green-600" : "text-red-500"}`}>
                    {status}
                  </div>
                )}
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
