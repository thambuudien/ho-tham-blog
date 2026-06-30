// Bỏ dòng 'use client'

// Thay đổi dòng này:
import * as motion from 'motion/react-client'; 
import Image from 'next/image';

export default function AnimatedImage() {
  return (
    <motion.div
       initial={{ opacity: 0, x: -20 }}
       animate={{ opacity: 1, x: 0 }}
       transition={{ duration: 0.5 }}
    >
      <div className="aspect-[3/4] rounded-xl border border-slate-200 bg-slate-50 overflow-hidden relative group shadow-2xl shadow-blue-900/5">
        <Image 
          src="https://i0.wp.com/hotham.vn/wordpress/wp-content/uploads/sites/30/2024/10/logo.png" 
          alt="Hồ Thị Thắm" 
          className="object-cover group-hover:scale-105 transition-all duration-700"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>
    </motion.div>
  );
}