import React, { useEffect, useState } from 'react';
import { collection, getCountFromServer, query, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Users, FileText, Video, Download, HelpCircle, BookOpen, Clock } from 'lucide-react';

interface Stats {
  totalUsers: number;
  activeUsers: number;
  class11Content: number;
  class12Content: number;
  totalNotes: number;
  totalVideos: number;
  totalQuestions: number;
}

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

      <div className="grid grid-cols-1 gap-8">
        <div className="space-y-6">
           {/* Additional dashboard content can go here */}
        </div>
      </div>
    </div>
  );
}
