FROM node:lts-alpine

RUN mkdir /express

WORKDIR /express

# Get the package.json first to install dependencies
COPY package.json /express

# This will install those dependencies
RUN npm install

# Copy the rest of the app to the working directory
COPY . /express

EXPOSE 3000

# Run the container
CMD ["npm", "start"]

# RUN npx express-generator

# RUN npm install


# CMD DEBUG=backend:* npm start