const express = require("express");
// logging
const morgan = require("morgan");
const cors = require("cors");

//multer helps handle files
var multer = require("multer");

const path = require("path");
const fs = require("fs");
const url = require("url");

// gets the dir string to ROOT of project (ie up one folder)
const rootProjectFolder = __dirname;
const appBuildFolder = "/build";
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
    cb(console.log("error with destination in multer"), "content/quizzes");
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

var mediaStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(console.log("error with destination in multer"), "content/media");
  },
  filename: function(req, file, cb) {
    cb(
      console.log("error with filename in multer"),
      Date.now() + "-" + file.originalname
    );
  }
});

var moduleStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(console.log("error with destination in multer"), "content/modules");
  },
  filename: function(req, file, cb) {
    cb(
      console.log("error with filename in multer"),
      Date.now() + "-" + file.originalname
    );
  }
});

var checklistStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(console.log("error with destination in multer"), "content/checklists");
  },
  filename: function(req, file, cb) {
    cb(
      console.log("error with filename in multer"),
      Date.now() + "-" + file.originalname
    );
  }
});

var uploadQuizzes = multer({ storage: quizStorage }).array("file");
var uploadModules = multer({ storage: moduleStorage }).array("file");
var uploadChecklists = multer({ storage: checklistStorage }).array("file");
var uploadMedia = multer({ storage: mediaStorage }).array("file");

var foldersMap = {
  "/content/quizzes*": uploadQuizzes,
  "/content/modules*": uploadModules,
  "/content/checklists*": uploadChecklists,
  "/content/media*": uploadMedia
};

app.delete(Object.keys(foldersMap), function(req, res) {
  console.log("inside delete", req.url);

  var resultHandler = function(err) {
    if (err) {
      if (err.message.includes("ENOENT")) {
        console.log("unlink failed", err);
        console.log(req.url);
        // assume failure is due to resource not found?
        return res.status(404).send(req.file);
      }
      console.log("unlink failed", err);
      // assume failure is due to resource not found?

      return res.status(400).send(req.file);
    } else {
      console.log("file deleted");
      updateIndex(path.dirname(req.url));
      return res.status(200).send(req.file);
    }
  };

  // need to decodeURIcomponent to account for files with spaces that become '%20'
  const asset = path.parse("." + decodeURIComponent(req.url));
  fs.unlink(path.normalize(path.format(asset)), resultHandler);
  console.log("deleted:", path.normalize(path.format(asset)));
});

//no data needed, used for hiding vs unhiding
app.patch(Object.keys(foldersMap), function(req, res) {
  var resultHandler = function(err) {
    if (err) {
      if (err.message.includes("ENOENT")) {
        console.log("rename failed", err);
        console.log(req.url);
        // assume failure is due to resource not found?
        return res.status(404).send(req.file);
      }
      console.log("rename failed", err);
      // assume failure is due to resource not found?

      return res.status(400).send(req.file);
    } else {
      console.log("file renamed");
      updateIndex(path.dirname(req.url));
      return res.status(200).send(req.file);
    }
  };

  // need to decodeURIcomponent to account for files with spaces that become '%20'
  var filePath = "." + decodeURIComponent(req.url);
  var fileName = path.basename(filePath);
  var fileDir = path.dirname(filePath);
  if (fileName.includes("_hidden_")) {
    fileName = fileName.replace("_hidden_", "");
  } else {
    fileName = "_hidden_" + fileName;
  }
  var newFilePath = fileDir + "/" + fileName;

  fs.rename(
    path.normalize(filePath),
    path.normalize(newFilePath),
    resultHandler
  );
});

app.post(Object.keys(foldersMap), function(req, res) {
  console.log("inside post", req.url, foldersMap[req.url + "*"].name);
  foldersMap[req.url + "*"](req, res, function(err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }

    //keep index json updated
    updateIndex(req.url);
    return res.status(200).send(req.file);
  });
});

// app.post("/content/quizzes", function(req, res) {
//   uploadQuizzes(req, res, function(err) {
//     if (err instanceof multer.MulterError) {
//       return res.status(500).json(err);
//     } else if (err) {
//       return res.status(500).json(err);
//     }
//     //keep index json updated
//     updateIndex("/content/quizzes");
//     return res.status(200).send(req.file);
//   });
// });

//intercept requests for the index, and refresh it first.
app.get("*index.json", function(req, res) {
  //remove the index.json at the end!
  console.log("url is", req.url);
  var newUrl = path.dirname(req.url);
  console.log("url + dirname = ", req.url, path.dirname(req.url));
  res.sendFile(path.normalize(__dirname + req.url), function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Sent index:", path.normalize(__dirname + req.url));
    }
  });
  //removed this for now to debug

  // updateIndex(newUrl).then(function(result) {

  // });
});

// static content checked for last!
app.use(
  "/content",
  express.static("content"),
  serveIndex("content", { icons: true })
);

// for the create-react-app
app.use("/", express.static(clientBuildFolder));
// for the create-react-app
app.get("*", (req, res) => {
  console.log("inside catchall " + req.url);
  res.sendFile(path.join(clientBuildFolder, "/index.html"));
});

function updateIndex(directory) {
  var indexArray = [];
  const folder = path.parse("." + directory);
  // Loop through all the files in the temp directory
  return new Promise(function(resolve, reject) {
    fs.readdir(path.format(folder), function(err, files) {
      if (err) {
        console.error("Could not list the directory.", err);
        reject(Error("error in fs.readdir"));
      }
      files.forEach(function(file, index) {
        var ext = path.extname(file);
        if (ext === ".json") {
          // synchronised access since would need to wait for x numebr of async
          // operations to complete before continuing (each file has its own read)
          try {
            const fileContents = fs.readFileSync(
              path.normalize(__dirname + "/" + directory + "/" + file)
            );
            const data = JSON.parse(fileContents);
            var newObj = {};
            if (data.metadata !== undefined) {
              newObj.metadata = data.metadata;
            }
            newObj.filename = file;
            indexArray.push(newObj);
          } catch (err) {
            console.error(err);
          }
        } else {
          // not a json, so don't try adding metadata
          indexArray.push({ filename: file });
        }
      });
      var json = JSON.stringify(indexArray);

      // add proper callback here
      const indexPath = path.join(path.format(folder), "index.json");
      fs.writeFile(indexPath, json, function(err) {
        if (err) {
          console.log(err);
          reject(Error("error in fs.writefile"));
        }
        console.log("The index was updated!");
        resolve("index was updated successfully");
      });
    });
  });
}

//BELOW IS 1st ASYNC ATTEMPT for 2x functions

// //intercept requests for the index, and refresh it first.
// app.get("*index.json", function(req, res) {
//   //remove the index.json at the end!
//   console.log("url is", req.url);
//   var newUrl = path.dirname(req.url);
//   var promise = new Promise(function(resolve, reject) {
//     updateIndex(newUrl, () => {
//       resolve("index was updated successfully");
//     });
//   });

//   promise.then(function(result) {
//     res.sendFile(path.normalize(__dirname + req.url), function(err) {
//       if (err) {
//         console.log(err);
//       } else {
//         console.log("Sent index:", path.normalize(__dirname + req.url));
//       }
//     });
//   });
// });

// function updateIndex(directory, callback) {
//   var indexArray = [];
//   const folder = path.parse("." + directory);
//   // Loop through all the files in the temp directory
//   fs.readdir(path.format(folder), function(err, files) {
//     if (err) {
//       console.error("Could not list the directory.", err);
//       process.exit(1);
//     }

//     files.forEach(function(file, index) {
//       console.log("inside of updateIndex", file);
//       // change so that for JSONs, eg quizzes, it will get extra info like content name + information for the quiz page
//       // var file = JSON.parse(file);
//       indexArray.push({ filename: file });
//     });

//     var json = JSON.stringify(indexArray);

//     // add proper callback here
//     const indexPath = path.join(path.format(folder), "index.json");
//     fs.writeFile(indexPath, json, function(err) {
//       if (err) {
//         return console.log(err);
//       }

//       console.log("The index was updated!");
//       callback();
//     });
//   });
// }

///BELOW IS SYNCHRONOUS VERSION

// //intercept requests for the index, and refresh it first.
// app.get("*index.json", function(req, res) {
//   //remove the index.json at the end!
//   console.log("url is", req.url);
//   var newUrl = path.dirname(req.url);
//   updateIndex(newUrl);
//   var stats = fs.statSync(path.normalize(__dirname + req.url));
//   var fileSizeInBytes = stats["size"];

//   res.set("Content-Length", fileSizeInBytes.toString());
//   console.log("filesize", fileSizeInBytes.toString());
//   res.sendFile(path.normalize(__dirname + req.url), function(err) {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log("Sent index:", path.normalize(__dirname + req.url));
//     }
//   });
// });
// function updateIndex(directory) {
//   var indexArray = [];
//   const folder = path.parse("." + directory);
//   // Loop through all the files in the temp directory
//   // used synchronous since otherwise we got race conditions when trying to update
//   var files = fs.readdirSync(path.format(folder));
//   files.forEach(file => {
//     console.log("inside of updateIndex", file);
//     // change so that for JSONs, eg quizzes, it will get extra info like content name + information for the quiz page
//     // var file = JSON.parse(file);
//     indexArray.push({ filename: file });
//   });

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

// listens on port that node gives OR 8000 for eg testing
const port = process.env.PORT || 8000;
app.listen(port);

console.log(`FES Express listening on ${port}`);
