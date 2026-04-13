import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (isHovering) return; // Prevent interval registration while hovered

    const timer = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 3);
    }, 7000); // Auto-advance every 7 seconds
    return () => clearInterval(timer);
  }, [isHovering]);

  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden', padding: '1px' }}>
      
      {/* Background Animated Doodles */}
      <div className="doodle-icon" style={{ top: '10%', left: '15%', animationDuration: '9s' }}>✉️</div>
      <div className="doodle-icon" style={{ top: '65%', left: '8%', animationDuration: '12s', animationDelay: '1s' }}>⚖️</div>
      <div className="doodle-icon" style={{ top: '25%', right: '12%', animationDuration: '7s', fontSize: '4rem' }}>🗳️</div>
      <div className="doodle-icon" style={{ top: '75%', right: '18%', animationDuration: '10s', animationDelay: '2s' }}>🛡️</div>
      <div className="doodle-icon" style={{ top: '45%', left: '80%', animationDuration: '11s', fontSize: '2.5rem' }}>📊</div>
      {/* Expanded Doodles Layer */}
      <div className="doodle-icon" style={{ top: '5%', right: '35%', animationDuration: '14s', animationDelay: '3s', fontSize: '2rem' }}>🏛️</div>
      <div className="doodle-icon" style={{ top: '85%', left: '25%', animationDuration: '8s', animationDelay: '0.5s', fontSize: '3.5rem' }}>📢</div>
      <div className="doodle-icon" style={{ top: '35%', left: '5%', animationDuration: '13s', fontSize: '2.2rem' }}>📝</div>
      <div className="doodle-icon" style={{ top: '55%', right: '5%', animationDuration: '15s', animationDelay: '1.5s', fontSize: '3rem' }}>🔒</div>
      <div className="doodle-icon" style={{ top: '90%', right: '45%', animationDuration: '9.5s', fontSize: '2.8rem' }}>🌍</div>
      <div className="doodle-icon" style={{ top: '15%', left: '45%', animationDuration: '11.5s', animationDelay: '2s', fontSize: '2.4rem' }}>🤝</div>
      <div className="doodle-icon" style={{ top: '40%', left: '22%', animationDuration: '16s', animationDelay: '0.8s', fontSize: '2.6rem' }}>📸</div>

      <div style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px', paddingBottom: '60px', position: 'relative', zIndex: 10 }}>
      
      {/* Animated Hero Header */}
      <div className="card animate-fade-in" style={{ padding: '60px 40px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(67, 97, 238, 0.1) 0%, rgba(0,0,0,0.4) 100%)', borderTop: '4px solid var(--primary)', marginBottom: '40px', transition: 'transform 0.3s ease' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
        <h1 style={{ fontSize: '3rem', color: 'var(--text-primary)', marginBottom: '15px', letterSpacing: '-1px' }}>
          Silence the Fraud. <br/> <span style={{ color: 'var(--primary)' }}>Amplify Democracy.</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 30px', lineHeight: 1.6 }}>
          ElectoralWatch is an encrypted, zero-trust civic reporting dashboard empowering everyday citizens to document, catalog, and expose severe electoral malpractices anonymously.
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <Link to="/register" className="btn btn-primary" style={{ padding: '12px 30px', fontSize: '1.1rem', fontWeight: 'bold', boxShadow: '0 4px 15px rgba(67, 97, 238, 0.4)' }}>Join the Watch</Link>
          <Link to="/login" className="btn" style={{ padding: '12px 30px', fontSize: '1.1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>Sign In</Link>
        </div>
      </div>



      {/* Features Slideshow Carousel */}
      <h2 style={{ fontSize: '1.8rem', marginBottom: '20px', color: 'var(--text-primary)', textAlign: 'center' }}>Platform Capabilities</h2>
      
      <div 
        style={{ overflow: 'hidden', position: 'relative', width: '100%', borderRadius: '12px' }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onTouchStart={() => setIsHovering(true)}
        onTouchEnd={() => setIsHovering(false)}
      >
        <div style={{ display: 'flex', transition: 'transform 1.2s cubic-bezier(0.4, 0, 0.2, 1)', transform: `translateX(-${activeFeature * 100}%)` }}>
          
          {/* Feature 1 */}
          <div style={{ minWidth: '100%', padding: '0 10px', boxSizing: 'border-box' }}>
            <div className="card" style={{ padding: '40px', transition: 'all 0.3s ease', cursor: 'default', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255, 255, 255, 0.05)' }} onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)'; }} onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)'; e.currentTarget.style.boxShadow = 'none'; }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px', background: 'rgba(67, 97, 238, 0.1)', width: '70px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px' }}>🛡️</div>
              <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '15px' }}>Secure Evidence Vault</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, margin: 0 }}>
                Upload raw photographic and video evidence of booth capturing, bribery, or violence directly into encrypted cloud transit. Your data remains completely centralized and tamper-proof.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div style={{ minWidth: '100%', padding: '0 10px', boxSizing: 'border-box' }}>
            <div className="card" style={{ padding: '40px', transition: 'all 0.3s ease', cursor: 'default', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255, 255, 255, 0.05)' }} onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--success)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)'; }} onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)'; e.currentTarget.style.boxShadow = 'none'; }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px', background: 'rgba(6, 214, 160, 0.1)', width: '70px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px' }}>📚</div>
              <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '15px' }}>Civic Education Hub</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, margin: 0 }}>
                Unsure if what you saw is illegal? Access our comprehensive library detailing over 20 specific electoral malpractices to strictly classify and understand the fraud you witnessed.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div style={{ minWidth: '100%', padding: '0 10px', boxSizing: 'border-box' }}>
            <div className="card" style={{ padding: '40px', transition: 'all 0.3s ease', cursor: 'default', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255, 255, 255, 0.05)' }} onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--warning)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)'; }} onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)'; e.currentTarget.style.boxShadow = 'none'; }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px', background: 'rgba(255, 209, 102, 0.1)', width: '70px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px' }}>📡</div>
              <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '15px' }}>Real-Time Triage</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, margin: 0 }}>
                Submitted reports are instantly triaged via the Admin Console. Check your personal evidence dashboard to track exactly when your incident is verified and escalated to authorities.
              </p>
            </div>
          </div>

        </div>
      </div>
      
      {/* Slideshow Progress Indicators */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '15px' }}>
        {[0, 1, 2].map((idx) => (
          <div 
            key={idx} 
            onClick={() => setActiveFeature(idx)}
            style={{ 
              width: activeFeature === idx ? '30px' : '10px', 
              height: '10px', 
              borderRadius: '5px', 
              background: activeFeature === idx ? 'var(--primary)' : 'rgba(255,255,255,0.2)', 
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }} 
          />
        ))}
      </div>

      {/* The "Why We Need This" Manifesto Section */}
      <div className="animate-fade-in card" style={{ marginTop: '60px', marginBottom: '20px', padding: '40px', background: 'rgba(0,0,0,0.15)', borderLeft: '4px solid var(--primary)', borderRadius: '8px' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '20px', color: 'var(--text-primary)' }}>The Critical Need for Civic Vigilance</h2>
        <div style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.8 }}>
          <p style={{ marginBottom: '15px', marginTop: 0 }}>
            Democracy thrives in the light, but electoral fraud survives only in the shadows. Across the globe, the foundational right to vote is persistently threatened by systemic malpractices—ranging from blatant booth capturing and voter intimidation to silent bribery and fraudulent voting. While election commissions and law enforcement agencies work tirelessly to maintain integrity, they cannot monitor every polling station, every street corner, or every closed-door exchange simultaneously. They rely entirely on the vigilance of the public.
          </p>
          <p style={{ marginBottom: '15px' }}>
            However, reporting electoral crimes has historically been fraught with danger and bureaucratic friction. Citizens who witness illegal activities often hesitate to step forward due to a profound fear of violent retaliation, political intimidation, or simply the belief that their singular voice will vanish into an administrative black hole without consequence. There exists a critical, dangerous gap between witnessing a crime against democracy and safely ensuring that evidence results in actionable intervention.
          </p>
          <p style={{ marginBottom: '15px', color: 'var(--text-primary)', fontWeight: 'bold' }}>
            This is exactly why ElectoralWatch was engineered.
          </p>
          <p style={{ marginBottom: '15px' }}>
            We recognized an urgent need for an encrypted, zero-trust infrastructure that removes both the friction and fear from civic reporting. By providing a platform where anyone equipped with a smartphone can instantly document, classify, and transmit raw photographic or video evidence directly into a secure, centralized database, ElectoralWatch shifts the balance of power back to the voters. Our platform guarantees that critical evidence is locked into an immutable cloud transit, bypassing local intimidation networks completely.
          </p>
          <p style={{ margin: 0 }}>
            More than a simple reporting portal, it acts as an anonymized shield, bridging the gap between brave civic whistleblowers and the highest levels of electoral administration. When citizens are empowered to act as real-time guardians of their own democratic processes without compromising their personal safety, widespread electoral malpractice becomes nearly impossible to execute successfully. The integrity of an election isn't just the responsibility of the state; it is the collective duty of the people. This platform acts as your instrument to enforce it.
          </p>
        </div>
      </div>
      
      </div>
      
    </div>
  );
};

export default About;
