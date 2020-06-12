import { css } from 'lit-element';
export const styles = css`

.tsm-timers-status {
}

.tsm-timers-container {
  xborder:1px solid #aaa;
}

.tsm-timer {
  border:1px solid #aaa;
  background-color: #d4ebff;
  height: 3em;
  position: relative;
}

.tsm-timer-number {
  width: 3em;
  background-color: yellow;
  border: 1px solid #555;
  height: 100%;
  align-content: center;
  position: relative;
  vertical-align: middle;
  float: left;
  margin: 0 5px 0 0;
}

.tsm-timer-number-n {
  padding: 10px 0 0 7px;
}

.tsm-timer-number-onoff {
  position: absolute;
  right: 1px;
  top: -3px;
  font-size: 10px;
}

.tsm-timer-number-repeat {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 15px;
}

.tsm-timer-edit-btn {
  position: absolute;
  right: 0;
  top:0.5em;
  width:26px;
  color: #03a9f4;
}

ha-icon {
  display: inline-block;
  margin: auto;
  --mdc-icon-size: 100%;
  --iron-icon-width: 100%;
  --iron-icon-height: 100%;
}

.tsm-time {

}
.tsm-days {
  font-size: x-small;
}

.edit-timer-dlg > div {
  padding: 0.5em 0;
}
`;

export default styles;