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
app.options("*", cors()); // include before other routes
cors({ credentials: true, origin: true });

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

var users = { FesAdmin: "FesAdminPassword" };

var passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy;
var cookieParser = require("cookie-parser");
var session = require("express-session");
var bodyParser = require("body-parser");
app.use(cookieParser());
app.use(bodyParser());
app.use(session({ secret: "keyboard cat" }));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(
  new LocalStrategy(function(username, password, done) {
    console.log(
      "username is ",
      username,
      "password is",
      password,
      "correct password is",
      users[username]
    );
    if (users[username]) {
      if (users[username] === password) {
        //success, logged in
        console.log("Authenticated successfully");
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
  console.log("are we authenticated?");
  if (req.isAuthenticated()) {
    console.log("yes we authenticated");
    return next();
  }
  console.log("we not authenticated");
  res.redirect("/login");
}

app.get("/login", function(req, res) {
  res.sendFile(path.join(rootProjectFolder, "/login.html"));
});

app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

app.post("/login", passport.authenticate("local"), function(req, res) {
  // If this function gets called, authentication was successful.
  // `req.user` contains the authenticated user.
  res.redirect("/");
});

app.delete(Object.keys(foldersMap), ensureAuthenticated, function(req, res) {
  console.log("!!!!!!!!!!!!!!!recieved a delete");
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
app.patch(Object.keys(foldersMap), ensureAuthenticated, function(req, res) {
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
//shows server contents for debugging etc
app.use(
  "/content",
  express.static("content"),
  serveIndex("content", { icons: true })
);

// for the create-react-app
app.use("/", ensureAuthenticated, express.static(clientBuildFolder));
// for the create-react-app
app.get("*", ensureAuthenticated, (req, res) => {
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

// listens on port that node gives OR 8000 for eg testing
const port = process.env.PORT || 8000;
app.listen(port);

console.log(`FES Express Server listening on ${port}`);
