# Use Node.js as the base image
FROM node:16

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app
RUN npm run build

# Use nginx to serve the built app
FROM nginx:alpine
COPY --from=0 /app/build /usr/share/nginx/html

# Expose the frontend port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
