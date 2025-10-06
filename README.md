# RopPhim - Website Xem Phim

Website xem phim được xây dựng với React và Vite, sử dụng API từ KKPhim để cung cấp nội dung phim phong phú.

## ✨ Tính năng

- 🎬 **Giao diện hiện đại**: Thiết kế responsive giống Rophim.mx
- 🔍 **Tìm kiếm thông minh**: Tìm kiếm phim theo tên, thể loại, quốc gia, năm
- 🏷️ **Lọc nâng cao**: Lọc phim theo thể loại, quốc gia, năm phát hành
- 📱 **Responsive**: Tối ưu cho mọi thiết bị
- 🎥 **Xem phim**: Xem phim trực tiếp với video player tích hợp
- 📄 **Phân trang**: Hỗ trợ phân trang cho danh sách phim
- ⚡ **Tốc độ cao**: Sử dụng Vite để build nhanh chóng

## 🚀 Cài đặt

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd movie-trailer1-master
   ```

2. **Cài đặt dependencies**
   ```bash
   npm install
   ```

3. **Chạy development server**
   ```bash
   npm run dev
   ```

4. **Build cho production**
   ```bash
   npm run build
   ```

## 🛠️ Công nghệ sử dụng

- **React 18** - UI Framework
- **Vite** - Build tool nhanh chóng
- **Tailwind CSS** - Styling framework
- **React Modal** - Modal components
- **React Multi Carousel** - Carousel components
- **React YouTube** - YouTube player integration

## 📡 API Integration

Website sử dụng [KKPhim API](https://kkphim.vip/tai-lieu-api) để lấy dữ liệu phim:

- **Danh sách phim mới**: `/danh-sach/phim-moi-cap-nhat-v3`
- **Tìm kiếm phim**: `/v1/api/tim-kiem`
- **Chi tiết phim**: `/phim/{slug}`
- **Lọc theo thể loại**: `/v1/api/danh-sach/{type}`
- **Chuyển đổi ảnh**: `/image.php?url={image_url}`

## 🎨 Giao diện

- **Header**: Thanh điều hướng với logo, menu và thanh tìm kiếm
- **Filter Bar**: Bộ lọc theo thể loại, quốc gia, năm
- **Banner**: Phim nổi bật với thông tin chi tiết
- **Movie Grid**: Hiển thị phim dạng lưới với poster và thông tin
- **Modal**: Xem chi tiết phim và video player

## 📱 Responsive Design

- **Mobile**: 2 cột phim
- **Tablet**: 3-4 cột phim  
- **Desktop**: 5-6 cột phim
- **Large Desktop**: 6+ cột phim

## 🔧 Cấu hình

### Environment Variables
Không cần cấu hình API key vì sử dụng API công khai của KKPhim.

### Customization
- Thay đổi màu sắc trong `tailwind.config.js`
- Cập nhật API endpoints trong `src/services/movieApi.js`
- Tùy chỉnh layout trong các component

## 📂 Cấu trúc thư mục

```
src/
├── components/          # React components
│   ├── Banner.jsx      # Banner phim nổi bật
│   ├── Header.jsx      # Header với navigation
│   ├── MovieGrid.jsx   # Grid hiển thị phim
│   ├── MovieList.jsx   # List hiển thị phim (legacy)
│   └── MovieSearch.jsx # Kết quả tìm kiếm
├── context/            # React Context
│   └── MovieDetailContext.jsx # Context cho chi tiết phim
├── services/           # API services
│   └── movieApi.js     # KKPhim API integration
├── assets/             # Static assets
├── App.jsx            # Main App component
├── main.jsx           # Entry point
└── index.css          # Global styles
```

## 🎯 Tính năng chính

### 1. Tìm kiếm và Lọc
- Tìm kiếm phim theo tên
- Lọc theo thể loại (Hành động, Tình cảm, Hài hước, v.v.)
- Lọc theo quốc gia (Trung Quốc, Hàn Quốc, Nhật Bản, v.v.)
- Lọc theo năm phát hành

### 2. Hiển thị Phim
- Grid layout responsive
- Poster phim với hover effects
- Thông tin phim (tên, năm, đánh giá, tập phim)
- Badge chất lượng (HD, FHD, 4K)

### 3. Xem Phim
- Modal xem chi tiết phim
- Video player tích hợp
- Danh sách tập phim
- Thông tin chi tiết phim

## 🚀 Deployment

### Vercel
```bash
npm run build
# Upload dist/ folder to Vercel
```

### Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

### GitHub Pages
```bash
npm run build
# Push dist/ folder to gh-pages branch
```

## 📄 License

MIT License - Xem file LICENSE để biết thêm chi tiết.

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📞 Support

Nếu gặp vấn đề, vui lòng tạo issue trên GitHub repository.

---

**Lưu ý**: Website này chỉ sử dụng cho mục đích học tập và demo. Vui lòng tuân thủ các quy định về bản quyền khi sử dụng.
