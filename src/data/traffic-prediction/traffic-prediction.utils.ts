// SPDX-FileCopyrightText: 2025 NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { TrafficPredictionLocation, TrafficPredictionResponse } from "./TrafficPrediction";
import {
  TrafficPredictionDirection,
  TrafficPredictionShort,
  TrafficPredictionTime,
  TrafficPredictionValue
} from "./TrafficPredictionShort";
import { getDaySeq } from "../../utils/date.utils";


export class TrafficPredictionUtils {

  static SUFFIX_NORTH = ' Nord';
  static SUFFIX_SOUTH = ' Sud';

  /**
   *
   */
  static convertToShortInfo(dataArr: TrafficPredictionResponse[]): TrafficPredictionShort[] {
    const group: { [key: string]: TrafficPredictionShort } = {};

    // group by "location + day index"
    for (const p of dataArr) {
      const locationInfo = TrafficPredictionUtils._getLocationInfo(p.scode);
      if ( !locationInfo) {
        continue;
      }
      const dateInfo = TrafficPredictionUtils._getDateInfo(p.mvalidtime);

      const _dayPart = getDaySeq(dateInfo.day);
      const groupKey = locationInfo.baseCode + '-' + _dayPart;

      if ( !group[groupKey]) {
        group[groupKey] = {
          date: dateInfo.day,
          dateLocalized: dateInfo.day.toLocaleDateString(),
          baseCode: locationInfo.baseCode,
          direction: {
            north: null,
            south: null,
          },
        };
      }

      if ( !group[groupKey].direction[locationInfo.direction]) {
        group[groupKey].direction[locationInfo.direction] = {
          name: p.sname,
          summary: null, // calculated below
          details: {
            q1: null,
            q2: null,
            q3: null,
            q4: null,
          },
        };
      }

      // calculate day part
      if (group[groupKey].direction[locationInfo.direction].details[dateInfo.dayPart]) {
        console.warn('Multiple data presented for the time period:', dateInfo.dayPart, p);
      }
      group[groupKey].direction[locationInfo.direction].details[dateInfo.dayPart] = p.mvalue;
    }

    const dataGroupedArr = Object.values(group);

    // calculate summary
    for (const tp of dataGroupedArr) {
      tp.direction.south.summary = TrafficPredictionUtils._summarizeDay(tp.direction.south.details);
      tp.direction.north.summary = TrafficPredictionUtils._summarizeDay(tp.direction.north.details);
    }

    return dataGroupedArr;
  }

  /**
   * get location and direction from location code
   */
  static _getLocationInfo(scode: string): {
    baseCode: TrafficPredictionLocation,
    direction: TrafficPredictionDirection,
  } {
    if ( !scode) {
      return null;
    }
    if (scode.endsWith(TrafficPredictionUtils.SUFFIX_NORTH)) {
      return {
        baseCode: scode.substring(0, scode.length - TrafficPredictionUtils.SUFFIX_NORTH.length) as TrafficPredictionLocation,
        direction: 'north',
      };
    }
    if (scode.endsWith(TrafficPredictionUtils.SUFFIX_SOUTH)) {
      return {
        baseCode: scode.substring(0, scode.length - TrafficPredictionUtils.SUFFIX_SOUTH.length) as TrafficPredictionLocation,
        direction: 'south',
      };
    }
    console.warn('Unknown location code:', scode);
    return null;
  }


  /**
   * Get date info: day and time quarter of the day
   *
   * @param dateString example: "2025-01-27 05:00:00.000+0000"
   * Result is 'day' - the beginning of the day (local time), dayPart - a quarter name of the day
   */
  static _getDateInfo(dateString: string): { day: Date, dayPart: TrafficPredictionTime } {
    const date = new Date(dateString);

    // day beginning
    const dayBeginning = new Date(date.getTime());
    dayBeginning.setHours(0, 0, 0, 0);

    // hours
    const hour = date.getHours();
    if (hour < 6) {
      return {
        day: dayBeginning,
        dayPart: 'q1',
      };
    }
    if (hour < 12) {
      return {
        day: dayBeginning,
        dayPart: 'q2',
      };
    }
    if (hour < 18) {
      return {
        day: dayBeginning,
        dayPart: 'q3',
      };
    }
    return {
      day: dayBeginning,
      dayPart: 'q4',
    };
  }

  /**
   * Calculate summary for the day.
   * Current implementation is to get maximum level from day periods
   */
  static _summarizeDay(details: { [qn in TrafficPredictionTime]: TrafficPredictionValue }): TrafficPredictionValue {
    // values are ordered from low to high priority
    const LEVELS: TrafficPredictionValue[] = ["regular", "severe", "heavy", "critical"];

    // get maximum level
    const valueArr = Object.values(details);
    const indexArr = valueArr.map(level => LEVELS.indexOf(level));
    const maxIndex = Math.max(...indexArr);
    return maxIndex >= 0 ? LEVELS[maxIndex] : null;
  }


  static calcCacheKey(baseCode: TrafficPredictionLocation, date: Date) {
    // we need to use local date for caching
    const d = date.getDate();
    const m = date.getMonth();
    const y = date.getFullYear();
    return `${baseCode}-${y}-${m}-${d}`;
  }

}
