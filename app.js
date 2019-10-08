// ffmpeg の実行
const exec = require('child_process').exec;
exec("ffplay -probesize 32 -sync ext udp://0.0.0.0:11111", (err, stdout, stderr) => {
    console.log(stdout);
    console.log(stderr);
});


// 環境変数ロード
const dotenv = require("dotenv");
dotenv.config();

const speech = require("@google-cloud/speech");
const client = new speech.SpeechClient();

const encoding = "LINEAR16";
const sampleRateHertz = 16000;
const languageCode = "ja-JP";

const request = {
    config: {
	encoding: encoding,
	sampleRateHertz: sampleRateHertz,
	languageCode: languageCode
    },
    interimResults: false
};

const recognizeStream = client
      .streamingRecognize(request)
      .on("error", console.error)
      .on("data", data => {
	  if (data.results[0] && data.results[0].alternatives[0]) {
	      console.log(`< transcript: ${data.results[0].alternatives[0].transcript}`);
	      tello(data.results[0].alternatives[0].transcript);
	  }
	  else {
	      console.log(`\n\nReached transcription time limit, press Ctrl+C\n`);
	  }
      });

const record = require("node-record-lpcm16");
record
    .record({
	sampleRateHertz: sampleRateHertz,
	threshold: 0,
	verbose: false,
	recordProgram: "sox",
	silence: "10.0",
    })
    .stream()
    .on("error", console.error)
    .pipe(recognizeStream);

console.log("Listening, press Ctrl+C to stop.");

const telloPort = 8889;
const telloAddress = "192.168.10.1";
const dgram = require("dgram");

// telloからの受信
const udpSocket = dgram.createSocket("udp4", (msg, rinfo) => {
    console.log(msg.toString("ascii", 0, rinfo.size));
});
udpSocket.bind(telloPort, "0.0.0.0");

// 音声認識結果からtelloへ命令
const tello = (transcript) => {
    let command = "";
    if (transcript.match("離陸")) {
	commandToTello("command");
	commandToTello("streamon");
	commandToTello("takeoff");
	return
    }
    if (transcript.match("着陸")) {
	commandToTello("land");
	commandToTello("streamoff");
	return 
    }
    if (transcript.match("前") || transcript.match("全身")) {
	commandToTello("forward 50");
	return 
    }
    if (transcript.match("後") || transcript.match("交代") || transcript.match("交替") || transcript.match("抗体")) {
	commandToTello("back 50");
	return
    }
    if (transcript.match("右")) {
	commandToTello("cw 90");
	return
    }
    if (transcript.match("左")) {
	commandToTello("ccw 90");
	return
    }
    if (transcript.match("上")) {
	commandToTello("up 50");
	return
    }
    if (transcript.match("下") || transcript.match("舌") || transcript.match("した") ||
	transcript.match("加工") || transcript.match("火口")) {
	commandToTello("down 50");
	return
    }
};

const commandToTello = (command) => {
    console.log(`> command: ${command}`);
    const message = new Buffer.from(command);
    udpSocket.send(message, 0, message.length, telloPort, telloAddress, (err, bytes) => {
	if (err) throw err;
    });
}
