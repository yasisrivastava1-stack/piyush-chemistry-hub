import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Search, Shield, UserX, UserCheck, MoreVertical } from 'lucide-react';
import { format } from 'date-fns';

interface UserItem {
  id: string;
  displayName: string;
  email: string;
  role: string;
  status: string;
  createdAt: any;
  lastLogin: any;
}

export default function UsersManagement() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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
    <div className="overflow-hidden space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">User Management</h1>
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
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Joined</th>
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
                      {user.status === 'active' ? (
                        <span className="text-green-600 font-medium">● Active</span>
                      ) : (
                        <span className="text-red-500 font-medium">● Blocked</span>
                      )}
                    </td>
                    <td className="px-6 py-3 text-slate-500">
                      {user.createdAt ? format(user.createdAt.toDate(), 'MMM d, yyyy') : 'Unknown'}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <div className="flex items-center justify-end space-x-3">
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
    </div>
  );
}
