//https://github.com/custom-cards/boilerplate-card/blob/master/src/boilerplate-card.ts

import {
    LitElement,
    html,
    customElement,
    property,
    CSSResult,
    TemplateResult,
    css,
    query,
    PropertyValues,
  } from "lit-element";
  
import { HomeAssistant, hasConfigOrEntityChanged } from "custom-card-helpers";

import { styles } from './styles';

const CARD_TYPE = "test-card";

(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type:  CARD_TYPE, //"test-card",
  name: "Test Card",
  description: "A test-card",
});

class TestCardConfig {
    public show_error?: boolean;
}

class TestCard extends LitElement {

  //@property() public hass?: HomeAssistant;
  private config?: any;
  private _width: number = 100;
  private _height: number = 100;
  private _shadowHeight: number = 1;

  static get properties() {
    return {
      hass: {},
      config: {}
    };
  }

  // public void setConfig(config) {
  //   if (!config.entities) {
  //     throw new Error("You need to define entities");
  //   }
  //   this.config = config;
  // }

  public setConfig(config: TestCardConfig): void {
    if (!config || config.show_error) {
      throw new Error("Invalid configuration");
    }
    this.config = config;
  }

  public getCardSize(): number {
    return 3;//this.config.entities.length + 1;
  }

  static get styles() : CSSResult {
    return styles;
  }

  private getHtmlTimer() : TemplateResult {
    return html`
    <div class="tsm-timer">
      <div class="tsm-timer-number">
        <div class="tsm-timer-number-onoff">OFF</div>
        <div class="tsm-timer-number-n">15</div>
        <div class="tsm-timer-number-repeat">
          <ha-icon icon="mdi:refresh"></ha-icon>
        </div>
      </div>
      <div class="tsm-content">
        <div class="tsm-time">08:00</div>
        <div class="tsm-days">Lun, Mar, Mer, Gio, Ven</div>
      </div>
    </div>
    `;
  }

  protected render(): TemplateResult | void {
    const timers:TemplateResult[] = [];
    for(var i = 0; i < 15; i++)
      timers.push(this.getHtmlTimer());

    return html`
    <ha-card id="cardroot">
      <div class="card-header">Boiler</div>
      <div class="card-content">
        <div class="tsm-timers-status">Timers: ON</div>
        <div class="tsm-timers-container">
        ${timers}
        </div>
      </div>
    </ha-card>
    `;
  }

  
}

customElements.define(CARD_TYPE, TestCard);
