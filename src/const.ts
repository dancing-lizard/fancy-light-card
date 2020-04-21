import { css } from "lit-element";
import { version, description } from "../package.json";

export const CARD_VERSION = version;
export const CARD_DESCRIPTION = description;

export const THEME = css`
    .fancy-light-card__mdc-theme {
        --mdc-theme-primary: var(--primary-color);
        --mdc-theme-secondary: var(--primary-color);
        --mdc-theme-background: var(
            --ha-card-background,
            var(--paper-card-background-color, white)
        );
        --mdc-theme-surface: var(--primary-background-color);
        --mdc-theme-error: var(--error-color);
        --mdc-theme-text-primary-on-background: var(--primary-text-color);
        --mdc-theme-text-secondary-on-background: var(--primary-text-color);
        --mdc-theme-text-icon-on-background: var(--primary-text-color);
        --mdc-theme-hint-on-background: var(--primary-text-color);

        --mdc-select-fill-color: var(--mdc-theme-background);
        --mdc-select-idle-line-color: var(--primary-text-color);
        --mdc-select-hover-line-color: var(--primary-text-color);

        --mdc-text-field-fill-color: var(--mdc-theme-background);
        --mdc-text-field-idle-line-color: var(--primary-text-color);
        --mdc-text-field-hover-line-color: var(--primary-text-color);
        --mdc-text-field-disabled-line-color: var(--primary-text-color);
        --mdc-text-field-ink-color: var(--primary-text-color);
        --mdc-text-field-label-ink-color: var(--primary-text-color);

        --mdc-select-dropdown-icon-color: var(--primary-text-color);
        --mdc-select-ink-color: var(--primary-text-color);
        --mdc-select-label-ink-color: var(--primary-text-color);

        --mdc-radio-unchecked-color: var(--primary-text-color);
    }
`;
