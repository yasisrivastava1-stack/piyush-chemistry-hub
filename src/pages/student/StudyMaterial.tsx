import React, { useEffect, useState } from 'react';
import { collection, query, onSnapshot, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { FileText, Search, PlayCircle, HelpCircle, DownloadCloud } from 'lucide-react';

interface ContentItem {
  id: string;
  title: string;
  description: string;
  class: string;
  board: string;
  subject: string;
  chapter: string;
  type: string;
  url: string;
  published: boolean;
  createdAt: any;
}

export default function StudyMaterial() {
  const { userData } = useAuth();
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedChapter, setSelectedChapter] = useState('all');

  useEffect(() => {
    if (!userData) return;

    const studentClass = userData.studentClass || '12';
    
    const q = query(
      collection(db, 'content'),
      where('published', '==', true)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: ContentItem[] = [];
      snapshot.forEach(doc => {
        const data = doc.data() as ContentItem;
        if (data.class === studentClass) {
          items.push({ id: doc.id, ...data });
        }
      });
      
      items.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(0);
        const dateB = b.createdAt?.toDate?.() || new Date(0);
        return dateB.getTime() - dateA.getTime();
      });

      setContent(items);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userData]);

  const chapters = Array.from(new Set(content.map(c => c.chapter))).filter(Boolean);

  const filteredContent = content.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.chapter.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || item.type === selectedType;
    const matchesChapter = selectedChapter === 'all' || item.chapter === selectedChapter;
    
    return matchesSearch && matchesType && matchesChapter;
  });

  const getIconForType = (type: string) => {
    switch (type) {
      case 'video': return <PlayCircle className="h-4 w-4 text-purple-500" />;
      case 'notes': return <FileText className="h-4 w-4 text-blue-500" />;
      default: return <HelpCircle className="h-4 w-4 text-orange-500" />;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Study Materials</h1>
          <p className="text-sm text-slate-500 mt-1">Class {userData?.studentClass} | {userData?.board} Board</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title or chapter..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-4">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="all">All Types</option>
            <option value="notes">Notes</option>
            <option value="pdf">PDFs</option>
            <option value="video">Videos</option>
            <option value="question_paper">Question Papers</option>
          </select>
          <select
            value={selectedChapter}
            onChange={(e) => setSelectedChapter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white max-w-[200px]"
          >
            <option value="all">All Chapters</option>
            {chapters.map(ch => (
              <option key={ch} value={ch}>{ch}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="bg-slate-100 rounded-xl h-32 animate-pulse" />
          ))}
        </div>
      ) : filteredContent.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-700">No materials found</h3>
          <p className="text-sm text-slate-500 mt-2">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContent.map(item => (
            <div key={item.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full overflow-hidden">
              <div className="p-5 flex-1">
                <div className="flex justify-between items-start mb-3">
                  <span className="inline-flex items-center space-x-1 bg-slate-100 px-2 py-1 rounded text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                    {getIconForType(item.type)}
                    <span className="ml-1">{item.type.replace('_', ' ')}</span>
                  </span>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">{item.board}</span>
                </div>
                <h3 className="font-bold text-slate-800 text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-slate-500 font-medium mb-3">{item.chapter}</p>
                {item.description && (
                  <p className="text-xs text-slate-600 line-clamp-2">{item.description}</p>
                )}
              </div>
              <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-medium">
                  {item.createdAt?.toDate().toLocaleDateString()}
                </span>
                <div className="flex space-x-2">
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-blue-600 text-white text-[10px] font-bold uppercase rounded hover:bg-blue-700 flex items-center">
                    <FileText className="mr-1 h-3 w-3" /> Read
                  </a>
                  {item.type !== 'video' && (
                    <a href={item.url} download target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-slate-200 text-slate-700 text-[10px] font-bold uppercase rounded hover:bg-slate-300 flex items-center">
                      <DownloadCloud className="mr-1 h-3 w-3" /> Save
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
