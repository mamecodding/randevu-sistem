import initSqlJs from 'sql.js';

export interface DatabaseService {
  init(): Promise<void>;
  query(sql: string, params?: any[]): any[];
  execute(sql: string, params?: any[]): void;
  close(): void;
}

class SQLiteDatabaseService implements DatabaseService {
  private db: any = null;
  private initialized = false;

  async init(): Promise<void> {
    if (this.initialized) return;

    try {
      const SQL = await initSqlJs({
        locateFile: file => `https://sql.js.org/dist/${file}`
      });

      // Create new database
      this.db = new SQL.Database();
      
      // Create tables
      this.createTables();
      
      // Insert initial data
      this.insertInitialData();
      
      this.initialized = true;
      console.log('SQLite database initialized successfully');
    } catch (error) {
      console.error('Failed to initialize SQLite database:', error);
      throw error;
    }
  }

  private createTables(): void {
    // Users table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('Admin', 'Teacher', 'Student')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Teacher profiles table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS teacher_profiles (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        branch TEXT NOT NULL,
        bio TEXT,
        rating REAL DEFAULT 0,
        total_reviews INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);

    // Availability table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS availability (
        id TEXT PRIMARY KEY,
        teacher_id TEXT NOT NULL,
        start_time DATETIME NOT NULL,
        end_time DATETIME NOT NULL,
        is_booked BOOLEAN DEFAULT FALSE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (teacher_id) REFERENCES users (id)
      )
    `);

    // Appointments table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS appointments (
        id TEXT PRIMARY KEY,
        student_id TEXT NOT NULL,
        teacher_id TEXT NOT NULL,
        appointment_time DATETIME NOT NULL,
        status TEXT NOT NULL CHECK (status IN ('Pending', 'Confirmed', 'Completed', 'Cancelled')),
        subject TEXT,
        student_name TEXT NOT NULL,
        teacher_name TEXT NOT NULL,
        teacher_branch TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES users (id),
        FOREIGN KEY (teacher_id) REFERENCES users (id)
      )
    `);

    // Feedback table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS feedback (
        id TEXT PRIMARY KEY,
        appointment_id TEXT NOT NULL,
        student_id TEXT NOT NULL,
        teacher_id TEXT NOT NULL,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (appointment_id) REFERENCES appointments (id),
        FOREIGN KEY (student_id) REFERENCES users (id),
        FOREIGN KEY (teacher_id) REFERENCES users (id)
      )
    `);
  }

  private insertInitialData(): void {
    // Check if data already exists
    const userCount = this.db.exec("SELECT COUNT(*) as count FROM users")[0];
    if (userCount && userCount.values[0][0] > 0) return;

    // Insert admin user
    this.db.run(`
      INSERT INTO users (id, name, email, role) VALUES 
      ('1', 'Admin User', 'admin@school.edu', 'Admin')
    `);

    // Insert sample teachers
    this.db.run(`
      INSERT INTO users (id, name, email, role) VALUES 
      ('2', 'Dr. Sarah Johnson', 'sarah@school.edu', 'Teacher'),
      ('3', 'Prof. Michael Chen', 'michael@school.edu', 'Teacher'),
      ('4', 'Dr. Emily Rodriguez', 'emily@school.edu', 'Teacher')
    `);

    // Insert sample students
    this.db.run(`
      INSERT INTO users (id, name, email, role) VALUES 
      ('5', 'John Smith', 'john@student.edu', 'Student'),
      ('6', 'Alice Brown', 'alice@student.edu', 'Student')
    `);

    // Insert teacher profiles
    this.db.run(`
      INSERT INTO teacher_profiles (id, user_id, branch, bio, rating, total_reviews) VALUES 
      ('tp1', '2', 'Matematik', 'Matematik alanında doktora derecesine sahip, 10+ yıl öğretim deneyimi. Kalkülüs, cebir ve istatistik konularında uzman.', 4.8, 24),
      ('tp2', '3', 'Fizik', 'Kuantum mekaniği, termodinamik ve elektromanyetizma konularında uzman Fizik Profesörü.', 4.6, 18),
      ('tp3', '4', 'Kimya', 'Organik Kimya uzmanı, moleküler biyoloji ve biyokimya alanlarında araştırma geçmişine sahip.', 4.9, 31)
    `);

    // Insert sample availability
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
        
        this.db.run(`
          INSERT INTO availability (id, teacher_id, start_time, end_time, is_booked) VALUES 
          (?, ?, ?, ?, ?)
        `, [`av_2_${day}_${hour}`, '2', startTime.toISOString(), endTime.toISOString(), Math.random() > 0.7 ? 1 : 0]);
      }
      
      // Add afternoon slots (2 PM - 5 PM)
      for (let hour = 14; hour < 17; hour++) {
        const startTime = new Date(currentDate);
        startTime.setHours(hour, 0, 0, 0);
        const endTime = new Date(startTime);
        endTime.setHours(hour + 1, 0, 0, 0);
        
        this.db.run(`
          INSERT INTO availability (id, teacher_id, start_time, end_time, is_booked) VALUES 
          (?, ?, ?, ?, ?)
        `, [`av_2_${day}_${hour}`, '2', startTime.toISOString(), endTime.toISOString(), Math.random() > 0.7 ? 1 : 0]);
      }
    }

    // Insert sample appointments
    this.db.run(`
      INSERT INTO appointments (id, student_id, teacher_id, appointment_time, status, subject, student_name, teacher_name, teacher_branch) VALUES 
      ('app1', '5', '2', ?, 'Confirmed', 'Kalkülüs türevleri', 'John Smith', 'Dr. Sarah Johnson', 'Matematik'),
      ('app2', '6', '3', ?, 'Confirmed', 'Kuantum mekaniği', 'Alice Brown', 'Prof. Michael Chen', 'Fizik'),
      ('app3', '5', '4', ?, 'Completed', 'Organik kimya reaksiyonları', 'John Smith', 'Dr. Emily Rodriguez', 'Kimya')
    `, [
      new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
      new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    ]);

    // Insert sample feedback
    this.db.run(`
      INSERT INTO feedback (id, appointment_id, student_id, teacher_id, rating, comment) VALUES 
      ('fb1', 'app3', '5', '4', 5, 'Organik kimya kavramlarının mükemmel açıklaması. Çok sabırlı ve yardımcı.')
    `);
  }

  query(sql: string, params: any[] = []): any[] {
    if (!this.initialized) {
      throw new Error('Database not initialized');
    }

    try {
      const result = this.db.exec(sql, params);
      return result;
    } catch (error) {
      console.error('Query error:', error);
      throw error;
    }
  }

  execute(sql: string, params: any[] = []): void {
    if (!this.initialized) {
      throw new Error('Database not initialized');
    }

    try {
      this.db.run(sql, params);
    } catch (error) {
      console.error('Execute error:', error);
      throw error;
    }
  }

  close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
      this.initialized = false;
    }
  }

  // Helper methods for common operations
  getAllUsers(): any[] {
    const result = this.query("SELECT * FROM users ORDER BY created_at DESC");
    return result[0]?.values || [];
  }

  getUserById(id: string): any {
    const result = this.query("SELECT * FROM users WHERE id = ?", [id]);
    return result[0]?.values[0] || null;
  }

  getUserByEmail(email: string): any {
    const result = this.query("SELECT * FROM users WHERE email = ?", [email]);
    return result[0]?.values[0] || null;
  }

  createUser(id: string, name: string, email: string, role: string): void {
    this.execute(
      "INSERT INTO users (id, name, email, role) VALUES (?, ?, ?, ?)",
      [id, name, email, role]
    );
  }

  getAllTeacherProfiles(): any[] {
    const result = this.query("SELECT * FROM teacher_profiles ORDER BY created_at DESC");
    return result[0]?.values || [];
  }

  createTeacherProfile(id: string, userId: string, branch: string, bio: string): void {
    this.execute(
      "INSERT INTO teacher_profiles (id, user_id, branch, bio) VALUES (?, ?, ?, ?)",
      [id, userId, branch, bio]
    );
  }

  getAllAvailability(): any[] {
    const result = this.query("SELECT * FROM availability ORDER BY start_time ASC");
    return result[0]?.values || [];
  }

  createAvailability(id: string, teacherId: string, startTime: string, endTime: string): void {
    this.execute(
      "INSERT INTO availability (id, teacher_id, start_time, end_time) VALUES (?, ?, ?, ?)",
      [id, teacherId, startTime, endTime]
    );
  }

  getAllAppointments(): any[] {
    const result = this.query("SELECT * FROM appointments ORDER BY appointment_time DESC");
    return result[0]?.values || [];
  }

  createAppointment(id: string, studentId: string, teacherId: string, appointmentTime: string, subject: string, studentName: string, teacherName: string, teacherBranch: string): void {
    this.execute(
      "INSERT INTO appointments (id, student_id, teacher_id, appointment_time, status, subject, student_name, teacher_name, teacher_branch) VALUES (?, ?, ?, ?, 'Pending', ?, ?, ?, ?)",
      [id, studentId, teacherId, appointmentTime, subject, studentName, teacherName, teacherBranch]
    );
  }

  getAllFeedback(): any[] {
    const result = this.query("SELECT * FROM feedback ORDER BY created_at DESC");
    return result[0]?.values || [];
  }

  createFeedback(id: string, appointmentId: string, studentId: string, teacherId: string, rating: number, comment: string): void {
    this.execute(
      "INSERT INTO feedback (id, appointment_id, student_id, teacher_id, rating, comment) VALUES (?, ?, ?, ?, ?, ?)",
      [id, appointmentId, studentId, teacherId, rating, comment]
    );
  }
}

// Export singleton instance
export const databaseService = new SQLiteDatabaseService();
