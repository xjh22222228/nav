FROM node:20.17.0 AS alpine

WORKDIR /app

COPY package.json yarn.lock /app/

RUN yarn && npm install -g pm2

COPY . /app/

RUN npm run build

EXPOSE 7777

CMD ["pm2-runtime", "src/environments/main.mjs"]