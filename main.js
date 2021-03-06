var synth = flock.synth({
   synthDef: {
     id: "moogy",
     ugen: "flock.ugen.filter.biquad.bp",
     freq: 1000,
     q: .6,
     mul: 2.0,
     source : {
       id: "verb",
      ugen: "flock.ugen.freeverb",
      source : {
                id: "synthy",
                ugen: "flock.ugen.dust",
                density: 0.0,
                mul: 0.0
            },
      }

   }
});


var udpPort = new osc.UDPPort({
    localAddress: "127.0.0.1",
    localPort: 3123
});

udpPort.on("open", function () {
    document.getElementById("message").innerText = "Listening for UDP on port " + udpPort.options.localPort;
});

udpPort.on("message", function(message){

  if (message.args.length === 4){
    synth.set("synthy.density", message.args[0]*100 + 20);
    synth.set("synthy.mul", message.args[2]);
    synth.set("verb.room", message.args[0]);
    synth.set("verb.mix", message.args[1]);
    synth.set("moogy.freq", mtof( message.args[3] ));


    // soundplane guarantees one zero value z for each touch to allow for noteoffs
    if(message.args[2] === 0){
      //console.log("note off " + message.address);
    }
     document.getElementById("message").innerText = message.address + '\n' + message.args;
  }
});

udpPort.on("error", function (err) {
    throw new Error(err);
});

function mtof(m){
  return Math.pow(2, (m - 69)/12 ) * 440;
};


udpPort.open();
synth.play();