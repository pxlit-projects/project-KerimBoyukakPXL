# Architecture

![c4_java](https://github.com/user-attachments/assets/91b93cc4-7f24-4ab6-aa84-f8c753a4ca2f)

## Structuur
### User & Editor
  Rol: De eindgebruiker die via de Angular Web Application interacteert met het systeem.  
  Relatie: Gebruiker maakt verbinding met de Angular-app, die vervolgens API-verzoeken stuurt naar de API Gateway.

### Angular Web Application
  Rol: Frontend interface waarmee gebruikers kunnen communiceren met de backend-services.  
  Relatie: Stuurt HTTP-verzoeken naar de API Gateway voor het uitvoeren van acties zoals het aanmaken of lezen van posts, reviews en reacties.

### API Gateway
  Rol: Centraliseert inkomende API-verzoeken en routeert ze naar de juiste backend-services, fungeert als de toegangspoort voor de frontend.  
  Relaties:  
  Angular Web Application → API Gateway: De frontend stuurt alle verzoeken via de gateway.  
  API Gateway ↔ Discovery Service: API Gateway registreert zichzelf bij de Discovery Service (Eureka) om microservices te vinden en op te lossen.  
  API Gateway → Config Service: Laadt configuraties van de Config Service.  

### PostService, ReviewService, CommentService (Microservices)
  Rol: Elk biedt specifieke functionaliteiten binnen het domein.  
  Relaties:  
  Synchrone communicatie via OpenFeign:  
  PostService ↔ ReviewService ↔ CommentService: Deze services gebruiken OpenFeign voor directe, synchrone communicatie met elkaar.  
  Registratie en Discovery:  
  Discovery Service: Elk van deze services registreert zichzelf bij de Discovery Service en gebruikt deze om andere services te vinden.  
  Configuratiebeheer:  
  Config Service: Bij het opstarten haalt elke service zijn configuratie op bij de Config Service.  

### Message Bus
  Rol: Biedt een mechanisme voor asynchrone communicatie tussen de microservices, bijvoorbeeld voor events of berichten die niet onmiddellijk hoeven te worden verwerkt.  
  Relatie: PostService, ReviewService, en CommentService kunnen berichten verzenden naar de Message Bus voor asynchrone verwerking door andere services die deze berichten consumeren.  

### Config Service
  Rol: Biedt gecentraliseerd configuratiebeheer voor alle microservices, zodat alle services toegang hebben tot uniforme instellingen.  
  Relaties:  
  Elke microservice (inclusief de API Gateway) haalt bij het opstarten zijn configuratie op bij de Config Service.  

### Discovery Service (Eureka)

  Rol: Stelt microservices in staat om zichzelf te registreren en andere services te vinden zonder vaste IP-adressen, wat helpt bij load balancing en fouttolerantie.  
  Relaties:  
  Registratie en Discovery: Alle microservices, inclusief de API Gateway, registreren zichzelf bij de Discovery Service en gebruiken deze om andere services te vinden.  

## Communicatie

### OpenFeign
  OpenFeign wordt gebruikt voor directe, synchrone communicatie tussen de microservices. Dit betekent dat een service een verzoek stuurt naar een andere service en direct een antwoord verwacht.  

  ReviewService - PostService:  
  **De ReviewService wil details ophalen van een post die beoordeeld moet worden.**  
  De ReviewService maakt gebruik van OpenFeign om een GET-verzoek te sturen naar de PostService en ontvangt een antwoord met de postgegevens.  
  
  CommentService - PostService:  
  **De CommentService wil controleren of een post bestaat voordat een reactie wordt toegevoegd.**  
  De CommentService stuurt een verzoek naar de PostService om te controleren of de opgegeven post-ID geldig is.  

### MessageBus
  De Message Bus wordt gebruikt voor asynchrone communicatie. Dit is handig wanneer een gebeurtenis niet onmiddellijk verwerkt hoeft te worden, of wanneer meerdere services geïnteresseerd kunnen zijn in dezelfde gebeurtenis. Enkele voorbeelden:  
  
  Post goedkeuren of afwijzen:  
  **Wanneer een post is goedgekeurd of afgewezen in de ReviewService, wordt een bericht naar de Message Bus gestuurd.**  
  Producent: De ReviewService stuurt een bericht met de status van de beoordeling naar de Message Bus.  
  Consument: De PostService luistert naar deze berichten en update de status van de post (bijvoorbeeld "Goedgekeurd" of "Afgewezen").  
  
  Melding bij goedkeuring of afwijzing:  
  **Bij het goedkeuren of afwijzen van een post wil de ReviewService de auteur hiervan op de hoogte brengen.**  
  Producent: De ReviewService stuurt een notificatiebericht naar de Message Bus.  
  Consument: Een aparte NotificationService (als die bestaat) ontvangt het bericht en verstuurt een e-mail of pushmelding naar de auteur.  
  
  Nieuwe reactie plaatsen:  
  **Wanneer een gebruiker een reactie plaatst, wil je andere gebruikers informeren over de nieuwe bijdrage.**  
  Producent: De CommentService stuurt een bericht naar de Message Bus wanneer een nieuwe reactie is toegevoegd.  
  Consument: Een NotificationService ontvangt dit bericht en verstuurt notificaties naar de betrokkenen.  

