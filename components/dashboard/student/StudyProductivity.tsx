"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Timer, Brain, CheckSquare, Square, Plus, Trash2,
  Play, Pause, RotateCcw, Coffee, Zap, Flame,
  TrendingUp, Target, BookOpen, Music, Volume2, VolumeX,
  ChevronDown, ChevronUp, Star, Award
} from "lucide-react";
import styles from "@/styles/StudyProductivity.module.css";

// ─── Types ───────────────────────────────────────────────────────────────────
type TimerMode = "focus" | "shortBreak" | "longBreak";

interface Task {
  id: string;
  text: string;
  done: boolean;
  priority: "high" | "medium" | "low";
  course: string;
}

interface SessionLog {
  id: string;
  type: "focus" | "break";
  duration: number; // minutes
  time: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────
const TIMER_CONFIGS: Record<TimerMode, { label: string; minutes: number; color: string }> = {
  focus:      { label: "Focus",       minutes: 25, color: "var(--color-primary)" },
  shortBreak: { label: "Short Break", minutes: 5,  color: "var(--color-success)" },
  longBreak:  { label: "Long Break",  minutes: 15, color: "var(--color-secondary)" },
};

const PRIORITY_CONFIG = {
  high:   { label: "High",   color: "#EF4444", bg: "rgba(239,68,68,0.08)" },
  medium: { label: "Med",    color: "#F59E0B", bg: "rgba(245,158,11,0.08)" },
  low:    { label: "Low",    color: "#6366F1", bg: "rgba(99,102,241,0.08)" },
};

const SUBJECTS = ["Data Science", "Machine Learning", "Frontend", "Database", "General"];

const AMBIENT_SOUNDS = [
  { id: "rain",      label: "Rain",        emoji: "🌧️" },
  { id: "forest",   label: "Forest",      emoji: "🌿" },
  { id: "cafe",     label: "Café",        emoji: "☕" },
  { id: "ocean",    label: "Ocean",       emoji: "🌊" },
  { id: "fireplace",label: "Fireplace",   emoji: "🔥" },
];

const STUB_LOGS: SessionLog[] = [
  { id: "1", type: "focus",  duration: 25, time: "07:10 AM" },
  { id: "2", type: "break",  duration: 5,  time: "07:35 AM" },
  { id: "3", type: "focus",  duration: 25, time: "07:40 AM" },
];

const STUB_TASKS: Task[] = [
  { id: "t1", text: "Review Neural Networks lecture notes",     done: false, priority: "high",   course: "Machine Learning" },
  { id: "t2", text: "Complete SQL assignment — Chapter 5",     done: false, priority: "high",   course: "Database" },
  { id: "t3", text: "Read React Server Components docs",       done: true,  priority: "medium", course: "Frontend" },
  { id: "t4", text: "Practice regression problems x10",        done: false, priority: "medium", course: "Data Science" },
  { id: "t5", text: "Watch GSAP animation crash course",       done: false, priority: "low",    course: "Frontend" },
];

const WEEKLY_FOCUS = [60, 90, 45, 120, 75, 110, 95]; // minutes per day Sun-Sat
const DAY_LABELS    = ["S", "M", "T", "W", "T", "F", "S"];

// ─── Utility ─────────────────────────────────────────────────────────────────
function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

// ─────────────────────────────────────────────────────────────────────────────
export default function StudyProductivity() {
  // Timer state
  const [mode, setMode]               = useState<TimerMode>("focus");
  const [running, setRunning]         = useState(false);
  const [seconds, setSeconds]         = useState(TIMER_CONFIGS.focus.minutes * 60);
  const [sessions, setSessions]       = useState(0);
  const [logs, setLogs]               = useState<SessionLog[]>(STUB_LOGS);

  // Task state
  const [tasks, setTasks]             = useState<Task[]>(STUB_TASKS);
  const [newTask, setNewTask]         = useState("");
  const [newPriority, setNewPriority] = useState<Task["priority"]>("medium");
  const [newCourse, setNewCourse]     = useState("General");
  const [showAddTask, setShowAddTask] = useState(false);
  const [filterDone, setFilterDone]   = useState<"all" | "todo" | "done">("all");

  // Ambient
  const [sound, setSound]             = useState<string | null>(null);
  const [muted, setMuted]             = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const totalSeconds = TIMER_CONFIGS[mode].minutes * 60;
  const progress     = ((totalSeconds - seconds) / totalSeconds) * 100;

  // ── Timer tick ──
  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            setRunning(false);
            handleSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, mode]);

  const handleSessionComplete = useCallback(() => {
    const now = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    const logEntry: SessionLog = {
      id: Date.now().toString(),
      type: mode === "focus" ? "focus" : "break",
      duration: TIMER_CONFIGS[mode].minutes,
      time: now,
    };
    setLogs((prev) => [logEntry, ...prev].slice(0, 10));
    if (mode === "focus") setSessions((p) => p + 1);
  }, [mode]);

  const switchMode = (m: TimerMode) => {
    setMode(m);
    setRunning(false);
    setSeconds(TIMER_CONFIGS[m].minutes * 60);
  };

  const resetTimer = () => {
    setRunning(false);
    setSeconds(TIMER_CONFIGS[mode].minutes * 60);
  };

  // ── Tasks ──
  const addTask = () => {
    if (!newTask.trim()) return;
    const t: Task = {
      id: Date.now().toString(),
      text: newTask.trim(),
      done: false,
      priority: newPriority,
      course: newCourse,
    };
    setTasks((prev) => [t, ...prev]);
    setNewTask("");
    setShowAddTask(false);
  };

  const toggleTask = (id: string) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const deleteTask = (id: string) =>
    setTasks((prev) => prev.filter((t) => t.id !== id));

  const filteredTasks = tasks.filter((t) => {
    if (filterDone === "todo") return !t.done;
    if (filterDone === "done") return t.done;
    return true;
  });

  const completedCount = tasks.filter((t) => t.done).length;
  const totalFocusMin  = logs.filter((l) => l.type === "focus").reduce((s, l) => s + l.duration, 0);
  const maxWeekly      = Math.max(...WEEKLY_FOCUS);
  const today          = new Date().getDay();

  // ── SVG ring ──
  const RADIUS = 72;
  const CIRC   = 2 * Math.PI * RADIUS;
  const dashOffset = CIRC - (progress / 100) * CIRC;
  const modeColor  = TIMER_CONFIGS[mode].color;

  return (
    <div className={styles.page}>

      {/* ── Page Header ── */}
      <div className={styles.pageHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.headerIcon}>
            <Brain size={22} color="var(--color-primary)" />
          </div>
          <div>
            <h1 className={styles.pageTitle}>Study Productivity</h1>
            <p className={styles.pageSubtitle}>Deep focus mode — track sessions, manage tasks, stay in flow.</p>
          </div>
        </div>
        <div className={styles.headerStats}>
          <div className={styles.miniStat}>
            <Flame size={16} color="#F59E0B" />
            <span><strong>14</strong> day streak</span>
          </div>
          <div className={styles.miniStat}>
            <Zap size={16} color="var(--color-primary)" />
            <span><strong>{sessions}</strong> sessions today</span>
          </div>
          <div className={styles.miniStat}>
            <Timer size={16} color="var(--color-secondary)" />
            <span><strong>{totalFocusMin}m</strong> focused</span>
          </div>
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div className={styles.mainGrid}>

        {/* ═══ LEFT COLUMN ═══ */}
        <div className={styles.leftCol}>

          {/* Pomodoro Timer Card */}
          <div className={styles.timerCard}>
            {/* Mode Pills */}
            <div className={styles.modePills}>
              {(Object.keys(TIMER_CONFIGS) as TimerMode[]).map((m) => (
                <button
                  key={m}
                  id={`mode-${m}`}
                  className={`${styles.modePill} ${mode === m ? styles.modePillActive : ""}`}
                  onClick={() => switchMode(m)}
                  style={mode === m ? { background: modeColor, color: "#fff" } : {}}
                >
                  {m === "focus" ? <Target size={13} /> : <Coffee size={13} />}
                  {TIMER_CONFIGS[m].label}
                </button>
              ))}
            </div>

            {/* SVG Ring Timer */}
            <div className={styles.ringWrapper}>
              <svg className={styles.ringSvg} viewBox="0 0 160 160">
                <circle cx="80" cy="80" r={RADIUS} className={styles.ringBg} />
                <circle
                  cx="80" cy="80" r={RADIUS}
                  className={styles.ringFill}
                  style={{
                    strokeDasharray: CIRC,
                    strokeDashoffset: dashOffset,
                    stroke: modeColor,
                  }}
                />
              </svg>
              <div className={styles.ringCenter}>
                <div className={styles.timeDisplay}>{formatTime(seconds)}</div>
                <div className={styles.modeLabel} style={{ color: modeColor }}>
                  {TIMER_CONFIGS[mode].label}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className={styles.controls}>
              <button id="btn-reset" className={styles.ctrlBtn} onClick={resetTimer} title="Reset">
                <RotateCcw size={18} />
              </button>
              <button
                id={running ? "btn-pause" : "btn-play"}
                className={styles.playBtn}
                onClick={() => setRunning(!running)}
                style={{ background: modeColor }}
              >
                {running ? <Pause size={26} fill="#fff" /> : <Play size={26} fill="#fff" />}
              </button>
              <button
                id="btn-mute"
                className={styles.ctrlBtn}
                onClick={() => setMuted(!muted)}
                title={muted ? "Unmute" : "Mute"}
              >
                {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
            </div>

            {/* Session dots */}
            <div className={styles.sessionDots}>
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className={styles.sessionDot}
                  style={{ background: i < sessions % 4 ? "var(--color-primary)" : "var(--color-border)" }}
                />
              ))}
              <span className={styles.sessionCount}>{Math.floor(sessions / 4)} cycles completed</span>
            </div>

            {/* Ambient Sounds */}
            <div className={styles.ambientSection}>
              <div className={styles.ambientLabel}>
                <Music size={13} />
                Ambient Sound
              </div>
              <div className={styles.ambientRow}>
                {AMBIENT_SOUNDS.map((s) => (
                  <button
                    key={s.id}
                    id={`ambient-${s.id}`}
                    className={`${styles.ambientBtn} ${sound === s.id ? styles.ambientActive : ""}`}
                    onClick={() => setSound(sound === s.id ? null : s.id)}
                    title={s.label}
                  >
                    {s.emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Session Log */}
          <div className={styles.logCard}>
            <div className={styles.cardHeader}>
              <BookOpen size={16} color="var(--color-secondary)" />
              <h3>Session Log</h3>
              <span className={styles.badge}>{logs.length}</span>
            </div>
            <div className={styles.logList}>
              {logs.map((log) => (
                <div key={log.id} className={styles.logItem}>
                  <div
                    className={styles.logDot}
                    style={{
                      background: log.type === "focus"
                        ? "var(--color-primary)"
                        : "var(--color-success)",
                    }}
                  />
                  <div className={styles.logInfo}>
                    <span className={styles.logType}>
                      {log.type === "focus" ? "Focus Session" : "Break"}
                    </span>
                    <span className={styles.logTime}>{log.time}</span>
                  </div>
                  <span className={styles.logDuration}>{log.duration}m</span>
                </div>
              ))}
              {logs.length === 0 && (
                <p className={styles.emptyNote}>No sessions yet. Start your first!</p>
              )}
            </div>
          </div>
        </div>

        {/* ═══ RIGHT COLUMN ═══ */}
        <div className={styles.rightCol}>

          {/* Weekly Focus Chart */}
          <div className={styles.weekChart}>
            <div className={styles.cardHeader}>
              <TrendingUp size={16} color="var(--color-primary)" />
              <h3>Weekly Focus</h3>
              <span className={styles.badge2}>{WEEKLY_FOCUS.reduce((a, b) => a + b, 0)}m total</span>
            </div>
            <div className={styles.barChart}>
              {WEEKLY_FOCUS.map((val, i) => (
                <div key={i} className={styles.barCol}>
                  <div className={styles.barWrapper}>
                    <div
                      className={styles.bar}
                      style={{
                        height: `${(val / maxWeekly) * 100}%`,
                        background: i === today
                          ? "var(--color-primary)"
                          : "var(--color-border)",
                        opacity: i === today ? 1 : 0.7,
                      }}
                    />
                  </div>
                  <span className={`${styles.dayLabel} ${i === today ? styles.dayLabelActive : ""}`}>
                    {DAY_LABELS[i]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Row */}
          <div className={styles.statsRow}>
            {[
              { icon: <Target size={18} color="var(--color-primary)" />, label: "Focus Rate",   value: "84%",   sub: "above avg" },
              { icon: <Award  size={18} color="#F59E0B" />,              label: "Best Day",     value: "2h",    sub: "Tuesday" },
              { icon: <Flame  size={18} color="#EF4444" />,              label: "Streak",       value: "14d",   sub: "keep going!" },
              { icon: <Star   size={18} color="var(--color-secondary)" />,label: "XP Earned",   value: "340",   sub: "this week" },
            ].map((stat) => (
              <div key={stat.label} className={styles.statCard}>
                {stat.icon}
                <strong className={styles.statValue}>{stat.value}</strong>
                <span className={styles.statLabel}>{stat.label}</span>
                <span className={styles.statSub}>{stat.sub}</span>
              </div>
            ))}
          </div>

          {/* Task Manager */}
          <div className={styles.taskCard}>
            <div className={styles.taskHeader}>
              <div className={styles.cardHeader}>
                <CheckSquare size={16} color="var(--color-primary)" />
                <h3>Study Tasks</h3>
                <span className={styles.badge}>{completedCount}/{tasks.length} done</span>
              </div>
              <div className={styles.taskActions}>
                <div className={styles.filterPills}>
                  {(["all", "todo", "done"] as const).map((f) => (
                    <button
                      key={f}
                      id={`filter-${f}`}
                      className={`${styles.filterPill} ${filterDone === f ? styles.filterActive : ""}`}
                      onClick={() => setFilterDone(f)}
                    >
                      {f === "all" ? "All" : f === "todo" ? "To‑Do" : "Done"}
                    </button>
                  ))}
                </div>
                <button
                  id="btn-add-task"
                  className={styles.addBtn}
                  onClick={() => setShowAddTask(!showAddTask)}
                >
                  {showAddTask ? <ChevronUp size={16} /> : <Plus size={16} />}
                  Add Task
                </button>
              </div>
            </div>

            {/* Add Task Form */}
            {showAddTask && (
              <div className={styles.addTaskForm}>
                <input
                  id="input-task"
                  className={styles.taskInput}
                  placeholder="What do you need to study?"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addTask()}
                  autoFocus
                />
                <div className={styles.taskMeta}>
                  <select
                    id="select-priority"
                    className={styles.metaSelect}
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as Task["priority"])}
                  >
                    <option value="high">High priority</option>
                    <option value="medium">Med priority</option>
                    <option value="low">Low priority</option>
                  </select>
                  <select
                    id="select-course"
                    className={styles.metaSelect}
                    value={newCourse}
                    onChange={(e) => setNewCourse(e.target.value)}
                  >
                    {SUBJECTS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <button id="btn-save-task" className={styles.saveBtn} onClick={addTask}>
                    Save
                  </button>
                </div>
              </div>
            )}

            {/* Progress bar */}
            <div className={styles.progressBarWrap}>
              <div
                className={styles.progressBarFill}
                style={{ width: `${tasks.length ? (completedCount / tasks.length) * 100 : 0}%` }}
              />
            </div>

            {/* Task List */}
            <div className={styles.taskList}>
              {filteredTasks.map((task) => {
                const p = PRIORITY_CONFIG[task.priority];
                return (
                  <div key={task.id} className={`${styles.taskItem} ${task.done ? styles.taskDone : ""}`}>
                    <button
                      id={`toggle-${task.id}`}
                      className={styles.checkBtn}
                      onClick={() => toggleTask(task.id)}
                    >
                      {task.done
                        ? <CheckSquare size={18} color="var(--color-primary)" />
                        : <Square size={18} color="var(--color-text-muted)" />}
                    </button>
                    <div className={styles.taskBody}>
                      <p className={styles.taskText}>{task.text}</p>
                      <span className={styles.taskCourse}>{task.course}</span>
                    </div>
                    <span
                      className={styles.priorityBadge}
                      style={{ color: p.color, background: p.bg }}
                    >
                      {p.label}
                    </span>
                    <button
                      id={`delete-${task.id}`}
                      className={styles.deleteBtn}
                      onClick={() => deleteTask(task.id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                );
              })}
              {filteredTasks.length === 0 && (
                <div className={styles.emptyTasks}>
                  <CheckSquare size={32} color="var(--color-border)" />
                  <p>No tasks here. Add one above!</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
