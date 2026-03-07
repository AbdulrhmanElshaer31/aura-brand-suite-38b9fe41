import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Package, Eye, MousePointerClick } from 'lucide-react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useProducts } from '@/hooks/useProducts';
import { useDailyStats } from '@/hooks/useStats';
import { useLanguage } from '@/i18n/LanguageContext';
import AdminLayout from '@/components/admin/AdminLayout';

const CHART_COLORS = ['hsl(45, 70%, 47%)', 'hsl(45, 72%, 56%)', 'hsl(0, 0%, 50%)'];

const AdminDashboard = () => {
  const { data: products = [] } = useProducts();
  const { data: dailyStats = [] } = useDailyStats();
  const { t } = useLanguage();

  const totalProducts = products.length;
  const totalViews = products.reduce((sum, p) => sum + p.views, 0);
  const totalClicks = products.reduce((sum, p) => sum + p.order_clicks, 0);

  const topViewed = useMemo(() => [...products].sort((a, b) => b.views - a.views).slice(0, 5), [products]);

  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach((p) => { counts[p.category] = (counts[p.category] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [products]);

  const stats = [
    { label: t('totalProducts'), value: totalProducts, icon: Package },
    { label: t('totalViews'), value: totalViews, icon: Eye },
    { label: t('orderClicks'), value: totalClicks, icon: MousePointerClick },
  ];

  return (
    <AdminLayout>
      <h1 className="font-heading text-3xl text-foreground mb-8">{t('dashboard')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-muted-foreground font-body text-sm">{stat.label}</span>
              <stat.icon className="w-5 h-5 text-primary" />
            </div>
            <p className="font-heading text-4xl text-foreground">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-heading text-lg text-foreground mb-6">{t('categoriesDistribution')}</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {categoryData.map((_, i) => (<Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #333', borderRadius: '8px', fontFamily: 'Poppins' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-heading text-lg text-foreground mb-6">{t('dailyOrderClicks')}</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={dailyStats.slice(-14)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#BFBFBF', fontFamily: 'Poppins' }} tickFormatter={(v) => v.slice(5)} />
              <YAxis tick={{ fontSize: 11, fill: '#BFBFBF', fontFamily: 'Poppins' }} />
              <Tooltip contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #333', borderRadius: '8px', fontFamily: 'Poppins' }} />
              <Line type="monotone" dataKey="clicks" stroke="hsl(45, 70%, 47%)" strokeWidth={2} dot={{ fill: 'hsl(45, 70%, 47%)' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-heading text-lg text-foreground mb-4">{t('mostViewedProducts')}</h3>
        <div className="space-y-3">
          {topViewed.map((p) => (
            <div key={p.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
              <div>
                <p className="font-body text-sm text-foreground">{p.name}</p>
                <p className="font-body text-xs text-muted-foreground">{p.category} · {p.size}</p>
              </div>
              <div className="text-end">
                <p className="font-body text-sm text-primary">{p.views} {t('views')}</p>
                <p className="font-body text-xs text-muted-foreground">{p.order_clicks} {t('clicks')}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
