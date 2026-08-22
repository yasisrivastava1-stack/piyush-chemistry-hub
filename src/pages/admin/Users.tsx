import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Search, Shield, UserX, UserCheck, Eye, X, BookOpen, Clock, Calendar, Mail, GraduationCap } from 'lucide-react';
import { format } from 'date-fns';

interface UserItem {
  id: string;
  displayName: string;
  email: string;
  role: string;
  status: string;
  createdAt: any;
  lastLogin: any;
  studentClass?: string;
  board?: string;
  phone?: string;
}

export default function UsersManagement() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as UserItem[];
      setUsers(items);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const toggleStatus = async (user: UserItem) => {
    try {
      const newStatus = user.status === 'active' ? 'blocked' : 'active';
      await updateDoc(doc(db, 'users', user.id), { status: newStatus });
    } catch (error) {
      console.error("Error updating user status: ", error);
    }
  };

  const toggleRole = async (user: UserItem) => {
    try {
      const newRole = user.role === 'admin' ? 'student' : 'admin';
      await updateDoc(doc(db, 'users', user.id), { role: newRole });
    } catch (error) {
      console.error("Error updating user role: ", error);
    }
  };

  const filteredUsers = users.filter(user => 
    (user.displayName && user.displayName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Student & User Management</h1>
          <p className="text-sm text-slate-500 mt-1">Manage user accounts and view detailed activity breakdowns.</p>
        </div>
      </div>

      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-2 sm:space-y-0">
          <div className="relative rounded max-w-sm w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-3 w-3 text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded focus:border-blue-500 focus:ring-blue-500"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="min-w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-bold border-b border-slate-100">
              <tr>
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Class/Board</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-4 text-center text-slate-500 font-medium">Loading users...</td></tr>
              ) : filteredUsers.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-4 text-center text-slate-500 font-medium">No users found.</td></tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50">
                    <td className="px-6 py-3 font-medium text-slate-800">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm mr-3">
                          {user.displayName ? user.displayName.charAt(0).toUpperCase() : '?'}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-900">{user.displayName || 'No Name'}</div>
                          <div className="text-[10px] text-slate-500 font-normal">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <span className={`px-2 py-0.5 rounded font-medium ${user.role === 'admin' ? 'bg-purple-50 text-purple-700' : 'bg-slate-100 text-slate-700'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      {user.role === 'student' ? (
                        <span className="text-slate-600 font-medium">
                          {user.studentClass ? `Class ${user.studentClass}` : 'N/A'} • {user.board || 'N/A'}
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-3">
                      {user.status === 'active' ? (
                        <span className="text-green-600 font-medium">● Active</span>
                      ) : (
                        <span className="text-red-500 font-medium">● Blocked</span>
                      )}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <div className="flex items-center justify-end space-x-3">
                        <button onClick={() => setSelectedUser(user)} className="text-blue-600 hover:text-blue-700" title="View Details & Activity">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button onClick={() => toggleRole(user)} className="text-purple-600 hover:text-purple-700" title={user.role === 'admin' ? 'Demote to Student' : 'Make Admin'}>
                          <Shield className="h-4 w-4" />
                        </button>
                        <button onClick={() => toggleStatus(user)} className={`${user.status === 'active' ? 'text-red-500 hover:text-red-600' : 'text-green-600 hover:text-green-700'}`} title={user.status === 'active' ? 'Block User' : 'Unblock User'}>
                          {user.status === 'active' ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-lg font-bold text-slate-800">Student Profile & Activity</h2>
              <button onClick={() => setSelectedUser(null)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="flex items-start space-x-4 mb-8">
                <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-600 font-bold text-2xl shadow-inner border border-blue-200/50">
                  {selectedUser.displayName ? selectedUser.displayName.charAt(0).toUpperCase() : '?'}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900">{selectedUser.displayName || 'Unnamed Student'}</h3>
                  <div className="flex items-center text-sm text-slate-500 mt-1 space-x-4">
                    <span className="flex items-center"><Mail className="h-3 w-3 mr-1" /> {selectedUser.email}</span>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <span className={`px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold rounded-full ${selectedUser.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                      {selectedUser.role}
                    </span>
                    <span className={`px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold rounded-full ${selectedUser.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {selectedUser.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center">
                    <GraduationCap className="h-4 w-4 mr-1.5 text-blue-500" /> Academic Details
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Class:</span>
                      <span className="font-semibold text-slate-800">{selectedUser.studentClass || 'Not Set'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Board:</span>
                      <span className="font-semibold text-slate-800">{selectedUser.board || 'Not Set'}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center">
                    <Clock className="h-4 w-4 mr-1.5 text-purple-500" /> Account Timeline
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Joined:</span>
                      <span className="font-semibold text-slate-800">
                        {selectedUser.createdAt ? format(selectedUser.createdAt.toDate(), 'MMM d, yyyy') : 'Unknown'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Last Login:</span>
                      <span className="font-semibold text-slate-800">
                        {selectedUser.lastLogin ? format(selectedUser.lastLogin.toDate(), 'MMM d, yyyy • h:mm a') : 'Unknown'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center border-b border-slate-100 pb-2">
                  <BookOpen className="h-4 w-4 mr-2 text-indigo-500" /> Activity Breakdown
                </h4>
                
                <div className="bg-white rounded-lg border border-slate-200 overflow-hidden text-sm">
                  <div className="p-8 text-center bg-slate-50">
                    <Calendar className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-slate-600 font-medium">Detailed progress tracking coming soon</p>
                    <p className="text-xs text-slate-500 mt-1">This student has been verified and registered on the platform.</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
