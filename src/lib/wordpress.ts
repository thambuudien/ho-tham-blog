import { GraphQLClient, gql } from "graphql-request";

const WP_URL = process.env.WORDPRESS_GRAPHQL_URL || "";
const WP_SECRET = process.env.WORDPRESS_SECRET_TOKEN || "";

// Trả về rỗng theo từng loại query để trang không bị crash khi WP chặn 403
function emptyFallback(query: string): any {
  if (query.includes("GetPostBySlug")) return { post: null };
  if (query.includes("GetAllPostSlugs") || query.includes("GetPostsForSitemap")) return { posts: { nodes: [] } };
  if (query.includes("GetPosts") || query.includes("GetFeatured") || query.includes("GetLatest") || query.includes("GetRelated")) return { posts: { nodes: [] } };
  if (query.includes("GetCategories")) return { categories: { nodes: [] } };
  return {};
}

export const fetchWP = async <T = any, V extends Record<string, any> = Record<string, any>>(
  query: string,
  variables?: V,
  tags: string[] = ["wordpress"]
): Promise<T> => {
  if (!WP_URL) {
    console.warn("[fetchWP] Thiếu WORDPRESS_GRAPHQL_URL, trả về rỗng");
    return emptyFallback(query) as T;
  }

  const isMutation = query.trim().startsWith("mutation");

  const client = new GraphQLClient(WP_URL, {
    headers: {
      ...(WP_SECRET ? { "lws-hotham-secret-token": WP_SECRET } : {}),
      // Quan trọng: Imunify360 chặn UA mặc định của graphql-request / node-fetch
      "User-Agent": "Mozilla/5.0 (compatible; HoThamBot/1.0; +https://www.hotham.vn)",
      "Accept": "application/json",
    },
    fetch: (url, init) => {
      return fetch(url, {
        ...init,
        ...(isMutation
          ? { cache: "no-store" }
          : { next: { revalidate: 604800, tags } }),
      });
    },
  });

  try {
    return await client.request<T>(query, variables);
  } catch (error: any) {
    const msg = String(error?.message || error);
    const is403 = msg.includes("403") || msg.includes("Imunify360") || msg.includes("Access denied");

    // Mutation thì vẫn báo lỗi để form hiện "gửi không thành công"
    if (isMutation) {
      console.error("WP GraphQL Mutation Error:", msg);
      throw error;
    }

    // Query bị 403 -> chỉ warn, trả rỗng, KHÔNG throw để build không sập
    if (is403) {
      console.warn("[fetchWP] WP chặn 403 Imunify360, trả về rỗng để trang vẫn chạy. Cần whitelist IP Vercel.");
      return emptyFallback(query) as T;
    }

    console.error("WP GraphQL Error:", msg);
    return emptyFallback(query) as T;
  }
};

// --- Hàm nhận diện CTA cho bài viết, dùng chung cho PostPage ---
export type CtaType = "bhyt" | "bhxh" | "both";

export function getCtaType(categories: { slug?: string; name?: string }[] | undefined): CtaType {
  const text = (categories || [])
    .map((c) => `${c.slug || ""} ${c.name || ""}`.toLowerCase())
    .join(" ");

  const isBhyt =
    text.includes("bhyt") ||
    text.includes("y-te") ||
    text.includes("y tế") ||
    text.includes("bao-hiem-y-te");

  const isBhxh =
    text.includes("bhxh") ||
    text.includes("xa-hoi") ||
    text.includes("xã hội") ||
    text.includes("luong-huu") ||
    text.includes("lương hưu") ||
    text.includes("huu");

  if (isBhyt && !isBhxh) return "bhyt";
  if (isBhxh && !isBhyt) return "bhxh";
  return "both";
}

// --- GIỮ NGUYÊN CÁC TRUY VẤN GRAPHQL CỦA BẠN ---

export const GET_POSTS = gql`
  query GetPosts($first: Int = 100, $search: String, $categoryName: String) {
    posts(first: $first, where: { search: $search, categoryName: $categoryName, status: PUBLISH }) {
      nodes {
        id
        title
        slug
        excerpt
        date
        featuredImage { node { sourceUrl altText } }
        author { node { name } }
        categories { nodes { name slug } }
      }
    }
  }
`;

export const GET_FEATURED_POSTS = gql`
  query GetFeaturedPosts {
    posts(first: 3, where: { categoryName: "featured", status: PUBLISH }) {
      nodes {
        id
        title
        slug
        excerpt
        date
        featuredImage { node { sourceUrl altText } }
        categories { nodes { name slug } }
      }
    }
  }
`;

export const GET_LATEST_POSTS = gql`
  query GetLatestPosts($first: Int = 3) {
    posts(first: $first, where: { status: PUBLISH }) {
      nodes {
        id
        title
        slug
        excerpt
        date
        featuredImage { node { sourceUrl altText } }
        categories { nodes { name slug } }
        author { node { name } }
      }
    }
  }
`;

export const GET_POST_BY_SLUG = gql`
  query GetPostBySlug($id: ID!) {
    post(id: $id, idType: SLUG) {
      id
      title
      content
      date
      lwsSeo {
        [STRIPPED 87 bytes] { description image siteName title type url }
      }
      featuredImage { node { sourceUrl altText } }
      author { node { name avatar { url } } }
      categories { nodes { name slug } }
    }
  }
`;

export const GET_CATEGORIES = gql`
  query GetCategories {
    categories(first: 20) {
      nodes { id name slug count }
    }
  }
`;

export const GET_RELATED_POSTS = gql`
  query GetRelatedPosts($categoryName: String, $notIn: [ID]) {
    posts(first: 3, where: { categoryName: $categoryName, notIn: $notIn, status: PUBLISH }) {
      nodes {
        id
        title
        slug
        excerpt
        date
        featuredImage { node { sourceUrl altText } }
        categories { nodes { name slug } }
      }
    }
  }
`;

export const GET_ALL_POST_SLUGS = gql`
  query GetAllPostSlugs {
    posts(first: 10000, where: { status: PUBLISH }) {
      nodes { slug }
    }
  }
`;

export const SUBSCRIBE_TO_NEWSLETTER = gql`
  mutation SubscribeToNewsletter($email: String!) {
    subscribeToNewsletter(input: { email: $email }) {
      success
      message
    }
  }
`;

export const GET_POST_FOR_SITEMAP = gql`
  query GetPostsForSitemap {
    posts(first: 10000, where: { status: PUBLISH }) {
      nodes { slug modified }
    }
  }
`;