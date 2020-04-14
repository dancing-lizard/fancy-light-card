import {
    LitElement,
    html,
    customElement,
    property,
    CSSResult,
    TemplateResult,
    css,
    PropertyValues
} from "lit-element";

import { HomeAssistant, hasConfigOrEntityChanged, LovelaceCard } from "custom-card-helpers";

import iro from "@jaames/iro";

// mwc-button is already imported by HASS
// import "@material/mwc-button";
import "@material/mwc-list";
import "@material/mwc-list/mwc-list-item";
import "@material/mwc-select";

import {
    Capabilities,
    CommitType,
    ConfigFieldTarget,
    CustomCardDescription,
    FancyLightCardConfig,
    FancyLightPicker,
    LightEntityAttributes,
    LovelaceCardEditor
} from "./types";
import { CARD_VERSION, THEME } from "./const";
import "./editor";

/* eslint no-console: 0 */
console.info(
    `%c  FANCY-LIGHT-CARD  \n%c  Version ${CARD_VERSION}     `,
    "color: orange; font-weight: bold; background: black",
    "color: white; font-weight: bold; background: dimgray"
);

@customElement("fancy-light-card")
export class FancyLightCard extends LitElement implements LovelaceCard {
    @property() public hass?: HomeAssistant;
    @property() private config?: FancyLightCardConfig;
    @property() private color: FancyLightPicker;
    @property() private brightness: FancyLightPicker;
    @property() private temperature: FancyLightPicker;
    @property() private flash?: "short" | "long";
    @property() private effect?: string;
    @property() private effect_list?: string[];
    @property() private caps = 0;

    constructor() {
        super();
        this.color = {
            div: document.createElement("div"),
            picker: null
        };
        this.color.div.className = "picker";
        this.color.picker = new iro.ColorPicker(this.color.div, {
            width: 200,
            color: "#fff",
            handleRadius: 15,
            layoutDirection: "horizontal",
            layout: [{ component: iro.ui.Wheel }]
        });
        this.color.picker.on("input:end", (color: iro.Color) => {
            this.onColorPicked(color);
        });
        this.brightness = {
            div: document.createElement("div"),
            picker: null
        };
        this.brightness.div.className = "picker";
        this.brightness.picker = new iro.ColorPicker(this.brightness.div, {
            width: 200,
            color: "#fff",
            handleRadius: 15,
            layoutDirection: "horizontal",
            layout: [
                {
                    component: iro.ui.Slider,
                    options: {
                        sliderType: "value"
                    }
                }
            ]
        });
        this.brightness.picker.on("input:end", (color: iro.Color) => {
            this.onBrightnessPicked(color);
        });
        this.temperature = {
            div: document.createElement("div"),
            picker: null
        };
        this.temperature.div.className = "picker";
        this.temperature.picker = new iro.ColorPicker(this.temperature.div, {
            width: 200,
            color: "#fff",
            handleRadius: 15,
            layoutDirection: "horizontal",
            layout: [
                {
                    component: iro.ui.Slider,
                    options: {
                        sliderType: "kelvin",
                        maxTemperature: 6535,
                        minTemperature: 2000
                    }
                }
            ]
        });
        this.temperature.picker.on("input:end", (color: iro.Color) => {
            this.onTemperaturePicked(color);
        });
    }

    protected onColorPicked(color: iro.Color): void {
        this.color.value = [color.hsv.h, color.hsv.s];
        this.commit(CommitType.Color);
    }

    protected getColorPicker(): TemplateResult {
        if (this.caps & Capabilities.Color && this.color.value) {
            this.color.picker.color.hsv = {
                h: this.color.value[0],
                s: this.color.value[1],
                v: 100
            };
            return html`
                ${this.color.div}
            `;
        }
        return html``;
    }

    protected onBrightnessPicked(color: iro.Color): void {
        this.brightness.value = (color.hsv.v * 255) / 100;
        this.commit(CommitType.Brightness);
    }

    protected getBrightnessPicker(): TemplateResult {
        if (this.caps & Capabilities.Brightness && typeof this.brightness.value == "number") {
            const brightness = (this.brightness.value * 100) / 255;
            const color = this.color.value ? this.color.value : [0, 0];
            this.brightness.picker.color.hsv = {
                h: color[0],
                s: color[1],
                v: brightness
            };
            return html`
                ${this.brightness.div}
            `;
        }
        return html``;
    }

    protected onTemperaturePicked(color: iro.Color): void {
        this.temperature.value = 1000000 / color.kelvin;
        this.commit(CommitType.Temp);
    }

    protected getTemperaturePicker(): TemplateResult {
        if (this.caps & Capabilities.Temp && typeof this.temperature.value == "number") {
            const temperature = this.temperature.value;

            this.temperature.picker.color.kelvin = 1000000 / temperature;
            return html`
                ${this.temperature.div}
            `;
        }
        return html``;
    }

    protected getFlashControl(): TemplateResult {
        if (this.caps & Capabilities.Flash) {
            return html`
                <div class="fancy-light-card__control_holder">
                    <span>Flash</span>
                    <mwc-button
                        label="Short"
                        @click=${(): void => {
                            this.flash = "short";
                            this.commit(CommitType.Flash);
                        }}
                    ></mwc-button>
                    <mwc-button
                        label="Long"
                        @click=${(): void => {
                            this.flash = "long";
                            this.commit(CommitType.Flash);
                        }}
                    ></mwc-button>
                </div>
            `;
        }
        return html``;
    }

    protected onEffectSelected(event: Event): void {
        if (event?.target) {
            const target = event.target as ConfigFieldTarget;
            this.effect = target.value;
            this.commit(CommitType.Effect);
        }
    }

    protected getEffects(): TemplateResult {
        if (this.caps & Capabilities.Effect && this.effect_list) {
            const items = this.effect_list.map(effect => {
                return html`
                    <mwc-list-item role="option" value="${effect}">${effect}</mwc-list-item>
                `;
            });
            return html`
                <mwc-select
                    .value=${this.effect}
                    @selected=${(event: Event): void => {
                        this.onEffectSelected(event);
                    }}
                    label="Effect"
                    >${items}</mwc-select
                >
            `;
        }
        return html``;
    }

    protected parseAttributes(state: boolean, attributes: LightEntityAttributes): void {
        this.caps = attributes.supported_features ? attributes.supported_features : 0;

        if (!state) {
            this.color.value = undefined;
            this.brightness.value = undefined;
            this.temperature.value = undefined;
            this.effect = undefined;
            this.flash = undefined;
            return;
        }
        if (this.caps & Capabilities.Color) {
            if (attributes.hs_color) {
                this.color.value = attributes.hs_color;
            } else if (attributes.rgb_color) {
                // TODO:
                // HASS keeps color as HS color discarding V,
                // so we need to convert to HS + brightness if we want "true" RGB
                const color = attributes.rgb_color;
                const hsv = iro.Color.rgbToHsv({ r: color[0], g: color[1], b: color[2] });
                const new_value = [Math.floor(hsv.h), Math.floor(hsv.s)];

                this.color.value = new_value;
            }
            // TODO: XY conversion
        }
        if (this.caps & Capabilities.Brightness) {
            this.brightness.value = attributes.brightness;
        }
        if (this.caps & Capabilities.Effect) {
            this.effect_list = attributes.effect_list;
            if (this.effect_list && attributes.effect) {
                this.effect = this.effect_list.includes(attributes.effect)
                    ? attributes.effect
                    : undefined;
            }
        }
        if (this.caps & Capabilities.Temp) {
            this.temperature.value = attributes.color_temp;
        }
    }

    protected commit(what: CommitType): void {
        if (this.config && this.hass?.states[this.config.entity].state == "on") {
            const payload: LightEntityAttributes = {};

            switch (what) {
                case CommitType.Brightness:
                    payload.brightness =
                        this.caps & Capabilities.Brightness &&
                        typeof this.brightness.value == "number"
                            ? this.brightness.value
                            : undefined;
                    break;
                case CommitType.Temp:
                    payload.color_temp =
                        this.caps & Capabilities.Temp &&
                        this.temperature.value &&
                        typeof this.temperature.value == "number"
                            ? this.temperature.value
                            : undefined;
                    break;
                case CommitType.Effect:
                    payload.effect =
                        this.caps & Capabilities.Effect &&
                        this.effect &&
                        this.effect_list &&
                        this.effect_list.includes(this.effect)
                            ? this.effect
                            : undefined;
                    break;
                case CommitType.Flash:
                    payload.flash = this.caps & Capabilities.Flash ? this.flash : undefined;
                    break;
                case CommitType.Color:
                    payload.hs_color =
                        this.caps & Capabilities.Color &&
                        this.color.value &&
                        typeof this.color.value != "number"
                            ? this.color.value
                            : undefined;
                    break;
            }
            this.callService(payload);
        }
    }

    protected callService(payload?: LightEntityAttributes): void {
        if (this.hass && this.config?.entity) {
            this.hass.callService("light", payload ? "turn_on" : "toggle", {
                entity_id: this.config.entity,
                ...payload
            });
        }
    }

    public getCardSize(): number {
        return 1;
    }

    public static getStubConfig(): object {
        return { name: "", entity: "" };
    }

    public setConfig(config: FancyLightCardConfig): void {
        if (!config.entity) {
            throw new Error("Please define entity");
        }
        this.config = {
            ...config
        };
    }

    protected shouldUpdate(changedProps: PropertyValues): boolean {
        return hasConfigOrEntityChanged(this, changedProps, false);
    }

    public static async getConfigElement(): Promise<LovelaceCardEditor> {
        return document.createElement("fancy-light-card-editor") as LovelaceCardEditor;
    }

    protected render(): TemplateResult | void {
        if (!this.config || !this.hass) {
            return html``;
        }
        const entity = this.hass.states[this.config.entity];
        if (!entity) {
            throw new Error("Please specify entity");
        }

        const attributes = entity.attributes as LightEntityAttributes;
        const state = entity.state == "on";
        this.parseAttributes(state, attributes);
        let content = html``;

        if (state) {
            content = html`
                <div class="card-content">
                    <div class="fancy-light-card__centered_holder">
                        <div class="fancy-light-card__control_holder">
                            ${this.getColorPicker()} ${this.getBrightnessPicker()}
                            ${this.getTemperaturePicker()}
                        </div>
                        ${this.getFlashControl()} ${this.getEffects()}
                    </div>
                </div>
            `;
        }

        return html`
            <ha-card
                class="fancy-light-card__mdc-theme"
                tabindex="0"
                aria-label=${`Fancy Light: ${this.config.entity}`}
            >
                <div class="card-header fancy-light-card__header">
                    <div>
                        ${this.config.name
                            ? this.config.name
                            : this.hass.states[this.config.entity].attributes.friendly_name}
                    </div>
                    <mwc-switch
                        ?checked=${entity.state == "on"}
                        @change=${(): void => {
                            this.callService();
                        }}
                    ></mwc-switch>
                </div>
                ${content}
            </ha-card>
        `;
    }

    static get styles(): CSSResult {
        return css`
            ${THEME}
            .fancy-light-card__header {
                display: flex;
                justify-content: space-between;
            }
            .picker {
                padding: var(--mdc-button-horizontal-padding, 8px);
            }
            .fancy-light-card__centered_holder {
                display: flex;
                padding: var(--mdc-button-horizontal-padding, 8px);
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }
            .fancy-light-card__control_holder span {
                padding: var(--mdc-button-horizontal-padding, 8px);
            }

            .fancy-light-card__control_holder {
                display: flex;
                padding: var(--mdc-button-horizontal-padding, 8px);
            }
        `;
    }
}

declare global {
    interface Window {
        customCards?: CustomCardDescription[];
    }
}

window.customCards = window.customCards || [];
window.customCards.push({
    type: "fancy-light-card",
    name: "Fancy light card",
    preview: false,
    description: "Fancy light card based on iro.js"
});
