#pragma once
#include "steppermotor.h"

class Wirecutter {

    public:
        Wirecutter();

    public:
        void feedCable(int length);
        void cutCable();
        void stripCable();

    private:
        Steppermotor cableFeeder;
        Steppermotor cableCutter;
};
