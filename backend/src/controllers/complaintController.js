const Complaint = require('../models/Complaint');
const ChatMessage = require('../models/ChatMessage');
const User = require('../models/User');

// Helper to generate custom ticket ID (e.g. CMP-1042)
const generateTicketId = async () => {
  const count = await Complaint.countDocuments();
  const nextNum = 1000 + count + 1;
  return `CMP-${nextNum}`;
};

// @desc    Create new complaint
// @route   POST /api/complaints
// @access  Private (User)
exports.createComplaint = async (req, res, next) => {
  try {
    const { title, description, category, priority, attachments } = req.body;

    const ticketId = await generateTicketId();

    const complaint = await Complaint.create({
      ticketId,
      title,
      description,
      category: category || 'Other',
      priority: priority || 'Medium',
      creator: req.user.id,
      attachments: attachments || [],
      statusHistory: [
        {
          status: 'PENDING',
          updatedBy: req.user.id,
          note: 'Complaint submitted by user',
          timestamp: new Date(),
        },
      ],
    });

    // Auto-assignment attempt if an agent matching the category exists
    const matchingAgent = await User.findOne({ role: 'AGENT', department: category, isActive: true });
    if (matchingAgent) {
      complaint.assignedAgent = matchingAgent._id;
      complaint.status = 'ASSIGNED';
      complaint.statusHistory.push({
        status: 'ASSIGNED',
        updatedBy: req.user.id,
        note: `Automatically assigned to ${matchingAgent.name} (${matchingAgent.department})`,
        timestamp: new Date(),
      });
      await complaint.save();
    }

    // Populate creator & agent info
    await complaint.populate([
      { path: 'creator', select: 'name email phone' },
      { path: 'assignedAgent', select: 'name email department' },
    ]);

    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully',
      complaint,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all complaints (Filterable by role & criteria)
// @route   GET /api/complaints
// @access  Private
exports.getComplaints = async (req, res, next) => {
  try {
    const { status, category, priority, search } = req.query;

    const filter = {};

    // Role-based visibility scoping
    if (req.user.role === 'USER') {
      filter.creator = req.user.id;
    } else if (req.user.role === 'AGENT') {
      filter.assignedAgent = req.user.id;
    }
    // ADMIN sees all by default

    // Additional query filters
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;

    if (search) {
      filter.$or = [
        { ticketId: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const complaints = await Complaint.find(filter)
      .populate('creator', 'name email phone')
      .populate('assignedAgent', 'name email department')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single complaint details
// @route   GET /api/complaints/:id
// @access  Private
exports.getComplaintById = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('creator', 'name email phone avatar')
      .populate('assignedAgent', 'name email department phone avatar')
      .populate('statusHistory.updatedBy', 'name role');

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    // Access check
    if (
      req.user.role === 'USER' &&
      complaint.creator._id.toString() !== req.user.id
    ) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    if (
      req.user.role === 'AGENT' &&
      complaint.assignedAgent &&
      complaint.assignedAgent._id.toString() !== req.user.id
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized for this assigned ticket' });
    }

    res.json({
      success: true,
      complaint,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update complaint status & resolution notes (Agent/Admin)
// @route   PUT /api/complaints/:id/status
// @access  Private (Agent/Admin)
exports.updateComplaintStatus = async (req, res, next) => {
  try {
    const { status, resolutionNotes, note } = req.body;

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    // Authorization check
    if (
      req.user.role === 'AGENT' &&
      complaint.assignedAgent &&
      complaint.assignedAgent.toString() !== req.user.id
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this ticket' });
    }

    if (status) {
      complaint.status = status;
      if (status === 'RESOLVED' || status === 'REJECTED') {
        complaint.resolvedAt = new Date();
      }
    }

    if (resolutionNotes !== undefined) {
      complaint.resolutionNotes = resolutionNotes;
    }

    complaint.statusHistory.push({
      status: complaint.status,
      updatedBy: req.user.id,
      note: note || `Status changed to ${complaint.status}`,
      timestamp: new Date(),
    });

    await complaint.save();

    // Create system chat notification message
    await ChatMessage.create({
      complaint: complaint._id,
      sender: req.user.id,
      message: `[System Update]: Complaint status updated to ${complaint.status}. ${note ? `Note: ${note}` : ''}`,
      isSystemNote: true,
    });

    await complaint.populate([
      { path: 'creator', select: 'name email' },
      { path: 'assignedAgent', select: 'name email department' },
    ]);

    res.json({
      success: true,
      message: `Complaint updated to ${complaint.status}`,
      complaint,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Assign or reassign agent to complaint (Admin only)
// @route   PUT /api/complaints/:id/assign
// @access  Private (Admin)
exports.assignAgent = async (req, res, next) => {
  try {
    const { agentId } = req.body;

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    const agent = await User.findById(agentId);
    if (!agent || agent.role !== 'AGENT') {
      return res.status(400).json({ success: false, message: 'Invalid agent ID specified' });
    }

    complaint.assignedAgent = agent._id;
    if (complaint.status === 'PENDING') {
      complaint.status = 'ASSIGNED';
    }

    complaint.statusHistory.push({
      status: complaint.status,
      updatedBy: req.user.id,
      note: `Assigned to Agent ${agent.name} (${agent.department})`,
      timestamp: new Date(),
    });

    await complaint.save();

    await ChatMessage.create({
      complaint: complaint._id,
      sender: req.user.id,
      message: `[System Update]: Ticket assigned to Agent ${agent.name} (${agent.department}).`,
      isSystemNote: true,
    });

    await complaint.populate([
      { path: 'creator', select: 'name email' },
      { path: 'assignedAgent', select: 'name email department' },
    ]);

    res.json({
      success: true,
      message: `Agent ${agent.name} assigned successfully`,
      complaint,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete complaint (Admin only)
// @route   DELETE /api/complaints/:id
// @access  Private (Admin)
exports.deleteComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    await ChatMessage.deleteMany({ complaint: complaint._id });
    await complaint.deleteOne();

    res.json({
      success: true,
      message: 'Complaint and associated chats deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
