import { LoaderPlugin, LoaderResource, ResourceType } from '@gamerig/resource-loader';
import { GlobalTextureManager, Texture } from '@gamerig/threejs';

export class TextureLoader implements LoaderPlugin {
  use(resource: LoaderResource, next: (...args: any[]) => void): void {
    // create a new texture if the data is an Image object
    // SVG's are treated differently by their own loader
    if (resource.data && resource.type === ResourceType.IMAGE && resource.extension !== 'svg') {
      const { data, url, name } = resource;

      const texture = new Texture(data);
      resource.texture = texture;

      GlobalTextureManager.add(url, texture);
      GlobalTextureManager.add(texture.uuid, texture);
      GlobalTextureManager.add(name, texture);

      next();
    } else {
      next();
    }
  }
}
