import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Heart,
  Eye,
  Share2,
  Calendar,
  MapPin,
  Clock,
  Film,
  Check
} from 'lucide-react';
import { PROJECTS } from '../data/projects';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Episode } from '../types';
import {
  subscribeToProjectLikes,
  toggleProjectLikeInFirestore
} from '../services/db';
import CommentsSection from '../components/CommentsSection';

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const { user, setAuthModalOpen } = useAuth();

  const project = PROJECTS.find((p) => p.id === id) || PROJECTS[0];

  const [activeEpisode, setActiveEpisode] = useState<Episode>(project.episodes[0]);
  const [likesCount, setLikesCount] = useState<number>(project.likes || 388);
  const [hasLiked, setHasLiked] = useState<boolean>(() => {
    return localStorage.getItem(`has_liked_${project.id}`) === 'true';
  });
  const [copiedShare, setCopiedShare] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Subscribe to real-time project likes from Firestore
  useEffect(() => {
    const unsubscribeLikes = subscribeToProjectLikes(project.id, (dbLikesCount, userIds) => {
      if (dbLikesCount > 0) {
        setLikesCount((project.likes || 388) + dbLikesCount);
      }
      if (user && userIds.includes(user.id)) {
        setHasLiked(true);
      }
    });

    return () => unsubscribeLikes();
  }, [project.id, user]);

  const handleLikeProject = async () => {
    const nextState = !hasLiked;
    setHasLiked(nextState);
    setLikesCount((prev) => (nextState ? prev + 1 : Math.max(0, prev - 1)));
    localStorage.setItem(`has_liked_${project.id}`, String(nextState));

    const uid = user?.id || 'guest_' + (localStorage.getItem('guest_uid') || Math.random().toString(36).slice(2));
    localStorage.setItem('guest_uid', uid);

    try {
      await toggleProjectLikeInFirestore(project.id, uid, !nextState);
    } catch (e) {
      console.warn('Syncing like to DB:', e);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pt-24 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        {/* Top Breadcrumb Back Navigation */}
        <div className="mb-8">
          <Link
            to="/#projects"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-studio-gold transition-colors py-2 px-4 rounded-full bg-white/5 border border-white/10"
          >
            <ArrowLeft size={14} /> Quay lại danh mục dự án
          </Link>
        </div>

        {/* Main Video & Episode Player Section */}
        <div className="mb-12">
          <div className="relative aspect-video w-full rounded-2xl md:rounded-3xl overflow-hidden border border-white/15 bg-black shadow-2xl">
            {activeEpisode?.videoUrl && !activeEpisode.isPlaceholder ? (
              <iframe
                src={activeEpisode.videoUrl}
                title={activeEpisode.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center relative p-6 text-center">
                <img
                  src={project.mainImage}
                  alt={project.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-20 filter blur-sm"
                />
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-full bg-studio-red/20 border border-studio-red/50 flex items-center justify-center mx-auto mb-4 text-studio-gold">
                    <Clock size={28} />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold uppercase tracking-wide mb-2">
                    {activeEpisode.title}
                  </h3>
                  <p className="text-neutral-400 text-sm max-w-md">
                    Tập phim đang trong giai đoạn hậu kỳ và sẽ sớm được phát sóng chính thức!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Episode Selectors */}
          <div className="mt-6 flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-500 whitespace-nowrap mr-2">
              Danh sách tập:
            </span>
            {project.episodes.map((ep) => {
              const isActive = activeEpisode.id === ep.id;
              return (
                <button
                  key={ep.id}
                  onClick={() => setActiveEpisode(ep)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 border transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-studio-red text-white border-studio-red shadow-lg shadow-studio-red/25'
                      : 'bg-white/5 text-neutral-400 border-white/10 hover:border-white/30 hover:text-white'
                  }`}
                >
                  <Film size={14} />
                  <span>{ep.title}</span>
                  {ep.duration && (
                    <span className="text-[10px] opacity-75 font-normal">({ep.duration})</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Project Header Bar: Title, Tags, Action Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-16 pb-12 border-b border-white/10">
          <div className="lg:col-span-8">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-studio-gold text-xs font-bold tracking-[0.3em] uppercase">
                {project.category}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
              <span className="text-white/40 text-xs font-semibold">{project.year}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white mb-6">
              {project.title}
            </h1>

            {/* Story Text */}
            <div className="text-neutral-300 text-sm md:text-base leading-relaxed space-y-4 whitespace-pre-line font-light border-l-2 border-studio-wine pl-6">
              {activeEpisode.description || project.description}
            </div>

            {/* Tags */}
            <div className="mt-8 flex flex-wrap gap-2">
              {project.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-neutral-300 font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right Column: Project Metadata Card & Actions */}
          <div className="lg:col-span-4">
            <div className="glass-card p-6 md:p-8 rounded-3xl border-white/10 space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-studio-gold">
                {t.projects?.modal?.info || 'Thông tin dự án'}
              </h3>

              <div className="space-y-4 text-sm">
                <div className="flex items-center justify-between pb-3 border-b border-white/5">
                  <span className="text-neutral-500 flex items-center gap-2">
                    <Calendar size={14} /> {t.projects?.modal?.year || 'Năm'}
                  </span>
                  <span className="font-semibold text-white">{project.year}</span>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-white/5">
                  <span className="text-neutral-500 flex items-center gap-2">
                    <MapPin size={14} /> {t.projects?.modal?.location || 'Vị trí'}
                  </span>
                  <span className="font-semibold text-white">
                    {t.projects?.modal?.vn || 'Việt Nam'}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-white/5">
                  <span className="text-neutral-500 flex items-center gap-2">
                    <Eye size={14} /> Lượt xem
                  </span>
                  <span className="font-semibold text-white">
                    {(project.views || 1420) + (hasLiked ? 1 : 0)}
                  </span>
                </div>
              </div>

              {/* Action Buttons: Like & Share */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleLikeProject}
                  className={`py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    hasLiked
                      ? 'bg-studio-red text-white shadow-lg shadow-studio-red/30'
                      : 'bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10'
                  }`}
                >
                  <Heart size={16} className={hasLiked ? 'fill-white' : ''} />
                  <span>{likesCount} Thích</span>
                </button>

                <button
                  onClick={handleShare}
                  className="py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10 transition-all cursor-pointer"
                >
                  {copiedShare ? (
                    <>
                      <Check size={16} className="text-emerald-400" />
                      <span className="text-emerald-400">Đã chép</span>
                    </>
                  ) : (
                    <>
                      <Share2 size={16} />
                      <span>Chia sẻ</span>
                    </>
                  )}
                </button>
              </div>

              {/* CTA Contact link */}
              <Link
                to="/#contact"
                className="block w-full py-3.5 text-center bg-studio-red hover:bg-studio-wine text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-studio-red/20"
              >
                {t.projects?.modal?.cta || 'Liên hệ với 3COVANGOC STUDIO'}
              </Link>
            </div>
          </div>
        </div>

        {/* Comments & Community Discussion Section */}
        <CommentsSection
          projectId={project.id}
          user={user}
          setAuthModalOpen={setAuthModalOpen}
        />

      </div>
    </div>
  );
}
