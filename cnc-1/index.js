var Jimp = require('jimp');
const fs = require('fs');
const yargs = require('yargs');


let depth = 0.1;
let space = 0.1;
let feed = 1000;
let clearance = 0.1; // mm
let top = 0;
let x_offset = 0;
let y_offset = 0;
const argv = yargs
//   .command('lyr', 'Tells whether an year is leap year or not', {
//     year: {
//       description: 'the year to check for',
//       alias: 'y',
//       type: 'number'
//     }
//   })
  .option('depth', {
    alias: 'd',
    description: 'Depth of the image',
    type: 'number',
  })
    .option('space', {
        alias: 's',
        description: 'Space between the dots',
        type: 'number',
    })
    .option('feed', {
        alias: 'f',
        description: 'Feed rate of the CNC',
        type: 'number',
    })
    .option('top', {
        alias: 't',
        description: 'Surface Z level of the CNC Part',
        type: 'number',
    })
    .option('x_offset', {
        alias: 'x',
        description: 'X offset of the CNC Part',
        type: 'number',
    })
    .option('y_offset', {
        alias: 'y',
        description: 'Y offset of the CNC Part',
        type: 'number',
    })
    .option('clear', {
        alias: 'c',
        description: 'Clearance Level for rapid moves',
        type: 'number',
    })
  .help()
  .alias('help', 'h').argv;

if(argv.depth) {
    depth = argv.depth;
}
if(argv.space) {
    space = argv.space;
}
if(argv.feed) {
    feed = argv.feed;
}

if(argv.top) {
    top = argv.top;
}

if(argv.clear) {
    clearance = argv.clear;
}

if(argv.x_offset) {
    x_offset = argv.x_offset;
}
if(argv.y_offset) {
    y_offset = argv.y_offset;
}


if(argv._.length === 0) {
    console.log('Please provide an image');
    process.exit(1);
}

const filename = argv._[0];
console.log("Image File : ",filename);

const output = fs.createWriteStream(filename.replace('.png','.gcode'));
Jimp.read(filename, (err, img) => {
  if (err) throw err;
    img.grayscale();    
    output.write(`G21 G90 G54\n`);
    output.write(`S2000 M03\n`);
    const width = img.bitmap.width;
    const height = img.bitmap.height;
    const data = img.bitmap.data;
    console.log('width:', width);
    console.log('height:', height);
    console.log('data size:', data.byteLength);
    
    for(let y=0; y<height; y++) {
        const i = y*width*4;        
        for(let x=0; x<width; x++) {            
            let val = data[i+x*4];
            if (val < 128) {
                gotoXY(x_offset+x*space,y_offset+y*space);
                plunge();
            }            
        }
    }
    output.write(`M05\n`);
    output.write(`G0 Z${top+15}\n`);

});

function plunge() {
    moveZ(-depth);
    moveZ(clearance);
}

function gotoXY(x,y) {
    output.write(`G0 X${x.toPrecision(3)} Y${y.toPrecision(3)}\n`);
}

function moveXY(x,y) {
    output.write(`G1 X${x} Y${y} F${feed}\n`);
}

function moveZ(z) {
    output.write(`G1 Z${z+top} F${feed}\n`);
}
