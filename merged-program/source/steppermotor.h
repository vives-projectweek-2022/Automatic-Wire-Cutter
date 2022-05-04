#pragma once
#include "mbed.h"

class Steppermotor {

    public:
        Steppermotor(PinName step, PinName dir, int speed);

    public:
        void setDirection(std::string direction);
        void rotate(int steps);

    private:
        DigitalOut stepPin;
        DigitalOut dirPin;
        int _speed;
};
