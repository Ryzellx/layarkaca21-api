FROM node:20-alpine

WORKDIR /app

# Install native dependencies for Playwright if needed in future
# RUN apk add --no-cache chromium

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install
RUN npx prisma generate

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
