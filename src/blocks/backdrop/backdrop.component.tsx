// SPDX-FileCopyrightText: 2025 NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Component, Event, EventEmitter, h, Host, Prop } from "@stencil/core";

/**
 * (INTERNAL) Backdrop component.
 */
@Component({
  tag: 'noi-backdrop',
  styleUrl: 'backdrop.css',
  scoped: true,
})
export class BackdropComponent {


  /**
   * Removing backdrop from DOM sometime can cause blink during layout recalculation.
   * 'hidden' can be used to hide the backdrop without removing from DOM
   *
   * @default false
   */
  @Prop()
  hidden = false;

  /**
   * Emitted when user clicks on the backdrop
   */
  @Event() backdropClick: EventEmitter<void>;

  render() {
    return <Host class={this.hidden ? 'hidden' : ''}>
      <div class="content">
        <slot/>
      </div>
      <div class="backdrop" onClick={() => this.backdropClick.emit()}></div>
    </Host>
  }
}
