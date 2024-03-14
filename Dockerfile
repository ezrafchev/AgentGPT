# Use the official Node.js image as the base image
FROM node:16-alpine as build

ARG NODE_ENV

ENV NODE_ENV=$NODE_ENV

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .
RUN mv .env.docker .env  \
    && sed -i 's/postgresql/sqlite/g' prisma/schema.prisma \
    && sed -i 's/mysql/sqlite/g' prisma/schema.prisma \
    && sed -i 's/@db.Text//' prisma/schema.prisma

# Add Prisma and generate Prisma client
RUN apk add --no-cache --virtual .build-deps gcc libc-dev musl-dev && \
    npx prisma generate && \
    npx prisma migrate dev --name init && \
    npx prisma db push && \
    apk del .build-deps

# Build the Next.js app
RUN npm run build


# Use the official Node.js image as the base image for production
FROM node:16-alpine as production

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy the rest of the application code
COPY --from=build /app .

# Expose the port the app will run on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
