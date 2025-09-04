const JSONStorage = require('../utils/storage');
const CodeGenerator = require('../utils/codeGenerator');

class Classroom {
  constructor() {
    this.storage = new JSONStorage();
    this.filename = 'classrooms';
  }

  /**
   * Create a new classroom
   */
  async create(classroomData) {
    // Get existing classrooms to ensure unique code
    const existingClassrooms = await this.storage.readFile(this.filename);
    const existingCodes = existingClassrooms.map(c => c.code);

    // Generate unique classroom code
    const code = await CodeGenerator.generateUniqueClassroomCode(existingCodes);

    const classroom = {
      id: CodeGenerator.generateUUID(),
      code: code,
      name: classroomData.name,
      description: classroomData.description || '',
      subject: classroomData.subject || '',
      gradeLevel: classroomData.gradeLevel || '',
      teacherId: classroomData.teacherId,
      teacherName: classroomData.teacherName,
      students: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
      settings: {
        allowStudentJoin: true,
        maxStudents: classroomData.maxStudents || 50,
        requireApproval: classroomData.requireApproval || false
      }
    };

    await this.storage.appendToFile(this.filename, classroom);
    return classroom;
  }

  /**
   * Get all classrooms for a teacher
   */
  async getByTeacherId(teacherId) {
    const classrooms = await this.storage.findInFile(this.filename, { teacherId });
    return classrooms.filter(c => c.isActive);
  }

  /**
   * Get classroom by ID
   */
  async getById(id) {
    return await this.storage.findOneInFile(this.filename, { id });
  }

  /**
   * Get classroom by code
   */
  async getByCode(code) {
    return await this.storage.findOneInFile(this.filename, { code: code.toUpperCase() });
  }

  /**
   * Update classroom
   */
  async update(id, updateData) {
    const updateFields = {
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    // Don't allow updating certain fields
    delete updateFields.id;
    delete updateFields.code;
    delete updateFields.createdAt;
    
    return await this.storage.updateInFile(this.filename, id, updateFields);
  }

  /**
   * Delete classroom (soft delete)
   */
  async delete(id) {
    return await this.storage.updateInFile(this.filename, id, { 
      isActive: false,
      updatedAt: new Date().toISOString()
    });
  }

  /**
   * Add student to classroom
   */
  async addStudent(classroomId, studentData) {
    const classroom = await this.getById(classroomId);
    if (!classroom) {
      throw new Error('Classroom not found');
    }

    // Check if student already exists
    const existingStudent = classroom.students.find(s => s.studentId === studentData.studentId);
    if (existingStudent) {
      throw new Error('Student already in classroom');
    }

    // Check max students limit
    if (classroom.students.length >= classroom.settings.maxStudents) {
      throw new Error('Classroom is full');
    }

    const student = {
      studentId: studentData.studentId,
      studentName: studentData.studentName,
      rollNumber: studentData.rollNumber || '',
      joinedAt: new Date().toISOString(),
      isActive: true
    };

    classroom.students.push(student);
    
    return await this.update(classroomId, { students: classroom.students });
  }

  /**
   * Remove student from classroom
   */
  async removeStudent(classroomId, studentId) {
    const classroom = await this.getById(classroomId);
    if (!classroom) {
      throw new Error('Classroom not found');
    }

    classroom.students = classroom.students.filter(s => s.studentId !== studentId);
    
    return await this.update(classroomId, { students: classroom.students });
  }

  /**
   * Get all active classrooms
   */
  async getAll() {
    const classrooms = await this.storage.readFile(this.filename);
    return classrooms.filter(c => c.isActive);
  }

  /**
   * Regenerate classroom code
   */
  async regenerateCode(classroomId) {
    const existingClassrooms = await this.storage.readFile(this.filename);
    const existingCodes = existingClassrooms
      .filter(c => c.id !== classroomId)
      .map(c => c.code);

    const newCode = await CodeGenerator.generateUniqueClassroomCode(existingCodes);
    
    return await this.update(classroomId, { code: newCode });
  }
}

module.exports = Classroom;
