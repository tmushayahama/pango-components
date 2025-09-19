import { Config } from "@stencil/core";
import { sass } from "@stencil/sass";

export const config: Config = {
  namespace: "web-components",
  plugins: [sass()],
  outputTargets: [
    {
      type: "dist",
      esmLoaderPath: "../loader",
      copy: [{
        src: 'assets',
        dest: 'assets'
      }]
    },
    {
      type: "dist-custom-elements",
      customElementsExportBehavior: "auto-define-custom-elements",
      externalRuntime: false,
      generateTypeDeclarations: true,
      copy: [{
        src: 'assets',
        dest: 'assets'
      }]
    },
    {
      type: "www",
      serviceWorker: null, // disable service workers
      copy: [{ src: "**/*.html" }, { src: "*.css" },
      {
        src: 'assets',
        dest: 'assets'
      }]
    },
  ],
  extras: {
    enableImportInjection: true,
  },
};
