const { v4: uuidv4 } = require('uuid');

class CodeGenerator {
  /**
   * Generate a unique classroom code
   * Format: 3 letters + 3 numbers (e.g., ABC123)
   */
  static generateClassroomCode() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    
    let code = '';
    
    // Generate 3 random letters
    for (let i = 0; i < 3; i++) {
      code += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    
    // Generate 3 random numbers
    for (let i = 0; i < 3; i++) {
      code += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    
    return code;
  }

  /**
   * Generate a unique UUID for internal use
   */
  static generateUUID() {
    return uuidv4();
  }

  /**
   * Generate a secure random string
   */
  static generateSecureCode(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return result;
  }

  /**
   * Validate classroom code format
   */
  static isValidClassroomCode(code) {
    if (!code || typeof code !== 'string') {
      return false;
    }
    
    // Check if code matches pattern: 3 letters + 3 numbers
    const pattern = /^[A-Z]{3}[0-9]{3}$/;
    return pattern.test(code.toUpperCase());
  }

  /**
   * Generate multiple unique codes and ensure they don't conflict
   */
  static async generateUniqueClassroomCode(existingCodes = []) {
    let attempts = 0;
    const maxAttempts = 100;
    
    while (attempts < maxAttempts) {
      const code = this.generateClassroomCode();
      
      if (!existingCodes.includes(code)) {
        return code;
      }
      
      attempts++;
    }
    
    throw new Error('Unable to generate unique classroom code after maximum attempts');
  }
}

module.exports = CodeGenerator;
