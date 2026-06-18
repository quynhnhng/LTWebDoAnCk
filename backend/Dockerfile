# Sử dụng image Node.js
FROM node:20-alpine

# Cài đặt thư mục làm việc trong container
WORKDIR /app

# Copy package.json và cài đặt thư viện
COPY package*.json ./
RUN npm install

# Copy toàn bộ source code backend vào container
COPY . .

# Mở port 5000 theo cấu hình của bạn
EXPOSE 5000

# Lệnh chạy server
CMD ["npm", "start"] 
# Lưu ý: Đảm bảo trong backend/package.json có script "start": "node server.js"