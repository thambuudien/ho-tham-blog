import { Building2, MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import * as motion from "motion/react-client";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-16 text-center">
        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-4">Về chuyên gia</h2>
        <h1 className="font-serif text-5xl font-bold text-slate-900 mb-8">Hồ Thị Thắm</h1>
        <div className="h-[2px] w-24 bg-blue-600 mx-auto"></div>
      </div>

      <div className="grid md:grid-cols-2 gap-16 items-start">
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

        <div className="space-y-8">
          <div className="prose prose-slate prose-sm leading-relaxed text-slate-600 mb-10">
            <p className="text-xl text-slate-900 font-serif font-bold mb-6">
              Đại lý thu Bảo hiểm xã hội & Bảo hiểm y tế chính thức tại Tự Lập, Hà Nội.
            </p>
            <p>
              Với nhiều năm kinh nghiệm công tác tại hệ thống Bưu điện Việt Nam, tôi hiện là đại lý chính thức được ủy quyền thu Bảo hiểm xã hội (BHXH) và Bảo hiểm y tế (BHYT) tự nguyện. 
            </p>
            <p>
              Sứ mệnh của tôi là mang đến sự an tâm và đảm bảo quyền lợi về sức khỏe, an sinh xã hội cho bà con. Blog này là nơi tôi tổng hợp, chia sẻ những kiến thức pháp luật bảo hiểm dễ hiểu, giúp mọi người nắm bắt quyền lợi của mình một cách tốt nhất.
            </p>
          </div>

          <div className="space-y-4">
             <div className="flex items-start gap-4 p-5 rounded-xl border border-slate-100 bg-white shadow-sm">
              <div className="h-10 w-10 shrink-0 bg-blue-50 flex items-center justify-center rounded-lg text-blue-600">
                <Building2 size={20} />
              </div>
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Đơn vị công tác</h4>
                <p className="text-sm font-bold text-slate-900 leading-tight">Bưu điện VHX Tự Lập - Đại lý thu BHXH, BHYT</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-xl border border-slate-100 bg-white shadow-sm">
              <div className="h-10 w-10 shrink-0 bg-slate-100 flex items-center justify-center rounded-lg text-slate-600">
                <MapPin size={20} />
              </div>
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Văn phòng</h4>
                <p className="text-sm font-bold text-slate-900 leading-tight">Thôn Phú Mỹ, Xã Tiến Thắng, Tp. Hà Nội</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-xl border border-slate-100 bg-white shadow-sm">
              <div className="h-10 w-10 shrink-0 bg-green-50 flex items-center justify-center rounded-lg text-green-600">
                <Phone size={20} />
              </div>
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Hotline / Zalo</h4>
                <p className="text-sm font-bold text-slate-900 leading-tight">0978333963</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-xl border border-slate-100 bg-white shadow-sm">
              <div className="h-10 w-10 shrink-0 bg-slate-900 flex items-center justify-center rounded-lg text-white">
                <Mail size={20} />
              </div>
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Email liên hệ</h4>
                <p className="text-sm font-bold text-slate-900 leading-tight">info@hotham.vn</p>
              </div>
            </div>
          </div>

          <div className="pt-6">
             <button className="w-full bg-blue-600 text-white font-black py-4 rounded-xl shadow-xl shadow-blue-600/20 hover:bg-blue-500 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs">
                <MessageCircle size={18} /> Liên hệ tư vấn trực tiếp
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
