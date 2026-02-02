// Types cho Homepage Services - Dịch vụ trang chủ
export interface HomepageService {
    id: string;
    title: string;           // Tiêu đề dịch vụ (VD: "Cẩu tự hành")
    description: string;     // Mô tả dịch vụ
    color: string;           // Màu border (hex color, VD: "#5f7ab8")
    order: number;           // Thứ tự hiển thị
    enabled: boolean;        // Bật/tắt hiển thị
}
