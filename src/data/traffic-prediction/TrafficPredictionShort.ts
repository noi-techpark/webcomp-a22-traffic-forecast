// SPDX-FileCopyrightText: 2025 NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { TrafficPredictionLevel } from "./TrafficPrediction";

/**
 * Simplified structure
 */
export interface TrafficPredictionShort {
  baseCode: string;
  date: Date;
  dateLocalized: string;
  // directions: Array<'south' | 'north'>;
  direction: {
    south: TrafficPrediction_directionData;
    north: TrafficPrediction_directionData;
  }
}

interface TrafficPrediction_directionData {
  name: string;
  summary: TrafficPredictionValue;
  details: {
    // detailed info, times per day.
    // q1..q4 means a quarter of the day
    q1: TrafficPredictionValue;
    q2: TrafficPredictionValue;
    q3: TrafficPredictionValue;
    q4: TrafficPredictionValue;
  };
}

export type TrafficPredictionTime = 'q1' | 'q2' | 'q3' | 'q4';
export type TrafficPredictionDirection = 'south' | 'north';
export type TrafficPredictionValue = TrafficPredictionLevel;

