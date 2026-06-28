'use client';

import { fetchWP, GET_FEATURED_POSTS, GET_POSTS, GET_LATEST_POSTS, SUBSCRIBE_TO_NEWSLETTER } from "@/lib/wordpress";
import PostCard from "@/components/PostCard";
import { Loader2, ChevronRight, MessageSquare } from "lucide-react";
import { Post } from "@/types";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function HomePage() {
  const [searchParams, setSearchParams] = useState<{ q?: string; c?: string }>({});
  const [featuredPosts, setFeaturedPosts] = useState<Post[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [email, setEmail] = useState("");
  const [subscribeMessage, setSubscribeMessage] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q") || undefined;
    const c = params.get("c") || undefined;
    setSearchParams({ q, c });

    async function fetchData() {
      const featuredData = await fetchWP(GET_FEATURED_POSTS);
      let featured = featuredData.posts.nodes;

      if (featured.length === 0) {
        const latestData = await fetchWP(GET_LATEST_POSTS, { first: 3 });
        featured = latestData.posts.nodes;
      }
      setFeaturedPosts(featured);

      const postsData = await fetchWP(GET_POSTS, {
        search: q || "",
        categoryName: c || "",
      });
      setPosts(postsData.posts.nodes);
    }

    fetchData();
  }, []);

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
    <div className="px-6">
      {searchParams.q && (
        <div className="mb-12 border-l-4 border-slate-900 pl-6">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Kết quả tìm kiếm</span>
          <h2 className="font-serif text-4xl font-bold italic mt-1 text-slate-900">"{searchParams.q}"</h2>
        </div>
      )}

      {searchParams.c && (
        <div className="mb-12 border-l-4 border-blue-600 pl-6">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Chuyên mục</span>
          <h2 className="font-serif text-4xl font-bold italic mt-1 text-slate-900">{searchParams.c}</h2>
        </div>
      )}

      {!searchParams.q && !searchParams.c && featuredPosts.length > 0 && (
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-[2px] w-12 bg-blue-600"></div>
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900">TIÊU ĐIỂM TƯ VẤN</h2>
          </div>
          
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <PostCard
                post={featuredPosts[0]}
                variant="featured"
              />
            </div>
            <div className="flex flex-col lg:col-span-4">
              <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-4">
                <h3 className="font-serif text-lg font-bold text-slate-900">Tin tức mới nhất</h3>
              </div>
              <div className="flex-1">
                {featuredPosts.slice(1, 4).map((post: Post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    variant="compact"
                  />
                ))}
              </div>
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
            </div>
          </div>
        </section>
      )}

      <div className="mb-12 flex items-center gap-4">
        <h2 className="font-serif text-2xl font-bold text-slate-900">
          {searchParams.q || searchParams.c ? "Kết quả liên quan" : "Cẩm nang bảo hiểm"}
        </h2>
        <div className="h-px flex-1 bg-slate-200"></div>
      </div>

      {posts.length > 0 ? (
        <div className="grid gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post: Post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
            <p className="text-slate-500 italic">Không tìm thấy bài viết nào.</p>
        </div>
      )}
    </div>
  );
}
