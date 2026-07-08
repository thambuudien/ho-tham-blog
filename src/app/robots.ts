import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      // Áp dụng luật chung cho tất cả các loại Bot tìm kiếm trên internet
      userAgent: '*', 
      
      // Cho phép cào dữ liệu và hiển thị toàn bộ các trang nội dung công khai
      allow: '/',     
      
      // Chặn Bot tiếp cận các thư mục mã nguồn và hệ thống xử lý nội bộ của Next.js
      disallow: [
        '/api/',      // Chặn cào dữ liệu các file Endpoint API nội bộ
        '/_next/',    // Chặn quét các tệp đóng gói tài nguyên (Build Chunks)
      ],
    },
    // Khai báo đường dẫn Sitemap chính thức để Google Bot tự động tìm đến cào link động
    sitemap: 'https://blog.hotham.vn/sitemap.xml',
  };
}
