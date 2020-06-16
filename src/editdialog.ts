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


//import { popUp, closePopUp } from "card-tools/src/popup";

import { editDialogStyle } from './styles';
import { closePopUp } from "./popup";

export const CARD_TYPE = "test-dialog-card";

(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type:  CARD_TYPE,
  name: "Test Card",
  description: "A test-card",
});


export class TimerDialogConfig {
  public arm: Boolean = false;
  public repeat: Boolean = false;
  public action: number = 0;
  public time: number = 0;
  public days: Array<number> = [0,0,0,0,0,0,0];
}

class TestDialogCard extends LitElement {

  @property()
  private config: TimerDialogConfig = new TimerDialogConfig();

  public setConfig(config: TimerDialogConfig): void {
    this.config = config;
  }

  static get styles() : CSSResult {
    return editDialogStyle;
  }
  
  protected render(): TemplateResult | void {
    return html`
    <div id="edit-timer-dlg" class="edit-timer-dlg">

      <div class="">Abilitato: 
        <ha-switch style="float:right" 
          @change=${this.onEditDlgArm}
          .checked=${this.config.arm} />
      </div>

      <div>Ripeti: 
        <ha-switch style="float:right" 
          @change=${this.onEditDlgRepeat}
          .checked=${this.config.repeat} />
      </div>

      <div>Ora: 
        <select style="float: right;border-color: lightgray;border-radius: 5px;font-size: 1em;"
          @change=${this.onEditDlgTime}
          >
          ${[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23]
            .map(i => html`<option value="${i*60}" ?selected=${this.config.time == i*60}>${i}:00</option>`)}
        </select>
      </div>

      <div>Azione: 
        <select style="float: right;border-color: lightgray;border-radius: 5px;font-size: 1em;"
          @change=${this.onEditDlgAction}
          >
        <option value="1" ?selected=${this.config.action == 1}>Accendi</option>
        <option value="0" ?selected=${this.config.action == 0}>Spegni</option>
        </select>
      </div>

      <div>Giorni:</div>
        <div>
        ${['Dom','Lun','Mar','Mer','Gio','Ven','Sab']
        .map((day,index) => html`
          <input type="checkbox" 
            .checked=${this.config.days[index]} 
            @click=${() => this.toggleCheck(index)} />${day} 
        `)}
        </div>
        <div class="actions">
      <mwc-button slot="primaryAction" dialogAction="ok" @click="${this.confirmTimer}">Ok</mwc-button>
      <mwc-button slot="secondaryAction" dialogAction="cancel" @click="${closePopUp}">Annulla</mwc-button>
      </div>
    </div>
    `;
  }

  private toggleCheck(i) {
    this.config.days[i] = this.config.days[i] ? 0 : 1;
    this.requestUpdate();
  }

  private onEditDlgArm() {
    this.config.arm = !this.config.arm;
    this.requestUpdate();
  }

  private onEditDlgRepeat() {
    this.config.repeat = !this.config.repeat;
    this.requestUpdate();
  }

  private onEditDlgTime(e) {
    var a :HTMLSelectElement = e.target;
    this.config.time = parseInt(a.value);
    this.requestUpdate();
  }

  private onEditDlgAction(e) {
    var a :HTMLSelectElement = e.target;
    this.config.action = parseInt(a.value);
    this.requestUpdate();
  }

  private confirmTimer() {
    //console.info(this.editTimerDlg_title, e);
    console.info(this.config.arm, this.config.repeat, this.config.action, this.config.time, this.config.days);
    closePopUp();
  }
  
}

customElements.define(CARD_TYPE, TestDialogCard);
