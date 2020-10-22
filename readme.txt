Will serve each files given the file name on the  target folder, and a random content at random. If /data/tmp/ contains file1.txt and file2.txt
http://localhost:8090/random will return either the contents of file1.txt or file2.txt

Examples:
1-Listen on port 9999, serve files located at /data/tmp, use random delays between 10 and 20 seconds
node mockServer.js -p 9999 -f /data/tmp/ -a 10000 -b 20000

2-Listen on port 9999, serve files located at /data/tmp, use no delays
node mockServer.js -p 9999 -f /data/tmp/

3-Listen on port 9999, serve files located in the public folder, use no delays
node mockServer.js -p 9999

3-Listen on default port 8090, serve files located in the public folder, use no delays
node mockServer.js 