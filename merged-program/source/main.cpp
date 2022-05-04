//mbed compile -f --sterm --baudrate 115200

#include "mbed.h"
#include <iostream>
#include "wirecutter.h"
#include "ble_wirecutter.h"
#include <math.h>

using namespace std;

DigitalOut enable(D8);
DigitalIn modeSelector(PB_0);
DigitalOut vcc(PB_1);
static BufferedSerial pc(USBTX, USBRX, 115200);

Wirecutter wirecutter;

int convertmmToSteps(int mm) {
  return round(mm * 47.8469);
}

void printWire( GattServerDemo::Config config ) {
    enable = 0;
    if (config.wire_amount)
    {
        printf("Wire:\nLeft: %d, Factor: %d, Rest: %d, Right: %d, Amount: %d\n", config.left, config.factor, config.rest, config.right, config.wire_amount);
        printf("Reel:\nType: %d, Length: %d, Amount: %d", config.reel_type, config.reel_length, config.reel_amount);
        wirecutter.cutCable();
        for (uint8_t i = 0; i < config.wire_amount; i++)
        {
            wirecutter.feedCable(convertmmToSteps(config.left));
            wirecutter.stripCable();
            wirecutter.feedCable(convertmmToSteps((config.factor * 256) + config.rest));
            wirecutter.stripCable();
            wirecutter.feedCable(convertmmToSteps(config.right));
            wirecutter.cutCable();
        }
    }
    // if (config.reel_amount)
    // {
    //     printf("Type: %d, Length: %d, Amount: %d\n", config.type, config.length, config.reel_amount);

    //     for (uint8_t i = 0; i < config.reel_amount; i++)
    //     {
    //         wirecutter.feedReel(config.length*config.type);
    //         wirecutter.cutCable();
    //     }
    // }
}

int main(void) {
    vcc = 1;
    while (1)
    {
        if(modeSelector == 0) {
            mbed_trace_init();
            BLE &ble = BLE::Instance();
            GattServerDemo demo;
            demo.onDataListener(callback(printWire));
            /*Make object instances*/

            printf("\r\nGattServer demo of a writable characteristic\r\n");

            /* this process will handle basic setup and advertising for us */
            GattServerProcess ble_process(event_queue, ble);

            /* once it's done it will let us continue with our demo*/
            ble_process.on_init(callback(&demo, &GattServerDemo::start));

            ble_process.start();
        }
        char buf[32] = {0};
        if (uint32_t num = pc.read(buf, sizeof(buf))) {
            // for (int i = 0; i < 32; i++)
            // {
            //     cout << i << ": "<< buf[i] << endl;
            // }
            
            int left = (int)buf[0]*100 + (int)buf[1]*10 + (int)buf[2];
            // cout << left << endl;
            int middle = (int)buf[6]*1000 + (int)buf[7]*100 + (int)buf[8]*10 + (int)buf[9];
            // cout << middle << endl;
            int factor = middle/256;
            int rest = middle%256;
            int right = (int)buf[3]*100 + (int)buf[4]*10 + (int)buf[5];
            // cout << right << endl;
            uint8_t wire_amount = (int)buf[10]*100 + (int)buf[11]*10 + (int)buf[12];
            uint8_t reel_type = 0;
            uint8_t reel_length = 0;
            uint8_t reel_amount = 0;
            GattServerDemo::Config config = { left, factor, rest, right, wire_amount, reel_type, reel_length, reel_amount};
            printf("%d, %d, %d, %d", left, middle, right, wire_amount);
            printWire(config);
        }
    }
    

// #include "mbed.h"

// InterruptIn button(PC_13);


// void callback()
// {
//     //place behavior here
// }

// int main()
// {
//     button.rise(&callback);
//     while (true);
// }

    // wirecutter.feedCable(500);
    // ThisThread::sleep_for(chrono::milliseconds(2000));
    // wirecutter.stripCable();
    // ThisThread::sleep_for(chrono::milliseconds(2000));
    // wirecutter.feedCable(2000);
    // ThisThread::sleep_for(chrono::milliseconds(2000));
    // wirecutter.stripCable();
    // ThisThread::sleep_for(chrono::milliseconds(2000));
    // wirecutter.feedCable(500);
    // ThisThread::sleep_for(chrono::milliseconds(2000));
    // wirecutter.cutCable();
    // ThisThread::sleep_for(chrono::milliseconds(2000));

}
