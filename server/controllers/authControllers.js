import userApp from "../models/userApp.js";
import { validationResult } from "express-validator";
import generateToken from "../helpers/generateToken.js";
import bcrypt from "bcryptjs";

const registerUser = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  const {
    username,
    fname,
    lname,
    email,
    password,
    isOwner,
    availability,
    address,
    telNumber,
    reviewRate,
    typeOfCharger,
  } = req.body;

  const user = await userApp.findByEmail(email);

  if (user)
    return res.status(409).json({ msg: "Sorry the e-mail already exists" });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const Id = (await userApp.find()).length + 1;
  const userAppModel = await userApp.create({
    username,
    fname,
    lname,
    email,
    password,
    isOwner,
    availability,
    address,
    telNumber,
    reviewRate,
    typeOfCharger,
    password: hashedPassword,
    id: Id,
  });
  const payload = {
    id: Id,
    username: userAppModel.username,
  };

  const token = generateToken(payload);

  try {
    await userAppModel.save();
    res
      .status(200)
      .json({ user: userAppModel, token, msg: "Thank you for signing up!" });
  } catch (err) {
    res.status(400).json({ errorMessage: err.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await userApp.findByEmail(email);
  if (!user)
  return res.status(404).json({
    msg: `Either email or password is not correct !!!`,
  });
  
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return res.status(404).json({
      msg: `Your email or password are not correct !!!`,
    });
  }

  const token = generateToken({ id: user.id, name: user.name });

  res.status(200).json({
    message: "you are logged in !!!",
    token: token,
    user: user,
  });
};

const tokenValidator = (req, res) =>{
  res.json(req.user)
}

export { registerUser, loginUser, tokenValidator };
