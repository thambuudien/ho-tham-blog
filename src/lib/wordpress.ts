import { request, gql } from "graphql-request";

const WP_URL = "https://hotham.vn/wordpress/rYkOy1HCCRD0JZZcrshVYaUR39QfcG15QWUC437BMM5Pk3gNLu";

export const fetchWP = async (query: string, variables = {},tags: string[] = ["wordpress"]) => {
  try {
    const headers: Record<string, string> = {
      "lws-hotham-secret-token": "f4e18c5d6c2645e5981a837904c7b8d3"
    };
    return await request(WP_URL, query, variables, {
      ...headers,
      next: {
        revalidate: 604800, // Cache 7 ngày (604,800 giây)
        tags: tags          // Tag định danh để revalidate tức thì
      }
    } as any);
  } catch (error: any) {
    console.error("WP GraphQL Error:", error.message);
    throw error;
  }
};

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
