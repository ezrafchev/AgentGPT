#!/bin/bash

# Change to the script directory
cd "$(dirname "$0")" || exit

# Prompt the user for their OpenAI API key
echo -n "Enter your OpenAI Key (e.g. sk...): "
read -r OPENAI_API_KEY

# Generate a secure NEXTAUTH_SECRET
NEXTAUTH_SECRET=$(openssl rand -base64 32)

# Define the environment variables
ENV_VARS="NODE_ENV=development\nNEXTAUTH_SECRET=$NEXTAUTH_SECRET\nNEXTAUTH_URL=http://localhost:3000\nOPENAI_API_KEY=$OPENAI_API_KEY\nDATABASE_URL=file:../db/db.sqlite"

# Write the environment variables to the .env file
echo -e "$ENV_VARS" > .env

# Check if the --docker flag is provided
if [ "$1" = "--docker" ]; then
  # Write the environment variables to the .env.docker file
  echo -e "$ENV_VARS" > .env.docker

  # Source the .env.docker file
  source .env.docker

  # Build the Docker image
  docker build --build-arg NODE_ENV=$NODE_ENV -t agentgpt .

  # Run the Docker container
  docker run -d --name agentgpt -p 3000:3000 -v "$(pwd)/db:/app/db" agentgpt
else
  # Execute the Prisma setup script
  ./prisma/useSqlite.sh

  # Install the project dependencies
  npm install

  # Start the development server
  npm run dev
fi
