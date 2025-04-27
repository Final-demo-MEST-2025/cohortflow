import React, { useState } from 'react';
import { useOutletContext } from "react-router-dom";
import {
  ClockIcon,
  BellIcon,
  QuestionMarkCircleIcon,
  CheckCircleIcon,
  ChartPieIcon,
  UserIcon,
  CalendarIcon,
  MegaphoneIcon,
  DocumentIcon,
  ArrowUpTrayIcon,
  FolderOpenIcon,
  AcademicCapIcon,
  ChatBubbleLeftIcon,
  PencilIcon
} from '@heroicons/react/24/outline';

// Mock data
const mockLearnerData = {
  name: "Sarah Johnson",
  tasksToday: 3,
  unreadAnnouncements: 2,
  pendingQuizzes: 1,
  submittedAssignments: 8,
  progress: 68,
  nextDeadlineDays: 2,
  nextDeadlineType: "quiz"
};

const mockClassrooms = [
  {
    id: 1,
    name: "Web Dev Cohort 4",
    instructor: "Prof. Michael Chen",
    nextTask: "JavaScript Frameworks Quiz",
    dueDate: "Apr 28, 2025"
  },
  {
    id: 2,
    name: "UX Design Essentials",
    instructor: "Dr. Lisa Patel",
    nextTask: "User Research Analysis",
    dueDate: "May 3, 2025"
  },
  {
    id: 3,
    name: "Data Science Fundamentals",
    instructor: "Prof. James Wilson",
    nextTask: "Python Project Submission",
    dueDate: "May 5, 2025"
  }
];

const mockRecentActivity = [
  {
    id: 1,
    type: "announcement",
    title: "Guest lecture this Thursday",
    timestamp: "Today, 9:15 AM"
  },
  {
    id: 2,
    type: "resource",
    title: "Advanced CSS Techniques PDF",
    timestamp: "Yesterday, 2:30 PM"
  },
  {
    id: 3,
    type: "quiz",
    title: "React Hooks Quiz posted",
    timestamp: "Apr 25, 10:00 AM"
  },
  {
    id: 4,
    type: "announcement",
    title: "Project deadline extended",
    timestamp: "Apr 24, 4:45 PM"
  }
];

const mockTimeline = [
  {
    id: 1,
    type: "submission",
    title: "UI Wireframes assignment submitted",
    date: "Today, 8:45 AM"
  },
  {
    id: 2,
    type: "grade",
    title: "Received 92% on JavaScript Basics Quiz",
    date: "Yesterday, 11:20 AM"
  },
  {
    id: 3,
    type: "feedback",
    title: "Feedback received on HTML Project",
    date: "Apr 24, 3:15 PM"
  },
  {
    id: 4,
    type: "submission",
    title: "CSS Grid assignment submitted",
    date: "Apr 23, 9:30 AM"
  }
];

// Helper function to get appropriate icon for timeline items
const getTimelineIcon = (type) => {
  switch (type) {
    case 'submission':
      return <ArrowUpTrayIcon className="w-5 h-5 text-brand-600" />;
    case 'grade':
      return <AcademicCapIcon className="w-5 h-5 text-brand-600" />;
    case 'feedback':
      return <ChatBubbleLeftIcon className="w-5 h-5 text-brand-600" />;
    default:
      return <PencilIcon className="w-5 h-5 text-brand-600" />;
  }
};

// Statistic Card Component
const StatCard = ({ icon, title, value, color = "teal" }) => (
  <div className="bg-white rounded-lg shadow p-4 flex items-center gap-3 hover:shadow-md transition-shadow">
    <div className={`p-2 bg-${color}-100 rounded-full`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-600">{title}</p>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  </div>
);

// Classroom Card Component
const ClassroomCard = ({ classroom }) => (
  <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
    <h3 className="font-semibold text-lg mb-2">{classroom.name}</h3>
    <div className="flex items-center gap-2 text-gray-600 mb-3">
      <UserIcon className="w-4 h-4" />
      <span className="text-sm">{classroom.instructor}</span>
    </div>
    <div className="mt-4 pt-3 border-t border-gray-100">
      <p className="text-sm font-medium">Next Up:</p>
      <div className="flex items-center gap-2 mt-1">
        <CalendarIcon className="w-4 h-4 text-brandbrand-600" />
        <span className="text-sm">{classroom.nextTask}</span>
      </div>
      <p className="text-xs text-gray-500 mt-1">Due: {classroom.dueDate}</p>
    </div>
  </div>
);

// Activity Item Component
const ActivityItem = ({ item }) => {
  const getIcon = () => {
    switch (item.type) {
      case 'announcement':
        return <MegaphoneIcon className="w-5 h-5 text-brand-600" />;
      case 'resource':
        return <DocumentIcon className="w-5 h-5 text-brand-600" />;
      case 'quiz':
        return <QuestionMarkCircleIcon className="w-5 h-5 text-brand-600" />;
      default:
        return <BellIcon className="w-5 h-5 text-brand-600" />;
    }
  };

  return (
    <div className="flex items-start gap-3 py-2">
      <div className="p-1 bg-brand-50 rounded-full">
        {getIcon()}
      </div>
      <div>
        <p className="font-medium">{item.title}</p>
        <p className="text-xs text-gray-500">{item.timestamp}</p>
      </div>
    </div>
  );
};

// Shortcut Button Component
const ShortcutButton = ({ icon, text }) => (
  <button className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors">
    {icon}
    <span>{text}</span>
  </button>
);

// Timeline Item Component
const TimelineItem = ({ item }) => (
  <div className="flex items-start gap-3">
    <div className="p-1 bg-brand-50 rounded-full">
      {getTimelineIcon(item.type)}
    </div>
    <div>
      <p className="font-medium text-sm">{item.title}</p>
      <p className="text-xs text-gray-500">{item.date}</p>
    </div>
  </div>
);

// Main Learner Dashboard Component
const LearnerDashboard = () => {
  const [learner] = useState(mockLearnerData);
  const [classrooms] = useState(mockClassrooms);
  const [recentActivity] = useState(mockRecentActivity);
  const [timeline] = useState(mockTimeline);

  const greeting = useOutletContext();


  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto p-4 sm:p-6">
        {/* Welcome Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            { greeting }
          </div>
          <div className="mt-2 text-brand-600 font-medium flex items-center gap-1">
            <ClockIcon className="w-4 h-4" />
            <span>{learner.nextDeadlineDays} days until next {learner.nextDeadlineType}</span>
          </div>
        </div>

        {/* Quick Stats Panel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <StatCard 
            icon={<ClockIcon className="w-5 h-5 text-brand-600" />} 
            title="Tasks Due Today" 
            value={learner.tasksToday} 
          />
          <StatCard 
            icon={<BellIcon className="w-5 h-5 text-brand-600" />} 
            title="Unread Announcements" 
            value={learner.unreadAnnouncements} 
          />
          <StatCard 
            icon={<QuestionMarkCircleIcon className="w-5 h-5 text-brand-600" />} 
            title="Pending Quizzes" 
            value={learner.pendingQuizzes} 
          />
          <StatCard 
            icon={<CheckCircleIcon className="w-5 h-5 text-brand-600" />} 
            title="Submitted Assignments" 
            value={learner.submittedAssignments} 
          />
          <StatCard 
            icon={<ChartPieIcon className="w-5 h-5 text-brand-600" />} 
            title="Overall Progress" 
            value={`${learner.progress}%`} 
          />
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - My Classrooms */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-4">My Classrooms</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {classrooms.map(classroom => (
                  <ClassroomCard key={classroom.id} classroom={classroom} />
                ))}
              </div>
            </div>

            {/* Action Shortcuts */}
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
              <div className="flex flex-wrap gap-3">
                <ShortcutButton 
                  icon={<ArrowUpTrayIcon className="w-5 h-5" />} 
                  text="Submit Assignment" 
                />
                <ShortcutButton 
                  icon={<QuestionMarkCircleIcon className="w-5 h-5" />} 
                  text="Take Quiz" 
                />
                <ShortcutButton 
                  icon={<FolderOpenIcon className="w-5 h-5" />} 
                  text="View Materials" 
                />
                <ShortcutButton 
                  icon={<AcademicCapIcon className="w-5 h-5" />} 
                  text="View Grades" 
                />
              </div>
            </div>

            {/* Activity Timeline */}
            <div>
              <h2 className="text-xl font-bold mb-4">Activity Timeline</h2>
              <div className="bg-white rounded-lg shadow p-4">
                <div className="space-y-3">
                  {timeline.map(item => (
                    <TimelineItem key={item.id} item={item} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right column - What's New */}
          <div>
            <h2 className="text-xl font-bold mb-4">What is New</h2>
            <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 h-auto">
              <div className="space-y-2">
                {recentActivity.map(item => (
                  <ActivityItem key={item.id} item={item} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnerDashboard;