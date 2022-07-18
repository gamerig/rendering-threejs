import { Renderer } from '@gamerig/threejs';

import { View } from './View';

export class Views {
  private _main: View;
  private _list: View[] = [];

  sortViews = true;

  constructor() {
    this._main = new View();
    this._main.order = 0;

    this._list.push(this._main);
  }

  get main(): View {
    return this._main;
  }
  get list(): View[] {
    return this._list;
  }

  render(renderer: Renderer): void {
    if (this.sortViews) {
      this._list.sort((a, b) => a.order - b.order);
      this.sortViews = false;
    }

    for (const view of this._list) {
      view.enabled && renderer.render(view);
    }
  }

  dispose(): void {
    for (const view of this._list) {
      view.clear();
    }

    this._list.length = 0;
    this._main = null;
  }
}
