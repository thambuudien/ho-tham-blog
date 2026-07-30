import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai"; // Hoặc import từ SDK bạn đang sử dụng

// Hàm khởi tạo AI (Lấy API Key từ biến môi trường)
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyD_34UlYmfb_FWrH9R6pMHZOTevcXGlUWQ';
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
}

// Hàm Fallback phòng trường hợp API lỗi hoặc không cấu hình API Key
function generateFallbackBHXHRewrite(title: string, content: string) {
  return `
<h2>${title || "Tư Vấn Chế Độ BHXH Tự Nguyện & BHYT Hộ Gia Đình"}</h2>
<p><strong>Kính chào bà con và quý khách hàng!</strong> Tôi là Hồ Thị Thắm - Nhân viên thu đại lý BHXH, BHYT tại điểm Bưu điện Văn hóa xã Tự Lập (thôn Phú Mỹ, xã Tiến Thắng, Mê Linh, Hà Nội).</p>
<p>Bảo hiểm xã hội tự nguyện và Bảo hiểm y tế hộ gia đình là hai chính sách an sinh xã hội tối ưu giúp bà con an tâm bảo vệ sức khỏe và đảm bảo tài chính khi về già.</p>
<h3>Quyền lợi nổi bật khi tham gia:</h3>
<ul>
  <li><strong>BHYT Hộ gia đình:</strong> Giảm trừ mức đóng cho các thành viên trong gia đình, hưởng 100% chi phí khám chữa bệnh khi tham gia đủ 5 năm liên tục và đạt điều kiện quy định.</li>
  <li><strong>BHXH Tự nguyện:</strong> Được Ngân sách Nhà nước hỗ trợ tiền đóng (30% hộ nghèo, 25% cận nghèo, 10% đối tượng khác). Tích lũy thời gian để hưởng <strong>Lương hưu trọn đời</strong> và cấp thẻ BHYT miễn phí.</li>
  <li><strong>Khám chữa bệnh tiện lợi:</strong> Sử dụng CCCD gắn chip hoặc ứng dụng VssID thay thế thẻ BHYT giấy.</li>
</ul>
<p>Nội dung tham khảo: ${content}</p>
<p>Mọi thắc mắc xin vui lòng liên hệ trực tiếp Chị Thắm: <strong>0978 333 963</strong> (SĐT/Zalo) để được tư vấn tận tâm và làm thủ tục nhanh chóng!</p>
  `.trim();
}

export async function POST(request: Request) {
  let reqBody: any = {};
  try {
    reqBody = await request.json();
    const { action, title, content, keywords } = reqBody;
    const ai = getGenAI();

    const persona =
      "Bạn là Chị Hồ Thị Thắm - Nhân viên thu đại lý BHXH, BHYT uy tín tại điểm Bưu điện Văn hóa xã Tự Lập, thôn Phú Mỹ, xã Tiến Thắng, Mê Linh, Hà Nội (SĐT/Zalo: 0978 333 963). Bạn là một chuyên viên tư vấn an sinh xã hội tận tâm, am hiểu tường tận Luật Bảo hiểm xã hội và Luật Bảo hiểm y tế hiện hành.";

    // Fallbacks if GEMINI_API_KEY is not configured or offline
    if (!ai) {
      if (action === "rewrite" || action === "rewrite_bhxh") {
        return NextResponse.json({
          result: generateFallbackBHXHRewrite(title || "", content || ""),
        });
      } else if (action === "outline") {
        return NextResponse.json({
          result: `<h2>Dàn Ý Bài Viết: ${
            title || "Tư Vấn Chế Độ BHXH Tự Nguyện & BHYT Hộ Gia Đình"
          }</h2>
<h3>1. Mở Đầu & Giới Thiệu Cán Bộ Thu</h3>
<p>Giới thiệu Chị Hồ Thị Thắm - Nhân viên thu BHXH, BHYT đại lý bưu điện xã Tiến Thắng, Mê Linh, Hà Nội.</p>
<h3>2. Quy Định Của Luật BHXH & BHYT Hiện Hành</h3>
<ul>
  <li>Quyền lợi BHYT hộ gia đình & Mức giảm trừ đóng BHYT cho các thành viên.</li>
  <li>Chế độ 5 năm liên tục - Hưởng 100% chi phí khám chữa bệnh BHYT.</li>
  <li>BHXH tự nguyện - Mức hỗ trợ từ Ngân sách Nhà nước (30%, 25%, 10%) & Lương hưu trọn đời.</li>
</ul>
<h3>3. Hướng Dẫn Sử Dụng VssID & CCCD Gắn Chip</h3>
<p>KCB nhanh chóng bằng CCCD gắn chip / VssID thay thế thẻ BHYT giấy.</p>
<h3>4. Thông Tin Liên Hệ & Đăng Ký Nhanh</h3>
<p>Bưu điện Văn hóa xã Tự Lập. Hotline/Zalo: 0978 333 963 (Chị Thắm).</p>`,
        });
      } else if (action === "excerpt") {
        return NextResponse.json({
          result: `Đại lý thu BHXH, BHYT Chị Hồ Thị Thắm (xã Tiến Thắng, Mê Linh) tư vấn chi tiết quyền lợi BHYT hộ gia đình, BHXH tự nguyện hưởng lương hưu và hướng dẫn dùng CCCD/VssID. Hotline: 0978 333 963.`,
        });
      } else if (action === "expand") {
        return NextResponse.json({
          result: `<p>Nhằm đảm bảo quyền lợi an sinh tối đa cho bà con nhân dân xã Tiến Thắng, việc tham gia BHYT hộ gia đình và BHXH tự nguyện là giải pháp tài chính bền vững nhất. Khi tham gia BHXH tự nguyện, bà con không chỉ được Ngân sách Nhà nước hỗ trợ tiền đóng hằng tháng mà còn tích lũy thời gian để hưởng <strong>lương hưu trọn đời</strong> và được <strong>cấp thẻ BHYT miễn phí</strong> khi về già. Mọi thắc mắc xin liên hệ trực tiếp Chị Hồ Thị Thắm - <strong>0978 333 963</strong> để được hỗ trợ tận tâm!</p>`,
        });
      }
    }

    let prompt = "";
    if (action === "rewrite" || action === "rewrite_bhxh") {
      prompt = `${persona}
Nhiệm vụ: Hãy VIẾT LẠI TOÀN BỘ nội dung bài viết dưới đây theo đúng giọng văn cán bộ/nhân viên thu BHXH, BHYT chuyên nghiệp, tuân thủ chính xác các quy định của Luật Bảo hiểm xã hội và Luật Bảo hiểm y tế Việt Nam hiện hành.

Tên tiêu đề bài viết: "${title || "Tư Vấn Chế Độ BHXH Tự Nguyện & BHYT Hộ Gia Đình"}"
Nội dung hiện tại (hoặc ý tưởng bài viết):
"${content || title || "Tư vấn chế độ bảo hiểm xã hội tự nguyện và bảo hiểm y tế hộ gia đình"}"

Yêu cầu chi tiết về nội dung & giọng văn:
1. Giọng văn: Trang trọng, chuẩn xác thuật ngữ pháp lý ngành BHXH, chân thành, chu đáo, gần gũi với bà con nông dân và người lao động tự do xã Tiến Thắng.
2. Đảm bảo chính xác theo Luật BHXH & Luật BHYT hiện hành:
   - Phân tích quyền lợi tham gia BHYT đủ 5 năm liên tục (được thanh toán 100% chi phí khám chữa bệnh trong phạm vi quyền lợi khi số tiền cùng chi trả vượt quá 6 tháng lương cơ sở).
   - Mức giảm trừ đóng BHYT hộ gia đình theo từng thành viên (Người 1: 100%, Người 2: 70%, Người 3: 60%, Người 4: 50%, Từ người thứ 5: 40%).
   - Mức hỗ trợ tiền đóng BHXH tự nguyện từ Ngân sách Nhà nước (Hộ nghèo 30%, Cận nghèo 25%, Khác 10%).
   - Phương thức đóng linh hoạt (hằng tháng, 3 tháng, 6 tháng, 12 tháng, đóng 1 lần cho những năm còn thiếu) để tích lũy hưởng lương hưu và BHYT miễn phí khi về già.
   - Hướng dẫn tra cứu VssID - Bảo hiểm xã hội số & sử dụng CCCD gắn chip đi khám bệnh BHYT thay thế thẻ giấy.
   - Địa điểm hỗ trợ & nộp hồ sơ trực tiếp: Điểm Bưu điện Văn hóa xã Tự Lập (thôn Phú Mỹ, xã Tiến Thắng). Hotline / Zalo tư vấn: 0978 333 963 (Chị Thắm).
3. Định dạng đầu ra: Trả về mã HTML thuần túy chuẩn WordPress (dùng <h2>, <h3>, <p>, <ul>, <li>, <strong>, <em>, <blockquote>), không chứa khối mã markdown triple backticks.`;
    } else if (action === "outline") {
      prompt = `${persona}\nHãy tạo dàn ý bài viết chi tiết bằng chuẩn HTML (dùng h2, h3, p, ul, li) bằng tiếng Việt cho tiêu đề: "${title}". Từ khóa: ${
        keywords || "không có"
      }. Không kèm mã markdown triple backticks.`;
    } else if (action === "excerpt") {
      prompt = `${persona}\nHãy viết đoạn mô tả ngắn (Excerpt/Meta description) chuẩn SEO dưới 160 ký tự bằng tiếng Việt cho bài viết có tiêu đề: "${title}" và nội dung: "${content?.slice(
        0,
        500
      )}".`;
    } else if (action === "expand") {
      prompt = `${persona}\nDựa vào tiêu đề bài viết: "${title}" và đoạn nội dung ngắn: "${content}", hãy viết tiếp một đoạn văn hấp dẫn, đầy đủ chi tiết bằng tiếng Việt dạng thẻ HTML (<p>, <strong>, <em>).`;
    } else {
      prompt = `${persona}\nViết một bài viết hoàn chỉnh chuẩn SEO chuẩn HTML cho tiêu đề: "${title}".`;
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const rawText = response.text
        ? response.text.replace(/```html/g, "").replace(/```/g, "").trim()
        : "";

      return NextResponse.json({
        result: rawText || generateFallbackBHXHRewrite(title || "", content || ""),
      });
    } catch (apiErr: any) {
      console.warn(
        "Gemini API call failed, using fallback BHXH rewrite:",
        apiErr.message
      );
      return NextResponse.json({
        result: generateFallbackBHXHRewrite(title || "", content || ""),
      });
    }
  } catch (err: any) {
    console.error("AI Error:", err);
    return NextResponse.json({
      result: generateFallbackBHXHRewrite(reqBody?.title || "", reqBody?.content || ""),
    });
  }
}