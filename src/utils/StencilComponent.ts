// SPDX-FileCopyrightText: 2025 NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * Component lifecycle helpers
 * @see https://stenciljs.com/docs/component-lifecycle
 */
export interface StencilComponent {
  componentDidLoad?(): void;

  connectedCallback?(): void;
  disconnectedCallback?(): void;

  componentWillLoad?(): void;
  componentDidLoad?(): void;

  componentWillRender?(): void;
  componentDidRender?(): void;

  componentShouldUpdate?(): boolean;
  componentWillUpdate?(): void;
  componentDidUpdate?(): void;

  render?(): any;
}
