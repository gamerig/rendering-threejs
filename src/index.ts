import { Renderer } from '@gamerig/threejs';

import { Disposables } from './scene/Disposables';
import { Views } from './scene/Views';

/**
 * Core scene augmentation.
 */
declare module '@gamerig/core' {
  interface Scene {
    readonly renderer: Renderer;
    readonly disposables: Disposables;
    readonly views: Views;
  }
}

export * from './constants';
export { RenderingModule } from './RenderingModule';
export { RenderingModuleOptions } from './RenderingModuleOptions';
export { Disposables } from './scene/Disposables';
export { ScenePlugin } from './scene/ScenePlugin';
export { View } from './scene/View';
export { Views } from './scene/Views';
