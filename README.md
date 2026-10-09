# IT Mentor: IT assistant chatbot (Rasa + Docker)

![Rasa](https://img.shields.io/badge/Rasa-3.6-5A17EE?logo=rasa&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-1.27-009639?logo=nginx&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES2020-F7DF1E?logo=javascript&logoColor=black)
![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Context](https://img.shields.io/badge/Master%20AI%20%26%20Cybersecurity-Virtualization%20%26%20Cloud-6242ff)

**IT Mentor** is a French-language chatbot that answers beginner questions about software development, networking, cybersecurity, databases, cloud and Docker. The NLU model is built with **Rasa Open Source**. The bot and its web interface run as **two Docker containers** orchestrated with **Docker Compose**, with **Nginx** serving the UI and proxying chat requests to the Rasa REST API.

> Built during the **Virtualization & Cloud Computing** module of the Master in Artificial Intelligence & Cybersecurity (Faculté des Sciences de Kénitra, Université Ibn Tofail), 2025–2026.

## Architecture

```text
Browser ──► Nginx (web container, :8080)
              ├── /                      → static UI (web/)
              └── /webhooks/rest/webhook → Rasa server (rasa container, :5005)
                                              └── trained model (DIET + TED policies)
```

The image trains the model at build time (`rasa train`), so `docker compose up` gives a working bot with no extra step.

## Tech stack

| Layer | Tools |
|---|---|
| NLU and dialogue | Rasa 3.6 (`DIETClassifier`, `ResponseSelector`, `TEDPolicy`, `RulePolicy`, `FallbackClassifier`) |
| Containers | Docker, Docker Compose (`rasa/rasa:3.6.20-full`, `nginx:1.27-alpine`) |
| Reverse proxy | Nginx |
| Front end | HTML, CSS, vanilla JavaScript (Fetch API) |

## What the bot covers

14 intents: greetings, goodbye, thanks, "are you a bot?", API definition, programming languages, networking, cybersecurity, databases, cloud, Docker, programming method, IT careers, and an out-of-scope fallback (confidence threshold 0.45).

## Installation

Requirements: Docker and Docker Compose.

```bash
git clone https://github.com/L3wina-debug/it-mentor-rasa-docker.git
cd it-mentor-rasa-docker
docker compose up --build
```

Then open **http://localhost:8080**. The first build takes a few minutes because it trains the Rasa model.

## Usage

Type a question in the chat, or click one of the suggestions:

```text
You : Qu'est-ce que Docker ?
Bot : Docker emballe une application et ses dépendances dans une image...
```

You can also call the Rasa REST API directly:

```bash
curl -X POST http://localhost:5005/webhooks/rest/webhook \
  -H "Content-Type: application/json" \
  -d '{"sender": "test", "message": "Explique TCP IP"}'
```

Run the conversation tests inside the Rasa container:

```bash
docker compose exec rasa rasa test --stories tests/test_stories.yml
```

## Project structure

```text
├── config.yml            # NLU pipeline and dialogue policies
├── domain.yml            # intents, entities, responses
├── data/                 # nlu.yml, stories.yml, rules.yml
├── tests/                # conversation tests
├── Dockerfile            # Rasa image (trains the model at build time)
├── docker-compose.yml    # rasa + web services
├── nginx/default.conf    # static files + proxy to Rasa
├── web/                  # chat interface
└── DEPLOYMENT_CLOUD.md   # proposed cloud architecture (not deployed)
```

## Cloud deployment (proposed, not deployed)

`DEPLOYMENT_CLOUD.md` describes a target architecture with an HTTPS load balancer, replicated Nginx and Rasa containers, a private registry (ECR / ACR / Artifact Registry) and managed secrets. The project itself runs locally with Docker Compose.

## What I learned

- **Designing an NLU model:** writing intents and training examples, tuning the DIET pipeline, and using a fallback threshold so the bot admits when a question is out of scope.
- **Containerizing a multi-service app:** building a Rasa image that trains its model at build time, and wiring two services with Docker Compose.
- **Reverse proxying with Nginx:** serving a static front end and forwarding only the webhook path to an internal service.
- **Planning for the cloud:** keeping the bot stateless so it can scale horizontally, and keeping secrets out of Git.

## Author

**Mahmoud El Aaouadi**, Master's student in AI & Cybersecurity. [Portfolio](https://mahmoud-elaaouadi.netlify.app) · [LinkedIn](https://www.linkedin.com/in/mahmoud-elaaouadi-7b3087416)

## License

[MIT](LICENSE)
