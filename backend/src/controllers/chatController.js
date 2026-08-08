const ChatMessage = require('../models/ChatMessage');
const Complaint = require('../models/Complaint');

// @desc    Get all chat messages for a complaint
// @route   GET /api/chat/:complaintId
// @access  Private
exports.getMessages = async (req, res, next) => {
  try {
    const { complaintId } = req.params;

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    // Auth check
    if (
      req.user.role === 'USER' &&
      complaint.creator.toString() !== req.user.id
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const messages = await ChatMessage.find({ complaint: complaintId })
      .populate('sender', 'name role avatar email')
      .sort({ createdAt: 1 });

    res.json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send a chat message on a complaint
// @route   POST /api/chat/:complaintId
// @access  Private
exports.sendMessage = async (req, res, next) => {
  try {
    const { complaintId } = req.params;
    const { message } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ success: false, message: 'Message text is required' });
    }

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    // Access check
    if (
      req.user.role === 'USER' &&
      complaint.creator.toString() !== req.user.id
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to send messages on this ticket' });
    }

    const newMessage = await ChatMessage.create({
      complaint: complaintId,
      sender: req.user.id,
      message: message.trim(),
    });

    await newMessage.populate('sender', 'name role avatar email');

    res.status(201).json({
      success: true,
      message: newMessage,
    });
  } catch (error) {
    next(error);
  }
};
