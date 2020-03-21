const express = require("express");
const app = express();

const compression = require("compression");
const bodyParser = require("body-parser");
const { hash, compare } = require("./bc.js");
const db = require("./db");

const cryptoRandomString = require("crypto-random-string");
const ses = require("./ses.js");
const s3 = require("./s3.js");

const server = require("http").Server(app);
const io = require("socket.io")(server, { origins: "localhost:8080" });

//////////////////////////////////////////////////

//// do not touch!

const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");

const diskStorage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, __dirname + "/uploads");
  },
  filename: function(req, file, callback) {
    uidSafe(24).then(function(uid) {
      callback(null, uid + path.extname(file.originalname));
    });
  }
});

const uploader = multer({
  storage: diskStorage,
  limits: {
    fileSize: 2097152
  }
});
///=======do not touch

app.use(compression());

app.use(
  express.urlencoded({
    extendend: false
  })
);
app.use(bodyParser.json());

if (process.env.NODE_ENV != "production") {
  app.use(
    "/bundle.js",
    require("http-proxy-middleware")({
      target: "http://localhost:8081/"
    })
  );
} else {
  app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

// app.use(require("cookie-parser")());

// const cookieSessionMiddleware = cookieSession({
//     secret: `I'm always angry.`,
//     maxAge: 1000 * 60 * 60 * 24 * 90
// });

// app.use(cookieSessionMiddleware);

const cookieSession = require("cookie-session");
const cookieSessionMiddleware = cookieSession({
  secret: `I'm always angry.`,
  maxAge: 1000 * 60 * 60 * 24 * 90
});

app.use(cookieSessionMiddleware);
io.use(function(socket, next) {
  cookieSessionMiddleware(socket.request, socket.request.res, next);
});

app.use(express.static("./public"));

app.get("/welcome", function(req, res) {
  console.log("welcome");
  if (req.session.userId) {
    res.redirect("/");
  } else {
    res.sendFile(__dirname + "/index.html");
  }
});

app.post("/registration", (req, res) => {
  const { userId } = req.session;

  let first = req.body.userData.name.first;
  let last = req.body.userData.name.last;
  let email = req.body.userData.name.email;
  let password = req.body.userData.name.password;
  console.log("req.body", req.body);

  // you want to grab the user password provided(req.body.password)
  // use hash to take user input created the hashed version of PW to store in DB
  hash(password).then(hash => {
    console.log("hashed PW from /register ", hash);
    db.addUser(first, last, email, hash)
      .then(results => {
        req.session.userId = results.rows[0].id; //cookie for userId!
        req.session.first = results.rows[0].first;
        req.session.last = results.rows[0].last;
        req.session.email = results.rows[0].email;
        req.session.password = results.rows[0].password;

        console.log("results in Post/ registration", results);
        res.json({ success: true, error: false });
      })
      .catch(err => {
        console.log("Error in POST /registration: ", err);
        res.json({ success: false, error: true });
      });
  });
});

app.post("/login", (req, res) => {
  let email = req.body.userData.name.email;

  db.getUser(email)
    .then(results => {
      console.log("results in login / post", results);
      let storedPassword = results.rows[0].password;
      let userInput = req.body.userData.name.password;

      console.log("storedpassword", storedPassword);
      console.log("userInput", userInput);

      compare(userInput, storedPassword).then(matchValue => {
        // console.log("matchValue of compare:", matchValue)

        if (matchValue === true) {
          req.session.userId = results.rows[0].id;
          res.json({ success: true });
          console.log("success in login!");
        } else {
          console.log("Wrong password, please try again");
          res.json({ success: false });
        }
      });
    })
    .catch(err => {
      res.json({ success: false });
      console.log("Error in POST /login: ", err);
    });
});

app.post("/resetpassword/start", (req, res) => {
  let email = req.body.mailData.name.email;

  db.verifyemail(email)
    .then(results => {
      console.log("results in resetpassword / post", results);
      let storedMail = results.rows[0].email;
      let mailInput = req.body.mailData.name.email;

      console.log("storedMail", storedMail);
      console.log("mailInput", mailInput);

      if (storedMail) {
        console.log("there is a stored mail");
        const secretCode = cryptoRandomString({
          length: 6
        });

        // insert this secretcode in table
        db.insertsecret(secretCode, email)
          .then(result => {
            console.log(
              "result in POST resetpassword after insertsecret",
              result
            );

            ses.sendEmail(mailInput, "Reset password", secretCode);

            res.json({
              success: result
            });
            console.log("real success!");
          })

          .catch(function(err) {
            console.log("error in POST /password/reset/start", err);
          });
      }
    })
    .catch(err => {
      res.json({ success: false });
      console.log("Error in POST / resetpassword: ", err);
    });
});

app.post("/resetpassword/verify", (req, res) => {
  console.log("server verify resetpassword");
  let userInput = req.body.newPassword.name.code;
  let password = req.body.newPassword.name.password;
  let email = req.body.newPassword.name.email;
  db.getCode(userInput)
    .then(results => {
      console.log("results in /resetpassword/verify", results);

      let secretCode = results.rows[0].code;

      console.log("secretCode", secretCode);
      console.log("userInput", userInput);

      if (secretCode == userInput) {
        console.log("they are the same");
        hash(password).then(hash => {
          console.log("hashed PW from /register ", hash);
          db.updatePassword(email, hash).then(result => {
            res.json({
              success: result
            });
            console.log("real success!");
          });
        });
      }
    })
    .catch(err => {
      res.json({ success: false });
      console.log("Error in /resetpassword/verify ", err);
    });
});

app.get("/user", (req, res) => {
  console.log("get request user");
  db.getUserData(req.session.userId).then(({ rows }) => {
    // console.log("results from user request", results);
    res.json(rows[0]);
  });
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
  const { userId } = req.session;
  console.log("input ", req.body);
  console.log("file ", req.file);
  console.log("POST request for /upload ");
  let url = "https://s3.amazonaws.com/francybucket/" + req.file.filename;

  if (req.file) {
    db.insertImage(userId, url)
      .then(result => {
        console.log("result in post upload", result);
        res.json({
          success: true,
          result
        });
      })
      .catch(function(err) {
        console.log("error in post upload", err);
      });
  } else {
    res.json({
      success: false
    });
  }
});

app.get("/logout", (req, res) => {
  req.session.userId = null;
  res.sendStatus(200);
});

app.get("*", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

server.listen(8080, function() {
  console.log("I'm listening.");
});
