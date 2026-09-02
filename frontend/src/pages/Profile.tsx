import React, { useState, useEffect, useContext } from 'react';
import { User, Edit2, Check, AlertTriangle, LogOut, Trash2 } from 'lucide-react';
import { UserContext } from '../context/UserContext';
import axios from 'axios';

interface UserProfileData {
  fullName: string;
  username: string;
  email: string;
  avatarUrl?: string;
}

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfileData>({
    fullName: '',
    username: '',
    email: '',
  });

  const [formData, setFormData] = useState<UserProfileData>(profile);

  const { user, getUserData } = useContext(UserContext);
  const { setUser } = useContext(UserContext);

  useEffect(() => {
    // ensure latest user from API
    getUserData?.();
  }, []);

  useEffect(() => {
    if (!user) return;
    setProfile({
      fullName: user.username || user.email.split('@')[0],
      username: `@${user.username}`,
      email: user.email,
    });
    setFormData((prev) => ({ ...prev, fullName: user.username || '', username: `@${user.username}`, email: user.email }));
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // send updates to backend
    const payload = {
      username: formData.fullName || formData.username.replace(/^@/, ''),
      email: formData.email,
    };

    axios
      .put('http://localhost:5000/api/auth/me', payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then((res) => {
        const updated = res.data.data.user;
        setProfile({ fullName: updated.username || '', username: `@${updated.username}`, email: updated.email });
        setFormData({ fullName: updated.username || '', username: `@${updated.username}`, email: updated.email });
        setUser?.(updated);
        setIsEditing(false);
      })
      .catch((err) => {
        console.error('Failed to update profile', err);
        // fallback: still update locally
        setProfile(formData);
        setIsEditing(false);
      });
  };

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  const handleSignOut = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/logout', {}, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    } catch (e) {
      // ignore
    }
    localStorage.removeItem('token');
    setUser?.(null);
    window.location.href = '/login';
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Delete your account? This is irreversible.')) return;
    try {
      await axios.delete('http://localhost:5000/api/auth/me', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    } catch (e) {
      console.error('Failed to delete account', e);
    }
    localStorage.removeItem('token');
    setUser?.(null);
    window.location.href = '/signup';
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 flex justify-center bg-[var(--border-light)] dark:bg-[var(--bg-primary)]">
      <div className="w-full max-w-2xl space-y-6">

        {/* Profile Summary Card */}
        <div className="bg-white dark:bg-[var(--bg-card)] rounded-xl border border-[var(--updated-border-light)] dark:border-[var(--border)] p-6 shadow-sm flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-[var(--bg-primary-light)] text-[var(--text-primary-dark)] dark:text-black font-semibold text-xl flex items-center justify-center flex-shrink-0">
            {profile.fullName
              ? profile.fullName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
              : 'JE'}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{profile.fullName}</h2>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                Active
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-[var(--text-secondary-dark)]">{profile.email}</p>
            <p className="text-xs text-slate-400 dark:text-[var(--text-secondary-dark)] mt-0.5">{user?.createdAt ? `Member since ${new Date(user.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}` : ''}</p>
          </div>
        </div>

        {/* Personal Information Section */}
        <div className="bg-white dark:bg-[var(--bg-card)] rounded-xl border border-[var(--updated-border-light)] dark:border-[var(--border)] p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-[var(--updated-border-light)] dark:border-[var(--border)]">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-slate-500 dark:text-[var(--text-secondary-dark)]" />
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Personal Information</h3>
                <p className="text-xs text-slate-500 dark:text-[var(--text-secondary-dark)]">Manage your profile details and representation.</p>
              </div>
            </div>

            {isEditing ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCancel}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-[var(--text-secondary-dark)] hover:text-slate-900 dark:hover:text-white border border-[var(--updated-border-light)] dark:border-[var(--border)] rounded-lg hover:bg-slate-50 dark:hover:bg-[var(--bg-primary-light)] transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-white bg-white dark:bg-[var(--bg-card)] border border-[var(--updated-border-light)] dark:border-[var(--border)] rounded-lg hover:bg-slate-50 dark:hover:bg-[var(--bg-primary-light)] transition"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-[var(--text-secondary-dark)] mb-1">FULL NAME</label>
              {isEditing ? (
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-[var(--updated-border-light)] dark:border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-[var(--bg-card)] text-slate-900 dark:text-white"
                />
              ) : (
                <div className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-[var(--bg-card)] border border-slate-200 dark:border-[var(--updated-border-light)] rounded-lg text-slate-800 dark:text-white">
                  {profile.fullName}
                </div>
              )}
            </div>

            {/* Username */}
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-[var(--text-secondary-dark)] mb-1">USERNAME</label>
              {isEditing ? (
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-[var(--updated-border-light)] dark:border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-[var(--bg-card)] text-slate-900 dark:text-white"
                />
              ) : (
                <div className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-[var(--bg-card)] border border-slate-200 dark:border-[var(--updated-border-light)] rounded-lg text-slate-800 dark:text-white">
                  {profile.username}
                </div>
              )}
            </div>

            {/* Email Address */}
            <div className="sm:col-span-1">
              <label className="block text-xs font-medium text-slate-600 dark:text-[var(--text-secondary-dark)] mb-1">EMAIL ADDRESS</label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-[var(--updated-border-light)] dark:border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-[var(--bg-card)] text-slate-900 dark:text-white"
                />
              ) : (
                <div className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-[var(--bg-card)] border border-slate-200 dark:border-[var(--updated-border-light)] rounded-lg text-slate-800 dark:text-white">
                  {profile.email}
                </div>
              )}
            </div>

            {/* Profile Picture */}
            <div className="sm:col-span-1">
              <label className="block text-xs font-medium text-slate-600 dark:text-[var(--text-secondary-dark)] mb-1">PROFILE PICTURE</label>
              <div className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-[var(--bg-card)] border border-slate-200 dark:border-[var(--updated-border-light)] rounded-lg text-slate-800 dark:text-white flex items-center justify-between">
                <span>{user?.avatar ? 'Avatar' : 'Initials Avatar'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone Section */}
        <div className="bg-white dark:bg-[var(--bg-card)] rounded-xl border border-[var(--updated-border-light)] dark:border-[var(--border)] p-6 shadow-sm">
          <div className="flex items-center space-x-2 pb-4 mb-4 border-b border-[var(--updated-border-light)] dark:border-[var(--border)]">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Danger Zone</h3>
              <p className="text-xs text-slate-500 dark:text-[var(--text-secondary-dark)]">Irreversible actions — proceed with caution.</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Sign Out Action */}
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-white">Sign out</p>
                <p className="text-xs text-slate-500 dark:text-[var(--text-secondary-dark)]">End your current session on this device.</p>
              </div>
              <button onClick={handleSignOut} className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-white bg-white dark:bg-[var(--bg-card)] border border-[var(--updated-border-light)] dark:border-[var(--border)] hover:text-black rounded-lg hover:cursor-pointer hover:bg-slate-50 dark:hover:bg-[var(--bg-primary-light)] transition">
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>

            <hr className="border-[var(--updated-border-light)] dark:border-[var(--border)]" />

            {/* Delete Account Action */}
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-red-600">Delete Account</p>
                <p className="text-xs text-slate-500 dark:text-[var(--text-secondary-dark)]">Permanently remove your account and associated data.</p>
              </div>
              <button onClick={handleDeleteAccount} className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 dark:bg-transparent border border-red-200 dark:border-red-700 rounded-lg hover:bg-red-100 hover:cursor-pointer dark:hover:bg-red-800/20 transition">
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Account</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}