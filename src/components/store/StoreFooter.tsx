import { useSettings } from '@/hooks/useSettings';
import { useLanguage } from '@/i18n/LanguageContext';

const StoreFooter = () => {
  const { data: settings } = useSettings();
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border py-12 bg-card">
      <div className="container mx-auto px-4 text-center">
        <h3 className="font-heading text-2xl text-gradient-gold mb-2">{settings?.brand_name}</h3>
        <p className="text-muted-foreground text-sm mb-6">{settings?.tagline}</p>
        <p className="text-muted-foreground/60 text-xs">
          © {new Date().getFullYear()} {settings?.brand_name}. {t('allRightsReserved')}
        </p>
      </div>
    </footer>
  );
};

export default StoreFooter;
