#!/bin/bash
pm2 stop bit
pm2 delete bit

pm2 stop bit_front
pm2 delete bit_front

sudo killall -9 node

cd /var/www/html/ever_node 

sudo yarn
pm2 start "sudo yarn start-prod" --name bit


cd /var/www/html/chums_front 

sudo yarn
sudo yarn build
pm2 start "sudo yarn start" --name bit_front