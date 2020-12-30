const five = require("johnny-five");
const board = new five.Board({
  debug: true,
});

const pins = Object.freeze({
  photocell: "A0",
  buzzer: 8,
  relay: 7,
});
const brightnessTarget = 100;

function beep() {
  const buzzer = new five.Pin(pins.buzzer);
  buzzer.write(0);
  setTimeout(() => {
    buzzer.write(1);
  }, 500);
}

board.on("ready", function () {
  console.log("Board is ready!");
  beep();
  const photocell = new five.Light(pins.photocell);
  const relay = new five.Relay(pins.relay);

  let isOn = false;
  const callBeep = (mode) => {
    if (typeof mode !== "boolean") throw Error("mode must be boolean!");
    if (mode !== isOn) {
      beep();
      isOn = mode;
    }
  };

  photocell.on("change", function () {
    const brightness = this.value; // 0 - 1000

    if (brightness < brightnessTarget) {
      relay.open();
      callBeep(false);
    } else {
      relay.close();
      callBeep(true);
    }
  });
});