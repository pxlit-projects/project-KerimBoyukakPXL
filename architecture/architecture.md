# Architecture

![c4_java](https://github.com/user-attachments/assets/221fb85a-a3a9-4735-88a6-56931a571fd9)

## User & Editor
Rol: De eindgebruiker die via de Angular Web Application interacteert met het systeem.
Relatie: Gebruiker maakt verbinding met de Angular-app, die vervolgens API-verzoeken stuurt naar de API Gateway.

## Angular Web Application
Rol: Frontend interface waarmee gebruikers kunnen communiceren met de backend-services.
Relatie: Stuurt HTTP-verzoeken naar de API Gateway voor het uitvoeren van acties zoals het aanmaken of lezen van posts, reviews en reacties.

## API Gateway
Rol: Centraliseert inkomende API-verzoeken en routeert ze naar de juiste backend-services, fungeert als de toegangspoort voor de frontend.
Relaties:
Angular Web Application → API Gateway: De frontend stuurt alle verzoeken via de gateway.
API Gateway ↔ Discovery Service: API Gateway registreert zichzelf bij de Discovery Service (Eureka) om microservices te vinden en op te lossen.
API Gateway → Config Service: Laadt configuraties van de Config Service.

## PostService, ReviewService, CommentService (Microservices)
Rol: Elk biedt specifieke functionaliteiten binnen het domein.
Relaties:
Synchrone communicatie via OpenFeign:
PostService ↔ ReviewService ↔ CommentService: Deze services gebruiken OpenFeign voor directe, synchrone communicatie met elkaar.
Registratie en Discovery:
Discovery Service: Elk van deze services registreert zichzelf bij de Discovery Service en gebruikt deze om andere services te vinden.
Configuratiebeheer:
Config Service: Bij het opstarten haalt elke service zijn configuratie op bij de Config Service.

## Message Bus
Rol: Biedt een mechanisme voor asynchrone communicatie tussen de microservices, bijvoorbeeld voor events of berichten die niet onmiddellijk hoeven te worden verwerkt.
Relatie: PostService, ReviewService, en CommentService kunnen berichten verzenden naar de Message Bus voor asynchrone verwerking door andere services die deze berichten consumeren.

## Config Service
Rol: Biedt gecentraliseerd configuratiebeheer voor alle microservices, zodat alle services toegang hebben tot uniforme instellingen.
Relaties:
Eenrichtingsrelatie naar alle services: Elke microservice (inclusief de API Gateway) haalt bij het opstarten zijn configuratie op bij de Config Service.

## Discovery Service (Eureka)

Rol: Stelt microservices in staat om zichzelf te registreren en andere services te vinden zonder vaste IP-adressen, wat helpt bij load balancing en fouttolerantie.
Relaties:
Registratie en Discovery: Alle microservices, inclusief de API Gateway, registreren zichzelf bij de Discovery Service en gebruiken deze om andere services te vinden.
