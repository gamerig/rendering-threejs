import { Loader, LoaderPlugin, LoaderResource, ResourceType, url } from '@gamerig/resource-loader';
import { SpritesheetFactory } from '@gamerig/threejs';

export class SpritesheetLoader implements LoaderPlugin {
  use(resource: LoaderResource, next: (...args: unknown[]) => void): void {
    const loader = this as any as Loader;
    const imageResourceName = `${resource.name}_image`;

    // skip if no data, its not json, it isn't spritesheet data
    if (!resource.data || resource.type !== ResourceType.JSON || !resource.data.frames) {
      next();

      return;
    }

    // short cicuit creation if image is already loaded
    if (loader.resources[imageResourceName]) {
      const texture = loader.resources[imageResourceName].texture;
      const spritesheet = SpritesheetFactory.fromJson(texture, resource.data);
      resource.spritesheet = spritesheet;
      resource.textures = spritesheet.textures;
      resource.animations = spritesheet.animations;

      next();
      return;
    }

    const loadOptions = {
      crossOrigin: resource.crossOrigin,
      metadata: resource.metadata.imageMetadata,
      parentResource: resource,
    };

    const resourcePath = SpritesheetLoader.getResourcePath(resource, loader.baseUrl);

    // load the image for this sheet
    loader.add(
      imageResourceName,
      resourcePath,
      loadOptions,
      function onImageLoad(res: LoaderResource) {
        if (res.error) {
          next(res.error);

          return;
        }

        const spritesheet = SpritesheetFactory.fromJson(res.data.texture, resource.data);
        resource.spritesheet = spritesheet;
        resource.textures = spritesheet.textures;
        resource.animations = spritesheet.animations;

        next();
      },
    );
  }

  static getResourcePath(resource: LoaderResource, baseUrl: string): string {
    // Prepend url path unless the resource image is a data url
    if (resource.isDataUrl) {
      return resource.data.meta.image;
    }

    return url.resolve(resource.url.replace(baseUrl, ''), resource.data.meta.image);
  }
}
