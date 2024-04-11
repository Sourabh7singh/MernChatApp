const express = require('express');
const Conversation = require('../Models/Conversation');
const User = require('../Models/User');
const Message = require('../Models/Message');
const Groups = require('../Models/Groups');
const router = express.Router();

router.post("/sendMessage", async (req, res) => {
    //Conversation with person done before
    if (req.body.ConversationId) {
        const {senderId,ConversationId,message}=req.body;
        const Messages = await Message.create({ conversationId:ConversationId, senderId, text: message })
        Messages.save();
        res.json({ msg: "Message Sent Successfully" })

    }
    //New Conversation totally
    else {
        try {
            const { senderId, receiverId, message } = req.body;
            //Check if conversation with this sender and receiver exists or not
            let ConversationRoom = await Conversation.findOne({ members: { $all: [senderId, receiverId] } });
            if(!ConversationRoom){
                //Create Conversations
                ConversationRoom = await Conversation.create({ members: [senderId, receiverId] })
                await ConversationRoom.save();
            }
            //Send Message
            const Messages = await Message.create({ conversationId: ConversationRoom._id, senderId, text: message })
            Messages.save();
            res.json({ msg: "Message Sent Successfully" })
        } catch (error) {
            res.status(500).json({ msg: "Some error occurred" });
            console.log(error);
        }
    }

})

//Fetch conversations that are previously done with anyone or Recent Conversations
router.get("/fetchConversations/:userId", async (req, res) => {
    const userId = req.params.userId;
    var Allconversation = [];
    try {
        const ConversationRoom = await Conversation.find({ members: { $in: userId } });
        const userPromises = [];

        ConversationRoom.forEach((item) => {
            const { members } = item;
            members.forEach((id) => {
                userPromises.push(User.findById(id));
            });
        });
        const usersData = await Promise.all(userPromises);
        ConversationRoom.forEach((item, index) => {
            const { members } = item;
            const userNames = members.map((id) => {
                const user = usersData.find((user) => user._id.toString() === id.toString());
                return { id: user._id, name: user.name, username: user.username, profile: user.profile,conversationId:item._id };
            });            
            Allconversation.push(userNames);
        });
        res.json(Allconversation);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Some error occurred" });
    }
});

router.post("/fetchMessages",async(req,res)=>{
    const {senderId,receiverId} = req.body;
    try {
        const conversation = await Conversation.findOne({ members: { $all: [senderId, receiverId] } });    
        if(!conversation){
            return res.json([]);
        }
        const conversationId = conversation._id;
        const messages = await Message.find({conversationId})
        res.json(messages)
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Some error occurred" });
    }
})

// Groups
router.post("/createGroup", async (req, res) => {
    const { name,members,admin } = req.body;
    try {
        const newGroup = await Groups.create({ name,members,admin });
        newGroup.save();
        res.json({ msg: "Group Created Successfully",group:newGroup });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Some error occurred" });
    }
});


module.exports = router;