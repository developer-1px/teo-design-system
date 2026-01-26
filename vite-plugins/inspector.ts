export const inspectorPlugin = () => ({
  name: 'custom-inspector',
  transformIndexHtml() {
    return [{
      tag: 'script',
      injectTo: 'body' as const,
      attrs: {
        type: 'module',
        src: '/vite-plugins/component-inspector/ui/client.tsx'
      }
    }];
  }
});
