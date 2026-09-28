import { Link, useLocation, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Home, ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

// Map route segments → display labels
const routeLabels: Record<string, string> = {
  brand: 'Thương Hiệu',
  profile: 'Hồ Sơ',
  project: 'Dự Án',
};

function useBreadcrumbs(): BreadcrumbItem[] {
  const location = useLocation();
  const params = useParams<{ id?: string }>();

  const pathname = location.pathname;

  // Trang chủ → không có breadcrumb
  if (pathname === '/') return [];

  const crumbs: BreadcrumbItem[] = [
    { label: 'Trang Chủ', href: '/', icon: <Home size={13} /> },
  ];

  const segments = pathname.split('/').filter(Boolean);

  segments.forEach((seg, idx) => {
    const isLast = idx === segments.length - 1;
    const href = '/' + segments.slice(0, idx + 1).join('/');

    // Nếu segment là param id (project/:id) → dùng label tên dự án
    if (params.id && seg === params.id) {
      crumbs.push({
        label: decodeURIComponent(seg).replace(/-/g, ' '),
        href: isLast ? undefined : href,
      });
      return;
    }

    const label = routeLabels[seg] ?? seg.charAt(0).toUpperCase() + seg.slice(1);
    crumbs.push({ label, href: isLast ? undefined : href });
  });

  return crumbs;
}

export default function Breadcrumb() {
  const crumbs = useBreadcrumbs();
  const location = useLocation();

  // Không render ở trang chủ
  if (crumbs.length === 0) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
        className="fixed top-[96px] md:top-[104px] left-0 w-full z-40 bg-[#0A0A0A]/85 backdrop-blur-md"
      >
        {/* Thin top border line accent */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />

        <div className="container mx-auto px-6">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] overflow-x-auto scrollbar-none"
          >
            {crumbs.map((crumb, idx) => {
              const isLast = idx === crumbs.length - 1;

              return (
                <motion.span
                  key={idx}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: idx * 0.07 }}
                  className="flex items-center gap-1.5 shrink-0"
                >
                  {/* Separator (not before first item) */}
                  {idx > 0 && (
                    <ChevronRight
                      size={12}
                      className="text-white/20 shrink-0"
                    />
                  )}

                  {isLast ? (
                    /* Current page — not a link */
                    <span className="flex items-center gap-1.5 text-studio-gold">
                      {crumb.icon && (
                        <span className="opacity-70">{crumb.icon}</span>
                      )}
                      {crumb.label}
                      {/* Active dot indicator */}
                      <span className="w-1 h-1 rounded-full bg-studio-gold inline-block ml-0.5" />
                    </span>
                  ) : (
                    /* Parent page — clickable link */
                    <Link
                      to={crumb.href ?? '/'}
                      className="flex items-center gap-1.5 text-white/40 hover:text-white/80 transition-colors duration-200 group"
                    >
                      {crumb.icon && (
                        <span className="group-hover:text-studio-gold transition-colors duration-200">
                          {crumb.icon}
                        </span>
                      )}
                      <span className="group-hover:underline underline-offset-2 decoration-white/20">
                        {crumb.label}
                      </span>
                    </Link>
                  )}
                </motion.span>
              );
            })}
          </nav>
        </div>

        {/* Bottom separator line */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      </motion.div>
    </AnimatePresence>
  );
}
