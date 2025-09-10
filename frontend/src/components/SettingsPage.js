import React, { useState } from 'react';

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    // User Profile
    profile: {
      name: 'Demo Officer',
      email: 'officer@demo.com',
      badge: 'NK001',
      department: 'Tourist Safety Unit',
      rank: 'Inspector'
    },
    
    // Notification Settings
    notifications: {
      emailAlerts: true,
      smsAlerts: true,
      pushNotifications: true,
      emergencyAlerts: true,
      dailyReports: false,
      weeklyReports: true
    },
    
    // Map Display Settings
    mapSettings: {
      defaultZoom: 12,
      showTrafficLayer: false,
      showSafetyZones: true,
      showTouristPaths: true,
      autoRefresh: true,
      refreshInterval: 30,
      markerAnimation: true
    },
    
    // Alert Thresholds
    alertThresholds: {
      lowSafetyScore: 40,
      criticalSafetyScore: 20,
      inactivityTimeout: 60,
      panicResponseTime: 5,
      maxTouristsPerZone: 50
    },
    
    // System Preferences
    system: {
      language: 'english',
      timezone: 'IST',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '24h',
      theme: 'dark',
      autoLogout: 120
    }
  });

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const saveSettings = () => {
    // Here you would typically save to backend
    console.log('Settings saved:', settings);
    // Show success toast
    alert('Settings saved successfully!');
  };

  const resetToDefaults = () => {
    if (window.confirm('Are you sure you want to reset all settings to default values?')) {
      // Reset to default settings
      setSettings({
        profile: {
          name: 'Demo Officer',
          email: 'officer@demo.com',
          badge: 'NK001',
          department: 'Tourist Safety Unit',
          rank: 'Inspector'
        },
        notifications: {
          emailAlerts: true,
          smsAlerts: true,
          pushNotifications: true,
          emergencyAlerts: true,
          dailyReports: false,
          weeklyReports: true
        },
        mapSettings: {
          defaultZoom: 12,
          showTrafficLayer: false,
          showSafetyZones: true,
          showTouristPaths: true,
          autoRefresh: true,
          refreshInterval: 30,
          markerAnimation: true
        },
        alertThresholds: {
          lowSafetyScore: 40,
          criticalSafetyScore: 20,
          inactivityTimeout: 60,
          panicResponseTime: 5,
          maxTouristsPerZone: 50
        },
        system: {
          language: 'english',
          timezone: 'IST',
          dateFormat: 'DD/MM/YYYY',
          timeFormat: '24h',
          theme: 'dark',
          autoLogout: 120
        }
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="section-title">System Settings</h2>
        <div className="flex gap-3">
          <button
            onClick={resetToDefaults}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors"
          >
            Reset to Defaults
          </button>
          <button
            onClick={saveSettings}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
          >
            Save Settings
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* User Profile Settings */}
        <div className="stat-card">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            User Profile
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Full Name</label>
              <input
                type="text"
                value={settings.profile.name}
                onChange={(e) => handleSettingChange('profile', 'name', e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Badge Number</label>
              <input
                type="text"
                value={settings.profile.badge}
                onChange={(e) => handleSettingChange('profile', 'badge', e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Department</label>
              <select
                value={settings.profile.department}
                onChange={(e) => handleSettingChange('profile', 'department', e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
              >
                <option value="Tourist Safety Unit">Tourist Safety Unit</option>
                <option value="Emergency Response">Emergency Response</option>
                <option value="Investigation Division">Investigation Division</option>
                <option value="Border Security">Border Security</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Rank</label>
              <select
                value={settings.profile.rank}
                onChange={(e) => handleSettingChange('profile', 'rank', e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
              >
                <option value="Constable">Constable</option>
                <option value="Head Constable">Head Constable</option>
                <option value="Sub Inspector">Sub Inspector</option>
                <option value="Inspector">Inspector</option>
                <option value="Superintendent">Superintendent</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="stat-card">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM9 17H4l5 5v-5zM15 7h5l-5-5v5zM9 7H4L9 2v5z" />
            </svg>
            Notification Preferences
          </h3>
          <div className="space-y-4">
            {Object.entries(settings.notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <label className="text-gray-300 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => handleSettingChange('notifications', key, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Map Display Settings */}
        <div className="stat-card">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            Map Display Settings
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Default Zoom Level</label>
              <input
                type="range"
                min="8"
                max="18"
                value={settings.mapSettings.defaultZoom}
                onChange={(e) => handleSettingChange('mapSettings', 'defaultZoom', parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-sm text-gray-400">Current: {settings.mapSettings.defaultZoom}</div>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Auto Refresh Interval (seconds)</label>
              <input
                type="number"
                min="10"
                max="300"
                value={settings.mapSettings.refreshInterval}
                onChange={(e) => handleSettingChange('mapSettings', 'refreshInterval', parseInt(e.target.value))}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
              />
            </div>
            {['showTrafficLayer', 'showSafetyZones', 'showTouristPaths', 'autoRefresh', 'markerAnimation'].map(key => (
              <div key={key} className="flex items-center justify-between">
                <label className="text-gray-300 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.mapSettings[key]}
                    onChange={(e) => handleSettingChange('mapSettings', key, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Alert Thresholds */}
        <div className="stat-card">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            Alert Thresholds
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Low Safety Score Threshold</label>
              <input
                type="number"
                min="10"
                max="80"
                value={settings.alertThresholds.lowSafetyScore}
                onChange={(e) => handleSettingChange('alertThresholds', 'lowSafetyScore', parseInt(e.target.value))}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Critical Safety Score Threshold</label>
              <input
                type="number"
                min="5"
                max="50"
                value={settings.alertThresholds.criticalSafetyScore}
                onChange={(e) => handleSettingChange('alertThresholds', 'criticalSafetyScore', parseInt(e.target.value))}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Inactivity Timeout (minutes)</label>
              <input
                type="number"
                min="15"
                max="240"
                value={settings.alertThresholds.inactivityTimeout}
                onChange={(e) => handleSettingChange('alertThresholds', 'inactivityTimeout', parseInt(e.target.value))}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Panic Response Time (minutes)</label>
              <input
                type="number"
                min="1"
                max="30"
                value={settings.alertThresholds.panicResponseTime}
                onChange={(e) => handleSettingChange('alertThresholds', 'panicResponseTime', parseInt(e.target.value))}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
              />
            </div>
          </div>
        </div>

        {/* System Preferences */}
        <div className="stat-card lg:col-span-2">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            System Preferences
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Language</label>
                <select
                  value={settings.system.language}
                  onChange={(e) => handleSettingChange('system', 'language', e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                >
                  <option value="english">English</option>
                  <option value="hindi">Hindi</option>
                  <option value="assamese">Assamese</option>
                  <option value="bengali">Bengali</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Timezone</label>
                <select
                  value={settings.system.timezone}
                  onChange={(e) => handleSettingChange('system', 'timezone', e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                >
                  <option value="IST">IST (India Standard Time)</option>
                  <option value="UTC">UTC</option>
                  <option value="EST">EST</option>
                  <option value="PST">PST</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Date Format</label>
                <select
                  value={settings.system.dateFormat}
                  onChange={(e) => handleSettingChange('system', 'dateFormat', e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Time Format</label>
                <select
                  value={settings.system.timeFormat}
                  onChange={(e) => handleSettingChange('system', 'timeFormat', e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                >
                  <option value="24h">24 Hour</option>
                  <option value="12h">12 Hour (AM/PM)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Theme</label>
                <select
                  value={settings.system.theme}
                  onChange={(e) => handleSettingChange('system', 'theme', e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                >
                  <option value="dark">Dark Theme</option>
                  <option value="light">Light Theme</option>
                  <option value="auto">Auto (System)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Auto Logout (minutes)</label>
                <input
                  type="number"
                  min="30"
                  max="480"
                  value={settings.system.autoLogout}
                  onChange={(e) => handleSettingChange('system', 'autoLogout', parseInt(e.target.value))}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="stat-card">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <svg className="w-6 h-6 mr-2 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Security Settings
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors">
            Change Password
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors">
            Enable 2FA
          </button>
          <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors">
            View Login History
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;