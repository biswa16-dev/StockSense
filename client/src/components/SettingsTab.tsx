import { useState, useEffect } from 'react';
import { User, Globe, Bell, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { UserSettings } from '../services/settingsService';

export default function SettingsTab({ 
  settings, 
  loading, 
  saving, 
  hasUnsavedChanges, 
  updateSection, 
  save, 
  reset 
}: {
  settings: UserSettings | null,
  loading: boolean,
  saving: boolean,
  hasUnsavedChanges: boolean,
  updateSection: any,
  save: any,
  reset: any
}) {
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);


  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  if (loading || !settings) {
    return (
      <motion.div
        key="settings-loading"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="max-w-4xl mx-auto flex flex-col gap-8 pb-10 items-center justify-center h-64"
      >
        <div className="w-8 h-8 border-4 border-t-transparent border-[rgba(30,50,90,0.5)] rounded-full animate-spin"></div>
        <p className="text-[rgba(30,50,90,0.6)]">Loading settings...</p>
      </motion.div>
    );
  }

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!settings.profile.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!settings.profile.email.trim() || !/^\S+@\S+\.\S+$/.test(settings.profile.email)) newErrors.email = "Valid email is required";
    if (!settings.profile.designation.trim()) newErrors.designation = "Designation is required";
    if (!settings.profile.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      showToast("Please correct the highlighted fields.", "error");
      return;
    }
    const success = await save();
    if (success) {
      showToast("Changes saved successfully.", "success");
    } else {
      showToast("Unable to save changes. Please try again.", "error");
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };



  return (
    <motion.div
      key="settings"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl mx-auto flex flex-col gap-8 pb-10"
    >
      <div>
        <h1 className="text-3xl font-normal text-[rgba(30,50,90,0.9)] tracking-tight mb-1">Settings</h1>
        <p className="text-sm text-[rgba(30,50,90,0.6)] font-normal">Manage your account preferences and application settings.</p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Profile Section */}
        <div className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-[1.5rem] p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6 border-b border-white/40 pb-4">
            <div className="bg-blue-500/10 p-2 rounded-xl">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-medium text-[rgba(30,50,90,0.9)]">Profile Information</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[rgba(30,50,90,0.7)]">Full Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={settings.profile.fullName}
                onChange={e => updateSection('profile', 'fullName', e.target.value)}
                className={`px-4 py-2 rounded-xl bg-white/50 border ${errors.fullName ? 'border-red-400' : 'border-white/40'} focus:outline-none focus:ring-2 focus:ring-[rgba(30,50,90,0.2)] text-[rgba(30,50,90,0.8)] shadow-sm`}
              />
              {errors.fullName && <span className="text-xs text-red-500">{errors.fullName}</span>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[rgba(30,50,90,0.7)]">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email id"
                value={settings.profile.email}
                onChange={e => updateSection('profile', 'email', e.target.value)}
                className={`px-4 py-2 rounded-xl bg-white/50 border ${errors.email ? 'border-red-400' : 'border-white/40'} focus:outline-none focus:ring-2 focus:ring-[rgba(30,50,90,0.2)] text-[rgba(30,50,90,0.8)] shadow-sm`}
              />
              {errors.email && <span className="text-xs text-red-500">{errors.email}</span>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[rgba(30,50,90,0.7)]">Designation</label>
              <input
                type="text"
                placeholder="Enter your designation"
                value={settings.profile.designation}
                onChange={e => updateSection('profile', 'designation', e.target.value)}
                className={`px-4 py-2 rounded-xl bg-white/50 border ${errors.designation ? 'border-red-400' : 'border-white/40'} focus:outline-none focus:ring-2 focus:ring-[rgba(30,50,90,0.2)] text-[rgba(30,50,90,0.8)] shadow-sm`}
              />
              {errors.designation && <span className="text-xs text-red-500">{errors.designation}</span>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[rgba(30,50,90,0.7)]">Mobile Number</label>
              <div className="flex gap-2">
                <select
                  value={settings.profile.countryCode}
                  onChange={e => updateSection('profile', 'countryCode', e.target.value)}
                  className="w-1/3 px-3 py-2 rounded-xl bg-white/50 border border-white/40 focus:outline-none focus:ring-2 focus:ring-[rgba(30,50,90,0.2)] text-[rgba(30,50,90,0.8)] shadow-sm text-sm cursor-pointer outline-none"
                >
                  <option value="+91">India (+91)</option>
                  <option value="+1">US (+1)</option>
                  <option value="+44">UK (+44)</option>
                  <option value="+971">UAE (+971)</option>
                  <option value="+65">SG (+65)</option>
                  <option value="+61">AU (+61)</option>
                  <option value="+1CA">CA (+1)</option>
                  <option value="+49">Germany (+49)</option>
                  <option value="+33">France (+33)</option>
                  <option value="+81">Japan (+81)</option>
                  <option value="+55">Brazil (+55)</option>
                  <option value="+27">South Africa (+27)</option>
                  <option value="+52">Mexico (+52)</option>
                  <option value="+39">Italy (+39)</option>
                  <option value="+34">Spain (+34)</option>
                  <option value="+31">Netherlands (+31)</option>
                </select>
                <input
                  type="tel"
                  value={settings.profile.phoneNumber}
                  onChange={e => updateSection('profile', 'phoneNumber', e.target.value)}
                  placeholder="Enter your mobile no."
                  className={`w-2/3 px-4 py-2 rounded-xl bg-white/50 border ${errors.phoneNumber ? 'border-red-400' : 'border-white/40'} focus:outline-none focus:ring-2 focus:ring-[rgba(30,50,90,0.2)] text-[rgba(30,50,90,0.8)] shadow-sm`}
                />
              </div>
              {errors.phoneNumber && <span className="text-xs text-red-500">{errors.phoneNumber}</span>}
            </div>
          </div>
        </div>



        {/* Regional Preferences Section */}
        <div className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-[1.5rem] p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6 border-b border-white/40 pb-4">
            <div className="bg-emerald-500/10 p-2 rounded-xl">
              <Globe className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-lg font-medium text-[rgba(30,50,90,0.9)]">Regional Preferences</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[rgba(30,50,90,0.7)]">Country</label>
              <select
                value={settings.regional.country}
                onChange={e => updateSection('regional', 'country', e.target.value)}
                className="px-4 py-2 rounded-xl bg-white/50 border border-white/40 focus:outline-none focus:ring-2 focus:ring-[rgba(30,50,90,0.2)] text-[rgba(30,50,90,0.8)] shadow-sm text-sm cursor-pointer outline-none"
              >
                <option value="India">India</option>
                <option value="United States">United States</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
                <option value="UAE">UAE</option>
                <option value="Singapore">Singapore</option>
                <option value="Germany">Germany</option>
                <option value="France">France</option>
                <option value="Japan">Japan</option>
                <option value="Brazil">Brazil</option>
                <option value="South Africa">South Africa</option>
                <option value="Mexico">Mexico</option>
                <option value="Italy">Italy</option>
                <option value="Spain">Spain</option>
                <option value="Netherlands">Netherlands</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[rgba(30,50,90,0.7)]">Language</label>
              <select
                value={settings.regional.language}
                onChange={e => updateSection('regional', 'language', e.target.value)}
                className="px-4 py-2 rounded-xl bg-white/50 border border-white/40 focus:outline-none focus:ring-2 focus:ring-[rgba(30,50,90,0.2)] text-[rgba(30,50,90,0.8)] shadow-sm text-sm cursor-pointer outline-none"
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="German">German</option>
                <option value="French">French</option>
                <option value="Japanese">Japanese</option>
                <option value="Portuguese">Portuguese</option>
                <option value="Spanish">Spanish</option>
                <option value="Italian">Italian</option>
                <option value="Dutch">Dutch</option>
                <option value="Arabic">Arabic</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[rgba(30,50,90,0.7)]">Time Zone</label>
              <select
                value={settings.regional.timezone}
                onChange={e => updateSection('regional', 'timezone', e.target.value)}
                className="px-4 py-2 rounded-xl bg-white/50 border border-white/40 focus:outline-none focus:ring-2 focus:ring-[rgba(30,50,90,0.2)] text-[rgba(30,50,90,0.8)] shadow-sm text-sm cursor-pointer outline-none"
              >
                <option value="Asia/Kolkata">Asia/Kolkata — IST</option>
                <option value="Asia/Dubai">Asia/Dubai — GST</option>
                <option value="Asia/Singapore">Asia/Singapore — SGT</option>
                <option value="Asia/Tokyo">Asia/Tokyo — JST</option>
                <option value="Europe/London">Europe/London — GMT/BST</option>
                <option value="Europe/Berlin">Europe/Berlin — CET/CEST</option>
                <option value="Europe/Paris">Europe/Paris — CET/CEST</option>
                <option value="America/New_York">America/New_York — ET</option>
                <option value="America/Los_Angeles">America/Los_Angeles — PT</option>
                <option value="America/Mexico_City">America/Mexico_City — CST</option>
                <option value="America/Sao_Paulo">America/Sao_Paulo — BRT</option>
                <option value="Africa/Johannesburg">Africa/Johannesburg — SAST</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[rgba(30,50,90,0.7)]">Date Format</label>
              <select
                value={settings.regional.dateFormat}
                onChange={e => updateSection('regional', 'dateFormat', e.target.value)}
                className="px-4 py-2 rounded-xl bg-white/50 border border-white/40 focus:outline-none focus:ring-2 focus:ring-[rgba(30,50,90,0.2)] text-[rgba(30,50,90,0.8)] shadow-sm text-sm cursor-pointer outline-none"
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY (26/09/2026)</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY (09/26/2026)</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD (2026-09-26)</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[rgba(30,50,90,0.7)]">Time Format</label>
              <select
                value={settings.regional.timeFormat}
                onChange={e => updateSection('regional', 'timeFormat', e.target.value)}
                className="px-4 py-2 rounded-xl bg-white/50 border border-white/40 focus:outline-none focus:ring-2 focus:ring-[rgba(30,50,90,0.2)] text-[rgba(30,50,90,0.8)] shadow-sm text-sm cursor-pointer outline-none"
              >
                <option value="12-hour">12-hour (01:30 PM)</option>
                <option value="24-hour">24-hour (13:30)</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[rgba(30,50,90,0.7)]">Currency</label>
              <select
                value={settings.regional.currency}
                onChange={e => updateSection('regional', 'currency', e.target.value)}
                className="px-4 py-2 rounded-xl bg-white/50 border border-white/40 focus:outline-none focus:ring-2 focus:ring-[rgba(30,50,90,0.2)] text-[rgba(30,50,90,0.8)] shadow-sm text-sm cursor-pointer outline-none"
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="AED">AED (د.إ)</option>
                <option value="SGD">SGD (S$)</option>
                <option value="CAD">CAD (C$)</option>
                <option value="AUD">AUD (A$)</option>
                <option value="JPY">JPY (¥)</option>
                <option value="BRL">BRL (R$)</option>
                <option value="ZAR">ZAR (R)</option>
                <option value="MXN">MXN ($)</option>
                <option value="CHF">CHF (Fr)</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[rgba(30,50,90,0.7)]">Number Format</label>
              <select
                value={settings.regional.numberFormat}
                onChange={e => updateSection('regional', 'numberFormat', e.target.value)}
                className="px-4 py-2 rounded-xl bg-white/50 border border-white/40 focus:outline-none focus:ring-2 focus:ring-[rgba(30,50,90,0.2)] text-[rgba(30,50,90,0.8)] shadow-sm text-sm cursor-pointer outline-none"
              >
                <option value="Indian">Indian (1,00,000)</option>
                <option value="International">International (100,000)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-[1.5rem] p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6 border-b border-white/40 pb-4">
            <div className="bg-amber-500/10 p-2 rounded-xl">
              <Bell className="w-5 h-5 text-amber-600" />
            </div>
            <h2 className="text-lg font-medium text-[rgba(30,50,90,0.9)]">Notifications</h2>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-[rgba(30,50,90,0.9)]">Low Stock Alerts</h3>
                <p className="text-xs text-[rgba(30,50,90,0.5)]">Receive email when items drop below threshold.</p>
              </div>
              <div onClick={() => updateSection('notifications', 'lowStockAlerts', !settings.notifications.lowStockAlerts)} className={`w-12 h-6 rounded-full flex items-center p-1 cursor-pointer transition-colors ${settings.notifications.lowStockAlerts ? 'bg-[rgba(30,50,90,0.7)] justify-end shadow-inner' : 'bg-white/50 border border-white/40'}`}>
                <div className={`w-4 h-4 rounded-full shadow-sm transition-transform ${settings.notifications.lowStockAlerts ? 'bg-white' : 'bg-[rgba(30,50,90,0.3)]'}`}></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-[rgba(30,50,90,0.9)]">Daily Summary</h3>
                <p className="text-xs text-[rgba(30,50,90,0.5)]">Get a daily digest of inventory changes.</p>
              </div>
              <div onClick={() => updateSection('notifications', 'dailySummary', !settings.notifications.dailySummary)} className={`w-12 h-6 rounded-full flex items-center p-1 cursor-pointer transition-colors ${settings.notifications.dailySummary ? 'bg-[rgba(30,50,90,0.7)] justify-end shadow-inner' : 'bg-white/50 border border-white/40'}`}>
                <div className={`w-4 h-4 rounded-full shadow-sm transition-transform ${settings.notifications.dailySummary ? 'bg-white' : 'bg-[rgba(30,50,90,0.3)]'}`}></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-[rgba(30,50,90,0.9)]">Order Updates</h3>
                <p className="text-xs text-[rgba(30,50,90,0.5)]">Notify user about relevant order status changes.</p>
              </div>
              <div onClick={() => updateSection('notifications', 'orderUpdates', !settings.notifications.orderUpdates)} className={`w-12 h-6 rounded-full flex items-center p-1 cursor-pointer transition-colors ${settings.notifications.orderUpdates ? 'bg-[rgba(30,50,90,0.7)] justify-end shadow-inner' : 'bg-white/50 border border-white/40'}`}>
                <div className={`w-4 h-4 rounded-full shadow-sm transition-transform ${settings.notifications.orderUpdates ? 'bg-white' : 'bg-[rgba(30,50,90,0.3)]'}`}></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-[rgba(30,50,90,0.9)]">Stock Movement Alerts</h3>
                <p className="text-xs text-[rgba(30,50,90,0.5)]">Notify user about important inventory movements.</p>
              </div>
              <div onClick={() => updateSection('notifications', 'stockMovementAlerts', !settings.notifications.stockMovementAlerts)} className={`w-12 h-6 rounded-full flex items-center p-1 cursor-pointer transition-colors ${settings.notifications.stockMovementAlerts ? 'bg-[rgba(30,50,90,0.7)] justify-end shadow-inner' : 'bg-white/50 border border-white/40'}`}>
                <div className={`w-4 h-4 rounded-full shadow-sm transition-transform ${settings.notifications.stockMovementAlerts ? 'bg-white' : 'bg-[rgba(30,50,90,0.3)]'}`}></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-[rgba(30,50,90,0.9)]">Email Notifications</h3>
                <p className="text-xs text-[rgba(30,50,90,0.5)]">Controls whether email notifications are allowed globally.</p>
              </div>
              <div onClick={() => updateSection('notifications', 'emailNotifications', !settings.notifications.emailNotifications)} className={`w-12 h-6 rounded-full flex items-center p-1 cursor-pointer transition-colors ${settings.notifications.emailNotifications ? 'bg-[rgba(30,50,90,0.7)] justify-end shadow-inner' : 'bg-white/50 border border-white/40'}`}>
                <div className={`w-4 h-4 rounded-full shadow-sm transition-transform ${settings.notifications.emailNotifications ? 'bg-white' : 'bg-[rgba(30,50,90,0.3)]'}`}></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-[rgba(30,50,90,0.9)]">Browser Notifications</h3>
                <p className="text-xs text-[rgba(30,50,90,0.5)]">Receive push notifications in the browser.</p>
              </div>
              <div onClick={() => {
                const val = !settings.notifications.browserNotifications;
                if (val && Notification.permission !== 'granted') {
                  Notification.requestPermission().then(p => {
                    if (p === 'granted') {
                      updateSection('notifications', 'browserNotifications', true);
                    } else {
                      showToast('Browser permission denied.', 'error');
                    }
                  });
                } else {
                  updateSection('notifications', 'browserNotifications', val);
                }
              }} className={`w-12 h-6 rounded-full flex items-center p-1 cursor-pointer transition-colors ${settings.notifications.browserNotifications ? 'bg-[rgba(30,50,90,0.7)] justify-end shadow-inner' : 'bg-white/50 border border-white/40'}`}>
                <div className={`w-4 h-4 rounded-full shadow-sm transition-transform ${settings.notifications.browserNotifications ? 'bg-white' : 'bg-[rgba(30,50,90,0.3)]'}`}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-2">
          {hasUnsavedChanges ? (
            <div className="flex gap-2">
              <button onClick={() => setShowUnsavedWarning(true)} className="text-xs text-[rgba(30,50,90,0.6)] hover:text-red-500 font-medium px-4 py-2 rounded-full transition-colors">
                Cancel
              </button>
            </div>
          ) : <div></div>}
          <button
            onClick={handleSave}
            disabled={!hasUnsavedChanges || saving}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full transition-all text-sm shadow-md ${hasUnsavedChanges && !saving ? 'bg-[rgba(30,50,90,0.8)] hover:bg-[rgba(30,50,90,1)] text-white' : 'bg-[rgba(30,50,90,0.3)] text-white/70 cursor-not-allowed'}`}
          >
            {saving ? <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>



      {/* Unsaved Warning Modal */}
      <AnimatePresence>
        {showUnsavedWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white/90 backdrop-blur-xl border border-white/50 rounded-[1.5rem] p-6 shadow-xl max-w-sm w-full text-center"
            >
              <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-[rgba(30,50,90,0.9)] mb-2">Unsaved Changes</h3>
              <p className="text-sm text-[rgba(30,50,90,0.6)] mb-6">You have unsaved changes. Are you sure you want to discard them?</p>
              <div className="flex justify-center gap-3">
                <button onClick={() => setShowUnsavedWarning(false)} className="px-4 py-2 rounded-full bg-white/50 border border-white/40 text-sm font-medium text-[rgba(30,50,90,0.7)] hover:bg-white/80 transition-colors">Stay</button>
                <button onClick={() => { reset(); setShowUnsavedWarning(false); }} className="px-4 py-2 rounded-full bg-red-500/10 text-red-600 text-sm font-medium hover:bg-red-500/20 transition-colors">Leave</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toasts */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <div className={`px-4 py-3 rounded-2xl shadow-lg backdrop-blur-xl border flex items-center gap-3 ${toast.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-700' : 'bg-red-500/10 border-red-500/20 text-red-700'}`}>
              {toast.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              <p className="text-sm font-medium">{toast.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
