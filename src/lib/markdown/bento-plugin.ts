/* eslint-disable @typescript-eslint/no-explicit-any */
import { visit } from 'unist-util-visit';
import type { Root, Node, Parent, Link, Paragraph } from 'mdast';

const isVideoUrl = (url: string) => /\.(mp4|webm|ogg|mov)($|\?)/i.test(url);

const isMediaNode = (node: Node): boolean => {
  if (node.type === 'image') return true;
  if (node.type === 'link') {
    return isVideoUrl((node as Link).url);
  }
  return false;
};

const isMediaParagraph = (node: Node): boolean => {
  if (node.type !== 'paragraph') return false;
  const p = node as Paragraph;
  return p.children.length === 1 && isMediaNode(p.children[0]);
};

export function remarkAutoBento() {
  return (tree: Root) => {
    visit(tree, (node: any) => {
      if (!node.children) return;

      if (
        node.type === 'containerDirective' &&
        ['bento', 'dual-grid', 'bento-grid'].includes(node.name)
      ) {
        return;
      }

      const parent = node as Parent;
      const newChildren: any[] = [];
      let mediaBuffer: any[] = [];

      const flushBuffer = () => {
        if (mediaBuffer.length === 0) return;

        if (mediaBuffer.length === 2) {
          const dualNode: any = {
            type: 'containerDirective',
            name: 'dual-grid',
            data: {
              hName: 'div',
              hProperties: { className: 'dual-grid' },
            },
            children: [...mediaBuffer],
          };
          newChildren.push(dualNode);
        } else if (mediaBuffer.length >= 3) {
          const bentoNode: any = {
            type: 'containerDirective',
            name: 'bento',
            data: {
              hName: 'div',
              hProperties: { className: 'bento-grid' },
            },
            children: [...mediaBuffer],
          };
          newChildren.push(bentoNode);
        } else {
          newChildren.push(...mediaBuffer);
        }

        mediaBuffer = [];
      };

      for (const child of parent.children) {
        if (isMediaNode(child)) {
          mediaBuffer.push(child);
          continue;
        }

        if (isMediaParagraph(child)) {
          mediaBuffer.push((child as Paragraph).children[0]);
          continue;
        }

        flushBuffer();
        newChildren.push(child);
      }

      flushBuffer();
      parent.children = newChildren;
    });
  };
}
