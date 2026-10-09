# Déploiement Cloud proposé

## Architecture cible

```text
Internet → DNS → Load Balancer HTTPS → Nginx (2+ réplicas) → Rasa (2+ réplicas)
                                                    │
                                            Logs / Monitoring
```

Les images sont construites par CI/CD et déposées dans un registre privé (Amazon ECR, Azure Container Registry ou Google Artifact Registry). Elles sont ensuite déployées dans un orchestrateur : Amazon ECS/EKS, Azure Container Apps/AKS ou Google Cloud Run/GKE.

## Réseau et sécurité

- Le load balancer est le seul composant exposé à Internet, en HTTPS.
- Les conteneurs Rasa restent sur un sous-réseau privé et ne reçoivent que le trafic de Nginx.
- Les secrets sont stockés dans AWS Secrets Manager, Azure Key Vault ou Google Secret Manager, jamais dans Git.
- Les logs, métriques et alertes sont centralisés dans le service de monitoring du fournisseur.

## Scalabilité

Rasa est sans état pour cette démonstration. Le nombre de réplicas peut donc augmenter selon le CPU, la mémoire ou le nombre de requêtes. Pour conserver l'historique des conversations à grande échelle, on ajoute un tracker store partagé (PostgreSQL ou Redis) et un verrou Redis. L'équilibreur répartit alors les requêtes entre les instances disponibles.

## Exemple de parcours AWS

1. Créer un dépôt Amazon ECR et y pousser les images `assistant-it-rasa` et `assistant-it-web`.
2. Créer un cluster ECS Fargate, une tâche avec les deux conteneurs et un service de deux tâches.
3. Créer un Application Load Balancer HTTPS devant le service Web.
4. Configurer l'auto-scaling sur l'utilisation CPU et CloudWatch pour les journaux.
