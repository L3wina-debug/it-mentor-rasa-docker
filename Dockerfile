FROM rasa/rasa:3.6.20-full

WORKDIR /app
USER root
COPY config.yml domain.yml credentials.yml endpoints.yml ./
COPY data ./data
RUN rasa train --fixed-model-name assistant-it.tar.gz
USER 1001
EXPOSE 5005
CMD ["run", "--enable-api", "--cors", "*", "--port", "5005"]
