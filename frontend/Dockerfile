FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Mở port 5173 của Vite
EXPOSE 5173

# Lệnh chạy Vite dev server, cần --host để expose ra ngoài container
CMD ["npm", "run", "dev", "--", "--host"]