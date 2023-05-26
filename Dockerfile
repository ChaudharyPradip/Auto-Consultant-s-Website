# Use the official Node.js image as the base image
FROM node:14-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm install --production

# Copy the remaining application files to the working directory
COPY . .

# Expose the port that your Node.js server is listening on
EXPOSE 5000

# Start the Node.js server
CMD ["npm", "start"]
