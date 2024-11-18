# Architecture

![c4_java](https://github.com/user-attachments/assets/b5cc555e-905d-4c83-b9c9-6e0b156c6c75)

# Communicatie tussen de services

## Synchroon via OpenFeign
  OpenFeign wordt gebruikt voor directe, synchrone communicatie tussen de microservices.  

  _PostService - ReviewService:_  
  Wanneer een redacteur opmerkingen wil toevoegen bij afwijzing van een post, worden deze opmerkingen ook SYNC opgehaald van de ReviewService.  
  
  _ReviewService - PostService:_  
  Wanneer een redacteur de status van een voorlopige post wil aanpassen, worden deze SYNC opgehaald van de PostService.  
  
  _PostService - CommentService:_  
  Wanneer een gebruiker een reacties op een post wil lezen, worden deze SYNC opgehaald van de CommentService.


## Asynchroon via MessageBus (RabbitMQ)
  De Message Bus wordt gebruikt voor asynchrone communicatie wanneer een event niet onmiddellijk verwerkt hoeft te worden, of wanneer meerdere services geïnteresseerd kunnen zijn in dezelfde event.  

  _CommentService - MessageBus - PostService:_  
  Wanneer een post wordt goedgekeurd of afgewezen, moet de auteur direct worden geïnformeerd met een melding.  De status van de post moet dan ook in de PostService worden geüpdate. De ReviewService stuurt ASYNC een bericht naar de queue. De PostService luistert naar de queue en past zo de relevante post aan in de database.

# Structuur
### User & Editor
  De eindgebruiker die via de Angular Web Application interacteert met het systeem.  
  Gebruiker maakt verbinding met de Angular-app, die vervolgens API-verzoeken stuurt naar de API Gateway.

### Angular Web Application
  Frontend interface waarmee gebruikers kunnen communiceren met de backend-services.    
  Stuurt HTTP-verzoeken naar de API Gateway voor het uitvoeren van acties zoals het aanmaken of lezen van posts, reviews en reacties.

### API Gateway
  Centraliseert inkomende API-verzoeken en routeert ze naar de juiste backend-services.  
  De frontend stuurt alle verzoeken via de gateway.  


### Microservices
  Elk gebouwd in Spring Boot en biedt specifieke functionaliteiten binnen het domein.  
  

### Message Bus
  Biedt een mechanisme voor asynchrone communicatie tussen de microservices, bijvoorbeeld voor events of berichten die niet onmiddellijk hoeven te worden verwerkt. Als message broker maken we gebruik van RabbitMQ.

### Config Service
  Biedt gecentraliseerd configuratiebeheer voor alle microservices, zodat het makkelijker is om de application.properties over elke service te beheren.  
  Elke microservice (inclusief de API Gateway) haalt bij het opstarten zijn configuratie op bij de Config Service.  

### Discovery Service (Eureka)

  Maakt het mogelijk om microservices te registreren aan de Discovery service, om andere services te kunnen vinden.  
  Alle microservices, inclusief de API Gateway, registreren zichzelf bij de Discovery Service en gebruiken deze om met elkaar te communiceren.  
