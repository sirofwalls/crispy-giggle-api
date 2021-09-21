FROM node
WORKDIR /usr/nodeapp
COPY ./ ./
RUN npm install
CMD ["npm","start"]