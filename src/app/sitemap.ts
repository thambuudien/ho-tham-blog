import { MetadataRoute } from 'next';
import { fetchWP, GET_POST_FOR_SITEMAP } from "@/lib/wordpress";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Định cấu hình URL trang chủ chính thức có tiền tố www của thương hiệu
  const baseUrl = 'https://blog.hotham.vn';

  // 1. Khai báo danh sách cấu trúc các tuyến đường tĩnh cố định của hệ thống
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0, // Trang chủ có thứ tự ưu tiên lập chỉ mục cao nhất
    },
    {
      url: `${baseUrl}/chuyen-muc`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ve-toi`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  try {
    // 2. Gọi API GraphQL quét lấy danh sách toàn bộ trang chi tiết dự án động từ WordPress
    const dynamicPosts = await fetchWP(GET_POST_FOR_SITEMAP);

    // 3. Biên dịch mảng dữ liệu thô từ API thành cấu trúc sơ đồ trang Sitemap hợp lệ
    const postRoutes: MetadataRoute.Sitemap = dynamicPosts.map((post) => ({
      url: `${baseUrl}/${post.slug}`,
      // Chuyển đổi chuỗi ngày giờ từ cơ sở dữ liệu WordPress sang định dạng ISO chuẩn sitemap
      lastModified: new Date(post.modified),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    // 4. Gộp toàn bộ tài nguyên tuyến đường tĩnh và động để xuất bản ra file sitemap tổng
    return [...staticRoutes, ...postRoutes];

  } catch (error) {
    console.error('Sự cố trong quá trình sinh file sitemap.xml động:', error);
    // Nếu kết nối API GraphQL bị gián đoạn, vẫn trả về danh sách trang tĩnh để Next.js không bị lỗi build hệ thống
    return staticRoutes;
  }
}
