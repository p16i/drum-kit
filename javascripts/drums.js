

// Position Variables
var x = 0;
var y = 0;
var z = 0;

// Speed - Velocity
var vx = 0;
var vy = 0;
var vz = 0;

// Acceleration
var ax = 0;
var ay = 0;
var az = 0;
var ai = 0;
var arAlpha = 0;
var arBeta = 0;
var arGamma = 0;

var delay = 10;

var alpha = 0;
var beta = 0;
var gamma = 0;

var threshold = -999;
var already_kick = false;
var prev_beta = 999;
var slack = 0.3;
var rthresold = -5;

function Kick(context) {
  this.context = context;
};

Kick.prototype.setup = function() {
};

Kick.prototype.trigger = function() {
  this.osc = this.context.createOscillator();
  this.gain = this.context.createGain();
  this.osc.connect(this.gain);
  this.gain.connect(this.context.destination)

  console.log('Kick trigger ')

  time = this.context.currentTime;
  /*
  if( time - this.kicked_time < 0.8 ){
    return;
  }
  */
  console.log(time)

  this.osc.frequency.setValueAtTime(150, time);
  this.gain.gain.setValueAtTime(1, time);

  this.osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.5);
  this.gain.gain.exponentialRampToValueAtTime(0.01, time + 0.5);


  this.osc.start(time);
  this.kicked_time = time;
  this.osc.stop(time + 0.5);
  console.log(this.context.currentTime);
};


var context = new AudioContext();


window.kick  = new Kick(context);
kick.setup();

$('.kick-button').on("click", function(){
    kick.trigger();
});

if (window.DeviceMotionEvent==undefined) {
    document.getElementById("no").style.display="block";
    document.getElementById("yes").style.display="none";
}
else {
    window.ondevicemotion = function(event) {
        ax = Math.round(Math.abs(event.accelerationIncludingGravity.x * 1));
        ay = Math.round(event.accelerationIncludingGravity.y * 1*10)/10;
        az = Math.round(Math.abs(event.accelerationIncludingGravity.z * 1));
        ai = Math.round(event.interval * 10) / 10;
        rR = event.rotationRate;
        if (rR != null) {
            arAlpha = Math.round(rR.alpha);
            arBeta = Math.round(rR.beta);


            arGamma = Math.round(rR.gamma);
        }


/*
        ax = Math.abs(event.acceleration.x * 1000);
        ay = Math.abs(event.acceleration.y * 1000);
        az = Math.abs(event.acceleration.z * 1000);
*/
    }

    window.ondeviceorientation = function(event) {
        alpha = Math.round(event.alpha);
        beta = Math.round(event.beta*100)/100;
        gamma = Math.round(event.gamma);

        projected_beta = beta+arBeta*delay/(100*10)
        var diff = projected_beta-threshold;
        $('#gap').text(diff);
        if( diff < slack){
            if(!already_kick){
                kick.trigger();
                already_kick = true;
                prev_beta = projected_beta
                $('#previous-beta').text(prev_beta);
            }
        }

        if( projected_beta > -3.5 ) {
             already_kick =false;
        }

        document.getElementById("xlabel").innerHTML = "X: " + ax;
        document.getElementById("ylabel").innerHTML = "Y: " + ay;
        document.getElementById("zlabel").innerHTML = "Z: " + az;
        document.getElementById("ilabel").innerHTML = "I: " + ai;
        document.getElementById("arAlphaLabel").innerHTML = "arA: " + arAlpha;
        document.getElementById("arBetaLabel").innerHTML = "arB: " + arBeta;
        document.getElementById("arGammaLabel").innerHTML = "arG: " + arGamma;
        document.getElementById("alphalabel").innerHTML = "Alpha: " + alpha;
        document.getElementById("betalabel").innerHTML = "Beta: " + beta;
        document.getElementById("gammalabel").innerHTML = "Gamma: " + gamma;

        $('#calibrate-beta').val(beta);
        $('#already-kicked').text(already_kick);
    }

    $('#calibrate').on('click', function(elem){
        threshold = $('#calibrate-beta').val();
        $('#remembered-beta').text(threshold);
    });
}


