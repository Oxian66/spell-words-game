FROM node:18.7.0
EXPOSE 3001

WORKDIR /app/server
COPY . .
COPY package*.json .
RUN yarn install
CMD ["yarn", "start", "start:prod"]