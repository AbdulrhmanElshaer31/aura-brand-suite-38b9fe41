import { Link } from 'react-router-dom';
import { Eye, Clock, Plus } from 'lucide-react';
import { toast } from 'sonner';
import type { Product } from '@/hooks/useProducts';
import { useLanguage } from '@/i18n/LanguageContext';
import { useCartStore } from '@/store/useCartStore';
import { dishName, getSizes, minPrice } from '@/lib/food';
import placeholder from '@/assets/perfume-placeholder.jpg';

interface Props { product: Product; onQuickView?: (p: Product) => void }

const ProductCard = ({ product, onQuickView }: Props) => {
  const { t, lang } = useLanguage();
  const addItem = useCartStore((s) => s.addItem);
  const sizes = getSizes(product);
  const out = product.status !== 'available';

  const quickAdd = () => {
    if (sizes.length > 1 && onQuickView) return onQuickView(product);
    addItem(product, sizes[0].name, sizes[0].price);
    toast.success(t('addedToCart'));
  };

  return (
    <div className="reveal group bg-card rounded-3xl overflow-hidden border border-border hover:shadow-gold-lg hover:-translate-y-1 transition-all duration-500 flex flex-col">
      <div className="relative aspect-square overflow-hidden">
        <img src={product.images[0] || placeholder} alt={dishName(product, lang)} loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        {product.badge && (
          <span className="absolute top-3 start-3 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-bold">
            {t(product.badge as 'new')}
          </span>
        )}
        {out && (
          <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center">
            <span className="bg-card text-foreground px-4 py-1.5 rounded-full text-sm font-semibold">{t('outOfStock')}</span>
          </div>
        )}
        {onQuickView && !out && (
          <button onClick={() => onQuickView(product)} aria-label={t('quickView')}
            className="absolute bottom-3 end-3 w-10 h-10 rounded-full bg-card/90 backdrop-blur text-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            <Eye className="w-4 h-4" />
          </button>
        )}
      </div>
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <h3 className="font-heading text-xl sm:text-2xl text-foreground mb-1 line-clamp-1">{dishName(product, lang)}</h3>
        {product.prep_time && (
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3"><Clock className="w-3.5 h-3.5" />{product.prep_time}</p>
        )}
        <div className="mt-auto flex items-center justify-between gap-2">
          <div>
            {sizes.length > 1 && <span className="block text-[11px] text-muted-foreground">{t('startingFrom')}</span>}
            <span className="text-primary font-bold text-lg">{minPrice(product)} <span className="text-sm">{t('currency')}</span></span>
          </div>
          <div className="flex gap-2">
            <Link to={`/product/${product.id}`} className="px-3 py-2 rounded-full border border-border text-xs sm:text-sm hover:border-primary hover:text-primary transition-colors">
              {t('viewDetails')}
            </Link>
            {!out && (
              <button onClick={quickAdd} aria-label={t('addToCart')} className="w-9 h-9 rounded-full bg-gold-gradient text-primary-foreground flex items-center justify-center hover:scale-110 transition-transform">
                <Plus className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
