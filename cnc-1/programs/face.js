const gcode = require('../gcode.js');
const tools = require('../tools.js');

const SPINDLE_SPEED = 4000;
const FEED = 1000;
const Z_CLEARANCE = 90;
const Z_FACE    = 76.60;

const WIDTH_X   = 69;
const WIDTH_Y   = 9.7;
const tool_diameter = tools.FACE.diameter;

const stock_x = 50;
const stock_y = 10;
const delta_y = (tool_diameter-5)>0?(tool_diameter-5):tool_diameter;

const start_x = stock_x - tool_diameter - 5;
const start_y = stock_y -tool_diameter/2;

const end_x = stock_x + WIDTH_X + tool_diameter/2 + 5;

const pass_count = Math.floor(WIDTH_Y/(delta_y)+0.99);
console.log(`pass_count: ${pass_count}`);
const surface_speed = tools.FACE.surfaceSpeed(SPINDLE_SPEED);
console.log(`surface_speed: ${surface_speed}`);


// Sıfırlamalar
gcode.init_gcode(1003, 'YUZEY TARAMA');
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

for(let y=0; y<pass_count; y++) {
    gcode.text(`Pass: ${y+1}`);
    const y_pos = start_y - y*delta_y;
    gcode.G0({X: start_x, Y: y_pos});
    gcode.G0({Z: Z_FACE});
    gcode.G1({X: end_x, F: FEED});
    gcode.G0({Z: Z_CLEARANCE});
}
gcode.coolant_off();
gcode.relative_mode();
gcode.G0({Z: 100});
gcode.absolute_mode();
gcode.end();
