import { IEngine, System } from '@gamerig/core';
import { Renderer, RendererEvent, WebGLRenderer } from '@gamerig/threejs';

import { RENDERER_PROVIDER_KEY } from '../constants';
import { RenderingModuleOptions } from '../RenderingModuleOptions';

export class RenderingSystem extends System {
  private _engine: IEngine;

  private _renderer: Renderer;

  constructor(private readonly _options: RenderingModuleOptions) {
    super();
  }

  init(engine: IEngine): void {
    this._engine = engine;

    this._renderer = new WebGLRenderer(this._options.renderer);

    this._renderer.addEventListener(RendererEvent.CanvasResized, this._onCanvasResized);
    this._renderer.addEventListener(RendererEvent.AspectChanged, this._onAspectChanged);
    this._renderer.addEventListener(RendererEvent.ResolutionChanged, this._onResolutionChanged);

    engine.addProvider({
      key: RENDERER_PROVIDER_KEY,
      useValue: this._renderer,
    });
  }

  private _onCanvasResized = (...args: any[]): void => {
    this._engine.messaging.publish(RendererEvent.CanvasResized, ...args);
  };

  private _onAspectChanged = (...args: any[]): void => {
    this._engine.messaging.publish(RendererEvent.AspectChanged, ...args);
  };

  private _onResolutionChanged = (...args: any[]): void => {
    this._engine.messaging.publish(RendererEvent.ResolutionChanged, ...args);
  };

  update(): void {
    this._renderer.update?.();
  }

  render(): void {
    if (this._renderer.autoClear) {
      this._renderer.clear();
    }
  }

  destroy(): void {
    this._renderer.removeEventListener(RendererEvent.CanvasResized, this._onCanvasResized);
    this._renderer.removeEventListener(RendererEvent.AspectChanged, this._onAspectChanged);
    this._renderer.removeEventListener(RendererEvent.ResolutionChanged, this._onResolutionChanged);

    this._renderer.clear();
    this._renderer.dispose();
  }
}
