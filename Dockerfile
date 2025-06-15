# Stage 1: Build React App
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve React App with 'serve'
FROM node:18-alpine

RUN npm install -g serve

WORKDIR /app
COPY --from=build /app/build .

EXPOSE 10000

CMD ["serve", "-s", ".", "-l", "10000"]