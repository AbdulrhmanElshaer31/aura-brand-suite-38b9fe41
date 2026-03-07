import { Link } from 'react-router-dom';
import { useStore } from '@/store/useStore';

const StoreHeader = () => {
  const { settings } = useStore();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          {settings.logoUrl && (
            <img src={settings.logoUrl} alt={settings.brandName} className="h-8 w-8 object-contain" />
          )}
          <span className="font-heading text-xl tracking-widest text-gradient-gold">
            {settings.brandName}
          </span>
        </Link>
        <nav className="flex items-center gap-8">
          <Link to="/" className="text-sm font-body text-muted-foreground hover:text-primary transition-colors tracking-wide">
            Home
          </Link>
          <Link to="/products" className="text-sm font-body text-muted-foreground hover:text-primary transition-colors tracking-wide">
            Collection
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default StoreHeader;
