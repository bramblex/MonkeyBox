import { MonkeyBox } from "./monkey-box";

declare global {
  interface Window {
    __$MonkeyBox__?: MonkeyBox
  }
}

declare var $MonkeyBox: MonkeyBox;
declare const unsafeWindow: Window;
if (typeof unsafeWindow === 'object') {
  unsafeWindow.__$MonkeyBox__ = unsafeWindow.__$MonkeyBox__ || new MonkeyBox();
  $MonkeyBox = unsafeWindow.__$MonkeyBox__
} else {
  window.__$MonkeyBox__ = window.__$MonkeyBox__ || new MonkeyBox();
  $MonkeyBox = window.__$MonkeyBox__;
}

console.log('[MonkeyBoxLoad]:', $MonkeyBox);