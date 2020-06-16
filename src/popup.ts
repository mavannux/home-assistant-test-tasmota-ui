import { fireEvent } from "card-tools/src/event";
import { LitElement, TemplateResult } from "lit-element";
// import { provideHass } from "./hass";
// import { createCard } from "./lovelace-element";
// import "./lovelace-element";

interface MyElement extends Element {
    large: boolean;
    _page: string|null;
    style: CSSStyleDeclaration;
    _dialogOpenChanged: (newVal: any) => void;
    stateObj: any;
    fire(arg0: string, arg1: { entityId: null; });
    sizingTarget: Element | null;
    _moreInfoEl: Element | null;
    close();
    open();
    resetFit();
    readonly shadowRoot: ShadowRoot | null;
}

export function closePopUp() {
  const root = <MyElement>(document.querySelector("hc-main") || document.querySelector("home-assistant"));
  const moreInfoEl = <MyElement>(root && root._moreInfoEl);
  if(moreInfoEl)
    moreInfoEl.close();
}

export function popUp(title, card:TemplateResult, large=false, style : string|null = null, fullscreen=false) {
  const root = <MyElement>(document.querySelector("hc-main") || document.querySelector("home-assistant"));
  // Force _moreInfoEl to be loaded
  fireEvent("hass-more-info", {entityId: null}, root);
  const moreInfoEl = <MyElement>root._moreInfoEl;
  // Close and reopen to clear any previous styling
  // Necessary for popups from popups
  moreInfoEl.close();
  moreInfoEl.open();

  const oldContent = <LitElement>moreInfoEl.shadowRoot?.querySelector("more-info-controls");
  if(oldContent) oldContent.style['display'] = 'none';

  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
  <style>
    app-toolbar {
      color: var(--more-info-header-color);
      background-color: var(--more-info-header-background);
    }
    .scrollable {
      overflow: auto;
      max-width: 100% !important;
    }
    ${style}
  </style>
  ${fullscreen
    ? ``
    : `
      <app-toolbar>
        <ha-icon-button
          icon="hass:close"
          dialog-dismiss=""
          aria-label="Dismiss dialog"
        ></ha-icon-button>
        <div class="main-title" main-title="">
          ${title}
        </div>
      </app-toolbar>
      `
    }
    <div class="scrollable">
    </div>
  `;

  const scroll = <Element>wrapper.querySelector(".scrollable");
  const content = document.createElement('div');
  content.innerHTML = card.getHTML();//createCard(card);
  //provideHass(content);
  scroll.appendChild(content);

  // content.addEventListener(
  //   "ll-rebuild",
  //   (ev) => {
  //     ev.stopPropagation();
  //     //const newContent = createCard(card);
  //     //provideHass(newContent);
  //     //scroll?.replaceChild(newContent, content);
  //   },
  //   { once: true}
  // );

  moreInfoEl.sizingTarget = scroll;
  moreInfoEl.large = large;
  moreInfoEl._page = "none"; // Display nothing by default
  moreInfoEl.shadowRoot?.appendChild(wrapper);

  let oldStyle = {};
  // if(style) {
  //   moreInfoEl.resetFit(); // Reset positioning to enable setting it via css
  //   for (var k in style) {
  //     oldStyle[k] = moreInfoEl.style[k];
  //     moreInfoEl.style.setProperty(k, style[k]);
  //   }
  // }

  moreInfoEl._dialogOpenChanged = function(newVal) {
    if (!newVal) {
      if(this.stateObj)
        this.fire("hass-more-info", {entityId: null});

      if (this.shadowRoot == wrapper.parentNode) {
        this._page = null;
        this.shadowRoot?.removeChild(wrapper);

        const oldContent = <MyElement>this.shadowRoot?.querySelector("more-info-controls");
        if(oldContent) oldContent.style['display'] = "inline";

        // if(style) {
        //   moreInfoEl.resetFit();
        //   for (var k in oldStyle)
        //     if (oldStyle[k])
        //       moreInfoEl.style.setProperty(k, oldStyle[k]);
        //     else
        //       moreInfoEl.style.removeProperty(k);
        // }
      }
    }
  }

  return moreInfoEl;
}