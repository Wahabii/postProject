const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
//const Post = require('../models/post');
const Materiel=require('../models/materiel');
module.exports = {
  createUser: async function({ userInput }, req) {
    //   const email = args.userInput.email;
    const errors = [];
    if (!validator.isEmail(userInput.email)) {
      errors.push({ message: 'E-Mail is invalid.' });
    }
    if (
      validator.isEmpty(userInput.password) ||
      !validator.isLength(userInput.password, { min: 5 })
    ) {
      errors.push({ message: 'Password too short!' });
    }
    if (errors.length > 0) {
      const error = new Error('Invalid input.');
      error.data = errors;
      error.code = 422;
      throw error;
    }
    const existingUser = await User.findOne({ email: userInput.email });
    if (existingUser) {
      const error = new Error('User exists already!');
      throw error;
    }
    const hashedPw = await bcrypt.hash(userInput.password, 12);
    const user = new User({
      email: userInput.email,
      name: userInput.name,
      password: hashedPw
    });
    const createdUser = await user.save();
    return { ...createdUser._doc, _id: createdUser._id.toString() };
  },
  login: async function({ email, password }) {
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error('User not found.');
      error.code = 401;
      throw error;
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error('Password is incorrect.');
      error.code = 401;
      throw error;
    }
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email
      },
      'somesupersecretsecret',
      { expiresIn: '1h' }
    );
    return { token: token, userId: user._id.toString() };
  },
  createPost: async function({ postInput }, req) {
    const errors = [];
    if (
      validator.isEmpty(postInput.marque) ||
      !validator.isLength(postInput.marque, { min: 5 })
    ) {
      errors.push({ message: 'marque is invalid.' });
    }
    if (
      validator.isEmpty(postInput.reference_model) ||
      !validator.isLength(postInput.reference_model, { min: 5 })
    ) {
      errors.push({ message: 'reference_model is invalid.' });
    }
    if (
      validator.isEmpty(postInput.puissance ||
      !validator.isLength(postInput.puissance, { min: 5 })
    )) {
      errors.push({ message: 'puissance is invalid.' });
    }
    if (
      validator.isEmpty(postInput.annee) ||
      !validator.isLength(postInput.annee, { min: 10 })
    ) {
      errors.push({ message: 'annee is invalid.' });
    }
       if (
      validator.isEmpty(postInput.Etat_general) ||
      !validator.isLength(postInput.Etat_general, { min: 5 })
    ) {
      errors.push({ message: 'Etat_general is invalid.' });
    }

     if (
      validator.isEmpty(postInput.nombre_heures) ||
      !validator.isLength(postInput.nombre_heures, { min: 5 })
    ) {
      errors.push({ message: 'nombre_heures is invalid.' });
    }
    if (
      validator.isEmpty(postInput.Pneus_avant) ||
      !validator.isLength(postInput.Pneus_avant, { min: 5 })
    ) {
      errors.push({ message: 'Pneus_avant is invalid.' });
    }
     if (
      validator.isEmpty(postInput.imgBytedata) ||
      !validator.isLength(postInput.imgBytedata, { min: 5 })
    ) {
      errors.push({ message: ' imgBytedata is invalid.' });
    }

    if (errors.length > 0) {
      const error = new Error('Invalid input.');
      error.data = errors;
      error.code = 422;
      throw error;
    }
    const materiel= new Materiel({
      marque: postInput.marque,
      reference_model:postInput.reference_model,
      annee:postInput.annee,
      puissance:postInput.puissance,
      nombre_heures:postInput.nombre_heures,
      Etat_general:postInput.Etat_general,
      Pneus_avant:postInput.Pneus_avant,
      imgBytedata:postInput.imgBytedata
 

    });
    const createdPost = await materiel.save();
    // Add post to users' posts
    return {
      ...createdPost._doc,
      _id: createdPost._id.toString(),
      
    };
  }
};
