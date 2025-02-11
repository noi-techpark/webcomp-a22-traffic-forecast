<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: CC0-1.0
-->

# noi-traffic-level-box



<!-- Auto Generated Below -->


## Overview

(INTERNAL) part of 'noi-traffic-prediction'

## Properties

| Property | Attribute | Description | Type                                             | Default     |
| -------- | --------- | ----------- | ------------------------------------------------ | ----------- |
| `level`  | `level`   |             | `"critical" \| "heavy" \| "regular" \| "severe"` | `undefined` |


## Dependencies

### Used by

 - [noi-a22-traffic-forecast](../..)
 - [noi-traffic-day-details](../day-details)

### Graph
```mermaid
graph TD;
  noi-a22-traffic-forecast --> noi-traffic-level-box
  noi-traffic-day-details --> noi-traffic-level-box
  style noi-traffic-level-box fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
