import { NextResponse } from "next/server";
import { GraphQLClient } from "graphql-request";

// CHỈ lấy từ env, không có fallback hard-code
const WP_URL = process.env.WORDPRESS_API_URL;
const WP_SECRET = process.env.WORDPRESS_SECRET_TOKEN;

export async function POST(request: Request) {
  try {
    if (!WP_URL || !WP_SECRET) {
      console.error("Missing WORDPRESS_API_URL or WORDPRESS_SECRET_TOKEN");
      return NextResponse.json(
        { error: "Server misconfigured" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { query, variables, tags } = body;

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { error: "Query is required" },
        { status: 400 }
      );
    }

    // Chặn mutation từ client - chỉ cho phép query đọc dữ liệu
    // Nếu bạn cần mutation (form liên hệ, comment...), tách ra 1 route riêng có validate chặt
    const trimmed = query.trim().toLowerCase();
    if (trimmed.startsWith("mutation")) {
      return NextResponse.json(
        { error: "Mutations are not allowed" },
        { status: 403 }
      );
    }

    const client = new GraphQLClient(WP_URL, {
      headers: {
        "lws-hotham-secret-token": WP_SECRET,
      },
      fetch: (url, init) => {
        return fetch(url, {
          ...init,
          next: {
            revalidate: 604800, // Cache 7 ngày
            tags: tags || ["wordpress"],
          },
        });
      },
    });

    const data = await client.request(query, variables);
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error(error);

    if (
      typeof error === "object" &&
      error !== null &&
      "response" in error &&
      typeof (error as { response?: unknown }).response === "object"
    ) {
      const res = (error as { response: { errors?: unknown } }).response;
      if (res?.errors) {
        return NextResponse.json(
          { error: "GraphQL error", details: res.errors },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to fetch from WordPress API" },
      { status: 500 }
    );
  }
}