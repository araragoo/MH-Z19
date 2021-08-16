// https://github.com/araragoo/CO2

//% weight=5 color=#0fbc11 icon="\uf112" block="Measurement"
namespace CO2 {

    let CO2data = 400
    let buffer: Buffer = null
    let buf  = control.createBuffer(9)
    let buf0 = control.createBuffer(9)

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


    const MAX30105_ADDRESS = 0x57; //7-bit I2C Address
    const I2C_BUFFER_LENGTH = 32;

    const MAX30105_MODECONFIG = 	0x09;
    const MAX30105_MODE_MASK = 	    0xF8;
    const MAX30105_PARTICLECONFIG = 0x0A;
    const MAX30105_ADCRANGE_MASK = 	0x9F;
    const MAX30105_SAMPLERATE_MASK = 0xE3;
    const MAX30105_PULSEWIDTH_MASK = 0xFC;
    const MAX30105_LED1_PULSEAMP = 	0x0C;
    const MAX30105_LED2_PULSEAMP = 	0x0D;
    const MAX30105_SAMPLEAVG_MASK =	0x1F;
    const MAX30105_FIFOCONFIG = 	0x08;
    const MAX30105_FIFODATA =		0x07;
    const MAX30105_ROLLOVER_MASK = 	0xEF;
    const MAX30105_ROLLOVER_ENABLE = 0x10; //(byte)~0b11100000;
    const MAX30105_FIFOWRITEPTR = 	0x04;
    const MAX30105_FIFOOVERFLOW = 	0x05;
    const MAX30105_FIFOREADPTR = 	0x06;
    const MAX30105_SLOT1_MASK = 	0xF8;
    const MAX30105_SLOT2_MASK = 	0x8F;
    const MAX30105_SLOT3_MASK = 	0xF8;
    const MAX30105_SLOT4_MASK = 	0x8F;
    const MAX30105_MULTILEDCONFIG1 = 0x11;
    const MAX30105_MULTILEDCONFIG2 = 0x12;
    const MAX30105_DIETEMPINT = 	0x1F;
    const MAX30105_DIETEMPFRAC = 	0x20;
    const MAX30105_DIETEMPCONFIG = 	0x21;
    const MAX30105_SAMPLEAVG_1 = 	0x00;
    const MAX30105_SAMPLEAVG_2 = 	0x20;
    const MAX30105_SAMPLEAVG_4 = 	0x40;
    const MAX30105_SAMPLEAVG_8 = 	0x60;
    const MAX30105_SAMPLEAVG_16 = 	0x80;
    const MAX30105_SAMPLEAVG_32 = 	0xA0;
    const MAX30105_MODE_REDONLY = 	0x02;
    const MAX30105_MODE_REDIRONLY = 0x03;
    const MAX30105_ADCRANGE_2048 = 	0x00;
    const MAX30105_ADCRANGE_4096 = 	0x20;
    const MAX30105_ADCRANGE_8192 = 	0x40;
    const MAX30105_ADCRANGE_16384 = 0x60;
    const MAX30105_SAMPLERATE_50 = 	0x00;
    const MAX30105_SAMPLERATE_100 = 0x04;
    const MAX30105_SAMPLERATE_200 = 0x08;
    const MAX30105_SAMPLERATE_400 = 0x0C;
    const MAX30105_SAMPLERATE_800 = 0x10;
    const MAX30105_SAMPLERATE_1000 = 0x14;
    const MAX30105_SAMPLERATE_1600 = 0x18;
    const MAX30105_SAMPLERATE_3200 = 0x1C;
    const MAX30105_PULSEWIDTH_69 = 	0x00;
    const MAX30105_PULSEWIDTH_118 = 0x01;
    const MAX30105_PULSEWIDTH_215 = 0x02;
    const MAX30105_PULSEWIDTH_411 = 0x03;

    const SLOT_RED_LED = 0x01;
    const SLOT_IR_LED = 0x02;

    let activeDiodes = 3; //Gets set during setup. Allows check() to calculate how many bytes to read from FIFO

    const STORAGE_SIZE = 4; //Each long is 4 bytes so limit this to fit on your micro

    let sense_red: number[] = [];
    let sense_IR: number[] = [];
    let sense_green: number[] = [];
    let sense_head: number;
    let sense_tail: number;   
           
    function i2cwrite(addr: number, reg: number, value: number) {
        //pins.i2cWriteNumber(addr, reg * 256 + value, NumberFormat.UInt16BE)
        //NG:pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE, true);
        //NG:pins.i2cWriteNumber(addr, value, NumberFormat.UInt8BE, false);
        let buf = pins.createBuffer(2);
        buf[0] = reg;
        buf[1] = value;
        pins.i2cWriteBuffer(addr, buf, false);
    }

    function i2cread(addr: number, reg: number): number {
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE);
        return pins.i2cReadNumber(addr, NumberFormat.UInt8BE);
        //let X
        //let buf = pins.createBufferFromArray([X]) // ex. [X, Y, Z]
        //buf = pins.i2cReadBuffer(addr, 1)
        //return buf[0]
    }

    let readbuf: Buffer;
    function i2creads(addr: number, reg: number, size: number) {
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE);
        readbuf = pins.i2cReadBuffer(addr, size)      
    }

    function bitMask(reg:number, mask:number, thing:number) {
        let originalContents = i2cread(MAX30105_ADDRESS, reg);
        originalContents = originalContents & mask;
        i2cwrite(MAX30105_ADDRESS, reg, originalContents | thing);
    }

    function setLEDMode(mode:number) {
        // Set which LEDs are used for sampling -- Red only, RED+IR only, or custom.
        // See datasheet, page 19
        activeDiodes = mode - 1;
        bitMask(MAX30105_MODECONFIG, MAX30105_MODE_MASK, mode);
    }

    function setADCRange(adcRange:number) {
        // adcRange: one of MAX30105_ADCRANGE_2048, _4096, _8192, _16384
        bitMask(MAX30105_PARTICLECONFIG, MAX30105_ADCRANGE_MASK, adcRange);
    }
    function setSampleRate(sampleRate:number) {
        // sampleRate: one of MAX30105_SAMPLERATE_50, _100, _200, _400, _800, _1000, _1600, _3200
        bitMask(MAX30105_PARTICLECONFIG, MAX30105_SAMPLERATE_MASK, sampleRate);
    }
      
    function setPulseWidth(pulseWidth:number) {
        // pulseWidth: one of MAX30105_PULSEWIDTH_69, _188, _215, _411
        bitMask(MAX30105_PARTICLECONFIG, MAX30105_PULSEWIDTH_MASK, pulseWidth);
    }
      
    // NOTE: Amplitude values: 0x00 = 0mA, 0x7F = 25.4mA, 0xFF = 50mA (typical)
    function setPulseAmplitudeRed(amplitude:number) {
        i2cwrite(MAX30105_ADDRESS, MAX30105_LED1_PULSEAMP, amplitude);
    }
      
    function setPulseAmplitudeIR(amplitude:number) {
        i2cwrite(MAX30105_ADDRESS, MAX30105_LED2_PULSEAMP, amplitude);
    }

    function setFIFOAverage(numberOfSamples:number) {
        bitMask(MAX30105_FIFOCONFIG, MAX30105_SAMPLEAVG_MASK, numberOfSamples);
    }

    function enableFIFORollover() {
        bitMask(MAX30105_FIFOCONFIG, MAX30105_ROLLOVER_MASK, MAX30105_ROLLOVER_ENABLE);
    }

    function clearFIFO() {
        i2cwrite(MAX30105_ADDRESS, MAX30105_FIFOWRITEPTR, 0);
        i2cwrite(MAX30105_ADDRESS, MAX30105_FIFOOVERFLOW, 0);
        i2cwrite(MAX30105_ADDRESS, MAX30105_FIFOREADPTR, 0);
    }

    function enableSlot(slotNumber:number, device:number) {

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
            //Shouldn't be here!
            break;
        }
    }

    function getWritePointer(): number {
        return (i2cread(MAX30105_ADDRESS, MAX30105_FIFOWRITEPTR));
    }
    
    //Read the FIFO Read Pointer
    function getReadPointer(): number {
        return (i2cread(MAX30105_ADDRESS, MAX30105_FIFOREADPTR));
    }
    
    function readTemperature(): number {
        i2cwrite(MAX30105_ADDRESS, MAX30105_DIETEMPCONFIG, 0x01);
        basic.pause(100);

        let tempInt = i2cread(MAX30105_ADDRESS, MAX30105_DIETEMPINT);
        let tempFrac = i2cread(MAX30105_ADDRESS, MAX30105_DIETEMPFRAC); //Causes the clearing of the DIE_TEMP_RDY interrupt
    
        return tempInt + (tempFrac * 0.0625);
    }

    function setup(powerLevel:number, sampleAverage:number, ledMode:number, sampleRate:number, pulseWidth:number, adcRange:number) {
        //softReset(); //Reset all configuration, threshold, and data registers to POR values
        //FIFO Configuration
        //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
        //The chip will average multiple samples of same type together if you wish
        if (sampleAverage == 1) setFIFOAverage(MAX30105_SAMPLEAVG_1); //No averaging per FIFO record
        else if (sampleAverage == 2) setFIFOAverage(MAX30105_SAMPLEAVG_2);
        else if (sampleAverage == 4) setFIFOAverage(MAX30105_SAMPLEAVG_4);
        else if (sampleAverage == 8) setFIFOAverage(MAX30105_SAMPLEAVG_8);
        else if (sampleAverage == 16) setFIFOAverage(MAX30105_SAMPLEAVG_16);
        else if (sampleAverage == 32) setFIFOAverage(MAX30105_SAMPLEAVG_32);
        else setFIFOAverage(MAX30105_SAMPLEAVG_4);
      
        //setFIFOAlmostFull(2); //Set to 30 samples to trigger an 'Almost Full' interrupt
        enableFIFORollover(); //Allow FIFO to wrap/roll over
        //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
      
        //Mode Configuration
        //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
        if (ledMode == 2) setLEDMode(MAX30105_MODE_REDIRONLY); //Red and IR
        else setLEDMode(MAX30105_MODE_REDONLY); //Red only
        activeDiodes = ledMode; //Used to control how many uint8_ts to read from FIFO buffer
        //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
      
        //Particle Sensing Configuration
        //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
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
      
        //The longer the pulse width the longer range of detection you'll have
        //At 69us and 0.4mA it's about 2 inches
        //At 411us and 0.4mA it's about 6 inches
        if (pulseWidth < 118) setPulseWidth(MAX30105_PULSEWIDTH_69); //Page 26, Gets us 15 bit resolution
        else if (pulseWidth < 215) setPulseWidth(MAX30105_PULSEWIDTH_118); //16 bit resolution
        else if (pulseWidth < 411) setPulseWidth(MAX30105_PULSEWIDTH_215); //17 bit resolution
        else if (pulseWidth == 411) setPulseWidth(MAX30105_PULSEWIDTH_411); //18 bit resolution
        else setPulseWidth(MAX30105_PULSEWIDTH_69);
        //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
      
        //LED Pulse Amplitude Configuration
        //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
        //Default is 0x1F which gets us 6.4mA
        //powerLevel = 0x02, 0.4mA - Presence detection of ~4 inch
        //powerLevel = 0x1F, 6.4mA - Presence detection of ~8 inch
        //powerLevel = 0x7F, 25.4mA - Presence detection of ~8 inch
        //powerLevel = 0xFF, 50.0mA - Presence detection of ~12 inch
      
        setPulseAmplitudeRed(powerLevel);
        setPulseAmplitudeIR(powerLevel);
        //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
      
        //Multi-LED Mode Configuration, Enable the reading of the three LEDs
        //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
        enableSlot(1, SLOT_RED_LED);
        if (ledMode > 1) enableSlot(2, SLOT_IR_LED);
        //enableSlot(1, SLOT_RED_PILOT);
        //enableSlot(2, SLOT_IR_PILOT);
        //enableSlot(3, SLOT_GREEN_PILOT);
        //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
      
        clearFIFO(); //Reset the FIFO before we begin checking the sensor
    }
    
    function available(): number {
        let numberOfSamples = sense_head - sense_tail;
        if (numberOfSamples < 0) numberOfSamples += STORAGE_SIZE;
        
        return (numberOfSamples);
    }

    function getRed(): number {
        //if(safeCheck(250)){
            return sense_red[sense_head];
        //}
        //else
        //    return(0); //Sensor failed to find new data
    }
    
    function getIR(): number {
        //if(safeCheck(250))
            return (sense_IR[sense_head]);
        //else
        //    return(0); //Sensor failed to find new dat
    }

    function getGreen(): number {
        //if(safeCheck(250))
            return (sense_green[sense_head]);
        //else
        //    return(0); //Sensor failed to find new data
    }
    
    function nextSample(): number{
        if(available()) { //Only advance the tail if new data is available
            sense_tail++;
            sense_tail %= STORAGE_SIZE; //Wrap condition
            return 1;
        } else {
            return 0;
        }
    }

    function check(): number {
        //Read register FIDO_DATA in (3-uint8_t * number of active LED) chunks
        //Until FIFO_RD_PTR = FIFO_WR_PTR

        let readPointer = getReadPointer();
        let writePointer = getWritePointer();
        let numberOfSamples = 0;

        //Do we have new data?
        if (readPointer != writePointer) {
            //Calculate the number of readings we need to get from sensor
            numberOfSamples = writePointer - readPointer;
            if (numberOfSamples < 0)
                numberOfSamples += I2C_BUFFER_LENGTH; //Wrap condition

            //We now have the number of readings, now calc uint8_ts to read
            //For this example we are just doing Red and IR (3 uint8_ts each)
            let bytesLeftToRead = numberOfSamples * activeDiodes * 3;
            let temp: number[] = []; //Array of 9 uint8_ts that we will convert into longs
            let temp2: number[] = []; //Array of 4 uint8_ts that we will convert into longs
            let tempLong;
            let checkOffset
            
            //Get ready to read a burst of data from the FIFO register

            //We may need to read as many as 288 uint8_ts so we read in blocks no larger than I2C_BUFFER_LENGTH
            //I2C_BUFFER_LENGTH changes based on the platform. 64 uint8_ts for SAMD21, 32 uint8_ts for Uno.
            while (bytesLeftToRead > 0) {
            
                let toGet = activeDiodes * 3;

                //Request toGet number of uint8_ts from sensor
                //i2c.requestFrom(MAX30105_ADDRESS, toGet);
                while(toGet > 0) {

                    //i2c.readRegister(MAX30105_ADDRESS, (uint8_t)MAX30105_FIFODATA, temp, toGet);
                    i2creads(MAX30105_ADDRESS, MAX30105_FIFODATA, toGet);
                    //for (let led = 0; led < activeDiodes*3; led++) {
                    //    temp[led] = i2cread(MAX30105_ADDRESS, MAX30105_FIFODATA);
                    //}
                    sense_head++; //Advance the head of the storage struct
                    sense_head %= STORAGE_SIZE; //Wrap condition
                    for (let led = 0; led < activeDiodes; led++) {
                        checkOffset = led * 3;
                        /*
                        temp2[3] = 0;
                        temp2[0] = temp[2 + checkOffset];
                        temp2[1] = temp[1 + checkOffset];
                        temp2[2] = temp[checkOffset];
                        memcpy(&tempLong, temp2, sizeof(tempLong)); //tempLong is 4 bytes, we only need 3
                        tempLong &= 0x3FFFF;
                        tempLong = (temp[checkOffset]<<16 | temp[1 + checkOffset]<<8 | temp[2 + checkOffset] ) & 0x3FFFF;
                        */
                        tempLong = (readbuf[checkOffset]<<16 | readbuf[1 + checkOffset]<<8 | readbuf[2 + checkOffset] ) & 0x3FFFF;
                        let led2 = led;
                        switch (led2) {
                            case 0:
                                sense_red[sense_head] = tempLong;//Long;//Store this reading into the sense array
                                break;
                            case 1:
                                sense_IR[sense_head] = tempLong;
                                break;
                            case 2:
                                sense_green[sense_head] = tempLong;
                                break;
                            default:
                                break;
                        }
                    }
                    bytesLeftToRead -= toGet;
                    toGet -= activeDiodes * 3;
                }
            }
        }
        return (numberOfSamples); //Let the world know how much new data we found
    }


    function MAX30105_init() {

        let ledBrightness = 60; //Options: 0=Off to 255=50mA
        let sampleAverage = 4; //Options: 1, 2, 4, 8, 16, 32
        let ledMode = 2;    //Options(MAX30102): 1 = Red only, 2 = Red + IR
                            //Options(MAX30105): 1 = Red only, 2 = Red + IR, 3 = Red + IR + Green
        let sampleRate = 100; //Options: 50, 100, 200, 400, 800, 1000, 1600, 3200
        let pulseWidth = 411; //Options: 69, 118, 215, 411
        let adcRange = 4096; //Options: 2048, 4096, 8192, 16384

        setup(ledBrightness, sampleAverage, ledMode, sampleRate, pulseWidth, adcRange); //Configure sensor with these settings
    }
    
    let IR_AC_Signal_Current = 0;
    let IR_AC_Signal_Previous = 0;
    let IR_AC_Signal_min = 0;
    let IR_AC_Signal_max = 0;
    let IR_Average_Estimated;
    
    let positiveEdge = 0;
    let negativeEdge = 0;
    let ir_avg_reg = 0;
    
    let  cbuf: number[] = [];
    let  offset = 0;
    
    const FIRCoeffs = [172, 321, 579, 927, 1360, 1858, 2390, 2916, 3391, 3768, 4012, 4096];

    let bufferLength = 100;; //data length
    
    let SpO2 = 0; //SPO2 value
    let validSpO2 = 0; //indicator to show if the SPO2 calculation is valid
    let heartRate = 0; //heart rate value 
    let validHeartRate = 0; //indicator to show if the heart rate calculation is valid

    const FreqS = 25;    //sampling frequency
    const BUFFER_SIZE = (FreqS * 4); 
    const MA4_SIZE = 4; // DONOT CHANGE
//#define min(x,y) ((x) < (y) ? (x) : (y)) //Defined in Arduino.h

//uch_spo2_table is approximated as  -45.060*ratioAverage* ratioAverage + 30.354 *ratioAverage + 94.845 ;
    const uch_spo2_table: number[] = [95, 95, 95, 96, 96, 96, 97, 97, 97, 97, 97, 98, 98, 98, 98, 98, 99, 99, 99, 99, 
              99, 99, 99, 99, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 
              100, 100, 100, 100, 99, 99, 99, 99, 99, 99, 99, 99, 98, 98, 98, 98, 98, 98, 97, 97, 
              97, 97, 96, 96, 96, 96, 95, 95, 95, 94, 94, 94, 93, 93, 93, 92, 92, 92, 91, 91, 
              90, 90, 89, 89, 89, 88, 88, 87, 87, 86, 86, 85, 85, 84, 84, 83, 82, 82, 81, 81, 
              80, 80, 79, 78, 78, 77, 76, 76, 75, 74, 74, 73, 72, 72, 71, 70, 69, 69, 68, 67, 
              66, 66, 65, 64, 63, 62, 62, 61, 60, 59, 58, 57, 56, 56, 55, 54, 53, 52, 51, 50, 
              49, 48, 47, 46, 45, 44, 43, 42, 41, 40, 39, 38, 37, 36, 35, 34, 33, 31, 30, 29, 
              28, 27, 26, 25, 23, 22, 21, 20, 19, 17, 16, 15, 14, 12, 11, 10, 9, 7, 6, 5, 
              3, 2, 1 ];

    let irBuffer: number[] = []; //infrared LED sensor data
    let redBuffer: number[] = [];  //red LED sensor data
      
    let an_x: number[] = []; //ir
    let an_y: number[] = []; //red
    let n_npks: number;

    let an_ratio: number[] = [];
    let n_i_ratio_count: number;
    let an_ir_valley_locs: number[] = [];

    let beatsPerMinute = 0;
    let beatAvg = 0;

    function averageDCEstimator(x: number): number {

        ir_avg_reg += (((x << 15) - ir_avg_reg) >> 4);
        let temp = ir_avg_reg >> 15;

        return temp;
    }

    function lowPassFIRFilter(din: number): number { 

        cbuf[offset] = din;
        let z = FIRCoeffs[11] * cbuf[(offset - 11) & 0x1F];
        
        for (let i = 0 ; i < 11 ; i++) {
            z += FIRCoeffs[i] * cbuf[(offset - i) & 0x1F] + cbuf[(offset - 22 + i) & 0x1F];
        }
        offset++;
        offset %= 32; //Wrap condition

        let temp = z >> 15
        return temp;
    }

    function checkForBeat(sample: number): number {

        let beatDetected = 0;
    
        IR_AC_Signal_Previous = IR_AC_Signal_Current;
       
        IR_Average_Estimated = averageDCEstimator(sample);
        IR_AC_Signal_Current = lowPassFIRFilter(sample - IR_Average_Estimated);

        if ((IR_AC_Signal_Previous < 0) && (IR_AC_Signal_Current >= 0)) {
        
            positiveEdge = 1;
            negativeEdge = 0;
            IR_AC_Signal_max = 0;
        
            if ((IR_AC_Signal_max - IR_AC_Signal_min) > 20 && (IR_AC_Signal_max - IR_AC_Signal_min) < 1000) {
                beatDetected = 1;
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

    const RATE_SIZE = 4; //Increase this for more averaging. 4 is good.
    let rates: number[] = []; //Array of heart rates
    let lastBeat: number = 0;
    let rateSpot = 0;

    function HeartRateByPBA() {
        let nowBeat =  0;
        let irValue;

        check();
        irValue = getIR();

        if (checkForBeat(irValue) == 1) {
            nowBeat = control.millis();          
            beatsPerMinute = 60 * 1000 / (nowBeat - lastBeat);
            lastBeat = nowBeat;

            //　if (beatsPerMinute < 255 && beatsPerMinute > 20) {
                rates[rateSpot++] = beatsPerMinute; //Store this reading in the array
                rateSpot %= RATE_SIZE; //Wrap variable
            
                beatAvg = 0;
                for (let x = 0 ; x < RATE_SIZE ; x++)
                    beatAvg += rates[x];
                beatAvg /= RATE_SIZE;
            // }
        }
    }

    function maxim_peaks_above_min_height(n_min_height:number) {

        let i = 1, n_width;
        n_npks = 0;

        while (i < BUFFER_SIZE-1){
            if (an_x[i] > n_min_height && an_x[i] > an_x[i-1]){      // find left edge of potential peaks
                n_width = 1;
                while (i+n_width < BUFFER_SIZE && an_x[i] == an_x[i+n_width])  // find flat peaks
                    n_width++;
                if (an_x[i] > an_x[i+n_width] && n_npks < 15 ){      // find right edge of peaks
                    an_ir_valley_locs[n_npks++] = i;    
                    i += n_width+1;
                } else
                    i += n_width;
            } else
                i++;
        }
    }
    
    function maxim_sort_indices_descend() {

        let i, j, n_temp;
        for (i = 1; i < BUFFER_SIZE; i++) {
            n_temp = an_ir_valley_locs[i];
            for (j = i; j > 0 && an_x[n_temp] > an_x[an_ir_valley_locs[j-1]]; j--)
                an_ir_valley_locs[j] = an_ir_valley_locs[j-1];
            an_ir_valley_locs[j] = n_temp;
        }
    }

    function maxim_remove_close_peaks(n_min_distance:number) {

        let i, j, n_old_npks, n_dist;
        maxim_sort_indices_descend();

        for ( i = -1; i < n_npks; i++ ){
            n_old_npks = n_npks;
            n_npks = i+1;
            for ( j = i+1; j < n_old_npks; j++ ){
                n_dist =  an_ir_valley_locs[j] - ( i == -1 ? -1 : an_ir_valley_locs[i] ); // lag-zero peak of autocorr is at index -1
                if ( n_dist > n_min_distance || n_dist < -n_min_distance )
                    an_ir_valley_locs[n_npks++] = an_ir_valley_locs[j];
            }
        }
        maxim_sort_ascend();
    }

    function min(x:number, y:number): number {
        if (x < y) return x;
        else       return y;
    }

    function maxim_find_peaks(n_min_height:number, n_min_distance:number, n_max_num:number) {
 
        maxim_peaks_above_min_height(n_min_height );
        maxim_remove_close_peaks(n_min_distance );
        n_npks = min( n_npks, n_max_num );

    }

    function maxim_sort_ascend() {

        let i, j, n_temp;
        for (i = 1; i < n_i_ratio_count; i++) {
            n_temp = an_ratio[i];
            for (j = i; j > 0 && n_temp < an_ratio[j-1]; j--)
                an_ratio[j] = an_ratio[j-1];
            an_ratio[j] = n_temp;
        }
    }

    function maxim_heart_rate_and_oxygen_saturation() {
    
        let un_ir_mean;
        let  k;
        let  i, n_exact_ir_valley_locs_count, n_middle_idx;
        let  n_th1;   
        let  n_peak_interval_sum;

        let n_y_ac, n_x_ac;
        let n_spo2_calc; 
        let n_y_dc_max, n_x_dc_max; 
        let n_y_dc_max_idx = 0;
        let n_x_dc_max_idx = 0; 
        let n_ratio_average; 
        let n_nume, n_denom ;

        un_ir_mean =0; 
        for (let k=0; k<bufferLength ; k++ )
            un_ir_mean += irBuffer[k] ;
        un_ir_mean = un_ir_mean/bufferLength ;
        for (let k=0 ; k<bufferLength ; k++ )  
            an_x[k] = -1*(irBuffer[k] - un_ir_mean) ;

        for(k=0; k< BUFFER_SIZE-MA4_SIZE; k++){
            an_x[k]=( an_x[k]+an_x[k+1]+ an_x[k+2]+ an_x[k+3])/4;        
        }

        n_th1=0; 
        for ( k=0 ; k<BUFFER_SIZE ;k++) {
            n_th1 +=  an_x[k];
        }
        n_th1 = n_th1/ ( BUFFER_SIZE);

        if( n_th1<30) n_th1=30; // min allowed
        if( n_th1>60) n_th1=60; // max allowed

        for ( k=0 ; k<15;k++)
            an_ir_valley_locs[k]=0;
        maxim_find_peaks(n_th1, 4, 15);//peak_height, peak_distance, max_num_peaks 
        n_peak_interval_sum =0;
        if (n_npks>=2){
            for (k=1; k<n_npks; k++)
                n_peak_interval_sum += (an_ir_valley_locs[k] -an_ir_valley_locs[k -1] ) ;
            n_peak_interval_sum =n_peak_interval_sum/(n_npks-1);
            heartRate = ( (FreqS*60)/ n_peak_interval_sum );
            validHeartRate = 1;
        } else { 
            heartRate = -999; // unable to calculate because # of peaks are too small
            validHeartRate  = 0;
        }

        for (k=0 ; k<bufferLength ; k++ ) {
            an_x[k] =  irBuffer[k] ; 
            an_y[k] =  redBuffer[k] ; 
        }

        n_exact_ir_valley_locs_count =n_npks; 

        n_ratio_average =0; 
        n_i_ratio_count = 0; 
        for(k=0; k< 5; k++)
            an_ratio[k]=0;
        for (k=0; k< n_exact_ir_valley_locs_count; k++){
            if (an_ir_valley_locs[k] > BUFFER_SIZE ){
                SpO2=  -999 ; // do not use SPO2 since valley loc is out of range
                validSpO2  = 0; 
                return;
            }
        }
        for (k=0; k< n_exact_ir_valley_locs_count-1; k++){
            n_y_dc_max= -16777216 ; 
            n_x_dc_max= -16777216; 
            if (an_ir_valley_locs[k+1]-an_ir_valley_locs[k] >3){
                for (i=an_ir_valley_locs[k]; i< an_ir_valley_locs[k+1]; i++){
                    if (an_x[i]> n_x_dc_max) {
                        n_x_dc_max =an_x[i]; n_x_dc_max_idx=i;
                    }
                    if (an_y[i]> n_y_dc_max) {
                        n_y_dc_max =an_y[i]; n_y_dc_max_idx=i;
                    }
                }
                n_y_ac= (an_y[an_ir_valley_locs[k+1]] - an_y[an_ir_valley_locs[k] ] )*(n_y_dc_max_idx -an_ir_valley_locs[k]); //red
                n_y_ac=  an_y[an_ir_valley_locs[k]] + n_y_ac/ (an_ir_valley_locs[k+1] - an_ir_valley_locs[k])  ; 
                n_y_ac=  an_y[n_y_dc_max_idx] - n_y_ac;    // subracting linear DC compoenents from raw 
                n_x_ac= (an_x[an_ir_valley_locs[k+1]] - an_x[an_ir_valley_locs[k] ] )*(n_x_dc_max_idx -an_ir_valley_locs[k]); // ir
                n_x_ac=  an_x[an_ir_valley_locs[k]] + n_x_ac/ (an_ir_valley_locs[k+1] - an_ir_valley_locs[k]); 
                n_x_ac=  an_x[n_y_dc_max_idx] - n_x_ac;      // subracting linear DC compoenents from raw 
                n_nume=( n_y_ac *n_x_dc_max)>>7 ; //prepare X100 to preserve floating value
                n_denom= ( n_x_ac *n_y_dc_max)>>7;
                if (n_denom>0  && n_i_ratio_count <5 &&  n_nume != 0) {   
                    an_ratio[n_i_ratio_count]= (n_nume*100)/n_denom ; //formular is ( n_y_ac *n_x_dc_max) / ( n_x_ac *n_y_dc_max) ;
                    n_i_ratio_count++;
                }
            }
        }
        maxim_sort_ascend();
        n_middle_idx= n_i_ratio_count/2;

        if (n_middle_idx >1)
            n_ratio_average =( an_ratio[n_middle_idx-1] +an_ratio[n_middle_idx])/2; // use median
        else
            n_ratio_average = an_ratio[n_middle_idx ];
        if( n_ratio_average>2 && n_ratio_average <184) {
            n_spo2_calc= uch_spo2_table[n_ratio_average] ;
            SpO2  = n_spo2_calc ;
            validSpO2 = 1;//  float_SPO2 =  -45.060*n_ratio_average* n_ratio_average/10000 + 30.354 *n_ratio_average/100 + 94.845 ;  // for comparison with table
        } else {
            SpO2 = -999 ; // do not use SPO2 since signal an_ratio is out of range
            validSpO2 = 0; 
        }
    }
  
    function saturation() {
        /*
        MAX30105_init();

        for (let i = 0 ; i < bufferLength ; i++) {
          while (available()) //do we have new data?
            check(); //Check the sensor for new data
      
          redBuffer[i] = getRed();
          irBuffer[i] = getIR();
          nextSample(); //We're finished with this sample so move to next sample     
        }
      
        maxim_heart_rate_and_oxygen_saturation();
      
        //while (1) {
            for (let i = 25; i < 100; i++) {
                redBuffer[i - 25] = redBuffer[i];
                irBuffer[i - 25] = irBuffer[i];
            }
        */
            //for (let i = 75; i < 100; i++) {
            for (let i = 0; i < 100; i++) {
                    //while (available()) //do we have new data?
                    check(); //Check the sensor for new data
        
                redBuffer[i] = getRed();
                irBuffer[i] = getIR();
                //nextSample(); //We're finished with this sample so move to next sample
                /*
                Serial.print(F("red="));
                Serial.print(redBuffer[i], DEC);
                Serial.print(F(", ir="));
                Serial.print(irBuffer[i], DEC);
        
                Serial.print(F(", HR="));
                Serial.print(heartRate, DEC);
        
                Serial.print(F(", HRvalid="));
                Serial.print(validHeartRate, DEC);
        
                Serial.print(F(", SPO2="));
                Serial.print(spo2, DEC);
        
                Serial.print(F(", SPO2Valid="));
                Serial.println(validSPO2, DEC);
                */
            }
        
            maxim_heart_rate_and_oxygen_saturation();
        //}
    }
/*
    function SpO2readTemperature(): number {
        return readTemperature();
    }

    function SpO2SetIRAmp(IRAmp: number) {
        setPulseAmplitudeIR(IRAmp);
    }

    function SpO2SetRedAmp(RedAmp: number) {
        setPulseAmplitudeRed(RedAmp);
    }

    function SpO2SetMode(LEDMode: number) {
        if (LEDMode == 2) setLEDMode(MAX30105_MODE_REDIRONLY); //Red and IR
        else setLEDMode(MAX30105_MODE_REDONLY); //Red only
        activeDiodes = LEDMode; //Used to control how many uint8_ts to read from FIFO buffer
    }

    function SpO2getValidSpO2(): number {
        return validSpO2;
    }

    function SpO2getSpO2(): number {
        return SpO2;
    }

    function SpO2getValidHR(): number {
        return validHeartRate;
    }

    function SpO2getHR(): number {
        return heartRate;
    }

    function SpO2MeasureSaturation(){
        saturation();
    }

    function SpO2getAveBPM(): number {
        return beatAvg;
    }

    function SpO2getBPM(): number {
        return beatsPerMinute;
    }

    function SpO2MeasureBeat() {
        HeartRateByPBA();
    }

    function SpO2MeasureBeatInit() {
        MAX30105_init();
        setPulseAmplitudeRed(0x0A); //Turn Red LED to low to indicate sensor is running
        lastBeat = control.millis(); //Time at which the last beat occurred
    }

    function SpO2getIR(): number {
        return getIR();
    }

    function SpO2getRed(): number {
        return getRed();
    }
    
    function SpO2MeasureLight() {
        check();
    }

    function SpO2Init () {
        MAX30105_init();
    }
*/   
/* */
    //% subcategory="SpO2"
    //% blockId=SpO2Temperature
    //% block="Value:Temperature"
    export function SpO2readTemperature(): number {
        return readTemperature();
    }

    //% subcategory="SpO2"
    //% blockId=SpO2SetIR
    //% block="SpO2 Set IR Amp:0-50mA %IRAmp"
    //% IRAmp.min=1 IRAmp.max=0xFF
    export function SpO2SetIRAmp(IRAmp: number) {
        setPulseAmplitudeIR(IRAmp);
    }

    //% subcategory="SpO2"
    //% blockId=SpO2SetRed
    //% block="SpO2 Set Red Amp:0-50mA %RedAmp"
    //% RedAmp.min=1 RedAmp.max=0xFF
    export function SpO2SetRedAmp(RedAmp: number) {
        setPulseAmplitudeRed(RedAmp);
    }

    //% subcategory="SpO2"
    //% blockId=SpO2Mode
    //% block="SpO2 Mode Red:1 Red&Infrared:2 %LEDMode"
    //% LEDMode.min=1 LEDMode.max=3 LEDMode.defl=1
    export function SpO2SetMode(LEDMode: number) {
        if (LEDMode == 2) setLEDMode(MAX30105_MODE_REDIRONLY); //Red and IR
        else setLEDMode(MAX30105_MODE_REDONLY); //Red only
        activeDiodes = LEDMode; //Used to control how many uint8_ts to read from FIFO buffer
    }

    //% subcategory="SpO2"
    //% blockId=SpO2ValidSpO2
    //% block="Value:Valid SpO2"
    export function SpO2getValidSpO2(): number {
        return validSpO2;
    }

    //% subcategory="SpO2"
    //% blockId=SpO2SpO2
    //% block="Value:SpO2"
    export function SpO2getSpO2(): number {
        return SpO2;
    }

    //% subcategory="SpO2"
    //% blockId=SpO2ValidHR
    //% block="Value:Valid HR"
    export function SpO2getValidHR(): number {
        return validHeartRate;
    }

    //% subcategory="SpO2"
    //% blockId=SpO2HR
    //% block="Value:HR"
    export function SpO2getHR(): number {
        return heartRate;
    }

    //% subcategory="SpO2"
    //% blockId=SpO2Saturation
    //% block="Measure Saturation"
    export function SpO2MeasureSaturation(){
        saturation();
    }

    //% subcategory="SpO2"
    //% blockId=SpO2AveBPM
    //% block="Value:Ave BPM"
    export function SpO2getAveBPM(): number {
        return beatAvg;
    }

    //% subcategory="SpO2"
    //% blockId=SpO2BPM
    //% block="Value BPM"
    export function SpO2getBPM(): number {
        return beatsPerMinute;
    }

    //% subcategory="SpO2"
    //% blockId=SpO2Beat
    //% block="Measure Beat"
    export function SpO2MeasureBeat() {
        HeartRateByPBA();
    }

    //% subcategory="SpO2"
    //% blockId=SpO2BeatInit
    //% block="Measure Beat Init"
    export function SpO2MeasureBeatInit() {
        MAX30105_init();
        setPulseAmplitudeRed(0x0A); //Turn Red LED to low to indicate sensor is running
        lastBeat = control.millis(); //Time at which the last beat occurred
    }

    //% subcategory="SpO2"
    //% blockId=SpO2IR
    //% block="Value:IR"
    export function SpO2getIR(): number {
        return getIR();
    }

    //% subcategory="SpO2"
    //% blockId=SpO2Red
    //% block="Value:Red"
    export function SpO2getRed(): number {
        return getRed();
    }
    
    //% subcategory="SpO2"
    //% blockId=SpO2Light
    //% block="Measure Light"
    export function SpO2MeasureLight() {
        check();
    }

    //% subcategory="SpO2"
    //% blockId=initalSpO2
    //% block="Init SpO2"
    export function SpO2Init () {
        MAX30105_init();
    }

/*
    let redBuffer: number[] = [];  //red LED sensor data
    let an_y: number[] = []; //red
    let  an_ir_valley_locs: number[] = [];
    let an_ratio: number[] = [];
    const MA4_SIZE = 4;
    let cbuf: number[] = [];
    let rateSpot = 0;
    
    →　let cbuf　が
        function lowPassFIRFilter　の中で定義されていたら、グローバルに変更する。

    basic.showNumber(beatsPerMinute)
*/
/**/
    const MLX90614_I2CADDR = 90; //0x5A;
    const MLX90614_TA = 6; //0x06
    const MLX90614_TOBJ1 = 7; //0x07
    const MLX90614_EMISS = 36; //0x24
    
    //% subcategory="Temp"
    //% blockId=setEmiss
    //% block="Set Emissivity"
    export function TempSetEmiss(ereg: number) {
        i2cwrite(MLX90614_I2CADDR, MLX90614_EMISS, ereg * 65535);
    }
    //% subcategory="Temp"
    //% blockId=readEmiss
    //% block="Read Emissivity"
    export function TempReadEmiss(): number {
        i2creads(MLX90614_I2CADDR, MLX90614_EMISS, 3);
        let ereg = readbuf[0] + readbuf[1]<<8; 
        if (ereg == 0)
          return 0;
        return ereg / 65535.0;
    }

    //% subcategory="Temp"
    //% blockId=readTemp
    //% block="Read Temperature"
    export function TempReadTempC(): number {
        i2creads(MLX90614_I2CADDR, MLX90614_TOBJ1, 3);
        let temp = readbuf[0] + readbuf[1]<<8; 
        if (temp == 0)
          return 999;
        temp *= 0.02;
        temp -= 273.15;
        return temp;
    }

}

