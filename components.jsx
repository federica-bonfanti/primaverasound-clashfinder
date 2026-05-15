// app.jsx — Primavera Clash Finder
// Loud, dark, music-first. Two views: FIND / PLAN.

const { useState, useMemo, useEffect, useRef } = React;

// ─────────────────────────────────────────────────────────────
// Hooks
// ─────────────────────────────────────────────────────────────
function useNow(initialMins = 20 * 60 + 30) {
  // synthetic festival clock — initial 20:30 unless tweaked
  const [now, setNow] = useState(initialMins);
  return [now, setNow];
}

// items overlap if start<other.end AND other.start<item.end
function itemsClash(a, b) {
  return a.start < b.end && b.start < a.end;
}

// gap in minutes between two consecutive ordered items
function gapBetween(a, b) {
  return b.start - a.end; // negative = overlap
}

// ─────────────────────────────────────────────────────────────
// Tiny UI atoms
// ─────────────────────────────────────────────────────────────
function StageDot({ stage, size = 10 }) {
  const s = STAGES[stage];
  return <span style={{
    display: 'inline-block', width: size, height: size, borderRadius: '50%',
    background: s.color, flex: 'none',
  }} />;
}

function StagePill({ stage, mono = false }) {
  const s = STAGES[stage];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 8px 4px 6px', borderRadius: 999,
      background: mono ? 'rgba(255,255,255,0.06)' : s.color,
      color: mono ? '#fff' : s.ink,
      fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 600, letterSpacing: '0.06em',
      lineHeight: 1, whiteSpace: 'nowrap',
    }}>
      {mono && <StageDot stage={stage} size={6} />}
      {s.short}
    </span>
  );
}

function Icon({ name, size = 14, color = 'currentColor' }) {
  return <i className={`ti ti-${name}`} style={{ fontSize: size, color, lineHeight: 1 }} />;
}

// ─────────────────────────────────────────────────────────────
// Band card — used in clash finder
// ─────────────────────────────────────────────────────────────
function BandCard({ band, selected, conflicted, onToggle, isNow }) {
  const stage = STAGES[band.stage];
  const dur = band.end - band.start;

  return (
    <button
      onClick={onToggle}
      style={{
        display: 'block', width: '100%', textAlign: 'left',
        background: selected ? stage.color : '#0F0F0F',
        color: selected ? stage.ink : '#fff',
        border: '1px solid',
        borderColor: selected ? stage.color : 'rgba(255,255,255,0.08)',
        borderRadius: 14, padding: 0, margin: 0, cursor: 'pointer',
        position: 'relative', overflow: 'hidden',
        transition: 'background 160ms ease, transform 80ms ease, border-color 160ms',
        outline: conflicted ? '2px solid #FF2D55' : 'none',
        outlineOffset: conflicted ? -1 : 0,
      }}
      onMouseDown={e => e.currentTarget.style.transform = 'scale(0.992)'}
      onMouseUp={e => e.currentTarget.style.transform = ''}
      onMouseLeave={e => e.currentTarget.style.transform = ''}
    >
      {/* stage color bar (when not selected) */}
      {!selected && (
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: 4,
          background: stage.color,
        }} />
      )}

      <div style={{ display: 'flex', alignItems: 'stretch', gap: 12, padding: '14px 14px 14px 18px' }}>
        {/* Time column */}
        <div style={{
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 500,
          letterSpacing: '0.04em', minWidth: 44,
          color: selected ? stage.ink : 'rgba(255,255,255,0.85)',
        }}>
          <span>{fmtTime(band.start)}</span>
          <span style={{ opacity: selected ? 0.5 : 0.4 }}>{fmtTime(band.end)}</span>
        </div>

        {/* Vertical separator */}
        <div style={{
          width: 1, alignSelf: 'stretch',
          background: selected ? 'rgba(0,0,0,0.18)' : 'rgba(255,255,255,0.08)',
        }} />

        {/* Body */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{
            fontFamily: 'var(--display)', fontWeight: 700, fontSize: 20,
            lineHeight: 1.05, letterSpacing: '-0.01em',
            color: selected ? stage.ink : '#fff',
            wordBreak: 'break-word',
          }}>{band.name}</div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <StagePill stage={band.stage} mono={!selected} />
            <span style={{
              fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.06em',
              color: selected ? 'rgba(0,0,0,0.55)' : 'rgba(255,255,255,0.4)',
              fontWeight: 500,
            }}>{fmtDuration(dur)}</span>
            {isNow && !selected && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                padding: '3px 7px', borderRadius: 999,
                background: '#fff', color: '#000',
                fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em',
              }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#FF2D55' }} />
                LIVE
              </span>
            )}
            {conflicted && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                padding: '3px 7px', borderRadius: 999,
                background: '#FF2D55', color: '#fff',
                fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em',
              }}>
                <Icon name="alert-triangle" size={10} />
                CLASH
              </span>
            )}
          </div>
        </div>

        {/* Add/remove glyph */}
        <div style={{
          alignSelf: 'flex-start', flex: 'none',
          width: 28, height: 28, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: selected ? 'rgba(0,0,0,0.18)' : 'rgba(255,255,255,0.06)',
          color: selected ? stage.ink : '#fff',
          border: selected ? 'none' : '1px solid rgba(255,255,255,0.1)',
        }}>
          <Icon name={selected ? 'check' : 'plus'} size={14} />
        </div>
      </div>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// Gap chip — between consecutive cards
// ─────────────────────────────────────────────────────────────
const GAP_STYLES = {
  eat:   { bg: '#16271B', fg: '#7CE0A0', border: 'rgba(124,224,160,0.22)' },
  rest:  { bg: '#161616', fg: 'rgba(255,255,255,0.55)', border: 'rgba(255,255,255,0.08)' },
  move:  { bg: '#291C0E', fg: '#FFB76A', border: 'rgba(255,183,106,0.22)' },
  clash: { bg: '#2A0E15', fg: '#FF6680', border: 'rgba(255,102,128,0.3)' },
};

function GapChip({ minutes }) {
  const g = classifyGap(minutes);
  const s = GAP_STYLES[g.kind];
  const display = g.kind === 'clash' ? `OVERLAP ${Math.abs(minutes)}m` : fmtDuration(minutes).toUpperCase();
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px',
      margin: '6px 0',
    }}>
      <div style={{ flex: 1, height: 1, background: s.border }} />
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '5px 10px', borderRadius: 999,
        background: s.bg, color: s.fg,
        border: `1px solid ${s.border}`,
        fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
      }}>
        <Icon name={g.icon} size={11} />
        {g.label} · {display}
      </div>
      <div style={{ flex: 1, height: 1, background: s.border }} />
    </div>
  );
}

Object.assign(window, {
  StageDot, StagePill, Icon, BandCard, GapChip, GAP_STYLES, itemsClash, gapBetween, useNow,
});
