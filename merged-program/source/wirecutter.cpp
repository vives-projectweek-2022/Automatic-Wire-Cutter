#include "wirecutter.h"

Wirecutter::Wirecutter() : cableFeeder(D2, D5, 75), cableCutter(D3, D6, 1000) {
    cableFeeder.setDirection("counterclockwise");
    //wait_us(500000);
}

void Wirecutter::feedCable(int length) {
    cableFeeder.rotate(length);
}

void Wirecutter::cutCable() {
    cableCutter.setDirection("clockwise");
    cableCutter.rotate(660);
    cableCutter.setDirection("counterclockwise");
    cableCutter.rotate(660);
}

void Wirecutter::stripCable() {
    cableCutter.setDirection("clockwise");
    cableCutter.rotate(625);
    cableCutter.setDirection("counterclockwise");
    cableCutter.rotate(625);
}
