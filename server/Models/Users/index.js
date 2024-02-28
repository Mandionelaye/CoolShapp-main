const mongoos = require('mongoose');

const userShema = mongoos.Schema({
    nom:{
        type: String,
        required:true
    },
    prenom:{
        type: String,
        required:true
    },
    email:{
            type: String,
            required: true,
            unique: true
    },
    password:{
        type: String,
        required:true,
        min: 8, 
        max: 8
    },
    tel:Number,
    photo:String,
    bio:String,
    conversations:[{type: mongoos.Types.ObjectId, ref:"Conversation"}]
})

module.exports = mongoos.model('Users', userShema);