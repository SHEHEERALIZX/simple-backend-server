var express = require("express");
let cors = require('cors')

var router = express.Router();

var Employee = require("../models/employees");

/* GET home page. */
router.get("/", function (req, res, next) {
    res.status(404).send("Use Documentation for Proper Response");
});

router.get("/persons", async function (req, res, next) {
    console.log(req);

    let lists = await Employee.find().lean();

    res.send(lists);
});

router.post("/persons", cors(), async function (req, res, next) {
    // console.log(req.body);
    let employee = {
        name: req.body.name,
        designation: req.body.designation,
        age: req.body.age,
    };

    // console.log(employee);

    if (
        employee.name != undefined &&
        employee.age != undefined &&
        employee.designation != undefined
    ) {
        // employees.push(employee)

        let emp = await Employee.create({
            name: employee.name,
            designation: employee.designation,
            age: employee.age,
        });

        res.send(emp);
    } else {
        res.status(400).send("Bad Request");
    }
});




router.put('/persons', async (req, res) => {


     if (

        req.body.id != undefined &&
        req.body.name != undefined &&
        req.body.age != undefined &&
        req.body.designation != undefined
    ) {

        let obj = await Employee.findByIdAndUpdate(req.body.id, {name:req.body.name,age:req.body.age,designation:req.body.designation}, { new: true })
        //   console.log(obj);
        if (obj == null) {

            res.status(400).send("ID not found ")
            return
        }
        res.send(obj)
        return

    }




})




router.delete("/persons", async (req, res) => {
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

module.exports = router;



