const  mongoose = require("mongoose");

const messagesShema = mongoose.Schema(
    {
        conversationId:{
            type: String,
            required:true
        },
        sender:[{type: mongoose.Types.ObjectId, ref: "Users"}],
        text:{
            type: String,
        },
        photo:{
            type: String,
        },
    },
    {timestamps: true}
);

module.exports = mongoose.model('Messages', messagesShema);