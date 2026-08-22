import React, { useEffect, useState } from 'react';
import { collection, getCountFromServer, query, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Users, FileText, Video, Download, HelpCircle, BookOpen, Clock } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface Stats {
  totalUsers: number;
  activeUsers: number;
  class11Content: number;
  class12Content: number;
  totalNotes: number;
  totalVideos: number;
  totalQuestions: number;
}

const mockChartData = [
  { name: 'Mon', downloads: 120 },
  { name: 'Tue', downloads: 150 },
  { name: 'Wed', downloads: 180 },
  { name: 'Thu', downloads: 140 },
  { name: 'Fri', downloads: 200 },
  { name: 'Sat', downloads: 250 },
  { name: 'Sun', downloads: 310 },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    activeUsers: 0,
    class11Content: 0,
    class12Content: 0,
    totalNotes: 0,
    totalVideos: 0,
    totalQuestions: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const usersCol = collection(db, 'users');
        const contentCol = collection(db, 'content');
        const questionsCol = collection(db, 'questions');

        // Note: In a real app, complex queries might need composite indexes.
        const [
          totalUsersSnap,
          activeUsersSnap,
          c11Snap,
          c12Snap,
          notesSnap,
          videosSnap,
          questionsSnap
        ] = await Promise.all([
          getCountFromServer(usersCol),
          getCountFromServer(query(usersCol, where('status', '==', 'active'))),
          getCountFromServer(query(contentCol, where('class', '==', '11'))),
          getCountFromServer(query(contentCol, where('class', '==', '12'))),
          getCountFromServer(query(contentCol, where('type', 'in', ['pdf', 'notes']))),
          getCountFromServer(query(contentCol, where('type', '==', 'video'))),
          getCountFromServer(questionsCol)
        ]);

        setStats({
          totalUsers: totalUsersSnap.data().count,
          activeUsers: activeUsersSnap.data().count,
          class11Content: c11Snap.data().count,
          class12Content: c12Snap.data().count,
          totalNotes: notesSnap.data().count,
          totalVideos: videosSnap.data().count,
          totalQuestions: questionsSnap.data().count,
        });
      } catch (error) {
        console.error("Error fetching stats: ", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const statCards = [
    { name: 'Total Students', stat: stats.totalUsers, icon: Users, color: 'bg-blue-500' },
    { name: 'Active Students', stat: stats.activeUsers, icon: Users, color: 'bg-green-500' },
    { name: 'Class 11 Content', stat: stats.class11Content, icon: BookOpen, color: 'bg-indigo-500' },
    { name: 'Class 12 Content', stat: stats.class12Content, icon: BookOpen, color: 'bg-purple-500' },
    { name: 'Total Notes/PDFs', stat: stats.totalNotes, icon: FileText, color: 'bg-yellow-500' },
    { name: 'Total Videos', stat: stats.totalVideos, icon: Video, color: 'bg-red-500' },
    { name: 'Total Questions', stat: stats.totalQuestions, icon: HelpCircle, color: 'bg-teal-500' },
    { name: 'Recent Activity', stat: '24', icon: Clock, color: 'bg-orange-500' }, // Mock metric
  ];

  if (loading) {
    return <div className="p-8">Loading dashboard metrics...</div>;
  }

  return (
    <div className="overflow-hidden">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
        {statCards.map((item) => (
          <div key={item.name} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <p className="text-slate-500 text-[10px] uppercase font-bold">{item.name}</p>
              <item.icon className="h-4 w-4 text-slate-400" />
            </div>
            <div className="mt-2">
              <p className="text-2xl font-bold text-slate-900">{item.stat}</p>
              <p className="text-slate-400 text-[10px] mt-1 truncate">Real-time count</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="col-span-1 lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-sm">Downloads Over Time</h3>
              <a href="#" className="text-blue-600 text-[11px] font-semibold">View All</a>
            </div>
            <div className="h-64 w-full p-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                  <Bar dataKey="downloads" fill="#2563eb" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        <div className="col-span-1 space-y-6">
           <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-xl shadow-lg text-white">
            <h3 className="font-bold text-sm mb-2">Global Notification</h3>
            <p className="text-xs text-blue-100 mb-4">Broadcast a message to all students immediately about upcoming board exams.</p>
            <textarea className="w-full bg-blue-700/50 border border-blue-400/30 rounded p-2 text-xs text-white placeholder-blue-300" rows={3} placeholder="Type message here..."></textarea>
            <button className="w-full mt-3 py-2 bg-white text-blue-700 rounded text-xs font-bold hover:bg-blue-50">Send Broadcast</button>
          </div>
        </div>
      </div>
    </div>
  );
}
