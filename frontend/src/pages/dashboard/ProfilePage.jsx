import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { User, Mail, Camera, Lock, Trash2, Save, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { userService } from '../../services/user.service.js';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import Card from '../../components/ui/Card.jsx';
import toast from 'react-hot-toast';

const profileSchema = z.object({ name: z.string().min(2, 'Name must be at least 2 chars') });
const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password required'),
  newPassword: z.string().min(6, 'At least 6 characters'),
  confirmPassword: z.string(),
}).refine(d => d.newPassword === d.confirmPassword, { message: "Passwords don't match", path: ['confirmPassword'] });

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuth();
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const fileRef = useRef(null);

  const profileForm = useForm({ resolver: zodResolver(profileSchema), defaultValues: { name: user?.name || '' } });
  const passwordForm = useForm({ resolver: zodResolver(passwordSchema) });

  const onProfileSave = async (data) => {
    try {
      const res = await userService.updateProfile({ name: data.name, avatar: avatarPreview });
      updateUser(res.data.data.user);
      toast.success('Profile updated!');
    } catch (err) { toast.error(err.response?.data?.message || 'Update failed'); }
  };

  const onPasswordChange = async (data) => {
    try {
      await userService.changePassword({ currentPassword: data.currentPassword, newPassword: data.newPassword });
      passwordForm.reset();
      toast.success('Password changed!');
    } catch (err) { toast.error(err.response?.data?.message || 'Password change failed'); }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return toast.error('Image must be under 5MB');
    setUploadingAvatar(true);
    try {
      const res = await userService.uploadAvatar(file);
      setAvatarPreview(res.data.data.avatar);
      updateUser({ avatar: res.data.data.avatar });
      toast.success('Avatar updated!');
    } catch { toast.error('Upload failed'); }
    finally { setUploadingAvatar(false); }
  };

  const handleDeleteAccount = async () => {
    const confirmed = prompt('Type "DELETE" to confirm account deletion:');
    if (confirmed !== 'DELETE') return;
    try {
      await userService.deleteAccount({ password: '' });
      await logout();
      toast.success('Account deleted');
    } catch (err) { toast.error(err.response?.data?.message || 'Deletion failed'); }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Profile</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage your personal information</p>
      </div>

      {/* Avatar + Profile Info */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="p-6">
          <h2 className="font-bold text-slate-800 dark:text-white mb-5">Personal Information</h2>
          <div className="flex items-center gap-5 mb-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center overflow-hidden shadow-lg">
                {avatarPreview ? <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" /> : <span className="text-white text-3xl font-bold">{user?.name?.[0]?.toUpperCase()}</span>}
              </div>
              <button onClick={() => fileRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg hover:bg-primary/90 transition-colors">
                {uploadingAvatar ? <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" /> : <Camera className="w-3.5 h-3.5" />}
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </div>
            <div>
              <p className="font-semibold text-slate-800 dark:text-white">{user?.name}</p>
              <p className="text-sm text-slate-500">{user?.email}</p>
              <p className="text-xs text-slate-400 mt-1">Joined {new Date(user?.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</p>
            </div>
          </div>

          <form onSubmit={profileForm.handleSubmit(onProfileSave)} className="space-y-4">
            <Input label="Full Name" icon={<User className="w-4 h-4" />} error={profileForm.formState.errors.name?.message} {...profileForm.register('name')} />
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input value={user?.email} disabled className="w-full pl-10 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-500 cursor-not-allowed" />
              </div>
            </div>
            <Button type="submit" loading={profileForm.formState.isSubmitting} icon={<Save className="w-4 h-4" />}>Save Changes</Button>
          </form>
        </Card>
      </motion.div>

      {/* Change Password */}
      {!user?.googleId && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="p-6">
            <h2 className="font-bold text-slate-800 dark:text-white mb-5">Change Password</h2>
            <form onSubmit={passwordForm.handleSubmit(onPasswordChange)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Current Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type={showCurrentPass ? 'text' : 'password'} className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50" {...passwordForm.register('currentPassword')} />
                  <button type="button" onClick={() => setShowCurrentPass(!showCurrentPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"><EyeOff className="w-4 h-4" /></button>
                </div>
                {passwordForm.formState.errors.currentPassword && <p className="mt-1 text-xs text-red-500">{passwordForm.formState.errors.currentPassword.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type={showNewPass ? 'text' : 'password'} className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50" {...passwordForm.register('newPassword')} />
                  <button type="button" onClick={() => setShowNewPass(!showNewPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"><Eye className="w-4 h-4" /></button>
                </div>
                {passwordForm.formState.errors.newPassword && <p className="mt-1 text-xs text-red-500">{passwordForm.formState.errors.newPassword.message}</p>}
              </div>
              <Input label="Confirm New Password" type="password" icon={<Lock className="w-4 h-4" />} error={passwordForm.formState.errors.confirmPassword?.message} {...passwordForm.register('confirmPassword')} />
              <Button type="submit" loading={passwordForm.formState.isSubmitting} variant="secondary" icon={<Lock className="w-4 h-4" />}>Update Password</Button>
            </form>
          </Card>
        </motion.div>
      )}

      {/* Danger Zone */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="p-6 border-red-200 dark:border-red-900/50">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h2 className="font-bold text-red-600 dark:text-red-400">Danger Zone</h2>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Permanently delete your account and all data. This cannot be undone.</p>
          <Button variant="danger" size="sm" onClick={handleDeleteAccount} icon={<Trash2 className="w-4 h-4" />}>Delete Account</Button>
        </Card>
      </motion.div>
    </div>
  );
}
