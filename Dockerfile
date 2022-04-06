FROM node:12.16

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

#Copy info used by npm install
COPY .npmrc .npmrc

# Bundle app source
COPY . /usr/src/app

#Install dependencies
RUN npm ci

#Remove info so it is not in container
RUN rm -f .npmrc

# Service port
EXPOSE 80

CMD [ "node", "app.js" ]
