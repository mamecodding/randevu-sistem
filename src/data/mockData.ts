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
    branch: 'Matematik',
    bio: 'Matematik alanında doktora derecesine sahip, 10+ yıl öğretim deneyimi. Kalkülüs, cebir ve istatistik konularında uzman.',
    rating: 4.8,
    totalReviews: 24
  },
  {
    id: 'tp2',
    userId: '3',
    branch: 'Fizik',
    bio: 'Kuantum mekaniği, termodinamik ve elektromanyetizma konularında uzman Fizik Profesörü.',
    rating: 4.6,
    totalReviews: 18
  },
  {
    id: 'tp3',
    userId: '4',
    branch: 'Kimya',
    bio: 'Organik Kimya uzmanı, moleküler biyoloji ve biyokimya alanlarında araştırma geçmişine sahip.',
    rating: 4.9,
    totalReviews: 31
  }
];

// Generate availability slots for the next 30 days
export const mockAvailability: Availability[] = [];

// Function to generate availability for a teacher
const generateAvailabilityForTeacher = (teacherId: string) => {
  const today = new Date();
  
  for (let day = 0; day < 30; day++) {
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
};

// Generate availability for existing teachers
const existingTeacherIds = ['2', '3', '4'];
existingTeacherIds.forEach(generateAvailabilityForTeacher);

// Function to add availability for new teachers
export const addAvailabilityForNewTeacher = (teacherId: string) => {
  generateAvailabilityForTeacher(teacherId);
};

// Function to create teacher profile for new teachers
export const createTeacherProfile = (teacherId: string, teacherName: string) => {
  const newProfile: TeacherProfile = {
    id: `tp_${teacherId}`,
    userId: teacherId,
    branch: 'Genel',
    bio: `${teacherName} öğretmeni için profil oluşturuldu. Lütfen detayları güncelleyin.`,
    rating: 0,
    totalReviews: 0
  };
  
  mockTeacherProfiles.push(newProfile);
  return newProfile;
};

export const mockAppointments: Appointment[] = [
  {
    id: 'app1',
    studentId: '5',
    teacherId: '2',
    appointmentTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    status: 'Confirmed',
    subject: 'Kalkülüs türevleri',
    studentName: 'John Smith',
    teacherName: 'Dr. Sarah Johnson',
    teacherBranch: 'Matematik'
  },
  {
    id: 'app2',
    studentId: '6',
    teacherId: '3',
    appointmentTime: new Date(Date.now() + 48 * 60 * 60 * 1000), // Day after tomorrow
    status: 'Confirmed',
    subject: 'Kuantum mekaniği',
    studentName: 'Alice Brown',
    teacherName: 'Prof. Michael Chen',
    teacherBranch: 'Fizik'
  },
  {
    id: 'app3',
    studentId: '5',
    teacherId: '4',
    appointmentTime: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
    status: 'Completed',
    subject: 'Organik kimya reaksiyonları',
    studentName: 'John Smith',
    teacherName: 'Dr. Emily Rodriguez',
    teacherBranch: 'Kimya'
  }
];

export const mockFeedbacks: Feedback[] = [
  {
    id: 'fb1',
    appointmentId: 'app3',
    studentId: '5',
    teacherId: '4',
    rating: 5,
    comment: 'Organik kimya kavramlarının mükemmel açıklaması. Çok sabırlı ve yardımcı.',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000)
  }
];