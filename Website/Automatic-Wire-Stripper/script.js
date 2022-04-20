
var minx = new Array();
var maxx = new Array();
var strt = new Array();
var fact = new Array();
var initial = new Array();
var bb,aa = new Array();

var wirecutter;
var reelcutter;

var buffer = new ArrayBuffer(8);
var z = new Uint8Array(buffer, 0, 5);
var bluetoothDevice;

// function maxvalue(){
//   const numberregex = "\b([1-9]|[1-9][0-9]|100)\b";
//   numberregex.match(LeftStripped.value)
//   if(numberregex.match(LeftStripped.value)==false){
//     alert("wrong");
//   }
//   numberregex.match(middleNotStrippedFactor.value)
//   if(numberregex.match(middleNotStrippedFactor.value)==false){
//     alert("wrong");
//   }
//   numberregex.match(middleNotStrippedRest.value)
//   if(numberregex.match(middleNotStrippedRest.value)==false){
//     alert("wrong");
//   }
//   numberregex.match(RightStripped.value)
//   if(numberregex.match(RightStripped.value)==false){
//     alert("wrong");
//   }
//   numberregex.match(amount2.value)
//   if(numberregex.match(amount2.value)==false){
//     alert("wrong");
//   }
// }

function onScanButtonClick() {

  let options = {filters: []};

  let filterService = 0xA000;
  if (filterService) {
    options.filters.push({services: [filterService]});
  }

  let filterName = 'WireCutter';
  if (filterName) {
    options.filters.push({name: filterName});
  }

  let filterNamePrefix = '';
  if (filterNamePrefix) {
    options.filters.push({namePrefix: filterNamePrefix});
  }

  bluetoothDevice = null;
  console.log('Requesting Bluetooth Device...');
  navigator.bluetooth.requestDevice(options)
  .then(device => device.gatt.connect())
  .then(server => server.getPrimaryService(0xA000))
  .then(service => service.getCharacteristic(0xA001))
  .then(characteristic => {
    wirecutter = characteristic;
    return;
  })
  .catch(error => {
    console.log('Argh! ' + error);
  });
}

function connect() {
  console.log('Connecting to Bluetooth Device...');
  return bluetoothDevice.gatt.connect()
  .then(server => {
    console.log('> Bluetooth Device connected');
  });
}

function onDisconnectButtonClick() {
  if (!bluetoothDevice) {
    return;
  }
  console.log('Disconnecting from Bluetooth Device...');
  if (bluetoothDevice.gatt.connected) {
    bluetoothDevice.gatt.disconnect();
  } else {
    console.log('> Bluetooth Device is already disconnected');
  }
}

function writeToCharacteristic() {
  if (!bluetoothDevice) {
    return;
  }
  console.log('Sending to Bluetooth device...');
  if (bluetoothDevice.gatt.connected) {
    bluetoothDevice.gatt.write();
  } else {
    console.log('> Bluetooth Device is disconnected');
  }
}

function startCutting() {
   if (wirecutter) {
     let LeftStripped = document.getElementById('leftInput').value;
     let middleNotStrippedRest = (document.getElementById('middleInput').value % 256);
     let middleNotStrippedFactor = Math.floor(document.getElementById('middleInput').value / 256);
     let RightStripped = document.getElementById('rightInput').value;
     let amount2 = document.getElementById('amountInput').value;
     var int8;
     console.log(LeftStripped, middleNotStrippedFactor, middleNotStrippedRest, RightStripped, amount2);
     int8 = Uint8Array.from([LeftStripped, middleNotStrippedFactor, middleNotStrippedRest, RightStripped, amount2]);
     wirecutter.writeValue(int8);
     console.log(int8);
  }
}
// function startCuttingreel() {
//   if(wirecutter) {
//     let code = document.getElementById('left').value;
//     let middleNotStrippedRest = document.getElementById('middle').value % 256;
//     let middleNotStrippedFactor = Math.floor(document.getElementById('middle').value / 256);
//     let RightStripped = document.getElementById('right').value;
//     let amount2 = document.getElementById('amount').value;
//     var int8;
//     console.log(LeftStripped, middleNotStrippedFactor, middleNotStrippedRest, RightStripped, amount2);
//     int8 = Uint8Array.from([LeftStripped, middleNotStrippedFactor, middleNotStrippedRest, RightStripped, amount2]);
//     wirecutter.writeValue(int8);
//     console.log(int8);
//   }
// }
