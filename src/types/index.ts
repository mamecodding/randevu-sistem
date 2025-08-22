export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Teacher' | 'Student';
}

export interface TeacherProfile {
  id: string;
  userId: string;
  branch: string;
  bio: string;
  rating?: number;
  totalReviews?: number;
}

export interface Availability {
  id: string;
  teacherId: string;
  startTime: Date;
  endTime: Date;
  isBooked: boolean;
}

export interface Appointment {
  id: string;
  studentId: string;
  teacherId: string;
  appointmentTime: Date;
  status: 'Confirmed' | 'Completed' | 'Cancelled';
  subject?: string;
  studentName?: string;
  teacherName?: string;
  teacherBranch?: string;
}

export interface Feedback {
  id: string;
  appointmentId: string;
  studentId: string;
  teacherId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signup: (name: string, email: string, password: string, role: 'Teacher' | 'Student') => Promise<boolean>;
}