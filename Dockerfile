# Use Ubuntu as the base image
FROM ubuntu

# Install curl and Node.js
RUN apt-get update && \
    apt-get install -y curl && \
    curl -sL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs



# Copy package.json and package-lock.json (or yarn.lock if you're using Yarn) to the working directory
COPY package*.json ./


# Bundle your app's source code inside the Docker image
COPY . .

# Install any dependencies, including 'typescript' and any other global dependencies if needed
RUN npm install

# Compile TypeScript to JavaScript
RUN npm run build

# Your application will bind to port 8000, make sure this matches your application's listening port
EXPOSE 8000

# Define the command to run your app using CMD which defines your runtime
CMD ["node", "dist/index.js"]
