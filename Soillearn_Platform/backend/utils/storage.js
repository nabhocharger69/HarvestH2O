const fs = require('fs').promises;
const path = require('path');

class JSONStorage {
  constructor(dataDir = './data') {
    this.dataDir = dataDir;
    this.ensureDataDirectory();
  }

  async ensureDataDirectory() {
    try {
      await fs.access(this.dataDir);
    } catch (error) {
      await fs.mkdir(this.dataDir, { recursive: true });
    }
  }

  getFilePath(filename) {
    return path.join(this.dataDir, `${filename}.json`);
  }

  async readFile(filename) {
    try {
      const filePath = this.getFilePath(filename);
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        // File doesn't exist, return empty array
        return [];
      }
      throw error;
    }
  }

  async writeFile(filename, data) {
    const filePath = this.getFilePath(filename);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
  }

  async appendToFile(filename, newData) {
    const existingData = await this.readFile(filename);
    existingData.push(newData);
    await this.writeFile(filename, existingData);
    return existingData;
  }

  async updateInFile(filename, id, updateData) {
    const data = await this.readFile(filename);
    const index = data.findIndex(item => item.id === id);
    
    if (index === -1) {
      throw new Error(`Item with id ${id} not found`);
    }
    
    data[index] = { ...data[index], ...updateData };
    await this.writeFile(filename, data);
    return data[index];
  }

  async deleteFromFile(filename, id) {
    const data = await this.readFile(filename);
    const filteredData = data.filter(item => item.id !== id);
    
    if (data.length === filteredData.length) {
      throw new Error(`Item with id ${id} not found`);
    }
    
    await this.writeFile(filename, filteredData);
    return true;
  }

  async findInFile(filename, query) {
    const data = await this.readFile(filename);
    return data.filter(item => {
      return Object.keys(query).every(key => item[key] === query[key]);
    });
  }

  async findOneInFile(filename, query) {
    const data = await this.readFile(filename);
    return data.find(item => {
      return Object.keys(query).every(key => item[key] === query[key]);
    });
  }
}

module.exports = JSONStorage;
