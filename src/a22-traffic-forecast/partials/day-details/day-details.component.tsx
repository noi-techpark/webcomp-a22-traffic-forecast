// SPDX-FileCopyrightText: 2025 NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Component, Element, forceUpdate, h, Host, Prop } from "@stencil/core";
import {
  TrafficPredictionDirection,
  TrafficPredictionTime,
  TrafficPredictionValue
} from "../../../data/traffic-prediction/TrafficPredictionShort";
import { LanguageDataService } from "../../../data/language/language-data-service";
import { DIRECTION_NAME } from "../../direction-name";
import { StencilComponent } from "../../../utils/StencilComponent";


const timeParts: TrafficPredictionTime[] = ['q1', 'q2', 'q3', 'q4'];
const timePartNames = {
  'q1': '0/6',
  'q2': '6/12',
  'q3': '12/18',
  'q4': '18/24',
}

/**
 * (INTERNAL) part of 'noi-traffic-prediction'
 */
@Component({
  tag: 'noi-traffic-day-details',
  styleUrl: 'day-details.css',
  scoped: true,
})
export class DayDetailsComponent implements StencilComponent {

  @Prop({mutable: true})
  details: { [dayPart in TrafficPredictionTime]: TrafficPredictionValue };

  @Prop({mutable: true})
  direction: TrafficPredictionDirection;

  @Element() el: HTMLElement;

  languageService: LanguageDataService;

  constructor() {
    this._onLanguageChanged = this._onLanguageChanged.bind(this);
    this.languageService = LanguageDataService.getInstance();
  }

  connectedCallback() {
    this.languageService.onLanguageChange.bind(this._onLanguageChanged);
  }

  disconnectedCallback() {
    this.languageService.onLanguageChange.unbind(this._onLanguageChanged);
  }

  _onLanguageChanged() {
    forceUpdate(this.el);
  }

  render() {
    return (<Host>
      <div class="dd__name">
        {this.languageService.translate('app.details.direction')}
        <span class="dd__direction"> {this.languageService.translate('app.direction.' + this.direction)}</span>
      </div>
      <div
        class="dd__description">{this.languageService.translate('app.details.direction-prefix')} {DIRECTION_NAME[this.direction]}</div>
      <div class="dd__parts">
        {timeParts.map((timePart) => {
          return (<div class="part__label">
            <span>{this.languageService.translate('app.details.part-hours')}</span>
            <span>{timePartNames[timePart]}</span>
          </div>);
        })}
        {timeParts.map((timePart) => {
          return (<noi-traffic-level-box class="part__value" level={this.details?.[timePart]}></noi-traffic-level-box>);
        })}
      </div>
    </Host>);
  }
}
