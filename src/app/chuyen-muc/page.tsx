import CategoryCard from "@/components/CategoryCard";

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

const GET_CATEGORIES = `
  query GetCategories {
    categories {
      nodes {
        id
        name
        slug
        count
      }
    }
  }
`;

export const revalidate = 604800; // Làm mới dữ liệu sau 7 ngày

export default async function CategoriesPage() {
  const data = await fetchAPI(GET_CATEGORIES, { tags: ['wordpress', 'categories'] });
  const categories = data?.categories?.nodes?.filter((cat: any) => cat.count > 0) || [];

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
