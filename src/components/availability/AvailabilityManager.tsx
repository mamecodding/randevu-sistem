import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { dataService } from '../../services/dataService';
import { Calendar, ChevronLeft, ChevronRight, Plus, Trash2, Clock } from 'lucide-react';

const AvailabilityManager: React.FC = () => {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showAddSlot, setShowAddSlot] = useState(false);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [availability, setAvailability] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAvailability = async () => {
      if (!user?.id) return;
      
      try {
        const data = await dataService.getAvailabilityByTeacherId(user.id);
        setAvailability(data);
      } catch (error) {
        console.error('Failed to load availability:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAvailability();
  }, [user?.id]);

  const teacherAvailability = availability;

  const navigateMonth = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const current = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  const getSlotsForDate = (date: Date) => {
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    return teacherAvailability.filter(slot => {
      const slotDate = new Date(slot.startTime);
      return slotDate >= dayStart && slotDate <= dayEnd;
    });
  };

  const handleAddSlot = async () => {
    if (!selectedDate) return;
    
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    
    const start = new Date(selectedDate);
    start.setHours(startHour, startMin, 0, 0);
    
    const end = new Date(selectedDate);
    end.setHours(endHour, endMin, 0, 0);
    
    // Create new availability slot
    const newSlot = await dataService.createAvailability({
      teacherId: user?.id || '',
      startTime: start,
      endTime: end,
      isBooked: false
    });
    
    // Update local state
    setAvailability(prev => [...prev, newSlot]);
    
    alert(`Müsaitlik zamanı eklendi: ${startTime} - ${endTime}`);
    setShowAddSlot(false);
    setStartTime('09:00');
    setEndTime('10:00');
  };

  const handleDeleteSlot = (slotId: string) => {
    // In a real app, this would make an API call
    alert('Müsaitlik zamanı silindi');
  };

  const days = getDaysInMonth();
  const monthNames = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Müsaitlik verileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Müsaitliğinizi Yönetin</h2>
        <p className="mt-2 text-gray-600">Öğrenci randevuları için müsait zaman dilimlerinizi ayarlayın</p>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        {/* Calendar Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <button
              onClick={() => navigateMonth(1)}
              className="p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'].map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              const isCurrentMonth = day.getMonth() === currentDate.getMonth();
              const isToday = day.toDateString() === new Date().toDateString();
              const slots = getSlotsForDate(day);
              const isSelected = selectedDate?.toDateString() === day.toDateString();

              return (
                <button
                  key={index}
                  onClick={() => setSelectedDate(day)}
                  className={`min-h-[80px] p-2 border border-gray-200 text-left transition-colors duration-200 ${
                    isCurrentMonth ? 'bg-white hover:bg-gray-50' : 'bg-gray-50'
                  } ${isToday ? 'bg-blue-50 border-blue-200' : ''} ${
                    isSelected ? 'ring-2 ring-green-500 border-green-500' : ''
                  }`}
                >
                  <div className={`text-sm font-medium ${
                    isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {day.getDate()}
                  </div>
                  
                  {slots.length > 0 && isCurrentMonth && (
                    <div className="mt-1">
                      <div className="text-xs text-green-600 font-medium">
                        {slots.length} zaman dilimi{slots.length > 1 ? '' : ''}
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Date Details */}
      {selectedDate && (
        <div className="bg-white rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              {selectedDate.toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </h3>
            <button
              onClick={() => setShowAddSlot(!showAddSlot)}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Zaman Ekle
            </button>
          </div>

          <div className="p-6">
            {showAddSlot && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Yeni Zaman Dilimi Ekle</h4>
                <div className="flex items-center space-x-4">
                  <div>
                    <label htmlFor="start-time" className="block text-sm font-medium text-gray-700 mb-1">
                      Başlangıç Saati
                    </label>
                    <input
                      type="time"
                      id="start-time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="end-time" className="block text-sm font-medium text-gray-700 mb-1">
                      Bitiş Saati
                    </label>
                    <input
                      type="time"
                      id="end-time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div className="flex space-x-2 pt-6">
                    <button
                      onClick={handleAddSlot}
                      className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors duration-200"
                    >
                      Ekle
                    </button>
                    <button
                      onClick={() => setShowAddSlot(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50 transition-colors duration-200"
                    >
                      İptal
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Existing Slots */}
            <div className="space-y-3">
              {getSlotsForDate(selectedDate).length > 0 ? (
                getSlotsForDate(selectedDate).map(slot => (
                  <div
                    key={slot.id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      slot.isBooked ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Clock className={`h-5 w-5 ${slot.isBooked ? 'text-red-600' : 'text-green-600'}`} />
                      <div>
                        <p className="font-medium text-gray-900">
                          {new Date(slot.startTime).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })} - {' '}
                          {new Date(slot.endTime).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <p className={`text-sm ${slot.isBooked ? 'text-red-600' : 'text-green-600'}`}>
                          {slot.isBooked ? 'Dolu' : 'Müsait'}
                        </p>
                      </div>
                    </div>
                    
                    {!slot.isBooked && (
                      <button
                        onClick={() => handleDeleteSlot(slot.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-md transition-colors duration-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Bu gün için müsaitlik ayarlanmamış</p>
                  <p className="text-sm text-gray-400 mt-1">İlk zaman diliminizi oluşturmak için "Zaman Ekle"ye tıklayın</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailabilityManager;