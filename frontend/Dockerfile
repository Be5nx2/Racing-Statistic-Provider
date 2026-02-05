# Dev: Vite dev server (proxy API vers le backend)
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ENV VITE_API_TARGET=http://server:3000
EXPOSE 5173

CMD ["npm", "run", "dev"]
