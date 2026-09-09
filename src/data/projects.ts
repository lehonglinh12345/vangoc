import { Project } from '../types';

export const PROJECTS: Project[] = [
  {
    id: 'project-1',
    title: 'NHÀ CÓ GIỖ',
    category: 'Phim Ngắn / 3D Branding',
    year: '2026',
    description: `NHÀ CÓ GIỖ – Phim hoạt hình 3D ngắn chính thức ra mắt!

Sau khoảng thời gian thực hiện và hoàn thiện, chúng tôi rất vui khi được mang bộ phim đến với mọi người trên YouTube và FanPage chính thức. 💛

Một câu chuyện vừa hài hước, gần gũi nhưng cũng đầy cảm xúc về gia đình, đám giỗ và những yêu thương đôi khi chưa kịp nói thành lời.`,
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
        title: 'Tập 2: (Sắp ra mắt)',
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
