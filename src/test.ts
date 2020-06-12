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

  import '@material/mwc-dialog';
  //import '@material/mwc-select';
import type { Dialog } from "@material/mwc-dialog";
  
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

class TimerDialog {
  public title: String = '';
  public arm: Boolean = false;
  public repeat: Boolean = false;
  public action: number = 0;
  public time: number = 0;
  public days: Array<number> = [0,0,0,0,0,0,0];
}

class TestCard extends LitElement {

  //@property() public hass?: HomeAssistant;
  private config?: any;
  private _width: number = 100;
  private _height: number = 100;
  private _shadowHeight: number = 1;

  @property({type: TimerDialog}) private editTimerDlg = new TimerDialog();
  //@property({type: String}) private editTimerDlg_title = '';
  //@property({type: Boolean}) private editTimerDlg_arm = false;
  //@property({type: Array}) private editTimerDlg_days : Array<number> = [];

  // static get properties() {
  //   return {
  //     hass: {},
  //     config: {},
  //     editTimerDlg: {}
  //   };
  // }

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
    if (this.shadowRoot != null){
      const dialog : Dialog | null = this.shadowRoot.querySelector('#edit-timer-dlg');
      if (dialog) {
        this.editTimerDlg = {
          title: 'Timer ' + i,
          arm: true,
          repeat: false,
          action: 0,
          time: 8*60,
          days: [1,0,1,0,1,0,1]
        }
        dialog.open = true;
        //this.requestUpdate();
      }
    }
  }

  protected render(): TemplateResult | void {
    const timers:TemplateResult[] = [];
    for(var i = 0; i < 15; i++) {
      timers.push(this.getHtmlTimer(i));
    }

    var editTimerDialog = this._getHtmlEditTimerDialog();

    return html`
    <ha-card id="cardroot">
      <div class="card-header">Boiler</div>
      <div class="card-content">
        <div class="tsm-timers-status">Timers: ON</div>
        <div class="tsm-timers-container">
        ${timers}
        </div>
      </div>
      ${editTimerDialog}
    </ha-card>
    `;
  }

  private _getHtmlEditTimerDialog():TemplateResult {
    return html`
    <mwc-dialog id="edit-timer-dlg" heading="${this.editTimerDlg.title}" class="edit-timer-dlg">

      <div class="">Abilitato: 
        <ha-switch style="float:right" 
          @change=${this.onEditDlgArm}
          .checked=${this.editTimerDlg.arm} />
      </div>

      <div>Ripeti: 
        <ha-switch style="float:right" 
          @change=${this.onEditDlgRepeat}
          .checked=${this.editTimerDlg.repeat} />
      </div>

      <div>Ora: 
        <select style="float: right;border-color: lightgray;border-radius: 5px;font-size: 1em;"
          @change=${this.onEditDlgTime}
          >
          ${[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23]
            .map(i => html`<option value="${i*60}" ?selected=${this.editTimerDlg.time == i*60}>${i}:00</option>`)}
        </select>
      </div>

      <div>Azione: 
        <select style="float: right;border-color: lightgray;border-radius: 5px;font-size: 1em;"
          @change=${this.onEditDlgAction}
          >
        <option value="1" ?selected=${this.editTimerDlg.action == 1}>Accendi</option>
        <option value="0" ?selected=${this.editTimerDlg.action == 0}>Spegni</option>
        </select>
      </div>

      <div>Giorni:</div>
        <div>
        ${['Dom','Lun','Mar','Mer','Gio','Ven','Sab']
        .map((day,index) => html`
          <input type="checkbox" 
            .checked=${this.editTimerDlg.days[index]} 
            @click=${() => this.toggleCheck(index)} />${day} 
        `)}
        </div>
      <mwc-button slot="primaryAction" dialogAction="ok" @click="${this.confirmTimer}">Ok</mwc-button>
      <mwc-button slot="secondaryAction" dialogAction="cancel">Annulla</mwc-button>
    </mwc-dialog>
    `;
  }

  private toggleCheck(i) {
    this.editTimerDlg.days[i] = this.editTimerDlg.days[i] ? 0 : 1;
    this.requestUpdate();
  }

  private onEditDlgArm() {
    this.editTimerDlg.arm = !this.editTimerDlg.arm;
    this.requestUpdate();
  }

  private onEditDlgRepeat() {
    this.editTimerDlg.repeat = !this.editTimerDlg.repeat;
    this.requestUpdate();
  }

  private onEditDlgTime(e) {
    var a :HTMLSelectElement = e.target;
    this.editTimerDlg.time = parseInt(a.value);
    this.requestUpdate();
  }

  private onEditDlgAction(e) {
    var a :HTMLSelectElement = e.target;
    this.editTimerDlg.action = parseInt(a.value);
    this.requestUpdate();
  }

  private confirmTimer() {
    //console.info(this.editTimerDlg_title, e);
    console.info(this.editTimerDlg.arm, this.editTimerDlg.repeat, this.editTimerDlg.action, this.editTimerDlg.time, this.editTimerDlg.days);
  }
  
}

customElements.define(CARD_TYPE, TestCard);
