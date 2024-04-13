const express = require('express');
const Groups = require('../Models/Groups');
const GroupsMessage = require('../Models/GroupsMessage');
const User = require('../Models/User');
const router = express.Router();

router.post("/createGroup", async (req, res) => {
    const { groupName, members, admin } = req.body;
    try {
        const newGroup = await Groups.create({ groupName, members, admin,profile:""});
        newGroup.save();
        res.json({ msg: "Group Created Successfully", group: newGroup,Success:true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Some error occurred" });
    }
});

router.post("/sendmessage", async (req, res) => {
    const { senderId, groupId, text } = req.body;
    try {
        const newMessage = await GroupsMessage.create({ senderId, groupId, text });
        newMessage.save();
        res.json({ msg: "Message Sent Successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Some error occurred" });
    }
})

router.get("/getgroups/:userId", async (req, res) => {
    const { userId } = req.params;
    try {
        const groups = await Groups.find({ members: { $in: userId } });
        res.json(groups);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Some error occurred" });
    }
});

router.get("/getmessages/:groupId", async (req, res) => {
    const { groupId } = req.params;
    try {
        const messages = await GroupsMessage.find({ groupId });
        let newMessages = [];
        await Promise.all(messages.map(async (message) => {
            const user = await User.findById(message.senderId);
            const { date, senderId, text, _id } = message;
            newMessages.push({date,groupId,senderId,text,_id,name:user.name});
        }));
        res.json(newMessages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Some error occurred" });
    }
})

module.exports = router;