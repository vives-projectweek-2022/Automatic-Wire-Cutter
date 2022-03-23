
var minx = new Array();
var maxx = new Array();
var strt = new Array();
var fact = new Array();
var initial = new Array();
var bb,aa = new Array();

var wirecutter;

var buffer = new ArrayBuffer(8);
var z = new Uint8Array(buffer, 0, 5);

function resetSlideRules() {
  var u = initial.length;
  for (i=0; i<u; i++)  initSlideRule(i,strt[i],fact[i],initial[i]);
}
function initSlideRule(nr,start,factor,begin) {
  var t = document.getElementById("SlideRuleButtonContainer_"+nr).style;
  minx[nr] = parseInt(t.left); maxx[nr] = minx[nr] + parseInt(t.width);
  strt[nr] = start; fact[nr] = factor; initial[nr] = begin;
  moveSlideRule(nr,begin);
}

function changeSlideRule(nr) {
  var t = parseInt(document.getElementById("SlideRuleField_"+nr).value);
  if (isNaN(t)) {
    if ( t != "-" && t != "+") {document.getElementById("SlideRuleField_"+nr).value = '0'; t = 0;}
  }
  t -= strt[nr];
  bb = Math.floor(minx[nr]/fact[nr]); if (t < bb) t = bb;
  bb = Math.floor(maxx[nr]/fact[nr]); if (t > bb) t = bb;
  moveSlideRule(nr,t);
}
function moveSlideRule(nr,nw) {
  document.getElementById("SlideRuleButton_"+nr).style.left = nw*fact[nr]+'px';
  document.getElementById("SlideRuleField_"+nr).value = nw + strt[nr];
}

var temp1, temp2, help;
var dragapproved = false;
var z,x,y;

document.addEventListener("mousemove", move, false)

function move(e) {
  if (dragapproved) {
    help = temp1 + e.clientX-x;
    z.style.left = help + "px";
    aa = z.id.split('_'); bb = aa[1];
    var zl = parseInt(z.style.left);
    if (zl < minx[bb]) z.style.left = minx[bb] + 'px';
    if (zl > maxx[bb]) z.style.left = maxx[bb] + 'px';
    document.getElementById('SlideRuleField_'+bb).value = Math.floor(parseInt(z.style.left)/fact[bb]) +strt[bb];
    return false;
  }
}

function drags(e) {
  var firedobj = e.target;

  if (firedobj.className == "SlideRuleButton") {
    dragapproved = true;
    z = firedobj;
    temp1 = parseInt(z.style.left+0);
    temp2 = parseInt(z.style.top+0);
    x = e.clientX;
    y = e.clientY;
    return false;
  }
}


function resetDragApproved() { dragapproved = false }

document.onmousedown = drags;
document.onmouseup = resetDragApproved;
window.onload = resetSlideRules;

var bluetoothDevice;

function onScanButtonClick() {
  let options = {filters: []};

  let filterService = 0xA000;
  if (filterService) {
    options.filters.push({services: [filterService]});
  }

  let filterName = 'GattServer';
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
  if(wirecutter) {

    let LeftStripped = document.getElementById('SlideRuleField_0').value;
    let middleNotStrippedRest = (document.getElementById('SlideRuleField_1').value % 256);
    let middleNotStrippedFactor = Math.floor(document.getElementById('SlideRuleField_1').value / 256);
    let RightStripped = document.getElementById('SlideRuleField_2').value;
    let amount2 = document.getElementById('amount').value;

    var int8;
    console.log(LeftStripped, middleNotStrippedFactor, middleNotStrippedRest, RightStripped, amount2);
    int8 = Uint8Array.from([LeftStripped, middleNotStrippedFactor, middleNotStrippedRest, RightStripped, amount2]);
    wirecutter.writeValue(int8);
    console.log(int8);
  }

}