#!/bin/sh
grunt
aws s3 sync ./dist/js s3://chikyu-cors/js --acl public-read --profile=chikyu 
