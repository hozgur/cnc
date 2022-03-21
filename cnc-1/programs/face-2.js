const gcode = require('../gcode.js');
const tools = require('../tools.js');

const SPINDLE_SPEED = 1000;
const FEED = 1000;
const Z_CLEARANCE = 20;
const Z_FACE = 10;
console.log(tools.FACE.surfaceSpeed(SPINDLE_SPEED));
gcode.init_gcode(1001, 'COKLU YUZEY TARAMA');
gcode.tool(tools.FACE.index);
gcode.G0({Z: Z_CLEARANCE});
gcode.spindle_CW(SPINDLE_SPEED);
gcode.coolant_on();
gcode.G0({X: -30, Y: -25});
gcode.G0({Z: Z_FACE});
gcode.G1({X: 30}, FEED);
gcode.coolant_off();
gcode.spindle_stop();
gcode.G0({Z: Z_CLEARANCE});
gcode.end();



