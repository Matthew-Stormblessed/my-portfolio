#Install dependencies
FROM node:22-alpine as install
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

#Build the application
FROM node:22-alpine as build
WORKDIR /app
COPY --from=install /app/node_modules ./node_modules
COPY . .
RUN npm run build

#Run the application
FROM node:22-alpine as run
WORKDIR /app
COPY --from=build /app/public ./public
COPY --from=build /app/.next ./.next
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY /app/prompts ./app/prompts

EXPOSE 3000

CMD ["npm", "start"]
