import type { DishSize } from '@/lib/food';
import { useLanguage } from '@/i18n/LanguageContext';

const SizePicker = ({ sizes, value, onChange }: { sizes: DishSize[]; value: number; onChange: (i: number) => void }) => {
  const { t } = useLanguage();
  if (sizes.length <= 1 && !sizes[0]?.name) return null;
  return (
    <div>
      <p className="text-sm font-semibold text-foreground mb-2">{t('chooseSize')}</p>
      <div className="flex flex-wrap gap-2">
        {sizes.map((s, i) => (
          <button key={i} type="button" onClick={() => onChange(i)}
            className={`px-4 py-2 rounded-2xl border text-sm transition-all ${i === value ? 'bg-primary text-primary-foreground border-primary shadow-gold' : 'bg-card border-border hover:border-primary/50'}`}>
            {s.name} · <b>{s.price}</b> {t('currency')}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SizePicker;
