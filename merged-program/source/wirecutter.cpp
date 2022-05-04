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
    cableCutter.rotate(630);
    cableCutter.setDirection("counterclockwise");
    cableCutter.rotate(630);
}

void Wirecutter::stripCable() {
    cableCutter.setDirection("clockwise");
    cableCutter.rotate(606);
    cableCutter.setDirection("counterclockwise");
    cableCutter.rotate(606);
}
