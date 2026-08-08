const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const User = require('../models/User');
const Complaint = require('../models/Complaint');
const ChatMessage = require('../models/ChatMessage');
const Feedback = require('../models/Feedback');

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    console.log('Clearing existing data...');
    await User.deleteMany();
    await Complaint.deleteMany();
    await ChatMessage.deleteMany();
    await Feedback.deleteMany();

    console.log('Seeding Users & Roles...');

    // 1. Admin
    const admin = await User.create({
      name: 'System Administrator',
      email: 'admin@complaintpro.com',
      password: 'Admin@123',
      role: 'ADMIN',
      department: 'General',
      phone: '+1 (555) 019-2831',
    });

    // 2. Agents
    const agentTech = await User.create({
      name: 'Alex Vance (Tech Support)',
      email: 'agent.tech@complaintpro.com',
      password: 'Agent@123',
      role: 'AGENT',
      department: 'Technical',
      phone: '+1 (555) 014-9921',
    });

    const agentBilling = await User.create({
      name: 'Sarah Connor (Finance)',
      email: 'agent.billing@complaintpro.com',
      password: 'Agent@123',
      role: 'AGENT',
      department: 'Billing',
      phone: '+1 (555) 017-3342',
    });

    // 3. Regular Users
    const userJohn = await User.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'User@123',
      role: 'USER',
      department: 'General',
      phone: '+1 (555) 011-8877',
    });

    const userJane = await User.create({
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      password: 'User@123',
      role: 'USER',
      department: 'General',
      phone: '+1 (555) 012-4411',
    });

    console.log('Seeding Sample Complaints...');

    // Complaint 1: Technical Issue (IN_PROGRESS)
    const complaint1 = await Complaint.create({
      ticketId: 'CMP-1001',
      title: 'Database connection timeouts on dashboard analytics panel',
      description: 'Whenever I try to export monthly reports, the page spins for 30 seconds and returns a 504 Gateway Timeout error.',
      category: 'Technical',
      priority: 'High',
      status: 'IN_PROGRESS',
      creator: userJohn._id,
      assignedAgent: agentTech._id,
      statusHistory: [
        { status: 'PENDING', updatedBy: userJohn._id, note: 'Submitted ticket', timestamp: new Date(Date.now() - 3 * 86400000) },
        { status: 'ASSIGNED', updatedBy: admin._id, note: 'Assigned to Alex Vance', timestamp: new Date(Date.now() - 2 * 86400000) },
        { status: 'IN_PROGRESS', updatedBy: agentTech._id, note: 'Investigating query indexes and connection pool', timestamp: new Date(Date.now() - 1 * 86400000) },
      ],
    });

    // Chat for Complaint 1
    await ChatMessage.create({
      complaint: complaint1._id,
      sender: userJohn._id,
      message: 'Hello, any updates on the analytics export issue?',
    });

    await ChatMessage.create({
      complaint: complaint1._id,
      sender: agentTech._id,
      message: 'Hi John! We identified a heavy unindexed query on your large transaction logs. We are applying a composite index now.',
    });

    // Complaint 2: Billing Issue (RESOLVED)
    const complaint2 = await Complaint.create({
      ticketId: 'CMP-1002',
      title: 'Incorrect double charge on Pro subscription invoice #9921',
      description: 'My credit card was charged twice ($49.00 x 2) for the July billing cycle.',
      category: 'Billing',
      priority: 'Urgent',
      status: 'RESOLVED',
      creator: userJane._id,
      assignedAgent: agentBilling._id,
      resolutionNotes: 'Duplicate charge refunded to original card ending in 4412. Reference Refund #RF-8821.',
      resolvedAt: new Date(Date.now() - 86400000),
      statusHistory: [
        { status: 'PENDING', updatedBy: userJane._id, note: 'Submitted billing ticket', timestamp: new Date(Date.now() - 4 * 86400000) },
        { status: 'ASSIGNED', updatedBy: admin._id, note: 'Assigned to Sarah Connor', timestamp: new Date(Date.now() - 3 * 86400000) },
        { status: 'IN_PROGRESS', updatedBy: agentBilling._id, note: 'Processing refund with payment gateway', timestamp: new Date(Date.now() - 2 * 86400000) },
        { status: 'RESOLVED', updatedBy: agentBilling._id, note: 'Refund processed successfully', timestamp: new Date(Date.now() - 1 * 86400000) },
      ],
    });

    // Chat for Complaint 2
    await ChatMessage.create({
      complaint: complaint2._id,
      sender: agentBilling._id,
      message: 'Hi Jane, we have processed the $49.00 refund back to your card. It should reflect in 2-3 business days.',
    });

    await ChatMessage.create({
      complaint: complaint2._id,
      sender: userJane._id,
      message: 'Thank you Sarah for the super quick response!',
    });

    // Feedback for Complaint 2
    await Feedback.create({
      complaint: complaint2._id,
      user: userJane._id,
      agent: agentBilling._id,
      rating: 5,
      comment: 'Extremely fast resolution! Sarah fixed the billing issue within hours.',
    });

    // Complaint 3: Service Ticket (PENDING)
    await Complaint.create({
      ticketId: 'CMP-1003',
      title: 'Request for account department transfer & security audit',
      description: 'We need our account owner changed from old manager email to current IT lead.',
      category: 'Service',
      priority: 'Medium',
      status: 'PENDING',
      creator: userJohn._id,
      statusHistory: [
        { status: 'PENDING', updatedBy: userJohn._id, note: 'Submitted service request', timestamp: new Date() },
      ],
    });

    console.log('Seed completed successfully!');
    console.log(`
      --- DEMO CREDENTIALS ---
      Admin:   admin@complaintpro.com  / Admin@123
      Agent:   agent.tech@complaintpro.com / Agent@123
      Agent:   agent.billing@complaintpro.com / Agent@123
      User:    john.doe@example.com   / User@123
      User:    jane.smith@example.com  / User@123
    `);
  } catch (error) {
    console.error('Error during seeding:', error.message);
  }
};

if (require.main === module) {
  seedData().then(() => process.exit(0));
}

module.exports = seedData;
