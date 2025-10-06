# Use Node LTS
FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build Next.js app
RUN npm run build

# Expose Next.js default port
EXPOSE 3000

# Run in production mode
CMD ["npm", "start"]
