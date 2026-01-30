'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { User, Bell, Shield, Palette, HelpCircle, Save, Camera, Eye, EyeOff } from 'lucide-react'

export default function SettingsPage() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState('profile')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  // Profile state
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: '',
    bio: '',
  })

  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    appointmentReminders: true,
    labResultAlerts: true,
    patientUpdates: false,
    systemUpdates: true,
    marketingEmails: false,
  })

  // Security settings state
  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  useEffect(() => {
    if (session?.user) {
      setProfileData({
        name: session.user.name || '',
        email: session.user.email || '',
        phone: session.user.phone || '',
        specialization: session.user.specialization || '',
        bio: session.user.bio || '',
      })
    }
  }, [session])

  const handleProfileSave = async () => {
    setIsLoading(true)
    setMessage('')

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setMessage('Profile updated successfully!')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage('Error updating profile')
    }

    setIsLoading(false)
  }

  const handleNotificationSave = async () => {
    setIsLoading(true)
    setMessage('')

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setMessage('Notification preferences saved!')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage('Error saving notification preferences')
    }

    setIsLoading(false)
  }

  const handlePasswordChange = async () => {
    setIsLoading(true)
    setMessage('')

    if (securityData.newPassword !== securityData.confirmPassword) {
      setMessage('New passwords do not match')
      setIsLoading(false)
      return
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setMessage('Password changed successfully!')
      setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage('Error changing password')
    }

    setIsLoading(false)
  }

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'help', name: 'Help & Support', icon: HelpCircle },
  ]

  return (
    <div className="container-elegant py-8">
      <div className="mb-8">
        <h1 className="heading-1 mb-2">Settings</h1>
        <p className="text-muted">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === tab.id
                    ? 'bg-cyan-500/20 text-cyan-700 border-l-4 border-cyan-500'
                    : 'text-slate-600 hover:bg-cyan-500/20 hover:text-cyan-700'
                    }`}
                >
                  <Icon className="h-5 w-5" />
                  {tab.name}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          {message && (
            <div className="alert alert-success mb-6">
              {message}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Profile Information</h2>
                <p className="text-muted">Update your personal information and profile details</p>
              </div>
              <div className="card-content space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white text-3xl font-bold">
                        {profileData.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border border-slate-200 hover:bg-slate-50">
                      <Camera className="h-4 w-4 text-slate-600" />
                    </button>
                  </div>
                  <div>
                    <h3 className="heading-4">Profile Picture</h3>
                    <p className="text-sm text-muted mb-2">JPG, PNG or GIF. Maximum size of 2MB</p>
                    <button className="btn btn-outline btn-sm">Choose File</button>
                  </div>
                </div>

                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="input"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="input"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      className="input"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="form-label">Specialization</label>
                    <input
                      type="text"
                      className="input"
                      value={profileData.specialization}
                      onChange={(e) => setProfileData({ ...profileData, specialization: e.target.value })}
                    />
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="form-label">Bio</label>
                  <textarea
                    className="textarea"
                    rows={4}
                    placeholder="Tell us about yourself..."
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleProfileSave}
                    disabled={isLoading}
                    className="btn btn-medical"
                  >
                    {isLoading ? (
                      <>
                        <div className="loading-spinner h-4 w-4"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">Email Notifications</h2>
                  <p className="text-muted">Choose what email notifications you want to receive</p>
                </div>
                <div className="card-content space-y-4">
                  {Object.entries({
                    emailNotifications: 'General email notifications',
                    appointmentReminders: 'Appointment reminders',
                    labResultAlerts: 'Lab result alerts',
                    patientUpdates: 'Patient status updates',
                    systemUpdates: 'System updates and maintenance',
                    marketingEmails: 'Marketing emails and newsletters',
                  }).map(([key, label]) => (
                    <div key={key} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                      <div>
                        <h4 className="font-medium text-slate-900">{label}</h4>
                        <p className="text-sm text-slate-500">
                          {key === 'appointmentReminders' && 'Get notified about upcoming appointments'}
                          {key === 'labResultAlerts' && 'Receive alerts when lab results are ready'}
                          {key === 'patientUpdates' && 'Updates on patient status and records'}
                          {key === 'systemUpdates' && 'Important system announcements'}
                          {key === 'marketingEmails' && 'Tips, tutorials, and product updates'}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings[key as keyof typeof notificationSettings]}
                          onChange={(e) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              [key]: e.target.checked,
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleNotificationSave}
                  disabled={isLoading}
                  className="btn btn-medical"
                >
                  {isLoading ? (
                    <>
                      <div className="loading-spinner h-4 w-4"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Preferences
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Security Settings</h2>
                <p className="text-muted">Manage your password and security preferences</p>
              </div>
              <div className="card-content space-y-6">
                {/* Change Password */}
                <div>
                  <h3 className="heading-4 mb-4">Change Password</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="form-label">Current Password</label>
                      <div className="relative">
                        <input
                          type={showPasswords.current ? 'text' : 'password'}
                          className="input pr-10"
                          value={securityData.currentPassword}
                          onChange={(e) =>
                            setSecurityData({ ...securityData, currentPassword: e.target.value })
                          }
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowPasswords({ ...showPasswords, current: !showPasswords.current })
                          }
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showPasswords.current ? (
                            <EyeOff className="h-4 w-4 text-slate-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-slate-400" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="form-label">New Password</label>
                      <div className="relative">
                        <input
                          type={showPasswords.new ? 'text' : 'password'}
                          className="input pr-10"
                          value={securityData.newPassword}
                          onChange={(e) =>
                            setSecurityData({ ...securityData, newPassword: e.target.value })
                          }
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowPasswords({ ...showPasswords, new: !showPasswords.new })
                          }
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showPasswords.new ? (
                            <EyeOff className="h-4 w-4 text-slate-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-slate-400" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="form-label">Confirm New Password</label>
                      <div className="relative">
                        <input
                          type={showPasswords.confirm ? 'text' : 'password'}
                          className="input pr-10"
                          value={securityData.confirmPassword}
                          onChange={(e) =>
                            setSecurityData({ ...securityData, confirmPassword: e.target.value })
                          }
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })
                          }
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showPasswords.confirm ? (
                            <EyeOff className="h-4 w-4 text-slate-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-slate-400" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Security Status */}
                <div className="border-t border-slate-100 pt-6">
                  <h3 className="heading-4 mb-4">Security Status</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Two-Factor Authentication</span>
                      <span className="badge badge-warning">Not Enabled</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Last Password Change</span>
                      <span className="text-sm text-slate-500">Never</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Active Sessions</span>
                      <span className="text-sm text-slate-500">1 device</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handlePasswordChange}
                    disabled={isLoading}
                    className="btn btn-medical"
                  >
                    {isLoading ? (
                      <>
                        <div className="loading-spinner h-4 w-4"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <Shield className="h-4 w-4" />
                        Update Password
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Appearance</h2>
                <p className="text-muted">Customize the look and feel of your workspace</p>
              </div>
              <div className="card-content space-y-6">
                <div>
                  <h3 className="heading-4 mb-4">Theme</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <button className="p-4 border-2 border-cyan-500 rounded-lg text-center">
                      <div className="w-full h-16 bg-white border border-slate-200 rounded mb-2"></div>
                      <span className="text-sm font-medium">Light</span>
                    </button>
                    <button className="p-4 border border-slate-200 rounded-lg text-center hover:border-slate-300">
                      <div className="w-full h-16 bg-slate-900 rounded mb-2"></div>
                      <span className="text-sm font-medium">Dark</span>
                    </button>
                    <button className="p-4 border border-slate-200 rounded-lg text-center hover:border-slate-300">
                      <div className="w-full h-16 bg-gradient-to-r from-white to-slate-900 rounded mb-2"></div>
                      <span className="text-sm font-medium">System</span>
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="heading-4 mb-4">Language & Region</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Language</label>
                      <select className="input">
                        <option>English (US)</option>
                        <option>Spanish</option>
                        <option>French</option>
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Time Zone</label>
                      <select className="input">
                        <option>UTC-5:00 Eastern Time</option>
                        <option>UTC-6:00 Central Time</option>
                        <option>UTC-7:00 Mountain Time</option>
                        <option>UTC-8:00 Pacific Time</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Help Tab */}
          {activeTab === 'help' && (
            <div className="space-y-6">
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">Help & Support</h2>
                  <p className="text-muted">Get help with ClinicSaaS and find answers to common questions</p>
                </div>
                <div className="card-content space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <a href="#" className="p-4 border border-slate-200 rounded-lg hover:border-cyan-300 hover:bg-cyan-50 transition-colors">
                      <h3 className="font-medium mb-2">Documentation</h3>
                      <p className="text-sm text-slate-600">Browse our comprehensive guides and tutorials</p>
                    </a>
                    <a href="#" className="p-4 border border-slate-200 rounded-lg hover:border-cyan-300 hover:bg-cyan-50 transition-colors">
                      <h3 className="font-medium mb-2">Video Tutorials</h3>
                      <p className="text-sm text-slate-600">Watch step-by-step video guides</p>
                    </a>
                    <a href="#" className="p-4 border border-slate-200 rounded-lg hover:border-cyan-300 hover:bg-cyan-50 transition-colors">
                      <h3 className="font-medium mb-2">FAQ</h3>
                      <p className="text-sm text-slate-600">Find answers to frequently asked questions</p>
                    </a>
                    <a href="#" className="p-4 border border-slate-200 rounded-lg hover:border-cyan-300 hover:bg-cyan-50 transition-colors">
                      <h3 className="font-medium mb-2">Contact Support</h3>
                      <p className="text-sm text-slate-600">Get in touch with our support team</p>
                    </a>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">About ClinicSaaS</h3>
                </div>
                <div className="card-content">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Version:</span>
                      <span className="font-medium">1.0.0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Last Updated:</span>
                      <span className="font-medium">December 21, 2024</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">License:</span>
                      <span className="font-medium">Professional</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}