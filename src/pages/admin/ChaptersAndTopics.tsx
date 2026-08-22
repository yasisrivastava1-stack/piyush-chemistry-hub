import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc, getDocs, writeBatch, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { BookOpen, Plus, Trash2, Zap } from 'lucide-react';

interface ClassItem {
  id: string;
  name: string;
}

interface Chapter {
  id: string;
  name: string;
  classId: string;
}

interface Topic {
  id: string;
  name: string;
  chapterId: string;
}

const CLASS_11_CHAPTERS = [
  "Some Basic Concepts of Chemistry",
  "Structure of Atom",
  "Classification of Elements and Periodicity in Properties",
  "Chemical Bonding and Molecular Structure",
  "Thermodynamics",
  "Equilibrium",
  "Redox Reactions",
  "Organic Chemistry - Some Basic Principles and Techniques",
  "Hydrocarbons"
];

const CLASS_12_CHAPTERS = [
  "Solutions",
  "Electrochemistry",
  "Chemical Kinetics",
  "d and f Block Elements",
  "Coordination Compounds",
  "Haloalkanes and Haloarenes",
  "Alcohols, Phenols and Ethers",
  "Aldehydes, Ketones and Carboxylic Acids",
  "Amines",
  "Biomolecules"
];

export default function ChaptersAndTopics() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedChapterId, setSelectedChapterId] = useState('');
  
  const [newChapterName, setNewChapterName] = useState('');
  const [newTopicName, setNewTopicName] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  useEffect(() => {
    const unsubClasses = onSnapshot(query(collection(db, 'classes'), orderBy('createdAt', 'asc')), (snapshot) => {
      setClasses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ClassItem)));
    });

    const unsubChapters = onSnapshot(query(collection(db, 'chapters'), orderBy('createdAt', 'asc')), (snapshot) => {
      setChapters(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Chapter)));
    });

    const unsubTopics = onSnapshot(query(collection(db, 'topics'), orderBy('createdAt', 'asc')), (snapshot) => {
      setTopics(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Topic)));
    });

    return () => {
      unsubClasses();
      unsubChapters();
      unsubTopics();
    };
  }, []);

  const handleAddChapter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChapterName.trim() || !selectedClassId) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'chapters'), {
        name: newChapterName,
        classId: selectedClassId,
        createdAt: serverTimestamp()
      });
      setNewChapterName('');
    } catch (error) {
      console.error("Error adding chapter:", error);
    }
    setIsSubmitting(false);
  };

  const handleAddTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicName.trim() || !selectedChapterId) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'topics'), {
        name: newTopicName,
        chapterId: selectedChapterId,
        createdAt: serverTimestamp()
      });
      setNewTopicName('');
    } catch (error) {
      console.error("Error adding topic:", error);
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (collectionName: string, id: string) => {
    if (window.confirm("Are you sure you want to delete this?")) {
      await deleteDoc(doc(db, collectionName, id));
    }
  };

  const seedChapters = async () => {
    setIsSeeding(true);
    try {
      // Create classes if they don't exist
      let class11Id = classes.find(c => c.name.toLowerCase().includes('11'))?.id;
      let class12Id = classes.find(c => c.name.toLowerCase().includes('12'))?.id;

      if (!class11Id) {
        const docRef = await addDoc(collection(db, 'classes'), { name: 'Class 11', boardId: 'default', createdAt: serverTimestamp() });
        class11Id = docRef.id;
      }
      if (!class12Id) {
        const docRef = await addDoc(collection(db, 'classes'), { name: 'Class 12', boardId: 'default', createdAt: serverTimestamp() });
        class12Id = docRef.id;
      }

      // Add chapters
      const batch = writeBatch(db);
      
      const existing11 = chapters.filter(c => c.classId === class11Id).map(c => c.name);
      CLASS_11_CHAPTERS.forEach((ch, idx) => {
        if (!existing11.includes(ch)) {
          batch.set(doc(collection(db, 'chapters')), { name: ch, classId: class11Id, createdAt: new Date(Date.now() + idx) });
        }
      });

      const existing12 = chapters.filter(c => c.classId === class12Id).map(c => c.name);
      CLASS_12_CHAPTERS.forEach((ch, idx) => {
        if (!existing12.includes(ch)) {
          batch.set(doc(collection(db, 'chapters')), { name: ch, classId: class12Id, createdAt: new Date(Date.now() + 1000 + idx) });
        }
      });

      await batch.commit();
      alert("Successfully seeded chapters for Class 11 and 12!");
    } catch (err) {
      console.error("Seed error", err);
      alert("Error seeding chapters");
    }
    setIsSeeding(false);
  };

  const filteredChapters = selectedClassId ? chapters.filter(c => c.classId === selectedClassId) : chapters;
  const filteredTopics = selectedChapterId ? topics.filter(t => t.chapterId === selectedChapterId) : [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center">
            <BookOpen className="mr-2 h-5 w-5 text-blue-600" />
            Chapters & Topics Manager
          </h1>
          <p className="text-xs text-slate-500 mt-1">Add and manage chapters and topics for your classes.</p>
        </div>
        <button 
          onClick={seedChapters} 
          disabled={isSeeding}
          className="bg-indigo-50 border border-indigo-200 text-indigo-700 px-3 py-1.5 rounded text-xs font-semibold hover:bg-indigo-100 disabled:opacity-50 flex items-center"
        >
          <Zap className="mr-1 h-3 w-3" />
          Fetch Pre-filled 11th & 12th Chapters
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Chapters Section */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-4">
            <h2 className="text-sm font-bold text-slate-800">Chapters</h2>
            <select 
              value={selectedClassId}
              onChange={e => {
                setSelectedClassId(e.target.value);
                setSelectedChapterId('');
              }}
              className="text-xs border border-slate-200 rounded px-2 py-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Classes</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          
          <form onSubmit={handleAddChapter} className="flex flex-col space-y-2 mb-4">
            <div className="flex space-x-2">
              <input 
                type="text" 
                required
                placeholder="New Chapter Name" 
                value={newChapterName}
                onChange={e => setNewChapterName(e.target.value)}
                className="flex-1 text-xs border border-slate-200 rounded px-3 py-1.5 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button 
              type="submit" 
              disabled={isSubmitting || !selectedClassId}
              className="bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
              title={!selectedClassId ? "Please select a class filter first to add a chapter" : ""}
            >
              <Plus className="h-3 w-3 mr-1" /> Add Chapter to Selected Class
            </button>
          </form>

          <ul className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {filteredChapters.map(chap => {
              const className = classes.find(c => c.id === chap.classId)?.name || 'Unknown Class';
              return (
                <li 
                  key={chap.id} 
                  onClick={() => setSelectedChapterId(chap.id)}
                  className={`flex items-center justify-between border px-3 py-2 rounded text-xs cursor-pointer transition-colors ${selectedChapterId === chap.id ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-slate-50 border-slate-100 hover:bg-slate-100'}`}
                >
                  <div>
                    <span className="font-semibold text-slate-700">{chap.name}</span>
                    {!selectedClassId && <span className="text-[10px] text-slate-400 ml-2 uppercase">({className})</span>}
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete('chapters', chap.id); }} className="text-red-500 hover:text-red-700 p-1">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </li>
              );
            })}
            {filteredChapters.length === 0 && (
              <li className="text-xs text-slate-500 text-center py-2">No chapters found.</li>
            )}
          </ul>
        </div>

        {/* Topics Section */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 opacity-100 transition-opacity">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-4">
            <h2 className="text-sm font-bold text-slate-800">Topics</h2>
          </div>
          
          {selectedChapterId ? (
            <>
              <div className="mb-4 text-xs p-2 bg-blue-50 text-blue-800 rounded border border-blue-100 font-medium">
                Viewing topics for: <strong>{chapters.find(c => c.id === selectedChapterId)?.name}</strong>
              </div>
              <form onSubmit={handleAddTopic} className="flex space-x-2 mb-4">
                <input 
                  type="text" 
                  required
                  placeholder="New Topic Name" 
                  value={newTopicName}
                  onChange={e => setNewTopicName(e.target.value)}
                  className="flex-1 text-xs border border-slate-200 rounded px-3 py-1.5 focus:ring-blue-500 focus:border-blue-500"
                />
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center"
                >
                  <Plus className="h-3 w-3 mr-1" /> Add Topic
                </button>
              </form>

              <ul className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {filteredTopics.map(topic => (
                  <li key={topic.id} className="flex items-center justify-between bg-slate-50 border border-slate-100 px-3 py-2 rounded text-xs">
                    <span className="font-semibold text-slate-700">{topic.name}</span>
                    <button onClick={() => handleDelete('topics', topic.id)} className="text-red-500 hover:text-red-700 p-1">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </li>
                ))}
                {filteredTopics.length === 0 && (
                  <li className="text-xs text-slate-500 text-center py-2">No topics added to this chapter yet.</li>
                )}
              </ul>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-center px-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                <BookOpen className="h-5 w-5 text-slate-400" />
              </div>
              <p className="text-sm font-semibold text-slate-600">No Chapter Selected</p>
              <p className="text-xs text-slate-500 mt-1">Select a chapter from the left panel to manage its topics.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
