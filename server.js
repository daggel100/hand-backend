
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './database/database.js';
import authRoutes from './routes/authRoutes.js';
import  testEmailRoutes from './routes/testEmailRoutes.js';
import userRoutes from './routes/userRoutes.js';
import verifyRoutes from './routes/verifyRoutes.js';
import cookieParser from 'cookie-parser';
import adressRoutes from './routes/adressRoutes.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();


app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',  // Ersetze dies mit der URL deiner Frontend-App
  credentials: true, // Erlaubt Cookies und Authentifizierungs-Header 
}));
app.use(express.json());

// Middleware zum Parsen von Cookies
app.use(cookieParser());

//"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NGVlYTJlNzYwMjdkODk0YWVkMTY2MSIsImlhdCI6MTc1MDAwNDkzMywiZXhwIjoxNzUyNTk2OTMzfQ.9mkHG1g4_F5qZcxa6s5VvJjwtGfyWP98irfmbT_Zt88",

// Routes

// Beispiel-Route zum Testen des E-Mail-Versands
// app.post('/api/test-email', async (req, res) => {
//   const { email, code } = req.body;
//   const result = await sendVerificationEmail(email, code);
//   try {
//     if (result.success) {
//       res.status(200).json({ success: true, message: 'E-Mail erfolgreich gesendet!', messageId: result.messageId });
//     } else {
//       res.status(500).json({ success: false, error: result.error });
//     }
    
//   } catch (error) {
//     console.error('Fehler beim Senden der E-Mail:', error);
//     res.status(500).json({ success: false, error: 'Interner Serverfehler' });
//   }
// })


app.get('/', (req, res) => {
  res.send('Willkommen im Hand in Hand Backenend!');
});
app.use('/api', userRoutes);

// Fügt die Adress-Routen hinzu
app.use('/api', adressRoutes);

app.use('/api/auth', authRoutes);

// Route zum Testen des E-Mail-Versands und Verifizierung
app.use('/api/test-email', testEmailRoutes);

// Route für den E-Mail-Verifizierungsprozess im Backend
app.use('/api', verifyRoutes);

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
}
);