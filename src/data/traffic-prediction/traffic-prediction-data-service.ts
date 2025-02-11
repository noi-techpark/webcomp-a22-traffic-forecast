// SPDX-FileCopyrightText: 2025 NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { ListResponseV2 } from "../ListResponse";
import { TrafficPredictionLocation, TrafficPredictionResponse } from "./TrafficPrediction";
import { TrafficPredictionUtils } from "./traffic-prediction.utils";
import { startOfMonth } from "date-fns/startOfMonth";
import { startOfWeek } from "date-fns/startOfWeek";
import { endOfMonth } from "date-fns/endOfMonth";
import { endOfWeek } from "date-fns/endOfWeek";
import { TrafficPredictionShort } from "./TrafficPredictionShort";
import { addDays } from "date-fns/addDays";

// origin is used to track usage and traffic patterns
const ORIGIN = 'webcomp-a22-traffic-forecast';

/**
 * API has a limit of MAX_DAYS_PER_REQUEST days data
 */
const MAX_DAYS_PER_REQUEST = 5;

export class TrafficPredictionDataService {

  private cache: { [dayStr: string]: TrafficPredictionShort } = {};

  /**
   */
  async getTrafficPredictionInRange(baseCode: TrafficPredictionLocation, dateFrom: Date, dateTo: Date): Promise<TrafficPredictionShort[]> {
    if ( !baseCode) {
      console.warn('[TrafficPredictionDataService] location is empty');
      return [];
    }
    const cached = this._getCacheEntries(baseCode, dateFrom, dateTo);
    if (cached) {
      return cached;
    } else {
      return this._getTrafficPredictionInRange(baseCode, dateFrom, dateTo);
    }
  }

  _getTrafficPredictionInRange(baseCode: TrafficPredictionLocation, dateFrom: Date, dateTo: Date): Promise<TrafficPredictionShort[]> {
    const snameNorth = baseCode + TrafficPredictionUtils.SUFFIX_NORTH;
    const snameSouth = baseCode + TrafficPredictionUtils.SUFFIX_SOUTH;
    const whereQuery = `where=or(scode.in.("${snameNorth}","${snameSouth}"))`;
    const dateFromParam = dateFrom.toISOString();
    const dateToParam = dateTo.toISOString();

    return fetch(`https://mobility.api.opendatahub.com/v2/flat,node/TrafficForecast/forecast/${dateFromParam}/${dateToParam}?origin=${ORIGIN}&pagesize=-1&${whereQuery}`)
      .then(r => r.json() as Promise<ListResponseV2<TrafficPredictionResponse>>)
      .then(r => r.data)
      .then(r => TrafficPredictionUtils.convertToShortInfo(r))
      .then(r => {
        this._pushToCache(baseCode, r);
        return r;
      });
  }

  /**
   */
  getTrafficPredictionForDay(loc: TrafficPredictionLocation, viewDay: Date): Promise<TrafficPredictionShort> {
    const dayBeginning = new Date(viewDay.getTime());
    dayBeginning.setHours(0, 0, 0, 0);

    const nextDayBeginning = new Date(dayBeginning.getTime());
    nextDayBeginning.setDate(nextDayBeginning.getDate() + 1);

    return this.getTrafficPredictionInRange(loc, dayBeginning, nextDayBeginning)
      .then(r => r[0] || null);
  }

  /**
   */
  async getTrafficPredictionForMonth(baseCode: TrafficPredictionLocation, viewMonth: Date, opts?: {
    withPadding?: boolean
  }) {
    let dateStart = startOfMonth(viewMonth);
    if (opts?.withPadding) {
      dateStart = startOfWeek(dateStart, {weekStartsOn: 1});
    }

    let dateEnd = endOfMonth(viewMonth);
    if (opts?.withPadding) {
      dateEnd = endOfWeek(dateEnd, {weekStartsOn: 1});
    }

    // API has a limit of MAX_DAYS_PER_REQUEST days data, so we load the data by chunks
    const chunks$: Array<Promise<TrafficPredictionShort[]>> = [];
    let iday = 0;

    let _fuse = 20;
    while (_fuse-- > 0) {
      const chunkDateStart = addDays(dateStart, iday);
      const chunkDateEnd = addDays(dateStart, iday + MAX_DAYS_PER_REQUEST);
      if (chunkDateEnd < dateEnd) {
        chunks$.push(this.getTrafficPredictionInRange(baseCode, chunkDateStart, chunkDateEnd));
      } else {
        // last chunk
        chunks$.push(this.getTrafficPredictionInRange(baseCode, chunkDateStart, dateEnd));
        break;
      }
      iday += MAX_DAYS_PER_REQUEST;
    }
    if (_fuse <= 0) {
      console.warn('[getTrafficPredictionForMonth] Fuse reached');
    }

    const results = await Promise.all(chunks$);
    const combined: TrafficPredictionShort[] = [];
    for (const result of results) {
      combined.push(...result);
    }

    this._pushToCache(baseCode, combined);
    return combined;
  }

  private _pushToCache(baseCode: TrafficPredictionLocation, data: TrafficPredictionShort[]) {
    for (const d of data) {
      const key = TrafficPredictionUtils.calcCacheKey(baseCode, d.date);
      this.cache[key] = d;
    }
  }

  private _getCacheEntries(baseCode: TrafficPredictionLocation, dateFrom: Date, dateTo: Date): TrafficPredictionShort[] | null {
    const result: TrafficPredictionShort[] = [];

    let i = 0;
    for (i = 0; i < 100; i++) {
      const day = addDays(dateFrom, i);
      if (day >= dateTo) {
        return result;
        ////////////
      }

      const key = TrafficPredictionUtils.calcCacheKey(baseCode, day);
      if ( !this.cache[key]) {
        return null;
      }

      result.push(this.cache[key]);
    }
    if (i >= 100) {
      console.warn('[_isCacheRangeAvailable] Fuse reached');
    }
    return null;
  }

}

