# SoilLearn Backend API

A Node.js/Express backend for the SoilLearn educational platform, providing classroom management functionality with JSON-based local storage.

## Features

- **Classroom Management**: Create, update, delete classrooms
- **Unique Classroom Codes**: Auto-generated 6-character codes (3 letters + 3 numbers)
- **Student Management**: Add/remove students from classrooms
- **JSON Storage**: Local file-based data persistence
- **Input Validation**: Comprehensive request validation using Joi
- **Error Handling**: Structured error responses

## API Endpoints

### Classrooms

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/classrooms?teacherId={id}` | Get all classrooms for a teacher |
| POST | `/api/classrooms` | Create new classroom |
| GET | `/api/classrooms/{id}` | Get classroom by ID |
| PUT | `/api/classrooms/{id}` | Update classroom |
| DELETE | `/api/classrooms/{id}` | Delete classroom |
| GET | `/api/classrooms/code/{code}` | Get classroom by code |
| POST | `/api/classrooms/{id}/join` | Student joins classroom |
| DELETE | `/api/classrooms/{id}/students/{studentId}` | Remove student |
| POST | `/api/classrooms/{id}/regenerate-code` | Regenerate classroom code |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | API health status |

## Installation

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start
```

## Dependencies

```json
{
  "express": "^4.18.2",
  "cors": "^2.8.5",
  "helmet": "^7.1.0",
  "morgan": "^1.10.0",
  "uuid": "^9.0.1",
  "joi": "^17.11.0"
}
```

## Data Structure

### Classroom Object
```json
{
  "id": "uuid-v4",
  "code": "ABC123",
  "name": "Biology - Plant Growth Study",
  "description": "Advanced plant biology classroom",
  "subject": "Biology",
  "gradeLevel": "10th Grade",
  "teacherId": "teacher-uuid",
  "teacherName": "Dr. Smith",
  "students": [
    {
      "studentId": "student-uuid",
      "studentName": "John Doe",
      "rollNumber": "2024001",
      "joinedAt": "2024-01-15T10:30:00Z",
      "isActive": true
    }
  ],
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:30:00Z",
  "isActive": true,
  "settings": {
    "allowStudentJoin": true,
    "maxStudents": 50,
    "requireApproval": false
  }
}
```

## Usage Examples

### Create Classroom
```bash
curl -X POST http://localhost:5000/api/classrooms \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Advanced Biology",
    "description": "Plant growth and soil science",
    "subject": "Biology",
    "gradeLevel": "10th Grade",
    "teacherId": "teacher-123",
    "teacherName": "Dr. Smith",
    "maxStudents": 30
  }'
```

### Student Join Classroom
```bash
curl -X POST http://localhost:5000/api/classrooms/{classroom-id}/join \
  -H "Content-Type: application/json" \
  -d '{
    "code": "ABC123",
    "studentId": "student-456",
    "studentName": "Jane Doe",
    "rollNumber": "2024001"
  }'
```

## File Structure

```
backend/
├── data/                 # JSON storage files
│   └── classrooms.json
├── models/
│   └── Classroom.js      # Classroom model
├── routes/
│   ├── classrooms.js     # Classroom routes
│   └── teachers.js       # Teacher routes
├── utils/
│   ├── storage.js        # JSON file operations
│   └── codeGenerator.js  # Unique code generation
├── validators/
│   └── classroomValidator.js # Input validation
├── server.js             # Main server file
├── package.json
└── README.md
```

## Error Responses

```json
{
  "error": "Validation Error",
  "message": "Classroom name is required",
  "details": [...]
}
```

## Development

- Server runs on port 5000 by default
- Uses nodemon for development auto-restart
- JSON files stored in `./data/` directory
- Comprehensive logging with Morgan
- CORS enabled for frontend integration
