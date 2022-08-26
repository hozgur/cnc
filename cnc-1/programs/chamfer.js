const gcode = require('../gcode.js');
const tools = require('../tools.js');

const CHAMFER_WIDTH = 2;

const CHAMFER_OFFSET = 0.5;
const SPINDLE_SPEED = 8000;
const FEED = 1000;
const Z_FACE    = 5.6;

const stock_x = 0;
const stock_y = 0;

const Z_CLEARANCE = Z_FACE + 30;
const TOOL = tools.CHAMFER;
const WIDTH_X   = 135.6;
const WIDTH_Y   = 69;
const tool_diameter = TOOL.diameter;




const surface_speed = tools.FACE.surfaceSpeed(SPINDLE_SPEED);
console.log(`surface_speed: ${surface_speed}`);

// Sıfırlamalar
gcode.init_gcode(1004, 'DIKDORTGEN CHAMFER');
gcode.text(`surface_speed: ${surface_speed}`);
gcode.text('Chamfer Width: ' + CHAMFER_WIDTH);
gcode.text('Chamfer Offset: ' + CHAMFER_OFFSET);
gcode.text(`Z_CLEARANCE: ${Z_CLEARANCE}`);

// Tool seçme
gcode.tool(TOOL.index,Z_CLEARANCE);
gcode.write('G41 P' + CHAMFER_WIDTH * 2 + CHAMFER_OFFSET);
// Spindle açma
gcode.spindle_CW(SPINDLE_SPEED);
// Soğutma açma
gcode.coolant_on();

let start_x = stock_x - tool_diameter - 5;
let start_y = stock_y;
const start_z = Z_FACE  - CHAMFER_WIDTH - CHAMFER_OFFSET;
let end_x = stock_x + WIDTH_X ;

gcode.G0({X: start_x, Y: start_y});
gcode.G0({Z: start_z});
gcode.G1({X: end_x, F: FEED});

let end_y = stock_y - WIDTH_Y;
gcode.G1({Y: end_y, F: FEED});

end_x = stock_x;
gcode.G1({X: end_x, F: FEED});

end_y = stock_y;
gcode.G1({Y: end_y, F: FEED});

gcode.coolant_off();
gcode.relative_mode();
gcode.G0({Z: 100});
gcode.absolute_mode();
gcode.end();
