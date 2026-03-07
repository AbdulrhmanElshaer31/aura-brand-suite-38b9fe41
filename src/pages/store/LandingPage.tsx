import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Leaf, TreePine } from 'lucide-react';
import { useProducts, type Product } from '@/hooks/useProducts';
import { useSettings } from '@/hooks/useSettings';
import { useLanguage } from '@/i18n/LanguageContext';
import StoreHeader from '@/components/store/StoreHeader';
import StoreFooter from '@/components/store/StoreFooter';
import ProductCard from '@/components/store/ProductCard';
import QuickViewModal from '@/components/store/QuickViewModal';
import heroImg from '@/assets/hero-perfume.jpg';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const LandingPage = () => {
  const { data: products = [] } = useProducts();
  const { data: settings } = useSettings();
  const { t } = useLanguage();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const available = products.filter((p) => p.status === 'available');
  const featured = available.filter((p) => p.badge === 'new' || p.badge === 'limited').slice(0, 3);
  const bestSellers = available.filter((p) => p.badge === 'best_seller').slice(0, 3);

  const categories = [
    { key: 'fresh' as const, icon: Leaf },
    { key: 'sweet' as const, icon: Sparkles },
    { key: 'woody' as const, icon: TreePine },
  ];

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader />

      {/* Hero */}
      <section className="relative h-[80vh] sm:h-screen flex items-center justify-center overflow-hidden">
        <img src={heroImg} alt="Luxury perfumes" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }} className="relative text-center px-4 max-w-3xl">
          <h1 className="font-heading text-4xl sm:text-5xl md:text-7xl text-gradient-gold mb-4 leading-tight">
            {settings?.brand_name || 'MAISON ÉLÉGANCE'}
          </h1>
          <p className="text-muted-foreground font-body text-base sm:text-lg md:text-xl mb-6 sm:mb-8 tracking-wide">
            {settings?.tagline}
          </p>
          <Link to="/products" className="inline-block bg-gold-gradient text-primary-foreground px-8 sm:px-10 py-3 sm:py-4 rounded-full font-body font-semibold tracking-wider hover:shadow-gold-lg transition-all duration-300 hover:scale-105 text-sm sm:text-base">
            {t('exploreCollection')}
          </Link>
        </motion.div>
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="py-16 sm:py-24 container mx-auto px-4">
          <motion.div {...fadeUp} className="text-center mb-10 sm:mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl text-gradient-gold mb-3">{t('featuredCollection')}</h2>
            <p className="text-muted-foreground font-body text-sm sm:text-base">{t('featuredDesc')}</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} onQuickView={setQuickViewProduct} />
            ))}
          </div>
        </section>
      )}

      {/* Best Sellers */}
      {bestSellers.length > 0 && (
        <section className="py-16 sm:py-24 bg-card">
          <div className="container mx-auto px-4">
            <motion.div {...fadeUp} className="text-center mb-10 sm:mb-16">
              <h2 className="font-heading text-3xl sm:text-4xl text-gradient-gold mb-3">{t('bestSellers')}</h2>
              <p className="text-muted-foreground font-body text-sm sm:text-base">{t('bestSellersDesc')}</p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
              {bestSellers.map((p) => (
                <ProductCard key={p.id} product={p} onQuickView={setQuickViewProduct} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="py-16 sm:py-24 container mx-auto px-4">
        <motion.div {...fadeUp} className="text-center mb-10 sm:mb-16">
          <h2 className="font-heading text-3xl sm:text-4xl text-gradient-gold mb-3">{t('fragranceFamilies')}</h2>
          <p className="text-muted-foreground font-body text-sm sm:text-base">{t('findSignature')}</p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {categories.map((cat, i) => (
            <motion.div key={cat.key} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.15 }}>
              <Link to={`/products?category=${cat.key}`} className="block bg-card border border-border rounded-xl p-8 sm:p-10 text-center hover:border-primary/40 hover:shadow-gold transition-all duration-500 group">
                <cat.icon className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-4 text-primary group-hover:scale-110 transition-transform" />
                <h3 className="font-heading text-xl sm:text-2xl text-foreground mb-2">{t(cat.key)}</h3>
                <p className="text-muted-foreground text-xs sm:text-sm font-body">{t(`${cat.key}Desc` as any)}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* About */}
      <section className="py-16 sm:py-24 bg-card">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <motion.div {...fadeUp}>
            <h2 className="font-heading text-3xl sm:text-4xl text-gradient-gold mb-6">{t('aboutBrand')}</h2>
            <p className="text-muted-foreground font-body leading-relaxed text-base sm:text-lg">
              {settings?.about_text}
            </p>
          </motion.div>
        </div>
      </section>

      <StoreFooter />
      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  );
};

export default LandingPage;
