import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import './LandingPage.css';

const FEATURES = [
  { icon: '📋', title: 'Unified Job Board',    desc: 'Every application in one clean view. Filter by stage, company, date, or role — no spreadsheet chaos.' },
  { icon: '📊', title: 'Analytics Dashboard',  desc: 'See your entire funnel from application to offer. Spot where you lose momentum and fix it fast.' },
  { icon: '🔔', title: 'Smart Reminders',      desc: "Never let a hot lead go cold. Nudges arrive exactly when you need to follow up." },
  { icon: '✍️', title: 'Cover Letter Builder', desc: 'Store tailored templates and adapt with one click — your voice, consistently great.' },
  { icon: '🎯', title: 'Profile Matching',      desc: 'Tag roles against your skills. See fit scores instantly and understand gaps to close.' },
  { icon: '🔐', title: 'Private by Default',   desc: 'Your search stays yours. No data sold, no recruiters peeking. Full export any time.' },
];

const STEPS = [
  { num: '1', title: 'Create your free account',  desc: 'Sign up in 30 seconds. No credit card, no commitment — just a cleaner job search from day one.' },
  { num: '2', title: 'Add your applications',     desc: 'Log jobs manually or import from your browser. Each entry tracks status, notes, and key dates.' },
  { num: '3', title: 'Land the offer',            desc: 'Follow analytics, act on reminders, and watch your response rate climb week over week.' },
];

const TESTIMONIALS = [
  { initials: 'PM', name: 'Priya M.',  role: 'Product Designer · Notion', quote: 'Trackr turned my scattered job hunt into a real strategy. I landed my offer in 6 weeks — half the time it took me last year.' },
  { initials: 'AK', name: 'Arjun K.', role: 'Software Engineer · Stripe', quote: "The analytics showed me I was ghosted after the second interview every time. I fixed that specific stage and my close rate tripled." },
  { initials: 'SR', name: 'Sofia R.', role: 'Marketing Lead · Figma',     quote: 'I used to lose track of who I had followed up with. Now I have zero missed follow-ups and way less anxiety about the whole process.' },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const goToAuth      = () => navigate('/auth');
  const goToDashboard = () => navigate('/dashboard');

  // Scroll-triggered fade-in
  useEffect(() => {
    const els = document.querySelectorAll('.feature-card, .step, .testimonial-card, .stat-item');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          const el = e.target as HTMLElement;
          el.style.opacity = '0';
          el.style.transform = 'translateY(20px)';
          el.style.transition = `opacity 0.55s ${i * 0.08}s ease, transform 0.55s ${i * 0.08}s ease`;
          requestAnimationFrame(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
          });
          io.unobserve(el);
        }
      });
    }, { threshold: 0.12 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Nav scroll shadow
  useEffect(() => {
    const nav = document.querySelector('.nav');
    const handler = () => nav?.classList.toggle('scrolled', window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <div className="landing-root">
      <div className="landing-bg">
        <div className="blob blob-tl" />
        <div className="blob blob-br" />
      </div>

      {/* ── NAV ── */}
      <nav className="nav">
        <a className="nav-logo" href="/">
          <div className="nav-logo-mark">🎯</div>
          <span className="nav-logo-text">Track<span>r</span></span>
        </a>

        <div className="nav-center">
          <button className="nav-link">Features</button>
          <button className="nav-link">How it works</button>
          <button className="nav-link">Pricing</button>
        </div>

        {/* Auth-aware nav actions */}
        <div className="nav-actions">
          {user ? (
            <>
              <button className="btn btn-ghost btn-sm" onClick={() => signOut()}>
                Sign out
              </button>
              <button className="btn btn-primary btn-sm" onClick={goToDashboard}>
                Dashboard →
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-ghost btn-sm" onClick={goToAuth}>
                Log in
              </button>
              <button className="btn btn-primary btn-sm" onClick={goToAuth}>
                Get started free
              </button>
            </>
          )}
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-eyebrow">
          <span className="eyebrow-dot" />
          Job search, finally under control
        </div>
        <h1 className="hero-title">
          Your career journey,{' '}
          <span className="hero-title-accent">mapped & mastered</span>
        </h1>
        <p className="hero-sub">
          Track every application, follow-up, and offer in one elegant workspace built for serious job seekers.
        </p>

        {/* Auth-aware CTA buttons */}
        <div className="hero-cta">
          {user ? (
            <button className="btn btn-primary btn-xl" onClick={goToDashboard}>
              Go to Dashboard →
            </button>
          ) : (
            <>
              <button className="btn btn-primary btn-xl" onClick={goToAuth}>
                Start tracking free →
              </button>
              <button className="btn btn-outline btn-xl" onClick={goToAuth}>
                Sign in
              </button>
            </>
          )}
        </div>

        <div className="hero-trust">
          <div className="trust-avatars">
            {['AK', 'PM', 'SR', 'RJ', 'NP'].map(ini => (
              <div className="trust-avatar" key={ini}>{ini}</div>
            ))}
          </div>
          <div className="trust-text">
            <strong>12,000+ job seekers</strong>
            already tracking their way to offers
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <div className="stats-strip">
        {[
          { num: '12k+', label: 'Jobs tracked' },
          { num: '3.4×', label: 'More callbacks' },
          { num: '6 wks', label: 'Avg. time to offer' },
          { num: '4.9★', label: 'User rating' },
        ].map(s => (
          <div className="stat-item" key={s.label}>
            <span className="stat-num">{s.num}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── FEATURES ── */}
      <section className="features">
        <p className="section-eyebrow">Why Trackr</p>
        <h2 className="section-title">Everything the job hunt demands</h2>
        <p className="section-sub">
          One workspace that covers the full arc of your search — from the first application to the signed offer.
        </p>
        <div className="feature-grid">
          {FEATURES.map(f => (
            <div className="feature-card" key={f.title}>
              <div className="feature-icon-wrap">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="how-it-works">
        <div className="how-inner">
          <p className="section-eyebrow">How it works</p>
          <h2 className="section-title">Up and running in minutes</h2>
          <p className="section-sub">
            No setup headaches. Just sign up, add your jobs, and let Trackr do the organising.
          </p>
          <div className="steps-grid">
            {STEPS.map(s => (
              <div className="step" key={s.num}>
                <div className="step-num">{s.num}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="testimonials">
        <p className="section-eyebrow">What people say</p>
        <h2 className="section-title">Real results, real stories</h2>
        <div className="testimonial-grid">
          {TESTIMONIALS.map(t => (
            <div className="testimonial-card" key={t.name}>
              <div className="testimonial-stars">★★★★★</div>
              <p className="testimonial-quote">"{t.quote}"</p>
              <div className="testimonial-author">
                <div className="author-avatar">{t.initials}</div>
                <div>
                  <div className="author-name">{t.name}</div>
                  <div className="author-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="cta-banner">
        <div className="cta-content">
          <div className="cta-badge">✦ Free forever · No credit card</div>
          <h2 className="cta-title">Ready to take control of your search?</h2>
          <p className="cta-sub">
            Join thousands of job seekers who land offers faster and with far less stress using Trackr.
          </p>
          <div className="cta-btns">
            {user ? (
              <button className="btn btn-white btn-xl" onClick={goToDashboard}>
                Go to Dashboard →
              </button>
            ) : (
              <>
                <button className="btn btn-white btn-xl" onClick={goToAuth}>
                  Create free account →
                </button>
                <button className="btn btn-outline-white btn-xl" onClick={goToAuth}>
                  Sign in
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-logo-text">Track<span>r</span></div>
            <p>A smarter way to manage your job search — from first application to signed offer.</p>
          </div>
          <div className="footer-links">
            <div className="footer-col">
              <h4>Product</h4>
              <ul>
                <li><a>Features</a></li>
                <li><a>How it works</a></li>
                <li><a>Pricing</a></li>
                <li><a>Changelog</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Company</h4>
              <ul>
                <li><a>About</a></li>
                <li><a>Blog</a></li>
                <li><a>Careers</a></li>
                <li><a>Contact</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Legal</h4>
              <ul>
                <li><a>Privacy</a></li>
                <li><a>Terms</a></li>
                <li><a>Security</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span className="footer-copy">© 2026 Trackr. Built for job seekers, by job seekers.</span>
          <div className="footer-legal">
            <a>Privacy Policy</a>
            <a>Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;