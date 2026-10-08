import { useEffect, useMemo, useState } from 'react'
import './App.css'
import progressRing from './assets/figma/progress-ring.svg'
import settingsIcon from './assets/figma/settings.svg'
import dropRays from './assets/figma/drop-rays.svg'
import drop from './assets/figma/drop.svg'
import divider from './assets/figma/divider.svg'
import progressBar from './assets/figma/progress-bar.svg'
import actionBg from './assets/figma/action-bg.svg'
import glass500 from './assets/figma/glass-500.svg'
import glass250 from './assets/figma/glass-250.svg'
import bottle750 from './assets/figma/bottle-750.svg'
import dots from './assets/figma/dots.svg'
import lineTop from './assets/figma/grid-solid.svg'
import lineMid from './assets/figma/grid-dash.svg'
import bar1 from './assets/figma/bar-1.svg'
import bar2 from './assets/figma/bar-2.svg'
import bar3 from './assets/figma/bar-3.svg'
import bar4 from './assets/figma/bar-4.svg'
import bar5 from './assets/figma/bar-5.svg'
import bar6 from './assets/figma/bar-6.svg'
import bar7 from './assets/figma/bar-7.svg'
import bannerDrop from './assets/figma/banner-drop.svg'
import chevron from './assets/figma/chevron.svg'
import navBg from './assets/figma/nav-bg.svg'
import navWater from './assets/figma/nav-water.svg'
import navStats from './assets/figma/nav-stats.svg'
import navTrophy from './assets/figma/nav-trophy.svg'
import navProfile from './assets/figma/nav-profile.svg'
import bottle from './assets/figma/bottle.svg'
import spark from './assets/figma/spark.svg'
import statusIcons from './assets/figma/status-icons.svg'
import minusCircle from './assets/figma/minus-circle.svg'
import minusLine from './assets/figma/minus-line.svg'

type Tab = 'water' | 'stats' | 'awards' | 'profile'
type Period = 'day' | 'week' | 'month'
type Sheet = 'custom' | 'goal' | null

const STORAGE_KEY = 'water-tracker'

const DAY_BARS = [
  { src: bar1, width: 15.7162, height: 28, left: 49, top: 123, label: '8:00', labelLeft: 47 },
  { src: bar2, width: 16, height: 18, left: 91.5, top: 133.5, label: '10:00', labelLeft: 86 },
  { src: bar3, width: 16, height: 28, left: 133.5, top: 123.5, label: '12:00', labelLeft: 129 },
  { src: bar4, width: 16, height: 40, left: 175.5, top: 111.5, label: '14:00', labelLeft: 171 },
  { src: bar5, width: 15, height: 25, left: 218.5, top: 126.5, label: '16:00', labelLeft: 213 },
  { src: bar6, width: 15.7162, height: 18, left: 260.3, top: 133, label: '18:00', labelLeft: 255 },
  { src: bar7, width: 16, height: 9, left: 302.5, top: 142.5, label: '20:00', labelLeft: 298 },
]

const WEEK = [
  { label: 'Пн', ml: 1200 },
  { label: 'Вт', ml: 800 },
  { label: 'Ср', ml: 1600 },
  { label: 'Чт', ml: 2000 },
  { label: 'Пт', ml: 900 },
  { label: 'Сб', ml: 1400 },
  { label: 'Вс', ml: 600 },
]

const MONTH = [
  { label: '1', ml: 1400 },
  { label: '2', ml: 1800 },
  { label: '3', ml: 1100 },
  { label: '4', ml: 2000 },
  { label: '5', ml: 900 },
  { label: '6', ml: 1500 },
  { label: '7', ml: 700 },
]

const TABS: { id: Tab; label: string; icon: string; width: number; height: number }[] = [
  { id: 'water', label: 'Вода', icon: navWater, width: 16, height: 26 },
  { id: 'stats', label: 'Статистика', icon: navStats, width: 17.8594, height: 26 },
  { id: 'awards', label: 'Достижения', icon: navTrophy, width: 26, height: 26 },
  { id: 'profile', label: 'Профиль', icon: navProfile, width: 22, height: 26 },
]

function grouped(value: number) {
  return Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

function loadTracker() {
  const fallback = { intake: 1000, goal: 2000, log: [] as number[] }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return fallback
    const data = JSON.parse(raw) as { intake?: number; goal?: number; log?: number[] }
    const goal = Number(data.goal)
    const intake = Number(data.intake)
    if (!Number.isFinite(goal) || goal < 250) return fallback
    if (!Number.isFinite(intake) || intake < 0) return { ...fallback, goal }
    const log = Array.isArray(data.log) ? data.log.filter((item) => Number(item) > 0) : []
    return { intake, goal, log }
  } catch {
    return fallback
  }
}

function praiseFor(ratio: number) {
  if (ratio >= 1) return { title: 'Готово!', text: 'Дневная цель выполнена' }
  if (ratio >= 0.5) return { title: 'Отлично!', text: 'Вы на пути к цели!' }
  if (ratio > 0) return { title: 'Так держать', text: 'Каждый глоток на счету' }
  return { title: 'Начнём', text: 'Добавьте первый стакан' }
}

function useFitScale() {
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const fit = () => {
      const next = Math.min(1, (window.innerWidth - 24) / 440, (window.innerHeight - 24) / 956)
      setScale(Number.isFinite(next) && next > 0 ? next : 1)
    }
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])

  return scale
}

function StatusBar() {
  return (
    <div className="status">
      <p className="time">9:41</p>
      <img src={statusIcons} width={40.5} height={11.5} alt="" />
    </div>
  )
}

function Ring({ ratio }: { ratio: number }) {
  const designed = Math.abs(ratio - 0.5) < 0.001
  const radius = 112
  const length = 2 * Math.PI * radius
  const dash = length * Math.max(0, Math.min(1, ratio))

  return (
    <div className="ring" aria-hidden="true">
      {designed ? (
        <img className="ring-art" src={progressRing} width={242} height={242} alt="" />
      ) : (
        <svg className="ring-live" width={242} height={242} viewBox="0 0 242 242">
          <circle cx="121" cy="121" r={radius} fill="none" stroke="#E3F1FB" strokeWidth="18" />
          <circle
            cx="121"
            cy="121"
            r={radius}
            fill="none"
            stroke="url(#liveRing)"
            strokeWidth="18"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${length}`}
            transform="rotate(-90 121 121)"
          />
          <defs>
            <linearGradient id="liveRing" x1="9" y1="233" x2="233" y2="9">
              <stop stopColor="#128CF5" />
              <stop offset="0.55" stopColor="#42C5FF" />
              <stop offset="1" stopColor="#087DE2" />
            </linearGradient>
          </defs>
        </svg>
      )}
      <img className="bottle" src={bottle} width={96.9263} height={154} alt="" />
    </div>
  )
}

function MiniBar({ ratio }: { ratio: number }) {
  if (Math.abs(ratio - 0.5) < 0.001) {
    return <img className="stats-bar" src={progressBar} width={101} height={8} alt="" />
  }
  return (
    <span className="mini-track stats-bar">
      <span className="mini-fill" style={{ width: `${Math.max(0, Math.min(100, ratio * 100))}%` }} />
    </span>
  )
}

function Chart({ period, goal, onPeriod }: { period: Period; goal: number; onPeriod: (period: Period) => void }) {
  const series = period === 'week' ? WEEK : MONTH
  return (
    <section className="chart" aria-label="Динамика потребления">
      <div className="chart-canvas">
        <h2 className="chart-title">Динамика потребления</h2>
        <button
          type="button"
          className={period === 'day' ? 'period period-day active' : 'period period-day'}
          aria-pressed={period === 'day'}
          onClick={() => onPeriod('day')}
        >
          День
        </button>
        <button
          type="button"
          className={period === 'week' ? 'period period-week active' : 'period period-week'}
          aria-pressed={period === 'week'}
          onClick={() => onPeriod('week')}
        >
          Неделя
        </button>
        <button
          type="button"
          className={period === 'month' ? 'period period-month active' : 'period period-month'}
          aria-pressed={period === 'month'}
          onClick={() => onPeriod('month')}
        >
          Месяц
        </button>
        <p className="goal-pill">Цель: {grouped(goal)} мл</p>
        <p className="y-label y-2000">2 000</p>
        <p className="y-label y-1000">1 000</p>
        <p className="y-label y-0">0</p>
        <img className="hline hline-top" src={lineTop} width={311.378} height={1} alt="" />
        <img className="hline hline-mid" src={lineMid} width={311.378} height={1} alt="" />
        <img className="hline hline-bot" src={lineMid} width={311.378} height={1} alt="" />
        {period === 'day'
          ? DAY_BARS.map((bar) => (
              <span key={bar.label}>
                <img
                  className="bar"
                  src={bar.src}
                  width={bar.width}
                  height={bar.height}
                  alt=""
                  style={{ left: bar.left, top: bar.top }}
                />
                <p className="x-label" style={{ left: bar.labelLeft, width: 26 }}>
                  {bar.label}
                </p>
              </span>
            ))
          : series.map((item, index) => {
              const height = Math.max(6, Math.round((item.ml / 2000) * 100))
              const left = 49 + index * 42
              return (
                <span key={item.label}>
                  <span className="live-bar" style={{ left, top: 151 - height, height }} />
                  <p className="x-label" style={{ left: left - 6, width: 28 }}>
                    {item.label}
                  </p>
                </span>
              )
            })}
      </div>
    </section>
  )
}

function WaterScreen({
  intake,
  goal,
  period,
  onPeriod,
  onAdd,
  onUndo,
  onCustom,
}: {
  intake: number
  goal: number
  period: Period
  onPeriod: (period: Period) => void
  onAdd: (amount: number) => void
  onUndo: () => void
  onCustom: () => void
}) {
  const ratio = goal > 0 ? intake / goal : 0
  const praise = praiseFor(ratio)
  const remaining = Math.max(0, goal - intake)
  const percent = Math.min(100, Math.round(ratio * 100))
  const actions = [
    { amount: 250, icon: glass250, width: 22.3333, height: 32.9998, label: '+ 250 мл' },
    { amount: 500, icon: glass500, width: 22.3333, height: 32.9998, label: '+ 500 мл' },
    { amount: 750, icon: bottle750, width: 19.8804, height: 32.51, label: '+ 750 мл' },
  ]

  return (
    <>
      <h1 className="title">Вода</h1>
      <p className="subtitle">Забота о себе каждый день</p>
      <Ring ratio={ratio} />
      <p className="total">
        <span className="total-now">{grouped(intake)} / </span>
        <span className="total-goal">{grouped(goal)} мл</span>
      </p>
      <article className="praise">
        <img className="spark" src={spark} width={42.5006} height={17.5003} alt="" />
        <img src={dropRays} width={20} height={32} alt="" />
        <p className="praise-title">{praise.title}</p>
        <p className="praise-sub">{praise.text}</p>
      </article>
      <article className="stats">
        <div className="stats-grid">
          <img className="stats-drop" src={drop} width={20} height={33} alt="" />
          <p className="stats-label">Осталось</p>
          <p className="stats-left">{remaining} мл</p>
          <img className="stats-divider" src={divider} width={68} height={1} alt="" />
          <p className="stats-pct">{percent} %</p>
          <p className="stats-done">выполнено</p>
          <MiniBar ratio={ratio} />
        </div>
      </article>
      <button
        type="button"
        className="undo"
        aria-label="Убавить последний объём"
        disabled={intake <= 0}
        onClick={onUndo}
      >
        <img src={minusCircle} width={41} height={41} alt="" />
        <img className="undo-line" src={minusLine} width={12} height={2} alt="" />
      </button>
      <div className="actions">
        {actions.map((action) => (
          <button key={action.amount} type="button" className="action" onClick={() => onAdd(action.amount)}>
            <img src={actionBg} width={82} height={82} alt="" />
            <span className="action-face">
              <img src={action.icon} width={action.width} height={action.height} alt="" />
              <span>{action.label}</span>
            </span>
          </button>
        ))}
        <button type="button" className="action" onClick={onCustom}>
          <img src={actionBg} width={82} height={82} alt="" />
          <span className="action-face action-dots">
            <img src={dots} width={16} height={4} alt="" />
            <span>Другое</span>
          </span>
        </button>
      </div>
      <Chart period={period} goal={goal} onPeriod={onPeriod} />
      <button type="button" className="banner">
        <span className="banner-inner">
          <img className="banner-drop" src={bannerDrop} width={15.0001} height={23.5} alt="" />
          <span className="banner-text">Пейте воду — сохраняйте энергию!</span>
          <img className="banner-chevron" src={chevron} width={10.3732} height={17.435} alt="" />
        </span>
      </button>
    </>
  )
}

function ExtraPages({
  tab,
  intake,
  goal,
  onGoal,
}: {
  tab: Exclude<Tab, 'water'>
  intake: number
  goal: number
  onGoal: (goal: number) => void
}) {
  const [draft, setDraft] = useState(String(goal))
  const awards = [
    { title: 'Первый глоток', done: intake > 0 },
    { title: 'Половина пути', done: intake >= goal / 2 },
    { title: 'Дневная цель', done: intake >= goal },
  ]

  return (
    <div className="page">
      {tab === 'stats' && (
        <article className="page-card">
          <h2>Сегодня</h2>
          <p className="big">{grouped(intake)} мл</p>
          <p>из {grouped(goal)} мл дневной нормы</p>
        </article>
      )}
      {tab === 'awards' &&
        awards.map((award) => (
          <article key={award.title} className="page-card award">
            <img src={award.done ? dropRays : drop} width={20} height={award.done ? 32 : 33} alt="" />
            <div>
              <strong>{award.title}</strong>
              <em>{award.done ? 'Получено' : 'Ещё впереди'}</em>
            </div>
          </article>
        ))}
      {tab === 'profile' && (
        <article className="page-card">
          <h2>Дневная цель</h2>
          <p>Сколько миллилитров вы хотите выпивать за день.</p>
          <label className="field">
            Миллилитры
            <input
              inputMode="numeric"
              value={draft}
              onChange={(event) => setDraft(event.target.value.replace(/[^\d]/g, ''))}
            />
          </label>
          <button
            type="button"
            className="primary"
            onClick={() => {
              const next = Number(draft)
              if (next >= 250) onGoal(next)
            }}
          >
            Сохранить
          </button>
        </article>
      )}
    </div>
  )
}

function App() {
  const scale = useFitScale()
  const initial = useMemo(loadTracker, [])
  const [intake, setIntake] = useState(initial.intake)
  const [goal, setGoal] = useState(initial.goal)
  const [log, setLog] = useState<number[]>(initial.log)
  const [tab, setTab] = useState<Tab>('water')
  const [period, setPeriod] = useState<Period>('day')
  const [sheet, setSheet] = useState<Sheet>(null)
  const [custom, setCustom] = useState('300')
  const [goalDraft, setGoalDraft] = useState(String(initial.goal))

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ intake, goal, log }))
  }, [intake, goal, log])

  const addWater = (amount: number) => {
    if (amount <= 0) return
    setIntake((current) => current + amount)
    setLog((items) => [...items, amount])
  }

  const undoWater = () => {
    const last = log.at(-1) ?? 250
    setIntake((current) => Math.max(0, current - last))
    if (log.length > 0) setLog((items) => items.slice(0, -1))
  }

  return (
    <div className="stage">
      <div className="scaler" style={{ width: 440 * scale, height: 956 * scale }}>
        <div className="phone" style={{ transform: `scale(${scale})` }}>
          <StatusBar />
          {tab === 'water' ? (
            <>
              <button type="button" className="settings" aria-label="Настройки" onClick={() => {
                setGoalDraft(String(goal))
                setSheet('goal')
              }}>
                <img src={settingsIcon} width={26} height={26} alt="" />
              </button>
              <WaterScreen
                intake={intake}
                goal={goal}
                period={period}
                onPeriod={setPeriod}
                onAdd={addWater}
                onUndo={undoWater}
                onCustom={() => setSheet('custom')}
              />
            </>
          ) : (
            <>
              <h1 className="title">
                {tab === 'stats' ? 'Статистика' : tab === 'awards' ? 'Награды' : 'Профиль'}
              </h1>
              <ExtraPages tab={tab} intake={intake} goal={goal} onGoal={setGoal} />
            </>
          )}
          <nav className="nav" aria-label="Разделы">
            <img className="nav-shape" src={navBg} width={441} height={90} alt="" />
            <div className="nav-items">
              {TABS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={tab === item.id ? `nav-btn nav-${item.id} active` : `nav-btn nav-${item.id}`}
                  aria-current={tab === item.id ? 'page' : undefined}
                  onClick={() => setTab(item.id)}
                >
                  <span className={item.id === 'water' ? 'nav-icon water' : 'nav-icon'}>
                    <img src={item.icon} width={item.width} height={item.height} alt="" />
                  </span>
                  {item.label}
                </button>
              ))}
            </div>
            <span className="home-indicator" />
          </nav>
          {sheet && (
            <div className="sheet-backdrop" onClick={() => setSheet(null)}>
              <form
                className="sheet"
                onClick={(event) => event.stopPropagation()}
                onSubmit={(event) => {
                  event.preventDefault()
                  if (sheet === 'custom') {
                    addWater(Number(custom))
                  } else {
                    const next = Number(goalDraft)
                    if (next >= 250) setGoal(next)
                  }
                  setSheet(null)
                }}
              >
                <h2>{sheet === 'custom' ? 'Другой объём' : 'Дневная цель'}</h2>
                <label className="field">
                  Миллилитры
                  <input
                    autoFocus
                    inputMode="numeric"
                    value={sheet === 'custom' ? custom : goalDraft}
                    onChange={(event) => {
                      const value = event.target.value.replace(/[^\d]/g, '')
                      if (sheet === 'custom') setCustom(value)
                      else setGoalDraft(value)
                    }}
                  />
                </label>
                <div className="sheet-actions">
                  <button type="button" className="ghost" onClick={() => setSheet(null)}>
                    Отмена
                  </button>
                  <button type="submit" className="primary">
                    {sheet === 'custom' ? 'Добавить' : 'Сохранить'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
