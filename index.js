const fs = require("fs");
const path = require("path");
const ytdl = require("ytdl-core");
const progress = require("progress-stream");

const urlVideo = "https://www.youtube.com/watch?v=5QRRCerA22E";
const outputDirection = path.join(__dirname, "output");

(async function () {

  const info = await ytdl.getInfo(urlVideo);
  // const format = ytdl.chooseFormat(info.formats , {
  //   quality : "highestvideo"
  // })

  // console.log(format.qualityLabel);
  // console.log(format.itag);

  const videoName = info.player_response.videoDetails.title;
  const length = info.formats[0].contentLength;

  const videoQuality = "18";
  let videoQualityNameTag = "";

  switch (videoQuality) {
    case "18":
      videoQualityNameTag = "360p";
      break;
    case "44":
      videoQualityNameTag = "480p";
      break;
    case "22":
      videoQualityNameTag = "720p";
      break;

    case "248":
      videoQualityNameTag = "1080p";
      break;

    case "38":
      videoQualityNameTag = "4k";
      break;

    default:
      break;
  }

  const writeStream = fs.createWriteStream(outputDirection +  "/" + videoName + "-" + videoQualityNameTag + ".mp4");

  const ytldReturn = ytdl(urlVideo, {
    quality: videoQuality,
  });

  let streamProgress = progress({
    length: length,
    time: 500,
  });

  streamProgress.on("progress", (progress) => {
    console.clear();

    const toKB = (bytes, truncate = 3) => (bytes.toFixed(0) / 1024).toFixed(truncate);
    
    const porcentajeDescarga = progress.percentage.toFixed(0);
    const velocidadDescarga = toKB(progress.speed);
    const videoLength = toKB(progress.length, 0);
    const videolengthRemaining = toKB(progress.remaining);
    const promedioTiempoFaltante = (videolengthRemaining / velocidadDescarga).toFixed(0);

    console.log(":::: LIZ YOUDOWNLOAD :::::");
    console.log("");
    console.log(`⬇️ DESCARGANDO -> ${videoName}`);
    console.log(`↪ 🍷 Calidad : ${videoQualityNameTag}`);

    console.log(`↪ 🐋 Tamaño Total : ${videoLength} kb | ${(videoLength / 1024).toFixed(2)} mb`
    );
    console.log(`↪ 🙂 Faltante por descargar : ${videolengthRemaining} kb | ${(videolengthRemaining / 1024).toFixed(2)} mb`);
    console.log(`↪ ⏳ Promedio tiempo faltante : ${(promedioTiempoFaltante / 60 / 60).toFixed(0)} h | ${(promedioTiempoFaltante / 60).toFixed(0)} min | ${promedioTiempoFaltante} seg`);
    console.log(`↪ 🚀 Speed : ${velocidadDescarga} kB`);
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
