import eve from 'eve-raphael';

type BrowserRequire = (id: string) => unknown;

type RaphaelWindow = Window & {
  eve?: unknown;
  require?: BrowserRequire;
};

const installRaphaelBrowserGlobals = () => {
  if (typeof window === 'undefined') return;

  const browserWindow = window as RaphaelWindow;
  browserWindow.eve ??= eve;

  if (typeof browserWindow.require === 'function') return;

  browserWindow.require = (id: string) => {
    if (id === 'eve' || id === 'eve-raphael') {
      return browserWindow.eve ?? eve;
    }

    throw new Error(`Unsupported browser require("${id}") from Raphael.`);
  };
};

installRaphaelBrowserGlobals();
