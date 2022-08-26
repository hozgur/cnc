const gcode = require('../gcode.js');
const tools = require('../tools.js');

const SPINDLE_SPEED = 4000;
const FEED = 1000;
const STEP_DOWN = 1.6; // Z yönündeki step miktarı
const Z_OFFSET = 10;
const Z_CLEARANCE_HEIGHT = 30;  
const Z_FACE    = 31.70    -   Z_OFFSET;
const Z_TARGET  = 23.50    -   Z_OFFSET;
const WIDTH_X   = 141;
const WIDTH_Y   = 45.0;
const stock_x   = 0;
const stock_y   = 0;

const INOUT_DISTANCE = 1;
const Z_CLEARANCE = Z_FACE + Z_CLEARANCE_HEIGHT;
const tool_diameter = tools.FACE.diameter;
const delta_y = tool_diameter - INOUT_DISTANCE;

const start_x = stock_x - tool_diameter - INOUT_DISTANCE;
const start_y = stock_y -tool_diameter/2 + INOUT_DISTANCE;

const end_x = stock_x + WIDTH_X + tool_diameter/2 + INOUT_DISTANCE;

const pass_count = Math.floor((WIDTH_Y+2* INOUT_DISTANCE)/(delta_y)+0.99);
console.log(`pass_count: ${pass_count}`);
const surface_speed = tools.FACE.surfaceSpeed(SPINDLE_SPEED);
console.log(`surface_speed: ${surface_speed}`);


// Sıfırlamalar
gcode.init_gcode(1001, 'YUZEY TARAMA');
gcode.text(`pass_count: ${pass_count}`);
gcode.text(`surface_speed: ${surface_speed}`);
gcode.text(`tool_diameter: ${tool_diameter}`);
gcode.text(`Z_CLEARANCE: ${Z_CLEARANCE}`);

// Tool seçme
gcode.tool(tools.FACE.index,Z_CLEARANCE);

// Spindle açma
gcode.spindle_CW(SPINDLE_SPEED);
// Soğutma açma
gcode.coolant_on();
let z = Z_FACE;
if((Z_FACE - Z_TARGET) <= STEP_DOWN) {
    z = Z_TARGET;
    trace_xy(z);
}
else {
    while(z > Z_TARGET) {
        z -= STEP_DOWN;
        trace_xy(z);
    }
    if(z < Z_TARGET){
        z = Z_TARGET;
        gcode.text(`Z Pass: ${z}`);
        trace_xy(z);
    }
}

gcode.coolant_off();
gcode.relative_mode();
gcode.G0({Z: 100,X: 0,Y: 100});
gcode.absolute_mode();
gcode.end();


function trace_xy(z) {
    for(let y=0; y<pass_count; y++) {
        if(pass_count > 1)
            gcode.text(`XY Pass: ${y+1}`);
        const y_pos = start_y - y*delta_y;
        gcode.G0({X: start_x, Y: y_pos});
        gcode.G1({Z: z});
        gcode.G1({X: end_x},FEED);
        gcode.G0({Z: Z_CLEARANCE});
    }   
}