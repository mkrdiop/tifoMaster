
import React from 'react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  teamName: string;
  onDownload: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, imageUrl, teamName, onDownload }) => {
  if (!isOpen) return null;

  const appUrl = window.location.href;
  const shareText = `Regardez mon Tifo personnalisé pour supporter ${teamName} ! Créez le vôtre sur TifoMaster.`;
  
  const shareOptions = [
    {
      name: 'Twitter',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      color: 'bg-black',
      action: () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(appUrl)}`, '_blank')
    },
    {
      name: 'Facebook',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
      color: 'bg-[#1877F2]',
      action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(appUrl)}`, '_blank')
    },
    {
      name: 'WhatsApp',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      ),
      color: 'bg-[#25D366]',
      action: () => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + appUrl)}`, '_blank')
    }
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in slide-in-from-bottom-8 duration-500">
        <div className="p-8 md:p-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-3xl font-oswald font-bold uppercase italic text-white">Partager mon <span className="text-emerald-400">Tifo</span></h2>
              <p className="text-slate-400 mt-1">Montrez au monde votre ferveur pour {teamName}.</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Social Grid */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {shareOptions.map((opt) => (
              <button
                key={opt.name}
                onClick={opt.action}
                className="flex flex-col items-center gap-3 p-4 rounded-3xl bg-slate-800/50 hover:bg-slate-800 transition-all group"
              >
                <div className={`w-14 h-14 ${opt.color} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                  {opt.icon}
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{opt.name}</span>
              </button>
            ))}
          </div>

          {/* Instagram / Special Action */}
          <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-pink-500/20 rounded-3xl p-6 mb-8">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-10 h-10 bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] rounded-xl flex items-center justify-center text-white">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.054 1.805.249 2.227.412.56.216.96.474 1.38.894.42.42.678.82.894 1.38.163.422.358 1.057.412 2.227.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.054 1.17-.249 1.805-.412 2.227-.216.56-.474.96-.894 1.38-.42.42-.82.678-1.38.894-.422.163-1.057.358-2.227.412-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.054-1.805-.249-2.227-.412-.56-.216-.96-.474-1.38-.894-.42-.42-.678-.82-.894-1.38-.163-.422-.358-1.057-.412-2.227-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.054-1.17.249-1.805.412-2.227.216-.56.474-.96.894-1.38.42-.42.82-.678 1.38-.894.422-.163 1.057-.358 2.227-.412 1.266-.058 1.646-.07 4.85-.07m0-2.163c-3.259 0-3.667.014-4.947.072-1.277.057-2.148.258-2.911.556-.788.306-1.458.715-2.124 1.381-.666.666-1.075 1.335-1.381 2.124-.298.763-.499 1.634-.556 2.911-.058 1.28-.072 1.688-.072 4.947s.014 3.668.072 4.947c.057 1.277.258 2.148.556 2.911.306.788.715 1.458 1.381 2.124.666.666 1.335 1.075 2.124 1.381.763.298 1.634.499 2.911.556 1.28.058 1.688.072 4.947.072s3.668-.014 4.947-.072c1.277-.057 2.148-.258 2.911-.556.788-.306 1.458-.715 2.124-1.381.666-.666 1.075-1.335 1.381-2.124.298-.763.499-1.634.556-2.911.058-1.28.072-1.688.072-4.947s-.014-3.668-.072-4.947c-.057-1.277-.258-2.148-.556-2.911-.306-.788-.715-1.458-1.381-2.124-.666-.666-1.335-1.075-2.124-1.381-.763-.298-1.634-.499-2.911-.556-1.28-.058-1.688-.072-4.947-.072z" />
                  <path d="M12 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </div>
              <p className="text-sm font-bold text-slate-200">Guide Instagram</p>
            </div>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Pour Instagram, téléchargez d'abord l'image puis postez-la manuellement sur votre fil ou en Story en nous mentionnant !
            </p>
            <button
              onClick={onDownload}
              className="w-full py-3 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-colors border border-white/10"
            >
              Télécharger pour Insta
            </button>
          </div>

          {/* Copy Link */}
          <div className="flex gap-2">
            <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-500 truncate flex items-center">
              {appUrl}
            </div>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(appUrl);
                alert('Lien copié !');
              }}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-3 rounded-xl transition-colors text-xs uppercase"
            >
              Copier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
