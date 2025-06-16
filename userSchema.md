 nickname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isVerify: {
    type: Boolean,
    default: false,
  },
  adress: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Adress', // Verweis auf das Adressmodell
  }, 
  isAdmin: {
    type: Boolean,
    default: false,
  },
  verificationCode: { // Code zur Verifizierung der E-Mail muss sein oder nicht?
    type: Number,
    required: true,
  },

  Fragen zu Postman

  Der Verifizierungscode soll ja erst dann geschrieben werden, wenn der Bestätigunsbutten auf der Willkommensmail geklickt wurde

  Das ist ein wichtiger Punkt!

  Der Verifizierungscode wird normalerweise beim Anlegen des Users generiert und in der Datenbank gespeichert, damit du ihn in der E-Mail an den User schicken kannst.
  Wenn der User dann auf den Bestätigungsbutton klickt, wird der Code vom Frontend an das Backend geschickt, und das Backend sucht nach einem User mit genau diesem Code, um isVerify auf true zu setzen.

 Typischer Ablauf:

1. User registriert sich:

  * Backend generiert einen zufälligen Verifizierungscode (z.B. 6-stellige Zahl).
  * Der Code wird im Feld verificationCode beim User gespeichert.
  * Der Code wird per E-Mail an den User geschickt.
  
2. User klickt auf den Bestätigungslink in der E-Mail:

  * Im Link ist der Code als Parameter enthalten (z.B. /verify?code=123456).
  * Das Frontend liest den Code aus der URL und schickt ihn per POST an das Backend.

3. Backend prüft den Code:

  * Findet einen User mit diesem verificationCode.
  * Setzt isVerify auf true und entfernt (optional) den Code.

Wichtig für dein Schema:

  * Das Feld verificationCode muss beim Anlegen des Users gesetzt werden, sonst gibt es einen Fehler wegen required: true.
  * Wenn du möchtest, dass das Feld nach der Verifizierung leer ist, kannst du es nach erfolgreicher Verifizierung auf undefined oder null setzen.

  Zusammengefasst:

    * Beim Anlegen: verificationCode MUSS gesetzt werden (z.B. zufällig generiert).
    * Nach Verifizierung: isVerify wird auf true gesetzt, verificationCode kann gelöscht werden.
    
    Du brauchst also den Code schon beim Anlegen, damit du ihn verschicken kannst!
    Er wird nicht erst beim Klick auf den Button erzeugt, sondern schon bei der Registrierung.

