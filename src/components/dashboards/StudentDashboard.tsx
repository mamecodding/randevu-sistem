import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { mockAppointments } from '../../data/mockData';
import { Calendar, Clock, BookOpen, Star, Plus } from 'lucide-react';
import TeacherList from '../booking/TeacherList';
import AppointmentList from '../appointments/AppointmentList';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  
  const myAppointments = mockAppointments.filter(app => app.studentId === user?.id);
  const upcomingAppointments = myAppointments.filter(app => 
    app.status === 'Confirmed' && new Date(app.appointmentTime) > new Date()
  );
  const completedAppointments = myAppointments.filter(app => app.status === 'Completed');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BookOpen },
    { id: 'book', label: 'Book Appointment', icon: Plus },
    { id: 'appointments', label: 'My Appointments', icon: Calendar },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
        <p className="mt-2 text-gray-600">Manage your tutoring sessions and track your progress.</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stats Cards */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{upcomingAppointments.length}</p>
                  <p className="text-gray-600">Upcoming Sessions</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{completedAppointments.length}</p>
                  <p className="text-gray-600">Completed Sessions</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center">
                <Star className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{completedAppointments.length}</p>
                  <p className="text-gray-600">Feedback Given</p>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Appointments */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Upcoming Sessions</h2>
              </div>
              <div className="p-6">
                {upcomingAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingAppointments.map((appointment) => (
                      <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h3 className="font-medium text-gray-900">{appointment.teacherName}</h3>
                          <p className="text-sm text-gray-600">{appointment.teacherBranch}</p>
                          <p className="text-sm text-gray-500">{appointment.subject}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {new Date(appointment.appointmentTime).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(appointment.appointmentTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No upcoming sessions scheduled.</p>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
              </div>
              <div className="p-6 space-y-4">
                <button
                  onClick={() => setActiveTab('book')}
                  className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Book New Session
                </button>
                <button
                  onClick={() => setActiveTab('appointments')}
                  className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  View All Appointments
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'book' && <TeacherList />}
      {activeTab === 'appointments' && <AppointmentList />}
    </div>
  );
};

export default StudentDashboard;