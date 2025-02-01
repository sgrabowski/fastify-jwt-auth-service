.PHONY: help up down sh build migrate

# Default target when no arguments are provided: display help.
.DEFAULT_GOAL := help

help:
	@echo "Usage: make [target]"
	@echo ""
	@echo "Available targets:"
	@echo "  help   - Show this help message"
	@echo "  up     - Start the containers"
	@echo "  down   - Stop the containers"
	@echo "  sh     - Open a shell inside the auth container"
	@echo "  build  - Rebuild the containers without cache"
	@echo "  migrate - Run Prisma migrations. Supply a name with 'name=YOUR_MIGRATION_NAME' if needed."
	@echo "            Example: make migrate name=init"
	@echo "  migrate-deploy  - Apply only pending migrations (like doctrine:migrations:migrate)"
	@echo "                    Example: make migrate-deploy"

up:
	docker compose up -d && docker compose exec auth npm install

down:
	docker compose down

sh:
	docker compose exec auth sh

build:
	docker compose build --no-cache

migrate:
	@if [ -z "$(name)" ]; then \
	  echo "Running migrations without a new migration name..."; \
	  docker compose run auth npx prisma migrate dev; \
	else \
	  echo "Running migration with name: $(name)"; \
	  docker compose run auth npx prisma migrate dev --name $(name); \
	fi

migrate-deploy:
	@echo "Applying pending migrations..."
	docker compose run auth npx prisma migrate deploy