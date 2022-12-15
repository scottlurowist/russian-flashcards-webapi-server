FROM node:16-alpine

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . .

EXPOSE 4745

CMD ["npm", "start"]