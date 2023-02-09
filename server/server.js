const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const passportLocal = require("passport-local").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const bodyParser = require("body-parser");
const app = express();
const User = require("./user");
const Validator = require("./validator");
var ObjectId = require("mongoose").Types.ObjectId;
const multer = require("multer");
const fs = require("fs");
const { Console } = require("console");
const NodeMailer = require("nodemailer");
const Web3 = require("web3");
const FormData = require("form-data");
const NFT = require("./nft");
const MINTED = require("./minted");
const Offer = require("./offer");
const { off } = require("process");

//----------------------------------------- END OF IMPORTS---------------------------------------------------
let API = [
  "c7c619b7-82a5-4d9f-a9f7-1847d16b0b87",
  "c5e91152-b3e1-42a6-944c-4c407c330c33",
  "e740d372-46b9-4569-b89b-82788fb56da5",
  "699ffae0-9d62-4050-8d2c-fb035fc075e2",
  "7943b175-bf74-454b-bb55-f430cba90e7c",
  "e7a46472-5f77-42c8-8ec4-24c8e6e03f74",
];
const chain = "goerli";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + ".jpg");
  },
});

const upload = multer({ storage: storage });

mongoose.connect(
  "mongodb://localhost:27017/nft_platform",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoCreate: true,
  },
  (err) => {
    if (err) {
      console.log(err);
    } else console.log("Mongoose Is Connected");
  }
);

function authenticate(req, res, next) {
  res.locals.login = req.isAuthenticated();
  next();
}

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://13.59.107.226:3000", // <-- location of the react app were connecting to
    credentials: true,
  })
);
app.use(
  session({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(cookieParser("secretcode"));

passport.use(
  new LocalStrategy(
    {
      usernameField: "address",
      passwordField: "signature",
    },
    // function of username, password, done(callback)
    function (address, signature, done) {
      console.log("Using local strategy");
      Validator.find({ address: address }).then((validation) => {
        const nonce = validation[0].code + "";
        var hash = Web3.utils.sha3(nonce);
        const web3 = new Web3();
        const signer = web3.eth.accounts.recover(hash, signature);
        console.log("Signer: " + signer);
        if (signer.toLowerCase() === address.toLowerCase()) {
          // look for the user data
          User.findOne({ address: address }, function (err, user) {
            // if there is an error
            if (err) {
              return done(err);
            }
            // if user doesn't exist
            if (!user) {
              const newUser = new User({
                username: "not set",
                address: address,
                email: "not set",
                profilePic: "http://localhost:4000/file/default.jpg",
                profileBanner: "http://localhost:4000/file/default_banner.jpg",
                bio: "Hello, i want to sell nft, maybe buy tooo.",
                joinDate: Date.now(),
                isVerified: false,
                MINT: [],
              });
              newUser.save((result) => {
                done(null, newUser);
              });
            } else {
              console.log("User found");
              done(null, user);
            }
          });
        } else {
          done("keys not match");
        }
      });
    }
  )
);

passport.serializeUser(function (user, done) {
  let sessionData = { address: user.address };
  done(null, sessionData);
});

passport.deserializeUser(function (user, done) {
  User.findOne({ address: user.address }).then((u) => {
    done(null, u);
  });
});

//----------------------------------------- END OF MIDDLEWARE---------------------------------------------------

app.use((req, res, next) => {
  console.log(req.url + ": ");
  console.log(req.body);
  next();
});

// start of login request
// generates a nonce for authentication
// client encrypts the nonce with their private key
app.post("/request_validation", (req, res) => {
  let address = req.body.address;
  // generating a new nonce
  const code = Math.floor(100000 + Math.random() * 900000);
  // deleting all previous nonce generated
  Validator.deleteMany({ addres: address }).then((result) => {
    const val = new Validator({
      address: address,
      code: code,
      validUntil: Date.now(),
    });
    val.save().then((savResult) => {
      res.send({
        address: address,
        nonce: code,
      });
    });
  });
});

// Routes
// -------------LOGIN FUNCTION
// encrypted nonce is shared to login function
// local strategy is used to verify the nonce by using public key
app.post("/login", (req, res, next) => {
  const address = req.body.address;
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      res.send(err);
    }
    console.log(err);
    console.log(user);
    if (user) {
      req.logIn(user, (err) => {
        if (err) throw err;
        res.send({ address: address });
        console.log(req.user);
        req.user = user;
      });
    } else {
      res.send("User not found");
    }
  })(req, res, next);
});

app.post("/logout", (req, res) => {
  req.logout();
  res.send("logged out");
});

app.get("/user", (req, res) => {
  console.log("User: ", req.user);
  if (req.user) {
    User.findOne({ address: req.user.address })
      .then((user) => {
        res.send({ user: user });
      })
      .catch((err) => {
        res.send({ user: null });
      });
  } else res.send({});
});

const email = "auth@lamdah.com";
const pass = "itsapassword";

var transporter = NodeMailer.createTransport({
  host: "sg2plzcpnl473860.prod.sin2.secureserver.net",
  port: 465,
  secure: true,
  auth: {
    user: email,
    pass: pass,
  },
  debug: false,
  logger: true,
});

app.post("/requestCode", (req, res) => {
  if (!req.user) {
    res.send("Auth failed");
    return;
  }

  User.findOne({ address: req.user.address }).then((user) => {
    new Promise((resolve) => {
      const code = Math.floor(100000 + Math.random() * 900000);
      const subject = "Email confirmation, your confirmation code is " + code;
      var mailOptions = {
        from: email,
        to: user.email,
        subject: subject,
        text: "Email confirmation",
      };
      const val = new Validator({
        address: user.address,
        code: code,
        validUntil: Date.now(),
      });
      val.save().then((result) => {
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
            res.send("error");
            console.log("Email not sent");
          } else {
            res.send("ok");
            console.log("Email sent");
          }
        });
      });
    });
  });
});

app.post("/validate", (req, res) => {
  if (!req.user) {
    res.send("Auth failed");
    return;
  }
  const token = req.body.token;
  console.log(req.user.address);
  User.findOne({ address: req.user.address }, (err, user) => {
    if (user) {
      Validator.findOne(
        { address: user.address, code: token },
        (error, val) => {
          if (val) {
            user.isVerified = true;
            user.save().then((result) => {
              res.send("ok");
            });
          } else {
            res.send("Invalid token");
          }
        }
      );
    } else {
      res.send("error");
    }
  });
});

//----------------------------------------- END OF Auth---------------------------------------------------//

//----------------------------------------- Start of NFT Platform data ---------------------------------------------------//

app.get("/file/:file", (req, res) => {
  const path = "uploads/" + req.params.file;
  res.download(path);
});

app.post(
  "/update_profile",
  upload.fields([
    { name: "profile", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  (req, res) => {
    console.log(req.files);
    User.findOne({ address: req.user.address }).then((user) => {
      user.profileBanner =
        "http://localhost:4000/file/" + req.files.banner[0].path.substring(8);
      user.profilePic =
        "http://localhost:4000/file/" + req.files.profile[0].path.substring(8);
      user.username = req.body.username;
      user.email = req.body.email;
      user.bio = req.body.bio;
      user.save().then(() => {
        res.send("Success");
      });
    });
  }
);

app.post("/upload_banner", upload.single("banner"), (req, res) => {
  User.findOne({ address: req.user.address }).then((user) => {
    user.profileBanner = "http://localhost:4000/file/" + req.file.filename;
    user.username = req.body.username;
    user.email = req.body.email;
    user.bio = req.body.bio;
    user.save().then(() => {
      res.send("Success");
    });
  });
});
app.post("/upload_profile_picture", upload.single("profile"), (req, res) => {
  User.findOne({ address: req.user.address }).then((user) => {
    user.profilePic = "http://localhost:4000/file/" + req.file.filename;
    user.username = req.body.username;
    user.email = req.body.email;
    user.bio = req.body.bio;
    user.save().then(() => {
      res.send("Success");
    });
  });
});

app.post("/update_profile_only", (req, res) => {
  User.findOne({ address: req.user.address }).then((user) => {
    user.username = req.body.username;
    user.email = req.body.email;
    user.bio = req.body.bio;
    user.save().then((err) => {
      res.send("Success");
    });
  });
});

app.get("/minted", (req, res) => {
  if (!req.user) {
    res.status(403);
    res.send("Authentication failed");
  } else {
    const api = API.shift();
    let url = `https://api.nftport.xyz/v0/accounts/creators/${req.user.address}?chain=polygon`;
    let options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: api,
      },
    };
    API.push(api);
    fetch(url, options)
      .then((resp) => resp.json())
      .then((json) => {
        res.send(json);
      })
      .catch((err) => {
        console.error("error:" + err);
        res.send(err);
      });
  }
});

app.get("/all_nfts", (req, res) => {
  let url = `https://api.nftport.xyz/v0/nfts?chain=${chain}`;
  const api = API.shift();
  let options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: api,
    },
  };
  API.push(api);
  fetch(url, options)
    .then((resp) => resp.json())
    .then((json) => res.send(json.nfts))
    .catch((err) => console.error("error:" + err));
});

app.get("/mynft", (req, res) => {
  if (!req.user) {
    res.status(403);
    res.send("Authentication failed");
  } else {
    const api = API.shift();
    let url = `https://api.nftport.xyz/v0/accounts/${req.user.address}?chain=${chain}`;
    let options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: api,
      },
    };
    API.push(api);
    fetch(url, options)
      .then((resp) => resp.json())
      .then((json) => {
        res.send(json);
      })
      .catch((err) => {
        console.error("error:" + err);
        res.send(err);
      });
  }
});

let i = 1;
app.get("/nft/:contract/:token", (req, res) => {
  const contractAddress = req.params.contract;
  const token = req.params.token;
  NFT.findOne({ contract: contractAddress, token: token }).then((found) => {
    if (!found) {
      const api = API.shift();
      let url = `https://api.nftport.xyz/v0/nfts/${contractAddress}/${token}?chain=${chain}`;
      let options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: api,
        },
      };
      API.push(api);
      setTimeout(() => {
        fetch(url, options)
          .then((res) => res.json())
          .then((json) => {
            if (json.nft.metadata) {
              const nft = new NFT({
                contract: contractAddress,
                token: token,
                name: json.nft.metadata.name,
                image: json.nft.metadata.image,
                description: json.nft.metadata.description,
                updatedDate: json.nft.metadata.updated_date,
                owner: json.owner,
                animationURL: json.nft.animation_url,
              });
              if (json.nft.file_information) {
                nft["fileSize"] = json.nft.file_information.file_size;
                nft["height"] = json.nft.file_information.height;
                nft["width"] = json.nft.file_information.width;
              }
              nft.save().then(() => {
                i--;
                res.send(nft);
              });
            } else {
              console.log(json.nft);
              res.send("error");
            }
          })
          .catch((err) => console.error("error:" + err));
      }, i++ * 50);
    } else {
      res.send(found);
    }
  });
});

app.post("/mintToBlockChain", upload.single("image"), (req, res) => {
  const name = req.body.name;
  const description = req.body.description;
  const mint_to_address = req.user.address;
  const price = req.body.price;
  const url = "file/" + req.file.filename;
  const nft = MINTED({
    title: name,
    description: description,
    creator: mint_to_address,
    price: price,
    url: url,
  });
  console.log(req, price, nft);
  nft.save((err, r) => {
    res.send(r);
  });
});

app.post("/confirmMinted", (req, res) => {
  const trxHash = req.body.trxHash;
  const contractAddress = req.body.contractAddress;
  const blockHash = req.body.blockHash;
  const id = req.body.id;

  MINTED.findOne({_id: id}).then(minted => {
    minted.trxHash = trxHash;
    minted.contractAddress = contractAddress;
    minted.blockHash = blockHash;
    minted.save((r) => {
      res.send("OK");
    });
  });
});

app.post("/mint", upload.single("image"), (req, res) => {
  const form = new FormData();
  const fileStream = fs.createReadStream("uploads/" + req.file.filename);
  form.append("file", fileStream);
  const api = API.shift();
  const options = {
    method: "POST",
    body: form,
    headers: {
      Authorization: api,
    },
  };
  API.push(api);
  fetch(
    "https://api.nftport.xyz/v0/mints/easy/files?" +
      new URLSearchParams({
        chain: "goerli",
        name: req.body.name,
        description: req.body.description,
        mint_to_address: req.user.address,
      }),
    options
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (responseJson) {
      console.log(responseJson.response);
      if (responseJson.response === "OK") {
        const MINT = {
          chain: responseJson.chain,
          contractAddress: responseJson.contract_address,
          transactionHash: responseJson.transaction_hash,
          transactionExternalUrl: responseJson.transaction_external_url,
          mintToAddress: responseJson.mint_to_address,
          name: responseJson.name,
          description: responseJson.description,
          download: "files/" + req.file.filename,
        };

        let url = `https://api.nftport.xyz/v0/mints/${MINT.transactionHash}?chain=${MINT.chain}`;
        const api = API.shift();
        let options = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: api,
          },
        };
        API.push(api);
        fetch(url, options)
          .then((res) => res.json())
          .then((json) => console.log(json))
          .catch((err) => console.error("error:" + err));

        User.findOne({ address: req.user.address }).then((user) => {
          user.mints.push(MINT);
          user.save().then((saved) => {
            res.send(MINT);
          });
        });
      } else {
        res.status(403);
        res.send(responseJson);
      }
    });
});

app.post("/makeOffer", (req, res) => {
  const offerPrice = req.body.price;
  const nft = req.body.nft;
  const offerTime = new Date();
  const offer = new Offer({
    offerPrice: offerPrice,
    nft: nft,
    offerTime: offerTime,
    offeredBy: req.user.address,
    status: "pending",
  });
  offer.save(() => {
    res.send("ok");
  });
});

app.get("/offers/:nft", (req, res) => {
  const nft = req.params.nft;
  Offer.find({ nft: nft }).then((result) => {
    res.send(result);
  });
});

app.post("/accept", (req, res) => {
  const offerID = req.body.offer;
  Offer.findOne({_id: ObjectId(offerID)}).then(offer => {
    offer.status = "accepted";
    offer.save().then(saved => {
        res.send("ok")
    })
  })
})

app.post("/decline", (req, res) => {
  const offerID = req.body.offer;
  Offer.findOne({_id: ObjectId(offerID)}).then(offer => {
    offer.status = "declined";
    offer.save().then(saved => {
        res.send("ok")
    })
  })
})


app.post("/processed", (req, res) => {
  const offerID = req.body.offer;
  Offer.findOne({_id: ObjectId(offerID)}).then(offer => {
    offer.status = "processed";
    offer.save().then(saved => {
        res.send("ok")
    })
  })
})


//----------------------------------------- END of NFT Platform Data ---------------------------------------------------//

//----------------------------------------- END OF ROUTES---------------------------------------------------
//Start Server
app.listen(4000, () => {
  console.log("Server Has Started");
});

//----------------------------------------- START of NFT API ---------------------------------------------------//

//----------------------------------------- END of NFT API ---------------------------------------------------//
