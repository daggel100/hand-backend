User ist angelegt, aber er erhält anscheinend keine Willkommensemail. Muss ich die test-email.js irgenwo einfügen?



Die Datei test-email.js ist nur ein eigenständiges Testskript und wird nicht automatisch beim Anlegen eines Users ausgeführt.
Sie dient nur dazu, den E-Mail-Versand manuell zu testen.


Wie funktioniert der automatische E-Mail-Versand?
Damit ein User nach der Registrierung automatisch eine Willkommens-/Verifizierungs-E-Mail bekommt, musst du den E-Mail-Versand direkt in deiner Register-Route (z.B. in authRoutes.js) aufrufen.

So geht’s:
1. Importiere deine E-Mail-Funktion in authRoutes.js:
```js
import { sendVerificationEmail } from '../utils/emailService.js';
```

2. import { sendVerificationEmail } from '../utils/emailService.js';
```js
await newUser.save();
await sendVerificationEmail(newUser.email, newUser.verificationCode);
```
Beispiel:
```js
import { sendVerificationEmail } from '../utils/emailService.js';

router.post('/register', async (req, res) => {
    try {
        // ...User anlegen...
        await newUser.save();

        // Willkommens-/Verifizierungs-E-Mail senden
        await sendVerificationEmail(newUser.email, newUser.verificationCode);

        res.status(201).json({ message: 'User erfolgreich erstellt' });
    } catch (error) {
        // ...
    }
});
```

Fazit:

test-email.js ist nur zum manuellen Testen.
Für den echten Ablauf musst du