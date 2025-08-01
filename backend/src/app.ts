// Main Express application setup
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

// import route de l'imprt
import uploadRoutes from './routes/UploadRoutes';
// import route preview file
import previewRoutes from './routes/PreviewRoutes';
//import route validate and import
import importRoutes from './routes/ImportRoutes';

dotenv.config(); 

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes

//route de l'import
app.use('/api', uploadRoutes);
// preview route
app.use('/api',previewRoutes);
// validate import route
app.use('/api',importRoutes);

export default app;
