import { MetadataRoute } from 'next';
import { fetchWP, GET_POST_FOR_SITEMAP } from "@/lib/wordpress";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Định cấu hình URL trang chủ chính thức
  const baseUrl = 'https://blog.hotham.vn';

  // 1. Khai báo danh sách cấu trúc các tuyến đường tĩnh cố định
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0, // Trang chủ có ưu tiên cao nhất
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
    // 2. Gọi API GraphQL quét dữ liệu thô từ WordPress
    const data = await fetchWP(GET_POST_FOR_SITEMAP);
    
    // Khắc phục lỗi: Lấy đúng mảng nodes nằm sâu trong kết quả trả về của GraphQL
    const posts = data?.posts?.nodes || [];

    // 3. Biên dịch mảng dữ liệu thành cấu trúc Sitemap của Next.js
    const postRoutes: MetadataRoute.Sitemap = posts.map((post: { slug: string; modified?: string }) => {
      // Xử lý ngày tháng an toàn phòng trường hợp trường 'modified' trống hoặc sai định dạng
      let lastModifiedDate = new Date();
      if (post.modified) {
        const parsedDate = new Date(post.modified);
        if (!isNaN(parsedDate.getTime())) {
          lastModifiedDate = parsedDate;
        }
      }

      return {
        url: `${baseUrl}/${post.slug}`,
        lastModified: lastModifiedDate,
        changeFrequency: 'weekly',
        priority: 0.7,
      };
    });

    // 4. Gộp toàn bộ tuyến đường tĩnh và động
    return [...staticRoutes, ...postRoutes];

  } catch (error) {
    console.error('Sự cố trong quá trình sinh file sitemap.xml động:', error);
    // Nếu có sự cố kết nối API, trả về danh sách trang tĩnh để tránh lỗi biên dịch toàn bộ hệ thống
    return staticRoutes;
  }
}