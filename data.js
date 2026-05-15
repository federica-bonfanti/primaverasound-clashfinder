// Primavera Clash Finder — lineup data
// Times in minutes-from-midnight for easy math (some carry past midnight)

const STAGES = {
  estrella:    { name: 'Estrella Damm', short: 'ESTRELLA',  color: '#FF3D6E', ink: '#1a0008' },
  revolut:     { name: 'Revolut',       short: 'REVOLUT',   color: '#7B5CFF', ink: '#0a0420' },
  cupra:       { name: 'Cupra',         short: 'CUPRA',     color: '#00E0A4', ink: '#001a12' },
  schwarzkopf: { name: 'Schwarzkopf',   short: 'SCHWARZ.',  color: '#FFD23F', ink: '#1a1400' },
  amazon:      { name: 'Amazon Music',  short: 'AMAZON',    color: '#3DC9FF', ink: '#001220' },
  trainline:   { name: 'Trainline',     short: 'TRAINLINE', color: '#FF8A3D', ink: '#1a0a00' },
};

// helper: 'HH:MM' → minutes
const t = (s) => {
  const [h, m] = s.split(':').map(Number);
  return h * 60 + m;
};

const LINEUP = {
  thu: [
    { id: 'thu-1',  name: 'MASSIVE ATTACK',  stage: 'estrella',    start: t('22:55'),         end: t('00:10')+1440 },
    { id: 'thu-2',  name: 'MELT-BANANA',     stage: 'schwarzkopf', start: t('00:20')+1440,    end: t('01:20')+1440 },
    { id: 'thu-3',  name: 'GEESE',           stage: 'amazon',      start: t('00:30')+1440,    end: t('01:40')+1440 },
    { id: 'thu-4',  name: 'AGRICULTURE',     stage: 'trainline',   start: t('01:30')+1440,    end: t('02:30')+1440 },
    { id: 'thu-5',  name: 'BLOOD ORANGE',    stage: 'cupra',       start: t('01:50')+1440,    end: t('02:55')+1440 },
  ],
  fri: [
    { id: 'fri-1',  name: 'WATER FROM YOUR EYES', stage: 'cupra',       start: t('18:50'),       end: t('19:45') },
    { id: 'fri-2',  name: 'ETHEL CAIN',           stage: 'cupra',       start: t('20:55'),       end: t('21:55') },
    { id: 'fri-3',  name: 'TEXAS IS THE REASON',  stage: 'schwarzkopf', start: t('22:00'),       end: t('23:00') },
    { id: 'fri-4',  name: 'THE CURE',             stage: 'revolut',     start: t('23:15'),       end: t('01:30')+1440 },
    { id: 'fri-5',  name: 'ROLE MODEL',           stage: 'amazon',      start: t('00:30')+1440,  end: t('01:30')+1440 },
  ],
  sat: [
    { id: 'sat-1',  name: 'LAMBRINI GIRLS',       stage: 'cupra',       start: t('18:55'),       end: t('19:50') },
    { id: 'sat-2',  name: 'LITTLE SIMZ',          stage: 'revolut',     start: t('20:30'),       end: t('21:30') },
    { id: 'sat-3',  name: 'MY BLOODY VALENTINE',  stage: 'estrella',    start: t('21:35'),       end: t('22:50') },
    { id: 'sat-4',  name: 'THE XX',               stage: 'revolut',     start: t('22:55'),       end: t('00:10')+1440 },
    { id: 'sat-5',  name: 'TOUCHÉ AMORÉ',         stage: 'schwarzkopf', start: t('23:40'),       end: t('00:50')+1440 },
    { id: 'sat-6',  name: 'GORILLAZ',             stage: 'estrella',    start: t('00:20')+1440,  end: t('01:50')+1440 },
    { id: 'sat-7',  name: 'KNOCKED LOOSE',        stage: 'cupra',       start: t('01:55')+1440,  end: t('03:00')+1440 },
    { id: 'sat-8',  name: 'PEGGY GOU',            stage: 'revolut',     start: t('02:00')+1440,  end: t('03:00')+1440 },
    { id: 'sat-9',  name: 'DEPRESSION SONORA',    stage: 'schwarzkopf', start: t('02:00')+1440,  end: t('03:00')+1440 },
    { id: 'sat-10', name: 'KNEECAP',              stage: 'amazon',      start: t('03:05')+1440,  end: t('04:25')+1440 },
  ],
};

const DAYS = [
  { id: 'thu', label: 'THU', date: '04', dateLong: 'Jun 04' },
  { id: 'fri', label: 'FRI', date: '05', dateLong: 'Jun 05' },
  { id: 'sat', label: 'SAT', date: '06', dateLong: 'Jun 06' },
];

// minutes → "HH:MM" (rolls past midnight visually)
function fmtTime(mins) {
  const m = ((mins % 1440) + 1440) % 1440;
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return `${String(h).padStart(2,'0')}:${String(mm).padStart(2,'0')}`;
}

function fmtDuration(mins) {
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

// classify a gap (positive minutes) → eat/rest/move
function classifyGap(mins) {
  if (mins < 0)  return { kind: 'clash', label: 'CLASH',   icon: 'alert-triangle' };
  if (mins < 20) return { kind: 'move',  label: 'MOVE',    icon: 'run' };
  if (mins < 40) return { kind: 'rest',  label: 'REST',    icon: 'armchair' };
  return                { kind: 'eat',   label: 'EAT',     icon: 'tools-kitchen-2' };
}

Object.assign(window, { STAGES, LINEUP, DAYS, fmtTime, fmtDuration, classifyGap });
