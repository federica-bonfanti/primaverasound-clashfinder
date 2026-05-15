// views.jsx — Clash Finder + Itinerary views

const { useState: _useState, useMemo: _useMemo } = React;

// ─────────────────────────────────────────────────────────────
// Day chip
// ─────────────────────────────────────────────────────────────
function DayChip({ day, active, onClick, count }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1, background: active ? '#fff' : 'transparent',
        color: active ? '#000' : 'rgba(255,255,255,0.55)',
        border: active ? '1px solid #fff' : '1px solid rgba(255,255,255,0.12)',
        borderRadius: 12, padding: '10px 10px', cursor: 'pointer',
        textAlign: 'left', position: 'relative', overflow: 'hidden',
        transition: 'all 160ms ease',
      }}>
      <div style={{
        fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.16em',
        fontWeight: 700, opacity: active ? 0.55 : 0.6,
      }}>JUN {day.date}</div>
      <div style={{
        fontFamily: 'var(--display)', fontSize: 22, fontWeight: 700,
        letterSpacing: '-0.02em', lineHeight: 1, marginTop: 4,
      }}>{day.label}</div>
      {count > 0 && (
        <div style={{
          position: 'absolute', right: 8, top: 8,
          minWidth: 18, height: 18, padding: '0 5px', borderRadius: 999,
          background: active ? '#000' : '#fff', color: active ? '#fff' : '#000',
          fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{count}</div>
      )}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// Stage legend
// ─────────────────────────────────────────────────────────────
function StageLegend() {
  return (
    <div style={{
      display: 'flex', flexWrap: 'wrap', gap: 6, padding: '0 16px',
    }}>
      {Object.entries(STAGES).map(([id, s]) => (
        <div key={id} style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '4px 8px', borderRadius: 999,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <StageDot stage={id} size={7} />
          <span style={{
            fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.08em',
            color: 'rgba(255,255,255,0.6)', fontWeight: 600,
          }}>{s.short}</span>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Clash Finder view
// ─────────────────────────────────────────────────────────────
function ClashFinder({ activeDay, setActiveDay, selected, toggle, now, perDayCounts }) {
  const acts = LINEUP[activeDay];
  const selectedSet = new Set(selected.map(s => s.id));

  // determine which selected items clash with any other selected
  const clashIds = new Set();
  for (let i = 0; i < selected.length; i++) {
    for (let j = i + 1; j < selected.length; j++) {
      if (itemsClash(selected[i], selected[j])) {
        clashIds.add(selected[i].id);
        clashIds.add(selected[j].id);
      }
    }
  }

  return (
    <div style={{ padding: '8px 0 140px' }}>
      {/* Day picker */}
      <div style={{ display: 'flex', gap: 8, padding: '4px 16px 12px' }}>
        {DAYS.map(d => (
          <DayChip
            key={d.id}
            day={d}
            active={activeDay === d.id}
            onClick={() => setActiveDay(d.id)}
            count={perDayCounts[d.id]}
          />
        ))}
      </div>

      {/* Stage legend */}
      <StageLegend />

      {/* Day header */}
      <div style={{
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        padding: '20px 16px 12px',
      }}>
        <div>
          <div style={{
            fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em',
            color: 'rgba(255,255,255,0.4)', fontWeight: 600,
          }}>SCHEDULE / {DAYS.find(d => d.id === activeDay).dateLong.toUpperCase()}</div>
          <div style={{
            fontFamily: 'var(--display)', fontSize: 32, fontWeight: 800,
            letterSpacing: '-0.03em', lineHeight: 1, marginTop: 6,
          }}>{acts.length} ACTS</div>
        </div>
        <div style={{
          fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em',
          color: 'rgba(255,255,255,0.4)', fontWeight: 600, textAlign: 'right',
        }}>
          TAP TO ADD<br/>TO PLAN
        </div>
      </div>

      {/* Cards + gaps (gaps only appear between consecutive *selected* acts) */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {acts.map((band, i) => {
          const isSelected = selectedSet.has(band.id);
          const isNow = now >= band.start && now < band.end;

          // find next selected act on same day (in schedule order)
          let gapMins = null;
          if (isSelected) {
            for (let j = i + 1; j < acts.length; j++) {
              if (selectedSet.has(acts[j].id)) {
                gapMins = gapBetween(band, acts[j]);
                break;
              }
            }
          }

          return (
            <React.Fragment key={band.id}>
              <BandCard
                band={band}
                selected={isSelected}
                conflicted={clashIds.has(band.id)}
                onToggle={() => toggle(band)}
                isNow={isNow}
              />
              {gapMins !== null && <GapChip minutes={gapMins} />}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Itinerary view
// ─────────────────────────────────────────────────────────────
function ItineraryRow({ band, dayId, onRemove, conflicted }) {
  const stage = STAGES[band.stage];
  return (
    <div style={{
      display: 'flex', gap: 12, padding: '14px 14px 14px 14px',
      background: '#0F0F0F',
      border: '1px solid',
      borderColor: conflicted ? '#FF2D55' : 'rgba(255,255,255,0.08)',
      borderRadius: 14, position: 'relative', overflow: 'hidden',
    }}>
      {/* Stage color strip */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: 4,
        background: stage.color,
      }} />

      {/* Time */}
      <div style={{
        paddingLeft: 8, minWidth: 50,
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 600,
        letterSpacing: '0.04em', color: 'rgba(255,255,255,0.85)',
      }}>
        <span>{fmtTime(band.start)}</span>
        <span style={{ opacity: 0.4 }}>{fmtTime(band.end)}</span>
      </div>

      <div style={{ width: 1, background: 'rgba(255,255,255,0.08)' }} />

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{
          fontFamily: 'var(--display)', fontWeight: 700, fontSize: 18,
          lineHeight: 1.05, letterSpacing: '-0.01em',
          color: conflicted ? '#FF6680' : '#fff',
          wordBreak: 'break-word',
        }}>{band.name}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <StagePill stage={band.stage} mono />
          <span style={{
            fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.06em',
            color: 'rgba(255,255,255,0.4)', fontWeight: 500,
          }}>{fmtDuration(band.end - band.start)}</span>
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
    </div>
  );
}

function EatingWindowRow({ minutes, nextBand }) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #14271A 0%, #0D1812 100%)',
      border: '1px solid rgba(124,224,160,0.28)',
      borderRadius: 14, padding: '16px 16px',
      display: 'flex', alignItems: 'center', gap: 14, position: 'relative', overflow: 'hidden',
    }}>
      {/* Diagonal stripes */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.06, pointerEvents: 'none',
        backgroundImage: 'repeating-linear-gradient(135deg, #7CE0A0 0 1px, transparent 1px 12px)',
      }} />
      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: '#7CE0A0', color: '#001a0d',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none',
      }}>
        <Icon name="tools-kitchen-2" size={22} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em',
          color: '#7CE0A0', fontWeight: 700,
        }}>EAT WINDOW</div>
        <div style={{
          fontFamily: 'var(--display)', fontSize: 22, fontWeight: 800,
          letterSpacing: '-0.02em', color: '#fff', lineHeight: 1.1, marginTop: 4,
        }}>{fmtDuration(minutes)} BEFORE {nextBand.name.split(' ')[0]}</div>
      </div>
    </div>
  );
}

function RestRow({ minutes, kind }) {
  const isMove = kind === 'move';
  const isClash = kind === 'clash';
  const palette = isClash
    ? { bg: '#1A0810', icon: '#FF6680', border: 'rgba(255,102,128,0.3)', label: 'CLASH', sublabel: `${Math.abs(minutes)}m OVERLAP` }
    : isMove
    ? { bg: '#1F1408', icon: '#FFB76A', border: 'rgba(255,183,106,0.22)', label: 'MOVE', sublabel: fmtDuration(minutes).toUpperCase() }
    : { bg: '#0F0F0F', icon: 'rgba(255,255,255,0.6)', border: 'rgba(255,255,255,0.08)', label: 'REST', sublabel: fmtDuration(minutes).toUpperCase() };
  const iconName = isClash ? 'alert-triangle' : isMove ? 'run' : 'armchair';
  return (
    <div style={{
      background: palette.bg, border: `1px solid ${palette.border}`,
      borderRadius: 12, padding: '10px 14px',
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <div style={{
        width: 28, height: 28, borderRadius: 999,
        background: 'rgba(255,255,255,0.04)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none',
        color: palette.icon,
      }}>
        <Icon name={iconName} size={14} />
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span style={{
          fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700,
          letterSpacing: '0.14em', color: palette.icon,
        }}>{palette.label}</span>
        <span style={{
          fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 600,
          letterSpacing: '0.1em', color: 'rgba(255,255,255,0.45)',
        }}>{palette.sublabel}</span>
      </div>
    </div>
  );
}

function Itinerary({ selected, removeBand }) {
  // group by day
  const byDay = useMemo(() => {
    const g = { thu: [], fri: [], sat: [] };
    for (const s of selected) {
      const dayId = s.id.split('-')[0];
      g[dayId].push(s);
    }
    for (const k of Object.keys(g)) g[k].sort((a, b) => a.start - b.start);
    return g;
  }, [selected]);

  // total stats
  let totalShows = selected.length;
  let totalEat = 0;
  let totalClash = 0;
  const clashIds = new Set();
  // Clashes are only within the same day — acts on different days cannot clash
  // even if their absolute "minutes" values overlap modulo day.
  for (const k of Object.keys(byDay)) {
    const arr = byDay[k];
    for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        if (itemsClash(arr[i], arr[j])) {
          clashIds.add(arr[i].id);
          clashIds.add(arr[j].id);
          totalClash++;
        }
      }
    }
  }
  for (const k of Object.keys(byDay)) {
    const arr = byDay[k];
    for (let i = 0; i < arr.length - 1; i++) {
      const g = gapBetween(arr[i], arr[i + 1]);
      if (g >= 40) totalEat++;
    }
  }

  if (selected.length === 0) {
    return (
      <div style={{
        padding: '60px 24px 140px', display: 'flex', flexDirection: 'column',
        alignItems: 'center', textAlign: 'center', gap: 16,
      }}>
        <div style={{
          width: 96, height: 96, borderRadius: '50%',
          border: '2px dashed rgba(255,255,255,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'rgba(255,255,255,0.3)',
        }}>
          <Icon name="list-check" size={36} />
        </div>
        <div style={{
          fontFamily: 'var(--display)', fontSize: 28, fontWeight: 800,
          letterSpacing: '-0.02em', color: '#fff', marginTop: 8,
        }}>NO PLAN YET</div>
        <div style={{
          fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.1em',
          color: 'rgba(255,255,255,0.4)', maxWidth: 260, lineHeight: 1.55,
        }}>HOP BACK TO <strong style={{color:'#fff'}}>FIND</strong> AND TAP ANY ACT TO START BUILDING YOUR THREE DAYS.</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '4px 0 140px' }}>
      {/* Header stats */}
      <div style={{ padding: '8px 16px 16px' }}>
        <div style={{
          fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em',
          color: 'rgba(255,255,255,0.4)', fontWeight: 600,
        }}>YOUR THREE DAYS</div>
        <div style={{
          fontFamily: 'var(--display)', fontSize: 36, fontWeight: 800,
          letterSpacing: '-0.03em', lineHeight: 1, marginTop: 6,
        }}>THE PLAN</div>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8,
          marginTop: 16,
        }}>
          <StatTile label="SHOWS" value={totalShows} accent="#fff" />
          <StatTile label="EAT WINDOWS" value={totalEat} accent="#7CE0A0" />
          <StatTile label="CLASHES" value={totalClash} accent={totalClash > 0 ? '#FF6680' : '#fff'} dim={totalClash === 0} />
        </div>
      </div>

      {/* Days */}
      {DAYS.map(d => {
        const acts = byDay[d.id];
        if (!acts.length) return null;
        return (
          <div key={d.id} style={{ padding: '0 16px', marginTop: 8 }}>
            {/* Day header */}
            <div style={{
              display: 'flex', alignItems: 'baseline', gap: 10,
              padding: '24px 0 12px', position: 'sticky', top: 0,
              background: 'linear-gradient(to bottom, #0a0a0a 60%, rgba(10,10,10,0))',
              zIndex: 2,
            }}>
              <div style={{
                fontFamily: 'var(--display)', fontSize: 44, fontWeight: 800,
                letterSpacing: '-0.04em', lineHeight: 0.9,
              }}>{d.date}</div>
              <div style={{
                fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.18em',
                color: 'rgba(255,255,255,0.4)', fontWeight: 700,
                paddingBottom: 4,
              }}>{d.label} / {acts.length} ACT{acts.length>1?'S':''}</div>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)', alignSelf: 'center', marginLeft: 4 }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {acts.map((band, i) => {
                const next = acts[i + 1];
                const gap = next ? gapBetween(band, next) : null;
                return (
                  <React.Fragment key={band.id}>
                    <ItineraryRow
                      band={band}
                      dayId={d.id}
                      conflicted={clashIds.has(band.id)}
                      onRemove={() => removeBand(band.id)}
                    />
                    {gap !== null && gap >= 40 && (
                      <EatingWindowRow minutes={gap} nextBand={next} />
                    )}
                    {gap !== null && gap < 40 && gap >= 0 && (
                      <RestRow minutes={gap} kind={gap < 20 ? 'move' : 'rest'} />
                    )}
                    {gap !== null && gap < 0 && (
                      <RestRow minutes={gap} kind="clash" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function StatTile({ label, value, accent, dim }) {
  return (
    <div style={{
      background: '#0F0F0F', border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 12, padding: '12px 12px',
    }}>
      <div style={{
        fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.14em',
        color: 'rgba(255,255,255,0.4)', fontWeight: 700,
      }}>{label}</div>
      <div style={{
        fontFamily: 'var(--display)', fontSize: 30, fontWeight: 800,
        letterSpacing: '-0.03em', color: dim ? 'rgba(255,255,255,0.6)' : accent,
        marginTop: 4, lineHeight: 1,
      }}>{value}</div>
    </div>
  );
}

Object.assign(window, { ClashFinder, Itinerary, DayChip, StageLegend });
