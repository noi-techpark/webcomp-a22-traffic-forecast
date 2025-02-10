// SPDX-FileCopyrightText: 2025 NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

// mocks should come before other imports
import "../../../mocks";


import { h } from '@stencil/core';
import { newSpecPage } from "@stencil/core/testing";
import { DayDetailsComponent } from "./day-details.component";

// jest.mock("src/data/language/language-data-service.ts");

describe('noi-traffic-day-details', () => {
  it('should render component', async () => {
    const page = await newSpecPage({
      components: [DayDetailsComponent],
      template: () => (<noi-traffic-day-details></noi-traffic-day-details>),
    });

    expect(page.root.querySelector('.dd__description').innerHTML).toEqualHtml(`
       T:app.details.direction-prefix
    `);
  });


});
