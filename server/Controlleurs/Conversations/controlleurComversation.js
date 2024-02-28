const model = require('../../Models/Conversations/index');
const modulMessage = require('../../Models/Messages')

//New conversation

const newConversation = async(req, res)=>{
    const {senderId, receverId} = req.body;

    //Virifier si cette conversation existe ou pas
    const veriConversation = await model.findOne({
        members:{$all:[senderId,receverId]}
    })

    if(veriConversation){
        console.log('conversation existe');
       return res.status(200).json(veriConversation);
    }
    //enrigistre un nouvelle conversation
    const conversation = new model({
        members:[senderId, receverId],
        Messages:[]
       });

       try{
          const saveConeversation = conversation.save();
          saveConeversation
          .then((doc)=>{
              res.status(200).json(doc);
          })
          console.log('creation avec succe');
       }catch(err){
            console.error(err);
            res.status(500).json(err);
       }
}

// //tab pour tous les messages
// let allMsg=[];

//   // pour recupere tous les messages de chaque conv
// const allmessge = ()=>{
//     try{
//      model.find()
//       .populate([
//           {path:"messages", select :["sender", "conversationId", "text"]}
//         ])
//         .then((doc)=>{
//             doc.map((c)=>c.messages.length?allMsg.push(...c.messages):null)
//         });
//         }catch(err){
//             console.log(err);
//         }     
// }


//afficher les differents conversation de l'utilisateur
const afficheConversation =  async(req,res) => {
    // if(allMsg.length === 0){
    //     allmessge();
    //     console.log("appel allmessge");
    // }
        try{
            const conversation = await model.find({
                members:{$in:[req.params.id]}
            })
            .populate([
                {path:"members", select: ["nom", "prenom", "photo"]},
                {path:"messages", select : ["text","createdAt"]}
            ]);

            res.status(200).json(conversation);
            console.log('coneversation afficher');
            
        }catch(err){
            console.error(err);
            res.status(500).json(err);
        }
} 

//afficher Une conversation

const afficheUneConversation =  async(req,res) => {
    try{
        const conversation = await model.findById(req.params.id)
        .populate([
            {path:"members", select: ["nom", "prenom", "photo"]},
            {path:"messages", select : ["sender", "conversationId", "text"]}
        ]);

        res.status(200).json(conversation);

    }catch(err){
        console.error(err);
        res.status(500).json(err);
    }
} 

//recupere tout les messages du user
const  filtre = async(req, res)=>{
    let tab = [];
     try{
        const conversation = await model.find({
            members:{$in:[req.params.id]}
        }) .populate([ 
            {path:"messages", select : ["sender", "conversationId", "text"]}
        ]);
        conversation.map((c)=> c.messages.length?tab.push(...c.messages):null)
        if(tab){
            tab = tab.filter(doc => doc.sender[0] != req.params.id);
        }
         res.status(200).json(tab);
    }catch(err){
     res.status(500).json(err)
    }
  }


 //pour la notification supprime tout les id message de cette conversation
 const deleteConvAllMessage = async(req, res)=>{
    const {idConv, idmssg} = req.body;
     try{
        const conversation = await model.updateOne({"_id":idConv}, 
        {$pull: {messages: idmssg}}, {new:true, runValidators:true});
      res.status(200).json(
        conversation
      );
       
    }catch(err){
        res.status(500).json(err);
    }
 }


//delete connversation

const deleteConversation= async(req,res) =>{
   // const {senderId, receverId} = req.body;
    await model.deleteOne({"_id": req.params.id})
    .then((doc)=>{
         modulMessage.deleteOne({"conversationId": req.params.id})
         .then((doc)=>{
        res.status(200).json({
            message:"conversation supprimer"
        })
        console.log('conversation supprimer');
         })
    })
    .catch((err)=> console.error(err));
}


module.exports = {CreateConversation: newConversation, AfficheConversation: afficheConversation,
     DeleteConversation:deleteConversation, afficheUneConversation, filterMessage:filtre , deleteConvAllMessage}