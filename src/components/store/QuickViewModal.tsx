import { useState } from 'react';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@/types';
import { useStore } from '@/store/useStore';
import placeholderImg from '@/assets/perfume-placeholder.jpg';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

const QuickViewModal = ({ product, onClose }: QuickViewModalProps) => {
  const { settings, incrementOrderClicks } = useStore();

  if (!product) return null;

  const image = product.images.length > 0 ? product.images[0] : placeholderImg;

  const handleWhatsApp = () => {
    incrementOrderClicks(product.id);
    const message = settings.whatsappTemplate
      .replace('{product_name}', product.name)
      .replace('{price}', `$${product.price}`)
      .replace('{product_id}', product.id);
    const url = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-card border border-border rounded-xl max-w-2xl w-full overflow-hidden shadow-gold-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2">
              <img src={image} alt={product.name} className="w-full h-64 md:h-full object-cover" />
            </div>
            <div className="md:w-1/2 p-6 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="font-heading text-2xl text-foreground">{product.name}</h2>
                  <p className="text-muted-foreground text-sm">{product.size} · {product.category}</p>
                </div>
                <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-muted-foreground text-sm flex-1 line-clamp-3 mb-4">{product.description}</p>
              <p className="text-primary font-heading text-3xl mb-6">${product.price}</p>
              <div className="flex gap-3">
                <button
                  onClick={handleWhatsApp}
                  className="flex-1 bg-gold-gradient text-primary-foreground py-3 rounded-lg font-body font-medium text-sm hover:shadow-gold transition-all"
                >
                  Order via WhatsApp
                </button>
                <Link
                  to={`/product/${product.id}`}
                  onClick={onClose}
                  className="flex-1 border border-primary text-primary py-3 rounded-lg font-body font-medium text-sm text-center hover:bg-primary hover:text-primary-foreground transition-all"
                >
                  Full Details
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default QuickViewModal;
