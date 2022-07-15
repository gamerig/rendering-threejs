import { IEngine, Module, SystemPriority } from '@gamerig/core';

import { RENDERING_MODULE_OPTIONS_KEY } from './constants';
import { RenderingModuleOptions } from './RenderingModuleOptions';
import { ScenePlugin } from './scene/ScenePlugin';
import { RenderingSystem } from './system/RenderingSystem';

export class RenderingModule implements Module {
  private _renderingSystem: RenderingSystem;
  private _scenePlugin: ScenePlugin;

  private _options: RenderingModuleOptions;

  init(engine: IEngine): void {
    this._options = engine.settings[RENDERING_MODULE_OPTIONS_KEY];

    this._renderingSystem = new RenderingSystem(this._options);
    engine.addSystem(this._renderingSystem, SystemPriority.HIGH);

    this._scenePlugin = new ScenePlugin(engine);
  }

  destroy(): void {
    this._renderingSystem.destroy();
    this._scenePlugin.dispose();
  }
}
