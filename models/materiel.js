const mongoose=require('mongoose');
const Joi =require('joi');

const Schema=mongoose.Schema;


const materielSchema= new Schema({

    marque:String,
    reference_model:String,
    puissance:String,
    annee:Number,
    nombre_heures:Number,
    Etat_general:String ,
    Pneus_avant:String,
    imgBytedata:String,
    //userId:String
    })
const Materiel= new mongoose.model('Materiel',materielSchema);




function validateMateriel(materiel){
    const schema={
        marque:Joi.string().min(5).max(50).required(),
        reference_model:Joi.string().min(5).max(50).required(),
        annee:Joi.number().required(),
         puissance:Joi.string().required(),
         Etat_general:Joi.string().required(),
        nombre_heures:Joi.number().required(),
        Pneus_avant:Joi.string().required(),
        imgBytedata:Joi.string().required()

    };

    return Joi.validate(materiel,schema);
    
    
     }
    
exports.validate=validateMateriel;
exports.Materiel=Materiel;