import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  const tag = request.nextUrl.searchParams.get("tag") || "wordpress";

  // Kiểm tra secret token để bảo mật API
  if (secret !== "f4e18c5d6c2645e5981a837904c7b8d3") {
    return NextResponse.json({ message: "Invalid secret token" }, { status: 401 });
  }

  try {
    // Xóa cache của tag được chỉ định ngay lập tức
    revalidateTag(tag);
    return NextResponse.json({ revalidated: true, tag, now: Date.now() });
  } catch (err) {
    return NextResponse.json({ message: "Error revalidating" }, { status: 500 });
  }
}