import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { dataService } from '../../services/dataService';
import { ChevronLeft, ChevronRight, Clock, Check } from 'lucide-react';
import BookingModal from './BookingModal';

interface BookingCalendarProps {
  teacherId: string;
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({ teacherId }) => {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [teacher, setTeacher] = useState<any>(null);
  const [availability, setAvailability] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [teacherData, availabilityData] = await Promise.all([
          dataService.getUserById(teacherId),
          dataService.getAvailabilityByTeacherId(teacherId)
        ]);
        
        setTeacher(teacherData);
        setAvailability(availabilityData);
      } catch (error) {
        console.error('Failed to load booking data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [teacherId]);

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

  const getAvailableSlotsForDate = (date: Date) => {
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    return teacherAvailability.filter(slot => {
      const slotDate = new Date(slot.startTime);
      return slotDate >= dayStart && slotDate <= dayEnd && !slot.isBooked;
    });
  };

  const handleSlotSelect = (slot: any) => {
    if (user?.role === 'Student') {
      setSelectedSlot(slot);
      setShowBookingModal(true);
    }
  };

  const days = getDaysInMonth();
  const monthNames = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Randevu verileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
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
          const availableSlots = getAvailableSlotsForDate(day);
          const hasSlots = availableSlots.length > 0;

          return (
            <div
              key={index}
              className={`min-h-[80px] p-2 border border-gray-200 ${
                isCurrentMonth ? 'bg-white' : 'bg-gray-50'
              } ${isToday ? 'bg-blue-50 border-blue-200' : ''}`}
            >
              <div className={`text-sm font-medium ${
                isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
              }`}>
                {day.getDate()}
              </div>
              
              {hasSlots && isCurrentMonth && (
                <div className="mt-1 space-y-1">
                  {availableSlots.slice(0, 3).map(slot => (
                    <button
                      key={slot.id}
                      onClick={() => handleSlotSelect(slot)}
                      className="w-full text-xs bg-green-100 text-green-800 px-2 py-1 rounded hover:bg-green-200 transition-colors duration-200"
                      disabled={user?.role !== 'Student'}
                    >
                      {new Date(slot.startTime).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                    </button>
                  ))}
                  {availableSlots.length > 3 && (
                    <div className="text-xs text-gray-500 text-center">
                      +{availableSlots.length - 3} tane daha
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {user?.role !== 'Student' && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">
            Sadece öğrenciler randevu alabilir. Seans ayarlamak için lütfen öğrenci hesabıyla giriş yapın.
          </p>
        </div>
      )}

      {showBookingModal && selectedSlot && (
        <BookingModal
          slot={selectedSlot}
          teacher={teacher!}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedSlot(null);
          }}
          onConfirm={() => {
            // Handle booking confirmation
            alert('Randevu başarıyla alındı!');
            setShowBookingModal(false);
            setSelectedSlot(null);
          }}
        />
      )}
    </div>
  );
};

export default BookingCalendar;