import { databaseService } from './database';
import { User, TeacherProfile, Availability, Appointment, Feedback } from '../types';

export class DataService {
  private static instance: DataService;
  private initialized = false;

  private constructor() {}

  static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    try {
      await databaseService.init();
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize data service:', error);
      throw error;
    }
  }

  // User operations
  async getAllUsers(): Promise<User[]> {
    await this.ensureInitialized();
    const result = databaseService.getAllUsers();
    return result.map(row => ({
      id: row[0],
      name: row[1],
      email: row[2],
      role: row[3]
    }));
  }

  async getUserById(id: string): Promise<User | null> {
    await this.ensureInitialized();
    const result = databaseService.getUserById(id);
    if (!result) return null;
    
    return {
      id: result[0],
      name: result[1],
      email: result[2],
      role: result[3]
    };
  }

  async getUserByEmail(email: string): Promise<User | null> {
    await this.ensureInitialized();
    const result = databaseService.getUserByEmail(email);
    if (!result) return null;
    
    return {
      id: result[0],
      name: result[1],
      email: result[2],
      role: result[3]
    };
  }

  async createUser(user: Omit<User, 'id'>): Promise<User> {
    await this.ensureInitialized();
    const id = Math.random().toString(36).substr(2, 9);
    const newUser: User = { ...user, id };
    
    databaseService.createUser(id, user.name, user.email, user.role);
    return newUser;
  }

  // Teacher profile operations
  async getAllTeacherProfiles(): Promise<TeacherProfile[]> {
    await this.ensureInitialized();
    const result = databaseService.getAllTeacherProfiles();
    return result.map(row => ({
      id: row[0],
      userId: row[1],
      branch: row[2],
      bio: row[3],
      rating: row[4] || 0,
      totalReviews: row[5] || 0
    }));
  }

  async createTeacherProfile(profile: Omit<TeacherProfile, 'id' | 'rating' | 'totalReviews'>): Promise<TeacherProfile> {
    await this.ensureInitialized();
    const id = `tp_${profile.userId}`;
    const newProfile: TeacherProfile = {
      ...profile,
      id,
      rating: 0,
      totalReviews: 0
    };
    
    databaseService.createTeacherProfile(id, profile.userId, profile.branch, profile.bio);
    return newProfile;
  }

  // Availability operations
  async getAllAvailability(): Promise<Availability[]> {
    await this.ensureInitialized();
    const result = databaseService.getAllAvailability();
    return result.map(row => ({
      id: row[0],
      teacherId: row[1],
      startTime: new Date(row[2]),
      endTime: new Date(row[3]),
      isBooked: Boolean(row[4])
    }));
  }

  async getAvailabilityByTeacherId(teacherId: string): Promise<Availability[]> {
    await this.ensureInitialized();
    const allAvailability = await this.getAllAvailability();
    return allAvailability.filter(av => av.teacherId === teacherId);
  }

  async createAvailability(availability: Omit<Availability, 'id'>): Promise<Availability> {
    await this.ensureInitialized();
    const id = `av_${availability.teacherId}_${Date.now()}`;
    const newAvailability: Availability = { ...availability, id };
    
    databaseService.createAvailability(
      id,
      availability.teacherId,
      availability.startTime.toISOString(),
      availability.endTime.toISOString()
    );
    return newAvailability;
  }

  // Appointment operations
  async getAllAppointments(): Promise<Appointment[]> {
    await this.ensureInitialized();
    const result = databaseService.getAllAppointments();
    return result.map(row => ({
      id: row[0],
      studentId: row[1],
      teacherId: row[2],
      appointmentTime: new Date(row[3]),
      status: row[4],
      subject: row[5],
      studentName: row[6],
      teacherName: row[7],
      teacherBranch: row[8]
    }));
  }

  async createAppointment(appointment: Omit<Appointment, 'id' | 'status'>): Promise<Appointment> {
    await this.ensureInitialized();
    const id = `app_${Date.now()}`;
    const newAppointment: Appointment = { ...appointment, id, status: 'Pending' };
    
    databaseService.createAppointment(
      id,
      appointment.studentId,
      appointment.teacherId,
      appointment.appointmentTime.toISOString(),
      appointment.subject || '',
      appointment.studentName,
      appointment.teacherName,
      appointment.teacherBranch
    );
    return newAppointment;
  }

  // Feedback operations
  async getAllFeedback(): Promise<Feedback[]> {
    await this.ensureInitialized();
    const result = databaseService.getAllFeedback();
    return result.map(row => ({
      id: row[0],
      appointmentId: row[1],
      studentId: row[2],
      teacherId: row[3],
      rating: row[4],
      comment: row[5],
      createdAt: new Date(row[6])
    }));
  }

  async createFeedback(feedback: Omit<Feedback, 'id' | 'createdAt'>): Promise<Feedback> {
    await this.ensureInitialized();
    const id = `fb_${Date.now()}`;
    const newFeedback: Feedback = {
      ...feedback,
      id,
      createdAt: new Date()
    };
    
    databaseService.createFeedback(
      id,
      feedback.appointmentId,
      feedback.studentId,
      feedback.teacherId,
      feedback.rating,
      feedback.comment
    );
    return newFeedback;
  }

  // Helper methods
  async generateAvailabilityForTeacher(teacherId: string): Promise<void> {
    await this.ensureInitialized();
    
    const today = new Date();
    const availabilitySlots: Omit<Availability, 'id'>[] = [];
    
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
        
        availabilitySlots.push({
          teacherId,
          startTime,
          endTime,
          isBooked: false
        });
      }
      
      // Add afternoon slots (2 PM - 5 PM)
      for (let hour = 14; hour < 17; hour++) {
        const startTime = new Date(currentDate);
        startTime.setHours(hour, 0, 0, 0);
        const endTime = new Date(startTime);
        endTime.setHours(hour + 1, 0, 0, 0);
        
        availabilitySlots.push({
          teacherId,
          startTime,
          endTime,
          isBooked: false
        });
      }
    }
    
    // Create all availability slots
    for (const slot of availabilitySlots) {
      await this.createAvailability(slot);
    }
  }

  private async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
    }
  }
}

// Export singleton instance
export const dataService = DataService.getInstance();
