// https://github.com/araragoo/QTechCarPad

//% weight=5 color=#0fbc11 icon="\uf112" block="Insect"
namespace Car {

    let initialized = false

    let prev_x = 0
    let prev_y = 0

    let rotation_x = 0
    let rotation_y = 0
    let distanceData = 0

    let aCount  = 0
    let bCount  = 0
    let abCount = 0
    let p0Count = 0
    let p1Count = 0
    let p2Count = 0

    radio.onReceivedString(
        function (receivedString) {
            if ("a".compare(receivedString.charAt(0)) == 0) {
                aCount += 1
            } else if ("b".compare(receivedString.charAt(0)) == 0) {
                bCount += 1
            } else if ("ab".compare(receivedString.substr(0, 2)) == 0) {
                abCount += 1
            } else if ("p0".compare(receivedString.substr(0, 2)) == 0) {
                p0Count += 1
            } else if ("p1".compare(receivedString.substr(0, 2)) == 0) {
                p1Count += 1
            } else if ("p2".compare(receivedString.substr(0, 2)) == 0) {
                p2Count += 1
            } else if ("x".compare(receivedString.charAt(0)) == 0) {
                distanceData = parseFloat(receivedString.substr(1, receivedString.length-1))
            }
        }
    )



    //% subcategory="Move"
    //% blockId=setRgtFwd block="RgtFwd speed:0<=>90 %speed"
    //% speed.min=0 speed.max=90 speed.defl=0
    export function RgtFwd(speed: number): void {
        radio.sendString("r" + "0" + "1" + convertToText(speed / 2))
        radio.sendString("r" + "1" + "0" + convertToText(speed))
    }

    //% subcategory="Move"
    //% blockId=setFwd block="Fwd speed:0<=>90 %speed"
    //% speed.min=0 speed.max=90 speed.defl=0
    export function Fwd(speed: number): void {
        radio.sendString("r" + "0" + "1" + convertToText(speed))
        radio.sendString("r" + "1" + "0" + convertToText(speed))
    }

    //% subcategory="Move"
    //% blockId=setLftFwd block="LftFwd speed:0<=>90 %speed"
    //% speed.min=0 speed.max=90 speed.defl=0
    export function LftFwd(speed: number): void {
        radio.sendString("r" + "0" + "1" + convertToText(speed))
        radio.sendString("r" + "1" + "0" + convertToText(speed / 2))
    }

    //% subcategory="Move"
    //% blockId=setRgt block="Rgt speed:0<=>90 %speed"
    //% speed.min=0 speed.max=90 speed.defl=0
    export function Rgt(speed: number): void {
        radio.sendString("r" + "0" + "0" + convertToText(speed))
        radio.sendString("r" + "1" + "0" + convertToText(speed))
    }

    //% subcategory="Move"
    //% blockId=setStp block="Stp"
    export function Stp(): void {
        radio.sendString("r" + "0" + "0" + "0" )
        radio.sendString("r" + "1" + "0" + "0" )
    }

    //% subcategory="Move"
    //% blockId=setLft block="Lft speed:0<=>90 %speed"
    //% speed.min=0 speed.max=90 speed.defl=0
    export function Lft(speed: number): void {
        radio.sendString("r" + "0" + "1" + convertToText(speed))
        radio.sendString("r" + "1" + "1" + convertToText(speed))
    }

    //% subcategory="Move"
    //% blockId=setRgtBwd block="RgtBwd speed:0<=>90 %speed"
    //% speed.min=0 speed.max=90 speed.defl=0
    export function RgtBwd(speed: number): void {
        radio.sendString("r" + "0" + "0" + convertToText(speed / 2))
        radio.sendString("r" + "1" + "1" + convertToText(speed))
    }
    //% subcategory="Move"
    //% blockId=setBwd block="Bwd speed:0<=>90 %speed"
    //% speed.min=0 speed.max=90 speed.defl=0
    export function Bwd(speed: number): void {
        radio.sendString("r" + "0" + "0" + convertToText(speed))
        radio.sendString("r" + "1" + "1" + convertToText(speed))
    }

    //% subcategory="Move"
    //% blockId=setLftBwd block="LftBwd speed:0<=>90 %speed"
    //% speed.min=0 speed.max=90 speed.defl=0
    export function LftBwd(speed: number): void {
        radio.sendString("r" + "0" + "0" + convertToText(speed))
        radio.sendString("r" + "1" + "1" + convertToText(speed / 2))
    }



    //% subcategory="Motor"
    //% blockId=setMotorR block="Motor Right speed:-90<=>90 %speed"
    //% speed.min=-90 speed.max=90
    export function MotorR(speed: number): void {
        if(speed > 0)
            radio.sendString("r" + "0" + "0" + convertToText( speed))
        else
            radio.sendString("r" + "0" + "1" + convertToText(Math.abs(speed)))
    }

    //% subcategory="Motor"
    //% blockId=setMotorL block="Motor Left speed:-90<=>90 %speed"
    //% speed.min=-90 speed.max=90
    export function MotorL(speed: number): void {
        if(speed > 0)
            radio.sendString("r" + "1" + "0" + convertToText(speed))
        else
            radio.sendString("r" + "1" + "1" + convertToText(Math.abs(speed)))
    }



    //% subcategory="LED"
    //% blockId=setLEDblue block="LED blue Voltage:0<=>100 %v"
    //% v.min=0 v.max=100
    export function LEDblue(v: number): void {
        radio.sendString("b" + convertToText(v))
    }



    //% subcategory="Switch"
    //% blockId=swDistance block="Distance(cm)"
    export function distance(): number {
        return distanceData
    }



    //% subcategory="Switch"
    //% blockId=swA block="A"
    export function A(): number {
        return aCount
    }

    //% subcategory="Switch"
    //% blockId=swB block="B"
    export function B(): number {
        return bCount
    }

    //% subcategory="Switch"
    //% blockId=swAB block="AB"
    export function AB(): number {
        return abCount
    }

    //% subcategory="Switch"
    //% blockId=swP0 block="P0"
    export function P0(): number {
        return p0Count
    }

    //% subcategory="Switch"
    //% blockId=swP1 block="P1"
    export function P1(): number {
        return p1Count
    }

    //% subcategory="Switch"
    //% blockId=swP2 block="P2"
    export function P2(): number {
        return p2Count
    }



    //% subcategory="LCD"
    //% blockId="show_lines"
    //% block="show lines %text"
    export function showLiens(text: string): void {
        radio.sendString("d" + "0" + text)
    }

    //% subcategory="LCD"
    //% blockId="show_line_1"
    //% block="show line1 %text"
    export function showLine1(text: string): void {
        radio.sendString("d" + "1" + text)
    }

    //% subcategory="LCD"
    //% blockId="show_line_2"
    //% block="show line2 %text"
    export function showLine2(text: string): void {
        radio.sendString("d" + "2" + text)
    }



    //% subcategory="Music"
    //% blockId=setMusicDog block="Dog's song"
    export function musicDog(): void {
        radio.sendString("s0")
    }

    //% subcategory="Music"
    //% blockId=setMusicCat block="Cat's song"
    export function musicCat(): void {
        radio.sendString("s1")
    }



    //% subcategory="Pad"
    //% blockId=setRadio block="radio Group:1<=>83 %n"
    //% n.min=1 n.max=83 n.defl=1
    export function radioGroup(n: number): void {
        radio.setGroup(n)
    }

    //% subcategory="Pad"
    //% blockId=setRotX block="rotation X:-2<=0=>2"
    export function rotX(): number {
        let x
        x = input.rotation(Rotation.Roll)
        x = x / 10
        x = x + 0
        if (x < -1) {
            x = -2
        } else {
            if (x < 0) {
                x = -1
            } else {
                if (x < 1) {
                    x = 0
                } else {
                    if (x < 2) {
                        x = 1
                    } else {
                        x = 2
                    }
                }
            }
        }
        rotation_x = x
        return rotation_x
    }

    //% subcategory="Pad"
    //% blockId=setRotY block="rotation Y:-2<=0=>2"
    export function rotY(): number {
        let y
        y = input.rotation(Rotation.Pitch)
        y = y / 10
        y = y
        if (y < -1) {
            y = -2
        } else {
            if (y < 0) {
                y = -1
            } else {
                if (y < 1) {
                    y = 0
                } else {
                    if (y < 2) {
                        y = 1
                    } else {
                        y = 2
                    }
                }
            }
        }
        rotation_y = -y
        return rotation_y
    }



    //% subcategory="Pad"
    //% blockId=setDispSlope block="Display LED for Slope X, Y"
    export function dispSlope() {
        basic.clearScreen()
        led.plot(rotX()+2, -rotY()+2)
    }

}
