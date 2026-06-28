import { fetchWP, GET_POST_BY_SLUG, GET_RELATED_POSTS } from "@/lib/wordpress";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { User, Calendar, Tag, MessageSquare, Share2, Facebook, Twitter, Link2, ChevronRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import PostCard from "@/components/PostCard";
import type { Metadata } from "next";
import Image from "next/image";

export const revalidate = 604800; // Làm mới dữ liệu sau 7 ngày (7 * 24 * 60 * 60)

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await fetchWP(GET_POST_BY_SLUG, { id: slug });
  const post = data?.post;

  if (!post || !post.lwsSeo) {
    return {
      title: post?.title || "Bài viết",
    };
  }

  const { lwsSeo: seo } = post;

  return {
    title: seo.metaTitle,
    description: seo.metaDescription,
    alternates: {
      canonical: seo.canonical,
    },
    openGraph: {
      title: seo.opengraph.title || seo.metaTitle,
      description: seo.opengraph.dscription || seo.metaDescription,
      images: seo.opengraph.image ? [{ url: seo.opengraph.image }] : [],
      type: (seo.opengraph.type as any) || "article",
    },
    twitter: {
      card: "summary_large_image",
      title: seo.opengraph.title || seo.metaTitle,
      description: seo.opengraph.dscription || seo.metaDescription,
      images: seo.opengraph.image ? [{ url: seo.opengraph.image }] : [],
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await fetchWP(GET_POST_BY_SLUG, { id: slug });
  const post = data.post;

  if (!post) {
    notFound();
  }

  const primaryCategory = post.categories.nodes[0]?.slug;
  const relatedData = await fetchWP(GET_RELATED_POSTS, {
    categoryName: primaryCategory,
    notIn: [post.id]
  });
  const relatedPosts = relatedData.posts.nodes;

  const dateStr = format(new Date(post.date), "dd MMMM, yyyy", { locale: vi });

  return (
    <article className="px-6 lg:px-12 py-12">
      {post.lwsSeo?.schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: post.lwsSeo.schema || "" }}
        />
      )}
      <header className="mx-auto max-w-4xl text-center mb-16">
        <div className="mb-6 flex justify-center gap-3">
          {post.categories.nodes.map((cat: any) => (
            <Link
              key={cat.slug}
              href={`/?c=${cat.slug}`}
              className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 bg-blue-50 px-3 py-1 rounded-full hover:bg-blue-100 transition-all shadow-sm"
            >
              {cat.name}
            </Link>
          ))}
        </div>
        <h1 className="mb-10 font-serif text-4xl font-bold leading-tight text-slate-900 md:text-6xl">
          {post.title}
        </h1>
        <div className="flex flex-wrap items-center justify-center gap-8 text-[10px] font-black uppercase tracking-widest text-slate-400 border-y border-slate-100 py-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-white shadow-md relative">
              <Image src="https://i0.wp.com/hotham.vn/wordpress/wp-content/uploads/sites/30/2024/10/logo.png" alt="Hồ Thị Thắm" className="h-full w-full object-cover" fill />
            </div>
            <span className="text-slate-900 font-bold">Hồ Thị Thắm</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-blue-600" />
            <span>{dateStr}</span>
          </div>
          <div className="flex items-center gap-2">
            <Tag size={14} className="text-blue-600" />
            <span>5 phút đọc</span>
          </div>
        </div>
      </header>

      {post.featuredImage && (
        <div className="mx-auto mb-16 max-w-5xl overflow-hidden rounded-2xl shadow-2xl shadow-blue-900/10 aspect-[16/9] relative">
          <Image
            src={post.featuredImage.node.sourceUrl}
            alt={post.featuredImage.node.altText || post.title}
            className="w-full h-full object-cover"
            fill
          />
        </div>
      )}

      <div className="mx-auto max-w-3xl">
        <div
          className="prose prose-blue prose-lg max-w-none prose-headings:font-serif prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-600 prose-p:leading-relaxed prose-li:text-slate-600 prose-strong:text-slate-900 prose-blockquote:border-blue-600 prose-blockquote:bg-blue-50 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-img:rounded-xl"
          dangerouslySetInnerHTML={{ __html: post.content || "" }}
        />

        <div className="mt-16 flex items-center justify-between border-y border-slate-100 py-8">
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Chia sẻ:</span>
            <div className="flex gap-2">
               <button className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm"><Facebook size={18} /></button>
               <button className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-600 hover:bg-black hover:text-white transition-all shadow-sm"><Twitter size={18} /></button>
               <button className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-600 hover:bg-blue-400 hover:text-white transition-all shadow-sm"><Link2 size={18} /></button>
            </div>
          </div>
          <div className="flex gap-2">
             {post.categories.nodes.map((cat: any) => (
                <Link key={cat.slug} href={`/?c=${cat.slug}`} className="text-[10px] font-bold text-slate-400 hover:text-blue-600">#{cat.name}</Link>
             ))}
          </div>
        </div>

        {relatedPosts.length > 0 && (
          <section className="mt-24">
            <div className="mb-12 flex items-center gap-4">
              <h3 className="font-serif text-2xl font-bold text-slate-900">Bài viết liên quan</h3>
              <div className="h-px flex-1 bg-slate-200"></div>
            </div>
            <div className="grid gap-8 sm:grid-cols-2">
              {relatedPosts.map((rPost: any) => (
                <PostCard key={rPost.id} post={rPost} />
              ))}
            </div>
          </section>
        )}

        <footer className="mt-24 border-t border-slate-100 pt-16">
          <div className="flex items-center gap-6 bg-white p-10 rounded-2xl border border-slate-200 shadow-xl shadow-blue-900/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <MessageSquare size={100} />
            </div>
            <div className="h-24 w-24 shrink-0 overflow-hidden rounded-full border-4 border-white shadow-xl relative">
              <Image src="https://i0.wp.com/hotham.vn/wordpress/wp-content/uploads/sites/30/2024/10/logo.png" alt="Hồ Thị Thắm" className="h-full w-full object-cover" fill />
            </div>
            <div className="relative z-10">
              <h4 className="font-serif text-2xl font-bold text-slate-900 mb-2">Hồ Thị Thắm</h4>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">Chuyên gia tư vấn Bảo hiểm xã hội & Bảo hiểm y tế với hơn 10 năm kinh nghiệm. Luôn sẵn sàng hỗ trợ bà con giải đáp mọi thắc mắc về chính sách an sinh xã hội.</p>
              <Link href="/ve-toi" className="text-xs font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 inline-flex items-center gap-2">
                Tìm hiểu thêm <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </article>
  );
}
