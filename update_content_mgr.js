const fs = require('fs');
const content = fs.readFileSync('src/pages/admin/ContentManager.tsx', 'utf8');

let newContent = content.replace(
  `const CLASS_11_CHAPTERS = [
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
];`,
  `interface DbClass { id: string; name: string; }
interface DbChapter { id: string; name: string; classId: string; }
interface DbTopic { id: string; name: string; chapterId: string; }`
);

// update ContentItem
newContent = newContent.replace(
  `  chapter: string;
  type: string;`,
  `  chapter: string;
  topic?: string;
  type: string;`
);

// update state
newContent = newContent.replace(
  `  const [loading, setLoading] = useState(true);`,
  `  const [loading, setLoading] = useState(true);
  const [dbClasses, setDbClasses] = useState<DbClass[]>([]);
  const [dbChapters, setDbChapters] = useState<DbChapter[]>([]);
  const [dbTopics, setDbTopics] = useState<DbTopic[]>([]);`
);

// update useEffect
newContent = newContent.replace(
  `  useEffect(() => {
    const q = query(collection(db, 'content'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {`,
  `  useEffect(() => {
    const unsubClasses = onSnapshot(query(collection(db, 'classes')), (snap) => setDbClasses(snap.docs.map(d => ({id: d.id, ...d.data()} as DbClass))));
    const unsubChapters = onSnapshot(query(collection(db, 'chapters')), (snap) => setDbChapters(snap.docs.map(d => ({id: d.id, ...d.data()} as DbChapter))));
    const unsubTopics = onSnapshot(query(collection(db, 'topics')), (snap) => setDbTopics(snap.docs.map(d => ({id: d.id, ...d.data()} as DbTopic))));

    const q = query(collection(db, 'content'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {`
);

newContent = newContent.replace(
  `    return () => unsubscribe();
  }, []);`,
  `    return () => {
      unsubscribe();
      unsubClasses();
      unsubChapters();
      unsubTopics();
    };
  }, []);

  const selectedDbClass = dbClasses.find(c => c.name.includes(formData.class));
  const availableChapters = dbChapters.filter(c => selectedDbClass ? c.classId === selectedDbClass.id : true);
  const selectedDbChapter = dbChapters.find(c => c.name === formData.chapter);
  const availableTopics = selectedDbChapter ? dbTopics.filter(t => t.chapterId === selectedDbChapter.id) : [];`
);

// update formData
newContent = newContent.replace(
  `    chapter: '',
    type: 'pdf',`,
  `    chapter: '',
    topic: '',
    type: 'pdf',`
);

newContent = newContent.replace(
  `        chapter: '',
        type: 'pdf',`,
  `        chapter: '',
        topic: '',
        type: 'pdf',`
);


// update chapter select
newContent = newContent.replace(
  `                <select required value={formData.chapter} onChange={e => setFormData({...formData, chapter: e.target.value})} className="block w-full rounded border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-xs px-3 py-1.5 border">
                  <option value="">Select Chapter...</option>
                  {(formData.class === '11' ? CLASS_11_CHAPTERS : formData.class === '12' ? CLASS_12_CHAPTERS : []).map(chap => (
                    <option key={chap} value={chap}>{chap}</option>
                  ))}
                  <option value="Other">Other / General</option>
                </select>`,
  `                <select required value={formData.chapter} onChange={e => setFormData({...formData, chapter: e.target.value, topic: ''})} className="block w-full rounded border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-xs px-3 py-1.5 border">
                  <option value="">Select Chapter...</option>
                  {availableChapters.map(chap => (
                    <option key={chap.id} value={chap.name}>{chap.name}</option>
                  ))}
                  <option value="Other">Other / General</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Topic</label>
                <select value={formData.topic || ''} onChange={e => setFormData({...formData, topic: e.target.value})} className="block w-full rounded border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-xs px-3 py-1.5 border">
                  <option value="">Select Topic (Optional)...</option>
                  {availableTopics.map(topic => (
                    <option key={topic.id} value={topic.name}>{topic.name}</option>
                  ))}
                </select>`
);

// update display
newContent = newContent.replace(
  `                      <div className="text-[10px] text-slate-500 font-normal mt-0.5">{item.chapter}</div>`,
  `                      <div className="text-[10px] text-slate-500 font-normal mt-0.5">
                        {item.chapter} {item.topic && <span className="text-blue-500 mx-1">•</span>} {item.topic}
                      </div>`
);


fs.writeFileSync('src/pages/admin/ContentManager.tsx', newContent);
