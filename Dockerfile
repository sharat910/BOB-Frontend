FROM node:9.11.1-alpine

# make the 'app' folder the current working directory
COPY package.json /app/
WORKDIR /app/
RUN npm install
ENV PATH /app/node_modules/.bin:$PATH

COPY . /app/code/
WORKDIR /app/code/
