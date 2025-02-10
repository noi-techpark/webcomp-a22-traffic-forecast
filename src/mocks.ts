// SPDX-FileCopyrightText: 2025 NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

/*
 * Stencil 'automock' option makes it weird, so we manually define all mocks here
 * @usage
 *   Add the following before importing any component in test file:
 *
 *   // mocks should come before other imports
 *   import "../../../mocks";
 */

// NOTE! mocks should come before imports
jest.mock("./data/language/language-data-service.ts");
jest.mock("./data/traffic-prediction/traffic-prediction-data-service.ts");
