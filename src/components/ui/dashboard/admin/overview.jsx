import { useOutletContext } from 'react-router-dom';
import {
  Squares2X2Icon,
  UserGroupIcon,
  BuildingLibraryIcon,
  UsersIcon,
  InboxStackIcon,
  PlusIcon,
  PresentationChartLineIcon,
  WrenchIcon,
} from '@heroicons/react/24/outline';
import StatCard from './stat-card';
import ActionButton from './action-button';
import ActivityItem from './activity';



export default function AdminDashboard() {
  const greeting = useOutletContext();
  // Sample data
  const statsData = [
    { icon: Squares2X2Icon, label: "Total Programs", value: "12" },
    { icon: UserGroupIcon, label: "Total Cohorts", value: "8" },
    { icon: BuildingLibraryIcon, label: "Total Classrooms", value: "24" },
    { icon: UsersIcon, label: "Total Users", value: "156", subtext: "4 Admins, 12 Instructors, 140 Learners" },
    { icon: InboxStackIcon, label: "Active Resources", value: "87" }
  ];

  const actionButtons = [
    { icon: PlusIcon, label: "Create Program" },
    { icon: PlusIcon, label: "Add User" },
    { icon: PlusIcon, label: "Assign Instructor" },
    { icon: PresentationChartLineIcon, label: "View Attendance" },
    { icon: WrenchIcon, label: "Manage Resources" }
  ];

  const activities = [
    { message: "Program 'Web Dev 2025' was created", time: "2 hours ago" },
    { message: "Classroom 'Cohort 4' added by Admin", time: "3 hours ago" },
    { message: "New instructor John Doe assigned to UX Design cohort", time: "Yesterday" },
    { message: "Resource 'Advanced React Patterns' uploaded", time: "2 days ago" },
    { message: "15 new learners added to 'Data Science 101'", time: "3 days ago" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          { greeting }
        </div>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {statsData.map((stat, index) => (
            <StatCard
              key={index}
              icon={stat.icon}
              label={stat.label}
              value={stat.value}
              subtext={stat.subtext}
            />
          ))}
        </div>

        {/* Quick Action Buttons */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-3">
            {actionButtons.map((button, index) => (
              <ActionButton
                key={index}
                icon={button.icon}
                label={button.label}
              />
            ))}
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                Recent Activity
              </h2>
              <div className="space-y-1">
                {activities.map((activity, index) => (
                  <ActivityItem
                    key={index}
                    message={activity.message}
                    time={activity.time}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Charts/Trends Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                Cohort Engagement Trends
              </h2>
              <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                <span>Chart Placeholder</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};