FROM --platform=$BUILDPLATFORM node:lts-alpine as base
RUN apt-get update && \
    apt-get install -y xvfb libgtk-3-0 libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
ENV DISPLAY=:99
WORKDIR /app
COPY package.json /
EXPOSE 3000
CMD ["Xvfb", "-ac", ":99", "-screen", "0", "1280x1024x16", "&", "npm", "start"]

FROM base as production
ENV NODE_ENV=production
RUN npm install
COPY . /app
CMD node index.js

FROM base as dev
ENV NODE_ENV=development
RUN npm install -g nodemon && npm install
COPY . /app
CMD npm run clean:start:dev