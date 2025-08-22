import React, { useState, useEffect } from 'react';
import { dataService } from '../../services/dataService';
import { Users, Calendar, MessageSquare, BarChart3, User, UserPlus, Trash2, X } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any>(null);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Student' as 'Teacher' | 'Student'
  });

  const [users, setUsers] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [teacherProfiles, setTeacherProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [usersData, appointmentsData, feedbacksData, teacherProfilesData] = await Promise.all([
          dataService.getAllUsers(),
          dataService.getAllAppointments(),
          dataService.getAllFeedback(),
          dataService.getAllTeacherProfiles()
        ]);
        
        setUsers(usersData);
        setAppointments(appointmentsData);
        setFeedbacks(feedbacksData);
        setTeacherProfiles(teacherProfilesData);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const totalUsers = users.length;
  const totalTeachers = users.filter(u => u.role === 'Teacher').length;
  const totalStudents = users.filter(u => u.role === 'Student').length;
  const totalAppointments = appointments.length;
  const completedAppointments = appointments.filter(app => app.status === 'Completed').length;
  const totalFeedbacks = feedbacks.length;

  const handleAddUser = async () => {
    if (newUser.name && newUser.email && newUser.password) {
      try {
        const newUserObj = await dataService.createUser({
          name: newUser.name,
          email: newUser.email,
          role: newUser.role
        });
        
        setUsers(prev => [...prev, newUserObj]);
        
        // Reset form and close modal
        setNewUser({ name: '', email: '', password: '', role: 'Student' });
        setShowAddUserModal(false);
        
        alert('Kullanıcı başarıyla eklendi!');
      } catch (error) {
        alert('Kullanıcı eklenirken hata oluştu!');
        console.error('Add user error:', error);
      }
    } else {
      alert('Lütfen tüm alanları doldurun!');
    }
  };

  const handleDeleteUser = (userToDelete: any) => {
    setUserToDelete(userToDelete);
    setShowDeleteConfirmModal(true);
  };

  const confirmDeleteUser = async () => {
    if (userToDelete) {
      try {
        // Remove from local state
        setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
        alert('Kullanıcı başarıyla silindi!');
      } catch (error) {
        alert('Kullanıcı silinirken hata oluştu!');
        console.error('Delete user error:', error);
      }
    }
    setShowDeleteConfirmModal(false);
    setUserToDelete(null);
  };

  const tabs = [
    { id: 'overview', label: 'Genel Bakış', icon: BarChart3 },
    { id: 'users', label: 'Kullanıcı Yönetimi', icon: Users },
    { id: 'appointments', label: 'Tüm Randevular', icon: Calendar },
    { id: 'feedback', label: 'Geri Bildirim & Puanlar', icon: MessageSquare },
  ];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Veriler yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Yönetici Paneli</h1>
        <p className="mt-2 text-gray-600">Özel ders platformunu izleyin ve yönetin.</p>
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
                    ? 'border-purple-500 text-purple-600'
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
        <div className="space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
                  <p className="text-gray-600">Toplam Kullanıcı</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{totalAppointments}</p>
                  <p className="text-gray-600">Toplam Randevu</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center">
                <MessageSquare className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{totalFeedbacks}</p>
                  <p className="text-gray-600">Alınan Geri Bildirim</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">
                    {totalAppointments > 0 ? Math.round((completedAppointments / totalAppointments) * 100) : 0}%
                  </p>
                  <p className="text-gray-600">Tamamlanma Oranı</p>
                </div>
              </div>
            </div>
          </div>

          {/* User Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-md border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Kullanıcı Dağılımı</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Öğretmenler</span>
                    <span className="font-medium text-gray-900">{totalTeachers}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Öğrenciler</span>
                    <span className="font-medium text-gray-900">{totalStudents}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Yöneticiler</span>
                    <span className="font-medium text-gray-900">1</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Son Aktiviteler</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="text-sm">
                    <p className="text-gray-900">Yeni randevu alındı</p>
                    <p className="text-gray-500">2 saat önce</p>
                  </div>
                  <div className="text-sm">
                    <p className="text-gray-900">Geri bildirim gönderildi</p>
                    <p className="text-gray-500">5 saat önce</p>
                  </div>
                  <div className="text-sm">
                    <p className="text-gray-900">Yeni öğretmen kaydoldu</p>
                    <p className="text-gray-500">1 gün önce</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Kullanıcı Yönetimi</h2>
                <button 
                  onClick={() => setShowAddUserModal(true)}
                  className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-200"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Kullanıcı Ekle
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kullanıcı
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      E-posta
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rol
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <User className="h-8 w-8 text-gray-400" />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.role === 'Admin' ? 'bg-purple-100 text-purple-800' :
                          user.role === 'Teacher' ? 'bg-green-100 text-green-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {user.role === 'Admin' ? 'Yönetici' : user.role === 'Teacher' ? 'Öğretmen' : 'Öğrenci'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {user.role !== 'Admin' && (
                          <button 
                            onClick={() => handleDeleteUser(user)}
                            className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-md transition-colors duration-200"
                            title="Kullanıcıyı sil"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'appointments' && (
        <div className="bg-white rounded-lg shadow-md border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Tüm Randevular</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Öğrenci
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Öğretmen
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tarih & Saat
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Konu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {appointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {appointment.studentName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {appointment.teacherName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(appointment.appointmentTime).toLocaleDateString('tr-TR')} {' '}
                      {new Date(appointment.appointmentTime).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {appointment.subject || 'Belirtilmemiş'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        appointment.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        appointment.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {appointment.status === 'Completed' ? 'Tamamlandı' : 
                         appointment.status === 'Confirmed' ? 'Onaylandı' : 'İptal Edildi'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'feedback' && (
        <div className="space-y-6">
          {/* Teacher Ratings Summary */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Öğretmen Puanları Özeti</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {teacherProfiles.map((teacher) => {
                  const teacherUser = users.find(u => u.id === teacher.userId);
                  const teacherFeedbacks = feedbacks.filter(feedback => {
                    const appointment = appointments.find(app => app.id === feedback.appointmentId);
                    return appointment?.teacherId === teacher.userId;
                  });
                  
                  return (
                    <div key={teacher.id} className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200">
                      <h3 className="font-medium text-gray-900">{teacherUser?.name}</h3>
                      <p className="text-sm text-gray-600">{teacher.branch}</p>
                      <div className="mt-2 flex items-center justify-center">
                        <span className="text-2xl font-bold text-yellow-600">{teacher.rating}</span>
                        <span className="ml-1 text-gray-500">/ 5</span>
                      </div>
                      <p className="text-sm text-gray-500">{teacher.totalReviews} değerlendirme</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {teacherFeedbacks.length} geri bildirim
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Detailed Feedback Analysis */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Detaylı Geri Bildirim Analizi</h2>
              <p className="text-sm text-gray-600 mt-1">Öğretmenler hakkında verilen tüm geri bildirimleri inceleyin</p>
            </div>
            <div className="p-6">
                              {teacherProfiles.length > 0 ? (
                  <div className="space-y-6">
                    {teacherProfiles.map((teacher) => {
                      const teacherUser = users.find(u => u.id === teacher.userId);
                      const teacherFeedbacks = feedbacks.filter(feedback => {
                        const appointment = appointments.find(app => app.id === feedback.appointmentId);
                        return appointment?.teacherId === teacher.userId;
                      });
                    
                    if (teacherFeedbacks.length === 0) {
                      return (
                        <div key={teacher.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h3 className="font-medium text-gray-900">{teacherUser?.name}</h3>
                              <p className="text-sm text-gray-600">{teacher.branch} • {teacher.rating}/5 puan</p>
                            </div>
                            <span className="text-sm text-gray-500">Henüz geri bildirim yok</span>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div key={teacher.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">{teacherUser?.name}</h3>
                            <p className="text-sm text-gray-600">{teacher.branch} • {teacher.rating}/5 puan • {teacher.totalReviews} değerlendirme</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">
                              {teacherFeedbacks.length} geri bildirim
                            </p>
                            <p className="text-xs text-gray-500">Toplam</p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          {teacherFeedbacks.map((feedback) => {
                            const appointment = appointments.find(app => app.id === feedback.appointmentId);
                            const student = users.find(u => u.id === appointment?.studentId);
                            
                            return (
                              <div key={feedback.id} className="bg-gray-50 rounded-lg p-3 border-l-4 border-purple-500">
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-1">
                                      <span className="font-medium text-gray-900">{student?.name}</span>
                                      <span className="text-sm text-gray-500">•</span>
                                      <span className="text-sm text-gray-500">
                                        {new Date(feedback.createdAt).toLocaleDateString('tr-TR')}
                                      </span>
                                      <span className="text-sm text-gray-500">•</span>
                                      <span className="text-sm text-gray-500">
                                        {new Date(feedback.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                                      </span>
                                    </div>
                                    
                                    <div className="flex items-center space-x-1 mb-2">
                                      {[...Array(5)].map((_, i) => (
                                        <span key={i} className={`text-sm ${i < feedback.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                                          ★
                                        </span>
                                      ))}
                                      <span className="text-sm text-gray-600 ml-2">{feedback.rating}/5</span>
                                    </div>

                                    <div className="mb-2">
                                      <p className="text-sm text-gray-700">{feedback.comment}</p>
                                    </div>

                                    <div className="text-xs text-gray-500">
                                      <span className="font-medium">Seans:</span> {appointment?.subject || 'Belirtilmemiş'} • 
                                      <span className="font-medium ml-2">Tarih:</span> {appointment ? new Date(appointment.appointmentTime).toLocaleDateString('tr-TR') : 'Belirtilmemiş'}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">Henüz öğretmen profili bulunmuyor.</p>
              )}
            </div>
          </div>

          {/* Recent Feedback Timeline */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Son Geri Bildirimler Zaman Çizelgesi</h2>
              <p className="text-sm text-gray-600 mt-1">En son verilen geri bildirimleri kronolojik sırayla görün</p>
            </div>
            <div className="p-6">
              {feedbacks.length > 0 ? (
                <div className="space-y-4">
                  {feedbacks
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .slice(0, 10)
                    .map((feedback) => {
                      const appointment = appointments.find(app => app.id === feedback.appointmentId);
                      const student = users.find(u => u.id === appointment?.studentId);
                      const teacher = users.find(u => u.id === appointment?.teacherId);
                      
                      return (
                        <div key={feedback.id} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                              <span className="text-purple-600 font-medium text-sm">
                                {student?.name?.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-gray-900">{student?.name}</span>
                                <span className="text-sm text-gray-500">→</span>
                                <span className="font-medium text-gray-900">{teacher?.name}</span>
                              </div>
                              <span className="text-sm text-gray-500">
                                {new Date(feedback.createdAt).toLocaleDateString('tr-TR')} {' '}
                                {new Date(feedback.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            
                            <div className="flex items-center space-x-1 mb-2">
                              {[...Array(5)].map((_, i) => (
                                <span key={i} className={`text-sm ${i < feedback.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                                  ★
                                </span>
                              ))}
                              <span className="text-sm text-gray-600 ml-2">{feedback.rating}/5</span>
                            </div>
                            
                            <p className="text-gray-700 mb-2">{feedback.comment}</p>
                            
                            <div className="text-xs text-gray-500">
                              <span className="font-medium">Konu:</span> {appointment?.subject || 'Belirtilmemiş'} • 
                              <span className="font-medium ml-2">Seans Tarihi:</span> {appointment ? new Date(appointment.appointmentTime).toLocaleDateString('tr-TR') : 'Belirtilmemiş'}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">Henüz geri bildirim gönderilmemiş.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Yeni Kullanıcı Ekle</h2>
              <button
                onClick={() => setShowAddUserModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Ad Soyad
                </label>
                <input
                  type="text"
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Ad ve soyad girin"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  E-posta
                </label>
                <input
                  type="email"
                  id="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="E-posta adresi girin"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Şifre
                </label>
                <input
                  type="password"
                  id="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Şifre girin"
                />
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                  Rol
                </label>
                <select
                  id="role"
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value as 'Teacher' | 'Student' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="Student">Öğrenci</option>
                  <option value="Teacher">Öğretmen</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowAddUserModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200"
              >
                İptal
              </button>
              <button
                onClick={handleAddUser}
                className="flex-1 flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-200"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Kullanıcı Ekle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Confirmation Modal */}
      {showDeleteConfirmModal && userToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <Trash2 className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Kullanıcıyı Sil
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  <strong>{userToDelete.name}</strong> kullanıcısını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowDeleteConfirmModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200"
                  >
                    İptal
                  </button>
                  <button
                    onClick={confirmDeleteUser}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
                  >
                    <Trash2 className="h-4 w-4 mr-2 inline" />
                    Sil
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;