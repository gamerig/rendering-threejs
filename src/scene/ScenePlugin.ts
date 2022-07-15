import { EventListener, IEngine, Scene, SceneEvent } from '@gamerig/core';
import { Renderer } from '@gamerig/threejs';

import { RENDERER_PROVIDER_KEY } from '../constants';
import { Disposables } from './Disposables';
import { Views } from './Views';

export class ScenePlugin {
  private _listeners: EventListener[] = [];

  constructor(private _engine: IEngine) {
    const renderer = this._engine.resolve<Renderer>(RENDERER_PROVIDER_KEY);

    this._listeners.push(
      this._engine.messaging.subscribe(SceneEvent.Init, (scene: Scene) => {
        Object.defineProperties(scene, {
          renderer: { value: renderer, writable: false },
          disposables: { value: new Disposables(), writable: false },
          views: { value: new Views(), writable: false },
        });
      }),
    );

    this._listeners.push(
      this._engine.messaging.subscribe(SceneEvent.BeforeRender, (scene: Scene) => {
        scene.views.render(renderer);
      }),
    );

    this._listeners.push(
      this._engine.messaging.subscribe(SceneEvent.Stopped, (scene: Scene) => {
        scene.views.dispose();
        scene.disposables.dispose();
      }),
    );

    this._listeners.push(
      this._engine.messaging.subscribe(SceneEvent.Destroyed, (scene: Scene) => {
        scene.views.dispose();
        scene.disposables.dispose();
      }),
    );
  }

  dispose() {
    this._listeners.forEach((listener) => listener.off());
    this._listeners = [];
  }
}
