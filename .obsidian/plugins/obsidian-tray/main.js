/* obsidian-tray v0.1.2
   by @dragonwocky */

"use strict";

let tray;
const obsidian = require("obsidian"),
  { app, BrowserWindow, globalShortcut, Tray, Menu, nativeImage } = require("electron").remote;

const showWindows = () => {
    console.log("obsidian-tray: showing windows");
    const windows = BrowserWindow.getAllWindows(),
      currentWindow = windows.find((win) => win.isFocused()) || windows[0];
    windows.forEach((win) => win.show());
    currentWindow.focus();
  },
  hideWindows = (runInBackground) => {
    console.log("obsidian-tray: hiding windows");
    const windows = BrowserWindow.getAllWindows();
    windows.forEach((win) => [
      win.isFocused() && win.blur(),
      runInBackground ? win.hide() : win.minimize(),
    ]);
  },
  toggleWindows = (runInBackground, checkForFocus = true) => {
    const windows = BrowserWindow.getAllWindows();
    if (windows.some((win) => (!checkForFocus || win.isFocused()) && win.isVisible())) {
      hideWindows(runInBackground);
    } else showWindows();
  };

const onWindowClose = (event) => {
    event.stopImmediatePropagation();
    console.log("obsidian-tray: intercepting window close");
    const windows = BrowserWindow.getAllWindows(),
      currentWindow = windows.find((win) => win.isFocused());
    currentWindow.hide();
  },
  interceptWindowClose = () => {
    const closeBtn = document.querySelector(".mod-close");
    closeBtn.addEventListener("click", onWindowClose, true);
  },
  cleanupWindowClose = () => {
    const closeBtn = document.querySelector(".mod-close");
    closeBtn.removeEventListener("click", onWindowClose, true);
  };

const setLaunchOnStartup = (plugin) => {
    app.setLoginItemSettings({
      openAtLogin: plugin.settings.launchOnStartup,
      openAsHidden: plugin.settings.runInBackground,
    });
  },
  relaunchObsidian = () => {
    app.relaunch();
    app.exit(0);
  };

const createTrayIcon = (plugin) => {
  console.log("obsidian-tray: creating tray icon");
  const obsidianIcon = nativeImage.createFromDataURL(
      // 32x32 base64 obsidian icon: generated from obsidian.asar/icon.png
      `data:image/png;base64,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zmq5ypr35C8M5rXlNNdpDiOORSSQhAgZVWygDAsRWjVSTKRoP+bhH3L8SXLJ5NoAI8c8KlAhOX7wP/jdrVmYnHCTgjGg88W2P0aBwC7QqNn297FtN04A/zNwpbX8lTow80l6raWFj4C+beDiuqXJe8DlDjD4pEuG5Eh+mkKhALyf0TflgP5boHvV7a25j9MHIENdLd0AB4fAWJGy1zze3dXe279nmv39ALsKcsQmQdRzAAANdmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNC40LjAtRXhpdjIiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iCiAgICB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIgogICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICAgeG1sbnM6R0lNUD0iaHR0cDovL3d3dy5naW1wLm9yZy94bXAvIgogICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgIHhtcE1NOkRvY3VtZW50SUQ9ImdpbXA6ZG9jaWQ6Z2ltcDo1YjcxZmY2My00MjdkLTRiZGUtYTFlMy03N2I1Y2RhMmFhZGUiCiAgIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NWNiNzI1ODUtZWMzZS00ZTYwLWJhOGYtNjg1OTQzZmUyOGMzIgogICB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6NDNkMzg3Y2YtNDM4OC00MWEzLWE1YTUtOThlYjU3N2FhNTA2IgogICBkYzpGb3JtYXQ9ImltYWdlL3BuZyIKICAgR0lNUDpBUEk9IjIuMCIKICAgR0lNUDpQbGF0Zm9ybT0iV2luZG93cyIKICAgR0lNUDpUaW1lU3RhbXA9IjE2NjkxNzQ2NzI4MjQ5OTEiCiAgIEdJTVA6VmVyc2lvbj0iMi4xMC4zMiIKICAgdGlmZjpPcmllbnRhdGlvbj0iMSIKICAgeG1wOkNyZWF0b3JUb29sPSJHSU1QIDIuMTAiCiAgIHhtcDpNZXRhZGF0YURhdGU9IjIwMjI6MTE6MjNUMTQ6Mzc6NTIrMTE6MDAiCiAgIHhtcDpNb2RpZnlEYXRlPSIyMDIyOjExOjIzVDE0OjM3OjUyKzExOjAwIj4KICAgPHhtcE1NOkhpc3Rvcnk+CiAgICA8cmRmOlNlcT4KICAgICA8cmRmOmxpCiAgICAgIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiCiAgICAgIHN0RXZ0OmNoYW5nZWQ9Ii8iCiAgICAgIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6YjM5Y2I1N2EtM2IzYy00MzNhLWE4MGUtOWViMzk3ZGVmOWZiIgogICAgICBzdEV2dDpzb2Z0d2FyZUFnZW50PSJHaW1wIDIuMTAgKFdpbmRvd3MpIgogICAgICBzdEV2dDp3aGVuPSIyMDIyLTExLTIzVDE0OjM3OjUyIi8+CiAgICA8L3JkZjpTZXE+CiAgIDwveG1wTU06SGlzdG9yeT4KICA8L3JkZjpEZXNjcmlwdGlvbj4KIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAKPD94cGFja2V0IGVuZD0idyI/Pnh+JrQAAAAGYktHRAAPABEAGpuVHJMAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfmCxcDJTR91pYDAAAD8ElEQVRYw8WXTWgcZRjHfzO7m3TztRsTP2hTTJNG0zQhfsQGvHgRNIsFg0crNYrUg+DBBREPiqAemott6UUhETzYUg2eBE8i3rJo24ulKKzSNWk23Z10d7PZbuZ5PMzs7CTGNpls8IWBfd/Zmf/veZ7/+8wMNHC8nLjU/N2Xq8ZOrjEbJT5xbGZYVS+JyEs7uS68W+HE+Oxh4BTK2y0tTRFgcG6mOD851fbnngIkxmc7gHeBV4CDCrS2twAcBj4GTuwJQGJ8NgZMuCJ99TNKNNrs2WFupvjj5FTbF/e6n7EDYRM4DrwPPL4ZPhQOcWx8hMEjhwiHQwAZ4NnJqbZrDTFhpVL5FPgWeGqzeGtblNHRo7RG42T+sijcLiMiB4DTczPFfbsGGOud7ltbq7y11f+774/z2OgInfFORJRq1ebmQoG/b1iUy9UXXJ8EL8FY77QBnI9Ewm/GO2MYhnOJaZr0HHyI/r5+DMNEVR0nKKgqzlSJxaPLzfvCz732zoO/BDVhLzBhiyAihEIhzJDJ0NAA3V0PAAYiAgqKI466ICi5W6vdpmH0AIEBEsDD4gLEOzt49JEB2ts7UAWRWuRu1K6w81tRpWyji4G24VjvdBR4D0AF7uvuYOToME1NTYhoPVp84v8GyAP5oH3gFHCgZpZyeY1QKOyK1wR9tUdRcWrvLqOqubsBmHeJvgs46berlSuynF1CBVQUUUFUEVFEBHWz4sydNRHNq2o+yDYcBIb8C6pCZmGRarXqZEGc0jhieMLqHiKgqtc/PHfEDgKwBGQ3AIhSKBQpFAtbRC71yNU5VASx9WrQRvQ78JN/oRZdJnMDscXLggPDxsi9DHA5EEAqnVTgtGM1z1AAWNZtVlasug9qwv7Inbmq6pXArTiVTv4KfO/PQG0s3lxg3bZ90W6svTtPf/L58MpunwVngTsOgHiLhUKR1dWSJy5+96vUdsPVRrySzQO/+UtQg1nKLnoNyYtc1dsZ90r/tgBS6eQt4OJWZbAsi9Jqob79VFDb3wf0cqNeSs/Xupmq4DdlNruIbUu9F7jZUKWsopmGAKTSScuF2FAGgGKpSKVSdksgdT/Ykhf57w4Y5LX8ApDbDGDbNrn8slf72hNSlZz7IGoYwDVgfjMAgLWSY61SdqK3pZaNfEMBUulkFTjj34p+L+StrNOW6xm4fubrJ+xGfxn9YJrm/FYnSqUCd6oVv0eubOeGOwJIpZPrkUjkBPCZK1Cse2GdYslreivAN9u5p0HAkRifjbtfQc8DrwL9pmnSs3+AcCjywbmLYx/tKcAmGAN4BjgZi3Ud6u7c//rZC0/+wf8xjj/9VeyNF3/edmn/AYqN3VvGcbV+AAAAAElFTkSuQmCC`
    ),
    contextMenu = Menu.buildFromTemplate([
      {
        type: "normal",
        label: "Open Obsidian",
        accelerator: plugin.settings.toggleWindowFocusHotkey,
        click: showWindows,
      },
      {
        type: "normal",
        label: "Hide Obsidian",
        accelerator: plugin.settings.toggleWindowFocusHotkey,
        click: hideWindows,
      },
      { type: "separator" },
      {
        label: "Relaunch Obsidian",
        click: relaunchObsidian,
      },
      {
        label: "Quit Obsidian",
        role: "quit",
      },
    ]);
  tray = new Tray(obsidianIcon);
  tray.setContextMenu(contextMenu);
  tray.setToolTip("Obsidian");
  tray.on("click", () => toggleWindows(plugin.settings.runInBackground, false));
};

const registerHotkey = (plugin) => {
    console.log("obsidian-tray: registering hotkey");
    try {
      const accelerator = plugin.settings.toggleWindowFocusHotkey;
      globalShortcut.register(accelerator, () => {
        const runInBackground = plugin.settings.runInBackground;
        toggleWindows(runInBackground);
      });
    } catch {}
  },
  unregisterHotkey = (plugin) => {
    console.log("obsidian-tray: unregistering hotkey");
    try {
      const accelerator = plugin.settings.toggleWindowFocusHotkey;
      globalShortcut.unregister(accelerator);
    } catch {}
  };

const OPTIONS = [
  {
    key: "launchOnStartup",
    desc: "Open Obsidian automatically whenever you log into your computer.",
    type: "toggle",
    default: true,
    onChange: (plugin) => setLaunchOnStartup(plugin),
  },
  {
    key: "runInBackground",
    desc: `
      Hide the app and continue to run it in the background instead of quitting
      it when pressing the window close button or toggle focus hotkey. If both
      this and "Launch on startup" are enabled, windows will be hidden automatically
      whenever the app is initialised.
    `,
    type: "toggle",
    default: false,
    onChange: (plugin) => {
      setLaunchOnStartup(plugin);
      const runInBackground = plugin.settings.runInBackground;
      if (!runInBackground) showWindows();
    },
  },
  {
    key: "createTrayIcon",
    desc: `
      Add an icon to your system tray/menubar to bring hidden Obsidian windows
      back into focus on click or force a full quit/relaunch of the app through
      the right-click menu.
      <br><span class="mod-warning">Changing this option requires a restart to take effect.</span>
    `,
    type: "toggle",
    default: true,
  },
  {
    key: "toggleWindowFocusHotkey",
    desc: `
      Format:
      <a href="https://www.electronjs.org/docs/latest/api/accelerator">
        Electron accelerator
      </a>
    `,
    type: "text",
    default: "CmdOrCtrl+Shift+Tab",
    onBeforeChange: (plugin) => unregisterHotkey(plugin),
    onChange: (plugin) => registerHotkey(plugin),
  },
];

const keyToLabel = (key) =>
    key[0].toUpperCase() +
    key
      .slice(1)
      .split(/(?=[A-Z])/)
      .map((word) => word.toLowerCase())
      .join(" "),
  htmlToFragment = (html) =>
    document.createRange().createContextualFragment((html ?? "").replace(/\s+/g, " "));

class SettingsTab extends obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    this.containerEl.empty();
    for (const opt of OPTIONS) {
      const name = keyToLabel(opt.key),
        desc = htmlToFragment(opt.desc),
        onChange = async (value) => {
          await opt.onBeforeChange?.(this.plugin, value);
          this.plugin.settings[opt.key] = value;
          await this.plugin.saveSettings();
          await opt.onChange?.(this.plugin, value);
        };

      const setting = new obsidian.Setting(this.containerEl).setName(name).setDesc(desc);
      switch (opt.type) {
        case "toggle":
          setting.addToggle((toggle) =>
            toggle.setValue(this.plugin.settings[opt.key]).onChange(onChange)
          );
          break;
        case "text":
        default:
          setting.addText((text) =>
            text
              .setPlaceholder(opt.default)
              .setValue(this.plugin.settings[opt.key])
              .onChange(onChange)
          );
      }
    }
  }
}

class TrayPlugin extends obsidian.Plugin {
  async onload() {
    await this.loadSettings();
    this.addSettingTab(new SettingsTab(this.app, this));

    console.log("obsidian-tray: loading");
    setLaunchOnStartup(this);
    registerHotkey(this);
    if (this.settings.runInBackground) {
      hideWindows(true);
      interceptWindowClose();
    }
    if (this.settings.createTrayIcon) createTrayIcon(this);
  }
  onunload() {
    unregisterHotkey(this);
    cleanupWindowClose();
  }

  async loadSettings() {
    const DEFAULT_SETTINGS = OPTIONS.map((opt) => ({
      [opt.key]: opt.default,
    }));
    this.settings = Object.assign({}, ...DEFAULT_SETTINGS, await this.loadData());
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
}
module.exports = TrayPlugin;
