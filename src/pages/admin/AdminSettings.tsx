import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Save, KeyRound } from 'lucide-react';
import { useSettings, useUpdateSettings, uploadLogo } from '@/hooks/useSettings';
import { useAdminStore } from '@/store/useAdminStore';
import { useLanguage } from '@/i18n/LanguageContext';
import AdminLayout from '@/components/admin/AdminLayout';
import { toast } from 'sonner';

const AdminSettings = () => {
  const { data: settings } = useSettings();
  const updateSettings = useUpdateSettings();
  const { changePassword } = useAdminStore();
  const { t } = useLanguage();

  const [form, setForm] = useState({
    brand_name: '', tagline: '', about_text: '', logo_url: '',
    primary_color: '#C9A227', secondary_color: '#E5C158',
    whatsapp_number: '', whatsapp_template: '',
  });
  const [passwordForm, setPasswordForm] = useState({ old: '', new: '', confirm: '' });
  const [logoUploading, setLogoUploading] = useState(false);

  useEffect(() => {
    if (settings) {
      setForm({
        brand_name: settings.brand_name, tagline: settings.tagline,
        about_text: settings.about_text, logo_url: settings.logo_url,
        primary_color: settings.primary_color, secondary_color: settings.secondary_color,
        whatsapp_number: settings.whatsapp_number, whatsapp_template: settings.whatsapp_template,
      });
    }
  }, [settings]);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoUploading(true);
    try {
      const url = await uploadLogo(file);
      setForm({ ...form, logo_url: url });
    } catch {
      toast.error('Failed to upload logo');
    }
    setLogoUploading(false);
  };

  const handleSaveSettings = async () => {
    try {
      await updateSettings.mutateAsync(form);
      toast.success(t('settingsSaved'));
    } catch {
      toast.error('Error saving settings');
    }
  };

  const handleChangePassword = () => {
    if (passwordForm.new !== passwordForm.confirm) { toast.error(t('passwordsNoMatch')); return; }
    if (passwordForm.new.length < 4) { toast.error(t('passwordTooShort')); return; }
    if (changePassword(passwordForm.old, passwordForm.new)) {
      toast.success(t('passwordChanged'));
      setPasswordForm({ old: '', new: '', confirm: '' });
    } else {
      toast.error(t('incorrectPassword'));
    }
  };

  const inputClass = "w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground font-body text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors";
  const labelClass = "text-muted-foreground font-body text-sm mb-1 block";

  return (
    <AdminLayout>
      <h1 className="font-heading text-3xl text-foreground mb-8">{t('settings')}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-xl p-6">
          <h2 className="font-heading text-xl text-foreground mb-6">{t('brandIdentity')}</h2>
          <div className="space-y-4">
            <div><label className={labelClass}>{t('brandName')}</label><input value={form.brand_name} onChange={(e) => setForm({ ...form, brand_name: e.target.value })} className={inputClass} /></div>
            <div><label className={labelClass}>{t('tagline')}</label><input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} className={inputClass} /></div>
            <div><label className={labelClass}>{t('aboutText')}</label><textarea value={form.about_text} onChange={(e) => setForm({ ...form, about_text: e.target.value })} rows={3} className={inputClass} /></div>
            <div>
              <label className={labelClass}>{t('brandLogo')}</label>
              <div className="flex items-center gap-4">
                {form.logo_url && <img src={form.logo_url} alt="Logo" className="w-12 h-12 object-contain rounded-lg border border-border" />}
                <label className={`flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg cursor-pointer font-body text-sm hover:bg-secondary/80 transition-colors ${logoUploading ? 'opacity-50' : ''}`}>
                  <Upload className="w-4 h-4" /> {t('uploadLogo')}
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" disabled={logoUploading} />
                </label>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className={labelClass}>{t('primaryColor')}</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={form.primary_color} onChange={(e) => setForm({ ...form, primary_color: e.target.value })} className="w-10 h-10 rounded-lg border border-border cursor-pointer" />
                  <input value={form.primary_color} onChange={(e) => setForm({ ...form, primary_color: e.target.value })} className={inputClass} />
                </div>
              </div>
              <div><label className={labelClass}>{t('secondaryColor')}</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={form.secondary_color} onChange={(e) => setForm({ ...form, secondary_color: e.target.value })} className="w-10 h-10 rounded-lg border border-border cursor-pointer" />
                  <input value={form.secondary_color} onChange={(e) => setForm({ ...form, secondary_color: e.target.value })} className={inputClass} />
                </div>
              </div>
            </div>
          </div>
          <button onClick={handleSaveSettings} disabled={updateSettings.isPending}
            className="mt-6 w-full bg-gold-gradient text-primary-foreground py-3 rounded-lg font-body text-sm font-medium flex items-center justify-center gap-2 hover:shadow-gold transition-all disabled:opacity-50">
            <Save className="w-4 h-4" /> {t('saveSettings')}
          </button>
        </motion.div>

        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-heading text-xl text-foreground mb-6">{t('whatsappSettings')}</h2>
            <div className="space-y-4">
              <div><label className={labelClass}>{t('whatsappNumber')}</label>
                <input value={form.whatsapp_number} onChange={(e) => setForm({ ...form, whatsapp_number: e.target.value })} className={inputClass} placeholder="20XXXXXXXXXX" />
              </div>
              <div><label className={labelClass}>{t('messageTemplate')}</label>
                <textarea value={form.whatsapp_template} onChange={(e) => setForm({ ...form, whatsapp_template: e.target.value })} rows={5} className={inputClass} />
                <p className="text-muted-foreground/60 text-xs font-body mt-1">Variables: {'{product_name}'}, {'{price}'}, {'{product_id}'}</p>
              </div>
            </div>
            <button onClick={handleSaveSettings} disabled={updateSettings.isPending}
              className="mt-6 w-full bg-gold-gradient text-primary-foreground py-3 rounded-lg font-body text-sm font-medium flex items-center justify-center gap-2 hover:shadow-gold transition-all disabled:opacity-50">
              <Save className="w-4 h-4" /> {t('saveWhatsApp')}
            </button>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-heading text-xl text-foreground mb-6 flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-primary" /> {t('changePassword')}
            </h2>
            <div className="space-y-4">
              <div><label className={labelClass}>{t('currentPassword')}</label><input type="password" value={passwordForm.old} onChange={(e) => setPasswordForm({ ...passwordForm, old: e.target.value })} className={inputClass} /></div>
              <div><label className={labelClass}>{t('newPassword')}</label><input type="password" value={passwordForm.new} onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })} className={inputClass} /></div>
              <div><label className={labelClass}>{t('confirmPassword')}</label><input type="password" value={passwordForm.confirm} onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })} className={inputClass} /></div>
            </div>
            <button onClick={handleChangePassword} className="mt-6 w-full bg-secondary text-secondary-foreground py-3 rounded-lg font-body text-sm font-medium hover:bg-secondary/80 transition-colors">
              {t('updatePassword')}
            </button>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
