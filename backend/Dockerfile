# Use Node LTS
FROM node:18

# Create app directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the files
COPY . .

# Expose backend port
EXPOSE 4000

# Start the backend
CMD ["npm", "start"]
