import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 py-24 mt-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid gap-16 md:grid-cols-4">
          <div className="col-span-2">
             <h1 className="mb-6 font-serif text-2xl font-bold tracking-tight text-slate-900">blog.hotham.vn</h1>
             <p className="max-w-xs text-sm leading-relaxed text-slate-600">Trang tin kiến thức và tư vấn về Bảo hiểm xã hội, Bảo hiểm y tế chính thống. Hỗ trợ bà con tiếp cận quyền lợi an sinh xã hội dễ dàng hơn.</p>
          </div>
          <div>
            <h4 className="mb-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Liên kết nhanh</h4>
            <ul className="space-y-4 text-xs text-slate-600 font-bold tracking-wide">
              <li><Link href="/chuyen-muc" className="hover:text-blue-600 transition-colors uppercase">Chuyên mục</Link></li>
              <li><Link href="/ve-toi" className="hover:text-blue-600 transition-colors uppercase">Về chuyên gia</Link></li>
              <li><Link href="/ve-toi" className="hover:text-blue-600 transition-colors uppercase">Liên hệ tư vấn</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Theo dõi</h4>
            <ul className="space-y-4 text-xs text-slate-600 font-bold tracking-wide uppercase">
              <li className="hover:text-blue-600 cursor-pointer transition-colors">Facebook</li>
              <li className="hover:text-blue-600 cursor-pointer transition-colors">Zalo</li>
              <li className="hover:text-blue-600 cursor-pointer transition-colors">Email</li>
            </ul>
          </div>
        </div>
        <div className="mt-24 border-t border-slate-50 pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">© 2024 blog.hotham.vn. Mọi quyền được bảo lưu.</p>
          <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            <span className="hover:text-slate-900 cursor-pointer">Chính sách bảo mật</span>
            <span className="hover:text-slate-900 cursor-pointer">Điều khoản sử dụng</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
