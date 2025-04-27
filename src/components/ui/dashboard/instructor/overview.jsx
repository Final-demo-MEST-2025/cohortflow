import { useState } from 'react';
import { useOutletContext } from "react-router-dom";
import {
  UserCircleIcon,
  UsersIcon,
  ClipboardDocumentListIcon,
  ArrowDownTrayIcon,
  QuestionMarkCircleIcon,
  DocumentTextIcon,
  ChatBubbleBottomCenterTextIcon,
  MegaphoneIcon,
  EyeIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

export default function InstructorDashboard() {
  const greeting = useOutletContext()
  // Placeholder data
  const [instructor, setInstructor] = useState({
    name: "Dr. Sarah Johnson",
    classesToday: 2
  });

  const [classrooms, setClassrooms] = useState([
    { id: 1, name: "Web Dev Cohort 4", learners: 24, upcomingAssignments: 3, recentSubmissions: 8 },
    { id: 2, name: "UX Design Fundamentals", learners: 18, upcomingAssignments: 1, recentSubmissions: 5 },
    { id: 3, name: "Data Science Basics", learners: 32, upcomingAssignments: 2, recentSubmissions: 12 },
    { id: 4, name: "Mobile App Development", learners: 22, upcomingAssignments: 4, recentSubmissions: 9 }
  ]);

  const [stats, setStats] = useState({
    assignmentsToReview: 15,
    quizzesToGrade: 8,
    projectsInProgress: 42,
    feedbackGiven: 87
  });

  const [deadlines, setDeadlines] = useState([
    { id: 1, date: "Apr 28", title: "Final Project Submission", classroom: "Web Dev Cohort 4", type: "assignment" },
    { id: 2, date: "Apr 30", title: "Midterm Quiz", classroom: "Data Science Basics", type: "quiz" },
    { id: 3, date: "May 5", title: "User Research Report", classroom: "UX Design Fundamentals", type: "project" },
    { id: 4, date: "May 10", title: "Database Design Project", classroom: "Web Dev Cohort 4", type: "project" }
  ]);

  const [submissions, setSubmissions] = useState([
    { id: 1, learner: "Alex Kim", task: "HTML/CSS Project", classroom: "Web Dev Cohort 4", submittedAt: "Today, 10:23 AM" },
    { id: 2, learner: "Jamie Rodriguez", task: "User Personas", classroom: "UX Design Fundamentals", submittedAt: "Today, 9:45 AM" },
    { id: 3, learner: "Taylor Wong", task: "Python Basics Quiz", classroom: "Data Science Basics", submittedAt: "Yesterday, 4:30 PM" },
    { id: 4, learner: "Morgan Smith", task: "React Components", classroom: "Web Dev Cohort 4", submittedAt: "Yesterday, 2:15 PM" }
  ]);

  // dark:  dark:bg-gray-900  dark:text-gray-100
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            {greeting}
            <div className="mt-4 md:mt-0 bg-brand-50 darkz:bg-brand-900/30 p-3 rounded-lg flex items-center">
              <CalendarIcon className="h-5 w-5 text-brand-600 dark:text-brand-400 mr-2" />
              <span className="font-medium text-brand-700 darkz:text-brand-300">
                {instructor.classesToday} classes today
              </span>
            </div>
          </div>
        </header>

        {/* Quick Stats */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
          <div className="flex flex-wrap gap-4">
            <StatCard
              icon={
                <ClipboardDocumentListIcon className="h-6 w-6 text-brand-600 darkz:text-brand-400" />
              }
              title="Assignments to Review"
              value={stats.assignmentsToReview}
            />
            <StatCard
              icon={
                <QuestionMarkCircleIcon className="h-6 w-6 text-sky-600 dark:text-sky-400" />
              }
              title="Quizzes to Grade"
              value={stats.quizzesToGrade}
            />
            <StatCard
              icon={
                <DocumentTextIcon className="h-6 w-6 text-blue-600 darkz:text-blue-400" />
              }
              title="Projects In Progress"
              value={stats.projectsInProgress}
            />
            <StatCard
              icon={
                <ChatBubbleBottomCenterTextIcon className="h-6 w-6 text-green-600 darkz:text-green-400" />
              }
              title="Feedback Given"
              value={`${stats.feedbackGiven}%`}
            />
          </div>
        </section>

        {/* Action Shortcuts */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <ShortcutButton
              icon={<MegaphoneIcon className="h-5 w-5" />}
              text="Post Announcement"
            />
            <ShortcutButton
              icon={<ClipboardDocumentListIcon className="h-5 w-5" />}
              text="Create Assignment"
            />
            <ShortcutButton
              icon={<QuestionMarkCircleIcon className="h-5 w-5" />}
              text="Create Quiz"
            />
            <ShortcutButton
              icon={<ArrowDownTrayIcon className="h-5 w-5" />}
              text="View Submissions"
            />
          </div>
        </section>

        {/* Classrooms Grid */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">My Classrooms</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {classrooms.map((classroom) => (
              <ClassroomCard key={classroom.id} classroom={classroom} />
            ))}
          </div>
        </section>

        {/* Two Column Layout for Deadlines and Submissions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Deadlines */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Upcoming Deadlines</h2>
            <div className="bg-white darkz:bg-gray-800 rounded-lg shadow p-4 h-auto">
              <ul className="space-y-4">
                {deadlines.map((deadline) => (
                  <DeadlineItem key={deadline.id} deadline={deadline} />
                ))}
              </ul>
            </div>
          </section>

          {/* Recent Submissions */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Recent Submissions</h2>
            <div className="bg-white darkz:bg-gray-800 rounded-lg shadow p-4 overflow-x-auto scrollbar-none md:scrollbar-thin md:scrollbar-thumb-brand-200 md:scrollbar-track-transparent">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b darkz:border-gray-700">
                    <th className="text-left py-3 px-2">Learner</th>
                    <th className="text-left py-3 px-2">Task</th>
                    <th className="text-left py-3 px-2 hidden md:table-cell">
                      Classroom
                    </th>
                    <th className="text-left py-3 px-2 hidden md:table-cell">
                      Submitted
                    </th>
                    <th className="text-right py-3 px-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((submission) => (
                    <tr
                      key={submission.id}
                      className="border-b darkz:border-gray-700"
                    >
                      <td className="py-3 px-2 flex items-center">
                        <UserCircleIcon className="h-6 w-6 text-gray-500 darkz:text-gray-400 mr-2" />
                        <span className="truncate max-w-[120px]">
                          {submission.learner}
                        </span>
                      </td>
                      <td className="py-3 px-2">{submission.task}</td>
                      <td className="py-3 px-2 hidden md:table-cell">
                        {submission.classroom}
                      </td>
                      <td className="py-3 px-2 hidden md:table-cell text-gray-600 darkz:text-gray-400 text-sm">
                        {submission.submittedAt}
                      </td>
                      <td className="py-3 px-2 text-right">
                        <button className="text-brand-600 darkz:text-brand-400 hover:text-brand-800 darkz:hover:text-brand-300 p-1">
                          <EyeIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function ClassroomCard({ classroom }) {
  return (
    <div className="bg-white darkz:bg-gray-800 rounded-lg shadow p-5 hover:shadow-md transition-shadow mb-10">
      <h3 className="font-bold text-lg mb-3">{classroom.name}</h3>
      <div className="space-y-2">
        <div className="flex items-center text-gray-600 darkz:text-gray-400">
          <UsersIcon className="h-5 w-5 mr-2" />
          <span>{classroom.learners} Learners</span>
        </div>
        <div className="flex items-center text-gray-600 darkz:text-gray-400">
          <ClipboardDocumentListIcon className="h-5 w-5 mr-2" />
          <span>{classroom.upcomingAssignments} Upcoming Assignments</span>
        </div>
        <div className="flex items-center text-gray-600 darkz:text-gray-400">
          <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
          <span>{classroom.recentSubmissions} Recent Submissions</span>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200 darkz:border-gray-700">
        <button className="text-brand-600 darkz:text-brand-400 font-medium text-sm hover:text-brand-800 darkz:hover:text-brand-300">
          View Classroom →
        </button>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value }) {
  return (
    <div className="flex items-center bg-white darkz:bg-gray-800 p-4 rounded-lg shadow flex-1 min-w-[180px]">
      <div className="mr-3">{icon}</div>
      <div>
        <p className="text-sm text-gray-600 darkz:text-gray-400">{title}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );
}

function ShortcutButton({ icon, text }) {
  return (
    <button className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
      {icon}
      <span>{text}</span>
    </button>
  );
}

function DeadlineItem({ deadline }) {
  const getIcon = (type) => {
    switch(type) {
      case 'quiz':
        return <QuestionMarkCircleIcon className="h-5 w-5 text-sky-500 darkz:text-sky-400" />;
      case 'project':
        return <DocumentTextIcon className="h-5 w-5 text-blue-500 darkz:text-blue-400" />;
      default:
        return <ClipboardDocumentListIcon className="h-5 w-5 text-brand-500 darkz:text-brandsky-400" />;
    }
  };

  return (
    <li className="flex items-start">
      <div className="bg-gray-100 darkz:bg-gray-700 text-center rounded p-2 mr-3 w-16">
        <span className="block text-xs text-gray-500 darkz:text-gray-400">DUE</span>
        <span className="font-bold">{deadline.date}</span>
      </div>
      <div className="flex-1">
        <div className="flex items-center">
          {getIcon(deadline.type)}
          <h4 className="font-medium ml-2">{deadline.title}</h4>
        </div>
        <p className="text-sm text-gray-600 darkz:text-gray-400 mt-1">{deadline.classroom}</p>
      </div>
    </li>
  );
}