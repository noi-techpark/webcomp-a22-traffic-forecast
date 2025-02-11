// SPDX-FileCopyrightText: 2025 NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later


import { TrafficPredictionLocation } from "../TrafficPrediction";
import { TrafficPredictionShort } from "../TrafficPredictionShort";

export class TrafficPredictionDataService {
  async getTrafficPredictionInRange(_baseCode: TrafficPredictionLocation, _dateFrom: Date, _dateTo: Date): Promise<TrafficPredictionShort[]> {
    return [];
  }

  async getTrafficPredictionForDay(_loc: TrafficPredictionLocation, _viewDay: Date): Promise<TrafficPredictionShort> {
    return null;
  }

  async getTrafficPredictionForMonth(_baseCode: TrafficPredictionLocation, _viewMonth: Date, _opts?: {
    withPadding?: boolean
  }) {
    return [];
  }

}
