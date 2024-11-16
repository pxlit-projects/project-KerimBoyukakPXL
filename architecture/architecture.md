# Architecture

![c4_java](https://github.com/user-attachments/assets/91b93cc4-7f24-4ab6-aa84-f8c753a4ca2f)

# Structuur
### User & Editor
  Rol: De eindgebruiker die via de Angular Web Application interacteert met het systeem.  
  Relatie: Gebruiker maakt verbinding met de Angular-app, die vervolgens API-verzoeken stuurt naar de API Gateway.

### Angular Web Application
  Rol: Frontend interface waarmee gebruikers kunnen communiceren met de backend-services.  
  Relatie:  
  Stuurt HTTP-verzoeken naar de API Gateway voor het uitvoeren van acties zoals het aanmaken of lezen van posts, reviews en reacties.

### API Gateway
  Rol: Centraliseert inkomende API-verzoeken en routeert ze naar de juiste backend-services, fungeert als de toegangspoort voor de frontend.  
  Relaties:  
  Angular Web Application: De frontend stuurt alle verzoeken via de gateway.  
  Discovery Service: API Gateway registreert zichzelf bij de Discovery Service (Eureka) om microservices te vinden en op te lossen.  
  Config Service: Laadt configuraties van de Config Service.  

### PostService, ReviewService, CommentService (Microservices)
  Rol: Elk biedt specifieke functionaliteiten binnen het domein.  
  Relaties:  
  Synchrone communicatie via OpenFeign:  
  PostService ↔ ReviewService ↔ CommentService: Deze services gebruiken OpenFeign voor directe, synchrone communicatie met elkaar.  
  Discovery Service: Elk van deze services registreert zichzelf bij de Discovery Service en gebruikt deze om andere services te vinden.  
  Config Service: Bij het opstarten haalt elke service zijn configuratie op bij de Config Service.  

### Message Bus
  Rol: Biedt een mechanisme voor asynchrone communicatie tussen de microservices, bijvoorbeeld voor events of berichten die niet onmiddellijk hoeven te worden verwerkt.  
  Relatie: PostService, ReviewService, en CommentService kunnen berichten verzenden via de NotificationService naar de Message Bus voor asynchrone verwerking door andere services die deze berichten consumeren.  

### Config Service
  Rol: Biedt gecentraliseerd configuratiebeheer voor alle microservices, zodat alle services toegang hebben tot uniforme instellingen.  
  Relaties:  
  Elke microservice (inclusief de API Gateway) haalt bij het opstarten zijn configuratie op bij de Config Service.  

### Discovery Service (Eureka)

  Rol: Stelt microservices in staat om zichzelf te registreren en andere services te vinden zonder vaste IP-adressen, wat helpt bij load balancing en fouttolerantie.  
  Relaties:  
  Registratie en Discovery: Alle microservices, inclusief de API Gateway, registreren zichzelf bij de Discovery Service en gebruiken deze om andere services te vinden.  

# Communicatie

### Synchroon via OpenFeign
  OpenFeign wordt gebruikt voor directe, synchrone communicatie tussen de microservices door middel van een NotificationService.  

  _PostService - NotificationService_
  De auteur van een post moet direct worden geïnformeerd wanneer de post succesvol is aangemaakt of gepubliceerd.  
  PostService roept een endpoint van de NotificationService aan via OpenFeign, bijvoorbeeld: /notifications/send.  
  De NotificationService verstuurt de notificatie.  

  _ReviewService - NotificationService:_  
  Wanneer een post wordt goedgekeurd of afgewezen, moet de auteur direct worden geïnformeerd met een melding.   
  ReviewService roept via OpenFeign de NotificationService aan met de details van de notificatie.  
  
  _CommentService - NotificationService:_  
  Wanneer een gebruiker een reactie plaatst, moet de auteur van de post of andere betrokkenen direct een melding ontvangen. 
  CommentService gebruikt OpenFeign om een notificatieverzoek naar de NotificationService te sturen. 

### Asynchroon via MessageBus
  De Message Bus wordt gebruikt voor asynchrone communicatie wanneer een event niet onmiddellijk verwerkt hoeft te worden, of wanneer meerdere services geïnteresseerd kunnen zijn in dezelfde event. 
  
  _PostService - NotificationService:_  
  Wanneer een post wordt aangemaakt, wordt een event gepubliceerd naar de RabbitMQ-queue.  
  Producent: De PostService gebruikt RabbitTemplate om een bericht naar de queue post-event-queue te sturen.  
  Consument: De NotificationService luistert naar post-event-queue en verwerkt het bericht om notificaties te versturen.  
  
  _ReviewService - NotificationService:_  
  Wanneer een post wordt goedgekeurd of afgewezen, wordt een event gepubliceerd naar RabbitMQ.   
  Producent: De ReviewService stuurt een bericht naar de queue review-event-queue met details zoals de poststatus (goedgekeurd of afgewezen) en eventuele opmerkingen.  
  Consument: Consument: De NotificationService luistert naar review-event-queue en verstuurt meldingen naar de betrokken gebruikers.  
  
  _CommentService - NotificationService:_  
  Wanneer een reactie wordt geplaatst, wordt een event gepubliceerd naar RabbitMQ.  
  Producent: De CommentService stuurt een bericht naar de queue comment-event-queue met informatie zoals reactie-ID, post-ID, en auteur van de reactie.  
  Consument: De NotificationService ontvangt dit bericht en verstuurt notificaties naar de betrokkenen.  
