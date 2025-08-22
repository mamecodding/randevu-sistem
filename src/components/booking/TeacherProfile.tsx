import React, { useState } from 'react';
import { mockUsers, mockTeacherProfiles, mockAvailability, mockAppointments } from '../../data/mockData';
import { ArrowLeft, Star, User, Calendar, Clock } from 'lucide-react';
import BookingCalendar from './BookingCalendar';

interface TeacherProfileProps {
  teacherId: string;
  onBack: () => void;
}

const TeacherProfile: React.FC<TeacherProfileProps> = ({ teacherId, onBack }) => {
  const teacher = mockUsers.find(u => u.id === teacherId);
  const profile = mockTeacherProfiles.find(p => p.userId === teacherId);
  const [showBooking, setShowBooking] = useState(false);

  if (!teacher || !profile) {
    return <div>Teacher not found</div>;
  }

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-200"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Teachers
      </button>

      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="p-8">
          <div className="flex items-start space-x-6">
            <div className="h-24 w-24 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="h-12 w-12 text-gray-600" />
            </div>
            
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{teacher.name}</h1>
              <p className="text-lg text-gray-600 mb-2">{profile.branch}</p>
              
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-5 w-5 ${i < Math.floor(profile.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                  ))}
                </div>
                <span className="ml-2 text-gray-600">
                  {profile.rating} ({profile.totalReviews} reviews)
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">About</h2>
            <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
          </div>

          <div className="mt-8 flex space-x-4">
            <button
              onClick={() => setShowBooking(!showBooking)}
              className="flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              <Calendar className="h-5 w-5 mr-2" />
              {showBooking ? 'Hide Calendar' : 'Book Appointment'}
            </button>
          </div>
        </div>
      </div>

      {showBooking && (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Available Times</h2>
            <p className="text-gray-600">Select an available time slot to book your appointment</p>
          </div>
          <BookingCalendar teacherId={teacherId} />
        </div>
      )}
    </div>
  );
};

export default TeacherProfile;