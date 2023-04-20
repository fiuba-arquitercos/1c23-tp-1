FROM node:14

WORKDIR /usr/src/app
COPY . .

RUN npm install

ENTRYPOINT ["node"]
CMD ["app.js"]