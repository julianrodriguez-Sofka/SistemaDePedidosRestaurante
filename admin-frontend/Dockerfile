# Dockerfile for admin-frontend
FROM node:18-alpine
WORKDIR /app

# Build args
ARG VITE_ADMIN_API_URL=http://localhost:4001/api
ENV VITE_ADMIN_API_URL=$VITE_ADMIN_API_URL

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5174
CMD ["npm", "run", "preview"]
