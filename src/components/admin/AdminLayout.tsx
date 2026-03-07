import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, Settings, LogOut, Globe } from 'lucide-react';
import { useAdminStore } from '@/store/useAdminStore';
import { useSettings } from '@/hooks/useSettings';
import { useLanguage } from '@/i18n/LanguageContext';

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logoutAdmin } = useAdminStore();
  const { data: settings } = useSettings();
  const { t, lang, setLang } = useLanguage();

  const navItems = [
    { path: '/admin/dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { path: '/admin/products', label: t('products'), icon: Package },
    { path: '/admin/settings', label: t('settings'), icon: Settings },
  ];

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-64 bg-card border-e border-border flex flex-col fixed h-full">
        <div className="p-6 border-b border-border">
          <h2 className="font-heading text-lg text-gradient-gold tracking-wider">{settings?.brand_name}</h2>
          <p className="text-muted-foreground text-xs font-body mt-1">{t('adminPanel')}</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-body text-sm transition-all ${location.pathname === item.path ? 'bg-primary/10 text-primary border border-primary/20' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'}`}>
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-border space-y-1">
          <button onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            className="flex items-center gap-3 px-4 py-3 rounded-lg font-body text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-all w-full">
            <Globe className="w-4 h-4" />
            {lang === 'en' ? 'عربي' : 'English'}
          </button>
          <button onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg font-body text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all w-full">
            <LogOut className="w-4 h-4" />
            {t('logout')}
          </button>
        </div>
      </aside>
      <main className="flex-1 ms-64 p-8">{children}</main>
    </div>
  );
};

export default AdminLayout;
