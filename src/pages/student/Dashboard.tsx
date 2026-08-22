import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, onSnapshot, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { FileText, Video, HelpCircle, ArrowRight, DownloadCloud, Bookmark, PlayCircle, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';

interface ContentItem {
  id: string;
  title: string;
  description: string;
  class: string;
  board: string;
  subject: string;
  chapter: string;
  topic?: string;
  type: string;
  url: string;
  published: boolean;
  createdAt: any;
}

export default function StudentDashboard() {
  const { userData } = useAuth();
  const [recentContent, setRecentContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userData) return;

    // Build query based on student's class.
    // Also, only show published content.
    const studentClass = userData.studentClass || '12';
    
    // Using a simpler query that doesn't require composite indexes if possible, 
    // but typically `published == true` and `class == studentClass` requires an index.
    // To avoid index errors during generation, we will fetch published and filter class client-side if needed,
    // or just assume the index might exist. Since I don't want to break if index is missing:
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
      // Sort in memory to avoid composite index requirement
      items.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(0);
        const dateB = b.createdAt?.toDate?.() || new Date(0);
        return dateB.getTime() - dateA.getTime();
      });
      setRecentContent(items.slice(0, 6)); // top 6 recent
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userData]);

  const getIconForType = (type: string) => {
    switch (type) {
      case 'video': return <PlayCircle className="h-4 w-4 text-purple-500" />;
      case 'notes': return <FileText className="h-4 w-4 text-blue-500" />;
      default: return <HelpCircle className="h-4 w-4 text-orange-500" />;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-3xl p-8 sm:p-10 text-white shadow-xl shadow-blue-900/20 flex flex-col md:flex-row items-center justify-between border border-white/10">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 -mb-16 w-48 h-48 bg-purple-400 opacity-20 rounded-full blur-2xl"></div>
        
        <div className="relative z-10 w-full md:w-2/3">
          <div className="mb-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-white uppercase drop-shadow-sm leading-tight">
              Piyush Chemistry
            </h1>
            <div className="text-xl sm:text-2xl font-bold tracking-[0.4em] uppercase text-blue-300 mt-1">
              Hub
            </div>
          </div>
          <p className="text-blue-50 font-medium text-lg max-w-xl leading-relaxed bg-white/5 inline-block px-4 py-2 rounded-xl backdrop-blur-sm border border-white/10">
            Welcome back, {userData?.displayName?.split(' ')[0] || 'Student'}! 👋 Your chemistry journey continues. Let's master those reactions and ace your board exams today.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="px-4 py-1.5 bg-white/20 hover:bg-white/30 transition-colors cursor-default rounded-full text-sm font-bold tracking-wide backdrop-blur-md border border-white/20 shadow-sm">
              Class {userData?.studentClass || '12'}
            </span>
            <span className="px-4 py-1.5 bg-white/20 hover:bg-white/30 transition-colors cursor-default rounded-full text-sm font-bold tracking-wide backdrop-blur-md border border-white/20 shadow-sm">
              {userData?.board || 'CBSE'} Board
            </span>
          </div>
        </div>
        <div className="hidden md:flex relative z-10 w-1/3 justify-end pr-4">
          <div className="w-32 h-32 bg-white/10 backdrop-blur-lg rounded-full flex items-center justify-center border border-white/20 shadow-2xl transform hover:scale-105 transition-transform duration-500">
            <FileText className="h-16 w-16 text-white/90 drop-shadow-lg" />
          </div>
        </div>
      </div>

      {/* Quick Stats / Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/study-materials" className="group relative bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10 flex items-start space-x-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shadow-sm">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg">Study Materials</h3>
              <p className="text-sm text-slate-500 mt-1 leading-snug">Access notes, PDFs, and revision guides.</p>
            </div>
          </div>
        </Link>

        <Link to="/videos" className="group relative bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10 flex items-start space-x-4">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300 shadow-sm">
              <Video className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg">Video Lectures</h3>
              <p className="text-sm text-slate-500 mt-1 leading-snug">Watch chapter-wise detailed video lessons.</p>
            </div>
          </div>
        </Link>

        <Link to="/questions" className="group relative bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-orange-500/10 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10 flex items-start space-x-4">
            <div className="p-3 bg-orange-100 text-orange-600 rounded-xl group-hover:bg-orange-600 group-hover:text-white transition-colors duration-300 shadow-sm">
              <HelpCircle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg">PYQs & Questions</h3>
              <p className="text-sm text-slate-500 mt-1 leading-snug">Practice previous year questions and mock tests.</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Coaching Centre Info & Map */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
        <div className="p-6 md:p-8 md:w-1/2 flex flex-col justify-center space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-2">Our Coaching Centre</h2>
            <p className="text-sm text-slate-500">Visit us for offline classes or reach out for support.</p>
          </div>
          
          <div className="space-y-5">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-blue-50 text-blue-600">
                  <Phone className="h-5 w-5" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Contact Number</h3>
                <a href="tel:8563975583" className="text-lg font-bold text-blue-600 hover:text-blue-700 transition-colors">
                  8563975583
                </a>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-blue-50 text-blue-600">
                  <MapPin className="h-5 w-5" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Location</h3>
                <p className="text-sm text-slate-700 font-medium leading-relaxed">
                  Police Line, Subhash Nagar<br />
                  Near Neelam Beauty Parlour
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-100 min-h-[300px] md:w-1/2 relative border-t md:border-t-0 md:border-l border-slate-200">
          {(import.meta as any).env.VITE_GOOGLE_MAPS_API_KEY ? (
            <APIProvider apiKey={(import.meta as any).env.VITE_GOOGLE_MAPS_API_KEY}>
              <Map 
                defaultCenter={{ lat: 28.6402, lng: 77.1086 }} // Approximated coordinate for Subhash Nagar, Delhi
                defaultZoom={15} 
                mapId="DEMO_MAP_ID"
                style={{ width: '100%', height: '100%', minHeight: '300px' }}
                disableDefaultUI={true}
                gestureHandling={'greedy'}
                internalUsageAttributionIds={["gmp_mcp_codeassist_v1_aistudio"]}
              >
                <AdvancedMarker position={{ lat: 28.6402, lng: 77.1086 }}>
                  <div className="bg-blue-600 text-white p-2.5 rounded-full shadow-xl border-2 border-white transform transition-transform hover:scale-110">
                    <MapPin className="h-5 w-5" fill="currentColor" />
                  </div>
                </AdvancedMarker>
              </Map>
            </APIProvider>
          ) : (
             <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 bg-slate-50">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3 border border-slate-200">
                  <MapPin className="h-6 w-6 text-slate-400" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">Interactive Map Disabled</h3>
                <p className="text-xs text-slate-500">Provide VITE_GOOGLE_MAPS_API_KEY to view map.</p>
              </div>
          )}
        </div>
      </div>

      {/* Recently Uploaded Content */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-800 tracking-tight">Recently Added for Class {userData?.studentClass || '12'}</h2>
          <Link to="/study-materials" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center">
            View All <ArrowRight className="ml-1 h-3 w-3" />
          </Link>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3].map(i => (
              <div key={i} className="bg-slate-100 rounded-xl h-32 animate-pulse" />
            ))}
          </div>
        ) : recentContent.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
            <FileText className="h-8 w-8 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-600">No new study material found.</p>
            <p className="text-xs text-slate-500 mt-1">Check back later when teachers upload new content for your class.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentContent.map(item => (
              <div key={item.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full overflow-hidden">
                <div className="p-5 flex-1">
                  <div className="flex justify-between items-start mb-3">
                    <span className="inline-flex items-center space-x-1 bg-slate-100 px-2 py-1 rounded text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                      {getIconForType(item.type)}
                      <span className="ml-1">{item.type.replace('_', ' ')}</span>
                    </span>
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">{item.board}</span>
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm mb-1 line-clamp-2">{item.title}</h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {item.chapter}
                    {item.topic && <span className="mx-1.5 text-slate-300">•</span>}
                    {item.topic && <span className="text-blue-500">{item.topic}</span>}
                  </p>
                </div>
                <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-medium">
                    {item.createdAt?.toDate().toLocaleDateString()}
                  </span>
                  <div className="flex space-x-2">
                    {item.type === 'video' ? (
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-purple-600 text-white text-[10px] font-bold uppercase rounded hover:bg-purple-700 flex items-center">
                        <PlayCircle className="mr-1 h-3 w-3" /> Watch
                      </a>
                    ) : (
                      <>
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-blue-600 text-white text-[10px] font-bold uppercase rounded hover:bg-blue-700 flex items-center">
                          <FileText className="mr-1 h-3 w-3" /> Read
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
