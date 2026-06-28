import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Monitor, Bell, BellOff, Globe, DollarSign, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { userService } from '../../services/user.service.js';
import Card from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import toast from 'react-hot-toast';

const THEMES = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
];

const LANGUAGES = ['English', 'Hindi', 'Gujarati', 'French', 'Spanish', 'Japanese'];
const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP', 'JPY', 'AED'];

export default function SettingsPage() {
  const { user, updateUser } = useAuth();
  const { theme, setTheme } = useTheme();
  const [prefs, setPrefs] = useState({
    notifications: user?.preferences?.notifications ?? true,
    language: user?.preferences?.language || 'en',
    currency: user?.preferences?.currency || 'INR',
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await userService.updateProfile({ preferences: { ...prefs, theme } });
      updateUser(res.data.data.user);
      toast.success('Settings saved!');
    } catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Customize your experience</p>
      </div>

      {/* Theme */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="p-6">
          <h2 className="font-bold text-slate-800 dark:text-white mb-4">Appearance</h2>
          <div className="grid grid-cols-3 gap-3">
            {THEMES.map(({ value, label, icon: Icon }) => (
              <button key={value} onClick={() => setTheme(value)}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  theme === value ? 'border-primary bg-primary/10' : 'border-slate-200 dark:border-slate-700 hover:border-primary/50'
                }`}>
                <Icon className={`w-6 h-6 ${theme === value ? 'text-primary' : 'text-slate-500'}`} />
                <span className={`text-sm font-medium ${theme === value ? 'text-primary' : 'text-slate-600 dark:text-slate-400'}`}>{label}</span>
                {theme === value && <Check className="w-4 h-4 text-primary" />}
              </button>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Notifications */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="p-6">
          <h2 className="font-bold text-slate-800 dark:text-white mb-4">Notifications</h2>
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-center gap-3">
              {prefs.notifications ? <Bell className="w-5 h-5 text-primary" /> : <BellOff className="w-5 h-5 text-slate-400" />}
              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-white">Email Notifications</p>
                <p className="text-xs text-slate-500">Trip reminders and updates</p>
              </div>
            </div>
            <button onClick={() => setPrefs(p => ({ ...p, notifications: !p.notifications }))}
              className={`relative w-12 h-6 rounded-full transition-colors ${prefs.notifications ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'}`}>
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${prefs.notifications ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>
        </Card>
      </motion.div>

      {/* Language & Currency */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="p-6">
          <h2 className="font-bold text-slate-800 dark:text-white mb-4">Regional</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Language</label>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES.map(lang => (
                  <button key={lang} onClick={() => setPrefs(p => ({ ...p, language: lang.toLowerCase().slice(0, 2) }))}
                    className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${
                      prefs.language === lang.toLowerCase().slice(0, 2) ? 'bg-primary text-white border-primary' : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-primary/50'
                    }`}>{lang}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Currency</label>
              <div className="flex flex-wrap gap-2">
                {CURRENCIES.map(cur => (
                  <button key={cur} onClick={() => setPrefs(p => ({ ...p, currency: cur }))}
                    className={`px-3 py-1.5 rounded-lg text-sm border font-mono transition-all ${
                      prefs.currency === cur ? 'bg-primary text-white border-primary' : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-primary/50'
                    }`}>{cur}</button>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      <Button onClick={handleSave} loading={saving} size="lg" className="w-full justify-center">
        <Check className="w-4 h-4" /> Save All Settings
      </Button>
    </div>
  );
}
