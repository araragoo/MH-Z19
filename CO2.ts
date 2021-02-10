// https://github.com/araragoo/CO2

//% weight=5 color=#0fbc11 icon="\uf112" block="CO2"
namespace CO2 {

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



	/**
	* Initializes the gator:particle sensor, must be called on power up
	*/	
	//% weight=30 
	//% blockId="gatorParticle_begin" 
	//% block="initialize gator:Particle sensor"
	export function begin(){
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

