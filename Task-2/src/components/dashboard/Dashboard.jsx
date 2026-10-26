import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { gsap } from "../../lib/gsap";
import { prefersReducedMotion } from "../../lib/animation";
import { computeClarity } from "../../lib/clarity";
import { todayKey } from "../../lib/dates";
import { pickFocusTask } from "../../lib/priority";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { useTasks } from "../../hooks/useTasks";
import Sidebar from "./Sidebar";
import FocusMode from "./FocusMode";
import CloseDay from "./CloseDay";
import WorkspaceView from "./views/WorkspaceView";
import CalendarView from "./views/CalendarView";
import LogsView from "./views/LogsView";


//  * The private workspace. Mounted only while a session exists.
//  * Layout: collapsible sidebar + one view at a time. One Thing Mode and Close
//  * the Day open as overlays above everything.

export default function Dashboard({ user, onLogout }) {
  const main = useRef(null);
  const taskApi = useTasks(user.id);
  const { tasks } = taskApi;

  const [view, setView] = useState("workspace"); // workspace | calendar | logs
  const [collapsed, setCollapsed] = useLocalStorage("clareo.ui.sidebar", window.innerWidth < 768);
  const [minutes, setMinutes] = useLocalStorage("clareo.focus.minutes", 25);
  const [closedOn, setClosedOn] = useLocalStorage(`clareo.closed.${user.id}`, null);
  const [focus, setFocus] = useState(null); // null, or { task } while One Thing Mode is open
  const [closeOpen, setCloseOpen] = useState(false);

  const stats = useMemo(() => computeClarity(tasks), [tasks]);

  const openFocus = useCallback(() => {
    setFocus({ task: pickFocusTask(tasks, todayKey()) });
  }, [tasks]);

  // F opens One Thing Mode when you are not typing.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key.toLowerCase() !== "f" || e.metaKey || e.ctrlKey || e.altKey) return;
      if (focus || closeOpen) return;
      if (e.target.closest?.("input, textarea, select, [contenteditable='true']")) return;
      e.preventDefault();
      openFocus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [focus, closeOpen, openFocus]);

  // Each view eases in. The context is reverted when the view changes or unmounts.
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      gsap.from(".view-in", { opacity: 0, y: 16, duration: 0.7, stagger: 0.1, ease: "power3.out" });
    }, main);
    return () => ctx.revert();
  }, [view]);

  const today = todayKey();

  return (
    <div className="flex min-h-screen bg-[#11141A] text-[#FAF9F6] antialiased selection:bg-[#9EAF97] selection:text-[#11141A]">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        view={view}
        onView={setView}
        onFocus={openFocus}
        focusOpen={Boolean(focus)}
        email={user.email}
        onLogout={onLogout}
      />

      <main ref={main} className="min-w-0 flex-1 px-4 pb-32 sm:px-6 md:px-14">
        <div className="max-w-[1180px]">
          {view === "workspace" && (
            <WorkspaceView
              user={user}
              tasks={tasks}
              stats={stats}
              api={taskApi}
              closedToday={closedOn === today}
              onCloseDay={() => setCloseOpen(true)}
            />
          )}
          {view === "calendar" && <CalendarView tasks={tasks} api={taskApi} />}
          {view === "logs" && <LogsView tasks={tasks} stats={stats} onReopen={taskApi.toggle} />}
        </div>
      </main>

      {closeOpen && (
        <CloseDay
          tasks={tasks}
          onCarry={taskApi.moveMany}
          onRelease={taskApi.removeMany}
          onClosed={() => setClosedOn(today)}
          onClose={() => setCloseOpen(false)}
        />
      )}

      {focus && (
        <FocusMode
          task={focus.task}
          minutes={minutes}
          onMinutes={setMinutes}
          onComplete={taskApi.complete}
          onExit={() => setFocus(null)}
        />
      )}
    </div>
  );
}
