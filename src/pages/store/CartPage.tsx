import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Minus, Plus, Trash2, ShoppingBag, MessageCircle } from 'lucide-react';
import StoreHeader from '@/components/store/StoreHeader';
import StoreFooter from '@/components/store/StoreFooter';
import { useCartStore } from '@/store/useCartStore';
import { useSettings } from '@/hooks/useSettings';
import { useIncrementOrderClicks } from '@/hooks/useProducts';
import { buildWhatsAppUrl } from '@/lib/whatsapp';
import { useLanguage } from '@/i18n/LanguageContext';
import placeholderImg from '@/assets/perfume-placeholder.jpg';

const CartPage = () => {
  const { items, removeItem, updateQuantity, clearCart, totalPrice } = useCartStore();
  const { data: settings } = useSettings();
  const incrementClicks = useIncrementOrderClicks();
  const { t } = useLanguage();

  const handleOrder = () => {
    if (!settings || items.length === 0) return;
    // Increment clicks for each product
    items.forEach((item) => incrementClicks.mutate(item.product.id));

    const productLines = items.map((item) =>
      `• ${item.product.name} (${item.product.size}) × ${item.quantity} = ${item.product.price * item.quantity} ${t('currency')}`
    ).join('\n');

    const total = `${totalPrice()} ${t('currency')}`;
    const message = `${t('cartOrderIntro')}\n\n${productLines}\n\n${t('cartTotal')}: ${total}`;
    const url = buildWhatsAppUrl(settings.whatsapp_number, message);
    window.open(url, '_blank');
    clearCart();
  };

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader />
      <div className="pt-20 sm:pt-24 pb-16 container mx-auto px-4 max-w-3xl">
        <h1 className="font-heading text-3xl text-foreground mb-8">{t('cart')}</h1>

        {items.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground font-body mb-6">{t('cartEmpty')}</p>
            <Link to="/products" className="text-primary font-body hover:underline">{t('backToCollection')}</Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => {
              const img = item.product.images.length > 0 ? item.product.images[0] : placeholderImg;
              return (
                <motion.div
                  key={item.product.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-4 bg-card border border-border rounded-xl p-4 items-center"
                >
                  <img src={img} alt={item.product.name} className="w-20 h-20 rounded-lg object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading text-base text-foreground truncate">{item.product.name}</h3>
                    <p className="text-muted-foreground text-xs font-body">{item.product.size}</p>
                    <p className="text-primary font-heading text-lg mt-1">{item.product.price * item.quantity} {t('currency')}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:border-primary/40 transition-colors">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-body text-sm w-6 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:border-primary/40 transition-colors">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <button onClick={() => removeItem(item.product.id)} className="text-muted-foreground hover:text-destructive transition-colors p-2">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              );
            })}

            <div className="border-t border-border pt-6 mt-6">
              <div className="flex justify-between items-center mb-6">
                <span className="font-heading text-xl text-foreground">{t('cartTotal')}</span>
                <span className="font-heading text-2xl text-primary">{totalPrice()} {t('currency')}</span>
              </div>
              <button
                onClick={handleOrder}
                className="w-full bg-gold-gradient text-primary-foreground py-4 rounded-xl font-body font-semibold text-lg flex items-center justify-center gap-3 hover:shadow-gold-lg transition-all duration-300 hover:scale-[1.02]"
              >
                <MessageCircle className="w-5 h-5" />
                {t('orderAllViaWhatsApp')}
              </button>
            </div>
          </div>
        )}
      </div>
      <StoreFooter />
    </div>
  );
};

export default CartPage;
