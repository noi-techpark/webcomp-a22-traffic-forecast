// SPDX-FileCopyrightText: 2025 NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Component, Element, forceUpdate, h, Host, Prop } from "@stencil/core";
import { TrafficPredictionValue } from "../../../data/traffic-prediction/TrafficPredictionShort";
import { LanguageDataService } from "../../../data/language/language-data-service";
import { StencilComponent } from "../../../utils/StencilComponent";

/**
 * (INTERNAL) part of 'noi-traffic-prediction'
 */
@Component({
  tag: 'noi-traffic-level-box',
  styleUrl: 'level-box.css',
  scoped: true,
})
export class LevelBoxComponent implements StencilComponent {

  @Prop({mutable: true})
  level: TrafficPredictionValue;

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
    const className = 'busy busy--' + (this.level || 'none');
    return (<Host class={className} title={this.languageService.translate('app.traffic.' + (this.level || 'none'))}>
      <slot/>
    </Host>);
  }
}
