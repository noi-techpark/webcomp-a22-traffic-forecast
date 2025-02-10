// SPDX-FileCopyrightText: 2025 NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later


import { TrafficPredictionUtils } from "./traffic-prediction.utils";
import { TrafficPredictionResponse } from "./TrafficPrediction";
import { TrafficPredictionShort } from "./TrafficPredictionShort";

describe("TrafficPredictionUtils", () => {


  describe('calcCacheKey', () => {

    it('should use same key for a day', () => {
      const date1 = new Date('2025-01-01T00:00:00');
      const date2 = new Date('2025-01-01T23:59:59');

      const key1 = TrafficPredictionUtils.calcCacheKey('Bolzano', date1);
      const key2 = TrafficPredictionUtils.calcCacheKey('Bolzano', date2);

      expect(key1).toBe(key2);
    });

    it('should use different key for different days: full day', () => {
      const date1 = new Date('2025-01-01T00:00:00');
      const date2 = new Date('2025-01-02T00:00:00');

      const key1 = TrafficPredictionUtils.calcCacheKey('Bolzano', date1);
      const key2 = TrafficPredictionUtils.calcCacheKey('Bolzano', date2);

      expect(key1).not.toBe(key2);
    });

    it('should use different key for different days: midnight', () => {
      const date1 = new Date('2025-01-01T23:59:59');
      const date2 = new Date('2025-01-02T00:00:00');

      const key1 = TrafficPredictionUtils.calcCacheKey('Bolzano', date1);
      const key2 = TrafficPredictionUtils.calcCacheKey('Bolzano', date2);

      expect(key1).not.toBe(key2);
    });

    it('should use different key for another location', () => {
      const date1 = new Date('2025-01-01T00:00:00');
      const date2 = new Date('2025-01-01T00:00:00');

      const key1 = TrafficPredictionUtils.calcCacheKey('Bolzano', date1);
      const key2 = TrafficPredictionUtils.calcCacheKey('Brennero', date2);

      expect(key1).not.toBe(key2);
    });

  });

  describe('_getLocationInfo', () => {
    it('should recognize nord value', () => {
      const info = TrafficPredictionUtils._getLocationInfo('Brennero Nord');
      expect(info).toStrictEqual({baseCode: 'Brennero', direction: 'north'});
    });

    it('should recognize nord with spaces', () => {
      const info = TrafficPredictionUtils._getLocationInfo('Some city Nord');
      expect(info).toStrictEqual({baseCode: 'Some city', direction: 'north'});
    });

    it('should recognize sud', () => {
      const info = TrafficPredictionUtils._getLocationInfo('Brennero Sud');
      expect(info).toStrictEqual({baseCode: 'Brennero', direction: 'south'});
    });
  });

  describe('_getDateInfo', () => {

    // note: we use local time in tests to avoid timezone issue
    it('should define time between 0 and 6 as q1', () => {
      const testData = [
        "2025-01-27 00:00:00.000",
        "2025-01-27 01:00:00.000",
        "2025-01-27 05:00:00.000",
        "2025-01-27 05:59:59.999",
      ];
      for (const d of testData) {
        const info = TrafficPredictionUtils._getDateInfo(d);
        expect(info.dayPart).toBe('q1');
      }
    });

    it('should define time between 6 and 12 as q2', () => {
      const testData = [
        "2025-01-27 06:00:00.000",
        "2025-01-27 11:00:00.000",
        "2025-01-27 11:59:59.999",
      ];
      for (const d of testData) {
        const info = TrafficPredictionUtils._getDateInfo(d);
        expect(info.dayPart).toBe('q2');
      }
    });

    it('should define time between 12 and 18 as q3', () => {
      const testData = [
        "2025-01-27 12:00:00.000",
        "2025-01-27 17:00:00.000",
        "2025-01-27 17:59:59.999",
      ];
      for (const d of testData) {
        const info = TrafficPredictionUtils._getDateInfo(d);
        expect(info.dayPart).toBe('q3');
      }
    });

    it('should define time between 18 and 24 as q4', () => {
      const testData = [
        "2025-01-27 18:00:00.000",
        "2025-01-27 23:00:00.000",
        "2025-01-27 23:59:59.999",
      ];
      for (const d of testData) {
        const info = TrafficPredictionUtils._getDateInfo(d);
        expect(info.dayPart).toBe('q4');
      }
    });
  });


  describe('convertToShortInfo', () => {
    it('should group results for a day', () => {
      const dataIn: TrafficPredictionResponse[] = [
        {
          sname: 'City1 Nord name',
          scode: 'City1 Nord',
          mvalidtime: "2025-01-27 05:00:00.000+0000",
          mvalue: 'regular',
        },
        {
          sname: 'City1 Sud name',
          scode: 'City1 Sud',
          mvalidtime: "2025-01-27 05:00:00.000+0000",
          mvalue: 'regular',
        },
      ] as TrafficPredictionResponse[];

      const expectedResult: TrafficPredictionShort = {
        baseCode: 'City1',
        date: new Date("2025-01-27T00:00:00.000"),
        dateLocalized: "1/27/2025",
        direction: {
          north: {
            name: 'City1 Nord name',
            summary: 'regular',
            details: {
              q1: null,
              q2: 'regular',
              q3: null,
              q4: null,
            },
          },
          south: {
            name: 'City1 Sud name',
            summary: 'regular',
            details: {
              q1: null,
              q2: 'regular',
              q3: null,
              q4: null,
            },
          },
        },
      };

      const shortInfo = TrafficPredictionUtils.convertToShortInfo(dataIn);

      expect(shortInfo.length).toBe(1);
      expect(shortInfo[0]).toStrictEqual(expectedResult);

    });
  });
});
