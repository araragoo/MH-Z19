// https://github.com/araragoo/CO2

//% weight=5 color=#0fbc11 icon="\uf112" block="CO2"
namespace CO2 {

    let CO2data = 400
    let buf = pins.createBuffer(9);

    //  subcategory="CO2"
    //% blockId=measureCO2
    //% block="CO2[ppm]"
    export function measuredValue () {
        buf.setNumber(NumberFormat.UInt8LE, 0, 255)
        buf.setNumber(NumberFormat.UInt8LE, 1,   1)
        buf.setNumber(NumberFormat.UInt8LE, 2, 134)
        buf.setNumber(NumberFormat.UInt8LE, 3,   0)
        buf.setNumber(NumberFormat.UInt8LE, 4,   0)
        buf.setNumber(NumberFormat.UInt8LE, 5,   0)
        buf.setNumber(NumberFormat.UInt8LE, 6,   0)
        buf.setNumber(NumberFormat.UInt8LE, 7,   0)
        buf.setNumber(NumberFormat.UInt8LE, 8, 121)
        serial.writeBuffer(buf)
        basic.pause(100)
        buffer = serial.readBuffer(9)
        if (buffer.getNumber(NumberFormat.UInt8LE, 0) == 255 && buffer.getNumber(NumberFormat.UInt8LE, 1) == 134) {
            sum = 0
            for (let index = 0; index <= 7; index++) {
                sum = sum + buffer.getNumber(NumberFormat.UInt8LE, i)
            }
//            if (buffer.getNumber(NumberFormat.UInt8LE, 8) == sum % 255) {
                value = buffer.getNumber(NumberFormat.UInt8LE, 2) * 255 + buffer.getNumber(NumberFormat.UInt8LE, 3)
//            }
        }

        return value
    }

    //  subcategory="CO2"
    //% blockId=setOffset
    //% block="Set CO2 value as 400ppm"
    export function setOffset () {
        buf.setNumber(NumberFormat.UInt8LE, 0, 255)
        buf.setNumber(NumberFormat.UInt8LE, 1,   1)
        buf.setNumber(NumberFormat.UInt8LE, 2, 135)
        buf.setNumber(NumberFormat.UInt8LE, 3,   0)
        buf.setNumber(NumberFormat.UInt8LE, 4,   0)
        buf.setNumber(NumberFormat.UInt8LE, 5,   0)
        buf.setNumber(NumberFormat.UInt8LE, 6,   0)
        buf.setNumber(NumberFormat.UInt8LE, 7,   0)
        buf.setNumber(NumberFormat.UInt8LE, 8, 120)
        serial.writeBuffer(buf)
    }
}

