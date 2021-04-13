var express = require('express');
var router = express.Router();
const CryptoJS = require("crypto-js");
const cors = require("cors")
const fs = require("fs");

router.use(cors());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');

  //userPass har användaren fyllt i i input
  let userPass = "MittFantastiskaLösenord";
  console.log(userPass);

  //kryptera userPass och det är detta som ska sparas till backend
  let krypteratPass = CryptoJS.AES.encrypt(userPass, "Salt Nyckel").toString();
  console.log(krypteratPass);

  //avkryptera den - jämför inkommande lösenord med riktiga lösenordet
  let originalPass = CryptoJS.AES.decrypt(krypteratPass, "Salt Nyckel").toString(CryptoJS.enc.Utf8);
  console.log(originalPass);

});

router.post('/newuser', function(req, res, ) {
  
  let newUser = req.body;

  let newPassword = newUser.password; 
  // console.log(newPassword);

  let cryptoPassword = CryptoJS.AES.encrypt(newPassword, "Salt Nyckel").toString();
  // console.log(cryptoPassword);

  newUser.password = cryptoPassword;
  //newuser med krypterat lösenord
  // console.log(newUser);

  //hämta/öppna users.json
  fs.readFile("users.json", function(err, data) {
    if (err) {
      console.log(err);
    }
    let users = JSON.parse(data);

    //pusha nya användaren med krypterat lösenord
    users.push(newUser);

    //spara (skriver över gamla filen) Om funkar, ny användare synas i json-filen
    fs.writeFile("users.json", JSON.stringify(users, null, 2), function(err) {
      
      if (err) {
        console.log(err);
      };

    });
    res.json("success");
  });
});

router.post('/login', function(req, res) {
  let loginUser = req.body;
  // console.log(loginUser);
  // console.log(loginUserPassword);

  fs.readFile("users.json", function(err, data) {
    if (err) {
      console.log(err);
    }

    //se om jag hittar användarnamnet
    //hämta användare:
    let users = JSON.parse(data);

    const userExists = users.find( ({ userName }) => userName === loginUser.userName);

    // console.log(userExists);

    //om userExists, kolla lösen: 
    if (userExists !== undefined) {

      //dekryptera userExists.password 
      let cryptoPassword = userExists.password;
      // console.log(cryptoPassword);

      let originalPassword = CryptoJS.AES.decrypt(cryptoPassword, "Salt Nyckel").toString(CryptoJS.enc.Utf8);
      // console.log(originalPassword);

      if (originalPassword === req.body.password) {
        console.log("loginOk");
        res.json("loginOk");

      } else {
        console.log("error från lösencheck")
        res.json("error");

      }

    } else { 
      console.log("error från användarnamncheck")
      res.json("error");

    };
  
  });

});


module.exports = router;


