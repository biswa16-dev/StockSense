import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowUpRight, User } from "lucide-react";

export default function Navbar() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("stockSenseUser");
    if (user) {
      try {
        setUserName(JSON.parse(user).name);
      } catch (e) {}
    }
  }, []);

  return (
    <nav className="flex items-center justify-between py-6 px-6 md:px-10 w-full relative z-10">
      <div className="flex-1 hidden md:block" />

      <div className="md:hidden">
        <span className="font-regular tracking-tighter text-xl text-[#47536b]">StockSense IMS</span>
      </div>
      <div className="flex-1 flex justify-end">
        {userName ? (
          <Link to="/dashboard">
            <motion.button 
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }}
              className="flex items-center bg-transparent text-[rgba(30,50,90,0.9)] rounded-full pl-2 pr-4 md:pr-6 py-1.5 md:py-2 gap-2 md:gap-3 hover:bg-[rgba(30,50,90,0.05)] transition-colors group cursor-pointer"
            >
              <div className="bg-[rgba(30,50,90,0.08)] p-1 md:p-1.5 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 md:w-5 md:h-5 text-[rgba(30,50,90,0.9)]" />
              </div>
              <span className="text-xs md:text-sm font-medium">{userName}</span>
            </motion.button>
          </Link>
        ) : (
          <Link to="/signup">
            <motion.button 
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }}
              className="flex items-center bg-[#47536b] text-white rounded-full pl-2 pr-4 md:pr-6 py-1.5 md:py-2 gap-2 md:gap-3 hover:bg-[#384358] transition-colors group cursor-pointer"
            >
              <div className="bg-white/20 p-1 md:p-1.5 rounded-full flex items-center justify-center">
                <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
              <span className="text-xs md:text-sm font-normal">Sign Up</span>
            </motion.button>
          </Link>
        )}
      </div>
    </nav>
  );
}
