import React, { useState } from 'react';
import { mockUsers, mockTeacherProfiles } from '../../data/mockData';
import { Star, Book, User } from 'lucide-react';
import TeacherProfile from './TeacherProfile';

const TeacherList: React.FC = () => {
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null);

  const teachers = mockUsers.filter(user => user.role === 'Teacher');

  if (selectedTeacher) {
    return <TeacherProfile teacherId={selectedTeacher} onBack={() => setSelectedTeacher(null)} />;
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Find Your Perfect Tutor</h2>
        <p className="mt-2 text-gray-600">Browse our experienced teachers and book your session</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teachers.map((teacher) => {
          const profile = mockTeacherProfiles.find(p => p.userId === teacher.id);
          
          return (
            <div key={teacher.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-gray-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">{teacher.name}</h3>
                    <p className="text-sm text-gray-600">{profile?.branch || 'Subject not specified'}</p>
                  </div>
                </div>

                {profile && (
                  <>
                    <div className="flex items-center mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < Math.floor(profile.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-600">
                        {profile.rating} ({profile.totalReviews} reviews)
                      </span>
                    </div>

                    <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                      {profile.bio}
                    </p>
                  </>
                )}

                <button
                  onClick={() => setSelectedTeacher(teacher.id)}
                  className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors duration-200"
                >
                  <Book className="h-4 w-4 mr-2" />
                  View Profile & Book
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TeacherList;