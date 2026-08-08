const Feedback = require('../models/Feedback');
const Complaint = require('../models/Complaint');

// @desc    Submit feedback for a resolved complaint
// @route   POST /api/feedback
// @access  Private (User)
exports.submitFeedback = async (req, res, next) => {
  try {
    const { complaintId, rating, comment } = req.body;

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    if (complaint.creator.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'You can only leave feedback on your own complaints' });
    }

    if (complaint.status !== 'RESOLVED') {
      return res.status(400).json({ success: false, message: 'Feedback can only be submitted for RESOLVED complaints' });
    }

    const existingFeedback = await Feedback.findOne({ complaint: complaintId });
    if (existingFeedback) {
      return res.status(400).json({ success: false, message: 'Feedback has already been submitted for this complaint' });
    }

    const feedback = await Feedback.create({
      complaint: complaintId,
      user: req.user.id,
      agent: complaint.assignedAgent,
      rating: Number(rating),
      comment: comment || '',
    });

    await feedback.populate([
      { path: 'user', select: 'name email' },
      { path: 'agent', select: 'name email department' },
      { path: 'complaint', select: 'ticketId title category' },
    ]);

    res.status(201).json({
      success: true,
      message: 'Thank you for your feedback!',
      feedback,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get feedback list (Admin/Agent/User)
// @route   GET /api/feedback
// @access  Private
exports.getFeedbacks = async (req, res, next) => {
  try {
    const filter = {};

    if (req.user.role === 'AGENT') {
      filter.agent = req.user.id;
    } else if (req.user.role === 'USER') {
      filter.user = req.user.id;
    }

    const feedbacks = await Feedback.find(filter)
      .populate('user', 'name email avatar')
      .populate('agent', 'name email department')
      .populate('complaint', 'ticketId title category status')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: feedbacks.length,
      feedbacks,
    });
  } catch (error) {
    next(error);
  }
};
