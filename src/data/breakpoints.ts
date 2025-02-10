// SPDX-FileCopyrightText: 2025 NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

export const Breakpoints = {
  Mobile: 500,
  Tablet: 890,
}


export type ViewLayout = 'desktop' | 'tablet' | 'mobile' | 'auto';

export function getLayoutClass(layout: ViewLayout) {
  switch (layout) {
    case "desktop":
      return 'layout layout--desktop';
    case "tablet":
      return 'layout layout--tablet';
    case "mobile":
      return 'layout layout--mobile';
    default:
      console.warn(`Unknown layout: ${layout}`);
      return 'layout';
  }
}

/**
 * resolve 'auto' layout to specific size
 */
export function resolveLayoutAuto(offsetWidth: number, layout: ViewLayout): ViewLayout {
  if (layout && layout !== 'auto') {
    return layout;
  }

  if (offsetWidth > Breakpoints.Tablet) {
    return 'desktop';
  }
  if (offsetWidth > Breakpoints.Mobile) {
    return 'tablet';
  }
  return 'mobile';
}
