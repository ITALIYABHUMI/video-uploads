const express = require("express");
const multer = require("multer");
const path = require("path");
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(require('@ffmpeg-installer/ffmpeg').path);

const app = express();
const port = 7000;

app.set("view engine", "ejs");
app.use(express.urlencoded());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const file = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});

const videodata = multer({ storage: file }).single("video");

app.post('/formdata', videodata, (req, res) => {
  try {
    ffmpeg(`./uploads/${req.file.filename}`)
      .on('filenames', function (filenames) {
        console.log('Will generate ' + filenames.join(', '));
      })
      .on('end', function () {
        console.log('Processing finished successfully');
      })
      .on('error', function (err) {
        console.error('Error:', err);
      })
      .screenshot({
        folder: './uploads/',
        filename: Date.now()+'test.jpg',
        timestamps: ['5'], // Capture frame at 5 seconds
        size: '640x360', // Set the size of the captured frame
      });
      return res.redirect('back')
  } catch (e) {
    console.log(e.code);
    console.log(e.msg);
    return false;
  }
});

app.get('/', (req, res) => {
  return res.render('index');
});

app.listen(port, (err) => {
  if (err) {
    console.log(err);
    return false;
  }
  console.log("Server is working on port :" + port);
});
