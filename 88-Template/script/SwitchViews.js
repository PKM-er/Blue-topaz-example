module.exports = switchview

 async function switchview (params) {
 const noticeDuration = 2e3;
    const activePane = this.app.workspace.activeLeaf;
    const currentView = activePane.getViewState();
    if (currentView.type === "empty") {
      new Notice("There is currently no file open.");
      return;
    }
    let currentMode;
    if (currentView.state.mode === "preview")
      currentMode = "preview";
    if (currentView.state.mode === "source" && currentView.state.source)
      currentMode = "source";
    if (currentView.state.mode === "source" && !currentView.state.source)
      currentMode = "live";
    const newMode = currentView;
    switch (currentMode) {
      case "preview":
        newMode.state.mode = "source";
        newMode.state.source = true;
        new Notice("Now: Source Mode", noticeDuration);
        break;
      case "source":
        newMode.state.mode = "source";
        newMode.state.source = false;
        new Notice("Now: Live Preview", noticeDuration);
        break;
      case "live":
        newMode.state.mode = "preview";
        new Notice("Now: Reading Mode", noticeDuration);
        break;
    }
    activePane.setViewState(newMode);
}