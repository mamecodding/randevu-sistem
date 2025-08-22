import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { mockAppointments } from '../../data/mockData';
import { Calendar, Clock, User, MessageSquare, X } from 'lucide-react';
import FeedbackModal from './FeedbackModal';

const AppointmentList: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const userAppointments = mockAppointments.filter(app => 
    app.studentId === user?.id || app.teacherId === user?.id
  );

  const upcomingAppointments = userAppointments.filter(app => 
    app.status === 'Confirmed' && new Date(app.appointmentTime) > new Date()
  );

  const pastAppointments = userAppointments.filter(app => 
    app.status === 'Completed' || app.status === 'Cancelled' || 
    (app.status === 'Confirmed' && new Date(app.appointmentTime) <= new Date())
  );

  const handleCancelAppointment = (appointmentId: string) => {
    // In a real app, this would make an API call
    alert('Randevu başarıyla iptal edildi!');
  };

  const handleLeaveFeedback = (appointmentId: string) => {
    setSelectedAppointment(appointmentId);
    setShowFeedbackModal(true);
  };

  const AppointmentCard = ({ appointment, showActions = false }: { appointment: any; showActions?: boolean }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <User className="h-5 w-5 text-gray-400" />
            <div>
              <h3 className="font-medium text-gray-900">
                {user?.role === 'Student' ? appointment.teacherName : appointment.studentName}
              </h3>
              <p className="text-sm text-gray-600">
                {user?.role === 'Student' ? appointment.teacherBranch : 'Öğrenci'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>{new Date(appointment.appointmentTime).toLocaleDateString('tr-TR')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>
                {new Date(appointment.appointmentTime).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>

          {appointment.subject && (
            <p className="text-sm text-gray-700 mb-3">
              <strong>Konu:</strong> {appointment.subject}
            </p>
          )}

          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            appointment.status === 'Completed' ? 'bg-green-100 text-green-800' :
            appointment.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
            'bg-red-100 text-red-800'
          }`}>
            {appointment.status === 'Completed' ? 'Tamamlandı' : 
             appointment.status === 'Confirmed' ? 'Onaylandı' : 'İptal Edildi'}
          </span>
        </div>

        {showActions && (
          <div className="flex space-x-2 ml-4">
            {appointment.status === 'Confirmed' && new Date(appointment.appointmentTime) > new Date() && (
              <button
                onClick={() => handleCancelAppointment(appointment.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
                title="Randevuyu iptal et"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            {appointment.status === 'Completed' && user?.role === 'Student' && (
              <button
                onClick={() => handleLeaveFeedback(appointment.id)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
                title="Geri bildirim bırak"
              >
                <MessageSquare className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Randevularım</h2>
        <p className="mt-2 text-gray-600">Özel ders seanslarınızı yönetin</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit mx-auto">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
            activeTab === 'upcoming'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Yaklaşan ({upcomingAppointments.length})
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
            activeTab === 'past'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Geçmiş ({pastAppointments.length})
        </button>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {activeTab === 'upcoming' && (
          <>
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map(appointment => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  showActions={true}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Yaklaşan randevu bulunmuyor</p>
                <p className="text-sm text-gray-400 mt-1">Başlamak için bir seans ayarlayın</p>
              </div>
            )}
          </>
        )}

        {activeTab === 'past' && (
          <>
            {pastAppointments.length > 0 ? (
              pastAppointments.map(appointment => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  showActions={true}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Geçmiş randevu bulunmuyor</p>
                <p className="text-sm text-gray-400 mt-1">Tamamlanan seanslarınız burada görünecek</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && selectedAppointment && (
        <FeedbackModal
          appointmentId={selectedAppointment}
          onClose={() => {
            setShowFeedbackModal(false);
            setSelectedAppointment(null);
          }}
          onSubmit={(rating, comment) => {
            alert('Geri bildirim başarıyla gönderildi!');
            setShowFeedbackModal(false);
            setSelectedAppointment(null);
          }}
        />
      )}
    </div>
  );
};

export default AppointmentList;