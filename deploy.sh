#!/bin/bash

echo "Deploying Peloton Data Viz"
yarn build &&
scp -r build/* redunda@redundantrobot.com:/home/redunda/domains/redundantrobot.com/public_html/peloton
