import { Engine, System } from '@gamerig/core';
import { Renderer, RendererEvent } from '@gamerig/threejs';
import { Event } from 'three';

export class RenderingSystem implements System {
  private engine: Engine;

  constructor(readonly renderer: Renderer) {}

  init(engine: Engine): void {
    this.engine = engine;

    this.renderer.addEventListener(RendererEvent.CanvasResized, this._onCanvasResized);
    this.renderer.addEventListener(RendererEvent.AspectChanged, this._onAspectChanged);
    this.renderer.addEventListener(RendererEvent.ResolutionChanged, this._onResolutionChanged);
  }

  private _onCanvasResized = (e: Event): void => {
    this.engine.messaging.publish(e.type, e.target, e.data.width, e.data.height);
  };

  private _onAspectChanged = (e: Event): void => {
    this.engine.messaging.publish(e.type, e.target, e.data.aspect);
  };

  private _onResolutionChanged = (e: Event): void => {
    this.engine.messaging.publish(e.type, e.target, e.data.width, e.data.height);
  };

  update(): void {
    this.renderer.update?.();
  }

  render(): void {
    if (this.renderer.autoClear) {
      this.renderer.clear();
    }
  }

  destroy(): void {
    this.renderer.removeEventListener(RendererEvent.CanvasResized, this._onCanvasResized);
    this.renderer.removeEventListener(RendererEvent.AspectChanged, this._onAspectChanged);
    this.renderer.removeEventListener(RendererEvent.ResolutionChanged, this._onResolutionChanged);

    this.renderer.clear();
    this.renderer.dispose();
  }
}
