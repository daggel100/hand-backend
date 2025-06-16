Wie kann ich das mit der Eingabe der Adresse und dem User in Postman machen.

So kannst du die Adresse für den eingeloggten User in Postman anlegen:

1. Login-Request machen
* Sende einen POST an /api/auth/login mit deinem User (Body: E-Mail & Passwort).
* Kopiere das erhaltene Token oder achte darauf, dass das Cookie gesetzt wird.

2. Adresse anlegen
* Methode: POST
* URL: http://localhost:4000/api/users/me/adresse
* Body:
Wähle „Body“ → „raw“ → „JSON“ und trage z.B. ein:

```json
{
  "firstName": "Max",
  "lastName": "Mustermann",
  "street": "Musterstraße 1",
  "zipCode": "12345",
  "city": "Musterstadt",
  "district": "Mitte"
}
```

* Auth:
    * Wenn du Cookie-Auth nutzt: Das Cookie wird automatisch mitgeschickt, wenn du im selben Tab arbeitest.
    * Wenn du Bearer-Token nutzt:
    Im Header

    Authorization: Bearer <deinToken>

3. Senden und prüfen
* Klicke auf Send.
* Du solltest als Antwort { message: 'Adresse erfolgrich angelegt', adresse: {...} } bekommen.