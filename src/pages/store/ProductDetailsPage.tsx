import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useProducts, useIncrementViews, useIncrementOrderClicks } from '@/hooks/useProducts';
import { useSettings } from '@/hooks/useSettings';
import { useLanguage } from '@/i18n/LanguageContext';
import StoreHeader from '@/components/store/StoreHeader';
import StoreFooter from '@/components/store/StoreFooter';
import placeholderImg from '@/assets/perfume-placeholder.jpg';

const ProductDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: products = [] } = useProducts();
  const { data: settings } = useSettings();
  const { t, isRTL } = useLanguage();
  const incrementViews = useIncrementViews();
  const incrementClicks = useIncrementOrderClicks();
  const product = products.find((p) => p.id === id);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (id) incrementViews.mutate(id);
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-3xl text-foreground mb-4">{t('productNotFound')}</h1>
          <Link to="/products" className="text-primary font-body hover:underline">{t('backToCollection')}</Link>
        </div>
      </div>
    );
  }

  const images = product.images.length > 0 ? product.images : [placeholderImg];

  const handleWhatsApp = () => {
    if (!settings) return;
    incrementClicks.mutate(product.id);
    const message = settings.whatsapp_template
      .replace('{product_name}', product.name)
      .replace('{price}', `${product.price} ${t('currency')}`)
      .replace('{product_id}', product.id);
    window.open(`https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const nextImage = () => setSelectedImage((prev) => (prev + 1) % images.length);
  const prevImage = () => setSelectedImage((prev) => (prev - 1 + images.length) % images.length);

  const noteSection = (title: string, notes: string[], color: string) => (
    <div>
      <h4 className="font-heading text-lg text-foreground mb-2">{title}</h4>
      <div className="flex flex-wrap gap-2">
        {notes.map((note) => (
          <span key={note} className={`px-3 py-1 rounded-full text-xs font-body border ${color}`}>{note}</span>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader />
      <div className="pt-24 pb-16 container mx-auto px-4">
        <Link to="/products" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-body text-sm mb-8">
          {isRTL ? <ChevronRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />} {t('backToCollection')}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div initial={{ opacity: 0, x: isRTL ? 30 : -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <div className="relative aspect-square rounded-xl overflow-hidden bg-card border border-border mb-4">
              <img src={images[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
              {images.length > 1 && (
                <>
                  <button onClick={prevImage} className="absolute start-3 top-1/2 -translate-y-1/2 bg-background/70 backdrop-blur-sm p-2 rounded-full hover:bg-background transition-colors">
                    {isRTL ? <ChevronRight className="w-5 h-5 text-foreground" /> : <ChevronLeft className="w-5 h-5 text-foreground" />}
                  </button>
                  <button onClick={nextImage} className="absolute end-3 top-1/2 -translate-y-1/2 bg-background/70 backdrop-blur-sm p-2 rounded-full hover:bg-background transition-colors">
                    {isRTL ? <ChevronLeft className="w-5 h-5 text-foreground" /> : <ChevronRight className="w-5 h-5 text-foreground" />}
                  </button>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${i === selectedImage ? 'border-primary shadow-gold' : 'border-border opacity-60 hover:opacity-100'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, x: isRTL ? -30 : 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.15 }}>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-muted-foreground font-body text-sm capitalize">{product.category}</span>
              {product.badge && (
                <span className="bg-gold-gradient text-primary-foreground px-3 py-0.5 rounded-full text-xs font-body font-semibold capitalize">
                  {t(product.badge as any)}
                </span>
              )}
            </div>
            <h1 className="font-heading text-4xl text-foreground mb-3">{product.name}</h1>
            <p className="text-primary font-heading text-3xl mb-6">{product.price} {t('currency')}</p>
            <p className="text-muted-foreground font-body leading-relaxed mb-4">{product.description}</p>
            <p className="text-muted-foreground/70 font-body text-sm mb-8">{t('size')}: {product.size}</p>

            <button onClick={handleWhatsApp}
              className="w-full bg-gold-gradient text-primary-foreground py-4 rounded-xl font-body font-semibold text-lg flex items-center justify-center gap-3 hover:shadow-gold-lg transition-all duration-300 hover:scale-[1.02] mb-10">
              <MessageCircle className="w-5 h-5" />
              {t('orderViaWhatsApp')}
            </button>

            <div className="bg-card border border-border rounded-xl p-6 space-y-6">
              <h3 className="font-heading text-2xl text-gradient-gold">{t('fragranceNotes')}</h3>
              {noteSection(t('topNotes'), product.top_notes, 'border-primary/40 text-primary')}
              {noteSection(t('middleNotes'), product.middle_notes, 'border-muted-foreground/30 text-muted-foreground')}
              {noteSection(t('baseNotes'), product.base_notes, 'border-border text-muted-foreground/80')}
            </div>
          </motion.div>
        </div>
      </div>
      <StoreFooter />
    </div>
  );
};

export default ProductDetailsPage;
