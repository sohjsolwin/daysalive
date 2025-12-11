import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

import { DateInput } from './components/DateInput';
import { OptionsPanel, type Options } from './components/OptionsPanel';
import { MilestoneList } from './components/MilestoneList';
import { CookieBanner } from './components/CookieBanner';

import { decodeMilestoneData } from './utils/encodingUtils';
import { calculateDaysFrom, getDateFromDays, formatDate } from './utils/dateUtils';
import { useIsMobile } from './hooks/useIsMobile';
import './mobile.css'; // Mobile specific styles

function App() {
  const [startDate, setStartDate] = useState<string>(() => {
    return localStorage.getItem('daysa.live.startDate') || '1999-09-09';
  });

  const [highlightDay, setHighlightDay] = useState<number | undefined>(undefined);
  const [showError, setShowError] = useState(false);

  // Markdown content state
  const [whyContent, setWhyContent] = useState('');
  const [privacyContent, setPrivacyContent] = useState('');

  // Config options
  const [options, setOptions] = useState<Options>({
    milestoneMode: '500',
    customMilestone: 100,
    showPrimes: false,
    showSequences: true,
    filterHolidays: false,
    showSeasonalMarkers: true,
    filterBySeason: false,
    seasons: {
      Spring: true,
      Summer: true,
      Autumn: true,
      Winter: true,
    },
    filterCelestial: false,
    showPastDays: false,
  });

  // Modal State
  const [activeModal, setActiveModal] = useState<'why' | 'privacy' | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Check for nonce in URL
    const params = new URLSearchParams(window.location.search);
    const nonce = params.get('nonce');
    if (nonce) {
      const decoded = decodeMilestoneData(nonce);
      if (decoded) {
        setStartDate(decoded.dateString);
        setHighlightDay(decoded.dayCount);
      } else {
        // Invalid nonce -> Error
        setShowError(true);
        setTimeout(() => {
          setShowError(false);
          window.history.replaceState({}, '', window.location.pathname);
        }, 4000);
      }
    }

    // Fetch Markdown Content
    fetch('/WHY.md')
      .then(res => res.text())
      .then(text => setWhyContent(text))
      .catch(err => console.error('Failed to load WHY.md', err));

    fetch('/PRIVACY.md')
      .then(res => res.text())
      .then(text => setPrivacyContent(text))
      .catch(err => console.error('Failed to load PRIVACY.md', err));

  }, []);

  useEffect(() => {
    localStorage.setItem('daysa.live.startDate', startDate);
  }, [startDate]);

  const handleClearDate = () => {
    const defaultDate = '1999-09-09';
    setStartDate(defaultDate);
    localStorage.removeItem('daysa.live.startDate');
    setHighlightDay(undefined);
  };

  const toggleModal = (modal: 'why' | 'privacy') => {
    setActiveModal(prev => prev === modal ? null : modal);
  };

  if (showError) {
    return (
      <div className="error-overlay">
        <div className="error-content">
          <h2>You've been lost in time...</h2>
          <p>That timeline link seems to be broken. Don't worry, we're bringing you back to the present...</p>
        </div>
      </div>
    );
  }

  // ... existing hooks ... 
  const isMobile = useIsMobile();
  const [mobileHeaderVisible, setMobileHeaderVisible] = useState(false);

  const handleMobileScroll = (e: React.UIEvent<HTMLDivElement>) => {
    // Show sticky header when scrolled past Hero (approx 100vh)
    const scrollTop = e.currentTarget.scrollTop;
    const threshold = window.innerHeight * 0.8;
    setMobileHeaderVisible(scrollTop > threshold);
  };

  if (showError) {
    return (
      <div className="error-overlay">
        <div className="error-content">
          <h2>You've been lost in time...</h2>
          <p>That timeline link seems to be broken. Don't worry, we're bringing you back to the present...</p>
        </div>
      </div>
    );
  }

  // Mobile Layout
  if (isMobile) {
    return (
      <div className="mobile-snap-container" onScroll={handleMobileScroll}>
        {/* Sticky Header (Hidden initially) */}
        <header className={`mobile-sticky-header ${mobileHeaderVisible ? 'visible' : ''}`}>
          <a href="/" className="flex items-center gap-2 no-underline" style={{ textDecoration: 'none' }}>
            <img
              src="/logo_symbol_dark.png"
              alt="Logo"
              className="w-8 h-8 object-contain"
              style={{ width: '32px', height: '32px', minWidth: '32px' }}
            />
            <span className="font-bold text-lg" style={{
              background: 'linear-gradient(to right, var(--accent-primary), var(--accent-secondary))',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent'
            }}>DaysA.live</span>
          </a>
          <div className="mobile-date-label">
            {startDate}
          </div>
          {/* Hamburger */}
          <button className="p-2 mobile-nav-btn" onClick={() => setIsSidebarOpen(true)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
          </button>
        </header>

        {/* Sticky Footer (Visible on scroll) */}
        <footer className={`mobile-sticky-footer ${mobileHeaderVisible ? 'visible' : ''}`}>
          <button onClick={() => toggleModal('why')} className="mobile-footer-btn">Why?</button>
          <button onClick={() => toggleModal('privacy')} className="mobile-footer-btn">Privacy</button>
          <span className="opacity-50">© {new Date().getFullYear()}</span>
        </footer>

        {/* Sidebar Overlay for Mobile */}
        <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
          <button className="mobile-close-sidebar" onClick={() => setIsSidebarOpen(false)}>×</button>
          <div className="glass-panel mt-12">
            <DateInput value={startDate} onChange={setStartDate} onClear={handleClearDate} />
          </div>
          <OptionsPanel options={options} onChange={setOptions} />
        </div>

        {/* Section 1: Hero */}
        <section className="mobile-hero-section">
          <header className="flex flex-col items-center gap-4 mb-6 relative z-10">
            <a href="/" className="flex flex-col items-center gap-4 no-underline" style={{ textDecoration: 'none' }}>
              <img
                src="/logo_symbol_dark.png"
                alt="Logo"
                className="w-48 h-48 object-contain"
                style={{ width: '180px', height: '180px' }}
              />
              <h1 className="text-4xl font-bold pb-1" style={{
                background: 'linear-gradient(to right, var(--accent-primary), var(--accent-secondary))',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent'
              }}>
                DaysA.live
              </h1>
            </a>
            <p className="text-center text-slate-400 max-w-xs text-sm">
              Discover the hidden milestones in your timeline.
            </p>
          </header>

          <div className="w-full max-w-xs glass-panel relative z-10 mb-6">
            <DateInput value={startDate} onChange={setStartDate} onClear={handleClearDate} />
          </div>

          {/* Next Milestone Display (Hero) */}
          <div className="flex flex-col items-center justify-center relative z-10 animate-fade-in mb-24">
            {(() => {
              const start = new Date(startDate);
              if (!isNaN(start.getTime())) {
                const currentDays = calculateDaysFrom(start, new Date());
                let interval = 500;
                if (options.milestoneMode === '1000') interval = 1000;
                if (options.milestoneMode === 'custom') interval = options.customMilestone;

                const nextMilestoneCount = Math.ceil((currentDays + 1) / interval) * interval;
                const nextMilestoneDate = getDateFromDays(start, nextMilestoneCount);
                const daysUntil = nextMilestoneCount - currentDays;

                return (
                  <>
                    <div className="text-slate-500 text-xs uppercase tracking-widest mb-1">Next Milestone</div>
                    <div className="text-3xl font-extrabold text-white mb-0">{nextMilestoneCount.toLocaleString()}</div>
                    <div className="text-sky-400 font-semibold text-lg">{formatDate(nextMilestoneDate)}</div>
                    <div className="text-xs text-slate-500 mt-1">
                      {daysUntil > 0 ? `${daysUntil.toLocaleString()} days to go` : 'Today!'}
                    </div>
                  </>
                );
              }
              return null;
            })()}
          </div>

          {/* Footer at Bottom - Absolute Positioned via CSS now */}
          <div className="mobile-hero-footer">
            <button onClick={() => toggleModal('why')} className="mobile-footer-btn">Why?</button>
            <button onClick={() => toggleModal('privacy')} className="mobile-footer-btn">Privacy</button>
            <span>© {new Date().getFullYear()}</span>
          </div>

          {/* Swipe Indicator */}
          <div className="swipe-indicator">
            <span className="text-sm font-medium">Swipe Up for Results</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-bounce">
              <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
            </svg>
          </div>
        </section>

        {/* Section 2: Results */}
        <section className="mobile-results-section">
          <MilestoneList
            startDate={startDate}
            options={options}
            onTogglePastDays={() => setOptions(prev => ({ ...prev, showPastDays: !prev.showPastDays }))}
            highlightDay={highlightDay}
            isMobileView={true} // New Prop to trigger Grid Mode
          />
        </section>

        <CookieBanner onOpenPrivacy={() => setActiveModal('privacy')} />

        {/* Mobile Modal */}
        {activeModal && (
          <div className="mobile-modal-overlay">
            <div className="mobile-modal-content custom-scrollbar">
              <button className="mobile-modal-close" onClick={() => setActiveModal(null)}>&times;</button>
              <div className="modal-markdown">
                <ReactMarkdown>{activeModal === 'why' ? whyContent : privacyContent}</ReactMarkdown>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Desktop Layout (Existing)
  return (
    <div className="container">
      <header className="header relative">
        <a href="/" className="flex items-center justify-center gap-4 mb-4 no-underline hover:opacity-90 transition-opacity" style={{ textDecoration: 'none' }}>
          <img
            src="/logo_symbol_dark.png"
            alt="DaysA.live Logo"
            className="w-16 h-16"
          />
          <h1 className="title mb-0 text-5xl">
            DaysA.live
          </h1>
        </a>
        <p className="subtitle">
          Discover the hidden milestones in your timeline. Calculate days, find patterns, and celebrate the unique moments.
        </p>
      </header>

      {activeModal === null ? (
        <main className="main-content">
          <div className="sidebar">
            <div className="glass-panel">
              <DateInput value={startDate} onChange={setStartDate} onClear={handleClearDate} />
            </div>
            <OptionsPanel options={options} onChange={setOptions} />
          </div>

          <div style={{ height: '100%', overflow: 'hidden' }}>
            <MilestoneList
              startDate={startDate}
              options={options}
              onTogglePastDays={() => setOptions(prev => ({ ...prev, showPastDays: !prev.showPastDays }))}
              highlightDay={highlightDay}
            />
          </div>
        </main>
      ) : (
        <main className="main-content relative">
          <div className="glass-panel modal-layout animate-fade-in relative">
            <button
              className="modal-close-icon"
              onClick={() => setActiveModal(null)}
            >
              ×
            </button>

            <div className="modal-inner-content">
              {activeModal === 'why' && (
                <div className="modal-markdown">
                  {whyContent ? (
                    <ReactMarkdown>{whyContent}</ReactMarkdown>
                  ) : (
                    <p>Loading...</p>
                  )}
                </div>
              )}

              {activeModal === 'privacy' && (
                <div className="modal-markdown">
                  {privacyContent ? (
                    <ReactMarkdown>{privacyContent}</ReactMarkdown>
                  ) : (
                    <p>Loading...</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      )}

      <footer className="footer">
        <div className="h-px w-full bg-slate-700/50 my-4 mb-6" />
        <div className="footer-links flex gap-4 justify-center">
          <button
            className={`link-btn ${activeModal === 'why' ? 'text-sky-400 font-bold' : ''}`}
            onClick={() => toggleModal('why')}
          >
            Why?
          </button>
          <button
            className={`link-btn ${activeModal === 'privacy' ? 'text-sky-400 font-bold' : ''}`}
            onClick={() => toggleModal('privacy')}
          >
            Privacy
          </button>
        </div>
        <p>© {new Date().getFullYear()} DaysA.live. Time is precious.</p>
      </footer>

      <CookieBanner onOpenPrivacy={() => setActiveModal('privacy')} />
    </div>
  );
}

export default App;
