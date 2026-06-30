'use client';

import { motion } from 'motion/react-client';

export default function AnimatedImage() {
  return (
    <motion.div
       initial={{ opacity: 0, x: -20 }}
       animate={{ opacity: 1, x: 0 }}
    >
      <div className="aspect-[3/4] rounded-xl border border-slate-200 bg-slate-50 overflow-hidden relative group shadow-2xl shadow-blue-900/5">
        <img 
          src="https://i0.wp.com/hotham.vn/wordpress/wp-content/uploads/sites/30/2024/10/logo.png" 
          alt="Hồ Thị Thắm" 
          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
          referrerPolicy="no-referrer"
        />
      </div>
    </motion.div>
  );
}
