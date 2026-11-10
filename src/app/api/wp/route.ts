import { NextResponse } from "next/server";
import { GraphQLClient } from "graphql-request";

const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || "https://hotham.vn/wordpress/rYkOy1HCCRD0JZZcrshVYaUR39QfcG15QWUC437BMM5Pk3gNLu";
const WP_SECRET = process.env.WORDPRESS_SECRET_TOKEN || "f4e18c5d6c2645e5981a837904c7b8d3";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { query, variables, tags } = body;

    if (!query) {
      return new NextResponse(JSON.stringify({ error: "Query is required" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const isMutation = query.trim().startsWith("mutation");

    const client = new GraphQLClient(WP_URL, {
      headers: {
        "lws-hotham-secret-token": WP_SECRET,
      },
      fetch: (url, init) => {
        return fetch(url, {
          ...init,
          ...(isMutation
            ? { cache: "no-store" } // Do not cache mutations
            : {
                next: {
                  revalidate: 604800, // Cache for 7 days
                  tags: tags || ["wordpress"], // Default tags
                },
              }),
        });
      },
    });

    const data = await client.request(query, variables);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error(error);
    // Check for GraphQL errors from graphql-request
    if (error.response && error.response.errors) {
        return new NextResponse(JSON.stringify({ error: 'GraphQL error', details: error.response.errors }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    return new NextResponse(JSON.stringify({ error: 'Failed to fetch from WordPress API', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
