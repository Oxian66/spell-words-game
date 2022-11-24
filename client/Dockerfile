FROM node:18.7.0
EXPOSE 3000

WORKDIR /app/client
COPY . .
COPY package*.json .
RUN yarn install
CMD ["yarn", "run", "start"]