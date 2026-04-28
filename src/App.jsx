import { useEffect, useRef, useState, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import Scene from './Scene'
import { slides } from './slides'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function Slide({ slide, index }) {
  const ref = useRef()
  const titleRef = useRef()
  const bulletRefs = useRef([])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    gsap.fromTo(el, { opacity: 0, y: 60 }, {
      opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 80%', toggleActions: 'play none none reverse' }
    })
    if (titleRef.current) {
      const words = titleRef.current.querySelectorAll('.word')
      gsap.fromTo(words, { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'back.out(1.4)',
        scrollTrigger: { trigger: el, start: 'top 75%', toggleActions: 'play none none reverse' }
      })
    }
    const bullets = bulletRefs.current.filter(Boolean)
    if (bullets.length) {
      gsap.fromTo(bullets, { opacity: 0, x: -30 }, {
        opacity: 1, x: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 65%', toggleActions: 'play none none reverse' }
      })
    }
  }, [])

  const acc = slide.accent || '#7C5CFC'
  return (
    <div ref={ref} style={{ opacity: 0 }}>
      {slide.tag && (
        <div style={{
          fontFamily: 'DM Mono, monospace', fontSize: '0.72rem', letterSpacing: '0.1em',
          textTransform: 'uppercase', display: 'inline-block', marginBottom: '1.5rem',
          padding: '4px 14px', borderRadius: 20, background: acc + '22',
          border: `1px solid ${acc}55`, color: acc,
        }}>{slide.tag}</div>
      )}
      <div ref={titleRef} style={{ marginBottom: '2rem' }}>
        {slide.title.map((line, i) => (
          <div key={i} style={{ overflow: 'hidden' }}>
            <div className="word" style={{
              display: 'block',
              fontFamily: 'Syne, sans-serif',
              fontSize: 'clamp(2rem, 5vw, 3.8rem)',
              fontWeight: 800, lineHeight: 1.05, letterSpacing: '-1px',
              color: (slide.titleAccent && slide.titleAccent[i]) ? acc : '#E8E8F0',
            }}>{line}</div>
          </div>
        ))}
      </div>
      {slide.sub && (
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: '#8888AA', maxWidth: 420, lineHeight: 1.7, marginBottom: '2.5rem' }}>
          {slide.sub}
        </p>
      )}
      {slide.bullets && (
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {slide.bullets.map((b, i) => (
            <li key={i} ref={el => bulletRefs.current[i] = el}
              style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.875rem', opacity: 0 }}>
              <span style={{ marginTop: 7, width: 5, height: 5, borderRadius: '50%', background: acc, flexShrink: 0 }} />
              <span style={{ color: '#C8C8DC', lineHeight: 1.65 }}>{b}</span>
            </li>
          ))}
        </ul>
      )}
      {slide.id === 'hero' && (
        <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem', flexWrap: 'wrap' }}>
          <button
            style={{ padding: '0.75rem 1.75rem', borderRadius: 12, background: acc, color: '#fff', border: 'none', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}
            onClick={() => document.getElementById('problem-section')?.scrollIntoView({ behavior: 'smooth' })}
          >Explore Presentation ↓</button>
          <button style={{ padding: '0.75rem 1.75rem', borderRadius: 12, background: 'transparent', color: '#C8C8DC', border: `1px solid ${acc}44`, fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}>
            View Demo →
          </button>
        </div>
      )}
      {slide.id !== 'hero' && (
        <div style={{ marginTop: '3rem', height: 1, background: `linear-gradient(90deg, ${acc}66, transparent)` }} />
      )}
    </div>
  )
}

function NavDots({ active, total, onDotClick }) {
  return (
    <div style={{ position: 'fixed', right: 24, top: '50%', transform: 'translateY(-50%)', zIndex: 50, display: 'flex', flexDirection: 'column', gap: 10 }}>
      {Array.from({ length: total }).map((_, i) => (
        <button key={i} onClick={() => onDotClick(i)}
          style={{
            width: 8, height: 8, borderRadius: '50%', border: 'none', cursor: 'pointer',
            background: i === active ? '#7C5CFC' : '#ffffff22',
            transform: i === active ? 'scale(1.6)' : 'scale(1)',
            transition: 'all 0.3s',
          }} />
      ))}
    </div>
  )
}

function ProgressBar({ progress }) {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: 2, background: '#ffffff08', zIndex: 50 }}>
      <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, #7C5CFC, #00D9B1)', transition: 'width 0.1s' }} />
    </div>
  )
}

function SectionVisual({ slide }) {
  const ref = useRef()
  useEffect(() => {
    const el = ref.current
    if (!el) return
    gsap.fromTo(el, { opacity: 0, scale: 0.85 }, {
      opacity: 1, scale: 1, duration: 1.1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 80%', toggleActions: 'play none none reverse' }
    })
  }, [])
  const acc = slide.accent || '#7C5CFC'

  const content = {
    problem: (
      <div style={{ position: 'relative', width: 280, height: 280 }}>
        {['Manual', 'No AI', 'Rigid', 'Isolated', 'Costly'].map((t, i) => (
          <div key={t} style={{
            position: 'absolute', fontSize: '0.75rem', padding: '6px 14px', borderRadius: 8,
            fontFamily: 'DM Mono, monospace', background: '#FF4D6D18',
            border: '1px solid #FF4D6D33', color: '#FF4D6D',
            left: `${10 + i * 12}%`, top: `${8 + i * 17}%`,
            transform: `rotate(${(i - 2) * 6}deg)`,
          }}>{t}</div>
        ))}
        <div style={{ position: 'absolute', inset: 60, borderRadius: '50%', background: '#FF4D6D0A', border: '1px solid #FF4D6D22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>⚡</div>
      </div>
    ),
    opportunities: (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, width: 260 }}>
        {[
          { icon: '🚀', label: 'Digital Shift' },
          { icon: '🧠', label: 'AI Learning' },
          { icon: '💬', label: 'Smart Comms' },
          { icon: '🌐', label: 'Remote Access' },
          { icon: '📈', label: 'Analytics' },
          { icon: '🤲', label: 'Inclusivity' },
        ].map(({ icon, label }) => (
          <div key={label} style={{
            padding: '12px 8px', borderRadius: 12, textAlign: 'center',
            background: `${acc}10`, border: `1px solid ${acc}28`,
          }}>
            <div style={{ fontSize: 22, marginBottom: 4 }}>{icon}</div>
            <div style={{ fontSize: '0.7rem', fontFamily: 'DM Mono, monospace', color: acc }}>{label}</div>
          </div>
        ))}
      </div>
    ),
    objectives: (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, width: 240 }}>
        {['AI Platform', 'Adaptive', '24/7 Access', 'Mobile', 'Automation', 'Inclusive'].map(t => (
          <div key={t} style={{ padding: '10px 8px', borderRadius: 12, textAlign: 'center', fontSize: '0.78rem', fontWeight: 600, background: `${acc}12`, border: `1px solid ${acc}25`, color: acc }}>
            {t}
          </div>
        ))}
      </div>
    ),
    significance: (
      <div style={{ position: 'relative', width: 260, height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `1px solid ${acc}22` }} />
        <div style={{ position: 'absolute', inset: 24, borderRadius: '50%', border: `1px dashed ${acc}18` }} />
        {['Personalized', 'Affordable', '24/7', 'Scalable', 'Inclusive', 'Automated'].map((t, i) => {
          const angle = (i / 6) * Math.PI * 2 - Math.PI / 2
          const r = 100
          return (
            <div key={t} style={{
              position: 'absolute', fontSize: '0.65rem', fontFamily: 'DM Mono, monospace',
              background: `${acc}14`, border: `1px solid ${acc}30`, color: acc,
              padding: '3px 8px', borderRadius: 6,
              left: `calc(50% + ${Math.cos(angle) * r}px - 36px)`,
              top: `calc(50% + ${Math.sin(angle) * r}px - 12px)`,
            }}>{t}</div>
          )
        })}
        <div style={{ zIndex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: 36 }}>💡</div>
          <div style={{ fontSize: '0.7rem', fontFamily: 'DM Mono, monospace', color: acc, marginTop: 6 }}>Impact</div>
        </div>
      </div>
    ),
    methodology: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 240 }}>
        {['① Planning', '② Requirements', '③ Design', '④ Sprint ×4', '⑤ Testing', '⑥ Delivery'].map((ph, i) => (
          <div key={ph} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: `${acc}22`, border: `1px solid ${acc}44`, color: acc, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontFamily: 'DM Mono, monospace', flexShrink: 0 }}>{i+1}</div>
            <div style={{ flex: 1, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', padding: '0 12px', fontSize: '0.8rem', background: `${acc}0A`, border: `1px solid ${acc}18`, color: '#C8C8DC' }}>{ph}</div>
          </div>
        ))}
      </div>
    ),
    tech: (
      <div style={{ position: 'relative', width: 260, height: 260 }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px solid #00D9B122' }} />
        <div style={{ position: 'absolute', inset: 24, borderRadius: '50%', border: '1px solid #7C5CFC22' }} />
        <div style={{ position: 'absolute', inset: 48, borderRadius: '50%', border: '1px solid #00D9B133' }} />
        {['React', 'Flutter', 'Node', 'Supabase', 'Dart', 'Colab'].map((t, i) => {
          const angle = (i / 6) * Math.PI * 2 - Math.PI / 2
          const r = 108
          return (
            <div key={t} style={{
              position: 'absolute', fontSize: '0.7rem', fontFamily: 'DM Mono, monospace',
              background: '#00D9B114', border: '1px solid #00D9B130', color: '#00D9B1',
              padding: '3px 8px', borderRadius: 6,
              left: `calc(50% + ${Math.cos(angle) * r}px - 22px)`,
              top: `calc(50% + ${Math.sin(angle) * r}px - 12px)`,
            }}>{t}</div>
          )
        })}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>⚛️</div>
      </div>
    ),
    feasibility: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: 260 }}>
        {[
          { icon: '👥', label: 'Team', value: '4 Developers', sub: 'Frontend · Backend · AI · Mobile' },
          { icon: '☁️', label: 'Infrastructure', value: 'VPS → Cloud', sub: 'AWS / Azure ready' },
          { icon: '⚙️', label: 'Automation', value: 'n8n Workflows', sub: '70% admin load reduced' },
          { icon: '🔄', label: 'Deployment', value: 'CI/CD Pipeline', sub: 'Zero downtime updates' },
          { icon: '📊', label: 'Monitoring', value: 'Grafana + Prometheus', sub: 'Real-time system health' },
        ].map(({ icon, label, value, sub }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 12, background: `${acc}0A`, border: `1px solid ${acc}20` }}>
            <div style={{ fontSize: 20, flexShrink: 0 }}>{icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.7rem', fontFamily: 'DM Mono, monospace', color: '#8888AA' }}>{label}</span>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: acc, fontFamily: 'Syne, sans-serif' }}>{value}</span>
              </div>
              <div style={{ fontSize: '0.62rem', color: '#555566', fontFamily: 'DM Mono, monospace', marginTop: 2 }}>{sub}</div>
            </div>
          </div>
        ))}
      </div>
    ),
    risks: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: 240 }}>
        {[['HIGH', '#FF4D6D', 3], ['MED', '#FFB347', 7], ['LOW', '#00D9B1', 3]].map(([lvl, clr, cnt]) => (
          <div key={lvl} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 12, background: `${clr}0D`, border: `1px solid ${clr}22` }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: clr, fontFamily: 'DM Mono, monospace', minWidth: 34 }}>{lvl}</span>
            <div style={{ display: 'flex', gap: 4 }}>
              {Array.from({ length: cnt }).map((_, i) => (
                <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: clr }} />
              ))}
            </div>
            <span style={{ fontSize: '0.72rem', color: '#8888AA', marginLeft: 'auto' }}>{cnt}</span>
          </div>
        ))}
      </div>
    ),
    work_plan: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: 270 }}>
        {[
          { ph: 'Planning', w: 25, wk: 'Wk 1–2' },
          { ph: 'Requirements', w: 40, wk: 'Wk 3–4' },
          { ph: 'Design', w: 58, wk: 'Wk 5–7' },
          { ph: 'Sprint 1', w: 72, wk: 'Wk 8–10' },
          { ph: 'Sprint 2 & 3', w: 87, wk: 'Wk 11–13' },
          { ph: 'Sprint 4', w: 95, wk: 'Wk 14–16' },
          { ph: 'Testing', w: 100, wk: 'Wk 17–18' },
        ].map(({ ph, w, wk }, i) => (
          <div key={ph}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', marginBottom: 3, fontFamily: 'DM Mono, monospace' }}>
              <span style={{ color: '#C8C8DC' }}>{ph}</span>
              <span style={{ color: '#8888AA' }}>{wk}</span>
            </div>
            <div style={{ height: 7, borderRadius: 4, background: '#ffffff08' }}>
              <div style={{ width: `${w}%`, height: '100%', borderRadius: 4, background: `linear-gradient(90deg, ${acc}, #7C5CFC)`, opacity: 0.6 + i * 0.06 }} />
            </div>
          </div>
        ))}
      </div>
    ),
    previous_systems: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 260 }}>
        {[
          { name: 'Coursera', features: ['Certifications', 'No AI adapt', 'Paid'], clr: '#8888AA' },
          { name: 'Khan Academy', features: ['Free', 'Academic base', 'No voice'], clr: '#8888AA' },
          { name: 'Duolingo', features: ['Gamified', 'Languages only', 'No admin'], clr: '#8888AA' },
          { name: 'AIM ✦ Ours', features: ['AI-native', 'Bilingual voice', 'n8n auto'], clr: acc },
        ].map(({ name, features, clr }) => (
          <div key={name} style={{ padding: '10px 14px', borderRadius: 10, background: clr === acc ? `${acc}12` : '#ffffff06', border: `1px solid ${clr === acc ? acc + '33' : '#ffffff12'}` }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: clr, fontFamily: 'Syne, sans-serif', marginBottom: 5 }}>{name}</div>
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
              {features.map(f => (
                <span key={f} style={{ fontSize: '0.62rem', padding: '2px 7px', borderRadius: 4, background: `${clr}18`, color: clr, fontFamily: 'DM Mono, monospace' }}>{f}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    ),
    data_collection: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 260 }}>
        {[
          { icon: '📄', title: 'Document Analysis', desc: 'Forms, schedules, reporting processes' },
          { icon: '🗣️', title: 'Interviews', desc: 'Instructors on tech & placement needs' },
          { icon: '👁️', title: 'Observation', desc: 'Live classes & admin workflows' },
        ].map(({ icon, title, desc }) => (
          <div key={title} style={{ display: 'flex', gap: 12, padding: '12px 14px', borderRadius: 12, background: `${acc}0A`, border: `1px solid ${acc}20` }}>
            <div style={{ fontSize: 24, flexShrink: 0 }}>{icon}</div>
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: acc, fontFamily: 'Syne, sans-serif' }}>{title}</div>
              <div style={{ fontSize: '0.67rem', color: '#8888AA', fontFamily: 'DM Mono, monospace', marginTop: 2 }}>{desc}</div>
            </div>
          </div>
        ))}
      </div>
    ),
    functional_req: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7, width: 260 }}>
        {[
          { code: 'FR1', label: 'Auth & Roles', icon: '🔐' },
          { code: 'FR2', label: 'AI Placement', icon: '🧠' },
          { code: 'FR3', label: 'AI Tutoring', icon: '📖' },
          { code: 'FR4', label: 'Content Mgmt', icon: '📦' },
          { code: 'FR5', label: 'Assessments', icon: '📝' },
          { code: 'FR6', label: 'Dashboards', icon: '📊' },
          { code: 'FR7', label: 'Global Chat', icon: '💬' },
        ].map(({ code, label, icon }) => (
          <div key={code} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 12px', borderRadius: 8, background: `${acc}0A`, border: `1px solid ${acc}20` }}>
            <span style={{ fontSize: '0.62rem', fontWeight: 700, color: acc, fontFamily: 'DM Mono, monospace', minWidth: 28 }}>{code}</span>
            <span style={{ fontSize: 14 }}>{icon}</span>
            <span style={{ fontSize: '0.75rem', color: '#C8C8DC' }}>{label}</span>
          </div>
        ))}
      </div>
    ),
    non_functional_req: (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, width: 260 }}>
        {[
          { code: 'NFR1', label: 'Performance', icon: '⚡', clr: '#FFB347' },
          { code: 'NFR2', label: 'Availability', icon: '🟢', clr: '#00D9B1' },
          { code: 'NFR3', label: 'Security', icon: '🔐', clr: '#FF4D6D' },
          { code: 'NFR4', label: 'AI Safety', icon: '🤖', clr: '#7C5CFC' },
          { code: 'NFR5', label: 'Accessibility', icon: '♿', clr: '#00D9B1' },
          { code: 'NFR6', label: 'Maintainability', icon: '🔧', clr: '#FFB347' },
        ].map(({ code, label, icon, clr }) => (
          <div key={code} style={{ padding: '10px 8px', borderRadius: 10, textAlign: 'center', background: `${clr}0D`, border: `1px solid ${clr}22` }}>
            <div style={{ fontSize: 18, marginBottom: 3 }}>{icon}</div>
            <div style={{ fontSize: '0.6rem', fontWeight: 700, color: clr, fontFamily: 'DM Mono, monospace' }}>{code}</div>
            <div style={{ fontSize: '0.65rem', color: '#8888AA', marginTop: 2, fontFamily: 'DM Mono, monospace' }}>{label}</div>
          </div>
        ))}
      </div>
    ),
    dfd_level0: (
      <div style={{ position: 'relative', width: 280, height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Central hub */}
        <div style={{ position: 'absolute', width: 90, height: 50, borderRadius: 8, background: `${acc}18`, border: `2px solid ${acc}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
          <span style={{ fontSize: '0.62rem', fontFamily: 'DM Mono, monospace', color: acc, textAlign: 'center', fontWeight: 700 }}>AIM Platform</span>
        </div>
        {/* Outer actors */}
        {[
          { label: 'Student', angle: -90 },
          { label: 'Parent', angle: 0 },
          { label: 'Admin', angle: 90 },
          { label: 'Reviewer', angle: 180 },
        ].map(({ label, angle }) => {
          const rad = (angle * Math.PI) / 180
          const r = 110
          return (
            <div key={label} style={{
              position: 'absolute',
              left: `calc(50% + ${Math.cos(rad) * r}px - 30px)`,
              top: `calc(50% + ${Math.sin(rad) * r}px - 16px)`,
              width: 60, height: 32, borderRadius: 6,
              background: '#ffffff08', border: '1px solid #ffffff18',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.62rem', fontFamily: 'DM Mono, monospace', color: '#C8C8DC',
            }}>
              {label}
            </div>
          )
        })}
        {/* Connecting lines  */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
          {[[-90, 0], [0, 90], [90, 180], [180, 270]].map(([angle], i) => {
            const rad = (angle * Math.PI) / 180
            const r = 75
            const cx = 140, cy = 140
            return (
              <line key={i}
                x1={cx} y1={cy}
                x2={cx + Math.cos(rad) * r}
                y2={cy + Math.sin(rad) * r}
                stroke={`${acc}44`} strokeWidth={1} strokeDasharray="3 3"
              />
            )
          })}
        </svg>
        {/* External services label */}
        <div style={{ position: 'absolute', bottom: 4, left: 0, right: 0, textAlign: 'center', fontSize: '0.58rem', fontFamily: 'DM Mono, monospace', color: '#8888AA' }}>
          ↔ Auth · CDN · Voice · n8n
        </div>
      </div>
    ),
    uml: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: 260 }}>
        {/* Use case boxes */}
        {[
          { actor: '👤 Student', cases: ['Login', 'Placement', 'Lessons', 'Quiz', 'Chat'] },
          { actor: '👨‍🏫 Instructor', cases: ['Upload', 'Review', 'Analytics'] },
          { actor: '🏛️ Admin', cases: ['Manage Users', 'Reports', 'Config'] },
        ].map(({ actor, cases }) => (
          <div key={actor} style={{ padding: '8px 12px', borderRadius: 10, background: `${acc}08`, border: `1px solid ${acc}22` }}>
            <div style={{ fontSize: '0.72rem', color: acc, fontFamily: 'Syne, sans-serif', fontWeight: 700, marginBottom: 5 }}>{actor}</div>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {cases.map(c => (
                <span key={c} style={{ fontSize: '0.6rem', padding: '2px 6px', borderRadius: 4, background: `${acc}14`, color: '#C8C8DC', fontFamily: 'DM Mono, monospace', border: `1px solid ${acc}20` }}>{c}</span>
              ))}
            </div>
          </div>
        ))}
        <div style={{ fontSize: '0.62rem', fontFamily: 'DM Mono, monospace', color: '#8888AA', textAlign: 'center', marginTop: 2 }}>
          Activity · Class · Sequence diagrams →
        </div>
      </div>
    ),
    conclusion: (
      <div style={{ position: 'relative', width: 240, height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px solid #00D9B122', animation: 'spin 12s linear infinite' }} />
        <div style={{ position: 'absolute', inset: 16, borderRadius: '50%', border: '1px dashed #7C5CFC22', animation: 'spin 8s linear infinite reverse' }} />
        <div style={{ textAlign: 'center', zIndex: 1 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🚀</div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, color: '#00D9B1', fontSize: '0.9rem' }}>AIM Platform</div>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.7rem', color: '#8888AA', marginTop: 4 }}>CSIT490 · 2026</div>
        </div>
      </div>
    ),
  }

  return (
    <div ref={ref} style={{ opacity: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
      {content[slide.id] || null}
    </div>
  )
}

// ─── Image panel shown for slides that have an `image` property ───────────────
function DiagramImage({ slide }) {
  const ref = useRef()
  // 0 = try real image, 1 = try svg fallback, 2 = show built-in placeholder
  const [stage, setStage] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    gsap.fromTo(el, { opacity: 0, scale: 0.92, y: 20 }, {
      opacity: 1, scale: 1, y: 0, duration: 1.1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 80%', toggleActions: 'play none none reverse' }
    })
  }, [])

  const acc = slide.accent || '#7C5CFC'
  const src = stage === 0 ? slide.image : slide.imageFallback
  const showPlaceholder = stage >= 2

  const diagramName = slide.image?.split('/').pop() || 'diagram.png'

  return (
    <div ref={ref} style={{ opacity: 0, width: '100%', display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
      {/* glowing frame */}
      <div style={{
        position: 'relative', width: '100%', borderRadius: 16,
        background: '#0A0A12', border: `1px solid ${acc}44`,
        boxShadow: `0 0 40px ${acc}18, 0 0 0 1px ${acc}22`,
        overflow: 'hidden', minHeight: 260,
        display: 'flex', flexDirection: 'column',
      }}>
        {/* accent top bar */}
        <div style={{ height: 3, background: `linear-gradient(90deg, ${acc}, transparent)`, flexShrink: 0 }} />

        {showPlaceholder ? (
          /* ── built-in placeholder (no img tag = no broken icon ever) ── */
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '2.5rem 2rem', gap: 16,
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: `${acc}14`, border: `1px solid ${acc}33`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28,
            }}>🖼️</div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: acc, fontSize: '0.9rem', marginBottom: 6 }}>
                {slide.title.join(' ')}
              </div>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.68rem', color: '#8888AA', lineHeight: 1.8 }}>
                Add your diagram file to:
              </div>
              <div style={{
                fontFamily: 'DM Mono, monospace', fontSize: '0.72rem',
                color: acc, marginTop: 6, padding: '6px 16px',
                borderRadius: 8, background: `${acc}10`, border: `1px solid ${acc}22`,
                display: 'inline-block',
              }}>
                public/diagrams/{diagramName}
              </div>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.62rem', color: '#555566', marginTop: 8 }}>
                .png · .jpg · .svg all work
              </div>
            </div>
          </div>
        ) : (
          /* ── real image ── */
          <img
            src={src}
            alt={slide.title.join(' ')}
            onError={() => setStage(s => s + 1)}
            style={{
              display: 'block', width: '100%', maxHeight: '62vh',
              objectFit: 'contain',
              background: '#ffffff',
              padding: '1rem',
            }}
          />
        )}

        {/* corner badge */}
        <div style={{
          position: 'absolute', top: 12, right: 12,
          fontFamily: 'DM Mono, monospace', fontSize: '0.6rem',
          padding: '3px 10px', borderRadius: 20,
          background: acc + '22', border: `1px solid ${acc}44`, color: acc,
        }}>{slide.tag}</div>
      </div>

      {/* caption */}
      {slide.imageCaption && (
        <p style={{
          fontFamily: 'DM Mono, monospace', fontSize: '0.68rem',
          color: '#8888AA', textAlign: 'center', maxWidth: 460, lineHeight: 1.6,
        }}>
          {slide.imageCaption}
        </p>
      )}
    </div>
  )
}

function Section({ slide, index }) {
  const isImageSlide = !!slide.image

  if (isImageSlide) {
    // wide layout: text left (narrow) · image right (wide)
    return (
      <section id={slide.id + '-section'} style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '10vh 2rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '3rem', alignItems: 'center' }}>
          <div><Slide slide={slide} index={index} /></div>
          <div><DiagramImage slide={slide} /></div>
        </div>
      </section>
    )
  }

  return (
    <section id={slide.id + '-section'} style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '10vh 2rem' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', width: '100%', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem', alignItems: 'center' }}>
        <div style={{ order: index % 2 === 0 ? 1 : 2 }}>
          <Slide slide={slide} index={index} />
        </div>
        <div style={{ order: index % 2 === 0 ? 2 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
          <SectionVisual slide={slide} />
        </div>
      </div>
    </section>
  )
}

export default function App() {
  const [scrollY, setScrollY] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeSlide, setActiveSlide] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const sy = window.scrollY
      const maxScroll = document.body.scrollHeight - window.innerHeight
      setScrollY(sy)
      setScrollProgress((sy / maxScroll) * 100)
      setActiveSlide(Math.min(slides.length - 1, Math.floor(sy / window.innerHeight)))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const goToSlide = useCallback((i) => {
    window.scrollTo({ top: i * window.innerHeight, behavior: 'smooth' })
  }, [])

  return (
    <div style={{ background: '#040408' }}>
      <ProgressBar progress={scrollProgress} />
      <NavDots active={activeSlide} total={slides.length} onDotClick={goToSlide} />

      {/* Fixed 3D canvas - fades as user scrolls */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, opacity: Math.max(0, 1 - scrollY * 0.0015), pointerEvents: 'none' }}>
        <Canvas camera={{ position: [0, 0, 6], fov: 50 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }} style={{ background: 'transparent' }}>
          <Suspense fallback={null}><Scene scrollY={scrollY} /></Suspense>
        </Canvas>
      </div>

      {/* Dynamic radial bg per section */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: `radial-gradient(ellipse at 50% 0%, ${slides[activeSlide]?.accent || '#7C5CFC'}18 0%, transparent 60%)`,
        transition: 'background 1.2s ease',
      }} />

      {/* Grid */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(124,92,252,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(124,92,252,0.04) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      {/* Hero */}
      <section style={{ position: 'relative', zIndex: 10, minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '0 2rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', width: '100%' }}>
          <div style={{ maxWidth: 520 }}>
            <Slide slide={slides[0]} index={0} />
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, color: '#8888AA', fontFamily: 'DM Mono, monospace', fontSize: '0.72rem' }}>
          <span>scroll to explore</span>
          <div style={{ width: 1, height: 32, background: 'linear-gradient(180deg, #7C5CFC, transparent)', animation: 'bounce 1s ease-in-out infinite alternate' }} />
        </div>
      </section>

      {/* Content sections */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        {slides.slice(1).map((slide, i) => (
          <Section key={slide.id} slide={slide} index={i} />
        ))}
      </div>

      <footer style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '4rem 2rem', borderTop: '1px solid #ffffff08', fontFamily: 'DM Mono, monospace', color: '#8888AA', fontSize: '0.75rem' }}>
        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, color: '#7C5CFC', fontSize: '1.1rem', marginBottom: 8 }}>AIM — Academic Intelligent Minds</div>
        CSIT490 · Senior Project · Supervised by Dr. Saleh Al-Riashi · Al-Rasheed Smart University · 2026
      </footer>

      <style>{`
        @keyframes bounce { from { transform: scaleY(1); } to { transform: scaleY(0.4); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse { from { opacity: 0.5; } to { opacity: 1; } }
      `}</style>
    </div>
  )
}
