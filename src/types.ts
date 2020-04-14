import { LitElement } from "lit-element";
import { HomeAssistant, LovelaceCardConfig } from "custom-card-helpers";
import * as HASS from "home-assistant-js-websocket";
import iro from "@jaames/iro";

export type FancyLightCardConfig = {
    type: string;
    name: string;
    entity: string;
};

export type LightEntityAttributes = HASS.HassEntityAttributeBase & {
    brightness?: number;
    color_temp?: number;
    effect?: string;
    flash?: string;
    effect_list?: string[];
    hs_color?: number[];
    max_mireds?: number;
    min_mireds?: number;
    rgb_color?: number[];
    xy_color?: number[];
};

export type FancyLightPicker = {
    div: HTMLElement;
    picker: iro.ColorPicker;
    value?: number | number[];
};

export enum CommitType {
    Brightness,
    Temp,
    Effect,
    Flash,
    Color
}

export enum Capabilities {
    Brightness = 1 << 0,
    Temp = 1 << 1,
    Effect = 1 << 2,
    Flash = 1 << 3,
    Color = 1 << 4,
    Transition = 1 << 5,
    White = 1 << 7
}

export type CustomCardDescription = {
    type: string;
    name: string;
    preview?: boolean; // defaults to false
    description?: string;
};

export type ConfigFieldTarget = EventTarget & {
    configValue: string;
    value: string;
    checked?: boolean;
};

export interface LovelaceCardEditor extends LitElement {
    hass?: HomeAssistant;
    lovelace?: {};
    setConfig(config: LovelaceCardConfig): void;
}

export declare interface ConfigChangedEvent {
    detail: {
        config: FancyLightCardConfig;
    };
}

export class ConfigChangedEvent extends Event {}
