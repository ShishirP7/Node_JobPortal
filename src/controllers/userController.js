const Employer = require("../models/employer_Model");
const MessageModal = require("../models/message_Model");
const JobSeeker = require("../models/SeekerModels/jobSeeker_Model");
const getAllMessages = async (req, res) => {
    try {
        const { userId } = req.query;

        const messagesSent = await MessageModal.find({ from: userId });
        const messagesReceived = await MessageModal.find({ to: userId });

        const messagesByRecipient = {};

        // Get user details for each message sender/recipient
        const allUserIds = new Set([...messagesSent.map(msg => msg.to), ...messagesReceived.map(msg => msg.from)]);
        const usersById = {};
        for (const userId of allUserIds) {
            const jobseeker = await JobSeeker.findById(userId);
            const employer = await Employer.findById(userId);
            usersById[userId] = jobseeker || employer;
        }

        messagesSent.forEach(message => {
            const recipientId = message.to;
            if (!messagesByRecipient[recipientId]) {
                messagesByRecipient[recipientId] = { user: usersById[recipientId], messages: [] };
            }
            messagesByRecipient[recipientId].messages.push(message);
        });

        messagesReceived.forEach(message => {
            const senderId = message.from;
            if (!messagesByRecipient[senderId]) {
                messagesByRecipient[senderId] = { user: usersById[senderId], messages: [] };
            }
            messagesByRecipient[senderId].messages.push(message);
        });

        const messagesArray = Object.values(messagesByRecipient);

        res.json({ success: true, data: messagesArray });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
}

const getUserMessage = async (req, res) => {
    const { to, from } = req.query;

    const sentMessages = await MessageModal.find({ to: to, from: from });
    const receivedMessage = await MessageModal.find({ to: from, from: to });

    res.json([...sentMessages, ...receivedMessage]);
};

const postMessage = async (req, res) => {
    const { from, to, text, timestamp } = req.body;

    try {
        const message = new MessageModal({ from, to, text, timestamp });
        await message.save();
        res.status(201).json({ data: message });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}



const getMessage = async (req, res) => {
    const { from, to } = req.query;

    try {
        const messages = await MessageModal.find({
            $or: [
                { from: from, to: to },
                { from: to, to: from }
            ]
        }).populate('from', '-password').populate('to', '-password').sort({ timestamp: 'asc' });

        res.json(messages);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = { getAllMessages, getUserMessage, getMessage, postMessage };