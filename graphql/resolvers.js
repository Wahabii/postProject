const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const {Materiel,validate}=require('../models/materiel');
const User = require('../models/user');
const isAuth =require('../middleware/auth');
//const Post = require('../models/post');
//const Materiel=require('../models/materiel');
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
      { expiresIn: '7d' }
    );
    return { token: token, userId: user._id.toString() };
  },
  createPost: async function({ postInput }, req) {
   
    if (req.isAuth) {
      const error = new Error('Not authenticated!');
      error.code = 401;
      throw error;
    }
    const errors = [];
    const {error} = validate(req.body);
     if (error)
      errors.push(error.details[0].message);
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
    return {
      ...createdPost._doc,
      _id: createdPost._id.toString(),
      
    };
  },


  getPost : async function  ({postId}, req){
    if (req.isAuth) {
      const error = new Error('Not authenticated!');
      error.code = 401;
      throw error;
    }
    const materiel = await Materiel.findById(postId);
    try {
      if (!materiel) {
        const error = new Error('Could not find post.');
        error.statusCode = 404;
        throw error;
      }
      return materiel;
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  },
  deletePost: async function({ id }, req,res) {
    if (req.isAuth) {
      const error = new Error('Not authenticated!');
      error.code = 401;
      throw error;
    }
    const post = await Materiel.findById(id);
    if (!post) {
      const error = new Error('No post found!');
      error.code = 404;
      throw error;
    }
    
     await Materiel.findByIdAndRemove(id);
    
  },
  updatePost: async function({ id, postInput }, req) {
    if (req.isAuth) {
      const error = new Error('Not authenticated!');
      error.code = 401;
      throw error;
    }
    const post = await Materiel.findById(id);
    if (!post) {
      const error = new Error('No post found!');
      error.code = 404;
      throw error;
    }
    const errors = [];
    const {error} = validate(req.body);
     if (error)
      errors.push(error.details[0].message);
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
    return {
      ...createdPost._doc,
      _id: createdPost._id.toString(),
      
    };
  },
  postes: async function({page}, req) {
    if (req.isAuth) {
      const error = new Error('Not authenticated!');
      error.code = 401;
      throw error;
    }
     while( page > 0 ){
      const createdPosts = await Materiel.find();
      return {
        ...createdPosts._doc,
     
        
      };
     }
   
 
    }
};
