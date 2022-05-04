#include "steppermotor.h"

Steppermotor::Steppermotor(PinName step, PinName dir, int speed) : stepPin(step), dirPin(dir) {
    _speed = speed;
}

void Steppermotor::setDirection(std::string direction) {
    if (direction == "clockwise") {
        dirPin = 1;
    }
    else {
        dirPin = 0;
    }
}

void Steppermotor::rotate(int steps) {
    for (int i=0; i<steps; i++) {
        stepPin = 1;
        wait_us(_speed);
        stepPin = 0;
        wait_us(_speed);
    }
}
