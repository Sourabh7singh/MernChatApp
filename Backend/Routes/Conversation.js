const express = require('express');
const Conversation = require('../Models/Conversation');
const User = require('../Models/User');
const Message = require('../Models/Message');
const Groups = require('../Models/Groups');
const AuthMiddleWare = require('../Middlewares/AuthMiddleWare');
const router = express.Router();

//Non Realtime Routes
router.post("/sendMessage",AuthMiddleWare, async (req, res) => {
    const senderId = req.user.id;
    //Conversation with person done before
    if (req.body.ConversationId) {
        const {ConversationId,message,date}=req.body;
        const Messages = await Message.create({ conversationId:ConversationId, senderId, text: message,date })
        Messages.save();
        const conversation = await Conversation.findById(ConversationId);
        conversation.lastMessage = {message,senderId,date};
        await conversation.save();
        res.json({ msg: "Message Sent Successfully" });
    }
    //New Conversation totally
    else {
        try {
            const { receiverId, message,date } = req.body;
            //Check if conversation with this sender and receiver exists or not
            let ConversationRoom = await Conversation.findOne({ members: { $all: [senderId, receiverId] } });
            if(!ConversationRoom){
                //Create Conversations
                ConversationRoom = await Conversation.create({ members: [senderId, receiverId] })
                await ConversationRoom.save();
            }
            //Send Message
            const Messages = await Message.create({ conversationId: ConversationRoom._id, senderId, text: message,date })
            Messages.save();
            //update last message
            ConversationRoom.lastMessage = {message,senderId,date};
            await ConversationRoom.save();
            res.json({ msg: "Message Sent Successfully" });
        } catch (error) {
            res.status(500).json({ msg: "Some error occurred" });
            console.error(error);
        }
    }

})


// Fetch conversations that are previously done with anyone or Recent Conversations
router.get("/fetchConversations", AuthMiddleWare , async (req, res) => {
    const userId = req.user.id;
    let Allconversations = [];
    try {
        const ConversationRoom = await Conversation.find({ members: { $in: userId } });
        const userPromises = [];

        ConversationRoom.forEach((item) => {
            const { members } = item;
            members.forEach((id) => {
                if (id.toString() !== userId.toString()) {
                    userPromises.push(User.findById(id));
                }
            });
        });

        const usersData = await Promise.all(userPromises);

        ConversationRoom.forEach((item) => {
            const { members } = item;
            members
                .filter((id) => id.toString() !== userId.toString())
                .forEach((id) => {
                    const user = usersData.find((user) => user._id.toString() === id.toString());
                    if (user) {
                        Allconversations.push({
                            id: user._id,
                            name: user.name,
                            username: user.username,
                            profile: user.profile,
                            conversationId: item._id,
                            lastMessage: item.lastMessage
                        });
                    }
                });
        });

        res.json(Allconversations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Some error occurred" });
    }
});



router.post("/fetchMessages",AuthMiddleWare,async(req,res)=>{
    const senderId = req.user.id;
    const {receiverId} = req.body;
    const before = req.body.before?req.body.before:Date.now();
    try {
        const conversation = await Conversation.findOne({ members: { $all: [senderId, receiverId] } });    
        if(!conversation){
            return res.json([]);
        }
        const conversationId = conversation._id;
        const messages = await Message.find({
            conversationId,
            date: { $lte: before }
        }).sort({ date: -1 }).limit(20);

        // Append username to the message object for frontend usage
        await Promise.all(messages.map(async (message) => {
            const sender = await User.findById(message.senderId);
            message.senderUsername = sender.username;
            return message;
        }));
        messages.reverse();
        res.json(messages)
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Some error occurred" });
    }
})

router.delete("/deleteConversation/:conversationId",async(req,res)=>{
    const {conversationId} = req.params;
    try {
        await Conversation.findByIdAndDelete(conversationId);
        await Message.deleteMany({conversationId});
        res.json({msg:"Conversation Deleted Successfully"})
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Some error occurred" });
    }
})

router.post("/deleteMessage",async(req,res)=>{
    const {text,date} = req.body;
    try {
        const message = await Message.findOne({text,date});
        if(!message){
            return res.json({msg:"Message Not Found",Success:false});
        }
        await Message.findByIdAndDelete(message._id);
        res.json({msg:"Message Deleted Successfully",Success:true});
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Some error occurred" });
    }
})


module.exports = router;