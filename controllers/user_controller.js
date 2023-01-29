const User = require("../models/user");
const Order = require("../models/order");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
module.exports.register = async (req, res) => {
  try {
    // Get user input
    const { name, phone, password, confirm_password } = req.body;

    // Validate user input
    if (!(name && password && phone, confirm_password)) {
      res
        .status(400)
        .json({ massage: "All input is required", success: false });
    }

    if (password !== confirm_password) {
      res.status(403).json({
        message: "password and confirm password does not match ",
        success: false,
      });
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ phone });

    if (oldUser) {
      return res
        .status(409)
        .json("User Already Exist On This Phone Number . Please Login ");
    }

    //Encrypt user password
   const encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await User.create({
      name,
      phone,
      password: encryptedPassword,
    });
    // Create token
    const token = jwt.sign(user.toJSON(), "Order", {
      expiresIn: "2h",
    });
    user.token = token;
    user.save();
    // return new user
    res.status(201).json({ user, success: true });
  } catch (err) {
    console.log(err);
  }
};

module.exports.login = async (req, res) => {
  try {
    // Get user input
    const { phone, password } = req.body;

    // Validate user input
    if (!(phone && password)) {
      res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const user = await User.findOne({ phone: phone });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(user.toJSON(), "Order", {
        expiresIn: "2h",
      });
      user.token = token;
      // user.save();
      return res.status(200).json({
        user,
        success: true,
      });
    }
    return res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
};

module.exports.welcomeUser = (req, res) => {
  res.status(200).send("Welcome ");
};

module.exports.CreateOrder = async (req, res) => {
  try {
    const newOrder = new Order(req.body);

    console.log(newOrder);

    const InsertOrder = await newOrder.save();
    res.status(201).send({ InsertOrder, success: true });
  } catch (e) {
    res.status(400).send(e);
  }
};

module.exports.GetOrder = async (req, res) => {
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 0;
  const page = req.query.page ? parseInt(req.query.page) : 0;

  Order.find({}, function (err, order) {
    if (err) {
      res.status(401).json({
        message: "Error in Finding Order list ",
      });
    }
    res.status(200).json(order);
  })
    .limit(pageSize)
    .skip(pageSize * page)
    .sort({ user_id: 1 });
};

module.exports.GetOrderById = async (req, res) => {
  try {
    // const id = req.params.id;
    const user_id = req.query.user_id;
    // console.log(user_id);
    // console.log(id);
    const getOrder = await Order.find({ user_id: user_id });
    if (!getOrder) {
      res.status(404).send();
    }
    res.status(200).send(getOrder);
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports.UpdateOrder = async (req, res) => {
  try {
    const id = req.params.id;

    const updateOrder = await Order.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updateOrder) {
      res.status(404).send({ message: "No Changes till now " });
    }
    console.log(updateOrder);
    res.status(200).send(updateOrder);
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports.DeleteOrder = async (req, res) => {
  try {
    const id = req.params.id;

    const DeleteOrder = await Order.findByIdAndDelete(id);

    if (!DeleteOrder) {
      res.status(404).send();
    }
    res.status(200).send(DeleteOrder);
  } catch (err) {
    res.status(500).send(err);
  }
};
