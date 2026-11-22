// A low-resolution courtroom portrait, painted back to front.
const ctx = document.querySelector('canvas').getContext('2d');
function rect(color,x,y,w,h){ctx.fillStyle=color;ctx.fillRect(x,y,w,h)}
function shape(color,points){ctx.fillStyle=color;ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fill()}
rect('#352638',0,0,320,106);
for(const x of [16,76,136,196,256]){
 shape('#684453',[[x,87],[x,30],[x+23,3],[x+46,30],[x+46,87]]);
 shape('#bd7464',[[x+4,84],[x+4,32],[x+23,10],[x+42,32],[x+42,84]]);
 rect('#eeae79',x+7,44,32,28);rect('#784953',x+21,14,4,70);rect('#784953',x+4,40,38,4);
 rect('#4f3544',x-5,0,5,90)
}
rect('#744c49',0,74,320,26);
shape('#261f30',[[102,103],[111,79],[139,67],[175,66],[205,79],[218,103]]);
shape('#614357',[[112,97],[121,79],[140,73],[150,97]]);
shape('#f4cf9b',[[140,70],[178,70],[160,98]]);
shape('#943e49',[[153,78],[166,78],[162,85],[165,91],[159,97],[155,90],[158,84]]);
for(const flip of [false,true]){
 const poly=(c,p)=>shape(c,p.map(([x,y])=>[flip?320-x:x,y]));
 poly('#281f30',[[144,39],[124,33],[112,18],[115,2],[124,17],[141,21],[151,32]]);
 poly('#e2b082',[[142,32],[127,28],[116,16],[116,8],[123,20],[141,24]]);
 poly('#ad5555',[[143,45],[118,35],[124,49],[142,57]]);
}
shape('#ab4e50',[[134,32],[146,23],[174,23],[186,34],[182,58],[170,73],[151,76],[136,61]]);
shape('#d57564',[[138,34],[148,27],[168,27],[164,41],[158,45],[155,56],[143,57]]);
for(const x of [139,164]){rect('#382636',x,40,15,3);rect('#ffd780',x+3,44,10,3);rect('#332633',x+7,44,2,3)}
shape('#673641',[[160,44],[165,55],[155,55]]);
rect('#552e39',147,60,25,3);rect('#ffe1af',149,60,3,5);rect('#ffe1af',168,60,3,4);
rect('#ab7560',0,94,320,3);rect('#4c333a',0,97,320,9);
