// SPDX-FileCopyrightText: 2025 NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Component, h, Host, Prop } from "@stencil/core";

/**
 * (INTERNAL) render loading indicator over the content.
 * This allows to render content with empty data hidden behind the loader,
 * so when data is loaded there would be no resize onf the content
 *
 * @slot - main content slot
 * @slot loading - slot to show loading indicator
 */
@Component({
    tag: 'noi-loading',
    styleUrl: 'loading.css',
    shadow: true,
})
export class LoadingComponent {

    /**
     * Input placeholder
     */
    @Prop({mutable: true})
    isLoading = false;

    render() {
        return (<Host>
            <div class={"content " + (this.isLoading ? 'hidden' : '')}>
                <slot/>
            </div>
            <div class={"loading " + (this.isLoading ? '' : 'hidden')}>
                <slot name="loading"/>
            </div>
        </Host>);
    }
}
