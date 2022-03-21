tools = {
    //
    FACE : {
        index : 3,
        diameter : 50,
        radius : 25,
        flutes : 5,
        surfaceSpeed : function(speed) {
            return tools.surfaceSpeed(this,speed);
        }
    },
    //
    CHAMFER : {
        index : 6,
        diameter : 8,
        radius : 4,
        flutes : 2,
    },
    //
    ENDMILL_16MM : {
        index : 8,
        diameter : 16,
        radius : 8,
        flutes : 3,
    },
    //
    ENDMILL_6MM : {
        index : 9,
        diameter : 6,
        radius : 3,
        flutes : 3,
    },
    
    surfaceSpeed : function(tool,spindle_speed) {
        return 2 * tool.diameter * Math.PI * spindle_speed / 1000;
    }
}

module.exports = tools;