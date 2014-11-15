flock.init();

fluid.registerNamespace("flork");

flork.florkplane2 = function() {

    var that = {
        // http://stackoverflow.com/questions/7686197/how-can-i-avoid-autorepeated-keydown-events-in-javascript
        synthvoice : {},

        synth : flock.synth.polyphonic({
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
                        },

                      }
        })
    };


    that.mtof = function (m){
        return Math.pow(2, (m - 69)/12 ) * 440;
    };

    // OSC setup

    that.udpPort = new osc.UDPPort({
      localAddress: "127.0.0.1",
      localPort: 3123
    });

    that.udpPort.on("open", function () {
      document.getElementById("message").innerText = "Listening for UDP on port " + udpPort.options.localPort;
    });

    that.udpPort.on("error", function (err) {
      throw new Error(err);
    });

    that.udpPort.on("message", function(message){

      if (message.args.length === 4){
      /*
        synth.set("synthy.density", message.args[0]*100 + 20);
        synth.set("synthy.mul", message.args[2]);
        synth.set("verb.room", message.args[0]);
        synth.set("verb.mix", message.args[1]);
        synth.set("moogy.freq", mtof( message.args[3] ));
*/

        // soundplane guarantees one zero value z for each touch to allow for noteoffs
        if(message.args[2] === 0){
            //console.log("note off " + message.address);
        }
        document.getElementById("message").innerText = message.address + '\n' + message.args;
      }
    });

    that.init = function (){

        document.getElementById("message").innerText = "Waiting for UDP";



        that.udpPort.open();
        flock.enviro.shared.play();
    };

    that.init();
    return that;
}


$(function () {
    window.florkplane2 = flork.florkplane2();
});
