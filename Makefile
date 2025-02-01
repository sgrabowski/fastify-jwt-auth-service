# Executables
DOCKER_COMP = docker compose
AUTH_CONT   = $(DOCKER_COMP) exec auth

# Misc
.DEFAULT_GOAL := help
.PHONY: help up down sh build migrate migrate-deploy tests lint lint-fix format qa

## —— 🎵 🐳 Makefile 🐳 🎵 ————————————————————————————————————
help: ## Outputs this help screen
	@grep -E '(^[a-zA-Z0-9\./_-]+:.*?##.*$$)|(^##)' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}{printf "\033[32m%-30s\033[0m %s\n", $$1, $$2}' | sed -e 's/\[32m##/[33m/'

## —— Docker 🐳 ————————————————————————————————————————————————————————————————
up: ## Start the docker containers in detached mode
	@$(DOCKER_COMP) up -d

down: ## Stop and remove the containers
	@$(DOCKER_COMP) down

sh: ## Open a shell inside the auth container
	@$(AUTH_CONT) sh

build: ## Rebuild containers without cache
	@$(DOCKER_COMP) build --no-cache

## —— Database 🛢️ ———————————————————————————————————————————————————————————
migrate: ## Run database migrations (use `name=YOUR_MIGRATION_NAME` to specify a name)
	@if [ -z "$(name)" ]; then \
	  echo "Running migrations without a new migration name..."; \
	  $(DOCKER_COMP) run auth npx prisma migrate dev; \
	else \
	  echo "Running migration with name: $(name)"; \
	  $(DOCKER_COMP) run auth npx prisma migrate dev --name $(name); \
	fi

migrate-deploy: ## Apply all pending database migrations
	@echo "Applying pending migrations..."
	@$(DOCKER_COMP) run auth npx prisma migrate deploy

## —— Testing & Quality Assurance ✅ —————————————————————————————————————————————————
tests: ## Run Jest tests
	@echo "Running Jest tests..."
	@$(DOCKER_COMP) run auth npm test

lint: ## Run ESLint to check for linting issues
	@echo "Running ESLint..."
	@npm run lint

lint-fix: ## Automatically fix linting issues
	@echo "Fixing ESLint issues..."
	@npm run lint:fix

format: ## Format code using Prettier
	@echo "Running Prettier..."
	@npm run format

qa: ## Run full code quality and testing suite
	@echo "Running QA checks (migrations, linting, formatting, tests)..."
	@$(MAKE) migrate-deploy
	@$(MAKE) lint-fix
	@$(MAKE) format
	@$(MAKE) tests
