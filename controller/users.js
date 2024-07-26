const User = require('../model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports.getUser = async function (req, res) {
  try {
    const users = await User.find().sort();
    return res.status(200).json({ success: true, message: "Get All users Successfully", users });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
  }
};

module.exports.getUserById = async function (req, res) {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      return res.status(200).json({ success: true, message: "Get User By Id Successfully", user });
    } else {
      return res.status(404).json({ success: false, message: "User Not Found" });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
  }
};

module.exports.addUser = async function (req, res) {
  try {
    const { username, email, password, isAdmin, status } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      isAdmin,
      status
    });

    const savedUser = await newUser.save();
    res.status(201).json({ success: true, message: "User Registered successfully!", user: savedUser });
  } catch (err) {
    res.status(500).json({ success: false, message: "User cannot be created!", error: err.message });
  }
};

module.exports.editUser = async function (req, res) {
  try {
    const { id } = req.params;
    const { username, email, password, isAdmin, status } = req.body;

    const updateData = {
      username,
      email,
      isAdmin,
      status
    };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateData.password = hashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (updatedUser) {
      res.status(200).json({ success: true, message: "User updated successfully", user: updatedUser });
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
  }
};

module.exports.loginUser = async function (req, res) {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ success: false, message: "Email not found" });
    }
    const isMatch = bcrypt.compareSync(req.body.password, user.password);
    if (isMatch) {
      const token = jwt.sign(
        {
          userId: user._id,
          isAdmin: user.isAdmin
        },
        process.env.SECRET,
        { expiresIn: '1d' }
      );
      return res.status(200).json({ success: true, user: user.email, token: token, isAdmin: user.isAdmin });
    } else {
      return res.status(400).json({ success: false, message: "Password is incorrect!" });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
  }
};

module.exports.deleteUser = async function (req, res) {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (user) {
      return res.status(200).json({ success: true, message: "User Deleted Successfully", user });
    } else {
      return res.status(404).json({ success: false, message: "User Cannot be deleted" });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
  }
};

module.exports.countUser = async function (req, res) {
  try{
    const userCount = await User.countDocuments();
    if (userCount) {
      return res.status(200).json({ success: true, success: true, userCount: userCount });
    } else {
      return res.status(404).json({ success: false, message: "User Cannot be Count" });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
  }
}