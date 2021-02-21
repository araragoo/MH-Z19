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

    const MAX30100_I2C_ADDRESS  = 0x57; // 0x57 =  87 I2C address of the MAX30100 device
                                        // 0xAE = 174 I2C address of the MAX30105 device


    const PULSE_WIDTH_m = [
        200,
        400,
        800,
       1600
    ]
    const PULSE_WIDTH_NUM = 4;
    
    const SAMPLE_RATE_m = [
        50,
       100,
       167,
       200,
       400,
       600,
       800,
      1000
    ]
    const SAMPLE_RATE_NUM = 8;

    let LED_CURRENT_m = [
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
    ];
    const LED_CURRENT_NUM = 16;

    const FIRCoeffs = [172, 321, 579, 927, 1360, 1858, 2390, 2916, 3391, 3768, 4012, 4096];
    const FIR_COEFFS_NUM = 12;

    let INTERRUPT_SPO2 = 0;
    let INTERRUPT_HR = 1;
    let INTERRUPT_TEMP = 2;
    let INTERRUPT_FIFO = 3;
    
    let MODE_HR = 0x02;
    let MODE_SPO2 = 0x03;
  
    function i2cwrite(addr: number, reg: number, value: number) {
        pins.i2cWriteNumber(addr, reg * 256 + value, NumberFormat.UInt16BE)
        //NG:pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE, true);
        //NG:pins.i2cWriteNumber(addr, value, NumberFormat.UInt8BE, false);
        //let buf = pins.createBuffer(2);
        //buf[0] = reg;
        //buf[1] = value;
        //pins.i2cWriteBuffer(addr, buf, false);
    }

    function i2cread(addr: number, reg: number): number{
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE);
        return pins.i2cReadNumber(addr, NumberFormat.UInt8BE);
        //let X
        //let buf = pins.createBufferFromArray([X]) // ex. [X, Y, Z]
        //buf = pins.i2cReadBuffer(addr, 1)
        //return buf[0]
    }

    function readRegisterUInt16(addr: number, reg: number): number {
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE);
        return pins.i2cReadNumber(addr, NumberFormat.UInt16LE);
    }

    function readRegisterInt16(addr: number, reg: number): number {
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE);
        return pins.i2cReadNumber(addr, NumberFormat.Int16LE);

    }

    function twos_complement(val: number, bits: number) {
        if ((val & (1 << (bits - 1))) != 0) {
            val = val - (1 << bits)
        }
        return val
    }

    let mode = MODE_HR;
    let sample_rate = 100;
    let led_current_red = 11.0;
    let led_current_ir = 11.0;
    let pulse_width = 1600;
    let lastBeat = 0;
    let numberOfSamples = 0;

    let buffer_red: number[] = [];
    let buffer_ir: number[] = [];
    let buffer_t: number[] = [];
    const MAX30100_MAX_BUFFER_LEN = 1000;

    function red()  {
        return buffer_red[0];
    }

    function ir()  {
        return buffer_ir[0];
    }

    function get_valid(current: number) {
        for (let index = 0; index < LED_CURRENT_NUM; index++) {
            if(current <= LED_CURRENT_m[index]) {
                return index;
            }
        }
        return LED_CURRENT_NUM - 1;
    }       

    function set_led_red(red: number) {
        led_current_red = red;
        let id_red = get_valid(led_current_red);
        let id_ir = get_valid(led_current_ir);

        i2cwrite(MAX30100_I2C_ADDRESS, MAX30100_LED_CONFIG, (id_red << 4) | id_ir);
    }

    function set_led_ir(ir: number) {
        led_current_ir = ir;
        let id_red = get_valid(led_current_red);
        let id_ir = get_valid(led_current_ir);

        i2cwrite(MAX30100_I2C_ADDRESS, MAX30100_LED_CONFIG, (id_red << 4) | id_ir);
    }
    
    function set_mode(mode: number) {
        let reg = i2cread(MAX30100_I2C_ADDRESS, MAX30100_MODE_CONFIG)
        i2cwrite(MAX30100_I2C_ADDRESS, MAX30100_MODE_CONFIG, reg & 0x74);
        i2cwrite(MAX30100_I2C_ADDRESS, MAX30100_MODE_CONFIG, reg | mode);
    }

    function get_valid_width(width: number) {
        for (let index = 0; index < PULSE_WIDTH_NUM; index++) {
            if(width <= PULSE_WIDTH_m[index]) {
                return index;
            }
        }
        return PULSE_WIDTH_NUM - 1;
    }

    function set_spo_config(rate: number, width: number) {
        let reg = i2cread(MAX30100_I2C_ADDRESS, MAX30100_SPO2_CONFIG)
        reg = reg & 0xFC  // Set LED pulsewidth to 00
        i2cwrite(MAX30100_I2C_ADDRESS, MAX30100_SPO2_CONFIG, reg | get_valid_width(width));
    }

    function MAX30100_init() {
        set_mode(mode);
        set_led_red(led_current_red);
        set_led_ir(led_current_ir);
        set_spo_config(sample_rate, pulse_width);
        basic.pause(100);
        lastBeat = input.runningTime();
    }

    function enable_spo2() {
        set_mode(MODE_SPO2)
    }

    function  disable_spo2() {
        set_mode(MODE_HR)
    }   

    function enable_interrupt(interrupt_type: number) {
        i2cwrite(MAX30100_I2C_ADDRESS, MAX30100_INT_ENABLE, (interrupt_type + 1)<<4);
        i2cread(MAX30100_I2C_ADDRESS, MAX30100_INT_STATUS);
    }

    function get_number_of_samples() {
        let write_ptr = i2cread(MAX30100_I2C_ADDRESS, MAX30100_FIFO_WR_PTR);
        let read_ptr = i2cread(MAX30100_I2C_ADDRESS, MAX30100_FIFO_RD_PTR);
        return Math.abs(16 + write_ptr - read_ptr) % 16;
    }

    function read_sensor() {
        pins.i2cWriteNumber(MAX30100_I2C_ADDRESS, MAX30100_FIFO_DATA, NumberFormat.UInt8BE, false);
        let nums: number[] = []
        nums[0] = pins.i2cReadNumber(MAX30100_I2C_ADDRESS, NumberFormat.UInt8BE, true);
        nums[1] = pins.i2cReadNumber(MAX30100_I2C_ADDRESS, NumberFormat.UInt8BE, true);
        nums[2] = pins.i2cReadNumber(MAX30100_I2C_ADDRESS, NumberFormat.UInt8BE, true);
        nums[3] = pins.i2cReadNumber(MAX30100_I2C_ADDRESS, NumberFormat.UInt8BE, false);
        for (let index = 0; index <= MAX30100_MAX_BUFFER_LEN-2; index++) {
            buffer_ir[index+1] = buffer_ir[index];
            buffer_red[index+1] = buffer_red[index];
            buffer_t[index+1] = buffer_t[index];
        }
        buffer_ir[0] = nums[0]<<8 | nums[1];
        buffer_red[0] = nums[2]<<8 | nums[3];
        buffer_t[0] = input.runningTime();
        numberOfSamples++;
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
        return (i2cread(MAX30100_I2C_ADDRESS, MAX30100_REV_ID));
    }

    function get_part_id() {
        return (i2cread(MAX30100_I2C_ADDRESS, MAX30100_PART_ID));
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

    let IR_AC_Max = 20;
    let IR_AC_Min = -20;
    
    let IR_AC_Signal_Current = 0;
    let IR_AC_Signal_Previous;
    let IR_AC_Signal_min = 0;
    let IR_AC_Signal_max = 0;
    let IR_Average_Estimated;
    
    let positiveEdge = 0;
    let negativeEdge = 0;
    let ir_avg_reg = 0;

    let cbuf: number[] = [];
    let offset = 0;
    let placeholder = 0;

    let ave = 0;
    function averageDCEstimator(x: number) {
      ave += (((x << 15) - ave) >> 4);
       return (ave >> 15);
    }

    function lowPassFIRFilter(x: number) {
        cbuf[offset] = x;
        let z = (FIRCoeffs[11], cbuf[(offset - 11) & 0x1F]);
        for (let i = 0 ; i < 11 ; i++) {
            z += FIRCoeffs[i] * (cbuf[(offset - i) & 0x1F] + cbuf[(offset - 22 + i) & 0x1F]);
        }
        offset++;
        offset %= 32;
        return(z >> 15);
    }

    function checkForBeat(sample: number) {        
        let beatDetected = false;
        IR_AC_Signal_Previous = IR_AC_Signal_Current;
        IR_Average_Estimated = averageDCEstimator(sample);
        IR_AC_Signal_Current = lowPassFIRFilter(sample - IR_Average_Estimated);
      
        if ((IR_AC_Signal_Previous < 0) && (IR_AC_Signal_Current >= 0)) {
            IR_AC_Max = IR_AC_Signal_max;
            IR_AC_Min = IR_AC_Signal_min;
      
            positiveEdge = 1;
            negativeEdge = 0;
            IR_AC_Signal_max = 0;
      
            //if ((IR_AC_Max - IR_AC_Min) > 100 & (IR_AC_Max - IR_AC_Min) < 1000)
            if (((IR_AC_Max - IR_AC_Min) > 20) && ((IR_AC_Max - IR_AC_Min) < 1000)) {
                placeholder++;
                beatDetected = true;
            }
        }
      
        if ((IR_AC_Signal_Previous > 0) && (IR_AC_Signal_Current <= 0)) {
            positiveEdge = 0;
            negativeEdge = 1;
            IR_AC_Signal_min = 0;
        }

        if (positiveEdge && (IR_AC_Signal_Current > IR_AC_Signal_Previous)) {
            IR_AC_Signal_max = IR_AC_Signal_Current;
        }
      
        if (negativeEdge && (IR_AC_Signal_Current < IR_AC_Signal_Previous)) {
            IR_AC_Signal_min = IR_AC_Signal_Current;
        }
        
        return(beatDetected);
    }












    //% subcategory="SpO2"
	//% blockId="gatorParticle_begin" 
	//% block="initialize gator:Particle sensor"
	export function SpO2Init(){
		MAX30100_init();
		return
	}

    //% subcategory="SpO2"
	//% blockId="gatorParticle_Red" 
	//% block="get Red value"
	export function SpO2ValueRed(): number{
	   	return red();
	}
	
    //% subcategory="SpO2"
	//% blockId="gatorParticle_IR" 
	//% block="get IR value"
	export function SpO2ValueIR(): number{
        return ir();
    }
 

    //% subcategory="SpO2"
	//% blockId="gatorParticle_setMode"
	//% block="set mode to read Red:2 Red&Infrared:3 %LEDMode"
    //% nLEDMode.min=2 LEDMode.max=3
	export function SpO2SetMode(LEDMode: number)
	{
		set_mode(LEDMode)
	}

    //% subcategory="SpO2"
	//% blockId="gatorParticle_setAmplitudeRed"
	//% block="set Amplitude of LED Red %Brightness"
    //% Brightness.min=0 Brightness.max=50
	export function SpO2SetLedRed(Brightness: number)
	{
		set_led_red(Brightness);
	}

    //% subcategory="SpO2"
	//% blockId="gatorParticle_setAmplitudeIR"
	//% block="set Amplitude of LED IR %Brightness"
    //% Brightness.min=0 Brightness.max=50
	export function SpO2SetLedIR(Brightness: number)
	{
		set_led_ir(Brightness);
	}
   
    //% subcategory="SpO2"
	//% blockId="gatorParticle_heartbeat"
	//% block="detect heartbeat in BPM:0 AVG:1 %HeartbeatType"
	export function SpO2Heartbeat(HeartbeatType: number): number
	{
        let myBeat;
        let rates: number[] = [];
        const RATES_NUM = 4;
        let rateSpot = 0;

        let beatsPerMinute;
        let beatAvg;

        numberOfSamples = 0;
		do {
			let irValue = ir();
			if (checkForBeat(irValue) == true) {
				let delta = input.runningTime() - lastBeat;
				lastBeat = input.runningTime();

				let beatsPerMinute = 60 / (delta / 1000.0);

				if (beatsPerMinute < 255 && beatsPerMinute > 20)
				{
					rates[rateSpot++] = beatsPerMinute;
					rateSpot %= RATES_NUM; 
					beatAvg = 0;
                    for (let x = 0 ; x < RATES_NUM; x++){
						beatAvg += rates[x];
					}
					beatAvg /= RATES_NUM;
				}
			}
        } while(numberOfSamples < MAX30100_MAX_BUFFER_LEN);
		switch(HeartbeatType)
		{
			case 0:
				myBeat = beatsPerMinute;
				break;
				
			case 1:
				myBeat = beatAvg;
				break;				
		}
		return myBeat;
	}
}

