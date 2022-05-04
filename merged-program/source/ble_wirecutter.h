/* mbed Microcontroller Library
 * Copyright (c) 2006-2013 ARM Limited
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

#include <events/mbed_events.h>
#include "ble/BLE.h"
#include "gatt_server_process.h"
#include "mbed-trace/mbed_trace.h"

static EventQueue event_queue(/* event count */ 10 * EVENTS_EVENT_SIZE);

class GattServerDemo : ble::GattServer::EventHandler {

    const static uint16_t EXAMPLE_SERVICE_UUID     = 0xA000;
    const static uint16_t WIRE_CHARACTERISTIC_UUID = 0xA001;

public:

    struct Config{
        uint8_t left;
        uint8_t factor;
        uint8_t rest;
        uint8_t right;
        uint8_t wire_amount;
        uint8_t reel_type;
        uint8_t reel_length;
        uint8_t reel_amount;
    };

    GattServerDemo()
    {
        const UUID uuid = WIRE_CHARACTERISTIC_UUID;
        _wire_characteristic = new ReadWriteGattCharacteristic<uint32_t[2]> (uuid, &_wire_characteristic_value);

        if (!_wire_characteristic) {
            printf("Allocation of wire ReadWriteGattCharacteristic failed\r\n");
        }
    }

    ~GattServerDemo()
    {
    }

    void start(BLE &ble, events::EventQueue &event_queue)
    {
        const UUID uuid = EXAMPLE_SERVICE_UUID;
        GattCharacteristic* charTable[] = { _wire_characteristic};
        GattService wire_cutting(uuid, charTable, 1);

        ble.gattServer().addService(wire_cutting);

        ble.gattServer().setEventHandler(this);

        printf("Example service added with UUID 0xA000\r\n");
        printf("Connect and write to characteristic for wires 0xA001\r\n");
        printf("Current mbed version: %d, %d %d", MBED_MAJOR_VERSION, MBED_MINOR_VERSION, MBED_PATCH_VERSION);
    }

    void onDataListener(mbed::Callback<void(Config)> onDataCallback) {
        this->onDataCallback = onDataCallback;
    }
    mbed::Callback<void(Config)> onDataCallback;
    
public:

    /**
     * This callback allows the LEDService to receive updates to the ledState Characteristic.
     *
     * @param[in] params Information about the characterisitc being updated.
     */
    virtual void onDataWritten(const GattWriteCallbackParams &params)
    {
        if (params.handle == _wire_characteristic->getValueHandle()) {
            left = params.data[0];
            factor = params.data[1];
            rest = params.data[2];
            right = params.data[3];
            wire_amount = params.data[4];
            reel_type = params.data[5];
            reel_length = params.data[6];
            reel_amount = params.data[7];
            // event_queue.call(fixData, params);
            Config config = { left, factor, rest, right, wire_amount, reel_type, reel_length, reel_amount};
            if(onDataCallback) {
                onDataCallback(config);
            }
        }
        // if (params.handle == _reel_characteristic->getValueHandle()) {
        //     type = params.data[0];
        //     length = params.data[1];
        //     reel_amount = params.data[2];
        //     // event_queue.call(fixData, params);
        //     Config config = { 0, 0, 0, 0, type, length, reel_amount };
        //     if(onDataCallback) {
        //         onDataCallback(config);
        //     }
        // }
    }

private:
    uint8_t left;
    uint8_t factor;
    uint8_t rest;
    uint8_t right;
    uint8_t wire_amount;
    uint8_t reel_type;
    uint8_t reel_length;
    uint8_t reel_amount;
    bool printQueued;
    bool valueWritten = false;
    ReadWriteGattCharacteristic<uint32_t[2]> *_wire_characteristic = nullptr;
    uint32_t _wire_characteristic_value[2] = {0,0};
};

// int * fixData( GattServerDemo::Config config ) {
//     int dataArray[] = {config.left, config.factor, config.rest, config.right, config.amount};

//     printf("Left: %d, Factor: %d, Rest: %d, Right: %d, Amount: %d\n", config.left, config.factor, config.rest, config.right, config.amount);
//     return(dataArray);
// }

// int main()
// {
//     mbed_trace_init();

//     BLE &ble = BLE::Instance();
//     GattServerDemo demo;
//     demo.onDataListener(callback(fixData));
//     /*Make object instances*/

//     printf("\r\nGattServer demo of a writable characteristic\r\n");

//     /* this process will handle basic setup and advertising for us */
//     GattServerProcess ble_process(event_queue, ble);

//     /* once it's done it will let us continue with our demo*/
//     ble_process.on_init(callback(&demo, &GattServerDemo::start));

//     ble_process.start();

//     return 0;
// }