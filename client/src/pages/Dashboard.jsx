import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config';

const Dashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const [selectedMalpractice, setSelectedMalpractice] = useState(null);
  const [isMalpracticesModalOpen, setIsMalpracticesModalOpen] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [selectedDemoImage, setSelectedDemoImage] = useState(null);
  const [uploadingId, setUploadingId] = useState(null); // tracks which complaint is currently uploading
  const malpractices = [
    { title: "Bribery / Buying Votes", shortDesc: "Exchanging money/gifts for votes.", detail: "Bribery involves <b style='color: var(--highlighted-text)'>offering, giving, receiving, or soliciting something of value</b> for the purpose of influencing the action of a voter. This includes <b style='color: var(--highlighted-text)'>cash handouts, gifts, liquor, or promises of future benefits</b> in exchange for voting a certain way. It directly compromises the democratic process." },
    { title: "Booth Capturing", shortDesc: "Physical takeover of a polling station.", detail: "Booth capturing refers to the <b style='color: var(--highlighted-text)'>physical takeover of a polling station by party loyalists or armed thugs</b> to cast false votes in favor of their candidate, preventing legitimate voters from exercising their right. It's considered a <b style='color: var(--highlighted-text)'>severe criminal electoral offense</b>." },
    { title: "Fraudulent Voting", shortDesc: "Voting under a false identity.", detail: "Also known as impersonation or fake voting, this occurs when an individual <b style='color: var(--highlighted-text)'>casts a vote in the name of another registered voter</b>, whether alive, dead, or fictitious, to <b style='color: var(--highlighted-text)'>illegally inflate vote counts</b> and subvert the election outcome." },
    { title: "Voter Intimidation", shortDesc: "Coercing or threatening voters.", detail: "Voter intimidation involves the use of <b style='color: var(--highlighted-text)'>threats, coercion, or physical violence</b> to influence how a person votes or to deter them from voting altogether. This includes <b style='color: var(--highlighted-text)'>physically blocking voters from booths</b> or threatening repercussions based on election outcomes." },
    { title: "EVM / Ballot Tampering", shortDesc: "Manipulating voting machines or boxes.", detail: "This severe offense involves the <b style='color: var(--highlighted-text)'>illegal alteration, destruction, or replacement of Electronic Voting Machines (EVMs)</b>, Voter Verifiable Paper Audit Trails (VVPATs), or traditional ballot boxes to <b style='color: var(--highlighted-text)'>artificially inject votes</b> in favor of a specific candidate." },
    { title: "Misuse of Official Machinery", shortDesc: "Using government resources for campaigning.", detail: "This occurs when ruling political parties utilize <b style='color: var(--highlighted-text)'>government vehicles, state personnel, public funds, or infrastructure</b> strictly for political campaigning, establishing a <b style='color: var(--highlighted-text)'>deeply unfair baseline advantage</b> over competing parties." },
    { title: "Hate Speech & Incitement", shortDesc: "Provoking violence or division.", detail: "Using <b style='color: var(--highlighted-text)'>inflammatory, communal, or highly derogatory rhetoric</b> during public rallies or on social media to divide communities, <b style='color: var(--highlighted-text)'>provoke targeted violence</b>, and illegally polarize the electorate based on religion, race, or caste." },
    { title: "Distributing Fake News", shortDesc: "Spreading targeted disinformation.", detail: "Deliberately creating and <b style='color: var(--highlighted-text)'>circulating false information or manipulated videos (deepfakes)</b> on social platforms to mislead voters regarding a candidate's background, policies, or personal character." },
    { title: "Paid News & Media Bias", shortDesc: "Buying favorable media coverage.", detail: "<b style='color: var(--highlighted-text)'>Bribing journalists or media network executives</b> to publish highly favorable coverage or biased opinion polls masquerading as objective news pieces, <b style='color: var(--highlighted-text)'>heavily skewing public perception</b>." },
    { title: "Polling Detail Misinformation", shortDesc: "Lying about election logistics.", detail: "A voter suppression tactic involving the <b style='color: var(--highlighted-text)'>intentional circulation of incorrect election dates, times, or fake polling station locations</b> to prevent targeted demographics from casting their votes." },
    { title: "Defacing Opponent Materials", shortDesc: "Destroying rival campaigns.", detail: "The systematic <b style='color: var(--highlighted-text)'>destruction, tearing down, blacking out, or physical blocking</b> of a rival candidate's legally placed political posters, banners, and campaign headquarters." },
    { title: "Exceeding Expenditure Limits", shortDesc: "Spending undocumented 'black money'.", detail: "Spending massive amounts of <b style='color: var(--highlighted-text)'>unaccounted cash ('black money')</b> to bypass the strict campaign financing and expenditure limits mandated by the Election Commission, effectively <b style='color: var(--highlighted-text)'>buying the election</b> through financial brute force." },
    { title: "Illegal Voter Transportation", shortDesc: "Ferrying voters to booths.", detail: "Candidates illegally <b style='color: var(--highlighted-text)'>providing free transportation—such as chartered buses or private cars</b>—to ferry voters directly to polling booths, which serves as a psychological bribe and violates election codes." },
    { title: "Campaigning on Polling Day", shortDesc: "Violating the 'silence period'.", detail: "Continuing to hold rallies, distribute pamphlets, or <b style='color: var(--highlighted-text)'>actively canvass for votes within the legally prohibited radius</b> of a polling station on the actual day of the election." },
    { title: "Appealing to Religion/Caste", shortDesc: "Exploiting identity politics.", detail: "Explicitly appealing strictly to <b style='color: var(--highlighted-text)'>religious, caste, or ethnic identities rather than public policy</b> to solicit votes, which violates the secular and democratic principles of the electoral framework." },
    { title: "Liquor & Drug Distribution", shortDesc: "Bribing voters with substances.", detail: "Illegally <b style='color: var(--highlighted-text)'>distributing alcohol, narcotics, or unregulated drugs</b> to voters in the days leading up to the election to cloud judgment and sway their electoral choice." },
    { title: "Intimidating Election Officials", shortDesc: "Threatening polling staff.", detail: "Using <b style='color: var(--highlighted-text)'>physical threats, blackmail, or massive bribes</b> to compromise Presiding Officers, EVM technicians, and polling staff to <b style='color: var(--highlighted-text)'>look the other way while rigging occurs</b>." },
    { title: "Multiple Voting (Double Voting)", shortDesc: "Voting at several stations.", detail: "A severe federal offense where a single individual maliciously registers in multiple jurisdictions and <b style='color: var(--highlighted-text)'>casts several ballots across different polling stations</b> using forged identification documents." },
    { title: "Voter Roll Tampering", shortDesc: "Deleting legitimate voters.", detail: "Illegally hacking into electoral databases or <b style='color: var(--highlighted-text)'>bribing registration officials to mass-delete the names</b> of legitimate, registered opposition voters from the active voter list right before polling day." },
    { title: "Forced Proxy Voting", shortDesc: "Hijacking vulnerable votes.", detail: "Coercing disabled, elderly, visually impaired, or illiterate voters by <b style='color: var(--highlighted-text)'>forcing 'helpers' or party volunteers to physically press the voting machine button</b> against the voter's actual will." },
    { title: "Exploiting Minors", shortDesc: "Using children in campaigns.", detail: "The illegal exploitation of underage children for <b style='color: var(--highlighted-text)'>demanding election labor</b>—such as massive pamphlet distribution, hazardous sloganeering, or forced attendances at political rallies." },
    { title: "Foreign Interference", shortDesc: "Accepting foreign aid.", detail: "Illegally accepting <b style='color: var(--highlighted-text)'>secret campaign funding, cyber-warfare assistance, bots, or logistical campaign support</b> from foreign governments or undisclosed international entities." }
  ];

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const response = await axios.get(`${API_BASE_URL}/api/complaints`, config);
        setComplaints(response.data);
      } catch (error) {
        console.error("Failed to fetch personal complaints matrix", error);
      } finally {
        setLoading(false);
      }
    };
    
    if(user) fetchComplaints();
  }, [user]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'verified': return 'var(--success)';
      case 'rejected': return 'var(--danger)';
      default: return 'var(--warning)';
    }
  };

  return (
    <div>
      {/* Dynamic Pop-up Modal */}
      {selectedMalpractice && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 3000
        }} onClick={() => { setSelectedMalpractice(null); setIsMalpracticesModalOpen(true); }}>
          <div className="card animate-fade-in" style={{ maxWidth: '500px', width: '90%', position: 'relative', background: 'var(--surface-color)', border: '1px solid var(--border)', zIndex: 3001 }} onClick={e => e.stopPropagation()}>
            <button onClick={() => { setSelectedMalpractice(null); setIsMalpracticesModalOpen(true); }} style={{ position: 'absolute', top: '15px', left: '15px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '0.9rem', cursor: 'pointer' }}>← Back to List</button>
            <button onClick={() => setSelectedMalpractice(null)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '1.2rem', cursor: 'pointer' }}>✖</button>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '15px', marginTop: '25px', color: 'var(--warning)', paddingRight: '20px' }}>{selectedMalpractice.title}</h3>
            <p style={{ color: 'var(--text-primary)', lineHeight: 1.6, fontSize: '1rem', opacity: 0.9 }} dangerouslySetInnerHTML={{ __html: selectedMalpractice.detail }}></p>
          </div>
        </div>
      )}

      {/* Detailed Selected Demo Image Preview Modal */}
      {selectedDemoImage && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 3000
        }} onClick={() => { setSelectedDemoImage(null); setIsDemoModalOpen(true); }}>
          <div className="card animate-fade-in" style={{ maxWidth: '900px', width: '95%', maxHeight: '90vh', overflowY: 'auto', position: 'relative', background: 'var(--surface-color)', border: '1px solid var(--border)', zIndex: 3001, padding: '30px' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => { setSelectedDemoImage(null); setIsDemoModalOpen(true); }} style={{ position: 'absolute', top: '15px', left: '15px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '0.9rem', cursor: 'pointer' }}>← Back to Gallery</button>
            <button onClick={() => setSelectedDemoImage(null)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '1.2rem', cursor: 'pointer' }}>✖</button>
            
            <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', marginTop: '20px' }}>
              {/* Left Side: High-res Picture */}
              <div style={{ flex: '1 1 300px' }}>
                 <img src={selectedDemoImage} alt="Detailed Demo Preview" style={{ width: '100%', height: 'auto', maxHeight: '450px', objectFit: 'contain', borderRadius: '8px', border: '1px solid var(--border)', background: 'rgba(0,0,0,0.3)' }} />
              </div>
              
              {/* Right Side: Mock Report Data Structure */}
              <div style={{ flex: '2 1 400px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                 
                 <div style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                    <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Incident Headline</h4>
                    <p style={{ color: 'var(--text-primary)', fontSize: '1.2rem', fontWeight: '500', margin: 0 }}>
                      {selectedDemoImage?.includes('demo2') 
                        ? 'Aggressive physical intimidation of voter at polling entrance' 
                        : selectedDemoImage?.includes('demo3')
                          ? 'Inciting mob violence through targeted hate speech at local rally'
                          : 'Blatant distribution of cash to voters outside polling perimeter'}
                    </p>
                 </div>
                 
                 <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                   <div style={{ flex: 1, background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                     <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Location Details</h4>
                     <p style={{ color: 'var(--text-primary)', margin: 0, fontSize: '1rem' }}>
                       {selectedDemoImage?.includes('demo2') 
                         ? 'Main Gate, Polling Station #14 | City Center' 
                         : selectedDemoImage?.includes('demo3')
                           ? 'Town Square | Main Market District | Springfield City'
                           : 'Booth 42 | North District, Sector 5 | Springfield City'}
                     </p>
                   </div>
                   <div style={{ flex: 1, background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                     <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Malpractice Classification</h4>
                     <p style={{ color: 'var(--danger)', fontWeight: 'bold', margin: 0, fontSize: '1rem' }}>
                       {selectedDemoImage?.includes('demo2') 
                         ? 'Voter Intimidation' 
                         : selectedDemoImage?.includes('demo3')
                           ? 'Hate Speech & Incitement'
                           : 'Bribery / Buying Votes'}
                     </p>
                   </div>
                 </div>
                 
                 <div style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '8px', border: '1px solid var(--border)', flex: 1 }}>
                    <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Detailed Description of Events</h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
                      {selectedDemoImage?.includes('demo2') 
                        ? 'I witnessed a man in a red shirt violently grab another individual by his collar right outside the main polling station. The aggressor was aggressively pointing his finger at the victim\'s face, and appeared to be inspecting or demanding to see his voter ID card which the victim was holding. The altercation was highly intimidating and clearly meant to coerce or violently suppress a specific vote.' 
                        : selectedDemoImage?.includes('demo3')
                          ? 'During a public political rally in the town square, the speaker explicitly urged his supporters to physically attack religious minorities living in the adjacent sector if they turned up to vote tomorrow. The speech was highly communal, deliberately provoking religious divides, and caused a violent frenzy among the crowd. The situation required immediate police intervention to disperse the mob.'
                          : 'At approximately 10:15 AM today, individuals wearing unmarked blue vests were seen handing out stacks of currency to voters approaching the polling station entry gate. The exchange occurred repeatedly over a 20-minute window before election officials could be notified. I managed to quickly capture this photograph from across the street without being detected.'}
                    </p>
                 </div>
                 
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Demo Pictures Error-Catching Image Gallery Modal */}
      {isDemoModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 3000
        }} onClick={() => setIsDemoModalOpen(false)}>
          <div className="card animate-fade-in" style={{ maxWidth: '800px', width: '90%', maxHeight: '80vh', overflowY: 'auto', position: 'relative', background: 'var(--surface-color)', border: '1px solid var(--border)', zIndex: 3001 }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setIsDemoModalOpen(false)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '1.2rem', cursor: 'pointer' }}>✖</button>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '15px', color: 'var(--primary)', paddingRight: '20px' }}>📸 Evidence Demo Gallery</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '25px', fontSize: '0.95rem', background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '4px', borderLeft: '3px solid var(--primary)' }}>
              Any images you upload into your physical <code>client/public/demo-evidence/</code> folder named exactly <strong>demo1.jpg</strong> through <strong>demo15.jpg</strong> (or .png extensions) will dynamically render directly below.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
               {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(num => (
                 <React.Fragment key={num}>
                   <img onClick={() => { setIsDemoModalOpen(false); setSelectedDemoImage(`/demo-evidence/demo${num}.jpg`); }} src={`/demo-evidence/demo${num}.jpg`} alt={`Demo Evidence ${num}`} style={{ width: '100%', height: '220px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--border)', cursor: 'pointer', transition: 'transform 0.2s ease' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.03)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'} onError={(e) => { e.target.style.display = 'none'; }} />
                   <img onClick={() => { setIsDemoModalOpen(false); setSelectedDemoImage(`/demo-evidence/demo${num}.png`); }} src={`/demo-evidence/demo${num}.png`} alt={`Demo Evidence ${num}`} style={{ width: '100%', height: '220px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--border)', cursor: 'pointer', transition: 'transform 0.2s ease' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.03)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'} onError={(e) => { e.target.style.display = 'none'; }} />
                 </React.Fragment>
               ))}
            </div>
          </div>
        </div>
      )}

      {/* Directory Modal holding all Malpractices triggered via header button */}
      {isMalpracticesModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000
        }} onClick={() => setIsMalpracticesModalOpen(false)}>
          <div className="card animate-fade-in" style={{ maxWidth: '800px', width: '90%', maxHeight: '80vh', overflowY: 'auto', position: 'relative', background: 'var(--surface-color)', border: '1px solid var(--border)', zIndex: 2001 }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setIsMalpracticesModalOpen(false)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '1.2rem', cursor: 'pointer' }}>✖</button>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '20px', color: 'var(--primary)', paddingRight: '20px' }}>📚 Common Electoral Malpractices</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              {malpractices.map((item, idx) => (
                <div 
                  key={idx} 
                  className="card"
                  style={{ padding: '15px', border: '1px solid rgba(67, 97, 238, 0.3)', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', cursor: 'pointer', transition: 'all 0.2s ease' }}
                  onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--warning)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                  onMouseOut={(e) => { e.currentTarget.style.borderColor = 'rgba(67, 97, 238, 0.3)'; e.currentTarget.style.transform = 'translateY(0)' }}
                  onClick={() => {
                     setIsMalpracticesModalOpen(false);
                     setTimeout(() => setSelectedMalpractice(item), 150);
                  }}
                >
                   <h4 style={{ color: 'var(--text-primary)', marginBottom: '8px', fontSize: '1.1rem' }}>{item.title}</h4>
                   <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5, margin: 0 }}>{item.shortDesc}</p>
                   <div style={{ marginTop: '15px', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 'bold' }}>Read Details →</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="page-header flex justify-between items-center header-actions">
        <div>
          <h2 className="page-title">My Dashboard</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Track the status of your submitted evidence</p>
        </div>
        
        <div className="flex gap-10 flex-mobile-col" style={{ alignItems: 'center' }}>
          <button onClick={() => setIsMalpracticesModalOpen(true)} className="btn mobile-full-width" style={{ background: 'var(--surface-color)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
            📚 Common Malpractices
          </button>
          <Link to="/report" className="btn btn-primary mobile-full-width">+ File New Report</Link>
          <button onClick={() => setIsDemoModalOpen(true)} className="btn mobile-full-width" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
            Demo Pics
          </button>
        </div>
      </div>
      
      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>Decrypting records...</div>
      ) : complaints.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '15px', color: 'var(--border)' }}>🗂️</div>
          <h3 style={{ color: 'var(--text-primary)', marginBottom: '10px' }}>No Reports Submitted Yet</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', maxWidth: '400px', margin: '0 auto 20px' }}>
            If you have witnessed electoral fraud, booth capturing, or bribery, your voice matters. File a confidential report.
          </p>
          <div className="flex gap-10" style={{ marginTop: '20px', justifyContent: 'center' }}>
            <Link to="/report" className="btn btn-primary" style={{ padding: '8px 24px' }}>Start a Report</Link>
            <button onClick={() => setIsDemoModalOpen(true)} className="btn" style={{ padding: '8px 24px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>Demo</button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {complaints.map((comp) => (
            <div key={comp._id} className="card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', padding: '20px' }}>
              <div className="flex justify-between items-center" style={{ marginBottom: '10px', gap: '10px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: '4px', maxWidth: '70%', lineHeight: '1.4' }}>{comp.type.replace('_', ' ').toUpperCase()}</span>
                <span style={{ fontSize: '0.8rem', color: getStatusColor(comp.status), fontWeight: 'bold', whiteSpace: 'nowrap' }}>• {comp.status.toUpperCase()}</span>
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>{comp.title}</h3>
              <p style={{ color: 'var(--text-secondary)', flex: 1, fontSize: '0.9rem', marginBottom: '15px' }}>
                {comp.description.length > 100 ? `${comp.description.substring(0,100)}...` : comp.description}
              </p>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '15px', borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
                📍 {comp.location} | 📅 {new Date(comp.createdAt).toLocaleDateString()} | 🕒 {new Date(comp.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              {comp.evidence && (
                <a href={comp.evidence} target="_blank" rel="noopener noreferrer" className="btn" style={{ background: 'var(--primary)', color: 'white', opacity: 0.9, marginBottom: '8px' }}>View Evidence Attachment</a>
              )}

              {/* Evidence Upload/Replace — only while pending */}
              {comp.status === 'pending' ? (
                <label className="btn" style={{ cursor: 'pointer', background: comp.evidence ? 'rgba(255,209,102,0.15)' : 'rgba(6,214,160,0.15)', border: `1px solid ${comp.evidence ? 'var(--warning)' : 'var(--success)'}`, color: comp.evidence ? 'var(--warning)' : 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', opacity: uploadingId === comp._id ? 0.6 : 1 }}>
                  {uploadingId === comp._id ? '⏳ Uploading...' : comp.evidence ? '🔄 Replace Evidence' : '📎 Attach Evidence'}
                  <input type="file" accept="image/*,video/*" style={{ display: 'none' }} disabled={uploadingId === comp._id} onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    setUploadingId(comp._id);
                    try {
                      const formData = new FormData();
                      formData.append('evidence', file);
                      const res = await axios.put(`${API_BASE_URL}/api/complaints/${comp._id}/evidence`, formData, {
                        headers: { 'Authorization': `Bearer ${user.token}`, 'Content-Type': 'multipart/form-data' }
                      });
                      setComplaints(prev => prev.map(c => c._id === comp._id ? { ...c, evidence: res.data.evidence } : c));
                    } catch (err) {
                      alert(err.response?.data?.message || 'Upload failed');
                    }
                    setUploadingId(null);
                    e.target.value = '';
                  }} />
                </label>
              ) : comp.status !== 'pending' && !comp.evidence && (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic', marginTop: '4px' }}>🔒 Evidence upload locked — complaint {comp.status}</div>
              )}

              {/* Delete Complaint */}
              <button 
                className="btn" 
                onClick={async () => {
                  if (!window.confirm('⚠️ Are you sure? This complaint will be permanently deleted and cannot be recovered.')) return;
                  try {
                    await axios.delete(`${API_BASE_URL}/api/complaints/${comp._id}`, {
                      headers: { 'Authorization': `Bearer ${user.token}` }
                    });
                    setComplaints(prev => prev.filter(c => c._id !== comp._id));
                  } catch (err) {
                    alert(err.response?.data?.message || 'Delete failed');
                  }
                }}
                style={{ marginTop: '8px', background: 'transparent', border: '1px solid rgba(239,71,111,0.3)', color: 'var(--danger)', fontSize: '0.85rem', padding: '8px', width: '100%', opacity: 0.7 }}
              >
                🗑️ Delete Report
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
