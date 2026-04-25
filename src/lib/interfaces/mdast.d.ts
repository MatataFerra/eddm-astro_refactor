import 'mdast';

declare module 'mdast' {
  interface RootContentMap {
    containerDirective: ContainerDirective;
  }

  interface ContainerDirective extends Parent {
    type: 'containerDirective';
    name: string;
    attributes?: Record<string, string>;
    data?: {
      hName?: string;
      hProperties?: Record<string, any>;
    };
  }
}
