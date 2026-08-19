import {
  addDays,
  differenceInDays,
  differenceInHours,
  isSameDay,
} from "date-fns";

export enum PhaseStatus {
  UPCOMING = "UPCOMING",
  ACTIVE = "ACTIVE",
  EXPIRED = "EXPIRED",
}

export const formatDate = (date: string | Date): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString("default", { month: "long", day: "numeric" });
};

export const daysUntil = (date: Date): number => {
  return differenceInDays(date, new Date());
};

export const isToday = (date: Date): boolean => {
  return isSameDay(date, new Date());
};

export const startOfToday = (): Date => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

export const addDaysToDate = (date: Date, days: number): Date => {
  return addDays(date, days);
};

export const getPhaseStatus = (
  start: Date,
  end: Date,
  now = new Date(),
): PhaseStatus => {
  if (now < start) return PhaseStatus.UPCOMING;
  if (now > end) return PhaseStatus.EXPIRED;
  return PhaseStatus.ACTIVE;
};

export const isWithinTimeWindow = (
  start: Date,
  end: Date,
  now = new Date(),
): boolean => {
  return now >= start && now <= end;
};

export const hoursUntil = (date: Date) => {
  return differenceInHours(date, new Date());
};

export const addMinutesToNow = (minutes: number): Date => {
  return new Date(Date.now() + minutes * 60 * 1000);
};

export type TimeUnit = "minutes" | "hours" | "days" | "weeks";

export const MS_MULTIPLIERS: Record<TimeUnit, number> = {
  minutes: 60 * 1000,
  hours: 60 * 60 * 1000,
  days: 24 * 60 * 60 * 1000,
  weeks: 7 * 24 * 60 * 60 * 1000,
};

const MINUTES_MULTIPLIERS: Record<TimeUnit, number> = {
  minutes: 1,
  hours: 60,
  days: 24 * 60,
  weeks: 7 * 24 * 60,
};

export const addTimeToNow = (amount: number, unit: TimeUnit): Date => {
  const multiplier = MS_MULTIPLIERS[unit];
  return new Date(Date.now() + amount * multiplier);
};

export const durationToMinutes = (amount: number, unit: TimeUnit): number => {
  return amount * MINUTES_MULTIPLIERS[unit];
};

export const convertDuration = (
  amount: number,
  from: TimeUnit,
  to: TimeUnit,
): number => {
  const totalMs = amount * MS_MULTIPLIERS[from];
  return totalMs / MS_MULTIPLIERS[to];
};
