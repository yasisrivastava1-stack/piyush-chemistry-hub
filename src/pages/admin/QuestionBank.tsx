import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { HelpCircle, Plus, Search, Filter, Trash2, Edit2 } from 'lucide-react';

interface QuestionItem {
  id: string;
  text: string;
  type: string;
  class: string;
  board: string;
  chapter: string;
  difficulty: string;
  options?: string[];
  answer: string;
  explanation: string;
  createdAt: any;
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

export default function QuestionBank() {
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    text: '',
    type: 'mcq',
    class: '12',
    board: 'CBSE',
    chapter: '',
    difficulty: 'medium',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    answer: '',
    explanation: ''
  });

  useEffect(() => {
    const q = query(collection(db, 'questions'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as QuestionItem[];
      setQuestions(items);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let dataToSave: any = {
        text: formData.text,
        type: formData.type,
        class: formData.class,
        board: formData.board,
        chapter: formData.chapter,
        difficulty: formData.difficulty,
        answer: formData.answer,
        explanation: formData.explanation,
        createdAt: serverTimestamp()
      };

      if (formData.type === 'mcq') {
        dataToSave.options = [formData.optionA, formData.optionB, formData.optionC, formData.optionD];
      }

      await addDoc(collection(db, 'questions'), dataToSave);
      setShowForm(false);
      setFormData({
        text: '', type: 'mcq', class: '12', board: 'CBSE', chapter: '', difficulty: 'medium', optionA: '', optionB: '', optionC: '', optionD: '', answer: '', explanation: ''
      });
    } catch (error) {
      console.error("Error adding question: ", error);
      alert("Failed to add question.");
    }
  };

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'questions', id));
      setDeletingId(null);
    } catch (error) {
      console.error("Error deleting question: ", error);
    }
  };

  const filteredQuestions = questions.filter(q => 
    q.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.chapter.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="overflow-hidden space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Question Bank</h1>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded shadow-sm hover:bg-blue-700 flex items-center"
          >
            <Plus className="mr-1 h-4 w-4" />
            {showForm ? 'Cancel' : 'New Question'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-sm mb-4">Add New Question</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Question Text</label>
              <textarea required rows={2} value={formData.text} onChange={e => setFormData({...formData, text: e.target.value})} className="block w-full rounded border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-xs px-3 py-1.5 border"></textarea>
            </div>
            
            <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Question Type</label>
                <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="block w-full rounded border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-xs px-3 py-1.5 border">
                  <option value="mcq">Multiple Choice</option>
                  <option value="short">Short Answer</option>
                  <option value="long">Long Answer</option>
                  <option value="numerical">Numerical</option>
                  <option value="case">Case Based</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Class</label>
                <select value={formData.class} onChange={e => setFormData({...formData, class: e.target.value})} className="block w-full rounded border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-xs px-3 py-1.5 border">
                  <option value="11">Class 11</option>
                  <option value="12">Class 12</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Difficulty</label>
                <select value={formData.difficulty} onChange={e => setFormData({...formData, difficulty: e.target.value})} className="block w-full rounded border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-xs px-3 py-1.5 border">
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Board</label>
                <select value={formData.board} onChange={e => setFormData({...formData, board: e.target.value})} className="block w-full rounded border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-xs px-3 py-1.5 border">
                  <option value="CBSE">CBSE</option>
                  <option value="ICSE">ICSE</option>
                  <option value="ISC">ISC</option>
                  <option value="UP">UP Board</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Chapter</label>
                <select required value={formData.chapter} onChange={e => setFormData({...formData, chapter: e.target.value})} className="block w-full rounded border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-xs px-3 py-1.5 border">
                  <option value="">Select Chapter...</option>
                  {(formData.class === '11' ? CLASS_11_CHAPTERS : formData.class === '12' ? CLASS_12_CHAPTERS : []).map(chap => (
                    <option key={chap} value={chap}>{chap}</option>
                  ))}
                  <option value="Other">Other / General</option>
                </select>
              </div>
            </div>

            {formData.type === 'mcq' && (
              <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Option A</label>
                  <input required type="text" value={formData.optionA} onChange={e => setFormData({...formData, optionA: e.target.value})} className="block w-full rounded border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-xs px-3 py-1.5 border" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Option B</label>
                  <input required type="text" value={formData.optionB} onChange={e => setFormData({...formData, optionB: e.target.value})} className="block w-full rounded border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-xs px-3 py-1.5 border" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Option C</label>
                  <input required type="text" value={formData.optionC} onChange={e => setFormData({...formData, optionC: e.target.value})} className="block w-full rounded border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-xs px-3 py-1.5 border" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Option D</label>
                  <input required type="text" value={formData.optionD} onChange={e => setFormData({...formData, optionD: e.target.value})} className="block w-full rounded border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-xs px-3 py-1.5 border" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Correct Answer</label>
              <input required type="text" value={formData.answer} onChange={e => setFormData({...formData, answer: e.target.value})} placeholder={formData.type === 'mcq' ? "e.g., Option A" : "Enter correct answer"} className="block w-full rounded border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-xs px-3 py-1.5 border" />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Detailed Explanation / Solution</label>
              <textarea rows={2} value={formData.explanation} onChange={e => setFormData({...formData, explanation: e.target.value})} className="block w-full rounded border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-xs px-3 py-1.5 border"></textarea>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded shadow-sm hover:bg-slate-50">
                Cancel
              </button>
              <button type="submit" className="px-4 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded shadow-sm hover:bg-blue-700">
                Save Question
              </button>
            </div>
          </form>
        </div>
      )}

      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-2 sm:space-y-0">
          <div className="relative rounded max-w-sm w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-3 w-3 text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded focus:border-blue-500 focus:ring-blue-500"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-4">
          {loading ? (
            <p className="text-slate-500 text-center py-4 font-medium text-xs">Loading questions...</p>
          ) : filteredQuestions.length === 0 ? (
            <p className="text-slate-500 text-center py-4 font-medium text-xs">No questions found.</p>
          ) : (
            filteredQuestions.map((q) => (
              <div key={q.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="px-2 py-0.5 rounded font-medium text-[10px] bg-blue-50 text-blue-700 uppercase">{q.type}</span>
                      <span className="px-2 py-0.5 rounded font-medium text-[10px] bg-slate-100 text-slate-700">Class {q.class} - {q.board}</span>
                      <span className={`px-2 py-0.5 rounded font-medium text-[10px] uppercase ${
                        q.difficulty === 'hard' ? 'bg-red-50 text-red-700' :
                        q.difficulty === 'medium' ? 'bg-yellow-50 text-yellow-700' :
                        'bg-green-50 text-green-700'
                      }`}>{q.difficulty}</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-900">{q.text}</p>
                    <p className="mt-1 text-[10px] text-slate-500 uppercase font-bold">Chapter: {q.chapter}</p>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-700 p-1"><Edit2 className="h-4 w-4" /></button>
                    {deletingId === q.id ? (
                      <div className="flex items-center space-x-2">
                        <button onClick={() => handleDelete(q.id)} className="text-red-600 text-[10px] font-bold hover:underline uppercase">Confirm</button>
                        <button onClick={() => setDeletingId(null)} className="text-slate-500 text-[10px] hover:underline uppercase">Cancel</button>
                      </div>
                    ) : (
                      <button onClick={() => setDeletingId(q.id)} className="text-red-500 hover:text-red-600 p-1"><Trash2 className="h-4 w-4" /></button>
                    )}
                  </div>
                </div>
                {q.type === 'mcq' && q.options && (
                  <div className="px-6 py-3 bg-slate-50 border-t border-slate-100">
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 font-medium">
                      <li>A. {q.options[0]}</li>
                      <li>B. {q.options[1]}</li>
                      <li>C. {q.options[2]}</li>
                      <li>D. {q.options[3]}</li>
                    </ul>
                  </div>
                )}
                <div className="px-6 py-3 border-t border-slate-100 bg-white">
                  <p className="text-xs font-bold text-green-600">Answer: {q.answer}</p>
                  {q.explanation && (
                    <p className="mt-1 text-xs text-slate-600 font-medium">Explanation: {q.explanation}</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
