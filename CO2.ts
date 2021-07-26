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

    const MAX30105_ADDRESS = 0x57; //7-bit I2C Address

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

    const STORAGE_SIZE = 25; //Each long is 4 bytes so limit this to fit on your micro

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

    function i2cread(addr: number, reg: number): number{
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE);
        return pins.i2cReadNumber(addr, NumberFormat.UInt8BE);
        //let X
        //let buf = pins.createBufferFromArray([X]) // ex. [X, Y, Z]
        //buf = pins.i2cReadBuffer(addr, 1)
        //return buf[0]
    }

    function i2creads(addr: number, reg: number, size: number) {
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE);
        let buf = pins.i2cReadBuffer(addr, size)
        return buf;
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

    function getWritePointer() {
        return (i2cread(MAX30105_ADDRESS, MAX30105_FIFOWRITEPTR));
    }
    
    //Read the FIFO Read Pointer
    function getReadPointer() {
        return (i2cread(MAX30105_ADDRESS, MAX30105_FIFOREADPTR));
    }
    
    function readTemperature() {
        i2cwrite(MAX30105_ADDRESS, MAX30105_DIETEMPCONFIG, 0x01);
    
        /*
        unsigned long startTime = system_timer_current_time();
        while (system_timer_current_time() - startTime < 100) {
            uint8_t response = readRegister8(MAX30105_ADDRESS, MAX30105_INTSTAT2);
            if ((response & MAX30105_INT_DIE_TEMP_RDY_ENABLE) > 0) break; //We're done!
            fiber_sleep(1); //Let's not over burden the I2C bus
        }
        */
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
    
    function available() {
      let numberOfSamples = sense_head - sense_tail;
      if (numberOfSamples < 0) numberOfSamples += STORAGE_SIZE;
    
      return (numberOfSamples);
    }

    function getRed() {
        //if(safeCheck(250)){
            return sense_red[sense_head];
        //}
        //else
        //    return(0); //Sensor failed to find new data
    }
    
    function getIR() {
        //if(safeCheck(250))
            return (sense_IR[sense_head]);
        //else
        //    return(0); //Sensor failed to find new dat
    }

    function getGreen() {
        //if(safeCheck(250))
            return (sense_green[sense_head]);
        //else
        //    return(0); //Sensor failed to find new data
    }
    
    function nextSample() {
        if(available()) { //Only advance the tail if new data is available
            sense_tail++;
            sense_tail %= STORAGE_SIZE; //Wrap condition
            return true;
        } else {
            return false;
        }
    }

    function check() {
        //Read register FIDO_DATA in (3-uint8_t * number of active LED) chunks
        //Until FIFO_RD_PTR = FIFO_WR_PTR

        let readPointer = getReadPointer();
        let writePointer = getWritePointer();
        let numberOfSamples = 0;

        //Do we have new data?
        if (readPointer != writePointer) {
            //Calculate the number of readings we need to get from sensor
            numberOfSamples = writePointer - readPointer;
            if (numberOfSamples < 0) numberOfSamples += I2C_BUFFER_LENGTH; //Wrap condition

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
                    //temp = i2creads(MAX30105_ADDRESS, MAX30105_FIFODATA, toGet);
                    for (let led = 0; led < activeDiodes; led++) {
                        checkOffset = led * 3;
                        temp[checkOffset] = i2cread(MAX30105_ADDRESS, MAX30105_FIFODATA);
                    }
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
                        */
                        tempLong = (temp[checkOffset]<<16 | temp[1 + checkOffset]<<8 | temp[2 + checkOffset] ) & 0x3FFFF;
                        switch (led)
                        {
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
        let ledMode = 2; //Options: 1 = Red only, 2 = Red + IR, 3 = Red + IR + Green
    
        let sampleRate = 100; //Options: 50, 100, 200, 400, 800, 1000, 1600, 3200
        let pulseWidth = 411; //Options: 69, 118, 215, 411
        let adcRange = 4096; //Options: 2048, 4096, 8192, 16384

        setup(ledBrightness, sampleAverage, ledMode, sampleRate, pulseWidth, adcRange); //Configure sensor with these settings
    }
    
    let IR_AC_Max = 20;
    let IR_AC_Min = -20;
    
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


    function averageDCEstimator(x: number)  {
        ir_avg_reg += (((x << 15) - ir_avg_reg) >> 4);
        return (ir_avg_reg >> 15);
    }

    function lowPassFIRFilter(din: number) { 
        cbuf[offset] = din;
        let z = FIRCoeffs[11] * cbuf[(offset - 11) & 0x1F];
        
        for (let i = 0 ; i < 11 ; i++) {
            z += FIRCoeffs[i] * cbuf[(offset - i) & 0x1F] + cbuf[(offset - 22 + i) & 0x1F];
        }
        offset++;
        offset %= 32; //Wrap condition

        return(z >> 15);
    }

    function checkForBeat(sample: number)
    {
      let beatDetected = false;
    
      IR_AC_Signal_Previous = IR_AC_Signal_Current;
    
      IR_Average_Estimated = averageDCEstimator(&ir_avg_reg, sample);
      IR_AC_Signal_Current = lowPassFIRFilter(sample - IR_Average_Estimated);
    
      if ((IR_AC_Signal_Previous < 0) && (IR_AC_Signal_Current >= 0)) {
      
        IR_AC_Max = IR_AC_Signal_max; //Adjust our AC max and min
        IR_AC_Min = IR_AC_Signal_min;
    
        positiveEdge = 1;
        negativeEdge = 0;
        IR_AC_Signal_max = 0;
    
        if ((IR_AC_Max - IR_AC_Min) > 20 && (IR_AC_Max - IR_AC_Min) < 1000) {
          //Heart beat!!!
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
    //% blockId=initalSpO2
    //% block="Init SpO2"
    export function SpO2Init () {
        MAX30105_init();
    }

}