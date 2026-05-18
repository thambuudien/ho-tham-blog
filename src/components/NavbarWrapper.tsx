"use client";

import { Search, Menu, X, ArrowLeft } from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";
import * as motion from "motion/react-client";
import { AnimatePresence } from "motion/react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function NavbarWrapper() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isHome = pathname === "/" && !searchParams.get('q') && !searchParams.get('c');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/?q=${encodeURIComponent(searchValue.trim())}`);
      setIsSearchOpen(false);
      setSearchValue("");
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-12">
        <div className="flex items-center gap-4">
          {!isHome && (
            <Link
              href="/"
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft size={16} /> <span className="hidden sm:inline">Trở về</span>
            </Link>
          )}
          <Link href="/" className="cursor-pointer flex items-center gap-4 group">
            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-blue-50 shadow-sm group-hover:scale-105 transition-transform">
              <img src="https://i0.wp.com/hotham.vn/wordpress/wp-content/uploads/sites/30/2024/10/logo.png" alt="Hồ Thị Thắm" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="flex flex-col">
              <h1 className="font-serif text-2xl font-bold tracking-tight text-slate-900">
                blog.hotham.vn
              </h1>
              <span className="text-[10px] uppercase font-black tracking-[0.2em] text-blue-600 mt-0.5">Tư vấn BHXH & BHYT</span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-8">
          <div className="hidden items-center relative md:flex">
             <input 
              type="text" 
              placeholder="Tìm kiếm chính sách..." 
              className="text-sm bg-transparent border-b border-slate-200 py-1 pr-8 focus:outline-none focus:border-blue-600 transition-colors w-40 lg:w-48 placeholder:text-slate-300"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const val = (e.target as HTMLInputElement).value;
                  if (val.trim()) {
                    router.push(`/?q=${encodeURIComponent(val.trim())}`);
                  }
                }
              }}
            />
            <Search size={14} className="absolute right-0 text-slate-400" />
          </div>

          <div className="hidden items-center gap-8 md:flex">
            <Link 
              href="/" 
              className={`text-[10px] font-black uppercase tracking-widest transition-all ${pathname === '/' && !searchParams.get('c') ? 'text-blue-600' : 'text-slate-400 hover:text-slate-900'}`}
            >
              Trang chủ
            </Link>
            <Link 
              href="/chuyen-muc"
              className={`text-[10px] font-black uppercase tracking-widest transition-all ${pathname === '/chuyen-muc' || searchParams.get('c') ? 'text-blue-600' : 'text-slate-400 hover:text-slate-900'}`}
            >
              Chuyên mục
            </Link>
            <Link 
              href="/ve-toi"
              className={`text-[10px] font-black uppercase tracking-widest transition-all ${pathname === '/ve-toi' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-900'}`}
            >
              Về chuyên gia
            </Link>
          </div>

          <button 
            className="md:hidden p-2 text-slate-600"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search size={22} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[60] bg-white flex items-center justify-center p-6"
          >
            <button 
              onClick={() => setIsSearchOpen(false)}
              className="absolute top-8 right-8 p-2 text-slate-400 hover:text-slate-900 transition-colors"
            >
              <X size={32} />
            </button>
            <div className="mx-auto w-full max-w-3xl">
              <form onSubmit={handleSubmit} className="relative flex flex-col items-center">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-8">Tìm kiếm thông tin</span>
                <input
                  autoFocus
                  type="text"
                  placeholder="Hỏi về BHXH, BHYT..."
                  className="w-full border-b-2 border-slate-900 py-6 font-serif text-3xl md:text-5xl outline-none text-center bg-transparent placeholder:text-slate-100"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
                <button type="submit" className="mt-12 group flex items-center gap-3 text-xs font-black uppercase tracking-widest text-slate-900 hover:text-blue-600 transition-colors">
                  Bắt đầu tìm kiếm <ArrowLeft size={16} className="rotate-180 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
