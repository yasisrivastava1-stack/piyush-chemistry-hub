import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { FolderOpen, Plus, Trash2 } from 'lucide-react';

interface Board {
  id: string;
  name: string;
}

interface ClassItem {
  id: string;
  name: string;
  boardId: string;
}

export default function ClassesAndBoards() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [newBoardName, setNewBoardName] = useState('');
  const [newClassName, setNewClassName] = useState('');
  const [selectedBoardId, setSelectedBoardId] = useState('');

  const [isSubmittingBoard, setIsSubmittingBoard] = useState(false);
  const [isSubmittingClass, setIsSubmittingClass] = useState(false);

  useEffect(() => {
    const qBoards = query(collection(db, 'boards'), orderBy('createdAt', 'asc'));
    const unsubscribeBoards = onSnapshot(qBoards, (snapshot) => {
      const b: Board[] = [];
      snapshot.forEach(doc => b.push({ id: doc.id, ...doc.data() } as Board));
      setBoards(b);
    });

    const qClasses = query(collection(db, 'classes'), orderBy('createdAt', 'asc'));
    const unsubscribeClasses = onSnapshot(qClasses, (snapshot) => {
      const c: ClassItem[] = [];
      snapshot.forEach(doc => c.push({ id: doc.id, ...doc.data() } as ClassItem));
      setClasses(c);
      setLoading(false);
    });

    return () => {
      unsubscribeBoards();
      unsubscribeClasses();
    };
  }, []);

  const handleAddBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBoardName.trim()) return;
    setIsSubmittingBoard(true);
    try {
      await addDoc(collection(db, 'boards'), {
        name: newBoardName,
        createdAt: serverTimestamp()
      });
      setNewBoardName('');
    } catch (error) {
      console.error("Error adding board:", error);
    }
    setIsSubmittingBoard(false);
  };

  const handleAddClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim() || !selectedBoardId) return;
    setIsSubmittingClass(true);
    try {
      await addDoc(collection(db, 'classes'), {
        name: newClassName,
        boardId: selectedBoardId,
        createdAt: serverTimestamp()
      });
      setNewClassName('');
    } catch (error) {
      console.error("Error adding class:", error);
    }
    setIsSubmittingClass(false);
  };

  const handleDeleteBoard = async (id: string) => {
    if (window.confirm("Delete this board?")) {
      await deleteDoc(doc(db, 'boards', id));
    }
  };

  const handleDeleteClass = async (id: string) => {
    if (window.confirm("Delete this class?")) {
      await deleteDoc(doc(db, 'classes', id));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center">
          <FolderOpen className="mr-2 h-5 w-5 text-blue-600" />
          Classes & Boards Manager
        </h1>
        <p className="text-xs text-slate-500 mt-1">Add and manage the educational boards and classes.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Boards Section */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h2 className="text-sm font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Boards (e.g. CBSE)</h2>
          
          <form onSubmit={handleAddBoard} className="flex space-x-2 mb-4">
            <input 
              type="text" 
              required
              placeholder="New Board Name" 
              value={newBoardName}
              onChange={e => setNewBoardName(e.target.value)}
              className="flex-1 text-xs border border-slate-200 rounded px-3 py-1.5 focus:ring-blue-500 focus:border-blue-500"
            />
            <button 
              type="submit" 
              disabled={isSubmittingBoard}
              className="bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center"
            >
              <Plus className="h-3 w-3 mr-1" /> Add
            </button>
          </form>

          <ul className="space-y-2">
            {boards.map(board => (
              <li key={board.id} className="flex items-center justify-between bg-slate-50 border border-slate-100 px-3 py-2 rounded text-xs">
                <span className="font-semibold text-slate-700">{board.name}</span>
                <button onClick={() => handleDeleteBoard(board.id)} className="text-red-500 hover:text-red-700 p-1">
                  <Trash2 className="h-3 w-3" />
                </button>
              </li>
            ))}
            {boards.length === 0 && !loading && (
              <li className="text-xs text-slate-500 text-center py-2">No boards added yet.</li>
            )}
          </ul>
        </div>

        {/* Classes Section */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h2 className="text-sm font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Classes</h2>
          
          <form onSubmit={handleAddClass} className="flex flex-col space-y-2 mb-4">
            <div className="flex space-x-2">
              <select 
                required
                value={selectedBoardId}
                onChange={e => setSelectedBoardId(e.target.value)}
                className="w-1/3 text-xs border border-slate-200 rounded px-3 py-1.5 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Board</option>
                {boards.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
              <input 
                type="text" 
                required
                placeholder="New Class Name (e.g. Class 11)" 
                value={newClassName}
                onChange={e => setNewClassName(e.target.value)}
                className="flex-1 text-xs border border-slate-200 rounded px-3 py-1.5 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button 
              type="submit" 
              disabled={isSubmittingClass || !selectedBoardId}
              className="bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
            >
              <Plus className="h-3 w-3 mr-1" /> Add Class
            </button>
          </form>

          <ul className="space-y-2">
            {classes.map(cls => {
              const boardName = boards.find(b => b.id === cls.boardId)?.name || 'Unknown Board';
              return (
                <li key={cls.id} className="flex items-center justify-between bg-slate-50 border border-slate-100 px-3 py-2 rounded text-xs">
                  <div>
                    <span className="font-semibold text-slate-700">{cls.name}</span>
                    <span className="text-[10px] text-slate-400 ml-2 uppercase">({boardName})</span>
                  </div>
                  <button onClick={() => handleDeleteClass(cls.id)} className="text-red-500 hover:text-red-700 p-1">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </li>
              );
            })}
            {classes.length === 0 && !loading && (
              <li className="text-xs text-slate-500 text-center py-2">No classes added yet.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
