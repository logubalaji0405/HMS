import express from "express";
import User from "../models/User.js";
import Message from "../models/Message.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public: doctors list
router.get("/doctors", async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" }).select(
      "_id name email specialization availability"
    );
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: "Failed to load doctors" });
  }
});

// Protected: conversation list
router.get("/conversations", protect, async (req, res) => {
  try {
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [{ sender: myId }, { receiver: myId }]
    })
      .populate("sender", "name role")
      .populate("receiver", "name role")
      .sort({ createdAt: -1 });

    const map = new Map();

    for (const msg of messages) {
      const otherUser =
        String(msg.sender._id) === String(myId) ? msg.receiver : msg.sender;

      if (!map.has(String(otherUser._id))) {
        map.set(String(otherUser._id), {
          user: otherUser,
          lastMessage: msg.message,
          updatedAt: msg.createdAt,
          unreadCount: 0
        });
      }

      if (
        String(msg.receiver._id) === String(myId) &&
        String(msg.sender._id) !== String(myId) &&
        !msg.isRead
      ) {
        map.get(String(otherUser._id)).unreadCount += 1;
      }
    }

    res.json(Array.from(map.values()));
  } catch (err) {
    res.status(500).json({ message: "Failed to load conversations" });
  }
});

// Protected: mark read
router.put("/read/:userId", protect, async (req, res) => {
  try {
    const myId = req.user._id;
    const otherUserId = req.params.userId;

    await Message.updateMany(
      {
        sender: otherUserId,
        receiver: myId,
        isRead: false
      },
      {
        $set: { isRead: true }
      }
    );

    res.json({ message: "Messages marked as read" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update read status" });
  }
});

// Protected: get messages
router.get("/:userId", protect, async (req, res) => {
  try {
    const myId = req.user._id;
    const otherUserId = req.params.userId;

    const messages = await Message.find({
      $or: [
        { sender: myId, receiver: otherUserId },
        { sender: otherUserId, receiver: myId }
      ]
    })
      .populate("sender", "name role")
      .populate("receiver", "name role")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Failed to load messages" });
  }
});

// Protected: send message
router.post("/", protect, async (req, res) => {
  try {
    const { receiverId, message } = req.body;

    if (!receiverId || !message || !message.trim()) {
      return res.status(400).json({
        message: "receiverId and message are required"
      });
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    const newMessage = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      message: message.trim()
    });

    const populatedMessage = await Message.findById(newMessage._id)
      .populate("sender", "name role")
      .populate("receiver", "name role");

    res.status(201).json(populatedMessage);
  } catch (err) {
    res.status(500).json({ message: "Failed to send message" });
  }
});

export default router;