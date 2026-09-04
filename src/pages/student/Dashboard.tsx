import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, onSnapshot, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { FileText, Video, HelpCircle, ArrowRight, DownloadCloud, Bookmark, PlayCircle, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';

export default function StudentDashboard() {
  const { userData } = useAuth();
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    (window as any).gm_authFailure = () => {
      setMapError(true);
    };
  }, []);

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
            Hello, {userData?.displayName?.split(' ')[0] || 'Student'}! 👋 Your chemistry journey continues. Let's master those reactions and ace your board exams today.
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
        <Link to="/study-materials" className="group relative bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 dark:bg-blue-900/20 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10 flex items-start space-x-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shadow-sm">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-white text-lg transition-colors">Study Materials</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-snug transition-colors">Access notes, PDFs, and revision guides.</p>
            </div>
          </div>
        </Link>

        <Link to="/videos" className="group relative bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 dark:bg-purple-900/20 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10 flex items-start space-x-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300 shadow-sm">
              <Video className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-white text-lg transition-colors">Video Lectures</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-snug transition-colors">Watch chapter-wise detailed video lessons.</p>
            </div>
          </div>
        </Link>

        <Link to="/questions" className="group relative bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:shadow-orange-500/10 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 dark:bg-orange-900/20 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10 flex items-start space-x-4">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400 rounded-xl group-hover:bg-orange-600 group-hover:text-white transition-colors duration-300 shadow-sm">
              <HelpCircle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-white text-lg transition-colors">PYQs & Questions</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-snug transition-colors">Practice previous year questions and mock tests.</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Coaching Centre Info & Map */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col md:flex-row transition-colors">
        <div className="p-6 md:p-8 md:w-1/2 flex flex-col justify-center space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight mb-2 transition-colors">Our Coaching Centre</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 transition-colors">Visit us for offline classes or reach out for support.</p>
          </div>
          
          <div className="space-y-5">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
                  <Phone className="h-5 w-5" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 transition-colors">Contact Number</h3>
                <a href="tel:8563975583" className="text-lg font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                  8563975583
                </a>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
                  <MapPin className="h-5 w-5" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 transition-colors">Location</h3>
                <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed transition-colors">
                  Police Line, Subhash Nagar<br />
                  Near Neelam Beauty Parlour
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-100 dark:bg-slate-900 min-h-[300px] md:w-1/2 relative border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-700 transition-colors">
          {((import.meta as any).env.VITE_GOOGLE_MAPS_API_KEY || "").startsWith("AIza") && !mapError ? (
            <APIProvider 
              apiKey={(import.meta as any).env.VITE_GOOGLE_MAPS_API_KEY}
              onError={() => setMapError(true)}
            >
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
             <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 bg-slate-50 dark:bg-slate-800 transition-colors">
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-3 border border-slate-200 dark:border-slate-600 transition-colors">
                  <MapPin className="h-6 w-6 text-slate-400 dark:text-slate-500" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1 transition-colors">
                  {mapError || ((import.meta as any).env.VITE_GOOGLE_MAPS_API_KEY && !(import.meta as any).env.VITE_GOOGLE_MAPS_API_KEY.startsWith("AIza")) ? "Invalid Map Key" : "Interactive Map Disabled"}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 transition-colors">
                  {mapError || ((import.meta as any).env.VITE_GOOGLE_MAPS_API_KEY && !(import.meta as any).env.VITE_GOOGLE_MAPS_API_KEY.startsWith("AIza")) ? "Please provide a valid Google Maps API Key in settings (starts with 'AIza')." : "Provide VITE_GOOGLE_MAPS_API_KEY to view map."}
                </p>
              </div>
          )}
        </div>
      </div>

    </div>
  );
}
