import app from './app';
import connectDB from './config/db';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config(); 

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  const server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });

  process.on('SIGINT', async () => {
    console.log('\nShutting down gracefully...');
    server.close(() => {
      mongoose.connection.close().then(() => {
        console.log('Database connection closed.');
        process.exit(0);
      });
    });
  });

  process.on('SIGTERM', async () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
      mongoose.connection.close().then(() => {
        console.log('Database connection closed.');
        process.exit(0);
      });
    });
  });
});
