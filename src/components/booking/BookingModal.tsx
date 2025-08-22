import React, { useState } from 'react';
import { X, Calendar, Clock, User } from 'lucide-react';
import { User as UserType } from '../../types';

interface BookingModalProps {
  slot: any;
  teacher: UserType;
  onClose: () => void;
  onConfirm: (subject: string) => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ slot, teacher, onClose, onConfirm }) => {
  const [subject, setSubject] = useState('');

  const handleConfirm = () => {
    onConfirm(subject);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Confirm Booking</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center space-x-3">
            <User className="h-5 w-5 text-gray-400" />
            <div>
              <p className="font-medium text-gray-900">{teacher.name}</p>
              <p className="text-sm text-gray-600">Teacher</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-gray-400" />
            <div>
              <p className="font-medium text-gray-900">
                {new Date(slot.startTime).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600">Date</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Clock className="h-5 w-5 text-gray-400" />
            <div>
              <p className="font-medium text-gray-900">
                {new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {' '}
                {new Date(slot.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
              <p className="text-sm text-gray-600">Time</p>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
              Subject/Topic (Optional)
            </label>
            <textarea
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="What would you like to discuss in this session?"
            />
          </div>
        </div>

        <div className="flex space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;