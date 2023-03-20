'use strict';

var obsidian = require('obsidian');
var path = require('path');
var fs = require('fs');
var process$1 = require('node:process');
var childProcess = require('child_process');
var _os = require('os');
var require$$0 = require('assert');
var require$$2 = require('events');
var require$$0$2 = require('buffer');
var require$$0$1 = require('stream');
var require$$1 = require('util');
var node_os = require('node:os');
require('electron');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var process__default = /*#__PURE__*/_interopDefaultLegacy(process$1);
var childProcess__default = /*#__PURE__*/_interopDefaultLegacy(childProcess);
var _os__default = /*#__PURE__*/_interopDefaultLegacy(_os);
var require$$0__default = /*#__PURE__*/_interopDefaultLegacy(require$$0);
var require$$2__default = /*#__PURE__*/_interopDefaultLegacy(require$$2);
var require$$0__default$2 = /*#__PURE__*/_interopDefaultLegacy(require$$0$2);
var require$$0__default$1 = /*#__PURE__*/_interopDefaultLegacy(require$$0$1);
var require$$1__default = /*#__PURE__*/_interopDefaultLegacy(require$$1);

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, basedir, module) {
	return module = {
		path: basedir,
		exports: {},
		require: function (path, base) {
			return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
		}
	}, fn(module, module.exports), module.exports;
}

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
}

var windows = isexe$2;
isexe$2.sync = sync$4;



function checkPathExt (path, options) {
  var pathext = options.pathExt !== undefined ?
    options.pathExt : process.env.PATHEXT;

  if (!pathext) {
    return true
  }

  pathext = pathext.split(';');
  if (pathext.indexOf('') !== -1) {
    return true
  }
  for (var i = 0; i < pathext.length; i++) {
    var p = pathext[i].toLowerCase();
    if (p && path.substr(-p.length).toLowerCase() === p) {
      return true
    }
  }
  return false
}

function checkStat$1 (stat, path, options) {
  if (!stat.isSymbolicLink() && !stat.isFile()) {
    return false
  }
  return checkPathExt(path, options)
}

function isexe$2 (path, options, cb) {
  fs__default['default'].stat(path, function (er, stat) {
    cb(er, er ? false : checkStat$1(stat, path, options));
  });
}

function sync$4 (path, options) {
  return checkStat$1(fs__default['default'].statSync(path), path, options)
}

var mode = isexe$1;
isexe$1.sync = sync$3;



function isexe$1 (path, options, cb) {
  fs__default['default'].stat(path, function (er, stat) {
    cb(er, er ? false : checkStat(stat, options));
  });
}

function sync$3 (path, options) {
  return checkStat(fs__default['default'].statSync(path), options)
}

function checkStat (stat, options) {
  return stat.isFile() && checkMode(stat, options)
}

function checkMode (stat, options) {
  var mod = stat.mode;
  var uid = stat.uid;
  var gid = stat.gid;

  var myUid = options.uid !== undefined ?
    options.uid : process.getuid && process.getuid();
  var myGid = options.gid !== undefined ?
    options.gid : process.getgid && process.getgid();

  var u = parseInt('100', 8);
  var g = parseInt('010', 8);
  var o = parseInt('001', 8);
  var ug = u | g;

  var ret = (mod & o) ||
    (mod & g) && gid === myGid ||
    (mod & u) && uid === myUid ||
    (mod & ug) && myUid === 0;

  return ret
}

var core$1;
if (process.platform === 'win32' || commonjsGlobal.TESTING_WINDOWS) {
  core$1 = windows;
} else {
  core$1 = mode;
}

var isexe_1 = isexe;
isexe.sync = sync$2;

function isexe (path, options, cb) {
  if (typeof options === 'function') {
    cb = options;
    options = {};
  }

  if (!cb) {
    if (typeof Promise !== 'function') {
      throw new TypeError('callback not provided')
    }

    return new Promise(function (resolve, reject) {
      isexe(path, options || {}, function (er, is) {
        if (er) {
          reject(er);
        } else {
          resolve(is);
        }
      });
    })
  }

  core$1(path, options || {}, function (er, is) {
    // ignore EACCES because that just means we aren't allowed to run it
    if (er) {
      if (er.code === 'EACCES' || options && options.ignoreErrors) {
        er = null;
        is = false;
      }
    }
    cb(er, is);
  });
}

function sync$2 (path, options) {
  // my kingdom for a filtered catch
  try {
    return core$1.sync(path, options || {})
  } catch (er) {
    if (options && options.ignoreErrors || er.code === 'EACCES') {
      return false
    } else {
      throw er
    }
  }
}

const isWindows = process.platform === 'win32' ||
    process.env.OSTYPE === 'cygwin' ||
    process.env.OSTYPE === 'msys';


const COLON = isWindows ? ';' : ':';


const getNotFoundError = (cmd) =>
  Object.assign(new Error(`not found: ${cmd}`), { code: 'ENOENT' });

const getPathInfo = (cmd, opt) => {
  const colon = opt.colon || COLON;

  // If it has a slash, then we don't bother searching the pathenv.
  // just check the file itself, and that's it.
  const pathEnv = cmd.match(/\//) || isWindows && cmd.match(/\\/) ? ['']
    : (
      [
        // windows always checks the cwd first
        ...(isWindows ? [process.cwd()] : []),
        ...(opt.path || process.env.PATH ||
          /* istanbul ignore next: very unusual */ '').split(colon),
      ]
    );
  const pathExtExe = isWindows
    ? opt.pathExt || process.env.PATHEXT || '.EXE;.CMD;.BAT;.COM'
    : '';
  const pathExt = isWindows ? pathExtExe.split(colon) : [''];

  if (isWindows) {
    if (cmd.indexOf('.') !== -1 && pathExt[0] !== '')
      pathExt.unshift('');
  }

  return {
    pathEnv,
    pathExt,
    pathExtExe,
  }
};

const which = (cmd, opt, cb) => {
  if (typeof opt === 'function') {
    cb = opt;
    opt = {};
  }
  if (!opt)
    opt = {};

  const { pathEnv, pathExt, pathExtExe } = getPathInfo(cmd, opt);
  const found = [];

  const step = i => new Promise((resolve, reject) => {
    if (i === pathEnv.length)
      return opt.all && found.length ? resolve(found)
        : reject(getNotFoundError(cmd))

    const ppRaw = pathEnv[i];
    const pathPart = /^".*"$/.test(ppRaw) ? ppRaw.slice(1, -1) : ppRaw;

    const pCmd = path__default['default'].join(pathPart, cmd);
    const p = !pathPart && /^\.[\\\/]/.test(cmd) ? cmd.slice(0, 2) + pCmd
      : pCmd;

    resolve(subStep(p, i, 0));
  });

  const subStep = (p, i, ii) => new Promise((resolve, reject) => {
    if (ii === pathExt.length)
      return resolve(step(i + 1))
    const ext = pathExt[ii];
    isexe_1(p + ext, { pathExt: pathExtExe }, (er, is) => {
      if (!er && is) {
        if (opt.all)
          found.push(p + ext);
        else
          return resolve(p + ext)
      }
      return resolve(subStep(p, i, ii + 1))
    });
  });

  return cb ? step(0).then(res => cb(null, res), cb) : step(0)
};

const whichSync = (cmd, opt) => {
  opt = opt || {};

  const { pathEnv, pathExt, pathExtExe } = getPathInfo(cmd, opt);
  const found = [];

  for (let i = 0; i < pathEnv.length; i ++) {
    const ppRaw = pathEnv[i];
    const pathPart = /^".*"$/.test(ppRaw) ? ppRaw.slice(1, -1) : ppRaw;

    const pCmd = path__default['default'].join(pathPart, cmd);
    const p = !pathPart && /^\.[\\\/]/.test(cmd) ? cmd.slice(0, 2) + pCmd
      : pCmd;

    for (let j = 0; j < pathExt.length; j ++) {
      const cur = p + pathExt[j];
      try {
        const is = isexe_1.sync(cur, { pathExt: pathExtExe });
        if (is) {
          if (opt.all)
            found.push(cur);
          else
            return cur
        }
      } catch (ex) {}
    }
  }

  if (opt.all && found.length)
    return found

  if (opt.nothrow)
    return null

  throw getNotFoundError(cmd)
};

var which_1 = which;
which.sync = whichSync;

const pathKey = (options = {}) => {
	const environment = options.env || process.env;
	const platform = options.platform || process.platform;

	if (platform !== 'win32') {
		return 'PATH';
	}

	return Object.keys(environment).reverse().find(key => key.toUpperCase() === 'PATH') || 'Path';
};

var pathKey_1 = pathKey;
// TODO: Remove this for the next major release
var _default$2 = pathKey;
pathKey_1.default = _default$2;

function resolveCommandAttempt(parsed, withoutPathExt) {
    const env = parsed.options.env || process.env;
    const cwd = process.cwd();
    const hasCustomCwd = parsed.options.cwd != null;
    // Worker threads do not have process.chdir()
    const shouldSwitchCwd = hasCustomCwd && process.chdir !== undefined && !process.chdir.disabled;

    // If a custom `cwd` was specified, we need to change the process cwd
    // because `which` will do stat calls but does not support a custom cwd
    if (shouldSwitchCwd) {
        try {
            process.chdir(parsed.options.cwd);
        } catch (err) {
            /* Empty */
        }
    }

    let resolved;

    try {
        resolved = which_1.sync(parsed.command, {
            path: env[pathKey_1({ env })],
            pathExt: withoutPathExt ? path__default['default'].delimiter : undefined,
        });
    } catch (e) {
        /* Empty */
    } finally {
        if (shouldSwitchCwd) {
            process.chdir(cwd);
        }
    }

    // If we successfully resolved, ensure that an absolute path is returned
    // Note that when a custom `cwd` was used, we need to resolve to an absolute path based on it
    if (resolved) {
        resolved = path__default['default'].resolve(hasCustomCwd ? parsed.options.cwd : '', resolved);
    }

    return resolved;
}

function resolveCommand(parsed) {
    return resolveCommandAttempt(parsed) || resolveCommandAttempt(parsed, true);
}

var resolveCommand_1 = resolveCommand;

// See http://www.robvanderwoude.com/escapechars.php
const metaCharsRegExp = /([()\][%!^"`<>&|;, *?])/g;

function escapeCommand(arg) {
    // Escape meta chars
    arg = arg.replace(metaCharsRegExp, '^$1');

    return arg;
}

function escapeArgument(arg, doubleEscapeMetaChars) {
    // Convert to string
    arg = `${arg}`;

    // Algorithm below is based on https://qntm.org/cmd

    // Sequence of backslashes followed by a double quote:
    // double up all the backslashes and escape the double quote
    arg = arg.replace(/(\\*)"/g, '$1$1\\"');

    // Sequence of backslashes followed by the end of the string
    // (which will become a double quote later):
    // double up all the backslashes
    arg = arg.replace(/(\\*)$/, '$1$1');

    // All other backslashes occur literally

    // Quote the whole thing:
    arg = `"${arg}"`;

    // Escape meta chars
    arg = arg.replace(metaCharsRegExp, '^$1');

    // Double escape meta chars if necessary
    if (doubleEscapeMetaChars) {
        arg = arg.replace(metaCharsRegExp, '^$1');
    }

    return arg;
}

var command$2 = escapeCommand;
var argument = escapeArgument;

var _escape = {
	command: command$2,
	argument: argument
};

var shebangRegex = /^#!(.*)/;

var shebangCommand = (string = '') => {
	const match = string.match(shebangRegex);

	if (!match) {
		return null;
	}

	const [path, argument] = match[0].replace(/#! ?/, '').split(' ');
	const binary = path.split('/').pop();

	if (binary === 'env') {
		return argument;
	}

	return argument ? `${binary} ${argument}` : binary;
};

function readShebang(command) {
    // Read the first 150 bytes from the file
    const size = 150;
    const buffer = Buffer.alloc(size);

    let fd;

    try {
        fd = fs__default['default'].openSync(command, 'r');
        fs__default['default'].readSync(fd, buffer, 0, size, 0);
        fs__default['default'].closeSync(fd);
    } catch (e) { /* Empty */ }

    // Attempt to extract shebang (null is returned if not a shebang)
    return shebangCommand(buffer.toString());
}

var readShebang_1 = readShebang;

const isWin$1 = process.platform === 'win32';
const isExecutableRegExp = /\.(?:com|exe)$/i;
const isCmdShimRegExp = /node_modules[\\/].bin[\\/][^\\/]+\.cmd$/i;

function detectShebang(parsed) {
    parsed.file = resolveCommand_1(parsed);

    const shebang = parsed.file && readShebang_1(parsed.file);

    if (shebang) {
        parsed.args.unshift(parsed.file);
        parsed.command = shebang;

        return resolveCommand_1(parsed);
    }

    return parsed.file;
}

function parseNonShell(parsed) {
    if (!isWin$1) {
        return parsed;
    }

    // Detect & add support for shebangs
    const commandFile = detectShebang(parsed);

    // We don't need a shell if the command filename is an executable
    const needsShell = !isExecutableRegExp.test(commandFile);

    // If a shell is required, use cmd.exe and take care of escaping everything correctly
    // Note that `forceShell` is an hidden option used only in tests
    if (parsed.options.forceShell || needsShell) {
        // Need to double escape meta chars if the command is a cmd-shim located in `node_modules/.bin/`
        // The cmd-shim simply calls execute the package bin file with NodeJS, proxying any argument
        // Because the escape of metachars with ^ gets interpreted when the cmd.exe is first called,
        // we need to double escape them
        const needsDoubleEscapeMetaChars = isCmdShimRegExp.test(commandFile);

        // Normalize posix paths into OS compatible paths (e.g.: foo/bar -> foo\bar)
        // This is necessary otherwise it will always fail with ENOENT in those cases
        parsed.command = path__default['default'].normalize(parsed.command);

        // Escape command & arguments
        parsed.command = _escape.command(parsed.command);
        parsed.args = parsed.args.map((arg) => _escape.argument(arg, needsDoubleEscapeMetaChars));

        const shellCommand = [parsed.command].concat(parsed.args).join(' ');

        parsed.args = ['/d', '/s', '/c', `"${shellCommand}"`];
        parsed.command = process.env.comspec || 'cmd.exe';
        parsed.options.windowsVerbatimArguments = true; // Tell node's spawn that the arguments are already escaped
    }

    return parsed;
}

function parse(command, args, options) {
    // Normalize arguments, similar to nodejs
    if (args && !Array.isArray(args)) {
        options = args;
        args = null;
    }

    args = args ? args.slice(0) : []; // Clone array to avoid changing the original
    options = Object.assign({}, options); // Clone object to avoid changing the original

    // Build our parsed object
    const parsed = {
        command,
        args,
        options,
        file: undefined,
        original: {
            command,
            args,
        },
    };

    // Delegate further parsing to shell or non-shell
    return options.shell ? parsed : parseNonShell(parsed);
}

var parse_1 = parse;

const isWin = process.platform === 'win32';

function notFoundError(original, syscall) {
    return Object.assign(new Error(`${syscall} ${original.command} ENOENT`), {
        code: 'ENOENT',
        errno: 'ENOENT',
        syscall: `${syscall} ${original.command}`,
        path: original.command,
        spawnargs: original.args,
    });
}

function hookChildProcess(cp, parsed) {
    if (!isWin) {
        return;
    }

    const originalEmit = cp.emit;

    cp.emit = function (name, arg1) {
        // If emitting "exit" event and exit code is 1, we need to check if
        // the command exists and emit an "error" instead
        // See https://github.com/IndigoUnited/node-cross-spawn/issues/16
        if (name === 'exit') {
            const err = verifyENOENT(arg1, parsed);

            if (err) {
                return originalEmit.call(cp, 'error', err);
            }
        }

        return originalEmit.apply(cp, arguments); // eslint-disable-line prefer-rest-params
    };
}

function verifyENOENT(status, parsed) {
    if (isWin && status === 1 && !parsed.file) {
        return notFoundError(parsed.original, 'spawn');
    }

    return null;
}

function verifyENOENTSync(status, parsed) {
    if (isWin && status === 1 && !parsed.file) {
        return notFoundError(parsed.original, 'spawnSync');
    }

    return null;
}

var enoent = {
    hookChildProcess,
    verifyENOENT,
    verifyENOENTSync,
    notFoundError,
};

function spawn(command, args, options) {
    // Parse the arguments
    const parsed = parse_1(command, args, options);

    // Spawn the child process
    const spawned = childProcess__default['default'].spawn(parsed.command, parsed.args, parsed.options);

    // Hook into child process "exit" event to emit an error if the command
    // does not exists, see: https://github.com/IndigoUnited/node-cross-spawn/issues/16
    enoent.hookChildProcess(spawned, parsed);

    return spawned;
}

function spawnSync(command, args, options) {
    // Parse the arguments
    const parsed = parse_1(command, args, options);

    // Spawn the child process
    const result = childProcess__default['default'].spawnSync(parsed.command, parsed.args, parsed.options);

    // Analyze if the command does not exist, see: https://github.com/IndigoUnited/node-cross-spawn/issues/16
    result.error = result.error || enoent.verifyENOENTSync(result.status, parsed);

    return result;
}

var crossSpawn = spawn;
var spawn_1 = spawn;
var sync$1 = spawnSync;

var _parse = parse_1;
var _enoent = enoent;
crossSpawn.spawn = spawn_1;
crossSpawn.sync = sync$1;
crossSpawn._parse = _parse;
crossSpawn._enoent = _enoent;

var stripFinalNewline = input => {
	const LF = typeof input === 'string' ? '\n' : '\n'.charCodeAt();
	const CR = typeof input === 'string' ? '\r' : '\r'.charCodeAt();

	if (input[input.length - 1] === LF) {
		input = input.slice(0, input.length - 1);
	}

	if (input[input.length - 1] === CR) {
		input = input.slice(0, input.length - 1);
	}

	return input;
};

var npmRunPath_1 = createCommonjsModule(function (module) {



const npmRunPath = options => {
	options = {
		cwd: process.cwd(),
		path: process.env[pathKey_1()],
		execPath: process.execPath,
		...options
	};

	let previous;
	let cwdPath = path__default['default'].resolve(options.cwd);
	const result = [];

	while (previous !== cwdPath) {
		result.push(path__default['default'].join(cwdPath, 'node_modules/.bin'));
		previous = cwdPath;
		cwdPath = path__default['default'].resolve(cwdPath, '..');
	}

	// Ensure the running `node` binary is used
	const execPathDir = path__default['default'].resolve(options.cwd, options.execPath, '..');
	result.push(execPathDir);

	return result.concat(options.path).join(path__default['default'].delimiter);
};

module.exports = npmRunPath;
// TODO: Remove this for the next major release
module.exports.default = npmRunPath;

module.exports.env = options => {
	options = {
		env: process.env,
		...options
	};

	const env = {...options.env};
	const path = pathKey_1({env});

	options.path = env[path];
	env[path] = module.exports(options);

	return env;
};
});

const mimicFn = (to, from) => {
	for (const prop of Reflect.ownKeys(from)) {
		Object.defineProperty(to, prop, Object.getOwnPropertyDescriptor(from, prop));
	}

	return to;
};

var mimicFn_1 = mimicFn;
// TODO: Remove this for the next major release
var _default$1 = mimicFn;
mimicFn_1.default = _default$1;

const calledFunctions = new WeakMap();

const onetime = (function_, options = {}) => {
	if (typeof function_ !== 'function') {
		throw new TypeError('Expected a function');
	}

	let returnValue;
	let callCount = 0;
	const functionName = function_.displayName || function_.name || '<anonymous>';

	const onetime = function (...arguments_) {
		calledFunctions.set(onetime, ++callCount);

		if (callCount === 1) {
			returnValue = function_.apply(this, arguments_);
			function_ = null;
		} else if (options.throw === true) {
			throw new Error(`Function \`${functionName}\` can only be called once`);
		}

		return returnValue;
	};

	mimicFn_1(onetime, function_);
	calledFunctions.set(onetime, callCount);

	return onetime;
};

var onetime_1 = onetime;
// TODO: Remove this for the next major release
var _default = onetime;

var callCount = function_ => {
	if (!calledFunctions.has(function_)) {
		throw new Error(`The given function \`${function_.name}\` is not wrapped by the \`onetime\` package`);
	}

	return calledFunctions.get(function_);
};
onetime_1.default = _default;
onetime_1.callCount = callCount;

var core = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports,"__esModule",{value:true});exports.SIGNALS=void 0;

const SIGNALS=[
{
name:"SIGHUP",
number:1,
action:"terminate",
description:"Terminal closed",
standard:"posix"},

{
name:"SIGINT",
number:2,
action:"terminate",
description:"User interruption with CTRL-C",
standard:"ansi"},

{
name:"SIGQUIT",
number:3,
action:"core",
description:"User interruption with CTRL-\\",
standard:"posix"},

{
name:"SIGILL",
number:4,
action:"core",
description:"Invalid machine instruction",
standard:"ansi"},

{
name:"SIGTRAP",
number:5,
action:"core",
description:"Debugger breakpoint",
standard:"posix"},

{
name:"SIGABRT",
number:6,
action:"core",
description:"Aborted",
standard:"ansi"},

{
name:"SIGIOT",
number:6,
action:"core",
description:"Aborted",
standard:"bsd"},

{
name:"SIGBUS",
number:7,
action:"core",
description:
"Bus error due to misaligned, non-existing address or paging error",
standard:"bsd"},

{
name:"SIGEMT",
number:7,
action:"terminate",
description:"Command should be emulated but is not implemented",
standard:"other"},

{
name:"SIGFPE",
number:8,
action:"core",
description:"Floating point arithmetic error",
standard:"ansi"},

{
name:"SIGKILL",
number:9,
action:"terminate",
description:"Forced termination",
standard:"posix",
forced:true},

{
name:"SIGUSR1",
number:10,
action:"terminate",
description:"Application-specific signal",
standard:"posix"},

{
name:"SIGSEGV",
number:11,
action:"core",
description:"Segmentation fault",
standard:"ansi"},

{
name:"SIGUSR2",
number:12,
action:"terminate",
description:"Application-specific signal",
standard:"posix"},

{
name:"SIGPIPE",
number:13,
action:"terminate",
description:"Broken pipe or socket",
standard:"posix"},

{
name:"SIGALRM",
number:14,
action:"terminate",
description:"Timeout or timer",
standard:"posix"},

{
name:"SIGTERM",
number:15,
action:"terminate",
description:"Termination",
standard:"ansi"},

{
name:"SIGSTKFLT",
number:16,
action:"terminate",
description:"Stack is empty or overflowed",
standard:"other"},

{
name:"SIGCHLD",
number:17,
action:"ignore",
description:"Child process terminated, paused or unpaused",
standard:"posix"},

{
name:"SIGCLD",
number:17,
action:"ignore",
description:"Child process terminated, paused or unpaused",
standard:"other"},

{
name:"SIGCONT",
number:18,
action:"unpause",
description:"Unpaused",
standard:"posix",
forced:true},

{
name:"SIGSTOP",
number:19,
action:"pause",
description:"Paused",
standard:"posix",
forced:true},

{
name:"SIGTSTP",
number:20,
action:"pause",
description:"Paused using CTRL-Z or \"suspend\"",
standard:"posix"},

{
name:"SIGTTIN",
number:21,
action:"pause",
description:"Background process cannot read terminal input",
standard:"posix"},

{
name:"SIGBREAK",
number:21,
action:"terminate",
description:"User interruption with CTRL-BREAK",
standard:"other"},

{
name:"SIGTTOU",
number:22,
action:"pause",
description:"Background process cannot write to terminal output",
standard:"posix"},

{
name:"SIGURG",
number:23,
action:"ignore",
description:"Socket received out-of-band data",
standard:"bsd"},

{
name:"SIGXCPU",
number:24,
action:"core",
description:"Process timed out",
standard:"bsd"},

{
name:"SIGXFSZ",
number:25,
action:"core",
description:"File too big",
standard:"bsd"},

{
name:"SIGVTALRM",
number:26,
action:"terminate",
description:"Timeout or timer",
standard:"bsd"},

{
name:"SIGPROF",
number:27,
action:"terminate",
description:"Timeout or timer",
standard:"bsd"},

{
name:"SIGWINCH",
number:28,
action:"ignore",
description:"Terminal window size changed",
standard:"bsd"},

{
name:"SIGIO",
number:29,
action:"terminate",
description:"I/O is available",
standard:"other"},

{
name:"SIGPOLL",
number:29,
action:"terminate",
description:"Watched event",
standard:"other"},

{
name:"SIGINFO",
number:29,
action:"ignore",
description:"Request for process information",
standard:"other"},

{
name:"SIGPWR",
number:30,
action:"terminate",
description:"Device running out of power",
standard:"systemv"},

{
name:"SIGSYS",
number:31,
action:"core",
description:"Invalid system call",
standard:"other"},

{
name:"SIGUNUSED",
number:31,
action:"terminate",
description:"Invalid system call",
standard:"other"}];exports.SIGNALS=SIGNALS;
//# sourceMappingURL=core.js.map
});

var realtime = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports,"__esModule",{value:true});exports.SIGRTMAX=exports.getRealtimeSignals=void 0;
const getRealtimeSignals=function(){
const length=SIGRTMAX-SIGRTMIN+1;
return Array.from({length},getRealtimeSignal);
};exports.getRealtimeSignals=getRealtimeSignals;

const getRealtimeSignal=function(value,index){
return {
name:`SIGRT${index+1}`,
number:SIGRTMIN+index,
action:"terminate",
description:"Application-specific signal (realtime)",
standard:"posix"};

};

const SIGRTMIN=34;
const SIGRTMAX=64;exports.SIGRTMAX=SIGRTMAX;
//# sourceMappingURL=realtime.js.map
});

var signals$1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports,"__esModule",{value:true});exports.getSignals=void 0;






const getSignals=function(){
const realtimeSignals=(0, realtime.getRealtimeSignals)();
const signals=[...core.SIGNALS,...realtimeSignals].map(normalizeSignal);
return signals;
};exports.getSignals=getSignals;







const normalizeSignal=function({
name,
number:defaultNumber,
description,
action,
forced=false,
standard})
{
const{
signals:{[name]:constantSignal}}=
_os__default['default'].constants;
const supported=constantSignal!==undefined;
const number=supported?constantSignal:defaultNumber;
return {name,number,description,supported,action,forced,standard};
};
//# sourceMappingURL=signals.js.map
});

var main = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports,"__esModule",{value:true});exports.signalsByNumber=exports.signalsByName=void 0;






const getSignalsByName=function(){
const signals=(0, signals$1.getSignals)();
return signals.reduce(getSignalByName,{});
};

const getSignalByName=function(
signalByNameMemo,
{name,number,description,supported,action,forced,standard})
{
return {
...signalByNameMemo,
[name]:{name,number,description,supported,action,forced,standard}};

};

const signalsByName=getSignalsByName();exports.signalsByName=signalsByName;




const getSignalsByNumber=function(){
const signals=(0, signals$1.getSignals)();
const length=realtime.SIGRTMAX+1;
const signalsA=Array.from({length},(value,number)=>
getSignalByNumber(number,signals));

return Object.assign({},...signalsA);
};

const getSignalByNumber=function(number,signals){
const signal=findSignalByNumber(number,signals);

if(signal===undefined){
return {};
}

const{name,description,supported,action,forced,standard}=signal;
return {
[number]:{
name,
number,
description,
supported,
action,
forced,
standard}};


};



const findSignalByNumber=function(number,signals){
const signal=signals.find(({name})=>_os__default['default'].constants.signals[name]===number);

if(signal!==undefined){
return signal;
}

return signals.find(signalA=>signalA.number===number);
};

const signalsByNumber=getSignalsByNumber();exports.signalsByNumber=signalsByNumber;
//# sourceMappingURL=main.js.map
});

const {signalsByName} = main;

const getErrorPrefix = ({timedOut, timeout, errorCode, signal, signalDescription, exitCode, isCanceled}) => {
	if (timedOut) {
		return `timed out after ${timeout} milliseconds`;
	}

	if (isCanceled) {
		return 'was canceled';
	}

	if (errorCode !== undefined) {
		return `failed with ${errorCode}`;
	}

	if (signal !== undefined) {
		return `was killed with ${signal} (${signalDescription})`;
	}

	if (exitCode !== undefined) {
		return `failed with exit code ${exitCode}`;
	}

	return 'failed';
};

const makeError = ({
	stdout,
	stderr,
	all,
	error,
	signal,
	exitCode,
	command,
	escapedCommand,
	timedOut,
	isCanceled,
	killed,
	parsed: {options: {timeout}}
}) => {
	// `signal` and `exitCode` emitted on `spawned.on('exit')` event can be `null`.
	// We normalize them to `undefined`
	exitCode = exitCode === null ? undefined : exitCode;
	signal = signal === null ? undefined : signal;
	const signalDescription = signal === undefined ? undefined : signalsByName[signal].description;

	const errorCode = error && error.code;

	const prefix = getErrorPrefix({timedOut, timeout, errorCode, signal, signalDescription, exitCode, isCanceled});
	const execaMessage = `Command ${prefix}: ${command}`;
	const isError = Object.prototype.toString.call(error) === '[object Error]';
	const shortMessage = isError ? `${execaMessage}\n${error.message}` : execaMessage;
	const message = [shortMessage, stderr, stdout].filter(Boolean).join('\n');

	if (isError) {
		error.originalMessage = error.message;
		error.message = message;
	} else {
		error = new Error(message);
	}

	error.shortMessage = shortMessage;
	error.command = command;
	error.escapedCommand = escapedCommand;
	error.exitCode = exitCode;
	error.signal = signal;
	error.signalDescription = signalDescription;
	error.stdout = stdout;
	error.stderr = stderr;

	if (all !== undefined) {
		error.all = all;
	}

	if ('bufferedData' in error) {
		delete error.bufferedData;
	}

	error.failed = true;
	error.timedOut = Boolean(timedOut);
	error.isCanceled = isCanceled;
	error.killed = killed && !timedOut;

	return error;
};

var error = makeError;

const aliases = ['stdin', 'stdout', 'stderr'];

const hasAlias = options => aliases.some(alias => options[alias] !== undefined);

const normalizeStdio = options => {
	if (!options) {
		return;
	}

	const {stdio} = options;

	if (stdio === undefined) {
		return aliases.map(alias => options[alias]);
	}

	if (hasAlias(options)) {
		throw new Error(`It's not possible to provide \`stdio\` in combination with one of ${aliases.map(alias => `\`${alias}\``).join(', ')}`);
	}

	if (typeof stdio === 'string') {
		return stdio;
	}

	if (!Array.isArray(stdio)) {
		throw new TypeError(`Expected \`stdio\` to be of type \`string\` or \`Array\`, got \`${typeof stdio}\``);
	}

	const length = Math.max(stdio.length, aliases.length);
	return Array.from({length}, (value, index) => stdio[index]);
};

var stdio = normalizeStdio;

// `ipc` is pushed unless it is already present
var node$1 = options => {
	const stdio = normalizeStdio(options);

	if (stdio === 'ipc') {
		return 'ipc';
	}

	if (stdio === undefined || typeof stdio === 'string') {
		return [stdio, stdio, stdio, 'ipc'];
	}

	if (stdio.includes('ipc')) {
		return stdio;
	}

	return [...stdio, 'ipc'];
};
stdio.node = node$1;

var signals = createCommonjsModule(function (module) {
// This is not the set of all possible signals.
//
// It IS, however, the set of all signals that trigger
// an exit on either Linux or BSD systems.  Linux is a
// superset of the signal names supported on BSD, and
// the unknown signals just fail to register, so we can
// catch that easily enough.
//
// Don't bother with SIGKILL.  It's uncatchable, which
// means that we can't fire any callbacks anyway.
//
// If a user does happen to register a handler on a non-
// fatal signal like SIGWINCH or something, and then
// exit, it'll end up firing `process.emit('exit')`, so
// the handler will be fired anyway.
//
// SIGBUS, SIGFPE, SIGSEGV and SIGILL, when not raised
// artificially, inherently leave the process in a
// state from which it is not safe to try and enter JS
// listeners.
module.exports = [
  'SIGABRT',
  'SIGALRM',
  'SIGHUP',
  'SIGINT',
  'SIGTERM'
];

if (process.platform !== 'win32') {
  module.exports.push(
    'SIGVTALRM',
    'SIGXCPU',
    'SIGXFSZ',
    'SIGUSR2',
    'SIGTRAP',
    'SIGSYS',
    'SIGQUIT',
    'SIGIOT'
    // should detect profiler and enable/disable accordingly.
    // see #21
    // 'SIGPROF'
  );
}

if (process.platform === 'linux') {
  module.exports.push(
    'SIGIO',
    'SIGPOLL',
    'SIGPWR',
    'SIGSTKFLT',
    'SIGUNUSED'
  );
}
});

var signalExit = createCommonjsModule(function (module) {
// Note: since nyc uses this module to output coverage, any lines
// that are in the direct sync flow of nyc's outputCoverage are
// ignored, since we can never get coverage for them.
// grab a reference to node's real process object right away
var process = commonjsGlobal.process;

const processOk = function (process) {
  return process &&
    typeof process === 'object' &&
    typeof process.removeListener === 'function' &&
    typeof process.emit === 'function' &&
    typeof process.reallyExit === 'function' &&
    typeof process.listeners === 'function' &&
    typeof process.kill === 'function' &&
    typeof process.pid === 'number' &&
    typeof process.on === 'function'
};

// some kind of non-node environment, just no-op
/* istanbul ignore if */
if (!processOk(process)) {
  module.exports = function () {
    return function () {}
  };
} else {
  var assert = require$$0__default['default'];
  var signals$1 = signals;
  var isWin = /^win/i.test(process.platform);

  var EE = require$$2__default['default'];
  /* istanbul ignore if */
  if (typeof EE !== 'function') {
    EE = EE.EventEmitter;
  }

  var emitter;
  if (process.__signal_exit_emitter__) {
    emitter = process.__signal_exit_emitter__;
  } else {
    emitter = process.__signal_exit_emitter__ = new EE();
    emitter.count = 0;
    emitter.emitted = {};
  }

  // Because this emitter is a global, we have to check to see if a
  // previous version of this library failed to enable infinite listeners.
  // I know what you're about to say.  But literally everything about
  // signal-exit is a compromise with evil.  Get used to it.
  if (!emitter.infinite) {
    emitter.setMaxListeners(Infinity);
    emitter.infinite = true;
  }

  module.exports = function (cb, opts) {
    /* istanbul ignore if */
    if (!processOk(commonjsGlobal.process)) {
      return function () {}
    }
    assert.equal(typeof cb, 'function', 'a callback must be provided for exit handler');

    if (loaded === false) {
      load();
    }

    var ev = 'exit';
    if (opts && opts.alwaysLast) {
      ev = 'afterexit';
    }

    var remove = function () {
      emitter.removeListener(ev, cb);
      if (emitter.listeners('exit').length === 0 &&
          emitter.listeners('afterexit').length === 0) {
        unload();
      }
    };
    emitter.on(ev, cb);

    return remove
  };

  var unload = function unload () {
    if (!loaded || !processOk(commonjsGlobal.process)) {
      return
    }
    loaded = false;

    signals$1.forEach(function (sig) {
      try {
        process.removeListener(sig, sigListeners[sig]);
      } catch (er) {}
    });
    process.emit = originalProcessEmit;
    process.reallyExit = originalProcessReallyExit;
    emitter.count -= 1;
  };
  module.exports.unload = unload;

  var emit = function emit (event, code, signal) {
    /* istanbul ignore if */
    if (emitter.emitted[event]) {
      return
    }
    emitter.emitted[event] = true;
    emitter.emit(event, code, signal);
  };

  // { <signal>: <listener fn>, ... }
  var sigListeners = {};
  signals$1.forEach(function (sig) {
    sigListeners[sig] = function listener () {
      /* istanbul ignore if */
      if (!processOk(commonjsGlobal.process)) {
        return
      }
      // If there are no other listeners, an exit is coming!
      // Simplest way: remove us and then re-send the signal.
      // We know that this will kill the process, so we can
      // safely emit now.
      var listeners = process.listeners(sig);
      if (listeners.length === emitter.count) {
        unload();
        emit('exit', null, sig);
        /* istanbul ignore next */
        emit('afterexit', null, sig);
        /* istanbul ignore next */
        if (isWin && sig === 'SIGHUP') {
          // "SIGHUP" throws an `ENOSYS` error on Windows,
          // so use a supported signal instead
          sig = 'SIGINT';
        }
        /* istanbul ignore next */
        process.kill(process.pid, sig);
      }
    };
  });

  module.exports.signals = function () {
    return signals$1
  };

  var loaded = false;

  var load = function load () {
    if (loaded || !processOk(commonjsGlobal.process)) {
      return
    }
    loaded = true;

    // This is the number of onSignalExit's that are in play.
    // It's important so that we can count the correct number of
    // listeners on signals, and don't wait for the other one to
    // handle it instead of us.
    emitter.count += 1;

    signals$1 = signals$1.filter(function (sig) {
      try {
        process.on(sig, sigListeners[sig]);
        return true
      } catch (er) {
        return false
      }
    });

    process.emit = processEmit;
    process.reallyExit = processReallyExit;
  };
  module.exports.load = load;

  var originalProcessReallyExit = process.reallyExit;
  var processReallyExit = function processReallyExit (code) {
    /* istanbul ignore if */
    if (!processOk(commonjsGlobal.process)) {
      return
    }
    process.exitCode = code || /* istanbul ignore next */ 0;
    emit('exit', process.exitCode, null);
    /* istanbul ignore next */
    emit('afterexit', process.exitCode, null);
    /* istanbul ignore next */
    originalProcessReallyExit.call(process, process.exitCode);
  };

  var originalProcessEmit = process.emit;
  var processEmit = function processEmit (ev, arg) {
    if (ev === 'exit' && processOk(commonjsGlobal.process)) {
      /* istanbul ignore else */
      if (arg !== undefined) {
        process.exitCode = arg;
      }
      var ret = originalProcessEmit.apply(this, arguments);
      /* istanbul ignore next */
      emit('exit', process.exitCode, null);
      /* istanbul ignore next */
      emit('afterexit', process.exitCode, null);
      /* istanbul ignore next */
      return ret
    } else {
      return originalProcessEmit.apply(this, arguments)
    }
  };
}
});

const DEFAULT_FORCE_KILL_TIMEOUT = 1000 * 5;

// Monkey-patches `childProcess.kill()` to add `forceKillAfterTimeout` behavior
const spawnedKill$1 = (kill, signal = 'SIGTERM', options = {}) => {
	const killResult = kill(signal);
	setKillTimeout(kill, signal, options, killResult);
	return killResult;
};

const setKillTimeout = (kill, signal, options, killResult) => {
	if (!shouldForceKill(signal, options, killResult)) {
		return;
	}

	const timeout = getForceKillAfterTimeout(options);
	const t = setTimeout(() => {
		kill('SIGKILL');
	}, timeout);

	// Guarded because there's no `.unref()` when `execa` is used in the renderer
	// process in Electron. This cannot be tested since we don't run tests in
	// Electron.
	// istanbul ignore else
	if (t.unref) {
		t.unref();
	}
};

const shouldForceKill = (signal, {forceKillAfterTimeout}, killResult) => {
	return isSigterm(signal) && forceKillAfterTimeout !== false && killResult;
};

const isSigterm = signal => {
	return signal === _os__default['default'].constants.signals.SIGTERM ||
		(typeof signal === 'string' && signal.toUpperCase() === 'SIGTERM');
};

const getForceKillAfterTimeout = ({forceKillAfterTimeout = true}) => {
	if (forceKillAfterTimeout === true) {
		return DEFAULT_FORCE_KILL_TIMEOUT;
	}

	if (!Number.isFinite(forceKillAfterTimeout) || forceKillAfterTimeout < 0) {
		throw new TypeError(`Expected the \`forceKillAfterTimeout\` option to be a non-negative integer, got \`${forceKillAfterTimeout}\` (${typeof forceKillAfterTimeout})`);
	}

	return forceKillAfterTimeout;
};

// `childProcess.cancel()`
const spawnedCancel$1 = (spawned, context) => {
	const killResult = spawned.kill();

	if (killResult) {
		context.isCanceled = true;
	}
};

const timeoutKill = (spawned, signal, reject) => {
	spawned.kill(signal);
	reject(Object.assign(new Error('Timed out'), {timedOut: true, signal}));
};

// `timeout` option handling
const setupTimeout$1 = (spawned, {timeout, killSignal = 'SIGTERM'}, spawnedPromise) => {
	if (timeout === 0 || timeout === undefined) {
		return spawnedPromise;
	}

	let timeoutId;
	const timeoutPromise = new Promise((resolve, reject) => {
		timeoutId = setTimeout(() => {
			timeoutKill(spawned, killSignal, reject);
		}, timeout);
	});

	const safeSpawnedPromise = spawnedPromise.finally(() => {
		clearTimeout(timeoutId);
	});

	return Promise.race([timeoutPromise, safeSpawnedPromise]);
};

const validateTimeout$1 = ({timeout}) => {
	if (timeout !== undefined && (!Number.isFinite(timeout) || timeout < 0)) {
		throw new TypeError(`Expected the \`timeout\` option to be a non-negative integer, got \`${timeout}\` (${typeof timeout})`);
	}
};

// `cleanup` option handling
const setExitHandler$1 = async (spawned, {cleanup, detached}, timedPromise) => {
	if (!cleanup || detached) {
		return timedPromise;
	}

	const removeExitHandler = signalExit(() => {
		spawned.kill();
	});

	return timedPromise.finally(() => {
		removeExitHandler();
	});
};

var kill = {
	spawnedKill: spawnedKill$1,
	spawnedCancel: spawnedCancel$1,
	setupTimeout: setupTimeout$1,
	validateTimeout: validateTimeout$1,
	setExitHandler: setExitHandler$1
};

const isStream = stream =>
	stream !== null &&
	typeof stream === 'object' &&
	typeof stream.pipe === 'function';

isStream.writable = stream =>
	isStream(stream) &&
	stream.writable !== false &&
	typeof stream._write === 'function' &&
	typeof stream._writableState === 'object';

isStream.readable = stream =>
	isStream(stream) &&
	stream.readable !== false &&
	typeof stream._read === 'function' &&
	typeof stream._readableState === 'object';

isStream.duplex = stream =>
	isStream.writable(stream) &&
	isStream.readable(stream);

isStream.transform = stream =>
	isStream.duplex(stream) &&
	typeof stream._transform === 'function';

var isStream_1 = isStream;

const {PassThrough: PassThroughStream} = require$$0__default$1['default'];

var bufferStream = options => {
	options = {...options};

	const {array} = options;
	let {encoding} = options;
	const isBuffer = encoding === 'buffer';
	let objectMode = false;

	if (array) {
		objectMode = !(encoding || isBuffer);
	} else {
		encoding = encoding || 'utf8';
	}

	if (isBuffer) {
		encoding = null;
	}

	const stream = new PassThroughStream({objectMode});

	if (encoding) {
		stream.setEncoding(encoding);
	}

	let length = 0;
	const chunks = [];

	stream.on('data', chunk => {
		chunks.push(chunk);

		if (objectMode) {
			length = chunks.length;
		} else {
			length += chunk.length;
		}
	});

	stream.getBufferedValue = () => {
		if (array) {
			return chunks;
		}

		return isBuffer ? Buffer.concat(chunks, length) : chunks.join('');
	};

	stream.getBufferedLength = () => length;

	return stream;
};

const {constants: BufferConstants} = require$$0__default$2['default'];

const {promisify} = require$$1__default['default'];


const streamPipelinePromisified = promisify(require$$0__default$1['default'].pipeline);

class MaxBufferError extends Error {
	constructor() {
		super('maxBuffer exceeded');
		this.name = 'MaxBufferError';
	}
}

async function getStream(inputStream, options) {
	if (!inputStream) {
		throw new Error('Expected a stream');
	}

	options = {
		maxBuffer: Infinity,
		...options
	};

	const {maxBuffer} = options;
	const stream = bufferStream(options);

	await new Promise((resolve, reject) => {
		const rejectPromise = error => {
			// Don't retrieve an oversized buffer.
			if (error && stream.getBufferedLength() <= BufferConstants.MAX_LENGTH) {
				error.bufferedData = stream.getBufferedValue();
			}

			reject(error);
		};

		(async () => {
			try {
				await streamPipelinePromisified(inputStream, stream);
				resolve();
			} catch (error) {
				rejectPromise(error);
			}
		})();

		stream.on('data', () => {
			if (stream.getBufferedLength() > maxBuffer) {
				rejectPromise(new MaxBufferError());
			}
		});
	});

	return stream.getBufferedValue();
}

var getStream_1 = getStream;
var buffer = (stream, options) => getStream(stream, {...options, encoding: 'buffer'});
var array = (stream, options) => getStream(stream, {...options, array: true});
var MaxBufferError_1 = MaxBufferError;
getStream_1.buffer = buffer;
getStream_1.array = array;
getStream_1.MaxBufferError = MaxBufferError_1;

const { PassThrough } = require$$0__default$1['default'];

var mergeStream = function (/*streams...*/) {
  var sources = [];
  var output  = new PassThrough({objectMode: true});

  output.setMaxListeners(0);

  output.add = add;
  output.isEmpty = isEmpty;

  output.on('unpipe', remove);

  Array.prototype.slice.call(arguments).forEach(add);

  return output

  function add (source) {
    if (Array.isArray(source)) {
      source.forEach(add);
      return this
    }

    sources.push(source);
    source.once('end', remove.bind(null, source));
    source.once('error', output.emit.bind(output, 'error'));
    source.pipe(output, {end: false});
    return this
  }

  function isEmpty () {
    return sources.length == 0;
  }

  function remove (source) {
    sources = sources.filter(function (it) { return it !== source });
    if (!sources.length && output.readable) { output.end(); }
  }
};

// `input` option
const handleInput$1 = (spawned, input) => {
	// Checking for stdin is workaround for https://github.com/nodejs/node/issues/26852
	// @todo remove `|| spawned.stdin === undefined` once we drop support for Node.js <=12.2.0
	if (input === undefined || spawned.stdin === undefined) {
		return;
	}

	if (isStream_1(input)) {
		input.pipe(spawned.stdin);
	} else {
		spawned.stdin.end(input);
	}
};

// `all` interleaves `stdout` and `stderr`
const makeAllStream$1 = (spawned, {all}) => {
	if (!all || (!spawned.stdout && !spawned.stderr)) {
		return;
	}

	const mixed = mergeStream();

	if (spawned.stdout) {
		mixed.add(spawned.stdout);
	}

	if (spawned.stderr) {
		mixed.add(spawned.stderr);
	}

	return mixed;
};

// On failure, `result.stdout|stderr|all` should contain the currently buffered stream
const getBufferedData = async (stream, streamPromise) => {
	if (!stream) {
		return;
	}

	stream.destroy();

	try {
		return await streamPromise;
	} catch (error) {
		return error.bufferedData;
	}
};

const getStreamPromise = (stream, {encoding, buffer, maxBuffer}) => {
	if (!stream || !buffer) {
		return;
	}

	if (encoding) {
		return getStream_1(stream, {encoding, maxBuffer});
	}

	return getStream_1.buffer(stream, {maxBuffer});
};

// Retrieve result of child process: exit code, signal, error, streams (stdout/stderr/all)
const getSpawnedResult$1 = async ({stdout, stderr, all}, {encoding, buffer, maxBuffer}, processDone) => {
	const stdoutPromise = getStreamPromise(stdout, {encoding, buffer, maxBuffer});
	const stderrPromise = getStreamPromise(stderr, {encoding, buffer, maxBuffer});
	const allPromise = getStreamPromise(all, {encoding, buffer, maxBuffer: maxBuffer * 2});

	try {
		return await Promise.all([processDone, stdoutPromise, stderrPromise, allPromise]);
	} catch (error) {
		return Promise.all([
			{error, signal: error.signal, timedOut: error.timedOut},
			getBufferedData(stdout, stdoutPromise),
			getBufferedData(stderr, stderrPromise),
			getBufferedData(all, allPromise)
		]);
	}
};

const validateInputSync$1 = ({input}) => {
	if (isStream_1(input)) {
		throw new TypeError('The `input` option cannot be a stream in sync mode');
	}
};

var stream = {
	handleInput: handleInput$1,
	makeAllStream: makeAllStream$1,
	getSpawnedResult: getSpawnedResult$1,
	validateInputSync: validateInputSync$1
};

const nativePromisePrototype = (async () => {})().constructor.prototype;
const descriptors = ['then', 'catch', 'finally'].map(property => [
	property,
	Reflect.getOwnPropertyDescriptor(nativePromisePrototype, property)
]);

// The return value is a mixin of `childProcess` and `Promise`
const mergePromise$1 = (spawned, promise) => {
	for (const [property, descriptor] of descriptors) {
		// Starting the main `promise` is deferred to avoid consuming streams
		const value = typeof promise === 'function' ?
			(...args) => Reflect.apply(descriptor.value, promise(), args) :
			descriptor.value.bind(promise);

		Reflect.defineProperty(spawned, property, {...descriptor, value});
	}

	return spawned;
};

// Use promises instead of `child_process` events
const getSpawnedPromise$1 = spawned => {
	return new Promise((resolve, reject) => {
		spawned.on('exit', (exitCode, signal) => {
			resolve({exitCode, signal});
		});

		spawned.on('error', error => {
			reject(error);
		});

		if (spawned.stdin) {
			spawned.stdin.on('error', error => {
				reject(error);
			});
		}
	});
};

var promise = {
	mergePromise: mergePromise$1,
	getSpawnedPromise: getSpawnedPromise$1
};

const normalizeArgs = (file, args = []) => {
	if (!Array.isArray(args)) {
		return [file];
	}

	return [file, ...args];
};

const NO_ESCAPE_REGEXP = /^[\w.-]+$/;
const DOUBLE_QUOTES_REGEXP = /"/g;

const escapeArg = arg => {
	if (typeof arg !== 'string' || NO_ESCAPE_REGEXP.test(arg)) {
		return arg;
	}

	return `"${arg.replace(DOUBLE_QUOTES_REGEXP, '\\"')}"`;
};

const joinCommand$1 = (file, args) => {
	return normalizeArgs(file, args).join(' ');
};

const getEscapedCommand$1 = (file, args) => {
	return normalizeArgs(file, args).map(arg => escapeArg(arg)).join(' ');
};

const SPACES_REGEXP = / +/g;

// Handle `execa.command()`
const parseCommand$1 = command => {
	const tokens = [];
	for (const token of command.trim().split(SPACES_REGEXP)) {
		// Allow spaces to be escaped by a backslash if not meant as a delimiter
		const previousToken = tokens[tokens.length - 1];
		if (previousToken && previousToken.endsWith('\\')) {
			// Merge previous token with current one
			tokens[tokens.length - 1] = `${previousToken.slice(0, -1)} ${token}`;
		} else {
			tokens.push(token);
		}
	}

	return tokens;
};

var command$1 = {
	joinCommand: joinCommand$1,
	getEscapedCommand: getEscapedCommand$1,
	parseCommand: parseCommand$1
};

const {spawnedKill, spawnedCancel, setupTimeout, validateTimeout, setExitHandler} = kill;
const {handleInput, getSpawnedResult, makeAllStream, validateInputSync} = stream;
const {mergePromise, getSpawnedPromise} = promise;
const {joinCommand, parseCommand, getEscapedCommand} = command$1;

const DEFAULT_MAX_BUFFER = 1000 * 1000 * 100;

const getEnv = ({env: envOption, extendEnv, preferLocal, localDir, execPath}) => {
	const env = extendEnv ? {...process.env, ...envOption} : envOption;

	if (preferLocal) {
		return npmRunPath_1.env({env, cwd: localDir, execPath});
	}

	return env;
};

const handleArguments = (file, args, options = {}) => {
	const parsed = crossSpawn._parse(file, args, options);
	file = parsed.command;
	args = parsed.args;
	options = parsed.options;

	options = {
		maxBuffer: DEFAULT_MAX_BUFFER,
		buffer: true,
		stripFinalNewline: true,
		extendEnv: true,
		preferLocal: false,
		localDir: options.cwd || process.cwd(),
		execPath: process.execPath,
		encoding: 'utf8',
		reject: true,
		cleanup: true,
		all: false,
		windowsHide: true,
		...options
	};

	options.env = getEnv(options);

	options.stdio = stdio(options);

	if (process.platform === 'win32' && path__default['default'].basename(file, '.exe') === 'cmd') {
		// #116
		args.unshift('/q');
	}

	return {file, args, options, parsed};
};

const handleOutput = (options, value, error) => {
	if (typeof value !== 'string' && !Buffer.isBuffer(value)) {
		// When `execa.sync()` errors, we normalize it to '' to mimic `execa()`
		return error === undefined ? undefined : '';
	}

	if (options.stripFinalNewline) {
		return stripFinalNewline(value);
	}

	return value;
};

const execa = (file, args, options) => {
	const parsed = handleArguments(file, args, options);
	const command = joinCommand(file, args);
	const escapedCommand = getEscapedCommand(file, args);

	validateTimeout(parsed.options);

	let spawned;
	try {
		spawned = childProcess__default['default'].spawn(parsed.file, parsed.args, parsed.options);
	} catch (error$1) {
		// Ensure the returned error is always both a promise and a child process
		const dummySpawned = new childProcess__default['default'].ChildProcess();
		const errorPromise = Promise.reject(error({
			error: error$1,
			stdout: '',
			stderr: '',
			all: '',
			command,
			escapedCommand,
			parsed,
			timedOut: false,
			isCanceled: false,
			killed: false
		}));
		return mergePromise(dummySpawned, errorPromise);
	}

	const spawnedPromise = getSpawnedPromise(spawned);
	const timedPromise = setupTimeout(spawned, parsed.options, spawnedPromise);
	const processDone = setExitHandler(spawned, parsed.options, timedPromise);

	const context = {isCanceled: false};

	spawned.kill = spawnedKill.bind(null, spawned.kill.bind(spawned));
	spawned.cancel = spawnedCancel.bind(null, spawned, context);

	const handlePromise = async () => {
		const [{error: error$1, exitCode, signal, timedOut}, stdoutResult, stderrResult, allResult] = await getSpawnedResult(spawned, parsed.options, processDone);
		const stdout = handleOutput(parsed.options, stdoutResult);
		const stderr = handleOutput(parsed.options, stderrResult);
		const all = handleOutput(parsed.options, allResult);

		if (error$1 || exitCode !== 0 || signal !== null) {
			const returnedError = error({
				error: error$1,
				exitCode,
				signal,
				stdout,
				stderr,
				all,
				command,
				escapedCommand,
				parsed,
				timedOut,
				isCanceled: context.isCanceled,
				killed: spawned.killed
			});

			if (!parsed.options.reject) {
				return returnedError;
			}

			throw returnedError;
		}

		return {
			command,
			escapedCommand,
			exitCode: 0,
			stdout,
			stderr,
			all,
			failed: false,
			timedOut: false,
			isCanceled: false,
			killed: false
		};
	};

	const handlePromiseOnce = onetime_1(handlePromise);

	handleInput(spawned, parsed.options.input);

	spawned.all = makeAllStream(spawned, parsed.options);

	return mergePromise(spawned, handlePromiseOnce);
};

var execa_1 = execa;

var sync = (file, args, options) => {
	const parsed = handleArguments(file, args, options);
	const command = joinCommand(file, args);
	const escapedCommand = getEscapedCommand(file, args);

	validateInputSync(parsed.options);

	let result;
	try {
		result = childProcess__default['default'].spawnSync(parsed.file, parsed.args, parsed.options);
	} catch (error$1) {
		throw error({
			error: error$1,
			stdout: '',
			stderr: '',
			all: '',
			command,
			escapedCommand,
			parsed,
			timedOut: false,
			isCanceled: false,
			killed: false
		});
	}

	const stdout = handleOutput(parsed.options, result.stdout, result.error);
	const stderr = handleOutput(parsed.options, result.stderr, result.error);

	if (result.error || result.status !== 0 || result.signal !== null) {
		const error$1 = error({
			stdout,
			stderr,
			error: result.error,
			signal: result.signal,
			exitCode: result.status,
			command,
			escapedCommand,
			parsed,
			timedOut: result.error && result.error.code === 'ETIMEDOUT',
			isCanceled: false,
			killed: result.signal !== null
		});

		if (!parsed.options.reject) {
			return error$1;
		}

		throw error$1;
	}

	return {
		command,
		escapedCommand,
		exitCode: 0,
		stdout,
		stderr,
		failed: false,
		timedOut: false,
		isCanceled: false,
		killed: false
	};
};

var command = (command, options) => {
	const [file, ...args] = parseCommand(command);
	return execa(file, args, options);
};

var commandSync = (command, options) => {
	const [file, ...args] = parseCommand(command);
	return execa.sync(file, args, options);
};

var node = (scriptPath, args, options = {}) => {
	if (args && !Array.isArray(args) && typeof args === 'object') {
		options = args;
		args = [];
	}

	const stdio$1 = stdio.node(options);
	const defaultExecArgv = process.execArgv.filter(arg => !arg.startsWith('--inspect'));

	const {
		nodePath = process.execPath,
		nodeOptions = defaultExecArgv
	} = options;

	return execa(
		nodePath,
		[
			...nodeOptions,
			scriptPath,
			...(Array.isArray(args) ? args : [])
		],
		{
			...options,
			stdin: undefined,
			stdout: undefined,
			stderr: undefined,
			stdio: stdio$1,
			shell: false
		}
	);
};
execa_1.sync = sync;
execa_1.command = command;
execa_1.commandSync = commandSync;
execa_1.node = node;

function ansiRegex({onlyFirst = false} = {}) {
	const pattern = [
	    '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
		'(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))'
	].join('|');

	return new RegExp(pattern, onlyFirst ? undefined : 'g');
}

function stripAnsi(string) {
	if (typeof string !== 'string') {
		throw new TypeError(`Expected a \`string\`, got \`${typeof string}\``);
	}

	return string.replace(ansiRegex(), '');
}

const detectDefaultShell = () => {
	const {env} = process__default['default'];

	if (process__default['default'].platform === 'win32') {
		return env.COMSPEC || 'cmd.exe';
	}

	try {
		const {shell} = node_os.userInfo();
		if (shell) {
			return shell;
		}
	} catch {}

	if (process__default['default'].platform === 'darwin') {
		return env.SHELL || '/bin/zsh';
	}

	return env.SHELL || '/bin/sh';
};

// Stores default shell when imported.
const defaultShell = detectDefaultShell();

const args = [
	'-ilc',
	'echo -n "_SHELL_ENV_DELIMITER_"; env; echo -n "_SHELL_ENV_DELIMITER_"; exit',
];

const env = {
	// Disables Oh My Zsh auto-update thing that can block the process.
	DISABLE_AUTO_UPDATE: 'true',
};

const parseEnv = env => {
	env = env.split('_SHELL_ENV_DELIMITER_')[1];
	const returnValue = {};

	for (const line of stripAnsi(env).split('\n').filter(line => Boolean(line))) {
		const [key, ...values] = line.split('=');
		returnValue[key] = values.join('=');
	}

	return returnValue;
};

function shellEnvSync(shell) {
	if (process__default['default'].platform === 'win32') {
		return process__default['default'].env;
	}

	try {
		const {stdout} = execa_1.sync(shell || defaultShell, args, {env});
		return parseEnv(stdout);
	} catch (error) {
		if (shell) {
			throw error;
		} else {
			return process__default['default'].env;
		}
	}
}

function shellPathSync() {
	const {PATH} = shellEnvSync();
	return PATH;
}

function fixPath() {
	if (process__default['default'].platform === 'win32') {
		return;
	}

	process__default['default'].env.PATH = shellPathSync() || [
		'./node_modules/.bin',
		'/.nodebrew/current/bin',
		'/usr/local/bin',
		process__default['default'].env.PATH,
	].join(':');
}

var IMAGE_EXT_LIST = [
    ".png",
    ".jpg",
    ".jpeg",
    ".bmp",
    ".gif",
    ".svg",
    ".tiff",
    ".webp",
    ".avif",
];
function isAnImage(ext) {
    return IMAGE_EXT_LIST.includes(ext.toLowerCase());
}
function isAssetTypeAnImage(path$1) {
    return isAnImage(path.extname(path$1));
}
function getOS() {
    var appVersion = navigator.appVersion;
    if (appVersion.indexOf("Win") !== -1) {
        return "Windows";
    }
    else if (appVersion.indexOf("Mac") !== -1) {
        return "MacOS";
    }
    else if (appVersion.indexOf("X11") !== -1) {
        return "Linux";
    }
    else {
        return "Unknown OS";
    }
}
function streamToString(stream) {
    var stream_1, stream_1_1;
    var e_1, _a;
    return __awaiter(this, void 0, void 0, function () {
        var chunks, chunk, e_1_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    chunks = [];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 6, 7, 12]);
                    stream_1 = __asyncValues(stream);
                    _b.label = 2;
                case 2: return [4 /*yield*/, stream_1.next()];
                case 3:
                    if (!(stream_1_1 = _b.sent(), !stream_1_1.done)) return [3 /*break*/, 5];
                    chunk = stream_1_1.value;
                    chunks.push(Buffer.from(chunk));
                    _b.label = 4;
                case 4: return [3 /*break*/, 2];
                case 5: return [3 /*break*/, 12];
                case 6:
                    e_1_1 = _b.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 12];
                case 7:
                    _b.trys.push([7, , 10, 11]);
                    if (!(stream_1_1 && !stream_1_1.done && (_a = stream_1.return))) return [3 /*break*/, 9];
                    return [4 /*yield*/, _a.call(stream_1)];
                case 8:
                    _b.sent();
                    _b.label = 9;
                case 9: return [3 /*break*/, 11];
                case 10:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 11: return [7 /*endfinally*/];
                case 12: return [2 /*return*/, Buffer.concat(chunks).toString("utf-8")];
            }
        });
    });
}
function getUrlAsset(url) {
    return (url = url.substr(1 + url.lastIndexOf("/")).split("?")[0]).split("#")[0];
}
function getLastImage(list) {
    var reversedList = list.reverse();
    var lastImage;
    reversedList.forEach(function (item) {
        if (item && item.startsWith("http")) {
            lastImage = item;
            return item;
        }
    });
    return lastImage;
}
function arrayToObject(arr, key) {
    var obj = {};
    arr.forEach(function (element) {
        obj[element[key]] = element;
    });
    return obj;
}

var PicGoUploader = /** @class */ (function () {
    function PicGoUploader(settings) {
        this.settings = settings;
    }
    PicGoUploader.prototype.uploadFiles = function (fileList) {
        return __awaiter(this, void 0, void 0, function () {
            var response, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, obsidian.requestUrl({
                            url: this.settings.uploadServer,
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ list: fileList }),
                        })];
                    case 1:
                        response = _a.sent();
                        data = response.json;
                        return [2 /*return*/, data];
                }
            });
        });
    };
    PicGoUploader.prototype.uploadFileByClipboard = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, obsidian.requestUrl({
                            url: this.settings.uploadServer,
                            method: "POST",
                        })];
                    case 1:
                        res = _a.sent();
                        data = res.json;
                        if (res.status !== 200) {
                            ({ response: data, body: data.msg });
                            return [2 /*return*/, {
                                    code: -1,
                                    msg: data.msg,
                                    data: "",
                                }];
                        }
                        else {
                            return [2 /*return*/, {
                                    code: 0,
                                    msg: "success",
                                    data: typeof data.result == "string" ? data.result : data.result[0],
                                }];
                        }
                }
            });
        });
    };
    return PicGoUploader;
}());
var PicGoCoreUploader = /** @class */ (function () {
    function PicGoCoreUploader(settings) {
        this.settings = settings;
    }
    PicGoCoreUploader.prototype.uploadFiles = function (fileList) {
        return __awaiter(this, void 0, void 0, function () {
            var length, cli, command, res, splitList, splitListLength, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        length = fileList.length;
                        cli = this.settings.picgoCorePath || "picgo";
                        command = cli + " upload " + fileList
                            .map(function (item) { return "\"" + item + "\""; })
                            .join(" ");
                        return [4 /*yield*/, this.exec(command)];
                    case 1:
                        res = _a.sent();
                        splitList = res.split("\n");
                        splitListLength = splitList.length;
                        console.log(splitListLength);
                        data = splitList.splice(splitListLength - 1 - length, length);
                        if (res.includes("PicGo ERROR")) {
                            return [2 /*return*/, {
                                    success: false,
                                    msg: "失败",
                                }];
                        }
                        else {
                            return [2 /*return*/, {
                                    success: true,
                                    result: data,
                                }];
                        }
                }
            });
        });
    };
    // PicGo-Core 上传处理
    PicGoCoreUploader.prototype.uploadFileByClipboard = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res, splitList, lastImage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.uploadByClip()];
                    case 1:
                        res = _a.sent();
                        splitList = res.split("\n");
                        lastImage = getLastImage(splitList);
                        if (lastImage) {
                            return [2 /*return*/, {
                                    code: 0,
                                    msg: "success",
                                    data: lastImage,
                                }];
                        }
                        else {
                            new obsidian.Notice("\"Please check PicGo-Core config\"\n" + res);
                            return [2 /*return*/, {
                                    code: -1,
                                    msg: "\"Please check PicGo-Core config\"\n" + res,
                                    data: "",
                                }];
                        }
                }
            });
        });
    };
    // PicGo-Core的剪切上传反馈
    PicGoCoreUploader.prototype.uploadByClip = function () {
        return __awaiter(this, void 0, void 0, function () {
            var command, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.settings.picgoCorePath) {
                            command = this.settings.picgoCorePath + " upload";
                        }
                        else {
                            command = "picgo upload";
                        }
                        return [4 /*yield*/, this.exec(command)];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res];
                }
            });
        });
    };
    PicGoCoreUploader.prototype.exec = function (command) {
        return __awaiter(this, void 0, void 0, function () {
            var stdout, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, childProcess.exec(command)];
                    case 1:
                        stdout = (_a.sent()).stdout;
                        return [4 /*yield*/, streamToString(stdout)];
                    case 2:
                        res = _a.sent();
                        return [2 /*return*/, res];
                }
            });
        });
    };
    return PicGoCoreUploader;
}());

var REGEX_FILE = /\!\[(.*?)\]\((.*?)\)/g;
var REGEX_WIKI_FILE = /\!\[\[(.*?)(\s\|.*?)?\]\]/g;
var Helper = /** @class */ (function () {
    function Helper(app) {
        this.app = app;
    }
    Helper.prototype.getFrontmatterValue = function (key, defaultValue) {
        if (defaultValue === void 0) { defaultValue = undefined; }
        var file = this.app.workspace.getActiveFile();
        if (!file) {
            return undefined;
        }
        var path = file.path;
        var cache = this.app.metadataCache.getCache(path);
        var value = defaultValue;
        if ((cache === null || cache === void 0 ? void 0 : cache.frontmatter) && cache.frontmatter.hasOwnProperty(key)) {
            value = cache.frontmatter[key];
        }
        return value;
    };
    Helper.prototype.getEditor = function () {
        var mdView = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
        if (mdView) {
            return mdView.editor;
        }
        else {
            return null;
        }
    };
    Helper.prototype.getValue = function () {
        var editor = this.getEditor();
        return editor.getValue();
    };
    Helper.prototype.setValue = function (value) {
        var editor = this.getEditor();
        var _a = editor.getScrollInfo(), left = _a.left, top = _a.top;
        var position = editor.getCursor();
        editor.setValue(value);
        editor.scrollTo(left, top);
        editor.setCursor(position);
    };
    // get all file urls, include local and internet
    Helper.prototype.getAllFiles = function () {
        var editor = this.getEditor();
        var value = editor.getValue();
        return this.getImageLink(value);
    };
    Helper.prototype.getImageLink = function (value) {
        var e_1, _a, e_2, _b;
        var matches = value.matchAll(REGEX_FILE);
        var WikiMatches = value.matchAll(REGEX_WIKI_FILE);
        var fileArray = [];
        try {
            for (var matches_1 = __values(matches), matches_1_1 = matches_1.next(); !matches_1_1.done; matches_1_1 = matches_1.next()) {
                var match = matches_1_1.value;
                var name_1 = match[1];
                var path$1 = match[2];
                var source = match[0];
                fileArray.push({
                    path: path$1,
                    name: name_1,
                    source: source,
                });
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (matches_1_1 && !matches_1_1.done && (_a = matches_1.return)) _a.call(matches_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        try {
            for (var WikiMatches_1 = __values(WikiMatches), WikiMatches_1_1 = WikiMatches_1.next(); !WikiMatches_1_1.done; WikiMatches_1_1 = WikiMatches_1.next()) {
                var match = WikiMatches_1_1.value;
                var name_2 = path.parse(match[1]).name;
                var path$1 = match[1];
                var source = match[0];
                fileArray.push({
                    path: path$1,
                    name: name_2,
                    source: source,
                });
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (WikiMatches_1_1 && !WikiMatches_1_1.done && (_b = WikiMatches_1.return)) _b.call(WikiMatches_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return fileArray;
    };
    Helper.prototype.hasBlackDomain = function (src, blackDomains) {
        if (blackDomains.trim() === "") {
            return false;
        }
        var blackDomainList = blackDomains.split(",");
        var url = new URL(src);
        var domain = url.hostname;
        return blackDomainList.some(function (blackDomain) { return domain.includes(blackDomain); });
    };
    return Helper;
}());

// العربية
var ar = {};

// čeština
var cz = {};

// Dansk
var da = {};

// Deutsch
var de = {};

// English
var en = {
    // setting.ts
    "Plugin Settings": "Plugin Settings",
    "Auto pasted upload": "Auto pasted upload",
    "If you set this value true, when you paste image, it will be auto uploaded(you should set the picGo server rightly)": "If you set this value true, when you paste image, it will be auto uploaded(you should set the picGo server rightly)",
    "Default uploader": "Default uploader",
    "PicGo server": "PicGo server",
    "Please input PicGo server": "Please input PicGo server",
    "PicGo-Core path": "PicGo-Core path",
    "Please input PicGo-Core path, default using environment variables": "Please input PicGo-Core path, default using environment variables",
    "Work on network": "Work on network",
    "Work on network Description": "Allow upload network image by 'Upload all' command.\n Or when you paste, md standard image link in your clipboard will be auto upload.",
    fixPath: "fixPath",
    fixPathWarning: "This option is used to fix PicGo-core upload failures on Linux and Mac. It modifies the PATH variable within Obsidian. If Obsidian encounters any bugs, turn off the option, try again! ",
    "Upload when clipboard has image and text together": "Upload when clipboard has image and text together",
    "When you copy, some application like Excel will image and text to clipboard, you can upload or not.": "When you copy, some application like Excel will image and text to clipboard, you can upload or not.",
    "Network Domain Black List": "Network Domain Black List",
    "Network Domain Black List Description": "Image in the domain list will not be upload,use comma separated",
    "Delete source file after you upload file": "Delete source file after you upload file",
    "Delete source file in ob assets after you upload file.": "Delete source file in ob assets after you upload file.",
};

// British English
var enGB = {};

// Español
var es = {};

// français
var fr = {};

// हिन्दी
var hi = {};

// Bahasa Indonesia
var id = {};

// Italiano
var it = {};

// 日本語
var ja = {};

// 한국어
var ko = {};

// Nederlands
var nl = {};

// Norsk
var no = {};

// język polski
var pl = {};

// Português
var pt = {};

// Português do Brasil
// Brazilian Portuguese
var ptBR = {};

// Română
var ro = {};

// русский
var ru = {};

// Türkçe
var tr = {};

// 简体中文
var zhCN = {
    // setting.ts
    "Plugin Settings": "插件设置",
    "Auto pasted upload": "剪切板自动上传",
    "If you set this value true, when you paste image, it will be auto uploaded(you should set the picGo server rightly)": "启用该选项后，黏贴图片时会自动上传（你需要正确配置picgo）",
    "Default uploader": "默认上传器",
    "PicGo server": "PicGo server",
    "Please input PicGo server": "请输入 PicGo server",
    "PicGo-Core path": "PicGo-Core 路径",
    "Please input PicGo-Core path, default using environment variables": "请输入 PicGo-Core path，默认使用环境变量",
    "Work on network": "应用网络图片",
    "Work on network Description": "当你上传所有图片时，也会上传网络图片。以及当你进行黏贴时，剪切板中的标准 md 图片会被上传",
    fixPath: "修正PATH变量",
    fixPathWarning: "此选项用于修复Linux和Mac上 PicGo-Core 上传失败的问题。它会修改 Obsidian 内的 PATH 变量，如果 Obsidian 遇到任何BUG，先关闭这个选项试试！",
    "Upload when clipboard has image and text together": "当剪切板同时拥有文本和图片剪切板数据时是否上传图片",
    "When you copy, some application like Excel will image and text to clipboard, you can upload or not.": "当你复制时，某些应用例如 Excel 会在剪切板同时文本和图像数据，确认是否上传。",
    "Network Domain Black List": "网络图片域名黑名单",
    "Network Domain Black List Description": "黑名单域名中的图片将不会被上传，用英文逗号分割",
    "Delete source file after you upload file": "上传文件后移除源文件",
    "Delete source file in ob assets after you upload file.": "上传文件后移除在ob附件文件夹中的文件",
};

// 繁體中文
var zhTW = {};

var localeMap = {
    ar: ar,
    cs: cz,
    da: da,
    de: de,
    en: en,
    'en-gb': enGB,
    es: es,
    fr: fr,
    hi: hi,
    id: id,
    it: it,
    ja: ja,
    ko: ko,
    nl: nl,
    nn: no,
    pl: pl,
    pt: pt,
    'pt-br': ptBR,
    ro: ro,
    ru: ru,
    tr: tr,
    'zh-cn': zhCN,
    'zh-tw': zhTW,
};
var locale = localeMap[obsidian.moment.locale()];
function t(str) {
    return (locale && locale[str]) || en[str];
}

var DEFAULT_SETTINGS = {
    uploadByClipSwitch: true,
    uploader: "PicGo",
    uploadServer: "http://127.0.0.1:36677/upload",
    picgoCorePath: "",
    workOnNetWork: false,
    fixPath: false,
    applyImage: true,
    newWorkBlackDomains: "",
    deleteSource: false,
};
var SettingTab = /** @class */ (function (_super) {
    __extends(SettingTab, _super);
    function SettingTab(app, plugin) {
        var _this = _super.call(this, app, plugin) || this;
        _this.plugin = plugin;
        return _this;
    }
    SettingTab.prototype.display = function () {
        var _this = this;
        var containerEl = this.containerEl;
        var os = getOS();
        containerEl.empty();
        containerEl.createEl("h2", { text: t("Plugin Settings") });
        new obsidian.Setting(containerEl)
            .setName(t("Auto pasted upload"))
            .setDesc(t("If you set this value true, when you paste image, it will be auto uploaded(you should set the picGo server rightly)"))
            .addToggle(function (toggle) {
            return toggle
                .setValue(_this.plugin.settings.uploadByClipSwitch)
                .onChange(function (value) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.plugin.settings.uploadByClipSwitch = value;
                            return [4 /*yield*/, this.plugin.saveSettings()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        new obsidian.Setting(containerEl)
            .setName(t("Default uploader"))
            .setDesc(t("Default uploader"))
            .addDropdown(function (cb) {
            return cb
                .addOption("PicGo", "PicGo(app)")
                .addOption("PicGo-Core", "PicGo-Core")
                .setValue(_this.plugin.settings.uploader)
                .onChange(function (value) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.plugin.settings.uploader = value;
                            this.display();
                            return [4 /*yield*/, this.plugin.saveSettings()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        if (this.plugin.settings.uploader === "PicGo") {
            new obsidian.Setting(containerEl)
                .setName(t("PicGo server"))
                .setDesc(t("PicGo server"))
                .addText(function (text) {
                return text
                    .setPlaceholder(t("Please input PicGo server"))
                    .setValue(_this.plugin.settings.uploadServer)
                    .onChange(function (key) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                this.plugin.settings.uploadServer = key;
                                return [4 /*yield*/, this.plugin.saveSettings()];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
        }
        if (this.plugin.settings.uploader === "PicGo-Core") {
            new obsidian.Setting(containerEl)
                .setName(t("PicGo-Core path"))
                .setDesc(t("Please input PicGo-Core path, default using environment variables"))
                .addText(function (text) {
                return text
                    .setPlaceholder("")
                    .setValue(_this.plugin.settings.picgoCorePath)
                    .onChange(function (value) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                this.plugin.settings.picgoCorePath = value;
                                return [4 /*yield*/, this.plugin.saveSettings()];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
            if (os !== "Windows") {
                new obsidian.Setting(containerEl)
                    .setName(t("fixPath"))
                    .setDesc(t("fixPathWarning"))
                    .addToggle(function (toggle) {
                    return toggle
                        .setValue(_this.plugin.settings.fixPath)
                        .onChange(function (value) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    this.plugin.settings.fixPath = value;
                                    return [4 /*yield*/, this.plugin.saveSettings()];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                });
            }
        }
        new obsidian.Setting(containerEl)
            .setName(t("Work on network"))
            .setDesc(t("Work on network Description"))
            .addToggle(function (toggle) {
            return toggle
                .setValue(_this.plugin.settings.workOnNetWork)
                .onChange(function (value) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.plugin.settings.workOnNetWork = value;
                            this.display();
                            return [4 /*yield*/, this.plugin.saveSettings()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        new obsidian.Setting(containerEl)
            .setName(t("Network Domain Black List"))
            .setDesc(t("Network Domain Black List Description"))
            .addTextArea(function (textArea) {
            return textArea
                .setValue(_this.plugin.settings.newWorkBlackDomains)
                .onChange(function (value) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.plugin.settings.newWorkBlackDomains = value;
                            return [4 /*yield*/, this.plugin.saveSettings()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        new obsidian.Setting(containerEl)
            .setName(t("Upload when clipboard has image and text together"))
            .setDesc(t("When you copy, some application like Excel will image and text to clipboard, you can upload or not."))
            .addToggle(function (toggle) {
            return toggle
                .setValue(_this.plugin.settings.applyImage)
                .onChange(function (value) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.plugin.settings.applyImage = value;
                            this.display();
                            return [4 /*yield*/, this.plugin.saveSettings()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        new obsidian.Setting(containerEl)
            .setName(t("Delete source file after you upload file"))
            .setDesc(t("Delete source file in ob assets after you upload file."))
            .addToggle(function (toggle) {
            return toggle
                .setValue(_this.plugin.settings.deleteSource)
                .onChange(function (value) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.plugin.settings.deleteSource = value;
                            this.display();
                            return [4 /*yield*/, this.plugin.saveSettings()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    };
    return SettingTab;
}(obsidian.PluginSettingTab));

var imageAutoUploadPlugin = /** @class */ (function (_super) {
    __extends(imageAutoUploadPlugin, _super);
    function imageAutoUploadPlugin() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    imageAutoUploadPlugin.prototype.loadSettings = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _a = this;
                        _c = (_b = Object).assign;
                        _d = [DEFAULT_SETTINGS];
                        return [4 /*yield*/, this.loadData()];
                    case 1:
                        _a.settings = _c.apply(_b, _d.concat([_e.sent()]));
                        return [2 /*return*/];
                }
            });
        });
    };
    imageAutoUploadPlugin.prototype.saveSettings = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.saveData(this.settings)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    imageAutoUploadPlugin.prototype.onunload = function () { };
    imageAutoUploadPlugin.prototype.onload = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadSettings()];
                    case 1:
                        _a.sent();
                        this.helper = new Helper(this.app);
                        this.picGoUploader = new PicGoUploader(this.settings);
                        this.picGoCoreUploader = new PicGoCoreUploader(this.settings);
                        if (this.settings.uploader === "PicGo") {
                            this.uploader = this.picGoUploader;
                        }
                        else if (this.settings.uploader === "PicGo-Core") {
                            this.uploader = this.picGoCoreUploader;
                            if (this.settings.fixPath) {
                                fixPath();
                            }
                        }
                        else {
                            new obsidian.Notice("unknown uploader");
                        }
                        obsidian.addIcon("upload", "<svg t=\"1636630783429\" class=\"icon\" viewBox=\"0 0 100 100\" version=\"1.1\" p-id=\"4649\" xmlns=\"http://www.w3.org/2000/svg\">\n      <path d=\"M 71.638 35.336 L 79.408 35.336 C 83.7 35.336 87.178 38.662 87.178 42.765 L 87.178 84.864 C 87.178 88.969 83.7 92.295 79.408 92.295 L 17.249 92.295 C 12.957 92.295 9.479 88.969 9.479 84.864 L 9.479 42.765 C 9.479 38.662 12.957 35.336 17.249 35.336 L 25.019 35.336 L 25.019 42.765 L 17.249 42.765 L 17.249 84.864 L 79.408 84.864 L 79.408 42.765 L 71.638 42.765 L 71.638 35.336 Z M 49.014 10.179 L 67.326 27.688 L 61.835 32.942 L 52.849 24.352 L 52.849 59.731 L 45.078 59.731 L 45.078 24.455 L 36.194 32.947 L 30.702 27.692 L 49.012 10.181 Z\" p-id=\"4650\" fill=\"#8a8a8a\"></path>\n    </svg>");
                        this.addSettingTab(new SettingTab(this.app, this));
                        this.addCommand({
                            id: "Upload all images",
                            name: "Upload all images",
                            checkCallback: function (checking) {
                                var leaf = _this.app.workspace.activeLeaf;
                                if (leaf) {
                                    if (!checking) {
                                        _this.uploadAllFile();
                                    }
                                    return true;
                                }
                                return false;
                            },
                        });
                        this.addCommand({
                            id: "Download all images",
                            name: "Download all images",
                            checkCallback: function (checking) {
                                var leaf = _this.app.workspace.activeLeaf;
                                if (leaf) {
                                    if (!checking) {
                                        _this.downloadAllImageFiles();
                                    }
                                    return true;
                                }
                                return false;
                            },
                        });
                        this.setupPasteHandler();
                        this.registerFileMenu();
                        return [2 /*return*/];
                }
            });
        });
    };
    imageAutoUploadPlugin.prototype.downloadAllImageFiles = function () {
        return __awaiter(this, void 0, void 0, function () {
            var folderPath, fileArray, imageArray, fileArray_1, fileArray_1_1, file, url, asset, _a, name_1, ext, response, activeFolder, basePath, abstractActiveFolder, e_1_1, value;
            var e_1, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        folderPath = this.getFileAssetPath();
                        fileArray = this.helper.getAllFiles();
                        if (!fs.existsSync(folderPath)) {
                            fs.mkdirSync(folderPath);
                        }
                        imageArray = [];
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 6, 7, 8]);
                        fileArray_1 = __values(fileArray), fileArray_1_1 = fileArray_1.next();
                        _c.label = 2;
                    case 2:
                        if (!!fileArray_1_1.done) return [3 /*break*/, 5];
                        file = fileArray_1_1.value;
                        if (!file.path.startsWith("http")) {
                            return [3 /*break*/, 4];
                        }
                        url = file.path;
                        asset = getUrlAsset(url);
                        if (!isAnImage(asset.substr(asset.lastIndexOf(".")))) {
                            return [3 /*break*/, 4];
                        }
                        _a = __read([
                            decodeURI(path.parse(asset).name).replaceAll(/[\\\\/:*?\"<>|]/g, "-"),
                            path.parse(asset).ext,
                        ], 2), name_1 = _a[0], ext = _a[1];
                        // 如果文件名已存在，则用随机值替换
                        if (fs.existsSync(path.join(folderPath, encodeURI(asset)))) {
                            name_1 = (Math.random() + 1).toString(36).substr(2, 5);
                        }
                        name_1 = "image-" + name_1;
                        return [4 /*yield*/, this.download(url, path.join(folderPath, "" + name_1 + ext))];
                    case 3:
                        response = _c.sent();
                        if (response.ok) {
                            activeFolder = this.app.vault.getAbstractFileByPath(this.app.workspace.getActiveFile().path).parent.path;
                            basePath = this.app.vault.adapter.getBasePath();
                            abstractActiveFolder = path.resolve(basePath, activeFolder);
                            imageArray.push({
                                source: file.source,
                                name: name_1,
                                path: obsidian.normalizePath(path.relative(abstractActiveFolder, response.path)),
                            });
                        }
                        _c.label = 4;
                    case 4:
                        fileArray_1_1 = fileArray_1.next();
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        e_1_1 = _c.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 8];
                    case 7:
                        try {
                            if (fileArray_1_1 && !fileArray_1_1.done && (_b = fileArray_1.return)) _b.call(fileArray_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 8:
                        value = this.helper.getValue();
                        imageArray.map(function (image) {
                            value = value.replace(image.source, "![" + image.name + "](" + encodeURI(image.path) + ")");
                        });
                        this.helper.setValue(value);
                        new obsidian.Notice("all: " + fileArray.length + "\nsuccess: " + imageArray.length + "\nfailed: " + (fileArray.length - imageArray.length));
                        return [2 /*return*/];
                }
            });
        });
    };
    // 获取当前文件所属的附件文件夹
    imageAutoUploadPlugin.prototype.getFileAssetPath = function () {
        var basePath = this.app.vault.adapter.getBasePath();
        // @ts-ignore
        var assetFolder = this.app.vault.config.attachmentFolderPath;
        var activeFile = this.app.vault.getAbstractFileByPath(this.app.workspace.getActiveFile().path);
        // 当前文件夹下的子文件夹
        if (assetFolder.startsWith("./")) {
            var activeFolder = decodeURI(path.resolve(basePath, activeFile.parent.path));
            return path.join(activeFolder, assetFolder);
        }
        else {
            // 根文件夹
            return path.join(basePath, assetFolder);
        }
    };
    imageAutoUploadPlugin.prototype.download = function (url, path) {
        return __awaiter(this, void 0, void 0, function () {
            var response, buffer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, obsidian.requestUrl({ url: url })];
                    case 1:
                        response = _a.sent();
                        if (response.status !== 200) {
                            return [2 /*return*/, {
                                    ok: false,
                                    msg: "error",
                                }];
                        }
                        buffer = Buffer.from(response.arrayBuffer);
                        try {
                            fs.writeFileSync(path, buffer);
                            return [2 /*return*/, {
                                    ok: true,
                                    msg: "ok",
                                    path: path,
                                }];
                        }
                        catch (err) {
                            console.error(err);
                            return [2 /*return*/, {
                                    ok: false,
                                    msg: err,
                                }];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    imageAutoUploadPlugin.prototype.registerFileMenu = function () {
        var _this = this;
        this.registerEvent(this.app.workspace.on("file-menu", function (menu, file, source) {
            if (!isAssetTypeAnImage(file.path)) {
                return false;
            }
            menu.addItem(function (item) {
                item
                    .setTitle("Upload")
                    .setIcon("upload")
                    .onClick(function () {
                    if (!(file instanceof obsidian.TFile)) {
                        return false;
                    }
                    _this.fileMenuUpload(file);
                });
            });
        }));
    };
    imageAutoUploadPlugin.prototype.fileMenuUpload = function (file) {
        var e_2, _a;
        var _this = this;
        var content = this.helper.getValue();
        var basePath = this.app.vault.adapter.getBasePath();
        var imageList = [];
        var fileArray = this.helper.getAllFiles();
        try {
            for (var fileArray_2 = __values(fileArray), fileArray_2_1 = fileArray_2.next(); !fileArray_2_1.done; fileArray_2_1 = fileArray_2.next()) {
                var match = fileArray_2_1.value;
                var imageName = match.name;
                var encodedUri = match.path;
                var fileName = path.basename(decodeURI(encodedUri));
                if (file && file.name === fileName) {
                    var abstractImageFile = path.join(basePath, file.path);
                    if (isAssetTypeAnImage(abstractImageFile)) {
                        imageList.push({
                            path: abstractImageFile,
                            name: imageName,
                            source: match.source,
                        });
                    }
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (fileArray_2_1 && !fileArray_2_1.done && (_a = fileArray_2.return)) _a.call(fileArray_2);
            }
            finally { if (e_2) throw e_2.error; }
        }
        if (imageList.length === 0) {
            new obsidian.Notice("没有解析到图像文件");
            return;
        }
        this.uploader.uploadFiles(imageList.map(function (item) { return item.path; })).then(function (res) {
            if (res.success) {
                var uploadUrlList_1 = res.result;
                imageList.map(function (item) {
                    var uploadImage = uploadUrlList_1.shift();
                    content = content.replaceAll(item.source, "![" + item.name + "](" + uploadImage + ")");
                });
                _this.helper.setValue(content);
                if (_this.settings.deleteSource) {
                    imageList.map(function (image) {
                        if (!image.path.startsWith("http")) {
                            fs.unlink(image.path, function () { });
                        }
                    });
                }
            }
            else {
                new obsidian.Notice("Upload error");
            }
        });
    };
    imageAutoUploadPlugin.prototype.filterFile = function (fileArray) {
        var e_3, _a;
        var imageList = [];
        try {
            for (var fileArray_3 = __values(fileArray), fileArray_3_1 = fileArray_3.next(); !fileArray_3_1.done; fileArray_3_1 = fileArray_3.next()) {
                var match = fileArray_3_1.value;
                if (this.settings.workOnNetWork && match.path.startsWith("http")) {
                    if (!this.helper.hasBlackDomain(match.path, this.settings.newWorkBlackDomains)) {
                        imageList.push({
                            path: match.path,
                            name: match.name,
                            source: match.source,
                        });
                    }
                }
                else {
                    imageList.push({
                        path: match.path,
                        name: match.name,
                        source: match.source,
                    });
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (fileArray_3_1 && !fileArray_3_1.done && (_a = fileArray_3.return)) _a.call(fileArray_3);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return imageList;
    };
    imageAutoUploadPlugin.prototype.getFile = function (fileName, fileMap) {
        if (!fileMap) {
            fileMap = arrayToObject(this.app.vault.getFiles(), "name");
        }
        return fileMap[fileName];
    };
    // uploda all file
    imageAutoUploadPlugin.prototype.uploadAllFile = function () {
        var e_4, _a;
        var _this = this;
        var content = this.helper.getValue();
        var basePath = this.app.vault.adapter.getBasePath();
        var fileMap = arrayToObject(this.app.vault.getFiles(), "name");
        var imageList = [];
        var fileArray = this.filterFile(this.helper.getAllFiles());
        try {
            for (var fileArray_4 = __values(fileArray), fileArray_4_1 = fileArray_4.next(); !fileArray_4_1.done; fileArray_4_1 = fileArray_4.next()) {
                var match = fileArray_4_1.value;
                var imageName = match.name;
                var encodedUri = match.path;
                if (encodedUri.startsWith("http")) {
                    imageList.push({
                        path: match.path,
                        name: imageName,
                        source: match.source,
                    });
                }
                else {
                    var fileName = path.basename(decodeURI(encodedUri));
                    var file = this.getFile(fileName, fileMap);
                    if (file) {
                        var abstractImageFile = path.join(basePath, file.path);
                        if (isAssetTypeAnImage(abstractImageFile)) {
                            imageList.push({
                                path: abstractImageFile,
                                name: imageName,
                                source: match.source,
                            });
                        }
                    }
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (fileArray_4_1 && !fileArray_4_1.done && (_a = fileArray_4.return)) _a.call(fileArray_4);
            }
            finally { if (e_4) throw e_4.error; }
        }
        if (imageList.length === 0) {
            new obsidian.Notice("没有解析到图像文件");
            return;
        }
        else {
            new obsidian.Notice("\u5171\u627E\u5230" + imageList.length + "\u4E2A\u56FE\u50CF\u6587\u4EF6\uFF0C\u5F00\u59CB\u4E0A\u4F20");
        }
        this.uploader.uploadFiles(imageList.map(function (item) { return item.path; })).then(function (res) {
            if (res.success) {
                var uploadUrlList_2 = res.result;
                imageList.map(function (item) {
                    var uploadImage = uploadUrlList_2.shift();
                    content = content.replaceAll(item.source, "![" + item.name + "](" + uploadImage + ")");
                });
                _this.helper.setValue(content);
                if (_this.settings.deleteSource) {
                    imageList.map(function (image) {
                        if (!image.path.startsWith("http")) {
                            fs.unlink(image.path, function () { });
                        }
                    });
                }
            }
            else {
                new obsidian.Notice("Upload error");
            }
        });
    };
    imageAutoUploadPlugin.prototype.setupPasteHandler = function () {
        var _this = this;
        this.registerEvent(this.app.workspace.on("editor-paste", function (evt, editor, markdownView) {
            var allowUpload = _this.helper.getFrontmatterValue("image-auto-upload", _this.settings.uploadByClipSwitch);
            evt.clipboardData.files;
            if (!allowUpload) {
                return;
            }
            // 剪贴板内容有md格式的图片时
            if (_this.settings.workOnNetWork) {
                var clipboardValue = evt.clipboardData.getData("text/plain");
                var imageList_1 = _this.helper
                    .getImageLink(clipboardValue)
                    .filter(function (image) { return image.path.startsWith("http"); })
                    .filter(function (image) {
                    return !_this.helper.hasBlackDomain(image.path, _this.settings.newWorkBlackDomains);
                });
                if (imageList_1.length !== 0) {
                    _this.uploader
                        .uploadFiles(imageList_1.map(function (item) { return item.path; }))
                        .then(function (res) {
                        var value = _this.helper.getValue();
                        if (res.success) {
                            var uploadUrlList_3 = res.result;
                            imageList_1.map(function (item) {
                                var uploadImage = uploadUrlList_3.shift();
                                value = value.replaceAll(item.source, "![" + item.name + "](" + uploadImage + ")");
                            });
                            _this.helper.setValue(value);
                        }
                        else {
                            new obsidian.Notice("Upload error");
                        }
                    });
                }
            }
            // 剪贴板中是图片时进行上传
            if (_this.canUpload(evt.clipboardData)) {
                _this.uploadFileAndEmbedImgurImage(editor, function (editor, pasteId) { return __awaiter(_this, void 0, void 0, function () {
                    var res, url;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, this.uploader.uploadFileByClipboard()];
                            case 1:
                                res = _a.sent();
                                if (res.code !== 0) {
                                    this.handleFailedUpload(editor, pasteId, res.msg);
                                    return [2 /*return*/];
                                }
                                url = res.data;
                                return [2 /*return*/, url];
                        }
                    });
                }); }, evt.clipboardData).catch();
                evt.preventDefault();
            }
        }));
        this.registerEvent(this.app.workspace.on("editor-drop", function (evt, editor, markdownView) { return __awaiter(_this, void 0, void 0, function () {
            var allowUpload, files, sendFiles_1, files_1, data;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        allowUpload = this.helper.getFrontmatterValue("image-auto-upload", this.settings.uploadByClipSwitch);
                        files = evt.dataTransfer.files;
                        if (!allowUpload) {
                            return [2 /*return*/];
                        }
                        if (!(files.length !== 0 && files[0].type.startsWith("image"))) return [3 /*break*/, 2];
                        sendFiles_1 = [];
                        files_1 = evt.dataTransfer.files;
                        Array.from(files_1).forEach(function (item, index) {
                            sendFiles_1.push(item.path);
                        });
                        evt.preventDefault();
                        return [4 /*yield*/, this.uploader.uploadFiles(sendFiles_1)];
                    case 1:
                        data = _a.sent();
                        if (data.success) {
                            data.result.map(function (value) {
                                var pasteId = (Math.random() + 1).toString(36).substr(2, 5);
                                _this.insertTemporaryText(editor, pasteId);
                                _this.embedMarkDownImage(editor, pasteId, value, files_1[0].name);
                            });
                        }
                        else {
                            new obsidian.Notice("Upload error");
                        }
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        }); }));
    };
    imageAutoUploadPlugin.prototype.canUpload = function (clipboardData) {
        this.settings.applyImage;
        var files = clipboardData.files;
        var text = clipboardData.getData("text");
        var hasImageFile = files.length !== 0 && files[0].type.startsWith("image");
        if (hasImageFile) {
            if (!!text) {
                return this.settings.applyImage;
            }
            else {
                return true;
            }
        }
        else {
            return false;
        }
    };
    imageAutoUploadPlugin.prototype.uploadFileAndEmbedImgurImage = function (editor, callback, clipboardData) {
        return __awaiter(this, void 0, void 0, function () {
            var pasteId, name, url, e_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pasteId = (Math.random() + 1).toString(36).substr(2, 5);
                        this.insertTemporaryText(editor, pasteId);
                        name = clipboardData.files[0].name;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, callback(editor, pasteId)];
                    case 2:
                        url = _a.sent();
                        this.embedMarkDownImage(editor, pasteId, url, name);
                        return [3 /*break*/, 4];
                    case 3:
                        e_5 = _a.sent();
                        this.handleFailedUpload(editor, pasteId, e_5);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    imageAutoUploadPlugin.prototype.insertTemporaryText = function (editor, pasteId) {
        var progressText = imageAutoUploadPlugin.progressTextFor(pasteId);
        editor.replaceSelection(progressText + "\n");
    };
    imageAutoUploadPlugin.progressTextFor = function (id) {
        return "![Uploading file..." + id + "]()";
    };
    imageAutoUploadPlugin.prototype.embedMarkDownImage = function (editor, pasteId, imageUrl, name) {
        if (name === void 0) { name = ""; }
        var progressText = imageAutoUploadPlugin.progressTextFor(pasteId);
        var markDownImage = "![" + name + "](" + imageUrl + ")";
        imageAutoUploadPlugin.replaceFirstOccurrence(editor, progressText, markDownImage);
    };
    imageAutoUploadPlugin.prototype.handleFailedUpload = function (editor, pasteId, reason) {
        console.error("Failed request: ", reason);
        var progressText = imageAutoUploadPlugin.progressTextFor(pasteId);
        imageAutoUploadPlugin.replaceFirstOccurrence(editor, progressText, "⚠️upload failed, check dev console");
    };
    imageAutoUploadPlugin.replaceFirstOccurrence = function (editor, target, replacement) {
        var lines = editor.getValue().split("\n");
        for (var i = 0; i < lines.length; i++) {
            var ch = lines[i].indexOf(target);
            if (ch != -1) {
                var from = { line: i, ch: ch };
                var to = { line: i, ch: ch + target.length };
                editor.replaceRange(replacement, from, to);
                break;
            }
        }
    };
    return imageAutoUploadPlugin;
}(obsidian.Plugin));

module.exports = imageAutoUploadPlugin;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsIm5vZGVfbW9kdWxlcy9pc2V4ZS93aW5kb3dzLmpzIiwibm9kZV9tb2R1bGVzL2lzZXhlL21vZGUuanMiLCJub2RlX21vZHVsZXMvaXNleGUvaW5kZXguanMiLCJub2RlX21vZHVsZXMvd2hpY2gvd2hpY2guanMiLCJub2RlX21vZHVsZXMvcGF0aC1rZXkvaW5kZXguanMiLCJub2RlX21vZHVsZXMvY3Jvc3Mtc3Bhd24vbGliL3V0aWwvcmVzb2x2ZUNvbW1hbmQuanMiLCJub2RlX21vZHVsZXMvY3Jvc3Mtc3Bhd24vbGliL3V0aWwvZXNjYXBlLmpzIiwibm9kZV9tb2R1bGVzL3NoZWJhbmctcmVnZXgvaW5kZXguanMiLCJub2RlX21vZHVsZXMvc2hlYmFuZy1jb21tYW5kL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2Nyb3NzLXNwYXduL2xpYi91dGlsL3JlYWRTaGViYW5nLmpzIiwibm9kZV9tb2R1bGVzL2Nyb3NzLXNwYXduL2xpYi9wYXJzZS5qcyIsIm5vZGVfbW9kdWxlcy9jcm9zcy1zcGF3bi9saWIvZW5vZW50LmpzIiwibm9kZV9tb2R1bGVzL2Nyb3NzLXNwYXduL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3N0cmlwLWZpbmFsLW5ld2xpbmUvaW5kZXguanMiLCJub2RlX21vZHVsZXMvbnBtLXJ1bi1wYXRoL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL21pbWljLWZuL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL29uZXRpbWUvaW5kZXguanMiLCJub2RlX21vZHVsZXMvaHVtYW4tc2lnbmFscy9idWlsZC9zcmMvY29yZS5qcyIsIm5vZGVfbW9kdWxlcy9odW1hbi1zaWduYWxzL2J1aWxkL3NyYy9yZWFsdGltZS5qcyIsIm5vZGVfbW9kdWxlcy9odW1hbi1zaWduYWxzL2J1aWxkL3NyYy9zaWduYWxzLmpzIiwibm9kZV9tb2R1bGVzL2h1bWFuLXNpZ25hbHMvYnVpbGQvc3JjL21haW4uanMiLCJub2RlX21vZHVsZXMvZXhlY2EvbGliL2Vycm9yLmpzIiwibm9kZV9tb2R1bGVzL2V4ZWNhL2xpYi9zdGRpby5qcyIsIm5vZGVfbW9kdWxlcy9zaWduYWwtZXhpdC9zaWduYWxzLmpzIiwibm9kZV9tb2R1bGVzL3NpZ25hbC1leGl0L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2V4ZWNhL2xpYi9raWxsLmpzIiwibm9kZV9tb2R1bGVzL2lzLXN0cmVhbS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9leGVjYS9ub2RlX21vZHVsZXMvZ2V0LXN0cmVhbS9idWZmZXItc3RyZWFtLmpzIiwibm9kZV9tb2R1bGVzL2V4ZWNhL25vZGVfbW9kdWxlcy9nZXQtc3RyZWFtL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL21lcmdlLXN0cmVhbS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9leGVjYS9saWIvc3RyZWFtLmpzIiwibm9kZV9tb2R1bGVzL2V4ZWNhL2xpYi9wcm9taXNlLmpzIiwibm9kZV9tb2R1bGVzL2V4ZWNhL2xpYi9jb21tYW5kLmpzIiwibm9kZV9tb2R1bGVzL2V4ZWNhL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2Fuc2ktcmVnZXgvaW5kZXguanMiLCJub2RlX21vZHVsZXMvc3RyaXAtYW5zaS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9kZWZhdWx0LXNoZWxsL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3NoZWxsLWVudi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9zaGVsbC1wYXRoL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2ZpeC1wYXRoL2luZGV4LmpzIiwic3JjL3V0aWxzLnRzIiwic3JjL3VwbG9hZGVyLnRzIiwic3JjL2hlbHBlci50cyIsInNyYy9sYW5nL2xvY2FsZS9hci50cyIsInNyYy9sYW5nL2xvY2FsZS9jei50cyIsInNyYy9sYW5nL2xvY2FsZS9kYS50cyIsInNyYy9sYW5nL2xvY2FsZS9kZS50cyIsInNyYy9sYW5nL2xvY2FsZS9lbi50cyIsInNyYy9sYW5nL2xvY2FsZS9lbi1nYi50cyIsInNyYy9sYW5nL2xvY2FsZS9lcy50cyIsInNyYy9sYW5nL2xvY2FsZS9mci50cyIsInNyYy9sYW5nL2xvY2FsZS9oaS50cyIsInNyYy9sYW5nL2xvY2FsZS9pZC50cyIsInNyYy9sYW5nL2xvY2FsZS9pdC50cyIsInNyYy9sYW5nL2xvY2FsZS9qYS50cyIsInNyYy9sYW5nL2xvY2FsZS9rby50cyIsInNyYy9sYW5nL2xvY2FsZS9ubC50cyIsInNyYy9sYW5nL2xvY2FsZS9uby50cyIsInNyYy9sYW5nL2xvY2FsZS9wbC50cyIsInNyYy9sYW5nL2xvY2FsZS9wdC50cyIsInNyYy9sYW5nL2xvY2FsZS9wdC1ici50cyIsInNyYy9sYW5nL2xvY2FsZS9yby50cyIsInNyYy9sYW5nL2xvY2FsZS9ydS50cyIsInNyYy9sYW5nL2xvY2FsZS90ci50cyIsInNyYy9sYW5nL2xvY2FsZS96aC1jbi50cyIsInNyYy9sYW5nL2xvY2FsZS96aC10dy50cyIsInNyYy9sYW5nL2hlbHBlcnMudHMiLCJzcmMvc2V0dGluZy50cyIsInNyYy9tYWluLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qISAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5Db3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi5cclxuXHJcblBlcm1pc3Npb24gdG8gdXNlLCBjb3B5LCBtb2RpZnksIGFuZC9vciBkaXN0cmlidXRlIHRoaXMgc29mdHdhcmUgZm9yIGFueVxyXG5wdXJwb3NlIHdpdGggb3Igd2l0aG91dCBmZWUgaXMgaGVyZWJ5IGdyYW50ZWQuXHJcblxyXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiIEFORCBUSEUgQVVUSE9SIERJU0NMQUlNUyBBTEwgV0FSUkFOVElFUyBXSVRIXHJcblJFR0FSRCBUTyBUSElTIFNPRlRXQVJFIElOQ0xVRElORyBBTEwgSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWVxyXG5BTkQgRklUTkVTUy4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUiBCRSBMSUFCTEUgRk9SIEFOWSBTUEVDSUFMLCBESVJFQ1QsXHJcbklORElSRUNULCBPUiBDT05TRVFVRU5USUFMIERBTUFHRVMgT1IgQU5ZIERBTUFHRVMgV0hBVFNPRVZFUiBSRVNVTFRJTkcgRlJPTVxyXG5MT1NTIE9GIFVTRSwgREFUQSBPUiBQUk9GSVRTLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgTkVHTElHRU5DRSBPUlxyXG5PVEhFUiBUT1JUSU9VUyBBQ1RJT04sIEFSSVNJTkcgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgVVNFIE9SXHJcblBFUkZPUk1BTkNFIE9GIFRISVMgU09GVFdBUkUuXHJcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXHJcbi8qIGdsb2JhbCBSZWZsZWN0LCBQcm9taXNlICovXHJcblxyXG52YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uKGQsIGIpIHtcclxuICAgIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGIsIHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXh0ZW5kcyhkLCBiKSB7XHJcbiAgICBpZiAodHlwZW9mIGIgIT09IFwiZnVuY3Rpb25cIiAmJiBiICE9PSBudWxsKVxyXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDbGFzcyBleHRlbmRzIHZhbHVlIFwiICsgU3RyaW5nKGIpICsgXCIgaXMgbm90IGEgY29uc3RydWN0b3Igb3IgbnVsbFwiKTtcclxuICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxufVxyXG5cclxuZXhwb3J0IHZhciBfX2Fzc2lnbiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uIF9fYXNzaWduKHQpIHtcclxuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcclxuICAgICAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKSB0W3BdID0gc1twXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVzdChzLCBlKSB7XHJcbiAgICB2YXIgdCA9IHt9O1xyXG4gICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApICYmIGUuaW5kZXhPZihwKSA8IDApXHJcbiAgICAgICAgdFtwXSA9IHNbcF07XHJcbiAgICBpZiAocyAhPSBudWxsICYmIHR5cGVvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzID09PSBcImZ1bmN0aW9uXCIpXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIHAgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHMpOyBpIDwgcC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoZS5pbmRleE9mKHBbaV0pIDwgMCAmJiBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwocywgcFtpXSkpXHJcbiAgICAgICAgICAgICAgICB0W3BbaV1dID0gc1twW2ldXTtcclxuICAgICAgICB9XHJcbiAgICByZXR1cm4gdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpIHtcclxuICAgIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aCwgciA9IGMgPCAzID8gdGFyZ2V0IDogZGVzYyA9PT0gbnVsbCA/IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSA6IGRlc2MsIGQ7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO1xyXG4gICAgZWxzZSBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgaWYgKGQgPSBkZWNvcmF0b3JzW2ldKSByID0gKGMgPCAzID8gZChyKSA6IGMgPiAzID8gZCh0YXJnZXQsIGtleSwgcikgOiBkKHRhcmdldCwga2V5KSkgfHwgcjtcclxuICAgIHJldHVybiBjID4gMyAmJiByICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgciksIHI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3BhcmFtKHBhcmFtSW5kZXgsIGRlY29yYXRvcikge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIGtleSkgeyBkZWNvcmF0b3IodGFyZ2V0LCBrZXksIHBhcmFtSW5kZXgpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKSB7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QubWV0YWRhdGEgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIFJlZmxlY3QubWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdGVyKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xyXG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZ2VuZXJhdG9yKHRoaXNBcmcsIGJvZHkpIHtcclxuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XHJcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xyXG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcclxuICAgICAgICB3aGlsZSAoXykgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xyXG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XHJcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxyXG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgdmFyIF9fY3JlYXRlQmluZGluZyA9IE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgazIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG1ba107IH0gfSk7XHJcbn0pIDogKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XHJcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xyXG4gICAgb1trMl0gPSBtW2tdO1xyXG59KTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4cG9ydFN0YXIobSwgbykge1xyXG4gICAgZm9yICh2YXIgcCBpbiBtKSBpZiAocCAhPT0gXCJkZWZhdWx0XCIgJiYgIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvLCBwKSkgX19jcmVhdGVCaW5kaW5nKG8sIG0sIHApO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX192YWx1ZXMobykge1xyXG4gICAgdmFyIHMgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgU3ltYm9sLml0ZXJhdG9yLCBtID0gcyAmJiBvW3NdLCBpID0gMDtcclxuICAgIGlmIChtKSByZXR1cm4gbS5jYWxsKG8pO1xyXG4gICAgaWYgKG8gJiYgdHlwZW9mIG8ubGVuZ3RoID09PSBcIm51bWJlclwiKSByZXR1cm4ge1xyXG4gICAgICAgIG5leHQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKG8gJiYgaSA+PSBvLmxlbmd0aCkgbyA9IHZvaWQgMDtcclxuICAgICAgICAgICAgcmV0dXJuIHsgdmFsdWU6IG8gJiYgb1tpKytdLCBkb25lOiAhbyB9O1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKHMgPyBcIk9iamVjdCBpcyBub3QgaXRlcmFibGUuXCIgOiBcIlN5bWJvbC5pdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3JlYWQobywgbikge1xyXG4gICAgdmFyIG0gPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdO1xyXG4gICAgaWYgKCFtKSByZXR1cm4gbztcclxuICAgIHZhciBpID0gbS5jYWxsKG8pLCByLCBhciA9IFtdLCBlO1xyXG4gICAgdHJ5IHtcclxuICAgICAgICB3aGlsZSAoKG4gPT09IHZvaWQgMCB8fCBuLS0gPiAwKSAmJiAhKHIgPSBpLm5leHQoKSkuZG9uZSkgYXIucHVzaChyLnZhbHVlKTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlcnJvcikgeyBlID0geyBlcnJvcjogZXJyb3IgfTsgfVxyXG4gICAgZmluYWxseSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKHIgJiYgIXIuZG9uZSAmJiAobSA9IGlbXCJyZXR1cm5cIl0pKSBtLmNhbGwoaSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZpbmFsbHkgeyBpZiAoZSkgdGhyb3cgZS5lcnJvcjsgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG4vKiogQGRlcHJlY2F0ZWQgKi9cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkKCkge1xyXG4gICAgZm9yICh2YXIgYXIgPSBbXSwgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgYXIgPSBhci5jb25jYXQoX19yZWFkKGFyZ3VtZW50c1tpXSkpO1xyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG4vKiogQGRlcHJlY2F0ZWQgKi9cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkQXJyYXlzKCkge1xyXG4gICAgZm9yICh2YXIgcyA9IDAsIGkgPSAwLCBpbCA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBpbDsgaSsrKSBzICs9IGFyZ3VtZW50c1tpXS5sZW5ndGg7XHJcbiAgICBmb3IgKHZhciByID0gQXJyYXkocyksIGsgPSAwLCBpID0gMDsgaSA8IGlsOyBpKyspXHJcbiAgICAgICAgZm9yICh2YXIgYSA9IGFyZ3VtZW50c1tpXSwgaiA9IDAsIGpsID0gYS5sZW5ndGg7IGogPCBqbDsgaisrLCBrKyspXHJcbiAgICAgICAgICAgIHJba10gPSBhW2pdO1xyXG4gICAgcmV0dXJuIHI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZEFycmF5KHRvLCBmcm9tKSB7XHJcbiAgICBmb3IgKHZhciBpID0gMCwgaWwgPSBmcm9tLmxlbmd0aCwgaiA9IHRvLmxlbmd0aDsgaSA8IGlsOyBpKyssIGorKylcclxuICAgICAgICB0b1tqXSA9IGZyb21baV07XHJcbiAgICByZXR1cm4gdG87XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0KHYpIHtcclxuICAgIHJldHVybiB0aGlzIGluc3RhbmNlb2YgX19hd2FpdCA/ICh0aGlzLnYgPSB2LCB0aGlzKSA6IG5ldyBfX2F3YWl0KHYpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0dlbmVyYXRvcih0aGlzQXJnLCBfYXJndW1lbnRzLCBnZW5lcmF0b3IpIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgZyA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSwgaSwgcSA9IFtdO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiKSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlmIChnW25dKSBpW25dID0gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChhLCBiKSB7IHEucHVzaChbbiwgdiwgYSwgYl0pID4gMSB8fCByZXN1bWUobiwgdik7IH0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiByZXN1bWUobiwgdikgeyB0cnkgeyBzdGVwKGdbbl0odikpOyB9IGNhdGNoIChlKSB7IHNldHRsZShxWzBdWzNdLCBlKTsgfSB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKHIpIHsgci52YWx1ZSBpbnN0YW5jZW9mIF9fYXdhaXQgPyBQcm9taXNlLnJlc29sdmUoci52YWx1ZS52KS50aGVuKGZ1bGZpbGwsIHJlamVjdCkgOiBzZXR0bGUocVswXVsyXSwgcik7IH1cclxuICAgIGZ1bmN0aW9uIGZ1bGZpbGwodmFsdWUpIHsgcmVzdW1lKFwibmV4dFwiLCB2YWx1ZSk7IH1cclxuICAgIGZ1bmN0aW9uIHJlamVjdCh2YWx1ZSkgeyByZXN1bWUoXCJ0aHJvd1wiLCB2YWx1ZSk7IH1cclxuICAgIGZ1bmN0aW9uIHNldHRsZShmLCB2KSB7IGlmIChmKHYpLCBxLnNoaWZ0KCksIHEubGVuZ3RoKSByZXN1bWUocVswXVswXSwgcVswXVsxXSk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNEZWxlZ2F0b3Iobykge1xyXG4gICAgdmFyIGksIHA7XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIsIGZ1bmN0aW9uIChlKSB7IHRocm93IGU7IH0pLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuLCBmKSB7IGlbbl0gPSBvW25dID8gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIChwID0gIXApID8geyB2YWx1ZTogX19hd2FpdChvW25dKHYpKSwgZG9uZTogbiA9PT0gXCJyZXR1cm5cIiB9IDogZiA/IGYodikgOiB2OyB9IDogZjsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY1ZhbHVlcyhvKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIG0gPSBvW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSwgaTtcclxuICAgIHJldHVybiBtID8gbS5jYWxsKG8pIDogKG8gPSB0eXBlb2YgX192YWx1ZXMgPT09IFwiZnVuY3Rpb25cIiA/IF9fdmFsdWVzKG8pIDogb1tTeW1ib2wuaXRlcmF0b3JdKCksIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiKSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpKTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyBpW25dID0gb1tuXSAmJiBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkgeyB2ID0gb1tuXSh2KSwgc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgdi5kb25lLCB2LnZhbHVlKTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHNldHRsZShyZXNvbHZlLCByZWplY3QsIGQsIHYpIHsgUHJvbWlzZS5yZXNvbHZlKHYpLnRoZW4oZnVuY3Rpb24odikgeyByZXNvbHZlKHsgdmFsdWU6IHYsIGRvbmU6IGQgfSk7IH0sIHJlamVjdCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWFrZVRlbXBsYXRlT2JqZWN0KGNvb2tlZCwgcmF3KSB7XHJcbiAgICBpZiAoT2JqZWN0LmRlZmluZVByb3BlcnR5KSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb29rZWQsIFwicmF3XCIsIHsgdmFsdWU6IHJhdyB9KTsgfSBlbHNlIHsgY29va2VkLnJhdyA9IHJhdzsgfVxyXG4gICAgcmV0dXJuIGNvb2tlZDtcclxufTtcclxuXHJcbnZhciBfX3NldE1vZHVsZURlZmF1bHQgPSBPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIHYpIHtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBcImRlZmF1bHRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdiB9KTtcclxufSkgOiBmdW5jdGlvbihvLCB2KSB7XHJcbiAgICBvW1wiZGVmYXVsdFwiXSA9IHY7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnRTdGFyKG1vZCkge1xyXG4gICAgaWYgKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgcmV0dXJuIG1vZDtcclxuICAgIHZhciByZXN1bHQgPSB7fTtcclxuICAgIGlmIChtb2QgIT0gbnVsbCkgZm9yICh2YXIgayBpbiBtb2QpIGlmIChrICE9PSBcImRlZmF1bHRcIiAmJiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9kLCBrKSkgX19jcmVhdGVCaW5kaW5nKHJlc3VsdCwgbW9kLCBrKTtcclxuICAgIF9fc2V0TW9kdWxlRGVmYXVsdChyZXN1bHQsIG1vZCk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnREZWZhdWx0KG1vZCkge1xyXG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBkZWZhdWx0OiBtb2QgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fY2xhc3NQcml2YXRlRmllbGRHZXQocmVjZWl2ZXIsIHN0YXRlLCBraW5kLCBmKSB7XHJcbiAgICBpZiAoa2luZCA9PT0gXCJhXCIgJiYgIWYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJQcml2YXRlIGFjY2Vzc29yIHdhcyBkZWZpbmVkIHdpdGhvdXQgYSBnZXR0ZXJcIik7XHJcbiAgICBpZiAodHlwZW9mIHN0YXRlID09PSBcImZ1bmN0aW9uXCIgPyByZWNlaXZlciAhPT0gc3RhdGUgfHwgIWYgOiAhc3RhdGUuaGFzKHJlY2VpdmVyKSkgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCByZWFkIHByaXZhdGUgbWVtYmVyIGZyb20gYW4gb2JqZWN0IHdob3NlIGNsYXNzIGRpZCBub3QgZGVjbGFyZSBpdFwiKTtcclxuICAgIHJldHVybiBraW5kID09PSBcIm1cIiA/IGYgOiBraW5kID09PSBcImFcIiA/IGYuY2FsbChyZWNlaXZlcikgOiBmID8gZi52YWx1ZSA6IHN0YXRlLmdldChyZWNlaXZlcik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2NsYXNzUHJpdmF0ZUZpZWxkU2V0KHJlY2VpdmVyLCBzdGF0ZSwgdmFsdWUsIGtpbmQsIGYpIHtcclxuICAgIGlmIChraW5kID09PSBcIm1cIikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlByaXZhdGUgbWV0aG9kIGlzIG5vdCB3cml0YWJsZVwiKTtcclxuICAgIGlmIChraW5kID09PSBcImFcIiAmJiAhZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlByaXZhdGUgYWNjZXNzb3Igd2FzIGRlZmluZWQgd2l0aG91dCBhIHNldHRlclwiKTtcclxuICAgIGlmICh0eXBlb2Ygc3RhdGUgPT09IFwiZnVuY3Rpb25cIiA/IHJlY2VpdmVyICE9PSBzdGF0ZSB8fCAhZiA6ICFzdGF0ZS5oYXMocmVjZWl2ZXIpKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IHdyaXRlIHByaXZhdGUgbWVtYmVyIHRvIGFuIG9iamVjdCB3aG9zZSBjbGFzcyBkaWQgbm90IGRlY2xhcmUgaXRcIik7XHJcbiAgICByZXR1cm4gKGtpbmQgPT09IFwiYVwiID8gZi5jYWxsKHJlY2VpdmVyLCB2YWx1ZSkgOiBmID8gZi52YWx1ZSA9IHZhbHVlIDogc3RhdGUuc2V0KHJlY2VpdmVyLCB2YWx1ZSkpLCB2YWx1ZTtcclxufVxyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IGlzZXhlXG5pc2V4ZS5zeW5jID0gc3luY1xuXG52YXIgZnMgPSByZXF1aXJlKCdmcycpXG5cbmZ1bmN0aW9uIGNoZWNrUGF0aEV4dCAocGF0aCwgb3B0aW9ucykge1xuICB2YXIgcGF0aGV4dCA9IG9wdGlvbnMucGF0aEV4dCAhPT0gdW5kZWZpbmVkID9cbiAgICBvcHRpb25zLnBhdGhFeHQgOiBwcm9jZXNzLmVudi5QQVRIRVhUXG5cbiAgaWYgKCFwYXRoZXh0KSB7XG4gICAgcmV0dXJuIHRydWVcbiAgfVxuXG4gIHBhdGhleHQgPSBwYXRoZXh0LnNwbGl0KCc7JylcbiAgaWYgKHBhdGhleHQuaW5kZXhPZignJykgIT09IC0xKSB7XG4gICAgcmV0dXJuIHRydWVcbiAgfVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHBhdGhleHQubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgcCA9IHBhdGhleHRbaV0udG9Mb3dlckNhc2UoKVxuICAgIGlmIChwICYmIHBhdGguc3Vic3RyKC1wLmxlbmd0aCkudG9Mb3dlckNhc2UoKSA9PT0gcCkge1xuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlXG59XG5cbmZ1bmN0aW9uIGNoZWNrU3RhdCAoc3RhdCwgcGF0aCwgb3B0aW9ucykge1xuICBpZiAoIXN0YXQuaXNTeW1ib2xpY0xpbmsoKSAmJiAhc3RhdC5pc0ZpbGUoKSkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG4gIHJldHVybiBjaGVja1BhdGhFeHQocGF0aCwgb3B0aW9ucylcbn1cblxuZnVuY3Rpb24gaXNleGUgKHBhdGgsIG9wdGlvbnMsIGNiKSB7XG4gIGZzLnN0YXQocGF0aCwgZnVuY3Rpb24gKGVyLCBzdGF0KSB7XG4gICAgY2IoZXIsIGVyID8gZmFsc2UgOiBjaGVja1N0YXQoc3RhdCwgcGF0aCwgb3B0aW9ucykpXG4gIH0pXG59XG5cbmZ1bmN0aW9uIHN5bmMgKHBhdGgsIG9wdGlvbnMpIHtcbiAgcmV0dXJuIGNoZWNrU3RhdChmcy5zdGF0U3luYyhwYXRoKSwgcGF0aCwgb3B0aW9ucylcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gaXNleGVcbmlzZXhlLnN5bmMgPSBzeW5jXG5cbnZhciBmcyA9IHJlcXVpcmUoJ2ZzJylcblxuZnVuY3Rpb24gaXNleGUgKHBhdGgsIG9wdGlvbnMsIGNiKSB7XG4gIGZzLnN0YXQocGF0aCwgZnVuY3Rpb24gKGVyLCBzdGF0KSB7XG4gICAgY2IoZXIsIGVyID8gZmFsc2UgOiBjaGVja1N0YXQoc3RhdCwgb3B0aW9ucykpXG4gIH0pXG59XG5cbmZ1bmN0aW9uIHN5bmMgKHBhdGgsIG9wdGlvbnMpIHtcbiAgcmV0dXJuIGNoZWNrU3RhdChmcy5zdGF0U3luYyhwYXRoKSwgb3B0aW9ucylcbn1cblxuZnVuY3Rpb24gY2hlY2tTdGF0IChzdGF0LCBvcHRpb25zKSB7XG4gIHJldHVybiBzdGF0LmlzRmlsZSgpICYmIGNoZWNrTW9kZShzdGF0LCBvcHRpb25zKVxufVxuXG5mdW5jdGlvbiBjaGVja01vZGUgKHN0YXQsIG9wdGlvbnMpIHtcbiAgdmFyIG1vZCA9IHN0YXQubW9kZVxuICB2YXIgdWlkID0gc3RhdC51aWRcbiAgdmFyIGdpZCA9IHN0YXQuZ2lkXG5cbiAgdmFyIG15VWlkID0gb3B0aW9ucy51aWQgIT09IHVuZGVmaW5lZCA/XG4gICAgb3B0aW9ucy51aWQgOiBwcm9jZXNzLmdldHVpZCAmJiBwcm9jZXNzLmdldHVpZCgpXG4gIHZhciBteUdpZCA9IG9wdGlvbnMuZ2lkICE9PSB1bmRlZmluZWQgP1xuICAgIG9wdGlvbnMuZ2lkIDogcHJvY2Vzcy5nZXRnaWQgJiYgcHJvY2Vzcy5nZXRnaWQoKVxuXG4gIHZhciB1ID0gcGFyc2VJbnQoJzEwMCcsIDgpXG4gIHZhciBnID0gcGFyc2VJbnQoJzAxMCcsIDgpXG4gIHZhciBvID0gcGFyc2VJbnQoJzAwMScsIDgpXG4gIHZhciB1ZyA9IHUgfCBnXG5cbiAgdmFyIHJldCA9IChtb2QgJiBvKSB8fFxuICAgIChtb2QgJiBnKSAmJiBnaWQgPT09IG15R2lkIHx8XG4gICAgKG1vZCAmIHUpICYmIHVpZCA9PT0gbXlVaWQgfHxcbiAgICAobW9kICYgdWcpICYmIG15VWlkID09PSAwXG5cbiAgcmV0dXJuIHJldFxufVxuIiwidmFyIGZzID0gcmVxdWlyZSgnZnMnKVxudmFyIGNvcmVcbmlmIChwcm9jZXNzLnBsYXRmb3JtID09PSAnd2luMzInIHx8IGdsb2JhbC5URVNUSU5HX1dJTkRPV1MpIHtcbiAgY29yZSA9IHJlcXVpcmUoJy4vd2luZG93cy5qcycpXG59IGVsc2Uge1xuICBjb3JlID0gcmVxdWlyZSgnLi9tb2RlLmpzJylcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc2V4ZVxuaXNleGUuc3luYyA9IHN5bmNcblxuZnVuY3Rpb24gaXNleGUgKHBhdGgsIG9wdGlvbnMsIGNiKSB7XG4gIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGNiID0gb3B0aW9uc1xuICAgIG9wdGlvbnMgPSB7fVxuICB9XG5cbiAgaWYgKCFjYikge1xuICAgIGlmICh0eXBlb2YgUHJvbWlzZSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignY2FsbGJhY2sgbm90IHByb3ZpZGVkJylcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgaXNleGUocGF0aCwgb3B0aW9ucyB8fCB7fSwgZnVuY3Rpb24gKGVyLCBpcykge1xuICAgICAgICBpZiAoZXIpIHtcbiAgICAgICAgICByZWplY3QoZXIpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzb2x2ZShpcylcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgY29yZShwYXRoLCBvcHRpb25zIHx8IHt9LCBmdW5jdGlvbiAoZXIsIGlzKSB7XG4gICAgLy8gaWdub3JlIEVBQ0NFUyBiZWNhdXNlIHRoYXQganVzdCBtZWFucyB3ZSBhcmVuJ3QgYWxsb3dlZCB0byBydW4gaXRcbiAgICBpZiAoZXIpIHtcbiAgICAgIGlmIChlci5jb2RlID09PSAnRUFDQ0VTJyB8fCBvcHRpb25zICYmIG9wdGlvbnMuaWdub3JlRXJyb3JzKSB7XG4gICAgICAgIGVyID0gbnVsbFxuICAgICAgICBpcyA9IGZhbHNlXG4gICAgICB9XG4gICAgfVxuICAgIGNiKGVyLCBpcylcbiAgfSlcbn1cblxuZnVuY3Rpb24gc3luYyAocGF0aCwgb3B0aW9ucykge1xuICAvLyBteSBraW5nZG9tIGZvciBhIGZpbHRlcmVkIGNhdGNoXG4gIHRyeSB7XG4gICAgcmV0dXJuIGNvcmUuc3luYyhwYXRoLCBvcHRpb25zIHx8IHt9KVxuICB9IGNhdGNoIChlcikge1xuICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMuaWdub3JlRXJyb3JzIHx8IGVyLmNvZGUgPT09ICdFQUNDRVMnKSB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgZXJcbiAgICB9XG4gIH1cbn1cbiIsImNvbnN0IGlzV2luZG93cyA9IHByb2Nlc3MucGxhdGZvcm0gPT09ICd3aW4zMicgfHxcbiAgICBwcm9jZXNzLmVudi5PU1RZUEUgPT09ICdjeWd3aW4nIHx8XG4gICAgcHJvY2Vzcy5lbnYuT1NUWVBFID09PSAnbXN5cydcblxuY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuY29uc3QgQ09MT04gPSBpc1dpbmRvd3MgPyAnOycgOiAnOidcbmNvbnN0IGlzZXhlID0gcmVxdWlyZSgnaXNleGUnKVxuXG5jb25zdCBnZXROb3RGb3VuZEVycm9yID0gKGNtZCkgPT5cbiAgT2JqZWN0LmFzc2lnbihuZXcgRXJyb3IoYG5vdCBmb3VuZDogJHtjbWR9YCksIHsgY29kZTogJ0VOT0VOVCcgfSlcblxuY29uc3QgZ2V0UGF0aEluZm8gPSAoY21kLCBvcHQpID0+IHtcbiAgY29uc3QgY29sb24gPSBvcHQuY29sb24gfHwgQ09MT05cblxuICAvLyBJZiBpdCBoYXMgYSBzbGFzaCwgdGhlbiB3ZSBkb24ndCBib3RoZXIgc2VhcmNoaW5nIHRoZSBwYXRoZW52LlxuICAvLyBqdXN0IGNoZWNrIHRoZSBmaWxlIGl0c2VsZiwgYW5kIHRoYXQncyBpdC5cbiAgY29uc3QgcGF0aEVudiA9IGNtZC5tYXRjaCgvXFwvLykgfHwgaXNXaW5kb3dzICYmIGNtZC5tYXRjaCgvXFxcXC8pID8gWycnXVxuICAgIDogKFxuICAgICAgW1xuICAgICAgICAvLyB3aW5kb3dzIGFsd2F5cyBjaGVja3MgdGhlIGN3ZCBmaXJzdFxuICAgICAgICAuLi4oaXNXaW5kb3dzID8gW3Byb2Nlc3MuY3dkKCldIDogW10pLFxuICAgICAgICAuLi4ob3B0LnBhdGggfHwgcHJvY2Vzcy5lbnYuUEFUSCB8fFxuICAgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0OiB2ZXJ5IHVudXN1YWwgKi8gJycpLnNwbGl0KGNvbG9uKSxcbiAgICAgIF1cbiAgICApXG4gIGNvbnN0IHBhdGhFeHRFeGUgPSBpc1dpbmRvd3NcbiAgICA/IG9wdC5wYXRoRXh0IHx8IHByb2Nlc3MuZW52LlBBVEhFWFQgfHwgJy5FWEU7LkNNRDsuQkFUOy5DT00nXG4gICAgOiAnJ1xuICBjb25zdCBwYXRoRXh0ID0gaXNXaW5kb3dzID8gcGF0aEV4dEV4ZS5zcGxpdChjb2xvbikgOiBbJyddXG5cbiAgaWYgKGlzV2luZG93cykge1xuICAgIGlmIChjbWQuaW5kZXhPZignLicpICE9PSAtMSAmJiBwYXRoRXh0WzBdICE9PSAnJylcbiAgICAgIHBhdGhFeHQudW5zaGlmdCgnJylcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgcGF0aEVudixcbiAgICBwYXRoRXh0LFxuICAgIHBhdGhFeHRFeGUsXG4gIH1cbn1cblxuY29uc3Qgd2hpY2ggPSAoY21kLCBvcHQsIGNiKSA9PiB7XG4gIGlmICh0eXBlb2Ygb3B0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgY2IgPSBvcHRcbiAgICBvcHQgPSB7fVxuICB9XG4gIGlmICghb3B0KVxuICAgIG9wdCA9IHt9XG5cbiAgY29uc3QgeyBwYXRoRW52LCBwYXRoRXh0LCBwYXRoRXh0RXhlIH0gPSBnZXRQYXRoSW5mbyhjbWQsIG9wdClcbiAgY29uc3QgZm91bmQgPSBbXVxuXG4gIGNvbnN0IHN0ZXAgPSBpID0+IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBpZiAoaSA9PT0gcGF0aEVudi5sZW5ndGgpXG4gICAgICByZXR1cm4gb3B0LmFsbCAmJiBmb3VuZC5sZW5ndGggPyByZXNvbHZlKGZvdW5kKVxuICAgICAgICA6IHJlamVjdChnZXROb3RGb3VuZEVycm9yKGNtZCkpXG5cbiAgICBjb25zdCBwcFJhdyA9IHBhdGhFbnZbaV1cbiAgICBjb25zdCBwYXRoUGFydCA9IC9eXCIuKlwiJC8udGVzdChwcFJhdykgPyBwcFJhdy5zbGljZSgxLCAtMSkgOiBwcFJhd1xuXG4gICAgY29uc3QgcENtZCA9IHBhdGguam9pbihwYXRoUGFydCwgY21kKVxuICAgIGNvbnN0IHAgPSAhcGF0aFBhcnQgJiYgL15cXC5bXFxcXFxcL10vLnRlc3QoY21kKSA/IGNtZC5zbGljZSgwLCAyKSArIHBDbWRcbiAgICAgIDogcENtZFxuXG4gICAgcmVzb2x2ZShzdWJTdGVwKHAsIGksIDApKVxuICB9KVxuXG4gIGNvbnN0IHN1YlN0ZXAgPSAocCwgaSwgaWkpID0+IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBpZiAoaWkgPT09IHBhdGhFeHQubGVuZ3RoKVxuICAgICAgcmV0dXJuIHJlc29sdmUoc3RlcChpICsgMSkpXG4gICAgY29uc3QgZXh0ID0gcGF0aEV4dFtpaV1cbiAgICBpc2V4ZShwICsgZXh0LCB7IHBhdGhFeHQ6IHBhdGhFeHRFeGUgfSwgKGVyLCBpcykgPT4ge1xuICAgICAgaWYgKCFlciAmJiBpcykge1xuICAgICAgICBpZiAob3B0LmFsbClcbiAgICAgICAgICBmb3VuZC5wdXNoKHAgKyBleHQpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICByZXR1cm4gcmVzb2x2ZShwICsgZXh0KVxuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc29sdmUoc3ViU3RlcChwLCBpLCBpaSArIDEpKVxuICAgIH0pXG4gIH0pXG5cbiAgcmV0dXJuIGNiID8gc3RlcCgwKS50aGVuKHJlcyA9PiBjYihudWxsLCByZXMpLCBjYikgOiBzdGVwKDApXG59XG5cbmNvbnN0IHdoaWNoU3luYyA9IChjbWQsIG9wdCkgPT4ge1xuICBvcHQgPSBvcHQgfHwge31cblxuICBjb25zdCB7IHBhdGhFbnYsIHBhdGhFeHQsIHBhdGhFeHRFeGUgfSA9IGdldFBhdGhJbmZvKGNtZCwgb3B0KVxuICBjb25zdCBmb3VuZCA9IFtdXG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBwYXRoRW52Lmxlbmd0aDsgaSArKykge1xuICAgIGNvbnN0IHBwUmF3ID0gcGF0aEVudltpXVxuICAgIGNvbnN0IHBhdGhQYXJ0ID0gL15cIi4qXCIkLy50ZXN0KHBwUmF3KSA/IHBwUmF3LnNsaWNlKDEsIC0xKSA6IHBwUmF3XG5cbiAgICBjb25zdCBwQ21kID0gcGF0aC5qb2luKHBhdGhQYXJ0LCBjbWQpXG4gICAgY29uc3QgcCA9ICFwYXRoUGFydCAmJiAvXlxcLltcXFxcXFwvXS8udGVzdChjbWQpID8gY21kLnNsaWNlKDAsIDIpICsgcENtZFxuICAgICAgOiBwQ21kXG5cbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IHBhdGhFeHQubGVuZ3RoOyBqICsrKSB7XG4gICAgICBjb25zdCBjdXIgPSBwICsgcGF0aEV4dFtqXVxuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgaXMgPSBpc2V4ZS5zeW5jKGN1ciwgeyBwYXRoRXh0OiBwYXRoRXh0RXhlIH0pXG4gICAgICAgIGlmIChpcykge1xuICAgICAgICAgIGlmIChvcHQuYWxsKVxuICAgICAgICAgICAgZm91bmQucHVzaChjdXIpXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgcmV0dXJuIGN1clxuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChleCkge31cbiAgICB9XG4gIH1cblxuICBpZiAob3B0LmFsbCAmJiBmb3VuZC5sZW5ndGgpXG4gICAgcmV0dXJuIGZvdW5kXG5cbiAgaWYgKG9wdC5ub3Rocm93KVxuICAgIHJldHVybiBudWxsXG5cbiAgdGhyb3cgZ2V0Tm90Rm91bmRFcnJvcihjbWQpXG59XG5cbm1vZHVsZS5leHBvcnRzID0gd2hpY2hcbndoaWNoLnN5bmMgPSB3aGljaFN5bmNcbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgcGF0aEtleSA9IChvcHRpb25zID0ge30pID0+IHtcblx0Y29uc3QgZW52aXJvbm1lbnQgPSBvcHRpb25zLmVudiB8fCBwcm9jZXNzLmVudjtcblx0Y29uc3QgcGxhdGZvcm0gPSBvcHRpb25zLnBsYXRmb3JtIHx8IHByb2Nlc3MucGxhdGZvcm07XG5cblx0aWYgKHBsYXRmb3JtICE9PSAnd2luMzInKSB7XG5cdFx0cmV0dXJuICdQQVRIJztcblx0fVxuXG5cdHJldHVybiBPYmplY3Qua2V5cyhlbnZpcm9ubWVudCkucmV2ZXJzZSgpLmZpbmQoa2V5ID0+IGtleS50b1VwcGVyQ2FzZSgpID09PSAnUEFUSCcpIHx8ICdQYXRoJztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gcGF0aEtleTtcbi8vIFRPRE86IFJlbW92ZSB0aGlzIGZvciB0aGUgbmV4dCBtYWpvciByZWxlYXNlXG5tb2R1bGUuZXhwb3J0cy5kZWZhdWx0ID0gcGF0aEtleTtcbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcbmNvbnN0IHdoaWNoID0gcmVxdWlyZSgnd2hpY2gnKTtcbmNvbnN0IGdldFBhdGhLZXkgPSByZXF1aXJlKCdwYXRoLWtleScpO1xuXG5mdW5jdGlvbiByZXNvbHZlQ29tbWFuZEF0dGVtcHQocGFyc2VkLCB3aXRob3V0UGF0aEV4dCkge1xuICAgIGNvbnN0IGVudiA9IHBhcnNlZC5vcHRpb25zLmVudiB8fCBwcm9jZXNzLmVudjtcbiAgICBjb25zdCBjd2QgPSBwcm9jZXNzLmN3ZCgpO1xuICAgIGNvbnN0IGhhc0N1c3RvbUN3ZCA9IHBhcnNlZC5vcHRpb25zLmN3ZCAhPSBudWxsO1xuICAgIC8vIFdvcmtlciB0aHJlYWRzIGRvIG5vdCBoYXZlIHByb2Nlc3MuY2hkaXIoKVxuICAgIGNvbnN0IHNob3VsZFN3aXRjaEN3ZCA9IGhhc0N1c3RvbUN3ZCAmJiBwcm9jZXNzLmNoZGlyICE9PSB1bmRlZmluZWQgJiYgIXByb2Nlc3MuY2hkaXIuZGlzYWJsZWQ7XG5cbiAgICAvLyBJZiBhIGN1c3RvbSBgY3dkYCB3YXMgc3BlY2lmaWVkLCB3ZSBuZWVkIHRvIGNoYW5nZSB0aGUgcHJvY2VzcyBjd2RcbiAgICAvLyBiZWNhdXNlIGB3aGljaGAgd2lsbCBkbyBzdGF0IGNhbGxzIGJ1dCBkb2VzIG5vdCBzdXBwb3J0IGEgY3VzdG9tIGN3ZFxuICAgIGlmIChzaG91bGRTd2l0Y2hDd2QpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHByb2Nlc3MuY2hkaXIocGFyc2VkLm9wdGlvbnMuY3dkKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAvKiBFbXB0eSAqL1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbGV0IHJlc29sdmVkO1xuXG4gICAgdHJ5IHtcbiAgICAgICAgcmVzb2x2ZWQgPSB3aGljaC5zeW5jKHBhcnNlZC5jb21tYW5kLCB7XG4gICAgICAgICAgICBwYXRoOiBlbnZbZ2V0UGF0aEtleSh7IGVudiB9KV0sXG4gICAgICAgICAgICBwYXRoRXh0OiB3aXRob3V0UGF0aEV4dCA/IHBhdGguZGVsaW1pdGVyIDogdW5kZWZpbmVkLFxuICAgICAgICB9KTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8qIEVtcHR5ICovXG4gICAgfSBmaW5hbGx5IHtcbiAgICAgICAgaWYgKHNob3VsZFN3aXRjaEN3ZCkge1xuICAgICAgICAgICAgcHJvY2Vzcy5jaGRpcihjd2QpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gSWYgd2Ugc3VjY2Vzc2Z1bGx5IHJlc29sdmVkLCBlbnN1cmUgdGhhdCBhbiBhYnNvbHV0ZSBwYXRoIGlzIHJldHVybmVkXG4gICAgLy8gTm90ZSB0aGF0IHdoZW4gYSBjdXN0b20gYGN3ZGAgd2FzIHVzZWQsIHdlIG5lZWQgdG8gcmVzb2x2ZSB0byBhbiBhYnNvbHV0ZSBwYXRoIGJhc2VkIG9uIGl0XG4gICAgaWYgKHJlc29sdmVkKSB7XG4gICAgICAgIHJlc29sdmVkID0gcGF0aC5yZXNvbHZlKGhhc0N1c3RvbUN3ZCA/IHBhcnNlZC5vcHRpb25zLmN3ZCA6ICcnLCByZXNvbHZlZCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc29sdmVkO1xufVxuXG5mdW5jdGlvbiByZXNvbHZlQ29tbWFuZChwYXJzZWQpIHtcbiAgICByZXR1cm4gcmVzb2x2ZUNvbW1hbmRBdHRlbXB0KHBhcnNlZCkgfHwgcmVzb2x2ZUNvbW1hbmRBdHRlbXB0KHBhcnNlZCwgdHJ1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcmVzb2x2ZUNvbW1hbmQ7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIFNlZSBodHRwOi8vd3d3LnJvYnZhbmRlcndvdWRlLmNvbS9lc2NhcGVjaGFycy5waHBcbmNvbnN0IG1ldGFDaGFyc1JlZ0V4cCA9IC8oWygpXFxdWyUhXlwiYDw+Jnw7LCAqP10pL2c7XG5cbmZ1bmN0aW9uIGVzY2FwZUNvbW1hbmQoYXJnKSB7XG4gICAgLy8gRXNjYXBlIG1ldGEgY2hhcnNcbiAgICBhcmcgPSBhcmcucmVwbGFjZShtZXRhQ2hhcnNSZWdFeHAsICdeJDEnKTtcblxuICAgIHJldHVybiBhcmc7XG59XG5cbmZ1bmN0aW9uIGVzY2FwZUFyZ3VtZW50KGFyZywgZG91YmxlRXNjYXBlTWV0YUNoYXJzKSB7XG4gICAgLy8gQ29udmVydCB0byBzdHJpbmdcbiAgICBhcmcgPSBgJHthcmd9YDtcblxuICAgIC8vIEFsZ29yaXRobSBiZWxvdyBpcyBiYXNlZCBvbiBodHRwczovL3FudG0ub3JnL2NtZFxuXG4gICAgLy8gU2VxdWVuY2Ugb2YgYmFja3NsYXNoZXMgZm9sbG93ZWQgYnkgYSBkb3VibGUgcXVvdGU6XG4gICAgLy8gZG91YmxlIHVwIGFsbCB0aGUgYmFja3NsYXNoZXMgYW5kIGVzY2FwZSB0aGUgZG91YmxlIHF1b3RlXG4gICAgYXJnID0gYXJnLnJlcGxhY2UoLyhcXFxcKilcIi9nLCAnJDEkMVxcXFxcIicpO1xuXG4gICAgLy8gU2VxdWVuY2Ugb2YgYmFja3NsYXNoZXMgZm9sbG93ZWQgYnkgdGhlIGVuZCBvZiB0aGUgc3RyaW5nXG4gICAgLy8gKHdoaWNoIHdpbGwgYmVjb21lIGEgZG91YmxlIHF1b3RlIGxhdGVyKTpcbiAgICAvLyBkb3VibGUgdXAgYWxsIHRoZSBiYWNrc2xhc2hlc1xuICAgIGFyZyA9IGFyZy5yZXBsYWNlKC8oXFxcXCopJC8sICckMSQxJyk7XG5cbiAgICAvLyBBbGwgb3RoZXIgYmFja3NsYXNoZXMgb2NjdXIgbGl0ZXJhbGx5XG5cbiAgICAvLyBRdW90ZSB0aGUgd2hvbGUgdGhpbmc6XG4gICAgYXJnID0gYFwiJHthcmd9XCJgO1xuXG4gICAgLy8gRXNjYXBlIG1ldGEgY2hhcnNcbiAgICBhcmcgPSBhcmcucmVwbGFjZShtZXRhQ2hhcnNSZWdFeHAsICdeJDEnKTtcblxuICAgIC8vIERvdWJsZSBlc2NhcGUgbWV0YSBjaGFycyBpZiBuZWNlc3NhcnlcbiAgICBpZiAoZG91YmxlRXNjYXBlTWV0YUNoYXJzKSB7XG4gICAgICAgIGFyZyA9IGFyZy5yZXBsYWNlKG1ldGFDaGFyc1JlZ0V4cCwgJ14kMScpO1xuICAgIH1cblxuICAgIHJldHVybiBhcmc7XG59XG5cbm1vZHVsZS5leHBvcnRzLmNvbW1hbmQgPSBlc2NhcGVDb21tYW5kO1xubW9kdWxlLmV4cG9ydHMuYXJndW1lbnQgPSBlc2NhcGVBcmd1bWVudDtcbiIsIid1c2Ugc3RyaWN0Jztcbm1vZHVsZS5leHBvcnRzID0gL14jISguKikvO1xuIiwiJ3VzZSBzdHJpY3QnO1xuY29uc3Qgc2hlYmFuZ1JlZ2V4ID0gcmVxdWlyZSgnc2hlYmFuZy1yZWdleCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IChzdHJpbmcgPSAnJykgPT4ge1xuXHRjb25zdCBtYXRjaCA9IHN0cmluZy5tYXRjaChzaGViYW5nUmVnZXgpO1xuXG5cdGlmICghbWF0Y2gpIHtcblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXG5cdGNvbnN0IFtwYXRoLCBhcmd1bWVudF0gPSBtYXRjaFswXS5yZXBsYWNlKC8jISA/LywgJycpLnNwbGl0KCcgJyk7XG5cdGNvbnN0IGJpbmFyeSA9IHBhdGguc3BsaXQoJy8nKS5wb3AoKTtcblxuXHRpZiAoYmluYXJ5ID09PSAnZW52Jykge1xuXHRcdHJldHVybiBhcmd1bWVudDtcblx0fVxuXG5cdHJldHVybiBhcmd1bWVudCA/IGAke2JpbmFyeX0gJHthcmd1bWVudH1gIDogYmluYXJ5O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgZnMgPSByZXF1aXJlKCdmcycpO1xuY29uc3Qgc2hlYmFuZ0NvbW1hbmQgPSByZXF1aXJlKCdzaGViYW5nLWNvbW1hbmQnKTtcblxuZnVuY3Rpb24gcmVhZFNoZWJhbmcoY29tbWFuZCkge1xuICAgIC8vIFJlYWQgdGhlIGZpcnN0IDE1MCBieXRlcyBmcm9tIHRoZSBmaWxlXG4gICAgY29uc3Qgc2l6ZSA9IDE1MDtcbiAgICBjb25zdCBidWZmZXIgPSBCdWZmZXIuYWxsb2Moc2l6ZSk7XG5cbiAgICBsZXQgZmQ7XG5cbiAgICB0cnkge1xuICAgICAgICBmZCA9IGZzLm9wZW5TeW5jKGNvbW1hbmQsICdyJyk7XG4gICAgICAgIGZzLnJlYWRTeW5jKGZkLCBidWZmZXIsIDAsIHNpemUsIDApO1xuICAgICAgICBmcy5jbG9zZVN5bmMoZmQpO1xuICAgIH0gY2F0Y2ggKGUpIHsgLyogRW1wdHkgKi8gfVxuXG4gICAgLy8gQXR0ZW1wdCB0byBleHRyYWN0IHNoZWJhbmcgKG51bGwgaXMgcmV0dXJuZWQgaWYgbm90IGEgc2hlYmFuZylcbiAgICByZXR1cm4gc2hlYmFuZ0NvbW1hbmQoYnVmZmVyLnRvU3RyaW5nKCkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHJlYWRTaGViYW5nO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuY29uc3QgcmVzb2x2ZUNvbW1hbmQgPSByZXF1aXJlKCcuL3V0aWwvcmVzb2x2ZUNvbW1hbmQnKTtcbmNvbnN0IGVzY2FwZSA9IHJlcXVpcmUoJy4vdXRpbC9lc2NhcGUnKTtcbmNvbnN0IHJlYWRTaGViYW5nID0gcmVxdWlyZSgnLi91dGlsL3JlYWRTaGViYW5nJyk7XG5cbmNvbnN0IGlzV2luID0gcHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ3dpbjMyJztcbmNvbnN0IGlzRXhlY3V0YWJsZVJlZ0V4cCA9IC9cXC4oPzpjb218ZXhlKSQvaTtcbmNvbnN0IGlzQ21kU2hpbVJlZ0V4cCA9IC9ub2RlX21vZHVsZXNbXFxcXC9dLmJpbltcXFxcL11bXlxcXFwvXStcXC5jbWQkL2k7XG5cbmZ1bmN0aW9uIGRldGVjdFNoZWJhbmcocGFyc2VkKSB7XG4gICAgcGFyc2VkLmZpbGUgPSByZXNvbHZlQ29tbWFuZChwYXJzZWQpO1xuXG4gICAgY29uc3Qgc2hlYmFuZyA9IHBhcnNlZC5maWxlICYmIHJlYWRTaGViYW5nKHBhcnNlZC5maWxlKTtcblxuICAgIGlmIChzaGViYW5nKSB7XG4gICAgICAgIHBhcnNlZC5hcmdzLnVuc2hpZnQocGFyc2VkLmZpbGUpO1xuICAgICAgICBwYXJzZWQuY29tbWFuZCA9IHNoZWJhbmc7XG5cbiAgICAgICAgcmV0dXJuIHJlc29sdmVDb21tYW5kKHBhcnNlZCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHBhcnNlZC5maWxlO1xufVxuXG5mdW5jdGlvbiBwYXJzZU5vblNoZWxsKHBhcnNlZCkge1xuICAgIGlmICghaXNXaW4pIHtcbiAgICAgICAgcmV0dXJuIHBhcnNlZDtcbiAgICB9XG5cbiAgICAvLyBEZXRlY3QgJiBhZGQgc3VwcG9ydCBmb3Igc2hlYmFuZ3NcbiAgICBjb25zdCBjb21tYW5kRmlsZSA9IGRldGVjdFNoZWJhbmcocGFyc2VkKTtcblxuICAgIC8vIFdlIGRvbid0IG5lZWQgYSBzaGVsbCBpZiB0aGUgY29tbWFuZCBmaWxlbmFtZSBpcyBhbiBleGVjdXRhYmxlXG4gICAgY29uc3QgbmVlZHNTaGVsbCA9ICFpc0V4ZWN1dGFibGVSZWdFeHAudGVzdChjb21tYW5kRmlsZSk7XG5cbiAgICAvLyBJZiBhIHNoZWxsIGlzIHJlcXVpcmVkLCB1c2UgY21kLmV4ZSBhbmQgdGFrZSBjYXJlIG9mIGVzY2FwaW5nIGV2ZXJ5dGhpbmcgY29ycmVjdGx5XG4gICAgLy8gTm90ZSB0aGF0IGBmb3JjZVNoZWxsYCBpcyBhbiBoaWRkZW4gb3B0aW9uIHVzZWQgb25seSBpbiB0ZXN0c1xuICAgIGlmIChwYXJzZWQub3B0aW9ucy5mb3JjZVNoZWxsIHx8IG5lZWRzU2hlbGwpIHtcbiAgICAgICAgLy8gTmVlZCB0byBkb3VibGUgZXNjYXBlIG1ldGEgY2hhcnMgaWYgdGhlIGNvbW1hbmQgaXMgYSBjbWQtc2hpbSBsb2NhdGVkIGluIGBub2RlX21vZHVsZXMvLmJpbi9gXG4gICAgICAgIC8vIFRoZSBjbWQtc2hpbSBzaW1wbHkgY2FsbHMgZXhlY3V0ZSB0aGUgcGFja2FnZSBiaW4gZmlsZSB3aXRoIE5vZGVKUywgcHJveHlpbmcgYW55IGFyZ3VtZW50XG4gICAgICAgIC8vIEJlY2F1c2UgdGhlIGVzY2FwZSBvZiBtZXRhY2hhcnMgd2l0aCBeIGdldHMgaW50ZXJwcmV0ZWQgd2hlbiB0aGUgY21kLmV4ZSBpcyBmaXJzdCBjYWxsZWQsXG4gICAgICAgIC8vIHdlIG5lZWQgdG8gZG91YmxlIGVzY2FwZSB0aGVtXG4gICAgICAgIGNvbnN0IG5lZWRzRG91YmxlRXNjYXBlTWV0YUNoYXJzID0gaXNDbWRTaGltUmVnRXhwLnRlc3QoY29tbWFuZEZpbGUpO1xuXG4gICAgICAgIC8vIE5vcm1hbGl6ZSBwb3NpeCBwYXRocyBpbnRvIE9TIGNvbXBhdGlibGUgcGF0aHMgKGUuZy46IGZvby9iYXIgLT4gZm9vXFxiYXIpXG4gICAgICAgIC8vIFRoaXMgaXMgbmVjZXNzYXJ5IG90aGVyd2lzZSBpdCB3aWxsIGFsd2F5cyBmYWlsIHdpdGggRU5PRU5UIGluIHRob3NlIGNhc2VzXG4gICAgICAgIHBhcnNlZC5jb21tYW5kID0gcGF0aC5ub3JtYWxpemUocGFyc2VkLmNvbW1hbmQpO1xuXG4gICAgICAgIC8vIEVzY2FwZSBjb21tYW5kICYgYXJndW1lbnRzXG4gICAgICAgIHBhcnNlZC5jb21tYW5kID0gZXNjYXBlLmNvbW1hbmQocGFyc2VkLmNvbW1hbmQpO1xuICAgICAgICBwYXJzZWQuYXJncyA9IHBhcnNlZC5hcmdzLm1hcCgoYXJnKSA9PiBlc2NhcGUuYXJndW1lbnQoYXJnLCBuZWVkc0RvdWJsZUVzY2FwZU1ldGFDaGFycykpO1xuXG4gICAgICAgIGNvbnN0IHNoZWxsQ29tbWFuZCA9IFtwYXJzZWQuY29tbWFuZF0uY29uY2F0KHBhcnNlZC5hcmdzKS5qb2luKCcgJyk7XG5cbiAgICAgICAgcGFyc2VkLmFyZ3MgPSBbJy9kJywgJy9zJywgJy9jJywgYFwiJHtzaGVsbENvbW1hbmR9XCJgXTtcbiAgICAgICAgcGFyc2VkLmNvbW1hbmQgPSBwcm9jZXNzLmVudi5jb21zcGVjIHx8ICdjbWQuZXhlJztcbiAgICAgICAgcGFyc2VkLm9wdGlvbnMud2luZG93c1ZlcmJhdGltQXJndW1lbnRzID0gdHJ1ZTsgLy8gVGVsbCBub2RlJ3Mgc3Bhd24gdGhhdCB0aGUgYXJndW1lbnRzIGFyZSBhbHJlYWR5IGVzY2FwZWRcbiAgICB9XG5cbiAgICByZXR1cm4gcGFyc2VkO1xufVxuXG5mdW5jdGlvbiBwYXJzZShjb21tYW5kLCBhcmdzLCBvcHRpb25zKSB7XG4gICAgLy8gTm9ybWFsaXplIGFyZ3VtZW50cywgc2ltaWxhciB0byBub2RlanNcbiAgICBpZiAoYXJncyAmJiAhQXJyYXkuaXNBcnJheShhcmdzKSkge1xuICAgICAgICBvcHRpb25zID0gYXJncztcbiAgICAgICAgYXJncyA9IG51bGw7XG4gICAgfVxuXG4gICAgYXJncyA9IGFyZ3MgPyBhcmdzLnNsaWNlKDApIDogW107IC8vIENsb25lIGFycmF5IHRvIGF2b2lkIGNoYW5naW5nIHRoZSBvcmlnaW5hbFxuICAgIG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zKTsgLy8gQ2xvbmUgb2JqZWN0IHRvIGF2b2lkIGNoYW5naW5nIHRoZSBvcmlnaW5hbFxuXG4gICAgLy8gQnVpbGQgb3VyIHBhcnNlZCBvYmplY3RcbiAgICBjb25zdCBwYXJzZWQgPSB7XG4gICAgICAgIGNvbW1hbmQsXG4gICAgICAgIGFyZ3MsXG4gICAgICAgIG9wdGlvbnMsXG4gICAgICAgIGZpbGU6IHVuZGVmaW5lZCxcbiAgICAgICAgb3JpZ2luYWw6IHtcbiAgICAgICAgICAgIGNvbW1hbmQsXG4gICAgICAgICAgICBhcmdzLFxuICAgICAgICB9LFxuICAgIH07XG5cbiAgICAvLyBEZWxlZ2F0ZSBmdXJ0aGVyIHBhcnNpbmcgdG8gc2hlbGwgb3Igbm9uLXNoZWxsXG4gICAgcmV0dXJuIG9wdGlvbnMuc2hlbGwgPyBwYXJzZWQgOiBwYXJzZU5vblNoZWxsKHBhcnNlZCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcGFyc2U7XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IGlzV2luID0gcHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ3dpbjMyJztcblxuZnVuY3Rpb24gbm90Rm91bmRFcnJvcihvcmlnaW5hbCwgc3lzY2FsbCkge1xuICAgIHJldHVybiBPYmplY3QuYXNzaWduKG5ldyBFcnJvcihgJHtzeXNjYWxsfSAke29yaWdpbmFsLmNvbW1hbmR9IEVOT0VOVGApLCB7XG4gICAgICAgIGNvZGU6ICdFTk9FTlQnLFxuICAgICAgICBlcnJubzogJ0VOT0VOVCcsXG4gICAgICAgIHN5c2NhbGw6IGAke3N5c2NhbGx9ICR7b3JpZ2luYWwuY29tbWFuZH1gLFxuICAgICAgICBwYXRoOiBvcmlnaW5hbC5jb21tYW5kLFxuICAgICAgICBzcGF3bmFyZ3M6IG9yaWdpbmFsLmFyZ3MsXG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGhvb2tDaGlsZFByb2Nlc3MoY3AsIHBhcnNlZCkge1xuICAgIGlmICghaXNXaW4pIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IG9yaWdpbmFsRW1pdCA9IGNwLmVtaXQ7XG5cbiAgICBjcC5lbWl0ID0gZnVuY3Rpb24gKG5hbWUsIGFyZzEpIHtcbiAgICAgICAgLy8gSWYgZW1pdHRpbmcgXCJleGl0XCIgZXZlbnQgYW5kIGV4aXQgY29kZSBpcyAxLCB3ZSBuZWVkIHRvIGNoZWNrIGlmXG4gICAgICAgIC8vIHRoZSBjb21tYW5kIGV4aXN0cyBhbmQgZW1pdCBhbiBcImVycm9yXCIgaW5zdGVhZFxuICAgICAgICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL0luZGlnb1VuaXRlZC9ub2RlLWNyb3NzLXNwYXduL2lzc3Vlcy8xNlxuICAgICAgICBpZiAobmFtZSA9PT0gJ2V4aXQnKSB7XG4gICAgICAgICAgICBjb25zdCBlcnIgPSB2ZXJpZnlFTk9FTlQoYXJnMSwgcGFyc2VkLCAnc3Bhd24nKTtcblxuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgIHJldHVybiBvcmlnaW5hbEVtaXQuY2FsbChjcCwgJ2Vycm9yJywgZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBvcmlnaW5hbEVtaXQuYXBwbHkoY3AsIGFyZ3VtZW50cyk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgcHJlZmVyLXJlc3QtcGFyYW1zXG4gICAgfTtcbn1cblxuZnVuY3Rpb24gdmVyaWZ5RU5PRU5UKHN0YXR1cywgcGFyc2VkKSB7XG4gICAgaWYgKGlzV2luICYmIHN0YXR1cyA9PT0gMSAmJiAhcGFyc2VkLmZpbGUpIHtcbiAgICAgICAgcmV0dXJuIG5vdEZvdW5kRXJyb3IocGFyc2VkLm9yaWdpbmFsLCAnc3Bhd24nKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbn1cblxuZnVuY3Rpb24gdmVyaWZ5RU5PRU5UU3luYyhzdGF0dXMsIHBhcnNlZCkge1xuICAgIGlmIChpc1dpbiAmJiBzdGF0dXMgPT09IDEgJiYgIXBhcnNlZC5maWxlKSB7XG4gICAgICAgIHJldHVybiBub3RGb3VuZEVycm9yKHBhcnNlZC5vcmlnaW5hbCwgJ3NwYXduU3luYycpO1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBob29rQ2hpbGRQcm9jZXNzLFxuICAgIHZlcmlmeUVOT0VOVCxcbiAgICB2ZXJpZnlFTk9FTlRTeW5jLFxuICAgIG5vdEZvdW5kRXJyb3IsXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBjcCA9IHJlcXVpcmUoJ2NoaWxkX3Byb2Nlc3MnKTtcbmNvbnN0IHBhcnNlID0gcmVxdWlyZSgnLi9saWIvcGFyc2UnKTtcbmNvbnN0IGVub2VudCA9IHJlcXVpcmUoJy4vbGliL2Vub2VudCcpO1xuXG5mdW5jdGlvbiBzcGF3bihjb21tYW5kLCBhcmdzLCBvcHRpb25zKSB7XG4gICAgLy8gUGFyc2UgdGhlIGFyZ3VtZW50c1xuICAgIGNvbnN0IHBhcnNlZCA9IHBhcnNlKGNvbW1hbmQsIGFyZ3MsIG9wdGlvbnMpO1xuXG4gICAgLy8gU3Bhd24gdGhlIGNoaWxkIHByb2Nlc3NcbiAgICBjb25zdCBzcGF3bmVkID0gY3Auc3Bhd24ocGFyc2VkLmNvbW1hbmQsIHBhcnNlZC5hcmdzLCBwYXJzZWQub3B0aW9ucyk7XG5cbiAgICAvLyBIb29rIGludG8gY2hpbGQgcHJvY2VzcyBcImV4aXRcIiBldmVudCB0byBlbWl0IGFuIGVycm9yIGlmIHRoZSBjb21tYW5kXG4gICAgLy8gZG9lcyBub3QgZXhpc3RzLCBzZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9JbmRpZ29Vbml0ZWQvbm9kZS1jcm9zcy1zcGF3bi9pc3N1ZXMvMTZcbiAgICBlbm9lbnQuaG9va0NoaWxkUHJvY2VzcyhzcGF3bmVkLCBwYXJzZWQpO1xuXG4gICAgcmV0dXJuIHNwYXduZWQ7XG59XG5cbmZ1bmN0aW9uIHNwYXduU3luYyhjb21tYW5kLCBhcmdzLCBvcHRpb25zKSB7XG4gICAgLy8gUGFyc2UgdGhlIGFyZ3VtZW50c1xuICAgIGNvbnN0IHBhcnNlZCA9IHBhcnNlKGNvbW1hbmQsIGFyZ3MsIG9wdGlvbnMpO1xuXG4gICAgLy8gU3Bhd24gdGhlIGNoaWxkIHByb2Nlc3NcbiAgICBjb25zdCByZXN1bHQgPSBjcC5zcGF3blN5bmMocGFyc2VkLmNvbW1hbmQsIHBhcnNlZC5hcmdzLCBwYXJzZWQub3B0aW9ucyk7XG5cbiAgICAvLyBBbmFseXplIGlmIHRoZSBjb21tYW5kIGRvZXMgbm90IGV4aXN0LCBzZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9JbmRpZ29Vbml0ZWQvbm9kZS1jcm9zcy1zcGF3bi9pc3N1ZXMvMTZcbiAgICByZXN1bHQuZXJyb3IgPSByZXN1bHQuZXJyb3IgfHwgZW5vZW50LnZlcmlmeUVOT0VOVFN5bmMocmVzdWx0LnN0YXR1cywgcGFyc2VkKTtcblxuICAgIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3Bhd247XG5tb2R1bGUuZXhwb3J0cy5zcGF3biA9IHNwYXduO1xubW9kdWxlLmV4cG9ydHMuc3luYyA9IHNwYXduU3luYztcblxubW9kdWxlLmV4cG9ydHMuX3BhcnNlID0gcGFyc2U7XG5tb2R1bGUuZXhwb3J0cy5fZW5vZW50ID0gZW5vZW50O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlucHV0ID0+IHtcblx0Y29uc3QgTEYgPSB0eXBlb2YgaW5wdXQgPT09ICdzdHJpbmcnID8gJ1xcbicgOiAnXFxuJy5jaGFyQ29kZUF0KCk7XG5cdGNvbnN0IENSID0gdHlwZW9mIGlucHV0ID09PSAnc3RyaW5nJyA/ICdcXHInIDogJ1xccicuY2hhckNvZGVBdCgpO1xuXG5cdGlmIChpbnB1dFtpbnB1dC5sZW5ndGggLSAxXSA9PT0gTEYpIHtcblx0XHRpbnB1dCA9IGlucHV0LnNsaWNlKDAsIGlucHV0Lmxlbmd0aCAtIDEpO1xuXHR9XG5cblx0aWYgKGlucHV0W2lucHV0Lmxlbmd0aCAtIDFdID09PSBDUikge1xuXHRcdGlucHV0ID0gaW5wdXQuc2xpY2UoMCwgaW5wdXQubGVuZ3RoIC0gMSk7XG5cdH1cblxuXHRyZXR1cm4gaW5wdXQ7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcbmNvbnN0IHBhdGhLZXkgPSByZXF1aXJlKCdwYXRoLWtleScpO1xuXG5jb25zdCBucG1SdW5QYXRoID0gb3B0aW9ucyA9PiB7XG5cdG9wdGlvbnMgPSB7XG5cdFx0Y3dkOiBwcm9jZXNzLmN3ZCgpLFxuXHRcdHBhdGg6IHByb2Nlc3MuZW52W3BhdGhLZXkoKV0sXG5cdFx0ZXhlY1BhdGg6IHByb2Nlc3MuZXhlY1BhdGgsXG5cdFx0Li4ub3B0aW9uc1xuXHR9O1xuXG5cdGxldCBwcmV2aW91cztcblx0bGV0IGN3ZFBhdGggPSBwYXRoLnJlc29sdmUob3B0aW9ucy5jd2QpO1xuXHRjb25zdCByZXN1bHQgPSBbXTtcblxuXHR3aGlsZSAocHJldmlvdXMgIT09IGN3ZFBhdGgpIHtcblx0XHRyZXN1bHQucHVzaChwYXRoLmpvaW4oY3dkUGF0aCwgJ25vZGVfbW9kdWxlcy8uYmluJykpO1xuXHRcdHByZXZpb3VzID0gY3dkUGF0aDtcblx0XHRjd2RQYXRoID0gcGF0aC5yZXNvbHZlKGN3ZFBhdGgsICcuLicpO1xuXHR9XG5cblx0Ly8gRW5zdXJlIHRoZSBydW5uaW5nIGBub2RlYCBiaW5hcnkgaXMgdXNlZFxuXHRjb25zdCBleGVjUGF0aERpciA9IHBhdGgucmVzb2x2ZShvcHRpb25zLmN3ZCwgb3B0aW9ucy5leGVjUGF0aCwgJy4uJyk7XG5cdHJlc3VsdC5wdXNoKGV4ZWNQYXRoRGlyKTtcblxuXHRyZXR1cm4gcmVzdWx0LmNvbmNhdChvcHRpb25zLnBhdGgpLmpvaW4ocGF0aC5kZWxpbWl0ZXIpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBucG1SdW5QYXRoO1xuLy8gVE9ETzogUmVtb3ZlIHRoaXMgZm9yIHRoZSBuZXh0IG1ham9yIHJlbGVhc2Vcbm1vZHVsZS5leHBvcnRzLmRlZmF1bHQgPSBucG1SdW5QYXRoO1xuXG5tb2R1bGUuZXhwb3J0cy5lbnYgPSBvcHRpb25zID0+IHtcblx0b3B0aW9ucyA9IHtcblx0XHRlbnY6IHByb2Nlc3MuZW52LFxuXHRcdC4uLm9wdGlvbnNcblx0fTtcblxuXHRjb25zdCBlbnYgPSB7Li4ub3B0aW9ucy5lbnZ9O1xuXHRjb25zdCBwYXRoID0gcGF0aEtleSh7ZW52fSk7XG5cblx0b3B0aW9ucy5wYXRoID0gZW52W3BhdGhdO1xuXHRlbnZbcGF0aF0gPSBtb2R1bGUuZXhwb3J0cyhvcHRpb25zKTtcblxuXHRyZXR1cm4gZW52O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgbWltaWNGbiA9ICh0bywgZnJvbSkgPT4ge1xuXHRmb3IgKGNvbnN0IHByb3Agb2YgUmVmbGVjdC5vd25LZXlzKGZyb20pKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KHRvLCBwcm9wLCBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGZyb20sIHByb3ApKTtcblx0fVxuXG5cdHJldHVybiB0bztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gbWltaWNGbjtcbi8vIFRPRE86IFJlbW92ZSB0aGlzIGZvciB0aGUgbmV4dCBtYWpvciByZWxlYXNlXG5tb2R1bGUuZXhwb3J0cy5kZWZhdWx0ID0gbWltaWNGbjtcbiIsIid1c2Ugc3RyaWN0JztcbmNvbnN0IG1pbWljRm4gPSByZXF1aXJlKCdtaW1pYy1mbicpO1xuXG5jb25zdCBjYWxsZWRGdW5jdGlvbnMgPSBuZXcgV2Vha01hcCgpO1xuXG5jb25zdCBvbmV0aW1lID0gKGZ1bmN0aW9uXywgb3B0aW9ucyA9IHt9KSA9PiB7XG5cdGlmICh0eXBlb2YgZnVuY3Rpb25fICE9PSAnZnVuY3Rpb24nKSB7XG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignRXhwZWN0ZWQgYSBmdW5jdGlvbicpO1xuXHR9XG5cblx0bGV0IHJldHVyblZhbHVlO1xuXHRsZXQgY2FsbENvdW50ID0gMDtcblx0Y29uc3QgZnVuY3Rpb25OYW1lID0gZnVuY3Rpb25fLmRpc3BsYXlOYW1lIHx8IGZ1bmN0aW9uXy5uYW1lIHx8ICc8YW5vbnltb3VzPic7XG5cblx0Y29uc3Qgb25ldGltZSA9IGZ1bmN0aW9uICguLi5hcmd1bWVudHNfKSB7XG5cdFx0Y2FsbGVkRnVuY3Rpb25zLnNldChvbmV0aW1lLCArK2NhbGxDb3VudCk7XG5cblx0XHRpZiAoY2FsbENvdW50ID09PSAxKSB7XG5cdFx0XHRyZXR1cm5WYWx1ZSA9IGZ1bmN0aW9uXy5hcHBseSh0aGlzLCBhcmd1bWVudHNfKTtcblx0XHRcdGZ1bmN0aW9uXyA9IG51bGw7XG5cdFx0fSBlbHNlIGlmIChvcHRpb25zLnRocm93ID09PSB0cnVlKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEZ1bmN0aW9uIFxcYCR7ZnVuY3Rpb25OYW1lfVxcYCBjYW4gb25seSBiZSBjYWxsZWQgb25jZWApO1xuXHRcdH1cblxuXHRcdHJldHVybiByZXR1cm5WYWx1ZTtcblx0fTtcblxuXHRtaW1pY0ZuKG9uZXRpbWUsIGZ1bmN0aW9uXyk7XG5cdGNhbGxlZEZ1bmN0aW9ucy5zZXQob25ldGltZSwgY2FsbENvdW50KTtcblxuXHRyZXR1cm4gb25ldGltZTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gb25ldGltZTtcbi8vIFRPRE86IFJlbW92ZSB0aGlzIGZvciB0aGUgbmV4dCBtYWpvciByZWxlYXNlXG5tb2R1bGUuZXhwb3J0cy5kZWZhdWx0ID0gb25ldGltZTtcblxubW9kdWxlLmV4cG9ydHMuY2FsbENvdW50ID0gZnVuY3Rpb25fID0+IHtcblx0aWYgKCFjYWxsZWRGdW5jdGlvbnMuaGFzKGZ1bmN0aW9uXykpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoYFRoZSBnaXZlbiBmdW5jdGlvbiBcXGAke2Z1bmN0aW9uXy5uYW1lfVxcYCBpcyBub3Qgd3JhcHBlZCBieSB0aGUgXFxgb25ldGltZVxcYCBwYWNrYWdlYCk7XG5cdH1cblxuXHRyZXR1cm4gY2FsbGVkRnVuY3Rpb25zLmdldChmdW5jdGlvbl8pO1xufTtcbiIsIlwidXNlIHN0cmljdFwiO09iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLFwiX19lc01vZHVsZVwiLHt2YWx1ZTp0cnVlfSk7ZXhwb3J0cy5TSUdOQUxTPXZvaWQgMDtcblxuY29uc3QgU0lHTkFMUz1bXG57XG5uYW1lOlwiU0lHSFVQXCIsXG5udW1iZXI6MSxcbmFjdGlvbjpcInRlcm1pbmF0ZVwiLFxuZGVzY3JpcHRpb246XCJUZXJtaW5hbCBjbG9zZWRcIixcbnN0YW5kYXJkOlwicG9zaXhcIn0sXG5cbntcbm5hbWU6XCJTSUdJTlRcIixcbm51bWJlcjoyLFxuYWN0aW9uOlwidGVybWluYXRlXCIsXG5kZXNjcmlwdGlvbjpcIlVzZXIgaW50ZXJydXB0aW9uIHdpdGggQ1RSTC1DXCIsXG5zdGFuZGFyZDpcImFuc2lcIn0sXG5cbntcbm5hbWU6XCJTSUdRVUlUXCIsXG5udW1iZXI6MyxcbmFjdGlvbjpcImNvcmVcIixcbmRlc2NyaXB0aW9uOlwiVXNlciBpbnRlcnJ1cHRpb24gd2l0aCBDVFJMLVxcXFxcIixcbnN0YW5kYXJkOlwicG9zaXhcIn0sXG5cbntcbm5hbWU6XCJTSUdJTExcIixcbm51bWJlcjo0LFxuYWN0aW9uOlwiY29yZVwiLFxuZGVzY3JpcHRpb246XCJJbnZhbGlkIG1hY2hpbmUgaW5zdHJ1Y3Rpb25cIixcbnN0YW5kYXJkOlwiYW5zaVwifSxcblxue1xubmFtZTpcIlNJR1RSQVBcIixcbm51bWJlcjo1LFxuYWN0aW9uOlwiY29yZVwiLFxuZGVzY3JpcHRpb246XCJEZWJ1Z2dlciBicmVha3BvaW50XCIsXG5zdGFuZGFyZDpcInBvc2l4XCJ9LFxuXG57XG5uYW1lOlwiU0lHQUJSVFwiLFxubnVtYmVyOjYsXG5hY3Rpb246XCJjb3JlXCIsXG5kZXNjcmlwdGlvbjpcIkFib3J0ZWRcIixcbnN0YW5kYXJkOlwiYW5zaVwifSxcblxue1xubmFtZTpcIlNJR0lPVFwiLFxubnVtYmVyOjYsXG5hY3Rpb246XCJjb3JlXCIsXG5kZXNjcmlwdGlvbjpcIkFib3J0ZWRcIixcbnN0YW5kYXJkOlwiYnNkXCJ9LFxuXG57XG5uYW1lOlwiU0lHQlVTXCIsXG5udW1iZXI6NyxcbmFjdGlvbjpcImNvcmVcIixcbmRlc2NyaXB0aW9uOlxuXCJCdXMgZXJyb3IgZHVlIHRvIG1pc2FsaWduZWQsIG5vbi1leGlzdGluZyBhZGRyZXNzIG9yIHBhZ2luZyBlcnJvclwiLFxuc3RhbmRhcmQ6XCJic2RcIn0sXG5cbntcbm5hbWU6XCJTSUdFTVRcIixcbm51bWJlcjo3LFxuYWN0aW9uOlwidGVybWluYXRlXCIsXG5kZXNjcmlwdGlvbjpcIkNvbW1hbmQgc2hvdWxkIGJlIGVtdWxhdGVkIGJ1dCBpcyBub3QgaW1wbGVtZW50ZWRcIixcbnN0YW5kYXJkOlwib3RoZXJcIn0sXG5cbntcbm5hbWU6XCJTSUdGUEVcIixcbm51bWJlcjo4LFxuYWN0aW9uOlwiY29yZVwiLFxuZGVzY3JpcHRpb246XCJGbG9hdGluZyBwb2ludCBhcml0aG1ldGljIGVycm9yXCIsXG5zdGFuZGFyZDpcImFuc2lcIn0sXG5cbntcbm5hbWU6XCJTSUdLSUxMXCIsXG5udW1iZXI6OSxcbmFjdGlvbjpcInRlcm1pbmF0ZVwiLFxuZGVzY3JpcHRpb246XCJGb3JjZWQgdGVybWluYXRpb25cIixcbnN0YW5kYXJkOlwicG9zaXhcIixcbmZvcmNlZDp0cnVlfSxcblxue1xubmFtZTpcIlNJR1VTUjFcIixcbm51bWJlcjoxMCxcbmFjdGlvbjpcInRlcm1pbmF0ZVwiLFxuZGVzY3JpcHRpb246XCJBcHBsaWNhdGlvbi1zcGVjaWZpYyBzaWduYWxcIixcbnN0YW5kYXJkOlwicG9zaXhcIn0sXG5cbntcbm5hbWU6XCJTSUdTRUdWXCIsXG5udW1iZXI6MTEsXG5hY3Rpb246XCJjb3JlXCIsXG5kZXNjcmlwdGlvbjpcIlNlZ21lbnRhdGlvbiBmYXVsdFwiLFxuc3RhbmRhcmQ6XCJhbnNpXCJ9LFxuXG57XG5uYW1lOlwiU0lHVVNSMlwiLFxubnVtYmVyOjEyLFxuYWN0aW9uOlwidGVybWluYXRlXCIsXG5kZXNjcmlwdGlvbjpcIkFwcGxpY2F0aW9uLXNwZWNpZmljIHNpZ25hbFwiLFxuc3RhbmRhcmQ6XCJwb3NpeFwifSxcblxue1xubmFtZTpcIlNJR1BJUEVcIixcbm51bWJlcjoxMyxcbmFjdGlvbjpcInRlcm1pbmF0ZVwiLFxuZGVzY3JpcHRpb246XCJCcm9rZW4gcGlwZSBvciBzb2NrZXRcIixcbnN0YW5kYXJkOlwicG9zaXhcIn0sXG5cbntcbm5hbWU6XCJTSUdBTFJNXCIsXG5udW1iZXI6MTQsXG5hY3Rpb246XCJ0ZXJtaW5hdGVcIixcbmRlc2NyaXB0aW9uOlwiVGltZW91dCBvciB0aW1lclwiLFxuc3RhbmRhcmQ6XCJwb3NpeFwifSxcblxue1xubmFtZTpcIlNJR1RFUk1cIixcbm51bWJlcjoxNSxcbmFjdGlvbjpcInRlcm1pbmF0ZVwiLFxuZGVzY3JpcHRpb246XCJUZXJtaW5hdGlvblwiLFxuc3RhbmRhcmQ6XCJhbnNpXCJ9LFxuXG57XG5uYW1lOlwiU0lHU1RLRkxUXCIsXG5udW1iZXI6MTYsXG5hY3Rpb246XCJ0ZXJtaW5hdGVcIixcbmRlc2NyaXB0aW9uOlwiU3RhY2sgaXMgZW1wdHkgb3Igb3ZlcmZsb3dlZFwiLFxuc3RhbmRhcmQ6XCJvdGhlclwifSxcblxue1xubmFtZTpcIlNJR0NITERcIixcbm51bWJlcjoxNyxcbmFjdGlvbjpcImlnbm9yZVwiLFxuZGVzY3JpcHRpb246XCJDaGlsZCBwcm9jZXNzIHRlcm1pbmF0ZWQsIHBhdXNlZCBvciB1bnBhdXNlZFwiLFxuc3RhbmRhcmQ6XCJwb3NpeFwifSxcblxue1xubmFtZTpcIlNJR0NMRFwiLFxubnVtYmVyOjE3LFxuYWN0aW9uOlwiaWdub3JlXCIsXG5kZXNjcmlwdGlvbjpcIkNoaWxkIHByb2Nlc3MgdGVybWluYXRlZCwgcGF1c2VkIG9yIHVucGF1c2VkXCIsXG5zdGFuZGFyZDpcIm90aGVyXCJ9LFxuXG57XG5uYW1lOlwiU0lHQ09OVFwiLFxubnVtYmVyOjE4LFxuYWN0aW9uOlwidW5wYXVzZVwiLFxuZGVzY3JpcHRpb246XCJVbnBhdXNlZFwiLFxuc3RhbmRhcmQ6XCJwb3NpeFwiLFxuZm9yY2VkOnRydWV9LFxuXG57XG5uYW1lOlwiU0lHU1RPUFwiLFxubnVtYmVyOjE5LFxuYWN0aW9uOlwicGF1c2VcIixcbmRlc2NyaXB0aW9uOlwiUGF1c2VkXCIsXG5zdGFuZGFyZDpcInBvc2l4XCIsXG5mb3JjZWQ6dHJ1ZX0sXG5cbntcbm5hbWU6XCJTSUdUU1RQXCIsXG5udW1iZXI6MjAsXG5hY3Rpb246XCJwYXVzZVwiLFxuZGVzY3JpcHRpb246XCJQYXVzZWQgdXNpbmcgQ1RSTC1aIG9yIFxcXCJzdXNwZW5kXFxcIlwiLFxuc3RhbmRhcmQ6XCJwb3NpeFwifSxcblxue1xubmFtZTpcIlNJR1RUSU5cIixcbm51bWJlcjoyMSxcbmFjdGlvbjpcInBhdXNlXCIsXG5kZXNjcmlwdGlvbjpcIkJhY2tncm91bmQgcHJvY2VzcyBjYW5ub3QgcmVhZCB0ZXJtaW5hbCBpbnB1dFwiLFxuc3RhbmRhcmQ6XCJwb3NpeFwifSxcblxue1xubmFtZTpcIlNJR0JSRUFLXCIsXG5udW1iZXI6MjEsXG5hY3Rpb246XCJ0ZXJtaW5hdGVcIixcbmRlc2NyaXB0aW9uOlwiVXNlciBpbnRlcnJ1cHRpb24gd2l0aCBDVFJMLUJSRUFLXCIsXG5zdGFuZGFyZDpcIm90aGVyXCJ9LFxuXG57XG5uYW1lOlwiU0lHVFRPVVwiLFxubnVtYmVyOjIyLFxuYWN0aW9uOlwicGF1c2VcIixcbmRlc2NyaXB0aW9uOlwiQmFja2dyb3VuZCBwcm9jZXNzIGNhbm5vdCB3cml0ZSB0byB0ZXJtaW5hbCBvdXRwdXRcIixcbnN0YW5kYXJkOlwicG9zaXhcIn0sXG5cbntcbm5hbWU6XCJTSUdVUkdcIixcbm51bWJlcjoyMyxcbmFjdGlvbjpcImlnbm9yZVwiLFxuZGVzY3JpcHRpb246XCJTb2NrZXQgcmVjZWl2ZWQgb3V0LW9mLWJhbmQgZGF0YVwiLFxuc3RhbmRhcmQ6XCJic2RcIn0sXG5cbntcbm5hbWU6XCJTSUdYQ1BVXCIsXG5udW1iZXI6MjQsXG5hY3Rpb246XCJjb3JlXCIsXG5kZXNjcmlwdGlvbjpcIlByb2Nlc3MgdGltZWQgb3V0XCIsXG5zdGFuZGFyZDpcImJzZFwifSxcblxue1xubmFtZTpcIlNJR1hGU1pcIixcbm51bWJlcjoyNSxcbmFjdGlvbjpcImNvcmVcIixcbmRlc2NyaXB0aW9uOlwiRmlsZSB0b28gYmlnXCIsXG5zdGFuZGFyZDpcImJzZFwifSxcblxue1xubmFtZTpcIlNJR1ZUQUxSTVwiLFxubnVtYmVyOjI2LFxuYWN0aW9uOlwidGVybWluYXRlXCIsXG5kZXNjcmlwdGlvbjpcIlRpbWVvdXQgb3IgdGltZXJcIixcbnN0YW5kYXJkOlwiYnNkXCJ9LFxuXG57XG5uYW1lOlwiU0lHUFJPRlwiLFxubnVtYmVyOjI3LFxuYWN0aW9uOlwidGVybWluYXRlXCIsXG5kZXNjcmlwdGlvbjpcIlRpbWVvdXQgb3IgdGltZXJcIixcbnN0YW5kYXJkOlwiYnNkXCJ9LFxuXG57XG5uYW1lOlwiU0lHV0lOQ0hcIixcbm51bWJlcjoyOCxcbmFjdGlvbjpcImlnbm9yZVwiLFxuZGVzY3JpcHRpb246XCJUZXJtaW5hbCB3aW5kb3cgc2l6ZSBjaGFuZ2VkXCIsXG5zdGFuZGFyZDpcImJzZFwifSxcblxue1xubmFtZTpcIlNJR0lPXCIsXG5udW1iZXI6MjksXG5hY3Rpb246XCJ0ZXJtaW5hdGVcIixcbmRlc2NyaXB0aW9uOlwiSS9PIGlzIGF2YWlsYWJsZVwiLFxuc3RhbmRhcmQ6XCJvdGhlclwifSxcblxue1xubmFtZTpcIlNJR1BPTExcIixcbm51bWJlcjoyOSxcbmFjdGlvbjpcInRlcm1pbmF0ZVwiLFxuZGVzY3JpcHRpb246XCJXYXRjaGVkIGV2ZW50XCIsXG5zdGFuZGFyZDpcIm90aGVyXCJ9LFxuXG57XG5uYW1lOlwiU0lHSU5GT1wiLFxubnVtYmVyOjI5LFxuYWN0aW9uOlwiaWdub3JlXCIsXG5kZXNjcmlwdGlvbjpcIlJlcXVlc3QgZm9yIHByb2Nlc3MgaW5mb3JtYXRpb25cIixcbnN0YW5kYXJkOlwib3RoZXJcIn0sXG5cbntcbm5hbWU6XCJTSUdQV1JcIixcbm51bWJlcjozMCxcbmFjdGlvbjpcInRlcm1pbmF0ZVwiLFxuZGVzY3JpcHRpb246XCJEZXZpY2UgcnVubmluZyBvdXQgb2YgcG93ZXJcIixcbnN0YW5kYXJkOlwic3lzdGVtdlwifSxcblxue1xubmFtZTpcIlNJR1NZU1wiLFxubnVtYmVyOjMxLFxuYWN0aW9uOlwiY29yZVwiLFxuZGVzY3JpcHRpb246XCJJbnZhbGlkIHN5c3RlbSBjYWxsXCIsXG5zdGFuZGFyZDpcIm90aGVyXCJ9LFxuXG57XG5uYW1lOlwiU0lHVU5VU0VEXCIsXG5udW1iZXI6MzEsXG5hY3Rpb246XCJ0ZXJtaW5hdGVcIixcbmRlc2NyaXB0aW9uOlwiSW52YWxpZCBzeXN0ZW0gY2FsbFwiLFxuc3RhbmRhcmQ6XCJvdGhlclwifV07ZXhwb3J0cy5TSUdOQUxTPVNJR05BTFM7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jb3JlLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO09iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLFwiX19lc01vZHVsZVwiLHt2YWx1ZTp0cnVlfSk7ZXhwb3J0cy5TSUdSVE1BWD1leHBvcnRzLmdldFJlYWx0aW1lU2lnbmFscz12b2lkIDA7XG5jb25zdCBnZXRSZWFsdGltZVNpZ25hbHM9ZnVuY3Rpb24oKXtcbmNvbnN0IGxlbmd0aD1TSUdSVE1BWC1TSUdSVE1JTisxO1xucmV0dXJuIEFycmF5LmZyb20oe2xlbmd0aH0sZ2V0UmVhbHRpbWVTaWduYWwpO1xufTtleHBvcnRzLmdldFJlYWx0aW1lU2lnbmFscz1nZXRSZWFsdGltZVNpZ25hbHM7XG5cbmNvbnN0IGdldFJlYWx0aW1lU2lnbmFsPWZ1bmN0aW9uKHZhbHVlLGluZGV4KXtcbnJldHVybntcbm5hbWU6YFNJR1JUJHtpbmRleCsxfWAsXG5udW1iZXI6U0lHUlRNSU4raW5kZXgsXG5hY3Rpb246XCJ0ZXJtaW5hdGVcIixcbmRlc2NyaXB0aW9uOlwiQXBwbGljYXRpb24tc3BlY2lmaWMgc2lnbmFsIChyZWFsdGltZSlcIixcbnN0YW5kYXJkOlwicG9zaXhcIn07XG5cbn07XG5cbmNvbnN0IFNJR1JUTUlOPTM0O1xuY29uc3QgU0lHUlRNQVg9NjQ7ZXhwb3J0cy5TSUdSVE1BWD1TSUdSVE1BWDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXJlYWx0aW1lLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO09iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLFwiX19lc01vZHVsZVwiLHt2YWx1ZTp0cnVlfSk7ZXhwb3J0cy5nZXRTaWduYWxzPXZvaWQgMDt2YXIgX29zPXJlcXVpcmUoXCJvc1wiKTtcblxudmFyIF9jb3JlPXJlcXVpcmUoXCIuL2NvcmUuanNcIik7XG52YXIgX3JlYWx0aW1lPXJlcXVpcmUoXCIuL3JlYWx0aW1lLmpzXCIpO1xuXG5cblxuY29uc3QgZ2V0U2lnbmFscz1mdW5jdGlvbigpe1xuY29uc3QgcmVhbHRpbWVTaWduYWxzPSgwLF9yZWFsdGltZS5nZXRSZWFsdGltZVNpZ25hbHMpKCk7XG5jb25zdCBzaWduYWxzPVsuLi5fY29yZS5TSUdOQUxTLC4uLnJlYWx0aW1lU2lnbmFsc10ubWFwKG5vcm1hbGl6ZVNpZ25hbCk7XG5yZXR1cm4gc2lnbmFscztcbn07ZXhwb3J0cy5nZXRTaWduYWxzPWdldFNpZ25hbHM7XG5cblxuXG5cblxuXG5cbmNvbnN0IG5vcm1hbGl6ZVNpZ25hbD1mdW5jdGlvbih7XG5uYW1lLFxubnVtYmVyOmRlZmF1bHROdW1iZXIsXG5kZXNjcmlwdGlvbixcbmFjdGlvbixcbmZvcmNlZD1mYWxzZSxcbnN0YW5kYXJkfSlcbntcbmNvbnN0e1xuc2lnbmFsczp7W25hbWVdOmNvbnN0YW50U2lnbmFsfX09XG5fb3MuY29uc3RhbnRzO1xuY29uc3Qgc3VwcG9ydGVkPWNvbnN0YW50U2lnbmFsIT09dW5kZWZpbmVkO1xuY29uc3QgbnVtYmVyPXN1cHBvcnRlZD9jb25zdGFudFNpZ25hbDpkZWZhdWx0TnVtYmVyO1xucmV0dXJue25hbWUsbnVtYmVyLGRlc2NyaXB0aW9uLHN1cHBvcnRlZCxhY3Rpb24sZm9yY2VkLHN0YW5kYXJkfTtcbn07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1zaWduYWxzLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO09iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLFwiX19lc01vZHVsZVwiLHt2YWx1ZTp0cnVlfSk7ZXhwb3J0cy5zaWduYWxzQnlOdW1iZXI9ZXhwb3J0cy5zaWduYWxzQnlOYW1lPXZvaWQgMDt2YXIgX29zPXJlcXVpcmUoXCJvc1wiKTtcblxudmFyIF9zaWduYWxzPXJlcXVpcmUoXCIuL3NpZ25hbHMuanNcIik7XG52YXIgX3JlYWx0aW1lPXJlcXVpcmUoXCIuL3JlYWx0aW1lLmpzXCIpO1xuXG5cblxuY29uc3QgZ2V0U2lnbmFsc0J5TmFtZT1mdW5jdGlvbigpe1xuY29uc3Qgc2lnbmFscz0oMCxfc2lnbmFscy5nZXRTaWduYWxzKSgpO1xucmV0dXJuIHNpZ25hbHMucmVkdWNlKGdldFNpZ25hbEJ5TmFtZSx7fSk7XG59O1xuXG5jb25zdCBnZXRTaWduYWxCeU5hbWU9ZnVuY3Rpb24oXG5zaWduYWxCeU5hbWVNZW1vLFxue25hbWUsbnVtYmVyLGRlc2NyaXB0aW9uLHN1cHBvcnRlZCxhY3Rpb24sZm9yY2VkLHN0YW5kYXJkfSlcbntcbnJldHVybntcbi4uLnNpZ25hbEJ5TmFtZU1lbW8sXG5bbmFtZV06e25hbWUsbnVtYmVyLGRlc2NyaXB0aW9uLHN1cHBvcnRlZCxhY3Rpb24sZm9yY2VkLHN0YW5kYXJkfX07XG5cbn07XG5cbmNvbnN0IHNpZ25hbHNCeU5hbWU9Z2V0U2lnbmFsc0J5TmFtZSgpO2V4cG9ydHMuc2lnbmFsc0J5TmFtZT1zaWduYWxzQnlOYW1lO1xuXG5cblxuXG5jb25zdCBnZXRTaWduYWxzQnlOdW1iZXI9ZnVuY3Rpb24oKXtcbmNvbnN0IHNpZ25hbHM9KDAsX3NpZ25hbHMuZ2V0U2lnbmFscykoKTtcbmNvbnN0IGxlbmd0aD1fcmVhbHRpbWUuU0lHUlRNQVgrMTtcbmNvbnN0IHNpZ25hbHNBPUFycmF5LmZyb20oe2xlbmd0aH0sKHZhbHVlLG51bWJlcik9PlxuZ2V0U2lnbmFsQnlOdW1iZXIobnVtYmVyLHNpZ25hbHMpKTtcblxucmV0dXJuIE9iamVjdC5hc3NpZ24oe30sLi4uc2lnbmFsc0EpO1xufTtcblxuY29uc3QgZ2V0U2lnbmFsQnlOdW1iZXI9ZnVuY3Rpb24obnVtYmVyLHNpZ25hbHMpe1xuY29uc3Qgc2lnbmFsPWZpbmRTaWduYWxCeU51bWJlcihudW1iZXIsc2lnbmFscyk7XG5cbmlmKHNpZ25hbD09PXVuZGVmaW5lZCl7XG5yZXR1cm57fTtcbn1cblxuY29uc3R7bmFtZSxkZXNjcmlwdGlvbixzdXBwb3J0ZWQsYWN0aW9uLGZvcmNlZCxzdGFuZGFyZH09c2lnbmFsO1xucmV0dXJue1xuW251bWJlcl06e1xubmFtZSxcbm51bWJlcixcbmRlc2NyaXB0aW9uLFxuc3VwcG9ydGVkLFxuYWN0aW9uLFxuZm9yY2VkLFxuc3RhbmRhcmR9fTtcblxuXG59O1xuXG5cblxuY29uc3QgZmluZFNpZ25hbEJ5TnVtYmVyPWZ1bmN0aW9uKG51bWJlcixzaWduYWxzKXtcbmNvbnN0IHNpZ25hbD1zaWduYWxzLmZpbmQoKHtuYW1lfSk9Pl9vcy5jb25zdGFudHMuc2lnbmFsc1tuYW1lXT09PW51bWJlcik7XG5cbmlmKHNpZ25hbCE9PXVuZGVmaW5lZCl7XG5yZXR1cm4gc2lnbmFsO1xufVxuXG5yZXR1cm4gc2lnbmFscy5maW5kKHNpZ25hbEE9PnNpZ25hbEEubnVtYmVyPT09bnVtYmVyKTtcbn07XG5cbmNvbnN0IHNpZ25hbHNCeU51bWJlcj1nZXRTaWduYWxzQnlOdW1iZXIoKTtleHBvcnRzLnNpZ25hbHNCeU51bWJlcj1zaWduYWxzQnlOdW1iZXI7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1tYWluLmpzLm1hcCIsIid1c2Ugc3RyaWN0JztcbmNvbnN0IHtzaWduYWxzQnlOYW1lfSA9IHJlcXVpcmUoJ2h1bWFuLXNpZ25hbHMnKTtcblxuY29uc3QgZ2V0RXJyb3JQcmVmaXggPSAoe3RpbWVkT3V0LCB0aW1lb3V0LCBlcnJvckNvZGUsIHNpZ25hbCwgc2lnbmFsRGVzY3JpcHRpb24sIGV4aXRDb2RlLCBpc0NhbmNlbGVkfSkgPT4ge1xuXHRpZiAodGltZWRPdXQpIHtcblx0XHRyZXR1cm4gYHRpbWVkIG91dCBhZnRlciAke3RpbWVvdXR9IG1pbGxpc2Vjb25kc2A7XG5cdH1cblxuXHRpZiAoaXNDYW5jZWxlZCkge1xuXHRcdHJldHVybiAnd2FzIGNhbmNlbGVkJztcblx0fVxuXG5cdGlmIChlcnJvckNvZGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBgZmFpbGVkIHdpdGggJHtlcnJvckNvZGV9YDtcblx0fVxuXG5cdGlmIChzaWduYWwgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBgd2FzIGtpbGxlZCB3aXRoICR7c2lnbmFsfSAoJHtzaWduYWxEZXNjcmlwdGlvbn0pYDtcblx0fVxuXG5cdGlmIChleGl0Q29kZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGBmYWlsZWQgd2l0aCBleGl0IGNvZGUgJHtleGl0Q29kZX1gO1xuXHR9XG5cblx0cmV0dXJuICdmYWlsZWQnO1xufTtcblxuY29uc3QgbWFrZUVycm9yID0gKHtcblx0c3Rkb3V0LFxuXHRzdGRlcnIsXG5cdGFsbCxcblx0ZXJyb3IsXG5cdHNpZ25hbCxcblx0ZXhpdENvZGUsXG5cdGNvbW1hbmQsXG5cdGVzY2FwZWRDb21tYW5kLFxuXHR0aW1lZE91dCxcblx0aXNDYW5jZWxlZCxcblx0a2lsbGVkLFxuXHRwYXJzZWQ6IHtvcHRpb25zOiB7dGltZW91dH19XG59KSA9PiB7XG5cdC8vIGBzaWduYWxgIGFuZCBgZXhpdENvZGVgIGVtaXR0ZWQgb24gYHNwYXduZWQub24oJ2V4aXQnKWAgZXZlbnQgY2FuIGJlIGBudWxsYC5cblx0Ly8gV2Ugbm9ybWFsaXplIHRoZW0gdG8gYHVuZGVmaW5lZGBcblx0ZXhpdENvZGUgPSBleGl0Q29kZSA9PT0gbnVsbCA/IHVuZGVmaW5lZCA6IGV4aXRDb2RlO1xuXHRzaWduYWwgPSBzaWduYWwgPT09IG51bGwgPyB1bmRlZmluZWQgOiBzaWduYWw7XG5cdGNvbnN0IHNpZ25hbERlc2NyaXB0aW9uID0gc2lnbmFsID09PSB1bmRlZmluZWQgPyB1bmRlZmluZWQgOiBzaWduYWxzQnlOYW1lW3NpZ25hbF0uZGVzY3JpcHRpb247XG5cblx0Y29uc3QgZXJyb3JDb2RlID0gZXJyb3IgJiYgZXJyb3IuY29kZTtcblxuXHRjb25zdCBwcmVmaXggPSBnZXRFcnJvclByZWZpeCh7dGltZWRPdXQsIHRpbWVvdXQsIGVycm9yQ29kZSwgc2lnbmFsLCBzaWduYWxEZXNjcmlwdGlvbiwgZXhpdENvZGUsIGlzQ2FuY2VsZWR9KTtcblx0Y29uc3QgZXhlY2FNZXNzYWdlID0gYENvbW1hbmQgJHtwcmVmaXh9OiAke2NvbW1hbmR9YDtcblx0Y29uc3QgaXNFcnJvciA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChlcnJvcikgPT09ICdbb2JqZWN0IEVycm9yXSc7XG5cdGNvbnN0IHNob3J0TWVzc2FnZSA9IGlzRXJyb3IgPyBgJHtleGVjYU1lc3NhZ2V9XFxuJHtlcnJvci5tZXNzYWdlfWAgOiBleGVjYU1lc3NhZ2U7XG5cdGNvbnN0IG1lc3NhZ2UgPSBbc2hvcnRNZXNzYWdlLCBzdGRlcnIsIHN0ZG91dF0uZmlsdGVyKEJvb2xlYW4pLmpvaW4oJ1xcbicpO1xuXG5cdGlmIChpc0Vycm9yKSB7XG5cdFx0ZXJyb3Iub3JpZ2luYWxNZXNzYWdlID0gZXJyb3IubWVzc2FnZTtcblx0XHRlcnJvci5tZXNzYWdlID0gbWVzc2FnZTtcblx0fSBlbHNlIHtcblx0XHRlcnJvciA9IG5ldyBFcnJvcihtZXNzYWdlKTtcblx0fVxuXG5cdGVycm9yLnNob3J0TWVzc2FnZSA9IHNob3J0TWVzc2FnZTtcblx0ZXJyb3IuY29tbWFuZCA9IGNvbW1hbmQ7XG5cdGVycm9yLmVzY2FwZWRDb21tYW5kID0gZXNjYXBlZENvbW1hbmQ7XG5cdGVycm9yLmV4aXRDb2RlID0gZXhpdENvZGU7XG5cdGVycm9yLnNpZ25hbCA9IHNpZ25hbDtcblx0ZXJyb3Iuc2lnbmFsRGVzY3JpcHRpb24gPSBzaWduYWxEZXNjcmlwdGlvbjtcblx0ZXJyb3Iuc3Rkb3V0ID0gc3Rkb3V0O1xuXHRlcnJvci5zdGRlcnIgPSBzdGRlcnI7XG5cblx0aWYgKGFsbCAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0ZXJyb3IuYWxsID0gYWxsO1xuXHR9XG5cblx0aWYgKCdidWZmZXJlZERhdGEnIGluIGVycm9yKSB7XG5cdFx0ZGVsZXRlIGVycm9yLmJ1ZmZlcmVkRGF0YTtcblx0fVxuXG5cdGVycm9yLmZhaWxlZCA9IHRydWU7XG5cdGVycm9yLnRpbWVkT3V0ID0gQm9vbGVhbih0aW1lZE91dCk7XG5cdGVycm9yLmlzQ2FuY2VsZWQgPSBpc0NhbmNlbGVkO1xuXHRlcnJvci5raWxsZWQgPSBraWxsZWQgJiYgIXRpbWVkT3V0O1xuXG5cdHJldHVybiBlcnJvcjtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gbWFrZUVycm9yO1xuIiwiJ3VzZSBzdHJpY3QnO1xuY29uc3QgYWxpYXNlcyA9IFsnc3RkaW4nLCAnc3Rkb3V0JywgJ3N0ZGVyciddO1xuXG5jb25zdCBoYXNBbGlhcyA9IG9wdGlvbnMgPT4gYWxpYXNlcy5zb21lKGFsaWFzID0+IG9wdGlvbnNbYWxpYXNdICE9PSB1bmRlZmluZWQpO1xuXG5jb25zdCBub3JtYWxpemVTdGRpbyA9IG9wdGlvbnMgPT4ge1xuXHRpZiAoIW9wdGlvbnMpIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRjb25zdCB7c3RkaW99ID0gb3B0aW9ucztcblxuXHRpZiAoc3RkaW8gPT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBhbGlhc2VzLm1hcChhbGlhcyA9PiBvcHRpb25zW2FsaWFzXSk7XG5cdH1cblxuXHRpZiAoaGFzQWxpYXMob3B0aW9ucykpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoYEl0J3Mgbm90IHBvc3NpYmxlIHRvIHByb3ZpZGUgXFxgc3RkaW9cXGAgaW4gY29tYmluYXRpb24gd2l0aCBvbmUgb2YgJHthbGlhc2VzLm1hcChhbGlhcyA9PiBgXFxgJHthbGlhc31cXGBgKS5qb2luKCcsICcpfWApO1xuXHR9XG5cblx0aWYgKHR5cGVvZiBzdGRpbyA9PT0gJ3N0cmluZycpIHtcblx0XHRyZXR1cm4gc3RkaW87XG5cdH1cblxuXHRpZiAoIUFycmF5LmlzQXJyYXkoc3RkaW8pKSB7XG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcihgRXhwZWN0ZWQgXFxgc3RkaW9cXGAgdG8gYmUgb2YgdHlwZSBcXGBzdHJpbmdcXGAgb3IgXFxgQXJyYXlcXGAsIGdvdCBcXGAke3R5cGVvZiBzdGRpb31cXGBgKTtcblx0fVxuXG5cdGNvbnN0IGxlbmd0aCA9IE1hdGgubWF4KHN0ZGlvLmxlbmd0aCwgYWxpYXNlcy5sZW5ndGgpO1xuXHRyZXR1cm4gQXJyYXkuZnJvbSh7bGVuZ3RofSwgKHZhbHVlLCBpbmRleCkgPT4gc3RkaW9baW5kZXhdKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gbm9ybWFsaXplU3RkaW87XG5cbi8vIGBpcGNgIGlzIHB1c2hlZCB1bmxlc3MgaXQgaXMgYWxyZWFkeSBwcmVzZW50XG5tb2R1bGUuZXhwb3J0cy5ub2RlID0gb3B0aW9ucyA9PiB7XG5cdGNvbnN0IHN0ZGlvID0gbm9ybWFsaXplU3RkaW8ob3B0aW9ucyk7XG5cblx0aWYgKHN0ZGlvID09PSAnaXBjJykge1xuXHRcdHJldHVybiAnaXBjJztcblx0fVxuXG5cdGlmIChzdGRpbyA9PT0gdW5kZWZpbmVkIHx8IHR5cGVvZiBzdGRpbyA9PT0gJ3N0cmluZycpIHtcblx0XHRyZXR1cm4gW3N0ZGlvLCBzdGRpbywgc3RkaW8sICdpcGMnXTtcblx0fVxuXG5cdGlmIChzdGRpby5pbmNsdWRlcygnaXBjJykpIHtcblx0XHRyZXR1cm4gc3RkaW87XG5cdH1cblxuXHRyZXR1cm4gWy4uLnN0ZGlvLCAnaXBjJ107XG59O1xuIiwiLy8gVGhpcyBpcyBub3QgdGhlIHNldCBvZiBhbGwgcG9zc2libGUgc2lnbmFscy5cbi8vXG4vLyBJdCBJUywgaG93ZXZlciwgdGhlIHNldCBvZiBhbGwgc2lnbmFscyB0aGF0IHRyaWdnZXJcbi8vIGFuIGV4aXQgb24gZWl0aGVyIExpbnV4IG9yIEJTRCBzeXN0ZW1zLiAgTGludXggaXMgYVxuLy8gc3VwZXJzZXQgb2YgdGhlIHNpZ25hbCBuYW1lcyBzdXBwb3J0ZWQgb24gQlNELCBhbmRcbi8vIHRoZSB1bmtub3duIHNpZ25hbHMganVzdCBmYWlsIHRvIHJlZ2lzdGVyLCBzbyB3ZSBjYW5cbi8vIGNhdGNoIHRoYXQgZWFzaWx5IGVub3VnaC5cbi8vXG4vLyBEb24ndCBib3RoZXIgd2l0aCBTSUdLSUxMLiAgSXQncyB1bmNhdGNoYWJsZSwgd2hpY2hcbi8vIG1lYW5zIHRoYXQgd2UgY2FuJ3QgZmlyZSBhbnkgY2FsbGJhY2tzIGFueXdheS5cbi8vXG4vLyBJZiBhIHVzZXIgZG9lcyBoYXBwZW4gdG8gcmVnaXN0ZXIgYSBoYW5kbGVyIG9uIGEgbm9uLVxuLy8gZmF0YWwgc2lnbmFsIGxpa2UgU0lHV0lOQ0ggb3Igc29tZXRoaW5nLCBhbmQgdGhlblxuLy8gZXhpdCwgaXQnbGwgZW5kIHVwIGZpcmluZyBgcHJvY2Vzcy5lbWl0KCdleGl0JylgLCBzb1xuLy8gdGhlIGhhbmRsZXIgd2lsbCBiZSBmaXJlZCBhbnl3YXkuXG4vL1xuLy8gU0lHQlVTLCBTSUdGUEUsIFNJR1NFR1YgYW5kIFNJR0lMTCwgd2hlbiBub3QgcmFpc2VkXG4vLyBhcnRpZmljaWFsbHksIGluaGVyZW50bHkgbGVhdmUgdGhlIHByb2Nlc3MgaW4gYVxuLy8gc3RhdGUgZnJvbSB3aGljaCBpdCBpcyBub3Qgc2FmZSB0byB0cnkgYW5kIGVudGVyIEpTXG4vLyBsaXN0ZW5lcnMuXG5tb2R1bGUuZXhwb3J0cyA9IFtcbiAgJ1NJR0FCUlQnLFxuICAnU0lHQUxSTScsXG4gICdTSUdIVVAnLFxuICAnU0lHSU5UJyxcbiAgJ1NJR1RFUk0nXG5dXG5cbmlmIChwcm9jZXNzLnBsYXRmb3JtICE9PSAnd2luMzInKSB7XG4gIG1vZHVsZS5leHBvcnRzLnB1c2goXG4gICAgJ1NJR1ZUQUxSTScsXG4gICAgJ1NJR1hDUFUnLFxuICAgICdTSUdYRlNaJyxcbiAgICAnU0lHVVNSMicsXG4gICAgJ1NJR1RSQVAnLFxuICAgICdTSUdTWVMnLFxuICAgICdTSUdRVUlUJyxcbiAgICAnU0lHSU9UJ1xuICAgIC8vIHNob3VsZCBkZXRlY3QgcHJvZmlsZXIgYW5kIGVuYWJsZS9kaXNhYmxlIGFjY29yZGluZ2x5LlxuICAgIC8vIHNlZSAjMjFcbiAgICAvLyAnU0lHUFJPRidcbiAgKVxufVxuXG5pZiAocHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ2xpbnV4Jykge1xuICBtb2R1bGUuZXhwb3J0cy5wdXNoKFxuICAgICdTSUdJTycsXG4gICAgJ1NJR1BPTEwnLFxuICAgICdTSUdQV1InLFxuICAgICdTSUdTVEtGTFQnLFxuICAgICdTSUdVTlVTRUQnXG4gIClcbn1cbiIsIi8vIE5vdGU6IHNpbmNlIG55YyB1c2VzIHRoaXMgbW9kdWxlIHRvIG91dHB1dCBjb3ZlcmFnZSwgYW55IGxpbmVzXG4vLyB0aGF0IGFyZSBpbiB0aGUgZGlyZWN0IHN5bmMgZmxvdyBvZiBueWMncyBvdXRwdXRDb3ZlcmFnZSBhcmVcbi8vIGlnbm9yZWQsIHNpbmNlIHdlIGNhbiBuZXZlciBnZXQgY292ZXJhZ2UgZm9yIHRoZW0uXG4vLyBncmFiIGEgcmVmZXJlbmNlIHRvIG5vZGUncyByZWFsIHByb2Nlc3Mgb2JqZWN0IHJpZ2h0IGF3YXlcbnZhciBwcm9jZXNzID0gZ2xvYmFsLnByb2Nlc3NcblxuY29uc3QgcHJvY2Vzc09rID0gZnVuY3Rpb24gKHByb2Nlc3MpIHtcbiAgcmV0dXJuIHByb2Nlc3MgJiZcbiAgICB0eXBlb2YgcHJvY2VzcyA9PT0gJ29iamVjdCcgJiZcbiAgICB0eXBlb2YgcHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9PT0gJ2Z1bmN0aW9uJyAmJlxuICAgIHR5cGVvZiBwcm9jZXNzLmVtaXQgPT09ICdmdW5jdGlvbicgJiZcbiAgICB0eXBlb2YgcHJvY2Vzcy5yZWFsbHlFeGl0ID09PSAnZnVuY3Rpb24nICYmXG4gICAgdHlwZW9mIHByb2Nlc3MubGlzdGVuZXJzID09PSAnZnVuY3Rpb24nICYmXG4gICAgdHlwZW9mIHByb2Nlc3Mua2lsbCA9PT0gJ2Z1bmN0aW9uJyAmJlxuICAgIHR5cGVvZiBwcm9jZXNzLnBpZCA9PT0gJ251bWJlcicgJiZcbiAgICB0eXBlb2YgcHJvY2Vzcy5vbiA9PT0gJ2Z1bmN0aW9uJ1xufVxuXG4vLyBzb21lIGtpbmQgb2Ygbm9uLW5vZGUgZW52aXJvbm1lbnQsIGp1c3Qgbm8tb3Bcbi8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuaWYgKCFwcm9jZXNzT2socHJvY2VzcykpIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHt9XG4gIH1cbn0gZWxzZSB7XG4gIHZhciBhc3NlcnQgPSByZXF1aXJlKCdhc3NlcnQnKVxuICB2YXIgc2lnbmFscyA9IHJlcXVpcmUoJy4vc2lnbmFscy5qcycpXG4gIHZhciBpc1dpbiA9IC9ed2luL2kudGVzdChwcm9jZXNzLnBsYXRmb3JtKVxuXG4gIHZhciBFRSA9IHJlcXVpcmUoJ2V2ZW50cycpXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICBpZiAodHlwZW9mIEVFICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgRUUgPSBFRS5FdmVudEVtaXR0ZXJcbiAgfVxuXG4gIHZhciBlbWl0dGVyXG4gIGlmIChwcm9jZXNzLl9fc2lnbmFsX2V4aXRfZW1pdHRlcl9fKSB7XG4gICAgZW1pdHRlciA9IHByb2Nlc3MuX19zaWduYWxfZXhpdF9lbWl0dGVyX19cbiAgfSBlbHNlIHtcbiAgICBlbWl0dGVyID0gcHJvY2Vzcy5fX3NpZ25hbF9leGl0X2VtaXR0ZXJfXyA9IG5ldyBFRSgpXG4gICAgZW1pdHRlci5jb3VudCA9IDBcbiAgICBlbWl0dGVyLmVtaXR0ZWQgPSB7fVxuICB9XG5cbiAgLy8gQmVjYXVzZSB0aGlzIGVtaXR0ZXIgaXMgYSBnbG9iYWwsIHdlIGhhdmUgdG8gY2hlY2sgdG8gc2VlIGlmIGFcbiAgLy8gcHJldmlvdXMgdmVyc2lvbiBvZiB0aGlzIGxpYnJhcnkgZmFpbGVkIHRvIGVuYWJsZSBpbmZpbml0ZSBsaXN0ZW5lcnMuXG4gIC8vIEkga25vdyB3aGF0IHlvdSdyZSBhYm91dCB0byBzYXkuICBCdXQgbGl0ZXJhbGx5IGV2ZXJ5dGhpbmcgYWJvdXRcbiAgLy8gc2lnbmFsLWV4aXQgaXMgYSBjb21wcm9taXNlIHdpdGggZXZpbC4gIEdldCB1c2VkIHRvIGl0LlxuICBpZiAoIWVtaXR0ZXIuaW5maW5pdGUpIHtcbiAgICBlbWl0dGVyLnNldE1heExpc3RlbmVycyhJbmZpbml0eSlcbiAgICBlbWl0dGVyLmluZmluaXRlID0gdHJ1ZVxuICB9XG5cbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY2IsIG9wdHMpIHtcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICBpZiAoIXByb2Nlc3NPayhnbG9iYWwucHJvY2VzcykpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7fVxuICAgIH1cbiAgICBhc3NlcnQuZXF1YWwodHlwZW9mIGNiLCAnZnVuY3Rpb24nLCAnYSBjYWxsYmFjayBtdXN0IGJlIHByb3ZpZGVkIGZvciBleGl0IGhhbmRsZXInKVxuXG4gICAgaWYgKGxvYWRlZCA9PT0gZmFsc2UpIHtcbiAgICAgIGxvYWQoKVxuICAgIH1cblxuICAgIHZhciBldiA9ICdleGl0J1xuICAgIGlmIChvcHRzICYmIG9wdHMuYWx3YXlzTGFzdCkge1xuICAgICAgZXYgPSAnYWZ0ZXJleGl0J1xuICAgIH1cblxuICAgIHZhciByZW1vdmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBlbWl0dGVyLnJlbW92ZUxpc3RlbmVyKGV2LCBjYilcbiAgICAgIGlmIChlbWl0dGVyLmxpc3RlbmVycygnZXhpdCcpLmxlbmd0aCA9PT0gMCAmJlxuICAgICAgICAgIGVtaXR0ZXIubGlzdGVuZXJzKCdhZnRlcmV4aXQnKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgdW5sb2FkKClcbiAgICAgIH1cbiAgICB9XG4gICAgZW1pdHRlci5vbihldiwgY2IpXG5cbiAgICByZXR1cm4gcmVtb3ZlXG4gIH1cblxuICB2YXIgdW5sb2FkID0gZnVuY3Rpb24gdW5sb2FkICgpIHtcbiAgICBpZiAoIWxvYWRlZCB8fCAhcHJvY2Vzc09rKGdsb2JhbC5wcm9jZXNzKSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGxvYWRlZCA9IGZhbHNlXG5cbiAgICBzaWduYWxzLmZvckVhY2goZnVuY3Rpb24gKHNpZykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcHJvY2Vzcy5yZW1vdmVMaXN0ZW5lcihzaWcsIHNpZ0xpc3RlbmVyc1tzaWddKVxuICAgICAgfSBjYXRjaCAoZXIpIHt9XG4gICAgfSlcbiAgICBwcm9jZXNzLmVtaXQgPSBvcmlnaW5hbFByb2Nlc3NFbWl0XG4gICAgcHJvY2Vzcy5yZWFsbHlFeGl0ID0gb3JpZ2luYWxQcm9jZXNzUmVhbGx5RXhpdFxuICAgIGVtaXR0ZXIuY291bnQgLT0gMVxuICB9XG4gIG1vZHVsZS5leHBvcnRzLnVubG9hZCA9IHVubG9hZFxuXG4gIHZhciBlbWl0ID0gZnVuY3Rpb24gZW1pdCAoZXZlbnQsIGNvZGUsIHNpZ25hbCkge1xuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgIGlmIChlbWl0dGVyLmVtaXR0ZWRbZXZlbnRdKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgZW1pdHRlci5lbWl0dGVkW2V2ZW50XSA9IHRydWVcbiAgICBlbWl0dGVyLmVtaXQoZXZlbnQsIGNvZGUsIHNpZ25hbClcbiAgfVxuXG4gIC8vIHsgPHNpZ25hbD46IDxsaXN0ZW5lciBmbj4sIC4uLiB9XG4gIHZhciBzaWdMaXN0ZW5lcnMgPSB7fVxuICBzaWduYWxzLmZvckVhY2goZnVuY3Rpb24gKHNpZykge1xuICAgIHNpZ0xpc3RlbmVyc1tzaWddID0gZnVuY3Rpb24gbGlzdGVuZXIgKCkge1xuICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICBpZiAoIXByb2Nlc3NPayhnbG9iYWwucHJvY2VzcykpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICAvLyBJZiB0aGVyZSBhcmUgbm8gb3RoZXIgbGlzdGVuZXJzLCBhbiBleGl0IGlzIGNvbWluZyFcbiAgICAgIC8vIFNpbXBsZXN0IHdheTogcmVtb3ZlIHVzIGFuZCB0aGVuIHJlLXNlbmQgdGhlIHNpZ25hbC5cbiAgICAgIC8vIFdlIGtub3cgdGhhdCB0aGlzIHdpbGwga2lsbCB0aGUgcHJvY2Vzcywgc28gd2UgY2FuXG4gICAgICAvLyBzYWZlbHkgZW1pdCBub3cuXG4gICAgICB2YXIgbGlzdGVuZXJzID0gcHJvY2Vzcy5saXN0ZW5lcnMoc2lnKVxuICAgICAgaWYgKGxpc3RlbmVycy5sZW5ndGggPT09IGVtaXR0ZXIuY291bnQpIHtcbiAgICAgICAgdW5sb2FkKClcbiAgICAgICAgZW1pdCgnZXhpdCcsIG51bGwsIHNpZylcbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICAgICAgZW1pdCgnYWZ0ZXJleGl0JywgbnVsbCwgc2lnKVxuICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgICAgICBpZiAoaXNXaW4gJiYgc2lnID09PSAnU0lHSFVQJykge1xuICAgICAgICAgIC8vIFwiU0lHSFVQXCIgdGhyb3dzIGFuIGBFTk9TWVNgIGVycm9yIG9uIFdpbmRvd3MsXG4gICAgICAgICAgLy8gc28gdXNlIGEgc3VwcG9ydGVkIHNpZ25hbCBpbnN0ZWFkXG4gICAgICAgICAgc2lnID0gJ1NJR0lOVCdcbiAgICAgICAgfVxuICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgICAgICBwcm9jZXNzLmtpbGwocHJvY2Vzcy5waWQsIHNpZylcbiAgICAgIH1cbiAgICB9XG4gIH0pXG5cbiAgbW9kdWxlLmV4cG9ydHMuc2lnbmFscyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gc2lnbmFsc1xuICB9XG5cbiAgdmFyIGxvYWRlZCA9IGZhbHNlXG5cbiAgdmFyIGxvYWQgPSBmdW5jdGlvbiBsb2FkICgpIHtcbiAgICBpZiAobG9hZGVkIHx8ICFwcm9jZXNzT2soZ2xvYmFsLnByb2Nlc3MpKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgbG9hZGVkID0gdHJ1ZVxuXG4gICAgLy8gVGhpcyBpcyB0aGUgbnVtYmVyIG9mIG9uU2lnbmFsRXhpdCdzIHRoYXQgYXJlIGluIHBsYXkuXG4gICAgLy8gSXQncyBpbXBvcnRhbnQgc28gdGhhdCB3ZSBjYW4gY291bnQgdGhlIGNvcnJlY3QgbnVtYmVyIG9mXG4gICAgLy8gbGlzdGVuZXJzIG9uIHNpZ25hbHMsIGFuZCBkb24ndCB3YWl0IGZvciB0aGUgb3RoZXIgb25lIHRvXG4gICAgLy8gaGFuZGxlIGl0IGluc3RlYWQgb2YgdXMuXG4gICAgZW1pdHRlci5jb3VudCArPSAxXG5cbiAgICBzaWduYWxzID0gc2lnbmFscy5maWx0ZXIoZnVuY3Rpb24gKHNpZykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcHJvY2Vzcy5vbihzaWcsIHNpZ0xpc3RlbmVyc1tzaWddKVxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfSBjYXRjaCAoZXIpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG4gICAgfSlcblxuICAgIHByb2Nlc3MuZW1pdCA9IHByb2Nlc3NFbWl0XG4gICAgcHJvY2Vzcy5yZWFsbHlFeGl0ID0gcHJvY2Vzc1JlYWxseUV4aXRcbiAgfVxuICBtb2R1bGUuZXhwb3J0cy5sb2FkID0gbG9hZFxuXG4gIHZhciBvcmlnaW5hbFByb2Nlc3NSZWFsbHlFeGl0ID0gcHJvY2Vzcy5yZWFsbHlFeGl0XG4gIHZhciBwcm9jZXNzUmVhbGx5RXhpdCA9IGZ1bmN0aW9uIHByb2Nlc3NSZWFsbHlFeGl0IChjb2RlKSB7XG4gICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgaWYgKCFwcm9jZXNzT2soZ2xvYmFsLnByb2Nlc3MpKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgcHJvY2Vzcy5leGl0Q29kZSA9IGNvZGUgfHwgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi8gMFxuICAgIGVtaXQoJ2V4aXQnLCBwcm9jZXNzLmV4aXRDb2RlLCBudWxsKVxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgZW1pdCgnYWZ0ZXJleGl0JywgcHJvY2Vzcy5leGl0Q29kZSwgbnVsbClcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgIG9yaWdpbmFsUHJvY2Vzc1JlYWxseUV4aXQuY2FsbChwcm9jZXNzLCBwcm9jZXNzLmV4aXRDb2RlKVxuICB9XG5cbiAgdmFyIG9yaWdpbmFsUHJvY2Vzc0VtaXQgPSBwcm9jZXNzLmVtaXRcbiAgdmFyIHByb2Nlc3NFbWl0ID0gZnVuY3Rpb24gcHJvY2Vzc0VtaXQgKGV2LCBhcmcpIHtcbiAgICBpZiAoZXYgPT09ICdleGl0JyAmJiBwcm9jZXNzT2soZ2xvYmFsLnByb2Nlc3MpKSB7XG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgICAgaWYgKGFyZyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHByb2Nlc3MuZXhpdENvZGUgPSBhcmdcbiAgICAgIH1cbiAgICAgIHZhciByZXQgPSBvcmlnaW5hbFByb2Nlc3NFbWl0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgICBlbWl0KCdleGl0JywgcHJvY2Vzcy5leGl0Q29kZSwgbnVsbClcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgICBlbWl0KCdhZnRlcmV4aXQnLCBwcm9jZXNzLmV4aXRDb2RlLCBudWxsKVxuICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICAgIHJldHVybiByZXRcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG9yaWdpbmFsUHJvY2Vzc0VtaXQuYXBwbHkodGhpcywgYXJndW1lbnRzKVxuICAgIH1cbiAgfVxufVxuIiwiJ3VzZSBzdHJpY3QnO1xuY29uc3Qgb3MgPSByZXF1aXJlKCdvcycpO1xuY29uc3Qgb25FeGl0ID0gcmVxdWlyZSgnc2lnbmFsLWV4aXQnKTtcblxuY29uc3QgREVGQVVMVF9GT1JDRV9LSUxMX1RJTUVPVVQgPSAxMDAwICogNTtcblxuLy8gTW9ua2V5LXBhdGNoZXMgYGNoaWxkUHJvY2Vzcy5raWxsKClgIHRvIGFkZCBgZm9yY2VLaWxsQWZ0ZXJUaW1lb3V0YCBiZWhhdmlvclxuY29uc3Qgc3Bhd25lZEtpbGwgPSAoa2lsbCwgc2lnbmFsID0gJ1NJR1RFUk0nLCBvcHRpb25zID0ge30pID0+IHtcblx0Y29uc3Qga2lsbFJlc3VsdCA9IGtpbGwoc2lnbmFsKTtcblx0c2V0S2lsbFRpbWVvdXQoa2lsbCwgc2lnbmFsLCBvcHRpb25zLCBraWxsUmVzdWx0KTtcblx0cmV0dXJuIGtpbGxSZXN1bHQ7XG59O1xuXG5jb25zdCBzZXRLaWxsVGltZW91dCA9IChraWxsLCBzaWduYWwsIG9wdGlvbnMsIGtpbGxSZXN1bHQpID0+IHtcblx0aWYgKCFzaG91bGRGb3JjZUtpbGwoc2lnbmFsLCBvcHRpb25zLCBraWxsUmVzdWx0KSkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdGNvbnN0IHRpbWVvdXQgPSBnZXRGb3JjZUtpbGxBZnRlclRpbWVvdXQob3B0aW9ucyk7XG5cdGNvbnN0IHQgPSBzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRraWxsKCdTSUdLSUxMJyk7XG5cdH0sIHRpbWVvdXQpO1xuXG5cdC8vIEd1YXJkZWQgYmVjYXVzZSB0aGVyZSdzIG5vIGAudW5yZWYoKWAgd2hlbiBgZXhlY2FgIGlzIHVzZWQgaW4gdGhlIHJlbmRlcmVyXG5cdC8vIHByb2Nlc3MgaW4gRWxlY3Ryb24uIFRoaXMgY2Fubm90IGJlIHRlc3RlZCBzaW5jZSB3ZSBkb24ndCBydW4gdGVzdHMgaW5cblx0Ly8gRWxlY3Ryb24uXG5cdC8vIGlzdGFuYnVsIGlnbm9yZSBlbHNlXG5cdGlmICh0LnVucmVmKSB7XG5cdFx0dC51bnJlZigpO1xuXHR9XG59O1xuXG5jb25zdCBzaG91bGRGb3JjZUtpbGwgPSAoc2lnbmFsLCB7Zm9yY2VLaWxsQWZ0ZXJUaW1lb3V0fSwga2lsbFJlc3VsdCkgPT4ge1xuXHRyZXR1cm4gaXNTaWd0ZXJtKHNpZ25hbCkgJiYgZm9yY2VLaWxsQWZ0ZXJUaW1lb3V0ICE9PSBmYWxzZSAmJiBraWxsUmVzdWx0O1xufTtcblxuY29uc3QgaXNTaWd0ZXJtID0gc2lnbmFsID0+IHtcblx0cmV0dXJuIHNpZ25hbCA9PT0gb3MuY29uc3RhbnRzLnNpZ25hbHMuU0lHVEVSTSB8fFxuXHRcdCh0eXBlb2Ygc2lnbmFsID09PSAnc3RyaW5nJyAmJiBzaWduYWwudG9VcHBlckNhc2UoKSA9PT0gJ1NJR1RFUk0nKTtcbn07XG5cbmNvbnN0IGdldEZvcmNlS2lsbEFmdGVyVGltZW91dCA9ICh7Zm9yY2VLaWxsQWZ0ZXJUaW1lb3V0ID0gdHJ1ZX0pID0+IHtcblx0aWYgKGZvcmNlS2lsbEFmdGVyVGltZW91dCA9PT0gdHJ1ZSkge1xuXHRcdHJldHVybiBERUZBVUxUX0ZPUkNFX0tJTExfVElNRU9VVDtcblx0fVxuXG5cdGlmICghTnVtYmVyLmlzRmluaXRlKGZvcmNlS2lsbEFmdGVyVGltZW91dCkgfHwgZm9yY2VLaWxsQWZ0ZXJUaW1lb3V0IDwgMCkge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoYEV4cGVjdGVkIHRoZSBcXGBmb3JjZUtpbGxBZnRlclRpbWVvdXRcXGAgb3B0aW9uIHRvIGJlIGEgbm9uLW5lZ2F0aXZlIGludGVnZXIsIGdvdCBcXGAke2ZvcmNlS2lsbEFmdGVyVGltZW91dH1cXGAgKCR7dHlwZW9mIGZvcmNlS2lsbEFmdGVyVGltZW91dH0pYCk7XG5cdH1cblxuXHRyZXR1cm4gZm9yY2VLaWxsQWZ0ZXJUaW1lb3V0O1xufTtcblxuLy8gYGNoaWxkUHJvY2Vzcy5jYW5jZWwoKWBcbmNvbnN0IHNwYXduZWRDYW5jZWwgPSAoc3Bhd25lZCwgY29udGV4dCkgPT4ge1xuXHRjb25zdCBraWxsUmVzdWx0ID0gc3Bhd25lZC5raWxsKCk7XG5cblx0aWYgKGtpbGxSZXN1bHQpIHtcblx0XHRjb250ZXh0LmlzQ2FuY2VsZWQgPSB0cnVlO1xuXHR9XG59O1xuXG5jb25zdCB0aW1lb3V0S2lsbCA9IChzcGF3bmVkLCBzaWduYWwsIHJlamVjdCkgPT4ge1xuXHRzcGF3bmVkLmtpbGwoc2lnbmFsKTtcblx0cmVqZWN0KE9iamVjdC5hc3NpZ24obmV3IEVycm9yKCdUaW1lZCBvdXQnKSwge3RpbWVkT3V0OiB0cnVlLCBzaWduYWx9KSk7XG59O1xuXG4vLyBgdGltZW91dGAgb3B0aW9uIGhhbmRsaW5nXG5jb25zdCBzZXR1cFRpbWVvdXQgPSAoc3Bhd25lZCwge3RpbWVvdXQsIGtpbGxTaWduYWwgPSAnU0lHVEVSTSd9LCBzcGF3bmVkUHJvbWlzZSkgPT4ge1xuXHRpZiAodGltZW91dCA9PT0gMCB8fCB0aW1lb3V0ID09PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gc3Bhd25lZFByb21pc2U7XG5cdH1cblxuXHRsZXQgdGltZW91dElkO1xuXHRjb25zdCB0aW1lb3V0UHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHR0aW1lb3V0SWQgPSBzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdHRpbWVvdXRLaWxsKHNwYXduZWQsIGtpbGxTaWduYWwsIHJlamVjdCk7XG5cdFx0fSwgdGltZW91dCk7XG5cdH0pO1xuXG5cdGNvbnN0IHNhZmVTcGF3bmVkUHJvbWlzZSA9IHNwYXduZWRQcm9taXNlLmZpbmFsbHkoKCkgPT4ge1xuXHRcdGNsZWFyVGltZW91dCh0aW1lb3V0SWQpO1xuXHR9KTtcblxuXHRyZXR1cm4gUHJvbWlzZS5yYWNlKFt0aW1lb3V0UHJvbWlzZSwgc2FmZVNwYXduZWRQcm9taXNlXSk7XG59O1xuXG5jb25zdCB2YWxpZGF0ZVRpbWVvdXQgPSAoe3RpbWVvdXR9KSA9PiB7XG5cdGlmICh0aW1lb3V0ICE9PSB1bmRlZmluZWQgJiYgKCFOdW1iZXIuaXNGaW5pdGUodGltZW91dCkgfHwgdGltZW91dCA8IDApKSB7XG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcihgRXhwZWN0ZWQgdGhlIFxcYHRpbWVvdXRcXGAgb3B0aW9uIHRvIGJlIGEgbm9uLW5lZ2F0aXZlIGludGVnZXIsIGdvdCBcXGAke3RpbWVvdXR9XFxgICgke3R5cGVvZiB0aW1lb3V0fSlgKTtcblx0fVxufTtcblxuLy8gYGNsZWFudXBgIG9wdGlvbiBoYW5kbGluZ1xuY29uc3Qgc2V0RXhpdEhhbmRsZXIgPSBhc3luYyAoc3Bhd25lZCwge2NsZWFudXAsIGRldGFjaGVkfSwgdGltZWRQcm9taXNlKSA9PiB7XG5cdGlmICghY2xlYW51cCB8fCBkZXRhY2hlZCkge1xuXHRcdHJldHVybiB0aW1lZFByb21pc2U7XG5cdH1cblxuXHRjb25zdCByZW1vdmVFeGl0SGFuZGxlciA9IG9uRXhpdCgoKSA9PiB7XG5cdFx0c3Bhd25lZC5raWxsKCk7XG5cdH0pO1xuXG5cdHJldHVybiB0aW1lZFByb21pc2UuZmluYWxseSgoKSA9PiB7XG5cdFx0cmVtb3ZlRXhpdEhhbmRsZXIoKTtcblx0fSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0c3Bhd25lZEtpbGwsXG5cdHNwYXduZWRDYW5jZWwsXG5cdHNldHVwVGltZW91dCxcblx0dmFsaWRhdGVUaW1lb3V0LFxuXHRzZXRFeGl0SGFuZGxlclxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgaXNTdHJlYW0gPSBzdHJlYW0gPT5cblx0c3RyZWFtICE9PSBudWxsICYmXG5cdHR5cGVvZiBzdHJlYW0gPT09ICdvYmplY3QnICYmXG5cdHR5cGVvZiBzdHJlYW0ucGlwZSA9PT0gJ2Z1bmN0aW9uJztcblxuaXNTdHJlYW0ud3JpdGFibGUgPSBzdHJlYW0gPT5cblx0aXNTdHJlYW0oc3RyZWFtKSAmJlxuXHRzdHJlYW0ud3JpdGFibGUgIT09IGZhbHNlICYmXG5cdHR5cGVvZiBzdHJlYW0uX3dyaXRlID09PSAnZnVuY3Rpb24nICYmXG5cdHR5cGVvZiBzdHJlYW0uX3dyaXRhYmxlU3RhdGUgPT09ICdvYmplY3QnO1xuXG5pc1N0cmVhbS5yZWFkYWJsZSA9IHN0cmVhbSA9PlxuXHRpc1N0cmVhbShzdHJlYW0pICYmXG5cdHN0cmVhbS5yZWFkYWJsZSAhPT0gZmFsc2UgJiZcblx0dHlwZW9mIHN0cmVhbS5fcmVhZCA9PT0gJ2Z1bmN0aW9uJyAmJlxuXHR0eXBlb2Ygc3RyZWFtLl9yZWFkYWJsZVN0YXRlID09PSAnb2JqZWN0JztcblxuaXNTdHJlYW0uZHVwbGV4ID0gc3RyZWFtID0+XG5cdGlzU3RyZWFtLndyaXRhYmxlKHN0cmVhbSkgJiZcblx0aXNTdHJlYW0ucmVhZGFibGUoc3RyZWFtKTtcblxuaXNTdHJlYW0udHJhbnNmb3JtID0gc3RyZWFtID0+XG5cdGlzU3RyZWFtLmR1cGxleChzdHJlYW0pICYmXG5cdHR5cGVvZiBzdHJlYW0uX3RyYW5zZm9ybSA9PT0gJ2Z1bmN0aW9uJztcblxubW9kdWxlLmV4cG9ydHMgPSBpc1N0cmVhbTtcbiIsIid1c2Ugc3RyaWN0JztcbmNvbnN0IHtQYXNzVGhyb3VnaDogUGFzc1Rocm91Z2hTdHJlYW19ID0gcmVxdWlyZSgnc3RyZWFtJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gb3B0aW9ucyA9PiB7XG5cdG9wdGlvbnMgPSB7Li4ub3B0aW9uc307XG5cblx0Y29uc3Qge2FycmF5fSA9IG9wdGlvbnM7XG5cdGxldCB7ZW5jb2Rpbmd9ID0gb3B0aW9ucztcblx0Y29uc3QgaXNCdWZmZXIgPSBlbmNvZGluZyA9PT0gJ2J1ZmZlcic7XG5cdGxldCBvYmplY3RNb2RlID0gZmFsc2U7XG5cblx0aWYgKGFycmF5KSB7XG5cdFx0b2JqZWN0TW9kZSA9ICEoZW5jb2RpbmcgfHwgaXNCdWZmZXIpO1xuXHR9IGVsc2Uge1xuXHRcdGVuY29kaW5nID0gZW5jb2RpbmcgfHwgJ3V0ZjgnO1xuXHR9XG5cblx0aWYgKGlzQnVmZmVyKSB7XG5cdFx0ZW5jb2RpbmcgPSBudWxsO1xuXHR9XG5cblx0Y29uc3Qgc3RyZWFtID0gbmV3IFBhc3NUaHJvdWdoU3RyZWFtKHtvYmplY3RNb2RlfSk7XG5cblx0aWYgKGVuY29kaW5nKSB7XG5cdFx0c3RyZWFtLnNldEVuY29kaW5nKGVuY29kaW5nKTtcblx0fVxuXG5cdGxldCBsZW5ndGggPSAwO1xuXHRjb25zdCBjaHVua3MgPSBbXTtcblxuXHRzdHJlYW0ub24oJ2RhdGEnLCBjaHVuayA9PiB7XG5cdFx0Y2h1bmtzLnB1c2goY2h1bmspO1xuXG5cdFx0aWYgKG9iamVjdE1vZGUpIHtcblx0XHRcdGxlbmd0aCA9IGNodW5rcy5sZW5ndGg7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGxlbmd0aCArPSBjaHVuay5sZW5ndGg7XG5cdFx0fVxuXHR9KTtcblxuXHRzdHJlYW0uZ2V0QnVmZmVyZWRWYWx1ZSA9ICgpID0+IHtcblx0XHRpZiAoYXJyYXkpIHtcblx0XHRcdHJldHVybiBjaHVua3M7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGlzQnVmZmVyID8gQnVmZmVyLmNvbmNhdChjaHVua3MsIGxlbmd0aCkgOiBjaHVua3Muam9pbignJyk7XG5cdH07XG5cblx0c3RyZWFtLmdldEJ1ZmZlcmVkTGVuZ3RoID0gKCkgPT4gbGVuZ3RoO1xuXG5cdHJldHVybiBzdHJlYW07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuY29uc3Qge2NvbnN0YW50czogQnVmZmVyQ29uc3RhbnRzfSA9IHJlcXVpcmUoJ2J1ZmZlcicpO1xuY29uc3Qgc3RyZWFtID0gcmVxdWlyZSgnc3RyZWFtJyk7XG5jb25zdCB7cHJvbWlzaWZ5fSA9IHJlcXVpcmUoJ3V0aWwnKTtcbmNvbnN0IGJ1ZmZlclN0cmVhbSA9IHJlcXVpcmUoJy4vYnVmZmVyLXN0cmVhbScpO1xuXG5jb25zdCBzdHJlYW1QaXBlbGluZVByb21pc2lmaWVkID0gcHJvbWlzaWZ5KHN0cmVhbS5waXBlbGluZSk7XG5cbmNsYXNzIE1heEJ1ZmZlckVycm9yIGV4dGVuZHMgRXJyb3Ige1xuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcignbWF4QnVmZmVyIGV4Y2VlZGVkJyk7XG5cdFx0dGhpcy5uYW1lID0gJ01heEJ1ZmZlckVycm9yJztcblx0fVxufVxuXG5hc3luYyBmdW5jdGlvbiBnZXRTdHJlYW0oaW5wdXRTdHJlYW0sIG9wdGlvbnMpIHtcblx0aWYgKCFpbnB1dFN0cmVhbSkge1xuXHRcdHRocm93IG5ldyBFcnJvcignRXhwZWN0ZWQgYSBzdHJlYW0nKTtcblx0fVxuXG5cdG9wdGlvbnMgPSB7XG5cdFx0bWF4QnVmZmVyOiBJbmZpbml0eSxcblx0XHQuLi5vcHRpb25zXG5cdH07XG5cblx0Y29uc3Qge21heEJ1ZmZlcn0gPSBvcHRpb25zO1xuXHRjb25zdCBzdHJlYW0gPSBidWZmZXJTdHJlYW0ob3B0aW9ucyk7XG5cblx0YXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdGNvbnN0IHJlamVjdFByb21pc2UgPSBlcnJvciA9PiB7XG5cdFx0XHQvLyBEb24ndCByZXRyaWV2ZSBhbiBvdmVyc2l6ZWQgYnVmZmVyLlxuXHRcdFx0aWYgKGVycm9yICYmIHN0cmVhbS5nZXRCdWZmZXJlZExlbmd0aCgpIDw9IEJ1ZmZlckNvbnN0YW50cy5NQVhfTEVOR1RIKSB7XG5cdFx0XHRcdGVycm9yLmJ1ZmZlcmVkRGF0YSA9IHN0cmVhbS5nZXRCdWZmZXJlZFZhbHVlKCk7XG5cdFx0XHR9XG5cblx0XHRcdHJlamVjdChlcnJvcik7XG5cdFx0fTtcblxuXHRcdChhc3luYyAoKSA9PiB7XG5cdFx0XHR0cnkge1xuXHRcdFx0XHRhd2FpdCBzdHJlYW1QaXBlbGluZVByb21pc2lmaWVkKGlucHV0U3RyZWFtLCBzdHJlYW0pO1xuXHRcdFx0XHRyZXNvbHZlKCk7XG5cdFx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0XHRyZWplY3RQcm9taXNlKGVycm9yKTtcblx0XHRcdH1cblx0XHR9KSgpO1xuXG5cdFx0c3RyZWFtLm9uKCdkYXRhJywgKCkgPT4ge1xuXHRcdFx0aWYgKHN0cmVhbS5nZXRCdWZmZXJlZExlbmd0aCgpID4gbWF4QnVmZmVyKSB7XG5cdFx0XHRcdHJlamVjdFByb21pc2UobmV3IE1heEJ1ZmZlckVycm9yKCkpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9KTtcblxuXHRyZXR1cm4gc3RyZWFtLmdldEJ1ZmZlcmVkVmFsdWUoKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRTdHJlYW07XG5tb2R1bGUuZXhwb3J0cy5idWZmZXIgPSAoc3RyZWFtLCBvcHRpb25zKSA9PiBnZXRTdHJlYW0oc3RyZWFtLCB7Li4ub3B0aW9ucywgZW5jb2Rpbmc6ICdidWZmZXInfSk7XG5tb2R1bGUuZXhwb3J0cy5hcnJheSA9IChzdHJlYW0sIG9wdGlvbnMpID0+IGdldFN0cmVhbShzdHJlYW0sIHsuLi5vcHRpb25zLCBhcnJheTogdHJ1ZX0pO1xubW9kdWxlLmV4cG9ydHMuTWF4QnVmZmVyRXJyb3IgPSBNYXhCdWZmZXJFcnJvcjtcbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgeyBQYXNzVGhyb3VnaCB9ID0gcmVxdWlyZSgnc3RyZWFtJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKC8qc3RyZWFtcy4uLiovKSB7XG4gIHZhciBzb3VyY2VzID0gW11cbiAgdmFyIG91dHB1dCAgPSBuZXcgUGFzc1Rocm91Z2goe29iamVjdE1vZGU6IHRydWV9KVxuXG4gIG91dHB1dC5zZXRNYXhMaXN0ZW5lcnMoMClcblxuICBvdXRwdXQuYWRkID0gYWRkXG4gIG91dHB1dC5pc0VtcHR5ID0gaXNFbXB0eVxuXG4gIG91dHB1dC5vbigndW5waXBlJywgcmVtb3ZlKVxuXG4gIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cykuZm9yRWFjaChhZGQpXG5cbiAgcmV0dXJuIG91dHB1dFxuXG4gIGZ1bmN0aW9uIGFkZCAoc291cmNlKSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoc291cmNlKSkge1xuICAgICAgc291cmNlLmZvckVhY2goYWRkKVxuICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICBzb3VyY2VzLnB1c2goc291cmNlKTtcbiAgICBzb3VyY2Uub25jZSgnZW5kJywgcmVtb3ZlLmJpbmQobnVsbCwgc291cmNlKSlcbiAgICBzb3VyY2Uub25jZSgnZXJyb3InLCBvdXRwdXQuZW1pdC5iaW5kKG91dHB1dCwgJ2Vycm9yJykpXG4gICAgc291cmNlLnBpcGUob3V0cHV0LCB7ZW5kOiBmYWxzZX0pXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzRW1wdHkgKCkge1xuICAgIHJldHVybiBzb3VyY2VzLmxlbmd0aCA9PSAwO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVtb3ZlIChzb3VyY2UpIHtcbiAgICBzb3VyY2VzID0gc291cmNlcy5maWx0ZXIoZnVuY3Rpb24gKGl0KSB7IHJldHVybiBpdCAhPT0gc291cmNlIH0pXG4gICAgaWYgKCFzb3VyY2VzLmxlbmd0aCAmJiBvdXRwdXQucmVhZGFibGUpIHsgb3V0cHV0LmVuZCgpIH1cbiAgfVxufVxuIiwiJ3VzZSBzdHJpY3QnO1xuY29uc3QgaXNTdHJlYW0gPSByZXF1aXJlKCdpcy1zdHJlYW0nKTtcbmNvbnN0IGdldFN0cmVhbSA9IHJlcXVpcmUoJ2dldC1zdHJlYW0nKTtcbmNvbnN0IG1lcmdlU3RyZWFtID0gcmVxdWlyZSgnbWVyZ2Utc3RyZWFtJyk7XG5cbi8vIGBpbnB1dGAgb3B0aW9uXG5jb25zdCBoYW5kbGVJbnB1dCA9IChzcGF3bmVkLCBpbnB1dCkgPT4ge1xuXHQvLyBDaGVja2luZyBmb3Igc3RkaW4gaXMgd29ya2Fyb3VuZCBmb3IgaHR0cHM6Ly9naXRodWIuY29tL25vZGVqcy9ub2RlL2lzc3Vlcy8yNjg1MlxuXHQvLyBAdG9kbyByZW1vdmUgYHx8IHNwYXduZWQuc3RkaW4gPT09IHVuZGVmaW5lZGAgb25jZSB3ZSBkcm9wIHN1cHBvcnQgZm9yIE5vZGUuanMgPD0xMi4yLjBcblx0aWYgKGlucHV0ID09PSB1bmRlZmluZWQgfHwgc3Bhd25lZC5zdGRpbiA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0aWYgKGlzU3RyZWFtKGlucHV0KSkge1xuXHRcdGlucHV0LnBpcGUoc3Bhd25lZC5zdGRpbik7XG5cdH0gZWxzZSB7XG5cdFx0c3Bhd25lZC5zdGRpbi5lbmQoaW5wdXQpO1xuXHR9XG59O1xuXG4vLyBgYWxsYCBpbnRlcmxlYXZlcyBgc3Rkb3V0YCBhbmQgYHN0ZGVycmBcbmNvbnN0IG1ha2VBbGxTdHJlYW0gPSAoc3Bhd25lZCwge2FsbH0pID0+IHtcblx0aWYgKCFhbGwgfHwgKCFzcGF3bmVkLnN0ZG91dCAmJiAhc3Bhd25lZC5zdGRlcnIpKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0Y29uc3QgbWl4ZWQgPSBtZXJnZVN0cmVhbSgpO1xuXG5cdGlmIChzcGF3bmVkLnN0ZG91dCkge1xuXHRcdG1peGVkLmFkZChzcGF3bmVkLnN0ZG91dCk7XG5cdH1cblxuXHRpZiAoc3Bhd25lZC5zdGRlcnIpIHtcblx0XHRtaXhlZC5hZGQoc3Bhd25lZC5zdGRlcnIpO1xuXHR9XG5cblx0cmV0dXJuIG1peGVkO1xufTtcblxuLy8gT24gZmFpbHVyZSwgYHJlc3VsdC5zdGRvdXR8c3RkZXJyfGFsbGAgc2hvdWxkIGNvbnRhaW4gdGhlIGN1cnJlbnRseSBidWZmZXJlZCBzdHJlYW1cbmNvbnN0IGdldEJ1ZmZlcmVkRGF0YSA9IGFzeW5jIChzdHJlYW0sIHN0cmVhbVByb21pc2UpID0+IHtcblx0aWYgKCFzdHJlYW0pIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRzdHJlYW0uZGVzdHJveSgpO1xuXG5cdHRyeSB7XG5cdFx0cmV0dXJuIGF3YWl0IHN0cmVhbVByb21pc2U7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0cmV0dXJuIGVycm9yLmJ1ZmZlcmVkRGF0YTtcblx0fVxufTtcblxuY29uc3QgZ2V0U3RyZWFtUHJvbWlzZSA9IChzdHJlYW0sIHtlbmNvZGluZywgYnVmZmVyLCBtYXhCdWZmZXJ9KSA9PiB7XG5cdGlmICghc3RyZWFtIHx8ICFidWZmZXIpIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRpZiAoZW5jb2RpbmcpIHtcblx0XHRyZXR1cm4gZ2V0U3RyZWFtKHN0cmVhbSwge2VuY29kaW5nLCBtYXhCdWZmZXJ9KTtcblx0fVxuXG5cdHJldHVybiBnZXRTdHJlYW0uYnVmZmVyKHN0cmVhbSwge21heEJ1ZmZlcn0pO1xufTtcblxuLy8gUmV0cmlldmUgcmVzdWx0IG9mIGNoaWxkIHByb2Nlc3M6IGV4aXQgY29kZSwgc2lnbmFsLCBlcnJvciwgc3RyZWFtcyAoc3Rkb3V0L3N0ZGVyci9hbGwpXG5jb25zdCBnZXRTcGF3bmVkUmVzdWx0ID0gYXN5bmMgKHtzdGRvdXQsIHN0ZGVyciwgYWxsfSwge2VuY29kaW5nLCBidWZmZXIsIG1heEJ1ZmZlcn0sIHByb2Nlc3NEb25lKSA9PiB7XG5cdGNvbnN0IHN0ZG91dFByb21pc2UgPSBnZXRTdHJlYW1Qcm9taXNlKHN0ZG91dCwge2VuY29kaW5nLCBidWZmZXIsIG1heEJ1ZmZlcn0pO1xuXHRjb25zdCBzdGRlcnJQcm9taXNlID0gZ2V0U3RyZWFtUHJvbWlzZShzdGRlcnIsIHtlbmNvZGluZywgYnVmZmVyLCBtYXhCdWZmZXJ9KTtcblx0Y29uc3QgYWxsUHJvbWlzZSA9IGdldFN0cmVhbVByb21pc2UoYWxsLCB7ZW5jb2RpbmcsIGJ1ZmZlciwgbWF4QnVmZmVyOiBtYXhCdWZmZXIgKiAyfSk7XG5cblx0dHJ5IHtcblx0XHRyZXR1cm4gYXdhaXQgUHJvbWlzZS5hbGwoW3Byb2Nlc3NEb25lLCBzdGRvdXRQcm9taXNlLCBzdGRlcnJQcm9taXNlLCBhbGxQcm9taXNlXSk7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0cmV0dXJuIFByb21pc2UuYWxsKFtcblx0XHRcdHtlcnJvciwgc2lnbmFsOiBlcnJvci5zaWduYWwsIHRpbWVkT3V0OiBlcnJvci50aW1lZE91dH0sXG5cdFx0XHRnZXRCdWZmZXJlZERhdGEoc3Rkb3V0LCBzdGRvdXRQcm9taXNlKSxcblx0XHRcdGdldEJ1ZmZlcmVkRGF0YShzdGRlcnIsIHN0ZGVyclByb21pc2UpLFxuXHRcdFx0Z2V0QnVmZmVyZWREYXRhKGFsbCwgYWxsUHJvbWlzZSlcblx0XHRdKTtcblx0fVxufTtcblxuY29uc3QgdmFsaWRhdGVJbnB1dFN5bmMgPSAoe2lucHV0fSkgPT4ge1xuXHRpZiAoaXNTdHJlYW0oaW5wdXQpKSB7XG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIGBpbnB1dGAgb3B0aW9uIGNhbm5vdCBiZSBhIHN0cmVhbSBpbiBzeW5jIG1vZGUnKTtcblx0fVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdGhhbmRsZUlucHV0LFxuXHRtYWtlQWxsU3RyZWFtLFxuXHRnZXRTcGF3bmVkUmVzdWx0LFxuXHR2YWxpZGF0ZUlucHV0U3luY1xufTtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBuYXRpdmVQcm9taXNlUHJvdG90eXBlID0gKGFzeW5jICgpID0+IHt9KSgpLmNvbnN0cnVjdG9yLnByb3RvdHlwZTtcbmNvbnN0IGRlc2NyaXB0b3JzID0gWyd0aGVuJywgJ2NhdGNoJywgJ2ZpbmFsbHknXS5tYXAocHJvcGVydHkgPT4gW1xuXHRwcm9wZXJ0eSxcblx0UmVmbGVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobmF0aXZlUHJvbWlzZVByb3RvdHlwZSwgcHJvcGVydHkpXG5dKTtcblxuLy8gVGhlIHJldHVybiB2YWx1ZSBpcyBhIG1peGluIG9mIGBjaGlsZFByb2Nlc3NgIGFuZCBgUHJvbWlzZWBcbmNvbnN0IG1lcmdlUHJvbWlzZSA9IChzcGF3bmVkLCBwcm9taXNlKSA9PiB7XG5cdGZvciAoY29uc3QgW3Byb3BlcnR5LCBkZXNjcmlwdG9yXSBvZiBkZXNjcmlwdG9ycykge1xuXHRcdC8vIFN0YXJ0aW5nIHRoZSBtYWluIGBwcm9taXNlYCBpcyBkZWZlcnJlZCB0byBhdm9pZCBjb25zdW1pbmcgc3RyZWFtc1xuXHRcdGNvbnN0IHZhbHVlID0gdHlwZW9mIHByb21pc2UgPT09ICdmdW5jdGlvbicgP1xuXHRcdFx0KC4uLmFyZ3MpID0+IFJlZmxlY3QuYXBwbHkoZGVzY3JpcHRvci52YWx1ZSwgcHJvbWlzZSgpLCBhcmdzKSA6XG5cdFx0XHRkZXNjcmlwdG9yLnZhbHVlLmJpbmQocHJvbWlzZSk7XG5cblx0XHRSZWZsZWN0LmRlZmluZVByb3BlcnR5KHNwYXduZWQsIHByb3BlcnR5LCB7Li4uZGVzY3JpcHRvciwgdmFsdWV9KTtcblx0fVxuXG5cdHJldHVybiBzcGF3bmVkO1xufTtcblxuLy8gVXNlIHByb21pc2VzIGluc3RlYWQgb2YgYGNoaWxkX3Byb2Nlc3NgIGV2ZW50c1xuY29uc3QgZ2V0U3Bhd25lZFByb21pc2UgPSBzcGF3bmVkID0+IHtcblx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRzcGF3bmVkLm9uKCdleGl0JywgKGV4aXRDb2RlLCBzaWduYWwpID0+IHtcblx0XHRcdHJlc29sdmUoe2V4aXRDb2RlLCBzaWduYWx9KTtcblx0XHR9KTtcblxuXHRcdHNwYXduZWQub24oJ2Vycm9yJywgZXJyb3IgPT4ge1xuXHRcdFx0cmVqZWN0KGVycm9yKTtcblx0XHR9KTtcblxuXHRcdGlmIChzcGF3bmVkLnN0ZGluKSB7XG5cdFx0XHRzcGF3bmVkLnN0ZGluLm9uKCdlcnJvcicsIGVycm9yID0+IHtcblx0XHRcdFx0cmVqZWN0KGVycm9yKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0bWVyZ2VQcm9taXNlLFxuXHRnZXRTcGF3bmVkUHJvbWlzZVxufTtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuY29uc3Qgbm9ybWFsaXplQXJncyA9IChmaWxlLCBhcmdzID0gW10pID0+IHtcblx0aWYgKCFBcnJheS5pc0FycmF5KGFyZ3MpKSB7XG5cdFx0cmV0dXJuIFtmaWxlXTtcblx0fVxuXG5cdHJldHVybiBbZmlsZSwgLi4uYXJnc107XG59O1xuXG5jb25zdCBOT19FU0NBUEVfUkVHRVhQID0gL15bXFx3Li1dKyQvO1xuY29uc3QgRE9VQkxFX1FVT1RFU19SRUdFWFAgPSAvXCIvZztcblxuY29uc3QgZXNjYXBlQXJnID0gYXJnID0+IHtcblx0aWYgKHR5cGVvZiBhcmcgIT09ICdzdHJpbmcnIHx8IE5PX0VTQ0FQRV9SRUdFWFAudGVzdChhcmcpKSB7XG5cdFx0cmV0dXJuIGFyZztcblx0fVxuXG5cdHJldHVybiBgXCIke2FyZy5yZXBsYWNlKERPVUJMRV9RVU9URVNfUkVHRVhQLCAnXFxcXFwiJyl9XCJgO1xufTtcblxuY29uc3Qgam9pbkNvbW1hbmQgPSAoZmlsZSwgYXJncykgPT4ge1xuXHRyZXR1cm4gbm9ybWFsaXplQXJncyhmaWxlLCBhcmdzKS5qb2luKCcgJyk7XG59O1xuXG5jb25zdCBnZXRFc2NhcGVkQ29tbWFuZCA9IChmaWxlLCBhcmdzKSA9PiB7XG5cdHJldHVybiBub3JtYWxpemVBcmdzKGZpbGUsIGFyZ3MpLm1hcChhcmcgPT4gZXNjYXBlQXJnKGFyZykpLmpvaW4oJyAnKTtcbn07XG5cbmNvbnN0IFNQQUNFU19SRUdFWFAgPSAvICsvZztcblxuLy8gSGFuZGxlIGBleGVjYS5jb21tYW5kKClgXG5jb25zdCBwYXJzZUNvbW1hbmQgPSBjb21tYW5kID0+IHtcblx0Y29uc3QgdG9rZW5zID0gW107XG5cdGZvciAoY29uc3QgdG9rZW4gb2YgY29tbWFuZC50cmltKCkuc3BsaXQoU1BBQ0VTX1JFR0VYUCkpIHtcblx0XHQvLyBBbGxvdyBzcGFjZXMgdG8gYmUgZXNjYXBlZCBieSBhIGJhY2tzbGFzaCBpZiBub3QgbWVhbnQgYXMgYSBkZWxpbWl0ZXJcblx0XHRjb25zdCBwcmV2aW91c1Rva2VuID0gdG9rZW5zW3Rva2Vucy5sZW5ndGggLSAxXTtcblx0XHRpZiAocHJldmlvdXNUb2tlbiAmJiBwcmV2aW91c1Rva2VuLmVuZHNXaXRoKCdcXFxcJykpIHtcblx0XHRcdC8vIE1lcmdlIHByZXZpb3VzIHRva2VuIHdpdGggY3VycmVudCBvbmVcblx0XHRcdHRva2Vuc1t0b2tlbnMubGVuZ3RoIC0gMV0gPSBgJHtwcmV2aW91c1Rva2VuLnNsaWNlKDAsIC0xKX0gJHt0b2tlbn1gO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0b2tlbnMucHVzaCh0b2tlbik7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHRva2Vucztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRqb2luQ29tbWFuZCxcblx0Z2V0RXNjYXBlZENvbW1hbmQsXG5cdHBhcnNlQ29tbWFuZFxufTtcbiIsIid1c2Ugc3RyaWN0JztcbmNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG5jb25zdCBjaGlsZFByb2Nlc3MgPSByZXF1aXJlKCdjaGlsZF9wcm9jZXNzJyk7XG5jb25zdCBjcm9zc1NwYXduID0gcmVxdWlyZSgnY3Jvc3Mtc3Bhd24nKTtcbmNvbnN0IHN0cmlwRmluYWxOZXdsaW5lID0gcmVxdWlyZSgnc3RyaXAtZmluYWwtbmV3bGluZScpO1xuY29uc3QgbnBtUnVuUGF0aCA9IHJlcXVpcmUoJ25wbS1ydW4tcGF0aCcpO1xuY29uc3Qgb25ldGltZSA9IHJlcXVpcmUoJ29uZXRpbWUnKTtcbmNvbnN0IG1ha2VFcnJvciA9IHJlcXVpcmUoJy4vbGliL2Vycm9yJyk7XG5jb25zdCBub3JtYWxpemVTdGRpbyA9IHJlcXVpcmUoJy4vbGliL3N0ZGlvJyk7XG5jb25zdCB7c3Bhd25lZEtpbGwsIHNwYXduZWRDYW5jZWwsIHNldHVwVGltZW91dCwgdmFsaWRhdGVUaW1lb3V0LCBzZXRFeGl0SGFuZGxlcn0gPSByZXF1aXJlKCcuL2xpYi9raWxsJyk7XG5jb25zdCB7aGFuZGxlSW5wdXQsIGdldFNwYXduZWRSZXN1bHQsIG1ha2VBbGxTdHJlYW0sIHZhbGlkYXRlSW5wdXRTeW5jfSA9IHJlcXVpcmUoJy4vbGliL3N0cmVhbScpO1xuY29uc3Qge21lcmdlUHJvbWlzZSwgZ2V0U3Bhd25lZFByb21pc2V9ID0gcmVxdWlyZSgnLi9saWIvcHJvbWlzZScpO1xuY29uc3Qge2pvaW5Db21tYW5kLCBwYXJzZUNvbW1hbmQsIGdldEVzY2FwZWRDb21tYW5kfSA9IHJlcXVpcmUoJy4vbGliL2NvbW1hbmQnKTtcblxuY29uc3QgREVGQVVMVF9NQVhfQlVGRkVSID0gMTAwMCAqIDEwMDAgKiAxMDA7XG5cbmNvbnN0IGdldEVudiA9ICh7ZW52OiBlbnZPcHRpb24sIGV4dGVuZEVudiwgcHJlZmVyTG9jYWwsIGxvY2FsRGlyLCBleGVjUGF0aH0pID0+IHtcblx0Y29uc3QgZW52ID0gZXh0ZW5kRW52ID8gey4uLnByb2Nlc3MuZW52LCAuLi5lbnZPcHRpb259IDogZW52T3B0aW9uO1xuXG5cdGlmIChwcmVmZXJMb2NhbCkge1xuXHRcdHJldHVybiBucG1SdW5QYXRoLmVudih7ZW52LCBjd2Q6IGxvY2FsRGlyLCBleGVjUGF0aH0pO1xuXHR9XG5cblx0cmV0dXJuIGVudjtcbn07XG5cbmNvbnN0IGhhbmRsZUFyZ3VtZW50cyA9IChmaWxlLCBhcmdzLCBvcHRpb25zID0ge30pID0+IHtcblx0Y29uc3QgcGFyc2VkID0gY3Jvc3NTcGF3bi5fcGFyc2UoZmlsZSwgYXJncywgb3B0aW9ucyk7XG5cdGZpbGUgPSBwYXJzZWQuY29tbWFuZDtcblx0YXJncyA9IHBhcnNlZC5hcmdzO1xuXHRvcHRpb25zID0gcGFyc2VkLm9wdGlvbnM7XG5cblx0b3B0aW9ucyA9IHtcblx0XHRtYXhCdWZmZXI6IERFRkFVTFRfTUFYX0JVRkZFUixcblx0XHRidWZmZXI6IHRydWUsXG5cdFx0c3RyaXBGaW5hbE5ld2xpbmU6IHRydWUsXG5cdFx0ZXh0ZW5kRW52OiB0cnVlLFxuXHRcdHByZWZlckxvY2FsOiBmYWxzZSxcblx0XHRsb2NhbERpcjogb3B0aW9ucy5jd2QgfHwgcHJvY2Vzcy5jd2QoKSxcblx0XHRleGVjUGF0aDogcHJvY2Vzcy5leGVjUGF0aCxcblx0XHRlbmNvZGluZzogJ3V0ZjgnLFxuXHRcdHJlamVjdDogdHJ1ZSxcblx0XHRjbGVhbnVwOiB0cnVlLFxuXHRcdGFsbDogZmFsc2UsXG5cdFx0d2luZG93c0hpZGU6IHRydWUsXG5cdFx0Li4ub3B0aW9uc1xuXHR9O1xuXG5cdG9wdGlvbnMuZW52ID0gZ2V0RW52KG9wdGlvbnMpO1xuXG5cdG9wdGlvbnMuc3RkaW8gPSBub3JtYWxpemVTdGRpbyhvcHRpb25zKTtcblxuXHRpZiAocHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ3dpbjMyJyAmJiBwYXRoLmJhc2VuYW1lKGZpbGUsICcuZXhlJykgPT09ICdjbWQnKSB7XG5cdFx0Ly8gIzExNlxuXHRcdGFyZ3MudW5zaGlmdCgnL3EnKTtcblx0fVxuXG5cdHJldHVybiB7ZmlsZSwgYXJncywgb3B0aW9ucywgcGFyc2VkfTtcbn07XG5cbmNvbnN0IGhhbmRsZU91dHB1dCA9IChvcHRpb25zLCB2YWx1ZSwgZXJyb3IpID0+IHtcblx0aWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ3N0cmluZycgJiYgIUJ1ZmZlci5pc0J1ZmZlcih2YWx1ZSkpIHtcblx0XHQvLyBXaGVuIGBleGVjYS5zeW5jKClgIGVycm9ycywgd2Ugbm9ybWFsaXplIGl0IHRvICcnIHRvIG1pbWljIGBleGVjYSgpYFxuXHRcdHJldHVybiBlcnJvciA9PT0gdW5kZWZpbmVkID8gdW5kZWZpbmVkIDogJyc7XG5cdH1cblxuXHRpZiAob3B0aW9ucy5zdHJpcEZpbmFsTmV3bGluZSkge1xuXHRcdHJldHVybiBzdHJpcEZpbmFsTmV3bGluZSh2YWx1ZSk7XG5cdH1cblxuXHRyZXR1cm4gdmFsdWU7XG59O1xuXG5jb25zdCBleGVjYSA9IChmaWxlLCBhcmdzLCBvcHRpb25zKSA9PiB7XG5cdGNvbnN0IHBhcnNlZCA9IGhhbmRsZUFyZ3VtZW50cyhmaWxlLCBhcmdzLCBvcHRpb25zKTtcblx0Y29uc3QgY29tbWFuZCA9IGpvaW5Db21tYW5kKGZpbGUsIGFyZ3MpO1xuXHRjb25zdCBlc2NhcGVkQ29tbWFuZCA9IGdldEVzY2FwZWRDb21tYW5kKGZpbGUsIGFyZ3MpO1xuXG5cdHZhbGlkYXRlVGltZW91dChwYXJzZWQub3B0aW9ucyk7XG5cblx0bGV0IHNwYXduZWQ7XG5cdHRyeSB7XG5cdFx0c3Bhd25lZCA9IGNoaWxkUHJvY2Vzcy5zcGF3bihwYXJzZWQuZmlsZSwgcGFyc2VkLmFyZ3MsIHBhcnNlZC5vcHRpb25zKTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHQvLyBFbnN1cmUgdGhlIHJldHVybmVkIGVycm9yIGlzIGFsd2F5cyBib3RoIGEgcHJvbWlzZSBhbmQgYSBjaGlsZCBwcm9jZXNzXG5cdFx0Y29uc3QgZHVtbXlTcGF3bmVkID0gbmV3IGNoaWxkUHJvY2Vzcy5DaGlsZFByb2Nlc3MoKTtcblx0XHRjb25zdCBlcnJvclByb21pc2UgPSBQcm9taXNlLnJlamVjdChtYWtlRXJyb3Ioe1xuXHRcdFx0ZXJyb3IsXG5cdFx0XHRzdGRvdXQ6ICcnLFxuXHRcdFx0c3RkZXJyOiAnJyxcblx0XHRcdGFsbDogJycsXG5cdFx0XHRjb21tYW5kLFxuXHRcdFx0ZXNjYXBlZENvbW1hbmQsXG5cdFx0XHRwYXJzZWQsXG5cdFx0XHR0aW1lZE91dDogZmFsc2UsXG5cdFx0XHRpc0NhbmNlbGVkOiBmYWxzZSxcblx0XHRcdGtpbGxlZDogZmFsc2Vcblx0XHR9KSk7XG5cdFx0cmV0dXJuIG1lcmdlUHJvbWlzZShkdW1teVNwYXduZWQsIGVycm9yUHJvbWlzZSk7XG5cdH1cblxuXHRjb25zdCBzcGF3bmVkUHJvbWlzZSA9IGdldFNwYXduZWRQcm9taXNlKHNwYXduZWQpO1xuXHRjb25zdCB0aW1lZFByb21pc2UgPSBzZXR1cFRpbWVvdXQoc3Bhd25lZCwgcGFyc2VkLm9wdGlvbnMsIHNwYXduZWRQcm9taXNlKTtcblx0Y29uc3QgcHJvY2Vzc0RvbmUgPSBzZXRFeGl0SGFuZGxlcihzcGF3bmVkLCBwYXJzZWQub3B0aW9ucywgdGltZWRQcm9taXNlKTtcblxuXHRjb25zdCBjb250ZXh0ID0ge2lzQ2FuY2VsZWQ6IGZhbHNlfTtcblxuXHRzcGF3bmVkLmtpbGwgPSBzcGF3bmVkS2lsbC5iaW5kKG51bGwsIHNwYXduZWQua2lsbC5iaW5kKHNwYXduZWQpKTtcblx0c3Bhd25lZC5jYW5jZWwgPSBzcGF3bmVkQ2FuY2VsLmJpbmQobnVsbCwgc3Bhd25lZCwgY29udGV4dCk7XG5cblx0Y29uc3QgaGFuZGxlUHJvbWlzZSA9IGFzeW5jICgpID0+IHtcblx0XHRjb25zdCBbe2Vycm9yLCBleGl0Q29kZSwgc2lnbmFsLCB0aW1lZE91dH0sIHN0ZG91dFJlc3VsdCwgc3RkZXJyUmVzdWx0LCBhbGxSZXN1bHRdID0gYXdhaXQgZ2V0U3Bhd25lZFJlc3VsdChzcGF3bmVkLCBwYXJzZWQub3B0aW9ucywgcHJvY2Vzc0RvbmUpO1xuXHRcdGNvbnN0IHN0ZG91dCA9IGhhbmRsZU91dHB1dChwYXJzZWQub3B0aW9ucywgc3Rkb3V0UmVzdWx0KTtcblx0XHRjb25zdCBzdGRlcnIgPSBoYW5kbGVPdXRwdXQocGFyc2VkLm9wdGlvbnMsIHN0ZGVyclJlc3VsdCk7XG5cdFx0Y29uc3QgYWxsID0gaGFuZGxlT3V0cHV0KHBhcnNlZC5vcHRpb25zLCBhbGxSZXN1bHQpO1xuXG5cdFx0aWYgKGVycm9yIHx8IGV4aXRDb2RlICE9PSAwIHx8IHNpZ25hbCAhPT0gbnVsbCkge1xuXHRcdFx0Y29uc3QgcmV0dXJuZWRFcnJvciA9IG1ha2VFcnJvcih7XG5cdFx0XHRcdGVycm9yLFxuXHRcdFx0XHRleGl0Q29kZSxcblx0XHRcdFx0c2lnbmFsLFxuXHRcdFx0XHRzdGRvdXQsXG5cdFx0XHRcdHN0ZGVycixcblx0XHRcdFx0YWxsLFxuXHRcdFx0XHRjb21tYW5kLFxuXHRcdFx0XHRlc2NhcGVkQ29tbWFuZCxcblx0XHRcdFx0cGFyc2VkLFxuXHRcdFx0XHR0aW1lZE91dCxcblx0XHRcdFx0aXNDYW5jZWxlZDogY29udGV4dC5pc0NhbmNlbGVkLFxuXHRcdFx0XHRraWxsZWQ6IHNwYXduZWQua2lsbGVkXG5cdFx0XHR9KTtcblxuXHRcdFx0aWYgKCFwYXJzZWQub3B0aW9ucy5yZWplY3QpIHtcblx0XHRcdFx0cmV0dXJuIHJldHVybmVkRXJyb3I7XG5cdFx0XHR9XG5cblx0XHRcdHRocm93IHJldHVybmVkRXJyb3I7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHtcblx0XHRcdGNvbW1hbmQsXG5cdFx0XHRlc2NhcGVkQ29tbWFuZCxcblx0XHRcdGV4aXRDb2RlOiAwLFxuXHRcdFx0c3Rkb3V0LFxuXHRcdFx0c3RkZXJyLFxuXHRcdFx0YWxsLFxuXHRcdFx0ZmFpbGVkOiBmYWxzZSxcblx0XHRcdHRpbWVkT3V0OiBmYWxzZSxcblx0XHRcdGlzQ2FuY2VsZWQ6IGZhbHNlLFxuXHRcdFx0a2lsbGVkOiBmYWxzZVxuXHRcdH07XG5cdH07XG5cblx0Y29uc3QgaGFuZGxlUHJvbWlzZU9uY2UgPSBvbmV0aW1lKGhhbmRsZVByb21pc2UpO1xuXG5cdGhhbmRsZUlucHV0KHNwYXduZWQsIHBhcnNlZC5vcHRpb25zLmlucHV0KTtcblxuXHRzcGF3bmVkLmFsbCA9IG1ha2VBbGxTdHJlYW0oc3Bhd25lZCwgcGFyc2VkLm9wdGlvbnMpO1xuXG5cdHJldHVybiBtZXJnZVByb21pc2Uoc3Bhd25lZCwgaGFuZGxlUHJvbWlzZU9uY2UpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBleGVjYTtcblxubW9kdWxlLmV4cG9ydHMuc3luYyA9IChmaWxlLCBhcmdzLCBvcHRpb25zKSA9PiB7XG5cdGNvbnN0IHBhcnNlZCA9IGhhbmRsZUFyZ3VtZW50cyhmaWxlLCBhcmdzLCBvcHRpb25zKTtcblx0Y29uc3QgY29tbWFuZCA9IGpvaW5Db21tYW5kKGZpbGUsIGFyZ3MpO1xuXHRjb25zdCBlc2NhcGVkQ29tbWFuZCA9IGdldEVzY2FwZWRDb21tYW5kKGZpbGUsIGFyZ3MpO1xuXG5cdHZhbGlkYXRlSW5wdXRTeW5jKHBhcnNlZC5vcHRpb25zKTtcblxuXHRsZXQgcmVzdWx0O1xuXHR0cnkge1xuXHRcdHJlc3VsdCA9IGNoaWxkUHJvY2Vzcy5zcGF3blN5bmMocGFyc2VkLmZpbGUsIHBhcnNlZC5hcmdzLCBwYXJzZWQub3B0aW9ucyk7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0dGhyb3cgbWFrZUVycm9yKHtcblx0XHRcdGVycm9yLFxuXHRcdFx0c3Rkb3V0OiAnJyxcblx0XHRcdHN0ZGVycjogJycsXG5cdFx0XHRhbGw6ICcnLFxuXHRcdFx0Y29tbWFuZCxcblx0XHRcdGVzY2FwZWRDb21tYW5kLFxuXHRcdFx0cGFyc2VkLFxuXHRcdFx0dGltZWRPdXQ6IGZhbHNlLFxuXHRcdFx0aXNDYW5jZWxlZDogZmFsc2UsXG5cdFx0XHRraWxsZWQ6IGZhbHNlXG5cdFx0fSk7XG5cdH1cblxuXHRjb25zdCBzdGRvdXQgPSBoYW5kbGVPdXRwdXQocGFyc2VkLm9wdGlvbnMsIHJlc3VsdC5zdGRvdXQsIHJlc3VsdC5lcnJvcik7XG5cdGNvbnN0IHN0ZGVyciA9IGhhbmRsZU91dHB1dChwYXJzZWQub3B0aW9ucywgcmVzdWx0LnN0ZGVyciwgcmVzdWx0LmVycm9yKTtcblxuXHRpZiAocmVzdWx0LmVycm9yIHx8IHJlc3VsdC5zdGF0dXMgIT09IDAgfHwgcmVzdWx0LnNpZ25hbCAhPT0gbnVsbCkge1xuXHRcdGNvbnN0IGVycm9yID0gbWFrZUVycm9yKHtcblx0XHRcdHN0ZG91dCxcblx0XHRcdHN0ZGVycixcblx0XHRcdGVycm9yOiByZXN1bHQuZXJyb3IsXG5cdFx0XHRzaWduYWw6IHJlc3VsdC5zaWduYWwsXG5cdFx0XHRleGl0Q29kZTogcmVzdWx0LnN0YXR1cyxcblx0XHRcdGNvbW1hbmQsXG5cdFx0XHRlc2NhcGVkQ29tbWFuZCxcblx0XHRcdHBhcnNlZCxcblx0XHRcdHRpbWVkT3V0OiByZXN1bHQuZXJyb3IgJiYgcmVzdWx0LmVycm9yLmNvZGUgPT09ICdFVElNRURPVVQnLFxuXHRcdFx0aXNDYW5jZWxlZDogZmFsc2UsXG5cdFx0XHRraWxsZWQ6IHJlc3VsdC5zaWduYWwgIT09IG51bGxcblx0XHR9KTtcblxuXHRcdGlmICghcGFyc2VkLm9wdGlvbnMucmVqZWN0KSB7XG5cdFx0XHRyZXR1cm4gZXJyb3I7XG5cdFx0fVxuXG5cdFx0dGhyb3cgZXJyb3I7XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdGNvbW1hbmQsXG5cdFx0ZXNjYXBlZENvbW1hbmQsXG5cdFx0ZXhpdENvZGU6IDAsXG5cdFx0c3Rkb3V0LFxuXHRcdHN0ZGVycixcblx0XHRmYWlsZWQ6IGZhbHNlLFxuXHRcdHRpbWVkT3V0OiBmYWxzZSxcblx0XHRpc0NhbmNlbGVkOiBmYWxzZSxcblx0XHRraWxsZWQ6IGZhbHNlXG5cdH07XG59O1xuXG5tb2R1bGUuZXhwb3J0cy5jb21tYW5kID0gKGNvbW1hbmQsIG9wdGlvbnMpID0+IHtcblx0Y29uc3QgW2ZpbGUsIC4uLmFyZ3NdID0gcGFyc2VDb21tYW5kKGNvbW1hbmQpO1xuXHRyZXR1cm4gZXhlY2EoZmlsZSwgYXJncywgb3B0aW9ucyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cy5jb21tYW5kU3luYyA9IChjb21tYW5kLCBvcHRpb25zKSA9PiB7XG5cdGNvbnN0IFtmaWxlLCAuLi5hcmdzXSA9IHBhcnNlQ29tbWFuZChjb21tYW5kKTtcblx0cmV0dXJuIGV4ZWNhLnN5bmMoZmlsZSwgYXJncywgb3B0aW9ucyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cy5ub2RlID0gKHNjcmlwdFBhdGgsIGFyZ3MsIG9wdGlvbnMgPSB7fSkgPT4ge1xuXHRpZiAoYXJncyAmJiAhQXJyYXkuaXNBcnJheShhcmdzKSAmJiB0eXBlb2YgYXJncyA9PT0gJ29iamVjdCcpIHtcblx0XHRvcHRpb25zID0gYXJncztcblx0XHRhcmdzID0gW107XG5cdH1cblxuXHRjb25zdCBzdGRpbyA9IG5vcm1hbGl6ZVN0ZGlvLm5vZGUob3B0aW9ucyk7XG5cdGNvbnN0IGRlZmF1bHRFeGVjQXJndiA9IHByb2Nlc3MuZXhlY0FyZ3YuZmlsdGVyKGFyZyA9PiAhYXJnLnN0YXJ0c1dpdGgoJy0taW5zcGVjdCcpKTtcblxuXHRjb25zdCB7XG5cdFx0bm9kZVBhdGggPSBwcm9jZXNzLmV4ZWNQYXRoLFxuXHRcdG5vZGVPcHRpb25zID0gZGVmYXVsdEV4ZWNBcmd2XG5cdH0gPSBvcHRpb25zO1xuXG5cdHJldHVybiBleGVjYShcblx0XHRub2RlUGF0aCxcblx0XHRbXG5cdFx0XHQuLi5ub2RlT3B0aW9ucyxcblx0XHRcdHNjcmlwdFBhdGgsXG5cdFx0XHQuLi4oQXJyYXkuaXNBcnJheShhcmdzKSA/IGFyZ3MgOiBbXSlcblx0XHRdLFxuXHRcdHtcblx0XHRcdC4uLm9wdGlvbnMsXG5cdFx0XHRzdGRpbjogdW5kZWZpbmVkLFxuXHRcdFx0c3Rkb3V0OiB1bmRlZmluZWQsXG5cdFx0XHRzdGRlcnI6IHVuZGVmaW5lZCxcblx0XHRcdHN0ZGlvLFxuXHRcdFx0c2hlbGw6IGZhbHNlXG5cdFx0fVxuXHQpO1xufTtcbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGFuc2lSZWdleCh7b25seUZpcnN0ID0gZmFsc2V9ID0ge30pIHtcblx0Y29uc3QgcGF0dGVybiA9IFtcblx0ICAgICdbXFxcXHUwMDFCXFxcXHUwMDlCXVtbXFxcXF0oKSM7P10qKD86KD86KD86KD86O1stYS16QS1aXFxcXGRcXFxcLyMmLjo9PyVAfl9dKykqfFthLXpBLVpcXFxcZF0rKD86O1stYS16QS1aXFxcXGRcXFxcLyMmLjo9PyVAfl9dKikqKT9cXFxcdTAwMDcpJyxcblx0XHQnKD86KD86XFxcXGR7MSw0fSg/OjtcXFxcZHswLDR9KSopP1tcXFxcZEEtUFItVFpjZi1udHFyeT0+PH5dKSknXG5cdF0uam9pbignfCcpO1xuXG5cdHJldHVybiBuZXcgUmVnRXhwKHBhdHRlcm4sIG9ubHlGaXJzdCA/IHVuZGVmaW5lZCA6ICdnJyk7XG59XG4iLCJpbXBvcnQgYW5zaVJlZ2V4IGZyb20gJ2Fuc2ktcmVnZXgnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzdHJpcEFuc2koc3RyaW5nKSB7XG5cdGlmICh0eXBlb2Ygc3RyaW5nICE9PSAnc3RyaW5nJykge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoYEV4cGVjdGVkIGEgXFxgc3RyaW5nXFxgLCBnb3QgXFxgJHt0eXBlb2Ygc3RyaW5nfVxcYGApO1xuXHR9XG5cblx0cmV0dXJuIHN0cmluZy5yZXBsYWNlKGFuc2lSZWdleCgpLCAnJyk7XG59XG4iLCJpbXBvcnQgcHJvY2VzcyBmcm9tICdub2RlOnByb2Nlc3MnO1xuaW1wb3J0IHt1c2VySW5mb30gZnJvbSAnbm9kZTpvcyc7XG5cbmV4cG9ydCBjb25zdCBkZXRlY3REZWZhdWx0U2hlbGwgPSAoKSA9PiB7XG5cdGNvbnN0IHtlbnZ9ID0gcHJvY2VzcztcblxuXHRpZiAocHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ3dpbjMyJykge1xuXHRcdHJldHVybiBlbnYuQ09NU1BFQyB8fCAnY21kLmV4ZSc7XG5cdH1cblxuXHR0cnkge1xuXHRcdGNvbnN0IHtzaGVsbH0gPSB1c2VySW5mbygpO1xuXHRcdGlmIChzaGVsbCkge1xuXHRcdFx0cmV0dXJuIHNoZWxsO1xuXHRcdH1cblx0fSBjYXRjaCB7fVxuXG5cdGlmIChwcm9jZXNzLnBsYXRmb3JtID09PSAnZGFyd2luJykge1xuXHRcdHJldHVybiBlbnYuU0hFTEwgfHwgJy9iaW4venNoJztcblx0fVxuXG5cdHJldHVybiBlbnYuU0hFTEwgfHwgJy9iaW4vc2gnO1xufTtcblxuLy8gU3RvcmVzIGRlZmF1bHQgc2hlbGwgd2hlbiBpbXBvcnRlZC5cbmNvbnN0IGRlZmF1bHRTaGVsbCA9IGRldGVjdERlZmF1bHRTaGVsbCgpO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZhdWx0U2hlbGw7XG4iLCJpbXBvcnQgcHJvY2VzcyBmcm9tICdub2RlOnByb2Nlc3MnO1xuaW1wb3J0IGV4ZWNhIGZyb20gJ2V4ZWNhJztcbmltcG9ydCBzdHJpcEFuc2kgZnJvbSAnc3RyaXAtYW5zaSc7XG5pbXBvcnQgZGVmYXVsdFNoZWxsIGZyb20gJ2RlZmF1bHQtc2hlbGwnO1xuXG5jb25zdCBhcmdzID0gW1xuXHQnLWlsYycsXG5cdCdlY2hvIC1uIFwiX1NIRUxMX0VOVl9ERUxJTUlURVJfXCI7IGVudjsgZWNobyAtbiBcIl9TSEVMTF9FTlZfREVMSU1JVEVSX1wiOyBleGl0Jyxcbl07XG5cbmNvbnN0IGVudiA9IHtcblx0Ly8gRGlzYWJsZXMgT2ggTXkgWnNoIGF1dG8tdXBkYXRlIHRoaW5nIHRoYXQgY2FuIGJsb2NrIHRoZSBwcm9jZXNzLlxuXHRESVNBQkxFX0FVVE9fVVBEQVRFOiAndHJ1ZScsXG59O1xuXG5jb25zdCBwYXJzZUVudiA9IGVudiA9PiB7XG5cdGVudiA9IGVudi5zcGxpdCgnX1NIRUxMX0VOVl9ERUxJTUlURVJfJylbMV07XG5cdGNvbnN0IHJldHVyblZhbHVlID0ge307XG5cblx0Zm9yIChjb25zdCBsaW5lIG9mIHN0cmlwQW5zaShlbnYpLnNwbGl0KCdcXG4nKS5maWx0ZXIobGluZSA9PiBCb29sZWFuKGxpbmUpKSkge1xuXHRcdGNvbnN0IFtrZXksIC4uLnZhbHVlc10gPSBsaW5lLnNwbGl0KCc9Jyk7XG5cdFx0cmV0dXJuVmFsdWVba2V5XSA9IHZhbHVlcy5qb2luKCc9Jyk7XG5cdH1cblxuXHRyZXR1cm4gcmV0dXJuVmFsdWU7XG59O1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2hlbGxFbnYoc2hlbGwpIHtcblx0aWYgKHByb2Nlc3MucGxhdGZvcm0gPT09ICd3aW4zMicpIHtcblx0XHRyZXR1cm4gcHJvY2Vzcy5lbnY7XG5cdH1cblxuXHR0cnkge1xuXHRcdGNvbnN0IHtzdGRvdXR9ID0gYXdhaXQgZXhlY2Eoc2hlbGwgfHwgZGVmYXVsdFNoZWxsLCBhcmdzLCB7ZW52fSk7XG5cdFx0cmV0dXJuIHBhcnNlRW52KHN0ZG91dCk7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKHNoZWxsKSB7XG5cdFx0XHR0aHJvdyBlcnJvcjtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIHByb2Nlc3MuZW52O1xuXHRcdH1cblx0fVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc2hlbGxFbnZTeW5jKHNoZWxsKSB7XG5cdGlmIChwcm9jZXNzLnBsYXRmb3JtID09PSAnd2luMzInKSB7XG5cdFx0cmV0dXJuIHByb2Nlc3MuZW52O1xuXHR9XG5cblx0dHJ5IHtcblx0XHRjb25zdCB7c3Rkb3V0fSA9IGV4ZWNhLnN5bmMoc2hlbGwgfHwgZGVmYXVsdFNoZWxsLCBhcmdzLCB7ZW52fSk7XG5cdFx0cmV0dXJuIHBhcnNlRW52KHN0ZG91dCk7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKHNoZWxsKSB7XG5cdFx0XHR0aHJvdyBlcnJvcjtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIHByb2Nlc3MuZW52O1xuXHRcdH1cblx0fVxufVxuIiwiaW1wb3J0IHtzaGVsbEVudiwgc2hlbGxFbnZTeW5jfSBmcm9tICdzaGVsbC1lbnYnO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2hlbGxQYXRoKCkge1xuXHRjb25zdCB7UEFUSH0gPSBhd2FpdCBzaGVsbEVudigpO1xuXHRyZXR1cm4gUEFUSDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNoZWxsUGF0aFN5bmMoKSB7XG5cdGNvbnN0IHtQQVRIfSA9IHNoZWxsRW52U3luYygpO1xuXHRyZXR1cm4gUEFUSDtcbn1cbiIsImltcG9ydCBwcm9jZXNzIGZyb20gJ25vZGU6cHJvY2Vzcyc7XG5pbXBvcnQge3NoZWxsUGF0aFN5bmN9IGZyb20gJ3NoZWxsLXBhdGgnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBmaXhQYXRoKCkge1xuXHRpZiAocHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ3dpbjMyJykge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdHByb2Nlc3MuZW52LlBBVEggPSBzaGVsbFBhdGhTeW5jKCkgfHwgW1xuXHRcdCcuL25vZGVfbW9kdWxlcy8uYmluJyxcblx0XHQnLy5ub2RlYnJldy9jdXJyZW50L2JpbicsXG5cdFx0Jy91c3IvbG9jYWwvYmluJyxcblx0XHRwcm9jZXNzLmVudi5QQVRILFxuXHRdLmpvaW4oJzonKTtcbn1cbiIsImltcG9ydCB7IHJlc29sdmUsIGV4dG5hbWUsIHJlbGF0aXZlLCBqb2luLCBwYXJzZSwgcG9zaXggfSBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgUmVhZGFibGUgfSBmcm9tIFwic3RyZWFtXCI7XG5pbXBvcnQgeyBjbGlwYm9hcmQgfSBmcm9tIFwiZWxlY3Ryb25cIjtcblxuY29uc3QgSU1BR0VfRVhUX0xJU1QgPSBbXG4gIFwiLnBuZ1wiLFxuICBcIi5qcGdcIixcbiAgXCIuanBlZ1wiLFxuICBcIi5ibXBcIixcbiAgXCIuZ2lmXCIsXG4gIFwiLnN2Z1wiLFxuICBcIi50aWZmXCIsXG4gIFwiLndlYnBcIixcbiAgXCIuYXZpZlwiLFxuXTtcblxuZXhwb3J0IGZ1bmN0aW9uIGlzQW5JbWFnZShleHQ6IHN0cmluZykge1xuICByZXR1cm4gSU1BR0VfRVhUX0xJU1QuaW5jbHVkZXMoZXh0LnRvTG93ZXJDYXNlKCkpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGlzQXNzZXRUeXBlQW5JbWFnZShwYXRoOiBzdHJpbmcpOiBCb29sZWFuIHtcbiAgcmV0dXJuIGlzQW5JbWFnZShleHRuYW1lKHBhdGgpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldE9TKCkge1xuICBjb25zdCB7IGFwcFZlcnNpb24gfSA9IG5hdmlnYXRvcjtcbiAgaWYgKGFwcFZlcnNpb24uaW5kZXhPZihcIldpblwiKSAhPT0gLTEpIHtcbiAgICByZXR1cm4gXCJXaW5kb3dzXCI7XG4gIH0gZWxzZSBpZiAoYXBwVmVyc2lvbi5pbmRleE9mKFwiTWFjXCIpICE9PSAtMSkge1xuICAgIHJldHVybiBcIk1hY09TXCI7XG4gIH0gZWxzZSBpZiAoYXBwVmVyc2lvbi5pbmRleE9mKFwiWDExXCIpICE9PSAtMSkge1xuICAgIHJldHVybiBcIkxpbnV4XCI7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIFwiVW5rbm93biBPU1wiO1xuICB9XG59XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc3RyZWFtVG9TdHJpbmcoc3RyZWFtOiBSZWFkYWJsZSkge1xuICBjb25zdCBjaHVua3MgPSBbXTtcblxuICBmb3IgYXdhaXQgKGNvbnN0IGNodW5rIG9mIHN0cmVhbSkge1xuICAgIGNodW5rcy5wdXNoKEJ1ZmZlci5mcm9tKGNodW5rKSk7XG4gIH1cblxuICByZXR1cm4gQnVmZmVyLmNvbmNhdChjaHVua3MpLnRvU3RyaW5nKFwidXRmLThcIik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRVcmxBc3NldCh1cmw6IHN0cmluZykge1xuICByZXR1cm4gKHVybCA9IHVybC5zdWJzdHIoMSArIHVybC5sYXN0SW5kZXhPZihcIi9cIikpLnNwbGl0KFwiP1wiKVswXSkuc3BsaXQoXG4gICAgXCIjXCJcbiAgKVswXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQ29weUltYWdlRmlsZSgpIHtcbiAgbGV0IGZpbGVQYXRoID0gXCJcIjtcbiAgY29uc3Qgb3MgPSBnZXRPUygpO1xuXG4gIGlmIChvcyA9PT0gXCJXaW5kb3dzXCIpIHtcbiAgICB2YXIgcmF3RmlsZVBhdGggPSBjbGlwYm9hcmQucmVhZChcIkZpbGVOYW1lV1wiKTtcbiAgICBmaWxlUGF0aCA9IHJhd0ZpbGVQYXRoLnJlcGxhY2UobmV3IFJlZ0V4cChTdHJpbmcuZnJvbUNoYXJDb2RlKDApLCBcImdcIiksIFwiXCIpO1xuICB9IGVsc2UgaWYgKG9zID09PSBcIk1hY09TXCIpIHtcbiAgICBmaWxlUGF0aCA9IGNsaXBib2FyZC5yZWFkKFwicHVibGljLmZpbGUtdXJsXCIpLnJlcGxhY2UoXCJmaWxlOi8vXCIsIFwiXCIpO1xuICB9IGVsc2Uge1xuICAgIGZpbGVQYXRoID0gXCJcIjtcbiAgfVxuICByZXR1cm4gaXNBc3NldFR5cGVBbkltYWdlKGZpbGVQYXRoKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldExhc3RJbWFnZShsaXN0OiBzdHJpbmdbXSkge1xuICBjb25zdCByZXZlcnNlZExpc3QgPSBsaXN0LnJldmVyc2UoKTtcbiAgbGV0IGxhc3RJbWFnZTtcbiAgcmV2ZXJzZWRMaXN0LmZvckVhY2goaXRlbSA9PiB7XG4gICAgaWYgKGl0ZW0gJiYgaXRlbS5zdGFydHNXaXRoKFwiaHR0cFwiKSkge1xuICAgICAgbGFzdEltYWdlID0gaXRlbTtcbiAgICAgIHJldHVybiBpdGVtO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBsYXN0SW1hZ2U7XG59XG5cbmludGVyZmFjZSBBbnlPYmoge1xuICBba2V5OiBzdHJpbmddOiBhbnk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhcnJheVRvT2JqZWN0PFQgZXh0ZW5kcyBBbnlPYmo+KFxuICBhcnI6IFRbXSxcbiAga2V5OiBzdHJpbmdcbik6IHsgW2tleTogc3RyaW5nXTogVCB9IHtcbiAgY29uc3Qgb2JqOiB7IFtrZXk6IHN0cmluZ106IFQgfSA9IHt9O1xuICBhcnIuZm9yRWFjaChlbGVtZW50ID0+IHtcbiAgICBvYmpbZWxlbWVudFtrZXldXSA9IGVsZW1lbnQ7XG4gIH0pO1xuICByZXR1cm4gb2JqO1xufVxuIiwiaW1wb3J0IHsgUGx1Z2luU2V0dGluZ3MgfSBmcm9tIFwiLi9zZXR0aW5nXCI7XG5pbXBvcnQgeyBzdHJlYW1Ub1N0cmluZywgZ2V0TGFzdEltYWdlIH0gZnJvbSBcIi4vdXRpbHNcIjtcbmltcG9ydCB7IGV4ZWMgfSBmcm9tIFwiY2hpbGRfcHJvY2Vzc1wiO1xuaW1wb3J0IHsgTm90aWNlLCByZXF1ZXN0VXJsIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5cbmludGVyZmFjZSBQaWNHb1Jlc3BvbnNlIHtcbiAgc3VjY2Vzczogc3RyaW5nO1xuICBtc2c6IHN0cmluZztcbiAgcmVzdWx0OiBzdHJpbmdbXTtcbn1cblxuZXhwb3J0IGNsYXNzIFBpY0dvVXBsb2FkZXIge1xuICBzZXR0aW5nczogUGx1Z2luU2V0dGluZ3M7XG5cbiAgY29uc3RydWN0b3Ioc2V0dGluZ3M6IFBsdWdpblNldHRpbmdzKSB7XG4gICAgdGhpcy5zZXR0aW5ncyA9IHNldHRpbmdzO1xuICB9XG5cbiAgYXN5bmMgdXBsb2FkRmlsZXMoZmlsZUxpc3Q6IEFycmF5PFN0cmluZz4pOiBQcm9taXNlPGFueT4ge1xuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgcmVxdWVzdFVybCh7XG4gICAgICB1cmw6IHRoaXMuc2V0dGluZ3MudXBsb2FkU2VydmVyLFxuICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgIGhlYWRlcnM6IHsgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIgfSxcbiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgbGlzdDogZmlsZUxpc3QgfSksXG4gICAgfSk7XG5cbiAgICBjb25zdCBkYXRhID0gcmVzcG9uc2UuanNvbjtcbiAgICByZXR1cm4gZGF0YTtcbiAgfVxuXG4gIGFzeW5jIHVwbG9hZEZpbGVCeUNsaXBib2FyZCgpOiBQcm9taXNlPGFueT4ge1xuICAgIGNvbnN0IHJlcyA9IGF3YWl0IHJlcXVlc3RVcmwoe1xuICAgICAgdXJsOiB0aGlzLnNldHRpbmdzLnVwbG9hZFNlcnZlcixcbiAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgfSk7XG5cbiAgICBsZXQgZGF0YTogUGljR29SZXNwb25zZSA9IHJlcy5qc29uO1xuXG4gICAgaWYgKHJlcy5zdGF0dXMgIT09IDIwMCkge1xuICAgICAgbGV0IGVyciA9IHsgcmVzcG9uc2U6IGRhdGEsIGJvZHk6IGRhdGEubXNnIH07XG4gICAgICByZXR1cm4ge1xuICAgICAgICBjb2RlOiAtMSxcbiAgICAgICAgbXNnOiBkYXRhLm1zZyxcbiAgICAgICAgZGF0YTogXCJcIixcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGNvZGU6IDAsXG4gICAgICAgIG1zZzogXCJzdWNjZXNzXCIsXG4gICAgICAgIGRhdGE6IHR5cGVvZiBkYXRhLnJlc3VsdCA9PSBcInN0cmluZ1wiID8gZGF0YS5yZXN1bHQgOiBkYXRhLnJlc3VsdFswXSxcbiAgICAgIH07XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBQaWNHb0NvcmVVcGxvYWRlciB7XG4gIHNldHRpbmdzOiBQbHVnaW5TZXR0aW5ncztcblxuICBjb25zdHJ1Y3RvcihzZXR0aW5nczogUGx1Z2luU2V0dGluZ3MpIHtcbiAgICB0aGlzLnNldHRpbmdzID0gc2V0dGluZ3M7XG4gIH1cblxuICBhc3luYyB1cGxvYWRGaWxlcyhmaWxlTGlzdDogQXJyYXk8U3RyaW5nPik6IFByb21pc2U8YW55PiB7XG4gICAgY29uc3QgbGVuZ3RoID0gZmlsZUxpc3QubGVuZ3RoO1xuICAgIGxldCBjbGkgPSB0aGlzLnNldHRpbmdzLnBpY2dvQ29yZVBhdGggfHwgXCJwaWNnb1wiO1xuICAgIGxldCBjb21tYW5kID0gYCR7Y2xpfSB1cGxvYWQgJHtmaWxlTGlzdFxuICAgICAgLm1hcChpdGVtID0+IGBcIiR7aXRlbX1cImApXG4gICAgICAuam9pbihcIiBcIil9YDtcblxuICAgIGNvbnN0IHJlcyA9IGF3YWl0IHRoaXMuZXhlYyhjb21tYW5kKTtcbiAgICBjb25zdCBzcGxpdExpc3QgPSByZXMuc3BsaXQoXCJcXG5cIik7XG4gICAgY29uc3Qgc3BsaXRMaXN0TGVuZ3RoID0gc3BsaXRMaXN0Lmxlbmd0aDtcbiAgICBjb25zb2xlLmxvZyhzcGxpdExpc3RMZW5ndGgpO1xuXG4gICAgY29uc3QgZGF0YSA9IHNwbGl0TGlzdC5zcGxpY2Uoc3BsaXRMaXN0TGVuZ3RoIC0gMSAtIGxlbmd0aCwgbGVuZ3RoKTtcblxuICAgIGlmIChyZXMuaW5jbHVkZXMoXCJQaWNHbyBFUlJPUlwiKSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgc3VjY2VzczogZmFsc2UsXG4gICAgICAgIG1zZzogXCLlpLHotKVcIixcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICAgIHJlc3VsdDogZGF0YSxcbiAgICAgIH07XG4gICAgfVxuICAgIC8vIHtzdWNjZXNzOnRydWUscmVzdWx0OltdfVxuICB9XG5cbiAgLy8gUGljR28tQ29yZSDkuIrkvKDlpITnkIZcbiAgYXN5bmMgdXBsb2FkRmlsZUJ5Q2xpcGJvYXJkKCkge1xuICAgIGNvbnN0IHJlcyA9IGF3YWl0IHRoaXMudXBsb2FkQnlDbGlwKCk7XG4gICAgY29uc3Qgc3BsaXRMaXN0ID0gcmVzLnNwbGl0KFwiXFxuXCIpO1xuICAgIGNvbnN0IGxhc3RJbWFnZSA9IGdldExhc3RJbWFnZShzcGxpdExpc3QpO1xuXG4gICAgaWYgKGxhc3RJbWFnZSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgY29kZTogMCxcbiAgICAgICAgbXNnOiBcInN1Y2Nlc3NcIixcbiAgICAgICAgZGF0YTogbGFzdEltYWdlLFxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmV3IE5vdGljZShgXCJQbGVhc2UgY2hlY2sgUGljR28tQ29yZSBjb25maWdcIlxcbiR7cmVzfWApO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgY29kZTogLTEsXG4gICAgICAgIG1zZzogYFwiUGxlYXNlIGNoZWNrIFBpY0dvLUNvcmUgY29uZmlnXCJcXG4ke3Jlc31gLFxuICAgICAgICBkYXRhOiBcIlwiLFxuICAgICAgfTtcbiAgICB9XG4gIH1cblxuICAvLyBQaWNHby1Db3Jl55qE5Ymq5YiH5LiK5Lyg5Y+N6aaIXG4gIGFzeW5jIHVwbG9hZEJ5Q2xpcCgpIHtcbiAgICBsZXQgY29tbWFuZDtcbiAgICBpZiAodGhpcy5zZXR0aW5ncy5waWNnb0NvcmVQYXRoKSB7XG4gICAgICBjb21tYW5kID0gYCR7dGhpcy5zZXR0aW5ncy5waWNnb0NvcmVQYXRofSB1cGxvYWRgO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb21tYW5kID0gYHBpY2dvIHVwbG9hZGA7XG4gICAgfVxuICAgIGNvbnN0IHJlcyA9IGF3YWl0IHRoaXMuZXhlYyhjb21tYW5kKTtcbiAgICByZXR1cm4gcmVzO1xuICB9XG5cbiAgYXN5bmMgZXhlYyhjb21tYW5kOiBzdHJpbmcpIHtcbiAgICBsZXQgeyBzdGRvdXQgfSA9IGF3YWl0IGV4ZWMoY29tbWFuZCk7XG4gICAgY29uc3QgcmVzID0gYXdhaXQgc3RyZWFtVG9TdHJpbmcoc3Rkb3V0KTtcbiAgICByZXR1cm4gcmVzO1xuICB9XG59XG4iLCJpbXBvcnQgeyBNYXJrZG93blZpZXcsIEFwcCB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHsgcGFyc2UgfSBmcm9tIFwicGF0aFwiO1xuXG5pbnRlcmZhY2UgSW1hZ2Uge1xuICBwYXRoOiBzdHJpbmc7XG4gIG5hbWU6IHN0cmluZztcbiAgc291cmNlOiBzdHJpbmc7XG59XG5jb25zdCBSRUdFWF9GSUxFID0gL1xcIVxcWyguKj8pXFxdXFwoKC4qPylcXCkvZztcbmNvbnN0IFJFR0VYX1dJS0lfRklMRSA9IC9cXCFcXFtcXFsoLio/KShcXHNcXHwuKj8pP1xcXVxcXS9nO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIZWxwZXIge1xuICBhcHA6IEFwcDtcblxuICBjb25zdHJ1Y3RvcihhcHA6IEFwcCkge1xuICAgIHRoaXMuYXBwID0gYXBwO1xuICB9XG4gIGdldEZyb250bWF0dGVyVmFsdWUoa2V5OiBzdHJpbmcsIGRlZmF1bHRWYWx1ZTogYW55ID0gdW5kZWZpbmVkKSB7XG4gICAgY29uc3QgZmlsZSA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk7XG4gICAgaWYgKCFmaWxlKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBjb25zdCBwYXRoID0gZmlsZS5wYXRoO1xuICAgIGNvbnN0IGNhY2hlID0gdGhpcy5hcHAubWV0YWRhdGFDYWNoZS5nZXRDYWNoZShwYXRoKTtcblxuICAgIGxldCB2YWx1ZSA9IGRlZmF1bHRWYWx1ZTtcbiAgICBpZiAoY2FjaGU/LmZyb250bWF0dGVyICYmIGNhY2hlLmZyb250bWF0dGVyLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgIHZhbHVlID0gY2FjaGUuZnJvbnRtYXR0ZXJba2V5XTtcbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgZ2V0RWRpdG9yKCkge1xuICAgIGNvbnN0IG1kVmlldyA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVWaWV3T2ZUeXBlKE1hcmtkb3duVmlldyk7XG4gICAgaWYgKG1kVmlldykge1xuICAgICAgcmV0dXJuIG1kVmlldy5lZGl0b3I7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuICBnZXRWYWx1ZSgpIHtcbiAgICBjb25zdCBlZGl0b3IgPSB0aGlzLmdldEVkaXRvcigpO1xuICAgIHJldHVybiBlZGl0b3IuZ2V0VmFsdWUoKTtcbiAgfVxuXG4gIHNldFZhbHVlKHZhbHVlOiBzdHJpbmcpIHtcbiAgICBjb25zdCBlZGl0b3IgPSB0aGlzLmdldEVkaXRvcigpO1xuICAgIGNvbnN0IHsgbGVmdCwgdG9wIH0gPSBlZGl0b3IuZ2V0U2Nyb2xsSW5mbygpO1xuICAgIGNvbnN0IHBvc2l0aW9uID0gZWRpdG9yLmdldEN1cnNvcigpO1xuXG4gICAgZWRpdG9yLnNldFZhbHVlKHZhbHVlKTtcbiAgICBlZGl0b3Iuc2Nyb2xsVG8obGVmdCwgdG9wKTtcbiAgICBlZGl0b3Iuc2V0Q3Vyc29yKHBvc2l0aW9uKTtcbiAgfVxuXG4gIC8vIGdldCBhbGwgZmlsZSB1cmxzLCBpbmNsdWRlIGxvY2FsIGFuZCBpbnRlcm5ldFxuICBnZXRBbGxGaWxlcygpOiBJbWFnZVtdIHtcbiAgICBjb25zdCBlZGl0b3IgPSB0aGlzLmdldEVkaXRvcigpO1xuICAgIGxldCB2YWx1ZSA9IGVkaXRvci5nZXRWYWx1ZSgpO1xuICAgIHJldHVybiB0aGlzLmdldEltYWdlTGluayh2YWx1ZSk7XG4gIH1cbiAgZ2V0SW1hZ2VMaW5rKHZhbHVlOiBzdHJpbmcpOiBJbWFnZVtdIHtcbiAgICBjb25zdCBtYXRjaGVzID0gdmFsdWUubWF0Y2hBbGwoUkVHRVhfRklMRSk7XG4gICAgY29uc3QgV2lraU1hdGNoZXMgPSB2YWx1ZS5tYXRjaEFsbChSRUdFWF9XSUtJX0ZJTEUpO1xuXG4gICAgbGV0IGZpbGVBcnJheTogSW1hZ2VbXSA9IFtdO1xuXG4gICAgZm9yIChjb25zdCBtYXRjaCBvZiBtYXRjaGVzKSB7XG4gICAgICBjb25zdCBuYW1lID0gbWF0Y2hbMV07XG4gICAgICBjb25zdCBwYXRoID0gbWF0Y2hbMl07XG4gICAgICBjb25zdCBzb3VyY2UgPSBtYXRjaFswXTtcblxuICAgICAgZmlsZUFycmF5LnB1c2goe1xuICAgICAgICBwYXRoOiBwYXRoLFxuICAgICAgICBuYW1lOiBuYW1lLFxuICAgICAgICBzb3VyY2U6IHNvdXJjZSxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGZvciAoY29uc3QgbWF0Y2ggb2YgV2lraU1hdGNoZXMpIHtcbiAgICAgIGNvbnN0IG5hbWUgPSBwYXJzZShtYXRjaFsxXSkubmFtZTtcbiAgICAgIGNvbnN0IHBhdGggPSBtYXRjaFsxXTtcbiAgICAgIGNvbnN0IHNvdXJjZSA9IG1hdGNoWzBdO1xuICAgICAgZmlsZUFycmF5LnB1c2goe1xuICAgICAgICBwYXRoOiBwYXRoLFxuICAgICAgICBuYW1lOiBuYW1lLFxuICAgICAgICBzb3VyY2U6IHNvdXJjZSxcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gZmlsZUFycmF5O1xuICB9XG5cbiAgaGFzQmxhY2tEb21haW4oc3JjOiBzdHJpbmcsIGJsYWNrRG9tYWluczogc3RyaW5nKSB7XG4gICAgaWYgKGJsYWNrRG9tYWlucy50cmltKCkgPT09IFwiXCIpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgY29uc3QgYmxhY2tEb21haW5MaXN0ID0gYmxhY2tEb21haW5zLnNwbGl0KFwiLFwiKTtcbiAgICBsZXQgdXJsID0gbmV3IFVSTChzcmMpO1xuICAgIGNvbnN0IGRvbWFpbiA9IHVybC5ob3N0bmFtZTtcblxuICAgIHJldHVybiBibGFja0RvbWFpbkxpc3Quc29tZShibGFja0RvbWFpbiA9PiBkb21haW4uaW5jbHVkZXMoYmxhY2tEb21haW4pKTtcbiAgfVxufVxuIiwiLy8g2KfZhNi52LHYqNmK2KlcblxuZXhwb3J0IGRlZmF1bHQge307XG4iLCIvLyDEjWXFoXRpbmFcblxuZXhwb3J0IGRlZmF1bHQge307XG4iLCIvLyBEYW5za1xuXG5leHBvcnQgZGVmYXVsdCB7fTtcbiIsIi8vIERldXRzY2hcblxuZXhwb3J0IGRlZmF1bHQge307IiwiLy8gRW5nbGlzaFxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIC8vIHNldHRpbmcudHNcbiAgXCJQbHVnaW4gU2V0dGluZ3NcIjogXCJQbHVnaW4gU2V0dGluZ3NcIixcbiAgXCJBdXRvIHBhc3RlZCB1cGxvYWRcIjogXCJBdXRvIHBhc3RlZCB1cGxvYWRcIixcbiAgXCJJZiB5b3Ugc2V0IHRoaXMgdmFsdWUgdHJ1ZSwgd2hlbiB5b3UgcGFzdGUgaW1hZ2UsIGl0IHdpbGwgYmUgYXV0byB1cGxvYWRlZCh5b3Ugc2hvdWxkIHNldCB0aGUgcGljR28gc2VydmVyIHJpZ2h0bHkpXCI6XG4gICAgXCJJZiB5b3Ugc2V0IHRoaXMgdmFsdWUgdHJ1ZSwgd2hlbiB5b3UgcGFzdGUgaW1hZ2UsIGl0IHdpbGwgYmUgYXV0byB1cGxvYWRlZCh5b3Ugc2hvdWxkIHNldCB0aGUgcGljR28gc2VydmVyIHJpZ2h0bHkpXCIsXG4gIFwiRGVmYXVsdCB1cGxvYWRlclwiOiBcIkRlZmF1bHQgdXBsb2FkZXJcIixcbiAgXCJQaWNHbyBzZXJ2ZXJcIjogXCJQaWNHbyBzZXJ2ZXJcIixcbiAgXCJQbGVhc2UgaW5wdXQgUGljR28gc2VydmVyXCI6IFwiUGxlYXNlIGlucHV0IFBpY0dvIHNlcnZlclwiLFxuICBcIlBpY0dvLUNvcmUgcGF0aFwiOiBcIlBpY0dvLUNvcmUgcGF0aFwiLFxuICBcIlBsZWFzZSBpbnB1dCBQaWNHby1Db3JlIHBhdGgsIGRlZmF1bHQgdXNpbmcgZW52aXJvbm1lbnQgdmFyaWFibGVzXCI6XG4gICAgXCJQbGVhc2UgaW5wdXQgUGljR28tQ29yZSBwYXRoLCBkZWZhdWx0IHVzaW5nIGVudmlyb25tZW50IHZhcmlhYmxlc1wiLFxuICBcIldvcmsgb24gbmV0d29ya1wiOiBcIldvcmsgb24gbmV0d29ya1wiLFxuICBcIldvcmsgb24gbmV0d29yayBEZXNjcmlwdGlvblwiOlxuICAgIFwiQWxsb3cgdXBsb2FkIG5ldHdvcmsgaW1hZ2UgYnkgJ1VwbG9hZCBhbGwnIGNvbW1hbmQuXFxuIE9yIHdoZW4geW91IHBhc3RlLCBtZCBzdGFuZGFyZCBpbWFnZSBsaW5rIGluIHlvdXIgY2xpcGJvYXJkIHdpbGwgYmUgYXV0byB1cGxvYWQuXCIsXG4gIGZpeFBhdGg6IFwiZml4UGF0aFwiLFxuICBmaXhQYXRoV2FybmluZzpcbiAgICBcIlRoaXMgb3B0aW9uIGlzIHVzZWQgdG8gZml4IFBpY0dvLWNvcmUgdXBsb2FkIGZhaWx1cmVzIG9uIExpbnV4IGFuZCBNYWMuIEl0IG1vZGlmaWVzIHRoZSBQQVRIIHZhcmlhYmxlIHdpdGhpbiBPYnNpZGlhbi4gSWYgT2JzaWRpYW4gZW5jb3VudGVycyBhbnkgYnVncywgdHVybiBvZmYgdGhlIG9wdGlvbiwgdHJ5IGFnYWluISBcIixcbiAgXCJVcGxvYWQgd2hlbiBjbGlwYm9hcmQgaGFzIGltYWdlIGFuZCB0ZXh0IHRvZ2V0aGVyXCI6XG4gICAgXCJVcGxvYWQgd2hlbiBjbGlwYm9hcmQgaGFzIGltYWdlIGFuZCB0ZXh0IHRvZ2V0aGVyXCIsXG4gIFwiV2hlbiB5b3UgY29weSwgc29tZSBhcHBsaWNhdGlvbiBsaWtlIEV4Y2VsIHdpbGwgaW1hZ2UgYW5kIHRleHQgdG8gY2xpcGJvYXJkLCB5b3UgY2FuIHVwbG9hZCBvciBub3QuXCI6XG4gICAgXCJXaGVuIHlvdSBjb3B5LCBzb21lIGFwcGxpY2F0aW9uIGxpa2UgRXhjZWwgd2lsbCBpbWFnZSBhbmQgdGV4dCB0byBjbGlwYm9hcmQsIHlvdSBjYW4gdXBsb2FkIG9yIG5vdC5cIixcbiAgXCJOZXR3b3JrIERvbWFpbiBCbGFjayBMaXN0XCI6IFwiTmV0d29yayBEb21haW4gQmxhY2sgTGlzdFwiLFxuICBcIk5ldHdvcmsgRG9tYWluIEJsYWNrIExpc3QgRGVzY3JpcHRpb25cIjpcbiAgICBcIkltYWdlIGluIHRoZSBkb21haW4gbGlzdCB3aWxsIG5vdCBiZSB1cGxvYWQsdXNlIGNvbW1hIHNlcGFyYXRlZFwiLFxuICBcIkRlbGV0ZSBzb3VyY2UgZmlsZSBhZnRlciB5b3UgdXBsb2FkIGZpbGVcIjpcbiAgICBcIkRlbGV0ZSBzb3VyY2UgZmlsZSBhZnRlciB5b3UgdXBsb2FkIGZpbGVcIixcbiAgXCJEZWxldGUgc291cmNlIGZpbGUgaW4gb2IgYXNzZXRzIGFmdGVyIHlvdSB1cGxvYWQgZmlsZS5cIjpcbiAgICBcIkRlbGV0ZSBzb3VyY2UgZmlsZSBpbiBvYiBhc3NldHMgYWZ0ZXIgeW91IHVwbG9hZCBmaWxlLlwiLFxufTtcbiIsIi8vIEJyaXRpc2ggRW5nbGlzaFxuXG5leHBvcnQgZGVmYXVsdCB7fTtcbiIsIi8vIEVzcGHDsW9sXG5cbmV4cG9ydCBkZWZhdWx0IHt9O1xuIiwiLy8gZnJhbsOnYWlzXG5cbmV4cG9ydCBkZWZhdWx0IHt9O1xuIiwiLy8g4KS54KS/4KSo4KWN4KSm4KWAXG5cbmV4cG9ydCBkZWZhdWx0IHt9O1xuIiwiLy8gQmFoYXNhIEluZG9uZXNpYVxuXG5leHBvcnQgZGVmYXVsdCB7fTtcbiIsIi8vIEl0YWxpYW5vXG5cbmV4cG9ydCBkZWZhdWx0IHt9O1xuIiwiLy8g5pel5pys6KqeXG5cbmV4cG9ydCBkZWZhdWx0IHt9OyIsIi8vIO2VnOq1reyWtFxuXG5leHBvcnQgZGVmYXVsdCB7fTtcbiIsIi8vIE5lZGVybGFuZHNcblxuZXhwb3J0IGRlZmF1bHQge307XG4iLCIvLyBOb3Jza1xuXG5leHBvcnQgZGVmYXVsdCB7fTtcbiIsIi8vIGrEmXp5ayBwb2xza2lcblxuZXhwb3J0IGRlZmF1bHQge307XG4iLCIvLyBQb3J0dWd1w6pzXG5cbmV4cG9ydCBkZWZhdWx0IHt9O1xuIiwiLy8gUG9ydHVndcOqcyBkbyBCcmFzaWxcbi8vIEJyYXppbGlhbiBQb3J0dWd1ZXNlXG5cbmV4cG9ydCBkZWZhdWx0IHt9OyIsIi8vIFJvbcOibsSDXG5cbmV4cG9ydCBkZWZhdWx0IHt9O1xuIiwiLy8g0YDRg9GB0YHQutC40LlcblxuZXhwb3J0IGRlZmF1bHQge307XG4iLCIvLyBUw7xya8OnZVxuXG5leHBvcnQgZGVmYXVsdCB7fTtcbiIsIi8vIOeugOS9k+S4reaWh1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIC8vIHNldHRpbmcudHNcbiAgXCJQbHVnaW4gU2V0dGluZ3NcIjogXCLmj5Lku7borr7nva5cIixcbiAgXCJBdXRvIHBhc3RlZCB1cGxvYWRcIjogXCLliarliIfmnb/oh6rliqjkuIrkvKBcIixcbiAgXCJJZiB5b3Ugc2V0IHRoaXMgdmFsdWUgdHJ1ZSwgd2hlbiB5b3UgcGFzdGUgaW1hZ2UsIGl0IHdpbGwgYmUgYXV0byB1cGxvYWRlZCh5b3Ugc2hvdWxkIHNldCB0aGUgcGljR28gc2VydmVyIHJpZ2h0bHkpXCI6XG4gICAgXCLlkK/nlKjor6XpgInpobnlkI7vvIzpu4/otLTlm77niYfml7bkvJroh6rliqjkuIrkvKDvvIjkvaDpnIDopoHmraPnoa7phY3nva5waWNnb++8iVwiLFxuICBcIkRlZmF1bHQgdXBsb2FkZXJcIjogXCLpu5jorqTkuIrkvKDlmahcIixcbiAgXCJQaWNHbyBzZXJ2ZXJcIjogXCJQaWNHbyBzZXJ2ZXJcIixcbiAgXCJQbGVhc2UgaW5wdXQgUGljR28gc2VydmVyXCI6IFwi6K+36L6T5YWlIFBpY0dvIHNlcnZlclwiLFxuICBcIlBpY0dvLUNvcmUgcGF0aFwiOiBcIlBpY0dvLUNvcmUg6Lev5b6EXCIsXG4gIFwiUGxlYXNlIGlucHV0IFBpY0dvLUNvcmUgcGF0aCwgZGVmYXVsdCB1c2luZyBlbnZpcm9ubWVudCB2YXJpYWJsZXNcIjpcbiAgICBcIuivt+i+k+WFpSBQaWNHby1Db3JlIHBhdGjvvIzpu5jorqTkvb/nlKjnjq/looPlj5jph49cIixcbiAgXCJXb3JrIG9uIG5ldHdvcmtcIjogXCLlupTnlKjnvZHnu5zlm77niYdcIixcbiAgXCJXb3JrIG9uIG5ldHdvcmsgRGVzY3JpcHRpb25cIjpcbiAgICBcIuW9k+S9oOS4iuS8oOaJgOacieWbvueJh+aXtu+8jOS5n+S8muS4iuS8oOe9kee7nOWbvueJh+OAguS7peWPiuW9k+S9oOi/m+ihjOm7j+i0tOaXtu+8jOWJquWIh+adv+S4reeahOagh+WHhiBtZCDlm77niYfkvJrooqvkuIrkvKBcIixcbiAgZml4UGF0aDogXCLkv67mraNQQVRI5Y+Y6YePXCIsXG4gIGZpeFBhdGhXYXJuaW5nOlxuICAgIFwi5q2k6YCJ6aG555So5LqO5L+u5aSNTGludXjlkoxNYWPkuIogUGljR28tQ29yZSDkuIrkvKDlpLHotKXnmoTpl67popjjgILlroPkvJrkv67mlLkgT2JzaWRpYW4g5YaF55qEIFBBVEgg5Y+Y6YeP77yM5aaC5p6cIE9ic2lkaWFuIOmBh+WIsOS7u+S9lUJVR++8jOWFiOWFs+mXrei/meS4qumAiemhueivleivle+8gVwiLFxuICBcIlVwbG9hZCB3aGVuIGNsaXBib2FyZCBoYXMgaW1hZ2UgYW5kIHRleHQgdG9nZXRoZXJcIjpcbiAgICBcIuW9k+WJquWIh+adv+WQjOaXtuaLpeacieaWh+acrOWSjOWbvueJh+WJquWIh+adv+aVsOaNruaXtuaYr+WQpuS4iuS8oOWbvueJh1wiLFxuICBcIldoZW4geW91IGNvcHksIHNvbWUgYXBwbGljYXRpb24gbGlrZSBFeGNlbCB3aWxsIGltYWdlIGFuZCB0ZXh0IHRvIGNsaXBib2FyZCwgeW91IGNhbiB1cGxvYWQgb3Igbm90LlwiOlxuICAgIFwi5b2T5L2g5aSN5Yi25pe277yM5p+Q5Lqb5bqU55So5L6L5aaCIEV4Y2VsIOS8muWcqOWJquWIh+adv+WQjOaXtuaWh+acrOWSjOWbvuWDj+aVsOaNru+8jOehruiupOaYr+WQpuS4iuS8oOOAglwiLFxuICBcIk5ldHdvcmsgRG9tYWluIEJsYWNrIExpc3RcIjogXCLnvZHnu5zlm77niYfln5/lkI3pu5HlkI3ljZVcIixcbiAgXCJOZXR3b3JrIERvbWFpbiBCbGFjayBMaXN0IERlc2NyaXB0aW9uXCI6XG4gICAgXCLpu5HlkI3ljZXln5/lkI3kuK3nmoTlm77niYflsIbkuI3kvJrooqvkuIrkvKDvvIznlKjoi7HmlofpgJflj7fliIblibJcIixcbiAgXCJEZWxldGUgc291cmNlIGZpbGUgYWZ0ZXIgeW91IHVwbG9hZCBmaWxlXCI6IFwi5LiK5Lyg5paH5Lu25ZCO56e76Zmk5rqQ5paH5Lu2XCIsXG4gIFwiRGVsZXRlIHNvdXJjZSBmaWxlIGluIG9iIGFzc2V0cyBhZnRlciB5b3UgdXBsb2FkIGZpbGUuXCI6XG4gICAgXCLkuIrkvKDmlofku7blkI7np7vpmaTlnKhvYumZhOS7tuaWh+S7tuWkueS4reeahOaWh+S7tlwiLFxufTtcbiIsIi8vIOe5gemrlOS4reaWh1xuXG5leHBvcnQgZGVmYXVsdCB7fTtcbiIsImltcG9ydCB7IG1vbWVudCB9IGZyb20gJ29ic2lkaWFuJztcblxuaW1wb3J0IGFyIGZyb20gJy4vbG9jYWxlL2FyJztcbmltcG9ydCBjeiBmcm9tICcuL2xvY2FsZS9jeic7XG5pbXBvcnQgZGEgZnJvbSAnLi9sb2NhbGUvZGEnO1xuaW1wb3J0IGRlIGZyb20gJy4vbG9jYWxlL2RlJztcbmltcG9ydCBlbiBmcm9tICcuL2xvY2FsZS9lbic7XG5pbXBvcnQgZW5HQiBmcm9tICcuL2xvY2FsZS9lbi1nYic7XG5pbXBvcnQgZXMgZnJvbSAnLi9sb2NhbGUvZXMnO1xuaW1wb3J0IGZyIGZyb20gJy4vbG9jYWxlL2ZyJztcbmltcG9ydCBoaSBmcm9tICcuL2xvY2FsZS9oaSc7XG5pbXBvcnQgaWQgZnJvbSAnLi9sb2NhbGUvaWQnO1xuaW1wb3J0IGl0IGZyb20gJy4vbG9jYWxlL2l0JztcbmltcG9ydCBqYSBmcm9tICcuL2xvY2FsZS9qYSc7XG5pbXBvcnQga28gZnJvbSAnLi9sb2NhbGUva28nO1xuaW1wb3J0IG5sIGZyb20gJy4vbG9jYWxlL25sJztcbmltcG9ydCBubyBmcm9tICcuL2xvY2FsZS9ubyc7XG5pbXBvcnQgcGwgZnJvbSAnLi9sb2NhbGUvcGwnO1xuaW1wb3J0IHB0IGZyb20gJy4vbG9jYWxlL3B0JztcbmltcG9ydCBwdEJSIGZyb20gJy4vbG9jYWxlL3B0LWJyJztcbmltcG9ydCBybyBmcm9tICcuL2xvY2FsZS9ybyc7XG5pbXBvcnQgcnUgZnJvbSAnLi9sb2NhbGUvcnUnO1xuaW1wb3J0IHRyIGZyb20gJy4vbG9jYWxlL3RyJztcbmltcG9ydCB6aENOIGZyb20gJy4vbG9jYWxlL3poLWNuJztcbmltcG9ydCB6aFRXIGZyb20gJy4vbG9jYWxlL3poLXR3JztcblxuY29uc3QgbG9jYWxlTWFwOiB7IFtrOiBzdHJpbmddOiBQYXJ0aWFsPHR5cGVvZiBlbj4gfSA9IHtcbiAgYXIsXG4gIGNzOiBjeixcbiAgZGEsXG4gIGRlLFxuICBlbixcbiAgJ2VuLWdiJzogZW5HQixcbiAgZXMsXG4gIGZyLFxuICBoaSxcbiAgaWQsXG4gIGl0LFxuICBqYSxcbiAga28sXG4gIG5sLFxuICBubjogbm8sXG4gIHBsLFxuICBwdCxcbiAgJ3B0LWJyJzogcHRCUixcbiAgcm8sXG4gIHJ1LFxuICB0cixcbiAgJ3poLWNuJzogemhDTixcbiAgJ3poLXR3JzogemhUVyxcbn07XG5cbmNvbnN0IGxvY2FsZSA9IGxvY2FsZU1hcFttb21lbnQubG9jYWxlKCldO1xuXG5leHBvcnQgZnVuY3Rpb24gdChzdHI6IGtleW9mIHR5cGVvZiBlbik6IHN0cmluZyB7XG4gIHJldHVybiAobG9jYWxlICYmIGxvY2FsZVtzdHJdKSB8fCBlbltzdHJdO1xufVxuIiwiaW1wb3J0IHsgQXBwLCBQbHVnaW5TZXR0aW5nVGFiLCBTZXR0aW5nIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgaW1hZ2VBdXRvVXBsb2FkUGx1Z2luIGZyb20gXCIuL21haW5cIjtcbmltcG9ydCB7IHQgfSBmcm9tIFwiLi9sYW5nL2hlbHBlcnNcIjtcbmltcG9ydCB7IGdldE9TIH0gZnJvbSBcIi4vdXRpbHNcIjtcblxuZXhwb3J0IGludGVyZmFjZSBQbHVnaW5TZXR0aW5ncyB7XG4gIHVwbG9hZEJ5Q2xpcFN3aXRjaDogYm9vbGVhbjtcbiAgdXBsb2FkU2VydmVyOiBzdHJpbmc7XG4gIHVwbG9hZGVyOiBzdHJpbmc7XG4gIHBpY2dvQ29yZVBhdGg6IHN0cmluZztcbiAgd29ya09uTmV0V29yazogYm9vbGVhbjtcbiAgbmV3V29ya0JsYWNrRG9tYWluczogc3RyaW5nO1xuICBmaXhQYXRoOiBib29sZWFuO1xuICBhcHBseUltYWdlOiBib29sZWFuO1xuICBkZWxldGVTb3VyY2U6IGJvb2xlYW47XG59XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX1NFVFRJTkdTOiBQbHVnaW5TZXR0aW5ncyA9IHtcbiAgdXBsb2FkQnlDbGlwU3dpdGNoOiB0cnVlLFxuICB1cGxvYWRlcjogXCJQaWNHb1wiLFxuICB1cGxvYWRTZXJ2ZXI6IFwiaHR0cDovLzEyNy4wLjAuMTozNjY3Ny91cGxvYWRcIixcbiAgcGljZ29Db3JlUGF0aDogXCJcIixcbiAgd29ya09uTmV0V29yazogZmFsc2UsXG4gIGZpeFBhdGg6IGZhbHNlLFxuICBhcHBseUltYWdlOiB0cnVlLFxuICBuZXdXb3JrQmxhY2tEb21haW5zOiBcIlwiLFxuICBkZWxldGVTb3VyY2U6IGZhbHNlLFxufTtcblxuZXhwb3J0IGNsYXNzIFNldHRpbmdUYWIgZXh0ZW5kcyBQbHVnaW5TZXR0aW5nVGFiIHtcbiAgcGx1Z2luOiBpbWFnZUF1dG9VcGxvYWRQbHVnaW47XG5cbiAgY29uc3RydWN0b3IoYXBwOiBBcHAsIHBsdWdpbjogaW1hZ2VBdXRvVXBsb2FkUGx1Z2luKSB7XG4gICAgc3VwZXIoYXBwLCBwbHVnaW4pO1xuICAgIHRoaXMucGx1Z2luID0gcGx1Z2luO1xuICB9XG5cbiAgZGlzcGxheSgpOiB2b2lkIHtcbiAgICBsZXQgeyBjb250YWluZXJFbCB9ID0gdGhpcztcblxuICAgIGNvbnN0IG9zID0gZ2V0T1MoKTtcblxuICAgIGNvbnRhaW5lckVsLmVtcHR5KCk7XG4gICAgY29udGFpbmVyRWwuY3JlYXRlRWwoXCJoMlwiLCB7IHRleHQ6IHQoXCJQbHVnaW4gU2V0dGluZ3NcIikgfSk7XG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZSh0KFwiQXV0byBwYXN0ZWQgdXBsb2FkXCIpKVxuICAgICAgLnNldERlc2MoXG4gICAgICAgIHQoXG4gICAgICAgICAgXCJJZiB5b3Ugc2V0IHRoaXMgdmFsdWUgdHJ1ZSwgd2hlbiB5b3UgcGFzdGUgaW1hZ2UsIGl0IHdpbGwgYmUgYXV0byB1cGxvYWRlZCh5b3Ugc2hvdWxkIHNldCB0aGUgcGljR28gc2VydmVyIHJpZ2h0bHkpXCJcbiAgICAgICAgKVxuICAgICAgKVxuICAgICAgLmFkZFRvZ2dsZSh0b2dnbGUgPT5cbiAgICAgICAgdG9nZ2xlXG4gICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnVwbG9hZEJ5Q2xpcFN3aXRjaClcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgdmFsdWUgPT4ge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MudXBsb2FkQnlDbGlwU3dpdGNoID0gdmFsdWU7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICB9KVxuICAgICAgKTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUodChcIkRlZmF1bHQgdXBsb2FkZXJcIikpXG4gICAgICAuc2V0RGVzYyh0KFwiRGVmYXVsdCB1cGxvYWRlclwiKSlcbiAgICAgIC5hZGREcm9wZG93bihjYiA9PlxuICAgICAgICBjYlxuICAgICAgICAgIC5hZGRPcHRpb24oXCJQaWNHb1wiLCBcIlBpY0dvKGFwcClcIilcbiAgICAgICAgICAuYWRkT3B0aW9uKFwiUGljR28tQ29yZVwiLCBcIlBpY0dvLUNvcmVcIilcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MudXBsb2FkZXIpXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jIHZhbHVlID0+IHtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnVwbG9hZGVyID0gdmFsdWU7XG4gICAgICAgICAgICB0aGlzLmRpc3BsYXkoKTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgIH0pXG4gICAgICApO1xuXG4gICAgaWYgKHRoaXMucGx1Z2luLnNldHRpbmdzLnVwbG9hZGVyID09PSBcIlBpY0dvXCIpIHtcbiAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAuc2V0TmFtZSh0KFwiUGljR28gc2VydmVyXCIpKVxuICAgICAgICAuc2V0RGVzYyh0KFwiUGljR28gc2VydmVyXCIpKVxuICAgICAgICAuYWRkVGV4dCh0ZXh0ID0+XG4gICAgICAgICAgdGV4dFxuICAgICAgICAgICAgLnNldFBsYWNlaG9sZGVyKHQoXCJQbGVhc2UgaW5wdXQgUGljR28gc2VydmVyXCIpKVxuICAgICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnVwbG9hZFNlcnZlcilcbiAgICAgICAgICAgIC5vbkNoYW5nZShhc3luYyBrZXkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy51cGxvYWRTZXJ2ZXIgPSBrZXk7XG4gICAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wbHVnaW4uc2V0dGluZ3MudXBsb2FkZXIgPT09IFwiUGljR28tQ29yZVwiKSB7XG4gICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgLnNldE5hbWUodChcIlBpY0dvLUNvcmUgcGF0aFwiKSlcbiAgICAgICAgLnNldERlc2MoXG4gICAgICAgICAgdChcIlBsZWFzZSBpbnB1dCBQaWNHby1Db3JlIHBhdGgsIGRlZmF1bHQgdXNpbmcgZW52aXJvbm1lbnQgdmFyaWFibGVzXCIpXG4gICAgICAgIClcbiAgICAgICAgLmFkZFRleHQodGV4dCA9PlxuICAgICAgICAgIHRleHRcbiAgICAgICAgICAgIC5zZXRQbGFjZWhvbGRlcihcIlwiKVxuICAgICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnBpY2dvQ29yZVBhdGgpXG4gICAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgdmFsdWUgPT4ge1xuICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5waWNnb0NvcmVQYXRoID0gdmFsdWU7XG4gICAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgKTtcblxuICAgICAgaWYgKG9zICE9PSBcIldpbmRvd3NcIikge1xuICAgICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgICAuc2V0TmFtZSh0KFwiZml4UGF0aFwiKSlcbiAgICAgICAgICAuc2V0RGVzYyh0KFwiZml4UGF0aFdhcm5pbmdcIikpXG4gICAgICAgICAgLmFkZFRvZ2dsZSh0b2dnbGUgPT5cbiAgICAgICAgICAgIHRvZ2dsZVxuICAgICAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MuZml4UGF0aClcbiAgICAgICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jIHZhbHVlID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5maXhQYXRoID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKHQoXCJXb3JrIG9uIG5ldHdvcmtcIikpXG4gICAgICAuc2V0RGVzYyh0KFwiV29yayBvbiBuZXR3b3JrIERlc2NyaXB0aW9uXCIpKVxuICAgICAgLmFkZFRvZ2dsZSh0b2dnbGUgPT5cbiAgICAgICAgdG9nZ2xlXG4gICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLndvcmtPbk5ldFdvcmspXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jIHZhbHVlID0+IHtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLndvcmtPbk5ldFdvcmsgPSB2YWx1ZTtcbiAgICAgICAgICAgIHRoaXMuZGlzcGxheSgpO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgfSlcbiAgICAgICk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKHQoXCJOZXR3b3JrIERvbWFpbiBCbGFjayBMaXN0XCIpKVxuICAgICAgLnNldERlc2ModChcIk5ldHdvcmsgRG9tYWluIEJsYWNrIExpc3QgRGVzY3JpcHRpb25cIikpXG4gICAgICAuYWRkVGV4dEFyZWEodGV4dEFyZWEgPT5cbiAgICAgICAgdGV4dEFyZWFcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MubmV3V29ya0JsYWNrRG9tYWlucylcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgdmFsdWUgPT4ge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MubmV3V29ya0JsYWNrRG9tYWlucyA9IHZhbHVlO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgfSlcbiAgICAgICk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKHQoXCJVcGxvYWQgd2hlbiBjbGlwYm9hcmQgaGFzIGltYWdlIGFuZCB0ZXh0IHRvZ2V0aGVyXCIpKVxuICAgICAgLnNldERlc2MoXG4gICAgICAgIHQoXG4gICAgICAgICAgXCJXaGVuIHlvdSBjb3B5LCBzb21lIGFwcGxpY2F0aW9uIGxpa2UgRXhjZWwgd2lsbCBpbWFnZSBhbmQgdGV4dCB0byBjbGlwYm9hcmQsIHlvdSBjYW4gdXBsb2FkIG9yIG5vdC5cIlxuICAgICAgICApXG4gICAgICApXG4gICAgICAuYWRkVG9nZ2xlKHRvZ2dsZSA9PlxuICAgICAgICB0b2dnbGVcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MuYXBwbHlJbWFnZSlcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgdmFsdWUgPT4ge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuYXBwbHlJbWFnZSA9IHZhbHVlO1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICB9KVxuICAgICAgKTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUodChcIkRlbGV0ZSBzb3VyY2UgZmlsZSBhZnRlciB5b3UgdXBsb2FkIGZpbGVcIikpXG4gICAgICAuc2V0RGVzYyh0KFwiRGVsZXRlIHNvdXJjZSBmaWxlIGluIG9iIGFzc2V0cyBhZnRlciB5b3UgdXBsb2FkIGZpbGUuXCIpKVxuICAgICAgLmFkZFRvZ2dsZSh0b2dnbGUgPT5cbiAgICAgICAgdG9nZ2xlXG4gICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLmRlbGV0ZVNvdXJjZSlcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgdmFsdWUgPT4ge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuZGVsZXRlU291cmNlID0gdmFsdWU7XG4gICAgICAgICAgICB0aGlzLmRpc3BsYXkoKTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgIH0pXG4gICAgICApO1xuICB9XG59XG4iLCJpbXBvcnQge1xuICBNYXJrZG93blZpZXcsXG4gIFBsdWdpbixcbiAgRmlsZVN5c3RlbUFkYXB0ZXIsXG4gIEVkaXRvcixcbiAgTWVudSxcbiAgTWVudUl0ZW0sXG4gIFRGaWxlLFxuICBub3JtYWxpemVQYXRoLFxuICBOb3RpY2UsXG4gIGFkZEljb24sXG4gIHJlcXVlc3RVcmwsXG59IGZyb20gXCJvYnNpZGlhblwiO1xuXG5pbXBvcnQgeyByZXNvbHZlLCByZWxhdGl2ZSwgam9pbiwgcGFyc2UsIHBvc2l4LCBiYXNlbmFtZSB9IGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBleGlzdHNTeW5jLCBta2RpclN5bmMsIHdyaXRlRmlsZVN5bmMsIHVubGluayB9IGZyb20gXCJmc1wiO1xuXG5pbXBvcnQgZml4UGF0aCBmcm9tIFwiZml4LXBhdGhcIjtcblxuaW1wb3J0IHtcbiAgaXNBc3NldFR5cGVBbkltYWdlLFxuICBpc0FuSW1hZ2UsXG4gIGdldFVybEFzc2V0LFxuICBhcnJheVRvT2JqZWN0LFxufSBmcm9tIFwiLi91dGlsc1wiO1xuaW1wb3J0IHsgUGljR29VcGxvYWRlciwgUGljR29Db3JlVXBsb2FkZXIgfSBmcm9tIFwiLi91cGxvYWRlclwiO1xuaW1wb3J0IEhlbHBlciBmcm9tIFwiLi9oZWxwZXJcIjtcblxuaW1wb3J0IHsgU2V0dGluZ1RhYiwgUGx1Z2luU2V0dGluZ3MsIERFRkFVTFRfU0VUVElOR1MgfSBmcm9tIFwiLi9zZXR0aW5nXCI7XG5cbmludGVyZmFjZSBJbWFnZSB7XG4gIHBhdGg6IHN0cmluZztcbiAgbmFtZTogc3RyaW5nO1xuICBzb3VyY2U6IHN0cmluZztcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgaW1hZ2VBdXRvVXBsb2FkUGx1Z2luIGV4dGVuZHMgUGx1Z2luIHtcbiAgc2V0dGluZ3M6IFBsdWdpblNldHRpbmdzO1xuICBoZWxwZXI6IEhlbHBlcjtcbiAgZWRpdG9yOiBFZGl0b3I7XG4gIHBpY0dvVXBsb2FkZXI6IFBpY0dvVXBsb2FkZXI7XG4gIHBpY0dvQ29yZVVwbG9hZGVyOiBQaWNHb0NvcmVVcGxvYWRlcjtcbiAgdXBsb2FkZXI6IFBpY0dvVXBsb2FkZXIgfCBQaWNHb0NvcmVVcGxvYWRlcjtcblxuICBhc3luYyBsb2FkU2V0dGluZ3MoKSB7XG4gICAgdGhpcy5zZXR0aW5ncyA9IE9iamVjdC5hc3NpZ24oREVGQVVMVF9TRVRUSU5HUywgYXdhaXQgdGhpcy5sb2FkRGF0YSgpKTtcbiAgfVxuXG4gIGFzeW5jIHNhdmVTZXR0aW5ncygpIHtcbiAgICBhd2FpdCB0aGlzLnNhdmVEYXRhKHRoaXMuc2V0dGluZ3MpO1xuICB9XG5cbiAgb251bmxvYWQoKSB7fVxuXG4gIGFzeW5jIG9ubG9hZCgpIHtcbiAgICBhd2FpdCB0aGlzLmxvYWRTZXR0aW5ncygpO1xuXG4gICAgdGhpcy5oZWxwZXIgPSBuZXcgSGVscGVyKHRoaXMuYXBwKTtcbiAgICB0aGlzLnBpY0dvVXBsb2FkZXIgPSBuZXcgUGljR29VcGxvYWRlcih0aGlzLnNldHRpbmdzKTtcbiAgICB0aGlzLnBpY0dvQ29yZVVwbG9hZGVyID0gbmV3IFBpY0dvQ29yZVVwbG9hZGVyKHRoaXMuc2V0dGluZ3MpO1xuXG4gICAgaWYgKHRoaXMuc2V0dGluZ3MudXBsb2FkZXIgPT09IFwiUGljR29cIikge1xuICAgICAgdGhpcy51cGxvYWRlciA9IHRoaXMucGljR29VcGxvYWRlcjtcbiAgICB9IGVsc2UgaWYgKHRoaXMuc2V0dGluZ3MudXBsb2FkZXIgPT09IFwiUGljR28tQ29yZVwiKSB7XG4gICAgICB0aGlzLnVwbG9hZGVyID0gdGhpcy5waWNHb0NvcmVVcGxvYWRlcjtcbiAgICAgIGlmICh0aGlzLnNldHRpbmdzLmZpeFBhdGgpIHtcbiAgICAgICAgZml4UGF0aCgpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBuZXcgTm90aWNlKFwidW5rbm93biB1cGxvYWRlclwiKTtcbiAgICB9XG5cbiAgICBhZGRJY29uKFxuICAgICAgXCJ1cGxvYWRcIixcbiAgICAgIGA8c3ZnIHQ9XCIxNjM2NjMwNzgzNDI5XCIgY2xhc3M9XCJpY29uXCIgdmlld0JveD1cIjAgMCAxMDAgMTAwXCIgdmVyc2lvbj1cIjEuMVwiIHAtaWQ9XCI0NjQ5XCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPlxuICAgICAgPHBhdGggZD1cIk0gNzEuNjM4IDM1LjMzNiBMIDc5LjQwOCAzNS4zMzYgQyA4My43IDM1LjMzNiA4Ny4xNzggMzguNjYyIDg3LjE3OCA0Mi43NjUgTCA4Ny4xNzggODQuODY0IEMgODcuMTc4IDg4Ljk2OSA4My43IDkyLjI5NSA3OS40MDggOTIuMjk1IEwgMTcuMjQ5IDkyLjI5NSBDIDEyLjk1NyA5Mi4yOTUgOS40NzkgODguOTY5IDkuNDc5IDg0Ljg2NCBMIDkuNDc5IDQyLjc2NSBDIDkuNDc5IDM4LjY2MiAxMi45NTcgMzUuMzM2IDE3LjI0OSAzNS4zMzYgTCAyNS4wMTkgMzUuMzM2IEwgMjUuMDE5IDQyLjc2NSBMIDE3LjI0OSA0Mi43NjUgTCAxNy4yNDkgODQuODY0IEwgNzkuNDA4IDg0Ljg2NCBMIDc5LjQwOCA0Mi43NjUgTCA3MS42MzggNDIuNzY1IEwgNzEuNjM4IDM1LjMzNiBaIE0gNDkuMDE0IDEwLjE3OSBMIDY3LjMyNiAyNy42ODggTCA2MS44MzUgMzIuOTQyIEwgNTIuODQ5IDI0LjM1MiBMIDUyLjg0OSA1OS43MzEgTCA0NS4wNzggNTkuNzMxIEwgNDUuMDc4IDI0LjQ1NSBMIDM2LjE5NCAzMi45NDcgTCAzMC43MDIgMjcuNjkyIEwgNDkuMDEyIDEwLjE4MSBaXCIgcC1pZD1cIjQ2NTBcIiBmaWxsPVwiIzhhOGE4YVwiPjwvcGF0aD5cbiAgICA8L3N2Zz5gXG4gICAgKTtcblxuICAgIHRoaXMuYWRkU2V0dGluZ1RhYihuZXcgU2V0dGluZ1RhYih0aGlzLmFwcCwgdGhpcykpO1xuXG4gICAgdGhpcy5hZGRDb21tYW5kKHtcbiAgICAgIGlkOiBcIlVwbG9hZCBhbGwgaW1hZ2VzXCIsXG4gICAgICBuYW1lOiBcIlVwbG9hZCBhbGwgaW1hZ2VzXCIsXG4gICAgICBjaGVja0NhbGxiYWNrOiAoY2hlY2tpbmc6IGJvb2xlYW4pID0+IHtcbiAgICAgICAgbGV0IGxlYWYgPSB0aGlzLmFwcC53b3Jrc3BhY2UuYWN0aXZlTGVhZjtcbiAgICAgICAgaWYgKGxlYWYpIHtcbiAgICAgICAgICBpZiAoIWNoZWNraW5nKSB7XG4gICAgICAgICAgICB0aGlzLnVwbG9hZEFsbEZpbGUoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICB0aGlzLmFkZENvbW1hbmQoe1xuICAgICAgaWQ6IFwiRG93bmxvYWQgYWxsIGltYWdlc1wiLFxuICAgICAgbmFtZTogXCJEb3dubG9hZCBhbGwgaW1hZ2VzXCIsXG4gICAgICBjaGVja0NhbGxiYWNrOiAoY2hlY2tpbmc6IGJvb2xlYW4pID0+IHtcbiAgICAgICAgbGV0IGxlYWYgPSB0aGlzLmFwcC53b3Jrc3BhY2UuYWN0aXZlTGVhZjtcbiAgICAgICAgaWYgKGxlYWYpIHtcbiAgICAgICAgICBpZiAoIWNoZWNraW5nKSB7XG4gICAgICAgICAgICB0aGlzLmRvd25sb2FkQWxsSW1hZ2VGaWxlcygpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgdGhpcy5zZXR1cFBhc3RlSGFuZGxlcigpO1xuICAgIHRoaXMucmVnaXN0ZXJGaWxlTWVudSgpO1xuICB9XG5cbiAgYXN5bmMgZG93bmxvYWRBbGxJbWFnZUZpbGVzKCkge1xuICAgIGNvbnN0IGZvbGRlclBhdGggPSB0aGlzLmdldEZpbGVBc3NldFBhdGgoKTtcbiAgICBjb25zdCBmaWxlQXJyYXkgPSB0aGlzLmhlbHBlci5nZXRBbGxGaWxlcygpO1xuICAgIGlmICghZXhpc3RzU3luYyhmb2xkZXJQYXRoKSkge1xuICAgICAgbWtkaXJTeW5jKGZvbGRlclBhdGgpO1xuICAgIH1cblxuICAgIGxldCBpbWFnZUFycmF5ID0gW107XG4gICAgZm9yIChjb25zdCBmaWxlIG9mIGZpbGVBcnJheSkge1xuICAgICAgaWYgKCFmaWxlLnBhdGguc3RhcnRzV2l0aChcImh0dHBcIikpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHVybCA9IGZpbGUucGF0aDtcbiAgICAgIGNvbnN0IGFzc2V0ID0gZ2V0VXJsQXNzZXQodXJsKTtcbiAgICAgIGlmICghaXNBbkltYWdlKGFzc2V0LnN1YnN0cihhc3NldC5sYXN0SW5kZXhPZihcIi5cIikpKSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGxldCBbbmFtZSwgZXh0XSA9IFtcbiAgICAgICAgZGVjb2RlVVJJKHBhcnNlKGFzc2V0KS5uYW1lKS5yZXBsYWNlQWxsKC9bXFxcXFxcXFwvOio/XFxcIjw+fF0vZywgXCItXCIpLFxuICAgICAgICBwYXJzZShhc3NldCkuZXh0LFxuICAgICAgXTtcbiAgICAgIC8vIOWmguaenOaWh+S7tuWQjeW3suWtmOWcqO+8jOWImeeUqOmaj+acuuWAvOabv+aNolxuICAgICAgaWYgKGV4aXN0c1N5bmMoam9pbihmb2xkZXJQYXRoLCBlbmNvZGVVUkkoYXNzZXQpKSkpIHtcbiAgICAgICAgbmFtZSA9IChNYXRoLnJhbmRvbSgpICsgMSkudG9TdHJpbmcoMzYpLnN1YnN0cigyLCA1KTtcbiAgICAgIH1cbiAgICAgIG5hbWUgPSBgaW1hZ2UtJHtuYW1lfWA7XG5cbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgdGhpcy5kb3dubG9hZChcbiAgICAgICAgdXJsLFxuICAgICAgICBqb2luKGZvbGRlclBhdGgsIGAke25hbWV9JHtleHR9YClcbiAgICAgICk7XG4gICAgICBpZiAocmVzcG9uc2Uub2spIHtcbiAgICAgICAgY29uc3QgYWN0aXZlRm9sZGVyID0gdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKFxuICAgICAgICAgIHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCkucGF0aFxuICAgICAgICApLnBhcmVudC5wYXRoO1xuXG4gICAgICAgIGNvbnN0IGJhc2VQYXRoID0gKFxuICAgICAgICAgIHRoaXMuYXBwLnZhdWx0LmFkYXB0ZXIgYXMgRmlsZVN5c3RlbUFkYXB0ZXJcbiAgICAgICAgKS5nZXRCYXNlUGF0aCgpO1xuICAgICAgICBjb25zdCBhYnN0cmFjdEFjdGl2ZUZvbGRlciA9IHJlc29sdmUoYmFzZVBhdGgsIGFjdGl2ZUZvbGRlcik7XG5cbiAgICAgICAgaW1hZ2VBcnJheS5wdXNoKHtcbiAgICAgICAgICBzb3VyY2U6IGZpbGUuc291cmNlLFxuICAgICAgICAgIG5hbWU6IG5hbWUsXG4gICAgICAgICAgcGF0aDogbm9ybWFsaXplUGF0aChyZWxhdGl2ZShhYnN0cmFjdEFjdGl2ZUZvbGRlciwgcmVzcG9uc2UucGF0aCkpLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgdmFsdWUgPSB0aGlzLmhlbHBlci5nZXRWYWx1ZSgpO1xuICAgIGltYWdlQXJyYXkubWFwKGltYWdlID0+IHtcbiAgICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZShcbiAgICAgICAgaW1hZ2Uuc291cmNlLFxuICAgICAgICBgIVske2ltYWdlLm5hbWV9XSgke2VuY29kZVVSSShpbWFnZS5wYXRoKX0pYFxuICAgICAgKTtcbiAgICB9KTtcblxuICAgIHRoaXMuaGVscGVyLnNldFZhbHVlKHZhbHVlKTtcblxuICAgIG5ldyBOb3RpY2UoXG4gICAgICBgYWxsOiAke2ZpbGVBcnJheS5sZW5ndGh9XFxuc3VjY2VzczogJHtpbWFnZUFycmF5Lmxlbmd0aH1cXG5mYWlsZWQ6ICR7XG4gICAgICAgIGZpbGVBcnJheS5sZW5ndGggLSBpbWFnZUFycmF5Lmxlbmd0aFxuICAgICAgfWBcbiAgICApO1xuICB9XG5cbiAgLy8g6I635Y+W5b2T5YmN5paH5Lu25omA5bGe55qE6ZmE5Lu25paH5Lu25aS5XG4gIGdldEZpbGVBc3NldFBhdGgoKSB7XG4gICAgY29uc3QgYmFzZVBhdGggPSAoXG4gICAgICB0aGlzLmFwcC52YXVsdC5hZGFwdGVyIGFzIEZpbGVTeXN0ZW1BZGFwdGVyXG4gICAgKS5nZXRCYXNlUGF0aCgpO1xuXG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGNvbnN0IGFzc2V0Rm9sZGVyOiBzdHJpbmcgPSB0aGlzLmFwcC52YXVsdC5jb25maWcuYXR0YWNobWVudEZvbGRlclBhdGg7XG4gICAgY29uc3QgYWN0aXZlRmlsZSA9IHRoaXMuYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChcbiAgICAgIHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCkucGF0aFxuICAgICk7XG5cbiAgICAvLyDlvZPliY3mlofku7blpLnkuIvnmoTlrZDmlofku7blpLlcbiAgICBpZiAoYXNzZXRGb2xkZXIuc3RhcnRzV2l0aChcIi4vXCIpKSB7XG4gICAgICBjb25zdCBhY3RpdmVGb2xkZXIgPSBkZWNvZGVVUkkocmVzb2x2ZShiYXNlUGF0aCwgYWN0aXZlRmlsZS5wYXJlbnQucGF0aCkpO1xuICAgICAgcmV0dXJuIGpvaW4oYWN0aXZlRm9sZGVyLCBhc3NldEZvbGRlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIOagueaWh+S7tuWkuVxuICAgICAgcmV0dXJuIGpvaW4oYmFzZVBhdGgsIGFzc2V0Rm9sZGVyKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBkb3dubG9hZCh1cmw6IHN0cmluZywgcGF0aDogc3RyaW5nKSB7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCByZXF1ZXN0VXJsKHsgdXJsIH0pO1xuXG4gICAgaWYgKHJlc3BvbnNlLnN0YXR1cyAhPT0gMjAwKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBvazogZmFsc2UsXG4gICAgICAgIG1zZzogXCJlcnJvclwiLFxuICAgICAgfTtcbiAgICB9XG4gICAgY29uc3QgYnVmZmVyID0gQnVmZmVyLmZyb20ocmVzcG9uc2UuYXJyYXlCdWZmZXIpO1xuXG4gICAgdHJ5IHtcbiAgICAgIHdyaXRlRmlsZVN5bmMocGF0aCwgYnVmZmVyKTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIG9rOiB0cnVlLFxuICAgICAgICBtc2c6IFwib2tcIixcbiAgICAgICAgcGF0aDogcGF0aCxcbiAgICAgIH07XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGVycik7XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIG9rOiBmYWxzZSxcbiAgICAgICAgbXNnOiBlcnIsXG4gICAgICB9O1xuICAgIH1cbiAgfVxuXG4gIHJlZ2lzdGVyRmlsZU1lbnUoKSB7XG4gICAgdGhpcy5yZWdpc3RlckV2ZW50KFxuICAgICAgdGhpcy5hcHAud29ya3NwYWNlLm9uKFxuICAgICAgICBcImZpbGUtbWVudVwiLFxuICAgICAgICAobWVudTogTWVudSwgZmlsZTogVEZpbGUsIHNvdXJjZTogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgaWYgKCFpc0Fzc2V0VHlwZUFuSW1hZ2UoZmlsZS5wYXRoKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBtZW51LmFkZEl0ZW0oKGl0ZW06IE1lbnVJdGVtKSA9PiB7XG4gICAgICAgICAgICBpdGVtXG4gICAgICAgICAgICAgIC5zZXRUaXRsZShcIlVwbG9hZFwiKVxuICAgICAgICAgICAgICAuc2V0SWNvbihcInVwbG9hZFwiKVxuICAgICAgICAgICAgICAub25DbGljaygoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCEoZmlsZSBpbnN0YW5jZW9mIFRGaWxlKSkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLmZpbGVNZW51VXBsb2FkKGZpbGUpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgKVxuICAgICk7XG4gIH1cblxuICBmaWxlTWVudVVwbG9hZChmaWxlOiBURmlsZSkge1xuICAgIGxldCBjb250ZW50ID0gdGhpcy5oZWxwZXIuZ2V0VmFsdWUoKTtcblxuICAgIGNvbnN0IGJhc2VQYXRoID0gKFxuICAgICAgdGhpcy5hcHAudmF1bHQuYWRhcHRlciBhcyBGaWxlU3lzdGVtQWRhcHRlclxuICAgICkuZ2V0QmFzZVBhdGgoKTtcbiAgICBsZXQgaW1hZ2VMaXN0OiBJbWFnZVtdID0gW107XG4gICAgY29uc3QgZmlsZUFycmF5ID0gdGhpcy5oZWxwZXIuZ2V0QWxsRmlsZXMoKTtcblxuICAgIGZvciAoY29uc3QgbWF0Y2ggb2YgZmlsZUFycmF5KSB7XG4gICAgICBjb25zdCBpbWFnZU5hbWUgPSBtYXRjaC5uYW1lO1xuICAgICAgY29uc3QgZW5jb2RlZFVyaSA9IG1hdGNoLnBhdGg7XG5cbiAgICAgIGNvbnN0IGZpbGVOYW1lID0gYmFzZW5hbWUoZGVjb2RlVVJJKGVuY29kZWRVcmkpKTtcblxuICAgICAgaWYgKGZpbGUgJiYgZmlsZS5uYW1lID09PSBmaWxlTmFtZSkge1xuICAgICAgICBjb25zdCBhYnN0cmFjdEltYWdlRmlsZSA9IGpvaW4oYmFzZVBhdGgsIGZpbGUucGF0aCk7XG5cbiAgICAgICAgaWYgKGlzQXNzZXRUeXBlQW5JbWFnZShhYnN0cmFjdEltYWdlRmlsZSkpIHtcbiAgICAgICAgICBpbWFnZUxpc3QucHVzaCh7XG4gICAgICAgICAgICBwYXRoOiBhYnN0cmFjdEltYWdlRmlsZSxcbiAgICAgICAgICAgIG5hbWU6IGltYWdlTmFtZSxcbiAgICAgICAgICAgIHNvdXJjZTogbWF0Y2guc291cmNlLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGltYWdlTGlzdC5sZW5ndGggPT09IDApIHtcbiAgICAgIG5ldyBOb3RpY2UoXCLmsqHmnInop6PmnpDliLDlm77lg4/mlofku7ZcIik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy51cGxvYWRlci51cGxvYWRGaWxlcyhpbWFnZUxpc3QubWFwKGl0ZW0gPT4gaXRlbS5wYXRoKSkudGhlbihyZXMgPT4ge1xuICAgICAgaWYgKHJlcy5zdWNjZXNzKSB7XG4gICAgICAgIGxldCB1cGxvYWRVcmxMaXN0ID0gcmVzLnJlc3VsdDtcbiAgICAgICAgaW1hZ2VMaXN0Lm1hcChpdGVtID0+IHtcbiAgICAgICAgICBjb25zdCB1cGxvYWRJbWFnZSA9IHVwbG9hZFVybExpc3Quc2hpZnQoKTtcbiAgICAgICAgICBjb250ZW50ID0gY29udGVudC5yZXBsYWNlQWxsKFxuICAgICAgICAgICAgaXRlbS5zb3VyY2UsXG4gICAgICAgICAgICBgIVske2l0ZW0ubmFtZX1dKCR7dXBsb2FkSW1hZ2V9KWBcbiAgICAgICAgICApO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5oZWxwZXIuc2V0VmFsdWUoY29udGVudCk7XG5cbiAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3MuZGVsZXRlU291cmNlKSB7XG4gICAgICAgICAgaW1hZ2VMaXN0Lm1hcChpbWFnZSA9PiB7XG4gICAgICAgICAgICBpZiAoIWltYWdlLnBhdGguc3RhcnRzV2l0aChcImh0dHBcIikpIHtcbiAgICAgICAgICAgICAgdW5saW5rKGltYWdlLnBhdGgsICgpID0+IHt9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmV3IE5vdGljZShcIlVwbG9hZCBlcnJvclwiKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGZpbHRlckZpbGUoZmlsZUFycmF5OiBJbWFnZVtdKSB7XG4gICAgY29uc3QgaW1hZ2VMaXN0OiBJbWFnZVtdID0gW107XG5cbiAgICBmb3IgKGNvbnN0IG1hdGNoIG9mIGZpbGVBcnJheSkge1xuICAgICAgaWYgKHRoaXMuc2V0dGluZ3Mud29ya09uTmV0V29yayAmJiBtYXRjaC5wYXRoLnN0YXJ0c1dpdGgoXCJodHRwXCIpKSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAhdGhpcy5oZWxwZXIuaGFzQmxhY2tEb21haW4oXG4gICAgICAgICAgICBtYXRjaC5wYXRoLFxuICAgICAgICAgICAgdGhpcy5zZXR0aW5ncy5uZXdXb3JrQmxhY2tEb21haW5zXG4gICAgICAgICAgKVxuICAgICAgICApIHtcbiAgICAgICAgICBpbWFnZUxpc3QucHVzaCh7XG4gICAgICAgICAgICBwYXRoOiBtYXRjaC5wYXRoLFxuICAgICAgICAgICAgbmFtZTogbWF0Y2gubmFtZSxcbiAgICAgICAgICAgIHNvdXJjZTogbWF0Y2guc291cmNlLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbWFnZUxpc3QucHVzaCh7XG4gICAgICAgICAgcGF0aDogbWF0Y2gucGF0aCxcbiAgICAgICAgICBuYW1lOiBtYXRjaC5uYW1lLFxuICAgICAgICAgIHNvdXJjZTogbWF0Y2guc291cmNlLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gaW1hZ2VMaXN0O1xuICB9XG4gIGdldEZpbGUoZmlsZU5hbWU6IHN0cmluZywgZmlsZU1hcDogYW55KSB7XG4gICAgaWYgKCFmaWxlTWFwKSB7XG4gICAgICBmaWxlTWFwID0gYXJyYXlUb09iamVjdCh0aGlzLmFwcC52YXVsdC5nZXRGaWxlcygpLCBcIm5hbWVcIik7XG4gICAgfVxuICAgIHJldHVybiBmaWxlTWFwW2ZpbGVOYW1lXTtcbiAgfVxuICAvLyB1cGxvZGEgYWxsIGZpbGVcbiAgdXBsb2FkQWxsRmlsZSgpIHtcbiAgICBsZXQgY29udGVudCA9IHRoaXMuaGVscGVyLmdldFZhbHVlKCk7XG5cbiAgICBjb25zdCBiYXNlUGF0aCA9IChcbiAgICAgIHRoaXMuYXBwLnZhdWx0LmFkYXB0ZXIgYXMgRmlsZVN5c3RlbUFkYXB0ZXJcbiAgICApLmdldEJhc2VQYXRoKCk7XG4gICAgY29uc3QgZmlsZU1hcCA9IGFycmF5VG9PYmplY3QodGhpcy5hcHAudmF1bHQuZ2V0RmlsZXMoKSwgXCJuYW1lXCIpO1xuICAgIGxldCBpbWFnZUxpc3Q6IEltYWdlW10gPSBbXTtcbiAgICBjb25zdCBmaWxlQXJyYXkgPSB0aGlzLmZpbHRlckZpbGUodGhpcy5oZWxwZXIuZ2V0QWxsRmlsZXMoKSk7XG5cbiAgICBmb3IgKGNvbnN0IG1hdGNoIG9mIGZpbGVBcnJheSkge1xuICAgICAgY29uc3QgaW1hZ2VOYW1lID0gbWF0Y2gubmFtZTtcbiAgICAgIGNvbnN0IGVuY29kZWRVcmkgPSBtYXRjaC5wYXRoO1xuXG4gICAgICBpZiAoZW5jb2RlZFVyaS5zdGFydHNXaXRoKFwiaHR0cFwiKSkge1xuICAgICAgICBpbWFnZUxpc3QucHVzaCh7XG4gICAgICAgICAgcGF0aDogbWF0Y2gucGF0aCxcbiAgICAgICAgICBuYW1lOiBpbWFnZU5hbWUsXG4gICAgICAgICAgc291cmNlOiBtYXRjaC5zb3VyY2UsXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgZmlsZU5hbWUgPSBiYXNlbmFtZShkZWNvZGVVUkkoZW5jb2RlZFVyaSkpO1xuICAgICAgICBjb25zdCBmaWxlID0gdGhpcy5nZXRGaWxlKGZpbGVOYW1lLCBmaWxlTWFwKTtcblxuICAgICAgICBpZiAoZmlsZSkge1xuICAgICAgICAgIGNvbnN0IGFic3RyYWN0SW1hZ2VGaWxlID0gam9pbihiYXNlUGF0aCwgZmlsZS5wYXRoKTtcblxuICAgICAgICAgIGlmIChpc0Fzc2V0VHlwZUFuSW1hZ2UoYWJzdHJhY3RJbWFnZUZpbGUpKSB7XG4gICAgICAgICAgICBpbWFnZUxpc3QucHVzaCh7XG4gICAgICAgICAgICAgIHBhdGg6IGFic3RyYWN0SW1hZ2VGaWxlLFxuICAgICAgICAgICAgICBuYW1lOiBpbWFnZU5hbWUsXG4gICAgICAgICAgICAgIHNvdXJjZTogbWF0Y2guc291cmNlLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGltYWdlTGlzdC5sZW5ndGggPT09IDApIHtcbiAgICAgIG5ldyBOb3RpY2UoXCLmsqHmnInop6PmnpDliLDlm77lg4/mlofku7ZcIik7XG4gICAgICByZXR1cm47XG4gICAgfSBlbHNlIHtcbiAgICAgIG5ldyBOb3RpY2UoYOWFseaJvuWIsCR7aW1hZ2VMaXN0Lmxlbmd0aH3kuKrlm77lg4/mlofku7bvvIzlvIDlp4vkuIrkvKBgKTtcbiAgICB9XG5cbiAgICB0aGlzLnVwbG9hZGVyLnVwbG9hZEZpbGVzKGltYWdlTGlzdC5tYXAoaXRlbSA9PiBpdGVtLnBhdGgpKS50aGVuKHJlcyA9PiB7XG4gICAgICBpZiAocmVzLnN1Y2Nlc3MpIHtcbiAgICAgICAgbGV0IHVwbG9hZFVybExpc3QgPSByZXMucmVzdWx0O1xuICAgICAgICBpbWFnZUxpc3QubWFwKGl0ZW0gPT4ge1xuICAgICAgICAgIGNvbnN0IHVwbG9hZEltYWdlID0gdXBsb2FkVXJsTGlzdC5zaGlmdCgpO1xuICAgICAgICAgIGNvbnRlbnQgPSBjb250ZW50LnJlcGxhY2VBbGwoXG4gICAgICAgICAgICBpdGVtLnNvdXJjZSxcbiAgICAgICAgICAgIGAhWyR7aXRlbS5uYW1lfV0oJHt1cGxvYWRJbWFnZX0pYFxuICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmhlbHBlci5zZXRWYWx1ZShjb250ZW50KTtcblxuICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5kZWxldGVTb3VyY2UpIHtcbiAgICAgICAgICBpbWFnZUxpc3QubWFwKGltYWdlID0+IHtcbiAgICAgICAgICAgIGlmICghaW1hZ2UucGF0aC5zdGFydHNXaXRoKFwiaHR0cFwiKSkge1xuICAgICAgICAgICAgICB1bmxpbmsoaW1hZ2UucGF0aCwgKCkgPT4ge30pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuZXcgTm90aWNlKFwiVXBsb2FkIGVycm9yXCIpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgc2V0dXBQYXN0ZUhhbmRsZXIoKSB7XG4gICAgdGhpcy5yZWdpc3RlckV2ZW50KFxuICAgICAgdGhpcy5hcHAud29ya3NwYWNlLm9uKFxuICAgICAgICBcImVkaXRvci1wYXN0ZVwiLFxuICAgICAgICAoZXZ0OiBDbGlwYm9hcmRFdmVudCwgZWRpdG9yOiBFZGl0b3IsIG1hcmtkb3duVmlldzogTWFya2Rvd25WaWV3KSA9PiB7XG4gICAgICAgICAgY29uc3QgYWxsb3dVcGxvYWQgPSB0aGlzLmhlbHBlci5nZXRGcm9udG1hdHRlclZhbHVlKFxuICAgICAgICAgICAgXCJpbWFnZS1hdXRvLXVwbG9hZFwiLFxuICAgICAgICAgICAgdGhpcy5zZXR0aW5ncy51cGxvYWRCeUNsaXBTd2l0Y2hcbiAgICAgICAgICApO1xuXG4gICAgICAgICAgbGV0IGZpbGVzID0gZXZ0LmNsaXBib2FyZERhdGEuZmlsZXM7XG4gICAgICAgICAgaWYgKCFhbGxvd1VwbG9hZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyDliarotLTmnb/lhoXlrrnmnIltZOagvOW8j+eahOWbvueJh+aXtlxuICAgICAgICAgIGlmICh0aGlzLnNldHRpbmdzLndvcmtPbk5ldFdvcmspIHtcbiAgICAgICAgICAgIGNvbnN0IGNsaXBib2FyZFZhbHVlID0gZXZ0LmNsaXBib2FyZERhdGEuZ2V0RGF0YShcInRleHQvcGxhaW5cIik7XG4gICAgICAgICAgICBjb25zdCBpbWFnZUxpc3QgPSB0aGlzLmhlbHBlclxuICAgICAgICAgICAgICAuZ2V0SW1hZ2VMaW5rKGNsaXBib2FyZFZhbHVlKVxuICAgICAgICAgICAgICAuZmlsdGVyKGltYWdlID0+IGltYWdlLnBhdGguc3RhcnRzV2l0aChcImh0dHBcIikpXG4gICAgICAgICAgICAgIC5maWx0ZXIoXG4gICAgICAgICAgICAgICAgaW1hZ2UgPT5cbiAgICAgICAgICAgICAgICAgICF0aGlzLmhlbHBlci5oYXNCbGFja0RvbWFpbihcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2UucGF0aCxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXR0aW5ncy5uZXdXb3JrQmxhY2tEb21haW5zXG4gICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGlmIChpbWFnZUxpc3QubGVuZ3RoICE9PSAwKSB7XG4gICAgICAgICAgICAgIHRoaXMudXBsb2FkZXJcbiAgICAgICAgICAgICAgICAudXBsb2FkRmlsZXMoaW1hZ2VMaXN0Lm1hcChpdGVtID0+IGl0ZW0ucGF0aCkpXG4gICAgICAgICAgICAgICAgLnRoZW4ocmVzID0+IHtcbiAgICAgICAgICAgICAgICAgIGxldCB2YWx1ZSA9IHRoaXMuaGVscGVyLmdldFZhbHVlKCk7XG4gICAgICAgICAgICAgICAgICBpZiAocmVzLnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHVwbG9hZFVybExpc3QgPSByZXMucmVzdWx0O1xuICAgICAgICAgICAgICAgICAgICBpbWFnZUxpc3QubWFwKGl0ZW0gPT4ge1xuICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHVwbG9hZEltYWdlID0gdXBsb2FkVXJsTGlzdC5zaGlmdCgpO1xuICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZUFsbChcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uc291cmNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgYCFbJHtpdGVtLm5hbWV9XSgke3VwbG9hZEltYWdlfSlgXG4gICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGVscGVyLnNldFZhbHVlKHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG5ldyBOb3RpY2UoXCJVcGxvYWQgZXJyb3JcIik7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8g5Ymq6LS05p2/5Lit5piv5Zu+54mH5pe26L+b6KGM5LiK5LygXG4gICAgICAgICAgaWYgKHRoaXMuY2FuVXBsb2FkKGV2dC5jbGlwYm9hcmREYXRhKSkge1xuICAgICAgICAgICAgdGhpcy51cGxvYWRGaWxlQW5kRW1iZWRJbWd1ckltYWdlKFxuICAgICAgICAgICAgICBlZGl0b3IsXG4gICAgICAgICAgICAgIGFzeW5jIChlZGl0b3I6IEVkaXRvciwgcGFzdGVJZDogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHJlcyA9IGF3YWl0IHRoaXMudXBsb2FkZXIudXBsb2FkRmlsZUJ5Q2xpcGJvYXJkKCk7XG4gICAgICAgICAgICAgICAgaWYgKHJlcy5jb2RlICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZUZhaWxlZFVwbG9hZChlZGl0b3IsIHBhc3RlSWQsIHJlcy5tc2cpO1xuICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCB1cmwgPSByZXMuZGF0YTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdXJsO1xuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBldnQuY2xpcGJvYXJkRGF0YVxuICAgICAgICAgICAgKS5jYXRjaCgpO1xuICAgICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICApXG4gICAgKTtcbiAgICB0aGlzLnJlZ2lzdGVyRXZlbnQoXG4gICAgICB0aGlzLmFwcC53b3Jrc3BhY2Uub24oXG4gICAgICAgIFwiZWRpdG9yLWRyb3BcIixcbiAgICAgICAgYXN5bmMgKGV2dDogRHJhZ0V2ZW50LCBlZGl0b3I6IEVkaXRvciwgbWFya2Rvd25WaWV3OiBNYXJrZG93blZpZXcpID0+IHtcbiAgICAgICAgICBjb25zdCBhbGxvd1VwbG9hZCA9IHRoaXMuaGVscGVyLmdldEZyb250bWF0dGVyVmFsdWUoXG4gICAgICAgICAgICBcImltYWdlLWF1dG8tdXBsb2FkXCIsXG4gICAgICAgICAgICB0aGlzLnNldHRpbmdzLnVwbG9hZEJ5Q2xpcFN3aXRjaFxuICAgICAgICAgICk7XG4gICAgICAgICAgbGV0IGZpbGVzID0gZXZ0LmRhdGFUcmFuc2Zlci5maWxlcztcblxuICAgICAgICAgIGlmICghYWxsb3dVcGxvYWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoZmlsZXMubGVuZ3RoICE9PSAwICYmIGZpbGVzWzBdLnR5cGUuc3RhcnRzV2l0aChcImltYWdlXCIpKSB7XG4gICAgICAgICAgICBsZXQgc2VuZEZpbGVzOiBBcnJheTxTdHJpbmc+ID0gW107XG4gICAgICAgICAgICBsZXQgZmlsZXMgPSBldnQuZGF0YVRyYW5zZmVyLmZpbGVzO1xuICAgICAgICAgICAgQXJyYXkuZnJvbShmaWxlcykuZm9yRWFjaCgoaXRlbSwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgc2VuZEZpbGVzLnB1c2goaXRlbS5wYXRoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCB0aGlzLnVwbG9hZGVyLnVwbG9hZEZpbGVzKHNlbmRGaWxlcyk7XG5cbiAgICAgICAgICAgIGlmIChkYXRhLnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgZGF0YS5yZXN1bHQubWFwKCh2YWx1ZTogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHBhc3RlSWQgPSAoTWF0aC5yYW5kb20oKSArIDEpLnRvU3RyaW5nKDM2KS5zdWJzdHIoMiwgNSk7XG4gICAgICAgICAgICAgICAgdGhpcy5pbnNlcnRUZW1wb3JhcnlUZXh0KGVkaXRvciwgcGFzdGVJZCk7XG4gICAgICAgICAgICAgICAgdGhpcy5lbWJlZE1hcmtEb3duSW1hZ2UoZWRpdG9yLCBwYXN0ZUlkLCB2YWx1ZSwgZmlsZXNbMF0ubmFtZSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgbmV3IE5vdGljZShcIlVwbG9hZCBlcnJvclwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIClcbiAgICApO1xuICB9XG5cbiAgY2FuVXBsb2FkKGNsaXBib2FyZERhdGE6IERhdGFUcmFuc2Zlcikge1xuICAgIHRoaXMuc2V0dGluZ3MuYXBwbHlJbWFnZTtcbiAgICBjb25zdCBmaWxlcyA9IGNsaXBib2FyZERhdGEuZmlsZXM7XG4gICAgY29uc3QgdGV4dCA9IGNsaXBib2FyZERhdGEuZ2V0RGF0YShcInRleHRcIik7XG5cbiAgICBjb25zdCBoYXNJbWFnZUZpbGUgPVxuICAgICAgZmlsZXMubGVuZ3RoICE9PSAwICYmIGZpbGVzWzBdLnR5cGUuc3RhcnRzV2l0aChcImltYWdlXCIpO1xuICAgIGlmIChoYXNJbWFnZUZpbGUpIHtcbiAgICAgIGlmICghIXRleHQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2V0dGluZ3MuYXBwbHlJbWFnZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgdXBsb2FkRmlsZUFuZEVtYmVkSW1ndXJJbWFnZShcbiAgICBlZGl0b3I6IEVkaXRvcixcbiAgICBjYWxsYmFjazogRnVuY3Rpb24sXG4gICAgY2xpcGJvYXJkRGF0YTogRGF0YVRyYW5zZmVyXG4gICkge1xuICAgIGxldCBwYXN0ZUlkID0gKE1hdGgucmFuZG9tKCkgKyAxKS50b1N0cmluZygzNikuc3Vic3RyKDIsIDUpO1xuICAgIHRoaXMuaW5zZXJ0VGVtcG9yYXJ5VGV4dChlZGl0b3IsIHBhc3RlSWQpO1xuICAgIGNvbnN0IG5hbWUgPSBjbGlwYm9hcmREYXRhLmZpbGVzWzBdLm5hbWU7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHVybCA9IGF3YWl0IGNhbGxiYWNrKGVkaXRvciwgcGFzdGVJZCk7XG4gICAgICB0aGlzLmVtYmVkTWFya0Rvd25JbWFnZShlZGl0b3IsIHBhc3RlSWQsIHVybCwgbmFtZSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgdGhpcy5oYW5kbGVGYWlsZWRVcGxvYWQoZWRpdG9yLCBwYXN0ZUlkLCBlKTtcbiAgICB9XG4gIH1cblxuICBpbnNlcnRUZW1wb3JhcnlUZXh0KGVkaXRvcjogRWRpdG9yLCBwYXN0ZUlkOiBzdHJpbmcpIHtcbiAgICBsZXQgcHJvZ3Jlc3NUZXh0ID0gaW1hZ2VBdXRvVXBsb2FkUGx1Z2luLnByb2dyZXNzVGV4dEZvcihwYXN0ZUlkKTtcbiAgICBlZGl0b3IucmVwbGFjZVNlbGVjdGlvbihwcm9ncmVzc1RleHQgKyBcIlxcblwiKTtcbiAgfVxuXG4gIHByaXZhdGUgc3RhdGljIHByb2dyZXNzVGV4dEZvcihpZDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGAhW1VwbG9hZGluZyBmaWxlLi4uJHtpZH1dKClgO1xuICB9XG5cbiAgZW1iZWRNYXJrRG93bkltYWdlKFxuICAgIGVkaXRvcjogRWRpdG9yLFxuICAgIHBhc3RlSWQ6IHN0cmluZyxcbiAgICBpbWFnZVVybDogYW55LFxuICAgIG5hbWU6IHN0cmluZyA9IFwiXCJcbiAgKSB7XG4gICAgbGV0IHByb2dyZXNzVGV4dCA9IGltYWdlQXV0b1VwbG9hZFBsdWdpbi5wcm9ncmVzc1RleHRGb3IocGFzdGVJZCk7XG4gICAgbGV0IG1hcmtEb3duSW1hZ2UgPSBgIVske25hbWV9XSgke2ltYWdlVXJsfSlgO1xuXG4gICAgaW1hZ2VBdXRvVXBsb2FkUGx1Z2luLnJlcGxhY2VGaXJzdE9jY3VycmVuY2UoXG4gICAgICBlZGl0b3IsXG4gICAgICBwcm9ncmVzc1RleHQsXG4gICAgICBtYXJrRG93bkltYWdlXG4gICAgKTtcbiAgfVxuXG4gIGhhbmRsZUZhaWxlZFVwbG9hZChlZGl0b3I6IEVkaXRvciwgcGFzdGVJZDogc3RyaW5nLCByZWFzb246IGFueSkge1xuICAgIGNvbnNvbGUuZXJyb3IoXCJGYWlsZWQgcmVxdWVzdDogXCIsIHJlYXNvbik7XG4gICAgbGV0IHByb2dyZXNzVGV4dCA9IGltYWdlQXV0b1VwbG9hZFBsdWdpbi5wcm9ncmVzc1RleHRGb3IocGFzdGVJZCk7XG4gICAgaW1hZ2VBdXRvVXBsb2FkUGx1Z2luLnJlcGxhY2VGaXJzdE9jY3VycmVuY2UoXG4gICAgICBlZGl0b3IsXG4gICAgICBwcm9ncmVzc1RleHQsXG4gICAgICBcIuKaoO+4j3VwbG9hZCBmYWlsZWQsIGNoZWNrIGRldiBjb25zb2xlXCJcbiAgICApO1xuICB9XG5cbiAgc3RhdGljIHJlcGxhY2VGaXJzdE9jY3VycmVuY2UoXG4gICAgZWRpdG9yOiBFZGl0b3IsXG4gICAgdGFyZ2V0OiBzdHJpbmcsXG4gICAgcmVwbGFjZW1lbnQ6IHN0cmluZ1xuICApIHtcbiAgICBsZXQgbGluZXMgPSBlZGl0b3IuZ2V0VmFsdWUoKS5zcGxpdChcIlxcblwiKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgY2ggPSBsaW5lc1tpXS5pbmRleE9mKHRhcmdldCk7XG4gICAgICBpZiAoY2ggIT0gLTEpIHtcbiAgICAgICAgbGV0IGZyb20gPSB7IGxpbmU6IGksIGNoOiBjaCB9O1xuICAgICAgICBsZXQgdG8gPSB7IGxpbmU6IGksIGNoOiBjaCArIHRhcmdldC5sZW5ndGggfTtcbiAgICAgICAgZWRpdG9yLnJlcGxhY2VSYW5nZShyZXBsYWNlbWVudCwgZnJvbSwgdG8pO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdLCJuYW1lcyI6WyJpc2V4ZSIsInN5bmMiLCJjaGVja1N0YXQiLCJmcyIsImNvcmUiLCJnbG9iYWwiLCJyZXF1aXJlJCQwIiwicmVxdWlyZSQkMSIsInBhdGgiLCJ3aGljaCIsImdldFBhdGhLZXkiLCJpc1dpbiIsInJlc29sdmVDb21tYW5kIiwicmVhZFNoZWJhbmciLCJlc2NhcGUiLCJwYXJzZSIsImNwIiwicGF0aEtleSIsIm1pbWljRm4iLCJfcmVhbHRpbWUiLCJfY29yZSIsIl9vcyIsIl9zaWduYWxzIiwic2lnbmFscyIsInJlcXVpcmUkJDIiLCJzcGF3bmVkS2lsbCIsIm9zIiwic3Bhd25lZENhbmNlbCIsInNldHVwVGltZW91dCIsInZhbGlkYXRlVGltZW91dCIsInNldEV4aXRIYW5kbGVyIiwib25FeGl0Iiwic3RyZWFtIiwiaGFuZGxlSW5wdXQiLCJpc1N0cmVhbSIsIm1ha2VBbGxTdHJlYW0iLCJnZXRTdHJlYW0iLCJnZXRTcGF3bmVkUmVzdWx0IiwidmFsaWRhdGVJbnB1dFN5bmMiLCJtZXJnZVByb21pc2UiLCJnZXRTcGF3bmVkUHJvbWlzZSIsImpvaW5Db21tYW5kIiwiZ2V0RXNjYXBlZENvbW1hbmQiLCJwYXJzZUNvbW1hbmQiLCJyZXF1aXJlJCQzIiwibnBtUnVuUGF0aCIsIm5vcm1hbGl6ZVN0ZGlvIiwiY2hpbGRQcm9jZXNzIiwiZXJyb3IiLCJtYWtlRXJyb3IiLCJvbmV0aW1lIiwic3RkaW8iLCJwcm9jZXNzIiwidXNlckluZm8iLCJleGVjYSIsImV4dG5hbWUiLCJyZXF1ZXN0VXJsIiwiTm90aWNlIiwiZXhlYyIsIk1hcmtkb3duVmlldyIsIm1vbWVudCIsIlNldHRpbmciLCJQbHVnaW5TZXR0aW5nVGFiIiwiYWRkSWNvbiIsImV4aXN0c1N5bmMiLCJta2RpclN5bmMiLCJqb2luIiwicmVzb2x2ZSIsIm5vcm1hbGl6ZVBhdGgiLCJyZWxhdGl2ZSIsIndyaXRlRmlsZVN5bmMiLCJURmlsZSIsImJhc2VuYW1lIiwidW5saW5rIiwiUGx1Z2luIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxhQUFhLEdBQUcsU0FBUyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ25DLElBQUksYUFBYSxHQUFHLE1BQU0sQ0FBQyxjQUFjO0FBQ3pDLFNBQVMsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFLFlBQVksS0FBSyxJQUFJLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQztBQUNwRixRQUFRLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztBQUMxRyxJQUFJLE9BQU8sYUFBYSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUMvQixDQUFDLENBQUM7QUFDRjtBQUNPLFNBQVMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDaEMsSUFBSSxJQUFJLE9BQU8sQ0FBQyxLQUFLLFVBQVUsSUFBSSxDQUFDLEtBQUssSUFBSTtBQUM3QyxRQUFRLE1BQU0sSUFBSSxTQUFTLENBQUMsc0JBQXNCLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLCtCQUErQixDQUFDLENBQUM7QUFDbEcsSUFBSSxhQUFhLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3hCLElBQUksU0FBUyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxFQUFFO0FBQzNDLElBQUksQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLEtBQUssSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztBQUN6RixDQUFDO0FBdUNEO0FBQ08sU0FBUyxTQUFTLENBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFO0FBQzdELElBQUksU0FBUyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsT0FBTyxLQUFLLFlBQVksQ0FBQyxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQyxVQUFVLE9BQU8sRUFBRSxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFO0FBQ2hILElBQUksT0FBTyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsT0FBTyxDQUFDLEVBQUUsVUFBVSxPQUFPLEVBQUUsTUFBTSxFQUFFO0FBQy9ELFFBQVEsU0FBUyxTQUFTLENBQUMsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtBQUNuRyxRQUFRLFNBQVMsUUFBUSxDQUFDLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtBQUN0RyxRQUFRLFNBQVMsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFLE1BQU0sQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUMsRUFBRTtBQUN0SCxRQUFRLElBQUksQ0FBQyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxVQUFVLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUM5RSxLQUFLLENBQUMsQ0FBQztBQUNQLENBQUM7QUFDRDtBQUNPLFNBQVMsV0FBVyxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUU7QUFDM0MsSUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3JILElBQUksT0FBTyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLE9BQU8sTUFBTSxLQUFLLFVBQVUsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLFdBQVcsRUFBRSxPQUFPLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDN0osSUFBSSxTQUFTLElBQUksQ0FBQyxDQUFDLEVBQUUsRUFBRSxPQUFPLFVBQVUsQ0FBQyxFQUFFLEVBQUUsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUN0RSxJQUFJLFNBQVMsSUFBSSxDQUFDLEVBQUUsRUFBRTtBQUN0QixRQUFRLElBQUksQ0FBQyxFQUFFLE1BQU0sSUFBSSxTQUFTLENBQUMsaUNBQWlDLENBQUMsQ0FBQztBQUN0RSxRQUFRLE9BQU8sQ0FBQyxFQUFFLElBQUk7QUFDdEIsWUFBWSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztBQUN6SyxZQUFZLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDcEQsWUFBWSxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDekIsZ0JBQWdCLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLE1BQU07QUFDOUMsZ0JBQWdCLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQztBQUN4RSxnQkFBZ0IsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUztBQUNqRSxnQkFBZ0IsS0FBSyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsU0FBUztBQUNqRSxnQkFBZ0I7QUFDaEIsb0JBQW9CLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUU7QUFDaEksb0JBQW9CLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUU7QUFDMUcsb0JBQW9CLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLE1BQU0sRUFBRTtBQUN6RixvQkFBb0IsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFO0FBQ3ZGLG9CQUFvQixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzFDLG9CQUFvQixDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsU0FBUztBQUMzQyxhQUFhO0FBQ2IsWUFBWSxFQUFFLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDdkMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLFNBQVMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFO0FBQ2xFLFFBQVEsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQztBQUN6RixLQUFLO0FBQ0wsQ0FBQztBQWFEO0FBQ08sU0FBUyxRQUFRLENBQUMsQ0FBQyxFQUFFO0FBQzVCLElBQUksSUFBSSxDQUFDLEdBQUcsT0FBTyxNQUFNLEtBQUssVUFBVSxJQUFJLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNsRixJQUFJLElBQUksQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM1QixJQUFJLElBQUksQ0FBQyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE1BQU0sS0FBSyxRQUFRLEVBQUUsT0FBTztBQUNsRCxRQUFRLElBQUksRUFBRSxZQUFZO0FBQzFCLFlBQVksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDO0FBQy9DLFlBQVksT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFDcEQsU0FBUztBQUNULEtBQUssQ0FBQztBQUNOLElBQUksTUFBTSxJQUFJLFNBQVMsQ0FBQyxDQUFDLEdBQUcseUJBQXlCLEdBQUcsaUNBQWlDLENBQUMsQ0FBQztBQUMzRixDQUFDO0FBQ0Q7QUFDTyxTQUFTLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQzdCLElBQUksSUFBSSxDQUFDLEdBQUcsT0FBTyxNQUFNLEtBQUssVUFBVSxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDL0QsSUFBSSxJQUFJLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ3JCLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDckMsSUFBSSxJQUFJO0FBQ1IsUUFBUSxPQUFPLENBQUMsQ0FBQyxLQUFLLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDbkYsS0FBSztBQUNMLElBQUksT0FBTyxLQUFLLEVBQUUsRUFBRSxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRTtBQUMzQyxZQUFZO0FBQ1osUUFBUSxJQUFJO0FBQ1osWUFBWSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDN0QsU0FBUztBQUNULGdCQUFnQixFQUFFLElBQUksQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFO0FBQ3pDLEtBQUs7QUFDTCxJQUFJLE9BQU8sRUFBRSxDQUFDO0FBQ2QsQ0FBQztBQTZDRDtBQUNPLFNBQVMsYUFBYSxDQUFDLENBQUMsRUFBRTtBQUNqQyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFLE1BQU0sSUFBSSxTQUFTLENBQUMsc0NBQXNDLENBQUMsQ0FBQztBQUMzRixJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3ZDLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsT0FBTyxRQUFRLEtBQUssVUFBVSxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxHQUFHLFlBQVksRUFBRSxPQUFPLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDck4sSUFBSSxTQUFTLElBQUksQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxFQUFFLEVBQUUsT0FBTyxJQUFJLE9BQU8sQ0FBQyxVQUFVLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ3BLLElBQUksU0FBUyxNQUFNLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQyxFQUFFO0FB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
