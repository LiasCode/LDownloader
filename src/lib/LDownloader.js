const fs = require("fs");
const path = require("path");
const ytdl = require("ytdl-core");
const progress = require("progress-stream");
const readline = require("readline");
const { stdin, stdout } = require("process");

let readLineInterface;

const question = (newQuestion = "") => {
  readLineInterface = readline.createInterface({
    input: stdin,
    output: stdout,
  });

  return new Promise((resolve, reject) => {
    if (!newQuestion) {
      reject("No question maked");
    }
    readLineInterface.question(newQuestion, (answer) => {
      resolve(answer);
    });
  });
};

(async function () {
  console.clear();

  const urlVideo = await question("Inserte la URL del video -> ");
  readLineInterface.close();

  const outputDirection = process.cwd() + "/output";

  if (!fs.existsSync(outputDirection)) {
    fs.mkdirSync(outputDirection);
  }

  console.log({ outputDirection });

  const info = await ytdl.getInfo(urlVideo);

  const formatsAvaible = info.formats
    .map((el) => {
      const {
        qualityLabel,
        hasAudio,
        hasVideo,
        container,
        audioQuality,
        itag,
        contentLength,
      } = el;

      return {
        qualityLabel,
        hasAudio,
        hasVideo,
        container,
        audioQuality,
        itag,
        contentLength,
      };
    })
    .filter((el) => el.hasAudio && el.hasVideo);

  console.log("Formatos Permitidos");

  formatsAvaible.forEach((el, index) => {
    console.log(index + " -> " + el.qualityLabel);
  });

  const answer = await question("Elija calidad de descarga : ");
  readLineInterface.close();

  const FormatSelected = formatsAvaible[answer];

  const videoName = info.player_response.videoDetails.title;
  const length = FormatSelected.contentLength;

  const videoQuality = FormatSelected.itag;
  let videoQualityNameTag = FormatSelected.qualityLabel;

  const writeStream = fs.createWriteStream(
    outputDirection +
      "/" +
      videoName +
      "-" +
      videoQualityNameTag +
      "." +
      FormatSelected.container
  );

  let tamanoDescargado = 0;

  const ytldReturn = ytdl(urlVideo, {
    quality: videoQuality,
  }).on("data", (chunk) => {
    tamanoDescargado += chunk.length;
  });

  let streamProgress = progress({
    length: length,
    time: 500,
  });

  streamProgress.on("progress", (progress) => {
    console.clear();

    const toKB = (bytes, truncate = 3) =>
      (bytes.toFixed(0) / 1024).toFixed(truncate);

    const porcentajeDescarga = progress.percentage.toFixed(0);
    const velocidadDescarga = toKB(progress.speed);
    const videoLength = toKB(progress.length, 0);
    const videolengthRemaining = toKB(progress.remaining);
    const promedioTiempoFaltante = (
      videolengthRemaining / velocidadDescarga
    ).toFixed(0);

    console.log(":::: LIZ YOUDOWNLOAD :::::");
    console.log("");
    console.log(`⬇️ DESCARGANDO -> ${videoName}`);
    console.log(`↪ 🍷 Calidad : ${videoQualityNameTag}`);

    if (!tamanoDescargado) {
      console.log(
        `↪ 🐋 Tamaño Total : ${videoLength} kb | ${(videoLength / 1024).toFixed(
          2
        )} mb`
      );
      console.log(
        `↪ 🙂 Faltante por descargar : ${videolengthRemaining} kb | ${(
          videolengthRemaining / 1024
        ).toFixed(2)} mb`
      );
      console.log(
        `↪ ⏳ Promedio tiempo faltante : ${(
          promedioTiempoFaltante /
          60 /
          60
        ).toFixed(0)} h | ${(promedioTiempoFaltante / 60).toFixed(
          0
        )} min | ${promedioTiempoFaltante} seg`
      );
    } else {
      console.log(
        `↪ 🙂 Total Descargado : ${toKB(tamanoDescargado)} kb | ${(
          toKB(tamanoDescargado) / 1024
        ).toFixed(2)} mb`
      );
    }
    console.log(`↪ 🚀 Speed : ${velocidadDescarga} kB/s`);
    console.log(`↪ 🏃 Progress : ${porcentajeDescarga} %`);
  });

  ytldReturn
    .pipe(streamProgress)
    .pipe(writeStream)
    .once("finish", () => {
      console.log("");
      console.log("✅ Video Descargado 🎉🎉");
    });
})();
