import { Renderer } from '@gamerig/threejs';

/**
 * Core scene augmentation.
 */
declare module '@gamerig/core' {
  interface Scene {
    //readonly views: ViewManager;
    readonly renderer: Renderer;
  }
}
