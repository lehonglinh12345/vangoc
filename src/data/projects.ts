import { Project } from '../types';

export const PROJECTS: Project[] = [
  {
    id: 'project-1',
    title: 'NHÀ CÓ GIỖ',
    category: 'Phim Ngắn 3D / Short Film',
    year: '2026',
    description: `“NHÀ CÓ GIỖ” là một bộ phim hoạt hình 3D ngắn kể về Vàng Ngọc – một cô gái trẻ vô tình dần quên đi ý nghĩa thật sự của những ngày giỗ gia tiên. Sau một biến cố bất ngờ, cô nhận ra rằng mâm cơm ngày giỗ không chỉ là nghi thức, mà còn là sợi dây kết nối giữa các thế hệ trong gia đình.

Một câu chuyện vừa hài hước, gần gũi nhưng cũng đầy cảm xúc về gia đình, đám giỗ và những yêu thương đôi khi chưa kịp nói thành lời. 💛`,
    mainImage: '/images/input_file_1.png',
    gallery: [
      '/images/input_file_1.png',
      '/images/input_file_0.png',
      '/images/input_file_2.png'
    ],
    color: 'bg-studio-red',
    tags: ['3D Animation', 'Short Film', 'Family', 'Vietnamese Culture'],
    views: 206999,
    likes: 5700,
    episodes: [
      {
        id: 'nhacogio-ep1',
        title: 'Nhà Có Giỗ (Bản chính thức)',
        duration: '10:24',
        videoUrl: 'https://www.youtube.com/embed/TM142-7LiiQ?autoplay=1',
        thumbnail: 'https://img.youtube.com/vi/TM142-7LiiQ/maxresdefault.jpg',
        views: '207 N',
        date: '10 thg 5, 2026'
      }
    ]
  },
  {
    id: 'project-2',
    title: 'RỰC SÁNG ĐÊM THU',
    category: 'Phim Ngắn 3D / Animated Short Film',
    year: '2026',
    description: `🎬 OFFICIAL POSTER | RỰC SÁNG ĐÊM THU 🌕
Trung Thu năm nay, mời nhà mình cùng Vàng Ngọc bước vào một hành trình thật rực rỡ để tìm lại những ký ức thân quen về gia đình, tuổi thơ và những điều được truyền từ thế hệ này sang thế hệ khác 🏮✨

Còn chuyện gì đang chờ Vàng Ngọc trong đêm thu này? Hẹn nhà mình cùng khám phá trong “Rực Sáng Đêm Thu” nhé!`,
    mainImage: 'https://img.youtube.com/vi/ENcG_Q9zgH0/maxresdefault.jpg',
    gallery: [
      'https://img.youtube.com/vi/ENcG_Q9zgH0/maxresdefault.jpg'
    ],
    color: 'bg-studio-gold',
    tags: ['3D Animation', 'Short Film', 'Mid-Autumn Festival', 'Trung Thu'],
    views: 52735,
    likes: 955,
    episodes: [
      {
        id: 'rucsangdemthu-ep1',
        title: 'Rực Sáng Đêm Thu (Bản chính thức)',
        duration: '8:52',
        videoUrl: 'https://www.youtube.com/embed/ENcG_Q9zgH0?autoplay=1',
        thumbnail: 'https://img.youtube.com/vi/ENcG_Q9zgH0/maxresdefault.jpg',
        views: '52,7 N',
        date: '21 thg 9, 2026'
      }
    ]
  }
];
