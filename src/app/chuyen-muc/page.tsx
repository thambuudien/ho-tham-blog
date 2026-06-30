import { fetchWP, GET_CATEGORIES } from "@/lib/wordpress";
import CategoryCard from "@/components/CategoryCard";

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
          <CategoryCard key={cat.id} category={cat} />
        ))}
      </div>
    </div>
  );
}
