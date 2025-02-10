// SPDX-FileCopyrightText: 2025 NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

// mocks should come before other imports
import "../../../mocks";

import { h } from '@stencil/core';
import { newSpecPage } from "@stencil/core/testing";
import { LevelBoxComponent } from "./level-box.component";

describe('noi-traffic-level-box', () => {
  it('regular: render title and class', async () => {
    const page = await newSpecPage({
      components: [LevelBoxComponent],
      template: () => (<noi-traffic-level-box level="regular"></noi-traffic-level-box>),
    });

    // expect(page.root).toEqualHtml(`
    //   <noi-traffic-level-box class="busy busy--regular" title="app.traffic.regular"></noi-traffic-level-box>
    // `);

    expect(page.root.className).toEqual("busy busy--regular");
    expect(page.root.title).toEqual("T:app.traffic.regular");
  });

  it('severe: render title and class', async () => {
    const page = await newSpecPage({
      components: [LevelBoxComponent],
      template: () => (<noi-traffic-level-box level="severe"></noi-traffic-level-box>),
    });
    expect(page.root.className).toEqual("busy busy--severe");
    expect(page.root.title).toEqual("T:app.traffic.severe");
  });

  it('heavy: render title and class', async () => {
    const page = await newSpecPage({
      components: [LevelBoxComponent],
      template: () => (<noi-traffic-level-box level="heavy"></noi-traffic-level-box>),
    });
    expect(page.root.className).toEqual("busy busy--heavy");
    expect(page.root.title).toEqual("T:app.traffic.heavy");
  });


  it('critical: render title and class', async () => {
    const page = await newSpecPage({
      components: [LevelBoxComponent],
      template: () => (<noi-traffic-level-box level="critical"></noi-traffic-level-box>),
    });
    expect(page.root.className).toEqual("busy busy--critical");
    expect(page.root.title).toEqual("T:app.traffic.critical");
  });


});
