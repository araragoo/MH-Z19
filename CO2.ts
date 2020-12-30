// https://github.com/araragoo/CO2

//% weight=5 color=#0fbc11 icon="\uf112" block="CO2"
namespace CO2 {

    let CO2data

    //% subcategory="CO2"
    //% blockId=measCO2 block="CO2[ppm]"
    export function measureCO2 () {
        serial.writeString("" + ([255, 1, 134, 0, 0, 0, 0, 0, 121]))
        basic.pause(100)
        data = serial.readBuffer(9)
        if (data[0] == 255 && data[1] == 134) {
            sum = 0
            for (let index = 0; index <= 7; index++) {
                sum = sum + data[index]
            }
            if (data[8] == sum % 255) {
                CO2data = data[2] * 255 + data[3]
            }
        }
        return CO2data
    }

    //% subcategory="CO2"
    //% blockId=initCO2 block="CO2 Zero = 400ppm"
    export function initZeroCO2 () {
        serial.writeString("" + ([255, 1, 135, 0, 0, 0, 0, 0, 120]))
    }
}

