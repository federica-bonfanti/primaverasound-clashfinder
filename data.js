// Primavera Clash Finder — final lineup (user's green-highlighted picks)

const STAGES = {
  estrella:    { name: 'Estrella Damm', short: 'ESTRELLA',  color: '#FF3D6E', ink: '#1a0008' },
  revolut:     { name: 'Revolut',       short: 'REVOLUT',   color: '#7B5CFF', ink: '#0a0420' },
  occident:    { name: 'Occident',      short: 'OCCIDENT',  color: '#FF8A3D', ink: '#1a0a00' },
  cupra:       { name: 'CUPRA',         short: 'CUPRA',     color: '#00E0A4', ink: '#001a12' },
  schwarzkopf: { name: 'Schwarzkopf',   short: 'SCHWARZ.',  color: '#FFD23F', ink: '#1a1400' },
  port:        { name: 'Port',          short: 'PORT',      color: '#3DC9FF', ink: '#001220' },
  plenitude:   { name: 'Plenitude',     short: 'PLENITUDE', color: '#FF5BD3', ink: '#1a0014' },
};

const t = (s) => {
  const [h, m] = s.split(':').map(Number);
  return h * 60 + m;
};

const LINEUP = {
  thu: [
    { id: 'thu-1',  name: 'BLOOD ORANGE',        stage: 'revolut',     start: t('18:20'),       end: t('19:20') },
    { id: 'thu-2',  name: 'GEESE',               stage: 'occident',    start: t('19:45'),       end: t('20:45') },
    { id: 'thu-3',  name: 'AGRICULTURE',         stage: 'port',        start: t('20:55'),       end: t('21:50') },
    { id: 'thu-4',  name: 'MASSIVE ATTACK',      stage: 'estrella',    start: t('22:05'),       end: t('23:20') },
    { id: 'thu-5',  name: 'MELT-BANANA',         stage: 'port',        start: t('01:30')+1440,  end: t('02:30')+1440 },
    { id: 'thu-6',  name: 'FCUKERS',             stage: 'schwarzkopf', start: t('02:40')+1440,  end: t('03:35')+1440 },
    { id: 'thu-7',  name: '¥ØU$UK€ ¥UK1MAT$U',   stage: 'cupra',       start: t('04:30')+1440,  end: t('06:00')+1440 },
  ],
  fri: [
    { id: 'fri-1',  name: 'SLOWDIVE',                stage: 'revolut',     start: t('18:35'),       end: t('19:30') },
    { id: 'fri-2',  name: 'TEXAS IS THE REASON',     stage: 'schwarzkopf', start: t('19:50'),       end: t('20:50') },
    { id: 'fri-3',  name: 'WATER FROM YOUR EYES',    stage: 'port',        start: t('21:00'),       end: t('21:50') },
    { id: 'fri-4',  name: 'THE CURE',                stage: 'estrella',    start: t('22:15'),       end: t('00:45')+1440 },
    { id: 'fri-5',  name: 'SAMA\u2019 ABDULHADI',    stage: 'plenitude',   start: t('02:30')+1440,  end: t('05:00')+1440 },
  ],
  sat: [
    { id: 'sat-1',  name: 'SUDAN ARCHIVES',          stage: 'occident',    start: t('19:00'),       end: t('19:45') },
    { id: 'sat-2',  name: 'LITTLE SIMZ',             stage: 'revolut',     start: t('20:50'),       end: t('21:50') },
    { id: 'sat-3',  name: 'MY BLOODY VALENTINE',     stage: 'estrella',    start: t('22:05'),       end: t('23:20') },
    { id: 'sat-4',  name: 'TOUCHÉ AMORÉ',            stage: 'schwarzkopf', start: t('22:15'),       end: t('23:15') },
    { id: 'sat-5',  name: 'LAMBRINI GIRLS',          stage: 'cupra',       start: t('23:10'),       end: t('00:05')+1440 },
    { id: 'sat-6',  name: 'THE XX',                  stage: 'revolut',     start: t('23:40'),       end: t('00:55')+1440 },
    { id: 'sat-7',  name: 'GORILLAZ',                stage: 'estrella',    start: t('01:15')+1440,  end: t('02:45')+1440 },
    { id: 'sat-8',  name: 'KNEECAP',                 stage: 'occident',    start: t('03:00')+1440,  end: t('04:15')+1440 },
    { id: 'sat-9',  name: 'PEGGY GOU',               stage: 'cupra',       start: t('04:15')+1440,  end: t('05:45')+1440 },
  ],
};

const DAYS = [
  { id: 'thu', label: 'THU', date: '04', dateLong: 'Jun 04' },
  { id: 'fri', label: 'FRI', date: '05', dateLong: 'Jun 05' },
  { id: 'sat', label: 'SAT', date: '06', dateLong: 'Jun 06' },
];

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

function classifyGap(mins) {
  if (mins < 0)  return { kind: 'clash', label: 'CLASH',   icon: 'alert-triangle' };
  if (mins < 20) return { kind: 'move',  label: 'MOVE',    icon: 'run' };
  if (mins < 40) return { kind: 'rest',  label: 'REST',    icon: 'armchair' };
  return                { kind: 'eat',   label: 'EAT',     icon: 'tools-kitchen-2' };
}

Object.assign(window, { STAGES, LINEUP, DAYS, fmtTime, fmtDuration, classifyGap });
