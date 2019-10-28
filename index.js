/* This is the express server code. Express does double duty:
  1) hosts the CMS Create React App
  2) serves files / modifies them (Provides the API)
*/

const express = require("express");
// logging
const morgan = require("morgan");
const cors = require("cors");
//multer helps handle files
const multer = require("multer");
const path = require("path");
const fs = require("fs");
// gets the dir string to root of project, names it so more understandable
const rootProjectFolder = __dirname;
// name of the folder containing the CRA files once we 'build'
const appBuildFolder = "/build";
//location of the build folder
const clientBuildFolder = path.join(rootProjectFolder, appBuildFolder);
// can visit eg serverURL/content to view dir structure, helpful for debugging
var serveIndex = require("serve-index");

// users for the application
var users = { FesAdmin: "FesAdminPassword" };

var passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy;
var cookieParser = require("cookie-parser");
var session = require("express-session");
var bodyParser = require("body-parser");

// starting express
const app = express();
app.use(morgan("tiny"));

//set cors to allow all cross sites to use api (eg localhost:5000)
app.use(cors());
app.options("*", cors()); // include before other routes
cors({ credentials: true, origin: true });

/*-----------------------Configure Multer (Storage)---------------------------*/
//configure storage for multer (file storage wrapper)
//one multer storage per content folder.
var quizStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(console.error("error with destination in multer"), "content/quizzes");
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

var mediaStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(console.error("error with destination in multer"), "content/media");
  },
  filename: function(req, file, cb) {
    cb(
      console.error("error with filename in multer"),
      Date.now() + "-" + file.originalname
    );
  }
});

var moduleStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(console.error("error with destination in multer"), "content/modules");
  },
  filename: function(req, file, cb) {
    cb(
      console.error("error with filename in multer"),
      Date.now() + "-" + file.originalname
    );
  }
});

var checklistStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(console.error("error with destination in multer"), "content/checklists");
  },
  filename: function(req, file, cb) {
    cb(
      console.error("error with filename in multer"),
      Date.now() + "-" + file.originalname
    );
  }
});

var uploadQuizzes = multer({ storage: quizStorage }).array("file");
var uploadModules = multer({ storage: moduleStorage }).array("file");
var uploadChecklists = multer({ storage: checklistStorage }).array("file");
var uploadMedia = multer({ storage: mediaStorage }).array("file");

// contains all accessible content folders, and the associated multer storage
var foldersMap = {
  "/content/quizzes*": uploadQuizzes,
  "/content/modules*": uploadModules,
  "/content/checklists*": uploadChecklists,
  "/content/media*": uploadMedia
};

/*----------------Configure Passport.js (authentication) ---------------------*/
app.use(cookieParser());
app.use(bodyParser());
app.use(session({ secret: "keyboard cat" }));
app.use(passport.initialize());
app.use(passport.session());

//serialising/deserialisng user function is required, trivial for this case
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

// set up the strategy to use. This is where you'd replace the strategy with
// one that used a database with users if you wanted to do so
passport.use(
  new LocalStrategy(function(username, password, done) {
    if (users[username]) {
      if (users[username] === password) {
        //success, logged in
        return done(null, username);
      } else {
        return done(null, false, { message: "Incorrect password." });
      }
    } else {
      //no user exists
      return done(null, false, { message: "User does not exist" });
    }
  })
);

//used to redirect if not authenticated with passport
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

/*-------------------------Express Routing -----------------------------------*/
// key API routes are protected with the ensureAuthenticated function (using passport.js)
// 'get' routes for content folders are not protected, get routes for CRA files are

//login.logout pages
app.get("/login", function(req, res) {
  res.sendFile(path.join(rootProjectFolder, "/login.html"));
});
app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/login");
});

app.post("/login", passport.authenticate("local"), function(req, res) {
  // If this function gets called, authentication was successful.
  // `req.user` contains the authenticated user.
  res.redirect("/");
});

//delete a content file from the server
app.delete(Object.keys(foldersMap), ensureAuthenticated, function(req, res) {
  var resultHandler = function(err) {
    if (err) {
      if (err.message.includes("ENOENT")) {
        console.error("unlink failed", err);
        // assume failure is due to resource not found?
        return res.status(404).send(req.file);
      }
      console.error("unlink failed", err);
      // assume failure is due to resource not found?

      return res.status(400).send(req.file);
    } else {
      updateIndex(path.dirname(req.url));
      return res.status(200).send(req.file);
    }
  };

  // need to decodeURIcomponent to account for files with spaces that become '%20'
  const asset = path.parse("." + decodeURIComponent(req.url));
  fs.unlink(path.normalize(path.format(asset)), resultHandler);
});

//no data needed, used for hiding vs unhiding
app.patch(Object.keys(foldersMap), ensureAuthenticated, function(req, res) {
  var resultHandler = function(err) {
    if (err) {
      if (err.message.includes("ENOENT")) {
        console.error("rename failed", err);
        // assume failure is due to resource not found?
        return res.status(404).send(req.file);
      }
      console.error("rename failed", err);
      // assume failure is due to resource not found?

      return res.status(400).send(req.file);
    } else {
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

// add new content to the server
app.post(Object.keys(foldersMap), function(req, res) {
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

//intercept requests for an index
app.get("*index.json", function(req, res) {
  //remove the index.json at the end!
  res.sendFile(path.normalize(__dirname + req.url), function(err) {
    if (err) {
      console.error(err);
    }
  });
});

// routes for serving static content come last (only if didn't match another route)

// shows actual server contents for debugging etc (eg if you suspect the index.json
// isn't in sync with the folder structure...)
// this is accessible without authentication, but cannot be used to delete/modify files
app.use(
  "/content",
  express.static("content"),
  serveIndex("content", { icons: true })
);

// for the create-react-app
app.use("/", ensureAuthenticated, express.static(clientBuildFolder));

// for the create-react-app
app.get("*", ensureAuthenticated, (req, res) => {
  res.sendFile(path.join(clientBuildFolder, "/index.html"));
});

// function for updating the index of a content folder after some API operatin has
// occurred (eg a file deleted/uploaded etc)
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
      const indexPath = path.join(path.format(folder), "index.json");
      fs.writeFile(indexPath, json, function(err) {
        if (err) {
          console.error(err);
          reject(Error("error in fs.writefile"));
        }
        resolve("index was updated successfully");
      });
    });
  });
}

// listens on port that node gives OR 8000 for eg testing
const port = process.env.PORT || 8000;
app.listen(port);

console.log(`FES CMS Express Server listening on ${port}`);
