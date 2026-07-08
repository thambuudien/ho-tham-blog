import { request, gql } from "graphql-request";

const WP_URL = "https://hotham.vn/wordpress/rYkOy1HCCRD0JZZcrshVYaUR39QfcG15QWUC437BMM5Pk3gNLu";

export const fetchWP = async (query: string, variables = {}) => {
  try {
    const headers: Record<string, string> = {
      "lws-hotham-secret-token": "f4e18c5d6c2645e5981a837904c7b8d3"
    };
    // if (process.env.WP_GRAPHQL_AUTH_TOKEN) {
    //   headers["Authorization"] = `Bearer ${process.env.WP_GRAPHQL_AUTH_TOKEN} || "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2hvdGhhbS52biIsImlhdCI6MTc4MjY1OTIwNywibmJmIjoxNzgyNjU5MjA3LCJleHAiOjM1NjUzMzY0MTQsImRhdGEiOnsidXNlciI6eyJpZCI6IjY2In19fQ.Bza3uujHlC05vSsuJzvQd0lhbLAiA6o-2Jhe0k3Kz-E"`;
    // }
    return await request(WP_URL, query, variables, headers);
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
