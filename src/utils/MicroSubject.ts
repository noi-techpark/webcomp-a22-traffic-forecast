// SPDX-FileCopyrightText: 2025 NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * inspired by MicroEvent.js
 */
export class MicroSubject<T> {
  private readonly _listeners: Array<(arg: T) => any> = [];

  bind(fn: (arg: T) => any) {
    this._listeners.push(fn);
  }

  unbind(fn: (arg: T) => any) {
    this._listeners.splice(this._listeners.indexOf(fn), 1);
  }

  trigger(data: T /* , args... */) {
    for (let i = 0; i < this._listeners.length; i++) {
      this._listeners[i].apply(this, [data]);
    }
  }
}



