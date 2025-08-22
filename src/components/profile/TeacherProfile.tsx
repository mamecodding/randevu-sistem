import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { mockTeacherProfiles } from '../../data/mockData';
import { User, Save, Star } from 'lucide-react';

const TeacherProfile: React.FC = () => {
  const { user } = useAuth();
  const teacherProfile = mockTeacherProfiles.find(p => p.userId === user?.id);
  
  const [formData, setFormData] = useState({
    branch: teacherProfile?.branch || '',
    bio: teacherProfile?.bio || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would make an API call to update the profile
    alert('Profile updated successfully!');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>
        <p className="mt-2 text-gray-600">Update your teaching profile information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Overview */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <div className="text-center">
              <div className="h-24 w-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-12 w-12 text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{user?.name}</h3>
              <p className="text-gray-600">{formData.branch || 'Subject not set'}</p>
              
              {teacherProfile && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < Math.floor(teacherProfile.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {teacherProfile.rating} ({teacherProfile.totalReviews} reviews)
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Edit Profile</h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={user?.name || ''}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">Name cannot be changed</p>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              <div>
                <label htmlFor="branch" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject/Branch
                </label>
                <input
                  type="text"
                  id="branch"
                  name="branch"
                  value={formData.branch}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="e.g., Mathematics, Physics, Chemistry"
                />
              </div>

              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows={5}
                  value={formData.bio}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                  placeholder="Tell students about your expertise, teaching style, and experience..."
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors duration-200"
                >
                  <Save className="h-5 w-5 mr-2" />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;