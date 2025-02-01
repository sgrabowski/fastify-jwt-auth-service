# Use an official Node.js runtime (alpine variant for a smaller image)
FROM node:16-alpine

# Create a non-root user and group to run the application
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Set the working directory
WORKDIR /app

# Copy package files first to leverage Docker cache
COPY package*.json ./

# Set npm to allow installing as root (this helps in some cases) and install all dependencies including devDependencies
RUN npm config set unsafe-perm true && npm install

# Copy the rest of the application code
COPY . .

# Change the ownership of the app directory to the non-root user
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose the port the app runs on
EXPOSE 3000

# Start the app using the dev script
CMD ["npm", "run", "dev"]
