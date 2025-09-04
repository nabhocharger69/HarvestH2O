const express = require('express');
const router = express.Router();
const Classroom = require('../models/Classroom');
const { classroomValidators, validate, validateParam } = require('../validators/classroomValidator');

const classroom = new Classroom();

/**
 * GET /api/classrooms
 * Get all classrooms for a teacher
 */
router.get('/', async (req, res) => {
  try {
    const { teacherId } = req.query;
    
    if (!teacherId) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'teacherId query parameter is required'
      });
    }

    const classrooms = await classroom.getByTeacherId(teacherId);
    
    res.json({
      success: true,
      data: classrooms,
      count: classrooms.length
    });
  } catch (error) {
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
});

/**
 * POST /api/classrooms
 * Create a new classroom
 */
router.post('/', validate(classroomValidators.createClassroom), async (req, res) => {
  try {
    const newClassroom = await classroom.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Classroom created successfully',
      data: newClassroom
    });
  } catch (error) {
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
});

/**
 * GET /api/classrooms/:id
 * Get classroom by ID
 */
router.get('/:id', validateParam(classroomValidators.classroomId, 'id'), async (req, res) => {
  try {
    const classroomData = await classroom.getById(req.params.id);
    
    if (!classroomData) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Classroom not found'
      });
    }
    
    res.json({
      success: true,
      data: classroomData
    });
  } catch (error) {
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
});

/**
 * PUT /api/classrooms/:id
 * Update classroom
 */
router.put('/:id', 
  validateParam(classroomValidators.classroomId, 'id'),
  validate(classroomValidators.updateClassroom),
  async (req, res) => {
    try {
      const updatedClassroom = await classroom.update(req.params.id, req.body);
      
      res.json({
        success: true,
        message: 'Classroom updated successfully',
        data: updatedClassroom
      });
    } catch (error) {
      if (error.message.includes('not found')) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'Classroom not found'
        });
      }
      
      res.status(500).json({
        error: 'Internal Server Error',
        message: error.message
      });
    }
  }
);

/**
 * DELETE /api/classrooms/:id
 * Delete classroom (soft delete)
 */
router.delete('/:id', validateParam(classroomValidators.classroomId, 'id'), async (req, res) => {
  try {
    await classroom.delete(req.params.id);
    
    res.json({
      success: true,
      message: 'Classroom deleted successfully'
    });
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Classroom not found'
      });
    }
    
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
});

/**
 * GET /api/classrooms/code/:code
 * Get classroom by code (for students to join)
 */
router.get('/code/:code', validateParam(classroomValidators.classroomCode, 'code'), async (req, res) => {
  try {
    const classroomData = await classroom.getByCode(req.params.code.toUpperCase());
    
    if (!classroomData) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Classroom not found with this code'
      });
    }
    
    // Return limited info for security
    const publicInfo = {
      id: classroomData.id,
      code: classroomData.code,
      name: classroomData.name,
      subject: classroomData.subject,
      gradeLevel: classroomData.gradeLevel,
      teacherName: classroomData.teacherName,
      studentCount: classroomData.students.length,
      maxStudents: classroomData.settings.maxStudents,
      allowStudentJoin: classroomData.settings.allowStudentJoin
    };
    
    res.json({
      success: true,
      data: publicInfo
    });
  } catch (error) {
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
});

/**
 * POST /api/classrooms/:id/join
 * Student joins classroom
 */
router.post('/:id/join', 
  validateParam(classroomValidators.classroomId, 'id'),
  validate(classroomValidators.joinClassroom),
  async (req, res) => {
    try {
      const { studentId, studentName, rollNumber } = req.body;
      
      const updatedClassroom = await classroom.addStudent(req.params.id, {
        studentId,
        studentName,
        rollNumber
      });
      
      res.json({
        success: true,
        message: 'Successfully joined classroom',
        data: {
          classroomId: req.params.id,
          studentCount: updatedClassroom.students.length
        }
      });
    } catch (error) {
      if (error.message.includes('not found')) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'Classroom not found'
        });
      }
      
      if (error.message.includes('already in classroom')) {
        return res.status(409).json({
          error: 'Conflict',
          message: 'Student is already in this classroom'
        });
      }
      
      if (error.message.includes('full')) {
        return res.status(409).json({
          error: 'Conflict',
          message: 'Classroom is full'
        });
      }
      
      res.status(500).json({
        error: 'Internal Server Error',
        message: error.message
      });
    }
  }
);

/**
 * DELETE /api/classrooms/:id/students/:studentId
 * Remove student from classroom
 */
router.delete('/:id/students/:studentId', 
  validateParam(classroomValidators.classroomId, 'id'),
  async (req, res) => {
    try {
      await classroom.removeStudent(req.params.id, req.params.studentId);
      
      res.json({
        success: true,
        message: 'Student removed from classroom successfully'
      });
    } catch (error) {
      if (error.message.includes('not found')) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'Classroom not found'
        });
      }
      
      res.status(500).json({
        error: 'Internal Server Error',
        message: error.message
      });
    }
  }
);

/**
 * POST /api/classrooms/:id/regenerate-code
 * Regenerate classroom code
 */
router.post('/:id/regenerate-code', 
  validateParam(classroomValidators.classroomId, 'id'),
  async (req, res) => {
    try {
      const updatedClassroom = await classroom.regenerateCode(req.params.id);
      
      res.json({
        success: true,
        message: 'Classroom code regenerated successfully',
        data: {
          id: updatedClassroom.id,
          code: updatedClassroom.code
        }
      });
    } catch (error) {
      if (error.message.includes('not found')) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'Classroom not found'
        });
      }
      
      res.status(500).json({
        error: 'Internal Server Error',
        message: error.message
      });
    }
  }
);

module.exports = router;
