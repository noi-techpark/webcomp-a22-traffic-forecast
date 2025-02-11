// SPDX-FileCopyrightText: 2025 NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

const DAY_MS = 24 * 60 * 60 * 1000;
const MIN_MS = 60 * 1000;

/**
 * Get day index from the beginning on timestamp (Jan 1, 1970)
 * It's not useful itself, but can be used for comparing two dates.
 * LOCAL time used
 *
 * @param date
 */
export function getDaySeq(date: Date): number {
  return Math.floor((date.getTime() - date.getTimezoneOffset() * MIN_MS) / DAY_MS);
}


/**
 *
 */
export function parseDate(val: string | number | Date): Date {
  if ( !val && val !== 0) {
    return null;
  }

  let result: Date;
  if (val instanceof Date) {
    result = new Date(val.getTime());
  } else {
    result = new Date(val);
  }
  const ms = result.getTime(); // ms is NaN when date is not valid
  if ( !ms && ms !== 0) {
    throw new Error('Invalid date');
  }
  return result;
}
