rm -rf -- www
cp -r ../webapp www
cp -r ../lib www/lib
cp ../rolast.js www/rolast.js
node fixindex.js