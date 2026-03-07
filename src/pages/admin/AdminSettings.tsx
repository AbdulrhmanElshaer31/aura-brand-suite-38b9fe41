import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Save, KeyRound } from 'lucide-react';
import { useStore } from '@/store/useStore';
import AdminLayout from '@/components/admin/AdminLayout';
import { toast } from 'sonner';

const AdminSettings = () => {
  const { settings, updateSettings, changePassword } = useStore();
  const [form, setForm] = useState(settings);
  const [passwordForm, setPasswordForm] = useState({ old: '', new: '', confirm: '' });

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) setForm({ ...form, logoUrl: ev.target.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleSaveSettings = () => {
    updateSettings(form);
    toast.success('Settings saved successfully');
  };

  const handleChangePassword = () => {
    if (passwordForm.new !== passwordForm.confirm) {
      toast.error('Passwords do not match');
      return;
    }
    if (passwordForm.new.length < 4) {
      toast.error('Password must be at least 4 characters');
      return;
    }
    if (changePassword(passwordForm.old, passwordForm.new)) {
      toast.success('Password changed successfully');
      setPasswordForm({ old: '', new: '', confirm: '' });
    } else {
      toast.error('Current password is incorrect');
    }
  };

  const inputClass = "w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground font-body text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors";
  const labelClass = "text-muted-foreground font-body text-sm mb-1 block";

  return (
    <AdminLayout>
      <h1 className="font-heading text-3xl text-foreground mb-8">Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Brand Settings */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-xl p-6">
          <h2 className="font-heading text-xl text-foreground mb-6">Brand Identity</h2>

          <div className="space-y-4">
            <div>
              <label className={labelClass}>Brand Name</label>
              <input value={form.brandName} onChange={(e) => setForm({ ...form, brandName: e.target.value })} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Tagline</label>
              <input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>About Text</label>
              <textarea value={form.aboutText} onChange={(e) => setForm({ ...form, aboutText: e.target.value })} rows={3} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Brand Logo</label>
              <div className="flex items-center gap-4">
                {form.logoUrl && <img src={form.logoUrl} alt="Logo" className="w-12 h-12 object-contain rounded-lg border border-border" />}
                <label className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg cursor-pointer font-body text-sm hover:bg-secondary/80 transition-colors">
                  <Upload className="w-4 h-4" /> Upload Logo
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Primary Color</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={form.primaryColor} onChange={(e) => setForm({ ...form, primaryColor: e.target.value })} className="w-10 h-10 rounded-lg border border-border cursor-pointer" />
                  <input value={form.primaryColor} onChange={(e) => setForm({ ...form, primaryColor: e.target.value })} className={inputClass} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Secondary Color</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={form.secondaryColor} onChange={(e) => setForm({ ...form, secondaryColor: e.target.value })} className="w-10 h-10 rounded-lg border border-border cursor-pointer" />
                  <input value={form.secondaryColor} onChange={(e) => setForm({ ...form, secondaryColor: e.target.value })} className={inputClass} />
                </div>
              </div>
            </div>
          </div>

          <button onClick={handleSaveSettings} className="mt-6 w-full bg-gold-gradient text-primary-foreground py-3 rounded-lg font-body text-sm font-medium flex items-center justify-center gap-2 hover:shadow-gold transition-all">
            <Save className="w-4 h-4" /> Save Settings
          </button>
        </motion.div>

        <div className="space-y-6">
          {/* WhatsApp */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-heading text-xl text-foreground mb-6">WhatsApp Settings</h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>WhatsApp Number (with country code)</label>
                <input value={form.whatsappNumber} onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })} className={inputClass} placeholder="966500000000" />
              </div>
              <div>
                <label className={labelClass}>Message Template</label>
                <textarea value={form.whatsappTemplate} onChange={(e) => setForm({ ...form, whatsappTemplate: e.target.value })} rows={5} className={inputClass} />
                <p className="text-muted-foreground/60 text-xs font-body mt-1">Variables: {'{product_name}'}, {'{price}'}, {'{product_id}'}</p>
              </div>
            </div>
            <button onClick={handleSaveSettings} className="mt-6 w-full bg-gold-gradient text-primary-foreground py-3 rounded-lg font-body text-sm font-medium flex items-center justify-center gap-2 hover:shadow-gold transition-all">
              <Save className="w-4 h-4" /> Save WhatsApp Settings
            </button>
          </motion.div>

          {/* Password */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-heading text-xl text-foreground mb-6 flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-primary" /> Change Password
            </h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Current Password</label>
                <input type="password" value={passwordForm.old} onChange={(e) => setPasswordForm({ ...passwordForm, old: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>New Password</label>
                <input type="password" value={passwordForm.new} onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Confirm New Password</label>
                <input type="password" value={passwordForm.confirm} onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })} className={inputClass} />
              </div>
            </div>
            <button onClick={handleChangePassword} className="mt-6 w-full bg-secondary text-secondary-foreground py-3 rounded-lg font-body text-sm font-medium hover:bg-secondary/80 transition-colors">
              Update Password
            </button>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
