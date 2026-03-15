import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MessageCircle, ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import { useProducts, useIncrementViews, useIncrementOrderClicks } from "@/hooks/useProducts";
import { useSettings } from "@/hooks/useSettings";
import { useCartStore } from "@/store/useCartStore";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { useLanguage } from "@/i18n/LanguageContext";
import { toast } from "@/hooks/use-toast";
import StoreHeader from "@/components/store/StoreHeader";
import StoreFooter from "@/components/store/StoreFooter";
import placeholderImg from "@/assets/perfume-placeholder.jpg";

const ProductDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: products = [] } = useProducts();
  const { data: settings } = useSettings();
  const incrementViews = useIncrementViews();
  const incrementOrderClicks = useIncrementOrderClicks();
  const addItem = useCartStore((s) => s.addItem);
  const { t } = useLanguage();
  const product = products.find((p) => p.id === id);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (id) incrementViews.mutate(id);
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-3xl text-foreground mb-4">Product Not Found</h1>
          <Link to="/products" className="text-primary font-body hover:underline">
            Back to Collection
          </Link>
        </div>
      </div>
    );
  }

  const images = product.images.length > 0 ? product.images : [placeholderImg];

  const template = settings?.whatsapp_template || "I'd like to order {product_name} - {price}";
  const whatsappMessage = template
    .replace("{product_name}", product.name)
    .replace("{price}", `$${product.price}`)
    .replace("{product_id}", product.id);

  const whatsappUrl = buildWhatsAppUrl(settings?.whatsapp_number || "", whatsappMessage);

  const nextImage = () => setSelectedImage((prev) => (prev + 1) % images.length);
  const prevImage = () => setSelectedImage((prev) => (prev - 1 + images.length) % images.length);

  const noteSection = (title: string, notes: string[], color: string) => (
    <div>
      <h4 className="font-heading text-base sm:text-lg text-foreground mb-2">{title}</h4>
      <div className="flex flex-wrap gap-2">
        {notes.map((note) => (
          <span key={note} className={`px-3 py-1 rounded-full text-xs font-body border ${color}`}>
            {note}
          </span>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader />
      <div className="pt-20 sm:pt-24 pb-16 container mx-auto px-4">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-body text-sm mb-6 sm:mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Collection
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
          {/* Images */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <div className="relative aspect-square rounded-xl overflow-hidden bg-card border border-border mb-4">
              <img src={images[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 bg-background/70 backdrop-blur-sm p-1.5 sm:p-2 rounded-full hover:bg-background transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 bg-background/70 backdrop-blur-sm p-1.5 sm:p-2 rounded-full hover:bg-background transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
                  </button>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                      i === selectedImage ? "border-primary shadow-gold" : "border-border opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-muted-foreground font-body text-sm capitalize">{product.category}</span>
              {product.badge && (
                <span className="bg-gold-gradient text-primary-foreground px-3 py-0.5 rounded-full text-xs font-body font-semibold capitalize">
                  {product.badge.replace("_", " ")}
                </span>
              )}
            </div>

            <h1 className="font-heading text-3xl sm:text-4xl text-foreground mb-3">{product.name}</h1>
            <p className="text-primary font-heading text-2xl sm:text-3xl mb-4 sm:mb-6">${product.price}</p>
            <p className="text-muted-foreground font-body leading-relaxed mb-4 text-sm sm:text-base">{product.description}</p>
            <p className="text-muted-foreground/70 font-body text-sm mb-6 sm:mb-8">Size: {product.size}</p>

            <div className="flex flex-col gap-3 mb-8 sm:mb-10">
              <button
                onClick={() => { addItem(product); toast({ title: t('addedToCart') }); }}
                className="w-full bg-gold-gradient text-primary-foreground py-3 sm:py-4 rounded-xl font-body font-semibold text-base sm:text-lg flex items-center justify-center gap-3 hover:shadow-gold-lg transition-all duration-300 hover:scale-[1.02]"
              >
                <ShoppingBag className="w-5 h-5" />
                {t('addToCart')}
              </button>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => incrementOrderClicks.mutate(product.id)}
                className="w-full border border-primary text-primary py-3 sm:py-4 rounded-xl font-body font-semibold text-base sm:text-lg flex items-center justify-center gap-3 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                <MessageCircle className="w-5 h-5" />
                {t('orderViaWhatsApp')}
              </a>
            </div>

            {/* Fragrance Notes */}
            <div className="bg-card border border-border rounded-xl p-4 sm:p-6 space-y-4 sm:space-y-6">
              <h3 className="font-heading text-xl sm:text-2xl text-gradient-gold">Fragrance Notes</h3>
              {noteSection("Top Notes", product.top_notes, "border-primary/40 text-primary")}
              {noteSection("Middle Notes", product.middle_notes, "border-muted-foreground/30 text-muted-foreground")}
              {noteSection("Base Notes", product.base_notes, "border-border text-muted-foreground/80")}
            </div>
          </motion.div>
        </div>
      </div>
      <StoreFooter />
    </div>
  );
};

export default ProductDetailsPage;
