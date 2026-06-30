'use client';

import Link from 'next/link';
import { motion } from 'motion/react-client';
import { Hash, ChevronRight } from 'lucide-react';

export default function CategoryCard({ category }: { category: any }) {
  return (
    <Link href={`/?c=${category.slug}`}>
        <motion.div
          whileHover={{ y: -5 }}
          className="group cursor-pointer flex items-center justify-between p-8 bg-white border border-slate-200 rounded-xl hover:shadow-2xl hover:shadow-blue-900/10 hover:border-blue-200 transition-all"
        >
          <div className="flex items-center gap-6">
            <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
              <Hash size={20} />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
                {category.name}
              </h3>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1 block">
                {category.count} bài viết chuyên môn
              </span>
            </div>
          </div>
          <ChevronRight size={20} className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
        </motion.div>
    </Link>
  );
}
