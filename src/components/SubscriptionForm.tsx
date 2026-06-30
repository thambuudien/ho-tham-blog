
'use client';

import { useState } from 'react';
import { fetchWP, SUBSCRIBE_TO_NEWSLETTER } from "@/lib/wordpress";
import { Loader2, MessageSquare } from "lucide-react";

export default function SubscriptionForm() {
  const [email, setEmail] = useState("");
  const [subscribeMessage, setSubscribeMessage] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubscribe = async () => {
    setIsSubscribing(true);
    setSubscribeMessage("");
    try {
      const data = await fetchWP(SUBSCRIBE_TO_NEWSLETTER, { email });
      if (!data.subscribeToNewsletter.success) {
        throw new Error(data.subscribeToNewsletter.message || "Something went wrong");
      }
      setSubscribeMessage("Cảm ơn bạn đã đăng ký!");
      setEmail("");
    } catch (error: any) {
      setSubscribeMessage(error.message);
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <div className="mt-8 rounded-xl bg-slate-900 p-8 text-white shadow-xl shadow-blue-900/10 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
         <MessageSquare size={80} />
      </div>
      <h4 className="mb-2 font-serif text-xl font-bold relative z-10">Tư vấn BHXH/BHYT</h4>
      <p className="mb-6 text-xs text-slate-400 relative z-10 leading-relaxed">Đăng ký để nhận giải đáp thắc mắc về chính sách bảo hiểm mới nhất từ chị Hồ Thị Thắm.</p>
      <div className="flex flex-col gap-3 relative z-10">
        <input type="email" placeholder="Email của bạn" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white/10 border border-white/20 px-4 py-2 text-xs focus:outline-none focus:border-blue-400 transition-colors placeholder:text-slate-500 rounded-sm" />
        <button onClick={handleSubscribe} disabled={isSubscribing} className="bg-blue-600 text-white py-2 text-xs font-black uppercase tracking-widest hover:bg-blue-500 transition-all rounded-sm disabled:opacity-50">
          {isSubscribing ? <Loader2 className="animate-spin mx-auto" /> : "Nhận tư vấn ngay"}
        </button>
        {subscribeMessage && <p className="text-xs text-center mt-2">{subscribeMessage}</p>}
      </div>
    </div>
  );
}
