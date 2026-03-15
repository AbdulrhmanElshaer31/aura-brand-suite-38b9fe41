import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Globe, Menu, X, ShoppingBag } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import { useLanguage } from '@/i18n/LanguageContext';
import { useCartStore } from '@/store/useCartStore';

const StoreHeader = () => {
  const { data: settings } = useSettings();
  const { lang, setLang, t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const totalItems = useCartStore((s) => s.totalItems());

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
          <Link to="/cart" className="relative text-muted-foreground hover:text-primary transition-colors">
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] font-body font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
          <button
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            className="flex items-center gap-1.5 text-sm font-body text-muted-foreground hover:text-primary transition-colors px-3 py-1.5 rounded-full border border-border hover:border-primary/40"
          >
            <Globe className="w-4 h-4" />
            {lang === 'en' ? 'عربي' : 'EN'}
          </button>
        </nav>

        {/* Mobile right side */}
        <div className="flex md:hidden items-center gap-3">
          <Link to="/cart" className="relative text-muted-foreground hover:text-primary transition-colors">
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] font-body font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 text-muted-foreground hover:text-foreground">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
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
