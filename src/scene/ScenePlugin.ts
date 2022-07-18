import { Engine, EventListener, Scene, SceneEvent } from '@gamerig/core';
import { Renderer } from '@gamerig/threejs';

import { Disposables } from './Disposables';
import { Views } from './Views';

export class ScenePlugin {
  private listeners: EventListener[] = [];

  constructor(readonly engine: Engine, readonly renderer: Renderer) {
    this.listeners.push(
      this.engine.messaging.subscribe(SceneEvent.Init, (scene: Scene) => {
        Object.defineProperties(scene, {
          renderer: { value: renderer, writable: false },
          disposables: { value: new Disposables(), writable: false },
          views: { value: new Views(), writable: false },
        });
      }),
    );

    this.listeners.push(
      this.engine.messaging.subscribe(SceneEvent.BeforeRender, (scene: Scene) => {
        scene.views.render(renderer);
      }),
    );

    this.listeners.push(
      this.engine.messaging.subscribe(SceneEvent.Stopped, (scene: Scene) => {
        scene.views.dispose();
        scene.disposables.dispose();
      }),
    );

    this.listeners.push(
      this.engine.messaging.subscribe(SceneEvent.Destroyed, (scene: Scene) => {
        scene.views.dispose();
        scene.disposables.dispose();
      }),
    );
  }

  dispose() {
    this.listeners.forEach((listener) => listener.off());
    this.listeners = [];
  }
}
