import { Project } from '../types';

export const PROJECTS: Project[] = [
  {
    id: 'project-1',
    title: 'NHÀ CÓ GIỖ',
    category: 'Phim Ngắn / 3D Branding',
    year: '2026',
    description: `NHÀ CÓ GIỖ – Phim hoạt hình 3D ngắn chính thức ra mắt!

Sau khoảng thời gian thực hiện và hoàn thiện, chúng tôi rất vui khi được mang bộ phim đến với mọi người trên YouTube và FanPage chính thức. 💛

Một câu chuyện vừa hài hước, gần gũi nhưng cũng đầy cảm xúc về gia đình, đám giỗ và những yêu thương đôi khi chưa kịp nói thành lời.

---
🎬 OFFICIAL POSTER | RỰC SÁNG ĐÊM THU 🌕
Trung Thu năm nay, mời nhà mình cùng Vàng Ngọc bước vào một hành trình thật rực rỡ để tìm lại những ký ức thân quen về gia đình, tuổi thơ và những điều được truyền từ thế hệ này sang thế hệ khác 🏮✨
Còn chuyện gì đang chờ Vàng Ngọc trong đêm thu này? Hẹn nhà mình cùng khám phá trong “Rực Sáng Đêm Thu” nhé!

⏰ Chính thức khởi chiếu: 19:00 | 20.09.2026
Trên kênh Youtube 3CoVaNgoc Studio`,
    mainImage: '/images/input_file_1.png',
    gallery: [
      '/images/input_file_1.png',
      '/images/input_file_0.png',
      '/images/input_file_2.png'
    ],
    color: 'bg-studio-red',
    tags: ['3D Animation', 'Creative Direction', 'CGI', 'Visual Storytelling'],
    views: 1420,
    likes: 388,
    episodes: [
      {
        id: 'ep1',
        title: 'Tập 1: Mâm cỗ ngày giỗ',
        duration: '10:24',
        videoUrl: 'https://www.youtube.com/embed/TM142-7LiiQ?autoplay=1',
        thumbnail: 'https://img.youtube.com/vi/TM142-7LiiQ/maxresdefault.jpg'
      },
      {
        id: 'ep2',
        title: 'Tập 2: RỰC SÁNG ĐÊM THU (Sắp khởi chiếu 20.09.2026)',
        isPlaceholder: true
      },
      {
        id: 'ep3',
        title: 'Tập 3: (Sắp ra mắt)',
        isPlaceholder: true
      }
    ]
  }
];
