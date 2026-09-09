import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Phone, Mail, Facebook, Youtube, CheckCircle2, Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { saveContactInquiry } from '../services/db';

export default function Contact() {
  const { t } = useLanguage();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = (formData.get('name') as string)?.trim();
    const email = (formData.get('email') as string)?.trim();
    const service = (formData.get('service') as string)?.trim();
    const message = (formData.get('message') as string)?.trim();

    if (!name || !email || !message) return;

    setIsSubmitting(true);
    try {
      // Save directly to Firestore database
      await saveContactInquiry({ name, email, service, message });

      setIsSubmitted(true);
      form.reset();
      setTimeout(() => setIsSubmitted(false), 6000);
    } catch (err) {
      console.error('Lỗi khi gửi liên hệ:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderTitle = () => {
    const title = t.contact.title;
    if (title.includes('BẮT ĐẦU')) {
      const parts = title.split('BẮT ĐẦU');
      return (
        <>
          {parts[0]} <br />
          <span className="inline-block px-2 py-1 text-transparent bg-clip-text bg-gradient-to-r from-studio-red to-studio-wine italic font-serif">
            BẮT ĐẦU
          </span>{' '}
          <br />
          {parts[1]}
        </>
      );
    }
    if (title.includes('BEGINS')) {
      const parts = title.split('BEGINS');
      return (
        <>
          {parts[0]} <br />
          <span className="inline-block px-2 py-1 text-transparent bg-clip-text bg-gradient-to-r from-studio-red to-studio-wine italic font-serif">
            BEGINS
          </span>{' '}
          <br />
          {parts[1]}
        </>
      );
    }
    return title;
  };

  return (
    <section id="contact" className="min-h-screen py-24 md:py-32 bg-transparent overflow-hidden flex items-center">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Column: Direct Contact & Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            className="will-change-transform"
          >
            <h2 className="editorial-tag mb-8">
              <span /> {t.contact.tag}
            </h2>

            <h3 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 md:mb-10 leading-[1.05] tracking-tighter text-white">
              {renderTitle()}
            </h3>

            <p className="text-neutral-400 text-sm md:text-base mb-12 max-w-md leading-relaxed border-l-2 border-studio-wine pl-4">
              {t.contact.desc}
            </p>

            <div className="space-y-4 md:space-y-6">
              {/* Phone */}
              <a
                href="tel:0842992493"
                className="flex items-center gap-4 md:gap-6 group cursor-pointer w-fit"
              >
                <div className="w-12 h-12 md:w-14 md:h-14 bg-studio-wine/30 rounded-xl md:rounded-2xl flex items-center justify-center border border-white/5 group-hover:bg-studio-red group-hover:border-studio-red/30 transition-all shrink-0">
                  <Phone size={20} className="text-studio-gold group-hover:text-white" />
                </div>
                <div>
                  <p className="text-white/40 text-[10px] uppercase tracking-widest mb-0.5">
                    {t.contact.phone}
                  </p>
                  <p className="text-base md:text-xl font-bold hover:text-studio-red transition-colors text-white">
                    084 299 2493 (TRÍ BẢO)
                  </p>
                </div>
              </a>

              {/* Email */}
              <a
                href="mailto:3covangocstudio@gmail.com"
                className="flex items-center gap-4 md:gap-6 group cursor-pointer w-fit"
              >
                <div className="w-12 h-12 md:w-14 md:h-14 bg-studio-wine/30 rounded-xl md:rounded-2xl flex items-center justify-center border border-white/5 group-hover:bg-studio-red group-hover:border-studio-red/30 transition-all shrink-0">
                  <Mail size={20} className="text-studio-gold group-hover:text-white" />
                </div>
                <div>
                  <p className="text-white/40 text-[10px] uppercase tracking-widest mb-0.5">
                    {t.contact.email}
                  </p>
                  <p className="text-base md:text-xl font-bold hover:text-studio-red transition-colors text-white">
                    3covangocstudio@gmail.com
                  </p>
                </div>
              </a>

              {/* Social Channels */}
              <div className="pt-4 flex items-center gap-3">
                <a
                  href="https://www.facebook.com/3covangocstudio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-blue-600 transition-colors"
                  title="Facebook"
                >
                  <Facebook size={18} />
                </a>
                <a
                  href="https://www.youtube.com/@3covangocstudio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-red-600 transition-colors"
                  title="YouTube"
                >
                  <Youtube size={18} />
                </a>
                <a
                  href="https://www.tiktok.com/@3covangocstudio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-neutral-800 transition-colors"
                  title="TikTok"
                >
                  <span className="font-bold text-xs">TT</span>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Interactive Inquiry Form */}
          <motion.div
            id="contact-form"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
            className="glass-card p-8 md:p-12 rounded-3xl border-white/10 shadow-2xl relative"
          >
            {isSubmitted && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 flex items-center gap-3">
                <CheckCircle2 size={20} className="shrink-0" />
                <span className="text-xs sm:text-sm font-medium">
                  Cảm ơn bạn! Thông tin của bạn đã được lưu vào hệ thống cơ sở dữ liệu của Studio và sẵn sàng phản hồi.
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-white/60 text-[10px] uppercase font-bold tracking-widest mb-2">
                  {t.contact.form.name}
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder={t.contact.form.placeholderName}
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-studio-red transition-colors"
                />
              </div>

              <div>
                <label className="block text-white/60 text-[10px] uppercase font-bold tracking-widest mb-2">
                  {t.contact.form.email}
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder={t.contact.form.placeholderEmail}
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-studio-red transition-colors"
                />
              </div>

              <div>
                <label className="block text-white/60 text-[10px] uppercase font-bold tracking-widest mb-2">
                  {t.contact.form.service}
                </label>
                <select
                  name="service"
                  className="w-full bg-black/70 border border-white/15 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-studio-red transition-colors"
                >
                  <option value="3D Animation">{t.contact.form.options.animation}</option>
                  <option value="Motion Graphics">{t.contact.form.options.motion}</option>
                  <option value="Branding Design">{t.contact.form.options.branding}</option>
                  <option value="Khác">{t.contact.form.options.other}</option>
                </select>
              </div>

              <div>
                <label className="block text-white/60 text-[10px] uppercase font-bold tracking-widest mb-2">
                  {t.contact.form.message}
                </label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  placeholder={t.contact.form.placeholderMessage}
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-studio-red transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-studio-red disabled:opacity-50 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-studio-wine transition-all shadow-lg shadow-studio-red/30 cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Đang lưu vào database...</span>
                  </>
                ) : (
                  t.contact.form.submit
                )}
              </button>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
