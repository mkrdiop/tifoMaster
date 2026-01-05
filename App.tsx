
import React, { useState, useCallback, useRef } from 'react';
import Header from './components/Header';
import StepIndicator from './components/StepIndicator';
import { TEAMS, Team, AppState } from './types';
import { generateTifo } from './services/geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    image: null,
    selectedTeam: null,
    generatedImage: null,
    status: 'idle',
    errorMessage: null,
  });

  const [step, setStep] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      const result = await generateTifo(state.image, state.selectedTeam.name);
      setState(prev => ({ ...prev, generatedImage: result, status: 'completed' }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        status: 'error', 
        errorMessage: "Désolé, une erreur est survenue lors de la création de votre Tifo. Veuillez réessayer." 
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
  };

  const downloadImage = () => {
    if (state.generatedImage) {
      const link = document.createElement('a');
      link.href = state.generatedImage;
      link.download = `tifo-master-${state.selectedTeam?.id || 'fan'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const shareImage = async () => {
    if (!state.generatedImage) return;

    try {
      // Convert base64 to blob for sharing
      const response = await fetch(state.generatedImage);
      const blob = await response.blob();
      const file = new File([blob], `tifo-${state.selectedTeam?.id}.png`, { type: 'image/png' });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Mon Tifo Master',
          text: `Regardez mon Tifo personnalisé pour supporter ${state.selectedTeam?.name} ! Créez le vôtre sur TifoMaster.`,
        });
      } else {
        // Fallback: Just trigger download and alert if sharing isn't supported
        downloadImage();
        alert("Le partage direct n'est pas supporté par votre navigateur. L'image a été téléchargée, vous pouvez maintenant la partager manuellement sur vos réseaux préférés !");
      }
    } catch (err) {
      console.error("Error sharing:", err);
      downloadImage();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero / Header Section */}
        <section className="stadium-gradient relative py-16 px-4">
          <div className="container mx-auto text-center relative z-10">
            <h1 className="text-4xl md:text-6xl font-oswald font-bold uppercase tracking-tighter mb-4 text-white drop-shadow-lg">
              Devenez une <span className="text-emerald-400">Légende</span> du Stade
            </h1>
            <p className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto mb-10 drop-shadow-md">
              Créez votre propre Tifo géant personnalisé et supportez votre équipe avec style sur les réseaux sociaux.
            </p>
            
            <StepIndicator currentStep={step} />
          </div>
        </section>

        <section className="container mx-auto px-4 py-12">
          {/* Step 1: Image Upload */}
          {step === 1 && (
            <div className="max-w-xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-12 text-center shadow-2xl">
              <div className="mb-8">
                <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-slate-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-2">Importez votre photo</h2>
                <p className="text-slate-400">Une photo de votre visage bien éclairée donnera le meilleur résultat sur le Tifo.</p>
              </div>
              
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                className="hidden" 
                accept="image/*" 
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-emerald-900/20"
              >
                Choisir une photo
              </button>
            </div>
          )}

          {/* Step 2: Team Selection */}
          {step === 2 && (
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-oswald font-bold uppercase">Choisissez votre équipe</h2>
                <p className="text-slate-400">Le stade se parera des couleurs de votre nation favorite.</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-10">
                {TEAMS.map((team) => (
                  <button
                    key={team.id}
                    onClick={() => handleTeamSelect(team)}
                    className={`relative p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${
                      state.selectedTeam?.id === team.id 
                        ? 'bg-emerald-500/10 border-emerald-500 ring-2 ring-emerald-500/20' 
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-4xl">{team.flag}</span>
                    <span className="font-bold text-sm tracking-wide">{team.name}</span>
                    {state.selectedTeam?.id === team.id && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <div className="flex gap-4 max-w-md mx-auto">
                <button 
                  onClick={() => setStep(1)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-xl transition-all"
                >
                  Retour
                </button>
                <button 
                  disabled={!state.selectedTeam}
                  onClick={triggerGenerate}
                  className={`flex-[2] font-bold py-4 rounded-xl transition-all shadow-lg ${
                    state.selectedTeam 
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/20' 
                      : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  Générer mon Tifo
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Generation & Preview */}
          {step === 3 && (
            <div className="max-w-5xl mx-auto">
              {state.status === 'processing' && (
                <div className="text-center py-20 bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden relative">
                  <div className="absolute top-0 left-0 w-full h-1 bg-slate-800 overflow-hidden">
                    <div className="h-full bg-emerald-500 animate-[loading_2s_infinite]" style={{ width: '40%' }}></div>
                  </div>
                  
                  <div className="mb-8 relative inline-block">
                    <div className="w-24 h-24 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mx-auto"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-3xl">⚽</div>
                  </div>
                  
                  <h2 className="text-2xl font-bold mb-4 animate-pulse">Les supporters préparent le mosaic...</h2>
                  <div className="space-y-2 text-slate-400">
                    <p className="animate-[fade_1.5s_infinite]">Mise en place des drapeaux {state.selectedTeam?.name}...</p>
                    <p className="animate-[fade_2s_infinite] delay-500">Coordination des 50 000 supporters...</p>
                    <p className="animate-[fade_2.5s_infinite] delay-1000">Éclairage des projecteurs activé...</p>
                  </div>
                </div>
              )}

              {state.status === 'error' && (
                <div className="text-center py-16 bg-slate-900 rounded-3xl border border-red-900/30 shadow-2xl">
                  <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-4">Oups !</h2>
                  <p className="text-slate-400 mb-8 max-w-md mx-auto">{state.errorMessage}</p>
                  <button 
                    onClick={() => setStep(2)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-3 rounded-xl transition-all"
                  >
                    Réessayer
                  </button>
                </div>
              )}

              {state.status === 'completed' && state.generatedImage && (
                <div className="flex flex-col gap-8 animate-in fade-in zoom-in duration-700">
                  <div className="relative group rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                    <img 
                      src={state.generatedImage} 
                      alt="Generated Tifo" 
                      className="w-full h-auto block"
                    />
                    <div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      Prêt pour les réseaux
                    </div>
                  </div>

                  <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 flex flex-col items-center gap-8 shadow-xl">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold mb-2 font-oswald uppercase italic tracking-wider">Tifo Légendaire !</h3>
                      <p className="text-slate-400">Partagez votre création ou téléchargez-la pour votre photo de couverture.</p>
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-4 w-full">
                      <div className="flex gap-4 w-full md:flex-1">
                        <button 
                          onClick={resetApp}
                          className="flex-1 border border-slate-700 hover:bg-slate-800 text-white font-bold px-6 py-4 rounded-xl transition-all"
                        >
                          Nouveau
                        </button>
                        <button 
                          onClick={downloadImage}
                          className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold px-6 py-4 rounded-xl transition-all flex items-center justify-center gap-2"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          Télécharger
                        </button>
                      </div>

                      <button 
                        onClick={shareImage}
                        className="w-full md:flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-4 rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-emerald-900/20 text-lg"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                        Partager le Tifo
                      </button>
                    </div>

                    <div className="flex gap-6 items-center pt-4 border-t border-slate-800 w-full justify-center">
                      <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Partage rapide :</span>
                      <button onClick={shareImage} className="w-10 h-10 bg-[#1877F2]/10 rounded-full flex items-center justify-center text-[#1877F2] hover:bg-[#1877F2] hover:text-white transition-all">
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                      </button>
                      <button onClick={shareImage} className="w-10 h-10 bg-[#25D366]/10 rounded-full flex items-center justify-center text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all">
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                      </button>
                      <button onClick={shareImage} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      <footer className="bg-slate-950 border-t border-slate-900 py-10">
        <div className="container mx-auto px-4 text-center">
          <div className="text-slate-500 text-sm mb-4">
            &copy; {new Date().getFullYear()} TifoMaster. Powered by Gemini AI. Propulsez votre passion.
          </div>
          <div className="flex justify-center gap-6 text-slate-400">
            <a href="#" className="hover:text-emerald-400 transition-colors">Confidentialité</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Conditions</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Contact</a>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(250%); }
        }
        @keyframes fade {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default App;
