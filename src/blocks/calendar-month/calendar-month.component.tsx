// SPDX-FileCopyrightText: 2025 NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Component, h, Host, Prop, State, Watch } from "@stencil/core";
import { startOfMonth } from "date-fns/startOfMonth";
import { startOfWeek } from "date-fns/startOfWeek";
import { endOfMonth } from "date-fns/endOfMonth";
import { endOfWeek } from "date-fns/endOfWeek";
import { addDays } from "date-fns/addDays";
import { isSameMonth } from "date-fns/isSameMonth";
import { isWeekend } from "date-fns/isWeekend";

export interface CalendarDayContext {
  date: Date;
  isCurrentMonth: boolean;
  isWeekend: boolean;
  isFirstWeek: boolean;
  isLastWeek: boolean;
}

/**
 * (INTERNAL) Calendar component.
 *
 * It's not encapsulated, so the styles can be applied outside of the component.
 */
@Component({
  tag: 'noi-calendar-month',
  styleUrl: 'calendar-month.css',
})
export class CalendarMonthComponent {

  /**
   * calendar view date
   *
   * @default current date
   */
  @Prop({mutable: true})
  viewDate: Date = new Date();

  /**
   * Language for day names
   *
   * @default en
   */
  @Prop({mutable: true})
  language = 'en';

  /**
   * Cell render function
   *
   * @default (context)=><span>{context.date.toLocaleDateString()}</span>
   */
  @Prop()
  itemRenderer?: (d: CalendarDayContext) => any;

  @State()
  viewDays: Date[] = [];

  private _headerDates: string[];

  connectedCallback() {
    this._fillHeaderDates();
    this.onViewDateChanged();
  }

  @Watch('viewDate')
  onViewDateChanged() {
    const monthStart = startOfMonth(this.viewDate);
    const firstWeekStart = startOfWeek(monthStart, {weekStartsOn: 1});

    const monthEnd = endOfMonth(this.viewDate);
    const lastWeekEnd = endOfWeek(monthEnd, {weekStartsOn: 1});

    let days: Date[] = [];
    let date = firstWeekStart;

    let _fuse = 100;
    while (_fuse-- > 0) {
      if (date < lastWeekEnd) {
        days.push(date);
        date = addDays(date, 1);
      } else {
        break;
      }
    }
    if (_fuse <= 0) {
      console.warn('[CalendarMonthComponent] Fuse reached');
    }
    this.viewDays = days;
  }

  @Watch('language')
  _fillHeaderDates() {
    this._headerDates = [];
    const weekStart = startOfWeek(new Date(), {weekStartsOn: 1});
    for (let i = 0; i < 7; i++) {
      const date = addDays(weekStart, i);
      this._headerDates.push(date.toLocaleString(this.language, {weekday: 'short'}));
    }
  }

  render() {
    return <Host class="calendar">
      {this._headerDates.map(d => {
        return (<div class="calendar__cell calendar__header">{d}</div>);
      })}
      {this.viewDays.map((day, i, arr) => {
        const context: CalendarDayContext = {
          date: day,
          isCurrentMonth: isSameMonth(this.viewDate, day),
          isWeekend: isWeekend(day),
          isFirstWeek: i < 7,
          isLastWeek: i >= arr.length - 7,
        };

        let classes = 'calendar__cell calendar__day';
        if (context.isFirstWeek) {
          classes += ' calendar__day-first-week';
        }
        if (context.isLastWeek) {
          classes += ' calendar__day-last-week';
        }
        if ( !context.isCurrentMonth) {
          classes += ' calendar__day-not-current-month';
        }

        return (<div class={classes}>{this._renderDay(context)}</div>);
      })}
    </Host>;
  }

  _renderDay(context: CalendarDayContext) {
    if (this.itemRenderer) {
      return this.itemRenderer(context);
    } else {
      // fallback option
      return (<span>{context.date.toLocaleDateString()}</span>);
    }
  }
}
