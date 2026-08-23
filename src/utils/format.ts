import type { WeightUnit } from '@/types';

export function formatWeight(weight: number, unit: WeightUnit): string {
  if (weight === 0) return `— ${unit}`;
  return `${weight} ${unit}`;
}

export function formatElapsedTime(startTimeMs: number): string {
  const elapsed = Math.floor((Date.now() - startTimeMs) / 1000);
  const h = Math.floor(elapsed / 3600);
  const m = Math.floor((elapsed % 3600) / 60);
  const s = elapsed % 60;
  if (h > 0) return `${h}:${pad(m)}:${pad(s)}`;
  return `${m}:${pad(s)}`;
}

export function formatDuration(seconds: number): string {
  if (seconds === 0 || seconds == null) return '—';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export function formatDate(unixMs: number): string {
  const date = new Date(unixMs);
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatShortDate(unixMs: number): string {
  const date = new Date(unixMs);
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function formatRestTimer(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${pad(s)}`;
}

function pad(n: number): string {
  return n.toString().padStart(2, '0');
}

export function lbToKg(lb: number): number {
  return Math.round(lb * 0.453592 * 4) / 4; // round to nearest 0.25
}

export function kgToLb(kg: number): number {
  return Math.round(kg * 2.20462 * 2) / 2; // round to nearest 0.5
}
