const express = require("express");
// logging
const morgan = require("morgan");
const cors = require("cors");

//multer helps handle files
var multer = require("multer");

const path = require("path");
const fs = require("fs");
const appBuildFolder = "/my-test-app/build";
// gets the dir string to ROOT of project (ie up one folder)
const rootProjectFolder = path.dirname(__dirname);
const clientBuildFolder = path.join(rootProjectFolder, appBuildFolder);

const app = express();
app.use(morgan("tiny"));
//set cors to allow all cross sites to use api (eg localhost:5000)
app.use(cors());

// can visit eg localhost:8000/content to view dir structure
var serveIndex = require("serve-index");

//NOTE the 'post' methods need to be located above the static retrieval methods,
// else get a 405 error since tries to 'get' put its 'post' request
var quizStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "content/quizzes");
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

var uploadQuizzes = multer({ storage: quizStorage }).array("file");

app.delete("/content/quizzes*", function(req, res) {
  console.log("inside delete", req.url);

  var resultHandler = function(err) {
    if (err) {
      if (err.message.includes("ENOENT")) {
        console.log("unlink failed", err);
        // assume failure is due to resource not found?
        return res.status(404).send(req.file);
      }
      console.log("unlink failed", err);
      // assume failure is due to resource not found?
      return res.status(400).send(req.file);
    } else {
      console.log("file deleted");
      return res.status(200).send(req.file);
    }
  };

  //currently working on this, need to change './c' to use 'path' from unix?
  const asset = path.parse("." + req.url);
  console.log("about to call unlink", asset);
  fs.unlink(path.format(asset), resultHandler);
  console.log("called unlink");
});

app.post("/content/quizzes", function(req, res) {
  uploadQuizzes(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }
    return res.status(200).send(req.file);
  });
});

app.use(
  "/content",
  express.static("content"),
  serveIndex("content", { icons: true })
);

// Create a multer instance and set the destination folder.
// The code below uses /public folder. You can also assign a new file name upon upload.
// The code below uses ‘originalfilename’as the file name.

// // Serve static files from the React app
// app.use("/app", express.static(clientBuildFolder));

// // Put all API endpoints under '/api'
// app.get("/api/quizzes", (req, res) => {
//   // Return them as json

//   fs.readFile("content/QuizJson.json", (err, data) => {
//     if (err) throw err;

//     let quizzes = JSON.parse(data);
//     res.json(quizzes);
//     console.log(`Sent quizzes as: \n ${quizzes} `);
//   });
// });

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.

// app.get("*", (req, res) => {
//   console.log(
//     "inside catchall 2" +
//       req.url +
//       " new url -app =:" +
//       req.url.replace("/app", "")
//   );
//   res.sendFile(path.join(clientBuildFolder, req.url.replace("/app", "")));
// });

// app.get("*", (req, res) => {
//   console.log("inside catchall " + req.url);
//   res.sendFile(path.join(clientBuildFolder, "/index.html"));
// });

// console.log(
//   "dirname is",
//   __dirname,

//   "root proj folder is",
//   rootProjectFolder,
//   "clientbuildfolder is",
//   clientBuildFolder
// );

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
// app.get("*", (req, res) => {
//   res.sendFile(path.join(clientBuildFolder, "index.html"));
//   console.log("sent homepage");
// });

const port = process.env.PORT || 8000;
app.listen(port);

console.log(`FES Express listening on ${port}`);
