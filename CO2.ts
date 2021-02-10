// https://github.com/araragoo/CO2

//% weight=5 color=#0fbc11 icon="\uf112" block="CO2"
namespace CO2 {

const MAX30105_ADDRESS = 0xAE;
// Status Registers
const MAX30105_INTSTAT1 =		0x00;
const MAX30105_INTSTAT2 =		0x01;
const MAX30105_INTENABLE1 =		0x02;
const MAX30105_INTENABLE2 =		0x03;

// FIFO Registers
const MAX30105_FIFOWRITEPTR = 	0x04;
const MAX30105_FIFOOVERFLOW = 	0x05;
const MAX30105_FIFOREADPTR = 	0x06;
const MAX30105_FIFODATA =		0x07;

// Configuration Registers
const MAX30105_FIFOCONFIG = 		0x08;
const MAX30105_MODECONFIG = 		0x09;
const MAX30105_PARTICLECONFIG = 	0x0A;    // Note, sometimes listed as "SPO2" config in datasheet (pg. 11)
const MAX30105_LED1_PULSEAMP = 	0x0C;
const MAX30105_LED2_PULSEAMP = 	0x0D;
const MAX30105_MULTILEDCONFIG1 = 0x11;
const MAX30105_MULTILEDCONFIG2 = 0x12;

// Die Temperature Registers
const MAX30105_DIETEMPINT = 		0x1F;
const MAX30105_DIETEMPFRAC = 	0x20;
const MAX30105_DIETEMPCONFIG = 	0x21;

// Proximity Function Registers
const MAX30105_PROXINTTHRESH = 	0x30;

// Part ID Registers
const MAX30105_REVISIONID = 		0xFE;
const MAX30105_PARTID = 			0xFF;    // Should always be 0x15. Identical to MAX30102.

// MAX30105 Commands
// Interrupt configuration (pg 13, 14)
const MAX30105_INT_A_FULL_MASK =~0x80;
const MAX30105_INT_A_FULL_ENABLE = 	0x80;
const MAX30105_INT_A_FULL_DISABLE = 	0x00;

const MAX30105_INT_DATA_RDY_MASK =      ~0x40;
const MAX30105_INT_DATA_RDY_ENABLE =	0x40;
const MAX30105_INT_DATA_RDY_DISABLE = 0x00;

const MAX30105_INT_ALC_OVF_MASK =      ~0x20;
const MAX30105_INT_ALC_OVF_ENABLE = 	0x20;
const MAX30105_INT_ALC_OVF_DISABLE = 0x00;

const MAX30105_INT_PROX_INT_MASK = ~0x10;
const MAX30105_INT_PROX_INT_ENABLE = 0x10;
const MAX30105_INT_PROX_INT_DISABLE = 0x00;

const MAX30105_INT_DIE_TEMP_RDY_MASK = ~0x02;
const MAX30105_INT_DIE_TEMP_RDY_ENABLE = 0x02;
const MAX30105_INT_DIE_TEMP_RDY_DISABLE = 0x00;

const MAX30105_SAMPLEAVG_MASK =	~0xE0;
const MAX30105_SAMPLEAVG_1 = 	0x00;
const MAX30105_SAMPLEAVG_2 = 	0x20;
const MAX30105_SAMPLEAVG_4 = 	0x40;
const MAX30105_SAMPLEAVG_8 = 	0x60;
const MAX30105_SAMPLEAVG_16 = 	0x80;
const MAX30105_SAMPLEAVG_32 = 	0xA0;

const MAX30105_ROLLOVER_MASK = 	0xEF;
const MAX30105_ROLLOVER_ENABLE = 0x10;
const MAX30105_ROLLOVER_DISABLE = 0x00;

const MAX30105_A_FULL_MASK = 	0xF0;

// Mode configuration commands (page 19)
const MAX30105_SHUTDOWN_MASK = 	0x7F;
const MAX30105_SHUTDOWN = 		0x80;
const MAX30105_WAKEUP = 			0x00;

const MAX30105_RESET_MASK = 		0xBF;
const MAX30105_RESET = 			0x40;

const MAX30105_MODE_MASK = 		0xF8;
const MAX30105_MODE_REDONLY = 	0x02;
const MAX30105_MODE_REDIRONLY = 	0x03;

// Particle sensing configuration commands (pgs 19-20)
const MAX30105_ADCRANGE_MASK = 	0x9F;
const MAX30105_ADCRANGE_2048 = 	0x00;
const MAX30105_ADCRANGE_4096 = 	0x20;
const MAX30105_ADCRANGE_8192 = 	0x40;
const MAX30105_ADCRANGE_16384 = 	0x60;

const MAX30105_SAMPLERATE_MASK = 0xE3;
const MAX30105_SAMPLERATE_50 = 	0x00;
const MAX30105_SAMPLERATE_100 = 	0x04;
const MAX30105_SAMPLERATE_200 = 	0x08;
const MAX30105_SAMPLERATE_400 = 	0x0C;
const MAX30105_SAMPLERATE_800 = 	0x10;
const MAX30105_SAMPLERATE_1000 = 0x14;
const MAX30105_SAMPLERATE_1600 = 0x18;
const MAX30105_SAMPLERATE_3200 = 0x1C;

const MAX30105_PULSEWIDTH_MASK = 0xFC;
const MAX30105_PULSEWIDTH_69 = 	0x00;
const MAX30105_PULSEWIDTH_118 = 	0x01;
const MAX30105_PULSEWIDTH_215 = 	0x02;
const MAX30105_PULSEWIDTH_411 = 	0x03;

//Multi-LED Mode configuration (pg 22)
const MAX30105_SLOT1_MASK = 		0xF8;
const MAX30105_SLOT2_MASK = 		0x8F;
const MAX30105_SLOT3_MASK = 		0xF8;
const MAX30105_SLOT4_MASK = 		0x8F;

const SLOT_NONE = 				0x00;
const SLOT_RED_LED = 			0x01;
const SLOT_IR_LED = 				0x02;
const SLOT_GREEN_LED = 			0x03;
const SLOT_NONE_PILOT = 			0x04;
const SLOT_RED_PILOT =			0x05;
const SLOT_IR_PILOT = 			0x06;
const SLOT_GREEN_PILOT = 		0x07;

const MAX_30105_EXPECTEDPARTID = 0x15;

let activeDiodes = 3; //Gets set during setup. Allows check() to calculate how many bytes to read from FIFO

//#define STORAGE_SIZE 25 //Each long is 4 bytes so limit this to fit on your micro
const STORAGE_SIZE = 25 //Each long is 4 bytes so limit this to fit on your micro

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

let cbuf;
let offset = 0;

const FIRCoeffs = [172, 321, 579, 927, 1360, 1858, 2390, 2916, 3391, 3768, 4012, 4096];



    let CO2data = 400
    let buffer: Buffer = null
    let buf  = control.createBuffer(9)
    let buf0 = control.createBuffer(9)

    //  subcategory="CO2"
    //% blockId=initalCO2
    //% block="Init CO2"
    export function initCO2 () {
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

    //  subcategory="CO2"
    //% blockId=measureCO2
    //% block="CO2[ppm]"
    export function measuredValue(): number {

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

    //  subcategory="CO2"
    //% blockId=setOffset
    //% block="Set CO2 value as 400ppm"
    export function setOffset () {

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

    function bitMask(reg: number, mask: number, thing: number){
        let originalContents = i2cread(MAX30105_ADDRESS, reg);
        originalContents = originalContents & mask;
      i2cwrite(MAX30105_ADDRESS, reg, originalContents | thing);
    }




    function softReset() {
        bitMask(MAX30105_MODECONFIG, MAX30105_RESET_MASK, MAX30105_RESET);
        basic.pause(100);
    }

    function setFIFOAverage(numberOfSamples: number) {
        bitMask(MAX30105_FIFOCONFIG, MAX30105_SAMPLEAVG_MASK, numberOfSamples);
    }

    function setFIFOAlmostFull(numberOfSamples: number) {
        bitMask(MAX30105_FIFOCONFIG, MAX30105_A_FULL_MASK, numberOfSamples);
    }

    function enableFIFORollover() {
        bitMask(MAX30105_FIFOCONFIG, MAX30105_ROLLOVER_MASK, MAX30105_ROLLOVER_ENABLE);
    }

    function setLEDMode(mode: number) {
        activeDiodes = mode - 1;
        bitMask(MAX30105_MODECONFIG, MAX30105_MODE_MASK, mode);
    }

    function setADCRange(adcRange: number) {
        bitMask(MAX30105_PARTICLECONFIG, MAX30105_ADCRANGE_MASK, adcRange);
    }

    function setSampleRate(sampleRate: number) {
        bitMask(MAX30105_PARTICLECONFIG, MAX30105_SAMPLERATE_MASK, sampleRate);
    }

    function setPulseWidth(pulseWidth: number) {
        bitMask(MAX30105_PARTICLECONFIG, MAX30105_PULSEWIDTH_MASK, pulseWidth);
    }

    function setPulseAmplitudeRed(amplitude: number) {
        i2cwrite(MAX30105_ADDRESS, MAX30105_LED1_PULSEAMP, amplitude);
    }

    function setPulseAmplitudeIR(amplitude: number) {
        i2cwrite(MAX30105_ADDRESS, MAX30105_LED2_PULSEAMP, amplitude);
    }

    function enableSlot(slotNumber: number, device: number) {

      switch (slotNumber) {
        case (1):
          bitMask(MAX30105_MULTILEDCONFIG1, MAX30105_SLOT1_MASK, device);
          break;
        case (2):
          bitMask(MAX30105_MULTILEDCONFIG1, MAX30105_SLOT2_MASK, device << 4);
          break;
        case (3):
          bitMask(MAX30105_MULTILEDCONFIG2, MAX30105_SLOT3_MASK, device);
          break;
        case (4):
          bitMask(MAX30105_MULTILEDCONFIG2, MAX30105_SLOT4_MASK, device << 4);
          break;
        default:
          break;
      }
    }

    function clearFIFO() {
      i2cwrite(MAX30105_ADDRESS, MAX30105_FIFOWRITEPTR, 0);
      i2cwrite(MAX30105_ADDRESS, MAX30105_FIFOOVERFLOW, 0);
      i2cwrite(MAX30105_ADDRESS, MAX30105_FIFOREADPTR, 0);
    }

    function particle_setup(powerLevel: number, sampleAverage: number, ledMode: number, sampleRate: number, pulseWidth: number, adcRange: number) {
        softReset();
        if (sampleAverage == 1) setFIFOAverage(MAX30105_SAMPLEAVG_1); //No averaging per FIFO record
        else if (sampleAverage == 2) setFIFOAverage(MAX30105_SAMPLEAVG_2);
        else if (sampleAverage == 4) setFIFOAverage(MAX30105_SAMPLEAVG_4);
        else if (sampleAverage == 8) setFIFOAverage(MAX30105_SAMPLEAVG_8);
        else if (sampleAverage == 16) setFIFOAverage(MAX30105_SAMPLEAVG_16);
        else if (sampleAverage == 32) setFIFOAverage(MAX30105_SAMPLEAVG_32);
        else setFIFOAverage(MAX30105_SAMPLEAVG_4);

        //setFIFOAlmostFull(2); //Set to 30 samples to trigger an 'Almost Full' interrupt
        enableFIFORollover(); //Allow FIFO to wrap/roll over

        if (ledMode == 2) setLEDMode(MAX30105_MODE_REDIRONLY); //Red and IR
        else setLEDMode(MAX30105_MODE_REDONLY); //Red only
        activeDiodes = ledMode; //Used to control how many uint8_ts to read from FIFO buffer

        if(adcRange < 4096) setADCRange(MAX30105_ADCRANGE_2048); //7.81pA per LSB
        else if(adcRange < 8192) setADCRange(MAX30105_ADCRANGE_4096); //15.63pA per LSB
        else if(adcRange < 16384) setADCRange(MAX30105_ADCRANGE_8192); //31.25pA per LSB
        else if(adcRange == 16384) setADCRange(MAX30105_ADCRANGE_16384); //62.5pA per LSB
        else setADCRange(MAX30105_ADCRANGE_2048);

        if (sampleRate < 100) setSampleRate(MAX30105_SAMPLERATE_50); //Take 50 samples per second
        else if (sampleRate < 200) setSampleRate(MAX30105_SAMPLERATE_100);
        else if (sampleRate < 400) setSampleRate(MAX30105_SAMPLERATE_200);
        else if (sampleRate < 800) setSampleRate(MAX30105_SAMPLERATE_400);
        else if (sampleRate < 1000) setSampleRate(MAX30105_SAMPLERATE_800);
        else if (sampleRate < 1600) setSampleRate(MAX30105_SAMPLERATE_1000);
        else if (sampleRate < 3200) setSampleRate(MAX30105_SAMPLERATE_1600);
        else if (sampleRate == 3200) setSampleRate(MAX30105_SAMPLERATE_3200);
        else setSampleRate(MAX30105_SAMPLERATE_50);

        if (pulseWidth < 118) setPulseWidth(MAX30105_PULSEWIDTH_69); //Page 26, Gets us 15 bit resolution
        else if (pulseWidth < 215) setPulseWidth(MAX30105_PULSEWIDTH_118); //16 bit resolution
        else if (pulseWidth < 411) setPulseWidth(MAX30105_PULSEWIDTH_215); //17 bit resolution
        else if (pulseWidth == 411) setPulseWidth(MAX30105_PULSEWIDTH_411); //18 bit resolution
        else setPulseWidth(MAX30105_PULSEWIDTH_69);

        //LED Pulse Amplitude Configuration
        //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
        //Default is 0x1F which gets us 6.4mA
        //powerLevel = 0x02, 0.4mA - Presence detection of ~4 inch
        //powerLevel = 0x1F, 6.4mA - Presence detection of ~8 inch
        //powerLevel = 0x7F, 25.4mA - Presence detection of ~8 inch
        //powerLevel = 0xFF, 50.0mA - Presence detection of ~12 inch

        setPulseAmplitudeRed(powerLevel);
        setPulseAmplitudeIR(powerLevel);

        enableSlot(1, SLOT_RED_LED);
        if (ledMode > 1) enableSlot(2, SLOT_IR_LED);
        //enableSlot(1, SLOT_RED_PILOT);
        //enableSlot(2, SLOT_IR_PILOT);
        //enableSlot(3, SLOT_GREEN_PILOT);

        clearFIFO(); //Reset the FIFO before we begin checking the sensor
    }

	/**
	* Initializes the gator:particle sensor, must be called on power up
	*/	
	//% weight=30 
	//% blockId="gatorParticle_begin" 
	//% block="initialize gator:Particle sensor"
	export function begin(){
		particle_setup(0x1F, 4, 2, 400, 411, 4096);
		return
	}
		
	/**
	* Reads either the Red or Infrared detection channels
	*/
	//% weight=29 
	//% blockId="gatorParticle_color" 
	//% block="get %LEDToRead value"
	export function color(type: LEDToRead): number{
		return 0
	}
	
	/**
	* Set which LED's we want the sensor to update and read.
	*/	
	//% weight=28
	//% blockId="gatorParticle_setReadMode"
	//% block="set LED mode to read %LEDMode"
	//% shim=gatorParticle::setReadMode
	export function setReadMode(mode: LEDMode)
	{
		return
	}

	/**
	* Set the amplitude of either Red or Infrared LED
	*/	
	//% weight=27
	//% blockId="gatorParticle_setAmplitude"
	//% block="change strength of %LEDToRead | to %myBrightness"
	//% advanced=true
	export function setAmplitude(led: LEDToRead, myBrightness: number)
	{
		return
	}
	
	/**
	* Grab the heartbeat from the sensor in either beats per minute, or an average of the last 4 BPM readings.
	*/
	//% weight=26
	//% blockId="gatorParticle_heartbeat"
	//% block="detect heartbeat in %HeartbeatType"
	export function heartbeat(type: HeartbeatType): number
	{
		return 0
	}
}

