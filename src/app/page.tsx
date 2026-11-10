import PostCard from "@/components/PostCard";
import { Post } from "@/types";
import SubscriptionForm from "@/components/SubscriptionForm";

// Helper to fetch from our new API route
async function fetchAPI(query: string, { variables, tags }: { variables?: any, tags?: string[] } = {}) {
  const res = await fetch('https://blog.hotham.vn/api/wp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
      tags,
    }),
    next: {
      tags,
    }
  });

  if (!res.ok) {
    console.error("API Fetch Error:", await res.text());
    return null;
  }

  return res.json();
}

const COMMON_POST_FIELDS = `
  id
  title
  slug
  date
  excerpt
  featuredImage {
    node {
      sourceUrl
      altText
    }
  }
  categories(first: 1) {
    nodes {
      name
      slug
    }
  }
`;

const GET_POSTS = `
  query GetPosts($search: String, $categoryName: String) {
    posts(where: { search: $search, categoryName: $categoryName }) {
      nodes {
        ${COMMON_POST_FIELDS}
      }
    }
  }
`;

const GET_FEATURED_POSTS = `
  query GetFeaturedPosts {
    posts(where: { tag: "tieu-diem" }) {
      nodes {
        ${COMMON_POST_FIELDS}
      }
    }
  }
`;

const GET_LATEST_POSTS = `
  query GetLatestPosts($first: Int) {
    posts(first: $first) {
      nodes {
        ${COMMON_POST_FIELDS}
      }
    }
  }
`;

type HomePageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export const revalidate = 3600; 

export default async function HomePage({ searchParams }: HomePageProps) {
  const resolvedSearchParams = await searchParams;
  
  const qParam = resolvedSearchParams.q;
  const q = Array.isArray(qParam) ? qParam[0] : qParam || "";

  const cParam = resolvedSearchParams.c;
  const c = Array.isArray(cParam) ? cParam[0] : cParam || "";

  const featuredDataPromise = fetchAPI(GET_FEATURED_POSTS, { tags: ['wordpress', 'featured-posts'] });
  const postsDataPromise = fetchAPI(GET_POSTS, {
    variables: { search: q, categoryName: c },
    tags: ['wordpress', 'posts-list', `search:${q}`, `category:${c}`]
  });

  const [featuredData, postsData] = await Promise.all([
    featuredDataPromise,
    postsDataPromise
  ]);

  let featured = featuredData?.posts?.nodes || [];

  if (featured.length === 0) {
    const latestData = await fetchAPI(GET_LATEST_POSTS, { variables: { first: 3 }, tags: ['wordpress', 'latest-posts'] });
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
