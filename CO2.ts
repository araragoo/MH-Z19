// https://github.com/araragoo/CO2

//% weight=5 color=#0fbc11 icon="\uf112" block="CO2"
namespace CO2 {

    let CO2data = 400
    let buf  = control.createBuffer(9)
    let buf0 = control.createBuffer(9)

    //  subcategory="CO2"
    //% blockId=initalCO2
    //% block="Init CO2"
    export function initCO2 () {
    }

    //  subcategory="CO2"
    //% blockId=measureCO2
    //% block="CO2[ppm]"
    export function measuredValue () {
    }

    //  subcategory="CO2"
    //% blockId=setOffset
    //% block="Set CO2 value as 400ppm"
    export function setOffset () {
    }
}

