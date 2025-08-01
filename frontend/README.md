# Sheet2DBR - Frontend

A React application for uploading and processing Excel/CSV files.

## Features

- 📁 Drag & drop file upload
- 📊 Support for Excel (.xlsx, .xls) and CSV files
- 🚀 Built with React + TypeScript + Vite
- 🎨 Styled with Tailwind CSS
- 🔔 Toast notifications for user feedback

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Sheet2DBR-Front
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your actual values:
   - `VITE_API_BASE_URL` - Your backend API URL
   - `VITE_APP_NAME` - Your app name
   - etc.

4. **Start development server**
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── components/     # React components
├── config/        # Environment configuration
├── pages/         # Page components
├── services/      # API service functions
└── styles/        # CSS styles
```

## Technologies Used

- **React** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Hot Toast** - Notifications
- **Lucide React** - Icons

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
