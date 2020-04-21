import {
    LitElement,
    html,
    customElement,
    property,
    TemplateResult,
    CSSResult,
    css
} from "lit-element";
import { HomeAssistant } from "custom-card-helpers";

import {
    FancyLightCardConfig,
    ConfigFieldTarget,
    ConfigChangedEvent,
    LovelaceCardEditor
} from "./types";

import { THEME } from "./const";

@customElement("fancy-light-card-editor")
export class FancyLightCardEditor extends LitElement implements LovelaceCardEditor {
    @property() public hass?: HomeAssistant;
    @property() private config?: FancyLightCardConfig;

    public setConfig(config: FancyLightCardConfig): void {
        this.config = config;
    }

    get name(): string {
        if (this.config) {
            return this.config.name || "";
        }

        return "";
    }

    get entity(): string {
        if (this.config) {
            return this.config.entity || "";
        }

        return "";
    }

    protected render(): TemplateResult | void {
        if (!this.hass) {
            return html``;
        }

        const entities = Object.keys(this.hass.states).filter(
            eid => eid.substr(0, eid.indexOf(".")) === "light"
        );

        return html`
            <div class="card-config">
                <div class="fancy-light-card__mdc-theme fancy-light-card-editor__values">
                    <mwc-textfield
                        label="Name (Optional)"
                        .value=${this.name}
                        .configValue=${"name"}
                        @change=${this._valueChanged}
                        }}
                    ></mwc-textfield>
                    <mwc-select
                        label="Entity"
                        .value=${this.entity}
                        .configValue=${"entity"}
                        @selected=${this._valueChanged}
                    >
                        ${entities.map(entity => {
                            return html`
                                <mwc-list-item role="option" value="${entity}"
                                    >${entity}</mwc-list-item
                                >
                            `;
                        })}
                    </mwc-select>
                </div>
            </div>
        `;
    }

    private _valueChanged(input_event: Event): void {
        if (!this.config || !this.hass || !input_event.target) {
            return;
        }
        const target = input_event.target as ConfigFieldTarget;
        if (this[target.configValue] === target.value) {
            return;
        }
        const new_config = {
            ...this.config
        };
        if (target.configValue) {
            if (target.value === "") {
                new_config[target.configValue] = "";
            } else {
                new_config[target.configValue] =
                    target.checked !== undefined ? target.checked : target.value;
            }
        }
        const event = new ConfigChangedEvent("config-changed", {
            bubbles: true,
            composed: true
        });
        event.detail = { config: new_config };
        this.dispatchEvent(event);
    }

    static get styles(): CSSResult {
        return css`
            ${THEME}
            .fancy-light-card-editor__values {
                display: flex;
                flex-direction: column;
                padding-left: 16px;
            }
            .fancy-light-card-editor__values mwc-textfield {
                padding: 8px;
            }
            .fancy-light-card-editor__values mwc-select {
                padding: 8px;
            }
        `;
    }
}
