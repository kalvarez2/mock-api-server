const express = require( 'express' );
const path = require( 'path' );
const fs = require( 'fs' );
const app = express();

//arguments and defaults:
const yargs = require( 'yargs' )
    .options( {
        'port': {
            alias: 'p',
            describe: 'port to listen on',
            default: 8090,
            type: 'number'
        },
        'folder': {
            alias: 'f',
            describe: 'Absolute path to the static files to serve',
            type: 'string'
        },
        'delayMin': {
            alias: 'a',
            describe: 'Minimum time to delay each request, defaults to no wait',
            type: 'number',
            default: 0,
            demandOption: false
        },
        'delayMax': {
            alias: 'b',
            describe: 'Maximum time to delay each request, defaults to no wait',
            type: 'number',
            default: 0,
            demandOption: false
        }
    } )
    .version( false )
    .help()
    .alias( 'help', 'h' )
    .argv;

let staticFilesFolder = path.join( __dirname, 'public' );
if ( !yargs.folder ) {
    console.log( 'No folder provided in arguments, will serve files from local ./public folder' );
}else{
    staticFilesFolder = path.join( yargs.folder);
}


console.log( `Serving static files from folder ${staticFilesFolder}` );

app.get( '/ping',
    ( req, res ) => res.send( 'pong' ) );

//if delay requested, set up a random delay per request
if ( yargs.delayMin > 0 ) {
    if ( !yargs.delayMax || yargs.delayMax < yargs.delayMin ) {
        yargs.delayMax = yargs.delayMin + 100;
    }
    console.log( `Random delays between ${yargs.delayMin} and ${yargs.delayMax}` );
  
    app.use( ( req, res, next ) => {
        setTimeout( next,
            Math.floor( yargs.delayMin + Math.random( ( yargs.delayMax - yargs.delayMin ) ) )
        );
    } );

}
app.use( '/', express.static( staticFilesFolder ) );

//random
//possible responses are all the files contents:
const possibleResponses = [];
fs.readdir(staticFilesFolder, function(err, files){
    files.forEach( function ( file ) {
        const filePath = path.join( staticFilesFolder, file);
        const fileContent = fs.readFileSync( filePath, 'utf8' );
        possibleResponses.push(fileContent);
    } );
});
app.use( '/random', function ( req, res ) {
    const fileIndex = Math.floor(Math.random() * possibleResponses.length);
    console.log( `Sending a random response at ${fileIndex} out of ${possibleResponses.length} possibles` );
    const randomResponse =  possibleResponses[fileIndex];
    res.send( randomResponse );
});

const server = app.listen( yargs.port, () => console.log( `Mock Server listening at http://localhost:${yargs.port}` ) );


//Shutdown nicely
process.on( 'SIGTERM', shutDown );
process.on( 'SIGINT', shutDown );

function shutDown() {
    console.log( 'Received kill signal, shutting down gracefully' );
    server.close( () => {
        console.log( 'Closed out remaining connections' );
        process.exit( 0 );
    } );

    setTimeout( () => {
        console.error( 'Could not close connections in time, forcefully shutting down' );
        process.exit( 1 );
    }, 10000 );
}