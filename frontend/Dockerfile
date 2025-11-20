# build stage
FROM node:20-alpine AS build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# production stage (nginx)
FROM nginx:stable-alpine
COPY --from=build /usr/src/app/dist /usr/share/nginx/html
# optional: copy custom nginx.conf if you need proxy rules (see nginx below)
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
