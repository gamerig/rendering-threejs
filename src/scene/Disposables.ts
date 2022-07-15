import { Material, Mesh, Object3D, ShaderMaterial, Texture } from 'three';

/**
 * Generic interface used to mark scene objects as disposable
 */
export interface Disposable {
  dispose(): void;
}

export const isDisposable = (obj: any): obj is Disposable => {
  return obj && typeof obj.dispose === 'function';
};

/**
 * Track scene disposable resources and dispose them when the scene does not need them anymore
 * This is a helper to avoid too much boilerplate code if this is a frequent use case
 * Use it wisely, there is one injected by default in each scene
 */
export class Disposables {
  private _set: Set<Disposable> = new Set();

  /**
   * Track disposable resources, handling also lists and nested child objects
   * as well as specific three.js objects
   *
   * @param resource
   * @returns
   */
  track = <T = any>(resource: T): T => {
    if (!resource) {
      return resource;
    }

    if (Array.isArray(resource)) {
      resource.forEach(this.track);
      return resource;
    }

    if (resource instanceof Mesh) {
      this.track(resource.geometry);
      this.track(resource.material);
    }

    if (resource instanceof Material) {
      for (const value of Object.values(resource)) {
        if (value instanceof Texture) {
          this.track(value);
        }
      }
    }

    if (resource instanceof ShaderMaterial) {
      for (const value of Object.values(resource.uniforms)) {
        if (value) {
          const uniformValue = value.value;
          if (uniformValue instanceof Texture || Array.isArray(uniformValue)) {
            this.track(uniformValue);
          }
        }
      }
    }

    if (resource instanceof Object3D) {
      this.track(resource.children);
    }

    if (isDisposable(resource)) {
      this._set.add(resource);
    }

    return resource;
  };

  untrack = (resource: any): void => {
    this._set.delete(resource);
  };

  dispose = (): void => {
    this._set.forEach((resource) => {
      if (resource instanceof Object3D) {
        if (resource.parent) {
          resource.parent.remove(resource);
        }
      }

      resource.dispose();
    });

    this._set.clear();
  };
}
