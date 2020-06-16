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

  import "./editdialog";
  import { TimerDialogConfig, CARD_TYPE as CARD_DIALOG_TYPE } from "./editdialog";

import { popUp, closePopUp } from "card-tools/src/popup";
  
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

  @property() 
  config: TestCardConfig = {};

  public setConfig(config: TestCardConfig): void {
    if (!config || config.show_error) {
      throw new Error("Invalid configuration");
    }
    this.config = config;
  }

  static get styles() : CSSResult {
    return styles;
  }


  protected render(): TemplateResult | void {
    const timers:TemplateResult[] = [];
    for(var i = 0; i < 15; i++) {
      timers.push(this.getHtmlTimer(i));
    }

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
  
  private getHtmlTimer(i:number) : TemplateResult {
    return html`
    <div class="tsm-timer">
      <div class="tsm-timer-number">
        <div class="tsm-timer-number-onoff">OFF</div>
        <div class="tsm-timer-number-n">${i}</div>
        <div class="tsm-timer-number-repeat">
          <ha-icon icon="mdi:refresh"></ha-icon>
        </div>
      </div>
      <div class="tsm-content">
        <div class="tsm-time">08:00</div>
        <div class="tsm-days">Lun, Mar, Mer, Gio, Ven</div>
      </div>
      <div class="tsm-timer-edit-btn">
        <ha-icon icon="mdi:pencil" @click="${()=>this.onEditTimer(i)}"></ha-icon>
      </div>
    </div>
    `;
  }

  private onEditTimer(i:number) {
    var dialogConfig : TimerDialogConfig = {
      arm: true,
      repeat: false,
      action: 0,
      time: 8*60,
      days: [1,0,1,0,1,0,1],
    }

    popUp('Timer ' + i, {
      type: `custom:${CARD_DIALOG_TYPE}`,
      ...dialogConfig
      });
  }

}

customElements.define(CARD_TYPE, TestCard);
