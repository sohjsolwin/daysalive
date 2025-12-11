import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

import { DateInput } from './components/DateInput';
import { OptionsPanel, type Options } from './components/OptionsPanel';
import { MilestoneList } from './components/MilestoneList';
import { CookieBanner } from './components/CookieBanner';

import { decodeMilestoneData } from './utils/encodingUtils';

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

  return (
    <div className="container">
      <header className="header relative">
        <button
          className="mobile-nav-toggle"
          onClick={() => setIsSidebarOpen(true)}
          aria-label="Open Settings"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        <div className="flex items-center justify-center gap-4 mb-4">
          <img
            src="/logo_symbol_dark.png"
            alt="DaysA.live Logo"
            className="w-16 h-16"
          />
          <h1 className="title mb-0 text-5xl">
            DaysA.live
          </h1>
        </div>
        <p className="subtitle">
          Discover the hidden milestones in your timeline. Calculate days, find patterns, and celebrate the unique moments.
        </p>
      </header>

      {activeModal === null ? (
        <main className="main-content">
          <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
            <button
              className="mobile-close-sidebar"
              onClick={() => setIsSidebarOpen(false)}
            >
              ×
            </button>
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
