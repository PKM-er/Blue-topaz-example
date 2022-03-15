'use strict';

var obsidian = require('obsidian');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var obsidian__default = /*#__PURE__*/_interopDefaultLegacy(obsidian);

const DEFAULT_DAILY_NOTE_FORMAT = "YYYY-MM-DD";
const DEFAULT_WEEKLY_NOTE_FORMAT = "gggg-[W]ww";
const DEFAULT_MONTHLY_NOTE_FORMAT = "YYYY-MM";
const DEFAULT_QUARTERLY_NOTE_FORMAT = "YYYY-[Q]Q";
const DEFAULT_YEARLY_NOTE_FORMAT = "YYYY";

function shouldUsePeriodicNotesSettings(periodicity) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const periodicNotes = window.app.plugins.getPlugin("periodic-notes");
    return periodicNotes && periodicNotes.settings?.[periodicity]?.enabled;
}
/**
 * Read the user settings for the `daily-notes` plugin
 * to keep behavior of creating a new note in-sync.
 */
function getDailyNoteSettings() {
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { internalPlugins, plugins } = window.app;
        if (shouldUsePeriodicNotesSettings("daily")) {
            const { format, folder, template } = plugins.getPlugin("periodic-notes")?.settings?.daily || {};
            return {
                format: format || DEFAULT_DAILY_NOTE_FORMAT,
                folder: folder?.trim() || "",
                template: template?.trim() || "",
            };
        }
        const { folder, format, template } = internalPlugins.getPluginById("daily-notes")?.instance?.options || {};
        return {
            format: format || DEFAULT_DAILY_NOTE_FORMAT,
            folder: folder?.trim() || "",
            template: template?.trim() || "",
        };
    }
    catch (err) {
        console.info("No custom daily note settings found!", err);
    }
}
/**
 * Read the user settings for the `weekly-notes` plugin
 * to keep behavior of creating a new note in-sync.
 */
function getWeeklyNoteSettings() {
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pluginManager = window.app.plugins;
        const calendarSettings = pluginManager.getPlugin("calendar")?.options;
        const periodicNotesSettings = pluginManager.getPlugin("periodic-notes")?.settings?.weekly;
        if (shouldUsePeriodicNotesSettings("weekly")) {
            return {
                format: periodicNotesSettings.format || DEFAULT_WEEKLY_NOTE_FORMAT,
                folder: periodicNotesSettings.folder?.trim() || "",
                template: periodicNotesSettings.template?.trim() || "",
            };
        }
        const settings = calendarSettings || {};
        return {
            format: settings.weeklyNoteFormat || DEFAULT_WEEKLY_NOTE_FORMAT,
            folder: settings.weeklyNoteFolder?.trim() || "",
            template: settings.weeklyNoteTemplate?.trim() || "",
        };
    }
    catch (err) {
        console.info("No custom weekly note settings found!", err);
    }
}
/**
 * Read the user settings for the `periodic-notes` plugin
 * to keep behavior of creating a new note in-sync.
 */
function getMonthlyNoteSettings() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pluginManager = window.app.plugins;
    try {
        const settings = (shouldUsePeriodicNotesSettings("monthly") &&
            pluginManager.getPlugin("periodic-notes")?.settings?.monthly) ||
            {};
        return {
            format: settings.format || DEFAULT_MONTHLY_NOTE_FORMAT,
            folder: settings.folder?.trim() || "",
            template: settings.template?.trim() || "",
        };
    }
    catch (err) {
        console.info("No custom monthly note settings found!", err);
    }
}
/**
 * Read the user settings for the `periodic-notes` plugin
 * to keep behavior of creating a new note in-sync.
 */
function getQuarterlyNoteSettings() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pluginManager = window.app.plugins;
    try {
        const settings = (shouldUsePeriodicNotesSettings("quarterly") &&
            pluginManager.getPlugin("periodic-notes")?.settings?.quarterly) ||
            {};
        return {
            format: settings.format || DEFAULT_QUARTERLY_NOTE_FORMAT,
            folder: settings.folder?.trim() || "",
            template: settings.template?.trim() || "",
        };
    }
    catch (err) {
        console.info("No custom quarterly note settings found!", err);
    }
}
/**
 * Read the user settings for the `periodic-notes` plugin
 * to keep behavior of creating a new note in-sync.
 */
function getYearlyNoteSettings() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pluginManager = window.app.plugins;
    try {
        const settings = (shouldUsePeriodicNotesSettings("yearly") &&
            pluginManager.getPlugin("periodic-notes")?.settings?.yearly) ||
            {};
        return {
            format: settings.format || DEFAULT_YEARLY_NOTE_FORMAT,
            folder: settings.folder?.trim() || "",
            template: settings.template?.trim() || "",
        };
    }
    catch (err) {
        console.info("No custom yearly note settings found!", err);
    }
}

// Credit: @creationix/path.js
function join(...partSegments) {
    // Split the inputs into a list of path commands.
    let parts = [];
    for (let i = 0, l = partSegments.length; i < l; i++) {
        parts = parts.concat(partSegments[i].split("/"));
    }
    // Interpret the path commands to get the new resolved path.
    const newParts = [];
    for (let i = 0, l = parts.length; i < l; i++) {
        const part = parts[i];
        // Remove leading and trailing slashes
        // Also remove "." segments
        if (!part || part === ".")
            continue;
        // Push new path segments.
        else
            newParts.push(part);
    }
    // Preserve the initial slash if there was one.
    if (parts[0] === "")
        newParts.unshift("");
    // Turn back into a single string path.
    return newParts.join("/");
}
async function ensureFolderExists(path) {
    const dirs = path.replace(/\\/g, "/").split("/");
    dirs.pop(); // remove basename
    if (dirs.length) {
        const dir = join(...dirs);
        if (!window.app.vault.getAbstractFileByPath(dir)) {
            await window.app.vault.createFolder(dir);
        }
    }
}
async function getNotePath(directory, filename) {
    if (!filename.endsWith(".md")) {
        filename += ".md";
    }
    const path = obsidian__default['default'].normalizePath(join(directory, filename));
    await ensureFolderExists(path);
    return path;
}
async function getTemplateInfo(template) {
    const { metadataCache, vault } = window.app;
    const templatePath = obsidian__default['default'].normalizePath(template);
    if (templatePath === "/") {
        return Promise.resolve(["", null]);
    }
    try {
        const templateFile = metadataCache.getFirstLinkpathDest(templatePath, "");
        const contents = await vault.cachedRead(templateFile);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const IFoldInfo = window.app.foldManager.load(templateFile);
        return [contents, IFoldInfo];
    }
    catch (err) {
        console.error(`Failed to read the daily note template '${templatePath}'`, err);
        new obsidian__default['default'].Notice("Failed to read the daily note template");
        return ["", null];
    }
}

/**
 * dateUID is a way of weekly identifying daily/weekly/monthly notes.
 * They are prefixed with the granularity to avoid ambiguity.
 */
function getDateUID(date, granularity = "day") {
    const ts = date.clone().startOf(granularity).format();
    return `${granularity}-${ts}`;
}
function removeEscapedCharacters(format) {
    return format.replace(/\[[^\]]*\]/g, ""); // remove everything within brackets
}
/**
 * XXX: When parsing dates that contain both week numbers and months,
 * Moment choses to ignore the week numbers. For the week dateUID, we
 * want the opposite behavior. Strip the MMM from the format to patch.
 */
function isFormatAmbiguous(format, granularity) {
    if (granularity === "week") {
        const cleanFormat = removeEscapedCharacters(format);
        return (/w{1,2}/i.test(cleanFormat) &&
            (/M{1,4}/.test(cleanFormat) || /D{1,4}/.test(cleanFormat)));
    }
    return false;
}
function getDateFromFile(file, granularity) {
    return getDateFromFilename(file.basename, granularity);
}
function getDateFromFilename(filename, granularity) {
    const getSettings = {
        day: getDailyNoteSettings,
        week: getWeeklyNoteSettings,
        month: getMonthlyNoteSettings,
        quarter: getQuarterlyNoteSettings,
        year: getYearlyNoteSettings,
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
                return window.moment(filename, 
                // If format contains week, remove day & month formatting
                format.replace(/M{1,4}/g, "").replace(/D{1,4}/g, ""), false);
            }
        }
    }
    return noteDate;
}

class DailyNotesFolderMissingError extends Error {
}
/**
 * This function mimics the behavior of the daily-notes plugin
 * so it will replace {{date}}, {{title}}, and {{time}} with the
 * formatted timestamp.
 *
 * Note: it has an added bonus that it's not 'today' specific.
 */
async function createDailyNote(date) {
    const app = window.app;
    const { vault } = app;
    const moment = window.moment;
    const { template, format, folder } = getDailyNoteSettings();
    const [templateContents, IFoldInfo] = await getTemplateInfo(template);
    const filename = date.format(format);
    const normalizedPath = await getNotePath(folder, filename);
    try {
        const createdFile = await vault.create(normalizedPath, templateContents
            .replace(/{{\s*date\s*}}/gi, filename)
            .replace(/{{\s*time\s*}}/gi, moment().format("HH:mm"))
            .replace(/{{\s*title\s*}}/gi, filename)
            .replace(/{{\s*(date|time)\s*(([+-]\d+)([yqmwdhs]))?\s*(:.+?)?}}/gi, (_, _timeOrDate, calc, timeDelta, unit, momentFormat) => {
            const now = moment();
            const currentDate = date.clone().set({
                hour: now.get("hour"),
                minute: now.get("minute"),
                second: now.get("second"),
            });
            if (calc) {
                currentDate.add(parseInt(timeDelta, 10), unit);
            }
            if (momentFormat) {
                return currentDate.format(momentFormat.substring(1).trim());
            }
            return currentDate.format(format);
        })
            .replace(/{{\s*yesterday\s*}}/gi, date.clone().subtract(1, "day").format(format))
            .replace(/{{\s*tomorrow\s*}}/gi, date.clone().add(1, "d").format(format)));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        app.foldManager.save(createdFile, IFoldInfo);
        return createdFile;
    }
    catch (err) {
        console.error(`Failed to create file: '${normalizedPath}'`, err);
        new obsidian__default['default'].Notice("Unable to create new file.");
    }
}
function getDailyNote(date, dailyNotes) {
    return dailyNotes[getDateUID(date, "day")] ?? null;
}
function getAllDailyNotes() {
    /**
     * Find all daily notes in the daily note folder
     */
    const { vault } = window.app;
    const { folder } = getDailyNoteSettings();
    const dailyNotesFolder = vault.getAbstractFileByPath(obsidian__default['default'].normalizePath(folder));
    if (!dailyNotesFolder) {
        throw new DailyNotesFolderMissingError("Failed to find daily notes folder");
    }
    const dailyNotes = {};
    obsidian__default['default'].Vault.recurseChildren(dailyNotesFolder, (note) => {
        if (note instanceof obsidian__default['default'].TFile) {
            const date = getDateFromFile(note, "day");
            if (date) {
                const dateString = getDateUID(date, "day");
                dailyNotes[dateString] = note;
            }
        }
    });
    return dailyNotes;
}

class WeeklyNotesFolderMissingError extends Error {
}
function getDaysOfWeek() {
    const { moment } = window;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let weekStart = moment.localeData()._week.dow;
    const daysOfWeek = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
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
async function createWeeklyNote(date) {
    const { vault } = window.app;
    const { template, format, folder } = getWeeklyNoteSettings();
    const [templateContents, IFoldInfo] = await getTemplateInfo(template);
    const filename = date.format(format);
    const normalizedPath = await getNotePath(folder, filename);
    try {
        const createdFile = await vault.create(normalizedPath, templateContents
            .replace(/{{\s*(date|time)\s*(([+-]\d+)([yqmwdhs]))?\s*(:.+?)?}}/gi, (_, _timeOrDate, calc, timeDelta, unit, momentFormat) => {
            const now = window.moment();
            const currentDate = date.clone().set({
                hour: now.get("hour"),
                minute: now.get("minute"),
                second: now.get("second"),
            });
            if (calc) {
                currentDate.add(parseInt(timeDelta, 10), unit);
            }
            if (momentFormat) {
                return currentDate.format(momentFormat.substring(1).trim());
            }
            return currentDate.format(format);
        })
            .replace(/{{\s*title\s*}}/gi, filename)
            .replace(/{{\s*time\s*}}/gi, window.moment().format("HH:mm"))
            .replace(/{{\s*(sunday|monday|tuesday|wednesday|thursday|friday|saturday)\s*:(.*?)}}/gi, (_, dayOfWeek, momentFormat) => {
            const day = getDayOfWeekNumericalValue(dayOfWeek);
            return date.weekday(day).format(momentFormat.trim());
        }));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        window.app.foldManager.save(createdFile, IFoldInfo);
        return createdFile;
    }
    catch (err) {
        console.error(`Failed to create file: '${normalizedPath}'`, err);
        new obsidian__default['default'].Notice("Unable to create new file.");
    }
}
function getWeeklyNote(date, weeklyNotes) {
    return weeklyNotes[getDateUID(date, "week")] ?? null;
}
function getAllWeeklyNotes() {
    const weeklyNotes = {};
    if (!appHasWeeklyNotesPluginLoaded()) {
        return weeklyNotes;
    }
    const { vault } = window.app;
    const { folder } = getWeeklyNoteSettings();
    const weeklyNotesFolder = vault.getAbstractFileByPath(obsidian__default['default'].normalizePath(folder));
    if (!weeklyNotesFolder) {
        throw new WeeklyNotesFolderMissingError("Failed to find weekly notes folder");
    }
    obsidian__default['default'].Vault.recurseChildren(weeklyNotesFolder, (note) => {
        if (note instanceof obsidian__default['default'].TFile) {
            const date = getDateFromFile(note, "week");
            if (date) {
                const dateString = getDateUID(date, "week");
                weeklyNotes[dateString] = note;
            }
        }
    });
    return weeklyNotes;
}

class MonthlyNotesFolderMissingError extends Error {
}
/**
 * This function mimics the behavior of the daily-notes plugin
 * so it will replace {{date}}, {{title}}, and {{time}} with the
 * formatted timestamp.
 *
 * Note: it has an added bonus that it's not 'today' specific.
 */
async function createMonthlyNote(date) {
    const { vault } = window.app;
    const { template, format, folder } = getMonthlyNoteSettings();
    const [templateContents, IFoldInfo] = await getTemplateInfo(template);
    const filename = date.format(format);
    const normalizedPath = await getNotePath(folder, filename);
    try {
        const createdFile = await vault.create(normalizedPath, templateContents
            .replace(/{{\s*(date|time)\s*(([+-]\d+)([yqmwdhs]))?\s*(:.+?)?}}/gi, (_, _timeOrDate, calc, timeDelta, unit, momentFormat) => {
            const now = window.moment();
            const currentDate = date.clone().set({
                hour: now.get("hour"),
                minute: now.get("minute"),
                second: now.get("second"),
            });
            if (calc) {
                currentDate.add(parseInt(timeDelta, 10), unit);
            }
            if (momentFormat) {
                return currentDate.format(momentFormat.substring(1).trim());
            }
            return currentDate.format(format);
        })
            .replace(/{{\s*date\s*}}/gi, filename)
            .replace(/{{\s*time\s*}}/gi, window.moment().format("HH:mm"))
            .replace(/{{\s*title\s*}}/gi, filename));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        window.app.foldManager.save(createdFile, IFoldInfo);
        return createdFile;
    }
    catch (err) {
        console.error(`Failed to create file: '${normalizedPath}'`, err);
        new obsidian__default['default'].Notice("Unable to create new file.");
    }
}
function getMonthlyNote(date, monthlyNotes) {
    return monthlyNotes[getDateUID(date, "month")] ?? null;
}
function getAllMonthlyNotes() {
    const monthlyNotes = {};
    if (!appHasMonthlyNotesPluginLoaded()) {
        return monthlyNotes;
    }
    const { vault } = window.app;
    const { folder } = getMonthlyNoteSettings();
    const monthlyNotesFolder = vault.getAbstractFileByPath(obsidian__default['default'].normalizePath(folder));
    if (!monthlyNotesFolder) {
        throw new MonthlyNotesFolderMissingError("Failed to find monthly notes folder");
    }
    obsidian__default['default'].Vault.recurseChildren(monthlyNotesFolder, (note) => {
        if (note instanceof obsidian__default['default'].TFile) {
            const date = getDateFromFile(note, "month");
            if (date) {
                const dateString = getDateUID(date, "month");
                monthlyNotes[dateString] = note;
            }
        }
    });
    return monthlyNotes;
}

class QuarterlyNotesFolderMissingError extends Error {
}
/**
 * This function mimics the behavior of the daily-notes plugin
 * so it will replace {{date}}, {{title}}, and {{time}} with the
 * formatted timestamp.
 *
 * Note: it has an added bonus that it's not 'today' specific.
 */
async function createQuarterlyNote(date) {
    const { vault } = window.app;
    const { template, format, folder } = getQuarterlyNoteSettings();
    const [templateContents, IFoldInfo] = await getTemplateInfo(template);
    const filename = date.format(format);
    const normalizedPath = await getNotePath(folder, filename);
    try {
        const createdFile = await vault.create(normalizedPath, templateContents
            .replace(/{{\s*(date|time)\s*(([+-]\d+)([yqmwdhs]))?\s*(:.+?)?}}/gi, (_, _timeOrDate, calc, timeDelta, unit, momentFormat) => {
            const now = window.moment();
            const currentDate = date.clone().set({
                hour: now.get("hour"),
                minute: now.get("minute"),
                second: now.get("second"),
            });
            if (calc) {
                currentDate.add(parseInt(timeDelta, 10), unit);
            }
            if (momentFormat) {
                return currentDate.format(momentFormat.substring(1).trim());
            }
            return currentDate.format(format);
        })
            .replace(/{{\s*date\s*}}/gi, filename)
            .replace(/{{\s*time\s*}}/gi, window.moment().format("HH:mm"))
            .replace(/{{\s*title\s*}}/gi, filename));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        window.app.foldManager.save(createdFile, IFoldInfo);
        return createdFile;
    }
    catch (err) {
        console.error(`Failed to create file: '${normalizedPath}'`, err);
        new obsidian__default['default'].Notice("Unable to create new file.");
    }
}
function getQuarterlyNote(date, quarterly) {
    return quarterly[getDateUID(date, "quarter")] ?? null;
}
function getAllQuarterlyNotes() {
    const quarterly = {};
    if (!appHasQuarterlyNotesPluginLoaded()) {
        return quarterly;
    }
    const { vault } = window.app;
    const { folder } = getQuarterlyNoteSettings();
    const quarterlyFolder = vault.getAbstractFileByPath(obsidian__default['default'].normalizePath(folder));
    if (!quarterlyFolder) {
        throw new QuarterlyNotesFolderMissingError("Failed to find quarterly notes folder");
    }
    obsidian__default['default'].Vault.recurseChildren(quarterlyFolder, (note) => {
        if (note instanceof obsidian__default['default'].TFile) {
            const date = getDateFromFile(note, "quarter");
            if (date) {
                const dateString = getDateUID(date, "quarter");
                quarterly[dateString] = note;
            }
        }
    });
    return quarterly;
}

class YearlyNotesFolderMissingError extends Error {
}
/**
 * This function mimics the behavior of the daily-notes plugin
 * so it will replace {{date}}, {{title}}, and {{time}} with the
 * formatted timestamp.
 *
 * Note: it has an added bonus that it's not 'today' specific.
 */
async function createYearlyNote(date) {
    const { vault } = window.app;
    const { template, format, folder } = getYearlyNoteSettings();
    const [templateContents, IFoldInfo] = await getTemplateInfo(template);
    const filename = date.format(format);
    const normalizedPath = await getNotePath(folder, filename);
    try {
        const createdFile = await vault.create(normalizedPath, templateContents
            .replace(/{{\s*(date|time)\s*(([+-]\d+)([yqmwdhs]))?\s*(:.+?)?}}/gi, (_, _timeOrDate, calc, timeDelta, unit, momentFormat) => {
            const now = window.moment();
            const currentDate = date.clone().set({
                hour: now.get("hour"),
                minute: now.get("minute"),
                second: now.get("second"),
            });
            if (calc) {
                currentDate.add(parseInt(timeDelta, 10), unit);
            }
            if (momentFormat) {
                return currentDate.format(momentFormat.substring(1).trim());
            }
            return currentDate.format(format);
        })
            .replace(/{{\s*date\s*}}/gi, filename)
            .replace(/{{\s*time\s*}}/gi, window.moment().format("HH:mm"))
            .replace(/{{\s*title\s*}}/gi, filename));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        window.app.foldManager.save(createdFile, IFoldInfo);
        return createdFile;
    }
    catch (err) {
        console.error(`Failed to create file: '${normalizedPath}'`, err);
        new obsidian__default['default'].Notice("Unable to create new file.");
    }
}
function getYearlyNote(date, yearlyNotes) {
    return yearlyNotes[getDateUID(date, "year")] ?? null;
}
function getAllYearlyNotes() {
    const yearlyNotes = {};
    if (!appHasYearlyNotesPluginLoaded()) {
        return yearlyNotes;
    }
    const { vault } = window.app;
    const { folder } = getYearlyNoteSettings();
    const yearlyNotesFolder = vault.getAbstractFileByPath(obsidian__default['default'].normalizePath(folder));
    if (!yearlyNotesFolder) {
        throw new YearlyNotesFolderMissingError("Failed to find yearly notes folder");
    }
    obsidian__default['default'].Vault.recurseChildren(yearlyNotesFolder, (note) => {
        if (note instanceof obsidian__default['default'].TFile) {
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
    const { app } = window;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dailyNotesPlugin = app.internalPlugins.plugins["daily-notes"];
    if (dailyNotesPlugin && dailyNotesPlugin.enabled) {
        return true;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const periodicNotes = app.plugins.getPlugin("periodic-notes");
    return periodicNotes && periodicNotes.settings?.daily?.enabled;
}
/**
 * XXX: "Weekly Notes" live in either the Calendar plugin or the periodic-notes plugin.
 * Check both until the weekly notes feature is removed from the Calendar plugin.
 */
function appHasWeeklyNotesPluginLoaded() {
    const { app } = window;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (app.plugins.getPlugin("calendar")) {
        return true;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const periodicNotes = app.plugins.getPlugin("periodic-notes");
    return periodicNotes && periodicNotes.settings?.weekly?.enabled;
}
function appHasMonthlyNotesPluginLoaded() {
    const { app } = window;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const periodicNotes = app.plugins.getPlugin("periodic-notes");
    return periodicNotes && periodicNotes.settings?.monthly?.enabled;
}
function appHasQuarterlyNotesPluginLoaded() {
    const { app } = window;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const periodicNotes = app.plugins.getPlugin("periodic-notes");
    return periodicNotes && periodicNotes.settings?.quarterly?.enabled;
}
function appHasYearlyNotesPluginLoaded() {
    const { app } = window;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const periodicNotes = app.plugins.getPlugin("periodic-notes");
    return periodicNotes && periodicNotes.settings?.yearly?.enabled;
}

var DEFAULT_DAILY_NOTE_FORMAT_1 = DEFAULT_DAILY_NOTE_FORMAT;
var DEFAULT_MONTHLY_NOTE_FORMAT_1 = DEFAULT_MONTHLY_NOTE_FORMAT;
var DEFAULT_QUARTERLY_NOTE_FORMAT_1 = DEFAULT_QUARTERLY_NOTE_FORMAT;
var DEFAULT_WEEKLY_NOTE_FORMAT_1 = DEFAULT_WEEKLY_NOTE_FORMAT;
var DEFAULT_YEARLY_NOTE_FORMAT_1 = DEFAULT_YEARLY_NOTE_FORMAT;
var appHasDailyNotesPluginLoaded_1 = appHasDailyNotesPluginLoaded;
var createDailyNote_1 = createDailyNote;
var createMonthlyNote_1 = createMonthlyNote;
var createQuarterlyNote_1 = createQuarterlyNote;
var createWeeklyNote_1 = createWeeklyNote;
var createYearlyNote_1 = createYearlyNote;
var getAllDailyNotes_1 = getAllDailyNotes;
var getAllMonthlyNotes_1 = getAllMonthlyNotes;
var getAllQuarterlyNotes_1 = getAllQuarterlyNotes;
var getAllWeeklyNotes_1 = getAllWeeklyNotes;
var getAllYearlyNotes_1 = getAllYearlyNotes;
var getDailyNote_1 = getDailyNote;
var getDateFromFile_1 = getDateFromFile;
var getMonthlyNote_1 = getMonthlyNote;
var getQuarterlyNote_1 = getQuarterlyNote;
var getWeeklyNote_1 = getWeeklyNote;
var getYearlyNote_1 = getYearlyNote;

const wrapAround = (value, size) => {
    return ((value % size) + size) % size;
};
function orderedValues(unordered) {
    return Object.keys(unordered)
        .sort()
        .reduce((acc, key) => {
        acc.push(unordered[key]);
        return acc;
    }, []);
}
function getCalendarPlugin() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return window.app.plugins.getPlugin("calendar");
}
function getDailyNotesPlugin() {
    var _a;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { internalPlugins } = window.app;
    return (_a = internalPlugins.getPluginById("daily-notes")) === null || _a === void 0 ? void 0 : _a.instance;
}
function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}
function hasLegacyDailyNoteSettings() {
    var _a;
    if (!appHasDailyNotesPluginLoaded_1()) {
        return false;
    }
    const options = (_a = getDailyNotesPlugin()) === null || _a === void 0 ? void 0 : _a.options;
    return !!(options.format || options.folder || options.template);
}
function getLegacyDailyNoteSettings() {
    var _a, _b;
    const options = getDailyNotesPlugin().options || {};
    return {
        format: options.format,
        folder: (_a = options.folder) === null || _a === void 0 ? void 0 : _a.trim(),
        template: (_b = options.template) === null || _b === void 0 ? void 0 : _b.trim(),
    };
}
function hasLegacyWeeklyNoteSettings() {
    const calendarPlugin = getCalendarPlugin();
    if (!calendarPlugin) {
        return false;
    }
    const options = calendarPlugin.options || {};
    return !!(options.weeklyNoteFormat ||
        options.weeklyNoteFolder ||
        options.weeklyNoteTemplate);
}
function getLegacyWeeklyNoteSettings() {
    var _a, _b;
    const options = getCalendarPlugin().options || {};
    return {
        format: options.weeklyNoteFormat || "",
        folder: ((_a = options.weeklyNoteFolder) === null || _a === void 0 ? void 0 : _a.trim()) || "",
        template: ((_b = options.weeklyNoteTemplate) === null || _b === void 0 ? void 0 : _b.trim()) || "",
    };
}
function isMacOS() {
    return navigator.appVersion.indexOf("Mac") !== -1;
}
function isMetaPressed(e) {
    return isMacOS() ? e.metaKey : e.ctrlKey;
}

const periodConfigs = {
    daily: {
        unitOfTime: "day",
        relativeUnit: "today",
        createNote: createDailyNote_1,
        getNote: getDailyNote_1,
        getAllNotes: getAllDailyNotes_1,
    },
    weekly: {
        unitOfTime: "week",
        relativeUnit: "this week",
        createNote: createWeeklyNote_1,
        getNote: getWeeklyNote_1,
        getAllNotes: getAllWeeklyNotes_1,
    },
    monthly: {
        unitOfTime: "month",
        relativeUnit: "this month",
        createNote: createMonthlyNote_1,
        getNote: getMonthlyNote_1,
        getAllNotes: getAllMonthlyNotes_1,
    },
    quarterly: {
        unitOfTime: "quarter",
        relativeUnit: "this quarter",
        createNote: createQuarterlyNote_1,
        getNote: getQuarterlyNote_1,
        getAllNotes: getAllQuarterlyNotes_1,
    },
    yearly: {
        unitOfTime: "year",
        relativeUnit: "this year",
        createNote: createYearlyNote_1,
        getNote: getYearlyNote_1,
        getAllNotes: getAllYearlyNotes_1,
    },
};
async function openPeriodicNote(periodicity, date, inNewSplit) {
    const config = periodConfigs[periodicity];
    const startOfPeriod = date.clone().startOf(config.unitOfTime);
    let allNotes;
    try {
        allNotes = config.getAllNotes();
    }
    catch (err) {
        console.error(`failed to find your ${periodicity} notes folder`, err);
        new obsidian.Notice(`Failed to find your ${periodicity} notes folder`);
        return;
    }
    let periodicNote = config.getNote(startOfPeriod, allNotes);
    if (!periodicNote) {
        periodicNote = await config.createNote(startOfPeriod);
    }
    await openFile(periodicNote, inNewSplit);
}
function getActiveFile() {
    const { workspace } = window.app;
    const activeView = workspace.getActiveViewOfType(obsidian.MarkdownView);
    return activeView === null || activeView === void 0 ? void 0 : activeView.file;
}
async function openFile(file, inNewSplit) {
    const { workspace } = window.app;
    const leaf = inNewSplit
        ? workspace.splitActiveLeaf()
        : workspace.getUnpinnedLeaf();
    await leaf.openFile(file, { active: true });
}
async function openNextNote(periodicity) {
    const config = periodConfigs[periodicity];
    const activeFile = getActiveFile();
    try {
        const allNotes = orderedValues(config.getAllNotes());
        const activeNoteIndex = allNotes.findIndex((file) => file === activeFile);
        const nextNote = allNotes[activeNoteIndex + 1];
        if (nextNote) {
            await openFile(nextNote, false);
        }
    }
    catch (err) {
        console.error(`failed to find your ${periodicity} notes folder`, err);
        new obsidian.Notice(`Failed to find your ${periodicity} notes folder`);
    }
}
async function openPrevNote(periodicity) {
    const config = periodConfigs[periodicity];
    const activeFile = getActiveFile();
    try {
        const allNotes = orderedValues(config.getAllNotes());
        const activeNoteIndex = allNotes.findIndex((file) => file === activeFile);
        const prevNote = allNotes[activeNoteIndex - 1];
        if (prevNote) {
            await openFile(prevNote, false);
        }
    }
    catch (err) {
        console.error(`failed to find your ${periodicity} notes folder`, err);
        new obsidian.Notice(`Failed to find your ${periodicity} notes folder`);
    }
}
function getCommands(periodicity) {
    const config = periodConfigs[periodicity];
    return [
        {
            id: `open-${periodicity}-note`,
            name: `Open ${periodicity} note`,
            callback: () => openPeriodicNote(periodicity, window.moment(), false),
        },
        {
            id: `next-${periodicity}-note`,
            name: `Open next ${periodicity} note`,
            checkCallback: (checking) => {
                if (checking) {
                    const activeFile = getActiveFile();
                    return !!(activeFile && getDateFromFile_1(activeFile, config.unitOfTime));
                }
                openNextNote(periodicity);
            },
        },
        {
            id: `prev-${periodicity}-note`,
            name: `Open previous ${periodicity} note`,
            checkCallback: (checking) => {
                if (checking) {
                    const activeFile = getActiveFile();
                    return !!(activeFile && getDateFromFile_1(activeFile, config.unitOfTime));
                }
                openPrevNote(periodicity);
            },
        },
    ];
}

const SETTINGS_UPDATED = "periodic-notes:settings-updated";

const calendarDayIcon = `
<g>
<path d="M24.78 3C22.646 3 20.9 4.746 20.9 6.88V10.76H9.26C7.223 10.76 5.38 12.312 5.38 14.543V92.628C5.38 93.695 6.059 94.859 6.835 95.344C7.611 95.926 8.387 96.12 9.26 96.12H90.74C91.613 96.12 92.389 95.926 93.165 95.344C93.941 94.762 94.62 93.695 94.62 92.628V14.543C94.62 12.506 92.971 10.76 90.934 10.76H79.1V6.88C79.1 4.746 77.354 3 75.22 3H71.34C69.206 3 67.46 4.746 67.46 6.88V10.76H32.54V6.88C32.54 4.746 30.794 3 28.66 3H24.78ZM24.78 6.88H28.66V18.52H24.78V6.88ZM71.34 6.88H75.22V18.52H71.34V6.88ZM9.26 14.64H20.9V18.52C20.9 20.654 22.646 22.4 24.78 22.4H28.66C30.794 22.4 32.54 20.654 32.54 18.52V14.64H67.46V18.52C67.46 20.654 69.206 22.4 71.34 22.4H75.22C77.354 22.4 79.1 20.654 79.1 18.52V14.64H90.74V28.22H9.26V14.64ZM9.26 32.1H90.74V92.24H9.26V32.1Z" fill="currentColor" stroke-width="1" stroke="currentColor"/>
<path d="M55.2539 79.0024H49.3613V55.3319C49.3613 52.5068 49.4282 50.2668 49.5619 48.6119C49.1775 49.0131 48.701 49.4561 48.1327 49.9408C47.581 50.4256 45.7088 51.9635 42.516 54.5546L39.5571 50.8185L50.3393 42.3432H55.2539V79.0024Z" fill="currentColor"/>
</g>
`;
const calendarWeekIcon = `
<g>
<path d="M24.78 3C22.646 3 20.9 4.746 20.9 6.88V10.76H9.26C7.223 10.76 5.38 12.312 5.38 14.543V92.628C5.38 93.695 6.059 94.859 6.835 95.344C7.611 95.926 8.387 96.12 9.26 96.12H90.74C91.613 96.12 92.389 95.926 93.165 95.344C93.941 94.762 94.62 93.695 94.62 92.628V14.543C94.62 12.506 92.971 10.76 90.934 10.76H79.1V6.88C79.1 4.746 77.354 3 75.22 3H71.34C69.206 3 67.46 4.746 67.46 6.88V10.76H32.54V6.88C32.54 4.746 30.794 3 28.66 3H24.78ZM24.78 6.88H28.66V18.52H24.78V6.88ZM71.34 6.88H75.22V18.52H71.34V6.88ZM9.26 14.64H20.9V18.52C20.9 20.654 22.646 22.4 24.78 22.4H28.66C30.794 22.4 32.54 20.654 32.54 18.52V14.64H67.46V18.52C67.46 20.654 69.206 22.4 71.34 22.4H75.22C77.354 22.4 79.1 20.654 79.1 18.52V14.64H90.74V28.22H9.26V14.64ZM9.26 32.1H90.74V92.24H9.26V32.1Z" fill="currentColor" stroke-width="1" stroke="currentColor"/>
<path d="M42.8799 78.3604L56.5679 48.6873H38.5698V43.7852H62.512V47.669L48.895 78.3604H42.8799Z" fill="currentColor"/>
</g>
`;
const calendarMonthIcon = `
<g>
<path d="M24.78 3C22.646 3 20.9 4.746 20.9 6.88V10.76H9.26C7.223 10.76 5.38 12.312 5.38 14.543V92.628C5.38 93.695 6.059 94.859 6.835 95.344C7.611 95.926 8.387 96.12 9.26 96.12H90.74C91.613 96.12 92.389 95.926 93.165 95.344C93.941 94.762 94.62 93.695 94.62 92.628V14.543C94.62 12.506 92.971 10.76 90.934 10.76H79.1V6.88C79.1 4.746 77.354 3 75.22 3H71.34C69.206 3 67.46 4.746 67.46 6.88V10.76H32.54V6.88C32.54 4.746 30.794 3 28.66 3H24.78ZM24.78 6.88H28.66V18.52H24.78V6.88ZM71.34 6.88H75.22V18.52H71.34V6.88ZM9.26 14.64H20.9V18.52C20.9 20.654 22.646 22.4 24.78 22.4H28.66C30.794 22.4 32.54 20.654 32.54 18.52V14.64H67.46V18.52C67.46 20.654 69.206 22.4 71.34 22.4H75.22C77.354 22.4 79.1 20.654 79.1 18.52V14.64H90.74V28.22H9.26V14.64ZM9.26 32.1H90.74V92.24H9.26V32.1Z" fill="currentColor" stroke-width="1" stroke="currentColor"/>
<path d="M51.3075 52.8546C51.3075 54.9201 50.7057 56.6437 49.5022 58.0256C48.2986 59.3926 46.6046 60.3139 44.4204 60.7894V60.9677C47.0356 61.2946 48.9969 62.1118 50.3045 63.4194C51.6121 64.7122 52.2659 66.4358 52.2659 68.5904C52.2659 71.7257 51.1589 74.1477 48.9449 75.8565C46.7309 77.5504 43.5808 78.3974 39.4946 78.3974C35.8838 78.3974 32.8377 77.8105 30.3562 76.6366V71.9783C31.7381 72.6618 33.2018 73.1893 34.7471 73.5608C36.2924 73.9322 37.7784 74.118 39.2048 74.118C41.7309 74.118 43.618 73.6499 44.8661 72.7138C46.1143 71.7777 46.7384 70.3289 46.7384 68.3675C46.7384 66.629 46.0474 65.3511 44.6655 64.5339C43.2836 63.7166 41.1142 63.308 38.1573 63.308H35.3266V59.0509H38.2018C43.4025 59.0509 46.0028 57.2529 46.0028 53.657C46.0028 52.2603 45.5496 51.183 44.6432 50.4252C43.7368 49.6674 42.3995 49.2885 40.6313 49.2885C39.398 49.2885 38.2093 49.4668 37.0651 49.8234C35.921 50.1652 34.5688 50.8412 33.0086 51.8517L30.4454 48.1963C33.4321 45.9972 36.9017 44.8976 40.8542 44.8976C44.138 44.8976 46.7012 45.6034 48.5437 47.015C50.3863 48.4266 51.3075 50.3732 51.3075 52.8546Z" fill="currentColor"/>
<path d="M69.6199 77.9516H64.382V56.9112C64.382 54.4 64.4415 52.4089 64.5603 50.9378C64.2186 51.2944 63.7951 51.6882 63.2899 52.1191C62.7995 52.55 61.1353 53.9171 58.2972 56.2202L55.6672 52.8992L65.2513 45.3657H69.6199V77.9516Z" fill="currentColor"/>
</g>
`;
const calendarQuarterIcon = `
<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M24.768 3C22.634 3 20.888 4.746 20.888 6.88V10.76H9.24804C7.21104 10.76 5.36804 12.312 5.36804 14.543V92.628C5.36804 93.695 6.04704 94.859 6.82304 95.344C7.59904 95.926 8.37504 96.12 9.24804 96.12H90.728C91.601 96.12 92.377 95.926 93.153 95.344C93.929 94.762 94.608 93.695 94.608 92.628V14.543C94.608 12.506 92.959 10.76 90.922 10.76H79.088V6.88C79.088 4.746 77.342 3 75.208 3H71.328C69.194 3 67.448 4.746 67.448 6.88V10.76H32.528V6.88C32.528 4.746 30.782 3 28.648 3H24.768ZM24.768 6.88H28.648V18.52H24.768V6.88ZM71.328 6.88H75.208V18.52H71.328V6.88ZM9.24804 14.64H20.888V18.52C20.888 20.654 22.634 22.4 24.768 22.4H28.648C30.782 22.4 32.528 20.654 32.528 18.52V14.64H67.448V18.52C67.448 20.654 69.194 22.4 71.328 22.4H75.208C77.342 22.4 79.088 20.654 79.088 18.52V14.64H90.728V28.22H9.24804V14.64ZM9.24804 32.1H90.728V92.24H9.24804V32.1Z" fill="currentColor" stroke="currentColor" stroke-width="0.17"/>
<path d="M63.2498 61.614C63.2498 65.5665 62.492 68.8949 60.9764 71.5993C59.4756 74.3036 57.2839 76.2056 54.4012 77.3052L62.2022 85.708H55.0253L48.8737 78.3973H48.0044C43.086 78.3973 39.3044 76.9411 36.6595 74.0287C34.0294 71.1015 32.7144 66.9484 32.7144 61.5694C32.7144 56.1904 34.0369 52.0596 36.6818 49.1769C39.3416 46.2943 43.1306 44.853 48.049 44.853C52.893 44.853 56.6375 46.3166 59.2824 49.2438C61.9273 52.171 63.2498 56.2944 63.2498 61.614ZM38.3757 61.614C38.3757 65.6259 39.1855 68.672 40.8052 70.7523C42.4248 72.8177 44.8246 73.8504 48.0044 73.8504C51.1694 73.8504 53.5543 72.8251 55.159 70.7746C56.7787 68.724 57.5885 65.6705 57.5885 61.614C57.5885 57.6169 56.7861 54.5856 55.1813 52.5202C53.5914 50.4548 51.214 49.4221 48.049 49.4221C44.8543 49.4221 42.4397 50.4548 40.8052 52.5202C39.1855 54.5856 38.3757 57.6169 38.3757 61.614Z" fill="currentColor"/>
</svg>
`;
const calendarYearIcon = `
<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M24.768 3C22.634 3 20.888 4.746 20.888 6.88V10.76H9.24804C7.21104 10.76 5.36804 12.312 5.36804 14.543V92.628C5.36804 93.695 6.04704 94.859 6.82304 95.344C7.59904 95.926 8.37504 96.12 9.24804 96.12H90.728C91.601 96.12 92.377 95.926 93.153 95.344C93.929 94.762 94.608 93.695 94.608 92.628V14.543C94.608 12.506 92.959 10.76 90.922 10.76H79.088V6.88C79.088 4.746 77.342 3 75.208 3H71.328C69.194 3 67.448 4.746 67.448 6.88V10.76H32.528V6.88C32.528 4.746 30.782 3 28.648 3H24.768ZM24.768 6.88H28.648V18.52H24.768V6.88ZM71.328 6.88H75.208V18.52H71.328V6.88ZM9.24804 14.64H20.888V18.52C20.888 20.654 22.634 22.4 24.768 22.4H28.648C30.782 22.4 32.528 20.654 32.528 18.52V14.64H67.448V18.52C67.448 20.654 69.194 22.4 71.328 22.4H75.208C77.342 22.4 79.088 20.654 79.088 18.52V14.64H90.728V28.22H9.24804V14.64ZM9.24804 32.1H90.728V92.24H9.24804V32.1Z" fill="currentColor" stroke="currentColor" stroke-width="0.17"/>
<path d="M49.2303 60.2321L56.9421 45.3656H62.7371L51.8826 65.3139V77.9515H46.5333V65.4922L35.7234 45.3656H41.5184L49.2303 60.2321Z" fill="currentColor"/>
</svg>
`;

function showFileMenu(app, settings, position) {
    const contextMenu = new obsidian.Menu(app);
    ["daily", "weekly", "monthly"]
        .filter((periodicity) => settings[periodicity].enabled)
        .forEach((periodicity) => {
        const config = periodConfigs[periodicity];
        contextMenu.addItem((item) => item
            .setTitle(`Open ${config.relativeUnit}`)
            .setIcon(`calendar-${config.unitOfTime}`)
            .onClick(() => {
            openPeriodicNote(periodicity, window.moment(), false);
        }));
    });
    contextMenu.showAtPosition(position);
}

function noop() { }
const identity = x => x;
function run(fn) {
    return fn();
}
function blank_object() {
    return Object.create(null);
}
function run_all(fns) {
    fns.forEach(run);
}
function is_function(thing) {
    return typeof thing === 'function';
}
function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}
function is_empty(obj) {
    return Object.keys(obj).length === 0;
}
function subscribe(store, ...callbacks) {
    if (store == null) {
        return noop;
    }
    const unsub = store.subscribe(...callbacks);
    return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function component_subscribe(component, store, callback) {
    component.$$.on_destroy.push(subscribe(store, callback));
}
function set_store_value(store, ret, value = ret) {
    store.set(value);
    return ret;
}

const is_client = typeof window !== 'undefined';
let now = is_client
    ? () => window.performance.now()
    : () => Date.now();
let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

const tasks = new Set();
function run_tasks(now) {
    tasks.forEach(task => {
        if (!task.c(now)) {
            tasks.delete(task);
            task.f();
        }
    });
    if (tasks.size !== 0)
        raf(run_tasks);
}
/**
 * Creates a new task that runs on each raf frame
 * until it returns a falsy value or is aborted
 */
function loop(callback) {
    let task;
    if (tasks.size === 0)
        raf(run_tasks);
    return {
        promise: new Promise(fulfill => {
            tasks.add(task = { c: callback, f: fulfill });
        }),
        abort() {
            tasks.delete(task);
        }
    };
}

function append(target, node) {
    target.appendChild(node);
}
function insert(target, node, anchor) {
    target.insertBefore(node, anchor || null);
}
function detach(node) {
    node.parentNode.removeChild(node);
}
function destroy_each(iterations, detaching) {
    for (let i = 0; i < iterations.length; i += 1) {
        if (iterations[i])
            iterations[i].d(detaching);
    }
}
function element(name) {
    return document.createElement(name);
}
function svg_element(name) {
    return document.createElementNS('http://www.w3.org/2000/svg', name);
}
function text(data) {
    return document.createTextNode(data);
}
function space() {
    return text(' ');
}
function empty() {
    return text('');
}
function listen(node, event, handler, options) {
    node.addEventListener(event, handler, options);
    return () => node.removeEventListener(event, handler, options);
}
function attr(node, attribute, value) {
    if (value == null)
        node.removeAttribute(attribute);
    else if (node.getAttribute(attribute) !== value)
        node.setAttribute(attribute, value);
}
function children(element) {
    return Array.from(element.childNodes);
}
function set_data(text, data) {
    data = '' + data;
    if (text.wholeText !== data)
        text.data = data;
}
function set_input_value(input, value) {
    input.value = value == null ? '' : value;
}
function toggle_class(element, name, toggle) {
    element.classList[toggle ? 'add' : 'remove'](name);
}
function custom_event(type, detail) {
    const e = document.createEvent('CustomEvent');
    e.initCustomEvent(type, false, false, detail);
    return e;
}

const active_docs = new Set();
let active = 0;
// https://github.com/darkskyapp/string-hash/blob/master/index.js
function hash$2(str) {
    let hash = 5381;
    let i = str.length;
    while (i--)
        hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
    return hash >>> 0;
}
function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
    const step = 16.666 / duration;
    let keyframes = '{\n';
    for (let p = 0; p <= 1; p += step) {
        const t = a + (b - a) * ease(p);
        keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
    }
    const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
    const name = `__svelte_${hash$2(rule)}_${uid}`;
    const doc = node.ownerDocument;
    active_docs.add(doc);
    const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = doc.head.appendChild(element('style')).sheet);
    const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
    if (!current_rules[name]) {
        current_rules[name] = true;
        stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
    }
    const animation = node.style.animation || '';
    node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
    active += 1;
    return name;
}
function delete_rule(node, name) {
    const previous = (node.style.animation || '').split(', ');
    const next = previous.filter(name
        ? anim => anim.indexOf(name) < 0 // remove specific animation
        : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
    );
    const deleted = previous.length - next.length;
    if (deleted) {
        node.style.animation = next.join(', ');
        active -= deleted;
        if (!active)
            clear_rules();
    }
}
function clear_rules() {
    raf(() => {
        if (active)
            return;
        active_docs.forEach(doc => {
            const stylesheet = doc.__svelte_stylesheet;
            let i = stylesheet.cssRules.length;
            while (i--)
                stylesheet.deleteRule(i);
            doc.__svelte_rules = {};
        });
        active_docs.clear();
    });
}

let current_component;
function set_current_component(component) {
    current_component = component;
}
function get_current_component() {
    if (!current_component)
        throw new Error('Function called outside component initialization');
    return current_component;
}
function onMount(fn) {
    get_current_component().$$.on_mount.push(fn);
}
function onDestroy(fn) {
    get_current_component().$$.on_destroy.push(fn);
}

const dirty_components = [];
const binding_callbacks = [];
const render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = Promise.resolve();
let update_scheduled = false;
function schedule_update() {
    if (!update_scheduled) {
        update_scheduled = true;
        resolved_promise.then(flush);
    }
}
function add_render_callback(fn) {
    render_callbacks.push(fn);
}
let flushing = false;
const seen_callbacks = new Set();
function flush() {
    if (flushing)
        return;
    flushing = true;
    do {
        // first, call beforeUpdate functions
        // and update components
        for (let i = 0; i < dirty_components.length; i += 1) {
            const component = dirty_components[i];
            set_current_component(component);
            update(component.$$);
        }
        set_current_component(null);
        dirty_components.length = 0;
        while (binding_callbacks.length)
            binding_callbacks.pop()();
        // then, once components are updated, call
        // afterUpdate functions. This may cause
        // subsequent updates...
        for (let i = 0; i < render_callbacks.length; i += 1) {
            const callback = render_callbacks[i];
            if (!seen_callbacks.has(callback)) {
                // ...so guard against infinite loops
                seen_callbacks.add(callback);
                callback();
            }
        }
        render_callbacks.length = 0;
    } while (dirty_components.length);
    while (flush_callbacks.length) {
        flush_callbacks.pop()();
    }
    update_scheduled = false;
    flushing = false;
    seen_callbacks.clear();
}
function update($$) {
    if ($$.fragment !== null) {
        $$.update();
        run_all($$.before_update);
        const dirty = $$.dirty;
        $$.dirty = [-1];
        $$.fragment && $$.fragment.p($$.ctx, dirty);
        $$.after_update.forEach(add_render_callback);
    }
}

let promise;
function wait() {
    if (!promise) {
        promise = Promise.resolve();
        promise.then(() => {
            promise = null;
        });
    }
    return promise;
}
function dispatch(node, direction, kind) {
    node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
}
const outroing = new Set();
let outros;
function group_outros() {
    outros = {
        r: 0,
        c: [],
        p: outros // parent group
    };
}
function check_outros() {
    if (!outros.r) {
        run_all(outros.c);
    }
    outros = outros.p;
}
function transition_in(block, local) {
    if (block && block.i) {
        outroing.delete(block);
        block.i(local);
    }
}
function transition_out(block, local, detach, callback) {
    if (block && block.o) {
        if (outroing.has(block))
            return;
        outroing.add(block);
        outros.c.push(() => {
            outroing.delete(block);
            if (callback) {
                if (detach)
                    block.d(1);
                callback();
            }
        });
        block.o(local);
    }
}
const null_transition = { duration: 0 };
function create_in_transition(node, fn, params) {
    let config = fn(node, params);
    let running = false;
    let animation_name;
    let task;
    let uid = 0;
    function cleanup() {
        if (animation_name)
            delete_rule(node, animation_name);
    }
    function go() {
        const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
        if (css)
            animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
        tick(0, 1);
        const start_time = now() + delay;
        const end_time = start_time + duration;
        if (task)
            task.abort();
        running = true;
        add_render_callback(() => dispatch(node, true, 'start'));
        task = loop(now => {
            if (running) {
                if (now >= end_time) {
                    tick(1, 0);
                    dispatch(node, true, 'end');
                    cleanup();
                    return running = false;
                }
                if (now >= start_time) {
                    const t = easing((now - start_time) / duration);
                    tick(t, 1 - t);
                }
            }
            return running;
        });
    }
    let started = false;
    return {
        start() {
            if (started)
                return;
            delete_rule(node);
            if (is_function(config)) {
                config = config();
                wait().then(go);
            }
            else {
                go();
            }
        },
        invalidate() {
            started = false;
        },
        end() {
            if (running) {
                cleanup();
                running = false;
            }
        }
    };
}
function create_out_transition(node, fn, params) {
    let config = fn(node, params);
    let running = true;
    let animation_name;
    const group = outros;
    group.r += 1;
    function go() {
        const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
        if (css)
            animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
        const start_time = now() + delay;
        const end_time = start_time + duration;
        add_render_callback(() => dispatch(node, false, 'start'));
        loop(now => {
            if (running) {
                if (now >= end_time) {
                    tick(0, 1);
                    dispatch(node, false, 'end');
                    if (!--group.r) {
                        // this will result in `end()` being called,
                        // so we don't need to clean up here
                        run_all(group.c);
                    }
                    return false;
                }
                if (now >= start_time) {
                    const t = easing((now - start_time) / duration);
                    tick(1 - t, t);
                }
            }
            return running;
        });
    }
    if (is_function(config)) {
        wait().then(() => {
            // @ts-ignore
            config = config();
            go();
        });
    }
    else {
        go();
    }
    return {
        end(reset) {
            if (reset && config.tick) {
                config.tick(1, 0);
            }
            if (running) {
                if (animation_name)
                    delete_rule(node, animation_name);
                running = false;
            }
        }
    };
}
function create_component(block) {
    block && block.c();
}
function mount_component(component, target, anchor, customElement) {
    const { fragment, on_mount, on_destroy, after_update } = component.$$;
    fragment && fragment.m(target, anchor);
    if (!customElement) {
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
    }
    after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
    const $$ = component.$$;
    if ($$.fragment !== null) {
        run_all($$.on_destroy);
        $$.fragment && $$.fragment.d(detaching);
        // TODO null out other refs, including component.$$ (but need to
        // preserve final state?)
        $$.on_destroy = $$.fragment = null;
        $$.ctx = [];
    }
}
function make_dirty(component, i) {
    if (component.$$.dirty[0] === -1) {
        dirty_components.push(component);
        schedule_update();
        component.$$.dirty.fill(0);
    }
    component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
}
function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
    const parent_component = current_component;
    set_current_component(component);
    const $$ = component.$$ = {
        fragment: null,
        ctx: null,
        // state
        props,
        update: noop,
        not_equal,
        bound: blank_object(),
        // lifecycle
        on_mount: [],
        on_destroy: [],
        on_disconnect: [],
        before_update: [],
        after_update: [],
        context: new Map(parent_component ? parent_component.$$.context : []),
        // everything else
        callbacks: blank_object(),
        dirty,
        skip_bound: false
    };
    let ready = false;
    $$.ctx = instance
        ? instance(component, options.props || {}, (i, ret, ...rest) => {
            const value = rest.length ? rest[0] : ret;
            if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                if (!$$.skip_bound && $$.bound[i])
                    $$.bound[i](value);
                if (ready)
                    make_dirty(component, i);
            }
            return ret;
        })
        : [];
    $$.update();
    ready = true;
    run_all($$.before_update);
    // `false` as a special case of no DOM component
    $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
    if (options.target) {
        if (options.hydrate) {
            const nodes = children(options.target);
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.l(nodes);
            nodes.forEach(detach);
        }
        else {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.c();
        }
        if (options.intro)
            transition_in(component.$$.fragment);
        mount_component(component, options.target, options.anchor, options.customElement);
        flush();
    }
    set_current_component(parent_component);
}
/**
 * Base class for Svelte components. Used when dev=false.
 */
class SvelteComponent {
    $destroy() {
        destroy_component(this, 1);
        this.$destroy = noop;
    }
    $on(type, callback) {
        const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
        callbacks.push(callback);
        return () => {
            const index = callbacks.indexOf(callback);
            if (index !== -1)
                callbacks.splice(index, 1);
        };
    }
    $set($$props) {
        if (this.$$set && !is_empty($$props)) {
            this.$$.skip_bound = true;
            this.$$set($$props);
            this.$$.skip_bound = false;
        }
    }
}

const subscriber_queue = [];
/**
 * Create a `Writable` store that allows both updating and reading by subscription.
 * @param {*=}value initial value
 * @param {StartStopNotifier=}start start and stop notifications for subscriptions
 */
function writable(value, start = noop) {
    let stop;
    const subscribers = [];
    function set(new_value) {
        if (safe_not_equal(value, new_value)) {
            value = new_value;
            if (stop) { // store is ready
                const run_queue = !subscriber_queue.length;
                for (let i = 0; i < subscribers.length; i += 1) {
                    const s = subscribers[i];
                    s[1]();
                    subscriber_queue.push(s, value);
                }
                if (run_queue) {
                    for (let i = 0; i < subscriber_queue.length; i += 2) {
                        subscriber_queue[i][0](subscriber_queue[i + 1]);
                    }
                    subscriber_queue.length = 0;
                }
            }
        }
    }
    function update(fn) {
        set(fn(value));
    }
    function subscribe(run, invalidate = noop) {
        const subscriber = [run, invalidate];
        subscribers.push(subscriber);
        if (subscribers.length === 1) {
            stop = start(set) || noop;
        }
        run(value);
        return () => {
            const index = subscribers.indexOf(subscriber);
            if (index !== -1) {
                subscribers.splice(index, 1);
            }
            if (subscribers.length === 0) {
                stop();
                stop = null;
            }
        };
    }
    return { set, update, subscribe };
}

function cubicOut(t) {
    const f = t - 1.0;
    return f * f * f + 1.0;
}

function slide(node, { delay = 0, duration = 400, easing = cubicOut } = {}) {
    const style = getComputedStyle(node);
    const opacity = +style.opacity;
    const height = parseFloat(style.height);
    const padding_top = parseFloat(style.paddingTop);
    const padding_bottom = parseFloat(style.paddingBottom);
    const margin_top = parseFloat(style.marginTop);
    const margin_bottom = parseFloat(style.marginBottom);
    const border_top_width = parseFloat(style.borderTopWidth);
    const border_bottom_width = parseFloat(style.borderBottomWidth);
    return {
        delay,
        duration,
        easing,
        css: t => 'overflow: hidden;' +
            `opacity: ${Math.min(t * 20, 1) * opacity};` +
            `height: ${t * height}px;` +
            `padding-top: ${t * padding_top}px;` +
            `padding-bottom: ${t * padding_bottom}px;` +
            `margin-top: ${t * margin_top}px;` +
            `margin-bottom: ${t * margin_bottom}px;` +
            `border-top-width: ${t * border_top_width}px;` +
            `border-bottom-width: ${t * border_bottom_width}px;`
    };
}

/* src/settings/Checkmark.svelte generated by Svelte v3.35.0 */

function add_css$1() {
	var style = element("style");
	style.id = "svelte-1q3q9tf-style";
	style.textContent = ".check.svelte-1q3q9tf{margin-left:6px;width:12px;height:12px}";
	append(document.head, style);
}

function create_fragment$5(ctx) {
	let svg;
	let path;

	return {
		c() {
			svg = svg_element("svg");
			path = svg_element("path");
			attr(path, "fill", "currentColor");
			attr(path, "d", "M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z");
			attr(svg, "aria-hidden", "true");
			attr(svg, "focusable", "false");
			attr(svg, "class", "check svelte-1q3q9tf");
			attr(svg, "data-icon", "check");
			attr(svg, "role", "img");
			attr(svg, "xmlns", "http://www.w3.org/2000/svg");
			attr(svg, "viewBox", "0 0 512 512");
		},
		m(target, anchor) {
			insert(target, svg, anchor);
			append(svg, path);
		},
		p: noop,
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(svg);
		}
	};
}

class Checkmark extends SvelteComponent {
	constructor(options) {
		super();
		if (!document.getElementById("svelte-1q3q9tf-style")) add_css$1();
		init(this, options, null, create_fragment$5, safe_not_equal, {});
	}
}

/* src/settings/GettingStartedBanner.svelte generated by Svelte v3.35.0 */

function add_css() {
	var style = element("style");
	style.id = "svelte-1alo0m9-style";
	style.textContent = "button.svelte-1alo0m9{display:flex;align-items:center}";
	append(document.head, style);
}

// (20:2) {#if hasDailyNoteSettings}
function create_if_block_3(ctx) {
	let div2;
	let div0;
	let h4;
	let t1;
	let t2;
	let div1;
	let current_block_type_index;
	let if_block1;
	let current;

	function select_block_type(ctx, dirty) {
		if (/*$settings*/ ctx[5].hasMigratedDailyNoteSettings) return create_if_block_5;
		return create_else_block_2;
	}

	let current_block_type = select_block_type(ctx);
	let if_block0 = current_block_type(ctx);
	const if_block_creators = [create_if_block_4, create_else_block_1];
	const if_blocks = [];

	function select_block_type_1(ctx, dirty) {
		if (/*$settings*/ ctx[5].hasMigratedDailyNoteSettings) return 0;
		return 1;
	}

	current_block_type_index = select_block_type_1(ctx);
	if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

	return {
		c() {
			div2 = element("div");
			div0 = element("div");
			h4 = element("h4");
			h4.textContent = "Daily Notes plugin is enabled";
			t1 = space();
			if_block0.c();
			t2 = space();
			div1 = element("div");
			if_block1.c();
			attr(div0, "class", "setting-item-info");
			attr(div1, "class", "setting-item-control");
			attr(div2, "class", "setting-item");
		},
		m(target, anchor) {
			insert(target, div2, anchor);
			append(div2, div0);
			append(div0, h4);
			append(div0, t1);
			if_block0.m(div0, null);
			append(div2, t2);
			append(div2, div1);
			if_blocks[current_block_type_index].m(div1, null);
			current = true;
		},
		p(ctx, dirty) {
			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
				if_block0.d(1);
				if_block0 = current_block_type(ctx);

				if (if_block0) {
					if_block0.c();
					if_block0.m(div0, null);
				}
			}

			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type_1(ctx);

			if (current_block_type_index === previous_block_index) {
				if_blocks[current_block_type_index].p(ctx, dirty);
			} else {
				group_outros();

				transition_out(if_blocks[previous_block_index], 1, 1, () => {
					if_blocks[previous_block_index] = null;
				});

				check_outros();
				if_block1 = if_blocks[current_block_type_index];

				if (!if_block1) {
					if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
					if_block1.c();
				} else {
					if_block1.p(ctx, dirty);
				}

				transition_in(if_block1, 1);
				if_block1.m(div1, null);
			}
		},
		i(local) {
			if (current) return;
			transition_in(if_block1);
			current = true;
		},
		o(local) {
			transition_out(if_block1);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(div2);
			if_block0.d();
			if_blocks[current_block_type_index].d();
		}
	};
}

// (31:8) {:else}
function create_else_block_2(ctx) {
	let p;

	return {
		c() {
			p = element("p");
			p.textContent = "You are currently using the core Daily Notes plugin. You can migrate\n            those settings over to Periodic Notes to enjoy the same\n            functionality as well as some notable improvements";
			attr(p, "class", "setting-item-description");
		},
		m(target, anchor) {
			insert(target, p, anchor);
		},
		d(detaching) {
			if (detaching) detach(p);
		}
	};
}

// (24:8) {#if $settings.hasMigratedDailyNoteSettings}
function create_if_block_5(ctx) {
	let p;

	return {
		c() {
			p = element("p");

			p.innerHTML = `You have successfully migrated your daily notes settings. You can
            now disable the Daily Notes core plugin to avoid any confusion.<br/>If you have an custom hotkeys for daily notes, make sure to update
            them to use the new &quot;Periodic Notes&quot; commands.`;

			attr(p, "class", "setting-item-description");
		},
		m(target, anchor) {
			insert(target, p, anchor);
		},
		d(detaching) {
			if (detaching) detach(p);
		}
	};
}

// (42:8) {:else}
function create_else_block_1(ctx) {
	let button;
	let mounted;
	let dispose;

	return {
		c() {
			button = element("button");
			button.textContent = "Migrate";
			attr(button, "class", "mod-cta svelte-1alo0m9");
		},
		m(target, anchor) {
			insert(target, button, anchor);

			if (!mounted) {
				dispose = listen(button, "click", function () {
					if (is_function(/*migrateDailyNoteSettings*/ ctx[2])) /*migrateDailyNoteSettings*/ ctx[2].apply(this, arguments);
				});

				mounted = true;
			}
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(button);
			mounted = false;
			dispose();
		}
	};
}

// (40:8) {#if $settings.hasMigratedDailyNoteSettings}
function create_if_block_4(ctx) {
	let button;
	let t;
	let checkmark;
	let current;
	checkmark = new Checkmark({});

	return {
		c() {
			button = element("button");
			t = text("Migrated ");
			create_component(checkmark.$$.fragment);
			button.disabled = true;
			attr(button, "class", "svelte-1alo0m9");
		},
		m(target, anchor) {
			insert(target, button, anchor);
			append(button, t);
			mount_component(checkmark, button, null);
			current = true;
		},
		p: noop,
		i(local) {
			if (current) return;
			transition_in(checkmark.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(checkmark.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(button);
			destroy_component(checkmark);
		}
	};
}

// (51:2) {#if hasWeeklyNoteSettings}
function create_if_block_1$2(ctx) {
	let div2;
	let div0;
	let t3;
	let div1;
	let current_block_type_index;
	let if_block;
	let current;
	const if_block_creators = [create_if_block_2, create_else_block];
	const if_blocks = [];

	function select_block_type_2(ctx, dirty) {
		if (/*$settings*/ ctx[5].hasMigratedWeeklyNoteSettings) return 0;
		return 1;
	}

	current_block_type_index = select_block_type_2(ctx);
	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

	return {
		c() {
			div2 = element("div");
			div0 = element("div");

			div0.innerHTML = `<h4>Weekly Note settings migrated</h4> 
        <p class="setting-item-description">Your existing weekly-note settings from the Calendar plugin have been
          migrated over automatically. The functionality will be removed from
          the Calendar plugin in the future.</p>`;

			t3 = space();
			div1 = element("div");
			if_block.c();
			attr(div0, "class", "setting-item-info");
			attr(div1, "class", "setting-item-control");
			attr(div2, "class", "setting-item");
		},
		m(target, anchor) {
			insert(target, div2, anchor);
			append(div2, div0);
			append(div2, t3);
			append(div2, div1);
			if_blocks[current_block_type_index].m(div1, null);
			current = true;
		},
		p(ctx, dirty) {
			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type_2(ctx);

			if (current_block_type_index !== previous_block_index) {
				group_outros();

				transition_out(if_blocks[previous_block_index], 1, 1, () => {
					if_blocks[previous_block_index] = null;
				});

				check_outros();
				if_block = if_blocks[current_block_type_index];

				if (!if_block) {
					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
					if_block.c();
				}

				transition_in(if_block, 1);
				if_block.m(div1, null);
			}
		},
		i(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o(local) {
			transition_out(if_block);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(div2);
			if_blocks[current_block_type_index].d();
		}
	};
}

// (67:8) {:else}
function create_else_block(ctx) {
	let button;

	return {
		c() {
			button = element("button");
			button.textContent = "Migrate";
			attr(button, "class", "mod-cta svelte-1alo0m9");
		},
		m(target, anchor) {
			insert(target, button, anchor);
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(button);
		}
	};
}

// (62:8) {#if $settings.hasMigratedWeeklyNoteSettings}
function create_if_block_2(ctx) {
	let button;
	let t;
	let checkmark;
	let current;
	checkmark = new Checkmark({});

	return {
		c() {
			button = element("button");
			t = text("Migrated\n            ");
			create_component(checkmark.$$.fragment);
			button.disabled = true;
			attr(button, "class", "svelte-1alo0m9");
		},
		m(target, anchor) {
			insert(target, button, anchor);
			append(button, t);
			mount_component(checkmark, button, null);
			current = true;
		},
		i(local) {
			if (current) return;
			transition_in(checkmark.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(checkmark.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(button);
			destroy_component(checkmark);
		}
	};
}

// (74:2) {#if !hasDailyNoteSettings && !hasWeeklyNoteSettings}
function create_if_block$4(ctx) {
	let p;

	return {
		c() {
			p = element("p");
			p.textContent = "With this plugin, you can quickly create and navigate to daily, weekly,\n      and monthly notes. Enable them below to get started.";
		},
		m(target, anchor) {
			insert(target, p, anchor);
		},
		d(detaching) {
			if (detaching) detach(p);
		}
	};
}

function create_fragment$4(ctx) {
	let div;
	let h3;
	let t1;
	let t2;
	let t3;
	let t4;
	let button;
	let div_outro;
	let current;
	let mounted;
	let dispose;
	let if_block0 = /*hasDailyNoteSettings*/ ctx[3] && create_if_block_3(ctx);
	let if_block1 = /*hasWeeklyNoteSettings*/ ctx[4] && create_if_block_1$2(ctx);
	let if_block2 = !/*hasDailyNoteSettings*/ ctx[3] && !/*hasWeeklyNoteSettings*/ ctx[4] && create_if_block$4();

	return {
		c() {
			div = element("div");
			h3 = element("h3");
			h3.textContent = "Getting Started";
			t1 = space();
			if (if_block0) if_block0.c();
			t2 = space();
			if (if_block1) if_block1.c();
			t3 = space();
			if (if_block2) if_block2.c();
			t4 = space();
			button = element("button");
			button.textContent = "Dismiss";
			attr(button, "class", "svelte-1alo0m9");
			attr(div, "class", "settings-banner");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, h3);
			append(div, t1);
			if (if_block0) if_block0.m(div, null);
			append(div, t2);
			if (if_block1) if_block1.m(div, null);
			append(div, t3);
			if (if_block2) if_block2.m(div, null);
			append(div, t4);
			append(div, button);
			current = true;

			if (!mounted) {
				dispose = listen(button, "click", function () {
					if (is_function(/*handleTeardown*/ ctx[1])) /*handleTeardown*/ ctx[1].apply(this, arguments);
				});

				mounted = true;
			}
		},
		p(new_ctx, [dirty]) {
			ctx = new_ctx;

			if (/*hasDailyNoteSettings*/ ctx[3]) {
				if (if_block0) {
					if_block0.p(ctx, dirty);

					if (dirty & /*hasDailyNoteSettings*/ 8) {
						transition_in(if_block0, 1);
					}
				} else {
					if_block0 = create_if_block_3(ctx);
					if_block0.c();
					transition_in(if_block0, 1);
					if_block0.m(div, t2);
				}
			} else if (if_block0) {
				group_outros();

				transition_out(if_block0, 1, 1, () => {
					if_block0 = null;
				});

				check_outros();
			}

			if (/*hasWeeklyNoteSettings*/ ctx[4]) {
				if (if_block1) {
					if_block1.p(ctx, dirty);

					if (dirty & /*hasWeeklyNoteSettings*/ 16) {
						transition_in(if_block1, 1);
					}
				} else {
					if_block1 = create_if_block_1$2(ctx);
					if_block1.c();
					transition_in(if_block1, 1);
					if_block1.m(div, t3);
				}
			} else if (if_block1) {
				group_outros();

				transition_out(if_block1, 1, 1, () => {
					if_block1 = null;
				});

				check_outros();
			}

			if (!/*hasDailyNoteSettings*/ ctx[3] && !/*hasWeeklyNoteSettings*/ ctx[4]) {
				if (if_block2) ; else {
					if_block2 = create_if_block$4();
					if_block2.c();
					if_block2.m(div, t4);
				}
			} else if (if_block2) {
				if_block2.d(1);
				if_block2 = null;
			}
		},
		i(local) {
			if (current) return;
			transition_in(if_block0);
			transition_in(if_block1);
			if (div_outro) div_outro.end(1);
			current = true;
		},
		o(local) {
			transition_out(if_block0);
			transition_out(if_block1);
			div_outro = create_out_transition(div, slide, {});
			current = false;
		},
		d(detaching) {
			if (detaching) detach(div);
			if (if_block0) if_block0.d();
			if (if_block1) if_block1.d();
			if (if_block2) if_block2.d();
			if (detaching && div_outro) div_outro.end();
			mounted = false;
			dispose();
		}
	};
}

function instance$4($$self, $$props, $$invalidate) {
	let $settings,
		$$unsubscribe_settings = noop,
		$$subscribe_settings = () => ($$unsubscribe_settings(), $$unsubscribe_settings = subscribe(settings, $$value => $$invalidate(5, $settings = $$value)), settings);

	$$self.$$.on_destroy.push(() => $$unsubscribe_settings());
	
	
	let { settings } = $$props;
	$$subscribe_settings();
	let { handleTeardown } = $$props;
	let { migrateDailyNoteSettings } = $$props;
	let hasDailyNoteSettings;
	let hasWeeklyNoteSettings;

	$$self.$$set = $$props => {
		if ("settings" in $$props) $$subscribe_settings($$invalidate(0, settings = $$props.settings));
		if ("handleTeardown" in $$props) $$invalidate(1, handleTeardown = $$props.handleTeardown);
		if ("migrateDailyNoteSettings" in $$props) $$invalidate(2, migrateDailyNoteSettings = $$props.migrateDailyNoteSettings);
	};

	{
		$$invalidate(3, hasDailyNoteSettings = hasLegacyDailyNoteSettings());
		$$invalidate(4, hasWeeklyNoteSettings = hasLegacyWeeklyNoteSettings());
	}

	return [
		settings,
		handleTeardown,
		migrateDailyNoteSettings,
		hasDailyNoteSettings,
		hasWeeklyNoteSettings,
		$settings
	];
}

class GettingStartedBanner extends SvelteComponent {
	constructor(options) {
		super();
		if (!document.getElementById("svelte-1alo0m9-style")) add_css();

		init(this, options, instance$4, create_fragment$4, safe_not_equal, {
			settings: 0,
			handleTeardown: 1,
			migrateDailyNoteSettings: 2
		});
	}
}

function getBasename(format) {
    const isTemplateNested = format.indexOf("/") !== -1;
    return isTemplateNested ? format.split("/").pop() : format;
}
function isValidFilename(filename) {
    const illegalRe = /[?<>\\:*|"]/g;
    const controlRe = /[\x00-\x1f\x80-\x9f]/g;
    const reservedRe = /^\.+$/;
    const windowsReservedRe = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i;
    return (!illegalRe.test(filename) &&
        !controlRe.test(filename) &&
        !reservedRe.test(filename) &&
        !windowsReservedRe.test(filename));
}
function validateFormat(format, periodicity) {
    if (!format) {
        return "";
    }
    if (!isValidFilename(format)) {
        return "Format contains illegal characters";
    }
    if (periodicity === "daily" &&
        !["m", "d", "y"].every((requiredChar) => getBasename(format)
            .replace(/\[[^\]]*\]/g, "") // remove everything within brackets
            .toLowerCase()
            .indexOf(requiredChar) !== -1)) {
        return "Filename must be unique";
    }
}
function validateTemplate(template) {
    if (!template) {
        return "";
    }
    const { metadataCache } = window.app;
    const file = metadataCache.getFirstLinkpathDest(template, "");
    if (!file) {
        return "Template file not found";
    }
    return "";
}
function validateFolder(folder) {
    if (!folder || folder === "/") {
        return "";
    }
    const { vault } = window.app;
    if (!vault.getAbstractFileByPath(obsidian.normalizePath(folder))) {
        return "Folder not found in vault";
    }
    return "";
}

/* src/settings/NoteFormatSetting.svelte generated by Svelte v3.35.0 */

function create_if_block_1$1(ctx) {
	let div;
	let t0;
	let strong0;
	let t1;
	let br;
	let t2;
	let strong1;
	let t3;

	return {
		c() {
			div = element("div");
			t0 = text("New files will be created at ");
			strong0 = element("strong");
			t1 = text(/*value*/ ctx[2]);
			br = element("br");
			t2 = text("\n          Format: ");
			strong1 = element("strong");
			t3 = text(/*basename*/ ctx[7]);
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, t0);
			append(div, strong0);
			append(strong0, t1);
			append(div, br);
			append(div, t2);
			append(div, strong1);
			append(strong1, t3);
		},
		p(ctx, dirty) {
			if (dirty & /*value*/ 4) set_data(t1, /*value*/ ctx[2]);
			if (dirty & /*basename*/ 128) set_data(t3, /*basename*/ ctx[7]);
		},
		d(detaching) {
			if (detaching) detach(div);
		}
	};
}

// (56:4) {#if error}
function create_if_block$3(ctx) {
	let div;
	let t;

	return {
		c() {
			div = element("div");
			t = text(/*error*/ ctx[5]);
			attr(div, "class", "has-error");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, t);
		},
		p(ctx, dirty) {
			if (dirty & /*error*/ 32) set_data(t, /*error*/ ctx[5]);
		},
		d(detaching) {
			if (detaching) detach(div);
		}
	};
}

function create_fragment$3(ctx) {
	let div5;
	let div3;
	let div0;
	let t1;
	let div2;
	let a;
	let t3;
	let div1;
	let t4;
	let b;
	let t5_value = window.moment().format(/*value*/ ctx[2] || /*defaultFormat*/ ctx[8]) + "";
	let t5;
	let t6;
	let t7;
	let t8;
	let div4;
	let input;
	let mounted;
	let dispose;
	let if_block0 = /*isTemplateNested*/ ctx[6] && create_if_block_1$1(ctx);
	let if_block1 = /*error*/ ctx[5] && create_if_block$3(ctx);

	return {
		c() {
			div5 = element("div");
			div3 = element("div");
			div0 = element("div");
			div0.textContent = "Format";
			t1 = space();
			div2 = element("div");
			a = element("a");
			a.textContent = "Syntax Reference";
			t3 = space();
			div1 = element("div");
			t4 = text("Your current syntax looks like this: ");
			b = element("b");
			t5 = text(t5_value);
			t6 = space();
			if (if_block0) if_block0.c();
			t7 = space();
			if (if_block1) if_block1.c();
			t8 = space();
			div4 = element("div");
			input = element("input");
			attr(div0, "class", "setting-item-name");
			attr(a, "href", "https://momentjs.com/docs/#/displaying/format/");
			attr(b, "class", "u-pop");
			attr(div2, "class", "setting-item-description");
			attr(div3, "class", "setting-item-info");
			attr(input, "type", "text");
			attr(input, "spellcheck", false);
			attr(input, "placeholder", /*defaultFormat*/ ctx[8]);
			toggle_class(input, "has-error", !!/*error*/ ctx[5]);
			attr(div4, "class", "setting-item-control");
			attr(div5, "class", "setting-item");
		},
		m(target, anchor) {
			insert(target, div5, anchor);
			append(div5, div3);
			append(div3, div0);
			append(div3, t1);
			append(div3, div2);
			append(div2, a);
			append(div2, t3);
			append(div2, div1);
			append(div1, t4);
			append(div1, b);
			append(b, t5);
			append(div2, t6);
			if (if_block0) if_block0.m(div2, null);
			append(div3, t7);
			if (if_block1) if_block1.m(div3, null);
			append(div5, t8);
			append(div5, div4);
			append(div4, input);
			set_input_value(input, /*$settings*/ ctx[3][/*periodicity*/ ctx[1]].format);
			/*input_binding*/ ctx[12](input);

			if (!mounted) {
				dispose = [
					listen(input, "input", /*input_input_handler*/ ctx[11]),
					listen(input, "change", /*onChange*/ ctx[10]),
					listen(input, "input", /*clearError*/ ctx[9])
				];

				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			if (dirty & /*value*/ 4 && t5_value !== (t5_value = window.moment().format(/*value*/ ctx[2] || /*defaultFormat*/ ctx[8]) + "")) set_data(t5, t5_value);

			if (/*isTemplateNested*/ ctx[6]) {
				if (if_block0) {
					if_block0.p(ctx, dirty);
				} else {
					if_block0 = create_if_block_1$1(ctx);
					if_block0.c();
					if_block0.m(div2, null);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			if (/*error*/ ctx[5]) {
				if (if_block1) {
					if_block1.p(ctx, dirty);
				} else {
					if_block1 = create_if_block$3(ctx);
					if_block1.c();
					if_block1.m(div3, null);
				}
			} else if (if_block1) {
				if_block1.d(1);
				if_block1 = null;
			}

			if (dirty & /*$settings, periodicity*/ 10 && input.value !== /*$settings*/ ctx[3][/*periodicity*/ ctx[1]].format) {
				set_input_value(input, /*$settings*/ ctx[3][/*periodicity*/ ctx[1]].format);
			}

			if (dirty & /*error*/ 32) {
				toggle_class(input, "has-error", !!/*error*/ ctx[5]);
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(div5);
			if (if_block0) if_block0.d();
			if (if_block1) if_block1.d();
			/*input_binding*/ ctx[12](null);
			mounted = false;
			run_all(dispose);
		}
	};
}

function instance$3($$self, $$props, $$invalidate) {
	let $settings,
		$$unsubscribe_settings = noop,
		$$subscribe_settings = () => ($$unsubscribe_settings(), $$unsubscribe_settings = subscribe(settings, $$value => $$invalidate(3, $settings = $$value)), settings);

	$$self.$$.on_destroy.push(() => $$unsubscribe_settings());
	
	
	let { settings } = $$props;
	$$subscribe_settings();
	let { periodicity } = $$props;

	const DEFAULT_FORMATS = {
		daily: DEFAULT_DAILY_NOTE_FORMAT_1,
		weekly: DEFAULT_WEEKLY_NOTE_FORMAT_1,
		monthly: DEFAULT_MONTHLY_NOTE_FORMAT_1,
		quarterly: DEFAULT_QUARTERLY_NOTE_FORMAT_1,
		yearly: DEFAULT_YEARLY_NOTE_FORMAT_1
	};

	const defaultFormat = DEFAULT_FORMATS[periodicity];
	let inputEl;
	let value;
	let error;
	let isTemplateNested;
	let basename;

	onMount(() => {
		$$invalidate(5, error = validateFormat(inputEl.value, periodicity));
	});

	function clearError() {
		$$invalidate(5, error = "");
	}

	function onChange() {
		$$invalidate(5, error = validateFormat(inputEl.value, periodicity));
	}

	function input_input_handler() {
		$settings[periodicity].format = this.value;
		settings.set($settings);
		$$invalidate(1, periodicity);
	}

	function input_binding($$value) {
		binding_callbacks[$$value ? "unshift" : "push"](() => {
			inputEl = $$value;
			$$invalidate(4, inputEl);
		});
	}

	$$self.$$set = $$props => {
		if ("settings" in $$props) $$subscribe_settings($$invalidate(0, settings = $$props.settings));
		if ("periodicity" in $$props) $$invalidate(1, periodicity = $$props.periodicity);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*$settings, periodicity, value*/ 14) {
			{
				$$invalidate(2, value = $settings[periodicity].format || "");
				$$invalidate(6, isTemplateNested = value.indexOf("/") !== -1);
				$$invalidate(7, basename = getBasename(value));
			}
		}
	};

	return [
		settings,
		periodicity,
		value,
		$settings,
		inputEl,
		error,
		isTemplateNested,
		basename,
		defaultFormat,
		clearError,
		onChange,
		input_input_handler,
		input_binding
	];
}

class NoteFormatSetting extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$3, create_fragment$3, safe_not_equal, { settings: 0, periodicity: 1 });
	}
}

var top = 'top';
var bottom = 'bottom';
var right = 'right';
var left = 'left';
var auto = 'auto';
var basePlacements = [top, bottom, right, left];
var start = 'start';
var end = 'end';
var clippingParents = 'clippingParents';
var viewport = 'viewport';
var popper = 'popper';
var reference = 'reference';
var variationPlacements = /*#__PURE__*/basePlacements.reduce(function (acc, placement) {
  return acc.concat([placement + "-" + start, placement + "-" + end]);
}, []);
var placements = /*#__PURE__*/[].concat(basePlacements, [auto]).reduce(function (acc, placement) {
  return acc.concat([placement, placement + "-" + start, placement + "-" + end]);
}, []); // modifiers that need to read the DOM

var beforeRead = 'beforeRead';
var read = 'read';
var afterRead = 'afterRead'; // pure-logic modifiers

var beforeMain = 'beforeMain';
var main = 'main';
var afterMain = 'afterMain'; // modifier with the purpose to write to the DOM (or write into a framework state)

var beforeWrite = 'beforeWrite';
var write = 'write';
var afterWrite = 'afterWrite';
var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];

function getNodeName(element) {
  return element ? (element.nodeName || '').toLowerCase() : null;
}

function getWindow(node) {
  if (node == null) {
    return window;
  }

  if (node.toString() !== '[object Window]') {
    var ownerDocument = node.ownerDocument;
    return ownerDocument ? ownerDocument.defaultView || window : window;
  }

  return node;
}

function isElement(node) {
  var OwnElement = getWindow(node).Element;
  return node instanceof OwnElement || node instanceof Element;
}

function isHTMLElement(node) {
  var OwnElement = getWindow(node).HTMLElement;
  return node instanceof OwnElement || node instanceof HTMLElement;
}

function isShadowRoot(node) {
  // IE 11 has no ShadowRoot
  if (typeof ShadowRoot === 'undefined') {
    return false;
  }

  var OwnElement = getWindow(node).ShadowRoot;
  return node instanceof OwnElement || node instanceof ShadowRoot;
}

// and applies them to the HTMLElements such as popper and arrow

function applyStyles(_ref) {
  var state = _ref.state;
  Object.keys(state.elements).forEach(function (name) {
    var style = state.styles[name] || {};
    var attributes = state.attributes[name] || {};
    var element = state.elements[name]; // arrow is optional + virtual elements

    if (!isHTMLElement(element) || !getNodeName(element)) {
      return;
    } // Flow doesn't support to extend this property, but it's the most
    // effective way to apply styles to an HTMLElement
    // $FlowFixMe[cannot-write]


    Object.assign(element.style, style);
    Object.keys(attributes).forEach(function (name) {
      var value = attributes[name];

      if (value === false) {
        element.removeAttribute(name);
      } else {
        element.setAttribute(name, value === true ? '' : value);
      }
    });
  });
}

function effect$2(_ref2) {
  var state = _ref2.state;
  var initialStyles = {
    popper: {
      position: state.options.strategy,
      left: '0',
      top: '0',
      margin: '0'
    },
    arrow: {
      position: 'absolute'
    },
    reference: {}
  };
  Object.assign(state.elements.popper.style, initialStyles.popper);
  state.styles = initialStyles;

  if (state.elements.arrow) {
    Object.assign(state.elements.arrow.style, initialStyles.arrow);
  }

  return function () {
    Object.keys(state.elements).forEach(function (name) {
      var element = state.elements[name];
      var attributes = state.attributes[name] || {};
      var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]); // Set all values to an empty string to unset them

      var style = styleProperties.reduce(function (style, property) {
        style[property] = '';
        return style;
      }, {}); // arrow is optional + virtual elements

      if (!isHTMLElement(element) || !getNodeName(element)) {
        return;
      }

      Object.assign(element.style, style);
      Object.keys(attributes).forEach(function (attribute) {
        element.removeAttribute(attribute);
      });
    });
  };
} // eslint-disable-next-line import/no-unused-modules


var applyStyles$1 = {
  name: 'applyStyles',
  enabled: true,
  phase: 'write',
  fn: applyStyles,
  effect: effect$2,
  requires: ['computeStyles']
};

function getBasePlacement(placement) {
  return placement.split('-')[0];
}

function getBoundingClientRect(element) {
  var rect = element.getBoundingClientRect();
  return {
    width: rect.width,
    height: rect.height,
    top: rect.top,
    right: rect.right,
    bottom: rect.bottom,
    left: rect.left,
    x: rect.left,
    y: rect.top
  };
}

// means it doesn't take into account transforms.

function getLayoutRect(element) {
  var clientRect = getBoundingClientRect(element); // Use the clientRect sizes if it's not been transformed.
  // Fixes https://github.com/popperjs/popper-core/issues/1223

  var width = element.offsetWidth;
  var height = element.offsetHeight;

  if (Math.abs(clientRect.width - width) <= 1) {
    width = clientRect.width;
  }

  if (Math.abs(clientRect.height - height) <= 1) {
    height = clientRect.height;
  }

  return {
    x: element.offsetLeft,
    y: element.offsetTop,
    width: width,
    height: height
  };
}

function contains(parent, child) {
  var rootNode = child.getRootNode && child.getRootNode(); // First, attempt with faster native method

  if (parent.contains(child)) {
    return true;
  } // then fallback to custom implementation with Shadow DOM support
  else if (rootNode && isShadowRoot(rootNode)) {
      var next = child;

      do {
        if (next && parent.isSameNode(next)) {
          return true;
        } // $FlowFixMe[prop-missing]: need a better way to handle this...


        next = next.parentNode || next.host;
      } while (next);
    } // Give up, the result is false


  return false;
}

function getComputedStyle$1(element) {
  return getWindow(element).getComputedStyle(element);
}

function isTableElement(element) {
  return ['table', 'td', 'th'].indexOf(getNodeName(element)) >= 0;
}

function getDocumentElement(element) {
  // $FlowFixMe[incompatible-return]: assume body is always available
  return ((isElement(element) ? element.ownerDocument : // $FlowFixMe[prop-missing]
  element.document) || window.document).documentElement;
}

function getParentNode(element) {
  if (getNodeName(element) === 'html') {
    return element;
  }

  return (// this is a quicker (but less type safe) way to save quite some bytes from the bundle
    // $FlowFixMe[incompatible-return]
    // $FlowFixMe[prop-missing]
    element.assignedSlot || // step into the shadow DOM of the parent of a slotted node
    element.parentNode || ( // DOM Element detected
    isShadowRoot(element) ? element.host : null) || // ShadowRoot detected
    // $FlowFixMe[incompatible-call]: HTMLElement is a Node
    getDocumentElement(element) // fallback

  );
}

function getTrueOffsetParent(element) {
  if (!isHTMLElement(element) || // https://github.com/popperjs/popper-core/issues/837
  getComputedStyle$1(element).position === 'fixed') {
    return null;
  }

  return element.offsetParent;
} // `.offsetParent` reports `null` for fixed elements, while absolute elements
// return the containing block


function getContainingBlock(element) {
  var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') !== -1;
  var currentNode = getParentNode(element);

  while (isHTMLElement(currentNode) && ['html', 'body'].indexOf(getNodeName(currentNode)) < 0) {
    var css = getComputedStyle$1(currentNode); // This is non-exhaustive but covers the most common CSS properties that
    // create a containing block.
    // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block

    if (css.transform !== 'none' || css.perspective !== 'none' || css.contain === 'paint' || ['transform', 'perspective'].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === 'filter' || isFirefox && css.filter && css.filter !== 'none') {
      return currentNode;
    } else {
      currentNode = currentNode.parentNode;
    }
  }

  return null;
} // Gets the closest ancestor positioned element. Handles some edge cases,
// such as table ancestors and cross browser bugs.


function getOffsetParent(element) {
  var window = getWindow(element);
  var offsetParent = getTrueOffsetParent(element);

  while (offsetParent && isTableElement(offsetParent) && getComputedStyle$1(offsetParent).position === 'static') {
    offsetParent = getTrueOffsetParent(offsetParent);
  }

  if (offsetParent && (getNodeName(offsetParent) === 'html' || getNodeName(offsetParent) === 'body' && getComputedStyle$1(offsetParent).position === 'static')) {
    return window;
  }

  return offsetParent || getContainingBlock(element) || window;
}

function getMainAxisFromPlacement(placement) {
  return ['top', 'bottom'].indexOf(placement) >= 0 ? 'x' : 'y';
}

var max = Math.max;
var min = Math.min;
var round = Math.round;

function within(min$1, value, max$1) {
  return max(min$1, min(value, max$1));
}

function getFreshSideObject() {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
}

function mergePaddingObject(paddingObject) {
  return Object.assign({}, getFreshSideObject(), paddingObject);
}

function expandToHashMap(value, keys) {
  return keys.reduce(function (hashMap, key) {
    hashMap[key] = value;
    return hashMap;
  }, {});
}

var toPaddingObject = function toPaddingObject(padding, state) {
  padding = typeof padding === 'function' ? padding(Object.assign({}, state.rects, {
    placement: state.placement
  })) : padding;
  return mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements));
};

function arrow(_ref) {
  var _state$modifiersData$;

  var state = _ref.state,
      name = _ref.name,
      options = _ref.options;
  var arrowElement = state.elements.arrow;
  var popperOffsets = state.modifiersData.popperOffsets;
  var basePlacement = getBasePlacement(state.placement);
  var axis = getMainAxisFromPlacement(basePlacement);
  var isVertical = [left, right].indexOf(basePlacement) >= 0;
  var len = isVertical ? 'height' : 'width';

  if (!arrowElement || !popperOffsets) {
    return;
  }

  var paddingObject = toPaddingObject(options.padding, state);
  var arrowRect = getLayoutRect(arrowElement);
  var minProp = axis === 'y' ? top : left;
  var maxProp = axis === 'y' ? bottom : right;
  var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets[axis] - state.rects.popper[len];
  var startDiff = popperOffsets[axis] - state.rects.reference[axis];
  var arrowOffsetParent = getOffsetParent(arrowElement);
  var clientSize = arrowOffsetParent ? axis === 'y' ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
  var centerToReference = endDiff / 2 - startDiff / 2; // Make sure the arrow doesn't overflow the popper if the center point is
  // outside of the popper bounds

  var min = paddingObject[minProp];
  var max = clientSize - arrowRect[len] - paddingObject[maxProp];
  var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
  var offset = within(min, center, max); // Prevents breaking syntax highlighting...

  var axisProp = axis;
  state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset, _state$modifiersData$.centerOffset = offset - center, _state$modifiersData$);
}

function effect$1(_ref2) {
  var state = _ref2.state,
      options = _ref2.options;
  var _options$element = options.element,
      arrowElement = _options$element === void 0 ? '[data-popper-arrow]' : _options$element;

  if (arrowElement == null) {
    return;
  } // CSS selector


  if (typeof arrowElement === 'string') {
    arrowElement = state.elements.popper.querySelector(arrowElement);

    if (!arrowElement) {
      return;
    }
  }

  if (process.env.NODE_ENV !== "production") {
    if (!isHTMLElement(arrowElement)) {
      console.error(['Popper: "arrow" element must be an HTMLElement (not an SVGElement).', 'To use an SVG arrow, wrap it in an HTMLElement that will be used as', 'the arrow.'].join(' '));
    }
  }

  if (!contains(state.elements.popper, arrowElement)) {
    if (process.env.NODE_ENV !== "production") {
      console.error(['Popper: "arrow" modifier\'s `element` must be a child of the popper', 'element.'].join(' '));
    }

    return;
  }

  state.elements.arrow = arrowElement;
} // eslint-disable-next-line import/no-unused-modules


var arrow$1 = {
  name: 'arrow',
  enabled: true,
  phase: 'main',
  fn: arrow,
  effect: effect$1,
  requires: ['popperOffsets'],
  requiresIfExists: ['preventOverflow']
};

var unsetSides = {
  top: 'auto',
  right: 'auto',
  bottom: 'auto',
  left: 'auto'
}; // Round the offsets to the nearest suitable subpixel based on the DPR.
// Zooming can change the DPR, but it seems to report a value that will
// cleanly divide the values into the appropriate subpixels.

function roundOffsetsByDPR(_ref) {
  var x = _ref.x,
      y = _ref.y;
  var win = window;
  var dpr = win.devicePixelRatio || 1;
  return {
    x: round(round(x * dpr) / dpr) || 0,
    y: round(round(y * dpr) / dpr) || 0
  };
}

function mapToStyles(_ref2) {
  var _Object$assign2;

  var popper = _ref2.popper,
      popperRect = _ref2.popperRect,
      placement = _ref2.placement,
      offsets = _ref2.offsets,
      position = _ref2.position,
      gpuAcceleration = _ref2.gpuAcceleration,
      adaptive = _ref2.adaptive,
      roundOffsets = _ref2.roundOffsets;

  var _ref3 = roundOffsets === true ? roundOffsetsByDPR(offsets) : typeof roundOffsets === 'function' ? roundOffsets(offsets) : offsets,
      _ref3$x = _ref3.x,
      x = _ref3$x === void 0 ? 0 : _ref3$x,
      _ref3$y = _ref3.y,
      y = _ref3$y === void 0 ? 0 : _ref3$y;

  var hasX = offsets.hasOwnProperty('x');
  var hasY = offsets.hasOwnProperty('y');
  var sideX = left;
  var sideY = top;
  var win = window;

  if (adaptive) {
    var offsetParent = getOffsetParent(popper);
    var heightProp = 'clientHeight';
    var widthProp = 'clientWidth';

    if (offsetParent === getWindow(popper)) {
      offsetParent = getDocumentElement(popper);

      if (getComputedStyle$1(offsetParent).position !== 'static') {
        heightProp = 'scrollHeight';
        widthProp = 'scrollWidth';
      }
    } // $FlowFixMe[incompatible-cast]: force type refinement, we compare offsetParent with window above, but Flow doesn't detect it


    offsetParent = offsetParent;

    if (placement === top) {
      sideY = bottom; // $FlowFixMe[prop-missing]

      y -= offsetParent[heightProp] - popperRect.height;
      y *= gpuAcceleration ? 1 : -1;
    }

    if (placement === left) {
      sideX = right; // $FlowFixMe[prop-missing]

      x -= offsetParent[widthProp] - popperRect.width;
      x *= gpuAcceleration ? 1 : -1;
    }
  }

  var commonStyles = Object.assign({
    position: position
  }, adaptive && unsetSides);

  if (gpuAcceleration) {
    var _Object$assign;

    return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? '0' : '', _Object$assign[sideX] = hasX ? '0' : '', _Object$assign.transform = (win.devicePixelRatio || 1) < 2 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign));
  }

  return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : '', _Object$assign2[sideX] = hasX ? x + "px" : '', _Object$assign2.transform = '', _Object$assign2));
}

function computeStyles(_ref4) {
  var state = _ref4.state,
      options = _ref4.options;
  var _options$gpuAccelerat = options.gpuAcceleration,
      gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat,
      _options$adaptive = options.adaptive,
      adaptive = _options$adaptive === void 0 ? true : _options$adaptive,
      _options$roundOffsets = options.roundOffsets,
      roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;

  if (process.env.NODE_ENV !== "production") {
    var transitionProperty = getComputedStyle$1(state.elements.popper).transitionProperty || '';

    if (adaptive && ['transform', 'top', 'right', 'bottom', 'left'].some(function (property) {
      return transitionProperty.indexOf(property) >= 0;
    })) {
      console.warn(['Popper: Detected CSS transitions on at least one of the following', 'CSS properties: "transform", "top", "right", "bottom", "left".', '\n\n', 'Disable the "computeStyles" modifier\'s `adaptive` option to allow', 'for smooth transitions, or remove these properties from the CSS', 'transition declaration on the popper element if only transitioning', 'opacity or background-color for example.', '\n\n', 'We recommend using the popper element as a wrapper around an inner', 'element that can have any CSS property transitioned for animations.'].join(' '));
    }
  }

  var commonStyles = {
    placement: getBasePlacement(state.placement),
    popper: state.elements.popper,
    popperRect: state.rects.popper,
    gpuAcceleration: gpuAcceleration
  };

  if (state.modifiersData.popperOffsets != null) {
    state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.popperOffsets,
      position: state.options.strategy,
      adaptive: adaptive,
      roundOffsets: roundOffsets
    })));
  }

  if (state.modifiersData.arrow != null) {
    state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.arrow,
      position: 'absolute',
      adaptive: false,
      roundOffsets: roundOffsets
    })));
  }

  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    'data-popper-placement': state.placement
  });
} // eslint-disable-next-line import/no-unused-modules


var computeStyles$1 = {
  name: 'computeStyles',
  enabled: true,
  phase: 'beforeWrite',
  fn: computeStyles,
  data: {}
};

var passive = {
  passive: true
};

function effect(_ref) {
  var state = _ref.state,
      instance = _ref.instance,
      options = _ref.options;
  var _options$scroll = options.scroll,
      scroll = _options$scroll === void 0 ? true : _options$scroll,
      _options$resize = options.resize,
      resize = _options$resize === void 0 ? true : _options$resize;
  var window = getWindow(state.elements.popper);
  var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);

  if (scroll) {
    scrollParents.forEach(function (scrollParent) {
      scrollParent.addEventListener('scroll', instance.update, passive);
    });
  }

  if (resize) {
    window.addEventListener('resize', instance.update, passive);
  }

  return function () {
    if (scroll) {
      scrollParents.forEach(function (scrollParent) {
        scrollParent.removeEventListener('scroll', instance.update, passive);
      });
    }

    if (resize) {
      window.removeEventListener('resize', instance.update, passive);
    }
  };
} // eslint-disable-next-line import/no-unused-modules


var eventListeners = {
  name: 'eventListeners',
  enabled: true,
  phase: 'write',
  fn: function fn() {},
  effect: effect,
  data: {}
};

var hash$1 = {
  left: 'right',
  right: 'left',
  bottom: 'top',
  top: 'bottom'
};
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, function (matched) {
    return hash$1[matched];
  });
}

var hash = {
  start: 'end',
  end: 'start'
};
function getOppositeVariationPlacement(placement) {
  return placement.replace(/start|end/g, function (matched) {
    return hash[matched];
  });
}

function getWindowScroll(node) {
  var win = getWindow(node);
  var scrollLeft = win.pageXOffset;
  var scrollTop = win.pageYOffset;
  return {
    scrollLeft: scrollLeft,
    scrollTop: scrollTop
  };
}

function getWindowScrollBarX(element) {
  // If <html> has a CSS width greater than the viewport, then this will be
  // incorrect for RTL.
  // Popper 1 is broken in this case and never had a bug report so let's assume
  // it's not an issue. I don't think anyone ever specifies width on <html>
  // anyway.
  // Browsers where the left scrollbar doesn't cause an issue report `0` for
  // this (e.g. Edge 2019, IE11, Safari)
  return getBoundingClientRect(getDocumentElement(element)).left + getWindowScroll(element).scrollLeft;
}

function getViewportRect(element) {
  var win = getWindow(element);
  var html = getDocumentElement(element);
  var visualViewport = win.visualViewport;
  var width = html.clientWidth;
  var height = html.clientHeight;
  var x = 0;
  var y = 0; // NB: This isn't supported on iOS <= 12. If the keyboard is open, the popper
  // can be obscured underneath it.
  // Also, `html.clientHeight` adds the bottom bar height in Safari iOS, even
  // if it isn't open, so if this isn't available, the popper will be detected
  // to overflow the bottom of the screen too early.

  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height; // Uses Layout Viewport (like Chrome; Safari does not currently)
    // In Chrome, it returns a value very close to 0 (+/-) but contains rounding
    // errors due to floating point numbers, so we need to check precision.
    // Safari returns a number <= 0, usually < -1 when pinch-zoomed
    // Feature detection fails in mobile emulation mode in Chrome.
    // Math.abs(win.innerWidth / visualViewport.scale - visualViewport.width) <
    // 0.001
    // Fallback here: "Not Safari" userAgent

    if (!/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
      x = visualViewport.offsetLeft;
      y = visualViewport.offsetTop;
    }
  }

  return {
    width: width,
    height: height,
    x: x + getWindowScrollBarX(element),
    y: y
  };
}

// of the `<html>` and `<body>` rect bounds if horizontally scrollable

function getDocumentRect(element) {
  var _element$ownerDocumen;

  var html = getDocumentElement(element);
  var winScroll = getWindowScroll(element);
  var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
  var width = max(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
  var height = max(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
  var x = -winScroll.scrollLeft + getWindowScrollBarX(element);
  var y = -winScroll.scrollTop;

  if (getComputedStyle$1(body || html).direction === 'rtl') {
    x += max(html.clientWidth, body ? body.clientWidth : 0) - width;
  }

  return {
    width: width,
    height: height,
    x: x,
    y: y
  };
}

function isScrollParent(element) {
  // Firefox wants us to check `-x` and `-y` variations as well
  var _getComputedStyle = getComputedStyle$1(element),
      overflow = _getComputedStyle.overflow,
      overflowX = _getComputedStyle.overflowX,
      overflowY = _getComputedStyle.overflowY;

  return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
}

function getScrollParent(node) {
  if (['html', 'body', '#document'].indexOf(getNodeName(node)) >= 0) {
    // $FlowFixMe[incompatible-return]: assume body is always available
    return node.ownerDocument.body;
  }

  if (isHTMLElement(node) && isScrollParent(node)) {
    return node;
  }

  return getScrollParent(getParentNode(node));
}

/*
given a DOM element, return the list of all scroll parents, up the list of ancesors
until we get to the top window object. This list is what we attach scroll listeners
to, because if any of these parent elements scroll, we'll need to re-calculate the
reference element's position.
*/

function listScrollParents(element, list) {
  var _element$ownerDocumen;

  if (list === void 0) {
    list = [];
  }

  var scrollParent = getScrollParent(element);
  var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
  var win = getWindow(scrollParent);
  var target = isBody ? [win].concat(win.visualViewport || [], isScrollParent(scrollParent) ? scrollParent : []) : scrollParent;
  var updatedList = list.concat(target);
  return isBody ? updatedList : // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
  updatedList.concat(listScrollParents(getParentNode(target)));
}

function rectToClientRect(rect) {
  return Object.assign({}, rect, {
    left: rect.x,
    top: rect.y,
    right: rect.x + rect.width,
    bottom: rect.y + rect.height
  });
}

function getInnerBoundingClientRect(element) {
  var rect = getBoundingClientRect(element);
  rect.top = rect.top + element.clientTop;
  rect.left = rect.left + element.clientLeft;
  rect.bottom = rect.top + element.clientHeight;
  rect.right = rect.left + element.clientWidth;
  rect.width = element.clientWidth;
  rect.height = element.clientHeight;
  rect.x = rect.left;
  rect.y = rect.top;
  return rect;
}

function getClientRectFromMixedType(element, clippingParent) {
  return clippingParent === viewport ? rectToClientRect(getViewportRect(element)) : isHTMLElement(clippingParent) ? getInnerBoundingClientRect(clippingParent) : rectToClientRect(getDocumentRect(getDocumentElement(element)));
} // A "clipping parent" is an overflowable container with the characteristic of
// clipping (or hiding) overflowing elements with a position different from
// `initial`


function getClippingParents(element) {
  var clippingParents = listScrollParents(getParentNode(element));
  var canEscapeClipping = ['absolute', 'fixed'].indexOf(getComputedStyle$1(element).position) >= 0;
  var clipperElement = canEscapeClipping && isHTMLElement(element) ? getOffsetParent(element) : element;

  if (!isElement(clipperElement)) {
    return [];
  } // $FlowFixMe[incompatible-return]: https://github.com/facebook/flow/issues/1414


  return clippingParents.filter(function (clippingParent) {
    return isElement(clippingParent) && contains(clippingParent, clipperElement) && getNodeName(clippingParent) !== 'body';
  });
} // Gets the maximum area that the element is visible in due to any number of
// clipping parents


function getClippingRect(element, boundary, rootBoundary) {
  var mainClippingParents = boundary === 'clippingParents' ? getClippingParents(element) : [].concat(boundary);
  var clippingParents = [].concat(mainClippingParents, [rootBoundary]);
  var firstClippingParent = clippingParents[0];
  var clippingRect = clippingParents.reduce(function (accRect, clippingParent) {
    var rect = getClientRectFromMixedType(element, clippingParent);
    accRect.top = max(rect.top, accRect.top);
    accRect.right = min(rect.right, accRect.right);
    accRect.bottom = min(rect.bottom, accRect.bottom);
    accRect.left = max(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromMixedType(element, firstClippingParent));
  clippingRect.width = clippingRect.right - clippingRect.left;
  clippingRect.height = clippingRect.bottom - clippingRect.top;
  clippingRect.x = clippingRect.left;
  clippingRect.y = clippingRect.top;
  return clippingRect;
}

function getVariation(placement) {
  return placement.split('-')[1];
}

function computeOffsets(_ref) {
  var reference = _ref.reference,
      element = _ref.element,
      placement = _ref.placement;
  var basePlacement = placement ? getBasePlacement(placement) : null;
  var variation = placement ? getVariation(placement) : null;
  var commonX = reference.x + reference.width / 2 - element.width / 2;
  var commonY = reference.y + reference.height / 2 - element.height / 2;
  var offsets;

  switch (basePlacement) {
    case top:
      offsets = {
        x: commonX,
        y: reference.y - element.height
      };
      break;

    case bottom:
      offsets = {
        x: commonX,
        y: reference.y + reference.height
      };
      break;

    case right:
      offsets = {
        x: reference.x + reference.width,
        y: commonY
      };
      break;

    case left:
      offsets = {
        x: reference.x - element.width,
        y: commonY
      };
      break;

    default:
      offsets = {
        x: reference.x,
        y: reference.y
      };
  }

  var mainAxis = basePlacement ? getMainAxisFromPlacement(basePlacement) : null;

  if (mainAxis != null) {
    var len = mainAxis === 'y' ? 'height' : 'width';

    switch (variation) {
      case start:
        offsets[mainAxis] = offsets[mainAxis] - (reference[len] / 2 - element[len] / 2);
        break;

      case end:
        offsets[mainAxis] = offsets[mainAxis] + (reference[len] / 2 - element[len] / 2);
        break;
    }
  }

  return offsets;
}

function detectOverflow(state, options) {
  if (options === void 0) {
    options = {};
  }

  var _options = options,
      _options$placement = _options.placement,
      placement = _options$placement === void 0 ? state.placement : _options$placement,
      _options$boundary = _options.boundary,
      boundary = _options$boundary === void 0 ? clippingParents : _options$boundary,
      _options$rootBoundary = _options.rootBoundary,
      rootBoundary = _options$rootBoundary === void 0 ? viewport : _options$rootBoundary,
      _options$elementConte = _options.elementContext,
      elementContext = _options$elementConte === void 0 ? popper : _options$elementConte,
      _options$altBoundary = _options.altBoundary,
      altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary,
      _options$padding = _options.padding,
      padding = _options$padding === void 0 ? 0 : _options$padding;
  var paddingObject = mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements));
  var altContext = elementContext === popper ? reference : popper;
  var referenceElement = state.elements.reference;
  var popperRect = state.rects.popper;
  var element = state.elements[altBoundary ? altContext : elementContext];
  var clippingClientRect = getClippingRect(isElement(element) ? element : element.contextElement || getDocumentElement(state.elements.popper), boundary, rootBoundary);
  var referenceClientRect = getBoundingClientRect(referenceElement);
  var popperOffsets = computeOffsets({
    reference: referenceClientRect,
    element: popperRect,
    strategy: 'absolute',
    placement: placement
  });
  var popperClientRect = rectToClientRect(Object.assign({}, popperRect, popperOffsets));
  var elementClientRect = elementContext === popper ? popperClientRect : referenceClientRect; // positive = overflowing the clipping rect
  // 0 or negative = within the clipping rect

  var overflowOffsets = {
    top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
    bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
    left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
    right: elementClientRect.right - clippingClientRect.right + paddingObject.right
  };
  var offsetData = state.modifiersData.offset; // Offsets can be applied only to the popper element

  if (elementContext === popper && offsetData) {
    var offset = offsetData[placement];
    Object.keys(overflowOffsets).forEach(function (key) {
      var multiply = [right, bottom].indexOf(key) >= 0 ? 1 : -1;
      var axis = [top, bottom].indexOf(key) >= 0 ? 'y' : 'x';
      overflowOffsets[key] += offset[axis] * multiply;
    });
  }

  return overflowOffsets;
}

function computeAutoPlacement(state, options) {
  if (options === void 0) {
    options = {};
  }

  var _options = options,
      placement = _options.placement,
      boundary = _options.boundary,
      rootBoundary = _options.rootBoundary,
      padding = _options.padding,
      flipVariations = _options.flipVariations,
      _options$allowedAutoP = _options.allowedAutoPlacements,
      allowedAutoPlacements = _options$allowedAutoP === void 0 ? placements : _options$allowedAutoP;
  var variation = getVariation(placement);
  var placements$1 = variation ? flipVariations ? variationPlacements : variationPlacements.filter(function (placement) {
    return getVariation(placement) === variation;
  }) : basePlacements;
  var allowedPlacements = placements$1.filter(function (placement) {
    return allowedAutoPlacements.indexOf(placement) >= 0;
  });

  if (allowedPlacements.length === 0) {
    allowedPlacements = placements$1;

    if (process.env.NODE_ENV !== "production") {
      console.error(['Popper: The `allowedAutoPlacements` option did not allow any', 'placements. Ensure the `placement` option matches the variation', 'of the allowed placements.', 'For example, "auto" cannot be used to allow "bottom-start".', 'Use "auto-start" instead.'].join(' '));
    }
  } // $FlowFixMe[incompatible-type]: Flow seems to have problems with two array unions...


  var overflows = allowedPlacements.reduce(function (acc, placement) {
    acc[placement] = detectOverflow(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      padding: padding
    })[getBasePlacement(placement)];
    return acc;
  }, {});
  return Object.keys(overflows).sort(function (a, b) {
    return overflows[a] - overflows[b];
  });
}

function getExpandedFallbackPlacements(placement) {
  if (getBasePlacement(placement) === auto) {
    return [];
  }

  var oppositePlacement = getOppositePlacement(placement);
  return [getOppositeVariationPlacement(placement), oppositePlacement, getOppositeVariationPlacement(oppositePlacement)];
}

function flip(_ref) {
  var state = _ref.state,
      options = _ref.options,
      name = _ref.name;

  if (state.modifiersData[name]._skip) {
    return;
  }

  var _options$mainAxis = options.mainAxis,
      checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
      _options$altAxis = options.altAxis,
      checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis,
      specifiedFallbackPlacements = options.fallbackPlacements,
      padding = options.padding,
      boundary = options.boundary,
      rootBoundary = options.rootBoundary,
      altBoundary = options.altBoundary,
      _options$flipVariatio = options.flipVariations,
      flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio,
      allowedAutoPlacements = options.allowedAutoPlacements;
  var preferredPlacement = state.options.placement;
  var basePlacement = getBasePlacement(preferredPlacement);
  var isBasePlacement = basePlacement === preferredPlacement;
  var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [getOppositePlacement(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
  var placements = [preferredPlacement].concat(fallbackPlacements).reduce(function (acc, placement) {
    return acc.concat(getBasePlacement(placement) === auto ? computeAutoPlacement(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      padding: padding,
      flipVariations: flipVariations,
      allowedAutoPlacements: allowedAutoPlacements
    }) : placement);
  }, []);
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var checksMap = new Map();
  var makeFallbackChecks = true;
  var firstFittingPlacement = placements[0];

  for (var i = 0; i < placements.length; i++) {
    var placement = placements[i];

    var _basePlacement = getBasePlacement(placement);

    var isStartVariation = getVariation(placement) === start;
    var isVertical = [top, bottom].indexOf(_basePlacement) >= 0;
    var len = isVertical ? 'width' : 'height';
    var overflow = detectOverflow(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      altBoundary: altBoundary,
      padding: padding
    });
    var mainVariationSide = isVertical ? isStartVariation ? right : left : isStartVariation ? bottom : top;

    if (referenceRect[len] > popperRect[len]) {
      mainVariationSide = getOppositePlacement(mainVariationSide);
    }

    var altVariationSide = getOppositePlacement(mainVariationSide);
    var checks = [];

    if (checkMainAxis) {
      checks.push(overflow[_basePlacement] <= 0);
    }

    if (checkAltAxis) {
      checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
    }

    if (checks.every(function (check) {
      return check;
    })) {
      firstFittingPlacement = placement;
      makeFallbackChecks = false;
      break;
    }

    checksMap.set(placement, checks);
  }

  if (makeFallbackChecks) {
    // `2` may be desired in some cases – research later
    var numberOfChecks = flipVariations ? 3 : 1;

    var _loop = function _loop(_i) {
      var fittingPlacement = placements.find(function (placement) {
        var checks = checksMap.get(placement);

        if (checks) {
          return checks.slice(0, _i).every(function (check) {
            return check;
          });
        }
      });

      if (fittingPlacement) {
        firstFittingPlacement = fittingPlacement;
        return "break";
      }
    };

    for (var _i = numberOfChecks; _i > 0; _i--) {
      var _ret = _loop(_i);

      if (_ret === "break") break;
    }
  }

  if (state.placement !== firstFittingPlacement) {
    state.modifiersData[name]._skip = true;
    state.placement = firstFittingPlacement;
    state.reset = true;
  }
} // eslint-disable-next-line import/no-unused-modules


var flip$1 = {
  name: 'flip',
  enabled: true,
  phase: 'main',
  fn: flip,
  requiresIfExists: ['offset'],
  data: {
    _skip: false
  }
};

function getSideOffsets(overflow, rect, preventedOffsets) {
  if (preventedOffsets === void 0) {
    preventedOffsets = {
      x: 0,
      y: 0
    };
  }

  return {
    top: overflow.top - rect.height - preventedOffsets.y,
    right: overflow.right - rect.width + preventedOffsets.x,
    bottom: overflow.bottom - rect.height + preventedOffsets.y,
    left: overflow.left - rect.width - preventedOffsets.x
  };
}

function isAnySideFullyClipped(overflow) {
  return [top, right, bottom, left].some(function (side) {
    return overflow[side] >= 0;
  });
}

function hide(_ref) {
  var state = _ref.state,
      name = _ref.name;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var preventedOffsets = state.modifiersData.preventOverflow;
  var referenceOverflow = detectOverflow(state, {
    elementContext: 'reference'
  });
  var popperAltOverflow = detectOverflow(state, {
    altBoundary: true
  });
  var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
  var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
  var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
  var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
  state.modifiersData[name] = {
    referenceClippingOffsets: referenceClippingOffsets,
    popperEscapeOffsets: popperEscapeOffsets,
    isReferenceHidden: isReferenceHidden,
    hasPopperEscaped: hasPopperEscaped
  };
  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    'data-popper-reference-hidden': isReferenceHidden,
    'data-popper-escaped': hasPopperEscaped
  });
} // eslint-disable-next-line import/no-unused-modules


var hide$1 = {
  name: 'hide',
  enabled: true,
  phase: 'main',
  requiresIfExists: ['preventOverflow'],
  fn: hide
};

function distanceAndSkiddingToXY(placement, rects, offset) {
  var basePlacement = getBasePlacement(placement);
  var invertDistance = [left, top].indexOf(basePlacement) >= 0 ? -1 : 1;

  var _ref = typeof offset === 'function' ? offset(Object.assign({}, rects, {
    placement: placement
  })) : offset,
      skidding = _ref[0],
      distance = _ref[1];

  skidding = skidding || 0;
  distance = (distance || 0) * invertDistance;
  return [left, right].indexOf(basePlacement) >= 0 ? {
    x: distance,
    y: skidding
  } : {
    x: skidding,
    y: distance
  };
}

function offset(_ref2) {
  var state = _ref2.state,
      options = _ref2.options,
      name = _ref2.name;
  var _options$offset = options.offset,
      offset = _options$offset === void 0 ? [0, 0] : _options$offset;
  var data = placements.reduce(function (acc, placement) {
    acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset);
    return acc;
  }, {});
  var _data$state$placement = data[state.placement],
      x = _data$state$placement.x,
      y = _data$state$placement.y;

  if (state.modifiersData.popperOffsets != null) {
    state.modifiersData.popperOffsets.x += x;
    state.modifiersData.popperOffsets.y += y;
  }

  state.modifiersData[name] = data;
} // eslint-disable-next-line import/no-unused-modules


var offset$1 = {
  name: 'offset',
  enabled: true,
  phase: 'main',
  requires: ['popperOffsets'],
  fn: offset
};

function popperOffsets(_ref) {
  var state = _ref.state,
      name = _ref.name;
  // Offsets are the actual position the popper needs to have to be
  // properly positioned near its reference element
  // This is the most basic placement, and will be adjusted by
  // the modifiers in the next step
  state.modifiersData[name] = computeOffsets({
    reference: state.rects.reference,
    element: state.rects.popper,
    strategy: 'absolute',
    placement: state.placement
  });
} // eslint-disable-next-line import/no-unused-modules


var popperOffsets$1 = {
  name: 'popperOffsets',
  enabled: true,
  phase: 'read',
  fn: popperOffsets,
  data: {}
};

function getAltAxis(axis) {
  return axis === 'x' ? 'y' : 'x';
}

function preventOverflow(_ref) {
  var state = _ref.state,
      options = _ref.options,
      name = _ref.name;
  var _options$mainAxis = options.mainAxis,
      checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
      _options$altAxis = options.altAxis,
      checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis,
      boundary = options.boundary,
      rootBoundary = options.rootBoundary,
      altBoundary = options.altBoundary,
      padding = options.padding,
      _options$tether = options.tether,
      tether = _options$tether === void 0 ? true : _options$tether,
      _options$tetherOffset = options.tetherOffset,
      tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
  var overflow = detectOverflow(state, {
    boundary: boundary,
    rootBoundary: rootBoundary,
    padding: padding,
    altBoundary: altBoundary
  });
  var basePlacement = getBasePlacement(state.placement);
  var variation = getVariation(state.placement);
  var isBasePlacement = !variation;
  var mainAxis = getMainAxisFromPlacement(basePlacement);
  var altAxis = getAltAxis(mainAxis);
  var popperOffsets = state.modifiersData.popperOffsets;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var tetherOffsetValue = typeof tetherOffset === 'function' ? tetherOffset(Object.assign({}, state.rects, {
    placement: state.placement
  })) : tetherOffset;
  var data = {
    x: 0,
    y: 0
  };

  if (!popperOffsets) {
    return;
  }

  if (checkMainAxis || checkAltAxis) {
    var mainSide = mainAxis === 'y' ? top : left;
    var altSide = mainAxis === 'y' ? bottom : right;
    var len = mainAxis === 'y' ? 'height' : 'width';
    var offset = popperOffsets[mainAxis];
    var min$1 = popperOffsets[mainAxis] + overflow[mainSide];
    var max$1 = popperOffsets[mainAxis] - overflow[altSide];
    var additive = tether ? -popperRect[len] / 2 : 0;
    var minLen = variation === start ? referenceRect[len] : popperRect[len];
    var maxLen = variation === start ? -popperRect[len] : -referenceRect[len]; // We need to include the arrow in the calculation so the arrow doesn't go
    // outside the reference bounds

    var arrowElement = state.elements.arrow;
    var arrowRect = tether && arrowElement ? getLayoutRect(arrowElement) : {
      width: 0,
      height: 0
    };
    var arrowPaddingObject = state.modifiersData['arrow#persistent'] ? state.modifiersData['arrow#persistent'].padding : getFreshSideObject();
    var arrowPaddingMin = arrowPaddingObject[mainSide];
    var arrowPaddingMax = arrowPaddingObject[altSide]; // If the reference length is smaller than the arrow length, we don't want
    // to include its full size in the calculation. If the reference is small
    // and near the edge of a boundary, the popper can overflow even if the
    // reference is not overflowing as well (e.g. virtual elements with no
    // width or height)

    var arrowLen = within(0, referenceRect[len], arrowRect[len]);
    var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - tetherOffsetValue : minLen - arrowLen - arrowPaddingMin - tetherOffsetValue;
    var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + tetherOffsetValue : maxLen + arrowLen + arrowPaddingMax + tetherOffsetValue;
    var arrowOffsetParent = state.elements.arrow && getOffsetParent(state.elements.arrow);
    var clientOffset = arrowOffsetParent ? mainAxis === 'y' ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
    var offsetModifierValue = state.modifiersData.offset ? state.modifiersData.offset[state.placement][mainAxis] : 0;
    var tetherMin = popperOffsets[mainAxis] + minOffset - offsetModifierValue - clientOffset;
    var tetherMax = popperOffsets[mainAxis] + maxOffset - offsetModifierValue;

    if (checkMainAxis) {
      var preventedOffset = within(tether ? min(min$1, tetherMin) : min$1, offset, tether ? max(max$1, tetherMax) : max$1);
      popperOffsets[mainAxis] = preventedOffset;
      data[mainAxis] = preventedOffset - offset;
    }

    if (checkAltAxis) {
      var _mainSide = mainAxis === 'x' ? top : left;

      var _altSide = mainAxis === 'x' ? bottom : right;

      var _offset = popperOffsets[altAxis];

      var _min = _offset + overflow[_mainSide];

      var _max = _offset - overflow[_altSide];

      var _preventedOffset = within(tether ? min(_min, tetherMin) : _min, _offset, tether ? max(_max, tetherMax) : _max);

      popperOffsets[altAxis] = _preventedOffset;
      data[altAxis] = _preventedOffset - _offset;
    }
  }

  state.modifiersData[name] = data;
} // eslint-disable-next-line import/no-unused-modules


var preventOverflow$1 = {
  name: 'preventOverflow',
  enabled: true,
  phase: 'main',
  fn: preventOverflow,
  requiresIfExists: ['offset']
};

function getHTMLElementScroll(element) {
  return {
    scrollLeft: element.scrollLeft,
    scrollTop: element.scrollTop
  };
}

function getNodeScroll(node) {
  if (node === getWindow(node) || !isHTMLElement(node)) {
    return getWindowScroll(node);
  } else {
    return getHTMLElementScroll(node);
  }
}

// Composite means it takes into account transforms as well as layout.

function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
  if (isFixed === void 0) {
    isFixed = false;
  }

  var documentElement = getDocumentElement(offsetParent);
  var rect = getBoundingClientRect(elementOrVirtualElement);
  var isOffsetParentAnElement = isHTMLElement(offsetParent);
  var scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  var offsets = {
    x: 0,
    y: 0
  };

  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== 'body' || // https://github.com/popperjs/popper-core/issues/1078
    isScrollParent(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }

    if (isHTMLElement(offsetParent)) {
      offsets = getBoundingClientRect(offsetParent);
      offsets.x += offsetParent.clientLeft;
      offsets.y += offsetParent.clientTop;
    } else if (documentElement) {
      offsets.x = getWindowScrollBarX(documentElement);
    }
  }

  return {
    x: rect.left + scroll.scrollLeft - offsets.x,
    y: rect.top + scroll.scrollTop - offsets.y,
    width: rect.width,
    height: rect.height
  };
}

function order(modifiers) {
  var map = new Map();
  var visited = new Set();
  var result = [];
  modifiers.forEach(function (modifier) {
    map.set(modifier.name, modifier);
  }); // On visiting object, check for its dependencies and visit them recursively

  function sort(modifier) {
    visited.add(modifier.name);
    var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
    requires.forEach(function (dep) {
      if (!visited.has(dep)) {
        var depModifier = map.get(dep);

        if (depModifier) {
          sort(depModifier);
        }
      }
    });
    result.push(modifier);
  }

  modifiers.forEach(function (modifier) {
    if (!visited.has(modifier.name)) {
      // check for visited object
      sort(modifier);
    }
  });
  return result;
}

function orderModifiers(modifiers) {
  // order based on dependencies
  var orderedModifiers = order(modifiers); // order based on phase

  return modifierPhases.reduce(function (acc, phase) {
    return acc.concat(orderedModifiers.filter(function (modifier) {
      return modifier.phase === phase;
    }));
  }, []);
}

function debounce(fn) {
  var pending;
  return function () {
    if (!pending) {
      pending = new Promise(function (resolve) {
        Promise.resolve().then(function () {
          pending = undefined;
          resolve(fn());
        });
      });
    }

    return pending;
  };
}

function format(str) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  return [].concat(args).reduce(function (p, c) {
    return p.replace(/%s/, c);
  }, str);
}

var INVALID_MODIFIER_ERROR = 'Popper: modifier "%s" provided an invalid %s property, expected %s but got %s';
var MISSING_DEPENDENCY_ERROR = 'Popper: modifier "%s" requires "%s", but "%s" modifier is not available';
var VALID_PROPERTIES = ['name', 'enabled', 'phase', 'fn', 'effect', 'requires', 'options'];
function validateModifiers(modifiers) {
  modifiers.forEach(function (modifier) {
    Object.keys(modifier).forEach(function (key) {
      switch (key) {
        case 'name':
          if (typeof modifier.name !== 'string') {
            console.error(format(INVALID_MODIFIER_ERROR, String(modifier.name), '"name"', '"string"', "\"" + String(modifier.name) + "\""));
          }

          break;

        case 'enabled':
          if (typeof modifier.enabled !== 'boolean') {
            console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"enabled"', '"boolean"', "\"" + String(modifier.enabled) + "\""));
          }

        case 'phase':
          if (modifierPhases.indexOf(modifier.phase) < 0) {
            console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"phase"', "either " + modifierPhases.join(', '), "\"" + String(modifier.phase) + "\""));
          }

          break;

        case 'fn':
          if (typeof modifier.fn !== 'function') {
            console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"fn"', '"function"', "\"" + String(modifier.fn) + "\""));
          }

          break;

        case 'effect':
          if (typeof modifier.effect !== 'function') {
            console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"effect"', '"function"', "\"" + String(modifier.fn) + "\""));
          }

          break;

        case 'requires':
          if (!Array.isArray(modifier.requires)) {
            console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"requires"', '"array"', "\"" + String(modifier.requires) + "\""));
          }

          break;

        case 'requiresIfExists':
          if (!Array.isArray(modifier.requiresIfExists)) {
            console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"requiresIfExists"', '"array"', "\"" + String(modifier.requiresIfExists) + "\""));
          }

          break;

        case 'options':
        case 'data':
          break;

        default:
          console.error("PopperJS: an invalid property has been provided to the \"" + modifier.name + "\" modifier, valid properties are " + VALID_PROPERTIES.map(function (s) {
            return "\"" + s + "\"";
          }).join(', ') + "; but \"" + key + "\" was provided.");
      }

      modifier.requires && modifier.requires.forEach(function (requirement) {
        if (modifiers.find(function (mod) {
          return mod.name === requirement;
        }) == null) {
          console.error(format(MISSING_DEPENDENCY_ERROR, String(modifier.name), requirement, requirement));
        }
      });
    });
  });
}

function uniqueBy(arr, fn) {
  var identifiers = new Set();
  return arr.filter(function (item) {
    var identifier = fn(item);

    if (!identifiers.has(identifier)) {
      identifiers.add(identifier);
      return true;
    }
  });
}

function mergeByName(modifiers) {
  var merged = modifiers.reduce(function (merged, current) {
    var existing = merged[current.name];
    merged[current.name] = existing ? Object.assign({}, existing, current, {
      options: Object.assign({}, existing.options, current.options),
      data: Object.assign({}, existing.data, current.data)
    }) : current;
    return merged;
  }, {}); // IE11 does not support Object.values

  return Object.keys(merged).map(function (key) {
    return merged[key];
  });
}

var INVALID_ELEMENT_ERROR = 'Popper: Invalid reference or popper argument provided. They must be either a DOM element or virtual element.';
var INFINITE_LOOP_ERROR = 'Popper: An infinite loop in the modifiers cycle has been detected! The cycle has been interrupted to prevent a browser crash.';
var DEFAULT_OPTIONS = {
  placement: 'bottom',
  modifiers: [],
  strategy: 'absolute'
};

function areValidElements() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return !args.some(function (element) {
    return !(element && typeof element.getBoundingClientRect === 'function');
  });
}

function popperGenerator(generatorOptions) {
  if (generatorOptions === void 0) {
    generatorOptions = {};
  }

  var _generatorOptions = generatorOptions,
      _generatorOptions$def = _generatorOptions.defaultModifiers,
      defaultModifiers = _generatorOptions$def === void 0 ? [] : _generatorOptions$def,
      _generatorOptions$def2 = _generatorOptions.defaultOptions,
      defaultOptions = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
  return function createPopper(reference, popper, options) {
    if (options === void 0) {
      options = defaultOptions;
    }

    var state = {
      placement: 'bottom',
      orderedModifiers: [],
      options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions),
      modifiersData: {},
      elements: {
        reference: reference,
        popper: popper
      },
      attributes: {},
      styles: {}
    };
    var effectCleanupFns = [];
    var isDestroyed = false;
    var instance = {
      state: state,
      setOptions: function setOptions(options) {
        cleanupModifierEffects();
        state.options = Object.assign({}, defaultOptions, state.options, options);
        state.scrollParents = {
          reference: isElement(reference) ? listScrollParents(reference) : reference.contextElement ? listScrollParents(reference.contextElement) : [],
          popper: listScrollParents(popper)
        }; // Orders the modifiers based on their dependencies and `phase`
        // properties

        var orderedModifiers = orderModifiers(mergeByName([].concat(defaultModifiers, state.options.modifiers))); // Strip out disabled modifiers

        state.orderedModifiers = orderedModifiers.filter(function (m) {
          return m.enabled;
        }); // Validate the provided modifiers so that the consumer will get warned
        // if one of the modifiers is invalid for any reason

        if (process.env.NODE_ENV !== "production") {
          var modifiers = uniqueBy([].concat(orderedModifiers, state.options.modifiers), function (_ref) {
            var name = _ref.name;
            return name;
          });
          validateModifiers(modifiers);

          if (getBasePlacement(state.options.placement) === auto) {
            var flipModifier = state.orderedModifiers.find(function (_ref2) {
              var name = _ref2.name;
              return name === 'flip';
            });

            if (!flipModifier) {
              console.error(['Popper: "auto" placements require the "flip" modifier be', 'present and enabled to work.'].join(' '));
            }
          }

          var _getComputedStyle = getComputedStyle$1(popper),
              marginTop = _getComputedStyle.marginTop,
              marginRight = _getComputedStyle.marginRight,
              marginBottom = _getComputedStyle.marginBottom,
              marginLeft = _getComputedStyle.marginLeft; // We no longer take into account `margins` on the popper, and it can
          // cause bugs with positioning, so we'll warn the consumer


          if ([marginTop, marginRight, marginBottom, marginLeft].some(function (margin) {
            return parseFloat(margin);
          })) {
            console.warn(['Popper: CSS "margin" styles cannot be used to apply padding', 'between the popper and its reference element or boundary.', 'To replicate margin, use the `offset` modifier, as well as', 'the `padding` option in the `preventOverflow` and `flip`', 'modifiers.'].join(' '));
          }
        }

        runModifierEffects();
        return instance.update();
      },
      // Sync update – it will always be executed, even if not necessary. This
      // is useful for low frequency updates where sync behavior simplifies the
      // logic.
      // For high frequency updates (e.g. `resize` and `scroll` events), always
      // prefer the async Popper#update method
      forceUpdate: function forceUpdate() {
        if (isDestroyed) {
          return;
        }

        var _state$elements = state.elements,
            reference = _state$elements.reference,
            popper = _state$elements.popper; // Don't proceed if `reference` or `popper` are not valid elements
        // anymore

        if (!areValidElements(reference, popper)) {
          if (process.env.NODE_ENV !== "production") {
            console.error(INVALID_ELEMENT_ERROR);
          }

          return;
        } // Store the reference and popper rects to be read by modifiers


        state.rects = {
          reference: getCompositeRect(reference, getOffsetParent(popper), state.options.strategy === 'fixed'),
          popper: getLayoutRect(popper)
        }; // Modifiers have the ability to reset the current update cycle. The
        // most common use case for this is the `flip` modifier changing the
        // placement, which then needs to re-run all the modifiers, because the
        // logic was previously ran for the previous placement and is therefore
        // stale/incorrect

        state.reset = false;
        state.placement = state.options.placement; // On each update cycle, the `modifiersData` property for each modifier
        // is filled with the initial data specified by the modifier. This means
        // it doesn't persist and is fresh on each update.
        // To ensure persistent data, use `${name}#persistent`

        state.orderedModifiers.forEach(function (modifier) {
          return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
        });
        var __debug_loops__ = 0;

        for (var index = 0; index < state.orderedModifiers.length; index++) {
          if (process.env.NODE_ENV !== "production") {
            __debug_loops__ += 1;

            if (__debug_loops__ > 100) {
              console.error(INFINITE_LOOP_ERROR);
              break;
            }
          }

          if (state.reset === true) {
            state.reset = false;
            index = -1;
            continue;
          }

          var _state$orderedModifie = state.orderedModifiers[index],
              fn = _state$orderedModifie.fn,
              _state$orderedModifie2 = _state$orderedModifie.options,
              _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2,
              name = _state$orderedModifie.name;

          if (typeof fn === 'function') {
            state = fn({
              state: state,
              options: _options,
              name: name,
              instance: instance
            }) || state;
          }
        }
      },
      // Async and optimistically optimized update – it will not be executed if
      // not necessary (debounced to run at most once-per-tick)
      update: debounce(function () {
        return new Promise(function (resolve) {
          instance.forceUpdate();
          resolve(state);
        });
      }),
      destroy: function destroy() {
        cleanupModifierEffects();
        isDestroyed = true;
      }
    };

    if (!areValidElements(reference, popper)) {
      if (process.env.NODE_ENV !== "production") {
        console.error(INVALID_ELEMENT_ERROR);
      }

      return instance;
    }

    instance.setOptions(options).then(function (state) {
      if (!isDestroyed && options.onFirstUpdate) {
        options.onFirstUpdate(state);
      }
    }); // Modifiers have the ability to execute arbitrary code before the first
    // update cycle runs. They will be executed in the same order as the update
    // cycle. This is useful when a modifier adds some persistent data that
    // other modifiers need to use, but the modifier is run after the dependent
    // one.

    function runModifierEffects() {
      state.orderedModifiers.forEach(function (_ref3) {
        var name = _ref3.name,
            _ref3$options = _ref3.options,
            options = _ref3$options === void 0 ? {} : _ref3$options,
            effect = _ref3.effect;

        if (typeof effect === 'function') {
          var cleanupFn = effect({
            state: state,
            name: name,
            instance: instance,
            options: options
          });

          var noopFn = function noopFn() {};

          effectCleanupFns.push(cleanupFn || noopFn);
        }
      });
    }

    function cleanupModifierEffects() {
      effectCleanupFns.forEach(function (fn) {
        return fn();
      });
      effectCleanupFns = [];
    }

    return instance;
  };
}

var defaultModifiers = [eventListeners, popperOffsets$1, computeStyles$1, applyStyles$1, offset$1, flip$1, preventOverflow$1, arrow$1, hide$1];
var createPopper = /*#__PURE__*/popperGenerator({
  defaultModifiers: defaultModifiers
}); // eslint-disable-next-line import/no-unused-modules

class Suggest {
    constructor(owner, containerEl, scope) {
        this.owner = owner;
        this.containerEl = containerEl;
        containerEl.on("click", ".suggestion-item", this.onSuggestionClick.bind(this));
        containerEl.on("mousemove", ".suggestion-item", this.onSuggestionMouseover.bind(this));
        scope.register([], "ArrowUp", (event) => {
            if (!event.isComposing) {
                this.setSelectedItem(this.selectedItem - 1, true);
                return false;
            }
        });
        scope.register([], "ArrowDown", (event) => {
            if (!event.isComposing) {
                this.setSelectedItem(this.selectedItem + 1, true);
                return false;
            }
        });
        scope.register([], "Enter", (event) => {
            if (!event.isComposing) {
                this.useSelectedItem(event);
                return false;
            }
        });
    }
    onSuggestionClick(event, el) {
        event.preventDefault();
        const item = this.suggestions.indexOf(el);
        this.setSelectedItem(item, false);
        this.useSelectedItem(event);
    }
    onSuggestionMouseover(_event, el) {
        const item = this.suggestions.indexOf(el);
        this.setSelectedItem(item, false);
    }
    setSuggestions(values) {
        this.containerEl.empty();
        const suggestionEls = [];
        values.forEach((value) => {
            const suggestionEl = this.containerEl.createDiv("suggestion-item");
            this.owner.renderSuggestion(value, suggestionEl);
            suggestionEls.push(suggestionEl);
        });
        this.values = values;
        this.suggestions = suggestionEls;
        this.setSelectedItem(0, false);
    }
    useSelectedItem(event) {
        const currentValue = this.values[this.selectedItem];
        if (currentValue) {
            this.owner.selectSuggestion(currentValue, event);
        }
    }
    setSelectedItem(selectedIndex, scrollIntoView) {
        const normalizedIndex = wrapAround(selectedIndex, this.suggestions.length);
        const prevSelectedSuggestion = this.suggestions[this.selectedItem];
        const selectedSuggestion = this.suggestions[normalizedIndex];
        prevSelectedSuggestion === null || prevSelectedSuggestion === void 0 ? void 0 : prevSelectedSuggestion.removeClass("is-selected");
        selectedSuggestion === null || selectedSuggestion === void 0 ? void 0 : selectedSuggestion.addClass("is-selected");
        this.selectedItem = normalizedIndex;
        if (scrollIntoView) {
            selectedSuggestion.scrollIntoView(false);
        }
    }
}
class TextInputSuggest {
    constructor(app, inputEl) {
        this.app = app;
        this.inputEl = inputEl;
        this.scope = new obsidian.Scope();
        this.suggestEl = createDiv("suggestion-container");
        const suggestion = this.suggestEl.createDiv("suggestion");
        this.suggest = new Suggest(this, suggestion, this.scope);
        this.scope.register([], "Escape", this.close.bind(this));
        this.inputEl.addEventListener("input", this.onInputChanged.bind(this));
        this.inputEl.addEventListener("focus", this.onInputChanged.bind(this));
        this.inputEl.addEventListener("blur", this.close.bind(this));
        this.suggestEl.on("mousedown", ".suggestion-container", (event) => {
            event.preventDefault();
        });
    }
    onInputChanged() {
        const inputStr = this.inputEl.value;
        const suggestions = this.getSuggestions(inputStr);
        if (suggestions.length > 0) {
            this.suggest.setSuggestions(suggestions);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this.open(this.app.dom.appContainerEl, this.inputEl);
        }
    }
    open(container, inputEl) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.app.keymap.pushScope(this.scope);
        container.appendChild(this.suggestEl);
        this.popper = createPopper(inputEl, this.suggestEl, {
            placement: "bottom-start",
            modifiers: [
                {
                    name: "sameWidth",
                    enabled: true,
                    fn: ({ state, instance }) => {
                        // Note: positioning needs to be calculated twice -
                        // first pass - positioning it according to the width of the popper
                        // second pass - position it with the width bound to the reference element
                        // we need to early exit to avoid an infinite loop
                        const targetWidth = `${state.rects.reference.width}px`;
                        if (state.styles.popper.width === targetWidth) {
                            return;
                        }
                        state.styles.popper.width = targetWidth;
                        instance.update();
                    },
                    phase: "beforeWrite",
                    requires: ["computeStyles"],
                },
            ],
        });
    }
    close() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.app.keymap.popScope(this.scope);
        this.suggest.setSuggestions([]);
        this.popper.destroy();
        this.suggestEl.detach();
    }
}

class FileSuggest extends TextInputSuggest {
    getSuggestions(inputStr) {
        const abstractFiles = this.app.vault.getAllLoadedFiles();
        const files = [];
        const lowerCaseInputStr = inputStr.toLowerCase();
        abstractFiles.forEach((file) => {
            if (file instanceof obsidian.TFile &&
                file.extension === "md" &&
                file.path.toLowerCase().contains(lowerCaseInputStr)) {
                files.push(file);
            }
        });
        return files;
    }
    renderSuggestion(file, el) {
        el.setText(file.path);
    }
    selectSuggestion(file) {
        this.inputEl.value = file.path;
        this.inputEl.trigger("input");
        this.close();
    }
}
class FolderSuggest extends TextInputSuggest {
    getSuggestions(inputStr) {
        const abstractFiles = this.app.vault.getAllLoadedFiles();
        const folders = [];
        const lowerCaseInputStr = inputStr.toLowerCase();
        abstractFiles.forEach((folder) => {
            if (folder instanceof obsidian.TFolder &&
                folder.path.toLowerCase().contains(lowerCaseInputStr)) {
                folders.push(folder);
            }
        });
        return folders;
    }
    renderSuggestion(file, el) {
        el.setText(file.path);
    }
    selectSuggestion(file) {
        this.inputEl.value = file.path;
        this.inputEl.trigger("input");
        this.close();
    }
}

/* src/settings/NoteTemplateSetting.svelte generated by Svelte v3.35.0 */

function create_if_block$2(ctx) {
	let div;
	let t;

	return {
		c() {
			div = element("div");
			t = text(/*error*/ ctx[3]);
			attr(div, "class", "has-error");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, t);
		},
		p(ctx, dirty) {
			if (dirty & /*error*/ 8) set_data(t, /*error*/ ctx[3]);
		},
		d(detaching) {
			if (detaching) detach(div);
		}
	};
}

function create_fragment$2(ctx) {
	let div4;
	let div2;
	let div0;
	let t0_value = capitalize(/*periodicity*/ ctx[1]) + "";
	let t0;
	let t1;
	let t2;
	let div1;
	let t4;
	let t5;
	let div3;
	let input;
	let mounted;
	let dispose;
	let if_block = /*error*/ ctx[3] && create_if_block$2(ctx);

	return {
		c() {
			div4 = element("div");
			div2 = element("div");
			div0 = element("div");
			t0 = text(t0_value);
			t1 = text(" Note Template");
			t2 = space();
			div1 = element("div");
			div1.textContent = "Choose the file to use as a template";
			t4 = space();
			if (if_block) if_block.c();
			t5 = space();
			div3 = element("div");
			input = element("input");
			attr(div0, "class", "setting-item-name");
			attr(div1, "class", "setting-item-description");
			attr(div2, "class", "setting-item-info");
			attr(input, "type", "text");
			attr(input, "spellcheck", false);
			attr(input, "placeholder", "Example: folder/note");
			toggle_class(input, "has-error", !!/*error*/ ctx[3]);
			attr(div3, "class", "setting-item-control");
			attr(div4, "class", "setting-item");
		},
		m(target, anchor) {
			insert(target, div4, anchor);
			append(div4, div2);
			append(div2, div0);
			append(div0, t0);
			append(div0, t1);
			append(div2, t2);
			append(div2, div1);
			append(div2, t4);
			if (if_block) if_block.m(div2, null);
			append(div4, t5);
			append(div4, div3);
			append(div3, input);
			/*input_binding*/ ctx[7](input);
			set_input_value(input, /*$settings*/ ctx[2][/*periodicity*/ ctx[1]].template);

			if (!mounted) {
				dispose = [
					listen(input, "input", /*input_input_handler*/ ctx[8]),
					listen(input, "change", /*validateOnBlur*/ ctx[5]),
					listen(input, "input", /*clearError*/ ctx[6])
				];

				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			if (dirty & /*periodicity*/ 2 && t0_value !== (t0_value = capitalize(/*periodicity*/ ctx[1]) + "")) set_data(t0, t0_value);

			if (/*error*/ ctx[3]) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block$2(ctx);
					if_block.c();
					if_block.m(div2, null);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}

			if (dirty & /*$settings, periodicity*/ 6 && input.value !== /*$settings*/ ctx[2][/*periodicity*/ ctx[1]].template) {
				set_input_value(input, /*$settings*/ ctx[2][/*periodicity*/ ctx[1]].template);
			}

			if (dirty & /*error*/ 8) {
				toggle_class(input, "has-error", !!/*error*/ ctx[3]);
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(div4);
			if (if_block) if_block.d();
			/*input_binding*/ ctx[7](null);
			mounted = false;
			run_all(dispose);
		}
	};
}

function instance$2($$self, $$props, $$invalidate) {
	let $settings,
		$$unsubscribe_settings = noop,
		$$subscribe_settings = () => ($$unsubscribe_settings(), $$unsubscribe_settings = subscribe(settings, $$value => $$invalidate(2, $settings = $$value)), settings);

	$$self.$$.on_destroy.push(() => $$unsubscribe_settings());
	
	
	let { settings } = $$props;
	$$subscribe_settings();
	let { periodicity } = $$props;
	let error;
	let inputEl;

	function validateOnBlur() {
		$$invalidate(3, error = validateTemplate(inputEl.value));
	}

	function clearError() {
		$$invalidate(3, error = "");
	}

	onMount(() => {
		$$invalidate(3, error = validateTemplate(inputEl.value));
		new FileSuggest(window.app, inputEl);
	});

	function input_binding($$value) {
		binding_callbacks[$$value ? "unshift" : "push"](() => {
			inputEl = $$value;
			$$invalidate(4, inputEl);
		});
	}

	function input_input_handler() {
		$settings[periodicity].template = this.value;
		settings.set($settings);
		$$invalidate(1, periodicity);
	}

	$$self.$$set = $$props => {
		if ("settings" in $$props) $$subscribe_settings($$invalidate(0, settings = $$props.settings));
		if ("periodicity" in $$props) $$invalidate(1, periodicity = $$props.periodicity);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*$settings, periodicity*/ 6) {
			$settings[periodicity].template || "";
		}
	};

	return [
		settings,
		periodicity,
		$settings,
		error,
		inputEl,
		validateOnBlur,
		clearError,
		input_binding,
		input_input_handler
	];
}

class NoteTemplateSetting extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$2, create_fragment$2, safe_not_equal, { settings: 0, periodicity: 1 });
	}
}

/* src/settings/NoteFolderSetting.svelte generated by Svelte v3.35.0 */

function create_if_block$1(ctx) {
	let div;
	let t;

	return {
		c() {
			div = element("div");
			t = text(/*error*/ ctx[4]);
			attr(div, "class", "has-error");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, t);
		},
		p(ctx, dirty) {
			if (dirty & /*error*/ 16) set_data(t, /*error*/ ctx[4]);
		},
		d(detaching) {
			if (detaching) detach(div);
		}
	};
}

function create_fragment$1(ctx) {
	let div4;
	let div2;
	let div0;
	let t1;
	let div1;
	let t2;
	let t3;
	let t4;
	let t5;
	let t6;
	let div3;
	let input;
	let mounted;
	let dispose;
	let if_block = /*error*/ ctx[4] && create_if_block$1(ctx);

	return {
		c() {
			div4 = element("div");
			div2 = element("div");
			div0 = element("div");
			div0.textContent = "Note Folder";
			t1 = space();
			div1 = element("div");
			t2 = text("New ");
			t3 = text(/*periodicity*/ ctx[1]);
			t4 = text(" notes will be placed here");
			t5 = space();
			if (if_block) if_block.c();
			t6 = space();
			div3 = element("div");
			input = element("input");
			attr(div0, "class", "setting-item-name");
			attr(div1, "class", "setting-item-description");
			attr(div2, "class", "setting-item-info");
			attr(input, "type", "text");
			attr(input, "spellcheck", false);
			attr(input, "placeholder", "Example: folder 1/folder 2");
			toggle_class(input, "has-error", !!/*error*/ ctx[4]);
			attr(div3, "class", "setting-item-control");
			attr(div4, "class", "setting-item");
		},
		m(target, anchor) {
			insert(target, div4, anchor);
			append(div4, div2);
			append(div2, div0);
			append(div2, t1);
			append(div2, div1);
			append(div1, t2);
			append(div1, t3);
			append(div1, t4);
			append(div2, t5);
			if (if_block) if_block.m(div2, null);
			append(div4, t6);
			append(div4, div3);
			append(div3, input);
			set_input_value(input, /*$settings*/ ctx[2][/*periodicity*/ ctx[1]].folder);
			/*input_binding*/ ctx[8](input);

			if (!mounted) {
				dispose = [
					listen(input, "input", /*input_input_handler*/ ctx[7]),
					listen(input, "change", /*onChange*/ ctx[5]),
					listen(input, "input", /*clearError*/ ctx[6])
				];

				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			if (dirty & /*periodicity*/ 2) set_data(t3, /*periodicity*/ ctx[1]);

			if (/*error*/ ctx[4]) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block$1(ctx);
					if_block.c();
					if_block.m(div2, null);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}

			if (dirty & /*$settings, periodicity*/ 6 && input.value !== /*$settings*/ ctx[2][/*periodicity*/ ctx[1]].folder) {
				set_input_value(input, /*$settings*/ ctx[2][/*periodicity*/ ctx[1]].folder);
			}

			if (dirty & /*error*/ 16) {
				toggle_class(input, "has-error", !!/*error*/ ctx[4]);
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(div4);
			if (if_block) if_block.d();
			/*input_binding*/ ctx[8](null);
			mounted = false;
			run_all(dispose);
		}
	};
}

function instance$1($$self, $$props, $$invalidate) {
	let $settings,
		$$unsubscribe_settings = noop,
		$$subscribe_settings = () => ($$unsubscribe_settings(), $$unsubscribe_settings = subscribe(settings, $$value => $$invalidate(2, $settings = $$value)), settings);

	$$self.$$.on_destroy.push(() => $$unsubscribe_settings());
	
	
	let { settings } = $$props;
	$$subscribe_settings();
	let { periodicity } = $$props;
	let inputEl;
	let error;

	function onChange() {
		$$invalidate(4, error = validateFolder(inputEl.value));
	}

	function clearError() {
		$$invalidate(4, error = "");
	}

	onMount(() => {
		$$invalidate(4, error = validateFolder(inputEl.value));
		new FolderSuggest(window.app, inputEl);
	});

	function input_input_handler() {
		$settings[periodicity].folder = this.value;
		settings.set($settings);
		$$invalidate(1, periodicity);
	}

	function input_binding($$value) {
		binding_callbacks[$$value ? "unshift" : "push"](() => {
			inputEl = $$value;
			$$invalidate(3, inputEl);
		});
	}

	$$self.$$set = $$props => {
		if ("settings" in $$props) $$subscribe_settings($$invalidate(0, settings = $$props.settings));
		if ("periodicity" in $$props) $$invalidate(1, periodicity = $$props.periodicity);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*$settings, periodicity*/ 6) {
			$settings[periodicity].folder || "";
		}
	};

	return [
		settings,
		periodicity,
		$settings,
		inputEl,
		error,
		onChange,
		clearError,
		input_input_handler,
		input_binding
	];
}

class NoteFolderSetting extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$1, create_fragment$1, safe_not_equal, { settings: 0, periodicity: 1 });
	}
}

/* src/settings/SettingsTab.svelte generated by Svelte v3.35.0 */

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[9] = list[i];
	return child_ctx;
}

// (33:0) {#if $settingsStore.showGettingStartedBanner}
function create_if_block_1(ctx) {
	let gettingstartedbanner;
	let current;

	gettingstartedbanner = new GettingStartedBanner({
			props: {
				migrateDailyNoteSettings: /*migrateDailyNoteSettings*/ ctx[2],
				settings: /*settingsStore*/ ctx[1],
				handleTeardown: /*func*/ ctx[6]
			}
		});

	return {
		c() {
			create_component(gettingstartedbanner.$$.fragment);
		},
		m(target, anchor) {
			mount_component(gettingstartedbanner, target, anchor);
			current = true;
		},
		p(ctx, dirty) {
			const gettingstartedbanner_changes = {};
			if (dirty & /*$settingsStore*/ 1) gettingstartedbanner_changes.handleTeardown = /*func*/ ctx[6];
			gettingstartedbanner.$set(gettingstartedbanner_changes);
		},
		i(local) {
			if (current) return;
			transition_in(gettingstartedbanner.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(gettingstartedbanner.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(gettingstartedbanner, detaching);
		}
	};
}

// (62:2) {#if $settingsStore[periodicity].enabled}
function create_if_block(ctx) {
	let div;
	let noteformatsetting;
	let t0;
	let notetemplatesetting;
	let t1;
	let notefoldersetting;
	let t2;
	let div_intro;
	let div_outro;
	let current;

	noteformatsetting = new NoteFormatSetting({
			props: {
				periodicity: /*periodicity*/ ctx[9],
				settings: /*settingsStore*/ ctx[1]
			}
		});

	notetemplatesetting = new NoteTemplateSetting({
			props: {
				periodicity: /*periodicity*/ ctx[9],
				settings: /*settingsStore*/ ctx[1]
			}
		});

	notefoldersetting = new NoteFolderSetting({
			props: {
				periodicity: /*periodicity*/ ctx[9],
				settings: /*settingsStore*/ ctx[1]
			}
		});

	return {
		c() {
			div = element("div");
			create_component(noteformatsetting.$$.fragment);
			t0 = space();
			create_component(notetemplatesetting.$$.fragment);
			t1 = space();
			create_component(notefoldersetting.$$.fragment);
			t2 = space();
		},
		m(target, anchor) {
			insert(target, div, anchor);
			mount_component(noteformatsetting, div, null);
			append(div, t0);
			mount_component(notetemplatesetting, div, null);
			append(div, t1);
			mount_component(notefoldersetting, div, null);
			append(div, t2);
			current = true;
		},
		p: noop,
		i(local) {
			if (current) return;
			transition_in(noteformatsetting.$$.fragment, local);
			transition_in(notetemplatesetting.$$.fragment, local);
			transition_in(notefoldersetting.$$.fragment, local);

			add_render_callback(() => {
				if (div_outro) div_outro.end(1);
				if (!div_intro) div_intro = create_in_transition(div, slide, {});
				div_intro.start();
			});

			current = true;
		},
		o(local) {
			transition_out(noteformatsetting.$$.fragment, local);
			transition_out(notetemplatesetting.$$.fragment, local);
			transition_out(notefoldersetting.$$.fragment, local);
			if (div_intro) div_intro.invalidate();
			div_outro = create_out_transition(div, slide, {});
			current = false;
		},
		d(detaching) {
			if (detaching) detach(div);
			destroy_component(noteformatsetting);
			destroy_component(notetemplatesetting);
			destroy_component(notefoldersetting);
			if (detaching && div_outro) div_outro.end();
		}
	};
}

// (42:0) {#each periodicities as periodicity}
function create_each_block(ctx) {
	let div4;
	let div1;
	let div0;
	let h3;
	let t0_value = capitalize(/*periodicity*/ ctx[9]) + "";
	let t0;
	let t1;
	let t2;
	let div3;
	let div2;
	let t3;
	let if_block_anchor;
	let current;
	let mounted;
	let dispose;

	function click_handler() {
		return /*click_handler*/ ctx[7](/*periodicity*/ ctx[9]);
	}

	let if_block = /*$settingsStore*/ ctx[0][/*periodicity*/ ctx[9]].enabled && create_if_block(ctx);

	return {
		c() {
			div4 = element("div");
			div1 = element("div");
			div0 = element("div");
			h3 = element("h3");
			t0 = text(t0_value);
			t1 = text(" Notes");
			t2 = space();
			div3 = element("div");
			div2 = element("div");
			t3 = space();
			if (if_block) if_block.c();
			if_block_anchor = empty();
			attr(div0, "class", "setting-item-name");
			attr(div1, "class", "setting-item-info");
			attr(div2, "class", "checkbox-container");
			toggle_class(div2, "is-enabled", /*$settingsStore*/ ctx[0][/*periodicity*/ ctx[9]].enabled);
			attr(div3, "class", "setting-item-control");
			attr(div4, "class", "setting-item setting-item-heading");
		},
		m(target, anchor) {
			insert(target, div4, anchor);
			append(div4, div1);
			append(div1, div0);
			append(div0, h3);
			append(h3, t0);
			append(h3, t1);
			append(div4, t2);
			append(div4, div3);
			append(div3, div2);
			insert(target, t3, anchor);
			if (if_block) if_block.m(target, anchor);
			insert(target, if_block_anchor, anchor);
			current = true;

			if (!mounted) {
				dispose = listen(div2, "click", click_handler);
				mounted = true;
			}
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;

			if (dirty & /*$settingsStore, periodicities*/ 9) {
				toggle_class(div2, "is-enabled", /*$settingsStore*/ ctx[0][/*periodicity*/ ctx[9]].enabled);
			}

			if (/*$settingsStore*/ ctx[0][/*periodicity*/ ctx[9]].enabled) {
				if (if_block) {
					if_block.p(ctx, dirty);

					if (dirty & /*$settingsStore*/ 1) {
						transition_in(if_block, 1);
					}
				} else {
					if_block = create_if_block(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
			}
		},
		i(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o(local) {
			transition_out(if_block);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(div4);
			if (detaching) detach(t3);
			if (if_block) if_block.d(detaching);
			if (detaching) detach(if_block_anchor);
			mounted = false;
			dispose();
		}
	};
}

function create_fragment(ctx) {
	let t;
	let each_1_anchor;
	let current;
	let if_block = /*$settingsStore*/ ctx[0].showGettingStartedBanner && create_if_block_1(ctx);
	let each_value = /*periodicities*/ ctx[3];
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	const out = i => transition_out(each_blocks[i], 1, 1, () => {
		each_blocks[i] = null;
	});

	return {
		c() {
			if (if_block) if_block.c();
			t = space();

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			each_1_anchor = empty();
		},
		m(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert(target, t, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(target, anchor);
			}

			insert(target, each_1_anchor, anchor);
			current = true;
		},
		p(ctx, [dirty]) {
			if (/*$settingsStore*/ ctx[0].showGettingStartedBanner) {
				if (if_block) {
					if_block.p(ctx, dirty);

					if (dirty & /*$settingsStore*/ 1) {
						transition_in(if_block, 1);
					}
				} else {
					if_block = create_if_block_1(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(t.parentNode, t);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
			}

			if (dirty & /*periodicities, settingsStore, $settingsStore, capitalize*/ 11) {
				each_value = /*periodicities*/ ctx[3];
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
						transition_in(each_blocks[i], 1);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						transition_in(each_blocks[i], 1);
						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
					}
				}

				group_outros();

				for (i = each_value.length; i < each_blocks.length; i += 1) {
					out(i);
				}

				check_outros();
			}
		},
		i(local) {
			if (current) return;
			transition_in(if_block);

			for (let i = 0; i < each_value.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			current = true;
		},
		o(local) {
			transition_out(if_block);
			each_blocks = each_blocks.filter(Boolean);

			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			current = false;
		},
		d(detaching) {
			if (if_block) if_block.d(detaching);
			if (detaching) detach(t);
			destroy_each(each_blocks, detaching);
			if (detaching) detach(each_1_anchor);
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	let $settingsStore;
	
	let { settings } = $$props;
	let { onUpdateSettings } = $$props;
	let settingsStore = writable(settings);
	component_subscribe($$self, settingsStore, value => $$invalidate(0, $settingsStore = value));
	const unsubscribeFromSettings = settingsStore.subscribe(onUpdateSettings);

	function migrateDailyNoteSettings() {
		const dailyNoteSettings = getLegacyDailyNoteSettings();

		settingsStore.update(old => Object.assign(Object.assign({}, old), {
			daily: Object.assign(Object.assign({}, dailyNoteSettings), { enabled: true }),
			hasMigratedDailyNoteSettings: true
		}));
	}

	const periodicities = ["daily", "weekly", "monthly", "quarterly", "yearly"];

	onDestroy(() => {
		unsubscribeFromSettings();
	});

	const func = () => {
		set_store_value(settingsStore, $settingsStore.showGettingStartedBanner = false, $settingsStore);
	};

	const click_handler = periodicity => {
		set_store_value(settingsStore, $settingsStore[periodicity].enabled = !$settingsStore[periodicity].enabled, $settingsStore);
	};

	$$self.$$set = $$props => {
		if ("settings" in $$props) $$invalidate(4, settings = $$props.settings);
		if ("onUpdateSettings" in $$props) $$invalidate(5, onUpdateSettings = $$props.onUpdateSettings);
	};

	return [
		$settingsStore,
		settingsStore,
		migrateDailyNoteSettings,
		periodicities,
		settings,
		onUpdateSettings,
		func,
		click_handler
	];
}

class SettingsTab extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance, create_fragment, safe_not_equal, { settings: 4, onUpdateSettings: 5 });
	}
}

const DEFAULT_SETTINGS = Object.freeze({
    format: "",
    template: "",
    folder: "",
});
class PeriodicNotesSettingsTab extends obsidian.PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }
    display() {
        this.containerEl.empty();
        this.view = new SettingsTab({
            target: this.containerEl,
            props: {
                settings: this.plugin.settings,
                onUpdateSettings: this.plugin.updateSettings,
            },
        });
    }
}

class PeriodicNotesPlugin extends obsidian.Plugin {
    async onload() {
        this.ribbonEl = null;
        this.updateSettings = this.updateSettings.bind(this);
        await this.loadSettings();
        this.addSettingTab(new PeriodicNotesSettingsTab(this.app, this));
        this.app.workspace.onLayoutReady(this.onLayoutReady.bind(this));
        obsidian.addIcon("calendar-day", calendarDayIcon);
        obsidian.addIcon("calendar-week", calendarWeekIcon);
        obsidian.addIcon("calendar-month", calendarMonthIcon);
        obsidian.addIcon("calendar-quarter", calendarQuarterIcon);
        obsidian.addIcon("calendar-year", calendarYearIcon);
    }
    onLayoutReady() {
        // If the user has Calendar Weekly Notes settings, migrate them automatically,
        // since the functionality will be deprecated.
        if (this.isInitialLoad && hasLegacyWeeklyNoteSettings()) {
            this.migrateWeeklySettings();
            this.settings.weekly.enabled = true;
        }
        this.configureRibbonIcons();
        this.configureCommands();
    }
    migrateWeeklySettings() {
        const calendarSettings = getLegacyWeeklyNoteSettings();
        this.updateSettings(Object.assign(Object.assign({}, this.settings), {
            weekly: Object.assign(Object.assign({}, calendarSettings), { enabled: true }),
            hasMigratedWeeklyNoteSettings: true,
        }));
    }
    configureRibbonIcons() {
        var _a;
        (_a = this.ribbonEl) === null || _a === void 0 ? void 0 : _a.detach();
        const configuredPeriodicities = [
            "daily",
            "weekly",
            "monthly",
            "quarterly",
            "yearly",
        ].filter((periodicity) => this.settings[periodicity].enabled);
        if (configuredPeriodicities.length) {
            const periodicity = configuredPeriodicities[0];
            const config = periodConfigs[periodicity];
            this.ribbonEl = this.addRibbonIcon(`calendar-${config.unitOfTime}`, `Open ${config.relativeUnit}`, (event) => openPeriodicNote(periodicity, window.moment(), isMetaPressed(event)));
            this.ribbonEl.addEventListener("contextmenu", (ev) => {
                showFileMenu(this.app, this.settings, {
                    x: ev.pageX,
                    y: ev.pageY,
                });
            });
        }
    }
    configureCommands() {
        // Remove disabled commands
        ["daily", "weekly", "monthly", "quarterly", "yearly"]
            .filter((periodicity) => !this.settings[periodicity].enabled)
            .forEach((periodicity) => {
            getCommands(periodicity).forEach((command) => 
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this.app.commands.removeCommand(`periodic-notes:${command.id}`));
        });
        // register enabled commands
        ["daily", "weekly", "monthly", "quarterly", "yearly"]
            .filter((periodicity) => this.settings[periodicity].enabled)
            .forEach((periodicity) => {
            getCommands(periodicity).forEach(this.addCommand.bind(this));
        });
    }
    async loadSettings() {
        const settings = await this.loadData();
        if (!settings) {
            this.isInitialLoad = true;
        }
        this.settings = Object.assign({}, {
            showGettingStartedBanner: true,
            hasMigratedDailyNoteSettings: false,
            hasMigratedWeeklyNoteSettings: false,
            daily: Object.assign({}, DEFAULT_SETTINGS),
            weekly: Object.assign({}, DEFAULT_SETTINGS),
            monthly: Object.assign({}, DEFAULT_SETTINGS),
            quarterly: Object.assign({}, DEFAULT_SETTINGS),
            yearly: Object.assign({}, DEFAULT_SETTINGS),
        }, settings || {});
    }
    onSettingsUpdate() {
        this.configureCommands();
        this.configureRibbonIcons();
        // Integrations (i.e. Calendar Plugin) can listen for changes to settings
        this.app.workspace.trigger(SETTINGS_UPDATED);
    }
    async updateSettings(val) {
        this.settings = val;
        await this.saveData(this.settings);
        this.onSettingsUpdate();
    }
}

module.exports = PeriodicNotesPlugin;
