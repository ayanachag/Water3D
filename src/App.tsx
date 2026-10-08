import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { Art, Bottle, Bottle750, Glass250, Glass500 } from './water-art'
import progressRing from './assets/figma/progress-ring.svg?raw'
import settingsIcon from './assets/figma/settings.svg'
import dropRays from './assets/figma/drop-rays.svg?raw'
import drop from './assets/figma/drop.svg?raw'
import divider from './assets/figma/divider.svg'
import progressBar from './assets/figma/progress-bar.svg?raw'
import actionBg from './assets/figma/action-bg.svg'
import dots from './assets/figma/dots.svg'
import lineTop from './assets/figma/grid-solid.svg'
import lineMid from './assets/figma/grid-dash.svg'
import bannerDrop from './assets/figma/banner-drop.svg?raw'
import chevron from './assets/figma/chevron.svg'
import navBg from './assets/figma/nav-bg.svg'
import navWater from './assets/figma/nav-water.svg?raw'
import navStats from './assets/figma/nav-stats.svg'
import navTrophy from './assets/figma/nav-trophy.svg'
import navProfile from './assets/figma/nav-profile.svg'
import spark from './assets/figma/spark.svg?raw'
import statusIcons from './assets/figma/status-icons.svg'
import minusCircle from './assets/figma/minus-circle.svg'
import minusLine from './assets/figma/minus-line.svg'

type Tab = 'water' | 'stats' | 'awards' | 'profile'
type Period = 'day' | 'week' | 'month'
type Sheet = 'custom' | 'goal' | null

const STORAGE_KEY = 'water-tracker'

const DAY = [
  { label: '8:00', ml: 560 },
  { label: '10:00', ml: 360 },
  { label: '12:00', ml: 560 },
  { label: '14:00', ml: 800 },
  { label: '16:00', ml: 500 },
  { label: '18:00', ml: 360 },
  { label: '20:00', ml: 180 },
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
  if (ratio >= 1) return { title: 'Готово!', text: '' }
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

function Ring({ ratio, splash }: { ratio: number; splash: number }) {
  const designed = Math.abs(ratio - 0.5) < 0.001
  const radius = 112
  const length = 2 * Math.PI * radius
  const dash = length * Math.max(0, Math.min(1, ratio))

  return (
    <div className="ring" aria-hidden="true">
      {designed ? (
        <Art markup={progressRing} className="ring-art" />
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
            <linearGradient id="liveRing" x1="9" y1="233" x2="233" y2="9" gradientUnits="userSpaceOnUse">
              <stop stopColor="#128CF5" />
              <stop offset="0.55" stopColor="#42C5FF" />
              <stop offset="1" stopColor="#087DE2" />
              <animateTransform
                attributeName="gradientTransform"
                type="rotate"
                from="0 121 121"
                to="360 121 121"
                dur="9s"
                repeatCount="indefinite"
              />
            </linearGradient>
          </defs>
        </svg>
      )}
      <Bottle ratio={ratio} splash={splash} />
    </div>
  )
}

function MiniBar({ ratio }: { ratio: number }) {
  if (Math.abs(ratio - 0.5) < 0.001) {
    return <Art markup={progressBar} className="stats-bar" />
  }
  return (
    <span className="mini-track stats-bar">
      <span className="mini-fill" style={{ width: `${Math.max(0, Math.min(100, ratio * 100))}%` }} />
    </span>
  )
}

function Chart({ period, goal, onPeriod }: { period: Period; goal: number; onPeriod: (period: Period) => void }) {
  const series = period === 'day' ? DAY : period === 'week' ? WEEK : MONTH
  const scale = Math.max(goal, 1)
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
        <p className="y-label y-2000">{grouped(scale)}</p>
        <p className="y-label y-1000">{grouped(scale / 2)}</p>
        <p className="y-label y-0">0</p>
        <img className="hline hline-top" src={lineTop} width={311.378} height={1} alt="" />
        <img className="hline hline-mid" src={lineMid} width={311.378} height={1} alt="" />
        <img className="hline hline-bot" src={lineMid} width={311.378} height={1} alt="" />
        {series.map((item, index) => {
          const height = Math.max(6, Math.round((Math.min(item.ml, scale) / scale) * 100))
          const left = 49 + index * 42
          return (
            <span key={item.label}>
              <span className="live-bar" style={{ left, top: 151 - height, height }} />
              <p className="x-label" style={{ left: left - 10, width: 36 }}>
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
  cheer,
  onPeriod,
  onAdd,
  onUndo,
  onCustom,
}: {
  intake: number
  goal: number
  period: Period
  cheer: number
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
    { amount: 250, icon: <Glass250 />, label: '+ 250 мл' },
    { amount: 500, icon: <Glass500 />, label: '+ 500 мл' },
    { amount: 750, icon: <Bottle750 />, label: '+ 750 мл' },
  ]

  return (
    <>
      <h1 className="title">Вода</h1>
      <p className="subtitle">Забота о себе каждый день</p>
      <Ring ratio={ratio} splash={cheer} />
      <p className="total">
        <span className="total-now">{grouped(intake)} / </span>
        <span className="total-goal">{grouped(goal)} мл</span>
      </p>
      <article key={cheer} className={cheer > 0 ? 'praise shake' : 'praise'}>
        <Art markup={spark} className="spark" />
        <Art markup={dropRays} />
        <p className="praise-title">{praise.title}</p>
        {praise.text ? <p className="praise-sub">{praise.text}</p> : null}
      </article>
      <article className="stats">
        <div className="stats-grid">
          <Art markup={drop} className="stats-drop" />
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
              {action.icon}
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
          <Art markup={bannerDrop} className="banner-drop" />
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
            <Art markup={award.done ? dropRays : drop} />
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
  const [cheer, setCheer] = useState(0)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ intake, goal, log }))
  }, [intake, goal, log])

  const addWater = (amount: number) => {
    if (amount <= 0) return
    setIntake((current) => current + amount)
    setLog((items) => [...items, amount])
    setCheer((count) => count + 1)
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
                cheer={cheer}
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
                    {item.id === 'water' ? (
                      <Art markup={item.icon} />
                    ) : (
                      <img src={item.icon} width={item.width} height={item.height} alt="" />
                    )}
                  </span>
                  {item.label}
                </button>
              ))}
            </div>
            <span className="home-indicator" />
          </nav>
          {sheet && (
            <div
              className={sheet === 'custom' ? 'sheet-backdrop center' : 'sheet-backdrop'}
              onClick={() => setSheet(null)}
            >
              <form
                className={sheet === 'custom' ? 'sheet dialog' : 'sheet'}
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
