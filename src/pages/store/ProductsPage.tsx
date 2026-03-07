import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useProducts, type Product } from '@/hooks/useProducts';
import { useLanguage } from '@/i18n/LanguageContext';
import StoreHeader from '@/components/store/StoreHeader';
import StoreFooter from '@/components/store/StoreFooter';
import ProductCard from '@/components/store/ProductCard';
import QuickViewModal from '@/components/store/QuickViewModal';
import { motion } from 'framer-motion';

const ProductsPage = () => {
  const { data: products = [] } = useProducts();
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('default');

  const categoryFilter = searchParams.get('category') || 'all';

  const filtered = useMemo(() => {
    let result = products.filter((p) => p.status === 'available');
    if (categoryFilter !== 'all') result = result.filter((p) => p.category === categoryFilter);
    if (search) result = result.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
    if (sort === 'price_asc') result.sort((a, b) => a.price - b.price);
    if (sort === 'price_desc') result.sort((a, b) => b.price - a.price);
    if (sort === 'newest') result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return result;
  }, [products, categoryFilter, search, sort]);

  const setCategory = (cat: string) => {
    if (cat === 'all') { searchParams.delete('category'); } else { searchParams.set('category', cat); }
    setSearchParams(searchParams);
  };

  const categories = ['all', 'fresh', 'sweet', 'woody'] as const;

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader />
      <div className="pt-24 pb-16 container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="font-heading text-4xl text-gradient-gold mb-3">{t('ourCollection')}</h1>
          <p className="text-muted-foreground font-body">{t('exploreDesc')}</p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-4 mb-10 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="text" placeholder={t('searchFragrances')} value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full ps-10 pe-4 py-3 bg-card border border-border rounded-lg text-foreground font-body text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors" />
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-body capitalize transition-all ${categoryFilter === cat ? 'bg-gold-gradient text-primary-foreground shadow-gold' : 'bg-card border border-border text-muted-foreground hover:border-primary/40'}`}>
                {t(cat)}
              </button>
            ))}
            <select value={sort} onChange={(e) => setSort(e.target.value)}
              className="px-4 py-2 bg-card border border-border rounded-lg text-sm font-body text-muted-foreground focus:outline-none focus:border-primary">
              <option value="default">{t('sortBy')}</option>
              <option value="price_asc">{t('priceLowHigh')}</option>
              <option value="price_desc">{t('priceHighLow')}</option>
              <option value="newest">{t('newest')}</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} onQuickView={setQuickViewProduct} />
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground font-body text-lg">{t('noFragrances')}</p>
          </div>
        )}
      </div>
      <StoreFooter />
      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  );
};

export default ProductsPage;
