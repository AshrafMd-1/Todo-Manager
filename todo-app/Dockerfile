# First stage to install dependencies
FROM --platform=$BUILDPLATFORM node:lts as dependencies
RUN apt-get update && apt-get install -y \
    libgtk2.0-0 \
    libgtk-3-0 \
    libgbm-dev \
    libnotify-dev \
    libnss3 \
    libxss1 \
    libasound2 \
    libxtst6 \
    xauth \
    xvfb

# Second stage to set up the application
FROM dependencies as base
WORKDIR /app
COPY package.json /
EXPOSE 3000


FROM base as production
ENV NODE_ENV=production
RUN npm install
COPY . /app
CMD node index.js

FROM base as dev
FROM cypress/included:8.3.0
ENV NODE_ENV=development
RUN npm install -g nodemon && npm install
COPY . /app
COPY ./cypress ./cypress
COPY ./cypress.json ./cypress.json
COPY ./cypress.config.js ./cypress.config.js
CMD npm run clean:start:dev & npx cypress run --headless