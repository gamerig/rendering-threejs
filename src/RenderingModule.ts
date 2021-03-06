import { Engine, Module, SystemPriority } from '@gamerig/core';
import { WebGLRenderer } from '@gamerig/threejs';

import { RENDERER_PROVIDER } from './constants';
import { SpritesheetLoader } from './loader/SpritesheetLoader';
import { SvgLoader } from './loader/SvgLoader';
import { TextureLoader } from './loader/TextureLoader';
import { RenderingModuleOptions } from './RenderingModuleOptions';
import { ScenePlugin } from './scene';
import { RenderingSystem } from './system/RenderingSystem';

export class RenderingModule implements Module {
  private renderingSystem: RenderingSystem;
  private scenePlugin: ScenePlugin;

  constructor(readonly options: RenderingModuleOptions) {}

  init(engine: Engine): void {
    const renderer = new WebGLRenderer(this.options.renderer);
    engine.registerProvider({ key: RENDERER_PROVIDER, useValue: renderer });

    this.renderingSystem = new RenderingSystem(renderer);

    Engine.registerSystem(this.renderingSystem, { priority: SystemPriority.HIGH });

    this.scenePlugin = new ScenePlugin(engine, renderer);

    import('@gamerig/resource-loader')
      .then((module) => {
        module.Loader.registerPlugin(new TextureLoader());
        module.Loader.registerPlugin(new SvgLoader());
        module.Loader.registerPlugin(new SpritesheetLoader());
      })
      .catch(() => {
        //noop
      });
  }

  destroy(): void {
    this.renderingSystem.destroy();
    this.scenePlugin.dispose();
  }
}
