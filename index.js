const express = require("express");
const app = express();

const compression = require("compression");
const bodyParser = require("body-parser");
const { hash, compare } = require("./bc.js");
const db = require("./db");

const cryptoRandomString = require("crypto-random-string");
const ses = require("./ses.js");
// const s3 = require("./s3.js");
const googlenaturallanguage = require("./googlenaturallanguage.js");
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
  },
});

const uploader = multer({
  storage: diskStorage,
  limits: {
    fileSize: 2097152,
  },
});
///do not touch

app.use(compression());

app.use(
  express.urlencoded({
    extendend: false,
  })
);
app.use(bodyParser.json());

if (process.env.NODE_ENV != "production") {
  app.use(
    "/bundle.js",
    require("http-proxy-middleware")({
      target: "http://localhost:8081/",
    })
  );
} else {
  app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

const cookieSession = require("cookie-session");
const cookieSessionMiddleware = cookieSession({
  secret: `I'm always angry.`,
  maxAge: 1000 * 60 * 60 * 24 * 90,
});

app.use(cookieSessionMiddleware);
io.use(function(socket, next) {
  cookieSessionMiddleware(socket.request, socket.request.res, next);
});

app.use(express.static("./public"));

app.get("/welcome", function(req, res) {
  if (req.session.userId) {
    res.redirect("/");
  } else {
    res.sendFile(__dirname + "/index.html");
  }
});

app.get("/getsentiment", function(req, res) {
  googlenaturallanguage.quickstart().then((response) => {
    console.log("response from get sentiment index.js", res);
    let firstresponse = response[0];
    let sentimentScore = firstresponse.documentSentiment.score;
  });
});

app.post("/createsentiment", function(req, res) {
  console.log("getsentiment");
  const { userId } = req.session;
  const answer1 = req.body.answer_1;
  const answer2 = req.body.answer_2;
  const answer3 = req.body.answer_3;

  googlenaturallanguage
    .getSentimentScore(answer1, answer2, answer3)
    .then((response) => {
      let firstresponse = response[0];
      let sentimentScore = firstresponse.documentSentiment.score;
      let sentimentRank = ((sentimentScore + 1) * 10) / 2;
      let sentimentRankrounded = Math.round(sentimentRank * 10) / 10;

      console.log("sentimentRank", sentimentRank);
      console.log("sentimentscore", sentimentScore);
      console.log("sentimentRankrounded", sentimentRankrounded);

      db.getCheckinStatus(userId).then((results) => {
        if (results.rows.length == 0) {
          db.insertAnswers(
            userId,
            answer1,
            answer2,
            answer3,
            sentimentRankrounded
          )
            .then((results) => {
              res.json(results.rows[0]);
              console.log(results);
            })
            .catch((err) => {
              console.log(
                "index.js POST /answers db.insertAnswers catch err: ",
                err
              );
            });
        } else {
          db.updateAnswers(
            userId,
            answer1,
            answer2,
            answer3,
            sentimentRankrounded
          )
            .then((results) => {
              res.json(results.rows[0]);
              console.log(results);
            })
            .catch((err) => {
              console.log(
                "index.js POST /answers db.updateAnswers catch err: ",
                err
              );
            });
        }
      });
    });
});

app.get("/getsentimentscore", (req, res) => {
  console.log("getsentiment score index is running");
  const userId = req.session.userId;
  db.getSentimentRank(userId)
    .then((results) => {
      res.json(results.rows);
    })
    .catch((err) => {
      console.log("index.js get /getimages catch err: ", err);
    });
});

app.post("/gratitude", (req, res) => {
  const { userId } = req.session;

  db.addGratitude(userId, req.body.gratitude)
    .then((results) => {
      res.json(results.rows[0]);
    })
    .catch((err) => {
      console.log("index.js POST /gratitude db.addGratitude catch err: ", err);
    });
});

app.get("/getgratitude", (req, res) => {
  const userId = req.session.userId;
  db.getGratitude(userId)
    .then((results) => {
      res.json(results);
    })
    .catch((err) => {
      console.log("index.js get /getimages catch err: ", err);
    });
});

app.post("/registration", (req, res) => {
  const { userId } = req.session;

  let first = req.body.userData.name.first;
  let last = req.body.userData.name.last;
  let email = req.body.userData.name.email;
  let password = req.body.userData.name.password;

  hash(password).then((hash) => {
    console.log("hashed PW from /register ", hash);
    db.addUser(first, last, email, hash)
      .then((results) => {
        req.session.userId = results.rows[0].id;
        req.session.first = results.rows[0].first;
        req.session.last = results.rows[0].last;
        req.session.email = results.rows[0].email;
        req.session.password = results.rows[0].password;

        console.log("results in Post/ registration", results);
        res.json({ success: true, error: false });
      })
      .catch((err) => {
        console.log("Error in POST /registration: ", err);
        res.json({ success: false, error: true });
      });
  });
});

app.post("/login", (req, res) => {
  let email = req.body.userData.name.email;

  db.getUser(email)
    .then((results) => {
      console.log("results in login / post", results);
      let storedPassword = results.rows[0].password;
      let userInput = req.body.userData.name.password;

      compare(userInput, storedPassword).then((matchValue) => {
        if (matchValue === true) {
          req.session.userId = results.rows[0].id;
          res.json({ success: true });
        } else {
          res.json({ success: false });
        }
      });
    })
    .catch((err) => {
      res.json({ success: false });
      console.log("Error in POST /login: ", err);
    });
});

app.post("/resetpassword/start", (req, res) => {
  let email = req.body.mailData.name.email;

  db.verifyemail(email)
    .then((results) => {
      let storedMail = results.rows[0].email;
      let mailInput = req.body.mailData.name.email;

      if (storedMail) {
        console.log("there is a stored mail");
        const secretCode = cryptoRandomString({
          length: 6,
        });

        db.insertsecret(secretCode, email)
          .then((result) => {
            console.log(
              "result in POST resetpassword after insertsecret",
              result
            );

            ses.sendEmail(mailInput, "Reset password", secretCode);

            res.json({
              success: result,
            });
            console.log("real success!");
          })

          .catch(function(err) {
            console.log("error in POST /password/reset/start", err);
          });
      }
    })
    .catch((err) => {
      res.json({ success: false });
      console.log("Error in POST / resetpassword: ", err);
    });
});

app.post("/resetpassword/verify", (req, res) => {
  let userInput = req.body.newPassword.name.code;
  let password = req.body.newPassword.name.password;
  let email = req.body.newPassword.name.email;
  db.getCode(userInput)
    .then((results) => {
      let secretCode = results.rows[0].code;

      if (secretCode == userInput) {
        hash(password).then((hash) => {
          db.updatePassword(email, hash).then((result) => {
            res.json({
              success: result,
            });
          });
        });
      }
    })
    .catch((err) => {
      res.json({ success: false });
      console.log("Error in /resetpassword/verify ", err);
    });
});

app.get("/user", (req, res) => {
  db.getUserData(req.session.userId).then(({ rows }) => {
    res.json(rows[0]);
  });
});

app.get("/logout", (req, res) => {
  req.session.userId = null;
  res.sendStatus(200);
});

app.post("/answers", (req, res) => {
  const { userId } = req.session;
  const answer1 = req.body.answer_1;
  const answer2 = req.body.answer_2;
  const answer3 = req.body.answer_3;
  db.insertAnswers(userId, answer1, answer2, answer3)
    .then((results) => {
      res.json(results.rows[0]);
      console.log(results);
    })
    .catch((err) => {
      console.log("index.js POST /answers db.insertAnswers catch err: ", err);
    });
});

app.get("*", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

server.listen(process.env.PORT || 8080, function() {
  console.log("I'm listening.");
});
