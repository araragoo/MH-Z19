// https://github.com/araragoo/MH-Z19

//% weight=5 color=#0fbc11 icon="\uf112" block="Measurement"
namespace CO2 {

    let CO2data = 400
    let buffer = pins.createBuffer(9)
    let cmd_get = pins.createBuffer(9)
    let cmd_zero_cal = pins.createBuffer(9)
    let cmd_span_cal = pins.createBuffer(9)
    let cmd_auto_on = pins.createBuffer(9)
    let cmd_auto_off = pins.createBuffer(9)

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
    //% block="Init CO2 AutoCalibraton ON:1 OFF:0 %onoff"
    //% onoff.min=1 onoff.max=1 onoff.defl=1
    export function CO2Init(onoff: number) {
        basic.pause(1000)
        serial.redirect(
            SerialPin.P8, //tx
            SerialPin.P12, //rx
            BaudRate.BaudRate9600
        )
        cmd_get.setNumber(NumberFormat.UInt8LE, 0, 255)
        cmd_get.setNumber(NumberFormat.UInt8LE, 1, 1)
        cmd_get.setNumber(NumberFormat.UInt8LE, 2, 134)
        cmd_get.setNumber(NumberFormat.UInt8LE, 3, 0)
        cmd_get.setNumber(NumberFormat.UInt8LE, 4, 0)
        cmd_get.setNumber(NumberFormat.UInt8LE, 5, 0)
        cmd_get.setNumber(NumberFormat.UInt8LE, 6, 0)
        cmd_get.setNumber(NumberFormat.UInt8LE, 7, 0)
        cmd_get.setNumber(NumberFormat.UInt8LE, 8, 121)

        cmd_zero_cal.setNumber(NumberFormat.UInt8LE, 0, 255)
        cmd_zero_cal.setNumber(NumberFormat.UInt8LE, 1, 1)
        cmd_zero_cal.setNumber(NumberFormat.UInt8LE, 2, 135)
        cmd_zero_cal.setNumber(NumberFormat.UInt8LE, 3, 0)
        cmd_zero_cal.setNumber(NumberFormat.UInt8LE, 4, 0)
        cmd_zero_cal.setNumber(NumberFormat.UInt8LE, 5, 0)
        cmd_zero_cal.setNumber(NumberFormat.UInt8LE, 6, 0)
        cmd_zero_cal.setNumber(NumberFormat.UInt8LE, 7, 0)
        cmd_zero_cal.setNumber(NumberFormat.UInt8LE, 8, 120)

        cmd_auto_on.setNumber(NumberFormat.UInt8LE, 0, 255)
        cmd_auto_on.setNumber(NumberFormat.UInt8LE, 1, 1)
        cmd_auto_on.setNumber(NumberFormat.UInt8LE, 2, 121)
        cmd_auto_on.setNumber(NumberFormat.UInt8LE, 3, 160)
        cmd_auto_on.setNumber(NumberFormat.UInt8LE, 4, 0)
        cmd_auto_on.setNumber(NumberFormat.UInt8LE, 5, 0)
        cmd_auto_on.setNumber(NumberFormat.UInt8LE, 6, 0)
        cmd_auto_on.setNumber(NumberFormat.UInt8LE, 7, 0)
        cmd_auto_on.setNumber(NumberFormat.UInt8LE, 8, 230)

        cmd_auto_off.setNumber(NumberFormat.UInt8LE, 0, 255)
        cmd_auto_off.setNumber(NumberFormat.UInt8LE, 1, 1)
        cmd_auto_off.setNumber(NumberFormat.UInt8LE, 2, 121)
        cmd_auto_off.setNumber(NumberFormat.UInt8LE, 3, 0)
        cmd_auto_off.setNumber(NumberFormat.UInt8LE, 4, 0)
        cmd_auto_off.setNumber(NumberFormat.UInt8LE, 5, 0)
        cmd_auto_off.setNumber(NumberFormat.UInt8LE, 6, 0)
        cmd_auto_off.setNumber(NumberFormat.UInt8LE, 7, 0)
        cmd_auto_off.setNumber(NumberFormat.UInt8LE, 8, 134)

        if (onoff==1) {
            serial.writeBuffer(cmd_auto_on)
        } else {
            serial.writeBuffer(cmd_auto_off)
        }
    }
}





