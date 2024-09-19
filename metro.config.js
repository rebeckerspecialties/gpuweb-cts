const { makeMetroConfig } = require('@rnx-kit/metro-config');
module.exports = makeMetroConfig({
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
    unstable_AllowRequireContext: true,
  },
  resolver: {
    resolveRequest: (context, rawModuleName, platform) => {
      let moduleName = rawModuleName;

      // Resolve fully specified TS imports by stripping extension
      const isPackage = !moduleName.startsWith('.') && !moduleName.startsWith('/');
      const isJsOrJsxFile =
        !isPackage && (moduleName.endsWith('.js') || moduleName.endsWith('.jsx'));
      if (isJsOrJsxFile) moduleName = moduleName.replace(/\.[^/.]+$/, '');

      return context.resolveRequest(context, moduleName, platform);
    },
  },
});
