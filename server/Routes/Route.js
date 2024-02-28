const express = require('express');
const {createuser, affcheUsers, modifUser, AffAllUsers} = require("../Controlleurs/Users/controlleurUser");
const {connection, dechiffToken} = require('../Controlleurs/connection/connectionControlleurs');
const {CreateConversation, AfficheConversation, DeleteConversation, afficheUneConversation , filterMessage, deleteConvAllMessage} = require("../Controlleurs/Conversations/controlleurComversation");
const {addMessage,afficheMessages,deleteMessage} = require('../Controlleurs/Messages/controlleurMessages');
const route = express.Router();


//connection
route.post('/connection', connection);

//dechiffToken
route.get('/donnee/:token', dechiffToken);


//users
route.get('/user/:id', affcheUsers);
route.get('/users', AffAllUsers);
route.post('/user', createuser);
route.post('/modifUser/:id', modifUser); 


//Conversation
route.post('/conversation', CreateConversation);
route.get('/conversations/:id', AfficheConversation);
route.get('/conversation/:id', afficheUneConversation);
route.get('/filterMessage/:id', filterMessage);
//route.post('/filterConv', filtreComv);
route.put('/delAllMssg', deleteConvAllMessage);
route.put('/deleteConversation/:id', DeleteConversation );

//messages
route.post('/message', addMessage);
route.get('/messages/:id', afficheMessages);
route.delete('/message/:id', deleteMessage );

module.exports = route;