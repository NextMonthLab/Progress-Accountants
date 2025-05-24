FROM node:18
WORKDIR /app
COPY . .
RUN npm install && npm run build
EXPOSE 5001
CMD ["npm", "run", "start"]