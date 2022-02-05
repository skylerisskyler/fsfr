ARG BUILD_FROM
FROM $BUILD_FROM

WORKDIR /app

ENV LANG C.UTF-8
SHELL ["/bin/bash", "-o", "pipefail", "-c"]

RUN apk add --no-cache \
    nodejs-current \
    npm

COPY . .
RUN npm install --unsafe-perm && npm i -g ts-node


# SHELL ['ls']
RUN chmod a+x ./run.sh

CMD [ "./run.sh" ]