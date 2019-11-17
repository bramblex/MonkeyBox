declare global {
  interface Window {
    $MonkeyBox: MonkeyBox
  }
}

declare const unsafeWindow: Window;

import { MonkeyBox } from "./monkey-box";

if (typeof unsafeWindow === 'object') {
  unsafeWindow.$MonkeyBox = unsafeWindow.$MonkeyBox || new MonkeyBox();
} else {
  window.$MonkeyBox = window.$MonkeyBox || new MonkeyBox();
}
