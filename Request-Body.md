Sorry, der Ausdruck Request-Body hat sich bei mir noch nicht gefesstigt. In welcher Datei finde ich das


Kein Problem!
Der Request-Body ist die Daten, die du z.B. mit Postman oder vom Frontend an dein Backend schickst – also das JSON, das du beim Registrieren eines Users sendest.

Im Code findest du den Request-Body immer als req.body in deiner Route, z.B. in deiner authRoutes.js: