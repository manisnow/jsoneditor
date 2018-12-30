
FROM node:8.11.2-alpine as node
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . . 
RUN npm run build

FROM nginx
COPY nginx.conf /etc/nginx/nginx.conf
COPY dist/jsoneditor /usr/share/nginx/html

