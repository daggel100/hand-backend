ich habe gestern über Postman meinen ersten User mit nur namen und email auf Mongdb erstellt. In SQL würde das jetzt Tabelle heißen, in MongoDB ist ein Sammeldokument? Keine Ahnung wie das da heißt. Ich möchte jetz gerne die Datei userSchema.js so erweitern, dass wir aus den namen nicknamen machen, email bleibt bestehen, passwort gehasht und verify true oder false setzen. fals, wenn noch nicht mit dem Bestätigungsbutten bestätigt wurde und true, wenn der erhaltene Code mit den Ziffern vom User bestätigt wurde. Dann möchte ich wegen Datenschutz eine SQL Tabelle genannt Namens Adresse (adressSchema.js) erstellen, die dann zu dem entsprechenden User aufploppen muss, wenn man die sehen will. In SQL wäre die Verbindung mit PK und FK glaube ich korrekt. Das muss aber für MongoDb gemacht werden. Bei SQL fällt es mir leichter das zu benennen


Sehr gute und strukturierte Anforderungen!
Hier die MongoDB- und Mongoose-Umsetzung deiner Wünsche, inklusive kurzer Erklärungen zu den Unterschieden zu SQL.


1. User-Schema (userSchema.js)
    * nickname statt name
    * email bleibt
    * password wird gehasht gespeichert
    * verify (Boolean, Standard: false)
    * adresse als Referenz auf das Adress-Dokument (wie FK in SQL)


???????????????????
```js
const user = await User.findById(userId).populate('adresse');
``` 
?????????????????

Antwort:
wird verwendet, wenn du einen User aus der Datenbank abfragen und dabei die zugehörige Adresse direkt mitladen möchtest (wie ein SQL-Join).

Wo kommt dieser Code hin?
Typischerweise in eine Route oder einen Controller, z.B. wenn du ein User-Profil anzeigen möchtest.

Du kannst dafür eine eigene Datei (z.B. `userController.js` oder eine spezielle Route in `userRoutes.js`) anlegen.

userRoutes.js:
```js
import express from 'express';
import User from '../models/userSchema.js';

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

export default router;
```


Zusammengefasst

Der populate-Code gehört in eine Route oder einen Controller, wo du User-Daten inkl. Adresse abrufen willst.
Du kannst dafür eine eigene Datei anlegen, z.B. userRoutes.js oder userController.js.

Im Frontend kannst du dann z.B. per GET /api/user/123456 alle Userdaten inkl. Adresse abrufen.


Du hast keinen Denkfehler – du hast alles richtig gemacht!

So funktioniert es:
1. Deine Datei userRoutes.js exportiert den Router mit der Route:
```js
router.get('/user/:id', async (req, res) => {
  const user = await User.findById(req.params.id).populate('adresse');
  // ...
});
export default router;
```
2. In deiner server.js bindest du die Routen ein:
```js
import userRoutes from './routes/userRoutes.js';
app.use('/api', userRoutes);
```

3. Aufruf im Frontend oder per Postman:

Du kannst jetzt mit
GET http://localhost:4000/api/user/<userId>
einen User inklusive der verknüpften Adresse abfragen.

Erklärung:

* Das `.populate('adresse')` sorgt dafür, dass beim User-Dokument das verknüpfte Adress-Dokument (aus der Adress-Tabelle/Sammlung) mitgeladen wird.

* Das Ergebnis ist ein JSON-Objekt mit allen Userdaten und einem eingebetteten Adressobjekt.



Genau, jetzt ist es wieder klar!
Dein Schema ist richtig aufgebaut:

Das Passwort wird automatisch gehasht gespeichert (durch das pre('save')-Hook).
Das Feld isVerify steuert, ob der User verifiziert ist.
Die Methode matchPassword vergleicht das eingegebene Passwort mit dem Hash.



Frage: Ich möchte mint Posstman einen oder zwei Testuser anlegen, wie mache ich das im Body? Die Attributte für userSchema nutzen und wie kann ich dann aber die Adresse gleichzeitig mit eingeben? Und, weil es ja dort dies "Cookies" gibt sollten wir noch schauen JWT einrichten denke ich

1. Testuser mit Postman anlegen
Du kannst einen User mit folgendem JSON im Body (raw, JSON) anlegen:

```js
{
  "nickname": "Max",
  "email": "max@example.com",
  "password": "geheim123"
}
```
Wichtig:

* Das Feld isVerify musst du nicht mitschicken, es ist standardmäßig false.
* Das Feld adress kannst du erst setzen, wenn die Adresse existiert (siehe unten).


2. Adresse gleichzeitig anlegen
In MongoDB/Mongoose ist es üblich, erst die Adresse anzulegen und dann die ID beim User zu speichern.
Du brauchst also zwei Schritte:


Schritt 1: Adresse anlegen (POST auf /api/adresse oder ähnlich)
```js
{
  "strasse": "Musterstraße 1",
  "plz": "12345",
  "ort": "Musterstadt"
}
```

Du bekommst als Antwort die Adress-ID, z.B.:
```js
{
  "_id": "666abc123def4567890abcde",
  "strasse": "...",
  ...
}
```
Schritt 2: User anlegen (POST auf /api/user)
Jetzt kannst du die Adress-ID mitgeben:
```js
{
  "nickname": "Max",
  "email": "max@example.com",
  "password": "geheim123",
  "adress": "666abc123def4567890abcde"
}
```

3. JWT (JSON Web Token) einrichten

JWT wird nach dem Login verwendet, um den User zu authentifizieren.
Typischer Ablauf:

1. User loggt sich ein (POST /api/auth/login mit Email und Passwort)
2. Backend prüft Passwort und isVerify
3. Backend erstellt JWT-Token und gibt ihn zurück (z.B. im JSON oder als Cookie)
4. Frontend speichert Token (z.B. im LocalStorage oder als Cookie) und schickt ihn bei weiteren Requests mit


Beispiel für das Erstellen eines JWT-Tokens im Backend:

```js
import jwt from 'jsonwebtoken';

const token = jwt.sign(
  { id: user._id },
  process.env.JWT_SECRET,
  { expiresIn: '1d' }
);
```

Im Login-Controller dann:

```js
res.json({
  message: 'Login erfolgreich',
  token,
  user: {
    _id: user._id,
    nickname: user.nickname,
    email: user.email
  }
});
```

Zusammengefasst

* User und Adresse werden in zwei Schritten angelegt (erst Adresse, dann User mit Adress-ID)
* JWT wird beim Login erstellt und zurückgegeben

In Postman:

1. Adresse anlegen → ID merken
2. User anlegen mit "adress": "ID"

Wenn du möchtest, kann ich dir Beispielrouten für Adresse und User anlegen! Sag einfach Bescheid.