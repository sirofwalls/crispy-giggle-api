FROM node AS build
WORKDIR /usr/nodeapp
COPY ./ ./
RUN npm install
CMD ["npm","start"]