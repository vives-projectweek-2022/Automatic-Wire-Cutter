
var minx = new Array();
var maxx = new Array();
var strt = new Array();
var fact = new Array();
var initial = new Array();
var bb,aa = new Array();

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

function startCutting(){
  var LeftStripped = document.getElementById('SlideRuleField_0').value;
  var middleNotStripped = document.getElementById('SlideRuleField_1').value;
  var RightStripped = document.getElementById('SlideRuleField_2').value;
  var amount2 = document.getElementById('amount').value;
  console.log(LeftStripped);
  console.log(middleNotStripped);
  console.log(RightStripped);
  console.log(amount2);
}

function resetDragApproved() { dragapproved = false }

document.onmousedown = drags;
document.onmouseup = resetDragApproved;
window.onload = resetSlideRules;
