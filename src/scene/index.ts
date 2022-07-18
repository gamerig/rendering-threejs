import { DisposablesAwareScene, RendererAwareScene, ViewsAwareScene } from './types';

/**
 * Core scene augmentation.
 */
declare module '@gamerig/core' {
  interface Scene extends DisposablesAwareScene, ViewsAwareScene, RendererAwareScene {}
}

export * from './Disposables';
export { ScenePlugin } from './ScenePlugin';
export * from './types';
export { View } from './View';
export { Views } from './Views';
