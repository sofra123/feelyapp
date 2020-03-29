const express = require("express");
const app = express();

const compression = require("compression");
const bodyParser = require("body-parser");
const { hash, compare } = require("./bc.js");
const db = require("./db");

const cryptoRandomString = require("crypto-random-string");
const ses = require("./ses.js");
const s3 = require("./s3.js");
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

app.get("/getsentiment", function(req, res) {
  console.log("getsentiment");
  googlenaturallanguage.quickstart().then(response => {
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
    .then(response => {
      let firstresponse = response[0];
      let sentimentScore = firstresponse.documentSentiment.score;
      let sentimentRank = ((sentimentScore + 1) * 10) / 2;
      let sentimentRankrounded = Math.round(sentimentRank * 10) / 10;

      console.log("sentimentRank", sentimentRank);
      console.log("sentimentscore", sentimentScore);
      console.log("sentimentRankrounded", sentimentRankrounded);

      db.getCheckinStatus(userId).then(results => {
        console.log("results from checkinstatus", results);

        if (results.rows.length == 0) {
          db.insertAnswers(
            userId,
            answer1,
            answer2,
            answer3,
            sentimentRankrounded
          )
            .then(results => {
              res.json(results.rows[0]);
              console.log(results);
            })
            .catch(err => {
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
            .then(results => {
              res.json(results.rows[0]);
              console.log(results);
            })
            .catch(err => {
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
    .then(results => {
      console.log("results.rows[0] from getsentimentscore", results.rows[0]);
      console.log("results from getsentimentscore", results);
      res.json(results.rows);
    })
    .catch(err => {
      console.log("index.js get /getimages catch err: ", err);
    });
});

app.post("/gratitude", (req, res) => {
  const { userId } = req.session;
  console.log("app post gratitude is running");

  db.addGratitude(userId, req.body.gratitude)
    .then(results => {
      console.log(" results.gratitude: ", results.rows[0]);
      res.json(results.rows[0]);
    })
    .catch(err => {
      console.log("index.js POST /gratitude db.addGratitude catch err: ", err);
    });
});

app.get("/getgratitude", (req, res) => {
  console.log("getimages index is running");
  const userId = req.session.userId;
  db.getGratitude(userId)
    .then(results => {
      console.log("results from get gratitude", results);

      res.json(results);
    })
    .catch(err => {
      console.log("index.js get /getimages catch err: ", err);
    });
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

app.post("/bio", (req, res) => {
  const { userId } = req.session;
  console.log("app post bioeditor is running");
  console.log("req.body.bio ", req.body);
  db.updateBio(userId, req.body.bio)
    .then(results => {
      // console.log(" results2: ", results.rows[0].bio);
      res.json(results.rows[0]);
    })
    .catch(err => {
      console.log("index.js POST /bio db.updateBio catch err: ", err);
    });
});

app.get("/api/user/:id", (req, res) => {
  const userId = req.session.userId;
  console.log("userid", userId);
  console.log("req.params.id", req.params.id);
  if (req.params.id == userId) {
    res.json({ redirectToProfile: true });
  } else {
    db.getUserData2(req.params.id)
      .then(results => {
        console.log("results from api/user:id", results.rows[0]);

        res.json({
          user: results.rows[0],
          pictures: results.rows
        });
      })
      .catch(err => {
        console.log("index.js GET /user/:id db.getUserInfo catch err: ", err);
        res.json({});
      });
  }
});

app.get("/lastusers", (req, res) => {
  console.log("lastusers index is running");

  db.getLastUsers()
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      console.log("index.js get /lastusers catch err: ", err);
    });
});

app.get("/matchingusers/:matchingusers", (req, res) => {
  console.log("matchingusers index is running");

  db.getMatchingUsers(req.params.matchingusers)
    .then(results => {
      console.log("results from match users", results.rows);
      res.json(results.rows);
    })
    .catch(err => {
      console.log("index.js get /matchingusers catch err: ", err);
    });
});

app.get("/api/friends/:id", (req, res) => {
  const receiver = req.params.id;
  const sender = req.session.userId;
  db.getFriendshipStatus(receiver, sender)
    .then(results => {
      console.log("results from friends/:id", results);
      res.json({
        ownUserId: sender,
        results
      });
    })
    .catch(err => {
      console.log("index.js GET /friends/:id db.getUserInfo catch err: ", err);
    });
});

app.post("/api/friendshiprequest/:id", (req, res) => {
  const receiver = req.params.id;
  const sender = req.session.userId;
  db.sendFriendRequest(receiver, sender)
    .then(results => {
      console.log("results from post friendshiprequest/:id", results);
      res.json(results);
    })
    .catch(err => {
      console.log("index.js POST /friends/:id db.getUserInfo catch err: ", err);
    });
});

app.post("/acceptfriendship/:id", (req, res) => {
  const receiver = req.params.id;
  const sender = req.session.userId;
  console.log("sender", sender);
  console.log("receiver", receiver);
  db.acceptFriendRequest(receiver, sender)
    .then(results => {
      console.log("results from post friends/:id", results);
      res.json(receiver);
    })
    .catch(err => {
      console.log("index.js POST /friends/:id db.getUserInfo catch err: ", err);
    });
});

app.post("/deletefriendship/:id", (req, res) => {
  const receiver = req.params.id;
  const sender = req.session.userId;
  db.deleteFriendship(receiver, sender)
    .then(results => {
      console.log("results from post friends/:id", results);
      res.json(receiver);
    })
    .catch(err => {
      console.log("index.js POST /friends/:id db.getUserInfo catch err: ", err);
    });
});

app.get("/friends-wannabes", (req, res) => {
  console.log("friends wannabes running");

  db.getFriendsandWannabe(req.session.userId)
    .then(results => {
      console.log("friend and wannabe", results.rows);
      res.json(results.rows);
    })
    .catch(err => {
      console.log("index.js GET /friends and wannabe catch err: ", err);
    });
});

app.get("/logout", (req, res) => {
  req.session.userId = null;
  res.sendStatus(200);
});

app.post("/uploadpic", uploader.single("file"), s3.upload, (req, res) => {
  const { userId } = req.session;
  console.log("input ", req.body);
  console.log("file ", req.file);
  console.log("POST request for /uploadpic ");
  let pic = "https://s3.amazonaws.com/francybucket/" + req.file.filename;

  if (req.file) {
    db.insertPic(userId, pic)
      .then(result => {
        console.log("result in post uploadpic", result);
        res.json({
          success: true,
          result
        });
      })
      .catch(function(err) {
        console.log("error in post uploadpic", err);
      });
  } else {
    res.json({
      success: false
    });
  }
});

app.get("/getimages", (req, res) => {
  console.log("getimages index is running");
  const userId = req.session.userId;
  db.getImages(userId)
    .then(results => {
      console.log("--results--");

      console.log(JSON.stringify(results));
      res.json(results);
    })
    .catch(err => {
      console.log("index.js get /getimages catch err: ", err);
    });
});

app.post("/answers", (req, res) => {
  console.log("app post form is running");
  const { userId } = req.session;
  const answer1 = req.body.answer_1;
  const answer2 = req.body.answer_2;
  const answer3 = req.body.answer_3;
  db.insertAnswers(userId, answer1, answer2, answer3)
    .then(results => {
      res.json(results.rows[0]);
      console.log(results);
    })
    .catch(err => {
      console.log("index.js POST /answers db.insertAnswers catch err: ", err);
    });
});

app.get("*", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

server.listen(8080, function() {
  console.log("I'm listening.");
});

let onlineUsers = {};

io.on("connection", function(socket) {
  console.log(`socket with the id ${socket.id} is now connected`);
  if (!socket.request.session.userId) {
    return socket.disconnect(true);
  }

  const userId = socket.request.session.userId;

  onlineUsers[socket.id] = userId;
  Object.values(onlineUsers);
  console.log("onlineusers", onlineUsers);

  db.getLastTenMessages()
    .then(data => {
      // console.log("index.js io.on 'connection' GET  ", data);
      io.sockets.emit("chatMessages", data.rows.reverse());
    })
    .catch(err => {
      console.log("index.js io.on connection error", err);
    });

  socket.on("newMsg", msg => {
    console.log("message received");
    console.log(" message sent: ", msg);
    console.log("userId in msg", userId);

    db.insertMessage(userId, msg)
      .then(data => {
        console.log("index.js socket.on message ", data);

        db.getUserData(userId)
          .then(data => {
            console.log("msg in userdata ", msg);
            let objmsg = {
              first: data.rows[0].first,
              last: data.rows[0].last,
              url: data.rows[0].url,
              message: msg
            };
            console.log("first in getuserdata ", data.rows[0].first);

            io.sockets.emit("chatMessage", objmsg);
            console.log("objmsg", objmsg);
          })
          .catch();
        // msg10.push({ message: msg });
        // io.sockets.emit("chatMessages", msg10);
      })
      .catch(err => {
        console.log("index.js socket.on catch err: ", err);
      });
  });
});

io.on("connection", function(socket) {
  // let userId = socket.request.session.userId;
  // // onlineUsers[socket.id] = userId;
  // Object.values(onlineUsers);
  // console.log("onlineUsersobj", onlineUsers);

  // arrayOfIds = Object.values(onlineUsers);
  const userId = socket.request.session.userId;

  let arrayOfIds = [];
  Object.entries(onlineUsers).map(onlineId => {
    // check I need that in disconnect
    arrayOfIds.push(onlineId[1]);
  });
  console.log("arrayOfIds", arrayOfIds);

  db.getUserDataOnlineUsers(arrayOfIds).then(data => {
    console.log("data in arrayOfId", data.rows);

    io.sockets.emit("onlineUsers", data.rows);
  });

  // db.getJoinedUser(userId).then(result => {
  //     socket.broadcast.emit("userJoined", result.rows[0]);

  //     console.log("userswhojoined ", result.rows[0]);
  // });

  socket.on("disconnect", function() {
    delete onlineUsers[socket.id];
    io.sockets.emit("userLeft", userId);

    db.getUserDataOnlineUsers(arrayOfIds).then(data => {
      console.log("data in arrayOfId", data.rows);
      io.sockets.emit("onlineUsers", data.rows);
    });

    console.log(`socket user id ${socket.id} is disconnected`);
  });
});

// send back an array
//put array in redux
// socket.io events: one when user joins and one when user leaves
