import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings as SettingsIcon, 
  Sun, 
  Moon, 
  Leaf, 
  Zap, 
  History, 
  ArrowUpRight, 
  User as UserIcon, 
  Camera, 
  Save, 
  LogOut,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import Cropper from 'react-easy-crop';
import { User, Theme } from '../types';
import { storage } from '../lib/storage';
import Tooltip from './ui/Tooltip';

interface SettingsSectionProps {
  user: User;
  onUpdate: (updatedUser: User) => void;
  onLogout: () => void;
}

export default function SettingsSection({ user, onUpdate, onLogout }: SettingsSectionProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'theme' | 'account'>('profile');
  const [name, setName] = useState(user.name);
  const [profilePic, setProfilePic] = useState(user.profilePic || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  // Cropping state
  const [image, setImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [showCropper, setShowCropper] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const themes: { id: Theme, label: string, icon: any, color: string, tooltip: string }[] = [
    { id: 'light', label: 'Light Mode', icon: Sun, color: 'bg-amber-50 text-amber-600', tooltip: 'Classic clean look for bright environments' },
    { id: 'dark', label: 'Dark Mode', icon: Moon, color: 'bg-slate-900 text-slate-100', tooltip: 'Easy on the eyes for low-light environments' },
    { id: 'emerald', label: 'Premium Green', icon: Leaf, color: 'bg-emerald-50 text-emerald-600', tooltip: 'Exclusive emerald aesthetic for a luxury feel' },
  ];

  const handleThemeChange = async (theme: Theme) => {
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${storage.getToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ theme }),
      });
      
      if (res.ok) {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const updatedUser = await res.json();
          onUpdate(updatedUser);
        }
      }
    } catch (err) {
      console.error('Failed to update theme', err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImage(reader.result as string);
        setShowCropper(true);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const getCroppedImg = async (imageSrc: string, pixelCrop: any): Promise<string> => {
    const image = new Image();
    image.src = imageSrc;
    await new Promise((resolve) => (image.onload = resolve));

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return canvas.toDataURL('image/jpeg');
  };

  const handleCropSave = async () => {
    if (image && croppedAreaPixels) {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels);
      setProfilePic(croppedImage);
      setShowCropper(false);
      setImage(null);
    }
  };

  const handleProfileSave = async () => {
    setIsSaving(true);
    setSaveStatus('idle');
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${storage.getToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, profilePic }),
      });
      
      if (res.ok) {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const updatedUser = await res.json();
          onUpdate(updatedUser);
          setSaveStatus('success');
          setTimeout(() => setSaveStatus('idle'), 3000);
        } else {
          setSaveStatus('error');
        }
      } else {
        setSaveStatus('error');
      }
    } catch (err) {
      console.error(err);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:w-72 flex-shrink-0">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-[2.5rem] p-6 shadow-xl border border-slate-100 sticky top-8"
          >
            <div className="flex items-center gap-3 mb-8 px-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                <SettingsIcon className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-black text-slate-900">Settings</h2>
            </div>

            <nav className="space-y-2">
              <SidebarButton 
                active={activeTab === 'profile'} 
                onClick={() => setActiveTab('profile')} 
                icon={UserIcon} 
                label="Profile" 
              />
              <SidebarButton 
                active={activeTab === 'theme'} 
                onClick={() => setActiveTab('theme')} 
                icon={Sun} 
                label="Appearance" 
              />
              <SidebarButton 
                active={activeTab === 'account'} 
                onClick={() => setActiveTab('account')} 
                icon={Zap} 
                label="Account & Usage" 
              />
            </nav>

            <div className="mt-8 pt-8 border-t border-slate-100">
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-500 rounded-2xl font-bold text-sm hover:bg-red-50 transition-all"
              >
                <LogOut className="w-4 h-4" />
                Log Out
              </button>
            </div>
          </motion.div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-slate-100"
              >
                <h3 className="text-2xl font-black text-slate-900 mb-2">Profile Details</h3>
                <p className="text-slate-500 font-medium mb-8">Manage your identity and public presence</p>
                
                <div className="space-y-8 p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                  <div className="flex flex-col md:flex-row gap-10 items-start">
                    <div className="relative group">
                      <div className="w-32 h-32 rounded-[2rem] bg-slate-200 border-4 border-white shadow-xl overflow-hidden flex items-center justify-center text-slate-400">
                        {profilePic ? (
                          <img src={profilePic} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <UserIcon className="w-12 h-12" />
                        )}
                      </div>
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute -bottom-2 -right-2 p-3 bg-indigo-600 text-white rounded-2xl shadow-lg hover:bg-indigo-700 transition-all group-hover:scale-110"
                      >
                        <Camera className="w-5 h-5" />
                      </button>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        className="hidden" 
                        accept="image/*"
                      />
                    </div>

                    <div className="flex-1 space-y-6 w-full">
                      <div className="space-y-2">
                        <label className="text-sm font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                        <div className="relative">
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value.slice(0, 30))}
                            className="w-full px-6 py-4 rounded-2xl bg-white border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold text-slate-700 transition-all"
                            placeholder="Enter your name"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300 uppercase">
                            {name.length}/30
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <button
                          onClick={handleProfileSave}
                          disabled={isSaving || (name === user.name && profilePic === user.profilePic)}
                          className="flex-1 md:flex-none px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-200 hover:bg-indigo-700 disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center gap-2"
                        >
                          {isSaving ? <Zap className="w-5 h-5 animate-pulse" /> : <Save className="w-5 h-5" />}
                          Save Profile
                        </button>

                        <AnimatePresence>
                          {saveStatus === 'success' && (
                            <motion.div
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0 }}
                              className="flex items-center gap-2 text-green-600 font-bold text-sm"
                            >
                              <CheckCircle className="w-5 h-5" />
                              Saved!
                            </motion.div>
                          )}
                          {saveStatus === 'error' && (
                            <motion.div
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0 }}
                              className="flex items-center gap-2 text-red-600 font-bold text-sm"
                            >
                              <AlertCircle className="w-5 h-5" />
                              Failed to save
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'theme' && (
              <motion.div
                key="theme"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-slate-100"
              >
                <h3 className="text-2xl font-black text-slate-900 mb-2">Appearance</h3>
                <p className="text-slate-500 font-medium mb-8">Customize the look and feel of your studio</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {themes.map((t) => (
                    <Tooltip key={t.id} content={t.tooltip} position="bottom">
                      <button
                        onClick={() => handleThemeChange(t.id)}
                        className={`w-full flex flex-col items-center gap-4 p-6 rounded-3xl border-2 transition-all ${
                          user.theme === t.id 
                            ? 'border-indigo-600 bg-indigo-50/30 shadow-lg shadow-indigo-100' 
                            : 'border-slate-100 bg-slate-50 hover:border-slate-200'
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${t.color}`}>
                          <t.icon className="w-6 h-6" />
                        </div>
                        <span className={`font-black text-sm ${user.theme === t.id ? 'text-indigo-600' : 'text-slate-500'}`}>
                          {t.label}
                        </span>
                      </button>
                    </Tooltip>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'account' && (
              <motion.div
                key="account"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-slate-100">
                  <h3 className="text-2xl font-black text-slate-900 mb-2">Account Credits</h3>
                  <p className="text-slate-500 font-medium mb-8">Monitor your available generation power</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Tooltip content="Total generation power remaining in your account">
                      <div className="p-8 bg-indigo-50 rounded-[2rem] border border-indigo-100 h-full">
                        <div className="flex items-center gap-3 mb-4">
                          <Zap className="w-6 h-6 text-indigo-600 fill-current" />
                          <h4 className="text-lg font-black text-indigo-900">Credits Left</h4>
                        </div>
                        <p className="text-4xl font-black text-indigo-600 mb-2">{user.credits}</p>
                        <p className="text-indigo-400 text-sm font-bold">Ready for {Math.floor(user.credits / 20)} more viral scripts</p>
                      </div>
                    </Tooltip>
                    <Tooltip content="Total energy spent on your viral creations">
                      <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 h-full">
                        <div className="flex items-center gap-3 mb-4">
                          <ArrowUpRight className="w-6 h-6 text-slate-600" />
                          <h4 className="text-lg font-black text-slate-900">Credits Exhausted</h4>
                        </div>
                        <p className="text-4xl font-black text-slate-900 mb-2">{user.exhaustedCredits}</p>
                        <p className="text-slate-400 text-sm font-bold">Total scripts generated: {user.exhaustedCredits / 20}</p>
                      </div>
                    </Tooltip>
                  </div>
                </div>

                <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-slate-100">
                  <div className="flex items-center gap-3 mb-8">
                    <History className="w-6 h-6 text-indigo-600" />
                    <h3 className="text-2xl font-black text-slate-900">Usage History</h3>
                  </div>

                  <div className="space-y-4">
                    {user.usageHistory.length > 0 ? (
                      user.usageHistory.map((log) => (
                        <div key={log.id} className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100">
                          <div className="space-y-1">
                            <p className="font-bold text-slate-900 line-clamp-1">{log.topic}</p>
                            <p className="text-xs text-slate-400 font-medium">
                              {new Date(log.timestamp).toLocaleDateString()} • {new Date(log.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 px-3 py-1 bg-indigo-50 rounded-lg text-indigo-600 font-black text-xs">
                            <Zap className="w-3 h-3 fill-current" />
                            -{log.creditsUsed}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                        <p className="text-slate-400 font-bold">No usage history yet</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Photo Cropper Modal */}
      <AnimatePresence>
        {showCropper && image && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col h-[80vh]"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-900">Crop Profile Photo</h3>
                <button onClick={() => setShowCropper(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-all">
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>
              
              <div className="relative flex-1 bg-slate-900">
                <Cropper
                  image={image}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
              </div>

              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-black text-slate-400 uppercase tracking-widest">
                    <span>Zoom</span>
                    <span>{Math.round(zoom * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    aria-labelledby="Zoom"
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setShowCropper(false)}
                    className="flex-1 px-8 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black hover:bg-slate-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCropSave}
                    className="flex-1 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all"
                  >
                    Apply Crop
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SidebarButton({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all ${
        active 
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
          : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'
      }`}
    >
      <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
      {label}
    </button>
  );
}
