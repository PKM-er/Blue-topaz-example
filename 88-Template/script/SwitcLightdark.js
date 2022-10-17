module.exports = SwitcLightdark

 async function SwitcLightdark (params) {
    const isDarkMode = this.app.vault.getConfig("theme") === "obsidian";
    if (isDarkMode) {
      this.app.setTheme("moonstone");
      this.app.vault.setConfig("theme", "moonstone");
      this.app.workspace.trigger("css-change");
    } else {
      this.app.setTheme("obsidian");
      this.app.vault.setConfig("theme", "obsidian");
      this.app.workspace.trigger("css-change");
    }
}
