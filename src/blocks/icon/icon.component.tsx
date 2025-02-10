// SPDX-FileCopyrightText: 2025 NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Component, h, Prop } from "@stencil/core";

export type IconName = 'close'
  | 'chevron__left'
  | 'chevron__right'
  | 'today'
  ;

/**
 * (INTERNAL) render an icon.
 *
 * Icons are embedded inside the component (so far).
 *
 * Icon size can be changed by 'font-size' style
 */
@Component({
  tag: 'noi-icon',
  styleUrl: 'icon.css',
  shadow: true,
})
export class IconComponent {

  /**
   * icon name
   */
  @Prop()
  name: IconName | string;

  render() {
    switch (this.name) {
      case 'close':
        return (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd"
                d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
                fill="currentColor"/>
        </svg>);
      case 'chevron__left':
        return (<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="30 0 512 512">
          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="48"
                d="M328 112L184 256l144 144"/>
        </svg>);
      case 'chevron__right':
        return (<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="-30 0 512 512">
          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="48"
                d="M184 112l144 144-144 144"/>
        </svg>);
      case 'today':
        return (<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <rect fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="32" x="48" y="80" width="416"
                height="384" rx="48"/>
          <path fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="32" stroke-linecap="round"
                d="M128 48v32M384 48v32"/>
          <rect fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="32" stroke-linecap="round"
                x="112" y="224" width="96" height="96" rx="13"/>
          <path fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="32" stroke-linecap="round"
                d="M464 160H48"/>
        </svg>);
    }
  }
}
