import { User, TeacherProfile, Availability, Appointment, Feedback } from '../types';

export const mockUsers: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@school.edu', role: 'Admin' },
  { id: '2', name: 'Dr. Sarah Johnson', email: 'sarah@school.edu', role: 'Teacher' },
  { id: '3', name: 'Prof. Michael Chen', email: 'michael@school.edu', role: 'Teacher' },
  { id: '4', name: 'Dr. Emily Rodriguez', email: 'emily@school.edu', role: 'Teacher' },
  { id: '5', name: 'John Smith', email: 'john@student.edu', role: 'Student' },
  { id: '6', name: 'Alice Brown', email: 'alice@student.edu', role: 'Student' },
];

export const mockTeacherProfiles: TeacherProfile[] = [
  {
    id: 'tp1',
    userId: '2',
    branch: 'Mathematics',
    bio: 'PhD in Mathematics with 10+ years of teaching experience. Specializing in calculus, algebra, and statistics.',
    rating: 4.8,
    totalReviews: 24
  },
  {
    id: 'tp2',
    userId: '3',
    branch: 'Physics',
    bio: 'Professor of Physics with expertise in quantum mechanics, thermodynamics, and electromagnetism.',
    rating: 4.6,
    totalReviews: 18
  },
  {
    id: 'tp3',
    userId: '4',
    branch: 'Chemistry',
    bio: 'Organic Chemistry specialist with research background in molecular biology and biochemistry.',
    rating: 4.9,
    totalReviews: 31
  }
];

// Generate availability slots for the next 30 days
export const mockAvailability: Availability[] = [];
const teacherIds = ['2', '3', '4'];
const today = new Date();

for (let day = 0; day < 30; day++) {
  for (const teacherId of teacherIds) {
    const currentDate = new Date(today);
    currentDate.setDate(today.getDate() + day);
    
    // Skip weekends
    if (currentDate.getDay() === 0 || currentDate.getDay() === 6) continue;
    
    // Add morning slots (9 AM - 12 PM)
    for (let hour = 9; hour < 12; hour++) {
      const startTime = new Date(currentDate);
      startTime.setHours(hour, 0, 0, 0);
      const endTime = new Date(startTime);
      endTime.setHours(hour + 1, 0, 0, 0);
      
      mockAvailability.push({
        id: `av_${teacherId}_${day}_${hour}`,
        teacherId,
        startTime,
        endTime,
        isBooked: Math.random() > 0.7 // 30% chance of being booked
      });
    }
    
    // Add afternoon slots (2 PM - 5 PM)
    for (let hour = 14; hour < 17; hour++) {
      const startTime = new Date(currentDate);
      startTime.setHours(hour, 0, 0, 0);
      const endTime = new Date(startTime);
      endTime.setHours(hour + 1, 0, 0, 0);
      
      mockAvailability.push({
        id: `av_${teacherId}_${day}_${hour}`,
        teacherId,
        startTime,
        endTime,
        isBooked: Math.random() > 0.7 // 30% chance of being booked
      });
    }
  }
}

export const mockAppointments: Appointment[] = [
  {
    id: 'app1',
    studentId: '5',
    teacherId: '2',
    appointmentTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    status: 'Confirmed',
    subject: 'Calculus derivatives',
    studentName: 'John Smith',
    teacherName: 'Dr. Sarah Johnson',
    teacherBranch: 'Mathematics'
  },
  {
    id: 'app2',
    studentId: '6',
    teacherId: '3',
    appointmentTime: new Date(Date.now() + 48 * 60 * 60 * 1000), // Day after tomorrow
    status: 'Confirmed',
    subject: 'Quantum mechanics',
    studentName: 'Alice Brown',
    teacherName: 'Prof. Michael Chen',
    teacherBranch: 'Physics'
  },
  {
    id: 'app3',
    studentId: '5',
    teacherId: '4',
    appointmentTime: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
    status: 'Completed',
    subject: 'Organic chemistry reactions',
    studentName: 'John Smith',
    teacherName: 'Dr. Emily Rodriguez',
    teacherBranch: 'Chemistry'
  }
];

export const mockFeedbacks: Feedback[] = [
  {
    id: 'fb1',
    appointmentId: 'app3',
    studentId: '5',
    teacherId: '4',
    rating: 5,
    comment: 'Excellent explanation of organic chemistry concepts. Very patient and helpful.',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000)
  }
];