const mongoose = require("mongoose");

const conversationShemat = mongoose.Schema({
        members:[{type:mongoose.Types.ObjectId, ref: "Users"}],
        messages:[{type:mongoose.Types.ObjectId, ref: 'Messages'}] 
    },
    {
        TimeRanges:true
    }
);

module.exports = mongoose.model('Conversations', conversationShemat);