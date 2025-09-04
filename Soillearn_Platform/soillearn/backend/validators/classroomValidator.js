const Joi = require('joi');

const classroomValidators = {
  // Validate classroom creation data
  createClassroom: Joi.object({
    name: Joi.string()
      .min(3)
      .max(100)
      .required()
      .messages({
        'string.empty': 'Classroom name is required',
        'string.min': 'Classroom name must be at least 3 characters',
        'string.max': 'Classroom name cannot exceed 100 characters'
      }),
    
    description: Joi.string()
      .max(500)
      .allow('')
      .optional()
      .messages({
        'string.max': 'Description cannot exceed 500 characters'
      }),
    
    subject: Joi.string()
      .max(50)
      .allow('')
      .optional()
      .messages({
        'string.max': 'Subject cannot exceed 50 characters'
      }),
    
    gradeLevel: Joi.string()
      .max(20)
      .allow('')
      .optional()
      .messages({
        'string.max': 'Grade level cannot exceed 20 characters'
      }),
    
    teacherId: Joi.string()
      .required()
      .messages({
        'string.empty': 'Teacher ID is required'
      }),
    
    teacherName: Joi.string()
      .min(2)
      .max(100)
      .required()
      .messages({
        'string.empty': 'Teacher name is required',
        'string.min': 'Teacher name must be at least 2 characters',
        'string.max': 'Teacher name cannot exceed 100 characters'
      }),
    
    maxStudents: Joi.number()
      .integer()
      .min(1)
      .max(200)
      .optional()
      .default(50)
      .messages({
        'number.min': 'Maximum students must be at least 1',
        'number.max': 'Maximum students cannot exceed 200'
      }),
    
    requireApproval: Joi.boolean()
      .optional()
      .default(false)
  }),

  // Validate classroom update data
  updateClassroom: Joi.object({
    name: Joi.string()
      .min(3)
      .max(100)
      .optional()
      .messages({
        'string.min': 'Classroom name must be at least 3 characters',
        'string.max': 'Classroom name cannot exceed 100 characters'
      }),
    
    description: Joi.string()
      .max(500)
      .allow('')
      .optional()
      .messages({
        'string.max': 'Description cannot exceed 500 characters'
      }),
    
    subject: Joi.string()
      .max(50)
      .allow('')
      .optional()
      .messages({
        'string.max': 'Subject cannot exceed 50 characters'
      }),
    
    gradeLevel: Joi.string()
      .max(20)
      .allow('')
      .optional()
      .messages({
        'string.max': 'Grade level cannot exceed 20 characters'
      }),
    
    settings: Joi.object({
      allowStudentJoin: Joi.boolean().optional(),
      maxStudents: Joi.number().integer().min(1).max(200).optional(),
      requireApproval: Joi.boolean().optional()
    }).optional()
  }),

  // Validate student join data
  joinClassroom: Joi.object({
    code: Joi.string()
      .length(6)
      .pattern(/^[A-Z]{3}[0-9]{3}$/)
      .required()
      .messages({
        'string.empty': 'Classroom code is required',
        'string.length': 'Classroom code must be exactly 6 characters',
        'string.pattern.base': 'Invalid classroom code format'
      }),
    
    studentId: Joi.string()
      .required()
      .messages({
        'string.empty': 'Student ID is required'
      }),
    
    studentName: Joi.string()
      .min(2)
      .max(100)
      .required()
      .messages({
        'string.empty': 'Student name is required',
        'string.min': 'Student name must be at least 2 characters',
        'string.max': 'Student name cannot exceed 100 characters'
      }),
    
    rollNumber: Joi.string()
      .max(20)
      .allow('')
      .optional()
      .messages({
        'string.max': 'Roll number cannot exceed 20 characters'
      })
  }),

  // Validate classroom ID parameter
  classroomId: Joi.string()
    .guid({ version: 'uuidv4' })
    .required()
    .messages({
      'string.empty': 'Classroom ID is required',
      'string.guid': 'Invalid classroom ID format'
    }),

  // Validate teacher ID parameter
  teacherId: Joi.string()
    .required()
    .messages({
      'string.empty': 'Teacher ID is required'
    }),

  // Validate classroom code parameter
  classroomCode: Joi.string()
    .length(6)
    .pattern(/^[A-Z]{3}[0-9]{3}$/)
    .required()
    .messages({
      'string.empty': 'Classroom code is required',
      'string.length': 'Classroom code must be exactly 6 characters',
      'string.pattern.base': 'Invalid classroom code format'
    })
};

// Middleware function to validate request data
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        error: 'Validation Error',
        message: error.details[0].message,
        details: error.details
      });
    }
    
    // Replace req.body with validated and sanitized data
    req.body = value;
    next();
  };
};

// Middleware function to validate URL parameters
const validateParam = (schema, paramName) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.params[paramName]);
    
    if (error) {
      return res.status(400).json({
        error: 'Validation Error',
        message: error.details[0].message
      });
    }
    
    req.params[paramName] = value;
    next();
  };
};

module.exports = {
  classroomValidators,
  validate,
  validateParam
};
