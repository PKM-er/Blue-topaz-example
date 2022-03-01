'use strict';

var obsidian = require('obsidian');

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

function createTokenizer(strategy) {
    switch (strategy.name) {
        case "default":
            return new DefaultTokenizer();
        case "english-only":
            return new EnglishOnlyTokenizer();
        case "arabic":
            return new ArabicTokenizer();
        case "japanese":
            return new JapaneseTokenizer();
        default:
            throw new Error(`Unexpected strategy name: ${strategy}`);
    }
}

class TokenizeStrategy {
    constructor(name, triggerThreshold) {
        this.name = name;
        this.triggerThreshold = triggerThreshold;
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
TokenizeStrategy.DEFAULT = new TokenizeStrategy("default", 3);
TokenizeStrategy.ENGLISH_ONLY = new TokenizeStrategy("english-only", 3);
TokenizeStrategy.JAPANESE = new TokenizeStrategy("japanese", 2);
TokenizeStrategy.ARABIC = new TokenizeStrategy("arabic", 3);

class AppHelper {
    constructor(app) {
        this.app = app;
    }
    equalsAsEditorPostion(one, other) {
        return one.line === other.line && one.ch === other.ch;
    }
    getAliases(file) {
        var _a, _b;
        return ((_b = obsidian.parseFrontMatterAliases((_a = this.app.metadataCache.getFileCache(file)) === null || _a === void 0 ? void 0 : _a.frontmatter)) !== null && _b !== void 0 ? _b : []);
    }
    getFrontMatter(file) {
        var _a, _b, _c, _d;
        const frontMatter = (_a = this.app.metadataCache.getFileCache(file)) === null || _a === void 0 ? void 0 : _a.frontmatter;
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
        if (!this.app.workspace.getActiveViewOfType(obsidian.MarkdownView)) {
            return null;
        }
        return this.app.workspace.activeLeaf.view;
    }
    getActiveFile() {
        return this.app.workspace.getActiveFile();
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
    searchPhantomLinks() {
        return Object.entries(this.app.metadataCache.unresolvedLinks).flatMap(([path, obj]) => Object.keys(obj).map((link) => ({ path, link })));
    }
    getMarkdownFileByPath(path) {
        if (!path.endsWith(".md")) {
            return null;
        }
        const abstractFile = this.app.vault.getAbstractFileByPath(path);
        if (!abstractFile) {
            return null;
        }
        return abstractFile;
    }
    openMarkdownFile(file, newLeaf, offset = 0) {
        var _a;
        const leaf = this.app.workspace.getLeaf(newLeaf);
        leaf
            .openFile(file, (_a = this.app.workspace.activeLeaf) === null || _a === void 0 ? void 0 : _a.getViewState())
            .then(() => {
            this.app.workspace.setActiveLeaf(leaf, true, true);
            const viewOfType = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
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
        if (!this.app.workspace.getActiveViewOfType(obsidian.MarkdownView)) {
            return false;
        }
        const markdownView = this.app.workspace.activeLeaf.view;
        const cm5or6 = markdownView.editor.cm;
        // cm6
        if (((_a = cm5or6 === null || cm5or6 === void 0 ? void 0 : cm5or6.inputState) === null || _a === void 0 ? void 0 : _a.composing) > 0) {
            return true;
        }
        // cm5
        return !!((_c = (_b = cm5or6 === null || cm5or6 === void 0 ? void 0 : cm5or6.display) === null || _b === void 0 ? void 0 : _b.input) === null || _c === void 0 ? void 0 : _c.composing);
    }
}

const groupBy = (values, toKey) => values.reduce((prev, cur, _1, _2, k = toKey(cur)) => ((prev[k] || (prev[k] = [])).push(cur), prev), {});
function uniq(values) {
    return [...new Set(values)];
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
        return { word, value: word.value, alias: false };
    }
    if (lowerStartsWith(word.value, query)) {
        if (queryStartWithUpper &&
            word.type !== "internalLink" &&
            word.type !== "frontMatter") {
            const c = capitalizeFirstLetter(word.value);
            return { word: Object.assign(Object.assign({}, word), { value: c }), value: c, alias: false };
        }
        else {
            return { word: word, value: word.value, alias: false };
        }
    }
    const matchedAlias = (_a = word.aliases) === null || _a === void 0 ? void 0 : _a.find((a) => lowerStartsWith(a, query));
    if (matchedAlias) {
        return {
            word: Object.assign({}, word),
            value: matchedAlias,
            alias: true,
        };
    }
    return { word: word, alias: false };
}
function suggestWords(indexedWords, query, max, frontMatter) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
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
                ...((_k = indexedWords.currentVault[query.charAt(0)]) !== null && _k !== void 0 ? _k : []),
                ...((_l = indexedWords.customDictionary[query.charAt(0)]) !== null && _l !== void 0 ? _l : []),
                ...((_m = indexedWords.internalLink[query.charAt(0)]) !== null && _m !== void 0 ? _m : []),
                ...((_o = indexedWords.internalLink[query.charAt(0).toUpperCase()]) !== null && _o !== void 0 ? _o : []),
            ];
    const candidate = Array.from(words)
        .map((x) => judge(x, query, queryStartWithUpper))
        .filter((x) => x.value !== undefined)
        .sort((a, b) => {
        const notSameWordType = a.word.type !== b.word.type;
        if (frontMatter && notSameWordType) {
            return b.word.type === "frontMatter" ? 1 : -1;
        }
        if (a.value.length !== b.value.length) {
            return a.value.length > b.value.length ? 1 : -1;
        }
        if (notSameWordType) {
            return WordTypeMeta.of(b.word.type).priority >
                WordTypeMeta.of(a.word.type).priority
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
        return { word, value: word.value, alias: false };
    }
    if (lowerStartsWith(word.value, query)) {
        if (queryStartWithUpper &&
            word.type !== "internalLink" &&
            word.type !== "frontMatter") {
            const c = capitalizeFirstLetter(word.value);
            return { word: Object.assign(Object.assign({}, word), { value: c }), value: c, alias: false };
        }
        else {
            return { word: word, value: word.value, alias: false };
        }
    }
    const matchedAliasStarts = (_a = word.aliases) === null || _a === void 0 ? void 0 : _a.find((a) => lowerStartsWith(a, query));
    if (matchedAliasStarts) {
        return {
            word: Object.assign({}, word),
            value: matchedAliasStarts,
            alias: true,
        };
    }
    if (lowerIncludes(word.value, query)) {
        return { word: word, value: word.value, alias: false };
    }
    const matchedAliasIncluded = (_b = word.aliases) === null || _b === void 0 ? void 0 : _b.find((a) => lowerIncludes(a, query));
    if (matchedAliasIncluded) {
        return {
            word: Object.assign({}, word),
            value: matchedAliasIncluded,
            alias: true,
        };
    }
    return { word: word, alias: false };
}
function suggestWordsByPartialMatch(indexedWords, query, max, frontMatter) {
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
        const notSameWordType = a.word.type !== b.word.type;
        if (frontMatter && notSameWordType) {
            return b.word.type === "frontMatter" ? 1 : -1;
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
            return WordTypeMeta.of(b.word.type).priority >
                WordTypeMeta.of(a.word.type).priority
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
function lineToWord(line, delimiter, path) {
    const [value, description, ...aliases] = line.split(delimiter.value);
    return {
        value: unescape(value),
        description,
        aliases,
        type: "customDictionary",
        createdPath: path,
    };
}
function wordToLine(word, delimiter) {
    const escapedValue = escape(word.value);
    if (!word.description && !word.aliases) {
        return escapedValue;
    }
    if (!word.aliases) {
        return [escapedValue, word.description].join(delimiter.value);
    }
    return [escapedValue, word.description, ...word.aliases].join(delimiter.value);
}
class CustomDictionaryWordProvider {
    constructor(app) {
        this.words = [];
        this.wordByValue = {};
        this.wordsByFirstLetter = {};
        this.app = app;
        this.fileSystemAdapter = app.vault.adapter;
    }
    get editablePaths() {
        return this.paths.filter((x) => !isURL(x));
    }
    loadWords(path, regexp) {
        return __awaiter(this, void 0, void 0, function* () {
            const contents = isURL(path)
                ? yield obsidian.request({ url: path })
                : yield this.fileSystemAdapter.read(path);
            return contents
                .split(/\r\n|\n/)
                .map((x) => x.replace(/%%.*%%/g, ""))
                .filter((x) => x)
                .map((x) => lineToWord(x, this.delimiter, path))
                .filter((x) => !regexp || x.value.match(new RegExp(regexp)));
        });
    }
    refreshCustomWords(regexp) {
        return __awaiter(this, void 0, void 0, function* () {
            this.clearWords();
            for (const path of this.paths) {
                try {
                    const words = yield this.loadWords(path, regexp);
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
            yield this.fileSystemAdapter.append(dictionaryPath, "\n" + wordToLine(word, this.delimiter));
        });
    }
    addWord(word) {
        var _a;
        this.wordByValue[word.value] = word;
        pushWord(this.wordsByFirstLetter, word.value.charAt(0), word);
        (_a = word.aliases) === null || _a === void 0 ? void 0 : _a.forEach((a) => pushWord(this.wordsByFirstLetter, a.charAt(0), word));
    }
    clearWords() {
        this.words = [];
        this.wordByValue = {};
        this.wordsByFirstLetter = {};
    }
    get wordCount() {
        return this.words.length;
    }
    setSettings(paths, delimiter) {
        this.paths = paths;
        this.delimiter = delimiter;
    }
}

class CurrentFileWordProvider {
    constructor(app, appHelper) {
        this.app = app;
        this.appHelper = appHelper;
        this.wordsByFirstLetter = {};
        this.words = [];
    }
    refreshWords(onlyEnglish) {
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
            const tokens = onlyEnglish
                ? this.tokenizer.tokenize(content).filter(allAlphabets)
                : this.tokenizer.tokenize(content);
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
    refreshWords(wordAsInternalLinkAlias) {
        var _a;
        this.clearWords();
        const synonymAliases = (name) => {
            const lessEmojiValue = excludeEmoji(name);
            return name === lessEmojiValue ? [] : [lessEmojiValue];
        };
        const resolvedInternalLinkWords = this.app.vault
            .getMarkdownFiles()
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

class CurrentVaultWordProvider {
    constructor(app, appHelper) {
        this.app = app;
        this.appHelper = appHelper;
        this.wordsByFirstLetter = {};
        this.words = [];
    }
    refreshWords() {
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
                for (const token of this.tokenizer.tokenize(content)) {
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
class FrontMatterWordProvider {
    constructor(app, appHelper) {
        this.app = app;
        this.appHelper = appHelper;
    }
    refreshWords() {
        this.clearWords();
        const activeFile = this.appHelper.getActiveFile();
        const words = this.app.vault.getMarkdownFiles().flatMap((f) => {
            const fm = this.appHelper.getFrontMatter(f);
            if (!fm || (activeFile === null || activeFile === void 0 ? void 0 : activeFile.path) === f.path) {
                return [];
            }
            return Object.entries(fm)
                .filter(([_key, value]) => value != null &&
                (typeof value === "string" || typeof value[0] === "string"))
                .flatMap(([key, value]) => frontMatterToWords(f, key, value));
        });
        this.words = uniqWith(words, (a, b) => a.key === b.key && a.value === b.value);
        const wordsByKey = groupBy(this.words, (x) => x.key);
        this.wordsByFirstLetterByKey = Object.fromEntries(Object.entries(wordsByKey).map(([key, words]) => [
            key,
            groupBy(words, (w) => w.value.charAt(0)),
        ]));
    }
    clearWords() {
        this.words = [];
        this.wordsByFirstLetterByKey = {};
    }
    get wordCount() {
        return this.words.length;
    }
}

const neverUsedHandler = (...args) => [];
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

function buildLogMessage(message, msec) {
    return `${message}: ${Math.round(msec)}[ms]`;
}
class AutoCompleteSuggest extends obsidian.EditorSuggest {
    constructor(app, statusBar) {
        super(app);
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
    static new(app, settings, statusBar) {
        return __awaiter(this, void 0, void 0, function* () {
            const ins = new AutoCompleteSuggest(app, statusBar);
            ins.currentFileWordProvider = new CurrentFileWordProvider(ins.app, ins.appHelper);
            ins.currentVaultWordProvider = new CurrentVaultWordProvider(ins.app, ins.appHelper);
            ins.customDictionaryWordProvider = new CustomDictionaryWordProvider(ins.app);
            ins.internalLinkWordProvider = new InternalLinkWordProvider(ins.app, ins.appHelper);
            ins.frontMatterWordProvider = new FrontMatterWordProvider(ins.app, ins.appHelper);
            yield ins.updateSettings(settings);
            ins.modifyEventRef = app.vault.on("modify", (_) => __awaiter(this, void 0, void 0, function* () {
                yield ins.refreshCurrentFileTokens();
            }));
            ins.activeLeafChangeRef = app.workspace.on("active-leaf-change", (_) => __awaiter(this, void 0, void 0, function* () {
                yield ins.refreshCurrentFileTokens();
                ins.refreshInternalLinkTokens();
                ins.refreshFrontMatterTokens();
            }));
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
    get descriptionOnSuggestion() {
        return DescriptionOnSuggestion.fromName(this.settings.descriptionOnSuggestion);
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
            this.tokenizer = createTokenizer(this.tokenizerStrategy);
            this.currentFileWordProvider.setSettings(this.tokenizer);
            this.currentVaultWordProvider.setSettings(this.tokenizer, settings.includeCurrentVaultPathPrefixPatterns
                .split("\n")
                .filter((x) => x), settings.excludeCurrentVaultPathPrefixPatterns
                .split("\n")
                .filter((x) => x), settings.includeCurrentVaultOnlyFilesUnderCurrentDirectory);
            this.customDictionaryWordProvider.setSettings(settings.customDictionaryPaths.split("\n").filter((x) => x), ColumnDelimiter.fromName(settings.columnDelimiter));
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
                    return handler(this.indexedWords, q.word, this.settings.maxNumberOfSuggestions, parsedQuery.currentFrontMatter).map((word) => (Object.assign(Object.assign({}, word), { offset: q.offset })));
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
        // Clear
        this.keymapEventHandler.forEach((x) => this.scope.unregister(x));
        this.keymapEventHandler = [];
        this.scope.unregister(this.scope.keys.find((x) => x.key === "Enter"));
        const selectSuggestionKey = SelectSuggestionKey.fromName(this.settings.selectSuggestionKeys);
        if (selectSuggestionKey !== SelectSuggestionKey.ENTER) {
            this.keymapEventHandler.push(this.scope.register(SelectSuggestionKey.ENTER.keyBind.modifiers, SelectSuggestionKey.ENTER.keyBind.key, () => {
                this.close();
                return true;
            }));
        }
        if (selectSuggestionKey !== SelectSuggestionKey.TAB) {
            this.keymapEventHandler.push(this.scope.register(SelectSuggestionKey.TAB.keyBind.modifiers, SelectSuggestionKey.TAB.keyBind.key, () => {
                this.close();
                return true;
            }));
        }
        this.keymapEventHandler.push(this.scope.register(selectSuggestionKey.keyBind.modifiers, selectSuggestionKey.keyBind.key, () => {
            this.suggestions.useSelectedItem({});
            return false;
        }));
        this.scope.keys.find((x) => x.key === "Escape").func = () => {
            this.close();
            return this.settings.propagateEsc;
        };
        const cycleThroughSuggestionsKeys = CycleThroughSuggestionsKeys.fromName(this.settings.additionalCycleThroughSuggestionsKeys);
        if (cycleThroughSuggestionsKeys !== CycleThroughSuggestionsKeys.NONE) {
            if (cycleThroughSuggestionsKeys === CycleThroughSuggestionsKeys.TAB) {
                this.scope.unregister(this.scope.keys.find((x) => x.modifiers === "" && x.key === "Tab"));
            }
            this.keymapEventHandler.push(this.scope.register(cycleThroughSuggestionsKeys.nextKey.modifiers, cycleThroughSuggestionsKeys.nextKey.key, () => {
                this.suggestions.setSelectedItem(this.suggestions.selectedItem + 1, true);
                return false;
            }), this.scope.register(cycleThroughSuggestionsKeys.previousKey.modifiers, cycleThroughSuggestionsKeys.previousKey.key, () => {
                this.suggestions.setSelectedItem(this.suggestions.selectedItem - 1, true);
                return false;
            }));
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
            yield this.currentFileWordProvider.refreshWords(this.settings.onlyComplementEnglishOnCurrentFileComplement);
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
            yield this.currentVaultWordProvider.refreshWords();
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
            yield this.customDictionaryWordProvider.refreshCustomWords(this.settings.customDictionaryWordRegexPattern);
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
        this.internalLinkWordProvider.refreshWords(this.settings.suggestInternalLinkWithAlias);
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
        if (/^[:\/^]/.test(currentTokenSeparatedWhiteSpace)) {
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
        base.createDiv({
            text: this.settings.delimiterToHideSuggestion &&
                text.includes(this.settings.delimiterToHideSuggestion)
                ? `${text.split(this.settings.delimiterToHideSuggestion)[0]} ...`
                : text,
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
        if (!this.context) {
            return;
        }
        let insertedText = word.value;
        if (word.type === "internalLink") {
            insertedText =
                this.settings.suggestInternalLinkWithAlias && word.aliasMeta
                    ? `[[${word.aliasMeta.origin}|${word.value}]]`
                    : `[[${word.value}]]`;
        }
        if (word.type === "frontMatter" &&
            this.settings.insertCommaAfterFrontMatterCompletion) {
            insertedText = `${insertedText}, `;
        }
        else {
            if (this.settings.insertAfterCompletion) {
                insertedText = `${insertedText} `;
            }
        }
        if (this.settings.delimiterToHideSuggestion) {
            insertedText = insertedText.replace(this.settings.delimiterToHideSuggestion, "");
        }
        const caret = this.settings.caretLocationSymbolAfterComplement;
        const positionToMove = caret ? insertedText.indexOf(caret) : -1;
        if (positionToMove !== -1) {
            insertedText = insertedText.replace(caret, "");
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
    // appearance
    showMatchStrategy: true,
    showIndexingStatus: true,
    descriptionOnSuggestion: "Short",
    // key customization
    selectSuggestionKeys: "Enter",
    additionalCycleThroughSuggestionsKeys: "None",
    openSourceFileKey: "None",
    propagateEsc: false,
    // current file complement
    enableCurrentFileComplement: true,
    onlyComplementEnglishOnCurrentFileComplement: false,
    // current vault complement
    enableCurrentVaultComplement: false,
    includeCurrentVaultPathPrefixPatterns: "",
    excludeCurrentVaultPathPrefixPatterns: "",
    includeCurrentVaultOnlyFilesUnderCurrentDirectory: false,
    // custom dictionary complement
    enableCustomDictionaryComplement: false,
    customDictionaryPaths: `https://raw.githubusercontent.com/first20hours/google-10000-english/master/google-10000-english-no-swears.txt`,
    columnDelimiter: "Tab",
    customDictionaryWordRegexPattern: "",
    delimiterToHideSuggestion: "",
    caretLocationSymbolAfterComplement: "",
    // internal link complement
    enableInternalLinkComplement: true,
    suggestInternalLinkWithAlias: false,
    // front matter complement
    enableFrontMatterComplement: true,
    frontMatterComplementMatchStrategy: "inherit",
    insertCommaAfterFrontMatterCompletion: false,
    // debug
    showLogAboutPerformanceInConsole: false,
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
        containerEl.createEl("h3", { text: "Main" });
        new obsidian.Setting(containerEl).setName("Strategy").addDropdown((tc) => tc
            .addOptions(TokenizeStrategy.values().reduce((p, c) => (Object.assign(Object.assign({}, p), { [c.name]: c.name })), {}))
            .setValue(this.plugin.settings.strategy)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            this.plugin.settings.strategy = value;
            yield this.plugin.saveSettings({
                currentFile: true,
                currentVault: true,
            });
        })));
        new obsidian.Setting(containerEl).setName("Match strategy").addDropdown((tc) => tc
            .addOptions(MatchStrategy.values().reduce((p, c) => (Object.assign(Object.assign({}, p), { [c.name]: c.name })), {}))
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
            .addOptions(CycleThroughSuggestionsKeys.values().reduce((p, c) => (Object.assign(Object.assign({}, p), { [c.name]: c.name })), {}))
            .setValue(this.plugin.settings.additionalCycleThroughSuggestionsKeys)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            this.plugin.settings.additionalCycleThroughSuggestionsKeys = value;
            yield this.plugin.saveSettings();
        })));
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
                .setName("Only complement English on current file complement")
                .addToggle((tc) => {
                tc.setValue(this.plugin.settings.onlyComplementEnglishOnCurrentFileComplement).onChange((value) => __awaiter(this, void 0, void 0, function* () {
                    this.plugin.settings.onlyComplementEnglishOnCurrentFileComplement =
                        value;
                    yield this.plugin.saveSettings({ currentFile: true });
                }));
            });
        }
        containerEl.createEl("h3", {
            text: "Current vault complement",
            cls: "various-complements__settings__header various-complements__settings__header__current-vault",
        });
        new obsidian.Setting(containerEl)
            .setName("Enable Current vault complement")
            .addToggle((tc) => {
            tc.setValue(this.plugin.settings.enableCurrentVaultComplement).onChange((value) => __awaiter(this, void 0, void 0, function* () {
                this.plugin.settings.enableCurrentVaultComplement = value;
                yield this.plugin.saveSettings({ currentVault: true });
                this.display();
            }));
        });
        if (this.plugin.settings.enableCurrentVaultComplement) {
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
                .addOptions(ColumnDelimiter.values().reduce((p, c) => (Object.assign(Object.assign({}, p), { [c.name]: c.name })), {}))
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
                .setDesc("If set ';;;', 'abcd;;;efg' is shown as 'abcd' on suggestions, but complements to 'abcdefg'.")
                .addText((cb) => {
                cb.setValue(this.plugin.settings.delimiterToHideSuggestion).onChange((value) => __awaiter(this, void 0, void 0, function* () {
                    this.plugin.settings.delimiterToHideSuggestion = value;
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
        }
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
        }
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
    getPluginSettingsAsJsonString() {
        return JSON.stringify({
            version: this.plugin.manifest.version,
            mobile: this.app.isMobile,
            settings: this.plugin.settings,
        }, null, 4);
    }
}

class CustomDictionaryWordRegisterModal extends obsidian.Modal {
    constructor(app, dictionaryPaths, initialValue = "", onClickAdd) {
        super(app);
        const appHelper = new AppHelper(app);
        this.currentDictionaryPath = dictionaryPaths[0];
        this.value = initialValue;
        this.titleEl.setText("Add a word to a custom dictionary");
        const { contentEl } = this;
        contentEl.empty();
        contentEl.createEl("h4", { text: "Dictionary" });
        new obsidian.DropdownComponent(contentEl)
            .addOptions(mirrorMap(dictionaryPaths, (x) => x))
            .onChange((v) => {
            this.currentDictionaryPath = v;
        });
        this.openFileButton = new obsidian.ExtraButtonComponent(contentEl)
            .setIcon("enter")
            .setTooltip("Open the file")
            .onClick(() => {
            const markdownFile = appHelper.getMarkdownFileByPath(this.currentDictionaryPath);
            if (!markdownFile) {
                new obsidian.Notice(`Can't open ${this.currentDictionaryPath}`);
                return;
            }
            this.close();
            appHelper.openMarkdownFile(markdownFile, true);
        });
        this.openFileButton.extraSettingsEl.setAttribute("style", "display: inline");
        contentEl.createEl("h4", { text: "Word" });
        this.wordTextArea = new obsidian.TextAreaComponent(contentEl)
            .setValue(this.value)
            .onChange((v) => {
            this.value = v;
            this.button.setDisabled(!v);
            if (v) {
                this.button.setCta();
            }
            else {
                this.button.removeCta();
            }
        });
        this.wordTextArea.inputEl.setAttribute("style", "min-width: 100%;");
        contentEl.createEl("h4", { text: "Description" });
        new obsidian.TextComponent(contentEl)
            .onChange((v) => {
            this.description = v;
        })
            .inputEl.setAttribute("style", "min-width: 100%;");
        contentEl.createEl("h4", { text: "Aliases (for each line)" });
        new obsidian.TextAreaComponent(contentEl)
            .onChange((v) => {
            this.aliases = v.split("\n");
        })
            .inputEl.setAttribute("style", "min-width: 100%;");
        this.button = new obsidian.ButtonComponent(contentEl.createEl("div", {
            attr: {
                style: "display: flex; justify-content: center; margin-top: 15px",
            },
        }))
            .setButtonText("Add to dictionary")
            .setCta()
            .setDisabled(!this.value)
            .onClick(() => {
            onClickAdd(this.currentDictionaryPath, {
                value: this.value,
                description: this.description,
                createdPath: this.currentDictionaryPath,
                aliases: this.aliases,
                type: "customDictionary",
            });
        });
        if (this.value) {
            this.button.setCta();
        }
        else {
            this.button.removeCta();
        }
    }
}

class ProviderStatusBar {
    constructor(currentFile, currentVault, customDictionary, internalLink, frontMatter, matchStrategy) {
        this.currentFile = currentFile;
        this.currentVault = currentVault;
        this.customDictionary = customDictionary;
        this.internalLink = internalLink;
        this.frontMatter = frontMatter;
        this.matchStrategy = matchStrategy;
    }
    static new(statusBar, showMatchStrategy, showIndexingStatus) {
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
        return new ProviderStatusBar(currentFile, currentVault, customDictionary, internalLink, frontMatter, matchStrategy);
    }
    setOnClickStrategyListener(listener) {
        var _a;
        (_a = this.matchStrategy) === null || _a === void 0 ? void 0 : _a.addEventListener("click", listener);
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
            this.statusBar = ProviderStatusBar.new(this.addStatusBarItem(), this.settings.showMatchStrategy, this.settings.showIndexingStatus);
            this.statusBar.setOnClickStrategyListener(() => __awaiter(this, void 0, void 0, function* () {
                yield this.settingTab.toggleMatchStrategy();
            }));
            this.suggester = yield AutoCompleteSuggest.new(this.app, this.settings, this.statusBar);
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
                hotkeys: [{ modifiers: ["Shift"], key: " " }],
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
        const modal = new CustomDictionaryWordRegisterModal(this.app, provider.editablePaths, selectedWord, (dictionaryPath, word) => __awaiter(this, void 0, void 0, function* () {
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
        if (selectedWord) {
            modal.button.buttonEl.focus();
        }
        else {
            modal.wordTextArea.inputEl.focus();
        }
    }
}

module.exports = VariousComponents;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsInNyYy91dGlsL3N0cmluZ3MudHMiLCJzcmMvdG9rZW5pemVyL3Rva2VuaXplcnMvRGVmYXVsdFRva2VuaXplci50cyIsInNyYy90b2tlbml6ZXIvdG9rZW5pemVycy9BcmFiaWNUb2tlbml6ZXIudHMiLCJzcmMvZXh0ZXJuYWwvdGlueS1zZWdtZW50ZXIudHMiLCJzcmMvdG9rZW5pemVyL3Rva2VuaXplcnMvSmFwYW5lc2VUb2tlbml6ZXIudHMiLCJzcmMvdG9rZW5pemVyL3Rva2VuaXplcnMvRW5nbGlzaE9ubHlUb2tlbml6ZXIudHMiLCJzcmMvdG9rZW5pemVyL3Rva2VuaXplci50cyIsInNyYy90b2tlbml6ZXIvVG9rZW5pemVTdHJhdGVneS50cyIsInNyYy9hcHAtaGVscGVyLnRzIiwic3JjL3V0aWwvY29sbGVjdGlvbi1oZWxwZXIudHMiLCJzcmMvbW9kZWwvV29yZC50cyIsInNyYy9wcm92aWRlci9zdWdnZXN0ZXIudHMiLCJzcmMvdXRpbC9wYXRoLnRzIiwic3JjL3Byb3ZpZGVyL0N1c3RvbURpY3Rpb25hcnlXb3JkUHJvdmlkZXIudHMiLCJzcmMvcHJvdmlkZXIvQ3VycmVudEZpbGVXb3JkUHJvdmlkZXIudHMiLCJzcmMvcHJvdmlkZXIvSW50ZXJuYWxMaW5rV29yZFByb3ZpZGVyLnRzIiwic3JjL3Byb3ZpZGVyL01hdGNoU3RyYXRlZ3kudHMiLCJzcmMvb3B0aW9uL0N5Y2xlVGhyb3VnaFN1Z2dlc3Rpb25zS2V5cy50cyIsInNyYy9vcHRpb24vQ29sdW1uRGVsaW1pdGVyLnRzIiwic3JjL29wdGlvbi9TZWxlY3RTdWdnZXN0aW9uS2V5LnRzIiwic3JjL3Byb3ZpZGVyL0N1cnJlbnRWYXVsdFdvcmRQcm92aWRlci50cyIsInNyYy9vcHRpb24vT3BlblNvdXJjZUZpbGVLZXlzLnRzIiwic3JjL29wdGlvbi9EZXNjcmlwdGlvbk9uU3VnZ2VzdGlvbi50cyIsInNyYy9wcm92aWRlci9Gcm9udE1hdHRlcldvcmRQcm92aWRlci50cyIsInNyYy9wcm92aWRlci9TcGVjaWZpY01hdGNoU3RyYXRlZ3kudHMiLCJzcmMvdWkvQXV0b0NvbXBsZXRlU3VnZ2VzdC50cyIsInNyYy9zZXR0aW5ncy50cyIsInNyYy91aS9DdXN0b21EaWN0aW9uYXJ5V29yZFJlZ2lzdGVyTW9kYWwudHMiLCJzcmMvdWkvUHJvdmlkZXJTdGF0dXNCYXIudHMiLCJzcmMvbWFpbi50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiEgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uXHJcblxyXG5QZXJtaXNzaW9uIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBhbmQvb3IgZGlzdHJpYnV0ZSB0aGlzIHNvZnR3YXJlIGZvciBhbnlcclxucHVycG9zZSB3aXRoIG9yIHdpdGhvdXQgZmVlIGlzIGhlcmVieSBncmFudGVkLlxyXG5cclxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiBBTkQgVEhFIEFVVEhPUiBESVNDTEFJTVMgQUxMIFdBUlJBTlRJRVMgV0lUSFxyXG5SRUdBUkQgVE8gVEhJUyBTT0ZUV0FSRSBJTkNMVURJTkcgQUxMIElNUExJRUQgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFlcclxuQU5EIEZJVE5FU1MuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1IgQkUgTElBQkxFIEZPUiBBTlkgU1BFQ0lBTCwgRElSRUNULFxyXG5JTkRJUkVDVCwgT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTIE9SIEFOWSBEQU1BR0VTIFdIQVRTT0VWRVIgUkVTVUxUSU5HIEZST01cclxuTE9TUyBPRiBVU0UsIERBVEEgT1IgUFJPRklUUywgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIE5FR0xJR0VOQ0UgT1JcclxuT1RIRVIgVE9SVElPVVMgQUNUSU9OLCBBUklTSU5HIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFVTRSBPUlxyXG5QRVJGT1JNQU5DRSBPRiBUSElTIFNPRlRXQVJFLlxyXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xyXG4vKiBnbG9iYWwgUmVmbGVjdCwgUHJvbWlzZSAqL1xyXG5cclxudmFyIGV4dGVuZFN0YXRpY3MgPSBmdW5jdGlvbihkLCBiKSB7XHJcbiAgICBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XHJcbiAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChiLCBwKSkgZFtwXSA9IGJbcF07IH07XHJcbiAgICByZXR1cm4gZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4dGVuZHMoZCwgYikge1xyXG4gICAgaWYgKHR5cGVvZiBiICE9PSBcImZ1bmN0aW9uXCIgJiYgYiAhPT0gbnVsbClcclxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2xhc3MgZXh0ZW5kcyB2YWx1ZSBcIiArIFN0cmluZyhiKSArIFwiIGlzIG5vdCBhIGNvbnN0cnVjdG9yIG9yIG51bGxcIik7XHJcbiAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgX19hc3NpZ24gPSBmdW5jdGlvbigpIHtcclxuICAgIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiBfX2Fzc2lnbih0KSB7XHJcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XHJcbiAgICAgICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSkgdFtwXSA9IHNbcF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3Jlc3QocywgZSkge1xyXG4gICAgdmFyIHQgPSB7fTtcclxuICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSAmJiBlLmluZGV4T2YocCkgPCAwKVxyXG4gICAgICAgIHRbcF0gPSBzW3BdO1xyXG4gICAgaWYgKHMgIT0gbnVsbCAmJiB0eXBlb2YgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyA9PT0gXCJmdW5jdGlvblwiKVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBwID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhzKTsgaSA8IHAubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKGUuaW5kZXhPZihwW2ldKSA8IDAgJiYgT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHMsIHBbaV0pKVxyXG4gICAgICAgICAgICAgICAgdFtwW2ldXSA9IHNbcFtpXV07XHJcbiAgICAgICAgfVxyXG4gICAgcmV0dXJuIHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2RlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKSB7XHJcbiAgICB2YXIgYyA9IGFyZ3VtZW50cy5sZW5ndGgsIHIgPSBjIDwgMyA/IHRhcmdldCA6IGRlc2MgPT09IG51bGwgPyBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkgOiBkZXNjLCBkO1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0LmRlY29yYXRlID09PSBcImZ1bmN0aW9uXCIpIHIgPSBSZWZsZWN0LmRlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKTtcclxuICAgIGVsc2UgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIGlmIChkID0gZGVjb3JhdG9yc1tpXSkgciA9IChjIDwgMyA/IGQocikgOiBjID4gMyA/IGQodGFyZ2V0LCBrZXksIHIpIDogZCh0YXJnZXQsIGtleSkpIHx8IHI7XHJcbiAgICByZXR1cm4gYyA+IDMgJiYgciAmJiBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHIpLCByO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19wYXJhbShwYXJhbUluZGV4LCBkZWNvcmF0b3IpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBrZXkpIHsgZGVjb3JhdG9yKHRhcmdldCwga2V5LCBwYXJhbUluZGV4KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSkge1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0Lm1ldGFkYXRhID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiBSZWZsZWN0Lm1ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXRlcih0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcclxuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxyXG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XHJcbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2dlbmVyYXRvcih0aGlzQXJnLCBib2R5KSB7XHJcbiAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnO1xyXG4gICAgcmV0dXJuIGcgPSB7IG5leHQ6IHZlcmIoMCksIFwidGhyb3dcIjogdmVyYigxKSwgXCJyZXR1cm5cIjogdmVyYigyKSB9LCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgKGdbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSksIGc7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcclxuICAgICAgICBpZiAoZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy5cIik7XHJcbiAgICAgICAgd2hpbGUgKF8pIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IG9wWzBdICYgMiA/IHlbXCJyZXR1cm5cIl0gOiBvcFswXSA/IHlbXCJ0aHJvd1wiXSB8fCAoKHQgPSB5W1wicmV0dXJuXCJdKSAmJiB0LmNhbGwoeSksIDApIDogeS5uZXh0KSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcclxuICAgICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFtvcFswXSAmIDIsIHQudmFsdWVdO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogdCA9IG9wOyBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07XHJcbiAgICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDc6IG9wID0gXy5vcHMucG9wKCk7IF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQgfHwgKG9wWzFdID4gdFswXSAmJiBvcFsxXSA8IHRbM10pKSkgeyBfLmxhYmVsID0gb3BbMV07IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0WzJdKSBfLm9wcy5wb3AoKTtcclxuICAgICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG9wID0gYm9keS5jYWxsKHRoaXNBcmcsIF8pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH1cclxuICAgICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHZhciBfX2NyZWF0ZUJpbmRpbmcgPSBPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XHJcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIGsyLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBtW2tdOyB9IH0pO1xyXG59KSA6IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xyXG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcclxuICAgIG9bazJdID0gbVtrXTtcclxufSk7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHBvcnRTdGFyKG0sIG8pIHtcclxuICAgIGZvciAodmFyIHAgaW4gbSkgaWYgKHAgIT09IFwiZGVmYXVsdFwiICYmICFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobywgcCkpIF9fY3JlYXRlQmluZGluZyhvLCBtLCBwKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fdmFsdWVzKG8pIHtcclxuICAgIHZhciBzID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIFN5bWJvbC5pdGVyYXRvciwgbSA9IHMgJiYgb1tzXSwgaSA9IDA7XHJcbiAgICBpZiAobSkgcmV0dXJuIG0uY2FsbChvKTtcclxuICAgIGlmIChvICYmIHR5cGVvZiBvLmxlbmd0aCA9PT0gXCJudW1iZXJcIikgcmV0dXJuIHtcclxuICAgICAgICBuZXh0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmIChvICYmIGkgPj0gby5sZW5ndGgpIG8gPSB2b2lkIDA7XHJcbiAgICAgICAgICAgIHJldHVybiB7IHZhbHVlOiBvICYmIG9baSsrXSwgZG9uZTogIW8gfTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihzID8gXCJPYmplY3QgaXMgbm90IGl0ZXJhYmxlLlwiIDogXCJTeW1ib2wuaXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZWFkKG8sIG4pIHtcclxuICAgIHZhciBtID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXTtcclxuICAgIGlmICghbSkgcmV0dXJuIG87XHJcbiAgICB2YXIgaSA9IG0uY2FsbChvKSwgciwgYXIgPSBbXSwgZTtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgd2hpbGUgKChuID09PSB2b2lkIDAgfHwgbi0tID4gMCkgJiYgIShyID0gaS5uZXh0KCkpLmRvbmUpIGFyLnB1c2goci52YWx1ZSk7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZXJyb3IpIHsgZSA9IHsgZXJyb3I6IGVycm9yIH07IH1cclxuICAgIGZpbmFsbHkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChyICYmICFyLmRvbmUgJiYgKG0gPSBpW1wicmV0dXJuXCJdKSkgbS5jYWxsKGkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmaW5hbGx5IHsgaWYgKGUpIHRocm93IGUuZXJyb3I7IH1cclxuICAgIH1cclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuLyoqIEBkZXByZWNhdGVkICovXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZCgpIHtcclxuICAgIGZvciAodmFyIGFyID0gW10sIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIGFyID0gYXIuY29uY2F0KF9fcmVhZChhcmd1bWVudHNbaV0pKTtcclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuLyoqIEBkZXByZWNhdGVkICovXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZEFycmF5cygpIHtcclxuICAgIGZvciAodmFyIHMgPSAwLCBpID0gMCwgaWwgPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgaWw7IGkrKykgcyArPSBhcmd1bWVudHNbaV0ubGVuZ3RoO1xyXG4gICAgZm9yICh2YXIgciA9IEFycmF5KHMpLCBrID0gMCwgaSA9IDA7IGkgPCBpbDsgaSsrKVxyXG4gICAgICAgIGZvciAodmFyIGEgPSBhcmd1bWVudHNbaV0sIGogPSAwLCBqbCA9IGEubGVuZ3RoOyBqIDwgamw7IGorKywgaysrKVxyXG4gICAgICAgICAgICByW2tdID0gYVtqXTtcclxuICAgIHJldHVybiByO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWRBcnJheSh0bywgZnJvbSwgcGFjaykge1xyXG4gICAgaWYgKHBhY2sgfHwgYXJndW1lbnRzLmxlbmd0aCA9PT0gMikgZm9yICh2YXIgaSA9IDAsIGwgPSBmcm9tLmxlbmd0aCwgYXI7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICBpZiAoYXIgfHwgIShpIGluIGZyb20pKSB7XHJcbiAgICAgICAgICAgIGlmICghYXIpIGFyID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZnJvbSwgMCwgaSk7XHJcbiAgICAgICAgICAgIGFyW2ldID0gZnJvbVtpXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdG8uY29uY2F0KGFyIHx8IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGZyb20pKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXQodikge1xyXG4gICAgcmV0dXJuIHRoaXMgaW5zdGFuY2VvZiBfX2F3YWl0ID8gKHRoaXMudiA9IHYsIHRoaXMpIDogbmV3IF9fYXdhaXQodik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jR2VuZXJhdG9yKHRoaXNBcmcsIF9hcmd1bWVudHMsIGdlbmVyYXRvcikge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBnID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pLCBpLCBxID0gW107XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaWYgKGdbbl0pIGlbbl0gPSBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKGEsIGIpIHsgcS5wdXNoKFtuLCB2LCBhLCBiXSkgPiAxIHx8IHJlc3VtZShuLCB2KTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHJlc3VtZShuLCB2KSB7IHRyeSB7IHN0ZXAoZ1tuXSh2KSk7IH0gY2F0Y2ggKGUpIHsgc2V0dGxlKHFbMF1bM10sIGUpOyB9IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAocikgeyByLnZhbHVlIGluc3RhbmNlb2YgX19hd2FpdCA/IFByb21pc2UucmVzb2x2ZShyLnZhbHVlLnYpLnRoZW4oZnVsZmlsbCwgcmVqZWN0KSA6IHNldHRsZShxWzBdWzJdLCByKTsgfVxyXG4gICAgZnVuY3Rpb24gZnVsZmlsbCh2YWx1ZSkgeyByZXN1bWUoXCJuZXh0XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gcmVqZWN0KHZhbHVlKSB7IHJlc3VtZShcInRocm93XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKGYsIHYpIHsgaWYgKGYodiksIHEuc2hpZnQoKSwgcS5sZW5ndGgpIHJlc3VtZShxWzBdWzBdLCBxWzBdWzFdKTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0RlbGVnYXRvcihvKSB7XHJcbiAgICB2YXIgaSwgcDtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiwgZnVuY3Rpb24gKGUpIHsgdGhyb3cgZTsgfSksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4sIGYpIHsgaVtuXSA9IG9bbl0gPyBmdW5jdGlvbiAodikgeyByZXR1cm4gKHAgPSAhcCkgPyB7IHZhbHVlOiBfX2F3YWl0KG9bbl0odikpLCBkb25lOiBuID09PSBcInJldHVyblwiIH0gOiBmID8gZih2KSA6IHY7IH0gOiBmOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jVmFsdWVzKG8pIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgbSA9IG9bU3ltYm9sLmFzeW5jSXRlcmF0b3JdLCBpO1xyXG4gICAgcmV0dXJuIG0gPyBtLmNhbGwobykgOiAobyA9IHR5cGVvZiBfX3ZhbHVlcyA9PT0gXCJmdW5jdGlvblwiID8gX192YWx1ZXMobykgOiBvW1N5bWJvbC5pdGVyYXRvcl0oKSwgaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGkpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlbbl0gPSBvW25dICYmIGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7IHYgPSBvW25dKHYpLCBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCB2LmRvbmUsIHYudmFsdWUpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgZCwgdikgeyBQcm9taXNlLnJlc29sdmUodikudGhlbihmdW5jdGlvbih2KSB7IHJlc29sdmUoeyB2YWx1ZTogdiwgZG9uZTogZCB9KTsgfSwgcmVqZWN0KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tYWtlVGVtcGxhdGVPYmplY3QoY29va2VkLCByYXcpIHtcclxuICAgIGlmIChPYmplY3QuZGVmaW5lUHJvcGVydHkpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvb2tlZCwgXCJyYXdcIiwgeyB2YWx1ZTogcmF3IH0pOyB9IGVsc2UgeyBjb29rZWQucmF3ID0gcmF3OyB9XHJcbiAgICByZXR1cm4gY29va2VkO1xyXG59O1xyXG5cclxudmFyIF9fc2V0TW9kdWxlRGVmYXVsdCA9IE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgdikge1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIFwiZGVmYXVsdFwiLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2IH0pO1xyXG59KSA6IGZ1bmN0aW9uKG8sIHYpIHtcclxuICAgIG9bXCJkZWZhdWx0XCJdID0gdjtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydFN0YXIobW9kKSB7XHJcbiAgICBpZiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSByZXR1cm4gbW9kO1xyXG4gICAgdmFyIHJlc3VsdCA9IHt9O1xyXG4gICAgaWYgKG1vZCAhPSBudWxsKSBmb3IgKHZhciBrIGluIG1vZCkgaWYgKGsgIT09IFwiZGVmYXVsdFwiICYmIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtb2QsIGspKSBfX2NyZWF0ZUJpbmRpbmcocmVzdWx0LCBtb2QsIGspO1xyXG4gICAgX19zZXRNb2R1bGVEZWZhdWx0KHJlc3VsdCwgbW9kKTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydERlZmF1bHQobW9kKSB7XHJcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IGRlZmF1bHQ6IG1vZCB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19jbGFzc1ByaXZhdGVGaWVsZEdldChyZWNlaXZlciwgc3RhdGUsIGtpbmQsIGYpIHtcclxuICAgIGlmIChraW5kID09PSBcImFcIiAmJiAhZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlByaXZhdGUgYWNjZXNzb3Igd2FzIGRlZmluZWQgd2l0aG91dCBhIGdldHRlclwiKTtcclxuICAgIGlmICh0eXBlb2Ygc3RhdGUgPT09IFwiZnVuY3Rpb25cIiA/IHJlY2VpdmVyICE9PSBzdGF0ZSB8fCAhZiA6ICFzdGF0ZS5oYXMocmVjZWl2ZXIpKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IHJlYWQgcHJpdmF0ZSBtZW1iZXIgZnJvbSBhbiBvYmplY3Qgd2hvc2UgY2xhc3MgZGlkIG5vdCBkZWNsYXJlIGl0XCIpO1xyXG4gICAgcmV0dXJuIGtpbmQgPT09IFwibVwiID8gZiA6IGtpbmQgPT09IFwiYVwiID8gZi5jYWxsKHJlY2VpdmVyKSA6IGYgPyBmLnZhbHVlIDogc3RhdGUuZ2V0KHJlY2VpdmVyKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fY2xhc3NQcml2YXRlRmllbGRTZXQocmVjZWl2ZXIsIHN0YXRlLCB2YWx1ZSwga2luZCwgZikge1xyXG4gICAgaWYgKGtpbmQgPT09IFwibVwiKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiUHJpdmF0ZSBtZXRob2QgaXMgbm90IHdyaXRhYmxlXCIpO1xyXG4gICAgaWYgKGtpbmQgPT09IFwiYVwiICYmICFmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiUHJpdmF0ZSBhY2Nlc3NvciB3YXMgZGVmaW5lZCB3aXRob3V0IGEgc2V0dGVyXCIpO1xyXG4gICAgaWYgKHR5cGVvZiBzdGF0ZSA9PT0gXCJmdW5jdGlvblwiID8gcmVjZWl2ZXIgIT09IHN0YXRlIHx8ICFmIDogIXN0YXRlLmhhcyhyZWNlaXZlcikpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3Qgd3JpdGUgcHJpdmF0ZSBtZW1iZXIgdG8gYW4gb2JqZWN0IHdob3NlIGNsYXNzIGRpZCBub3QgZGVjbGFyZSBpdFwiKTtcclxuICAgIHJldHVybiAoa2luZCA9PT0gXCJhXCIgPyBmLmNhbGwocmVjZWl2ZXIsIHZhbHVlKSA6IGYgPyBmLnZhbHVlID0gdmFsdWUgOiBzdGF0ZS5zZXQocmVjZWl2ZXIsIHZhbHVlKSksIHZhbHVlO1xyXG59XHJcbiIsImNvbnN0IHJlZ0Vtb2ppID0gbmV3IFJlZ0V4cChcbiAgL1tcXHUyNzAwLVxcdTI3QkZdfFtcXHVFMDAwLVxcdUY4RkZdfFxcdUQ4M0NbXFx1REMwMC1cXHVERkZGXXxcXHVEODNEW1xcdURDMDAtXFx1REZGRl18W1xcdTIwMTEtXFx1MjZGRl18XFx1RDgzRVtcXHVERDEwLVxcdURERkZdfFtcXHVGRTBFLVxcdUZFMEZdLyxcbiAgXCJnXCJcbik7XG5cbmV4cG9ydCBmdW5jdGlvbiBhbGxBbHBoYWJldHModGV4dDogc3RyaW5nKTogYm9vbGVhbiB7XG4gIHJldHVybiBCb29sZWFuKHRleHQubWF0Y2goL15bYS16QS1aMC05Xy1dKyQvKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBleGNsdWRlRW1vamkodGV4dDogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHRleHQucmVwbGFjZShyZWdFbW9qaSwgXCJcIik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBleGNsdWRlU3BhY2UodGV4dDogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHRleHQucmVwbGFjZSgvIC9nLCBcIlwiKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxvd2VySW5jbHVkZXMob25lOiBzdHJpbmcsIG90aGVyOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuIG9uZS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKG90aGVyLnRvTG93ZXJDYXNlKCkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbG93ZXJJbmNsdWRlc1dpdGhvdXRTcGFjZShvbmU6IHN0cmluZywgb3RoZXI6IHN0cmluZyk6IGJvb2xlYW4ge1xuICByZXR1cm4gbG93ZXJJbmNsdWRlcyhleGNsdWRlU3BhY2Uob25lKSwgZXhjbHVkZVNwYWNlKG90aGVyKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsb3dlclN0YXJ0c1dpdGgoYTogc3RyaW5nLCBiOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuIGEudG9Mb3dlckNhc2UoKS5zdGFydHNXaXRoKGIudG9Mb3dlckNhc2UoKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsb3dlclN0YXJ0c1dpdGhvdXRTcGFjZShvbmU6IHN0cmluZywgb3RoZXI6IHN0cmluZyk6IGJvb2xlYW4ge1xuICByZXR1cm4gbG93ZXJTdGFydHNXaXRoKGV4Y2x1ZGVTcGFjZShvbmUpLCBleGNsdWRlU3BhY2Uob3RoZXIpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNhcGl0YWxpemVGaXJzdExldHRlcihzdHI6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiBzdHIuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzdHIuc2xpY2UoMSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiogc3BsaXRSYXcoXG4gIHRleHQ6IHN0cmluZyxcbiAgcmVnZXhwOiBSZWdFeHBcbik6IEl0ZXJhYmxlSXRlcmF0b3I8c3RyaW5nPiB7XG4gIGxldCBwcmV2aW91c0luZGV4ID0gMDtcbiAgZm9yIChsZXQgciBvZiB0ZXh0Lm1hdGNoQWxsKHJlZ2V4cCkpIHtcbiAgICBpZiAocHJldmlvdXNJbmRleCAhPT0gci5pbmRleCEpIHtcbiAgICAgIHlpZWxkIHRleHQuc2xpY2UocHJldmlvdXNJbmRleCwgci5pbmRleCEpO1xuICAgIH1cbiAgICB5aWVsZCB0ZXh0W3IuaW5kZXghXTtcbiAgICBwcmV2aW91c0luZGV4ID0gci5pbmRleCEgKyAxO1xuICB9XG5cbiAgaWYgKHByZXZpb3VzSW5kZXggIT09IHRleHQubGVuZ3RoKSB7XG4gICAgeWllbGQgdGV4dC5zbGljZShwcmV2aW91c0luZGV4LCB0ZXh0Lmxlbmd0aCk7XG4gIH1cbn1cbiIsImltcG9ydCB7IFRva2VuaXplciB9IGZyb20gXCIuLi90b2tlbml6ZXJcIjtcbmltcG9ydCB7IHNwbGl0UmF3IH0gZnJvbSBcIi4uLy4uL3V0aWwvc3RyaW5nc1wiO1xuXG5mdW5jdGlvbiBwaWNrVG9rZW5zKGNvbnRlbnQ6IHN0cmluZywgdHJpbVBhdHRlcm46IFJlZ0V4cCk6IHN0cmluZ1tdIHtcbiAgcmV0dXJuIGNvbnRlbnQuc3BsaXQodHJpbVBhdHRlcm4pLmZpbHRlcigoeCkgPT4geCAhPT0gXCJcIik7XG59XG5cbmV4cG9ydCBjb25zdCBUUklNX0NIQVJfUEFUVEVSTiA9IC9bXFxuXFx0XFxbXFxdJC86PyE9KCk8PlwiJy4sfDsqfiBgXS9nO1xuZXhwb3J0IGNsYXNzIERlZmF1bHRUb2tlbml6ZXIgaW1wbGVtZW50cyBUb2tlbml6ZXIge1xuICB0b2tlbml6ZShjb250ZW50OiBzdHJpbmcsIHJhdz86IGJvb2xlYW4pOiBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIHJhd1xuICAgICAgPyBBcnJheS5mcm9tKHNwbGl0UmF3KGNvbnRlbnQsIHRoaXMuZ2V0VHJpbVBhdHRlcm4oKSkpLmZpbHRlcihcbiAgICAgICAgICAoeCkgPT4geCAhPT0gXCIgXCJcbiAgICAgICAgKVxuICAgICAgOiBwaWNrVG9rZW5zKGNvbnRlbnQsIHRoaXMuZ2V0VHJpbVBhdHRlcm4oKSk7XG4gIH1cblxuICByZWN1cnNpdmVUb2tlbml6ZShjb250ZW50OiBzdHJpbmcpOiB7IHdvcmQ6IHN0cmluZzsgb2Zmc2V0OiBudW1iZXIgfVtdIHtcbiAgICBjb25zdCB0cmltSW5kZXhlcyA9IEFycmF5LmZyb20oY29udGVudC5tYXRjaEFsbCh0aGlzLmdldFRyaW1QYXR0ZXJuKCkpKVxuICAgICAgLnNvcnQoKGEsIGIpID0+IGEuaW5kZXghIC0gYi5pbmRleCEpXG4gICAgICAubWFwKCh4KSA9PiB4LmluZGV4ISk7XG4gICAgcmV0dXJuIFtcbiAgICAgIHsgd29yZDogY29udGVudCwgb2Zmc2V0OiAwIH0sXG4gICAgICAuLi50cmltSW5kZXhlcy5tYXAoKGkpID0+ICh7XG4gICAgICAgIHdvcmQ6IGNvbnRlbnQuc2xpY2UoaSArIDEpLFxuICAgICAgICBvZmZzZXQ6IGkgKyAxLFxuICAgICAgfSkpLFxuICAgIF07XG4gIH1cblxuICBnZXRUcmltUGF0dGVybigpOiBSZWdFeHAge1xuICAgIHJldHVybiBUUklNX0NIQVJfUEFUVEVSTjtcbiAgfVxuXG4gIHNob3VsZElnbm9yZShzdHI6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgRGVmYXVsdFRva2VuaXplciB9IGZyb20gXCIuL0RlZmF1bHRUb2tlbml6ZXJcIjtcblxuY29uc3QgQVJBQklDX1RSSU1fQ0hBUl9QQVRURVJOID0gL1tcXG5cXHRcXFtcXF0kLzo/IT0oKTw+XCInLix8Oyp+IGDYjNibXS9nO1xuZXhwb3J0IGNsYXNzIEFyYWJpY1Rva2VuaXplciBleHRlbmRzIERlZmF1bHRUb2tlbml6ZXIge1xuICBnZXRUcmltUGF0dGVybigpOiBSZWdFeHAge1xuICAgIHJldHVybiBBUkFCSUNfVFJJTV9DSEFSX1BBVFRFUk47XG4gIH1cbn1cbiIsIi8vIEB0cy1ub2NoZWNrXG4vLyBCZWNhdXNlIHRoaXMgY29kZSBpcyBvcmlnaW5hbGx5IGphdmFzY3JpcHQgY29kZS5cbi8vIG5vaW5zcGVjdGlvbiBGdW5jdGlvblRvb0xvbmdKUyxGdW5jdGlvbldpdGhNdWx0aXBsZUxvb3BzSlMsRXF1YWxpdHlDb21wYXJpc29uV2l0aENvZXJjaW9uSlMsUG9pbnRsZXNzQm9vbGVhbkV4cHJlc3Npb25KUyxKU0RlY2xhcmF0aW9uc0F0U2NvcGVTdGFydFxuXG4vLyBUaW55U2VnbWVudGVyIDAuMSAtLSBTdXBlciBjb21wYWN0IEphcGFuZXNlIHRva2VuaXplciBpbiBKYXZhc2NyaXB0XG4vLyAoYykgMjAwOCBUYWt1IEt1ZG8gPHRha3VAY2hhc2VuLm9yZz5cbi8vIFRpbnlTZWdtZW50ZXIgaXMgZnJlZWx5IGRpc3RyaWJ1dGFibGUgdW5kZXIgdGhlIHRlcm1zIG9mIGEgbmV3IEJTRCBsaWNlbmNlLlxuLy8gRm9yIGRldGFpbHMsIHNlZSBodHRwOi8vY2hhc2VuLm9yZy9+dGFrdS9zb2Z0d2FyZS9UaW55U2VnbWVudGVyL0xJQ0VOQ0UudHh0XG5cbmZ1bmN0aW9uIFRpbnlTZWdtZW50ZXIoKSB7XG4gIHZhciBwYXR0ZXJucyA9IHtcbiAgICBcIlvkuIDkuozkuInlm5vkupTlha3kuIPlhavkuZ3ljYHnmb7ljYPkuIflhITlhYZdXCI6IFwiTVwiLFxuICAgIFwiW+S4gC3pvqDjgIXjgIbjg7Xjg7ZdXCI6IFwiSFwiLFxuICAgIFwiW+OBgS3jgpNdXCI6IFwiSVwiLFxuICAgIFwiW+OCoS3jg7Tjg7zvvbEt776d776e772wXVwiOiBcIktcIixcbiAgICBcIlthLXpBLVrvvYEt772a77yhLe+8ul1cIjogXCJBXCIsXG4gICAgXCJbMC0577yQLe+8mV1cIjogXCJOXCIsXG4gIH07XG4gIHRoaXMuY2hhcnR5cGVfID0gW107XG4gIGZvciAodmFyIGkgaW4gcGF0dGVybnMpIHtcbiAgICB2YXIgcmVnZXhwID0gbmV3IFJlZ0V4cCgpO1xuICAgIHJlZ2V4cC5jb21waWxlKGkpO1xuICAgIHRoaXMuY2hhcnR5cGVfLnB1c2goW3JlZ2V4cCwgcGF0dGVybnNbaV1dKTtcbiAgfVxuXG4gIHRoaXMuQklBU19fID0gLTMzMjtcbiAgdGhpcy5CQzFfXyA9IHsgSEg6IDYsIElJOiAyNDYxLCBLSDogNDA2LCBPSDogLTEzNzggfTtcbiAgdGhpcy5CQzJfXyA9IHtcbiAgICBBQTogLTMyNjcsXG4gICAgQUk6IDI3NDQsXG4gICAgQU46IC04NzgsXG4gICAgSEg6IC00MDcwLFxuICAgIEhNOiAtMTcxMSxcbiAgICBITjogNDAxMixcbiAgICBITzogMzc2MSxcbiAgICBJQTogMTMyNyxcbiAgICBJSDogLTExODQsXG4gICAgSUk6IC0xMzMyLFxuICAgIElLOiAxNzIxLFxuICAgIElPOiA1NDkyLFxuICAgIEtJOiAzODMxLFxuICAgIEtLOiAtODc0MSxcbiAgICBNSDogLTMxMzIsXG4gICAgTUs6IDMzMzQsXG4gICAgT086IC0yOTIwLFxuICB9O1xuICB0aGlzLkJDM19fID0ge1xuICAgIEhIOiA5OTYsXG4gICAgSEk6IDYyNixcbiAgICBISzogLTcyMSxcbiAgICBITjogLTEzMDcsXG4gICAgSE86IC04MzYsXG4gICAgSUg6IC0zMDEsXG4gICAgS0s6IDI3NjIsXG4gICAgTUs6IDEwNzksXG4gICAgTU06IDQwMzQsXG4gICAgT0E6IC0xNjUyLFxuICAgIE9IOiAyNjYsXG4gIH07XG4gIHRoaXMuQlAxX18gPSB7IEJCOiAyOTUsIE9COiAzMDQsIE9POiAtMTI1LCBVQjogMzUyIH07XG4gIHRoaXMuQlAyX18gPSB7IEJPOiA2MCwgT086IC0xNzYyIH07XG4gIHRoaXMuQlExX18gPSB7XG4gICAgQkhIOiAxMTUwLFxuICAgIEJITTogMTUyMSxcbiAgICBCSUk6IC0xMTU4LFxuICAgIEJJTTogODg2LFxuICAgIEJNSDogMTIwOCxcbiAgICBCTkg6IDQ0OSxcbiAgICBCT0g6IC05MSxcbiAgICBCT086IC0yNTk3LFxuICAgIE9ISTogNDUxLFxuICAgIE9JSDogLTI5NixcbiAgICBPS0E6IDE4NTEsXG4gICAgT0tIOiAtMTAyMCxcbiAgICBPS0s6IDkwNCxcbiAgICBPT086IDI5NjUsXG4gIH07XG4gIHRoaXMuQlEyX18gPSB7XG4gICAgQkhIOiAxMTgsXG4gICAgQkhJOiAtMTE1OSxcbiAgICBCSE06IDQ2NixcbiAgICBCSUg6IC05MTksXG4gICAgQktLOiAtMTcyMCxcbiAgICBCS086IDg2NCxcbiAgICBPSEg6IC0xMTM5LFxuICAgIE9ITTogLTE4MSxcbiAgICBPSUg6IDE1MyxcbiAgICBVSEk6IC0xMTQ2LFxuICB9O1xuICB0aGlzLkJRM19fID0ge1xuICAgIEJISDogLTc5MixcbiAgICBCSEk6IDI2NjQsXG4gICAgQklJOiAtMjk5LFxuICAgIEJLSTogNDE5LFxuICAgIEJNSDogOTM3LFxuICAgIEJNTTogODMzNSxcbiAgICBCTk46IDk5OCxcbiAgICBCT0g6IDc3NSxcbiAgICBPSEg6IDIxNzQsXG4gICAgT0hNOiA0MzksXG4gICAgT0lJOiAyODAsXG4gICAgT0tIOiAxNzk4LFxuICAgIE9LSTogLTc5MyxcbiAgICBPS086IC0yMjQyLFxuICAgIE9NSDogLTI0MDIsXG4gICAgT09POiAxMTY5OSxcbiAgfTtcbiAgdGhpcy5CUTRfXyA9IHtcbiAgICBCSEg6IC0zODk1LFxuICAgIEJJSDogMzc2MSxcbiAgICBCSUk6IC00NjU0LFxuICAgIEJJSzogMTM0OCxcbiAgICBCS0s6IC0xODA2LFxuICAgIEJNSTogLTMzODUsXG4gICAgQk9POiAtMTIzOTYsXG4gICAgT0FIOiA5MjYsXG4gICAgT0hIOiAyNjYsXG4gICAgT0hLOiAtMjAzNixcbiAgICBPTk46IC05NzMsXG4gIH07XG4gIHRoaXMuQlcxX18gPSB7XG4gICAgXCIs44GoXCI6IDY2MCxcbiAgICBcIizlkIxcIjogNzI3LFxuICAgIEIx44GCOiAxNDA0LFxuICAgIEIx5ZCMOiA1NDIsXG4gICAgXCLjgIHjgahcIjogNjYwLFxuICAgIFwi44CB5ZCMXCI6IDcyNyxcbiAgICBcIuOAjeOBqFwiOiAxNjgyLFxuICAgIOOBguOBozogMTUwNSxcbiAgICDjgYTjgYY6IDE3NDMsXG4gICAg44GE44GjOiAtMjA1NSxcbiAgICDjgYTjgos6IDY3MixcbiAgICDjgYbjgZc6IC00ODE3LFxuICAgIOOBhuOCkzogNjY1LFxuICAgIOOBi+OCiTogMzQ3MixcbiAgICDjgYzjgok6IDYwMCxcbiAgICDjgZPjgYY6IC03OTAsXG4gICAg44GT44GoOiAyMDgzLFxuICAgIOOBk+OCkzogLTEyNjIsXG4gICAg44GV44KJOiAtNDE0MyxcbiAgICDjgZXjgpM6IDQ1NzMsXG4gICAg44GX44GfOiAyNjQxLFxuICAgIOOBl+OBpjogMTEwNCxcbiAgICDjgZnjgac6IC0zMzk5LFxuICAgIOOBneOBkzogMTk3NyxcbiAgICDjgZ3jgow6IC04NzEsXG4gICAg44Gf44GhOiAxMTIyLFxuICAgIOOBn+OCgTogNjAxLFxuICAgIOOBo+OBnzogMzQ2MyxcbiAgICDjgaTjgYQ6IC04MDIsXG4gICAg44Gm44GEOiA4MDUsXG4gICAg44Gm44GNOiAxMjQ5LFxuICAgIOOBp+OBjTogMTEyNyxcbiAgICDjgafjgZk6IDM0NDUsXG4gICAg44Gn44GvOiA4NDQsXG4gICAg44Go44GEOiAtNDkxNSxcbiAgICDjgajjgb86IDE5MjIsXG4gICAg44Gp44GTOiAzODg3LFxuICAgIOOBquOBhDogNTcxMyxcbiAgICDjgarjgaM6IDMwMTUsXG4gICAg44Gq44GpOiA3Mzc5LFxuICAgIOOBquOCkzogLTExMTMsXG4gICAg44Gr44GXOiAyNDY4LFxuICAgIOOBq+OBrzogMTQ5OCxcbiAgICDjgavjgoI6IDE2NzEsXG4gICAg44Gr5a++OiAtOTEyLFxuICAgIOOBruS4gDogLTUwMSxcbiAgICDjga7kuK06IDc0MSxcbiAgICDjgb7jgZs6IDI0NDgsXG4gICAg44G+44GnOiAxNzExLFxuICAgIOOBvuOBvjogMjYwMCxcbiAgICDjgb7jgos6IC0yMTU1LFxuICAgIOOChOOCgDogLTE5NDcsXG4gICAg44KI44GjOiAtMjU2NSxcbiAgICDjgozjgZ86IDIzNjksXG4gICAg44KM44GnOiAtOTEzLFxuICAgIOOCkuOBlzogMTg2MCxcbiAgICDjgpLopos6IDczMSxcbiAgICDkuqHjgY86IC0xODg2LFxuICAgIOS6rOmDvTogMjU1OCxcbiAgICDlj5bjgoo6IC0yNzg0LFxuICAgIOWkp+OBjTogLTI2MDQsXG4gICAg5aSn6ZiqOiAxNDk3LFxuICAgIOW5s+aWuTogLTIzMTQsXG4gICAg5byV44GNOiAtMTMzNixcbiAgICDml6XmnKw6IC0xOTUsXG4gICAg5pys5b2TOiAtMjQyMyxcbiAgICDmr47ml6U6IC0yMTEzLFxuICAgIOebruaMhzogLTcyNCxcbiAgICDvvKLvvJHjgYI6IDE0MDQsXG4gICAg77yi77yR5ZCMOiA1NDIsXG4gICAgXCLvvaPjgahcIjogMTY4MixcbiAgfTtcbiAgdGhpcy5CVzJfXyA9IHtcbiAgICBcIi4uXCI6IC0xMTgyMixcbiAgICAxMTogLTY2OSxcbiAgICBcIuKAleKAlVwiOiAtNTczMCxcbiAgICBcIuKIkuKIklwiOiAtMTMxNzUsXG4gICAg44GE44GGOiAtMTYwOSxcbiAgICDjgYbjgYs6IDI0OTAsXG4gICAg44GL44GXOiAtMTM1MCxcbiAgICDjgYvjgoI6IC02MDIsXG4gICAg44GL44KJOiAtNzE5NCxcbiAgICDjgYvjgow6IDQ2MTIsXG4gICAg44GM44GEOiA4NTMsXG4gICAg44GM44KJOiAtMzE5OCxcbiAgICDjgY3jgZ86IDE5NDEsXG4gICAg44GP44GqOiAtMTU5NyxcbiAgICDjgZPjgag6IC04MzkyLFxuICAgIOOBk+OBrjogLTQxOTMsXG4gICAg44GV44GbOiA0NTMzLFxuICAgIOOBleOCjDogMTMxNjgsXG4gICAg44GV44KTOiAtMzk3NyxcbiAgICDjgZfjgYQ6IC0xODE5LFxuICAgIOOBl+OBizogLTU0NSxcbiAgICDjgZfjgZ86IDUwNzgsXG4gICAg44GX44GmOiA5NzIsXG4gICAg44GX44GqOiA5MzksXG4gICAg44Gd44GuOiAtMzc0NCxcbiAgICDjgZ/jgYQ6IC0xMjUzLFxuICAgIOOBn+OBnzogLTY2MixcbiAgICDjgZ/jgaA6IC0zODU3LFxuICAgIOOBn+OBoTogLTc4NixcbiAgICDjgZ/jgag6IDEyMjQsXG4gICAg44Gf44GvOiAtOTM5LFxuICAgIOOBo+OBnzogNDU4OSxcbiAgICDjgaPjgaY6IDE2NDcsXG4gICAg44Gj44GoOiAtMjA5NCxcbiAgICDjgabjgYQ6IDYxNDQsXG4gICAg44Gm44GNOiAzNjQwLFxuICAgIOOBpuOBjzogMjU1MSxcbiAgICDjgabjga86IC0zMTEwLFxuICAgIOOBpuOCgjogLTMwNjUsXG4gICAg44Gn44GEOiAyNjY2LFxuICAgIOOBp+OBjTogLTE1MjgsXG4gICAg44Gn44GXOiAtMzgyOCxcbiAgICDjgafjgZk6IC00NzYxLFxuICAgIOOBp+OCgjogLTQyMDMsXG4gICAg44Go44GEOiAxODkwLFxuICAgIOOBqOOBkzogLTE3NDYsXG4gICAg44Go44GoOiAtMjI3OSxcbiAgICDjgajjga46IDcyMCxcbiAgICDjgajjgb86IDUxNjgsXG4gICAg44Go44KCOiAtMzk0MSxcbiAgICDjgarjgYQ6IC0yNDg4LFxuICAgIOOBquOBjDogLTEzMTMsXG4gICAg44Gq44GpOiAtNjUwOSxcbiAgICDjgarjga46IDI2MTQsXG4gICAg44Gq44KTOiAzMDk5LFxuICAgIOOBq+OBijogLTE2MTUsXG4gICAg44Gr44GXOiAyNzQ4LFxuICAgIOOBq+OBqjogMjQ1NCxcbiAgICDjgavjgog6IC03MjM2LFxuICAgIOOBq+WvvjogLTE0OTQzLFxuICAgIOOBq+W+kzogLTQ2ODgsXG4gICAg44Gr6ZaiOiAtMTEzODgsXG4gICAg44Gu44GLOiAyMDkzLFxuICAgIOOBruOBpzogLTcwNTksXG4gICAg44Gu44GrOiAtNjA0MSxcbiAgICDjga7jga46IC02MTI1LFxuICAgIOOBr+OBhDogMTA3MyxcbiAgICDjga/jgYw6IC0xMDMzLFxuICAgIOOBr+OBmjogLTI1MzIsXG4gICAg44Gw44KMOiAxODEzLFxuICAgIOOBvuOBlzogLTEzMTYsXG4gICAg44G+44GnOiAtNjYyMSxcbiAgICDjgb7jgow6IDU0MDksXG4gICAg44KB44GmOiAtMzE1MyxcbiAgICDjgoLjgYQ6IDIyMzAsXG4gICAg44KC44GuOiAtMTA3MTMsXG4gICAg44KJ44GLOiAtOTQ0LFxuICAgIOOCieOBlzogLTE2MTEsXG4gICAg44KJ44GrOiAtMTg5NyxcbiAgICDjgorjgZc6IDY1MSxcbiAgICDjgorjgb46IDE2MjAsXG4gICAg44KM44GfOiA0MjcwLFxuICAgIOOCjOOBpjogODQ5LFxuICAgIOOCjOOBsDogNDExNCxcbiAgICDjgo3jgYY6IDYwNjcsXG4gICAg44KP44KMOiA3OTAxLFxuICAgIOOCkumAmjogLTExODc3LFxuICAgIOOCk+OBoDogNzI4LFxuICAgIOOCk+OBqjogLTQxMTUsXG4gICAg5LiA5Lq6OiA2MDIsXG4gICAg5LiA5pa5OiAtMTM3NSxcbiAgICDkuIDml6U6IDk3MCxcbiAgICDkuIDpg6g6IC0xMDUxLFxuICAgIOS4iuOBjDogLTQ0NzksXG4gICAg5Lya56S+OiAtMTExNixcbiAgICDlh7rjgaY6IDIxNjMsXG4gICAg5YiG44GuOiAtNzc1OCxcbiAgICDlkIzlhZo6IDk3MCxcbiAgICDlkIzml6U6IC05MTMsXG4gICAg5aSn6ZiqOiAtMjQ3MSxcbiAgICDlp5Tlk6E6IC0xMjUwLFxuICAgIOWwkeOBqjogLTEwNTAsXG4gICAg5bm05bqmOiAtODY2OSxcbiAgICDlubTplpM6IC0xNjI2LFxuICAgIOW6nOecjDogLTIzNjMsXG4gICAg5omL5qipOiAtMTk4MixcbiAgICDmlrDogZ46IC00MDY2LFxuICAgIOaXpeaWsDogLTcyMixcbiAgICDml6XmnKw6IC03MDY4LFxuICAgIOaXpeexszogMzM3MixcbiAgICDmm5zml6U6IC02MDEsXG4gICAg5pyd6a6uOiAtMjM1NSxcbiAgICDmnKzkuro6IC0yNjk3LFxuICAgIOadseS6rDogLTE1NDMsXG4gICAg54S244GoOiAtMTM4NCxcbiAgICDnpL7kvJo6IC0xMjc2LFxuICAgIOeri+OBpjogLTk5MCxcbiAgICDnrKzjgas6IC0xNjEyLFxuICAgIOexs+WbvTogLTQyNjgsXG4gICAgXCLvvJHvvJFcIjogLTY2OSxcbiAgfTtcbiAgdGhpcy5CVzNfXyA9IHtcbiAgICDjgYLjgZ86IC0yMTk0LFxuICAgIOOBguOCijogNzE5LFxuICAgIOOBguOCizogMzg0NixcbiAgICBcIuOBhC5cIjogLTExODUsXG4gICAgXCLjgYTjgIJcIjogLTExODUsXG4gICAg44GE44GEOiA1MzA4LFxuICAgIOOBhOOBiDogMjA3OSxcbiAgICDjgYTjgY86IDMwMjksXG4gICAg44GE44GfOiAyMDU2LFxuICAgIOOBhOOBozogMTg4MyxcbiAgICDjgYTjgos6IDU2MDAsXG4gICAg44GE44KPOiAxNTI3LFxuICAgIOOBhuOBoTogMTExNyxcbiAgICDjgYbjgag6IDQ3OTgsXG4gICAg44GI44GoOiAxNDU0LFxuICAgIFwi44GLLlwiOiAyODU3LFxuICAgIFwi44GL44CCXCI6IDI4NTcsXG4gICAg44GL44GROiAtNzQzLFxuICAgIOOBi+OBozogLTQwOTgsXG4gICAg44GL44GrOiAtNjY5LFxuICAgIOOBi+OCiTogNjUyMCxcbiAgICDjgYvjgoo6IC0yNjcwLFxuICAgIFwi44GMLFwiOiAxODE2LFxuICAgIFwi44GM44CBXCI6IDE4MTYsXG4gICAg44GM44GNOiAtNDg1NSxcbiAgICDjgYzjgZE6IC0xMTI3LFxuICAgIOOBjOOBozogLTkxMyxcbiAgICDjgYzjgok6IC00OTc3LFxuICAgIOOBjOOCijogLTIwNjQsXG4gICAg44GN44GfOiAxNjQ1LFxuICAgIOOBkeOBqTogMTM3NCxcbiAgICDjgZPjgag6IDczOTcsXG4gICAg44GT44GuOiAxNTQyLFxuICAgIOOBk+OCjTogLTI3NTcsXG4gICAg44GV44GEOiAtNzE0LFxuICAgIOOBleOCkjogOTc2LFxuICAgIFwi44GXLFwiOiAxNTU3LFxuICAgIFwi44GX44CBXCI6IDE1NTcsXG4gICAg44GX44GEOiAtMzcxNCxcbiAgICDjgZfjgZ86IDM1NjIsXG4gICAg44GX44GmOiAxNDQ5LFxuICAgIOOBl+OBqjogMjYwOCxcbiAgICDjgZfjgb46IDEyMDAsXG4gICAgXCLjgZkuXCI6IC0xMzEwLFxuICAgIFwi44GZ44CCXCI6IC0xMzEwLFxuICAgIOOBmeOCizogNjUyMSxcbiAgICBcIuOBmixcIjogMzQyNixcbiAgICBcIuOBmuOAgVwiOiAzNDI2LFxuICAgIOOBmuOBqzogODQxLFxuICAgIOOBneOBhjogNDI4LFxuICAgIFwi44GfLlwiOiA4ODc1LFxuICAgIFwi44Gf44CCXCI6IDg4NzUsXG4gICAg44Gf44GEOiAtNTk0LFxuICAgIOOBn+OBrjogODEyLFxuICAgIOOBn+OCijogLTExODMsXG4gICAg44Gf44KLOiAtODUzLFxuICAgIFwi44GgLlwiOiA0MDk4LFxuICAgIFwi44Gg44CCXCI6IDQwOTgsXG4gICAg44Gg44GjOiAxMDA0LFxuICAgIOOBo+OBnzogLTQ3NDgsXG4gICAg44Gj44GmOiAzMDAsXG4gICAg44Gm44GEOiA2MjQwLFxuICAgIOOBpuOBijogODU1LFxuICAgIOOBpuOCgjogMzAyLFxuICAgIOOBp+OBmTogMTQzNyxcbiAgICDjgafjgas6IC0xNDgyLFxuICAgIOOBp+OBrzogMjI5NSxcbiAgICDjgajjgYY6IC0xMzg3LFxuICAgIOOBqOOBlzogMjI2NixcbiAgICDjgajjga46IDU0MSxcbiAgICDjgajjgoI6IC0zNTQzLFxuICAgIOOBqeOBhjogNDY2NCxcbiAgICDjgarjgYQ6IDE3OTYsXG4gICAg44Gq44GPOiAtOTAzLFxuICAgIOOBquOBqTogMjEzNSxcbiAgICBcIuOBqyxcIjogLTEwMjEsXG4gICAgXCLjgavjgIFcIjogLTEwMjEsXG4gICAg44Gr44GXOiAxNzcxLFxuICAgIOOBq+OBqjogMTkwNixcbiAgICDjgavjga86IDI2NDQsXG4gICAgXCLjga4sXCI6IC03MjQsXG4gICAgXCLjga7jgIFcIjogLTcyNCxcbiAgICDjga7lrZA6IC0xMDAwLFxuICAgIFwi44GvLFwiOiAxMzM3LFxuICAgIFwi44Gv44CBXCI6IDEzMzcsXG4gICAg44G544GNOiAyMTgxLFxuICAgIOOBvuOBlzogMTExMyxcbiAgICDjgb7jgZk6IDY5NDMsXG4gICAg44G+44GjOiAtMTU0OSxcbiAgICDjgb7jgac6IDYxNTQsXG4gICAg44G+44KMOiAtNzkzLFxuICAgIOOCieOBlzogMTQ3OSxcbiAgICDjgonjgow6IDY4MjAsXG4gICAg44KL44KLOiAzODE4LFxuICAgIFwi44KMLFwiOiA4NTQsXG4gICAgXCLjgozjgIFcIjogODU0LFxuICAgIOOCjOOBnzogMTg1MCxcbiAgICDjgozjgaY6IDEzNzUsXG4gICAg44KM44GwOiAtMzI0NixcbiAgICDjgozjgos6IDEwOTEsXG4gICAg44KP44KMOiAtNjA1LFxuICAgIOOCk+OBoDogNjA2LFxuICAgIOOCk+OBpzogNzk4LFxuICAgIOOCq+aciDogOTkwLFxuICAgIOS8muitsDogODYwLFxuICAgIOWFpeOCijogMTIzMixcbiAgICDlpKfkvJo6IDIyMTcsXG4gICAg5aeL44KBOiAxNjgxLFxuICAgIOW4gjogOTY1LFxuICAgIOaWsOiBnjogLTUwNTUsXG4gICAgXCLml6UsXCI6IDk3NCxcbiAgICBcIuaXpeOAgVwiOiA5NzQsXG4gICAg56S+5LyaOiAyMDI0LFxuICAgIO+9tuaciDogOTkwLFxuICB9O1xuICB0aGlzLlRDMV9fID0ge1xuICAgIEFBQTogMTA5MyxcbiAgICBISEg6IDEwMjksXG4gICAgSEhNOiA1ODAsXG4gICAgSElJOiA5OTgsXG4gICAgSE9IOiAtMzkwLFxuICAgIEhPTTogLTMzMSxcbiAgICBJSEk6IDExNjksXG4gICAgSU9IOiAtMTQyLFxuICAgIElPSTogLTEwMTUsXG4gICAgSU9NOiA0NjcsXG4gICAgTU1IOiAxODcsXG4gICAgT09JOiAtMTgzMixcbiAgfTtcbiAgdGhpcy5UQzJfXyA9IHtcbiAgICBISE86IDIwODgsXG4gICAgSElJOiAtMTAyMyxcbiAgICBITU06IC0xMTU0LFxuICAgIElISTogLTE5NjUsXG4gICAgS0tIOiA3MDMsXG4gICAgT0lJOiAtMjY0OSxcbiAgfTtcbiAgdGhpcy5UQzNfXyA9IHtcbiAgICBBQUE6IC0yOTQsXG4gICAgSEhIOiAzNDYsXG4gICAgSEhJOiAtMzQxLFxuICAgIEhJSTogLTEwODgsXG4gICAgSElLOiA3MzEsXG4gICAgSE9IOiAtMTQ4NixcbiAgICBJSEg6IDEyOCxcbiAgICBJSEk6IC0zMDQxLFxuICAgIElITzogLTE5MzUsXG4gICAgSUlIOiAtODI1LFxuICAgIElJTTogLTEwMzUsXG4gICAgSU9JOiAtNTQyLFxuICAgIEtISDogLTEyMTYsXG4gICAgS0tBOiA0OTEsXG4gICAgS0tIOiAtMTIxNyxcbiAgICBLT0s6IC0xMDA5LFxuICAgIE1ISDogLTI2OTQsXG4gICAgTUhNOiAtNDU3LFxuICAgIE1ITzogMTIzLFxuICAgIE1NSDogLTQ3MSxcbiAgICBOTkg6IC0xNjg5LFxuICAgIE5OTzogNjYyLFxuICAgIE9ITzogLTMzOTMsXG4gIH07XG4gIHRoaXMuVEM0X18gPSB7XG4gICAgSEhIOiAtMjAzLFxuICAgIEhISTogMTM0NCxcbiAgICBISEs6IDM2NSxcbiAgICBISE06IC0xMjIsXG4gICAgSEhOOiAxODIsXG4gICAgSEhPOiA2NjksXG4gICAgSElIOiA4MDQsXG4gICAgSElJOiA2NzksXG4gICAgSE9IOiA0NDYsXG4gICAgSUhIOiA2OTUsXG4gICAgSUhPOiAtMjMyNCxcbiAgICBJSUg6IDMyMSxcbiAgICBJSUk6IDE0OTcsXG4gICAgSUlPOiA2NTYsXG4gICAgSU9POiA1NCxcbiAgICBLQUs6IDQ4NDUsXG4gICAgS0tBOiAzMzg2LFxuICAgIEtLSzogMzA2NSxcbiAgICBNSEg6IC00MDUsXG4gICAgTUhJOiAyMDEsXG4gICAgTU1IOiAtMjQxLFxuICAgIE1NTTogNjYxLFxuICAgIE1PTTogODQxLFxuICB9O1xuICB0aGlzLlRRMV9fID0ge1xuICAgIEJISEg6IC0yMjcsXG4gICAgQkhISTogMzE2LFxuICAgIEJISUg6IC0xMzIsXG4gICAgQklISDogNjAsXG4gICAgQklJSTogMTU5NSxcbiAgICBCTkhIOiAtNzQ0LFxuICAgIEJPSEg6IDIyNSxcbiAgICBCT09POiAtOTA4LFxuICAgIE9BS0s6IDQ4MixcbiAgICBPSEhIOiAyODEsXG4gICAgT0hJSDogMjQ5LFxuICAgIE9JSEk6IDIwMCxcbiAgICBPSUlIOiAtNjgsXG4gIH07XG4gIHRoaXMuVFEyX18gPSB7IEJJSEg6IC0xNDAxLCBCSUlJOiAtMTAzMywgQktBSzogLTU0MywgQk9PTzogLTU1OTEgfTtcbiAgdGhpcy5UUTNfXyA9IHtcbiAgICBCSEhIOiA0NzgsXG4gICAgQkhITTogLTEwNzMsXG4gICAgQkhJSDogMjIyLFxuICAgIEJISUk6IC01MDQsXG4gICAgQklJSDogLTExNixcbiAgICBCSUlJOiAtMTA1LFxuICAgIEJNSEk6IC04NjMsXG4gICAgQk1ITTogLTQ2NCxcbiAgICBCT01IOiA2MjAsXG4gICAgT0hISDogMzQ2LFxuICAgIE9ISEk6IDE3MjksXG4gICAgT0hJSTogOTk3LFxuICAgIE9ITUg6IDQ4MSxcbiAgICBPSUhIOiA2MjMsXG4gICAgT0lJSDogMTM0NCxcbiAgICBPS0FLOiAyNzkyLFxuICAgIE9LSEg6IDU4NyxcbiAgICBPS0tBOiA2NzksXG4gICAgT09ISDogMTEwLFxuICAgIE9PSUk6IC02ODUsXG4gIH07XG4gIHRoaXMuVFE0X18gPSB7XG4gICAgQkhISDogLTcyMSxcbiAgICBCSEhNOiAtMzYwNCxcbiAgICBCSElJOiAtOTY2LFxuICAgIEJJSUg6IC02MDcsXG4gICAgQklJSTogLTIxODEsXG4gICAgT0FBQTogLTI3NjMsXG4gICAgT0FLSzogMTgwLFxuICAgIE9ISEg6IC0yOTQsXG4gICAgT0hISTogMjQ0NixcbiAgICBPSEhPOiA0ODAsXG4gICAgT0hJSDogLTE1NzMsXG4gICAgT0lISDogMTkzNSxcbiAgICBPSUhJOiAtNDkzLFxuICAgIE9JSUg6IDYyNixcbiAgICBPSUlJOiAtNDAwNyxcbiAgICBPS0FLOiAtODE1NixcbiAgfTtcbiAgdGhpcy5UVzFfXyA9IHsg44Gr44Gk44GEOiAtNDY4MSwg5p2x5Lqs6YO9OiAyMDI2IH07XG4gIHRoaXMuVFcyX18gPSB7XG4gICAg44GC44KL56iLOiAtMjA0OSxcbiAgICDjgYTjgaPjgZ86IC0xMjU2LFxuICAgIOOBk+OCjeOBjDogLTI0MzQsXG4gICAg44GX44KH44GGOiAzODczLFxuICAgIOOBneOBruW+jDogLTQ0MzAsXG4gICAg44Gg44Gj44GmOiAtMTA0OSxcbiAgICDjgabjgYTjgZ86IDE4MzMsXG4gICAg44Go44GX44GmOiAtNDY1NyxcbiAgICDjgajjgoLjgas6IC00NTE3LFxuICAgIOOCguOBruOBpzogMTg4MixcbiAgICDkuIDmsJfjgas6IC03OTIsXG4gICAg5Yid44KB44GmOiAtMTUxMixcbiAgICDlkIzmmYLjgas6IC04MDk3LFxuICAgIOWkp+OBjeOBqjogLTEyNTUsXG4gICAg5a++44GX44GmOiAtMjcyMSxcbiAgICDnpL7kvJrlhZo6IC0zMjE2LFxuICB9O1xuICB0aGlzLlRXM19fID0ge1xuICAgIOOBhOOBn+OBoDogLTE3MzQsXG4gICAg44GX44Gm44GEOiAxMzE0LFxuICAgIOOBqOOBl+OBpjogLTQzMTQsXG4gICAg44Gr44Gk44GEOiAtNTQ4MyxcbiAgICDjgavjgajjgaM6IC01OTg5LFxuICAgIOOBq+W9k+OBnzogLTYyNDcsXG4gICAgXCLjga7jgacsXCI6IC03MjcsXG4gICAgXCLjga7jgafjgIFcIjogLTcyNyxcbiAgICDjga7jgoLjga46IC02MDAsXG4gICAg44KM44GL44KJOiAtMzc1MixcbiAgICDljYHkuozmnIg6IC0yMjg3LFxuICB9O1xuICB0aGlzLlRXNF9fID0ge1xuICAgIFwi44GE44GGLlwiOiA4NTc2LFxuICAgIFwi44GE44GG44CCXCI6IDg1NzYsXG4gICAg44GL44KJ44GqOiAtMjM0OCxcbiAgICDjgZfjgabjgYQ6IDI5NTgsXG4gICAgXCLjgZ/jgYwsXCI6IDE1MTYsXG4gICAgXCLjgZ/jgYzjgIFcIjogMTUxNixcbiAgICDjgabjgYTjgos6IDE1MzgsXG4gICAg44Go44GE44GGOiAxMzQ5LFxuICAgIOOBvuOBl+OBnzogNTU0MyxcbiAgICDjgb7jgZvjgpM6IDEwOTcsXG4gICAg44KI44GG44GoOiAtNDI1OCxcbiAgICDjgojjgovjgag6IDU4NjUsXG4gIH07XG4gIHRoaXMuVUMxX18gPSB7IEE6IDQ4NCwgSzogOTMsIE06IDY0NSwgTzogLTUwNSB9O1xuICB0aGlzLlVDMl9fID0geyBBOiA4MTksIEg6IDEwNTksIEk6IDQwOSwgTTogMzk4NywgTjogNTc3NSwgTzogNjQ2IH07XG4gIHRoaXMuVUMzX18gPSB7IEE6IC0xMzcwLCBJOiAyMzExIH07XG4gIHRoaXMuVUM0X18gPSB7XG4gICAgQTogLTI2NDMsXG4gICAgSDogMTgwOSxcbiAgICBJOiAtMTAzMixcbiAgICBLOiAtMzQ1MCxcbiAgICBNOiAzNTY1LFxuICAgIE46IDM4NzYsXG4gICAgTzogNjY0NixcbiAgfTtcbiAgdGhpcy5VQzVfXyA9IHsgSDogMzEzLCBJOiAtMTIzOCwgSzogLTc5OSwgTTogNTM5LCBPOiAtODMxIH07XG4gIHRoaXMuVUM2X18gPSB7IEg6IC01MDYsIEk6IC0yNTMsIEs6IDg3LCBNOiAyNDcsIE86IC0zODcgfTtcbiAgdGhpcy5VUDFfXyA9IHsgTzogLTIxNCB9O1xuICB0aGlzLlVQMl9fID0geyBCOiA2OSwgTzogOTM1IH07XG4gIHRoaXMuVVAzX18gPSB7IEI6IDE4OSB9O1xuICB0aGlzLlVRMV9fID0ge1xuICAgIEJIOiAyMSxcbiAgICBCSTogLTEyLFxuICAgIEJLOiAtOTksXG4gICAgQk46IDE0MixcbiAgICBCTzogLTU2LFxuICAgIE9IOiAtOTUsXG4gICAgT0k6IDQ3NyxcbiAgICBPSzogNDEwLFxuICAgIE9POiAtMjQyMixcbiAgfTtcbiAgdGhpcy5VUTJfXyA9IHsgQkg6IDIxNiwgQkk6IDExMywgT0s6IDE3NTkgfTtcbiAgdGhpcy5VUTNfXyA9IHtcbiAgICBCQTogLTQ3OSxcbiAgICBCSDogNDIsXG4gICAgQkk6IDE5MTMsXG4gICAgQks6IC03MTk4LFxuICAgIEJNOiAzMTYwLFxuICAgIEJOOiA2NDI3LFxuICAgIEJPOiAxNDc2MSxcbiAgICBPSTogLTgyNyxcbiAgICBPTjogLTMyMTIsXG4gIH07XG4gIHRoaXMuVVcxX18gPSB7XG4gICAgXCIsXCI6IDE1NixcbiAgICBcIuOAgVwiOiAxNTYsXG4gICAgXCLjgIxcIjogLTQ2MyxcbiAgICDjgYI6IC05NDEsXG4gICAg44GGOiAtMTI3LFxuICAgIOOBjDogLTU1MyxcbiAgICDjgY06IDEyMSxcbiAgICDjgZM6IDUwNSxcbiAgICDjgac6IC0yMDEsXG4gICAg44GoOiAtNTQ3LFxuICAgIOOBqTogLTEyMyxcbiAgICDjgas6IC03ODksXG4gICAg44GuOiAtMTg1LFxuICAgIOOBrzogLTg0NyxcbiAgICDjgoI6IC00NjYsXG4gICAg44KEOiAtNDcwLFxuICAgIOOCiDogMTgyLFxuICAgIOOCiTogLTI5MixcbiAgICDjgoo6IDIwOCxcbiAgICDjgow6IDE2OSxcbiAgICDjgpI6IC00NDYsXG4gICAg44KTOiAtMTM3LFxuICAgIFwi44O7XCI6IC0xMzUsXG4gICAg5Li7OiAtNDAyLFxuICAgIOS6rDogLTI2OCxcbiAgICDljLo6IC05MTIsXG4gICAg5Y2IOiA4NzEsXG4gICAg5Zu9OiAtNDYwLFxuICAgIOWkpzogNTYxLFxuICAgIOWnlDogNzI5LFxuICAgIOW4gjogLTQxMSxcbiAgICDml6U6IC0xNDEsXG4gICAg55CGOiAzNjEsXG4gICAg55SfOiAtNDA4LFxuICAgIOecjDogLTM4NixcbiAgICDpg706IC03MTgsXG4gICAgXCLvvaJcIjogLTQ2MyxcbiAgICBcIu+9pVwiOiAtMTM1LFxuICB9O1xuICB0aGlzLlVXMl9fID0ge1xuICAgIFwiLFwiOiAtODI5LFxuICAgIFwi44CBXCI6IC04MjksXG4gICAg44CHOiA4OTIsXG4gICAgXCLjgIxcIjogLTY0NSxcbiAgICBcIuOAjVwiOiAzMTQ1LFxuICAgIOOBgjogLTUzOCxcbiAgICDjgYQ6IDUwNSxcbiAgICDjgYY6IDEzNCxcbiAgICDjgYo6IC01MDIsXG4gICAg44GLOiAxNDU0LFxuICAgIOOBjDogLTg1NixcbiAgICDjgY86IC00MTIsXG4gICAg44GTOiAxMTQxLFxuICAgIOOBlTogODc4LFxuICAgIOOBljogNTQwLFxuICAgIOOBlzogMTUyOSxcbiAgICDjgZk6IC02NzUsXG4gICAg44GbOiAzMDAsXG4gICAg44GdOiAtMTAxMSxcbiAgICDjgZ86IDE4OCxcbiAgICDjgaA6IDE4MzcsXG4gICAg44GkOiAtOTQ5LFxuICAgIOOBpjogLTI5MSxcbiAgICDjgac6IC0yNjgsXG4gICAg44GoOiAtOTgxLFxuICAgIOOBqTogMTI3MyxcbiAgICDjgao6IDEwNjMsXG4gICAg44GrOiAtMTc2NCxcbiAgICDjga46IDEzMCxcbiAgICDjga86IC00MDksXG4gICAg44GyOiAtMTI3MyxcbiAgICDjgbk6IDEyNjEsXG4gICAg44G+OiA2MDAsXG4gICAg44KCOiAtMTI2MyxcbiAgICDjgoQ6IC00MDIsXG4gICAg44KIOiAxNjM5LFxuICAgIOOCijogLTU3OSxcbiAgICDjgos6IC02OTQsXG4gICAg44KMOiA1NzEsXG4gICAg44KSOiAtMjUxNixcbiAgICDjgpM6IDIwOTUsXG4gICAg44KiOiAtNTg3LFxuICAgIOOCqzogMzA2LFxuICAgIOOCrTogNTY4LFxuICAgIOODgzogODMxLFxuICAgIOS4iTogLTc1OCxcbiAgICDkuI06IC0yMTUwLFxuICAgIOS4ljogLTMwMixcbiAgICDkuK06IC05NjgsXG4gICAg5Li7OiAtODYxLFxuICAgIOS6izogNDkyLFxuICAgIOS6ujogLTEyMyxcbiAgICDkvJo6IDk3OCxcbiAgICDkv506IDM2MixcbiAgICDlhaU6IDU0OCxcbiAgICDliJ06IC0zMDI1LFxuICAgIOWJrzogLTE1NjYsXG4gICAg5YyXOiAtMzQxNCxcbiAgICDljLo6IC00MjIsXG4gICAg5aSnOiAtMTc2OSxcbiAgICDlpKk6IC04NjUsXG4gICAg5aSqOiAtNDgzLFxuICAgIOWtkDogLTE1MTksXG4gICAg5a2mOiA3NjAsXG4gICAg5a6fOiAxMDIzLFxuICAgIOWwjzogLTIwMDksXG4gICAg5biCOiAtODEzLFxuICAgIOW5tDogLTEwNjAsXG4gICAg5by3OiAxMDY3LFxuICAgIOaJizogLTE1MTksXG4gICAg5o+6OiAtMTAzMyxcbiAgICDmlL86IDE1MjIsXG4gICAg5paHOiAtMTM1NSxcbiAgICDmlrA6IC0xNjgyLFxuICAgIOaXpTogLTE4MTUsXG4gICAg5piOOiAtMTQ2MixcbiAgICDmnIA6IC02MzAsXG4gICAg5pydOiAtMTg0MyxcbiAgICDmnKw6IC0xNjUwLFxuICAgIOadsTogLTkzMSxcbiAgICDmnpw6IC02NjUsXG4gICAg5qyhOiAtMjM3OCxcbiAgICDmsJE6IC0xODAsXG4gICAg5rCXOiAtMTc0MCxcbiAgICDnkIY6IDc1MixcbiAgICDnmbo6IDUyOSxcbiAgICDnm646IC0xNTg0LFxuICAgIOebuDogLTI0MixcbiAgICDnnIw6IC0xMTY1LFxuICAgIOerizogLTc2MyxcbiAgICDnrKw6IDgxMCxcbiAgICDnsbM6IDUwOSxcbiAgICDoh6o6IC0xMzUzLFxuICAgIOihjDogODM4LFxuICAgIOilvzogLTc0NCxcbiAgICDopos6IC0zODc0LFxuICAgIOiqvzogMTAxMCxcbiAgICDorbA6IDExOTgsXG4gICAg6L68OiAzMDQxLFxuICAgIOmWizogMTc1OCxcbiAgICDplpM6IC0xMjU3LFxuICAgIFwi772iXCI6IC02NDUsXG4gICAgXCLvvaNcIjogMzE0NSxcbiAgICDvva86IDgzMSxcbiAgICDvvbE6IC01ODcsXG4gICAg7722OiAzMDYsXG4gICAg7723OiA1NjgsXG4gIH07XG4gIHRoaXMuVVczX18gPSB7XG4gICAgXCIsXCI6IDQ4ODksXG4gICAgMTogLTgwMCxcbiAgICBcIuKIklwiOiAtMTcyMyxcbiAgICBcIuOAgVwiOiA0ODg5LFxuICAgIOOAhTogLTIzMTEsXG4gICAg44CHOiA1ODI3LFxuICAgIFwi44CNXCI6IDI2NzAsXG4gICAgXCLjgJNcIjogLTM1NzMsXG4gICAg44GCOiAtMjY5NixcbiAgICDjgYQ6IDEwMDYsXG4gICAg44GGOiAyMzQyLFxuICAgIOOBiDogMTk4MyxcbiAgICDjgYo6IC00ODY0LFxuICAgIOOBizogLTExNjMsXG4gICAg44GMOiAzMjcxLFxuICAgIOOBjzogMTAwNCxcbiAgICDjgZE6IDM4OCxcbiAgICDjgZI6IDQwMSxcbiAgICDjgZM6IC0zNTUyLFxuICAgIOOBlDogLTMxMTYsXG4gICAg44GVOiAtMTA1OCxcbiAgICDjgZc6IC0zOTUsXG4gICAg44GZOiA1ODQsXG4gICAg44GbOiAzNjg1LFxuICAgIOOBnTogLTUyMjgsXG4gICAg44GfOiA4NDIsXG4gICAg44GhOiAtNTIxLFxuICAgIOOBozogLTE0NDQsXG4gICAg44GkOiAtMTA4MSxcbiAgICDjgaY6IDYxNjcsXG4gICAg44GnOiAyMzE4LFxuICAgIOOBqDogMTY5MSxcbiAgICDjgak6IC04OTksXG4gICAg44GqOiAtMjc4OCxcbiAgICDjgas6IDI3NDUsXG4gICAg44GuOiA0MDU2LFxuICAgIOOBrzogNDU1NSxcbiAgICDjgbI6IC0yMTcxLFxuICAgIOOBtTogLTE3OTgsXG4gICAg44G4OiAxMTk5LFxuICAgIOOBuzogLTU1MTYsXG4gICAg44G+OiAtNDM4NCxcbiAgICDjgb86IC0xMjAsXG4gICAg44KBOiAxMjA1LFxuICAgIOOCgjogMjMyMyxcbiAgICDjgoQ6IC03ODgsXG4gICAg44KIOiAtMjAyLFxuICAgIOOCiTogNzI3LFxuICAgIOOCijogNjQ5LFxuICAgIOOCizogNTkwNSxcbiAgICDjgow6IDI3NzMsXG4gICAg44KPOiAtMTIwNyxcbiAgICDjgpI6IDY2MjAsXG4gICAg44KTOiAtNTE4LFxuICAgIOOCojogNTUxLFxuICAgIOOCsDogMTMxOSxcbiAgICDjgrk6IDg3NCxcbiAgICDjg4M6IC0xMzUwLFxuICAgIOODiDogNTIxLFxuICAgIOODoDogMTEwOSxcbiAgICDjg6s6IDE1OTEsXG4gICAg44OtOiAyMjAxLFxuICAgIOODszogMjc4LFxuICAgIFwi44O7XCI6IC0zNzk0LFxuICAgIOS4gDogLTE2MTksXG4gICAg5LiLOiAtMTc1OSxcbiAgICDkuJY6IC0yMDg3LFxuICAgIOS4oTogMzgxNSxcbiAgICDkuK06IDY1MyxcbiAgICDkuLs6IC03NTgsXG4gICAg5LqIOiAtMTE5MyxcbiAgICDkuow6IDk3NCxcbiAgICDkuro6IDI3NDIsXG4gICAg5LuKOiA3OTIsXG4gICAg5LuWOiAxODg5LFxuICAgIOS7pTogLTEzNjgsXG4gICAg5L2OOiA4MTEsXG4gICAg5L2VOiA0MjY1LFxuICAgIOS9nDogLTM2MSxcbiAgICDkv506IC0yNDM5LFxuICAgIOWFgzogNDg1OCxcbiAgICDlhZo6IDM1OTMsXG4gICAg5YWoOiAxNTc0LFxuICAgIOWFrDogLTMwMzAsXG4gICAg5YWtOiA3NTUsXG4gICAg5YWxOiAtMTg4MCxcbiAgICDlhoY6IDU4MDcsXG4gICAg5YaNOiAzMDk1LFxuICAgIOWIhjogNDU3LFxuICAgIOWInTogMjQ3NSxcbiAgICDliKU6IDExMjksXG4gICAg5YmNOiAyMjg2LFxuICAgIOWJrzogNDQzNyxcbiAgICDlips6IDM2NSxcbiAgICDli5U6IC05NDksXG4gICAg5YuZOiAtMTg3MixcbiAgICDljJY6IDEzMjcsXG4gICAg5YyXOiAtMTAzOCxcbiAgICDljLo6IDQ2NDYsXG4gICAg5Y2DOiAtMjMwOSxcbiAgICDljYg6IC03ODMsXG4gICAg5Y2UOiAtMTAwNixcbiAgICDlj6M6IDQ4MyxcbiAgICDlj7M6IDEyMzMsXG4gICAg5ZCEOiAzNTg4LFxuICAgIOWQiDogLTI0MSxcbiAgICDlkIw6IDM5MDYsXG4gICAg5ZKMOiAtODM3LFxuICAgIOWToTogNDUxMyxcbiAgICDlm706IDY0MixcbiAgICDlnos6IDEzODksXG4gICAg5aC0OiAxMjE5LFxuICAgIOWkljogLTI0MSxcbiAgICDlprs6IDIwMTYsXG4gICAg5a2mOiAtMTM1NixcbiAgICDlrok6IC00MjMsXG4gICAg5a6fOiAtMTAwOCxcbiAgICDlrrY6IDEwNzgsXG4gICAg5bCPOiAtNTEzLFxuICAgIOWwkTogLTMxMDIsXG4gICAg5beeOiAxMTU1LFxuICAgIOW4gjogMzE5NyxcbiAgICDlubM6IC0xODA0LFxuICAgIOW5tDogMjQxNixcbiAgICDluoM6IC0xMDMwLFxuICAgIOW6nDogMTYwNSxcbiAgICDluqY6IDE0NTIsXG4gICAg5bu6OiAtMjM1MixcbiAgICDlvZM6IC0zODg1LFxuICAgIOW+lzogMTkwNSxcbiAgICDmgJ06IC0xMjkxLFxuICAgIOaApzogMTgyMixcbiAgICDmiLg6IC00ODgsXG4gICAg5oyHOiAtMzk3MyxcbiAgICDmlL86IC0yMDEzLFxuICAgIOaVmTogLTE0NzksXG4gICAg5pWwOiAzMjIyLFxuICAgIOaWhzogLTE0ODksXG4gICAg5pawOiAxNzY0LFxuICAgIOaXpTogMjA5OSxcbiAgICDml6c6IDU3OTIsXG4gICAg5pioOiAtNjYxLFxuICAgIOaZgjogLTEyNDgsXG4gICAg5pucOiAtOTUxLFxuICAgIOacgDogLTkzNyxcbiAgICDmnIg6IDQxMjUsXG4gICAg5pyfOiAzNjAsXG4gICAg5p2OOiAzMDk0LFxuICAgIOadkTogMzY0LFxuICAgIOadsTogLTgwNSxcbiAgICDmoLg6IDUxNTYsXG4gICAg5qOuOiAyNDM4LFxuICAgIOalrTogNDg0LFxuICAgIOawjzogMjYxMyxcbiAgICDmsJE6IC0xNjk0LFxuICAgIOaxujogLTEwNzMsXG4gICAg5rOVOiAxODY4LFxuICAgIOa1tzogLTQ5NSxcbiAgICDnhKE6IDk3OSxcbiAgICDniak6IDQ2MSxcbiAgICDnibk6IC0zODUwLFxuICAgIOeUnzogLTI3MyxcbiAgICDnlKg6IDkxNCxcbiAgICDnlLo6IDEyMTUsXG4gICAg55qEOiA3MzEzLFxuICAgIOebtDogLTE4MzUsXG4gICAg55yBOiA3OTIsXG4gICAg55yMOiA2MjkzLFxuICAgIOefpTogLTE1MjgsXG4gICAg56eBOiA0MjMxLFxuICAgIOeojjogNDAxLFxuICAgIOerizogLTk2MCxcbiAgICDnrKw6IDEyMDEsXG4gICAg57GzOiA3NzY3LFxuICAgIOezuzogMzA2NixcbiAgICDntIQ6IDM2NjMsXG4gICAg57SaOiAxMzg0LFxuICAgIOe1sTogLTQyMjksXG4gICAg57ePOiAxMTYzLFxuICAgIOe3mjogMTI1NSxcbiAgICDogIU6IDY0NTcsXG4gICAg6IO9OiA3MjUsXG4gICAg6IeqOiAtMjg2OSxcbiAgICDoi7E6IDc4NSxcbiAgICDopos6IDEwNDQsXG4gICAg6Kq/OiAtNTYyLFxuICAgIOiyoTogLTczMyxcbiAgICDosrs6IDE3NzcsXG4gICAg6LuKOiAxODM1LFxuICAgIOi7jTogMTM3NSxcbiAgICDovrw6IC0xNTA0LFxuICAgIOmAmjogLTExMzYsXG4gICAg6YG4OiAtNjgxLFxuICAgIOmDjjogMTAyNixcbiAgICDpg6E6IDQ0MDQsXG4gICAg6YOoOiAxMjAwLFxuICAgIOmHkTogMjE2MyxcbiAgICDplbc6IDQyMSxcbiAgICDplos6IC0xNDMyLFxuICAgIOmWkzogMTMwMixcbiAgICDplqI6IC0xMjgyLFxuICAgIOmbqDogMjAwOSxcbiAgICDpm7s6IC0xMDQ1LFxuICAgIOmdnjogMjA2NixcbiAgICDpp4U6IDE2MjAsXG4gICAgXCLvvJFcIjogLTgwMCxcbiAgICBcIu+9o1wiOiAyNjcwLFxuICAgIFwi772lXCI6IC0zNzk0LFxuICAgIO+9rzogLTEzNTAsXG4gICAg772xOiA1NTEsXG4gICAg7724776eOiAxMzE5LFxuICAgIO+9vTogODc0LFxuICAgIO++hDogNTIxLFxuICAgIO++kTogMTEwOSxcbiAgICDvvpk6IDE1OTEsXG4gICAg776bOiAyMjAxLFxuICAgIO++nTogMjc4LFxuICB9O1xuICB0aGlzLlVXNF9fID0ge1xuICAgIFwiLFwiOiAzOTMwLFxuICAgIFwiLlwiOiAzNTA4LFxuICAgIFwi4oCVXCI6IC00ODQxLFxuICAgIFwi44CBXCI6IDM5MzAsXG4gICAgXCLjgIJcIjogMzUwOCxcbiAgICDjgIc6IDQ5OTksXG4gICAgXCLjgIxcIjogMTg5NSxcbiAgICBcIuOAjVwiOiAzNzk4LFxuICAgIFwi44CTXCI6IC01MTU2LFxuICAgIOOBgjogNDc1MixcbiAgICDjgYQ6IC0zNDM1LFxuICAgIOOBhjogLTY0MCxcbiAgICDjgYg6IC0yNTE0LFxuICAgIOOBijogMjQwNSxcbiAgICDjgYs6IDUzMCxcbiAgICDjgYw6IDYwMDYsXG4gICAg44GNOiAtNDQ4MixcbiAgICDjgY46IC0zODIxLFxuICAgIOOBjzogLTM3ODgsXG4gICAg44GROiAtNDM3NixcbiAgICDjgZI6IC00NzM0LFxuICAgIOOBkzogMjI1NSxcbiAgICDjgZQ6IDE5NzksXG4gICAg44GVOiAyODY0LFxuICAgIOOBlzogLTg0MyxcbiAgICDjgZg6IC0yNTA2LFxuICAgIOOBmTogLTczMSxcbiAgICDjgZo6IDEyNTEsXG4gICAg44GbOiAxODEsXG4gICAg44GdOiA0MDkxLFxuICAgIOOBnzogNTAzNCxcbiAgICDjgaA6IDU0MDgsXG4gICAg44GhOiAtMzY1NCxcbiAgICDjgaM6IC01ODgyLFxuICAgIOOBpDogLTE2NTksXG4gICAg44GmOiAzOTk0LFxuICAgIOOBpzogNzQxMCxcbiAgICDjgag6IDQ1NDcsXG4gICAg44GqOiA1NDMzLFxuICAgIOOBqzogNjQ5OSxcbiAgICDjgaw6IDE4NTMsXG4gICAg44GtOiAxNDEzLFxuICAgIOOBrjogNzM5NixcbiAgICDjga86IDg1NzgsXG4gICAg44GwOiAxOTQwLFxuICAgIOOBsjogNDI0OSxcbiAgICDjgbM6IC00MTM0LFxuICAgIOOBtTogMTM0NSxcbiAgICDjgbg6IDY2NjUsXG4gICAg44G5OiAtNzQ0LFxuICAgIOOBuzogMTQ2NCxcbiAgICDjgb46IDEwNTEsXG4gICAg44G/OiAtMjA4MixcbiAgICDjgoA6IC04ODIsXG4gICAg44KBOiAtNTA0NixcbiAgICDjgoI6IDQxNjksXG4gICAg44KDOiAtMjY2NixcbiAgICDjgoQ6IDI3OTUsXG4gICAg44KHOiAtMTU0NCxcbiAgICDjgog6IDMzNTEsXG4gICAg44KJOiAtMjkyMixcbiAgICDjgoo6IC05NzI2LFxuICAgIOOCizogLTE0ODk2LFxuICAgIOOCjDogLTI2MTMsXG4gICAg44KNOiAtNDU3MCxcbiAgICDjgo86IC0xNzgzLFxuICAgIOOCkjogMTMxNTAsXG4gICAg44KTOiAtMjM1MixcbiAgICDjgqs6IDIxNDUsXG4gICAg44KzOiAxNzg5LFxuICAgIOOCuzogMTI4NyxcbiAgICDjg4M6IC03MjQsXG4gICAg44OIOiAtNDAzLFxuICAgIOODoTogLTE2MzUsXG4gICAg44OpOiAtODgxLFxuICAgIOODqjogLTU0MSxcbiAgICDjg6s6IC04NTYsXG4gICAg44OzOiAtMzYzNyxcbiAgICBcIuODu1wiOiAtNDM3MSxcbiAgICDjg7w6IC0xMTg3MCxcbiAgICDkuIA6IC0yMDY5LFxuICAgIOS4rTogMjIxMCxcbiAgICDkuog6IDc4MixcbiAgICDkuos6IC0xOTAsXG4gICAg5LqVOiAtMTc2OCxcbiAgICDkuro6IDEwMzYsXG4gICAg5LulOiA1NDQsXG4gICAg5LyaOiA5NTAsXG4gICAg5L2TOiAtMTI4NixcbiAgICDkvZw6IDUzMCxcbiAgICDlgbQ6IDQyOTIsXG4gICAg5YWIOiA2MDEsXG4gICAg5YWaOiAtMjAwNixcbiAgICDlhbE6IC0xMjEyLFxuICAgIOWGhTogNTg0LFxuICAgIOWGhjogNzg4LFxuICAgIOWInTogMTM0NyxcbiAgICDliY06IDE2MjMsXG4gICAg5YmvOiAzODc5LFxuICAgIOWKmzogLTMwMixcbiAgICDli5U6IC03NDAsXG4gICAg5YuZOiAtMjcxNSxcbiAgICDljJY6IDc3NixcbiAgICDljLo6IDQ1MTcsXG4gICAg5Y2UOiAxMDEzLFxuICAgIOWPgjogMTU1NSxcbiAgICDlkIg6IC0xODM0LFxuICAgIOWSjDogLTY4MSxcbiAgICDlk6E6IC05MTAsXG4gICAg5ZmoOiAtODUxLFxuICAgIOWbnjogMTUwMCxcbiAgICDlm706IC02MTksXG4gICAg5ZySOiAtMTIwMCxcbiAgICDlnLA6IDg2NixcbiAgICDloLQ6IC0xNDEwLFxuICAgIOWhgTogLTIwOTQsXG4gICAg5aOrOiAtMTQxMyxcbiAgICDlpJo6IDEwNjcsXG4gICAg5aSnOiA1NzEsXG4gICAg5a2QOiAtNDgwMixcbiAgICDlraY6IC0xMzk3LFxuICAgIOWumjogLTEwNTcsXG4gICAg5a+6OiAtODA5LFxuICAgIOWwjzogMTkxMCxcbiAgICDlsYs6IC0xMzI4LFxuICAgIOWxsTogLTE1MDAsXG4gICAg5bO2OiAtMjA1NixcbiAgICDlt506IC0yNjY3LFxuICAgIOW4gjogMjc3MSxcbiAgICDlubQ6IDM3NCxcbiAgICDluoE6IC00NTU2LFxuICAgIOW+jDogNDU2LFxuICAgIOaApzogNTUzLFxuICAgIOaEnzogOTE2LFxuICAgIOaJgDogLTE1NjYsXG4gICAg5pSvOiA4NTYsXG4gICAg5pS5OiA3ODcsXG4gICAg5pS/OiAyMTgyLFxuICAgIOaVmTogNzA0LFxuICAgIOaWhzogNTIyLFxuICAgIOaWuTogLTg1NixcbiAgICDml6U6IDE3OTgsXG4gICAg5pmCOiAxODI5LFxuICAgIOacgDogODQ1LFxuICAgIOaciDogLTkwNjYsXG4gICAg5pyoOiAtNDg1LFxuICAgIOadpTogLTQ0MixcbiAgICDmoKE6IC0zNjAsXG4gICAg5qWtOiAtMTA0MyxcbiAgICDmsI86IDUzODgsXG4gICAg5rCROiAtMjcxNixcbiAgICDmsJc6IC05MTAsXG4gICAg5rKiOiAtOTM5LFxuICAgIOa4iDogLTU0MyxcbiAgICDniak6IC03MzUsXG4gICAg546HOiA2NzIsXG4gICAg55CDOiAtMTI2NyxcbiAgICDnlJ86IC0xMjg2LFxuICAgIOeUozogLTExMDEsXG4gICAg55SwOiAtMjkwMCxcbiAgICDnlLo6IDE4MjYsXG4gICAg55qEOiAyNTg2LFxuICAgIOebrjogOTIyLFxuICAgIOecgTogLTM0ODUsXG4gICAg55yMOiAyOTk3LFxuICAgIOepujogLTg2NyxcbiAgICDnq4s6IC0yMTEyLFxuICAgIOesrDogNzg4LFxuICAgIOexszogMjkzNyxcbiAgICDns7s6IDc4NixcbiAgICDntIQ6IDIxNzEsXG4gICAg57WMOiAxMTQ2LFxuICAgIOe1sTogLTExNjksXG4gICAg57ePOiA5NDAsXG4gICAg57eaOiAtOTk0LFxuICAgIOe9sjogNzQ5LFxuICAgIOiAhTogMjE0NSxcbiAgICDog706IC03MzAsXG4gICAg6IisOiAtODUyLFxuICAgIOihjDogLTc5MixcbiAgICDopo86IDc5MixcbiAgICDoraY6IC0xMTg0LFxuICAgIOitsDogLTI0NCxcbiAgICDosLc6IC0xMDAwLFxuICAgIOiznjogNzMwLFxuICAgIOi7ijogLTE0ODEsXG4gICAg6LuNOiAxMTU4LFxuICAgIOi8qjogLTE0MzMsXG4gICAg6L68OiAtMzM3MCxcbiAgICDov5E6IDkyOSxcbiAgICDpgZM6IC0xMjkxLFxuICAgIOmBuDogMjU5NixcbiAgICDpg446IC00ODY2LFxuICAgIOmDvTogMTE5MixcbiAgICDph446IC0xMTAwLFxuICAgIOmKgDogLTIyMTMsXG4gICAg6ZW3OiAzNTcsXG4gICAg6ZaTOiAtMjM0NCxcbiAgICDpmaI6IC0yMjk3LFxuICAgIOmamzogLTI2MDQsXG4gICAg6Zu7OiAtODc4LFxuICAgIOmgmDogLTE2NTksXG4gICAg6aGMOiAtNzkyLFxuICAgIOmkqDogLTE5ODQsXG4gICAg6aaWOiAxNzQ5LFxuICAgIOmrmDogMjEyMCxcbiAgICBcIu+9olwiOiAxODk1LFxuICAgIFwi772jXCI6IDM3OTgsXG4gICAgXCLvvaVcIjogLTQzNzEsXG4gICAg772vOiAtNzI0LFxuICAgIO+9sDogLTExODcwLFxuICAgIO+9tjogMjE0NSxcbiAgICDvvbo6IDE3ODksXG4gICAg772+OiAxMjg3LFxuICAgIO++hDogLTQwMyxcbiAgICDvvpI6IC0xNjM1LFxuICAgIO++lzogLTg4MSxcbiAgICDvvpg6IC01NDEsXG4gICAg776ZOiAtODU2LFxuICAgIO++nTogLTM2MzcsXG4gIH07XG4gIHRoaXMuVVc1X18gPSB7XG4gICAgXCIsXCI6IDQ2NSxcbiAgICBcIi5cIjogLTI5OSxcbiAgICAxOiAtNTE0LFxuICAgIEUyOiAtMzI3NjgsXG4gICAgXCJdXCI6IC0yNzYyLFxuICAgIFwi44CBXCI6IDQ2NSxcbiAgICBcIuOAglwiOiAtMjk5LFxuICAgIFwi44CMXCI6IDM2MyxcbiAgICDjgYI6IDE2NTUsXG4gICAg44GEOiAzMzEsXG4gICAg44GGOiAtNTAzLFxuICAgIOOBiDogMTE5OSxcbiAgICDjgYo6IDUyNyxcbiAgICDjgYs6IDY0NyxcbiAgICDjgYw6IC00MjEsXG4gICAg44GNOiAxNjI0LFxuICAgIOOBjjogMTk3MSxcbiAgICDjgY86IDMxMixcbiAgICDjgZI6IC05ODMsXG4gICAg44GVOiAtMTUzNyxcbiAgICDjgZc6IC0xMzcxLFxuICAgIOOBmTogLTg1MixcbiAgICDjgaA6IC0xMTg2LFxuICAgIOOBoTogMTA5MyxcbiAgICDjgaM6IDUyLFxuICAgIOOBpDogOTIxLFxuICAgIOOBpjogLTE4LFxuICAgIOOBpzogLTg1MCxcbiAgICDjgag6IC0xMjcsXG4gICAg44GpOiAxNjgyLFxuICAgIOOBqjogLTc4NyxcbiAgICDjgas6IC0xMjI0LFxuICAgIOOBrjogLTYzNSxcbiAgICDjga86IC01NzgsXG4gICAg44G5OiAxMDAxLFxuICAgIOOBvzogNTAyLFxuICAgIOOCgTogODY1LFxuICAgIOOCgzogMzM1MCxcbiAgICDjgoc6IDg1NCxcbiAgICDjgoo6IC0yMDgsXG4gICAg44KLOiA0MjksXG4gICAg44KMOiA1MDQsXG4gICAg44KPOiA0MTksXG4gICAg44KSOiAtMTI2NCxcbiAgICDjgpM6IDMyNyxcbiAgICDjgqQ6IDI0MSxcbiAgICDjg6s6IDQ1MSxcbiAgICDjg7M6IC0zNDMsXG4gICAg5LitOiAtODcxLFxuICAgIOS6rDogNzIyLFxuICAgIOS8mjogLTExNTMsXG4gICAg5YWaOiAtNjU0LFxuICAgIOWLmTogMzUxOSxcbiAgICDljLo6IC05MDEsXG4gICAg5ZGKOiA4NDgsXG4gICAg5ZOhOiAyMTA0LFxuICAgIOWkpzogLTEyOTYsXG4gICAg5a2mOiAtNTQ4LFxuICAgIOWumjogMTc4NSxcbiAgICDltZA6IC0xMzA0LFxuICAgIOW4gjogLTI5OTEsXG4gICAg5bitOiA5MjEsXG4gICAg5bm0OiAxNzYzLFxuICAgIOaAnTogODcyLFxuICAgIOaJgDogLTgxNCxcbiAgICDmjJk6IDE2MTgsXG4gICAg5pawOiAtMTY4MixcbiAgICDml6U6IDIxOCxcbiAgICDmnIg6IC00MzUzLFxuICAgIOafuzogOTMyLFxuICAgIOagvDogMTM1NixcbiAgICDmqZ86IC0xNTA4LFxuICAgIOawjzogLTEzNDcsXG4gICAg55SwOiAyNDAsXG4gICAg55S6OiAtMzkxMixcbiAgICDnmoQ6IC0zMTQ5LFxuICAgIOebuDogMTMxOSxcbiAgICDnnIE6IC0xMDUyLFxuICAgIOecjDogLTQwMDMsXG4gICAg56CUOiAtOTk3LFxuICAgIOekvjogLTI3OCxcbiAgICDnqbo6IC04MTMsXG4gICAg57WxOiAxOTU1LFxuICAgIOiAhTogLTIyMzMsXG4gICAg6KGoOiA2NjMsXG4gICAg6KqeOiAtMTA3MyxcbiAgICDorbA6IDEyMTksXG4gICAg6YG4OiAtMTAxOCxcbiAgICDpg446IC0zNjgsXG4gICAg6ZW3OiA3ODYsXG4gICAg6ZaTOiAxMTkxLFxuICAgIOmhjDogMjM2OCxcbiAgICDppKg6IC02ODksXG4gICAgXCLvvJFcIjogLTUxNCxcbiAgICDvvKXvvJI6IC0zMjc2OCxcbiAgICBcIu+9olwiOiAzNjMsXG4gICAg772yOiAyNDEsXG4gICAg776ZOiA0NTEsXG4gICAg776dOiAtMzQzLFxuICB9O1xuICB0aGlzLlVXNl9fID0ge1xuICAgIFwiLFwiOiAyMjcsXG4gICAgXCIuXCI6IDgwOCxcbiAgICAxOiAtMjcwLFxuICAgIEUxOiAzMDYsXG4gICAgXCLjgIFcIjogMjI3LFxuICAgIFwi44CCXCI6IDgwOCxcbiAgICDjgYI6IC0zMDcsXG4gICAg44GGOiAxODksXG4gICAg44GLOiAyNDEsXG4gICAg44GMOiAtNzMsXG4gICAg44GPOiAtMTIxLFxuICAgIOOBkzogLTIwMCxcbiAgICDjgZg6IDE3ODIsXG4gICAg44GZOiAzODMsXG4gICAg44GfOiAtNDI4LFxuICAgIOOBozogNTczLFxuICAgIOOBpjogLTEwMTQsXG4gICAg44GnOiAxMDEsXG4gICAg44GoOiAtMTA1LFxuICAgIOOBqjogLTI1MyxcbiAgICDjgas6IC0xNDksXG4gICAg44GuOiAtNDE3LFxuICAgIOOBrzogLTIzNixcbiAgICDjgoI6IC0yMDYsXG4gICAg44KKOiAxODcsXG4gICAg44KLOiAtMTM1LFxuICAgIOOCkjogMTk1LFxuICAgIOODqzogLTY3MyxcbiAgICDjg7M6IC00OTYsXG4gICAg5LiAOiAtMjc3LFxuICAgIOS4rTogMjAxLFxuICAgIOS7tjogLTgwMCxcbiAgICDkvJo6IDYyNCxcbiAgICDliY06IDMwMixcbiAgICDljLo6IDE3OTIsXG4gICAg5ZOhOiAtMTIxMixcbiAgICDlp5Q6IDc5OCxcbiAgICDlraY6IC05NjAsXG4gICAg5biCOiA4ODcsXG4gICAg5bqDOiAtNjk1LFxuICAgIOW+jDogNTM1LFxuICAgIOalrTogLTY5NyxcbiAgICDnm7g6IDc1MyxcbiAgICDnpL46IC01MDcsXG4gICAg56aPOiA5NzQsXG4gICAg56m6OiAtODIyLFxuICAgIOiAhTogMTgxMSxcbiAgICDpgKM6IDQ2MyxcbiAgICDpg446IDEwODIsXG4gICAgXCLvvJFcIjogLTI3MCxcbiAgICDvvKXvvJE6IDMwNixcbiAgICDvvpk6IC02NzMsXG4gICAg776dOiAtNDk2LFxuICB9O1xuXG4gIHJldHVybiB0aGlzO1xufVxuXG5UaW55U2VnbWVudGVyLnByb3RvdHlwZS5jdHlwZV8gPSBmdW5jdGlvbiAoc3RyKSB7XG4gIGZvciAodmFyIGkgaW4gdGhpcy5jaGFydHlwZV8pIHtcbiAgICBpZiAoc3RyLm1hdGNoKHRoaXMuY2hhcnR5cGVfW2ldWzBdKSkge1xuICAgICAgcmV0dXJuIHRoaXMuY2hhcnR5cGVfW2ldWzFdO1xuICAgIH1cbiAgfVxuICByZXR1cm4gXCJPXCI7XG59O1xuXG5UaW55U2VnbWVudGVyLnByb3RvdHlwZS50c18gPSBmdW5jdGlvbiAodikge1xuICBpZiAodikge1xuICAgIHJldHVybiB2O1xuICB9XG4gIHJldHVybiAwO1xufTtcblxuVGlueVNlZ21lbnRlci5wcm90b3R5cGUuc2VnbWVudCA9IGZ1bmN0aW9uIChpbnB1dCkge1xuICBpZiAoaW5wdXQgPT0gbnVsbCB8fCBpbnB1dCA9PSB1bmRlZmluZWQgfHwgaW5wdXQgPT0gXCJcIikge1xuICAgIHJldHVybiBbXTtcbiAgfVxuICB2YXIgcmVzdWx0ID0gW107XG4gIHZhciBzZWcgPSBbXCJCM1wiLCBcIkIyXCIsIFwiQjFcIl07XG4gIHZhciBjdHlwZSA9IFtcIk9cIiwgXCJPXCIsIFwiT1wiXTtcbiAgdmFyIG8gPSBpbnB1dC5zcGxpdChcIlwiKTtcbiAgZm9yIChpID0gMDsgaSA8IG8ubGVuZ3RoOyArK2kpIHtcbiAgICBzZWcucHVzaChvW2ldKTtcbiAgICBjdHlwZS5wdXNoKHRoaXMuY3R5cGVfKG9baV0pKTtcbiAgfVxuICBzZWcucHVzaChcIkUxXCIpO1xuICBzZWcucHVzaChcIkUyXCIpO1xuICBzZWcucHVzaChcIkUzXCIpO1xuICBjdHlwZS5wdXNoKFwiT1wiKTtcbiAgY3R5cGUucHVzaChcIk9cIik7XG4gIGN0eXBlLnB1c2goXCJPXCIpO1xuICB2YXIgd29yZCA9IHNlZ1szXTtcbiAgdmFyIHAxID0gXCJVXCI7XG4gIHZhciBwMiA9IFwiVVwiO1xuICB2YXIgcDMgPSBcIlVcIjtcbiAgZm9yICh2YXIgaSA9IDQ7IGkgPCBzZWcubGVuZ3RoIC0gMzsgKytpKSB7XG4gICAgdmFyIHNjb3JlID0gdGhpcy5CSUFTX187XG4gICAgdmFyIHcxID0gc2VnW2kgLSAzXTtcbiAgICB2YXIgdzIgPSBzZWdbaSAtIDJdO1xuICAgIHZhciB3MyA9IHNlZ1tpIC0gMV07XG4gICAgdmFyIHc0ID0gc2VnW2ldO1xuICAgIHZhciB3NSA9IHNlZ1tpICsgMV07XG4gICAgdmFyIHc2ID0gc2VnW2kgKyAyXTtcbiAgICB2YXIgYzEgPSBjdHlwZVtpIC0gM107XG4gICAgdmFyIGMyID0gY3R5cGVbaSAtIDJdO1xuICAgIHZhciBjMyA9IGN0eXBlW2kgLSAxXTtcbiAgICB2YXIgYzQgPSBjdHlwZVtpXTtcbiAgICB2YXIgYzUgPSBjdHlwZVtpICsgMV07XG4gICAgdmFyIGM2ID0gY3R5cGVbaSArIDJdO1xuICAgIHNjb3JlICs9IHRoaXMudHNfKHRoaXMuVVAxX19bcDFdKTtcbiAgICBzY29yZSArPSB0aGlzLnRzXyh0aGlzLlVQMl9fW3AyXSk7XG4gICAgc2NvcmUgKz0gdGhpcy50c18odGhpcy5VUDNfX1twM10pO1xuICAgIHNjb3JlICs9IHRoaXMudHNfKHRoaXMuQlAxX19bcDEgKyBwMl0pO1xuICAgIHNjb3JlICs9IHRoaXMudHNfKHRoaXMuQlAyX19bcDIgKyBwM10pO1xuICAgIHNjb3JlICs9IHRoaXMudHNfKHRoaXMuVVcxX19bdzFdKTtcbiAgICBzY29yZSArPSB0aGlzLnRzXyh0aGlzLlVXMl9fW3cyXSk7XG4gICAgc2NvcmUgKz0gdGhpcy50c18odGhpcy5VVzNfX1t3M10pO1xuICAgIHNjb3JlICs9IHRoaXMudHNfKHRoaXMuVVc0X19bdzRdKTtcbiAgICBzY29yZSArPSB0aGlzLnRzXyh0aGlzLlVXNV9fW3c1XSk7XG4gICAgc2NvcmUgKz0gdGhpcy50c18odGhpcy5VVzZfX1t3Nl0pO1xuICAgIHNjb3JlICs9IHRoaXMudHNfKHRoaXMuQlcxX19bdzIgKyB3M10pO1xuICAgIHNjb3JlICs9IHRoaXMudHNfKHRoaXMuQlcyX19bdzMgKyB3NF0pO1xuICAgIHNjb3JlICs9IHRoaXMudHNfKHRoaXMuQlczX19bdzQgKyB3NV0pO1xuICAgIHNjb3JlICs9IHRoaXMudHNfKHRoaXMuVFcxX19bdzEgKyB3MiArIHczXSk7XG4gICAgc2NvcmUgKz0gdGhpcy50c18odGhpcy5UVzJfX1t3MiArIHczICsgdzRdKTtcbiAgICBzY29yZSArPSB0aGlzLnRzXyh0aGlzLlRXM19fW3czICsgdzQgKyB3NV0pO1xuICAgIHNjb3JlICs9IHRoaXMudHNfKHRoaXMuVFc0X19bdzQgKyB3NSArIHc2XSk7XG4gICAgc2NvcmUgKz0gdGhpcy50c18odGhpcy5VQzFfX1tjMV0pO1xuICAgIHNjb3JlICs9IHRoaXMudHNfKHRoaXMuVUMyX19bYzJdKTtcbiAgICBzY29yZSArPSB0aGlzLnRzXyh0aGlzLlVDM19fW2MzXSk7XG4gICAgc2NvcmUgKz0gdGhpcy50c18odGhpcy5VQzRfX1tjNF0pO1xuICAgIHNjb3JlICs9IHRoaXMudHNfKHRoaXMuVUM1X19bYzVdKTtcbiAgICBzY29yZSArPSB0aGlzLnRzXyh0aGlzLlVDNl9fW2M2XSk7XG4gICAgc2NvcmUgKz0gdGhpcy50c18odGhpcy5CQzFfX1tjMiArIGMzXSk7XG4gICAgc2NvcmUgKz0gdGhpcy50c18odGhpcy5CQzJfX1tjMyArIGM0XSk7XG4gICAgc2NvcmUgKz0gdGhpcy50c18odGhpcy5CQzNfX1tjNCArIGM1XSk7XG4gICAgc2NvcmUgKz0gdGhpcy50c18odGhpcy5UQzFfX1tjMSArIGMyICsgYzNdKTtcbiAgICBzY29yZSArPSB0aGlzLnRzXyh0aGlzLlRDMl9fW2MyICsgYzMgKyBjNF0pO1xuICAgIHNjb3JlICs9IHRoaXMudHNfKHRoaXMuVEMzX19bYzMgKyBjNCArIGM1XSk7XG4gICAgc2NvcmUgKz0gdGhpcy50c18odGhpcy5UQzRfX1tjNCArIGM1ICsgYzZdKTtcbiAgICAvLyAgc2NvcmUgKz0gdGhpcy50c18odGhpcy5UQzVfX1tjNCArIGM1ICsgYzZdKTtcbiAgICBzY29yZSArPSB0aGlzLnRzXyh0aGlzLlVRMV9fW3AxICsgYzFdKTtcbiAgICBzY29yZSArPSB0aGlzLnRzXyh0aGlzLlVRMl9fW3AyICsgYzJdKTtcbiAgICBzY29yZSArPSB0aGlzLnRzXyh0aGlzLlVRM19fW3AzICsgYzNdKTtcbiAgICBzY29yZSArPSB0aGlzLnRzXyh0aGlzLkJRMV9fW3AyICsgYzIgKyBjM10pO1xuICAgIHNjb3JlICs9IHRoaXMudHNfKHRoaXMuQlEyX19bcDIgKyBjMyArIGM0XSk7XG4gICAgc2NvcmUgKz0gdGhpcy50c18odGhpcy5CUTNfX1twMyArIGMyICsgYzNdKTtcbiAgICBzY29yZSArPSB0aGlzLnRzXyh0aGlzLkJRNF9fW3AzICsgYzMgKyBjNF0pO1xuICAgIHNjb3JlICs9IHRoaXMudHNfKHRoaXMuVFExX19bcDIgKyBjMSArIGMyICsgYzNdKTtcbiAgICBzY29yZSArPSB0aGlzLnRzXyh0aGlzLlRRMl9fW3AyICsgYzIgKyBjMyArIGM0XSk7XG4gICAgc2NvcmUgKz0gdGhpcy50c18odGhpcy5UUTNfX1twMyArIGMxICsgYzIgKyBjM10pO1xuICAgIHNjb3JlICs9IHRoaXMudHNfKHRoaXMuVFE0X19bcDMgKyBjMiArIGMzICsgYzRdKTtcbiAgICB2YXIgcCA9IFwiT1wiO1xuICAgIGlmIChzY29yZSA+IDApIHtcbiAgICAgIHJlc3VsdC5wdXNoKHdvcmQpO1xuICAgICAgd29yZCA9IFwiXCI7XG4gICAgICBwID0gXCJCXCI7XG4gICAgfVxuICAgIHAxID0gcDI7XG4gICAgcDIgPSBwMztcbiAgICBwMyA9IHA7XG4gICAgd29yZCArPSBzZWdbaV07XG4gIH1cbiAgcmVzdWx0LnB1c2god29yZCk7XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFRpbnlTZWdtZW50ZXI7XG4iLCJpbXBvcnQgVGlueVNlZ21lbnRlciBmcm9tIFwiLi4vLi4vZXh0ZXJuYWwvdGlueS1zZWdtZW50ZXJcIjtcbmltcG9ydCB7IFRSSU1fQ0hBUl9QQVRURVJOIH0gZnJvbSBcIi4vRGVmYXVsdFRva2VuaXplclwiO1xuaW1wb3J0IHsgVG9rZW5pemVyIH0gZnJvbSBcIi4uL3Rva2VuaXplclwiO1xuLy8gQHRzLWlnbm9yZVxuY29uc3Qgc2VnbWVudGVyID0gbmV3IFRpbnlTZWdtZW50ZXIoKTtcblxuZnVuY3Rpb24gcGlja1Rva2Vuc0FzSmFwYW5lc2UoY29udGVudDogc3RyaW5nLCB0cmltUGF0dGVybjogUmVnRXhwKTogc3RyaW5nW10ge1xuICByZXR1cm4gY29udGVudFxuICAgIC5zcGxpdCh0cmltUGF0dGVybilcbiAgICAuZmlsdGVyKCh4KSA9PiB4ICE9PSBcIlwiKVxuICAgIC5mbGF0TWFwPHN0cmluZz4oKHgpID0+IHNlZ21lbnRlci5zZWdtZW50KHgpKTtcbn1cblxuLyoqXG4gKiBKYXBhbmVzZSBuZWVkcyBvcmlnaW5hbCBsb2dpYy5cbiAqL1xuZXhwb3J0IGNsYXNzIEphcGFuZXNlVG9rZW5pemVyIGltcGxlbWVudHMgVG9rZW5pemVyIHtcbiAgdG9rZW5pemUoY29udGVudDogc3RyaW5nLCByYXc/OiBib29sZWFuKTogc3RyaW5nW10ge1xuICAgIHJldHVybiBwaWNrVG9rZW5zQXNKYXBhbmVzZShjb250ZW50LCByYXcgPyAvIC9nIDogdGhpcy5nZXRUcmltUGF0dGVybigpKTtcbiAgfVxuXG4gIHJlY3Vyc2l2ZVRva2VuaXplKGNvbnRlbnQ6IHN0cmluZyk6IHsgd29yZDogc3RyaW5nOyBvZmZzZXQ6IG51bWJlciB9W10ge1xuICAgIGNvbnN0IHRva2Vuczogc3RyaW5nW10gPSBzZWdtZW50ZXJcbiAgICAgIC5zZWdtZW50KGNvbnRlbnQpXG4gICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vdGFkYXNoaS1haWthd2Evb2JzaWRpYW4tdmFyaW91cy1jb21wbGVtZW50cy1wbHVnaW4vaXNzdWVzLzc3XG4gICAgICAuZmxhdE1hcCgoeDogc3RyaW5nKSA9PlxuICAgICAgICB4ID09PSBcIiBcIiA/IHggOiB4LnNwbGl0KFwiIFwiKS5tYXAoKHQpID0+ICh0ID09PSBcIlwiID8gXCIgXCIgOiB0KSlcbiAgICAgICk7XG5cbiAgICBjb25zdCByZXQgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRva2Vucy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKFxuICAgICAgICBpID09PSAwIHx8XG4gICAgICAgIHRva2Vuc1tpXS5sZW5ndGggIT09IDEgfHxcbiAgICAgICAgIUJvb2xlYW4odG9rZW5zW2ldLm1hdGNoKHRoaXMuZ2V0VHJpbVBhdHRlcm4oKSkpXG4gICAgICApIHtcbiAgICAgICAgcmV0LnB1c2goe1xuICAgICAgICAgIHdvcmQ6IHRva2Vucy5zbGljZShpKS5qb2luKFwiXCIpLFxuICAgICAgICAgIG9mZnNldDogdG9rZW5zLnNsaWNlKDAsIGkpLmpvaW4oXCJcIikubGVuZ3RoLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmV0O1xuICB9XG5cbiAgZ2V0VHJpbVBhdHRlcm4oKTogUmVnRXhwIHtcbiAgICByZXR1cm4gVFJJTV9DSEFSX1BBVFRFUk47XG4gIH1cblxuICBzaG91bGRJZ25vcmUoc3RyOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gQm9vbGVhbihzdHIubWF0Y2goL15b44GBLeOCk++9gS3vvZrvvKEt77y644CC44CB44O844CAXSokLykpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBEZWZhdWx0VG9rZW5pemVyIH0gZnJvbSBcIi4vRGVmYXVsdFRva2VuaXplclwiO1xuXG50eXBlIFByZXZpb3VzVHlwZSA9IFwibm9uZVwiIHwgXCJ0cmltXCIgfCBcImVuZ2xpc2hcIiB8IFwib3RoZXJzXCI7XG5jb25zdCBFTkdMSVNIX1BBVFRFUk4gPSAvW2EtekEtWjAtOV9cXC1cXFxcXS87XG5leHBvcnQgY2xhc3MgRW5nbGlzaE9ubHlUb2tlbml6ZXIgZXh0ZW5kcyBEZWZhdWx0VG9rZW5pemVyIHtcbiAgdG9rZW5pemUoY29udGVudDogc3RyaW5nLCByYXc/OiBib29sZWFuKTogc3RyaW5nW10ge1xuICAgIGNvbnN0IHRva2VuaXplZCA9IEFycmF5LmZyb20odGhpcy5fdG9rZW5pemUoY29udGVudCkpLmZpbHRlcigoeCkgPT5cbiAgICAgIHgud29yZC5tYXRjaChFTkdMSVNIX1BBVFRFUk4pXG4gICAgKTtcbiAgICByZXR1cm4gcmF3XG4gICAgICA/IHRva2VuaXplZC5tYXAoKHgpID0+IHgud29yZClcbiAgICAgIDogdG9rZW5pemVkXG4gICAgICAgICAgLm1hcCgoeCkgPT4geC53b3JkKVxuICAgICAgICAgIC5maWx0ZXIoKHgpID0+ICF4Lm1hdGNoKHRoaXMuZ2V0VHJpbVBhdHRlcm4oKSkpO1xuICB9XG5cbiAgcmVjdXJzaXZlVG9rZW5pemUoY29udGVudDogc3RyaW5nKTogeyB3b3JkOiBzdHJpbmc7IG9mZnNldDogbnVtYmVyIH1bXSB7XG4gICAgY29uc3Qgb2Zmc2V0cyA9IEFycmF5LmZyb20odGhpcy5fdG9rZW5pemUoY29udGVudCkpXG4gICAgICAuZmlsdGVyKCh4KSA9PiAheC53b3JkLm1hdGNoKHRoaXMuZ2V0VHJpbVBhdHRlcm4oKSkpXG4gICAgICAubWFwKCh4KSA9PiB4Lm9mZnNldCk7XG4gICAgcmV0dXJuIFtcbiAgICAgIC4uLm9mZnNldHMubWFwKChpKSA9PiAoe1xuICAgICAgICB3b3JkOiBjb250ZW50LnNsaWNlKGkpLFxuICAgICAgICBvZmZzZXQ6IGksXG4gICAgICB9KSksXG4gICAgXTtcbiAgfVxuXG4gIHByaXZhdGUgKl90b2tlbml6ZShcbiAgICBjb250ZW50OiBzdHJpbmdcbiAgKTogSXRlcmFibGU8eyB3b3JkOiBzdHJpbmc7IG9mZnNldDogbnVtYmVyIH0+IHtcbiAgICBsZXQgc3RhcnRJbmRleCA9IDA7XG4gICAgbGV0IHByZXZpb3VzVHlwZTogUHJldmlvdXNUeXBlID0gXCJub25lXCI7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvbnRlbnQubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChjb250ZW50W2ldLm1hdGNoKHN1cGVyLmdldFRyaW1QYXR0ZXJuKCkpKSB7XG4gICAgICAgIHlpZWxkIHsgd29yZDogY29udGVudC5zbGljZShzdGFydEluZGV4LCBpKSwgb2Zmc2V0OiBzdGFydEluZGV4IH07XG4gICAgICAgIHByZXZpb3VzVHlwZSA9IFwidHJpbVwiO1xuICAgICAgICBzdGFydEluZGV4ID0gaTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChjb250ZW50W2ldLm1hdGNoKEVOR0xJU0hfUEFUVEVSTikpIHtcbiAgICAgICAgaWYgKHByZXZpb3VzVHlwZSA9PT0gXCJlbmdsaXNoXCIgfHwgcHJldmlvdXNUeXBlID09PSBcIm5vbmVcIikge1xuICAgICAgICAgIHByZXZpb3VzVHlwZSA9IFwiZW5nbGlzaFwiO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgeWllbGQgeyB3b3JkOiBjb250ZW50LnNsaWNlKHN0YXJ0SW5kZXgsIGkpLCBvZmZzZXQ6IHN0YXJ0SW5kZXggfTtcbiAgICAgICAgcHJldmlvdXNUeXBlID0gXCJlbmdsaXNoXCI7XG4gICAgICAgIHN0YXJ0SW5kZXggPSBpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHByZXZpb3VzVHlwZSA9PT0gXCJvdGhlcnNcIiB8fCBwcmV2aW91c1R5cGUgPT09IFwibm9uZVwiKSB7XG4gICAgICAgIHByZXZpb3VzVHlwZSA9IFwib3RoZXJzXCI7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICB5aWVsZCB7IHdvcmQ6IGNvbnRlbnQuc2xpY2Uoc3RhcnRJbmRleCwgaSksIG9mZnNldDogc3RhcnRJbmRleCB9O1xuICAgICAgcHJldmlvdXNUeXBlID0gXCJvdGhlcnNcIjtcbiAgICAgIHN0YXJ0SW5kZXggPSBpO1xuICAgIH1cblxuICAgIHlpZWxkIHtcbiAgICAgIHdvcmQ6IGNvbnRlbnQuc2xpY2Uoc3RhcnRJbmRleCwgY29udGVudC5sZW5ndGgpLFxuICAgICAgb2Zmc2V0OiBzdGFydEluZGV4LFxuICAgIH07XG4gIH1cbn1cbiIsImltcG9ydCB7IEFyYWJpY1Rva2VuaXplciB9IGZyb20gXCIuL3Rva2VuaXplcnMvQXJhYmljVG9rZW5pemVyXCI7XG5pbXBvcnQgeyBEZWZhdWx0VG9rZW5pemVyIH0gZnJvbSBcIi4vdG9rZW5pemVycy9EZWZhdWx0VG9rZW5pemVyXCI7XG5pbXBvcnQgeyBKYXBhbmVzZVRva2VuaXplciB9IGZyb20gXCIuL3Rva2VuaXplcnMvSmFwYW5lc2VUb2tlbml6ZXJcIjtcbmltcG9ydCB7IFRva2VuaXplU3RyYXRlZ3kgfSBmcm9tIFwiLi9Ub2tlbml6ZVN0cmF0ZWd5XCI7XG5pbXBvcnQgeyBFbmdsaXNoT25seVRva2VuaXplciB9IGZyb20gXCIuL3Rva2VuaXplcnMvRW5nbGlzaE9ubHlUb2tlbml6ZXJcIjtcblxuZXhwb3J0IGludGVyZmFjZSBUb2tlbml6ZXIge1xuICB0b2tlbml6ZShjb250ZW50OiBzdHJpbmcsIHJhdz86IGJvb2xlYW4pOiBzdHJpbmdbXTtcbiAgcmVjdXJzaXZlVG9rZW5pemUoY29udGVudDogc3RyaW5nKTogeyB3b3JkOiBzdHJpbmc7IG9mZnNldDogbnVtYmVyIH1bXTtcbiAgZ2V0VHJpbVBhdHRlcm4oKTogUmVnRXhwO1xuICBzaG91bGRJZ25vcmUocXVlcnk6IHN0cmluZyk6IGJvb2xlYW47XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVUb2tlbml6ZXIoc3RyYXRlZ3k6IFRva2VuaXplU3RyYXRlZ3kpOiBUb2tlbml6ZXIge1xuICBzd2l0Y2ggKHN0cmF0ZWd5Lm5hbWUpIHtcbiAgICBjYXNlIFwiZGVmYXVsdFwiOlxuICAgICAgcmV0dXJuIG5ldyBEZWZhdWx0VG9rZW5pemVyKCk7XG4gICAgY2FzZSBcImVuZ2xpc2gtb25seVwiOlxuICAgICAgcmV0dXJuIG5ldyBFbmdsaXNoT25seVRva2VuaXplcigpO1xuICAgIGNhc2UgXCJhcmFiaWNcIjpcbiAgICAgIHJldHVybiBuZXcgQXJhYmljVG9rZW5pemVyKCk7XG4gICAgY2FzZSBcImphcGFuZXNlXCI6XG4gICAgICByZXR1cm4gbmV3IEphcGFuZXNlVG9rZW5pemVyKCk7XG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVW5leHBlY3RlZCBzdHJhdGVneSBuYW1lOiAke3N0cmF0ZWd5fWApO1xuICB9XG59XG4iLCJ0eXBlIE5hbWUgPSBcImRlZmF1bHRcIiB8IFwiZW5nbGlzaC1vbmx5XCIgfCBcImphcGFuZXNlXCIgfCBcImFyYWJpY1wiO1xuXG5leHBvcnQgY2xhc3MgVG9rZW5pemVTdHJhdGVneSB7XG4gIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IF92YWx1ZXM6IFRva2VuaXplU3RyYXRlZ3lbXSA9IFtdO1xuXG4gIHN0YXRpYyByZWFkb25seSBERUZBVUxUID0gbmV3IFRva2VuaXplU3RyYXRlZ3koXCJkZWZhdWx0XCIsIDMpO1xuICBzdGF0aWMgcmVhZG9ubHkgRU5HTElTSF9PTkxZID0gbmV3IFRva2VuaXplU3RyYXRlZ3koXCJlbmdsaXNoLW9ubHlcIiwgMyk7XG4gIHN0YXRpYyByZWFkb25seSBKQVBBTkVTRSA9IG5ldyBUb2tlbml6ZVN0cmF0ZWd5KFwiamFwYW5lc2VcIiwgMik7XG4gIHN0YXRpYyByZWFkb25seSBBUkFCSUMgPSBuZXcgVG9rZW5pemVTdHJhdGVneShcImFyYWJpY1wiLCAzKTtcblxuICBwcml2YXRlIGNvbnN0cnVjdG9yKHJlYWRvbmx5IG5hbWU6IE5hbWUsIHJlYWRvbmx5IHRyaWdnZXJUaHJlc2hvbGQ6IG51bWJlcikge1xuICAgIFRva2VuaXplU3RyYXRlZ3kuX3ZhbHVlcy5wdXNoKHRoaXMpO1xuICB9XG5cbiAgc3RhdGljIGZyb21OYW1lKG5hbWU6IHN0cmluZyk6IFRva2VuaXplU3RyYXRlZ3kge1xuICAgIHJldHVybiBUb2tlbml6ZVN0cmF0ZWd5Ll92YWx1ZXMuZmluZCgoeCkgPT4geC5uYW1lID09PSBuYW1lKSE7XG4gIH1cblxuICBzdGF0aWMgdmFsdWVzKCk6IFRva2VuaXplU3RyYXRlZ3lbXSB7XG4gICAgcmV0dXJuIFRva2VuaXplU3RyYXRlZ3kuX3ZhbHVlcztcbiAgfVxufVxuIiwiaW1wb3J0IHtcbiAgQXBwLFxuICBFZGl0b3IsXG4gIEVkaXRvclBvc2l0aW9uLFxuICBNYXJrZG93blZpZXcsXG4gIHBhcnNlRnJvbnRNYXR0ZXJBbGlhc2VzLFxuICBwYXJzZUZyb250TWF0dGVyU3RyaW5nQXJyYXksXG4gIHBhcnNlRnJvbnRNYXR0ZXJUYWdzLFxuICBURmlsZSxcbn0gZnJvbSBcIm9ic2lkaWFuXCI7XG5cbmV4cG9ydCB0eXBlIEZyb250TWF0dGVyVmFsdWUgPSBzdHJpbmdbXTtcblxuZXhwb3J0IGNsYXNzIEFwcEhlbHBlciB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgYXBwOiBBcHApIHt9XG5cbiAgZXF1YWxzQXNFZGl0b3JQb3N0aW9uKG9uZTogRWRpdG9yUG9zaXRpb24sIG90aGVyOiBFZGl0b3JQb3NpdGlvbik6IGJvb2xlYW4ge1xuICAgIHJldHVybiBvbmUubGluZSA9PT0gb3RoZXIubGluZSAmJiBvbmUuY2ggPT09IG90aGVyLmNoO1xuICB9XG5cbiAgZ2V0QWxpYXNlcyhmaWxlOiBURmlsZSk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gKFxuICAgICAgcGFyc2VGcm9udE1hdHRlckFsaWFzZXMoXG4gICAgICAgIHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0RmlsZUNhY2hlKGZpbGUpPy5mcm9udG1hdHRlclxuICAgICAgKSA/PyBbXVxuICAgICk7XG4gIH1cblxuICBnZXRGcm9udE1hdHRlcihmaWxlOiBURmlsZSk6IHsgW2tleTogc3RyaW5nXTogRnJvbnRNYXR0ZXJWYWx1ZSB9IHwgdW5kZWZpbmVkIHtcbiAgICBjb25zdCBmcm9udE1hdHRlciA9IHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0RmlsZUNhY2hlKGZpbGUpPy5mcm9udG1hdHRlcjtcbiAgICBpZiAoIWZyb250TWF0dGVyKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIC8vIHJlbW92ZSAjXG4gICAgY29uc3QgdGFncyA9XG4gICAgICBwYXJzZUZyb250TWF0dGVyVGFncyhmcm9udE1hdHRlcik/Lm1hcCgoeCkgPT4geC5zbGljZSgxKSkgPz8gW107XG4gICAgY29uc3QgYWxpYXNlcyA9IHBhcnNlRnJvbnRNYXR0ZXJBbGlhc2VzKGZyb250TWF0dGVyKSA/PyBbXTtcbiAgICBjb25zdCB7IHBvc2l0aW9uLCAuLi5yZXN0IH0gPSBmcm9udE1hdHRlcjtcbiAgICByZXR1cm4ge1xuICAgICAgLi4uT2JqZWN0LmZyb21FbnRyaWVzKFxuICAgICAgICBPYmplY3QuZW50cmllcyhyZXN0KS5tYXAoKFtrLCBfdl0pID0+IFtcbiAgICAgICAgICBrLFxuICAgICAgICAgIHBhcnNlRnJvbnRNYXR0ZXJTdHJpbmdBcnJheShmcm9udE1hdHRlciwgayksXG4gICAgICAgIF0pXG4gICAgICApLFxuICAgICAgdGFncyxcbiAgICAgIHRhZzogdGFncyxcbiAgICAgIGFsaWFzZXMsXG4gICAgICBhbGlhczogYWxpYXNlcyxcbiAgICB9O1xuICB9XG5cbiAgZ2V0TWFya2Rvd25WaWV3SW5BY3RpdmVMZWFmKCk6IE1hcmtkb3duVmlldyB8IG51bGwge1xuICAgIGlmICghdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoTWFya2Rvd25WaWV3KSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuYXBwLndvcmtzcGFjZS5hY3RpdmVMZWFmIS52aWV3IGFzIE1hcmtkb3duVmlldztcbiAgfVxuXG4gIGdldEFjdGl2ZUZpbGUoKTogVEZpbGUgfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKTtcbiAgfVxuXG4gIGdldEN1cnJlbnREaXJuYW1lKCk6IHN0cmluZyB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLmdldEFjdGl2ZUZpbGUoKT8ucGFyZW50LnBhdGggPz8gbnVsbDtcbiAgfVxuXG4gIGdldEN1cnJlbnRFZGl0b3IoKTogRWRpdG9yIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0TWFya2Rvd25WaWV3SW5BY3RpdmVMZWFmKCk/LmVkaXRvciA/PyBudWxsO1xuICB9XG5cbiAgZ2V0U2VsZWN0aW9uKCk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0Q3VycmVudEVkaXRvcigpPy5nZXRTZWxlY3Rpb24oKTtcbiAgfVxuXG4gIGdldEN1cnJlbnRPZmZzZXQoZWRpdG9yOiBFZGl0b3IpOiBudW1iZXIge1xuICAgIHJldHVybiBlZGl0b3IucG9zVG9PZmZzZXQoZWRpdG9yLmdldEN1cnNvcigpKTtcbiAgfVxuXG4gIGdldEN1cnJlbnRMaW5lKGVkaXRvcjogRWRpdG9yKTogc3RyaW5nIHtcbiAgICByZXR1cm4gZWRpdG9yLmdldExpbmUoZWRpdG9yLmdldEN1cnNvcigpLmxpbmUpO1xuICB9XG5cbiAgZ2V0Q3VycmVudExpbmVVbnRpbEN1cnNvcihlZGl0b3I6IEVkaXRvcik6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0Q3VycmVudExpbmUoZWRpdG9yKS5zbGljZSgwLCBlZGl0b3IuZ2V0Q3Vyc29yKCkuY2gpO1xuICB9XG5cbiAgc2VhcmNoUGhhbnRvbUxpbmtzKCk6IHsgcGF0aDogc3RyaW5nOyBsaW5rOiBzdHJpbmcgfVtdIHtcbiAgICByZXR1cm4gT2JqZWN0LmVudHJpZXModGhpcy5hcHAubWV0YWRhdGFDYWNoZS51bnJlc29sdmVkTGlua3MpLmZsYXRNYXAoXG4gICAgICAoW3BhdGgsIG9ial0pID0+IE9iamVjdC5rZXlzKG9iaikubWFwKChsaW5rKSA9PiAoeyBwYXRoLCBsaW5rIH0pKVxuICAgICk7XG4gIH1cblxuICBnZXRNYXJrZG93bkZpbGVCeVBhdGgocGF0aDogc3RyaW5nKTogVEZpbGUgfCBudWxsIHtcbiAgICBpZiAoIXBhdGguZW5kc1dpdGgoXCIubWRcIikpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGFic3RyYWN0RmlsZSA9IHRoaXMuYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChwYXRoKTtcbiAgICBpZiAoIWFic3RyYWN0RmlsZSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIGFic3RyYWN0RmlsZSBhcyBURmlsZTtcbiAgfVxuXG4gIG9wZW5NYXJrZG93bkZpbGUoZmlsZTogVEZpbGUsIG5ld0xlYWY6IGJvb2xlYW4sIG9mZnNldDogbnVtYmVyID0gMCkge1xuICAgIGNvbnN0IGxlYWYgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0TGVhZihuZXdMZWFmKTtcblxuICAgIGxlYWZcbiAgICAgIC5vcGVuRmlsZShmaWxlLCB0aGlzLmFwcC53b3Jrc3BhY2UuYWN0aXZlTGVhZj8uZ2V0Vmlld1N0YXRlKCkpXG4gICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgIHRoaXMuYXBwLndvcmtzcGFjZS5zZXRBY3RpdmVMZWFmKGxlYWYsIHRydWUsIHRydWUpO1xuICAgICAgICBjb25zdCB2aWV3T2ZUeXBlID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoTWFya2Rvd25WaWV3KTtcbiAgICAgICAgaWYgKHZpZXdPZlR5cGUpIHtcbiAgICAgICAgICBjb25zdCBlZGl0b3IgPSB2aWV3T2ZUeXBlLmVkaXRvcjtcbiAgICAgICAgICBjb25zdCBwb3MgPSBlZGl0b3Iub2Zmc2V0VG9Qb3Mob2Zmc2V0KTtcbiAgICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yKHBvcyk7XG4gICAgICAgICAgZWRpdG9yLnNjcm9sbEludG9WaWV3KHsgZnJvbTogcG9zLCB0bzogcG9zIH0sIHRydWUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgfVxuXG4gIGdldEN1cnJlbnRGcm9udE1hdHRlcigpOiBzdHJpbmcgfCBudWxsIHtcbiAgICBjb25zdCBlZGl0b3IgPSB0aGlzLmdldEN1cnJlbnRFZGl0b3IoKTtcbiAgICBpZiAoIWVkaXRvcikge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmdldEFjdGl2ZUZpbGUoKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgaWYgKGVkaXRvci5nZXRMaW5lKDApICE9PSBcIi0tLVwiKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY29uc3QgZW5kUG9zaXRpb24gPSBlZGl0b3IuZ2V0VmFsdWUoKS5pbmRleE9mKFwiLS0tXCIsIDMpO1xuXG4gICAgY29uc3QgY3VycmVudE9mZnNldCA9IHRoaXMuZ2V0Q3VycmVudE9mZnNldChlZGl0b3IpO1xuICAgIGlmIChlbmRQb3NpdGlvbiAhPT0gLTEgJiYgY3VycmVudE9mZnNldCA+PSBlbmRQb3NpdGlvbikge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3Qga2V5TG9jYXRpb25zID0gQXJyYXkuZnJvbShlZGl0b3IuZ2V0VmFsdWUoKS5tYXRjaEFsbCgvLis6L2cpKTtcbiAgICBpZiAoa2V5TG9jYXRpb25zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgY3VycmVudEtleUxvY2F0aW9uID0ga2V5TG9jYXRpb25zXG4gICAgICAuZmlsdGVyKCh4KSA9PiB4LmluZGV4ISA8IGN1cnJlbnRPZmZzZXQpXG4gICAgICAubGFzdCgpO1xuICAgIGlmICghY3VycmVudEtleUxvY2F0aW9uKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gY3VycmVudEtleUxvY2F0aW9uWzBdLnNwbGl0KFwiOlwiKVswXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVbnNhZmUgbWV0aG9kXG4gICAqL1xuICBpc0lNRU9uKCk6IGJvb2xlYW4ge1xuICAgIGlmICghdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoTWFya2Rvd25WaWV3KSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IG1hcmtkb3duVmlldyA9IHRoaXMuYXBwLndvcmtzcGFjZS5hY3RpdmVMZWFmIS52aWV3IGFzIE1hcmtkb3duVmlldztcbiAgICBjb25zdCBjbTVvcjY6IGFueSA9IChtYXJrZG93blZpZXcuZWRpdG9yIGFzIGFueSkuY207XG5cbiAgICAvLyBjbTZcbiAgICBpZiAoY201b3I2Py5pbnB1dFN0YXRlPy5jb21wb3NpbmcgPiAwKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBjbTVcbiAgICByZXR1cm4gISFjbTVvcjY/LmRpc3BsYXk/LmlucHV0Py5jb21wb3Npbmc7XG4gIH1cbn1cbiIsImV4cG9ydCBjb25zdCBrZXlCeSA9IDxUPihcbiAgdmFsdWVzOiBUW10sXG4gIHRvS2V5OiAodDogVCkgPT4gc3RyaW5nXG4pOiB7IFtrZXk6IHN0cmluZ106IFQgfSA9PlxuICB2YWx1ZXMucmVkdWNlKFxuICAgIChwcmV2LCBjdXIsIF8xLCBfMiwgayA9IHRvS2V5KGN1cikpID0+ICgocHJldltrXSA9IGN1ciksIHByZXYpLFxuICAgIHt9IGFzIHsgW2tleTogc3RyaW5nXTogVCB9XG4gICk7XG5cbmV4cG9ydCBjb25zdCBncm91cEJ5ID0gPFQ+KFxuICB2YWx1ZXM6IFRbXSxcbiAgdG9LZXk6ICh0OiBUKSA9PiBzdHJpbmdcbik6IHsgW2tleTogc3RyaW5nXTogVFtdIH0gPT5cbiAgdmFsdWVzLnJlZHVjZShcbiAgICAocHJldiwgY3VyLCBfMSwgXzIsIGsgPSB0b0tleShjdXIpKSA9PiAoXG4gICAgICAocHJldltrXSB8fCAocHJldltrXSA9IFtdKSkucHVzaChjdXIpLCBwcmV2XG4gICAgKSxcbiAgICB7fSBhcyB7IFtrZXk6IHN0cmluZ106IFRbXSB9XG4gICk7XG5cbmV4cG9ydCBmdW5jdGlvbiB1bmlxPFQ+KHZhbHVlczogVFtdKTogVFtdIHtcbiAgcmV0dXJuIFsuLi5uZXcgU2V0KHZhbHVlcyldO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdW5pcVdpdGg8VD4oYXJyOiBUW10sIGZuOiAob25lOiBULCBvdGhlcjogVCkgPT4gYm9vbGVhbikge1xuICByZXR1cm4gYXJyLmZpbHRlcihcbiAgICAoZWxlbWVudCwgaW5kZXgpID0+IGFyci5maW5kSW5kZXgoKHN0ZXApID0+IGZuKGVsZW1lbnQsIHN0ZXApKSA9PT0gaW5kZXhcbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFycmF5RXF1YWxzKFxuICBhcnIxOiB1bmtub3duW10sXG4gIGFycjI6IHVua25vd25bXSxcbiAgbGVuZ3RoPzogbnVtYmVyXG4pOiBib29sZWFuIHtcbiAgbGV0IGwgPSBNYXRoLm1heChhcnIxLmxlbmd0aCwgYXJyMi5sZW5ndGgpO1xuICBpZiAobGVuZ3RoICE9PSB1bmRlZmluZWQpIHtcbiAgICBsID0gTWF0aC5taW4obCwgbGVuZ3RoKTtcbiAgfVxuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbDsgaSsrKSB7XG4gICAgaWYgKGFycjFbaV0gIT09IGFycjJbaV0pIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFycmF5RXF1YWxzVW50aWwoYXJyMTogdW5rbm93bltdLCBhcnIyOiB1bmtub3duW10pOiBudW1iZXIge1xuICBsZXQgbCA9IE1hdGgubWluKGFycjEubGVuZ3RoLCBhcnIyLmxlbmd0aCk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbDsgaSsrKSB7XG4gICAgaWYgKGFycjFbaV0gIT09IGFycjJbaV0pIHtcbiAgICAgIHJldHVybiBpIC0gMTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbCAtIDE7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtaXJyb3JNYXA8VD4oXG4gIGNvbGxlY3Rpb246IFRbXSxcbiAgdG9WYWx1ZTogKHQ6IFQpID0+IHN0cmluZ1xuKTogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSB7XG4gIHJldHVybiBjb2xsZWN0aW9uLnJlZHVjZSgocCwgYykgPT4gKHsgLi4ucCwgW3RvVmFsdWUoYyldOiB0b1ZhbHVlKGMpIH0pLCB7fSk7XG59XG4iLCJleHBvcnQgdHlwZSBXb3JkVHlwZSA9XG4gIHwgXCJjdXJyZW50RmlsZVwiXG4gIHwgXCJjdXJyZW50VmF1bHRcIlxuICB8IFwiY3VzdG9tRGljdGlvbmFyeVwiXG4gIHwgXCJpbnRlcm5hbExpbmtcIlxuICB8IFwiZnJvbnRNYXR0ZXJcIjtcblxuZXhwb3J0IGludGVyZmFjZSBEZWZhdWx0V29yZCB7XG4gIHZhbHVlOiBzdHJpbmc7XG4gIGRlc2NyaXB0aW9uPzogc3RyaW5nO1xuICBhbGlhc2VzPzogc3RyaW5nW107XG4gIHR5cGU6IFdvcmRUeXBlO1xuICBjcmVhdGVkUGF0aDogc3RyaW5nO1xuICAvLyBBZGQgYWZ0ZXIganVkZ2VcbiAgb2Zmc2V0PzogbnVtYmVyO1xufVxuZXhwb3J0IGludGVyZmFjZSBDdXJyZW50RmlsZVdvcmQgZXh0ZW5kcyBEZWZhdWx0V29yZCB7XG4gIHR5cGU6IFwiY3VycmVudEZpbGVcIjtcbn1cbmV4cG9ydCBpbnRlcmZhY2UgQ3VycmVudFZhdWx0V29yZCBleHRlbmRzIERlZmF1bHRXb3JkIHtcbiAgdHlwZTogXCJjdXJyZW50VmF1bHRcIjtcbn1cbmV4cG9ydCBpbnRlcmZhY2UgQ3VzdG9tRGljdGlvbmFyeVdvcmQgZXh0ZW5kcyBEZWZhdWx0V29yZCB7XG4gIHR5cGU6IFwiY3VzdG9tRGljdGlvbmFyeVwiO1xufVxuZXhwb3J0IGludGVyZmFjZSBJbnRlcm5hbExpbmtXb3JkIGV4dGVuZHMgRGVmYXVsdFdvcmQge1xuICB0eXBlOiBcImludGVybmFsTGlua1wiO1xuICBwaGFudG9tPzogYm9vbGVhbjtcbiAgYWxpYXNNZXRhPzoge1xuICAgIG9yaWdpbjogc3RyaW5nO1xuICB9O1xufVxuZXhwb3J0IGludGVyZmFjZSBGcm9udE1hdHRlcldvcmQgZXh0ZW5kcyBEZWZhdWx0V29yZCB7XG4gIHR5cGU6IFwiZnJvbnRNYXR0ZXJcIjtcbiAga2V5OiBzdHJpbmc7XG59XG5cbmV4cG9ydCB0eXBlIFdvcmQgPVxuICB8IEN1cnJlbnRGaWxlV29yZFxuICB8IEN1cnJlbnRWYXVsdFdvcmRcbiAgfCBDdXN0b21EaWN0aW9uYXJ5V29yZFxuICB8IEludGVybmFsTGlua1dvcmRcbiAgfCBGcm9udE1hdHRlcldvcmQ7XG5cbmV4cG9ydCBjbGFzcyBXb3JkVHlwZU1ldGEge1xuICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBfdmFsdWVzOiBXb3JkVHlwZU1ldGFbXSA9IFtdO1xuICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBfZGljdDogeyBbdHlwZTogc3RyaW5nXTogV29yZFR5cGVNZXRhIH0gPSB7fTtcblxuICBzdGF0aWMgcmVhZG9ubHkgRlJPTlRfTUFUVEVSID0gbmV3IFdvcmRUeXBlTWV0YShcbiAgICBcImZyb250TWF0dGVyXCIsXG4gICAgMTAwLFxuICAgIFwiZnJvbnRNYXR0ZXJcIlxuICApO1xuICBzdGF0aWMgcmVhZG9ubHkgSU5URVJOQUxfTElOSyA9IG5ldyBXb3JkVHlwZU1ldGEoXG4gICAgXCJpbnRlcm5hbExpbmtcIixcbiAgICA5MCxcbiAgICBcImludGVybmFsTGlua1wiXG4gICk7XG4gIHN0YXRpYyByZWFkb25seSBDVVNUT01fRElDVElPTkFSWSA9IG5ldyBXb3JkVHlwZU1ldGEoXG4gICAgXCJjdXN0b21EaWN0aW9uYXJ5XCIsXG4gICAgODAsXG4gICAgXCJzdWdnZXN0aW9uXCJcbiAgKTtcbiAgc3RhdGljIHJlYWRvbmx5IENVUlJFTlRfRklMRSA9IG5ldyBXb3JkVHlwZU1ldGEoXG4gICAgXCJjdXJyZW50RmlsZVwiLFxuICAgIDcwLFxuICAgIFwic3VnZ2VzdGlvblwiXG4gICk7XG4gIHN0YXRpYyByZWFkb25seSBDVVJSRU5UX1ZBVUxUID0gbmV3IFdvcmRUeXBlTWV0YShcbiAgICBcImN1cnJlbnRWYXVsdFwiLFxuICAgIDYwLFxuICAgIFwic3VnZ2VzdGlvblwiXG4gICk7XG5cbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcihcbiAgICByZWFkb25seSB0eXBlOiBXb3JkVHlwZSxcbiAgICByZWFkb25seSBwcmlvcml0eTogbnVtYmVyLFxuICAgIHJlYWRvbmx5IGdyb3VwOiBzdHJpbmdcbiAgKSB7XG4gICAgV29yZFR5cGVNZXRhLl92YWx1ZXMucHVzaCh0aGlzKTtcbiAgICBXb3JkVHlwZU1ldGEuX2RpY3RbdHlwZV0gPSB0aGlzO1xuICB9XG5cbiAgc3RhdGljIG9mKHR5cGU6IFdvcmRUeXBlKTogV29yZFR5cGVNZXRhIHtcbiAgICByZXR1cm4gV29yZFR5cGVNZXRhLl9kaWN0W3R5cGVdO1xuICB9XG5cbiAgc3RhdGljIHZhbHVlcygpOiBXb3JkVHlwZU1ldGFbXSB7XG4gICAgcmV0dXJuIFdvcmRUeXBlTWV0YS5fdmFsdWVzO1xuICB9XG59XG4iLCJpbXBvcnQge1xuICBjYXBpdGFsaXplRmlyc3RMZXR0ZXIsXG4gIGxvd2VySW5jbHVkZXMsXG4gIGxvd2VyU3RhcnRzV2l0aCxcbn0gZnJvbSBcIi4uL3V0aWwvc3RyaW5nc1wiO1xuaW1wb3J0IHsgSW5kZXhlZFdvcmRzIH0gZnJvbSBcIi4uL3VpL0F1dG9Db21wbGV0ZVN1Z2dlc3RcIjtcbmltcG9ydCB7IHVuaXFXaXRoIH0gZnJvbSBcIi4uL3V0aWwvY29sbGVjdGlvbi1oZWxwZXJcIjtcbmltcG9ydCB7IFdvcmQsIFdvcmRUeXBlTWV0YSB9IGZyb20gXCIuLi9tb2RlbC9Xb3JkXCI7XG5cbmV4cG9ydCB0eXBlIFdvcmRzQnlGaXJzdExldHRlciA9IHsgW2ZpcnN0TGV0dGVyOiBzdHJpbmddOiBXb3JkW10gfTtcblxuaW50ZXJmYWNlIEp1ZGdlbWVudCB7XG4gIHdvcmQ6IFdvcmQ7XG4gIHZhbHVlPzogc3RyaW5nO1xuICBhbGlhczogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHB1c2hXb3JkKFxuICB3b3Jkc0J5Rmlyc3RMZXR0ZXI6IFdvcmRzQnlGaXJzdExldHRlcixcbiAga2V5OiBzdHJpbmcsXG4gIHdvcmQ6IFdvcmRcbikge1xuICBpZiAod29yZHNCeUZpcnN0TGV0dGVyW2tleV0gPT09IHVuZGVmaW5lZCkge1xuICAgIHdvcmRzQnlGaXJzdExldHRlcltrZXldID0gW3dvcmRdO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHdvcmRzQnlGaXJzdExldHRlcltrZXldLnB1c2god29yZCk7XG59XG5cbi8vIFB1YmxpYyBmb3IgdGVzdHNcbmV4cG9ydCBmdW5jdGlvbiBqdWRnZShcbiAgd29yZDogV29yZCxcbiAgcXVlcnk6IHN0cmluZyxcbiAgcXVlcnlTdGFydFdpdGhVcHBlcjogYm9vbGVhblxuKTogSnVkZ2VtZW50IHtcbiAgaWYgKHF1ZXJ5ID09PSBcIlwiKSB7XG4gICAgcmV0dXJuIHsgd29yZCwgdmFsdWU6IHdvcmQudmFsdWUsIGFsaWFzOiBmYWxzZSB9O1xuICB9XG5cbiAgaWYgKGxvd2VyU3RhcnRzV2l0aCh3b3JkLnZhbHVlLCBxdWVyeSkpIHtcbiAgICBpZiAoXG4gICAgICBxdWVyeVN0YXJ0V2l0aFVwcGVyICYmXG4gICAgICB3b3JkLnR5cGUgIT09IFwiaW50ZXJuYWxMaW5rXCIgJiZcbiAgICAgIHdvcmQudHlwZSAhPT0gXCJmcm9udE1hdHRlclwiXG4gICAgKSB7XG4gICAgICBjb25zdCBjID0gY2FwaXRhbGl6ZUZpcnN0TGV0dGVyKHdvcmQudmFsdWUpO1xuICAgICAgcmV0dXJuIHsgd29yZDogeyAuLi53b3JkLCB2YWx1ZTogYyB9LCB2YWx1ZTogYywgYWxpYXM6IGZhbHNlIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7IHdvcmQ6IHdvcmQsIHZhbHVlOiB3b3JkLnZhbHVlLCBhbGlhczogZmFsc2UgfTtcbiAgICB9XG4gIH1cbiAgY29uc3QgbWF0Y2hlZEFsaWFzID0gd29yZC5hbGlhc2VzPy5maW5kKChhKSA9PiBsb3dlclN0YXJ0c1dpdGgoYSwgcXVlcnkpKTtcbiAgaWYgKG1hdGNoZWRBbGlhcykge1xuICAgIHJldHVybiB7XG4gICAgICB3b3JkOiB7IC4uLndvcmQgfSxcbiAgICAgIHZhbHVlOiBtYXRjaGVkQWxpYXMsXG4gICAgICBhbGlhczogdHJ1ZSxcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIHsgd29yZDogd29yZCwgYWxpYXM6IGZhbHNlIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzdWdnZXN0V29yZHMoXG4gIGluZGV4ZWRXb3JkczogSW5kZXhlZFdvcmRzLFxuICBxdWVyeTogc3RyaW5nLFxuICBtYXg6IG51bWJlcixcbiAgZnJvbnRNYXR0ZXI6IHN0cmluZyB8IG51bGxcbik6IFdvcmRbXSB7XG4gIGNvbnN0IHF1ZXJ5U3RhcnRXaXRoVXBwZXIgPSBjYXBpdGFsaXplRmlyc3RMZXR0ZXIocXVlcnkpID09PSBxdWVyeTtcblxuICBjb25zdCBmbGF0dGVuRnJvbnRNYXR0ZXJXb3JkcyA9ICgpID0+IHtcbiAgICBpZiAoZnJvbnRNYXR0ZXIgPT09IFwiYWxpYXNcIiB8fCBmcm9udE1hdHRlciA9PT0gXCJhbGlhc2VzXCIpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG4gICAgaWYgKGZyb250TWF0dGVyICYmIGluZGV4ZWRXb3Jkcy5mcm9udE1hdHRlcj8uW2Zyb250TWF0dGVyXSkge1xuICAgICAgcmV0dXJuIE9iamVjdC52YWx1ZXMoaW5kZXhlZFdvcmRzLmZyb250TWF0dGVyPy5bZnJvbnRNYXR0ZXJdKS5mbGF0KCk7XG4gICAgfVxuICAgIHJldHVybiBbXTtcbiAgfTtcblxuICBjb25zdCB3b3JkcyA9IHF1ZXJ5U3RhcnRXaXRoVXBwZXJcbiAgICA/IGZyb250TWF0dGVyXG4gICAgICA/IGZsYXR0ZW5Gcm9udE1hdHRlcldvcmRzKClcbiAgICAgIDogW1xuICAgICAgICAgIC4uLihpbmRleGVkV29yZHMuY3VycmVudEZpbGVbcXVlcnkuY2hhckF0KDApXSA/PyBbXSksXG4gICAgICAgICAgLi4uKGluZGV4ZWRXb3Jkcy5jdXJyZW50RmlsZVtxdWVyeS5jaGFyQXQoMCkudG9Mb3dlckNhc2UoKV0gPz8gW10pLFxuICAgICAgICAgIC4uLihpbmRleGVkV29yZHMuY3VycmVudFZhdWx0W3F1ZXJ5LmNoYXJBdCgwKV0gPz8gW10pLFxuICAgICAgICAgIC4uLihpbmRleGVkV29yZHMuY3VycmVudFZhdWx0W3F1ZXJ5LmNoYXJBdCgwKS50b0xvd2VyQ2FzZSgpXSA/PyBbXSksXG4gICAgICAgICAgLi4uKGluZGV4ZWRXb3Jkcy5jdXN0b21EaWN0aW9uYXJ5W3F1ZXJ5LmNoYXJBdCgwKV0gPz8gW10pLFxuICAgICAgICAgIC4uLihpbmRleGVkV29yZHMuY3VzdG9tRGljdGlvbmFyeVtxdWVyeS5jaGFyQXQoMCkudG9Mb3dlckNhc2UoKV0gPz9cbiAgICAgICAgICAgIFtdKSxcbiAgICAgICAgICAuLi4oaW5kZXhlZFdvcmRzLmludGVybmFsTGlua1txdWVyeS5jaGFyQXQoMCldID8/IFtdKSxcbiAgICAgICAgICAuLi4oaW5kZXhlZFdvcmRzLmludGVybmFsTGlua1txdWVyeS5jaGFyQXQoMCkudG9Mb3dlckNhc2UoKV0gPz8gW10pLFxuICAgICAgICBdXG4gICAgOiBmcm9udE1hdHRlclxuICAgID8gZmxhdHRlbkZyb250TWF0dGVyV29yZHMoKVxuICAgIDogW1xuICAgICAgICAuLi4oaW5kZXhlZFdvcmRzLmN1cnJlbnRGaWxlW3F1ZXJ5LmNoYXJBdCgwKV0gPz8gW10pLFxuICAgICAgICAuLi4oaW5kZXhlZFdvcmRzLmN1cnJlbnRWYXVsdFtxdWVyeS5jaGFyQXQoMCldID8/IFtdKSxcbiAgICAgICAgLi4uKGluZGV4ZWRXb3Jkcy5jdXN0b21EaWN0aW9uYXJ5W3F1ZXJ5LmNoYXJBdCgwKV0gPz8gW10pLFxuICAgICAgICAuLi4oaW5kZXhlZFdvcmRzLmludGVybmFsTGlua1txdWVyeS5jaGFyQXQoMCldID8/IFtdKSxcbiAgICAgICAgLi4uKGluZGV4ZWRXb3Jkcy5pbnRlcm5hbExpbmtbcXVlcnkuY2hhckF0KDApLnRvVXBwZXJDYXNlKCldID8/IFtdKSxcbiAgICAgIF07XG5cbiAgY29uc3QgY2FuZGlkYXRlID0gQXJyYXkuZnJvbSh3b3JkcylcbiAgICAubWFwKCh4KSA9PiBqdWRnZSh4LCBxdWVyeSwgcXVlcnlTdGFydFdpdGhVcHBlcikpXG4gICAgLmZpbHRlcigoeCkgPT4geC52YWx1ZSAhPT0gdW5kZWZpbmVkKVxuICAgIC5zb3J0KChhLCBiKSA9PiB7XG4gICAgICBjb25zdCBub3RTYW1lV29yZFR5cGUgPSBhLndvcmQudHlwZSAhPT0gYi53b3JkLnR5cGU7XG4gICAgICBpZiAoZnJvbnRNYXR0ZXIgJiYgbm90U2FtZVdvcmRUeXBlKSB7XG4gICAgICAgIHJldHVybiBiLndvcmQudHlwZSA9PT0gXCJmcm9udE1hdHRlclwiID8gMSA6IC0xO1xuICAgICAgfVxuXG4gICAgICBpZiAoYS52YWx1ZSEubGVuZ3RoICE9PSBiLnZhbHVlIS5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIGEudmFsdWUhLmxlbmd0aCA+IGIudmFsdWUhLmxlbmd0aCA/IDEgOiAtMTtcbiAgICAgIH1cbiAgICAgIGlmIChub3RTYW1lV29yZFR5cGUpIHtcbiAgICAgICAgcmV0dXJuIFdvcmRUeXBlTWV0YS5vZihiLndvcmQudHlwZSkucHJpb3JpdHkgPlxuICAgICAgICAgIFdvcmRUeXBlTWV0YS5vZihhLndvcmQudHlwZSkucHJpb3JpdHlcbiAgICAgICAgICA/IDFcbiAgICAgICAgICA6IC0xO1xuICAgICAgfVxuICAgICAgaWYgKGEuYWxpYXMgIT09IGIuYWxpYXMpIHtcbiAgICAgICAgcmV0dXJuIGEuYWxpYXMgPyAxIDogLTE7XG4gICAgICB9XG4gICAgICByZXR1cm4gMDtcbiAgICB9KVxuICAgIC5tYXAoKHgpID0+IHgud29yZClcbiAgICAuc2xpY2UoMCwgbWF4KTtcblxuICAvLyBYWFg6IFRoZXJlIGlzIG5vIGd1YXJhbnRlZSB0aGF0IGVxdWFscyB3aXRoIG1heCwgYnV0IGl0IGlzIGltcG9ydGFudCBmb3IgcGVyZm9ybWFuY2VcbiAgcmV0dXJuIHVuaXFXaXRoKFxuICAgIGNhbmRpZGF0ZSxcbiAgICAoYSwgYikgPT5cbiAgICAgIGEudmFsdWUgPT09IGIudmFsdWUgJiZcbiAgICAgIFdvcmRUeXBlTWV0YS5vZihhLnR5cGUpLmdyb3VwID09PSBXb3JkVHlwZU1ldGEub2YoYi50eXBlKS5ncm91cFxuICApO1xufVxuXG4vLyBUT0RPOiByZWZhY3RvcmluZ1xuLy8gUHVibGljIGZvciB0ZXN0c1xuZXhwb3J0IGZ1bmN0aW9uIGp1ZGdlQnlQYXJ0aWFsTWF0Y2goXG4gIHdvcmQ6IFdvcmQsXG4gIHF1ZXJ5OiBzdHJpbmcsXG4gIHF1ZXJ5U3RhcnRXaXRoVXBwZXI6IGJvb2xlYW5cbik6IEp1ZGdlbWVudCB7XG4gIGlmIChxdWVyeSA9PT0gXCJcIikge1xuICAgIHJldHVybiB7IHdvcmQsIHZhbHVlOiB3b3JkLnZhbHVlLCBhbGlhczogZmFsc2UgfTtcbiAgfVxuXG4gIGlmIChsb3dlclN0YXJ0c1dpdGgod29yZC52YWx1ZSwgcXVlcnkpKSB7XG4gICAgaWYgKFxuICAgICAgcXVlcnlTdGFydFdpdGhVcHBlciAmJlxuICAgICAgd29yZC50eXBlICE9PSBcImludGVybmFsTGlua1wiICYmXG4gICAgICB3b3JkLnR5cGUgIT09IFwiZnJvbnRNYXR0ZXJcIlxuICAgICkge1xuICAgICAgY29uc3QgYyA9IGNhcGl0YWxpemVGaXJzdExldHRlcih3b3JkLnZhbHVlKTtcbiAgICAgIHJldHVybiB7IHdvcmQ6IHsgLi4ud29yZCwgdmFsdWU6IGMgfSwgdmFsdWU6IGMsIGFsaWFzOiBmYWxzZSB9O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4geyB3b3JkOiB3b3JkLCB2YWx1ZTogd29yZC52YWx1ZSwgYWxpYXM6IGZhbHNlIH07XG4gICAgfVxuICB9XG5cbiAgY29uc3QgbWF0Y2hlZEFsaWFzU3RhcnRzID0gd29yZC5hbGlhc2VzPy5maW5kKChhKSA9PlxuICAgIGxvd2VyU3RhcnRzV2l0aChhLCBxdWVyeSlcbiAgKTtcbiAgaWYgKG1hdGNoZWRBbGlhc1N0YXJ0cykge1xuICAgIHJldHVybiB7XG4gICAgICB3b3JkOiB7IC4uLndvcmQgfSxcbiAgICAgIHZhbHVlOiBtYXRjaGVkQWxpYXNTdGFydHMsXG4gICAgICBhbGlhczogdHJ1ZSxcbiAgICB9O1xuICB9XG5cbiAgaWYgKGxvd2VySW5jbHVkZXMod29yZC52YWx1ZSwgcXVlcnkpKSB7XG4gICAgcmV0dXJuIHsgd29yZDogd29yZCwgdmFsdWU6IHdvcmQudmFsdWUsIGFsaWFzOiBmYWxzZSB9O1xuICB9XG5cbiAgY29uc3QgbWF0Y2hlZEFsaWFzSW5jbHVkZWQgPSB3b3JkLmFsaWFzZXM/LmZpbmQoKGEpID0+XG4gICAgbG93ZXJJbmNsdWRlcyhhLCBxdWVyeSlcbiAgKTtcbiAgaWYgKG1hdGNoZWRBbGlhc0luY2x1ZGVkKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHdvcmQ6IHsgLi4ud29yZCB9LFxuICAgICAgdmFsdWU6IG1hdGNoZWRBbGlhc0luY2x1ZGVkLFxuICAgICAgYWxpYXM6IHRydWUsXG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiB7IHdvcmQ6IHdvcmQsIGFsaWFzOiBmYWxzZSB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc3VnZ2VzdFdvcmRzQnlQYXJ0aWFsTWF0Y2goXG4gIGluZGV4ZWRXb3JkczogSW5kZXhlZFdvcmRzLFxuICBxdWVyeTogc3RyaW5nLFxuICBtYXg6IG51bWJlcixcbiAgZnJvbnRNYXR0ZXI6IHN0cmluZyB8IG51bGxcbik6IFdvcmRbXSB7XG4gIGNvbnN0IHF1ZXJ5U3RhcnRXaXRoVXBwZXIgPSBjYXBpdGFsaXplRmlyc3RMZXR0ZXIocXVlcnkpID09PSBxdWVyeTtcblxuICBjb25zdCBmbGF0T2JqZWN0VmFsdWVzID0gKG9iamVjdDogeyBbZmlyc3RMZXR0ZXI6IHN0cmluZ106IFdvcmRbXSB9KSA9PlxuICAgIE9iamVjdC52YWx1ZXMob2JqZWN0KS5mbGF0KCk7XG5cbiAgY29uc3QgZmxhdHRlbkZyb250TWF0dGVyV29yZHMgPSAoKSA9PiB7XG4gICAgaWYgKGZyb250TWF0dGVyID09PSBcImFsaWFzXCIgfHwgZnJvbnRNYXR0ZXIgPT09IFwiYWxpYXNlc1wiKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuICAgIGlmIChmcm9udE1hdHRlciAmJiBpbmRleGVkV29yZHMuZnJvbnRNYXR0ZXI/Lltmcm9udE1hdHRlcl0pIHtcbiAgICAgIHJldHVybiBPYmplY3QudmFsdWVzKGluZGV4ZWRXb3Jkcy5mcm9udE1hdHRlcj8uW2Zyb250TWF0dGVyXSkuZmxhdCgpO1xuICAgIH1cbiAgICByZXR1cm4gW107XG4gIH07XG5cbiAgY29uc3Qgd29yZHMgPSBmcm9udE1hdHRlclxuICAgID8gZmxhdHRlbkZyb250TWF0dGVyV29yZHMoKVxuICAgIDogW1xuICAgICAgICAuLi5mbGF0T2JqZWN0VmFsdWVzKGluZGV4ZWRXb3Jkcy5jdXJyZW50RmlsZSksXG4gICAgICAgIC4uLmZsYXRPYmplY3RWYWx1ZXMoaW5kZXhlZFdvcmRzLmN1cnJlbnRWYXVsdCksXG4gICAgICAgIC4uLmZsYXRPYmplY3RWYWx1ZXMoaW5kZXhlZFdvcmRzLmN1c3RvbURpY3Rpb25hcnkpLFxuICAgICAgICAuLi5mbGF0T2JqZWN0VmFsdWVzKGluZGV4ZWRXb3Jkcy5pbnRlcm5hbExpbmspLFxuICAgICAgXTtcblxuICBjb25zdCBjYW5kaWRhdGUgPSBBcnJheS5mcm9tKHdvcmRzKVxuICAgIC5tYXAoKHgpID0+IGp1ZGdlQnlQYXJ0aWFsTWF0Y2goeCwgcXVlcnksIHF1ZXJ5U3RhcnRXaXRoVXBwZXIpKVxuICAgIC5maWx0ZXIoKHgpID0+IHgudmFsdWUgIT09IHVuZGVmaW5lZClcbiAgICAuc29ydCgoYSwgYikgPT4ge1xuICAgICAgY29uc3Qgbm90U2FtZVdvcmRUeXBlID0gYS53b3JkLnR5cGUgIT09IGIud29yZC50eXBlO1xuICAgICAgaWYgKGZyb250TWF0dGVyICYmIG5vdFNhbWVXb3JkVHlwZSkge1xuICAgICAgICByZXR1cm4gYi53b3JkLnR5cGUgPT09IFwiZnJvbnRNYXR0ZXJcIiA/IDEgOiAtMTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgYXMgPSBsb3dlclN0YXJ0c1dpdGgoYS52YWx1ZSEsIHF1ZXJ5KTtcbiAgICAgIGNvbnN0IGJzID0gbG93ZXJTdGFydHNXaXRoKGIudmFsdWUhLCBxdWVyeSk7XG4gICAgICBpZiAoYXMgIT09IGJzKSB7XG4gICAgICAgIHJldHVybiBicyA/IDEgOiAtMTtcbiAgICAgIH1cblxuICAgICAgaWYgKGEudmFsdWUhLmxlbmd0aCAhPT0gYi52YWx1ZSEubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBhLnZhbHVlIS5sZW5ndGggPiBiLnZhbHVlIS5sZW5ndGggPyAxIDogLTE7XG4gICAgICB9XG4gICAgICBpZiAobm90U2FtZVdvcmRUeXBlKSB7XG4gICAgICAgIHJldHVybiBXb3JkVHlwZU1ldGEub2YoYi53b3JkLnR5cGUpLnByaW9yaXR5ID5cbiAgICAgICAgICBXb3JkVHlwZU1ldGEub2YoYS53b3JkLnR5cGUpLnByaW9yaXR5XG4gICAgICAgICAgPyAxXG4gICAgICAgICAgOiAtMTtcbiAgICAgIH1cbiAgICAgIGlmIChhLmFsaWFzICE9PSBiLmFsaWFzKSB7XG4gICAgICAgIHJldHVybiBhLmFsaWFzID8gMSA6IC0xO1xuICAgICAgfVxuICAgICAgcmV0dXJuIDA7XG4gICAgfSlcbiAgICAubWFwKCh4KSA9PiB4LndvcmQpXG4gICAgLnNsaWNlKDAsIG1heCk7XG5cbiAgLy8gWFhYOiBUaGVyZSBpcyBubyBndWFyYW50ZWUgdGhhdCBlcXVhbHMgd2l0aCBtYXgsIGJ1dCBpdCBpcyBpbXBvcnRhbnQgZm9yIHBlcmZvcm1hbmNlXG4gIHJldHVybiB1bmlxV2l0aChcbiAgICBjYW5kaWRhdGUsXG4gICAgKGEsIGIpID0+XG4gICAgICBhLnZhbHVlID09PSBiLnZhbHVlICYmXG4gICAgICBXb3JkVHlwZU1ldGEub2YoYS50eXBlKS5ncm91cCA9PT0gV29yZFR5cGVNZXRhLm9mKGIudHlwZSkuZ3JvdXBcbiAgKTtcbn1cbiIsImV4cG9ydCBmdW5jdGlvbiBiYXNlbmFtZShwYXRoOiBzdHJpbmcsIGV4dD86IHN0cmluZyk6IHN0cmluZyB7XG4gIGNvbnN0IG5hbWUgPSBwYXRoLm1hdGNoKC8uK1tcXFxcL10oW15cXFxcL10rKVtcXFxcL10/JC8pPy5bMV0gPz8gcGF0aDtcbiAgcmV0dXJuIGV4dCAmJiBuYW1lLmVuZHNXaXRoKGV4dCkgPyBuYW1lLnJlcGxhY2UoZXh0LCBcIlwiKSA6IG5hbWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBleHRuYW1lKHBhdGg6IHN0cmluZyk6IHN0cmluZyB7XG4gIGNvbnN0IGV4dCA9IGJhc2VuYW1lKHBhdGgpLnNwbGl0KFwiLlwiKS5zbGljZSgxKS5wb3AoKTtcbiAgcmV0dXJuIGV4dCA/IGAuJHtleHR9YCA6IFwiXCI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkaXJuYW1lKHBhdGg6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiBwYXRoLm1hdGNoKC8oLispW1xcXFwvXS4rJC8pPy5bMV0gPz8gXCIuXCI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1VSTChwYXRoOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuIEJvb2xlYW4ocGF0aC5tYXRjaChuZXcgUmVnRXhwKFwiXmh0dHBzPzovL1wiKSkpO1xufVxuIiwiaW1wb3J0IHsgQXBwLCBGaWxlU3lzdGVtQWRhcHRlciwgTm90aWNlLCByZXF1ZXN0IH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgeyBwdXNoV29yZCwgV29yZHNCeUZpcnN0TGV0dGVyIH0gZnJvbSBcIi4vc3VnZ2VzdGVyXCI7XG5pbXBvcnQgeyBDb2x1bW5EZWxpbWl0ZXIgfSBmcm9tIFwiLi4vb3B0aW9uL0NvbHVtbkRlbGltaXRlclwiO1xuaW1wb3J0IHsgaXNVUkwgfSBmcm9tIFwiLi4vdXRpbC9wYXRoXCI7XG5pbXBvcnQgeyBXb3JkIH0gZnJvbSBcIi4uL21vZGVsL1dvcmRcIjtcblxuZnVuY3Rpb24gZXNjYXBlKHZhbHVlOiBzdHJpbmcpOiBzdHJpbmcge1xuICAvLyBUaGlzIHRyaWNreSBsb2dpY3MgZm9yIFNhZmFyaVxuICAvLyBodHRwczovL2dpdGh1Yi5jb20vdGFkYXNoaS1haWthd2Evb2JzaWRpYW4tdmFyaW91cy1jb21wbGVtZW50cy1wbHVnaW4vaXNzdWVzLzU2XG4gIHJldHVybiB2YWx1ZVxuICAgIC5yZXBsYWNlKC9cXFxcL2csIFwiX19WYXJpb3VzQ29tcGxlbWVudHNFc2NhcGVfX1wiKVxuICAgIC5yZXBsYWNlKC9cXG4vZywgXCJcXFxcblwiKVxuICAgIC5yZXBsYWNlKC9cXHQvZywgXCJcXFxcdFwiKVxuICAgIC5yZXBsYWNlKC9fX1ZhcmlvdXNDb21wbGVtZW50c0VzY2FwZV9fL2csIFwiXFxcXFxcXFxcIik7XG59XG5cbmZ1bmN0aW9uIHVuZXNjYXBlKHZhbHVlOiBzdHJpbmcpOiBzdHJpbmcge1xuICAvLyBUaGlzIHRyaWNreSBsb2dpY3MgZm9yIFNhZmFyaVxuICAvLyBodHRwczovL2dpdGh1Yi5jb20vdGFkYXNoaS1haWthd2Evb2JzaWRpYW4tdmFyaW91cy1jb21wbGVtZW50cy1wbHVnaW4vaXNzdWVzLzU2XG4gIHJldHVybiB2YWx1ZVxuICAgIC5yZXBsYWNlKC9cXFxcXFxcXC9nLCBcIl9fVmFyaW91c0NvbXBsZW1lbnRzRXNjYXBlX19cIilcbiAgICAucmVwbGFjZSgvXFxcXG4vZywgXCJcXG5cIilcbiAgICAucmVwbGFjZSgvXFxcXHQvZywgXCJcXHRcIilcbiAgICAucmVwbGFjZSgvX19WYXJpb3VzQ29tcGxlbWVudHNFc2NhcGVfXy9nLCBcIlxcXFxcIik7XG59XG5cbmZ1bmN0aW9uIGxpbmVUb1dvcmQoXG4gIGxpbmU6IHN0cmluZyxcbiAgZGVsaW1pdGVyOiBDb2x1bW5EZWxpbWl0ZXIsXG4gIHBhdGg6IHN0cmluZ1xuKTogV29yZCB7XG4gIGNvbnN0IFt2YWx1ZSwgZGVzY3JpcHRpb24sIC4uLmFsaWFzZXNdID0gbGluZS5zcGxpdChkZWxpbWl0ZXIudmFsdWUpO1xuICByZXR1cm4ge1xuICAgIHZhbHVlOiB1bmVzY2FwZSh2YWx1ZSksXG4gICAgZGVzY3JpcHRpb24sXG4gICAgYWxpYXNlcyxcbiAgICB0eXBlOiBcImN1c3RvbURpY3Rpb25hcnlcIixcbiAgICBjcmVhdGVkUGF0aDogcGF0aCxcbiAgfTtcbn1cblxuZnVuY3Rpb24gd29yZFRvTGluZSh3b3JkOiBXb3JkLCBkZWxpbWl0ZXI6IENvbHVtbkRlbGltaXRlcik6IHN0cmluZyB7XG4gIGNvbnN0IGVzY2FwZWRWYWx1ZSA9IGVzY2FwZSh3b3JkLnZhbHVlKTtcbiAgaWYgKCF3b3JkLmRlc2NyaXB0aW9uICYmICF3b3JkLmFsaWFzZXMpIHtcbiAgICByZXR1cm4gZXNjYXBlZFZhbHVlO1xuICB9XG4gIGlmICghd29yZC5hbGlhc2VzKSB7XG4gICAgcmV0dXJuIFtlc2NhcGVkVmFsdWUsIHdvcmQuZGVzY3JpcHRpb25dLmpvaW4oZGVsaW1pdGVyLnZhbHVlKTtcbiAgfVxuICByZXR1cm4gW2VzY2FwZWRWYWx1ZSwgd29yZC5kZXNjcmlwdGlvbiwgLi4ud29yZC5hbGlhc2VzXS5qb2luKFxuICAgIGRlbGltaXRlci52YWx1ZVxuICApO1xufVxuXG5leHBvcnQgY2xhc3MgQ3VzdG9tRGljdGlvbmFyeVdvcmRQcm92aWRlciB7XG4gIHByaXZhdGUgd29yZHM6IFdvcmRbXSA9IFtdO1xuICB3b3JkQnlWYWx1ZTogeyBbdmFsdWU6IHN0cmluZ106IFdvcmQgfSA9IHt9O1xuICB3b3Jkc0J5Rmlyc3RMZXR0ZXI6IFdvcmRzQnlGaXJzdExldHRlciA9IHt9O1xuXG4gIHByaXZhdGUgYXBwOiBBcHA7XG4gIHByaXZhdGUgZmlsZVN5c3RlbUFkYXB0ZXI6IEZpbGVTeXN0ZW1BZGFwdGVyO1xuICBwcml2YXRlIHBhdGhzOiBzdHJpbmdbXTtcbiAgcHJpdmF0ZSBkZWxpbWl0ZXI6IENvbHVtbkRlbGltaXRlcjtcblxuICBjb25zdHJ1Y3RvcihhcHA6IEFwcCkge1xuICAgIHRoaXMuYXBwID0gYXBwO1xuICAgIHRoaXMuZmlsZVN5c3RlbUFkYXB0ZXIgPSBhcHAudmF1bHQuYWRhcHRlciBhcyBGaWxlU3lzdGVtQWRhcHRlcjtcbiAgfVxuXG4gIGdldCBlZGl0YWJsZVBhdGhzKCk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gdGhpcy5wYXRocy5maWx0ZXIoKHgpID0+ICFpc1VSTCh4KSk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGxvYWRXb3JkcyhwYXRoOiBzdHJpbmcsIHJlZ2V4cDogc3RyaW5nKTogUHJvbWlzZTxXb3JkW10+IHtcbiAgICBjb25zdCBjb250ZW50cyA9IGlzVVJMKHBhdGgpXG4gICAgICA/IGF3YWl0IHJlcXVlc3QoeyB1cmw6IHBhdGggfSlcbiAgICAgIDogYXdhaXQgdGhpcy5maWxlU3lzdGVtQWRhcHRlci5yZWFkKHBhdGgpO1xuXG4gICAgcmV0dXJuIGNvbnRlbnRzXG4gICAgICAuc3BsaXQoL1xcclxcbnxcXG4vKVxuICAgICAgLm1hcCgoeCkgPT4geC5yZXBsYWNlKC8lJS4qJSUvZywgXCJcIikpXG4gICAgICAuZmlsdGVyKCh4KSA9PiB4KVxuICAgICAgLm1hcCgoeCkgPT4gbGluZVRvV29yZCh4LCB0aGlzLmRlbGltaXRlciwgcGF0aCkpXG4gICAgICAuZmlsdGVyKCh4KSA9PiAhcmVnZXhwIHx8IHgudmFsdWUubWF0Y2gobmV3IFJlZ0V4cChyZWdleHApKSk7XG4gIH1cblxuICBhc3luYyByZWZyZXNoQ3VzdG9tV29yZHMocmVnZXhwOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0aGlzLmNsZWFyV29yZHMoKTtcblxuICAgIGZvciAoY29uc3QgcGF0aCBvZiB0aGlzLnBhdGhzKSB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCB3b3JkcyA9IGF3YWl0IHRoaXMubG9hZFdvcmRzKHBhdGgsIHJlZ2V4cCk7XG4gICAgICAgIHdvcmRzLmZvckVhY2goKHgpID0+IHRoaXMud29yZHMucHVzaCh4KSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIG5vaW5zcGVjdGlvbiBPYmplY3RBbGxvY2F0aW9uSWdub3JlZFxuICAgICAgICBuZXcgTm90aWNlKFxuICAgICAgICAgIGDimqAgRmFpbCB0byBsb2FkICR7cGF0aH0gLS0gVmFyaW91cyBDb21wbGVtZW50cyBQbHVnaW4gLS0gXFxuICR7ZX1gLFxuICAgICAgICAgIDBcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLndvcmRzLmZvckVhY2goKHgpID0+IHRoaXMuYWRkV29yZCh4KSk7XG4gIH1cblxuICBhc3luYyBhZGRXb3JkV2l0aERpY3Rpb25hcnkoXG4gICAgd29yZDogV29yZCxcbiAgICBkaWN0aW9uYXJ5UGF0aDogc3RyaW5nXG4gICk6IFByb21pc2U8dm9pZD4ge1xuICAgIHRoaXMuYWRkV29yZCh3b3JkKTtcbiAgICBhd2FpdCB0aGlzLmZpbGVTeXN0ZW1BZGFwdGVyLmFwcGVuZChcbiAgICAgIGRpY3Rpb25hcnlQYXRoLFxuICAgICAgXCJcXG5cIiArIHdvcmRUb0xpbmUod29yZCwgdGhpcy5kZWxpbWl0ZXIpXG4gICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgYWRkV29yZCh3b3JkOiBXb3JkKSB7XG4gICAgdGhpcy53b3JkQnlWYWx1ZVt3b3JkLnZhbHVlXSA9IHdvcmQ7XG4gICAgcHVzaFdvcmQodGhpcy53b3Jkc0J5Rmlyc3RMZXR0ZXIsIHdvcmQudmFsdWUuY2hhckF0KDApLCB3b3JkKTtcbiAgICB3b3JkLmFsaWFzZXM/LmZvckVhY2goKGEpID0+XG4gICAgICBwdXNoV29yZCh0aGlzLndvcmRzQnlGaXJzdExldHRlciwgYS5jaGFyQXQoMCksIHdvcmQpXG4gICAgKTtcbiAgfVxuXG4gIGNsZWFyV29yZHMoKTogdm9pZCB7XG4gICAgdGhpcy53b3JkcyA9IFtdO1xuICAgIHRoaXMud29yZEJ5VmFsdWUgPSB7fTtcbiAgICB0aGlzLndvcmRzQnlGaXJzdExldHRlciA9IHt9O1xuICB9XG5cbiAgZ2V0IHdvcmRDb3VudCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLndvcmRzLmxlbmd0aDtcbiAgfVxuXG4gIHNldFNldHRpbmdzKHBhdGhzOiBzdHJpbmdbXSwgZGVsaW1pdGVyOiBDb2x1bW5EZWxpbWl0ZXIpIHtcbiAgICB0aGlzLnBhdGhzID0gcGF0aHM7XG4gICAgdGhpcy5kZWxpbWl0ZXIgPSBkZWxpbWl0ZXI7XG4gIH1cbn1cbiIsImltcG9ydCB7IEFwcCB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHsgZ3JvdXBCeSwgdW5pcSB9IGZyb20gXCIuLi91dGlsL2NvbGxlY3Rpb24taGVscGVyXCI7XG5pbXBvcnQgeyBXb3Jkc0J5Rmlyc3RMZXR0ZXIgfSBmcm9tIFwiLi9zdWdnZXN0ZXJcIjtcbmltcG9ydCB7IFRva2VuaXplciB9IGZyb20gXCIuLi90b2tlbml6ZXIvdG9rZW5pemVyXCI7XG5pbXBvcnQgeyBBcHBIZWxwZXIgfSBmcm9tIFwiLi4vYXBwLWhlbHBlclwiO1xuaW1wb3J0IHsgYWxsQWxwaGFiZXRzIH0gZnJvbSBcIi4uL3V0aWwvc3RyaW5nc1wiO1xuaW1wb3J0IHsgV29yZCB9IGZyb20gXCIuLi9tb2RlbC9Xb3JkXCI7XG5cbmV4cG9ydCBjbGFzcyBDdXJyZW50RmlsZVdvcmRQcm92aWRlciB7XG4gIHdvcmRzQnlGaXJzdExldHRlcjogV29yZHNCeUZpcnN0TGV0dGVyID0ge307XG4gIHByaXZhdGUgd29yZHM6IFdvcmRbXSA9IFtdO1xuICBwcml2YXRlIHRva2VuaXplcjogVG9rZW5pemVyO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgYXBwOiBBcHAsIHByaXZhdGUgYXBwSGVscGVyOiBBcHBIZWxwZXIpIHt9XG5cbiAgYXN5bmMgcmVmcmVzaFdvcmRzKG9ubHlFbmdsaXNoOiBib29sZWFuKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdGhpcy5jbGVhcldvcmRzKCk7XG5cbiAgICBjb25zdCBlZGl0b3IgPSB0aGlzLmFwcEhlbHBlci5nZXRDdXJyZW50RWRpdG9yKCk7XG4gICAgaWYgKCFlZGl0b3IpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBmaWxlID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKTtcbiAgICBpZiAoIWZpbGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBjdXJyZW50VG9rZW4gPSB0aGlzLnRva2VuaXplclxuICAgICAgLnRva2VuaXplKFxuICAgICAgICBlZGl0b3IuZ2V0TGluZShlZGl0b3IuZ2V0Q3Vyc29yKCkubGluZSkuc2xpY2UoMCwgZWRpdG9yLmdldEN1cnNvcigpLmNoKVxuICAgICAgKVxuICAgICAgLmxhc3QoKTtcblxuICAgIGNvbnN0IGNvbnRlbnQgPSBhd2FpdCB0aGlzLmFwcC52YXVsdC5jYWNoZWRSZWFkKGZpbGUpO1xuICAgIGNvbnN0IHRva2VucyA9IG9ubHlFbmdsaXNoXG4gICAgICA/IHRoaXMudG9rZW5pemVyLnRva2VuaXplKGNvbnRlbnQpLmZpbHRlcihhbGxBbHBoYWJldHMpXG4gICAgICA6IHRoaXMudG9rZW5pemVyLnRva2VuaXplKGNvbnRlbnQpO1xuICAgIHRoaXMud29yZHMgPSB1bmlxKHRva2VucylcbiAgICAgIC5maWx0ZXIoKHgpID0+IHggIT09IGN1cnJlbnRUb2tlbilcbiAgICAgIC5tYXAoKHgpID0+ICh7XG4gICAgICAgIHZhbHVlOiB4LFxuICAgICAgICB0eXBlOiBcImN1cnJlbnRGaWxlXCIsXG4gICAgICAgIGNyZWF0ZWRQYXRoOiBmaWxlLnBhdGgsXG4gICAgICB9KSk7XG4gICAgdGhpcy53b3Jkc0J5Rmlyc3RMZXR0ZXIgPSBncm91cEJ5KHRoaXMud29yZHMsICh4KSA9PiB4LnZhbHVlLmNoYXJBdCgwKSk7XG4gIH1cblxuICBjbGVhcldvcmRzKCk6IHZvaWQge1xuICAgIHRoaXMud29yZHMgPSBbXTtcbiAgICB0aGlzLndvcmRzQnlGaXJzdExldHRlciA9IHt9O1xuICB9XG5cbiAgZ2V0IHdvcmRDb3VudCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLndvcmRzLmxlbmd0aDtcbiAgfVxuXG4gIHNldFNldHRpbmdzKHRva2VuaXplcjogVG9rZW5pemVyKSB7XG4gICAgdGhpcy50b2tlbml6ZXIgPSB0b2tlbml6ZXI7XG4gIH1cbn1cbiIsImltcG9ydCB7IEFwcCB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHsgcHVzaFdvcmQsIFdvcmRzQnlGaXJzdExldHRlciB9IGZyb20gXCIuL3N1Z2dlc3RlclwiO1xuaW1wb3J0IHsgQXBwSGVscGVyIH0gZnJvbSBcIi4uL2FwcC1oZWxwZXJcIjtcbmltcG9ydCB7IGV4Y2x1ZGVFbW9qaSB9IGZyb20gXCIuLi91dGlsL3N0cmluZ3NcIjtcbmltcG9ydCB7IEludGVybmFsTGlua1dvcmQsIFdvcmQsIFdvcmRUeXBlIH0gZnJvbSBcIi4uL21vZGVsL1dvcmRcIjtcblxuZXhwb3J0IGNsYXNzIEludGVybmFsTGlua1dvcmRQcm92aWRlciB7XG4gIHByaXZhdGUgd29yZHM6IFdvcmRbXSA9IFtdO1xuICB3b3Jkc0J5Rmlyc3RMZXR0ZXI6IFdvcmRzQnlGaXJzdExldHRlciA9IHt9O1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgYXBwOiBBcHAsIHByaXZhdGUgYXBwSGVscGVyOiBBcHBIZWxwZXIpIHt9XG5cbiAgcmVmcmVzaFdvcmRzKHdvcmRBc0ludGVybmFsTGlua0FsaWFzOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5jbGVhcldvcmRzKCk7XG5cbiAgICBjb25zdCBzeW5vbnltQWxpYXNlcyA9IChuYW1lOiBzdHJpbmcpOiBzdHJpbmdbXSA9PiB7XG4gICAgICBjb25zdCBsZXNzRW1vamlWYWx1ZSA9IGV4Y2x1ZGVFbW9qaShuYW1lKTtcbiAgICAgIHJldHVybiBuYW1lID09PSBsZXNzRW1vamlWYWx1ZSA/IFtdIDogW2xlc3NFbW9qaVZhbHVlXTtcbiAgICB9O1xuXG4gICAgY29uc3QgcmVzb2x2ZWRJbnRlcm5hbExpbmtXb3JkczogSW50ZXJuYWxMaW5rV29yZFtdID0gdGhpcy5hcHAudmF1bHRcbiAgICAgIC5nZXRNYXJrZG93bkZpbGVzKClcbiAgICAgIC5mbGF0TWFwKCh4KSA9PiB7XG4gICAgICAgIGNvbnN0IGFsaWFzZXMgPSB0aGlzLmFwcEhlbHBlci5nZXRBbGlhc2VzKHgpO1xuXG4gICAgICAgIGlmICh3b3JkQXNJbnRlcm5hbExpbmtBbGlhcykge1xuICAgICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHZhbHVlOiB4LmJhc2VuYW1lLFxuICAgICAgICAgICAgICB0eXBlOiBcImludGVybmFsTGlua1wiLFxuICAgICAgICAgICAgICBjcmVhdGVkUGF0aDogeC5wYXRoLFxuICAgICAgICAgICAgICBhbGlhc2VzOiBzeW5vbnltQWxpYXNlcyh4LmJhc2VuYW1lKSxcbiAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHgucGF0aCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAuLi5hbGlhc2VzLm1hcCgoYSkgPT4gKHtcbiAgICAgICAgICAgICAgdmFsdWU6IGEsXG4gICAgICAgICAgICAgIHR5cGU6IFwiaW50ZXJuYWxMaW5rXCIsXG4gICAgICAgICAgICAgIGNyZWF0ZWRQYXRoOiB4LnBhdGgsXG4gICAgICAgICAgICAgIGFsaWFzZXM6IHN5bm9ueW1BbGlhc2VzKGEpLFxuICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogeC5wYXRoLFxuICAgICAgICAgICAgICBhbGlhc01ldGE6IHtcbiAgICAgICAgICAgICAgICBvcmlnaW46IHguYmFzZW5hbWUsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9KSksXG4gICAgICAgICAgXSBhcyBJbnRlcm5hbExpbmtXb3JkW107XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgdmFsdWU6IHguYmFzZW5hbWUsXG4gICAgICAgICAgICAgIHR5cGU6IFwiaW50ZXJuYWxMaW5rXCIsXG4gICAgICAgICAgICAgIGNyZWF0ZWRQYXRoOiB4LnBhdGgsXG4gICAgICAgICAgICAgIGFsaWFzZXM6IFtcbiAgICAgICAgICAgICAgICAuLi5zeW5vbnltQWxpYXNlcyh4LmJhc2VuYW1lKSxcbiAgICAgICAgICAgICAgICAuLi5hbGlhc2VzLFxuICAgICAgICAgICAgICAgIC4uLmFsaWFzZXMuZmxhdE1hcChzeW5vbnltQWxpYXNlcyksXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiB4LnBhdGgsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0gYXMgSW50ZXJuYWxMaW5rV29yZFtdO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgIGNvbnN0IHVucmVzb2x2ZWRJbnRlcm5hbExpbmtXb3JkczogSW50ZXJuYWxMaW5rV29yZFtdID0gdGhpcy5hcHBIZWxwZXJcbiAgICAgIC5zZWFyY2hQaGFudG9tTGlua3MoKVxuICAgICAgLm1hcCgoeyBwYXRoLCBsaW5rIH0pID0+IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB2YWx1ZTogbGluayxcbiAgICAgICAgICB0eXBlOiBcImludGVybmFsTGlua1wiLFxuICAgICAgICAgIGNyZWF0ZWRQYXRoOiBwYXRoLFxuICAgICAgICAgIGFsaWFzZXM6IHN5bm9ueW1BbGlhc2VzKGxpbmspLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiBgQXBwZWFyZWQgaW4gLT4gJHtwYXRofWAsXG4gICAgICAgICAgcGhhbnRvbTogdHJ1ZSxcbiAgICAgICAgfTtcbiAgICAgIH0pO1xuXG4gICAgdGhpcy53b3JkcyA9IFsuLi5yZXNvbHZlZEludGVybmFsTGlua1dvcmRzLCAuLi51bnJlc29sdmVkSW50ZXJuYWxMaW5rV29yZHNdO1xuICAgIGZvciAoY29uc3Qgd29yZCBvZiB0aGlzLndvcmRzKSB7XG4gICAgICBwdXNoV29yZCh0aGlzLndvcmRzQnlGaXJzdExldHRlciwgd29yZC52YWx1ZS5jaGFyQXQoMCksIHdvcmQpO1xuICAgICAgd29yZC5hbGlhc2VzPy5mb3JFYWNoKChhKSA9PlxuICAgICAgICBwdXNoV29yZCh0aGlzLndvcmRzQnlGaXJzdExldHRlciwgYS5jaGFyQXQoMCksIHdvcmQpXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIGNsZWFyV29yZHMoKTogdm9pZCB7XG4gICAgdGhpcy53b3JkcyA9IFtdO1xuICAgIHRoaXMud29yZHNCeUZpcnN0TGV0dGVyID0ge307XG4gIH1cblxuICBnZXQgd29yZENvdW50KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMud29yZHMubGVuZ3RoO1xuICB9XG59XG4iLCJpbXBvcnQgeyBJbmRleGVkV29yZHMgfSBmcm9tIFwiLi4vdWkvQXV0b0NvbXBsZXRlU3VnZ2VzdFwiO1xuaW1wb3J0IHsgc3VnZ2VzdFdvcmRzLCBzdWdnZXN0V29yZHNCeVBhcnRpYWxNYXRjaCB9IGZyb20gXCIuL3N1Z2dlc3RlclwiO1xuaW1wb3J0IHsgV29yZCB9IGZyb20gXCIuLi9tb2RlbC9Xb3JkXCI7XG5cbnR5cGUgTmFtZSA9IFwicHJlZml4XCIgfCBcInBhcnRpYWxcIjtcblxudHlwZSBIYW5kbGVyID0gKFxuICBpbmRleGVkV29yZHM6IEluZGV4ZWRXb3JkcyxcbiAgcXVlcnk6IHN0cmluZyxcbiAgbWF4OiBudW1iZXIsXG4gIGZyb250TWF0dGVyOiBzdHJpbmcgfCBudWxsXG4pID0+IFdvcmRbXTtcblxuZXhwb3J0IGNsYXNzIE1hdGNoU3RyYXRlZ3kge1xuICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBfdmFsdWVzOiBNYXRjaFN0cmF0ZWd5W10gPSBbXTtcblxuICBzdGF0aWMgcmVhZG9ubHkgUFJFRklYID0gbmV3IE1hdGNoU3RyYXRlZ3koXCJwcmVmaXhcIiwgc3VnZ2VzdFdvcmRzKTtcbiAgc3RhdGljIHJlYWRvbmx5IFBBUlRJQUwgPSBuZXcgTWF0Y2hTdHJhdGVneShcbiAgICBcInBhcnRpYWxcIixcbiAgICBzdWdnZXN0V29yZHNCeVBhcnRpYWxNYXRjaFxuICApO1xuXG4gIHByaXZhdGUgY29uc3RydWN0b3IocmVhZG9ubHkgbmFtZTogTmFtZSwgcmVhZG9ubHkgaGFuZGxlcjogSGFuZGxlcikge1xuICAgIE1hdGNoU3RyYXRlZ3kuX3ZhbHVlcy5wdXNoKHRoaXMpO1xuICB9XG5cbiAgc3RhdGljIGZyb21OYW1lKG5hbWU6IHN0cmluZyk6IE1hdGNoU3RyYXRlZ3kge1xuICAgIHJldHVybiBNYXRjaFN0cmF0ZWd5Ll92YWx1ZXMuZmluZCgoeCkgPT4geC5uYW1lID09PSBuYW1lKSE7XG4gIH1cblxuICBzdGF0aWMgdmFsdWVzKCk6IE1hdGNoU3RyYXRlZ3lbXSB7XG4gICAgcmV0dXJuIE1hdGNoU3RyYXRlZ3kuX3ZhbHVlcztcbiAgfVxufVxuIiwiaW1wb3J0IHsgTW9kaWZpZXIgfSBmcm9tIFwib2JzaWRpYW5cIjtcblxudHlwZSBOYW1lID1cbiAgfCBcIk5vbmVcIlxuICB8IFwiVGFiLCBTaGlmdCtUYWJcIlxuICB8IFwiQ3RybC9DbWQrTiwgQ3RybC9DbWQrUFwiXG4gIHwgXCJDdHJsL0NtZCtKLCBDdHJsL0NtZCtLXCI7XG5pbnRlcmZhY2UgS2V5QmluZCB7XG4gIG1vZGlmaWVyczogTW9kaWZpZXJbXTtcbiAga2V5OiBzdHJpbmcgfCBudWxsO1xufVxuXG5leHBvcnQgY2xhc3MgQ3ljbGVUaHJvdWdoU3VnZ2VzdGlvbnNLZXlzIHtcbiAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgX3ZhbHVlczogQ3ljbGVUaHJvdWdoU3VnZ2VzdGlvbnNLZXlzW10gPSBbXTtcblxuICBzdGF0aWMgcmVhZG9ubHkgTk9ORSA9IG5ldyBDeWNsZVRocm91Z2hTdWdnZXN0aW9uc0tleXMoXG4gICAgXCJOb25lXCIsXG4gICAgeyBtb2RpZmllcnM6IFtdLCBrZXk6IG51bGwgfSxcbiAgICB7IG1vZGlmaWVyczogW10sIGtleTogbnVsbCB9XG4gICk7XG4gIHN0YXRpYyByZWFkb25seSBUQUIgPSBuZXcgQ3ljbGVUaHJvdWdoU3VnZ2VzdGlvbnNLZXlzKFxuICAgIFwiVGFiLCBTaGlmdCtUYWJcIixcbiAgICB7IG1vZGlmaWVyczogW10sIGtleTogXCJUYWJcIiB9LFxuICAgIHsgbW9kaWZpZXJzOiBbXCJTaGlmdFwiXSwga2V5OiBcIlRhYlwiIH1cbiAgKTtcbiAgc3RhdGljIHJlYWRvbmx5IEVNQUNTID0gbmV3IEN5Y2xlVGhyb3VnaFN1Z2dlc3Rpb25zS2V5cyhcbiAgICBcIkN0cmwvQ21kK04sIEN0cmwvQ21kK1BcIixcbiAgICB7IG1vZGlmaWVyczogW1wiTW9kXCJdLCBrZXk6IFwiTlwiIH0sXG4gICAgeyBtb2RpZmllcnM6IFtcIk1vZFwiXSwga2V5OiBcIlBcIiB9XG4gICk7XG4gIHN0YXRpYyByZWFkb25seSBWSU0gPSBuZXcgQ3ljbGVUaHJvdWdoU3VnZ2VzdGlvbnNLZXlzKFxuICAgIFwiQ3RybC9DbWQrSiwgQ3RybC9DbWQrS1wiLFxuICAgIHsgbW9kaWZpZXJzOiBbXCJNb2RcIl0sIGtleTogXCJKXCIgfSxcbiAgICB7IG1vZGlmaWVyczogW1wiTW9kXCJdLCBrZXk6IFwiS1wiIH1cbiAgKTtcblxuICBwcml2YXRlIGNvbnN0cnVjdG9yKFxuICAgIHJlYWRvbmx5IG5hbWU6IE5hbWUsXG4gICAgcmVhZG9ubHkgbmV4dEtleTogS2V5QmluZCxcbiAgICByZWFkb25seSBwcmV2aW91c0tleTogS2V5QmluZFxuICApIHtcbiAgICBDeWNsZVRocm91Z2hTdWdnZXN0aW9uc0tleXMuX3ZhbHVlcy5wdXNoKHRoaXMpO1xuICB9XG5cbiAgc3RhdGljIGZyb21OYW1lKG5hbWU6IHN0cmluZyk6IEN5Y2xlVGhyb3VnaFN1Z2dlc3Rpb25zS2V5cyB7XG4gICAgcmV0dXJuIEN5Y2xlVGhyb3VnaFN1Z2dlc3Rpb25zS2V5cy5fdmFsdWVzLmZpbmQoKHgpID0+IHgubmFtZSA9PT0gbmFtZSkhO1xuICB9XG5cbiAgc3RhdGljIHZhbHVlcygpOiBDeWNsZVRocm91Z2hTdWdnZXN0aW9uc0tleXNbXSB7XG4gICAgcmV0dXJuIEN5Y2xlVGhyb3VnaFN1Z2dlc3Rpb25zS2V5cy5fdmFsdWVzO1xuICB9XG59XG4iLCJ0eXBlIERlbGltaXRlciA9IFwiXFx0XCIgfCBcIixcIiB8IFwifFwiO1xuXG5leHBvcnQgY2xhc3MgQ29sdW1uRGVsaW1pdGVyIHtcbiAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgX3ZhbHVlczogQ29sdW1uRGVsaW1pdGVyW10gPSBbXTtcblxuICBzdGF0aWMgcmVhZG9ubHkgVEFCID0gbmV3IENvbHVtbkRlbGltaXRlcihcIlRhYlwiLCBcIlxcdFwiKTtcbiAgc3RhdGljIHJlYWRvbmx5IENPTU1BID0gbmV3IENvbHVtbkRlbGltaXRlcihcIkNvbW1hXCIsIFwiLFwiKTtcbiAgc3RhdGljIHJlYWRvbmx5IFBJUEUgPSBuZXcgQ29sdW1uRGVsaW1pdGVyKFwiUGlwZVwiLCBcInxcIik7XG5cbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcihyZWFkb25seSBuYW1lOiBzdHJpbmcsIHJlYWRvbmx5IHZhbHVlOiBEZWxpbWl0ZXIpIHtcbiAgICBDb2x1bW5EZWxpbWl0ZXIuX3ZhbHVlcy5wdXNoKHRoaXMpO1xuICB9XG5cbiAgc3RhdGljIGZyb21OYW1lKG5hbWU6IHN0cmluZyk6IENvbHVtbkRlbGltaXRlciB7XG4gICAgcmV0dXJuIENvbHVtbkRlbGltaXRlci5fdmFsdWVzLmZpbmQoKHgpID0+IHgubmFtZSA9PT0gbmFtZSkhO1xuICB9XG5cbiAgc3RhdGljIHZhbHVlcygpOiBDb2x1bW5EZWxpbWl0ZXJbXSB7XG4gICAgcmV0dXJuIENvbHVtbkRlbGltaXRlci5fdmFsdWVzO1xuICB9XG59XG4iLCJpbXBvcnQgeyBNb2RpZmllciB9IGZyb20gXCJvYnNpZGlhblwiO1xuXG50eXBlIE5hbWUgPSBcIkVudGVyXCIgfCBcIlRhYlwiIHwgXCJDdHJsL0NtZCtFbnRlclwiIHwgXCJBbHQrRW50ZXJcIiB8IFwiU2hpZnQrRW50ZXJcIjtcbmludGVyZmFjZSBLZXlCaW5kIHtcbiAgbW9kaWZpZXJzOiBNb2RpZmllcltdO1xuICBrZXk6IHN0cmluZyB8IG51bGw7XG59XG5cbmV4cG9ydCBjbGFzcyBTZWxlY3RTdWdnZXN0aW9uS2V5IHtcbiAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgX3ZhbHVlczogU2VsZWN0U3VnZ2VzdGlvbktleVtdID0gW107XG5cbiAgc3RhdGljIHJlYWRvbmx5IEVOVEVSID0gbmV3IFNlbGVjdFN1Z2dlc3Rpb25LZXkoXCJFbnRlclwiLCB7XG4gICAgbW9kaWZpZXJzOiBbXSxcbiAgICBrZXk6IFwiRW50ZXJcIixcbiAgfSk7XG4gIHN0YXRpYyByZWFkb25seSBUQUIgPSBuZXcgU2VsZWN0U3VnZ2VzdGlvbktleShcIlRhYlwiLCB7XG4gICAgbW9kaWZpZXJzOiBbXSxcbiAgICBrZXk6IFwiVGFiXCIsXG4gIH0pO1xuICBzdGF0aWMgcmVhZG9ubHkgTU9EX0VOVEVSID0gbmV3IFNlbGVjdFN1Z2dlc3Rpb25LZXkoXCJDdHJsL0NtZCtFbnRlclwiLCB7XG4gICAgbW9kaWZpZXJzOiBbXCJNb2RcIl0sXG4gICAga2V5OiBcIkVudGVyXCIsXG4gIH0pO1xuICBzdGF0aWMgcmVhZG9ubHkgQUxUX0VOVEVSID0gbmV3IFNlbGVjdFN1Z2dlc3Rpb25LZXkoXCJBbHQrRW50ZXJcIiwge1xuICAgIG1vZGlmaWVyczogW1wiQWx0XCJdLFxuICAgIGtleTogXCJFbnRlclwiLFxuICB9KTtcbiAgc3RhdGljIHJlYWRvbmx5IFNISUZUX0VOVEVSID0gbmV3IFNlbGVjdFN1Z2dlc3Rpb25LZXkoXCJTaGlmdCtFbnRlclwiLCB7XG4gICAgbW9kaWZpZXJzOiBbXCJTaGlmdFwiXSxcbiAgICBrZXk6IFwiRW50ZXJcIixcbiAgfSk7XG5cbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcihyZWFkb25seSBuYW1lOiBOYW1lLCByZWFkb25seSBrZXlCaW5kOiBLZXlCaW5kKSB7XG4gICAgU2VsZWN0U3VnZ2VzdGlvbktleS5fdmFsdWVzLnB1c2godGhpcyk7XG4gIH1cblxuICBzdGF0aWMgZnJvbU5hbWUobmFtZTogc3RyaW5nKTogU2VsZWN0U3VnZ2VzdGlvbktleSB7XG4gICAgcmV0dXJuIFNlbGVjdFN1Z2dlc3Rpb25LZXkuX3ZhbHVlcy5maW5kKCh4KSA9PiB4Lm5hbWUgPT09IG5hbWUpITtcbiAgfVxuXG4gIHN0YXRpYyB2YWx1ZXMoKTogU2VsZWN0U3VnZ2VzdGlvbktleVtdIHtcbiAgICByZXR1cm4gU2VsZWN0U3VnZ2VzdGlvbktleS5fdmFsdWVzO1xuICB9XG59XG4iLCJpbXBvcnQgeyBBcHAgfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB7IGdyb3VwQnkgfSBmcm9tIFwiLi4vdXRpbC9jb2xsZWN0aW9uLWhlbHBlclwiO1xuaW1wb3J0IHsgV29yZHNCeUZpcnN0TGV0dGVyIH0gZnJvbSBcIi4vc3VnZ2VzdGVyXCI7XG5pbXBvcnQgeyBUb2tlbml6ZXIgfSBmcm9tIFwiLi4vdG9rZW5pemVyL3Rva2VuaXplclwiO1xuaW1wb3J0IHsgQXBwSGVscGVyIH0gZnJvbSBcIi4uL2FwcC1oZWxwZXJcIjtcbmltcG9ydCB7IFdvcmQgfSBmcm9tIFwiLi4vbW9kZWwvV29yZFwiO1xuaW1wb3J0IHsgZGlybmFtZSB9IGZyb20gXCIuLi91dGlsL3BhdGhcIjtcblxuZXhwb3J0IGNsYXNzIEN1cnJlbnRWYXVsdFdvcmRQcm92aWRlciB7XG4gIHdvcmRzQnlGaXJzdExldHRlcjogV29yZHNCeUZpcnN0TGV0dGVyID0ge307XG4gIHByaXZhdGUgd29yZHM6IFdvcmRbXSA9IFtdO1xuICBwcml2YXRlIHRva2VuaXplcjogVG9rZW5pemVyO1xuICBwcml2YXRlIGluY2x1ZGVQcmVmaXhQYXR0ZXJuczogc3RyaW5nW107XG4gIHByaXZhdGUgZXhjbHVkZVByZWZpeFBhdHRlcm5zOiBzdHJpbmdbXTtcbiAgcHJpdmF0ZSBvbmx5VW5kZXJDdXJyZW50RGlyZWN0b3J5OiBib29sZWFuO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgYXBwOiBBcHAsIHByaXZhdGUgYXBwSGVscGVyOiBBcHBIZWxwZXIpIHt9XG5cbiAgYXN5bmMgcmVmcmVzaFdvcmRzKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHRoaXMuY2xlYXJXb3JkcygpO1xuXG4gICAgY29uc3QgY3VycmVudERpcm5hbWUgPSB0aGlzLmFwcEhlbHBlci5nZXRDdXJyZW50RGlybmFtZSgpO1xuXG4gICAgY29uc3QgbWFya2Rvd25GaWxlUGF0aHMgPSB0aGlzLmFwcC52YXVsdFxuICAgICAgLmdldE1hcmtkb3duRmlsZXMoKVxuICAgICAgLm1hcCgoeCkgPT4geC5wYXRoKVxuICAgICAgLmZpbHRlcigocCkgPT4gdGhpcy5pbmNsdWRlUHJlZml4UGF0dGVybnMuZXZlcnkoKHgpID0+IHAuc3RhcnRzV2l0aCh4KSkpXG4gICAgICAuZmlsdGVyKChwKSA9PiB0aGlzLmV4Y2x1ZGVQcmVmaXhQYXR0ZXJucy5ldmVyeSgoeCkgPT4gIXAuc3RhcnRzV2l0aCh4KSkpXG4gICAgICAuZmlsdGVyKFxuICAgICAgICAocCkgPT4gIXRoaXMub25seVVuZGVyQ3VycmVudERpcmVjdG9yeSB8fCBkaXJuYW1lKHApID09PSBjdXJyZW50RGlybmFtZVxuICAgICAgKTtcblxuICAgIGxldCB3b3JkQnlWYWx1ZTogeyBbdmFsdWU6IHN0cmluZ106IFdvcmQgfSA9IHt9O1xuICAgIGZvciAoY29uc3QgcGF0aCBvZiBtYXJrZG93bkZpbGVQYXRocykge1xuICAgICAgY29uc3QgY29udGVudCA9IGF3YWl0IHRoaXMuYXBwLnZhdWx0LmFkYXB0ZXIucmVhZChwYXRoKTtcblxuICAgICAgZm9yIChjb25zdCB0b2tlbiBvZiB0aGlzLnRva2VuaXplci50b2tlbml6ZShjb250ZW50KSkge1xuICAgICAgICB3b3JkQnlWYWx1ZVt0b2tlbl0gPSB7XG4gICAgICAgICAgdmFsdWU6IHRva2VuLFxuICAgICAgICAgIHR5cGU6IFwiY3VycmVudFZhdWx0XCIsXG4gICAgICAgICAgY3JlYXRlZFBhdGg6IHBhdGgsXG4gICAgICAgICAgZGVzY3JpcHRpb246IHBhdGgsXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy53b3JkcyA9IE9iamVjdC52YWx1ZXMod29yZEJ5VmFsdWUpO1xuICAgIHRoaXMud29yZHNCeUZpcnN0TGV0dGVyID0gZ3JvdXBCeSh0aGlzLndvcmRzLCAoeCkgPT4geC52YWx1ZS5jaGFyQXQoMCkpO1xuICB9XG5cbiAgY2xlYXJXb3JkcygpOiB2b2lkIHtcbiAgICB0aGlzLndvcmRzID0gW107XG4gICAgdGhpcy53b3Jkc0J5Rmlyc3RMZXR0ZXIgPSB7fTtcbiAgfVxuXG4gIGdldCB3b3JkQ291bnQoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy53b3Jkcy5sZW5ndGg7XG4gIH1cblxuICBzZXRTZXR0aW5ncyhcbiAgICB0b2tlbml6ZXI6IFRva2VuaXplcixcbiAgICBpbmNsdWRlUHJlZml4UGF0dGVybnM6IHN0cmluZ1tdLFxuICAgIGV4Y2x1ZGVQcmVmaXhQYXR0ZXJuczogc3RyaW5nW10sXG4gICAgb25seVVuZGVyQ3VycmVudERpcmVjdG9yeTogYm9vbGVhblxuICApIHtcbiAgICB0aGlzLnRva2VuaXplciA9IHRva2VuaXplcjtcbiAgICB0aGlzLmluY2x1ZGVQcmVmaXhQYXR0ZXJucyA9IGluY2x1ZGVQcmVmaXhQYXR0ZXJucztcbiAgICB0aGlzLmV4Y2x1ZGVQcmVmaXhQYXR0ZXJucyA9IGV4Y2x1ZGVQcmVmaXhQYXR0ZXJucztcbiAgICB0aGlzLm9ubHlVbmRlckN1cnJlbnREaXJlY3RvcnkgPSBvbmx5VW5kZXJDdXJyZW50RGlyZWN0b3J5O1xuICB9XG59XG4iLCJpbXBvcnQgeyBNb2RpZmllciB9IGZyb20gXCJvYnNpZGlhblwiO1xuXG50eXBlIE5hbWUgPSBcIk5vbmVcIiB8IFwiQ3RybC9DbWQrRW50ZXJcIiB8IFwiQWx0K0VudGVyXCIgfCBcIlNoaWZ0K0VudGVyXCI7XG5pbnRlcmZhY2UgS2V5QmluZCB7XG4gIG1vZGlmaWVyczogTW9kaWZpZXJbXTtcbiAga2V5OiBzdHJpbmcgfCBudWxsO1xufVxuXG5leHBvcnQgY2xhc3MgT3BlblNvdXJjZUZpbGVLZXlzIHtcbiAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgX3ZhbHVlczogT3BlblNvdXJjZUZpbGVLZXlzW10gPSBbXTtcblxuICBzdGF0aWMgcmVhZG9ubHkgTk9ORSA9IG5ldyBPcGVuU291cmNlRmlsZUtleXMoXCJOb25lXCIsIHtcbiAgICBtb2RpZmllcnM6IFtdLFxuICAgIGtleTogbnVsbCxcbiAgfSk7XG4gIHN0YXRpYyByZWFkb25seSBNT0RfRU5URVIgPSBuZXcgT3BlblNvdXJjZUZpbGVLZXlzKFwiQ3RybC9DbWQrRW50ZXJcIiwge1xuICAgIG1vZGlmaWVyczogW1wiTW9kXCJdLFxuICAgIGtleTogXCJFbnRlclwiLFxuICB9KTtcbiAgc3RhdGljIHJlYWRvbmx5IEFMVF9FTlRFUiA9IG5ldyBPcGVuU291cmNlRmlsZUtleXMoXCJBbHQrRW50ZXJcIiwge1xuICAgIG1vZGlmaWVyczogW1wiQWx0XCJdLFxuICAgIGtleTogXCJFbnRlclwiLFxuICB9KTtcbiAgc3RhdGljIHJlYWRvbmx5IFNISUZUX0VOVEVSID0gbmV3IE9wZW5Tb3VyY2VGaWxlS2V5cyhcIlNoaWZ0K0VudGVyXCIsIHtcbiAgICBtb2RpZmllcnM6IFtcIlNoaWZ0XCJdLFxuICAgIGtleTogXCJFbnRlclwiLFxuICB9KTtcblxuICBwcml2YXRlIGNvbnN0cnVjdG9yKHJlYWRvbmx5IG5hbWU6IE5hbWUsIHJlYWRvbmx5IGtleUJpbmQ6IEtleUJpbmQpIHtcbiAgICBPcGVuU291cmNlRmlsZUtleXMuX3ZhbHVlcy5wdXNoKHRoaXMpO1xuICB9XG5cbiAgc3RhdGljIGZyb21OYW1lKG5hbWU6IHN0cmluZyk6IE9wZW5Tb3VyY2VGaWxlS2V5cyB7XG4gICAgcmV0dXJuIE9wZW5Tb3VyY2VGaWxlS2V5cy5fdmFsdWVzLmZpbmQoKHgpID0+IHgubmFtZSA9PT0gbmFtZSkhO1xuICB9XG5cbiAgc3RhdGljIHZhbHVlcygpOiBPcGVuU291cmNlRmlsZUtleXNbXSB7XG4gICAgcmV0dXJuIE9wZW5Tb3VyY2VGaWxlS2V5cy5fdmFsdWVzO1xuICB9XG59XG4iLCJpbXBvcnQgeyBXb3JkIH0gZnJvbSBcIi4uL21vZGVsL1dvcmRcIjtcbmltcG9ydCB7IGJhc2VuYW1lIH0gZnJvbSBcIi4uL3V0aWwvcGF0aFwiO1xuXG5leHBvcnQgY2xhc3MgRGVzY3JpcHRpb25PblN1Z2dlc3Rpb24ge1xuICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBfdmFsdWVzOiBEZXNjcmlwdGlvbk9uU3VnZ2VzdGlvbltdID0gW107XG5cbiAgc3RhdGljIHJlYWRvbmx5IE5PTkUgPSBuZXcgRGVzY3JpcHRpb25PblN1Z2dlc3Rpb24oXCJOb25lXCIsICgpID0+IG51bGwpO1xuICBzdGF0aWMgcmVhZG9ubHkgU0hPUlQgPSBuZXcgRGVzY3JpcHRpb25PblN1Z2dlc3Rpb24oXCJTaG9ydFwiLCAod29yZCkgPT4ge1xuICAgIGlmICghd29yZC5kZXNjcmlwdGlvbikge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiB3b3JkLnR5cGUgPT09IFwiY3VzdG9tRGljdGlvbmFyeVwiXG4gICAgICA/IHdvcmQuZGVzY3JpcHRpb25cbiAgICAgIDogYmFzZW5hbWUod29yZC5kZXNjcmlwdGlvbik7XG4gIH0pO1xuICBzdGF0aWMgcmVhZG9ubHkgRlVMTCA9IG5ldyBEZXNjcmlwdGlvbk9uU3VnZ2VzdGlvbihcbiAgICBcIkZ1bGxcIixcbiAgICAod29yZCkgPT4gd29yZC5kZXNjcmlwdGlvbiA/PyBudWxsXG4gICk7XG5cbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcihcbiAgICByZWFkb25seSBuYW1lOiBzdHJpbmcsXG4gICAgcmVhZG9ubHkgdG9EaXNwbGF5OiAod29yZDogV29yZCkgPT4gc3RyaW5nIHwgbnVsbFxuICApIHtcbiAgICBEZXNjcmlwdGlvbk9uU3VnZ2VzdGlvbi5fdmFsdWVzLnB1c2godGhpcyk7XG4gIH1cblxuICBzdGF0aWMgZnJvbU5hbWUobmFtZTogc3RyaW5nKTogRGVzY3JpcHRpb25PblN1Z2dlc3Rpb24ge1xuICAgIHJldHVybiBEZXNjcmlwdGlvbk9uU3VnZ2VzdGlvbi5fdmFsdWVzLmZpbmQoKHgpID0+IHgubmFtZSA9PT0gbmFtZSkhO1xuICB9XG5cbiAgc3RhdGljIHZhbHVlcygpOiBEZXNjcmlwdGlvbk9uU3VnZ2VzdGlvbltdIHtcbiAgICByZXR1cm4gRGVzY3JpcHRpb25PblN1Z2dlc3Rpb24uX3ZhbHVlcztcbiAgfVxufVxuIiwiaW1wb3J0IHsgQXBwLCBURmlsZSB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHsgV29yZHNCeUZpcnN0TGV0dGVyIH0gZnJvbSBcIi4vc3VnZ2VzdGVyXCI7XG5pbXBvcnQgeyBBcHBIZWxwZXIsIEZyb250TWF0dGVyVmFsdWUgfSBmcm9tIFwiLi4vYXBwLWhlbHBlclwiO1xuaW1wb3J0IHsgRnJvbnRNYXR0ZXJXb3JkIH0gZnJvbSBcIi4uL21vZGVsL1dvcmRcIjtcbmltcG9ydCB7IGV4Y2x1ZGVFbW9qaSB9IGZyb20gXCIuLi91dGlsL3N0cmluZ3NcIjtcbmltcG9ydCB7IGdyb3VwQnksIHVuaXFXaXRoIH0gZnJvbSBcIi4uL3V0aWwvY29sbGVjdGlvbi1oZWxwZXJcIjtcblxuZnVuY3Rpb24gc3lub255bUFsaWFzZXMobmFtZTogc3RyaW5nKTogc3RyaW5nW10ge1xuICBjb25zdCBsZXNzRW1vamlWYWx1ZSA9IGV4Y2x1ZGVFbW9qaShuYW1lKTtcbiAgcmV0dXJuIG5hbWUgPT09IGxlc3NFbW9qaVZhbHVlID8gW10gOiBbbGVzc0Vtb2ppVmFsdWVdO1xufVxuXG5mdW5jdGlvbiBmcm9udE1hdHRlclRvV29yZHMoXG4gIGZpbGU6IFRGaWxlLFxuICBrZXk6IHN0cmluZyxcbiAgdmFsdWVzOiBGcm9udE1hdHRlclZhbHVlXG4pOiBGcm9udE1hdHRlcldvcmRbXSB7XG4gIHJldHVybiB2YWx1ZXMubWFwKCh4KSA9PiAoe1xuICAgIGtleSxcbiAgICB2YWx1ZTogeCxcbiAgICB0eXBlOiBcImZyb250TWF0dGVyXCIsXG4gICAgY3JlYXRlZFBhdGg6IGZpbGUucGF0aCxcbiAgICBhbGlhc2VzOiBzeW5vbnltQWxpYXNlcyh4KSxcbiAgfSkpO1xufVxuXG5leHBvcnQgY2xhc3MgRnJvbnRNYXR0ZXJXb3JkUHJvdmlkZXIge1xuICB3b3JkczogRnJvbnRNYXR0ZXJXb3JkW107XG4gIHdvcmRzQnlGaXJzdExldHRlckJ5S2V5OiB7IFtrZXk6IHN0cmluZ106IFdvcmRzQnlGaXJzdExldHRlciB9O1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgYXBwOiBBcHAsIHByaXZhdGUgYXBwSGVscGVyOiBBcHBIZWxwZXIpIHt9XG5cbiAgcmVmcmVzaFdvcmRzKCk6IHZvaWQge1xuICAgIHRoaXMuY2xlYXJXb3JkcygpO1xuXG4gICAgY29uc3QgYWN0aXZlRmlsZSA9IHRoaXMuYXBwSGVscGVyLmdldEFjdGl2ZUZpbGUoKTtcblxuICAgIGNvbnN0IHdvcmRzID0gdGhpcy5hcHAudmF1bHQuZ2V0TWFya2Rvd25GaWxlcygpLmZsYXRNYXAoKGYpID0+IHtcbiAgICAgIGNvbnN0IGZtID0gdGhpcy5hcHBIZWxwZXIuZ2V0RnJvbnRNYXR0ZXIoZik7XG4gICAgICBpZiAoIWZtIHx8IGFjdGl2ZUZpbGU/LnBhdGggPT09IGYucGF0aCkge1xuICAgICAgICByZXR1cm4gW107XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBPYmplY3QuZW50cmllcyhmbSlcbiAgICAgICAgLmZpbHRlcihcbiAgICAgICAgICAoW19rZXksIHZhbHVlXSkgPT5cbiAgICAgICAgICAgIHZhbHVlICE9IG51bGwgJiZcbiAgICAgICAgICAgICh0eXBlb2YgdmFsdWUgPT09IFwic3RyaW5nXCIgfHwgdHlwZW9mIHZhbHVlWzBdID09PSBcInN0cmluZ1wiKVxuICAgICAgICApXG4gICAgICAgIC5mbGF0TWFwKChba2V5LCB2YWx1ZV0pID0+IGZyb250TWF0dGVyVG9Xb3JkcyhmLCBrZXksIHZhbHVlKSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLndvcmRzID0gdW5pcVdpdGgoXG4gICAgICB3b3JkcyxcbiAgICAgIChhLCBiKSA9PiBhLmtleSA9PT0gYi5rZXkgJiYgYS52YWx1ZSA9PT0gYi52YWx1ZVxuICAgICk7XG5cbiAgICBjb25zdCB3b3Jkc0J5S2V5ID0gZ3JvdXBCeSh0aGlzLndvcmRzLCAoeCkgPT4geC5rZXkpO1xuICAgIHRoaXMud29yZHNCeUZpcnN0TGV0dGVyQnlLZXkgPSBPYmplY3QuZnJvbUVudHJpZXMoXG4gICAgICBPYmplY3QuZW50cmllcyh3b3Jkc0J5S2V5KS5tYXAoXG4gICAgICAgIChba2V5LCB3b3Jkc106IFtzdHJpbmcsIEZyb250TWF0dGVyV29yZFtdXSkgPT4gW1xuICAgICAgICAgIGtleSxcbiAgICAgICAgICBncm91cEJ5KHdvcmRzLCAodykgPT4gdy52YWx1ZS5jaGFyQXQoMCkpLFxuICAgICAgICBdXG4gICAgICApXG4gICAgKTtcbiAgfVxuXG4gIGNsZWFyV29yZHMoKTogdm9pZCB7XG4gICAgdGhpcy53b3JkcyA9IFtdO1xuICAgIHRoaXMud29yZHNCeUZpcnN0TGV0dGVyQnlLZXkgPSB7fTtcbiAgfVxuXG4gIGdldCB3b3JkQ291bnQoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy53b3Jkcy5sZW5ndGg7XG4gIH1cbn1cbiIsImltcG9ydCB7IEluZGV4ZWRXb3JkcyB9IGZyb20gXCIuLi91aS9BdXRvQ29tcGxldGVTdWdnZXN0XCI7XG5pbXBvcnQgeyBzdWdnZXN0V29yZHMsIHN1Z2dlc3RXb3Jkc0J5UGFydGlhbE1hdGNoIH0gZnJvbSBcIi4vc3VnZ2VzdGVyXCI7XG5pbXBvcnQgeyBXb3JkIH0gZnJvbSBcIi4uL21vZGVsL1dvcmRcIjtcblxudHlwZSBOYW1lID0gXCJpbmhlcml0XCIgfCBcInByZWZpeFwiIHwgXCJwYXJ0aWFsXCI7XG5cbnR5cGUgSGFuZGxlciA9IChcbiAgaW5kZXhlZFdvcmRzOiBJbmRleGVkV29yZHMsXG4gIHF1ZXJ5OiBzdHJpbmcsXG4gIG1heDogbnVtYmVyLFxuICBmcm9udE1hdHRlcjogc3RyaW5nIHwgbnVsbFxuKSA9PiBXb3JkW107XG5cbmNvbnN0IG5ldmVyVXNlZEhhbmRsZXIgPSAoLi4uYXJnczogYW55W10pID0+IFtdO1xuXG5leHBvcnQgY2xhc3MgU3BlY2lmaWNNYXRjaFN0cmF0ZWd5IHtcbiAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgX3ZhbHVlczogU3BlY2lmaWNNYXRjaFN0cmF0ZWd5W10gPSBbXTtcblxuICBzdGF0aWMgcmVhZG9ubHkgSU5IRVJJVCA9IG5ldyBTcGVjaWZpY01hdGNoU3RyYXRlZ3koXG4gICAgXCJpbmhlcml0XCIsXG4gICAgbmV2ZXJVc2VkSGFuZGxlclxuICApO1xuICBzdGF0aWMgcmVhZG9ubHkgUFJFRklYID0gbmV3IFNwZWNpZmljTWF0Y2hTdHJhdGVneShcInByZWZpeFwiLCBzdWdnZXN0V29yZHMpO1xuICBzdGF0aWMgcmVhZG9ubHkgUEFSVElBTCA9IG5ldyBTcGVjaWZpY01hdGNoU3RyYXRlZ3koXG4gICAgXCJwYXJ0aWFsXCIsXG4gICAgc3VnZ2VzdFdvcmRzQnlQYXJ0aWFsTWF0Y2hcbiAgKTtcblxuICBwcml2YXRlIGNvbnN0cnVjdG9yKHJlYWRvbmx5IG5hbWU6IE5hbWUsIHJlYWRvbmx5IGhhbmRsZXI6IEhhbmRsZXIpIHtcbiAgICBTcGVjaWZpY01hdGNoU3RyYXRlZ3kuX3ZhbHVlcy5wdXNoKHRoaXMpO1xuICB9XG5cbiAgc3RhdGljIGZyb21OYW1lKG5hbWU6IHN0cmluZyk6IFNwZWNpZmljTWF0Y2hTdHJhdGVneSB7XG4gICAgcmV0dXJuIFNwZWNpZmljTWF0Y2hTdHJhdGVneS5fdmFsdWVzLmZpbmQoKHgpID0+IHgubmFtZSA9PT0gbmFtZSkhO1xuICB9XG5cbiAgc3RhdGljIHZhbHVlcygpOiBTcGVjaWZpY01hdGNoU3RyYXRlZ3lbXSB7XG4gICAgcmV0dXJuIFNwZWNpZmljTWF0Y2hTdHJhdGVneS5fdmFsdWVzO1xuICB9XG59XG4iLCJpbXBvcnQge1xuICBBcHAsXG4gIGRlYm91bmNlLFxuICBEZWJvdW5jZXIsXG4gIEVkaXRvcixcbiAgRWRpdG9yUG9zaXRpb24sXG4gIEVkaXRvclN1Z2dlc3QsXG4gIEVkaXRvclN1Z2dlc3RDb250ZXh0LFxuICBFZGl0b3JTdWdnZXN0VHJpZ2dlckluZm8sXG4gIEV2ZW50UmVmLFxuICBLZXltYXBFdmVudEhhbmRsZXIsXG4gIE5vdGljZSxcbiAgU2NvcGUsXG4gIFRGaWxlLFxufSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB7IGNyZWF0ZVRva2VuaXplciwgVG9rZW5pemVyIH0gZnJvbSBcIi4uL3Rva2VuaXplci90b2tlbml6ZXJcIjtcbmltcG9ydCB7IFRva2VuaXplU3RyYXRlZ3kgfSBmcm9tIFwiLi4vdG9rZW5pemVyL1Rva2VuaXplU3RyYXRlZ3lcIjtcbmltcG9ydCB7IFNldHRpbmdzIH0gZnJvbSBcIi4uL3NldHRpbmdzXCI7XG5pbXBvcnQgeyBBcHBIZWxwZXIgfSBmcm9tIFwiLi4vYXBwLWhlbHBlclwiO1xuaW1wb3J0IHsgV29yZHNCeUZpcnN0TGV0dGVyIH0gZnJvbSBcIi4uL3Byb3ZpZGVyL3N1Z2dlc3RlclwiO1xuaW1wb3J0IHsgQ3VzdG9tRGljdGlvbmFyeVdvcmRQcm92aWRlciB9IGZyb20gXCIuLi9wcm92aWRlci9DdXN0b21EaWN0aW9uYXJ5V29yZFByb3ZpZGVyXCI7XG5pbXBvcnQgeyBDdXJyZW50RmlsZVdvcmRQcm92aWRlciB9IGZyb20gXCIuLi9wcm92aWRlci9DdXJyZW50RmlsZVdvcmRQcm92aWRlclwiO1xuaW1wb3J0IHsgSW50ZXJuYWxMaW5rV29yZFByb3ZpZGVyIH0gZnJvbSBcIi4uL3Byb3ZpZGVyL0ludGVybmFsTGlua1dvcmRQcm92aWRlclwiO1xuaW1wb3J0IHsgTWF0Y2hTdHJhdGVneSB9IGZyb20gXCIuLi9wcm92aWRlci9NYXRjaFN0cmF0ZWd5XCI7XG5pbXBvcnQgeyBDeWNsZVRocm91Z2hTdWdnZXN0aW9uc0tleXMgfSBmcm9tIFwiLi4vb3B0aW9uL0N5Y2xlVGhyb3VnaFN1Z2dlc3Rpb25zS2V5c1wiO1xuaW1wb3J0IHsgQ29sdW1uRGVsaW1pdGVyIH0gZnJvbSBcIi4uL29wdGlvbi9Db2x1bW5EZWxpbWl0ZXJcIjtcbmltcG9ydCB7IFNlbGVjdFN1Z2dlc3Rpb25LZXkgfSBmcm9tIFwiLi4vb3B0aW9uL1NlbGVjdFN1Z2dlc3Rpb25LZXlcIjtcbmltcG9ydCB7IHVuaXFXaXRoIH0gZnJvbSBcIi4uL3V0aWwvY29sbGVjdGlvbi1oZWxwZXJcIjtcbmltcG9ydCB7IEN1cnJlbnRWYXVsdFdvcmRQcm92aWRlciB9IGZyb20gXCIuLi9wcm92aWRlci9DdXJyZW50VmF1bHRXb3JkUHJvdmlkZXJcIjtcbmltcG9ydCB7IFByb3ZpZGVyU3RhdHVzQmFyIH0gZnJvbSBcIi4vUHJvdmlkZXJTdGF0dXNCYXJcIjtcbmltcG9ydCB7IFdvcmQgfSBmcm9tIFwiLi4vbW9kZWwvV29yZFwiO1xuaW1wb3J0IHsgT3BlblNvdXJjZUZpbGVLZXlzIH0gZnJvbSBcIi4uL29wdGlvbi9PcGVuU291cmNlRmlsZUtleXNcIjtcbmltcG9ydCB7IERlc2NyaXB0aW9uT25TdWdnZXN0aW9uIH0gZnJvbSBcIi4uL29wdGlvbi9EZXNjcmlwdGlvbk9uU3VnZ2VzdGlvblwiO1xuaW1wb3J0IHsgRnJvbnRNYXR0ZXJXb3JkUHJvdmlkZXIgfSBmcm9tIFwiLi4vcHJvdmlkZXIvRnJvbnRNYXR0ZXJXb3JkUHJvdmlkZXJcIjtcbmltcG9ydCB7IFNwZWNpZmljTWF0Y2hTdHJhdGVneSB9IGZyb20gXCIuLi9wcm92aWRlci9TcGVjaWZpY01hdGNoU3RyYXRlZ3lcIjtcblxuZnVuY3Rpb24gYnVpbGRMb2dNZXNzYWdlKG1lc3NhZ2U6IHN0cmluZywgbXNlYzogbnVtYmVyKSB7XG4gIHJldHVybiBgJHttZXNzYWdlfTogJHtNYXRoLnJvdW5kKG1zZWMpfVttc11gO1xufVxuXG5leHBvcnQgdHlwZSBJbmRleGVkV29yZHMgPSB7XG4gIGN1cnJlbnRGaWxlOiBXb3Jkc0J5Rmlyc3RMZXR0ZXI7XG4gIGN1cnJlbnRWYXVsdDogV29yZHNCeUZpcnN0TGV0dGVyO1xuICBjdXN0b21EaWN0aW9uYXJ5OiBXb3Jkc0J5Rmlyc3RMZXR0ZXI7XG4gIGludGVybmFsTGluazogV29yZHNCeUZpcnN0TGV0dGVyO1xuICBmcm9udE1hdHRlcjogeyBba2V5OiBzdHJpbmddOiBXb3Jkc0J5Rmlyc3RMZXR0ZXIgfTtcbn07XG5cbi8vIFRoaXMgaXMgYW4gdW5zYWZlIGNvZGUuLiEhXG5pbnRlcmZhY2UgVW5zYWZlRWRpdG9yU3VnZ2VzdEludGVyZmFjZSB7XG4gIHNjb3BlOiBTY29wZSAmIHsga2V5czogKEtleW1hcEV2ZW50SGFuZGxlciAmIHsgZnVuYzogQ2FsbGFibGVGdW5jdGlvbiB9KVtdIH07XG4gIHN1Z2dlc3Rpb25zOiB7XG4gICAgc2VsZWN0ZWRJdGVtOiBudW1iZXI7XG4gICAgdXNlU2VsZWN0ZWRJdGVtKGV2OiBQYXJ0aWFsPEtleWJvYXJkRXZlbnQ+KTogdm9pZDtcbiAgICBzZXRTZWxlY3RlZEl0ZW0oc2VsZWN0ZWQ6IG51bWJlciwgc2Nyb2xsOiBib29sZWFuKTogdm9pZDtcbiAgICB2YWx1ZXM6IFdvcmRbXTtcbiAgfTtcbiAgaXNPcGVuOiBib29sZWFuO1xufVxuXG5leHBvcnQgY2xhc3MgQXV0b0NvbXBsZXRlU3VnZ2VzdFxuICBleHRlbmRzIEVkaXRvclN1Z2dlc3Q8V29yZD5cbiAgaW1wbGVtZW50cyBVbnNhZmVFZGl0b3JTdWdnZXN0SW50ZXJmYWNlXG57XG4gIGFwcDogQXBwO1xuICBzZXR0aW5nczogU2V0dGluZ3M7XG4gIGFwcEhlbHBlcjogQXBwSGVscGVyO1xuICBzdGF0dXNCYXI6IFByb3ZpZGVyU3RhdHVzQmFyO1xuXG4gIGN1cnJlbnRGaWxlV29yZFByb3ZpZGVyOiBDdXJyZW50RmlsZVdvcmRQcm92aWRlcjtcbiAgY3VycmVudFZhdWx0V29yZFByb3ZpZGVyOiBDdXJyZW50VmF1bHRXb3JkUHJvdmlkZXI7XG4gIGN1c3RvbURpY3Rpb25hcnlXb3JkUHJvdmlkZXI6IEN1c3RvbURpY3Rpb25hcnlXb3JkUHJvdmlkZXI7XG4gIGludGVybmFsTGlua1dvcmRQcm92aWRlcjogSW50ZXJuYWxMaW5rV29yZFByb3ZpZGVyO1xuICBmcm9udE1hdHRlcldvcmRQcm92aWRlcjogRnJvbnRNYXR0ZXJXb3JkUHJvdmlkZXI7XG5cbiAgdG9rZW5pemVyOiBUb2tlbml6ZXI7XG4gIGRlYm91bmNlR2V0U3VnZ2VzdGlvbnM6IERlYm91bmNlcjxcbiAgICBbRWRpdG9yU3VnZ2VzdENvbnRleHQsICh0b2tlbnM6IFdvcmRbXSkgPT4gdm9pZF1cbiAgPjtcbiAgZGVib3VuY2VDbG9zZTogRGVib3VuY2VyPFtdPjtcblxuICBydW5NYW51YWxseTogYm9vbGVhbjtcbiAgZGVjbGFyZSBpc09wZW46IGJvb2xlYW47XG5cbiAgY29udGV4dFN0YXJ0Q2g6IG51bWJlcjtcblxuICAvLyB1bnNhZmUhIVxuICBzY29wZTogVW5zYWZlRWRpdG9yU3VnZ2VzdEludGVyZmFjZVtcInNjb3BlXCJdO1xuICBzdWdnZXN0aW9uczogVW5zYWZlRWRpdG9yU3VnZ2VzdEludGVyZmFjZVtcInN1Z2dlc3Rpb25zXCJdO1xuXG4gIGtleW1hcEV2ZW50SGFuZGxlcjogS2V5bWFwRXZlbnRIYW5kbGVyW10gPSBbXTtcbiAgbW9kaWZ5RXZlbnRSZWY6IEV2ZW50UmVmO1xuICBhY3RpdmVMZWFmQ2hhbmdlUmVmOiBFdmVudFJlZjtcblxuICBwcml2YXRlIGNvbnN0cnVjdG9yKGFwcDogQXBwLCBzdGF0dXNCYXI6IFByb3ZpZGVyU3RhdHVzQmFyKSB7XG4gICAgc3VwZXIoYXBwKTtcbiAgICB0aGlzLmFwcEhlbHBlciA9IG5ldyBBcHBIZWxwZXIoYXBwKTtcbiAgICB0aGlzLnN0YXR1c0JhciA9IHN0YXR1c0JhcjtcbiAgfVxuXG4gIHRyaWdnZXJDb21wbGV0ZSgpIHtcbiAgICBjb25zdCBlZGl0b3IgPSB0aGlzLmFwcEhlbHBlci5nZXRDdXJyZW50RWRpdG9yKCk7XG4gICAgY29uc3QgYWN0aXZlRmlsZSA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk7XG4gICAgaWYgKCFlZGl0b3IgfHwgIWFjdGl2ZUZpbGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBYWFg6IFVuc2FmZVxuICAgIHRoaXMucnVuTWFudWFsbHkgPSB0cnVlO1xuICAgICh0aGlzIGFzIGFueSkudHJpZ2dlcihlZGl0b3IsIGFjdGl2ZUZpbGUsIHRydWUpO1xuICB9XG5cbiAgc3RhdGljIGFzeW5jIG5ldyhcbiAgICBhcHA6IEFwcCxcbiAgICBzZXR0aW5nczogU2V0dGluZ3MsXG4gICAgc3RhdHVzQmFyOiBQcm92aWRlclN0YXR1c0JhclxuICApOiBQcm9taXNlPEF1dG9Db21wbGV0ZVN1Z2dlc3Q+IHtcbiAgICBjb25zdCBpbnMgPSBuZXcgQXV0b0NvbXBsZXRlU3VnZ2VzdChhcHAsIHN0YXR1c0Jhcik7XG5cbiAgICBpbnMuY3VycmVudEZpbGVXb3JkUHJvdmlkZXIgPSBuZXcgQ3VycmVudEZpbGVXb3JkUHJvdmlkZXIoXG4gICAgICBpbnMuYXBwLFxuICAgICAgaW5zLmFwcEhlbHBlclxuICAgICk7XG4gICAgaW5zLmN1cnJlbnRWYXVsdFdvcmRQcm92aWRlciA9IG5ldyBDdXJyZW50VmF1bHRXb3JkUHJvdmlkZXIoXG4gICAgICBpbnMuYXBwLFxuICAgICAgaW5zLmFwcEhlbHBlclxuICAgICk7XG4gICAgaW5zLmN1c3RvbURpY3Rpb25hcnlXb3JkUHJvdmlkZXIgPSBuZXcgQ3VzdG9tRGljdGlvbmFyeVdvcmRQcm92aWRlcihcbiAgICAgIGlucy5hcHBcbiAgICApO1xuICAgIGlucy5pbnRlcm5hbExpbmtXb3JkUHJvdmlkZXIgPSBuZXcgSW50ZXJuYWxMaW5rV29yZFByb3ZpZGVyKFxuICAgICAgaW5zLmFwcCxcbiAgICAgIGlucy5hcHBIZWxwZXJcbiAgICApO1xuICAgIGlucy5mcm9udE1hdHRlcldvcmRQcm92aWRlciA9IG5ldyBGcm9udE1hdHRlcldvcmRQcm92aWRlcihcbiAgICAgIGlucy5hcHAsXG4gICAgICBpbnMuYXBwSGVscGVyXG4gICAgKTtcblxuICAgIGF3YWl0IGlucy51cGRhdGVTZXR0aW5ncyhzZXR0aW5ncyk7XG5cbiAgICBpbnMubW9kaWZ5RXZlbnRSZWYgPSBhcHAudmF1bHQub24oXCJtb2RpZnlcIiwgYXN5bmMgKF8pID0+IHtcbiAgICAgIGF3YWl0IGlucy5yZWZyZXNoQ3VycmVudEZpbGVUb2tlbnMoKTtcbiAgICB9KTtcbiAgICBpbnMuYWN0aXZlTGVhZkNoYW5nZVJlZiA9IGFwcC53b3Jrc3BhY2Uub24oXG4gICAgICBcImFjdGl2ZS1sZWFmLWNoYW5nZVwiLFxuICAgICAgYXN5bmMgKF8pID0+IHtcbiAgICAgICAgYXdhaXQgaW5zLnJlZnJlc2hDdXJyZW50RmlsZVRva2VucygpO1xuICAgICAgICBpbnMucmVmcmVzaEludGVybmFsTGlua1Rva2VucygpO1xuICAgICAgICBpbnMucmVmcmVzaEZyb250TWF0dGVyVG9rZW5zKCk7XG4gICAgICB9XG4gICAgKTtcbiAgICAvLyBBdm9pZCByZWZlcnJpbmcgdG8gaW5jb3JyZWN0IGNhY2hlXG4gICAgY29uc3QgY2FjaGVSZXNvbHZlZFJlZiA9IGFwcC5tZXRhZGF0YUNhY2hlLm9uKFwicmVzb2x2ZWRcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgaW5zLnJlZnJlc2hJbnRlcm5hbExpbmtUb2tlbnMoKTtcbiAgICAgIGlucy5yZWZyZXNoRnJvbnRNYXR0ZXJUb2tlbnMoKTtcbiAgICAgIC8vIG5vaW5zcGVjdGlvbiBFUzZNaXNzaW5nQXdhaXRcbiAgICAgIGlucy5yZWZyZXNoQ3VzdG9tRGljdGlvbmFyeVRva2VucygpO1xuICAgICAgLy8gbm9pbnNwZWN0aW9uIEVTNk1pc3NpbmdBd2FpdFxuICAgICAgaW5zLnJlZnJlc2hDdXJyZW50VmF1bHRUb2tlbnMoKTtcblxuICAgICAgaW5zLmFwcC5tZXRhZGF0YUNhY2hlLm9mZnJlZihjYWNoZVJlc29sdmVkUmVmKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBpbnM7XG4gIH1cblxuICBwcmVkaWN0YWJsZUNvbXBsZXRlKCkge1xuICAgIGNvbnN0IGVkaXRvciA9IHRoaXMuYXBwSGVscGVyLmdldEN1cnJlbnRFZGl0b3IoKTtcbiAgICBpZiAoIWVkaXRvcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGN1cnNvciA9IGVkaXRvci5nZXRDdXJzb3IoKTtcbiAgICBjb25zdCBjdXJyZW50VG9rZW4gPSB0aGlzLnRva2VuaXplclxuICAgICAgLnRva2VuaXplKGVkaXRvci5nZXRMaW5lKGN1cnNvci5saW5lKS5zbGljZSgwLCBjdXJzb3IuY2gpKVxuICAgICAgLmxhc3QoKTtcbiAgICBpZiAoIWN1cnJlbnRUb2tlbikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBzdWdnZXN0aW9uID0gdGhpcy50b2tlbml6ZXJcbiAgICAgIC50b2tlbml6ZShcbiAgICAgICAgZWRpdG9yLmdldFJhbmdlKHsgbGluZTogTWF0aC5tYXgoY3Vyc29yLmxpbmUgLSA1MCwgMCksIGNoOiAwIH0sIGN1cnNvcilcbiAgICAgIClcbiAgICAgIC5yZXZlcnNlKClcbiAgICAgIC5zbGljZSgxKVxuICAgICAgLmZpbmQoKHgpID0+IHguc3RhcnRzV2l0aChjdXJyZW50VG9rZW4pKTtcbiAgICBpZiAoIXN1Z2dlc3Rpb24pIHtcbiAgICAgIHN1Z2dlc3Rpb24gPSB0aGlzLnRva2VuaXplclxuICAgICAgICAudG9rZW5pemUoXG4gICAgICAgICAgZWRpdG9yLmdldFJhbmdlKGN1cnNvciwge1xuICAgICAgICAgICAgbGluZTogTWF0aC5taW4oY3Vyc29yLmxpbmUgKyA1MCwgZWRpdG9yLmxpbmVDb3VudCgpIC0gMSksXG4gICAgICAgICAgICBjaDogMCxcbiAgICAgICAgICB9KVxuICAgICAgICApXG4gICAgICAgIC5maW5kKCh4KSA9PiB4LnN0YXJ0c1dpdGgoY3VycmVudFRva2VuKSk7XG4gICAgfVxuICAgIGlmICghc3VnZ2VzdGlvbikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGVkaXRvci5yZXBsYWNlUmFuZ2UoXG4gICAgICBzdWdnZXN0aW9uLFxuICAgICAgeyBsaW5lOiBjdXJzb3IubGluZSwgY2g6IGN1cnNvci5jaCAtIGN1cnJlbnRUb2tlbi5sZW5ndGggfSxcbiAgICAgIHsgbGluZTogY3Vyc29yLmxpbmUsIGNoOiBjdXJzb3IuY2ggfVxuICAgICk7XG5cbiAgICB0aGlzLmNsb3NlKCk7XG4gICAgdGhpcy5kZWJvdW5jZUNsb3NlKCk7XG4gIH1cblxuICB1bnJlZ2lzdGVyKCkge1xuICAgIHRoaXMuYXBwLnZhdWx0Lm9mZnJlZih0aGlzLm1vZGlmeUV2ZW50UmVmKTtcbiAgICB0aGlzLmFwcC53b3Jrc3BhY2Uub2ZmcmVmKHRoaXMuYWN0aXZlTGVhZkNoYW5nZVJlZik7XG4gIH1cblxuICAvLyBzZXR0aW5ncyBnZXR0ZXJzXG4gIGdldCB0b2tlbml6ZXJTdHJhdGVneSgpOiBUb2tlbml6ZVN0cmF0ZWd5IHtcbiAgICByZXR1cm4gVG9rZW5pemVTdHJhdGVneS5mcm9tTmFtZSh0aGlzLnNldHRpbmdzLnN0cmF0ZWd5KTtcbiAgfVxuXG4gIGdldCBtYXRjaFN0cmF0ZWd5KCk6IE1hdGNoU3RyYXRlZ3kge1xuICAgIHJldHVybiBNYXRjaFN0cmF0ZWd5LmZyb21OYW1lKHRoaXMuc2V0dGluZ3MubWF0Y2hTdHJhdGVneSk7XG4gIH1cblxuICBnZXQgZnJvbnRNYXR0ZXJDb21wbGVtZW50U3RyYXRlZ3koKTogU3BlY2lmaWNNYXRjaFN0cmF0ZWd5IHtcbiAgICByZXR1cm4gU3BlY2lmaWNNYXRjaFN0cmF0ZWd5LmZyb21OYW1lKFxuICAgICAgdGhpcy5zZXR0aW5ncy5mcm9udE1hdHRlckNvbXBsZW1lbnRNYXRjaFN0cmF0ZWd5XG4gICAgKTtcbiAgfVxuXG4gIGdldCBtaW5OdW1iZXJUcmlnZ2VyZWQoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gKFxuICAgICAgdGhpcy5zZXR0aW5ncy5taW5OdW1iZXJPZkNoYXJhY3RlcnNUcmlnZ2VyZWQgfHxcbiAgICAgIHRoaXMudG9rZW5pemVyU3RyYXRlZ3kudHJpZ2dlclRocmVzaG9sZFxuICAgICk7XG4gIH1cblxuICBnZXQgZGVzY3JpcHRpb25PblN1Z2dlc3Rpb24oKTogRGVzY3JpcHRpb25PblN1Z2dlc3Rpb24ge1xuICAgIHJldHVybiBEZXNjcmlwdGlvbk9uU3VnZ2VzdGlvbi5mcm9tTmFtZShcbiAgICAgIHRoaXMuc2V0dGluZ3MuZGVzY3JpcHRpb25PblN1Z2dlc3Rpb25cbiAgICApO1xuICB9XG5cbiAgLy8gLS0tIGVuZCAtLS1cblxuICBnZXQgaW5kZXhlZFdvcmRzKCk6IEluZGV4ZWRXb3JkcyB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGN1cnJlbnRGaWxlOiB0aGlzLmN1cnJlbnRGaWxlV29yZFByb3ZpZGVyLndvcmRzQnlGaXJzdExldHRlcixcbiAgICAgIGN1cnJlbnRWYXVsdDogdGhpcy5jdXJyZW50VmF1bHRXb3JkUHJvdmlkZXIud29yZHNCeUZpcnN0TGV0dGVyLFxuICAgICAgY3VzdG9tRGljdGlvbmFyeTogdGhpcy5jdXN0b21EaWN0aW9uYXJ5V29yZFByb3ZpZGVyLndvcmRzQnlGaXJzdExldHRlcixcbiAgICAgIGludGVybmFsTGluazogdGhpcy5pbnRlcm5hbExpbmtXb3JkUHJvdmlkZXIud29yZHNCeUZpcnN0TGV0dGVyLFxuICAgICAgZnJvbnRNYXR0ZXI6IHRoaXMuZnJvbnRNYXR0ZXJXb3JkUHJvdmlkZXIud29yZHNCeUZpcnN0TGV0dGVyQnlLZXksXG4gICAgfTtcbiAgfVxuXG4gIGFzeW5jIHVwZGF0ZVNldHRpbmdzKHNldHRpbmdzOiBTZXR0aW5ncykge1xuICAgIHRoaXMuc2V0dGluZ3MgPSBzZXR0aW5ncztcblxuICAgIHRoaXMuc3RhdHVzQmFyLnNldE1hdGNoU3RyYXRlZ3kodGhpcy5tYXRjaFN0cmF0ZWd5KTtcblxuICAgIHRoaXMudG9rZW5pemVyID0gY3JlYXRlVG9rZW5pemVyKHRoaXMudG9rZW5pemVyU3RyYXRlZ3kpO1xuICAgIHRoaXMuY3VycmVudEZpbGVXb3JkUHJvdmlkZXIuc2V0U2V0dGluZ3ModGhpcy50b2tlbml6ZXIpO1xuICAgIHRoaXMuY3VycmVudFZhdWx0V29yZFByb3ZpZGVyLnNldFNldHRpbmdzKFxuICAgICAgdGhpcy50b2tlbml6ZXIsXG4gICAgICBzZXR0aW5ncy5pbmNsdWRlQ3VycmVudFZhdWx0UGF0aFByZWZpeFBhdHRlcm5zXG4gICAgICAgIC5zcGxpdChcIlxcblwiKVxuICAgICAgICAuZmlsdGVyKCh4KSA9PiB4KSxcbiAgICAgIHNldHRpbmdzLmV4Y2x1ZGVDdXJyZW50VmF1bHRQYXRoUHJlZml4UGF0dGVybnNcbiAgICAgICAgLnNwbGl0KFwiXFxuXCIpXG4gICAgICAgIC5maWx0ZXIoKHgpID0+IHgpLFxuICAgICAgc2V0dGluZ3MuaW5jbHVkZUN1cnJlbnRWYXVsdE9ubHlGaWxlc1VuZGVyQ3VycmVudERpcmVjdG9yeVxuICAgICk7XG4gICAgdGhpcy5jdXN0b21EaWN0aW9uYXJ5V29yZFByb3ZpZGVyLnNldFNldHRpbmdzKFxuICAgICAgc2V0dGluZ3MuY3VzdG9tRGljdGlvbmFyeVBhdGhzLnNwbGl0KFwiXFxuXCIpLmZpbHRlcigoeCkgPT4geCksXG4gICAgICBDb2x1bW5EZWxpbWl0ZXIuZnJvbU5hbWUoc2V0dGluZ3MuY29sdW1uRGVsaW1pdGVyKVxuICAgICk7XG5cbiAgICB0aGlzLmRlYm91bmNlR2V0U3VnZ2VzdGlvbnMgPSBkZWJvdW5jZShcbiAgICAgIChjb250ZXh0OiBFZGl0b3JTdWdnZXN0Q29udGV4dCwgY2I6ICh3b3JkczogV29yZFtdKSA9PiB2b2lkKSA9PiB7XG4gICAgICAgIGNvbnN0IHN0YXJ0ID0gcGVyZm9ybWFuY2Uubm93KCk7XG5cbiAgICAgICAgdGhpcy5zaG93RGVidWdMb2coKCkgPT4gYFtjb250ZXh0LnF1ZXJ5XTogJHtjb250ZXh0LnF1ZXJ5fWApO1xuICAgICAgICBjb25zdCBwYXJzZWRRdWVyeSA9IEpTT04ucGFyc2UoY29udGV4dC5xdWVyeSkgYXMge1xuICAgICAgICAgIGN1cnJlbnRGcm9udE1hdHRlcjogc3RyaW5nIHwgbnVsbDtcbiAgICAgICAgICBxdWVyaWVzOiB7XG4gICAgICAgICAgICB3b3JkOiBzdHJpbmc7XG4gICAgICAgICAgICBvZmZzZXQ6IG51bWJlcjtcbiAgICAgICAgICB9W107XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3Qgd29yZHMgPSBwYXJzZWRRdWVyeS5xdWVyaWVzXG4gICAgICAgICAgLmZpbHRlcihcbiAgICAgICAgICAgICh4LCBpLCB4cykgPT5cbiAgICAgICAgICAgICAgcGFyc2VkUXVlcnkuY3VycmVudEZyb250TWF0dGVyIHx8XG4gICAgICAgICAgICAgICh0aGlzLnNldHRpbmdzLm1pbk51bWJlck9mV29yZHNUcmlnZ2VyZWRQaHJhc2UgKyBpIC0gMSA8XG4gICAgICAgICAgICAgICAgeHMubGVuZ3RoICYmXG4gICAgICAgICAgICAgICAgeC53b3JkLmxlbmd0aCA+PSB0aGlzLm1pbk51bWJlclRyaWdnZXJlZCAmJlxuICAgICAgICAgICAgICAgICF0aGlzLnRva2VuaXplci5zaG91bGRJZ25vcmUoeC53b3JkKSAmJlxuICAgICAgICAgICAgICAgICF4LndvcmQuZW5kc1dpdGgoXCIgXCIpKVxuICAgICAgICAgIClcbiAgICAgICAgICAubWFwKChxKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBoYW5kbGVyID1cbiAgICAgICAgICAgICAgcGFyc2VkUXVlcnkuY3VycmVudEZyb250TWF0dGVyICYmXG4gICAgICAgICAgICAgIHRoaXMuZnJvbnRNYXR0ZXJDb21wbGVtZW50U3RyYXRlZ3kgIT09XG4gICAgICAgICAgICAgICAgU3BlY2lmaWNNYXRjaFN0cmF0ZWd5LklOSEVSSVRcbiAgICAgICAgICAgICAgICA/IHRoaXMuZnJvbnRNYXR0ZXJDb21wbGVtZW50U3RyYXRlZ3kuaGFuZGxlclxuICAgICAgICAgICAgICAgIDogdGhpcy5tYXRjaFN0cmF0ZWd5LmhhbmRsZXI7XG4gICAgICAgICAgICByZXR1cm4gaGFuZGxlcihcbiAgICAgICAgICAgICAgdGhpcy5pbmRleGVkV29yZHMsXG4gICAgICAgICAgICAgIHEud29yZCxcbiAgICAgICAgICAgICAgdGhpcy5zZXR0aW5ncy5tYXhOdW1iZXJPZlN1Z2dlc3Rpb25zLFxuICAgICAgICAgICAgICBwYXJzZWRRdWVyeS5jdXJyZW50RnJvbnRNYXR0ZXJcbiAgICAgICAgICAgICkubWFwKCh3b3JkKSA9PiAoeyAuLi53b3JkLCBvZmZzZXQ6IHEub2Zmc2V0IH0pKTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5mbGF0KCk7XG5cbiAgICAgICAgY2IoXG4gICAgICAgICAgdW5pcVdpdGgoXG4gICAgICAgICAgICB3b3JkcyxcbiAgICAgICAgICAgIChhLCBiKSA9PiBhLnZhbHVlID09PSBiLnZhbHVlICYmIGEudHlwZSA9PT0gYi50eXBlXG4gICAgICAgICAgKS5zbGljZSgwLCB0aGlzLnNldHRpbmdzLm1heE51bWJlck9mU3VnZ2VzdGlvbnMpXG4gICAgICAgICk7XG5cbiAgICAgICAgdGhpcy5zaG93RGVidWdMb2coKCkgPT5cbiAgICAgICAgICBidWlsZExvZ01lc3NhZ2UoXCJHZXQgc3VnZ2VzdGlvbnNcIiwgcGVyZm9ybWFuY2Uubm93KCkgLSBzdGFydClcbiAgICAgICAgKTtcbiAgICAgIH0sXG4gICAgICB0aGlzLnNldHRpbmdzLmRlbGF5TWlsbGlTZWNvbmRzLFxuICAgICAgdHJ1ZVxuICAgICk7XG5cbiAgICB0aGlzLmRlYm91bmNlQ2xvc2UgPSBkZWJvdW5jZSgoKSA9PiB7XG4gICAgICB0aGlzLmNsb3NlKCk7XG4gICAgfSwgdGhpcy5zZXR0aW5ncy5kZWxheU1pbGxpU2Vjb25kcyArIDUwKTtcblxuICAgIHRoaXMucmVnaXN0ZXJLZXltYXBzKCk7XG4gIH1cblxuICBwcml2YXRlIHJlZ2lzdGVyS2V5bWFwcygpIHtcbiAgICAvLyBDbGVhclxuICAgIHRoaXMua2V5bWFwRXZlbnRIYW5kbGVyLmZvckVhY2goKHgpID0+IHRoaXMuc2NvcGUudW5yZWdpc3Rlcih4KSk7XG4gICAgdGhpcy5rZXltYXBFdmVudEhhbmRsZXIgPSBbXTtcblxuICAgIHRoaXMuc2NvcGUudW5yZWdpc3Rlcih0aGlzLnNjb3BlLmtleXMuZmluZCgoeCkgPT4geC5rZXkgPT09IFwiRW50ZXJcIikhKTtcbiAgICBjb25zdCBzZWxlY3RTdWdnZXN0aW9uS2V5ID0gU2VsZWN0U3VnZ2VzdGlvbktleS5mcm9tTmFtZShcbiAgICAgIHRoaXMuc2V0dGluZ3Muc2VsZWN0U3VnZ2VzdGlvbktleXNcbiAgICApO1xuICAgIGlmIChzZWxlY3RTdWdnZXN0aW9uS2V5ICE9PSBTZWxlY3RTdWdnZXN0aW9uS2V5LkVOVEVSKSB7XG4gICAgICB0aGlzLmtleW1hcEV2ZW50SGFuZGxlci5wdXNoKFxuICAgICAgICB0aGlzLnNjb3BlLnJlZ2lzdGVyKFxuICAgICAgICAgIFNlbGVjdFN1Z2dlc3Rpb25LZXkuRU5URVIua2V5QmluZC5tb2RpZmllcnMsXG4gICAgICAgICAgU2VsZWN0U3VnZ2VzdGlvbktleS5FTlRFUi5rZXlCaW5kLmtleSxcbiAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIClcbiAgICAgICk7XG4gICAgfVxuICAgIGlmIChzZWxlY3RTdWdnZXN0aW9uS2V5ICE9PSBTZWxlY3RTdWdnZXN0aW9uS2V5LlRBQikge1xuICAgICAgdGhpcy5rZXltYXBFdmVudEhhbmRsZXIucHVzaChcbiAgICAgICAgdGhpcy5zY29wZS5yZWdpc3RlcihcbiAgICAgICAgICBTZWxlY3RTdWdnZXN0aW9uS2V5LlRBQi5rZXlCaW5kLm1vZGlmaWVycyxcbiAgICAgICAgICBTZWxlY3RTdWdnZXN0aW9uS2V5LlRBQi5rZXlCaW5kLmtleSxcbiAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIClcbiAgICAgICk7XG4gICAgfVxuICAgIHRoaXMua2V5bWFwRXZlbnRIYW5kbGVyLnB1c2goXG4gICAgICB0aGlzLnNjb3BlLnJlZ2lzdGVyKFxuICAgICAgICBzZWxlY3RTdWdnZXN0aW9uS2V5LmtleUJpbmQubW9kaWZpZXJzLFxuICAgICAgICBzZWxlY3RTdWdnZXN0aW9uS2V5LmtleUJpbmQua2V5LFxuICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgdGhpcy5zdWdnZXN0aW9ucy51c2VTZWxlY3RlZEl0ZW0oe30pO1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgKVxuICAgICk7XG5cbiAgICB0aGlzLnNjb3BlLmtleXMuZmluZCgoeCkgPT4geC5rZXkgPT09IFwiRXNjYXBlXCIpIS5mdW5jID0gKCkgPT4ge1xuICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgcmV0dXJuIHRoaXMuc2V0dGluZ3MucHJvcGFnYXRlRXNjO1xuICAgIH07XG5cbiAgICBjb25zdCBjeWNsZVRocm91Z2hTdWdnZXN0aW9uc0tleXMgPSBDeWNsZVRocm91Z2hTdWdnZXN0aW9uc0tleXMuZnJvbU5hbWUoXG4gICAgICB0aGlzLnNldHRpbmdzLmFkZGl0aW9uYWxDeWNsZVRocm91Z2hTdWdnZXN0aW9uc0tleXNcbiAgICApO1xuICAgIGlmIChjeWNsZVRocm91Z2hTdWdnZXN0aW9uc0tleXMgIT09IEN5Y2xlVGhyb3VnaFN1Z2dlc3Rpb25zS2V5cy5OT05FKSB7XG4gICAgICBpZiAoY3ljbGVUaHJvdWdoU3VnZ2VzdGlvbnNLZXlzID09PSBDeWNsZVRocm91Z2hTdWdnZXN0aW9uc0tleXMuVEFCKSB7XG4gICAgICAgIHRoaXMuc2NvcGUudW5yZWdpc3RlcihcbiAgICAgICAgICB0aGlzLnNjb3BlLmtleXMuZmluZCgoeCkgPT4geC5tb2RpZmllcnMgPT09IFwiXCIgJiYgeC5rZXkgPT09IFwiVGFiXCIpIVxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgdGhpcy5rZXltYXBFdmVudEhhbmRsZXIucHVzaChcbiAgICAgICAgdGhpcy5zY29wZS5yZWdpc3RlcihcbiAgICAgICAgICBjeWNsZVRocm91Z2hTdWdnZXN0aW9uc0tleXMubmV4dEtleS5tb2RpZmllcnMsXG4gICAgICAgICAgY3ljbGVUaHJvdWdoU3VnZ2VzdGlvbnNLZXlzLm5leHRLZXkua2V5LFxuICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc3VnZ2VzdGlvbnMuc2V0U2VsZWN0ZWRJdGVtKFxuICAgICAgICAgICAgICB0aGlzLnN1Z2dlc3Rpb25zLnNlbGVjdGVkSXRlbSArIDEsXG4gICAgICAgICAgICAgIHRydWVcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICApLFxuICAgICAgICB0aGlzLnNjb3BlLnJlZ2lzdGVyKFxuICAgICAgICAgIGN5Y2xlVGhyb3VnaFN1Z2dlc3Rpb25zS2V5cy5wcmV2aW91c0tleS5tb2RpZmllcnMsXG4gICAgICAgICAgY3ljbGVUaHJvdWdoU3VnZ2VzdGlvbnNLZXlzLnByZXZpb3VzS2V5LmtleSxcbiAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnN1Z2dlc3Rpb25zLnNldFNlbGVjdGVkSXRlbShcbiAgICAgICAgICAgICAgdGhpcy5zdWdnZXN0aW9ucy5zZWxlY3RlZEl0ZW0gLSAxLFxuICAgICAgICAgICAgICB0cnVlXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICBjb25zdCBvcGVuU291cmNlRmlsZUtleSA9IE9wZW5Tb3VyY2VGaWxlS2V5cy5mcm9tTmFtZShcbiAgICAgIHRoaXMuc2V0dGluZ3Mub3BlblNvdXJjZUZpbGVLZXlcbiAgICApO1xuICAgIGlmIChvcGVuU291cmNlRmlsZUtleSAhPT0gT3BlblNvdXJjZUZpbGVLZXlzLk5PTkUpIHtcbiAgICAgIHRoaXMua2V5bWFwRXZlbnRIYW5kbGVyLnB1c2goXG4gICAgICAgIHRoaXMuc2NvcGUucmVnaXN0ZXIoXG4gICAgICAgICAgb3BlblNvdXJjZUZpbGVLZXkua2V5QmluZC5tb2RpZmllcnMsXG4gICAgICAgICAgb3BlblNvdXJjZUZpbGVLZXkua2V5QmluZC5rZXksXG4gICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaXRlbSA9IHRoaXMuc3VnZ2VzdGlvbnMudmFsdWVzW3RoaXMuc3VnZ2VzdGlvbnMuc2VsZWN0ZWRJdGVtXTtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgaXRlbS50eXBlICE9PSBcImN1cnJlbnRWYXVsdFwiICYmXG4gICAgICAgICAgICAgIGl0ZW0udHlwZSAhPT0gXCJpbnRlcm5hbExpbmtcIiAmJlxuICAgICAgICAgICAgICBpdGVtLnR5cGUgIT09IFwiZnJvbnRNYXR0ZXJcIlxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgbWFya2Rvd25GaWxlID0gdGhpcy5hcHBIZWxwZXIuZ2V0TWFya2Rvd25GaWxlQnlQYXRoKFxuICAgICAgICAgICAgICBpdGVtLmNyZWF0ZWRQYXRoXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgaWYgKCFtYXJrZG93bkZpbGUpIHtcbiAgICAgICAgICAgICAgbmV3IE5vdGljZShgQ2FuJ3Qgb3BlbiAke2l0ZW0uY3JlYXRlZFBhdGh9YCk7XG4gICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuYXBwSGVscGVyLm9wZW5NYXJrZG93bkZpbGUobWFya2Rvd25GaWxlLCB0cnVlKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIClcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgcmVmcmVzaEN1cnJlbnRGaWxlVG9rZW5zKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHN0YXJ0ID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgdGhpcy5zdGF0dXNCYXIuc2V0Q3VycmVudEZpbGVJbmRleGluZygpO1xuXG4gICAgaWYgKCF0aGlzLnNldHRpbmdzLmVuYWJsZUN1cnJlbnRGaWxlQ29tcGxlbWVudCkge1xuICAgICAgdGhpcy5zdGF0dXNCYXIuc2V0Q3VycmVudEZpbGVEaXNhYmxlZCgpO1xuICAgICAgdGhpcy5jdXJyZW50RmlsZVdvcmRQcm92aWRlci5jbGVhcldvcmRzKCk7XG4gICAgICB0aGlzLnNob3dEZWJ1Z0xvZygoKSA9PlxuICAgICAgICBidWlsZExvZ01lc3NhZ2UoXG4gICAgICAgICAgXCLwn5GiIFNraXA6IEluZGV4IGN1cnJlbnQgZmlsZSB0b2tlbnNcIixcbiAgICAgICAgICBwZXJmb3JtYW5jZS5ub3coKSAtIHN0YXJ0XG4gICAgICAgIClcbiAgICAgICk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgYXdhaXQgdGhpcy5jdXJyZW50RmlsZVdvcmRQcm92aWRlci5yZWZyZXNoV29yZHMoXG4gICAgICB0aGlzLnNldHRpbmdzLm9ubHlDb21wbGVtZW50RW5nbGlzaE9uQ3VycmVudEZpbGVDb21wbGVtZW50XG4gICAgKTtcblxuICAgIHRoaXMuc3RhdHVzQmFyLnNldEN1cnJlbnRGaWxlSW5kZXhlZChcbiAgICAgIHRoaXMuY3VycmVudEZpbGVXb3JkUHJvdmlkZXIud29yZENvdW50XG4gICAgKTtcbiAgICB0aGlzLnNob3dEZWJ1Z0xvZygoKSA9PlxuICAgICAgYnVpbGRMb2dNZXNzYWdlKFwiSW5kZXggY3VycmVudCBmaWxlIHRva2Vuc1wiLCBwZXJmb3JtYW5jZS5ub3coKSAtIHN0YXJ0KVxuICAgICk7XG4gIH1cblxuICBhc3luYyByZWZyZXNoQ3VycmVudFZhdWx0VG9rZW5zKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHN0YXJ0ID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgdGhpcy5zdGF0dXNCYXIuc2V0Q3VycmVudFZhdWx0SW5kZXhpbmcoKTtcblxuICAgIGlmICghdGhpcy5zZXR0aW5ncy5lbmFibGVDdXJyZW50VmF1bHRDb21wbGVtZW50KSB7XG4gICAgICB0aGlzLnN0YXR1c0Jhci5zZXRDdXJyZW50VmF1bHREaXNhYmxlZCgpO1xuICAgICAgdGhpcy5jdXJyZW50VmF1bHRXb3JkUHJvdmlkZXIuY2xlYXJXb3JkcygpO1xuICAgICAgdGhpcy5zaG93RGVidWdMb2coKCkgPT5cbiAgICAgICAgYnVpbGRMb2dNZXNzYWdlKFxuICAgICAgICAgIFwi8J+RoiBTa2lwOiBJbmRleCBjdXJyZW50IHZhdWx0IHRva2Vuc1wiLFxuICAgICAgICAgIHBlcmZvcm1hbmNlLm5vdygpIC0gc3RhcnRcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBhd2FpdCB0aGlzLmN1cnJlbnRWYXVsdFdvcmRQcm92aWRlci5yZWZyZXNoV29yZHMoKTtcblxuICAgIHRoaXMuc3RhdHVzQmFyLnNldEN1cnJlbnRWYXVsdEluZGV4ZWQoXG4gICAgICB0aGlzLmN1cnJlbnRWYXVsdFdvcmRQcm92aWRlci53b3JkQ291bnRcbiAgICApO1xuICAgIHRoaXMuc2hvd0RlYnVnTG9nKCgpID0+XG4gICAgICBidWlsZExvZ01lc3NhZ2UoXCJJbmRleCBjdXJyZW50IHZhdWx0IHRva2Vuc1wiLCBwZXJmb3JtYW5jZS5ub3coKSAtIHN0YXJ0KVxuICAgICk7XG4gIH1cblxuICBhc3luYyByZWZyZXNoQ3VzdG9tRGljdGlvbmFyeVRva2VucygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBzdGFydCA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgIHRoaXMuc3RhdHVzQmFyLnNldEN1c3RvbURpY3Rpb25hcnlJbmRleGluZygpO1xuXG4gICAgaWYgKCF0aGlzLnNldHRpbmdzLmVuYWJsZUN1c3RvbURpY3Rpb25hcnlDb21wbGVtZW50KSB7XG4gICAgICB0aGlzLnN0YXR1c0Jhci5zZXRDdXN0b21EaWN0aW9uYXJ5RGlzYWJsZWQoKTtcbiAgICAgIHRoaXMuY3VzdG9tRGljdGlvbmFyeVdvcmRQcm92aWRlci5jbGVhcldvcmRzKCk7XG4gICAgICB0aGlzLnNob3dEZWJ1Z0xvZygoKSA9PlxuICAgICAgICBidWlsZExvZ01lc3NhZ2UoXG4gICAgICAgICAgXCLwn5GiU2tpcDogSW5kZXggY3VzdG9tIGRpY3Rpb25hcnkgdG9rZW5zXCIsXG4gICAgICAgICAgcGVyZm9ybWFuY2Uubm93KCkgLSBzdGFydFxuICAgICAgICApXG4gICAgICApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGF3YWl0IHRoaXMuY3VzdG9tRGljdGlvbmFyeVdvcmRQcm92aWRlci5yZWZyZXNoQ3VzdG9tV29yZHMoXG4gICAgICB0aGlzLnNldHRpbmdzLmN1c3RvbURpY3Rpb25hcnlXb3JkUmVnZXhQYXR0ZXJuXG4gICAgKTtcblxuICAgIHRoaXMuc3RhdHVzQmFyLnNldEN1c3RvbURpY3Rpb25hcnlJbmRleGVkKFxuICAgICAgdGhpcy5jdXN0b21EaWN0aW9uYXJ5V29yZFByb3ZpZGVyLndvcmRDb3VudFxuICAgICk7XG4gICAgdGhpcy5zaG93RGVidWdMb2coKCkgPT5cbiAgICAgIGJ1aWxkTG9nTWVzc2FnZShcbiAgICAgICAgXCJJbmRleCBjdXN0b20gZGljdGlvbmFyeSB0b2tlbnNcIixcbiAgICAgICAgcGVyZm9ybWFuY2Uubm93KCkgLSBzdGFydFxuICAgICAgKVxuICAgICk7XG4gIH1cblxuICByZWZyZXNoSW50ZXJuYWxMaW5rVG9rZW5zKCk6IHZvaWQge1xuICAgIGNvbnN0IHN0YXJ0ID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgdGhpcy5zdGF0dXNCYXIuc2V0SW50ZXJuYWxMaW5rSW5kZXhpbmcoKTtcblxuICAgIGlmICghdGhpcy5zZXR0aW5ncy5lbmFibGVJbnRlcm5hbExpbmtDb21wbGVtZW50KSB7XG4gICAgICB0aGlzLnN0YXR1c0Jhci5zZXRJbnRlcm5hbExpbmtEaXNhYmxlZCgpO1xuICAgICAgdGhpcy5pbnRlcm5hbExpbmtXb3JkUHJvdmlkZXIuY2xlYXJXb3JkcygpO1xuICAgICAgdGhpcy5zaG93RGVidWdMb2coKCkgPT5cbiAgICAgICAgYnVpbGRMb2dNZXNzYWdlKFxuICAgICAgICAgIFwi8J+RolNraXA6IEluZGV4IGludGVybmFsIGxpbmsgdG9rZW5zXCIsXG4gICAgICAgICAgcGVyZm9ybWFuY2Uubm93KCkgLSBzdGFydFxuICAgICAgICApXG4gICAgICApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuaW50ZXJuYWxMaW5rV29yZFByb3ZpZGVyLnJlZnJlc2hXb3JkcyhcbiAgICAgIHRoaXMuc2V0dGluZ3Muc3VnZ2VzdEludGVybmFsTGlua1dpdGhBbGlhc1xuICAgICk7XG5cbiAgICB0aGlzLnN0YXR1c0Jhci5zZXRJbnRlcm5hbExpbmtJbmRleGVkKFxuICAgICAgdGhpcy5pbnRlcm5hbExpbmtXb3JkUHJvdmlkZXIud29yZENvdW50XG4gICAgKTtcbiAgICB0aGlzLnNob3dEZWJ1Z0xvZygoKSA9PlxuICAgICAgYnVpbGRMb2dNZXNzYWdlKFwiSW5kZXggaW50ZXJuYWwgbGluayB0b2tlbnNcIiwgcGVyZm9ybWFuY2Uubm93KCkgLSBzdGFydClcbiAgICApO1xuICB9XG5cbiAgcmVmcmVzaEZyb250TWF0dGVyVG9rZW5zKCk6IHZvaWQge1xuICAgIGNvbnN0IHN0YXJ0ID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgdGhpcy5zdGF0dXNCYXIuc2V0RnJvbnRNYXR0ZXJJbmRleGluZygpO1xuXG4gICAgaWYgKCF0aGlzLnNldHRpbmdzLmVuYWJsZUZyb250TWF0dGVyQ29tcGxlbWVudCkge1xuICAgICAgdGhpcy5zdGF0dXNCYXIuc2V0RnJvbnRNYXR0ZXJEaXNhYmxlZCgpO1xuICAgICAgdGhpcy5mcm9udE1hdHRlcldvcmRQcm92aWRlci5jbGVhcldvcmRzKCk7XG4gICAgICB0aGlzLnNob3dEZWJ1Z0xvZygoKSA9PlxuICAgICAgICBidWlsZExvZ01lc3NhZ2UoXG4gICAgICAgICAgXCLwn5GiU2tpcDogSW5kZXggZnJvbnQgbWF0dGVyIHRva2Vuc1wiLFxuICAgICAgICAgIHBlcmZvcm1hbmNlLm5vdygpIC0gc3RhcnRcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmZyb250TWF0dGVyV29yZFByb3ZpZGVyLnJlZnJlc2hXb3JkcygpO1xuXG4gICAgdGhpcy5zdGF0dXNCYXIuc2V0RnJvbnRNYXR0ZXJJbmRleGVkKFxuICAgICAgdGhpcy5mcm9udE1hdHRlcldvcmRQcm92aWRlci53b3JkQ291bnRcbiAgICApO1xuICAgIHRoaXMuc2hvd0RlYnVnTG9nKCgpID0+XG4gICAgICBidWlsZExvZ01lc3NhZ2UoXCJJbmRleCBmcm9udCBtYXR0ZXIgdG9rZW5zXCIsIHBlcmZvcm1hbmNlLm5vdygpIC0gc3RhcnQpXG4gICAgKTtcbiAgfVxuXG4gIG9uVHJpZ2dlcihcbiAgICBjdXJzb3I6IEVkaXRvclBvc2l0aW9uLFxuICAgIGVkaXRvcjogRWRpdG9yLFxuICAgIGZpbGU6IFRGaWxlXG4gICk6IEVkaXRvclN1Z2dlc3RUcmlnZ2VySW5mbyB8IG51bGwge1xuICAgIGNvbnN0IHN0YXJ0ID0gcGVyZm9ybWFuY2Uubm93KCk7XG5cbiAgICBpZiAoXG4gICAgICAhdGhpcy5zZXR0aW5ncy5jb21wbGVtZW50QXV0b21hdGljYWxseSAmJlxuICAgICAgIXRoaXMuaXNPcGVuICYmXG4gICAgICAhdGhpcy5ydW5NYW51YWxseVxuICAgICkge1xuICAgICAgdGhpcy5zaG93RGVidWdMb2coKCkgPT4gXCJEb24ndCBzaG93IHN1Z2dlc3Rpb25zXCIpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgaWYgKFxuICAgICAgdGhpcy5zZXR0aW5ncy5kaXNhYmxlU3VnZ2VzdGlvbnNEdXJpbmdJbWVPbiAmJlxuICAgICAgdGhpcy5hcHBIZWxwZXIuaXNJTUVPbigpICYmXG4gICAgICAhdGhpcy5ydW5NYW51YWxseVxuICAgICkge1xuICAgICAgdGhpcy5zaG93RGVidWdMb2coKCkgPT4gXCJEb24ndCBzaG93IHN1Z2dlc3Rpb25zIGZvciBJTUVcIik7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBjdXJyZW50TGluZVVudGlsQ3Vyc29yID1cbiAgICAgIHRoaXMuYXBwSGVscGVyLmdldEN1cnJlbnRMaW5lVW50aWxDdXJzb3IoZWRpdG9yKTtcbiAgICBpZiAoY3VycmVudExpbmVVbnRpbEN1cnNvci5zdGFydHNXaXRoKFwiLS0tXCIpKSB7XG4gICAgICB0aGlzLnNob3dEZWJ1Z0xvZyhcbiAgICAgICAgKCkgPT5cbiAgICAgICAgICBcIkRvbid0IHNob3cgc3VnZ2VzdGlvbnMgYmVjYXVzZSBpdCBzdXBwb3NlcyBmcm9udCBtYXR0ZXIgb3IgaG9yaXpvbnRhbCBsaW5lXCJcbiAgICAgICk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKFxuICAgICAgY3VycmVudExpbmVVbnRpbEN1cnNvci5zdGFydHNXaXRoKFwifn5+XCIpIHx8XG4gICAgICBjdXJyZW50TGluZVVudGlsQ3Vyc29yLnN0YXJ0c1dpdGgoXCJgYGBcIilcbiAgICApIHtcbiAgICAgIHRoaXMuc2hvd0RlYnVnTG9nKFxuICAgICAgICAoKSA9PiBcIkRvbid0IHNob3cgc3VnZ2VzdGlvbnMgYmVjYXVzZSBpdCBzdXBwb3NlcyBmcm9udCBjb2RlIGJsb2NrXCJcbiAgICAgICk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCB0b2tlbnMgPSB0aGlzLnRva2VuaXplci50b2tlbml6ZShjdXJyZW50TGluZVVudGlsQ3Vyc29yLCB0cnVlKTtcbiAgICB0aGlzLnNob3dEZWJ1Z0xvZygoKSA9PiBgW29uVHJpZ2dlcl0gdG9rZW5zIGlzICR7dG9rZW5zfWApO1xuXG4gICAgY29uc3QgdG9rZW5pemVkID0gdGhpcy50b2tlbml6ZXIucmVjdXJzaXZlVG9rZW5pemUoY3VycmVudExpbmVVbnRpbEN1cnNvcik7XG4gICAgY29uc3QgY3VycmVudFRva2VucyA9IHRva2VuaXplZC5zbGljZShcbiAgICAgIHRva2VuaXplZC5sZW5ndGggPiB0aGlzLnNldHRpbmdzLm1heE51bWJlck9mV29yZHNBc1BocmFzZVxuICAgICAgICA/IHRva2VuaXplZC5sZW5ndGggLSB0aGlzLnNldHRpbmdzLm1heE51bWJlck9mV29yZHNBc1BocmFzZVxuICAgICAgICA6IDBcbiAgICApO1xuICAgIHRoaXMuc2hvd0RlYnVnTG9nKFxuICAgICAgKCkgPT4gYFtvblRyaWdnZXJdIGN1cnJlbnRUb2tlbnMgaXMgJHtKU09OLnN0cmluZ2lmeShjdXJyZW50VG9rZW5zKX1gXG4gICAgKTtcblxuICAgIGNvbnN0IGN1cnJlbnRUb2tlbiA9IGN1cnJlbnRUb2tlbnNbMF0/LndvcmQ7XG4gICAgdGhpcy5zaG93RGVidWdMb2coKCkgPT4gYFtvblRyaWdnZXJdIGN1cnJlbnRUb2tlbiBpcyAke2N1cnJlbnRUb2tlbn1gKTtcbiAgICBpZiAoIWN1cnJlbnRUb2tlbikge1xuICAgICAgdGhpcy5ydW5NYW51YWxseSA9IGZhbHNlO1xuICAgICAgdGhpcy5zaG93RGVidWdMb2coXG4gICAgICAgICgpID0+IGBEb24ndCBzaG93IHN1Z2dlc3Rpb25zIGJlY2F1c2UgY3VycmVudFRva2VuIGlzIGVtcHR5YFxuICAgICAgKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGN1cnJlbnRUb2tlblNlcGFyYXRlZFdoaXRlU3BhY2UgPVxuICAgICAgY3VycmVudExpbmVVbnRpbEN1cnNvci5zcGxpdChcIiBcIikubGFzdCgpID8/IFwiXCI7XG4gICAgaWYgKC9eWzpcXC9eXS8udGVzdChjdXJyZW50VG9rZW5TZXBhcmF0ZWRXaGl0ZVNwYWNlKSkge1xuICAgICAgdGhpcy5ydW5NYW51YWxseSA9IGZhbHNlO1xuICAgICAgdGhpcy5zaG93RGVidWdMb2coXG4gICAgICAgICgpID0+XG4gICAgICAgICAgYERvbid0IHNob3cgc3VnZ2VzdGlvbnMgZm9yIGF2b2lkaW5nIHRvIGNvbmZsaWN0IHdpdGggdGhlIG90aGVyIGNvbW1hbmRzLmBcbiAgICAgICk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAoXG4gICAgICBjdXJyZW50VG9rZW4ubGVuZ3RoID09PSAxICYmXG4gICAgICBCb29sZWFuKGN1cnJlbnRUb2tlbi5tYXRjaCh0aGlzLnRva2VuaXplci5nZXRUcmltUGF0dGVybigpKSlcbiAgICApIHtcbiAgICAgIHRoaXMucnVuTWFudWFsbHkgPSBmYWxzZTtcbiAgICAgIHRoaXMuc2hvd0RlYnVnTG9nKFxuICAgICAgICAoKSA9PiBgRG9uJ3Qgc2hvdyBzdWdnZXN0aW9ucyBiZWNhdXNlIGN1cnJlbnRUb2tlbiBpcyBUUklNX1BBVFRFUk5gXG4gICAgICApO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgY3VycmVudEZyb250TWF0dGVyID0gdGhpcy5zZXR0aW5ncy5lbmFibGVGcm9udE1hdHRlckNvbXBsZW1lbnRcbiAgICAgID8gdGhpcy5hcHBIZWxwZXIuZ2V0Q3VycmVudEZyb250TWF0dGVyKClcbiAgICAgIDogbnVsbDtcbiAgICB0aGlzLnNob3dEZWJ1Z0xvZygoKSA9PiBgQ3VycmVudCBmcm9udCBtYXR0ZXIgaXMgJHtjdXJyZW50RnJvbnRNYXR0ZXJ9YCk7XG5cbiAgICBpZiAoIXRoaXMucnVuTWFudWFsbHkgJiYgIWN1cnJlbnRGcm9udE1hdHRlcikge1xuICAgICAgaWYgKGN1cnJlbnRUb2tlbi5sZW5ndGggPCB0aGlzLm1pbk51bWJlclRyaWdnZXJlZCkge1xuICAgICAgICB0aGlzLnNob3dEZWJ1Z0xvZyhcbiAgICAgICAgICAoKSA9PlxuICAgICAgICAgICAgXCJEb24ndCBzaG93IHN1Z2dlc3Rpb25zIGJlY2F1c2UgY3VycmVudFRva2VuIGlzIGxlc3MgdGhhbiBtaW5OdW1iZXJUcmlnZ2VyZWQgb3B0aW9uXCJcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy50b2tlbml6ZXIuc2hvdWxkSWdub3JlKGN1cnJlbnRUb2tlbikpIHtcbiAgICAgICAgdGhpcy5zaG93RGVidWdMb2coXG4gICAgICAgICAgKCkgPT4gXCJEb24ndCBzaG93IHN1Z2dlc3Rpb25zIGJlY2F1c2UgY3VycmVudFRva2VuIHNob3VsZCBpZ25vcmVkXCJcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5zaG93RGVidWdMb2coKCkgPT5cbiAgICAgIGJ1aWxkTG9nTWVzc2FnZShcIm9uVHJpZ2dlclwiLCBwZXJmb3JtYW5jZS5ub3coKSAtIHN0YXJ0KVxuICAgICk7XG4gICAgdGhpcy5ydW5NYW51YWxseSA9IGZhbHNlO1xuXG4gICAgLy8gSGFjayBpbXBsZW1lbnRhdGlvbiBmb3IgRnJvbnQgbWF0dGVyIGNvbXBsZW1lbnRcbiAgICBpZiAoY3VycmVudEZyb250TWF0dGVyICYmIGN1cnJlbnRUb2tlbnMubGFzdCgpPy53b3JkLm1hdGNoKC9bXiBdICQvKSkge1xuICAgICAgY3VycmVudFRva2Vucy5wdXNoKHsgd29yZDogXCJcIiwgb2Zmc2V0OiBjdXJyZW50TGluZVVudGlsQ3Vyc29yLmxlbmd0aCB9KTtcbiAgICB9XG5cbiAgICAvLyBGb3IgbXVsdGktd29yZCBjb21wbGV0aW9uXG4gICAgdGhpcy5jb250ZXh0U3RhcnRDaCA9IGN1cnNvci5jaCAtIGN1cnJlbnRUb2tlbi5sZW5ndGg7XG4gICAgcmV0dXJuIHtcbiAgICAgIHN0YXJ0OiB7XG4gICAgICAgIGNoOiBjdXJzb3IuY2ggLSAoY3VycmVudFRva2Vucy5sYXN0KCk/LndvcmQ/Lmxlbmd0aCA/PyAwKSwgLy8gRm9yIG11bHRpLXdvcmQgY29tcGxldGlvblxuICAgICAgICBsaW5lOiBjdXJzb3IubGluZSxcbiAgICAgIH0sXG4gICAgICBlbmQ6IGN1cnNvcixcbiAgICAgIHF1ZXJ5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgIGN1cnJlbnRGcm9udE1hdHRlcixcbiAgICAgICAgcXVlcmllczogY3VycmVudFRva2Vucy5tYXAoKHgpID0+ICh7XG4gICAgICAgICAgLi4ueCxcbiAgICAgICAgICBvZmZzZXQ6IHgub2Zmc2V0IC0gY3VycmVudFRva2Vuc1swXS5vZmZzZXQsXG4gICAgICAgIH0pKSxcbiAgICAgIH0pLFxuICAgIH07XG4gIH1cblxuICBnZXRTdWdnZXN0aW9ucyhjb250ZXh0OiBFZGl0b3JTdWdnZXN0Q29udGV4dCk6IFdvcmRbXSB8IFByb21pc2U8V29yZFtdPiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICB0aGlzLmRlYm91bmNlR2V0U3VnZ2VzdGlvbnMoY29udGV4dCwgKHdvcmRzKSA9PiB7XG4gICAgICAgIHJlc29sdmUod29yZHMpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICByZW5kZXJTdWdnZXN0aW9uKHdvcmQ6IFdvcmQsIGVsOiBIVE1MRWxlbWVudCk6IHZvaWQge1xuICAgIGNvbnN0IGJhc2UgPSBjcmVhdGVEaXYoKTtcbiAgICBsZXQgdGV4dCA9IHdvcmQudmFsdWU7XG5cbiAgICBiYXNlLmNyZWF0ZURpdih7XG4gICAgICB0ZXh0OlxuICAgICAgICB0aGlzLnNldHRpbmdzLmRlbGltaXRlclRvSGlkZVN1Z2dlc3Rpb24gJiZcbiAgICAgICAgdGV4dC5pbmNsdWRlcyh0aGlzLnNldHRpbmdzLmRlbGltaXRlclRvSGlkZVN1Z2dlc3Rpb24pXG4gICAgICAgICAgPyBgJHt0ZXh0LnNwbGl0KHRoaXMuc2V0dGluZ3MuZGVsaW1pdGVyVG9IaWRlU3VnZ2VzdGlvbilbMF19IC4uLmBcbiAgICAgICAgICA6IHRleHQsXG4gICAgICBjbHM6XG4gICAgICAgIHdvcmQudHlwZSA9PT0gXCJpbnRlcm5hbExpbmtcIiAmJiB3b3JkLmFsaWFzTWV0YVxuICAgICAgICAgID8gXCJ2YXJpb3VzLWNvbXBsZW1lbnRzX19zdWdnZXN0aW9uLWl0ZW1fX2NvbnRlbnRfX2FsaWFzXCJcbiAgICAgICAgICA6IHVuZGVmaW5lZCxcbiAgICB9KTtcblxuICAgIGNvbnN0IGRlc2NyaXB0aW9uID0gdGhpcy5kZXNjcmlwdGlvbk9uU3VnZ2VzdGlvbi50b0Rpc3BsYXkod29yZCk7XG4gICAgaWYgKGRlc2NyaXB0aW9uKSB7XG4gICAgICBiYXNlLmNyZWF0ZURpdih7XG4gICAgICAgIGNsczogXCJ2YXJpb3VzLWNvbXBsZW1lbnRzX19zdWdnZXN0aW9uLWl0ZW1fX2Rlc2NyaXB0aW9uXCIsXG4gICAgICAgIHRleHQ6IGAke2Rlc2NyaXB0aW9ufWAsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBlbC5hcHBlbmRDaGlsZChiYXNlKTtcblxuICAgIGVsLmFkZENsYXNzKFwidmFyaW91cy1jb21wbGVtZW50c19fc3VnZ2VzdGlvbi1pdGVtXCIpO1xuICAgIHN3aXRjaCAod29yZC50eXBlKSB7XG4gICAgICBjYXNlIFwiY3VycmVudEZpbGVcIjpcbiAgICAgICAgZWwuYWRkQ2xhc3MoXCJ2YXJpb3VzLWNvbXBsZW1lbnRzX19zdWdnZXN0aW9uLWl0ZW1fX2N1cnJlbnQtZmlsZVwiKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiY3VycmVudFZhdWx0XCI6XG4gICAgICAgIGVsLmFkZENsYXNzKFwidmFyaW91cy1jb21wbGVtZW50c19fc3VnZ2VzdGlvbi1pdGVtX19jdXJyZW50LXZhdWx0XCIpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJjdXN0b21EaWN0aW9uYXJ5XCI6XG4gICAgICAgIGVsLmFkZENsYXNzKFwidmFyaW91cy1jb21wbGVtZW50c19fc3VnZ2VzdGlvbi1pdGVtX19jdXN0b20tZGljdGlvbmFyeVwiKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiaW50ZXJuYWxMaW5rXCI6XG4gICAgICAgIGVsLmFkZENsYXNzKFwidmFyaW91cy1jb21wbGVtZW50c19fc3VnZ2VzdGlvbi1pdGVtX19pbnRlcm5hbC1saW5rXCIpO1xuICAgICAgICBpZiAod29yZC5waGFudG9tKSB7XG4gICAgICAgICAgZWwuYWRkQ2xhc3MoXCJ2YXJpb3VzLWNvbXBsZW1lbnRzX19zdWdnZXN0aW9uLWl0ZW1fX3BoYW50b21cIik7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiZnJvbnRNYXR0ZXJcIjpcbiAgICAgICAgZWwuYWRkQ2xhc3MoXCJ2YXJpb3VzLWNvbXBsZW1lbnRzX19zdWdnZXN0aW9uLWl0ZW1fX2Zyb250LW1hdHRlclwiKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgc2VsZWN0U3VnZ2VzdGlvbih3b3JkOiBXb3JkLCBldnQ6IE1vdXNlRXZlbnQgfCBLZXlib2FyZEV2ZW50KTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmNvbnRleHQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgaW5zZXJ0ZWRUZXh0ID0gd29yZC52YWx1ZTtcbiAgICBpZiAod29yZC50eXBlID09PSBcImludGVybmFsTGlua1wiKSB7XG4gICAgICBpbnNlcnRlZFRleHQgPVxuICAgICAgICB0aGlzLnNldHRpbmdzLnN1Z2dlc3RJbnRlcm5hbExpbmtXaXRoQWxpYXMgJiYgd29yZC5hbGlhc01ldGFcbiAgICAgICAgICA/IGBbWyR7d29yZC5hbGlhc01ldGEub3JpZ2lufXwke3dvcmQudmFsdWV9XV1gXG4gICAgICAgICAgOiBgW1ske3dvcmQudmFsdWV9XV1gO1xuICAgIH1cblxuICAgIGlmIChcbiAgICAgIHdvcmQudHlwZSA9PT0gXCJmcm9udE1hdHRlclwiICYmXG4gICAgICB0aGlzLnNldHRpbmdzLmluc2VydENvbW1hQWZ0ZXJGcm9udE1hdHRlckNvbXBsZXRpb25cbiAgICApIHtcbiAgICAgIGluc2VydGVkVGV4dCA9IGAke2luc2VydGVkVGV4dH0sIGA7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0aGlzLnNldHRpbmdzLmluc2VydEFmdGVyQ29tcGxldGlvbikge1xuICAgICAgICBpbnNlcnRlZFRleHQgPSBgJHtpbnNlcnRlZFRleHR9IGA7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc2V0dGluZ3MuZGVsaW1pdGVyVG9IaWRlU3VnZ2VzdGlvbikge1xuICAgICAgaW5zZXJ0ZWRUZXh0ID0gaW5zZXJ0ZWRUZXh0LnJlcGxhY2UoXG4gICAgICAgIHRoaXMuc2V0dGluZ3MuZGVsaW1pdGVyVG9IaWRlU3VnZ2VzdGlvbixcbiAgICAgICAgXCJcIlxuICAgICAgKTtcbiAgICB9XG5cbiAgICBjb25zdCBjYXJldCA9IHRoaXMuc2V0dGluZ3MuY2FyZXRMb2NhdGlvblN5bWJvbEFmdGVyQ29tcGxlbWVudDtcbiAgICBjb25zdCBwb3NpdGlvblRvTW92ZSA9IGNhcmV0ID8gaW5zZXJ0ZWRUZXh0LmluZGV4T2YoY2FyZXQpIDogLTE7XG4gICAgaWYgKHBvc2l0aW9uVG9Nb3ZlICE9PSAtMSkge1xuICAgICAgaW5zZXJ0ZWRUZXh0ID0gaW5zZXJ0ZWRUZXh0LnJlcGxhY2UoY2FyZXQsIFwiXCIpO1xuICAgIH1cblxuICAgIGNvbnN0IGVkaXRvciA9IHRoaXMuY29udGV4dC5lZGl0b3I7XG4gICAgZWRpdG9yLnJlcGxhY2VSYW5nZShcbiAgICAgIGluc2VydGVkVGV4dCxcbiAgICAgIHtcbiAgICAgICAgLi4udGhpcy5jb250ZXh0LnN0YXJ0LFxuICAgICAgICBjaDogdGhpcy5jb250ZXh0U3RhcnRDaCArIHdvcmQub2Zmc2V0ISxcbiAgICAgIH0sXG4gICAgICB0aGlzLmNvbnRleHQuZW5kXG4gICAgKTtcblxuICAgIGlmIChwb3NpdGlvblRvTW92ZSAhPT0gLTEpIHtcbiAgICAgIGVkaXRvci5zZXRDdXJzb3IoXG4gICAgICAgIGVkaXRvci5vZmZzZXRUb1BvcyhcbiAgICAgICAgICBlZGl0b3IucG9zVG9PZmZzZXQoZWRpdG9yLmdldEN1cnNvcigpKSAtXG4gICAgICAgICAgICBpbnNlcnRlZFRleHQubGVuZ3RoICtcbiAgICAgICAgICAgIHBvc2l0aW9uVG9Nb3ZlXG4gICAgICAgIClcbiAgICAgICk7XG4gICAgfVxuXG4gICAgLy8gVGhlIHdvcmthcm91bmQgb2Ygc3RyYW5nZSBiZWhhdmlvciBmb3IgdGhhdCBjdXJzb3IgZG9lc24ndCBtb3ZlIGFmdGVyIGNvbXBsZXRpb24gb25seSBpZiBpdCBkb2Vzbid0IGlucHV0IGFueSB3b3JkLlxuICAgIGlmIChcbiAgICAgIHRoaXMuYXBwSGVscGVyLmVxdWFsc0FzRWRpdG9yUG9zdGlvbih0aGlzLmNvbnRleHQuc3RhcnQsIHRoaXMuY29udGV4dC5lbmQpXG4gICAgKSB7XG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yKFxuICAgICAgICBlZGl0b3Iub2Zmc2V0VG9Qb3MoXG4gICAgICAgICAgZWRpdG9yLnBvc1RvT2Zmc2V0KGVkaXRvci5nZXRDdXJzb3IoKSkgKyBpbnNlcnRlZFRleHQubGVuZ3RoXG4gICAgICAgIClcbiAgICAgICk7XG4gICAgfVxuXG4gICAgdGhpcy5jbG9zZSgpO1xuICAgIHRoaXMuZGVib3VuY2VDbG9zZSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBzaG93RGVidWdMb2codG9NZXNzYWdlOiAoKSA9PiBzdHJpbmcpIHtcbiAgICBpZiAodGhpcy5zZXR0aW5ncy5zaG93TG9nQWJvdXRQZXJmb3JtYW5jZUluQ29uc29sZSkge1xuICAgICAgY29uc29sZS5sb2codG9NZXNzYWdlKCkpO1xuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IHsgQXBwLCBOb3RpY2UsIFBsdWdpblNldHRpbmdUYWIsIFNldHRpbmcgfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCBWYXJpb3VzQ29tcG9uZW50cyBmcm9tIFwiLi9tYWluXCI7XG5pbXBvcnQgeyBUb2tlbml6ZVN0cmF0ZWd5IH0gZnJvbSBcIi4vdG9rZW5pemVyL1Rva2VuaXplU3RyYXRlZ3lcIjtcbmltcG9ydCB7IE1hdGNoU3RyYXRlZ3kgfSBmcm9tIFwiLi9wcm92aWRlci9NYXRjaFN0cmF0ZWd5XCI7XG5pbXBvcnQgeyBDeWNsZVRocm91Z2hTdWdnZXN0aW9uc0tleXMgfSBmcm9tIFwiLi9vcHRpb24vQ3ljbGVUaHJvdWdoU3VnZ2VzdGlvbnNLZXlzXCI7XG5pbXBvcnQgeyBDb2x1bW5EZWxpbWl0ZXIgfSBmcm9tIFwiLi9vcHRpb24vQ29sdW1uRGVsaW1pdGVyXCI7XG5pbXBvcnQgeyBTZWxlY3RTdWdnZXN0aW9uS2V5IH0gZnJvbSBcIi4vb3B0aW9uL1NlbGVjdFN1Z2dlc3Rpb25LZXlcIjtcbmltcG9ydCB7IG1pcnJvck1hcCB9IGZyb20gXCIuL3V0aWwvY29sbGVjdGlvbi1oZWxwZXJcIjtcbmltcG9ydCB7IE9wZW5Tb3VyY2VGaWxlS2V5cyB9IGZyb20gXCIuL29wdGlvbi9PcGVuU291cmNlRmlsZUtleXNcIjtcbmltcG9ydCB7IERlc2NyaXB0aW9uT25TdWdnZXN0aW9uIH0gZnJvbSBcIi4vb3B0aW9uL0Rlc2NyaXB0aW9uT25TdWdnZXN0aW9uXCI7XG5pbXBvcnQgeyBTcGVjaWZpY01hdGNoU3RyYXRlZ3kgfSBmcm9tIFwiLi9wcm92aWRlci9TcGVjaWZpY01hdGNoU3RyYXRlZ3lcIjtcblxuZXhwb3J0IGludGVyZmFjZSBTZXR0aW5ncyB7XG4gIC8vIGdlbmVyYWxcbiAgc3RyYXRlZ3k6IHN0cmluZztcbiAgbWF0Y2hTdHJhdGVneTogc3RyaW5nO1xuICBtYXhOdW1iZXJPZlN1Z2dlc3Rpb25zOiBudW1iZXI7XG4gIG1heE51bWJlck9mV29yZHNBc1BocmFzZTogbnVtYmVyO1xuICBtaW5OdW1iZXJPZkNoYXJhY3RlcnNUcmlnZ2VyZWQ6IG51bWJlcjtcbiAgbWluTnVtYmVyT2ZXb3Jkc1RyaWdnZXJlZFBocmFzZTogbnVtYmVyO1xuICBjb21wbGVtZW50QXV0b21hdGljYWxseTogYm9vbGVhbjtcbiAgZGVsYXlNaWxsaVNlY29uZHM6IG51bWJlcjtcbiAgZGlzYWJsZVN1Z2dlc3Rpb25zRHVyaW5nSW1lT246IGJvb2xlYW47XG4gIC8vIEZJWE1FOiBSZW5hbWUgYXQgbmV4dCBtYWpvciB2ZXJzaW9uIHVwXG4gIGluc2VydEFmdGVyQ29tcGxldGlvbjogYm9vbGVhbjtcblxuICAvLyBhcHBlYXJhbmNlXG4gIHNob3dNYXRjaFN0cmF0ZWd5OiBib29sZWFuO1xuICBzaG93SW5kZXhpbmdTdGF0dXM6IGJvb2xlYW47XG4gIGRlc2NyaXB0aW9uT25TdWdnZXN0aW9uOiBzdHJpbmc7XG5cbiAgLy8ga2V5IGN1c3RvbWl6YXRpb25cbiAgc2VsZWN0U3VnZ2VzdGlvbktleXM6IHN0cmluZztcbiAgYWRkaXRpb25hbEN5Y2xlVGhyb3VnaFN1Z2dlc3Rpb25zS2V5czogc3RyaW5nO1xuICBvcGVuU291cmNlRmlsZUtleTogc3RyaW5nO1xuICBwcm9wYWdhdGVFc2M6IGJvb2xlYW47XG5cbiAgLy8gY3VycmVudCBmaWxlIGNvbXBsZW1lbnRcbiAgZW5hYmxlQ3VycmVudEZpbGVDb21wbGVtZW50OiBib29sZWFuO1xuICBvbmx5Q29tcGxlbWVudEVuZ2xpc2hPbkN1cnJlbnRGaWxlQ29tcGxlbWVudDogYm9vbGVhbjtcblxuICAvLyBjdXJyZW50IHZhdWx0IGNvbXBsZW1lbnRcbiAgZW5hYmxlQ3VycmVudFZhdWx0Q29tcGxlbWVudDogYm9vbGVhbjtcbiAgaW5jbHVkZUN1cnJlbnRWYXVsdFBhdGhQcmVmaXhQYXR0ZXJuczogc3RyaW5nO1xuICBleGNsdWRlQ3VycmVudFZhdWx0UGF0aFByZWZpeFBhdHRlcm5zOiBzdHJpbmc7XG4gIGluY2x1ZGVDdXJyZW50VmF1bHRPbmx5RmlsZXNVbmRlckN1cnJlbnREaXJlY3Rvcnk6IGJvb2xlYW47XG5cbiAgLy8gY3VzdG9tIGRpY3Rpb25hcnkgY29tcGxlbWVudFxuICBlbmFibGVDdXN0b21EaWN0aW9uYXJ5Q29tcGxlbWVudDogYm9vbGVhbjtcbiAgY3VzdG9tRGljdGlvbmFyeVBhdGhzOiBzdHJpbmc7XG4gIGNvbHVtbkRlbGltaXRlcjogc3RyaW5nO1xuICBjdXN0b21EaWN0aW9uYXJ5V29yZFJlZ2V4UGF0dGVybjogc3RyaW5nO1xuICBkZWxpbWl0ZXJUb0hpZGVTdWdnZXN0aW9uOiBzdHJpbmc7XG4gIGNhcmV0TG9jYXRpb25TeW1ib2xBZnRlckNvbXBsZW1lbnQ6IHN0cmluZztcblxuICAvLyBpbnRlcm5hbCBsaW5rIGNvbXBsZW1lbnRcbiAgZW5hYmxlSW50ZXJuYWxMaW5rQ29tcGxlbWVudDogYm9vbGVhbjtcbiAgc3VnZ2VzdEludGVybmFsTGlua1dpdGhBbGlhczogYm9vbGVhbjtcblxuICAvLyBmcm9udCBtYXR0ZXIgY29tcGxlbWVudFxuICBlbmFibGVGcm9udE1hdHRlckNvbXBsZW1lbnQ6IGJvb2xlYW47XG4gIGZyb250TWF0dGVyQ29tcGxlbWVudE1hdGNoU3RyYXRlZ3k6IHN0cmluZztcbiAgaW5zZXJ0Q29tbWFBZnRlckZyb250TWF0dGVyQ29tcGxldGlvbjogYm9vbGVhbjtcblxuICAvLyBkZWJ1Z1xuICBzaG93TG9nQWJvdXRQZXJmb3JtYW5jZUluQ29uc29sZTogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfU0VUVElOR1M6IFNldHRpbmdzID0ge1xuICAvLyBnZW5lcmFsXG4gIHN0cmF0ZWd5OiBcImRlZmF1bHRcIixcbiAgbWF0Y2hTdHJhdGVneTogXCJwcmVmaXhcIixcblxuICBtYXhOdW1iZXJPZlN1Z2dlc3Rpb25zOiA1LFxuICBtYXhOdW1iZXJPZldvcmRzQXNQaHJhc2U6IDMsXG4gIG1pbk51bWJlck9mQ2hhcmFjdGVyc1RyaWdnZXJlZDogMCxcbiAgbWluTnVtYmVyT2ZXb3Jkc1RyaWdnZXJlZFBocmFzZTogMSxcbiAgY29tcGxlbWVudEF1dG9tYXRpY2FsbHk6IHRydWUsXG4gIGRlbGF5TWlsbGlTZWNvbmRzOiAwLFxuICBkaXNhYmxlU3VnZ2VzdGlvbnNEdXJpbmdJbWVPbjogZmFsc2UsXG4gIGluc2VydEFmdGVyQ29tcGxldGlvbjogdHJ1ZSxcblxuICAvLyBhcHBlYXJhbmNlXG4gIHNob3dNYXRjaFN0cmF0ZWd5OiB0cnVlLFxuICBzaG93SW5kZXhpbmdTdGF0dXM6IHRydWUsXG4gIGRlc2NyaXB0aW9uT25TdWdnZXN0aW9uOiBcIlNob3J0XCIsXG5cbiAgLy8ga2V5IGN1c3RvbWl6YXRpb25cbiAgc2VsZWN0U3VnZ2VzdGlvbktleXM6IFwiRW50ZXJcIixcbiAgYWRkaXRpb25hbEN5Y2xlVGhyb3VnaFN1Z2dlc3Rpb25zS2V5czogXCJOb25lXCIsXG4gIG9wZW5Tb3VyY2VGaWxlS2V5OiBcIk5vbmVcIixcbiAgcHJvcGFnYXRlRXNjOiBmYWxzZSxcblxuICAvLyBjdXJyZW50IGZpbGUgY29tcGxlbWVudFxuICBlbmFibGVDdXJyZW50RmlsZUNvbXBsZW1lbnQ6IHRydWUsXG4gIG9ubHlDb21wbGVtZW50RW5nbGlzaE9uQ3VycmVudEZpbGVDb21wbGVtZW50OiBmYWxzZSxcblxuICAvLyBjdXJyZW50IHZhdWx0IGNvbXBsZW1lbnRcbiAgZW5hYmxlQ3VycmVudFZhdWx0Q29tcGxlbWVudDogZmFsc2UsXG4gIGluY2x1ZGVDdXJyZW50VmF1bHRQYXRoUHJlZml4UGF0dGVybnM6IFwiXCIsXG4gIGV4Y2x1ZGVDdXJyZW50VmF1bHRQYXRoUHJlZml4UGF0dGVybnM6IFwiXCIsXG4gIGluY2x1ZGVDdXJyZW50VmF1bHRPbmx5RmlsZXNVbmRlckN1cnJlbnREaXJlY3Rvcnk6IGZhbHNlLFxuXG4gIC8vIGN1c3RvbSBkaWN0aW9uYXJ5IGNvbXBsZW1lbnRcbiAgZW5hYmxlQ3VzdG9tRGljdGlvbmFyeUNvbXBsZW1lbnQ6IGZhbHNlLFxuICBjdXN0b21EaWN0aW9uYXJ5UGF0aHM6IGBodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vZmlyc3QyMGhvdXJzL2dvb2dsZS0xMDAwMC1lbmdsaXNoL21hc3Rlci9nb29nbGUtMTAwMDAtZW5nbGlzaC1uby1zd2VhcnMudHh0YCxcbiAgY29sdW1uRGVsaW1pdGVyOiBcIlRhYlwiLFxuICBjdXN0b21EaWN0aW9uYXJ5V29yZFJlZ2V4UGF0dGVybjogXCJcIixcbiAgZGVsaW1pdGVyVG9IaWRlU3VnZ2VzdGlvbjogXCJcIixcbiAgY2FyZXRMb2NhdGlvblN5bWJvbEFmdGVyQ29tcGxlbWVudDogXCJcIixcblxuICAvLyBpbnRlcm5hbCBsaW5rIGNvbXBsZW1lbnRcbiAgZW5hYmxlSW50ZXJuYWxMaW5rQ29tcGxlbWVudDogdHJ1ZSxcbiAgc3VnZ2VzdEludGVybmFsTGlua1dpdGhBbGlhczogZmFsc2UsXG5cbiAgLy8gZnJvbnQgbWF0dGVyIGNvbXBsZW1lbnRcbiAgZW5hYmxlRnJvbnRNYXR0ZXJDb21wbGVtZW50OiB0cnVlLFxuICBmcm9udE1hdHRlckNvbXBsZW1lbnRNYXRjaFN0cmF0ZWd5OiBcImluaGVyaXRcIixcbiAgaW5zZXJ0Q29tbWFBZnRlckZyb250TWF0dGVyQ29tcGxldGlvbjogZmFsc2UsXG5cbiAgLy8gZGVidWdcbiAgc2hvd0xvZ0Fib3V0UGVyZm9ybWFuY2VJbkNvbnNvbGU6IGZhbHNlLFxufTtcblxuZXhwb3J0IGNsYXNzIFZhcmlvdXNDb21wbGVtZW50c1NldHRpbmdUYWIgZXh0ZW5kcyBQbHVnaW5TZXR0aW5nVGFiIHtcbiAgcGx1Z2luOiBWYXJpb3VzQ29tcG9uZW50cztcblxuICBjb25zdHJ1Y3RvcihhcHA6IEFwcCwgcGx1Z2luOiBWYXJpb3VzQ29tcG9uZW50cykge1xuICAgIHN1cGVyKGFwcCwgcGx1Z2luKTtcbiAgICB0aGlzLnBsdWdpbiA9IHBsdWdpbjtcbiAgfVxuXG4gIGRpc3BsYXkoKTogdm9pZCB7XG4gICAgbGV0IHsgY29udGFpbmVyRWwgfSA9IHRoaXM7XG5cbiAgICBjb250YWluZXJFbC5lbXB0eSgpO1xuXG4gICAgY29udGFpbmVyRWwuY3JlYXRlRWwoXCJoMlwiLCB7IHRleHQ6IFwiVmFyaW91cyBDb21wbGVtZW50cyAtIFNldHRpbmdzXCIgfSk7XG5cbiAgICBjb250YWluZXJFbC5jcmVhdGVFbChcImgzXCIsIHsgdGV4dDogXCJNYWluXCIgfSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbCkuc2V0TmFtZShcIlN0cmF0ZWd5XCIpLmFkZERyb3Bkb3duKCh0YykgPT5cbiAgICAgIHRjXG4gICAgICAgIC5hZGRPcHRpb25zKFxuICAgICAgICAgIFRva2VuaXplU3RyYXRlZ3kudmFsdWVzKCkucmVkdWNlKFxuICAgICAgICAgICAgKHAsIGMpID0+ICh7IC4uLnAsIFtjLm5hbWVdOiBjLm5hbWUgfSksXG4gICAgICAgICAgICB7fVxuICAgICAgICAgIClcbiAgICAgICAgKVxuICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3Muc3RyYXRlZ3kpXG4gICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5zdHJhdGVneSA9IHZhbHVlO1xuICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncyh7XG4gICAgICAgICAgICBjdXJyZW50RmlsZTogdHJ1ZSxcbiAgICAgICAgICAgIGN1cnJlbnRWYXVsdDogdHJ1ZSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSlcbiAgICApO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpLnNldE5hbWUoXCJNYXRjaCBzdHJhdGVneVwiKS5hZGREcm9wZG93bigodGMpID0+XG4gICAgICB0Y1xuICAgICAgICAuYWRkT3B0aW9ucyhcbiAgICAgICAgICBNYXRjaFN0cmF0ZWd5LnZhbHVlcygpLnJlZHVjZShcbiAgICAgICAgICAgIChwLCBjKSA9PiAoeyAuLi5wLCBbYy5uYW1lXTogYy5uYW1lIH0pLFxuICAgICAgICAgICAge31cbiAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLm1hdGNoU3RyYXRlZ3kpXG4gICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5tYXRjaFN0cmF0ZWd5ID0gdmFsdWU7XG4gICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgIH0pXG4gICAgKTtcbiAgICBpZiAodGhpcy5wbHVnaW4uc2V0dGluZ3MubWF0Y2hTdHJhdGVneSA9PT0gTWF0Y2hTdHJhdGVneS5QQVJUSUFMLm5hbWUpIHtcbiAgICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKFwiZGl2XCIsIHtcbiAgICAgICAgdGV4dDogXCLimqAgYHBhcnRpYWxgIGlzIG1vcmUgdGhhbiAxMCB0aW1lcyBzbG93ZXIgdGhhbiBgcHJlZml4YFwiLFxuICAgICAgICBjbHM6IFwidmFyaW91cy1jb21wbGVtZW50c19fc2V0dGluZ3NfX3dhcm5pbmdcIixcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJNYXggbnVtYmVyIG9mIHN1Z2dlc3Rpb25zXCIpXG4gICAgICAuYWRkU2xpZGVyKChzYykgPT5cbiAgICAgICAgc2NcbiAgICAgICAgICAuc2V0TGltaXRzKDEsIDI1NSwgMSlcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MubWF4TnVtYmVyT2ZTdWdnZXN0aW9ucylcbiAgICAgICAgICAuc2V0RHluYW1pY1Rvb2x0aXAoKVxuICAgICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLm1heE51bWJlck9mU3VnZ2VzdGlvbnMgPSB2YWx1ZTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgIH0pXG4gICAgICApO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIk1heCBudW1iZXIgb2Ygd29yZHMgYXMgYSBwaHJhc2VcIilcbiAgICAgIC5zZXREZXNjKGBb4pqgV2FybmluZ10gSXQgbWFrZXMgc2xvd2VyIG1vcmUgdGhhbiBOIHRpbWVzIChOIGlzIHNldCB2YWx1ZSlgKVxuICAgICAgLmFkZFNsaWRlcigoc2MpID0+XG4gICAgICAgIHNjXG4gICAgICAgICAgLnNldExpbWl0cygxLCAxMCwgMSlcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MubWF4TnVtYmVyT2ZXb3Jkc0FzUGhyYXNlKVxuICAgICAgICAgIC5zZXREeW5hbWljVG9vbHRpcCgpXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MubWF4TnVtYmVyT2ZXb3Jkc0FzUGhyYXNlID0gdmFsdWU7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICB9KVxuICAgICAgKTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJNaW4gbnVtYmVyIG9mIGNoYXJhY3RlcnMgZm9yIHRyaWdnZXJcIilcbiAgICAgIC5zZXREZXNjKFwiSXQgdXNlcyBhIGRlZmF1bHQgdmFsdWUgb2YgU3RyYXRlZ3kgaWYgc2V0IDAuXCIpXG4gICAgICAuYWRkU2xpZGVyKChzYykgPT5cbiAgICAgICAgc2NcbiAgICAgICAgICAuc2V0TGltaXRzKDAsIDEwLCAxKVxuICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5taW5OdW1iZXJPZkNoYXJhY3RlcnNUcmlnZ2VyZWQpXG4gICAgICAgICAgLnNldER5bmFtaWNUb29sdGlwKClcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5taW5OdW1iZXJPZkNoYXJhY3RlcnNUcmlnZ2VyZWQgPSB2YWx1ZTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgIH0pXG4gICAgICApO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIk1pbiBudW1iZXIgb2Ygd29yZHMgZm9yIHRyaWdnZXJcIilcbiAgICAgIC5hZGRTbGlkZXIoKHNjKSA9PlxuICAgICAgICBzY1xuICAgICAgICAgIC5zZXRMaW1pdHMoMSwgMTAsIDEpXG4gICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLm1pbk51bWJlck9mV29yZHNUcmlnZ2VyZWRQaHJhc2UpXG4gICAgICAgICAgLnNldER5bmFtaWNUb29sdGlwKClcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5taW5OdW1iZXJPZldvcmRzVHJpZ2dlcmVkUGhyYXNlID0gdmFsdWU7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICB9KVxuICAgICAgKTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJDb21wbGVtZW50IGF1dG9tYXRpY2FsbHlcIilcbiAgICAgIC5hZGRUb2dnbGUoKHRjKSA9PiB7XG4gICAgICAgIHRjLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLmNvbXBsZW1lbnRBdXRvbWF0aWNhbGx5KS5vbkNoYW5nZShcbiAgICAgICAgICBhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmNvbXBsZW1lbnRBdXRvbWF0aWNhbGx5ID0gdmFsdWU7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgICB9KTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJEZWxheSBtaWxsaS1zZWNvbmRzIGZvciB0cmlnZ2VyXCIpXG4gICAgICAuYWRkU2xpZGVyKChzYykgPT5cbiAgICAgICAgc2NcbiAgICAgICAgICAuc2V0TGltaXRzKDAsIDEwMDAsIDEwKVxuICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5kZWxheU1pbGxpU2Vjb25kcylcbiAgICAgICAgICAuc2V0RHluYW1pY1Rvb2x0aXAoKVxuICAgICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmRlbGF5TWlsbGlTZWNvbmRzID0gdmFsdWU7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICB9KVxuICAgICAgKTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJEaXNhYmxlIHN1Z2dlc3Rpb25zIGR1cmluZyBJTUUgb25cIilcbiAgICAgIC5hZGRUb2dnbGUoKHRjKSA9PiB7XG4gICAgICAgIHRjLnNldFZhbHVlKFxuICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmRpc2FibGVTdWdnZXN0aW9uc0R1cmluZ0ltZU9uXG4gICAgICAgICkub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuZGlzYWJsZVN1Z2dlc3Rpb25zRHVyaW5nSW1lT24gPSB2YWx1ZTtcbiAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJJbnNlcnQgc3BhY2UgYWZ0ZXIgY29tcGxldGlvblwiKVxuICAgICAgLmFkZFRvZ2dsZSgodGMpID0+IHtcbiAgICAgICAgdGMuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MuaW5zZXJ0QWZ0ZXJDb21wbGV0aW9uKS5vbkNoYW5nZShcbiAgICAgICAgICBhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmluc2VydEFmdGVyQ29tcGxldGlvbiA9IHZhbHVlO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgfSk7XG5cbiAgICBjb250YWluZXJFbC5jcmVhdGVFbChcImgzXCIsIHsgdGV4dDogXCJBcHBlYXJhbmNlXCIgfSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiU2hvdyBNYXRjaCBzdHJhdGVneVwiKVxuICAgICAgLnNldERlc2MoXG4gICAgICAgIFwiU2hvdyBNYXRjaCBzdHJhdGVneSBhdCB0aGUgc3RhdHVzIGJhci4gQ2hhbmdpbmcgdGhpcyBvcHRpb24gcmVxdWlyZXMgYSByZXN0YXJ0IHRvIHRha2UgZWZmZWN0LlwiXG4gICAgICApXG4gICAgICAuYWRkVG9nZ2xlKCh0YykgPT4ge1xuICAgICAgICB0Yy5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5zaG93TWF0Y2hTdHJhdGVneSkub25DaGFuZ2UoXG4gICAgICAgICAgYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5zaG93TWF0Y2hTdHJhdGVneSA9IHZhbHVlO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgfSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiU2hvdyBJbmRleGluZyBzdGF0dXNcIilcbiAgICAgIC5zZXREZXNjKFxuICAgICAgICBcIlNob3cgaW5kZXhpbmcgc3RhdHVzIGF0IHRoZSBzdGF0dXMgYmFyLiBDaGFuZ2luZyB0aGlzIG9wdGlvbiByZXF1aXJlcyBhIHJlc3RhcnQgdG8gdGFrZSBlZmZlY3QuXCJcbiAgICAgIClcbiAgICAgIC5hZGRUb2dnbGUoKHRjKSA9PiB7XG4gICAgICAgIHRjLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnNob3dJbmRleGluZ1N0YXR1cykub25DaGFuZ2UoXG4gICAgICAgICAgYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5zaG93SW5kZXhpbmdTdGF0dXMgPSB2YWx1ZTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgIH0pO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIkRlc2NyaXB0aW9uIG9uIGEgc3VnZ2VzdGlvblwiKVxuICAgICAgLmFkZERyb3Bkb3duKCh0YykgPT5cbiAgICAgICAgdGNcbiAgICAgICAgICAuYWRkT3B0aW9ucyhcbiAgICAgICAgICAgIG1pcnJvck1hcChEZXNjcmlwdGlvbk9uU3VnZ2VzdGlvbi52YWx1ZXMoKSwgKHgpID0+IHgubmFtZSlcbiAgICAgICAgICApXG4gICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLmRlc2NyaXB0aW9uT25TdWdnZXN0aW9uKVxuICAgICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmRlc2NyaXB0aW9uT25TdWdnZXN0aW9uID0gdmFsdWU7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICB9KVxuICAgICAgKTtcblxuICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKFwiaDNcIiwgeyB0ZXh0OiBcIktleSBjdXN0b21pemF0aW9uXCIgfSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiU2VsZWN0IGEgc3VnZ2VzdGlvbiBrZXlcIilcbiAgICAgIC5hZGREcm9wZG93bigodGMpID0+XG4gICAgICAgIHRjXG4gICAgICAgICAgLmFkZE9wdGlvbnMobWlycm9yTWFwKFNlbGVjdFN1Z2dlc3Rpb25LZXkudmFsdWVzKCksICh4KSA9PiB4Lm5hbWUpKVxuICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5zZWxlY3RTdWdnZXN0aW9uS2V5cylcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5zZWxlY3RTdWdnZXN0aW9uS2V5cyA9IHZhbHVlO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgfSlcbiAgICAgICk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiQWRkaXRpb25hbCBjeWNsZSB0aHJvdWdoIHN1Z2dlc3Rpb25zIGtleXNcIilcbiAgICAgIC5hZGREcm9wZG93bigodGMpID0+XG4gICAgICAgIHRjXG4gICAgICAgICAgLmFkZE9wdGlvbnMoXG4gICAgICAgICAgICBDeWNsZVRocm91Z2hTdWdnZXN0aW9uc0tleXMudmFsdWVzKCkucmVkdWNlKFxuICAgICAgICAgICAgICAocCwgYykgPT4gKHsgLi4ucCwgW2MubmFtZV06IGMubmFtZSB9KSxcbiAgICAgICAgICAgICAge31cbiAgICAgICAgICAgIClcbiAgICAgICAgICApXG4gICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLmFkZGl0aW9uYWxDeWNsZVRocm91Z2hTdWdnZXN0aW9uc0tleXMpXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuYWRkaXRpb25hbEN5Y2xlVGhyb3VnaFN1Z2dlc3Rpb25zS2V5cyA9IHZhbHVlO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgfSlcbiAgICAgICk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbCkuc2V0TmFtZShcIk9wZW4gc291cmNlIGZpbGUga2V5XCIpLmFkZERyb3Bkb3duKCh0YykgPT5cbiAgICAgIHRjXG4gICAgICAgIC5hZGRPcHRpb25zKG1pcnJvck1hcChPcGVuU291cmNlRmlsZUtleXMudmFsdWVzKCksICh4KSA9PiB4Lm5hbWUpKVxuICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3Mub3BlblNvdXJjZUZpbGVLZXkpXG4gICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5vcGVuU291cmNlRmlsZUtleSA9IHZhbHVlO1xuICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICB9KVxuICAgICk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiUHJvcGFnYXRlIEVTQ1wiKVxuICAgICAgLnNldERlc2MoXG4gICAgICAgIFwiSXQgaXMgaGFuZHkgaWYgeW91IHVzZSBWaW0gbW9kZSBiZWNhdXNlIHlvdSBjYW4gc3dpdGNoIHRvIE5vcm1hbCBtb2RlIGJ5IG9uZSBFU0MsIHdoZXRoZXIgaXQgc2hvd3Mgc3VnZ2VzdGlvbnMgb3Igbm90LlwiXG4gICAgICApXG4gICAgICAuYWRkVG9nZ2xlKCh0YykgPT4ge1xuICAgICAgICB0Yy5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5wcm9wYWdhdGVFc2MpLm9uQ2hhbmdlKFxuICAgICAgICAgIGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MucHJvcGFnYXRlRXNjID0gdmFsdWU7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgICB9KTtcblxuICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKFwiaDNcIiwge1xuICAgICAgdGV4dDogXCJDdXJyZW50IGZpbGUgY29tcGxlbWVudFwiLFxuICAgICAgY2xzOiBcInZhcmlvdXMtY29tcGxlbWVudHNfX3NldHRpbmdzX19oZWFkZXIgdmFyaW91cy1jb21wbGVtZW50c19fc2V0dGluZ3NfX2hlYWRlcl9fY3VycmVudC1maWxlXCIsXG4gICAgfSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiRW5hYmxlIEN1cnJlbnQgZmlsZSBjb21wbGVtZW50XCIpXG4gICAgICAuYWRkVG9nZ2xlKCh0YykgPT4ge1xuICAgICAgICB0Yy5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5lbmFibGVDdXJyZW50RmlsZUNvbXBsZW1lbnQpLm9uQ2hhbmdlKFxuICAgICAgICAgIGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuZW5hYmxlQ3VycmVudEZpbGVDb21wbGVtZW50ID0gdmFsdWU7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoeyBjdXJyZW50RmlsZTogdHJ1ZSB9KTtcbiAgICAgICAgICAgIHRoaXMuZGlzcGxheSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgIH0pO1xuXG4gICAgaWYgKHRoaXMucGx1Z2luLnNldHRpbmdzLmVuYWJsZUN1cnJlbnRGaWxlQ29tcGxlbWVudCkge1xuICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAgIC5zZXROYW1lKFwiT25seSBjb21wbGVtZW50IEVuZ2xpc2ggb24gY3VycmVudCBmaWxlIGNvbXBsZW1lbnRcIilcbiAgICAgICAgLmFkZFRvZ2dsZSgodGMpID0+IHtcbiAgICAgICAgICB0Yy5zZXRWYWx1ZShcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLm9ubHlDb21wbGVtZW50RW5nbGlzaE9uQ3VycmVudEZpbGVDb21wbGVtZW50XG4gICAgICAgICAgKS5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLm9ubHlDb21wbGVtZW50RW5nbGlzaE9uQ3VycmVudEZpbGVDb21wbGVtZW50ID1cbiAgICAgICAgICAgICAgdmFsdWU7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoeyBjdXJyZW50RmlsZTogdHJ1ZSB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29udGFpbmVyRWwuY3JlYXRlRWwoXCJoM1wiLCB7XG4gICAgICB0ZXh0OiBcIkN1cnJlbnQgdmF1bHQgY29tcGxlbWVudFwiLFxuICAgICAgY2xzOiBcInZhcmlvdXMtY29tcGxlbWVudHNfX3NldHRpbmdzX19oZWFkZXIgdmFyaW91cy1jb21wbGVtZW50c19fc2V0dGluZ3NfX2hlYWRlcl9fY3VycmVudC12YXVsdFwiLFxuICAgIH0pO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIkVuYWJsZSBDdXJyZW50IHZhdWx0IGNvbXBsZW1lbnRcIilcbiAgICAgIC5hZGRUb2dnbGUoKHRjKSA9PiB7XG4gICAgICAgIHRjLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLmVuYWJsZUN1cnJlbnRWYXVsdENvbXBsZW1lbnQpLm9uQ2hhbmdlKFxuICAgICAgICAgIGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuZW5hYmxlQ3VycmVudFZhdWx0Q29tcGxlbWVudCA9IHZhbHVlO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKHsgY3VycmVudFZhdWx0OiB0cnVlIH0pO1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgfSk7XG5cbiAgICBpZiAodGhpcy5wbHVnaW4uc2V0dGluZ3MuZW5hYmxlQ3VycmVudFZhdWx0Q29tcGxlbWVudCkge1xuICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAgIC5zZXROYW1lKFwiSW5jbHVkZSBwcmVmaXggcGF0aCBwYXR0ZXJuc1wiKVxuICAgICAgICAuc2V0RGVzYyhcIlByZWZpeCBtYXRjaCBwYXRoIHBhdHRlcm5zIHRvIGluY2x1ZGUgZmlsZXMuXCIpXG4gICAgICAgIC5hZGRUZXh0QXJlYSgodGFjKSA9PiB7XG4gICAgICAgICAgY29uc3QgZWwgPSB0YWNcbiAgICAgICAgICAgIC5zZXRWYWx1ZShcbiAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuaW5jbHVkZUN1cnJlbnRWYXVsdFBhdGhQcmVmaXhQYXR0ZXJuc1xuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLnNldFBsYWNlaG9sZGVyKFwiUHJpdmF0ZS9cIilcbiAgICAgICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuaW5jbHVkZUN1cnJlbnRWYXVsdFBhdGhQcmVmaXhQYXR0ZXJucyA9XG4gICAgICAgICAgICAgICAgdmFsdWU7XG4gICAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgZWwuaW5wdXRFbC5jbGFzc05hbWUgPVxuICAgICAgICAgICAgXCJ2YXJpb3VzLWNvbXBsZW1lbnRzX19zZXR0aW5nc19fdGV4dC1hcmVhLXBhdGhcIjtcbiAgICAgICAgICByZXR1cm4gZWw7XG4gICAgICAgIH0pO1xuICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAgIC5zZXROYW1lKFwiRXhjbHVkZSBwcmVmaXggcGF0aCBwYXR0ZXJuc1wiKVxuICAgICAgICAuc2V0RGVzYyhcIlByZWZpeCBtYXRjaCBwYXRoIHBhdHRlcm5zIHRvIGV4Y2x1ZGUgZmlsZXMuXCIpXG4gICAgICAgIC5hZGRUZXh0QXJlYSgodGFjKSA9PiB7XG4gICAgICAgICAgY29uc3QgZWwgPSB0YWNcbiAgICAgICAgICAgIC5zZXRWYWx1ZShcbiAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuZXhjbHVkZUN1cnJlbnRWYXVsdFBhdGhQcmVmaXhQYXR0ZXJuc1xuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLnNldFBsYWNlaG9sZGVyKFwiUHJpdmF0ZS9cIilcbiAgICAgICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuZXhjbHVkZUN1cnJlbnRWYXVsdFBhdGhQcmVmaXhQYXR0ZXJucyA9XG4gICAgICAgICAgICAgICAgdmFsdWU7XG4gICAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgZWwuaW5wdXRFbC5jbGFzc05hbWUgPVxuICAgICAgICAgICAgXCJ2YXJpb3VzLWNvbXBsZW1lbnRzX19zZXR0aW5nc19fdGV4dC1hcmVhLXBhdGhcIjtcbiAgICAgICAgICByZXR1cm4gZWw7XG4gICAgICAgIH0pO1xuICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAgIC5zZXROYW1lKFwiSW5jbHVkZSBvbmx5IGZpbGVzIHVuZGVyIGN1cnJlbnQgZGlyZWN0b3J5XCIpXG4gICAgICAgIC5hZGRUb2dnbGUoKHRjKSA9PiB7XG4gICAgICAgICAgdGMuc2V0VmFsdWUoXG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5nc1xuICAgICAgICAgICAgICAuaW5jbHVkZUN1cnJlbnRWYXVsdE9ubHlGaWxlc1VuZGVyQ3VycmVudERpcmVjdG9yeVxuICAgICAgICAgICkub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5pbmNsdWRlQ3VycmVudFZhdWx0T25seUZpbGVzVW5kZXJDdXJyZW50RGlyZWN0b3J5ID1cbiAgICAgICAgICAgICAgdmFsdWU7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29udGFpbmVyRWwuY3JlYXRlRWwoXCJoM1wiLCB7XG4gICAgICB0ZXh0OiBcIkN1c3RvbSBkaWN0aW9uYXJ5IGNvbXBsZW1lbnRcIixcbiAgICAgIGNsczogXCJ2YXJpb3VzLWNvbXBsZW1lbnRzX19zZXR0aW5nc19faGVhZGVyIHZhcmlvdXMtY29tcGxlbWVudHNfX3NldHRpbmdzX19oZWFkZXJfX2N1c3RvbS1kaWN0aW9uYXJ5XCIsXG4gICAgfSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiRW5hYmxlIEN1c3RvbSBkaWN0aW9uYXJ5IGNvbXBsZW1lbnRcIilcbiAgICAgIC5hZGRUb2dnbGUoKHRjKSA9PiB7XG4gICAgICAgIHRjLnNldFZhbHVlKFxuICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmVuYWJsZUN1c3RvbURpY3Rpb25hcnlDb21wbGVtZW50XG4gICAgICAgICkub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuZW5hYmxlQ3VzdG9tRGljdGlvbmFyeUNvbXBsZW1lbnQgPSB2YWx1ZTtcbiAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoeyBjdXN0b21EaWN0aW9uYXJ5OiB0cnVlIH0pO1xuICAgICAgICAgIHRoaXMuZGlzcGxheSgpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgaWYgKHRoaXMucGx1Z2luLnNldHRpbmdzLmVuYWJsZUN1c3RvbURpY3Rpb25hcnlDb21wbGVtZW50KSB7XG4gICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgLnNldE5hbWUoXCJDdXN0b20gZGljdGlvbmFyeSBwYXRoc1wiKVxuICAgICAgICAuc2V0RGVzYyhcbiAgICAgICAgICBcIlNwZWNpZnkgZWl0aGVyIGEgcmVsYXRpdmUgcGF0aCBmcm9tIFZhdWx0IHJvb3Qgb3IgVVJMIGZvciBlYWNoIGxpbmUuXCJcbiAgICAgICAgKVxuICAgICAgICAuYWRkVGV4dEFyZWEoKHRhYykgPT4ge1xuICAgICAgICAgIGNvbnN0IGVsID0gdGFjXG4gICAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MuY3VzdG9tRGljdGlvbmFyeVBhdGhzKVxuICAgICAgICAgICAgLnNldFBsYWNlaG9sZGVyKFwiZGljdGlvbmFyeS5tZFwiKVxuICAgICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5jdXN0b21EaWN0aW9uYXJ5UGF0aHMgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICBlbC5pbnB1dEVsLmNsYXNzTmFtZSA9XG4gICAgICAgICAgICBcInZhcmlvdXMtY29tcGxlbWVudHNfX3NldHRpbmdzX190ZXh0LWFyZWEtcGF0aFwiO1xuICAgICAgICAgIHJldHVybiBlbDtcbiAgICAgICAgfSk7XG5cbiAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKS5zZXROYW1lKFwiQ29sdW1uIGRlbGltaXRlclwiKS5hZGREcm9wZG93bigodGMpID0+XG4gICAgICAgIHRjXG4gICAgICAgICAgLmFkZE9wdGlvbnMoXG4gICAgICAgICAgICBDb2x1bW5EZWxpbWl0ZXIudmFsdWVzKCkucmVkdWNlKFxuICAgICAgICAgICAgICAocCwgYykgPT4gKHsgLi4ucCwgW2MubmFtZV06IGMubmFtZSB9KSxcbiAgICAgICAgICAgICAge31cbiAgICAgICAgICAgIClcbiAgICAgICAgICApXG4gICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLmNvbHVtbkRlbGltaXRlcilcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5jb2x1bW5EZWxpbWl0ZXIgPSB2YWx1ZTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgIH0pXG4gICAgICApO1xuXG4gICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgLnNldE5hbWUoXCJXb3JkIHJlZ2V4IHBhdHRlcm5cIilcbiAgICAgICAgLnNldERlc2MoXCJPbmx5IGxvYWQgd29yZHMgdGhhdCBtYXRjaCB0aGUgcmVndWxhciBleHByZXNzaW9uIHBhdHRlcm4uXCIpXG4gICAgICAgIC5hZGRUZXh0KChjYikgPT4ge1xuICAgICAgICAgIGNiLnNldFZhbHVlKFxuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuY3VzdG9tRGljdGlvbmFyeVdvcmRSZWdleFBhdHRlcm5cbiAgICAgICAgICApLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuY3VzdG9tRGljdGlvbmFyeVdvcmRSZWdleFBhdHRlcm4gPSB2YWx1ZTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAgIC5zZXROYW1lKFwiRGVsaW1pdGVyIHRvIGhpZGUgYSBzdWdnZXN0aW9uXCIpXG4gICAgICAgIC5zZXREZXNjKFxuICAgICAgICAgIFwiSWYgc2V0ICc7OzsnLCAnYWJjZDs7O2VmZycgaXMgc2hvd24gYXMgJ2FiY2QnIG9uIHN1Z2dlc3Rpb25zLCBidXQgY29tcGxlbWVudHMgdG8gJ2FiY2RlZmcnLlwiXG4gICAgICAgIClcbiAgICAgICAgLmFkZFRleHQoKGNiKSA9PiB7XG4gICAgICAgICAgY2Iuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MuZGVsaW1pdGVyVG9IaWRlU3VnZ2VzdGlvbikub25DaGFuZ2UoXG4gICAgICAgICAgICBhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuZGVsaW1pdGVyVG9IaWRlU3VnZ2VzdGlvbiA9IHZhbHVlO1xuICAgICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICApO1xuICAgICAgICB9KTtcblxuICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAgIC5zZXROYW1lKFwiQ2FyZXQgbG9jYXRpb24gc3ltYm9sIGFmdGVyIGNvbXBsZW1lbnRcIilcbiAgICAgICAgLnNldERlc2MoXG4gICAgICAgICAgXCJJZiBzZXQgJzxDQVJFVD4nIGFuZCB0aGVyZSBpcyAnPGxpPjxDQVJFVD48L2xpPicgaW4gY3VzdG9tIGRpY3Rpb25hcnksIGl0IGNvbXBsZW1lbnRzICc8bGk+PC9saT4nIGFuZCBtb3ZlIGEgY2FyZXQgd2hlcmUgYmV0d2VlbiAnPGxpPicgYW5kIGA8L2xpPmAuXCJcbiAgICAgICAgKVxuICAgICAgICAuYWRkVGV4dCgoY2IpID0+IHtcbiAgICAgICAgICBjYi5zZXRWYWx1ZShcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmNhcmV0TG9jYXRpb25TeW1ib2xBZnRlckNvbXBsZW1lbnRcbiAgICAgICAgICApLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuY2FyZXRMb2NhdGlvblN5bWJvbEFmdGVyQ29tcGxlbWVudCA9IHZhbHVlO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKFwiaDNcIiwge1xuICAgICAgdGV4dDogXCJJbnRlcm5hbCBsaW5rIGNvbXBsZW1lbnRcIixcbiAgICAgIGNsczogXCJ2YXJpb3VzLWNvbXBsZW1lbnRzX19zZXR0aW5nc19faGVhZGVyIHZhcmlvdXMtY29tcGxlbWVudHNfX3NldHRpbmdzX19oZWFkZXJfX2ludGVybmFsLWxpbmtcIixcbiAgICB9KTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJFbmFibGUgSW50ZXJuYWwgbGluayBjb21wbGVtZW50XCIpXG4gICAgICAuYWRkVG9nZ2xlKCh0YykgPT4ge1xuICAgICAgICB0Yy5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5lbmFibGVJbnRlcm5hbExpbmtDb21wbGVtZW50KS5vbkNoYW5nZShcbiAgICAgICAgICBhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmVuYWJsZUludGVybmFsTGlua0NvbXBsZW1lbnQgPSB2YWx1ZTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncyh7IGludGVybmFsTGluazogdHJ1ZSB9KTtcbiAgICAgICAgICAgIHRoaXMuZGlzcGxheSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgIH0pO1xuXG4gICAgaWYgKHRoaXMucGx1Z2luLnNldHRpbmdzLmVuYWJsZUludGVybmFsTGlua0NvbXBsZW1lbnQpIHtcbiAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAuc2V0TmFtZShcIlN1Z2dlc3Qgd2l0aCBhbiBhbGlhc1wiKVxuICAgICAgICAuYWRkVG9nZ2xlKCh0YykgPT4ge1xuICAgICAgICAgIHRjLnNldFZhbHVlKFxuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3Muc3VnZ2VzdEludGVybmFsTGlua1dpdGhBbGlhc1xuICAgICAgICAgICkub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5zdWdnZXN0SW50ZXJuYWxMaW5rV2l0aEFsaWFzID0gdmFsdWU7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoeyBpbnRlcm5hbExpbms6IHRydWUgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKFwiaDNcIiwge1xuICAgICAgdGV4dDogXCJGcm9udCBtYXR0ZXIgY29tcGxlbWVudFwiLFxuICAgICAgY2xzOiBcInZhcmlvdXMtY29tcGxlbWVudHNfX3NldHRpbmdzX19oZWFkZXIgdmFyaW91cy1jb21wbGVtZW50c19fc2V0dGluZ3NfX2hlYWRlcl9fZnJvbnQtbWF0dGVyXCIsXG4gICAgfSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiRW5hYmxlIEZyb250IG1hdHRlciBjb21wbGVtZW50XCIpXG4gICAgICAuYWRkVG9nZ2xlKCh0YykgPT4ge1xuICAgICAgICB0Yy5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5lbmFibGVGcm9udE1hdHRlckNvbXBsZW1lbnQpLm9uQ2hhbmdlKFxuICAgICAgICAgIGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuZW5hYmxlRnJvbnRNYXR0ZXJDb21wbGVtZW50ID0gdmFsdWU7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoeyBmcm9udE1hdHRlcjogdHJ1ZSB9KTtcbiAgICAgICAgICAgIHRoaXMuZGlzcGxheSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgIH0pO1xuXG4gICAgaWYgKHRoaXMucGx1Z2luLnNldHRpbmdzLmVuYWJsZUZyb250TWF0dGVyQ29tcGxlbWVudCkge1xuICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAgIC5zZXROYW1lKFwiTWF0Y2ggc3RyYXRlZ3kgaW4gdGhlIGZyb250IG1hdHRlclwiKVxuICAgICAgICAuYWRkRHJvcGRvd24oKHRjKSA9PlxuICAgICAgICAgIHRjXG4gICAgICAgICAgICAuYWRkT3B0aW9ucyhcbiAgICAgICAgICAgICAgbWlycm9yTWFwKFNwZWNpZmljTWF0Y2hTdHJhdGVneS52YWx1ZXMoKSwgKHgpID0+IHgubmFtZSlcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5mcm9udE1hdHRlckNvbXBsZW1lbnRNYXRjaFN0cmF0ZWd5KVxuICAgICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5mcm9udE1hdHRlckNvbXBsZW1lbnRNYXRjaFN0cmF0ZWd5ID0gdmFsdWU7XG4gICAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgKTtcblxuICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAgIC5zZXROYW1lKFwiSW5zZXJ0IGNvbW1hIGFmdGVyIGNvbXBsZXRpb25cIilcbiAgICAgICAgLmFkZFRvZ2dsZSgodGMpID0+IHtcbiAgICAgICAgICB0Yy5zZXRWYWx1ZShcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmluc2VydENvbW1hQWZ0ZXJGcm9udE1hdHRlckNvbXBsZXRpb25cbiAgICAgICAgICApLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuaW5zZXJ0Q29tbWFBZnRlckZyb250TWF0dGVyQ29tcGxldGlvbiA9IHZhbHVlO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKFwiaDNcIiwgeyB0ZXh0OiBcIkRlYnVnXCIgfSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiU2hvdyBsb2cgYWJvdXQgcGVyZm9ybWFuY2UgaW4gYSBjb25zb2xlXCIpXG4gICAgICAuYWRkVG9nZ2xlKCh0YykgPT4ge1xuICAgICAgICB0Yy5zZXRWYWx1ZShcbiAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5zaG93TG9nQWJvdXRQZXJmb3JtYW5jZUluQ29uc29sZVxuICAgICAgICApLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnNob3dMb2dBYm91dFBlcmZvcm1hbmNlSW5Db25zb2xlID0gdmFsdWU7XG4gICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gIH1cblxuICBhc3luYyB0b2dnbGVNYXRjaFN0cmF0ZWd5KCkge1xuICAgIHN3aXRjaCAodGhpcy5wbHVnaW4uc2V0dGluZ3MubWF0Y2hTdHJhdGVneSkge1xuICAgICAgY2FzZSBcInByZWZpeFwiOlxuICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5tYXRjaFN0cmF0ZWd5ID0gXCJwYXJ0aWFsXCI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcInBhcnRpYWxcIjpcbiAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MubWF0Y2hTdHJhdGVneSA9IFwicHJlZml4XCI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgLy8gbm9pbnNwZWN0aW9uIE9iamVjdEFsbG9jYXRpb25JZ25vcmVkXG4gICAgICAgIG5ldyBOb3RpY2UoXCLimqBVbmV4cGVjdGVkIGVycm9yXCIpO1xuICAgIH1cbiAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgfVxuXG4gIGFzeW5jIHRvZ2dsZUNvbXBsZW1lbnRBdXRvbWF0aWNhbGx5KCkge1xuICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmNvbXBsZW1lbnRBdXRvbWF0aWNhbGx5ID1cbiAgICAgICF0aGlzLnBsdWdpbi5zZXR0aW5ncy5jb21wbGVtZW50QXV0b21hdGljYWxseTtcbiAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgfVxuXG4gIGdldFBsdWdpblNldHRpbmdzQXNKc29uU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KFxuICAgICAge1xuICAgICAgICB2ZXJzaW9uOiB0aGlzLnBsdWdpbi5tYW5pZmVzdC52ZXJzaW9uLFxuICAgICAgICBtb2JpbGU6ICh0aGlzLmFwcCBhcyBhbnkpLmlzTW9iaWxlLFxuICAgICAgICBzZXR0aW5nczogdGhpcy5wbHVnaW4uc2V0dGluZ3MsXG4gICAgICB9LFxuICAgICAgbnVsbCxcbiAgICAgIDRcbiAgICApO1xuICB9XG59XG4iLCJpbXBvcnQge1xuICBBcHAsXG4gIEJ1dHRvbkNvbXBvbmVudCxcbiAgRHJvcGRvd25Db21wb25lbnQsXG4gIEV4dHJhQnV0dG9uQ29tcG9uZW50LFxuICBNb2RhbCxcbiAgTm90aWNlLFxuICBUZXh0QXJlYUNvbXBvbmVudCxcbiAgVGV4dENvbXBvbmVudCxcbn0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgeyBtaXJyb3JNYXAgfSBmcm9tIFwiLi4vdXRpbC9jb2xsZWN0aW9uLWhlbHBlclwiO1xuaW1wb3J0IHsgQXBwSGVscGVyIH0gZnJvbSBcIi4uL2FwcC1oZWxwZXJcIjtcbmltcG9ydCB7IFdvcmQgfSBmcm9tIFwiLi4vbW9kZWwvV29yZFwiO1xuXG5leHBvcnQgY2xhc3MgQ3VzdG9tRGljdGlvbmFyeVdvcmRSZWdpc3Rlck1vZGFsIGV4dGVuZHMgTW9kYWwge1xuICBjdXJyZW50RGljdGlvbmFyeVBhdGg6IHN0cmluZztcbiAgdmFsdWU6IHN0cmluZztcbiAgZGVzY3JpcHRpb246IHN0cmluZztcbiAgYWxpYXNlczogc3RyaW5nW107XG5cbiAgd29yZFRleHRBcmVhOiBUZXh0QXJlYUNvbXBvbmVudDtcbiAgYnV0dG9uOiBCdXR0b25Db21wb25lbnQ7XG4gIG9wZW5GaWxlQnV0dG9uOiBFeHRyYUJ1dHRvbkNvbXBvbmVudDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBhcHA6IEFwcCxcbiAgICBkaWN0aW9uYXJ5UGF0aHM6IHN0cmluZ1tdLFxuICAgIGluaXRpYWxWYWx1ZTogc3RyaW5nID0gXCJcIixcbiAgICBvbkNsaWNrQWRkOiAoZGljdGlvbmFyeVBhdGg6IHN0cmluZywgd29yZDogV29yZCkgPT4gdm9pZFxuICApIHtcbiAgICBzdXBlcihhcHApO1xuICAgIGNvbnN0IGFwcEhlbHBlciA9IG5ldyBBcHBIZWxwZXIoYXBwKTtcbiAgICB0aGlzLmN1cnJlbnREaWN0aW9uYXJ5UGF0aCA9IGRpY3Rpb25hcnlQYXRoc1swXTtcbiAgICB0aGlzLnZhbHVlID0gaW5pdGlhbFZhbHVlO1xuXG4gICAgdGhpcy50aXRsZUVsLnNldFRleHQoXCJBZGQgYSB3b3JkIHRvIGEgY3VzdG9tIGRpY3Rpb25hcnlcIik7XG5cbiAgICBjb25zdCB7IGNvbnRlbnRFbCB9ID0gdGhpcztcbiAgICBjb250ZW50RWwuZW1wdHkoKTtcblxuICAgIGNvbnRlbnRFbC5jcmVhdGVFbChcImg0XCIsIHsgdGV4dDogXCJEaWN0aW9uYXJ5XCIgfSk7XG4gICAgbmV3IERyb3Bkb3duQ29tcG9uZW50KGNvbnRlbnRFbClcbiAgICAgIC5hZGRPcHRpb25zKG1pcnJvck1hcChkaWN0aW9uYXJ5UGF0aHMsICh4KSA9PiB4KSlcbiAgICAgIC5vbkNoYW5nZSgodikgPT4ge1xuICAgICAgICB0aGlzLmN1cnJlbnREaWN0aW9uYXJ5UGF0aCA9IHY7XG4gICAgICB9KTtcbiAgICB0aGlzLm9wZW5GaWxlQnV0dG9uID0gbmV3IEV4dHJhQnV0dG9uQ29tcG9uZW50KGNvbnRlbnRFbClcbiAgICAgIC5zZXRJY29uKFwiZW50ZXJcIilcbiAgICAgIC5zZXRUb29sdGlwKFwiT3BlbiB0aGUgZmlsZVwiKVxuICAgICAgLm9uQ2xpY2soKCkgPT4ge1xuICAgICAgICBjb25zdCBtYXJrZG93bkZpbGUgPSBhcHBIZWxwZXIuZ2V0TWFya2Rvd25GaWxlQnlQYXRoKFxuICAgICAgICAgIHRoaXMuY3VycmVudERpY3Rpb25hcnlQYXRoXG4gICAgICAgICk7XG4gICAgICAgIGlmICghbWFya2Rvd25GaWxlKSB7XG4gICAgICAgICAgbmV3IE5vdGljZShgQ2FuJ3Qgb3BlbiAke3RoaXMuY3VycmVudERpY3Rpb25hcnlQYXRofWApO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgICAgYXBwSGVscGVyLm9wZW5NYXJrZG93bkZpbGUobWFya2Rvd25GaWxlLCB0cnVlKTtcbiAgICAgIH0pO1xuICAgIHRoaXMub3BlbkZpbGVCdXR0b24uZXh0cmFTZXR0aW5nc0VsLnNldEF0dHJpYnV0ZShcbiAgICAgIFwic3R5bGVcIixcbiAgICAgIFwiZGlzcGxheTogaW5saW5lXCJcbiAgICApO1xuXG4gICAgY29udGVudEVsLmNyZWF0ZUVsKFwiaDRcIiwgeyB0ZXh0OiBcIldvcmRcIiB9KTtcbiAgICB0aGlzLndvcmRUZXh0QXJlYSA9IG5ldyBUZXh0QXJlYUNvbXBvbmVudChjb250ZW50RWwpXG4gICAgICAuc2V0VmFsdWUodGhpcy52YWx1ZSlcbiAgICAgIC5vbkNoYW5nZSgodikgPT4ge1xuICAgICAgICB0aGlzLnZhbHVlID0gdjtcbiAgICAgICAgdGhpcy5idXR0b24uc2V0RGlzYWJsZWQoIXYpO1xuICAgICAgICBpZiAodikge1xuICAgICAgICAgIHRoaXMuYnV0dG9uLnNldEN0YSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuYnV0dG9uLnJlbW92ZUN0YSgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB0aGlzLndvcmRUZXh0QXJlYS5pbnB1dEVsLnNldEF0dHJpYnV0ZShcInN0eWxlXCIsIFwibWluLXdpZHRoOiAxMDAlO1wiKTtcblxuICAgIGNvbnRlbnRFbC5jcmVhdGVFbChcImg0XCIsIHsgdGV4dDogXCJEZXNjcmlwdGlvblwiIH0pO1xuICAgIG5ldyBUZXh0Q29tcG9uZW50KGNvbnRlbnRFbClcbiAgICAgIC5vbkNoYW5nZSgodikgPT4ge1xuICAgICAgICB0aGlzLmRlc2NyaXB0aW9uID0gdjtcbiAgICAgIH0pXG4gICAgICAuaW5wdXRFbC5zZXRBdHRyaWJ1dGUoXCJzdHlsZVwiLCBcIm1pbi13aWR0aDogMTAwJTtcIik7XG5cbiAgICBjb250ZW50RWwuY3JlYXRlRWwoXCJoNFwiLCB7IHRleHQ6IFwiQWxpYXNlcyAoZm9yIGVhY2ggbGluZSlcIiB9KTtcbiAgICBuZXcgVGV4dEFyZWFDb21wb25lbnQoY29udGVudEVsKVxuICAgICAgLm9uQ2hhbmdlKCh2KSA9PiB7XG4gICAgICAgIHRoaXMuYWxpYXNlcyA9IHYuc3BsaXQoXCJcXG5cIik7XG4gICAgICB9KVxuICAgICAgLmlucHV0RWwuc2V0QXR0cmlidXRlKFwic3R5bGVcIiwgXCJtaW4td2lkdGg6IDEwMCU7XCIpO1xuXG4gICAgdGhpcy5idXR0b24gPSBuZXcgQnV0dG9uQ29tcG9uZW50KFxuICAgICAgY29udGVudEVsLmNyZWF0ZUVsKFwiZGl2XCIsIHtcbiAgICAgICAgYXR0cjoge1xuICAgICAgICAgIHN0eWxlOiBcImRpc3BsYXk6IGZsZXg7IGp1c3RpZnktY29udGVudDogY2VudGVyOyBtYXJnaW4tdG9wOiAxNXB4XCIsXG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgIClcbiAgICAgIC5zZXRCdXR0b25UZXh0KFwiQWRkIHRvIGRpY3Rpb25hcnlcIilcbiAgICAgIC5zZXRDdGEoKVxuICAgICAgLnNldERpc2FibGVkKCF0aGlzLnZhbHVlKVxuICAgICAgLm9uQ2xpY2soKCkgPT4ge1xuICAgICAgICBvbkNsaWNrQWRkKHRoaXMuY3VycmVudERpY3Rpb25hcnlQYXRoLCB7XG4gICAgICAgICAgdmFsdWU6IHRoaXMudmFsdWUsXG4gICAgICAgICAgZGVzY3JpcHRpb246IHRoaXMuZGVzY3JpcHRpb24sXG4gICAgICAgICAgY3JlYXRlZFBhdGg6IHRoaXMuY3VycmVudERpY3Rpb25hcnlQYXRoLFxuICAgICAgICAgIGFsaWFzZXM6IHRoaXMuYWxpYXNlcyxcbiAgICAgICAgICB0eXBlOiBcImN1c3RvbURpY3Rpb25hcnlcIixcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICBpZiAodGhpcy52YWx1ZSkge1xuICAgICAgdGhpcy5idXR0b24uc2V0Q3RhKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYnV0dG9uLnJlbW92ZUN0YSgpO1xuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IHsgTWF0Y2hTdHJhdGVneSB9IGZyb20gXCIuLi9wcm92aWRlci9NYXRjaFN0cmF0ZWd5XCI7XG5cbmV4cG9ydCBjbGFzcyBQcm92aWRlclN0YXR1c0JhciB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBjdXJyZW50RmlsZTogSFRNTEVsZW1lbnQgfCBudWxsLFxuICAgIHB1YmxpYyBjdXJyZW50VmF1bHQ6IEhUTUxFbGVtZW50IHwgbnVsbCxcbiAgICBwdWJsaWMgY3VzdG9tRGljdGlvbmFyeTogSFRNTEVsZW1lbnQgfCBudWxsLFxuICAgIHB1YmxpYyBpbnRlcm5hbExpbms6IEhUTUxFbGVtZW50IHwgbnVsbCxcbiAgICBwdWJsaWMgZnJvbnRNYXR0ZXI6IEhUTUxFbGVtZW50IHwgbnVsbCxcbiAgICBwdWJsaWMgbWF0Y2hTdHJhdGVneTogSFRNTEVsZW1lbnQgfCBudWxsXG4gICkge31cblxuICBzdGF0aWMgbmV3KFxuICAgIHN0YXR1c0JhcjogSFRNTEVsZW1lbnQsXG4gICAgc2hvd01hdGNoU3RyYXRlZ3k6IGJvb2xlYW4sXG4gICAgc2hvd0luZGV4aW5nU3RhdHVzOiBib29sZWFuXG4gICk6IFByb3ZpZGVyU3RhdHVzQmFyIHtcbiAgICBjb25zdCBjdXJyZW50RmlsZSA9IHNob3dJbmRleGluZ1N0YXR1c1xuICAgICAgPyBzdGF0dXNCYXIuY3JlYXRlRWwoXCJzcGFuXCIsIHtcbiAgICAgICAgICB0ZXh0OiBcIi0tLVwiLFxuICAgICAgICAgIGNsczogXCJ2YXJpb3VzLWNvbXBsZW1lbnRzX19mb290ZXIgdmFyaW91cy1jb21wbGVtZW50c19fZm9vdGVyX19jdXJyZW50LWZpbGVcIixcbiAgICAgICAgfSlcbiAgICAgIDogbnVsbDtcbiAgICBjb25zdCBjdXJyZW50VmF1bHQgPSBzaG93SW5kZXhpbmdTdGF0dXNcbiAgICAgID8gc3RhdHVzQmFyLmNyZWF0ZUVsKFwic3BhblwiLCB7XG4gICAgICAgICAgdGV4dDogXCItLS1cIixcbiAgICAgICAgICBjbHM6IFwidmFyaW91cy1jb21wbGVtZW50c19fZm9vdGVyIHZhcmlvdXMtY29tcGxlbWVudHNfX2Zvb3Rlcl9fY3VycmVudC12YXVsdFwiLFxuICAgICAgICB9KVxuICAgICAgOiBudWxsO1xuICAgIGNvbnN0IGN1c3RvbURpY3Rpb25hcnkgPSBzaG93SW5kZXhpbmdTdGF0dXNcbiAgICAgID8gc3RhdHVzQmFyLmNyZWF0ZUVsKFwic3BhblwiLCB7XG4gICAgICAgICAgdGV4dDogXCItLS1cIixcbiAgICAgICAgICBjbHM6IFwidmFyaW91cy1jb21wbGVtZW50c19fZm9vdGVyIHZhcmlvdXMtY29tcGxlbWVudHNfX2Zvb3Rlcl9fY3VzdG9tLWRpY3Rpb25hcnlcIixcbiAgICAgICAgfSlcbiAgICAgIDogbnVsbDtcbiAgICBjb25zdCBpbnRlcm5hbExpbmsgPSBzaG93SW5kZXhpbmdTdGF0dXNcbiAgICAgID8gc3RhdHVzQmFyLmNyZWF0ZUVsKFwic3BhblwiLCB7XG4gICAgICAgICAgdGV4dDogXCItLS1cIixcbiAgICAgICAgICBjbHM6IFwidmFyaW91cy1jb21wbGVtZW50c19fZm9vdGVyIHZhcmlvdXMtY29tcGxlbWVudHNfX2Zvb3Rlcl9faW50ZXJuYWwtbGlua1wiLFxuICAgICAgICB9KVxuICAgICAgOiBudWxsO1xuICAgIGNvbnN0IGZyb250TWF0dGVyID0gc2hvd0luZGV4aW5nU3RhdHVzXG4gICAgICA/IHN0YXR1c0Jhci5jcmVhdGVFbChcInNwYW5cIiwge1xuICAgICAgICAgIHRleHQ6IFwiLS0tXCIsXG4gICAgICAgICAgY2xzOiBcInZhcmlvdXMtY29tcGxlbWVudHNfX2Zvb3RlciB2YXJpb3VzLWNvbXBsZW1lbnRzX19mb290ZXJfX2Zyb250LW1hdHRlclwiLFxuICAgICAgICB9KVxuICAgICAgOiBudWxsO1xuXG4gICAgY29uc3QgbWF0Y2hTdHJhdGVneSA9IHNob3dNYXRjaFN0cmF0ZWd5XG4gICAgICA/IHN0YXR1c0Jhci5jcmVhdGVFbChcInNwYW5cIiwge1xuICAgICAgICAgIHRleHQ6IFwiLS0tXCIsXG4gICAgICAgICAgY2xzOiBcInZhcmlvdXMtY29tcGxlbWVudHNfX2Zvb3RlciB2YXJpb3VzLWNvbXBsZW1lbnRzX19mb290ZXJfX21hdGNoLXN0cmF0ZWd5XCIsXG4gICAgICAgIH0pXG4gICAgICA6IG51bGw7XG5cbiAgICByZXR1cm4gbmV3IFByb3ZpZGVyU3RhdHVzQmFyKFxuICAgICAgY3VycmVudEZpbGUsXG4gICAgICBjdXJyZW50VmF1bHQsXG4gICAgICBjdXN0b21EaWN0aW9uYXJ5LFxuICAgICAgaW50ZXJuYWxMaW5rLFxuICAgICAgZnJvbnRNYXR0ZXIsXG4gICAgICBtYXRjaFN0cmF0ZWd5XG4gICAgKTtcbiAgfVxuXG4gIHNldE9uQ2xpY2tTdHJhdGVneUxpc3RlbmVyKGxpc3RlbmVyOiAoKSA9PiB2b2lkKSB7XG4gICAgdGhpcy5tYXRjaFN0cmF0ZWd5Py5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgbGlzdGVuZXIpO1xuICB9XG5cbiAgc2V0Q3VycmVudEZpbGVEaXNhYmxlZCgpIHtcbiAgICB0aGlzLmN1cnJlbnRGaWxlPy5zZXRUZXh0KFwiLS0tXCIpO1xuICB9XG4gIHNldEN1cnJlbnRWYXVsdERpc2FibGVkKCkge1xuICAgIHRoaXMuY3VycmVudFZhdWx0Py5zZXRUZXh0KFwiLS0tXCIpO1xuICB9XG4gIHNldEN1c3RvbURpY3Rpb25hcnlEaXNhYmxlZCgpIHtcbiAgICB0aGlzLmN1c3RvbURpY3Rpb25hcnk/LnNldFRleHQoXCItLS1cIik7XG4gIH1cbiAgc2V0SW50ZXJuYWxMaW5rRGlzYWJsZWQoKSB7XG4gICAgdGhpcy5pbnRlcm5hbExpbms/LnNldFRleHQoXCItLS1cIik7XG4gIH1cbiAgc2V0RnJvbnRNYXR0ZXJEaXNhYmxlZCgpIHtcbiAgICB0aGlzLmZyb250TWF0dGVyPy5zZXRUZXh0KFwiLS0tXCIpO1xuICB9XG5cbiAgc2V0Q3VycmVudEZpbGVJbmRleGluZygpIHtcbiAgICB0aGlzLmN1cnJlbnRGaWxlPy5zZXRUZXh0KFwiaW5kZXhpbmcuLi5cIik7XG4gIH1cbiAgc2V0Q3VycmVudFZhdWx0SW5kZXhpbmcoKSB7XG4gICAgdGhpcy5jdXJyZW50VmF1bHQ/LnNldFRleHQoXCJpbmRleGluZy4uLlwiKTtcbiAgfVxuICBzZXRDdXN0b21EaWN0aW9uYXJ5SW5kZXhpbmcoKSB7XG4gICAgdGhpcy5jdXN0b21EaWN0aW9uYXJ5Py5zZXRUZXh0KFwiaW5kZXhpbmcuLi5cIik7XG4gIH1cbiAgc2V0SW50ZXJuYWxMaW5rSW5kZXhpbmcoKSB7XG4gICAgdGhpcy5pbnRlcm5hbExpbms/LnNldFRleHQoXCJpbmRleGluZy4uLlwiKTtcbiAgfVxuICBzZXRGcm9udE1hdHRlckluZGV4aW5nKCkge1xuICAgIHRoaXMuZnJvbnRNYXR0ZXI/LnNldFRleHQoXCJpbmRleGluZy4uLlwiKTtcbiAgfVxuXG4gIHNldEN1cnJlbnRGaWxlSW5kZXhlZChjb3VudDogYW55KSB7XG4gICAgdGhpcy5jdXJyZW50RmlsZT8uc2V0VGV4dChTdHJpbmcoY291bnQpKTtcbiAgfVxuICBzZXRDdXJyZW50VmF1bHRJbmRleGVkKGNvdW50OiBhbnkpIHtcbiAgICB0aGlzLmN1cnJlbnRWYXVsdD8uc2V0VGV4dChTdHJpbmcoY291bnQpKTtcbiAgfVxuICBzZXRDdXN0b21EaWN0aW9uYXJ5SW5kZXhlZChjb3VudDogYW55KSB7XG4gICAgdGhpcy5jdXN0b21EaWN0aW9uYXJ5Py5zZXRUZXh0KFN0cmluZyhjb3VudCkpO1xuICB9XG4gIHNldEludGVybmFsTGlua0luZGV4ZWQoY291bnQ6IGFueSkge1xuICAgIHRoaXMuaW50ZXJuYWxMaW5rPy5zZXRUZXh0KFN0cmluZyhjb3VudCkpO1xuICB9XG4gIHNldEZyb250TWF0dGVySW5kZXhlZChjb3VudDogYW55KSB7XG4gICAgdGhpcy5mcm9udE1hdHRlcj8uc2V0VGV4dChTdHJpbmcoY291bnQpKTtcbiAgfVxuXG4gIHNldE1hdGNoU3RyYXRlZ3koc3RyYXRlZ3k6IE1hdGNoU3RyYXRlZ3kpIHtcbiAgICB0aGlzLm1hdGNoU3RyYXRlZ3k/LnNldFRleHQoc3RyYXRlZ3kubmFtZSk7XG4gIH1cbn1cbiIsImltcG9ydCB7IE5vdGljZSwgUGx1Z2luIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgeyBBdXRvQ29tcGxldGVTdWdnZXN0IH0gZnJvbSBcIi4vdWkvQXV0b0NvbXBsZXRlU3VnZ2VzdFwiO1xuaW1wb3J0IHtcbiAgREVGQVVMVF9TRVRUSU5HUyxcbiAgU2V0dGluZ3MsXG4gIFZhcmlvdXNDb21wbGVtZW50c1NldHRpbmdUYWIsXG59IGZyb20gXCIuL3NldHRpbmdzXCI7XG5pbXBvcnQgeyBDdXN0b21EaWN0aW9uYXJ5V29yZFJlZ2lzdGVyTW9kYWwgfSBmcm9tIFwiLi91aS9DdXN0b21EaWN0aW9uYXJ5V29yZFJlZ2lzdGVyTW9kYWxcIjtcbmltcG9ydCB7IEFwcEhlbHBlciB9IGZyb20gXCIuL2FwcC1oZWxwZXJcIjtcbmltcG9ydCB7IFByb3ZpZGVyU3RhdHVzQmFyIH0gZnJvbSBcIi4vdWkvUHJvdmlkZXJTdGF0dXNCYXJcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVmFyaW91c0NvbXBvbmVudHMgZXh0ZW5kcyBQbHVnaW4ge1xuICBhcHBIZWxwZXI6IEFwcEhlbHBlcjtcbiAgc2V0dGluZ3M6IFNldHRpbmdzO1xuICBzZXR0aW5nVGFiOiBWYXJpb3VzQ29tcGxlbWVudHNTZXR0aW5nVGFiO1xuICBzdWdnZXN0ZXI6IEF1dG9Db21wbGV0ZVN1Z2dlc3Q7XG4gIHN0YXR1c0Jhcj86IFByb3ZpZGVyU3RhdHVzQmFyO1xuXG4gIG9udW5sb2FkKCkge1xuICAgIHN1cGVyLm9udW5sb2FkKCk7XG4gICAgdGhpcy5zdWdnZXN0ZXIudW5yZWdpc3RlcigpO1xuICB9XG5cbiAgYXN5bmMgb25sb2FkKCkge1xuICAgIHRoaXMuYXBwSGVscGVyID0gbmV3IEFwcEhlbHBlcih0aGlzLmFwcCk7XG5cbiAgICB0aGlzLnJlZ2lzdGVyRXZlbnQoXG4gICAgICB0aGlzLmFwcC53b3Jrc3BhY2Uub24oXCJlZGl0b3ItbWVudVwiLCAobWVudSkgPT4ge1xuICAgICAgICBpZiAoIXRoaXMuYXBwSGVscGVyLmdldFNlbGVjdGlvbigpKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbWVudS5hZGRJdGVtKChpdGVtKSA9PlxuICAgICAgICAgIGl0ZW1cbiAgICAgICAgICAgIC5zZXRUaXRsZShcIkFkZCB0byBjdXN0b20gZGljdGlvbmFyeVwiKVxuICAgICAgICAgICAgLnNldEljb24oXCJzdGFja2VkLWxldmVsc1wiKVxuICAgICAgICAgICAgLm9uQ2xpY2soKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLmFkZFdvcmRUb0N1c3RvbURpY3Rpb25hcnkoKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICk7XG4gICAgICB9KVxuICAgICk7XG5cbiAgICBhd2FpdCB0aGlzLmxvYWRTZXR0aW5ncygpO1xuXG4gICAgdGhpcy5zZXR0aW5nVGFiID0gbmV3IFZhcmlvdXNDb21wbGVtZW50c1NldHRpbmdUYWIodGhpcy5hcHAsIHRoaXMpO1xuICAgIHRoaXMuYWRkU2V0dGluZ1RhYih0aGlzLnNldHRpbmdUYWIpO1xuXG4gICAgdGhpcy5zdGF0dXNCYXIgPSBQcm92aWRlclN0YXR1c0Jhci5uZXcoXG4gICAgICB0aGlzLmFkZFN0YXR1c0Jhckl0ZW0oKSxcbiAgICAgIHRoaXMuc2V0dGluZ3Muc2hvd01hdGNoU3RyYXRlZ3ksXG4gICAgICB0aGlzLnNldHRpbmdzLnNob3dJbmRleGluZ1N0YXR1c1xuICAgICk7XG4gICAgdGhpcy5zdGF0dXNCYXIuc2V0T25DbGlja1N0cmF0ZWd5TGlzdGVuZXIoYXN5bmMgKCkgPT4ge1xuICAgICAgYXdhaXQgdGhpcy5zZXR0aW5nVGFiLnRvZ2dsZU1hdGNoU3RyYXRlZ3koKTtcbiAgICB9KTtcblxuICAgIHRoaXMuc3VnZ2VzdGVyID0gYXdhaXQgQXV0b0NvbXBsZXRlU3VnZ2VzdC5uZXcoXG4gICAgICB0aGlzLmFwcCxcbiAgICAgIHRoaXMuc2V0dGluZ3MsXG4gICAgICB0aGlzLnN0YXR1c0JhclxuICAgICk7XG4gICAgdGhpcy5yZWdpc3RlckVkaXRvclN1Z2dlc3QodGhpcy5zdWdnZXN0ZXIpO1xuXG4gICAgdGhpcy5hZGRDb21tYW5kKHtcbiAgICAgIGlkOiBcInJlbG9hZC1jdXN0b20tZGljdGlvbmFyaWVzXCIsXG4gICAgICBuYW1lOiBcIlJlbG9hZCBjdXN0b20gZGljdGlvbmFyaWVzXCIsXG4gICAgICBob3RrZXlzOiBbeyBtb2RpZmllcnM6IFtcIk1vZFwiLCBcIlNoaWZ0XCJdLCBrZXk6IFwiclwiIH1dLFxuICAgICAgY2FsbGJhY2s6IGFzeW5jICgpID0+IHtcbiAgICAgICAgYXdhaXQgdGhpcy5zdWdnZXN0ZXIucmVmcmVzaEN1c3RvbURpY3Rpb25hcnlUb2tlbnMoKTtcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICB0aGlzLmFkZENvbW1hbmQoe1xuICAgICAgaWQ6IFwicmVsb2FkLWN1cnJlbnQtdmF1bHRcIixcbiAgICAgIG5hbWU6IFwiUmVsb2FkIGN1cnJlbnQgdmF1bHRcIixcbiAgICAgIGNhbGxiYWNrOiBhc3luYyAoKSA9PiB7XG4gICAgICAgIGF3YWl0IHRoaXMuc3VnZ2VzdGVyLnJlZnJlc2hDdXJyZW50VmF1bHRUb2tlbnMoKTtcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICB0aGlzLmFkZENvbW1hbmQoe1xuICAgICAgaWQ6IFwidG9nZ2xlLW1hdGNoLXN0cmF0ZWd5XCIsXG4gICAgICBuYW1lOiBcIlRvZ2dsZSBNYXRjaCBzdHJhdGVneVwiLFxuICAgICAgY2FsbGJhY2s6IGFzeW5jICgpID0+IHtcbiAgICAgICAgYXdhaXQgdGhpcy5zZXR0aW5nVGFiLnRvZ2dsZU1hdGNoU3RyYXRlZ3koKTtcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICB0aGlzLmFkZENvbW1hbmQoe1xuICAgICAgaWQ6IFwidG9nZ2xlLWNvbXBsZW1lbnQtYXV0b21hdGljYWxseVwiLFxuICAgICAgbmFtZTogXCJUb2dnbGUgQ29tcGxlbWVudCBhdXRvbWF0aWNhbGx5XCIsXG4gICAgICBjYWxsYmFjazogYXN5bmMgKCkgPT4ge1xuICAgICAgICBhd2FpdCB0aGlzLnNldHRpbmdUYWIudG9nZ2xlQ29tcGxlbWVudEF1dG9tYXRpY2FsbHkoKTtcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICB0aGlzLmFkZENvbW1hbmQoe1xuICAgICAgaWQ6IFwic2hvdy1zdWdnZXN0aW9uc1wiLFxuICAgICAgbmFtZTogXCJTaG93IHN1Z2dlc3Rpb25zXCIsXG4gICAgICBob3RrZXlzOiBbeyBtb2RpZmllcnM6IFtcIk1vZFwiXSwga2V5OiBcIiBcIiB9XSxcbiAgICAgIGNhbGxiYWNrOiBhc3luYyAoKSA9PiB7XG4gICAgICAgIHRoaXMuc3VnZ2VzdGVyLnRyaWdnZXJDb21wbGV0ZSgpO1xuICAgICAgfSxcbiAgICB9KTtcblxuICAgIHRoaXMuYWRkQ29tbWFuZCh7XG4gICAgICBpZDogXCJhZGQtd29yZC1jdXN0b20tZGljdGlvbmFyeVwiLFxuICAgICAgbmFtZTogXCJBZGQgYSB3b3JkIHRvIGEgY3VzdG9tIGRpY3Rpb25hcnlcIixcbiAgICAgIGhvdGtleXM6IFt7IG1vZGlmaWVyczogW1wiTW9kXCIsIFwiU2hpZnRcIl0sIGtleTogXCIgXCIgfV0sXG4gICAgICBjYWxsYmFjazogYXN5bmMgKCkgPT4ge1xuICAgICAgICB0aGlzLmFkZFdvcmRUb0N1c3RvbURpY3Rpb25hcnkoKTtcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICB0aGlzLmFkZENvbW1hbmQoe1xuICAgICAgaWQ6IFwicHJlZGljdGFibGUtY29tcGxlbWVudHNcIixcbiAgICAgIG5hbWU6IFwiUHJlZGljdGFibGUgY29tcGxlbWVudFwiLFxuICAgICAgaG90a2V5czogW3sgbW9kaWZpZXJzOiBbXCJTaGlmdFwiXSwga2V5OiBcIiBcIiB9XSxcbiAgICAgIGNhbGxiYWNrOiBhc3luYyAoKSA9PiB7XG4gICAgICAgIHRoaXMuc3VnZ2VzdGVyLnByZWRpY3RhYmxlQ29tcGxldGUoKTtcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICB0aGlzLmFkZENvbW1hbmQoe1xuICAgICAgaWQ6IFwiY29weS1wbHVnaW4tc2V0dGluZ3NcIixcbiAgICAgIG5hbWU6IFwiQ29weSBwbHVnaW4gc2V0dGluZ3NcIixcbiAgICAgIGNhbGxiYWNrOiBhc3luYyAoKSA9PiB7XG4gICAgICAgIGF3YWl0IG5hdmlnYXRvci5jbGlwYm9hcmQud3JpdGVUZXh0KFxuICAgICAgICAgIHRoaXMuc2V0dGluZ1RhYi5nZXRQbHVnaW5TZXR0aW5nc0FzSnNvblN0cmluZygpXG4gICAgICAgICk7XG4gICAgICAgIC8vIG5vaW5zcGVjdGlvbiBPYmplY3RBbGxvY2F0aW9uSWdub3JlZFxuICAgICAgICBuZXcgTm90aWNlKFwiQ29weSBzZXR0aW5ncyBvZiBWYXJpb3VzIENvbXBsZW1lbnRzXCIpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIGxvYWRTZXR0aW5ncygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0aGlzLnNldHRpbmdzID0geyAuLi5ERUZBVUxUX1NFVFRJTkdTLCAuLi4oYXdhaXQgdGhpcy5sb2FkRGF0YSgpKSB9O1xuICB9XG5cbiAgYXN5bmMgc2F2ZVNldHRpbmdzKFxuICAgIG5lZWRVcGRhdGVUb2tlbnM6IHtcbiAgICAgIGN1cnJlbnRGaWxlPzogYm9vbGVhbjtcbiAgICAgIGN1cnJlbnRWYXVsdD86IGJvb2xlYW47XG4gICAgICBjdXN0b21EaWN0aW9uYXJ5PzogYm9vbGVhbjtcbiAgICAgIGludGVybmFsTGluaz86IGJvb2xlYW47XG4gICAgICBmcm9udE1hdHRlcj86IGJvb2xlYW47XG4gICAgfSA9IHt9XG4gICk6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IHRoaXMuc2F2ZURhdGEodGhpcy5zZXR0aW5ncyk7XG4gICAgYXdhaXQgdGhpcy5zdWdnZXN0ZXIudXBkYXRlU2V0dGluZ3ModGhpcy5zZXR0aW5ncyk7XG4gICAgaWYgKG5lZWRVcGRhdGVUb2tlbnMuY3VycmVudEZpbGUpIHtcbiAgICAgIGF3YWl0IHRoaXMuc3VnZ2VzdGVyLnJlZnJlc2hDdXJyZW50RmlsZVRva2VucygpO1xuICAgIH1cbiAgICBpZiAobmVlZFVwZGF0ZVRva2Vucy5jdXJyZW50VmF1bHQpIHtcbiAgICAgIGF3YWl0IHRoaXMuc3VnZ2VzdGVyLnJlZnJlc2hDdXJyZW50VmF1bHRUb2tlbnMoKTtcbiAgICB9XG4gICAgaWYgKG5lZWRVcGRhdGVUb2tlbnMuY3VzdG9tRGljdGlvbmFyeSkge1xuICAgICAgYXdhaXQgdGhpcy5zdWdnZXN0ZXIucmVmcmVzaEN1c3RvbURpY3Rpb25hcnlUb2tlbnMoKTtcbiAgICB9XG4gICAgaWYgKG5lZWRVcGRhdGVUb2tlbnMuaW50ZXJuYWxMaW5rKSB7XG4gICAgICBhd2FpdCB0aGlzLnN1Z2dlc3Rlci5yZWZyZXNoSW50ZXJuYWxMaW5rVG9rZW5zKCk7XG4gICAgfVxuICAgIGlmIChuZWVkVXBkYXRlVG9rZW5zLmZyb250TWF0dGVyKSB7XG4gICAgICBhd2FpdCB0aGlzLnN1Z2dlc3Rlci5yZWZyZXNoRnJvbnRNYXR0ZXJUb2tlbnMoKTtcbiAgICB9XG4gIH1cblxuICBhZGRXb3JkVG9DdXN0b21EaWN0aW9uYXJ5KCkge1xuICAgIGNvbnN0IHNlbGVjdGVkV29yZCA9IHRoaXMuYXBwSGVscGVyLmdldFNlbGVjdGlvbigpO1xuICAgIGNvbnN0IHByb3ZpZGVyID0gdGhpcy5zdWdnZXN0ZXIuY3VzdG9tRGljdGlvbmFyeVdvcmRQcm92aWRlcjtcbiAgICBjb25zdCBtb2RhbCA9IG5ldyBDdXN0b21EaWN0aW9uYXJ5V29yZFJlZ2lzdGVyTW9kYWwoXG4gICAgICB0aGlzLmFwcCxcbiAgICAgIHByb3ZpZGVyLmVkaXRhYmxlUGF0aHMsXG4gICAgICBzZWxlY3RlZFdvcmQsXG4gICAgICBhc3luYyAoZGljdGlvbmFyeVBhdGgsIHdvcmQpID0+IHtcbiAgICAgICAgaWYgKHByb3ZpZGVyLndvcmRCeVZhbHVlW3dvcmQudmFsdWVdKSB7XG4gICAgICAgICAgLy8gbm9pbnNwZWN0aW9uIE9iamVjdEFsbG9jYXRpb25JZ25vcmVkXG4gICAgICAgICAgbmV3IE5vdGljZShg4pqgICR7d29yZC52YWx1ZX0gYWxyZWFkeSBleGlzdHNgLCAwKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBhd2FpdCBwcm92aWRlci5hZGRXb3JkV2l0aERpY3Rpb25hcnkod29yZCwgZGljdGlvbmFyeVBhdGgpO1xuICAgICAgICAvLyBub2luc3BlY3Rpb24gT2JqZWN0QWxsb2NhdGlvbklnbm9yZWRcbiAgICAgICAgbmV3IE5vdGljZShgQWRkZWQgJHt3b3JkLnZhbHVlfWApO1xuICAgICAgICBtb2RhbC5jbG9zZSgpO1xuICAgICAgfVxuICAgICk7XG5cbiAgICBtb2RhbC5vcGVuKCk7XG5cbiAgICBpZiAoc2VsZWN0ZWRXb3JkKSB7XG4gICAgICBtb2RhbC5idXR0b24uYnV0dG9uRWwuZm9jdXMoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbW9kYWwud29yZFRleHRBcmVhLmlucHV0RWwuZm9jdXMoKTtcbiAgICB9XG4gIH1cbn1cbiJdLCJuYW1lcyI6WyJwYXJzZUZyb250TWF0dGVyQWxpYXNlcyIsInBhcnNlRnJvbnRNYXR0ZXJUYWdzIiwicGFyc2VGcm9udE1hdHRlclN0cmluZ0FycmF5IiwiTWFya2Rvd25WaWV3IiwicmVxdWVzdCIsIk5vdGljZSIsIkVkaXRvclN1Z2dlc3QiLCJkZWJvdW5jZSIsIlBsdWdpblNldHRpbmdUYWIiLCJTZXR0aW5nIiwiTW9kYWwiLCJEcm9wZG93bkNvbXBvbmVudCIsIkV4dHJhQnV0dG9uQ29tcG9uZW50IiwiVGV4dEFyZWFDb21wb25lbnQiLCJUZXh0Q29tcG9uZW50IiwiQnV0dG9uQ29tcG9uZW50IiwiUGx1Z2luIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQTRCQTtBQUNPLFNBQVMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDN0IsSUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDZixJQUFJLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksTUFBTSxDQUFDLFNB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LElBQUk7UUFDVCxFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsQ0FBQyxJQUFJO0tBQ1YsQ0FBQztJQUNGLElBQUksQ0FBQyxLQUFLLEdBQUc7UUFDWCxFQUFFLEVBQUUsR0FBRztRQUNQLEVBQUUsRUFBRSxHQUFHO1FBQ1AsRUFBRSxFQUFFLENBQUMsR0FBRztRQUNSLEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxHQUFHO1FBQ1IsRUFBRSxFQUFFLENBQUMsR0FBRztRQUNSLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsR0FBRztLQUNSLENBQUM7SUFDRixJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUM7SUFDckQsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDbkMsSUFBSSxDQUFDLEtBQUssR0FBRztRQUNYLEdBQUcsRUFBRSxJQUFJO1FBQ1QsR0FBRyxFQUFFLElBQUk7UUFDVCxHQUFHLEVBQUUsQ0FBQyxJQUFJO1FBQ1YsR0FBRyxFQUFFLEdBQUc7UUFDUixHQUFHLEVBQUUsSUFBSTtRQUNULEdBQUcsRUFBRSxHQUFHO1FBQ1IsR0FBRyxFQUFFLENBQUMsRUFBRTtRQUNSLEdBQUcsRUFBRSxDQUFDLElBQUk7UUFDVixHQUFHLEVBQUUsR0FBRztRQUNSLEdBQUcsRUFBRSxDQUFDLEdBQUc7UUFDVCxHQUFHLEVBQUUsSUFBSTtRQUNULEdBQUcsRUFBRSxDQUFDLElBQUk7UUFDVixHQUFHLEVBQUUsR0FBRztRQUNSLEdBQUcsRUFBRSxJQUFJO0tBQ1YsQ0FBQztJQUNGLElBQUksQ0FBQyxLQUFLLEdBQUc7UUFDWCxHQUFHLEVBQUUsR0FBRztRQUNSLEdBQUcsRUFBRSxDQUFDLElBQUk7UUFDVixHQUFHLEVBQUUsR0FBRztRQUNSLEdBQUcsRUFBRSxDQUFDLEdBQUc7UUFDVCxHQUFHLEVBQUUsQ0FBQyxJQUFJO1FBQ1YsR0FBRyxFQUFFLEdBQUc7UUFDUixHQUFHLEVBQUUsQ0FBQyxJQUFJO1FBQ1YsR0FBRyxFQUFFLENBQUMsR0FBRztRQUNULEdBQUcsRUFBRSxHQUFHO1FBQ1IsR0FBRyxFQUFFLENBQUMsSUFBSTtLQUNYLENBQUM7SUFDRixJQUFJLENBQUMsS0FBSyxHQUFHO1FBQ1gsR0FBRyxFQUFFLENBQUMsR0FBRztRQUNULEdBQUcsRUFBRSxJQUFJO1FBQ1QsR0FBRyxFQUFFLENBQUMsR0FBRztRQUNULEdBQUcsRUFBRSxHQUFHO1FBQ1IsR0FBRyxFQUFFLEdBQUc7UUFDUixHQUFHLEVBQUUsSUFBSTtRQUNULEdBQUcsRUFBRSxHQUFHO1FBQ1IsR0FBRyxFQUFFLEdBQUc7UUFDUixHQUFHLEVBQUUsSUFBSTtRQUNULEdBQUcsRUFBRSxHQUFHO1FBQ1IsR0FBRyxFQUFFLEdBQUc7UUFDUixHQUFHLEVBQUUsSUFBSTtRQUNULEdBQUcsRUFBRSxDQUFDLEdBQUc7UUFDVCxHQUFHLEVBQUUsQ0FBQyxJQUFJO1FBQ1YsR0FBRyxFQUFFLENBQUMsSUFBSTtRQUNWLEdBQUcsRUFBRSxLQUFLO0tBQ1gsQ0FBQztJQUNGLElBQUksQ0FBQyxLQUFLLEdBQUc7UUFDWCxHQUFHLEVBQUUsQ0FBQyxJQUFJO1FBQ1YsR0FBRyxFQUFFLElBQUk7UUFDVCxHQUFHLEVBQUUsQ0FBQyxJQUFJO1FBQ1YsR0FBRyxFQUFFLElBQUk7UUFDVCxHQUFHLEVBQUUsQ0FBQyxJQUFJO1FBQ1YsR0FBRyxFQUFFLENBQUMsSUFBSTtRQUNWLEdBQUcsRUFBRSxDQUFDLEtBQUs7UUFDWCxHQUFHLEVBQUUsR0FBRztRQUNSLEdBQUcsRUFBRSxHQUFHO1FBQ1IsR0FBRyxFQUFFLENBQUMsSUFBSTtRQUNWLEdBQUcsRUFBRSxDQUFDLEdBQUc7S0FDVixDQUFDO0lBQ0YsSUFBSSxDQUFDLEtBQUssR0FBRztRQUNYLElBQUksRUFBRSxHQUFHO1FBQ1QsSUFBSSxFQUFFLEdBQUc7UUFDVCxHQUFHLEVBQUUsSUFBSTtRQUNULEdBQUcsRUFBRSxHQUFHO1FBQ1IsSUFBSSxFQUFFLEdBQUc7UUFDVCxJQUFJLEVBQUUsR0FBRztRQUNULElBQUksRUFBRSxJQUFJO1FBQ1YsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsR0FBRztRQUNQLEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsR0FBRztRQUNQLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLEdBQUc7UUFDUCxFQUFFLEVBQUUsQ0FBQyxHQUFHO1FBQ1IsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxDQUFDLEdBQUc7UUFDUixFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxHQUFHO1FBQ1AsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsQ0FBQyxHQUFHO1FBQ1IsRUFBRSxFQUFFLEdBQUc7UUFDUCxFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsR0FBRztRQUNQLEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxDQUFDLEdBQUc7UUFDUixFQUFFLEVBQUUsQ0FBQyxHQUFHO1FBQ1IsRUFBRSxFQUFFLEdBQUc7UUFDUCxFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxDQUFDLEdBQUc7UUFDUixFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxHQUFHO1FBQ1AsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsR0FBRztRQUNSLEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsR0FBRztRQUNSLEdBQUcsRUFBRSxJQUFJO1FBQ1QsR0FBRyxFQUFFLEdBQUc7UUFDUixJQUFJLEVBQUUsSUFBSTtLQUNYLENBQUM7SUFDRixJQUFJLENBQUMsS0FBSyxHQUFHO1FBQ1gsSUFBSSxFQUFFLENBQUMsS0FBSztRQUNaLEVBQUUsRUFBRSxDQUFDLEdBQUc7UUFDUixJQUFJLEVBQUUsQ0FBQyxJQUFJO1FBQ1gsSUFBSSxFQUFFLENBQUMsS0FBSztRQUNaLEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxHQUFHO1FBQ1IsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLEdBQUc7UUFDUCxFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxLQUFLO1FBQ1QsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxHQUFHO1FBQ1IsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsR0FBRztRQUNQLEVBQUUsRUFBRSxHQUFHO1FBQ1AsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxHQUFHO1FBQ1IsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLEdBQUc7UUFDUixFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxDQUFDLEdBQUc7UUFDUixFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxHQUFHO1FBQ1AsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLEtBQUs7UUFDVixFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsS0FBSztRQUNWLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxDQUFDLEtBQUs7UUFDVixFQUFFLEVBQUUsQ0FBQyxHQUFHO1FBQ1IsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsR0FBRztRQUNQLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsR0FBRztRQUNQLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxDQUFDLEtBQUs7UUFDVixFQUFFLEVBQUUsR0FBRztRQUNQLEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsR0FBRztRQUNQLEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsR0FBRztRQUNQLEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxHQUFHO1FBQ1AsRUFBRSxFQUFFLENBQUMsR0FBRztRQUNSLEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsR0FBRztRQUNSLEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxDQUFDLEdBQUc7UUFDUixFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLEdBQUc7UUFDUixFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULElBQUksRUFBRSxDQUFDLEdBQUc7S0FDWCxDQUFDO0lBQ0YsSUFBSSxDQUFDLEtBQUssR0FBRztRQUNYLEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsR0FBRztRQUNQLEVBQUUsRUFBRSxJQUFJO1FBQ1IsSUFBSSxFQUFFLENBQUMsSUFBSTtRQUNYLElBQUksRUFBRSxDQUFDLElBQUk7UUFDWCxFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsSUFBSTtRQUNSLElBQUksRUFBRSxJQUFJO1FBQ1YsSUFBSSxFQUFFLElBQUk7UUFDVixFQUFFLEVBQUUsQ0FBQyxHQUFHO1FBQ1IsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLEdBQUc7UUFDUixFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxJQUFJLEVBQUUsSUFBSTtRQUNWLElBQUksRUFBRSxJQUFJO1FBQ1YsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxHQUFHO1FBQ1IsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxHQUFHO1FBQ1IsRUFBRSxFQUFFLEdBQUc7UUFDUCxJQUFJLEVBQUUsSUFBSTtRQUNWLElBQUksRUFBRSxJQUFJO1FBQ1YsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxJQUFJO1FBQ1IsSUFBSSxFQUFFLENBQUMsSUFBSTtRQUNYLElBQUksRUFBRSxDQUFDLElBQUk7UUFDWCxFQUFFLEVBQUUsSUFBSTtRQUNSLElBQUksRUFBRSxJQUFJO1FBQ1YsSUFBSSxFQUFFLElBQUk7UUFDVixFQUFFLEVBQUUsR0FBRztRQUNQLEVBQUUsRUFBRSxHQUFHO1FBQ1AsSUFBSSxFQUFFLElBQUk7UUFDVixJQUFJLEVBQUUsSUFBSTtRQUNWLEVBQUUsRUFBRSxDQUFDLEdBQUc7UUFDUixFQUFFLEVBQUUsR0FBRztRQUNQLEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxHQUFHO1FBQ1IsSUFBSSxFQUFFLElBQUk7UUFDVixJQUFJLEVBQUUsSUFBSTtRQUNWLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxHQUFHO1FBQ1AsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsR0FBRztRQUNQLEVBQUUsRUFBRSxHQUFHO1FBQ1AsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsR0FBRztRQUNQLEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLENBQUMsR0FBRztRQUNSLEVBQUUsRUFBRSxJQUFJO1FBQ1IsSUFBSSxFQUFFLENBQUMsSUFBSTtRQUNYLElBQUksRUFBRSxDQUFDLElBQUk7UUFDWCxFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLElBQUk7UUFDUixJQUFJLEVBQUUsQ0FBQyxHQUFHO1FBQ1YsSUFBSSxFQUFFLENBQUMsR0FBRztRQUNWLEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxJQUFJLEVBQUUsSUFBSTtRQUNWLElBQUksRUFBRSxJQUFJO1FBQ1YsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLENBQUMsR0FBRztRQUNSLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsSUFBSTtRQUNSLElBQUksRUFBRSxHQUFHO1FBQ1QsSUFBSSxFQUFFLEdBQUc7UUFDVCxFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLENBQUMsR0FBRztRQUNSLEVBQUUsRUFBRSxHQUFHO1FBQ1AsRUFBRSxFQUFFLEdBQUc7UUFDUCxFQUFFLEVBQUUsR0FBRztRQUNQLEVBQUUsRUFBRSxHQUFHO1FBQ1AsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxJQUFJO1FBQ1IsQ0FBQyxFQUFFLEdBQUc7UUFDTixFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsSUFBSSxFQUFFLEdBQUc7UUFDVCxJQUFJLEVBQUUsR0FBRztRQUNULEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLEdBQUc7S0FDUixDQUFDO0lBQ0YsSUFBSSxDQUFDLEtBQUssR0FBRztRQUNYLEdBQUcsRUFBRSxJQUFJO1FBQ1QsR0FBRyxFQUFFLElBQUk7UUFDVCxHQUFHLEVBQUUsR0FBRztRQUNSLEdBQUcsRUFBRSxHQUFHO1FBQ1IsR0FBRyxFQUFFLENBQUMsR0FBRztRQUNULEdBQUcsRUFBRSxDQUFDLEdBQUc7UUFDVCxHQUFHLEVBQUUsSUFBSTtRQUNULEdBQUcsRUFBRSxDQUFDLEdBQUc7UUFDVCxHQUFHLEVBQUUsQ0FBQyxJQUFJO1FBQ1YsR0FBRyxFQUFFLEdBQUc7UUFDUixHQUFHLEVBQUUsR0FBRztRQUNSLEdBQUcsRUFBRSxDQUFDLElBQUk7S0FDWCxDQUFDO0lBQ0YsSUFBSSxDQUFDLEtBQUssR0FBRztRQUNYLEdBQUcsRUFBRSxJQUFJO1FBQ1QsR0FBRyxFQUFFLENBQUMsSUFBSTtRQUNWLEdBQUcsRUFBRSxDQUFDLElBQUk7UUFDVixHQUFHLEVBQUUsQ0FBQyxJQUFJO1FBQ1YsR0FBRyxFQUFFLEdBQUc7UUFDUixHQUFHLEVBQUUsQ0FBQyxJQUFJO0tBQ1gsQ0FBQztJQUNGLElBQUksQ0FBQyxLQUFLLEdBQUc7UUFDWCxHQUFHLEVBQUUsQ0FBQyxHQUFHO1FBQ1QsR0FBRyxFQUFFLEdBQUc7UUFDUixHQUFHLEVBQUUsQ0FBQyxHQUFHO1FBQ1QsR0FBRyxFQUFFLENBQUMsSUFBSTtRQUNWLEdBQUcsRUFBRSxHQUFHO1FBQ1IsR0FBRyxFQUFFLENBQUMsSUFBSTtRQUNWLEdBQUcsRUFBRSxHQUFHO1FBQ1IsR0FBRyxFQUFFLENBQUMsSUFBSTtRQUNWLEdBQUcsRUFBRSxDQUFDLElBQUk7UUFDVixHQUFHLEVBQUUsQ0FBQyxHQUFHO1FBQ1QsR0FBRyxFQUFFLENBQUMsSUFBSTtRQUNWLEdBQUcsRUFBRSxDQUFDLEdBQUc7UUFDVCxHQUFHLEVBQUUsQ0FBQyxJQUFJO1FBQ1YsR0FBRyxFQUFFLEdBQUc7UUFDUixHQUFHLEVBQUUsQ0FBQyxJQUFJO1FBQ1YsR0FBRyxFQUFFLENBQUMsSUFBSTtRQUNWLEdBQUcsRUFBRSxDQUFDLElBQUk7UUFDVixHQUFHLEVBQUUsQ0FBQyxHQUFHO1FBQ1QsR0FBRyxFQUFFLEdBQUc7UUFDUixHQUFHLEVBQUUsQ0FBQyxHQUFHO1FBQ1QsR0FBRyxFQUFFLENBQUMsSUFBSTtRQUNWLEdBQUcsRUFBRSxHQUFHO1FBQ1IsR0FBRyxFQUFFLENBQUMsSUFBSTtLQUNYLENBQUM7SUFDRixJQUFJLENBQUMsS0FBSyxHQUFHO1FBQ1gsR0FBRyxFQUFFLENBQUMsR0FBRztRQUNULEdBQUcsRUFBRSxJQUFJO1FBQ1QsR0FBRyxFQUFFLEdBQUc7UUFDUixHQUFHLEVBQUUsQ0FBQyxHQUFHO1FBQ1QsR0FBRyxFQUFFLEdBQUc7UUFDUixHQUFHLEVBQUUsR0FBRztRQUNSLEdBQUcsRUFBRSxHQUFHO1FBQ1IsR0FBRyxFQUFFLEdBQUc7UUFDUixHQUFHLEVBQUUsR0FBRztRQUNSLEdBQUcsRUFBRSxHQUFHO1FBQ1IsR0FBRyxFQUFFLENBQUMsSUFBSTtRQUNWLEdBQUcsRUFBRSxHQUFHO1FBQ1IsR0FBRyxFQUFFLElBQUk7UUFDVCxHQUFHLEVBQUUsR0FBRztRQUNSLEdBQUcsRUFBRSxFQUFFO1FBQ1AsR0FBRyxFQUFFLElBQUk7UUFDVCxHQUFHLEVBQUUsSUFBSTtRQUNULEdBQUcsRUFBRSxJQUFJO1FBQ1QsR0FBRyxFQUFFLENBQUMsR0FBRztRQUNULEdBQUcsRUFBRSxHQUFHO1FBQ1IsR0FBRyxFQUFFLENBQUMsR0FBRztRQUNULEdBQUcsRUFBRSxHQUFHO1FBQ1IsR0FBRyxFQUFFLEdBQUc7S0FDVCxDQUFDO0lBQ0YsSUFBSSxDQUFDLEtBQUssR0FBRztRQUNYLElBQUksRUFBRSxDQUFDLEdBQUc7UUFDVixJQUFJLEVBQUUsR0FBRztRQUNULElBQUksRUFBRSxDQUFDLEdBQUc7UUFDVixJQUFJLEVBQUUsRUFBRTtRQUNSLElBQUksRUFBRSxJQUFJO1FBQ1YsSUFBSSxFQUFFLENBQUMsR0FBRztRQUNWLElBQUksRUFBRSxHQUFHO1FBQ1QsSUFBSSxFQUFFLENBQUMsR0FBRztRQUNWLElBQUksRUFBRSxHQUFHO1FBQ1QsSUFBSSxFQUFFLEdBQUc7UUFDVCxJQUFJLEVBQUUsR0FBRztRQUNULElBQUksRUFBRSxHQUFHO1FBQ1QsSUFBSSxFQUFFLENBQUMsRUFBRTtLQUNWLENBQUM7SUFDRixJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDbkUsSUFBSSxDQUFDLEtBQUssR0FBRztRQUNYLElBQUksRUFBRSxHQUFHO1FBQ1QsSUFBSSxFQUFFLENBQUMsSUFBSTtRQUNYLElBQUksRUFBRSxHQUFHO1FBQ1QsSUFBSSxFQUFFLENBQUMsR0FBRztRQUNWLElBQUksRUFBRSxDQUFDLEdBQUc7UUFDVixJQUFJLEVBQUUsQ0FBQyxHQUFHO1FBQ1YsSUFBSSxFQUFFLENBQUMsR0FBRztRQUNWLElBQUksRUFBRSxDQUFDLEdBQUc7UUFDVixJQUFJLEVBQUUsR0FBRztRQUNULElBQUksRUFBRSxHQUFHO1FBQ1QsSUFBSSxFQUFFLElBQUk7UUFDVixJQUFJLEVBQUUsR0FBRztRQUNULElBQUksRUFBRSxHQUFHO1FBQ1QsSUFBSSxFQUFFLEdBQUc7UUFDVCxJQUFJLEVBQUUsSUFBSTtRQUNWLElBQUksRUFBRSxJQUFJO1FBQ1YsSUFBSSxFQUFFLEdBQUc7UUFDVCxJQUFJLEVBQUUsR0FBRztRQUNULElBQUksRUFBRSxHQUFHO1FBQ1QsSUFBSSxFQUFFLENBQUMsR0FBRztLQUNYLENBQUM7SUFDRixJQUFJLENBQUMsS0FBSyxHQUFHO1FBQ1gsSUFBSSxFQUFFLENBQUMsR0FBRztRQUNWLElBQUksRUFBRSxDQUFDLElBQUk7UUFDWCxJQUFJLEVBQUUsQ0FBQyxHQUFHO1FBQ1YsSUFBSSxFQUFFLENBQUMsR0FBRztRQUNWLElBQUksRUFBRSxDQUFDLElBQUk7UUFDWCxJQUFJLEVBQUUsQ0FBQyxJQUFJO1FBQ1gsSUFBSSxFQUFFLEdBQUc7UUFDVCxJQUFJLEVBQUUsQ0FBQyxHQUFHO1FBQ1YsSUFBSSxFQUFFLElBQUk7UUFDVixJQUFJLEVBQUUsR0FBRztRQUNULElBQUksRUFBRSxDQUFDLElBQUk7UUFDWCxJQUFJLEVBQUUsSUFBSTtRQUNWLElBQUksRUFBRSxDQUFDLEdBQUc7UUFDVixJQUFJLEVBQUUsR0FBRztRQUNULElBQUksRUFBRSxDQUFDLElBQUk7UUFDWCxJQUFJLEVBQUUsQ0FBQyxJQUFJO0tBQ1osQ0FBQztJQUNGLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDO0lBQ3ZDLElBQUksQ0FBQyxLQUFLLEdBQUc7UUFDWCxHQUFHLEVBQUUsQ0FBQyxJQUFJO1FBQ1YsR0FBRyxFQUFFLENBQUMsSUFBSTtRQUNWLEdBQUcsRUFBRSxDQUFDLElBQUk7UUFDVixHQUFHLEVBQUUsSUFBSTtRQUNULEdBQUcsRUFBRSxDQUFDLElBQUk7UUFDVixHQUFHLEVBQUUsQ0FBQyxJQUFJO1FBQ1YsR0FBRyxFQUFFLElBQUk7UUFDVCxHQUFHLEVBQUUsQ0FBQyxJQUFJO1FBQ1YsR0FBRyxFQUFFLENBQUMsSUFBSTtRQUNWLEdBQUcsRUFBRSxJQUFJO1FBQ1QsR0FBRyxFQUFFLENBQUMsR0FBRztRQUNULEdBQUcsRUFBRSxDQUFDLElBQUk7UUFDVixHQUFHLEVBQUUsQ0FBQyxJQUFJO1FBQ1YsR0FBRyxFQUFFLENBQUMsSUFBSTtRQUNWLEdBQUcsRUFBRSxDQUFDLElBQUk7UUFDVixHQUFHLEVBQUUsQ0FBQyxJQUFJO0tBQ1gsQ0FBQztJQUNGLElBQUksQ0FBQyxLQUFLLEdBQUc7UUFDWCxHQUFHLEVBQUUsQ0FBQyxJQUFJO1FBQ1YsR0FBRyxFQUFFLElBQUk7UUFDVCxHQUFHLEVBQUUsQ0FBQyxJQUFJO1FBQ1YsR0FBRyxFQUFFLENBQUMsSUFBSTtRQUNWLEdBQUcsRUFBRSxDQUFDLElBQUk7UUFDVixHQUFHLEVBQUUsQ0FBQyxJQUFJO1FBQ1YsS0FBSyxFQUFFLENBQUMsR0FBRztRQUNYLEtBQUssRUFBRSxDQUFDLEdBQUc7UUFDWCxHQUFHLEVBQUUsQ0FBQyxHQUFHO1FBQ1QsR0FBRyxFQUFFLENBQUMsSUFBSTtRQUNWLEdBQUcsRUFBRSxDQUFDLElBQUk7S0FDWCxDQUFDO0lBQ0YsSUFBSSxDQUFDLEtBQUssR0FBRztRQUNYLEtBQUssRUFBRSxJQUFJO1FBQ1gsS0FBSyxFQUFFLElBQUk7UUFDWCxHQUFHLEVBQUUsQ0FBQyxJQUFJO1FBQ1YsR0FBRyxFQUFFLElBQUk7UUFDVCxLQUFLLEVBQUUsSUFBSTtRQUNYLEtBQUssRUFBRSxJQUFJO1FBQ1gsR0FBRyxFQUFFLElBQUk7UUFDVCxHQUFHLEVBQUUsSUFBSTtRQUNULEdBQUcsRUFBRSxJQUFJO1FBQ1QsR0FBRyxFQUFFLElBQUk7UUFDVCxHQUFHLEVBQUUsQ0FBQyxJQUFJO1FBQ1YsR0FBRyxFQUFFLElBQUk7S0FDVixDQUFDO0lBQ0YsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQ2hELElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO0lBQ25FLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDO0lBQ25DLElBQUksQ0FBQyxLQUFLLEdBQUc7UUFDWCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsSUFBSTtLQUNSLENBQUM7SUFDRixJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDNUQsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQzFELElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUN6QixJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7SUFDL0IsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztJQUN4QixJQUFJLENBQUMsS0FBSyxHQUFHO1FBQ1gsRUFBRSxFQUFFLEVBQUU7UUFDTixFQUFFLEVBQUUsQ0FBQyxFQUFFO1FBQ1AsRUFBRSxFQUFFLENBQUMsRUFBRTtRQUNQLEVBQUUsRUFBRSxHQUFHO1FBQ1AsRUFBRSxFQUFFLENBQUMsRUFBRTtRQUNQLEVBQUUsRUFBRSxDQUFDLEVBQUU7UUFDUCxFQUFFLEVBQUUsR0FBRztRQUNQLEVBQUUsRUFBRSxHQUFHO1FBQ1AsRUFBRSxFQUFFLENBQUMsSUFBSTtLQUNWLENBQUM7SUFDRixJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsQ0FBQztJQUM1QyxJQUFJLENBQUMsS0FBSyxHQUFHO1FBQ1gsRUFBRSxFQUFFLENBQUMsR0FBRztRQUNSLEVBQUUsRUFBRSxFQUFFO1FBQ04sRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxLQUFLO1FBQ1QsRUFBRSxFQUFFLENBQUMsR0FBRztRQUNSLEVBQUUsRUFBRSxDQUFDLElBQUk7S0FDVixDQUFDO0lBQ0YsSUFBSSxDQUFDLEtBQUssR0FBRztRQUNYLEdBQUcsRUFBRSxHQUFHO1FBQ1IsR0FBRyxFQUFFLEdBQUc7UUFDUixHQUFHLEVBQUUsQ0FBQyxHQUFHO1FBQ1QsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsR0FBRyxFQUFFLENBQUMsR0FBRztRQUNULENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsR0FBRyxFQUFFLENBQUMsR0FBRztRQUNULEdBQUcsRUFBRSxDQUFDLEdBQUc7S0FDVixDQUFDO0lBQ0YsSUFBSSxDQUFDLEtBQUssR0FBRztRQUNYLEdBQUcsRUFBRSxDQUFDLEdBQUc7UUFDVCxHQUFHLEVBQUUsQ0FBQyxHQUFHO1FBQ1QsQ0FBQyxFQUFFLEdBQUc7UUFDTixHQUFHLEVBQUUsQ0FBQyxHQUFHO1FBQ1QsR0FBRyxFQUFFLElBQUk7UUFDVCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLEdBQUcsRUFBRSxDQUFDLEdBQUc7UUFDVCxHQUFHLEVBQUUsSUFBSTtRQUNULENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLEdBQUc7S0FDUCxDQUFDO0lBQ0YsSUFBSSxDQUFDLEtBQUssR0FBRztRQUNYLEdBQUcsRUFBRSxJQUFJO1FBQ1QsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLEdBQUcsRUFBRSxDQUFDLElBQUk7UUFDVixHQUFHLEVBQUUsSUFBSTtRQUNULENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsSUFBSTtRQUNQLEdBQUcsRUFBRSxJQUFJO1FBQ1QsR0FBRyxFQUFFLENBQUMsSUFBSTtRQUNWLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsR0FBRztRQUNOLEdBQUcsRUFBRSxDQUFDLElBQUk7UUFDVixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLElBQUk7UUFDUCxHQUFHLEVBQUUsQ0FBQyxHQUFHO1FBQ1QsR0FBRyxFQUFFLElBQUk7UUFDVCxHQUFHLEVBQUUsQ0FBQyxJQUFJO1FBQ1YsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxHQUFHO1FBQ04sRUFBRSxFQUFFLElBQUk7UUFDUixDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLEdBQUc7S0FDUCxDQUFDO0lBQ0YsSUFBSSxDQUFDLEtBQUssR0FBRztRQUNYLEdBQUcsRUFBRSxJQUFJO1FBQ1QsR0FBRyxFQUFFLElBQUk7UUFDVCxHQUFHLEVBQUUsQ0FBQyxJQUFJO1FBQ1YsR0FBRyxFQUFFLElBQUk7UUFDVCxHQUFHLEVBQUUsSUFBSTtRQUNULENBQUMsRUFBRSxJQUFJO1FBQ1AsR0FBRyxFQUFFLElBQUk7UUFDVCxHQUFHLEVBQUUsSUFBSTtRQUNULEdBQUcsRUFBRSxDQUFDLElBQUk7UUFDVixDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLEtBQUs7UUFDVCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsS0FBSztRQUNSLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsR0FBRyxFQUFFLENBQUMsSUFBSTtRQUNWLENBQUMsRUFBRSxDQUFDLEtBQUs7UUFDVCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxJQUFJO1FBQ1AsR0FBRyxFQUFFLElBQUk7UUFDVCxHQUFHLEVBQUUsSUFBSTtRQUNULEdBQUcsRUFBRSxDQUFDLElBQUk7UUFDVixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsS0FBSztRQUNULENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtLQUNULENBQUM7SUFDRixJQUFJLENBQUMsS0FBSyxHQUFHO1FBQ1gsR0FBRyxFQUFFLEdBQUc7UUFDUixHQUFHLEVBQUUsQ0FBQyxHQUFHO1FBQ1QsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLEVBQUUsRUFBRSxDQUFDLEtBQUs7UUFDVixHQUFHLEVBQUUsQ0FBQyxJQUFJO1FBQ1YsR0FBRyxFQUFFLEdBQUc7UUFDUixHQUFHLEVBQUUsQ0FBQyxHQUFHO1FBQ1QsR0FBRyxFQUFFLEdBQUc7UUFDUixDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLEVBQUU7UUFDTCxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLEVBQUU7UUFDTixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLEdBQUcsRUFBRSxDQUFDLEdBQUc7UUFDVCxFQUFFLEVBQUUsQ0FBQyxLQUFLO1FBQ1YsR0FBRyxFQUFFLEdBQUc7UUFDUixDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsR0FBRztLQUNSLENBQUM7SUFDRixJQUFJLENBQUMsS0FBSyxHQUFHO1FBQ1gsR0FBRyxFQUFFLEdBQUc7UUFDUixHQUFHLEVBQUUsR0FBRztRQUNSLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxFQUFFLEVBQUUsR0FBRztRQUNQLEdBQUcsRUFBRSxHQUFHO1FBQ1IsR0FBRyxFQUFFLEdBQUc7UUFDUixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLEVBQUU7UUFDTixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLElBQUk7UUFDUCxHQUFHLEVBQUUsQ0FBQyxHQUFHO1FBQ1QsRUFBRSxFQUFFLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztLQUNSLENBQUM7SUFFRixPQUFPLElBQUksQ0FBQztBQUNkLENBQUM7QUFFRCxhQUFhLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxVQUFVLEdBQUc7SUFDNUMsS0FBSyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO1FBQzVCLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDbkMsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQzdCO0tBQ0Y7SUFDRCxPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUMsQ0FBQztBQUVGLGFBQWEsQ0FBQyxTQUFTLENBQUMsR0FBRyxHQUFHLFVBQVUsQ0FBQztJQUN2QyxJQUFJLENBQUMsRUFBRTtRQUNMLE9BQU8sQ0FBQyxDQUFDO0tBQ1Y7SUFDRCxPQUFPLENBQUMsQ0FBQztBQUNYLENBQUMsQ0FBQztBQUVGLGFBQWEsQ0FBQyxTQUFTLENBQUMsT0FBTyxHQUFHLFVBQVUsS0FBSztJQUMvQyxJQUFJLEtBQUssSUFBSSxJQUFJLElBQUksS0FBSyxJQUFJLFNBQVMsSUFBSSxLQUFLLElBQUksRUFBRSxFQUFFO1FBQ3RELE9BQU8sRUFBRSxDQUFDO0tBQ1g7SUFDRCxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7SUFDaEIsSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzdCLElBQUksS0FBSyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUM1QixJQUFJLENBQUMsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ3hCLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRTtRQUM3QixHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2YsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDL0I7SUFDRCxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2YsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNmLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDZixLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2hCLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDaEIsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNoQixJQUFJLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbEIsSUFBSSxFQUFFLEdBQUcsR0FBRyxDQUFDO0lBQ2IsSUFBSSxFQUFFLEdBQUcsR0FBRyxDQUFDO0lBQ2IsSUFBSSxFQUFFLEdBQUcsR0FBRyxDQUFDO0lBQ2IsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFO1FBQ3ZDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDeEIsSUFBSSxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNwQixJQUFJLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3BCLElBQUksRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDcEIsSUFBSSxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2hCLElBQUksRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDcEIsSUFBSSxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNwQixJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDdEIsSUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN0QixJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbEIsSUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN0QixJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLEtBQUssSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNsQyxLQUFLLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDbEMsS0FBSyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ2xDLEtBQUssSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDdkMsS0FBSyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN2QyxLQUFLLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDbEMsS0FBSyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ2xDLEtBQUssSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNsQyxLQUFLLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDbEMsS0FBSyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ2xDLEtBQUssSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNsQyxLQUFLLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3ZDLEtBQUssSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDdkMsS0FBSyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN2QyxLQUFLLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM1QyxLQUFLLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM1QyxLQUFLLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM1QyxLQUFLLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM1QyxLQUFLLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDbEMsS0FBSyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ2xDLEtBQUssSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNsQyxLQUFLLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDbEMsS0FBSyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ2xDLEtBQUssSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNsQyxLQUFLLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3ZDLEtBQUssSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDdkMsS0FBSyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN2QyxLQUFLLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM1QyxLQUFLLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM1QyxLQUFLLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM1QyxLQUFLLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQzs7UUFFNUMsS0FBSyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN2QyxLQUFLLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3ZDLEtBQUssSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDdkMsS0FBSyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDNUMsS0FBSyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDNUMsS0FBSyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDNUMsS0FBSyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDNUMsS0FBSyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ2pELEtBQUssSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcs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
