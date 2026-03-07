import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Globe, Menu, X } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import { useLanguage } from '@/i18n/LanguageContext';

const StoreHeader = () => {
  const { data: settings } = useSettings();
  const { lang, setLang, t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 min-w-0">
          {settings?.logo_url && (
            <img src={settings.logo_url} alt={settings.brand_name} className="h-8 w-8 object-contain flex-shrink-0" />
          )}
          <span className="font-heading text-lg sm:text-xl tracking-widest text-gradient-gold truncate">
            {settings?.brand_name || 'MAISON ÉLÉGANCE'}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-body text-muted-foreground hover:text-primary transition-colors tracking-wide">
            {t('home')}
          </Link>
          <Link to="/products" className="text-sm font-body text-muted-foreground hover:text-primary transition-colors tracking-wide">
            {t('collection')}
          </Link>
          <button
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            className="flex items-center gap-1.5 text-sm font-body text-muted-foreground hover:text-primary transition-colors px-3 py-1.5 rounded-full border border-border hover:border-primary/40"
          >
            <Globe className="w-4 h-4" />
            {lang === 'en' ? 'عربي' : 'EN'}
          </button>
        </nav>

        {/* Mobile hamburger */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-muted-foreground hover:text-foreground">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-card border-t border-border px-4 py-4 space-y-3">
          <Link to="/" onClick={() => setMobileOpen(false)} className="block text-sm font-body text-muted-foreground hover:text-primary transition-colors py-2">
            {t('home')}
          </Link>
          <Link to="/products" onClick={() => setMobileOpen(false)} className="block text-sm font-body text-muted-foreground hover:text-primary transition-colors py-2">
            {t('collection')}
          </Link>
          <button
            onClick={() => { setLang(lang === 'en' ? 'ar' : 'en'); setMobileOpen(false); }}
            className="flex items-center gap-1.5 text-sm font-body text-muted-foreground hover:text-primary transition-colors py-2"
          >
            <Globe className="w-4 h-4" />
            {lang === 'en' ? 'عربي' : 'EN'}
          </button>
        </div>
      )}
    </header>
  );
};

export default StoreHeader;
