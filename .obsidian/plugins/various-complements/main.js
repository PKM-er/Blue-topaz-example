'use strict';

var obsidian = require('obsidian');

/******************************************************************************
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

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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

const regEmoji = new RegExp(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]|[\uFE0E-\uFE0F]/, "g");
function allAlphabets(text) {
    return Boolean(text.match(/^[a-zA-Z0-9_-]+$/));
}
function excludeEmoji(text) {
    return text.replace(regEmoji, "");
}
function lowerIncludes(one, other) {
    return one.toLowerCase().includes(other.toLowerCase());
}
function lowerStartsWith(a, b) {
    return a.toLowerCase().startsWith(b.toLowerCase());
}
function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
function startsSmallLetterOnlyFirst(str) {
    return Boolean(str.match(/^[A-Z][^A-Z]+$/));
}
function* splitRaw(text, regexp) {
    let previousIndex = 0;
    for (let r of text.matchAll(regexp)) {
        if (previousIndex !== r.index) {
            yield text.slice(previousIndex, r.index);
        }
        yield text[r.index];
        previousIndex = r.index + 1;
    }
    if (previousIndex !== text.length) {
        yield text.slice(previousIndex, text.length);
    }
}

function pickTokens(content, trimPattern) {
    return content.split(trimPattern).filter((x) => x !== "");
}
const TRIM_CHAR_PATTERN = /[\n\t\[\]$/:?!=()<>"'.,|;*~ `]/g;
class DefaultTokenizer {
    tokenize(content, raw) {
        return raw
            ? Array.from(splitRaw(content, this.getTrimPattern())).filter((x) => x !== " ")
            : pickTokens(content, this.getTrimPattern());
    }
    recursiveTokenize(content) {
        const trimIndexes = Array.from(content.matchAll(this.getTrimPattern()))
            .sort((a, b) => a.index - b.index)
            .map((x) => x.index);
        return [
            { word: content, offset: 0 },
            ...trimIndexes.map((i) => ({
                word: content.slice(i + 1),
                offset: i + 1,
            })),
        ];
    }
    getTrimPattern() {
        return TRIM_CHAR_PATTERN;
    }
    shouldIgnore(str) {
        return false;
    }
}

const ARABIC_TRIM_CHAR_PATTERN = /[\n\t\[\]$/:?!=()<>"'.,|;*~ `،؛]/g;
class ArabicTokenizer extends DefaultTokenizer {
    getTrimPattern() {
        return ARABIC_TRIM_CHAR_PATTERN;
    }
}

// @ts-nocheck
// Because this code is originally javascript code.
// noinspection FunctionTooLongJS,FunctionWithMultipleLoopsJS,EqualityComparisonWithCoercionJS,PointlessBooleanExpressionJS,JSDeclarationsAtScopeStart
// TinySegmenter 0.1 -- Super compact Japanese tokenizer in Javascript
// (c) 2008 Taku Kudo <taku@chasen.org>
// TinySegmenter is freely distributable under the terms of a new BSD licence.
// For details, see http://chasen.org/~taku/software/TinySegmenter/LICENCE.txt
function TinySegmenter() {
    var patterns = {
        "[一二三四五六七八九十百千万億兆]": "M",
        "[一-龠々〆ヵヶ]": "H",
        "[ぁ-ん]": "I",
        "[ァ-ヴーｱ-ﾝﾞｰ]": "K",
        "[a-zA-Zａ-ｚＡ-Ｚ]": "A",
        "[0-9０-９]": "N",
    };
    this.chartype_ = [];
    for (var i in patterns) {
        var regexp = new RegExp();
        regexp.compile(i);
        this.chartype_.push([regexp, patterns[i]]);
    }
    this.BIAS__ = -332;
    this.BC1__ = { HH: 6, II: 2461, KH: 406, OH: -1378 };
    this.BC2__ = {
        AA: -3267,
        AI: 2744,
        AN: -878,
        HH: -4070,
        HM: -1711,
        HN: 4012,
        HO: 3761,
        IA: 1327,
        IH: -1184,
        II: -1332,
        IK: 1721,
        IO: 5492,
        KI: 3831,
        KK: -8741,
        MH: -3132,
        MK: 3334,
        OO: -2920,
    };
    this.BC3__ = {
        HH: 996,
        HI: 626,
        HK: -721,
        HN: -1307,
        HO: -836,
        IH: -301,
        KK: 2762,
        MK: 1079,
        MM: 4034,
        OA: -1652,
        OH: 266,
    };
    this.BP1__ = { BB: 295, OB: 304, OO: -125, UB: 352 };
    this.BP2__ = { BO: 60, OO: -1762 };
    this.BQ1__ = {
        BHH: 1150,
        BHM: 1521,
        BII: -1158,
        BIM: 886,
        BMH: 1208,
        BNH: 449,
        BOH: -91,
        BOO: -2597,
        OHI: 451,
        OIH: -296,
        OKA: 1851,
        OKH: -1020,
        OKK: 904,
        OOO: 2965,
    };
    this.BQ2__ = {
        BHH: 118,
        BHI: -1159,
        BHM: 466,
        BIH: -919,
        BKK: -1720,
        BKO: 864,
        OHH: -1139,
        OHM: -181,
        OIH: 153,
        UHI: -1146,
    };
    this.BQ3__ = {
        BHH: -792,
        BHI: 2664,
        BII: -299,
        BKI: 419,
        BMH: 937,
        BMM: 8335,
        BNN: 998,
        BOH: 775,
        OHH: 2174,
        OHM: 439,
        OII: 280,
        OKH: 1798,
        OKI: -793,
        OKO: -2242,
        OMH: -2402,
        OOO: 11699,
    };
    this.BQ4__ = {
        BHH: -3895,
        BIH: 3761,
        BII: -4654,
        BIK: 1348,
        BKK: -1806,
        BMI: -3385,
        BOO: -12396,
        OAH: 926,
        OHH: 266,
        OHK: -2036,
        ONN: -973,
    };
    this.BW1__ = {
        ",と": 660,
        ",同": 727,
        B1あ: 1404,
        B1同: 542,
        "、と": 660,
        "、同": 727,
        "」と": 1682,
        あっ: 1505,
        いう: 1743,
        いっ: -2055,
        いる: 672,
        うし: -4817,
        うん: 665,
        から: 3472,
        がら: 600,
        こう: -790,
        こと: 2083,
        こん: -1262,
        さら: -4143,
        さん: 4573,
        した: 2641,
        して: 1104,
        すで: -3399,
        そこ: 1977,
        それ: -871,
        たち: 1122,
        ため: 601,
        った: 3463,
        つい: -802,
        てい: 805,
        てき: 1249,
        でき: 1127,
        です: 3445,
        では: 844,
        とい: -4915,
        とみ: 1922,
        どこ: 3887,
        ない: 5713,
        なっ: 3015,
        など: 7379,
        なん: -1113,
        にし: 2468,
        には: 1498,
        にも: 1671,
        に対: -912,
        の一: -501,
        の中: 741,
        ませ: 2448,
        まで: 1711,
        まま: 2600,
        まる: -2155,
        やむ: -1947,
        よっ: -2565,
        れた: 2369,
        れで: -913,
        をし: 1860,
        を見: 731,
        亡く: -1886,
        京都: 2558,
        取り: -2784,
        大き: -2604,
        大阪: 1497,
        平方: -2314,
        引き: -1336,
        日本: -195,
        本当: -2423,
        毎日: -2113,
        目指: -724,
        Ｂ１あ: 1404,
        Ｂ１同: 542,
        "｣と": 1682,
    };
    this.BW2__ = {
        "..": -11822,
        11: -669,
        "――": -5730,
        "−−": -13175,
        いう: -1609,
        うか: 2490,
        かし: -1350,
        かも: -602,
        から: -7194,
        かれ: 4612,
        がい: 853,
        がら: -3198,
        きた: 1941,
        くな: -1597,
        こと: -8392,
        この: -4193,
        させ: 4533,
        され: 13168,
        さん: -3977,
        しい: -1819,
        しか: -545,
        した: 5078,
        して: 972,
        しな: 939,
        その: -3744,
        たい: -1253,
        たた: -662,
        ただ: -3857,
        たち: -786,
        たと: 1224,
        たは: -939,
        った: 4589,
        って: 1647,
        っと: -2094,
        てい: 6144,
        てき: 3640,
        てく: 2551,
        ては: -3110,
        ても: -3065,
        でい: 2666,
        でき: -1528,
        でし: -3828,
        です: -4761,
        でも: -4203,
        とい: 1890,
        とこ: -1746,
        とと: -2279,
        との: 720,
        とみ: 5168,
        とも: -3941,
        ない: -2488,
        なが: -1313,
        など: -6509,
        なの: 2614,
        なん: 3099,
        にお: -1615,
        にし: 2748,
        にな: 2454,
        によ: -7236,
        に対: -14943,
        に従: -4688,
        に関: -11388,
        のか: 2093,
        ので: -7059,
        のに: -6041,
        のの: -6125,
        はい: 1073,
        はが: -1033,
        はず: -2532,
        ばれ: 1813,
        まし: -1316,
        まで: -6621,
        まれ: 5409,
        めて: -3153,
        もい: 2230,
        もの: -10713,
        らか: -944,
        らし: -1611,
        らに: -1897,
        りし: 651,
        りま: 1620,
        れた: 4270,
        れて: 849,
        れば: 4114,
        ろう: 6067,
        われ: 7901,
        を通: -11877,
        んだ: 728,
        んな: -4115,
        一人: 602,
        一方: -1375,
        一日: 970,
        一部: -1051,
        上が: -4479,
        会社: -1116,
        出て: 2163,
        分の: -7758,
        同党: 970,
        同日: -913,
        大阪: -2471,
        委員: -1250,
        少な: -1050,
        年度: -8669,
        年間: -1626,
        府県: -2363,
        手権: -1982,
        新聞: -4066,
        日新: -722,
        日本: -7068,
        日米: 3372,
        曜日: -601,
        朝鮮: -2355,
        本人: -2697,
        東京: -1543,
        然と: -1384,
        社会: -1276,
        立て: -990,
        第に: -1612,
        米国: -4268,
        "１１": -669,
    };
    this.BW3__ = {
        あた: -2194,
        あり: 719,
        ある: 3846,
        "い.": -1185,
        "い。": -1185,
        いい: 5308,
        いえ: 2079,
        いく: 3029,
        いた: 2056,
        いっ: 1883,
        いる: 5600,
        いわ: 1527,
        うち: 1117,
        うと: 4798,
        えと: 1454,
        "か.": 2857,
        "か。": 2857,
        かけ: -743,
        かっ: -4098,
        かに: -669,
        から: 6520,
        かり: -2670,
        "が,": 1816,
        "が、": 1816,
        がき: -4855,
        がけ: -1127,
        がっ: -913,
        がら: -4977,
        がり: -2064,
        きた: 1645,
        けど: 1374,
        こと: 7397,
        この: 1542,
        ころ: -2757,
        さい: -714,
        さを: 976,
        "し,": 1557,
        "し、": 1557,
        しい: -3714,
        した: 3562,
        して: 1449,
        しな: 2608,
        しま: 1200,
        "す.": -1310,
        "す。": -1310,
        する: 6521,
        "ず,": 3426,
        "ず、": 3426,
        ずに: 841,
        そう: 428,
        "た.": 8875,
        "た。": 8875,
        たい: -594,
        たの: 812,
        たり: -1183,
        たる: -853,
        "だ.": 4098,
        "だ。": 4098,
        だっ: 1004,
        った: -4748,
        って: 300,
        てい: 6240,
        てお: 855,
        ても: 302,
        です: 1437,
        でに: -1482,
        では: 2295,
        とう: -1387,
        とし: 2266,
        との: 541,
        とも: -3543,
        どう: 4664,
        ない: 1796,
        なく: -903,
        など: 2135,
        "に,": -1021,
        "に、": -1021,
        にし: 1771,
        にな: 1906,
        には: 2644,
        "の,": -724,
        "の、": -724,
        の子: -1000,
        "は,": 1337,
        "は、": 1337,
        べき: 2181,
        まし: 1113,
        ます: 6943,
        まっ: -1549,
        まで: 6154,
        まれ: -793,
        らし: 1479,
        られ: 6820,
        るる: 3818,
        "れ,": 854,
        "れ、": 854,
        れた: 1850,
        れて: 1375,
        れば: -3246,
        れる: 1091,
        われ: -605,
        んだ: 606,
        んで: 798,
        カ月: 990,
        会議: 860,
        入り: 1232,
        大会: 2217,
        始め: 1681,
        市: 965,
        新聞: -5055,
        "日,": 974,
        "日、": 974,
        社会: 2024,
        ｶ月: 990,
    };
    this.TC1__ = {
        AAA: 1093,
        HHH: 1029,
        HHM: 580,
        HII: 998,
        HOH: -390,
        HOM: -331,
        IHI: 1169,
        IOH: -142,
        IOI: -1015,
        IOM: 467,
        MMH: 187,
        OOI: -1832,
    };
    this.TC2__ = {
        HHO: 2088,
        HII: -1023,
        HMM: -1154,
        IHI: -1965,
        KKH: 703,
        OII: -2649,
    };
    this.TC3__ = {
        AAA: -294,
        HHH: 346,
        HHI: -341,
        HII: -1088,
        HIK: 731,
        HOH: -1486,
        IHH: 128,
        IHI: -3041,
        IHO: -1935,
        IIH: -825,
        IIM: -1035,
        IOI: -542,
        KHH: -1216,
        KKA: 491,
        KKH: -1217,
        KOK: -1009,
        MHH: -2694,
        MHM: -457,
        MHO: 123,
        MMH: -471,
        NNH: -1689,
        NNO: 662,
        OHO: -3393,
    };
    this.TC4__ = {
        HHH: -203,
        HHI: 1344,
        HHK: 365,
        HHM: -122,
        HHN: 182,
        HHO: 669,
        HIH: 804,
        HII: 679,
        HOH: 446,
        IHH: 695,
        IHO: -2324,
        IIH: 321,
        III: 1497,
        IIO: 656,
        IOO: 54,
        KAK: 4845,
        KKA: 3386,
        KKK: 3065,
        MHH: -405,
        MHI: 201,
        MMH: -241,
        MMM: 661,
        MOM: 841,
    };
    this.TQ1__ = {
        BHHH: -227,
        BHHI: 316,
        BHIH: -132,
        BIHH: 60,
        BIII: 1595,
        BNHH: -744,
        BOHH: 225,
        BOOO: -908,
        OAKK: 482,
        OHHH: 281,
        OHIH: 249,
        OIHI: 200,
        OIIH: -68,
    };
    this.TQ2__ = { BIHH: -1401, BIII: -1033, BKAK: -543, BOOO: -5591 };
    this.TQ3__ = {
        BHHH: 478,
        BHHM: -1073,
        BHIH: 222,
        BHII: -504,
        BIIH: -116,
        BIII: -105,
        BMHI: -863,
        BMHM: -464,
        BOMH: 620,
        OHHH: 346,
        OHHI: 1729,
        OHII: 997,
        OHMH: 481,
        OIHH: 623,
        OIIH: 1344,
        OKAK: 2792,
        OKHH: 587,
        OKKA: 679,
        OOHH: 110,
        OOII: -685,
    };
    this.TQ4__ = {
        BHHH: -721,
        BHHM: -3604,
        BHII: -966,
        BIIH: -607,
        BIII: -2181,
        OAAA: -2763,
        OAKK: 180,
        OHHH: -294,
        OHHI: 2446,
        OHHO: 480,
        OHIH: -1573,
        OIHH: 1935,
        OIHI: -493,
        OIIH: 626,
        OIII: -4007,
        OKAK: -8156,
    };
    this.TW1__ = { につい: -4681, 東京都: 2026 };
    this.TW2__ = {
        ある程: -2049,
        いった: -1256,
        ころが: -2434,
        しょう: 3873,
        その後: -4430,
        だって: -1049,
        ていた: 1833,
        として: -4657,
        ともに: -4517,
        もので: 1882,
        一気に: -792,
        初めて: -1512,
        同時に: -8097,
        大きな: -1255,
        対して: -2721,
        社会党: -3216,
    };
    this.TW3__ = {
        いただ: -1734,
        してい: 1314,
        として: -4314,
        につい: -5483,
        にとっ: -5989,
        に当た: -6247,
        "ので,": -727,
        "ので、": -727,
        のもの: -600,
        れから: -3752,
        十二月: -2287,
    };
    this.TW4__ = {
        "いう.": 8576,
        "いう。": 8576,
        からな: -2348,
        してい: 2958,
        "たが,": 1516,
        "たが、": 1516,
        ている: 1538,
        という: 1349,
        ました: 5543,
        ません: 1097,
        ようと: -4258,
        よると: 5865,
    };
    this.UC1__ = { A: 484, K: 93, M: 645, O: -505 };
    this.UC2__ = { A: 819, H: 1059, I: 409, M: 3987, N: 5775, O: 646 };
    this.UC3__ = { A: -1370, I: 2311 };
    this.UC4__ = {
        A: -2643,
        H: 1809,
        I: -1032,
        K: -3450,
        M: 3565,
        N: 3876,
        O: 6646,
    };
    this.UC5__ = { H: 313, I: -1238, K: -799, M: 539, O: -831 };
    this.UC6__ = { H: -506, I: -253, K: 87, M: 247, O: -387 };
    this.UP1__ = { O: -214 };
    this.UP2__ = { B: 69, O: 935 };
    this.UP3__ = { B: 189 };
    this.UQ1__ = {
        BH: 21,
        BI: -12,
        BK: -99,
        BN: 142,
        BO: -56,
        OH: -95,
        OI: 477,
        OK: 410,
        OO: -2422,
    };
    this.UQ2__ = { BH: 216, BI: 113, OK: 1759 };
    this.UQ3__ = {
        BA: -479,
        BH: 42,
        BI: 1913,
        BK: -7198,
        BM: 3160,
        BN: 6427,
        BO: 14761,
        OI: -827,
        ON: -3212,
    };
    this.UW1__ = {
        ",": 156,
        "、": 156,
        "「": -463,
        あ: -941,
        う: -127,
        が: -553,
        き: 121,
        こ: 505,
        で: -201,
        と: -547,
        ど: -123,
        に: -789,
        の: -185,
        は: -847,
        も: -466,
        や: -470,
        よ: 182,
        ら: -292,
        り: 208,
        れ: 169,
        を: -446,
        ん: -137,
        "・": -135,
        主: -402,
        京: -268,
        区: -912,
        午: 871,
        国: -460,
        大: 561,
        委: 729,
        市: -411,
        日: -141,
        理: 361,
        生: -408,
        県: -386,
        都: -718,
        "｢": -463,
        "･": -135,
    };
    this.UW2__ = {
        ",": -829,
        "、": -829,
        〇: 892,
        "「": -645,
        "」": 3145,
        あ: -538,
        い: 505,
        う: 134,
        お: -502,
        か: 1454,
        が: -856,
        く: -412,
        こ: 1141,
        さ: 878,
        ざ: 540,
        し: 1529,
        す: -675,
        せ: 300,
        そ: -1011,
        た: 188,
        だ: 1837,
        つ: -949,
        て: -291,
        で: -268,
        と: -981,
        ど: 1273,
        な: 1063,
        に: -1764,
        の: 130,
        は: -409,
        ひ: -1273,
        べ: 1261,
        ま: 600,
        も: -1263,
        や: -402,
        よ: 1639,
        り: -579,
        る: -694,
        れ: 571,
        を: -2516,
        ん: 2095,
        ア: -587,
        カ: 306,
        キ: 568,
        ッ: 831,
        三: -758,
        不: -2150,
        世: -302,
        中: -968,
        主: -861,
        事: 492,
        人: -123,
        会: 978,
        保: 362,
        入: 548,
        初: -3025,
        副: -1566,
        北: -3414,
        区: -422,
        大: -1769,
        天: -865,
        太: -483,
        子: -1519,
        学: 760,
        実: 1023,
        小: -2009,
        市: -813,
        年: -1060,
        強: 1067,
        手: -1519,
        揺: -1033,
        政: 1522,
        文: -1355,
        新: -1682,
        日: -1815,
        明: -1462,
        最: -630,
        朝: -1843,
        本: -1650,
        東: -931,
        果: -665,
        次: -2378,
        民: -180,
        気: -1740,
        理: 752,
        発: 529,
        目: -1584,
        相: -242,
        県: -1165,
        立: -763,
        第: 810,
        米: 509,
        自: -1353,
        行: 838,
        西: -744,
        見: -3874,
        調: 1010,
        議: 1198,
        込: 3041,
        開: 1758,
        間: -1257,
        "｢": -645,
        "｣": 3145,
        ｯ: 831,
        ｱ: -587,
        ｶ: 306,
        ｷ: 568,
    };
    this.UW3__ = {
        ",": 4889,
        1: -800,
        "−": -1723,
        "、": 4889,
        々: -2311,
        〇: 5827,
        "」": 2670,
        "〓": -3573,
        あ: -2696,
        い: 1006,
        う: 2342,
        え: 1983,
        お: -4864,
        か: -1163,
        が: 3271,
        く: 1004,
        け: 388,
        げ: 401,
        こ: -3552,
        ご: -3116,
        さ: -1058,
        し: -395,
        す: 584,
        せ: 3685,
        そ: -5228,
        た: 842,
        ち: -521,
        っ: -1444,
        つ: -1081,
        て: 6167,
        で: 2318,
        と: 1691,
        ど: -899,
        な: -2788,
        に: 2745,
        の: 4056,
        は: 4555,
        ひ: -2171,
        ふ: -1798,
        へ: 1199,
        ほ: -5516,
        ま: -4384,
        み: -120,
        め: 1205,
        も: 2323,
        や: -788,
        よ: -202,
        ら: 727,
        り: 649,
        る: 5905,
        れ: 2773,
        わ: -1207,
        を: 6620,
        ん: -518,
        ア: 551,
        グ: 1319,
        ス: 874,
        ッ: -1350,
        ト: 521,
        ム: 1109,
        ル: 1591,
        ロ: 2201,
        ン: 278,
        "・": -3794,
        一: -1619,
        下: -1759,
        世: -2087,
        両: 3815,
        中: 653,
        主: -758,
        予: -1193,
        二: 974,
        人: 2742,
        今: 792,
        他: 1889,
        以: -1368,
        低: 811,
        何: 4265,
        作: -361,
        保: -2439,
        元: 4858,
        党: 3593,
        全: 1574,
        公: -3030,
        六: 755,
        共: -1880,
        円: 5807,
        再: 3095,
        分: 457,
        初: 2475,
        別: 1129,
        前: 2286,
        副: 4437,
        力: 365,
        動: -949,
        務: -1872,
        化: 1327,
        北: -1038,
        区: 4646,
        千: -2309,
        午: -783,
        協: -1006,
        口: 483,
        右: 1233,
        各: 3588,
        合: -241,
        同: 3906,
        和: -837,
        員: 4513,
        国: 642,
        型: 1389,
        場: 1219,
        外: -241,
        妻: 2016,
        学: -1356,
        安: -423,
        実: -1008,
        家: 1078,
        小: -513,
        少: -3102,
        州: 1155,
        市: 3197,
        平: -1804,
        年: 2416,
        広: -1030,
        府: 1605,
        度: 1452,
        建: -2352,
        当: -3885,
        得: 1905,
        思: -1291,
        性: 1822,
        戸: -488,
        指: -3973,
        政: -2013,
        教: -1479,
        数: 3222,
        文: -1489,
        新: 1764,
        日: 2099,
        旧: 5792,
        昨: -661,
        時: -1248,
        曜: -951,
        最: -937,
        月: 4125,
        期: 360,
        李: 3094,
        村: 364,
        東: -805,
        核: 5156,
        森: 2438,
        業: 484,
        氏: 2613,
        民: -1694,
        決: -1073,
        法: 1868,
        海: -495,
        無: 979,
        物: 461,
        特: -3850,
        生: -273,
        用: 914,
        町: 1215,
        的: 7313,
        直: -1835,
        省: 792,
        県: 6293,
        知: -1528,
        私: 4231,
        税: 401,
        立: -960,
        第: 1201,
        米: 7767,
        系: 3066,
        約: 3663,
        級: 1384,
        統: -4229,
        総: 1163,
        線: 1255,
        者: 6457,
        能: 725,
        自: -2869,
        英: 785,
        見: 1044,
        調: -562,
        財: -733,
        費: 1777,
        車: 1835,
        軍: 1375,
        込: -1504,
        通: -1136,
        選: -681,
        郎: 1026,
        郡: 4404,
        部: 1200,
        金: 2163,
        長: 421,
        開: -1432,
        間: 1302,
        関: -1282,
        雨: 2009,
        電: -1045,
        非: 2066,
        駅: 1620,
        "１": -800,
        "｣": 2670,
        "･": -3794,
        ｯ: -1350,
        ｱ: 551,
        ｸﾞ: 1319,
        ｽ: 874,
        ﾄ: 521,
        ﾑ: 1109,
        ﾙ: 1591,
        ﾛ: 2201,
        ﾝ: 278,
    };
    this.UW4__ = {
        ",": 3930,
        ".": 3508,
        "―": -4841,
        "、": 3930,
        "。": 3508,
        〇: 4999,
        "「": 1895,
        "」": 3798,
        "〓": -5156,
        あ: 4752,
        い: -3435,
        う: -640,
        え: -2514,
        お: 2405,
        か: 530,
        が: 6006,
        き: -4482,
        ぎ: -3821,
        く: -3788,
        け: -4376,
        げ: -4734,
        こ: 2255,
        ご: 1979,
        さ: 2864,
        し: -843,
        じ: -2506,
        す: -731,
        ず: 1251,
        せ: 181,
        そ: 4091,
        た: 5034,
        だ: 5408,
        ち: -3654,
        っ: -5882,
        つ: -1659,
        て: 3994,
        で: 7410,
        と: 4547,
        な: 5433,
        に: 6499,
        ぬ: 1853,
        ね: 1413,
        の: 7396,
        は: 8578,
        ば: 1940,
        ひ: 4249,
        び: -4134,
        ふ: 1345,
        へ: 6665,
        べ: -744,
        ほ: 1464,
        ま: 1051,
        み: -2082,
        む: -882,
        め: -5046,
        も: 4169,
        ゃ: -2666,
        や: 2795,
        ょ: -1544,
        よ: 3351,
        ら: -2922,
        り: -9726,
        る: -14896,
        れ: -2613,
        ろ: -4570,
        わ: -1783,
        を: 13150,
        ん: -2352,
        カ: 2145,
        コ: 1789,
        セ: 1287,
        ッ: -724,
        ト: -403,
        メ: -1635,
        ラ: -881,
        リ: -541,
        ル: -856,
        ン: -3637,
        "・": -4371,
        ー: -11870,
        一: -2069,
        中: 2210,
        予: 782,
        事: -190,
        井: -1768,
        人: 1036,
        以: 544,
        会: 950,
        体: -1286,
        作: 530,
        側: 4292,
        先: 601,
        党: -2006,
        共: -1212,
        内: 584,
        円: 788,
        初: 1347,
        前: 1623,
        副: 3879,
        力: -302,
        動: -740,
        務: -2715,
        化: 776,
        区: 4517,
        協: 1013,
        参: 1555,
        合: -1834,
        和: -681,
        員: -910,
        器: -851,
        回: 1500,
        国: -619,
        園: -1200,
        地: 866,
        場: -1410,
        塁: -2094,
        士: -1413,
        多: 1067,
        大: 571,
        子: -4802,
        学: -1397,
        定: -1057,
        寺: -809,
        小: 1910,
        屋: -1328,
        山: -1500,
        島: -2056,
        川: -2667,
        市: 2771,
        年: 374,
        庁: -4556,
        後: 456,
        性: 553,
        感: 916,
        所: -1566,
        支: 856,
        改: 787,
        政: 2182,
        教: 704,
        文: 522,
        方: -856,
        日: 1798,
        時: 1829,
        最: 845,
        月: -9066,
        木: -485,
        来: -442,
        校: -360,
        業: -1043,
        氏: 5388,
        民: -2716,
        気: -910,
        沢: -939,
        済: -543,
        物: -735,
        率: 672,
        球: -1267,
        生: -1286,
        産: -1101,
        田: -2900,
        町: 1826,
        的: 2586,
        目: 922,
        省: -3485,
        県: 2997,
        空: -867,
        立: -2112,
        第: 788,
        米: 2937,
        系: 786,
        約: 2171,
        経: 1146,
        統: -1169,
        総: 940,
        線: -994,
        署: 749,
        者: 2145,
        能: -730,
        般: -852,
        行: -792,
        規: 792,
        警: -1184,
        議: -244,
        谷: -1000,
        賞: 730,
        車: -1481,
        軍: 1158,
        輪: -1433,
        込: -3370,
        近: 929,
        道: -1291,
        選: 2596,
        郎: -4866,
        都: 1192,
        野: -1100,
        銀: -2213,
        長: 357,
        間: -2344,
        院: -2297,
        際: -2604,
        電: -878,
        領: -1659,
        題: -792,
        館: -1984,
        首: 1749,
        高: 2120,
        "｢": 1895,
        "｣": 3798,
        "･": -4371,
        ｯ: -724,
        ｰ: -11870,
        ｶ: 2145,
        ｺ: 1789,
        ｾ: 1287,
        ﾄ: -403,
        ﾒ: -1635,
        ﾗ: -881,
        ﾘ: -541,
        ﾙ: -856,
        ﾝ: -3637,
    };
    this.UW5__ = {
        ",": 465,
        ".": -299,
        1: -514,
        E2: -32768,
        "]": -2762,
        "、": 465,
        "。": -299,
        "「": 363,
        あ: 1655,
        い: 331,
        う: -503,
        え: 1199,
        お: 527,
        か: 647,
        が: -421,
        き: 1624,
        ぎ: 1971,
        く: 312,
        げ: -983,
        さ: -1537,
        し: -1371,
        す: -852,
        だ: -1186,
        ち: 1093,
        っ: 52,
        つ: 921,
        て: -18,
        で: -850,
        と: -127,
        ど: 1682,
        な: -787,
        に: -1224,
        の: -635,
        は: -578,
        べ: 1001,
        み: 502,
        め: 865,
        ゃ: 3350,
        ょ: 854,
        り: -208,
        る: 429,
        れ: 504,
        わ: 419,
        を: -1264,
        ん: 327,
        イ: 241,
        ル: 451,
        ン: -343,
        中: -871,
        京: 722,
        会: -1153,
        党: -654,
        務: 3519,
        区: -901,
        告: 848,
        員: 2104,
        大: -1296,
        学: -548,
        定: 1785,
        嵐: -1304,
        市: -2991,
        席: 921,
        年: 1763,
        思: 872,
        所: -814,
        挙: 1618,
        新: -1682,
        日: 218,
        月: -4353,
        査: 932,
        格: 1356,
        機: -1508,
        氏: -1347,
        田: 240,
        町: -3912,
        的: -3149,
        相: 1319,
        省: -1052,
        県: -4003,
        研: -997,
        社: -278,
        空: -813,
        統: 1955,
        者: -2233,
        表: 663,
        語: -1073,
        議: 1219,
        選: -1018,
        郎: -368,
        長: 786,
        間: 1191,
        題: 2368,
        館: -689,
        "１": -514,
        Ｅ２: -32768,
        "｢": 363,
        ｲ: 241,
        ﾙ: 451,
        ﾝ: -343,
    };
    this.UW6__ = {
        ",": 227,
        ".": 808,
        1: -270,
        E1: 306,
        "、": 227,
        "。": 808,
        あ: -307,
        う: 189,
        か: 241,
        が: -73,
        く: -121,
        こ: -200,
        じ: 1782,
        す: 383,
        た: -428,
        っ: 573,
        て: -1014,
        で: 101,
        と: -105,
        な: -253,
        に: -149,
        の: -417,
        は: -236,
        も: -206,
        り: 187,
        る: -135,
        を: 195,
        ル: -673,
        ン: -496,
        一: -277,
        中: 201,
        件: -800,
        会: 624,
        前: 302,
        区: 1792,
        員: -1212,
        委: 798,
        学: -960,
        市: 887,
        広: -695,
        後: 535,
        業: -697,
        相: 753,
        社: -507,
        福: 974,
        空: -822,
        者: 1811,
        連: 463,
        郎: 1082,
        "１": -270,
        Ｅ１: 306,
        ﾙ: -673,
        ﾝ: -496,
    };
    return this;
}
TinySegmenter.prototype.ctype_ = function (str) {
    for (var i in this.chartype_) {
        if (str.match(this.chartype_[i][0])) {
            return this.chartype_[i][1];
        }
    }
    return "O";
};
TinySegmenter.prototype.ts_ = function (v) {
    if (v) {
        return v;
    }
    return 0;
};
TinySegmenter.prototype.segment = function (input) {
    if (input == null || input == undefined || input == "") {
        return [];
    }
    var result = [];
    var seg = ["B3", "B2", "B1"];
    var ctype = ["O", "O", "O"];
    var o = input.split("");
    for (i = 0; i < o.length; ++i) {
        seg.push(o[i]);
        ctype.push(this.ctype_(o[i]));
    }
    seg.push("E1");
    seg.push("E2");
    seg.push("E3");
    ctype.push("O");
    ctype.push("O");
    ctype.push("O");
    var word = seg[3];
    var p1 = "U";
    var p2 = "U";
    var p3 = "U";
    for (var i = 4; i < seg.length - 3; ++i) {
        var score = this.BIAS__;
        var w1 = seg[i - 3];
        var w2 = seg[i - 2];
        var w3 = seg[i - 1];
        var w4 = seg[i];
        var w5 = seg[i + 1];
        var w6 = seg[i + 2];
        var c1 = ctype[i - 3];
        var c2 = ctype[i - 2];
        var c3 = ctype[i - 1];
        var c4 = ctype[i];
        var c5 = ctype[i + 1];
        var c6 = ctype[i + 2];
        score += this.ts_(this.UP1__[p1]);
        score += this.ts_(this.UP2__[p2]);
        score += this.ts_(this.UP3__[p3]);
        score += this.ts_(this.BP1__[p1 + p2]);
        score += this.ts_(this.BP2__[p2 + p3]);
        score += this.ts_(this.UW1__[w1]);
        score += this.ts_(this.UW2__[w2]);
        score += this.ts_(this.UW3__[w3]);
        score += this.ts_(this.UW4__[w4]);
        score += this.ts_(this.UW5__[w5]);
        score += this.ts_(this.UW6__[w6]);
        score += this.ts_(this.BW1__[w2 + w3]);
        score += this.ts_(this.BW2__[w3 + w4]);
        score += this.ts_(this.BW3__[w4 + w5]);
        score += this.ts_(this.TW1__[w1 + w2 + w3]);
        score += this.ts_(this.TW2__[w2 + w3 + w4]);
        score += this.ts_(this.TW3__[w3 + w4 + w5]);
        score += this.ts_(this.TW4__[w4 + w5 + w6]);
        score += this.ts_(this.UC1__[c1]);
        score += this.ts_(this.UC2__[c2]);
        score += this.ts_(this.UC3__[c3]);
        score += this.ts_(this.UC4__[c4]);
        score += this.ts_(this.UC5__[c5]);
        score += this.ts_(this.UC6__[c6]);
        score += this.ts_(this.BC1__[c2 + c3]);
        score += this.ts_(this.BC2__[c3 + c4]);
        score += this.ts_(this.BC3__[c4 + c5]);
        score += this.ts_(this.TC1__[c1 + c2 + c3]);
        score += this.ts_(this.TC2__[c2 + c3 + c4]);
        score += this.ts_(this.TC3__[c3 + c4 + c5]);
        score += this.ts_(this.TC4__[c4 + c5 + c6]);
        //  score += this.ts_(this.TC5__[c4 + c5 + c6]);
        score += this.ts_(this.UQ1__[p1 + c1]);
        score += this.ts_(this.UQ2__[p2 + c2]);
        score += this.ts_(this.UQ3__[p3 + c3]);
        score += this.ts_(this.BQ1__[p2 + c2 + c3]);
        score += this.ts_(this.BQ2__[p2 + c3 + c4]);
        score += this.ts_(this.BQ3__[p3 + c2 + c3]);
        score += this.ts_(this.BQ4__[p3 + c3 + c4]);
        score += this.ts_(this.TQ1__[p2 + c1 + c2 + c3]);
        score += this.ts_(this.TQ2__[p2 + c2 + c3 + c4]);
        score += this.ts_(this.TQ3__[p3 + c1 + c2 + c3]);
        score += this.ts_(this.TQ4__[p3 + c2 + c3 + c4]);
        var p = "O";
        if (score > 0) {
            result.push(word);
            word = "";
            p = "B";
        }
        p1 = p2;
        p2 = p3;
        p3 = p;
        word += seg[i];
    }
    result.push(word);
    return result;
};

// @ts-ignore
const segmenter = new TinySegmenter();
function pickTokensAsJapanese(content, trimPattern) {
    return content
        .split(trimPattern)
        .filter((x) => x !== "")
        .flatMap((x) => segmenter.segment(x));
}
/**
 * Japanese needs original logic.
 */
class JapaneseTokenizer {
    tokenize(content, raw) {
        return pickTokensAsJapanese(content, raw ? / /g : this.getTrimPattern());
    }
    recursiveTokenize(content) {
        const tokens = segmenter
            .segment(content)
            // https://github.com/tadashi-aikawa/obsidian-various-complements-plugin/issues/77
            .flatMap((x) => x === " " ? x : x.split(" ").map((t) => (t === "" ? " " : t)));
        const ret = [];
        for (let i = 0; i < tokens.length; i++) {
            if (i === 0 ||
                tokens[i].length !== 1 ||
                !Boolean(tokens[i].match(this.getTrimPattern()))) {
                ret.push({
                    word: tokens.slice(i).join(""),
                    offset: tokens.slice(0, i).join("").length,
                });
            }
        }
        return ret;
    }
    getTrimPattern() {
        return TRIM_CHAR_PATTERN;
    }
    shouldIgnore(str) {
        return Boolean(str.match(/^[ぁ-んａ-ｚＡ-Ｚ。、ー　]*$/));
    }
}

const ENGLISH_PATTERN = /[a-zA-Z0-9_\-\\]/;
class EnglishOnlyTokenizer extends DefaultTokenizer {
    tokenize(content, raw) {
        const tokenized = Array.from(this._tokenize(content)).filter((x) => x.word.match(ENGLISH_PATTERN));
        return raw
            ? tokenized.map((x) => x.word)
            : tokenized
                .map((x) => x.word)
                .filter((x) => !x.match(this.getTrimPattern()));
    }
    recursiveTokenize(content) {
        const offsets = Array.from(this._tokenize(content))
            .filter((x) => !x.word.match(this.getTrimPattern()))
            .map((x) => x.offset);
        return [
            ...offsets.map((i) => ({
                word: content.slice(i),
                offset: i,
            })),
        ];
    }
    *_tokenize(content) {
        let startIndex = 0;
        let previousType = "none";
        for (let i = 0; i < content.length; i++) {
            if (content[i].match(super.getTrimPattern())) {
                yield { word: content.slice(startIndex, i), offset: startIndex };
                previousType = "trim";
                startIndex = i;
                continue;
            }
            if (content[i].match(ENGLISH_PATTERN)) {
                if (previousType === "english" || previousType === "none") {
                    previousType = "english";
                    continue;
                }
                yield { word: content.slice(startIndex, i), offset: startIndex };
                previousType = "english";
                startIndex = i;
                continue;
            }
            if (previousType === "others" || previousType === "none") {
                previousType = "others";
                continue;
            }
            yield { word: content.slice(startIndex, i), offset: startIndex };
            previousType = "others";
            startIndex = i;
        }
        yield {
            word: content.slice(startIndex, content.length),
            offset: startIndex,
        };
    }
}

var main = {};

var prettifyPinyin = {};

// Quick guide for typing Chinese pinyin on Mac OS X

// Tone 1 (flat) mā – Option + a, then hit a vowel key
// Tone 2 (rising) má – Option + e, then hit a vowel key
// Tone 3 (falling-rising) mǎ – Option + v, then hit a vowel key
// Tone 4 (falling) mà – Option + `, then hit a vowel key

// ǚ – Option + V, then hit V (submitted by QA)
// ǜ – Option + `, then hit V (submitted by QA)


var replacements = {
  'a': ['ā', 'á', 'ǎ', 'à'],
  'e': ['ē', 'é', 'ě', 'è'],
  'u': ['ū', 'ú', 'ǔ', 'ù'],
  'i': ['ī', 'í', 'ǐ', 'ì'],
  'o': ['ō', 'ó', 'ǒ', 'ò'],
  'ü': ['ǖ', 'ǘ', 'ǚ', 'ǜ']
};

var medials = ['i', 'u', 'ü'];

var prettify$1 = function(str){
  str = str.replace('v', 'ü');
  var syllables = str.split(' ');

  for (var i = 0; i < syllables.length; i++){
    var syllable = syllables[i];
    var tone = parseInt(syllable[syllable.length-1]);
    
    if (tone <= 0 || tone > 5) {
      console.error('invalid tone number:', tone, 'in', syllable);
    } else if (tone === 5){
      syllables[i] = syllable.slice(0, syllable.length - 1);
    } else {
      for (var j = 0; j < syllable.length; j++){
        var currentLetter = syllable[j];
        var nextLetter = syllable[j + 1];

        // found a vowel
        if (replacements[currentLetter]){
          var replaced;
          var letterToReplace;

          // two consecutive vowels
          if (replacements[nextLetter] && medials.indexOf(currentLetter) >= 0){
            letterToReplace = nextLetter;
          } else {
            letterToReplace = currentLetter;
          }

          replaced = syllable.replace(letterToReplace, replacements[letterToReplace][tone - 1]);
          syllables[i] = replaced.slice(0, replaced.length - 1);
          break;
        }
      }  
    }

  }
  return syllables.join(' ');
};

prettifyPinyin.prettify = prettify$1;

class Trie$1 {
    constructor() {
        this.content = {};
    }

    getKeyObject(key, create = false) {
        key = key.toString();

        let chars = key === '' ? [key] : Array.from(key);
        let obj = this.content;

        for (let char of chars) {
            if (obj[char] == null) {
                if (create) obj[char] = {};
                else return {}
            }

            obj = obj[char];
        }

        return obj
    }

    get(key) {
        let obj = this.getKeyObject(key);

        return obj.values || []
    }

    getPrefix(key) {
        let inner = (key, obj = null) => {
            if (obj == null) obj = this.getKeyObject(key);
            let result = obj.values ? [...obj.values] : [];

            for (let char in obj) {
                if (char === 'values' || obj[char] == null) continue

                result.push(...inner(key + char, obj[char]));
            }

            return result
        };

        return inner(key)
    }

    push(key, value) {
        let obj = this.getKeyObject(key, true);

        if (obj.values == null) obj.values = [];
        if (!obj.values.includes(value)) obj.values.push(value);

        return this
    }
}

var trie = Trie$1;

const {prettify} = prettifyPinyin;
const Trie = trie;

function parseLine(line) {
    let match = line.match(/^(\S+)\s(\S+)\s\[([^\]]+)\]\s\/(.+)\//);
    if (match == null) return

    let [, traditional, simplified, pinyin, english] = match;

    pinyin = pinyin.replace(/u:/g, 'ü');
    let pinyinPretty = prettify(pinyin);

    return {traditional, simplified, pinyin, pinyinPretty, english}
}

class Cedict$1 {
    load(contents) {
        this.simplifiedTrie = new Trie();
        this.traditionalTrie = new Trie();

        let lines = contents.split('\n');

        for (let line of lines) {
            if (line.trim() === '' || line[0] === '#') continue

            let entry = parseLine(line);
            if (entry == null) continue

            this.simplifiedTrie.push(entry.simplified, entry);
            this.traditionalTrie.push(entry.traditional, entry);
        }
    }

    get(word, traditional = false) {
        return traditional ? this.traditionalTrie.get(word) : this.simplifiedTrie.get(word)
    }

    getPrefix(word, traditional = false) {
        return traditional ? this.traditionalTrie.getPrefix(word) : this.simplifiedTrie.getPrefix(word)
    }
}

var cedict = Cedict$1;

const Cedict = cedict;

const chinesePunctuation = [
  "·",
  "×",
  "—",
  "‘",
  "’",
  "“",
  "”",
  "…",
  "、",
  "。",
  "《",
  "》",
  "『",
  "』",
  "【",
  "】",
  "！",
  "（",
  "）",
  "，",
  "：",
  "；",
  "？",
];

main.load = function (contents) {
  let dictionary = new Cedict();
  dictionary.load(contents);

  return function tokenize(text) {
    text = Array.from(text.replace(/\r/g, ""));

    let result = [];
    let i = 0;
    let [offset, line, column] = [0, 1, 1];
    let [simplifiedPreference, traditionalPreference] = [0, 0];

    let pushToken = (word) => {
      let simplifiedEntries = dictionary.get(word, false);
      let traditionalEntries = dictionary.get(word, true);

      let entries =
        simplifiedEntries.length === 0
          ? traditionalEntries
          : traditionalEntries.length === 0
          ? simplifiedEntries
          : simplifiedPreference < traditionalPreference
          ? traditionalEntries
          : simplifiedPreference > traditionalPreference
          ? simplifiedEntries
          : traditionalEntries;

      if (traditionalEntries.length === 0 && simplifiedEntries.length > 0) {
        simplifiedPreference++;
      } else if (
        simplifiedEntries.length === 0 &&
        traditionalEntries.length > 0
      ) {
        traditionalPreference++;
      }

      result.push({
        text: word,
        traditional: entries[0] ? entries[0].traditional : word,
        simplified: entries[0] ? entries[0].simplified : word,

        position: {
          offset,
          line,
          column,
        },

        matches: entries.map(({ pinyin, pinyinPretty, english }) => ({
          pinyin,
          pinyinPretty,
          english,
        })),
      });

      let wordArr = Array.from(word);
      let lastLineBreakIndex = word.lastIndexOf("\n");

      i += wordArr.length;
      offset += word.length;
      line += wordArr.filter((x) => x === "\n").length;
      column =
        lastLineBreakIndex >= 0
          ? word.length - lastLineBreakIndex
          : column + word.length;
    };

    while (i < text.length) {
      // Try to match two or more characters

      if (i !== text.length - 1) {
        let getTwo = text.slice(i, i + 2).join("");
        let simplifiedEntries = dictionary.getPrefix(getTwo, false);
        let traditionalEntries = dictionary.getPrefix(getTwo, true);
        let foundWord = null;
        let foundEntries = null;

        for (let entries of [traditionalEntries, simplifiedEntries]) {
          for (let entry of entries) {
            let matchText =
              entries === traditionalEntries
                ? entry.traditional
                : entry.simplified;
            let word = text.slice(i, i + Array.from(matchText).length).join("");

            if (
              matchText === word &&
              (foundWord == null ||
                Array.from(word).length > Array.from(foundWord).length)
            ) {
              foundWord = word;
              foundEntries = entries;
            }
          }
        }

        if (foundWord != null) {
          pushToken(foundWord);

          if (foundEntries === simplifiedEntries) {
            simplifiedPreference++;
          } else if (foundEntries === traditionalEntries) {
            traditionalPreference++;
          }

          continue;
        }
      }

      // If it fails, match one character

      let character = text[i];
      let isChinese = (character) =>
        chinesePunctuation.includes(character) ||
        dictionary.get(character, false).length > 0 ||
        dictionary.get(character, true).length > 0;

      if (isChinese(character) || character.match(/\s/) != null) {
        pushToken(character);
        continue;
      }

      // Handle non-Chinese characters

      let end = i + 1;

      for (; end < text.length; end++) {
        if (text[end].match(/\s/) != null || isChinese(text[end])) break;
      }

      let word = text.slice(i, end).join("");
      pushToken(word);
    }

    return result;
  };
};

/**
 * Chinese needs original logic.
 */
class ChineseTokenizer {
    static create(dict) {
        const ins = new ChineseTokenizer();
        ins._tokenize = main.load(dict);
        return ins;
    }
    tokenize(content, raw) {
        return content
            .split(raw ? / /g : this.getTrimPattern())
            .filter((x) => x !== "")
            .flatMap((x) => this._tokenize(x))
            .map((x) => x.text);
    }
    recursiveTokenize(content) {
        const tokens = this._tokenize(content).map((x) => x.text);
        const ret = [];
        for (let i = 0; i < tokens.length; i++) {
            if (i === 0 ||
                tokens[i].length !== 1 ||
                !Boolean(tokens[i].match(this.getTrimPattern()))) {
                ret.push({
                    word: tokens.slice(i).join(""),
                    offset: tokens.slice(0, i).join("").length,
                });
            }
        }
        return ret;
    }
    getTrimPattern() {
        return TRIM_CHAR_PATTERN;
    }
    shouldIgnore(str) {
        return false;
    }
}

function createTokenizer(strategy, app) {
    return __awaiter(this, void 0, void 0, function* () {
        switch (strategy.name) {
            case "default":
                return new DefaultTokenizer();
            case "english-only":
                return new EnglishOnlyTokenizer();
            case "arabic":
                return new ArabicTokenizer();
            case "japanese":
                return new JapaneseTokenizer();
            case "chinese":
                const hasCedict = yield app.vault.adapter.exists("./cedict_ts.u8");
                if (!hasCedict) {
                    return Promise.reject(new Error("cedict_ts.U8 doesn't exist in your vault root."));
                }
                const dict = yield app.vault.adapter.read("./cedict_ts.u8");
                return ChineseTokenizer.create(dict);
        }
    });
}

class TokenizeStrategy {
    constructor(name, triggerThreshold, indexingThreshold) {
        this.name = name;
        this.triggerThreshold = triggerThreshold;
        this.indexingThreshold = indexingThreshold;
        TokenizeStrategy._values.push(this);
    }
    static fromName(name) {
        return TokenizeStrategy._values.find((x) => x.name === name);
    }
    static values() {
        return TokenizeStrategy._values;
    }
}
TokenizeStrategy._values = [];
TokenizeStrategy.DEFAULT = new TokenizeStrategy("default", 3, 5);
TokenizeStrategy.ENGLISH_ONLY = new TokenizeStrategy("english-only", 3, 5);
TokenizeStrategy.JAPANESE = new TokenizeStrategy("japanese", 2, 2);
TokenizeStrategy.ARABIC = new TokenizeStrategy("arabic", 3, 3);
TokenizeStrategy.CHINESE = new TokenizeStrategy("chinese", 1, 2);

class AppHelper {
    constructor(app) {
        this.unsafeApp = app;
    }
    equalsAsEditorPostion(one, other) {
        return one.line === other.line && one.ch === other.ch;
    }
    getAliases(file) {
        var _a, _b;
        return ((_b = obsidian.parseFrontMatterAliases((_a = this.unsafeApp.metadataCache.getFileCache(file)) === null || _a === void 0 ? void 0 : _a.frontmatter)) !== null && _b !== void 0 ? _b : []);
    }
    getFrontMatter(file) {
        var _a, _b, _c, _d;
        const frontMatter = (_a = this.unsafeApp.metadataCache.getFileCache(file)) === null || _a === void 0 ? void 0 : _a.frontmatter;
        if (!frontMatter) {
            return undefined;
        }
        // remove #
        const tags = (_c = (_b = obsidian.parseFrontMatterTags(frontMatter)) === null || _b === void 0 ? void 0 : _b.map((x) => x.slice(1))) !== null && _c !== void 0 ? _c : [];
        const aliases = (_d = obsidian.parseFrontMatterAliases(frontMatter)) !== null && _d !== void 0 ? _d : [];
        const rest = __rest(frontMatter, ["position"]);
        return Object.assign(Object.assign({}, Object.fromEntries(Object.entries(rest).map(([k, _v]) => [
            k,
            obsidian.parseFrontMatterStringArray(frontMatter, k),
        ]))), { tags, tag: tags, aliases, alias: aliases });
    }
    getMarkdownViewInActiveLeaf() {
        if (!this.unsafeApp.workspace.getActiveViewOfType(obsidian.MarkdownView)) {
            return null;
        }
        return this.unsafeApp.workspace.activeLeaf.view;
    }
    getActiveFile() {
        return this.unsafeApp.workspace.getActiveFile();
    }
    isActiveFile(file) {
        var _a;
        return ((_a = this.getActiveFile()) === null || _a === void 0 ? void 0 : _a.path) === file.path;
    }
    getPreviousFile() {
        var _a;
        const fName = (_a = this.unsafeApp.workspace.getLastOpenFiles()) === null || _a === void 0 ? void 0 : _a[1];
        if (!fName) {
            return null;
        }
        return this.getMarkdownFileByPath(fName);
    }
    getCurrentDirname() {
        var _a, _b;
        return (_b = (_a = this.getActiveFile()) === null || _a === void 0 ? void 0 : _a.parent.path) !== null && _b !== void 0 ? _b : null;
    }
    getCurrentEditor() {
        var _a, _b;
        return (_b = (_a = this.getMarkdownViewInActiveLeaf()) === null || _a === void 0 ? void 0 : _a.editor) !== null && _b !== void 0 ? _b : null;
    }
    getSelection() {
        var _a;
        return (_a = this.getCurrentEditor()) === null || _a === void 0 ? void 0 : _a.getSelection();
    }
    getCurrentOffset(editor) {
        return editor.posToOffset(editor.getCursor());
    }
    getCurrentLine(editor) {
        return editor.getLine(editor.getCursor().line);
    }
    getCurrentLineUntilCursor(editor) {
        return this.getCurrentLine(editor).slice(0, editor.getCursor().ch);
    }
    optimizeMarkdownLinkText(linkText) {
        const activeFile = this.getActiveFile();
        if (!activeFile) {
            return null;
        }
        const path = this.linkText2Path(linkText);
        if (!path) {
            return linkText;
        }
        const file = this.getMarkdownFileByPath(path);
        if (!file) {
            return null;
        }
        return this.unsafeApp.fileManager
            .generateMarkdownLink(file, activeFile.path)
            .replace("[[", "")
            .replace("]]", "");
    }
    linkText2Path(linkText) {
        var _a, _b;
        const activeFile = this.getActiveFile();
        if (!activeFile) {
            return null;
        }
        return ((_b = (_a = this.unsafeApp.metadataCache.getFirstLinkpathDest(linkText, activeFile.path)) === null || _a === void 0 ? void 0 : _a.path) !== null && _b !== void 0 ? _b : null);
    }
    searchPhantomLinks() {
        return Object.entries(this.unsafeApp.metadataCache.unresolvedLinks).flatMap(([path, obj]) => Object.keys(obj).map((link) => ({ path, link })));
    }
    getMarkdownFileByPath(path) {
        if (!path.endsWith(".md")) {
            return null;
        }
        const abstractFile = this.unsafeApp.vault.getAbstractFileByPath(path);
        if (!abstractFile) {
            return null;
        }
        return abstractFile;
    }
    openMarkdownFile(file, newLeaf, offset = 0) {
        var _a;
        const leaf = this.unsafeApp.workspace.getLeaf(newLeaf);
        leaf
            .openFile(file, (_a = this.unsafeApp.workspace.activeLeaf) === null || _a === void 0 ? void 0 : _a.getViewState())
            .then(() => {
            this.unsafeApp.workspace.setActiveLeaf(leaf, true, true);
            const viewOfType = this.unsafeApp.workspace.getActiveViewOfType(obsidian.MarkdownView);
            if (viewOfType) {
                const editor = viewOfType.editor;
                const pos = editor.offsetToPos(offset);
                editor.setCursor(pos);
                editor.scrollIntoView({ from: pos, to: pos }, true);
            }
        });
    }
    getCurrentFrontMatter() {
        const editor = this.getCurrentEditor();
        if (!editor) {
            return null;
        }
        if (!this.getActiveFile()) {
            return null;
        }
        if (editor.getLine(0) !== "---") {
            return null;
        }
        const endPosition = editor.getValue().indexOf("---", 3);
        const currentOffset = this.getCurrentOffset(editor);
        if (endPosition !== -1 && currentOffset >= endPosition) {
            return null;
        }
        const keyLocations = Array.from(editor.getValue().matchAll(/.+:/g));
        if (keyLocations.length === 0) {
            return null;
        }
        const currentKeyLocation = keyLocations
            .filter((x) => x.index < currentOffset)
            .last();
        if (!currentKeyLocation) {
            return null;
        }
        return currentKeyLocation[0].split(":")[0];
    }
    /**
     * Unsafe method
     */
    isIMEOn() {
        var _a, _b, _c;
        if (!this.unsafeApp.workspace.getActiveViewOfType(obsidian.MarkdownView)) {
            return false;
        }
        const markdownView = this.unsafeApp.workspace.activeLeaf
            .view;
        const cm5or6 = markdownView.editor.cm;
        // cm6
        if (((_a = cm5or6 === null || cm5or6 === void 0 ? void 0 : cm5or6.inputState) === null || _a === void 0 ? void 0 : _a.composing) > 0) {
            return true;
        }
        // cm5
        return !!((_c = (_b = cm5or6 === null || cm5or6 === void 0 ? void 0 : cm5or6.display) === null || _b === void 0 ? void 0 : _b.input) === null || _c === void 0 ? void 0 : _c.composing);
    }
    writeLog(log) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.unsafeApp.vault.adapter.append(obsidian.normalizePath("log.md"), log);
        });
    }
}

const groupBy = (values, toKey) => values.reduce((prev, cur, _1, _2, k = toKey(cur)) => ((prev[k] || (prev[k] = [])).push(cur), prev), {});
function uniq(values) {
    return [...new Set(values)];
}
function uniqBy(values, fn) {
    const m = new Map();
    values.forEach((x) => {
        const k = fn(x);
        if (!m.has(k)) {
            m.set(k, x);
        }
    });
    return Array.from(m.values());
}
function uniqWith(arr, fn) {
    return arr.filter((element, index) => arr.findIndex((step) => fn(element, step)) === index);
}
function mirrorMap(collection, toValue) {
    return collection.reduce((p, c) => (Object.assign(Object.assign({}, p), { [toValue(c)]: toValue(c) })), {});
}

class WordTypeMeta {
    constructor(type, priority, group) {
        this.type = type;
        this.priority = priority;
        this.group = group;
        WordTypeMeta._values.push(this);
        WordTypeMeta._dict[type] = this;
    }
    static of(type) {
        return WordTypeMeta._dict[type];
    }
    static values() {
        return WordTypeMeta._values;
    }
}
WordTypeMeta._values = [];
WordTypeMeta._dict = {};
WordTypeMeta.FRONT_MATTER = new WordTypeMeta("frontMatter", 100, "frontMatter");
WordTypeMeta.INTERNAL_LINK = new WordTypeMeta("internalLink", 90, "internalLink");
WordTypeMeta.CUSTOM_DICTIONARY = new WordTypeMeta("customDictionary", 80, "suggestion");
WordTypeMeta.CURRENT_FILE = new WordTypeMeta("currentFile", 70, "suggestion");
WordTypeMeta.CURRENT_VAULT = new WordTypeMeta("currentVault", 60, "suggestion");

function pushWord(wordsByFirstLetter, key, word) {
    if (wordsByFirstLetter[key] === undefined) {
        wordsByFirstLetter[key] = [word];
        return;
    }
    wordsByFirstLetter[key].push(word);
}
// Public for tests
function judge(word, query, queryStartWithUpper) {
    var _a;
    if (query === "") {
        return {
            word: Object.assign(Object.assign({}, word), { hit: word.value }),
            value: word.value,
            alias: false,
        };
    }
    if (lowerStartsWith(word.value, query)) {
        if (queryStartWithUpper &&
            word.type !== "internalLink" &&
            word.type !== "frontMatter") {
            const c = capitalizeFirstLetter(word.value);
            return {
                word: Object.assign(Object.assign({}, word), { value: c, hit: c }),
                value: c,
                alias: false,
            };
        }
        else {
            return {
                word: Object.assign(Object.assign({}, word), { hit: word.value }),
                value: word.value,
                alias: false,
            };
        }
    }
    const matchedAlias = (_a = word.aliases) === null || _a === void 0 ? void 0 : _a.find((a) => lowerStartsWith(a, query));
    if (matchedAlias) {
        return {
            word: Object.assign(Object.assign({}, word), { hit: matchedAlias }),
            value: matchedAlias,
            alias: true,
        };
    }
    return {
        word,
        alias: false,
    };
}
function suggestWords(indexedWords, query, max, frontMatter, selectionHistoryStorage) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
    const queryStartWithUpper = capitalizeFirstLetter(query) === query;
    const flattenFrontMatterWords = () => {
        var _a, _b;
        if (frontMatter === "alias" || frontMatter === "aliases") {
            return [];
        }
        if (frontMatter && ((_a = indexedWords.frontMatter) === null || _a === void 0 ? void 0 : _a[frontMatter])) {
            return Object.values((_b = indexedWords.frontMatter) === null || _b === void 0 ? void 0 : _b[frontMatter]).flat();
        }
        return [];
    };
    const words = queryStartWithUpper
        ? frontMatter
            ? flattenFrontMatterWords()
            : [
                ...((_a = indexedWords.currentFile[query.charAt(0)]) !== null && _a !== void 0 ? _a : []),
                ...((_b = indexedWords.currentFile[query.charAt(0).toLowerCase()]) !== null && _b !== void 0 ? _b : []),
                ...((_c = indexedWords.currentVault[query.charAt(0)]) !== null && _c !== void 0 ? _c : []),
                ...((_d = indexedWords.currentVault[query.charAt(0).toLowerCase()]) !== null && _d !== void 0 ? _d : []),
                ...((_e = indexedWords.customDictionary[query.charAt(0)]) !== null && _e !== void 0 ? _e : []),
                ...((_f = indexedWords.customDictionary[query.charAt(0).toLowerCase()]) !== null && _f !== void 0 ? _f : []),
                ...((_g = indexedWords.internalLink[query.charAt(0)]) !== null && _g !== void 0 ? _g : []),
                ...((_h = indexedWords.internalLink[query.charAt(0).toLowerCase()]) !== null && _h !== void 0 ? _h : []),
            ]
        : frontMatter
            ? flattenFrontMatterWords()
            : [
                ...((_j = indexedWords.currentFile[query.charAt(0)]) !== null && _j !== void 0 ? _j : []),
                ...((_k = indexedWords.currentFile[query.charAt(0).toUpperCase()]) !== null && _k !== void 0 ? _k : []),
                ...((_l = indexedWords.currentVault[query.charAt(0)]) !== null && _l !== void 0 ? _l : []),
                ...((_m = indexedWords.currentVault[query.charAt(0).toUpperCase()]) !== null && _m !== void 0 ? _m : []),
                ...((_o = indexedWords.customDictionary[query.charAt(0)]) !== null && _o !== void 0 ? _o : []),
                ...((_p = indexedWords.customDictionary[query.charAt(0).toUpperCase()]) !== null && _p !== void 0 ? _p : []),
                ...((_q = indexedWords.internalLink[query.charAt(0)]) !== null && _q !== void 0 ? _q : []),
                ...((_r = indexedWords.internalLink[query.charAt(0).toUpperCase()]) !== null && _r !== void 0 ? _r : []),
            ];
    const candidate = Array.from(words)
        .map((x) => judge(x, query, queryStartWithUpper))
        .filter((x) => x.value !== undefined)
        .sort((a, b) => {
        const aWord = a.word;
        const bWord = b.word;
        const notSameWordType = aWord.type !== bWord.type;
        if (frontMatter && notSameWordType) {
            return bWord.type === "frontMatter" ? 1 : -1;
        }
        if (selectionHistoryStorage) {
            const ret = selectionHistoryStorage.compare(aWord, bWord);
            if (ret !== 0) {
                return ret;
            }
        }
        if (a.value.length !== b.value.length) {
            return a.value.length > b.value.length ? 1 : -1;
        }
        if (notSameWordType) {
            return WordTypeMeta.of(bWord.type).priority >
                WordTypeMeta.of(aWord.type).priority
                ? 1
                : -1;
        }
        if (a.alias !== b.alias) {
            return a.alias ? 1 : -1;
        }
        return 0;
    })
        .map((x) => x.word)
        .slice(0, max);
    // XXX: There is no guarantee that equals with max, but it is important for performance
    return uniqWith(candidate, (a, b) => a.value === b.value &&
        WordTypeMeta.of(a.type).group === WordTypeMeta.of(b.type).group);
}
// TODO: refactoring
// Public for tests
function judgeByPartialMatch(word, query, queryStartWithUpper) {
    var _a, _b;
    if (query === "") {
        return {
            word: Object.assign(Object.assign({}, word), { hit: word.value }),
            value: word.value,
            alias: false,
        };
    }
    if (lowerStartsWith(word.value, query)) {
        if (queryStartWithUpper &&
            word.type !== "internalLink" &&
            word.type !== "frontMatter") {
            const c = capitalizeFirstLetter(word.value);
            return { word: Object.assign(Object.assign({}, word), { value: c, hit: c }), value: c, alias: false };
        }
        else {
            return {
                word: Object.assign(Object.assign({}, word), { hit: word.value }),
                value: word.value,
                alias: false,
            };
        }
    }
    const matchedAliasStarts = (_a = word.aliases) === null || _a === void 0 ? void 0 : _a.find((a) => lowerStartsWith(a, query));
    if (matchedAliasStarts) {
        return {
            word: Object.assign(Object.assign({}, word), { hit: matchedAliasStarts }),
            value: matchedAliasStarts,
            alias: true,
        };
    }
    if (lowerIncludes(word.value, query)) {
        return {
            word: Object.assign(Object.assign({}, word), { hit: word.value }),
            value: word.value,
            alias: false,
        };
    }
    const matchedAliasIncluded = (_b = word.aliases) === null || _b === void 0 ? void 0 : _b.find((a) => lowerIncludes(a, query));
    if (matchedAliasIncluded) {
        return {
            word: Object.assign(Object.assign({}, word), { hit: matchedAliasIncluded }),
            value: matchedAliasIncluded,
            alias: true,
        };
    }
    return { word: word, alias: false };
}
function suggestWordsByPartialMatch(indexedWords, query, max, frontMatter, selectionHistoryStorage) {
    const queryStartWithUpper = capitalizeFirstLetter(query) === query;
    const flatObjectValues = (object) => Object.values(object).flat();
    const flattenFrontMatterWords = () => {
        var _a, _b;
        if (frontMatter === "alias" || frontMatter === "aliases") {
            return [];
        }
        if (frontMatter && ((_a = indexedWords.frontMatter) === null || _a === void 0 ? void 0 : _a[frontMatter])) {
            return Object.values((_b = indexedWords.frontMatter) === null || _b === void 0 ? void 0 : _b[frontMatter]).flat();
        }
        return [];
    };
    const words = frontMatter
        ? flattenFrontMatterWords()
        : [
            ...flatObjectValues(indexedWords.currentFile),
            ...flatObjectValues(indexedWords.currentVault),
            ...flatObjectValues(indexedWords.customDictionary),
            ...flatObjectValues(indexedWords.internalLink),
        ];
    const candidate = Array.from(words)
        .map((x) => judgeByPartialMatch(x, query, queryStartWithUpper))
        .filter((x) => x.value !== undefined)
        .sort((a, b) => {
        const aWord = a.word;
        const bWord = b.word;
        const notSameWordType = aWord.type !== bWord.type;
        if (frontMatter && notSameWordType) {
            return bWord.type === "frontMatter" ? 1 : -1;
        }
        if (selectionHistoryStorage) {
            const ret = selectionHistoryStorage.compare(aWord, bWord);
            if (ret !== 0) {
                return ret;
            }
        }
        const as = lowerStartsWith(a.value, query);
        const bs = lowerStartsWith(b.value, query);
        if (as !== bs) {
            return bs ? 1 : -1;
        }
        if (a.value.length !== b.value.length) {
            return a.value.length > b.value.length ? 1 : -1;
        }
        if (notSameWordType) {
            return WordTypeMeta.of(bWord.type).priority >
                WordTypeMeta.of(aWord.type).priority
                ? 1
                : -1;
        }
        if (a.alias !== b.alias) {
            return a.alias ? 1 : -1;
        }
        return 0;
    })
        .map((x) => x.word)
        .slice(0, max);
    // XXX: There is no guarantee that equals with max, but it is important for performance
    return uniqWith(candidate, (a, b) => a.value === b.value &&
        WordTypeMeta.of(a.type).group === WordTypeMeta.of(b.type).group);
}

function basename(path, ext) {
    var _a, _b;
    const name = (_b = (_a = path.match(/.+[\\/]([^\\/]+)[\\/]?$/)) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : path;
    return ext && name.endsWith(ext) ? name.replace(ext, "") : name;
}
function dirname(path) {
    var _a, _b;
    return (_b = (_a = path.match(/(.+)[\\/].+$/)) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : ".";
}
function isURL(path) {
    return Boolean(path.match(new RegExp("^https?://")));
}

function escape(value) {
    // This tricky logics for Safari
    // https://github.com/tadashi-aikawa/obsidian-various-complements-plugin/issues/56
    return value
        .replace(/\\/g, "__VariousComplementsEscape__")
        .replace(/\n/g, "\\n")
        .replace(/\t/g, "\\t")
        .replace(/__VariousComplementsEscape__/g, "\\\\");
}
function unescape(value) {
    // This tricky logics for Safari
    // https://github.com/tadashi-aikawa/obsidian-various-complements-plugin/issues/56
    return value
        .replace(/\\\\/g, "__VariousComplementsEscape__")
        .replace(/\\n/g, "\n")
        .replace(/\\t/g, "\t")
        .replace(/__VariousComplementsEscape__/g, "\\");
}
function jsonToWords(json, path, systemCaretSymbol) {
    return json.words.map((x) => {
        var _a;
        return ({
            value: x.displayed || x.value,
            description: x.description,
            aliases: x.aliases,
            type: "customDictionary",
            createdPath: path,
            insertedText: x.displayed ? x.value : undefined,
            caretSymbol: (_a = json.caretSymbol) !== null && _a !== void 0 ? _a : systemCaretSymbol,
            ignoreSpaceAfterCompletion: json.ignoreSpaceAfterCompletion,
        });
    });
}
function lineToWord(line, delimiter, path, delimiterForDisplay, delimiterForHide, systemCaretSymbol) {
    const [v, description, ...aliases] = line.split(delimiter.value);
    let value = unescape(v);
    let insertedText;
    let displayedText = value;
    if (delimiterForDisplay && value.includes(delimiterForDisplay)) {
        [displayedText, insertedText] = value.split(delimiterForDisplay);
    }
    if (delimiterForHide && value.includes(delimiterForHide)) {
        insertedText = value.replace(delimiterForHide, "");
        displayedText = `${value.split(delimiterForHide)[0]} ...`;
    }
    return {
        value: displayedText,
        description,
        aliases,
        type: "customDictionary",
        createdPath: path,
        insertedText,
        caretSymbol: systemCaretSymbol,
    };
}
function wordToLine(word, delimiter, dividerForDisplay) {
    const value = word.insertedText && dividerForDisplay
        ? `${word.value}${dividerForDisplay}${word.insertedText}`
        : word.value;
    const escapedValue = escape(value);
    if (!word.description && !word.aliases) {
        return escapedValue;
    }
    if (!word.aliases) {
        return [escapedValue, word.description].join(delimiter.value);
    }
    return [escapedValue, word.description, ...word.aliases].join(delimiter.value);
}
function synonymAliases$1(name) {
    const lessEmojiValue = excludeEmoji(name);
    return name === lessEmojiValue ? [] : [lessEmojiValue];
}
class CustomDictionaryWordProvider {
    constructor(app, appHelper) {
        this.words = [];
        this.wordByValue = {};
        this.wordsByFirstLetter = {};
        this.appHelper = appHelper;
        this.fileSystemAdapter = app.vault.adapter;
    }
    get editablePaths() {
        return this.paths.filter((x) => !isURL(x) && !x.endsWith(".json"));
    }
    loadWords(path, option) {
        return __awaiter(this, void 0, void 0, function* () {
            const contents = isURL(path)
                ? yield obsidian.request({ url: path })
                : yield this.fileSystemAdapter.read(path);
            const words = path.endsWith(".json")
                ? jsonToWords(JSON.parse(contents), path, option.caretSymbol)
                : contents
                    .split(/\r\n|\n/)
                    .map((x) => x.replace(/%%.*%%/g, ""))
                    .filter((x) => x)
                    .map((x) => lineToWord(x, this.delimiter, path, option.delimiterForDisplay, option.delimiterForHide, option.caretSymbol));
            return words.filter((x) => !option.regexp || x.value.match(new RegExp(option.regexp)));
        });
    }
    refreshCustomWords(option) {
        return __awaiter(this, void 0, void 0, function* () {
            this.clearWords();
            for (const path of this.paths) {
                try {
                    const words = yield this.loadWords(path, option);
                    words.forEach((x) => this.words.push(x));
                }
                catch (e) {
                    // noinspection ObjectAllocationIgnored
                    new obsidian.Notice(`⚠ Fail to load ${path} -- Various Complements Plugin -- \n ${e}`, 0);
                }
            }
            this.words.forEach((x) => this.addWord(x));
        });
    }
    addWordWithDictionary(word, dictionaryPath) {
        return __awaiter(this, void 0, void 0, function* () {
            this.addWord(word);
            yield this.fileSystemAdapter.append(dictionaryPath, "\n" + wordToLine(word, this.delimiter, this.dividerForDisplay));
        });
    }
    addWord(word) {
        var _a, _b;
        // Add aliases as a synonym
        const wordWithSynonym = Object.assign(Object.assign({}, word), { aliases: [...((_a = word.aliases) !== null && _a !== void 0 ? _a : []), ...synonymAliases$1(word.value)] });
        this.wordByValue[wordWithSynonym.value] = wordWithSynonym;
        pushWord(this.wordsByFirstLetter, wordWithSynonym.value.charAt(0), wordWithSynonym);
        (_b = wordWithSynonym.aliases) === null || _b === void 0 ? void 0 : _b.forEach((a) => pushWord(this.wordsByFirstLetter, a.charAt(0), wordWithSynonym));
    }
    clearWords() {
        this.words = [];
        this.wordByValue = {};
        this.wordsByFirstLetter = {};
    }
    get wordCount() {
        return this.words.length;
    }
    setSettings(paths, delimiter, dividerForDisplay) {
        this.paths = paths;
        this.delimiter = delimiter;
        this.dividerForDisplay = dividerForDisplay;
    }
}

class CurrentFileWordProvider {
    constructor(app, appHelper) {
        this.app = app;
        this.appHelper = appHelper;
        this.wordsByFirstLetter = {};
        this.words = [];
    }
    refreshWords(onlyEnglish, minNumberOfCharacters) {
        return __awaiter(this, void 0, void 0, function* () {
            this.clearWords();
            const editor = this.appHelper.getCurrentEditor();
            if (!editor) {
                return;
            }
            const file = this.app.workspace.getActiveFile();
            if (!file) {
                return;
            }
            const currentToken = this.tokenizer
                .tokenize(editor.getLine(editor.getCursor().line).slice(0, editor.getCursor().ch))
                .last();
            const content = yield this.app.vault.cachedRead(file);
            const tokens = this.tokenizer
                .tokenize(content)
                .filter((x) => {
                if (x.length < minNumberOfCharacters) {
                    return false;
                }
                return onlyEnglish ? allAlphabets(x) : true;
            })
                .map((x) => (startsSmallLetterOnlyFirst(x) ? x.toLowerCase() : x));
            this.words = uniq(tokens)
                .filter((x) => x !== currentToken)
                .map((x) => ({
                value: x,
                type: "currentFile",
                createdPath: file.path,
            }));
            this.wordsByFirstLetter = groupBy(this.words, (x) => x.value.charAt(0));
        });
    }
    clearWords() {
        this.words = [];
        this.wordsByFirstLetter = {};
    }
    get wordCount() {
        return this.words.length;
    }
    setSettings(tokenizer) {
        this.tokenizer = tokenizer;
    }
}

class InternalLinkWordProvider {
    constructor(app, appHelper) {
        this.app = app;
        this.appHelper = appHelper;
        this.words = [];
        this.wordsByFirstLetter = {};
    }
    refreshWords(wordAsInternalLinkAlias, excludePathPrefixPatterns) {
        var _a;
        this.clearWords();
        const synonymAliases = (name) => {
            const lessEmojiValue = excludeEmoji(name);
            return name === lessEmojiValue ? [] : [lessEmojiValue];
        };
        const resolvedInternalLinkWords = this.app.vault
            .getMarkdownFiles()
            .filter((f) => excludePathPrefixPatterns.every((x) => !f.path.startsWith(x)))
            .flatMap((x) => {
            const aliases = this.appHelper.getAliases(x);
            if (wordAsInternalLinkAlias) {
                return [
                    {
                        value: x.basename,
                        type: "internalLink",
                        createdPath: x.path,
                        aliases: synonymAliases(x.basename),
                        description: x.path,
                    },
                    ...aliases.map((a) => ({
                        value: a,
                        type: "internalLink",
                        createdPath: x.path,
                        aliases: synonymAliases(a),
                        description: x.path,
                        aliasMeta: {
                            origin: x.basename,
                        },
                    })),
                ];
            }
            else {
                return [
                    {
                        value: x.basename,
                        type: "internalLink",
                        createdPath: x.path,
                        aliases: [
                            ...synonymAliases(x.basename),
                            ...aliases,
                            ...aliases.flatMap(synonymAliases),
                        ],
                        description: x.path,
                    },
                ];
            }
        });
        const unresolvedInternalLinkWords = this.appHelper
            .searchPhantomLinks()
            .map(({ path, link }) => {
            return {
                value: link,
                type: "internalLink",
                createdPath: path,
                aliases: synonymAliases(link),
                description: `Appeared in -> ${path}`,
                phantom: true,
            };
        });
        this.words = [...resolvedInternalLinkWords, ...unresolvedInternalLinkWords];
        for (const word of this.words) {
            pushWord(this.wordsByFirstLetter, word.value.charAt(0), word);
            (_a = word.aliases) === null || _a === void 0 ? void 0 : _a.forEach((a) => pushWord(this.wordsByFirstLetter, a.charAt(0), word));
        }
    }
    clearWords() {
        this.words = [];
        this.wordsByFirstLetter = {};
    }
    get wordCount() {
        return this.words.length;
    }
}

class MatchStrategy {
    constructor(name, handler) {
        this.name = name;
        this.handler = handler;
        MatchStrategy._values.push(this);
    }
    static fromName(name) {
        return MatchStrategy._values.find((x) => x.name === name);
    }
    static values() {
        return MatchStrategy._values;
    }
}
MatchStrategy._values = [];
MatchStrategy.PREFIX = new MatchStrategy("prefix", suggestWords);
MatchStrategy.PARTIAL = new MatchStrategy("partial", suggestWordsByPartialMatch);

class CycleThroughSuggestionsKeys {
    constructor(name, nextKey, previousKey) {
        this.name = name;
        this.nextKey = nextKey;
        this.previousKey = previousKey;
        CycleThroughSuggestionsKeys._values.push(this);
    }
    static fromName(name) {
        return CycleThroughSuggestionsKeys._values.find((x) => x.name === name);
    }
    static values() {
        return CycleThroughSuggestionsKeys._values;
    }
}
CycleThroughSuggestionsKeys._values = [];
CycleThroughSuggestionsKeys.NONE = new CycleThroughSuggestionsKeys("None", { modifiers: [], key: null }, { modifiers: [], key: null });
CycleThroughSuggestionsKeys.TAB = new CycleThroughSuggestionsKeys("Tab, Shift+Tab", { modifiers: [], key: "Tab" }, { modifiers: ["Shift"], key: "Tab" });
CycleThroughSuggestionsKeys.EMACS = new CycleThroughSuggestionsKeys("Ctrl/Cmd+N, Ctrl/Cmd+P", { modifiers: ["Mod"], key: "N" }, { modifiers: ["Mod"], key: "P" });
CycleThroughSuggestionsKeys.VIM = new CycleThroughSuggestionsKeys("Ctrl/Cmd+J, Ctrl/Cmd+K", { modifiers: ["Mod"], key: "J" }, { modifiers: ["Mod"], key: "K" });

class ColumnDelimiter {
    constructor(name, value) {
        this.name = name;
        this.value = value;
        ColumnDelimiter._values.push(this);
    }
    static fromName(name) {
        return ColumnDelimiter._values.find((x) => x.name === name);
    }
    static values() {
        return ColumnDelimiter._values;
    }
}
ColumnDelimiter._values = [];
ColumnDelimiter.TAB = new ColumnDelimiter("Tab", "\t");
ColumnDelimiter.COMMA = new ColumnDelimiter("Comma", ",");
ColumnDelimiter.PIPE = new ColumnDelimiter("Pipe", "|");

class SelectSuggestionKey {
    constructor(name, keyBind) {
        this.name = name;
        this.keyBind = keyBind;
        SelectSuggestionKey._values.push(this);
    }
    static fromName(name) {
        return SelectSuggestionKey._values.find((x) => x.name === name);
    }
    static values() {
        return SelectSuggestionKey._values;
    }
}
SelectSuggestionKey._values = [];
SelectSuggestionKey.ENTER = new SelectSuggestionKey("Enter", {
    modifiers: [],
    key: "Enter",
});
SelectSuggestionKey.TAB = new SelectSuggestionKey("Tab", {
    modifiers: [],
    key: "Tab",
});
SelectSuggestionKey.MOD_ENTER = new SelectSuggestionKey("Ctrl/Cmd+Enter", {
    modifiers: ["Mod"],
    key: "Enter",
});
SelectSuggestionKey.ALT_ENTER = new SelectSuggestionKey("Alt+Enter", {
    modifiers: ["Alt"],
    key: "Enter",
});
SelectSuggestionKey.SHIFT_ENTER = new SelectSuggestionKey("Shift+Enter", {
    modifiers: ["Shift"],
    key: "Enter",
});
SelectSuggestionKey.SPACE = new SelectSuggestionKey("Space", {
    modifiers: [],
    key: " ",
});
SelectSuggestionKey.SHIFT_SPACE = new SelectSuggestionKey("Shift+Space", {
    modifiers: ["Shift"],
    key: " ",
});
SelectSuggestionKey.BACKQUOTE = new SelectSuggestionKey("Backquote", {
    modifiers: [],
    key: "`",
});
SelectSuggestionKey.None = new SelectSuggestionKey("None", {
    modifiers: [],
    key: "",
});

class CurrentVaultWordProvider {
    constructor(app, appHelper) {
        this.app = app;
        this.appHelper = appHelper;
        this.wordsByFirstLetter = {};
        this.words = [];
    }
    refreshWords(minNumberOfCharacters) {
        return __awaiter(this, void 0, void 0, function* () {
            this.clearWords();
            const currentDirname = this.appHelper.getCurrentDirname();
            const markdownFilePaths = this.app.vault
                .getMarkdownFiles()
                .map((x) => x.path)
                .filter((p) => this.includePrefixPatterns.every((x) => p.startsWith(x)))
                .filter((p) => this.excludePrefixPatterns.every((x) => !p.startsWith(x)))
                .filter((p) => !this.onlyUnderCurrentDirectory || dirname(p) === currentDirname);
            let wordByValue = {};
            for (const path of markdownFilePaths) {
                const content = yield this.app.vault.adapter.read(path);
                const tokens = this.tokenizer
                    .tokenize(content)
                    .filter((x) => x.length >= minNumberOfCharacters)
                    .map((x) => (startsSmallLetterOnlyFirst(x) ? x.toLowerCase() : x));
                for (const token of tokens) {
                    wordByValue[token] = {
                        value: token,
                        type: "currentVault",
                        createdPath: path,
                        description: path,
                    };
                }
            }
            this.words = Object.values(wordByValue);
            this.wordsByFirstLetter = groupBy(this.words, (x) => x.value.charAt(0));
        });
    }
    clearWords() {
        this.words = [];
        this.wordsByFirstLetter = {};
    }
    get wordCount() {
        return this.words.length;
    }
    setSettings(tokenizer, includePrefixPatterns, excludePrefixPatterns, onlyUnderCurrentDirectory) {
        this.tokenizer = tokenizer;
        this.includePrefixPatterns = includePrefixPatterns;
        this.excludePrefixPatterns = excludePrefixPatterns;
        this.onlyUnderCurrentDirectory = onlyUnderCurrentDirectory;
    }
}

class OpenSourceFileKeys {
    constructor(name, keyBind) {
        this.name = name;
        this.keyBind = keyBind;
        OpenSourceFileKeys._values.push(this);
    }
    static fromName(name) {
        return OpenSourceFileKeys._values.find((x) => x.name === name);
    }
    static values() {
        return OpenSourceFileKeys._values;
    }
}
OpenSourceFileKeys._values = [];
OpenSourceFileKeys.NONE = new OpenSourceFileKeys("None", {
    modifiers: [],
    key: null,
});
OpenSourceFileKeys.MOD_ENTER = new OpenSourceFileKeys("Ctrl/Cmd+Enter", {
    modifiers: ["Mod"],
    key: "Enter",
});
OpenSourceFileKeys.ALT_ENTER = new OpenSourceFileKeys("Alt+Enter", {
    modifiers: ["Alt"],
    key: "Enter",
});
OpenSourceFileKeys.SHIFT_ENTER = new OpenSourceFileKeys("Shift+Enter", {
    modifiers: ["Shift"],
    key: "Enter",
});

class DescriptionOnSuggestion {
    constructor(name, toDisplay) {
        this.name = name;
        this.toDisplay = toDisplay;
        DescriptionOnSuggestion._values.push(this);
    }
    static fromName(name) {
        return DescriptionOnSuggestion._values.find((x) => x.name === name);
    }
    static values() {
        return DescriptionOnSuggestion._values;
    }
}
DescriptionOnSuggestion._values = [];
DescriptionOnSuggestion.NONE = new DescriptionOnSuggestion("None", () => null);
DescriptionOnSuggestion.SHORT = new DescriptionOnSuggestion("Short", (word) => {
    if (!word.description) {
        return null;
    }
    return word.type === "customDictionary"
        ? word.description
        : basename(word.description);
});
DescriptionOnSuggestion.FULL = new DescriptionOnSuggestion("Full", (word) => { var _a; return (_a = word.description) !== null && _a !== void 0 ? _a : null; });

function synonymAliases(name) {
    const lessEmojiValue = excludeEmoji(name);
    return name === lessEmojiValue ? [] : [lessEmojiValue];
}
function frontMatterToWords(file, key, values) {
    return values.map((x) => ({
        key,
        value: x,
        type: "frontMatter",
        createdPath: file.path,
        aliases: synonymAliases(x),
    }));
}
function pickWords(file, fm) {
    return Object.entries(fm)
        .filter(([_key, value]) => value != null &&
        (typeof value === "string" || typeof value[0] === "string"))
        .flatMap(([key, value]) => frontMatterToWords(file, key, value));
}
// noinspection FunctionWithMultipleLoopsJS
function extractAndUniqWords(wordsByCreatedPath) {
    return uniqBy(Object.values(wordsByCreatedPath).flat(), (w) => w.key + w.value.toLowerCase());
}
function indexingWords(words) {
    const wordsByKey = groupBy(words, (x) => x.key);
    return Object.fromEntries(Object.entries(wordsByKey).map(([key, words]) => [
        key,
        groupBy(words, (w) => w.value.charAt(0)),
    ]));
}
class FrontMatterWordProvider {
    constructor(app, appHelper) {
        this.app = app;
        this.appHelper = appHelper;
        this.wordsByCreatedPath = {};
    }
    refreshWords() {
        this.clearWords();
        this.app.vault.getMarkdownFiles().forEach((f) => {
            const fm = this.appHelper.getFrontMatter(f);
            if (!fm) {
                return;
            }
            this.wordsByCreatedPath[f.path] = pickWords(f, fm);
        });
        this.words = extractAndUniqWords(this.wordsByCreatedPath);
        this.wordsByFirstLetterByKey = indexingWords(this.words);
    }
    updateWordIndex(file) {
        const fm = this.appHelper.getFrontMatter(file);
        if (!fm) {
            return;
        }
        this.wordsByCreatedPath[file.path] = pickWords(file, fm);
    }
    updateWords() {
        this.words = extractAndUniqWords(this.wordsByCreatedPath);
        this.wordsByFirstLetterByKey = indexingWords(this.words);
    }
    clearWords() {
        this.wordsByCreatedPath = {};
        this.words = [];
        this.wordsByFirstLetterByKey = {};
    }
    get wordCount() {
        return this.words.length;
    }
}

const neverUsedHandler = (..._args) => [];
class SpecificMatchStrategy {
    constructor(name, handler) {
        this.name = name;
        this.handler = handler;
        SpecificMatchStrategy._values.push(this);
    }
    static fromName(name) {
        return SpecificMatchStrategy._values.find((x) => x.name === name);
    }
    static values() {
        return SpecificMatchStrategy._values;
    }
}
SpecificMatchStrategy._values = [];
SpecificMatchStrategy.INHERIT = new SpecificMatchStrategy("inherit", neverUsedHandler);
SpecificMatchStrategy.PREFIX = new SpecificMatchStrategy("prefix", suggestWords);
SpecificMatchStrategy.PARTIAL = new SpecificMatchStrategy("partial", suggestWordsByPartialMatch);

const SEC = 1000;
const MIN = SEC * 60;
const HOUR = MIN * 60;
const DAY = HOUR * 24;
const WEEK = DAY * 7;
function calcScore(history) {
    if (!history) {
        return 0;
    }
    const behind = Date.now() - history.lastUpdated;
    // noinspection IfStatementWithTooManyBranchesJS
    if (behind < MIN) {
        return 8 * history.count;
    }
    else if (behind < HOUR) {
        return 4 * history.count;
    }
    else if (behind < DAY) {
        return 2 * history.count;
    }
    else if (behind < WEEK) {
        return 0.5 * history.count;
    }
    else {
        return 0.25 * history.count;
    }
}
class SelectionHistoryStorage {
    constructor(data = {}) {
        this.data = data;
        const now = Date.now();
        this.version = now;
        this.persistedVersion = now;
    }
    // noinspection FunctionWithMultipleLoopsJS
    purge() {
        for (const hit of Object.keys(this.data)) {
            for (const value of Object.keys(this.data[hit])) {
                for (const kind of Object.keys(this.data[hit][value])) {
                    if (Date.now() - this.data[hit][value][kind].lastUpdated > 4 * WEEK) {
                        delete this.data[hit][value][kind];
                    }
                }
                if (Object.isEmpty(this.data[hit][value])) {
                    delete this.data[hit][value];
                }
            }
            if (Object.isEmpty(this.data[hit])) {
                delete this.data[hit];
            }
        }
    }
    getSelectionHistory(word) {
        var _a, _b;
        return (_b = (_a = this.data[word.hit]) === null || _a === void 0 ? void 0 : _a[word.value]) === null || _b === void 0 ? void 0 : _b[word.type];
    }
    increment(word) {
        if (!this.data[word.hit]) {
            this.data[word.hit] = {};
        }
        if (!this.data[word.hit][word.value]) {
            this.data[word.hit][word.value] = {};
        }
        if (this.data[word.hit][word.value][word.type]) {
            this.data[word.hit][word.value][word.type] = {
                count: this.data[word.hit][word.value][word.type].count + 1,
                lastUpdated: Date.now(),
            };
        }
        else {
            this.data[word.hit][word.value][word.type] = {
                count: 1,
                lastUpdated: Date.now(),
            };
        }
        this.version = Date.now();
    }
    compare(w1, w2) {
        const score1 = calcScore(this.getSelectionHistory(w1));
        const score2 = calcScore(this.getSelectionHistory(w2));
        if (score1 === score2) {
            return 0;
        }
        return score1 > score2 ? -1 : 1;
    }
    get shouldPersist() {
        return this.version > this.persistedVersion;
    }
    syncPersistVersion() {
        this.persistedVersion = this.version;
    }
}

function buildLogMessage(message, msec) {
    return `${message}: ${Math.round(msec)}[ms]`;
}
class AutoCompleteSuggest extends obsidian.EditorSuggest {
    constructor(app, statusBar) {
        super(app);
        this.previousCurrentLine = "";
        this.keymapEventHandler = [];
        this.appHelper = new AppHelper(app);
        this.statusBar = statusBar;
    }
    triggerComplete() {
        const editor = this.appHelper.getCurrentEditor();
        const activeFile = this.app.workspace.getActiveFile();
        if (!editor || !activeFile) {
            return;
        }
        // XXX: Unsafe
        this.runManually = true;
        this.trigger(editor, activeFile, true);
    }
    static new(app, settings, statusBar, onPersistSelectionHistory) {
        return __awaiter(this, void 0, void 0, function* () {
            const ins = new AutoCompleteSuggest(app, statusBar);
            ins.currentFileWordProvider = new CurrentFileWordProvider(ins.app, ins.appHelper);
            ins.currentVaultWordProvider = new CurrentVaultWordProvider(ins.app, ins.appHelper);
            ins.customDictionaryWordProvider = new CustomDictionaryWordProvider(ins.app, ins.appHelper);
            ins.internalLinkWordProvider = new InternalLinkWordProvider(ins.app, ins.appHelper);
            ins.frontMatterWordProvider = new FrontMatterWordProvider(ins.app, ins.appHelper);
            ins.selectionHistoryStorage = new SelectionHistoryStorage(settings.selectionHistoryTree);
            ins.selectionHistoryStorage.purge();
            yield ins.updateSettings(settings);
            ins.modifyEventRef = app.vault.on("modify", (_) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                yield ins.refreshCurrentFileTokens();
                if ((_a = ins.selectionHistoryStorage) === null || _a === void 0 ? void 0 : _a.shouldPersist) {
                    ins.settings.selectionHistoryTree = ins.selectionHistoryStorage.data;
                    ins.selectionHistoryStorage.syncPersistVersion();
                    onPersistSelectionHistory();
                }
            }));
            ins.activeLeafChangeRef = app.workspace.on("active-leaf-change", (_) => __awaiter(this, void 0, void 0, function* () {
                yield ins.refreshCurrentFileTokens();
                ins.refreshInternalLinkTokens();
                ins.updateFrontMatterToken();
            }));
            ins.metadataCacheChangeRef = app.metadataCache.on("changed", (f) => {
                ins.updateFrontMatterTokenIndex(f);
                if (!ins.appHelper.isActiveFile(f)) {
                    ins.updateFrontMatterToken();
                }
            });
            // Avoid referring to incorrect cache
            const cacheResolvedRef = app.metadataCache.on("resolved", () => __awaiter(this, void 0, void 0, function* () {
                ins.refreshInternalLinkTokens();
                ins.refreshFrontMatterTokens();
                // noinspection ES6MissingAwait
                ins.refreshCustomDictionaryTokens();
                // noinspection ES6MissingAwait
                ins.refreshCurrentVaultTokens();
                ins.app.metadataCache.offref(cacheResolvedRef);
            }));
            return ins;
        });
    }
    predictableComplete() {
        const editor = this.appHelper.getCurrentEditor();
        if (!editor) {
            return;
        }
        const cursor = editor.getCursor();
        const currentToken = this.tokenizer
            .tokenize(editor.getLine(cursor.line).slice(0, cursor.ch))
            .last();
        if (!currentToken) {
            return;
        }
        let suggestion = this.tokenizer
            .tokenize(editor.getRange({ line: Math.max(cursor.line - 50, 0), ch: 0 }, cursor))
            .reverse()
            .slice(1)
            .find((x) => x.startsWith(currentToken));
        if (!suggestion) {
            suggestion = this.tokenizer
                .tokenize(editor.getRange(cursor, {
                line: Math.min(cursor.line + 50, editor.lineCount() - 1),
                ch: 0,
            }))
                .find((x) => x.startsWith(currentToken));
        }
        if (!suggestion) {
            return;
        }
        editor.replaceRange(suggestion, { line: cursor.line, ch: cursor.ch - currentToken.length }, { line: cursor.line, ch: cursor.ch });
        this.close();
        this.debounceClose();
    }
    unregister() {
        this.app.vault.offref(this.modifyEventRef);
        this.app.workspace.offref(this.activeLeafChangeRef);
        this.app.metadataCache.offref(this.metadataCacheChangeRef);
    }
    // settings getters
    get tokenizerStrategy() {
        return TokenizeStrategy.fromName(this.settings.strategy);
    }
    get matchStrategy() {
        return MatchStrategy.fromName(this.settings.matchStrategy);
    }
    get frontMatterComplementStrategy() {
        return SpecificMatchStrategy.fromName(this.settings.frontMatterComplementMatchStrategy);
    }
    get minNumberTriggered() {
        return (this.settings.minNumberOfCharactersTriggered ||
            this.tokenizerStrategy.triggerThreshold);
    }
    get currentFileMinNumberOfCharacters() {
        return (this.settings.currentFileMinNumberOfCharacters ||
            this.tokenizerStrategy.indexingThreshold);
    }
    get currentVaultMinNumberOfCharacters() {
        return (this.settings.currentVaultMinNumberOfCharacters ||
            this.tokenizerStrategy.indexingThreshold);
    }
    get descriptionOnSuggestion() {
        return DescriptionOnSuggestion.fromName(this.settings.descriptionOnSuggestion);
    }
    get excludeInternalLinkPrefixPathPatterns() {
        return this.settings.excludeInternalLinkPathPrefixPatterns
            .split("\n")
            .filter((x) => x);
    }
    // --- end ---
    get indexedWords() {
        return {
            currentFile: this.currentFileWordProvider.wordsByFirstLetter,
            currentVault: this.currentVaultWordProvider.wordsByFirstLetter,
            customDictionary: this.customDictionaryWordProvider.wordsByFirstLetter,
            internalLink: this.internalLinkWordProvider.wordsByFirstLetter,
            frontMatter: this.frontMatterWordProvider.wordsByFirstLetterByKey,
        };
    }
    updateSettings(settings) {
        return __awaiter(this, void 0, void 0, function* () {
            this.settings = settings;
            this.statusBar.setMatchStrategy(this.matchStrategy);
            this.statusBar.setComplementAutomatically(this.settings.complementAutomatically);
            try {
                this.tokenizer = yield createTokenizer(this.tokenizerStrategy, this.app);
            }
            catch (e) {
                new obsidian.Notice(e.message, 0);
            }
            this.currentFileWordProvider.setSettings(this.tokenizer);
            this.currentVaultWordProvider.setSettings(this.tokenizer, settings.includeCurrentVaultPathPrefixPatterns
                .split("\n")
                .filter((x) => x), settings.excludeCurrentVaultPathPrefixPatterns
                .split("\n")
                .filter((x) => x), settings.includeCurrentVaultOnlyFilesUnderCurrentDirectory);
            this.customDictionaryWordProvider.setSettings(settings.customDictionaryPaths.split("\n").filter((x) => x), ColumnDelimiter.fromName(settings.columnDelimiter), settings.delimiterToDivideSuggestionsForDisplayFromInsertion || null);
            this.debounceGetSuggestions = obsidian.debounce((context, cb) => {
                const start = performance.now();
                this.showDebugLog(() => `[context.query]: ${context.query}`);
                const parsedQuery = JSON.parse(context.query);
                const words = parsedQuery.queries
                    .filter((x, i, xs) => parsedQuery.currentFrontMatter ||
                    (this.settings.minNumberOfWordsTriggeredPhrase + i - 1 <
                        xs.length &&
                        x.word.length >= this.minNumberTriggered &&
                        !this.tokenizer.shouldIgnore(x.word) &&
                        !x.word.endsWith(" ")))
                    .map((q) => {
                    const handler = parsedQuery.currentFrontMatter &&
                        this.frontMatterComplementStrategy !==
                            SpecificMatchStrategy.INHERIT
                        ? this.frontMatterComplementStrategy.handler
                        : this.matchStrategy.handler;
                    return handler(this.indexedWords, q.word, this.settings.maxNumberOfSuggestions, parsedQuery.currentFrontMatter, this.selectionHistoryStorage).map((word) => (Object.assign(Object.assign({}, word), { offset: q.offset })));
                })
                    .flat();
                cb(uniqWith(words, (a, b) => a.value === b.value && a.type === b.type).slice(0, this.settings.maxNumberOfSuggestions));
                this.showDebugLog(() => buildLogMessage("Get suggestions", performance.now() - start));
            }, this.settings.delayMilliSeconds, true);
            this.debounceClose = obsidian.debounce(() => {
                this.close();
            }, this.settings.delayMilliSeconds + 50);
            this.registerKeymaps();
        });
    }
    registerKeymaps() {
        const registerKeyAsIgnored = (modifiers, key) => {
            this.keymapEventHandler.push(this.scope.register(modifiers, key, () => {
                this.close();
                return true;
            }));
        };
        // Clear
        this.keymapEventHandler.forEach((x) => this.scope.unregister(x));
        this.keymapEventHandler = [];
        this.scope.unregister(this.scope.keys.find((x) => x.key === "Enter"));
        this.scope.unregister(this.scope.keys.find((x) => x.key === "ArrowUp"));
        this.scope.unregister(this.scope.keys.find((x) => x.key === "ArrowDown"));
        // selectSuggestionKeys
        const selectSuggestionKey = SelectSuggestionKey.fromName(this.settings.selectSuggestionKeys);
        if (selectSuggestionKey !== SelectSuggestionKey.ENTER) {
            registerKeyAsIgnored(SelectSuggestionKey.ENTER.keyBind.modifiers, SelectSuggestionKey.ENTER.keyBind.key);
        }
        if (selectSuggestionKey !== SelectSuggestionKey.TAB) {
            registerKeyAsIgnored(SelectSuggestionKey.TAB.keyBind.modifiers, SelectSuggestionKey.TAB.keyBind.key);
        }
        if (selectSuggestionKey !== SelectSuggestionKey.None) {
            this.keymapEventHandler.push(this.scope.register(selectSuggestionKey.keyBind.modifiers, selectSuggestionKey.keyBind.key, () => {
                this.suggestions.useSelectedItem({});
                return false;
            }));
        }
        // propagateESC
        this.scope.keys.find((x) => x.key === "Escape").func = () => {
            this.close();
            return this.settings.propagateEsc;
        };
        // cycleThroughSuggestionsKeys
        const selectNext = () => {
            this.suggestions.setSelectedItem(this.suggestions.selectedItem + 1, true);
            return false;
        };
        const selectPrevious = () => {
            this.suggestions.setSelectedItem(this.suggestions.selectedItem - 1, true);
            return false;
        };
        const cycleThroughSuggestionsKeys = CycleThroughSuggestionsKeys.fromName(this.settings.additionalCycleThroughSuggestionsKeys);
        if (this.settings.disableUpDownKeysForCycleThroughSuggestionsKeys) {
            this.keymapEventHandler.push(this.scope.register([], "ArrowDown", () => {
                this.close();
                return true;
            }), this.scope.register([], "ArrowUp", () => {
                this.close();
                return true;
            }));
        }
        else {
            this.keymapEventHandler.push(this.scope.register([], "ArrowDown", selectNext), this.scope.register([], "ArrowUp", selectPrevious));
        }
        if (cycleThroughSuggestionsKeys !== CycleThroughSuggestionsKeys.NONE) {
            if (cycleThroughSuggestionsKeys === CycleThroughSuggestionsKeys.TAB) {
                this.scope.unregister(this.scope.keys.find((x) => x.modifiers === "" && x.key === "Tab"));
            }
            this.keymapEventHandler.push(this.scope.register(cycleThroughSuggestionsKeys.nextKey.modifiers, cycleThroughSuggestionsKeys.nextKey.key, selectNext), this.scope.register(cycleThroughSuggestionsKeys.previousKey.modifiers, cycleThroughSuggestionsKeys.previousKey.key, selectPrevious));
        }
        const openSourceFileKey = OpenSourceFileKeys.fromName(this.settings.openSourceFileKey);
        if (openSourceFileKey !== OpenSourceFileKeys.NONE) {
            this.keymapEventHandler.push(this.scope.register(openSourceFileKey.keyBind.modifiers, openSourceFileKey.keyBind.key, () => {
                const item = this.suggestions.values[this.suggestions.selectedItem];
                if (item.type !== "currentVault" &&
                    item.type !== "internalLink" &&
                    item.type !== "frontMatter") {
                    return false;
                }
                const markdownFile = this.appHelper.getMarkdownFileByPath(item.createdPath);
                if (!markdownFile) {
                    // noinspection ObjectAllocationIgnored
                    new obsidian.Notice(`Can't open ${item.createdPath}`);
                    return false;
                }
                this.appHelper.openMarkdownFile(markdownFile, true);
                return false;
            }));
        }
    }
    refreshCurrentFileTokens() {
        return __awaiter(this, void 0, void 0, function* () {
            const start = performance.now();
            this.statusBar.setCurrentFileIndexing();
            if (!this.settings.enableCurrentFileComplement) {
                this.statusBar.setCurrentFileDisabled();
                this.currentFileWordProvider.clearWords();
                this.showDebugLog(() => buildLogMessage("👢 Skip: Index current file tokens", performance.now() - start));
                return;
            }
            yield this.currentFileWordProvider.refreshWords(this.settings.onlyComplementEnglishOnCurrentFileComplement, this.currentFileMinNumberOfCharacters);
            this.statusBar.setCurrentFileIndexed(this.currentFileWordProvider.wordCount);
            this.showDebugLog(() => buildLogMessage("Index current file tokens", performance.now() - start));
        });
    }
    refreshCurrentVaultTokens() {
        return __awaiter(this, void 0, void 0, function* () {
            const start = performance.now();
            this.statusBar.setCurrentVaultIndexing();
            if (!this.settings.enableCurrentVaultComplement) {
                this.statusBar.setCurrentVaultDisabled();
                this.currentVaultWordProvider.clearWords();
                this.showDebugLog(() => buildLogMessage("👢 Skip: Index current vault tokens", performance.now() - start));
                return;
            }
            yield this.currentVaultWordProvider.refreshWords(this.currentVaultMinNumberOfCharacters);
            this.statusBar.setCurrentVaultIndexed(this.currentVaultWordProvider.wordCount);
            this.showDebugLog(() => buildLogMessage("Index current vault tokens", performance.now() - start));
        });
    }
    refreshCustomDictionaryTokens() {
        return __awaiter(this, void 0, void 0, function* () {
            const start = performance.now();
            this.statusBar.setCustomDictionaryIndexing();
            if (!this.settings.enableCustomDictionaryComplement) {
                this.statusBar.setCustomDictionaryDisabled();
                this.customDictionaryWordProvider.clearWords();
                this.showDebugLog(() => buildLogMessage("👢Skip: Index custom dictionary tokens", performance.now() - start));
                return;
            }
            yield this.customDictionaryWordProvider.refreshCustomWords({
                regexp: this.settings.customDictionaryWordRegexPattern,
                delimiterForHide: this.settings.delimiterToHideSuggestion || undefined,
                delimiterForDisplay: this.settings.delimiterToDivideSuggestionsForDisplayFromInsertion ||
                    undefined,
                caretSymbol: this.settings.caretLocationSymbolAfterComplement || undefined,
            });
            this.statusBar.setCustomDictionaryIndexed(this.customDictionaryWordProvider.wordCount);
            this.showDebugLog(() => buildLogMessage("Index custom dictionary tokens", performance.now() - start));
        });
    }
    refreshInternalLinkTokens() {
        const start = performance.now();
        this.statusBar.setInternalLinkIndexing();
        if (!this.settings.enableInternalLinkComplement) {
            this.statusBar.setInternalLinkDisabled();
            this.internalLinkWordProvider.clearWords();
            this.showDebugLog(() => buildLogMessage("👢Skip: Index internal link tokens", performance.now() - start));
            return;
        }
        this.internalLinkWordProvider.refreshWords(this.settings.suggestInternalLinkWithAlias, this.excludeInternalLinkPrefixPathPatterns);
        this.statusBar.setInternalLinkIndexed(this.internalLinkWordProvider.wordCount);
        this.showDebugLog(() => buildLogMessage("Index internal link tokens", performance.now() - start));
    }
    refreshFrontMatterTokens() {
        const start = performance.now();
        this.statusBar.setFrontMatterIndexing();
        if (!this.settings.enableFrontMatterComplement) {
            this.statusBar.setFrontMatterDisabled();
            this.frontMatterWordProvider.clearWords();
            this.showDebugLog(() => buildLogMessage("👢Skip: Index front matter tokens", performance.now() - start));
            return;
        }
        this.frontMatterWordProvider.refreshWords();
        this.statusBar.setFrontMatterIndexed(this.frontMatterWordProvider.wordCount);
        this.showDebugLog(() => buildLogMessage("Index front matter tokens", performance.now() - start));
    }
    updateFrontMatterTokenIndex(file) {
        const start = performance.now();
        if (!this.settings.enableFrontMatterComplement) {
            this.showDebugLog(() => buildLogMessage("👢Skip: Update front matter token index", performance.now() - start));
            return;
        }
        this.frontMatterWordProvider.updateWordIndex(file);
        this.showDebugLog(() => buildLogMessage("Update front matter token index", performance.now() - start));
    }
    updateFrontMatterToken() {
        const start = performance.now();
        if (!this.settings.enableFrontMatterComplement) {
            this.showDebugLog(() => buildLogMessage("👢Skip: Update front matter token", performance.now() - start));
            return;
        }
        this.frontMatterWordProvider.updateWords();
        this.statusBar.setFrontMatterIndexed(this.frontMatterWordProvider.wordCount);
        this.showDebugLog(() => buildLogMessage("Update front matter token", performance.now() - start));
    }
    onTrigger(cursor, editor, file) {
        var _a, _b, _c, _d, _e, _f;
        const start = performance.now();
        if (!this.settings.complementAutomatically &&
            !this.isOpen &&
            !this.runManually) {
            this.showDebugLog(() => "Don't show suggestions");
            return null;
        }
        if (this.settings.disableSuggestionsDuringImeOn &&
            this.appHelper.isIMEOn() &&
            !this.runManually) {
            this.showDebugLog(() => "Don't show suggestions for IME");
            return null;
        }
        const cl = this.appHelper.getCurrentLine(editor);
        if (this.previousCurrentLine === cl && !this.runManually) {
            this.previousCurrentLine = cl;
            this.showDebugLog(() => "Don't show suggestions because there are no changes");
            return null;
        }
        this.previousCurrentLine = cl;
        const currentLineUntilCursor = this.appHelper.getCurrentLineUntilCursor(editor);
        if (currentLineUntilCursor.startsWith("---")) {
            this.showDebugLog(() => "Don't show suggestions because it supposes front matter or horizontal line");
            return null;
        }
        if (currentLineUntilCursor.startsWith("~~~") ||
            currentLineUntilCursor.startsWith("```")) {
            this.showDebugLog(() => "Don't show suggestions because it supposes front code block");
            return null;
        }
        const tokens = this.tokenizer.tokenize(currentLineUntilCursor, true);
        this.showDebugLog(() => `[onTrigger] tokens is ${tokens}`);
        const tokenized = this.tokenizer.recursiveTokenize(currentLineUntilCursor);
        const currentTokens = tokenized.slice(tokenized.length > this.settings.maxNumberOfWordsAsPhrase
            ? tokenized.length - this.settings.maxNumberOfWordsAsPhrase
            : 0);
        this.showDebugLog(() => `[onTrigger] currentTokens is ${JSON.stringify(currentTokens)}`);
        const currentToken = (_a = currentTokens[0]) === null || _a === void 0 ? void 0 : _a.word;
        this.showDebugLog(() => `[onTrigger] currentToken is ${currentToken}`);
        if (!currentToken) {
            this.runManually = false;
            this.showDebugLog(() => `Don't show suggestions because currentToken is empty`);
            return null;
        }
        const currentTokenSeparatedWhiteSpace = (_b = currentLineUntilCursor.split(" ").last()) !== null && _b !== void 0 ? _b : "";
        if (new RegExp(`^[${this.settings.firstCharactersDisableSuggestions}]`).test(currentTokenSeparatedWhiteSpace)) {
            this.runManually = false;
            this.showDebugLog(() => `Don't show suggestions for avoiding to conflict with the other commands.`);
            return null;
        }
        if (currentToken.length === 1 &&
            Boolean(currentToken.match(this.tokenizer.getTrimPattern()))) {
            this.runManually = false;
            this.showDebugLog(() => `Don't show suggestions because currentToken is TRIM_PATTERN`);
            return null;
        }
        const currentFrontMatter = this.settings.enableFrontMatterComplement
            ? this.appHelper.getCurrentFrontMatter()
            : null;
        this.showDebugLog(() => `Current front matter is ${currentFrontMatter}`);
        if (!this.runManually && !currentFrontMatter) {
            if (currentToken.length < this.minNumberTriggered) {
                this.showDebugLog(() => "Don't show suggestions because currentToken is less than minNumberTriggered option");
                return null;
            }
            if (this.tokenizer.shouldIgnore(currentToken)) {
                this.showDebugLog(() => "Don't show suggestions because currentToken should ignored");
                return null;
            }
        }
        this.showDebugLog(() => buildLogMessage("onTrigger", performance.now() - start));
        this.runManually = false;
        // Hack implementation for Front matter complement
        if (currentFrontMatter && ((_c = currentTokens.last()) === null || _c === void 0 ? void 0 : _c.word.match(/[^ ] $/))) {
            currentTokens.push({ word: "", offset: currentLineUntilCursor.length });
        }
        // For multi-word completion
        this.contextStartCh = cursor.ch - currentToken.length;
        return {
            start: {
                ch: cursor.ch - ((_f = (_e = (_d = currentTokens.last()) === null || _d === void 0 ? void 0 : _d.word) === null || _e === void 0 ? void 0 : _e.length) !== null && _f !== void 0 ? _f : 0),
                line: cursor.line,
            },
            end: cursor,
            query: JSON.stringify({
                currentFrontMatter,
                queries: currentTokens.map((x) => (Object.assign(Object.assign({}, x), { offset: x.offset - currentTokens[0].offset }))),
            }),
        };
    }
    getSuggestions(context) {
        return new Promise((resolve) => {
            this.debounceGetSuggestions(context, (words) => {
                resolve(words);
            });
        });
    }
    renderSuggestion(word, el) {
        const base = createDiv();
        let text = word.value;
        if (word.type === "customDictionary" &&
            word.insertedText &&
            this.settings.displayedTextSuffix) {
            text += this.settings.displayedTextSuffix;
        }
        base.createDiv({
            text,
            cls: word.type === "internalLink" && word.aliasMeta
                ? "various-complements__suggestion-item__content__alias"
                : undefined,
        });
        const description = this.descriptionOnSuggestion.toDisplay(word);
        if (description) {
            base.createDiv({
                cls: "various-complements__suggestion-item__description",
                text: `${description}`,
            });
        }
        el.appendChild(base);
        el.addClass("various-complements__suggestion-item");
        switch (word.type) {
            case "currentFile":
                el.addClass("various-complements__suggestion-item__current-file");
                break;
            case "currentVault":
                el.addClass("various-complements__suggestion-item__current-vault");
                break;
            case "customDictionary":
                el.addClass("various-complements__suggestion-item__custom-dictionary");
                break;
            case "internalLink":
                el.addClass("various-complements__suggestion-item__internal-link");
                if (word.phantom) {
                    el.addClass("various-complements__suggestion-item__phantom");
                }
                break;
            case "frontMatter":
                el.addClass("various-complements__suggestion-item__front-matter");
                break;
        }
    }
    selectSuggestion(word, evt) {
        var _a, _b;
        if (!this.context) {
            return;
        }
        let insertedText = word.value;
        if (word.type === "internalLink") {
            insertedText =
                this.settings.suggestInternalLinkWithAlias && word.aliasMeta
                    ? `[[${this.appHelper.optimizeMarkdownLinkText(word.aliasMeta.origin)}|${word.value}]]`
                    : `[[${this.appHelper.optimizeMarkdownLinkText(word.value)}]]`;
        }
        if (word.type === "frontMatter" &&
            this.settings.insertCommaAfterFrontMatterCompletion) {
            insertedText = `${insertedText}, `;
        }
        else {
            if (this.settings.insertAfterCompletion &&
                !(word.type === "customDictionary" && word.ignoreSpaceAfterCompletion)) {
                insertedText = `${insertedText} `;
            }
        }
        let positionToMove = -1;
        if (word.type === "customDictionary") {
            if (word.insertedText) {
                insertedText = word.insertedText;
            }
            const caret = word.caretSymbol;
            if (caret) {
                positionToMove = insertedText.indexOf(caret);
                insertedText = insertedText.replace(caret, "");
            }
        }
        const editor = this.context.editor;
        editor.replaceRange(insertedText, Object.assign(Object.assign({}, this.context.start), { ch: this.contextStartCh + word.offset }), this.context.end);
        if (positionToMove !== -1) {
            editor.setCursor(editor.offsetToPos(editor.posToOffset(editor.getCursor()) -
                insertedText.length +
                positionToMove));
        }
        // The workaround of strange behavior for that cursor doesn't move after completion only if it doesn't input any word.
        if (this.appHelper.equalsAsEditorPostion(this.context.start, this.context.end)) {
            editor.setCursor(editor.offsetToPos(editor.posToOffset(editor.getCursor()) + insertedText.length));
        }
        (_a = this.selectionHistoryStorage) === null || _a === void 0 ? void 0 : _a.increment(word);
        if (this.settings.showLogAboutPerformanceInConsole) {
            console.log("--- history ---");
            console.log((_b = this.selectionHistoryStorage) === null || _b === void 0 ? void 0 : _b.data);
        }
        this.close();
        this.debounceClose();
    }
    showDebugLog(toMessage) {
        if (this.settings.showLogAboutPerformanceInConsole) {
            console.log(toMessage());
        }
    }
}

const DEFAULT_SETTINGS = {
    // general
    strategy: "default",
    matchStrategy: "prefix",
    maxNumberOfSuggestions: 5,
    maxNumberOfWordsAsPhrase: 3,
    minNumberOfCharactersTriggered: 0,
    minNumberOfWordsTriggeredPhrase: 1,
    complementAutomatically: true,
    delayMilliSeconds: 0,
    disableSuggestionsDuringImeOn: false,
    insertAfterCompletion: true,
    firstCharactersDisableSuggestions: ":/^",
    // appearance
    showMatchStrategy: true,
    showComplementAutomatically: true,
    showIndexingStatus: true,
    descriptionOnSuggestion: "Short",
    // key customization
    selectSuggestionKeys: "Enter",
    additionalCycleThroughSuggestionsKeys: "None",
    disableUpDownKeysForCycleThroughSuggestionsKeys: false,
    openSourceFileKey: "None",
    propagateEsc: false,
    // current file complement
    enableCurrentFileComplement: true,
    currentFileMinNumberOfCharacters: 0,
    onlyComplementEnglishOnCurrentFileComplement: false,
    // current vault complement
    enableCurrentVaultComplement: false,
    currentVaultMinNumberOfCharacters: 0,
    includeCurrentVaultPathPrefixPatterns: "",
    excludeCurrentVaultPathPrefixPatterns: "",
    includeCurrentVaultOnlyFilesUnderCurrentDirectory: false,
    // custom dictionary complement
    enableCustomDictionaryComplement: false,
    customDictionaryPaths: `https://raw.githubusercontent.com/first20hours/google-10000-english/master/google-10000-english-no-swears.txt`,
    columnDelimiter: "Tab",
    customDictionaryWordRegexPattern: "",
    delimiterToHideSuggestion: "",
    delimiterToDivideSuggestionsForDisplayFromInsertion: "",
    caretLocationSymbolAfterComplement: "",
    displayedTextSuffix: " => ...",
    // internal link complement
    enableInternalLinkComplement: true,
    suggestInternalLinkWithAlias: false,
    excludeInternalLinkPathPrefixPatterns: "",
    // front matter complement
    enableFrontMatterComplement: true,
    frontMatterComplementMatchStrategy: "inherit",
    insertCommaAfterFrontMatterCompletion: false,
    // debug
    showLogAboutPerformanceInConsole: false,
    // others
    selectionHistoryTree: {},
};
class VariousComplementsSettingTab extends obsidian.PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }
    display() {
        let { containerEl } = this;
        containerEl.empty();
        containerEl.createEl("h2", { text: "Various Complements - Settings" });
        this.addMainSettings(containerEl);
        this.addAppearanceSettings(containerEl);
        this.addKeyCustomizationSettings(containerEl);
        this.addCurrentFileComplementSettings(containerEl);
        this.addCurrentVaultComplementSettings(containerEl);
        this.addCustomDictionaryComplementSettings(containerEl);
        this.addInternalLinkComplementSettings(containerEl);
        this.addFrontMatterComplementSettings(containerEl);
        this.addDebugSettings(containerEl);
    }
    addMainSettings(containerEl) {
        containerEl.createEl("h3", { text: "Main" });
        new obsidian.Setting(containerEl).setName("Strategy").addDropdown((tc) => tc
            .addOptions(mirrorMap(TokenizeStrategy.values(), (x) => x.name))
            .setValue(this.plugin.settings.strategy)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            this.plugin.settings.strategy = value;
            this.display();
            yield this.plugin.saveSettings({
                currentFile: true,
                currentVault: true,
            });
        })));
        if (this.plugin.settings.strategy === TokenizeStrategy.CHINESE.name) {
            const el = containerEl.createEl("div", {
                cls: "various-complements__settings__warning",
            });
            el.createSpan({
                text: "⚠ You need to download `cedict_ts.u8` from",
            });
            el.createEl("a", {
                href: "https://www.mdbg.net/chinese/dictionary?page=cc-cedict",
                text: " the site ",
            });
            el.createSpan({
                text: "and store it in vault root.",
            });
        }
        new obsidian.Setting(containerEl).setName("Match strategy").addDropdown((tc) => tc
            .addOptions(mirrorMap(MatchStrategy.values(), (x) => x.name))
            .setValue(this.plugin.settings.matchStrategy)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            this.plugin.settings.matchStrategy = value;
            yield this.plugin.saveSettings();
            this.display();
        })));
        if (this.plugin.settings.matchStrategy === MatchStrategy.PARTIAL.name) {
            containerEl.createEl("div", {
                text: "⚠ `partial` is more than 10 times slower than `prefix`",
                cls: "various-complements__settings__warning",
            });
        }
        new obsidian.Setting(containerEl)
            .setName("Max number of suggestions")
            .addSlider((sc) => sc
            .setLimits(1, 255, 1)
            .setValue(this.plugin.settings.maxNumberOfSuggestions)
            .setDynamicTooltip()
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            this.plugin.settings.maxNumberOfSuggestions = value;
            yield this.plugin.saveSettings();
        })));
        new obsidian.Setting(containerEl)
            .setName("Max number of words as a phrase")
            .setDesc(`[⚠Warning] It makes slower more than N times (N is set value)`)
            .addSlider((sc) => sc
            .setLimits(1, 10, 1)
            .setValue(this.plugin.settings.maxNumberOfWordsAsPhrase)
            .setDynamicTooltip()
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            this.plugin.settings.maxNumberOfWordsAsPhrase = value;
            yield this.plugin.saveSettings();
        })));
        new obsidian.Setting(containerEl)
            .setName("Min number of characters for trigger")
            .setDesc("It uses a default value of Strategy if set 0.")
            .addSlider((sc) => sc
            .setLimits(0, 10, 1)
            .setValue(this.plugin.settings.minNumberOfCharactersTriggered)
            .setDynamicTooltip()
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            this.plugin.settings.minNumberOfCharactersTriggered = value;
            yield this.plugin.saveSettings();
        })));
        new obsidian.Setting(containerEl)
            .setName("Min number of words for trigger")
            .addSlider((sc) => sc
            .setLimits(1, 10, 1)
            .setValue(this.plugin.settings.minNumberOfWordsTriggeredPhrase)
            .setDynamicTooltip()
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            this.plugin.settings.minNumberOfWordsTriggeredPhrase = value;
            yield this.plugin.saveSettings();
        })));
        new obsidian.Setting(containerEl)
            .setName("Complement automatically")
            .addToggle((tc) => {
            tc.setValue(this.plugin.settings.complementAutomatically).onChange((value) => __awaiter(this, void 0, void 0, function* () {
                this.plugin.settings.complementAutomatically = value;
                yield this.plugin.saveSettings();
            }));
        });
        new obsidian.Setting(containerEl)
            .setName("Delay milli-seconds for trigger")
            .addSlider((sc) => sc
            .setLimits(0, 1000, 10)
            .setValue(this.plugin.settings.delayMilliSeconds)
            .setDynamicTooltip()
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            this.plugin.settings.delayMilliSeconds = value;
            yield this.plugin.saveSettings();
        })));
        new obsidian.Setting(containerEl)
            .setName("Disable suggestions during IME on")
            .addToggle((tc) => {
            tc.setValue(this.plugin.settings.disableSuggestionsDuringImeOn).onChange((value) => __awaiter(this, void 0, void 0, function* () {
                this.plugin.settings.disableSuggestionsDuringImeOn = value;
                yield this.plugin.saveSettings();
            }));
        });
        new obsidian.Setting(containerEl)
            .setName("Insert space after completion")
            .addToggle((tc) => {
            tc.setValue(this.plugin.settings.insertAfterCompletion).onChange((value) => __awaiter(this, void 0, void 0, function* () {
                this.plugin.settings.insertAfterCompletion = value;
                yield this.plugin.saveSettings();
            }));
        });
        new obsidian.Setting(containerEl)
            .setName("First characters to disable suggestions")
            .addText((cb) => {
            cb.setValue(this.plugin.settings.firstCharactersDisableSuggestions).onChange((value) => __awaiter(this, void 0, void 0, function* () {
                this.plugin.settings.firstCharactersDisableSuggestions = value;
                yield this.plugin.saveSettings();
            }));
        });
    }
    addAppearanceSettings(containerEl) {
        containerEl.createEl("h3", { text: "Appearance" });
        new obsidian.Setting(containerEl)
            .setName("Show Match strategy")
            .setDesc("Show Match strategy at the status bar. Changing this option requires a restart to take effect.")
            .addToggle((tc) => {
            tc.setValue(this.plugin.settings.showMatchStrategy).onChange((value) => __awaiter(this, void 0, void 0, function* () {
                this.plugin.settings.showMatchStrategy = value;
                yield this.plugin.saveSettings();
            }));
        });
        new obsidian.Setting(containerEl)
            .setName("Show Complement automatically")
            .setDesc("Show complement automatically at the status bar. Changing this option requires a restart to take effect.")
            .addToggle((tc) => {
            tc.setValue(this.plugin.settings.showComplementAutomatically).onChange((value) => __awaiter(this, void 0, void 0, function* () {
                this.plugin.settings.showComplementAutomatically = value;
                yield this.plugin.saveSettings();
            }));
        });
        new obsidian.Setting(containerEl)
            .setName("Show Indexing status")
            .setDesc("Show indexing status at the status bar. Changing this option requires a restart to take effect.")
            .addToggle((tc) => {
            tc.setValue(this.plugin.settings.showIndexingStatus).onChange((value) => __awaiter(this, void 0, void 0, function* () {
                this.plugin.settings.showIndexingStatus = value;
                yield this.plugin.saveSettings();
            }));
        });
        new obsidian.Setting(containerEl)
            .setName("Description on a suggestion")
            .addDropdown((tc) => tc
            .addOptions(mirrorMap(DescriptionOnSuggestion.values(), (x) => x.name))
            .setValue(this.plugin.settings.descriptionOnSuggestion)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            this.plugin.settings.descriptionOnSuggestion = value;
            yield this.plugin.saveSettings();
        })));
    }
    addKeyCustomizationSettings(containerEl) {
        containerEl.createEl("h3", { text: "Key customization" });
        new obsidian.Setting(containerEl)
            .setName("Select a suggestion key")
            .addDropdown((tc) => tc
            .addOptions(mirrorMap(SelectSuggestionKey.values(), (x) => x.name))
            .setValue(this.plugin.settings.selectSuggestionKeys)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            this.plugin.settings.selectSuggestionKeys = value;
            yield this.plugin.saveSettings();
        })));
        new obsidian.Setting(containerEl)
            .setName("Additional cycle through suggestions keys")
            .addDropdown((tc) => tc
            .addOptions(mirrorMap(CycleThroughSuggestionsKeys.values(), (x) => x.name))
            .setValue(this.plugin.settings.additionalCycleThroughSuggestionsKeys)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            this.plugin.settings.additionalCycleThroughSuggestionsKeys = value;
            yield this.plugin.saveSettings();
        })));
        new obsidian.Setting(containerEl)
            .setName("Disable the up/down keys for cycle through suggestions keys")
            .addToggle((tc) => {
            tc.setValue(this.plugin.settings.disableUpDownKeysForCycleThroughSuggestionsKeys).onChange((value) => __awaiter(this, void 0, void 0, function* () {
                this.plugin.settings.disableUpDownKeysForCycleThroughSuggestionsKeys =
                    value;
                yield this.plugin.saveSettings();
            }));
        });
        new obsidian.Setting(containerEl).setName("Open source file key").addDropdown((tc) => tc
            .addOptions(mirrorMap(OpenSourceFileKeys.values(), (x) => x.name))
            .setValue(this.plugin.settings.openSourceFileKey)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            this.plugin.settings.openSourceFileKey = value;
            yield this.plugin.saveSettings();
        })));
        new obsidian.Setting(containerEl)
            .setName("Propagate ESC")
            .setDesc("It is handy if you use Vim mode because you can switch to Normal mode by one ESC, whether it shows suggestions or not.")
            .addToggle((tc) => {
            tc.setValue(this.plugin.settings.propagateEsc).onChange((value) => __awaiter(this, void 0, void 0, function* () {
                this.plugin.settings.propagateEsc = value;
                yield this.plugin.saveSettings();
            }));
        });
    }
    addCurrentFileComplementSettings(containerEl) {
        containerEl.createEl("h3", {
            text: "Current file complement",
            cls: "various-complements__settings__header various-complements__settings__header__current-file",
        });
        new obsidian.Setting(containerEl)
            .setName("Enable Current file complement")
            .addToggle((tc) => {
            tc.setValue(this.plugin.settings.enableCurrentFileComplement).onChange((value) => __awaiter(this, void 0, void 0, function* () {
                this.plugin.settings.enableCurrentFileComplement = value;
                yield this.plugin.saveSettings({ currentFile: true });
                this.display();
            }));
        });
        if (this.plugin.settings.enableCurrentFileComplement) {
            new obsidian.Setting(containerEl)
                .setName("Min number of characters for indexing")
                .setDesc("It uses a default value of Strategy if set 0.")
                .addSlider((sc) => sc
                .setLimits(0, 15, 1)
                .setValue(this.plugin.settings.currentFileMinNumberOfCharacters)
                .setDynamicTooltip()
                .onChange((value) => __awaiter(this, void 0, void 0, function* () {
                this.plugin.settings.currentFileMinNumberOfCharacters = value;
                yield this.plugin.saveSettings({ currentFile: true });
            })));
            new obsidian.Setting(containerEl)
                .setName("Only complement English on current file complement")
                .addToggle((tc) => {
                tc.setValue(this.plugin.settings.onlyComplementEnglishOnCurrentFileComplement).onChange((value) => __awaiter(this, void 0, void 0, function* () {
                    this.plugin.settings.onlyComplementEnglishOnCurrentFileComplement =
                        value;
                    yield this.plugin.saveSettings({ currentFile: true });
                }));
            });
        }
    }
    addCurrentVaultComplementSettings(containerEl) {
        containerEl.createEl("h3", {
            text: "Current vault complement",
            cls: "various-complements__settings__header various-complements__settings__header__current-vault",
        });
        new obsidian.Setting(containerEl)
            .setName("Enable Current vault complement")
            .addToggle((tc) => {
            tc.setValue(this.plugin.settings.enableCurrentVaultComplement).onChange((value) => __awaiter(this, void 0, void 0, function* () {
                this.plugin.settings.enableCurrentVaultComplement = value;
                this.display();
                yield this.plugin.saveSettings({ currentVault: true });
            }));
        });
        if (this.plugin.settings.enableCurrentVaultComplement) {
            new obsidian.Setting(containerEl)
                .setName("Min number of characters for indexing")
                .setDesc("It uses a default value of Strategy if set 0.")
                .addSlider((sc) => sc
                .setLimits(0, 15, 1)
                .setValue(this.plugin.settings.currentVaultMinNumberOfCharacters)
                .setDynamicTooltip()
                .onChange((value) => __awaiter(this, void 0, void 0, function* () {
                this.plugin.settings.currentVaultMinNumberOfCharacters = value;
                yield this.plugin.saveSettings();
            })));
            new obsidian.Setting(containerEl)
                .setName("Include prefix path patterns")
                .setDesc("Prefix match path patterns to include files.")
                .addTextArea((tac) => {
                const el = tac
                    .setValue(this.plugin.settings.includeCurrentVaultPathPrefixPatterns)
                    .setPlaceholder("Private/")
                    .onChange((value) => __awaiter(this, void 0, void 0, function* () {
                    this.plugin.settings.includeCurrentVaultPathPrefixPatterns =
                        value;
                    yield this.plugin.saveSettings();
                }));
                el.inputEl.className =
                    "various-complements__settings__text-area-path";
                return el;
            });
            new obsidian.Setting(containerEl)
                .setName("Exclude prefix path patterns")
                .setDesc("Prefix match path patterns to exclude files.")
                .addTextArea((tac) => {
                const el = tac
                    .setValue(this.plugin.settings.excludeCurrentVaultPathPrefixPatterns)
                    .setPlaceholder("Private/")
                    .onChange((value) => __awaiter(this, void 0, void 0, function* () {
                    this.plugin.settings.excludeCurrentVaultPathPrefixPatterns =
                        value;
                    yield this.plugin.saveSettings();
                }));
                el.inputEl.className =
                    "various-complements__settings__text-area-path";
                return el;
            });
            new obsidian.Setting(containerEl)
                .setName("Include only files under current directory")
                .addToggle((tc) => {
                tc.setValue(this.plugin.settings
                    .includeCurrentVaultOnlyFilesUnderCurrentDirectory).onChange((value) => __awaiter(this, void 0, void 0, function* () {
                    this.plugin.settings.includeCurrentVaultOnlyFilesUnderCurrentDirectory =
                        value;
                    yield this.plugin.saveSettings();
                }));
            });
        }
    }
    addCustomDictionaryComplementSettings(containerEl) {
        containerEl.createEl("h3", {
            text: "Custom dictionary complement",
            cls: "various-complements__settings__header various-complements__settings__header__custom-dictionary",
        });
        new obsidian.Setting(containerEl)
            .setName("Enable Custom dictionary complement")
            .addToggle((tc) => {
            tc.setValue(this.plugin.settings.enableCustomDictionaryComplement).onChange((value) => __awaiter(this, void 0, void 0, function* () {
                this.plugin.settings.enableCustomDictionaryComplement = value;
                yield this.plugin.saveSettings({ customDictionary: true });
                this.display();
            }));
        });
        if (this.plugin.settings.enableCustomDictionaryComplement) {
            new obsidian.Setting(containerEl)
                .setName("Custom dictionary paths")
                .setDesc("Specify either a relative path from Vault root or URL for each line.")
                .addTextArea((tac) => {
                const el = tac
                    .setValue(this.plugin.settings.customDictionaryPaths)
                    .setPlaceholder("dictionary.md")
                    .onChange((value) => __awaiter(this, void 0, void 0, function* () {
                    this.plugin.settings.customDictionaryPaths = value;
                    yield this.plugin.saveSettings();
                }));
                el.inputEl.className =
                    "various-complements__settings__text-area-path";
                return el;
            });
            new obsidian.Setting(containerEl).setName("Column delimiter").addDropdown((tc) => tc
                .addOptions(mirrorMap(ColumnDelimiter.values(), (x) => x.name))
                .setValue(this.plugin.settings.columnDelimiter)
                .onChange((value) => __awaiter(this, void 0, void 0, function* () {
                this.plugin.settings.columnDelimiter = value;
                yield this.plugin.saveSettings();
            })));
            new obsidian.Setting(containerEl)
                .setName("Word regex pattern")
                .setDesc("Only load words that match the regular expression pattern.")
                .addText((cb) => {
                cb.setValue(this.plugin.settings.customDictionaryWordRegexPattern).onChange((value) => __awaiter(this, void 0, void 0, function* () {
                    this.plugin.settings.customDictionaryWordRegexPattern = value;
                    yield this.plugin.saveSettings();
                }));
            });
            new obsidian.Setting(containerEl)
                .setName("Delimiter to hide a suggestion")
                .setDesc("If set ';;;', 'abcd;;;efg' is shown as 'abcd' on suggestions, but completes to 'abcdefg'.")
                .addText((cb) => {
                cb.setValue(this.plugin.settings.delimiterToHideSuggestion).onChange((value) => __awaiter(this, void 0, void 0, function* () {
                    this.plugin.settings.delimiterToHideSuggestion = value;
                    yield this.plugin.saveSettings();
                }));
            });
            new obsidian.Setting(containerEl)
                .setName("Delimiter to divide suggestions for display from ones for insertion")
                .setDesc("If set ' >>> ', 'displayed >>> inserted' is shown as 'displayed' on suggestions, but completes to 'inserted'.")
                .addText((cb) => {
                cb.setValue(this.plugin.settings
                    .delimiterToDivideSuggestionsForDisplayFromInsertion).onChange((value) => __awaiter(this, void 0, void 0, function* () {
                    this.plugin.settings.delimiterToDivideSuggestionsForDisplayFromInsertion =
                        value;
                    yield this.plugin.saveSettings();
                }));
            });
            new obsidian.Setting(containerEl)
                .setName("Caret location symbol after complement")
                .setDesc("If set '<CARET>' and there is '<li><CARET></li>' in custom dictionary, it complements '<li></li>' and move a caret where between '<li>' and `</li>`.")
                .addText((cb) => {
                cb.setValue(this.plugin.settings.caretLocationSymbolAfterComplement).onChange((value) => __awaiter(this, void 0, void 0, function* () {
                    this.plugin.settings.caretLocationSymbolAfterComplement = value;
                    yield this.plugin.saveSettings();
                }));
            });
            new obsidian.Setting(containerEl)
                .setName("Displayed text suffix")
                .setDesc("It shows as a suffix of displayed text if there is a difference between displayed and inserted")
                .addText((cb) => {
                cb.setValue(this.plugin.settings.displayedTextSuffix).onChange((value) => __awaiter(this, void 0, void 0, function* () {
                    this.plugin.settings.displayedTextSuffix = value;
                    yield this.plugin.saveSettings();
                }));
            });
        }
    }
    addInternalLinkComplementSettings(containerEl) {
        containerEl.createEl("h3", {
            text: "Internal link complement",
            cls: "various-complements__settings__header various-complements__settings__header__internal-link",
        });
        new obsidian.Setting(containerEl)
            .setName("Enable Internal link complement")
            .addToggle((tc) => {
            tc.setValue(this.plugin.settings.enableInternalLinkComplement).onChange((value) => __awaiter(this, void 0, void 0, function* () {
                this.plugin.settings.enableInternalLinkComplement = value;
                yield this.plugin.saveSettings({ internalLink: true });
                this.display();
            }));
        });
        if (this.plugin.settings.enableInternalLinkComplement) {
            new obsidian.Setting(containerEl)
                .setName("Suggest with an alias")
                .addToggle((tc) => {
                tc.setValue(this.plugin.settings.suggestInternalLinkWithAlias).onChange((value) => __awaiter(this, void 0, void 0, function* () {
                    this.plugin.settings.suggestInternalLinkWithAlias = value;
                    yield this.plugin.saveSettings({ internalLink: true });
                }));
            });
            new obsidian.Setting(containerEl)
                .setName("Exclude prefix path patterns")
                .setDesc("Prefix match path patterns to exclude files.")
                .addTextArea((tac) => {
                const el = tac
                    .setValue(this.plugin.settings.excludeInternalLinkPathPrefixPatterns)
                    .setPlaceholder("Private/")
                    .onChange((value) => __awaiter(this, void 0, void 0, function* () {
                    this.plugin.settings.excludeInternalLinkPathPrefixPatterns =
                        value;
                    yield this.plugin.saveSettings();
                }));
                el.inputEl.className =
                    "various-complements__settings__text-area-path";
                return el;
            });
        }
    }
    addFrontMatterComplementSettings(containerEl) {
        containerEl.createEl("h3", {
            text: "Front matter complement",
            cls: "various-complements__settings__header various-complements__settings__header__front-matter",
        });
        new obsidian.Setting(containerEl)
            .setName("Enable Front matter complement")
            .addToggle((tc) => {
            tc.setValue(this.plugin.settings.enableFrontMatterComplement).onChange((value) => __awaiter(this, void 0, void 0, function* () {
                this.plugin.settings.enableFrontMatterComplement = value;
                yield this.plugin.saveSettings({ frontMatter: true });
                this.display();
            }));
        });
        if (this.plugin.settings.enableFrontMatterComplement) {
            new obsidian.Setting(containerEl)
                .setName("Match strategy in the front matter")
                .addDropdown((tc) => tc
                .addOptions(mirrorMap(SpecificMatchStrategy.values(), (x) => x.name))
                .setValue(this.plugin.settings.frontMatterComplementMatchStrategy)
                .onChange((value) => __awaiter(this, void 0, void 0, function* () {
                this.plugin.settings.frontMatterComplementMatchStrategy = value;
                yield this.plugin.saveSettings();
            })));
            new obsidian.Setting(containerEl)
                .setName("Insert comma after completion")
                .addToggle((tc) => {
                tc.setValue(this.plugin.settings.insertCommaAfterFrontMatterCompletion).onChange((value) => __awaiter(this, void 0, void 0, function* () {
                    this.plugin.settings.insertCommaAfterFrontMatterCompletion = value;
                    yield this.plugin.saveSettings();
                }));
            });
        }
    }
    addDebugSettings(containerEl) {
        containerEl.createEl("h3", { text: "Debug" });
        new obsidian.Setting(containerEl)
            .setName("Show log about performance in a console")
            .addToggle((tc) => {
            tc.setValue(this.plugin.settings.showLogAboutPerformanceInConsole).onChange((value) => __awaiter(this, void 0, void 0, function* () {
                this.plugin.settings.showLogAboutPerformanceInConsole = value;
                yield this.plugin.saveSettings();
            }));
        });
    }
    toggleMatchStrategy() {
        return __awaiter(this, void 0, void 0, function* () {
            switch (this.plugin.settings.matchStrategy) {
                case "prefix":
                    this.plugin.settings.matchStrategy = "partial";
                    break;
                case "partial":
                    this.plugin.settings.matchStrategy = "prefix";
                    break;
                default:
                    // noinspection ObjectAllocationIgnored
                    new obsidian.Notice("⚠Unexpected error");
            }
            yield this.plugin.saveSettings();
        });
    }
    toggleComplementAutomatically() {
        return __awaiter(this, void 0, void 0, function* () {
            this.plugin.settings.complementAutomatically =
                !this.plugin.settings.complementAutomatically;
            yield this.plugin.saveSettings();
        });
    }
    ensureCustomDictionaryPath(path, state) {
        return __awaiter(this, void 0, void 0, function* () {
            const paths = this.plugin.settings.customDictionaryPaths.split("\n");
            const exists = paths.some((x) => x === path);
            if ((exists && state === "present") || (!exists && state === "absent")) {
                return false;
            }
            const newPaths = state === "present" ? [...paths, path] : paths.filter((x) => x !== path);
            this.plugin.settings.customDictionaryPaths = newPaths.join("\n");
            yield this.plugin.saveSettings({ customDictionary: true });
            return true;
        });
    }
    getPluginSettingsAsJsonString() {
        return JSON.stringify({
            version: this.plugin.manifest.version,
            mobile: this.app.isMobile,
            settings: Object.assign(Object.assign({}, this.plugin.settings), { selectionHistoryTree: null }),
        }, null, 4);
    }
}

class ProviderStatusBar {
    constructor(currentFile, currentVault, customDictionary, internalLink, frontMatter, matchStrategy, complementAutomatically) {
        this.currentFile = currentFile;
        this.currentVault = currentVault;
        this.customDictionary = customDictionary;
        this.internalLink = internalLink;
        this.frontMatter = frontMatter;
        this.matchStrategy = matchStrategy;
        this.complementAutomatically = complementAutomatically;
    }
    static new(statusBar, showMatchStrategy, showIndexingStatus, showComplementAutomatically) {
        const currentFile = showIndexingStatus
            ? statusBar.createEl("span", {
                text: "---",
                cls: "various-complements__footer various-complements__footer__current-file",
            })
            : null;
        const currentVault = showIndexingStatus
            ? statusBar.createEl("span", {
                text: "---",
                cls: "various-complements__footer various-complements__footer__current-vault",
            })
            : null;
        const customDictionary = showIndexingStatus
            ? statusBar.createEl("span", {
                text: "---",
                cls: "various-complements__footer various-complements__footer__custom-dictionary",
            })
            : null;
        const internalLink = showIndexingStatus
            ? statusBar.createEl("span", {
                text: "---",
                cls: "various-complements__footer various-complements__footer__internal-link",
            })
            : null;
        const frontMatter = showIndexingStatus
            ? statusBar.createEl("span", {
                text: "---",
                cls: "various-complements__footer various-complements__footer__front-matter",
            })
            : null;
        const matchStrategy = showMatchStrategy
            ? statusBar.createEl("span", {
                text: "---",
                cls: "various-complements__footer various-complements__footer__match-strategy",
            })
            : null;
        console.log(showComplementAutomatically);
        const complementAutomatically = showComplementAutomatically
            ? statusBar.createEl("span", {
                text: "---",
                cls: "various-complements__footer various-complements__footer__complement-automatically",
            })
            : null;
        return new ProviderStatusBar(currentFile, currentVault, customDictionary, internalLink, frontMatter, matchStrategy, complementAutomatically);
    }
    setOnClickStrategyListener(listener) {
        var _a;
        (_a = this.matchStrategy) === null || _a === void 0 ? void 0 : _a.addEventListener("click", listener);
    }
    setOnClickComplementAutomatically(listener) {
        var _a;
        (_a = this.complementAutomatically) === null || _a === void 0 ? void 0 : _a.addEventListener("click", listener);
    }
    setCurrentFileDisabled() {
        var _a;
        (_a = this.currentFile) === null || _a === void 0 ? void 0 : _a.setText("---");
    }
    setCurrentVaultDisabled() {
        var _a;
        (_a = this.currentVault) === null || _a === void 0 ? void 0 : _a.setText("---");
    }
    setCustomDictionaryDisabled() {
        var _a;
        (_a = this.customDictionary) === null || _a === void 0 ? void 0 : _a.setText("---");
    }
    setInternalLinkDisabled() {
        var _a;
        (_a = this.internalLink) === null || _a === void 0 ? void 0 : _a.setText("---");
    }
    setFrontMatterDisabled() {
        var _a;
        (_a = this.frontMatter) === null || _a === void 0 ? void 0 : _a.setText("---");
    }
    setCurrentFileIndexing() {
        var _a;
        (_a = this.currentFile) === null || _a === void 0 ? void 0 : _a.setText("indexing...");
    }
    setCurrentVaultIndexing() {
        var _a;
        (_a = this.currentVault) === null || _a === void 0 ? void 0 : _a.setText("indexing...");
    }
    setCustomDictionaryIndexing() {
        var _a;
        (_a = this.customDictionary) === null || _a === void 0 ? void 0 : _a.setText("indexing...");
    }
    setInternalLinkIndexing() {
        var _a;
        (_a = this.internalLink) === null || _a === void 0 ? void 0 : _a.setText("indexing...");
    }
    setFrontMatterIndexing() {
        var _a;
        (_a = this.frontMatter) === null || _a === void 0 ? void 0 : _a.setText("indexing...");
    }
    setCurrentFileIndexed(count) {
        var _a;
        (_a = this.currentFile) === null || _a === void 0 ? void 0 : _a.setText(String(count));
    }
    setCurrentVaultIndexed(count) {
        var _a;
        (_a = this.currentVault) === null || _a === void 0 ? void 0 : _a.setText(String(count));
    }
    setCustomDictionaryIndexed(count) {
        var _a;
        (_a = this.customDictionary) === null || _a === void 0 ? void 0 : _a.setText(String(count));
    }
    setInternalLinkIndexed(count) {
        var _a;
        (_a = this.internalLink) === null || _a === void 0 ? void 0 : _a.setText(String(count));
    }
    setFrontMatterIndexed(count) {
        var _a;
        (_a = this.frontMatter) === null || _a === void 0 ? void 0 : _a.setText(String(count));
    }
    setMatchStrategy(strategy) {
        var _a;
        (_a = this.matchStrategy) === null || _a === void 0 ? void 0 : _a.setText(strategy.name);
    }
    setComplementAutomatically(automatically) {
        var _a;
        (_a = this.complementAutomatically) === null || _a === void 0 ? void 0 : _a.setText(automatically ? "auto" : "manual");
    }
}

function noop() { }
function assign(tar, src) {
    // @ts-ignore
    for (const k in src)
        tar[k] = src[k];
    return tar;
}
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
function create_slot(definition, ctx, $$scope, fn) {
    if (definition) {
        const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
        return definition[0](slot_ctx);
    }
}
function get_slot_context(definition, ctx, $$scope, fn) {
    return definition[1] && fn
        ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
        : $$scope.ctx;
}
function get_slot_changes(definition, $$scope, dirty, fn) {
    if (definition[2] && fn) {
        const lets = definition[2](fn(dirty));
        if ($$scope.dirty === undefined) {
            return lets;
        }
        if (typeof lets === 'object') {
            const merged = [];
            const len = Math.max($$scope.dirty.length, lets.length);
            for (let i = 0; i < len; i += 1) {
                merged[i] = $$scope.dirty[i] | lets[i];
            }
            return merged;
        }
        return $$scope.dirty | lets;
    }
    return $$scope.dirty;
}
function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
    if (slot_changes) {
        const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
        slot.p(slot_context, slot_changes);
    }
}
function get_all_dirty_from_scope($$scope) {
    if ($$scope.ctx.length > 32) {
        const dirty = [];
        const length = $$scope.ctx.length / 32;
        for (let i = 0; i < length; i++) {
            dirty[i] = -1;
        }
        return dirty;
    }
    return -1;
}
function exclude_internal_props(props) {
    const result = {};
    for (const k in props)
        if (k[0] !== '$')
            result[k] = props[k];
    return result;
}
function compute_rest_props(props, keys) {
    const rest = {};
    keys = new Set(keys);
    for (const k in props)
        if (!keys.has(k) && k[0] !== '$')
            rest[k] = props[k];
    return rest;
}
function null_to_empty(value) {
    return value == null ? '' : value;
}
function append(target, node) {
    target.appendChild(node);
}
function append_styles(target, style_sheet_id, styles) {
    const append_styles_to = get_root_for_style(target);
    if (!append_styles_to.getElementById(style_sheet_id)) {
        const style = element('style');
        style.id = style_sheet_id;
        style.textContent = styles;
        append_stylesheet(append_styles_to, style);
    }
}
function get_root_for_style(node) {
    if (!node)
        return document;
    const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
    if (root && root.host) {
        return root;
    }
    return node.ownerDocument;
}
function append_stylesheet(node, style) {
    append(node.head || node, style);
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
function set_svg_attributes(node, attributes) {
    for (const key in attributes) {
        attr(node, key, attributes[key]);
    }
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
function set_style(node, key, value, important) {
    if (value === null) {
        node.style.removeProperty(key);
    }
    else {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
}
function select_option(select, value) {
    for (let i = 0; i < select.options.length; i += 1) {
        const option = select.options[i];
        if (option.__value === value) {
            option.selected = true;
            return;
        }
    }
    select.selectedIndex = -1; // no option should be selected
}
function select_value(select) {
    const selected_option = select.querySelector(':checked') || select.options[0];
    return selected_option && selected_option.__value;
}
function toggle_class(element, name, toggle) {
    element.classList[toggle ? 'add' : 'remove'](name);
}
function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
    const e = document.createEvent('CustomEvent');
    e.initCustomEvent(type, bubbles, cancelable, detail);
    return e;
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
function createEventDispatcher() {
    const component = get_current_component();
    return (type, detail, { cancelable = false } = {}) => {
        const callbacks = component.$$.callbacks[type];
        if (callbacks) {
            // TODO are there situations where events could be dispatched
            // in a server (non-DOM) environment?
            const event = custom_event(type, detail, { cancelable });
            callbacks.slice().forEach(fn => {
                fn.call(component, event);
            });
            return !event.defaultPrevented;
        }
        return true;
    };
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
// flush() calls callbacks in this order:
// 1. All beforeUpdate callbacks, in order: parents before children
// 2. All bind:this callbacks, in reverse order: children before parents.
// 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
//    for afterUpdates called during the initial onMount, which are called in
//    reverse order: children before parents.
// Since callbacks might update component values, which could trigger another
// call to flush(), the following steps guard against this:
// 1. During beforeUpdate, any updated components will be added to the
//    dirty_components array and will cause a reentrant call to flush(). Because
//    the flush index is kept outside the function, the reentrant call will pick
//    up where the earlier call left off and go through all dirty components. The
//    current_component value is saved and restored so that the reentrant call will
//    not interfere with the "parent" flush() call.
// 2. bind:this callbacks cannot trigger new flush() calls.
// 3. During afterUpdate, any updated components will NOT have their afterUpdate
//    callback called a second time; the seen_callbacks set, outside the flush()
//    function, guarantees this behavior.
const seen_callbacks = new Set();
let flushidx = 0; // Do *not* move this inside the flush() function
function flush() {
    const saved_component = current_component;
    do {
        // first, call beforeUpdate functions
        // and update components
        while (flushidx < dirty_components.length) {
            const component = dirty_components[flushidx];
            flushidx++;
            set_current_component(component);
            update(component.$$);
        }
        set_current_component(null);
        dirty_components.length = 0;
        flushidx = 0;
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
    seen_callbacks.clear();
    set_current_component(saved_component);
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
const outroing = new Set();
let outros;
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

function get_spread_update(levels, updates) {
    const update = {};
    const to_null_out = {};
    const accounted_for = { $$scope: 1 };
    let i = levels.length;
    while (i--) {
        const o = levels[i];
        const n = updates[i];
        if (n) {
            for (const key in o) {
                if (!(key in n))
                    to_null_out[key] = 1;
            }
            for (const key in n) {
                if (!accounted_for[key]) {
                    update[key] = n[key];
                    accounted_for[key] = 1;
                }
            }
            levels[i] = n;
        }
        else {
            for (const key in o) {
                accounted_for[key] = 1;
            }
        }
    }
    for (const key in to_null_out) {
        if (!(key in update))
            update[key] = undefined;
    }
    return update;
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
function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
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
        context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
        // everything else
        callbacks: blank_object(),
        dirty,
        skip_bound: false,
        root: options.target || parent_component.$$.root
    };
    append_styles && append_styles($$.root);
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

/* src/ui/component/ObsidianButton.svelte generated by Svelte v3.48.0 */

function create_fragment$3(ctx) {
	let button;
	let current;
	let mounted;
	let dispose;
	const default_slot_template = /*#slots*/ ctx[4].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);

	return {
		c() {
			button = element("button");
			if (default_slot) default_slot.c();
			attr(button, "aria-label", /*popup*/ ctx[0]);
			button.disabled = /*disabled*/ ctx[1];
			toggle_class(button, "mod-cta", !/*disabled*/ ctx[1]);
		},
		m(target, anchor) {
			insert(target, button, anchor);

			if (default_slot) {
				default_slot.m(button, null);
			}

			current = true;

			if (!mounted) {
				dispose = listen(button, "click", /*handleClick*/ ctx[2]);
				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			if (default_slot) {
				if (default_slot.p && (!current || dirty & /*$$scope*/ 8)) {
					update_slot_base(
						default_slot,
						default_slot_template,
						ctx,
						/*$$scope*/ ctx[3],
						!current
						? get_all_dirty_from_scope(/*$$scope*/ ctx[3])
						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[3], dirty, null),
						null
					);
				}
			}

			if (!current || dirty & /*popup*/ 1) {
				attr(button, "aria-label", /*popup*/ ctx[0]);
			}

			if (!current || dirty & /*disabled*/ 2) {
				button.disabled = /*disabled*/ ctx[1];
			}

			if (dirty & /*disabled*/ 2) {
				toggle_class(button, "mod-cta", !/*disabled*/ ctx[1]);
			}
		},
		i(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(button);
			if (default_slot) default_slot.d(detaching);
			mounted = false;
			dispose();
		}
	};
}

function instance$3($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	let { popup } = $$props;
	let { disabled = false } = $$props;
	const dispatcher = createEventDispatcher();

	const handleClick = () => {
		dispatcher("click");
	};

	$$self.$$set = $$props => {
		if ('popup' in $$props) $$invalidate(0, popup = $$props.popup);
		if ('disabled' in $$props) $$invalidate(1, disabled = $$props.disabled);
		if ('$$scope' in $$props) $$invalidate(3, $$scope = $$props.$$scope);
	};

	return [popup, disabled, handleClick, $$scope, slots];
}

class ObsidianButton extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$3, create_fragment$3, safe_not_equal, { popup: 0, disabled: 1 });
	}
}

/* node_modules/svelte-lucide-icons/icons/File.svelte generated by Svelte v3.48.0 */

function create_fragment$2(ctx) {
	let svg;
	let path;
	let polyline;
	let current;
	const default_slot_template = /*#slots*/ ctx[3].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

	let svg_levels = [
		{ xmlns: "http://www.w3.org/2000/svg" },
		{ width: /*size*/ ctx[0] },
		{ height: /*size*/ ctx[0] },
		{ viewBox: "0 0 24 24" },
		{ fill: "none" },
		{ stroke: "currentColor" },
		{ "stroke-width": "2" },
		{ "stroke-linecap": "round" },
		{ "stroke-linejoin": "round" },
		/*$$restProps*/ ctx[1]
	];

	let svg_data = {};

	for (let i = 0; i < svg_levels.length; i += 1) {
		svg_data = assign(svg_data, svg_levels[i]);
	}

	return {
		c() {
			svg = svg_element("svg");
			if (default_slot) default_slot.c();
			path = svg_element("path");
			polyline = svg_element("polyline");
			attr(path, "d", "M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z");
			attr(polyline, "points", "14 2 14 8 20 8");
			set_svg_attributes(svg, svg_data);
		},
		m(target, anchor) {
			insert(target, svg, anchor);

			if (default_slot) {
				default_slot.m(svg, null);
			}

			append(svg, path);
			append(svg, polyline);
			current = true;
		},
		p(ctx, [dirty]) {
			if (default_slot) {
				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
					update_slot_base(
						default_slot,
						default_slot_template,
						ctx,
						/*$$scope*/ ctx[2],
						!current
						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
						null
					);
				}
			}

			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
				{ xmlns: "http://www.w3.org/2000/svg" },
				(!current || dirty & /*size*/ 1) && { width: /*size*/ ctx[0] },
				(!current || dirty & /*size*/ 1) && { height: /*size*/ ctx[0] },
				{ viewBox: "0 0 24 24" },
				{ fill: "none" },
				{ stroke: "currentColor" },
				{ "stroke-width": "2" },
				{ "stroke-linecap": "round" },
				{ "stroke-linejoin": "round" },
				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1]
			]));
		},
		i(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(svg);
			if (default_slot) default_slot.d(detaching);
		}
	};
}

function instance$2($$self, $$props, $$invalidate) {
	const omit_props_names = ["size"];
	let $$restProps = compute_rest_props($$props, omit_props_names);
	let { $$slots: slots = {}, $$scope } = $$props;
	let { size = 24 } = $$props;

	$$self.$$set = $$new_props => {
		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
		if ('size' in $$new_props) $$invalidate(0, size = $$new_props.size);
		if ('$$scope' in $$new_props) $$invalidate(2, $$scope = $$new_props.$$scope);
	};

	return [size, $$restProps, $$scope, slots];
}

class File extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$2, create_fragment$2, safe_not_equal, { size: 0 });
	}
}

/* src/ui/component/ObsidianIconButton.svelte generated by Svelte v3.48.0 */

function add_css(target) {
	append_styles(target, "svelte-12yh6aw", ".wrapper.svelte-12yh6aw{display:flex;justify-content:center;margin:0}.button-enabled.svelte-12yh6aw:hover{color:var(--interactive-accent)}.button-disabled.svelte-12yh6aw{color:var(--text-muted)}");
}

function create_fragment$1(ctx) {
	let div;
	let button;
	let button_class_value;
	let current;
	let mounted;
	let dispose;
	const default_slot_template = /*#slots*/ ctx[4].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);

	return {
		c() {
			div = element("div");
			button = element("button");
			if (default_slot) default_slot.c();
			attr(button, "aria-label", /*popup*/ ctx[0]);
			button.disabled = /*disabled*/ ctx[1];

			attr(button, "class", button_class_value = "" + (null_to_empty(/*disabled*/ ctx[1]
			? "button-disabled"
			: "button-enabled") + " svelte-12yh6aw"));

			set_style(button, "background-color", "transparent");
			set_style(button, "padding", "0");
			attr(div, "class", "wrapper svelte-12yh6aw");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, button);

			if (default_slot) {
				default_slot.m(button, null);
			}

			current = true;

			if (!mounted) {
				dispose = listen(button, "click", /*handleClick*/ ctx[2]);
				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			if (default_slot) {
				if (default_slot.p && (!current || dirty & /*$$scope*/ 8)) {
					update_slot_base(
						default_slot,
						default_slot_template,
						ctx,
						/*$$scope*/ ctx[3],
						!current
						? get_all_dirty_from_scope(/*$$scope*/ ctx[3])
						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[3], dirty, null),
						null
					);
				}
			}

			if (!current || dirty & /*popup*/ 1) {
				attr(button, "aria-label", /*popup*/ ctx[0]);
			}

			if (!current || dirty & /*disabled*/ 2) {
				button.disabled = /*disabled*/ ctx[1];
			}

			if (!current || dirty & /*disabled*/ 2 && button_class_value !== (button_class_value = "" + (null_to_empty(/*disabled*/ ctx[1]
			? "button-disabled"
			: "button-enabled") + " svelte-12yh6aw"))) {
				attr(button, "class", button_class_value);
			}
		},
		i(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(div);
			if (default_slot) default_slot.d(detaching);
			mounted = false;
			dispose();
		}
	};
}

function instance$1($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	let { popup } = $$props;
	let { disabled = false } = $$props;
	const dispatcher = createEventDispatcher();

	const handleClick = () => {
		if (!disabled) {
			dispatcher("click");
		}
	};

	$$self.$$set = $$props => {
		if ('popup' in $$props) $$invalidate(0, popup = $$props.popup);
		if ('disabled' in $$props) $$invalidate(1, disabled = $$props.disabled);
		if ('$$scope' in $$props) $$invalidate(3, $$scope = $$props.$$scope);
	};

	return [popup, disabled, handleClick, $$scope, slots];
}

class ObsidianIconButton extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$1, create_fragment$1, safe_not_equal, { popup: 0, disabled: 1 }, add_css);
	}
}

/* src/ui/component/CustomDictionaryWordAdd.svelte generated by Svelte v3.48.0 */

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[26] = list[i];
	return child_ctx;
}

// (48:6) {#each dictionaries as dictionary}
function create_each_block(ctx) {
	let option;
	let t0_value = /*dictionary*/ ctx[26].path + "";
	let t0;
	let t1;
	let option_value_value;

	return {
		c() {
			option = element("option");
			t0 = text(t0_value);
			t1 = space();
			option.__value = option_value_value = /*dictionary*/ ctx[26];
			option.value = option.__value;
		},
		m(target, anchor) {
			insert(target, option, anchor);
			append(option, t0);
			append(option, t1);
		},
		p(ctx, dirty) {
			if (dirty & /*dictionaries*/ 32 && t0_value !== (t0_value = /*dictionary*/ ctx[26].path + "")) set_data(t0, t0_value);

			if (dirty & /*dictionaries*/ 32 && option_value_value !== (option_value_value = /*dictionary*/ ctx[26])) {
				option.__value = option_value_value;
				option.value = option.__value;
			}
		},
		d(detaching) {
			if (detaching) detach(option);
		}
	};
}

// (54:4) <ObsidianIconButton       popup="Open the file"       on:click={() => onClickFileIcon(selectedDictionary.path)}     >
function create_default_slot_1(ctx) {
	let file;
	let current;
	file = new File({});

	return {
		c() {
			create_component(file.$$.fragment);
		},
		m(target, anchor) {
			mount_component(file, target, anchor);
			current = true;
		},
		i(local) {
			if (current) return;
			transition_in(file.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(file.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(file, detaching);
		}
	};
}

// (70:2) {#if enableDisplayedWord}
function create_if_block_1(ctx) {
	let label;
	let input;
	let t;
	let mounted;
	let dispose;

	return {
		c() {
			label = element("label");
			input = element("input");
			t = text("\n      Distinguish between display and insertion");
			attr(input, "type", "checkbox");
		},
		m(target, anchor) {
			insert(target, label, anchor);
			append(label, input);
			input.checked = /*useDisplayedWord*/ ctx[1];
			append(label, t);

			if (!mounted) {
				dispose = listen(input, "change", /*input_change_handler*/ ctx[21]);
				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty & /*useDisplayedWord*/ 2) {
				input.checked = /*useDisplayedWord*/ ctx[1];
			}
		},
		d(detaching) {
			if (detaching) detach(label);
			mounted = false;
			dispose();
		}
	};
}

// (77:2) {#if useDisplayedWord}
function create_if_block(ctx) {
	let h3;
	let t1;
	let textarea;
	let mounted;
	let dispose;

	return {
		c() {
			h3 = element("h3");
			h3.textContent = "Displayed Word";
			t1 = space();
			textarea = element("textarea");
			set_style(textarea, "width", "100%");
			attr(textarea, "rows", "3");
		},
		m(target, anchor) {
			insert(target, h3, anchor);
			insert(target, t1, anchor);
			insert(target, textarea, anchor);
			set_input_value(textarea, /*displayedWord*/ ctx[3]);
			/*textarea_binding*/ ctx[23](textarea);

			if (!mounted) {
				dispose = listen(textarea, "input", /*textarea_input_handler*/ ctx[22]);
				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty & /*displayedWord*/ 8) {
				set_input_value(textarea, /*displayedWord*/ ctx[3]);
			}
		},
		d(detaching) {
			if (detaching) detach(h3);
			if (detaching) detach(t1);
			if (detaching) detach(textarea);
			/*textarea_binding*/ ctx[23](null);
			mounted = false;
			dispose();
		}
	};
}

// (94:4) <ObsidianButton disabled={!enableSubmit} on:click={handleSubmit}       >
function create_default_slot(ctx) {
	let t;

	return {
		c() {
			t = text("Submit");
		},
		m(target, anchor) {
			insert(target, t, anchor);
		},
		d(detaching) {
			if (detaching) detach(t);
		}
	};
}

function create_fragment(ctx) {
	let div2;
	let h2;
	let t1;
	let h30;
	let t3;
	let div0;
	let select;
	let t4;
	let obsidianiconbutton;
	let t5;
	let h31;
	let t6;
	let t7;
	let textarea0;
	let t8;
	let t9;
	let t10;
	let h32;
	let t12;
	let input;
	let t13;
	let h33;
	let t15;
	let textarea1;
	let t16;
	let div1;
	let obsidianbutton;
	let current;
	let mounted;
	let dispose;
	let each_value = /*dictionaries*/ ctx[5];
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	obsidianiconbutton = new ObsidianIconButton({
			props: {
				popup: "Open the file",
				$$slots: { default: [create_default_slot_1] },
				$$scope: { ctx }
			}
		});

	obsidianiconbutton.$on("click", /*click_handler*/ ctx[18]);
	let if_block0 = /*enableDisplayedWord*/ ctx[11] && create_if_block_1(ctx);
	let if_block1 = /*useDisplayedWord*/ ctx[1] && create_if_block(ctx);

	obsidianbutton = new ObsidianButton({
			props: {
				disabled: !/*enableSubmit*/ ctx[12],
				$$slots: { default: [create_default_slot] },
				$$scope: { ctx }
			}
		});

	obsidianbutton.$on("click", /*handleSubmit*/ ctx[13]);

	return {
		c() {
			div2 = element("div");
			h2 = element("h2");
			h2.textContent = "Add a word to a custom dictionary";
			t1 = space();
			h30 = element("h3");
			h30.textContent = "Dictionary";
			t3 = space();
			div0 = element("div");
			select = element("select");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t4 = space();
			create_component(obsidianiconbutton.$$.fragment);
			t5 = space();
			h31 = element("h3");
			t6 = text(/*firstWordTitle*/ ctx[10]);
			t7 = space();
			textarea0 = element("textarea");
			t8 = space();
			if (if_block0) if_block0.c();
			t9 = space();
			if (if_block1) if_block1.c();
			t10 = space();
			h32 = element("h3");
			h32.textContent = "Description";
			t12 = space();
			input = element("input");
			t13 = space();
			h33 = element("h3");
			h33.textContent = "Aliases (for each line)";
			t15 = space();
			textarea1 = element("textarea");
			t16 = space();
			div1 = element("div");
			create_component(obsidianbutton.$$.fragment);
			attr(select, "class", "dropdown");
			if (/*selectedDictionary*/ ctx[2] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[17].call(select));
			set_style(div0, "display", "flex");
			set_style(div0, "gap", "10px");
			set_style(textarea0, "width", "100%");
			attr(textarea0, "rows", "3");
			attr(input, "type", "text");
			set_style(input, "width", "100%");
			set_style(textarea1, "width", "100%");
			attr(textarea1, "rows", "3");
			set_style(div1, "text-align", "center");
			set_style(div1, "width", "100%");
			set_style(div1, "padding-top", "15px");
		},
		m(target, anchor) {
			insert(target, div2, anchor);
			append(div2, h2);
			append(div2, t1);
			append(div2, h30);
			append(div2, t3);
			append(div2, div0);
			append(div0, select);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(select, null);
			}

			select_option(select, /*selectedDictionary*/ ctx[2]);
			append(div0, t4);
			mount_component(obsidianiconbutton, div0, null);
			append(div2, t5);
			append(div2, h31);
			append(h31, t6);
			append(div2, t7);
			append(div2, textarea0);
			set_input_value(textarea0, /*word*/ ctx[0]);
			/*textarea0_binding*/ ctx[20](textarea0);
			append(div2, t8);
			if (if_block0) if_block0.m(div2, null);
			append(div2, t9);
			if (if_block1) if_block1.m(div2, null);
			append(div2, t10);
			append(div2, h32);
			append(div2, t12);
			append(div2, input);
			set_input_value(input, /*description*/ ctx[4]);
			append(div2, t13);
			append(div2, h33);
			append(div2, t15);
			append(div2, textarea1);
			set_input_value(textarea1, /*aliasesStr*/ ctx[8]);
			append(div2, t16);
			append(div2, div1);
			mount_component(obsidianbutton, div1, null);
			current = true;

			if (!mounted) {
				dispose = [
					listen(select, "change", /*select_change_handler*/ ctx[17]),
					listen(textarea0, "input", /*textarea0_input_handler*/ ctx[19]),
					listen(input, "input", /*input_input_handler*/ ctx[24]),
					listen(textarea1, "input", /*textarea1_input_handler*/ ctx[25])
				];

				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			if (dirty & /*dictionaries*/ 32) {
				each_value = /*dictionaries*/ ctx[5];
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(select, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}

			if (dirty & /*selectedDictionary, dictionaries*/ 36) {
				select_option(select, /*selectedDictionary*/ ctx[2]);
			}

			const obsidianiconbutton_changes = {};

			if (dirty & /*$$scope*/ 536870912) {
				obsidianiconbutton_changes.$$scope = { dirty, ctx };
			}

			obsidianiconbutton.$set(obsidianiconbutton_changes);
			if (!current || dirty & /*firstWordTitle*/ 1024) set_data(t6, /*firstWordTitle*/ ctx[10]);

			if (dirty & /*word*/ 1) {
				set_input_value(textarea0, /*word*/ ctx[0]);
			}

			if (/*enableDisplayedWord*/ ctx[11]) {
				if (if_block0) {
					if_block0.p(ctx, dirty);
				} else {
					if_block0 = create_if_block_1(ctx);
					if_block0.c();
					if_block0.m(div2, t9);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			if (/*useDisplayedWord*/ ctx[1]) {
				if (if_block1) {
					if_block1.p(ctx, dirty);
				} else {
					if_block1 = create_if_block(ctx);
					if_block1.c();
					if_block1.m(div2, t10);
				}
			} else if (if_block1) {
				if_block1.d(1);
				if_block1 = null;
			}

			if (dirty & /*description*/ 16 && input.value !== /*description*/ ctx[4]) {
				set_input_value(input, /*description*/ ctx[4]);
			}

			if (dirty & /*aliasesStr*/ 256) {
				set_input_value(textarea1, /*aliasesStr*/ ctx[8]);
			}

			const obsidianbutton_changes = {};
			if (dirty & /*enableSubmit*/ 4096) obsidianbutton_changes.disabled = !/*enableSubmit*/ ctx[12];

			if (dirty & /*$$scope*/ 536870912) {
				obsidianbutton_changes.$$scope = { dirty, ctx };
			}

			obsidianbutton.$set(obsidianbutton_changes);
		},
		i(local) {
			if (current) return;
			transition_in(obsidianiconbutton.$$.fragment, local);
			transition_in(obsidianbutton.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(obsidianiconbutton.$$.fragment, local);
			transition_out(obsidianbutton.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(div2);
			destroy_each(each_blocks, detaching);
			destroy_component(obsidianiconbutton);
			/*textarea0_binding*/ ctx[20](null);
			if (if_block0) if_block0.d();
			if (if_block1) if_block1.d();
			destroy_component(obsidianbutton);
			mounted = false;
			run_all(dispose);
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	let enableSubmit;
	let enableDisplayedWord;
	let firstWordTitle;
	let { dictionaries } = $$props;
	let { selectedDictionary } = $$props;
	let { word = "" } = $$props;
	let { useDisplayedWord = false } = $$props;
	let { displayedWord = "" } = $$props;
	let { description = "" } = $$props;
	let { aliases = [] } = $$props;
	let { dividerForDisplay = "" } = $$props;
	let { onSubmit } = $$props;
	let { onClickFileIcon } = $$props;
	let aliasesStr = aliases.join("\n");
	let wordRef = null;
	let displayedWordRef = null;

	const handleSubmit = () => {
		onSubmit(selectedDictionary.path, {
			value: displayedWord || word,
			description,
			aliases: aliasesStr.split("\n"),
			type: "customDictionary",
			createdPath: selectedDictionary.path,
			insertedText: displayedWord ? word : undefined
		});
	};

	onMount(() => {
		setTimeout(() => wordRef.focus(), 50);
	});

	function select_change_handler() {
		selectedDictionary = select_value(this);
		$$invalidate(2, selectedDictionary);
		$$invalidate(5, dictionaries);
	}

	const click_handler = () => onClickFileIcon(selectedDictionary.path);

	function textarea0_input_handler() {
		word = this.value;
		$$invalidate(0, word);
	}

	function textarea0_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			wordRef = $$value;
			$$invalidate(9, wordRef);
		});
	}

	function input_change_handler() {
		useDisplayedWord = this.checked;
		$$invalidate(1, useDisplayedWord);
	}

	function textarea_input_handler() {
		displayedWord = this.value;
		$$invalidate(3, displayedWord);
	}

	function textarea_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			displayedWordRef = $$value;
			$$invalidate(7, displayedWordRef);
		});
	}

	function input_input_handler() {
		description = this.value;
		$$invalidate(4, description);
	}

	function textarea1_input_handler() {
		aliasesStr = this.value;
		$$invalidate(8, aliasesStr);
	}

	$$self.$$set = $$props => {
		if ('dictionaries' in $$props) $$invalidate(5, dictionaries = $$props.dictionaries);
		if ('selectedDictionary' in $$props) $$invalidate(2, selectedDictionary = $$props.selectedDictionary);
		if ('word' in $$props) $$invalidate(0, word = $$props.word);
		if ('useDisplayedWord' in $$props) $$invalidate(1, useDisplayedWord = $$props.useDisplayedWord);
		if ('displayedWord' in $$props) $$invalidate(3, displayedWord = $$props.displayedWord);
		if ('description' in $$props) $$invalidate(4, description = $$props.description);
		if ('aliases' in $$props) $$invalidate(14, aliases = $$props.aliases);
		if ('dividerForDisplay' in $$props) $$invalidate(15, dividerForDisplay = $$props.dividerForDisplay);
		if ('onSubmit' in $$props) $$invalidate(16, onSubmit = $$props.onSubmit);
		if ('onClickFileIcon' in $$props) $$invalidate(6, onClickFileIcon = $$props.onClickFileIcon);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*word*/ 1) {
			$$invalidate(12, enableSubmit = word.length > 0);
		}

		if ($$self.$$.dirty & /*dividerForDisplay*/ 32768) {
			$$invalidate(11, enableDisplayedWord = Boolean(dividerForDisplay));
		}

		if ($$self.$$.dirty & /*useDisplayedWord*/ 2) {
			$$invalidate(10, firstWordTitle = useDisplayedWord ? "Inserted word" : "Word");
		}

		if ($$self.$$.dirty & /*useDisplayedWord, displayedWordRef*/ 130) {
			{
				if (useDisplayedWord) {
					displayedWordRef === null || displayedWordRef === void 0
					? void 0
					: displayedWordRef.focus();
				}
			}
		}
	};

	return [
		word,
		useDisplayedWord,
		selectedDictionary,
		displayedWord,
		description,
		dictionaries,
		onClickFileIcon,
		displayedWordRef,
		aliasesStr,
		wordRef,
		firstWordTitle,
		enableDisplayedWord,
		enableSubmit,
		handleSubmit,
		aliases,
		dividerForDisplay,
		onSubmit,
		select_change_handler,
		click_handler,
		textarea0_input_handler,
		textarea0_binding,
		input_change_handler,
		textarea_input_handler,
		textarea_binding,
		input_input_handler,
		textarea1_input_handler
	];
}

class CustomDictionaryWordAdd extends SvelteComponent {
	constructor(options) {
		super();

		init(this, options, instance, create_fragment, safe_not_equal, {
			dictionaries: 5,
			selectedDictionary: 2,
			word: 0,
			useDisplayedWord: 1,
			displayedWord: 3,
			description: 4,
			aliases: 14,
			dividerForDisplay: 15,
			onSubmit: 16,
			onClickFileIcon: 6
		});
	}
}

class CustomDictionaryWordAddModal extends obsidian.Modal {
    constructor(app, dictionaryPaths, initialValue = "", dividerForDisplay = "", onSubmit) {
        super(app);
        const appHelper = new AppHelper(app);
        const dictionaries = dictionaryPaths.map((x) => ({ id: x, path: x }));
        const { contentEl } = this;
        this.component = new CustomDictionaryWordAdd({
            target: contentEl,
            props: {
                dictionaries,
                selectedDictionary: dictionaries[0],
                word: initialValue,
                dividerForDisplay,
                onSubmit: onSubmit,
                onClickFileIcon: (dictionaryPath) => {
                    const markdownFile = appHelper.getMarkdownFileByPath(dictionaryPath);
                    if (!markdownFile) {
                        // noinspection ObjectAllocationIgnored
                        new obsidian.Notice(`Can't open ${dictionaryPath}`);
                        return;
                    }
                    this.close();
                    appHelper.openMarkdownFile(markdownFile, true);
                },
            },
        });
    }
    onClose() {
        super.onClose();
        this.component.$destroy();
    }
}

class VariousComponents extends obsidian.Plugin {
    onunload() {
        super.onunload();
        this.suggester.unregister();
    }
    onload() {
        return __awaiter(this, void 0, void 0, function* () {
            this.appHelper = new AppHelper(this.app);
            this.registerEvent(this.app.workspace.on("editor-menu", (menu) => {
                if (!this.appHelper.getSelection()) {
                    return;
                }
                menu.addItem((item) => item
                    .setTitle("Add to custom dictionary")
                    .setIcon("stacked-levels")
                    .onClick(() => {
                    this.addWordToCustomDictionary();
                }));
            }));
            yield this.loadSettings();
            this.settingTab = new VariousComplementsSettingTab(this.app, this);
            this.addSettingTab(this.settingTab);
            this.statusBar = ProviderStatusBar.new(this.addStatusBarItem(), this.settings.showMatchStrategy, this.settings.showIndexingStatus, this.settings.showComplementAutomatically);
            this.statusBar.setOnClickStrategyListener(() => __awaiter(this, void 0, void 0, function* () {
                yield this.settingTab.toggleMatchStrategy();
            }));
            this.statusBar.setOnClickComplementAutomatically(() => __awaiter(this, void 0, void 0, function* () {
                yield this.settingTab.toggleComplementAutomatically();
            }));
            const debouncedSaveData = obsidian.debounce(() => __awaiter(this, void 0, void 0, function* () {
                yield this.saveData(this.settings);
            }), 5000);
            this.suggester = yield AutoCompleteSuggest.new(this.app, this.settings, this.statusBar, debouncedSaveData);
            this.registerEditorSuggest(this.suggester);
            this.addCommand({
                id: "reload-custom-dictionaries",
                name: "Reload custom dictionaries",
                hotkeys: [{ modifiers: ["Mod", "Shift"], key: "r" }],
                callback: () => __awaiter(this, void 0, void 0, function* () {
                    yield this.suggester.refreshCustomDictionaryTokens();
                }),
            });
            this.addCommand({
                id: "reload-current-vault",
                name: "Reload current vault",
                callback: () => __awaiter(this, void 0, void 0, function* () {
                    yield this.suggester.refreshCurrentVaultTokens();
                }),
            });
            this.addCommand({
                id: "toggle-match-strategy",
                name: "Toggle Match strategy",
                callback: () => __awaiter(this, void 0, void 0, function* () {
                    yield this.settingTab.toggleMatchStrategy();
                }),
            });
            this.addCommand({
                id: "toggle-complement-automatically",
                name: "Toggle Complement automatically",
                callback: () => __awaiter(this, void 0, void 0, function* () {
                    yield this.settingTab.toggleComplementAutomatically();
                }),
            });
            this.addCommand({
                id: "show-suggestions",
                name: "Show suggestions",
                hotkeys: [{ modifiers: ["Mod"], key: " " }],
                callback: () => __awaiter(this, void 0, void 0, function* () {
                    this.suggester.triggerComplete();
                }),
            });
            this.addCommand({
                id: "add-word-custom-dictionary",
                name: "Add a word to a custom dictionary",
                hotkeys: [{ modifiers: ["Mod", "Shift"], key: " " }],
                callback: () => __awaiter(this, void 0, void 0, function* () {
                    this.addWordToCustomDictionary();
                }),
            });
            this.addCommand({
                id: "predictable-complements",
                name: "Predictable complement",
                callback: () => __awaiter(this, void 0, void 0, function* () {
                    this.suggester.predictableComplete();
                }),
            });
            this.addCommand({
                id: "copy-plugin-settings",
                name: "Copy plugin settings",
                callback: () => __awaiter(this, void 0, void 0, function* () {
                    yield navigator.clipboard.writeText(this.settingTab.getPluginSettingsAsJsonString());
                    // noinspection ObjectAllocationIgnored
                    new obsidian.Notice("Copy settings of Various Complements");
                }),
            });
        });
    }
    loadSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            this.settings = Object.assign(Object.assign({}, DEFAULT_SETTINGS), (yield this.loadData()));
        });
    }
    saveSettings(needUpdateTokens = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.saveData(this.settings);
            yield this.suggester.updateSettings(this.settings);
            if (needUpdateTokens.currentFile) {
                yield this.suggester.refreshCurrentFileTokens();
            }
            if (needUpdateTokens.currentVault) {
                yield this.suggester.refreshCurrentVaultTokens();
            }
            if (needUpdateTokens.customDictionary) {
                yield this.suggester.refreshCustomDictionaryTokens();
            }
            if (needUpdateTokens.internalLink) {
                yield this.suggester.refreshInternalLinkTokens();
            }
            if (needUpdateTokens.frontMatter) {
                yield this.suggester.refreshFrontMatterTokens();
            }
        });
    }
    addWordToCustomDictionary() {
        const selectedWord = this.appHelper.getSelection();
        const provider = this.suggester.customDictionaryWordProvider;
        const modal = new CustomDictionaryWordAddModal(this.app, provider.editablePaths, selectedWord, this.settings.delimiterToDivideSuggestionsForDisplayFromInsertion, (dictionaryPath, word) => __awaiter(this, void 0, void 0, function* () {
            if (provider.wordByValue[word.value]) {
                // noinspection ObjectAllocationIgnored
                new obsidian.Notice(`⚠ ${word.value} already exists`, 0);
                return;
            }
            yield provider.addWordWithDictionary(word, dictionaryPath);
            // noinspection ObjectAllocationIgnored
            new obsidian.Notice(`Added ${word.value}`);
            modal.close();
        }));
        modal.open();
    }
}

module.exports = VariousComponents;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsInNyYy91dGlsL3N0cmluZ3MudHMiLCJzcmMvdG9rZW5pemVyL3Rva2VuaXplcnMvRGVmYXVsdFRva2VuaXplci50cyIsInNyYy90b2tlbml6ZXIvdG9rZW5pemVycy9BcmFiaWNUb2tlbml6ZXIudHMiLCJzcmMvZXh0ZXJuYWwvdGlueS1zZWdtZW50ZXIudHMiLCJzcmMvdG9rZW5pemVyL3Rva2VuaXplcnMvSmFwYW5lc2VUb2tlbml6ZXIudHMiLCJzcmMvdG9rZW5pemVyL3Rva2VuaXplcnMvRW5nbGlzaE9ubHlUb2tlbml6ZXIudHMiLCJub2RlX21vZHVsZXMvcHJldHRpZnktcGlueWluL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2NoaW5lc2UtdG9rZW5pemVyL3NyYy90cmllLmpzIiwibm9kZV9tb2R1bGVzL2NoaW5lc2UtdG9rZW5pemVyL3NyYy9jZWRpY3QuanMiLCJub2RlX21vZHVsZXMvY2hpbmVzZS10b2tlbml6ZXIvc3JjL21haW4uanMiLCJzcmMvdG9rZW5pemVyL3Rva2VuaXplcnMvQ2hpbmVzZVRva2VuaXplci50cyIsInNyYy90b2tlbml6ZXIvdG9rZW5pemVyLnRzIiwic3JjL3Rva2VuaXplci9Ub2tlbml6ZVN0cmF0ZWd5LnRzIiwic3JjL2FwcC1oZWxwZXIudHMiLCJzcmMvdXRpbC9jb2xsZWN0aW9uLWhlbHBlci50cyIsInNyYy9tb2RlbC9Xb3JkLnRzIiwic3JjL3Byb3ZpZGVyL3N1Z2dlc3Rlci50cyIsInNyYy91dGlsL3BhdGgudHMiLCJzcmMvcHJvdmlkZXIvQ3VzdG9tRGljdGlvbmFyeVdvcmRQcm92aWRlci50cyIsInNyYy9wcm92aWRlci9DdXJyZW50RmlsZVdvcmRQcm92aWRlci50cyIsInNyYy9wcm92aWRlci9JbnRlcm5hbExpbmtXb3JkUHJvdmlkZXIudHMiLCJzcmMvcHJvdmlkZXIvTWF0Y2hTdHJhdGVneS50cyIsInNyYy9vcHRpb24vQ3ljbGVUaHJvdWdoU3VnZ2VzdGlvbnNLZXlzLnRzIiwic3JjL29wdGlvbi9Db2x1bW5EZWxpbWl0ZXIudHMiLCJzcmMvb3B0aW9uL1NlbGVjdFN1Z2dlc3Rpb25LZXkudHMiLCJzcmMvcHJvdmlkZXIvQ3VycmVudFZhdWx0V29yZFByb3ZpZGVyLnRzIiwic3JjL29wdGlvbi9PcGVuU291cmNlRmlsZUtleXMudHMiLCJzcmMvb3B0aW9uL0Rlc2NyaXB0aW9uT25TdWdnZXN0aW9uLnRzIiwic3JjL3Byb3ZpZGVyL0Zyb250TWF0dGVyV29yZFByb3ZpZGVyLnRzIiwic3JjL3Byb3ZpZGVyL1NwZWNpZmljTWF0Y2hTdHJhdGVneS50cyIsInNyYy9zdG9yYWdlL1NlbGVjdGlvbkhpc3RvcnlTdG9yYWdlLnRzIiwic3JjL3VpL0F1dG9Db21wbGV0ZVN1Z2dlc3QudHMiLCJzcmMvc2V0dGluZy9zZXR0aW5ncy50cyIsInNyYy91aS9Qcm92aWRlclN0YXR1c0Jhci50cyIsIm5vZGVfbW9kdWxlcy9zdmVsdGUvaW50ZXJuYWwvaW5kZXgubWpzIiwic3JjL3VpL2NvbXBvbmVudC9PYnNpZGlhbkJ1dHRvbi5zdmVsdGUiLCJub2RlX21vZHVsZXMvc3ZlbHRlLWx1Y2lkZS1pY29ucy9pY29ucy9GaWxlLnN2ZWx0ZSIsInNyYy91aS9jb21wb25lbnQvT2JzaWRpYW5JY29uQnV0dG9uLnN2ZWx0ZSIsInNyYy91aS9jb21wb25lbnQvQ3VzdG9tRGljdGlvbmFyeVdvcmRBZGQuc3ZlbHRlIiwic3JjL3VpL0N1c3RvbURpY3Rpb25hcnlXb3JkQWRkTW9kYWwudHMiLCJzcmMvbWFpbi50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbkNvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLlxyXG5cclxuUGVybWlzc2lvbiB0byB1c2UsIGNvcHksIG1vZGlmeSwgYW5kL29yIGRpc3RyaWJ1dGUgdGhpcyBzb2Z0d2FyZSBmb3IgYW55XHJcbnB1cnBvc2Ugd2l0aCBvciB3aXRob3V0IGZlZSBpcyBoZXJlYnkgZ3JhbnRlZC5cclxuXHJcblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIgQU5EIFRIRSBBVVRIT1IgRElTQ0xBSU1TIEFMTCBXQVJSQU5USUVTIFdJVEhcclxuUkVHQVJEIFRPIFRISVMgU09GVFdBUkUgSU5DTFVESU5HIEFMTCBJTVBMSUVEIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZXHJcbkFORCBGSVRORVNTLiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SIEJFIExJQUJMRSBGT1IgQU5ZIFNQRUNJQUwsIERJUkVDVCxcclxuSU5ESVJFQ1QsIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFUyBPUiBBTlkgREFNQUdFUyBXSEFUU09FVkVSIFJFU1VMVElORyBGUk9NXHJcbkxPU1MgT0YgVVNFLCBEQVRBIE9SIFBST0ZJVFMsIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBORUdMSUdFTkNFIE9SXHJcbk9USEVSIFRPUlRJT1VTIEFDVElPTiwgQVJJU0lORyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBVU0UgT1JcclxuUEVSRk9STUFOQ0UgT0YgVEhJUyBTT0ZUV0FSRS5cclxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cclxuLyogZ2xvYmFsIFJlZmxlY3QsIFByb21pc2UgKi9cclxuXHJcbnZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24oZCwgYikge1xyXG4gICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYiwgcCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHRlbmRzKGQsIGIpIHtcclxuICAgIGlmICh0eXBlb2YgYiAhPT0gXCJmdW5jdGlvblwiICYmIGIgIT09IG51bGwpXHJcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNsYXNzIGV4dGVuZHMgdmFsdWUgXCIgKyBTdHJpbmcoYikgKyBcIiBpcyBub3QgYSBjb25zdHJ1Y3RvciBvciBudWxsXCIpO1xyXG4gICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG59XHJcblxyXG5leHBvcnQgdmFyIF9fYXNzaWduID0gZnVuY3Rpb24oKSB7XHJcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gX19hc3NpZ24odCkge1xyXG4gICAgICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpIHRbcF0gPSBzW3BdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdDtcclxuICAgIH1cclxuICAgIHJldHVybiBfX2Fzc2lnbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZXN0KHMsIGUpIHtcclxuICAgIHZhciB0ID0ge307XHJcbiAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkgJiYgZS5pbmRleE9mKHApIDwgMClcclxuICAgICAgICB0W3BdID0gc1twXTtcclxuICAgIGlmIChzICE9IG51bGwgJiYgdHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPT09IFwiZnVuY3Rpb25cIilcclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgcCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMocyk7IGkgPCBwLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChlLmluZGV4T2YocFtpXSkgPCAwICYmIE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGUuY2FsbChzLCBwW2ldKSlcclxuICAgICAgICAgICAgICAgIHRbcFtpXV0gPSBzW3BbaV1dO1xyXG4gICAgICAgIH1cclxuICAgIHJldHVybiB0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xyXG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XHJcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xyXG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcGFyYW0ocGFyYW1JbmRleCwgZGVjb3JhdG9yKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwga2V5KSB7IGRlY29yYXRvcih0YXJnZXQsIGtleSwgcGFyYW1JbmRleCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpIHtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5tZXRhZGF0YSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gUmVmbGVjdC5tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0ZXIodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19nZW5lcmF0b3IodGhpc0FyZywgYm9keSkge1xyXG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZztcclxuICAgIHJldHVybiBnID0geyBuZXh0OiB2ZXJiKDApLCBcInRocm93XCI6IHZlcmIoMSksIFwicmV0dXJuXCI6IHZlcmIoMikgfSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XHJcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xyXG4gICAgICAgIHdoaWxlIChfKSB0cnkge1xyXG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5W1wicmV0dXJuXCJdIDogb3BbMF0gPyB5W1widGhyb3dcIl0gfHwgKCh0ID0geVtcInJldHVyblwiXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XHJcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbb3BbMF0gJiAyLCB0LnZhbHVlXTtcclxuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xyXG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XHJcbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgX19jcmVhdGVCaW5kaW5nID0gT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xyXG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcclxuICAgIHZhciBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihtLCBrKTtcclxuICAgIGlmICghZGVzYyB8fCAoXCJnZXRcIiBpbiBkZXNjID8gIW0uX19lc01vZHVsZSA6IGRlc2Mud3JpdGFibGUgfHwgZGVzYy5jb25maWd1cmFibGUpKSB7XHJcbiAgICAgICAgZGVzYyA9IHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG1ba107IH0gfTtcclxuICAgIH1cclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBrMiwgZGVzYyk7XHJcbn0pIDogKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XHJcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xyXG4gICAgb1trMl0gPSBtW2tdO1xyXG59KTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4cG9ydFN0YXIobSwgbykge1xyXG4gICAgZm9yICh2YXIgcCBpbiBtKSBpZiAocCAhPT0gXCJkZWZhdWx0XCIgJiYgIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvLCBwKSkgX19jcmVhdGVCaW5kaW5nKG8sIG0sIHApO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX192YWx1ZXMobykge1xyXG4gICAgdmFyIHMgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgU3ltYm9sLml0ZXJhdG9yLCBtID0gcyAmJiBvW3NdLCBpID0gMDtcclxuICAgIGlmIChtKSByZXR1cm4gbS5jYWxsKG8pO1xyXG4gICAgaWYgKG8gJiYgdHlwZW9mIG8ubGVuZ3RoID09PSBcIm51bWJlclwiKSByZXR1cm4ge1xyXG4gICAgICAgIG5leHQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKG8gJiYgaSA+PSBvLmxlbmd0aCkgbyA9IHZvaWQgMDtcclxuICAgICAgICAgICAgcmV0dXJuIHsgdmFsdWU6IG8gJiYgb1tpKytdLCBkb25lOiAhbyB9O1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKHMgPyBcIk9iamVjdCBpcyBub3QgaXRlcmFibGUuXCIgOiBcIlN5bWJvbC5pdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3JlYWQobywgbikge1xyXG4gICAgdmFyIG0gPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdO1xyXG4gICAgaWYgKCFtKSByZXR1cm4gbztcclxuICAgIHZhciBpID0gbS5jYWxsKG8pLCByLCBhciA9IFtdLCBlO1xyXG4gICAgdHJ5IHtcclxuICAgICAgICB3aGlsZSAoKG4gPT09IHZvaWQgMCB8fCBuLS0gPiAwKSAmJiAhKHIgPSBpLm5leHQoKSkuZG9uZSkgYXIucHVzaChyLnZhbHVlKTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlcnJvcikgeyBlID0geyBlcnJvcjogZXJyb3IgfTsgfVxyXG4gICAgZmluYWxseSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKHIgJiYgIXIuZG9uZSAmJiAobSA9IGlbXCJyZXR1cm5cIl0pKSBtLmNhbGwoaSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZpbmFsbHkgeyBpZiAoZSkgdGhyb3cgZS5lcnJvcjsgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG4vKiogQGRlcHJlY2F0ZWQgKi9cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkKCkge1xyXG4gICAgZm9yICh2YXIgYXIgPSBbXSwgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgYXIgPSBhci5jb25jYXQoX19yZWFkKGFyZ3VtZW50c1tpXSkpO1xyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG4vKiogQGRlcHJlY2F0ZWQgKi9cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkQXJyYXlzKCkge1xyXG4gICAgZm9yICh2YXIgcyA9IDAsIGkgPSAwLCBpbCA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBpbDsgaSsrKSBzICs9IGFyZ3VtZW50c1tpXS5sZW5ndGg7XHJcbiAgICBmb3IgKHZhciByID0gQXJyYXkocyksIGsgPSAwLCBpID0gMDsgaSA8IGlsOyBpKyspXHJcbiAgICAgICAgZm9yICh2YXIgYSA9IGFyZ3VtZW50c1tpXSwgaiA9IDAsIGpsID0gYS5sZW5ndGg7IGogPCBqbDsgaisrLCBrKyspXHJcbiAgICAgICAgICAgIHJba10gPSBhW2pdO1xyXG4gICAgcmV0dXJuIHI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZEFycmF5KHRvLCBmcm9tLCBwYWNrKSB7XHJcbiAgICBpZiAocGFjayB8fCBhcmd1bWVudHMubGVuZ3RoID09PSAyKSBmb3IgKHZhciBpID0gMCwgbCA9IGZyb20ubGVuZ3RoLCBhcjsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgIGlmIChhciB8fCAhKGkgaW4gZnJvbSkpIHtcclxuICAgICAgICAgICAgaWYgKCFhcikgYXIgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChmcm9tLCAwLCBpKTtcclxuICAgICAgICAgICAgYXJbaV0gPSBmcm9tW2ldO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB0by5jb25jYXQoYXIgfHwgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZnJvbSkpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdCh2KSB7XHJcbiAgICByZXR1cm4gdGhpcyBpbnN0YW5jZW9mIF9fYXdhaXQgPyAodGhpcy52ID0gdiwgdGhpcykgOiBuZXcgX19hd2FpdCh2KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNHZW5lcmF0b3IodGhpc0FyZywgX2FyZ3VtZW50cywgZ2VuZXJhdG9yKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIGcgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSksIGksIHEgPSBbXTtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyBpZiAoZ1tuXSkgaVtuXSA9IGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAoYSwgYikgeyBxLnB1c2goW24sIHYsIGEsIGJdKSA+IDEgfHwgcmVzdW1lKG4sIHYpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gcmVzdW1lKG4sIHYpIHsgdHJ5IHsgc3RlcChnW25dKHYpKTsgfSBjYXRjaCAoZSkgeyBzZXR0bGUocVswXVszXSwgZSk7IH0gfVxyXG4gICAgZnVuY3Rpb24gc3RlcChyKSB7IHIudmFsdWUgaW5zdGFuY2VvZiBfX2F3YWl0ID8gUHJvbWlzZS5yZXNvbHZlKHIudmFsdWUudikudGhlbihmdWxmaWxsLCByZWplY3QpIDogc2V0dGxlKHFbMF1bMl0sIHIpOyB9XHJcbiAgICBmdW5jdGlvbiBmdWxmaWxsKHZhbHVlKSB7IHJlc3VtZShcIm5leHRcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiByZWplY3QodmFsdWUpIHsgcmVzdW1lKFwidGhyb3dcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiBzZXR0bGUoZiwgdikgeyBpZiAoZih2KSwgcS5zaGlmdCgpLCBxLmxlbmd0aCkgcmVzdW1lKHFbMF1bMF0sIHFbMF1bMV0pOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jRGVsZWdhdG9yKG8pIHtcclxuICAgIHZhciBpLCBwO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiLCBmdW5jdGlvbiAoZSkgeyB0aHJvdyBlOyB9KSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobiwgZikgeyBpW25dID0gb1tuXSA/IGZ1bmN0aW9uICh2KSB7IHJldHVybiAocCA9ICFwKSA/IHsgdmFsdWU6IF9fYXdhaXQob1tuXSh2KSksIGRvbmU6IG4gPT09IFwicmV0dXJuXCIgfSA6IGYgPyBmKHYpIDogdjsgfSA6IGY7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNWYWx1ZXMobykge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBtID0gb1tTeW1ib2wuYXN5bmNJdGVyYXRvcl0sIGk7XHJcbiAgICByZXR1cm4gbSA/IG0uY2FsbChvKSA6IChvID0gdHlwZW9mIF9fdmFsdWVzID09PSBcImZ1bmN0aW9uXCIgPyBfX3ZhbHVlcyhvKSA6IG9bU3ltYm9sLml0ZXJhdG9yXSgpLCBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaSk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaVtuXSA9IG9bbl0gJiYgZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHsgdiA9IG9bbl0odiksIHNldHRsZShyZXNvbHZlLCByZWplY3QsIHYuZG9uZSwgdi52YWx1ZSk7IH0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCBkLCB2KSB7IFByb21pc2UucmVzb2x2ZSh2KS50aGVuKGZ1bmN0aW9uKHYpIHsgcmVzb2x2ZSh7IHZhbHVlOiB2LCBkb25lOiBkIH0pOyB9LCByZWplY3QpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ha2VUZW1wbGF0ZU9iamVjdChjb29rZWQsIHJhdykge1xyXG4gICAgaWYgKE9iamVjdC5kZWZpbmVQcm9wZXJ0eSkgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkoY29va2VkLCBcInJhd1wiLCB7IHZhbHVlOiByYXcgfSk7IH0gZWxzZSB7IGNvb2tlZC5yYXcgPSByYXc7IH1cclxuICAgIHJldHVybiBjb29rZWQ7XHJcbn07XHJcblxyXG52YXIgX19zZXRNb2R1bGVEZWZhdWx0ID0gT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCB2KSB7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgXCJkZWZhdWx0XCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHYgfSk7XHJcbn0pIDogZnVuY3Rpb24obywgdikge1xyXG4gICAgb1tcImRlZmF1bHRcIl0gPSB2O1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0U3Rhcihtb2QpIHtcclxuICAgIGlmIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpIHJldHVybiBtb2Q7XHJcbiAgICB2YXIgcmVzdWx0ID0ge307XHJcbiAgICBpZiAobW9kICE9IG51bGwpIGZvciAodmFyIGsgaW4gbW9kKSBpZiAoayAhPT0gXCJkZWZhdWx0XCIgJiYgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vZCwgaykpIF9fY3JlYXRlQmluZGluZyhyZXN1bHQsIG1vZCwgayk7XHJcbiAgICBfX3NldE1vZHVsZURlZmF1bHQocmVzdWx0LCBtb2QpO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0RGVmYXVsdChtb2QpIHtcclxuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgZGVmYXVsdDogbW9kIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2NsYXNzUHJpdmF0ZUZpZWxkR2V0KHJlY2VpdmVyLCBzdGF0ZSwga2luZCwgZikge1xyXG4gICAgaWYgKGtpbmQgPT09IFwiYVwiICYmICFmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiUHJpdmF0ZSBhY2Nlc3NvciB3YXMgZGVmaW5lZCB3aXRob3V0IGEgZ2V0dGVyXCIpO1xyXG4gICAgaWYgKHR5cGVvZiBzdGF0ZSA9PT0gXCJmdW5jdGlvblwiID8gcmVjZWl2ZXIgIT09IHN0YXRlIHx8ICFmIDogIXN0YXRlLmhhcyhyZWNlaXZlcikpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgcmVhZCBwcml2YXRlIG1lbWJlciBmcm9tIGFuIG9iamVjdCB3aG9zZSBjbGFzcyBkaWQgbm90IGRlY2xhcmUgaXRcIik7XHJcbiAgICByZXR1cm4ga2luZCA9PT0gXCJtXCIgPyBmIDoga2luZCA9PT0gXCJhXCIgPyBmLmNhbGwocmVjZWl2ZXIpIDogZiA/IGYudmFsdWUgOiBzdGF0ZS5nZXQocmVjZWl2ZXIpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19jbGFzc1ByaXZhdGVGaWVsZFNldChyZWNlaXZlciwgc3RhdGUsIHZhbHVlLCBraW5kLCBmKSB7XHJcbiAgICBpZiAoa2luZCA9PT0gXCJtXCIpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJQcml2YXRlIG1ldGhvZCBpcyBub3Qgd3JpdGFibGVcIik7XHJcbiAgICBpZiAoa2luZCA9PT0gXCJhXCIgJiYgIWYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJQcml2YXRlIGFjY2Vzc29yIHdhcyBkZWZpbmVkIHdpdGhvdXQgYSBzZXR0ZXJcIik7XHJcbiAgICBpZiAodHlwZW9mIHN0YXRlID09PSBcImZ1bmN0aW9uXCIgPyByZWNlaXZlciAhPT0gc3RhdGUgfHwgIWYgOiAhc3RhdGUuaGFzKHJlY2VpdmVyKSkgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCB3cml0ZSBwcml2YXRlIG1lbWJlciB0byBhbiBvYmplY3Qgd2hvc2UgY2xhc3MgZGlkIG5vdCBkZWNsYXJlIGl0XCIpO1xyXG4gICAgcmV0dXJuIChraW5kID09PSBcImFcIiA/IGYuY2FsbChyZWNlaXZlciwgdmFsdWUpIDogZiA/IGYudmFsdWUgPSB2YWx1ZSA6IHN0YXRlLnNldChyZWNlaXZlciwgdmFsdWUpKSwgdmFsdWU7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2NsYXNzUHJpdmF0ZUZpZWxkSW4oc3RhdGUsIHJlY2VpdmVyKSB7XHJcbiAgICBpZiAocmVjZWl2ZXIgPT09IG51bGwgfHwgKHR5cGVvZiByZWNlaXZlciAhPT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgcmVjZWl2ZXIgIT09IFwiZnVuY3Rpb25cIikpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgdXNlICdpbicgb3BlcmF0b3Igb24gbm9uLW9iamVjdFwiKTtcclxuICAgIHJldHVybiB0eXBlb2Ygc3RhdGUgPT09IFwiZnVuY3Rpb25cIiA/IHJlY2VpdmVyID09PSBzdGF0ZSA6IHN0YXRlLmhhcyhyZWNlaXZlcik7XHJcbn1cclxuIiwiY29uc3QgcmVnRW1vamkgPSBuZXcgUmVnRXhwKFxuICAvW1xcdTI3MDAtXFx1MjdCRl18W1xcdUUwMDAtXFx1RjhGRl18XFx1RDgzQ1tcXHVEQzAwLVxcdURGRkZdfFxcdUQ4M0RbXFx1REMwMC1cXHVERkZGXXxbXFx1MjAxMS1cXHUyNkZGXXxcXHVEODNFW1xcdUREMTAtXFx1RERGRl18W1xcdUZFMEUtXFx1RkUwRl0vLFxuICBcImdcIlxuKTtcblxuZXhwb3J0IGZ1bmN0aW9uIGFsbEFscGhhYmV0cyh0ZXh0OiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuIEJvb2xlYW4odGV4dC5tYXRjaCgvXlthLXpBLVowLTlfLV0rJC8pKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGV4Y2x1ZGVFbW9qaSh0ZXh0OiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gdGV4dC5yZXBsYWNlKHJlZ0Vtb2ppLCBcIlwiKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGV4Y2x1ZGVTcGFjZSh0ZXh0OiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gdGV4dC5yZXBsYWNlKC8gL2csIFwiXCIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbG93ZXJJbmNsdWRlcyhvbmU6IHN0cmluZywgb3RoZXI6IHN0cmluZyk6IGJvb2xlYW4ge1xuICByZXR1cm4gb25lLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMob3RoZXIudG9Mb3dlckNhc2UoKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsb3dlckluY2x1ZGVzV2l0aG91dFNwYWNlKG9uZTogc3RyaW5nLCBvdGhlcjogc3RyaW5nKTogYm9vbGVhbiB7XG4gIHJldHVybiBsb3dlckluY2x1ZGVzKGV4Y2x1ZGVTcGFjZShvbmUpLCBleGNsdWRlU3BhY2Uob3RoZXIpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxvd2VyU3RhcnRzV2l0aChhOiBzdHJpbmcsIGI6IHN0cmluZyk6IGJvb2xlYW4ge1xuICByZXR1cm4gYS50b0xvd2VyQ2FzZSgpLnN0YXJ0c1dpdGgoYi50b0xvd2VyQ2FzZSgpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxvd2VyU3RhcnRzV2l0aG91dFNwYWNlKG9uZTogc3RyaW5nLCBvdGhlcjogc3RyaW5nKTogYm9vbGVhbiB7XG4gIHJldHVybiBsb3dlclN0YXJ0c1dpdGgoZXhjbHVkZVNwYWNlKG9uZSksIGV4Y2x1ZGVTcGFjZShvdGhlcikpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY2FwaXRhbGl6ZUZpcnN0TGV0dGVyKHN0cjogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHN0ci5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHN0ci5zbGljZSgxKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN0YXJ0c1NtYWxsTGV0dGVyT25seUZpcnN0KHN0cjogc3RyaW5nKTogYm9vbGVhbiB7XG4gIHJldHVybiBCb29sZWFuKHN0ci5tYXRjaCgvXltBLVpdW15BLVpdKyQvKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiogc3BsaXRSYXcoXG4gIHRleHQ6IHN0cmluZyxcbiAgcmVnZXhwOiBSZWdFeHBcbik6IEl0ZXJhYmxlSXRlcmF0b3I8c3RyaW5nPiB7XG4gIGxldCBwcmV2aW91c0luZGV4ID0gMDtcbiAgZm9yIChsZXQgciBvZiB0ZXh0Lm1hdGNoQWxsKHJlZ2V4cCkpIHtcbiAgICBpZiAocHJldmlvdXNJbmRleCAhPT0gci5pbmRleCEpIHtcbiAgICAgIHlpZWxkIHRleHQuc2xpY2UocHJldmlvdXNJbmRleCwgci5pbmRleCEpO1xuICAgIH1cbiAgICB5aWVsZCB0ZXh0W3IuaW5kZXghXTtcbiAgICBwcmV2aW91c0luZGV4ID0gci5pbmRleCEgKyAxO1xuICB9XG5cbiAgaWYgKHByZXZpb3VzSW5kZXggIT09IHRleHQubGVuZ3RoKSB7XG4gICAgeWllbGQgdGV4dC5zbGljZShwcmV2aW91c0luZGV4LCB0ZXh0Lmxlbmd0aCk7XG4gIH1cbn1cbiIsImltcG9ydCB0eXBlIHsgVG9rZW5pemVyIH0gZnJvbSBcIi4uL3Rva2VuaXplclwiO1xuaW1wb3J0IHsgc3BsaXRSYXcgfSBmcm9tIFwiLi4vLi4vdXRpbC9zdHJpbmdzXCI7XG5cbmZ1bmN0aW9uIHBpY2tUb2tlbnMoY29udGVudDogc3RyaW5nLCB0cmltUGF0dGVybjogUmVnRXhwKTogc3RyaW5nW10ge1xuICByZXR1cm4gY29udGVudC5zcGxpdCh0cmltUGF0dGVybikuZmlsdGVyKCh4KSA9PiB4ICE9PSBcIlwiKTtcbn1cblxuZXhwb3J0IGNvbnN0IFRSSU1fQ0hBUl9QQVRURVJOID0gL1tcXG5cXHRcXFtcXF0kLzo/IT0oKTw+XCInLix8Oyp+IGBdL2c7XG5leHBvcnQgY2xhc3MgRGVmYXVsdFRva2VuaXplciBpbXBsZW1lbnRzIFRva2VuaXplciB7XG4gIHRva2VuaXplKGNvbnRlbnQ6IHN0cmluZywgcmF3PzogYm9vbGVhbik6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gcmF3XG4gICAgICA/IEFycmF5LmZyb20oc3BsaXRSYXcoY29udGVudCwgdGhpcy5nZXRUcmltUGF0dGVybigpKSkuZmlsdGVyKFxuICAgICAgICAgICh4KSA9PiB4ICE9PSBcIiBcIlxuICAgICAgICApXG4gICAgICA6IHBpY2tUb2tlbnMoY29udGVudCwgdGhpcy5nZXRUcmltUGF0dGVybigpKTtcbiAgfVxuXG4gIHJlY3Vyc2l2ZVRva2VuaXplKGNvbnRlbnQ6IHN0cmluZyk6IHsgd29yZDogc3RyaW5nOyBvZmZzZXQ6IG51bWJlciB9W10ge1xuICAgIGNvbnN0IHRyaW1JbmRleGVzID0gQXJyYXkuZnJvbShjb250ZW50Lm1hdGNoQWxsKHRoaXMuZ2V0VHJpbVBhdHRlcm4oKSkpXG4gICAgICAuc29ydCgoYSwgYikgPT4gYS5pbmRleCEgLSBiLmluZGV4ISlcbiAgICAgIC5tYXAoKHgpID0+IHguaW5kZXghKTtcbiAgICByZXR1cm4gW1xuICAgICAgeyB3b3JkOiBjb250ZW50LCBvZmZzZXQ6IDAgfSxcbiAgICAgIC4uLnRyaW1JbmRleGVzLm1hcCgoaSkgPT4gKHtcbiAgICAgICAgd29yZDogY29udGVudC5zbGljZShpICsgMSksXG4gICAgICAgIG9mZnNldDogaSArIDEsXG4gICAgICB9KSksXG4gICAgXTtcbiAgfVxuXG4gIGdldFRyaW1QYXR0ZXJuKCk6IFJlZ0V4cCB7XG4gICAgcmV0dXJuIFRSSU1fQ0hBUl9QQVRURVJOO1xuICB9XG5cbiAgc2hvdWxkSWdub3JlKHN0cjogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG4iLCJpbXBvcnQgeyBEZWZhdWx0VG9rZW5pemVyIH0gZnJvbSBcIi4vRGVmYXVsdFRva2VuaXplclwiO1xuXG5jb25zdCBBUkFCSUNfVFJJTV9DSEFSX1BBVFRFUk4gPSAvW1xcblxcdFxcW1xcXSQvOj8hPSgpPD5cIicuLHw7Kn4gYNiM2JtdL2c7XG5leHBvcnQgY2xhc3MgQXJhYmljVG9rZW5pemVyIGV4dGVuZHMgRGVmYXVsdFRva2VuaXplciB7XG4gIGdldFRyaW1QYXR0ZXJuKCk6IFJlZ0V4cCB7XG4gICAgcmV0dXJuIEFSQUJJQ19UUklNX0NIQVJfUEFUVEVSTjtcbiAgfVxufVxuIiwiLy8gQHRzLW5vY2hlY2tcbi8vIEJlY2F1c2UgdGhpcyBjb2RlIGlzIG9yaWdpbmFsbHkgamF2YXNjcmlwdCBjb2RlLlxuLy8gbm9pbnNwZWN0aW9uIEZ1bmN0aW9uVG9vTG9uZ0pTLEZ1bmN0aW9uV2l0aE11bHRpcGxlTG9vcHNKUyxFcXVhbGl0eUNvbXBhcmlzb25XaXRoQ29lcmNpb25KUyxQb2ludGxlc3NCb29sZWFuRXhwcmVzc2lvbkpTLEpTRGVjbGFyYXRpb25zQXRTY29wZVN0YXJ0XG5cbi8vIFRpbnlTZWdtZW50ZXIgMC4xIC0tIFN1cGVyIGNvbXBhY3QgSmFwYW5lc2UgdG9rZW5pemVyIGluIEphdmFzY3JpcHRcbi8vIChjKSAyMDA4IFRha3UgS3VkbyA8dGFrdUBjaGFzZW4ub3JnPlxuLy8gVGlueVNlZ21lbnRlciBpcyBmcmVlbHkgZGlzdHJpYnV0YWJsZSB1bmRlciB0aGUgdGVybXMgb2YgYSBuZXcgQlNEIGxpY2VuY2UuXG4vLyBGb3IgZGV0YWlscywgc2VlIGh0dHA6Ly9jaGFzZW4ub3JnL350YWt1L3NvZnR3YXJlL1RpbnlTZWdtZW50ZXIvTElDRU5DRS50eHRcblxuZnVuY3Rpb24gVGlueVNlZ21lbnRlcigpIHtcbiAgdmFyIHBhdHRlcm5zID0ge1xuICAgIFwiW+S4gOS6jOS4ieWbm+S6lOWFreS4g+WFq+S5neWNgeeZvuWNg+S4h+WEhOWFhl1cIjogXCJNXCIsXG4gICAgXCJb5LiALem+oOOAheOAhuODteODtl1cIjogXCJIXCIsXG4gICAgXCJb44GBLeOCk11cIjogXCJJXCIsXG4gICAgXCJb44KhLeODtOODvO+9sS3vvp3vvp7vvbBdXCI6IFwiS1wiLFxuICAgIFwiW2EtekEtWu+9gS3vvZrvvKEt77y6XVwiOiBcIkFcIixcbiAgICBcIlswLTnvvJAt77yZXVwiOiBcIk5cIixcbiAgfTtcbiAgdGhpcy5jaGFydHlwZV8gPSBbXTtcbiAgZm9yICh2YXIgaSBpbiBwYXR0ZXJucykge1xuICAgIHZhciByZWdleHAgPSBuZXcgUmVnRXhwKCk7XG4gICAgcmVnZXhwLmNvbXBpbGUoaSk7XG4gICAgdGhpcy5jaGFydHlwZV8ucHVzaChbcmVnZXhwLCBwYXR0ZXJuc1tpXV0pO1xuICB9XG5cbiAgdGhpcy5CSUFTX18gPSAtMzMyO1xuICB0aGlzLkJDMV9fID0geyBISDogNiwgSUk6IDI0NjEsIEtIOiA0MDYsIE9IOiAtMTM3OCB9O1xuICB0aGlzLkJDMl9fID0ge1xuICAgIEFBOiAtMzI2NyxcbiAgICBBSTogMjc0NCxcbiAgICBBTjogLTg3OCxcbiAgICBISDogLTQwNzAsXG4gICAgSE06IC0xNzExLFxuICAgIEhOOiA0MDEyLFxuICAgIEhPOiAzNzYxLFxuICAgIElBOiAxMzI3LFxuICAgIElIOiAtMTE4NCxcbiAgICBJSTogLTEzMzIsXG4gICAgSUs6IDE3MjEsXG4gICAgSU86IDU0OTIsXG4gICAgS0k6IDM4MzEsXG4gICAgS0s6IC04NzQxLFxuICAgIE1IOiAtMzEzMixcbiAgICBNSzogMzMzNCxcbiAgICBPTzogLTI5MjAsXG4gIH07XG4gIHRoaXMuQkMzX18gPSB7XG4gICAgSEg6IDk5NixcbiAgICBISTogNjI2LFxuICAgIEhLOiAtNzIxLFxuICAgIEhOOiAtMTMwNyxcbiAgICBITzogLTgzNixcbiAgICBJSDogLTMwMSxcbiAgICBLSzogMjc2MixcbiAgICBNSzogMTA3OSxcbiAgICBNTTogNDAzNCxcbiAgICBPQTogLTE2NTIsXG4gICAgT0g6IDI2NixcbiAgfTtcbiAgdGhpcy5CUDFfXyA9IHsgQkI6IDI5NSwgT0I6IDMwNCwgT086IC0xMjUsIFVCOiAzNTIgfTtcbiAgdGhpcy5CUDJfXyA9IHsgQk86IDYwLCBPTzogLTE3NjIgfTtcbiAgdGhpcy5CUTFfXyA9IHtcbiAgICBCSEg6IDExNTAsXG4gICAgQkhNOiAxNTIxLFxuICAgIEJJSTogLTExNTgsXG4gICAgQklNOiA4ODYsXG4gICAgQk1IOiAxMjA4LFxuICAgIEJOSDogNDQ5LFxuICAgIEJPSDogLTkxLFxuICAgIEJPTzogLTI1OTcsXG4gICAgT0hJOiA0NTEsXG4gICAgT0lIOiAtMjk2LFxuICAgIE9LQTogMTg1MSxcbiAgICBPS0g6IC0xMDIwLFxuICAgIE9LSzogOTA0LFxuICAgIE9PTzogMjk2NSxcbiAgfTtcbiAgdGhpcy5CUTJfXyA9IHtcbiAgICBCSEg6IDExOCxcbiAgICBCSEk6IC0xMTU5LFxuICAgIEJITTogNDY2LFxuICAgIEJJSDogLTkxOSxcbiAgICBCS0s6IC0xNzIwLFxuICAgIEJLTzogODY0LFxuICAgIE9ISDogLTExMzksXG4gICAgT0hNOiAtMTgxLFxuICAgIE9JSDogMTUzLFxuICAgIFVISTogLTExNDYsXG4gIH07XG4gIHRoaXMuQlEzX18gPSB7XG4gICAgQkhIOiAtNzkyLFxuICAgIEJISTogMjY2NCxcbiAgICBCSUk6IC0yOTksXG4gICAgQktJOiA0MTksXG4gICAgQk1IOiA5MzcsXG4gICAgQk1NOiA4MzM1LFxuICAgIEJOTjogOTk4LFxuICAgIEJPSDogNzc1LFxuICAgIE9ISDogMjE3NCxcbiAgICBPSE06IDQzOSxcbiAgICBPSUk6IDI4MCxcbiAgICBPS0g6IDE3OTgsXG4gICAgT0tJOiAtNzkzLFxuICAgIE9LTzogLTIyNDIsXG4gICAgT01IOiAtMjQwMixcbiAgICBPT086IDExNjk5LFxuICB9O1xuICB0aGlzLkJRNF9fID0ge1xuICAgIEJISDogLTM4OTUsXG4gICAgQklIOiAzNzYxLFxuICAgIEJJSTogLTQ2NTQsXG4gICAgQklLOiAxMzQ4LFxuICAgIEJLSzogLTE4MDYsXG4gICAgQk1JOiAtMzM4NSxcbiAgICBCT086IC0xMjM5NixcbiAgICBPQUg6IDkyNixcbiAgICBPSEg6IDI2NixcbiAgICBPSEs6IC0yMDM2LFxuICAgIE9OTjogLTk3MyxcbiAgfTtcbiAgdGhpcy5CVzFfXyA9IHtcbiAgICBcIizjgahcIjogNjYwLFxuICAgIFwiLOWQjFwiOiA3MjcsXG4gICAgQjHjgYI6IDE0MDQsXG4gICAgQjHlkIw6IDU0MixcbiAgICBcIuOAgeOBqFwiOiA2NjAsXG4gICAgXCLjgIHlkIxcIjogNzI3LFxuICAgIFwi44CN44GoXCI6IDE2ODIsXG4gICAg44GC44GjOiAxNTA1LFxuICAgIOOBhOOBhjogMTc0MyxcbiAgICDjgYTjgaM6IC0yMDU1LFxuICAgIOOBhOOCizogNjcyLFxuICAgIOOBhuOBlzogLTQ4MTcsXG4gICAg44GG44KTOiA2NjUsXG4gICAg44GL44KJOiAzNDcyLFxuICAgIOOBjOOCiTogNjAwLFxuICAgIOOBk+OBhjogLTc5MCxcbiAgICDjgZPjgag6IDIwODMsXG4gICAg44GT44KTOiAtMTI2MixcbiAgICDjgZXjgok6IC00MTQzLFxuICAgIOOBleOCkzogNDU3MyxcbiAgICDjgZfjgZ86IDI2NDEsXG4gICAg44GX44GmOiAxMTA0LFxuICAgIOOBmeOBpzogLTMzOTksXG4gICAg44Gd44GTOiAxOTc3LFxuICAgIOOBneOCjDogLTg3MSxcbiAgICDjgZ/jgaE6IDExMjIsXG4gICAg44Gf44KBOiA2MDEsXG4gICAg44Gj44GfOiAzNDYzLFxuICAgIOOBpOOBhDogLTgwMixcbiAgICDjgabjgYQ6IDgwNSxcbiAgICDjgabjgY06IDEyNDksXG4gICAg44Gn44GNOiAxMTI3LFxuICAgIOOBp+OBmTogMzQ0NSxcbiAgICDjgafjga86IDg0NCxcbiAgICDjgajjgYQ6IC00OTE1LFxuICAgIOOBqOOBvzogMTkyMixcbiAgICDjganjgZM6IDM4ODcsXG4gICAg44Gq44GEOiA1NzEzLFxuICAgIOOBquOBozogMzAxNSxcbiAgICDjgarjgak6IDczNzksXG4gICAg44Gq44KTOiAtMTExMyxcbiAgICDjgavjgZc6IDI0NjgsXG4gICAg44Gr44GvOiAxNDk4LFxuICAgIOOBq+OCgjogMTY3MSxcbiAgICDjgavlr746IC05MTIsXG4gICAg44Gu5LiAOiAtNTAxLFxuICAgIOOBruS4rTogNzQxLFxuICAgIOOBvuOBmzogMjQ0OCxcbiAgICDjgb7jgac6IDE3MTEsXG4gICAg44G+44G+OiAyNjAwLFxuICAgIOOBvuOCizogLTIxNTUsXG4gICAg44KE44KAOiAtMTk0NyxcbiAgICDjgojjgaM6IC0yNTY1LFxuICAgIOOCjOOBnzogMjM2OSxcbiAgICDjgozjgac6IC05MTMsXG4gICAg44KS44GXOiAxODYwLFxuICAgIOOCkuimizogNzMxLFxuICAgIOS6oeOBjzogLTE4ODYsXG4gICAg5Lqs6YO9OiAyNTU4LFxuICAgIOWPluOCijogLTI3ODQsXG4gICAg5aSn44GNOiAtMjYwNCxcbiAgICDlpKfpmKo6IDE0OTcsXG4gICAg5bmz5pa5OiAtMjMxNCxcbiAgICDlvJXjgY06IC0xMzM2LFxuICAgIOaXpeacrDogLTE5NSxcbiAgICDmnKzlvZM6IC0yNDIzLFxuICAgIOavjuaXpTogLTIxMTMsXG4gICAg55uu5oyHOiAtNzI0LFxuICAgIO+8ou+8keOBgjogMTQwNCxcbiAgICDvvKLvvJHlkIw6IDU0MixcbiAgICBcIu+9o+OBqFwiOiAxNjgyLFxuICB9O1xuICB0aGlzLkJXMl9fID0ge1xuICAgIFwiLi5cIjogLTExODIyLFxuICAgIDExOiAtNjY5LFxuICAgIFwi4oCV4oCVXCI6IC01NzMwLFxuICAgIFwi4oiS4oiSXCI6IC0xMzE3NSxcbiAgICDjgYTjgYY6IC0xNjA5LFxuICAgIOOBhuOBizogMjQ5MCxcbiAgICDjgYvjgZc6IC0xMzUwLFxuICAgIOOBi+OCgjogLTYwMixcbiAgICDjgYvjgok6IC03MTk0LFxuICAgIOOBi+OCjDogNDYxMixcbiAgICDjgYzjgYQ6IDg1MyxcbiAgICDjgYzjgok6IC0zMTk4LFxuICAgIOOBjeOBnzogMTk0MSxcbiAgICDjgY/jgao6IC0xNTk3LFxuICAgIOOBk+OBqDogLTgzOTIsXG4gICAg44GT44GuOiAtNDE5MyxcbiAgICDjgZXjgZs6IDQ1MzMsXG4gICAg44GV44KMOiAxMzE2OCxcbiAgICDjgZXjgpM6IC0zOTc3LFxuICAgIOOBl+OBhDogLTE4MTksXG4gICAg44GX44GLOiAtNTQ1LFxuICAgIOOBl+OBnzogNTA3OCxcbiAgICDjgZfjgaY6IDk3MixcbiAgICDjgZfjgao6IDkzOSxcbiAgICDjgZ3jga46IC0zNzQ0LFxuICAgIOOBn+OBhDogLTEyNTMsXG4gICAg44Gf44GfOiAtNjYyLFxuICAgIOOBn+OBoDogLTM4NTcsXG4gICAg44Gf44GhOiAtNzg2LFxuICAgIOOBn+OBqDogMTIyNCxcbiAgICDjgZ/jga86IC05MzksXG4gICAg44Gj44GfOiA0NTg5LFxuICAgIOOBo+OBpjogMTY0NyxcbiAgICDjgaPjgag6IC0yMDk0LFxuICAgIOOBpuOBhDogNjE0NCxcbiAgICDjgabjgY06IDM2NDAsXG4gICAg44Gm44GPOiAyNTUxLFxuICAgIOOBpuOBrzogLTMxMTAsXG4gICAg44Gm44KCOiAtMzA2NSxcbiAgICDjgafjgYQ6IDI2NjYsXG4gICAg44Gn44GNOiAtMTUyOCxcbiAgICDjgafjgZc6IC0zODI4LFxuICAgIOOBp+OBmTogLTQ3NjEsXG4gICAg44Gn44KCOiAtNDIwMyxcbiAgICDjgajjgYQ6IDE4OTAsXG4gICAg44Go44GTOiAtMTc0NixcbiAgICDjgajjgag6IC0yMjc5LFxuICAgIOOBqOOBrjogNzIwLFxuICAgIOOBqOOBvzogNTE2OCxcbiAgICDjgajjgoI6IC0zOTQxLFxuICAgIOOBquOBhDogLTI0ODgsXG4gICAg44Gq44GMOiAtMTMxMyxcbiAgICDjgarjgak6IC02NTA5LFxuICAgIOOBquOBrjogMjYxNCxcbiAgICDjgarjgpM6IDMwOTksXG4gICAg44Gr44GKOiAtMTYxNSxcbiAgICDjgavjgZc6IDI3NDgsXG4gICAg44Gr44GqOiAyNDU0LFxuICAgIOOBq+OCiDogLTcyMzYsXG4gICAg44Gr5a++OiAtMTQ5NDMsXG4gICAg44Gr5b6TOiAtNDY4OCxcbiAgICDjgavplqI6IC0xMTM4OCxcbiAgICDjga7jgYs6IDIwOTMsXG4gICAg44Gu44GnOiAtNzA1OSxcbiAgICDjga7jgas6IC02MDQxLFxuICAgIOOBruOBrjogLTYxMjUsXG4gICAg44Gv44GEOiAxMDczLFxuICAgIOOBr+OBjDogLTEwMzMsXG4gICAg44Gv44GaOiAtMjUzMixcbiAgICDjgbDjgow6IDE4MTMsXG4gICAg44G+44GXOiAtMTMxNixcbiAgICDjgb7jgac6IC02NjIxLFxuICAgIOOBvuOCjDogNTQwOSxcbiAgICDjgoHjgaY6IC0zMTUzLFxuICAgIOOCguOBhDogMjIzMCxcbiAgICDjgoLjga46IC0xMDcxMyxcbiAgICDjgonjgYs6IC05NDQsXG4gICAg44KJ44GXOiAtMTYxMSxcbiAgICDjgonjgas6IC0xODk3LFxuICAgIOOCiuOBlzogNjUxLFxuICAgIOOCiuOBvjogMTYyMCxcbiAgICDjgozjgZ86IDQyNzAsXG4gICAg44KM44GmOiA4NDksXG4gICAg44KM44GwOiA0MTE0LFxuICAgIOOCjeOBhjogNjA2NyxcbiAgICDjgo/jgow6IDc5MDEsXG4gICAg44KS6YCaOiAtMTE4NzcsXG4gICAg44KT44GgOiA3MjgsXG4gICAg44KT44GqOiAtNDExNSxcbiAgICDkuIDkuro6IDYwMixcbiAgICDkuIDmlrk6IC0xMzc1LFxuICAgIOS4gOaXpTogOTcwLFxuICAgIOS4gOmDqDogLTEwNTEsXG4gICAg5LiK44GMOiAtNDQ3OSxcbiAgICDkvJrnpL46IC0xMTE2LFxuICAgIOWHuuOBpjogMjE2MyxcbiAgICDliIbjga46IC03NzU4LFxuICAgIOWQjOWFmjogOTcwLFxuICAgIOWQjOaXpTogLTkxMyxcbiAgICDlpKfpmKo6IC0yNDcxLFxuICAgIOWnlOWToTogLTEyNTAsXG4gICAg5bCR44GqOiAtMTA1MCxcbiAgICDlubTluqY6IC04NjY5LFxuICAgIOW5tOmWkzogLTE2MjYsXG4gICAg5bqc55yMOiAtMjM2MyxcbiAgICDmiYvmqKk6IC0xOTgyLFxuICAgIOaWsOiBnjogLTQwNjYsXG4gICAg5pel5pawOiAtNzIyLFxuICAgIOaXpeacrDogLTcwNjgsXG4gICAg5pel57GzOiAzMzcyLFxuICAgIOabnOaXpTogLTYwMSxcbiAgICDmnJ3prq46IC0yMzU1LFxuICAgIOacrOS6ujogLTI2OTcsXG4gICAg5p2x5LqsOiAtMTU0MyxcbiAgICDnhLbjgag6IC0xMzg0LFxuICAgIOekvuS8mjogLTEyNzYsXG4gICAg56uL44GmOiAtOTkwLFxuICAgIOesrOOBqzogLTE2MTIsXG4gICAg57Gz5Zu9OiAtNDI2OCxcbiAgICBcIu+8ke+8kVwiOiAtNjY5LFxuICB9O1xuICB0aGlzLkJXM19fID0ge1xuICAgIOOBguOBnzogLTIxOTQsXG4gICAg44GC44KKOiA3MTksXG4gICAg44GC44KLOiAzODQ2LFxuICAgIFwi44GELlwiOiAtMTE4NSxcbiAgICBcIuOBhOOAglwiOiAtMTE4NSxcbiAgICDjgYTjgYQ6IDUzMDgsXG4gICAg44GE44GIOiAyMDc5LFxuICAgIOOBhOOBjzogMzAyOSxcbiAgICDjgYTjgZ86IDIwNTYsXG4gICAg44GE44GjOiAxODgzLFxuICAgIOOBhOOCizogNTYwMCxcbiAgICDjgYTjgo86IDE1MjcsXG4gICAg44GG44GhOiAxMTE3LFxuICAgIOOBhuOBqDogNDc5OCxcbiAgICDjgYjjgag6IDE0NTQsXG4gICAgXCLjgYsuXCI6IDI4NTcsXG4gICAgXCLjgYvjgIJcIjogMjg1NyxcbiAgICDjgYvjgZE6IC03NDMsXG4gICAg44GL44GjOiAtNDA5OCxcbiAgICDjgYvjgas6IC02NjksXG4gICAg44GL44KJOiA2NTIwLFxuICAgIOOBi+OCijogLTI2NzAsXG4gICAgXCLjgYwsXCI6IDE4MTYsXG4gICAgXCLjgYzjgIFcIjogMTgxNixcbiAgICDjgYzjgY06IC00ODU1LFxuICAgIOOBjOOBkTogLTExMjcsXG4gICAg44GM44GjOiAtOTEzLFxuICAgIOOBjOOCiTogLTQ5NzcsXG4gICAg44GM44KKOiAtMjA2NCxcbiAgICDjgY3jgZ86IDE2NDUsXG4gICAg44GR44GpOiAxMzc0LFxuICAgIOOBk+OBqDogNzM5NyxcbiAgICDjgZPjga46IDE1NDIsXG4gICAg44GT44KNOiAtMjc1NyxcbiAgICDjgZXjgYQ6IC03MTQsXG4gICAg44GV44KSOiA5NzYsXG4gICAgXCLjgZcsXCI6IDE1NTcsXG4gICAgXCLjgZfjgIFcIjogMTU1NyxcbiAgICDjgZfjgYQ6IC0zNzE0LFxuICAgIOOBl+OBnzogMzU2MixcbiAgICDjgZfjgaY6IDE0NDksXG4gICAg44GX44GqOiAyNjA4LFxuICAgIOOBl+OBvjogMTIwMCxcbiAgICBcIuOBmS5cIjogLTEzMTAsXG4gICAgXCLjgZnjgIJcIjogLTEzMTAsXG4gICAg44GZ44KLOiA2NTIxLFxuICAgIFwi44GaLFwiOiAzNDI2LFxuICAgIFwi44Ga44CBXCI6IDM0MjYsXG4gICAg44Ga44GrOiA4NDEsXG4gICAg44Gd44GGOiA0MjgsXG4gICAgXCLjgZ8uXCI6IDg4NzUsXG4gICAgXCLjgZ/jgIJcIjogODg3NSxcbiAgICDjgZ/jgYQ6IC01OTQsXG4gICAg44Gf44GuOiA4MTIsXG4gICAg44Gf44KKOiAtMTE4MyxcbiAgICDjgZ/jgos6IC04NTMsXG4gICAgXCLjgaAuXCI6IDQwOTgsXG4gICAgXCLjgaDjgIJcIjogNDA5OCxcbiAgICDjgaDjgaM6IDEwMDQsXG4gICAg44Gj44GfOiAtNDc0OCxcbiAgICDjgaPjgaY6IDMwMCxcbiAgICDjgabjgYQ6IDYyNDAsXG4gICAg44Gm44GKOiA4NTUsXG4gICAg44Gm44KCOiAzMDIsXG4gICAg44Gn44GZOiAxNDM3LFxuICAgIOOBp+OBqzogLTE0ODIsXG4gICAg44Gn44GvOiAyMjk1LFxuICAgIOOBqOOBhjogLTEzODcsXG4gICAg44Go44GXOiAyMjY2LFxuICAgIOOBqOOBrjogNTQxLFxuICAgIOOBqOOCgjogLTM1NDMsXG4gICAg44Gp44GGOiA0NjY0LFxuICAgIOOBquOBhDogMTc5NixcbiAgICDjgarjgY86IC05MDMsXG4gICAg44Gq44GpOiAyMTM1LFxuICAgIFwi44GrLFwiOiAtMTAyMSxcbiAgICBcIuOBq+OAgVwiOiAtMTAyMSxcbiAgICDjgavjgZc6IDE3NzEsXG4gICAg44Gr44GqOiAxOTA2LFxuICAgIOOBq+OBrzogMjY0NCxcbiAgICBcIuOBrixcIjogLTcyNCxcbiAgICBcIuOBruOAgVwiOiAtNzI0LFxuICAgIOOBruWtkDogLTEwMDAsXG4gICAgXCLjga8sXCI6IDEzMzcsXG4gICAgXCLjga/jgIFcIjogMTMzNyxcbiAgICDjgbnjgY06IDIxODEsXG4gICAg44G+44GXOiAxMTEzLFxuICAgIOOBvuOBmTogNjk0MyxcbiAgICDjgb7jgaM6IC0xNTQ5LFxuICAgIOOBvuOBpzogNjE1NCxcbiAgICDjgb7jgow6IC03OTMsXG4gICAg44KJ44GXOiAxNDc5LFxuICAgIOOCieOCjDogNjgyMCxcbiAgICDjgovjgos6IDM4MTgsXG4gICAgXCLjgowsXCI6IDg1NCxcbiAgICBcIuOCjOOAgVwiOiA4NTQsXG4gICAg44KM44GfOiAxODUwLFxuICAgIOOCjOOBpjogMTM3NSxcbiAgICDjgozjgbA6IC0zMjQ2LFxuICAgIOOCjOOCizogMTA5MSxcbiAgICDjgo/jgow6IC02MDUsXG4gICAg44KT44GgOiA2MDYsXG4gICAg44KT44GnOiA3OTgsXG4gICAg44Kr5pyIOiA5OTAsXG4gICAg5Lya6K2wOiA4NjAsXG4gICAg5YWl44KKOiAxMjMyLFxuICAgIOWkp+S8mjogMjIxNyxcbiAgICDlp4vjgoE6IDE2ODEsXG4gICAg5biCOiA5NjUsXG4gICAg5paw6IGeOiAtNTA1NSxcbiAgICBcIuaXpSxcIjogOTc0LFxuICAgIFwi5pel44CBXCI6IDk3NCxcbiAgICDnpL7kvJo6IDIwMjQsXG4gICAg77225pyIOiA5OTAsXG4gIH07XG4gIHRoaXMuVEMxX18gPSB7XG4gICAgQUFBOiAxMDkzLFxuICAgIEhISDogMTAyOSxcbiAgICBISE06IDU4MCxcbiAgICBISUk6IDk5OCxcbiAgICBIT0g6IC0zOTAsXG4gICAgSE9NOiAtMzMxLFxuICAgIElISTogMTE2OSxcbiAgICBJT0g6IC0xNDIsXG4gICAgSU9JOiAtMTAxNSxcbiAgICBJT006IDQ2NyxcbiAgICBNTUg6IDE4NyxcbiAgICBPT0k6IC0xODMyLFxuICB9O1xuICB0aGlzLlRDMl9fID0ge1xuICAgIEhITzogMjA4OCxcbiAgICBISUk6IC0xMDIzLFxuICAgIEhNTTogLTExNTQsXG4gICAgSUhJOiAtMTk2NSxcbiAgICBLS0g6IDcwMyxcbiAgICBPSUk6IC0yNjQ5LFxuICB9O1xuICB0aGlzLlRDM19fID0ge1xuICAgIEFBQTogLTI5NCxcbiAgICBISEg6IDM0NixcbiAgICBISEk6IC0zNDEsXG4gICAgSElJOiAtMTA4OCxcbiAgICBISUs6IDczMSxcbiAgICBIT0g6IC0xNDg2LFxuICAgIElISDogMTI4LFxuICAgIElISTogLTMwNDEsXG4gICAgSUhPOiAtMTkzNSxcbiAgICBJSUg6IC04MjUsXG4gICAgSUlNOiAtMTAzNSxcbiAgICBJT0k6IC01NDIsXG4gICAgS0hIOiAtMTIxNixcbiAgICBLS0E6IDQ5MSxcbiAgICBLS0g6IC0xMjE3LFxuICAgIEtPSzogLTEwMDksXG4gICAgTUhIOiAtMjY5NCxcbiAgICBNSE06IC00NTcsXG4gICAgTUhPOiAxMjMsXG4gICAgTU1IOiAtNDcxLFxuICAgIE5OSDogLTE2ODksXG4gICAgTk5POiA2NjIsXG4gICAgT0hPOiAtMzM5MyxcbiAgfTtcbiAgdGhpcy5UQzRfXyA9IHtcbiAgICBISEg6IC0yMDMsXG4gICAgSEhJOiAxMzQ0LFxuICAgIEhISzogMzY1LFxuICAgIEhITTogLTEyMixcbiAgICBISE46IDE4MixcbiAgICBISE86IDY2OSxcbiAgICBISUg6IDgwNCxcbiAgICBISUk6IDY3OSxcbiAgICBIT0g6IDQ0NixcbiAgICBJSEg6IDY5NSxcbiAgICBJSE86IC0yMzI0LFxuICAgIElJSDogMzIxLFxuICAgIElJSTogMTQ5NyxcbiAgICBJSU86IDY1NixcbiAgICBJT086IDU0LFxuICAgIEtBSzogNDg0NSxcbiAgICBLS0E6IDMzODYsXG4gICAgS0tLOiAzMDY1LFxuICAgIE1ISDogLTQwNSxcbiAgICBNSEk6IDIwMSxcbiAgICBNTUg6IC0yNDEsXG4gICAgTU1NOiA2NjEsXG4gICAgTU9NOiA4NDEsXG4gIH07XG4gIHRoaXMuVFExX18gPSB7XG4gICAgQkhISDogLTIyNyxcbiAgICBCSEhJOiAzMTYsXG4gICAgQkhJSDogLTEzMixcbiAgICBCSUhIOiA2MCxcbiAgICBCSUlJOiAxNTk1LFxuICAgIEJOSEg6IC03NDQsXG4gICAgQk9ISDogMjI1LFxuICAgIEJPT086IC05MDgsXG4gICAgT0FLSzogNDgyLFxuICAgIE9ISEg6IDI4MSxcbiAgICBPSElIOiAyNDksXG4gICAgT0lISTogMjAwLFxuICAgIE9JSUg6IC02OCxcbiAgfTtcbiAgdGhpcy5UUTJfXyA9IHsgQklISDogLTE0MDEsIEJJSUk6IC0xMDMzLCBCS0FLOiAtNTQzLCBCT09POiAtNTU5MSB9O1xuICB0aGlzLlRRM19fID0ge1xuICAgIEJISEg6IDQ3OCxcbiAgICBCSEhNOiAtMTA3MyxcbiAgICBCSElIOiAyMjIsXG4gICAgQkhJSTogLTUwNCxcbiAgICBCSUlIOiAtMTE2LFxuICAgIEJJSUk6IC0xMDUsXG4gICAgQk1ISTogLTg2MyxcbiAgICBCTUhNOiAtNDY0LFxuICAgIEJPTUg6IDYyMCxcbiAgICBPSEhIOiAzNDYsXG4gICAgT0hISTogMTcyOSxcbiAgICBPSElJOiA5OTcsXG4gICAgT0hNSDogNDgxLFxuICAgIE9JSEg6IDYyMyxcbiAgICBPSUlIOiAxMzQ0LFxuICAgIE9LQUs6IDI3OTIsXG4gICAgT0tISDogNTg3LFxuICAgIE9LS0E6IDY3OSxcbiAgICBPT0hIOiAxMTAsXG4gICAgT09JSTogLTY4NSxcbiAgfTtcbiAgdGhpcy5UUTRfXyA9IHtcbiAgICBCSEhIOiAtNzIxLFxuICAgIEJISE06IC0zNjA0LFxuICAgIEJISUk6IC05NjYsXG4gICAgQklJSDogLTYwNyxcbiAgICBCSUlJOiAtMjE4MSxcbiAgICBPQUFBOiAtMjc2MyxcbiAgICBPQUtLOiAxODAsXG4gICAgT0hISDogLTI5NCxcbiAgICBPSEhJOiAyNDQ2LFxuICAgIE9ISE86IDQ4MCxcbiAgICBPSElIOiAtMTU3MyxcbiAgICBPSUhIOiAxOTM1LFxuICAgIE9JSEk6IC00OTMsXG4gICAgT0lJSDogNjI2LFxuICAgIE9JSUk6IC00MDA3LFxuICAgIE9LQUs6IC04MTU2LFxuICB9O1xuICB0aGlzLlRXMV9fID0geyDjgavjgaTjgYQ6IC00NjgxLCDmnbHkuqzpg706IDIwMjYgfTtcbiAgdGhpcy5UVzJfXyA9IHtcbiAgICDjgYLjgovnqIs6IC0yMDQ5LFxuICAgIOOBhOOBo+OBnzogLTEyNTYsXG4gICAg44GT44KN44GMOiAtMjQzNCxcbiAgICDjgZfjgofjgYY6IDM4NzMsXG4gICAg44Gd44Gu5b6MOiAtNDQzMCxcbiAgICDjgaDjgaPjgaY6IC0xMDQ5LFxuICAgIOOBpuOBhOOBnzogMTgzMyxcbiAgICDjgajjgZfjgaY6IC00NjU3LFxuICAgIOOBqOOCguOBqzogLTQ1MTcsXG4gICAg44KC44Gu44GnOiAxODgyLFxuICAgIOS4gOawl+OBqzogLTc5MixcbiAgICDliJ3jgoHjgaY6IC0xNTEyLFxuICAgIOWQjOaZguOBqzogLTgwOTcsXG4gICAg5aSn44GN44GqOiAtMTI1NSxcbiAgICDlr77jgZfjgaY6IC0yNzIxLFxuICAgIOekvuS8muWFmjogLTMyMTYsXG4gIH07XG4gIHRoaXMuVFczX18gPSB7XG4gICAg44GE44Gf44GgOiAtMTczNCxcbiAgICDjgZfjgabjgYQ6IDEzMTQsXG4gICAg44Go44GX44GmOiAtNDMxNCxcbiAgICDjgavjgaTjgYQ6IC01NDgzLFxuICAgIOOBq+OBqOOBozogLTU5ODksXG4gICAg44Gr5b2T44GfOiAtNjI0NyxcbiAgICBcIuOBruOBpyxcIjogLTcyNyxcbiAgICBcIuOBruOBp+OAgVwiOiAtNzI3LFxuICAgIOOBruOCguOBrjogLTYwMCxcbiAgICDjgozjgYvjgok6IC0zNzUyLFxuICAgIOWNgeS6jOaciDogLTIyODcsXG4gIH07XG4gIHRoaXMuVFc0X18gPSB7XG4gICAgXCLjgYTjgYYuXCI6IDg1NzYsXG4gICAgXCLjgYTjgYbjgIJcIjogODU3NixcbiAgICDjgYvjgonjgao6IC0yMzQ4LFxuICAgIOOBl+OBpuOBhDogMjk1OCxcbiAgICBcIuOBn+OBjCxcIjogMTUxNixcbiAgICBcIuOBn+OBjOOAgVwiOiAxNTE2LFxuICAgIOOBpuOBhOOCizogMTUzOCxcbiAgICDjgajjgYTjgYY6IDEzNDksXG4gICAg44G+44GX44GfOiA1NTQzLFxuICAgIOOBvuOBm+OCkzogMTA5NyxcbiAgICDjgojjgYbjgag6IC00MjU4LFxuICAgIOOCiOOCi+OBqDogNTg2NSxcbiAgfTtcbiAgdGhpcy5VQzFfXyA9IHsgQTogNDg0LCBLOiA5MywgTTogNjQ1LCBPOiAtNTA1IH07XG4gIHRoaXMuVUMyX18gPSB7IEE6IDgxOSwgSDogMTA1OSwgSTogNDA5LCBNOiAzOTg3LCBOOiA1Nzc1LCBPOiA2NDYgfTtcbiAgdGhpcy5VQzNfXyA9IHsgQTogLTEzNzAsIEk6IDIzMTEgfTtcbiAgdGhpcy5VQzRfXyA9IHtcbiAgICBBOiAtMjY0MyxcbiAgICBIOiAxODA5LFxuICAgIEk6IC0xMDMyLFxuICAgIEs6IC0zNDUwLFxuICAgIE06IDM1NjUsXG4gICAgTjogMzg3NixcbiAgICBPOiA2NjQ2LFxuICB9O1xuICB0aGlzLlVDNV9fID0geyBIOiAzMTMsIEk6IC0xMjM4LCBLOiAtNzk5LCBNOiA1MzksIE86IC04MzEgfTtcbiAgdGhpcy5VQzZfXyA9IHsgSDogLTUwNiwgSTogLTI1MywgSzogODcsIE06IDI0NywgTzogLTM4NyB9O1xuICB0aGlzLlVQMV9fID0geyBPOiAtMjE0IH07XG4gIHRoaXMuVVAyX18gPSB7IEI6IDY5LCBPOiA5MzUgfTtcbiAgdGhpcy5VUDNfXyA9IHsgQjogMTg5IH07XG4gIHRoaXMuVVExX18gPSB7XG4gICAgQkg6IDIxLFxuICAgIEJJOiAtMTIsXG4gICAgQks6IC05OSxcbiAgICBCTjogMTQyLFxuICAgIEJPOiAtNTYsXG4gICAgT0g6IC05NSxcbiAgICBPSTogNDc3LFxuICAgIE9LOiA0MTAsXG4gICAgT086IC0yNDIyLFxuICB9O1xuICB0aGlzLlVRMl9fID0geyBCSDogMjE2LCBCSTogMTEzLCBPSzogMTc1OSB9O1xuICB0aGlzLlVRM19fID0ge1xuICAgIEJBOiAtNDc5LFxuICAgIEJIOiA0MixcbiAgICBCSTogMTkxMyxcbiAgICBCSzogLTcxOTgsXG4gICAgQk06IDMxNjAsXG4gICAgQk46IDY0MjcsXG4gICAgQk86IDE0NzYxLFxuICAgIE9JOiAtODI3LFxuICAgIE9OOiAtMzIxMixcbiAgfTtcbiAgdGhpcy5VVzFfXyA9IHtcbiAgICBcIixcIjogMTU2LFxuICAgIFwi44CBXCI6IDE1NixcbiAgICBcIuOAjFwiOiAtNDYzLFxuICAgIOOBgjogLTk0MSxcbiAgICDjgYY6IC0xMjcsXG4gICAg44GMOiAtNTUzLFxuICAgIOOBjTogMTIxLFxuICAgIOOBkzogNTA1LFxuICAgIOOBpzogLTIwMSxcbiAgICDjgag6IC01NDcsXG4gICAg44GpOiAtMTIzLFxuICAgIOOBqzogLTc4OSxcbiAgICDjga46IC0xODUsXG4gICAg44GvOiAtODQ3LFxuICAgIOOCgjogLTQ2NixcbiAgICDjgoQ6IC00NzAsXG4gICAg44KIOiAxODIsXG4gICAg44KJOiAtMjkyLFxuICAgIOOCijogMjA4LFxuICAgIOOCjDogMTY5LFxuICAgIOOCkjogLTQ0NixcbiAgICDjgpM6IC0xMzcsXG4gICAgXCLjg7tcIjogLTEzNSxcbiAgICDkuLs6IC00MDIsXG4gICAg5LqsOiAtMjY4LFxuICAgIOWMujogLTkxMixcbiAgICDljYg6IDg3MSxcbiAgICDlm706IC00NjAsXG4gICAg5aSnOiA1NjEsXG4gICAg5aeUOiA3MjksXG4gICAg5biCOiAtNDExLFxuICAgIOaXpTogLTE0MSxcbiAgICDnkIY6IDM2MSxcbiAgICDnlJ86IC00MDgsXG4gICAg55yMOiAtMzg2LFxuICAgIOmDvTogLTcxOCxcbiAgICBcIu+9olwiOiAtNDYzLFxuICAgIFwi772lXCI6IC0xMzUsXG4gIH07XG4gIHRoaXMuVVcyX18gPSB7XG4gICAgXCIsXCI6IC04MjksXG4gICAgXCLjgIFcIjogLTgyOSxcbiAgICDjgIc6IDg5MixcbiAgICBcIuOAjFwiOiAtNjQ1LFxuICAgIFwi44CNXCI6IDMxNDUsXG4gICAg44GCOiAtNTM4LFxuICAgIOOBhDogNTA1LFxuICAgIOOBhjogMTM0LFxuICAgIOOBijogLTUwMixcbiAgICDjgYs6IDE0NTQsXG4gICAg44GMOiAtODU2LFxuICAgIOOBjzogLTQxMixcbiAgICDjgZM6IDExNDEsXG4gICAg44GVOiA4NzgsXG4gICAg44GWOiA1NDAsXG4gICAg44GXOiAxNTI5LFxuICAgIOOBmTogLTY3NSxcbiAgICDjgZs6IDMwMCxcbiAgICDjgZ06IC0xMDExLFxuICAgIOOBnzogMTg4LFxuICAgIOOBoDogMTgzNyxcbiAgICDjgaQ6IC05NDksXG4gICAg44GmOiAtMjkxLFxuICAgIOOBpzogLTI2OCxcbiAgICDjgag6IC05ODEsXG4gICAg44GpOiAxMjczLFxuICAgIOOBqjogMTA2MyxcbiAgICDjgas6IC0xNzY0LFxuICAgIOOBrjogMTMwLFxuICAgIOOBrzogLTQwOSxcbiAgICDjgbI6IC0xMjczLFxuICAgIOOBuTogMTI2MSxcbiAgICDjgb46IDYwMCxcbiAgICDjgoI6IC0xMjYzLFxuICAgIOOChDogLTQwMixcbiAgICDjgog6IDE2MzksXG4gICAg44KKOiAtNTc5LFxuICAgIOOCizogLTY5NCxcbiAgICDjgow6IDU3MSxcbiAgICDjgpI6IC0yNTE2LFxuICAgIOOCkzogMjA5NSxcbiAgICDjgqI6IC01ODcsXG4gICAg44KrOiAzMDYsXG4gICAg44KtOiA1NjgsXG4gICAg44ODOiA4MzEsXG4gICAg5LiJOiAtNzU4LFxuICAgIOS4jTogLTIxNTAsXG4gICAg5LiWOiAtMzAyLFxuICAgIOS4rTogLTk2OCxcbiAgICDkuLs6IC04NjEsXG4gICAg5LqLOiA0OTIsXG4gICAg5Lq6OiAtMTIzLFxuICAgIOS8mjogOTc4LFxuICAgIOS/nTogMzYyLFxuICAgIOWFpTogNTQ4LFxuICAgIOWInTogLTMwMjUsXG4gICAg5YmvOiAtMTU2NixcbiAgICDljJc6IC0zNDE0LFxuICAgIOWMujogLTQyMixcbiAgICDlpKc6IC0xNzY5LFxuICAgIOWkqTogLTg2NSxcbiAgICDlpKo6IC00ODMsXG4gICAg5a2QOiAtMTUxOSxcbiAgICDlraY6IDc2MCxcbiAgICDlrp86IDEwMjMsXG4gICAg5bCPOiAtMjAwOSxcbiAgICDluII6IC04MTMsXG4gICAg5bm0OiAtMTA2MCxcbiAgICDlvLc6IDEwNjcsXG4gICAg5omLOiAtMTUxOSxcbiAgICDmj7o6IC0xMDMzLFxuICAgIOaUvzogMTUyMixcbiAgICDmloc6IC0xMzU1LFxuICAgIOaWsDogLTE2ODIsXG4gICAg5pelOiAtMTgxNSxcbiAgICDmmI46IC0xNDYyLFxuICAgIOacgDogLTYzMCxcbiAgICDmnJ06IC0xODQzLFxuICAgIOacrDogLTE2NTAsXG4gICAg5p2xOiAtOTMxLFxuICAgIOaenDogLTY2NSxcbiAgICDmrKE6IC0yMzc4LFxuICAgIOawkTogLTE4MCxcbiAgICDmsJc6IC0xNzQwLFxuICAgIOeQhjogNzUyLFxuICAgIOeZujogNTI5LFxuICAgIOebrjogLTE1ODQsXG4gICAg55u4OiAtMjQyLFxuICAgIOecjDogLTExNjUsXG4gICAg56uLOiAtNzYzLFxuICAgIOesrDogODEwLFxuICAgIOexszogNTA5LFxuICAgIOiHqjogLTEzNTMsXG4gICAg6KGMOiA4MzgsXG4gICAg6KW/OiAtNzQ0LFxuICAgIOimizogLTM4NzQsXG4gICAg6Kq/OiAxMDEwLFxuICAgIOitsDogMTE5OCxcbiAgICDovrw6IDMwNDEsXG4gICAg6ZaLOiAxNzU4LFxuICAgIOmWkzogLTEyNTcsXG4gICAgXCLvvaJcIjogLTY0NSxcbiAgICBcIu+9o1wiOiAzMTQ1LFxuICAgIO+9rzogODMxLFxuICAgIO+9sTogLTU4NyxcbiAgICDvvbY6IDMwNixcbiAgICDvvbc6IDU2OCxcbiAgfTtcbiAgdGhpcy5VVzNfXyA9IHtcbiAgICBcIixcIjogNDg4OSxcbiAgICAxOiAtODAwLFxuICAgIFwi4oiSXCI6IC0xNzIzLFxuICAgIFwi44CBXCI6IDQ4ODksXG4gICAg44CFOiAtMjMxMSxcbiAgICDjgIc6IDU4MjcsXG4gICAgXCLjgI1cIjogMjY3MCxcbiAgICBcIuOAk1wiOiAtMzU3MyxcbiAgICDjgYI6IC0yNjk2LFxuICAgIOOBhDogMTAwNixcbiAgICDjgYY6IDIzNDIsXG4gICAg44GIOiAxOTgzLFxuICAgIOOBijogLTQ4NjQsXG4gICAg44GLOiAtMTE2MyxcbiAgICDjgYw6IDMyNzEsXG4gICAg44GPOiAxMDA0LFxuICAgIOOBkTogMzg4LFxuICAgIOOBkjogNDAxLFxuICAgIOOBkzogLTM1NTIsXG4gICAg44GUOiAtMzExNixcbiAgICDjgZU6IC0xMDU4LFxuICAgIOOBlzogLTM5NSxcbiAgICDjgZk6IDU4NCxcbiAgICDjgZs6IDM2ODUsXG4gICAg44GdOiAtNTIyOCxcbiAgICDjgZ86IDg0MixcbiAgICDjgaE6IC01MjEsXG4gICAg44GjOiAtMTQ0NCxcbiAgICDjgaQ6IC0xMDgxLFxuICAgIOOBpjogNjE2NyxcbiAgICDjgac6IDIzMTgsXG4gICAg44GoOiAxNjkxLFxuICAgIOOBqTogLTg5OSxcbiAgICDjgao6IC0yNzg4LFxuICAgIOOBqzogMjc0NSxcbiAgICDjga46IDQwNTYsXG4gICAg44GvOiA0NTU1LFxuICAgIOOBsjogLTIxNzEsXG4gICAg44G1OiAtMTc5OCxcbiAgICDjgbg6IDExOTksXG4gICAg44G7OiAtNTUxNixcbiAgICDjgb46IC00Mzg0LFxuICAgIOOBvzogLTEyMCxcbiAgICDjgoE6IDEyMDUsXG4gICAg44KCOiAyMzIzLFxuICAgIOOChDogLTc4OCxcbiAgICDjgog6IC0yMDIsXG4gICAg44KJOiA3MjcsXG4gICAg44KKOiA2NDksXG4gICAg44KLOiA1OTA1LFxuICAgIOOCjDogMjc3MyxcbiAgICDjgo86IC0xMjA3LFxuICAgIOOCkjogNjYyMCxcbiAgICDjgpM6IC01MTgsXG4gICAg44KiOiA1NTEsXG4gICAg44KwOiAxMzE5LFxuICAgIOOCuTogODc0LFxuICAgIOODgzogLTEzNTAsXG4gICAg44OIOiA1MjEsXG4gICAg44OgOiAxMTA5LFxuICAgIOODqzogMTU5MSxcbiAgICDjg606IDIyMDEsXG4gICAg44OzOiAyNzgsXG4gICAgXCLjg7tcIjogLTM3OTQsXG4gICAg5LiAOiAtMTYxOSxcbiAgICDkuIs6IC0xNzU5LFxuICAgIOS4ljogLTIwODcsXG4gICAg5LihOiAzODE1LFxuICAgIOS4rTogNjUzLFxuICAgIOS4uzogLTc1OCxcbiAgICDkuog6IC0xMTkzLFxuICAgIOS6jDogOTc0LFxuICAgIOS6ujogMjc0MixcbiAgICDku4o6IDc5MixcbiAgICDku5Y6IDE4ODksXG4gICAg5LulOiAtMTM2OCxcbiAgICDkvY46IDgxMSxcbiAgICDkvZU6IDQyNjUsXG4gICAg5L2cOiAtMzYxLFxuICAgIOS/nTogLTI0MzksXG4gICAg5YWDOiA0ODU4LFxuICAgIOWFmjogMzU5MyxcbiAgICDlhag6IDE1NzQsXG4gICAg5YWsOiAtMzAzMCxcbiAgICDlha06IDc1NSxcbiAgICDlhbE6IC0xODgwLFxuICAgIOWGhjogNTgwNyxcbiAgICDlho06IDMwOTUsXG4gICAg5YiGOiA0NTcsXG4gICAg5YidOiAyNDc1LFxuICAgIOWIpTogMTEyOSxcbiAgICDliY06IDIyODYsXG4gICAg5YmvOiA0NDM3LFxuICAgIOWKmzogMzY1LFxuICAgIOWLlTogLTk0OSxcbiAgICDli5k6IC0xODcyLFxuICAgIOWMljogMTMyNyxcbiAgICDljJc6IC0xMDM4LFxuICAgIOWMujogNDY0NixcbiAgICDljYM6IC0yMzA5LFxuICAgIOWNiDogLTc4MyxcbiAgICDljZQ6IC0xMDA2LFxuICAgIOWPozogNDgzLFxuICAgIOWPszogMTIzMyxcbiAgICDlkIQ6IDM1ODgsXG4gICAg5ZCIOiAtMjQxLFxuICAgIOWQjDogMzkwNixcbiAgICDlkow6IC04MzcsXG4gICAg5ZOhOiA0NTEzLFxuICAgIOWbvTogNjQyLFxuICAgIOWeizogMTM4OSxcbiAgICDloLQ6IDEyMTksXG4gICAg5aSWOiAtMjQxLFxuICAgIOWmuzogMjAxNixcbiAgICDlraY6IC0xMzU2LFxuICAgIOWuiTogLTQyMyxcbiAgICDlrp86IC0xMDA4LFxuICAgIOWutjogMTA3OCxcbiAgICDlsI86IC01MTMsXG4gICAg5bCROiAtMzEwMixcbiAgICDlt546IDExNTUsXG4gICAg5biCOiAzMTk3LFxuICAgIOW5szogLTE4MDQsXG4gICAg5bm0OiAyNDE2LFxuICAgIOW6gzogLTEwMzAsXG4gICAg5bqcOiAxNjA1LFxuICAgIOW6pjogMTQ1MixcbiAgICDlu7o6IC0yMzUyLFxuICAgIOW9kzogLTM4ODUsXG4gICAg5b6XOiAxOTA1LFxuICAgIOaAnTogLTEyOTEsXG4gICAg5oCnOiAxODIyLFxuICAgIOaIuDogLTQ4OCxcbiAgICDmjIc6IC0zOTczLFxuICAgIOaUvzogLTIwMTMsXG4gICAg5pWZOiAtMTQ3OSxcbiAgICDmlbA6IDMyMjIsXG4gICAg5paHOiAtMTQ4OSxcbiAgICDmlrA6IDE3NjQsXG4gICAg5pelOiAyMDk5LFxuICAgIOaXpzogNTc5MixcbiAgICDmmKg6IC02NjEsXG4gICAg5pmCOiAtMTI0OCxcbiAgICDmm5w6IC05NTEsXG4gICAg5pyAOiAtOTM3LFxuICAgIOaciDogNDEyNSxcbiAgICDmnJ86IDM2MCxcbiAgICDmnY46IDMwOTQsXG4gICAg5p2ROiAzNjQsXG4gICAg5p2xOiAtODA1LFxuICAgIOaguDogNTE1NixcbiAgICDmo646IDI0MzgsXG4gICAg5qWtOiA0ODQsXG4gICAg5rCPOiAyNjEzLFxuICAgIOawkTogLTE2OTQsXG4gICAg5rG6OiAtMTA3MyxcbiAgICDms5U6IDE4NjgsXG4gICAg5rW3OiAtNDk1LFxuICAgIOeEoTogOTc5LFxuICAgIOeJqTogNDYxLFxuICAgIOeJuTogLTM4NTAsXG4gICAg55SfOiAtMjczLFxuICAgIOeUqDogOTE0LFxuICAgIOeUujogMTIxNSxcbiAgICDnmoQ6IDczMTMsXG4gICAg55u0OiAtMTgzNSxcbiAgICDnnIE6IDc5MixcbiAgICDnnIw6IDYyOTMsXG4gICAg55+lOiAtMTUyOCxcbiAgICDnp4E6IDQyMzEsXG4gICAg56iOOiA0MDEsXG4gICAg56uLOiAtOTYwLFxuICAgIOesrDogMTIwMSxcbiAgICDnsbM6IDc3NjcsXG4gICAg57O7OiAzMDY2LFxuICAgIOe0hDogMzY2MyxcbiAgICDntJo6IDEzODQsXG4gICAg57WxOiAtNDIyOSxcbiAgICDnt486IDExNjMsXG4gICAg57eaOiAxMjU1LFxuICAgIOiAhTogNjQ1NyxcbiAgICDog706IDcyNSxcbiAgICDoh6o6IC0yODY5LFxuICAgIOiLsTogNzg1LFxuICAgIOimizogMTA0NCxcbiAgICDoqr86IC01NjIsXG4gICAg6LKhOiAtNzMzLFxuICAgIOiyuzogMTc3NyxcbiAgICDou4o6IDE4MzUsXG4gICAg6LuNOiAxMzc1LFxuICAgIOi+vDogLTE1MDQsXG4gICAg6YCaOiAtMTEzNixcbiAgICDpgbg6IC02ODEsXG4gICAg6YOOOiAxMDI2LFxuICAgIOmDoTogNDQwNCxcbiAgICDpg6g6IDEyMDAsXG4gICAg6YeROiAyMTYzLFxuICAgIOmVtzogNDIxLFxuICAgIOmWizogLTE0MzIsXG4gICAg6ZaTOiAxMzAyLFxuICAgIOmWojogLTEyODIsXG4gICAg6ZuoOiAyMDA5LFxuICAgIOmbuzogLTEwNDUsXG4gICAg6Z2eOiAyMDY2LFxuICAgIOmnhTogMTYyMCxcbiAgICBcIu+8kVwiOiAtODAwLFxuICAgIFwi772jXCI6IDI2NzAsXG4gICAgXCLvvaVcIjogLTM3OTQsXG4gICAg772vOiAtMTM1MCxcbiAgICDvvbE6IDU1MSxcbiAgICDvvbjvvp46IDEzMTksXG4gICAg7729OiA4NzQsXG4gICAg776EOiA1MjEsXG4gICAg776ROiAxMTA5LFxuICAgIO++mTogMTU5MSxcbiAgICDvvps6IDIyMDEsXG4gICAg776dOiAyNzgsXG4gIH07XG4gIHRoaXMuVVc0X18gPSB7XG4gICAgXCIsXCI6IDM5MzAsXG4gICAgXCIuXCI6IDM1MDgsXG4gICAgXCLigJVcIjogLTQ4NDEsXG4gICAgXCLjgIFcIjogMzkzMCxcbiAgICBcIuOAglwiOiAzNTA4LFxuICAgIOOAhzogNDk5OSxcbiAgICBcIuOAjFwiOiAxODk1LFxuICAgIFwi44CNXCI6IDM3OTgsXG4gICAgXCLjgJNcIjogLTUxNTYsXG4gICAg44GCOiA0NzUyLFxuICAgIOOBhDogLTM0MzUsXG4gICAg44GGOiAtNjQwLFxuICAgIOOBiDogLTI1MTQsXG4gICAg44GKOiAyNDA1LFxuICAgIOOBizogNTMwLFxuICAgIOOBjDogNjAwNixcbiAgICDjgY06IC00NDgyLFxuICAgIOOBjjogLTM4MjEsXG4gICAg44GPOiAtMzc4OCxcbiAgICDjgZE6IC00Mzc2LFxuICAgIOOBkjogLTQ3MzQsXG4gICAg44GTOiAyMjU1LFxuICAgIOOBlDogMTk3OSxcbiAgICDjgZU6IDI4NjQsXG4gICAg44GXOiAtODQzLFxuICAgIOOBmDogLTI1MDYsXG4gICAg44GZOiAtNzMxLFxuICAgIOOBmjogMTI1MSxcbiAgICDjgZs6IDE4MSxcbiAgICDjgZ06IDQwOTEsXG4gICAg44GfOiA1MDM0LFxuICAgIOOBoDogNTQwOCxcbiAgICDjgaE6IC0zNjU0LFxuICAgIOOBozogLTU4ODIsXG4gICAg44GkOiAtMTY1OSxcbiAgICDjgaY6IDM5OTQsXG4gICAg44GnOiA3NDEwLFxuICAgIOOBqDogNDU0NyxcbiAgICDjgao6IDU0MzMsXG4gICAg44GrOiA2NDk5LFxuICAgIOOBrDogMTg1MyxcbiAgICDjga06IDE0MTMsXG4gICAg44GuOiA3Mzk2LFxuICAgIOOBrzogODU3OCxcbiAgICDjgbA6IDE5NDAsXG4gICAg44GyOiA0MjQ5LFxuICAgIOOBszogLTQxMzQsXG4gICAg44G1OiAxMzQ1LFxuICAgIOOBuDogNjY2NSxcbiAgICDjgbk6IC03NDQsXG4gICAg44G7OiAxNDY0LFxuICAgIOOBvjogMTA1MSxcbiAgICDjgb86IC0yMDgyLFxuICAgIOOCgDogLTg4MixcbiAgICDjgoE6IC01MDQ2LFxuICAgIOOCgjogNDE2OSxcbiAgICDjgoM6IC0yNjY2LFxuICAgIOOChDogMjc5NSxcbiAgICDjgoc6IC0xNTQ0LFxuICAgIOOCiDogMzM1MSxcbiAgICDjgok6IC0yOTIyLFxuICAgIOOCijogLTk3MjYsXG4gICAg44KLOiAtMTQ4OTYsXG4gICAg44KMOiAtMjYxMyxcbiAgICDjgo06IC00NTcwLFxuICAgIOOCjzogLTE3ODMsXG4gICAg44KSOiAxMzE1MCxcbiAgICDjgpM6IC0yMzUyLFxuICAgIOOCqzogMjE0NSxcbiAgICDjgrM6IDE3ODksXG4gICAg44K7OiAxMjg3LFxuICAgIOODgzogLTcyNCxcbiAgICDjg4g6IC00MDMsXG4gICAg44OhOiAtMTYzNSxcbiAgICDjg6k6IC04ODEsXG4gICAg44OqOiAtNTQxLFxuICAgIOODqzogLTg1NixcbiAgICDjg7M6IC0zNjM3LFxuICAgIFwi44O7XCI6IC00MzcxLFxuICAgIOODvDogLTExODcwLFxuICAgIOS4gDogLTIwNjksXG4gICAg5LitOiAyMjEwLFxuICAgIOS6iDogNzgyLFxuICAgIOS6izogLTE5MCxcbiAgICDkupU6IC0xNzY4LFxuICAgIOS6ujogMTAzNixcbiAgICDku6U6IDU0NCxcbiAgICDkvJo6IDk1MCxcbiAgICDkvZM6IC0xMjg2LFxuICAgIOS9nDogNTMwLFxuICAgIOWBtDogNDI5MixcbiAgICDlhYg6IDYwMSxcbiAgICDlhZo6IC0yMDA2LFxuICAgIOWFsTogLTEyMTIsXG4gICAg5YaFOiA1ODQsXG4gICAg5YaGOiA3ODgsXG4gICAg5YidOiAxMzQ3LFxuICAgIOWJjTogMTYyMyxcbiAgICDlia86IDM4NzksXG4gICAg5YqbOiAtMzAyLFxuICAgIOWLlTogLTc0MCxcbiAgICDli5k6IC0yNzE1LFxuICAgIOWMljogNzc2LFxuICAgIOWMujogNDUxNyxcbiAgICDljZQ6IDEwMTMsXG4gICAg5Y+COiAxNTU1LFxuICAgIOWQiDogLTE4MzQsXG4gICAg5ZKMOiAtNjgxLFxuICAgIOWToTogLTkxMCxcbiAgICDlmag6IC04NTEsXG4gICAg5ZueOiAxNTAwLFxuICAgIOWbvTogLTYxOSxcbiAgICDlnJI6IC0xMjAwLFxuICAgIOWcsDogODY2LFxuICAgIOWgtDogLTE0MTAsXG4gICAg5aGBOiAtMjA5NCxcbiAgICDlo6s6IC0xNDEzLFxuICAgIOWkmjogMTA2NyxcbiAgICDlpKc6IDU3MSxcbiAgICDlrZA6IC00ODAyLFxuICAgIOWtpjogLTEzOTcsXG4gICAg5a6aOiAtMTA1NyxcbiAgICDlr7o6IC04MDksXG4gICAg5bCPOiAxOTEwLFxuICAgIOWxizogLTEzMjgsXG4gICAg5bGxOiAtMTUwMCxcbiAgICDls7Y6IC0yMDU2LFxuICAgIOW3nTogLTI2NjcsXG4gICAg5biCOiAyNzcxLFxuICAgIOW5tDogMzc0LFxuICAgIOW6gTogLTQ1NTYsXG4gICAg5b6MOiA0NTYsXG4gICAg5oCnOiA1NTMsXG4gICAg5oSfOiA5MTYsXG4gICAg5omAOiAtMTU2NixcbiAgICDmlK86IDg1NixcbiAgICDmlLk6IDc4NyxcbiAgICDmlL86IDIxODIsXG4gICAg5pWZOiA3MDQsXG4gICAg5paHOiA1MjIsXG4gICAg5pa5OiAtODU2LFxuICAgIOaXpTogMTc5OCxcbiAgICDmmYI6IDE4MjksXG4gICAg5pyAOiA4NDUsXG4gICAg5pyIOiAtOTA2NixcbiAgICDmnKg6IC00ODUsXG4gICAg5p2lOiAtNDQyLFxuICAgIOagoTogLTM2MCxcbiAgICDmpa06IC0xMDQzLFxuICAgIOawjzogNTM4OCxcbiAgICDmsJE6IC0yNzE2LFxuICAgIOawlzogLTkxMCxcbiAgICDmsqI6IC05MzksXG4gICAg5riIOiAtNTQzLFxuICAgIOeJqTogLTczNSxcbiAgICDnjoc6IDY3MixcbiAgICDnkIM6IC0xMjY3LFxuICAgIOeUnzogLTEyODYsXG4gICAg55SjOiAtMTEwMSxcbiAgICDnlLA6IC0yOTAwLFxuICAgIOeUujogMTgyNixcbiAgICDnmoQ6IDI1ODYsXG4gICAg55uuOiA5MjIsXG4gICAg55yBOiAtMzQ4NSxcbiAgICDnnIw6IDI5OTcsXG4gICAg56m6OiAtODY3LFxuICAgIOerizogLTIxMTIsXG4gICAg56ysOiA3ODgsXG4gICAg57GzOiAyOTM3LFxuICAgIOezuzogNzg2LFxuICAgIOe0hDogMjE3MSxcbiAgICDntYw6IDExNDYsXG4gICAg57WxOiAtMTE2OSxcbiAgICDnt486IDk0MCxcbiAgICDnt5o6IC05OTQsXG4gICAg572yOiA3NDksXG4gICAg6ICFOiAyMTQ1LFxuICAgIOiDvTogLTczMCxcbiAgICDoiKw6IC04NTIsXG4gICAg6KGMOiAtNzkyLFxuICAgIOimjzogNzkyLFxuICAgIOitpjogLTExODQsXG4gICAg6K2wOiAtMjQ0LFxuICAgIOiwtzogLTEwMDAsXG4gICAg6LOeOiA3MzAsXG4gICAg6LuKOiAtMTQ4MSxcbiAgICDou406IDExNTgsXG4gICAg6LyqOiAtMTQzMyxcbiAgICDovrw6IC0zMzcwLFxuICAgIOi/kTogOTI5LFxuICAgIOmBkzogLTEyOTEsXG4gICAg6YG4OiAyNTk2LFxuICAgIOmDjjogLTQ4NjYsXG4gICAg6YO9OiAxMTkyLFxuICAgIOmHjjogLTExMDAsXG4gICAg6YqAOiAtMjIxMyxcbiAgICDplbc6IDM1NyxcbiAgICDplpM6IC0yMzQ0LFxuICAgIOmZojogLTIyOTcsXG4gICAg6ZqbOiAtMjYwNCxcbiAgICDpm7s6IC04NzgsXG4gICAg6aCYOiAtMTY1OSxcbiAgICDpoYw6IC03OTIsXG4gICAg6aSoOiAtMTk4NCxcbiAgICDpppY6IDE3NDksXG4gICAg6auYOiAyMTIwLFxuICAgIFwi772iXCI6IDE4OTUsXG4gICAgXCLvvaNcIjogMzc5OCxcbiAgICBcIu+9pVwiOiAtNDM3MSxcbiAgICDvva86IC03MjQsXG4gICAg772wOiAtMTE4NzAsXG4gICAg7722OiAyMTQ1LFxuICAgIO+9ujogMTc4OSxcbiAgICDvvb46IDEyODcsXG4gICAg776EOiAtNDAzLFxuICAgIO++kjogLTE2MzUsXG4gICAg776XOiAtODgxLFxuICAgIO++mDogLTU0MSxcbiAgICDvvpk6IC04NTYsXG4gICAg776dOiAtMzYzNyxcbiAgfTtcbiAgdGhpcy5VVzVfXyA9IHtcbiAgICBcIixcIjogNDY1LFxuICAgIFwiLlwiOiAtMjk5LFxuICAgIDE6IC01MTQsXG4gICAgRTI6IC0zMjc2OCxcbiAgICBcIl1cIjogLTI3NjIsXG4gICAgXCLjgIFcIjogNDY1LFxuICAgIFwi44CCXCI6IC0yOTksXG4gICAgXCLjgIxcIjogMzYzLFxuICAgIOOBgjogMTY1NSxcbiAgICDjgYQ6IDMzMSxcbiAgICDjgYY6IC01MDMsXG4gICAg44GIOiAxMTk5LFxuICAgIOOBijogNTI3LFxuICAgIOOBizogNjQ3LFxuICAgIOOBjDogLTQyMSxcbiAgICDjgY06IDE2MjQsXG4gICAg44GOOiAxOTcxLFxuICAgIOOBjzogMzEyLFxuICAgIOOBkjogLTk4MyxcbiAgICDjgZU6IC0xNTM3LFxuICAgIOOBlzogLTEzNzEsXG4gICAg44GZOiAtODUyLFxuICAgIOOBoDogLTExODYsXG4gICAg44GhOiAxMDkzLFxuICAgIOOBozogNTIsXG4gICAg44GkOiA5MjEsXG4gICAg44GmOiAtMTgsXG4gICAg44GnOiAtODUwLFxuICAgIOOBqDogLTEyNyxcbiAgICDjgak6IDE2ODIsXG4gICAg44GqOiAtNzg3LFxuICAgIOOBqzogLTEyMjQsXG4gICAg44GuOiAtNjM1LFxuICAgIOOBrzogLTU3OCxcbiAgICDjgbk6IDEwMDEsXG4gICAg44G/OiA1MDIsXG4gICAg44KBOiA4NjUsXG4gICAg44KDOiAzMzUwLFxuICAgIOOChzogODU0LFxuICAgIOOCijogLTIwOCxcbiAgICDjgos6IDQyOSxcbiAgICDjgow6IDUwNCxcbiAgICDjgo86IDQxOSxcbiAgICDjgpI6IC0xMjY0LFxuICAgIOOCkzogMzI3LFxuICAgIOOCpDogMjQxLFxuICAgIOODqzogNDUxLFxuICAgIOODszogLTM0MyxcbiAgICDkuK06IC04NzEsXG4gICAg5LqsOiA3MjIsXG4gICAg5LyaOiAtMTE1MyxcbiAgICDlhZo6IC02NTQsXG4gICAg5YuZOiAzNTE5LFxuICAgIOWMujogLTkwMSxcbiAgICDlkYo6IDg0OCxcbiAgICDlk6E6IDIxMDQsXG4gICAg5aSnOiAtMTI5NixcbiAgICDlraY6IC01NDgsXG4gICAg5a6aOiAxNzg1LFxuICAgIOW1kDogLTEzMDQsXG4gICAg5biCOiAtMjk5MSxcbiAgICDluK06IDkyMSxcbiAgICDlubQ6IDE3NjMsXG4gICAg5oCdOiA4NzIsXG4gICAg5omAOiAtODE0LFxuICAgIOaMmTogMTYxOCxcbiAgICDmlrA6IC0xNjgyLFxuICAgIOaXpTogMjE4LFxuICAgIOaciDogLTQzNTMsXG4gICAg5p+7OiA5MzIsXG4gICAg5qC8OiAxMzU2LFxuICAgIOapnzogLTE1MDgsXG4gICAg5rCPOiAtMTM0NyxcbiAgICDnlLA6IDI0MCxcbiAgICDnlLo6IC0zOTEyLFxuICAgIOeahDogLTMxNDksXG4gICAg55u4OiAxMzE5LFxuICAgIOecgTogLTEwNTIsXG4gICAg55yMOiAtNDAwMyxcbiAgICDnoJQ6IC05OTcsXG4gICAg56S+OiAtMjc4LFxuICAgIOepujogLTgxMyxcbiAgICDntbE6IDE5NTUsXG4gICAg6ICFOiAtMjIzMyxcbiAgICDooag6IDY2MyxcbiAgICDoqp46IC0xMDczLFxuICAgIOitsDogMTIxOSxcbiAgICDpgbg6IC0xMDE4LFxuICAgIOmDjjogLTM2OCxcbiAgICDplbc6IDc4NixcbiAgICDplpM6IDExOTEsXG4gICAg6aGMOiAyMzY4LFxuICAgIOmkqDogLTY4OSxcbiAgICBcIu+8kVwiOiAtNTE0LFxuICAgIO+8pe+8kjogLTMyNzY4LFxuICAgIFwi772iXCI6IDM2MyxcbiAgICDvvbI6IDI0MSxcbiAgICDvvpk6IDQ1MSxcbiAgICDvvp06IC0zNDMsXG4gIH07XG4gIHRoaXMuVVc2X18gPSB7XG4gICAgXCIsXCI6IDIyNyxcbiAgICBcIi5cIjogODA4LFxuICAgIDE6IC0yNzAsXG4gICAgRTE6IDMwNixcbiAgICBcIuOAgVwiOiAyMjcsXG4gICAgXCLjgIJcIjogODA4LFxuICAgIOOBgjogLTMwNyxcbiAgICDjgYY6IDE4OSxcbiAgICDjgYs6IDI0MSxcbiAgICDjgYw6IC03MyxcbiAgICDjgY86IC0xMjEsXG4gICAg44GTOiAtMjAwLFxuICAgIOOBmDogMTc4MixcbiAgICDjgZk6IDM4MyxcbiAgICDjgZ86IC00MjgsXG4gICAg44GjOiA1NzMsXG4gICAg44GmOiAtMTAxNCxcbiAgICDjgac6IDEwMSxcbiAgICDjgag6IC0xMDUsXG4gICAg44GqOiAtMjUzLFxuICAgIOOBqzogLTE0OSxcbiAgICDjga46IC00MTcsXG4gICAg44GvOiAtMjM2LFxuICAgIOOCgjogLTIwNixcbiAgICDjgoo6IDE4NyxcbiAgICDjgos6IC0xMzUsXG4gICAg44KSOiAxOTUsXG4gICAg44OrOiAtNjczLFxuICAgIOODszogLTQ5NixcbiAgICDkuIA6IC0yNzcsXG4gICAg5LitOiAyMDEsXG4gICAg5Lu2OiAtODAwLFxuICAgIOS8mjogNjI0LFxuICAgIOWJjTogMzAyLFxuICAgIOWMujogMTc5MixcbiAgICDlk6E6IC0xMjEyLFxuICAgIOWnlDogNzk4LFxuICAgIOWtpjogLTk2MCxcbiAgICDluII6IDg4NyxcbiAgICDluoM6IC02OTUsXG4gICAg5b6MOiA1MzUsXG4gICAg5qWtOiAtNjk3LFxuICAgIOebuDogNzUzLFxuICAgIOekvjogLTUwNyxcbiAgICDnpo86IDk3NCxcbiAgICDnqbo6IC04MjIsXG4gICAg6ICFOiAxODExLFxuICAgIOmAozogNDYzLFxuICAgIOmDjjogMTA4MixcbiAgICBcIu+8kVwiOiAtMjcwLFxuICAgIO+8pe+8kTogMzA2LFxuICAgIO++mTogLTY3MyxcbiAgICDvvp06IC00OTYsXG4gIH07XG5cbiAgcmV0dXJuIHRoaXM7XG59XG5cblRpbnlTZWdtZW50ZXIucHJvdG90eXBlLmN0eXBlXyA9IGZ1bmN0aW9uIChzdHIpIHtcbiAgZm9yICh2YXIgaSBpbiB0aGlzLmNoYXJ0eXBlXykge1xuICAgIGlmIChzdHIubWF0Y2godGhpcy5jaGFydHlwZV9baV1bMF0pKSB7XG4gICAgICByZXR1cm4gdGhpcy5jaGFydHlwZV9baV1bMV07XG4gICAgfVxuICB9XG4gIHJldHVybiBcIk9cIjtcbn07XG5cblRpbnlTZWdtZW50ZXIucHJvdG90eXBlLnRzXyA9IGZ1bmN0aW9uICh2KSB7XG4gIGlmICh2KSB7XG4gICAgcmV0dXJuIHY7XG4gIH1cbiAgcmV0dXJuIDA7XG59O1xuXG5UaW55U2VnbWVudGVyLnByb3RvdHlwZS5zZWdtZW50ID0gZnVuY3Rpb24gKGlucHV0KSB7XG4gIGlmIChpbnB1dCA9PSBudWxsIHx8IGlucHV0ID09IHVuZGVmaW5lZCB8fCBpbnB1dCA9PSBcIlwiKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgdmFyIHNlZyA9IFtcIkIzXCIsIFwiQjJcIiwgXCJCMVwiXTtcbiAgdmFyIGN0eXBlID0gW1wiT1wiLCBcIk9cIiwgXCJPXCJdO1xuICB2YXIgbyA9IGlucHV0LnNwbGl0KFwiXCIpO1xuICBmb3IgKGkgPSAwOyBpIDwgby5sZW5ndGg7ICsraSkge1xuICAgIHNlZy5wdXNoKG9baV0pO1xuICAgIGN0eXBlLnB1c2godGhpcy5jdHlwZV8ob1tpXSkpO1xuICB9XG4gIHNlZy5wdXNoKFwiRTFcIik7XG4gIHNlZy5wdXNoKFwiRTJcIik7XG4gIHNlZy5wdXNoKFwiRTNcIik7XG4gIGN0eXBlLnB1c2goXCJPXCIpO1xuICBjdHlwZS5wdXNoKFwiT1wiKTtcbiAgY3R5cGUucHVzaChcIk9cIik7XG4gIHZhciB3b3JkID0gc2VnWzNdO1xuICB2YXIgcDEgPSBcIlVcIjtcbiAgdmFyIHAyID0gXCJVXCI7XG4gIHZhciBwMyA9IFwiVVwiO1xuICBmb3IgKHZhciBpID0gNDsgaSA8IHNlZy5sZW5ndGggLSAzOyArK2kpIHtcbiAgICB2YXIgc2NvcmUgPSB0aGlzLkJJQVNfXztcbiAgICB2YXIgdzEgPSBzZWdbaSAtIDNdO1xuICAgIHZhciB3MiA9IHNlZ1tpIC0gMl07XG4gICAgdmFyIHczID0gc2VnW2kgLSAxXTtcbiAgICB2YXIgdzQgPSBzZWdbaV07XG4gICAgdmFyIHc1ID0gc2VnW2kgKyAxXTtcbiAgICB2YXIgdzYgPSBzZWdbaSArIDJdO1xuICAgIHZhciBjMSA9IGN0eXBlW2kgLSAzXTtcbiAgICB2YXIgYzIgPSBjdHlwZVtpIC0gMl07XG4gICAgdmFyIGMzID0gY3R5cGVbaSAtIDFdO1xuICAgIHZhciBjNCA9IGN0eXBlW2ldO1xuICAgIHZhciBjNSA9IGN0eXBlW2kgKyAxXTtcbiAgICB2YXIgYzYgPSBjdHlwZVtpICsgMl07XG4gICAgc2NvcmUgKz0gdGhpcy50c18odGhpcy5VUDFfX1twMV0pO1xuICAgIHNjb3JlICs9IHRoaXMudHNfKHRoaXMuVVAyX19bcDJdKTtcbiAgICBzY29yZSArPSB0aGlzLnRzXyh0aGlzLlVQM19fW3AzXSk7XG4gICAgc2NvcmUgKz0gdGhpcy50c18odGhpcy5CUDFfX1twMSArIHAyXSk7XG4gICAgc2NvcmUgKz0gdGhpcy50c18odGhpcy5CUDJfX1twMiArIHAzXSk7XG4gICAgc2NvcmUgKz0gdGhpcy50c18odGhpcy5VVzFfX1t3MV0pO1xuICAgIHNjb3JlICs9IHRoaXMudHNfKHRoaXMuVVcyX19bdzJdKTtcbiAgICBzY29yZSArPSB0aGlzLnRzXyh0aGlzLlVXM19fW3czXSk7XG4gICAgc2NvcmUgKz0gdGhpcy50c18odGhpcy5VVzRfX1t3NF0pO1xuICAgIHNjb3JlICs9IHRoaXMudHNfKHRoaXMuVVc1X19bdzVdKTtcbiAgICBzY29yZSArPSB0aGlzLnRzXyh0aGlzLlVXNl9fW3c2XSk7XG4gICAgc2NvcmUgKz0gdGhpcy50c18odGhpcy5CVzFfX1t3MiArIHczXSk7XG4gICAgc2NvcmUgKz0gdGhpcy50c18odGhpcy5CVzJfX1t3MyArIHc0XSk7XG4gICAgc2NvcmUgKz0gdGhpcy50c18odGhpcy5CVzNfX1t3NCArIHc1XSk7XG4gICAgc2NvcmUgKz0gdGhpcy50c18odGhpcy5UVzFfX1t3MSArIHcyICsgdzNdKTtcbiAgICBzY29yZSArPSB0aGlzLnRzXyh0aGlzLlRXMl9fW3cyICsgdzMgKyB3NF0pO1xuICAgIHNjb3JlICs9IHRoaXMudHNfKHRoaXMuVFczX19bdzMgKyB3NCArIHc1XSk7XG4gICAgc2NvcmUgKz0gdGhpcy50c18odGhpcy5UVzRfX1t3NCArIHc1ICsgdzZdKTtcbiAgICBzY29yZSArPSB0aGlzLnRzXyh0aGlzLlVDMV9fW2MxXSk7XG4gICAgc2NvcmUgKz0gdGhpcy50c18odGhpcy5VQzJfX1tjMl0pO1xuICAgIHNjb3JlICs9IHRoaXMudHNfKHRoaXMuVUMzX19bYzNdKTtcbiAgICBzY29yZSArPSB0aGlzLnRzXyh0aGlzLlVDNF9fW2M0XSk7XG4gICAgc2NvcmUgKz0gdGhpcy50c18odGhpcy5VQzVfX1tjNV0pO1xuICAgIHNjb3JlICs9IHRoaXMudHNfKHRoaXMuVUM2X19bYzZdKTtcbiAgICBzY29yZSArPSB0aGlzLnRzXyh0aGlzLkJDMV9fW2MyICsgYzNdKTtcbiAgICBzY29yZSArPSB0aGlzLnRzXyh0aGlzLkJDMl9fW2MzICsgYzRdKTtcbiAgICBzY29yZSArPSB0aGlzLnRzXyh0aGlzLkJDM19fW2M0ICsgYzVdKTtcbiAgICBzY29yZSArPSB0aGlzLnRzXyh0aGlzLlRDMV9fW2MxICsgYzIgKyBjM10pO1xuICAgIHNjb3JlICs9IHRoaXMudHNfKHRoaXMuVEMyX19bYzIgKyBjMyArIGM0XSk7XG4gICAgc2NvcmUgKz0gdGhpcy50c18odGhpcy5UQzNfX1tjMyArIGM0ICsgYzVdKTtcbiAgICBzY29yZSArPSB0aGlzLnRzXyh0aGlzLlRDNF9fW2M0ICsgYzUgKyBjNl0pO1xuICAgIC8vICBzY29yZSArPSB0aGlzLnRzXyh0aGlzLlRDNV9fW2M0ICsgYzUgKyBjNl0pO1xuICAgIHNjb3JlICs9IHRoaXMudHNfKHRoaXMuVVExX19bcDEgKyBjMV0pO1xuICAgIHNjb3JlICs9IHRoaXMudHNfKHRoaXMuVVEyX19bcDIgKyBjMl0pO1xuICAgIHNjb3JlICs9IHRoaXMudHNfKHRoaXMuVVEzX19bcDMgKyBjM10pO1xuICAgIHNjb3JlICs9IHRoaXMudHNfKHRoaXMuQlExX19bcDIgKyBjMiArIGMzXSk7XG4gICAgc2NvcmUgKz0gdGhpcy50c18odGhpcy5CUTJfX1twMiArIGMzICsgYzRdKTtcbiAgICBzY29yZSArPSB0aGlzLnRzXyh0aGlzLkJRM19fW3AzICsgYzIgKyBjM10pO1xuICAgIHNjb3JlICs9IHRoaXMudHNfKHRoaXMuQlE0X19bcDMgKyBjMyArIGM0XSk7XG4gICAgc2NvcmUgKz0gdGhpcy50c18odGhpcy5UUTFfX1twMiArIGMxICsgYzIgKyBjM10pO1xuICAgIHNjb3JlICs9IHRoaXMudHNfKHRoaXMuVFEyX19bcDIgKyBjMiArIGMzICsgYzRdKTtcbiAgICBzY29yZSArPSB0aGlzLnRzXyh0aGlzLlRRM19fW3AzICsgYzEgKyBjMiArIGMzXSk7XG4gICAgc2NvcmUgKz0gdGhpcy50c18odGhpcy5UUTRfX1twMyArIGMyICsgYzMgKyBjNF0pO1xuICAgIHZhciBwID0gXCJPXCI7XG4gICAgaWYgKHNjb3JlID4gMCkge1xuICAgICAgcmVzdWx0LnB1c2god29yZCk7XG4gICAgICB3b3JkID0gXCJcIjtcbiAgICAgIHAgPSBcIkJcIjtcbiAgICB9XG4gICAgcDEgPSBwMjtcbiAgICBwMiA9IHAzO1xuICAgIHAzID0gcDtcbiAgICB3b3JkICs9IHNlZ1tpXTtcbiAgfVxuICByZXN1bHQucHVzaCh3b3JkKTtcblxuICByZXR1cm4gcmVzdWx0O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgVGlueVNlZ21lbnRlcjtcbiIsImltcG9ydCBUaW55U2VnbWVudGVyIGZyb20gXCIuLi8uLi9leHRlcm5hbC90aW55LXNlZ21lbnRlclwiO1xuaW1wb3J0IHsgVFJJTV9DSEFSX1BBVFRFUk4gfSBmcm9tIFwiLi9EZWZhdWx0VG9rZW5pemVyXCI7XG5pbXBvcnQgdHlwZSB7IFRva2VuaXplciB9IGZyb20gXCIuLi90b2tlbml6ZXJcIjtcbi8vIEB0cy1pZ25vcmVcbmNvbnN0IHNlZ21lbnRlciA9IG5ldyBUaW55U2VnbWVudGVyKCk7XG5cbmZ1bmN0aW9uIHBpY2tUb2tlbnNBc0phcGFuZXNlKGNvbnRlbnQ6IHN0cmluZywgdHJpbVBhdHRlcm46IFJlZ0V4cCk6IHN0cmluZ1tdIHtcbiAgcmV0dXJuIGNvbnRlbnRcbiAgICAuc3BsaXQodHJpbVBhdHRlcm4pXG4gICAgLmZpbHRlcigoeCkgPT4geCAhPT0gXCJcIilcbiAgICAuZmxhdE1hcDxzdHJpbmc+KCh4KSA9PiBzZWdtZW50ZXIuc2VnbWVudCh4KSk7XG59XG5cbi8qKlxuICogSmFwYW5lc2UgbmVlZHMgb3JpZ2luYWwgbG9naWMuXG4gKi9cbmV4cG9ydCBjbGFzcyBKYXBhbmVzZVRva2VuaXplciBpbXBsZW1lbnRzIFRva2VuaXplciB7XG4gIHRva2VuaXplKGNvbnRlbnQ6IHN0cmluZywgcmF3PzogYm9vbGVhbik6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gcGlja1Rva2Vuc0FzSmFwYW5lc2UoY29udGVudCwgcmF3ID8gLyAvZyA6IHRoaXMuZ2V0VHJpbVBhdHRlcm4oKSk7XG4gIH1cblxuICByZWN1cnNpdmVUb2tlbml6ZShjb250ZW50OiBzdHJpbmcpOiB7IHdvcmQ6IHN0cmluZzsgb2Zmc2V0OiBudW1iZXIgfVtdIHtcbiAgICBjb25zdCB0b2tlbnM6IHN0cmluZ1tdID0gc2VnbWVudGVyXG4gICAgICAuc2VnbWVudChjb250ZW50KVxuICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3RhZGFzaGktYWlrYXdhL29ic2lkaWFuLXZhcmlvdXMtY29tcGxlbWVudHMtcGx1Z2luL2lzc3Vlcy83N1xuICAgICAgLmZsYXRNYXAoKHg6IHN0cmluZykgPT5cbiAgICAgICAgeCA9PT0gXCIgXCIgPyB4IDogeC5zcGxpdChcIiBcIikubWFwKCh0KSA9PiAodCA9PT0gXCJcIiA/IFwiIFwiIDogdCkpXG4gICAgICApO1xuXG4gICAgY29uc3QgcmV0ID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0b2tlbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChcbiAgICAgICAgaSA9PT0gMCB8fFxuICAgICAgICB0b2tlbnNbaV0ubGVuZ3RoICE9PSAxIHx8XG4gICAgICAgICFCb29sZWFuKHRva2Vuc1tpXS5tYXRjaCh0aGlzLmdldFRyaW1QYXR0ZXJuKCkpKVxuICAgICAgKSB7XG4gICAgICAgIHJldC5wdXNoKHtcbiAgICAgICAgICB3b3JkOiB0b2tlbnMuc2xpY2UoaSkuam9pbihcIlwiKSxcbiAgICAgICAgICBvZmZzZXQ6IHRva2Vucy5zbGljZSgwLCBpKS5qb2luKFwiXCIpLmxlbmd0aCxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJldDtcbiAgfVxuXG4gIGdldFRyaW1QYXR0ZXJuKCk6IFJlZ0V4cCB7XG4gICAgcmV0dXJuIFRSSU1fQ0hBUl9QQVRURVJOO1xuICB9XG5cbiAgc2hvdWxkSWdub3JlKHN0cjogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIEJvb2xlYW4oc3RyLm1hdGNoKC9eW+OBgS3jgpPvvYEt772a77yhLe+8uuOAguOAgeODvOOAgF0qJC8pKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgRGVmYXVsdFRva2VuaXplciB9IGZyb20gXCIuL0RlZmF1bHRUb2tlbml6ZXJcIjtcblxudHlwZSBQcmV2aW91c1R5cGUgPSBcIm5vbmVcIiB8IFwidHJpbVwiIHwgXCJlbmdsaXNoXCIgfCBcIm90aGVyc1wiO1xuY29uc3QgRU5HTElTSF9QQVRURVJOID0gL1thLXpBLVowLTlfXFwtXFxcXF0vO1xuZXhwb3J0IGNsYXNzIEVuZ2xpc2hPbmx5VG9rZW5pemVyIGV4dGVuZHMgRGVmYXVsdFRva2VuaXplciB7XG4gIHRva2VuaXplKGNvbnRlbnQ6IHN0cmluZywgcmF3PzogYm9vbGVhbik6IHN0cmluZ1tdIHtcbiAgICBjb25zdCB0b2tlbml6ZWQgPSBBcnJheS5mcm9tKHRoaXMuX3Rva2VuaXplKGNvbnRlbnQpKS5maWx0ZXIoKHgpID0+XG4gICAgICB4LndvcmQubWF0Y2goRU5HTElTSF9QQVRURVJOKVxuICAgICk7XG4gICAgcmV0dXJuIHJhd1xuICAgICAgPyB0b2tlbml6ZWQubWFwKCh4KSA9PiB4LndvcmQpXG4gICAgICA6IHRva2VuaXplZFxuICAgICAgICAgIC5tYXAoKHgpID0+IHgud29yZClcbiAgICAgICAgICAuZmlsdGVyKCh4KSA9PiAheC5tYXRjaCh0aGlzLmdldFRyaW1QYXR0ZXJuKCkpKTtcbiAgfVxuXG4gIHJlY3Vyc2l2ZVRva2VuaXplKGNvbnRlbnQ6IHN0cmluZyk6IHsgd29yZDogc3RyaW5nOyBvZmZzZXQ6IG51bWJlciB9W10ge1xuICAgIGNvbnN0IG9mZnNldHMgPSBBcnJheS5mcm9tKHRoaXMuX3Rva2VuaXplKGNvbnRlbnQpKVxuICAgICAgLmZpbHRlcigoeCkgPT4gIXgud29yZC5tYXRjaCh0aGlzLmdldFRyaW1QYXR0ZXJuKCkpKVxuICAgICAgLm1hcCgoeCkgPT4geC5vZmZzZXQpO1xuICAgIHJldHVybiBbXG4gICAgICAuLi5vZmZzZXRzLm1hcCgoaSkgPT4gKHtcbiAgICAgICAgd29yZDogY29udGVudC5zbGljZShpKSxcbiAgICAgICAgb2Zmc2V0OiBpLFxuICAgICAgfSkpLFxuICAgIF07XG4gIH1cblxuICBwcml2YXRlICpfdG9rZW5pemUoXG4gICAgY29udGVudDogc3RyaW5nXG4gICk6IEl0ZXJhYmxlPHsgd29yZDogc3RyaW5nOyBvZmZzZXQ6IG51bWJlciB9PiB7XG4gICAgbGV0IHN0YXJ0SW5kZXggPSAwO1xuICAgIGxldCBwcmV2aW91c1R5cGU6IFByZXZpb3VzVHlwZSA9IFwibm9uZVwiO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb250ZW50Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoY29udGVudFtpXS5tYXRjaChzdXBlci5nZXRUcmltUGF0dGVybigpKSkge1xuICAgICAgICB5aWVsZCB7IHdvcmQ6IGNvbnRlbnQuc2xpY2Uoc3RhcnRJbmRleCwgaSksIG9mZnNldDogc3RhcnRJbmRleCB9O1xuICAgICAgICBwcmV2aW91c1R5cGUgPSBcInRyaW1cIjtcbiAgICAgICAgc3RhcnRJbmRleCA9IGk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoY29udGVudFtpXS5tYXRjaChFTkdMSVNIX1BBVFRFUk4pKSB7XG4gICAgICAgIGlmIChwcmV2aW91c1R5cGUgPT09IFwiZW5nbGlzaFwiIHx8IHByZXZpb3VzVHlwZSA9PT0gXCJub25lXCIpIHtcbiAgICAgICAgICBwcmV2aW91c1R5cGUgPSBcImVuZ2xpc2hcIjtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHlpZWxkIHsgd29yZDogY29udGVudC5zbGljZShzdGFydEluZGV4LCBpKSwgb2Zmc2V0OiBzdGFydEluZGV4IH07XG4gICAgICAgIHByZXZpb3VzVHlwZSA9IFwiZW5nbGlzaFwiO1xuICAgICAgICBzdGFydEluZGV4ID0gaTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChwcmV2aW91c1R5cGUgPT09IFwib3RoZXJzXCIgfHwgcHJldmlvdXNUeXBlID09PSBcIm5vbmVcIikge1xuICAgICAgICBwcmV2aW91c1R5cGUgPSBcIm90aGVyc1wiO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgeWllbGQgeyB3b3JkOiBjb250ZW50LnNsaWNlKHN0YXJ0SW5kZXgsIGkpLCBvZmZzZXQ6IHN0YXJ0SW5kZXggfTtcbiAgICAgIHByZXZpb3VzVHlwZSA9IFwib3RoZXJzXCI7XG4gICAgICBzdGFydEluZGV4ID0gaTtcbiAgICB9XG5cbiAgICB5aWVsZCB7XG4gICAgICB3b3JkOiBjb250ZW50LnNsaWNlKHN0YXJ0SW5kZXgsIGNvbnRlbnQubGVuZ3RoKSxcbiAgICAgIG9mZnNldDogc3RhcnRJbmRleCxcbiAgICB9O1xuICB9XG59XG4iLCIvLyBRdWljayBndWlkZSBmb3IgdHlwaW5nIENoaW5lc2UgcGlueWluIG9uIE1hYyBPUyBYXG5cbi8vIFRvbmUgMSAoZmxhdCkgbcSBIOKAkyBPcHRpb24gKyBhLCB0aGVuIGhpdCBhIHZvd2VsIGtleVxuLy8gVG9uZSAyIChyaXNpbmcpIG3DoSDigJMgT3B0aW9uICsgZSwgdGhlbiBoaXQgYSB2b3dlbCBrZXlcbi8vIFRvbmUgMyAoZmFsbGluZy1yaXNpbmcpIG3HjiDigJMgT3B0aW9uICsgdiwgdGhlbiBoaXQgYSB2b3dlbCBrZXlcbi8vIFRvbmUgNCAoZmFsbGluZykgbcOgIOKAkyBPcHRpb24gKyBgLCB0aGVuIGhpdCBhIHZvd2VsIGtleVxuXG4vLyDHmiDigJMgT3B0aW9uICsgViwgdGhlbiBoaXQgViAoc3VibWl0dGVkIGJ5IFFBKVxuLy8gx5wg4oCTIE9wdGlvbiArIGAsIHRoZW4gaGl0IFYgKHN1Ym1pdHRlZCBieSBRQSlcblxuXG52YXIgcmVwbGFjZW1lbnRzID0ge1xuICAnYSc6IFsnxIEnLCAnw6EnLCAnx44nLCAnw6AnXSxcbiAgJ2UnOiBbJ8STJywgJ8OpJywgJ8SbJywgJ8OoJ10sXG4gICd1JzogWyfFqycsICfDuicsICfHlCcsICfDuSddLFxuICAnaSc6IFsnxKsnLCAnw60nLCAnx5AnLCAnw6wnXSxcbiAgJ28nOiBbJ8WNJywgJ8OzJywgJ8eSJywgJ8OyJ10sXG4gICfDvCc6IFsnx5YnLCAnx5gnLCAnx5onLCAnx5wnXVxufTtcblxudmFyIG1lZGlhbHMgPSBbJ2knLCAndScsICfDvCddO1xuXG52YXIgcHJldHRpZnkgPSBmdW5jdGlvbihzdHIpe1xuICBzdHIgPSBzdHIucmVwbGFjZSgndicsICfDvCcpO1xuICB2YXIgc3lsbGFibGVzID0gc3RyLnNwbGl0KCcgJyk7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzeWxsYWJsZXMubGVuZ3RoOyBpKyspe1xuICAgIHZhciBzeWxsYWJsZSA9IHN5bGxhYmxlc1tpXTtcbiAgICB2YXIgdG9uZSA9IHBhcnNlSW50KHN5bGxhYmxlW3N5bGxhYmxlLmxlbmd0aC0xXSk7XG4gICAgXG4gICAgaWYgKHRvbmUgPD0gMCB8fCB0b25lID4gNSkge1xuICAgICAgY29uc29sZS5lcnJvcignaW52YWxpZCB0b25lIG51bWJlcjonLCB0b25lLCAnaW4nLCBzeWxsYWJsZSk7XG4gICAgfSBlbHNlIGlmICh0b25lID09PSA1KXtcbiAgICAgIHN5bGxhYmxlc1tpXSA9IHN5bGxhYmxlLnNsaWNlKDAsIHN5bGxhYmxlLmxlbmd0aCAtIDEpO1xuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHN5bGxhYmxlLmxlbmd0aDsgaisrKXtcbiAgICAgICAgdmFyIGN1cnJlbnRMZXR0ZXIgPSBzeWxsYWJsZVtqXTtcbiAgICAgICAgdmFyIG5leHRMZXR0ZXIgPSBzeWxsYWJsZVtqICsgMV07XG5cbiAgICAgICAgLy8gZm91bmQgYSB2b3dlbFxuICAgICAgICBpZiAocmVwbGFjZW1lbnRzW2N1cnJlbnRMZXR0ZXJdKXtcbiAgICAgICAgICB2YXIgcmVwbGFjZWQ7XG4gICAgICAgICAgdmFyIGxldHRlclRvUmVwbGFjZTtcblxuICAgICAgICAgIC8vIHR3byBjb25zZWN1dGl2ZSB2b3dlbHNcbiAgICAgICAgICBpZiAocmVwbGFjZW1lbnRzW25leHRMZXR0ZXJdICYmIG1lZGlhbHMuaW5kZXhPZihjdXJyZW50TGV0dGVyKSA+PSAwKXtcbiAgICAgICAgICAgIGxldHRlclRvUmVwbGFjZSA9IG5leHRMZXR0ZXI7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldHRlclRvUmVwbGFjZSA9IGN1cnJlbnRMZXR0ZXI7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmVwbGFjZWQgPSBzeWxsYWJsZS5yZXBsYWNlKGxldHRlclRvUmVwbGFjZSwgcmVwbGFjZW1lbnRzW2xldHRlclRvUmVwbGFjZV1bdG9uZSAtIDFdKTtcbiAgICAgICAgICBzeWxsYWJsZXNbaV0gPSByZXBsYWNlZC5zbGljZSgwLCByZXBsYWNlZC5sZW5ndGggLSAxKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfSAgXG4gICAgfVxuXG4gIH1cbiAgcmV0dXJuIHN5bGxhYmxlcy5qb2luKCcgJyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cy5wcmV0dGlmeSA9IHByZXR0aWZ5O1xuXG5cbiIsImNsYXNzIFRyaWUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmNvbnRlbnQgPSB7fVxuICAgIH1cblxuICAgIGdldEtleU9iamVjdChrZXksIGNyZWF0ZSA9IGZhbHNlKSB7XG4gICAgICAgIGtleSA9IGtleS50b1N0cmluZygpXG5cbiAgICAgICAgbGV0IGNoYXJzID0ga2V5ID09PSAnJyA/IFtrZXldIDogQXJyYXkuZnJvbShrZXkpXG4gICAgICAgIGxldCBvYmogPSB0aGlzLmNvbnRlbnRcblxuICAgICAgICBmb3IgKGxldCBjaGFyIG9mIGNoYXJzKSB7XG4gICAgICAgICAgICBpZiAob2JqW2NoYXJdID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBpZiAoY3JlYXRlKSBvYmpbY2hhcl0gPSB7fVxuICAgICAgICAgICAgICAgIGVsc2UgcmV0dXJuIHt9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG9iaiA9IG9ialtjaGFyXVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG9ialxuICAgIH1cblxuICAgIGdldChrZXkpIHtcbiAgICAgICAgbGV0IG9iaiA9IHRoaXMuZ2V0S2V5T2JqZWN0KGtleSlcblxuICAgICAgICByZXR1cm4gb2JqLnZhbHVlcyB8fCBbXVxuICAgIH1cblxuICAgIGdldFByZWZpeChrZXkpIHtcbiAgICAgICAgbGV0IGlubmVyID0gKGtleSwgb2JqID0gbnVsbCkgPT4ge1xuICAgICAgICAgICAgaWYgKG9iaiA9PSBudWxsKSBvYmogPSB0aGlzLmdldEtleU9iamVjdChrZXkpXG4gICAgICAgICAgICBsZXQgcmVzdWx0ID0gb2JqLnZhbHVlcyA/IFsuLi5vYmoudmFsdWVzXSA6IFtdXG5cbiAgICAgICAgICAgIGZvciAobGV0IGNoYXIgaW4gb2JqKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNoYXIgPT09ICd2YWx1ZXMnIHx8IG9ialtjaGFyXSA9PSBudWxsKSBjb250aW51ZVxuXG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goLi4uaW5uZXIoa2V5ICsgY2hhciwgb2JqW2NoYXJdKSlcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGlubmVyKGtleSlcbiAgICB9XG5cbiAgICBwdXNoKGtleSwgdmFsdWUpIHtcbiAgICAgICAgbGV0IG9iaiA9IHRoaXMuZ2V0S2V5T2JqZWN0KGtleSwgdHJ1ZSlcblxuICAgICAgICBpZiAob2JqLnZhbHVlcyA9PSBudWxsKSBvYmoudmFsdWVzID0gW11cbiAgICAgICAgaWYgKCFvYmoudmFsdWVzLmluY2x1ZGVzKHZhbHVlKSkgb2JqLnZhbHVlcy5wdXNoKHZhbHVlKVxuXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFRyaWVcbiIsImNvbnN0IHtwcmV0dGlmeX0gPSByZXF1aXJlKCdwcmV0dGlmeS1waW55aW4nKVxuY29uc3QgVHJpZSA9IHJlcXVpcmUoJy4vdHJpZScpXG5cbmZ1bmN0aW9uIHBhcnNlTGluZShsaW5lKSB7XG4gICAgbGV0IG1hdGNoID0gbGluZS5tYXRjaCgvXihcXFMrKVxccyhcXFMrKVxcc1xcWyhbXlxcXV0rKVxcXVxcc1xcLyguKylcXC8vKVxuICAgIGlmIChtYXRjaCA9PSBudWxsKSByZXR1cm5cblxuICAgIGxldCBbLCB0cmFkaXRpb25hbCwgc2ltcGxpZmllZCwgcGlueWluLCBlbmdsaXNoXSA9IG1hdGNoXG5cbiAgICBwaW55aW4gPSBwaW55aW4ucmVwbGFjZSgvdTovZywgJ8O8JylcbiAgICBsZXQgcGlueWluUHJldHR5ID0gcHJldHRpZnkocGlueWluKVxuXG4gICAgcmV0dXJuIHt0cmFkaXRpb25hbCwgc2ltcGxpZmllZCwgcGlueWluLCBwaW55aW5QcmV0dHksIGVuZ2xpc2h9XG59XG5cbmNsYXNzIENlZGljdCB7XG4gICAgbG9hZChjb250ZW50cykge1xuICAgICAgICB0aGlzLnNpbXBsaWZpZWRUcmllID0gbmV3IFRyaWUoKVxuICAgICAgICB0aGlzLnRyYWRpdGlvbmFsVHJpZSA9IG5ldyBUcmllKClcblxuICAgICAgICBsZXQgbGluZXMgPSBjb250ZW50cy5zcGxpdCgnXFxuJylcblxuICAgICAgICBmb3IgKGxldCBsaW5lIG9mIGxpbmVzKSB7XG4gICAgICAgICAgICBpZiAobGluZS50cmltKCkgPT09ICcnIHx8IGxpbmVbMF0gPT09ICcjJykgY29udGludWVcblxuICAgICAgICAgICAgbGV0IGVudHJ5ID0gcGFyc2VMaW5lKGxpbmUpXG4gICAgICAgICAgICBpZiAoZW50cnkgPT0gbnVsbCkgY29udGludWVcblxuICAgICAgICAgICAgdGhpcy5zaW1wbGlmaWVkVHJpZS5wdXNoKGVudHJ5LnNpbXBsaWZpZWQsIGVudHJ5KVxuICAgICAgICAgICAgdGhpcy50cmFkaXRpb25hbFRyaWUucHVzaChlbnRyeS50cmFkaXRpb25hbCwgZW50cnkpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXQod29yZCwgdHJhZGl0aW9uYWwgPSBmYWxzZSkge1xuICAgICAgICByZXR1cm4gdHJhZGl0aW9uYWwgPyB0aGlzLnRyYWRpdGlvbmFsVHJpZS5nZXQod29yZCkgOiB0aGlzLnNpbXBsaWZpZWRUcmllLmdldCh3b3JkKVxuICAgIH1cblxuICAgIGdldFByZWZpeCh3b3JkLCB0cmFkaXRpb25hbCA9IGZhbHNlKSB7XG4gICAgICAgIHJldHVybiB0cmFkaXRpb25hbCA/IHRoaXMudHJhZGl0aW9uYWxUcmllLmdldFByZWZpeCh3b3JkKSA6IHRoaXMuc2ltcGxpZmllZFRyaWUuZ2V0UHJlZml4KHdvcmQpXG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENlZGljdFxuIiwiY29uc3QgQ2VkaWN0ID0gcmVxdWlyZShcIi4vY2VkaWN0XCIpO1xuXG5jb25zdCBjaGluZXNlUHVuY3R1YXRpb24gPSBbXG4gIFwiwrdcIixcbiAgXCLDl1wiLFxuICBcIuKAlFwiLFxuICBcIuKAmFwiLFxuICBcIuKAmVwiLFxuICBcIuKAnFwiLFxuICBcIuKAnVwiLFxuICBcIuKAplwiLFxuICBcIuOAgVwiLFxuICBcIuOAglwiLFxuICBcIuOAilwiLFxuICBcIuOAi1wiLFxuICBcIuOAjlwiLFxuICBcIuOAj1wiLFxuICBcIuOAkFwiLFxuICBcIuOAkVwiLFxuICBcIu+8gVwiLFxuICBcIu+8iFwiLFxuICBcIu+8iVwiLFxuICBcIu+8jFwiLFxuICBcIu+8mlwiLFxuICBcIu+8m1wiLFxuICBcIu+8n1wiLFxuXTtcblxuZXhwb3J0cy5sb2FkID0gZnVuY3Rpb24gKGNvbnRlbnRzKSB7XG4gIGxldCBkaWN0aW9uYXJ5ID0gbmV3IENlZGljdCgpO1xuICBkaWN0aW9uYXJ5LmxvYWQoY29udGVudHMpO1xuXG4gIHJldHVybiBmdW5jdGlvbiB0b2tlbml6ZSh0ZXh0KSB7XG4gICAgdGV4dCA9IEFycmF5LmZyb20odGV4dC5yZXBsYWNlKC9cXHIvZywgXCJcIikpO1xuXG4gICAgbGV0IHJlc3VsdCA9IFtdO1xuICAgIGxldCBpID0gMDtcbiAgICBsZXQgW29mZnNldCwgbGluZSwgY29sdW1uXSA9IFswLCAxLCAxXTtcbiAgICBsZXQgW3NpbXBsaWZpZWRQcmVmZXJlbmNlLCB0cmFkaXRpb25hbFByZWZlcmVuY2VdID0gWzAsIDBdO1xuXG4gICAgbGV0IHB1c2hUb2tlbiA9ICh3b3JkKSA9PiB7XG4gICAgICBsZXQgc2ltcGxpZmllZEVudHJpZXMgPSBkaWN0aW9uYXJ5LmdldCh3b3JkLCBmYWxzZSk7XG4gICAgICBsZXQgdHJhZGl0aW9uYWxFbnRyaWVzID0gZGljdGlvbmFyeS5nZXQod29yZCwgdHJ1ZSk7XG5cbiAgICAgIGxldCBlbnRyaWVzID1cbiAgICAgICAgc2ltcGxpZmllZEVudHJpZXMubGVuZ3RoID09PSAwXG4gICAgICAgICAgPyB0cmFkaXRpb25hbEVudHJpZXNcbiAgICAgICAgICA6IHRyYWRpdGlvbmFsRW50cmllcy5sZW5ndGggPT09IDBcbiAgICAgICAgICA/IHNpbXBsaWZpZWRFbnRyaWVzXG4gICAgICAgICAgOiBzaW1wbGlmaWVkUHJlZmVyZW5jZSA8IHRyYWRpdGlvbmFsUHJlZmVyZW5jZVxuICAgICAgICAgID8gdHJhZGl0aW9uYWxFbnRyaWVzXG4gICAgICAgICAgOiBzaW1wbGlmaWVkUHJlZmVyZW5jZSA+IHRyYWRpdGlvbmFsUHJlZmVyZW5jZVxuICAgICAgICAgID8gc2ltcGxpZmllZEVudHJpZXNcbiAgICAgICAgICA6IHRyYWRpdGlvbmFsRW50cmllcztcblxuICAgICAgaWYgKHRyYWRpdGlvbmFsRW50cmllcy5sZW5ndGggPT09IDAgJiYgc2ltcGxpZmllZEVudHJpZXMubGVuZ3RoID4gMCkge1xuICAgICAgICBzaW1wbGlmaWVkUHJlZmVyZW5jZSsrO1xuICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgc2ltcGxpZmllZEVudHJpZXMubGVuZ3RoID09PSAwICYmXG4gICAgICAgIHRyYWRpdGlvbmFsRW50cmllcy5sZW5ndGggPiAwXG4gICAgICApIHtcbiAgICAgICAgdHJhZGl0aW9uYWxQcmVmZXJlbmNlKys7XG4gICAgICB9XG5cbiAgICAgIHJlc3VsdC5wdXNoKHtcbiAgICAgICAgdGV4dDogd29yZCxcbiAgICAgICAgdHJhZGl0aW9uYWw6IGVudHJpZXNbMF0gPyBlbnRyaWVzWzBdLnRyYWRpdGlvbmFsIDogd29yZCxcbiAgICAgICAgc2ltcGxpZmllZDogZW50cmllc1swXSA/IGVudHJpZXNbMF0uc2ltcGxpZmllZCA6IHdvcmQsXG5cbiAgICAgICAgcG9zaXRpb246IHtcbiAgICAgICAgICBvZmZzZXQsXG4gICAgICAgICAgbGluZSxcbiAgICAgICAgICBjb2x1bW4sXG4gICAgICAgIH0sXG5cbiAgICAgICAgbWF0Y2hlczogZW50cmllcy5tYXAoKHsgcGlueWluLCBwaW55aW5QcmV0dHksIGVuZ2xpc2ggfSkgPT4gKHtcbiAgICAgICAgICBwaW55aW4sXG4gICAgICAgICAgcGlueWluUHJldHR5LFxuICAgICAgICAgIGVuZ2xpc2gsXG4gICAgICAgIH0pKSxcbiAgICAgIH0pO1xuXG4gICAgICBsZXQgd29yZEFyciA9IEFycmF5LmZyb20od29yZCk7XG4gICAgICBsZXQgbGFzdExpbmVCcmVha0luZGV4ID0gd29yZC5sYXN0SW5kZXhPZihcIlxcblwiKTtcblxuICAgICAgaSArPSB3b3JkQXJyLmxlbmd0aDtcbiAgICAgIG9mZnNldCArPSB3b3JkLmxlbmd0aDtcbiAgICAgIGxpbmUgKz0gd29yZEFyci5maWx0ZXIoKHgpID0+IHggPT09IFwiXFxuXCIpLmxlbmd0aDtcbiAgICAgIGNvbHVtbiA9XG4gICAgICAgIGxhc3RMaW5lQnJlYWtJbmRleCA+PSAwXG4gICAgICAgICAgPyB3b3JkLmxlbmd0aCAtIGxhc3RMaW5lQnJlYWtJbmRleFxuICAgICAgICAgIDogY29sdW1uICsgd29yZC5sZW5ndGg7XG4gICAgfTtcblxuICAgIHdoaWxlIChpIDwgdGV4dC5sZW5ndGgpIHtcbiAgICAgIC8vIFRyeSB0byBtYXRjaCB0d28gb3IgbW9yZSBjaGFyYWN0ZXJzXG5cbiAgICAgIGlmIChpICE9PSB0ZXh0Lmxlbmd0aCAtIDEpIHtcbiAgICAgICAgbGV0IGdldFR3byA9IHRleHQuc2xpY2UoaSwgaSArIDIpLmpvaW4oXCJcIik7XG4gICAgICAgIGxldCBzaW1wbGlmaWVkRW50cmllcyA9IGRpY3Rpb25hcnkuZ2V0UHJlZml4KGdldFR3bywgZmFsc2UpO1xuICAgICAgICBsZXQgdHJhZGl0aW9uYWxFbnRyaWVzID0gZGljdGlvbmFyeS5nZXRQcmVmaXgoZ2V0VHdvLCB0cnVlKTtcbiAgICAgICAgbGV0IGZvdW5kV29yZCA9IG51bGw7XG4gICAgICAgIGxldCBmb3VuZEVudHJpZXMgPSBudWxsO1xuXG4gICAgICAgIGZvciAobGV0IGVudHJpZXMgb2YgW3RyYWRpdGlvbmFsRW50cmllcywgc2ltcGxpZmllZEVudHJpZXNdKSB7XG4gICAgICAgICAgZm9yIChsZXQgZW50cnkgb2YgZW50cmllcykge1xuICAgICAgICAgICAgbGV0IG1hdGNoVGV4dCA9XG4gICAgICAgICAgICAgIGVudHJpZXMgPT09IHRyYWRpdGlvbmFsRW50cmllc1xuICAgICAgICAgICAgICAgID8gZW50cnkudHJhZGl0aW9uYWxcbiAgICAgICAgICAgICAgICA6IGVudHJ5LnNpbXBsaWZpZWQ7XG4gICAgICAgICAgICBsZXQgd29yZCA9IHRleHQuc2xpY2UoaSwgaSArIEFycmF5LmZyb20obWF0Y2hUZXh0KS5sZW5ndGgpLmpvaW4oXCJcIik7XG5cbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgbWF0Y2hUZXh0ID09PSB3b3JkICYmXG4gICAgICAgICAgICAgIChmb3VuZFdvcmQgPT0gbnVsbCB8fFxuICAgICAgICAgICAgICAgIEFycmF5LmZyb20od29yZCkubGVuZ3RoID4gQXJyYXkuZnJvbShmb3VuZFdvcmQpLmxlbmd0aClcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICBmb3VuZFdvcmQgPSB3b3JkO1xuICAgICAgICAgICAgICBmb3VuZEVudHJpZXMgPSBlbnRyaWVzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChmb3VuZFdvcmQgIT0gbnVsbCkge1xuICAgICAgICAgIHB1c2hUb2tlbihmb3VuZFdvcmQpO1xuXG4gICAgICAgICAgaWYgKGZvdW5kRW50cmllcyA9PT0gc2ltcGxpZmllZEVudHJpZXMpIHtcbiAgICAgICAgICAgIHNpbXBsaWZpZWRQcmVmZXJlbmNlKys7XG4gICAgICAgICAgfSBlbHNlIGlmIChmb3VuZEVudHJpZXMgPT09IHRyYWRpdGlvbmFsRW50cmllcykge1xuICAgICAgICAgICAgdHJhZGl0aW9uYWxQcmVmZXJlbmNlKys7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gSWYgaXQgZmFpbHMsIG1hdGNoIG9uZSBjaGFyYWN0ZXJcblxuICAgICAgbGV0IGNoYXJhY3RlciA9IHRleHRbaV07XG4gICAgICBsZXQgaXNDaGluZXNlID0gKGNoYXJhY3RlcikgPT5cbiAgICAgICAgY2hpbmVzZVB1bmN0dWF0aW9uLmluY2x1ZGVzKGNoYXJhY3RlcikgfHxcbiAgICAgICAgZGljdGlvbmFyeS5nZXQoY2hhcmFjdGVyLCBmYWxzZSkubGVuZ3RoID4gMCB8fFxuICAgICAgICBkaWN0aW9uYXJ5LmdldChjaGFyYWN0ZXIsIHRydWUpLmxlbmd0aCA+IDA7XG5cbiAgICAgIGlmIChpc0NoaW5lc2UoY2hhcmFjdGVyKSB8fCBjaGFyYWN0ZXIubWF0Y2goL1xccy8pICE9IG51bGwpIHtcbiAgICAgICAgcHVzaFRva2VuKGNoYXJhY3Rlcik7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBIYW5kbGUgbm9uLUNoaW5lc2UgY2hhcmFjdGVyc1xuXG4gICAgICBsZXQgZW5kID0gaSArIDE7XG5cbiAgICAgIGZvciAoOyBlbmQgPCB0ZXh0Lmxlbmd0aDsgZW5kKyspIHtcbiAgICAgICAgaWYgKHRleHRbZW5kXS5tYXRjaCgvXFxzLykgIT0gbnVsbCB8fCBpc0NoaW5lc2UodGV4dFtlbmRdKSkgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIGxldCB3b3JkID0gdGV4dC5zbGljZShpLCBlbmQpLmpvaW4oXCJcIik7XG4gICAgICBwdXNoVG9rZW4od29yZCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbn07XG4iLCJpbXBvcnQgeyBUUklNX0NIQVJfUEFUVEVSTiB9IGZyb20gXCIuL0RlZmF1bHRUb2tlbml6ZXJcIjtcbmltcG9ydCB0eXBlIHsgVG9rZW5pemVyIH0gZnJvbSBcIi4uL3Rva2VuaXplclwiO1xuaW1wb3J0IGNoaW5lc2VUb2tlbml6ZXIgZnJvbSBcImNoaW5lc2UtdG9rZW5pemVyXCI7XG5cbi8qKlxuICogQ2hpbmVzZSBuZWVkcyBvcmlnaW5hbCBsb2dpYy5cbiAqL1xuZXhwb3J0IGNsYXNzIENoaW5lc2VUb2tlbml6ZXIgaW1wbGVtZW50cyBUb2tlbml6ZXIge1xuICBfdG9rZW5pemU6IFJldHVyblR5cGU8dHlwZW9mIGNoaW5lc2VUb2tlbml6ZXIubG9hZD47XG5cbiAgc3RhdGljIGNyZWF0ZShkaWN0OiBzdHJpbmcpOiBDaGluZXNlVG9rZW5pemVyIHtcbiAgICBjb25zdCBpbnMgPSBuZXcgQ2hpbmVzZVRva2VuaXplcigpO1xuICAgIGlucy5fdG9rZW5pemUgPSBjaGluZXNlVG9rZW5pemVyLmxvYWQoZGljdCk7XG4gICAgcmV0dXJuIGlucztcbiAgfVxuXG4gIHRva2VuaXplKGNvbnRlbnQ6IHN0cmluZywgcmF3PzogYm9vbGVhbik6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gY29udGVudFxuICAgICAgLnNwbGl0KHJhdyA/IC8gL2cgOiB0aGlzLmdldFRyaW1QYXR0ZXJuKCkpXG4gICAgICAuZmlsdGVyKCh4KSA9PiB4ICE9PSBcIlwiKVxuICAgICAgLmZsYXRNYXAoKHgpID0+IHRoaXMuX3Rva2VuaXplKHgpKVxuICAgICAgLm1hcCgoeCkgPT4geC50ZXh0KTtcbiAgfVxuXG4gIHJlY3Vyc2l2ZVRva2VuaXplKGNvbnRlbnQ6IHN0cmluZyk6IHsgd29yZDogc3RyaW5nOyBvZmZzZXQ6IG51bWJlciB9W10ge1xuICAgIGNvbnN0IHRva2Vuczogc3RyaW5nW10gPSB0aGlzLl90b2tlbml6ZShjb250ZW50KS5tYXAoKHgpID0+IHgudGV4dCk7XG5cbiAgICBjb25zdCByZXQgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRva2Vucy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKFxuICAgICAgICBpID09PSAwIHx8XG4gICAgICAgIHRva2Vuc1tpXS5sZW5ndGggIT09IDEgfHxcbiAgICAgICAgIUJvb2xlYW4odG9rZW5zW2ldLm1hdGNoKHRoaXMuZ2V0VHJpbVBhdHRlcm4oKSkpXG4gICAgICApIHtcbiAgICAgICAgcmV0LnB1c2goe1xuICAgICAgICAgIHdvcmQ6IHRva2Vucy5zbGljZShpKS5qb2luKFwiXCIpLFxuICAgICAgICAgIG9mZnNldDogdG9rZW5zLnNsaWNlKDAsIGkpLmpvaW4oXCJcIikubGVuZ3RoLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmV0O1xuICB9XG5cbiAgZ2V0VHJpbVBhdHRlcm4oKTogUmVnRXhwIHtcbiAgICByZXR1cm4gVFJJTV9DSEFSX1BBVFRFUk47XG4gIH1cblxuICBzaG91bGRJZ25vcmUoc3RyOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cbiIsImltcG9ydCB7IEFyYWJpY1Rva2VuaXplciB9IGZyb20gXCIuL3Rva2VuaXplcnMvQXJhYmljVG9rZW5pemVyXCI7XG5pbXBvcnQgeyBEZWZhdWx0VG9rZW5pemVyIH0gZnJvbSBcIi4vdG9rZW5pemVycy9EZWZhdWx0VG9rZW5pemVyXCI7XG5pbXBvcnQgeyBKYXBhbmVzZVRva2VuaXplciB9IGZyb20gXCIuL3Rva2VuaXplcnMvSmFwYW5lc2VUb2tlbml6ZXJcIjtcbmltcG9ydCB0eXBlIHsgVG9rZW5pemVTdHJhdGVneSB9IGZyb20gXCIuL1Rva2VuaXplU3RyYXRlZ3lcIjtcbmltcG9ydCB7IEVuZ2xpc2hPbmx5VG9rZW5pemVyIH0gZnJvbSBcIi4vdG9rZW5pemVycy9FbmdsaXNoT25seVRva2VuaXplclwiO1xuaW1wb3J0IHR5cGUgeyBBcHAgfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB7IENoaW5lc2VUb2tlbml6ZXIgfSBmcm9tIFwiLi90b2tlbml6ZXJzL0NoaW5lc2VUb2tlbml6ZXJcIjtcblxuZXhwb3J0IGludGVyZmFjZSBUb2tlbml6ZXIge1xuICB0b2tlbml6ZShjb250ZW50OiBzdHJpbmcsIHJhdz86IGJvb2xlYW4pOiBzdHJpbmdbXTtcbiAgcmVjdXJzaXZlVG9rZW5pemUoY29udGVudDogc3RyaW5nKTogeyB3b3JkOiBzdHJpbmc7IG9mZnNldDogbnVtYmVyIH1bXTtcbiAgZ2V0VHJpbVBhdHRlcm4oKTogUmVnRXhwO1xuICBzaG91bGRJZ25vcmUocXVlcnk6IHN0cmluZyk6IGJvb2xlYW47XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjcmVhdGVUb2tlbml6ZXIoXG4gIHN0cmF0ZWd5OiBUb2tlbml6ZVN0cmF0ZWd5LFxuICBhcHA6IEFwcFxuKTogUHJvbWlzZTxUb2tlbml6ZXI+IHtcbiAgc3dpdGNoIChzdHJhdGVneS5uYW1lKSB7XG4gICAgY2FzZSBcImRlZmF1bHRcIjpcbiAgICAgIHJldHVybiBuZXcgRGVmYXVsdFRva2VuaXplcigpO1xuICAgIGNhc2UgXCJlbmdsaXNoLW9ubHlcIjpcbiAgICAgIHJldHVybiBuZXcgRW5nbGlzaE9ubHlUb2tlbml6ZXIoKTtcbiAgICBjYXNlIFwiYXJhYmljXCI6XG4gICAgICByZXR1cm4gbmV3IEFyYWJpY1Rva2VuaXplcigpO1xuICAgIGNhc2UgXCJqYXBhbmVzZVwiOlxuICAgICAgcmV0dXJuIG5ldyBKYXBhbmVzZVRva2VuaXplcigpO1xuICAgIGNhc2UgXCJjaGluZXNlXCI6XG4gICAgICBjb25zdCBoYXNDZWRpY3QgPSBhd2FpdCBhcHAudmF1bHQuYWRhcHRlci5leGlzdHMoXCIuL2NlZGljdF90cy51OFwiKTtcbiAgICAgIGlmICghaGFzQ2VkaWN0KSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChcbiAgICAgICAgICBuZXcgRXJyb3IoXCJjZWRpY3RfdHMuVTggZG9lc24ndCBleGlzdCBpbiB5b3VyIHZhdWx0IHJvb3QuXCIpXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICBjb25zdCBkaWN0ID0gYXdhaXQgYXBwLnZhdWx0LmFkYXB0ZXIucmVhZChcIi4vY2VkaWN0X3RzLnU4XCIpO1xuICAgICAgcmV0dXJuIENoaW5lc2VUb2tlbml6ZXIuY3JlYXRlKGRpY3QpO1xuICB9XG59XG4iLCJ0eXBlIE5hbWUgPSBcImRlZmF1bHRcIiB8IFwiZW5nbGlzaC1vbmx5XCIgfCBcImphcGFuZXNlXCIgfCBcImFyYWJpY1wiIHwgXCJjaGluZXNlXCI7XG5cbmV4cG9ydCBjbGFzcyBUb2tlbml6ZVN0cmF0ZWd5IHtcbiAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgX3ZhbHVlczogVG9rZW5pemVTdHJhdGVneVtdID0gW107XG5cbiAgc3RhdGljIHJlYWRvbmx5IERFRkFVTFQgPSBuZXcgVG9rZW5pemVTdHJhdGVneShcImRlZmF1bHRcIiwgMywgNSk7XG4gIHN0YXRpYyByZWFkb25seSBFTkdMSVNIX09OTFkgPSBuZXcgVG9rZW5pemVTdHJhdGVneShcImVuZ2xpc2gtb25seVwiLCAzLCA1KTtcbiAgc3RhdGljIHJlYWRvbmx5IEpBUEFORVNFID0gbmV3IFRva2VuaXplU3RyYXRlZ3koXCJqYXBhbmVzZVwiLCAyLCAyKTtcbiAgc3RhdGljIHJlYWRvbmx5IEFSQUJJQyA9IG5ldyBUb2tlbml6ZVN0cmF0ZWd5KFwiYXJhYmljXCIsIDMsIDMpO1xuICBzdGF0aWMgcmVhZG9ubHkgQ0hJTkVTRSA9IG5ldyBUb2tlbml6ZVN0cmF0ZWd5KFwiY2hpbmVzZVwiLCAxLCAyKTtcblxuICBwcml2YXRlIGNvbnN0cnVjdG9yKFxuICAgIHJlYWRvbmx5IG5hbWU6IE5hbWUsXG4gICAgcmVhZG9ubHkgdHJpZ2dlclRocmVzaG9sZDogbnVtYmVyLFxuICAgIHJlYWRvbmx5IGluZGV4aW5nVGhyZXNob2xkOiBudW1iZXJcbiAgKSB7XG4gICAgVG9rZW5pemVTdHJhdGVneS5fdmFsdWVzLnB1c2godGhpcyk7XG4gIH1cblxuICBzdGF0aWMgZnJvbU5hbWUobmFtZTogc3RyaW5nKTogVG9rZW5pemVTdHJhdGVneSB7XG4gICAgcmV0dXJuIFRva2VuaXplU3RyYXRlZ3kuX3ZhbHVlcy5maW5kKCh4KSA9PiB4Lm5hbWUgPT09IG5hbWUpITtcbiAgfVxuXG4gIHN0YXRpYyB2YWx1ZXMoKTogVG9rZW5pemVTdHJhdGVneVtdIHtcbiAgICByZXR1cm4gVG9rZW5pemVTdHJhdGVneS5fdmFsdWVzO1xuICB9XG59XG4iLCJpbXBvcnQge1xuICBBcHAsXG4gIEVkaXRvcixcbiAgdHlwZSBFZGl0b3JQb3NpdGlvbixcbiAgTWFya2Rvd25WaWV3LFxuICBub3JtYWxpemVQYXRoLFxuICBwYXJzZUZyb250TWF0dGVyQWxpYXNlcyxcbiAgcGFyc2VGcm9udE1hdHRlclN0cmluZ0FycmF5LFxuICBwYXJzZUZyb250TWF0dGVyVGFncyxcbiAgVEZpbGUsXG4gIFZhdWx0LFxufSBmcm9tIFwib2JzaWRpYW5cIjtcblxuaW50ZXJmYWNlIFVuc2FmZUFwcEludGVyZmFjZSB7XG4gIHZhdWx0OiBWYXVsdCAmIHtcbiAgICBjb25maWc6IHtcbiAgICAgIHNwZWxsY2hlY2tEaWN0aW9uYXJ5Pzogc3RyaW5nW107XG4gICAgfTtcbiAgfTtcbn1cblxuZXhwb3J0IHR5cGUgRnJvbnRNYXR0ZXJWYWx1ZSA9IHN0cmluZ1tdO1xuXG5leHBvcnQgY2xhc3MgQXBwSGVscGVyIHtcbiAgcHJpdmF0ZSB1bnNhZmVBcHA6IEFwcCAmIFVuc2FmZUFwcEludGVyZmFjZTtcblxuICBjb25zdHJ1Y3RvcihhcHA6IEFwcCkge1xuICAgIHRoaXMudW5zYWZlQXBwID0gYXBwIGFzIGFueTtcbiAgfVxuXG4gIGVxdWFsc0FzRWRpdG9yUG9zdGlvbihvbmU6IEVkaXRvclBvc2l0aW9uLCBvdGhlcjogRWRpdG9yUG9zaXRpb24pOiBib29sZWFuIHtcbiAgICByZXR1cm4gb25lLmxpbmUgPT09IG90aGVyLmxpbmUgJiYgb25lLmNoID09PSBvdGhlci5jaDtcbiAgfVxuXG4gIGdldEFsaWFzZXMoZmlsZTogVEZpbGUpOiBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIChcbiAgICAgIHBhcnNlRnJvbnRNYXR0ZXJBbGlhc2VzKFxuICAgICAgICB0aGlzLnVuc2FmZUFwcC5tZXRhZGF0YUNhY2hlLmdldEZpbGVDYWNoZShmaWxlKT8uZnJvbnRtYXR0ZXJcbiAgICAgICkgPz8gW11cbiAgICApO1xuICB9XG5cbiAgZ2V0RnJvbnRNYXR0ZXIoZmlsZTogVEZpbGUpOiB7IFtrZXk6IHN0cmluZ106IEZyb250TWF0dGVyVmFsdWUgfSB8IHVuZGVmaW5lZCB7XG4gICAgY29uc3QgZnJvbnRNYXR0ZXIgPVxuICAgICAgdGhpcy51bnNhZmVBcHAubWV0YWRhdGFDYWNoZS5nZXRGaWxlQ2FjaGUoZmlsZSk/LmZyb250bWF0dGVyO1xuICAgIGlmICghZnJvbnRNYXR0ZXIpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgLy8gcmVtb3ZlICNcbiAgICBjb25zdCB0YWdzID1cbiAgICAgIHBhcnNlRnJvbnRNYXR0ZXJUYWdzKGZyb250TWF0dGVyKT8ubWFwKCh4KSA9PiB4LnNsaWNlKDEpKSA/PyBbXTtcbiAgICBjb25zdCBhbGlhc2VzID0gcGFyc2VGcm9udE1hdHRlckFsaWFzZXMoZnJvbnRNYXR0ZXIpID8/IFtdO1xuICAgIGNvbnN0IHsgcG9zaXRpb24sIC4uLnJlc3QgfSA9IGZyb250TWF0dGVyO1xuICAgIHJldHVybiB7XG4gICAgICAuLi5PYmplY3QuZnJvbUVudHJpZXMoXG4gICAgICAgIE9iamVjdC5lbnRyaWVzKHJlc3QpLm1hcCgoW2ssIF92XSkgPT4gW1xuICAgICAgICAgIGssXG4gICAgICAgICAgcGFyc2VGcm9udE1hdHRlclN0cmluZ0FycmF5KGZyb250TWF0dGVyLCBrKSxcbiAgICAgICAgXSlcbiAgICAgICksXG4gICAgICB0YWdzLFxuICAgICAgdGFnOiB0YWdzLFxuICAgICAgYWxpYXNlcyxcbiAgICAgIGFsaWFzOiBhbGlhc2VzLFxuICAgIH07XG4gIH1cblxuICBnZXRNYXJrZG93blZpZXdJbkFjdGl2ZUxlYWYoKTogTWFya2Rvd25WaWV3IHwgbnVsbCB7XG4gICAgaWYgKCF0aGlzLnVuc2FmZUFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlVmlld09mVHlwZShNYXJrZG93blZpZXcpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy51bnNhZmVBcHAud29ya3NwYWNlLmFjdGl2ZUxlYWYhLnZpZXcgYXMgTWFya2Rvd25WaWV3O1xuICB9XG5cbiAgZ2V0QWN0aXZlRmlsZSgpOiBURmlsZSB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLnVuc2FmZUFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpO1xuICB9XG5cbiAgaXNBY3RpdmVGaWxlKGZpbGU6IFRGaWxlKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0QWN0aXZlRmlsZSgpPy5wYXRoID09PSBmaWxlLnBhdGg7XG4gIH1cblxuICBnZXRQcmV2aW91c0ZpbGUoKTogVEZpbGUgfCBudWxsIHtcbiAgICBjb25zdCBmTmFtZSA9IHRoaXMudW5zYWZlQXBwLndvcmtzcGFjZS5nZXRMYXN0T3BlbkZpbGVzKCk/LlsxXTtcbiAgICBpZiAoIWZOYW1lKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5nZXRNYXJrZG93bkZpbGVCeVBhdGgoZk5hbWUpO1xuICB9XG5cbiAgZ2V0Q3VycmVudERpcm5hbWUoKTogc3RyaW5nIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0QWN0aXZlRmlsZSgpPy5wYXJlbnQucGF0aCA/PyBudWxsO1xuICB9XG5cbiAgZ2V0Q3VycmVudEVkaXRvcigpOiBFZGl0b3IgfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy5nZXRNYXJrZG93blZpZXdJbkFjdGl2ZUxlYWYoKT8uZWRpdG9yID8/IG51bGw7XG4gIH1cblxuICBnZXRTZWxlY3Rpb24oKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gdGhpcy5nZXRDdXJyZW50RWRpdG9yKCk/LmdldFNlbGVjdGlvbigpO1xuICB9XG5cbiAgZ2V0Q3VycmVudE9mZnNldChlZGl0b3I6IEVkaXRvcik6IG51bWJlciB7XG4gICAgcmV0dXJuIGVkaXRvci5wb3NUb09mZnNldChlZGl0b3IuZ2V0Q3Vyc29yKCkpO1xuICB9XG5cbiAgZ2V0Q3VycmVudExpbmUoZWRpdG9yOiBFZGl0b3IpOiBzdHJpbmcge1xuICAgIHJldHVybiBlZGl0b3IuZ2V0TGluZShlZGl0b3IuZ2V0Q3Vyc29yKCkubGluZSk7XG4gIH1cblxuICBnZXRDdXJyZW50TGluZVVudGlsQ3Vyc29yKGVkaXRvcjogRWRpdG9yKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5nZXRDdXJyZW50TGluZShlZGl0b3IpLnNsaWNlKDAsIGVkaXRvci5nZXRDdXJzb3IoKS5jaCk7XG4gIH1cblxuICBvcHRpbWl6ZU1hcmtkb3duTGlua1RleHQobGlua1RleHQ6IHN0cmluZyk6IHN0cmluZyB8IG51bGwge1xuICAgIGNvbnN0IGFjdGl2ZUZpbGUgPSB0aGlzLmdldEFjdGl2ZUZpbGUoKTtcbiAgICBpZiAoIWFjdGl2ZUZpbGUpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IHBhdGggPSB0aGlzLmxpbmtUZXh0MlBhdGgobGlua1RleHQpO1xuICAgIGlmICghcGF0aCkge1xuICAgICAgcmV0dXJuIGxpbmtUZXh0O1xuICAgIH1cblxuICAgIGNvbnN0IGZpbGUgPSB0aGlzLmdldE1hcmtkb3duRmlsZUJ5UGF0aChwYXRoKTtcbiAgICBpZiAoIWZpbGUpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnVuc2FmZUFwcC5maWxlTWFuYWdlclxuICAgICAgLmdlbmVyYXRlTWFya2Rvd25MaW5rKGZpbGUsIGFjdGl2ZUZpbGUucGF0aClcbiAgICAgIC5yZXBsYWNlKFwiW1tcIiwgXCJcIilcbiAgICAgIC5yZXBsYWNlKFwiXV1cIiwgXCJcIik7XG4gIH1cblxuICBsaW5rVGV4dDJQYXRoKGxpbmtUZXh0OiBzdHJpbmcpOiBzdHJpbmcgfCBudWxsIHtcbiAgICBjb25zdCBhY3RpdmVGaWxlID0gdGhpcy5nZXRBY3RpdmVGaWxlKCk7XG4gICAgaWYgKCFhY3RpdmVGaWxlKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgdGhpcy51bnNhZmVBcHAubWV0YWRhdGFDYWNoZS5nZXRGaXJzdExpbmtwYXRoRGVzdChcbiAgICAgICAgbGlua1RleHQsXG4gICAgICAgIGFjdGl2ZUZpbGUucGF0aFxuICAgICAgKT8ucGF0aCA/PyBudWxsXG4gICAgKTtcbiAgfVxuXG4gIHNlYXJjaFBoYW50b21MaW5rcygpOiB7IHBhdGg6IHN0cmluZzsgbGluazogc3RyaW5nIH1bXSB7XG4gICAgcmV0dXJuIE9iamVjdC5lbnRyaWVzKHRoaXMudW5zYWZlQXBwLm1ldGFkYXRhQ2FjaGUudW5yZXNvbHZlZExpbmtzKS5mbGF0TWFwKFxuICAgICAgKFtwYXRoLCBvYmpdKSA9PiBPYmplY3Qua2V5cyhvYmopLm1hcCgobGluaykgPT4gKHsgcGF0aCwgbGluayB9KSlcbiAgICApO1xuICB9XG5cbiAgZ2V0TWFya2Rvd25GaWxlQnlQYXRoKHBhdGg6IHN0cmluZyk6IFRGaWxlIHwgbnVsbCB7XG4gICAgaWYgKCFwYXRoLmVuZHNXaXRoKFwiLm1kXCIpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBhYnN0cmFjdEZpbGUgPSB0aGlzLnVuc2FmZUFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgocGF0aCk7XG4gICAgaWYgKCFhYnN0cmFjdEZpbGUpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiBhYnN0cmFjdEZpbGUgYXMgVEZpbGU7XG4gIH1cblxuICBvcGVuTWFya2Rvd25GaWxlKGZpbGU6IFRGaWxlLCBuZXdMZWFmOiBib29sZWFuLCBvZmZzZXQ6IG51bWJlciA9IDApIHtcbiAgICBjb25zdCBsZWFmID0gdGhpcy51bnNhZmVBcHAud29ya3NwYWNlLmdldExlYWYobmV3TGVhZik7XG5cbiAgICBsZWFmXG4gICAgICAub3BlbkZpbGUoZmlsZSwgdGhpcy51bnNhZmVBcHAud29ya3NwYWNlLmFjdGl2ZUxlYWY/LmdldFZpZXdTdGF0ZSgpKVxuICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICB0aGlzLnVuc2FmZUFwcC53b3Jrc3BhY2Uuc2V0QWN0aXZlTGVhZihsZWFmLCB0cnVlLCB0cnVlKTtcbiAgICAgICAgY29uc3Qgdmlld09mVHlwZSA9XG4gICAgICAgICAgdGhpcy51bnNhZmVBcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoTWFya2Rvd25WaWV3KTtcbiAgICAgICAgaWYgKHZpZXdPZlR5cGUpIHtcbiAgICAgICAgICBjb25zdCBlZGl0b3IgPSB2aWV3T2ZUeXBlLmVkaXRvcjtcbiAgICAgICAgICBjb25zdCBwb3MgPSBlZGl0b3Iub2Zmc2V0VG9Qb3Mob2Zmc2V0KTtcbiAgICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yKHBvcyk7XG4gICAgICAgICAgZWRpdG9yLnNjcm9sbEludG9WaWV3KHsgZnJvbTogcG9zLCB0bzogcG9zIH0sIHRydWUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgfVxuXG4gIGdldEN1cnJlbnRGcm9udE1hdHRlcigpOiBzdHJpbmcgfCBudWxsIHtcbiAgICBjb25zdCBlZGl0b3IgPSB0aGlzLmdldEN1cnJlbnRFZGl0b3IoKTtcbiAgICBpZiAoIWVkaXRvcikge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmdldEFjdGl2ZUZpbGUoKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgaWYgKGVkaXRvci5nZXRMaW5lKDApICE9PSBcIi0tLVwiKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY29uc3QgZW5kUG9zaXRpb24gPSBlZGl0b3IuZ2V0VmFsdWUoKS5pbmRleE9mKFwiLS0tXCIsIDMpO1xuXG4gICAgY29uc3QgY3VycmVudE9mZnNldCA9IHRoaXMuZ2V0Q3VycmVudE9mZnNldChlZGl0b3IpO1xuICAgIGlmIChlbmRQb3NpdGlvbiAhPT0gLTEgJiYgY3VycmVudE9mZnNldCA+PSBlbmRQb3NpdGlvbikge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3Qga2V5TG9jYXRpb25zID0gQXJyYXkuZnJvbShlZGl0b3IuZ2V0VmFsdWUoKS5tYXRjaEFsbCgvLis6L2cpKTtcbiAgICBpZiAoa2V5TG9jYXRpb25zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgY3VycmVudEtleUxvY2F0aW9uID0ga2V5TG9jYXRpb25zXG4gICAgICAuZmlsdGVyKCh4KSA9PiB4LmluZGV4ISA8IGN1cnJlbnRPZmZzZXQpXG4gICAgICAubGFzdCgpO1xuICAgIGlmICghY3VycmVudEtleUxvY2F0aW9uKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gY3VycmVudEtleUxvY2F0aW9uWzBdLnNwbGl0KFwiOlwiKVswXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVbnNhZmUgbWV0aG9kXG4gICAqL1xuICBpc0lNRU9uKCk6IGJvb2xlYW4ge1xuICAgIGlmICghdGhpcy51bnNhZmVBcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoTWFya2Rvd25WaWV3KSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IG1hcmtkb3duVmlldyA9IHRoaXMudW5zYWZlQXBwLndvcmtzcGFjZS5hY3RpdmVMZWFmIVxuICAgICAgLnZpZXcgYXMgTWFya2Rvd25WaWV3O1xuICAgIGNvbnN0IGNtNW9yNjogYW55ID0gKG1hcmtkb3duVmlldy5lZGl0b3IgYXMgYW55KS5jbTtcblxuICAgIC8vIGNtNlxuICAgIGlmIChjbTVvcjY/LmlucHV0U3RhdGU/LmNvbXBvc2luZyA+IDApIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8vIGNtNVxuICAgIHJldHVybiAhIWNtNW9yNj8uZGlzcGxheT8uaW5wdXQ/LmNvbXBvc2luZztcbiAgfVxuXG4gIGFzeW5jIHdyaXRlTG9nKGxvZzogc3RyaW5nKSB7XG4gICAgYXdhaXQgdGhpcy51bnNhZmVBcHAudmF1bHQuYWRhcHRlci5hcHBlbmQobm9ybWFsaXplUGF0aChcImxvZy5tZFwiKSwgbG9nKTtcbiAgfVxufVxuIiwiZXhwb3J0IGNvbnN0IGtleUJ5ID0gPFQ+KFxuICB2YWx1ZXM6IFRbXSxcbiAgdG9LZXk6ICh0OiBUKSA9PiBzdHJpbmdcbik6IHsgW2tleTogc3RyaW5nXTogVCB9ID0+XG4gIHZhbHVlcy5yZWR1Y2UoXG4gICAgKHByZXYsIGN1ciwgXzEsIF8yLCBrID0gdG9LZXkoY3VyKSkgPT4gKChwcmV2W2tdID0gY3VyKSwgcHJldiksXG4gICAge30gYXMgeyBba2V5OiBzdHJpbmddOiBUIH1cbiAgKTtcblxuZXhwb3J0IGNvbnN0IGdyb3VwQnkgPSA8VD4oXG4gIHZhbHVlczogVFtdLFxuICB0b0tleTogKHQ6IFQpID0+IHN0cmluZ1xuKTogeyBba2V5OiBzdHJpbmddOiBUW10gfSA9PlxuICB2YWx1ZXMucmVkdWNlKFxuICAgIChwcmV2LCBjdXIsIF8xLCBfMiwgayA9IHRvS2V5KGN1cikpID0+IChcbiAgICAgIChwcmV2W2tdIHx8IChwcmV2W2tdID0gW10pKS5wdXNoKGN1ciksIHByZXZcbiAgICApLFxuICAgIHt9IGFzIHsgW2tleTogc3RyaW5nXTogVFtdIH1cbiAgKTtcblxuZXhwb3J0IGZ1bmN0aW9uIHVuaXE8VD4odmFsdWVzOiBUW10pOiBUW10ge1xuICByZXR1cm4gWy4uLm5ldyBTZXQodmFsdWVzKV07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1bmlxQnk8VD4odmFsdWVzOiBUW10sIGZuOiAoeDogVCkgPT4gc3RyaW5nIHwgbnVtYmVyKTogVFtdIHtcbiAgY29uc3QgbSA9IG5ldyBNYXA8c3RyaW5nIHwgbnVtYmVyLCBUPigpO1xuICB2YWx1ZXMuZm9yRWFjaCgoeCkgPT4ge1xuICAgIGNvbnN0IGsgPSBmbih4KTtcbiAgICBpZiAoIW0uaGFzKGspKSB7XG4gICAgICBtLnNldChrLCB4KTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gQXJyYXkuZnJvbShtLnZhbHVlcygpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVuaXFXaXRoPFQ+KGFycjogVFtdLCBmbjogKG9uZTogVCwgb3RoZXI6IFQpID0+IGJvb2xlYW4pIHtcbiAgcmV0dXJuIGFyci5maWx0ZXIoXG4gICAgKGVsZW1lbnQsIGluZGV4KSA9PiBhcnIuZmluZEluZGV4KChzdGVwKSA9PiBmbihlbGVtZW50LCBzdGVwKSkgPT09IGluZGV4XG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhcnJheUVxdWFscyhcbiAgYXJyMTogdW5rbm93bltdLFxuICBhcnIyOiB1bmtub3duW10sXG4gIGxlbmd0aD86IG51bWJlclxuKTogYm9vbGVhbiB7XG4gIGxldCBsID0gTWF0aC5tYXgoYXJyMS5sZW5ndGgsIGFycjIubGVuZ3RoKTtcbiAgaWYgKGxlbmd0aCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgbCA9IE1hdGgubWluKGwsIGxlbmd0aCk7XG4gIH1cblxuICBmb3IgKGxldCBpID0gMDsgaSA8IGw7IGkrKykge1xuICAgIGlmIChhcnIxW2ldICE9PSBhcnIyW2ldKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhcnJheUVxdWFsc1VudGlsKGFycjE6IHVua25vd25bXSwgYXJyMjogdW5rbm93bltdKTogbnVtYmVyIHtcbiAgbGV0IGwgPSBNYXRoLm1pbihhcnIxLmxlbmd0aCwgYXJyMi5sZW5ndGgpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGw7IGkrKykge1xuICAgIGlmIChhcnIxW2ldICE9PSBhcnIyW2ldKSB7XG4gICAgICByZXR1cm4gaSAtIDE7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGwgLSAxO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWlycm9yTWFwPFQ+KFxuICBjb2xsZWN0aW9uOiBUW10sXG4gIHRvVmFsdWU6ICh0OiBUKSA9PiBzdHJpbmdcbik6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0ge1xuICByZXR1cm4gY29sbGVjdGlvbi5yZWR1Y2UoKHAsIGMpID0+ICh7IC4uLnAsIFt0b1ZhbHVlKGMpXTogdG9WYWx1ZShjKSB9KSwge30pO1xufVxuIiwiZXhwb3J0IHR5cGUgV29yZFR5cGUgPVxuICB8IFwiY3VycmVudEZpbGVcIlxuICB8IFwiY3VycmVudFZhdWx0XCJcbiAgfCBcImN1c3RvbURpY3Rpb25hcnlcIlxuICB8IFwiaW50ZXJuYWxMaW5rXCJcbiAgfCBcImZyb250TWF0dGVyXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgRGVmYXVsdFdvcmQge1xuICB2YWx1ZTogc3RyaW5nO1xuICBkZXNjcmlwdGlvbj86IHN0cmluZztcbiAgYWxpYXNlcz86IHN0cmluZ1tdO1xuICB0eXBlOiBXb3JkVHlwZTtcbiAgY3JlYXRlZFBhdGg6IHN0cmluZztcbiAgLy8gQWRkIGFmdGVyIGp1ZGdlXG4gIG9mZnNldD86IG51bWJlcjtcbiAgaGl0Pzogc3RyaW5nO1xufVxuZXhwb3J0IGludGVyZmFjZSBDdXJyZW50RmlsZVdvcmQgZXh0ZW5kcyBEZWZhdWx0V29yZCB7XG4gIHR5cGU6IFwiY3VycmVudEZpbGVcIjtcbn1cbmV4cG9ydCBpbnRlcmZhY2UgQ3VycmVudFZhdWx0V29yZCBleHRlbmRzIERlZmF1bHRXb3JkIHtcbiAgdHlwZTogXCJjdXJyZW50VmF1bHRcIjtcbn1cbmV4cG9ydCBpbnRlcmZhY2UgQ3VzdG9tRGljdGlvbmFyeVdvcmQgZXh0ZW5kcyBEZWZhdWx0V29yZCB7XG4gIHR5cGU6IFwiY3VzdG9tRGljdGlvbmFyeVwiO1xuICBjYXJldFN5bWJvbD86IHN0cmluZztcbiAgLyoqIFVzZSBmb3IgaW5zZXJ0aW5nIGluc3RlYWQgb2YgdmFsdWUgKiovXG4gIGluc2VydGVkVGV4dD86IHN0cmluZztcbiAgLyoqIElmIHRydWUsIGlnbm9yZSBgSW5zZXJ0IHNwYWNlIGFmdGVyIGNvbXBsZXRpb25gIG9wdGlvbiAqKi9cbiAgaWdub3JlU3BhY2VBZnRlckNvbXBsZXRpb24/OiBib29sZWFuO1xufVxuZXhwb3J0IGludGVyZmFjZSBJbnRlcm5hbExpbmtXb3JkIGV4dGVuZHMgRGVmYXVsdFdvcmQge1xuICB0eXBlOiBcImludGVybmFsTGlua1wiO1xuICBwaGFudG9tPzogYm9vbGVhbjtcbiAgYWxpYXNNZXRhPzoge1xuICAgIG9yaWdpbjogc3RyaW5nO1xuICB9O1xufVxuZXhwb3J0IGludGVyZmFjZSBGcm9udE1hdHRlcldvcmQgZXh0ZW5kcyBEZWZhdWx0V29yZCB7XG4gIHR5cGU6IFwiZnJvbnRNYXR0ZXJcIjtcbiAga2V5OiBzdHJpbmc7XG59XG5cbmV4cG9ydCB0eXBlIFdvcmQgPVxuICB8IEN1cnJlbnRGaWxlV29yZFxuICB8IEN1cnJlbnRWYXVsdFdvcmRcbiAgfCBDdXN0b21EaWN0aW9uYXJ5V29yZFxuICB8IEludGVybmFsTGlua1dvcmRcbiAgfCBGcm9udE1hdHRlcldvcmQ7XG5cbmV4cG9ydCBjbGFzcyBXb3JkVHlwZU1ldGEge1xuICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBfdmFsdWVzOiBXb3JkVHlwZU1ldGFbXSA9IFtdO1xuICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBfZGljdDogeyBbdHlwZTogc3RyaW5nXTogV29yZFR5cGVNZXRhIH0gPSB7fTtcblxuICBzdGF0aWMgcmVhZG9ubHkgRlJPTlRfTUFUVEVSID0gbmV3IFdvcmRUeXBlTWV0YShcbiAgICBcImZyb250TWF0dGVyXCIsXG4gICAgMTAwLFxuICAgIFwiZnJvbnRNYXR0ZXJcIlxuICApO1xuICBzdGF0aWMgcmVhZG9ubHkgSU5URVJOQUxfTElOSyA9IG5ldyBXb3JkVHlwZU1ldGEoXG4gICAgXCJpbnRlcm5hbExpbmtcIixcbiAgICA5MCxcbiAgICBcImludGVybmFsTGlua1wiXG4gICk7XG4gIHN0YXRpYyByZWFkb25seSBDVVNUT01fRElDVElPTkFSWSA9IG5ldyBXb3JkVHlwZU1ldGEoXG4gICAgXCJjdXN0b21EaWN0aW9uYXJ5XCIsXG4gICAgODAsXG4gICAgXCJzdWdnZXN0aW9uXCJcbiAgKTtcbiAgc3RhdGljIHJlYWRvbmx5IENVUlJFTlRfRklMRSA9IG5ldyBXb3JkVHlwZU1ldGEoXG4gICAgXCJjdXJyZW50RmlsZVwiLFxuICAgIDcwLFxuICAgIFwic3VnZ2VzdGlvblwiXG4gICk7XG4gIHN0YXRpYyByZWFkb25seSBDVVJSRU5UX1ZBVUxUID0gbmV3IFdvcmRUeXBlTWV0YShcbiAgICBcImN1cnJlbnRWYXVsdFwiLFxuICAgIDYwLFxuICAgIFwic3VnZ2VzdGlvblwiXG4gICk7XG5cbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcihcbiAgICByZWFkb25seSB0eXBlOiBXb3JkVHlwZSxcbiAgICByZWFkb25seSBwcmlvcml0eTogbnVtYmVyLFxuICAgIHJlYWRvbmx5IGdyb3VwOiBzdHJpbmdcbiAgKSB7XG4gICAgV29yZFR5cGVNZXRhLl92YWx1ZXMucHVzaCh0aGlzKTtcbiAgICBXb3JkVHlwZU1ldGEuX2RpY3RbdHlwZV0gPSB0aGlzO1xuICB9XG5cbiAgc3RhdGljIG9mKHR5cGU6IFdvcmRUeXBlKTogV29yZFR5cGVNZXRhIHtcbiAgICByZXR1cm4gV29yZFR5cGVNZXRhLl9kaWN0W3R5cGVdO1xuICB9XG5cbiAgc3RhdGljIHZhbHVlcygpOiBXb3JkVHlwZU1ldGFbXSB7XG4gICAgcmV0dXJuIFdvcmRUeXBlTWV0YS5fdmFsdWVzO1xuICB9XG59XG4iLCJpbXBvcnQge1xuICBjYXBpdGFsaXplRmlyc3RMZXR0ZXIsXG4gIGxvd2VySW5jbHVkZXMsXG4gIGxvd2VyU3RhcnRzV2l0aCxcbn0gZnJvbSBcIi4uL3V0aWwvc3RyaW5nc1wiO1xuaW1wb3J0IHR5cGUgeyBJbmRleGVkV29yZHMgfSBmcm9tIFwiLi4vdWkvQXV0b0NvbXBsZXRlU3VnZ2VzdFwiO1xuaW1wb3J0IHsgdW5pcVdpdGggfSBmcm9tIFwiLi4vdXRpbC9jb2xsZWN0aW9uLWhlbHBlclwiO1xuaW1wb3J0IHsgdHlwZSBXb3JkLCBXb3JkVHlwZU1ldGEgfSBmcm9tIFwiLi4vbW9kZWwvV29yZFwiO1xuaW1wb3J0IHR5cGUge1xuICBIaXRXb3JkLFxuICBTZWxlY3Rpb25IaXN0b3J5U3RvcmFnZSxcbn0gZnJvbSBcIi4uL3N0b3JhZ2UvU2VsZWN0aW9uSGlzdG9yeVN0b3JhZ2VcIjtcblxuZXhwb3J0IHR5cGUgV29yZHNCeUZpcnN0TGV0dGVyID0geyBbZmlyc3RMZXR0ZXI6IHN0cmluZ106IFdvcmRbXSB9O1xuXG5pbnRlcmZhY2UgSnVkZ2VtZW50IHtcbiAgd29yZDogV29yZDtcbiAgLy8gVE9ETzogcmVtb3ZlIHZhbHVlLiB1c2Ugd29yZC5oaXQgaW5zdGVhZFxuICB2YWx1ZT86IHN0cmluZztcbiAgYWxpYXM6IGJvb2xlYW47XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwdXNoV29yZChcbiAgd29yZHNCeUZpcnN0TGV0dGVyOiBXb3Jkc0J5Rmlyc3RMZXR0ZXIsXG4gIGtleTogc3RyaW5nLFxuICB3b3JkOiBXb3JkXG4pIHtcbiAgaWYgKHdvcmRzQnlGaXJzdExldHRlcltrZXldID09PSB1bmRlZmluZWQpIHtcbiAgICB3b3Jkc0J5Rmlyc3RMZXR0ZXJba2V5XSA9IFt3b3JkXTtcbiAgICByZXR1cm47XG4gIH1cblxuICB3b3Jkc0J5Rmlyc3RMZXR0ZXJba2V5XS5wdXNoKHdvcmQpO1xufVxuXG4vLyBQdWJsaWMgZm9yIHRlc3RzXG5leHBvcnQgZnVuY3Rpb24ganVkZ2UoXG4gIHdvcmQ6IFdvcmQsXG4gIHF1ZXJ5OiBzdHJpbmcsXG4gIHF1ZXJ5U3RhcnRXaXRoVXBwZXI6IGJvb2xlYW5cbik6IEp1ZGdlbWVudCB7XG4gIGlmIChxdWVyeSA9PT0gXCJcIikge1xuICAgIHJldHVybiB7XG4gICAgICB3b3JkOiB7XG4gICAgICAgIC4uLndvcmQsXG4gICAgICAgIGhpdDogd29yZC52YWx1ZSxcbiAgICAgIH0sXG4gICAgICB2YWx1ZTogd29yZC52YWx1ZSxcbiAgICAgIGFsaWFzOiBmYWxzZSxcbiAgICB9O1xuICB9XG5cbiAgaWYgKGxvd2VyU3RhcnRzV2l0aCh3b3JkLnZhbHVlLCBxdWVyeSkpIHtcbiAgICBpZiAoXG4gICAgICBxdWVyeVN0YXJ0V2l0aFVwcGVyICYmXG4gICAgICB3b3JkLnR5cGUgIT09IFwiaW50ZXJuYWxMaW5rXCIgJiZcbiAgICAgIHdvcmQudHlwZSAhPT0gXCJmcm9udE1hdHRlclwiXG4gICAgKSB7XG4gICAgICBjb25zdCBjID0gY2FwaXRhbGl6ZUZpcnN0TGV0dGVyKHdvcmQudmFsdWUpO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgd29yZDoge1xuICAgICAgICAgIC4uLndvcmQsXG4gICAgICAgICAgdmFsdWU6IGMsXG4gICAgICAgICAgaGl0OiBjLFxuICAgICAgICB9LFxuICAgICAgICB2YWx1ZTogYyxcbiAgICAgICAgYWxpYXM6IGZhbHNlLFxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgd29yZDoge1xuICAgICAgICAgIC4uLndvcmQsXG4gICAgICAgICAgaGl0OiB3b3JkLnZhbHVlLFxuICAgICAgICB9LFxuICAgICAgICB2YWx1ZTogd29yZC52YWx1ZSxcbiAgICAgICAgYWxpYXM6IGZhbHNlLFxuICAgICAgfTtcbiAgICB9XG4gIH1cbiAgY29uc3QgbWF0Y2hlZEFsaWFzID0gd29yZC5hbGlhc2VzPy5maW5kKChhKSA9PiBsb3dlclN0YXJ0c1dpdGgoYSwgcXVlcnkpKTtcbiAgaWYgKG1hdGNoZWRBbGlhcykge1xuICAgIHJldHVybiB7XG4gICAgICB3b3JkOiB7XG4gICAgICAgIC4uLndvcmQsXG4gICAgICAgIGhpdDogbWF0Y2hlZEFsaWFzLFxuICAgICAgfSxcbiAgICAgIHZhbHVlOiBtYXRjaGVkQWxpYXMsXG4gICAgICBhbGlhczogdHJ1ZSxcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICB3b3JkLFxuICAgIGFsaWFzOiBmYWxzZSxcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN1Z2dlc3RXb3JkcyhcbiAgaW5kZXhlZFdvcmRzOiBJbmRleGVkV29yZHMsXG4gIHF1ZXJ5OiBzdHJpbmcsXG4gIG1heDogbnVtYmVyLFxuICBmcm9udE1hdHRlcjogc3RyaW5nIHwgbnVsbCxcbiAgc2VsZWN0aW9uSGlzdG9yeVN0b3JhZ2U/OiBTZWxlY3Rpb25IaXN0b3J5U3RvcmFnZVxuKTogV29yZFtdIHtcbiAgY29uc3QgcXVlcnlTdGFydFdpdGhVcHBlciA9IGNhcGl0YWxpemVGaXJzdExldHRlcihxdWVyeSkgPT09IHF1ZXJ5O1xuXG4gIGNvbnN0IGZsYXR0ZW5Gcm9udE1hdHRlcldvcmRzID0gKCkgPT4ge1xuICAgIGlmIChmcm9udE1hdHRlciA9PT0gXCJhbGlhc1wiIHx8IGZyb250TWF0dGVyID09PSBcImFsaWFzZXNcIikge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICBpZiAoZnJvbnRNYXR0ZXIgJiYgaW5kZXhlZFdvcmRzLmZyb250TWF0dGVyPy5bZnJvbnRNYXR0ZXJdKSB7XG4gICAgICByZXR1cm4gT2JqZWN0LnZhbHVlcyhpbmRleGVkV29yZHMuZnJvbnRNYXR0ZXI/Lltmcm9udE1hdHRlcl0pLmZsYXQoKTtcbiAgICB9XG4gICAgcmV0dXJuIFtdO1xuICB9O1xuXG4gIGNvbnN0IHdvcmRzID0gcXVlcnlTdGFydFdpdGhVcHBlclxuICAgID8gZnJvbnRNYXR0ZXJcbiAgICAgID8gZmxhdHRlbkZyb250TWF0dGVyV29yZHMoKVxuICAgICAgOiBbXG4gICAgICAgICAgLi4uKGluZGV4ZWRXb3Jkcy5jdXJyZW50RmlsZVtxdWVyeS5jaGFyQXQoMCldID8/IFtdKSxcbiAgICAgICAgICAuLi4oaW5kZXhlZFdvcmRzLmN1cnJlbnRGaWxlW3F1ZXJ5LmNoYXJBdCgwKS50b0xvd2VyQ2FzZSgpXSA/PyBbXSksXG4gICAgICAgICAgLi4uKGluZGV4ZWRXb3Jkcy5jdXJyZW50VmF1bHRbcXVlcnkuY2hhckF0KDApXSA/PyBbXSksXG4gICAgICAgICAgLi4uKGluZGV4ZWRXb3Jkcy5jdXJyZW50VmF1bHRbcXVlcnkuY2hhckF0KDApLnRvTG93ZXJDYXNlKCldID8/IFtdKSxcbiAgICAgICAgICAuLi4oaW5kZXhlZFdvcmRzLmN1c3RvbURpY3Rpb25hcnlbcXVlcnkuY2hhckF0KDApXSA/PyBbXSksXG4gICAgICAgICAgLi4uKGluZGV4ZWRXb3Jkcy5jdXN0b21EaWN0aW9uYXJ5W3F1ZXJ5LmNoYXJBdCgwKS50b0xvd2VyQ2FzZSgpXSA/P1xuICAgICAgICAgICAgW10pLFxuICAgICAgICAgIC4uLihpbmRleGVkV29yZHMuaW50ZXJuYWxMaW5rW3F1ZXJ5LmNoYXJBdCgwKV0gPz8gW10pLFxuICAgICAgICAgIC4uLihpbmRleGVkV29yZHMuaW50ZXJuYWxMaW5rW3F1ZXJ5LmNoYXJBdCgwKS50b0xvd2VyQ2FzZSgpXSA/PyBbXSksXG4gICAgICAgIF1cbiAgICA6IGZyb250TWF0dGVyXG4gICAgPyBmbGF0dGVuRnJvbnRNYXR0ZXJXb3JkcygpXG4gICAgOiBbXG4gICAgICAgIC4uLihpbmRleGVkV29yZHMuY3VycmVudEZpbGVbcXVlcnkuY2hhckF0KDApXSA/PyBbXSksXG4gICAgICAgIC4uLihpbmRleGVkV29yZHMuY3VycmVudEZpbGVbcXVlcnkuY2hhckF0KDApLnRvVXBwZXJDYXNlKCldID8/IFtdKSxcbiAgICAgICAgLi4uKGluZGV4ZWRXb3Jkcy5jdXJyZW50VmF1bHRbcXVlcnkuY2hhckF0KDApXSA/PyBbXSksXG4gICAgICAgIC4uLihpbmRleGVkV29yZHMuY3VycmVudFZhdWx0W3F1ZXJ5LmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpXSA/PyBbXSksXG4gICAgICAgIC4uLihpbmRleGVkV29yZHMuY3VzdG9tRGljdGlvbmFyeVtxdWVyeS5jaGFyQXQoMCldID8/IFtdKSxcbiAgICAgICAgLi4uKGluZGV4ZWRXb3Jkcy5jdXN0b21EaWN0aW9uYXJ5W3F1ZXJ5LmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpXSA/PyBbXSksXG4gICAgICAgIC4uLihpbmRleGVkV29yZHMuaW50ZXJuYWxMaW5rW3F1ZXJ5LmNoYXJBdCgwKV0gPz8gW10pLFxuICAgICAgICAuLi4oaW5kZXhlZFdvcmRzLmludGVybmFsTGlua1txdWVyeS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKV0gPz8gW10pLFxuICAgICAgXTtcblxuICBjb25zdCBjYW5kaWRhdGUgPSBBcnJheS5mcm9tKHdvcmRzKVxuICAgIC5tYXAoKHgpID0+IGp1ZGdlKHgsIHF1ZXJ5LCBxdWVyeVN0YXJ0V2l0aFVwcGVyKSlcbiAgICAuZmlsdGVyKCh4KSA9PiB4LnZhbHVlICE9PSB1bmRlZmluZWQpXG4gICAgLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgIGNvbnN0IGFXb3JkID0gYS53b3JkIGFzIEhpdFdvcmQ7XG4gICAgICBjb25zdCBiV29yZCA9IGIud29yZCBhcyBIaXRXb3JkO1xuXG4gICAgICBjb25zdCBub3RTYW1lV29yZFR5cGUgPSBhV29yZC50eXBlICE9PSBiV29yZC50eXBlO1xuICAgICAgaWYgKGZyb250TWF0dGVyICYmIG5vdFNhbWVXb3JkVHlwZSkge1xuICAgICAgICByZXR1cm4gYldvcmQudHlwZSA9PT0gXCJmcm9udE1hdHRlclwiID8gMSA6IC0xO1xuICAgICAgfVxuXG4gICAgICBpZiAoc2VsZWN0aW9uSGlzdG9yeVN0b3JhZ2UpIHtcbiAgICAgICAgY29uc3QgcmV0ID0gc2VsZWN0aW9uSGlzdG9yeVN0b3JhZ2UuY29tcGFyZShcbiAgICAgICAgICBhV29yZCBhcyBIaXRXb3JkLFxuICAgICAgICAgIGJXb3JkIGFzIEhpdFdvcmRcbiAgICAgICAgKTtcbiAgICAgICAgaWYgKHJldCAhPT0gMCkge1xuICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGEudmFsdWUhLmxlbmd0aCAhPT0gYi52YWx1ZSEubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBhLnZhbHVlIS5sZW5ndGggPiBiLnZhbHVlIS5sZW5ndGggPyAxIDogLTE7XG4gICAgICB9XG4gICAgICBpZiAobm90U2FtZVdvcmRUeXBlKSB7XG4gICAgICAgIHJldHVybiBXb3JkVHlwZU1ldGEub2YoYldvcmQudHlwZSkucHJpb3JpdHkgPlxuICAgICAgICAgIFdvcmRUeXBlTWV0YS5vZihhV29yZC50eXBlKS5wcmlvcml0eVxuICAgICAgICAgID8gMVxuICAgICAgICAgIDogLTE7XG4gICAgICB9XG4gICAgICBpZiAoYS5hbGlhcyAhPT0gYi5hbGlhcykge1xuICAgICAgICByZXR1cm4gYS5hbGlhcyA/IDEgOiAtMTtcbiAgICAgIH1cbiAgICAgIHJldHVybiAwO1xuICAgIH0pXG4gICAgLm1hcCgoeCkgPT4geC53b3JkKVxuICAgIC5zbGljZSgwLCBtYXgpO1xuXG4gIC8vIFhYWDogVGhlcmUgaXMgbm8gZ3VhcmFudGVlIHRoYXQgZXF1YWxzIHdpdGggbWF4LCBidXQgaXQgaXMgaW1wb3J0YW50IGZvciBwZXJmb3JtYW5jZVxuICByZXR1cm4gdW5pcVdpdGgoXG4gICAgY2FuZGlkYXRlLFxuICAgIChhLCBiKSA9PlxuICAgICAgYS52YWx1ZSA9PT0gYi52YWx1ZSAmJlxuICAgICAgV29yZFR5cGVNZXRhLm9mKGEudHlwZSkuZ3JvdXAgPT09IFdvcmRUeXBlTWV0YS5vZihiLnR5cGUpLmdyb3VwXG4gICk7XG59XG5cbi8vIFRPRE86IHJlZmFjdG9yaW5nXG4vLyBQdWJsaWMgZm9yIHRlc3RzXG5leHBvcnQgZnVuY3Rpb24ganVkZ2VCeVBhcnRpYWxNYXRjaChcbiAgd29yZDogV29yZCxcbiAgcXVlcnk6IHN0cmluZyxcbiAgcXVlcnlTdGFydFdpdGhVcHBlcjogYm9vbGVhblxuKTogSnVkZ2VtZW50IHtcbiAgaWYgKHF1ZXJ5ID09PSBcIlwiKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHdvcmQ6IHsgLi4ud29yZCwgaGl0OiB3b3JkLnZhbHVlIH0sXG4gICAgICB2YWx1ZTogd29yZC52YWx1ZSxcbiAgICAgIGFsaWFzOiBmYWxzZSxcbiAgICB9O1xuICB9XG5cbiAgaWYgKGxvd2VyU3RhcnRzV2l0aCh3b3JkLnZhbHVlLCBxdWVyeSkpIHtcbiAgICBpZiAoXG4gICAgICBxdWVyeVN0YXJ0V2l0aFVwcGVyICYmXG4gICAgICB3b3JkLnR5cGUgIT09IFwiaW50ZXJuYWxMaW5rXCIgJiZcbiAgICAgIHdvcmQudHlwZSAhPT0gXCJmcm9udE1hdHRlclwiXG4gICAgKSB7XG4gICAgICBjb25zdCBjID0gY2FwaXRhbGl6ZUZpcnN0TGV0dGVyKHdvcmQudmFsdWUpO1xuICAgICAgcmV0dXJuIHsgd29yZDogeyAuLi53b3JkLCB2YWx1ZTogYywgaGl0OiBjIH0sIHZhbHVlOiBjLCBhbGlhczogZmFsc2UgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgd29yZDogeyAuLi53b3JkLCBoaXQ6IHdvcmQudmFsdWUgfSxcbiAgICAgICAgdmFsdWU6IHdvcmQudmFsdWUsXG4gICAgICAgIGFsaWFzOiBmYWxzZSxcbiAgICAgIH07XG4gICAgfVxuICB9XG5cbiAgY29uc3QgbWF0Y2hlZEFsaWFzU3RhcnRzID0gd29yZC5hbGlhc2VzPy5maW5kKChhKSA9PlxuICAgIGxvd2VyU3RhcnRzV2l0aChhLCBxdWVyeSlcbiAgKTtcbiAgaWYgKG1hdGNoZWRBbGlhc1N0YXJ0cykge1xuICAgIHJldHVybiB7XG4gICAgICB3b3JkOiB7IC4uLndvcmQsIGhpdDogbWF0Y2hlZEFsaWFzU3RhcnRzIH0sXG4gICAgICB2YWx1ZTogbWF0Y2hlZEFsaWFzU3RhcnRzLFxuICAgICAgYWxpYXM6IHRydWUsXG4gICAgfTtcbiAgfVxuXG4gIGlmIChsb3dlckluY2x1ZGVzKHdvcmQudmFsdWUsIHF1ZXJ5KSkge1xuICAgIHJldHVybiB7XG4gICAgICB3b3JkOiB7IC4uLndvcmQsIGhpdDogd29yZC52YWx1ZSB9LFxuICAgICAgdmFsdWU6IHdvcmQudmFsdWUsXG4gICAgICBhbGlhczogZmFsc2UsXG4gICAgfTtcbiAgfVxuXG4gIGNvbnN0IG1hdGNoZWRBbGlhc0luY2x1ZGVkID0gd29yZC5hbGlhc2VzPy5maW5kKChhKSA9PlxuICAgIGxvd2VySW5jbHVkZXMoYSwgcXVlcnkpXG4gICk7XG4gIGlmIChtYXRjaGVkQWxpYXNJbmNsdWRlZCkge1xuICAgIHJldHVybiB7XG4gICAgICB3b3JkOiB7IC4uLndvcmQsIGhpdDogbWF0Y2hlZEFsaWFzSW5jbHVkZWQgfSxcbiAgICAgIHZhbHVlOiBtYXRjaGVkQWxpYXNJbmNsdWRlZCxcbiAgICAgIGFsaWFzOiB0cnVlLFxuICAgIH07XG4gIH1cblxuICByZXR1cm4geyB3b3JkOiB3b3JkLCBhbGlhczogZmFsc2UgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN1Z2dlc3RXb3Jkc0J5UGFydGlhbE1hdGNoKFxuICBpbmRleGVkV29yZHM6IEluZGV4ZWRXb3JkcyxcbiAgcXVlcnk6IHN0cmluZyxcbiAgbWF4OiBudW1iZXIsXG4gIGZyb250TWF0dGVyOiBzdHJpbmcgfCBudWxsLFxuICBzZWxlY3Rpb25IaXN0b3J5U3RvcmFnZT86IFNlbGVjdGlvbkhpc3RvcnlTdG9yYWdlXG4pOiBXb3JkW10ge1xuICBjb25zdCBxdWVyeVN0YXJ0V2l0aFVwcGVyID0gY2FwaXRhbGl6ZUZpcnN0TGV0dGVyKHF1ZXJ5KSA9PT0gcXVlcnk7XG5cbiAgY29uc3QgZmxhdE9iamVjdFZhbHVlcyA9IChvYmplY3Q6IHsgW2ZpcnN0TGV0dGVyOiBzdHJpbmddOiBXb3JkW10gfSkgPT5cbiAgICBPYmplY3QudmFsdWVzKG9iamVjdCkuZmxhdCgpO1xuXG4gIGNvbnN0IGZsYXR0ZW5Gcm9udE1hdHRlcldvcmRzID0gKCkgPT4ge1xuICAgIGlmIChmcm9udE1hdHRlciA9PT0gXCJhbGlhc1wiIHx8IGZyb250TWF0dGVyID09PSBcImFsaWFzZXNcIikge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICBpZiAoZnJvbnRNYXR0ZXIgJiYgaW5kZXhlZFdvcmRzLmZyb250TWF0dGVyPy5bZnJvbnRNYXR0ZXJdKSB7XG4gICAgICByZXR1cm4gT2JqZWN0LnZhbHVlcyhpbmRleGVkV29yZHMuZnJvbnRNYXR0ZXI/Lltmcm9udE1hdHRlcl0pLmZsYXQoKTtcbiAgICB9XG4gICAgcmV0dXJuIFtdO1xuICB9O1xuXG4gIGNvbnN0IHdvcmRzID0gZnJvbnRNYXR0ZXJcbiAgICA/IGZsYXR0ZW5Gcm9udE1hdHRlcldvcmRzKClcbiAgICA6IFtcbiAgICAgICAgLi4uZmxhdE9iamVjdFZhbHVlcyhpbmRleGVkV29yZHMuY3VycmVudEZpbGUpLFxuICAgICAgICAuLi5mbGF0T2JqZWN0VmFsdWVzKGluZGV4ZWRXb3Jkcy5jdXJyZW50VmF1bHQpLFxuICAgICAgICAuLi5mbGF0T2JqZWN0VmFsdWVzKGluZGV4ZWRXb3Jkcy5jdXN0b21EaWN0aW9uYXJ5KSxcbiAgICAgICAgLi4uZmxhdE9iamVjdFZhbHVlcyhpbmRleGVkV29yZHMuaW50ZXJuYWxMaW5rKSxcbiAgICAgIF07XG5cbiAgY29uc3QgY2FuZGlkYXRlID0gQXJyYXkuZnJvbSh3b3JkcylcbiAgICAubWFwKCh4KSA9PiBqdWRnZUJ5UGFydGlhbE1hdGNoKHgsIHF1ZXJ5LCBxdWVyeVN0YXJ0V2l0aFVwcGVyKSlcbiAgICAuZmlsdGVyKCh4KSA9PiB4LnZhbHVlICE9PSB1bmRlZmluZWQpXG4gICAgLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgIGNvbnN0IGFXb3JkID0gYS53b3JkIGFzIEhpdFdvcmQ7XG4gICAgICBjb25zdCBiV29yZCA9IGIud29yZCBhcyBIaXRXb3JkO1xuXG4gICAgICBjb25zdCBub3RTYW1lV29yZFR5cGUgPSBhV29yZC50eXBlICE9PSBiV29yZC50eXBlO1xuICAgICAgaWYgKGZyb250TWF0dGVyICYmIG5vdFNhbWVXb3JkVHlwZSkge1xuICAgICAgICByZXR1cm4gYldvcmQudHlwZSA9PT0gXCJmcm9udE1hdHRlclwiID8gMSA6IC0xO1xuICAgICAgfVxuXG4gICAgICBpZiAoc2VsZWN0aW9uSGlzdG9yeVN0b3JhZ2UpIHtcbiAgICAgICAgY29uc3QgcmV0ID0gc2VsZWN0aW9uSGlzdG9yeVN0b3JhZ2UuY29tcGFyZShcbiAgICAgICAgICBhV29yZCBhcyBIaXRXb3JkLFxuICAgICAgICAgIGJXb3JkIGFzIEhpdFdvcmRcbiAgICAgICAgKTtcbiAgICAgICAgaWYgKHJldCAhPT0gMCkge1xuICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29uc3QgYXMgPSBsb3dlclN0YXJ0c1dpdGgoYS52YWx1ZSEsIHF1ZXJ5KTtcbiAgICAgIGNvbnN0IGJzID0gbG93ZXJTdGFydHNXaXRoKGIudmFsdWUhLCBxdWVyeSk7XG4gICAgICBpZiAoYXMgIT09IGJzKSB7XG4gICAgICAgIHJldHVybiBicyA/IDEgOiAtMTtcbiAgICAgIH1cblxuICAgICAgaWYgKGEudmFsdWUhLmxlbmd0aCAhPT0gYi52YWx1ZSEubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBhLnZhbHVlIS5sZW5ndGggPiBiLnZhbHVlIS5sZW5ndGggPyAxIDogLTE7XG4gICAgICB9XG4gICAgICBpZiAobm90U2FtZVdvcmRUeXBlKSB7XG4gICAgICAgIHJldHVybiBXb3JkVHlwZU1ldGEub2YoYldvcmQudHlwZSkucHJpb3JpdHkgPlxuICAgICAgICAgIFdvcmRUeXBlTWV0YS5vZihhV29yZC50eXBlKS5wcmlvcml0eVxuICAgICAgICAgID8gMVxuICAgICAgICAgIDogLTE7XG4gICAgICB9XG4gICAgICBpZiAoYS5hbGlhcyAhPT0gYi5hbGlhcykge1xuICAgICAgICByZXR1cm4gYS5hbGlhcyA/IDEgOiAtMTtcbiAgICAgIH1cbiAgICAgIHJldHVybiAwO1xuICAgIH0pXG4gICAgLm1hcCgoeCkgPT4geC53b3JkKVxuICAgIC5zbGljZSgwLCBtYXgpO1xuXG4gIC8vIFhYWDogVGhlcmUgaXMgbm8gZ3VhcmFudGVlIHRoYXQgZXF1YWxzIHdpdGggbWF4LCBidXQgaXQgaXMgaW1wb3J0YW50IGZvciBwZXJmb3JtYW5jZVxuICByZXR1cm4gdW5pcVdpdGgoXG4gICAgY2FuZGlkYXRlLFxuICAgIChhLCBiKSA9PlxuICAgICAgYS52YWx1ZSA9PT0gYi52YWx1ZSAmJlxuICAgICAgV29yZFR5cGVNZXRhLm9mKGEudHlwZSkuZ3JvdXAgPT09IFdvcmRUeXBlTWV0YS5vZihiLnR5cGUpLmdyb3VwXG4gICk7XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gYmFzZW5hbWUocGF0aDogc3RyaW5nLCBleHQ/OiBzdHJpbmcpOiBzdHJpbmcge1xuICBjb25zdCBuYW1lID0gcGF0aC5tYXRjaCgvLitbXFxcXC9dKFteXFxcXC9dKylbXFxcXC9dPyQvKT8uWzFdID8/IHBhdGg7XG4gIHJldHVybiBleHQgJiYgbmFtZS5lbmRzV2l0aChleHQpID8gbmFtZS5yZXBsYWNlKGV4dCwgXCJcIikgOiBuYW1lO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZXh0bmFtZShwYXRoOiBzdHJpbmcpOiBzdHJpbmcge1xuICBjb25zdCBleHQgPSBiYXNlbmFtZShwYXRoKS5zcGxpdChcIi5cIikuc2xpY2UoMSkucG9wKCk7XG4gIHJldHVybiBleHQgPyBgLiR7ZXh0fWAgOiBcIlwiO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGlybmFtZShwYXRoOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gcGF0aC5tYXRjaCgvKC4rKVtcXFxcL10uKyQvKT8uWzFdID8/IFwiLlwiO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNVUkwocGF0aDogc3RyaW5nKTogYm9vbGVhbiB7XG4gIHJldHVybiBCb29sZWFuKHBhdGgubWF0Y2gobmV3IFJlZ0V4cChcIl5odHRwcz86Ly9cIikpKTtcbn1cbiIsImltcG9ydCB7IEFwcCwgRmlsZVN5c3RlbUFkYXB0ZXIsIE5vdGljZSwgcmVxdWVzdCB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHsgcHVzaFdvcmQsIHR5cGUgV29yZHNCeUZpcnN0TGV0dGVyIH0gZnJvbSBcIi4vc3VnZ2VzdGVyXCI7XG5pbXBvcnQgdHlwZSB7IENvbHVtbkRlbGltaXRlciB9IGZyb20gXCIuLi9vcHRpb24vQ29sdW1uRGVsaW1pdGVyXCI7XG5pbXBvcnQgeyBpc1VSTCB9IGZyb20gXCIuLi91dGlsL3BhdGhcIjtcbmltcG9ydCB0eXBlIHsgQ3VzdG9tRGljdGlvbmFyeVdvcmQgfSBmcm9tIFwiLi4vbW9kZWwvV29yZFwiO1xuaW1wb3J0IHsgZXhjbHVkZUVtb2ppIH0gZnJvbSBcIi4uL3V0aWwvc3RyaW5nc1wiO1xuaW1wb3J0IHR5cGUgeyBBcHBIZWxwZXIgfSBmcm9tIFwiLi4vYXBwLWhlbHBlclwiO1xuXG50eXBlIEpzb25EaWN0aW9uYXJ5ID0ge1xuICAvKiogSWYgc2V0LCB0YWtlIHByZWNlZGVuY2Ugb3ZlciBbXCJDYXJldCBsb2NhdGlvbiBzeW1ib2wgYWZ0ZXIgY29tcGxlbWVudFwiXShodHRwczovL3RhZGFzaGktYWlrYXdhLmdpdGh1Yi5pby9kb2NzLW9ic2lkaWFuLXZhcmlvdXMtY29tcGxlbWVudHMtcGx1Z2luLzQuJTIwT3B0aW9ucy80LjYuJTIwQ3VzdG9tJTIwZGljdGlvbmFyeSUyMGNvbXBsZW1lbnQvJUUyJTlBJTk5JUVGJUI4JThGQ2FyZXQlMjBsb2NhdGlvbiUyMHN5bWJvbCUyMGFmdGVyJTIwY29tcGxlbWVudC8pICovXG4gIGNhcmV0U3ltYm9sPzogc3RyaW5nO1xuICAvKiogSWYgc2V0LCBpZ25vcmUgW1wiSW5zZXJ0IHNwYWNlIGFmdGVyIGNvbXBsZXRpb25cIl0oaHR0cHM6Ly90YWRhc2hpLWFpa2F3YS5naXRodWIuaW8vZG9jcy1vYnNpZGlhbi12YXJpb3VzLWNvbXBsZW1lbnRzLXBsdWdpbi80LiUyME9wdGlvbnMvNC4xLiUyME1haW4vJUUyJTlBJTk5JUVGJUI4JThGSW5zZXJ0JTIwc3BhY2UlMjBhZnRlciUyMGNvbXBsZXRpb24vKSAqL1xuICBpZ25vcmVTcGFjZUFmdGVyQ29tcGxldGlvbj86IGJvb2xlYW47XG4gIHdvcmRzOiB7XG4gICAgdmFsdWU6IHN0cmluZztcbiAgICBkZXNjcmlwdGlvbj86IHN0cmluZztcbiAgICBhbGlhc2VzPzogc3RyaW5nW107XG4gICAgLyoqIElmIHNldCwgdXNlIHRoaXMgdmFsdWUgZm9yIHNlYXJjaGluZyBhbmQgcmVuZGVyaW5nIGluc3RlYWQgb2YgYHZhbHVlYCAqL1xuICAgIGRpc3BsYXllZD86IHN0cmluZztcbiAgfVtdO1xufTtcblxuZnVuY3Rpb24gZXNjYXBlKHZhbHVlOiBzdHJpbmcpOiBzdHJpbmcge1xuICAvLyBUaGlzIHRyaWNreSBsb2dpY3MgZm9yIFNhZmFyaVxuICAvLyBodHRwczovL2dpdGh1Yi5jb20vdGFkYXNoaS1haWthd2Evb2JzaWRpYW4tdmFyaW91cy1jb21wbGVtZW50cy1wbHVnaW4vaXNzdWVzLzU2XG4gIHJldHVybiB2YWx1ZVxuICAgIC5yZXBsYWNlKC9cXFxcL2csIFwiX19WYXJpb3VzQ29tcGxlbWVudHNFc2NhcGVfX1wiKVxuICAgIC5yZXBsYWNlKC9cXG4vZywgXCJcXFxcblwiKVxuICAgIC5yZXBsYWNlKC9cXHQvZywgXCJcXFxcdFwiKVxuICAgIC5yZXBsYWNlKC9fX1ZhcmlvdXNDb21wbGVtZW50c0VzY2FwZV9fL2csIFwiXFxcXFxcXFxcIik7XG59XG5cbmZ1bmN0aW9uIHVuZXNjYXBlKHZhbHVlOiBzdHJpbmcpOiBzdHJpbmcge1xuICAvLyBUaGlzIHRyaWNreSBsb2dpY3MgZm9yIFNhZmFyaVxuICAvLyBodHRwczovL2dpdGh1Yi5jb20vdGFkYXNoaS1haWthd2Evb2JzaWRpYW4tdmFyaW91cy1jb21wbGVtZW50cy1wbHVnaW4vaXNzdWVzLzU2XG4gIHJldHVybiB2YWx1ZVxuICAgIC5yZXBsYWNlKC9cXFxcXFxcXC9nLCBcIl9fVmFyaW91c0NvbXBsZW1lbnRzRXNjYXBlX19cIilcbiAgICAucmVwbGFjZSgvXFxcXG4vZywgXCJcXG5cIilcbiAgICAucmVwbGFjZSgvXFxcXHQvZywgXCJcXHRcIilcbiAgICAucmVwbGFjZSgvX19WYXJpb3VzQ29tcGxlbWVudHNFc2NhcGVfXy9nLCBcIlxcXFxcIik7XG59XG5cbmZ1bmN0aW9uIGpzb25Ub1dvcmRzKFxuICBqc29uOiBKc29uRGljdGlvbmFyeSxcbiAgcGF0aDogc3RyaW5nLFxuICBzeXN0ZW1DYXJldFN5bWJvbD86IHN0cmluZ1xuKTogQ3VzdG9tRGljdGlvbmFyeVdvcmRbXSB7XG4gIHJldHVybiBqc29uLndvcmRzLm1hcCgoeCkgPT4gKHtcbiAgICB2YWx1ZTogeC5kaXNwbGF5ZWQgfHwgeC52YWx1ZSxcbiAgICBkZXNjcmlwdGlvbjogeC5kZXNjcmlwdGlvbixcbiAgICBhbGlhc2VzOiB4LmFsaWFzZXMsXG4gICAgdHlwZTogXCJjdXN0b21EaWN0aW9uYXJ5XCIsXG4gICAgY3JlYXRlZFBhdGg6IHBhdGgsXG4gICAgaW5zZXJ0ZWRUZXh0OiB4LmRpc3BsYXllZCA/IHgudmFsdWUgOiB1bmRlZmluZWQsXG4gICAgY2FyZXRTeW1ib2w6IGpzb24uY2FyZXRTeW1ib2wgPz8gc3lzdGVtQ2FyZXRTeW1ib2wsXG4gICAgaWdub3JlU3BhY2VBZnRlckNvbXBsZXRpb246IGpzb24uaWdub3JlU3BhY2VBZnRlckNvbXBsZXRpb24sXG4gIH0pKTtcbn1cblxuZnVuY3Rpb24gbGluZVRvV29yZChcbiAgbGluZTogc3RyaW5nLFxuICBkZWxpbWl0ZXI6IENvbHVtbkRlbGltaXRlcixcbiAgcGF0aDogc3RyaW5nLFxuICBkZWxpbWl0ZXJGb3JEaXNwbGF5Pzogc3RyaW5nLFxuICBkZWxpbWl0ZXJGb3JIaWRlPzogc3RyaW5nLFxuICBzeXN0ZW1DYXJldFN5bWJvbD86IHN0cmluZ1xuKTogQ3VzdG9tRGljdGlvbmFyeVdvcmQge1xuICBjb25zdCBbdiwgZGVzY3JpcHRpb24sIC4uLmFsaWFzZXNdID0gbGluZS5zcGxpdChkZWxpbWl0ZXIudmFsdWUpO1xuXG4gIGxldCB2YWx1ZSA9IHVuZXNjYXBlKHYpO1xuICBsZXQgaW5zZXJ0ZWRUZXh0OiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gIGxldCBkaXNwbGF5ZWRUZXh0ID0gdmFsdWU7XG5cbiAgaWYgKGRlbGltaXRlckZvckRpc3BsYXkgJiYgdmFsdWUuaW5jbHVkZXMoZGVsaW1pdGVyRm9yRGlzcGxheSkpIHtcbiAgICBbZGlzcGxheWVkVGV4dCwgaW5zZXJ0ZWRUZXh0XSA9IHZhbHVlLnNwbGl0KGRlbGltaXRlckZvckRpc3BsYXkpO1xuICB9XG4gIGlmIChkZWxpbWl0ZXJGb3JIaWRlICYmIHZhbHVlLmluY2x1ZGVzKGRlbGltaXRlckZvckhpZGUpKSB7XG4gICAgaW5zZXJ0ZWRUZXh0ID0gdmFsdWUucmVwbGFjZShkZWxpbWl0ZXJGb3JIaWRlLCBcIlwiKTtcbiAgICBkaXNwbGF5ZWRUZXh0ID0gYCR7dmFsdWUuc3BsaXQoZGVsaW1pdGVyRm9ySGlkZSlbMF19IC4uLmA7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHZhbHVlOiBkaXNwbGF5ZWRUZXh0LFxuICAgIGRlc2NyaXB0aW9uLFxuICAgIGFsaWFzZXMsXG4gICAgdHlwZTogXCJjdXN0b21EaWN0aW9uYXJ5XCIsXG4gICAgY3JlYXRlZFBhdGg6IHBhdGgsXG4gICAgaW5zZXJ0ZWRUZXh0LFxuICAgIGNhcmV0U3ltYm9sOiBzeXN0ZW1DYXJldFN5bWJvbCxcbiAgfTtcbn1cblxuZnVuY3Rpb24gd29yZFRvTGluZShcbiAgd29yZDogQ3VzdG9tRGljdGlvbmFyeVdvcmQsXG4gIGRlbGltaXRlcjogQ29sdW1uRGVsaW1pdGVyLFxuICBkaXZpZGVyRm9yRGlzcGxheTogc3RyaW5nIHwgbnVsbFxuKTogc3RyaW5nIHtcbiAgY29uc3QgdmFsdWUgPVxuICAgIHdvcmQuaW5zZXJ0ZWRUZXh0ICYmIGRpdmlkZXJGb3JEaXNwbGF5XG4gICAgICA/IGAke3dvcmQudmFsdWV9JHtkaXZpZGVyRm9yRGlzcGxheX0ke3dvcmQuaW5zZXJ0ZWRUZXh0fWBcbiAgICAgIDogd29yZC52YWx1ZTtcblxuICBjb25zdCBlc2NhcGVkVmFsdWUgPSBlc2NhcGUodmFsdWUpO1xuICBpZiAoIXdvcmQuZGVzY3JpcHRpb24gJiYgIXdvcmQuYWxpYXNlcykge1xuICAgIHJldHVybiBlc2NhcGVkVmFsdWU7XG4gIH1cbiAgaWYgKCF3b3JkLmFsaWFzZXMpIHtcbiAgICByZXR1cm4gW2VzY2FwZWRWYWx1ZSwgd29yZC5kZXNjcmlwdGlvbl0uam9pbihkZWxpbWl0ZXIudmFsdWUpO1xuICB9XG4gIHJldHVybiBbZXNjYXBlZFZhbHVlLCB3b3JkLmRlc2NyaXB0aW9uLCAuLi53b3JkLmFsaWFzZXNdLmpvaW4oXG4gICAgZGVsaW1pdGVyLnZhbHVlXG4gICk7XG59XG5cbmZ1bmN0aW9uIHN5bm9ueW1BbGlhc2VzKG5hbWU6IHN0cmluZyk6IHN0cmluZ1tdIHtcbiAgY29uc3QgbGVzc0Vtb2ppVmFsdWUgPSBleGNsdWRlRW1vamkobmFtZSk7XG4gIHJldHVybiBuYW1lID09PSBsZXNzRW1vamlWYWx1ZSA/IFtdIDogW2xlc3NFbW9qaVZhbHVlXTtcbn1cblxudHlwZSBPcHRpb24gPSB7XG4gIHJlZ2V4cDogc3RyaW5nO1xuICBkZWxpbWl0ZXJGb3JIaWRlPzogc3RyaW5nO1xuICBkZWxpbWl0ZXJGb3JEaXNwbGF5Pzogc3RyaW5nO1xuICBjYXJldFN5bWJvbD86IHN0cmluZztcbn07XG5cbmV4cG9ydCBjbGFzcyBDdXN0b21EaWN0aW9uYXJ5V29yZFByb3ZpZGVyIHtcbiAgcHJpdmF0ZSB3b3JkczogQ3VzdG9tRGljdGlvbmFyeVdvcmRbXSA9IFtdO1xuICB3b3JkQnlWYWx1ZTogeyBbdmFsdWU6IHN0cmluZ106IEN1c3RvbURpY3Rpb25hcnlXb3JkIH0gPSB7fTtcbiAgd29yZHNCeUZpcnN0TGV0dGVyOiBXb3Jkc0J5Rmlyc3RMZXR0ZXIgPSB7fTtcblxuICBwcml2YXRlIGFwcEhlbHBlcjogQXBwSGVscGVyO1xuICBwcml2YXRlIGZpbGVTeXN0ZW1BZGFwdGVyOiBGaWxlU3lzdGVtQWRhcHRlcjtcbiAgcHJpdmF0ZSBwYXRoczogc3RyaW5nW107XG4gIHByaXZhdGUgZGVsaW1pdGVyOiBDb2x1bW5EZWxpbWl0ZXI7XG4gIHByaXZhdGUgZGl2aWRlckZvckRpc3BsYXk6IHN0cmluZyB8IG51bGw7XG5cbiAgY29uc3RydWN0b3IoYXBwOiBBcHAsIGFwcEhlbHBlcjogQXBwSGVscGVyKSB7XG4gICAgdGhpcy5hcHBIZWxwZXIgPSBhcHBIZWxwZXI7XG4gICAgdGhpcy5maWxlU3lzdGVtQWRhcHRlciA9IGFwcC52YXVsdC5hZGFwdGVyIGFzIEZpbGVTeXN0ZW1BZGFwdGVyO1xuICB9XG5cbiAgZ2V0IGVkaXRhYmxlUGF0aHMoKTogc3RyaW5nW10ge1xuICAgIHJldHVybiB0aGlzLnBhdGhzLmZpbHRlcigoeCkgPT4gIWlzVVJMKHgpICYmICF4LmVuZHNXaXRoKFwiLmpzb25cIikpO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBsb2FkV29yZHMoXG4gICAgcGF0aDogc3RyaW5nLFxuICAgIG9wdGlvbjogT3B0aW9uXG4gICk6IFByb21pc2U8Q3VzdG9tRGljdGlvbmFyeVdvcmRbXT4ge1xuICAgIGNvbnN0IGNvbnRlbnRzID0gaXNVUkwocGF0aClcbiAgICAgID8gYXdhaXQgcmVxdWVzdCh7IHVybDogcGF0aCB9KVxuICAgICAgOiBhd2FpdCB0aGlzLmZpbGVTeXN0ZW1BZGFwdGVyLnJlYWQocGF0aCk7XG5cbiAgICBjb25zdCB3b3JkcyA9IHBhdGguZW5kc1dpdGgoXCIuanNvblwiKVxuICAgICAgPyBqc29uVG9Xb3JkcyhKU09OLnBhcnNlKGNvbnRlbnRzKSwgcGF0aCwgb3B0aW9uLmNhcmV0U3ltYm9sKVxuICAgICAgOiBjb250ZW50c1xuICAgICAgICAgIC5zcGxpdCgvXFxyXFxufFxcbi8pXG4gICAgICAgICAgLm1hcCgoeCkgPT4geC5yZXBsYWNlKC8lJS4qJSUvZywgXCJcIikpXG4gICAgICAgICAgLmZpbHRlcigoeCkgPT4geClcbiAgICAgICAgICAubWFwKCh4KSA9PlxuICAgICAgICAgICAgbGluZVRvV29yZChcbiAgICAgICAgICAgICAgeCxcbiAgICAgICAgICAgICAgdGhpcy5kZWxpbWl0ZXIsXG4gICAgICAgICAgICAgIHBhdGgsXG4gICAgICAgICAgICAgIG9wdGlvbi5kZWxpbWl0ZXJGb3JEaXNwbGF5LFxuICAgICAgICAgICAgICBvcHRpb24uZGVsaW1pdGVyRm9ySGlkZSxcbiAgICAgICAgICAgICAgb3B0aW9uLmNhcmV0U3ltYm9sXG4gICAgICAgICAgICApXG4gICAgICAgICAgKTtcblxuICAgIHJldHVybiB3b3Jkcy5maWx0ZXIoXG4gICAgICAoeCkgPT4gIW9wdGlvbi5yZWdleHAgfHwgeC52YWx1ZS5tYXRjaChuZXcgUmVnRXhwKG9wdGlvbi5yZWdleHApKVxuICAgICk7XG4gIH1cblxuICBhc3luYyByZWZyZXNoQ3VzdG9tV29yZHMob3B0aW9uOiBPcHRpb24pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0aGlzLmNsZWFyV29yZHMoKTtcblxuICAgIGZvciAoY29uc3QgcGF0aCBvZiB0aGlzLnBhdGhzKSB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCB3b3JkcyA9IGF3YWl0IHRoaXMubG9hZFdvcmRzKHBhdGgsIG9wdGlvbik7XG4gICAgICAgIHdvcmRzLmZvckVhY2goKHgpID0+IHRoaXMud29yZHMucHVzaCh4KSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIG5vaW5zcGVjdGlvbiBPYmplY3RBbGxvY2F0aW9uSWdub3JlZFxuICAgICAgICBuZXcgTm90aWNlKFxuICAgICAgICAgIGDimqAgRmFpbCB0byBsb2FkICR7cGF0aH0gLS0gVmFyaW91cyBDb21wbGVtZW50cyBQbHVnaW4gLS0gXFxuICR7ZX1gLFxuICAgICAgICAgIDBcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLndvcmRzLmZvckVhY2goKHgpID0+IHRoaXMuYWRkV29yZCh4KSk7XG4gIH1cblxuICBhc3luYyBhZGRXb3JkV2l0aERpY3Rpb25hcnkoXG4gICAgd29yZDogQ3VzdG9tRGljdGlvbmFyeVdvcmQsXG4gICAgZGljdGlvbmFyeVBhdGg6IHN0cmluZ1xuICApOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0aGlzLmFkZFdvcmQod29yZCk7XG4gICAgYXdhaXQgdGhpcy5maWxlU3lzdGVtQWRhcHRlci5hcHBlbmQoXG4gICAgICBkaWN0aW9uYXJ5UGF0aCxcbiAgICAgIFwiXFxuXCIgKyB3b3JkVG9MaW5lKHdvcmQsIHRoaXMuZGVsaW1pdGVyLCB0aGlzLmRpdmlkZXJGb3JEaXNwbGF5KVxuICAgICk7XG4gIH1cblxuICBwcml2YXRlIGFkZFdvcmQod29yZDogQ3VzdG9tRGljdGlvbmFyeVdvcmQpIHtcbiAgICAvLyBBZGQgYWxpYXNlcyBhcyBhIHN5bm9ueW1cbiAgICBjb25zdCB3b3JkV2l0aFN5bm9ueW0gPSB7XG4gICAgICAuLi53b3JkLFxuICAgICAgYWxpYXNlczogWy4uLih3b3JkLmFsaWFzZXMgPz8gW10pLCAuLi5zeW5vbnltQWxpYXNlcyh3b3JkLnZhbHVlKV0sXG4gICAgfTtcblxuICAgIHRoaXMud29yZEJ5VmFsdWVbd29yZFdpdGhTeW5vbnltLnZhbHVlXSA9IHdvcmRXaXRoU3lub255bTtcbiAgICBwdXNoV29yZChcbiAgICAgIHRoaXMud29yZHNCeUZpcnN0TGV0dGVyLFxuICAgICAgd29yZFdpdGhTeW5vbnltLnZhbHVlLmNoYXJBdCgwKSxcbiAgICAgIHdvcmRXaXRoU3lub255bVxuICAgICk7XG4gICAgd29yZFdpdGhTeW5vbnltLmFsaWFzZXM/LmZvckVhY2goKGEpID0+XG4gICAgICBwdXNoV29yZCh0aGlzLndvcmRzQnlGaXJzdExldHRlciwgYS5jaGFyQXQoMCksIHdvcmRXaXRoU3lub255bSlcbiAgICApO1xuICB9XG5cbiAgY2xlYXJXb3JkcygpOiB2b2lkIHtcbiAgICB0aGlzLndvcmRzID0gW107XG4gICAgdGhpcy53b3JkQnlWYWx1ZSA9IHt9O1xuICAgIHRoaXMud29yZHNCeUZpcnN0TGV0dGVyID0ge307XG4gIH1cblxuICBnZXQgd29yZENvdW50KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMud29yZHMubGVuZ3RoO1xuICB9XG5cbiAgc2V0U2V0dGluZ3MoXG4gICAgcGF0aHM6IHN0cmluZ1tdLFxuICAgIGRlbGltaXRlcjogQ29sdW1uRGVsaW1pdGVyLFxuICAgIGRpdmlkZXJGb3JEaXNwbGF5OiBzdHJpbmcgfCBudWxsXG4gICkge1xuICAgIHRoaXMucGF0aHMgPSBwYXRocztcbiAgICB0aGlzLmRlbGltaXRlciA9IGRlbGltaXRlcjtcbiAgICB0aGlzLmRpdmlkZXJGb3JEaXNwbGF5ID0gZGl2aWRlckZvckRpc3BsYXk7XG4gIH1cbn1cbiIsImltcG9ydCB0eXBlIHsgQXBwIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgeyBncm91cEJ5LCB1bmlxIH0gZnJvbSBcIi4uL3V0aWwvY29sbGVjdGlvbi1oZWxwZXJcIjtcbmltcG9ydCB0eXBlIHsgV29yZHNCeUZpcnN0TGV0dGVyIH0gZnJvbSBcIi4vc3VnZ2VzdGVyXCI7XG5pbXBvcnQgdHlwZSB7IFRva2VuaXplciB9IGZyb20gXCIuLi90b2tlbml6ZXIvdG9rZW5pemVyXCI7XG5pbXBvcnQgdHlwZSB7IEFwcEhlbHBlciB9IGZyb20gXCIuLi9hcHAtaGVscGVyXCI7XG5pbXBvcnQgeyBhbGxBbHBoYWJldHMsIHN0YXJ0c1NtYWxsTGV0dGVyT25seUZpcnN0IH0gZnJvbSBcIi4uL3V0aWwvc3RyaW5nc1wiO1xuaW1wb3J0IHR5cGUgeyBXb3JkIH0gZnJvbSBcIi4uL21vZGVsL1dvcmRcIjtcblxuZXhwb3J0IGNsYXNzIEN1cnJlbnRGaWxlV29yZFByb3ZpZGVyIHtcbiAgd29yZHNCeUZpcnN0TGV0dGVyOiBXb3Jkc0J5Rmlyc3RMZXR0ZXIgPSB7fTtcbiAgcHJpdmF0ZSB3b3JkczogV29yZFtdID0gW107XG4gIHByaXZhdGUgdG9rZW5pemVyOiBUb2tlbml6ZXI7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBhcHA6IEFwcCwgcHJpdmF0ZSBhcHBIZWxwZXI6IEFwcEhlbHBlcikge31cblxuICBhc3luYyByZWZyZXNoV29yZHMoXG4gICAgb25seUVuZ2xpc2g6IGJvb2xlYW4sXG4gICAgbWluTnVtYmVyT2ZDaGFyYWN0ZXJzOiBudW1iZXJcbiAgKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdGhpcy5jbGVhcldvcmRzKCk7XG5cbiAgICBjb25zdCBlZGl0b3IgPSB0aGlzLmFwcEhlbHBlci5nZXRDdXJyZW50RWRpdG9yKCk7XG4gICAgaWYgKCFlZGl0b3IpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBmaWxlID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKTtcbiAgICBpZiAoIWZpbGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBjdXJyZW50VG9rZW4gPSB0aGlzLnRva2VuaXplclxuICAgICAgLnRva2VuaXplKFxuICAgICAgICBlZGl0b3IuZ2V0TGluZShlZGl0b3IuZ2V0Q3Vyc29yKCkubGluZSkuc2xpY2UoMCwgZWRpdG9yLmdldEN1cnNvcigpLmNoKVxuICAgICAgKVxuICAgICAgLmxhc3QoKTtcblxuICAgIGNvbnN0IGNvbnRlbnQgPSBhd2FpdCB0aGlzLmFwcC52YXVsdC5jYWNoZWRSZWFkKGZpbGUpO1xuICAgIGNvbnN0IHRva2VucyA9IHRoaXMudG9rZW5pemVyXG4gICAgICAudG9rZW5pemUoY29udGVudClcbiAgICAgIC5maWx0ZXIoKHgpID0+IHtcbiAgICAgICAgaWYgKHgubGVuZ3RoIDwgbWluTnVtYmVyT2ZDaGFyYWN0ZXJzKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvbmx5RW5nbGlzaCA/IGFsbEFscGhhYmV0cyh4KSA6IHRydWU7XG4gICAgICB9KVxuICAgICAgLm1hcCgoeCkgPT4gKHN0YXJ0c1NtYWxsTGV0dGVyT25seUZpcnN0KHgpID8geC50b0xvd2VyQ2FzZSgpIDogeCkpO1xuICAgIHRoaXMud29yZHMgPSB1bmlxKHRva2VucylcbiAgICAgIC5maWx0ZXIoKHgpID0+IHggIT09IGN1cnJlbnRUb2tlbilcbiAgICAgIC5tYXAoKHgpID0+ICh7XG4gICAgICAgIHZhbHVlOiB4LFxuICAgICAgICB0eXBlOiBcImN1cnJlbnRGaWxlXCIsXG4gICAgICAgIGNyZWF0ZWRQYXRoOiBmaWxlLnBhdGgsXG4gICAgICB9KSk7XG4gICAgdGhpcy53b3Jkc0J5Rmlyc3RMZXR0ZXIgPSBncm91cEJ5KHRoaXMud29yZHMsICh4KSA9PiB4LnZhbHVlLmNoYXJBdCgwKSk7XG4gIH1cblxuICBjbGVhcldvcmRzKCk6IHZvaWQge1xuICAgIHRoaXMud29yZHMgPSBbXTtcbiAgICB0aGlzLndvcmRzQnlGaXJzdExldHRlciA9IHt9O1xuICB9XG5cbiAgZ2V0IHdvcmRDb3VudCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLndvcmRzLmxlbmd0aDtcbiAgfVxuXG4gIHNldFNldHRpbmdzKHRva2VuaXplcjogVG9rZW5pemVyKSB7XG4gICAgdGhpcy50b2tlbml6ZXIgPSB0b2tlbml6ZXI7XG4gIH1cbn1cbiIsImltcG9ydCB0eXBlIHsgQXBwIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgeyBwdXNoV29yZCwgdHlwZSBXb3Jkc0J5Rmlyc3RMZXR0ZXIgfSBmcm9tIFwiLi9zdWdnZXN0ZXJcIjtcbmltcG9ydCB0eXBlIHsgQXBwSGVscGVyIH0gZnJvbSBcIi4uL2FwcC1oZWxwZXJcIjtcbmltcG9ydCB7IGV4Y2x1ZGVFbW9qaSB9IGZyb20gXCIuLi91dGlsL3N0cmluZ3NcIjtcbmltcG9ydCB0eXBlIHsgSW50ZXJuYWxMaW5rV29yZCwgV29yZCB9IGZyb20gXCIuLi9tb2RlbC9Xb3JkXCI7XG5cbmV4cG9ydCBjbGFzcyBJbnRlcm5hbExpbmtXb3JkUHJvdmlkZXIge1xuICBwcml2YXRlIHdvcmRzOiBXb3JkW10gPSBbXTtcbiAgd29yZHNCeUZpcnN0TGV0dGVyOiBXb3Jkc0J5Rmlyc3RMZXR0ZXIgPSB7fTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGFwcDogQXBwLCBwcml2YXRlIGFwcEhlbHBlcjogQXBwSGVscGVyKSB7fVxuXG4gIHJlZnJlc2hXb3JkcyhcbiAgICB3b3JkQXNJbnRlcm5hbExpbmtBbGlhczogYm9vbGVhbixcbiAgICBleGNsdWRlUGF0aFByZWZpeFBhdHRlcm5zOiBzdHJpbmdbXVxuICApOiB2b2lkIHtcbiAgICB0aGlzLmNsZWFyV29yZHMoKTtcblxuICAgIGNvbnN0IHN5bm9ueW1BbGlhc2VzID0gKG5hbWU6IHN0cmluZyk6IHN0cmluZ1tdID0+IHtcbiAgICAgIGNvbnN0IGxlc3NFbW9qaVZhbHVlID0gZXhjbHVkZUVtb2ppKG5hbWUpO1xuICAgICAgcmV0dXJuIG5hbWUgPT09IGxlc3NFbW9qaVZhbHVlID8gW10gOiBbbGVzc0Vtb2ppVmFsdWVdO1xuICAgIH07XG5cbiAgICBjb25zdCByZXNvbHZlZEludGVybmFsTGlua1dvcmRzOiBJbnRlcm5hbExpbmtXb3JkW10gPSB0aGlzLmFwcC52YXVsdFxuICAgICAgLmdldE1hcmtkb3duRmlsZXMoKVxuICAgICAgLmZpbHRlcigoZikgPT5cbiAgICAgICAgZXhjbHVkZVBhdGhQcmVmaXhQYXR0ZXJucy5ldmVyeSgoeCkgPT4gIWYucGF0aC5zdGFydHNXaXRoKHgpKVxuICAgICAgKVxuICAgICAgLmZsYXRNYXAoKHgpID0+IHtcbiAgICAgICAgY29uc3QgYWxpYXNlcyA9IHRoaXMuYXBwSGVscGVyLmdldEFsaWFzZXMoeCk7XG5cbiAgICAgICAgaWYgKHdvcmRBc0ludGVybmFsTGlua0FsaWFzKSB7XG4gICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgdmFsdWU6IHguYmFzZW5hbWUsXG4gICAgICAgICAgICAgIHR5cGU6IFwiaW50ZXJuYWxMaW5rXCIsXG4gICAgICAgICAgICAgIGNyZWF0ZWRQYXRoOiB4LnBhdGgsXG4gICAgICAgICAgICAgIGFsaWFzZXM6IHN5bm9ueW1BbGlhc2VzKHguYmFzZW5hbWUpLFxuICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogeC5wYXRoLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC4uLmFsaWFzZXMubWFwKChhKSA9PiAoe1xuICAgICAgICAgICAgICB2YWx1ZTogYSxcbiAgICAgICAgICAgICAgdHlwZTogXCJpbnRlcm5hbExpbmtcIixcbiAgICAgICAgICAgICAgY3JlYXRlZFBhdGg6IHgucGF0aCxcbiAgICAgICAgICAgICAgYWxpYXNlczogc3lub255bUFsaWFzZXMoYSksXG4gICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiB4LnBhdGgsXG4gICAgICAgICAgICAgIGFsaWFzTWV0YToge1xuICAgICAgICAgICAgICAgIG9yaWdpbjogeC5iYXNlbmFtZSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0pKSxcbiAgICAgICAgICBdIGFzIEludGVybmFsTGlua1dvcmRbXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICB2YWx1ZTogeC5iYXNlbmFtZSxcbiAgICAgICAgICAgICAgdHlwZTogXCJpbnRlcm5hbExpbmtcIixcbiAgICAgICAgICAgICAgY3JlYXRlZFBhdGg6IHgucGF0aCxcbiAgICAgICAgICAgICAgYWxpYXNlczogW1xuICAgICAgICAgICAgICAgIC4uLnN5bm9ueW1BbGlhc2VzKHguYmFzZW5hbWUpLFxuICAgICAgICAgICAgICAgIC4uLmFsaWFzZXMsXG4gICAgICAgICAgICAgICAgLi4uYWxpYXNlcy5mbGF0TWFwKHN5bm9ueW1BbGlhc2VzKSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHgucGF0aCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSBhcyBJbnRlcm5hbExpbmtXb3JkW107XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgY29uc3QgdW5yZXNvbHZlZEludGVybmFsTGlua1dvcmRzOiBJbnRlcm5hbExpbmtXb3JkW10gPSB0aGlzLmFwcEhlbHBlclxuICAgICAgLnNlYXJjaFBoYW50b21MaW5rcygpXG4gICAgICAubWFwKCh7IHBhdGgsIGxpbmsgfSkgPT4ge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHZhbHVlOiBsaW5rLFxuICAgICAgICAgIHR5cGU6IFwiaW50ZXJuYWxMaW5rXCIsXG4gICAgICAgICAgY3JlYXRlZFBhdGg6IHBhdGgsXG4gICAgICAgICAgYWxpYXNlczogc3lub255bUFsaWFzZXMobGluayksXG4gICAgICAgICAgZGVzY3JpcHRpb246IGBBcHBlYXJlZCBpbiAtPiAke3BhdGh9YCxcbiAgICAgICAgICBwaGFudG9tOiB0cnVlLFxuICAgICAgICB9O1xuICAgICAgfSk7XG5cbiAgICB0aGlzLndvcmRzID0gWy4uLnJlc29sdmVkSW50ZXJuYWxMaW5rV29yZHMsIC4uLnVucmVzb2x2ZWRJbnRlcm5hbExpbmtXb3Jkc107XG4gICAgZm9yIChjb25zdCB3b3JkIG9mIHRoaXMud29yZHMpIHtcbiAgICAgIHB1c2hXb3JkKHRoaXMud29yZHNCeUZpcnN0TGV0dGVyLCB3b3JkLnZhbHVlLmNoYXJBdCgwKSwgd29yZCk7XG4gICAgICB3b3JkLmFsaWFzZXM/LmZvckVhY2goKGEpID0+XG4gICAgICAgIHB1c2hXb3JkKHRoaXMud29yZHNCeUZpcnN0TGV0dGVyLCBhLmNoYXJBdCgwKSwgd29yZClcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgY2xlYXJXb3JkcygpOiB2b2lkIHtcbiAgICB0aGlzLndvcmRzID0gW107XG4gICAgdGhpcy53b3Jkc0J5Rmlyc3RMZXR0ZXIgPSB7fTtcbiAgfVxuXG4gIGdldCB3b3JkQ291bnQoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy53b3Jkcy5sZW5ndGg7XG4gIH1cbn1cbiIsImltcG9ydCB0eXBlIHsgSW5kZXhlZFdvcmRzIH0gZnJvbSBcIi4uL3VpL0F1dG9Db21wbGV0ZVN1Z2dlc3RcIjtcbmltcG9ydCB7IHN1Z2dlc3RXb3Jkcywgc3VnZ2VzdFdvcmRzQnlQYXJ0aWFsTWF0Y2ggfSBmcm9tIFwiLi9zdWdnZXN0ZXJcIjtcbmltcG9ydCB0eXBlIHsgV29yZCB9IGZyb20gXCIuLi9tb2RlbC9Xb3JkXCI7XG5pbXBvcnQgdHlwZSB7IFNlbGVjdGlvbkhpc3RvcnlTdG9yYWdlIH0gZnJvbSBcIi4uL3N0b3JhZ2UvU2VsZWN0aW9uSGlzdG9yeVN0b3JhZ2VcIjtcblxudHlwZSBOYW1lID0gXCJwcmVmaXhcIiB8IFwicGFydGlhbFwiO1xuXG50eXBlIEhhbmRsZXIgPSAoXG4gIGluZGV4ZWRXb3JkczogSW5kZXhlZFdvcmRzLFxuICBxdWVyeTogc3RyaW5nLFxuICBtYXg6IG51bWJlcixcbiAgZnJvbnRNYXR0ZXI6IHN0cmluZyB8IG51bGwsXG4gIHNlbGVjdGlvbkhpc3RvcnlTdG9yYWdlPzogU2VsZWN0aW9uSGlzdG9yeVN0b3JhZ2VcbikgPT4gV29yZFtdO1xuXG5leHBvcnQgY2xhc3MgTWF0Y2hTdHJhdGVneSB7XG4gIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IF92YWx1ZXM6IE1hdGNoU3RyYXRlZ3lbXSA9IFtdO1xuXG4gIHN0YXRpYyByZWFkb25seSBQUkVGSVggPSBuZXcgTWF0Y2hTdHJhdGVneShcInByZWZpeFwiLCBzdWdnZXN0V29yZHMpO1xuICBzdGF0aWMgcmVhZG9ubHkgUEFSVElBTCA9IG5ldyBNYXRjaFN0cmF0ZWd5KFxuICAgIFwicGFydGlhbFwiLFxuICAgIHN1Z2dlc3RXb3Jkc0J5UGFydGlhbE1hdGNoXG4gICk7XG5cbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcihyZWFkb25seSBuYW1lOiBOYW1lLCByZWFkb25seSBoYW5kbGVyOiBIYW5kbGVyKSB7XG4gICAgTWF0Y2hTdHJhdGVneS5fdmFsdWVzLnB1c2godGhpcyk7XG4gIH1cblxuICBzdGF0aWMgZnJvbU5hbWUobmFtZTogc3RyaW5nKTogTWF0Y2hTdHJhdGVneSB7XG4gICAgcmV0dXJuIE1hdGNoU3RyYXRlZ3kuX3ZhbHVlcy5maW5kKCh4KSA9PiB4Lm5hbWUgPT09IG5hbWUpITtcbiAgfVxuXG4gIHN0YXRpYyB2YWx1ZXMoKTogTWF0Y2hTdHJhdGVneVtdIHtcbiAgICByZXR1cm4gTWF0Y2hTdHJhdGVneS5fdmFsdWVzO1xuICB9XG59XG4iLCJpbXBvcnQgdHlwZSB7IE1vZGlmaWVyIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5cbnR5cGUgTmFtZSA9XG4gIHwgXCJOb25lXCJcbiAgfCBcIlRhYiwgU2hpZnQrVGFiXCJcbiAgfCBcIkN0cmwvQ21kK04sIEN0cmwvQ21kK1BcIlxuICB8IFwiQ3RybC9DbWQrSiwgQ3RybC9DbWQrS1wiO1xuaW50ZXJmYWNlIEtleUJpbmQge1xuICBtb2RpZmllcnM6IE1vZGlmaWVyW107XG4gIGtleTogc3RyaW5nIHwgbnVsbDtcbn1cblxuZXhwb3J0IGNsYXNzIEN5Y2xlVGhyb3VnaFN1Z2dlc3Rpb25zS2V5cyB7XG4gIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IF92YWx1ZXM6IEN5Y2xlVGhyb3VnaFN1Z2dlc3Rpb25zS2V5c1tdID0gW107XG5cbiAgc3RhdGljIHJlYWRvbmx5IE5PTkUgPSBuZXcgQ3ljbGVUaHJvdWdoU3VnZ2VzdGlvbnNLZXlzKFxuICAgIFwiTm9uZVwiLFxuICAgIHsgbW9kaWZpZXJzOiBbXSwga2V5OiBudWxsIH0sXG4gICAgeyBtb2RpZmllcnM6IFtdLCBrZXk6IG51bGwgfVxuICApO1xuICBzdGF0aWMgcmVhZG9ubHkgVEFCID0gbmV3IEN5Y2xlVGhyb3VnaFN1Z2dlc3Rpb25zS2V5cyhcbiAgICBcIlRhYiwgU2hpZnQrVGFiXCIsXG4gICAgeyBtb2RpZmllcnM6IFtdLCBrZXk6IFwiVGFiXCIgfSxcbiAgICB7IG1vZGlmaWVyczogW1wiU2hpZnRcIl0sIGtleTogXCJUYWJcIiB9XG4gICk7XG4gIHN0YXRpYyByZWFkb25seSBFTUFDUyA9IG5ldyBDeWNsZVRocm91Z2hTdWdnZXN0aW9uc0tleXMoXG4gICAgXCJDdHJsL0NtZCtOLCBDdHJsL0NtZCtQXCIsXG4gICAgeyBtb2RpZmllcnM6IFtcIk1vZFwiXSwga2V5OiBcIk5cIiB9LFxuICAgIHsgbW9kaWZpZXJzOiBbXCJNb2RcIl0sIGtleTogXCJQXCIgfVxuICApO1xuICBzdGF0aWMgcmVhZG9ubHkgVklNID0gbmV3IEN5Y2xlVGhyb3VnaFN1Z2dlc3Rpb25zS2V5cyhcbiAgICBcIkN0cmwvQ21kK0osIEN0cmwvQ21kK0tcIixcbiAgICB7IG1vZGlmaWVyczogW1wiTW9kXCJdLCBrZXk6IFwiSlwiIH0sXG4gICAgeyBtb2RpZmllcnM6IFtcIk1vZFwiXSwga2V5OiBcIktcIiB9XG4gICk7XG5cbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcihcbiAgICByZWFkb25seSBuYW1lOiBOYW1lLFxuICAgIHJlYWRvbmx5IG5leHRLZXk6IEtleUJpbmQsXG4gICAgcmVhZG9ubHkgcHJldmlvdXNLZXk6IEtleUJpbmRcbiAgKSB7XG4gICAgQ3ljbGVUaHJvdWdoU3VnZ2VzdGlvbnNLZXlzLl92YWx1ZXMucHVzaCh0aGlzKTtcbiAgfVxuXG4gIHN0YXRpYyBmcm9tTmFtZShuYW1lOiBzdHJpbmcpOiBDeWNsZVRocm91Z2hTdWdnZXN0aW9uc0tleXMge1xuICAgIHJldHVybiBDeWNsZVRocm91Z2hTdWdnZXN0aW9uc0tleXMuX3ZhbHVlcy5maW5kKCh4KSA9PiB4Lm5hbWUgPT09IG5hbWUpITtcbiAgfVxuXG4gIHN0YXRpYyB2YWx1ZXMoKTogQ3ljbGVUaHJvdWdoU3VnZ2VzdGlvbnNLZXlzW10ge1xuICAgIHJldHVybiBDeWNsZVRocm91Z2hTdWdnZXN0aW9uc0tleXMuX3ZhbHVlcztcbiAgfVxufVxuIiwidHlwZSBEZWxpbWl0ZXIgPSBcIlxcdFwiIHwgXCIsXCIgfCBcInxcIjtcblxuZXhwb3J0IGNsYXNzIENvbHVtbkRlbGltaXRlciB7XG4gIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IF92YWx1ZXM6IENvbHVtbkRlbGltaXRlcltdID0gW107XG5cbiAgc3RhdGljIHJlYWRvbmx5IFRBQiA9IG5ldyBDb2x1bW5EZWxpbWl0ZXIoXCJUYWJcIiwgXCJcXHRcIik7XG4gIHN0YXRpYyByZWFkb25seSBDT01NQSA9IG5ldyBDb2x1bW5EZWxpbWl0ZXIoXCJDb21tYVwiLCBcIixcIik7XG4gIHN0YXRpYyByZWFkb25seSBQSVBFID0gbmV3IENvbHVtbkRlbGltaXRlcihcIlBpcGVcIiwgXCJ8XCIpO1xuXG4gIHByaXZhdGUgY29uc3RydWN0b3IocmVhZG9ubHkgbmFtZTogc3RyaW5nLCByZWFkb25seSB2YWx1ZTogRGVsaW1pdGVyKSB7XG4gICAgQ29sdW1uRGVsaW1pdGVyLl92YWx1ZXMucHVzaCh0aGlzKTtcbiAgfVxuXG4gIHN0YXRpYyBmcm9tTmFtZShuYW1lOiBzdHJpbmcpOiBDb2x1bW5EZWxpbWl0ZXIge1xuICAgIHJldHVybiBDb2x1bW5EZWxpbWl0ZXIuX3ZhbHVlcy5maW5kKCh4KSA9PiB4Lm5hbWUgPT09IG5hbWUpITtcbiAgfVxuXG4gIHN0YXRpYyB2YWx1ZXMoKTogQ29sdW1uRGVsaW1pdGVyW10ge1xuICAgIHJldHVybiBDb2x1bW5EZWxpbWl0ZXIuX3ZhbHVlcztcbiAgfVxufVxuIiwiaW1wb3J0IHR5cGUgeyBNb2RpZmllciB9IGZyb20gXCJvYnNpZGlhblwiO1xuXG50eXBlIE5hbWUgPVxuICB8IFwiRW50ZXJcIlxuICB8IFwiVGFiXCJcbiAgfCBcIkN0cmwvQ21kK0VudGVyXCJcbiAgfCBcIkFsdCtFbnRlclwiXG4gIHwgXCJTaGlmdCtFbnRlclwiXG4gIHwgXCJTcGFjZVwiXG4gIHwgXCJTaGlmdCtTcGFjZVwiXG4gIHwgXCJCYWNrcXVvdGVcIlxuICB8IFwiTm9uZVwiO1xuaW50ZXJmYWNlIEtleUJpbmQge1xuICBtb2RpZmllcnM6IE1vZGlmaWVyW107XG4gIGtleTogc3RyaW5nIHwgbnVsbDtcbn1cblxuZXhwb3J0IGNsYXNzIFNlbGVjdFN1Z2dlc3Rpb25LZXkge1xuICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBfdmFsdWVzOiBTZWxlY3RTdWdnZXN0aW9uS2V5W10gPSBbXTtcblxuICBzdGF0aWMgcmVhZG9ubHkgRU5URVIgPSBuZXcgU2VsZWN0U3VnZ2VzdGlvbktleShcIkVudGVyXCIsIHtcbiAgICBtb2RpZmllcnM6IFtdLFxuICAgIGtleTogXCJFbnRlclwiLFxuICB9KTtcbiAgc3RhdGljIHJlYWRvbmx5IFRBQiA9IG5ldyBTZWxlY3RTdWdnZXN0aW9uS2V5KFwiVGFiXCIsIHtcbiAgICBtb2RpZmllcnM6IFtdLFxuICAgIGtleTogXCJUYWJcIixcbiAgfSk7XG4gIHN0YXRpYyByZWFkb25seSBNT0RfRU5URVIgPSBuZXcgU2VsZWN0U3VnZ2VzdGlvbktleShcIkN0cmwvQ21kK0VudGVyXCIsIHtcbiAgICBtb2RpZmllcnM6IFtcIk1vZFwiXSxcbiAgICBrZXk6IFwiRW50ZXJcIixcbiAgfSk7XG4gIHN0YXRpYyByZWFkb25seSBBTFRfRU5URVIgPSBuZXcgU2VsZWN0U3VnZ2VzdGlvbktleShcIkFsdCtFbnRlclwiLCB7XG4gICAgbW9kaWZpZXJzOiBbXCJBbHRcIl0sXG4gICAga2V5OiBcIkVudGVyXCIsXG4gIH0pO1xuICBzdGF0aWMgcmVhZG9ubHkgU0hJRlRfRU5URVIgPSBuZXcgU2VsZWN0U3VnZ2VzdGlvbktleShcIlNoaWZ0K0VudGVyXCIsIHtcbiAgICBtb2RpZmllcnM6IFtcIlNoaWZ0XCJdLFxuICAgIGtleTogXCJFbnRlclwiLFxuICB9KTtcbiAgc3RhdGljIHJlYWRvbmx5IFNQQUNFID0gbmV3IFNlbGVjdFN1Z2dlc3Rpb25LZXkoXCJTcGFjZVwiLCB7XG4gICAgbW9kaWZpZXJzOiBbXSxcbiAgICBrZXk6IFwiIFwiLFxuICB9KTtcbiAgc3RhdGljIHJlYWRvbmx5IFNISUZUX1NQQUNFID0gbmV3IFNlbGVjdFN1Z2dlc3Rpb25LZXkoXCJTaGlmdCtTcGFjZVwiLCB7XG4gICAgbW9kaWZpZXJzOiBbXCJTaGlmdFwiXSxcbiAgICBrZXk6IFwiIFwiLFxuICB9KTtcbiAgc3RhdGljIHJlYWRvbmx5IEJBQ0tRVU9URSA9IG5ldyBTZWxlY3RTdWdnZXN0aW9uS2V5KFwiQmFja3F1b3RlXCIsIHtcbiAgICBtb2RpZmllcnM6IFtdLFxuICAgIGtleTogXCJgXCIsXG4gIH0pO1xuICBzdGF0aWMgcmVhZG9ubHkgTm9uZSA9IG5ldyBTZWxlY3RTdWdnZXN0aW9uS2V5KFwiTm9uZVwiLCB7XG4gICAgbW9kaWZpZXJzOiBbXSxcbiAgICBrZXk6IFwiXCIsXG4gIH0pO1xuXG4gIHByaXZhdGUgY29uc3RydWN0b3IocmVhZG9ubHkgbmFtZTogTmFtZSwgcmVhZG9ubHkga2V5QmluZDogS2V5QmluZCkge1xuICAgIFNlbGVjdFN1Z2dlc3Rpb25LZXkuX3ZhbHVlcy5wdXNoKHRoaXMpO1xuICB9XG5cbiAgc3RhdGljIGZyb21OYW1lKG5hbWU6IHN0cmluZyk6IFNlbGVjdFN1Z2dlc3Rpb25LZXkge1xuICAgIHJldHVybiBTZWxlY3RTdWdnZXN0aW9uS2V5Ll92YWx1ZXMuZmluZCgoeCkgPT4geC5uYW1lID09PSBuYW1lKSE7XG4gIH1cblxuICBzdGF0aWMgdmFsdWVzKCk6IFNlbGVjdFN1Z2dlc3Rpb25LZXlbXSB7XG4gICAgcmV0dXJuIFNlbGVjdFN1Z2dlc3Rpb25LZXkuX3ZhbHVlcztcbiAgfVxufVxuIiwiaW1wb3J0IHR5cGUgeyBBcHAgfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB7IGdyb3VwQnkgfSBmcm9tIFwiLi4vdXRpbC9jb2xsZWN0aW9uLWhlbHBlclwiO1xuaW1wb3J0IHR5cGUgeyBXb3Jkc0J5Rmlyc3RMZXR0ZXIgfSBmcm9tIFwiLi9zdWdnZXN0ZXJcIjtcbmltcG9ydCB0eXBlIHsgVG9rZW5pemVyIH0gZnJvbSBcIi4uL3Rva2VuaXplci90b2tlbml6ZXJcIjtcbmltcG9ydCB0eXBlIHsgQXBwSGVscGVyIH0gZnJvbSBcIi4uL2FwcC1oZWxwZXJcIjtcbmltcG9ydCB0eXBlIHsgV29yZCB9IGZyb20gXCIuLi9tb2RlbC9Xb3JkXCI7XG5pbXBvcnQgeyBkaXJuYW1lIH0gZnJvbSBcIi4uL3V0aWwvcGF0aFwiO1xuaW1wb3J0IHsgc3RhcnRzU21hbGxMZXR0ZXJPbmx5Rmlyc3QgfSBmcm9tIFwiLi4vdXRpbC9zdHJpbmdzXCI7XG5cbmV4cG9ydCBjbGFzcyBDdXJyZW50VmF1bHRXb3JkUHJvdmlkZXIge1xuICB3b3Jkc0J5Rmlyc3RMZXR0ZXI6IFdvcmRzQnlGaXJzdExldHRlciA9IHt9O1xuICBwcml2YXRlIHdvcmRzOiBXb3JkW10gPSBbXTtcbiAgcHJpdmF0ZSB0b2tlbml6ZXI6IFRva2VuaXplcjtcbiAgcHJpdmF0ZSBpbmNsdWRlUHJlZml4UGF0dGVybnM6IHN0cmluZ1tdO1xuICBwcml2YXRlIGV4Y2x1ZGVQcmVmaXhQYXR0ZXJuczogc3RyaW5nW107XG4gIHByaXZhdGUgb25seVVuZGVyQ3VycmVudERpcmVjdG9yeTogYm9vbGVhbjtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGFwcDogQXBwLCBwcml2YXRlIGFwcEhlbHBlcjogQXBwSGVscGVyKSB7fVxuXG4gIGFzeW5jIHJlZnJlc2hXb3JkcyhtaW5OdW1iZXJPZkNoYXJhY3RlcnM6IG51bWJlcik6IFByb21pc2U8dm9pZD4ge1xuICAgIHRoaXMuY2xlYXJXb3JkcygpO1xuXG4gICAgY29uc3QgY3VycmVudERpcm5hbWUgPSB0aGlzLmFwcEhlbHBlci5nZXRDdXJyZW50RGlybmFtZSgpO1xuXG4gICAgY29uc3QgbWFya2Rvd25GaWxlUGF0aHMgPSB0aGlzLmFwcC52YXVsdFxuICAgICAgLmdldE1hcmtkb3duRmlsZXMoKVxuICAgICAgLm1hcCgoeCkgPT4geC5wYXRoKVxuICAgICAgLmZpbHRlcigocCkgPT4gdGhpcy5pbmNsdWRlUHJlZml4UGF0dGVybnMuZXZlcnkoKHgpID0+IHAuc3RhcnRzV2l0aCh4KSkpXG4gICAgICAuZmlsdGVyKChwKSA9PiB0aGlzLmV4Y2x1ZGVQcmVmaXhQYXR0ZXJucy5ldmVyeSgoeCkgPT4gIXAuc3RhcnRzV2l0aCh4KSkpXG4gICAgICAuZmlsdGVyKFxuICAgICAgICAocCkgPT4gIXRoaXMub25seVVuZGVyQ3VycmVudERpcmVjdG9yeSB8fCBkaXJuYW1lKHApID09PSBjdXJyZW50RGlybmFtZVxuICAgICAgKTtcblxuICAgIGxldCB3b3JkQnlWYWx1ZTogeyBbdmFsdWU6IHN0cmluZ106IFdvcmQgfSA9IHt9O1xuICAgIGZvciAoY29uc3QgcGF0aCBvZiBtYXJrZG93bkZpbGVQYXRocykge1xuICAgICAgY29uc3QgY29udGVudCA9IGF3YWl0IHRoaXMuYXBwLnZhdWx0LmFkYXB0ZXIucmVhZChwYXRoKTtcblxuICAgICAgY29uc3QgdG9rZW5zID0gdGhpcy50b2tlbml6ZXJcbiAgICAgICAgLnRva2VuaXplKGNvbnRlbnQpXG4gICAgICAgIC5maWx0ZXIoKHgpID0+IHgubGVuZ3RoID49IG1pbk51bWJlck9mQ2hhcmFjdGVycylcbiAgICAgICAgLm1hcCgoeCkgPT4gKHN0YXJ0c1NtYWxsTGV0dGVyT25seUZpcnN0KHgpID8geC50b0xvd2VyQ2FzZSgpIDogeCkpO1xuICAgICAgZm9yIChjb25zdCB0b2tlbiBvZiB0b2tlbnMpIHtcbiAgICAgICAgd29yZEJ5VmFsdWVbdG9rZW5dID0ge1xuICAgICAgICAgIHZhbHVlOiB0b2tlbixcbiAgICAgICAgICB0eXBlOiBcImN1cnJlbnRWYXVsdFwiLFxuICAgICAgICAgIGNyZWF0ZWRQYXRoOiBwYXRoLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiBwYXRoLFxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMud29yZHMgPSBPYmplY3QudmFsdWVzKHdvcmRCeVZhbHVlKTtcbiAgICB0aGlzLndvcmRzQnlGaXJzdExldHRlciA9IGdyb3VwQnkodGhpcy53b3JkcywgKHgpID0+IHgudmFsdWUuY2hhckF0KDApKTtcbiAgfVxuXG4gIGNsZWFyV29yZHMoKTogdm9pZCB7XG4gICAgdGhpcy53b3JkcyA9IFtdO1xuICAgIHRoaXMud29yZHNCeUZpcnN0TGV0dGVyID0ge307XG4gIH1cblxuICBnZXQgd29yZENvdW50KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMud29yZHMubGVuZ3RoO1xuICB9XG5cbiAgc2V0U2V0dGluZ3MoXG4gICAgdG9rZW5pemVyOiBUb2tlbml6ZXIsXG4gICAgaW5jbHVkZVByZWZpeFBhdHRlcm5zOiBzdHJpbmdbXSxcbiAgICBleGNsdWRlUHJlZml4UGF0dGVybnM6IHN0cmluZ1tdLFxuICAgIG9ubHlVbmRlckN1cnJlbnREaXJlY3Rvcnk6IGJvb2xlYW5cbiAgKSB7XG4gICAgdGhpcy50b2tlbml6ZXIgPSB0b2tlbml6ZXI7XG4gICAgdGhpcy5pbmNsdWRlUHJlZml4UGF0dGVybnMgPSBpbmNsdWRlUHJlZml4UGF0dGVybnM7XG4gICAgdGhpcy5leGNsdWRlUHJlZml4UGF0dGVybnMgPSBleGNsdWRlUHJlZml4UGF0dGVybnM7XG4gICAgdGhpcy5vbmx5VW5kZXJDdXJyZW50RGlyZWN0b3J5ID0gb25seVVuZGVyQ3VycmVudERpcmVjdG9yeTtcbiAgfVxufVxuIiwiaW1wb3J0IHR5cGUgeyBNb2RpZmllciB9IGZyb20gXCJvYnNpZGlhblwiO1xuXG50eXBlIE5hbWUgPSBcIk5vbmVcIiB8IFwiQ3RybC9DbWQrRW50ZXJcIiB8IFwiQWx0K0VudGVyXCIgfCBcIlNoaWZ0K0VudGVyXCI7XG5pbnRlcmZhY2UgS2V5QmluZCB7XG4gIG1vZGlmaWVyczogTW9kaWZpZXJbXTtcbiAga2V5OiBzdHJpbmcgfCBudWxsO1xufVxuXG5leHBvcnQgY2xhc3MgT3BlblNvdXJjZUZpbGVLZXlzIHtcbiAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgX3ZhbHVlczogT3BlblNvdXJjZUZpbGVLZXlzW10gPSBbXTtcblxuICBzdGF0aWMgcmVhZG9ubHkgTk9ORSA9IG5ldyBPcGVuU291cmNlRmlsZUtleXMoXCJOb25lXCIsIHtcbiAgICBtb2RpZmllcnM6IFtdLFxuICAgIGtleTogbnVsbCxcbiAgfSk7XG4gIHN0YXRpYyByZWFkb25seSBNT0RfRU5URVIgPSBuZXcgT3BlblNvdXJjZUZpbGVLZXlzKFwiQ3RybC9DbWQrRW50ZXJcIiwge1xuICAgIG1vZGlmaWVyczogW1wiTW9kXCJdLFxuICAgIGtleTogXCJFbnRlclwiLFxuICB9KTtcbiAgc3RhdGljIHJlYWRvbmx5IEFMVF9FTlRFUiA9IG5ldyBPcGVuU291cmNlRmlsZUtleXMoXCJBbHQrRW50ZXJcIiwge1xuICAgIG1vZGlmaWVyczogW1wiQWx0XCJdLFxuICAgIGtleTogXCJFbnRlclwiLFxuICB9KTtcbiAgc3RhdGljIHJlYWRvbmx5IFNISUZUX0VOVEVSID0gbmV3IE9wZW5Tb3VyY2VGaWxlS2V5cyhcIlNoaWZ0K0VudGVyXCIsIHtcbiAgICBtb2RpZmllcnM6IFtcIlNoaWZ0XCJdLFxuICAgIGtleTogXCJFbnRlclwiLFxuICB9KTtcblxuICBwcml2YXRlIGNvbnN0cnVjdG9yKHJlYWRvbmx5IG5hbWU6IE5hbWUsIHJlYWRvbmx5IGtleUJpbmQ6IEtleUJpbmQpIHtcbiAgICBPcGVuU291cmNlRmlsZUtleXMuX3ZhbHVlcy5wdXNoKHRoaXMpO1xuICB9XG5cbiAgc3RhdGljIGZyb21OYW1lKG5hbWU6IHN0cmluZyk6IE9wZW5Tb3VyY2VGaWxlS2V5cyB7XG4gICAgcmV0dXJuIE9wZW5Tb3VyY2VGaWxlS2V5cy5fdmFsdWVzLmZpbmQoKHgpID0+IHgubmFtZSA9PT0gbmFtZSkhO1xuICB9XG5cbiAgc3RhdGljIHZhbHVlcygpOiBPcGVuU291cmNlRmlsZUtleXNbXSB7XG4gICAgcmV0dXJuIE9wZW5Tb3VyY2VGaWxlS2V5cy5fdmFsdWVzO1xuICB9XG59XG4iLCJpbXBvcnQgdHlwZSB7IFdvcmQgfSBmcm9tIFwiLi4vbW9kZWwvV29yZFwiO1xuaW1wb3J0IHsgYmFzZW5hbWUgfSBmcm9tIFwiLi4vdXRpbC9wYXRoXCI7XG5cbmV4cG9ydCBjbGFzcyBEZXNjcmlwdGlvbk9uU3VnZ2VzdGlvbiB7XG4gIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IF92YWx1ZXM6IERlc2NyaXB0aW9uT25TdWdnZXN0aW9uW10gPSBbXTtcblxuICBzdGF0aWMgcmVhZG9ubHkgTk9ORSA9IG5ldyBEZXNjcmlwdGlvbk9uU3VnZ2VzdGlvbihcIk5vbmVcIiwgKCkgPT4gbnVsbCk7XG4gIHN0YXRpYyByZWFkb25seSBTSE9SVCA9IG5ldyBEZXNjcmlwdGlvbk9uU3VnZ2VzdGlvbihcIlNob3J0XCIsICh3b3JkKSA9PiB7XG4gICAgaWYgKCF3b3JkLmRlc2NyaXB0aW9uKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIHdvcmQudHlwZSA9PT0gXCJjdXN0b21EaWN0aW9uYXJ5XCJcbiAgICAgID8gd29yZC5kZXNjcmlwdGlvblxuICAgICAgOiBiYXNlbmFtZSh3b3JkLmRlc2NyaXB0aW9uKTtcbiAgfSk7XG4gIHN0YXRpYyByZWFkb25seSBGVUxMID0gbmV3IERlc2NyaXB0aW9uT25TdWdnZXN0aW9uKFxuICAgIFwiRnVsbFwiLFxuICAgICh3b3JkKSA9PiB3b3JkLmRlc2NyaXB0aW9uID8/IG51bGxcbiAgKTtcblxuICBwcml2YXRlIGNvbnN0cnVjdG9yKFxuICAgIHJlYWRvbmx5IG5hbWU6IHN0cmluZyxcbiAgICByZWFkb25seSB0b0Rpc3BsYXk6ICh3b3JkOiBXb3JkKSA9PiBzdHJpbmcgfCBudWxsXG4gICkge1xuICAgIERlc2NyaXB0aW9uT25TdWdnZXN0aW9uLl92YWx1ZXMucHVzaCh0aGlzKTtcbiAgfVxuXG4gIHN0YXRpYyBmcm9tTmFtZShuYW1lOiBzdHJpbmcpOiBEZXNjcmlwdGlvbk9uU3VnZ2VzdGlvbiB7XG4gICAgcmV0dXJuIERlc2NyaXB0aW9uT25TdWdnZXN0aW9uLl92YWx1ZXMuZmluZCgoeCkgPT4geC5uYW1lID09PSBuYW1lKSE7XG4gIH1cblxuICBzdGF0aWMgdmFsdWVzKCk6IERlc2NyaXB0aW9uT25TdWdnZXN0aW9uW10ge1xuICAgIHJldHVybiBEZXNjcmlwdGlvbk9uU3VnZ2VzdGlvbi5fdmFsdWVzO1xuICB9XG59XG4iLCJpbXBvcnQgdHlwZSB7IEFwcCwgVEZpbGUgfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB0eXBlIHsgV29yZHNCeUZpcnN0TGV0dGVyIH0gZnJvbSBcIi4vc3VnZ2VzdGVyXCI7XG5pbXBvcnQgdHlwZSB7IEFwcEhlbHBlciwgRnJvbnRNYXR0ZXJWYWx1ZSB9IGZyb20gXCIuLi9hcHAtaGVscGVyXCI7XG5pbXBvcnQgdHlwZSB7IEZyb250TWF0dGVyV29yZCB9IGZyb20gXCIuLi9tb2RlbC9Xb3JkXCI7XG5pbXBvcnQgeyBleGNsdWRlRW1vamkgfSBmcm9tIFwiLi4vdXRpbC9zdHJpbmdzXCI7XG5pbXBvcnQgeyBncm91cEJ5LCB1bmlxQnkgfSBmcm9tIFwiLi4vdXRpbC9jb2xsZWN0aW9uLWhlbHBlclwiO1xuXG5mdW5jdGlvbiBzeW5vbnltQWxpYXNlcyhuYW1lOiBzdHJpbmcpOiBzdHJpbmdbXSB7XG4gIGNvbnN0IGxlc3NFbW9qaVZhbHVlID0gZXhjbHVkZUVtb2ppKG5hbWUpO1xuICByZXR1cm4gbmFtZSA9PT0gbGVzc0Vtb2ppVmFsdWUgPyBbXSA6IFtsZXNzRW1vamlWYWx1ZV07XG59XG5cbmZ1bmN0aW9uIGZyb250TWF0dGVyVG9Xb3JkcyhcbiAgZmlsZTogVEZpbGUsXG4gIGtleTogc3RyaW5nLFxuICB2YWx1ZXM6IEZyb250TWF0dGVyVmFsdWVcbik6IEZyb250TWF0dGVyV29yZFtdIHtcbiAgcmV0dXJuIHZhbHVlcy5tYXAoKHgpID0+ICh7XG4gICAga2V5LFxuICAgIHZhbHVlOiB4LFxuICAgIHR5cGU6IFwiZnJvbnRNYXR0ZXJcIixcbiAgICBjcmVhdGVkUGF0aDogZmlsZS5wYXRoLFxuICAgIGFsaWFzZXM6IHN5bm9ueW1BbGlhc2VzKHgpLFxuICB9KSk7XG59XG5cbmZ1bmN0aW9uIHBpY2tXb3JkcyhmaWxlOiBURmlsZSwgZm06IHsgW2tleTogc3RyaW5nXTogRnJvbnRNYXR0ZXJWYWx1ZSB9KSB7XG4gIHJldHVybiBPYmplY3QuZW50cmllcyhmbSlcbiAgICAuZmlsdGVyKFxuICAgICAgKFtfa2V5LCB2YWx1ZV0pID0+XG4gICAgICAgIHZhbHVlICE9IG51bGwgJiZcbiAgICAgICAgKHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIiB8fCB0eXBlb2YgdmFsdWVbMF0gPT09IFwic3RyaW5nXCIpXG4gICAgKVxuICAgIC5mbGF0TWFwKChba2V5LCB2YWx1ZV0pID0+IGZyb250TWF0dGVyVG9Xb3JkcyhmaWxlLCBrZXksIHZhbHVlKSk7XG59XG5cbi8vIG5vaW5zcGVjdGlvbiBGdW5jdGlvbldpdGhNdWx0aXBsZUxvb3BzSlNcbmZ1bmN0aW9uIGV4dHJhY3RBbmRVbmlxV29yZHMoXG4gIHdvcmRzQnlDcmVhdGVkUGF0aDogRnJvbnRNYXR0ZXJXb3JkUHJvdmlkZXJbXCJ3b3Jkc0J5Q3JlYXRlZFBhdGhcIl1cbik6IEZyb250TWF0dGVyV29yZFtdIHtcbiAgcmV0dXJuIHVuaXFCeShcbiAgICBPYmplY3QudmFsdWVzKHdvcmRzQnlDcmVhdGVkUGF0aCkuZmxhdCgpLFxuICAgICh3KSA9PiB3LmtleSArIHcudmFsdWUudG9Mb3dlckNhc2UoKVxuICApO1xufVxuXG5mdW5jdGlvbiBpbmRleGluZ1dvcmRzKFxuICB3b3JkczogRnJvbnRNYXR0ZXJXb3JkW11cbik6IEZyb250TWF0dGVyV29yZFByb3ZpZGVyW1wid29yZHNCeUZpcnN0TGV0dGVyQnlLZXlcIl0ge1xuICBjb25zdCB3b3Jkc0J5S2V5ID0gZ3JvdXBCeSh3b3JkcywgKHgpID0+IHgua2V5KTtcbiAgcmV0dXJuIE9iamVjdC5mcm9tRW50cmllcyhcbiAgICBPYmplY3QuZW50cmllcyh3b3Jkc0J5S2V5KS5tYXAoXG4gICAgICAoW2tleSwgd29yZHNdOiBbc3RyaW5nLCBGcm9udE1hdHRlcldvcmRbXV0pID0+IFtcbiAgICAgICAga2V5LFxuICAgICAgICBncm91cEJ5KHdvcmRzLCAodykgPT4gdy52YWx1ZS5jaGFyQXQoMCkpLFxuICAgICAgXVxuICAgIClcbiAgKTtcbn1cblxuZXhwb3J0IGNsYXNzIEZyb250TWF0dGVyV29yZFByb3ZpZGVyIHtcbiAgcHJpdmF0ZSB3b3Jkc0J5Q3JlYXRlZFBhdGg6IHsgW3BhdGg6IHN0cmluZ106IEZyb250TWF0dGVyV29yZFtdIH0gPSB7fTtcbiAgd29yZHM6IEZyb250TWF0dGVyV29yZFtdO1xuICB3b3Jkc0J5Rmlyc3RMZXR0ZXJCeUtleTogeyBba2V5OiBzdHJpbmddOiBXb3Jkc0J5Rmlyc3RMZXR0ZXIgfTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGFwcDogQXBwLCBwcml2YXRlIGFwcEhlbHBlcjogQXBwSGVscGVyKSB7fVxuXG4gIHJlZnJlc2hXb3JkcygpOiB2b2lkIHtcbiAgICB0aGlzLmNsZWFyV29yZHMoKTtcblxuICAgIHRoaXMuYXBwLnZhdWx0LmdldE1hcmtkb3duRmlsZXMoKS5mb3JFYWNoKChmKSA9PiB7XG4gICAgICBjb25zdCBmbSA9IHRoaXMuYXBwSGVscGVyLmdldEZyb250TWF0dGVyKGYpO1xuICAgICAgaWYgKCFmbSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRoaXMud29yZHNCeUNyZWF0ZWRQYXRoW2YucGF0aF0gPSBwaWNrV29yZHMoZiwgZm0pO1xuICAgIH0pO1xuXG4gICAgdGhpcy53b3JkcyA9IGV4dHJhY3RBbmRVbmlxV29yZHModGhpcy53b3Jkc0J5Q3JlYXRlZFBhdGgpO1xuICAgIHRoaXMud29yZHNCeUZpcnN0TGV0dGVyQnlLZXkgPSBpbmRleGluZ1dvcmRzKHRoaXMud29yZHMpO1xuICB9XG5cbiAgdXBkYXRlV29yZEluZGV4KGZpbGU6IFRGaWxlKTogdm9pZCB7XG4gICAgY29uc3QgZm0gPSB0aGlzLmFwcEhlbHBlci5nZXRGcm9udE1hdHRlcihmaWxlKTtcbiAgICBpZiAoIWZtKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy53b3Jkc0J5Q3JlYXRlZFBhdGhbZmlsZS5wYXRoXSA9IHBpY2tXb3JkcyhmaWxlLCBmbSk7XG4gIH1cblxuICB1cGRhdGVXb3JkcygpOiB2b2lkIHtcbiAgICB0aGlzLndvcmRzID0gZXh0cmFjdEFuZFVuaXFXb3Jkcyh0aGlzLndvcmRzQnlDcmVhdGVkUGF0aCk7XG4gICAgdGhpcy53b3Jkc0J5Rmlyc3RMZXR0ZXJCeUtleSA9IGluZGV4aW5nV29yZHModGhpcy53b3Jkcyk7XG4gIH1cblxuICBjbGVhcldvcmRzKCk6IHZvaWQge1xuICAgIHRoaXMud29yZHNCeUNyZWF0ZWRQYXRoID0ge307XG4gICAgdGhpcy53b3JkcyA9IFtdO1xuICAgIHRoaXMud29yZHNCeUZpcnN0TGV0dGVyQnlLZXkgPSB7fTtcbiAgfVxuXG4gIGdldCB3b3JkQ291bnQoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy53b3Jkcy5sZW5ndGg7XG4gIH1cbn1cbiIsImltcG9ydCB0eXBlIHsgSW5kZXhlZFdvcmRzIH0gZnJvbSBcIi4uL3VpL0F1dG9Db21wbGV0ZVN1Z2dlc3RcIjtcbmltcG9ydCB7IHN1Z2dlc3RXb3Jkcywgc3VnZ2VzdFdvcmRzQnlQYXJ0aWFsTWF0Y2ggfSBmcm9tIFwiLi9zdWdnZXN0ZXJcIjtcbmltcG9ydCB0eXBlIHsgV29yZCB9IGZyb20gXCIuLi9tb2RlbC9Xb3JkXCI7XG5pbXBvcnQgdHlwZSB7IFNlbGVjdGlvbkhpc3RvcnlTdG9yYWdlIH0gZnJvbSBcIi4uL3N0b3JhZ2UvU2VsZWN0aW9uSGlzdG9yeVN0b3JhZ2VcIjtcblxudHlwZSBOYW1lID0gXCJpbmhlcml0XCIgfCBcInByZWZpeFwiIHwgXCJwYXJ0aWFsXCI7XG5cbnR5cGUgSGFuZGxlciA9IChcbiAgaW5kZXhlZFdvcmRzOiBJbmRleGVkV29yZHMsXG4gIHF1ZXJ5OiBzdHJpbmcsXG4gIG1heDogbnVtYmVyLFxuICBmcm9udE1hdHRlcjogc3RyaW5nIHwgbnVsbCxcbiAgc2VsZWN0aW9uSGlzdG9yeVN0b3JhZ2U/OiBTZWxlY3Rpb25IaXN0b3J5U3RvcmFnZVxuKSA9PiBXb3JkW107XG5cbmNvbnN0IG5ldmVyVXNlZEhhbmRsZXIgPSAoLi4uX2FyZ3M6IGFueVtdKSA9PiBbXTtcblxuZXhwb3J0IGNsYXNzIFNwZWNpZmljTWF0Y2hTdHJhdGVneSB7XG4gIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IF92YWx1ZXM6IFNwZWNpZmljTWF0Y2hTdHJhdGVneVtdID0gW107XG5cbiAgc3RhdGljIHJlYWRvbmx5IElOSEVSSVQgPSBuZXcgU3BlY2lmaWNNYXRjaFN0cmF0ZWd5KFxuICAgIFwiaW5oZXJpdFwiLFxuICAgIG5ldmVyVXNlZEhhbmRsZXJcbiAgKTtcbiAgc3RhdGljIHJlYWRvbmx5IFBSRUZJWCA9IG5ldyBTcGVjaWZpY01hdGNoU3RyYXRlZ3koXCJwcmVmaXhcIiwgc3VnZ2VzdFdvcmRzKTtcbiAgc3RhdGljIHJlYWRvbmx5IFBBUlRJQUwgPSBuZXcgU3BlY2lmaWNNYXRjaFN0cmF0ZWd5KFxuICAgIFwicGFydGlhbFwiLFxuICAgIHN1Z2dlc3RXb3Jkc0J5UGFydGlhbE1hdGNoXG4gICk7XG5cbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcihyZWFkb25seSBuYW1lOiBOYW1lLCByZWFkb25seSBoYW5kbGVyOiBIYW5kbGVyKSB7XG4gICAgU3BlY2lmaWNNYXRjaFN0cmF0ZWd5Ll92YWx1ZXMucHVzaCh0aGlzKTtcbiAgfVxuXG4gIHN0YXRpYyBmcm9tTmFtZShuYW1lOiBzdHJpbmcpOiBTcGVjaWZpY01hdGNoU3RyYXRlZ3kge1xuICAgIHJldHVybiBTcGVjaWZpY01hdGNoU3RyYXRlZ3kuX3ZhbHVlcy5maW5kKCh4KSA9PiB4Lm5hbWUgPT09IG5hbWUpITtcbiAgfVxuXG4gIHN0YXRpYyB2YWx1ZXMoKTogU3BlY2lmaWNNYXRjaFN0cmF0ZWd5W10ge1xuICAgIHJldHVybiBTcGVjaWZpY01hdGNoU3RyYXRlZ3kuX3ZhbHVlcztcbiAgfVxufVxuIiwiaW1wb3J0IHR5cGUgeyBXb3JkIH0gZnJvbSBcIi4uL21vZGVsL1dvcmRcIjtcbmltcG9ydCB0eXBlIHsgUGFydGlhbFJlcXVpcmVkIH0gZnJvbSBcIi4uL3R5cGVzXCI7XG5cbmV4cG9ydCB0eXBlIEhpdFdvcmQgPSBQYXJ0aWFsUmVxdWlyZWQ8V29yZCwgXCJoaXRcIj47XG5leHBvcnQgdHlwZSBTZWxlY3Rpb25IaXN0b3J5ID0ge1xuICBjb3VudDogbnVtYmVyO1xuICBsYXN0VXBkYXRlZDogbnVtYmVyO1xufTtcblxuZXhwb3J0IHR5cGUgU2VsZWN0aW9uSGlzdG9yeVRyZWUgPSB7XG4gIFtoaXQ6IHN0cmluZ106IHtcbiAgICBbdmFsdWU6IHN0cmluZ106IHtcbiAgICAgIFt0eXBlOiBzdHJpbmddOiBTZWxlY3Rpb25IaXN0b3J5O1xuICAgIH07XG4gIH07XG59O1xuXG5jb25zdCBTRUMgPSAxMDAwO1xuY29uc3QgTUlOID0gU0VDICogNjA7XG5jb25zdCBIT1VSID0gTUlOICogNjA7XG5jb25zdCBEQVkgPSBIT1VSICogMjQ7XG5jb25zdCBXRUVLID0gREFZICogNztcblxuZnVuY3Rpb24gY2FsY1Njb3JlKGhpc3Rvcnk6IFNlbGVjdGlvbkhpc3RvcnkgfCB1bmRlZmluZWQpOiBudW1iZXIge1xuICBpZiAoIWhpc3RvcnkpIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIGNvbnN0IGJlaGluZCA9IERhdGUubm93KCkgLSBoaXN0b3J5Lmxhc3RVcGRhdGVkO1xuXG4gIC8vIG5vaW5zcGVjdGlvbiBJZlN0YXRlbWVudFdpdGhUb29NYW55QnJhbmNoZXNKU1xuICBpZiAoYmVoaW5kIDwgTUlOKSB7XG4gICAgcmV0dXJuIDggKiBoaXN0b3J5LmNvdW50O1xuICB9IGVsc2UgaWYgKGJlaGluZCA8IEhPVVIpIHtcbiAgICByZXR1cm4gNCAqIGhpc3RvcnkuY291bnQ7XG4gIH0gZWxzZSBpZiAoYmVoaW5kIDwgREFZKSB7XG4gICAgcmV0dXJuIDIgKiBoaXN0b3J5LmNvdW50O1xuICB9IGVsc2UgaWYgKGJlaGluZCA8IFdFRUspIHtcbiAgICByZXR1cm4gMC41ICogaGlzdG9yeS5jb3VudDtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gMC4yNSAqIGhpc3RvcnkuY291bnQ7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFNlbGVjdGlvbkhpc3RvcnlTdG9yYWdlIHtcbiAgZGF0YTogU2VsZWN0aW9uSGlzdG9yeVRyZWU7XG4gIHZlcnNpb246IG51bWJlcjtcbiAgcGVyc2lzdGVkVmVyc2lvbjogbnVtYmVyO1xuXG4gIGNvbnN0cnVjdG9yKGRhdGE6IFNlbGVjdGlvbkhpc3RvcnlUcmVlID0ge30pIHtcbiAgICB0aGlzLmRhdGEgPSBkYXRhO1xuXG4gICAgY29uc3Qgbm93ID0gRGF0ZS5ub3coKTtcbiAgICB0aGlzLnZlcnNpb24gPSBub3c7XG4gICAgdGhpcy5wZXJzaXN0ZWRWZXJzaW9uID0gbm93O1xuICB9XG5cbiAgLy8gbm9pbnNwZWN0aW9uIEZ1bmN0aW9uV2l0aE11bHRpcGxlTG9vcHNKU1xuICBwdXJnZSgpIHtcbiAgICBmb3IgKGNvbnN0IGhpdCBvZiBPYmplY3Qua2V5cyh0aGlzLmRhdGEpKSB7XG4gICAgICBmb3IgKGNvbnN0IHZhbHVlIG9mIE9iamVjdC5rZXlzKHRoaXMuZGF0YVtoaXRdKSkge1xuICAgICAgICBmb3IgKGNvbnN0IGtpbmQgb2YgT2JqZWN0LmtleXModGhpcy5kYXRhW2hpdF1bdmFsdWVdKSkge1xuICAgICAgICAgIGlmIChEYXRlLm5vdygpIC0gdGhpcy5kYXRhW2hpdF1bdmFsdWVdW2tpbmRdLmxhc3RVcGRhdGVkID4gNCAqIFdFRUspIHtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLmRhdGFbaGl0XVt2YWx1ZV1ba2luZF07XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKE9iamVjdC5pc0VtcHR5KHRoaXMuZGF0YVtoaXRdW3ZhbHVlXSkpIHtcbiAgICAgICAgICBkZWxldGUgdGhpcy5kYXRhW2hpdF1bdmFsdWVdO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChPYmplY3QuaXNFbXB0eSh0aGlzLmRhdGFbaGl0XSkpIHtcbiAgICAgICAgZGVsZXRlIHRoaXMuZGF0YVtoaXRdO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGdldFNlbGVjdGlvbkhpc3Rvcnkod29yZDogSGl0V29yZCk6IFNlbGVjdGlvbkhpc3RvcnkgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiB0aGlzLmRhdGFbd29yZC5oaXRdPy5bd29yZC52YWx1ZV0/Llt3b3JkLnR5cGVdO1xuICB9XG5cbiAgaW5jcmVtZW50KHdvcmQ6IEhpdFdvcmQpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuZGF0YVt3b3JkLmhpdF0pIHtcbiAgICAgIHRoaXMuZGF0YVt3b3JkLmhpdF0gPSB7fTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLmRhdGFbd29yZC5oaXRdW3dvcmQudmFsdWVdKSB7XG4gICAgICB0aGlzLmRhdGFbd29yZC5oaXRdW3dvcmQudmFsdWVdID0ge307XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZGF0YVt3b3JkLmhpdF1bd29yZC52YWx1ZV1bd29yZC50eXBlXSkge1xuICAgICAgdGhpcy5kYXRhW3dvcmQuaGl0XVt3b3JkLnZhbHVlXVt3b3JkLnR5cGVdID0ge1xuICAgICAgICBjb3VudDogdGhpcy5kYXRhW3dvcmQuaGl0XVt3b3JkLnZhbHVlXVt3b3JkLnR5cGVdLmNvdW50ICsgMSxcbiAgICAgICAgbGFzdFVwZGF0ZWQ6IERhdGUubm93KCksXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmRhdGFbd29yZC5oaXRdW3dvcmQudmFsdWVdW3dvcmQudHlwZV0gPSB7XG4gICAgICAgIGNvdW50OiAxLFxuICAgICAgICBsYXN0VXBkYXRlZDogRGF0ZS5ub3coKSxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgdGhpcy52ZXJzaW9uID0gRGF0ZS5ub3coKTtcbiAgfVxuXG4gIGNvbXBhcmUodzE6IEhpdFdvcmQsIHcyOiBIaXRXb3JkKTogLTEgfCAwIHwgMSB7XG4gICAgY29uc3Qgc2NvcmUxID0gY2FsY1Njb3JlKHRoaXMuZ2V0U2VsZWN0aW9uSGlzdG9yeSh3MSkpO1xuICAgIGNvbnN0IHNjb3JlMiA9IGNhbGNTY29yZSh0aGlzLmdldFNlbGVjdGlvbkhpc3RvcnkodzIpKTtcblxuICAgIGlmIChzY29yZTEgPT09IHNjb3JlMikge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgcmV0dXJuIHNjb3JlMSA+IHNjb3JlMiA/IC0xIDogMTtcbiAgfVxuXG4gIGdldCBzaG91bGRQZXJzaXN0KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnZlcnNpb24gPiB0aGlzLnBlcnNpc3RlZFZlcnNpb247XG4gIH1cblxuICBzeW5jUGVyc2lzdFZlcnNpb24oKTogdm9pZCB7XG4gICAgdGhpcy5wZXJzaXN0ZWRWZXJzaW9uID0gdGhpcy52ZXJzaW9uO1xuICB9XG59XG4iLCJpbXBvcnQge1xuICBBcHAsXG4gIGRlYm91bmNlLFxuICB0eXBlIERlYm91bmNlcixcbiAgRWRpdG9yLFxuICB0eXBlIEVkaXRvclBvc2l0aW9uLFxuICBFZGl0b3JTdWdnZXN0LFxuICB0eXBlIEVkaXRvclN1Z2dlc3RDb250ZXh0LFxuICB0eXBlIEVkaXRvclN1Z2dlc3RUcmlnZ2VySW5mbyxcbiAgdHlwZSBFdmVudFJlZixcbiAgdHlwZSBLZXltYXBFdmVudEhhbmRsZXIsXG4gIHR5cGUgTW9kaWZpZXIsXG4gIE5vdGljZSxcbiAgU2NvcGUsXG4gIFRGaWxlLFxufSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB7IGNyZWF0ZVRva2VuaXplciwgdHlwZSBUb2tlbml6ZXIgfSBmcm9tIFwiLi4vdG9rZW5pemVyL3Rva2VuaXplclwiO1xuaW1wb3J0IHsgVG9rZW5pemVTdHJhdGVneSB9IGZyb20gXCIuLi90b2tlbml6ZXIvVG9rZW5pemVTdHJhdGVneVwiO1xuaW1wb3J0IHR5cGUgeyBTZXR0aW5ncyB9IGZyb20gXCIuLi9zZXR0aW5nL3NldHRpbmdzXCI7XG5pbXBvcnQgeyBBcHBIZWxwZXIgfSBmcm9tIFwiLi4vYXBwLWhlbHBlclwiO1xuaW1wb3J0IHR5cGUgeyBXb3Jkc0J5Rmlyc3RMZXR0ZXIgfSBmcm9tIFwiLi4vcHJvdmlkZXIvc3VnZ2VzdGVyXCI7XG5pbXBvcnQgeyBDdXN0b21EaWN0aW9uYXJ5V29yZFByb3ZpZGVyIH0gZnJvbSBcIi4uL3Byb3ZpZGVyL0N1c3RvbURpY3Rpb25hcnlXb3JkUHJvdmlkZXJcIjtcbmltcG9ydCB7IEN1cnJlbnRGaWxlV29yZFByb3ZpZGVyIH0gZnJvbSBcIi4uL3Byb3ZpZGVyL0N1cnJlbnRGaWxlV29yZFByb3ZpZGVyXCI7XG5pbXBvcnQgeyBJbnRlcm5hbExpbmtXb3JkUHJvdmlkZXIgfSBmcm9tIFwiLi4vcHJvdmlkZXIvSW50ZXJuYWxMaW5rV29yZFByb3ZpZGVyXCI7XG5pbXBvcnQgeyBNYXRjaFN0cmF0ZWd5IH0gZnJvbSBcIi4uL3Byb3ZpZGVyL01hdGNoU3RyYXRlZ3lcIjtcbmltcG9ydCB7IEN5Y2xlVGhyb3VnaFN1Z2dlc3Rpb25zS2V5cyB9IGZyb20gXCIuLi9vcHRpb24vQ3ljbGVUaHJvdWdoU3VnZ2VzdGlvbnNLZXlzXCI7XG5pbXBvcnQgeyBDb2x1bW5EZWxpbWl0ZXIgfSBmcm9tIFwiLi4vb3B0aW9uL0NvbHVtbkRlbGltaXRlclwiO1xuaW1wb3J0IHsgU2VsZWN0U3VnZ2VzdGlvbktleSB9IGZyb20gXCIuLi9vcHRpb24vU2VsZWN0U3VnZ2VzdGlvbktleVwiO1xuaW1wb3J0IHsgdW5pcVdpdGggfSBmcm9tIFwiLi4vdXRpbC9jb2xsZWN0aW9uLWhlbHBlclwiO1xuaW1wb3J0IHsgQ3VycmVudFZhdWx0V29yZFByb3ZpZGVyIH0gZnJvbSBcIi4uL3Byb3ZpZGVyL0N1cnJlbnRWYXVsdFdvcmRQcm92aWRlclwiO1xuaW1wb3J0IHR5cGUgeyBQcm92aWRlclN0YXR1c0JhciB9IGZyb20gXCIuL1Byb3ZpZGVyU3RhdHVzQmFyXCI7XG5pbXBvcnQgdHlwZSB7IFdvcmQgfSBmcm9tIFwiLi4vbW9kZWwvV29yZFwiO1xuaW1wb3J0IHsgT3BlblNvdXJjZUZpbGVLZXlzIH0gZnJvbSBcIi4uL29wdGlvbi9PcGVuU291cmNlRmlsZUtleXNcIjtcbmltcG9ydCB7IERlc2NyaXB0aW9uT25TdWdnZXN0aW9uIH0gZnJvbSBcIi4uL29wdGlvbi9EZXNjcmlwdGlvbk9uU3VnZ2VzdGlvblwiO1xuaW1wb3J0IHsgRnJvbnRNYXR0ZXJXb3JkUHJvdmlkZXIgfSBmcm9tIFwiLi4vcHJvdmlkZXIvRnJvbnRNYXR0ZXJXb3JkUHJvdmlkZXJcIjtcbmltcG9ydCB7IFNwZWNpZmljTWF0Y2hTdHJhdGVneSB9IGZyb20gXCIuLi9wcm92aWRlci9TcGVjaWZpY01hdGNoU3RyYXRlZ3lcIjtcbmltcG9ydCB7XG4gIHR5cGUgSGl0V29yZCxcbiAgU2VsZWN0aW9uSGlzdG9yeVN0b3JhZ2UsXG59IGZyb20gXCIuLi9zdG9yYWdlL1NlbGVjdGlvbkhpc3RvcnlTdG9yYWdlXCI7XG5cbmZ1bmN0aW9uIGJ1aWxkTG9nTWVzc2FnZShtZXNzYWdlOiBzdHJpbmcsIG1zZWM6IG51bWJlcikge1xuICByZXR1cm4gYCR7bWVzc2FnZX06ICR7TWF0aC5yb3VuZChtc2VjKX1bbXNdYDtcbn1cblxuZXhwb3J0IHR5cGUgSW5kZXhlZFdvcmRzID0ge1xuICBjdXJyZW50RmlsZTogV29yZHNCeUZpcnN0TGV0dGVyO1xuICBjdXJyZW50VmF1bHQ6IFdvcmRzQnlGaXJzdExldHRlcjtcbiAgY3VzdG9tRGljdGlvbmFyeTogV29yZHNCeUZpcnN0TGV0dGVyO1xuICBpbnRlcm5hbExpbms6IFdvcmRzQnlGaXJzdExldHRlcjtcbiAgZnJvbnRNYXR0ZXI6IHsgW2tleTogc3RyaW5nXTogV29yZHNCeUZpcnN0TGV0dGVyIH07XG59O1xuXG4vLyBUaGlzIGlzIGFuIHVuc2FmZSBjb2RlLi4hIVxuaW50ZXJmYWNlIFVuc2FmZUVkaXRvclN1Z2dlc3RJbnRlcmZhY2Uge1xuICBzY29wZTogU2NvcGUgJiB7IGtleXM6IChLZXltYXBFdmVudEhhbmRsZXIgJiB7IGZ1bmM6IENhbGxhYmxlRnVuY3Rpb24gfSlbXSB9O1xuICBzdWdnZXN0aW9uczoge1xuICAgIHNlbGVjdGVkSXRlbTogbnVtYmVyO1xuICAgIHVzZVNlbGVjdGVkSXRlbShldjogUGFydGlhbDxLZXlib2FyZEV2ZW50Pik6IHZvaWQ7XG4gICAgc2V0U2VsZWN0ZWRJdGVtKHNlbGVjdGVkOiBudW1iZXIsIHNjcm9sbDogYm9vbGVhbik6IHZvaWQ7XG4gICAgdmFsdWVzOiBXb3JkW107XG4gIH07XG4gIGlzT3BlbjogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGNsYXNzIEF1dG9Db21wbGV0ZVN1Z2dlc3RcbiAgZXh0ZW5kcyBFZGl0b3JTdWdnZXN0PFdvcmQ+XG4gIGltcGxlbWVudHMgVW5zYWZlRWRpdG9yU3VnZ2VzdEludGVyZmFjZVxue1xuICBhcHA6IEFwcDtcbiAgc2V0dGluZ3M6IFNldHRpbmdzO1xuICBhcHBIZWxwZXI6IEFwcEhlbHBlcjtcbiAgc3RhdHVzQmFyOiBQcm92aWRlclN0YXR1c0JhcjtcblxuICBjdXJyZW50RmlsZVdvcmRQcm92aWRlcjogQ3VycmVudEZpbGVXb3JkUHJvdmlkZXI7XG4gIGN1cnJlbnRWYXVsdFdvcmRQcm92aWRlcjogQ3VycmVudFZhdWx0V29yZFByb3ZpZGVyO1xuICBjdXN0b21EaWN0aW9uYXJ5V29yZFByb3ZpZGVyOiBDdXN0b21EaWN0aW9uYXJ5V29yZFByb3ZpZGVyO1xuICBpbnRlcm5hbExpbmtXb3JkUHJvdmlkZXI6IEludGVybmFsTGlua1dvcmRQcm92aWRlcjtcbiAgZnJvbnRNYXR0ZXJXb3JkUHJvdmlkZXI6IEZyb250TWF0dGVyV29yZFByb3ZpZGVyO1xuICBzZWxlY3Rpb25IaXN0b3J5U3RvcmFnZTogU2VsZWN0aW9uSGlzdG9yeVN0b3JhZ2UgfCB1bmRlZmluZWQ7XG5cbiAgdG9rZW5pemVyOiBUb2tlbml6ZXI7XG4gIGRlYm91bmNlR2V0U3VnZ2VzdGlvbnM6IERlYm91bmNlcjxcbiAgICBbRWRpdG9yU3VnZ2VzdENvbnRleHQsICh0b2tlbnM6IFdvcmRbXSkgPT4gdm9pZF1cbiAgPjtcbiAgZGVib3VuY2VDbG9zZTogRGVib3VuY2VyPFtdPjtcblxuICBydW5NYW51YWxseTogYm9vbGVhbjtcbiAgZGVjbGFyZSBpc09wZW46IGJvb2xlYW47XG5cbiAgY29udGV4dFN0YXJ0Q2g6IG51bWJlcjtcblxuICBwcmV2aW91c0N1cnJlbnRMaW5lID0gXCJcIjtcblxuICAvLyB1bnNhZmUhIVxuICBzY29wZTogVW5zYWZlRWRpdG9yU3VnZ2VzdEludGVyZmFjZVtcInNjb3BlXCJdO1xuICBzdWdnZXN0aW9uczogVW5zYWZlRWRpdG9yU3VnZ2VzdEludGVyZmFjZVtcInN1Z2dlc3Rpb25zXCJdO1xuXG4gIGtleW1hcEV2ZW50SGFuZGxlcjogS2V5bWFwRXZlbnRIYW5kbGVyW10gPSBbXTtcbiAgbW9kaWZ5RXZlbnRSZWY6IEV2ZW50UmVmO1xuICBhY3RpdmVMZWFmQ2hhbmdlUmVmOiBFdmVudFJlZjtcbiAgbWV0YWRhdGFDYWNoZUNoYW5nZVJlZjogRXZlbnRSZWY7XG5cbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcihhcHA6IEFwcCwgc3RhdHVzQmFyOiBQcm92aWRlclN0YXR1c0Jhcikge1xuICAgIHN1cGVyKGFwcCk7XG4gICAgdGhpcy5hcHBIZWxwZXIgPSBuZXcgQXBwSGVscGVyKGFwcCk7XG4gICAgdGhpcy5zdGF0dXNCYXIgPSBzdGF0dXNCYXI7XG4gIH1cblxuICB0cmlnZ2VyQ29tcGxldGUoKSB7XG4gICAgY29uc3QgZWRpdG9yID0gdGhpcy5hcHBIZWxwZXIuZ2V0Q3VycmVudEVkaXRvcigpO1xuICAgIGNvbnN0IGFjdGl2ZUZpbGUgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpO1xuICAgIGlmICghZWRpdG9yIHx8ICFhY3RpdmVGaWxlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gWFhYOiBVbnNhZmVcbiAgICB0aGlzLnJ1bk1hbnVhbGx5ID0gdHJ1ZTtcbiAgICAodGhpcyBhcyBhbnkpLnRyaWdnZXIoZWRpdG9yLCBhY3RpdmVGaWxlLCB0cnVlKTtcbiAgfVxuXG4gIHN0YXRpYyBhc3luYyBuZXcoXG4gICAgYXBwOiBBcHAsXG4gICAgc2V0dGluZ3M6IFNldHRpbmdzLFxuICAgIHN0YXR1c0JhcjogUHJvdmlkZXJTdGF0dXNCYXIsXG4gICAgb25QZXJzaXN0U2VsZWN0aW9uSGlzdG9yeTogKCkgPT4gdm9pZFxuICApOiBQcm9taXNlPEF1dG9Db21wbGV0ZVN1Z2dlc3Q+IHtcbiAgICBjb25zdCBpbnMgPSBuZXcgQXV0b0NvbXBsZXRlU3VnZ2VzdChhcHAsIHN0YXR1c0Jhcik7XG5cbiAgICBpbnMuY3VycmVudEZpbGVXb3JkUHJvdmlkZXIgPSBuZXcgQ3VycmVudEZpbGVXb3JkUHJvdmlkZXIoXG4gICAgICBpbnMuYXBwLFxuICAgICAgaW5zLmFwcEhlbHBlclxuICAgICk7XG4gICAgaW5zLmN1cnJlbnRWYXVsdFdvcmRQcm92aWRlciA9IG5ldyBDdXJyZW50VmF1bHRXb3JkUHJvdmlkZXIoXG4gICAgICBpbnMuYXBwLFxuICAgICAgaW5zLmFwcEhlbHBlclxuICAgICk7XG4gICAgaW5zLmN1c3RvbURpY3Rpb25hcnlXb3JkUHJvdmlkZXIgPSBuZXcgQ3VzdG9tRGljdGlvbmFyeVdvcmRQcm92aWRlcihcbiAgICAgIGlucy5hcHAsXG4gICAgICBpbnMuYXBwSGVscGVyXG4gICAgKTtcbiAgICBpbnMuaW50ZXJuYWxMaW5rV29yZFByb3ZpZGVyID0gbmV3IEludGVybmFsTGlua1dvcmRQcm92aWRlcihcbiAgICAgIGlucy5hcHAsXG4gICAgICBpbnMuYXBwSGVscGVyXG4gICAgKTtcbiAgICBpbnMuZnJvbnRNYXR0ZXJXb3JkUHJvdmlkZXIgPSBuZXcgRnJvbnRNYXR0ZXJXb3JkUHJvdmlkZXIoXG4gICAgICBpbnMuYXBwLFxuICAgICAgaW5zLmFwcEhlbHBlclxuICAgICk7XG5cbiAgICBpbnMuc2VsZWN0aW9uSGlzdG9yeVN0b3JhZ2UgPSBuZXcgU2VsZWN0aW9uSGlzdG9yeVN0b3JhZ2UoXG4gICAgICBzZXR0aW5ncy5zZWxlY3Rpb25IaXN0b3J5VHJlZVxuICAgICk7XG4gICAgaW5zLnNlbGVjdGlvbkhpc3RvcnlTdG9yYWdlLnB1cmdlKCk7XG5cbiAgICBhd2FpdCBpbnMudXBkYXRlU2V0dGluZ3Moc2V0dGluZ3MpO1xuXG4gICAgaW5zLm1vZGlmeUV2ZW50UmVmID0gYXBwLnZhdWx0Lm9uKFwibW9kaWZ5XCIsIGFzeW5jIChfKSA9PiB7XG4gICAgICBhd2FpdCBpbnMucmVmcmVzaEN1cnJlbnRGaWxlVG9rZW5zKCk7XG4gICAgICBpZiAoaW5zLnNlbGVjdGlvbkhpc3RvcnlTdG9yYWdlPy5zaG91bGRQZXJzaXN0KSB7XG4gICAgICAgIGlucy5zZXR0aW5ncy5zZWxlY3Rpb25IaXN0b3J5VHJlZSA9IGlucy5zZWxlY3Rpb25IaXN0b3J5U3RvcmFnZS5kYXRhO1xuICAgICAgICBpbnMuc2VsZWN0aW9uSGlzdG9yeVN0b3JhZ2Uuc3luY1BlcnNpc3RWZXJzaW9uKCk7XG4gICAgICAgIG9uUGVyc2lzdFNlbGVjdGlvbkhpc3RvcnkoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpbnMuYWN0aXZlTGVhZkNoYW5nZVJlZiA9IGFwcC53b3Jrc3BhY2Uub24oXG4gICAgICBcImFjdGl2ZS1sZWFmLWNoYW5nZVwiLFxuICAgICAgYXN5bmMgKF8pID0+IHtcbiAgICAgICAgYXdhaXQgaW5zLnJlZnJlc2hDdXJyZW50RmlsZVRva2VucygpO1xuICAgICAgICBpbnMucmVmcmVzaEludGVybmFsTGlua1Rva2VucygpO1xuICAgICAgICBpbnMudXBkYXRlRnJvbnRNYXR0ZXJUb2tlbigpO1xuICAgICAgfVxuICAgICk7XG5cbiAgICBpbnMubWV0YWRhdGFDYWNoZUNoYW5nZVJlZiA9IGFwcC5tZXRhZGF0YUNhY2hlLm9uKFwiY2hhbmdlZFwiLCAoZikgPT4ge1xuICAgICAgaW5zLnVwZGF0ZUZyb250TWF0dGVyVG9rZW5JbmRleChmKTtcbiAgICAgIGlmICghaW5zLmFwcEhlbHBlci5pc0FjdGl2ZUZpbGUoZikpIHtcbiAgICAgICAgaW5zLnVwZGF0ZUZyb250TWF0dGVyVG9rZW4oKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIEF2b2lkIHJlZmVycmluZyB0byBpbmNvcnJlY3QgY2FjaGVcbiAgICBjb25zdCBjYWNoZVJlc29sdmVkUmVmID0gYXBwLm1ldGFkYXRhQ2FjaGUub24oXCJyZXNvbHZlZFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICBpbnMucmVmcmVzaEludGVybmFsTGlua1Rva2VucygpO1xuICAgICAgaW5zLnJlZnJlc2hGcm9udE1hdHRlclRva2VucygpO1xuICAgICAgLy8gbm9pbnNwZWN0aW9uIEVTNk1pc3NpbmdBd2FpdFxuICAgICAgaW5zLnJlZnJlc2hDdXN0b21EaWN0aW9uYXJ5VG9rZW5zKCk7XG4gICAgICAvLyBub2luc3BlY3Rpb24gRVM2TWlzc2luZ0F3YWl0XG4gICAgICBpbnMucmVmcmVzaEN1cnJlbnRWYXVsdFRva2VucygpO1xuXG4gICAgICBpbnMuYXBwLm1ldGFkYXRhQ2FjaGUub2ZmcmVmKGNhY2hlUmVzb2x2ZWRSZWYpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGlucztcbiAgfVxuXG4gIHByZWRpY3RhYmxlQ29tcGxldGUoKSB7XG4gICAgY29uc3QgZWRpdG9yID0gdGhpcy5hcHBIZWxwZXIuZ2V0Q3VycmVudEVkaXRvcigpO1xuICAgIGlmICghZWRpdG9yKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgY3Vyc29yID0gZWRpdG9yLmdldEN1cnNvcigpO1xuICAgIGNvbnN0IGN1cnJlbnRUb2tlbiA9IHRoaXMudG9rZW5pemVyXG4gICAgICAudG9rZW5pemUoZWRpdG9yLmdldExpbmUoY3Vyc29yLmxpbmUpLnNsaWNlKDAsIGN1cnNvci5jaCkpXG4gICAgICAubGFzdCgpO1xuICAgIGlmICghY3VycmVudFRva2VuKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IHN1Z2dlc3Rpb24gPSB0aGlzLnRva2VuaXplclxuICAgICAgLnRva2VuaXplKFxuICAgICAgICBlZGl0b3IuZ2V0UmFuZ2UoeyBsaW5lOiBNYXRoLm1heChjdXJzb3IubGluZSAtIDUwLCAwKSwgY2g6IDAgfSwgY3Vyc29yKVxuICAgICAgKVxuICAgICAgLnJldmVyc2UoKVxuICAgICAgLnNsaWNlKDEpXG4gICAgICAuZmluZCgoeCkgPT4geC5zdGFydHNXaXRoKGN1cnJlbnRUb2tlbikpO1xuICAgIGlmICghc3VnZ2VzdGlvbikge1xuICAgICAgc3VnZ2VzdGlvbiA9IHRoaXMudG9rZW5pemVyXG4gICAgICAgIC50b2tlbml6ZShcbiAgICAgICAgICBlZGl0b3IuZ2V0UmFuZ2UoY3Vyc29yLCB7XG4gICAgICAgICAgICBsaW5lOiBNYXRoLm1pbihjdXJzb3IubGluZSArIDUwLCBlZGl0b3IubGluZUNvdW50KCkgLSAxKSxcbiAgICAgICAgICAgIGNoOiAwLFxuICAgICAgICAgIH0pXG4gICAgICAgIClcbiAgICAgICAgLmZpbmQoKHgpID0+IHguc3RhcnRzV2l0aChjdXJyZW50VG9rZW4pKTtcbiAgICB9XG4gICAgaWYgKCFzdWdnZXN0aW9uKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZWRpdG9yLnJlcGxhY2VSYW5nZShcbiAgICAgIHN1Z2dlc3Rpb24sXG4gICAgICB7IGxpbmU6IGN1cnNvci5saW5lLCBjaDogY3Vyc29yLmNoIC0gY3VycmVudFRva2VuLmxlbmd0aCB9LFxuICAgICAgeyBsaW5lOiBjdXJzb3IubGluZSwgY2g6IGN1cnNvci5jaCB9XG4gICAgKTtcblxuICAgIHRoaXMuY2xvc2UoKTtcbiAgICB0aGlzLmRlYm91bmNlQ2xvc2UoKTtcbiAgfVxuXG4gIHVucmVnaXN0ZXIoKSB7XG4gICAgdGhpcy5hcHAudmF1bHQub2ZmcmVmKHRoaXMubW9kaWZ5RXZlbnRSZWYpO1xuICAgIHRoaXMuYXBwLndvcmtzcGFjZS5vZmZyZWYodGhpcy5hY3RpdmVMZWFmQ2hhbmdlUmVmKTtcbiAgICB0aGlzLmFwcC5tZXRhZGF0YUNhY2hlLm9mZnJlZih0aGlzLm1ldGFkYXRhQ2FjaGVDaGFuZ2VSZWYpO1xuICB9XG5cbiAgLy8gc2V0dGluZ3MgZ2V0dGVyc1xuICBnZXQgdG9rZW5pemVyU3RyYXRlZ3koKTogVG9rZW5pemVTdHJhdGVneSB7XG4gICAgcmV0dXJuIFRva2VuaXplU3RyYXRlZ3kuZnJvbU5hbWUodGhpcy5zZXR0aW5ncy5zdHJhdGVneSk7XG4gIH1cblxuICBnZXQgbWF0Y2hTdHJhdGVneSgpOiBNYXRjaFN0cmF0ZWd5IHtcbiAgICByZXR1cm4gTWF0Y2hTdHJhdGVneS5mcm9tTmFtZSh0aGlzLnNldHRpbmdzLm1hdGNoU3RyYXRlZ3kpO1xuICB9XG5cbiAgZ2V0IGZyb250TWF0dGVyQ29tcGxlbWVudFN0cmF0ZWd5KCk6IFNwZWNpZmljTWF0Y2hTdHJhdGVneSB7XG4gICAgcmV0dXJuIFNwZWNpZmljTWF0Y2hTdHJhdGVneS5mcm9tTmFtZShcbiAgICAgIHRoaXMuc2V0dGluZ3MuZnJvbnRNYXR0ZXJDb21wbGVtZW50TWF0Y2hTdHJhdGVneVxuICAgICk7XG4gIH1cblxuICBnZXQgbWluTnVtYmVyVHJpZ2dlcmVkKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIChcbiAgICAgIHRoaXMuc2V0dGluZ3MubWluTnVtYmVyT2ZDaGFyYWN0ZXJzVHJpZ2dlcmVkIHx8XG4gICAgICB0aGlzLnRva2VuaXplclN0cmF0ZWd5LnRyaWdnZXJUaHJlc2hvbGRcbiAgICApO1xuICB9XG5cbiAgZ2V0IGN1cnJlbnRGaWxlTWluTnVtYmVyT2ZDaGFyYWN0ZXJzKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIChcbiAgICAgIHRoaXMuc2V0dGluZ3MuY3VycmVudEZpbGVNaW5OdW1iZXJPZkNoYXJhY3RlcnMgfHxcbiAgICAgIHRoaXMudG9rZW5pemVyU3RyYXRlZ3kuaW5kZXhpbmdUaHJlc2hvbGRcbiAgICApO1xuICB9XG5cbiAgZ2V0IGN1cnJlbnRWYXVsdE1pbk51bWJlck9mQ2hhcmFjdGVycygpOiBudW1iZXIge1xuICAgIHJldHVybiAoXG4gICAgICB0aGlzLnNldHRpbmdzLmN1cnJlbnRWYXVsdE1pbk51bWJlck9mQ2hhcmFjdGVycyB8fFxuICAgICAgdGhpcy50b2tlbml6ZXJTdHJhdGVneS5pbmRleGluZ1RocmVzaG9sZFxuICAgICk7XG4gIH1cblxuICBnZXQgZGVzY3JpcHRpb25PblN1Z2dlc3Rpb24oKTogRGVzY3JpcHRpb25PblN1Z2dlc3Rpb24ge1xuICAgIHJldHVybiBEZXNjcmlwdGlvbk9uU3VnZ2VzdGlvbi5mcm9tTmFtZShcbiAgICAgIHRoaXMuc2V0dGluZ3MuZGVzY3JpcHRpb25PblN1Z2dlc3Rpb25cbiAgICApO1xuICB9XG5cbiAgZ2V0IGV4Y2x1ZGVJbnRlcm5hbExpbmtQcmVmaXhQYXRoUGF0dGVybnMoKTogc3RyaW5nW10ge1xuICAgIHJldHVybiB0aGlzLnNldHRpbmdzLmV4Y2x1ZGVJbnRlcm5hbExpbmtQYXRoUHJlZml4UGF0dGVybnNcbiAgICAgIC5zcGxpdChcIlxcblwiKVxuICAgICAgLmZpbHRlcigoeCkgPT4geCk7XG4gIH1cblxuICAvLyAtLS0gZW5kIC0tLVxuXG4gIGdldCBpbmRleGVkV29yZHMoKTogSW5kZXhlZFdvcmRzIHtcbiAgICByZXR1cm4ge1xuICAgICAgY3VycmVudEZpbGU6IHRoaXMuY3VycmVudEZpbGVXb3JkUHJvdmlkZXIud29yZHNCeUZpcnN0TGV0dGVyLFxuICAgICAgY3VycmVudFZhdWx0OiB0aGlzLmN1cnJlbnRWYXVsdFdvcmRQcm92aWRlci53b3Jkc0J5Rmlyc3RMZXR0ZXIsXG4gICAgICBjdXN0b21EaWN0aW9uYXJ5OiB0aGlzLmN1c3RvbURpY3Rpb25hcnlXb3JkUHJvdmlkZXIud29yZHNCeUZpcnN0TGV0dGVyLFxuICAgICAgaW50ZXJuYWxMaW5rOiB0aGlzLmludGVybmFsTGlua1dvcmRQcm92aWRlci53b3Jkc0J5Rmlyc3RMZXR0ZXIsXG4gICAgICBmcm9udE1hdHRlcjogdGhpcy5mcm9udE1hdHRlcldvcmRQcm92aWRlci53b3Jkc0J5Rmlyc3RMZXR0ZXJCeUtleSxcbiAgICB9O1xuICB9XG5cbiAgYXN5bmMgdXBkYXRlU2V0dGluZ3Moc2V0dGluZ3M6IFNldHRpbmdzKSB7XG4gICAgdGhpcy5zZXR0aW5ncyA9IHNldHRpbmdzO1xuXG4gICAgdGhpcy5zdGF0dXNCYXIuc2V0TWF0Y2hTdHJhdGVneSh0aGlzLm1hdGNoU3RyYXRlZ3kpO1xuICAgIHRoaXMuc3RhdHVzQmFyLnNldENvbXBsZW1lbnRBdXRvbWF0aWNhbGx5KFxuICAgICAgdGhpcy5zZXR0aW5ncy5jb21wbGVtZW50QXV0b21hdGljYWxseVxuICAgICk7XG5cbiAgICB0cnkge1xuICAgICAgdGhpcy50b2tlbml6ZXIgPSBhd2FpdCBjcmVhdGVUb2tlbml6ZXIodGhpcy50b2tlbml6ZXJTdHJhdGVneSwgdGhpcy5hcHApO1xuICAgIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgICAgbmV3IE5vdGljZShlLm1lc3NhZ2UsIDApO1xuICAgIH1cbiAgICB0aGlzLmN1cnJlbnRGaWxlV29yZFByb3ZpZGVyLnNldFNldHRpbmdzKHRoaXMudG9rZW5pemVyKTtcbiAgICB0aGlzLmN1cnJlbnRWYXVsdFdvcmRQcm92aWRlci5zZXRTZXR0aW5ncyhcbiAgICAgIHRoaXMudG9rZW5pemVyLFxuICAgICAgc2V0dGluZ3MuaW5jbHVkZUN1cnJlbnRWYXVsdFBhdGhQcmVmaXhQYXR0ZXJuc1xuICAgICAgICAuc3BsaXQoXCJcXG5cIilcbiAgICAgICAgLmZpbHRlcigoeCkgPT4geCksXG4gICAgICBzZXR0aW5ncy5leGNsdWRlQ3VycmVudFZhdWx0UGF0aFByZWZpeFBhdHRlcm5zXG4gICAgICAgIC5zcGxpdChcIlxcblwiKVxuICAgICAgICAuZmlsdGVyKCh4KSA9PiB4KSxcbiAgICAgIHNldHRpbmdzLmluY2x1ZGVDdXJyZW50VmF1bHRPbmx5RmlsZXNVbmRlckN1cnJlbnREaXJlY3RvcnlcbiAgICApO1xuICAgIHRoaXMuY3VzdG9tRGljdGlvbmFyeVdvcmRQcm92aWRlci5zZXRTZXR0aW5ncyhcbiAgICAgIHNldHRpbmdzLmN1c3RvbURpY3Rpb25hcnlQYXRocy5zcGxpdChcIlxcblwiKS5maWx0ZXIoKHgpID0+IHgpLFxuICAgICAgQ29sdW1uRGVsaW1pdGVyLmZyb21OYW1lKHNldHRpbmdzLmNvbHVtbkRlbGltaXRlciksXG4gICAgICBzZXR0aW5ncy5kZWxpbWl0ZXJUb0RpdmlkZVN1Z2dlc3Rpb25zRm9yRGlzcGxheUZyb21JbnNlcnRpb24gfHwgbnVsbFxuICAgICk7XG5cbiAgICB0aGlzLmRlYm91bmNlR2V0U3VnZ2VzdGlvbnMgPSBkZWJvdW5jZShcbiAgICAgIChjb250ZXh0OiBFZGl0b3JTdWdnZXN0Q29udGV4dCwgY2I6ICh3b3JkczogV29yZFtdKSA9PiB2b2lkKSA9PiB7XG4gICAgICAgIGNvbnN0IHN0YXJ0ID0gcGVyZm9ybWFuY2Uubm93KCk7XG5cbiAgICAgICAgdGhpcy5zaG93RGVidWdMb2coKCkgPT4gYFtjb250ZXh0LnF1ZXJ5XTogJHtjb250ZXh0LnF1ZXJ5fWApO1xuICAgICAgICBjb25zdCBwYXJzZWRRdWVyeSA9IEpTT04ucGFyc2UoY29udGV4dC5xdWVyeSkgYXMge1xuICAgICAgICAgIGN1cnJlbnRGcm9udE1hdHRlcjogc3RyaW5nIHwgbnVsbDtcbiAgICAgICAgICBxdWVyaWVzOiB7XG4gICAgICAgICAgICB3b3JkOiBzdHJpbmc7XG4gICAgICAgICAgICBvZmZzZXQ6IG51bWJlcjtcbiAgICAgICAgICB9W107XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3Qgd29yZHMgPSBwYXJzZWRRdWVyeS5xdWVyaWVzXG4gICAgICAgICAgLmZpbHRlcihcbiAgICAgICAgICAgICh4LCBpLCB4cykgPT5cbiAgICAgICAgICAgICAgcGFyc2VkUXVlcnkuY3VycmVudEZyb250TWF0dGVyIHx8XG4gICAgICAgICAgICAgICh0aGlzLnNldHRpbmdzLm1pbk51bWJlck9mV29yZHNUcmlnZ2VyZWRQaHJhc2UgKyBpIC0gMSA8XG4gICAgICAgICAgICAgICAgeHMubGVuZ3RoICYmXG4gICAgICAgICAgICAgICAgeC53b3JkLmxlbmd0aCA+PSB0aGlzLm1pbk51bWJlclRyaWdnZXJlZCAmJlxuICAgICAgICAgICAgICAgICF0aGlzLnRva2VuaXplci5zaG91bGRJZ25vcmUoeC53b3JkKSAmJlxuICAgICAgICAgICAgICAgICF4LndvcmQuZW5kc1dpdGgoXCIgXCIpKVxuICAgICAgICAgIClcbiAgICAgICAgICAubWFwKChxKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBoYW5kbGVyID1cbiAgICAgICAgICAgICAgcGFyc2VkUXVlcnkuY3VycmVudEZyb250TWF0dGVyICYmXG4gICAgICAgICAgICAgIHRoaXMuZnJvbnRNYXR0ZXJDb21wbGVtZW50U3RyYXRlZ3kgIT09XG4gICAgICAgICAgICAgICAgU3BlY2lmaWNNYXRjaFN0cmF0ZWd5LklOSEVSSVRcbiAgICAgICAgICAgICAgICA/IHRoaXMuZnJvbnRNYXR0ZXJDb21wbGVtZW50U3RyYXRlZ3kuaGFuZGxlclxuICAgICAgICAgICAgICAgIDogdGhpcy5tYXRjaFN0cmF0ZWd5LmhhbmRsZXI7XG4gICAgICAgICAgICByZXR1cm4gaGFuZGxlcihcbiAgICAgICAgICAgICAgdGhpcy5pbmRleGVkV29yZHMsXG4gICAgICAgICAgICAgIHEud29yZCxcbiAgICAgICAgICAgICAgdGhpcy5zZXR0aW5ncy5tYXhOdW1iZXJPZlN1Z2dlc3Rpb25zLFxuICAgICAgICAgICAgICBwYXJzZWRRdWVyeS5jdXJyZW50RnJvbnRNYXR0ZXIsXG4gICAgICAgICAgICAgIHRoaXMuc2VsZWN0aW9uSGlzdG9yeVN0b3JhZ2VcbiAgICAgICAgICAgICkubWFwKCh3b3JkKSA9PiAoeyAuLi53b3JkLCBvZmZzZXQ6IHEub2Zmc2V0IH0pKTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5mbGF0KCk7XG5cbiAgICAgICAgY2IoXG4gICAgICAgICAgdW5pcVdpdGgoXG4gICAgICAgICAgICB3b3JkcyxcbiAgICAgICAgICAgIChhLCBiKSA9PiBhLnZhbHVlID09PSBiLnZhbHVlICYmIGEudHlwZSA9PT0gYi50eXBlXG4gICAgICAgICAgKS5zbGljZSgwLCB0aGlzLnNldHRpbmdzLm1heE51bWJlck9mU3VnZ2VzdGlvbnMpXG4gICAgICAgICk7XG5cbiAgICAgICAgdGhpcy5zaG93RGVidWdMb2coKCkgPT5cbiAgICAgICAgICBidWlsZExvZ01lc3NhZ2UoXCJHZXQgc3VnZ2VzdGlvbnNcIiwgcGVyZm9ybWFuY2Uubm93KCkgLSBzdGFydClcbiAgICAgICAgKTtcbiAgICAgIH0sXG4gICAgICB0aGlzLnNldHRpbmdzLmRlbGF5TWlsbGlTZWNvbmRzLFxuICAgICAgdHJ1ZVxuICAgICk7XG5cbiAgICB0aGlzLmRlYm91bmNlQ2xvc2UgPSBkZWJvdW5jZSgoKSA9PiB7XG4gICAgICB0aGlzLmNsb3NlKCk7XG4gICAgfSwgdGhpcy5zZXR0aW5ncy5kZWxheU1pbGxpU2Vjb25kcyArIDUwKTtcblxuICAgIHRoaXMucmVnaXN0ZXJLZXltYXBzKCk7XG4gIH1cblxuICBwcml2YXRlIHJlZ2lzdGVyS2V5bWFwcygpIHtcbiAgICBjb25zdCByZWdpc3RlcktleUFzSWdub3JlZCA9IChcbiAgICAgIG1vZGlmaWVyczogTW9kaWZpZXJbXSxcbiAgICAgIGtleTogc3RyaW5nIHwgbnVsbFxuICAgICkgPT4ge1xuICAgICAgdGhpcy5rZXltYXBFdmVudEhhbmRsZXIucHVzaChcbiAgICAgICAgdGhpcy5zY29wZS5yZWdpc3Rlcihtb2RpZmllcnMsIGtleSwgKCkgPT4ge1xuICAgICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSlcbiAgICAgICk7XG4gICAgfTtcblxuICAgIC8vIENsZWFyXG4gICAgdGhpcy5rZXltYXBFdmVudEhhbmRsZXIuZm9yRWFjaCgoeCkgPT4gdGhpcy5zY29wZS51bnJlZ2lzdGVyKHgpKTtcbiAgICB0aGlzLmtleW1hcEV2ZW50SGFuZGxlciA9IFtdO1xuICAgIHRoaXMuc2NvcGUudW5yZWdpc3Rlcih0aGlzLnNjb3BlLmtleXMuZmluZCgoeCkgPT4geC5rZXkgPT09IFwiRW50ZXJcIikhKTtcbiAgICB0aGlzLnNjb3BlLnVucmVnaXN0ZXIodGhpcy5zY29wZS5rZXlzLmZpbmQoKHgpID0+IHgua2V5ID09PSBcIkFycm93VXBcIikhKTtcbiAgICB0aGlzLnNjb3BlLnVucmVnaXN0ZXIodGhpcy5zY29wZS5rZXlzLmZpbmQoKHgpID0+IHgua2V5ID09PSBcIkFycm93RG93blwiKSEpO1xuXG4gICAgLy8gc2VsZWN0U3VnZ2VzdGlvbktleXNcbiAgICBjb25zdCBzZWxlY3RTdWdnZXN0aW9uS2V5ID0gU2VsZWN0U3VnZ2VzdGlvbktleS5mcm9tTmFtZShcbiAgICAgIHRoaXMuc2V0dGluZ3Muc2VsZWN0U3VnZ2VzdGlvbktleXNcbiAgICApO1xuICAgIGlmIChzZWxlY3RTdWdnZXN0aW9uS2V5ICE9PSBTZWxlY3RTdWdnZXN0aW9uS2V5LkVOVEVSKSB7XG4gICAgICByZWdpc3RlcktleUFzSWdub3JlZChcbiAgICAgICAgU2VsZWN0U3VnZ2VzdGlvbktleS5FTlRFUi5rZXlCaW5kLm1vZGlmaWVycyxcbiAgICAgICAgU2VsZWN0U3VnZ2VzdGlvbktleS5FTlRFUi5rZXlCaW5kLmtleVxuICAgICAgKTtcbiAgICB9XG4gICAgaWYgKHNlbGVjdFN1Z2dlc3Rpb25LZXkgIT09IFNlbGVjdFN1Z2dlc3Rpb25LZXkuVEFCKSB7XG4gICAgICByZWdpc3RlcktleUFzSWdub3JlZChcbiAgICAgICAgU2VsZWN0U3VnZ2VzdGlvbktleS5UQUIua2V5QmluZC5tb2RpZmllcnMsXG4gICAgICAgIFNlbGVjdFN1Z2dlc3Rpb25LZXkuVEFCLmtleUJpbmQua2V5XG4gICAgICApO1xuICAgIH1cbiAgICBpZiAoc2VsZWN0U3VnZ2VzdGlvbktleSAhPT0gU2VsZWN0U3VnZ2VzdGlvbktleS5Ob25lKSB7XG4gICAgICB0aGlzLmtleW1hcEV2ZW50SGFuZGxlci5wdXNoKFxuICAgICAgICB0aGlzLnNjb3BlLnJlZ2lzdGVyKFxuICAgICAgICAgIHNlbGVjdFN1Z2dlc3Rpb25LZXkua2V5QmluZC5tb2RpZmllcnMsXG4gICAgICAgICAgc2VsZWN0U3VnZ2VzdGlvbktleS5rZXlCaW5kLmtleSxcbiAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnN1Z2dlc3Rpb25zLnVzZVNlbGVjdGVkSXRlbSh7fSk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICApXG4gICAgICApO1xuICAgIH1cblxuICAgIC8vIHByb3BhZ2F0ZUVTQ1xuICAgIHRoaXMuc2NvcGUua2V5cy5maW5kKCh4KSA9PiB4LmtleSA9PT0gXCJFc2NhcGVcIikhLmZ1bmMgPSAoKSA9PiB7XG4gICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICByZXR1cm4gdGhpcy5zZXR0aW5ncy5wcm9wYWdhdGVFc2M7XG4gICAgfTtcblxuICAgIC8vIGN5Y2xlVGhyb3VnaFN1Z2dlc3Rpb25zS2V5c1xuICAgIGNvbnN0IHNlbGVjdE5leHQgPSAoKSA9PiB7XG4gICAgICB0aGlzLnN1Z2dlc3Rpb25zLnNldFNlbGVjdGVkSXRlbSh0aGlzLnN1Z2dlc3Rpb25zLnNlbGVjdGVkSXRlbSArIDEsIHRydWUpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG4gICAgY29uc3Qgc2VsZWN0UHJldmlvdXMgPSAoKSA9PiB7XG4gICAgICB0aGlzLnN1Z2dlc3Rpb25zLnNldFNlbGVjdGVkSXRlbSh0aGlzLnN1Z2dlc3Rpb25zLnNlbGVjdGVkSXRlbSAtIDEsIHRydWUpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG5cbiAgICBjb25zdCBjeWNsZVRocm91Z2hTdWdnZXN0aW9uc0tleXMgPSBDeWNsZVRocm91Z2hTdWdnZXN0aW9uc0tleXMuZnJvbU5hbWUoXG4gICAgICB0aGlzLnNldHRpbmdzLmFkZGl0aW9uYWxDeWNsZVRocm91Z2hTdWdnZXN0aW9uc0tleXNcbiAgICApO1xuICAgIGlmICh0aGlzLnNldHRpbmdzLmRpc2FibGVVcERvd25LZXlzRm9yQ3ljbGVUaHJvdWdoU3VnZ2VzdGlvbnNLZXlzKSB7XG4gICAgICB0aGlzLmtleW1hcEV2ZW50SGFuZGxlci5wdXNoKFxuICAgICAgICB0aGlzLnNjb3BlLnJlZ2lzdGVyKFtdLCBcIkFycm93RG93blwiLCAoKSA9PiB7XG4gICAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9KSxcbiAgICAgICAgdGhpcy5zY29wZS5yZWdpc3RlcihbXSwgXCJBcnJvd1VwXCIsICgpID0+IHtcbiAgICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0pXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmtleW1hcEV2ZW50SGFuZGxlci5wdXNoKFxuICAgICAgICB0aGlzLnNjb3BlLnJlZ2lzdGVyKFtdLCBcIkFycm93RG93blwiLCBzZWxlY3ROZXh0KSxcbiAgICAgICAgdGhpcy5zY29wZS5yZWdpc3RlcihbXSwgXCJBcnJvd1VwXCIsIHNlbGVjdFByZXZpb3VzKVxuICAgICAgKTtcbiAgICB9XG4gICAgaWYgKGN5Y2xlVGhyb3VnaFN1Z2dlc3Rpb25zS2V5cyAhPT0gQ3ljbGVUaHJvdWdoU3VnZ2VzdGlvbnNLZXlzLk5PTkUpIHtcbiAgICAgIGlmIChjeWNsZVRocm91Z2hTdWdnZXN0aW9uc0tleXMgPT09IEN5Y2xlVGhyb3VnaFN1Z2dlc3Rpb25zS2V5cy5UQUIpIHtcbiAgICAgICAgdGhpcy5zY29wZS51bnJlZ2lzdGVyKFxuICAgICAgICAgIHRoaXMuc2NvcGUua2V5cy5maW5kKCh4KSA9PiB4Lm1vZGlmaWVycyA9PT0gXCJcIiAmJiB4LmtleSA9PT0gXCJUYWJcIikhXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICB0aGlzLmtleW1hcEV2ZW50SGFuZGxlci5wdXNoKFxuICAgICAgICB0aGlzLnNjb3BlLnJlZ2lzdGVyKFxuICAgICAgICAgIGN5Y2xlVGhyb3VnaFN1Z2dlc3Rpb25zS2V5cy5uZXh0S2V5Lm1vZGlmaWVycyxcbiAgICAgICAgICBjeWNsZVRocm91Z2hTdWdnZXN0aW9uc0tleXMubmV4dEtleS5rZXksXG4gICAgICAgICAgc2VsZWN0TmV4dFxuICAgICAgICApLFxuICAgICAgICB0aGlzLnNjb3BlLnJlZ2lzdGVyKFxuICAgICAgICAgIGN5Y2xlVGhyb3VnaFN1Z2dlc3Rpb25zS2V5cy5wcmV2aW91c0tleS5tb2RpZmllcnMsXG4gICAgICAgICAgY3ljbGVUaHJvdWdoU3VnZ2VzdGlvbnNLZXlzLnByZXZpb3VzS2V5LmtleSxcbiAgICAgICAgICBzZWxlY3RQcmV2aW91c1xuICAgICAgICApXG4gICAgICApO1xuICAgIH1cblxuICAgIGNvbnN0IG9wZW5Tb3VyY2VGaWxlS2V5ID0gT3BlblNvdXJjZUZpbGVLZXlzLmZyb21OYW1lKFxuICAgICAgdGhpcy5zZXR0aW5ncy5vcGVuU291cmNlRmlsZUtleVxuICAgICk7XG4gICAgaWYgKG9wZW5Tb3VyY2VGaWxlS2V5ICE9PSBPcGVuU291cmNlRmlsZUtleXMuTk9ORSkge1xuICAgICAgdGhpcy5rZXltYXBFdmVudEhhbmRsZXIucHVzaChcbiAgICAgICAgdGhpcy5zY29wZS5yZWdpc3RlcihcbiAgICAgICAgICBvcGVuU291cmNlRmlsZUtleS5rZXlCaW5kLm1vZGlmaWVycyxcbiAgICAgICAgICBvcGVuU291cmNlRmlsZUtleS5rZXlCaW5kLmtleSxcbiAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBpdGVtID0gdGhpcy5zdWdnZXN0aW9ucy52YWx1ZXNbdGhpcy5zdWdnZXN0aW9ucy5zZWxlY3RlZEl0ZW1dO1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICBpdGVtLnR5cGUgIT09IFwiY3VycmVudFZhdWx0XCIgJiZcbiAgICAgICAgICAgICAgaXRlbS50eXBlICE9PSBcImludGVybmFsTGlua1wiICYmXG4gICAgICAgICAgICAgIGl0ZW0udHlwZSAhPT0gXCJmcm9udE1hdHRlclwiXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBtYXJrZG93bkZpbGUgPSB0aGlzLmFwcEhlbHBlci5nZXRNYXJrZG93bkZpbGVCeVBhdGgoXG4gICAgICAgICAgICAgIGl0ZW0uY3JlYXRlZFBhdGhcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBpZiAoIW1hcmtkb3duRmlsZSkge1xuICAgICAgICAgICAgICAvLyBub2luc3BlY3Rpb24gT2JqZWN0QWxsb2NhdGlvbklnbm9yZWRcbiAgICAgICAgICAgICAgbmV3IE5vdGljZShgQ2FuJ3Qgb3BlbiAke2l0ZW0uY3JlYXRlZFBhdGh9YCk7XG4gICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuYXBwSGVscGVyLm9wZW5NYXJrZG93bkZpbGUobWFya2Rvd25GaWxlLCB0cnVlKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIClcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgcmVmcmVzaEN1cnJlbnRGaWxlVG9rZW5zKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHN0YXJ0ID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgdGhpcy5zdGF0dXNCYXIuc2V0Q3VycmVudEZpbGVJbmRleGluZygpO1xuXG4gICAgaWYgKCF0aGlzLnNldHRpbmdzLmVuYWJsZUN1cnJlbnRGaWxlQ29tcGxlbWVudCkge1xuICAgICAgdGhpcy5zdGF0dXNCYXIuc2V0Q3VycmVudEZpbGVEaXNhYmxlZCgpO1xuICAgICAgdGhpcy5jdXJyZW50RmlsZVdvcmRQcm92aWRlci5jbGVhcldvcmRzKCk7XG4gICAgICB0aGlzLnNob3dEZWJ1Z0xvZygoKSA9PlxuICAgICAgICBidWlsZExvZ01lc3NhZ2UoXG4gICAgICAgICAgXCLwn5GiIFNraXA6IEluZGV4IGN1cnJlbnQgZmlsZSB0b2tlbnNcIixcbiAgICAgICAgICBwZXJmb3JtYW5jZS5ub3coKSAtIHN0YXJ0XG4gICAgICAgIClcbiAgICAgICk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgYXdhaXQgdGhpcy5jdXJyZW50RmlsZVdvcmRQcm92aWRlci5yZWZyZXNoV29yZHMoXG4gICAgICB0aGlzLnNldHRpbmdzLm9ubHlDb21wbGVtZW50RW5nbGlzaE9uQ3VycmVudEZpbGVDb21wbGVtZW50LFxuICAgICAgdGhpcy5jdXJyZW50RmlsZU1pbk51bWJlck9mQ2hhcmFjdGVyc1xuICAgICk7XG5cbiAgICB0aGlzLnN0YXR1c0Jhci5zZXRDdXJyZW50RmlsZUluZGV4ZWQoXG4gICAgICB0aGlzLmN1cnJlbnRGaWxlV29yZFByb3ZpZGVyLndvcmRDb3VudFxuICAgICk7XG4gICAgdGhpcy5zaG93RGVidWdMb2coKCkgPT5cbiAgICAgIGJ1aWxkTG9nTWVzc2FnZShcIkluZGV4IGN1cnJlbnQgZmlsZSB0b2tlbnNcIiwgcGVyZm9ybWFuY2Uubm93KCkgLSBzdGFydClcbiAgICApO1xuICB9XG5cbiAgYXN5bmMgcmVmcmVzaEN1cnJlbnRWYXVsdFRva2VucygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBzdGFydCA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgIHRoaXMuc3RhdHVzQmFyLnNldEN1cnJlbnRWYXVsdEluZGV4aW5nKCk7XG5cbiAgICBpZiAoIXRoaXMuc2V0dGluZ3MuZW5hYmxlQ3VycmVudFZhdWx0Q29tcGxlbWVudCkge1xuICAgICAgdGhpcy5zdGF0dXNCYXIuc2V0Q3VycmVudFZhdWx0RGlzYWJsZWQoKTtcbiAgICAgIHRoaXMuY3VycmVudFZhdWx0V29yZFByb3ZpZGVyLmNsZWFyV29yZHMoKTtcbiAgICAgIHRoaXMuc2hvd0RlYnVnTG9nKCgpID0+XG4gICAgICAgIGJ1aWxkTG9nTWVzc2FnZShcbiAgICAgICAgICBcIvCfkaIgU2tpcDogSW5kZXggY3VycmVudCB2YXVsdCB0b2tlbnNcIixcbiAgICAgICAgICBwZXJmb3JtYW5jZS5ub3coKSAtIHN0YXJ0XG4gICAgICAgIClcbiAgICAgICk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgYXdhaXQgdGhpcy5jdXJyZW50VmF1bHRXb3JkUHJvdmlkZXIucmVmcmVzaFdvcmRzKFxuICAgICAgdGhpcy5jdXJyZW50VmF1bHRNaW5OdW1iZXJPZkNoYXJhY3RlcnNcbiAgICApO1xuXG4gICAgdGhpcy5zdGF0dXNCYXIuc2V0Q3VycmVudFZhdWx0SW5kZXhlZChcbiAgICAgIHRoaXMuY3VycmVudFZhdWx0V29yZFByb3ZpZGVyLndvcmRDb3VudFxuICAgICk7XG4gICAgdGhpcy5zaG93RGVidWdMb2coKCkgPT5cbiAgICAgIGJ1aWxkTG9nTWVzc2FnZShcIkluZGV4IGN1cnJlbnQgdmF1bHQgdG9rZW5zXCIsIHBlcmZvcm1hbmNlLm5vdygpIC0gc3RhcnQpXG4gICAgKTtcbiAgfVxuXG4gIGFzeW5jIHJlZnJlc2hDdXN0b21EaWN0aW9uYXJ5VG9rZW5zKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHN0YXJ0ID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgdGhpcy5zdGF0dXNCYXIuc2V0Q3VzdG9tRGljdGlvbmFyeUluZGV4aW5nKCk7XG5cbiAgICBpZiAoIXRoaXMuc2V0dGluZ3MuZW5hYmxlQ3VzdG9tRGljdGlvbmFyeUNvbXBsZW1lbnQpIHtcbiAgICAgIHRoaXMuc3RhdHVzQmFyLnNldEN1c3RvbURpY3Rpb25hcnlEaXNhYmxlZCgpO1xuICAgICAgdGhpcy5jdXN0b21EaWN0aW9uYXJ5V29yZFByb3ZpZGVyLmNsZWFyV29yZHMoKTtcbiAgICAgIHRoaXMuc2hvd0RlYnVnTG9nKCgpID0+XG4gICAgICAgIGJ1aWxkTG9nTWVzc2FnZShcbiAgICAgICAgICBcIvCfkaJTa2lwOiBJbmRleCBjdXN0b20gZGljdGlvbmFyeSB0b2tlbnNcIixcbiAgICAgICAgICBwZXJmb3JtYW5jZS5ub3coKSAtIHN0YXJ0XG4gICAgICAgIClcbiAgICAgICk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgYXdhaXQgdGhpcy5jdXN0b21EaWN0aW9uYXJ5V29yZFByb3ZpZGVyLnJlZnJlc2hDdXN0b21Xb3Jkcyh7XG4gICAgICByZWdleHA6IHRoaXMuc2V0dGluZ3MuY3VzdG9tRGljdGlvbmFyeVdvcmRSZWdleFBhdHRlcm4sXG4gICAgICBkZWxpbWl0ZXJGb3JIaWRlOiB0aGlzLnNldHRpbmdzLmRlbGltaXRlclRvSGlkZVN1Z2dlc3Rpb24gfHwgdW5kZWZpbmVkLFxuICAgICAgZGVsaW1pdGVyRm9yRGlzcGxheTpcbiAgICAgICAgdGhpcy5zZXR0aW5ncy5kZWxpbWl0ZXJUb0RpdmlkZVN1Z2dlc3Rpb25zRm9yRGlzcGxheUZyb21JbnNlcnRpb24gfHxcbiAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgY2FyZXRTeW1ib2w6XG4gICAgICAgIHRoaXMuc2V0dGluZ3MuY2FyZXRMb2NhdGlvblN5bWJvbEFmdGVyQ29tcGxlbWVudCB8fCB1bmRlZmluZWQsXG4gICAgfSk7XG5cbiAgICB0aGlzLnN0YXR1c0Jhci5zZXRDdXN0b21EaWN0aW9uYXJ5SW5kZXhlZChcbiAgICAgIHRoaXMuY3VzdG9tRGljdGlvbmFyeVdvcmRQcm92aWRlci53b3JkQ291bnRcbiAgICApO1xuICAgIHRoaXMuc2hvd0RlYnVnTG9nKCgpID0+XG4gICAgICBidWlsZExvZ01lc3NhZ2UoXG4gICAgICAgIFwiSW5kZXggY3VzdG9tIGRpY3Rpb25hcnkgdG9rZW5zXCIsXG4gICAgICAgIHBlcmZvcm1hbmNlLm5vdygpIC0gc3RhcnRcbiAgICAgIClcbiAgICApO1xuICB9XG5cbiAgcmVmcmVzaEludGVybmFsTGlua1Rva2VucygpOiB2b2lkIHtcbiAgICBjb25zdCBzdGFydCA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgIHRoaXMuc3RhdHVzQmFyLnNldEludGVybmFsTGlua0luZGV4aW5nKCk7XG5cbiAgICBpZiAoIXRoaXMuc2V0dGluZ3MuZW5hYmxlSW50ZXJuYWxMaW5rQ29tcGxlbWVudCkge1xuICAgICAgdGhpcy5zdGF0dXNCYXIuc2V0SW50ZXJuYWxMaW5rRGlzYWJsZWQoKTtcbiAgICAgIHRoaXMuaW50ZXJuYWxMaW5rV29yZFByb3ZpZGVyLmNsZWFyV29yZHMoKTtcbiAgICAgIHRoaXMuc2hvd0RlYnVnTG9nKCgpID0+XG4gICAgICAgIGJ1aWxkTG9nTWVzc2FnZShcbiAgICAgICAgICBcIvCfkaJTa2lwOiBJbmRleCBpbnRlcm5hbCBsaW5rIHRva2Vuc1wiLFxuICAgICAgICAgIHBlcmZvcm1hbmNlLm5vdygpIC0gc3RhcnRcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmludGVybmFsTGlua1dvcmRQcm92aWRlci5yZWZyZXNoV29yZHMoXG4gICAgICB0aGlzLnNldHRpbmdzLnN1Z2dlc3RJbnRlcm5hbExpbmtXaXRoQWxpYXMsXG4gICAgICB0aGlzLmV4Y2x1ZGVJbnRlcm5hbExpbmtQcmVmaXhQYXRoUGF0dGVybnNcbiAgICApO1xuXG4gICAgdGhpcy5zdGF0dXNCYXIuc2V0SW50ZXJuYWxMaW5rSW5kZXhlZChcbiAgICAgIHRoaXMuaW50ZXJuYWxMaW5rV29yZFByb3ZpZGVyLndvcmRDb3VudFxuICAgICk7XG4gICAgdGhpcy5zaG93RGVidWdMb2coKCkgPT5cbiAgICAgIGJ1aWxkTG9nTWVzc2FnZShcIkluZGV4IGludGVybmFsIGxpbmsgdG9rZW5zXCIsIHBlcmZvcm1hbmNlLm5vdygpIC0gc3RhcnQpXG4gICAgKTtcbiAgfVxuXG4gIHJlZnJlc2hGcm9udE1hdHRlclRva2VucygpOiB2b2lkIHtcbiAgICBjb25zdCBzdGFydCA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgIHRoaXMuc3RhdHVzQmFyLnNldEZyb250TWF0dGVySW5kZXhpbmcoKTtcblxuICAgIGlmICghdGhpcy5zZXR0aW5ncy5lbmFibGVGcm9udE1hdHRlckNvbXBsZW1lbnQpIHtcbiAgICAgIHRoaXMuc3RhdHVzQmFyLnNldEZyb250TWF0dGVyRGlzYWJsZWQoKTtcbiAgICAgIHRoaXMuZnJvbnRNYXR0ZXJXb3JkUHJvdmlkZXIuY2xlYXJXb3JkcygpO1xuICAgICAgdGhpcy5zaG93RGVidWdMb2coKCkgPT5cbiAgICAgICAgYnVpbGRMb2dNZXNzYWdlKFxuICAgICAgICAgIFwi8J+RolNraXA6IEluZGV4IGZyb250IG1hdHRlciB0b2tlbnNcIixcbiAgICAgICAgICBwZXJmb3JtYW5jZS5ub3coKSAtIHN0YXJ0XG4gICAgICAgIClcbiAgICAgICk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5mcm9udE1hdHRlcldvcmRQcm92aWRlci5yZWZyZXNoV29yZHMoKTtcblxuICAgIHRoaXMuc3RhdHVzQmFyLnNldEZyb250TWF0dGVySW5kZXhlZChcbiAgICAgIHRoaXMuZnJvbnRNYXR0ZXJXb3JkUHJvdmlkZXIud29yZENvdW50XG4gICAgKTtcbiAgICB0aGlzLnNob3dEZWJ1Z0xvZygoKSA9PlxuICAgICAgYnVpbGRMb2dNZXNzYWdlKFwiSW5kZXggZnJvbnQgbWF0dGVyIHRva2Vuc1wiLCBwZXJmb3JtYW5jZS5ub3coKSAtIHN0YXJ0KVxuICAgICk7XG4gIH1cblxuICB1cGRhdGVGcm9udE1hdHRlclRva2VuSW5kZXgoZmlsZTogVEZpbGUpOiB2b2lkIHtcbiAgICBjb25zdCBzdGFydCA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgIGlmICghdGhpcy5zZXR0aW5ncy5lbmFibGVGcm9udE1hdHRlckNvbXBsZW1lbnQpIHtcbiAgICAgIHRoaXMuc2hvd0RlYnVnTG9nKCgpID0+XG4gICAgICAgIGJ1aWxkTG9nTWVzc2FnZShcbiAgICAgICAgICBcIvCfkaJTa2lwOiBVcGRhdGUgZnJvbnQgbWF0dGVyIHRva2VuIGluZGV4XCIsXG4gICAgICAgICAgcGVyZm9ybWFuY2Uubm93KCkgLSBzdGFydFxuICAgICAgICApXG4gICAgICApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuZnJvbnRNYXR0ZXJXb3JkUHJvdmlkZXIudXBkYXRlV29yZEluZGV4KGZpbGUpO1xuXG4gICAgdGhpcy5zaG93RGVidWdMb2coKCkgPT5cbiAgICAgIGJ1aWxkTG9nTWVzc2FnZShcbiAgICAgICAgXCJVcGRhdGUgZnJvbnQgbWF0dGVyIHRva2VuIGluZGV4XCIsXG4gICAgICAgIHBlcmZvcm1hbmNlLm5vdygpIC0gc3RhcnRcbiAgICAgIClcbiAgICApO1xuICB9XG5cbiAgdXBkYXRlRnJvbnRNYXR0ZXJUb2tlbigpOiB2b2lkIHtcbiAgICBjb25zdCBzdGFydCA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgIGlmICghdGhpcy5zZXR0aW5ncy5lbmFibGVGcm9udE1hdHRlckNvbXBsZW1lbnQpIHtcbiAgICAgIHRoaXMuc2hvd0RlYnVnTG9nKCgpID0+XG4gICAgICAgIGJ1aWxkTG9nTWVzc2FnZShcbiAgICAgICAgICBcIvCfkaJTa2lwOiBVcGRhdGUgZnJvbnQgbWF0dGVyIHRva2VuXCIsXG4gICAgICAgICAgcGVyZm9ybWFuY2Uubm93KCkgLSBzdGFydFxuICAgICAgICApXG4gICAgICApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuZnJvbnRNYXR0ZXJXb3JkUHJvdmlkZXIudXBkYXRlV29yZHMoKTtcbiAgICB0aGlzLnN0YXR1c0Jhci5zZXRGcm9udE1hdHRlckluZGV4ZWQoXG4gICAgICB0aGlzLmZyb250TWF0dGVyV29yZFByb3ZpZGVyLndvcmRDb3VudFxuICAgICk7XG5cbiAgICB0aGlzLnNob3dEZWJ1Z0xvZygoKSA9PlxuICAgICAgYnVpbGRMb2dNZXNzYWdlKFwiVXBkYXRlIGZyb250IG1hdHRlciB0b2tlblwiLCBwZXJmb3JtYW5jZS5ub3coKSAtIHN0YXJ0KVxuICAgICk7XG4gIH1cblxuICBvblRyaWdnZXIoXG4gICAgY3Vyc29yOiBFZGl0b3JQb3NpdGlvbixcbiAgICBlZGl0b3I6IEVkaXRvcixcbiAgICBmaWxlOiBURmlsZVxuICApOiBFZGl0b3JTdWdnZXN0VHJpZ2dlckluZm8gfCBudWxsIHtcbiAgICBjb25zdCBzdGFydCA9IHBlcmZvcm1hbmNlLm5vdygpO1xuXG4gICAgaWYgKFxuICAgICAgIXRoaXMuc2V0dGluZ3MuY29tcGxlbWVudEF1dG9tYXRpY2FsbHkgJiZcbiAgICAgICF0aGlzLmlzT3BlbiAmJlxuICAgICAgIXRoaXMucnVuTWFudWFsbHlcbiAgICApIHtcbiAgICAgIHRoaXMuc2hvd0RlYnVnTG9nKCgpID0+IFwiRG9uJ3Qgc2hvdyBzdWdnZXN0aW9uc1wiKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGlmIChcbiAgICAgIHRoaXMuc2V0dGluZ3MuZGlzYWJsZVN1Z2dlc3Rpb25zRHVyaW5nSW1lT24gJiZcbiAgICAgIHRoaXMuYXBwSGVscGVyLmlzSU1FT24oKSAmJlxuICAgICAgIXRoaXMucnVuTWFudWFsbHlcbiAgICApIHtcbiAgICAgIHRoaXMuc2hvd0RlYnVnTG9nKCgpID0+IFwiRG9uJ3Qgc2hvdyBzdWdnZXN0aW9ucyBmb3IgSU1FXCIpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgY2wgPSB0aGlzLmFwcEhlbHBlci5nZXRDdXJyZW50TGluZShlZGl0b3IpO1xuICAgIGlmICh0aGlzLnByZXZpb3VzQ3VycmVudExpbmUgPT09IGNsICYmICF0aGlzLnJ1bk1hbnVhbGx5KSB7XG4gICAgICB0aGlzLnByZXZpb3VzQ3VycmVudExpbmUgPSBjbDtcbiAgICAgIHRoaXMuc2hvd0RlYnVnTG9nKFxuICAgICAgICAoKSA9PiBcIkRvbid0IHNob3cgc3VnZ2VzdGlvbnMgYmVjYXVzZSB0aGVyZSBhcmUgbm8gY2hhbmdlc1wiXG4gICAgICApO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHRoaXMucHJldmlvdXNDdXJyZW50TGluZSA9IGNsO1xuXG4gICAgY29uc3QgY3VycmVudExpbmVVbnRpbEN1cnNvciA9XG4gICAgICB0aGlzLmFwcEhlbHBlci5nZXRDdXJyZW50TGluZVVudGlsQ3Vyc29yKGVkaXRvcik7XG4gICAgaWYgKGN1cnJlbnRMaW5lVW50aWxDdXJzb3Iuc3RhcnRzV2l0aChcIi0tLVwiKSkge1xuICAgICAgdGhpcy5zaG93RGVidWdMb2coXG4gICAgICAgICgpID0+XG4gICAgICAgICAgXCJEb24ndCBzaG93IHN1Z2dlc3Rpb25zIGJlY2F1c2UgaXQgc3VwcG9zZXMgZnJvbnQgbWF0dGVyIG9yIGhvcml6b250YWwgbGluZVwiXG4gICAgICApO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmIChcbiAgICAgIGN1cnJlbnRMaW5lVW50aWxDdXJzb3Iuc3RhcnRzV2l0aChcIn5+flwiKSB8fFxuICAgICAgY3VycmVudExpbmVVbnRpbEN1cnNvci5zdGFydHNXaXRoKFwiYGBgXCIpXG4gICAgKSB7XG4gICAgICB0aGlzLnNob3dEZWJ1Z0xvZyhcbiAgICAgICAgKCkgPT4gXCJEb24ndCBzaG93IHN1Z2dlc3Rpb25zIGJlY2F1c2UgaXQgc3VwcG9zZXMgZnJvbnQgY29kZSBibG9ja1wiXG4gICAgICApO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgdG9rZW5zID0gdGhpcy50b2tlbml6ZXIudG9rZW5pemUoY3VycmVudExpbmVVbnRpbEN1cnNvciwgdHJ1ZSk7XG4gICAgdGhpcy5zaG93RGVidWdMb2coKCkgPT4gYFtvblRyaWdnZXJdIHRva2VucyBpcyAke3Rva2Vuc31gKTtcblxuICAgIGNvbnN0IHRva2VuaXplZCA9IHRoaXMudG9rZW5pemVyLnJlY3Vyc2l2ZVRva2VuaXplKGN1cnJlbnRMaW5lVW50aWxDdXJzb3IpO1xuICAgIGNvbnN0IGN1cnJlbnRUb2tlbnMgPSB0b2tlbml6ZWQuc2xpY2UoXG4gICAgICB0b2tlbml6ZWQubGVuZ3RoID4gdGhpcy5zZXR0aW5ncy5tYXhOdW1iZXJPZldvcmRzQXNQaHJhc2VcbiAgICAgICAgPyB0b2tlbml6ZWQubGVuZ3RoIC0gdGhpcy5zZXR0aW5ncy5tYXhOdW1iZXJPZldvcmRzQXNQaHJhc2VcbiAgICAgICAgOiAwXG4gICAgKTtcbiAgICB0aGlzLnNob3dEZWJ1Z0xvZyhcbiAgICAgICgpID0+IGBbb25UcmlnZ2VyXSBjdXJyZW50VG9rZW5zIGlzICR7SlNPTi5zdHJpbmdpZnkoY3VycmVudFRva2Vucyl9YFxuICAgICk7XG5cbiAgICBjb25zdCBjdXJyZW50VG9rZW4gPSBjdXJyZW50VG9rZW5zWzBdPy53b3JkO1xuICAgIHRoaXMuc2hvd0RlYnVnTG9nKCgpID0+IGBbb25UcmlnZ2VyXSBjdXJyZW50VG9rZW4gaXMgJHtjdXJyZW50VG9rZW59YCk7XG4gICAgaWYgKCFjdXJyZW50VG9rZW4pIHtcbiAgICAgIHRoaXMucnVuTWFudWFsbHkgPSBmYWxzZTtcbiAgICAgIHRoaXMuc2hvd0RlYnVnTG9nKFxuICAgICAgICAoKSA9PiBgRG9uJ3Qgc2hvdyBzdWdnZXN0aW9ucyBiZWNhdXNlIGN1cnJlbnRUb2tlbiBpcyBlbXB0eWBcbiAgICAgICk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBjdXJyZW50VG9rZW5TZXBhcmF0ZWRXaGl0ZVNwYWNlID1cbiAgICAgIGN1cnJlbnRMaW5lVW50aWxDdXJzb3Iuc3BsaXQoXCIgXCIpLmxhc3QoKSA/PyBcIlwiO1xuICAgIGlmIChcbiAgICAgIG5ldyBSZWdFeHAoYF5bJHt0aGlzLnNldHRpbmdzLmZpcnN0Q2hhcmFjdGVyc0Rpc2FibGVTdWdnZXN0aW9uc31dYCkudGVzdChcbiAgICAgICAgY3VycmVudFRva2VuU2VwYXJhdGVkV2hpdGVTcGFjZVxuICAgICAgKVxuICAgICkge1xuICAgICAgdGhpcy5ydW5NYW51YWxseSA9IGZhbHNlO1xuICAgICAgdGhpcy5zaG93RGVidWdMb2coXG4gICAgICAgICgpID0+XG4gICAgICAgICAgYERvbid0IHNob3cgc3VnZ2VzdGlvbnMgZm9yIGF2b2lkaW5nIHRvIGNvbmZsaWN0IHdpdGggdGhlIG90aGVyIGNvbW1hbmRzLmBcbiAgICAgICk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAoXG4gICAgICBjdXJyZW50VG9rZW4ubGVuZ3RoID09PSAxICYmXG4gICAgICBCb29sZWFuKGN1cnJlbnRUb2tlbi5tYXRjaCh0aGlzLnRva2VuaXplci5nZXRUcmltUGF0dGVybigpKSlcbiAgICApIHtcbiAgICAgIHRoaXMucnVuTWFudWFsbHkgPSBmYWxzZTtcbiAgICAgIHRoaXMuc2hvd0RlYnVnTG9nKFxuICAgICAgICAoKSA9PiBgRG9uJ3Qgc2hvdyBzdWdnZXN0aW9ucyBiZWNhdXNlIGN1cnJlbnRUb2tlbiBpcyBUUklNX1BBVFRFUk5gXG4gICAgICApO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgY3VycmVudEZyb250TWF0dGVyID0gdGhpcy5zZXR0aW5ncy5lbmFibGVGcm9udE1hdHRlckNvbXBsZW1lbnRcbiAgICAgID8gdGhpcy5hcHBIZWxwZXIuZ2V0Q3VycmVudEZyb250TWF0dGVyKClcbiAgICAgIDogbnVsbDtcbiAgICB0aGlzLnNob3dEZWJ1Z0xvZygoKSA9PiBgQ3VycmVudCBmcm9udCBtYXR0ZXIgaXMgJHtjdXJyZW50RnJvbnRNYXR0ZXJ9YCk7XG5cbiAgICBpZiAoIXRoaXMucnVuTWFudWFsbHkgJiYgIWN1cnJlbnRGcm9udE1hdHRlcikge1xuICAgICAgaWYgKGN1cnJlbnRUb2tlbi5sZW5ndGggPCB0aGlzLm1pbk51bWJlclRyaWdnZXJlZCkge1xuICAgICAgICB0aGlzLnNob3dEZWJ1Z0xvZyhcbiAgICAgICAgICAoKSA9PlxuICAgICAgICAgICAgXCJEb24ndCBzaG93IHN1Z2dlc3Rpb25zIGJlY2F1c2UgY3VycmVudFRva2VuIGlzIGxlc3MgdGhhbiBtaW5OdW1iZXJUcmlnZ2VyZWQgb3B0aW9uXCJcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy50b2tlbml6ZXIuc2hvdWxkSWdub3JlKGN1cnJlbnRUb2tlbikpIHtcbiAgICAgICAgdGhpcy5zaG93RGVidWdMb2coXG4gICAgICAgICAgKCkgPT4gXCJEb24ndCBzaG93IHN1Z2dlc3Rpb25zIGJlY2F1c2UgY3VycmVudFRva2VuIHNob3VsZCBpZ25vcmVkXCJcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5zaG93RGVidWdMb2coKCkgPT5cbiAgICAgIGJ1aWxkTG9nTWVzc2FnZShcIm9uVHJpZ2dlclwiLCBwZXJmb3JtYW5jZS5ub3coKSAtIHN0YXJ0KVxuICAgICk7XG4gICAgdGhpcy5ydW5NYW51YWxseSA9IGZhbHNlO1xuXG4gICAgLy8gSGFjayBpbXBsZW1lbnRhdGlvbiBmb3IgRnJvbnQgbWF0dGVyIGNvbXBsZW1lbnRcbiAgICBpZiAoY3VycmVudEZyb250TWF0dGVyICYmIGN1cnJlbnRUb2tlbnMubGFzdCgpPy53b3JkLm1hdGNoKC9bXiBdICQvKSkge1xuICAgICAgY3VycmVudFRva2Vucy5wdXNoKHsgd29yZDogXCJcIiwgb2Zmc2V0OiBjdXJyZW50TGluZVVudGlsQ3Vyc29yLmxlbmd0aCB9KTtcbiAgICB9XG5cbiAgICAvLyBGb3IgbXVsdGktd29yZCBjb21wbGV0aW9uXG4gICAgdGhpcy5jb250ZXh0U3RhcnRDaCA9IGN1cnNvci5jaCAtIGN1cnJlbnRUb2tlbi5sZW5ndGg7XG4gICAgcmV0dXJuIHtcbiAgICAgIHN0YXJ0OiB7XG4gICAgICAgIGNoOiBjdXJzb3IuY2ggLSAoY3VycmVudFRva2Vucy5sYXN0KCk/LndvcmQ/Lmxlbmd0aCA/PyAwKSwgLy8gRm9yIG11bHRpLXdvcmQgY29tcGxldGlvblxuICAgICAgICBsaW5lOiBjdXJzb3IubGluZSxcbiAgICAgIH0sXG4gICAgICBlbmQ6IGN1cnNvcixcbiAgICAgIHF1ZXJ5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgIGN1cnJlbnRGcm9udE1hdHRlcixcbiAgICAgICAgcXVlcmllczogY3VycmVudFRva2Vucy5tYXAoKHgpID0+ICh7XG4gICAgICAgICAgLi4ueCxcbiAgICAgICAgICBvZmZzZXQ6IHgub2Zmc2V0IC0gY3VycmVudFRva2Vuc1swXS5vZmZzZXQsXG4gICAgICAgIH0pKSxcbiAgICAgIH0pLFxuICAgIH07XG4gIH1cblxuICBnZXRTdWdnZXN0aW9ucyhjb250ZXh0OiBFZGl0b3JTdWdnZXN0Q29udGV4dCk6IFdvcmRbXSB8IFByb21pc2U8V29yZFtdPiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICB0aGlzLmRlYm91bmNlR2V0U3VnZ2VzdGlvbnMoY29udGV4dCwgKHdvcmRzKSA9PiB7XG4gICAgICAgIHJlc29sdmUod29yZHMpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICByZW5kZXJTdWdnZXN0aW9uKHdvcmQ6IFdvcmQsIGVsOiBIVE1MRWxlbWVudCk6IHZvaWQge1xuICAgIGNvbnN0IGJhc2UgPSBjcmVhdGVEaXYoKTtcblxuICAgIGxldCB0ZXh0ID0gd29yZC52YWx1ZTtcbiAgICBpZiAoXG4gICAgICB3b3JkLnR5cGUgPT09IFwiY3VzdG9tRGljdGlvbmFyeVwiICYmXG4gICAgICB3b3JkLmluc2VydGVkVGV4dCAmJlxuICAgICAgdGhpcy5zZXR0aW5ncy5kaXNwbGF5ZWRUZXh0U3VmZml4XG4gICAgKSB7XG4gICAgICB0ZXh0ICs9IHRoaXMuc2V0dGluZ3MuZGlzcGxheWVkVGV4dFN1ZmZpeDtcbiAgICB9XG5cbiAgICBiYXNlLmNyZWF0ZURpdih7XG4gICAgICB0ZXh0LFxuICAgICAgY2xzOlxuICAgICAgICB3b3JkLnR5cGUgPT09IFwiaW50ZXJuYWxMaW5rXCIgJiYgd29yZC5hbGlhc01ldGFcbiAgICAgICAgICA/IFwidmFyaW91cy1jb21wbGVtZW50c19fc3VnZ2VzdGlvbi1pdGVtX19jb250ZW50X19hbGlhc1wiXG4gICAgICAgICAgOiB1bmRlZmluZWQsXG4gICAgfSk7XG5cbiAgICBjb25zdCBkZXNjcmlwdGlvbiA9IHRoaXMuZGVzY3JpcHRpb25PblN1Z2dlc3Rpb24udG9EaXNwbGF5KHdvcmQpO1xuICAgIGlmIChkZXNjcmlwdGlvbikge1xuICAgICAgYmFzZS5jcmVhdGVEaXYoe1xuICAgICAgICBjbHM6IFwidmFyaW91cy1jb21wbGVtZW50c19fc3VnZ2VzdGlvbi1pdGVtX19kZXNjcmlwdGlvblwiLFxuICAgICAgICB0ZXh0OiBgJHtkZXNjcmlwdGlvbn1gLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgZWwuYXBwZW5kQ2hpbGQoYmFzZSk7XG5cbiAgICBlbC5hZGRDbGFzcyhcInZhcmlvdXMtY29tcGxlbWVudHNfX3N1Z2dlc3Rpb24taXRlbVwiKTtcbiAgICBzd2l0Y2ggKHdvcmQudHlwZSkge1xuICAgICAgY2FzZSBcImN1cnJlbnRGaWxlXCI6XG4gICAgICAgIGVsLmFkZENsYXNzKFwidmFyaW91cy1jb21wbGVtZW50c19fc3VnZ2VzdGlvbi1pdGVtX19jdXJyZW50LWZpbGVcIik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImN1cnJlbnRWYXVsdFwiOlxuICAgICAgICBlbC5hZGRDbGFzcyhcInZhcmlvdXMtY29tcGxlbWVudHNfX3N1Z2dlc3Rpb24taXRlbV9fY3VycmVudC12YXVsdFwiKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiY3VzdG9tRGljdGlvbmFyeVwiOlxuICAgICAgICBlbC5hZGRDbGFzcyhcInZhcmlvdXMtY29tcGxlbWVudHNfX3N1Z2dlc3Rpb24taXRlbV9fY3VzdG9tLWRpY3Rpb25hcnlcIik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImludGVybmFsTGlua1wiOlxuICAgICAgICBlbC5hZGRDbGFzcyhcInZhcmlvdXMtY29tcGxlbWVudHNfX3N1Z2dlc3Rpb24taXRlbV9faW50ZXJuYWwtbGlua1wiKTtcbiAgICAgICAgaWYgKHdvcmQucGhhbnRvbSkge1xuICAgICAgICAgIGVsLmFkZENsYXNzKFwidmFyaW91cy1jb21wbGVtZW50c19fc3VnZ2VzdGlvbi1pdGVtX19waGFudG9tXCIpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImZyb250TWF0dGVyXCI6XG4gICAgICAgIGVsLmFkZENsYXNzKFwidmFyaW91cy1jb21wbGVtZW50c19fc3VnZ2VzdGlvbi1pdGVtX19mcm9udC1tYXR0ZXJcIik7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHNlbGVjdFN1Z2dlc3Rpb24od29yZDogV29yZCwgZXZ0OiBNb3VzZUV2ZW50IHwgS2V5Ym9hcmRFdmVudCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5jb250ZXh0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IGluc2VydGVkVGV4dCA9IHdvcmQudmFsdWU7XG4gICAgaWYgKHdvcmQudHlwZSA9PT0gXCJpbnRlcm5hbExpbmtcIikge1xuICAgICAgaW5zZXJ0ZWRUZXh0ID1cbiAgICAgICAgdGhpcy5zZXR0aW5ncy5zdWdnZXN0SW50ZXJuYWxMaW5rV2l0aEFsaWFzICYmIHdvcmQuYWxpYXNNZXRhXG4gICAgICAgICAgPyBgW1ske3RoaXMuYXBwSGVscGVyLm9wdGltaXplTWFya2Rvd25MaW5rVGV4dChcbiAgICAgICAgICAgICAgd29yZC5hbGlhc01ldGEub3JpZ2luXG4gICAgICAgICAgICApfXwke3dvcmQudmFsdWV9XV1gXG4gICAgICAgICAgOiBgW1ske3RoaXMuYXBwSGVscGVyLm9wdGltaXplTWFya2Rvd25MaW5rVGV4dCh3b3JkLnZhbHVlKX1dXWA7XG4gICAgfVxuXG4gICAgaWYgKFxuICAgICAgd29yZC50eXBlID09PSBcImZyb250TWF0dGVyXCIgJiZcbiAgICAgIHRoaXMuc2V0dGluZ3MuaW5zZXJ0Q29tbWFBZnRlckZyb250TWF0dGVyQ29tcGxldGlvblxuICAgICkge1xuICAgICAgaW5zZXJ0ZWRUZXh0ID0gYCR7aW5zZXJ0ZWRUZXh0fSwgYDtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKFxuICAgICAgICB0aGlzLnNldHRpbmdzLmluc2VydEFmdGVyQ29tcGxldGlvbiAmJlxuICAgICAgICAhKHdvcmQudHlwZSA9PT0gXCJjdXN0b21EaWN0aW9uYXJ5XCIgJiYgd29yZC5pZ25vcmVTcGFjZUFmdGVyQ29tcGxldGlvbilcbiAgICAgICkge1xuICAgICAgICBpbnNlcnRlZFRleHQgPSBgJHtpbnNlcnRlZFRleHR9IGA7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbGV0IHBvc2l0aW9uVG9Nb3ZlID0gLTE7XG5cbiAgICBpZiAod29yZC50eXBlID09PSBcImN1c3RvbURpY3Rpb25hcnlcIikge1xuICAgICAgaWYgKHdvcmQuaW5zZXJ0ZWRUZXh0KSB7XG4gICAgICAgIGluc2VydGVkVGV4dCA9IHdvcmQuaW5zZXJ0ZWRUZXh0O1xuICAgICAgfVxuXG4gICAgICBjb25zdCBjYXJldCA9IHdvcmQuY2FyZXRTeW1ib2w7XG4gICAgICBpZiAoY2FyZXQpIHtcbiAgICAgICAgcG9zaXRpb25Ub01vdmUgPSBpbnNlcnRlZFRleHQuaW5kZXhPZihjYXJldCk7XG4gICAgICAgIGluc2VydGVkVGV4dCA9IGluc2VydGVkVGV4dC5yZXBsYWNlKGNhcmV0LCBcIlwiKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBlZGl0b3IgPSB0aGlzLmNvbnRleHQuZWRpdG9yO1xuICAgIGVkaXRvci5yZXBsYWNlUmFuZ2UoXG4gICAgICBpbnNlcnRlZFRleHQsXG4gICAgICB7XG4gICAgICAgIC4uLnRoaXMuY29udGV4dC5zdGFydCxcbiAgICAgICAgY2g6IHRoaXMuY29udGV4dFN0YXJ0Q2ggKyB3b3JkLm9mZnNldCEsXG4gICAgICB9LFxuICAgICAgdGhpcy5jb250ZXh0LmVuZFxuICAgICk7XG5cbiAgICBpZiAocG9zaXRpb25Ub01vdmUgIT09IC0xKSB7XG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yKFxuICAgICAgICBlZGl0b3Iub2Zmc2V0VG9Qb3MoXG4gICAgICAgICAgZWRpdG9yLnBvc1RvT2Zmc2V0KGVkaXRvci5nZXRDdXJzb3IoKSkgLVxuICAgICAgICAgICAgaW5zZXJ0ZWRUZXh0Lmxlbmd0aCArXG4gICAgICAgICAgICBwb3NpdGlvblRvTW92ZVxuICAgICAgICApXG4gICAgICApO1xuICAgIH1cblxuICAgIC8vIFRoZSB3b3JrYXJvdW5kIG9mIHN0cmFuZ2UgYmVoYXZpb3IgZm9yIHRoYXQgY3Vyc29yIGRvZXNuJ3QgbW92ZSBhZnRlciBjb21wbGV0aW9uIG9ubHkgaWYgaXQgZG9lc24ndCBpbnB1dCBhbnkgd29yZC5cbiAgICBpZiAoXG4gICAgICB0aGlzLmFwcEhlbHBlci5lcXVhbHNBc0VkaXRvclBvc3Rpb24odGhpcy5jb250ZXh0LnN0YXJ0LCB0aGlzLmNvbnRleHQuZW5kKVxuICAgICkge1xuICAgICAgZWRpdG9yLnNldEN1cnNvcihcbiAgICAgICAgZWRpdG9yLm9mZnNldFRvUG9zKFxuICAgICAgICAgIGVkaXRvci5wb3NUb09mZnNldChlZGl0b3IuZ2V0Q3Vyc29yKCkpICsgaW5zZXJ0ZWRUZXh0Lmxlbmd0aFxuICAgICAgICApXG4gICAgICApO1xuICAgIH1cblxuICAgIHRoaXMuc2VsZWN0aW9uSGlzdG9yeVN0b3JhZ2U/LmluY3JlbWVudCh3b3JkIGFzIEhpdFdvcmQpO1xuICAgIGlmICh0aGlzLnNldHRpbmdzLnNob3dMb2dBYm91dFBlcmZvcm1hbmNlSW5Db25zb2xlKSB7XG4gICAgICBjb25zb2xlLmxvZyhcIi0tLSBoaXN0b3J5IC0tLVwiKTtcbiAgICAgIGNvbnNvbGUubG9nKHRoaXMuc2VsZWN0aW9uSGlzdG9yeVN0b3JhZ2U/LmRhdGEpO1xuICAgIH1cblxuICAgIHRoaXMuY2xvc2UoKTtcbiAgICB0aGlzLmRlYm91bmNlQ2xvc2UoKTtcbiAgfVxuXG4gIHByaXZhdGUgc2hvd0RlYnVnTG9nKHRvTWVzc2FnZTogKCkgPT4gc3RyaW5nKSB7XG4gICAgaWYgKHRoaXMuc2V0dGluZ3Muc2hvd0xvZ0Fib3V0UGVyZm9ybWFuY2VJbkNvbnNvbGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKHRvTWVzc2FnZSgpKTtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCB7IEFwcCwgTm90aWNlLCBQbHVnaW5TZXR0aW5nVGFiLCBTZXR0aW5nIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgdHlwZSBWYXJpb3VzQ29tcG9uZW50cyBmcm9tIFwiLi4vbWFpblwiO1xuaW1wb3J0IHsgVG9rZW5pemVTdHJhdGVneSB9IGZyb20gXCIuLi90b2tlbml6ZXIvVG9rZW5pemVTdHJhdGVneVwiO1xuaW1wb3J0IHsgTWF0Y2hTdHJhdGVneSB9IGZyb20gXCIuLi9wcm92aWRlci9NYXRjaFN0cmF0ZWd5XCI7XG5pbXBvcnQgeyBDeWNsZVRocm91Z2hTdWdnZXN0aW9uc0tleXMgfSBmcm9tIFwiLi4vb3B0aW9uL0N5Y2xlVGhyb3VnaFN1Z2dlc3Rpb25zS2V5c1wiO1xuaW1wb3J0IHsgQ29sdW1uRGVsaW1pdGVyIH0gZnJvbSBcIi4uL29wdGlvbi9Db2x1bW5EZWxpbWl0ZXJcIjtcbmltcG9ydCB7IFNlbGVjdFN1Z2dlc3Rpb25LZXkgfSBmcm9tIFwiLi4vb3B0aW9uL1NlbGVjdFN1Z2dlc3Rpb25LZXlcIjtcbmltcG9ydCB7IG1pcnJvck1hcCB9IGZyb20gXCIuLi91dGlsL2NvbGxlY3Rpb24taGVscGVyXCI7XG5pbXBvcnQgeyBPcGVuU291cmNlRmlsZUtleXMgfSBmcm9tIFwiLi4vb3B0aW9uL09wZW5Tb3VyY2VGaWxlS2V5c1wiO1xuaW1wb3J0IHsgRGVzY3JpcHRpb25PblN1Z2dlc3Rpb24gfSBmcm9tIFwiLi4vb3B0aW9uL0Rlc2NyaXB0aW9uT25TdWdnZXN0aW9uXCI7XG5pbXBvcnQgeyBTcGVjaWZpY01hdGNoU3RyYXRlZ3kgfSBmcm9tIFwiLi4vcHJvdmlkZXIvU3BlY2lmaWNNYXRjaFN0cmF0ZWd5XCI7XG5pbXBvcnQgdHlwZSB7IFNlbGVjdGlvbkhpc3RvcnlUcmVlIH0gZnJvbSBcIi4uL3N0b3JhZ2UvU2VsZWN0aW9uSGlzdG9yeVN0b3JhZ2VcIjtcblxuZXhwb3J0IGludGVyZmFjZSBTZXR0aW5ncyB7XG4gIC8vIGdlbmVyYWxcbiAgc3RyYXRlZ3k6IHN0cmluZztcbiAgbWF0Y2hTdHJhdGVneTogc3RyaW5nO1xuICBtYXhOdW1iZXJPZlN1Z2dlc3Rpb25zOiBudW1iZXI7XG4gIG1heE51bWJlck9mV29yZHNBc1BocmFzZTogbnVtYmVyO1xuICBtaW5OdW1iZXJPZkNoYXJhY3RlcnNUcmlnZ2VyZWQ6IG51bWJlcjtcbiAgbWluTnVtYmVyT2ZXb3Jkc1RyaWdnZXJlZFBocmFzZTogbnVtYmVyO1xuICBjb21wbGVtZW50QXV0b21hdGljYWxseTogYm9vbGVhbjtcbiAgZGVsYXlNaWxsaVNlY29uZHM6IG51bWJlcjtcbiAgZGlzYWJsZVN1Z2dlc3Rpb25zRHVyaW5nSW1lT246IGJvb2xlYW47XG4gIC8vIEZJWE1FOiBSZW5hbWUgYXQgbmV4dCBtYWpvciB2ZXJzaW9uIHVwXG4gIGluc2VydEFmdGVyQ29tcGxldGlvbjogYm9vbGVhbjtcbiAgZmlyc3RDaGFyYWN0ZXJzRGlzYWJsZVN1Z2dlc3Rpb25zOiBzdHJpbmc7XG5cbiAgLy8gYXBwZWFyYW5jZVxuICBzaG93TWF0Y2hTdHJhdGVneTogYm9vbGVhbjtcbiAgc2hvd0NvbXBsZW1lbnRBdXRvbWF0aWNhbGx5OiBib29sZWFuO1xuICBzaG93SW5kZXhpbmdTdGF0dXM6IGJvb2xlYW47XG4gIGRlc2NyaXB0aW9uT25TdWdnZXN0aW9uOiBzdHJpbmc7XG5cbiAgLy8ga2V5IGN1c3RvbWl6YXRpb25cbiAgc2VsZWN0U3VnZ2VzdGlvbktleXM6IHN0cmluZztcbiAgYWRkaXRpb25hbEN5Y2xlVGhyb3VnaFN1Z2dlc3Rpb25zS2V5czogc3RyaW5nO1xuICBkaXNhYmxlVXBEb3duS2V5c0ZvckN5Y2xlVGhyb3VnaFN1Z2dlc3Rpb25zS2V5czogYm9vbGVhbjtcbiAgb3BlblNvdXJjZUZpbGVLZXk6IHN0cmluZztcbiAgcHJvcGFnYXRlRXNjOiBib29sZWFuO1xuXG4gIC8vIGN1cnJlbnQgZmlsZSBjb21wbGVtZW50XG4gIGVuYWJsZUN1cnJlbnRGaWxlQ29tcGxlbWVudDogYm9vbGVhbjtcbiAgY3VycmVudEZpbGVNaW5OdW1iZXJPZkNoYXJhY3RlcnM6IG51bWJlcjtcbiAgb25seUNvbXBsZW1lbnRFbmdsaXNoT25DdXJyZW50RmlsZUNvbXBsZW1lbnQ6IGJvb2xlYW47XG5cbiAgLy8gY3VycmVudCB2YXVsdCBjb21wbGVtZW50XG4gIGVuYWJsZUN1cnJlbnRWYXVsdENvbXBsZW1lbnQ6IGJvb2xlYW47XG4gIGN1cnJlbnRWYXVsdE1pbk51bWJlck9mQ2hhcmFjdGVyczogbnVtYmVyO1xuICBpbmNsdWRlQ3VycmVudFZhdWx0UGF0aFByZWZpeFBhdHRlcm5zOiBzdHJpbmc7XG4gIGV4Y2x1ZGVDdXJyZW50VmF1bHRQYXRoUHJlZml4UGF0dGVybnM6IHN0cmluZztcbiAgaW5jbHVkZUN1cnJlbnRWYXVsdE9ubHlGaWxlc1VuZGVyQ3VycmVudERpcmVjdG9yeTogYm9vbGVhbjtcblxuICAvLyBjdXN0b20gZGljdGlvbmFyeSBjb21wbGVtZW50XG4gIGVuYWJsZUN1c3RvbURpY3Rpb25hcnlDb21wbGVtZW50OiBib29sZWFuO1xuICBjdXN0b21EaWN0aW9uYXJ5UGF0aHM6IHN0cmluZztcbiAgY29sdW1uRGVsaW1pdGVyOiBzdHJpbmc7XG4gIGN1c3RvbURpY3Rpb25hcnlXb3JkUmVnZXhQYXR0ZXJuOiBzdHJpbmc7XG4gIGRlbGltaXRlclRvSGlkZVN1Z2dlc3Rpb246IHN0cmluZztcbiAgZGVsaW1pdGVyVG9EaXZpZGVTdWdnZXN0aW9uc0ZvckRpc3BsYXlGcm9tSW5zZXJ0aW9uOiBzdHJpbmc7XG4gIGNhcmV0TG9jYXRpb25TeW1ib2xBZnRlckNvbXBsZW1lbnQ6IHN0cmluZztcbiAgZGlzcGxheWVkVGV4dFN1ZmZpeDogc3RyaW5nO1xuXG4gIC8vIGludGVybmFsIGxpbmsgY29tcGxlbWVudFxuICBlbmFibGVJbnRlcm5hbExpbmtDb21wbGVtZW50OiBib29sZWFuO1xuICBzdWdnZXN0SW50ZXJuYWxMaW5rV2l0aEFsaWFzOiBib29sZWFuO1xuICBleGNsdWRlSW50ZXJuYWxMaW5rUGF0aFByZWZpeFBhdHRlcm5zOiBzdHJpbmc7XG5cbiAgLy8gZnJvbnQgbWF0dGVyIGNvbXBsZW1lbnRcbiAgZW5hYmxlRnJvbnRNYXR0ZXJDb21wbGVtZW50OiBib29sZWFuO1xuICBmcm9udE1hdHRlckNvbXBsZW1lbnRNYXRjaFN0cmF0ZWd5OiBzdHJpbmc7XG4gIGluc2VydENvbW1hQWZ0ZXJGcm9udE1hdHRlckNvbXBsZXRpb246IGJvb2xlYW47XG5cbiAgLy8gZGVidWdcbiAgc2hvd0xvZ0Fib3V0UGVyZm9ybWFuY2VJbkNvbnNvbGU6IGJvb2xlYW47XG5cbiAgLy8gb3RoZXJzXG4gIHNlbGVjdGlvbkhpc3RvcnlUcmVlOiBTZWxlY3Rpb25IaXN0b3J5VHJlZTtcbn1cblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfU0VUVElOR1M6IFNldHRpbmdzID0ge1xuICAvLyBnZW5lcmFsXG4gIHN0cmF0ZWd5OiBcImRlZmF1bHRcIixcbiAgbWF0Y2hTdHJhdGVneTogXCJwcmVmaXhcIixcblxuICBtYXhOdW1iZXJPZlN1Z2dlc3Rpb25zOiA1LFxuICBtYXhOdW1iZXJPZldvcmRzQXNQaHJhc2U6IDMsXG4gIG1pbk51bWJlck9mQ2hhcmFjdGVyc1RyaWdnZXJlZDogMCxcbiAgbWluTnVtYmVyT2ZXb3Jkc1RyaWdnZXJlZFBocmFzZTogMSxcbiAgY29tcGxlbWVudEF1dG9tYXRpY2FsbHk6IHRydWUsXG4gIGRlbGF5TWlsbGlTZWNvbmRzOiAwLFxuICBkaXNhYmxlU3VnZ2VzdGlvbnNEdXJpbmdJbWVPbjogZmFsc2UsXG4gIGluc2VydEFmdGVyQ29tcGxldGlvbjogdHJ1ZSxcbiAgZmlyc3RDaGFyYWN0ZXJzRGlzYWJsZVN1Z2dlc3Rpb25zOiBcIjovXlwiLFxuXG4gIC8vIGFwcGVhcmFuY2VcbiAgc2hvd01hdGNoU3RyYXRlZ3k6IHRydWUsXG4gIHNob3dDb21wbGVtZW50QXV0b21hdGljYWxseTogdHJ1ZSxcbiAgc2hvd0luZGV4aW5nU3RhdHVzOiB0cnVlLFxuICBkZXNjcmlwdGlvbk9uU3VnZ2VzdGlvbjogXCJTaG9ydFwiLFxuXG4gIC8vIGtleSBjdXN0b21pemF0aW9uXG4gIHNlbGVjdFN1Z2dlc3Rpb25LZXlzOiBcIkVudGVyXCIsXG4gIGFkZGl0aW9uYWxDeWNsZVRocm91Z2hTdWdnZXN0aW9uc0tleXM6IFwiTm9uZVwiLFxuICBkaXNhYmxlVXBEb3duS2V5c0ZvckN5Y2xlVGhyb3VnaFN1Z2dlc3Rpb25zS2V5czogZmFsc2UsXG4gIG9wZW5Tb3VyY2VGaWxlS2V5OiBcIk5vbmVcIixcbiAgcHJvcGFnYXRlRXNjOiBmYWxzZSxcblxuICAvLyBjdXJyZW50IGZpbGUgY29tcGxlbWVudFxuICBlbmFibGVDdXJyZW50RmlsZUNvbXBsZW1lbnQ6IHRydWUsXG4gIGN1cnJlbnRGaWxlTWluTnVtYmVyT2ZDaGFyYWN0ZXJzOiAwLFxuICBvbmx5Q29tcGxlbWVudEVuZ2xpc2hPbkN1cnJlbnRGaWxlQ29tcGxlbWVudDogZmFsc2UsXG5cbiAgLy8gY3VycmVudCB2YXVsdCBjb21wbGVtZW50XG4gIGVuYWJsZUN1cnJlbnRWYXVsdENvbXBsZW1lbnQ6IGZhbHNlLFxuICBjdXJyZW50VmF1bHRNaW5OdW1iZXJPZkNoYXJhY3RlcnM6IDAsXG4gIGluY2x1ZGVDdXJyZW50VmF1bHRQYXRoUHJlZml4UGF0dGVybnM6IFwiXCIsXG4gIGV4Y2x1ZGVDdXJyZW50VmF1bHRQYXRoUHJlZml4UGF0dGVybnM6IFwiXCIsXG4gIGluY2x1ZGVDdXJyZW50VmF1bHRPbmx5RmlsZXNVbmRlckN1cnJlbnREaXJlY3Rvcnk6IGZhbHNlLFxuXG4gIC8vIGN1c3RvbSBkaWN0aW9uYXJ5IGNvbXBsZW1lbnRcbiAgZW5hYmxlQ3VzdG9tRGljdGlvbmFyeUNvbXBsZW1lbnQ6IGZhbHNlLFxuICBjdXN0b21EaWN0aW9uYXJ5UGF0aHM6IGBodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vZmlyc3QyMGhvdXJzL2dvb2dsZS0xMDAwMC1lbmdsaXNoL21hc3Rlci9nb29nbGUtMTAwMDAtZW5nbGlzaC1uby1zd2VhcnMudHh0YCxcbiAgY29sdW1uRGVsaW1pdGVyOiBcIlRhYlwiLFxuICBjdXN0b21EaWN0aW9uYXJ5V29yZFJlZ2V4UGF0dGVybjogXCJcIixcbiAgZGVsaW1pdGVyVG9IaWRlU3VnZ2VzdGlvbjogXCJcIixcbiAgZGVsaW1pdGVyVG9EaXZpZGVTdWdnZXN0aW9uc0ZvckRpc3BsYXlGcm9tSW5zZXJ0aW9uOiBcIlwiLFxuICBjYXJldExvY2F0aW9uU3ltYm9sQWZ0ZXJDb21wbGVtZW50OiBcIlwiLFxuICBkaXNwbGF5ZWRUZXh0U3VmZml4OiBcIiA9PiAuLi5cIixcblxuICAvLyBpbnRlcm5hbCBsaW5rIGNvbXBsZW1lbnRcbiAgZW5hYmxlSW50ZXJuYWxMaW5rQ29tcGxlbWVudDogdHJ1ZSxcbiAgc3VnZ2VzdEludGVybmFsTGlua1dpdGhBbGlhczogZmFsc2UsXG4gIGV4Y2x1ZGVJbnRlcm5hbExpbmtQYXRoUHJlZml4UGF0dGVybnM6IFwiXCIsXG5cbiAgLy8gZnJvbnQgbWF0dGVyIGNvbXBsZW1lbnRcbiAgZW5hYmxlRnJvbnRNYXR0ZXJDb21wbGVtZW50OiB0cnVlLFxuICBmcm9udE1hdHRlckNvbXBsZW1lbnRNYXRjaFN0cmF0ZWd5OiBcImluaGVyaXRcIixcbiAgaW5zZXJ0Q29tbWFBZnRlckZyb250TWF0dGVyQ29tcGxldGlvbjogZmFsc2UsXG5cbiAgLy8gZGVidWdcbiAgc2hvd0xvZ0Fib3V0UGVyZm9ybWFuY2VJbkNvbnNvbGU6IGZhbHNlLFxuXG4gIC8vIG90aGVyc1xuICBzZWxlY3Rpb25IaXN0b3J5VHJlZToge30sXG59O1xuXG5leHBvcnQgY2xhc3MgVmFyaW91c0NvbXBsZW1lbnRzU2V0dGluZ1RhYiBleHRlbmRzIFBsdWdpblNldHRpbmdUYWIge1xuICBwbHVnaW46IFZhcmlvdXNDb21wb25lbnRzO1xuXG4gIGNvbnN0cnVjdG9yKGFwcDogQXBwLCBwbHVnaW46IFZhcmlvdXNDb21wb25lbnRzKSB7XG4gICAgc3VwZXIoYXBwLCBwbHVnaW4pO1xuICAgIHRoaXMucGx1Z2luID0gcGx1Z2luO1xuICB9XG5cbiAgZGlzcGxheSgpOiB2b2lkIHtcbiAgICBsZXQgeyBjb250YWluZXJFbCB9ID0gdGhpcztcblxuICAgIGNvbnRhaW5lckVsLmVtcHR5KCk7XG5cbiAgICBjb250YWluZXJFbC5jcmVhdGVFbChcImgyXCIsIHsgdGV4dDogXCJWYXJpb3VzIENvbXBsZW1lbnRzIC0gU2V0dGluZ3NcIiB9KTtcbiAgICB0aGlzLmFkZE1haW5TZXR0aW5ncyhjb250YWluZXJFbCk7XG4gICAgdGhpcy5hZGRBcHBlYXJhbmNlU2V0dGluZ3MoY29udGFpbmVyRWwpO1xuICAgIHRoaXMuYWRkS2V5Q3VzdG9taXphdGlvblNldHRpbmdzKGNvbnRhaW5lckVsKTtcbiAgICB0aGlzLmFkZEN1cnJlbnRGaWxlQ29tcGxlbWVudFNldHRpbmdzKGNvbnRhaW5lckVsKTtcbiAgICB0aGlzLmFkZEN1cnJlbnRWYXVsdENvbXBsZW1lbnRTZXR0aW5ncyhjb250YWluZXJFbCk7XG4gICAgdGhpcy5hZGRDdXN0b21EaWN0aW9uYXJ5Q29tcGxlbWVudFNldHRpbmdzKGNvbnRhaW5lckVsKTtcbiAgICB0aGlzLmFkZEludGVybmFsTGlua0NvbXBsZW1lbnRTZXR0aW5ncyhjb250YWluZXJFbCk7XG4gICAgdGhpcy5hZGRGcm9udE1hdHRlckNvbXBsZW1lbnRTZXR0aW5ncyhjb250YWluZXJFbCk7XG4gICAgdGhpcy5hZGREZWJ1Z1NldHRpbmdzKGNvbnRhaW5lckVsKTtcbiAgfVxuXG4gIHByaXZhdGUgYWRkTWFpblNldHRpbmdzKGNvbnRhaW5lckVsOiBIVE1MRWxlbWVudCkge1xuICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKFwiaDNcIiwgeyB0ZXh0OiBcIk1haW5cIiB9KTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKS5zZXROYW1lKFwiU3RyYXRlZ3lcIikuYWRkRHJvcGRvd24oKHRjKSA9PlxuICAgICAgdGNcbiAgICAgICAgLmFkZE9wdGlvbnMobWlycm9yTWFwKFRva2VuaXplU3RyYXRlZ3kudmFsdWVzKCksICh4KSA9PiB4Lm5hbWUpKVxuICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3Muc3RyYXRlZ3kpXG4gICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5zdHJhdGVneSA9IHZhbHVlO1xuICAgICAgICAgIHRoaXMuZGlzcGxheSgpO1xuICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncyh7XG4gICAgICAgICAgICBjdXJyZW50RmlsZTogdHJ1ZSxcbiAgICAgICAgICAgIGN1cnJlbnRWYXVsdDogdHJ1ZSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSlcbiAgICApO1xuICAgIGlmICh0aGlzLnBsdWdpbi5zZXR0aW5ncy5zdHJhdGVneSA9PT0gVG9rZW5pemVTdHJhdGVneS5DSElORVNFLm5hbWUpIHtcbiAgICAgIGNvbnN0IGVsID0gY29udGFpbmVyRWwuY3JlYXRlRWwoXCJkaXZcIiwge1xuICAgICAgICBjbHM6IFwidmFyaW91cy1jb21wbGVtZW50c19fc2V0dGluZ3NfX3dhcm5pbmdcIixcbiAgICAgIH0pO1xuICAgICAgZWwuY3JlYXRlU3Bhbih7XG4gICAgICAgIHRleHQ6IFwi4pqgIFlvdSBuZWVkIHRvIGRvd25sb2FkIGBjZWRpY3RfdHMudThgIGZyb21cIixcbiAgICAgIH0pO1xuICAgICAgZWwuY3JlYXRlRWwoXCJhXCIsIHtcbiAgICAgICAgaHJlZjogXCJodHRwczovL3d3dy5tZGJnLm5ldC9jaGluZXNlL2RpY3Rpb25hcnk/cGFnZT1jYy1jZWRpY3RcIixcbiAgICAgICAgdGV4dDogXCIgdGhlIHNpdGUgXCIsXG4gICAgICB9KTtcbiAgICAgIGVsLmNyZWF0ZVNwYW4oe1xuICAgICAgICB0ZXh0OiBcImFuZCBzdG9yZSBpdCBpbiB2YXVsdCByb290LlwiLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpLnNldE5hbWUoXCJNYXRjaCBzdHJhdGVneVwiKS5hZGREcm9wZG93bigodGMpID0+XG4gICAgICB0Y1xuICAgICAgICAuYWRkT3B0aW9ucyhtaXJyb3JNYXAoTWF0Y2hTdHJhdGVneS52YWx1ZXMoKSwgKHgpID0+IHgubmFtZSkpXG4gICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5tYXRjaFN0cmF0ZWd5KVxuICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MubWF0Y2hTdHJhdGVneSA9IHZhbHVlO1xuICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgIHRoaXMuZGlzcGxheSgpO1xuICAgICAgICB9KVxuICAgICk7XG4gICAgaWYgKHRoaXMucGx1Z2luLnNldHRpbmdzLm1hdGNoU3RyYXRlZ3kgPT09IE1hdGNoU3RyYXRlZ3kuUEFSVElBTC5uYW1lKSB7XG4gICAgICBjb250YWluZXJFbC5jcmVhdGVFbChcImRpdlwiLCB7XG4gICAgICAgIHRleHQ6IFwi4pqgIGBwYXJ0aWFsYCBpcyBtb3JlIHRoYW4gMTAgdGltZXMgc2xvd2VyIHRoYW4gYHByZWZpeGBcIixcbiAgICAgICAgY2xzOiBcInZhcmlvdXMtY29tcGxlbWVudHNfX3NldHRpbmdzX193YXJuaW5nXCIsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiTWF4IG51bWJlciBvZiBzdWdnZXN0aW9uc1wiKVxuICAgICAgLmFkZFNsaWRlcigoc2MpID0+XG4gICAgICAgIHNjXG4gICAgICAgICAgLnNldExpbWl0cygxLCAyNTUsIDEpXG4gICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLm1heE51bWJlck9mU3VnZ2VzdGlvbnMpXG4gICAgICAgICAgLnNldER5bmFtaWNUb29sdGlwKClcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5tYXhOdW1iZXJPZlN1Z2dlc3Rpb25zID0gdmFsdWU7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICB9KVxuICAgICAgKTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJNYXggbnVtYmVyIG9mIHdvcmRzIGFzIGEgcGhyYXNlXCIpXG4gICAgICAuc2V0RGVzYyhgW+KaoFdhcm5pbmddIEl0IG1ha2VzIHNsb3dlciBtb3JlIHRoYW4gTiB0aW1lcyAoTiBpcyBzZXQgdmFsdWUpYClcbiAgICAgIC5hZGRTbGlkZXIoKHNjKSA9PlxuICAgICAgICBzY1xuICAgICAgICAgIC5zZXRMaW1pdHMoMSwgMTAsIDEpXG4gICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLm1heE51bWJlck9mV29yZHNBc1BocmFzZSlcbiAgICAgICAgICAuc2V0RHluYW1pY1Rvb2x0aXAoKVxuICAgICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLm1heE51bWJlck9mV29yZHNBc1BocmFzZSA9IHZhbHVlO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgfSlcbiAgICAgICk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiTWluIG51bWJlciBvZiBjaGFyYWN0ZXJzIGZvciB0cmlnZ2VyXCIpXG4gICAgICAuc2V0RGVzYyhcIkl0IHVzZXMgYSBkZWZhdWx0IHZhbHVlIG9mIFN0cmF0ZWd5IGlmIHNldCAwLlwiKVxuICAgICAgLmFkZFNsaWRlcigoc2MpID0+XG4gICAgICAgIHNjXG4gICAgICAgICAgLnNldExpbWl0cygwLCAxMCwgMSlcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MubWluTnVtYmVyT2ZDaGFyYWN0ZXJzVHJpZ2dlcmVkKVxuICAgICAgICAgIC5zZXREeW5hbWljVG9vbHRpcCgpXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MubWluTnVtYmVyT2ZDaGFyYWN0ZXJzVHJpZ2dlcmVkID0gdmFsdWU7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICB9KVxuICAgICAgKTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJNaW4gbnVtYmVyIG9mIHdvcmRzIGZvciB0cmlnZ2VyXCIpXG4gICAgICAuYWRkU2xpZGVyKChzYykgPT5cbiAgICAgICAgc2NcbiAgICAgICAgICAuc2V0TGltaXRzKDEsIDEwLCAxKVxuICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5taW5OdW1iZXJPZldvcmRzVHJpZ2dlcmVkUGhyYXNlKVxuICAgICAgICAgIC5zZXREeW5hbWljVG9vbHRpcCgpXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MubWluTnVtYmVyT2ZXb3Jkc1RyaWdnZXJlZFBocmFzZSA9IHZhbHVlO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgfSlcbiAgICAgICk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiQ29tcGxlbWVudCBhdXRvbWF0aWNhbGx5XCIpXG4gICAgICAuYWRkVG9nZ2xlKCh0YykgPT4ge1xuICAgICAgICB0Yy5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5jb21wbGVtZW50QXV0b21hdGljYWxseSkub25DaGFuZ2UoXG4gICAgICAgICAgYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5jb21wbGVtZW50QXV0b21hdGljYWxseSA9IHZhbHVlO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgfSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiRGVsYXkgbWlsbGktc2Vjb25kcyBmb3IgdHJpZ2dlclwiKVxuICAgICAgLmFkZFNsaWRlcigoc2MpID0+XG4gICAgICAgIHNjXG4gICAgICAgICAgLnNldExpbWl0cygwLCAxMDAwLCAxMClcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MuZGVsYXlNaWxsaVNlY29uZHMpXG4gICAgICAgICAgLnNldER5bmFtaWNUb29sdGlwKClcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5kZWxheU1pbGxpU2Vjb25kcyA9IHZhbHVlO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgfSlcbiAgICAgICk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiRGlzYWJsZSBzdWdnZXN0aW9ucyBkdXJpbmcgSU1FIG9uXCIpXG4gICAgICAuYWRkVG9nZ2xlKCh0YykgPT4ge1xuICAgICAgICB0Yy5zZXRWYWx1ZShcbiAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5kaXNhYmxlU3VnZ2VzdGlvbnNEdXJpbmdJbWVPblxuICAgICAgICApLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmRpc2FibGVTdWdnZXN0aW9uc0R1cmluZ0ltZU9uID0gdmFsdWU7XG4gICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiSW5zZXJ0IHNwYWNlIGFmdGVyIGNvbXBsZXRpb25cIilcbiAgICAgIC5hZGRUb2dnbGUoKHRjKSA9PiB7XG4gICAgICAgIHRjLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLmluc2VydEFmdGVyQ29tcGxldGlvbikub25DaGFuZ2UoXG4gICAgICAgICAgYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5pbnNlcnRBZnRlckNvbXBsZXRpb24gPSB2YWx1ZTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgIH0pO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIkZpcnN0IGNoYXJhY3RlcnMgdG8gZGlzYWJsZSBzdWdnZXN0aW9uc1wiKVxuICAgICAgLmFkZFRleHQoKGNiKSA9PiB7XG4gICAgICAgIGNiLnNldFZhbHVlKFxuICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmZpcnN0Q2hhcmFjdGVyc0Rpc2FibGVTdWdnZXN0aW9uc1xuICAgICAgICApLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmZpcnN0Q2hhcmFjdGVyc0Rpc2FibGVTdWdnZXN0aW9ucyA9IHZhbHVlO1xuICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBhZGRBcHBlYXJhbmNlU2V0dGluZ3MoY29udGFpbmVyRWw6IEhUTUxFbGVtZW50KSB7XG4gICAgY29udGFpbmVyRWwuY3JlYXRlRWwoXCJoM1wiLCB7IHRleHQ6IFwiQXBwZWFyYW5jZVwiIH0pO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIlNob3cgTWF0Y2ggc3RyYXRlZ3lcIilcbiAgICAgIC5zZXREZXNjKFxuICAgICAgICBcIlNob3cgTWF0Y2ggc3RyYXRlZ3kgYXQgdGhlIHN0YXR1cyBiYXIuIENoYW5naW5nIHRoaXMgb3B0aW9uIHJlcXVpcmVzIGEgcmVzdGFydCB0byB0YWtlIGVmZmVjdC5cIlxuICAgICAgKVxuICAgICAgLmFkZFRvZ2dsZSgodGMpID0+IHtcbiAgICAgICAgdGMuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3Muc2hvd01hdGNoU3RyYXRlZ3kpLm9uQ2hhbmdlKFxuICAgICAgICAgIGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3Muc2hvd01hdGNoU3RyYXRlZ3kgPSB2YWx1ZTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgIH0pO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIlNob3cgQ29tcGxlbWVudCBhdXRvbWF0aWNhbGx5XCIpXG4gICAgICAuc2V0RGVzYyhcbiAgICAgICAgXCJTaG93IGNvbXBsZW1lbnQgYXV0b21hdGljYWxseSBhdCB0aGUgc3RhdHVzIGJhci4gQ2hhbmdpbmcgdGhpcyBvcHRpb24gcmVxdWlyZXMgYSByZXN0YXJ0IHRvIHRha2UgZWZmZWN0LlwiXG4gICAgICApXG4gICAgICAuYWRkVG9nZ2xlKCh0YykgPT4ge1xuICAgICAgICB0Yy5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5zaG93Q29tcGxlbWVudEF1dG9tYXRpY2FsbHkpLm9uQ2hhbmdlKFxuICAgICAgICAgIGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3Muc2hvd0NvbXBsZW1lbnRBdXRvbWF0aWNhbGx5ID0gdmFsdWU7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgICB9KTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJTaG93IEluZGV4aW5nIHN0YXR1c1wiKVxuICAgICAgLnNldERlc2MoXG4gICAgICAgIFwiU2hvdyBpbmRleGluZyBzdGF0dXMgYXQgdGhlIHN0YXR1cyBiYXIuIENoYW5naW5nIHRoaXMgb3B0aW9uIHJlcXVpcmVzIGEgcmVzdGFydCB0byB0YWtlIGVmZmVjdC5cIlxuICAgICAgKVxuICAgICAgLmFkZFRvZ2dsZSgodGMpID0+IHtcbiAgICAgICAgdGMuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3Muc2hvd0luZGV4aW5nU3RhdHVzKS5vbkNoYW5nZShcbiAgICAgICAgICBhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnNob3dJbmRleGluZ1N0YXR1cyA9IHZhbHVlO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgfSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiRGVzY3JpcHRpb24gb24gYSBzdWdnZXN0aW9uXCIpXG4gICAgICAuYWRkRHJvcGRvd24oKHRjKSA9PlxuICAgICAgICB0Y1xuICAgICAgICAgIC5hZGRPcHRpb25zKFxuICAgICAgICAgICAgbWlycm9yTWFwKERlc2NyaXB0aW9uT25TdWdnZXN0aW9uLnZhbHVlcygpLCAoeCkgPT4geC5uYW1lKVxuICAgICAgICAgIClcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MuZGVzY3JpcHRpb25PblN1Z2dlc3Rpb24pXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuZGVzY3JpcHRpb25PblN1Z2dlc3Rpb24gPSB2YWx1ZTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgIH0pXG4gICAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSBhZGRLZXlDdXN0b21pemF0aW9uU2V0dGluZ3MoY29udGFpbmVyRWw6IEhUTUxFbGVtZW50KSB7XG4gICAgY29udGFpbmVyRWwuY3JlYXRlRWwoXCJoM1wiLCB7IHRleHQ6IFwiS2V5IGN1c3RvbWl6YXRpb25cIiB9KTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJTZWxlY3QgYSBzdWdnZXN0aW9uIGtleVwiKVxuICAgICAgLmFkZERyb3Bkb3duKCh0YykgPT5cbiAgICAgICAgdGNcbiAgICAgICAgICAuYWRkT3B0aW9ucyhtaXJyb3JNYXAoU2VsZWN0U3VnZ2VzdGlvbktleS52YWx1ZXMoKSwgKHgpID0+IHgubmFtZSkpXG4gICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnNlbGVjdFN1Z2dlc3Rpb25LZXlzKVxuICAgICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnNlbGVjdFN1Z2dlc3Rpb25LZXlzID0gdmFsdWU7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICB9KVxuICAgICAgKTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJBZGRpdGlvbmFsIGN5Y2xlIHRocm91Z2ggc3VnZ2VzdGlvbnMga2V5c1wiKVxuICAgICAgLmFkZERyb3Bkb3duKCh0YykgPT5cbiAgICAgICAgdGNcbiAgICAgICAgICAuYWRkT3B0aW9ucyhcbiAgICAgICAgICAgIG1pcnJvck1hcChDeWNsZVRocm91Z2hTdWdnZXN0aW9uc0tleXMudmFsdWVzKCksICh4KSA9PiB4Lm5hbWUpXG4gICAgICAgICAgKVxuICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5hZGRpdGlvbmFsQ3ljbGVUaHJvdWdoU3VnZ2VzdGlvbnNLZXlzKVxuICAgICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmFkZGl0aW9uYWxDeWNsZVRocm91Z2hTdWdnZXN0aW9uc0tleXMgPSB2YWx1ZTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgIH0pXG4gICAgICApO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIkRpc2FibGUgdGhlIHVwL2Rvd24ga2V5cyBmb3IgY3ljbGUgdGhyb3VnaCBzdWdnZXN0aW9ucyBrZXlzXCIpXG4gICAgICAuYWRkVG9nZ2xlKCh0YykgPT4ge1xuICAgICAgICB0Yy5zZXRWYWx1ZShcbiAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5kaXNhYmxlVXBEb3duS2V5c0ZvckN5Y2xlVGhyb3VnaFN1Z2dlc3Rpb25zS2V5c1xuICAgICAgICApLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmRpc2FibGVVcERvd25LZXlzRm9yQ3ljbGVUaHJvdWdoU3VnZ2VzdGlvbnNLZXlzID1cbiAgICAgICAgICAgIHZhbHVlO1xuICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpLnNldE5hbWUoXCJPcGVuIHNvdXJjZSBmaWxlIGtleVwiKS5hZGREcm9wZG93bigodGMpID0+XG4gICAgICB0Y1xuICAgICAgICAuYWRkT3B0aW9ucyhtaXJyb3JNYXAoT3BlblNvdXJjZUZpbGVLZXlzLnZhbHVlcygpLCAoeCkgPT4geC5uYW1lKSlcbiAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLm9wZW5Tb3VyY2VGaWxlS2V5KVxuICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3Mub3BlblNvdXJjZUZpbGVLZXkgPSB2YWx1ZTtcbiAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgfSlcbiAgICApO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIlByb3BhZ2F0ZSBFU0NcIilcbiAgICAgIC5zZXREZXNjKFxuICAgICAgICBcIkl0IGlzIGhhbmR5IGlmIHlvdSB1c2UgVmltIG1vZGUgYmVjYXVzZSB5b3UgY2FuIHN3aXRjaCB0byBOb3JtYWwgbW9kZSBieSBvbmUgRVNDLCB3aGV0aGVyIGl0IHNob3dzIHN1Z2dlc3Rpb25zIG9yIG5vdC5cIlxuICAgICAgKVxuICAgICAgLmFkZFRvZ2dsZSgodGMpID0+IHtcbiAgICAgICAgdGMuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MucHJvcGFnYXRlRXNjKS5vbkNoYW5nZShcbiAgICAgICAgICBhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnByb3BhZ2F0ZUVzYyA9IHZhbHVlO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGFkZEN1cnJlbnRGaWxlQ29tcGxlbWVudFNldHRpbmdzKGNvbnRhaW5lckVsOiBIVE1MRWxlbWVudCkge1xuICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKFwiaDNcIiwge1xuICAgICAgdGV4dDogXCJDdXJyZW50IGZpbGUgY29tcGxlbWVudFwiLFxuICAgICAgY2xzOiBcInZhcmlvdXMtY29tcGxlbWVudHNfX3NldHRpbmdzX19oZWFkZXIgdmFyaW91cy1jb21wbGVtZW50c19fc2V0dGluZ3NfX2hlYWRlcl9fY3VycmVudC1maWxlXCIsXG4gICAgfSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiRW5hYmxlIEN1cnJlbnQgZmlsZSBjb21wbGVtZW50XCIpXG4gICAgICAuYWRkVG9nZ2xlKCh0YykgPT4ge1xuICAgICAgICB0Yy5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5lbmFibGVDdXJyZW50RmlsZUNvbXBsZW1lbnQpLm9uQ2hhbmdlKFxuICAgICAgICAgIGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuZW5hYmxlQ3VycmVudEZpbGVDb21wbGVtZW50ID0gdmFsdWU7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoeyBjdXJyZW50RmlsZTogdHJ1ZSB9KTtcbiAgICAgICAgICAgIHRoaXMuZGlzcGxheSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgIH0pO1xuXG4gICAgaWYgKHRoaXMucGx1Z2luLnNldHRpbmdzLmVuYWJsZUN1cnJlbnRGaWxlQ29tcGxlbWVudCkge1xuICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAgIC5zZXROYW1lKFwiTWluIG51bWJlciBvZiBjaGFyYWN0ZXJzIGZvciBpbmRleGluZ1wiKVxuICAgICAgICAuc2V0RGVzYyhcIkl0IHVzZXMgYSBkZWZhdWx0IHZhbHVlIG9mIFN0cmF0ZWd5IGlmIHNldCAwLlwiKVxuICAgICAgICAuYWRkU2xpZGVyKChzYykgPT5cbiAgICAgICAgICBzY1xuICAgICAgICAgICAgLnNldExpbWl0cygwLCAxNSwgMSlcbiAgICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5jdXJyZW50RmlsZU1pbk51bWJlck9mQ2hhcmFjdGVycylcbiAgICAgICAgICAgIC5zZXREeW5hbWljVG9vbHRpcCgpXG4gICAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmN1cnJlbnRGaWxlTWluTnVtYmVyT2ZDaGFyYWN0ZXJzID0gdmFsdWU7XG4gICAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncyh7IGN1cnJlbnRGaWxlOiB0cnVlIH0pO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgKTtcblxuICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAgIC5zZXROYW1lKFwiT25seSBjb21wbGVtZW50IEVuZ2xpc2ggb24gY3VycmVudCBmaWxlIGNvbXBsZW1lbnRcIilcbiAgICAgICAgLmFkZFRvZ2dsZSgodGMpID0+IHtcbiAgICAgICAgICB0Yy5zZXRWYWx1ZShcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLm9ubHlDb21wbGVtZW50RW5nbGlzaE9uQ3VycmVudEZpbGVDb21wbGVtZW50XG4gICAgICAgICAgKS5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLm9ubHlDb21wbGVtZW50RW5nbGlzaE9uQ3VycmVudEZpbGVDb21wbGVtZW50ID1cbiAgICAgICAgICAgICAgdmFsdWU7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoeyBjdXJyZW50RmlsZTogdHJ1ZSB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBhZGRDdXJyZW50VmF1bHRDb21wbGVtZW50U2V0dGluZ3MoY29udGFpbmVyRWw6IEhUTUxFbGVtZW50KSB7XG4gICAgY29udGFpbmVyRWwuY3JlYXRlRWwoXCJoM1wiLCB7XG4gICAgICB0ZXh0OiBcIkN1cnJlbnQgdmF1bHQgY29tcGxlbWVudFwiLFxuICAgICAgY2xzOiBcInZhcmlvdXMtY29tcGxlbWVudHNfX3NldHRpbmdzX19oZWFkZXIgdmFyaW91cy1jb21wbGVtZW50c19fc2V0dGluZ3NfX2hlYWRlcl9fY3VycmVudC12YXVsdFwiLFxuICAgIH0pO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIkVuYWJsZSBDdXJyZW50IHZhdWx0IGNvbXBsZW1lbnRcIilcbiAgICAgIC5hZGRUb2dnbGUoKHRjKSA9PiB7XG4gICAgICAgIHRjLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLmVuYWJsZUN1cnJlbnRWYXVsdENvbXBsZW1lbnQpLm9uQ2hhbmdlKFxuICAgICAgICAgIGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuZW5hYmxlQ3VycmVudFZhdWx0Q29tcGxlbWVudCA9IHZhbHVlO1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoeyBjdXJyZW50VmF1bHQ6IHRydWUgfSk7XG4gICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgfSk7XG5cbiAgICBpZiAodGhpcy5wbHVnaW4uc2V0dGluZ3MuZW5hYmxlQ3VycmVudFZhdWx0Q29tcGxlbWVudCkge1xuICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAgIC5zZXROYW1lKFwiTWluIG51bWJlciBvZiBjaGFyYWN0ZXJzIGZvciBpbmRleGluZ1wiKVxuICAgICAgICAuc2V0RGVzYyhcIkl0IHVzZXMgYSBkZWZhdWx0IHZhbHVlIG9mIFN0cmF0ZWd5IGlmIHNldCAwLlwiKVxuICAgICAgICAuYWRkU2xpZGVyKChzYykgPT5cbiAgICAgICAgICBzY1xuICAgICAgICAgICAgLnNldExpbWl0cygwLCAxNSwgMSlcbiAgICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5jdXJyZW50VmF1bHRNaW5OdW1iZXJPZkNoYXJhY3RlcnMpXG4gICAgICAgICAgICAuc2V0RHluYW1pY1Rvb2x0aXAoKVxuICAgICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5jdXJyZW50VmF1bHRNaW5OdW1iZXJPZkNoYXJhY3RlcnMgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICApO1xuXG4gICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgLnNldE5hbWUoXCJJbmNsdWRlIHByZWZpeCBwYXRoIHBhdHRlcm5zXCIpXG4gICAgICAgIC5zZXREZXNjKFwiUHJlZml4IG1hdGNoIHBhdGggcGF0dGVybnMgdG8gaW5jbHVkZSBmaWxlcy5cIilcbiAgICAgICAgLmFkZFRleHRBcmVhKCh0YWMpID0+IHtcbiAgICAgICAgICBjb25zdCBlbCA9IHRhY1xuICAgICAgICAgICAgLnNldFZhbHVlKFxuICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5pbmNsdWRlQ3VycmVudFZhdWx0UGF0aFByZWZpeFBhdHRlcm5zXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAuc2V0UGxhY2Vob2xkZXIoXCJQcml2YXRlL1wiKVxuICAgICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5pbmNsdWRlQ3VycmVudFZhdWx0UGF0aFByZWZpeFBhdHRlcm5zID1cbiAgICAgICAgICAgICAgICB2YWx1ZTtcbiAgICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICBlbC5pbnB1dEVsLmNsYXNzTmFtZSA9XG4gICAgICAgICAgICBcInZhcmlvdXMtY29tcGxlbWVudHNfX3NldHRpbmdzX190ZXh0LWFyZWEtcGF0aFwiO1xuICAgICAgICAgIHJldHVybiBlbDtcbiAgICAgICAgfSk7XG4gICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgLnNldE5hbWUoXCJFeGNsdWRlIHByZWZpeCBwYXRoIHBhdHRlcm5zXCIpXG4gICAgICAgIC5zZXREZXNjKFwiUHJlZml4IG1hdGNoIHBhdGggcGF0dGVybnMgdG8gZXhjbHVkZSBmaWxlcy5cIilcbiAgICAgICAgLmFkZFRleHRBcmVhKCh0YWMpID0+IHtcbiAgICAgICAgICBjb25zdCBlbCA9IHRhY1xuICAgICAgICAgICAgLnNldFZhbHVlKFxuICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5leGNsdWRlQ3VycmVudFZhdWx0UGF0aFByZWZpeFBhdHRlcm5zXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAuc2V0UGxhY2Vob2xkZXIoXCJQcml2YXRlL1wiKVxuICAgICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5leGNsdWRlQ3VycmVudFZhdWx0UGF0aFByZWZpeFBhdHRlcm5zID1cbiAgICAgICAgICAgICAgICB2YWx1ZTtcbiAgICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICBlbC5pbnB1dEVsLmNsYXNzTmFtZSA9XG4gICAgICAgICAgICBcInZhcmlvdXMtY29tcGxlbWVudHNfX3NldHRpbmdzX190ZXh0LWFyZWEtcGF0aFwiO1xuICAgICAgICAgIHJldHVybiBlbDtcbiAgICAgICAgfSk7XG4gICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgLnNldE5hbWUoXCJJbmNsdWRlIG9ubHkgZmlsZXMgdW5kZXIgY3VycmVudCBkaXJlY3RvcnlcIilcbiAgICAgICAgLmFkZFRvZ2dsZSgodGMpID0+IHtcbiAgICAgICAgICB0Yy5zZXRWYWx1ZShcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzXG4gICAgICAgICAgICAgIC5pbmNsdWRlQ3VycmVudFZhdWx0T25seUZpbGVzVW5kZXJDdXJyZW50RGlyZWN0b3J5XG4gICAgICAgICAgKS5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmluY2x1ZGVDdXJyZW50VmF1bHRPbmx5RmlsZXNVbmRlckN1cnJlbnREaXJlY3RvcnkgPVxuICAgICAgICAgICAgICB2YWx1ZTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFkZEN1c3RvbURpY3Rpb25hcnlDb21wbGVtZW50U2V0dGluZ3MoY29udGFpbmVyRWw6IEhUTUxFbGVtZW50KSB7XG4gICAgY29udGFpbmVyRWwuY3JlYXRlRWwoXCJoM1wiLCB7XG4gICAgICB0ZXh0OiBcIkN1c3RvbSBkaWN0aW9uYXJ5IGNvbXBsZW1lbnRcIixcbiAgICAgIGNsczogXCJ2YXJpb3VzLWNvbXBsZW1lbnRzX19zZXR0aW5nc19faGVhZGVyIHZhcmlvdXMtY29tcGxlbWVudHNfX3NldHRpbmdzX19oZWFkZXJfX2N1c3RvbS1kaWN0aW9uYXJ5XCIsXG4gICAgfSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiRW5hYmxlIEN1c3RvbSBkaWN0aW9uYXJ5IGNvbXBsZW1lbnRcIilcbiAgICAgIC5hZGRUb2dnbGUoKHRjKSA9PiB7XG4gICAgICAgIHRjLnNldFZhbHVlKFxuICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmVuYWJsZUN1c3RvbURpY3Rpb25hcnlDb21wbGVtZW50XG4gICAgICAgICkub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuZW5hYmxlQ3VzdG9tRGljdGlvbmFyeUNvbXBsZW1lbnQgPSB2YWx1ZTtcbiAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoeyBjdXN0b21EaWN0aW9uYXJ5OiB0cnVlIH0pO1xuICAgICAgICAgIHRoaXMuZGlzcGxheSgpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgaWYgKHRoaXMucGx1Z2luLnNldHRpbmdzLmVuYWJsZUN1c3RvbURpY3Rpb25hcnlDb21wbGVtZW50KSB7XG4gICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgLnNldE5hbWUoXCJDdXN0b20gZGljdGlvbmFyeSBwYXRoc1wiKVxuICAgICAgICAuc2V0RGVzYyhcbiAgICAgICAgICBcIlNwZWNpZnkgZWl0aGVyIGEgcmVsYXRpdmUgcGF0aCBmcm9tIFZhdWx0IHJvb3Qgb3IgVVJMIGZvciBlYWNoIGxpbmUuXCJcbiAgICAgICAgKVxuICAgICAgICAuYWRkVGV4dEFyZWEoKHRhYykgPT4ge1xuICAgICAgICAgIGNvbnN0IGVsID0gdGFjXG4gICAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MuY3VzdG9tRGljdGlvbmFyeVBhdGhzKVxuICAgICAgICAgICAgLnNldFBsYWNlaG9sZGVyKFwiZGljdGlvbmFyeS5tZFwiKVxuICAgICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5jdXN0b21EaWN0aW9uYXJ5UGF0aHMgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICBlbC5pbnB1dEVsLmNsYXNzTmFtZSA9XG4gICAgICAgICAgICBcInZhcmlvdXMtY29tcGxlbWVudHNfX3NldHRpbmdzX190ZXh0LWFyZWEtcGF0aFwiO1xuICAgICAgICAgIHJldHVybiBlbDtcbiAgICAgICAgfSk7XG5cbiAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKS5zZXROYW1lKFwiQ29sdW1uIGRlbGltaXRlclwiKS5hZGREcm9wZG93bigodGMpID0+XG4gICAgICAgIHRjXG4gICAgICAgICAgLmFkZE9wdGlvbnMobWlycm9yTWFwKENvbHVtbkRlbGltaXRlci52YWx1ZXMoKSwgKHgpID0+IHgubmFtZSkpXG4gICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLmNvbHVtbkRlbGltaXRlcilcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5jb2x1bW5EZWxpbWl0ZXIgPSB2YWx1ZTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgIH0pXG4gICAgICApO1xuXG4gICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgLnNldE5hbWUoXCJXb3JkIHJlZ2V4IHBhdHRlcm5cIilcbiAgICAgICAgLnNldERlc2MoXCJPbmx5IGxvYWQgd29yZHMgdGhhdCBtYXRjaCB0aGUgcmVndWxhciBleHByZXNzaW9uIHBhdHRlcm4uXCIpXG4gICAgICAgIC5hZGRUZXh0KChjYikgPT4ge1xuICAgICAgICAgIGNiLnNldFZhbHVlKFxuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuY3VzdG9tRGljdGlvbmFyeVdvcmRSZWdleFBhdHRlcm5cbiAgICAgICAgICApLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuY3VzdG9tRGljdGlvbmFyeVdvcmRSZWdleFBhdHRlcm4gPSB2YWx1ZTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAgIC5zZXROYW1lKFwiRGVsaW1pdGVyIHRvIGhpZGUgYSBzdWdnZXN0aW9uXCIpXG4gICAgICAgIC5zZXREZXNjKFxuICAgICAgICAgIFwiSWYgc2V0ICc7OzsnLCAnYWJjZDs7O2VmZycgaXMgc2hvd24gYXMgJ2FiY2QnIG9uIHN1Z2dlc3Rpb25zLCBidXQgY29tcGxldGVzIHRvICdhYmNkZWZnJy5cIlxuICAgICAgICApXG4gICAgICAgIC5hZGRUZXh0KChjYikgPT4ge1xuICAgICAgICAgIGNiLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLmRlbGltaXRlclRvSGlkZVN1Z2dlc3Rpb24pLm9uQ2hhbmdlKFxuICAgICAgICAgICAgYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmRlbGltaXRlclRvSGlkZVN1Z2dlc3Rpb24gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgKTtcbiAgICAgICAgfSk7XG5cbiAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAuc2V0TmFtZShcbiAgICAgICAgICBcIkRlbGltaXRlciB0byBkaXZpZGUgc3VnZ2VzdGlvbnMgZm9yIGRpc3BsYXkgZnJvbSBvbmVzIGZvciBpbnNlcnRpb25cIlxuICAgICAgICApXG4gICAgICAgIC5zZXREZXNjKFxuICAgICAgICAgIFwiSWYgc2V0ICcgPj4+ICcsICdkaXNwbGF5ZWQgPj4+IGluc2VydGVkJyBpcyBzaG93biBhcyAnZGlzcGxheWVkJyBvbiBzdWdnZXN0aW9ucywgYnV0IGNvbXBsZXRlcyB0byAnaW5zZXJ0ZWQnLlwiXG4gICAgICAgIClcbiAgICAgICAgLmFkZFRleHQoKGNiKSA9PiB7XG4gICAgICAgICAgY2Iuc2V0VmFsdWUoXG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5nc1xuICAgICAgICAgICAgICAuZGVsaW1pdGVyVG9EaXZpZGVTdWdnZXN0aW9uc0ZvckRpc3BsYXlGcm9tSW5zZXJ0aW9uXG4gICAgICAgICAgKS5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmRlbGltaXRlclRvRGl2aWRlU3VnZ2VzdGlvbnNGb3JEaXNwbGF5RnJvbUluc2VydGlvbiA9XG4gICAgICAgICAgICAgIHZhbHVlO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgLnNldE5hbWUoXCJDYXJldCBsb2NhdGlvbiBzeW1ib2wgYWZ0ZXIgY29tcGxlbWVudFwiKVxuICAgICAgICAuc2V0RGVzYyhcbiAgICAgICAgICBcIklmIHNldCAnPENBUkVUPicgYW5kIHRoZXJlIGlzICc8bGk+PENBUkVUPjwvbGk+JyBpbiBjdXN0b20gZGljdGlvbmFyeSwgaXQgY29tcGxlbWVudHMgJzxsaT48L2xpPicgYW5kIG1vdmUgYSBjYXJldCB3aGVyZSBiZXR3ZWVuICc8bGk+JyBhbmQgYDwvbGk+YC5cIlxuICAgICAgICApXG4gICAgICAgIC5hZGRUZXh0KChjYikgPT4ge1xuICAgICAgICAgIGNiLnNldFZhbHVlKFxuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuY2FyZXRMb2NhdGlvblN5bWJvbEFmdGVyQ29tcGxlbWVudFxuICAgICAgICAgICkub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5jYXJldExvY2F0aW9uU3ltYm9sQWZ0ZXJDb21wbGVtZW50ID0gdmFsdWU7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAuc2V0TmFtZShcIkRpc3BsYXllZCB0ZXh0IHN1ZmZpeFwiKVxuICAgICAgICAuc2V0RGVzYyhcbiAgICAgICAgICBcIkl0IHNob3dzIGFzIGEgc3VmZml4IG9mIGRpc3BsYXllZCB0ZXh0IGlmIHRoZXJlIGlzIGEgZGlmZmVyZW5jZSBiZXR3ZWVuIGRpc3BsYXllZCBhbmQgaW5zZXJ0ZWRcIlxuICAgICAgICApXG4gICAgICAgIC5hZGRUZXh0KChjYikgPT4ge1xuICAgICAgICAgIGNiLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLmRpc3BsYXllZFRleHRTdWZmaXgpLm9uQ2hhbmdlKFxuICAgICAgICAgICAgYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmRpc3BsYXllZFRleHRTdWZmaXggPSB2YWx1ZTtcbiAgICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBhZGRJbnRlcm5hbExpbmtDb21wbGVtZW50U2V0dGluZ3MoY29udGFpbmVyRWw6IEhUTUxFbGVtZW50KSB7XG4gICAgY29udGFpbmVyRWwuY3JlYXRlRWwoXCJoM1wiLCB7XG4gICAgICB0ZXh0OiBcIkludGVybmFsIGxpbmsgY29tcGxlbWVudFwiLFxuICAgICAgY2xzOiBcInZhcmlvdXMtY29tcGxlbWVudHNfX3NldHRpbmdzX19oZWFkZXIgdmFyaW91cy1jb21wbGVtZW50c19fc2V0dGluZ3NfX2hlYWRlcl9faW50ZXJuYWwtbGlua1wiLFxuICAgIH0pO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIkVuYWJsZSBJbnRlcm5hbCBsaW5rIGNvbXBsZW1lbnRcIilcbiAgICAgIC5hZGRUb2dnbGUoKHRjKSA9PiB7XG4gICAgICAgIHRjLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLmVuYWJsZUludGVybmFsTGlua0NvbXBsZW1lbnQpLm9uQ2hhbmdlKFxuICAgICAgICAgIGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuZW5hYmxlSW50ZXJuYWxMaW5rQ29tcGxlbWVudCA9IHZhbHVlO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKHsgaW50ZXJuYWxMaW5rOiB0cnVlIH0pO1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgfSk7XG5cbiAgICBpZiAodGhpcy5wbHVnaW4uc2V0dGluZ3MuZW5hYmxlSW50ZXJuYWxMaW5rQ29tcGxlbWVudCkge1xuICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAgIC5zZXROYW1lKFwiU3VnZ2VzdCB3aXRoIGFuIGFsaWFzXCIpXG4gICAgICAgIC5hZGRUb2dnbGUoKHRjKSA9PiB7XG4gICAgICAgICAgdGMuc2V0VmFsdWUoXG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5zdWdnZXN0SW50ZXJuYWxMaW5rV2l0aEFsaWFzXG4gICAgICAgICAgKS5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnN1Z2dlc3RJbnRlcm5hbExpbmtXaXRoQWxpYXMgPSB2YWx1ZTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncyh7IGludGVybmFsTGluazogdHJ1ZSB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgLnNldE5hbWUoXCJFeGNsdWRlIHByZWZpeCBwYXRoIHBhdHRlcm5zXCIpXG4gICAgICAgIC5zZXREZXNjKFwiUHJlZml4IG1hdGNoIHBhdGggcGF0dGVybnMgdG8gZXhjbHVkZSBmaWxlcy5cIilcbiAgICAgICAgLmFkZFRleHRBcmVhKCh0YWMpID0+IHtcbiAgICAgICAgICBjb25zdCBlbCA9IHRhY1xuICAgICAgICAgICAgLnNldFZhbHVlKFxuICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5leGNsdWRlSW50ZXJuYWxMaW5rUGF0aFByZWZpeFBhdHRlcm5zXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAuc2V0UGxhY2Vob2xkZXIoXCJQcml2YXRlL1wiKVxuICAgICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5leGNsdWRlSW50ZXJuYWxMaW5rUGF0aFByZWZpeFBhdHRlcm5zID1cbiAgICAgICAgICAgICAgICB2YWx1ZTtcbiAgICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICBlbC5pbnB1dEVsLmNsYXNzTmFtZSA9XG4gICAgICAgICAgICBcInZhcmlvdXMtY29tcGxlbWVudHNfX3NldHRpbmdzX190ZXh0LWFyZWEtcGF0aFwiO1xuICAgICAgICAgIHJldHVybiBlbDtcbiAgICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBhZGRGcm9udE1hdHRlckNvbXBsZW1lbnRTZXR0aW5ncyhjb250YWluZXJFbDogSFRNTEVsZW1lbnQpIHtcbiAgICBjb250YWluZXJFbC5jcmVhdGVFbChcImgzXCIsIHtcbiAgICAgIHRleHQ6IFwiRnJvbnQgbWF0dGVyIGNvbXBsZW1lbnRcIixcbiAgICAgIGNsczogXCJ2YXJpb3VzLWNvbXBsZW1lbnRzX19zZXR0aW5nc19faGVhZGVyIHZhcmlvdXMtY29tcGxlbWVudHNfX3NldHRpbmdzX19oZWFkZXJfX2Zyb250LW1hdHRlclwiLFxuICAgIH0pO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIkVuYWJsZSBGcm9udCBtYXR0ZXIgY29tcGxlbWVudFwiKVxuICAgICAgLmFkZFRvZ2dsZSgodGMpID0+IHtcbiAgICAgICAgdGMuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MuZW5hYmxlRnJvbnRNYXR0ZXJDb21wbGVtZW50KS5vbkNoYW5nZShcbiAgICAgICAgICBhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmVuYWJsZUZyb250TWF0dGVyQ29tcGxlbWVudCA9IHZhbHVlO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKHsgZnJvbnRNYXR0ZXI6IHRydWUgfSk7XG4gICAgICAgICAgICB0aGlzLmRpc3BsYXkoKTtcbiAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgICB9KTtcblxuICAgIGlmICh0aGlzLnBsdWdpbi5zZXR0aW5ncy5lbmFibGVGcm9udE1hdHRlckNvbXBsZW1lbnQpIHtcbiAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAuc2V0TmFtZShcIk1hdGNoIHN0cmF0ZWd5IGluIHRoZSBmcm9udCBtYXR0ZXJcIilcbiAgICAgICAgLmFkZERyb3Bkb3duKCh0YykgPT5cbiAgICAgICAgICB0Y1xuICAgICAgICAgICAgLmFkZE9wdGlvbnMoXG4gICAgICAgICAgICAgIG1pcnJvck1hcChTcGVjaWZpY01hdGNoU3RyYXRlZ3kudmFsdWVzKCksICh4KSA9PiB4Lm5hbWUpXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MuZnJvbnRNYXR0ZXJDb21wbGVtZW50TWF0Y2hTdHJhdGVneSlcbiAgICAgICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuZnJvbnRNYXR0ZXJDb21wbGVtZW50TWF0Y2hTdHJhdGVneSA9IHZhbHVlO1xuICAgICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICk7XG5cbiAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAuc2V0TmFtZShcIkluc2VydCBjb21tYSBhZnRlciBjb21wbGV0aW9uXCIpXG4gICAgICAgIC5hZGRUb2dnbGUoKHRjKSA9PiB7XG4gICAgICAgICAgdGMuc2V0VmFsdWUoXG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5pbnNlcnRDb21tYUFmdGVyRnJvbnRNYXR0ZXJDb21wbGV0aW9uXG4gICAgICAgICAgKS5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmluc2VydENvbW1hQWZ0ZXJGcm9udE1hdHRlckNvbXBsZXRpb24gPSB2YWx1ZTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFkZERlYnVnU2V0dGluZ3MoY29udGFpbmVyRWw6IEhUTUxFbGVtZW50KSB7XG4gICAgY29udGFpbmVyRWwuY3JlYXRlRWwoXCJoM1wiLCB7IHRleHQ6IFwiRGVidWdcIiB9KTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJTaG93IGxvZyBhYm91dCBwZXJmb3JtYW5jZSBpbiBhIGNvbnNvbGVcIilcbiAgICAgIC5hZGRUb2dnbGUoKHRjKSA9PiB7XG4gICAgICAgIHRjLnNldFZhbHVlKFxuICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnNob3dMb2dBYm91dFBlcmZvcm1hbmNlSW5Db25zb2xlXG4gICAgICAgICkub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3Muc2hvd0xvZ0Fib3V0UGVyZm9ybWFuY2VJbkNvbnNvbGUgPSB2YWx1ZTtcbiAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIHRvZ2dsZU1hdGNoU3RyYXRlZ3koKSB7XG4gICAgc3dpdGNoICh0aGlzLnBsdWdpbi5zZXR0aW5ncy5tYXRjaFN0cmF0ZWd5KSB7XG4gICAgICBjYXNlIFwicHJlZml4XCI6XG4gICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLm1hdGNoU3RyYXRlZ3kgPSBcInBhcnRpYWxcIjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwicGFydGlhbFwiOlxuICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5tYXRjaFN0cmF0ZWd5ID0gXCJwcmVmaXhcIjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICAvLyBub2luc3BlY3Rpb24gT2JqZWN0QWxsb2NhdGlvbklnbm9yZWRcbiAgICAgICAgbmV3IE5vdGljZShcIuKaoFVuZXhwZWN0ZWQgZXJyb3JcIik7XG4gICAgfVxuICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICB9XG5cbiAgYXN5bmMgdG9nZ2xlQ29tcGxlbWVudEF1dG9tYXRpY2FsbHkoKSB7XG4gICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuY29tcGxlbWVudEF1dG9tYXRpY2FsbHkgPVxuICAgICAgIXRoaXMucGx1Z2luLnNldHRpbmdzLmNvbXBsZW1lbnRBdXRvbWF0aWNhbGx5O1xuICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICB9XG5cbiAgYXN5bmMgZW5zdXJlQ3VzdG9tRGljdGlvbmFyeVBhdGgoXG4gICAgcGF0aDogc3RyaW5nLFxuICAgIHN0YXRlOiBcInByZXNlbnRcIiB8IFwiYWJzZW50XCJcbiAgKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3QgcGF0aHMgPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy5jdXN0b21EaWN0aW9uYXJ5UGF0aHMuc3BsaXQoXCJcXG5cIik7XG4gICAgY29uc3QgZXhpc3RzID0gcGF0aHMuc29tZSgoeCkgPT4geCA9PT0gcGF0aCk7XG4gICAgaWYgKChleGlzdHMgJiYgc3RhdGUgPT09IFwicHJlc2VudFwiKSB8fCAoIWV4aXN0cyAmJiBzdGF0ZSA9PT0gXCJhYnNlbnRcIikpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCBuZXdQYXRocyA9XG4gICAgICBzdGF0ZSA9PT0gXCJwcmVzZW50XCIgPyBbLi4ucGF0aHMsIHBhdGhdIDogcGF0aHMuZmlsdGVyKCh4KSA9PiB4ICE9PSBwYXRoKTtcbiAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5jdXN0b21EaWN0aW9uYXJ5UGF0aHMgPSBuZXdQYXRocy5qb2luKFwiXFxuXCIpO1xuICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncyh7IGN1c3RvbURpY3Rpb25hcnk6IHRydWUgfSk7XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGdldFBsdWdpblNldHRpbmdzQXNKc29uU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KFxuICAgICAge1xuICAgICAgICB2ZXJzaW9uOiB0aGlzLnBsdWdpbi5tYW5pZmVzdC52ZXJzaW9uLFxuICAgICAgICBtb2JpbGU6ICh0aGlzLmFwcCBhcyBhbnkpLmlzTW9iaWxlLFxuICAgICAgICBzZXR0aW5nczogeyAuLi50aGlzLnBsdWdpbi5zZXR0aW5ncywgc2VsZWN0aW9uSGlzdG9yeVRyZWU6IG51bGwgfSxcbiAgICAgIH0sXG4gICAgICBudWxsLFxuICAgICAgNFxuICAgICk7XG4gIH1cbn1cbiIsImltcG9ydCB0eXBlIHsgTWF0Y2hTdHJhdGVneSB9IGZyb20gXCIuLi9wcm92aWRlci9NYXRjaFN0cmF0ZWd5XCI7XG5cbmV4cG9ydCBjbGFzcyBQcm92aWRlclN0YXR1c0JhciB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBjdXJyZW50RmlsZTogSFRNTEVsZW1lbnQgfCBudWxsLFxuICAgIHB1YmxpYyBjdXJyZW50VmF1bHQ6IEhUTUxFbGVtZW50IHwgbnVsbCxcbiAgICBwdWJsaWMgY3VzdG9tRGljdGlvbmFyeTogSFRNTEVsZW1lbnQgfCBudWxsLFxuICAgIHB1YmxpYyBpbnRlcm5hbExpbms6IEhUTUxFbGVtZW50IHwgbnVsbCxcbiAgICBwdWJsaWMgZnJvbnRNYXR0ZXI6IEhUTUxFbGVtZW50IHwgbnVsbCxcbiAgICBwdWJsaWMgbWF0Y2hTdHJhdGVneTogSFRNTEVsZW1lbnQgfCBudWxsLFxuICAgIHB1YmxpYyBjb21wbGVtZW50QXV0b21hdGljYWxseTogSFRNTEVsZW1lbnQgfCBudWxsXG4gICkge31cblxuICBzdGF0aWMgbmV3KFxuICAgIHN0YXR1c0JhcjogSFRNTEVsZW1lbnQsXG4gICAgc2hvd01hdGNoU3RyYXRlZ3k6IGJvb2xlYW4sXG4gICAgc2hvd0luZGV4aW5nU3RhdHVzOiBib29sZWFuLFxuICAgIHNob3dDb21wbGVtZW50QXV0b21hdGljYWxseTogYm9vbGVhblxuICApOiBQcm92aWRlclN0YXR1c0JhciB7XG4gICAgY29uc3QgY3VycmVudEZpbGUgPSBzaG93SW5kZXhpbmdTdGF0dXNcbiAgICAgID8gc3RhdHVzQmFyLmNyZWF0ZUVsKFwic3BhblwiLCB7XG4gICAgICAgICAgdGV4dDogXCItLS1cIixcbiAgICAgICAgICBjbHM6IFwidmFyaW91cy1jb21wbGVtZW50c19fZm9vdGVyIHZhcmlvdXMtY29tcGxlbWVudHNfX2Zvb3Rlcl9fY3VycmVudC1maWxlXCIsXG4gICAgICAgIH0pXG4gICAgICA6IG51bGw7XG4gICAgY29uc3QgY3VycmVudFZhdWx0ID0gc2hvd0luZGV4aW5nU3RhdHVzXG4gICAgICA/IHN0YXR1c0Jhci5jcmVhdGVFbChcInNwYW5cIiwge1xuICAgICAgICAgIHRleHQ6IFwiLS0tXCIsXG4gICAgICAgICAgY2xzOiBcInZhcmlvdXMtY29tcGxlbWVudHNfX2Zvb3RlciB2YXJpb3VzLWNvbXBsZW1lbnRzX19mb290ZXJfX2N1cnJlbnQtdmF1bHRcIixcbiAgICAgICAgfSlcbiAgICAgIDogbnVsbDtcbiAgICBjb25zdCBjdXN0b21EaWN0aW9uYXJ5ID0gc2hvd0luZGV4aW5nU3RhdHVzXG4gICAgICA/IHN0YXR1c0Jhci5jcmVhdGVFbChcInNwYW5cIiwge1xuICAgICAgICAgIHRleHQ6IFwiLS0tXCIsXG4gICAgICAgICAgY2xzOiBcInZhcmlvdXMtY29tcGxlbWVudHNfX2Zvb3RlciB2YXJpb3VzLWNvbXBsZW1lbnRzX19mb290ZXJfX2N1c3RvbS1kaWN0aW9uYXJ5XCIsXG4gICAgICAgIH0pXG4gICAgICA6IG51bGw7XG4gICAgY29uc3QgaW50ZXJuYWxMaW5rID0gc2hvd0luZGV4aW5nU3RhdHVzXG4gICAgICA/IHN0YXR1c0Jhci5jcmVhdGVFbChcInNwYW5cIiwge1xuICAgICAgICAgIHRleHQ6IFwiLS0tXCIsXG4gICAgICAgICAgY2xzOiBcInZhcmlvdXMtY29tcGxlbWVudHNfX2Zvb3RlciB2YXJpb3VzLWNvbXBsZW1lbnRzX19mb290ZXJfX2ludGVybmFsLWxpbmtcIixcbiAgICAgICAgfSlcbiAgICAgIDogbnVsbDtcbiAgICBjb25zdCBmcm9udE1hdHRlciA9IHNob3dJbmRleGluZ1N0YXR1c1xuICAgICAgPyBzdGF0dXNCYXIuY3JlYXRlRWwoXCJzcGFuXCIsIHtcbiAgICAgICAgICB0ZXh0OiBcIi0tLVwiLFxuICAgICAgICAgIGNsczogXCJ2YXJpb3VzLWNvbXBsZW1lbnRzX19mb290ZXIgdmFyaW91cy1jb21wbGVtZW50c19fZm9vdGVyX19mcm9udC1tYXR0ZXJcIixcbiAgICAgICAgfSlcbiAgICAgIDogbnVsbDtcblxuICAgIGNvbnN0IG1hdGNoU3RyYXRlZ3kgPSBzaG93TWF0Y2hTdHJhdGVneVxuICAgICAgPyBzdGF0dXNCYXIuY3JlYXRlRWwoXCJzcGFuXCIsIHtcbiAgICAgICAgICB0ZXh0OiBcIi0tLVwiLFxuICAgICAgICAgIGNsczogXCJ2YXJpb3VzLWNvbXBsZW1lbnRzX19mb290ZXIgdmFyaW91cy1jb21wbGVtZW50c19fZm9vdGVyX19tYXRjaC1zdHJhdGVneVwiLFxuICAgICAgICB9KVxuICAgICAgOiBudWxsO1xuXG4gICAgY29uc29sZS5sb2coc2hvd0NvbXBsZW1lbnRBdXRvbWF0aWNhbGx5KTtcbiAgICBjb25zdCBjb21wbGVtZW50QXV0b21hdGljYWxseSA9IHNob3dDb21wbGVtZW50QXV0b21hdGljYWxseVxuICAgICAgPyBzdGF0dXNCYXIuY3JlYXRlRWwoXCJzcGFuXCIsIHtcbiAgICAgICAgICB0ZXh0OiBcIi0tLVwiLFxuICAgICAgICAgIGNsczogXCJ2YXJpb3VzLWNvbXBsZW1lbnRzX19mb290ZXIgdmFyaW91cy1jb21wbGVtZW50c19fZm9vdGVyX19jb21wbGVtZW50LWF1dG9tYXRpY2FsbHlcIixcbiAgICAgICAgfSlcbiAgICAgIDogbnVsbDtcblxuICAgIHJldHVybiBuZXcgUHJvdmlkZXJTdGF0dXNCYXIoXG4gICAgICBjdXJyZW50RmlsZSxcbiAgICAgIGN1cnJlbnRWYXVsdCxcbiAgICAgIGN1c3RvbURpY3Rpb25hcnksXG4gICAgICBpbnRlcm5hbExpbmssXG4gICAgICBmcm9udE1hdHRlcixcbiAgICAgIG1hdGNoU3RyYXRlZ3ksXG4gICAgICBjb21wbGVtZW50QXV0b21hdGljYWxseVxuICAgICk7XG4gIH1cblxuICBzZXRPbkNsaWNrU3RyYXRlZ3lMaXN0ZW5lcihsaXN0ZW5lcjogKCkgPT4gdm9pZCkge1xuICAgIHRoaXMubWF0Y2hTdHJhdGVneT8uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGxpc3RlbmVyKTtcbiAgfVxuICBzZXRPbkNsaWNrQ29tcGxlbWVudEF1dG9tYXRpY2FsbHkobGlzdGVuZXI6ICgpID0+IHZvaWQpIHtcbiAgICB0aGlzLmNvbXBsZW1lbnRBdXRvbWF0aWNhbGx5Py5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgbGlzdGVuZXIpO1xuICB9XG5cbiAgc2V0Q3VycmVudEZpbGVEaXNhYmxlZCgpIHtcbiAgICB0aGlzLmN1cnJlbnRGaWxlPy5zZXRUZXh0KFwiLS0tXCIpO1xuICB9XG4gIHNldEN1cnJlbnRWYXVsdERpc2FibGVkKCkge1xuICAgIHRoaXMuY3VycmVudFZhdWx0Py5zZXRUZXh0KFwiLS0tXCIpO1xuICB9XG4gIHNldEN1c3RvbURpY3Rpb25hcnlEaXNhYmxlZCgpIHtcbiAgICB0aGlzLmN1c3RvbURpY3Rpb25hcnk/LnNldFRleHQoXCItLS1cIik7XG4gIH1cbiAgc2V0SW50ZXJuYWxMaW5rRGlzYWJsZWQoKSB7XG4gICAgdGhpcy5pbnRlcm5hbExpbms/LnNldFRleHQoXCItLS1cIik7XG4gIH1cbiAgc2V0RnJvbnRNYXR0ZXJEaXNhYmxlZCgpIHtcbiAgICB0aGlzLmZyb250TWF0dGVyPy5zZXRUZXh0KFwiLS0tXCIpO1xuICB9XG5cbiAgc2V0Q3VycmVudEZpbGVJbmRleGluZygpIHtcbiAgICB0aGlzLmN1cnJlbnRGaWxlPy5zZXRUZXh0KFwiaW5kZXhpbmcuLi5cIik7XG4gIH1cbiAgc2V0Q3VycmVudFZhdWx0SW5kZXhpbmcoKSB7XG4gICAgdGhpcy5jdXJyZW50VmF1bHQ/LnNldFRleHQoXCJpbmRleGluZy4uLlwiKTtcbiAgfVxuICBzZXRDdXN0b21EaWN0aW9uYXJ5SW5kZXhpbmcoKSB7XG4gICAgdGhpcy5jdXN0b21EaWN0aW9uYXJ5Py5zZXRUZXh0KFwiaW5kZXhpbmcuLi5cIik7XG4gIH1cbiAgc2V0SW50ZXJuYWxMaW5rSW5kZXhpbmcoKSB7XG4gICAgdGhpcy5pbnRlcm5hbExpbms/LnNldFRleHQoXCJpbmRleGluZy4uLlwiKTtcbiAgfVxuICBzZXRGcm9udE1hdHRlckluZGV4aW5nKCkge1xuICAgIHRoaXMuZnJvbnRNYXR0ZXI/LnNldFRleHQoXCJpbmRleGluZy4uLlwiKTtcbiAgfVxuXG4gIHNldEN1cnJlbnRGaWxlSW5kZXhlZChjb3VudDogYW55KSB7XG4gICAgdGhpcy5jdXJyZW50RmlsZT8uc2V0VGV4dChTdHJpbmcoY291bnQpKTtcbiAgfVxuICBzZXRDdXJyZW50VmF1bHRJbmRleGVkKGNvdW50OiBhbnkpIHtcbiAgICB0aGlzLmN1cnJlbnRWYXVsdD8uc2V0VGV4dChTdHJpbmcoY291bnQpKTtcbiAgfVxuICBzZXRDdXN0b21EaWN0aW9uYXJ5SW5kZXhlZChjb3VudDogYW55KSB7XG4gICAgdGhpcy5jdXN0b21EaWN0aW9uYXJ5Py5zZXRUZXh0KFN0cmluZyhjb3VudCkpO1xuICB9XG4gIHNldEludGVybmFsTGlua0luZGV4ZWQoY291bnQ6IGFueSkge1xuICAgIHRoaXMuaW50ZXJuYWxMaW5rPy5zZXRUZXh0KFN0cmluZyhjb3VudCkpO1xuICB9XG4gIHNldEZyb250TWF0dGVySW5kZXhlZChjb3VudDogYW55KSB7XG4gICAgdGhpcy5mcm9udE1hdHRlcj8uc2V0VGV4dChTdHJpbmcoY291bnQpKTtcbiAgfVxuXG4gIHNldE1hdGNoU3RyYXRlZ3koc3RyYXRlZ3k6IE1hdGNoU3RyYXRlZ3kpIHtcbiAgICB0aGlzLm1hdGNoU3RyYXRlZ3k/LnNldFRleHQoc3RyYXRlZ3kubmFtZSk7XG4gIH1cbiAgc2V0Q29tcGxlbWVudEF1dG9tYXRpY2FsbHkoYXV0b21hdGljYWxseTogYm9vbGVhbikge1xuICAgIHRoaXMuY29tcGxlbWVudEF1dG9tYXRpY2FsbHk/LnNldFRleHQoYXV0b21hdGljYWxseSA/IFwiYXV0b1wiIDogXCJtYW51YWxcIik7XG4gIH1cbn1cbiIsImZ1bmN0aW9uIG5vb3AoKSB7IH1cbmNvbnN0IGlkZW50aXR5ID0geCA9PiB4O1xuZnVuY3Rpb24gYXNzaWduKHRhciwgc3JjKSB7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGZvciAoY29uc3QgayBpbiBzcmMpXG4gICAgICAgIHRhcltrXSA9IHNyY1trXTtcbiAgICByZXR1cm4gdGFyO1xufVxuZnVuY3Rpb24gaXNfcHJvbWlzZSh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHR5cGVvZiB2YWx1ZS50aGVuID09PSAnZnVuY3Rpb24nO1xufVxuZnVuY3Rpb24gYWRkX2xvY2F0aW9uKGVsZW1lbnQsIGZpbGUsIGxpbmUsIGNvbHVtbiwgY2hhcikge1xuICAgIGVsZW1lbnQuX19zdmVsdGVfbWV0YSA9IHtcbiAgICAgICAgbG9jOiB7IGZpbGUsIGxpbmUsIGNvbHVtbiwgY2hhciB9XG4gICAgfTtcbn1cbmZ1bmN0aW9uIHJ1bihmbikge1xuICAgIHJldHVybiBmbigpO1xufVxuZnVuY3Rpb24gYmxhbmtfb2JqZWN0KCkge1xuICAgIHJldHVybiBPYmplY3QuY3JlYXRlKG51bGwpO1xufVxuZnVuY3Rpb24gcnVuX2FsbChmbnMpIHtcbiAgICBmbnMuZm9yRWFjaChydW4pO1xufVxuZnVuY3Rpb24gaXNfZnVuY3Rpb24odGhpbmcpIHtcbiAgICByZXR1cm4gdHlwZW9mIHRoaW5nID09PSAnZnVuY3Rpb24nO1xufVxuZnVuY3Rpb24gc2FmZV9ub3RfZXF1YWwoYSwgYikge1xuICAgIHJldHVybiBhICE9IGEgPyBiID09IGIgOiBhICE9PSBiIHx8ICgoYSAmJiB0eXBlb2YgYSA9PT0gJ29iamVjdCcpIHx8IHR5cGVvZiBhID09PSAnZnVuY3Rpb24nKTtcbn1cbmxldCBzcmNfdXJsX2VxdWFsX2FuY2hvcjtcbmZ1bmN0aW9uIHNyY191cmxfZXF1YWwoZWxlbWVudF9zcmMsIHVybCkge1xuICAgIGlmICghc3JjX3VybF9lcXVhbF9hbmNob3IpIHtcbiAgICAgICAgc3JjX3VybF9lcXVhbF9hbmNob3IgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgfVxuICAgIHNyY191cmxfZXF1YWxfYW5jaG9yLmhyZWYgPSB1cmw7XG4gICAgcmV0dXJuIGVsZW1lbnRfc3JjID09PSBzcmNfdXJsX2VxdWFsX2FuY2hvci5ocmVmO1xufVxuZnVuY3Rpb24gbm90X2VxdWFsKGEsIGIpIHtcbiAgICByZXR1cm4gYSAhPSBhID8gYiA9PSBiIDogYSAhPT0gYjtcbn1cbmZ1bmN0aW9uIGlzX2VtcHR5KG9iaikge1xuICAgIHJldHVybiBPYmplY3Qua2V5cyhvYmopLmxlbmd0aCA9PT0gMDtcbn1cbmZ1bmN0aW9uIHZhbGlkYXRlX3N0b3JlKHN0b3JlLCBuYW1lKSB7XG4gICAgaWYgKHN0b3JlICE9IG51bGwgJiYgdHlwZW9mIHN0b3JlLnN1YnNjcmliZSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCcke25hbWV9JyBpcyBub3QgYSBzdG9yZSB3aXRoIGEgJ3N1YnNjcmliZScgbWV0aG9kYCk7XG4gICAgfVxufVxuZnVuY3Rpb24gc3Vic2NyaWJlKHN0b3JlLCAuLi5jYWxsYmFja3MpIHtcbiAgICBpZiAoc3RvcmUgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gbm9vcDtcbiAgICB9XG4gICAgY29uc3QgdW5zdWIgPSBzdG9yZS5zdWJzY3JpYmUoLi4uY2FsbGJhY2tzKTtcbiAgICByZXR1cm4gdW5zdWIudW5zdWJzY3JpYmUgPyAoKSA9PiB1bnN1Yi51bnN1YnNjcmliZSgpIDogdW5zdWI7XG59XG5mdW5jdGlvbiBnZXRfc3RvcmVfdmFsdWUoc3RvcmUpIHtcbiAgICBsZXQgdmFsdWU7XG4gICAgc3Vic2NyaWJlKHN0b3JlLCBfID0+IHZhbHVlID0gXykoKTtcbiAgICByZXR1cm4gdmFsdWU7XG59XG5mdW5jdGlvbiBjb21wb25lbnRfc3Vic2NyaWJlKGNvbXBvbmVudCwgc3RvcmUsIGNhbGxiYWNrKSB7XG4gICAgY29tcG9uZW50LiQkLm9uX2Rlc3Ryb3kucHVzaChzdWJzY3JpYmUoc3RvcmUsIGNhbGxiYWNrKSk7XG59XG5mdW5jdGlvbiBjcmVhdGVfc2xvdChkZWZpbml0aW9uLCBjdHgsICQkc2NvcGUsIGZuKSB7XG4gICAgaWYgKGRlZmluaXRpb24pIHtcbiAgICAgICAgY29uc3Qgc2xvdF9jdHggPSBnZXRfc2xvdF9jb250ZXh0KGRlZmluaXRpb24sIGN0eCwgJCRzY29wZSwgZm4pO1xuICAgICAgICByZXR1cm4gZGVmaW5pdGlvblswXShzbG90X2N0eCk7XG4gICAgfVxufVxuZnVuY3Rpb24gZ2V0X3Nsb3RfY29udGV4dChkZWZpbml0aW9uLCBjdHgsICQkc2NvcGUsIGZuKSB7XG4gICAgcmV0dXJuIGRlZmluaXRpb25bMV0gJiYgZm5cbiAgICAgICAgPyBhc3NpZ24oJCRzY29wZS5jdHguc2xpY2UoKSwgZGVmaW5pdGlvblsxXShmbihjdHgpKSlcbiAgICAgICAgOiAkJHNjb3BlLmN0eDtcbn1cbmZ1bmN0aW9uIGdldF9zbG90X2NoYW5nZXMoZGVmaW5pdGlvbiwgJCRzY29wZSwgZGlydHksIGZuKSB7XG4gICAgaWYgKGRlZmluaXRpb25bMl0gJiYgZm4pIHtcbiAgICAgICAgY29uc3QgbGV0cyA9IGRlZmluaXRpb25bMl0oZm4oZGlydHkpKTtcbiAgICAgICAgaWYgKCQkc2NvcGUuZGlydHkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIGxldHM7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBsZXRzID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgY29uc3QgbWVyZ2VkID0gW107XG4gICAgICAgICAgICBjb25zdCBsZW4gPSBNYXRoLm1heCgkJHNjb3BlLmRpcnR5Lmxlbmd0aCwgbGV0cy5sZW5ndGgpO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkgKz0gMSkge1xuICAgICAgICAgICAgICAgIG1lcmdlZFtpXSA9ICQkc2NvcGUuZGlydHlbaV0gfCBsZXRzW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG1lcmdlZDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJCRzY29wZS5kaXJ0eSB8IGxldHM7XG4gICAgfVxuICAgIHJldHVybiAkJHNjb3BlLmRpcnR5O1xufVxuZnVuY3Rpb24gdXBkYXRlX3Nsb3RfYmFzZShzbG90LCBzbG90X2RlZmluaXRpb24sIGN0eCwgJCRzY29wZSwgc2xvdF9jaGFuZ2VzLCBnZXRfc2xvdF9jb250ZXh0X2ZuKSB7XG4gICAgaWYgKHNsb3RfY2hhbmdlcykge1xuICAgICAgICBjb25zdCBzbG90X2NvbnRleHQgPSBnZXRfc2xvdF9jb250ZXh0KHNsb3RfZGVmaW5pdGlvbiwgY3R4LCAkJHNjb3BlLCBnZXRfc2xvdF9jb250ZXh0X2ZuKTtcbiAgICAgICAgc2xvdC5wKHNsb3RfY29udGV4dCwgc2xvdF9jaGFuZ2VzKTtcbiAgICB9XG59XG5mdW5jdGlvbiB1cGRhdGVfc2xvdChzbG90LCBzbG90X2RlZmluaXRpb24sIGN0eCwgJCRzY29wZSwgZGlydHksIGdldF9zbG90X2NoYW5nZXNfZm4sIGdldF9zbG90X2NvbnRleHRfZm4pIHtcbiAgICBjb25zdCBzbG90X2NoYW5nZXMgPSBnZXRfc2xvdF9jaGFuZ2VzKHNsb3RfZGVmaW5pdGlvbiwgJCRzY29wZSwgZGlydHksIGdldF9zbG90X2NoYW5nZXNfZm4pO1xuICAgIHVwZGF0ZV9zbG90X2Jhc2Uoc2xvdCwgc2xvdF9kZWZpbml0aW9uLCBjdHgsICQkc2NvcGUsIHNsb3RfY2hhbmdlcywgZ2V0X3Nsb3RfY29udGV4dF9mbik7XG59XG5mdW5jdGlvbiBnZXRfYWxsX2RpcnR5X2Zyb21fc2NvcGUoJCRzY29wZSkge1xuICAgIGlmICgkJHNjb3BlLmN0eC5sZW5ndGggPiAzMikge1xuICAgICAgICBjb25zdCBkaXJ0eSA9IFtdO1xuICAgICAgICBjb25zdCBsZW5ndGggPSAkJHNjb3BlLmN0eC5sZW5ndGggLyAzMjtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgZGlydHlbaV0gPSAtMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGlydHk7XG4gICAgfVxuICAgIHJldHVybiAtMTtcbn1cbmZ1bmN0aW9uIGV4Y2x1ZGVfaW50ZXJuYWxfcHJvcHMocHJvcHMpIHtcbiAgICBjb25zdCByZXN1bHQgPSB7fTtcbiAgICBmb3IgKGNvbnN0IGsgaW4gcHJvcHMpXG4gICAgICAgIGlmIChrWzBdICE9PSAnJCcpXG4gICAgICAgICAgICByZXN1bHRba10gPSBwcm9wc1trXTtcbiAgICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gY29tcHV0ZV9yZXN0X3Byb3BzKHByb3BzLCBrZXlzKSB7XG4gICAgY29uc3QgcmVzdCA9IHt9O1xuICAgIGtleXMgPSBuZXcgU2V0KGtleXMpO1xuICAgIGZvciAoY29uc3QgayBpbiBwcm9wcylcbiAgICAgICAgaWYgKCFrZXlzLmhhcyhrKSAmJiBrWzBdICE9PSAnJCcpXG4gICAgICAgICAgICByZXN0W2tdID0gcHJvcHNba107XG4gICAgcmV0dXJuIHJlc3Q7XG59XG5mdW5jdGlvbiBjb21wdXRlX3Nsb3RzKHNsb3RzKSB7XG4gICAgY29uc3QgcmVzdWx0ID0ge307XG4gICAgZm9yIChjb25zdCBrZXkgaW4gc2xvdHMpIHtcbiAgICAgICAgcmVzdWx0W2tleV0gPSB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gb25jZShmbikge1xuICAgIGxldCByYW4gPSBmYWxzZTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKC4uLmFyZ3MpIHtcbiAgICAgICAgaWYgKHJhbilcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgcmFuID0gdHJ1ZTtcbiAgICAgICAgZm4uY2FsbCh0aGlzLCAuLi5hcmdzKTtcbiAgICB9O1xufVxuZnVuY3Rpb24gbnVsbF90b19lbXB0eSh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSA9PSBudWxsID8gJycgOiB2YWx1ZTtcbn1cbmZ1bmN0aW9uIHNldF9zdG9yZV92YWx1ZShzdG9yZSwgcmV0LCB2YWx1ZSkge1xuICAgIHN0b3JlLnNldCh2YWx1ZSk7XG4gICAgcmV0dXJuIHJldDtcbn1cbmNvbnN0IGhhc19wcm9wID0gKG9iaiwgcHJvcCkgPT4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCk7XG5mdW5jdGlvbiBhY3Rpb25fZGVzdHJveWVyKGFjdGlvbl9yZXN1bHQpIHtcbiAgICByZXR1cm4gYWN0aW9uX3Jlc3VsdCAmJiBpc19mdW5jdGlvbihhY3Rpb25fcmVzdWx0LmRlc3Ryb3kpID8gYWN0aW9uX3Jlc3VsdC5kZXN0cm95IDogbm9vcDtcbn1cblxuY29uc3QgaXNfY2xpZW50ID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCc7XG5sZXQgbm93ID0gaXNfY2xpZW50XG4gICAgPyAoKSA9PiB3aW5kb3cucGVyZm9ybWFuY2Uubm93KClcbiAgICA6ICgpID0+IERhdGUubm93KCk7XG5sZXQgcmFmID0gaXNfY2xpZW50ID8gY2IgPT4gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGNiKSA6IG5vb3A7XG4vLyB1c2VkIGludGVybmFsbHkgZm9yIHRlc3RpbmdcbmZ1bmN0aW9uIHNldF9ub3coZm4pIHtcbiAgICBub3cgPSBmbjtcbn1cbmZ1bmN0aW9uIHNldF9yYWYoZm4pIHtcbiAgICByYWYgPSBmbjtcbn1cblxuY29uc3QgdGFza3MgPSBuZXcgU2V0KCk7XG5mdW5jdGlvbiBydW5fdGFza3Mobm93KSB7XG4gICAgdGFza3MuZm9yRWFjaCh0YXNrID0+IHtcbiAgICAgICAgaWYgKCF0YXNrLmMobm93KSkge1xuICAgICAgICAgICAgdGFza3MuZGVsZXRlKHRhc2spO1xuICAgICAgICAgICAgdGFzay5mKCk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAodGFza3Muc2l6ZSAhPT0gMClcbiAgICAgICAgcmFmKHJ1bl90YXNrcyk7XG59XG4vKipcbiAqIEZvciB0ZXN0aW5nIHB1cnBvc2VzIG9ubHkhXG4gKi9cbmZ1bmN0aW9uIGNsZWFyX2xvb3BzKCkge1xuICAgIHRhc2tzLmNsZWFyKCk7XG59XG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgdGFzayB0aGF0IHJ1bnMgb24gZWFjaCByYWYgZnJhbWVcbiAqIHVudGlsIGl0IHJldHVybnMgYSBmYWxzeSB2YWx1ZSBvciBpcyBhYm9ydGVkXG4gKi9cbmZ1bmN0aW9uIGxvb3AoY2FsbGJhY2spIHtcbiAgICBsZXQgdGFzaztcbiAgICBpZiAodGFza3Muc2l6ZSA9PT0gMClcbiAgICAgICAgcmFmKHJ1bl90YXNrcyk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcHJvbWlzZTogbmV3IFByb21pc2UoZnVsZmlsbCA9PiB7XG4gICAgICAgICAgICB0YXNrcy5hZGQodGFzayA9IHsgYzogY2FsbGJhY2ssIGY6IGZ1bGZpbGwgfSk7XG4gICAgICAgIH0pLFxuICAgICAgICBhYm9ydCgpIHtcbiAgICAgICAgICAgIHRhc2tzLmRlbGV0ZSh0YXNrKTtcbiAgICAgICAgfVxuICAgIH07XG59XG5cbi8vIFRyYWNrIHdoaWNoIG5vZGVzIGFyZSBjbGFpbWVkIGR1cmluZyBoeWRyYXRpb24uIFVuY2xhaW1lZCBub2RlcyBjYW4gdGhlbiBiZSByZW1vdmVkIGZyb20gdGhlIERPTVxuLy8gYXQgdGhlIGVuZCBvZiBoeWRyYXRpb24gd2l0aG91dCB0b3VjaGluZyB0aGUgcmVtYWluaW5nIG5vZGVzLlxubGV0IGlzX2h5ZHJhdGluZyA9IGZhbHNlO1xuZnVuY3Rpb24gc3RhcnRfaHlkcmF0aW5nKCkge1xuICAgIGlzX2h5ZHJhdGluZyA9IHRydWU7XG59XG5mdW5jdGlvbiBlbmRfaHlkcmF0aW5nKCkge1xuICAgIGlzX2h5ZHJhdGluZyA9IGZhbHNlO1xufVxuZnVuY3Rpb24gdXBwZXJfYm91bmQobG93LCBoaWdoLCBrZXksIHZhbHVlKSB7XG4gICAgLy8gUmV0dXJuIGZpcnN0IGluZGV4IG9mIHZhbHVlIGxhcmdlciB0aGFuIGlucHV0IHZhbHVlIGluIHRoZSByYW5nZSBbbG93LCBoaWdoKVxuICAgIHdoaWxlIChsb3cgPCBoaWdoKSB7XG4gICAgICAgIGNvbnN0IG1pZCA9IGxvdyArICgoaGlnaCAtIGxvdykgPj4gMSk7XG4gICAgICAgIGlmIChrZXkobWlkKSA8PSB2YWx1ZSkge1xuICAgICAgICAgICAgbG93ID0gbWlkICsgMTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGhpZ2ggPSBtaWQ7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGxvdztcbn1cbmZ1bmN0aW9uIGluaXRfaHlkcmF0ZSh0YXJnZXQpIHtcbiAgICBpZiAodGFyZ2V0Lmh5ZHJhdGVfaW5pdClcbiAgICAgICAgcmV0dXJuO1xuICAgIHRhcmdldC5oeWRyYXRlX2luaXQgPSB0cnVlO1xuICAgIC8vIFdlIGtub3cgdGhhdCBhbGwgY2hpbGRyZW4gaGF2ZSBjbGFpbV9vcmRlciB2YWx1ZXMgc2luY2UgdGhlIHVuY2xhaW1lZCBoYXZlIGJlZW4gZGV0YWNoZWQgaWYgdGFyZ2V0IGlzIG5vdCA8aGVhZD5cbiAgICBsZXQgY2hpbGRyZW4gPSB0YXJnZXQuY2hpbGROb2RlcztcbiAgICAvLyBJZiB0YXJnZXQgaXMgPGhlYWQ+LCB0aGVyZSBtYXkgYmUgY2hpbGRyZW4gd2l0aG91dCBjbGFpbV9vcmRlclxuICAgIGlmICh0YXJnZXQubm9kZU5hbWUgPT09ICdIRUFEJykge1xuICAgICAgICBjb25zdCBteUNoaWxkcmVuID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IG5vZGUgPSBjaGlsZHJlbltpXTtcbiAgICAgICAgICAgIGlmIChub2RlLmNsYWltX29yZGVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBteUNoaWxkcmVuLnB1c2gobm9kZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY2hpbGRyZW4gPSBteUNoaWxkcmVuO1xuICAgIH1cbiAgICAvKlxuICAgICogUmVvcmRlciBjbGFpbWVkIGNoaWxkcmVuIG9wdGltYWxseS5cbiAgICAqIFdlIGNhbiByZW9yZGVyIGNsYWltZWQgY2hpbGRyZW4gb3B0aW1hbGx5IGJ5IGZpbmRpbmcgdGhlIGxvbmdlc3Qgc3Vic2VxdWVuY2Ugb2ZcbiAgICAqIG5vZGVzIHRoYXQgYXJlIGFscmVhZHkgY2xhaW1lZCBpbiBvcmRlciBhbmQgb25seSBtb3ZpbmcgdGhlIHJlc3QuIFRoZSBsb25nZXN0XG4gICAgKiBzdWJzZXF1ZW5jZSBzdWJzZXF1ZW5jZSBvZiBub2RlcyB0aGF0IGFyZSBjbGFpbWVkIGluIG9yZGVyIGNhbiBiZSBmb3VuZCBieVxuICAgICogY29tcHV0aW5nIHRoZSBsb25nZXN0IGluY3JlYXNpbmcgc3Vic2VxdWVuY2Ugb2YgLmNsYWltX29yZGVyIHZhbHVlcy5cbiAgICAqXG4gICAgKiBUaGlzIGFsZ29yaXRobSBpcyBvcHRpbWFsIGluIGdlbmVyYXRpbmcgdGhlIGxlYXN0IGFtb3VudCBvZiByZW9yZGVyIG9wZXJhdGlvbnNcbiAgICAqIHBvc3NpYmxlLlxuICAgICpcbiAgICAqIFByb29mOlxuICAgICogV2Uga25vdyB0aGF0LCBnaXZlbiBhIHNldCBvZiByZW9yZGVyaW5nIG9wZXJhdGlvbnMsIHRoZSBub2RlcyB0aGF0IGRvIG5vdCBtb3ZlXG4gICAgKiBhbHdheXMgZm9ybSBhbiBpbmNyZWFzaW5nIHN1YnNlcXVlbmNlLCBzaW5jZSB0aGV5IGRvIG5vdCBtb3ZlIGFtb25nIGVhY2ggb3RoZXJcbiAgICAqIG1lYW5pbmcgdGhhdCB0aGV5IG11c3QgYmUgYWxyZWFkeSBvcmRlcmVkIGFtb25nIGVhY2ggb3RoZXIuIFRodXMsIHRoZSBtYXhpbWFsXG4gICAgKiBzZXQgb2Ygbm9kZXMgdGhhdCBkbyBub3QgbW92ZSBmb3JtIGEgbG9uZ2VzdCBpbmNyZWFzaW5nIHN1YnNlcXVlbmNlLlxuICAgICovXG4gICAgLy8gQ29tcHV0ZSBsb25nZXN0IGluY3JlYXNpbmcgc3Vic2VxdWVuY2VcbiAgICAvLyBtOiBzdWJzZXF1ZW5jZSBsZW5ndGggaiA9PiBpbmRleCBrIG9mIHNtYWxsZXN0IHZhbHVlIHRoYXQgZW5kcyBhbiBpbmNyZWFzaW5nIHN1YnNlcXVlbmNlIG9mIGxlbmd0aCBqXG4gICAgY29uc3QgbSA9IG5ldyBJbnQzMkFycmF5KGNoaWxkcmVuLmxlbmd0aCArIDEpO1xuICAgIC8vIFByZWRlY2Vzc29yIGluZGljZXMgKyAxXG4gICAgY29uc3QgcCA9IG5ldyBJbnQzMkFycmF5KGNoaWxkcmVuLmxlbmd0aCk7XG4gICAgbVswXSA9IC0xO1xuICAgIGxldCBsb25nZXN0ID0gMDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGN1cnJlbnQgPSBjaGlsZHJlbltpXS5jbGFpbV9vcmRlcjtcbiAgICAgICAgLy8gRmluZCB0aGUgbGFyZ2VzdCBzdWJzZXF1ZW5jZSBsZW5ndGggc3VjaCB0aGF0IGl0IGVuZHMgaW4gYSB2YWx1ZSBsZXNzIHRoYW4gb3VyIGN1cnJlbnQgdmFsdWVcbiAgICAgICAgLy8gdXBwZXJfYm91bmQgcmV0dXJucyBmaXJzdCBncmVhdGVyIHZhbHVlLCBzbyB3ZSBzdWJ0cmFjdCBvbmVcbiAgICAgICAgLy8gd2l0aCBmYXN0IHBhdGggZm9yIHdoZW4gd2UgYXJlIG9uIHRoZSBjdXJyZW50IGxvbmdlc3Qgc3Vic2VxdWVuY2VcbiAgICAgICAgY29uc3Qgc2VxTGVuID0gKChsb25nZXN0ID4gMCAmJiBjaGlsZHJlblttW2xvbmdlc3RdXS5jbGFpbV9vcmRlciA8PSBjdXJyZW50KSA/IGxvbmdlc3QgKyAxIDogdXBwZXJfYm91bmQoMSwgbG9uZ2VzdCwgaWR4ID0+IGNoaWxkcmVuW21baWR4XV0uY2xhaW1fb3JkZXIsIGN1cnJlbnQpKSAtIDE7XG4gICAgICAgIHBbaV0gPSBtW3NlcUxlbl0gKyAxO1xuICAgICAgICBjb25zdCBuZXdMZW4gPSBzZXFMZW4gKyAxO1xuICAgICAgICAvLyBXZSBjYW4gZ3VhcmFudGVlIHRoYXQgY3VycmVudCBpcyB0aGUgc21hbGxlc3QgdmFsdWUuIE90aGVyd2lzZSwgd2Ugd291bGQgaGF2ZSBnZW5lcmF0ZWQgYSBsb25nZXIgc2VxdWVuY2UuXG4gICAgICAgIG1bbmV3TGVuXSA9IGk7XG4gICAgICAgIGxvbmdlc3QgPSBNYXRoLm1heChuZXdMZW4sIGxvbmdlc3QpO1xuICAgIH1cbiAgICAvLyBUaGUgbG9uZ2VzdCBpbmNyZWFzaW5nIHN1YnNlcXVlbmNlIG9mIG5vZGVzIChpbml0aWFsbHkgcmV2ZXJzZWQpXG4gICAgY29uc3QgbGlzID0gW107XG4gICAgLy8gVGhlIHJlc3Qgb2YgdGhlIG5vZGVzLCBub2RlcyB0aGF0IHdpbGwgYmUgbW92ZWRcbiAgICBjb25zdCB0b01vdmUgPSBbXTtcbiAgICBsZXQgbGFzdCA9IGNoaWxkcmVuLmxlbmd0aCAtIDE7XG4gICAgZm9yIChsZXQgY3VyID0gbVtsb25nZXN0XSArIDE7IGN1ciAhPSAwOyBjdXIgPSBwW2N1ciAtIDFdKSB7XG4gICAgICAgIGxpcy5wdXNoKGNoaWxkcmVuW2N1ciAtIDFdKTtcbiAgICAgICAgZm9yICg7IGxhc3QgPj0gY3VyOyBsYXN0LS0pIHtcbiAgICAgICAgICAgIHRvTW92ZS5wdXNoKGNoaWxkcmVuW2xhc3RdKTtcbiAgICAgICAgfVxuICAgICAgICBsYXN0LS07XG4gICAgfVxuICAgIGZvciAoOyBsYXN0ID49IDA7IGxhc3QtLSkge1xuICAgICAgICB0b01vdmUucHVzaChjaGlsZHJlbltsYXN0XSk7XG4gICAgfVxuICAgIGxpcy5yZXZlcnNlKCk7XG4gICAgLy8gV2Ugc29ydCB0aGUgbm9kZXMgYmVpbmcgbW92ZWQgdG8gZ3VhcmFudGVlIHRoYXQgdGhlaXIgaW5zZXJ0aW9uIG9yZGVyIG1hdGNoZXMgdGhlIGNsYWltIG9yZGVyXG4gICAgdG9Nb3ZlLnNvcnQoKGEsIGIpID0+IGEuY2xhaW1fb3JkZXIgLSBiLmNsYWltX29yZGVyKTtcbiAgICAvLyBGaW5hbGx5LCB3ZSBtb3ZlIHRoZSBub2Rlc1xuICAgIGZvciAobGV0IGkgPSAwLCBqID0gMDsgaSA8IHRvTW92ZS5sZW5ndGg7IGkrKykge1xuICAgICAgICB3aGlsZSAoaiA8IGxpcy5sZW5ndGggJiYgdG9Nb3ZlW2ldLmNsYWltX29yZGVyID49IGxpc1tqXS5jbGFpbV9vcmRlcikge1xuICAgICAgICAgICAgaisrO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGFuY2hvciA9IGogPCBsaXMubGVuZ3RoID8gbGlzW2pdIDogbnVsbDtcbiAgICAgICAgdGFyZ2V0Lmluc2VydEJlZm9yZSh0b01vdmVbaV0sIGFuY2hvcik7XG4gICAgfVxufVxuZnVuY3Rpb24gYXBwZW5kKHRhcmdldCwgbm9kZSkge1xuICAgIHRhcmdldC5hcHBlbmRDaGlsZChub2RlKTtcbn1cbmZ1bmN0aW9uIGFwcGVuZF9zdHlsZXModGFyZ2V0LCBzdHlsZV9zaGVldF9pZCwgc3R5bGVzKSB7XG4gICAgY29uc3QgYXBwZW5kX3N0eWxlc190byA9IGdldF9yb290X2Zvcl9zdHlsZSh0YXJnZXQpO1xuICAgIGlmICghYXBwZW5kX3N0eWxlc190by5nZXRFbGVtZW50QnlJZChzdHlsZV9zaGVldF9pZCkpIHtcbiAgICAgICAgY29uc3Qgc3R5bGUgPSBlbGVtZW50KCdzdHlsZScpO1xuICAgICAgICBzdHlsZS5pZCA9IHN0eWxlX3NoZWV0X2lkO1xuICAgICAgICBzdHlsZS50ZXh0Q29udGVudCA9IHN0eWxlcztcbiAgICAgICAgYXBwZW5kX3N0eWxlc2hlZXQoYXBwZW5kX3N0eWxlc190bywgc3R5bGUpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGdldF9yb290X2Zvcl9zdHlsZShub2RlKSB7XG4gICAgaWYgKCFub2RlKVxuICAgICAgICByZXR1cm4gZG9jdW1lbnQ7XG4gICAgY29uc3Qgcm9vdCA9IG5vZGUuZ2V0Um9vdE5vZGUgPyBub2RlLmdldFJvb3ROb2RlKCkgOiBub2RlLm93bmVyRG9jdW1lbnQ7XG4gICAgaWYgKHJvb3QgJiYgcm9vdC5ob3N0KSB7XG4gICAgICAgIHJldHVybiByb290O1xuICAgIH1cbiAgICByZXR1cm4gbm9kZS5vd25lckRvY3VtZW50O1xufVxuZnVuY3Rpb24gYXBwZW5kX2VtcHR5X3N0eWxlc2hlZXQobm9kZSkge1xuICAgIGNvbnN0IHN0eWxlX2VsZW1lbnQgPSBlbGVtZW50KCdzdHlsZScpO1xuICAgIGFwcGVuZF9zdHlsZXNoZWV0KGdldF9yb290X2Zvcl9zdHlsZShub2RlKSwgc3R5bGVfZWxlbWVudCk7XG4gICAgcmV0dXJuIHN0eWxlX2VsZW1lbnQuc2hlZXQ7XG59XG5mdW5jdGlvbiBhcHBlbmRfc3R5bGVzaGVldChub2RlLCBzdHlsZSkge1xuICAgIGFwcGVuZChub2RlLmhlYWQgfHwgbm9kZSwgc3R5bGUpO1xufVxuZnVuY3Rpb24gYXBwZW5kX2h5ZHJhdGlvbih0YXJnZXQsIG5vZGUpIHtcbiAgICBpZiAoaXNfaHlkcmF0aW5nKSB7XG4gICAgICAgIGluaXRfaHlkcmF0ZSh0YXJnZXQpO1xuICAgICAgICBpZiAoKHRhcmdldC5hY3R1YWxfZW5kX2NoaWxkID09PSB1bmRlZmluZWQpIHx8ICgodGFyZ2V0LmFjdHVhbF9lbmRfY2hpbGQgIT09IG51bGwpICYmICh0YXJnZXQuYWN0dWFsX2VuZF9jaGlsZC5wYXJlbnRFbGVtZW50ICE9PSB0YXJnZXQpKSkge1xuICAgICAgICAgICAgdGFyZ2V0LmFjdHVhbF9lbmRfY2hpbGQgPSB0YXJnZXQuZmlyc3RDaGlsZDtcbiAgICAgICAgfVxuICAgICAgICAvLyBTa2lwIG5vZGVzIG9mIHVuZGVmaW5lZCBvcmRlcmluZ1xuICAgICAgICB3aGlsZSAoKHRhcmdldC5hY3R1YWxfZW5kX2NoaWxkICE9PSBudWxsKSAmJiAodGFyZ2V0LmFjdHVhbF9lbmRfY2hpbGQuY2xhaW1fb3JkZXIgPT09IHVuZGVmaW5lZCkpIHtcbiAgICAgICAgICAgIHRhcmdldC5hY3R1YWxfZW5kX2NoaWxkID0gdGFyZ2V0LmFjdHVhbF9lbmRfY2hpbGQubmV4dFNpYmxpbmc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5vZGUgIT09IHRhcmdldC5hY3R1YWxfZW5kX2NoaWxkKSB7XG4gICAgICAgICAgICAvLyBXZSBvbmx5IGluc2VydCBpZiB0aGUgb3JkZXJpbmcgb2YgdGhpcyBub2RlIHNob3VsZCBiZSBtb2RpZmllZCBvciB0aGUgcGFyZW50IG5vZGUgaXMgbm90IHRhcmdldFxuICAgICAgICAgICAgaWYgKG5vZGUuY2xhaW1fb3JkZXIgIT09IHVuZGVmaW5lZCB8fCBub2RlLnBhcmVudE5vZGUgIT09IHRhcmdldCkge1xuICAgICAgICAgICAgICAgIHRhcmdldC5pbnNlcnRCZWZvcmUobm9kZSwgdGFyZ2V0LmFjdHVhbF9lbmRfY2hpbGQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGFyZ2V0LmFjdHVhbF9lbmRfY2hpbGQgPSBub2RlLm5leHRTaWJsaW5nO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKG5vZGUucGFyZW50Tm9kZSAhPT0gdGFyZ2V0IHx8IG5vZGUubmV4dFNpYmxpbmcgIT09IG51bGwpIHtcbiAgICAgICAgdGFyZ2V0LmFwcGVuZENoaWxkKG5vZGUpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGluc2VydCh0YXJnZXQsIG5vZGUsIGFuY2hvcikge1xuICAgIHRhcmdldC5pbnNlcnRCZWZvcmUobm9kZSwgYW5jaG9yIHx8IG51bGwpO1xufVxuZnVuY3Rpb24gaW5zZXJ0X2h5ZHJhdGlvbih0YXJnZXQsIG5vZGUsIGFuY2hvcikge1xuICAgIGlmIChpc19oeWRyYXRpbmcgJiYgIWFuY2hvcikge1xuICAgICAgICBhcHBlbmRfaHlkcmF0aW9uKHRhcmdldCwgbm9kZSk7XG4gICAgfVxuICAgIGVsc2UgaWYgKG5vZGUucGFyZW50Tm9kZSAhPT0gdGFyZ2V0IHx8IG5vZGUubmV4dFNpYmxpbmcgIT0gYW5jaG9yKSB7XG4gICAgICAgIHRhcmdldC5pbnNlcnRCZWZvcmUobm9kZSwgYW5jaG9yIHx8IG51bGwpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGRldGFjaChub2RlKSB7XG4gICAgbm9kZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG5vZGUpO1xufVxuZnVuY3Rpb24gZGVzdHJveV9lYWNoKGl0ZXJhdGlvbnMsIGRldGFjaGluZykge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaXRlcmF0aW9ucy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBpZiAoaXRlcmF0aW9uc1tpXSlcbiAgICAgICAgICAgIGl0ZXJhdGlvbnNbaV0uZChkZXRhY2hpbmcpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGVsZW1lbnQobmFtZSkge1xuICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KG5hbWUpO1xufVxuZnVuY3Rpb24gZWxlbWVudF9pcyhuYW1lLCBpcykge1xuICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KG5hbWUsIHsgaXMgfSk7XG59XG5mdW5jdGlvbiBvYmplY3Rfd2l0aG91dF9wcm9wZXJ0aWVzKG9iaiwgZXhjbHVkZSkge1xuICAgIGNvbnN0IHRhcmdldCA9IHt9O1xuICAgIGZvciAoY29uc3QgayBpbiBvYmopIHtcbiAgICAgICAgaWYgKGhhc19wcm9wKG9iaiwgaylcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgICYmIGV4Y2x1ZGUuaW5kZXhPZihrKSA9PT0gLTEpIHtcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgIHRhcmdldFtrXSA9IG9ialtrXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGFyZ2V0O1xufVxuZnVuY3Rpb24gc3ZnX2VsZW1lbnQobmFtZSkge1xuICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgbmFtZSk7XG59XG5mdW5jdGlvbiB0ZXh0KGRhdGEpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoZGF0YSk7XG59XG5mdW5jdGlvbiBzcGFjZSgpIHtcbiAgICByZXR1cm4gdGV4dCgnICcpO1xufVxuZnVuY3Rpb24gZW1wdHkoKSB7XG4gICAgcmV0dXJuIHRleHQoJycpO1xufVxuZnVuY3Rpb24gbGlzdGVuKG5vZGUsIGV2ZW50LCBoYW5kbGVyLCBvcHRpb25zKSB7XG4gICAgbm9kZS5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBoYW5kbGVyLCBvcHRpb25zKTtcbiAgICByZXR1cm4gKCkgPT4gbm9kZS5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50LCBoYW5kbGVyLCBvcHRpb25zKTtcbn1cbmZ1bmN0aW9uIHByZXZlbnRfZGVmYXVsdChmbikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICByZXR1cm4gZm4uY2FsbCh0aGlzLCBldmVudCk7XG4gICAgfTtcbn1cbmZ1bmN0aW9uIHN0b3BfcHJvcGFnYXRpb24oZm4pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIHJldHVybiBmbi5jYWxsKHRoaXMsIGV2ZW50KTtcbiAgICB9O1xufVxuZnVuY3Rpb24gc2VsZihmbikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICBpZiAoZXZlbnQudGFyZ2V0ID09PSB0aGlzKVxuICAgICAgICAgICAgZm4uY2FsbCh0aGlzLCBldmVudCk7XG4gICAgfTtcbn1cbmZ1bmN0aW9uIHRydXN0ZWQoZm4pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgaWYgKGV2ZW50LmlzVHJ1c3RlZClcbiAgICAgICAgICAgIGZuLmNhbGwodGhpcywgZXZlbnQpO1xuICAgIH07XG59XG5mdW5jdGlvbiBhdHRyKG5vZGUsIGF0dHJpYnV0ZSwgdmFsdWUpIHtcbiAgICBpZiAodmFsdWUgPT0gbnVsbClcbiAgICAgICAgbm9kZS5yZW1vdmVBdHRyaWJ1dGUoYXR0cmlidXRlKTtcbiAgICBlbHNlIGlmIChub2RlLmdldEF0dHJpYnV0ZShhdHRyaWJ1dGUpICE9PSB2YWx1ZSlcbiAgICAgICAgbm9kZS5zZXRBdHRyaWJ1dGUoYXR0cmlidXRlLCB2YWx1ZSk7XG59XG5mdW5jdGlvbiBzZXRfYXR0cmlidXRlcyhub2RlLCBhdHRyaWJ1dGVzKSB7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGNvbnN0IGRlc2NyaXB0b3JzID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMobm9kZS5fX3Byb3RvX18pO1xuICAgIGZvciAoY29uc3Qga2V5IGluIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgaWYgKGF0dHJpYnV0ZXNba2V5XSA9PSBudWxsKSB7XG4gICAgICAgICAgICBub2RlLnJlbW92ZUF0dHJpYnV0ZShrZXkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGtleSA9PT0gJ3N0eWxlJykge1xuICAgICAgICAgICAgbm9kZS5zdHlsZS5jc3NUZXh0ID0gYXR0cmlidXRlc1trZXldO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGtleSA9PT0gJ19fdmFsdWUnKSB7XG4gICAgICAgICAgICBub2RlLnZhbHVlID0gbm9kZVtrZXldID0gYXR0cmlidXRlc1trZXldO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGRlc2NyaXB0b3JzW2tleV0gJiYgZGVzY3JpcHRvcnNba2V5XS5zZXQpIHtcbiAgICAgICAgICAgIG5vZGVba2V5XSA9IGF0dHJpYnV0ZXNba2V5XTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGF0dHIobm9kZSwga2V5LCBhdHRyaWJ1dGVzW2tleV0pO1xuICAgICAgICB9XG4gICAgfVxufVxuZnVuY3Rpb24gc2V0X3N2Z19hdHRyaWJ1dGVzKG5vZGUsIGF0dHJpYnV0ZXMpIHtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBhdHRyaWJ1dGVzKSB7XG4gICAgICAgIGF0dHIobm9kZSwga2V5LCBhdHRyaWJ1dGVzW2tleV0pO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHNldF9jdXN0b21fZWxlbWVudF9kYXRhKG5vZGUsIHByb3AsIHZhbHVlKSB7XG4gICAgaWYgKHByb3AgaW4gbm9kZSkge1xuICAgICAgICBub2RlW3Byb3BdID0gdHlwZW9mIG5vZGVbcHJvcF0gPT09ICdib29sZWFuJyAmJiB2YWx1ZSA9PT0gJycgPyB0cnVlIDogdmFsdWU7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBhdHRyKG5vZGUsIHByb3AsIHZhbHVlKTtcbiAgICB9XG59XG5mdW5jdGlvbiB4bGlua19hdHRyKG5vZGUsIGF0dHJpYnV0ZSwgdmFsdWUpIHtcbiAgICBub2RlLnNldEF0dHJpYnV0ZU5TKCdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJywgYXR0cmlidXRlLCB2YWx1ZSk7XG59XG5mdW5jdGlvbiBnZXRfYmluZGluZ19ncm91cF92YWx1ZShncm91cCwgX192YWx1ZSwgY2hlY2tlZCkge1xuICAgIGNvbnN0IHZhbHVlID0gbmV3IFNldCgpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZ3JvdXAubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgaWYgKGdyb3VwW2ldLmNoZWNrZWQpXG4gICAgICAgICAgICB2YWx1ZS5hZGQoZ3JvdXBbaV0uX192YWx1ZSk7XG4gICAgfVxuICAgIGlmICghY2hlY2tlZCkge1xuICAgICAgICB2YWx1ZS5kZWxldGUoX192YWx1ZSk7XG4gICAgfVxuICAgIHJldHVybiBBcnJheS5mcm9tKHZhbHVlKTtcbn1cbmZ1bmN0aW9uIHRvX251bWJlcih2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gJycgPyBudWxsIDogK3ZhbHVlO1xufVxuZnVuY3Rpb24gdGltZV9yYW5nZXNfdG9fYXJyYXkocmFuZ2VzKSB7XG4gICAgY29uc3QgYXJyYXkgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJhbmdlcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBhcnJheS5wdXNoKHsgc3RhcnQ6IHJhbmdlcy5zdGFydChpKSwgZW5kOiByYW5nZXMuZW5kKGkpIH0pO1xuICAgIH1cbiAgICByZXR1cm4gYXJyYXk7XG59XG5mdW5jdGlvbiBjaGlsZHJlbihlbGVtZW50KSB7XG4gICAgcmV0dXJuIEFycmF5LmZyb20oZWxlbWVudC5jaGlsZE5vZGVzKTtcbn1cbmZ1bmN0aW9uIGluaXRfY2xhaW1faW5mbyhub2Rlcykge1xuICAgIGlmIChub2Rlcy5jbGFpbV9pbmZvID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgbm9kZXMuY2xhaW1faW5mbyA9IHsgbGFzdF9pbmRleDogMCwgdG90YWxfY2xhaW1lZDogMCB9O1xuICAgIH1cbn1cbmZ1bmN0aW9uIGNsYWltX25vZGUobm9kZXMsIHByZWRpY2F0ZSwgcHJvY2Vzc05vZGUsIGNyZWF0ZU5vZGUsIGRvbnRVcGRhdGVMYXN0SW5kZXggPSBmYWxzZSkge1xuICAgIC8vIFRyeSB0byBmaW5kIG5vZGVzIGluIGFuIG9yZGVyIHN1Y2ggdGhhdCB3ZSBsZW5ndGhlbiB0aGUgbG9uZ2VzdCBpbmNyZWFzaW5nIHN1YnNlcXVlbmNlXG4gICAgaW5pdF9jbGFpbV9pbmZvKG5vZGVzKTtcbiAgICBjb25zdCByZXN1bHROb2RlID0gKCgpID0+IHtcbiAgICAgICAgLy8gV2UgZmlyc3QgdHJ5IHRvIGZpbmQgYW4gZWxlbWVudCBhZnRlciB0aGUgcHJldmlvdXMgb25lXG4gICAgICAgIGZvciAobGV0IGkgPSBub2Rlcy5jbGFpbV9pbmZvLmxhc3RfaW5kZXg7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3Qgbm9kZSA9IG5vZGVzW2ldO1xuICAgICAgICAgICAgaWYgKHByZWRpY2F0ZShub2RlKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlcGxhY2VtZW50ID0gcHJvY2Vzc05vZGUobm9kZSk7XG4gICAgICAgICAgICAgICAgaWYgKHJlcGxhY2VtZW50ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgbm9kZXMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbm9kZXNbaV0gPSByZXBsYWNlbWVudDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCFkb250VXBkYXRlTGFzdEluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgIG5vZGVzLmNsYWltX2luZm8ubGFzdF9pbmRleCA9IGk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBub2RlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIE90aGVyd2lzZSwgd2UgdHJ5IHRvIGZpbmQgb25lIGJlZm9yZVxuICAgICAgICAvLyBXZSBpdGVyYXRlIGluIHJldmVyc2Ugc28gdGhhdCB3ZSBkb24ndCBnbyB0b28gZmFyIGJhY2tcbiAgICAgICAgZm9yIChsZXQgaSA9IG5vZGVzLmNsYWltX2luZm8ubGFzdF9pbmRleCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICBjb25zdCBub2RlID0gbm9kZXNbaV07XG4gICAgICAgICAgICBpZiAocHJlZGljYXRlKG5vZGUpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVwbGFjZW1lbnQgPSBwcm9jZXNzTm9kZShub2RlKTtcbiAgICAgICAgICAgICAgICBpZiAocmVwbGFjZW1lbnQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBub2Rlcy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBub2Rlc1tpXSA9IHJlcGxhY2VtZW50O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIWRvbnRVcGRhdGVMYXN0SW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgbm9kZXMuY2xhaW1faW5mby5sYXN0X2luZGV4ID0gaTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAocmVwbGFjZW1lbnQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBTaW5jZSB3ZSBzcGxpY2VkIGJlZm9yZSB0aGUgbGFzdF9pbmRleCwgd2UgZGVjcmVhc2UgaXRcbiAgICAgICAgICAgICAgICAgICAgbm9kZXMuY2xhaW1faW5mby5sYXN0X2luZGV4LS07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBub2RlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIElmIHdlIGNhbid0IGZpbmQgYW55IG1hdGNoaW5nIG5vZGUsIHdlIGNyZWF0ZSBhIG5ldyBvbmVcbiAgICAgICAgcmV0dXJuIGNyZWF0ZU5vZGUoKTtcbiAgICB9KSgpO1xuICAgIHJlc3VsdE5vZGUuY2xhaW1fb3JkZXIgPSBub2Rlcy5jbGFpbV9pbmZvLnRvdGFsX2NsYWltZWQ7XG4gICAgbm9kZXMuY2xhaW1faW5mby50b3RhbF9jbGFpbWVkICs9IDE7XG4gICAgcmV0dXJuIHJlc3VsdE5vZGU7XG59XG5mdW5jdGlvbiBjbGFpbV9lbGVtZW50X2Jhc2Uobm9kZXMsIG5hbWUsIGF0dHJpYnV0ZXMsIGNyZWF0ZV9lbGVtZW50KSB7XG4gICAgcmV0dXJuIGNsYWltX25vZGUobm9kZXMsIChub2RlKSA9PiBub2RlLm5vZGVOYW1lID09PSBuYW1lLCAobm9kZSkgPT4ge1xuICAgICAgICBjb25zdCByZW1vdmUgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBub2RlLmF0dHJpYnV0ZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGF0dHJpYnV0ZSA9IG5vZGUuYXR0cmlidXRlc1tqXTtcbiAgICAgICAgICAgIGlmICghYXR0cmlidXRlc1thdHRyaWJ1dGUubmFtZV0pIHtcbiAgICAgICAgICAgICAgICByZW1vdmUucHVzaChhdHRyaWJ1dGUubmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmVtb3ZlLmZvckVhY2godiA9PiBub2RlLnJlbW92ZUF0dHJpYnV0ZSh2KSk7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfSwgKCkgPT4gY3JlYXRlX2VsZW1lbnQobmFtZSkpO1xufVxuZnVuY3Rpb24gY2xhaW1fZWxlbWVudChub2RlcywgbmFtZSwgYXR0cmlidXRlcykge1xuICAgIHJldHVybiBjbGFpbV9lbGVtZW50X2Jhc2Uobm9kZXMsIG5hbWUsIGF0dHJpYnV0ZXMsIGVsZW1lbnQpO1xufVxuZnVuY3Rpb24gY2xhaW1fc3ZnX2VsZW1lbnQobm9kZXMsIG5hbWUsIGF0dHJpYnV0ZXMpIHtcbiAgICByZXR1cm4gY2xhaW1fZWxlbWVudF9iYXNlKG5vZGVzLCBuYW1lLCBhdHRyaWJ1dGVzLCBzdmdfZWxlbWVudCk7XG59XG5mdW5jdGlvbiBjbGFpbV90ZXh0KG5vZGVzLCBkYXRhKSB7XG4gICAgcmV0dXJuIGNsYWltX25vZGUobm9kZXMsIChub2RlKSA9PiBub2RlLm5vZGVUeXBlID09PSAzLCAobm9kZSkgPT4ge1xuICAgICAgICBjb25zdCBkYXRhU3RyID0gJycgKyBkYXRhO1xuICAgICAgICBpZiAobm9kZS5kYXRhLnN0YXJ0c1dpdGgoZGF0YVN0cikpIHtcbiAgICAgICAgICAgIGlmIChub2RlLmRhdGEubGVuZ3RoICE9PSBkYXRhU3RyLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBub2RlLnNwbGl0VGV4dChkYXRhU3RyLmxlbmd0aCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBub2RlLmRhdGEgPSBkYXRhU3RyO1xuICAgICAgICB9XG4gICAgfSwgKCkgPT4gdGV4dChkYXRhKSwgdHJ1ZSAvLyBUZXh0IG5vZGVzIHNob3VsZCBub3QgdXBkYXRlIGxhc3QgaW5kZXggc2luY2UgaXQgaXMgbGlrZWx5IG5vdCB3b3J0aCBpdCB0byBlbGltaW5hdGUgYW4gaW5jcmVhc2luZyBzdWJzZXF1ZW5jZSBvZiBhY3R1YWwgZWxlbWVudHNcbiAgICApO1xufVxuZnVuY3Rpb24gY2xhaW1fc3BhY2Uobm9kZXMpIHtcbiAgICByZXR1cm4gY2xhaW1fdGV4dChub2RlcywgJyAnKTtcbn1cbmZ1bmN0aW9uIGZpbmRfY29tbWVudChub2RlcywgdGV4dCwgc3RhcnQpIHtcbiAgICBmb3IgKGxldCBpID0gc3RhcnQ7IGkgPCBub2Rlcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBjb25zdCBub2RlID0gbm9kZXNbaV07XG4gICAgICAgIGlmIChub2RlLm5vZGVUeXBlID09PSA4IC8qIGNvbW1lbnQgbm9kZSAqLyAmJiBub2RlLnRleHRDb250ZW50LnRyaW0oKSA9PT0gdGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5vZGVzLmxlbmd0aDtcbn1cbmZ1bmN0aW9uIGNsYWltX2h0bWxfdGFnKG5vZGVzLCBpc19zdmcpIHtcbiAgICAvLyBmaW5kIGh0bWwgb3BlbmluZyB0YWdcbiAgICBjb25zdCBzdGFydF9pbmRleCA9IGZpbmRfY29tbWVudChub2RlcywgJ0hUTUxfVEFHX1NUQVJUJywgMCk7XG4gICAgY29uc3QgZW5kX2luZGV4ID0gZmluZF9jb21tZW50KG5vZGVzLCAnSFRNTF9UQUdfRU5EJywgc3RhcnRfaW5kZXgpO1xuICAgIGlmIChzdGFydF9pbmRleCA9PT0gZW5kX2luZGV4KSB7XG4gICAgICAgIHJldHVybiBuZXcgSHRtbFRhZ0h5ZHJhdGlvbih1bmRlZmluZWQsIGlzX3N2Zyk7XG4gICAgfVxuICAgIGluaXRfY2xhaW1faW5mbyhub2Rlcyk7XG4gICAgY29uc3QgaHRtbF90YWdfbm9kZXMgPSBub2Rlcy5zcGxpY2Uoc3RhcnRfaW5kZXgsIGVuZF9pbmRleCAtIHN0YXJ0X2luZGV4ICsgMSk7XG4gICAgZGV0YWNoKGh0bWxfdGFnX25vZGVzWzBdKTtcbiAgICBkZXRhY2goaHRtbF90YWdfbm9kZXNbaHRtbF90YWdfbm9kZXMubGVuZ3RoIC0gMV0pO1xuICAgIGNvbnN0IGNsYWltZWRfbm9kZXMgPSBodG1sX3RhZ19ub2Rlcy5zbGljZSgxLCBodG1sX3RhZ19ub2Rlcy5sZW5ndGggLSAxKTtcbiAgICBmb3IgKGNvbnN0IG4gb2YgY2xhaW1lZF9ub2Rlcykge1xuICAgICAgICBuLmNsYWltX29yZGVyID0gbm9kZXMuY2xhaW1faW5mby50b3RhbF9jbGFpbWVkO1xuICAgICAgICBub2Rlcy5jbGFpbV9pbmZvLnRvdGFsX2NsYWltZWQgKz0gMTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBIdG1sVGFnSHlkcmF0aW9uKGNsYWltZWRfbm9kZXMsIGlzX3N2Zyk7XG59XG5mdW5jdGlvbiBzZXRfZGF0YSh0ZXh0LCBkYXRhKSB7XG4gICAgZGF0YSA9ICcnICsgZGF0YTtcbiAgICBpZiAodGV4dC53aG9sZVRleHQgIT09IGRhdGEpXG4gICAgICAgIHRleHQuZGF0YSA9IGRhdGE7XG59XG5mdW5jdGlvbiBzZXRfaW5wdXRfdmFsdWUoaW5wdXQsIHZhbHVlKSB7XG4gICAgaW5wdXQudmFsdWUgPSB2YWx1ZSA9PSBudWxsID8gJycgOiB2YWx1ZTtcbn1cbmZ1bmN0aW9uIHNldF9pbnB1dF90eXBlKGlucHV0LCB0eXBlKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaW5wdXQudHlwZSA9IHR5cGU7XG4gICAgfVxuICAgIGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGRvIG5vdGhpbmdcbiAgICB9XG59XG5mdW5jdGlvbiBzZXRfc3R5bGUobm9kZSwga2V5LCB2YWx1ZSwgaW1wb3J0YW50KSB7XG4gICAgaWYgKHZhbHVlID09PSBudWxsKSB7XG4gICAgICAgIG5vZGUuc3R5bGUucmVtb3ZlUHJvcGVydHkoa2V5KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIG5vZGUuc3R5bGUuc2V0UHJvcGVydHkoa2V5LCB2YWx1ZSwgaW1wb3J0YW50ID8gJ2ltcG9ydGFudCcgOiAnJyk7XG4gICAgfVxufVxuZnVuY3Rpb24gc2VsZWN0X29wdGlvbihzZWxlY3QsIHZhbHVlKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzZWxlY3Qub3B0aW9ucy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBjb25zdCBvcHRpb24gPSBzZWxlY3Qub3B0aW9uc1tpXTtcbiAgICAgICAgaWYgKG9wdGlvbi5fX3ZhbHVlID09PSB2YWx1ZSkge1xuICAgICAgICAgICAgb3B0aW9uLnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIH1cbiAgICBzZWxlY3Quc2VsZWN0ZWRJbmRleCA9IC0xOyAvLyBubyBvcHRpb24gc2hvdWxkIGJlIHNlbGVjdGVkXG59XG5mdW5jdGlvbiBzZWxlY3Rfb3B0aW9ucyhzZWxlY3QsIHZhbHVlKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzZWxlY3Qub3B0aW9ucy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBjb25zdCBvcHRpb24gPSBzZWxlY3Qub3B0aW9uc1tpXTtcbiAgICAgICAgb3B0aW9uLnNlbGVjdGVkID0gfnZhbHVlLmluZGV4T2Yob3B0aW9uLl9fdmFsdWUpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHNlbGVjdF92YWx1ZShzZWxlY3QpIHtcbiAgICBjb25zdCBzZWxlY3RlZF9vcHRpb24gPSBzZWxlY3QucXVlcnlTZWxlY3RvcignOmNoZWNrZWQnKSB8fCBzZWxlY3Qub3B0aW9uc1swXTtcbiAgICByZXR1cm4gc2VsZWN0ZWRfb3B0aW9uICYmIHNlbGVjdGVkX29wdGlvbi5fX3ZhbHVlO1xufVxuZnVuY3Rpb24gc2VsZWN0X211bHRpcGxlX3ZhbHVlKHNlbGVjdCkge1xuICAgIHJldHVybiBbXS5tYXAuY2FsbChzZWxlY3QucXVlcnlTZWxlY3RvckFsbCgnOmNoZWNrZWQnKSwgb3B0aW9uID0+IG9wdGlvbi5fX3ZhbHVlKTtcbn1cbi8vIHVuZm9ydHVuYXRlbHkgdGhpcyBjYW4ndCBiZSBhIGNvbnN0YW50IGFzIHRoYXQgd291bGRuJ3QgYmUgdHJlZS1zaGFrZWFibGVcbi8vIHNvIHdlIGNhY2hlIHRoZSByZXN1bHQgaW5zdGVhZFxubGV0IGNyb3Nzb3JpZ2luO1xuZnVuY3Rpb24gaXNfY3Jvc3NvcmlnaW4oKSB7XG4gICAgaWYgKGNyb3Nzb3JpZ2luID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY3Jvc3NvcmlnaW4gPSBmYWxzZTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cucGFyZW50KSB7XG4gICAgICAgICAgICAgICAgdm9pZCB3aW5kb3cucGFyZW50LmRvY3VtZW50O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY3Jvc3NvcmlnaW4gPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjcm9zc29yaWdpbjtcbn1cbmZ1bmN0aW9uIGFkZF9yZXNpemVfbGlzdGVuZXIobm9kZSwgZm4pIHtcbiAgICBjb25zdCBjb21wdXRlZF9zdHlsZSA9IGdldENvbXB1dGVkU3R5bGUobm9kZSk7XG4gICAgaWYgKGNvbXB1dGVkX3N0eWxlLnBvc2l0aW9uID09PSAnc3RhdGljJykge1xuICAgICAgICBub2RlLnN0eWxlLnBvc2l0aW9uID0gJ3JlbGF0aXZlJztcbiAgICB9XG4gICAgY29uc3QgaWZyYW1lID0gZWxlbWVudCgnaWZyYW1lJyk7XG4gICAgaWZyYW1lLnNldEF0dHJpYnV0ZSgnc3R5bGUnLCAnZGlzcGxheTogYmxvY2s7IHBvc2l0aW9uOiBhYnNvbHV0ZTsgdG9wOiAwOyBsZWZ0OiAwOyB3aWR0aDogMTAwJTsgaGVpZ2h0OiAxMDAlOyAnICtcbiAgICAgICAgJ292ZXJmbG93OiBoaWRkZW47IGJvcmRlcjogMDsgb3BhY2l0eTogMDsgcG9pbnRlci1ldmVudHM6IG5vbmU7IHotaW5kZXg6IC0xOycpO1xuICAgIGlmcmFtZS5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcbiAgICBpZnJhbWUudGFiSW5kZXggPSAtMTtcbiAgICBjb25zdCBjcm9zc29yaWdpbiA9IGlzX2Nyb3Nzb3JpZ2luKCk7XG4gICAgbGV0IHVuc3Vic2NyaWJlO1xuICAgIGlmIChjcm9zc29yaWdpbikge1xuICAgICAgICBpZnJhbWUuc3JjID0gXCJkYXRhOnRleHQvaHRtbCw8c2NyaXB0Pm9ucmVzaXplPWZ1bmN0aW9uKCl7cGFyZW50LnBvc3RNZXNzYWdlKDAsJyonKX08L3NjcmlwdD5cIjtcbiAgICAgICAgdW5zdWJzY3JpYmUgPSBsaXN0ZW4od2luZG93LCAnbWVzc2FnZScsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgaWYgKGV2ZW50LnNvdXJjZSA9PT0gaWZyYW1lLmNvbnRlbnRXaW5kb3cpXG4gICAgICAgICAgICAgICAgZm4oKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBpZnJhbWUuc3JjID0gJ2Fib3V0OmJsYW5rJztcbiAgICAgICAgaWZyYW1lLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgICAgIHVuc3Vic2NyaWJlID0gbGlzdGVuKGlmcmFtZS5jb250ZW50V2luZG93LCAncmVzaXplJywgZm4pO1xuICAgICAgICB9O1xuICAgIH1cbiAgICBhcHBlbmQobm9kZSwgaWZyYW1lKTtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICBpZiAoY3Jvc3NvcmlnaW4pIHtcbiAgICAgICAgICAgIHVuc3Vic2NyaWJlKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodW5zdWJzY3JpYmUgJiYgaWZyYW1lLmNvbnRlbnRXaW5kb3cpIHtcbiAgICAgICAgICAgIHVuc3Vic2NyaWJlKCk7XG4gICAgICAgIH1cbiAgICAgICAgZGV0YWNoKGlmcmFtZSk7XG4gICAgfTtcbn1cbmZ1bmN0aW9uIHRvZ2dsZV9jbGFzcyhlbGVtZW50LCBuYW1lLCB0b2dnbGUpIHtcbiAgICBlbGVtZW50LmNsYXNzTGlzdFt0b2dnbGUgPyAnYWRkJyA6ICdyZW1vdmUnXShuYW1lKTtcbn1cbmZ1bmN0aW9uIGN1c3RvbV9ldmVudCh0eXBlLCBkZXRhaWwsIHsgYnViYmxlcyA9IGZhbHNlLCBjYW5jZWxhYmxlID0gZmFsc2UgfSA9IHt9KSB7XG4gICAgY29uc3QgZSA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdDdXN0b21FdmVudCcpO1xuICAgIGUuaW5pdEN1c3RvbUV2ZW50KHR5cGUsIGJ1YmJsZXMsIGNhbmNlbGFibGUsIGRldGFpbCk7XG4gICAgcmV0dXJuIGU7XG59XG5mdW5jdGlvbiBxdWVyeV9zZWxlY3Rvcl9hbGwoc2VsZWN0b3IsIHBhcmVudCA9IGRvY3VtZW50LmJvZHkpIHtcbiAgICByZXR1cm4gQXJyYXkuZnJvbShwYXJlbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcikpO1xufVxuY2xhc3MgSHRtbFRhZyB7XG4gICAgY29uc3RydWN0b3IoaXNfc3ZnID0gZmFsc2UpIHtcbiAgICAgICAgdGhpcy5pc19zdmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5pc19zdmcgPSBpc19zdmc7XG4gICAgICAgIHRoaXMuZSA9IHRoaXMubiA9IG51bGw7XG4gICAgfVxuICAgIGMoaHRtbCkge1xuICAgICAgICB0aGlzLmgoaHRtbCk7XG4gICAgfVxuICAgIG0oaHRtbCwgdGFyZ2V0LCBhbmNob3IgPSBudWxsKSB7XG4gICAgICAgIGlmICghdGhpcy5lKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5pc19zdmcpXG4gICAgICAgICAgICAgICAgdGhpcy5lID0gc3ZnX2VsZW1lbnQodGFyZ2V0Lm5vZGVOYW1lKTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICB0aGlzLmUgPSBlbGVtZW50KHRhcmdldC5ub2RlTmFtZSk7XG4gICAgICAgICAgICB0aGlzLnQgPSB0YXJnZXQ7XG4gICAgICAgICAgICB0aGlzLmMoaHRtbCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pKGFuY2hvcik7XG4gICAgfVxuICAgIGgoaHRtbCkge1xuICAgICAgICB0aGlzLmUuaW5uZXJIVE1MID0gaHRtbDtcbiAgICAgICAgdGhpcy5uID0gQXJyYXkuZnJvbSh0aGlzLmUuY2hpbGROb2Rlcyk7XG4gICAgfVxuICAgIGkoYW5jaG9yKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5uLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICBpbnNlcnQodGhpcy50LCB0aGlzLm5baV0sIGFuY2hvcik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcChodG1sKSB7XG4gICAgICAgIHRoaXMuZCgpO1xuICAgICAgICB0aGlzLmgoaHRtbCk7XG4gICAgICAgIHRoaXMuaSh0aGlzLmEpO1xuICAgIH1cbiAgICBkKCkge1xuICAgICAgICB0aGlzLm4uZm9yRWFjaChkZXRhY2gpO1xuICAgIH1cbn1cbmNsYXNzIEh0bWxUYWdIeWRyYXRpb24gZXh0ZW5kcyBIdG1sVGFnIHtcbiAgICBjb25zdHJ1Y3RvcihjbGFpbWVkX25vZGVzLCBpc19zdmcgPSBmYWxzZSkge1xuICAgICAgICBzdXBlcihpc19zdmcpO1xuICAgICAgICB0aGlzLmUgPSB0aGlzLm4gPSBudWxsO1xuICAgICAgICB0aGlzLmwgPSBjbGFpbWVkX25vZGVzO1xuICAgIH1cbiAgICBjKGh0bWwpIHtcbiAgICAgICAgaWYgKHRoaXMubCkge1xuICAgICAgICAgICAgdGhpcy5uID0gdGhpcy5sO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgc3VwZXIuYyhodG1sKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpKGFuY2hvcikge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubi5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgaW5zZXJ0X2h5ZHJhdGlvbih0aGlzLnQsIHRoaXMubltpXSwgYW5jaG9yKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmZ1bmN0aW9uIGF0dHJpYnV0ZV90b19vYmplY3QoYXR0cmlidXRlcykge1xuICAgIGNvbnN0IHJlc3VsdCA9IHt9O1xuICAgIGZvciAoY29uc3QgYXR0cmlidXRlIG9mIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgcmVzdWx0W2F0dHJpYnV0ZS5uYW1lXSA9IGF0dHJpYnV0ZS52YWx1ZTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIGdldF9jdXN0b21fZWxlbWVudHNfc2xvdHMoZWxlbWVudCkge1xuICAgIGNvbnN0IHJlc3VsdCA9IHt9O1xuICAgIGVsZW1lbnQuY2hpbGROb2Rlcy5mb3JFYWNoKChub2RlKSA9PiB7XG4gICAgICAgIHJlc3VsdFtub2RlLnNsb3QgfHwgJ2RlZmF1bHQnXSA9IHRydWU7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLy8gd2UgbmVlZCB0byBzdG9yZSB0aGUgaW5mb3JtYXRpb24gZm9yIG11bHRpcGxlIGRvY3VtZW50cyBiZWNhdXNlIGEgU3ZlbHRlIGFwcGxpY2F0aW9uIGNvdWxkIGFsc28gY29udGFpbiBpZnJhbWVzXG4vLyBodHRwczovL2dpdGh1Yi5jb20vc3ZlbHRlanMvc3ZlbHRlL2lzc3Vlcy8zNjI0XG5jb25zdCBtYW5hZ2VkX3N0eWxlcyA9IG5ldyBNYXAoKTtcbmxldCBhY3RpdmUgPSAwO1xuLy8gaHR0cHM6Ly9naXRodWIuY29tL2Rhcmtza3lhcHAvc3RyaW5nLWhhc2gvYmxvYi9tYXN0ZXIvaW5kZXguanNcbmZ1bmN0aW9uIGhhc2goc3RyKSB7XG4gICAgbGV0IGhhc2ggPSA1MzgxO1xuICAgIGxldCBpID0gc3RyLmxlbmd0aDtcbiAgICB3aGlsZSAoaS0tKVxuICAgICAgICBoYXNoID0gKChoYXNoIDw8IDUpIC0gaGFzaCkgXiBzdHIuY2hhckNvZGVBdChpKTtcbiAgICByZXR1cm4gaGFzaCA+Pj4gMDtcbn1cbmZ1bmN0aW9uIGNyZWF0ZV9zdHlsZV9pbmZvcm1hdGlvbihkb2MsIG5vZGUpIHtcbiAgICBjb25zdCBpbmZvID0geyBzdHlsZXNoZWV0OiBhcHBlbmRfZW1wdHlfc3R5bGVzaGVldChub2RlKSwgcnVsZXM6IHt9IH07XG4gICAgbWFuYWdlZF9zdHlsZXMuc2V0KGRvYywgaW5mbyk7XG4gICAgcmV0dXJuIGluZm87XG59XG5mdW5jdGlvbiBjcmVhdGVfcnVsZShub2RlLCBhLCBiLCBkdXJhdGlvbiwgZGVsYXksIGVhc2UsIGZuLCB1aWQgPSAwKSB7XG4gICAgY29uc3Qgc3RlcCA9IDE2LjY2NiAvIGR1cmF0aW9uO1xuICAgIGxldCBrZXlmcmFtZXMgPSAne1xcbic7XG4gICAgZm9yIChsZXQgcCA9IDA7IHAgPD0gMTsgcCArPSBzdGVwKSB7XG4gICAgICAgIGNvbnN0IHQgPSBhICsgKGIgLSBhKSAqIGVhc2UocCk7XG4gICAgICAgIGtleWZyYW1lcyArPSBwICogMTAwICsgYCV7JHtmbih0LCAxIC0gdCl9fVxcbmA7XG4gICAgfVxuICAgIGNvbnN0IHJ1bGUgPSBrZXlmcmFtZXMgKyBgMTAwJSB7JHtmbihiLCAxIC0gYil9fVxcbn1gO1xuICAgIGNvbnN0IG5hbWUgPSBgX19zdmVsdGVfJHtoYXNoKHJ1bGUpfV8ke3VpZH1gO1xuICAgIGNvbnN0IGRvYyA9IGdldF9yb290X2Zvcl9zdHlsZShub2RlKTtcbiAgICBjb25zdCB7IHN0eWxlc2hlZXQsIHJ1bGVzIH0gPSBtYW5hZ2VkX3N0eWxlcy5nZXQoZG9jKSB8fCBjcmVhdGVfc3R5bGVfaW5mb3JtYXRpb24oZG9jLCBub2RlKTtcbiAgICBpZiAoIXJ1bGVzW25hbWVdKSB7XG4gICAgICAgIHJ1bGVzW25hbWVdID0gdHJ1ZTtcbiAgICAgICAgc3R5bGVzaGVldC5pbnNlcnRSdWxlKGBAa2V5ZnJhbWVzICR7bmFtZX0gJHtydWxlfWAsIHN0eWxlc2hlZXQuY3NzUnVsZXMubGVuZ3RoKTtcbiAgICB9XG4gICAgY29uc3QgYW5pbWF0aW9uID0gbm9kZS5zdHlsZS5hbmltYXRpb24gfHwgJyc7XG4gICAgbm9kZS5zdHlsZS5hbmltYXRpb24gPSBgJHthbmltYXRpb24gPyBgJHthbmltYXRpb259LCBgIDogJyd9JHtuYW1lfSAke2R1cmF0aW9ufW1zIGxpbmVhciAke2RlbGF5fW1zIDEgYm90aGA7XG4gICAgYWN0aXZlICs9IDE7XG4gICAgcmV0dXJuIG5hbWU7XG59XG5mdW5jdGlvbiBkZWxldGVfcnVsZShub2RlLCBuYW1lKSB7XG4gICAgY29uc3QgcHJldmlvdXMgPSAobm9kZS5zdHlsZS5hbmltYXRpb24gfHwgJycpLnNwbGl0KCcsICcpO1xuICAgIGNvbnN0IG5leHQgPSBwcmV2aW91cy5maWx0ZXIobmFtZVxuICAgICAgICA/IGFuaW0gPT4gYW5pbS5pbmRleE9mKG5hbWUpIDwgMCAvLyByZW1vdmUgc3BlY2lmaWMgYW5pbWF0aW9uXG4gICAgICAgIDogYW5pbSA9PiBhbmltLmluZGV4T2YoJ19fc3ZlbHRlJykgPT09IC0xIC8vIHJlbW92ZSBhbGwgU3ZlbHRlIGFuaW1hdGlvbnNcbiAgICApO1xuICAgIGNvbnN0IGRlbGV0ZWQgPSBwcmV2aW91cy5sZW5ndGggLSBuZXh0Lmxlbmd0aDtcbiAgICBpZiAoZGVsZXRlZCkge1xuICAgICAgICBub2RlLnN0eWxlLmFuaW1hdGlvbiA9IG5leHQuam9pbignLCAnKTtcbiAgICAgICAgYWN0aXZlIC09IGRlbGV0ZWQ7XG4gICAgICAgIGlmICghYWN0aXZlKVxuICAgICAgICAgICAgY2xlYXJfcnVsZXMoKTtcbiAgICB9XG59XG5mdW5jdGlvbiBjbGVhcl9ydWxlcygpIHtcbiAgICByYWYoKCkgPT4ge1xuICAgICAgICBpZiAoYWN0aXZlKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBtYW5hZ2VkX3N0eWxlcy5mb3JFYWNoKGluZm8gPT4ge1xuICAgICAgICAgICAgY29uc3QgeyBzdHlsZXNoZWV0IH0gPSBpbmZvO1xuICAgICAgICAgICAgbGV0IGkgPSBzdHlsZXNoZWV0LmNzc1J1bGVzLmxlbmd0aDtcbiAgICAgICAgICAgIHdoaWxlIChpLS0pXG4gICAgICAgICAgICAgICAgc3R5bGVzaGVldC5kZWxldGVSdWxlKGkpO1xuICAgICAgICAgICAgaW5mby5ydWxlcyA9IHt9O1xuICAgICAgICB9KTtcbiAgICAgICAgbWFuYWdlZF9zdHlsZXMuY2xlYXIoKTtcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlX2FuaW1hdGlvbihub2RlLCBmcm9tLCBmbiwgcGFyYW1zKSB7XG4gICAgaWYgKCFmcm9tKVxuICAgICAgICByZXR1cm4gbm9vcDtcbiAgICBjb25zdCB0byA9IG5vZGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgaWYgKGZyb20ubGVmdCA9PT0gdG8ubGVmdCAmJiBmcm9tLnJpZ2h0ID09PSB0by5yaWdodCAmJiBmcm9tLnRvcCA9PT0gdG8udG9wICYmIGZyb20uYm90dG9tID09PSB0by5ib3R0b20pXG4gICAgICAgIHJldHVybiBub29wO1xuICAgIGNvbnN0IHsgZGVsYXkgPSAwLCBkdXJhdGlvbiA9IDMwMCwgZWFzaW5nID0gaWRlbnRpdHksIFxuICAgIC8vIEB0cy1pZ25vcmUgdG9kbzogc2hvdWxkIHRoaXMgYmUgc2VwYXJhdGVkIGZyb20gZGVzdHJ1Y3R1cmluZz8gT3Igc3RhcnQvZW5kIGFkZGVkIHRvIHB1YmxpYyBhcGkgYW5kIGRvY3VtZW50YXRpb24/XG4gICAgc3RhcnQ6IHN0YXJ0X3RpbWUgPSBub3coKSArIGRlbGF5LCBcbiAgICAvLyBAdHMtaWdub3JlIHRvZG86XG4gICAgZW5kID0gc3RhcnRfdGltZSArIGR1cmF0aW9uLCB0aWNrID0gbm9vcCwgY3NzIH0gPSBmbihub2RlLCB7IGZyb20sIHRvIH0sIHBhcmFtcyk7XG4gICAgbGV0IHJ1bm5pbmcgPSB0cnVlO1xuICAgIGxldCBzdGFydGVkID0gZmFsc2U7XG4gICAgbGV0IG5hbWU7XG4gICAgZnVuY3Rpb24gc3RhcnQoKSB7XG4gICAgICAgIGlmIChjc3MpIHtcbiAgICAgICAgICAgIG5hbWUgPSBjcmVhdGVfcnVsZShub2RlLCAwLCAxLCBkdXJhdGlvbiwgZGVsYXksIGVhc2luZywgY3NzKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWRlbGF5KSB7XG4gICAgICAgICAgICBzdGFydGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiBzdG9wKCkge1xuICAgICAgICBpZiAoY3NzKVxuICAgICAgICAgICAgZGVsZXRlX3J1bGUobm9kZSwgbmFtZSk7XG4gICAgICAgIHJ1bm5pbmcgPSBmYWxzZTtcbiAgICB9XG4gICAgbG9vcChub3cgPT4ge1xuICAgICAgICBpZiAoIXN0YXJ0ZWQgJiYgbm93ID49IHN0YXJ0X3RpbWUpIHtcbiAgICAgICAgICAgIHN0YXJ0ZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzdGFydGVkICYmIG5vdyA+PSBlbmQpIHtcbiAgICAgICAgICAgIHRpY2soMSwgMCk7XG4gICAgICAgICAgICBzdG9wKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFydW5uaW5nKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHN0YXJ0ZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IHAgPSBub3cgLSBzdGFydF90aW1lO1xuICAgICAgICAgICAgY29uc3QgdCA9IDAgKyAxICogZWFzaW5nKHAgLyBkdXJhdGlvbik7XG4gICAgICAgICAgICB0aWNrKHQsIDEgLSB0KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9KTtcbiAgICBzdGFydCgpO1xuICAgIHRpY2soMCwgMSk7XG4gICAgcmV0dXJuIHN0b3A7XG59XG5mdW5jdGlvbiBmaXhfcG9zaXRpb24obm9kZSkge1xuICAgIGNvbnN0IHN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZShub2RlKTtcbiAgICBpZiAoc3R5bGUucG9zaXRpb24gIT09ICdhYnNvbHV0ZScgJiYgc3R5bGUucG9zaXRpb24gIT09ICdmaXhlZCcpIHtcbiAgICAgICAgY29uc3QgeyB3aWR0aCwgaGVpZ2h0IH0gPSBzdHlsZTtcbiAgICAgICAgY29uc3QgYSA9IG5vZGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIG5vZGUuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgICBub2RlLnN0eWxlLndpZHRoID0gd2lkdGg7XG4gICAgICAgIG5vZGUuc3R5bGUuaGVpZ2h0ID0gaGVpZ2h0O1xuICAgICAgICBhZGRfdHJhbnNmb3JtKG5vZGUsIGEpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGFkZF90cmFuc2Zvcm0obm9kZSwgYSkge1xuICAgIGNvbnN0IGIgPSBub2RlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGlmIChhLmxlZnQgIT09IGIubGVmdCB8fCBhLnRvcCAhPT0gYi50b3ApIHtcbiAgICAgICAgY29uc3Qgc3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKG5vZGUpO1xuICAgICAgICBjb25zdCB0cmFuc2Zvcm0gPSBzdHlsZS50cmFuc2Zvcm0gPT09ICdub25lJyA/ICcnIDogc3R5bGUudHJhbnNmb3JtO1xuICAgICAgICBub2RlLnN0eWxlLnRyYW5zZm9ybSA9IGAke3RyYW5zZm9ybX0gdHJhbnNsYXRlKCR7YS5sZWZ0IC0gYi5sZWZ0fXB4LCAke2EudG9wIC0gYi50b3B9cHgpYDtcbiAgICB9XG59XG5cbmxldCBjdXJyZW50X2NvbXBvbmVudDtcbmZ1bmN0aW9uIHNldF9jdXJyZW50X2NvbXBvbmVudChjb21wb25lbnQpIHtcbiAgICBjdXJyZW50X2NvbXBvbmVudCA9IGNvbXBvbmVudDtcbn1cbmZ1bmN0aW9uIGdldF9jdXJyZW50X2NvbXBvbmVudCgpIHtcbiAgICBpZiAoIWN1cnJlbnRfY29tcG9uZW50KVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Z1bmN0aW9uIGNhbGxlZCBvdXRzaWRlIGNvbXBvbmVudCBpbml0aWFsaXphdGlvbicpO1xuICAgIHJldHVybiBjdXJyZW50X2NvbXBvbmVudDtcbn1cbmZ1bmN0aW9uIGJlZm9yZVVwZGF0ZShmbikge1xuICAgIGdldF9jdXJyZW50X2NvbXBvbmVudCgpLiQkLmJlZm9yZV91cGRhdGUucHVzaChmbik7XG59XG5mdW5jdGlvbiBvbk1vdW50KGZuKSB7XG4gICAgZ2V0X2N1cnJlbnRfY29tcG9uZW50KCkuJCQub25fbW91bnQucHVzaChmbik7XG59XG5mdW5jdGlvbiBhZnRlclVwZGF0ZShmbikge1xuICAgIGdldF9jdXJyZW50X2NvbXBvbmVudCgpLiQkLmFmdGVyX3VwZGF0ZS5wdXNoKGZuKTtcbn1cbmZ1bmN0aW9uIG9uRGVzdHJveShmbikge1xuICAgIGdldF9jdXJyZW50X2NvbXBvbmVudCgpLiQkLm9uX2Rlc3Ryb3kucHVzaChmbik7XG59XG5mdW5jdGlvbiBjcmVhdGVFdmVudERpc3BhdGNoZXIoKSB7XG4gICAgY29uc3QgY29tcG9uZW50ID0gZ2V0X2N1cnJlbnRfY29tcG9uZW50KCk7XG4gICAgcmV0dXJuICh0eXBlLCBkZXRhaWwsIHsgY2FuY2VsYWJsZSA9IGZhbHNlIH0gPSB7fSkgPT4ge1xuICAgICAgICBjb25zdCBjYWxsYmFja3MgPSBjb21wb25lbnQuJCQuY2FsbGJhY2tzW3R5cGVdO1xuICAgICAgICBpZiAoY2FsbGJhY2tzKSB7XG4gICAgICAgICAgICAvLyBUT0RPIGFyZSB0aGVyZSBzaXR1YXRpb25zIHdoZXJlIGV2ZW50cyBjb3VsZCBiZSBkaXNwYXRjaGVkXG4gICAgICAgICAgICAvLyBpbiBhIHNlcnZlciAobm9uLURPTSkgZW52aXJvbm1lbnQ/XG4gICAgICAgICAgICBjb25zdCBldmVudCA9IGN1c3RvbV9ldmVudCh0eXBlLCBkZXRhaWwsIHsgY2FuY2VsYWJsZSB9KTtcbiAgICAgICAgICAgIGNhbGxiYWNrcy5zbGljZSgpLmZvckVhY2goZm4gPT4ge1xuICAgICAgICAgICAgICAgIGZuLmNhbGwoY29tcG9uZW50LCBldmVudCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiAhZXZlbnQuZGVmYXVsdFByZXZlbnRlZDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9O1xufVxuZnVuY3Rpb24gc2V0Q29udGV4dChrZXksIGNvbnRleHQpIHtcbiAgICBnZXRfY3VycmVudF9jb21wb25lbnQoKS4kJC5jb250ZXh0LnNldChrZXksIGNvbnRleHQpO1xuICAgIHJldHVybiBjb250ZXh0O1xufVxuZnVuY3Rpb24gZ2V0Q29udGV4dChrZXkpIHtcbiAgICByZXR1cm4gZ2V0X2N1cnJlbnRfY29tcG9uZW50KCkuJCQuY29udGV4dC5nZXQoa2V5KTtcbn1cbmZ1bmN0aW9uIGdldEFsbENvbnRleHRzKCkge1xuICAgIHJldHVybiBnZXRfY3VycmVudF9jb21wb25lbnQoKS4kJC5jb250ZXh0O1xufVxuZnVuY3Rpb24gaGFzQ29udGV4dChrZXkpIHtcbiAgICByZXR1cm4gZ2V0X2N1cnJlbnRfY29tcG9uZW50KCkuJCQuY29udGV4dC5oYXMoa2V5KTtcbn1cbi8vIFRPRE8gZmlndXJlIG91dCBpZiB3ZSBzdGlsbCB3YW50IHRvIHN1cHBvcnRcbi8vIHNob3J0aGFuZCBldmVudHMsIG9yIGlmIHdlIHdhbnQgdG8gaW1wbGVtZW50XG4vLyBhIHJlYWwgYnViYmxpbmcgbWVjaGFuaXNtXG5mdW5jdGlvbiBidWJibGUoY29tcG9uZW50LCBldmVudCkge1xuICAgIGNvbnN0IGNhbGxiYWNrcyA9IGNvbXBvbmVudC4kJC5jYWxsYmFja3NbZXZlbnQudHlwZV07XG4gICAgaWYgKGNhbGxiYWNrcykge1xuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIGNhbGxiYWNrcy5zbGljZSgpLmZvckVhY2goZm4gPT4gZm4uY2FsbCh0aGlzLCBldmVudCkpO1xuICAgIH1cbn1cblxuY29uc3QgZGlydHlfY29tcG9uZW50cyA9IFtdO1xuY29uc3QgaW50cm9zID0geyBlbmFibGVkOiBmYWxzZSB9O1xuY29uc3QgYmluZGluZ19jYWxsYmFja3MgPSBbXTtcbmNvbnN0IHJlbmRlcl9jYWxsYmFja3MgPSBbXTtcbmNvbnN0IGZsdXNoX2NhbGxiYWNrcyA9IFtdO1xuY29uc3QgcmVzb2x2ZWRfcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xubGV0IHVwZGF0ZV9zY2hlZHVsZWQgPSBmYWxzZTtcbmZ1bmN0aW9uIHNjaGVkdWxlX3VwZGF0ZSgpIHtcbiAgICBpZiAoIXVwZGF0ZV9zY2hlZHVsZWQpIHtcbiAgICAgICAgdXBkYXRlX3NjaGVkdWxlZCA9IHRydWU7XG4gICAgICAgIHJlc29sdmVkX3Byb21pc2UudGhlbihmbHVzaCk7XG4gICAgfVxufVxuZnVuY3Rpb24gdGljaygpIHtcbiAgICBzY2hlZHVsZV91cGRhdGUoKTtcbiAgICByZXR1cm4gcmVzb2x2ZWRfcHJvbWlzZTtcbn1cbmZ1bmN0aW9uIGFkZF9yZW5kZXJfY2FsbGJhY2soZm4pIHtcbiAgICByZW5kZXJfY2FsbGJhY2tzLnB1c2goZm4pO1xufVxuZnVuY3Rpb24gYWRkX2ZsdXNoX2NhbGxiYWNrKGZuKSB7XG4gICAgZmx1c2hfY2FsbGJhY2tzLnB1c2goZm4pO1xufVxuLy8gZmx1c2goKSBjYWxscyBjYWxsYmFja3MgaW4gdGhpcyBvcmRlcjpcbi8vIDEuIEFsbCBiZWZvcmVVcGRhdGUgY2FsbGJhY2tzLCBpbiBvcmRlcjogcGFyZW50cyBiZWZvcmUgY2hpbGRyZW5cbi8vIDIuIEFsbCBiaW5kOnRoaXMgY2FsbGJhY2tzLCBpbiByZXZlcnNlIG9yZGVyOiBjaGlsZHJlbiBiZWZvcmUgcGFyZW50cy5cbi8vIDMuIEFsbCBhZnRlclVwZGF0ZSBjYWxsYmFja3MsIGluIG9yZGVyOiBwYXJlbnRzIGJlZm9yZSBjaGlsZHJlbi4gRVhDRVBUXG4vLyAgICBmb3IgYWZ0ZXJVcGRhdGVzIGNhbGxlZCBkdXJpbmcgdGhlIGluaXRpYWwgb25Nb3VudCwgd2hpY2ggYXJlIGNhbGxlZCBpblxuLy8gICAgcmV2ZXJzZSBvcmRlcjogY2hpbGRyZW4gYmVmb3JlIHBhcmVudHMuXG4vLyBTaW5jZSBjYWxsYmFja3MgbWlnaHQgdXBkYXRlIGNvbXBvbmVudCB2YWx1ZXMsIHdoaWNoIGNvdWxkIHRyaWdnZXIgYW5vdGhlclxuLy8gY2FsbCB0byBmbHVzaCgpLCB0aGUgZm9sbG93aW5nIHN0ZXBzIGd1YXJkIGFnYWluc3QgdGhpczpcbi8vIDEuIER1cmluZyBiZWZvcmVVcGRhdGUsIGFueSB1cGRhdGVkIGNvbXBvbmVudHMgd2lsbCBiZSBhZGRlZCB0byB0aGVcbi8vICAgIGRpcnR5X2NvbXBvbmVudHMgYXJyYXkgYW5kIHdpbGwgY2F1c2UgYSByZWVudHJhbnQgY2FsbCB0byBmbHVzaCgpLiBCZWNhdXNlXG4vLyAgICB0aGUgZmx1c2ggaW5kZXggaXMga2VwdCBvdXRzaWRlIHRoZSBmdW5jdGlvbiwgdGhlIHJlZW50cmFudCBjYWxsIHdpbGwgcGlja1xuLy8gICAgdXAgd2hlcmUgdGhlIGVhcmxpZXIgY2FsbCBsZWZ0IG9mZiBhbmQgZ28gdGhyb3VnaCBhbGwgZGlydHkgY29tcG9uZW50cy4gVGhlXG4vLyAgICBjdXJyZW50X2NvbXBvbmVudCB2YWx1ZSBpcyBzYXZlZCBhbmQgcmVzdG9yZWQgc28gdGhhdCB0aGUgcmVlbnRyYW50IGNhbGwgd2lsbFxuLy8gICAgbm90IGludGVyZmVyZSB3aXRoIHRoZSBcInBhcmVudFwiIGZsdXNoKCkgY2FsbC5cbi8vIDIuIGJpbmQ6dGhpcyBjYWxsYmFja3MgY2Fubm90IHRyaWdnZXIgbmV3IGZsdXNoKCkgY2FsbHMuXG4vLyAzLiBEdXJpbmcgYWZ0ZXJVcGRhdGUsIGFueSB1cGRhdGVkIGNvbXBvbmVudHMgd2lsbCBOT1QgaGF2ZSB0aGVpciBhZnRlclVwZGF0ZVxuLy8gICAgY2FsbGJhY2sgY2FsbGVkIGEgc2Vjb25kIHRpbWU7IHRoZSBzZWVuX2NhbGxiYWNrcyBzZXQsIG91dHNpZGUgdGhlIGZsdXNoKClcbi8vICAgIGZ1bmN0aW9uLCBndWFyYW50ZWVzIHRoaXMgYmVoYXZpb3IuXG5jb25zdCBzZWVuX2NhbGxiYWNrcyA9IG5ldyBTZXQoKTtcbmxldCBmbHVzaGlkeCA9IDA7IC8vIERvICpub3QqIG1vdmUgdGhpcyBpbnNpZGUgdGhlIGZsdXNoKCkgZnVuY3Rpb25cbmZ1bmN0aW9uIGZsdXNoKCkge1xuICAgIGNvbnN0IHNhdmVkX2NvbXBvbmVudCA9IGN1cnJlbnRfY29tcG9uZW50O1xuICAgIGRvIHtcbiAgICAgICAgLy8gZmlyc3QsIGNhbGwgYmVmb3JlVXBkYXRlIGZ1bmN0aW9uc1xuICAgICAgICAvLyBhbmQgdXBkYXRlIGNvbXBvbmVudHNcbiAgICAgICAgd2hpbGUgKGZsdXNoaWR4IDwgZGlydHlfY29tcG9uZW50cy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbnN0IGNvbXBvbmVudCA9IGRpcnR5X2NvbXBvbmVudHNbZmx1c2hpZHhdO1xuICAgICAgICAgICAgZmx1c2hpZHgrKztcbiAgICAgICAgICAgIHNldF9jdXJyZW50X2NvbXBvbmVudChjb21wb25lbnQpO1xuICAgICAgICAgICAgdXBkYXRlKGNvbXBvbmVudC4kJCk7XG4gICAgICAgIH1cbiAgICAgICAgc2V0X2N1cnJlbnRfY29tcG9uZW50KG51bGwpO1xuICAgICAgICBkaXJ0eV9jb21wb25lbnRzLmxlbmd0aCA9IDA7XG4gICAgICAgIGZsdXNoaWR4ID0gMDtcbiAgICAgICAgd2hpbGUgKGJpbmRpbmdfY2FsbGJhY2tzLmxlbmd0aClcbiAgICAgICAgICAgIGJpbmRpbmdfY2FsbGJhY2tzLnBvcCgpKCk7XG4gICAgICAgIC8vIHRoZW4sIG9uY2UgY29tcG9uZW50cyBhcmUgdXBkYXRlZCwgY2FsbFxuICAgICAgICAvLyBhZnRlclVwZGF0ZSBmdW5jdGlvbnMuIFRoaXMgbWF5IGNhdXNlXG4gICAgICAgIC8vIHN1YnNlcXVlbnQgdXBkYXRlcy4uLlxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJlbmRlcl9jYWxsYmFja3MubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGNvbnN0IGNhbGxiYWNrID0gcmVuZGVyX2NhbGxiYWNrc1tpXTtcbiAgICAgICAgICAgIGlmICghc2Vlbl9jYWxsYmFja3MuaGFzKGNhbGxiYWNrKSkge1xuICAgICAgICAgICAgICAgIC8vIC4uLnNvIGd1YXJkIGFnYWluc3QgaW5maW5pdGUgbG9vcHNcbiAgICAgICAgICAgICAgICBzZWVuX2NhbGxiYWNrcy5hZGQoY2FsbGJhY2spO1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmVuZGVyX2NhbGxiYWNrcy5sZW5ndGggPSAwO1xuICAgIH0gd2hpbGUgKGRpcnR5X2NvbXBvbmVudHMubGVuZ3RoKTtcbiAgICB3aGlsZSAoZmx1c2hfY2FsbGJhY2tzLmxlbmd0aCkge1xuICAgICAgICBmbHVzaF9jYWxsYmFja3MucG9wKCkoKTtcbiAgICB9XG4gICAgdXBkYXRlX3NjaGVkdWxlZCA9IGZhbHNlO1xuICAgIHNlZW5fY2FsbGJhY2tzLmNsZWFyKCk7XG4gICAgc2V0X2N1cnJlbnRfY29tcG9uZW50KHNhdmVkX2NvbXBvbmVudCk7XG59XG5mdW5jdGlvbiB1cGRhdGUoJCQpIHtcbiAgICBpZiAoJCQuZnJhZ21lbnQgIT09IG51bGwpIHtcbiAgICAgICAgJCQudXBkYXRlKCk7XG4gICAgICAgIHJ1bl9hbGwoJCQuYmVmb3JlX3VwZGF0ZSk7XG4gICAgICAgIGNvbnN0IGRpcnR5ID0gJCQuZGlydHk7XG4gICAgICAgICQkLmRpcnR5ID0gWy0xXTtcbiAgICAgICAgJCQuZnJhZ21lbnQgJiYgJCQuZnJhZ21lbnQucCgkJC5jdHgsIGRpcnR5KTtcbiAgICAgICAgJCQuYWZ0ZXJfdXBkYXRlLmZvckVhY2goYWRkX3JlbmRlcl9jYWxsYmFjayk7XG4gICAgfVxufVxuXG5sZXQgcHJvbWlzZTtcbmZ1bmN0aW9uIHdhaXQoKSB7XG4gICAgaWYgKCFwcm9taXNlKSB7XG4gICAgICAgIHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHByb21pc2UgPSBudWxsO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHByb21pc2U7XG59XG5mdW5jdGlvbiBkaXNwYXRjaChub2RlLCBkaXJlY3Rpb24sIGtpbmQpIHtcbiAgICBub2RlLmRpc3BhdGNoRXZlbnQoY3VzdG9tX2V2ZW50KGAke2RpcmVjdGlvbiA/ICdpbnRybycgOiAnb3V0cm8nfSR7a2luZH1gKSk7XG59XG5jb25zdCBvdXRyb2luZyA9IG5ldyBTZXQoKTtcbmxldCBvdXRyb3M7XG5mdW5jdGlvbiBncm91cF9vdXRyb3MoKSB7XG4gICAgb3V0cm9zID0ge1xuICAgICAgICByOiAwLFxuICAgICAgICBjOiBbXSxcbiAgICAgICAgcDogb3V0cm9zIC8vIHBhcmVudCBncm91cFxuICAgIH07XG59XG5mdW5jdGlvbiBjaGVja19vdXRyb3MoKSB7XG4gICAgaWYgKCFvdXRyb3Mucikge1xuICAgICAgICBydW5fYWxsKG91dHJvcy5jKTtcbiAgICB9XG4gICAgb3V0cm9zID0gb3V0cm9zLnA7XG59XG5mdW5jdGlvbiB0cmFuc2l0aW9uX2luKGJsb2NrLCBsb2NhbCkge1xuICAgIGlmIChibG9jayAmJiBibG9jay5pKSB7XG4gICAgICAgIG91dHJvaW5nLmRlbGV0ZShibG9jayk7XG4gICAgICAgIGJsb2NrLmkobG9jYWwpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHRyYW5zaXRpb25fb3V0KGJsb2NrLCBsb2NhbCwgZGV0YWNoLCBjYWxsYmFjaykge1xuICAgIGlmIChibG9jayAmJiBibG9jay5vKSB7XG4gICAgICAgIGlmIChvdXRyb2luZy5oYXMoYmxvY2spKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBvdXRyb2luZy5hZGQoYmxvY2spO1xuICAgICAgICBvdXRyb3MuYy5wdXNoKCgpID0+IHtcbiAgICAgICAgICAgIG91dHJvaW5nLmRlbGV0ZShibG9jayk7XG4gICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICBpZiAoZGV0YWNoKVxuICAgICAgICAgICAgICAgICAgICBibG9jay5kKDEpO1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBibG9jay5vKGxvY2FsKTtcbiAgICB9XG59XG5jb25zdCBudWxsX3RyYW5zaXRpb24gPSB7IGR1cmF0aW9uOiAwIH07XG5mdW5jdGlvbiBjcmVhdGVfaW5fdHJhbnNpdGlvbihub2RlLCBmbiwgcGFyYW1zKSB7XG4gICAgbGV0IGNvbmZpZyA9IGZuKG5vZGUsIHBhcmFtcyk7XG4gICAgbGV0IHJ1bm5pbmcgPSBmYWxzZTtcbiAgICBsZXQgYW5pbWF0aW9uX25hbWU7XG4gICAgbGV0IHRhc2s7XG4gICAgbGV0IHVpZCA9IDA7XG4gICAgZnVuY3Rpb24gY2xlYW51cCgpIHtcbiAgICAgICAgaWYgKGFuaW1hdGlvbl9uYW1lKVxuICAgICAgICAgICAgZGVsZXRlX3J1bGUobm9kZSwgYW5pbWF0aW9uX25hbWUpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBnbygpIHtcbiAgICAgICAgY29uc3QgeyBkZWxheSA9IDAsIGR1cmF0aW9uID0gMzAwLCBlYXNpbmcgPSBpZGVudGl0eSwgdGljayA9IG5vb3AsIGNzcyB9ID0gY29uZmlnIHx8IG51bGxfdHJhbnNpdGlvbjtcbiAgICAgICAgaWYgKGNzcylcbiAgICAgICAgICAgIGFuaW1hdGlvbl9uYW1lID0gY3JlYXRlX3J1bGUobm9kZSwgMCwgMSwgZHVyYXRpb24sIGRlbGF5LCBlYXNpbmcsIGNzcywgdWlkKyspO1xuICAgICAgICB0aWNrKDAsIDEpO1xuICAgICAgICBjb25zdCBzdGFydF90aW1lID0gbm93KCkgKyBkZWxheTtcbiAgICAgICAgY29uc3QgZW5kX3RpbWUgPSBzdGFydF90aW1lICsgZHVyYXRpb247XG4gICAgICAgIGlmICh0YXNrKVxuICAgICAgICAgICAgdGFzay5hYm9ydCgpO1xuICAgICAgICBydW5uaW5nID0gdHJ1ZTtcbiAgICAgICAgYWRkX3JlbmRlcl9jYWxsYmFjaygoKSA9PiBkaXNwYXRjaChub2RlLCB0cnVlLCAnc3RhcnQnKSk7XG4gICAgICAgIHRhc2sgPSBsb29wKG5vdyA9PiB7XG4gICAgICAgICAgICBpZiAocnVubmluZykge1xuICAgICAgICAgICAgICAgIGlmIChub3cgPj0gZW5kX3RpbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGljaygxLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgZGlzcGF0Y2gobm9kZSwgdHJ1ZSwgJ2VuZCcpO1xuICAgICAgICAgICAgICAgICAgICBjbGVhbnVwKCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBydW5uaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChub3cgPj0gc3RhcnRfdGltZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0ID0gZWFzaW5nKChub3cgLSBzdGFydF90aW1lKSAvIGR1cmF0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgdGljayh0LCAxIC0gdCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJ1bm5pbmc7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBsZXQgc3RhcnRlZCA9IGZhbHNlO1xuICAgIHJldHVybiB7XG4gICAgICAgIHN0YXJ0KCkge1xuICAgICAgICAgICAgaWYgKHN0YXJ0ZWQpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgc3RhcnRlZCA9IHRydWU7XG4gICAgICAgICAgICBkZWxldGVfcnVsZShub2RlKTtcbiAgICAgICAgICAgIGlmIChpc19mdW5jdGlvbihjb25maWcpKSB7XG4gICAgICAgICAgICAgICAgY29uZmlnID0gY29uZmlnKCk7XG4gICAgICAgICAgICAgICAgd2FpdCgpLnRoZW4oZ28pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZ28oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgaW52YWxpZGF0ZSgpIHtcbiAgICAgICAgICAgIHN0YXJ0ZWQgPSBmYWxzZTtcbiAgICAgICAgfSxcbiAgICAgICAgZW5kKCkge1xuICAgICAgICAgICAgaWYgKHJ1bm5pbmcpIHtcbiAgICAgICAgICAgICAgICBjbGVhbnVwKCk7XG4gICAgICAgICAgICAgICAgcnVubmluZyA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZV9vdXRfdHJhbnNpdGlvbihub2RlLCBmbiwgcGFyYW1zKSB7XG4gICAgbGV0IGNvbmZpZyA9IGZuKG5vZGUsIHBhcmFtcyk7XG4gICAgbGV0IHJ1bm5pbmcgPSB0cnVlO1xuICAgIGxldCBhbmltYXRpb25fbmFtZTtcbiAgICBjb25zdCBncm91cCA9IG91dHJvcztcbiAgICBncm91cC5yICs9IDE7XG4gICAgZnVuY3Rpb24gZ28oKSB7XG4gICAgICAgIGNvbnN0IHsgZGVsYXkgPSAwLCBkdXJhdGlvbiA9IDMwMCwgZWFzaW5nID0gaWRlbnRpdHksIHRpY2sgPSBub29wLCBjc3MgfSA9IGNvbmZpZyB8fCBudWxsX3RyYW5zaXRpb247XG4gICAgICAgIGlmIChjc3MpXG4gICAgICAgICAgICBhbmltYXRpb25fbmFtZSA9IGNyZWF0ZV9ydWxlKG5vZGUsIDEsIDAsIGR1cmF0aW9uLCBkZWxheSwgZWFzaW5nLCBjc3MpO1xuICAgICAgICBjb25zdCBzdGFydF90aW1lID0gbm93KCkgKyBkZWxheTtcbiAgICAgICAgY29uc3QgZW5kX3RpbWUgPSBzdGFydF90aW1lICsgZHVyYXRpb247XG4gICAgICAgIGFkZF9yZW5kZXJfY2FsbGJhY2soKCkgPT4gZGlzcGF0Y2gobm9kZSwgZmFsc2UsICdzdGFydCcpKTtcbiAgICAgICAgbG9vcChub3cgPT4ge1xuICAgICAgICAgICAgaWYgKHJ1bm5pbmcpIHtcbiAgICAgICAgICAgICAgICBpZiAobm93ID49IGVuZF90aW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIHRpY2soMCwgMSk7XG4gICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoKG5vZGUsIGZhbHNlLCAnZW5kJyk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghLS1ncm91cC5yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGlzIHdpbGwgcmVzdWx0IGluIGBlbmQoKWAgYmVpbmcgY2FsbGVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gc28gd2UgZG9uJ3QgbmVlZCB0byBjbGVhbiB1cCBoZXJlXG4gICAgICAgICAgICAgICAgICAgICAgICBydW5fYWxsKGdyb3VwLmMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKG5vdyA+PSBzdGFydF90aW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHQgPSBlYXNpbmcoKG5vdyAtIHN0YXJ0X3RpbWUpIC8gZHVyYXRpb24pO1xuICAgICAgICAgICAgICAgICAgICB0aWNrKDEgLSB0LCB0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcnVubmluZztcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChpc19mdW5jdGlvbihjb25maWcpKSB7XG4gICAgICAgIHdhaXQoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgIGNvbmZpZyA9IGNvbmZpZygpO1xuICAgICAgICAgICAgZ28oKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBnbygpO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgICBlbmQocmVzZXQpIHtcbiAgICAgICAgICAgIGlmIChyZXNldCAmJiBjb25maWcudGljaykge1xuICAgICAgICAgICAgICAgIGNvbmZpZy50aWNrKDEsIDApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHJ1bm5pbmcpIHtcbiAgICAgICAgICAgICAgICBpZiAoYW5pbWF0aW9uX25hbWUpXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZV9ydWxlKG5vZGUsIGFuaW1hdGlvbl9uYW1lKTtcbiAgICAgICAgICAgICAgICBydW5uaW5nID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xufVxuZnVuY3Rpb24gY3JlYXRlX2JpZGlyZWN0aW9uYWxfdHJhbnNpdGlvbihub2RlLCBmbiwgcGFyYW1zLCBpbnRybykge1xuICAgIGxldCBjb25maWcgPSBmbihub2RlLCBwYXJhbXMpO1xuICAgIGxldCB0ID0gaW50cm8gPyAwIDogMTtcbiAgICBsZXQgcnVubmluZ19wcm9ncmFtID0gbnVsbDtcbiAgICBsZXQgcGVuZGluZ19wcm9ncmFtID0gbnVsbDtcbiAgICBsZXQgYW5pbWF0aW9uX25hbWUgPSBudWxsO1xuICAgIGZ1bmN0aW9uIGNsZWFyX2FuaW1hdGlvbigpIHtcbiAgICAgICAgaWYgKGFuaW1hdGlvbl9uYW1lKVxuICAgICAgICAgICAgZGVsZXRlX3J1bGUobm9kZSwgYW5pbWF0aW9uX25hbWUpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBpbml0KHByb2dyYW0sIGR1cmF0aW9uKSB7XG4gICAgICAgIGNvbnN0IGQgPSAocHJvZ3JhbS5iIC0gdCk7XG4gICAgICAgIGR1cmF0aW9uICo9IE1hdGguYWJzKGQpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYTogdCxcbiAgICAgICAgICAgIGI6IHByb2dyYW0uYixcbiAgICAgICAgICAgIGQsXG4gICAgICAgICAgICBkdXJhdGlvbixcbiAgICAgICAgICAgIHN0YXJ0OiBwcm9ncmFtLnN0YXJ0LFxuICAgICAgICAgICAgZW5kOiBwcm9ncmFtLnN0YXJ0ICsgZHVyYXRpb24sXG4gICAgICAgICAgICBncm91cDogcHJvZ3JhbS5ncm91cFxuICAgICAgICB9O1xuICAgIH1cbiAgICBmdW5jdGlvbiBnbyhiKSB7XG4gICAgICAgIGNvbnN0IHsgZGVsYXkgPSAwLCBkdXJhdGlvbiA9IDMwMCwgZWFzaW5nID0gaWRlbnRpdHksIHRpY2sgPSBub29wLCBjc3MgfSA9IGNvbmZpZyB8fCBudWxsX3RyYW5zaXRpb247XG4gICAgICAgIGNvbnN0IHByb2dyYW0gPSB7XG4gICAgICAgICAgICBzdGFydDogbm93KCkgKyBkZWxheSxcbiAgICAgICAgICAgIGJcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKCFiKSB7XG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlIHRvZG86IGltcHJvdmUgdHlwaW5nc1xuICAgICAgICAgICAgcHJvZ3JhbS5ncm91cCA9IG91dHJvcztcbiAgICAgICAgICAgIG91dHJvcy5yICs9IDE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJ1bm5pbmdfcHJvZ3JhbSB8fCBwZW5kaW5nX3Byb2dyYW0pIHtcbiAgICAgICAgICAgIHBlbmRpbmdfcHJvZ3JhbSA9IHByb2dyYW07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBpZiB0aGlzIGlzIGFuIGludHJvLCBhbmQgdGhlcmUncyBhIGRlbGF5LCB3ZSBuZWVkIHRvIGRvXG4gICAgICAgICAgICAvLyBhbiBpbml0aWFsIHRpY2sgYW5kL29yIGFwcGx5IENTUyBhbmltYXRpb24gaW1tZWRpYXRlbHlcbiAgICAgICAgICAgIGlmIChjc3MpIHtcbiAgICAgICAgICAgICAgICBjbGVhcl9hbmltYXRpb24oKTtcbiAgICAgICAgICAgICAgICBhbmltYXRpb25fbmFtZSA9IGNyZWF0ZV9ydWxlKG5vZGUsIHQsIGIsIGR1cmF0aW9uLCBkZWxheSwgZWFzaW5nLCBjc3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGIpXG4gICAgICAgICAgICAgICAgdGljaygwLCAxKTtcbiAgICAgICAgICAgIHJ1bm5pbmdfcHJvZ3JhbSA9IGluaXQocHJvZ3JhbSwgZHVyYXRpb24pO1xuICAgICAgICAgICAgYWRkX3JlbmRlcl9jYWxsYmFjaygoKSA9PiBkaXNwYXRjaChub2RlLCBiLCAnc3RhcnQnKSk7XG4gICAgICAgICAgICBsb29wKG5vdyA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHBlbmRpbmdfcHJvZ3JhbSAmJiBub3cgPiBwZW5kaW5nX3Byb2dyYW0uc3RhcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgcnVubmluZ19wcm9ncmFtID0gaW5pdChwZW5kaW5nX3Byb2dyYW0sIGR1cmF0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgcGVuZGluZ19wcm9ncmFtID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgZGlzcGF0Y2gobm9kZSwgcnVubmluZ19wcm9ncmFtLmIsICdzdGFydCcpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY3NzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGVhcl9hbmltYXRpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdGlvbl9uYW1lID0gY3JlYXRlX3J1bGUobm9kZSwgdCwgcnVubmluZ19wcm9ncmFtLmIsIHJ1bm5pbmdfcHJvZ3JhbS5kdXJhdGlvbiwgMCwgZWFzaW5nLCBjb25maWcuY3NzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocnVubmluZ19wcm9ncmFtKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChub3cgPj0gcnVubmluZ19wcm9ncmFtLmVuZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGljayh0ID0gcnVubmluZ19wcm9ncmFtLmIsIDEgLSB0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoKG5vZGUsIHJ1bm5pbmdfcHJvZ3JhbS5iLCAnZW5kJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXBlbmRpbmdfcHJvZ3JhbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHdlJ3JlIGRvbmVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocnVubmluZ19wcm9ncmFtLmIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaW50cm8g4oCUIHdlIGNhbiB0aWR5IHVwIGltbWVkaWF0ZWx5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFyX2FuaW1hdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gb3V0cm8g4oCUIG5lZWRzIHRvIGJlIGNvb3JkaW5hdGVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghLS1ydW5uaW5nX3Byb2dyYW0uZ3JvdXAucilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJ1bl9hbGwocnVubmluZ19wcm9ncmFtLmdyb3VwLmMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJ1bm5pbmdfcHJvZ3JhbSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAobm93ID49IHJ1bm5pbmdfcHJvZ3JhbS5zdGFydCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcCA9IG5vdyAtIHJ1bm5pbmdfcHJvZ3JhbS5zdGFydDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHQgPSBydW5uaW5nX3Byb2dyYW0uYSArIHJ1bm5pbmdfcHJvZ3JhbS5kICogZWFzaW5nKHAgLyBydW5uaW5nX3Byb2dyYW0uZHVyYXRpb24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGljayh0LCAxIC0gdCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuICEhKHJ1bm5pbmdfcHJvZ3JhbSB8fCBwZW5kaW5nX3Byb2dyYW0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcnVuKGIpIHtcbiAgICAgICAgICAgIGlmIChpc19mdW5jdGlvbihjb25maWcpKSB7XG4gICAgICAgICAgICAgICAgd2FpdCgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZyA9IGNvbmZpZygpO1xuICAgICAgICAgICAgICAgICAgICBnbyhiKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGdvKGIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBlbmQoKSB7XG4gICAgICAgICAgICBjbGVhcl9hbmltYXRpb24oKTtcbiAgICAgICAgICAgIHJ1bm5pbmdfcHJvZ3JhbSA9IHBlbmRpbmdfcHJvZ3JhbSA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9O1xufVxuXG5mdW5jdGlvbiBoYW5kbGVfcHJvbWlzZShwcm9taXNlLCBpbmZvKSB7XG4gICAgY29uc3QgdG9rZW4gPSBpbmZvLnRva2VuID0ge307XG4gICAgZnVuY3Rpb24gdXBkYXRlKHR5cGUsIGluZGV4LCBrZXksIHZhbHVlKSB7XG4gICAgICAgIGlmIChpbmZvLnRva2VuICE9PSB0b2tlbilcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgaW5mby5yZXNvbHZlZCA9IHZhbHVlO1xuICAgICAgICBsZXQgY2hpbGRfY3R4ID0gaW5mby5jdHg7XG4gICAgICAgIGlmIChrZXkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY2hpbGRfY3R4ID0gY2hpbGRfY3R4LnNsaWNlKCk7XG4gICAgICAgICAgICBjaGlsZF9jdHhba2V5XSA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGJsb2NrID0gdHlwZSAmJiAoaW5mby5jdXJyZW50ID0gdHlwZSkoY2hpbGRfY3R4KTtcbiAgICAgICAgbGV0IG5lZWRzX2ZsdXNoID0gZmFsc2U7XG4gICAgICAgIGlmIChpbmZvLmJsb2NrKSB7XG4gICAgICAgICAgICBpZiAoaW5mby5ibG9ja3MpIHtcbiAgICAgICAgICAgICAgICBpbmZvLmJsb2Nrcy5mb3JFYWNoKChibG9jaywgaSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaSAhPT0gaW5kZXggJiYgYmxvY2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwX291dHJvcygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbl9vdXQoYmxvY2ssIDEsIDEsICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5mby5ibG9ja3NbaV0gPT09IGJsb2NrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZm8uYmxvY2tzW2ldID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoZWNrX291dHJvcygpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpbmZvLmJsb2NrLmQoMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBibG9jay5jKCk7XG4gICAgICAgICAgICB0cmFuc2l0aW9uX2luKGJsb2NrLCAxKTtcbiAgICAgICAgICAgIGJsb2NrLm0oaW5mby5tb3VudCgpLCBpbmZvLmFuY2hvcik7XG4gICAgICAgICAgICBuZWVkc19mbHVzaCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaW5mby5ibG9jayA9IGJsb2NrO1xuICAgICAgICBpZiAoaW5mby5ibG9ja3MpXG4gICAgICAgICAgICBpbmZvLmJsb2Nrc1tpbmRleF0gPSBibG9jaztcbiAgICAgICAgaWYgKG5lZWRzX2ZsdXNoKSB7XG4gICAgICAgICAgICBmbHVzaCgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmIChpc19wcm9taXNlKHByb21pc2UpKSB7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRfY29tcG9uZW50ID0gZ2V0X2N1cnJlbnRfY29tcG9uZW50KCk7XG4gICAgICAgIHByb21pc2UudGhlbih2YWx1ZSA9PiB7XG4gICAgICAgICAgICBzZXRfY3VycmVudF9jb21wb25lbnQoY3VycmVudF9jb21wb25lbnQpO1xuICAgICAgICAgICAgdXBkYXRlKGluZm8udGhlbiwgMSwgaW5mby52YWx1ZSwgdmFsdWUpO1xuICAgICAgICAgICAgc2V0X2N1cnJlbnRfY29tcG9uZW50KG51bGwpO1xuICAgICAgICB9LCBlcnJvciA9PiB7XG4gICAgICAgICAgICBzZXRfY3VycmVudF9jb21wb25lbnQoY3VycmVudF9jb21wb25lbnQpO1xuICAgICAgICAgICAgdXBkYXRlKGluZm8uY2F0Y2gsIDIsIGluZm8uZXJyb3IsIGVycm9yKTtcbiAgICAgICAgICAgIHNldF9jdXJyZW50X2NvbXBvbmVudChudWxsKTtcbiAgICAgICAgICAgIGlmICghaW5mby5oYXNDYXRjaCkge1xuICAgICAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgLy8gaWYgd2UgcHJldmlvdXNseSBoYWQgYSB0aGVuL2NhdGNoIGJsb2NrLCBkZXN0cm95IGl0XG4gICAgICAgIGlmIChpbmZvLmN1cnJlbnQgIT09IGluZm8ucGVuZGluZykge1xuICAgICAgICAgICAgdXBkYXRlKGluZm8ucGVuZGluZywgMCk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgaWYgKGluZm8uY3VycmVudCAhPT0gaW5mby50aGVuKSB7XG4gICAgICAgICAgICB1cGRhdGUoaW5mby50aGVuLCAxLCBpbmZvLnZhbHVlLCBwcm9taXNlKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGluZm8ucmVzb2x2ZWQgPSBwcm9taXNlO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHVwZGF0ZV9hd2FpdF9ibG9ja19icmFuY2goaW5mbywgY3R4LCBkaXJ0eSkge1xuICAgIGNvbnN0IGNoaWxkX2N0eCA9IGN0eC5zbGljZSgpO1xuICAgIGNvbnN0IHsgcmVzb2x2ZWQgfSA9IGluZm87XG4gICAgaWYgKGluZm8uY3VycmVudCA9PT0gaW5mby50aGVuKSB7XG4gICAgICAgIGNoaWxkX2N0eFtpbmZvLnZhbHVlXSA9IHJlc29sdmVkO1xuICAgIH1cbiAgICBpZiAoaW5mby5jdXJyZW50ID09PSBpbmZvLmNhdGNoKSB7XG4gICAgICAgIGNoaWxkX2N0eFtpbmZvLmVycm9yXSA9IHJlc29sdmVkO1xuICAgIH1cbiAgICBpbmZvLmJsb2NrLnAoY2hpbGRfY3R4LCBkaXJ0eSk7XG59XG5cbmNvbnN0IGdsb2JhbHMgPSAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCdcbiAgICA/IHdpbmRvd1xuICAgIDogdHlwZW9mIGdsb2JhbFRoaXMgIT09ICd1bmRlZmluZWQnXG4gICAgICAgID8gZ2xvYmFsVGhpc1xuICAgICAgICA6IGdsb2JhbCk7XG5cbmZ1bmN0aW9uIGRlc3Ryb3lfYmxvY2soYmxvY2ssIGxvb2t1cCkge1xuICAgIGJsb2NrLmQoMSk7XG4gICAgbG9va3VwLmRlbGV0ZShibG9jay5rZXkpO1xufVxuZnVuY3Rpb24gb3V0cm9fYW5kX2Rlc3Ryb3lfYmxvY2soYmxvY2ssIGxvb2t1cCkge1xuICAgIHRyYW5zaXRpb25fb3V0KGJsb2NrLCAxLCAxLCAoKSA9PiB7XG4gICAgICAgIGxvb2t1cC5kZWxldGUoYmxvY2sua2V5KTtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGZpeF9hbmRfZGVzdHJveV9ibG9jayhibG9jaywgbG9va3VwKSB7XG4gICAgYmxvY2suZigpO1xuICAgIGRlc3Ryb3lfYmxvY2soYmxvY2ssIGxvb2t1cCk7XG59XG5mdW5jdGlvbiBmaXhfYW5kX291dHJvX2FuZF9kZXN0cm95X2Jsb2NrKGJsb2NrLCBsb29rdXApIHtcbiAgICBibG9jay5mKCk7XG4gICAgb3V0cm9fYW5kX2Rlc3Ryb3lfYmxvY2soYmxvY2ssIGxvb2t1cCk7XG59XG5mdW5jdGlvbiB1cGRhdGVfa2V5ZWRfZWFjaChvbGRfYmxvY2tzLCBkaXJ0eSwgZ2V0X2tleSwgZHluYW1pYywgY3R4LCBsaXN0LCBsb29rdXAsIG5vZGUsIGRlc3Ryb3ksIGNyZWF0ZV9lYWNoX2Jsb2NrLCBuZXh0LCBnZXRfY29udGV4dCkge1xuICAgIGxldCBvID0gb2xkX2Jsb2Nrcy5sZW5ndGg7XG4gICAgbGV0IG4gPSBsaXN0Lmxlbmd0aDtcbiAgICBsZXQgaSA9IG87XG4gICAgY29uc3Qgb2xkX2luZGV4ZXMgPSB7fTtcbiAgICB3aGlsZSAoaS0tKVxuICAgICAgICBvbGRfaW5kZXhlc1tvbGRfYmxvY2tzW2ldLmtleV0gPSBpO1xuICAgIGNvbnN0IG5ld19ibG9ja3MgPSBbXTtcbiAgICBjb25zdCBuZXdfbG9va3VwID0gbmV3IE1hcCgpO1xuICAgIGNvbnN0IGRlbHRhcyA9IG5ldyBNYXAoKTtcbiAgICBpID0gbjtcbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgIGNvbnN0IGNoaWxkX2N0eCA9IGdldF9jb250ZXh0KGN0eCwgbGlzdCwgaSk7XG4gICAgICAgIGNvbnN0IGtleSA9IGdldF9rZXkoY2hpbGRfY3R4KTtcbiAgICAgICAgbGV0IGJsb2NrID0gbG9va3VwLmdldChrZXkpO1xuICAgICAgICBpZiAoIWJsb2NrKSB7XG4gICAgICAgICAgICBibG9jayA9IGNyZWF0ZV9lYWNoX2Jsb2NrKGtleSwgY2hpbGRfY3R4KTtcbiAgICAgICAgICAgIGJsb2NrLmMoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChkeW5hbWljKSB7XG4gICAgICAgICAgICBibG9jay5wKGNoaWxkX2N0eCwgZGlydHkpO1xuICAgICAgICB9XG4gICAgICAgIG5ld19sb29rdXAuc2V0KGtleSwgbmV3X2Jsb2Nrc1tpXSA9IGJsb2NrKTtcbiAgICAgICAgaWYgKGtleSBpbiBvbGRfaW5kZXhlcylcbiAgICAgICAgICAgIGRlbHRhcy5zZXQoa2V5LCBNYXRoLmFicyhpIC0gb2xkX2luZGV4ZXNba2V5XSkpO1xuICAgIH1cbiAgICBjb25zdCB3aWxsX21vdmUgPSBuZXcgU2V0KCk7XG4gICAgY29uc3QgZGlkX21vdmUgPSBuZXcgU2V0KCk7XG4gICAgZnVuY3Rpb24gaW5zZXJ0KGJsb2NrKSB7XG4gICAgICAgIHRyYW5zaXRpb25faW4oYmxvY2ssIDEpO1xuICAgICAgICBibG9jay5tKG5vZGUsIG5leHQpO1xuICAgICAgICBsb29rdXAuc2V0KGJsb2NrLmtleSwgYmxvY2spO1xuICAgICAgICBuZXh0ID0gYmxvY2suZmlyc3Q7XG4gICAgICAgIG4tLTtcbiAgICB9XG4gICAgd2hpbGUgKG8gJiYgbikge1xuICAgICAgICBjb25zdCBuZXdfYmxvY2sgPSBuZXdfYmxvY2tzW24gLSAxXTtcbiAgICAgICAgY29uc3Qgb2xkX2Jsb2NrID0gb2xkX2Jsb2Nrc1tvIC0gMV07XG4gICAgICAgIGNvbnN0IG5ld19rZXkgPSBuZXdfYmxvY2sua2V5O1xuICAgICAgICBjb25zdCBvbGRfa2V5ID0gb2xkX2Jsb2NrLmtleTtcbiAgICAgICAgaWYgKG5ld19ibG9jayA9PT0gb2xkX2Jsb2NrKSB7XG4gICAgICAgICAgICAvLyBkbyBub3RoaW5nXG4gICAgICAgICAgICBuZXh0ID0gbmV3X2Jsb2NrLmZpcnN0O1xuICAgICAgICAgICAgby0tO1xuICAgICAgICAgICAgbi0tO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKCFuZXdfbG9va3VwLmhhcyhvbGRfa2V5KSkge1xuICAgICAgICAgICAgLy8gcmVtb3ZlIG9sZCBibG9ja1xuICAgICAgICAgICAgZGVzdHJveShvbGRfYmxvY2ssIGxvb2t1cCk7XG4gICAgICAgICAgICBvLS07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoIWxvb2t1cC5oYXMobmV3X2tleSkgfHwgd2lsbF9tb3ZlLmhhcyhuZXdfa2V5KSkge1xuICAgICAgICAgICAgaW5zZXJ0KG5ld19ibG9jayk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZGlkX21vdmUuaGFzKG9sZF9rZXkpKSB7XG4gICAgICAgICAgICBvLS07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZGVsdGFzLmdldChuZXdfa2V5KSA+IGRlbHRhcy5nZXQob2xkX2tleSkpIHtcbiAgICAgICAgICAgIGRpZF9tb3ZlLmFkZChuZXdfa2V5KTtcbiAgICAgICAgICAgIGluc2VydChuZXdfYmxvY2spO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgd2lsbF9tb3ZlLmFkZChvbGRfa2V5KTtcbiAgICAgICAgICAgIG8tLTtcbiAgICAgICAgfVxuICAgIH1cbiAgICB3aGlsZSAoby0tKSB7XG4gICAgICAgIGNvbnN0IG9sZF9ibG9jayA9IG9sZF9ibG9ja3Nbb107XG4gICAgICAgIGlmICghbmV3X2xvb2t1cC5oYXMob2xkX2Jsb2NrLmtleSkpXG4gICAgICAgICAgICBkZXN0cm95KG9sZF9ibG9jaywgbG9va3VwKTtcbiAgICB9XG4gICAgd2hpbGUgKG4pXG4gICAgICAgIGluc2VydChuZXdfYmxvY2tzW24gLSAxXSk7XG4gICAgcmV0dXJuIG5ld19ibG9ja3M7XG59XG5mdW5jdGlvbiB2YWxpZGF0ZV9lYWNoX2tleXMoY3R4LCBsaXN0LCBnZXRfY29udGV4dCwgZ2V0X2tleSkge1xuICAgIGNvbnN0IGtleXMgPSBuZXcgU2V0KCk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGtleSA9IGdldF9rZXkoZ2V0X2NvbnRleHQoY3R4LCBsaXN0LCBpKSk7XG4gICAgICAgIGlmIChrZXlzLmhhcyhrZXkpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBoYXZlIGR1cGxpY2F0ZSBrZXlzIGluIGEga2V5ZWQgZWFjaCcpO1xuICAgICAgICB9XG4gICAgICAgIGtleXMuYWRkKGtleSk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBnZXRfc3ByZWFkX3VwZGF0ZShsZXZlbHMsIHVwZGF0ZXMpIHtcbiAgICBjb25zdCB1cGRhdGUgPSB7fTtcbiAgICBjb25zdCB0b19udWxsX291dCA9IHt9O1xuICAgIGNvbnN0IGFjY291bnRlZF9mb3IgPSB7ICQkc2NvcGU6IDEgfTtcbiAgICBsZXQgaSA9IGxldmVscy5sZW5ndGg7XG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgICBjb25zdCBvID0gbGV2ZWxzW2ldO1xuICAgICAgICBjb25zdCBuID0gdXBkYXRlc1tpXTtcbiAgICAgICAgaWYgKG4pIHtcbiAgICAgICAgICAgIGZvciAoY29uc3Qga2V5IGluIG8pIHtcbiAgICAgICAgICAgICAgICBpZiAoIShrZXkgaW4gbikpXG4gICAgICAgICAgICAgICAgICAgIHRvX251bGxfb3V0W2tleV0gPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gbikge1xuICAgICAgICAgICAgICAgIGlmICghYWNjb3VudGVkX2ZvcltrZXldKSB7XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZVtrZXldID0gbltrZXldO1xuICAgICAgICAgICAgICAgICAgICBhY2NvdW50ZWRfZm9yW2tleV0gPSAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldmVsc1tpXSA9IG47XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBvKSB7XG4gICAgICAgICAgICAgICAgYWNjb3VudGVkX2ZvcltrZXldID0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBmb3IgKGNvbnN0IGtleSBpbiB0b19udWxsX291dCkge1xuICAgICAgICBpZiAoIShrZXkgaW4gdXBkYXRlKSlcbiAgICAgICAgICAgIHVwZGF0ZVtrZXldID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICByZXR1cm4gdXBkYXRlO1xufVxuZnVuY3Rpb24gZ2V0X3NwcmVhZF9vYmplY3Qoc3ByZWFkX3Byb3BzKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBzcHJlYWRfcHJvcHMgPT09ICdvYmplY3QnICYmIHNwcmVhZF9wcm9wcyAhPT0gbnVsbCA/IHNwcmVhZF9wcm9wcyA6IHt9O1xufVxuXG4vLyBzb3VyY2U6IGh0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvbXVsdGlwYWdlL2luZGljZXMuaHRtbFxuY29uc3QgYm9vbGVhbl9hdHRyaWJ1dGVzID0gbmV3IFNldChbXG4gICAgJ2FsbG93ZnVsbHNjcmVlbicsXG4gICAgJ2FsbG93cGF5bWVudHJlcXVlc3QnLFxuICAgICdhc3luYycsXG4gICAgJ2F1dG9mb2N1cycsXG4gICAgJ2F1dG9wbGF5JyxcbiAgICAnY2hlY2tlZCcsXG4gICAgJ2NvbnRyb2xzJyxcbiAgICAnZGVmYXVsdCcsXG4gICAgJ2RlZmVyJyxcbiAgICAnZGlzYWJsZWQnLFxuICAgICdmb3Jtbm92YWxpZGF0ZScsXG4gICAgJ2hpZGRlbicsXG4gICAgJ2lzbWFwJyxcbiAgICAnbG9vcCcsXG4gICAgJ211bHRpcGxlJyxcbiAgICAnbXV0ZWQnLFxuICAgICdub21vZHVsZScsXG4gICAgJ25vdmFsaWRhdGUnLFxuICAgICdvcGVuJyxcbiAgICAncGxheXNpbmxpbmUnLFxuICAgICdyZWFkb25seScsXG4gICAgJ3JlcXVpcmVkJyxcbiAgICAncmV2ZXJzZWQnLFxuICAgICdzZWxlY3RlZCdcbl0pO1xuXG5jb25zdCB2b2lkX2VsZW1lbnRfbmFtZXMgPSAvXig/OmFyZWF8YmFzZXxicnxjb2x8Y29tbWFuZHxlbWJlZHxocnxpbWd8aW5wdXR8a2V5Z2VufGxpbmt8bWV0YXxwYXJhbXxzb3VyY2V8dHJhY2t8d2JyKSQvO1xuZnVuY3Rpb24gaXNfdm9pZChuYW1lKSB7XG4gICAgcmV0dXJuIHZvaWRfZWxlbWVudF9uYW1lcy50ZXN0KG5hbWUpIHx8IG5hbWUudG9Mb3dlckNhc2UoKSA9PT0gJyFkb2N0eXBlJztcbn1cblxuY29uc3QgaW52YWxpZF9hdHRyaWJ1dGVfbmFtZV9jaGFyYWN0ZXIgPSAvW1xccydcIj4vPVxcdXtGREQwfS1cXHV7RkRFRn1cXHV7RkZGRX1cXHV7RkZGRn1cXHV7MUZGRkV9XFx1ezFGRkZGfVxcdXsyRkZGRX1cXHV7MkZGRkZ9XFx1ezNGRkZFfVxcdXszRkZGRn1cXHV7NEZGRkV9XFx1ezRGRkZGfVxcdXs1RkZGRX1cXHV7NUZGRkZ9XFx1ezZGRkZFfVxcdXs2RkZGRn1cXHV7N0ZGRkV9XFx1ezdGRkZGfVxcdXs4RkZGRX1cXHV7OEZGRkZ9XFx1ezlGRkZFfVxcdXs5RkZGRn1cXHV7QUZGRkV9XFx1e0FGRkZGfVxcdXtCRkZGRX1cXHV7QkZGRkZ9XFx1e0NGRkZFfVxcdXtDRkZGRn1cXHV7REZGRkV9XFx1e0RGRkZGfVxcdXtFRkZGRX1cXHV7RUZGRkZ9XFx1e0ZGRkZFfVxcdXtGRkZGRn1cXHV7MTBGRkZFfVxcdXsxMEZGRkZ9XS91O1xuLy8gaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy9tdWx0aXBhZ2Uvc3ludGF4Lmh0bWwjYXR0cmlidXRlcy0yXG4vLyBodHRwczovL2luZnJhLnNwZWMud2hhdHdnLm9yZy8jbm9uY2hhcmFjdGVyXG5mdW5jdGlvbiBzcHJlYWQoYXJncywgYXR0cnNfdG9fYWRkKSB7XG4gICAgY29uc3QgYXR0cmlidXRlcyA9IE9iamVjdC5hc3NpZ24oe30sIC4uLmFyZ3MpO1xuICAgIGlmIChhdHRyc190b19hZGQpIHtcbiAgICAgICAgY29uc3QgY2xhc3Nlc190b19hZGQgPSBhdHRyc190b19hZGQuY2xhc3NlcztcbiAgICAgICAgY29uc3Qgc3R5bGVzX3RvX2FkZCA9IGF0dHJzX3RvX2FkZC5zdHlsZXM7XG4gICAgICAgIGlmIChjbGFzc2VzX3RvX2FkZCkge1xuICAgICAgICAgICAgaWYgKGF0dHJpYnV0ZXMuY2xhc3MgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXMuY2xhc3MgPSBjbGFzc2VzX3RvX2FkZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXMuY2xhc3MgKz0gJyAnICsgY2xhc3Nlc190b19hZGQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHN0eWxlc190b19hZGQpIHtcbiAgICAgICAgICAgIGlmIChhdHRyaWJ1dGVzLnN0eWxlID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzLnN0eWxlID0gc3R5bGVfb2JqZWN0X3RvX3N0cmluZyhzdHlsZXNfdG9fYWRkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXMuc3R5bGUgPSBzdHlsZV9vYmplY3RfdG9fc3RyaW5nKG1lcmdlX3Nzcl9zdHlsZXMoYXR0cmlidXRlcy5zdHlsZSwgc3R5bGVzX3RvX2FkZCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGxldCBzdHIgPSAnJztcbiAgICBPYmplY3Qua2V5cyhhdHRyaWJ1dGVzKS5mb3JFYWNoKG5hbWUgPT4ge1xuICAgICAgICBpZiAoaW52YWxpZF9hdHRyaWJ1dGVfbmFtZV9jaGFyYWN0ZXIudGVzdChuYW1lKSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBhdHRyaWJ1dGVzW25hbWVdO1xuICAgICAgICBpZiAodmFsdWUgPT09IHRydWUpXG4gICAgICAgICAgICBzdHIgKz0gJyAnICsgbmFtZTtcbiAgICAgICAgZWxzZSBpZiAoYm9vbGVhbl9hdHRyaWJ1dGVzLmhhcyhuYW1lLnRvTG93ZXJDYXNlKCkpKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUpXG4gICAgICAgICAgICAgICAgc3RyICs9ICcgJyArIG5hbWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodmFsdWUgIT0gbnVsbCkge1xuICAgICAgICAgICAgc3RyICs9IGAgJHtuYW1lfT1cIiR7dmFsdWV9XCJgO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHN0cjtcbn1cbmZ1bmN0aW9uIG1lcmdlX3Nzcl9zdHlsZXMoc3R5bGVfYXR0cmlidXRlLCBzdHlsZV9kaXJlY3RpdmUpIHtcbiAgICBjb25zdCBzdHlsZV9vYmplY3QgPSB7fTtcbiAgICBmb3IgKGNvbnN0IGluZGl2aWR1YWxfc3R5bGUgb2Ygc3R5bGVfYXR0cmlidXRlLnNwbGl0KCc7JykpIHtcbiAgICAgICAgY29uc3QgY29sb25faW5kZXggPSBpbmRpdmlkdWFsX3N0eWxlLmluZGV4T2YoJzonKTtcbiAgICAgICAgY29uc3QgbmFtZSA9IGluZGl2aWR1YWxfc3R5bGUuc2xpY2UoMCwgY29sb25faW5kZXgpLnRyaW0oKTtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBpbmRpdmlkdWFsX3N0eWxlLnNsaWNlKGNvbG9uX2luZGV4ICsgMSkudHJpbSgpO1xuICAgICAgICBpZiAoIW5hbWUpXG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgc3R5bGVfb2JqZWN0W25hbWVdID0gdmFsdWU7XG4gICAgfVxuICAgIGZvciAoY29uc3QgbmFtZSBpbiBzdHlsZV9kaXJlY3RpdmUpIHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBzdHlsZV9kaXJlY3RpdmVbbmFtZV07XG4gICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgc3R5bGVfb2JqZWN0W25hbWVdID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBkZWxldGUgc3R5bGVfb2JqZWN0W25hbWVdO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzdHlsZV9vYmplY3Q7XG59XG5jb25zdCBlc2NhcGVkID0ge1xuICAgICdcIic6ICcmcXVvdDsnLFxuICAgIFwiJ1wiOiAnJiMzOTsnLFxuICAgICcmJzogJyZhbXA7JyxcbiAgICAnPCc6ICcmbHQ7JyxcbiAgICAnPic6ICcmZ3Q7J1xufTtcbmZ1bmN0aW9uIGVzY2FwZShodG1sKSB7XG4gICAgcmV0dXJuIFN0cmluZyhodG1sKS5yZXBsYWNlKC9bXCInJjw+XS9nLCBtYXRjaCA9PiBlc2NhcGVkW21hdGNoXSk7XG59XG5mdW5jdGlvbiBlc2NhcGVfYXR0cmlidXRlX3ZhbHVlKHZhbHVlKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgPyBlc2NhcGUodmFsdWUpIDogdmFsdWU7XG59XG5mdW5jdGlvbiBlc2NhcGVfb2JqZWN0KG9iaikge1xuICAgIGNvbnN0IHJlc3VsdCA9IHt9O1xuICAgIGZvciAoY29uc3Qga2V5IGluIG9iaikge1xuICAgICAgICByZXN1bHRba2V5XSA9IGVzY2FwZV9hdHRyaWJ1dGVfdmFsdWUob2JqW2tleV0pO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gZWFjaChpdGVtcywgZm4pIHtcbiAgICBsZXQgc3RyID0gJyc7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBzdHIgKz0gZm4oaXRlbXNbaV0sIGkpO1xuICAgIH1cbiAgICByZXR1cm4gc3RyO1xufVxuY29uc3QgbWlzc2luZ19jb21wb25lbnQgPSB7XG4gICAgJCRyZW5kZXI6ICgpID0+ICcnXG59O1xuZnVuY3Rpb24gdmFsaWRhdGVfY29tcG9uZW50KGNvbXBvbmVudCwgbmFtZSkge1xuICAgIGlmICghY29tcG9uZW50IHx8ICFjb21wb25lbnQuJCRyZW5kZXIpIHtcbiAgICAgICAgaWYgKG5hbWUgPT09ICdzdmVsdGU6Y29tcG9uZW50JylcbiAgICAgICAgICAgIG5hbWUgKz0gJyB0aGlzPXsuLi59JztcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGA8JHtuYW1lfT4gaXMgbm90IGEgdmFsaWQgU1NSIGNvbXBvbmVudC4gWW91IG1heSBuZWVkIHRvIHJldmlldyB5b3VyIGJ1aWxkIGNvbmZpZyB0byBlbnN1cmUgdGhhdCBkZXBlbmRlbmNpZXMgYXJlIGNvbXBpbGVkLCByYXRoZXIgdGhhbiBpbXBvcnRlZCBhcyBwcmUtY29tcGlsZWQgbW9kdWxlc2ApO1xuICAgIH1cbiAgICByZXR1cm4gY29tcG9uZW50O1xufVxuZnVuY3Rpb24gZGVidWcoZmlsZSwgbGluZSwgY29sdW1uLCB2YWx1ZXMpIHtcbiAgICBjb25zb2xlLmxvZyhge0BkZWJ1Z30gJHtmaWxlID8gZmlsZSArICcgJyA6ICcnfSgke2xpbmV9OiR7Y29sdW1ufSlgKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1jb25zb2xlXG4gICAgY29uc29sZS5sb2codmFsdWVzKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1jb25zb2xlXG4gICAgcmV0dXJuICcnO1xufVxubGV0IG9uX2Rlc3Ryb3k7XG5mdW5jdGlvbiBjcmVhdGVfc3NyX2NvbXBvbmVudChmbikge1xuICAgIGZ1bmN0aW9uICQkcmVuZGVyKHJlc3VsdCwgcHJvcHMsIGJpbmRpbmdzLCBzbG90cywgY29udGV4dCkge1xuICAgICAgICBjb25zdCBwYXJlbnRfY29tcG9uZW50ID0gY3VycmVudF9jb21wb25lbnQ7XG4gICAgICAgIGNvbnN0ICQkID0ge1xuICAgICAgICAgICAgb25fZGVzdHJveSxcbiAgICAgICAgICAgIGNvbnRleHQ6IG5ldyBNYXAoY29udGV4dCB8fCAocGFyZW50X2NvbXBvbmVudCA/IHBhcmVudF9jb21wb25lbnQuJCQuY29udGV4dCA6IFtdKSksXG4gICAgICAgICAgICAvLyB0aGVzZSB3aWxsIGJlIGltbWVkaWF0ZWx5IGRpc2NhcmRlZFxuICAgICAgICAgICAgb25fbW91bnQ6IFtdLFxuICAgICAgICAgICAgYmVmb3JlX3VwZGF0ZTogW10sXG4gICAgICAgICAgICBhZnRlcl91cGRhdGU6IFtdLFxuICAgICAgICAgICAgY2FsbGJhY2tzOiBibGFua19vYmplY3QoKVxuICAgICAgICB9O1xuICAgICAgICBzZXRfY3VycmVudF9jb21wb25lbnQoeyAkJCB9KTtcbiAgICAgICAgY29uc3QgaHRtbCA9IGZuKHJlc3VsdCwgcHJvcHMsIGJpbmRpbmdzLCBzbG90cyk7XG4gICAgICAgIHNldF9jdXJyZW50X2NvbXBvbmVudChwYXJlbnRfY29tcG9uZW50KTtcbiAgICAgICAgcmV0dXJuIGh0bWw7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgIHJlbmRlcjogKHByb3BzID0ge30sIHsgJCRzbG90cyA9IHt9LCBjb250ZXh0ID0gbmV3IE1hcCgpIH0gPSB7fSkgPT4ge1xuICAgICAgICAgICAgb25fZGVzdHJveSA9IFtdO1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0geyB0aXRsZTogJycsIGhlYWQ6ICcnLCBjc3M6IG5ldyBTZXQoKSB9O1xuICAgICAgICAgICAgY29uc3QgaHRtbCA9ICQkcmVuZGVyKHJlc3VsdCwgcHJvcHMsIHt9LCAkJHNsb3RzLCBjb250ZXh0KTtcbiAgICAgICAgICAgIHJ1bl9hbGwob25fZGVzdHJveSk7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGh0bWwsXG4gICAgICAgICAgICAgICAgY3NzOiB7XG4gICAgICAgICAgICAgICAgICAgIGNvZGU6IEFycmF5LmZyb20ocmVzdWx0LmNzcykubWFwKGNzcyA9PiBjc3MuY29kZSkuam9pbignXFxuJyksXG4gICAgICAgICAgICAgICAgICAgIG1hcDogbnVsbCAvLyBUT0RPXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBoZWFkOiByZXN1bHQudGl0bGUgKyByZXN1bHQuaGVhZFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSxcbiAgICAgICAgJCRyZW5kZXJcbiAgICB9O1xufVxuZnVuY3Rpb24gYWRkX2F0dHJpYnV0ZShuYW1lLCB2YWx1ZSwgYm9vbGVhbikge1xuICAgIGlmICh2YWx1ZSA9PSBudWxsIHx8IChib29sZWFuICYmICF2YWx1ZSkpXG4gICAgICAgIHJldHVybiAnJztcbiAgICBjb25zdCBhc3NpZ25tZW50ID0gKGJvb2xlYW4gJiYgdmFsdWUgPT09IHRydWUpID8gJycgOiBgPVwiJHtlc2NhcGVfYXR0cmlidXRlX3ZhbHVlKHZhbHVlLnRvU3RyaW5nKCkpfVwiYDtcbiAgICByZXR1cm4gYCAke25hbWV9JHthc3NpZ25tZW50fWA7XG59XG5mdW5jdGlvbiBhZGRfY2xhc3NlcyhjbGFzc2VzKSB7XG4gICAgcmV0dXJuIGNsYXNzZXMgPyBgIGNsYXNzPVwiJHtjbGFzc2VzfVwiYCA6ICcnO1xufVxuZnVuY3Rpb24gc3R5bGVfb2JqZWN0X3RvX3N0cmluZyhzdHlsZV9vYmplY3QpIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXMoc3R5bGVfb2JqZWN0KVxuICAgICAgICAuZmlsdGVyKGtleSA9PiBzdHlsZV9vYmplY3Rba2V5XSlcbiAgICAgICAgLm1hcChrZXkgPT4gYCR7a2V5fTogJHtzdHlsZV9vYmplY3Rba2V5XX07YClcbiAgICAgICAgLmpvaW4oJyAnKTtcbn1cbmZ1bmN0aW9uIGFkZF9zdHlsZXMoc3R5bGVfb2JqZWN0KSB7XG4gICAgY29uc3Qgc3R5bGVzID0gc3R5bGVfb2JqZWN0X3RvX3N0cmluZyhzdHlsZV9vYmplY3QpO1xuICAgIHJldHVybiBzdHlsZXMgPyBgIHN0eWxlPVwiJHtzdHlsZXN9XCJgIDogJyc7XG59XG5cbmZ1bmN0aW9uIGJpbmQoY29tcG9uZW50LCBuYW1lLCBjYWxsYmFjaykge1xuICAgIGNvbnN0IGluZGV4ID0gY29tcG9uZW50LiQkLnByb3BzW25hbWVdO1xuICAgIGlmIChpbmRleCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNvbXBvbmVudC4kJC5ib3VuZFtpbmRleF0gPSBjYWxsYmFjaztcbiAgICAgICAgY2FsbGJhY2soY29tcG9uZW50LiQkLmN0eFtpbmRleF0pO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGNyZWF0ZV9jb21wb25lbnQoYmxvY2spIHtcbiAgICBibG9jayAmJiBibG9jay5jKCk7XG59XG5mdW5jdGlvbiBjbGFpbV9jb21wb25lbnQoYmxvY2ssIHBhcmVudF9ub2Rlcykge1xuICAgIGJsb2NrICYmIGJsb2NrLmwocGFyZW50X25vZGVzKTtcbn1cbmZ1bmN0aW9uIG1vdW50X2NvbXBvbmVudChjb21wb25lbnQsIHRhcmdldCwgYW5jaG9yLCBjdXN0b21FbGVtZW50KSB7XG4gICAgY29uc3QgeyBmcmFnbWVudCwgb25fbW91bnQsIG9uX2Rlc3Ryb3ksIGFmdGVyX3VwZGF0ZSB9ID0gY29tcG9uZW50LiQkO1xuICAgIGZyYWdtZW50ICYmIGZyYWdtZW50Lm0odGFyZ2V0LCBhbmNob3IpO1xuICAgIGlmICghY3VzdG9tRWxlbWVudCkge1xuICAgICAgICAvLyBvbk1vdW50IGhhcHBlbnMgYmVmb3JlIHRoZSBpbml0aWFsIGFmdGVyVXBkYXRlXG4gICAgICAgIGFkZF9yZW5kZXJfY2FsbGJhY2soKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgbmV3X29uX2Rlc3Ryb3kgPSBvbl9tb3VudC5tYXAocnVuKS5maWx0ZXIoaXNfZnVuY3Rpb24pO1xuICAgICAgICAgICAgaWYgKG9uX2Rlc3Ryb3kpIHtcbiAgICAgICAgICAgICAgICBvbl9kZXN0cm95LnB1c2goLi4ubmV3X29uX2Rlc3Ryb3kpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gRWRnZSBjYXNlIC0gY29tcG9uZW50IHdhcyBkZXN0cm95ZWQgaW1tZWRpYXRlbHksXG4gICAgICAgICAgICAgICAgLy8gbW9zdCBsaWtlbHkgYXMgYSByZXN1bHQgb2YgYSBiaW5kaW5nIGluaXRpYWxpc2luZ1xuICAgICAgICAgICAgICAgIHJ1bl9hbGwobmV3X29uX2Rlc3Ryb3kpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29tcG9uZW50LiQkLm9uX21vdW50ID0gW107XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBhZnRlcl91cGRhdGUuZm9yRWFjaChhZGRfcmVuZGVyX2NhbGxiYWNrKTtcbn1cbmZ1bmN0aW9uIGRlc3Ryb3lfY29tcG9uZW50KGNvbXBvbmVudCwgZGV0YWNoaW5nKSB7XG4gICAgY29uc3QgJCQgPSBjb21wb25lbnQuJCQ7XG4gICAgaWYgKCQkLmZyYWdtZW50ICE9PSBudWxsKSB7XG4gICAgICAgIHJ1bl9hbGwoJCQub25fZGVzdHJveSk7XG4gICAgICAgICQkLmZyYWdtZW50ICYmICQkLmZyYWdtZW50LmQoZGV0YWNoaW5nKTtcbiAgICAgICAgLy8gVE9ETyBudWxsIG91dCBvdGhlciByZWZzLCBpbmNsdWRpbmcgY29tcG9uZW50LiQkIChidXQgbmVlZCB0b1xuICAgICAgICAvLyBwcmVzZXJ2ZSBmaW5hbCBzdGF0ZT8pXG4gICAgICAgICQkLm9uX2Rlc3Ryb3kgPSAkJC5mcmFnbWVudCA9IG51bGw7XG4gICAgICAgICQkLmN0eCA9IFtdO1xuICAgIH1cbn1cbmZ1bmN0aW9uIG1ha2VfZGlydHkoY29tcG9uZW50LCBpKSB7XG4gICAgaWYgKGNvbXBvbmVudC4kJC5kaXJ0eVswXSA9PT0gLTEpIHtcbiAgICAgICAgZGlydHlfY29tcG9uZW50cy5wdXNoKGNvbXBvbmVudCk7XG4gICAgICAgIHNjaGVkdWxlX3VwZGF0ZSgpO1xuICAgICAgICBjb21wb25lbnQuJCQuZGlydHkuZmlsbCgwKTtcbiAgICB9XG4gICAgY29tcG9uZW50LiQkLmRpcnR5WyhpIC8gMzEpIHwgMF0gfD0gKDEgPDwgKGkgJSAzMSkpO1xufVxuZnVuY3Rpb24gaW5pdChjb21wb25lbnQsIG9wdGlvbnMsIGluc3RhbmNlLCBjcmVhdGVfZnJhZ21lbnQsIG5vdF9lcXVhbCwgcHJvcHMsIGFwcGVuZF9zdHlsZXMsIGRpcnR5ID0gWy0xXSkge1xuICAgIGNvbnN0IHBhcmVudF9jb21wb25lbnQgPSBjdXJyZW50X2NvbXBvbmVudDtcbiAgICBzZXRfY3VycmVudF9jb21wb25lbnQoY29tcG9uZW50KTtcbiAgICBjb25zdCAkJCA9IGNvbXBvbmVudC4kJCA9IHtcbiAgICAgICAgZnJhZ21lbnQ6IG51bGwsXG4gICAgICAgIGN0eDogbnVsbCxcbiAgICAgICAgLy8gc3RhdGVcbiAgICAgICAgcHJvcHMsXG4gICAgICAgIHVwZGF0ZTogbm9vcCxcbiAgICAgICAgbm90X2VxdWFsLFxuICAgICAgICBib3VuZDogYmxhbmtfb2JqZWN0KCksXG4gICAgICAgIC8vIGxpZmVjeWNsZVxuICAgICAgICBvbl9tb3VudDogW10sXG4gICAgICAgIG9uX2Rlc3Ryb3k6IFtdLFxuICAgICAgICBvbl9kaXNjb25uZWN0OiBbXSxcbiAgICAgICAgYmVmb3JlX3VwZGF0ZTogW10sXG4gICAgICAgIGFmdGVyX3VwZGF0ZTogW10sXG4gICAgICAgIGNvbnRleHQ6IG5ldyBNYXAob3B0aW9ucy5jb250ZXh0IHx8IChwYXJlbnRfY29tcG9uZW50ID8gcGFyZW50X2NvbXBvbmVudC4kJC5jb250ZXh0IDogW10pKSxcbiAgICAgICAgLy8gZXZlcnl0aGluZyBlbHNlXG4gICAgICAgIGNhbGxiYWNrczogYmxhbmtfb2JqZWN0KCksXG4gICAgICAgIGRpcnR5LFxuICAgICAgICBza2lwX2JvdW5kOiBmYWxzZSxcbiAgICAgICAgcm9vdDogb3B0aW9ucy50YXJnZXQgfHwgcGFyZW50X2NvbXBvbmVudC4kJC5yb290XG4gICAgfTtcbiAgICBhcHBlbmRfc3R5bGVzICYmIGFwcGVuZF9zdHlsZXMoJCQucm9vdCk7XG4gICAgbGV0IHJlYWR5ID0gZmFsc2U7XG4gICAgJCQuY3R4ID0gaW5zdGFuY2VcbiAgICAgICAgPyBpbnN0YW5jZShjb21wb25lbnQsIG9wdGlvbnMucHJvcHMgfHwge30sIChpLCByZXQsIC4uLnJlc3QpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gcmVzdC5sZW5ndGggPyByZXN0WzBdIDogcmV0O1xuICAgICAgICAgICAgaWYgKCQkLmN0eCAmJiBub3RfZXF1YWwoJCQuY3R4W2ldLCAkJC5jdHhbaV0gPSB2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICBpZiAoISQkLnNraXBfYm91bmQgJiYgJCQuYm91bmRbaV0pXG4gICAgICAgICAgICAgICAgICAgICQkLmJvdW5kW2ldKHZhbHVlKTtcbiAgICAgICAgICAgICAgICBpZiAocmVhZHkpXG4gICAgICAgICAgICAgICAgICAgIG1ha2VfZGlydHkoY29tcG9uZW50LCBpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgIH0pXG4gICAgICAgIDogW107XG4gICAgJCQudXBkYXRlKCk7XG4gICAgcmVhZHkgPSB0cnVlO1xuICAgIHJ1bl9hbGwoJCQuYmVmb3JlX3VwZGF0ZSk7XG4gICAgLy8gYGZhbHNlYCBhcyBhIHNwZWNpYWwgY2FzZSBvZiBubyBET00gY29tcG9uZW50XG4gICAgJCQuZnJhZ21lbnQgPSBjcmVhdGVfZnJhZ21lbnQgPyBjcmVhdGVfZnJhZ21lbnQoJCQuY3R4KSA6IGZhbHNlO1xuICAgIGlmIChvcHRpb25zLnRhcmdldCkge1xuICAgICAgICBpZiAob3B0aW9ucy5oeWRyYXRlKSB7XG4gICAgICAgICAgICBzdGFydF9oeWRyYXRpbmcoKTtcbiAgICAgICAgICAgIGNvbnN0IG5vZGVzID0gY2hpbGRyZW4ob3B0aW9ucy50YXJnZXQpO1xuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1ub24tbnVsbC1hc3NlcnRpb25cbiAgICAgICAgICAgICQkLmZyYWdtZW50ICYmICQkLmZyYWdtZW50Lmwobm9kZXMpO1xuICAgICAgICAgICAgbm9kZXMuZm9yRWFjaChkZXRhY2gpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1ub24tbnVsbC1hc3NlcnRpb25cbiAgICAgICAgICAgICQkLmZyYWdtZW50ICYmICQkLmZyYWdtZW50LmMoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0aW9ucy5pbnRybylcbiAgICAgICAgICAgIHRyYW5zaXRpb25faW4oY29tcG9uZW50LiQkLmZyYWdtZW50KTtcbiAgICAgICAgbW91bnRfY29tcG9uZW50KGNvbXBvbmVudCwgb3B0aW9ucy50YXJnZXQsIG9wdGlvbnMuYW5jaG9yLCBvcHRpb25zLmN1c3RvbUVsZW1lbnQpO1xuICAgICAgICBlbmRfaHlkcmF0aW5nKCk7XG4gICAgICAgIGZsdXNoKCk7XG4gICAgfVxuICAgIHNldF9jdXJyZW50X2NvbXBvbmVudChwYXJlbnRfY29tcG9uZW50KTtcbn1cbmxldCBTdmVsdGVFbGVtZW50O1xuaWYgKHR5cGVvZiBIVE1MRWxlbWVudCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIFN2ZWx0ZUVsZW1lbnQgPSBjbGFzcyBleHRlbmRzIEhUTUxFbGVtZW50IHtcbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICBzdXBlcigpO1xuICAgICAgICAgICAgdGhpcy5hdHRhY2hTaGFkb3coeyBtb2RlOiAnb3BlbicgfSk7XG4gICAgICAgIH1cbiAgICAgICAgY29ubmVjdGVkQ2FsbGJhY2soKSB7XG4gICAgICAgICAgICBjb25zdCB7IG9uX21vdW50IH0gPSB0aGlzLiQkO1xuICAgICAgICAgICAgdGhpcy4kJC5vbl9kaXNjb25uZWN0ID0gb25fbW91bnQubWFwKHJ1bikuZmlsdGVyKGlzX2Z1bmN0aW9uKTtcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmUgdG9kbzogaW1wcm92ZSB0eXBpbmdzXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiB0aGlzLiQkLnNsb3R0ZWQpIHtcbiAgICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlIHRvZG86IGltcHJvdmUgdHlwaW5nc1xuICAgICAgICAgICAgICAgIHRoaXMuYXBwZW5kQ2hpbGQodGhpcy4kJC5zbG90dGVkW2tleV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhhdHRyLCBfb2xkVmFsdWUsIG5ld1ZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzW2F0dHJdID0gbmV3VmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgZGlzY29ubmVjdGVkQ2FsbGJhY2soKSB7XG4gICAgICAgICAgICBydW5fYWxsKHRoaXMuJCQub25fZGlzY29ubmVjdCk7XG4gICAgICAgIH1cbiAgICAgICAgJGRlc3Ryb3koKSB7XG4gICAgICAgICAgICBkZXN0cm95X2NvbXBvbmVudCh0aGlzLCAxKTtcbiAgICAgICAgICAgIHRoaXMuJGRlc3Ryb3kgPSBub29wO1xuICAgICAgICB9XG4gICAgICAgICRvbih0eXBlLCBjYWxsYmFjaykge1xuICAgICAgICAgICAgLy8gVE9ETyBzaG91bGQgdGhpcyBkZWxlZ2F0ZSB0byBhZGRFdmVudExpc3RlbmVyP1xuICAgICAgICAgICAgY29uc3QgY2FsbGJhY2tzID0gKHRoaXMuJCQuY2FsbGJhY2tzW3R5cGVdIHx8ICh0aGlzLiQkLmNhbGxiYWNrc1t0eXBlXSA9IFtdKSk7XG4gICAgICAgICAgICBjYWxsYmFja3MucHVzaChjYWxsYmFjayk7XG4gICAgICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gY2FsbGJhY2tzLmluZGV4T2YoY2FsbGJhY2spO1xuICAgICAgICAgICAgICAgIGlmIChpbmRleCAhPT0gLTEpXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICAkc2V0KCQkcHJvcHMpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLiQkc2V0ICYmICFpc19lbXB0eSgkJHByb3BzKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuJCQuc2tpcF9ib3VuZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy4kJHNldCgkJHByb3BzKTtcbiAgICAgICAgICAgICAgICB0aGlzLiQkLnNraXBfYm91bmQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG59XG4vKipcbiAqIEJhc2UgY2xhc3MgZm9yIFN2ZWx0ZSBjb21wb25lbnRzLiBVc2VkIHdoZW4gZGV2PWZhbHNlLlxuICovXG5jbGFzcyBTdmVsdGVDb21wb25lbnQge1xuICAgICRkZXN0cm95KCkge1xuICAgICAgICBkZXN0cm95X2NvbXBvbmVudCh0aGlzLCAxKTtcbiAgICAgICAgdGhpcy4kZGVzdHJveSA9IG5vb3A7XG4gICAgfVxuICAgICRvbih0eXBlLCBjYWxsYmFjaykge1xuICAgICAgICBjb25zdCBjYWxsYmFja3MgPSAodGhpcy4kJC5jYWxsYmFja3NbdHlwZV0gfHwgKHRoaXMuJCQuY2FsbGJhY2tzW3R5cGVdID0gW10pKTtcbiAgICAgICAgY2FsbGJhY2tzLnB1c2goY2FsbGJhY2spO1xuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaW5kZXggPSBjYWxsYmFja3MuaW5kZXhPZihjYWxsYmFjayk7XG4gICAgICAgICAgICBpZiAoaW5kZXggIT09IC0xKVxuICAgICAgICAgICAgICAgIGNhbGxiYWNrcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICB9O1xuICAgIH1cbiAgICAkc2V0KCQkcHJvcHMpIHtcbiAgICAgICAgaWYgKHRoaXMuJCRzZXQgJiYgIWlzX2VtcHR5KCQkcHJvcHMpKSB7XG4gICAgICAgICAgICB0aGlzLiQkLnNraXBfYm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy4kJHNldCgkJHByb3BzKTtcbiAgICAgICAgICAgIHRoaXMuJCQuc2tpcF9ib3VuZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkaXNwYXRjaF9kZXYodHlwZSwgZGV0YWlsKSB7XG4gICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChjdXN0b21fZXZlbnQodHlwZSwgT2JqZWN0LmFzc2lnbih7IHZlcnNpb246ICczLjQ4LjAnIH0sIGRldGFpbCksIHsgYnViYmxlczogdHJ1ZSB9KSk7XG59XG5mdW5jdGlvbiBhcHBlbmRfZGV2KHRhcmdldCwgbm9kZSkge1xuICAgIGRpc3BhdGNoX2RldignU3ZlbHRlRE9NSW5zZXJ0JywgeyB0YXJnZXQsIG5vZGUgfSk7XG4gICAgYXBwZW5kKHRhcmdldCwgbm9kZSk7XG59XG5mdW5jdGlvbiBhcHBlbmRfaHlkcmF0aW9uX2Rldih0YXJnZXQsIG5vZGUpIHtcbiAgICBkaXNwYXRjaF9kZXYoJ1N2ZWx0ZURPTUluc2VydCcsIHsgdGFyZ2V0LCBub2RlIH0pO1xuICAgIGFwcGVuZF9oeWRyYXRpb24odGFyZ2V0LCBub2RlKTtcbn1cbmZ1bmN0aW9uIGluc2VydF9kZXYodGFyZ2V0LCBub2RlLCBhbmNob3IpIHtcbiAgICBkaXNwYXRjaF9kZXYoJ1N2ZWx0ZURPTUluc2VydCcsIHsgdGFyZ2V0LCBub2RlLCBhbmNob3IgfSk7XG4gICAgaW5zZXJ0KHRhcmdldCwgbm9kZSwgYW5jaG9yKTtcbn1cbmZ1bmN0aW9uIGluc2VydF9oeWRyYXRpb25fZGV2KHRhcmdldCwgbm9kZSwgYW5jaG9yKSB7XG4gICAgZGlzcGF0Y2hfZGV2KCdTdmVsdGVET01JbnNlcnQnLCB7IHRhcmdldCwgbm9kZSwgYW5jaG9yIH0pO1xuICAgIGluc2VydF9oeWRyYXRpb24odGFyZ2V0LCBub2RlLCBhbmNob3IpO1xufVxuZnVuY3Rpb24gZGV0YWNoX2Rldihub2RlKSB7XG4gICAgZGlzcGF0Y2hfZGV2KCdTdmVsdGVET01SZW1vdmUnLCB7IG5vZGUgfSk7XG4gICAgZGV0YWNoKG5vZGUpO1xufVxuZnVuY3Rpb24gZGV0YWNoX2JldHdlZW5fZGV2KGJlZm9yZSwgYWZ0ZXIpIHtcbiAgICB3aGlsZSAoYmVmb3JlLm5leHRTaWJsaW5nICYmIGJlZm9yZS5uZXh0U2libGluZyAhPT0gYWZ0ZXIpIHtcbiAgICAgICAgZGV0YWNoX2RldihiZWZvcmUubmV4dFNpYmxpbmcpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGRldGFjaF9iZWZvcmVfZGV2KGFmdGVyKSB7XG4gICAgd2hpbGUgKGFmdGVyLnByZXZpb3VzU2libGluZykge1xuICAgICAgICBkZXRhY2hfZGV2KGFmdGVyLnByZXZpb3VzU2libGluZyk7XG4gICAgfVxufVxuZnVuY3Rpb24gZGV0YWNoX2FmdGVyX2RldihiZWZvcmUpIHtcbiAgICB3aGlsZSAoYmVmb3JlLm5leHRTaWJsaW5nKSB7XG4gICAgICAgIGRldGFjaF9kZXYoYmVmb3JlLm5leHRTaWJsaW5nKTtcbiAgICB9XG59XG5mdW5jdGlvbiBsaXN0ZW5fZGV2KG5vZGUsIGV2ZW50LCBoYW5kbGVyLCBvcHRpb25zLCBoYXNfcHJldmVudF9kZWZhdWx0LCBoYXNfc3RvcF9wcm9wYWdhdGlvbikge1xuICAgIGNvbnN0IG1vZGlmaWVycyA9IG9wdGlvbnMgPT09IHRydWUgPyBbJ2NhcHR1cmUnXSA6IG9wdGlvbnMgPyBBcnJheS5mcm9tKE9iamVjdC5rZXlzKG9wdGlvbnMpKSA6IFtdO1xuICAgIGlmIChoYXNfcHJldmVudF9kZWZhdWx0KVxuICAgICAgICBtb2RpZmllcnMucHVzaCgncHJldmVudERlZmF1bHQnKTtcbiAgICBpZiAoaGFzX3N0b3BfcHJvcGFnYXRpb24pXG4gICAgICAgIG1vZGlmaWVycy5wdXNoKCdzdG9wUHJvcGFnYXRpb24nKTtcbiAgICBkaXNwYXRjaF9kZXYoJ1N2ZWx0ZURPTUFkZEV2ZW50TGlzdGVuZXInLCB7IG5vZGUsIGV2ZW50LCBoYW5kbGVyLCBtb2RpZmllcnMgfSk7XG4gICAgY29uc3QgZGlzcG9zZSA9IGxpc3Rlbihub2RlLCBldmVudCwgaGFuZGxlciwgb3B0aW9ucyk7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgZGlzcGF0Y2hfZGV2KCdTdmVsdGVET01SZW1vdmVFdmVudExpc3RlbmVyJywgeyBub2RlLCBldmVudCwgaGFuZGxlciwgbW9kaWZpZXJzIH0pO1xuICAgICAgICBkaXNwb3NlKCk7XG4gICAgfTtcbn1cbmZ1bmN0aW9uIGF0dHJfZGV2KG5vZGUsIGF0dHJpYnV0ZSwgdmFsdWUpIHtcbiAgICBhdHRyKG5vZGUsIGF0dHJpYnV0ZSwgdmFsdWUpO1xuICAgIGlmICh2YWx1ZSA9PSBudWxsKVxuICAgICAgICBkaXNwYXRjaF9kZXYoJ1N2ZWx0ZURPTVJlbW92ZUF0dHJpYnV0ZScsIHsgbm9kZSwgYXR0cmlidXRlIH0pO1xuICAgIGVsc2VcbiAgICAgICAgZGlzcGF0Y2hfZGV2KCdTdmVsdGVET01TZXRBdHRyaWJ1dGUnLCB7IG5vZGUsIGF0dHJpYnV0ZSwgdmFsdWUgfSk7XG59XG5mdW5jdGlvbiBwcm9wX2Rldihub2RlLCBwcm9wZXJ0eSwgdmFsdWUpIHtcbiAgICBub2RlW3Byb3BlcnR5XSA9IHZhbHVlO1xuICAgIGRpc3BhdGNoX2RldignU3ZlbHRlRE9NU2V0UHJvcGVydHknLCB7IG5vZGUsIHByb3BlcnR5LCB2YWx1ZSB9KTtcbn1cbmZ1bmN0aW9uIGRhdGFzZXRfZGV2KG5vZGUsIHByb3BlcnR5LCB2YWx1ZSkge1xuICAgIG5vZGUuZGF0YXNldFtwcm9wZXJ0eV0gPSB2YWx1ZTtcbiAgICBkaXNwYXRjaF9kZXYoJ1N2ZWx0ZURPTVNldERhdGFzZXQnLCB7IG5vZGUsIHByb3BlcnR5LCB2YWx1ZSB9KTtcbn1cbmZ1bmN0aW9uIHNldF9kYXRhX2Rldih0ZXh0LCBkYXRhKSB7XG4gICAgZGF0YSA9ICcnICsgZGF0YTtcbiAgICBpZiAodGV4dC53aG9sZVRleHQgPT09IGRhdGEpXG4gICAgICAgIHJldHVybjtcbiAgICBkaXNwYXRjaF9kZXYoJ1N2ZWx0ZURPTVNldERhdGEnLCB7IG5vZGU6IHRleHQsIGRhdGEgfSk7XG4gICAgdGV4dC5kYXRhID0gZGF0YTtcbn1cbmZ1bmN0aW9uIHZhbGlkYXRlX2VhY2hfYXJndW1lbnQoYXJnKSB7XG4gICAgaWYgKHR5cGVvZiBhcmcgIT09ICdzdHJpbmcnICYmICEoYXJnICYmIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnICYmICdsZW5ndGgnIGluIGFyZykpIHtcbiAgICAgICAgbGV0IG1zZyA9ICd7I2VhY2h9IG9ubHkgaXRlcmF0ZXMgb3ZlciBhcnJheS1saWtlIG9iamVjdHMuJztcbiAgICAgICAgaWYgKHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiYgYXJnICYmIFN5bWJvbC5pdGVyYXRvciBpbiBhcmcpIHtcbiAgICAgICAgICAgIG1zZyArPSAnIFlvdSBjYW4gdXNlIGEgc3ByZWFkIHRvIGNvbnZlcnQgdGhpcyBpdGVyYWJsZSBpbnRvIGFuIGFycmF5Lic7XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1zZyk7XG4gICAgfVxufVxuZnVuY3Rpb24gdmFsaWRhdGVfc2xvdHMobmFtZSwgc2xvdCwga2V5cykge1xuICAgIGZvciAoY29uc3Qgc2xvdF9rZXkgb2YgT2JqZWN0LmtleXMoc2xvdCkpIHtcbiAgICAgICAgaWYgKCF+a2V5cy5pbmRleE9mKHNsb3Rfa2V5KSkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKGA8JHtuYW1lfT4gcmVjZWl2ZWQgYW4gdW5leHBlY3RlZCBzbG90IFwiJHtzbG90X2tleX1cIi5gKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmZ1bmN0aW9uIHZhbGlkYXRlX2R5bmFtaWNfZWxlbWVudCh0YWcpIHtcbiAgICBjb25zdCBpc19zdHJpbmcgPSB0eXBlb2YgdGFnID09PSAnc3RyaW5nJztcbiAgICBpZiAodGFnICYmICFpc19zdHJpbmcpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCc8c3ZlbHRlOmVsZW1lbnQ+IGV4cGVjdHMgXCJ0aGlzXCIgYXR0cmlidXRlIHRvIGJlIGEgc3RyaW5nLicpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHZhbGlkYXRlX3ZvaWRfZHluYW1pY19lbGVtZW50KHRhZykge1xuICAgIGlmICh0YWcgJiYgaXNfdm9pZCh0YWcpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgPHN2ZWx0ZTplbGVtZW50IHRoaXM9XCIke3RhZ31cIj4gaXMgc2VsZi1jbG9zaW5nIGFuZCBjYW5ub3QgaGF2ZSBjb250ZW50LmApO1xuICAgIH1cbn1cbi8qKlxuICogQmFzZSBjbGFzcyBmb3IgU3ZlbHRlIGNvbXBvbmVudHMgd2l0aCBzb21lIG1pbm9yIGRldi1lbmhhbmNlbWVudHMuIFVzZWQgd2hlbiBkZXY9dHJ1ZS5cbiAqL1xuY2xhc3MgU3ZlbHRlQ29tcG9uZW50RGV2IGV4dGVuZHMgU3ZlbHRlQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgICAgIGlmICghb3B0aW9ucyB8fCAoIW9wdGlvbnMudGFyZ2V0ICYmICFvcHRpb25zLiQkaW5saW5lKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiJ3RhcmdldCcgaXMgYSByZXF1aXJlZCBvcHRpb25cIik7XG4gICAgICAgIH1cbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG4gICAgJGRlc3Ryb3koKSB7XG4gICAgICAgIHN1cGVyLiRkZXN0cm95KCk7XG4gICAgICAgIHRoaXMuJGRlc3Ryb3kgPSAoKSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ0NvbXBvbmVudCB3YXMgYWxyZWFkeSBkZXN0cm95ZWQnKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1jb25zb2xlXG4gICAgICAgIH07XG4gICAgfVxuICAgICRjYXB0dXJlX3N0YXRlKCkgeyB9XG4gICAgJGluamVjdF9zdGF0ZSgpIHsgfVxufVxuLyoqXG4gKiBCYXNlIGNsYXNzIHRvIGNyZWF0ZSBzdHJvbmdseSB0eXBlZCBTdmVsdGUgY29tcG9uZW50cy5cbiAqIFRoaXMgb25seSBleGlzdHMgZm9yIHR5cGluZyBwdXJwb3NlcyBhbmQgc2hvdWxkIGJlIHVzZWQgaW4gYC5kLnRzYCBmaWxlcy5cbiAqXG4gKiAjIyMgRXhhbXBsZTpcbiAqXG4gKiBZb3UgaGF2ZSBjb21wb25lbnQgbGlicmFyeSBvbiBucG0gY2FsbGVkIGBjb21wb25lbnQtbGlicmFyeWAsIGZyb20gd2hpY2hcbiAqIHlvdSBleHBvcnQgYSBjb21wb25lbnQgY2FsbGVkIGBNeUNvbXBvbmVudGAuIEZvciBTdmVsdGUrVHlwZVNjcmlwdCB1c2VycyxcbiAqIHlvdSB3YW50IHRvIHByb3ZpZGUgdHlwaW5ncy4gVGhlcmVmb3JlIHlvdSBjcmVhdGUgYSBgaW5kZXguZC50c2A6XG4gKiBgYGB0c1xuICogaW1wb3J0IHsgU3ZlbHRlQ29tcG9uZW50VHlwZWQgfSBmcm9tIFwic3ZlbHRlXCI7XG4gKiBleHBvcnQgY2xhc3MgTXlDb21wb25lbnQgZXh0ZW5kcyBTdmVsdGVDb21wb25lbnRUeXBlZDx7Zm9vOiBzdHJpbmd9PiB7fVxuICogYGBgXG4gKiBUeXBpbmcgdGhpcyBtYWtlcyBpdCBwb3NzaWJsZSBmb3IgSURFcyBsaWtlIFZTIENvZGUgd2l0aCB0aGUgU3ZlbHRlIGV4dGVuc2lvblxuICogdG8gcHJvdmlkZSBpbnRlbGxpc2Vuc2UgYW5kIHRvIHVzZSB0aGUgY29tcG9uZW50IGxpa2UgdGhpcyBpbiBhIFN2ZWx0ZSBmaWxlXG4gKiB3aXRoIFR5cGVTY3JpcHQ6XG4gKiBgYGBzdmVsdGVcbiAqIDxzY3JpcHQgbGFuZz1cInRzXCI+XG4gKiBcdGltcG9ydCB7IE15Q29tcG9uZW50IH0gZnJvbSBcImNvbXBvbmVudC1saWJyYXJ5XCI7XG4gKiA8L3NjcmlwdD5cbiAqIDxNeUNvbXBvbmVudCBmb289eydiYXInfSAvPlxuICogYGBgXG4gKlxuICogIyMjIyBXaHkgbm90IG1ha2UgdGhpcyBwYXJ0IG9mIGBTdmVsdGVDb21wb25lbnQoRGV2KWA/XG4gKiBCZWNhdXNlXG4gKiBgYGB0c1xuICogY2xhc3MgQVN1YmNsYXNzT2ZTdmVsdGVDb21wb25lbnQgZXh0ZW5kcyBTdmVsdGVDb21wb25lbnQ8e2Zvbzogc3RyaW5nfT4ge31cbiAqIGNvbnN0IGNvbXBvbmVudDogdHlwZW9mIFN2ZWx0ZUNvbXBvbmVudCA9IEFTdWJjbGFzc09mU3ZlbHRlQ29tcG9uZW50O1xuICogYGBgXG4gKiB3aWxsIHRocm93IGEgdHlwZSBlcnJvciwgc28gd2UgbmVlZCB0byBzZXBhcmF0ZSB0aGUgbW9yZSBzdHJpY3RseSB0eXBlZCBjbGFzcy5cbiAqL1xuY2xhc3MgU3ZlbHRlQ29tcG9uZW50VHlwZWQgZXh0ZW5kcyBTdmVsdGVDb21wb25lbnREZXYge1xuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICAgICAgc3VwZXIob3B0aW9ucyk7XG4gICAgfVxufVxuZnVuY3Rpb24gbG9vcF9ndWFyZCh0aW1lb3V0KSB7XG4gICAgY29uc3Qgc3RhcnQgPSBEYXRlLm5vdygpO1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgIGlmIChEYXRlLm5vdygpIC0gc3RhcnQgPiB0aW1lb3V0KSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0luZmluaXRlIGxvb3AgZGV0ZWN0ZWQnKTtcbiAgICAgICAgfVxuICAgIH07XG59XG5cbmV4cG9ydCB7IEh0bWxUYWcsIEh0bWxUYWdIeWRyYXRpb24sIFN2ZWx0ZUNvbXBvbmVudCwgU3ZlbHRlQ29tcG9uZW50RGV2LCBTdmVsdGVDb21wb25lbnRUeXBlZCwgU3ZlbHRlRWxlbWVudCwgYWN0aW9uX2Rlc3Ryb3llciwgYWRkX2F0dHJpYnV0ZSwgYWRkX2NsYXNzZXMsIGFkZF9mbHVzaF9jYWxsYmFjaywgYWRkX2xvY2F0aW9uLCBhZGRfcmVuZGVyX2NhbGxiYWNrLCBhZGRfcmVzaXplX2xpc3RlbmVyLCBhZGRfc3R5bGVzLCBhZGRfdHJhbnNmb3JtLCBhZnRlclVwZGF0ZSwgYXBwZW5kLCBhcHBlbmRfZGV2LCBhcHBlbmRfZW1wdHlfc3R5bGVzaGVldCwgYXBwZW5kX2h5ZHJhdGlvbiwgYXBwZW5kX2h5ZHJhdGlvbl9kZXYsIGFwcGVuZF9zdHlsZXMsIGFzc2lnbiwgYXR0ciwgYXR0cl9kZXYsIGF0dHJpYnV0ZV90b19vYmplY3QsIGJlZm9yZVVwZGF0ZSwgYmluZCwgYmluZGluZ19jYWxsYmFja3MsIGJsYW5rX29iamVjdCwgYnViYmxlLCBjaGVja19vdXRyb3MsIGNoaWxkcmVuLCBjbGFpbV9jb21wb25lbnQsIGNsYWltX2VsZW1lbnQsIGNsYWltX2h0bWxfdGFnLCBjbGFpbV9zcGFjZSwgY2xhaW1fc3ZnX2VsZW1lbnQsIGNsYWltX3RleHQsIGNsZWFyX2xvb3BzLCBjb21wb25lbnRfc3Vic2NyaWJlLCBjb21wdXRlX3Jlc3RfcHJvcHMsIGNvbXB1dGVfc2xvdHMsIGNyZWF0ZUV2ZW50RGlzcGF0Y2hlciwgY3JlYXRlX2FuaW1hdGlvbiwgY3JlYXRlX2JpZGlyZWN0aW9uYWxfdHJhbnNpdGlvbiwgY3JlYXRlX2NvbXBvbmVudCwgY3JlYXRlX2luX3RyYW5zaXRpb24sIGNyZWF0ZV9vdXRfdHJhbnNpdGlvbiwgY3JlYXRlX3Nsb3QsIGNyZWF0ZV9zc3JfY29tcG9uZW50LCBjdXJyZW50X2NvbXBvbmVudCwgY3VzdG9tX2V2ZW50LCBkYXRhc2V0X2RldiwgZGVidWcsIGRlc3Ryb3lfYmxvY2ssIGRlc3Ryb3lfY29tcG9uZW50LCBkZXN0cm95X2VhY2gsIGRldGFjaCwgZGV0YWNoX2FmdGVyX2RldiwgZGV0YWNoX2JlZm9yZV9kZXYsIGRldGFjaF9iZXR3ZWVuX2RldiwgZGV0YWNoX2RldiwgZGlydHlfY29tcG9uZW50cywgZGlzcGF0Y2hfZGV2LCBlYWNoLCBlbGVtZW50LCBlbGVtZW50X2lzLCBlbXB0eSwgZW5kX2h5ZHJhdGluZywgZXNjYXBlLCBlc2NhcGVfYXR0cmlidXRlX3ZhbHVlLCBlc2NhcGVfb2JqZWN0LCBlc2NhcGVkLCBleGNsdWRlX2ludGVybmFsX3Byb3BzLCBmaXhfYW5kX2Rlc3Ryb3lfYmxvY2ssIGZpeF9hbmRfb3V0cm9fYW5kX2Rlc3Ryb3lfYmxvY2ssIGZpeF9wb3NpdGlvbiwgZmx1c2gsIGdldEFsbENvbnRleHRzLCBnZXRDb250ZXh0LCBnZXRfYWxsX2RpcnR5X2Zyb21fc2NvcGUsIGdldF9iaW5kaW5nX2dyb3VwX3ZhbHVlLCBnZXRfY3VycmVudF9jb21wb25lbnQsIGdldF9jdXN0b21fZWxlbWVudHNfc2xvdHMsIGdldF9yb290X2Zvcl9zdHlsZSwgZ2V0X3Nsb3RfY2hhbmdlcywgZ2V0X3NwcmVhZF9vYmplY3QsIGdldF9zcHJlYWRfdXBkYXRlLCBnZXRfc3RvcmVfdmFsdWUsIGdsb2JhbHMsIGdyb3VwX291dHJvcywgaGFuZGxlX3Byb21pc2UsIGhhc0NvbnRleHQsIGhhc19wcm9wLCBpZGVudGl0eSwgaW5pdCwgaW5zZXJ0LCBpbnNlcnRfZGV2LCBpbnNlcnRfaHlkcmF0aW9uLCBpbnNlcnRfaHlkcmF0aW9uX2RldiwgaW50cm9zLCBpbnZhbGlkX2F0dHJpYnV0ZV9uYW1lX2NoYXJhY3RlciwgaXNfY2xpZW50LCBpc19jcm9zc29yaWdpbiwgaXNfZW1wdHksIGlzX2Z1bmN0aW9uLCBpc19wcm9taXNlLCBpc192b2lkLCBsaXN0ZW4sIGxpc3Rlbl9kZXYsIGxvb3AsIGxvb3BfZ3VhcmQsIG1lcmdlX3Nzcl9zdHlsZXMsIG1pc3NpbmdfY29tcG9uZW50LCBtb3VudF9jb21wb25lbnQsIG5vb3AsIG5vdF9lcXVhbCwgbm93LCBudWxsX3RvX2VtcHR5LCBvYmplY3Rfd2l0aG91dF9wcm9wZXJ0aWVzLCBvbkRlc3Ryb3ksIG9uTW91bnQsIG9uY2UsIG91dHJvX2FuZF9kZXN0cm95X2Jsb2NrLCBwcmV2ZW50X2RlZmF1bHQsIHByb3BfZGV2LCBxdWVyeV9zZWxlY3Rvcl9hbGwsIHJhZiwgcnVuLCBydW5fYWxsLCBzYWZlX25vdF9lcXVhbCwgc2NoZWR1bGVfdXBkYXRlLCBzZWxlY3RfbXVsdGlwbGVfdmFsdWUsIHNlbGVjdF9vcHRpb24sIHNlbGVjdF9vcHRpb25zLCBzZWxlY3RfdmFsdWUsIHNlbGYsIHNldENvbnRleHQsIHNldF9hdHRyaWJ1dGVzLCBzZXRfY3VycmVudF9jb21wb25lbnQsIHNldF9jdXN0b21fZWxlbWVudF9kYXRhLCBzZXRfZGF0YSwgc2V0X2RhdGFfZGV2LCBzZXRfaW5wdXRfdHlwZSwgc2V0X2lucHV0X3ZhbHVlLCBzZXRfbm93LCBzZXRfcmFmLCBzZXRfc3RvcmVfdmFsdWUsIHNldF9zdHlsZSwgc2V0X3N2Z19hdHRyaWJ1dGVzLCBzcGFjZSwgc3ByZWFkLCBzcmNfdXJsX2VxdWFsLCBzdGFydF9oeWRyYXRpbmcsIHN0b3BfcHJvcGFnYXRpb24sIHN1YnNjcmliZSwgc3ZnX2VsZW1lbnQsIHRleHQsIHRpY2ssIHRpbWVfcmFuZ2VzX3RvX2FycmF5LCB0b19udW1iZXIsIHRvZ2dsZV9jbGFzcywgdHJhbnNpdGlvbl9pbiwgdHJhbnNpdGlvbl9vdXQsIHRydXN0ZWQsIHVwZGF0ZV9hd2FpdF9ibG9ja19icmFuY2gsIHVwZGF0ZV9rZXllZF9lYWNoLCB1cGRhdGVfc2xvdCwgdXBkYXRlX3Nsb3RfYmFzZSwgdmFsaWRhdGVfY29tcG9uZW50LCB2YWxpZGF0ZV9keW5hbWljX2VsZW1lbnQsIHZhbGlkYXRlX2VhY2hfYXJndW1lbnQsIHZhbGlkYXRlX2VhY2hfa2V5cywgdmFsaWRhdGVfc2xvdHMsIHZhbGlkYXRlX3N0b3JlLCB2YWxpZGF0ZV92b2lkX2R5bmFtaWNfZWxlbWVudCwgeGxpbmtfYXR0ciB9O1xuIiwiPHNjcmlwdCBsYW5nPVwidHNcIj5cbiAgaW1wb3J0IHsgY3JlYXRlRXZlbnREaXNwYXRjaGVyIH0gZnJvbSBcInN2ZWx0ZVwiO1xuXG4gIGV4cG9ydCBsZXQgcG9wdXA6IHN0cmluZztcbiAgZXhwb3J0IGxldCBkaXNhYmxlZCA9IGZhbHNlO1xuXG4gIGNvbnN0IGRpc3BhdGNoZXIgPSBjcmVhdGVFdmVudERpc3BhdGNoZXIoKTtcbiAgY29uc3QgaGFuZGxlQ2xpY2sgPSAoKSA9PiB7XG4gICAgZGlzcGF0Y2hlcihcImNsaWNrXCIpO1xuICB9O1xuPC9zY3JpcHQ+XG5cbjxidXR0b25cbiAgYXJpYS1sYWJlbD17cG9wdXB9XG4gIGNsYXNzOm1vZC1jdGE9eyFkaXNhYmxlZH1cbiAge2Rpc2FibGVkfVxuICBvbjpjbGljaz17aGFuZGxlQ2xpY2t9XG4+XG4gIDxzbG90IC8+XG48L2J1dHRvbj5cbiIsIjxzY3JpcHQ+XG4gIGV4cG9ydCBsZXQgc2l6ZSA9IDI0XG48L3NjcmlwdD5cbjxzdmdcbiAgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiXG4gIHdpZHRoPXtzaXplfVxuICBoZWlnaHQ9e3NpemV9XG4gIHZpZXdCb3g9XCIwIDAgMjQgMjRcIlxuICBmaWxsPVwibm9uZVwiXG4gIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiXG4gIHN0cm9rZS13aWR0aD1cIjJcIlxuICBzdHJva2UtbGluZWNhcD1cInJvdW5kXCJcbiAgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIlxuICB7Li4uJCRyZXN0UHJvcHN9XG4+XG4gIDxzbG90IC8+XG4gIDxwYXRoIGQ9XCJNMTQuNSAySDZhMiAyIDAgMDAtMiAydjE2YTIgMiAwIDAwMiAyaDEyYTIgMiAwIDAwMi0yVjcuNUwxNC41IDJ6XCIgLz5cbiAgPHBvbHlsaW5lIHBvaW50cz1cIjE0IDIgMTQgOCAyMCA4XCIgLz5cbjwvc3ZnPiIsIjxzY3JpcHQgbGFuZz1cInRzXCI+XG4gIGltcG9ydCB7IGNyZWF0ZUV2ZW50RGlzcGF0Y2hlciB9IGZyb20gXCJzdmVsdGVcIjtcblxuICBleHBvcnQgbGV0IHBvcHVwOiBzdHJpbmc7XG4gIGV4cG9ydCBsZXQgZGlzYWJsZWQgPSBmYWxzZTtcblxuICBjb25zdCBkaXNwYXRjaGVyID0gY3JlYXRlRXZlbnREaXNwYXRjaGVyKCk7XG4gIGNvbnN0IGhhbmRsZUNsaWNrID0gKCkgPT4ge1xuICAgIGlmICghZGlzYWJsZWQpIHtcbiAgICAgIGRpc3BhdGNoZXIoXCJjbGlja1wiKTtcbiAgICB9XG4gIH07XG48L3NjcmlwdD5cblxuPGRpdiBjbGFzcz1cIndyYXBwZXJcIj5cbiAgPGJ1dHRvblxuICAgIGFyaWEtbGFiZWw9e3BvcHVwfVxuICAgIHtkaXNhYmxlZH1cbiAgICBvbjpjbGljaz17aGFuZGxlQ2xpY2t9XG4gICAgY2xhc3M9e2Rpc2FibGVkID8gXCJidXR0b24tZGlzYWJsZWRcIiA6IFwiYnV0dG9uLWVuYWJsZWRcIn1cbiAgICBzdHlsZT1cImJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50OyBwYWRkaW5nOiAwXCJcbiAgPlxuICAgIDxzbG90IC8+XG4gIDwvYnV0dG9uPlxuPC9kaXY+XG5cbjxzdHlsZT5cbiAgLndyYXBwZXIge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgbWFyZ2luOiAwO1xuICB9XG4gIC5idXR0b24tZW5hYmxlZDpob3ZlciB7XG4gICAgLypub2luc3BlY3Rpb24gQ3NzVW5yZXNvbHZlZEN1c3RvbVByb3BlcnR5Ki9cbiAgICBjb2xvcjogdmFyKC0taW50ZXJhY3RpdmUtYWNjZW50KTtcbiAgfVxuICAuYnV0dG9uLWRpc2FibGVkIHtcbiAgICAvKm5vaW5zcGVjdGlvbiBDc3NVbnJlc29sdmVkQ3VzdG9tUHJvcGVydHkqL1xuICAgIGNvbG9yOiB2YXIoLS10ZXh0LW11dGVkKTtcbiAgfVxuPC9zdHlsZT5cbiIsIjwhLS1zdXBwcmVzcyBMYWJlbGVkU3RhdGVtZW50SlMgLS0+XG48c2NyaXB0IGxhbmc9XCJ0c1wiPlxuICBpbXBvcnQgT2JzaWRpYW5CdXR0b24gZnJvbSBcIi4vT2JzaWRpYW5CdXR0b24uc3ZlbHRlXCI7XG4gIGltcG9ydCB7IEZpbGUgfSBmcm9tIFwic3ZlbHRlLWx1Y2lkZS1pY29uc1wiO1xuICBpbXBvcnQgT2JzaWRpYW5JY29uQnV0dG9uIGZyb20gXCIuL09ic2lkaWFuSWNvbkJ1dHRvbi5zdmVsdGVcIjtcbiAgaW1wb3J0IHR5cGUgeyBDdXN0b21EaWN0aW9uYXJ5V29yZCB9IGZyb20gXCIuLi8uLi9tb2RlbC9Xb3JkXCI7XG4gIGltcG9ydCB7IG9uTW91bnQgfSBmcm9tIFwic3ZlbHRlXCI7XG5cbiAgdHlwZSBEaWN0aW9uYXJ5ID0ge1xuICAgIGlkOiBzdHJpbmc7XG4gICAgcGF0aDogc3RyaW5nO1xuICB9O1xuXG4gIGV4cG9ydCBsZXQgZGljdGlvbmFyaWVzOiBEaWN0aW9uYXJ5W107XG4gIGV4cG9ydCBsZXQgc2VsZWN0ZWREaWN0aW9uYXJ5OiBEaWN0aW9uYXJ5O1xuICBleHBvcnQgbGV0IHdvcmQ6IHN0cmluZyA9IFwiXCI7XG4gIGV4cG9ydCBsZXQgdXNlRGlzcGxheWVkV29yZCA9IGZhbHNlO1xuICBleHBvcnQgbGV0IGRpc3BsYXllZFdvcmQ6IHN0cmluZyA9IFwiXCI7XG4gIGV4cG9ydCBsZXQgZGVzY3JpcHRpb246IHN0cmluZyA9IFwiXCI7XG4gIGV4cG9ydCBsZXQgYWxpYXNlczogc3RyaW5nW10gPSBbXTtcbiAgZXhwb3J0IGxldCBkaXZpZGVyRm9yRGlzcGxheSA9IFwiXCI7XG5cbiAgZXhwb3J0IGxldCBvblN1Ym1pdDogKFxuICAgIGRpY3Rpb25hcnlQYXRoOiBzdHJpbmcsXG4gICAgd29yZDogQ3VzdG9tRGljdGlvbmFyeVdvcmRcbiAgKSA9PiB2b2lkO1xuICBleHBvcnQgbGV0IG9uQ2xpY2tGaWxlSWNvbjogKGRpY3Rpb25hcnlQYXRoOiBzdHJpbmcpID0+IHZvaWQ7XG5cbiAgbGV0IGFsaWFzZXNTdHIgPSBhbGlhc2VzLmpvaW4oXCJcXG5cIik7XG4gIGxldCB3b3JkUmVmID0gbnVsbDtcbiAgbGV0IGRpc3BsYXllZFdvcmRSZWYgPSBudWxsO1xuXG4gICQ6IGVuYWJsZVN1Ym1pdCA9IHdvcmQubGVuZ3RoID4gMDtcbiAgJDogZW5hYmxlRGlzcGxheWVkV29yZCA9IEJvb2xlYW4oZGl2aWRlckZvckRpc3BsYXkpO1xuICAkOiBmaXJzdFdvcmRUaXRsZSA9IHVzZURpc3BsYXllZFdvcmQgPyBcIkluc2VydGVkIHdvcmRcIiA6IFwiV29yZFwiO1xuICAkOiB7XG4gICAgaWYgKHVzZURpc3BsYXllZFdvcmQpIHtcbiAgICAgIGRpc3BsYXllZFdvcmRSZWY/LmZvY3VzKCk7XG4gICAgfVxuICB9XG5cbiAgY29uc3QgaGFuZGxlU3VibWl0ID0gKCkgPT4ge1xuICAgIG9uU3VibWl0KHNlbGVjdGVkRGljdGlvbmFyeS5wYXRoLCB7XG4gICAgICB2YWx1ZTogZGlzcGxheWVkV29yZCB8fCB3b3JkLFxuICAgICAgZGVzY3JpcHRpb24sXG4gICAgICBhbGlhc2VzOiBhbGlhc2VzU3RyLnNwbGl0KFwiXFxuXCIpLFxuICAgICAgdHlwZTogXCJjdXN0b21EaWN0aW9uYXJ5XCIsXG4gICAgICBjcmVhdGVkUGF0aDogc2VsZWN0ZWREaWN0aW9uYXJ5LnBhdGgsXG4gICAgICBpbnNlcnRlZFRleHQ6IGRpc3BsYXllZFdvcmQgPyB3b3JkIDogdW5kZWZpbmVkLFxuICAgIH0pO1xuICB9O1xuXG4gIG9uTW91bnQoKCkgPT4ge1xuICAgIHNldFRpbWVvdXQoKCkgPT4gd29yZFJlZi5mb2N1cygpLCA1MCk7XG4gIH0pO1xuPC9zY3JpcHQ+XG5cbjxkaXY+XG4gIDxoMj5BZGQgYSB3b3JkIHRvIGEgY3VzdG9tIGRpY3Rpb25hcnk8L2gyPlxuXG4gIDxoMz5EaWN0aW9uYXJ5PC9oMz5cbiAgPGRpdiBzdHlsZT1cImRpc3BsYXk6IGZsZXg7IGdhcDogMTBweFwiPlxuICAgIDxzZWxlY3QgYmluZDp2YWx1ZT17c2VsZWN0ZWREaWN0aW9uYXJ5fSBjbGFzcz1cImRyb3Bkb3duXCI+XG4gICAgICB7I2VhY2ggZGljdGlvbmFyaWVzIGFzIGRpY3Rpb25hcnl9XG4gICAgICAgIDxvcHRpb24gdmFsdWU9e2RpY3Rpb25hcnl9PlxuICAgICAgICAgIHtkaWN0aW9uYXJ5LnBhdGh9XG4gICAgICAgIDwvb3B0aW9uPlxuICAgICAgey9lYWNofVxuICAgIDwvc2VsZWN0PlxuICAgIDxPYnNpZGlhbkljb25CdXR0b25cbiAgICAgIHBvcHVwPVwiT3BlbiB0aGUgZmlsZVwiXG4gICAgICBvbjpjbGljaz17KCkgPT4gb25DbGlja0ZpbGVJY29uKHNlbGVjdGVkRGljdGlvbmFyeS5wYXRoKX1cbiAgICA+XG4gICAgICA8RmlsZSAvPlxuICAgIDwvT2JzaWRpYW5JY29uQnV0dG9uPlxuICA8L2Rpdj5cblxuICA8aDM+e2ZpcnN0V29yZFRpdGxlfTwvaDM+XG4gIDx0ZXh0YXJlYVxuICAgIGJpbmQ6dmFsdWU9e3dvcmR9XG4gICAgc3R5bGU9XCJ3aWR0aDogMTAwJTtcIlxuICAgIHJvd3M9XCIzXCJcbiAgICBiaW5kOnRoaXM9e3dvcmRSZWZ9XG4gIC8+XG5cbiAgeyNpZiBlbmFibGVEaXNwbGF5ZWRXb3JkfVxuICAgIDxsYWJlbD5cbiAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBiaW5kOmNoZWNrZWQ9e3VzZURpc3BsYXllZFdvcmR9IC8+XG4gICAgICBEaXN0aW5ndWlzaCBiZXR3ZWVuIGRpc3BsYXkgYW5kIGluc2VydGlvblxuICAgIDwvbGFiZWw+XG4gIHsvaWZ9XG5cbiAgeyNpZiB1c2VEaXNwbGF5ZWRXb3JkfVxuICAgIDxoMz5EaXNwbGF5ZWQgV29yZDwvaDM+XG4gICAgPHRleHRhcmVhXG4gICAgICBiaW5kOnZhbHVlPXtkaXNwbGF5ZWRXb3JkfVxuICAgICAgc3R5bGU9XCJ3aWR0aDogMTAwJTtcIlxuICAgICAgcm93cz1cIjNcIlxuICAgICAgYmluZDp0aGlzPXtkaXNwbGF5ZWRXb3JkUmVmfVxuICAgIC8+XG4gIHsvaWZ9XG5cbiAgPGgzPkRlc2NyaXB0aW9uPC9oMz5cbiAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgYmluZDp2YWx1ZT17ZGVzY3JpcHRpb259IHN0eWxlPVwid2lkdGg6IDEwMCU7XCIgLz5cblxuICA8aDM+QWxpYXNlcyAoZm9yIGVhY2ggbGluZSk8L2gzPlxuICA8dGV4dGFyZWEgYmluZDp2YWx1ZT17YWxpYXNlc1N0cn0gc3R5bGU9XCJ3aWR0aDogMTAwJTtcIiByb3dzPVwiM1wiIC8+XG5cbiAgPGRpdiBzdHlsZT1cInRleHQtYWxpZ246IGNlbnRlcjsgd2lkdGg6IDEwMCU7IHBhZGRpbmctdG9wOiAxNXB4O1wiPlxuICAgIDxPYnNpZGlhbkJ1dHRvbiBkaXNhYmxlZD17IWVuYWJsZVN1Ym1pdH0gb246Y2xpY2s9e2hhbmRsZVN1Ym1pdH1cbiAgICAgID5TdWJtaXQ8L09ic2lkaWFuQnV0dG9uXG4gICAgPlxuICA8L2Rpdj5cbjwvZGl2PlxuXG48c3R5bGU+XG48L3N0eWxlPlxuIiwiaW1wb3J0IHsgQXBwLCBNb2RhbCwgTm90aWNlIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgeyBBcHBIZWxwZXIgfSBmcm9tIFwiLi4vYXBwLWhlbHBlclwiO1xuaW1wb3J0IHR5cGUgeyBDdXN0b21EaWN0aW9uYXJ5V29yZCB9IGZyb20gXCIuLi9tb2RlbC9Xb3JkXCI7XG5pbXBvcnQgQ3VzdG9tRGljdGlvbmFyeVdvcmRBZGQgZnJvbSBcIi4vY29tcG9uZW50L0N1c3RvbURpY3Rpb25hcnlXb3JkQWRkLnN2ZWx0ZVwiO1xuXG5leHBvcnQgY2xhc3MgQ3VzdG9tRGljdGlvbmFyeVdvcmRBZGRNb2RhbCBleHRlbmRzIE1vZGFsIHtcbiAgY29tcG9uZW50OiBDdXN0b21EaWN0aW9uYXJ5V29yZEFkZDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBhcHA6IEFwcCxcbiAgICBkaWN0aW9uYXJ5UGF0aHM6IHN0cmluZ1tdLFxuICAgIGluaXRpYWxWYWx1ZTogc3RyaW5nID0gXCJcIixcbiAgICBkaXZpZGVyRm9yRGlzcGxheTogc3RyaW5nID0gXCJcIixcbiAgICBvblN1Ym1pdDogKGRpY3Rpb25hcnlQYXRoOiBzdHJpbmcsIHdvcmQ6IEN1c3RvbURpY3Rpb25hcnlXb3JkKSA9PiB2b2lkXG4gICkge1xuICAgIHN1cGVyKGFwcCk7XG4gICAgY29uc3QgYXBwSGVscGVyID0gbmV3IEFwcEhlbHBlcihhcHApO1xuXG4gICAgY29uc3QgZGljdGlvbmFyaWVzID0gZGljdGlvbmFyeVBhdGhzLm1hcCgoeCkgPT4gKHsgaWQ6IHgsIHBhdGg6IHggfSkpO1xuXG4gICAgY29uc3QgeyBjb250ZW50RWwgfSA9IHRoaXM7XG4gICAgdGhpcy5jb21wb25lbnQgPSBuZXcgQ3VzdG9tRGljdGlvbmFyeVdvcmRBZGQoe1xuICAgICAgdGFyZ2V0OiBjb250ZW50RWwsXG4gICAgICBwcm9wczoge1xuICAgICAgICBkaWN0aW9uYXJpZXMsXG4gICAgICAgIHNlbGVjdGVkRGljdGlvbmFyeTogZGljdGlvbmFyaWVzWzBdLFxuICAgICAgICB3b3JkOiBpbml0aWFsVmFsdWUsXG4gICAgICAgIGRpdmlkZXJGb3JEaXNwbGF5LFxuICAgICAgICBvblN1Ym1pdDogb25TdWJtaXQsXG4gICAgICAgIG9uQ2xpY2tGaWxlSWNvbjogKGRpY3Rpb25hcnlQYXRoOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICBjb25zdCBtYXJrZG93bkZpbGUgPSBhcHBIZWxwZXIuZ2V0TWFya2Rvd25GaWxlQnlQYXRoKGRpY3Rpb25hcnlQYXRoKTtcbiAgICAgICAgICBpZiAoIW1hcmtkb3duRmlsZSkge1xuICAgICAgICAgICAgLy8gbm9pbnNwZWN0aW9uIE9iamVjdEFsbG9jYXRpb25JZ25vcmVkXG4gICAgICAgICAgICBuZXcgTm90aWNlKGBDYW4ndCBvcGVuICR7ZGljdGlvbmFyeVBhdGh9YCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgICAgIGFwcEhlbHBlci5vcGVuTWFya2Rvd25GaWxlKG1hcmtkb3duRmlsZSwgdHJ1ZSk7XG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgb25DbG9zZSgpIHtcbiAgICBzdXBlci5vbkNsb3NlKCk7XG4gICAgdGhpcy5jb21wb25lbnQuJGRlc3Ryb3koKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgZGVib3VuY2UsIE5vdGljZSwgUGx1Z2luIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgeyBBdXRvQ29tcGxldGVTdWdnZXN0IH0gZnJvbSBcIi4vdWkvQXV0b0NvbXBsZXRlU3VnZ2VzdFwiO1xuaW1wb3J0IHtcbiAgREVGQVVMVF9TRVRUSU5HUyxcbiAgdHlwZSBTZXR0aW5ncyxcbiAgVmFyaW91c0NvbXBsZW1lbnRzU2V0dGluZ1RhYixcbn0gZnJvbSBcIi4vc2V0dGluZy9zZXR0aW5nc1wiO1xuaW1wb3J0IHsgQXBwSGVscGVyIH0gZnJvbSBcIi4vYXBwLWhlbHBlclwiO1xuaW1wb3J0IHsgUHJvdmlkZXJTdGF0dXNCYXIgfSBmcm9tIFwiLi91aS9Qcm92aWRlclN0YXR1c0JhclwiO1xuaW1wb3J0IHsgQ3VzdG9tRGljdGlvbmFyeVdvcmRBZGRNb2RhbCB9IGZyb20gXCIuL3VpL0N1c3RvbURpY3Rpb25hcnlXb3JkQWRkTW9kYWxcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVmFyaW91c0NvbXBvbmVudHMgZXh0ZW5kcyBQbHVnaW4ge1xuICBhcHBIZWxwZXI6IEFwcEhlbHBlcjtcbiAgc2V0dGluZ3M6IFNldHRpbmdzO1xuICBzZXR0aW5nVGFiOiBWYXJpb3VzQ29tcGxlbWVudHNTZXR0aW5nVGFiO1xuICBzdWdnZXN0ZXI6IEF1dG9Db21wbGV0ZVN1Z2dlc3Q7XG4gIHN0YXR1c0Jhcj86IFByb3ZpZGVyU3RhdHVzQmFyO1xuXG4gIG9udW5sb2FkKCkge1xuICAgIHN1cGVyLm9udW5sb2FkKCk7XG4gICAgdGhpcy5zdWdnZXN0ZXIudW5yZWdpc3RlcigpO1xuICB9XG5cbiAgYXN5bmMgb25sb2FkKCkge1xuICAgIHRoaXMuYXBwSGVscGVyID0gbmV3IEFwcEhlbHBlcih0aGlzLmFwcCk7XG5cbiAgICB0aGlzLnJlZ2lzdGVyRXZlbnQoXG4gICAgICB0aGlzLmFwcC53b3Jrc3BhY2Uub24oXCJlZGl0b3ItbWVudVwiLCAobWVudSkgPT4ge1xuICAgICAgICBpZiAoIXRoaXMuYXBwSGVscGVyLmdldFNlbGVjdGlvbigpKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbWVudS5hZGRJdGVtKChpdGVtKSA9PlxuICAgICAgICAgIGl0ZW1cbiAgICAgICAgICAgIC5zZXRUaXRsZShcIkFkZCB0byBjdXN0b20gZGljdGlvbmFyeVwiKVxuICAgICAgICAgICAgLnNldEljb24oXCJzdGFja2VkLWxldmVsc1wiKVxuICAgICAgICAgICAgLm9uQ2xpY2soKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLmFkZFdvcmRUb0N1c3RvbURpY3Rpb25hcnkoKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICk7XG4gICAgICB9KVxuICAgICk7XG5cbiAgICBhd2FpdCB0aGlzLmxvYWRTZXR0aW5ncygpO1xuXG4gICAgdGhpcy5zZXR0aW5nVGFiID0gbmV3IFZhcmlvdXNDb21wbGVtZW50c1NldHRpbmdUYWIodGhpcy5hcHAsIHRoaXMpO1xuICAgIHRoaXMuYWRkU2V0dGluZ1RhYih0aGlzLnNldHRpbmdUYWIpO1xuXG4gICAgdGhpcy5zdGF0dXNCYXIgPSBQcm92aWRlclN0YXR1c0Jhci5uZXcoXG4gICAgICB0aGlzLmFkZFN0YXR1c0Jhckl0ZW0oKSxcbiAgICAgIHRoaXMuc2V0dGluZ3Muc2hvd01hdGNoU3RyYXRlZ3ksXG4gICAgICB0aGlzLnNldHRpbmdzLnNob3dJbmRleGluZ1N0YXR1cyxcbiAgICAgIHRoaXMuc2V0dGluZ3Muc2hvd0NvbXBsZW1lbnRBdXRvbWF0aWNhbGx5XG4gICAgKTtcbiAgICB0aGlzLnN0YXR1c0Jhci5zZXRPbkNsaWNrU3RyYXRlZ3lMaXN0ZW5lcihhc3luYyAoKSA9PiB7XG4gICAgICBhd2FpdCB0aGlzLnNldHRpbmdUYWIudG9nZ2xlTWF0Y2hTdHJhdGVneSgpO1xuICAgIH0pO1xuICAgIHRoaXMuc3RhdHVzQmFyLnNldE9uQ2xpY2tDb21wbGVtZW50QXV0b21hdGljYWxseShhc3luYyAoKSA9PiB7XG4gICAgICBhd2FpdCB0aGlzLnNldHRpbmdUYWIudG9nZ2xlQ29tcGxlbWVudEF1dG9tYXRpY2FsbHkoKTtcbiAgICB9KTtcblxuICAgIGNvbnN0IGRlYm91bmNlZFNhdmVEYXRhID0gZGVib3VuY2UoYXN5bmMgKCkgPT4ge1xuICAgICAgYXdhaXQgdGhpcy5zYXZlRGF0YSh0aGlzLnNldHRpbmdzKTtcbiAgICB9LCA1MDAwKTtcblxuICAgIHRoaXMuc3VnZ2VzdGVyID0gYXdhaXQgQXV0b0NvbXBsZXRlU3VnZ2VzdC5uZXcoXG4gICAgICB0aGlzLmFwcCxcbiAgICAgIHRoaXMuc2V0dGluZ3MsXG4gICAgICB0aGlzLnN0YXR1c0JhcixcbiAgICAgIGRlYm91bmNlZFNhdmVEYXRhXG4gICAgKTtcbiAgICB0aGlzLnJlZ2lzdGVyRWRpdG9yU3VnZ2VzdCh0aGlzLnN1Z2dlc3Rlcik7XG5cbiAgICB0aGlzLmFkZENvbW1hbmQoe1xuICAgICAgaWQ6IFwicmVsb2FkLWN1c3RvbS1kaWN0aW9uYXJpZXNcIixcbiAgICAgIG5hbWU6IFwiUmVsb2FkIGN1c3RvbSBkaWN0aW9uYXJpZXNcIixcbiAgICAgIGhvdGtleXM6IFt7IG1vZGlmaWVyczogW1wiTW9kXCIsIFwiU2hpZnRcIl0sIGtleTogXCJyXCIgfV0sXG4gICAgICBjYWxsYmFjazogYXN5bmMgKCkgPT4ge1xuICAgICAgICBhd2FpdCB0aGlzLnN1Z2dlc3Rlci5yZWZyZXNoQ3VzdG9tRGljdGlvbmFyeVRva2VucygpO1xuICAgICAgfSxcbiAgICB9KTtcblxuICAgIHRoaXMuYWRkQ29tbWFuZCh7XG4gICAgICBpZDogXCJyZWxvYWQtY3VycmVudC12YXVsdFwiLFxuICAgICAgbmFtZTogXCJSZWxvYWQgY3VycmVudCB2YXVsdFwiLFxuICAgICAgY2FsbGJhY2s6IGFzeW5jICgpID0+IHtcbiAgICAgICAgYXdhaXQgdGhpcy5zdWdnZXN0ZXIucmVmcmVzaEN1cnJlbnRWYXVsdFRva2VucygpO1xuICAgICAgfSxcbiAgICB9KTtcblxuICAgIHRoaXMuYWRkQ29tbWFuZCh7XG4gICAgICBpZDogXCJ0b2dnbGUtbWF0Y2gtc3RyYXRlZ3lcIixcbiAgICAgIG5hbWU6IFwiVG9nZ2xlIE1hdGNoIHN0cmF0ZWd5XCIsXG4gICAgICBjYWxsYmFjazogYXN5bmMgKCkgPT4ge1xuICAgICAgICBhd2FpdCB0aGlzLnNldHRpbmdUYWIudG9nZ2xlTWF0Y2hTdHJhdGVneSgpO1xuICAgICAgfSxcbiAgICB9KTtcblxuICAgIHRoaXMuYWRkQ29tbWFuZCh7XG4gICAgICBpZDogXCJ0b2dnbGUtY29tcGxlbWVudC1hdXRvbWF0aWNhbGx5XCIsXG4gICAgICBuYW1lOiBcIlRvZ2dsZSBDb21wbGVtZW50IGF1dG9tYXRpY2FsbHlcIixcbiAgICAgIGNhbGxiYWNrOiBhc3luYyAoKSA9PiB7XG4gICAgICAgIGF3YWl0IHRoaXMuc2V0dGluZ1RhYi50b2dnbGVDb21wbGVtZW50QXV0b21hdGljYWxseSgpO1xuICAgICAgfSxcbiAgICB9KTtcblxuICAgIHRoaXMuYWRkQ29tbWFuZCh7XG4gICAgICBpZDogXCJzaG93LXN1Z2dlc3Rpb25zXCIsXG4gICAgICBuYW1lOiBcIlNob3cgc3VnZ2VzdGlvbnNcIixcbiAgICAgIGhvdGtleXM6IFt7IG1vZGlmaWVyczogW1wiTW9kXCJdLCBrZXk6IFwiIFwiIH1dLFxuICAgICAgY2FsbGJhY2s6IGFzeW5jICgpID0+IHtcbiAgICAgICAgdGhpcy5zdWdnZXN0ZXIudHJpZ2dlckNvbXBsZXRlKCk7XG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgdGhpcy5hZGRDb21tYW5kKHtcbiAgICAgIGlkOiBcImFkZC13b3JkLWN1c3RvbS1kaWN0aW9uYXJ5XCIsXG4gICAgICBuYW1lOiBcIkFkZCBhIHdvcmQgdG8gYSBjdXN0b20gZGljdGlvbmFyeVwiLFxuICAgICAgaG90a2V5czogW3sgbW9kaWZpZXJzOiBbXCJNb2RcIiwgXCJTaGlmdFwiXSwga2V5OiBcIiBcIiB9XSxcbiAgICAgIGNhbGxiYWNrOiBhc3luYyAoKSA9PiB7XG4gICAgICAgIHRoaXMuYWRkV29yZFRvQ3VzdG9tRGljdGlvbmFyeSgpO1xuICAgICAgfSxcbiAgICB9KTtcblxuICAgIHRoaXMuYWRkQ29tbWFuZCh7XG4gICAgICBpZDogXCJwcmVkaWN0YWJsZS1jb21wbGVtZW50c1wiLFxuICAgICAgbmFtZTogXCJQcmVkaWN0YWJsZSBjb21wbGVtZW50XCIsXG4gICAgICBjYWxsYmFjazogYXN5bmMgKCkgPT4ge1xuICAgICAgICB0aGlzLnN1Z2dlc3Rlci5wcmVkaWN0YWJsZUNvbXBsZXRlKCk7XG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgdGhpcy5hZGRDb21tYW5kKHtcbiAgICAgIGlkOiBcImNvcHktcGx1Z2luLXNldHRpbmdzXCIsXG4gICAgICBuYW1lOiBcIkNvcHkgcGx1Z2luIHNldHRpbmdzXCIsXG4gICAgICBjYWxsYmFjazogYXN5bmMgKCkgPT4ge1xuICAgICAgICBhd2FpdCBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dChcbiAgICAgICAgICB0aGlzLnNldHRpbmdUYWIuZ2V0UGx1Z2luU2V0dGluZ3NBc0pzb25TdHJpbmcoKVxuICAgICAgICApO1xuICAgICAgICAvLyBub2luc3BlY3Rpb24gT2JqZWN0QWxsb2NhdGlvbklnbm9yZWRcbiAgICAgICAgbmV3IE5vdGljZShcIkNvcHkgc2V0dGluZ3Mgb2YgVmFyaW91cyBDb21wbGVtZW50c1wiKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICBhc3luYyBsb2FkU2V0dGluZ3MoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdGhpcy5zZXR0aW5ncyA9IHsgLi4uREVGQVVMVF9TRVRUSU5HUywgLi4uKGF3YWl0IHRoaXMubG9hZERhdGEoKSkgfTtcbiAgfVxuXG4gIGFzeW5jIHNhdmVTZXR0aW5ncyhcbiAgICBuZWVkVXBkYXRlVG9rZW5zOiB7XG4gICAgICBjdXJyZW50RmlsZT86IGJvb2xlYW47XG4gICAgICBjdXJyZW50VmF1bHQ/OiBib29sZWFuO1xuICAgICAgY3VzdG9tRGljdGlvbmFyeT86IGJvb2xlYW47XG4gICAgICBpbnRlcm5hbExpbms/OiBib29sZWFuO1xuICAgICAgZnJvbnRNYXR0ZXI/OiBib29sZWFuO1xuICAgIH0gPSB7fVxuICApOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCB0aGlzLnNhdmVEYXRhKHRoaXMuc2V0dGluZ3MpO1xuICAgIGF3YWl0IHRoaXMuc3VnZ2VzdGVyLnVwZGF0ZVNldHRpbmdzKHRoaXMuc2V0dGluZ3MpO1xuICAgIGlmIChuZWVkVXBkYXRlVG9rZW5zLmN1cnJlbnRGaWxlKSB7XG4gICAgICBhd2FpdCB0aGlzLnN1Z2dlc3Rlci5yZWZyZXNoQ3VycmVudEZpbGVUb2tlbnMoKTtcbiAgICB9XG4gICAgaWYgKG5lZWRVcGRhdGVUb2tlbnMuY3VycmVudFZhdWx0KSB7XG4gICAgICBhd2FpdCB0aGlzLnN1Z2dlc3Rlci5yZWZyZXNoQ3VycmVudFZhdWx0VG9rZW5zKCk7XG4gICAgfVxuICAgIGlmIChuZWVkVXBkYXRlVG9rZW5zLmN1c3RvbURpY3Rpb25hcnkpIHtcbiAgICAgIGF3YWl0IHRoaXMuc3VnZ2VzdGVyLnJlZnJlc2hDdXN0b21EaWN0aW9uYXJ5VG9rZW5zKCk7XG4gICAgfVxuICAgIGlmIChuZWVkVXBkYXRlVG9rZW5zLmludGVybmFsTGluaykge1xuICAgICAgYXdhaXQgdGhpcy5zdWdnZXN0ZXIucmVmcmVzaEludGVybmFsTGlua1Rva2VucygpO1xuICAgIH1cbiAgICBpZiAobmVlZFVwZGF0ZVRva2Vucy5mcm9udE1hdHRlcikge1xuICAgICAgYXdhaXQgdGhpcy5zdWdnZXN0ZXIucmVmcmVzaEZyb250TWF0dGVyVG9rZW5zKCk7XG4gICAgfVxuICB9XG5cbiAgYWRkV29yZFRvQ3VzdG9tRGljdGlvbmFyeSgpIHtcbiAgICBjb25zdCBzZWxlY3RlZFdvcmQgPSB0aGlzLmFwcEhlbHBlci5nZXRTZWxlY3Rpb24oKTtcbiAgICBjb25zdCBwcm92aWRlciA9IHRoaXMuc3VnZ2VzdGVyLmN1c3RvbURpY3Rpb25hcnlXb3JkUHJvdmlkZXI7XG4gICAgY29uc3QgbW9kYWwgPSBuZXcgQ3VzdG9tRGljdGlvbmFyeVdvcmRBZGRNb2RhbChcbiAgICAgIHRoaXMuYXBwLFxuICAgICAgcHJvdmlkZXIuZWRpdGFibGVQYXRocyxcbiAgICAgIHNlbGVjdGVkV29yZCxcbiAgICAgIHRoaXMuc2V0dGluZ3MuZGVsaW1pdGVyVG9EaXZpZGVTdWdnZXN0aW9uc0ZvckRpc3BsYXlGcm9tSW5zZXJ0aW9uLFxuICAgICAgYXN5bmMgKGRpY3Rpb25hcnlQYXRoLCB3b3JkKSA9PiB7XG4gICAgICAgIGlmIChwcm92aWRlci53b3JkQnlWYWx1ZVt3b3JkLnZhbHVlXSkge1xuICAgICAgICAgIC8vIG5vaW5zcGVjdGlvbiBPYmplY3RBbGxvY2F0aW9uSWdub3JlZFxuICAgICAgICAgIG5ldyBOb3RpY2UoYOKaoCAke3dvcmQudmFsdWV9IGFscmVhZHkgZXhpc3RzYCwgMCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgYXdhaXQgcHJvdmlkZXIuYWRkV29yZFdpdGhEaWN0aW9uYXJ5KHdvcmQsIGRpY3Rpb25hcnlQYXRoKTtcbiAgICAgICAgLy8gbm9pbnNwZWN0aW9uIE9iamVjdEFsbG9jYXRpb25JZ25vcmVkXG4gICAgICAgIG5ldyBOb3RpY2UoYEFkZGVkICR7d29yZC52YWx1ZX1gKTtcbiAgICAgICAgbW9kYWwuY2xvc2UoKTtcbiAgICAgIH1cbiAgICApO1xuXG4gICAgbW9kYWwub3BlbigpO1xuICB9XG59XG4iXSwibmFtZXMiOlsicHJldHRpZnkiLCJUcmllIiwicmVxdWlyZSQkMCIsInJlcXVpcmUkJDEiLCJDZWRpY3QiLCJjaGluZXNlVG9rZW5pemVyIiwicGFyc2VGcm9udE1hdHRlckFsaWFzZXMiLCJwYXJzZUZyb250TWF0dGVyVGFncyIsInBhcnNlRnJvbnRNYXR0ZXJTdHJpbmdBcnJheSIsIk1hcmtkb3duVmlldyIsIm5vcm1hbGl6ZVBhdGgiLCJzeW5vbnltQWxpYXNlcyIsInJlcXVlc3QiLCJOb3RpY2UiLCJFZGl0b3JTdWdnZXN0IiwiZGVib3VuY2UiLCJQbHVnaW5TZXR0aW5nVGFiIiwiU2V0dGluZyIsIk1vZGFsIiwiUGx1Z2luIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQTRCQTtBQUNPLFNBQVMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDN0IsSUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDZixJQUFJLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7QUFDdkYsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3BCLElBQUksSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLE9BQU8sTUFBTSxDQUFDLHFCQUFxQixLQUFLLFVBQVU7QUFDdkUsUUFBUSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ2hGLFlBQVksSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzFGLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2xDLFNBQVM7QUFDVCxJQUFJLE9BQU8sQ0FBQyxDQUFDO0FBQ2IsQ0FBQztBQWdCRDtBQUNPLFNBQVMsU0FBUyxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRTtBQUM3RCxJQUFJLFNBQVMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLE9BQU8sS0FBSyxZQUFZLENBQUMsR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUMsVUFBVSxPQUFPLEVBQUUsRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRTtBQUNoSCxJQUFJLE9BQU8sS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLE9BQU8sQ0FBQyxFQUFFLFVBQVUsT0FBTyxFQUFFLE1BQU0sRUFBRTtBQUMvRCxRQUFRLFNBQVMsU0FBUyxDQUFDLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7QUFDbkcsUUFBUSxTQUFTLFFBQVEsQ0FBQyxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7QUFDdEcsUUFBUSxTQUFTLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRSxNQUFNLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDLEVBQUU7QUFDdEgsUUFBUSxJQUFJLENBQUMsQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsVUFBVSxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7QUFDOUUsS0FBSyxDQUFDLENBQUM7QUFDUDs7QUM3RUEsTUFBTSxRQUFRLEdBQUcsSUFBSSxNQUFNLENB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QUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7QUFDcEIsSUFBQSxLQUFLLElBQUksQ0FBQyxJQUFJLFFBQVEsRUFBRTtBQUN0QixRQUFBLElBQUksTUFBTSxHQUFHLElBQUksTUFBTSxFQUFFLENBQUM7QUFDMUIsUUFBQSxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2xCLFFBQUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM1QyxLQUFBO0FBRUQsSUFBQSxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyxDQUFDO0lBQ25CLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNyRCxJQUFJLENBQUMsS0FBSyxHQUFHO1FBQ1gsRUFBRSxFQUFFLENBQUMsSUFBSTtBQUNULFFBQUEsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsQ0FBQyxHQUFHO1FBQ1IsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLElBQUk7QUFDVCxRQUFBLEVBQUUsRUFBRSxJQUFJO0FBQ1IsUUFBQSxFQUFFLEVBQUUsSUFBSTtBQUNSLFFBQUEsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsSUFBSTtBQUNULFFBQUEsRUFBRSxFQUFFLElBQUk7QUFDUixRQUFBLEVBQUUsRUFBRSxJQUFJO0FBQ1IsUUFBQSxFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxJQUFJO0FBQ1QsUUFBQSxFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxDQUFDLElBQUk7S0FDVixDQUFDO0lBQ0YsSUFBSSxDQUFDLEtBQUssR0FBRztBQUNYLFFBQUEsRUFBRSxFQUFFLEdBQUc7QUFDUCxRQUFBLEVBQUUsRUFBRSxHQUFHO1FBQ1AsRUFBRSxFQUFFLENBQUMsR0FBRztRQUNSLEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxHQUFHO1FBQ1IsRUFBRSxFQUFFLENBQUMsR0FBRztBQUNSLFFBQUEsRUFBRSxFQUFFLElBQUk7QUFDUixRQUFBLEVBQUUsRUFBRSxJQUFJO0FBQ1IsUUFBQSxFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxDQUFDLElBQUk7QUFDVCxRQUFBLEVBQUUsRUFBRSxHQUFHO0tBQ1IsQ0FBQztJQUNGLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQztBQUNyRCxJQUFBLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ25DLElBQUksQ0FBQyxLQUFLLEdBQUc7QUFDWCxRQUFBLEdBQUcsRUFBRSxJQUFJO0FBQ1QsUUFBQSxHQUFHLEVBQUUsSUFBSTtRQUNULEdBQUcsRUFBRSxDQUFDLElBQUk7QUFDVixRQUFBLEdBQUcsRUFBRSxHQUFHO0FBQ1IsUUFBQSxHQUFHLEVBQUUsSUFBSTtBQUNULFFBQUEsR0FBRyxFQUFFLEdBQUc7UUFDUixHQUFHLEVBQUUsQ0FBQyxFQUFFO1FBQ1IsR0FBRyxFQUFFLENBQUMsSUFBSTtBQUNWLFFBQUEsR0FBRyxFQUFFLEdBQUc7UUFDUixHQUFHLEVBQUUsQ0FBQyxHQUFHO0FBQ1QsUUFBQSxHQUFHLEVBQUUsSUFBSTtRQUNULEdBQUcsRUFBRSxDQUFDLElBQUk7QUFDVixRQUFBLEdBQUcsRUFBRSxHQUFHO0FBQ1IsUUFBQSxHQUFHLEVBQUUsSUFBSTtLQUNWLENBQUM7SUFDRixJQUFJLENBQUMsS0FBSyxHQUFHO0FBQ1gsUUFBQSxHQUFHLEVBQUUsR0FBRztRQUNSLEdBQUcsRUFBRSxDQUFDLElBQUk7QUFDVixRQUFBLEdBQUcsRUFBRSxHQUFHO1FBQ1IsR0FBRyxFQUFFLENBQUMsR0FBRztRQUNULEdBQUcsRUFBRSxDQUFDLElBQUk7QUFDVixRQUFBLEdBQUcsRUFBRSxHQUFHO1FBQ1IsR0FBRyxFQUFFLENBQUMsSUFBSTtRQUNWLEdBQUcsRUFBRSxDQUFDLEdBQUc7QUFDVCxRQUFBLEdBQUcsRUFBRSxHQUFHO1FBQ1IsR0FBRyxFQUFFLENBQUMsSUFBSTtLQUNYLENBQUM7SUFDRixJQUFJLENBQUMsS0FBSyxHQUFHO1FBQ1gsR0FBRyxFQUFFLENBQUMsR0FBRztBQUNULFFBQUEsR0FBRyxFQUFFLElBQUk7UUFDVCxHQUFHLEVBQUUsQ0FBQyxHQUFHO0FBQ1QsUUFBQSxHQUFHLEVBQUUsR0FBRztBQUNSLFFBQUEsR0FBRyxFQUFFLEdBQUc7QUFDUixRQUFBLEdBQUcsRUFBRSxJQUFJO0FBQ1QsUUFBQSxHQUFHLEVBQUUsR0FBRztBQUNSLFFBQUEsR0FBRyxFQUFFLEdBQUc7QUFDUixRQUFBLEdBQUcsRUFBRSxJQUFJO0FBQ1QsUUFBQSxHQUFHLEVBQUUsR0FBRztBQUNSLFFBQUEsR0FBRyxFQUFFLEdBQUc7QUFDUixRQUFBLEdBQUcsRUFBRSxJQUFJO1FBQ1QsR0FBRyxFQUFFLENBQUMsR0FBRztRQUNULEdBQUcsRUFBRSxDQUFDLElBQUk7UUFDVixHQUFHLEVBQUUsQ0FBQyxJQUFJO0FBQ1YsUUFBQSxHQUFHLEVBQUUsS0FBSztLQUNYLENBQUM7SUFDRixJQUFJLENBQUMsS0FBSyxHQUFHO1FBQ1gsR0FBRyxFQUFFLENBQUMsSUFBSTtBQUNWLFFBQUEsR0FBRyxFQUFFLElBQUk7UUFDVCxHQUFHLEVBQUUsQ0FBQyxJQUFJO0FBQ1YsUUFBQSxHQUFHLEVBQUUsSUFBSTtRQUNULEdBQUcsRUFBRSxDQUFDLElBQUk7UUFDVixHQUFHLEVBQUUsQ0FBQyxJQUFJO1FBQ1YsR0FBRyxFQUFFLENBQUMsS0FBSztBQUNYLFFBQUEsR0FBRyxFQUFFLEdBQUc7QUFDUixRQUFBLEdBQUcsRUFBRSxHQUFHO1FBQ1IsR0FBRyxFQUFFLENBQUMsSUFBSTtRQUNWLEdBQUcsRUFBRSxDQUFDLEdBQUc7S0FDVixDQUFDO0lBQ0YsSUFBSSxDQUFDLEtBQUssR0FBRztBQUNYLFFBQUEsSUFBSSxFQUFFLEdBQUc7QUFDVCxRQUFBLElBQUksRUFBRSxHQUFHO0FBQ1QsUUFBQSxHQUFHLEVBQUUsSUFBSTtBQUNULFFBQUEsR0FBRyxFQUFFLEdBQUc7QUFDUixRQUFBLElBQUksRUFBRSxHQUFHO0FBQ1QsUUFBQSxJQUFJLEVBQUUsR0FBRztBQUNULFFBQUEsSUFBSSxFQUFFLElBQUk7QUFDVixRQUFBLEVBQUUsRUFBRSxJQUFJO0FBQ1IsUUFBQSxFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxDQUFDLElBQUk7QUFDVCxRQUFBLEVBQUUsRUFBRSxHQUFHO1FBQ1AsRUFBRSxFQUFFLENBQUMsSUFBSTtBQUNULFFBQUEsRUFBRSxFQUFFLEdBQUc7QUFDUCxRQUFBLEVBQUUsRUFBRSxJQUFJO0FBQ1IsUUFBQSxFQUFFLEVBQUUsR0FBRztRQUNQLEVBQUUsRUFBRSxDQUFDLEdBQUc7QUFDUixRQUFBLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLElBQUk7QUFDVCxRQUFBLEVBQUUsRUFBRSxJQUFJO0FBQ1IsUUFBQSxFQUFFLEVBQUUsSUFBSTtBQUNSLFFBQUEsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsQ0FBQyxJQUFJO0FBQ1QsUUFBQSxFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxDQUFDLEdBQUc7QUFDUixRQUFBLEVBQUUsRUFBRSxJQUFJO0FBQ1IsUUFBQSxFQUFFLEVBQUUsR0FBRztBQUNQLFFBQUEsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsQ0FBQyxHQUFHO0FBQ1IsUUFBQSxFQUFFLEVBQUUsR0FBRztBQUNQLFFBQUEsRUFBRSxFQUFFLElBQUk7QUFDUixRQUFBLEVBQUUsRUFBRSxJQUFJO0FBQ1IsUUFBQSxFQUFFLEVBQUUsSUFBSTtBQUNSLFFBQUEsRUFBRSxFQUFFLEdBQUc7UUFDUCxFQUFFLEVBQUUsQ0FBQyxJQUFJO0FBQ1QsUUFBQSxFQUFFLEVBQUUsSUFBSTtBQUNSLFFBQUEsRUFBRSxFQUFFLElBQUk7QUFDUixRQUFBLEVBQUUsRUFBRSxJQUFJO0FBQ1IsUUFBQSxFQUFFLEVBQUUsSUFBSTtBQUNSLFFBQUEsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsQ0FBQyxJQUFJO0FBQ1QsUUFBQSxFQUFFLEVBQUUsSUFBSTtBQUNSLFFBQUEsRUFBRSxFQUFFLElBQUk7QUFDUixRQUFBLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLENBQUMsR0FBRztRQUNSLEVBQUUsRUFBRSxDQUFDLEdBQUc7QUFDUixRQUFBLEVBQUUsRUFBRSxHQUFHO0FBQ1AsUUFBQSxFQUFFLEVBQUUsSUFBSTtBQUNSLFFBQUEsRUFBRSxFQUFFLElBQUk7QUFDUixRQUFBLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxJQUFJO0FBQ1QsUUFBQSxFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxDQUFDLEdBQUc7QUFDUixRQUFBLEVBQUUsRUFBRSxJQUFJO0FBQ1IsUUFBQSxFQUFFLEVBQUUsR0FBRztRQUNQLEVBQUUsRUFBRSxDQUFDLElBQUk7QUFDVCxRQUFBLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLElBQUk7QUFDVCxRQUFBLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxHQUFHO1FBQ1IsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxHQUFHO0FBQ1IsUUFBQSxHQUFHLEVBQUUsSUFBSTtBQUNULFFBQUEsR0FBRyxFQUFFLEdBQUc7QUFDUixRQUFBLElBQUksRUFBRSxJQUFJO0tBQ1gsQ0FBQztJQUNGLElBQUksQ0FBQyxLQUFLLEdBQUc7UUFDWCxJQUFJLEVBQUUsQ0FBQyxLQUFLO1FBQ1osRUFBRSxFQUFFLENBQUMsR0FBRztRQUNSLElBQUksRUFBRSxDQUFDLElBQUk7UUFDWCxJQUFJLEVBQUUsQ0FBQyxLQUFLO1FBQ1osRUFBRSxFQUFFLENBQUMsSUFBSTtBQUNULFFBQUEsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsR0FBRztRQUNSLEVBQUUsRUFBRSxDQUFDLElBQUk7QUFDVCxRQUFBLEVBQUUsRUFBRSxJQUFJO0FBQ1IsUUFBQSxFQUFFLEVBQUUsR0FBRztRQUNQLEVBQUUsRUFBRSxDQUFDLElBQUk7QUFDVCxRQUFBLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxJQUFJO0FBQ1QsUUFBQSxFQUFFLEVBQUUsSUFBSTtBQUNSLFFBQUEsRUFBRSxFQUFFLEtBQUs7UUFDVCxFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLEdBQUc7QUFDUixRQUFBLEVBQUUsRUFBRSxJQUFJO0FBQ1IsUUFBQSxFQUFFLEVBQUUsR0FBRztBQUNQLFFBQUEsRUFBRSxFQUFFLEdBQUc7UUFDUCxFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLEdBQUc7UUFDUixFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsR0FBRztBQUNSLFFBQUEsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsQ0FBQyxHQUFHO0FBQ1IsUUFBQSxFQUFFLEVBQUUsSUFBSTtBQUNSLFFBQUEsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsQ0FBQyxJQUFJO0FBQ1QsUUFBQSxFQUFFLEVBQUUsSUFBSTtBQUNSLFFBQUEsRUFBRSxFQUFFLElBQUk7QUFDUixRQUFBLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLElBQUk7QUFDVCxRQUFBLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsSUFBSTtBQUNULFFBQUEsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsSUFBSTtBQUNULFFBQUEsRUFBRSxFQUFFLEdBQUc7QUFDUCxRQUFBLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsSUFBSTtBQUNULFFBQUEsRUFBRSxFQUFFLElBQUk7QUFDUixRQUFBLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLENBQUMsSUFBSTtBQUNULFFBQUEsRUFBRSxFQUFFLElBQUk7QUFDUixRQUFBLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLEtBQUs7UUFDVixFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsS0FBSztBQUNWLFFBQUEsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLElBQUk7QUFDVCxRQUFBLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLElBQUk7QUFDVCxRQUFBLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLElBQUk7QUFDVCxRQUFBLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLENBQUMsSUFBSTtBQUNULFFBQUEsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsQ0FBQyxLQUFLO1FBQ1YsRUFBRSxFQUFFLENBQUMsR0FBRztRQUNSLEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxJQUFJO0FBQ1QsUUFBQSxFQUFFLEVBQUUsR0FBRztBQUNQLFFBQUEsRUFBRSxFQUFFLElBQUk7QUFDUixRQUFBLEVBQUUsRUFBRSxJQUFJO0FBQ1IsUUFBQSxFQUFFLEVBQUUsR0FBRztBQUNQLFFBQUEsRUFBRSxFQUFFLElBQUk7QUFDUixRQUFBLEVBQUUsRUFBRSxJQUFJO0FBQ1IsUUFBQSxFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxDQUFDLEtBQUs7QUFDVixRQUFBLEVBQUUsRUFBRSxHQUFHO1FBQ1AsRUFBRSxFQUFFLENBQUMsSUFBSTtBQUNULFFBQUEsRUFBRSxFQUFFLEdBQUc7UUFDUCxFQUFFLEVBQUUsQ0FBQyxJQUFJO0FBQ1QsUUFBQSxFQUFFLEVBQUUsR0FBRztRQUNQLEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsSUFBSTtBQUNULFFBQUEsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsQ0FBQyxJQUFJO0FBQ1QsUUFBQSxFQUFFLEVBQUUsR0FBRztRQUNQLEVBQUUsRUFBRSxDQUFDLEdBQUc7UUFDUixFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLEdBQUc7UUFDUixFQUFFLEVBQUUsQ0FBQyxJQUFJO0FBQ1QsUUFBQSxFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxDQUFDLEdBQUc7UUFDUixFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLEdBQUc7UUFDUixFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULElBQUksRUFBRSxDQUFDLEdBQUc7S0FDWCxDQUFDO0lBQ0YsSUFBSSxDQUFDLEtBQUssR0FBRztRQUNYLEVBQUUsRUFBRSxDQUFDLElBQUk7QUFDVCxRQUFBLEVBQUUsRUFBRSxHQUFHO0FBQ1AsUUFBQSxFQUFFLEVBQUUsSUFBSTtRQUNSLElBQUksRUFBRSxDQUFDLElBQUk7UUFDWCxJQUFJLEVBQUUsQ0FBQyxJQUFJO0FBQ1gsUUFBQSxFQUFFLEVBQUUsSUFBSTtBQUNSLFFBQUEsRUFBRSxFQUFFLElBQUk7QUFDUixRQUFBLEVBQUUsRUFBRSxJQUFJO0FBQ1IsUUFBQSxFQUFFLEVBQUUsSUFBSTtBQUNSLFFBQUEsRUFBRSxFQUFFLElBQUk7QUFDUixRQUFBLEVBQUUsRUFBRSxJQUFJO0FBQ1IsUUFBQSxFQUFFLEVBQUUsSUFBSTtBQUNSLFFBQUEsRUFBRSxFQUFFLElBQUk7QUFDUixRQUFBLEVBQUUsRUFBRSxJQUFJO0FBQ1IsUUFBQSxFQUFFLEVBQUUsSUFBSTtBQUNSLFFBQUEsSUFBSSxFQUFFLElBQUk7QUFDVixRQUFBLElBQUksRUFBRSxJQUFJO1FBQ1YsRUFBRSxFQUFFLENBQUMsR0FBRztRQUNSLEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxHQUFHO0FBQ1IsUUFBQSxFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxDQUFDLElBQUk7QUFDVCxRQUFBLElBQUksRUFBRSxJQUFJO0FBQ1YsUUFBQSxJQUFJLEVBQUUsSUFBSTtRQUNWLEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsR0FBRztRQUNSLEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxJQUFJO0FBQ1QsUUFBQSxFQUFFLEVBQUUsSUFBSTtBQUNSLFFBQUEsRUFBRSxFQUFFLElBQUk7QUFDUixRQUFBLEVBQUUsRUFBRSxJQUFJO0FBQ1IsUUFBQSxFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxHQUFHO0FBQ1IsUUFBQSxFQUFFLEVBQUUsR0FBRztBQUNQLFFBQUEsSUFBSSxFQUFFLElBQUk7QUFDVixRQUFBLElBQUksRUFBRSxJQUFJO1FBQ1YsRUFBRSxFQUFFLENBQUMsSUFBSTtBQUNULFFBQUEsRUFBRSxFQUFFLElBQUk7QUFDUixRQUFBLEVBQUUsRUFBRSxJQUFJO0FBQ1IsUUFBQSxFQUFFLEVBQUUsSUFBSTtBQUNSLFFBQUEsRUFBRSxFQUFFLElBQUk7UUFDUixJQUFJLEVBQUUsQ0FBQyxJQUFJO1FBQ1gsSUFBSSxFQUFFLENBQUMsSUFBSTtBQUNYLFFBQUEsRUFBRSxFQUFFLElBQUk7QUFDUixRQUFBLElBQUksRUFBRSxJQUFJO0FBQ1YsUUFBQSxJQUFJLEVBQUUsSUFBSTtBQUNWLFFBQUEsRUFBRSxFQUFFLEdBQUc7QUFDUCxRQUFBLEVBQUUsRUFBRSxHQUFHO0FBQ1AsUUFBQSxJQUFJLEVBQUUsSUFBSTtBQUNWLFFBQUEsSUFBSSxFQUFFLElBQUk7UUFDVixFQUFFLEVBQUUsQ0FBQyxHQUFHO0FBQ1IsUUFBQSxFQUFFLEVBQUUsR0FBRztRQUNQLEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxHQUFHO0FBQ1IsUUFBQSxJQUFJLEVBQUUsSUFBSTtBQUNWLFFBQUEsSUFBSSxFQUFFLElBQUk7QUFDVixRQUFBLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLENBQUMsSUFBSTtBQUNULFFBQUEsRUFBRSxFQUFFLEdBQUc7QUFDUCxRQUFBLEVBQUUsRUFBRSxJQUFJO0FBQ1IsUUFBQSxFQUFFLEVBQUUsR0FBRztBQUNQLFFBQUEsRUFBRSxFQUFFLEdBQUc7QUFDUCxRQUFBLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLENBQUMsSUFBSTtBQUNULFFBQUEsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsQ0FBQyxJQUFJO0FBQ1QsUUFBQSxFQUFFLEVBQUUsSUFBSTtBQUNSLFFBQUEsRUFBRSxFQUFFLEdBQUc7UUFDUCxFQUFFLEVBQUUsQ0FBQyxJQUFJO0FBQ1QsUUFBQSxFQUFFLEVBQUUsSUFBSTtBQUNSLFFBQUEsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsQ0FBQyxHQUFHO0FBQ1IsUUFBQSxFQUFFLEVBQUUsSUFBSTtRQUNSLElBQUksRUFBRSxDQUFDLElBQUk7UUFDWCxJQUFJLEVBQUUsQ0FBQyxJQUFJO0FBQ1gsUUFBQSxFQUFFLEVBQUUsSUFBSTtBQUNSLFFBQUEsRUFBRSxFQUFFLElBQUk7QUFDUixRQUFBLEVBQUUsRUFBRSxJQUFJO1FBQ1IsSUFBSSxFQUFFLENBQUMsR0FBRztRQUNWLElBQUksRUFBRSxDQUFDLEdBQUc7UUFDVixFQUFFLEVBQUUsQ0FBQyxJQUFJO0FBQ1QsUUFBQSxJQUFJLEVBQUUsSUFBSTtBQUNWLFFBQUEsSUFBSSxFQUFFLElBQUk7QUFDVixRQUFBLEVBQUUsRUFBRSxJQUFJO0FBQ1IsUUFBQSxFQUFFLEVBQUUsSUFBSTtBQUNSLFFBQUEsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsQ0FBQyxJQUFJO0FBQ1QsUUFBQSxFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxDQUFDLEdBQUc7QUFDUixRQUFBLEVBQUUsRUFBRSxJQUFJO0FBQ1IsUUFBQSxFQUFFLEVBQUUsSUFBSTtBQUNSLFFBQUEsRUFBRSxFQUFFLElBQUk7QUFDUixRQUFBLElBQUksRUFBRSxHQUFHO0FBQ1QsUUFBQSxJQUFJLEVBQUUsR0FBRztBQUNULFFBQUEsRUFBRSxFQUFFLElBQUk7QUFDUixRQUFBLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLENBQUMsSUFBSTtBQUNULFFBQUEsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsQ0FBQyxHQUFHO0FBQ1IsUUFBQSxFQUFFLEVBQUUsR0FBRztBQUNQLFFBQUEsRUFBRSxFQUFFLEdBQUc7QUFDUCxRQUFBLEVBQUUsRUFBRSxHQUFHO0FBQ1AsUUFBQSxFQUFFLEVBQUUsR0FBRztBQUNQLFFBQUEsRUFBRSxFQUFFLElBQUk7QUFDUixRQUFBLEVBQUUsRUFBRSxJQUFJO0FBQ1IsUUFBQSxFQUFFLEVBQUUsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLEdBQUc7UUFDTixFQUFFLEVBQUUsQ0FBQyxJQUFJO0FBQ1QsUUFBQSxJQUFJLEVBQUUsR0FBRztBQUNULFFBQUEsSUFBSSxFQUFFLEdBQUc7QUFDVCxRQUFBLEVBQUUsRUFBRSxJQUFJO0FBQ1IsUUFBQSxFQUFFLEVBQUUsR0FBRztLQUNSLENBQUM7SUFDRixJQUFJLENBQUMsS0FBSyxHQUFHO0FBQ1gsUUFBQSxHQUFHLEVBQUUsSUFBSTtBQUNULFFBQUEsR0FBRyxFQUFFLElBQUk7QUFDVCxRQUFBLEdBQUcsRUFBRSxHQUFHO0FBQ1IsUUFBQSxHQUFHLEVBQUUsR0FBRztRQUNSLEdBQUcsRUFBRSxDQUFDLEdBQUc7UUFDVCxHQUFHLEVBQUUsQ0FBQyxHQUFHO0FBQ1QsUUFBQSxHQUFHLEVBQUUsSUFBSTtRQUNULEdBQUcsRUFBRSxDQUFDLEdBQUc7UUFDVCxHQUFHLEVBQUUsQ0FBQyxJQUFJO0FBQ1YsUUFBQSxHQUFHLEVBQUUsR0FBRztBQUNSLFFBQUEsR0FBRyxFQUFFLEdBQUc7UUFDUixHQUFHLEVBQUUsQ0FBQyxJQUFJO0tBQ1gsQ0FBQztJQUNGLElBQUksQ0FBQyxLQUFLLEdBQUc7QUFDWCxRQUFBLEdBQUcsRUFBRSxJQUFJO1FBQ1QsR0FBRyxFQUFFLENBQUMsSUFBSTtRQUNWLEdBQUcsRUFBRSxDQUFDLElBQUk7UUFDVixHQUFHLEVBQUUsQ0FBQyxJQUFJO0FBQ1YsUUFBQSxHQUFHLEVBQUUsR0FBRztRQUNSLEdBQUcsRUFBRSxDQUFDLElBQUk7S0FDWCxDQUFDO0lBQ0YsSUFBSSxDQUFDLEtBQUssR0FBRztRQUNYLEdBQUcsRUFBRSxDQUFDLEdBQUc7QUFDVCxRQUFBLEdBQUcsRUFBRSxHQUFHO1FBQ1IsR0FBRyxFQUFFLENBQUMsR0FBRztRQUNULEdBQUcsRUFBRSxDQUFDLElBQUk7QUFDVixRQUFBLEdBQUcsRUFBRSxHQUFHO1FBQ1IsR0FBRyxFQUFFLENBQUMsSUFBSTtBQUNWLFFBQUEsR0FBRyxFQUFFLEdBQUc7UUFDUixHQUFHLEVBQUUsQ0FBQyxJQUFJO1FBQ1YsR0FBRyxFQUFFLENBQUMsSUFBSTtRQUNWLEdBQUcsRUFBRSxDQUFDLEdBQUc7UUFDVCxHQUFHLEVBQUUsQ0FBQyxJQUFJO1FBQ1YsR0FBRyxFQUFFLENBQUMsR0FBRztRQUNULEdBQUcsRUFBRSxDQUFDLElBQUk7QUFDVixRQUFBLEdBQUcsRUFBRSxHQUFHO1FBQ1IsR0FBRyxFQUFFLENBQUMsSUFBSTtRQUNWLEdBQUcsRUFBRSxDQUFDLElBQUk7UUFDVixHQUFHLEVBQUUsQ0FBQyxJQUFJO1FBQ1YsR0FBRyxFQUFFLENBQUMsR0FBRztBQUNULFFBQUEsR0FBRyxFQUFFLEdBQUc7UUFDUixHQUFHLEVBQUUsQ0FBQyxHQUFHO1FBQ1QsR0FBRyxFQUFFLENBQUMsSUFBSTtBQUNWLFFBQUEsR0FBRyxFQUFFLEdBQUc7UUFDUixHQUFHLEVBQUUsQ0FBQyxJQUFJO0tBQ1gsQ0FBQztJQUNGLElBQUksQ0FBQyxLQUFLLEdBQUc7UUFDWCxHQUFHLEVBQUUsQ0FBQyxHQUFHO0FBQ1QsUUFBQSxHQUFHLEVBQUUsSUFBSTtBQUNULFFBQUEsR0FBRyxFQUFFLEdBQUc7UUFDUixHQUFHLEVBQUUsQ0FBQyxHQUFHO0FBQ1QsUUFBQSxHQUFHLEVBQUUsR0FBRztBQUNSLFFBQUEsR0FBRyxFQUFFLEdBQUc7QUFDUixRQUFBLEdBQUcsRUFBRSxHQUFHO0FBQ1IsUUFBQSxHQUFHLEVBQUUsR0FBRztBQUNSLFFBQUEsR0FBRyxFQUFFLEdBQUc7QUFDUixRQUFBLEdBQUcsRUFBRSxHQUFHO1FBQ1IsR0FBRyxFQUFFLENBQUMsSUFBSTtBQUNWLFFBQUEsR0FBRyxFQUFFLEdBQUc7QUFDUixRQUFBLEdBQUcsRUFBRSxJQUFJO0FBQ1QsUUFBQSxHQUFHLEVBQUUsR0FBRztBQUNSLFFBQUEsR0FBRyxFQUFFLEVBQUU7QUFDUCxRQUFBLEdBQUcsRUFBRSxJQUFJO0FBQ1QsUUFBQSxHQUFHLEVBQUUsSUFBSTtBQUNULFFBQUEsR0FBRyxFQUFFLElBQUk7UUFDVCxHQUFHLEVBQUUsQ0FBQyxHQUFHO0FBQ1QsUUFBQSxHQUFHLEVBQUUsR0FBRztRQUNSLEdBQUcsRUFBRSxDQUFDLEdBQUc7QUFDVCxRQUFBLEdBQUcsRUFBRSxHQUFHO0FBQ1IsUUFBQSxHQUFHLEVBQUUsR0FBRztLQUNULENBQUM7SUFDRixJQUFJLENBQUMsS0FBSyxHQUFHO1FBQ1gsSUFBSSxFQUFFLENBQUMsR0FBRztBQUNWLFFBQUEsSUFBSSxFQUFFLEdBQUc7UUFDVCxJQUFJLEVBQUUsQ0FBQyxHQUFHO0FBQ1YsUUFBQSxJQUFJLEVBQUUsRUFBRTtBQUNSLFFBQUEsSUFBSSxFQUFFLElBQUk7UUFDVixJQUFJLEVBQUUsQ0FBQyxHQUFHO0FBQ1YsUUFBQSxJQUFJLEVBQUUsR0FBRztRQUNULElBQUksRUFBRSxDQUFDLEdBQUc7QUFDVixRQUFBLElBQUksRUFBRSxHQUFHO0FBQ1QsUUFBQSxJQUFJLEVBQUUsR0FBRztBQUNULFFBQUEsSUFBSSxFQUFFLEdBQUc7QUFDVCxRQUFBLElBQUksRUFBRSxHQUFHO1FBQ1QsSUFBSSxFQUFFLENBQUMsRUFBRTtLQUNWLENBQUM7SUFDRixJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDbkUsSUFBSSxDQUFDLEtBQUssR0FBRztBQUNYLFFBQUEsSUFBSSxFQUFFLEdBQUc7UUFDVCxJQUFJLEVBQUUsQ0FBQyxJQUFJO0FBQ1gsUUFBQSxJQUFJLEVBQUUsR0FBRztRQUNULElBQUksRUFBRSxDQUFDLEdBQUc7UUFDVixJQUFJLEVBQUUsQ0FBQyxHQUFHO1FBQ1YsSUFBSSxFQUFFLENBQUMsR0FBRztRQUNWLElBQUksRUFBRSxDQUFDLEdBQUc7UUFDVixJQUFJLEVBQUUsQ0FBQyxHQUFHO0FBQ1YsUUFBQSxJQUFJLEVBQUUsR0FBRztBQUNULFFBQUEsSUFBSSxFQUFFLEdBQUc7QUFDVCxRQUFBLElBQUksRUFBRSxJQUFJO0FBQ1YsUUFBQSxJQUFJLEVBQUUsR0FBRztBQUNULFFBQUEsSUFBSSxFQUFFLEdBQUc7QUFDVCxRQUFBLElBQUksRUFBRSxHQUFHO0FBQ1QsUUFBQSxJQUFJLEVBQUUsSUFBSTtBQUNWLFFBQUEsSUFBSSxFQUFFLElBQUk7QUFDVixRQUFBLElBQUksRUFBRSxHQUFHO0FBQ1QsUUFBQSxJQUFJLEVBQUUsR0FBRztBQUNULFFBQUEsSUFBSSxFQUFFLEdBQUc7UUFDVCxJQUFJLEVBQUUsQ0FBQyxHQUFHO0tBQ1gsQ0FBQztJQUNGLElBQUksQ0FBQyxLQUFLLEdBQUc7UUFDWCxJQUFJLEVBQUUsQ0FBQyxHQUFHO1FBQ1YsSUFBSSxFQUFFLENBQUMsSUFBSTtRQUNYLElBQUksRUFBRSxDQUFDLEdBQUc7UUFDVixJQUFJLEVBQUUsQ0FBQyxHQUFHO1FBQ1YsSUFBSSxFQUFFLENBQUMsSUFBSTtRQUNYLElBQUksRUFBRSxDQUFDLElBQUk7QUFDWCxRQUFBLElBQUksRUFBRSxHQUFHO1FBQ1QsSUFBSSxFQUFFLENBQUMsR0FBRztBQUNWLFFBQUEsSUFBSSxFQUFFLElBQUk7QUFDVixRQUFBLElBQUksRUFBRSxHQUFHO1FBQ1QsSUFBSSxFQUFFLENBQUMsSUFBSTtBQUNYLFFBQUEsSUFBSSxFQUFFLElBQUk7UUFDVixJQUFJLEVBQUUsQ0FBQyxHQUFHO0FBQ1YsUUFBQSxJQUFJLEVBQUUsR0FBRztRQUNULElBQUksRUFBRSxDQUFDLElBQUk7UUFDWCxJQUFJLEVBQUUsQ0FBQyxJQUFJO0tBQ1osQ0FBQztBQUNGLElBQUEsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUM7SUFDdkMsSUFBSSxDQUFDLEtBQUssR0FBRztRQUNYLEdBQUcsRUFBRSxDQUFDLElBQUk7UUFDVixHQUFHLEVBQUUsQ0FBQyxJQUFJO1FBQ1YsR0FBRyxFQUFFLENBQUMsSUFBSTtBQUNWLFFBQUEsR0FBRyxFQUFFLElBQUk7UUFDVCxHQUFHLEVBQUUsQ0FBQyxJQUFJO1FBQ1YsR0FBRyxFQUFFLENBQUMsSUFBSTtBQUNWLFFBQUEsR0FBRyxFQUFFLElBQUk7UUFDVCxHQUFHLEVBQUUsQ0FBQyxJQUFJO1FBQ1YsR0FBRyxFQUFFLENBQUMsSUFBSTtBQUNWLFFBQUEsR0FBRyxFQUFFLElBQUk7UUFDVCxHQUFHLEVBQUUsQ0FBQyxHQUFHO1FBQ1QsR0FBRyxFQUFFLENBQUMsSUFBSTtRQUNWLEdBQUcsRUFBRSxDQUFDLElBQUk7UUFDVixHQUFHLEVBQUUsQ0FBQyxJQUFJO1FBQ1YsR0FBRyxFQUFFLENBQUMsSUFBSTtRQUNWLEdBQUcsRUFBRSxDQUFDLElBQUk7S0FDWCxDQUFDO0lBQ0YsSUFBSSxDQUFDLEtBQUssR0FBRztRQUNYLEdBQUcsRUFBRSxDQUFDLElBQUk7QUFDVixRQUFBLEdBQUcsRUFBRSxJQUFJO1FBQ1QsR0FBRyxFQUFFLENBQUMsSUFBSTtRQUNWLEdBQUcsRUFBRSxDQUFDLElBQUk7UUFDVixHQUFHLEVBQUUsQ0FBQyxJQUFJO1FBQ1YsR0FBRyxFQUFFLENBQUMsSUFBSTtRQUNWLEtBQUssRUFBRSxDQUFDLEdBQUc7UUFDWCxLQUFLLEVBQUUsQ0FBQyxHQUFHO1FBQ1gsR0FBRyxFQUFFLENBQUMsR0FBRztRQUNULEdBQUcsRUFBRSxDQUFDLElBQUk7UUFDVixHQUFHLEVBQUUsQ0FBQyxJQUFJO0tBQ1gsQ0FBQztJQUNGLElBQUksQ0FBQyxLQUFLLEdBQUc7QUFDWCxRQUFBLEtBQUssRUFBRSxJQUFJO0FBQ1gsUUFBQSxLQUFLLEVBQUUsSUFBSTtRQUNYLEdBQUcsRUFBRSxDQUFDLElBQUk7QUFDVixRQUFBLEdBQUcsRUFBRSxJQUFJO0FBQ1QsUUFBQSxLQUFLLEVBQUUsSUFBSTtBQUNYLFFBQUEsS0FBSyxFQUFFLElBQUk7QUFDWCxRQUFBLEdBQUcsRUFBRSxJQUFJO0FBQ1QsUUFBQSxHQUFHLEVBQUUsSUFBSTtBQUNULFFBQUEsR0FBRyxFQUFFLElBQUk7QUFDVCxRQUFBLEdBQUcsRUFBRSxJQUFJO1FBQ1QsR0FBRyxFQUFFLENBQUMsSUFBSTtBQUNWLFFBQUEsR0FBRyxFQUFFLElBQUk7S0FDVixDQUFDO0lBQ0YsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ2hELElBQUEsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7QUFDbkUsSUFBQSxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQztJQUNuQyxJQUFJLENBQUMsS0FBSyxHQUFHO1FBQ1gsQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtLQUNSLENBQUM7SUFDRixJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDNUQsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQzFELElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUN6QixJQUFBLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztJQUMvQixJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO0lBQ3hCLElBQUksQ0FBQyxLQUFLLEdBQUc7QUFDWCxRQUFBLEVBQUUsRUFBRSxFQUFFO1FBQ04sRUFBRSxFQUFFLENBQUMsRUFBRTtRQUNQLEVBQUUsRUFBRSxDQUFDLEVBQUU7QUFDUCxRQUFBLEVBQUUsRUFBRSxHQUFHO1FBQ1AsRUFBRSxFQUFFLENBQUMsRUFBRTtRQUNQLEVBQUUsRUFBRSxDQUFDLEVBQUU7QUFDUCxRQUFBLEVBQUUsRUFBRSxHQUFHO0FBQ1AsUUFBQSxFQUFFLEVBQUUsR0FBRztRQUNQLEVBQUUsRUFBRSxDQUFDLElBQUk7S0FDVixDQUFDO0FBQ0YsSUFBQSxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsQ0FBQztJQUM1QyxJQUFJLENBQUMsS0FBSyxHQUFHO1FBQ1gsRUFBRSxFQUFFLENBQUMsR0FBRztBQUNSLFFBQUEsRUFBRSxFQUFFLEVBQUU7QUFDTixRQUFBLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLENBQUMsSUFBSTtBQUNULFFBQUEsRUFBRSxFQUFFLElBQUk7QUFDUixRQUFBLEVBQUUsRUFBRSxJQUFJO0FBQ1IsUUFBQSxFQUFFLEVBQUUsS0FBSztRQUNULEVBQUUsRUFBRSxDQUFDLEdBQUc7UUFDUixFQUFFLEVBQUUsQ0FBQyxJQUFJO0tBQ1YsQ0FBQztJQUNGLElBQUksQ0FBQyxLQUFLLEdBQUc7QUFDWCxRQUFBLEdBQUcsRUFBRSxHQUFHO0FBQ1IsUUFBQSxHQUFHLEVBQUUsR0FBRztRQUNSLEdBQUcsRUFBRSxDQUFDLEdBQUc7UUFDVCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7QUFDUCxRQUFBLENBQUMsRUFBRSxHQUFHO0FBQ04sUUFBQSxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO0FBQ1AsUUFBQSxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLEdBQUc7QUFDUCxRQUFBLENBQUMsRUFBRSxHQUFHO0FBQ04sUUFBQSxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsR0FBRyxFQUFFLENBQUMsR0FBRztRQUNULENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztBQUNQLFFBQUEsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxHQUFHO0FBQ1AsUUFBQSxDQUFDLEVBQUUsR0FBRztBQUNOLFFBQUEsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztBQUNQLFFBQUEsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxHQUFHLEVBQUUsQ0FBQyxHQUFHO1FBQ1QsR0FBRyxFQUFFLENBQUMsR0FBRztLQUNWLENBQUM7SUFDRixJQUFJLENBQUMsS0FBSyxHQUFHO1FBQ1gsR0FBRyxFQUFFLENBQUMsR0FBRztRQUNULEdBQUcsRUFBRSxDQUFDLEdBQUc7QUFDVCxRQUFBLENBQUMsRUFBRSxHQUFHO1FBQ04sR0FBRyxFQUFFLENBQUMsR0FBRztBQUNULFFBQUEsR0FBRyxFQUFFLElBQUk7UUFDVCxDQUFDLEVBQUUsQ0FBQyxHQUFHO0FBQ1AsUUFBQSxDQUFDLEVBQUUsR0FBRztBQUNOLFFBQUEsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxHQUFHO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLEdBQUc7QUFDTixRQUFBLENBQUMsRUFBRSxHQUFHO0FBQ04sUUFBQSxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7QUFDUCxRQUFBLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLEdBQUc7QUFDTixRQUFBLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLEdBQUc7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7QUFDUCxRQUFBLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO0FBQ1AsUUFBQSxDQUFDLEVBQUUsR0FBRztBQUNOLFFBQUEsQ0FBQyxFQUFFLEdBQUc7QUFDTixRQUFBLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7QUFDUCxRQUFBLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsR0FBRztBQUNQLFFBQUEsQ0FBQyxFQUFFLEdBQUc7QUFDTixRQUFBLENBQUMsRUFBRSxHQUFHO0FBQ04sUUFBQSxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsR0FBRztBQUNOLFFBQUEsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsR0FBRztBQUNOLFFBQUEsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxHQUFHO0FBQ1AsUUFBQSxDQUFDLEVBQUUsR0FBRztBQUNOLFFBQUEsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixHQUFHLEVBQUUsQ0FBQyxHQUFHO0FBQ1QsUUFBQSxHQUFHLEVBQUUsSUFBSTtBQUNULFFBQUEsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxHQUFHO0FBQ1AsUUFBQSxDQUFDLEVBQUUsR0FBRztBQUNOLFFBQUEsQ0FBQyxFQUFFLEdBQUc7S0FDUCxDQUFDO0lBQ0YsSUFBSSxDQUFDLEtBQUssR0FBRztBQUNYLFFBQUEsR0FBRyxFQUFFLElBQUk7UUFDVCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsR0FBRyxFQUFFLENBQUMsSUFBSTtBQUNWLFFBQUEsR0FBRyxFQUFFLElBQUk7UUFDVCxDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsR0FBRyxFQUFFLElBQUk7UUFDVCxHQUFHLEVBQUUsQ0FBQyxJQUFJO1FBQ1YsQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxHQUFHO0FBQ04sUUFBQSxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLEdBQUc7QUFDUCxRQUFBLENBQUMsRUFBRSxHQUFHO0FBQ04sUUFBQSxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLEdBQUc7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO0FBQ1AsUUFBQSxDQUFDLEVBQUUsR0FBRztBQUNOLFFBQUEsQ0FBQyxFQUFFLEdBQUc7QUFDTixRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztBQUNQLFFBQUEsQ0FBQyxFQUFFLEdBQUc7QUFDTixRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxHQUFHO0FBQ04sUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsR0FBRztRQUNOLEdBQUcsRUFBRSxDQUFDLElBQUk7UUFDVixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsR0FBRztBQUNOLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxHQUFHO0FBQ04sUUFBQSxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxHQUFHO0FBQ04sUUFBQSxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxHQUFHO0FBQ04sUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLEdBQUc7QUFDTixRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxHQUFHO0FBQ04sUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsR0FBRztBQUNOLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsR0FBRztBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsR0FBRztBQUNOLFFBQUEsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO0FBQ1AsUUFBQSxDQUFDLEVBQUUsR0FBRztBQUNOLFFBQUEsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsR0FBRztBQUNQLFFBQUEsQ0FBQyxFQUFFLEdBQUc7QUFDTixRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxHQUFHO0FBQ04sUUFBQSxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLEdBQUc7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLEdBQUc7QUFDTixRQUFBLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLEdBQUc7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7UUFDUCxHQUFHLEVBQUUsQ0FBQyxHQUFHO0FBQ1QsUUFBQSxHQUFHLEVBQUUsSUFBSTtRQUNULEdBQUcsRUFBRSxDQUFDLElBQUk7UUFDVixDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsR0FBRztBQUNOLFFBQUEsRUFBRSxFQUFFLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxHQUFHO0FBQ04sUUFBQSxDQUFDLEVBQUUsR0FBRztBQUNOLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLEdBQUc7S0FDUCxDQUFDO0lBQ0YsSUFBSSxDQUFDLEtBQUssR0FBRztBQUNYLFFBQUEsR0FBRyxFQUFFLElBQUk7QUFDVCxRQUFBLEdBQUcsRUFBRSxJQUFJO1FBQ1QsR0FBRyxFQUFFLENBQUMsSUFBSTtBQUNWLFFBQUEsR0FBRyxFQUFFLElBQUk7QUFDVCxRQUFBLEdBQUcsRUFBRSxJQUFJO0FBQ1QsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsR0FBRyxFQUFFLElBQUk7QUFDVCxRQUFBLEdBQUcsRUFBRSxJQUFJO1FBQ1QsR0FBRyxFQUFFLENBQUMsSUFBSTtBQUNWLFFBQUEsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsR0FBRztBQUNOLFFBQUEsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsR0FBRztBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxHQUFHO0FBQ04sUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsS0FBSztRQUNULENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLEtBQUs7UUFDUixDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLEdBQUcsRUFBRSxDQUFDLElBQUk7UUFDVixDQUFDLEVBQUUsQ0FBQyxLQUFLO1FBQ1QsQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsR0FBRztBQUNOLFFBQUEsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsR0FBRztBQUNOLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxHQUFHO0FBQ04sUUFBQSxDQUFDLEVBQUUsR0FBRztBQUNOLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLEdBQUc7QUFDTixRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsR0FBRztBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsR0FBRztBQUNOLFFBQUEsQ0FBQyxFQUFFLEdBQUc7QUFDTixRQUFBLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLEdBQUc7QUFDTixRQUFBLENBQUMsRUFBRSxHQUFHO0FBQ04sUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLEdBQUc7QUFDTixRQUFBLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsR0FBRztBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO0FBQ1AsUUFBQSxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsR0FBRztBQUNOLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxHQUFHO0FBQ04sUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLEdBQUc7QUFDUCxRQUFBLENBQUMsRUFBRSxHQUFHO0FBQ04sUUFBQSxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztBQUNQLFFBQUEsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxHQUFHLEVBQUUsSUFBSTtBQUNULFFBQUEsR0FBRyxFQUFFLElBQUk7UUFDVCxHQUFHLEVBQUUsQ0FBQyxJQUFJO1FBQ1YsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEtBQUs7QUFDVCxRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7S0FDVCxDQUFDO0lBQ0YsSUFBSSxDQUFDLEtBQUssR0FBRztBQUNYLFFBQUEsR0FBRyxFQUFFLEdBQUc7UUFDUixHQUFHLEVBQUUsQ0FBQyxHQUFHO1FBQ1QsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLEVBQUUsRUFBRSxDQUFDLEtBQUs7UUFDVixHQUFHLEVBQUUsQ0FBQyxJQUFJO0FBQ1YsUUFBQSxHQUFHLEVBQUUsR0FBRztRQUNSLEdBQUcsRUFBRSxDQUFDLEdBQUc7QUFDVCxRQUFBLEdBQUcsRUFBRSxHQUFHO0FBQ1IsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxHQUFHO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLEdBQUc7QUFDTixRQUFBLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsR0FBRztBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLEVBQUU7QUFDTCxRQUFBLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsRUFBRTtRQUNOLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsR0FBRztBQUNOLFFBQUEsQ0FBQyxFQUFFLEdBQUc7QUFDTixRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLEdBQUc7QUFDUCxRQUFBLENBQUMsRUFBRSxHQUFHO0FBQ04sUUFBQSxDQUFDLEVBQUUsR0FBRztBQUNOLFFBQUEsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsR0FBRztBQUNOLFFBQUEsQ0FBQyxFQUFFLEdBQUc7QUFDTixRQUFBLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7QUFDUCxRQUFBLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLEdBQUc7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztBQUNQLFFBQUEsQ0FBQyxFQUFFLEdBQUc7QUFDTixRQUFBLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLEdBQUc7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxHQUFHO0FBQ04sUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxHQUFHO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLEdBQUc7QUFDTixRQUFBLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxHQUFHO0FBQ1AsUUFBQSxDQUFDLEVBQUUsR0FBRztBQUNOLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLEdBQUcsRUFBRSxDQUFDLEdBQUc7UUFDVCxFQUFFLEVBQUUsQ0FBQyxLQUFLO0FBQ1YsUUFBQSxHQUFHLEVBQUUsR0FBRztBQUNSLFFBQUEsQ0FBQyxFQUFFLEdBQUc7QUFDTixRQUFBLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsR0FBRztLQUNSLENBQUM7SUFDRixJQUFJLENBQUMsS0FBSyxHQUFHO0FBQ1gsUUFBQSxHQUFHLEVBQUUsR0FBRztBQUNSLFFBQUEsR0FBRyxFQUFFLEdBQUc7UUFDUixDQUFDLEVBQUUsQ0FBQyxHQUFHO0FBQ1AsUUFBQSxFQUFFLEVBQUUsR0FBRztBQUNQLFFBQUEsR0FBRyxFQUFFLEdBQUc7QUFDUixRQUFBLEdBQUcsRUFBRSxHQUFHO1FBQ1IsQ0FBQyxFQUFFLENBQUMsR0FBRztBQUNQLFFBQUEsQ0FBQyxFQUFFLEdBQUc7QUFDTixRQUFBLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsRUFBRTtRQUNOLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxHQUFHO0FBQ1AsUUFBQSxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO0FBQ1AsUUFBQSxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLEdBQUc7QUFDUCxRQUFBLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO0FBQ1AsUUFBQSxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLEdBQUc7QUFDUCxRQUFBLENBQUMsRUFBRSxHQUFHO0FBQ04sUUFBQSxDQUFDLEVBQUUsR0FBRztBQUNOLFFBQUEsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLEdBQUc7QUFDUCxRQUFBLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsR0FBRztBQUNQLFFBQUEsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxHQUFHO0FBQ1AsUUFBQSxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLEdBQUc7QUFDUCxRQUFBLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsR0FBRztBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxHQUFHO0FBQ04sUUFBQSxDQUFDLEVBQUUsSUFBSTtRQUNQLEdBQUcsRUFBRSxDQUFDLEdBQUc7QUFDVCxR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QUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNwQixJQUFJLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ3BCLFFBQUEsSUFBSSxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2hCLElBQUksRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDcEIsSUFBSSxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNwQixJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDdEIsSUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUN0QixRQUFBLElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsQixJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDdEIsUUFBQSxLQUFLLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDbEMsUUFBQSxLQUFLLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDbEMsUUFBQSxLQUFLLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDbEMsUUFBQSxLQUFLLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3ZDLFFBQUEsS0FBSyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN2QyxRQUFBLEtBQUssSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNsQyxRQUFBLEtBQUssSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNsQyxRQUFBLEtBQUssSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNsQyxRQUFBLEtBQUssSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNsQyxRQUFBLEtBQUssSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNsQyxRQUFBLEtBQUssSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNsQyxRQUFBLEtBQUssSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDdkMsUUFBQSxLQUFLLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3ZDLFFBQUEsS0FBSyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN2QyxRQUFBLEtBQUssSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzVDLFFBQUEsS0FBSyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDNUMsUUFBQSxLQUFLLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUM1QyxRQUFBLEtBQUssSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzVDLFFBQUEsS0FBSyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2xDLFFBQUEsS0FBSyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2xDLFFBQUEsS0FBSyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2xDLFFBQUEsS0FBSyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2xDLFFBQUEsS0FBSyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2xDLFFBQUEsS0FBSyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2xDLFFBQUEsS0FBSyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN2QyxRQUFBLEtBQUssSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDdkMsUUFBQSxLQUFLLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3ZDLFFBQUEsS0FBSyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDNUMsUUFBQSxLQUFLLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUM1QyxRQUFBLEtBQUssSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzVDLFFBQUEsS0FBSyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7O0FBRTVDLFFBQUEsS0FBSyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN2QyxRQUFBLEtBQUssSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDdkMsUUFBQSxLQUFLLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3ZDLFFBQUEsS0FBSyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDNUMsUUFBQSxLQUFLLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUM1QyxRQUFBLEtBQUssSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzVDLFFBQUEsS0FBSyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDNUMsUUFBQSxLQUFLLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDakQsUUFBQSxLQUFLLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDakQsUUFBQSxLQUFLLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDakQsUUFBQSxLQUFLLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDakQsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDO1FB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TUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxLQUFBLENBQUEsR0FBQSxFQUFBLEdBQUksRUFBRSxDQUFDO0FBQ3BELGdCQUFBLElBQUksQ0FBQSxFQUFBLEdBQUEsWUFBWSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLE1BQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxLQUFBLENBQUEsR0FBQSxFQUFBLEdBQUksRUFBRSxDQUFDO0FBQ2xFLGdCQUFBLElBQUksQ0FBQSxFQUFBLEdBQUEsWUFBWSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxLQUFBLENBQUEsR0FBQSxFQUFBLEdBQUksRUFBRSxDQUFDO0FBQ3JELGdCQUFBLElBQUksQ0FBQSxFQUFBLEdBQUEsWUFBWSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLE1BQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxLQUFBLENBQUEsR0FBQSxFQUFBLEdBQUksRUFBRSxDQUFDO0FBQ25FLGdCQUFBLElBQUksQ0FBQSxFQUFBLEdBQUEsWUFBWSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLEtBQUEsQ0FBQSxHQUFBLEVBQUEsR0FBSSxFQUFFLENBQUM7QUFDekQsZ0JBQUEsSUFBSSxDQUFBLEVBQUEsR0FBQSxZQUFZLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxNQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsS0FBQSxDQUFBLEdBQUEsRUFBQSxHQUM5RCxFQUFFLENBQUM7QUFDTCxnQkFBQSxJQUFJLENBQUEsRUFBQSxHQUFB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
