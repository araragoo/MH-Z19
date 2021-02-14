// https://github.com/araragoo/CO2

//% weight=5 color=#0fbc11 icon="\uf112" block="Measurement"
namespace CO2 {

    let CO2data = 400
    let buffer: Buffer = null
    let buf  = control.createBuffer(9)
    let buf0 = control.createBuffer(9)

    //% subcategory="CO2"
    //% blockId=initalCO2
    //% block="Init CO2"
    export function CO2Init () {
        serial.redirect(
            SerialPin.P13,
            SerialPin.P14,
            BaudRate.BaudRate9600
        )
        buf.setNumber(NumberFormat.UInt8LE, 0, 255)
        buf.setNumber(NumberFormat.UInt8LE, 1, 1)
        buf.setNumber(NumberFormat.UInt8LE, 2, 134)
        buf.setNumber(NumberFormat.UInt8LE, 3, 0)
        buf.setNumber(NumberFormat.UInt8LE, 4, 0)
        buf.setNumber(NumberFormat.UInt8LE, 5, 0)
        buf.setNumber(NumberFormat.UInt8LE, 6, 0)
        buf.setNumber(NumberFormat.UInt8LE, 7, 0)
        buf.setNumber(NumberFormat.UInt8LE, 8, 121)

        buf0.setNumber(NumberFormat.UInt8LE, 0, 255)
        buf0.setNumber(NumberFormat.UInt8LE, 1, 1)
        buf0.setNumber(NumberFormat.UInt8LE, 2, 135)
        buf0.setNumber(NumberFormat.UInt8LE, 3, 0)
        buf0.setNumber(NumberFormat.UInt8LE, 4, 0)
        buf0.setNumber(NumberFormat.UInt8LE, 5, 0)
        buf0.setNumber(NumberFormat.UInt8LE, 6, 0)
        buf0.setNumber(NumberFormat.UInt8LE, 7, 0)
        buf0.setNumber(NumberFormat.UInt8LE, 8, 120)
    }

    //% subcategory="CO2"
    //% blockId=measureCO2
    //% block="CO2[ppm]"
    export function CO2Value(): number {

        serial.writeBuffer(buf)
        basic.pause(100)

        buffer = serial.readBuffer(9)
        if (buffer.getNumber(NumberFormat.UInt8LE, 0) == 255 && buffer.getNumber(NumberFormat.UInt8LE, 1) == 134) {
//            let sum = 0
//            for (let index = 0; index <= 7; index++) {
//                sum = sum + buffer.getNumber(NumberFormat.UInt8LE, index)
//            }
//            sum = sum % 256
//            sum = 255 - sum
//            if (sum == buffer.getNumber(NumberFormat.UInt8LE, 8)) {
                CO2data = buffer.getNumber(NumberFormat.UInt8LE, 2) * 256 + buffer.getNumber(NumberFormat.UInt8LE, 3)
//            }
        }
        return CO2data
    }

    //% subcategory="CO2"
    //% blockId=setOffset
    //% block="Set CO2 value as 400ppm"
    export function CO2SetOffset () {

        basic.showString("Wait 20min for setting 400ppm! ")
        for (let m = 0; m < 20; m++) {
            for (let index = 0; index < 12; index++) {
                basic.showString("" + convertToText(21 - m) + "m")
            }
        }
        for (let s = 0; s < 12; s++) {
            basic.showString("" + convertToText(60 - s*5) + "s")
        }

        serial.writeBuffer(buf0)
        basic.pause(100)
        basic.showString("Done!")
    }







    const MAX30100_INT_STATUS   = 0x00  // Which interrupts are tripped
    const MAX30100_INT_ENABLE   = 0x01  // Which interrupts are active
    const MAX30100_FIFO_WR_PTR  = 0x02  // Where data is being written
    const MAX30100_OVRFLOW_CTR  = 0x03  // Number of lost samples
    const MAX30100_FIFO_RD_PTR  = 0x04  // Where to read from
    const MAX30100_FIFO_DATA    = 0x05  // Ouput data buffer
    const MAX30100_MODE_CONFIG  = 0x06  // Control register
    const MAX30100_SPO2_CONFIG  = 0x07  // Oximetry settings
    const MAX30100_LED_CONFIG   = 0x09  // Pulse width and power of LEDs
    const MAX30100_TEMP_INTG    = 0x16  // Temperature value, whole number
    const MAX30100_TEMP_FRAC    = 0x17  // Temperature value, fraction
    const MAX30100_REV_ID       = 0xFE  // Part revision
    const MAX30100_PART_ID      = 0xFF  // Part ID, normally 0x11

    const MAX30100_I2C_ADDRESS  = 0xAE; //0x57 I2C address of the MAX30100 device

    const PULSE_WIDTH = {
        200: 0,
        400: 1,
        800: 2,
       1600: 3,
    }
    
    const SAMPLE_RATE = {
        50: 0,
       100: 1,
       167: 2,
       200: 3,
       400: 4,
       600: 5,
       800: 6,
      1000: 7,
    }
    
    let LED_CURRENT = [
        0,
      4.4,
      7.6,
     11.0,
     14.2,
     17.4,
     20.8,
     24.0,
     27.1,
     30.6,
     33.8,
     37.0,
     40.2,
     43.6,
     46.8,
     50.0
    ]
    const LED_CURRENT_NUM = 16;

    let INTERRUPT_SPO2 = 0;
    let INTERRUPT_HR = 1;
    let INTERRUPT_TEMP = 2;
    let INTERRUPT_FIFO = 3;
    
    let MODE_HR = 0x02;
    let MODE_SPO2 = 0x03;
  
    function i2cwrite(addr: number, reg: number, value: number) {
        let buf = pins.createBuffer(2);
        buf[0] = reg;
        buf[1] = value;
        pins.i2cWriteBuffer(addr, buf);
    }

    function i2cread(addr: number, reg: number) {
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE);
        let val = pins.i2cReadNumber(addr, NumberFormat.UInt8BE);
        return val;
    }

    function twos_complement(val: number, bits: number) {
        if ((val & (1 << (bits - 1))) != 0) {
            val = val - (1 << bits)
        }
        return val
    }

    function MAX30100_init() {
    
        let mode = MODE_HR;
        let sample_rate = 100;
        let led_current_red = 11.0;
        let led_current_ir = 11.0;
        let pulse_width = 1600;
        let max_buffer_len = 10000;

        self.i2c = i2c if i2c else smbus.SMBus(1)

        self.set_mode(MODE_HR)  # Trigger an initial temperature read.
        self.set_led_current(led_current_red, led_current_ir)
        self.set_spo_config(sample_rate, pulse_width)

        # Reflectance data (latest update)
        self.led_current_ir = led_current_ir
        self.led_current_red = led_current_red
        self.i2cValue = i2c
        self.sample_rate = sample_rate
        self.pulse_width = pulse_width
        self.max_buffer_len = max_buffer_len
                
        self.buffer_red = []
        self.buffer_ir = []

        self.max_buffer_len = max_buffer_len
        self._interrupt = None
    }

    def reinit(self):
    self.i2c = self.i2cValue if self.i2cValue else smbus.SMBus(1)

    self.set_mode(MODE_HR)  # Trigger an initial temperature read.
    self.set_led_current(self.led_current_red, self.led_current_ir)
    self.set_spo_config(self.sample_rate, self.pulse_width)

    # Reflectance data (latest update)
    self.buffer_red = []
    self.buffer_ir = []

    self.max_buffer_len = 10000
    self._interrupt = None


    function red()  {
        return buffer_red[0];
    }

    function ir()  {
        return buffer_ir[0];
    }

    function get_valid(current: number) {
        for (let index = 0; index < LED_CURRENT_NUM; index++) {
            if(current <= LED_CURRENT[index]) {
                return index;
            }
        }
        return LED_CURRENT_NUM - 1;
    }       

    function set_led_current() {
        let led_current_red = 11.0;
        let led_current_ir = 11.0;
        led_current_red = get_valid(led_current_red)
        led_current_ir = get_valid(led_current_ir)
        i2cwrite(MAX30100_I2C_ADDRESS, MAX30100_LED_CONFIG, (led_current_red << 4) | led_current_ir);
    }
    
    function set_mode(mode: number) {
        let reg = i2cread(MAX30100_I2C_ADDRESS, MAX30100_MODE_CONFIG)
        i2cwrite(MAX30100_I2C_ADDRESS, MAX30100_MODE_CONFIG, reg & 0x74) // mask the SHDN bit
        i2cwrite(MAX30100_I2C_ADDRESS, MAX30100_MODE_CONFIG, reg | mode);
    }

    function enable_spo2() {
        set_mode(MODE_SPO2)
    }

    function  disable_spo2() {
        set_mode(MODE_HR)
    }
    
    function set_spo_config() {
        let sample_rate = 100;
        let pulse_width = 1600;
        let reg = i2cread(MAX30100_I2C_ADDRESS, MAX30100_SPO2_CONFIG)
        reg = reg & 0xFC  // Set LED pulsewidth to 00
        i2cwrite(MAX30100_I2C_ADDRESS, MAX30100_SPO2_CONFIG, reg | pulse_width);
    }

    function enable_interrupt(interrupt_type: number) {
        i2cwrite(MAX30100_I2C_ADDRESS, MAX30100_INT_ENABLE, (interrupt_type + 1)<<4);
        i2cread(MAX30100_I2C_ADDRESS, MAX30100_INT_STATUS);
    }

    function get_number_of_samples() {
        let write_ptr = i2cread(MAX30100_I2C_ADDRESS, MAX30100_FIFO_WR_PTR);
        let read_ptr = i2cread(MAX30100_I2C_ADDRESS, MAX30100_FIFO_RD_PTR);
        return Math.abs(16+write_ptr - read_ptr) % 16;
    }

    let buffer_red: number[] = [];
    let buffer_ir: number[] = [];
    const MAX30100_MAX_BUFFER_LEN = 10000;

    function read_sensor() {
        pins.i2cWriteNumber(MAX30100_I2C_ADDRESS, MAX30100_FIFO_DATA, NumberFormat.UInt8BE);
        let nums: number[] = []
        nums[0] = pins.i2cReadNumber(MAX30100_I2C_ADDRESS, NumberFormat.UInt8BE, true);
        nums[1] = pins.i2cReadNumber(MAX30100_I2C_ADDRESS, NumberFormat.UInt8BE, true);
        nums[2] = pins.i2cReadNumber(MAX30100_I2C_ADDRESS, NumberFormat.UInt8BE, true);
        nums[3] = pins.i2cReadNumber(MAX30100_I2C_ADDRESS, NumberFormat.UInt8BE, false);
        for (let index = 0; index <= MAX30100_MAX_BUFFER_LEN-2; index++) {
            buffer_ir[index+1] = buffer_ir[index];
            buffer_red[index+1] = buffer_red[index];
        }
        buffer_ir[0] = nums[0]<<8 | nums[1];
        buffer_red[0] = nums[2]<<8 | nums[3];
    }

    function shutdown() {
        let reg = i2cread(MAX30100_I2C_ADDRESS, MAX30100_MODE_CONFIG);
        i2cwrite(MAX30100_I2C_ADDRESS, MAX30100_MODE_CONFIG, reg | 0x80);
    }

    function reset() {
        let reg = i2cread(MAX30100_I2C_ADDRESS, MAX30100_MODE_CONFIG);
        i2cwrite(MAX30100_I2C_ADDRESS, MAX30100_MODE_CONFIG, reg | 0x40);
    }
        
    function refresh_temperature() {
        let reg = i2cread(MAX30100_I2C_ADDRESS, MAX30100_MODE_CONFIG);
        i2cwrite(MAX30100_I2C_ADDRESS, MAX30100_MODE_CONFIG, reg | (1 << 3));
    }

    function get_temperature() {
        let intg = twos_complement(i2cread(MAX30100_I2C_ADDRESS, MAX30100_TEMP_INTG), 8);
        let frac = i2cread(MAX30100_I2C_ADDRESS, MAX30100_TEMP_FRAC);
        return intg + (frac * 0.0625);
    }

    function get_rev_id() {
        return (i2cread(MAX30100_I2C_ADDRESS, MAX30100_REV_ID);
    }

    function get_part_id() {
        return (i2cread(MAX30100_I2C_ADDRESS, MAX30100_PART_ID);
    }

    //get_registers
    function getINT_STATUS() {
        return (i2cread(MAX30100_I2C_ADDRESS, MAX30100_INT_STATUS));
    }
    function getINT_ENABLE() {
        return (i2cread(MAX30100_I2C_ADDRESS, MAX30100_INT_ENABLE));
    }
    function getFIFO_WR_PTR() {
        return (i2cread(MAX30100_I2C_ADDRESS, MAX30100_FIFO_WR_PTR));
    }
    function getOVRFLOW_CTR() {
        return (i2cread(MAX30100_I2C_ADDRESS, MAX30100_OVRFLOW_CTR));
    }
    function getFIFO_RD_PTR() {
        return (i2cread(MAX30100_I2C_ADDRESS, MAX30100_FIFO_RD_PTR));
    }
    function getFIFO_DATA() {
        return (i2cread(MAX30100_I2C_ADDRESS, MAX30100_FIFO_DATA));
    }
    function getMODE_CONFIG() {
        return (i2cread(MAX30100_I2C_ADDRESS, MAX30100_MODE_CONFIG));
    }
    function getSPO2_CONFIG() {
        return (i2cread(MAX30100_I2C_ADDRESS, MAX30100_SPO2_CONFIG));
    }
    function getLED_CONFIG() {
        return (i2cread(MAX30100_I2C_ADDRESS, MAX30100_LED_CONFIG));
    }
    function getTEMP_INTG() {
        return (i2cread(MAX30100_I2C_ADDRESS, MAX30100_TEMP_INTG));
    }
    function getTEMP_FRAC() {
        return (i2cread(MAX30100_I2C_ADDRESS, MAX30100_TEMP_FRAC));
    }
    function getREV_ID() {
        return (i2cread(MAX30100_I2C_ADDRESS, MAX30100_REV_ID));
    }
    function getPART_ID() {
        return (i2cread(MAX30100_I2C_ADDRESS, MAX30100_PART_ID));
    }












    //% subcategory="SpO2"
	//% blockId="gatorParticle_begin" 
	//% block="initialize gator:Particle sensor"
	export function SpO2Init(){
		MAX30100_init();
		return
	}
		
    //% subcategory="SpO2"
	//% blockId="gatorParticle_color" 
	//% block="get Red:1 Infrared:2 %LEDToRead value"
	export function SpO2Value(LEDToRead: number): number{
        let colorValue = 0;
		switch(LEDToRead)
		{
			case 1:
				colorValue = red();
				break;
			case 2:
				colorValue = ir();
				break;
		}
	   	return colorValue;
	}
	
    //% subcategory="SpO2"
	//% blockId="gatorParticle_setMode"
	//% block="set LED mode to read Red:2 Red&Infrared:3 %LEDMode"
	//% shim=gatorParticle::setReadMode
	export function SpO2SetMode(LEDMode: number)
	{
		return
	}

    //% subcategory="SpO2"
	//% blockId="gatorParticle_setAmplitude"
	//% block="change strength of Red:1 Infrared:2 %LEDToRead | to %myBrightness"
	//% advanced=true
	export function SpO2SetAmp(LEDToRead: number, myBrightness: number)
	{
		return
	}
	
    //% subcategory="SpO2"
	//% blockId="gatorParticle_heartbeat"
	//% block="detect heartbeat in BPM:0 AVG:1 %HeartbeatType"
	export function SpO2Heartbeat(HeartbeatType: number): number
	{
		return 0
	}
}

