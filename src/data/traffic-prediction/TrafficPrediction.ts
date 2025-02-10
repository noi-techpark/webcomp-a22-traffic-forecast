// SPDX-FileCopyrightText: 2025 NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Datatype, Measurement, Provenance, Station } from "./api-types";

export type TrafficPredictionLocation = "Brennero" | "Bolzano" | "Verona";
export type TrafficPredictionLevel = "regular" | "severe" | "heavy" | "critical";
export type TrafficPredictionResponse = Datatype & Measurement<TrafficPredictionLevel> & Provenance & Station;
