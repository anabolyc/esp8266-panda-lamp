FROM armhf/node:6.9.1-slim

# required packages
RUN apt-get update 
RUN apt-get install cron wget -y

# data script
#COPY ./data/request_data /usr/sbin/request_data
#COPY ./data/clean_data /usr/sbin/clean_data
COPY ./start.sh /usr/sbin/start.sh

# www
RUN mkdir -p /www/static
COPY ./www/package.json /www/
WORKDIR /www
RUN npm install

# cleanup
RUN apt-get autoremove -y
RUN rm -rf /var/lib/apt/lists/*

ENV ESP_HOST http://localhost:8080

# site data 
# at later step to optimize build
COPY ./www/server.js /www/
COPY ./www/static /www/static

EXPOSE 5000
CMD start.sh
