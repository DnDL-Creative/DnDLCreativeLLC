"use client";

import { useState } from "react";
import {
  GraduationCap,
  GripVertical,
  Trash2,
  PlayCircle,
  CheckCircle2,
  Clock,
  Calendar,
  ArrowDown,
} from "lucide-react";
import styles from "../task-master.module.css";
import { TaskItem, SortOption } from "./types";
import TagManager from "./TagManager";

interface LevelUpViewProps {
  items: TaskItem[];
  sortOption: SortOption;
  filterTags: string[];
  allSystemTags: string[];
  onUpdateMetadata: (id: string, metadata: any) => void; // <--- Special handler for JSON
  onUpdateTags: (id: string, tags: string[]) => void;
  onDelete: (id: string) => void;
  onReorder: (draggedId: string, targetId: string) => void;
  onToggleStatus: (id: string, status: string) => void;
}

export default function LevelUpView({
  items,
  sortOption,
  filterTags,
  allSystemTags,
  onUpdateMetadata,
  onUpdateTags,
  onDelete,
  onReorder,
  onToggleStatus,
}: LevelUpViewProps) {
  const [draggedId, setDraggedId] = useState<string | null>(null);

  // Filter & Sort (Default to Manual for the "Path" look)
  const filteredItems = items
    .filter((item) => {
      if (item.status === "archived") return false;
      if (
        filterTags.length > 0 &&
        !filterTags.every((t) => item.tags?.includes(t))
      )
        return false;
      return true;
    })
    .sort((a, b) => {
      if (sortOption === "manual") return 0;
      if (sortOption === "created_desc")
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      return 0;
    });

  if (filteredItems.length === 0)
    return (
      <div className="p-12 text-center border border-dashed border-white/10 rounded-xl bg-white/5">
        <GraduationCap className="mx-auto text-slate-600 mb-3" size={32} />
        <p className="text-slate-500 italic">
          No courses in the queue. Add one to start your path.
        </p>
      </div>
    );

  // Drag Handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    if (sortOption !== "manual") return;
    setDraggedId(id);
    e.dataTransfer.effectAllowed = "move";
  };
  const handleDragOver = (e: React.DragEvent) => {
    if (sortOption === "manual") e.preventDefault();
  };
  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (sortOption === "manual" && draggedId && draggedId !== targetId) {
      onReorder(draggedId, targetId);
      setDraggedId(null);
    }
  };

  return (
    <div className="relative space-y-0 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* THE CONNECTOR LINE (Absolute behind items) */}
      <div className="absolute left-[28px] md:left-[36px] top-8 bottom-20 w-0.5 bg-white/10 -z-0" />

      {filteredItems.map((item, index) => (
        <div
          key={item.id}
          draggable={sortOption === "manual"}
          onDragStart={(e) => handleDragStart(e, item.id)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, item.id)}
          className={`relative pl-16 md:pl-20 py-4 transition-all duration-300 group ${
            draggedId === item.id ? "opacity-40 scale-95" : "opacity-100"
          }`}
        >
          {/* NODE CIRCLE */}
          <div
            className={`absolute left-4 md:left-6 top-10 w-6 h-6 rounded-full border-4 border-slate-900 z-10 flex items-center justify-center
                ${
                  item.status === "completed"
                    ? "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                    : "bg-slate-700 shadow-[0_0_10px_rgba(255,255,255,0.1)]"
                }
            `}
          >
            {item.status === "completed" && (
              <CheckCircle2 size={12} className="text-slate-900" />
            )}
          </div>

          {/* ARROW BETWEEN ITEMS */}
          {index < filteredItems.length - 1 && (
            <div className="absolute left-[24px] md:left-[32px] bottom-[-10px] text-white/10 z-0">
              <ArrowDown size={16} />
            </div>
          )}

          <CourseCard
            item={item}
            isManualSort={sortOption === "manual"}
            allSystemTags={allSystemTags}
            onUpdateMetadata={onUpdateMetadata}
            onUpdateTags={onUpdateTags}
            onDelete={onDelete}
            onToggleStatus={onToggleStatus}
          />
        </div>
      ))}
    </div>
  );
}

// --- COURSE CARD ---
function CourseCard({
  item,
  isManualSort,
  allSystemTags,
  onUpdateMetadata,
  onUpdateTags,
  onDelete,
  onToggleStatus,
}: any) {
  // Parse Metadata
  const meta = item.metadata || {};
  const [totalHours, setTotalHours] = useState(meta.total_hours || 0);
  const [completedHours, setCompletedHours] = useState(
    meta.hours_completed || 0
  );
  const [dailyGoal, setDailyGoal] = useState(meta.daily_study_goal || 1); // Default 1 hr/day
  const [isEditing, setIsEditing] = useState(false);

  // Calculations
  const progress =
    totalHours > 0
      ? Math.min(Math.round((completedHours / totalHours) * 100), 100)
      : 0;
  const hoursLeft = Math.max(0, totalHours - completedHours);
  const daysLeft = dailyGoal > 0 ? Math.ceil(hoursLeft / dailyGoal) : 0;

  // Predicted Finish Date
  const finishDate = new Date();
  finishDate.setDate(finishDate.getDate() + daysLeft);
  const finishDateStr = finishDate.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });

  const handleSaveMeta = () => {
    onUpdateMetadata(item.id, {
      ...meta,
      total_hours: Number(totalHours),
      hours_completed: Number(completedHours),
      daily_study_goal: Number(dailyGoal),
    });
    setIsEditing(false);
  };

  return (
    <div
      className={`${styles.itemCard} !bg-black/40 !border-white/5 relative overflow-hidden flex flex-col gap-4`}
    >
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-3">
          {isManualSort && (
            <GripVertical
              size={16}
              className="text-slate-700 cursor-grab mt-1 hover:text-white shrink-0"
            />
          )}
          <div>
            <h3
              className={`text-lg font-bold leading-none ${
                item.status === "completed"
                  ? "text-emerald-400 line-through"
                  : "text-slate-200"
              }`}
            >
              {item.title}
            </h3>
            <div className="mt-2">
              <TagManager
                selectedTags={item.tags || []}
                allSystemTags={allSystemTags}
                onUpdateTags={(tags) => onUpdateTags(item.id, tags)}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onToggleStatus(item.id, item.status)}
            className={`p-2 rounded-lg border transition-all ${
              item.status === "completed"
                ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
            }`}
            title={
              item.status === "completed" ? "Mark Active" : "Mark Complete"
            }
          >
            {item.status === "completed" ? (
              <CheckCircle2 size={16} />
            ) : (
              <PlayCircle size={16} />
            )}
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-600 hover:text-rose-400 hover:border-rose-500/30 transition-all"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* PROGRESS BAR */}
      <div
        className="w-full bg-slate-800 h-2 rounded-full overflow-hidden relative group/bar cursor-pointer"
        onClick={() => setIsEditing(!isEditing)}
        title="Click to edit progress"
      >
        <div
          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        {isEditing ? (
          <>
            <div className="bg-white/5 p-2 rounded border border-white/10">
              <label className="block text-slate-500 uppercase font-bold text-[9px] mb-1">
                Done (Hrs)
              </label>
              <input
                type="number"
                value={completedHours}
                onChange={(e) => setCompletedHours(Number(e.target.value))}
                className="bg-black/20 w-full text-white p-1 rounded focus:outline-none focus:border-cyan-500 border border-transparent"
              />
            </div>
            <div className="bg-white/5 p-2 rounded border border-white/10">
              <label className="block text-slate-500 uppercase font-bold text-[9px] mb-1">
                Total (Hrs)
              </label>
              <input
                type="number"
                value={totalHours}
                onChange={(e) => setTotalHours(Number(e.target.value))}
                className="bg-black/20 w-full text-white p-1 rounded focus:outline-none focus:border-cyan-500 border border-transparent"
              />
            </div>
            <div className="bg-white/5 p-2 rounded border border-white/10">
              <label className="block text-slate-500 uppercase font-bold text-[9px] mb-1">
                Study/Day
              </label>
              <input
                type="number"
                value={dailyGoal}
                onChange={(e) => setDailyGoal(Number(e.target.value))}
                className="bg-black/20 w-full text-white p-1 rounded focus:outline-none focus:border-cyan-500 border border-transparent"
              />
            </div>
            <button
              onClick={handleSaveMeta}
              className="bg-cyan-600 hover:bg-cyan-500 text-white rounded font-bold uppercase tracking-wider"
            >
              Save
            </button>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 text-slate-400">
              <Clock size={14} className="text-cyan-500" />
              <div>
                <div className="font-bold text-slate-200">
                  {completedHours} / {totalHours} hrs
                </div>
                <div className="text-[10px] opacity-50">
                  Progress ({progress}%)
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Calendar size={14} className="text-purple-500" />
              <div>
                <div className="font-bold text-slate-200">
                  {item.status === "completed" ? "Done" : `${daysLeft} Days`}
                </div>
                <div className="text-[10px] opacity-50">
                  {item.status === "completed"
                    ? "Great job!"
                    : `Finish: ${finishDateStr}`}
                </div>
              </div>
            </div>
            <div className="col-span-2 flex justify-end items-center">
              <button
                onClick={() => setIsEditing(true)}
                className="text-[10px] uppercase font-bold text-slate-600 hover:text-cyan-400"
              >
                Edit Plan
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
