const Complaint = require('../models/Complaint');
const User = require('../models/User');
const Feedback = require('../models/Feedback');

// @desc    Get dashboard analytics & KPI stats (Admin only)
// @route   GET /api/analytics/dashboard
// @access  Private (Admin)
exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalComplaints = await Complaint.countDocuments();
    const pendingCount = await Complaint.countDocuments({ status: 'PENDING' });
    const assignedCount = await Complaint.countDocuments({ status: 'ASSIGNED' });
    const inProgressCount = await Complaint.countDocuments({ status: 'IN_PROGRESS' });
    const resolvedCount = await Complaint.countDocuments({ status: 'RESOLVED' });
    const rejectedCount = await Complaint.countDocuments({ status: 'REJECTED' });

    const totalUsers = await User.countDocuments({ role: 'USER' });
    const totalAgents = await User.countDocuments({ role: 'AGENT' });

    const resolutionRate = totalComplaints > 0 ? ((resolvedCount / totalComplaints) * 100).toFixed(1) : 0;

    // Complaints by Category
    const categoryStats = await Complaint.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $project: { category: '$_id', count: 1, _id: 0 } },
    ]);

    // Complaints by Priority
    const priorityStats = await Complaint.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } },
      { $project: { priority: '$_id', count: 1, _id: 0 } },
    ]);

    // Agent Performance Rankings
    const agents = await User.find({ role: 'AGENT' }).select('name email department');
    const agentPerformance = await Promise.all(
      agents.map(async (agent) => {
        const totalAssigned = await Complaint.countDocuments({ assignedAgent: agent._id });
        const resolved = await Complaint.countDocuments({ assignedAgent: agent._id, status: 'RESOLVED' });
        const pending = await Complaint.countDocuments({ assignedAgent: agent._id, status: { $in: ['ASSIGNED', 'IN_PROGRESS'] } });
        
        // Feedbacks for agent
        const feedbacks = await Feedback.find({ agent: agent._id });
        const avgRating = feedbacks.length > 0
          ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
          : 'N/A';

        return {
          agentId: agent._id,
          name: agent.name,
          department: agent.department,
          totalAssigned,
          resolved,
          pending,
          avgRating,
        };
      })
    );

    // Recent Activity / Recent Complaints
    const recentComplaints = await Complaint.find()
      .populate('creator', 'name email')
      .populate('assignedAgent', 'name department')
      .sort({ createdAt: -1 })
      .limit(6);

    res.json({
      success: true,
      stats: {
        totalComplaints,
        pendingCount,
        assignedCount,
        inProgressCount,
        resolvedCount,
        rejectedCount,
        totalUsers,
        totalAgents,
        resolutionRate,
      },
      categoryStats,
      priorityStats,
      agentPerformance,
      recentComplaints,
    });
  } catch (error) {
    next(error);
  }
};
