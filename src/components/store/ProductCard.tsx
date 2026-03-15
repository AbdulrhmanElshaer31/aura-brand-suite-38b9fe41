import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, ShoppingBag } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useCartStore } from '@/store/useCartStore';
import placeholderImg from '@/assets/perfume-placeholder.jpg';
import type { Product } from '@/hooks/useProducts';
import { toast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

const badgeStyles: Record<string, string> = {
  new: 'bg-gold-gradient text-primary-foreground',
  best_seller: 'bg-gold-gradient text-primary-foreground',
  limited: 'bg-destructive text-destructive-foreground',
};

const ProductCard = ({ product, onQuickView }: ProductCardProps) => {
  const { t } = useLanguage();
  const addItem = useCartStore((s) => s.addItem);
  const image = product.images.length > 0 ? product.images[0] : placeholderImg;
  const badgeKey = product.badge as 'new' | 'best_seller' | 'limited' | undefined;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
    toast({ title: t('addedToCart') });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group relative bg-card rounded-lg overflow-hidden border border-border hover:border-primary/30 transition-all duration-500 hover:shadow-gold"
    >
      <div className="relative aspect-square overflow-hidden">
        <img src={image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        {badgeKey && badgeStyles[badgeKey] && (
          <span className={`absolute top-3 ${document.documentElement.dir === 'rtl' ? 'right-3' : 'left-3'} px-3 py-1 text-xs font-body font-semibold rounded-full ${badgeStyles[badgeKey]}`}>
            {t(badgeKey)}
          </span>
        )}
        <div className="absolute inset-0 bg-background/0 group-hover:bg-background/40 transition-all duration-500 flex items-center justify-center gap-2">
          <button
            onClick={(e) => { e.preventDefault(); onQuickView?.(product); }}
            className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 bg-primary text-primary-foreground px-4 py-2.5 rounded-full text-sm font-body font-medium flex items-center gap-2 hover:bg-gold-hover"
          >
            <Eye className="w-4 h-4" />
            {t('quickView')}
          </button>
          <button
            onClick={handleAddToCart}
            className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 delay-75 bg-card text-foreground border border-border px-4 py-2.5 rounded-full text-sm font-body font-medium flex items-center gap-2 hover:border-primary/40"
          >
            <ShoppingBag className="w-4 h-4" />
            {t('addToCart')}
          </button>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-heading text-lg text-foreground mb-1">{product.name}</h3>
        <p className="text-muted-foreground text-sm font-body mb-3">{product.size}</p>
        <div className="flex items-center justify-between">
          <span className="text-primary font-heading text-xl">{product.price} {t('currency')}</span>
          <Link to={`/product/${product.id}`} className="text-sm font-body text-muted-foreground hover:text-primary transition-colors underline underline-offset-4">
            {t('viewDetails')}
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
