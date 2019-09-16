const mongoose=require('mongoose');
const Schema=mongoose.Schema;


const materielSchema= new Schema({

    marque:String,
    reference_model:String,
    puissance:String,
    annee:Number,
    nombre_heures:String,
    Etat_general:String ,
    Pneus_avant:String,
    imgBytedata:String,
    //userId:String
    })
module.exports=mongoose.model('Materiel',materielSchema);