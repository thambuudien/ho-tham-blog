import { fetchWP, GET_FEATURED_POSTS, GET_POSTS, GET_LATEST_POSTS } from "@/lib/wordpress";
import PostCard from "@/components/PostCard";
import { Post } from "@/types";
import SubscriptionForm from "@/components/SubscriptionForm";

type HomePageProps = {
  // Cấu hình searchParams thành Promise để tương thích Next.js 15
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  // 1. Giải nén searchParams bằng await
  const resolvedSearchParams = await searchParams;
  
  const qParam = resolvedSearchParams.q;
  const q = Array.isArray(qParam) ? qParam[0] : qParam || "";

  const cParam = resolvedSearchParams.c;
  const c = Array.isArray(cParam) ? cParam[0] : cParam || "";

  // 2. Tải song song cả Tiêu điểm và Cẩm nang để tối ưu tốc độ phản hồi trang (TTFB)
  const featuredDataPromise = fetchWP(GET_FEATURED_POSTS);
  const postsDataPromise = fetchWP(GET_POSTS, {
    search: q,
    categoryName: c,
  });

  const [featuredData, postsData] = await Promise.all([
    featuredDataPromise,
    postsDataPromise
  ]);

  let featured = featuredData?.posts?.nodes || [];

  // Nếu không có bài viết tiêu điểm, gọi API fallback lấy tin mới nhất
  if (featured.length === 0) {
    const latestData = await fetchWP(GET_LATEST_POSTS, { first: 3 });
    featured = latestData?.posts?.nodes || [];
  }
  const featuredPosts: Post[] = featured;
  const posts: Post[] = postsData?.posts?.nodes || [];

  return (
    <div className="px-6">
      {q && (
        <div className="mb-12 border-l-4 border-slate-900 pl-6">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Kết quả tìm kiếm</span>
          <h2 className="font-serif text-4xl font-bold italic mt-1 text-slate-900">"{q}"</h2>
        </div>
      )}

      {c && (
        <div className="mb-12 border-l-4 border-blue-600 pl-6">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Chuyên mục</span>
          <h2 className="font-serif text-4xl font-bold italic mt-1 text-slate-900">{c}</h2>
        </div>
      )}

      {!q && !c && featuredPosts.length > 0 && (
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
              <SubscriptionForm />
            </div>
          </div>
        </section>
      )}

      <div className="mb-12 flex items-center gap-4">
        <h2 className="font-serif text-2xl font-bold text-slate-900">
          {q || c ? "Kết quả liên quan" : "Cẩm nang bảo hiểm"}
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