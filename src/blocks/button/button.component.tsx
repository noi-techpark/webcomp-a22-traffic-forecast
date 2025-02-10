// SPDX-FileCopyrightText: 2025 NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Component, Event, EventEmitter, h, Host, Prop } from "@stencil/core";

/**
 * (INTERNAL) Backdrop component.
 *
 * @part button-native - Native button
 */
@Component({
  tag: 'noi-button',
  styleUrl: 'button.css',
  shadow: true,
})
export class ButtonComponent {

  /**
   * button 'disabled' property
   *
   * @default false
   */
  @Prop({mutable: true, reflect: true})
  disabled = false;

  /**
   * icon-only buttons has circle shape.
   * The size of the button can be changed with "font-size" style
   *
   * @default false
   */
  @Prop({mutable: true})
  iconOnly = false;

  /**
   * Emitted when user clicks on the button
   */
  @Event() btnClick: EventEmitter<MouseEvent>;


  render() {

    let hostClass = '';
    if (this.disabled) {
      hostClass += ' disabled';
    }

    let btnClass = 'btn';
    if (this.iconOnly) {
      btnClass += ' btn--icon';
    }

    return <Host class={hostClass}>
      <button class={btnClass}
              part="button-native"
              type="button"
              disabled={this.disabled}
              onClick={(e) => this.btnClick.emit(e)}>
        <slot/>
      </button>
    </Host>;
  }
}
