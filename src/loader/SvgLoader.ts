import { LoaderPlugin, LoaderResource, LoadType, XhrResponseType } from '@gamerig/resource-loader';
import { DoubleSide, Group, Mesh, MeshBasicMaterial, ShapeGeometry } from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';

export class SvgLoader implements LoaderPlugin {
  init(): void {
    LoaderResource.setExtensionLoadType('svg', LoadType.XHR);
    LoaderResource.setExtensionXhrType('svg', XhrResponseType.TEXT);
  }

  use(resource: LoaderResource, next: (...args: any[]) => void): void {
    if (!resource.data || resource.extension !== 'svg') {
      next();
      return;
    }

    const loader = new SVGLoader();
    const data = loader.parse(resource.data);

    const paths = data.paths;
    const group = new Group();

    for (let i = 0; i < paths.length; i++) {
      const path = paths[i];

      const material = new MeshBasicMaterial({
        color: path.color,
        side: DoubleSide,
        depthWrite: false,
      });

      const shapes = SVGLoader.createShapes(path);

      for (let j = 0; j < shapes.length; j++) {
        const shape = shapes[j];
        const geometry = new ShapeGeometry(shape);
        const mesh = new Mesh(geometry, material);
        group.add(mesh);
      }
    }

    resource.svg = group;
    next();
  }
}
