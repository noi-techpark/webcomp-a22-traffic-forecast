// SPDX-FileCopyrightText: 2025 NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { MicroSubject } from "../../utils/MicroSubject";
import { getAssetPath } from "../../utils/asset-path";

const DEFAULT_LANGUAGE = "en";

export class LanguageDataService {
  private static instance: LanguageDataService;

  readonly onLanguageChange = new MicroSubject<string>();
  public currentLanguage: string;

  private languageData: { [lang: string]: { [token: string]: string } } = {};
  private browserLanguage: string;
  private _languageLoading$: { [lang: string]: Promise<any> } = {};

  /**
   * @private
   */
  constructor() {
    this.browserLanguage = this.detectBrowserLanguage() || DEFAULT_LANGUAGE;
  }

  static getInstance() {
    if ( !LanguageDataService.instance) {
      LanguageDataService.instance = new LanguageDataService();
    }
    return LanguageDataService.instance;
  }

  translate(token: string) {
    return this.languageData[this.currentLanguage]?.[token] || this.languageData[DEFAULT_LANGUAGE]?.[token] || token;
  }

  useLanguage(lang: string) {
    let langNormalized = lang?.toLowerCase();

    if (langNormalized === this.currentLanguage) {
      return;
    }

    if ( !langNormalized || langNormalized === 'auto') {
      langNormalized = this.browserLanguage;
    }


    // prevent multiple requests
    if (this._languageLoading$[langNormalized]) {
      return this._languageLoading$[langNormalized];
    }

    // load language data
    this._languageLoading$[langNormalized] = this._fetchLanguageData(langNormalized)
      .then(() => {
        this.currentLanguage = langNormalized;
        this.onLanguageChange.trigger(this.currentLanguage);
      })
      .catch(e => {
        console.warn(e);
        if (this.currentLanguage !== DEFAULT_LANGUAGE) {
          this.currentLanguage = DEFAULT_LANGUAGE;
          this.onLanguageChange.trigger(this.currentLanguage);
        }
      })
      .finally(() => {
        delete this._languageLoading$[langNormalized];
      });

    return this._languageLoading$[langNormalized];
  }


  detectBrowserLanguage(): string {
    return navigator.language ? navigator.language.split('-')[0] : null;
  }

  _fetchLanguageData(lang: string) {
    if ( !this.languageData[lang]) {
      const dataPath = getAssetPath('i18n_' + lang + '.json');
      // console.log('[LanguageDataService] dataPath', dataPath);
      return fetch(dataPath)
        .then(r => r.json())
        .then(data => {
          this.languageData[lang] = data;
          console.log('[lang] language data loaded:', lang);
        });
    } else {
      return Promise.resolve();
    }

  }


}
