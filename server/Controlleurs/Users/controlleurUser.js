const model = require("../../Models/Users/index");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const photoAvatar = require('../photoDefault/photo');

//creation de Token
const createToken = (id, nom, isAdmin)=>{
    return jwt.sign({
        data:{id, nom, isAdmin}},
        process.env.JWT_SECRET,
         {expiresIn:"360d"}
        )
}

//creation user
const Createuser = async(req, res)=>{

      //virifie si email existe deja
      const email =  await model.findOne({email: req.body.email});
      if(email){
          console.log("email exite");
          return res.status(201).json({
              message:`cette email existe ${email.email}`
          }) 
      };

    //virifier la longueur du mots de passe
    if(req.body.password){
        if(req.body.password.length < 8 ){
            console.log("password court");
            return res.status(201).json({
                message:`mots de passe court`
            })
        };
    }

    //cruptage du password
    const salt =bcrypt.genSaltSync(10);
    req.body.password = bcrypt.hashSync(req.body.password, salt);

    //ajout d'un photo par defaut
    req.body.photo = photoAvatar;

    await model.create(req.body)
    .then((doc)=>{
        //on creer un token pour l'utilisateur
       const token = createToken(doc._id, doc.nom, doc.email)

       res.status(201).json({
        message: "creation avec succes",
        token
       })
        console.log("create nice");
})
    .catch((err)=> console.error(err))
} 

//affiche User et ces conversations
const AffcheUsers = async(req, res) =>{
    await model.findById(req.params.id)
    .then((doc)=>{
        res.json(doc);
        console.log("affiche nice");
    })
    .catch((err)=> console.error(err))
}

//afficher tout les utilisateur
const AffAllUsers = async(req, res) =>{
    await model.find()
    .then((doc)=>{
        res.json(doc);
        console.log("affiches");
    })
    .catch((err)=> console.error(err))
}
//Modification de l'utilisateur
const ModifUser= async(req, res) => {
    
        const salt =bcrypt.genSaltSync(10);
        req.body.password = bcrypt.hashSync(req.body.password, salt);
        
        if(!req.body.photo){
            req.body.photo = photoAvatar;
        }

        await model.replaceOne({_id: req.params.id}, req.body)
        .then((doc)=>{
            res.status(200).json({
                message:"user modifier"
            });
            console.log("user modifier");
        })
        .catch((err)=> console.error(err))
}

//Modification de l'image du profil
function UdateImg(req, res){
     model.updateOne({_id: req.params.id}, {photo: req.body.photo})
    .then((doc)=>{
        res.status(200).json({
            message:"user modifier"
        });
        console.log("user modifier");
    })
    .catch((err)=> console.error(err))
}


module.exports = {createuser: Createuser, affcheUsers: AffcheUsers, modifUser: UdateImg ,createToken: createToken, AffAllUsers}