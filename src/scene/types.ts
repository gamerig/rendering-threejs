import { Renderer } from '@gamerig/threejs';

import { Disposables } from './Disposables';
import { Views } from './Views';

export interface RendererAwareScene {
  renderer: Renderer;
}

export interface DisposablesAwareScene {
  disposables: Disposables;
}

export interface ViewsAwareScene {
  views: Views;
}
