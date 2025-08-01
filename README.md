# Sheet2DB 📊➡️🗄️

A modern web application for seamlessly importing Excel and CSV files into MongoDB databases with an intuitive interface and powerful validation features.

![Sheet2DB Logo](frontend/src/assets/Sheet2DBLogo.png)

## 🌟 Overview

Sheet2DB simplifies the process of importing structured data from spreadsheet files into MongoDB databases. Built with modern web technologies, it provides a user-friendly interface for data validation, column selection, and automated database insertion.

## 🏗️ Project Structure

This repository contains multiple versions of the application, each with enhanced features:

### Repository Branches

- **`main`** - Stable production version (v1)
- **`v1`** - Initial version with single-sheet support
- **`v2`** - Enhanced version with multi-sheet Excel support  
- **`v3`** - Latest development version with authentication (based on v2)

### Version Features

| Version | Features |
|---------|----------|
| **v1** | ✅ Single Excel/CSV sheet import<br>✅ Data preview and validation<br>✅ Column selection<br>✅ MongoDB insertion |
| **v2** | ✅ All v1 features<br>✅ Multi-sheet Excel support<br>✅ Tab navigation interface<br>✅ Per-sheet collection selection |
| **v3** | ✅ All v2 features<br>✅ User authentication system<br>✅ Secure access control |

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB database
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yssf132/Sheet2DB-Internship.git
   cd Sheet2DB-Internship
   ```

2. **Choose your version**
   ```bash
   # For stable version (v1)
   git checkout main
   
   # For multi-sheet support (v2)
   git checkout v2
   
   # For latest with authentication (v3)
   git checkout v3
   ```

3. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Configure your MongoDB URI in .env
   npm run dev
   ```

4. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

### Environment Configuration

Create a `.env` file in the backend directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sheet2db
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

## 🎯 Key Features

### 📂 File Upload Support
- Excel files (.xlsx, .xls)
- CSV files (.csv)
- File size validation (10MB max)
- Format verification

### 👀 Data Preview
- Interactive data preview
- Column type detection
- Real-time validation feedback

### ✅ Smart Validation
- Format validation
- Empty field detection
- Duplicate detection
- Data type consistency checks

### 🎛️ Flexible Import Options
- Column selection interface
- Custom collection naming
- Multi-sheet processing (v2+)
- Batch operations

### 🔐 Security (v3)
- JWT-based authentication
- Secure API endpoints
- User session management

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI library
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - NoSQL database
- **Mongoose** - ODM library
- **Multer** - File upload handling
- **JWT** - Authentication (v3)

### Development Tools
- **Figma** - UI/UX Design
- **Jira** - Project management
- **GitHub** - Version control
- **Visual Studio Code** - IDE

## 📋 Usage Workflow

1. **Upload File** - Select and upload your Excel/CSV file
2. **Preview Data** - Review the detected columns and data structure
3. **Select Columns** - Choose which columns to import
4. **Validate** - System performs comprehensive data validation
5. **Configure** - Set collection name and import options
6. **Import** - Data is inserted into MongoDB with status feedback

## 🏛️ Architecture

```
┌─────────────────┐    HTTP/REST    ┌─────────────────┐
│   React Client  │ ◄──────────────► │  Express Server │
│   (Frontend)    │                 │   (Backend)     │
└─────────────────┘                 └─────────────────┘
                                            │
                                            ▼
                                    ┌─────────────────┐
                                    │    MongoDB      │
                                    │   (Database)    │
                                    └─────────────────┘
```

## 📊 Project Management

The project was developed using Agile methodologies with:
- **Jira** for task tracking and sprint planning
- **GitHub** for version control and collaboration
- **Iterative development** with continuous integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## 📝 API Documentation

### Main Endpoints

```
POST /api/upload          # Upload file
GET  /api/preview/:id     # Preview file data
POST /api/validate-and-import  # Validate and import data
```

## 🔧 Development Commands

```bash
# Backend
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server

# Frontend  
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## 📄 License

This project is licensed under the ISC License.

## 👥 Team

Developed as part of an internship project focusing on modern web development practices and database integration.

## 🔗 Links

- [MongoDB Documentation](https://www.mongodb.com/)
- [React Documentation](https://react.dev/)
- [Node.js Documentation](https://nodejs.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/)

---

**Sheet2DB** - Transforming spreadsheets into structured databases with ease! 🚀
