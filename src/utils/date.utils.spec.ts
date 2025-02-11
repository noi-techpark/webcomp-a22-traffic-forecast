// SPDX-FileCopyrightText: 2025 NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later


import { parseDate } from "./date.utils";

describe('date.utils', () => {
  describe('parseDate', () => {

    it('should return null if nullable data passed', () => {
      expect(parseDate(null)).toBe(null);
      expect(parseDate(undefined)).toBe(null);
    });

    it('should parse number', () => {
      expect(parseDate(1735689600000).toISOString()).toBe('2025-01-01T00:00:00.000Z');
      expect(parseDate(0).toISOString()).toBe('1970-01-01T00:00:00.000Z');
    });

    it('should parse ISO-8601', () => {
      expect(parseDate('2025-01-01T00:00:00.000Z').toISOString()).toBe('2025-01-01T00:00:00.000Z');
      expect(parseDate('1970-01-01T00:00:00.000Z').toISOString()).toBe('1970-01-01T00:00:00.000Z');
    });

    it('should parse partial string', () => {
      expect(parseDate('2025-01-01').toISOString()).toBe('2025-01-01T00:00:00.000Z');
      expect(parseDate('1970-01-01').toISOString()).toBe('1970-01-01T00:00:00.000Z');
    });

    it('should return date object', () => {
      const d = new Date('2025-01-01T00:00:00.000Z');
      expect(parseDate(d).toISOString()).toBe('2025-01-01T00:00:00.000Z');
    });


  });
});
