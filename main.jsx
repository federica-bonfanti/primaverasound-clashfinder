// main.jsx — Primavera Plan (single-view itinerary)

const { useState: _us, useMemo: _um, useEffect: _ue } = React;

// ─────────────────────────────────────────────────────────────
// Top brand strip
// ─────────────────────────────────────────────────────────────
function BrandBar({ now }) {
  return (
    <div style={{
      padding: '4px 16px 12px', display: 'flex',
      alignItems: 'flex-end', justifyContent: 'space-between', gap: 12,
    }}>
      <div>
        <div style={{
          fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.22em',
          color: 'rgba(255,255,255,0.45)', fontWeight: 700,
        }}>PRIMAVERA · BCN 2026</div>
        <div style={{
          fontFamily: 'var(--display)', fontSize: 24, fontWeight: 800,
          letterSpacing: '-0.025em', lineHeight: 0.95, marginTop: 4,
          display: 'flex', alignItems: 'baseline', gap: 8,
        }}>
          CLASH<span style={{ color: '#FF3D6E' }}>·</span>FINDER
        </div>
      </div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '6px 10px', borderRadius: 999,
        background: '#0F0F0F', border: '1px solid rgba(255,255,255,0.08)',
      }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#FF2D55', boxShadow: '0 0 10px #FF2D55' }} />
        <span style={{
          fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
          color: '#fff',
        }}>{fmtTime(now)}</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// App root — PLAN view only
// ─────────────────────────────────────────────────────────────
const DEFAULTS = /*EDITMODE-BEGIN*/{
  "now": 1410,
  "accent": "#FF3D6E"
}/*EDITMODE-END*/;

function App() {
  const t = useTweaks(DEFAULTS);
  const [selected, setSelected] = _us(() => [
    ...LINEUP.thu, ...LINEUP.fri, ...LINEUP.sat,
  ]);
  const removeBand = (id) => setSelected(prev => prev.filter(s => s.id !== id));

  return (
    <div style={{
      position: 'absolute', inset: 0, background: '#0a0a0a', color: '#fff',
      overflow: 'hidden', display: 'flex', flexDirection: 'column',
      paddingTop: 62,
    }}>
      <BrandBar now={t.now} />
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', WebkitOverflowScrolling: 'touch' }}>
        <Itinerary selected={selected} removeBand={removeBand} />
      </div>

      <TweaksPanel title="TWEAKS">
        <TweakSection title="Clock">
          <TweakSlider label="Synthetic 'now'" min={1080} max={1800} step={15}
            value={t.now}
            onChange={v => t.setTweak('now', v)}
            formatValue={v => fmtTime(v)} />
        </TweakSection>
        <TweakSection title="Plan">
          <TweakButton onClick={() => setSelected([...LINEUP.thu, ...LINEUP.fri, ...LINEUP.sat])} label="Restore full lineup" />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

Object.assign(window, { App, BrandBar });
