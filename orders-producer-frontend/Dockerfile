# orders-producer-frontend/Dockerfile
FROM node:22-alpine

WORKDIR /app

# Build args
ARG VITE_ADMIN_API_URL=http://localhost:4001/api
ARG VITE_API_GATEWAY_URL=http://localhost:3000
ARG VITE_WS_URL=ws://localhost:4000
ENV VITE_ADMIN_API_URL=$VITE_ADMIN_API_URL
ENV VITE_API_GATEWAY_URL=$VITE_API_GATEWAY_URL
ENV VITE_WS_URL=$VITE_WS_URL

COPY package*.json ./

RUN npm install

# Copiamos todo (src, public, etc.)
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
