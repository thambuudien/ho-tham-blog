import { Post } from "../types";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import * as motion from "motion/react-client";
import Link from "next/link";
import Image from "next/image";

interface PostCardProps {
  post: Post;
  variant?: "compact" | "default" | "featured";
}

export default function PostCard({ post, variant = "default" }: PostCardProps) {
  const dateStr = format(new Date(post.date), "dd MMMM, yyyy", { locale: vi });

  if (variant === "featured") {
    return (
      <Link href={`/${post.slug}`}>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="group relative cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white p-8 flex flex-col md:flex-row gap-8 transition-all hover:shadow-2xl hover:shadow-blue-900/5 hover:border-blue-100"
        >
          <div className="md:w-1/2 aspect-[16/10] overflow-hidden rounded-xl bg-slate-50 relative">
            <Image
              src={post.featuredImage?.node.sourceUrl || "https://hotham.vn/wordpress/wp-content/uploads/sites/30/2024/08/luong-huu-diem-tua-cua-nguoi-cao-tuoi.png"}
              alt={post.featuredImage?.node.altText || post.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              fill
            />
          </div>
          <div className="md:w-1/2 flex flex-col justify-center">
            <div className="mb-4 flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-1 rounded">
                {post.categories.nodes[0]?.name || "Chưa phân loại"}
              </span>
              <span className="text-[10px] text-slate-300">•</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Tiêu điểm</span>
            </div>
            <h2 className="mb-4 font-serif text-3xl font-bold leading-tight text-slate-900 group-hover:text-blue-600 transition-colors">
              {post.title}
            </h2>
            <div
              className="mb-8 line-clamp-3 text-sm text-slate-600 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.excerpt || "" }}
            />
            <div className="flex items-center gap-4 border-t border-slate-100 pt-6">
              <div className="h-10 w-10 rounded-full bg-slate-100 overflow-hidden border border-slate-200 relative">
                <Image src="https://i0.wp.com/hotham.vn/wordpress/wp-content/uploads/sites/30/2024/10/logo.png" alt="Hồ Thị Thắm" className="h-full w-full object-cover" fill />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-900">Hồ Thị Thắm</span>
                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{dateStr}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link href={`/${post.slug}`}>
        <motion.div
          whileHover={{ x: 5 }}
          className="group flex cursor-pointer items-start gap-4 py-5 border-b border-slate-100 last:border-0"
        >
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-50 border border-slate-100 relative">
            <Image
              src={post.featuredImage?.node.sourceUrl || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop"}
              alt={post.title}
              className="h-full w-full object-cover transition-all"
              fill
            />
          </div>
          <div>
            <span className="text-[9px] font-black uppercase tracking-widest text-blue-600 mb-1 block">
               {post.categories.nodes[0]?.name}
            </span>
            <h4 className="line-clamp-2 font-serif text-base font-bold leading-tight text-slate-900 group-hover:text-blue-600 transition-colors">
              {post.title}
            </h4>
            <span className="text-[10px] text-slate-400 mt-1 block uppercase tracking-widest font-bold">{dateStr}</span>
          </div>
        </motion.div>
      </Link>
    );
  }

  return (
    <Link href={`/${post.slug}`} className="flex flex-col h-full group">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-col h-full"
      >
        <div className="mb-6 overflow-hidden rounded-xl bg-slate-50 border border-slate-200 aspect-[3/2] relative group-hover:shadow-xl group-hover:shadow-blue-900/5 transition-all">
          <Image
            src={post.featuredImage?.node.sourceUrl || "https://i0.wp.com/hotham.vn/wordpress/wp-content/uploads/sites/30/2022/07/png_20220707_063705_0000.png?fit=1200%2C1200&ssl=1"}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            fill
          />
        </div>
        <div className="mb-2">
          <span className="text-[9px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
            {post.categories.nodes[0]?.name}
          </span>
        </div>
        <h3 className="mb-3 font-serif text-xl font-bold leading-tight text-slate-900 group-hover:text-blue-600 transition-colors">
          {post.title}
        </h3>
        <div
          className="mb-6 line-clamp-2 text-xs text-slate-600 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.excerpt || "" }}
        />
        <div className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400 mt-auto border-t border-slate-100 pt-4">{dateStr}</div>
      </motion.div>
    </Link>
  );
}
