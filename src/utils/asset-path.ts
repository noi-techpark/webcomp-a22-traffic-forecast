// SPDX-FileCopyrightText: 2025 NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * stencil doesn't support this for 'dist-custom-elements' targets
 */
export function getAssetPath(path: string): string {
  return new URL(path, import.meta.url).toString();
}
