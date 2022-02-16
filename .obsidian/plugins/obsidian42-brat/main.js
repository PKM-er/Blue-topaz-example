var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// node_modules/obsidian-daily-notes-interface/dist/main.js
var require_main = __commonJS({
  "node_modules/obsidian-daily-notes-interface/dist/main.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var obsidian = require("obsidian");
    var DEFAULT_DAILY_NOTE_FORMAT = "YYYY-MM-DD";
    var DEFAULT_WEEKLY_NOTE_FORMAT = "gggg-[W]ww";
    var DEFAULT_MONTHLY_NOTE_FORMAT = "YYYY-MM";
    var DEFAULT_QUARTERLY_NOTE_FORMAT = "YYYY-[Q]Q";
    var DEFAULT_YEARLY_NOTE_FORMAT = "YYYY";
    function shouldUsePeriodicNotesSettings(periodicity) {
      var _a, _b;
      const periodicNotes = window.app.plugins.getPlugin("periodic-notes");
      return periodicNotes && ((_b = (_a = periodicNotes.settings) == null ? void 0 : _a[periodicity]) == null ? void 0 : _b.enabled);
    }
    function getDailyNoteSettings2() {
      var _a, _b, _c, _d;
      try {
        const { internalPlugins, plugins } = window.app;
        if (shouldUsePeriodicNotesSettings("daily")) {
          const { format: format2, folder: folder2, template: template2 } = ((_b = (_a = plugins.getPlugin("periodic-notes")) == null ? void 0 : _a.settings) == null ? void 0 : _b.daily) || {};
          return {
            format: format2 || DEFAULT_DAILY_NOTE_FORMAT,
            folder: (folder2 == null ? void 0 : folder2.trim()) || "",
            template: (template2 == null ? void 0 : template2.trim()) || ""
          };
        }
        const { folder, format, template } = ((_d = (_c = internalPlugins.getPluginById("daily-notes")) == null ? void 0 : _c.instance) == null ? void 0 : _d.options) || {};
        return {
          format: format || DEFAULT_DAILY_NOTE_FORMAT,
          folder: (folder == null ? void 0 : folder.trim()) || "",
          template: (template == null ? void 0 : template.trim()) || ""
        };
      } catch (err) {
        console.info("No custom daily note settings found!", err);
      }
    }
    function getWeeklyNoteSettings() {
      var _a, _b, _c, _d, _e, _f, _g;
      try {
        const pluginManager = window.app.plugins;
        const calendarSettings = (_a = pluginManager.getPlugin("calendar")) == null ? void 0 : _a.options;
        const periodicNotesSettings = (_c = (_b = pluginManager.getPlugin("periodic-notes")) == null ? void 0 : _b.settings) == null ? void 0 : _c.weekly;
        if (shouldUsePeriodicNotesSettings("weekly")) {
          return {
            format: periodicNotesSettings.format || DEFAULT_WEEKLY_NOTE_FORMAT,
            folder: ((_d = periodicNotesSettings.folder) == null ? void 0 : _d.trim()) || "",
            template: ((_e = periodicNotesSettings.template) == null ? void 0 : _e.trim()) || ""
          };
        }
        const settings = calendarSettings || {};
        return {
          format: settings.weeklyNoteFormat || DEFAULT_WEEKLY_NOTE_FORMAT,
          folder: ((_f = settings.weeklyNoteFolder) == null ? void 0 : _f.trim()) || "",
          template: ((_g = settings.weeklyNoteTemplate) == null ? void 0 : _g.trim()) || ""
        };
      } catch (err) {
        console.info("No custom weekly note settings found!", err);
      }
    }
    function getMonthlyNoteSettings() {
      var _a, _b, _c, _d;
      const pluginManager = window.app.plugins;
      try {
        const settings = shouldUsePeriodicNotesSettings("monthly") && ((_b = (_a = pluginManager.getPlugin("periodic-notes")) == null ? void 0 : _a.settings) == null ? void 0 : _b.monthly) || {};
        return {
          format: settings.format || DEFAULT_MONTHLY_NOTE_FORMAT,
          folder: ((_c = settings.folder) == null ? void 0 : _c.trim()) || "",
          template: ((_d = settings.template) == null ? void 0 : _d.trim()) || ""
        };
      } catch (err) {
        console.info("No custom monthly note settings found!", err);
      }
    }
    function getQuarterlyNoteSettings() {
      var _a, _b, _c, _d;
      const pluginManager = window.app.plugins;
      try {
        const settings = shouldUsePeriodicNotesSettings("quarterly") && ((_b = (_a = pluginManager.getPlugin("periodic-notes")) == null ? void 0 : _a.settings) == null ? void 0 : _b.quarterly) || {};
        return {
          format: settings.format || DEFAULT_QUARTERLY_NOTE_FORMAT,
          folder: ((_c = settings.folder) == null ? void 0 : _c.trim()) || "",
          template: ((_d = settings.template) == null ? void 0 : _d.trim()) || ""
        };
      } catch (err) {
        console.info("No custom quarterly note settings found!", err);
      }
    }
    function getYearlyNoteSettings() {
      var _a, _b, _c, _d;
      const pluginManager = window.app.plugins;
      try {
        const settings = shouldUsePeriodicNotesSettings("yearly") && ((_b = (_a = pluginManager.getPlugin("periodic-notes")) == null ? void 0 : _a.settings) == null ? void 0 : _b.yearly) || {};
        return {
          format: settings.format || DEFAULT_YEARLY_NOTE_FORMAT,
          folder: ((_c = settings.folder) == null ? void 0 : _c.trim()) || "",
          template: ((_d = settings.template) == null ? void 0 : _d.trim()) || ""
        };
      } catch (err) {
        console.info("No custom yearly note settings found!", err);
      }
    }
    function join(...partSegments) {
      let parts = [];
      for (let i = 0, l = partSegments.length; i < l; i++) {
        parts = parts.concat(partSegments[i].split("/"));
      }
      const newParts = [];
      for (let i = 0, l = parts.length; i < l; i++) {
        const part = parts[i];
        if (!part || part === ".")
          continue;
        else
          newParts.push(part);
      }
      if (parts[0] === "")
        newParts.unshift("");
      return newParts.join("/");
    }
    function basename(fullPath) {
      let base = fullPath.substring(fullPath.lastIndexOf("/") + 1);
      if (base.lastIndexOf(".") != -1)
        base = base.substring(0, base.lastIndexOf("."));
      return base;
    }
    function ensureFolderExists(path) {
      return __async(this, null, function* () {
        const dirs = path.replace(/\\/g, "/").split("/");
        dirs.pop();
        if (dirs.length) {
          const dir = join(...dirs);
          if (!window.app.vault.getAbstractFileByPath(dir)) {
            yield window.app.vault.createFolder(dir);
          }
        }
      });
    }
    function getNotePath(directory, filename) {
      return __async(this, null, function* () {
        if (!filename.endsWith(".md")) {
          filename += ".md";
        }
        const path = obsidian.normalizePath(join(directory, filename));
        yield ensureFolderExists(path);
        return path;
      });
    }
    function getTemplateInfo(template) {
      return __async(this, null, function* () {
        const { metadataCache, vault } = window.app;
        const templatePath = obsidian.normalizePath(template);
        if (templatePath === "/") {
          return Promise.resolve(["", null]);
        }
        try {
          const templateFile = metadataCache.getFirstLinkpathDest(templatePath, "");
          const contents = yield vault.cachedRead(templateFile);
          const IFoldInfo = window.app.foldManager.load(templateFile);
          return [contents, IFoldInfo];
        } catch (err) {
          console.error(`Failed to read the daily note template '${templatePath}'`, err);
          new obsidian.Notice("Failed to read the daily note template");
          return ["", null];
        }
      });
    }
    function getDateUID(date, granularity = "day") {
      const ts = date.clone().startOf(granularity).format();
      return `${granularity}-${ts}`;
    }
    function removeEscapedCharacters(format) {
      return format.replace(/\[[^\]]*\]/g, "");
    }
    function isFormatAmbiguous(format, granularity) {
      if (granularity === "week") {
        const cleanFormat = removeEscapedCharacters(format);
        return /w{1,2}/i.test(cleanFormat) && (/M{1,4}/.test(cleanFormat) || /D{1,4}/.test(cleanFormat));
      }
      return false;
    }
    function getDateFromFile(file, granularity) {
      return getDateFromFilename(file.basename, granularity);
    }
    function getDateFromPath(path, granularity) {
      return getDateFromFilename(basename(path), granularity);
    }
    function getDateFromFilename(filename, granularity) {
      const getSettings = {
        day: getDailyNoteSettings2,
        week: getWeeklyNoteSettings,
        month: getMonthlyNoteSettings,
        quarter: getQuarterlyNoteSettings,
        year: getYearlyNoteSettings
      };
      const format = getSettings[granularity]().format.split("/").pop();
      const noteDate = window.moment(filename, format, true);
      if (!noteDate.isValid()) {
        return null;
      }
      if (isFormatAmbiguous(format, granularity)) {
        if (granularity === "week") {
          const cleanFormat = removeEscapedCharacters(format);
          if (/w{1,2}/i.test(cleanFormat)) {
            return window.moment(filename, format.replace(/M{1,4}/g, "").replace(/D{1,4}/g, ""), false);
          }
        }
      }
      return noteDate;
    }
    var DailyNotesFolderMissingError = class extends Error {
    };
    function createDailyNote(date) {
      return __async(this, null, function* () {
        const app = window.app;
        const { vault } = app;
        const moment2 = window.moment;
        const { template, format, folder } = getDailyNoteSettings2();
        const [templateContents, IFoldInfo] = yield getTemplateInfo(template);
        const filename = date.format(format);
        const normalizedPath = yield getNotePath(folder, filename);
        try {
          const createdFile = yield vault.create(normalizedPath, templateContents.replace(/{{\s*date\s*}}/gi, filename).replace(/{{\s*time\s*}}/gi, moment2().format("HH:mm")).replace(/{{\s*title\s*}}/gi, filename).replace(/{{\s*(date|time)\s*(([+-]\d+)([yqmwdhs]))?\s*(:.+?)?}}/gi, (_, _timeOrDate, calc, timeDelta, unit, momentFormat) => {
            const now = moment2();
            const currentDate = date.clone().set({
              hour: now.get("hour"),
              minute: now.get("minute"),
              second: now.get("second")
            });
            if (calc) {
              currentDate.add(parseInt(timeDelta, 10), unit);
            }
            if (momentFormat) {
              return currentDate.format(momentFormat.substring(1).trim());
            }
            return currentDate.format(format);
          }).replace(/{{\s*yesterday\s*}}/gi, date.clone().subtract(1, "day").format(format)).replace(/{{\s*tomorrow\s*}}/gi, date.clone().add(1, "d").format(format)));
          app.foldManager.save(createdFile, IFoldInfo);
          return createdFile;
        } catch (err) {
          console.error(`Failed to create file: '${normalizedPath}'`, err);
          new obsidian.Notice("Unable to create new file.");
        }
      });
    }
    function getDailyNote(date, dailyNotes) {
      var _a;
      return (_a = dailyNotes[getDateUID(date, "day")]) != null ? _a : null;
    }
    function getAllDailyNotes() {
      const { vault } = window.app;
      const { folder } = getDailyNoteSettings2();
      const dailyNotesFolder = vault.getAbstractFileByPath(obsidian.normalizePath(folder));
      if (!dailyNotesFolder) {
        throw new DailyNotesFolderMissingError("Failed to find daily notes folder");
      }
      const dailyNotes = {};
      obsidian.Vault.recurseChildren(dailyNotesFolder, (note) => {
        if (note instanceof obsidian.TFile) {
          const date = getDateFromFile(note, "day");
          if (date) {
            const dateString = getDateUID(date, "day");
            dailyNotes[dateString] = note;
          }
        }
      });
      return dailyNotes;
    }
    var WeeklyNotesFolderMissingError = class extends Error {
    };
    function getDaysOfWeek() {
      const { moment: moment2 } = window;
      let weekStart = moment2.localeData()._week.dow;
      const daysOfWeek = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday"
      ];
      while (weekStart) {
        daysOfWeek.push(daysOfWeek.shift());
        weekStart--;
      }
      return daysOfWeek;
    }
    function getDayOfWeekNumericalValue(dayOfWeekName) {
      return getDaysOfWeek().indexOf(dayOfWeekName.toLowerCase());
    }
    function createWeeklyNote(date) {
      return __async(this, null, function* () {
        const { vault } = window.app;
        const { template, format, folder } = getWeeklyNoteSettings();
        const [templateContents, IFoldInfo] = yield getTemplateInfo(template);
        const filename = date.format(format);
        const normalizedPath = yield getNotePath(folder, filename);
        try {
          const createdFile = yield vault.create(normalizedPath, templateContents.replace(/{{\s*(date|time)\s*(([+-]\d+)([yqmwdhs]))?\s*(:.+?)?}}/gi, (_, _timeOrDate, calc, timeDelta, unit, momentFormat) => {
            const now = window.moment();
            const currentDate = date.clone().set({
              hour: now.get("hour"),
              minute: now.get("minute"),
              second: now.get("second")
            });
            if (calc) {
              currentDate.add(parseInt(timeDelta, 10), unit);
            }
            if (momentFormat) {
              return currentDate.format(momentFormat.substring(1).trim());
            }
            return currentDate.format(format);
          }).replace(/{{\s*title\s*}}/gi, filename).replace(/{{\s*time\s*}}/gi, window.moment().format("HH:mm")).replace(/{{\s*(sunday|monday|tuesday|wednesday|thursday|friday|saturday)\s*:(.*?)}}/gi, (_, dayOfWeek, momentFormat) => {
            const day = getDayOfWeekNumericalValue(dayOfWeek);
            return date.weekday(day).format(momentFormat.trim());
          }));
          window.app.foldManager.save(createdFile, IFoldInfo);
          return createdFile;
        } catch (err) {
          console.error(`Failed to create file: '${normalizedPath}'`, err);
          new obsidian.Notice("Unable to create new file.");
        }
      });
    }
    function getWeeklyNote(date, weeklyNotes) {
      var _a;
      return (_a = weeklyNotes[getDateUID(date, "week")]) != null ? _a : null;
    }
    function getAllWeeklyNotes() {
      const weeklyNotes = {};
      if (!appHasWeeklyNotesPluginLoaded()) {
        return weeklyNotes;
      }
      const { vault } = window.app;
      const { folder } = getWeeklyNoteSettings();
      const weeklyNotesFolder = vault.getAbstractFileByPath(obsidian.normalizePath(folder));
      if (!weeklyNotesFolder) {
        throw new WeeklyNotesFolderMissingError("Failed to find weekly notes folder");
      }
      obsidian.Vault.recurseChildren(weeklyNotesFolder, (note) => {
        if (note instanceof obsidian.TFile) {
          const date = getDateFromFile(note, "week");
          if (date) {
            const dateString = getDateUID(date, "week");
            weeklyNotes[dateString] = note;
          }
        }
      });
      return weeklyNotes;
    }
    var MonthlyNotesFolderMissingError = class extends Error {
    };
    function createMonthlyNote(date) {
      return __async(this, null, function* () {
        const { vault } = window.app;
        const { template, format, folder } = getMonthlyNoteSettings();
        const [templateContents, IFoldInfo] = yield getTemplateInfo(template);
        const filename = date.format(format);
        const normalizedPath = yield getNotePath(folder, filename);
        try {
          const createdFile = yield vault.create(normalizedPath, templateContents.replace(/{{\s*(date|time)\s*(([+-]\d+)([yqmwdhs]))?\s*(:.+?)?}}/gi, (_, _timeOrDate, calc, timeDelta, unit, momentFormat) => {
            const now = window.moment();
            const currentDate = date.clone().set({
              hour: now.get("hour"),
              minute: now.get("minute"),
              second: now.get("second")
            });
            if (calc) {
              currentDate.add(parseInt(timeDelta, 10), unit);
            }
            if (momentFormat) {
              return currentDate.format(momentFormat.substring(1).trim());
            }
            return currentDate.format(format);
          }).replace(/{{\s*date\s*}}/gi, filename).replace(/{{\s*time\s*}}/gi, window.moment().format("HH:mm")).replace(/{{\s*title\s*}}/gi, filename));
          window.app.foldManager.save(createdFile, IFoldInfo);
          return createdFile;
        } catch (err) {
          console.error(`Failed to create file: '${normalizedPath}'`, err);
          new obsidian.Notice("Unable to create new file.");
        }
      });
    }
    function getMonthlyNote(date, monthlyNotes) {
      var _a;
      return (_a = monthlyNotes[getDateUID(date, "month")]) != null ? _a : null;
    }
    function getAllMonthlyNotes() {
      const monthlyNotes = {};
      if (!appHasMonthlyNotesPluginLoaded()) {
        return monthlyNotes;
      }
      const { vault } = window.app;
      const { folder } = getMonthlyNoteSettings();
      const monthlyNotesFolder = vault.getAbstractFileByPath(obsidian.normalizePath(folder));
      if (!monthlyNotesFolder) {
        throw new MonthlyNotesFolderMissingError("Failed to find monthly notes folder");
      }
      obsidian.Vault.recurseChildren(monthlyNotesFolder, (note) => {
        if (note instanceof obsidian.TFile) {
          const date = getDateFromFile(note, "month");
          if (date) {
            const dateString = getDateUID(date, "month");
            monthlyNotes[dateString] = note;
          }
        }
      });
      return monthlyNotes;
    }
    var QuarterlyNotesFolderMissingError = class extends Error {
    };
    function createQuarterlyNote(date) {
      return __async(this, null, function* () {
        const { vault } = window.app;
        const { template, format, folder } = getQuarterlyNoteSettings();
        const [templateContents, IFoldInfo] = yield getTemplateInfo(template);
        const filename = date.format(format);
        const normalizedPath = yield getNotePath(folder, filename);
        try {
          const createdFile = yield vault.create(normalizedPath, templateContents.replace(/{{\s*(date|time)\s*(([+-]\d+)([yqmwdhs]))?\s*(:.+?)?}}/gi, (_, _timeOrDate, calc, timeDelta, unit, momentFormat) => {
            const now = window.moment();
            const currentDate = date.clone().set({
              hour: now.get("hour"),
              minute: now.get("minute"),
              second: now.get("second")
            });
            if (calc) {
              currentDate.add(parseInt(timeDelta, 10), unit);
            }
            if (momentFormat) {
              return currentDate.format(momentFormat.substring(1).trim());
            }
            return currentDate.format(format);
          }).replace(/{{\s*date\s*}}/gi, filename).replace(/{{\s*time\s*}}/gi, window.moment().format("HH:mm")).replace(/{{\s*title\s*}}/gi, filename));
          window.app.foldManager.save(createdFile, IFoldInfo);
          return createdFile;
        } catch (err) {
          console.error(`Failed to create file: '${normalizedPath}'`, err);
          new obsidian.Notice("Unable to create new file.");
        }
      });
    }
    function getQuarterlyNote(date, quarterly) {
      var _a;
      return (_a = quarterly[getDateUID(date, "quarter")]) != null ? _a : null;
    }
    function getAllQuarterlyNotes() {
      const quarterly = {};
      if (!appHasQuarterlyNotesPluginLoaded()) {
        return quarterly;
      }
      const { vault } = window.app;
      const { folder } = getQuarterlyNoteSettings();
      const quarterlyFolder = vault.getAbstractFileByPath(obsidian.normalizePath(folder));
      if (!quarterlyFolder) {
        throw new QuarterlyNotesFolderMissingError("Failed to find quarterly notes folder");
      }
      obsidian.Vault.recurseChildren(quarterlyFolder, (note) => {
        if (note instanceof obsidian.TFile) {
          const date = getDateFromFile(note, "quarter");
          if (date) {
            const dateString = getDateUID(date, "quarter");
            quarterly[dateString] = note;
          }
        }
      });
      return quarterly;
    }
    var YearlyNotesFolderMissingError = class extends Error {
    };
    function createYearlyNote(date) {
      return __async(this, null, function* () {
        const { vault } = window.app;
        const { template, format, folder } = getYearlyNoteSettings();
        const [templateContents, IFoldInfo] = yield getTemplateInfo(template);
        const filename = date.format(format);
        const normalizedPath = yield getNotePath(folder, filename);
        try {
          const createdFile = yield vault.create(normalizedPath, templateContents.replace(/{{\s*(date|time)\s*(([+-]\d+)([yqmwdhs]))?\s*(:.+?)?}}/gi, (_, _timeOrDate, calc, timeDelta, unit, momentFormat) => {
            const now = window.moment();
            const currentDate = date.clone().set({
              hour: now.get("hour"),
              minute: now.get("minute"),
              second: now.get("second")
            });
            if (calc) {
              currentDate.add(parseInt(timeDelta, 10), unit);
            }
            if (momentFormat) {
              return currentDate.format(momentFormat.substring(1).trim());
            }
            return currentDate.format(format);
          }).replace(/{{\s*date\s*}}/gi, filename).replace(/{{\s*time\s*}}/gi, window.moment().format("HH:mm")).replace(/{{\s*title\s*}}/gi, filename));
          window.app.foldManager.save(createdFile, IFoldInfo);
          return createdFile;
        } catch (err) {
          console.error(`Failed to create file: '${normalizedPath}'`, err);
          new obsidian.Notice("Unable to create new file.");
        }
      });
    }
    function getYearlyNote(date, yearlyNotes) {
      var _a;
      return (_a = yearlyNotes[getDateUID(date, "year")]) != null ? _a : null;
    }
    function getAllYearlyNotes() {
      const yearlyNotes = {};
      if (!appHasYearlyNotesPluginLoaded()) {
        return yearlyNotes;
      }
      const { vault } = window.app;
      const { folder } = getYearlyNoteSettings();
      const yearlyNotesFolder = vault.getAbstractFileByPath(obsidian.normalizePath(folder));
      if (!yearlyNotesFolder) {
        throw new YearlyNotesFolderMissingError("Failed to find yearly notes folder");
      }
      obsidian.Vault.recurseChildren(yearlyNotesFolder, (note) => {
        if (note instanceof obsidian.TFile) {
          const date = getDateFromFile(note, "year");
          if (date) {
            const dateString = getDateUID(date, "year");
            yearlyNotes[dateString] = note;
          }
        }
      });
      return yearlyNotes;
    }
    function appHasDailyNotesPluginLoaded() {
      var _a, _b;
      const { app } = window;
      const dailyNotesPlugin = app.internalPlugins.plugins["daily-notes"];
      if (dailyNotesPlugin && dailyNotesPlugin.enabled) {
        return true;
      }
      const periodicNotes = app.plugins.getPlugin("periodic-notes");
      return periodicNotes && ((_b = (_a = periodicNotes.settings) == null ? void 0 : _a.daily) == null ? void 0 : _b.enabled);
    }
    function appHasWeeklyNotesPluginLoaded() {
      var _a, _b;
      const { app } = window;
      if (app.plugins.getPlugin("calendar")) {
        return true;
      }
      const periodicNotes = app.plugins.getPlugin("periodic-notes");
      return periodicNotes && ((_b = (_a = periodicNotes.settings) == null ? void 0 : _a.weekly) == null ? void 0 : _b.enabled);
    }
    function appHasMonthlyNotesPluginLoaded() {
      var _a, _b;
      const { app } = window;
      const periodicNotes = app.plugins.getPlugin("periodic-notes");
      return periodicNotes && ((_b = (_a = periodicNotes.settings) == null ? void 0 : _a.monthly) == null ? void 0 : _b.enabled);
    }
    function appHasQuarterlyNotesPluginLoaded() {
      var _a, _b;
      const { app } = window;
      const periodicNotes = app.plugins.getPlugin("periodic-notes");
      return periodicNotes && ((_b = (_a = periodicNotes.settings) == null ? void 0 : _a.quarterly) == null ? void 0 : _b.enabled);
    }
    function appHasYearlyNotesPluginLoaded() {
      var _a, _b;
      const { app } = window;
      const periodicNotes = app.plugins.getPlugin("periodic-notes");
      return periodicNotes && ((_b = (_a = periodicNotes.settings) == null ? void 0 : _a.yearly) == null ? void 0 : _b.enabled);
    }
    function getPeriodicNoteSettings(granularity) {
      const getSettings = {
        day: getDailyNoteSettings2,
        week: getWeeklyNoteSettings,
        month: getMonthlyNoteSettings,
        quarter: getQuarterlyNoteSettings,
        year: getYearlyNoteSettings
      }[granularity];
      return getSettings();
    }
    function createPeriodicNote(granularity, date) {
      const createFn = {
        day: createDailyNote,
        month: createMonthlyNote,
        week: createWeeklyNote
      };
      return createFn[granularity](date);
    }
    exports.DEFAULT_DAILY_NOTE_FORMAT = DEFAULT_DAILY_NOTE_FORMAT;
    exports.DEFAULT_MONTHLY_NOTE_FORMAT = DEFAULT_MONTHLY_NOTE_FORMAT;
    exports.DEFAULT_QUARTERLY_NOTE_FORMAT = DEFAULT_QUARTERLY_NOTE_FORMAT;
    exports.DEFAULT_WEEKLY_NOTE_FORMAT = DEFAULT_WEEKLY_NOTE_FORMAT;
    exports.DEFAULT_YEARLY_NOTE_FORMAT = DEFAULT_YEARLY_NOTE_FORMAT;
    exports.appHasDailyNotesPluginLoaded = appHasDailyNotesPluginLoaded;
    exports.appHasMonthlyNotesPluginLoaded = appHasMonthlyNotesPluginLoaded;
    exports.appHasQuarterlyNotesPluginLoaded = appHasQuarterlyNotesPluginLoaded;
    exports.appHasWeeklyNotesPluginLoaded = appHasWeeklyNotesPluginLoaded;
    exports.appHasYearlyNotesPluginLoaded = appHasYearlyNotesPluginLoaded;
    exports.createDailyNote = createDailyNote;
    exports.createMonthlyNote = createMonthlyNote;
    exports.createPeriodicNote = createPeriodicNote;
    exports.createQuarterlyNote = createQuarterlyNote;
    exports.createWeeklyNote = createWeeklyNote;
    exports.createYearlyNote = createYearlyNote;
    exports.getAllDailyNotes = getAllDailyNotes;
    exports.getAllMonthlyNotes = getAllMonthlyNotes;
    exports.getAllQuarterlyNotes = getAllQuarterlyNotes;
    exports.getAllWeeklyNotes = getAllWeeklyNotes;
    exports.getAllYearlyNotes = getAllYearlyNotes;
    exports.getDailyNote = getDailyNote;
    exports.getDailyNoteSettings = getDailyNoteSettings2;
    exports.getDateFromFile = getDateFromFile;
    exports.getDateFromPath = getDateFromPath;
    exports.getDateUID = getDateUID;
    exports.getMonthlyNote = getMonthlyNote;
    exports.getMonthlyNoteSettings = getMonthlyNoteSettings;
    exports.getPeriodicNoteSettings = getPeriodicNoteSettings;
    exports.getQuarterlyNote = getQuarterlyNote;
    exports.getQuarterlyNoteSettings = getQuarterlyNoteSettings;
    exports.getTemplateInfo = getTemplateInfo;
    exports.getWeeklyNote = getWeeklyNote;
    exports.getWeeklyNoteSettings = getWeeklyNoteSettings;
    exports.getYearlyNote = getYearlyNote;
    exports.getYearlyNoteSettings = getYearlyNoteSettings;
  }
});

// src/main.ts
__export(exports, {
  default: () => ThePlugin
});
var import_obsidian11 = __toModule(require("obsidian"));

// src/ui/SettingsTab.ts
var import_obsidian6 = __toModule(require("obsidian"));

// src/features/themes.ts
var import_obsidian4 = __toModule(require("obsidian"));

// src/ui/GenericFuzzySuggester.ts
var import_obsidian = __toModule(require("obsidian"));
var GenericFuzzySuggester = class extends import_obsidian.FuzzySuggestModal {
  constructor(plugin) {
    super(plugin.app);
    this.scope.register(["Shift"], "Enter", (evt) => this.enterTrigger(evt));
    this.scope.register(["Ctrl"], "Enter", (evt) => this.enterTrigger(evt));
  }
  setSuggesterData(suggesterData) {
    this.data = suggesterData;
  }
  display(callBack) {
    return __async(this, null, function* () {
      this.callbackFunction = callBack;
      this.open();
    });
  }
  getItems() {
    return this.data;
  }
  getItemText(item) {
    return item.display;
  }
  onChooseItem() {
    return;
  }
  renderSuggestion(item, el) {
    el.createEl("div", { text: item.item.display });
  }
  enterTrigger(evt) {
    const selectedText = document.querySelector(".suggestion-item.is-selected div").textContent;
    const item = this.data.find((i) => i.display === selectedText);
    if (item) {
      this.invokeCallback(item, evt);
      this.close();
    }
  }
  onChooseSuggestion(item, evt) {
    this.invokeCallback(item.item, evt);
  }
  invokeCallback(item, evt) {
    this.callbackFunction(item, evt);
  }
};

// src/features/githubUtils.ts
var import_obsidian2 = __toModule(require("obsidian"));
var GITHUB_RAW_USERCONTENT_PATH = "https://raw.githubusercontent.com/";
var grabReleaseFileFromRepository = (repository, version, fileName) => __async(void 0, null, function* () {
  const URL = `https://github.com/${repository}/releases/download/${version}/${fileName}`;
  try {
    const download = yield (0, import_obsidian2.request)({ url: URL });
    return download === "Not Found" || download === `{"error":"Not Found"}` ? null : download;
  } catch (error) {
    console.log("error in grabReleaseFileFromRepository", URL, error);
  }
});
var grabManifestJsonFromRepository = (repositoryPath, rootManifest = true) => __async(void 0, null, function* () {
  const manifestJsonPath = GITHUB_RAW_USERCONTENT_PATH + repositoryPath + (rootManifest === true ? "/HEAD/manifest.json" : "/HEAD/manifest-beta.json");
  try {
    const response = yield (0, import_obsidian2.request)({ url: manifestJsonPath });
    return response === "404: Not Found" ? null : yield JSON.parse(response);
  } catch (error) {
    console.log(`error in grabManifestJsonFromRepository for ${manifestJsonPath}`, error);
  }
});
var grabCommmunityPluginList = () => __async(void 0, null, function* () {
  const pluginListURL = `https://raw.githubusercontent.com/obsidianmd/obsidian-releases/HEAD/community-plugins.json`;
  try {
    const response = yield (0, import_obsidian2.request)({ url: pluginListURL });
    return response === "404: Not Found" ? null : yield JSON.parse(response);
  } catch (error) {
    console.log("error in grabCommmunityPluginList", error);
  }
});
var grabCommmunityThemesList = () => __async(void 0, null, function* () {
  const themesURL = `https://raw.githubusercontent.com/obsidianmd/obsidian-releases/HEAD/community-css-themes.json`;
  try {
    const response = yield (0, import_obsidian2.request)({ url: themesURL });
    return response === "404: Not Found" ? null : yield JSON.parse(response);
  } catch (error) {
    console.log("error in grabCommmunityThemesList", error);
  }
});
var grabCommmunityThemeObsidianCss = (repositoryPath) => __async(void 0, null, function* () {
  const themesURL = `https://raw.githubusercontent.com/${repositoryPath}/HEAD/obsidian.css`;
  try {
    const response = yield (0, import_obsidian2.request)({ url: themesURL });
    return response === "404: Not Found" ? null : response;
  } catch (error) {
    console.log("error in grabCommmunityThemesList", error);
  }
});
var grabLastCommitInfoForAFile = (repositoryPath, path) => __async(void 0, null, function* () {
  const url = `https://api.github.com/repos/${repositoryPath}/commits?path=${path}&page=1&per_page=1`;
  try {
    const response = yield (0, import_obsidian2.request)({ url });
    return response === "404: Not Found" ? null : JSON.parse(response);
  } catch (error) {
    console.log("error in grabCommmunityThemesList", error);
  }
});
var grabLastCommitDateForAFile = (repositoryPath, path) => __async(void 0, null, function* () {
  const test = yield grabLastCommitInfoForAFile(repositoryPath, path);
  if (test[0].commit.committer.date) {
    return test[0].commit.committer.date;
  } else
    return "";
});

// src/ui/settings.ts
var DEFAULT_SETTINGS = {
  pluginList: [],
  themesList: [],
  updateAtStartup: false,
  updateThemesAtStartup: false,
  ribbonIconEnabled: true,
  loggingEnabled: false,
  loggingPath: "BRAT-log",
  loggingVerboseEnabled: false,
  debuggingMode: true,
  notificationsEnabled: true
};
function addBetaPluginToList(plugin, repositoryPath) {
  return __async(this, null, function* () {
    if (!plugin.settings.pluginList.contains(repositoryPath)) {
      plugin.settings.pluginList.unshift(repositoryPath);
      plugin.saveSettings();
    }
  });
}
function existBetaPluginInList(plugin, repositoryPath) {
  return __async(this, null, function* () {
    return plugin.settings.pluginList.contains(repositoryPath);
  });
}
function addBetaThemeToList(plugin, repositoryPath) {
  return __async(this, null, function* () {
    const newTheme = {
      repo: repositoryPath,
      lastUpdate: yield grabLastCommitDateForAFile(repositoryPath, "obsidian.css")
    };
    plugin.settings.themesList.unshift(newTheme);
    plugin.saveSettings();
  });
}
function existBetaThemeinInList(plugin, repositoryPath) {
  return __async(this, null, function* () {
    const testIfThemExists = plugin.settings.themesList.find((t) => t.repo === repositoryPath);
    return testIfThemExists ? true : false;
  });
}
function updateBetaThemeLastUpdateDate(plugin, repositoryPath, newDate) {
  plugin.settings.themesList.forEach((t) => {
    if (t.repo === repositoryPath) {
      t.lastUpdate = newDate;
      plugin.saveSettings();
    }
  });
}

// src/utils/notifications.ts
var import_obsidian3 = __toModule(require("obsidian"));
function ToastMessage(plugin, msg, timeoutInSeconds = 10, contextMenuCallback = null) {
  if (plugin.settings.notificationsEnabled === false)
    return;
  const additionalInfo = contextMenuCallback ? "(click=dismiss, right-click=Info)" : "";
  const newNotice = new import_obsidian3.Notice(`BRAT
${msg}
${additionalInfo}`, timeoutInSeconds * 1e3);
  if (contextMenuCallback)
    newNotice.noticeEl.oncontextmenu = () => __async(this, null, function* () {
      contextMenuCallback();
    });
}

// src/utils/internetconnection.ts
function isConnectedToInternet() {
  return __async(this, null, function* () {
    try {
      const online = yield fetch("https://obsidian.md/?" + Math.random());
      return online.status >= 200 && online.status < 300;
    } catch (err) {
      return false;
    }
  });
}

// src/features/themes.ts
var themesRootPath = (plugin) => {
  return (0, import_obsidian4.normalizePath)(plugin.app.vault.configDir + "/themes") + "/";
};
var themeInstallTheme = (plugin, cssGithubRepository, cssFileName = "") => __async(void 0, null, function* () {
  const themeCSS = yield grabCommmunityThemeObsidianCss(cssGithubRepository);
  if (!themeCSS) {
    ToastMessage(plugin, "There is no obsidian.css file in the root path of this repository, so there is no theme to install.");
    return false;
  }
  yield themesSaveTheme(plugin, cssFileName, themeCSS);
  const msg = `${cssFileName} theme installed from ${cssGithubRepository}. `;
  plugin.log(msg + `[Theme Info](https://github.com/${cssGithubRepository})`, false);
  ToastMessage(plugin, `${msg}`, 10, () => __async(void 0, null, function* () {
    window.open(`https://github.com/${cssGithubRepository}`);
  }));
  setTimeout(() => {
    plugin.app.customCss.setTheme(cssFileName);
  }, 500);
  return true;
});
var themesSaveTheme = (plugin, cssFileName, cssText) => __async(void 0, null, function* () {
  const themesTargetFolderPath = themesRootPath(plugin);
  const adapter = plugin.app.vault.adapter;
  if ((yield adapter.exists(themesTargetFolderPath)) === false)
    yield adapter.mkdir(themesTargetFolderPath);
  yield adapter.write(themesTargetFolderPath + cssFileName + ".css", cssText);
});
var themesInstallFromCommunityList = (plugin) => __async(void 0, null, function* () {
  const communityTheme = yield grabCommmunityThemesList();
  const communityThemeList = Object.values(communityTheme).map((p) => {
    return { display: `Theme: ${p.name}  (${p.repo})`, info: p };
  });
  const gfs = new GenericFuzzySuggester(plugin);
  gfs.setSuggesterData(communityThemeList);
  yield gfs.display((results) => __async(void 0, null, function* () {
    yield themeInstallTheme(plugin, results.info.repo, results.info.name);
  }));
});
var themesDeriveBetaNameFromRepository = (cssGithubRepository) => {
  const betaName = "BRAT-" + cssGithubRepository.replace("/", "----");
  return betaName.substr(0, 100);
};
var themesDelete = (plugin, cssGithubRepository) => __async(void 0, null, function* () {
  plugin.settings.themesList = plugin.settings.themesList.filter((t) => t.repo != cssGithubRepository);
  plugin.saveSettings();
  yield plugin.app.vault.adapter.remove(themesRootPath(plugin) + themesDeriveBetaNameFromRepository(cssGithubRepository) + ".css");
  const msg = `Removed ${cssGithubRepository} from BRAT themes list and deleted from vault`;
  plugin.log(msg, true);
  ToastMessage(plugin, `${msg}`);
});
var themeseCheckAndUpdates = (plugin, showInfo) => __async(void 0, null, function* () {
  if ((yield isConnectedToInternet()) === false) {
    console.log("BRAT: No internet detected.");
    return;
  }
  let newNotice;
  const msg1 = `Checking for beta theme updates STARTED`;
  plugin.log(msg1, true);
  if (showInfo && plugin.settings.notificationsEnabled)
    newNotice = new import_obsidian4.Notice(`BRAT
${msg1}`, 3e4);
  for (const t of plugin.settings.themesList) {
    const lastUpdateOnline = yield grabLastCommitDateForAFile(t.repo, "obsidian.css");
    if (lastUpdateOnline !== t.lastUpdate)
      yield themeUpdateTheme(plugin, t.repo, t.lastUpdate, lastUpdateOnline);
  }
  const msg2 = `Checking for beta theme updates COMPLETED`;
  plugin.log(msg2, true);
  if (showInfo) {
    if (plugin.settings.notificationsEnabled)
      newNotice.hide();
    ToastMessage(plugin, msg2);
  }
});
var themeUpdateTheme = (plugin, cssGithubRepository, oldFileDate = "", newFileDate = "") => __async(void 0, null, function* () {
  const themeCSS = yield grabCommmunityThemeObsidianCss(cssGithubRepository);
  if (!themeCSS) {
    ToastMessage(plugin, "There is no obsidian.css file in the root path of the ${cssGithubRepository} repository, so this theme cannot be updated.");
    return false;
  }
  const cssFileName = themesDeriveBetaNameFromRepository(cssGithubRepository);
  yield themesSaveTheme(plugin, cssFileName, themeCSS);
  updateBetaThemeLastUpdateDate(plugin, cssGithubRepository, newFileDate);
  const msg = `${cssFileName} theme updated from ${cssGithubRepository}. From date: ${oldFileDate} to ${newFileDate} `;
  plugin.log(msg + `[Theme Info](https://github.com/${cssGithubRepository})`, false);
  ToastMessage(plugin, `${msg}`, 20, () => __async(void 0, null, function* () {
    window.open(`https://github.com/${cssGithubRepository}`);
  }));
  return true;
});

// src/ui/AddNewTheme.ts
var import_obsidian5 = __toModule(require("obsidian"));
var AddNewTheme = class extends import_obsidian5.Modal {
  constructor(plugin, openSettingsTabAfterwards = false) {
    super(plugin.app);
    this.plugin = plugin;
    this.address = "";
    this.openSettingsTabAfterwards = openSettingsTabAfterwards;
  }
  submitForm() {
    return __async(this, null, function* () {
      if (this.address === "")
        return;
      const scrubbedAddress = this.address.replace("https://github.com/", "");
      if (yield existBetaThemeinInList(this.plugin, scrubbedAddress)) {
        ToastMessage(this.plugin, `This plugin is already in the list for beta testing`, 10);
        return;
      }
      if (yield themeInstallTheme(this.plugin, scrubbedAddress, themesDeriveBetaNameFromRepository(scrubbedAddress))) {
        yield addBetaThemeToList(this.plugin, scrubbedAddress);
        this.close();
      }
    });
  }
  onOpen() {
    this.contentEl.createEl("h4", { text: "Github repository for beta theme:" });
    this.contentEl.createEl("form", {}, (formEl) => {
      new import_obsidian5.Setting(formEl).addText((textEl) => {
        textEl.setPlaceholder("Repository (example: GitubUserName/repository-name");
        textEl.onChange((value) => {
          this.address = value.trim();
        });
        textEl.inputEl.addEventListener("keydown", (e) => __async(this, null, function* () {
          if (e.key === "Enter" && this.address !== " ") {
            e.preventDefault();
            yield this.submitForm();
          }
        }));
        textEl.inputEl.style.width = "100%";
        window.setTimeout(() => {
          const title = document.querySelector(".setting-item-info");
          if (title)
            title.remove();
          textEl.inputEl.focus();
        }, 10);
      });
      formEl.createDiv("modal-button-container", (buttonContainerEl) => {
        buttonContainerEl.createEl("button", { attr: { type: "button" }, text: "Never mind" }).addEventListener("click", () => this.close());
        buttonContainerEl.createEl("button", {
          attr: { type: "submit" },
          cls: "mod-cta",
          text: "Add Theme"
        });
      });
      formEl.addEventListener("submit", (e) => __async(this, null, function* () {
        e.preventDefault();
        if (this.address !== "")
          yield this.submitForm();
      }));
    });
  }
  onClose() {
    return __async(this, null, function* () {
      if (this.openSettingsTabAfterwards) {
        yield this.plugin.app.setting.open();
        yield this.plugin.app.setting.openTabById("obsidian42-brat");
      }
    });
  }
};

// src/ui/SettingsTab.ts
var BratSettingsTab = class extends import_obsidian6.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: this.plugin.appName });
    new import_obsidian6.Setting(containerEl).setName("Auto-update plugins at startup").setDesc("If enabled all beta plugins will be checked for updates each time Obsidian starts.").addToggle((cb) => {
      cb.setValue(this.plugin.settings.updateAtStartup);
      cb.onChange((value) => __async(this, null, function* () {
        this.plugin.settings.updateAtStartup = value;
        yield this.plugin.saveSettings();
      }));
    });
    new import_obsidian6.Setting(containerEl).setName("Auto-update themes at startup").setDesc("If enabled all beta themes will be checked for updates each time Obsidian starts.").addToggle((cb) => {
      cb.setValue(this.plugin.settings.updateThemesAtStartup);
      cb.onChange((value) => __async(this, null, function* () {
        this.plugin.settings.updateThemesAtStartup = value;
        yield this.plugin.saveSettings();
      }));
    });
    new import_obsidian6.Setting(containerEl).setName("Ribbon Button").setDesc("Toggle ribbon button off and on.").addToggle((cb) => {
      cb.setValue(this.plugin.settings.ribbonIconEnabled);
      cb.onChange((value) => __async(this, null, function* () {
        this.plugin.settings.ribbonIconEnabled = value;
        if (this.plugin.settings.ribbonIconEnabled === false)
          this.plugin.ribbonIcon.remove();
        else
          this.plugin.showRibbonButton();
        yield this.plugin.saveSettings();
      }));
    });
    containerEl.createEl("hr");
    containerEl.createEl("h2", { text: "Beta Plugin List" });
    containerEl.createEl("div", { text: `The following is a list of beta plugins added via the command palette "Add a beta plugin for testing". ` });
    containerEl.createEl("p");
    containerEl.createEl("div", { text: `Click the x button next to a plugin to remove it from the list.` });
    containerEl.createEl("p");
    containerEl.createEl("span").createEl("b", { text: "Note: " });
    containerEl.createSpan({ text: "This does not delete the plugin, this should be done from the  Community Plugins tab in Settings." });
    new import_obsidian6.Setting(containerEl).addButton((cb) => {
      cb.setButtonText("Add Beta plugin");
      cb.onClick(() => __async(this, null, function* () {
        this.plugin.app.setting.close();
        yield this.plugin.betaPlugins.displayAddNewPluginModal(true);
      }));
    });
    for (const bp of this.plugin.settings.pluginList) {
      new import_obsidian6.Setting(containerEl).setName(bp).addButton((btn) => {
        btn.setIcon("cross");
        btn.setTooltip("Delete this beta plugin");
        btn.onClick(() => __async(this, null, function* () {
          if (btn.buttonEl.textContent === "")
            btn.setButtonText("Click once more to confirm removal");
          else {
            btn.buttonEl.parentElement.parentElement.remove();
            yield this.plugin.betaPlugins.deletePlugin(bp);
          }
        }));
      });
    }
    containerEl.createEl("hr");
    containerEl.createEl("h2", { text: "Beta Themes List" });
    new import_obsidian6.Setting(containerEl).addButton((cb) => {
      cb.setButtonText("Add Beta Theme");
      cb.onClick(() => __async(this, null, function* () {
        this.plugin.app.setting.close();
        new AddNewTheme(this.plugin).open();
      }));
    });
    for (const bp of this.plugin.settings.themesList) {
      new import_obsidian6.Setting(containerEl).setName(bp.repo).addButton((btn) => {
        btn.setIcon("cross");
        btn.setTooltip("Delete this beta theme");
        btn.onClick(() => __async(this, null, function* () {
          if (btn.buttonEl.textContent === "")
            btn.setButtonText("Click once more to confirm removal");
          else {
            btn.buttonEl.parentElement.parentElement.remove();
            yield themesDelete(this.plugin, bp.repo);
          }
        }));
      });
    }
    containerEl.createEl("hr");
    containerEl.createEl("h2", { text: "Monitoring" });
    new import_obsidian6.Setting(containerEl).setName("Enable Notifications").setDesc("BRAT will provide popup notifications for its various activities. Turn this off means  no notifications from BRAT.").addToggle((cb) => {
      cb.setValue(this.plugin.settings.notificationsEnabled);
      cb.onChange((value) => __async(this, null, function* () {
        this.plugin.settings.notificationsEnabled = value;
        yield this.plugin.saveSettings();
      }));
    });
    new import_obsidian6.Setting(containerEl).setName("Enable Logging").setDesc("Plugin updates will be logged to a file in the log file.").addToggle((cb) => {
      cb.setValue(this.plugin.settings.loggingEnabled);
      cb.onChange((value) => __async(this, null, function* () {
        this.plugin.settings.loggingEnabled = value;
        yield this.plugin.saveSettings();
      }));
    });
    new import_obsidian6.Setting(this.containerEl).setName("BRAT Log File Location").setDesc("Logs will be saved to this file. Don't add .md to the file name.").addSearch((cb) => {
      cb.setPlaceholder("Example: BRAT-log").setValue(this.plugin.settings.loggingPath).onChange((new_folder) => __async(this, null, function* () {
        this.plugin.settings.loggingPath = new_folder;
        yield this.plugin.saveSettings();
      }));
    });
    new import_obsidian6.Setting(containerEl).setName("Enable Verbose Logging").setDesc("Get a lot  more information in  the log.").addToggle((cb) => {
      cb.setValue(this.plugin.settings.loggingVerboseEnabled);
      cb.onChange((value) => __async(this, null, function* () {
        this.plugin.settings.loggingVerboseEnabled = value;
        yield this.plugin.saveSettings();
      }));
    });
    new import_obsidian6.Setting(containerEl).setName("Debugging Mode").setDesc("Atomic Bomb level console logging. Can be used for troubleshoting and development.").addToggle((cb) => {
      cb.setValue(this.plugin.settings.debuggingMode);
      cb.onChange((value) => __async(this, null, function* () {
        this.plugin.settings.debuggingMode = value;
        yield this.plugin.saveSettings();
      }));
    });
  }
};

// src/ui/AddNewPluginModal.ts
var import_obsidian7 = __toModule(require("obsidian"));
var AddNewPluginModal = class extends import_obsidian7.Modal {
  constructor(plugin, betaPlugins, openSettingsTabAfterwards = false) {
    super(plugin.app);
    this.plugin = plugin;
    this.betaPlugins = betaPlugins;
    this.address = "";
    this.openSettingsTabAfterwards = openSettingsTabAfterwards;
  }
  submitForm() {
    return __async(this, null, function* () {
      if (this.address === "")
        return;
      const scrubbedAddress = this.address.replace("https://github.com/", "");
      if (yield existBetaPluginInList(this.plugin, scrubbedAddress)) {
        ToastMessage(this.plugin, `This plugin is already in the list for beta testing`, 10);
        return;
      }
      const result = yield this.betaPlugins.addPlugin(scrubbedAddress);
      if (result) {
        this.close();
      }
    });
  }
  onOpen() {
    this.contentEl.createEl("h4", { text: "Github repository for beta plugin:" });
    this.contentEl.createEl("form", {}, (formEl) => {
      new import_obsidian7.Setting(formEl).addText((textEl) => {
        textEl.setPlaceholder("Repository (example: TfTHacker/obsidian-brat");
        textEl.onChange((value) => {
          this.address = value.trim();
        });
        textEl.inputEl.addEventListener("keydown", (e) => __async(this, null, function* () {
          if (e.key === "Enter" && this.address !== " ") {
            e.preventDefault();
            yield this.submitForm();
          }
        }));
        textEl.inputEl.style.width = "100%";
        window.setTimeout(() => {
          const title = document.querySelector(".setting-item-info");
          if (title)
            title.remove();
          textEl.inputEl.focus();
        }, 10);
      });
      formEl.createDiv("modal-button-container", (buttonContainerEl) => {
        buttonContainerEl.createEl("button", { attr: { type: "button" }, text: "Never mind" }).addEventListener("click", () => this.close());
        buttonContainerEl.createEl("button", {
          attr: { type: "submit" },
          cls: "mod-cta",
          text: "Add Plugin"
        });
      });
      formEl.addEventListener("submit", (e) => __async(this, null, function* () {
        e.preventDefault();
        if (this.address !== "")
          yield this.submitForm();
      }));
    });
  }
  onClose() {
    return __async(this, null, function* () {
      if (this.openSettingsTabAfterwards) {
        yield this.plugin.app.setting.open();
        yield this.plugin.app.setting.openTabById("obsidian42-brat");
      }
    });
  }
};

// src/features/BetaPlugins.ts
var import_obsidian8 = __toModule(require("obsidian"));
var BetaPlugins = class {
  constructor(plugin) {
    this.plugin = plugin;
  }
  displayAddNewPluginModal(openSettingsTabAfterwards = false) {
    return __async(this, null, function* () {
      const newPlugin = new AddNewPluginModal(this.plugin, this, openSettingsTabAfterwards);
      newPlugin.open();
    });
  }
  validateRepository(repositoryPath, getBetaManifest = false, reportIssues = false) {
    return __async(this, null, function* () {
      const noticeTimeout = 15;
      const manifestJson = yield grabManifestJsonFromRepository(repositoryPath, !getBetaManifest);
      if (!manifestJson) {
        if (reportIssues)
          ToastMessage(this.plugin, `${repositoryPath}
This does not seem to be an obsidian plugin, as there is no manifest.json file.`, noticeTimeout);
        return null;
      }
      if (!("id" in manifestJson)) {
        if (reportIssues)
          ToastMessage(this.plugin, `${repositoryPath}
The plugin id attribute for the release is missing from the manifest file`, noticeTimeout);
        return null;
      }
      if (!("version" in manifestJson)) {
        if (reportIssues)
          ToastMessage(this.plugin, `${repositoryPath}
The version attribute for the release is missing from the manifest file`, noticeTimeout);
        return null;
      }
      return manifestJson;
    });
  }
  getAllReleaseFiles(repositoryPath, manifest, getManifest) {
    return __async(this, null, function* () {
      return {
        mainJs: yield grabReleaseFileFromRepository(repositoryPath, manifest.version, "main.js"),
        manifest: getManifest ? yield grabReleaseFileFromRepository(repositoryPath, manifest.version, "manifest.json") : null,
        styles: yield grabReleaseFileFromRepository(repositoryPath, manifest.version, "styles.css")
      };
    });
  }
  writeReleaseFilesToPluginFolder(betaPluginID, relFiles) {
    return __async(this, null, function* () {
      const pluginTargetFolderPath = (0, import_obsidian8.normalizePath)(this.plugin.app.vault.configDir + "/plugins/" + betaPluginID) + "/";
      const adapter = this.plugin.app.vault.adapter;
      if ((yield adapter.exists(pluginTargetFolderPath)) === false || !(yield adapter.exists(pluginTargetFolderPath + "manifest.json"))) {
        yield adapter.mkdir(pluginTargetFolderPath);
      }
      yield adapter.write(pluginTargetFolderPath + "main.js", relFiles.mainJs);
      yield adapter.write(pluginTargetFolderPath + "manifest.json", relFiles.manifest);
      if (relFiles.styles)
        yield adapter.write(pluginTargetFolderPath + "styles.css", relFiles.styles);
    });
  }
  addPlugin(repositoryPath, updatePluginFiles = false, seeIfUpdatedOnly = false, reportIfNotUpdted = false) {
    return __async(this, null, function* () {
      var _a;
      const noticeTimeout = 10;
      let primaryManifest = yield this.validateRepository(repositoryPath, true, false);
      const usingBetaManifest = primaryManifest ? true : false;
      if (usingBetaManifest === false)
        primaryManifest = yield this.validateRepository(repositoryPath, false, true);
      if (primaryManifest === null) {
        const msg = `${repositoryPath}
A manifest.json or manifest-beta.json file does not exist in the root directory of the repository. This plugin cannot be installed.`;
        this.plugin.log(msg, true);
        ToastMessage(this.plugin, `${msg}`, noticeTimeout);
        return false;
      }
      if (!primaryManifest.hasOwnProperty("version")) {
        const msg = `${repositoryPath}
The manifest${usingBetaManifest ? "-beta" : ""}.json file in the root directory of the repository does not have a version number in the file. This plugin cannot be installed.`;
        this.plugin.log(msg, true);
        ToastMessage(this.plugin, `${msg}`, noticeTimeout);
        return false;
      }
      const getRelease = () => __async(this, null, function* () {
        const rFiles = yield this.getAllReleaseFiles(repositoryPath, primaryManifest, usingBetaManifest);
        if (usingBetaManifest || rFiles.manifest === null)
          rFiles.manifest = JSON.stringify(primaryManifest);
        if (rFiles.mainJs === null) {
          const msg = `${repositoryPath}
The release is not complete and cannot be download. main.js is missing from the Release`;
          this.plugin.log(msg, true);
          ToastMessage(this.plugin, `${msg}`, noticeTimeout);
          return null;
        }
        return rFiles;
      });
      if (updatePluginFiles === false) {
        const releaseFiles = yield getRelease();
        if (releaseFiles === null)
          return;
        yield this.writeReleaseFilesToPluginFolder(primaryManifest.id, releaseFiles);
        yield addBetaPluginToList(this.plugin, repositoryPath);
        yield this.plugin.app.plugins.loadManifests();
        const msg = `${repositoryPath}
The plugin has been registered with BRAT. You may still need to enable it the Community Plugin List.`;
        this.plugin.log(msg, true);
        ToastMessage(this.plugin, msg, noticeTimeout);
      } else {
        const pluginTargetFolderPath = this.plugin.app.vault.configDir + "/plugins/" + primaryManifest.id + "/";
        let localManifestContents = null;
        try {
          localManifestContents = yield this.plugin.app.vault.adapter.read(pluginTargetFolderPath + "manifest.json");
        } catch (e) {
          if (e.errno === -4058) {
            yield this.addPlugin(repositoryPath, false, usingBetaManifest);
            return true;
          } else
            console.log("BRAT - Local Manifest Load", primaryManifest.id, JSON.stringify(e, null, 2));
        }
        const localManifestJSON = yield JSON.parse(localManifestContents);
        if (localManifestJSON.version !== primaryManifest.version) {
          const releaseFiles = yield getRelease();
          if (releaseFiles === null)
            return;
          if (seeIfUpdatedOnly) {
            const msg = `There is an update available for ${primaryManifest.id} from version ${localManifestJSON.version} to ${primaryManifest.version}. `;
            this.plugin.log(msg + `[Release Info](https://github.com/${repositoryPath}/releases/tag/${primaryManifest.version})`, false);
            ToastMessage(this.plugin, msg, 30, () => __async(this, null, function* () {
              window.open(`https://github.com/${repositoryPath}/releases/tag/${primaryManifest.version}`);
            }));
          } else {
            yield this.writeReleaseFilesToPluginFolder(primaryManifest.id, releaseFiles);
            yield this.plugin.app.plugins.loadManifests();
            if ((_a = this.plugin.app.plugins.plugins[primaryManifest.id]) == null ? void 0 : _a.manifest)
              yield this.reloadPlugin(primaryManifest.id);
            const msg = `${primaryManifest.id}
Plugin has been updated from version ${localManifestJSON.version} to ${primaryManifest.version}. `;
            this.plugin.log(msg + `[Release Info](https://github.com/${repositoryPath}/releases/tag/${primaryManifest.version})`, false);
            ToastMessage(this.plugin, msg, 30, () => __async(this, null, function* () {
              window.open(`https://github.com/${repositoryPath}/releases/tag/${primaryManifest.version}`);
            }));
          }
        } else if (reportIfNotUpdted)
          ToastMessage(this.plugin, `No update available for ${repositoryPath}`, 3);
      }
      return true;
    });
  }
  reloadPlugin(pluginName) {
    return __async(this, null, function* () {
      const plugins = this.plugin.app.plugins;
      try {
        yield plugins.disablePlugin(pluginName);
        yield plugins.enablePlugin(pluginName);
      } catch (e) {
        console.log("reload plugin", e);
      }
    });
  }
  updatePlugin(repositoryPath, onlyCheckDontUpdate = false, reportIfNotUpdted = false) {
    return __async(this, null, function* () {
      const result = yield this.addPlugin(repositoryPath, true, onlyCheckDontUpdate, reportIfNotUpdted);
      if (result === false && onlyCheckDontUpdate === false)
        ToastMessage(this.plugin, `${repositoryPath}
Update of plugin failed.`);
      return result;
    });
  }
  checkForUpdatesAndInstallUpdates(showInfo = false, onlyCheckDontUpdate = false) {
    return __async(this, null, function* () {
      if ((yield isConnectedToInternet()) === false) {
        console.log("BRAT: No internet detected.");
        return;
      }
      let newNotice;
      const msg1 = `Checking for plugin updates STARTED`;
      this.plugin.log(msg1, true);
      if (showInfo && this.plugin.settings.notificationsEnabled)
        newNotice = new import_obsidian8.Notice(`BRAT
${msg1}`, 3e4);
      for (const bp of this.plugin.settings.pluginList) {
        yield this.updatePlugin(bp, onlyCheckDontUpdate);
      }
      const msg2 = `Checking for plugin updates COMPLETED`;
      this.plugin.log(msg2, true);
      if (showInfo) {
        newNotice.hide();
        ToastMessage(this.plugin, msg2, 10);
      }
    });
  }
  deletePlugin(repositoryPath) {
    return __async(this, null, function* () {
      const msg = `Removed ${repositoryPath} from BRAT plugin list`;
      this.plugin.log(msg, true);
      this.plugin.settings.pluginList = this.plugin.settings.pluginList.filter((b) => b != repositoryPath);
      this.plugin.saveSettings();
    });
  }
  getEnabledDisabledPlugins(enabled) {
    const pl = this.plugin.app.plugins;
    const manifests = Object.values(pl.manifests);
    const enabledPlugins = Object.values(pl.plugins).map((p) => p.manifest);
    return enabled ? manifests.filter((manifest) => enabledPlugins.find((pluginName) => manifest.id === pluginName.id)) : manifests.filter((manifest) => !enabledPlugins.find((pluginName) => manifest.id === pluginName.id));
  }
};

// src/ui/icons.ts
var import_obsidian9 = __toModule(require("obsidian"));
function addIcons() {
  (0, import_obsidian9.addIcon)("BratIcon", `<path fill="currentColor" stroke="currentColor"  d="M 41.667969 41.667969 C 41.667969 39.367188 39.800781 37.5 37.5 37.5 C 35.199219 37.5 33.332031 39.367188 33.332031 41.667969 C 33.332031 43.96875 35.199219 45.832031 37.5 45.832031 C 39.800781 45.832031 41.667969 43.96875 41.667969 41.667969 Z M 60.417969 58.582031 C 59.460938 58.023438 58.320312 57.867188 57.25 58.148438 C 56.179688 58.429688 55.265625 59.125 54.707031 60.082031 C 53.746094 61.777344 51.949219 62.820312 50 62.820312 C 48.050781 62.820312 46.253906 61.777344 45.292969 60.082031 C 44.734375 59.125 43.820312 58.429688 42.75 58.148438 C 41.679688 57.867188 40.539062 58.023438 39.582031 58.582031 C 37.597656 59.726562 36.910156 62.257812 38.042969 64.25 C 40.5 68.53125 45.0625 71.171875 50 71.171875 C 54.9375 71.171875 59.5 68.53125 61.957031 64.25 C 63.089844 62.257812 62.402344 59.726562 60.417969 58.582031 Z M 62.5 37.5 C 60.199219 37.5 58.332031 39.367188 58.332031 41.667969 C 58.332031 43.96875 60.199219 45.832031 62.5 45.832031 C 64.800781 45.832031 66.667969 43.96875 66.667969 41.667969 C 66.667969 39.367188 64.800781 37.5 62.5 37.5 Z M 50 8.332031 C 26.988281 8.332031 8.332031 26.988281 8.332031 50 C 8.332031 73.011719 26.988281 91.667969 50 91.667969 C 73.011719 91.667969 91.667969 73.011719 91.667969 50 C 91.667969 26.988281 73.011719 8.332031 50 8.332031 Z M 50 83.332031 C 33.988281 83.402344 20.191406 72.078125 17.136719 56.363281 C 14.078125 40.644531 22.628906 24.976562 37.5 19.042969 C 37.457031 19.636719 37.457031 20.238281 37.5 20.832031 C 37.5 27.738281 43.097656 33.332031 50 33.332031 C 52.300781 33.332031 54.167969 31.46875 54.167969 29.167969 C 54.167969 26.867188 52.300781 25 50 25 C 47.699219 25 45.832031 23.132812 45.832031 20.832031 C 45.832031 18.53125 47.699219 16.667969 50 16.667969 C 68.410156 16.667969 83.332031 31.589844 83.332031 50 C 83.332031 68.410156 68.410156 83.332031 50 83.332031 Z M 50 83.332031 " />`);
}

// src/utils/logging.ts
var import_obsidian10 = __toModule(require("obsidian"));
var import_obsidian_daily_notes_interface = __toModule(require_main());
function logger(plugin, textToLog, verboseLoggingOn = false) {
  if (plugin.settings.debuggingMode)
    console.log("BRAT: " + textToLog);
  if (plugin.settings.loggingEnabled) {
    if (plugin.settings.loggingVerboseEnabled === false && verboseLoggingOn === true) {
      return;
    } else {
      const fileName = plugin.settings.loggingPath + ".md";
      const dateOutput = "[[" + (0, import_obsidian10.moment)().format((0, import_obsidian_daily_notes_interface.getDailyNoteSettings)().format).toString() + "]] " + (0, import_obsidian10.moment)().format("HH:mm");
      const machineName = import_obsidian10.Platform.isDesktop ? window.require("os").hostname() : "MOBILE";
      let output = dateOutput + " " + machineName + " " + textToLog.replace("\n", " ") + "\n\n";
      setTimeout(() => __async(this, null, function* () {
        if ((yield plugin.app.vault.adapter.exists(fileName)) === true) {
          const fileContents = yield plugin.app.vault.adapter.read(fileName);
          output = output + fileContents;
          const file = plugin.app.vault.getAbstractFileByPath(fileName);
          yield plugin.app.vault.modify(file, output);
        } else
          yield plugin.app.vault.create(fileName, output);
      }), 10);
    }
  }
}

// src/ui/PluginCommands.ts
var PluginCommands = class {
  constructor(plugin) {
    this.bratCommands = [
      {
        id: "BRAT-AddBetaPlugin",
        icon: "BratIcon",
        name: "Plugins: Add a beta plugin for testing",
        showInRibbon: true,
        callback: () => __async(this, null, function* () {
          yield this.plugin.betaPlugins.displayAddNewPluginModal();
        })
      },
      {
        id: "BRAT-checkForUpdatesAndUpdate",
        icon: "BratIcon",
        name: "Plugins: Check for updates to all beta plugins and UPDATE",
        showInRibbon: true,
        callback: () => __async(this, null, function* () {
          yield this.plugin.betaPlugins.checkForUpdatesAndInstallUpdates(true, false);
        })
      },
      {
        id: "BRAT-checkForUpdatesAndDontUpdate",
        icon: "BratIcon",
        name: "Plugins: Only check for updates to beta plugins, but don't Update",
        showInRibbon: true,
        callback: () => __async(this, null, function* () {
          yield this.plugin.betaPlugins.checkForUpdatesAndInstallUpdates(true, true);
        })
      },
      {
        id: "BRAT-updateOnePlugin",
        icon: "BratIcon",
        name: "Plugins: Choose a single plugin to update",
        showInRibbon: true,
        callback: () => __async(this, null, function* () {
          const pluginList = Object.values(this.plugin.settings.pluginList).map((m) => {
            return { display: m, info: m };
          });
          const gfs = new GenericFuzzySuggester(this.plugin);
          gfs.setSuggesterData(pluginList);
          yield gfs.display((results) => __async(this, null, function* () {
            const msg = `Checking for updates for ${results.info}`;
            this.plugin.log(msg, true);
            ToastMessage(this.plugin, `
${msg}`, 3);
            yield this.plugin.betaPlugins.updatePlugin(results.info, false, true);
          }));
        })
      },
      {
        id: "BRAT-restartPlugin",
        icon: "BratIcon",
        name: "Plugins: Restart a plugin that is already installed",
        showInRibbon: true,
        callback: () => __async(this, null, function* () {
          const pluginList = Object.values(this.plugin.app.plugins.manifests).map((m) => {
            return { display: m.id, info: m.id };
          });
          const gfs = new GenericFuzzySuggester(this.plugin);
          gfs.setSuggesterData(pluginList);
          yield gfs.display((results) => __async(this, null, function* () {
            ToastMessage(this.plugin, `${results.info}
Plugin reloading .....`, 5);
            yield this.plugin.betaPlugins.reloadPlugin(results.info);
          }));
        })
      },
      {
        id: "BRAT-disablePlugin",
        icon: "BratIcon",
        name: "Plugins: Disable a plugin - toggle it off",
        showInRibbon: true,
        callback: () => __async(this, null, function* () {
          const pluginList = this.plugin.betaPlugins.getEnabledDisabledPlugins(true).map((manifest) => {
            return { display: `${manifest.name} (${manifest.id})`, info: manifest.id };
          });
          const gfs = new GenericFuzzySuggester(this.plugin);
          gfs.setSuggesterData(pluginList);
          yield gfs.display((results) => __async(this, null, function* () {
            this.plugin.log(`${results.display} plugin disabled`, false);
            yield this.plugin.app.plugins.disablePlugin(results.info);
          }));
        })
      },
      {
        id: "BRAT-enablePlugin",
        icon: "BratIcon",
        name: "Plugins: Enable a plugin - toggle it on",
        showInRibbon: true,
        callback: () => __async(this, null, function* () {
          const pluginList = this.plugin.betaPlugins.getEnabledDisabledPlugins(false).map((manifest) => {
            return { display: `${manifest.name} (${manifest.id})`, info: manifest.id };
          });
          const gfs = new GenericFuzzySuggester(this.plugin);
          gfs.setSuggesterData(pluginList);
          yield gfs.display((results) => __async(this, null, function* () {
            this.plugin.log(`${results.display} plugin enabled`, false);
            yield this.plugin.app.plugins.enablePlugin(results.info);
          }));
        })
      },
      {
        id: "BRAT-openGitHubRepository",
        icon: "BratIcon",
        name: "Plugins: Open the GitHub repository for a plugin",
        showInRibbon: true,
        callback: () => __async(this, null, function* () {
          const communityPlugins = yield grabCommmunityPluginList();
          const communityPluginList = Object.values(communityPlugins).map((p) => {
            return { display: `Plugin: ${p.name}  (${p.repo})`, info: p.repo };
          });
          const bratList = Object.values(this.plugin.settings.pluginList).map((p) => {
            return { display: "BRAT: " + p, info: p };
          });
          communityPluginList.forEach((si) => bratList.push(si));
          const gfs = new GenericFuzzySuggester(this.plugin);
          gfs.setSuggesterData(bratList);
          yield gfs.display((results) => __async(this, null, function* () {
            if (results.info)
              window.open(`https://github.com/${results.info}`);
          }));
        })
      },
      {
        id: "BRAT-openGitHubRepoTheme",
        icon: "BratIcon",
        name: "Themes: Open the GitHub repository for a theme ",
        showInRibbon: true,
        callback: () => __async(this, null, function* () {
          const communityTheme = yield grabCommmunityThemesList();
          const communityThemeList = Object.values(communityTheme).map((p) => {
            return { display: `Theme: ${p.name}  (${p.repo})`, info: p.repo };
          });
          const gfs = new GenericFuzzySuggester(this.plugin);
          gfs.setSuggesterData(communityThemeList);
          yield gfs.display((results) => __async(this, null, function* () {
            if (results.info)
              window.open(`https://github.com/${results.info}`);
          }));
        })
      },
      {
        id: "BRAT-opentPluginSettings",
        icon: "BratIcon",
        name: "Plugins: Open Plugin Settings Tab",
        showInRibbon: true,
        callback: () => __async(this, null, function* () {
          const settings = this.plugin.app.setting;
          const listOfPluginSettingsTabs = Object.values(settings.pluginTabs).map((t) => {
            return { display: "Plugin: " + t.name, info: t.id };
          });
          const gfs = new GenericFuzzySuggester(this.plugin);
          const listOfCoreSettingsTabs = Object.values(settings.settingTabs).map((t) => {
            return { display: "Core: " + t.name, info: t.id };
          });
          listOfPluginSettingsTabs.forEach((si) => listOfCoreSettingsTabs.push(si));
          gfs.setSuggesterData(listOfCoreSettingsTabs);
          yield gfs.display((results) => __async(this, null, function* () {
            settings.open();
            settings.openTabById(results.info);
          }));
        })
      },
      {
        id: "BRAT-GrabCommunityTheme",
        icon: "BratIcon",
        name: "Themes: Grab a community theme",
        showInRibbon: true,
        callback: () => __async(this, null, function* () {
          return yield themesInstallFromCommunityList(this.plugin);
        })
      },
      {
        id: "BRAT-GrabBetaTheme",
        icon: "BratIcon",
        name: "Themes: Grab a beta theme for testing from a Github repository",
        showInRibbon: true,
        callback: () => __async(this, null, function* () {
          new AddNewTheme(this.plugin).open();
        })
      },
      {
        id: "BRAT-updateBetaThemes",
        icon: "BratIcon",
        name: "Themes: Update beta themes",
        showInRibbon: true,
        callback: () => __async(this, null, function* () {
          return yield themeseCheckAndUpdates(this.plugin, true);
        })
      },
      {
        id: "BRAT-switchTheme",
        icon: "BratIcon",
        name: "Themes: Switch Active Theme ",
        showInRibbon: true,
        callback: () => __async(this, null, function* () {
          const communityThemeList = Object.values(this.plugin.app.customCss.themes).map((t) => {
            return { display: t, info: t };
          });
          communityThemeList.unshift({ display: "Obsidian Default Theme", info: "" });
          const gfs = new GenericFuzzySuggester(this.plugin);
          gfs.setSuggesterData(communityThemeList);
          yield gfs.display((results) => __async(this, null, function* () {
            this.plugin.log(`Switched to theme ${results.display}`, false);
            this.plugin.app.customCss.setTheme(results.info);
          }));
        })
      },
      {
        id: "BRAT-allCommands",
        icon: "BratIcon",
        name: "All Commands list",
        showInRibbon: false,
        callback: () => __async(this, null, function* () {
          return this.ribbonDisplayCommands();
        })
      }
    ];
    this.plugin = plugin;
    this.bratCommands.forEach((item) => __async(this, null, function* () {
      this.plugin.addCommand({
        id: item.id,
        name: item.name,
        icon: item.icon,
        callback: () => __async(this, null, function* () {
          yield item.callback();
        })
      });
    }));
  }
  ribbonDisplayCommands() {
    return __async(this, null, function* () {
      const bratCommandList = [];
      this.bratCommands.forEach((cmd) => {
        if (cmd.showInRibbon)
          bratCommandList.push({ display: cmd.name, info: cmd.callback });
      });
      const gfs = new GenericFuzzySuggester(this.plugin);
      const settings = this.plugin.app.setting;
      const listOfCoreSettingsTabs = Object.values(settings.settingTabs).map((t) => {
        return {
          display: "Core: " + t.name,
          info: () => __async(this, null, function* () {
            settings.open();
            settings.openTabById(t.id);
          })
        };
      });
      const listOfPluginSettingsTabs = Object.values(settings.pluginTabs).map((t) => {
        return {
          display: "Plugin: " + t.name,
          info: () => __async(this, null, function* () {
            settings.open();
            settings.openTabById(t.id);
          })
        };
      });
      bratCommandList.push({ display: "---- Core Plugin Settings ----", info: () => __async(this, null, function* () {
        yield this.ribbonDisplayCommands();
      }) });
      listOfCoreSettingsTabs.forEach((si) => bratCommandList.push(si));
      bratCommandList.push({ display: "---- Plugin Settings ----", info: () => __async(this, null, function* () {
        yield this.ribbonDisplayCommands();
      }) });
      listOfPluginSettingsTabs.forEach((si) => bratCommandList.push(si));
      gfs.setSuggesterData(bratCommandList);
      yield gfs.display((results) => __async(this, null, function* () {
        return yield results.info();
      }));
    });
  }
};

// src/main.ts
var ThePlugin = class extends import_obsidian11.Plugin {
  constructor() {
    super(...arguments);
    this.appName = "Obsidian42 - Beta Reviewer's Auto-update Tool (BRAT)";
    this.appID = "obsidian42-brat";
  }
  onload() {
    return __async(this, null, function* () {
      console.log("loading Obsidian42 - BRAT");
      yield this.loadSettings();
      this.addSettingTab(new BratSettingsTab(this.app, this));
      this.betaPlugins = new BetaPlugins(this);
      this.commands = new PluginCommands(this);
      addIcons();
      if (this.settings.ribbonIconEnabled)
        this.showRibbonButton();
      this.app.workspace.onLayoutReady(() => {
        if (this.settings.updateAtStartup) {
          setTimeout(() => __async(this, null, function* () {
            yield this.betaPlugins.checkForUpdatesAndInstallUpdates(false);
          }), 6e4);
        }
        if (this.settings.updateThemesAtStartup) {
          setTimeout(() => __async(this, null, function* () {
            yield themeseCheckAndUpdates(this, false);
          }), 12e4);
        }
      });
    });
  }
  showRibbonButton() {
    this.ribbonIcon = this.addRibbonIcon("BratIcon", "BRAT", () => __async(this, null, function* () {
      return this.commands.ribbonDisplayCommands();
    }));
  }
  log(textToLog, verbose = false) {
    logger(this, textToLog, verbose);
  }
  onunload() {
    console.log("unloading " + this.appName);
  }
  loadSettings() {
    return __async(this, null, function* () {
      this.settings = Object.assign({}, DEFAULT_SETTINGS, yield this.loadData());
    });
  }
  saveSettings() {
    return __async(this, null, function* () {
      yield this.saveData(this.settings);
    });
  }
};
