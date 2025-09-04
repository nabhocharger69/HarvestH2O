// Data Manager for SoilLearn - JSON-based local storage system
class DataManager {
  constructor() {
    this.storageKey = 'soillearn_data';
    this.initializeData();
  }

  // Initialize default data structure
  initializeData() {
    const defaultData = {
      students: [],
      teachers: [],
      classrooms: [],
      quizzes: [],
      sensorData: [],
      settings: {
        theme: 'light',
        notifications: true,
        language: 'en'
      },
      activities: [],
      achievements: []
    };

    const existingData = this.getData();
    if (!existingData) {
      this.saveData(defaultData);
    }
  }

  // Get all data from localStorage
  getData() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error reading data:', error);
      return null;
    }
  }

  // Save data to localStorage
  saveData(data) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error saving data:', error);
      return false;
    }
  }

  // Generate unique classroom code
  generateClassroomCode() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    let code = '';
    
    // 3 letters
    for (let i = 0; i < 3; i++) {
      code += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    
    // 3 numbers
    for (let i = 0; i < 3; i++) {
      code += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    
    return code;
  }

  // Student operations
  createStudent(studentData) {
    const data = this.getData();
    
    // Check if student already exists
    const existingStudent = data.students.find(s => s.id === studentData.id);
    if (existingStudent) {
      return existingStudent;
    }
    
    const student = {
      id: studentData.id || Date.now().toString(),
      ...studentData,
      createdAt: new Date().toISOString(),
      classrooms: studentData.classrooms || []
    };
    
    data.students.push(student);
    this.saveData(data);
    return student;
  }

  getStudent(id) {
    const data = this.getData();
    return data.students.find(student => student.id === id);
  }

  updateStudent(studentId, updates) {
    const data = this.getData();
    const studentIndex = data.students.findIndex(s => s.id === studentId);
    
    if (studentIndex === -1) {
      return { success: false, error: 'Student not found' };
    }
    
    const oldStudent = { ...data.students[studentIndex] };
    data.students[studentIndex] = {
      ...data.students[studentIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    this.saveData(data);
    
    // Log profile update activity if name changed
    if (oldStudent.name !== data.students[studentIndex].name) {
      this.logActivity({
        type: 'profile_updated',
        studentId: studentId,
        oldName: oldStudent.name,
        newName: data.students[studentIndex].name,
        changes: Object.keys(updates)
      });
    }
    
    return { success: true, student: data.students[studentIndex] };
  }

  // Teacher operations
  createTeacher(teacherData) {
    const data = this.getData();
    const teacher = {
      id: Date.now().toString(),
      ...teacherData,
      createdAt: new Date().toISOString(),
      classrooms: []
    };
    
    data.teachers.push(teacher);
    this.saveData(data);
    return teacher;
  }

  getTeacher(id) {
    const data = this.getData();
    return data.teachers.find(teacher => teacher.id === id);
  }

  // Classroom operations
  createClassroom(classroomData) {
    const data = this.getData();
    const classroom = {
      id: Date.now().toString(),
      code: this.generateClassroomCode(),
      ...classroomData,
      students: [],
      invitations: [],
      announcements: [],
      assignments: [],
      isActive: true,
      settings: {
        allowStudentPosts: true,
        requireApproval: false,
        allowLateSubmissions: true
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    data.classrooms.push(classroom);
    this.saveData(data);
    
    // Log classroom creation
    this.logActivity({
      type: 'classroom_created',
      classroomId: classroom.id,
      teacherId: classroomData.teacherId,
      classroomName: classroom.name,
      classroomCode: classroom.code
    });
    
    return classroom;
  }

  getClassroom(id) {
    const data = this.getData();
    return data.classrooms.find(classroom => classroom.id === id);
  }

  getClassroomByCode(code) {
    const data = this.getData();
    return data.classrooms.find(classroom => classroom.code === code);
  }

  getTeacherClassrooms(teacherId) {
    const data = this.getData();
    return data.classrooms.filter(classroom => classroom.teacherId === teacherId);
  }

  joinClassroom(classroomId, studentId) {
    const data = this.getData();
    const classroom = data.classrooms.find(c => c.id === classroomId);
    const student = data.students.find(s => s.id === studentId);
    
    if (classroom && student && !classroom.students.includes(studentId)) {
      // Add student to classroom
      classroom.students.push(studentId);
      classroom.updatedAt = new Date().toISOString();
      
      // Add classroom to student's enrolled classrooms
      if (!student.classrooms) student.classrooms = [];
      if (!student.classrooms.includes(classroomId)) {
        student.classrooms.push(classroomId);
      }
      
      this.saveData(data);
      
      // Log the join activity
      this.logActivity({
        type: 'student_joined_classroom',
        studentId: studentId,
        classroomId: classroomId,
        studentName: student.name,
        classroomName: classroom.name,
        classroomCode: classroom.code
      });
      
      return { success: true, classroom, student };
    }
    return { success: false, error: 'Classroom not found or student already enrolled' };
  }

  leaveClassroom(classroomId, studentId) {
    const data = this.getData();
    const classroom = data.classrooms.find(c => c.id === classroomId);
    
    if (classroom) {
      classroom.students = classroom.students.filter(id => id !== studentId);
      this.saveData(data);
      return true;
    }
    return false;
  }

  regenerateClassroomCode(classroomId) {
    const data = this.getData();
    const classroom = data.classrooms.find(c => c.id === classroomId);
    
    if (classroom) {
      classroom.code = this.generateClassroomCode();
      this.saveData(data);
      return classroom.code;
    }
    return null;
  }

  joinClassroomByCode(studentId, classroomCode) {
    const data = this.getData();
    const classroom = data.classrooms.find(c => c.code === classroomCode && c.isActive);
    
    if (classroom) {
      return this.joinClassroom(classroom.id, studentId);
    }
    return { success: false, error: 'Invalid classroom code' };
  }

  // Get student's enrolled classrooms
  getStudentClassrooms(studentId) {
    const data = this.getData();
    const student = data.students.find(s => s.id === studentId);
    
    if (!student || !student.classrooms) return [];
    
    return student.classrooms.map(classroomId => {
      return data.classrooms.find(c => c.id === classroomId);
    }).filter(Boolean);
  }

  // Update classroom information
  updateClassroom(classroomId, updates) {
    const data = this.getData();
    const classroomIndex = data.classrooms.findIndex(c => c.id === classroomId);
    
    if (classroomIndex !== -1) {
      data.classrooms[classroomIndex] = {
        ...data.classrooms[classroomIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      this.saveData(data);
      return data.classrooms[classroomIndex];
    }
    return null;
  }

  // Get classroom roster with student details
  getClassroomRoster(classroomId) {
    const data = this.getData();
    const classroom = data.classrooms.find(c => c.id === classroomId);
    
    if (!classroom) return null;
    
    const students = classroom.students.map(studentId => {
      const student = data.students.find(s => s.id === studentId);
      return student ? {
        id: student.id,
        name: student.name,
        email: student.email,
        xp: student.xp || 0,
        level: student.level || 1,
        joinedAt: student.joinedAt || student.createdAt,
        lastActive: student.lastActive || student.createdAt
      } : null;
    }).filter(Boolean);
    
    return {
      classroom: {
        id: classroom.id,
        name: classroom.name,
        code: classroom.code,
        description: classroom.description,
        teacherId: classroom.teacherId,
        createdAt: classroom.createdAt
      },
      students,
      totalStudents: students.length
    };
  }

  // Archive/deactivate classroom
  archiveClassroom(classroomId) {
    const data = this.getData();
    const classroom = data.classrooms.find(c => c.id === classroomId);
    
    if (classroom) {
      classroom.isActive = false;
      classroom.archivedAt = new Date().toISOString();
      this.saveData(data);
      
      this.logActivity({
        type: 'classroom_archived',
        classroomId: classroomId,
        classroomName: classroom.name,
        teacherId: classroom.teacherId
      });
      
      return true;
    }
    return false;
  }

  // Settings operations
  getSettings() {
    const data = this.getData();
    return data.settings || { theme: 'light', notifications: true, language: 'en' };
  }

  updateSettings(newSettings) {
    const data = this.getData();
    data.settings = { ...data.settings, ...newSettings };
    this.saveData(data);
    return data.settings;
  }

  // Sensor data operations
  addSensorData(sensorData) {
    const data = this.getData();
    const entry = {
      id: Date.now().toString(),
      ...sensorData,
      timestamp: new Date().toISOString()
    };
    
    data.sensorData.push(entry);
    // Keep only last 1000 entries to prevent storage overflow
    if (data.sensorData.length > 1000) {
      data.sensorData = data.sensorData.slice(-1000);
    }
    
    this.saveData(data);
    return entry;
  }

  // Add ESP32 sensor data with proper structure
  addESP32SensorData(esp32Payload) {
    const data = this.getData();
    
    // Parse ESP32 payload structure
    const sensorReading = {
      id: Date.now().toString(),
      deviceId: esp32Payload.client_payload?.device || 'unknown',
      timestamp: esp32Payload.client_payload?.ts || new Date().toISOString(),
      serverTime: esp32Payload.server_time_iso_local,
      
      // Environmental data
      temperature: {
        bmp280: esp32Payload.client_payload?.sensors?.bmp280?.temp_c,
        dht22: esp32Payload.client_payload?.sensors?.dht22?.temp_c
      },
      humidity: esp32Payload.client_payload?.sensors?.dht22?.hum_pct,
      pressure: esp32Payload.client_payload?.sensors?.bmp280?.press_hpa,
      altitude: esp32Payload.client_payload?.sensors?.bmp280?.alt_m,
      
      // Light sensors
      light: {
        ambient: esp32Payload.client_payload?.sensors?.ambient_brightness?.lux,
        bh1750: esp32Payload.client_payload?.sensors?.bh1750?.lux
      },
      
      // Soil data
      soil: {
        moisture: {
          raw: esp32Payload.client_payload?.sensors?.hs_s20b?.adc_raw,
          ratio: esp32Payload.client_payload?.sensors?.hs_s20b?.ratio
        },
        npk: {
          nitrogen: esp32Payload.client_payload?.sensors?.npk?.n_mgkg,
          phosphorus: esp32Payload.client_payload?.sensors?.npk?.p_mgkg,
          potassium: esp32Payload.client_payload?.sensors?.npk?.k_mgkg
        }
      },
      
      // Air quality
      co2: esp32Payload.client_payload?.sensors?.mh_z19e?.co2_ppm,
      
      // Location
      location: {
        latitude: esp32Payload.client_payload?.sensors?.gps?.lat,
        longitude: esp32Payload.client_payload?.sensors?.gps?.lon,
        altitude: esp32Payload.client_payload?.sensors?.gps?.alt_m,
        satellites: esp32Payload.client_payload?.sensors?.gps?.sat,
        hdop: esp32Payload.client_payload?.sensors?.gps?.hdop
      },
      
      // Raw payload for debugging
      rawPayload: esp32Payload
    };
    
    data.sensorData.push(sensorReading);
    
    // Keep only last 1000 entries to prevent storage overflow
    if (data.sensorData.length > 1000) {
      data.sensorData = data.sensorData.slice(-1000);
    }
    
    this.saveData(data);
    
    // Log sensor activity
    this.logActivity({
      type: 'sensor_data_received',
      deviceId: sensorReading.deviceId,
      timestamp: sensorReading.timestamp,
      description: `Sensor data received from ${sensorReading.deviceId}`,
      details: {
        temperature: sensorReading.temperature.dht22,
        humidity: sensorReading.humidity,
        soilMoisture: sensorReading.soil.moisture.ratio,
        co2: sensorReading.co2
      }
    });
    
    return sensorReading;
  }

  getSensorData(limit = 100) {
    const data = this.getData();
    return data.sensorData.slice(-limit);
  }

  // Get latest sensor readings by device
  getLatestSensorData(deviceId = null) {
    const data = this.getData();
    let sensorData = data.sensorData;
    
    if (deviceId) {
      sensorData = sensorData.filter(reading => reading.deviceId === deviceId);
    }
    
    return sensorData.length > 0 ? sensorData[sensorData.length - 1] : null;
  }

  // Get sensor data for specific time range
  getSensorDataByDateRange(startDate, endDate, deviceId = null) {
    const data = this.getData();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return data.sensorData.filter(reading => {
      const readingDate = new Date(reading.timestamp);
      const matchesDate = readingDate >= start && readingDate <= end;
      const matchesDevice = !deviceId || reading.deviceId === deviceId;
      return matchesDate && matchesDevice;
    });
  }

  // Calculate sensor statistics
  getSensorStatistics(deviceId = null, hours = 24) {
    const cutoffTime = new Date(Date.now() - (hours * 60 * 60 * 1000));
    const data = this.getData();
    
    const recentData = data.sensorData.filter(reading => {
      const readingDate = new Date(reading.timestamp);
      const matchesTime = readingDate >= cutoffTime;
      const matchesDevice = !deviceId || reading.deviceId === deviceId;
      return matchesTime && matchesDevice;
    });
    
    if (recentData.length === 0) return null;
    
    const stats = {
      count: recentData.length,
      latest: recentData[recentData.length - 1],
      temperature: {
        avg: this.calculateAverage(recentData, 'temperature.dht22'),
        min: this.calculateMin(recentData, 'temperature.dht22'),
        max: this.calculateMax(recentData, 'temperature.dht22')
      },
      humidity: {
        avg: this.calculateAverage(recentData, 'humidity'),
        min: this.calculateMin(recentData, 'humidity'),
        max: this.calculateMax(recentData, 'humidity')
      },
      soilMoisture: {
        avg: this.calculateAverage(recentData, 'soil.moisture.ratio'),
        min: this.calculateMin(recentData, 'soil.moisture.ratio'),
        max: this.calculateMax(recentData, 'soil.moisture.ratio')
      },
      co2: {
        avg: this.calculateAverage(recentData, 'co2'),
        min: this.calculateMin(recentData, 'co2'),
        max: this.calculateMax(recentData, 'co2')
      }
    };
    
    return stats;
  }

  // Helper methods for statistics
  calculateAverage(data, path) {
    const values = data.map(item => this.getNestedValue(item, path)).filter(val => val != null);
    return values.length > 0 ? values.reduce((sum, val) => sum + val, 0) / values.length : null;
  }

  calculateMin(data, path) {
    const values = data.map(item => this.getNestedValue(item, path)).filter(val => val != null);
    return values.length > 0 ? Math.min(...values) : null;
  }

  calculateMax(data, path) {
    const values = data.map(item => this.getNestedValue(item, path)).filter(val => val != null);
    return values.length > 0 ? Math.max(...values) : null;
  }

  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  // Quiz operations
  createQuiz(quizData) {
    const data = this.getData();
    const quiz = {
      id: Date.now().toString(),
      ...quizData,
      createdAt: new Date().toISOString()
    };
    
    data.quizzes.push(quiz);
    this.saveData(data);
    return quiz;
  }

  getQuizzes() {
    const data = this.getData();
    return data.quizzes;
  }

  // Activity logging
  logActivity(activity) {
    const data = this.getData();
    const entry = {
      id: Date.now().toString(),
      ...activity,
      timestamp: new Date().toISOString()
    };
    
    data.activities.push(entry);
    // Keep only last 500 activities
    if (data.activities.length > 500) {
      data.activities = data.activities.slice(-500);
    }
    
    this.saveData(data);
    return entry;
  }

  getActivities(limit = 50) {
    const data = this.getData();
    return data.activities.slice(-limit).reverse();
  }

  // Export classroom data as CSV
  exportClassroomCSV(classroomId) {
    const data = this.getData();
    const classroom = data.classrooms.find(c => c.id === classroomId);
    
    if (!classroom) {
      throw new Error('Classroom not found');
    }

    // Get detailed student data
    const students = classroom.students.map(studentId => {
      const student = data.students.find(s => s.id === studentId);
      return student ? {
        id: student.id,
        name: student.name,
        email: student.email || '',
        rollNumber: student.rollNumber || '',
        level: student.level || 1,
        xp: student.xp || 0,
        joinedAt: student.joinedAt || student.createdAt,
        lastActive: student.lastActive || student.createdAt,
        plantType: student.plantType || '',
        achievements: student.achievements ? student.achievements.length : 0
      } : null;
    }).filter(Boolean);

    // Get classroom activities for these students
    const classroomActivities = data.activities.filter(activity => 
      activity.classroomId === classroomId || 
      (activity.studentId && classroom.students.includes(activity.studentId))
    );

    // Create CSV content
    const csvData = {
      classroom: {
        name: classroom.name,
        code: classroom.code,
        description: classroom.description || '',
        createdAt: classroom.createdAt,
        totalStudents: students.length,
        isActive: classroom.isActive
      },
      students: students,
      activities: classroomActivities.map(activity => ({
        type: activity.type,
        studentId: activity.studentId,
        studentName: students.find(s => s.id === activity.studentId)?.name || 'Unknown',
        timestamp: activity.timestamp,
        description: activity.description || activity.type
      })),
      summary: {
        totalActivities: classroomActivities.length,
        averageLevel: students.length > 0 ? (students.reduce((sum, s) => sum + s.level, 0) / students.length).toFixed(1) : 0,
        totalXP: students.reduce((sum, s) => sum + s.xp, 0),
        activeStudents: students.filter(s => {
          const lastActive = new Date(s.lastActive);
          const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
          return lastActive > dayAgo;
        }).length
      }
    };

    return this.generateCSVFile(csvData, classroom.name);
  }

  // XLSX Export functionality
  async exportClassroomXLSX(classroomId) {
    try {
      // Dynamic import of xlsx library
      const XLSX = await import('https://cdn.skypack.dev/xlsx');
      
      const data = this.getData();
      const classroom = data.classrooms.find(c => c.id === classroomId);
      
      if (!classroom) {
        throw new Error('Classroom not found');
      }

      // Get detailed student data
      const students = classroom.students.map(studentId => {
        const student = data.students.find(s => s.id === studentId);
        return student ? {
          'Student ID': student.id,
          'Name': student.name,
          'Email': student.email || 'N/A',
          'Roll Number': student.rollNumber || 'N/A',
          'Class': student.class || 'N/A',
          'Level': student.level || 1,
          'XP': student.xp || 0,
          'Plant Type': student.plantType || 'N/A',
          'Join Date': new Date(student.createdAt || Date.now()).toLocaleDateString(),
          'Achievements': (student.achievements || []).length
        } : {
          'Student ID': studentId,
          'Name': 'Unknown Student',
          'Email': 'N/A',
          'Roll Number': 'N/A',
          'Class': 'N/A',
          'Level': 'N/A',
          'XP': 'N/A',
          'Plant Type': 'N/A',
          'Join Date': 'N/A',
          'Achievements': 'N/A'
        };
      }).filter(Boolean);

      // Get classroom activities
      const activities = data.activities
        .filter(activity => 
          activity.classroomId === classroomId || 
          (activity.studentId && classroom.students.includes(activity.studentId))
        )
        .slice(-100) // Last 100 activities
        .map(activity => ({
          'Date': new Date(activity.timestamp).toLocaleDateString(),
          'Time': new Date(activity.timestamp).toLocaleTimeString(),
          'Type': activity.type,
          'Student': students.find(s => s['Student ID'] === activity.studentId)?.Name || 'N/A',
          'Description': this.getActivityDescription(activity),
          'Details': activity.details || 'N/A'
        }));

      // Create workbook
      const workbook = XLSX.utils.book_new();

      // Sheet 1: Classroom Information
      const classroomInfo = [
        ['Classroom Information', ''],
        ['Name', classroom.name],
        ['Code', classroom.code],
        ['Description', classroom.description || 'N/A'],
        ['Teacher', classroom.teacherName || 'N/A'],
        ['Created', new Date(classroom.createdAt).toLocaleDateString()],
        ['Status', classroom.isActive ? 'Active' : 'Inactive'],
        ['Total Students', classroom.students.length],
        [''],
        ['Summary Statistics', ''],
        ['Total Activities', activities.length],
        ['Active Students', classroom.students.length],
        ['Average Level', students.length > 0 ? (students.reduce((sum, s) => sum + s.Level, 0) / students.length).toFixed(1) : 0],
        ['Total XP', students.reduce((sum, s) => sum + s.XP, 0)],
        ['Export Date', new Date().toLocaleDateString()],
        ['Export Time', new Date().toLocaleTimeString()]
      ];
      
      const infoSheet = XLSX.utils.aoa_to_sheet(classroomInfo);
      XLSX.utils.book_append_sheet(workbook, infoSheet, 'Classroom Info');

      // Sheet 2: Student Roster
      if (students.length > 0) {
        const studentSheet = XLSX.utils.json_to_sheet(students);
        XLSX.utils.book_append_sheet(workbook, studentSheet, 'Student Roster');
      }

      // Sheet 3: Recent Activities
      if (activities.length > 0) {
        const activitySheet = XLSX.utils.json_to_sheet(activities);
        XLSX.utils.book_append_sheet(workbook, activitySheet, 'Recent Activities');
      }

      // Sheet 4: Assignments (if any)
      if (classroom.assignments && classroom.assignments.length > 0) {
        const assignments = classroom.assignments.map(assignment => ({
          'Title': assignment.title,
          'Description': assignment.description || 'N/A',
          'Due Date': assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : 'N/A',
          'Status': assignment.status || 'Active',
          'Created': new Date(assignment.createdAt).toLocaleDateString(),
          'Submissions': assignment.submissions ? assignment.submissions.length : 0
        }));

        const assignmentSheet = XLSX.utils.json_to_sheet(assignments);
        XLSX.utils.book_append_sheet(workbook, assignmentSheet, 'Assignments');
      }

      // Generate filename
      const fileName = `${classroom.name.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`;

      // Write and download file
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', fileName);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      return {
        success: true,
        fileName,
        recordCount: classroom.students.length,
        sheets: ['Classroom Info', 'Student Roster', activities.length > 0 ? 'Recent Activities' : null, classroom.assignments?.length > 0 ? 'Assignments' : null].filter(Boolean)
      };

    } catch (error) {
      console.error('XLSX export error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Quiz management
  saveQuizResult(quizResult) {
    const data = this.getData();
    
    // Add quiz result to quizzes array
    data.quizzes.push(quizResult);
    
    // Update student's quiz history and XP
    const student = data.students.find(s => s.id === quizResult.studentId);
    if (student) {
      if (!student.quizHistory) student.quizHistory = [];
      student.quizHistory.push(quizResult.id);
      
      // Award XP based on score
      const xpGained = Math.round(quizResult.score * 0.5); // 50 XP for 100% score
      student.xp = (student.xp || 0) + xpGained;
      
      // Check for level up (every 100 XP = 1 level)
      const newLevel = Math.floor(student.xp / 100) + 1;
      if (newLevel > (student.level || 1)) {
        student.level = newLevel;
        
        // Log level up activity
        this.logActivity({
          type: 'level_up',
          studentId: student.id,
          studentName: student.name,
          newLevel: newLevel,
          details: `Leveled up to Level ${newLevel} from quiz performance`
        });
      }
      
      student.updatedAt = new Date().toISOString();
    }
    
    this.saveData(data);
    return quizResult;
  }

  getStudentQuizzes(studentId) {
    const data = this.getData();
    return data.quizzes.filter(quiz => quiz.studentId === studentId)
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
  }

  getQuizById(quizId) {
    const data = this.getData();
    return data.quizzes.find(quiz => quiz.id === quizId);
  }

  getClassroomQuizzes(classroomId) {
    const data = this.getData();
    const classroom = data.classrooms.find(c => c.id === classroomId);
    if (!classroom) return [];
    
    return data.quizzes.filter(quiz => 
      classroom.students.includes(quiz.studentId)
    ).sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
  }

  // Helper method for activity descriptions
  getActivityDescription(activity) {
    switch (activity.type) {
      case 'student_joined_classroom':
        return `${activity.studentName} joined the classroom`;
      case 'assignment_submitted':
        return `Assignment "${activity.assignmentTitle}" submitted`;
      case 'quiz_completed':
        return `Quiz completed with score: ${activity.score || 'N/A'}%`;
      case 'level_up':
        return `Leveled up to Level ${activity.newLevel}`;
      case 'achievement_earned':
        return `Earned achievement: ${activity.achievementName}`;
      case 'profile_updated':
        return `Profile updated: ${activity.field} changed`;
      default:
        return activity.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  }

  // Generate CSV file content and trigger download
  generateCSVFile(data, classroomName) {
    const sanitizedName = classroomName.replace(/[^a-zA-Z0-9]/g, '_');
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `${sanitizedName}_${timestamp}.csv`;

    // Create CSV content with multiple sheets
    let csvContent = '';

    // Classroom Info Section
    csvContent += 'CLASSROOM INFORMATION\n';
    csvContent += 'Field,Value\n';
    csvContent += `Name,"${data.classroom.name}"\n`;
    csvContent += `Code,${data.classroom.code}\n`;
    csvContent += `Description,"${data.classroom.description}"\n`;
    csvContent += `Created,${new Date(data.classroom.createdAt).toLocaleDateString()}\n`;
    csvContent += `Total Students,${data.classroom.totalStudents}\n`;
    csvContent += `Status,${data.classroom.isActive ? 'Active' : 'Archived'}\n`;
    csvContent += '\n';

    // Summary Section
    csvContent += 'CLASSROOM SUMMARY\n';
    csvContent += 'Metric,Value\n';
    csvContent += `Total Activities,${data.summary.totalActivities}\n`;
    csvContent += `Average Level,${data.summary.averageLevel}\n`;
    csvContent += `Total XP,${data.summary.totalXP}\n`;
    csvContent += `Active Students (24h),${data.summary.activeStudents}\n`;
    csvContent += '\n';

    // Students Section
    csvContent += 'STUDENT ROSTER\n';
    csvContent += 'Name,Email,Roll Number,Level,XP,Plant Type,Achievements,Joined Date,Last Active\n';
    data.students.forEach(student => {
      csvContent += `"${student.name}","${student.email}","${student.rollNumber}",${student.level},${student.xp},"${student.plantType}",${student.achievements},"${new Date(student.joinedAt).toLocaleDateString()}","${new Date(student.lastActive).toLocaleDateString()}"\n`;
    });
    csvContent += '\n';

    // Activities Section
    csvContent += 'RECENT ACTIVITIES\n';
    csvContent += 'Date,Time,Student,Activity Type,Description\n';
    csvData.activities.slice(-50).forEach(activity => {
      const date = new Date(activity.timestamp);
      csvContent += `"${date.toLocaleDateString()}","${date.toLocaleTimeString()}","${activity.studentName}","${activity.type}","${activity.description}"\n`;
    });

    return csvContent;
  }

  // Clear all data (for testing/reset)
  clearAllData() {
    localStorage.removeItem(this.storageKey);
    this.initializeData();
  }
}

// Create and export singleton instance
const dataManager = new DataManager();
export default dataManager;
