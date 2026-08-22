import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, doc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { FileText, Plus, Search, Filter, MoreVertical, Edit2, Trash2, Eye, EyeOff, UploadCloud } from 'lucide-react';

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
  visibility: string;
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

export default function ContentManager() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuth();

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    class: '12',
    board: 'CBSE',
    subject: 'Chemistry',
    chapter: '',
    type: 'pdf',
    url: '', // Since no storage, we just use a URL input for now
    visibility: 'public',
    published: true,
  });

  useEffect(() => {
    const q = query(collection(db, 'content'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ContentItem[];
      setContent(items);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      let finalUrl = formData.url;

      if (file && formData.type !== 'video') {
        const storageRef = ref(storage, `content/${Date.now()}_${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        finalUrl = await new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(progress);
            },
            (error) => {
              console.error("Upload error:", error);
              reject(error);
            },
            async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(downloadURL);
            }
          );
        });
      }

      await addDoc(collection(db, 'content'), {
        ...formData,
        url: finalUrl,
        uploaderId: user?.uid,
        createdAt: serverTimestamp(),
      });

      setShowForm(false);
      setFile(null);
      setUploadProgress(0);
      setFormData({
        title: '',
        description: '',
        class: '12',
        board: 'CBSE',
        subject: 'Chemistry',
        chapter: '',
        type: 'pdf',
        url: '',
        visibility: 'public',
        published: true,
      });
    } catch (error) {
      console.error("Error adding content: ", error);
      alert("Failed to add content.");
    } finally {
      setIsUploading(false);
    }
  };

  const togglePublish = async (item: ContentItem) => {
    try {
      const docRef = doc(db, 'content', item.id);
      await updateDoc(docRef, { published: !item.published });
    } catch (error) {
      console.error("Error updating publish status: ", error);
    }
  };

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'content', id));
      setDeletingId(null);
    } catch (error) {
      console.error("Error deleting content: ", error);
    }
  };

  const filteredContent = content.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.chapter.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="overflow-hidden space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Content Management</h1>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded shadow-sm hover:bg-blue-700 flex items-center"
          >
            <Plus className="mr-1 h-4 w-4" />
            {showForm ? 'Cancel' : 'New Content'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-sm mb-4">Upload New Content</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="block w-full rounded border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-xs px-3 py-1.5 border" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Chapter</label>
                <select required value={formData.chapter} onChange={e => setFormData({...formData, chapter: e.target.value})} className="block w-full rounded border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-xs px-3 py-1.5 border">
                  <option value="">Select Chapter...</option>
                  {(formData.class === '11' ? CLASS_11_CHAPTERS : formData.class === '12' ? CLASS_12_CHAPTERS : []).map(chap => (
                    <option key={chap} value={chap}>{chap}</option>
                  ))}
                  <option value="Other">Other / General</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Class</label>
                <select value={formData.class} onChange={e => setFormData({...formData, class: e.target.value})} className="block w-full rounded border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-xs px-3 py-1.5 border">
                  <option value="11">Class 11</option>
                  <option value="12">Class 12</option>
                  <option value="other">Other</option>
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
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Content Type</label>
                <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value, url: ''})} className="block w-full rounded border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-xs px-3 py-1.5 border">
                  <option value="pdf">PDF Document</option>
                  <option value="notes">Notes</option>
                  <option value="video">Video Link</option>
                  <option value="question_paper">Question Paper</option>
                  <option value="sample_paper">Sample Paper</option>
                </select>
              </div>
              <div>
                {formData.type === 'video' ? (
                  <>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Video Link (YouTube/Vimeo)</label>
                    <input required type="url" value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} className="block w-full rounded border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-xs px-3 py-1.5 border" />
                  </>
                ) : (
                  <>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Upload File</label>
                    <input required type="file" onChange={e => setFile(e.target.files?.[0] || null)} className="block w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                  </>
                )}
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Description</label>
              <textarea rows={2} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="block w-full rounded border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-xs px-3 py-1.5 border"></textarea>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="published" checked={formData.published} onChange={e => setFormData({...formData, published: e.target.checked})} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded" />
              <label htmlFor="published" className="ml-2 block text-xs font-semibold text-slate-700">
                Publish immediately
              </label>
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <button type="button" onClick={() => setShowForm(false)} disabled={isUploading} className="px-4 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded shadow-sm hover:bg-slate-50 disabled:opacity-50">
                Cancel
              </button>
              <button type="submit" disabled={isUploading} className="px-4 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded shadow-sm hover:bg-blue-700 disabled:opacity-50 flex items-center">
                {isUploading ? (
                  <>
                    <UploadCloud className="mr-2 h-4 w-4 animate-bounce" />
                    Uploading... {Math.round(uploadProgress)}%
                  </>
                ) : (
                  'Save Content'
                )}
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
              placeholder="Search content by title or chapter..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="px-4 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded shadow-sm hover:bg-slate-50 flex items-center">
            <Filter className="h-3 w-3 mr-1" />
            Filter
          </button>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="min-w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-bold border-b border-slate-100">
              <tr>
                <th className="px-6 py-3">Title</th>
                <th className="px-6 py-3">Class/Board</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-4 text-center text-slate-500 font-medium">Loading content...</td></tr>
              ) : filteredContent.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-4 text-center text-slate-500 font-medium">No content found.</td></tr>
              ) : (
                filteredContent.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="px-6 py-3 font-medium text-slate-800">
                      <div>{item.title}</div>
                      <div className="text-[10px] text-slate-500 font-normal mt-0.5">{item.chapter}</div>
                    </td>
                    <td className="px-6 py-3 text-slate-500">
                      {item.class} / {item.board}
                    </td>
                    <td className="px-6 py-3">
                      <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-medium">
                        {item.type}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      {item.published ? (
                        <span className="text-green-600 font-medium">● Published</span>
                      ) : (
                        <span className="text-slate-400 font-medium">● Draft</span>
                      )}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <div className="flex items-center justify-end space-x-3">
                        <button onClick={() => togglePublish(item)} className="text-slate-400 hover:text-slate-600" title={item.published ? "Unpublish" : "Publish"}>
                          {item.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                        <button className="text-blue-600 hover:text-blue-700" title="Edit">
                          <Edit2 className="h-4 w-4" />
                        </button>
                        {deletingId === item.id ? (
                          <div className="flex items-center space-x-2">
                            <button onClick={() => handleDelete(item.id)} className="text-red-600 text-[10px] font-bold hover:underline uppercase">Confirm</button>
                            <button onClick={() => setDeletingId(null)} className="text-slate-500 text-[10px] hover:underline uppercase">Cancel</button>
                          </div>
                        ) : (
                          <button onClick={() => setDeletingId(item.id)} className="text-red-500 hover:text-red-600" title="Delete">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
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
