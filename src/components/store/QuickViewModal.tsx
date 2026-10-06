import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import type { Product } from '@/hooks/useProducts';
import { useLanguage } from '@/i18n/LanguageContext';
import { useCartStore } from '@/store/useCartStore';
import { dishDesc, dishName, getSizes } from '@/lib/food';
import SizePicker from './SizePicker';
import placeholder from '@/assets/perfume-placeholder.jpg';

const QuickViewModal = ({ product, onClose }: { product: Product | null; onClose: () => void }) => {
  const { t, lang } = useLanguage();
  const addItem = useCartStore((s) => s.addItem);
  const [sizeIdx, setSizeIdx] = useState(0);
  useEffect(() => setSizeIdx(0), [product?.id]);

  return (
    <AnimatePresence>
      {product && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
          <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" />
          <motion.div initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-card w-full sm:max-w-3xl max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl grid sm:grid-cols-2">
            <button onClick={onClose} className="absolute top-3 end-3 z-10 w-9 h-9 rounded-full bg-card/90 flex items-center justify-center"><X className="w-4 h-4" /></button>
            <img src={product.images[0] || placeholder} alt={dishName(product, lang)} className="w-full aspect-square sm:h-full object-cover" />
            <div className="p-5 sm:p-7 flex flex-col gap-4">
              <h2 className="font-heading text-3xl">{dishName(product, lang)}</h2>
              {product.prep_time && <p className="flex items-center gap-1.5 text-sm text-muted-foreground"><Clock className="w-4 h-4" />{t('prepTime')}: {product.prep_time}</p>}
              <p className="text-muted-foreground text-sm leading-relaxed">{dishDesc(product, lang)}</p>
              <SizePicker sizes={getSizes(product)} value={sizeIdx} onChange={setSizeIdx} />
              <div className="mt-auto flex flex-col gap-2">
                <button onClick={() => { const s = getSizes(product)[sizeIdx]; addItem(product, s.name, s.price); toast.success(t('addedToCart')); onClose(); }}
                  className="bg-gold-gradient text-primary-foreground py-3 rounded-full font-semibold flex items-center justify-center gap-2 hover:shadow-gold-lg transition-all">
                  <ShoppingBag className="w-4 h-4" /> {t('addToCart')}
                </button>
                <Link to={`/product/${product.id}`} onClick={onClose} className="text-center text-sm text-primary py-2">{t('fullDetails')}</Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QuickViewModal;
