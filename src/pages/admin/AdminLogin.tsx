import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { useStore } from '@/store/useStore';

const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { loginAdmin } = useStore();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginAdmin(password)) {
      navigate('/admin/dashboard');
    } else {
      setError('Invalid password');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-card border border-border flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7 text-primary" />
          </div>
          <h1 className="font-heading text-3xl text-gradient-gold">Admin Panel</h1>
          <p className="text-muted-foreground font-body text-sm mt-2">Enter your password to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 space-y-5">
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground font-body text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
            {error && <p className="text-destructive text-xs font-body mt-2">{error}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-gold-gradient text-primary-foreground py-3 rounded-lg font-body font-semibold hover:shadow-gold transition-all"
          >
            Login
          </button>
        </form>
        <p className="text-center text-muted-foreground/50 text-xs font-body mt-6">Default password: admin123</p>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
