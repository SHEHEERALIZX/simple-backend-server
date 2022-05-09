require("dotenv").config();
var express = require("express");

var router = express.Router();
const bcrypt = require("bcrypt");

var Employee = require("../models/employees");
const User = require("../models/User");

const jwt = require("jsonwebtoken");

const tokenVerify = require("../Helpers/json_webtoken");
const Book = require("../models/booksID");
const { default: axios } = require("axios");
const LibraryShelf = require("../models/LibraryShelf");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.status(404).send("Use Documentation for Proper Response");
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);

    // validate user input
    if (!(email && password)) {
      res.status(400).send("All input requireed you fool");
    }

    // check user available in database

    const user = await User.findOne({
      email,
    });
    console.log(user);

    if (user) {
      if (email && (await bcrypt.compare(password, user.password))) {
        console.log(req.body);
        req.session.user = user;
        // console.log(req.session.user);
        const db_res = {
          username: user.username,
          uuid: user._id,
        };
        const token = jwt.sign(db_res, process.env.JWT_TOKEN, {
          expiresIn: 36000,
        });
        res.status(201).json({ token: token });
      } else {
        res.status(200).send("password mismatch");
      }
    }
    res.status(404).send("user not found ");
  } catch (err) {
    console.log(err);
  }
});

router.post("/signup", async (req, res) => {
  console.log(req.body);
  try {
    const { username, email, password } = req.body;

    if (!(email && password && username)) {
      res.status(500).send({ error: "All input is required" });
      // 404 bad request
    }

    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(500).send({ error: "User already Exists" });
    }

    // Encrypt User password

    encryptedPassword = await bcrypt.hash(password, 10);

    // all validation is done then save to database

    const user = await User.create({
      username,
      email: email.toLowerCase(),
      password: encryptedPassword,
    });

    // user created and token generated

    const db_res = {
      username: user.username,
      uuid: user._id,
    };

    const token = jwt.sign(db_res, process.env.JWT_TOKEN, { expiresIn: 36000 });
    res.status(201).json({ token: token });
  } catch (err) {
    console.log(err);
  }
});

router.get("/persons", async function (req, res, next) {
  let lists = await Employee.find().lean();
  res.send(lists);
});

router.post("/persons", async function (req, res, next) {
  // let body = req.body.body
  let employee = {
    name: req.body.fullname,
    designation: req.body.designation,
    email: req.body.email,
    PhoneNumber: req.body.phonenumber,
  };

  let emp = await Employee.create({
    name: employee.name,
    designation: employee.designation,
    email: employee.email,
    PhoneNumber: employee.PhoneNumber,
  });

  console.log(emp);

  res.status(200).send(emp);

  // if (
  //     employee.name != undefined &&
  //     employee.email != undefined &&
  //     employee.designation != undefined &&
  //     employee.phonenumber != undefined

  // ) {
  //     // employees.push(employee)

  //     let emp = await Employee.create({
  //         name: employee.name,
  //         designation: employee.designation,
  //         email: employee.email,
  //         PhoneNumber:employee.PhoneNumber
  //     });

  //     res.send(emp);
  // } else {
  //     res.status(400).send("Bad Request");
  // }
});

router.put("/persons", async (req, res) => {
  if (
    req.body.id != undefined &&
    req.body.name != undefined &&
    req.body.age != undefined &&
    req.body.designation != undefined
  ) {
    let obj = await Employee.findByIdAndUpdate(
      req.body.id,
      {
        name: req.body.name,
        age: req.body.age,
        designation: req.body.designation,
      },
      { new: true }
    );
    //   console.log(obj);
    if (obj == null) {
      res.status(400).send("ID not found ");
      return;
    }
    res.send(obj);
    return;
  }
});

router.post("/deleteuser", async (req, res) => {
  console.log(req.body);
  if (!req.body.id) {
    res.status(400).send("Bad Request");
    return;
  }

  let result = await Employee.findOneAndDelete({ _id: req.body.id });
  if (result != null) {
    res.status(200).send("Deleted Successfully");
  } else {
    res.status(400).send("Invalid Request");
  }
});

router.post("/addbook", async (req, res) => {
  try {
    const { bookID } = req.body;
    console.log("BookID " + bookID);

    if (bookID == "") {
      return res.status(200).send({ status: 422, error: "BookID required" });
      throw "Something Happened in server ";
    }

    const oldBook = await Book.findOne({ bookID: bookID });

    if (oldBook) {
      return res
        .status(200)
        .send({ status: 409, error: "Book already exists" });
    } else {
      let result = await Book.create({ bookID });
      return res.status(200).send({ status: 200, result });
    }

    throw "Something Happened in server ";
  } catch (error) {
    console.log(error);
  }
});

router.get("/getbooks", async (req, res) => {
  let lists = await LibraryShelf.find().lean();

  res.status(200).send(lists);
});

router.post("/searchbook", async (req, res) => {
  const { bookID } = req.body;

  console.log(bookID);

  try {
    if (bookID.length == 10 || bookID.length == 13) {
      axios
        .get(
          `https://www.googleapis.com/books/v1/volumes?q=isbn:${bookID}&key=AIzaSyB-QlMlotYmsLV0s8oSxUfgzXc-5hizT1g`
        )
        .then((result) => {
          console.log(result.data);

          if (result.data.totalItems == 0) {
            res
              .status(200)
              .send({ info: { queryStatus: "Book Not Found", status: 422 } });
          } else {
            res
              .status(200)
              .send({
                result: result.data.items[0].volumeInfo,
                info: { queryStatus: "Book Found", status: 200 },
              });
          }
        });
    } else {
      res
        .status(200)
        .send({ info: { queryStatus: "Query Cannot be Empty", status: 422 } });

      throw "Condition not met creates internal error";
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/savebook", async (req, res) => {
  console.log(req.body);

  let result = await LibraryShelf.create(req.body);

  res.status(200).send(result);
});

module.exports = router;
