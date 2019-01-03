
FROM node:9.5.0 as node
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . . 
RUN $(npm bin)/ng build --prod --output-path=dist

FROM nginx
COPY nginx.conf /etc/nginx/nginx.conf
COPY dist/jsoneditor /usr/share/nginx/html

