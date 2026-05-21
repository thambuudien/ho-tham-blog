import { fetchWP, GET_CATEGORIES } from "@/lib/wordpress";
import { Hash, ChevronRight } from "lucide-react";
import Link from "next/link";
import * as motion from "motion/react-client";

export const revalidate = 604800; // Làm mới dữ liệu sau 7 ngày (7 * 24 * 60 * 60)

export default async function CategoriesPage() {
  const data = await fetchWP(GET_CATEGORIES);
  const categories = data.categories.nodes.filter((cat: any) => cat.count > 0);

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-16 text-center">
        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-4">Danh mục chuyên môn</h2>
        <h1 className="font-serif text-4xl font-bold text-slate-900 mb-8">Chuyên mục bài viết</h1>
        <div className="h-[2px] w-24 bg-blue-600 mx-auto"></div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {categories.map((cat: any) => (
          <Link key={cat.id} href={`/?c=${cat.slug}`}>
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
                    {cat.name}
                  </h3>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1 block">
                    {cat.count} bài viết chuyên môn
                  </span>
                </div>
              </div>
              <ChevronRight size={20} className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
