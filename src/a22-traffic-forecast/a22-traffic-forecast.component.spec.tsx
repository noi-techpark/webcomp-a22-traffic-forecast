// SPDX-FileCopyrightText: 2025 NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

// mocks should come before other imports
import "../mocks";

import { h } from '@stencil/core';
import { newSpecPage } from "@stencil/core/testing";
import { A22TrafficForecastComponent } from "./a22-traffic-forecast.component";

describe('noi-a22-traffic-forecast', () => {
  it('should render component', async () => {

    A22TrafficForecastComponent.prototype._watchSize = () => null; // no ResizeObserver in mock
    A22TrafficForecastComponent.prototype.connectedCallback = () => null; // need to learn stencil better to fix $hostElement$ issue

    const page = await newSpecPage({
      components: [A22TrafficForecastComponent],
      template: () => (<noi-a22-traffic-forecast></noi-a22-traffic-forecast>),
    });

    expect(page.root.classList.contains('layout')).toBe(true);
  });


});
