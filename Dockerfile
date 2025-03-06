# Dockerfile for the backend service
FROM node:22

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the rest of the app
COPY . .

#Expose the port the app runs on
EXPOSE 8000

# Generate Prisma Client
RUN npx prisma generate

# Start the app
CMD ["npm","start"]