import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Leaf, TreePine } from 'lucide-react';
import { useStore } from '@/store/useStore';
import StoreHeader from '@/components/store/StoreHeader';
import StoreFooter from '@/components/store/StoreFooter';
import ProductCard from '@/components/store/ProductCard';
import QuickViewModal from '@/components/store/QuickViewModal';
import { Product } from '@/types';
import heroImg from '@/assets/hero-perfume.jpg';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const LandingPage = () => {
  const { products, settings } = useStore();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const featured = products.filter((p) => p.badge === 'new' || p.badge === 'limited').slice(0, 3);
  const bestSellers = products.filter((p) => p.badge === 'best_seller').slice(0, 3);

  const categories = [
    { name: 'Fresh', icon: Leaf, desc: 'Crisp citrus and aquatic notes' },
    { name: 'Sweet', icon: Sparkles, desc: 'Rich florals and warm vanilla' },
    { name: 'Woody', icon: TreePine, desc: 'Deep oud and sandalwood' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader />

      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <img src={heroImg} alt="Luxury perfumes" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative text-center px-4 max-w-3xl"
        >
          <h1 className="font-heading text-5xl md:text-7xl text-gradient-gold mb-4 leading-tight">
            {settings.brandName}
          </h1>
          <p className="text-muted-foreground font-body text-lg md:text-xl mb-8 tracking-wide">
            {settings.tagline}
          </p>
          <Link
            to="/products"
            className="inline-block bg-gold-gradient text-primary-foreground px-10 py-4 rounded-full font-body font-semibold tracking-wider hover:shadow-gold-lg transition-all duration-300 hover:scale-105"
          >
            Explore Collection
          </Link>
        </motion.div>
      </section>

      {/* Featured */}
      <section className="py-24 container mx-auto px-4">
        <motion.div {...fadeUp} className="text-center mb-16">
          <h2 className="font-heading text-4xl text-gradient-gold mb-3">Featured Collection</h2>
          <p className="text-muted-foreground font-body">Discover our latest and most exclusive fragrances</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} onQuickView={setQuickViewProduct} />
          ))}
        </div>
      </section>

      {/* Best Sellers */}
      {bestSellers.length > 0 && (
        <section className="py-24 bg-card">
          <div className="container mx-auto px-4">
            <motion.div {...fadeUp} className="text-center mb-16">
              <h2 className="font-heading text-4xl text-gradient-gold mb-3">Best Sellers</h2>
              <p className="text-muted-foreground font-body">Our most loved fragrances</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {bestSellers.map((p) => (
                <ProductCard key={p.id} product={p} onQuickView={setQuickViewProduct} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="py-24 container mx-auto px-4">
        <motion.div {...fadeUp} className="text-center mb-16">
          <h2 className="font-heading text-4xl text-gradient-gold mb-3">Fragrance Families</h2>
          <p className="text-muted-foreground font-body">Find your signature scent</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <Link
                to={`/products?category=${cat.name.toLowerCase()}`}
                className="block bg-card border border-border rounded-xl p-10 text-center hover:border-primary/40 hover:shadow-gold transition-all duration-500 group"
              >
                <cat.icon className="w-10 h-10 mx-auto mb-4 text-primary group-hover:scale-110 transition-transform" />
                <h3 className="font-heading text-2xl text-foreground mb-2">{cat.name}</h3>
                <p className="text-muted-foreground text-sm font-body">{cat.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* About */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <motion.div {...fadeUp}>
            <h2 className="font-heading text-4xl text-gradient-gold mb-6">About the Brand</h2>
            <p className="text-muted-foreground font-body leading-relaxed text-lg">
              {settings.aboutText}
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
