
import express from 'express';
import User from '../models/userSchema.js';
import { protect } from '../middelware/authMiddleware.js'; // Assuming you have an auth middleware for protection

const router = express.Router();

router.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('adresse');
    if (!user) {
      return res.status(404).json({ message: 'User nicht gefunden' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Serverfehler', error: error.message });
  }
});

// Route für eingeloggten User (JWT-geschützt)
router.get('/users/me', protect, async (req, res) => {
  res.json(req.user);
});

// Admin kann andere User zu Admins machen
// router.patch('/user/:id/make-admin', async (req, res) => {
//     try {
//         // Hier sollte geprüft werden, ob der aktuelle User Admin ist (z.B. per JWT und Middleware)
//         const user = await User.findByIdAndUpdate(
//             req.params.id,
//             { isAdmin: true },
//             { new: true }
//         );
//         if (!user) return res.status(404).json({ message: 'User nicht gefunden' });
//         res.json({ message: 'User ist jetzt Admin', user });
//     } catch (error) {
//         res.status(500).json({ message: 'Serverfehler', error: error.message });
//     }
// });

export default router;