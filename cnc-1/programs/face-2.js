const gcode = require('../gcode.js');
const tools = require('../tools.js');

const SPINDLE_SPEED = 1000;
const FEED = 1000;
const Z_CLEARANCE = 20;
const Z_FACE    = 10;

const WIDTH_X   = 120;
const WIDTH_Y   = 80;
const tool_diameter = tools.FACE.diameter;

const start_x = -tool_diameter - 5;
const start_y = -tool_diameter/2;

const pass_count = Math.floor(WIDTH_Y/tool_diameter+0.5);
console.log(`pass_count: ${pass_count}`);
const surface_speed = tools.FACE.surfaceSpeed(SPINDLE_SPEED);
console.log(`surface_speed: ${surface_speed}`);

gcode.init_gcode(1001, 'COKLU YUZEY TARAMA');
gcode.tool(tools.FACE.index);
gcode.G0({Z: Z_CLEARANCE});
gcode.spindle_CW(SPINDLE_SPEED);
gcode.coolant_on();
gcode.G0({X: start_x, Y: start_y});
gcode.G0({Z: Z_FACE});
gcode.G1({X: 30}, FEED);
gcode.coolant_off();
gcode.spindle_stop();
gcode.G0({Z: Z_CLEARANCE});
gcode.end();



