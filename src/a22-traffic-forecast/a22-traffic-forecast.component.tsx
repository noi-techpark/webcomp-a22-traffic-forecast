// SPDX-FileCopyrightText: 2025 NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Component, Element, forceUpdate, h, Host, Method, Prop, State, Watch } from "@stencil/core";
import { getLayoutClass, resolveLayoutAuto, ViewLayout } from "../data/breakpoints";
import { LanguageDataService } from "../data/language/language-data-service";
import { StencilComponent } from "../utils/StencilComponent";
import { TrafficPredictionDataService } from "../data/traffic-prediction/traffic-prediction-data-service";
import { CalendarDayContext } from "../blocks/calendar-month/calendar-month.component";
import { TrafficPredictionShort } from "../data/traffic-prediction/TrafficPredictionShort";
import { addMonths } from "date-fns/addMonths";
import { isSameMonth } from "date-fns/isSameMonth";
import { addDays } from "date-fns/addDays";
import { TrafficPredictionLocation } from "../data/traffic-prediction/TrafficPrediction";
import { DIRECTION_NAME } from "./direction-name";
import { parseDate } from "../utils/date.utils";

/**
 * Traffic forecast component
 *
 * @part title - Title
 * @part footer - Footer
 * @part calendar - Calendar
 * @part popup - Day details dialog
 */
@Component({
  tag: 'noi-a22-traffic-forecast',
  styleUrl: 'a22-traffic-forecast.css',
  shadow: true,
})
export class A22TrafficForecastComponent implements StencilComponent {

  /**
   * Location
   */
  @Prop({mutable: true})
  location: TrafficPredictionLocation;

  /**
   * Language
   */
  @Prop({mutable: true})
  language = 'en';

  /**
   * Layout appearance
   */
  @Prop({mutable: true})
  layout: ViewLayout = 'auto';

  @State()
  layoutResolved: ViewLayout;

  /**
   * View date (only month and year makes an impact)
   */
  @Prop({mutable: true})
  get viewDate() {
    return this._viewDate;
  }

  set viewDate(val: Date | number | string) {
    this._viewDate = parseDate(val);
    this.isCurrentMonth = isSameMonth(this._viewDate, new Date());
    this._reloadData();
  }

  isCurrentMonth = true;

  @Element() el: HTMLElement;
  _calendar: HTMLElement;

  _predictionData: TrafficPredictionShort[] = [];
  _predictionDataGrouped: { [dayString: string]: TrafficPredictionShort } = {};

  @State()
  _viewDate: Date = new Date();

  @State()
  selectedPredictionDate?: Date;

  @State()
  selectedPrediction?: TrafficPredictionShort;

  sizeObserver: ResizeObserver = null;

  // note: services are overridden in tests
  trafficPredictionService: TrafficPredictionDataService;
  languageService: LanguageDataService;

  constructor() {
    this.__renderCalendarCell = this.__renderCalendarCell.bind(this);
    this._onLanguageChanged = this._onLanguageChanged.bind(this);

    this.trafficPredictionService = new TrafficPredictionDataService();
    this.languageService = LanguageDataService.getInstance();
  }

  connectedCallback() {
    this.languageService.onLanguageChange.bind(this._onLanguageChanged);
    this.languageService.useLanguage(this.language);

    this._recalculateLayoutClass();
    this._watchSize();
    this._reloadData();
  }

  disconnectedCallback() {
    this._unwatchSize();
    this.languageService.onLanguageChange.unbind(this._onLanguageChanged);
  }

  _onLanguageChanged() {
    forceUpdate(this._calendar);
    forceUpdate(this.el);
  }

  @Watch('location')
  @Watch('_viewDate')
  _reloadData() {
    this.trafficPredictionService.getTrafficPredictionForMonth(this.location, this._viewDate, {withPadding: true})
      .then(r => {
        this._predictionData = r;
        this._predictionDataGrouped = {};
        for (const p of this._predictionData) {
          if (this._predictionDataGrouped[p.date.toLocaleDateString()]) {
            console.warn('Multiple data records found for date:', p.date.toISOString());
          }
          this._predictionDataGrouped[p.date.toLocaleDateString()] = p;
        }
        // console.log('Data received:', this._predictionDataGrouped);
        forceUpdate(this._calendar);
      });


    // close dialog
    this.selectedPredictionDate = null;
    this.selectedPrediction = null;
  }

  @Watch('language')
  onLanguageChange() {
    return this.languageService.useLanguage(this.language);
  }

  /**
   * Open day details
   */
  @Method()
  async selectDay(day: Date | string | number | null) {
    this.selectedPredictionDate = parseDate(day);
    if ( !this.selectedPredictionDate) {
      this.selectedPrediction = null;
      return;
    }

    this.selectedPrediction = undefined; // "undefined" shows 'data loading' label
    return this.trafficPredictionService.getTrafficPredictionForDay(this.location, this.selectedPredictionDate)
      .then(p => {
        this.selectedPrediction = p || null; // "null" shows 'no data' label
      });

  }

  _changeSelectedDay(change: number) {
    if ( !this.selectedPredictionDate) {
      this.selectedPredictionDate = new Date();
    }
    return this.selectDay(addDays(this.selectedPredictionDate, change));
  }


  @Watch('layout')
  _recalculateLayoutClass() {
    this.layoutResolved = resolveLayoutAuto(this.el.offsetWidth, this.layout);
  }

  _watchSize() {
    if (typeof window.ResizeObserver === 'function') {
      this.sizeObserver = new ResizeObserver(() => {
        this._recalculateLayoutClass();
      });
      this.sizeObserver.observe(this.el);
    } else {
      console.warn('ResizeObserver is not supported');
    }
  }

  _unwatchSize() {
    if (this.sizeObserver) {
      this.sizeObserver.unobserve(this.el);
      this.sizeObserver = null;
    }
  }

  /**
   * Change view month
   * @param change The number of months to shift the view. A positive value moves forward in time, while a negative value moves backward.
   */
  @Method()
  async changeViewMonth(change: number) {
    this._viewDate = addMonths(this._viewDate, change);
    this.isCurrentMonth = isSameMonth(this._viewDate, new Date());
    forceUpdate(this.el);
  }

  /**
   * Go back to current month
   */
  @Method()
  async resetToCurrentMonth() {
    this._viewDate = new Date();
    this.isCurrentMonth = true;
    forceUpdate(this.el);
  }


  render() {
    return (
      <Host class={getLayoutClass(this.layoutResolved)}>
        <div class="layout__scroll">
          {this._renderTitle()}
          <div class="layout__center">
            <noi-calendar-month part="calendar"
                                viewDate={this._viewDate}
                                language={this.language}
                                itemRenderer={this.__renderCalendarCell}
                                ref={ref => this._calendar = ref}></noi-calendar-month>

          </div>
          <div class="layout__spacer"></div>
          {this._renderFooter()}
        </div>
        <noi-backdrop hidden={ !this.selectedPredictionDate} onBackdropClick={() => this.selectDay(null)}>
          {this.selectedPredictionDate ? this._renderPopup() : null}
        </noi-backdrop>
      </Host>
    );
  }

  __renderCalendarCell(d: CalendarDayContext) {
    const pData = this._predictionDataGrouped[d.date.toLocaleDateString()];

    return (<noi-button class="day__btn" disabled={ !pData} onBtnClick={() => this.selectDay(d.date)}>
      <div class="day">
        <div class="day__day">{d.date.getDate()}</div>
        <div class="day__busy">
          <noi-traffic-level-box level={pData?.direction?.south?.summary}>
            {this.languageService.translate('app.direction.south.letter')}
          </noi-traffic-level-box>
          <noi-traffic-level-box level={pData?.direction?.north?.summary}>
            {this.languageService.translate('app.direction.north.letter')}
          </noi-traffic-level-box>
        </div>
      </div>
    </noi-button>);
  }

  _renderTitle() {
    const viewMonthName = this._viewDate.toLocaleString(this.language, {month: 'long'});
    const viewYearName = this._viewDate.getFullYear();

    return (<div class="layout__title" part="title">
      <div class="title__label">
        <span class="title__month">{viewMonthName}</span>
        <span class="title__year">{viewYearName}</span>
      </div>
      <noi-button class="title__btn"
                  title={this.languageService.translate('app.title.month-prev')}
                  iconOnly={true}
                  onBtnClick={() => this.changeViewMonth(-1)}>
        <noi-icon name="chevron__left"></noi-icon>
      </noi-button>
      <noi-button class="title__btn"
                  title={this.languageService.translate('app.title.month-next')}
                  iconOnly={true}
                  onBtnClick={() => this.changeViewMonth(1)}>
        <noi-icon name="chevron__right"></noi-icon>
      </noi-button>
      {this.isCurrentMonth ? null : (
        <noi-button class="title__btn"
                    title={this.languageService.translate('app.title.month-reset')}
                    iconOnly={true}
                    onBtnClick={() => this.resetToCurrentMonth()}>
          <noi-icon name="today"></noi-icon>
        </noi-button>)}
    </div>);
  }

  _renderPopup() {
    const selectedDate = this.selectedPredictionDate;
    const popupMonthName = selectedDate.toLocaleString(this.language, {month: 'long'});
    const popupWeekdayName = selectedDate.toLocaleString(this.language, {weekday: 'long'});

    return (<div class="popup" part="popup">
      <div class="popup__title">
        <noi-button class="popup__title-btn"
                    title={this.languageService.translate('app.title.day-prev')}
                    iconOnly={true}
                    onBtnClick={() => this._changeSelectedDay(-1)}>
          <noi-icon name="chevron__left"></noi-icon>
        </noi-button>
        <div class="popup__title-text">
          <span class="popup__title-weekday">{popupWeekdayName} </span>
          <span class="popup__title-date">{selectedDate.getDate()} </span>
          <span class="popup__title-month">{popupMonthName} </span>
          <span class="popup__title-year">{selectedDate.getFullYear()}</span>
        </div>
        <noi-button class="popup__title-btn"
                    title={this.languageService.translate('app.popup.day-next')}
                    iconOnly={true}
                    onBtnClick={() => this._changeSelectedDay(1)}>
          <noi-icon name="chevron__right"></noi-icon>
        </noi-button>

      </div>
      <noi-loading isLoading={ !this.selectedPrediction}>
        <div class="popup__content">
          <div>
            <noi-traffic-day-details
              direction="south"
              details={this.selectedPrediction?.direction?.south?.details}></noi-traffic-day-details>
          </div>
          <div>
            <noi-traffic-day-details
              direction="north"
              details={this.selectedPrediction?.direction?.north?.details}></noi-traffic-day-details>
          </div>
        </div>

        {/* Here is the difference between 'null' and 'undefined' to show 'loading' and 'no-data' state */}
        <div slot="loading" class="popup__content loading">
          {this.selectedPrediction === null ? (
            <div class="loading-label">{this.languageService.translate('app.no-data')}</div>
          ) : (
            <div class="loading-label">{this.languageService.translate('app.loading')}</div>
          )}
        </div>
      </noi-loading>
      <div class="popup__footer">
        <noi-button class="popup__close-btn" onBtnClick={() => this.selectDay(null)}>
          {this.languageService.translate('app.popup.close')}
        </noi-button>
      </div>
    </div>);
  }

  _renderFooter() {
    const labelNorth = this.languageService.translate('app.details.direction-prefix') + ' ' + DIRECTION_NAME.north;
    const labelSouth = this.languageService.translate('app.details.direction-prefix') + ' ' + DIRECTION_NAME.south;
    return (<div class="layout__footer" part="footer">
      <div class="legend">
        <div class="legend__item" title={labelNorth}>
          <b class="legend__icon">{this.languageService.translate('app.direction.north.letter')}</b>
          <div class="legend__item-content">
            {labelNorth}
          </div>
        </div>
        <div class="legend__item" title={labelSouth}>
          <b class="legend__icon">{this.languageService.translate('app.direction.south.letter')}</b>
          <div class="legend__item-content">
            {labelSouth}
          </div>
        </div>
        <noi-traffic-level-box class="legend__item" level="critical">
          <div class="legend__item-content">{this.languageService.translate('app.traffic.critical')}</div>
        </noi-traffic-level-box>
        <noi-traffic-level-box class="legend__item" level="heavy">
          <div class="legend__item-content">{this.languageService.translate('app.traffic.heavy')}</div>
        </noi-traffic-level-box>
        <noi-traffic-level-box class="legend__item" level="severe">
          <div class="legend__item-content">{this.languageService.translate('app.traffic.severe')}</div>
        </noi-traffic-level-box>
        <noi-traffic-level-box class="legend__item" level="regular">
          <div class="legend__item-content">{this.languageService.translate('app.traffic.regular')}</div>
        </noi-traffic-level-box>
      </div>
    </div>);
  }


}
