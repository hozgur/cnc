

class gcode {

    constructor() {
        this.feed_rate = 1000;
        this.ramp_rate = 300;
        this.spindle_speed = 1000;
        this.wcs = 'G54';
    }
    set_feed_rate(rate) {
        this.feed_rate = rate;
    }
    set_ramp_rate(rate) {
        this.ramp_rate = rate;
    }
    set_spindle_speed(speed) {
        this.spindle_speed = speed;
    }
    set_wcs(wcs) {
        this.wcs = wcs;
    }
    
    set_stock_point(x,y,z,dx,dy,dz = -1) {
        this.stock_top = z;        
        this.stock_left = x;        
        this.stock_behind = y;        
    }

};

export default gcode;