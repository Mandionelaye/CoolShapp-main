const model = require("../../Models/Users/index");
const bcrypt = require('bcrypt');
const {createToken} = require('../Users/controlleurUser');
const jwt = require('jsonwebtoken');


const connection = async(req,res)=>{
    const {email, password} = req.body;
    await model.findOne({email: email})
    .then((doc)=>{
        //verification du filtrage par email
        if(!doc){
            console.log(`votre Email: ${email} est non valide`);
            return res.status(200).json({
                bool:false,
                message:`votre Email: ${email} est non valide`
            })
        }
        //comparaison du password s'il existe
        const comparePassword = bcrypt.compareSync(password, doc.password);
        if(!comparePassword){
            return res.status(200).json({
                bool:false,
                message:"Mot de passe inccorrect!"
            })
        }
        //creation d'un token si la connection reussi
        const token = createToken(doc._id, doc.nom, doc.isAdmin);
        console.log("connection");
        return res.status(200).json({ 
            bool:true,
            token
        })
    })
}

const dechiffToken=async(req, res) => {
      const decToken =  jwt.verify(req.params.token ,process.env.JWT_SECRET);
      console.log(decToken);
      res.status(200).json(
        decToken
      )
}

module.exports = {connection, dechiffToken};
