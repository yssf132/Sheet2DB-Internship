// Server entry point (starts app)
import app from './app';
import connectDB from './config/db';
import dotenv from 'dotenv';

dotenv.config(); 

const PORT = process.env.PORT || 5000;

// Connexion à la base, puis démarrage du serveur
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
});
