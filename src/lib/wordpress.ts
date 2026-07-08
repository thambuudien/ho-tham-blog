import { GraphQLClient, gql } from "graphql-request";

// Sử dụng biến môi trường (Khuyến nghị) hoặc fallback về url cứng nếu chưa cấu hình .env
const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || "https://hotham.vn/wordpress/rYkOy1HCCRD0JZZcrshVYaUR39QfcG15QWUC437BMM5Pk3gNLu";
const WP_SECRET = process.env.WORDPRESS_SECRET_TOKEN || "f4e18c5d6c2645e5981a837904c7b8d3";

export const fetchWP = async <T = any, V extends Record<string, any> = Record<string, any>>(
  query: string,
  variables?: V,
  tags: string[] = ["wordpress"]
): Promise<T> => {
  // Kiểm tra xem truy vấn có phải là mutation hay không
  const isMutation = query.trim().startsWith("mutation");

  const client = new GraphQLClient(WP_URL, {
    headers: {
      "lws-hotham-secret-token": WP_SECRET,
    },
    // Ghi đè fetch để Next.js Data Cache có thể bắt được cấu hình revalidate & tags
    fetch: (url, init) => {
      return fetch(url, {
        ...init,
        ...(isMutation
          ? { cache: "no-store" } // Không lưu cache đối với các mutation ghi dữ liệu
          : {
              next: {
                revalidate: 604800, // Cache 7 ngày (604,800 giây)
                tags: tags,         // Tag định danh để revalidate chủ động
              },
            }),
      });
    },
  });

  try {
    return await client.request<T>(query, variables);
  } catch (error: any) {
    console.error("WP GraphQL Error:", error.message || error);
    throw error;
  }
};

// --- GIỮ NGUYÊN CÁC TRUY VẤN GRAPHQL CỦA BẠN ---

export const GET_POSTS = gql`
  query GetPosts($first: Int = 100, $search: String, $categoryName: String) {
    posts(
      first: $first
      where: {
        search: $search
        categoryName: $categoryName
        status: PUBLISH
      }
    ) {
      nodes {
        id
        title
        slug
        excerpt
        date
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        author {
          node {
            name
          }
        }
        categories {
          nodes {
            name
            slug
          }
        }
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
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        categories {
          nodes {
            name
            slug
          }
        }
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
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        categories {
          nodes {
            name
            slug
          }
        }
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
        focusKeyword
        fullHeadHtml
        metaDescription
        metaTitle
        nofollow
        noindex
        canonical
        schema
        opengraph {
          description
          image
          siteName
          title
          type
          url
        }
      }
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      author {
        node {
          name
          avatar {
            url
          }
        }
      }
      categories {
        nodes {
          name
          slug
        }
      }
    }
  }
`;

export const GET_CATEGORIES = gql`
  query GetCategories {
    categories(first: 20) {
      nodes {
        id
        name
        slug
        count
      }
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
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        categories {
          nodes {
            name
            slug
          }
        }
      }
    }
  }
`;

export const GET_ALL_POST_SLUGS = gql`
  query GetAllPostSlugs {
    posts(first: 10000, where: { status: PUBLISH }) {
      nodes {
        slug
      }
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
      nodes {
        slug
        modified
      }
    }
  }
`;