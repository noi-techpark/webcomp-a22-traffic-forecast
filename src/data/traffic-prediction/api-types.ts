// SPDX-FileCopyrightText: 2025 NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * Data received from api
 */
export interface Datatype {
  tname: string;
  tunit: string;
  ttype: string;
  tdescription: string;
  tmeasurements: Measurement[];
}


export interface Measurement<T = string | number | any> {
  mvalue: T;
  mvalidtime: string; // $date-time
  mtransactiontime: string; // $date-time
  mperiod: number;
  mprovenance: Provenance;
}

export interface Provenance {
  prname: string;
  prversion: string;
  prlineage: string;
}

export interface Station {
  sname: string;
  stype: string;
  scode: string;
  sorigin: string;
  sactive: boolean;
  scoordinate: Coordinate;
  smetadata: any;
  sparent: any; // TBD
}

export interface Coordinate {
  x: number;
  y: number;
  srid: number;
}
