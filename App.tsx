
import React, { useState, useCallback, useRef, useEffect } from 'react';
import Header from './components/Header.tsx';
import StepIndicator from './components/StepIndicator.tsx';
import ShareModal from './components/ShareModal.tsx';
import { TEAMS, Team, AppState } from './types.ts';
import { generateTifo } from './services/geminiService.ts';
import { addWatermark } from './utils/imageProcessor.ts';

interface GalleryItem {
  id: string;
  imageUrl: string;
  team: string;
  date: number;
}

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    image: null,
    selectedTeam: null,
    generatedImage: null,
    status: 'idle',
    errorMessage: null,
  });

  const [step, setStep] = useState(1);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [filterTeam, setFilterTeam] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const mockGallery: GalleryItem[] = [
      { id: 'm1', team: 'Sénégal', imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1200', date: Date.now() - 1000000 },
      { id: 'm2', team: 'Real Madrid', imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=1200', date: Date.now() - 2000000 },
      { id: 'm3', team: 'Côte d\'Ivoire', imageUrl: 'https://images.unsplash.com/photo-1518091043644-c1d445bb5124?auto=format&fit=crop&q=80&w=1200', date: Date.now() - 3000000 },
      { id: 'm4', team: 'PSG', imageUrl: 'https://images.unsplash.com/photo-1540747913346-19e3adbd17c3?auto=format&fit=crop&q=80&w=1200', date: Date.now() - 4000000 },
    ];
    setGallery(mockGallery);
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setState(prev => ({ ...prev, image: reader.result as string }));
        setStep(2);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTeamSelect = (team: Team) => {
    setState(prev => ({ ...prev, selectedTeam: team }));
  };

  const triggerGenerate = async () => {
    if (!state.image || !state.selectedTeam) return;

    setState(prev => ({ ...prev, status: 'processing', errorMessage: null }));
    setStep(3);

    try {
      const rawImage = await generateTifo(state.image, state.selectedTeam.name);
      const watermarkedImage = await addWatermark(rawImage);
      
      setState(prev => ({ ...prev, generatedImage: watermarkedImage, status: 'completed' }));
      
      const newItem: GalleryItem = {
        id: Math.random().toString(36).substr(2, 9),
        imageUrl: watermarkedImage,
        team: state.selectedTeam.name,
        date: Date.now()
      };
      setGallery(prev => [newItem, ...prev]);
    } catch (error) {
      console.error("Generation error:", error);
      setState(prev => ({ 
        ...prev, 
        status: 'error', 
        errorMessage: "Désolé, une erreur est survenue lors de la création de votre Tifo." 
      }));
    }
  };

  const resetApp = () => {
    setState({
      image: null,
      selectedTeam: null,
      generatedImage: null,
      status: 'idle',
      errorMessage: null,
    });
    setStep(1);
    setIsShareModalOpen(false);
  };

  const downloadImage = (url: string = state.generatedImage || '') => {
    if (url) {
      const link = document.createElement('a');
      link.href = url;
      link.download = `tifo-master-${state.selectedTeam?.id || 'fan'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const shareImage = async () => {
    if (!state.generatedImage) return;
    try {
      if (navigator.share) {
        const response = await fetch(state.generatedImage);
        const blob = await response.blob();
        const file = new File([blob], `tifo-${state.selectedTeam?.id}.png`, { type: 'image/png' });
        
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: 'Mon Tifo Master',
            text: `Regardez mon Tifo personnalisé pour supporter ${state.selectedTeam?.name} !`,
          });
          return;
        }
      }
      setIsShareModalOpen(true);
    } catch (err) {
      setIsShareModalOpen(true);
    }
  };

  const filteredGallery = gallery
    .filter(item => filterTeam === 'all' || item.team === filterTeam)
    .sort((a, b) => sortBy === 'recent' ? b.date - a.date : 0);

  const scrollToGallery = () => {
    galleryRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Header onGalleryClick={scrollToGallery} />

      <main className="flex-1">
        <section className="stadium-gradient relative py-16 px-4">
          <div className="container mx-auto text-center relative z-10">
            <h1 className="text-4xl md:text-6xl font-oswald font-bold uppercase tracking-tighter mb-4 text-white drop-shadow-lg">
              Devenez une <span className="text-emerald-400">Légende</span> du Stade
            </h1>
            <p className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto mb-10 drop-shadow-md">
              Créez votre propre Tifo géant personnalisé pour votre Nation ou votre Club favori.
            </p>
            <StepIndicator currentStep={step} />
          </div>
        </section>

        <section className="container mx-auto px-4 py-12">
          <div className="mb-24">
            {step === 1 && (
              <div className="max-w-xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-12 text-center shadow-2xl">
                <div className="mb-8">
                  <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-slate-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Importez votre photo</h2>
                  <p className="text-slate-400">Votre visage apparaîtra en mosaïque géante tenue par les supporters.</p>
                </div>
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                <button onClick={() => fileInputRef.current?.click()} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-900/20">
                  Choisir une photo
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="max-w-5xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-oswald font-bold uppercase">Choisissez votre équipe</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-10 max-h-[500px] overflow-y-auto p-2 scrollbar-hide">
                  {TEAMS.map((team) => (
                    <button key={team.id} onClick={() => handleTeamSelect(team)}
                      className={`relative p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${
                        state.selectedTeam?.id === team.id ? 'bg-emerald-500/10 border-emerald-500 ring-2' : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                      }`}>
                      <span className="text-4xl">{team.flag}</span>
                      <span className="font-bold text-sm text-center">{team.name}</span>
                    </button>
                  ))}
                </div>
                <div className="flex gap-4 max-w-md mx-auto">
                  <button onClick={() => setStep(1)} className="flex-1 bg-slate-800 text-white font-bold py-4 rounded-xl">Retour</button>
                  <button disabled={!state.selectedTeam} onClick={triggerGenerate}
                    className={`flex-[2] font-bold py-4 rounded-xl ${state.selectedTeam ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}>
                    Générer mon Tifo
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="max-w-5xl mx-auto">
                {state.status === 'processing' && (
                  <div className="text-center py-20 bg-slate-900 rounded-3xl border border-slate-800">
                    <div className="w-24 h-24 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mx-auto mb-8"></div>
                    <h2 className="text-2xl font-bold animate-pulse">Création du chef-d'œuvre...</h2>
                  </div>
                )}
                {state.status === 'completed' && state.generatedImage && (
                  <div className="flex flex-col gap-8">
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                      <img src={state.generatedImage} alt="Generated Tifo" className="w-full h-auto" />
                    </div>
                    <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
                      <h3 className="text-2xl font-bold font-oswald uppercase italic">Tifo Authentique !</h3>
                      <div className="flex gap-4 w-full md:w-auto">
                        <button onClick={resetApp} className="flex-1 border border-slate-700 text-white font-bold px-6 py-4 rounded-xl">Nouveau</button>
                        <button onClick={shareImage} className="flex-[2] bg-emerald-600 text-white font-bold px-8 py-4 rounded-xl">Partager</button>
                      </div>
                    </div>
                  </div>
                )}
                {state.status === 'error' && (
                   <div className="text-center py-20 bg-slate-900 rounded-3xl border border-red-900/50">
                     <h2 className="text-2xl font-bold text-white mb-4">Erreur</h2>
                     <p className="text-slate-400 mb-8">{state.errorMessage}</p>
                     <button onClick={() => setStep(2)} className="bg-slate-800 text-white font-bold px-8 py-4 rounded-xl">Réessayer</button>
                   </div>
                )}
              </div>
            )}
          </div>

          <section id="gallery" ref={galleryRef} className="pt-24 border-t border-slate-900">
            <h2 className="text-3xl font-oswald font-bold uppercase tracking-tight italic mb-8">Galerie de la <span className="text-emerald-400">Communauté</span></h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredGallery.map((item) => (
                <div key={item.id} className="group relative bg-slate-900 rounded-3xl overflow-hidden border border-slate-800">
                  <img src={item.imageUrl} alt={item.team} className="w-full aspect-[16/9] object-cover" />
                  <div className="p-5 flex items-center justify-between">
                    <span className="text-sm font-bold text-white">{item.team}</span>
                    <button onClick={() => downloadImage(item.imageUrl)} className="text-emerald-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </section>
      </main>

      <footer className="bg-slate-950 border-t border-slate-900 py-10 mt-20">
        <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} TifoMaster. Powered by Gemini AI.
        </div>
      </footer>

      <ShareModal 
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
        imageUrl={state.generatedImage || ''}
        teamName={state.selectedTeam?.name || ''}
        onDownload={() => downloadImage()}
      />
    </div>
  );
};

export default App;
