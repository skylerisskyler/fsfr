export type Mode = 'single' | 'restart' | 'queued' | 'parallel'

export interface ForDict {
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
  milliseconds?: number;
}