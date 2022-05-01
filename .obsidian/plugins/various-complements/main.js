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
    createRenderSuggestion(word) {
        const text = word.value;
        if (this.settings.delimiterToDivideSuggestionsForDisplayFromInsertion &&
            text.includes(this.settings.delimiterToDivideSuggestionsForDisplayFromInsertion)) {
            return (text.split(this.settings.delimiterToDivideSuggestionsForDisplayFromInsertion)[0] + this.settings.displayedTextSuffix);
        }
        if (this.settings.delimiterToHideSuggestion &&
            text.includes(this.settings.delimiterToHideSuggestion)) {
            return `${text.split(this.settings.delimiterToHideSuggestion)[0]} ...`;
        }
        return text;
    }
    renderSuggestion(word, el) {
        const base = createDiv();
        base.createDiv({
            text: this.createRenderSuggestion(word),
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
        if (this.settings.delimiterToDivideSuggestionsForDisplayFromInsertion &&
            insertedText.includes(this.settings.delimiterToDivideSuggestionsForDisplayFromInsertion)) {
            insertedText = insertedText.split(this.settings.delimiterToDivideSuggestionsForDisplayFromInsertion)[1];
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
            yield this.plugin.saveSettings({
                currentFile: true,
                currentVault: true,
            });
        })));
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
    getPluginSettingsAsJsonString() {
        return JSON.stringify({
            version: this.plugin.manifest.version,
            mobile: this.app.isMobile,
            settings: Object.assign(Object.assign({}, this.plugin.settings), { selectionHistoryTree: null }),
        }, null, 4);
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
function custom_event(type, detail, bubbles = false) {
    const e = document.createEvent('CustomEvent');
    e.initCustomEvent(type, bubbles, false, detail);
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
    return (type, detail) => {
        const callbacks = component.$$.callbacks[type];
        if (callbacks) {
            // TODO are there situations where events could be dispatched
            // in a server (non-DOM) environment?
            const event = custom_event(type, detail);
            callbacks.slice().forEach(fn => {
                fn.call(component, event);
            });
        }
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

/* src/ui/component/ObsidianButton.svelte generated by Svelte v3.47.0 */

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

/* node_modules/svelte-lucide-icons/icons/File.svelte generated by Svelte v3.47.0 */

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

/* src/ui/component/ObsidianIconButton.svelte generated by Svelte v3.47.0 */

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

/* src/ui/component/CustomDictionaryWordAdd.svelte generated by Svelte v3.47.0 */

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[26] = list[i];
	return child_ctx;
}

// (49:6) {#each dictionaries as dictionary}
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

// (55:4) <ObsidianIconButton       popup="Open the file"       on:click={() => onClickFileIcon(selectedDictionary.path)}     >
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

// (71:2) {#if enableDisplayedWord}
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

// (78:2) {#if useDisplayedWord}
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

// (95:4) <ObsidianButton disabled={!enableSubmit} on:click={handleSubmit}       >
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
			value: displayedWord
			? `${displayedWord}${dividerForDisplay}${word}`
			: word,
			description,
			createdPath: selectedDictionary.path,
			aliases: aliasesStr.split("\n"),
			type: "customDictionary"
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
            this.statusBar = ProviderStatusBar.new(this.addStatusBarItem(), this.settings.showMatchStrategy, this.settings.showIndexingStatus);
            this.statusBar.setOnClickStrategyListener(() => __awaiter(this, void 0, void 0, function* () {
                yield this.settingTab.toggleMatchStrategy();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsInNyYy91dGlsL3N0cmluZ3MudHMiLCJzcmMvdG9rZW5pemVyL3Rva2VuaXplcnMvRGVmYXVsdFRva2VuaXplci50cyIsInNyYy90b2tlbml6ZXIvdG9rZW5pemVycy9BcmFiaWNUb2tlbml6ZXIudHMiLCJzcmMvZXh0ZXJuYWwvdGlueS1zZWdtZW50ZXIudHMiLCJzcmMvdG9rZW5pemVyL3Rva2VuaXplcnMvSmFwYW5lc2VUb2tlbml6ZXIudHMiLCJzcmMvdG9rZW5pemVyL3Rva2VuaXplcnMvRW5nbGlzaE9ubHlUb2tlbml6ZXIudHMiLCJzcmMvdG9rZW5pemVyL3Rva2VuaXplci50cyIsInNyYy90b2tlbml6ZXIvVG9rZW5pemVTdHJhdGVneS50cyIsInNyYy9hcHAtaGVscGVyLnRzIiwic3JjL3V0aWwvY29sbGVjdGlvbi1oZWxwZXIudHMiLCJzcmMvbW9kZWwvV29yZC50cyIsInNyYy9wcm92aWRlci9zdWdnZXN0ZXIudHMiLCJzcmMvdXRpbC9wYXRoLnRzIiwic3JjL3Byb3ZpZGVyL0N1c3RvbURpY3Rpb25hcnlXb3JkUHJvdmlkZXIudHMiLCJzcmMvcHJvdmlkZXIvQ3VycmVudEZpbGVXb3JkUHJvdmlkZXIudHMiLCJzcmMvcHJvdmlkZXIvSW50ZXJuYWxMaW5rV29yZFByb3ZpZGVyLnRzIiwic3JjL3Byb3ZpZGVyL01hdGNoU3RyYXRlZ3kudHMiLCJzcmMvb3B0aW9uL0N5Y2xlVGhyb3VnaFN1Z2dlc3Rpb25zS2V5cy50cyIsInNyYy9vcHRpb24vQ29sdW1uRGVsaW1pdGVyLnRzIiwic3JjL29wdGlvbi9TZWxlY3RTdWdnZXN0aW9uS2V5LnRzIiwic3JjL3Byb3ZpZGVyL0N1cnJlbnRWYXVsdFdvcmRQcm92aWRlci50cyIsInNyYy9vcHRpb24vT3BlblNvdXJjZUZpbGVLZXlzLnRzIiwic3JjL29wdGlvbi9EZXNjcmlwdGlvbk9uU3VnZ2VzdGlvbi50cyIsInNyYy9wcm92aWRlci9Gcm9udE1hdHRlcldvcmRQcm92aWRlci50cyIsInNyYy9wcm92aWRlci9TcGVjaWZpY01hdGNoU3RyYXRlZ3kudHMiLCJzcmMvc3RvcmFnZS9TZWxlY3Rpb25IaXN0b3J5U3RvcmFnZS50cyIsInNyYy91aS9BdXRvQ29tcGxldGVTdWdnZXN0LnRzIiwic3JjL3NldHRpbmcvc2V0dGluZ3MudHMiLCJzcmMvdWkvUHJvdmlkZXJTdGF0dXNCYXIudHMiLCJub2RlX21vZHVsZXMvc3ZlbHRlL2ludGVybmFsL2luZGV4Lm1qcyIsInNyYy91aS9jb21wb25lbnQvT2JzaWRpYW5CdXR0b24uc3ZlbHRlIiwibm9kZV9tb2R1bGVzL3N2ZWx0ZS1sdWNpZGUtaWNvbnMvaWNvbnMvRmlsZS5zdmVsdGUiLCJzcmMvdWkvY29tcG9uZW50L09ic2lkaWFuSWNvbkJ1dHRvbi5zdmVsdGUiLCJzcmMvdWkvY29tcG9uZW50L0N1c3RvbURpY3Rpb25hcnlXb3JkQWRkLnN2ZWx0ZSIsInNyYy91aS9DdXN0b21EaWN0aW9uYXJ5V29yZEFkZE1vZGFsLnRzIiwic3JjL21haW4udHMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5Db3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi5cclxuXHJcblBlcm1pc3Npb24gdG8gdXNlLCBjb3B5LCBtb2RpZnksIGFuZC9vciBkaXN0cmlidXRlIHRoaXMgc29mdHdhcmUgZm9yIGFueVxyXG5wdXJwb3NlIHdpdGggb3Igd2l0aG91dCBmZWUgaXMgaGVyZWJ5IGdyYW50ZWQuXHJcblxyXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiIEFORCBUSEUgQVVUSE9SIERJU0NMQUlNUyBBTEwgV0FSUkFOVElFUyBXSVRIXHJcblJFR0FSRCBUTyBUSElTIFNPRlRXQVJFIElOQ0xVRElORyBBTEwgSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWVxyXG5BTkQgRklUTkVTUy4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUiBCRSBMSUFCTEUgRk9SIEFOWSBTUEVDSUFMLCBESVJFQ1QsXHJcbklORElSRUNULCBPUiBDT05TRVFVRU5USUFMIERBTUFHRVMgT1IgQU5ZIERBTUFHRVMgV0hBVFNPRVZFUiBSRVNVTFRJTkcgRlJPTVxyXG5MT1NTIE9GIFVTRSwgREFUQSBPUiBQUk9GSVRTLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgTkVHTElHRU5DRSBPUlxyXG5PVEhFUiBUT1JUSU9VUyBBQ1RJT04sIEFSSVNJTkcgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgVVNFIE9SXHJcblBFUkZPUk1BTkNFIE9GIFRISVMgU09GVFdBUkUuXHJcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXHJcbi8qIGdsb2JhbCBSZWZsZWN0LCBQcm9taXNlICovXHJcblxyXG52YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uKGQsIGIpIHtcclxuICAgIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGIsIHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXh0ZW5kcyhkLCBiKSB7XHJcbiAgICBpZiAodHlwZW9mIGIgIT09IFwiZnVuY3Rpb25cIiAmJiBiICE9PSBudWxsKVxyXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDbGFzcyBleHRlbmRzIHZhbHVlIFwiICsgU3RyaW5nKGIpICsgXCIgaXMgbm90IGEgY29uc3RydWN0b3Igb3IgbnVsbFwiKTtcclxuICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxufVxyXG5cclxuZXhwb3J0IHZhciBfX2Fzc2lnbiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uIF9fYXNzaWduKHQpIHtcclxuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcclxuICAgICAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKSB0W3BdID0gc1twXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVzdChzLCBlKSB7XHJcbiAgICB2YXIgdCA9IHt9O1xyXG4gICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApICYmIGUuaW5kZXhPZihwKSA8IDApXHJcbiAgICAgICAgdFtwXSA9IHNbcF07XHJcbiAgICBpZiAocyAhPSBudWxsICYmIHR5cGVvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzID09PSBcImZ1bmN0aW9uXCIpXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIHAgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHMpOyBpIDwgcC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoZS5pbmRleE9mKHBbaV0pIDwgMCAmJiBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwocywgcFtpXSkpXHJcbiAgICAgICAgICAgICAgICB0W3BbaV1dID0gc1twW2ldXTtcclxuICAgICAgICB9XHJcbiAgICByZXR1cm4gdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpIHtcclxuICAgIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aCwgciA9IGMgPCAzID8gdGFyZ2V0IDogZGVzYyA9PT0gbnVsbCA/IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSA6IGRlc2MsIGQ7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO1xyXG4gICAgZWxzZSBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgaWYgKGQgPSBkZWNvcmF0b3JzW2ldKSByID0gKGMgPCAzID8gZChyKSA6IGMgPiAzID8gZCh0YXJnZXQsIGtleSwgcikgOiBkKHRhcmdldCwga2V5KSkgfHwgcjtcclxuICAgIHJldHVybiBjID4gMyAmJiByICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgciksIHI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3BhcmFtKHBhcmFtSW5kZXgsIGRlY29yYXRvcikge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIGtleSkgeyBkZWNvcmF0b3IodGFyZ2V0LCBrZXksIHBhcmFtSW5kZXgpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKSB7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QubWV0YWRhdGEgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIFJlZmxlY3QubWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdGVyKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xyXG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZ2VuZXJhdG9yKHRoaXNBcmcsIGJvZHkpIHtcclxuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XHJcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xyXG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcclxuICAgICAgICB3aGlsZSAoXykgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xyXG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XHJcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxyXG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgdmFyIF9fY3JlYXRlQmluZGluZyA9IE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICB2YXIgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobSwgayk7XHJcbiAgICBpZiAoIWRlc2MgfHwgKFwiZ2V0XCIgaW4gZGVzYyA/ICFtLl9fZXNNb2R1bGUgOiBkZXNjLndyaXRhYmxlIHx8IGRlc2MuY29uZmlndXJhYmxlKSkge1xyXG4gICAgICAgIGRlc2MgPSB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBtW2tdOyB9IH07XHJcbiAgICB9XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgazIsIGRlc2MpO1xyXG59KSA6IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xyXG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcclxuICAgIG9bazJdID0gbVtrXTtcclxufSk7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHBvcnRTdGFyKG0sIG8pIHtcclxuICAgIGZvciAodmFyIHAgaW4gbSkgaWYgKHAgIT09IFwiZGVmYXVsdFwiICYmICFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobywgcCkpIF9fY3JlYXRlQmluZGluZyhvLCBtLCBwKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fdmFsdWVzKG8pIHtcclxuICAgIHZhciBzID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIFN5bWJvbC5pdGVyYXRvciwgbSA9IHMgJiYgb1tzXSwgaSA9IDA7XHJcbiAgICBpZiAobSkgcmV0dXJuIG0uY2FsbChvKTtcclxuICAgIGlmIChvICYmIHR5cGVvZiBvLmxlbmd0aCA9PT0gXCJudW1iZXJcIikgcmV0dXJuIHtcclxuICAgICAgICBuZXh0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmIChvICYmIGkgPj0gby5sZW5ndGgpIG8gPSB2b2lkIDA7XHJcbiAgICAgICAgICAgIHJldHVybiB7IHZhbHVlOiBvICYmIG9baSsrXSwgZG9uZTogIW8gfTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihzID8gXCJPYmplY3QgaXMgbm90IGl0ZXJhYmxlLlwiIDogXCJTeW1ib2wuaXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZWFkKG8sIG4pIHtcclxuICAgIHZhciBtID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXTtcclxuICAgIGlmICghbSkgcmV0dXJuIG87XHJcbiAgICB2YXIgaSA9IG0uY2FsbChvKSwgciwgYXIgPSBbXSwgZTtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgd2hpbGUgKChuID09PSB2b2lkIDAgfHwgbi0tID4gMCkgJiYgIShyID0gaS5uZXh0KCkpLmRvbmUpIGFyLnB1c2goci52YWx1ZSk7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZXJyb3IpIHsgZSA9IHsgZXJyb3I6IGVycm9yIH07IH1cclxuICAgIGZpbmFsbHkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChyICYmICFyLmRvbmUgJiYgKG0gPSBpW1wicmV0dXJuXCJdKSkgbS5jYWxsKGkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmaW5hbGx5IHsgaWYgKGUpIHRocm93IGUuZXJyb3I7IH1cclxuICAgIH1cclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuLyoqIEBkZXByZWNhdGVkICovXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZCgpIHtcclxuICAgIGZvciAodmFyIGFyID0gW10sIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIGFyID0gYXIuY29uY2F0KF9fcmVhZChhcmd1bWVudHNbaV0pKTtcclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuLyoqIEBkZXByZWNhdGVkICovXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZEFycmF5cygpIHtcclxuICAgIGZvciAodmFyIHMgPSAwLCBpID0gMCwgaWwgPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgaWw7IGkrKykgcyArPSBhcmd1bWVudHNbaV0ubGVuZ3RoO1xyXG4gICAgZm9yICh2YXIgciA9IEFycmF5KHMpLCBrID0gMCwgaSA9IDA7IGkgPCBpbDsgaSsrKVxyXG4gICAgICAgIGZvciAodmFyIGEgPSBhcmd1bWVudHNbaV0sIGogPSAwLCBqbCA9IGEubGVuZ3RoOyBqIDwgamw7IGorKywgaysrKVxyXG4gICAgICAgICAgICByW2tdID0gYVtqXTtcclxuICAgIHJldHVybiByO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWRBcnJheSh0bywgZnJvbSwgcGFjaykge1xyXG4gICAgaWYgKHBhY2sgfHwgYXJndW1lbnRzLmxlbmd0aCA9PT0gMikgZm9yICh2YXIgaSA9IDAsIGwgPSBmcm9tLmxlbmd0aCwgYXI7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICBpZiAoYXIgfHwgIShpIGluIGZyb20pKSB7XHJcbiAgICAgICAgICAgIGlmICghYXIpIGFyID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZnJvbSwgMCwgaSk7XHJcbiAgICAgICAgICAgIGFyW2ldID0gZnJvbVtpXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdG8uY29uY2F0KGFyIHx8IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGZyb20pKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXQodikge1xyXG4gICAgcmV0dXJuIHRoaXMgaW5zdGFuY2VvZiBfX2F3YWl0ID8gKHRoaXMudiA9IHYsIHRoaXMpIDogbmV3IF9fYXdhaXQodik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jR2VuZXJhdG9yKHRoaXNBcmcsIF9hcmd1bWVudHMsIGdlbmVyYXRvcikge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBnID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pLCBpLCBxID0gW107XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaWYgKGdbbl0pIGlbbl0gPSBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKGEsIGIpIHsgcS5wdXNoKFtuLCB2LCBhLCBiXSkgPiAxIHx8IHJlc3VtZShuLCB2KTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHJlc3VtZShuLCB2KSB7IHRyeSB7IHN0ZXAoZ1tuXSh2KSk7IH0gY2F0Y2ggKGUpIHsgc2V0dGxlKHFbMF1bM10sIGUpOyB9IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAocikgeyByLnZhbHVlIGluc3RhbmNlb2YgX19hd2FpdCA/IFByb21pc2UucmVzb2x2ZShyLnZhbHVlLnYpLnRoZW4oZnVsZmlsbCwgcmVqZWN0KSA6IHNldHRsZShxWzBdWzJdLCByKTsgfVxyXG4gICAgZnVuY3Rpb24gZnVsZmlsbCh2YWx1ZSkgeyByZXN1bWUoXCJuZXh0XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gcmVqZWN0KHZhbHVlKSB7IHJlc3VtZShcInRocm93XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKGYsIHYpIHsgaWYgKGYodiksIHEuc2hpZnQoKSwgcS5sZW5ndGgpIHJlc3VtZShxWzBdWzBdLCBxWzBdWzFdKTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0RlbGVnYXRvcihvKSB7XHJcbiAgICB2YXIgaSwgcDtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiwgZnVuY3Rpb24gKGUpIHsgdGhyb3cgZTsgfSksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4sIGYpIHsgaVtuXSA9IG9bbl0gPyBmdW5jdGlvbiAodikgeyByZXR1cm4gKHAgPSAhcCkgPyB7IHZhbHVlOiBfX2F3YWl0KG9bbl0odikpLCBkb25lOiBuID09PSBcInJldHVyblwiIH0gOiBmID8gZih2KSA6IHY7IH0gOiBmOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jVmFsdWVzKG8pIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgbSA9IG9bU3ltYm9sLmFzeW5jSXRlcmF0b3JdLCBpO1xyXG4gICAgcmV0dXJuIG0gPyBtLmNhbGwobykgOiAobyA9IHR5cGVvZiBfX3ZhbHVlcyA9PT0gXCJmdW5jdGlvblwiID8gX192YWx1ZXMobykgOiBvW1N5bWJvbC5pdGVyYXRvcl0oKSwgaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGkpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlbbl0gPSBvW25dICYmIGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7IHYgPSBvW25dKHYpLCBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCB2LmRvbmUsIHYudmFsdWUpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgZCwgdikgeyBQcm9taXNlLnJlc29sdmUodikudGhlbihmdW5jdGlvbih2KSB7IHJlc29sdmUoeyB2YWx1ZTogdiwgZG9uZTogZCB9KTsgfSwgcmVqZWN0KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tYWtlVGVtcGxhdGVPYmplY3QoY29va2VkLCByYXcpIHtcclxuICAgIGlmIChPYmplY3QuZGVmaW5lUHJvcGVydHkpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvb2tlZCwgXCJyYXdcIiwgeyB2YWx1ZTogcmF3IH0pOyB9IGVsc2UgeyBjb29rZWQucmF3ID0gcmF3OyB9XHJcbiAgICByZXR1cm4gY29va2VkO1xyXG59O1xyXG5cclxudmFyIF9fc2V0TW9kdWxlRGVmYXVsdCA9IE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgdikge1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIFwiZGVmYXVsdFwiLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2IH0pO1xyXG59KSA6IGZ1bmN0aW9uKG8sIHYpIHtcclxuICAgIG9bXCJkZWZhdWx0XCJdID0gdjtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydFN0YXIobW9kKSB7XHJcbiAgICBpZiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSByZXR1cm4gbW9kO1xyXG4gICAgdmFyIHJlc3VsdCA9IHt9O1xyXG4gICAgaWYgKG1vZCAhPSBudWxsKSBmb3IgKHZhciBrIGluIG1vZCkgaWYgKGsgIT09IFwiZGVmYXVsdFwiICYmIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtb2QsIGspKSBfX2NyZWF0ZUJpbmRpbmcocmVzdWx0LCBtb2QsIGspO1xyXG4gICAgX19zZXRNb2R1bGVEZWZhdWx0KHJlc3VsdCwgbW9kKTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydERlZmF1bHQobW9kKSB7XHJcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IGRlZmF1bHQ6IG1vZCB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19jbGFzc1ByaXZhdGVGaWVsZEdldChyZWNlaXZlciwgc3RhdGUsIGtpbmQsIGYpIHtcclxuICAgIGlmIChraW5kID09PSBcImFcIiAmJiAhZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlByaXZhdGUgYWNjZXNzb3Igd2FzIGRlZmluZWQgd2l0aG91dCBhIGdldHRlclwiKTtcclxuICAgIGlmICh0eXBlb2Ygc3RhdGUgPT09IFwiZnVuY3Rpb25cIiA/IHJlY2VpdmVyICE9PSBzdGF0ZSB8fCAhZiA6ICFzdGF0ZS5oYXMocmVjZWl2ZXIpKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IHJlYWQgcHJpdmF0ZSBtZW1iZXIgZnJvbSBhbiBvYmplY3Qgd2hvc2UgY2xhc3MgZGlkIG5vdCBkZWNsYXJlIGl0XCIpO1xyXG4gICAgcmV0dXJuIGtpbmQgPT09IFwibVwiID8gZiA6IGtpbmQgPT09IFwiYVwiID8gZi5jYWxsKHJlY2VpdmVyKSA6IGYgPyBmLnZhbHVlIDogc3RhdGUuZ2V0KHJlY2VpdmVyKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fY2xhc3NQcml2YXRlRmllbGRTZXQocmVjZWl2ZXIsIHN0YXRlLCB2YWx1ZSwga2luZCwgZikge1xyXG4gICAgaWYgKGtpbmQgPT09IFwibVwiKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiUHJpdmF0ZSBtZXRob2QgaXMgbm90IHdyaXRhYmxlXCIpO1xyXG4gICAgaWYgKGtpbmQgPT09IFwiYVwiICYmICFmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiUHJpdmF0ZSBhY2Nlc3NvciB3YXMgZGVmaW5lZCB3aXRob3V0IGEgc2V0dGVyXCIpO1xyXG4gICAgaWYgKHR5cGVvZiBzdGF0ZSA9PT0gXCJmdW5jdGlvblwiID8gcmVjZWl2ZXIgIT09IHN0YXRlIHx8ICFmIDogIXN0YXRlLmhhcyhyZWNlaXZlcikpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3Qgd3JpdGUgcHJpdmF0ZSBtZW1iZXIgdG8gYW4gb2JqZWN0IHdob3NlIGNsYXNzIGRpZCBub3QgZGVjbGFyZSBpdFwiKTtcclxuICAgIHJldHVybiAoa2luZCA9PT0gXCJhXCIgPyBmLmNhbGwocmVjZWl2ZXIsIHZhbHVlKSA6IGYgPyBmLnZhbHVlID0gdmFsdWUgOiBzdGF0ZS5zZXQocmVjZWl2ZXIsIHZhbHVlKSksIHZhbHVlO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19jbGFzc1ByaXZhdGVGaWVsZEluKHN0YXRlLCByZWNlaXZlcikge1xyXG4gICAgaWYgKHJlY2VpdmVyID09PSBudWxsIHx8ICh0eXBlb2YgcmVjZWl2ZXIgIT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIHJlY2VpdmVyICE9PSBcImZ1bmN0aW9uXCIpKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IHVzZSAnaW4nIG9wZXJhdG9yIG9uIG5vbi1vYmplY3RcIik7XHJcbiAgICByZXR1cm4gdHlwZW9mIHN0YXRlID09PSBcImZ1bmN0aW9uXCIgPyByZWNlaXZlciA9PT0gc3RhdGUgOiBzdGF0ZS5oYXMocmVjZWl2ZXIpO1xyXG59XHJcbiIsImNvbnN0IHJlZ0Vtb2ppID0gbmV3IFJlZ0V4cChcbiAgL1tcXHUyNzAwLVxcdTI3QkZdfFtcXHVFMDAwLVxcdUY4RkZdfFxcdUQ4M0NbXFx1REMwMC1cXHVERkZGXXxcXHVEODNEW1xcdURDMDAtXFx1REZGRl18W1xcdTIwMTEtXFx1MjZGRl18XFx1RDgzRVtcXHVERDEwLVxcdURERkZdfFtcXHVGRTBFLVxcdUZFMEZdLyxcbiAgXCJnXCJcbik7XG5cbmV4cG9ydCBmdW5jdGlvbiBhbGxBbHBoYWJldHModGV4dDogc3RyaW5nKTogYm9vbGVhbiB7XG4gIHJldHVybiBCb29sZWFuKHRleHQubWF0Y2goL15bYS16QS1aMC05Xy1dKyQvKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBleGNsdWRlRW1vamkodGV4dDogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHRleHQucmVwbGFjZShyZWdFbW9qaSwgXCJcIik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBleGNsdWRlU3BhY2UodGV4dDogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHRleHQucmVwbGFjZSgvIC9nLCBcIlwiKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxvd2VySW5jbHVkZXMob25lOiBzdHJpbmcsIG90aGVyOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuIG9uZS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKG90aGVyLnRvTG93ZXJDYXNlKCkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbG93ZXJJbmNsdWRlc1dpdGhvdXRTcGFjZShvbmU6IHN0cmluZywgb3RoZXI6IHN0cmluZyk6IGJvb2xlYW4ge1xuICByZXR1cm4gbG93ZXJJbmNsdWRlcyhleGNsdWRlU3BhY2Uob25lKSwgZXhjbHVkZVNwYWNlKG90aGVyKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsb3dlclN0YXJ0c1dpdGgoYTogc3RyaW5nLCBiOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuIGEudG9Mb3dlckNhc2UoKS5zdGFydHNXaXRoKGIudG9Mb3dlckNhc2UoKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsb3dlclN0YXJ0c1dpdGhvdXRTcGFjZShvbmU6IHN0cmluZywgb3RoZXI6IHN0cmluZyk6IGJvb2xlYW4ge1xuICByZXR1cm4gbG93ZXJTdGFydHNXaXRoKGV4Y2x1ZGVTcGFjZShvbmUpLCBleGNsdWRlU3BhY2Uob3RoZXIpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNhcGl0YWxpemVGaXJzdExldHRlcihzdHI6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiBzdHIuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzdHIuc2xpY2UoMSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiogc3BsaXRSYXcoXG4gIHRleHQ6IHN0cmluZyxcbiAgcmVnZXhwOiBSZWdFeHBcbik6IEl0ZXJhYmxlSXRlcmF0b3I8c3RyaW5nPiB7XG4gIGxldCBwcmV2aW91c0luZGV4ID0gMDtcbiAgZm9yIChsZXQgciBvZiB0ZXh0Lm1hdGNoQWxsKHJlZ2V4cCkpIHtcbiAgICBpZiAocHJldmlvdXNJbmRleCAhPT0gci5pbmRleCEpIHtcbiAgICAgIHlpZWxkIHRleHQuc2xpY2UocHJldmlvdXNJbmRleCwgci5pbmRleCEpO1xuICAgIH1cbiAgICB5aWVsZCB0ZXh0W3IuaW5kZXghXTtcbiAgICBwcmV2aW91c0luZGV4ID0gci5pbmRleCEgKyAxO1xuICB9XG5cbiAgaWYgKHByZXZpb3VzSW5kZXggIT09IHRleHQubGVuZ3RoKSB7XG4gICAgeWllbGQgdGV4dC5zbGljZShwcmV2aW91c0luZGV4LCB0ZXh0Lmxlbmd0aCk7XG4gIH1cbn1cbiIsImltcG9ydCB0eXBlIHsgVG9rZW5pemVyIH0gZnJvbSBcIi4uL3Rva2VuaXplclwiO1xuaW1wb3J0IHsgc3BsaXRSYXcgfSBmcm9tIFwiLi4vLi4vdXRpbC9zdHJpbmdzXCI7XG5cbmZ1bmN0aW9uIHBpY2tUb2tlbnMoY29udGVudDogc3RyaW5nLCB0cmltUGF0dGVybjogUmVnRXhwKTogc3RyaW5nW10ge1xuICByZXR1cm4gY29udGVudC5zcGxpdCh0cmltUGF0dGVybikuZmlsdGVyKCh4KSA9PiB4ICE9PSBcIlwiKTtcbn1cblxuZXhwb3J0IGNvbnN0IFRSSU1fQ0hBUl9QQVRURVJOID0gL1tcXG5cXHRcXFtcXF0kLzo/IT0oKTw+XCInLix8Oyp+IGBdL2c7XG5leHBvcnQgY2xhc3MgRGVmYXVsdFRva2VuaXplciBpbXBsZW1lbnRzIFRva2VuaXplciB7XG4gIHRva2VuaXplKGNvbnRlbnQ6IHN0cmluZywgcmF3PzogYm9vbGVhbik6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gcmF3XG4gICAgICA/IEFycmF5LmZyb20oc3BsaXRSYXcoY29udGVudCwgdGhpcy5nZXRUcmltUGF0dGVybigpKSkuZmlsdGVyKFxuICAgICAgICAgICh4KSA9PiB4ICE9PSBcIiBcIlxuICAgICAgICApXG4gICAgICA6IHBpY2tUb2tlbnMoY29udGVudCwgdGhpcy5nZXRUcmltUGF0dGVybigpKTtcbiAgfVxuXG4gIHJlY3Vyc2l2ZVRva2VuaXplKGNvbnRlbnQ6IHN0cmluZyk6IHsgd29yZDogc3RyaW5nOyBvZmZzZXQ6IG51bWJlciB9W10ge1xuICAgIGNvbnN0IHRyaW1JbmRleGVzID0gQXJyYXkuZnJvbShjb250ZW50Lm1hdGNoQWxsKHRoaXMuZ2V0VHJpbVBhdHRlcm4oKSkpXG4gICAgICAuc29ydCgoYSwgYikgPT4gYS5pbmRleCEgLSBiLmluZGV4ISlcbiAgICAgIC5tYXAoKHgpID0+IHguaW5kZXghKTtcbiAgICByZXR1cm4gW1xuICAgICAgeyB3b3JkOiBjb250ZW50LCBvZmZzZXQ6IDAgfSxcbiAgICAgIC4uLnRyaW1JbmRleGVzLm1hcCgoaSkgPT4gKHtcbiAgICAgICAgd29yZDogY29udGVudC5zbGljZShpICsgMSksXG4gICAgICAgIG9mZnNldDogaSArIDEsXG4gICAgICB9KSksXG4gICAgXTtcbiAgfVxuXG4gIGdldFRyaW1QYXR0ZXJuKCk6IFJlZ0V4cCB7XG4gICAgcmV0dXJuIFRSSU1fQ0hBUl9QQVRURVJOO1xuICB9XG5cbiAgc2hvdWxkSWdub3JlKHN0cjogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG4iLCJpbXBvcnQgeyBEZWZhdWx0VG9rZW5pemVyIH0gZnJvbSBcIi4vRGVmYXVsdFRva2VuaXplclwiO1xuXG5jb25zdCBBUkFCSUNfVFJJTV9DSEFSX1BBVFRFUk4gPSAvW1xcblxcdFxcW1xcXSQvOj8hPSgpPD5cIicuLHw7Kn4gYNiM2JtdL2c7XG5leHBvcnQgY2xhc3MgQXJhYmljVG9rZW5pemVyIGV4dGVuZHMgRGVmYXVsdFRva2VuaXplciB7XG4gIGdldFRyaW1QYXR0ZXJuKCk6IFJlZ0V4cCB7XG4gICAgcmV0dXJuIEFSQUJJQ19UUklNX0NIQVJfUEFUVEVSTjtcbiAgfVxufVxuIiwiLy8gQHRzLW5vY2hlY2tcbi8vIEJlY2F1c2UgdGhpcyBjb2RlIGlzIG9yaWdpbmFsbHkgamF2YXNjcmlwdCBjb2RlLlxuLy8gbm9pbnNwZWN0aW9uIEZ1bmN0aW9uVG9vTG9uZ0pTLEZ1bmN0aW9uV2l0aE11bHRpcGxlTG9vcHNKUyxFcXVhbGl0eUNvbXBhcmlzb25XaXRoQ29lcmNpb25KUyxQb2ludGxlc3NCb29sZWFuRXhwcmVzc2lvbkpTLEpTRGVjbGFyYXRpb25zQXRTY29wZVN0YXJ0XG5cbi8vIFRpbnlTZWdtZW50ZXIgMC4xIC0tIFN1cGVyIGNvbXBhY3QgSmFwYW5lc2UgdG9rZW5pemVyIGluIEphdmFzY3JpcHRcbi8vIChjKSAyMDA4IFRha3UgS3VkbyA8dGFrdUBjaGFzZW4ub3JnPlxuLy8gVGlueVNlZ21lbnRlciBpcyBmcmVlbHkgZGlzdHJpYnV0YWJsZSB1bmRlciB0aGUgdGVybXMgb2YgYSBuZXcgQlNEIGxpY2VuY2UuXG4vLyBGb3IgZGV0YWlscywgc2VlIGh0dHA6Ly9jaGFzZW4ub3JnL350YWt1L3NvZnR3YXJlL1RpbnlTZWdtZW50ZXIvTElDRU5DRS50eHRcblxuZnVuY3Rpb24gVGlueVNlZ21lbnRlcigpIHtcbiAgdmFyIHBhdHRlcm5zID0ge1xuICAgIFwiW+S4gOS6jOS4ieWbm+S6lOWFreS4g+WFq+S5neWNgeeZvuWNg+S4h+WEhOWFhl1cIjogXCJNXCIsXG4gICAgXCJb5LiALem+oOOAheOAhuODteODtl1cIjogXCJIXCIsXG4gICAgXCJb44GBLeOCk11cIjogXCJJXCIsXG4gICAgXCJb44KhLeODtOODvO+9sS3vvp3vvp7vvbBdXCI6IFwiS1wiLFxuICAgIFwiW2EtekEtWu+9gS3vvZrvvKEt77y6XVwiOiBcIkFcIixcbiAgICBcIlswLTnvvJAt77yZXVwiOiBcIk5cIixcbiAgfTtcbiAgdGhpcy5jaGFydHlwZV8gPSBbXTtcbiAgZm9yICh2YXIgaSBpbiBwYXR0ZXJucykge1xuICAgIHZhciByZWdleHAgPSBuZXcgUmVnRXhwKCk7XG4gICAgcmVnZXhwLmNvbXBpbGUoaSk7XG4gICAgdGhpcy5jaGFydHlwZV8ucHVzaChbcmVnZXhwLCBwYXR0ZXJuc1tpXV0pO1xuICB9XG5cbiAgdGhpcy5CSUFTX18gPSAtMzMyO1xuICB0aGlzLkJDMV9fID0geyBISDogNiwgSUk6IDI0NjEsIEtIOiA0MDYsIE9IOiAtMTM3OCB9O1xuICB0aGlzLkJDMl9fID0ge1xuICAgIEFBOiAtMzI2NyxcbiAgICBBSTogMjc0NCxcbiAgICBBTjogLTg3OCxcbiAgICBISDogLTQwNzAsXG4gICAgSE06IC0xNzExLFxuICAgIEhOOiA0MDEyLFxuICAgIEhPOiAzNzYxLFxuICAgIElBOiAxMzI3LFxuICAgIElIOiAtMTE4NCxcbiAgICBJSTogLTEzMzIsXG4gICAgSUs6IDE3MjEsXG4gICAgSU86IDU0OTIsXG4gICAgS0k6IDM4MzEsXG4gICAgS0s6IC04NzQxLFxuICAgIE1IOiAtMzEzMixcbiAgICBNSzogMzMzNCxcbiAgICBPTzogLTI5MjAsXG4gIH07XG4gIHRoaXMuQkMzX18gPSB7XG4gICAgSEg6IDk5NixcbiAgICBISTogNjI2LFxuICAgIEhLOiAtNzIxLFxuICAgIEhOOiAtMTMwNyxcbiAgICBITzogLTgzNixcbiAgICBJSDogLTMwMSxcbiAgICBLSzogMjc2MixcbiAgICBNSzogMTA3OSxcbiAgICBNTTogNDAzNCxcbiAgICBPQTogLTE2NTIsXG4gICAgT0g6IDI2NixcbiAgfTtcbiAgdGhpcy5CUDFfXyA9IHsgQkI6IDI5NSwgT0I6IDMwNCwgT086IC0xMjUsIFVCOiAzNTIgfTtcbiAgdGhpcy5CUDJfXyA9IHsgQk86IDYwLCBPTzogLTE3NjIgfTtcbiAgdGhpcy5CUTFfXyA9IHtcbiAgICBCSEg6IDExNTAsXG4gICAgQkhNOiAxNTIxLFxuICAgIEJJSTogLTExNTgsXG4gICAgQklNOiA4ODYsXG4gICAgQk1IOiAxMjA4LFxuICAgIEJOSDogNDQ5LFxuICAgIEJPSDogLTkxLFxuICAgIEJPTzogLTI1OTcsXG4gICAgT0hJOiA0NTEsXG4gICAgT0lIOiAtMjk2LFxuICAgIE9LQTogMTg1MSxcbiAgICBPS0g6IC0xMDIwLFxuICAgIE9LSzogOTA0LFxuICAgIE9PTzogMjk2NSxcbiAgfTtcbiAgdGhpcy5CUTJfXyA9IHtcbiAgICBCSEg6IDExOCxcbiAgICBCSEk6IC0xMTU5LFxuICAgIEJITTogNDY2LFxuICAgIEJJSDogLTkxOSxcbiAgICBCS0s6IC0xNzIwLFxuICAgIEJLTzogODY0LFxuICAgIE9ISDogLTExMzksXG4gICAgT0hNOiAtMTgxLFxuICAgIE9JSDogMTUzLFxuICAgIFVISTogLTExNDYsXG4gIH07XG4gIHRoaXMuQlEzX18gPSB7XG4gICAgQkhIOiAtNzkyLFxuICAgIEJISTogMjY2NCxcbiAgICBCSUk6IC0yOTksXG4gICAgQktJOiA0MTksXG4gICAgQk1IOiA5MzcsXG4gICAgQk1NOiA4MzM1LFxuICAgIEJOTjogOTk4LFxuICAgIEJPSDogNzc1LFxuICAgIE9ISDogMjE3NCxcbiAgICBPSE06IDQzOSxcbiAgICBPSUk6IDI4MCxcbiAgICBPS0g6IDE3OTgsXG4gICAgT0tJOiAtNzkzLFxuICAgIE9LTzogLTIyNDIsXG4gICAgT01IOiAtMjQwMixcbiAgICBPT086IDExNjk5LFxuICB9O1xuICB0aGlzLkJRNF9fID0ge1xuICAgIEJISDogLTM4OTUsXG4gICAgQklIOiAzNzYxLFxuICAgIEJJSTogLTQ2NTQsXG4gICAgQklLOiAxMzQ4LFxuICAgIEJLSzogLTE4MDYsXG4gICAgQk1JOiAtMzM4NSxcbiAgICBCT086IC0xMjM5NixcbiAgICBPQUg6IDkyNixcbiAgICBPSEg6IDI2NixcbiAgICBPSEs6IC0yMDM2LFxuICAgIE9OTjogLTk3MyxcbiAgfTtcbiAgdGhpcy5CVzFfXyA9IHtcbiAgICBcIizjgahcIjogNjYwLFxuICAgIFwiLOWQjFwiOiA3MjcsXG4gICAgQjHjgYI6IDE0MDQsXG4gICAgQjHlkIw6IDU0MixcbiAgICBcIuOAgeOBqFwiOiA2NjAsXG4gICAgXCLjgIHlkIxcIjogNzI3LFxuICAgIFwi44CN44GoXCI6IDE2ODIsXG4gICAg44GC44GjOiAxNTA1LFxuICAgIOOBhOOBhjogMTc0MyxcbiAgICDjgYTjgaM6IC0yMDU1LFxuICAgIOOBhOOCizogNjcyLFxuICAgIOOBhuOBlzogLTQ4MTcsXG4gICAg44GG44KTOiA2NjUsXG4gICAg44GL44KJOiAzNDcyLFxuICAgIOOBjOOCiTogNjAwLFxuICAgIOOBk+OBhjogLTc5MCxcbiAgICDjgZPjgag6IDIwODMsXG4gICAg44GT44KTOiAtMTI2MixcbiAgICDjgZXjgok6IC00MTQzLFxuICAgIOOBleOCkzogNDU3MyxcbiAgICDjgZfjgZ86IDI2NDEsXG4gICAg44GX44GmOiAxMTA0LFxuICAgIOOBmeOBpzogLTMzOTksXG4gICAg44Gd44GTOiAxOTc3LFxuICAgIOOBneOCjDogLTg3MSxcbiAgICDjgZ/jgaE6IDExMjIsXG4gICAg44Gf44KBOiA2MDEsXG4gICAg44Gj44GfOiAzNDYzLFxuICAgIOOBpOOBhDogLTgwMixcbiAgICDjgabjgYQ6IDgwNSxcbiAgICDjgabjgY06IDEyNDksXG4gICAg44Gn44GNOiAxMTI3LFxuICAgIOOBp+OBmTogMzQ0NSxcbiAgICDjgafjga86IDg0NCxcbiAgICDjgajjgYQ6IC00OTE1LFxuICAgIOOBqOOBvzogMTkyMixcbiAgICDjganjgZM6IDM4ODcsXG4gICAg44Gq44GEOiA1NzEzLFxuICAgIOOBquOBozogMzAxNSxcbiAgICDjgarjgak6IDczNzksXG4gICAg44Gq44KTOiAtMTExMyxcbiAgICDjgavjgZc6IDI0NjgsXG4gICAg44Gr44GvOiAxNDk4LFxuICAgIOOBq+OCgjogMTY3MSxcbiAgICDjgavlr746IC05MTIsXG4gICAg44Gu5LiAOiAtNTAxLFxuICAgIOOBruS4rTogNzQxLFxuICAgIOOBvuOBmzogMjQ0OCxcbiAgICDjgb7jgac6IDE3MTEsXG4gICAg44G+44G+OiAyNjAwLFxuICAgIOOBvuOCizogLTIxNTUsXG4gICAg44KE44KAOiAtMTk0NyxcbiAgICDjgojjgaM6IC0yNTY1LFxuICAgIOOCjOOBnzogMjM2OSxcbiAgICDjgozjgac6IC05MTMsXG4gICAg44KS44GXOiAxODYwLFxuICAgIOOCkuimizogNzMxLFxuICAgIOS6oeOBjzogLTE4ODYsXG4gICAg5Lqs6YO9OiAyNTU4LFxuICAgIOWPluOCijogLTI3ODQsXG4gICAg5aSn44GNOiAtMjYwNCxcbiAgICDlpKfpmKo6IDE0OTcsXG4gICAg5bmz5pa5OiAtMjMxNCxcbiAgICDlvJXjgY06IC0xMzM2LFxuICAgIOaXpeacrDogLTE5NSxcbiAgICDmnKzlvZM6IC0yNDIzLFxuICAgIOavjuaXpTogLTIxMTMsXG4gICAg55uu5oyHOiAtNzI0LFxuICAgIO+8ou+8keOBgjogMTQwNCxcbiAgICDvvKLvvJHlkIw6IDU0MixcbiAgICBcIu+9o+OBqFwiOiAxNjgyLFxuICB9O1xuICB0aGlzLkJXMl9fID0ge1xuICAgIFwiLi5cIjogLTExODIyLFxuICAgIDExOiAtNjY5LFxuICAgIFwi4oCV4oCVXCI6IC01NzMwLFxuICAgIFwi4oiS4oiSXCI6IC0xMzE3NSxcbiAgICDjgYTjgYY6IC0xNjA5LFxuICAgIOOBhuOBizogMjQ5MCxcbiAgICDjgYvjgZc6IC0xMzUwLFxuICAgIOOBi+OCgjogLTYwMixcbiAgICDjgYvjgok6IC03MTk0LFxuICAgIOOBi+OCjDogNDYxMixcbiAgICDjgYzjgYQ6IDg1MyxcbiAgICDjgYzjgok6IC0zMTk4LFxuICAgIOOBjeOBnzogMTk0MSxcbiAgICDjgY/jgao6IC0xNTk3LFxuICAgIOOBk+OBqDogLTgzOTIsXG4gICAg44GT44GuOiAtNDE5MyxcbiAgICDjgZXjgZs6IDQ1MzMsXG4gICAg44GV44KMOiAxMzE2OCxcbiAgICDjgZXjgpM6IC0zOTc3LFxuICAgIOOBl+OBhDogLTE4MTksXG4gICAg44GX44GLOiAtNTQ1LFxuICAgIOOBl+OBnzogNTA3OCxcbiAgICDjgZfjgaY6IDk3MixcbiAgICDjgZfjgao6IDkzOSxcbiAgICDjgZ3jga46IC0zNzQ0LFxuICAgIOOBn+OBhDogLTEyNTMsXG4gICAg44Gf44GfOiAtNjYyLFxuICAgIOOBn+OBoDogLTM4NTcsXG4gICAg44Gf44GhOiAtNzg2LFxuICAgIOOBn+OBqDogMTIyNCxcbiAgICDjgZ/jga86IC05MzksXG4gICAg44Gj44GfOiA0NTg5LFxuICAgIOOBo+OBpjogMTY0NyxcbiAgICDjgaPjgag6IC0yMDk0LFxuICAgIOOBpuOBhDogNjE0NCxcbiAgICDjgabjgY06IDM2NDAsXG4gICAg44Gm44GPOiAyNTUxLFxuICAgIOOBpuOBrzogLTMxMTAsXG4gICAg44Gm44KCOiAtMzA2NSxcbiAgICDjgafjgYQ6IDI2NjYsXG4gICAg44Gn44GNOiAtMTUyOCxcbiAgICDjgafjgZc6IC0zODI4LFxuICAgIOOBp+OBmTogLTQ3NjEsXG4gICAg44Gn44KCOiAtNDIwMyxcbiAgICDjgajjgYQ6IDE4OTAsXG4gICAg44Go44GTOiAtMTc0NixcbiAgICDjgajjgag6IC0yMjc5LFxuICAgIOOBqOOBrjogNzIwLFxuICAgIOOBqOOBvzogNTE2OCxcbiAgICDjgajjgoI6IC0zOTQxLFxuICAgIOOBquOBhDogLTI0ODgsXG4gICAg44Gq44GMOiAtMTMxMyxcbiAgICDjgarjgak6IC02NTA5LFxuICAgIOOBquOBrjogMjYxNCxcbiAgICDjgarjgpM6IDMwOTksXG4gICAg44Gr44GKOiAtMTYxNSxcbiAgICDjgavjgZc6IDI3NDgsXG4gICAg44Gr44GqOiAyNDU0LFxuICAgIOOBq+OCiDogLTcyMzYsXG4gICAg44Gr5a++OiAtMTQ5NDMsXG4gICAg44Gr5b6TOiAtNDY4OCxcbiAgICDjgavplqI6IC0xMTM4OCxcbiAgICDjga7jgYs6IDIwOTMsXG4gICAg44Gu44GnOiAtNzA1OSxcbiAgICDjga7jgas6IC02MDQxLFxuICAgIOOBruOBrjogLTYxMjUsXG4gICAg44Gv44GEOiAxMDczLFxuICAgIOOBr+OBjDogLTEwMzMsXG4gICAg44Gv44GaOiAtMjUzMixcbiAgICDjgbDjgow6IDE4MTMsXG4gICAg44G+44GXOiAtMTMxNixcbiAgICDjgb7jgac6IC02NjIxLFxuICAgIOOBvuOCjDogNTQwOSxcbiAgICDjgoHjgaY6IC0zMTUzLFxuICAgIOOCguOBhDogMjIzMCxcbiAgICDjgoLjga46IC0xMDcxMyxcbiAgICDjgonjgYs6IC05NDQsXG4gICAg44KJ44GXOiAtMTYxMSxcbiAgICDjgonjgas6IC0xODk3LFxuICAgIOOCiuOBlzogNjUxLFxuICAgIOOCiuOBvjogMTYyMCxcbiAgICDjgozjgZ86IDQyNzAsXG4gICAg44KM44GmOiA4NDksXG4gICAg44KM44GwOiA0MTE0LFxuICAgIOOCjeOBhjogNjA2NyxcbiAgICDjgo/jgow6IDc5MDEsXG4gICAg44KS6YCaOiAtMTE4NzcsXG4gICAg44KT44GgOiA3MjgsXG4gICAg44KT44GqOiAtNDExNSxcbiAgICDkuIDkuro6IDYwMixcbiAgICDkuIDmlrk6IC0xMzc1LFxuICAgIOS4gOaXpTogOTcwLFxuICAgIOS4gOmDqDogLTEwNTEsXG4gICAg5LiK44GMOiAtNDQ3OSxcbiAgICDkvJrnpL46IC0xMTE2LFxuICAgIOWHuuOBpjogMjE2MyxcbiAgICDliIbjga46IC03NzU4LFxuICAgIOWQjOWFmjogOTcwLFxuICAgIOWQjOaXpTogLTkxMyxcbiAgICDlpKfpmKo6IC0yNDcxLFxuICAgIOWnlOWToTogLTEyNTAsXG4gICAg5bCR44GqOiAtMTA1MCxcbiAgICDlubTluqY6IC04NjY5LFxuICAgIOW5tOmWkzogLTE2MjYsXG4gICAg5bqc55yMOiAtMjM2MyxcbiAgICDmiYvmqKk6IC0xOTgyLFxuICAgIOaWsOiBnjogLTQwNjYsXG4gICAg5pel5pawOiAtNzIyLFxuICAgIOaXpeacrDogLTcwNjgsXG4gICAg5pel57GzOiAzMzcyLFxuICAgIOabnOaXpTogLTYwMSxcbiAgICDmnJ3prq46IC0yMzU1LFxuICAgIOacrOS6ujogLTI2OTcsXG4gICAg5p2x5LqsOiAtMTU0MyxcbiAgICDnhLbjgag6IC0xMzg0LFxuICAgIOekvuS8mjogLTEyNzYsXG4gICAg56uL44GmOiAtOTkwLFxuICAgIOesrOOBqzogLTE2MTIsXG4gICAg57Gz5Zu9OiAtNDI2OCxcbiAgICBcIu+8ke+8kVwiOiAtNjY5LFxuICB9O1xuICB0aGlzLkJXM19fID0ge1xuICAgIOOBguOBnzogLTIxOTQsXG4gICAg44GC44KKOiA3MTksXG4gICAg44GC44KLOiAzODQ2LFxuICAgIFwi44GELlwiOiAtMTE4NSxcbiAgICBcIuOBhOOAglwiOiAtMTE4NSxcbiAgICDjgYTjgYQ6IDUzMDgsXG4gICAg44GE44GIOiAyMDc5LFxuICAgIOOBhOOBjzogMzAyOSxcbiAgICDjgYTjgZ86IDIwNTYsXG4gICAg44GE44GjOiAxODgzLFxuICAgIOOBhOOCizogNTYwMCxcbiAgICDjgYTjgo86IDE1MjcsXG4gICAg44GG44GhOiAxMTE3LFxuICAgIOOBhuOBqDogNDc5OCxcbiAgICDjgYjjgag6IDE0NTQsXG4gICAgXCLjgYsuXCI6IDI4NTcsXG4gICAgXCLjgYvjgIJcIjogMjg1NyxcbiAgICDjgYvjgZE6IC03NDMsXG4gICAg44GL44GjOiAtNDA5OCxcbiAgICDjgYvjgas6IC02NjksXG4gICAg44GL44KJOiA2NTIwLFxuICAgIOOBi+OCijogLTI2NzAsXG4gICAgXCLjgYwsXCI6IDE4MTYsXG4gICAgXCLjgYzjgIFcIjogMTgxNixcbiAgICDjgYzjgY06IC00ODU1LFxuICAgIOOBjOOBkTogLTExMjcsXG4gICAg44GM44GjOiAtOTEzLFxuICAgIOOBjOOCiTogLTQ5NzcsXG4gICAg44GM44KKOiAtMjA2NCxcbiAgICDjgY3jgZ86IDE2NDUsXG4gICAg44GR44GpOiAxMzc0LFxuICAgIOOBk+OBqDogNzM5NyxcbiAgICDjgZPjga46IDE1NDIsXG4gICAg44GT44KNOiAtMjc1NyxcbiAgICDjgZXjgYQ6IC03MTQsXG4gICAg44GV44KSOiA5NzYsXG4gICAgXCLjgZcsXCI6IDE1NTcsXG4gICAgXCLjgZfjgIFcIjogMTU1NyxcbiAgICDjgZfjgYQ6IC0zNzE0LFxuICAgIOOBl+OBnzogMzU2MixcbiAgICDjgZfjgaY6IDE0NDksXG4gICAg44GX44GqOiAyNjA4LFxuICAgIOOBl+OBvjogMTIwMCxcbiAgICBcIuOBmS5cIjogLTEzMTAsXG4gICAgXCLjgZnjgIJcIjogLTEzMTAsXG4gICAg44GZ44KLOiA2NTIxLFxuICAgIFwi44GaLFwiOiAzNDI2LFxuICAgIFwi44Ga44CBXCI6IDM0MjYsXG4gICAg44Ga44GrOiA4NDEsXG4gICAg44Gd44GGOiA0MjgsXG4gICAgXCLjgZ8uXCI6IDg4NzUsXG4gICAgXCLjgZ/jgIJcIjogODg3NSxcbiAgICDjgZ/jgYQ6IC01OTQsXG4gICAg44Gf44GuOiA4MTIsXG4gICAg44Gf44KKOiAtMTE4MyxcbiAgICDjgZ/jgos6IC04NTMsXG4gICAgXCLjgaAuXCI6IDQwOTgsXG4gICAgXCLjgaDjgIJcIjogNDA5OCxcbiAgICDjgaDjgaM6IDEwMDQsXG4gICAg44Gj44GfOiAtNDc0OCxcbiAgICDjgaPjgaY6IDMwMCxcbiAgICDjgabjgYQ6IDYyNDAsXG4gICAg44Gm44GKOiA4NTUsXG4gICAg44Gm44KCOiAzMDIsXG4gICAg44Gn44GZOiAxNDM3LFxuICAgIOOBp+OBqzogLTE0ODIsXG4gICAg44Gn44GvOiAyMjk1LFxuICAgIOOBqOOBhjogLTEzODcsXG4gICAg44Go44GXOiAyMjY2LFxuICAgIOOBqOOBrjogNTQxLFxuICAgIOOBqOOCgjogLTM1NDMsXG4gICAg44Gp44GGOiA0NjY0LFxuICAgIOOBquOBhDogMTc5NixcbiAgICDjgarjgY86IC05MDMsXG4gICAg44Gq44GpOiAyMTM1LFxuICAgIFwi44GrLFwiOiAtMTAyMSxcbiAgICBcIuOBq+OAgVwiOiAtMTAyMSxcbiAgICDjgavjgZc6IDE3NzEsXG4gICAg44Gr44GqOiAxOTA2LFxuICAgIOOBq+OBrzogMjY0NCxcbiAgICBcIuOBrixcIjogLTcyNCxcbiAgICBcIuOBruOAgVwiOiAtNzI0LFxuICAgIOOBruWtkDogLTEwMDAsXG4gICAgXCLjga8sXCI6IDEzMzcsXG4gICAgXCLjga/jgIFcIjogMTMzNyxcbiAgICDjgbnjgY06IDIxODEsXG4gICAg44G+44GXOiAxMTEzLFxuICAgIOOBvuOBmTogNjk0MyxcbiAgICDjgb7jgaM6IC0xNTQ5LFxuICAgIOOBvuOBpzogNjE1NCxcbiAgICDjgb7jgow6IC03OTMsXG4gICAg44KJ44GXOiAxNDc5LFxuICAgIOOCieOCjDogNjgyMCxcbiAgICDjgovjgos6IDM4MTgsXG4gICAgXCLjgowsXCI6IDg1NCxcbiAgICBcIuOCjOOAgVwiOiA4NTQsXG4gICAg44KM44GfOiAxODUwLFxuICAgIOOCjOOBpjogMTM3NSxcbiAgICDjgozjgbA6IC0zMjQ2LFxuICAgIOOCjOOCizogMTA5MSxcbiAgICDjgo/jgow6IC02MDUsXG4gICAg44KT44GgOiA2MDYsXG4gICAg44KT44GnOiA3OTgsXG4gICAg44Kr5pyIOiA5OTAsXG4gICAg5Lya6K2wOiA4NjAsXG4gICAg5YWl44KKOiAxMjMyLFxuICAgIOWkp+S8mjogMjIxNyxcbiAgICDlp4vjgoE6IDE2ODEsXG4gICAg5biCOiA5NjUsXG4gICAg5paw6IGeOiAtNTA1NSxcbiAgICBcIuaXpSxcIjogOTc0LFxuICAgIFwi5pel44CBXCI6IDk3NCxcbiAgICDnpL7kvJo6IDIwMjQsXG4gICAg77225pyIOiA5OTAsXG4gIH07XG4gIHRoaXMuVEMxX18gPSB7XG4gICAgQUFBOiAxMDkzLFxuICAgIEhISDogMTAyOSxcbiAgICBISE06IDU4MCxcbiAgICBISUk6IDk5OCxcbiAgICBIT0g6IC0zOTAsXG4gICAgSE9NOiAtMzMxLFxuICAgIElISTogMTE2OSxcbiAgICBJT0g6IC0xNDIsXG4gICAgSU9JOiAtMTAxNSxcbiAgICBJT006IDQ2NyxcbiAgICBNTUg6IDE4NyxcbiAgICBPT0k6IC0xODMyLFxuICB9O1xuICB0aGlzLlRDMl9fID0ge1xuICAgIEhITzogMjA4OCxcbiAgICBISUk6IC0xMDIzLFxuICAgIEhNTTogLTExNTQsXG4gICAgSUhJOiAtMTk2NSxcbiAgICBLS0g6IDcwMyxcbiAgICBPSUk6IC0yNjQ5LFxuICB9O1xuICB0aGlzLlRDM19fID0ge1xuICAgIEFBQTogLTI5NCxcbiAgICBISEg6IDM0NixcbiAgICBISEk6IC0zNDEsXG4gICAgSElJOiAtMTA4OCxcbiAgICBISUs6IDczMSxcbiAgICBIT0g6IC0xNDg2LFxuICAgIElISDogMTI4LFxuICAgIElISTogLTMwNDEsXG4gICAgSUhPOiAtMTkzNSxcbiAgICBJSUg6IC04MjUsXG4gICAgSUlNOiAtMTAzNSxcbiAgICBJT0k6IC01NDIsXG4gICAgS0hIOiAtMTIxNixcbiAgICBLS0E6IDQ5MSxcbiAgICBLS0g6IC0xMjE3LFxuICAgIEtPSzogLTEwMDksXG4gICAgTUhIOiAtMjY5NCxcbiAgICBNSE06IC00NTcsXG4gICAgTUhPOiAxMjMsXG4gICAgTU1IOiAtNDcxLFxuICAgIE5OSDogLTE2ODksXG4gICAgTk5POiA2NjIsXG4gICAgT0hPOiAtMzM5MyxcbiAgfTtcbiAgdGhpcy5UQzRfXyA9IHtcbiAgICBISEg6IC0yMDMsXG4gICAgSEhJOiAxMzQ0LFxuICAgIEhISzogMzY1LFxuICAgIEhITTogLTEyMixcbiAgICBISE46IDE4MixcbiAgICBISE86IDY2OSxcbiAgICBISUg6IDgwNCxcbiAgICBISUk6IDY3OSxcbiAgICBIT0g6IDQ0NixcbiAgICBJSEg6IDY5NSxcbiAgICBJSE86IC0yMzI0LFxuICAgIElJSDogMzIxLFxuICAgIElJSTogMTQ5NyxcbiAgICBJSU86IDY1NixcbiAgICBJT086IDU0LFxuICAgIEtBSzogNDg0NSxcbiAgICBLS0E6IDMzODYsXG4gICAgS0tLOiAzMDY1LFxuICAgIE1ISDogLTQwNSxcbiAgICBNSEk6IDIwMSxcbiAgICBNTUg6IC0yNDEsXG4gICAgTU1NOiA2NjEsXG4gICAgTU9NOiA4NDEsXG4gIH07XG4gIHRoaXMuVFExX18gPSB7XG4gICAgQkhISDogLTIyNyxcbiAgICBCSEhJOiAzMTYsXG4gICAgQkhJSDogLTEzMixcbiAgICBCSUhIOiA2MCxcbiAgICBCSUlJOiAxNTk1LFxuICAgIEJOSEg6IC03NDQsXG4gICAgQk9ISDogMjI1LFxuICAgIEJPT086IC05MDgsXG4gICAgT0FLSzogNDgyLFxuICAgIE9ISEg6IDI4MSxcbiAgICBPSElIOiAyNDksXG4gICAgT0lISTogMjAwLFxuICAgIE9JSUg6IC02OCxcbiAgfTtcbiAgdGhpcy5UUTJfXyA9IHsgQklISDogLTE0MDEsIEJJSUk6IC0xMDMzLCBCS0FLOiAtNTQzLCBCT09POiAtNTU5MSB9O1xuICB0aGlzLlRRM19fID0ge1xuICAgIEJISEg6IDQ3OCxcbiAgICBCSEhNOiAtMTA3MyxcbiAgICBCSElIOiAyMjIsXG4gICAgQkhJSTogLTUwNCxcbiAgICBCSUlIOiAtMTE2LFxuICAgIEJJSUk6IC0xMDUsXG4gICAgQk1ISTogLTg2MyxcbiAgICBCTUhNOiAtNDY0LFxuICAgIEJPTUg6IDYyMCxcbiAgICBPSEhIOiAzNDYsXG4gICAgT0hISTogMTcyOSxcbiAgICBPSElJOiA5OTcsXG4gICAgT0hNSDogNDgxLFxuICAgIE9JSEg6IDYyMyxcbiAgICBPSUlIOiAxMzQ0LFxuICAgIE9LQUs6IDI3OTIsXG4gICAgT0tISDogNTg3LFxuICAgIE9LS0E6IDY3OSxcbiAgICBPT0hIOiAxMTAsXG4gICAgT09JSTogLTY4NSxcbiAgfTtcbiAgdGhpcy5UUTRfXyA9IHtcbiAgICBCSEhIOiAtNzIxLFxuICAgIEJISE06IC0zNjA0LFxuICAgIEJISUk6IC05NjYsXG4gICAgQklJSDogLTYwNyxcbiAgICBCSUlJOiAtMjE4MSxcbiAgICBPQUFBOiAtMjc2MyxcbiAgICBPQUtLOiAxODAsXG4gICAgT0hISDogLTI5NCxcbiAgICBPSEhJOiAyNDQ2LFxuICAgIE9ISE86IDQ4MCxcbiAgICBPSElIOiAtMTU3MyxcbiAgICBPSUhIOiAxOTM1LFxuICAgIE9JSEk6IC00OTMsXG4gICAgT0lJSDogNjI2LFxuICAgIE9JSUk6IC00MDA3LFxuICAgIE9LQUs6IC04MTU2LFxuICB9O1xuICB0aGlzLlRXMV9fID0geyDjgavjgaTjgYQ6IC00NjgxLCDmnbHkuqzpg706IDIwMjYgfTtcbiAgdGhpcy5UVzJfXyA9IHtcbiAgICDjgYLjgovnqIs6IC0yMDQ5LFxuICAgIOOBhOOBo+OBnzogLTEyNTYsXG4gICAg44GT44KN44GMOiAtMjQzNCxcbiAgICDjgZfjgofjgYY6IDM4NzMsXG4gICAg44Gd44Gu5b6MOiAtNDQzMCxcbiAgICDjgaDjgaPjgaY6IC0xMDQ5LFxuICAgIOOBpuOBhOOBnzogMTgzMyxcbiAgICDjgajjgZfjgaY6IC00NjU3LFxuICAgIOOBqOOCguOBqzogLTQ1MTcsXG4gICAg44KC44Gu44GnOiAxODgyLFxuICAgIOS4gOawl+OBqzogLTc5MixcbiAgICDliJ3jgoHjgaY6IC0xNTEyLFxuICAgIOWQjOaZguOBqzogLTgwOTcsXG4gICAg5aSn44GN44GqOiAtMTI1NSxcbiAgICDlr77jgZfjgaY6IC0yNzIxLFxuICAgIOekvuS8muWFmjogLTMyMTYsXG4gIH07XG4gIHRoaXMuVFczX18gPSB7XG4gICAg44GE44Gf44GgOiAtMTczNCxcbiAgICDjgZfjgabjgYQ6IDEzMTQsXG4gICAg44Go44GX44GmOiAtNDMxNCxcbiAgICDjgavjgaTjgYQ6IC01NDgzLFxuICAgIOOBq+OBqOOBozogLTU5ODksXG4gICAg44Gr5b2T44GfOiAtNjI0NyxcbiAgICBcIuOBruOBpyxcIjogLTcyNyxcbiAgICBcIuOBruOBp+OAgVwiOiAtNzI3LFxuICAgIOOBruOCguOBrjogLTYwMCxcbiAgICDjgozjgYvjgok6IC0zNzUyLFxuICAgIOWNgeS6jOaciDogLTIyODcsXG4gIH07XG4gIHRoaXMuVFc0X18gPSB7XG4gICAgXCLjgYTjgYYuXCI6IDg1NzYsXG4gICAgXCLjgYTjgYbjgIJcIjogODU3NixcbiAgICDjgYvjgonjgao6IC0yMzQ4LFxuICAgIOOBl+OBpuOBhDogMjk1OCxcbiAgICBcIuOBn+OBjCxcIjogMTUxNixcbiAgICBcIuOBn+OBjOOAgVwiOiAxNTE2LFxuICAgIOOBpuOBhOOCizogMTUzOCxcbiAgICDjgajjgYTjgYY6IDEzNDksXG4gICAg44G+44GX44GfOiA1NTQzLFxuICAgIOOBvuOBm+OCkzogMTA5NyxcbiAgICDjgojjgYbjgag6IC00MjU4LFxuICAgIOOCiOOCi+OBqDogNTg2NSxcbiAgfTtcbiAgdGhpcy5VQzFfXyA9IHsgQTogNDg0LCBLOiA5MywgTTogNjQ1LCBPOiAtNTA1IH07XG4gIHRoaXMuVUMyX18gPSB7IEE6IDgxOSwgSDogMTA1OSwgSTogNDA5LCBNOiAzOTg3LCBOOiA1Nzc1LCBPOiA2NDYgfTtcbiAgdGhpcy5VQzNfXyA9IHsgQTogLTEzNzAsIEk6IDIzMTEgfTtcbiAgdGhpcy5VQzRfXyA9IHtcbiAgICBBOiAtMjY0MyxcbiAgICBIOiAxODA5LFxuICAgIEk6IC0xMDMyLFxuICAgIEs6IC0zNDUwLFxuICAgIE06IDM1NjUsXG4gICAgTjogMzg3NixcbiAgICBPOiA2NjQ2LFxuICB9O1xuICB0aGlzLlVDNV9fID0geyBIOiAzMTMsIEk6IC0xMjM4LCBLOiAtNzk5LCBNOiA1MzksIE86IC04MzEgfTtcbiAgdGhpcy5VQzZfXyA9IHsgSDogLTUwNiwgSTogLTI1MywgSzogODcsIE06IDI0NywgTzogLTM4NyB9O1xuICB0aGlzLlVQMV9fID0geyBPOiAtMjE0IH07XG4gIHRoaXMuVVAyX18gPSB7IEI6IDY5LCBPOiA5MzUgfTtcbiAgdGhpcy5VUDNfXyA9IHsgQjogMTg5IH07XG4gIHRoaXMuVVExX18gPSB7XG4gICAgQkg6IDIxLFxuICAgIEJJOiAtMTIsXG4gICAgQks6IC05OSxcbiAgICBCTjogMTQyLFxuICAgIEJPOiAtNTYsXG4gICAgT0g6IC05NSxcbiAgICBPSTogNDc3LFxuICAgIE9LOiA0MTAsXG4gICAgT086IC0yNDIyLFxuICB9O1xuICB0aGlzLlVRMl9fID0geyBCSDogMjE2LCBCSTogMTEzLCBPSzogMTc1OSB9O1xuICB0aGlzLlVRM19fID0ge1xuICAgIEJBOiAtNDc5LFxuICAgIEJIOiA0MixcbiAgICBCSTogMTkxMyxcbiAgICBCSzogLTcxOTgsXG4gICAgQk06IDMxNjAsXG4gICAgQk46IDY0MjcsXG4gICAgQk86IDE0NzYxLFxuICAgIE9JOiAtODI3LFxuICAgIE9OOiAtMzIxMixcbiAgfTtcbiAgdGhpcy5VVzFfXyA9IHtcbiAgICBcIixcIjogMTU2LFxuICAgIFwi44CBXCI6IDE1NixcbiAgICBcIuOAjFwiOiAtNDYzLFxuICAgIOOBgjogLTk0MSxcbiAgICDjgYY6IC0xMjcsXG4gICAg44GMOiAtNTUzLFxuICAgIOOBjTogMTIxLFxuICAgIOOBkzogNTA1LFxuICAgIOOBpzogLTIwMSxcbiAgICDjgag6IC01NDcsXG4gICAg44GpOiAtMTIzLFxuICAgIOOBqzogLTc4OSxcbiAgICDjga46IC0xODUsXG4gICAg44GvOiAtODQ3LFxuICAgIOOCgjogLTQ2NixcbiAgICDjgoQ6IC00NzAsXG4gICAg44KIOiAxODIsXG4gICAg44KJOiAtMjkyLFxuICAgIOOCijogMjA4LFxuICAgIOOCjDogMTY5LFxuICAgIOOCkjogLTQ0NixcbiAgICDjgpM6IC0xMzcsXG4gICAgXCLjg7tcIjogLTEzNSxcbiAgICDkuLs6IC00MDIsXG4gICAg5LqsOiAtMjY4LFxuICAgIOWMujogLTkxMixcbiAgICDljYg6IDg3MSxcbiAgICDlm706IC00NjAsXG4gICAg5aSnOiA1NjEsXG4gICAg5aeUOiA3MjksXG4gICAg5biCOiAtNDExLFxuICAgIOaXpTogLTE0MSxcbiAgICDnkIY6IDM2MSxcbiAgICDnlJ86IC00MDgsXG4gICAg55yMOiAtMzg2LFxuICAgIOmDvTogLTcxOCxcbiAgICBcIu+9olwiOiAtNDYzLFxuICAgIFwi772lXCI6IC0xMzUsXG4gIH07XG4gIHRoaXMuVVcyX18gPSB7XG4gICAgXCIsXCI6IC04MjksXG4gICAgXCLjgIFcIjogLTgyOSxcbiAgICDjgIc6IDg5MixcbiAgICBcIuOAjFwiOiAtNjQ1LFxuICAgIFwi44CNXCI6IDMxNDUsXG4gICAg44GCOiAtNTM4LFxuICAgIOOBhDogNTA1LFxuICAgIOOBhjogMTM0LFxuICAgIOOBijogLTUwMixcbiAgICDjgYs6IDE0NTQsXG4gICAg44GMOiAtODU2LFxuICAgIOOBjzogLTQxMixcbiAgICDjgZM6IDExNDEsXG4gICAg44GVOiA4NzgsXG4gICAg44GWOiA1NDAsXG4gICAg44GXOiAxNTI5LFxuICAgIOOBmTogLTY3NSxcbiAgICDjgZs6IDMwMCxcbiAgICDjgZ06IC0xMDExLFxuICAgIOOBnzogMTg4LFxuICAgIOOBoDogMTgzNyxcbiAgICDjgaQ6IC05NDksXG4gICAg44GmOiAtMjkxLFxuICAgIOOBpzogLTI2OCxcbiAgICDjgag6IC05ODEsXG4gICAg44GpOiAxMjczLFxuICAgIOOBqjogMTA2MyxcbiAgICDjgas6IC0xNzY0LFxuICAgIOOBrjogMTMwLFxuICAgIOOBrzogLTQwOSxcbiAgICDjgbI6IC0xMjczLFxuICAgIOOBuTogMTI2MSxcbiAgICDjgb46IDYwMCxcbiAgICDjgoI6IC0xMjYzLFxuICAgIOOChDogLTQwMixcbiAgICDjgog6IDE2MzksXG4gICAg44KKOiAtNTc5LFxuICAgIOOCizogLTY5NCxcbiAgICDjgow6IDU3MSxcbiAgICDjgpI6IC0yNTE2LFxuICAgIOOCkzogMjA5NSxcbiAgICDjgqI6IC01ODcsXG4gICAg44KrOiAzMDYsXG4gICAg44KtOiA1NjgsXG4gICAg44ODOiA4MzEsXG4gICAg5LiJOiAtNzU4LFxuICAgIOS4jTogLTIxNTAsXG4gICAg5LiWOiAtMzAyLFxuICAgIOS4rTogLTk2OCxcbiAgICDkuLs6IC04NjEsXG4gICAg5LqLOiA0OTIsXG4gICAg5Lq6OiAtMTIzLFxuICAgIOS8mjogOTc4LFxuICAgIOS/nTogMzYyLFxuICAgIOWFpTogNTQ4LFxuICAgIOWInTogLTMwMjUsXG4gICAg5YmvOiAtMTU2NixcbiAgICDljJc6IC0zNDE0LFxuICAgIOWMujogLTQyMixcbiAgICDlpKc6IC0xNzY5LFxuICAgIOWkqTogLTg2NSxcbiAgICDlpKo6IC00ODMsXG4gICAg5a2QOiAtMTUxOSxcbiAgICDlraY6IDc2MCxcbiAgICDlrp86IDEwMjMsXG4gICAg5bCPOiAtMjAwOSxcbiAgICDluII6IC04MTMsXG4gICAg5bm0OiAtMTA2MCxcbiAgICDlvLc6IDEwNjcsXG4gICAg5omLOiAtMTUxOSxcbiAgICDmj7o6IC0xMDMzLFxuICAgIOaUvzogMTUyMixcbiAgICDmloc6IC0xMzU1LFxuICAgIOaWsDogLTE2ODIsXG4gICAg5pelOiAtMTgxNSxcbiAgICDmmI46IC0xNDYyLFxuICAgIOacgDogLTYzMCxcbiAgICDmnJ06IC0xODQzLFxuICAgIOacrDogLTE2NTAsXG4gICAg5p2xOiAtOTMxLFxuICAgIOaenDogLTY2NSxcbiAgICDmrKE6IC0yMzc4LFxuICAgIOawkTogLTE4MCxcbiAgICDmsJc6IC0xNzQwLFxuICAgIOeQhjogNzUyLFxuICAgIOeZujogNTI5LFxuICAgIOebrjogLTE1ODQsXG4gICAg55u4OiAtMjQyLFxuICAgIOecjDogLTExNjUsXG4gICAg56uLOiAtNzYzLFxuICAgIOesrDogODEwLFxuICAgIOexszogNTA5LFxuICAgIOiHqjogLTEzNTMsXG4gICAg6KGMOiA4MzgsXG4gICAg6KW/OiAtNzQ0LFxuICAgIOimizogLTM4NzQsXG4gICAg6Kq/OiAxMDEwLFxuICAgIOitsDogMTE5OCxcbiAgICDovrw6IDMwNDEsXG4gICAg6ZaLOiAxNzU4LFxuICAgIOmWkzogLTEyNTcsXG4gICAgXCLvvaJcIjogLTY0NSxcbiAgICBcIu+9o1wiOiAzMTQ1LFxuICAgIO+9rzogODMxLFxuICAgIO+9sTogLTU4NyxcbiAgICDvvbY6IDMwNixcbiAgICDvvbc6IDU2OCxcbiAgfTtcbiAgdGhpcy5VVzNfXyA9IHtcbiAgICBcIixcIjogNDg4OSxcbiAgICAxOiAtODAwLFxuICAgIFwi4oiSXCI6IC0xNzIzLFxuICAgIFwi44CBXCI6IDQ4ODksXG4gICAg44CFOiAtMjMxMSxcbiAgICDjgIc6IDU4MjcsXG4gICAgXCLjgI1cIjogMjY3MCxcbiAgICBcIuOAk1wiOiAtMzU3MyxcbiAgICDjgYI6IC0yNjk2LFxuICAgIOOBhDogMTAwNixcbiAgICDjgYY6IDIzNDIsXG4gICAg44GIOiAxOTgzLFxuICAgIOOBijogLTQ4NjQsXG4gICAg44GLOiAtMTE2MyxcbiAgICDjgYw6IDMyNzEsXG4gICAg44GPOiAxMDA0LFxuICAgIOOBkTogMzg4LFxuICAgIOOBkjogNDAxLFxuICAgIOOBkzogLTM1NTIsXG4gICAg44GUOiAtMzExNixcbiAgICDjgZU6IC0xMDU4LFxuICAgIOOBlzogLTM5NSxcbiAgICDjgZk6IDU4NCxcbiAgICDjgZs6IDM2ODUsXG4gICAg44GdOiAtNTIyOCxcbiAgICDjgZ86IDg0MixcbiAgICDjgaE6IC01MjEsXG4gICAg44GjOiAtMTQ0NCxcbiAgICDjgaQ6IC0xMDgxLFxuICAgIOOBpjogNjE2NyxcbiAgICDjgac6IDIzMTgsXG4gICAg44GoOiAxNjkxLFxuICAgIOOBqTogLTg5OSxcbiAgICDjgao6IC0yNzg4LFxuICAgIOOBqzogMjc0NSxcbiAgICDjga46IDQwNTYsXG4gICAg44GvOiA0NTU1LFxuICAgIOOBsjogLTIxNzEsXG4gICAg44G1OiAtMTc5OCxcbiAgICDjgbg6IDExOTksXG4gICAg44G7OiAtNTUxNixcbiAgICDjgb46IC00Mzg0LFxuICAgIOOBvzogLTEyMCxcbiAgICDjgoE6IDEyMDUsXG4gICAg44KCOiAyMzIzLFxuICAgIOOChDogLTc4OCxcbiAgICDjgog6IC0yMDIsXG4gICAg44KJOiA3MjcsXG4gICAg44KKOiA2NDksXG4gICAg44KLOiA1OTA1LFxuICAgIOOCjDogMjc3MyxcbiAgICDjgo86IC0xMjA3LFxuICAgIOOCkjogNjYyMCxcbiAgICDjgpM6IC01MTgsXG4gICAg44KiOiA1NTEsXG4gICAg44KwOiAxMzE5LFxuICAgIOOCuTogODc0LFxuICAgIOODgzogLTEzNTAsXG4gICAg44OIOiA1MjEsXG4gICAg44OgOiAxMTA5LFxuICAgIOODqzogMTU5MSxcbiAgICDjg606IDIyMDEsXG4gICAg44OzOiAyNzgsXG4gICAgXCLjg7tcIjogLTM3OTQsXG4gICAg5LiAOiAtMTYxOSxcbiAgICDkuIs6IC0xNzU5LFxuICAgIOS4ljogLTIwODcsXG4gICAg5LihOiAzODE1LFxuICAgIOS4rTogNjUzLFxuICAgIOS4uzogLTc1OCxcbiAgICDkuog6IC0xMTkzLFxuICAgIOS6jDogOTc0LFxuICAgIOS6ujogMjc0MixcbiAgICDku4o6IDc5MixcbiAgICDku5Y6IDE4ODksXG4gICAg5LulOiAtMTM2OCxcbiAgICDkvY46IDgxMSxcbiAgICDkvZU6IDQyNjUsXG4gICAg5L2cOiAtMzYxLFxuICAgIOS/nTogLTI0MzksXG4gICAg5YWDOiA0ODU4LFxuICAgIOWFmjogMzU5MyxcbiAgICDlhag6IDE1NzQsXG4gICAg5YWsOiAtMzAzMCxcbiAgICDlha06IDc1NSxcbiAgICDlhbE6IC0xODgwLFxuICAgIOWGhjogNTgwNyxcbiAgICDlho06IDMwOTUsXG4gICAg5YiGOiA0NTcsXG4gICAg5YidOiAyNDc1LFxuICAgIOWIpTogMTEyOSxcbiAgICDliY06IDIyODYsXG4gICAg5YmvOiA0NDM3LFxuICAgIOWKmzogMzY1LFxuICAgIOWLlTogLTk0OSxcbiAgICDli5k6IC0xODcyLFxuICAgIOWMljogMTMyNyxcbiAgICDljJc6IC0xMDM4LFxuICAgIOWMujogNDY0NixcbiAgICDljYM6IC0yMzA5LFxuICAgIOWNiDogLTc4MyxcbiAgICDljZQ6IC0xMDA2LFxuICAgIOWPozogNDgzLFxuICAgIOWPszogMTIzMyxcbiAgICDlkIQ6IDM1ODgsXG4gICAg5ZCIOiAtMjQxLFxuICAgIOWQjDogMzkwNixcbiAgICDlkow6IC04MzcsXG4gICAg5ZOhOiA0NTEzLFxuICAgIOWbvTogNjQyLFxuICAgIOWeizogMTM4OSxcbiAgICDloLQ6IDEyMTksXG4gICAg5aSWOiAtMjQxLFxuICAgIOWmuzogMjAxNixcbiAgICDlraY6IC0xMzU2LFxuICAgIOWuiTogLTQyMyxcbiAgICDlrp86IC0xMDA4LFxuICAgIOWutjogMTA3OCxcbiAgICDlsI86IC01MTMsXG4gICAg5bCROiAtMzEwMixcbiAgICDlt546IDExNTUsXG4gICAg5biCOiAzMTk3LFxuICAgIOW5szogLTE4MDQsXG4gICAg5bm0OiAyNDE2LFxuICAgIOW6gzogLTEwMzAsXG4gICAg5bqcOiAxNjA1LFxuICAgIOW6pjogMTQ1MixcbiAgICDlu7o6IC0yMzUyLFxuICAgIOW9kzogLTM4ODUsXG4gICAg5b6XOiAxOTA1LFxuICAgIOaAnTogLTEyOTEsXG4gICAg5oCnOiAxODIyLFxuICAgIOaIuDogLTQ4OCxcbiAgICDmjIc6IC0zOTczLFxuICAgIOaUvzogLTIwMTMsXG4gICAg5pWZOiAtMTQ3OSxcbiAgICDmlbA6IDMyMjIsXG4gICAg5paHOiAtMTQ4OSxcbiAgICDmlrA6IDE3NjQsXG4gICAg5pelOiAyMDk5LFxuICAgIOaXpzogNTc5MixcbiAgICDmmKg6IC02NjEsXG4gICAg5pmCOiAtMTI0OCxcbiAgICDmm5w6IC05NTEsXG4gICAg5pyAOiAtOTM3LFxuICAgIOaciDogNDEyNSxcbiAgICDmnJ86IDM2MCxcbiAgICDmnY46IDMwOTQsXG4gICAg5p2ROiAzNjQsXG4gICAg5p2xOiAtODA1LFxuICAgIOaguDogNTE1NixcbiAgICDmo646IDI0MzgsXG4gICAg5qWtOiA0ODQsXG4gICAg5rCPOiAyNjEzLFxuICAgIOawkTogLTE2OTQsXG4gICAg5rG6OiAtMTA3MyxcbiAgICDms5U6IDE4NjgsXG4gICAg5rW3OiAtNDk1LFxuICAgIOeEoTogOTc5LFxuICAgIOeJqTogNDYxLFxuICAgIOeJuTogLTM4NTAsXG4gICAg55SfOiAtMjczLFxuICAgIOeUqDogOTE0LFxuICAgIOeUujogMTIxNSxcbiAgICDnmoQ6IDczMTMsXG4gICAg55u0OiAtMTgzNSxcbiAgICDnnIE6IDc5MixcbiAgICDnnIw6IDYyOTMsXG4gICAg55+lOiAtMTUyOCxcbiAgICDnp4E6IDQyMzEsXG4gICAg56iOOiA0MDEsXG4gICAg56uLOiAtOTYwLFxuICAgIOesrDogMTIwMSxcbiAgICDnsbM6IDc3NjcsXG4gICAg57O7OiAzMDY2LFxuICAgIOe0hDogMzY2MyxcbiAgICDntJo6IDEzODQsXG4gICAg57WxOiAtNDIyOSxcbiAgICDnt486IDExNjMsXG4gICAg57eaOiAxMjU1LFxuICAgIOiAhTogNjQ1NyxcbiAgICDog706IDcyNSxcbiAgICDoh6o6IC0yODY5LFxuICAgIOiLsTogNzg1LFxuICAgIOimizogMTA0NCxcbiAgICDoqr86IC01NjIsXG4gICAg6LKhOiAtNzMzLFxuICAgIOiyuzogMTc3NyxcbiAgICDou4o6IDE4MzUsXG4gICAg6LuNOiAxMzc1LFxuICAgIOi+vDogLTE1MDQsXG4gICAg6YCaOiAtMTEzNixcbiAgICDpgbg6IC02ODEsXG4gICAg6YOOOiAxMDI2LFxuICAgIOmDoTogNDQwNCxcbiAgICDpg6g6IDEyMDAsXG4gICAg6YeROiAyMTYzLFxuICAgIOmVtzogNDIxLFxuICAgIOmWizogLTE0MzIsXG4gICAg6ZaTOiAxMzAyLFxuICAgIOmWojogLTEyODIsXG4gICAg6ZuoOiAyMDA5LFxuICAgIOmbuzogLTEwNDUsXG4gICAg6Z2eOiAyMDY2LFxuICAgIOmnhTogMTYyMCxcbiAgICBcIu+8kVwiOiAtODAwLFxuICAgIFwi772jXCI6IDI2NzAsXG4gICAgXCLvvaVcIjogLTM3OTQsXG4gICAg772vOiAtMTM1MCxcbiAgICDvvbE6IDU1MSxcbiAgICDvvbjvvp46IDEzMTksXG4gICAg7729OiA4NzQsXG4gICAg776EOiA1MjEsXG4gICAg776ROiAxMTA5LFxuICAgIO++mTogMTU5MSxcbiAgICDvvps6IDIyMDEsXG4gICAg776dOiAyNzgsXG4gIH07XG4gIHRoaXMuVVc0X18gPSB7XG4gICAgXCIsXCI6IDM5MzAsXG4gICAgXCIuXCI6IDM1MDgsXG4gICAgXCLigJVcIjogLTQ4NDEsXG4gICAgXCLjgIFcIjogMzkzMCxcbiAgICBcIuOAglwiOiAzNTA4LFxuICAgIOOAhzogNDk5OSxcbiAgICBcIuOAjFwiOiAxODk1LFxuICAgIFwi44CNXCI6IDM3OTgsXG4gICAgXCLjgJNcIjogLTUxNTYsXG4gICAg44GCOiA0NzUyLFxuICAgIOOBhDogLTM0MzUsXG4gICAg44GGOiAtNjQwLFxuICAgIOOBiDogLTI1MTQsXG4gICAg44GKOiAyNDA1LFxuICAgIOOBizogNTMwLFxuICAgIOOBjDogNjAwNixcbiAgICDjgY06IC00NDgyLFxuICAgIOOBjjogLTM4MjEsXG4gICAg44GPOiAtMzc4OCxcbiAgICDjgZE6IC00Mzc2LFxuICAgIOOBkjogLTQ3MzQsXG4gICAg44GTOiAyMjU1LFxuICAgIOOBlDogMTk3OSxcbiAgICDjgZU6IDI4NjQsXG4gICAg44GXOiAtODQzLFxuICAgIOOBmDogLTI1MDYsXG4gICAg44GZOiAtNzMxLFxuICAgIOOBmjogMTI1MSxcbiAgICDjgZs6IDE4MSxcbiAgICDjgZ06IDQwOTEsXG4gICAg44GfOiA1MDM0LFxuICAgIOOBoDogNTQwOCxcbiAgICDjgaE6IC0zNjU0LFxuICAgIOOBozogLTU4ODIsXG4gICAg44GkOiAtMTY1OSxcbiAgICDjgaY6IDM5OTQsXG4gICAg44GnOiA3NDEwLFxuICAgIOOBqDogNDU0NyxcbiAgICDjgao6IDU0MzMsXG4gICAg44GrOiA2NDk5LFxuICAgIOOBrDogMTg1MyxcbiAgICDjga06IDE0MTMsXG4gICAg44GuOiA3Mzk2LFxuICAgIOOBrzogODU3OCxcbiAgICDjgbA6IDE5NDAsXG4gICAg44GyOiA0MjQ5LFxuICAgIOOBszogLTQxMzQsXG4gICAg44G1OiAxMzQ1LFxuICAgIOOBuDogNjY2NSxcbiAgICDjgbk6IC03NDQsXG4gICAg44G7OiAxNDY0LFxuICAgIOOBvjogMTA1MSxcbiAgICDjgb86IC0yMDgyLFxuICAgIOOCgDogLTg4MixcbiAgICDjgoE6IC01MDQ2LFxuICAgIOOCgjogNDE2OSxcbiAgICDjgoM6IC0yNjY2LFxuICAgIOOChDogMjc5NSxcbiAgICDjgoc6IC0xNTQ0LFxuICAgIOOCiDogMzM1MSxcbiAgICDjgok6IC0yOTIyLFxuICAgIOOCijogLTk3MjYsXG4gICAg44KLOiAtMTQ4OTYsXG4gICAg44KMOiAtMjYxMyxcbiAgICDjgo06IC00NTcwLFxuICAgIOOCjzogLTE3ODMsXG4gICAg44KSOiAxMzE1MCxcbiAgICDjgpM6IC0yMzUyLFxuICAgIOOCqzogMjE0NSxcbiAgICDjgrM6IDE3ODksXG4gICAg44K7OiAxMjg3LFxuICAgIOODgzogLTcyNCxcbiAgICDjg4g6IC00MDMsXG4gICAg44OhOiAtMTYzNSxcbiAgICDjg6k6IC04ODEsXG4gICAg44OqOiAtNTQxLFxuICAgIOODqzogLTg1NixcbiAgICDjg7M6IC0zNjM3LFxuICAgIFwi44O7XCI6IC00MzcxLFxuICAgIOODvDogLTExODcwLFxuICAgIOS4gDogLTIwNjksXG4gICAg5LitOiAyMjEwLFxuICAgIOS6iDogNzgyLFxuICAgIOS6izogLTE5MCxcbiAgICDkupU6IC0xNzY4LFxuICAgIOS6ujogMTAzNixcbiAgICDku6U6IDU0NCxcbiAgICDkvJo6IDk1MCxcbiAgICDkvZM6IC0xMjg2LFxuICAgIOS9nDogNTMwLFxuICAgIOWBtDogNDI5MixcbiAgICDlhYg6IDYwMSxcbiAgICDlhZo6IC0yMDA2LFxuICAgIOWFsTogLTEyMTIsXG4gICAg5YaFOiA1ODQsXG4gICAg5YaGOiA3ODgsXG4gICAg5YidOiAxMzQ3LFxuICAgIOWJjTogMTYyMyxcbiAgICDlia86IDM4NzksXG4gICAg5YqbOiAtMzAyLFxuICAgIOWLlTogLTc0MCxcbiAgICDli5k6IC0yNzE1LFxuICAgIOWMljogNzc2LFxuICAgIOWMujogNDUxNyxcbiAgICDljZQ6IDEwMTMsXG4gICAg5Y+COiAxNTU1LFxuICAgIOWQiDogLTE4MzQsXG4gICAg5ZKMOiAtNjgxLFxuICAgIOWToTogLTkxMCxcbiAgICDlmag6IC04NTEsXG4gICAg5ZueOiAxNTAwLFxuICAgIOWbvTogLTYxOSxcbiAgICDlnJI6IC0xMjAwLFxuICAgIOWcsDogODY2LFxuICAgIOWgtDogLTE0MTAsXG4gICAg5aGBOiAtMjA5NCxcbiAgICDlo6s6IC0xNDEzLFxuICAgIOWkmjogMTA2NyxcbiAgICDlpKc6IDU3MSxcbiAgICDlrZA6IC00ODAyLFxuICAgIOWtpjogLTEzOTcsXG4gICAg5a6aOiAtMTA1NyxcbiAgICDlr7o6IC04MDksXG4gICAg5bCPOiAxOTEwLFxuICAgIOWxizogLTEzMjgsXG4gICAg5bGxOiAtMTUwMCxcbiAgICDls7Y6IC0yMDU2LFxuICAgIOW3nTogLTI2NjcsXG4gICAg5biCOiAyNzcxLFxuICAgIOW5tDogMzc0LFxuICAgIOW6gTogLTQ1NTYsXG4gICAg5b6MOiA0NTYsXG4gICAg5oCnOiA1NTMsXG4gICAg5oSfOiA5MTYsXG4gICAg5omAOiAtMTU2NixcbiAgICDmlK86IDg1NixcbiAgICDmlLk6IDc4NyxcbiAgICDmlL86IDIxODIsXG4gICAg5pWZOiA3MDQsXG4gICAg5paHOiA1MjIsXG4gICAg5pa5OiAtODU2LFxuICAgIOaXpTogMTc5OCxcbiAgICDmmYI6IDE4MjksXG4gICAg5pyAOiA4NDUsXG4gICAg5pyIOiAtOTA2NixcbiAgICDmnKg6IC00ODUsXG4gICAg5p2lOiAtNDQyLFxuICAgIOagoTogLTM2MCxcbiAgICDmpa06IC0xMDQzLFxuICAgIOawjzogNTM4OCxcbiAgICDmsJE6IC0yNzE2LFxuICAgIOawlzogLTkxMCxcbiAgICDmsqI6IC05MzksXG4gICAg5riIOiAtNTQzLFxuICAgIOeJqTogLTczNSxcbiAgICDnjoc6IDY3MixcbiAgICDnkIM6IC0xMjY3LFxuICAgIOeUnzogLTEyODYsXG4gICAg55SjOiAtMTEwMSxcbiAgICDnlLA6IC0yOTAwLFxuICAgIOeUujogMTgyNixcbiAgICDnmoQ6IDI1ODYsXG4gICAg55uuOiA5MjIsXG4gICAg55yBOiAtMzQ4NSxcbiAgICDnnIw6IDI5OTcsXG4gICAg56m6OiAtODY3LFxuICAgIOerizogLTIxMTIsXG4gICAg56ysOiA3ODgsXG4gICAg57GzOiAyOTM3LFxuICAgIOezuzogNzg2LFxuICAgIOe0hDogMjE3MSxcbiAgICDntYw6IDExNDYsXG4gICAg57WxOiAtMTE2OSxcbiAgICDnt486IDk0MCxcbiAgICDnt5o6IC05OTQsXG4gICAg572yOiA3NDksXG4gICAg6ICFOiAyMTQ1LFxuICAgIOiDvTogLTczMCxcbiAgICDoiKw6IC04NTIsXG4gICAg6KGMOiAtNzkyLFxuICAgIOimjzogNzkyLFxuICAgIOitpjogLTExODQsXG4gICAg6K2wOiAtMjQ0LFxuICAgIOiwtzogLTEwMDAsXG4gICAg6LOeOiA3MzAsXG4gICAg6LuKOiAtMTQ4MSxcbiAgICDou406IDExNTgsXG4gICAg6LyqOiAtMTQzMyxcbiAgICDovrw6IC0zMzcwLFxuICAgIOi/kTogOTI5LFxuICAgIOmBkzogLTEyOTEsXG4gICAg6YG4OiAyNTk2LFxuICAgIOmDjjogLTQ4NjYsXG4gICAg6YO9OiAxMTkyLFxuICAgIOmHjjogLTExMDAsXG4gICAg6YqAOiAtMjIxMyxcbiAgICDplbc6IDM1NyxcbiAgICDplpM6IC0yMzQ0LFxuICAgIOmZojogLTIyOTcsXG4gICAg6ZqbOiAtMjYwNCxcbiAgICDpm7s6IC04NzgsXG4gICAg6aCYOiAtMTY1OSxcbiAgICDpoYw6IC03OTIsXG4gICAg6aSoOiAtMTk4NCxcbiAgICDpppY6IDE3NDksXG4gICAg6auYOiAyMTIwLFxuICAgIFwi772iXCI6IDE4OTUsXG4gICAgXCLvvaNcIjogMzc5OCxcbiAgICBcIu+9pVwiOiAtNDM3MSxcbiAgICDvva86IC03MjQsXG4gICAg772wOiAtMTE4NzAsXG4gICAg7722OiAyMTQ1LFxuICAgIO+9ujogMTc4OSxcbiAgICDvvb46IDEyODcsXG4gICAg776EOiAtNDAzLFxuICAgIO++kjogLTE2MzUsXG4gICAg776XOiAtODgxLFxuICAgIO++mDogLTU0MSxcbiAgICDvvpk6IC04NTYsXG4gICAg776dOiAtMzYzNyxcbiAgfTtcbiAgdGhpcy5VVzVfXyA9IHtcbiAgICBcIixcIjogNDY1LFxuICAgIFwiLlwiOiAtMjk5LFxuICAgIDE6IC01MTQsXG4gICAgRTI6IC0zMjc2OCxcbiAgICBcIl1cIjogLTI3NjIsXG4gICAgXCLjgIFcIjogNDY1LFxuICAgIFwi44CCXCI6IC0yOTksXG4gICAgXCLjgIxcIjogMzYzLFxuICAgIOOBgjogMTY1NSxcbiAgICDjgYQ6IDMzMSxcbiAgICDjgYY6IC01MDMsXG4gICAg44GIOiAxMTk5LFxuICAgIOOBijogNTI3LFxuICAgIOOBizogNjQ3LFxuICAgIOOBjDogLTQyMSxcbiAgICDjgY06IDE2MjQsXG4gICAg44GOOiAxOTcxLFxuICAgIOOBjzogMzEyLFxuICAgIOOBkjogLTk4MyxcbiAgICDjgZU6IC0xNTM3LFxuICAgIOOBlzogLTEzNzEsXG4gICAg44GZOiAtODUyLFxuICAgIOOBoDogLTExODYsXG4gICAg44GhOiAxMDkzLFxuICAgIOOBozogNTIsXG4gICAg44GkOiA5MjEsXG4gICAg44GmOiAtMTgsXG4gICAg44GnOiAtODUwLFxuICAgIOOBqDogLTEyNyxcbiAgICDjgak6IDE2ODIsXG4gICAg44GqOiAtNzg3LFxuICAgIOOBqzogLTEyMjQsXG4gICAg44GuOiAtNjM1LFxuICAgIOOBrzogLTU3OCxcbiAgICDjgbk6IDEwMDEsXG4gICAg44G/OiA1MDIsXG4gICAg44KBOiA4NjUsXG4gICAg44KDOiAzMzUwLFxuICAgIOOChzogODU0LFxuICAgIOOCijogLTIwOCxcbiAgICDjgos6IDQyOSxcbiAgICDjgow6IDUwNCxcbiAgICDjgo86IDQxOSxcbiAgICDjgpI6IC0xMjY0LFxuICAgIOOCkzogMzI3LFxuICAgIOOCpDogMjQxLFxuICAgIOODqzogNDUxLFxuICAgIOODszogLTM0MyxcbiAgICDkuK06IC04NzEsXG4gICAg5LqsOiA3MjIsXG4gICAg5LyaOiAtMTE1MyxcbiAgICDlhZo6IC02NTQsXG4gICAg5YuZOiAzNTE5LFxuICAgIOWMujogLTkwMSxcbiAgICDlkYo6IDg0OCxcbiAgICDlk6E6IDIxMDQsXG4gICAg5aSnOiAtMTI5NixcbiAgICDlraY6IC01NDgsXG4gICAg5a6aOiAxNzg1LFxuICAgIOW1kDogLTEzMDQsXG4gICAg5biCOiAtMjk5MSxcbiAgICDluK06IDkyMSxcbiAgICDlubQ6IDE3NjMsXG4gICAg5oCdOiA4NzIsXG4gICAg5omAOiAtODE0LFxuICAgIOaMmTogMTYxOCxcbiAgICDmlrA6IC0xNjgyLFxuICAgIOaXpTogMjE4LFxuICAgIOaciDogLTQzNTMsXG4gICAg5p+7OiA5MzIsXG4gICAg5qC8OiAxMzU2LFxuICAgIOapnzogLTE1MDgsXG4gICAg5rCPOiAtMTM0NyxcbiAgICDnlLA6IDI0MCxcbiAgICDnlLo6IC0zOTEyLFxuICAgIOeahDogLTMxNDksXG4gICAg55u4OiAxMzE5LFxuICAgIOecgTogLTEwNTIsXG4gICAg55yMOiAtNDAwMyxcbiAgICDnoJQ6IC05OTcsXG4gICAg56S+OiAtMjc4LFxuICAgIOepujogLTgxMyxcbiAgICDntbE6IDE5NTUsXG4gICAg6ICFOiAtMjIzMyxcbiAgICDooag6IDY2MyxcbiAgICDoqp46IC0xMDczLFxuICAgIOitsDogMTIxOSxcbiAgICDpgbg6IC0xMDE4LFxuICAgIOmDjjogLTM2OCxcbiAgICDplbc6IDc4NixcbiAgICDplpM6IDExOTEsXG4gICAg6aGMOiAyMzY4LFxuICAgIOmkqDogLTY4OSxcbiAgICBcIu+8kVwiOiAtNTE0LFxuICAgIO+8pe+8kjogLTMyNzY4LFxuICAgIFwi772iXCI6IDM2MyxcbiAgICDvvbI6IDI0MSxcbiAgICDvvpk6IDQ1MSxcbiAgICDvvp06IC0zNDMsXG4gIH07XG4gIHRoaXMuVVc2X18gPSB7XG4gICAgXCIsXCI6IDIyNyxcbiAgICBcIi5cIjogODA4LFxuICAgIDE6IC0yNzAsXG4gICAgRTE6IDMwNixcbiAgICBcIuOAgVwiOiAyMjcsXG4gICAgXCLjgIJcIjogODA4LFxuICAgIOOBgjogLTMwNyxcbiAgICDjgYY6IDE4OSxcbiAgICDjgYs6IDI0MSxcbiAgICDjgYw6IC03MyxcbiAgICDjgY86IC0xMjEsXG4gICAg44GTOiAtMjAwLFxuICAgIOOBmDogMTc4MixcbiAgICDjgZk6IDM4MyxcbiAgICDjgZ86IC00MjgsXG4gICAg44GjOiA1NzMsXG4gICAg44GmOiAtMTAxNCxcbiAgICDjgac6IDEwMSxcbiAgICDjgag6IC0xMDUsXG4gICAg44GqOiAtMjUzLFxuICAgIOOBqzogLTE0OSxcbiAgICDjga46IC00MTcsXG4gICAg44GvOiAtMjM2LFxuICAgIOOCgjogLTIwNixcbiAgICDjgoo6IDE4NyxcbiAgICDjgos6IC0xMzUsXG4gICAg44KSOiAxOTUsXG4gICAg44OrOiAtNjczLFxuICAgIOODszogLTQ5NixcbiAgICDkuIA6IC0yNzcsXG4gICAg5LitOiAyMDEsXG4gICAg5Lu2OiAtODAwLFxuICAgIOS8mjogNjI0LFxuICAgIOWJjTogMzAyLFxuICAgIOWMujogMTc5MixcbiAgICDlk6E6IC0xMjEyLFxuICAgIOWnlDogNzk4LFxuICAgIOWtpjogLTk2MCxcbiAgICDluII6IDg4NyxcbiAgICDluoM6IC02OTUsXG4gICAg5b6MOiA1MzUsXG4gICAg5qWtOiAtNjk3LFxuICAgIOebuDogNzUzLFxuICAgIOekvjogLTUwNyxcbiAgICDnpo86IDk3NCxcbiAgICDnqbo6IC04MjIsXG4gICAg6ICFOiAxODExLFxuICAgIOmAozogNDYzLFxuICAgIOmDjjogMTA4MixcbiAgICBcIu+8kVwiOiAtMjcwLFxuICAgIO+8pe+8kTogMzA2LFxuICAgIO++mTogLTY3MyxcbiAgICDvvp06IC00OTYsXG4gIH07XG5cbiAgcmV0dXJuIHRoaXM7XG59XG5cblRpbnlTZWdtZW50ZXIucHJvdG90eXBlLmN0eXBlXyA9IGZ1bmN0aW9uIChzdHIpIHtcbiAgZm9yICh2YXIgaSBpbiB0aGlzLmNoYXJ0eXBlXykge1xuICAgIGlmIChzdHIubWF0Y2godGhpcy5jaGFydHlwZV9baV1bMF0pKSB7XG4gICAgICByZXR1cm4gdGhpcy5jaGFydHlwZV9baV1bMV07XG4gICAgfVxuICB9XG4gIHJldHVybiBcIk9cIjtcbn07XG5cblRpbnlTZWdtZW50ZXIucHJvdG90eXBlLnRzXyA9IGZ1bmN0aW9uICh2KSB7XG4gIGlmICh2KSB7XG4gICAgcmV0dXJuIHY7XG4gIH1cbiAgcmV0dXJuIDA7XG59O1xuXG5UaW55U2VnbWVudGVyLnByb3RvdHlwZS5zZWdtZW50ID0gZnVuY3Rpb24gKGlucHV0KSB7XG4gIGlmIChpbnB1dCA9PSBudWxsIHx8IGlucHV0ID09IHVuZGVmaW5lZCB8fCBpbnB1dCA9PSBcIlwiKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgdmFyIHNlZyA9IFtcIkIzXCIsIFwiQjJcIiwgXCJCMVwiXTtcbiAgdmFyIGN0eXBlID0gW1wiT1wiLCBcIk9cIiwgXCJPXCJdO1xuICB2YXIgbyA9IGlucHV0LnNwbGl0KFwiXCIpO1xuICBmb3IgKGkgPSAwOyBpIDwgby5sZW5ndGg7ICsraSkge1xuICAgIHNlZy5wdXNoKG9baV0pO1xuICAgIGN0eXBlLnB1c2godGhpcy5jdHlwZV8ob1tpXSkpO1xuICB9XG4gIHNlZy5wdXNoKFwiRTFcIik7XG4gIHNlZy5wdXNoKFwiRTJcIik7XG4gIHNlZy5wdXNoKFwiRTNcIik7XG4gIGN0eXBlLnB1c2goXCJPXCIpO1xuICBjdHlwZS5wdXNoKFwiT1wiKTtcbiAgY3R5cGUucHVzaChcIk9cIik7XG4gIHZhciB3b3JkID0gc2VnWzNdO1xuICB2YXIgcDEgPSBcIlVcIjtcbiAgdmFyIHAyID0gXCJVXCI7XG4gIHZhciBwMyA9IFwiVVwiO1xuICBmb3IgKHZhciBpID0gNDsgaSA8IHNlZy5sZW5ndGggLSAzOyArK2kpIHtcbiAgICB2YXIgc2NvcmUgPSB0aGlzLkJJQVNfXztcbiAgICB2YXIgdzEgPSBzZWdbaSAtIDNdO1xuICAgIHZhciB3MiA9IHNlZ1tpIC0gMl07XG4gICAgdmFyIHczID0gc2VnW2kgLSAxXTtcbiAgICB2YXIgdzQgPSBzZWdbaV07XG4gICAgdmFyIHc1ID0gc2VnW2kgKyAxXTtcbiAgICB2YXIgdzYgPSBzZWdbaSArIDJdO1xuICAgIHZhciBjMSA9IGN0eXBlW2kgLSAzXTtcbiAgICB2YXIgYzIgPSBjdHlwZVtpIC0gMl07XG4gICAgdmFyIGMzID0gY3R5cGVbaSAtIDFdO1xuICAgIHZhciBjNCA9IGN0eXBlW2ldO1xuICAgIHZhciBjNSA9IGN0eXBlW2kgKyAxXTtcbiAgICB2YXIgYzYgPSBjdHlwZVtpICsgMl07XG4gICAgc2NvcmUgKz0gdGhpcy50c18odGhpcy5VUDFfX1twMV0pO1xuICAgIHNjb3JlICs9IHRoaXMudHNfKHRoaXMuVVAyX19bcDJdKTtcbiAgICBzY29yZSArPSB0aGlzLnRzXyh0aGlzLlVQM19fW3AzXSk7XG4gICAgc2NvcmUgKz0gdGhpcy50c18odGhpcy5CUDFfX1twMSArIHAyXSk7XG4gICAgc2NvcmUgKz0gdGhpcy50c18odGhpcy5CUDJfX1twMiArIHAzXSk7XG4gICAgc2NvcmUgKz0gdGhpcy50c18odGhpcy5VVzFfX1t3MV0pO1xuICAgIHNjb3JlICs9IHRoaXMudHNfKHRoaXMuVVcyX19bdzJdKTtcbiAgICBzY29yZSArPSB0aGlzLnRzXyh0aGlzLlVXM19fW3czXSk7XG4gICAgc2NvcmUgKz0gdGhpcy50c18odGhpcy5VVzRfX1t3NF0pO1xuICAgIHNjb3JlICs9IHRoaXMudHNfKHRoaXMuVVc1X19bdzVdKTtcbiAgICBzY29yZSArPSB0aGlzLnRzXyh0aGlzLlVXNl9fW3c2XSk7XG4gICAgc2NvcmUgKz0gdGhpcy50c18odGhpcy5CVzFfX1t3MiArIHczXSk7XG4gICAgc2NvcmUgKz0gdGhpcy50c18odGhpcy5CVzJfX1t3MyArIHc0XSk7XG4gICAgc2NvcmUgKz0gdGhpcy50c18odGhpcy5CVzNfX1t3NCArIHc1XSk7XG4gICAgc2NvcmUgKz0gdGhpcy50c18odGhpcy5UVzFfX1t3MSArIHcyICsgdzNdKTtcbiAgICBzY29yZSArPSB0aGlzLnRzXyh0aGlzLlRXMl9fW3cyICsgdzMgKyB3NF0pO1xuICAgIHNjb3JlICs9IHRoaXMudHNfKHRoaXMuVFczX19bdzMgKyB3NCArIHc1XSk7XG4gICAgc2NvcmUgKz0gdGhpcy50c18odGhpcy5UVzRfX1t3NCArIHc1ICsgdzZdKTtcbiAgICBzY29yZSArPSB0aGlzLnRzXyh0aGlzLlVDMV9fW2MxXSk7XG4gICAgc2NvcmUgKz0gdGhpcy50c18odGhpcy5VQzJfX1tjMl0pO1xuICAgIHNjb3JlICs9IHRoaXMudHNfKHRoaXMuVUMzX19bYzNdKTtcbiAgICBzY29yZSArPSB0aGlzLnRzXyh0aGlzLlVDNF9fW2M0XSk7XG4gICAgc2NvcmUgKz0gdGhpcy50c18odGhpcy5VQzVfX1tjNV0pO1xuICAgIHNjb3JlICs9IHRoaXMudHNfKHRoaXMuVUM2X19bYzZdKTtcbiAgICBzY29yZSArPSB0aGlzLnRzXyh0aGlzLkJDMV9fW2MyICsgYzNdKTtcbiAgICBzY29yZSArPSB0aGlzLnRzXyh0aGlzLkJDMl9fW2MzICsgYzRdKTtcbiAgICBzY29yZSArPSB0aGlzLnRzXyh0aGlzLkJDM19fW2M0ICsgYzVdKTtcbiAgICBzY29yZSArPSB0aGlzLnRzXyh0aGlzLlRDMV9fW2MxICsgYzIgKyBjM10pO1xuICAgIHNjb3JlICs9IHRoaXMudHNfKHRoaXMuVEMyX19bYzIgKyBjMyArIGM0XSk7XG4gICAgc2NvcmUgKz0gdGhpcy50c18odGhpcy5UQzNfX1tjMyArIGM0ICsgYzVdKTtcbiAgICBzY29yZSArPSB0aGlzLnRzXyh0aGlzLlRDNF9fW2M0ICsgYzUgKyBjNl0pO1xuICAgIC8vICBzY29yZSArPSB0aGlzLnRzXyh0aGlzLlRDNV9fW2M0ICsgYzUgKyBjNl0pO1xuICAgIHNjb3JlICs9IHRoaXMudHNfKHRoaXMuVVExX19bcDEgKyBjMV0pO1xuICAgIHNjb3JlICs9IHRoaXMudHNfKHRoaXMuVVEyX19bcDIgKyBjMl0pO1xuICAgIHNjb3JlICs9IHRoaXMudHNfKHRoaXMuVVEzX19bcDMgKyBjM10pO1xuICAgIHNjb3JlICs9IHRoaXMudHNfKHRoaXMuQlExX19bcDIgKyBjMiArIGMzXSk7XG4gICAgc2NvcmUgKz0gdGhpcy50c18odGhpcy5CUTJfX1twMiArIGMzICsgYzRdKTtcbiAgICBzY29yZSArPSB0aGlzLnRzXyh0aGlzLkJRM19fW3AzICsgYzIgKyBjM10pO1xuICAgIHNjb3JlICs9IHRoaXMudHNfKHRoaXMuQlE0X19bcDMgKyBjMyArIGM0XSk7XG4gICAgc2NvcmUgKz0gdGhpcy50c18odGhpcy5UUTFfX1twMiArIGMxICsgYzIgKyBjM10pO1xuICAgIHNjb3JlICs9IHRoaXMudHNfKHRoaXMuVFEyX19bcDIgKyBjMiArIGMzICsgYzRdKTtcbiAgICBzY29yZSArPSB0aGlzLnRzXyh0aGlzLlRRM19fW3AzICsgYzEgKyBjMiArIGMzXSk7XG4gICAgc2NvcmUgKz0gdGhpcy50c18odGhpcy5UUTRfX1twMyArIGMyICsgYzMgKyBjNF0pO1xuICAgIHZhciBwID0gXCJPXCI7XG4gICAgaWYgKHNjb3JlID4gMCkge1xuICAgICAgcmVzdWx0LnB1c2god29yZCk7XG4gICAgICB3b3JkID0gXCJcIjtcbiAgICAgIHAgPSBcIkJcIjtcbiAgICB9XG4gICAgcDEgPSBwMjtcbiAgICBwMiA9IHAzO1xuICAgIHAzID0gcDtcbiAgICB3b3JkICs9IHNlZ1tpXTtcbiAgfVxuICByZXN1bHQucHVzaCh3b3JkKTtcblxuICByZXR1cm4gcmVzdWx0O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgVGlueVNlZ21lbnRlcjtcbiIsImltcG9ydCBUaW55U2VnbWVudGVyIGZyb20gXCIuLi8uLi9leHRlcm5hbC90aW55LXNlZ21lbnRlclwiO1xuaW1wb3J0IHsgVFJJTV9DSEFSX1BBVFRFUk4gfSBmcm9tIFwiLi9EZWZhdWx0VG9rZW5pemVyXCI7XG5pbXBvcnQgdHlwZSB7IFRva2VuaXplciB9IGZyb20gXCIuLi90b2tlbml6ZXJcIjtcbi8vIEB0cy1pZ25vcmVcbmNvbnN0IHNlZ21lbnRlciA9IG5ldyBUaW55U2VnbWVudGVyKCk7XG5cbmZ1bmN0aW9uIHBpY2tUb2tlbnNBc0phcGFuZXNlKGNvbnRlbnQ6IHN0cmluZywgdHJpbVBhdHRlcm46IFJlZ0V4cCk6IHN0cmluZ1tdIHtcbiAgcmV0dXJuIGNvbnRlbnRcbiAgICAuc3BsaXQodHJpbVBhdHRlcm4pXG4gICAgLmZpbHRlcigoeCkgPT4geCAhPT0gXCJcIilcbiAgICAuZmxhdE1hcDxzdHJpbmc+KCh4KSA9PiBzZWdtZW50ZXIuc2VnbWVudCh4KSk7XG59XG5cbi8qKlxuICogSmFwYW5lc2UgbmVlZHMgb3JpZ2luYWwgbG9naWMuXG4gKi9cbmV4cG9ydCBjbGFzcyBKYXBhbmVzZVRva2VuaXplciBpbXBsZW1lbnRzIFRva2VuaXplciB7XG4gIHRva2VuaXplKGNvbnRlbnQ6IHN0cmluZywgcmF3PzogYm9vbGVhbik6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gcGlja1Rva2Vuc0FzSmFwYW5lc2UoY29udGVudCwgcmF3ID8gLyAvZyA6IHRoaXMuZ2V0VHJpbVBhdHRlcm4oKSk7XG4gIH1cblxuICByZWN1cnNpdmVUb2tlbml6ZShjb250ZW50OiBzdHJpbmcpOiB7IHdvcmQ6IHN0cmluZzsgb2Zmc2V0OiBudW1iZXIgfVtdIHtcbiAgICBjb25zdCB0b2tlbnM6IHN0cmluZ1tdID0gc2VnbWVudGVyXG4gICAgICAuc2VnbWVudChjb250ZW50KVxuICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3RhZGFzaGktYWlrYXdhL29ic2lkaWFuLXZhcmlvdXMtY29tcGxlbWVudHMtcGx1Z2luL2lzc3Vlcy83N1xuICAgICAgLmZsYXRNYXAoKHg6IHN0cmluZykgPT5cbiAgICAgICAgeCA9PT0gXCIgXCIgPyB4IDogeC5zcGxpdChcIiBcIikubWFwKCh0KSA9PiAodCA9PT0gXCJcIiA/IFwiIFwiIDogdCkpXG4gICAgICApO1xuXG4gICAgY29uc3QgcmV0ID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0b2tlbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChcbiAgICAgICAgaSA9PT0gMCB8fFxuICAgICAgICB0b2tlbnNbaV0ubGVuZ3RoICE9PSAxIHx8XG4gICAgICAgICFCb29sZWFuKHRva2Vuc1tpXS5tYXRjaCh0aGlzLmdldFRyaW1QYXR0ZXJuKCkpKVxuICAgICAgKSB7XG4gICAgICAgIHJldC5wdXNoKHtcbiAgICAgICAgICB3b3JkOiB0b2tlbnMuc2xpY2UoaSkuam9pbihcIlwiKSxcbiAgICAgICAgICBvZmZzZXQ6IHRva2Vucy5zbGljZSgwLCBpKS5qb2luKFwiXCIpLmxlbmd0aCxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJldDtcbiAgfVxuXG4gIGdldFRyaW1QYXR0ZXJuKCk6IFJlZ0V4cCB7XG4gICAgcmV0dXJuIFRSSU1fQ0hBUl9QQVRURVJOO1xuICB9XG5cbiAgc2hvdWxkSWdub3JlKHN0cjogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIEJvb2xlYW4oc3RyLm1hdGNoKC9eW+OBgS3jgpPvvYEt772a77yhLe+8uuOAguOAgeODvOOAgF0qJC8pKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgRGVmYXVsdFRva2VuaXplciB9IGZyb20gXCIuL0RlZmF1bHRUb2tlbml6ZXJcIjtcblxudHlwZSBQcmV2aW91c1R5cGUgPSBcIm5vbmVcIiB8IFwidHJpbVwiIHwgXCJlbmdsaXNoXCIgfCBcIm90aGVyc1wiO1xuY29uc3QgRU5HTElTSF9QQVRURVJOID0gL1thLXpBLVowLTlfXFwtXFxcXF0vO1xuZXhwb3J0IGNsYXNzIEVuZ2xpc2hPbmx5VG9rZW5pemVyIGV4dGVuZHMgRGVmYXVsdFRva2VuaXplciB7XG4gIHRva2VuaXplKGNvbnRlbnQ6IHN0cmluZywgcmF3PzogYm9vbGVhbik6IHN0cmluZ1tdIHtcbiAgICBjb25zdCB0b2tlbml6ZWQgPSBBcnJheS5mcm9tKHRoaXMuX3Rva2VuaXplKGNvbnRlbnQpKS5maWx0ZXIoKHgpID0+XG4gICAgICB4LndvcmQubWF0Y2goRU5HTElTSF9QQVRURVJOKVxuICAgICk7XG4gICAgcmV0dXJuIHJhd1xuICAgICAgPyB0b2tlbml6ZWQubWFwKCh4KSA9PiB4LndvcmQpXG4gICAgICA6IHRva2VuaXplZFxuICAgICAgICAgIC5tYXAoKHgpID0+IHgud29yZClcbiAgICAgICAgICAuZmlsdGVyKCh4KSA9PiAheC5tYXRjaCh0aGlzLmdldFRyaW1QYXR0ZXJuKCkpKTtcbiAgfVxuXG4gIHJlY3Vyc2l2ZVRva2VuaXplKGNvbnRlbnQ6IHN0cmluZyk6IHsgd29yZDogc3RyaW5nOyBvZmZzZXQ6IG51bWJlciB9W10ge1xuICAgIGNvbnN0IG9mZnNldHMgPSBBcnJheS5mcm9tKHRoaXMuX3Rva2VuaXplKGNvbnRlbnQpKVxuICAgICAgLmZpbHRlcigoeCkgPT4gIXgud29yZC5tYXRjaCh0aGlzLmdldFRyaW1QYXR0ZXJuKCkpKVxuICAgICAgLm1hcCgoeCkgPT4geC5vZmZzZXQpO1xuICAgIHJldHVybiBbXG4gICAgICAuLi5vZmZzZXRzLm1hcCgoaSkgPT4gKHtcbiAgICAgICAgd29yZDogY29udGVudC5zbGljZShpKSxcbiAgICAgICAgb2Zmc2V0OiBpLFxuICAgICAgfSkpLFxuICAgIF07XG4gIH1cblxuICBwcml2YXRlICpfdG9rZW5pemUoXG4gICAgY29udGVudDogc3RyaW5nXG4gICk6IEl0ZXJhYmxlPHsgd29yZDogc3RyaW5nOyBvZmZzZXQ6IG51bWJlciB9PiB7XG4gICAgbGV0IHN0YXJ0SW5kZXggPSAwO1xuICAgIGxldCBwcmV2aW91c1R5cGU6IFByZXZpb3VzVHlwZSA9IFwibm9uZVwiO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb250ZW50Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoY29udGVudFtpXS5tYXRjaChzdXBlci5nZXRUcmltUGF0dGVybigpKSkge1xuICAgICAgICB5aWVsZCB7IHdvcmQ6IGNvbnRlbnQuc2xpY2Uoc3RhcnRJbmRleCwgaSksIG9mZnNldDogc3RhcnRJbmRleCB9O1xuICAgICAgICBwcmV2aW91c1R5cGUgPSBcInRyaW1cIjtcbiAgICAgICAgc3RhcnRJbmRleCA9IGk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoY29udGVudFtpXS5tYXRjaChFTkdMSVNIX1BBVFRFUk4pKSB7XG4gICAgICAgIGlmIChwcmV2aW91c1R5cGUgPT09IFwiZW5nbGlzaFwiIHx8IHByZXZpb3VzVHlwZSA9PT0gXCJub25lXCIpIHtcbiAgICAgICAgICBwcmV2aW91c1R5cGUgPSBcImVuZ2xpc2hcIjtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHlpZWxkIHsgd29yZDogY29udGVudC5zbGljZShzdGFydEluZGV4LCBpKSwgb2Zmc2V0OiBzdGFydEluZGV4IH07XG4gICAgICAgIHByZXZpb3VzVHlwZSA9IFwiZW5nbGlzaFwiO1xuICAgICAgICBzdGFydEluZGV4ID0gaTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChwcmV2aW91c1R5cGUgPT09IFwib3RoZXJzXCIgfHwgcHJldmlvdXNUeXBlID09PSBcIm5vbmVcIikge1xuICAgICAgICBwcmV2aW91c1R5cGUgPSBcIm90aGVyc1wiO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgeWllbGQgeyB3b3JkOiBjb250ZW50LnNsaWNlKHN0YXJ0SW5kZXgsIGkpLCBvZmZzZXQ6IHN0YXJ0SW5kZXggfTtcbiAgICAgIHByZXZpb3VzVHlwZSA9IFwib3RoZXJzXCI7XG4gICAgICBzdGFydEluZGV4ID0gaTtcbiAgICB9XG5cbiAgICB5aWVsZCB7XG4gICAgICB3b3JkOiBjb250ZW50LnNsaWNlKHN0YXJ0SW5kZXgsIGNvbnRlbnQubGVuZ3RoKSxcbiAgICAgIG9mZnNldDogc3RhcnRJbmRleCxcbiAgICB9O1xuICB9XG59XG4iLCJpbXBvcnQgeyBBcmFiaWNUb2tlbml6ZXIgfSBmcm9tIFwiLi90b2tlbml6ZXJzL0FyYWJpY1Rva2VuaXplclwiO1xuaW1wb3J0IHsgRGVmYXVsdFRva2VuaXplciB9IGZyb20gXCIuL3Rva2VuaXplcnMvRGVmYXVsdFRva2VuaXplclwiO1xuaW1wb3J0IHsgSmFwYW5lc2VUb2tlbml6ZXIgfSBmcm9tIFwiLi90b2tlbml6ZXJzL0phcGFuZXNlVG9rZW5pemVyXCI7XG5pbXBvcnQgdHlwZSB7IFRva2VuaXplU3RyYXRlZ3kgfSBmcm9tIFwiLi9Ub2tlbml6ZVN0cmF0ZWd5XCI7XG5pbXBvcnQgeyBFbmdsaXNoT25seVRva2VuaXplciB9IGZyb20gXCIuL3Rva2VuaXplcnMvRW5nbGlzaE9ubHlUb2tlbml6ZXJcIjtcblxuZXhwb3J0IGludGVyZmFjZSBUb2tlbml6ZXIge1xuICB0b2tlbml6ZShjb250ZW50OiBzdHJpbmcsIHJhdz86IGJvb2xlYW4pOiBzdHJpbmdbXTtcbiAgcmVjdXJzaXZlVG9rZW5pemUoY29udGVudDogc3RyaW5nKTogeyB3b3JkOiBzdHJpbmc7IG9mZnNldDogbnVtYmVyIH1bXTtcbiAgZ2V0VHJpbVBhdHRlcm4oKTogUmVnRXhwO1xuICBzaG91bGRJZ25vcmUocXVlcnk6IHN0cmluZyk6IGJvb2xlYW47XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVUb2tlbml6ZXIoc3RyYXRlZ3k6IFRva2VuaXplU3RyYXRlZ3kpOiBUb2tlbml6ZXIge1xuICBzd2l0Y2ggKHN0cmF0ZWd5Lm5hbWUpIHtcbiAgICBjYXNlIFwiZGVmYXVsdFwiOlxuICAgICAgcmV0dXJuIG5ldyBEZWZhdWx0VG9rZW5pemVyKCk7XG4gICAgY2FzZSBcImVuZ2xpc2gtb25seVwiOlxuICAgICAgcmV0dXJuIG5ldyBFbmdsaXNoT25seVRva2VuaXplcigpO1xuICAgIGNhc2UgXCJhcmFiaWNcIjpcbiAgICAgIHJldHVybiBuZXcgQXJhYmljVG9rZW5pemVyKCk7XG4gICAgY2FzZSBcImphcGFuZXNlXCI6XG4gICAgICByZXR1cm4gbmV3IEphcGFuZXNlVG9rZW5pemVyKCk7XG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVW5leHBlY3RlZCBzdHJhdGVneSBuYW1lOiAke3N0cmF0ZWd5fWApO1xuICB9XG59XG4iLCJ0eXBlIE5hbWUgPSBcImRlZmF1bHRcIiB8IFwiZW5nbGlzaC1vbmx5XCIgfCBcImphcGFuZXNlXCIgfCBcImFyYWJpY1wiO1xuXG5leHBvcnQgY2xhc3MgVG9rZW5pemVTdHJhdGVneSB7XG4gIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IF92YWx1ZXM6IFRva2VuaXplU3RyYXRlZ3lbXSA9IFtdO1xuXG4gIHN0YXRpYyByZWFkb25seSBERUZBVUxUID0gbmV3IFRva2VuaXplU3RyYXRlZ3koXCJkZWZhdWx0XCIsIDMpO1xuICBzdGF0aWMgcmVhZG9ubHkgRU5HTElTSF9PTkxZID0gbmV3IFRva2VuaXplU3RyYXRlZ3koXCJlbmdsaXNoLW9ubHlcIiwgMyk7XG4gIHN0YXRpYyByZWFkb25seSBKQVBBTkVTRSA9IG5ldyBUb2tlbml6ZVN0cmF0ZWd5KFwiamFwYW5lc2VcIiwgMik7XG4gIHN0YXRpYyByZWFkb25seSBBUkFCSUMgPSBuZXcgVG9rZW5pemVTdHJhdGVneShcImFyYWJpY1wiLCAzKTtcblxuICBwcml2YXRlIGNvbnN0cnVjdG9yKHJlYWRvbmx5IG5hbWU6IE5hbWUsIHJlYWRvbmx5IHRyaWdnZXJUaHJlc2hvbGQ6IG51bWJlcikge1xuICAgIFRva2VuaXplU3RyYXRlZ3kuX3ZhbHVlcy5wdXNoKHRoaXMpO1xuICB9XG5cbiAgc3RhdGljIGZyb21OYW1lKG5hbWU6IHN0cmluZyk6IFRva2VuaXplU3RyYXRlZ3kge1xuICAgIHJldHVybiBUb2tlbml6ZVN0cmF0ZWd5Ll92YWx1ZXMuZmluZCgoeCkgPT4geC5uYW1lID09PSBuYW1lKSE7XG4gIH1cblxuICBzdGF0aWMgdmFsdWVzKCk6IFRva2VuaXplU3RyYXRlZ3lbXSB7XG4gICAgcmV0dXJuIFRva2VuaXplU3RyYXRlZ3kuX3ZhbHVlcztcbiAgfVxufVxuIiwiaW1wb3J0IHtcbiAgQXBwLFxuICBFZGl0b3IsXG4gIHR5cGUgRWRpdG9yUG9zaXRpb24sXG4gIE1hcmtkb3duVmlldyxcbiAgbm9ybWFsaXplUGF0aCxcbiAgcGFyc2VGcm9udE1hdHRlckFsaWFzZXMsXG4gIHBhcnNlRnJvbnRNYXR0ZXJTdHJpbmdBcnJheSxcbiAgcGFyc2VGcm9udE1hdHRlclRhZ3MsXG4gIFRGaWxlLFxuICBWYXVsdCxcbn0gZnJvbSBcIm9ic2lkaWFuXCI7XG5cbmludGVyZmFjZSBVbnNhZmVBcHBJbnRlcmZhY2Uge1xuICB2YXVsdDogVmF1bHQgJiB7XG4gICAgY29uZmlnOiB7XG4gICAgICBzcGVsbGNoZWNrRGljdGlvbmFyeT86IHN0cmluZ1tdO1xuICAgIH07XG4gIH07XG59XG5cbmV4cG9ydCB0eXBlIEZyb250TWF0dGVyVmFsdWUgPSBzdHJpbmdbXTtcblxuZXhwb3J0IGNsYXNzIEFwcEhlbHBlciB7XG4gIHByaXZhdGUgdW5zYWZlQXBwOiBBcHAgJiBVbnNhZmVBcHBJbnRlcmZhY2U7XG5cbiAgY29uc3RydWN0b3IoYXBwOiBBcHApIHtcbiAgICB0aGlzLnVuc2FmZUFwcCA9IGFwcCBhcyBhbnk7XG4gIH1cblxuICBlcXVhbHNBc0VkaXRvclBvc3Rpb24ob25lOiBFZGl0b3JQb3NpdGlvbiwgb3RoZXI6IEVkaXRvclBvc2l0aW9uKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIG9uZS5saW5lID09PSBvdGhlci5saW5lICYmIG9uZS5jaCA9PT0gb3RoZXIuY2g7XG4gIH1cblxuICBnZXRBbGlhc2VzKGZpbGU6IFRGaWxlKTogc3RyaW5nW10ge1xuICAgIHJldHVybiAoXG4gICAgICBwYXJzZUZyb250TWF0dGVyQWxpYXNlcyhcbiAgICAgICAgdGhpcy51bnNhZmVBcHAubWV0YWRhdGFDYWNoZS5nZXRGaWxlQ2FjaGUoZmlsZSk/LmZyb250bWF0dGVyXG4gICAgICApID8/IFtdXG4gICAgKTtcbiAgfVxuXG4gIGdldEZyb250TWF0dGVyKGZpbGU6IFRGaWxlKTogeyBba2V5OiBzdHJpbmddOiBGcm9udE1hdHRlclZhbHVlIH0gfCB1bmRlZmluZWQge1xuICAgIGNvbnN0IGZyb250TWF0dGVyID1cbiAgICAgIHRoaXMudW5zYWZlQXBwLm1ldGFkYXRhQ2FjaGUuZ2V0RmlsZUNhY2hlKGZpbGUpPy5mcm9udG1hdHRlcjtcbiAgICBpZiAoIWZyb250TWF0dGVyKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIC8vIHJlbW92ZSAjXG4gICAgY29uc3QgdGFncyA9XG4gICAgICBwYXJzZUZyb250TWF0dGVyVGFncyhmcm9udE1hdHRlcik/Lm1hcCgoeCkgPT4geC5zbGljZSgxKSkgPz8gW107XG4gICAgY29uc3QgYWxpYXNlcyA9IHBhcnNlRnJvbnRNYXR0ZXJBbGlhc2VzKGZyb250TWF0dGVyKSA/PyBbXTtcbiAgICBjb25zdCB7IHBvc2l0aW9uLCAuLi5yZXN0IH0gPSBmcm9udE1hdHRlcjtcbiAgICByZXR1cm4ge1xuICAgICAgLi4uT2JqZWN0LmZyb21FbnRyaWVzKFxuICAgICAgICBPYmplY3QuZW50cmllcyhyZXN0KS5tYXAoKFtrLCBfdl0pID0+IFtcbiAgICAgICAgICBrLFxuICAgICAgICAgIHBhcnNlRnJvbnRNYXR0ZXJTdHJpbmdBcnJheShmcm9udE1hdHRlciwgayksXG4gICAgICAgIF0pXG4gICAgICApLFxuICAgICAgdGFncyxcbiAgICAgIHRhZzogdGFncyxcbiAgICAgIGFsaWFzZXMsXG4gICAgICBhbGlhczogYWxpYXNlcyxcbiAgICB9O1xuICB9XG5cbiAgZ2V0TWFya2Rvd25WaWV3SW5BY3RpdmVMZWFmKCk6IE1hcmtkb3duVmlldyB8IG51bGwge1xuICAgIGlmICghdGhpcy51bnNhZmVBcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoTWFya2Rvd25WaWV3KSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMudW5zYWZlQXBwLndvcmtzcGFjZS5hY3RpdmVMZWFmIS52aWV3IGFzIE1hcmtkb3duVmlldztcbiAgfVxuXG4gIGdldEFjdGl2ZUZpbGUoKTogVEZpbGUgfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy51bnNhZmVBcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKTtcbiAgfVxuXG4gIGdldEN1cnJlbnREaXJuYW1lKCk6IHN0cmluZyB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLmdldEFjdGl2ZUZpbGUoKT8ucGFyZW50LnBhdGggPz8gbnVsbDtcbiAgfVxuXG4gIGdldEN1cnJlbnRFZGl0b3IoKTogRWRpdG9yIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0TWFya2Rvd25WaWV3SW5BY3RpdmVMZWFmKCk/LmVkaXRvciA/PyBudWxsO1xuICB9XG5cbiAgZ2V0U2VsZWN0aW9uKCk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0Q3VycmVudEVkaXRvcigpPy5nZXRTZWxlY3Rpb24oKTtcbiAgfVxuXG4gIGdldEN1cnJlbnRPZmZzZXQoZWRpdG9yOiBFZGl0b3IpOiBudW1iZXIge1xuICAgIHJldHVybiBlZGl0b3IucG9zVG9PZmZzZXQoZWRpdG9yLmdldEN1cnNvcigpKTtcbiAgfVxuXG4gIGdldEN1cnJlbnRMaW5lKGVkaXRvcjogRWRpdG9yKTogc3RyaW5nIHtcbiAgICByZXR1cm4gZWRpdG9yLmdldExpbmUoZWRpdG9yLmdldEN1cnNvcigpLmxpbmUpO1xuICB9XG5cbiAgZ2V0Q3VycmVudExpbmVVbnRpbEN1cnNvcihlZGl0b3I6IEVkaXRvcik6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0Q3VycmVudExpbmUoZWRpdG9yKS5zbGljZSgwLCBlZGl0b3IuZ2V0Q3Vyc29yKCkuY2gpO1xuICB9XG5cbiAgc2VhcmNoUGhhbnRvbUxpbmtzKCk6IHsgcGF0aDogc3RyaW5nOyBsaW5rOiBzdHJpbmcgfVtdIHtcbiAgICByZXR1cm4gT2JqZWN0LmVudHJpZXModGhpcy51bnNhZmVBcHAubWV0YWRhdGFDYWNoZS51bnJlc29sdmVkTGlua3MpLmZsYXRNYXAoXG4gICAgICAoW3BhdGgsIG9ial0pID0+IE9iamVjdC5rZXlzKG9iaikubWFwKChsaW5rKSA9PiAoeyBwYXRoLCBsaW5rIH0pKVxuICAgICk7XG4gIH1cblxuICBnZXRNYXJrZG93bkZpbGVCeVBhdGgocGF0aDogc3RyaW5nKTogVEZpbGUgfCBudWxsIHtcbiAgICBpZiAoIXBhdGguZW5kc1dpdGgoXCIubWRcIikpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGFic3RyYWN0RmlsZSA9IHRoaXMudW5zYWZlQXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChwYXRoKTtcbiAgICBpZiAoIWFic3RyYWN0RmlsZSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIGFic3RyYWN0RmlsZSBhcyBURmlsZTtcbiAgfVxuXG4gIG9wZW5NYXJrZG93bkZpbGUoZmlsZTogVEZpbGUsIG5ld0xlYWY6IGJvb2xlYW4sIG9mZnNldDogbnVtYmVyID0gMCkge1xuICAgIGNvbnN0IGxlYWYgPSB0aGlzLnVuc2FmZUFwcC53b3Jrc3BhY2UuZ2V0TGVhZihuZXdMZWFmKTtcblxuICAgIGxlYWZcbiAgICAgIC5vcGVuRmlsZShmaWxlLCB0aGlzLnVuc2FmZUFwcC53b3Jrc3BhY2UuYWN0aXZlTGVhZj8uZ2V0Vmlld1N0YXRlKCkpXG4gICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgIHRoaXMudW5zYWZlQXBwLndvcmtzcGFjZS5zZXRBY3RpdmVMZWFmKGxlYWYsIHRydWUsIHRydWUpO1xuICAgICAgICBjb25zdCB2aWV3T2ZUeXBlID1cbiAgICAgICAgICB0aGlzLnVuc2FmZUFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlVmlld09mVHlwZShNYXJrZG93blZpZXcpO1xuICAgICAgICBpZiAodmlld09mVHlwZSkge1xuICAgICAgICAgIGNvbnN0IGVkaXRvciA9IHZpZXdPZlR5cGUuZWRpdG9yO1xuICAgICAgICAgIGNvbnN0IHBvcyA9IGVkaXRvci5vZmZzZXRUb1BvcyhvZmZzZXQpO1xuICAgICAgICAgIGVkaXRvci5zZXRDdXJzb3IocG9zKTtcbiAgICAgICAgICBlZGl0b3Iuc2Nyb2xsSW50b1ZpZXcoeyBmcm9tOiBwb3MsIHRvOiBwb3MgfSwgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICB9XG5cbiAgZ2V0Q3VycmVudEZyb250TWF0dGVyKCk6IHN0cmluZyB8IG51bGwge1xuICAgIGNvbnN0IGVkaXRvciA9IHRoaXMuZ2V0Q3VycmVudEVkaXRvcigpO1xuICAgIGlmICghZWRpdG9yKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuZ2V0QWN0aXZlRmlsZSgpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAoZWRpdG9yLmdldExpbmUoMCkgIT09IFwiLS0tXCIpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCBlbmRQb3NpdGlvbiA9IGVkaXRvci5nZXRWYWx1ZSgpLmluZGV4T2YoXCItLS1cIiwgMyk7XG5cbiAgICBjb25zdCBjdXJyZW50T2Zmc2V0ID0gdGhpcy5nZXRDdXJyZW50T2Zmc2V0KGVkaXRvcik7XG4gICAgaWYgKGVuZFBvc2l0aW9uICE9PSAtMSAmJiBjdXJyZW50T2Zmc2V0ID49IGVuZFBvc2l0aW9uKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBrZXlMb2NhdGlvbnMgPSBBcnJheS5mcm9tKGVkaXRvci5nZXRWYWx1ZSgpLm1hdGNoQWxsKC8uKzovZykpO1xuICAgIGlmIChrZXlMb2NhdGlvbnMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBjdXJyZW50S2V5TG9jYXRpb24gPSBrZXlMb2NhdGlvbnNcbiAgICAgIC5maWx0ZXIoKHgpID0+IHguaW5kZXghIDwgY3VycmVudE9mZnNldClcbiAgICAgIC5sYXN0KCk7XG4gICAgaWYgKCFjdXJyZW50S2V5TG9jYXRpb24pIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiBjdXJyZW50S2V5TG9jYXRpb25bMF0uc3BsaXQoXCI6XCIpWzBdO1xuICB9XG5cbiAgLyoqXG4gICAqIFVuc2FmZSBtZXRob2RcbiAgICovXG4gIGlzSU1FT24oKTogYm9vbGVhbiB7XG4gICAgaWYgKCF0aGlzLnVuc2FmZUFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlVmlld09mVHlwZShNYXJrZG93blZpZXcpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgbWFya2Rvd25WaWV3ID0gdGhpcy51bnNhZmVBcHAud29ya3NwYWNlLmFjdGl2ZUxlYWYhXG4gICAgICAudmlldyBhcyBNYXJrZG93blZpZXc7XG4gICAgY29uc3QgY201b3I2OiBhbnkgPSAobWFya2Rvd25WaWV3LmVkaXRvciBhcyBhbnkpLmNtO1xuXG4gICAgLy8gY202XG4gICAgaWYgKGNtNW9yNj8uaW5wdXRTdGF0ZT8uY29tcG9zaW5nID4gMCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgLy8gY201XG4gICAgcmV0dXJuICEhY201b3I2Py5kaXNwbGF5Py5pbnB1dD8uY29tcG9zaW5nO1xuICB9XG5cbiAgYXN5bmMgd3JpdGVMb2cobG9nOiBzdHJpbmcpIHtcbiAgICBhd2FpdCB0aGlzLnVuc2FmZUFwcC52YXVsdC5hZGFwdGVyLmFwcGVuZChub3JtYWxpemVQYXRoKFwibG9nLm1kXCIpLCBsb2cpO1xuICB9XG59XG4iLCJleHBvcnQgY29uc3Qga2V5QnkgPSA8VD4oXG4gIHZhbHVlczogVFtdLFxuICB0b0tleTogKHQ6IFQpID0+IHN0cmluZ1xuKTogeyBba2V5OiBzdHJpbmddOiBUIH0gPT5cbiAgdmFsdWVzLnJlZHVjZShcbiAgICAocHJldiwgY3VyLCBfMSwgXzIsIGsgPSB0b0tleShjdXIpKSA9PiAoKHByZXZba10gPSBjdXIpLCBwcmV2KSxcbiAgICB7fSBhcyB7IFtrZXk6IHN0cmluZ106IFQgfVxuICApO1xuXG5leHBvcnQgY29uc3QgZ3JvdXBCeSA9IDxUPihcbiAgdmFsdWVzOiBUW10sXG4gIHRvS2V5OiAodDogVCkgPT4gc3RyaW5nXG4pOiB7IFtrZXk6IHN0cmluZ106IFRbXSB9ID0+XG4gIHZhbHVlcy5yZWR1Y2UoXG4gICAgKHByZXYsIGN1ciwgXzEsIF8yLCBrID0gdG9LZXkoY3VyKSkgPT4gKFxuICAgICAgKHByZXZba10gfHwgKHByZXZba10gPSBbXSkpLnB1c2goY3VyKSwgcHJldlxuICAgICksXG4gICAge30gYXMgeyBba2V5OiBzdHJpbmddOiBUW10gfVxuICApO1xuXG5leHBvcnQgZnVuY3Rpb24gdW5pcTxUPih2YWx1ZXM6IFRbXSk6IFRbXSB7XG4gIHJldHVybiBbLi4ubmV3IFNldCh2YWx1ZXMpXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVuaXFXaXRoPFQ+KGFycjogVFtdLCBmbjogKG9uZTogVCwgb3RoZXI6IFQpID0+IGJvb2xlYW4pIHtcbiAgcmV0dXJuIGFyci5maWx0ZXIoXG4gICAgKGVsZW1lbnQsIGluZGV4KSA9PiBhcnIuZmluZEluZGV4KChzdGVwKSA9PiBmbihlbGVtZW50LCBzdGVwKSkgPT09IGluZGV4XG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhcnJheUVxdWFscyhcbiAgYXJyMTogdW5rbm93bltdLFxuICBhcnIyOiB1bmtub3duW10sXG4gIGxlbmd0aD86IG51bWJlclxuKTogYm9vbGVhbiB7XG4gIGxldCBsID0gTWF0aC5tYXgoYXJyMS5sZW5ndGgsIGFycjIubGVuZ3RoKTtcbiAgaWYgKGxlbmd0aCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgbCA9IE1hdGgubWluKGwsIGxlbmd0aCk7XG4gIH1cblxuICBmb3IgKGxldCBpID0gMDsgaSA8IGw7IGkrKykge1xuICAgIGlmIChhcnIxW2ldICE9PSBhcnIyW2ldKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhcnJheUVxdWFsc1VudGlsKGFycjE6IHVua25vd25bXSwgYXJyMjogdW5rbm93bltdKTogbnVtYmVyIHtcbiAgbGV0IGwgPSBNYXRoLm1pbihhcnIxLmxlbmd0aCwgYXJyMi5sZW5ndGgpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGw7IGkrKykge1xuICAgIGlmIChhcnIxW2ldICE9PSBhcnIyW2ldKSB7XG4gICAgICByZXR1cm4gaSAtIDE7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGwgLSAxO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWlycm9yTWFwPFQ+KFxuICBjb2xsZWN0aW9uOiBUW10sXG4gIHRvVmFsdWU6ICh0OiBUKSA9PiBzdHJpbmdcbik6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0ge1xuICByZXR1cm4gY29sbGVjdGlvbi5yZWR1Y2UoKHAsIGMpID0+ICh7IC4uLnAsIFt0b1ZhbHVlKGMpXTogdG9WYWx1ZShjKSB9KSwge30pO1xufVxuIiwiZXhwb3J0IHR5cGUgV29yZFR5cGUgPVxuICB8IFwiY3VycmVudEZpbGVcIlxuICB8IFwiY3VycmVudFZhdWx0XCJcbiAgfCBcImN1c3RvbURpY3Rpb25hcnlcIlxuICB8IFwiaW50ZXJuYWxMaW5rXCJcbiAgfCBcImZyb250TWF0dGVyXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgRGVmYXVsdFdvcmQge1xuICB2YWx1ZTogc3RyaW5nO1xuICBkZXNjcmlwdGlvbj86IHN0cmluZztcbiAgYWxpYXNlcz86IHN0cmluZ1tdO1xuICB0eXBlOiBXb3JkVHlwZTtcbiAgY3JlYXRlZFBhdGg6IHN0cmluZztcbiAgLy8gQWRkIGFmdGVyIGp1ZGdlXG4gIG9mZnNldD86IG51bWJlcjtcbiAgaGl0Pzogc3RyaW5nO1xufVxuZXhwb3J0IGludGVyZmFjZSBDdXJyZW50RmlsZVdvcmQgZXh0ZW5kcyBEZWZhdWx0V29yZCB7XG4gIHR5cGU6IFwiY3VycmVudEZpbGVcIjtcbn1cbmV4cG9ydCBpbnRlcmZhY2UgQ3VycmVudFZhdWx0V29yZCBleHRlbmRzIERlZmF1bHRXb3JkIHtcbiAgdHlwZTogXCJjdXJyZW50VmF1bHRcIjtcbn1cbmV4cG9ydCBpbnRlcmZhY2UgQ3VzdG9tRGljdGlvbmFyeVdvcmQgZXh0ZW5kcyBEZWZhdWx0V29yZCB7XG4gIHR5cGU6IFwiY3VzdG9tRGljdGlvbmFyeVwiO1xufVxuZXhwb3J0IGludGVyZmFjZSBJbnRlcm5hbExpbmtXb3JkIGV4dGVuZHMgRGVmYXVsdFdvcmQge1xuICB0eXBlOiBcImludGVybmFsTGlua1wiO1xuICBwaGFudG9tPzogYm9vbGVhbjtcbiAgYWxpYXNNZXRhPzoge1xuICAgIG9yaWdpbjogc3RyaW5nO1xuICB9O1xufVxuZXhwb3J0IGludGVyZmFjZSBGcm9udE1hdHRlcldvcmQgZXh0ZW5kcyBEZWZhdWx0V29yZCB7XG4gIHR5cGU6IFwiZnJvbnRNYXR0ZXJcIjtcbiAga2V5OiBzdHJpbmc7XG59XG5cbmV4cG9ydCB0eXBlIFdvcmQgPVxuICB8IEN1cnJlbnRGaWxlV29yZFxuICB8IEN1cnJlbnRWYXVsdFdvcmRcbiAgfCBDdXN0b21EaWN0aW9uYXJ5V29yZFxuICB8IEludGVybmFsTGlua1dvcmRcbiAgfCBGcm9udE1hdHRlcldvcmQ7XG5cbmV4cG9ydCBjbGFzcyBXb3JkVHlwZU1ldGEge1xuICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBfdmFsdWVzOiBXb3JkVHlwZU1ldGFbXSA9IFtdO1xuICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBfZGljdDogeyBbdHlwZTogc3RyaW5nXTogV29yZFR5cGVNZXRhIH0gPSB7fTtcblxuICBzdGF0aWMgcmVhZG9ubHkgRlJPTlRfTUFUVEVSID0gbmV3IFdvcmRUeXBlTWV0YShcbiAgICBcImZyb250TWF0dGVyXCIsXG4gICAgMTAwLFxuICAgIFwiZnJvbnRNYXR0ZXJcIlxuICApO1xuICBzdGF0aWMgcmVhZG9ubHkgSU5URVJOQUxfTElOSyA9IG5ldyBXb3JkVHlwZU1ldGEoXG4gICAgXCJpbnRlcm5hbExpbmtcIixcbiAgICA5MCxcbiAgICBcImludGVybmFsTGlua1wiXG4gICk7XG4gIHN0YXRpYyByZWFkb25seSBDVVNUT01fRElDVElPTkFSWSA9IG5ldyBXb3JkVHlwZU1ldGEoXG4gICAgXCJjdXN0b21EaWN0aW9uYXJ5XCIsXG4gICAgODAsXG4gICAgXCJzdWdnZXN0aW9uXCJcbiAgKTtcbiAgc3RhdGljIHJlYWRvbmx5IENVUlJFTlRfRklMRSA9IG5ldyBXb3JkVHlwZU1ldGEoXG4gICAgXCJjdXJyZW50RmlsZVwiLFxuICAgIDcwLFxuICAgIFwic3VnZ2VzdGlvblwiXG4gICk7XG4gIHN0YXRpYyByZWFkb25seSBDVVJSRU5UX1ZBVUxUID0gbmV3IFdvcmRUeXBlTWV0YShcbiAgICBcImN1cnJlbnRWYXVsdFwiLFxuICAgIDYwLFxuICAgIFwic3VnZ2VzdGlvblwiXG4gICk7XG5cbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcihcbiAgICByZWFkb25seSB0eXBlOiBXb3JkVHlwZSxcbiAgICByZWFkb25seSBwcmlvcml0eTogbnVtYmVyLFxuICAgIHJlYWRvbmx5IGdyb3VwOiBzdHJpbmdcbiAgKSB7XG4gICAgV29yZFR5cGVNZXRhLl92YWx1ZXMucHVzaCh0aGlzKTtcbiAgICBXb3JkVHlwZU1ldGEuX2RpY3RbdHlwZV0gPSB0aGlzO1xuICB9XG5cbiAgc3RhdGljIG9mKHR5cGU6IFdvcmRUeXBlKTogV29yZFR5cGVNZXRhIHtcbiAgICByZXR1cm4gV29yZFR5cGVNZXRhLl9kaWN0W3R5cGVdO1xuICB9XG5cbiAgc3RhdGljIHZhbHVlcygpOiBXb3JkVHlwZU1ldGFbXSB7XG4gICAgcmV0dXJuIFdvcmRUeXBlTWV0YS5fdmFsdWVzO1xuICB9XG59XG4iLCJpbXBvcnQge1xuICBjYXBpdGFsaXplRmlyc3RMZXR0ZXIsXG4gIGxvd2VySW5jbHVkZXMsXG4gIGxvd2VyU3RhcnRzV2l0aCxcbn0gZnJvbSBcIi4uL3V0aWwvc3RyaW5nc1wiO1xuaW1wb3J0IHR5cGUgeyBJbmRleGVkV29yZHMgfSBmcm9tIFwiLi4vdWkvQXV0b0NvbXBsZXRlU3VnZ2VzdFwiO1xuaW1wb3J0IHsgdW5pcVdpdGggfSBmcm9tIFwiLi4vdXRpbC9jb2xsZWN0aW9uLWhlbHBlclwiO1xuaW1wb3J0IHsgdHlwZSBXb3JkLCBXb3JkVHlwZU1ldGEgfSBmcm9tIFwiLi4vbW9kZWwvV29yZFwiO1xuaW1wb3J0IHR5cGUge1xuICBIaXRXb3JkLFxuICBTZWxlY3Rpb25IaXN0b3J5U3RvcmFnZSxcbn0gZnJvbSBcIi4uL3N0b3JhZ2UvU2VsZWN0aW9uSGlzdG9yeVN0b3JhZ2VcIjtcblxuZXhwb3J0IHR5cGUgV29yZHNCeUZpcnN0TGV0dGVyID0geyBbZmlyc3RMZXR0ZXI6IHN0cmluZ106IFdvcmRbXSB9O1xuXG5pbnRlcmZhY2UgSnVkZ2VtZW50IHtcbiAgd29yZDogV29yZDtcbiAgLy8gVE9ETzogcmVtb3ZlIHZhbHVlLiB1c2Ugd29yZC5oaXQgaW5zdGVhZFxuICB2YWx1ZT86IHN0cmluZztcbiAgYWxpYXM6IGJvb2xlYW47XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwdXNoV29yZChcbiAgd29yZHNCeUZpcnN0TGV0dGVyOiBXb3Jkc0J5Rmlyc3RMZXR0ZXIsXG4gIGtleTogc3RyaW5nLFxuICB3b3JkOiBXb3JkXG4pIHtcbiAgaWYgKHdvcmRzQnlGaXJzdExldHRlcltrZXldID09PSB1bmRlZmluZWQpIHtcbiAgICB3b3Jkc0J5Rmlyc3RMZXR0ZXJba2V5XSA9IFt3b3JkXTtcbiAgICByZXR1cm47XG4gIH1cblxuICB3b3Jkc0J5Rmlyc3RMZXR0ZXJba2V5XS5wdXNoKHdvcmQpO1xufVxuXG4vLyBQdWJsaWMgZm9yIHRlc3RzXG5leHBvcnQgZnVuY3Rpb24ganVkZ2UoXG4gIHdvcmQ6IFdvcmQsXG4gIHF1ZXJ5OiBzdHJpbmcsXG4gIHF1ZXJ5U3RhcnRXaXRoVXBwZXI6IGJvb2xlYW5cbik6IEp1ZGdlbWVudCB7XG4gIGlmIChxdWVyeSA9PT0gXCJcIikge1xuICAgIHJldHVybiB7XG4gICAgICB3b3JkOiB7XG4gICAgICAgIC4uLndvcmQsXG4gICAgICAgIGhpdDogd29yZC52YWx1ZSxcbiAgICAgIH0sXG4gICAgICB2YWx1ZTogd29yZC52YWx1ZSxcbiAgICAgIGFsaWFzOiBmYWxzZSxcbiAgICB9O1xuICB9XG5cbiAgaWYgKGxvd2VyU3RhcnRzV2l0aCh3b3JkLnZhbHVlLCBxdWVyeSkpIHtcbiAgICBpZiAoXG4gICAgICBxdWVyeVN0YXJ0V2l0aFVwcGVyICYmXG4gICAgICB3b3JkLnR5cGUgIT09IFwiaW50ZXJuYWxMaW5rXCIgJiZcbiAgICAgIHdvcmQudHlwZSAhPT0gXCJmcm9udE1hdHRlclwiXG4gICAgKSB7XG4gICAgICBjb25zdCBjID0gY2FwaXRhbGl6ZUZpcnN0TGV0dGVyKHdvcmQudmFsdWUpO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgd29yZDoge1xuICAgICAgICAgIC4uLndvcmQsXG4gICAgICAgICAgdmFsdWU6IGMsXG4gICAgICAgICAgaGl0OiBjLFxuICAgICAgICB9LFxuICAgICAgICB2YWx1ZTogYyxcbiAgICAgICAgYWxpYXM6IGZhbHNlLFxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgd29yZDoge1xuICAgICAgICAgIC4uLndvcmQsXG4gICAgICAgICAgaGl0OiB3b3JkLnZhbHVlLFxuICAgICAgICB9LFxuICAgICAgICB2YWx1ZTogd29yZC52YWx1ZSxcbiAgICAgICAgYWxpYXM6IGZhbHNlLFxuICAgICAgfTtcbiAgICB9XG4gIH1cbiAgY29uc3QgbWF0Y2hlZEFsaWFzID0gd29yZC5hbGlhc2VzPy5maW5kKChhKSA9PiBsb3dlclN0YXJ0c1dpdGgoYSwgcXVlcnkpKTtcbiAgaWYgKG1hdGNoZWRBbGlhcykge1xuICAgIHJldHVybiB7XG4gICAgICB3b3JkOiB7XG4gICAgICAgIC4uLndvcmQsXG4gICAgICAgIGhpdDogbWF0Y2hlZEFsaWFzLFxuICAgICAgfSxcbiAgICAgIHZhbHVlOiBtYXRjaGVkQWxpYXMsXG4gICAgICBhbGlhczogdHJ1ZSxcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICB3b3JkLFxuICAgIGFsaWFzOiBmYWxzZSxcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN1Z2dlc3RXb3JkcyhcbiAgaW5kZXhlZFdvcmRzOiBJbmRleGVkV29yZHMsXG4gIHF1ZXJ5OiBzdHJpbmcsXG4gIG1heDogbnVtYmVyLFxuICBmcm9udE1hdHRlcjogc3RyaW5nIHwgbnVsbCxcbiAgc2VsZWN0aW9uSGlzdG9yeVN0b3JhZ2U/OiBTZWxlY3Rpb25IaXN0b3J5U3RvcmFnZVxuKTogV29yZFtdIHtcbiAgY29uc3QgcXVlcnlTdGFydFdpdGhVcHBlciA9IGNhcGl0YWxpemVGaXJzdExldHRlcihxdWVyeSkgPT09IHF1ZXJ5O1xuXG4gIGNvbnN0IGZsYXR0ZW5Gcm9udE1hdHRlcldvcmRzID0gKCkgPT4ge1xuICAgIGlmIChmcm9udE1hdHRlciA9PT0gXCJhbGlhc1wiIHx8IGZyb250TWF0dGVyID09PSBcImFsaWFzZXNcIikge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICBpZiAoZnJvbnRNYXR0ZXIgJiYgaW5kZXhlZFdvcmRzLmZyb250TWF0dGVyPy5bZnJvbnRNYXR0ZXJdKSB7XG4gICAgICByZXR1cm4gT2JqZWN0LnZhbHVlcyhpbmRleGVkV29yZHMuZnJvbnRNYXR0ZXI/Lltmcm9udE1hdHRlcl0pLmZsYXQoKTtcbiAgICB9XG4gICAgcmV0dXJuIFtdO1xuICB9O1xuXG4gIGNvbnN0IHdvcmRzID0gcXVlcnlTdGFydFdpdGhVcHBlclxuICAgID8gZnJvbnRNYXR0ZXJcbiAgICAgID8gZmxhdHRlbkZyb250TWF0dGVyV29yZHMoKVxuICAgICAgOiBbXG4gICAgICAgICAgLi4uKGluZGV4ZWRXb3Jkcy5jdXJyZW50RmlsZVtxdWVyeS5jaGFyQXQoMCldID8/IFtdKSxcbiAgICAgICAgICAuLi4oaW5kZXhlZFdvcmRzLmN1cnJlbnRGaWxlW3F1ZXJ5LmNoYXJBdCgwKS50b0xvd2VyQ2FzZSgpXSA/PyBbXSksXG4gICAgICAgICAgLi4uKGluZGV4ZWRXb3Jkcy5jdXJyZW50VmF1bHRbcXVlcnkuY2hhckF0KDApXSA/PyBbXSksXG4gICAgICAgICAgLi4uKGluZGV4ZWRXb3Jkcy5jdXJyZW50VmF1bHRbcXVlcnkuY2hhckF0KDApLnRvTG93ZXJDYXNlKCldID8/IFtdKSxcbiAgICAgICAgICAuLi4oaW5kZXhlZFdvcmRzLmN1c3RvbURpY3Rpb25hcnlbcXVlcnkuY2hhckF0KDApXSA/PyBbXSksXG4gICAgICAgICAgLi4uKGluZGV4ZWRXb3Jkcy5jdXN0b21EaWN0aW9uYXJ5W3F1ZXJ5LmNoYXJBdCgwKS50b0xvd2VyQ2FzZSgpXSA/P1xuICAgICAgICAgICAgW10pLFxuICAgICAgICAgIC4uLihpbmRleGVkV29yZHMuaW50ZXJuYWxMaW5rW3F1ZXJ5LmNoYXJBdCgwKV0gPz8gW10pLFxuICAgICAgICAgIC4uLihpbmRleGVkV29yZHMuaW50ZXJuYWxMaW5rW3F1ZXJ5LmNoYXJBdCgwKS50b0xvd2VyQ2FzZSgpXSA/PyBbXSksXG4gICAgICAgIF1cbiAgICA6IGZyb250TWF0dGVyXG4gICAgPyBmbGF0dGVuRnJvbnRNYXR0ZXJXb3JkcygpXG4gICAgOiBbXG4gICAgICAgIC4uLihpbmRleGVkV29yZHMuY3VycmVudEZpbGVbcXVlcnkuY2hhckF0KDApXSA/PyBbXSksXG4gICAgICAgIC4uLihpbmRleGVkV29yZHMuY3VycmVudFZhdWx0W3F1ZXJ5LmNoYXJBdCgwKV0gPz8gW10pLFxuICAgICAgICAuLi4oaW5kZXhlZFdvcmRzLmN1c3RvbURpY3Rpb25hcnlbcXVlcnkuY2hhckF0KDApXSA/PyBbXSksXG4gICAgICAgIC4uLihpbmRleGVkV29yZHMuaW50ZXJuYWxMaW5rW3F1ZXJ5LmNoYXJBdCgwKV0gPz8gW10pLFxuICAgICAgICAuLi4oaW5kZXhlZFdvcmRzLmludGVybmFsTGlua1txdWVyeS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKV0gPz8gW10pLFxuICAgICAgXTtcblxuICBjb25zdCBjYW5kaWRhdGUgPSBBcnJheS5mcm9tKHdvcmRzKVxuICAgIC5tYXAoKHgpID0+IGp1ZGdlKHgsIHF1ZXJ5LCBxdWVyeVN0YXJ0V2l0aFVwcGVyKSlcbiAgICAuZmlsdGVyKCh4KSA9PiB4LnZhbHVlICE9PSB1bmRlZmluZWQpXG4gICAgLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgIGNvbnN0IGFXb3JkID0gYS53b3JkIGFzIEhpdFdvcmQ7XG4gICAgICBjb25zdCBiV29yZCA9IGIud29yZCBhcyBIaXRXb3JkO1xuXG4gICAgICBjb25zdCBub3RTYW1lV29yZFR5cGUgPSBhV29yZC50eXBlICE9PSBiV29yZC50eXBlO1xuICAgICAgaWYgKGZyb250TWF0dGVyICYmIG5vdFNhbWVXb3JkVHlwZSkge1xuICAgICAgICByZXR1cm4gYldvcmQudHlwZSA9PT0gXCJmcm9udE1hdHRlclwiID8gMSA6IC0xO1xuICAgICAgfVxuXG4gICAgICBpZiAoc2VsZWN0aW9uSGlzdG9yeVN0b3JhZ2UpIHtcbiAgICAgICAgY29uc3QgcmV0ID0gc2VsZWN0aW9uSGlzdG9yeVN0b3JhZ2UuY29tcGFyZShcbiAgICAgICAgICBhV29yZCBhcyBIaXRXb3JkLFxuICAgICAgICAgIGJXb3JkIGFzIEhpdFdvcmRcbiAgICAgICAgKTtcbiAgICAgICAgaWYgKHJldCAhPT0gMCkge1xuICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGEudmFsdWUhLmxlbmd0aCAhPT0gYi52YWx1ZSEubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBhLnZhbHVlIS5sZW5ndGggPiBiLnZhbHVlIS5sZW5ndGggPyAxIDogLTE7XG4gICAgICB9XG4gICAgICBpZiAobm90U2FtZVdvcmRUeXBlKSB7XG4gICAgICAgIHJldHVybiBXb3JkVHlwZU1ldGEub2YoYldvcmQudHlwZSkucHJpb3JpdHkgPlxuICAgICAgICAgIFdvcmRUeXBlTWV0YS5vZihhV29yZC50eXBlKS5wcmlvcml0eVxuICAgICAgICAgID8gMVxuICAgICAgICAgIDogLTE7XG4gICAgICB9XG4gICAgICBpZiAoYS5hbGlhcyAhPT0gYi5hbGlhcykge1xuICAgICAgICByZXR1cm4gYS5hbGlhcyA/IDEgOiAtMTtcbiAgICAgIH1cbiAgICAgIHJldHVybiAwO1xuICAgIH0pXG4gICAgLm1hcCgoeCkgPT4geC53b3JkKVxuICAgIC5zbGljZSgwLCBtYXgpO1xuXG4gIC8vIFhYWDogVGhlcmUgaXMgbm8gZ3VhcmFudGVlIHRoYXQgZXF1YWxzIHdpdGggbWF4LCBidXQgaXQgaXMgaW1wb3J0YW50IGZvciBwZXJmb3JtYW5jZVxuICByZXR1cm4gdW5pcVdpdGgoXG4gICAgY2FuZGlkYXRlLFxuICAgIChhLCBiKSA9PlxuICAgICAgYS52YWx1ZSA9PT0gYi52YWx1ZSAmJlxuICAgICAgV29yZFR5cGVNZXRhLm9mKGEudHlwZSkuZ3JvdXAgPT09IFdvcmRUeXBlTWV0YS5vZihiLnR5cGUpLmdyb3VwXG4gICk7XG59XG5cbi8vIFRPRE86IHJlZmFjdG9yaW5nXG4vLyBQdWJsaWMgZm9yIHRlc3RzXG5leHBvcnQgZnVuY3Rpb24ganVkZ2VCeVBhcnRpYWxNYXRjaChcbiAgd29yZDogV29yZCxcbiAgcXVlcnk6IHN0cmluZyxcbiAgcXVlcnlTdGFydFdpdGhVcHBlcjogYm9vbGVhblxuKTogSnVkZ2VtZW50IHtcbiAgaWYgKHF1ZXJ5ID09PSBcIlwiKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHdvcmQ6IHsgLi4ud29yZCwgaGl0OiB3b3JkLnZhbHVlIH0sXG4gICAgICB2YWx1ZTogd29yZC52YWx1ZSxcbiAgICAgIGFsaWFzOiBmYWxzZSxcbiAgICB9O1xuICB9XG5cbiAgaWYgKGxvd2VyU3RhcnRzV2l0aCh3b3JkLnZhbHVlLCBxdWVyeSkpIHtcbiAgICBpZiAoXG4gICAgICBxdWVyeVN0YXJ0V2l0aFVwcGVyICYmXG4gICAgICB3b3JkLnR5cGUgIT09IFwiaW50ZXJuYWxMaW5rXCIgJiZcbiAgICAgIHdvcmQudHlwZSAhPT0gXCJmcm9udE1hdHRlclwiXG4gICAgKSB7XG4gICAgICBjb25zdCBjID0gY2FwaXRhbGl6ZUZpcnN0TGV0dGVyKHdvcmQudmFsdWUpO1xuICAgICAgcmV0dXJuIHsgd29yZDogeyAuLi53b3JkLCB2YWx1ZTogYywgaGl0OiBjIH0sIHZhbHVlOiBjLCBhbGlhczogZmFsc2UgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgd29yZDogeyAuLi53b3JkLCBoaXQ6IHdvcmQudmFsdWUgfSxcbiAgICAgICAgdmFsdWU6IHdvcmQudmFsdWUsXG4gICAgICAgIGFsaWFzOiBmYWxzZSxcbiAgICAgIH07XG4gICAgfVxuICB9XG5cbiAgY29uc3QgbWF0Y2hlZEFsaWFzU3RhcnRzID0gd29yZC5hbGlhc2VzPy5maW5kKChhKSA9PlxuICAgIGxvd2VyU3RhcnRzV2l0aChhLCBxdWVyeSlcbiAgKTtcbiAgaWYgKG1hdGNoZWRBbGlhc1N0YXJ0cykge1xuICAgIHJldHVybiB7XG4gICAgICB3b3JkOiB7IC4uLndvcmQsIGhpdDogbWF0Y2hlZEFsaWFzU3RhcnRzIH0sXG4gICAgICB2YWx1ZTogbWF0Y2hlZEFsaWFzU3RhcnRzLFxuICAgICAgYWxpYXM6IHRydWUsXG4gICAgfTtcbiAgfVxuXG4gIGlmIChsb3dlckluY2x1ZGVzKHdvcmQudmFsdWUsIHF1ZXJ5KSkge1xuICAgIHJldHVybiB7XG4gICAgICB3b3JkOiB7IC4uLndvcmQsIGhpdDogd29yZC52YWx1ZSB9LFxuICAgICAgdmFsdWU6IHdvcmQudmFsdWUsXG4gICAgICBhbGlhczogZmFsc2UsXG4gICAgfTtcbiAgfVxuXG4gIGNvbnN0IG1hdGNoZWRBbGlhc0luY2x1ZGVkID0gd29yZC5hbGlhc2VzPy5maW5kKChhKSA9PlxuICAgIGxvd2VySW5jbHVkZXMoYSwgcXVlcnkpXG4gICk7XG4gIGlmIChtYXRjaGVkQWxpYXNJbmNsdWRlZCkge1xuICAgIHJldHVybiB7XG4gICAgICB3b3JkOiB7IC4uLndvcmQsIGhpdDogbWF0Y2hlZEFsaWFzSW5jbHVkZWQgfSxcbiAgICAgIHZhbHVlOiBtYXRjaGVkQWxpYXNJbmNsdWRlZCxcbiAgICAgIGFsaWFzOiB0cnVlLFxuICAgIH07XG4gIH1cblxuICByZXR1cm4geyB3b3JkOiB3b3JkLCBhbGlhczogZmFsc2UgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN1Z2dlc3RXb3Jkc0J5UGFydGlhbE1hdGNoKFxuICBpbmRleGVkV29yZHM6IEluZGV4ZWRXb3JkcyxcbiAgcXVlcnk6IHN0cmluZyxcbiAgbWF4OiBudW1iZXIsXG4gIGZyb250TWF0dGVyOiBzdHJpbmcgfCBudWxsLFxuICBzZWxlY3Rpb25IaXN0b3J5U3RvcmFnZT86IFNlbGVjdGlvbkhpc3RvcnlTdG9yYWdlXG4pOiBXb3JkW10ge1xuICBjb25zdCBxdWVyeVN0YXJ0V2l0aFVwcGVyID0gY2FwaXRhbGl6ZUZpcnN0TGV0dGVyKHF1ZXJ5KSA9PT0gcXVlcnk7XG5cbiAgY29uc3QgZmxhdE9iamVjdFZhbHVlcyA9IChvYmplY3Q6IHsgW2ZpcnN0TGV0dGVyOiBzdHJpbmddOiBXb3JkW10gfSkgPT5cbiAgICBPYmplY3QudmFsdWVzKG9iamVjdCkuZmxhdCgpO1xuXG4gIGNvbnN0IGZsYXR0ZW5Gcm9udE1hdHRlcldvcmRzID0gKCkgPT4ge1xuICAgIGlmIChmcm9udE1hdHRlciA9PT0gXCJhbGlhc1wiIHx8IGZyb250TWF0dGVyID09PSBcImFsaWFzZXNcIikge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICBpZiAoZnJvbnRNYXR0ZXIgJiYgaW5kZXhlZFdvcmRzLmZyb250TWF0dGVyPy5bZnJvbnRNYXR0ZXJdKSB7XG4gICAgICByZXR1cm4gT2JqZWN0LnZhbHVlcyhpbmRleGVkV29yZHMuZnJvbnRNYXR0ZXI/Lltmcm9udE1hdHRlcl0pLmZsYXQoKTtcbiAgICB9XG4gICAgcmV0dXJuIFtdO1xuICB9O1xuXG4gIGNvbnN0IHdvcmRzID0gZnJvbnRNYXR0ZXJcbiAgICA/IGZsYXR0ZW5Gcm9udE1hdHRlcldvcmRzKClcbiAgICA6IFtcbiAgICAgICAgLi4uZmxhdE9iamVjdFZhbHVlcyhpbmRleGVkV29yZHMuY3VycmVudEZpbGUpLFxuICAgICAgICAuLi5mbGF0T2JqZWN0VmFsdWVzKGluZGV4ZWRXb3Jkcy5jdXJyZW50VmF1bHQpLFxuICAgICAgICAuLi5mbGF0T2JqZWN0VmFsdWVzKGluZGV4ZWRXb3Jkcy5jdXN0b21EaWN0aW9uYXJ5KSxcbiAgICAgICAgLi4uZmxhdE9iamVjdFZhbHVlcyhpbmRleGVkV29yZHMuaW50ZXJuYWxMaW5rKSxcbiAgICAgIF07XG5cbiAgY29uc3QgY2FuZGlkYXRlID0gQXJyYXkuZnJvbSh3b3JkcylcbiAgICAubWFwKCh4KSA9PiBqdWRnZUJ5UGFydGlhbE1hdGNoKHgsIHF1ZXJ5LCBxdWVyeVN0YXJ0V2l0aFVwcGVyKSlcbiAgICAuZmlsdGVyKCh4KSA9PiB4LnZhbHVlICE9PSB1bmRlZmluZWQpXG4gICAgLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgIGNvbnN0IGFXb3JkID0gYS53b3JkIGFzIEhpdFdvcmQ7XG4gICAgICBjb25zdCBiV29yZCA9IGIud29yZCBhcyBIaXRXb3JkO1xuXG4gICAgICBjb25zdCBub3RTYW1lV29yZFR5cGUgPSBhV29yZC50eXBlICE9PSBiV29yZC50eXBlO1xuICAgICAgaWYgKGZyb250TWF0dGVyICYmIG5vdFNhbWVXb3JkVHlwZSkge1xuICAgICAgICByZXR1cm4gYldvcmQudHlwZSA9PT0gXCJmcm9udE1hdHRlclwiID8gMSA6IC0xO1xuICAgICAgfVxuXG4gICAgICBpZiAoc2VsZWN0aW9uSGlzdG9yeVN0b3JhZ2UpIHtcbiAgICAgICAgY29uc3QgcmV0ID0gc2VsZWN0aW9uSGlzdG9yeVN0b3JhZ2UuY29tcGFyZShcbiAgICAgICAgICBhV29yZCBhcyBIaXRXb3JkLFxuICAgICAgICAgIGJXb3JkIGFzIEhpdFdvcmRcbiAgICAgICAgKTtcbiAgICAgICAgaWYgKHJldCAhPT0gMCkge1xuICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29uc3QgYXMgPSBsb3dlclN0YXJ0c1dpdGgoYS52YWx1ZSEsIHF1ZXJ5KTtcbiAgICAgIGNvbnN0IGJzID0gbG93ZXJTdGFydHNXaXRoKGIudmFsdWUhLCBxdWVyeSk7XG4gICAgICBpZiAoYXMgIT09IGJzKSB7XG4gICAgICAgIHJldHVybiBicyA/IDEgOiAtMTtcbiAgICAgIH1cblxuICAgICAgaWYgKGEudmFsdWUhLmxlbmd0aCAhPT0gYi52YWx1ZSEubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBhLnZhbHVlIS5sZW5ndGggPiBiLnZhbHVlIS5sZW5ndGggPyAxIDogLTE7XG4gICAgICB9XG4gICAgICBpZiAobm90U2FtZVdvcmRUeXBlKSB7XG4gICAgICAgIHJldHVybiBXb3JkVHlwZU1ldGEub2YoYldvcmQudHlwZSkucHJpb3JpdHkgPlxuICAgICAgICAgIFdvcmRUeXBlTWV0YS5vZihhV29yZC50eXBlKS5wcmlvcml0eVxuICAgICAgICAgID8gMVxuICAgICAgICAgIDogLTE7XG4gICAgICB9XG4gICAgICBpZiAoYS5hbGlhcyAhPT0gYi5hbGlhcykge1xuICAgICAgICByZXR1cm4gYS5hbGlhcyA/IDEgOiAtMTtcbiAgICAgIH1cbiAgICAgIHJldHVybiAwO1xuICAgIH0pXG4gICAgLm1hcCgoeCkgPT4geC53b3JkKVxuICAgIC5zbGljZSgwLCBtYXgpO1xuXG4gIC8vIFhYWDogVGhlcmUgaXMgbm8gZ3VhcmFudGVlIHRoYXQgZXF1YWxzIHdpdGggbWF4LCBidXQgaXQgaXMgaW1wb3J0YW50IGZvciBwZXJmb3JtYW5jZVxuICByZXR1cm4gdW5pcVdpdGgoXG4gICAgY2FuZGlkYXRlLFxuICAgIChhLCBiKSA9PlxuICAgICAgYS52YWx1ZSA9PT0gYi52YWx1ZSAmJlxuICAgICAgV29yZFR5cGVNZXRhLm9mKGEudHlwZSkuZ3JvdXAgPT09IFdvcmRUeXBlTWV0YS5vZihiLnR5cGUpLmdyb3VwXG4gICk7XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gYmFzZW5hbWUocGF0aDogc3RyaW5nLCBleHQ/OiBzdHJpbmcpOiBzdHJpbmcge1xuICBjb25zdCBuYW1lID0gcGF0aC5tYXRjaCgvLitbXFxcXC9dKFteXFxcXC9dKylbXFxcXC9dPyQvKT8uWzFdID8/IHBhdGg7XG4gIHJldHVybiBleHQgJiYgbmFtZS5lbmRzV2l0aChleHQpID8gbmFtZS5yZXBsYWNlKGV4dCwgXCJcIikgOiBuYW1lO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZXh0bmFtZShwYXRoOiBzdHJpbmcpOiBzdHJpbmcge1xuICBjb25zdCBleHQgPSBiYXNlbmFtZShwYXRoKS5zcGxpdChcIi5cIikuc2xpY2UoMSkucG9wKCk7XG4gIHJldHVybiBleHQgPyBgLiR7ZXh0fWAgOiBcIlwiO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGlybmFtZShwYXRoOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gcGF0aC5tYXRjaCgvKC4rKVtcXFxcL10uKyQvKT8uWzFdID8/IFwiLlwiO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNVUkwocGF0aDogc3RyaW5nKTogYm9vbGVhbiB7XG4gIHJldHVybiBCb29sZWFuKHBhdGgubWF0Y2gobmV3IFJlZ0V4cChcIl5odHRwcz86Ly9cIikpKTtcbn1cbiIsImltcG9ydCB7IEFwcCwgRmlsZVN5c3RlbUFkYXB0ZXIsIE5vdGljZSwgcmVxdWVzdCB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHsgcHVzaFdvcmQsIHR5cGUgV29yZHNCeUZpcnN0TGV0dGVyIH0gZnJvbSBcIi4vc3VnZ2VzdGVyXCI7XG5pbXBvcnQgdHlwZSB7IENvbHVtbkRlbGltaXRlciB9IGZyb20gXCIuLi9vcHRpb24vQ29sdW1uRGVsaW1pdGVyXCI7XG5pbXBvcnQgeyBpc1VSTCB9IGZyb20gXCIuLi91dGlsL3BhdGhcIjtcbmltcG9ydCB0eXBlIHsgV29yZCB9IGZyb20gXCIuLi9tb2RlbC9Xb3JkXCI7XG5pbXBvcnQgeyBleGNsdWRlRW1vamkgfSBmcm9tIFwiLi4vdXRpbC9zdHJpbmdzXCI7XG5pbXBvcnQgdHlwZSB7IEFwcEhlbHBlciB9IGZyb20gXCIuLi9hcHAtaGVscGVyXCI7XG5cbmZ1bmN0aW9uIGVzY2FwZSh2YWx1ZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgLy8gVGhpcyB0cmlja3kgbG9naWNzIGZvciBTYWZhcmlcbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3RhZGFzaGktYWlrYXdhL29ic2lkaWFuLXZhcmlvdXMtY29tcGxlbWVudHMtcGx1Z2luL2lzc3Vlcy81NlxuICByZXR1cm4gdmFsdWVcbiAgICAucmVwbGFjZSgvXFxcXC9nLCBcIl9fVmFyaW91c0NvbXBsZW1lbnRzRXNjYXBlX19cIilcbiAgICAucmVwbGFjZSgvXFxuL2csIFwiXFxcXG5cIilcbiAgICAucmVwbGFjZSgvXFx0L2csIFwiXFxcXHRcIilcbiAgICAucmVwbGFjZSgvX19WYXJpb3VzQ29tcGxlbWVudHNFc2NhcGVfXy9nLCBcIlxcXFxcXFxcXCIpO1xufVxuXG5mdW5jdGlvbiB1bmVzY2FwZSh2YWx1ZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgLy8gVGhpcyB0cmlja3kgbG9naWNzIGZvciBTYWZhcmlcbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3RhZGFzaGktYWlrYXdhL29ic2lkaWFuLXZhcmlvdXMtY29tcGxlbWVudHMtcGx1Z2luL2lzc3Vlcy81NlxuICByZXR1cm4gdmFsdWVcbiAgICAucmVwbGFjZSgvXFxcXFxcXFwvZywgXCJfX1ZhcmlvdXNDb21wbGVtZW50c0VzY2FwZV9fXCIpXG4gICAgLnJlcGxhY2UoL1xcXFxuL2csIFwiXFxuXCIpXG4gICAgLnJlcGxhY2UoL1xcXFx0L2csIFwiXFx0XCIpXG4gICAgLnJlcGxhY2UoL19fVmFyaW91c0NvbXBsZW1lbnRzRXNjYXBlX18vZywgXCJcXFxcXCIpO1xufVxuXG5mdW5jdGlvbiBsaW5lVG9Xb3JkKFxuICBsaW5lOiBzdHJpbmcsXG4gIGRlbGltaXRlcjogQ29sdW1uRGVsaW1pdGVyLFxuICBwYXRoOiBzdHJpbmdcbik6IFdvcmQge1xuICBjb25zdCBbdmFsdWUsIGRlc2NyaXB0aW9uLCAuLi5hbGlhc2VzXSA9IGxpbmUuc3BsaXQoZGVsaW1pdGVyLnZhbHVlKTtcbiAgcmV0dXJuIHtcbiAgICB2YWx1ZTogdW5lc2NhcGUodmFsdWUpLFxuICAgIGRlc2NyaXB0aW9uLFxuICAgIGFsaWFzZXMsXG4gICAgdHlwZTogXCJjdXN0b21EaWN0aW9uYXJ5XCIsXG4gICAgY3JlYXRlZFBhdGg6IHBhdGgsXG4gIH07XG59XG5cbmZ1bmN0aW9uIHdvcmRUb0xpbmUod29yZDogV29yZCwgZGVsaW1pdGVyOiBDb2x1bW5EZWxpbWl0ZXIpOiBzdHJpbmcge1xuICBjb25zdCBlc2NhcGVkVmFsdWUgPSBlc2NhcGUod29yZC52YWx1ZSk7XG4gIGlmICghd29yZC5kZXNjcmlwdGlvbiAmJiAhd29yZC5hbGlhc2VzKSB7XG4gICAgcmV0dXJuIGVzY2FwZWRWYWx1ZTtcbiAgfVxuICBpZiAoIXdvcmQuYWxpYXNlcykge1xuICAgIHJldHVybiBbZXNjYXBlZFZhbHVlLCB3b3JkLmRlc2NyaXB0aW9uXS5qb2luKGRlbGltaXRlci52YWx1ZSk7XG4gIH1cbiAgcmV0dXJuIFtlc2NhcGVkVmFsdWUsIHdvcmQuZGVzY3JpcHRpb24sIC4uLndvcmQuYWxpYXNlc10uam9pbihcbiAgICBkZWxpbWl0ZXIudmFsdWVcbiAgKTtcbn1cblxuZnVuY3Rpb24gc3lub255bUFsaWFzZXMobmFtZTogc3RyaW5nKTogc3RyaW5nW10ge1xuICBjb25zdCBsZXNzRW1vamlWYWx1ZSA9IGV4Y2x1ZGVFbW9qaShuYW1lKTtcbiAgcmV0dXJuIG5hbWUgPT09IGxlc3NFbW9qaVZhbHVlID8gW10gOiBbbGVzc0Vtb2ppVmFsdWVdO1xufVxuXG5leHBvcnQgY2xhc3MgQ3VzdG9tRGljdGlvbmFyeVdvcmRQcm92aWRlciB7XG4gIHByaXZhdGUgd29yZHM6IFdvcmRbXSA9IFtdO1xuICB3b3JkQnlWYWx1ZTogeyBbdmFsdWU6IHN0cmluZ106IFdvcmQgfSA9IHt9O1xuICB3b3Jkc0J5Rmlyc3RMZXR0ZXI6IFdvcmRzQnlGaXJzdExldHRlciA9IHt9O1xuXG4gIHByaXZhdGUgYXBwSGVscGVyOiBBcHBIZWxwZXI7XG4gIHByaXZhdGUgZmlsZVN5c3RlbUFkYXB0ZXI6IEZpbGVTeXN0ZW1BZGFwdGVyO1xuICBwcml2YXRlIHBhdGhzOiBzdHJpbmdbXTtcbiAgcHJpdmF0ZSBkZWxpbWl0ZXI6IENvbHVtbkRlbGltaXRlcjtcblxuICBjb25zdHJ1Y3RvcihhcHA6IEFwcCwgYXBwSGVscGVyOiBBcHBIZWxwZXIpIHtcbiAgICB0aGlzLmFwcEhlbHBlciA9IGFwcEhlbHBlcjtcbiAgICB0aGlzLmZpbGVTeXN0ZW1BZGFwdGVyID0gYXBwLnZhdWx0LmFkYXB0ZXIgYXMgRmlsZVN5c3RlbUFkYXB0ZXI7XG4gIH1cblxuICBnZXQgZWRpdGFibGVQYXRocygpOiBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIHRoaXMucGF0aHMuZmlsdGVyKCh4KSA9PiAhaXNVUkwoeCkpO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBsb2FkV29yZHMocGF0aDogc3RyaW5nLCByZWdleHA6IHN0cmluZyk6IFByb21pc2U8V29yZFtdPiB7XG4gICAgY29uc3QgY29udGVudHMgPSBpc1VSTChwYXRoKVxuICAgICAgPyBhd2FpdCByZXF1ZXN0KHsgdXJsOiBwYXRoIH0pXG4gICAgICA6IGF3YWl0IHRoaXMuZmlsZVN5c3RlbUFkYXB0ZXIucmVhZChwYXRoKTtcblxuICAgIHJldHVybiBjb250ZW50c1xuICAgICAgLnNwbGl0KC9cXHJcXG58XFxuLylcbiAgICAgIC5tYXAoKHgpID0+IHgucmVwbGFjZSgvJSUuKiUlL2csIFwiXCIpKVxuICAgICAgLmZpbHRlcigoeCkgPT4geClcbiAgICAgIC5tYXAoKHgpID0+IGxpbmVUb1dvcmQoeCwgdGhpcy5kZWxpbWl0ZXIsIHBhdGgpKVxuICAgICAgLmZpbHRlcigoeCkgPT4gIXJlZ2V4cCB8fCB4LnZhbHVlLm1hdGNoKG5ldyBSZWdFeHAocmVnZXhwKSkpO1xuICB9XG5cbiAgYXN5bmMgcmVmcmVzaEN1c3RvbVdvcmRzKHJlZ2V4cDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdGhpcy5jbGVhcldvcmRzKCk7XG5cbiAgICBmb3IgKGNvbnN0IHBhdGggb2YgdGhpcy5wYXRocykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3Qgd29yZHMgPSBhd2FpdCB0aGlzLmxvYWRXb3JkcyhwYXRoLCByZWdleHApO1xuICAgICAgICB3b3Jkcy5mb3JFYWNoKCh4KSA9PiB0aGlzLndvcmRzLnB1c2goeCkpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBub2luc3BlY3Rpb24gT2JqZWN0QWxsb2NhdGlvbklnbm9yZWRcbiAgICAgICAgbmV3IE5vdGljZShcbiAgICAgICAgICBg4pqgIEZhaWwgdG8gbG9hZCAke3BhdGh9IC0tIFZhcmlvdXMgQ29tcGxlbWVudHMgUGx1Z2luIC0tIFxcbiAke2V9YCxcbiAgICAgICAgICAwXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy53b3Jkcy5mb3JFYWNoKCh4KSA9PiB0aGlzLmFkZFdvcmQoeCkpO1xuICB9XG5cbiAgYXN5bmMgYWRkV29yZFdpdGhEaWN0aW9uYXJ5KFxuICAgIHdvcmQ6IFdvcmQsXG4gICAgZGljdGlvbmFyeVBhdGg6IHN0cmluZ1xuICApOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0aGlzLmFkZFdvcmQod29yZCk7XG4gICAgYXdhaXQgdGhpcy5maWxlU3lzdGVtQWRhcHRlci5hcHBlbmQoXG4gICAgICBkaWN0aW9uYXJ5UGF0aCxcbiAgICAgIFwiXFxuXCIgKyB3b3JkVG9MaW5lKHdvcmQsIHRoaXMuZGVsaW1pdGVyKVxuICAgICk7XG4gIH1cblxuICBwcml2YXRlIGFkZFdvcmQod29yZDogV29yZCkge1xuICAgIC8vIEFkZCBhbGlhc2VzIGFzIGEgc3lub255bVxuICAgIGNvbnN0IHdvcmRXaXRoU3lub255bSA9IHtcbiAgICAgIC4uLndvcmQsXG4gICAgICBhbGlhc2VzOiBbLi4uKHdvcmQuYWxpYXNlcyA/PyBbXSksIC4uLnN5bm9ueW1BbGlhc2VzKHdvcmQudmFsdWUpXSxcbiAgICB9O1xuXG4gICAgdGhpcy53b3JkQnlWYWx1ZVt3b3JkV2l0aFN5bm9ueW0udmFsdWVdID0gd29yZFdpdGhTeW5vbnltO1xuICAgIHB1c2hXb3JkKFxuICAgICAgdGhpcy53b3Jkc0J5Rmlyc3RMZXR0ZXIsXG4gICAgICB3b3JkV2l0aFN5bm9ueW0udmFsdWUuY2hhckF0KDApLFxuICAgICAgd29yZFdpdGhTeW5vbnltXG4gICAgKTtcbiAgICB3b3JkV2l0aFN5bm9ueW0uYWxpYXNlcz8uZm9yRWFjaCgoYSkgPT5cbiAgICAgIHB1c2hXb3JkKHRoaXMud29yZHNCeUZpcnN0TGV0dGVyLCBhLmNoYXJBdCgwKSwgd29yZFdpdGhTeW5vbnltKVxuICAgICk7XG4gIH1cblxuICBjbGVhcldvcmRzKCk6IHZvaWQge1xuICAgIHRoaXMud29yZHMgPSBbXTtcbiAgICB0aGlzLndvcmRCeVZhbHVlID0ge307XG4gICAgdGhpcy53b3Jkc0J5Rmlyc3RMZXR0ZXIgPSB7fTtcbiAgfVxuXG4gIGdldCB3b3JkQ291bnQoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy53b3Jkcy5sZW5ndGg7XG4gIH1cblxuICBzZXRTZXR0aW5ncyhwYXRoczogc3RyaW5nW10sIGRlbGltaXRlcjogQ29sdW1uRGVsaW1pdGVyKSB7XG4gICAgdGhpcy5wYXRocyA9IHBhdGhzO1xuICAgIHRoaXMuZGVsaW1pdGVyID0gZGVsaW1pdGVyO1xuICB9XG59XG4iLCJpbXBvcnQgdHlwZSB7IEFwcCB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHsgZ3JvdXBCeSwgdW5pcSB9IGZyb20gXCIuLi91dGlsL2NvbGxlY3Rpb24taGVscGVyXCI7XG5pbXBvcnQgdHlwZSB7IFdvcmRzQnlGaXJzdExldHRlciB9IGZyb20gXCIuL3N1Z2dlc3RlclwiO1xuaW1wb3J0IHR5cGUgeyBUb2tlbml6ZXIgfSBmcm9tIFwiLi4vdG9rZW5pemVyL3Rva2VuaXplclwiO1xuaW1wb3J0IHR5cGUgeyBBcHBIZWxwZXIgfSBmcm9tIFwiLi4vYXBwLWhlbHBlclwiO1xuaW1wb3J0IHsgYWxsQWxwaGFiZXRzIH0gZnJvbSBcIi4uL3V0aWwvc3RyaW5nc1wiO1xuaW1wb3J0IHR5cGUgeyBXb3JkIH0gZnJvbSBcIi4uL21vZGVsL1dvcmRcIjtcblxuZXhwb3J0IGNsYXNzIEN1cnJlbnRGaWxlV29yZFByb3ZpZGVyIHtcbiAgd29yZHNCeUZpcnN0TGV0dGVyOiBXb3Jkc0J5Rmlyc3RMZXR0ZXIgPSB7fTtcbiAgcHJpdmF0ZSB3b3JkczogV29yZFtdID0gW107XG4gIHByaXZhdGUgdG9rZW5pemVyOiBUb2tlbml6ZXI7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBhcHA6IEFwcCwgcHJpdmF0ZSBhcHBIZWxwZXI6IEFwcEhlbHBlcikge31cblxuICBhc3luYyByZWZyZXNoV29yZHMob25seUVuZ2xpc2g6IGJvb2xlYW4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0aGlzLmNsZWFyV29yZHMoKTtcblxuICAgIGNvbnN0IGVkaXRvciA9IHRoaXMuYXBwSGVscGVyLmdldEN1cnJlbnRFZGl0b3IoKTtcbiAgICBpZiAoIWVkaXRvcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGZpbGUgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpO1xuICAgIGlmICghZmlsZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGN1cnJlbnRUb2tlbiA9IHRoaXMudG9rZW5pemVyXG4gICAgICAudG9rZW5pemUoXG4gICAgICAgIGVkaXRvci5nZXRMaW5lKGVkaXRvci5nZXRDdXJzb3IoKS5saW5lKS5zbGljZSgwLCBlZGl0b3IuZ2V0Q3Vyc29yKCkuY2gpXG4gICAgICApXG4gICAgICAubGFzdCgpO1xuXG4gICAgY29uc3QgY29udGVudCA9IGF3YWl0IHRoaXMuYXBwLnZhdWx0LmNhY2hlZFJlYWQoZmlsZSk7XG4gICAgY29uc3QgdG9rZW5zID0gb25seUVuZ2xpc2hcbiAgICAgID8gdGhpcy50b2tlbml6ZXIudG9rZW5pemUoY29udGVudCkuZmlsdGVyKGFsbEFscGhhYmV0cylcbiAgICAgIDogdGhpcy50b2tlbml6ZXIudG9rZW5pemUoY29udGVudCk7XG4gICAgdGhpcy53b3JkcyA9IHVuaXEodG9rZW5zKVxuICAgICAgLmZpbHRlcigoeCkgPT4geCAhPT0gY3VycmVudFRva2VuKVxuICAgICAgLm1hcCgoeCkgPT4gKHtcbiAgICAgICAgdmFsdWU6IHgsXG4gICAgICAgIHR5cGU6IFwiY3VycmVudEZpbGVcIixcbiAgICAgICAgY3JlYXRlZFBhdGg6IGZpbGUucGF0aCxcbiAgICAgIH0pKTtcbiAgICB0aGlzLndvcmRzQnlGaXJzdExldHRlciA9IGdyb3VwQnkodGhpcy53b3JkcywgKHgpID0+IHgudmFsdWUuY2hhckF0KDApKTtcbiAgfVxuXG4gIGNsZWFyV29yZHMoKTogdm9pZCB7XG4gICAgdGhpcy53b3JkcyA9IFtdO1xuICAgIHRoaXMud29yZHNCeUZpcnN0TGV0dGVyID0ge307XG4gIH1cblxuICBnZXQgd29yZENvdW50KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMud29yZHMubGVuZ3RoO1xuICB9XG5cbiAgc2V0U2V0dGluZ3ModG9rZW5pemVyOiBUb2tlbml6ZXIpIHtcbiAgICB0aGlzLnRva2VuaXplciA9IHRva2VuaXplcjtcbiAgfVxufVxuIiwiaW1wb3J0IHR5cGUgeyBBcHAgfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB7IHB1c2hXb3JkLCB0eXBlIFdvcmRzQnlGaXJzdExldHRlciB9IGZyb20gXCIuL3N1Z2dlc3RlclwiO1xuaW1wb3J0IHR5cGUgeyBBcHBIZWxwZXIgfSBmcm9tIFwiLi4vYXBwLWhlbHBlclwiO1xuaW1wb3J0IHsgZXhjbHVkZUVtb2ppIH0gZnJvbSBcIi4uL3V0aWwvc3RyaW5nc1wiO1xuaW1wb3J0IHR5cGUgeyBJbnRlcm5hbExpbmtXb3JkLCBXb3JkIH0gZnJvbSBcIi4uL21vZGVsL1dvcmRcIjtcblxuZXhwb3J0IGNsYXNzIEludGVybmFsTGlua1dvcmRQcm92aWRlciB7XG4gIHByaXZhdGUgd29yZHM6IFdvcmRbXSA9IFtdO1xuICB3b3Jkc0J5Rmlyc3RMZXR0ZXI6IFdvcmRzQnlGaXJzdExldHRlciA9IHt9O1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgYXBwOiBBcHAsIHByaXZhdGUgYXBwSGVscGVyOiBBcHBIZWxwZXIpIHt9XG5cbiAgcmVmcmVzaFdvcmRzKFxuICAgIHdvcmRBc0ludGVybmFsTGlua0FsaWFzOiBib29sZWFuLFxuICAgIGV4Y2x1ZGVQYXRoUHJlZml4UGF0dGVybnM6IHN0cmluZ1tdXG4gICk6IHZvaWQge1xuICAgIHRoaXMuY2xlYXJXb3JkcygpO1xuXG4gICAgY29uc3Qgc3lub255bUFsaWFzZXMgPSAobmFtZTogc3RyaW5nKTogc3RyaW5nW10gPT4ge1xuICAgICAgY29uc3QgbGVzc0Vtb2ppVmFsdWUgPSBleGNsdWRlRW1vamkobmFtZSk7XG4gICAgICByZXR1cm4gbmFtZSA9PT0gbGVzc0Vtb2ppVmFsdWUgPyBbXSA6IFtsZXNzRW1vamlWYWx1ZV07XG4gICAgfTtcblxuICAgIGNvbnN0IHJlc29sdmVkSW50ZXJuYWxMaW5rV29yZHM6IEludGVybmFsTGlua1dvcmRbXSA9IHRoaXMuYXBwLnZhdWx0XG4gICAgICAuZ2V0TWFya2Rvd25GaWxlcygpXG4gICAgICAuZmlsdGVyKChmKSA9PlxuICAgICAgICBleGNsdWRlUGF0aFByZWZpeFBhdHRlcm5zLmV2ZXJ5KCh4KSA9PiAhZi5wYXRoLnN0YXJ0c1dpdGgoeCkpXG4gICAgICApXG4gICAgICAuZmxhdE1hcCgoeCkgPT4ge1xuICAgICAgICBjb25zdCBhbGlhc2VzID0gdGhpcy5hcHBIZWxwZXIuZ2V0QWxpYXNlcyh4KTtcblxuICAgICAgICBpZiAod29yZEFzSW50ZXJuYWxMaW5rQWxpYXMpIHtcbiAgICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICB2YWx1ZTogeC5iYXNlbmFtZSxcbiAgICAgICAgICAgICAgdHlwZTogXCJpbnRlcm5hbExpbmtcIixcbiAgICAgICAgICAgICAgY3JlYXRlZFBhdGg6IHgucGF0aCxcbiAgICAgICAgICAgICAgYWxpYXNlczogc3lub255bUFsaWFzZXMoeC5iYXNlbmFtZSksXG4gICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiB4LnBhdGgsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLi4uYWxpYXNlcy5tYXAoKGEpID0+ICh7XG4gICAgICAgICAgICAgIHZhbHVlOiBhLFxuICAgICAgICAgICAgICB0eXBlOiBcImludGVybmFsTGlua1wiLFxuICAgICAgICAgICAgICBjcmVhdGVkUGF0aDogeC5wYXRoLFxuICAgICAgICAgICAgICBhbGlhc2VzOiBzeW5vbnltQWxpYXNlcyhhKSxcbiAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHgucGF0aCxcbiAgICAgICAgICAgICAgYWxpYXNNZXRhOiB7XG4gICAgICAgICAgICAgICAgb3JpZ2luOiB4LmJhc2VuYW1lLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSkpLFxuICAgICAgICAgIF0gYXMgSW50ZXJuYWxMaW5rV29yZFtdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHZhbHVlOiB4LmJhc2VuYW1lLFxuICAgICAgICAgICAgICB0eXBlOiBcImludGVybmFsTGlua1wiLFxuICAgICAgICAgICAgICBjcmVhdGVkUGF0aDogeC5wYXRoLFxuICAgICAgICAgICAgICBhbGlhc2VzOiBbXG4gICAgICAgICAgICAgICAgLi4uc3lub255bUFsaWFzZXMoeC5iYXNlbmFtZSksXG4gICAgICAgICAgICAgICAgLi4uYWxpYXNlcyxcbiAgICAgICAgICAgICAgICAuLi5hbGlhc2VzLmZsYXRNYXAoc3lub255bUFsaWFzZXMpLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogeC5wYXRoLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdIGFzIEludGVybmFsTGlua1dvcmRbXTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICBjb25zdCB1bnJlc29sdmVkSW50ZXJuYWxMaW5rV29yZHM6IEludGVybmFsTGlua1dvcmRbXSA9IHRoaXMuYXBwSGVscGVyXG4gICAgICAuc2VhcmNoUGhhbnRvbUxpbmtzKClcbiAgICAgIC5tYXAoKHsgcGF0aCwgbGluayB9KSA9PiB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgdmFsdWU6IGxpbmssXG4gICAgICAgICAgdHlwZTogXCJpbnRlcm5hbExpbmtcIixcbiAgICAgICAgICBjcmVhdGVkUGF0aDogcGF0aCxcbiAgICAgICAgICBhbGlhc2VzOiBzeW5vbnltQWxpYXNlcyhsaW5rKSxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogYEFwcGVhcmVkIGluIC0+ICR7cGF0aH1gLFxuICAgICAgICAgIHBoYW50b206IHRydWUsXG4gICAgICAgIH07XG4gICAgICB9KTtcblxuICAgIHRoaXMud29yZHMgPSBbLi4ucmVzb2x2ZWRJbnRlcm5hbExpbmtXb3JkcywgLi4udW5yZXNvbHZlZEludGVybmFsTGlua1dvcmRzXTtcbiAgICBmb3IgKGNvbnN0IHdvcmQgb2YgdGhpcy53b3Jkcykge1xuICAgICAgcHVzaFdvcmQodGhpcy53b3Jkc0J5Rmlyc3RMZXR0ZXIsIHdvcmQudmFsdWUuY2hhckF0KDApLCB3b3JkKTtcbiAgICAgIHdvcmQuYWxpYXNlcz8uZm9yRWFjaCgoYSkgPT5cbiAgICAgICAgcHVzaFdvcmQodGhpcy53b3Jkc0J5Rmlyc3RMZXR0ZXIsIGEuY2hhckF0KDApLCB3b3JkKVxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBjbGVhcldvcmRzKCk6IHZvaWQge1xuICAgIHRoaXMud29yZHMgPSBbXTtcbiAgICB0aGlzLndvcmRzQnlGaXJzdExldHRlciA9IHt9O1xuICB9XG5cbiAgZ2V0IHdvcmRDb3VudCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLndvcmRzLmxlbmd0aDtcbiAgfVxufVxuIiwiaW1wb3J0IHR5cGUgeyBJbmRleGVkV29yZHMgfSBmcm9tIFwiLi4vdWkvQXV0b0NvbXBsZXRlU3VnZ2VzdFwiO1xuaW1wb3J0IHsgc3VnZ2VzdFdvcmRzLCBzdWdnZXN0V29yZHNCeVBhcnRpYWxNYXRjaCB9IGZyb20gXCIuL3N1Z2dlc3RlclwiO1xuaW1wb3J0IHR5cGUgeyBXb3JkIH0gZnJvbSBcIi4uL21vZGVsL1dvcmRcIjtcbmltcG9ydCB0eXBlIHsgU2VsZWN0aW9uSGlzdG9yeVN0b3JhZ2UgfSBmcm9tIFwiLi4vc3RvcmFnZS9TZWxlY3Rpb25IaXN0b3J5U3RvcmFnZVwiO1xuXG50eXBlIE5hbWUgPSBcInByZWZpeFwiIHwgXCJwYXJ0aWFsXCI7XG5cbnR5cGUgSGFuZGxlciA9IChcbiAgaW5kZXhlZFdvcmRzOiBJbmRleGVkV29yZHMsXG4gIHF1ZXJ5OiBzdHJpbmcsXG4gIG1heDogbnVtYmVyLFxuICBmcm9udE1hdHRlcjogc3RyaW5nIHwgbnVsbCxcbiAgc2VsZWN0aW9uSGlzdG9yeVN0b3JhZ2U/OiBTZWxlY3Rpb25IaXN0b3J5U3RvcmFnZVxuKSA9PiBXb3JkW107XG5cbmV4cG9ydCBjbGFzcyBNYXRjaFN0cmF0ZWd5IHtcbiAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgX3ZhbHVlczogTWF0Y2hTdHJhdGVneVtdID0gW107XG5cbiAgc3RhdGljIHJlYWRvbmx5IFBSRUZJWCA9IG5ldyBNYXRjaFN0cmF0ZWd5KFwicHJlZml4XCIsIHN1Z2dlc3RXb3Jkcyk7XG4gIHN0YXRpYyByZWFkb25seSBQQVJUSUFMID0gbmV3IE1hdGNoU3RyYXRlZ3koXG4gICAgXCJwYXJ0aWFsXCIsXG4gICAgc3VnZ2VzdFdvcmRzQnlQYXJ0aWFsTWF0Y2hcbiAgKTtcblxuICBwcml2YXRlIGNvbnN0cnVjdG9yKHJlYWRvbmx5IG5hbWU6IE5hbWUsIHJlYWRvbmx5IGhhbmRsZXI6IEhhbmRsZXIpIHtcbiAgICBNYXRjaFN0cmF0ZWd5Ll92YWx1ZXMucHVzaCh0aGlzKTtcbiAgfVxuXG4gIHN0YXRpYyBmcm9tTmFtZShuYW1lOiBzdHJpbmcpOiBNYXRjaFN0cmF0ZWd5IHtcbiAgICByZXR1cm4gTWF0Y2hTdHJhdGVneS5fdmFsdWVzLmZpbmQoKHgpID0+IHgubmFtZSA9PT0gbmFtZSkhO1xuICB9XG5cbiAgc3RhdGljIHZhbHVlcygpOiBNYXRjaFN0cmF0ZWd5W10ge1xuICAgIHJldHVybiBNYXRjaFN0cmF0ZWd5Ll92YWx1ZXM7XG4gIH1cbn1cbiIsImltcG9ydCB0eXBlIHsgTW9kaWZpZXIgfSBmcm9tIFwib2JzaWRpYW5cIjtcblxudHlwZSBOYW1lID1cbiAgfCBcIk5vbmVcIlxuICB8IFwiVGFiLCBTaGlmdCtUYWJcIlxuICB8IFwiQ3RybC9DbWQrTiwgQ3RybC9DbWQrUFwiXG4gIHwgXCJDdHJsL0NtZCtKLCBDdHJsL0NtZCtLXCI7XG5pbnRlcmZhY2UgS2V5QmluZCB7XG4gIG1vZGlmaWVyczogTW9kaWZpZXJbXTtcbiAga2V5OiBzdHJpbmcgfCBudWxsO1xufVxuXG5leHBvcnQgY2xhc3MgQ3ljbGVUaHJvdWdoU3VnZ2VzdGlvbnNLZXlzIHtcbiAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgX3ZhbHVlczogQ3ljbGVUaHJvdWdoU3VnZ2VzdGlvbnNLZXlzW10gPSBbXTtcblxuICBzdGF0aWMgcmVhZG9ubHkgTk9ORSA9IG5ldyBDeWNsZVRocm91Z2hTdWdnZXN0aW9uc0tleXMoXG4gICAgXCJOb25lXCIsXG4gICAgeyBtb2RpZmllcnM6IFtdLCBrZXk6IG51bGwgfSxcbiAgICB7IG1vZGlmaWVyczogW10sIGtleTogbnVsbCB9XG4gICk7XG4gIHN0YXRpYyByZWFkb25seSBUQUIgPSBuZXcgQ3ljbGVUaHJvdWdoU3VnZ2VzdGlvbnNLZXlzKFxuICAgIFwiVGFiLCBTaGlmdCtUYWJcIixcbiAgICB7IG1vZGlmaWVyczogW10sIGtleTogXCJUYWJcIiB9LFxuICAgIHsgbW9kaWZpZXJzOiBbXCJTaGlmdFwiXSwga2V5OiBcIlRhYlwiIH1cbiAgKTtcbiAgc3RhdGljIHJlYWRvbmx5IEVNQUNTID0gbmV3IEN5Y2xlVGhyb3VnaFN1Z2dlc3Rpb25zS2V5cyhcbiAgICBcIkN0cmwvQ21kK04sIEN0cmwvQ21kK1BcIixcbiAgICB7IG1vZGlmaWVyczogW1wiTW9kXCJdLCBrZXk6IFwiTlwiIH0sXG4gICAgeyBtb2RpZmllcnM6IFtcIk1vZFwiXSwga2V5OiBcIlBcIiB9XG4gICk7XG4gIHN0YXRpYyByZWFkb25seSBWSU0gPSBuZXcgQ3ljbGVUaHJvdWdoU3VnZ2VzdGlvbnNLZXlzKFxuICAgIFwiQ3RybC9DbWQrSiwgQ3RybC9DbWQrS1wiLFxuICAgIHsgbW9kaWZpZXJzOiBbXCJNb2RcIl0sIGtleTogXCJKXCIgfSxcbiAgICB7IG1vZGlmaWVyczogW1wiTW9kXCJdLCBrZXk6IFwiS1wiIH1cbiAgKTtcblxuICBwcml2YXRlIGNvbnN0cnVjdG9yKFxuICAgIHJlYWRvbmx5IG5hbWU6IE5hbWUsXG4gICAgcmVhZG9ubHkgbmV4dEtleTogS2V5QmluZCxcbiAgICByZWFkb25seSBwcmV2aW91c0tleTogS2V5QmluZFxuICApIHtcbiAgICBDeWNsZVRocm91Z2hTdWdnZXN0aW9uc0tleXMuX3ZhbHVlcy5wdXNoKHRoaXMpO1xuICB9XG5cbiAgc3RhdGljIGZyb21OYW1lKG5hbWU6IHN0cmluZyk6IEN5Y2xlVGhyb3VnaFN1Z2dlc3Rpb25zS2V5cyB7XG4gICAgcmV0dXJuIEN5Y2xlVGhyb3VnaFN1Z2dlc3Rpb25zS2V5cy5fdmFsdWVzLmZpbmQoKHgpID0+IHgubmFtZSA9PT0gbmFtZSkhO1xuICB9XG5cbiAgc3RhdGljIHZhbHVlcygpOiBDeWNsZVRocm91Z2hTdWdnZXN0aW9uc0tleXNbXSB7XG4gICAgcmV0dXJuIEN5Y2xlVGhyb3VnaFN1Z2dlc3Rpb25zS2V5cy5fdmFsdWVzO1xuICB9XG59XG4iLCJ0eXBlIERlbGltaXRlciA9IFwiXFx0XCIgfCBcIixcIiB8IFwifFwiO1xuXG5leHBvcnQgY2xhc3MgQ29sdW1uRGVsaW1pdGVyIHtcbiAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgX3ZhbHVlczogQ29sdW1uRGVsaW1pdGVyW10gPSBbXTtcblxuICBzdGF0aWMgcmVhZG9ubHkgVEFCID0gbmV3IENvbHVtbkRlbGltaXRlcihcIlRhYlwiLCBcIlxcdFwiKTtcbiAgc3RhdGljIHJlYWRvbmx5IENPTU1BID0gbmV3IENvbHVtbkRlbGltaXRlcihcIkNvbW1hXCIsIFwiLFwiKTtcbiAgc3RhdGljIHJlYWRvbmx5IFBJUEUgPSBuZXcgQ29sdW1uRGVsaW1pdGVyKFwiUGlwZVwiLCBcInxcIik7XG5cbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcihyZWFkb25seSBuYW1lOiBzdHJpbmcsIHJlYWRvbmx5IHZhbHVlOiBEZWxpbWl0ZXIpIHtcbiAgICBDb2x1bW5EZWxpbWl0ZXIuX3ZhbHVlcy5wdXNoKHRoaXMpO1xuICB9XG5cbiAgc3RhdGljIGZyb21OYW1lKG5hbWU6IHN0cmluZyk6IENvbHVtbkRlbGltaXRlciB7XG4gICAgcmV0dXJuIENvbHVtbkRlbGltaXRlci5fdmFsdWVzLmZpbmQoKHgpID0+IHgubmFtZSA9PT0gbmFtZSkhO1xuICB9XG5cbiAgc3RhdGljIHZhbHVlcygpOiBDb2x1bW5EZWxpbWl0ZXJbXSB7XG4gICAgcmV0dXJuIENvbHVtbkRlbGltaXRlci5fdmFsdWVzO1xuICB9XG59XG4iLCJpbXBvcnQgdHlwZSB7IE1vZGlmaWVyIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5cbnR5cGUgTmFtZSA9XG4gIHwgXCJFbnRlclwiXG4gIHwgXCJUYWJcIlxuICB8IFwiQ3RybC9DbWQrRW50ZXJcIlxuICB8IFwiQWx0K0VudGVyXCJcbiAgfCBcIlNoaWZ0K0VudGVyXCJcbiAgfCBcIlNwYWNlXCI7XG5pbnRlcmZhY2UgS2V5QmluZCB7XG4gIG1vZGlmaWVyczogTW9kaWZpZXJbXTtcbiAga2V5OiBzdHJpbmcgfCBudWxsO1xufVxuXG5leHBvcnQgY2xhc3MgU2VsZWN0U3VnZ2VzdGlvbktleSB7XG4gIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IF92YWx1ZXM6IFNlbGVjdFN1Z2dlc3Rpb25LZXlbXSA9IFtdO1xuXG4gIHN0YXRpYyByZWFkb25seSBFTlRFUiA9IG5ldyBTZWxlY3RTdWdnZXN0aW9uS2V5KFwiRW50ZXJcIiwge1xuICAgIG1vZGlmaWVyczogW10sXG4gICAga2V5OiBcIkVudGVyXCIsXG4gIH0pO1xuICBzdGF0aWMgcmVhZG9ubHkgVEFCID0gbmV3IFNlbGVjdFN1Z2dlc3Rpb25LZXkoXCJUYWJcIiwge1xuICAgIG1vZGlmaWVyczogW10sXG4gICAga2V5OiBcIlRhYlwiLFxuICB9KTtcbiAgc3RhdGljIHJlYWRvbmx5IE1PRF9FTlRFUiA9IG5ldyBTZWxlY3RTdWdnZXN0aW9uS2V5KFwiQ3RybC9DbWQrRW50ZXJcIiwge1xuICAgIG1vZGlmaWVyczogW1wiTW9kXCJdLFxuICAgIGtleTogXCJFbnRlclwiLFxuICB9KTtcbiAgc3RhdGljIHJlYWRvbmx5IEFMVF9FTlRFUiA9IG5ldyBTZWxlY3RTdWdnZXN0aW9uS2V5KFwiQWx0K0VudGVyXCIsIHtcbiAgICBtb2RpZmllcnM6IFtcIkFsdFwiXSxcbiAgICBrZXk6IFwiRW50ZXJcIixcbiAgfSk7XG4gIHN0YXRpYyByZWFkb25seSBTSElGVF9FTlRFUiA9IG5ldyBTZWxlY3RTdWdnZXN0aW9uS2V5KFwiU2hpZnQrRW50ZXJcIiwge1xuICAgIG1vZGlmaWVyczogW1wiU2hpZnRcIl0sXG4gICAga2V5OiBcIkVudGVyXCIsXG4gIH0pO1xuICBzdGF0aWMgcmVhZG9ubHkgU1BBQ0UgPSBuZXcgU2VsZWN0U3VnZ2VzdGlvbktleShcIlNwYWNlXCIsIHtcbiAgICBtb2RpZmllcnM6IFtdLFxuICAgIGtleTogXCIgXCIsXG4gIH0pO1xuXG4gIHByaXZhdGUgY29uc3RydWN0b3IocmVhZG9ubHkgbmFtZTogTmFtZSwgcmVhZG9ubHkga2V5QmluZDogS2V5QmluZCkge1xuICAgIFNlbGVjdFN1Z2dlc3Rpb25LZXkuX3ZhbHVlcy5wdXNoKHRoaXMpO1xuICB9XG5cbiAgc3RhdGljIGZyb21OYW1lKG5hbWU6IHN0cmluZyk6IFNlbGVjdFN1Z2dlc3Rpb25LZXkge1xuICAgIHJldHVybiBTZWxlY3RTdWdnZXN0aW9uS2V5Ll92YWx1ZXMuZmluZCgoeCkgPT4geC5uYW1lID09PSBuYW1lKSE7XG4gIH1cblxuICBzdGF0aWMgdmFsdWVzKCk6IFNlbGVjdFN1Z2dlc3Rpb25LZXlbXSB7XG4gICAgcmV0dXJuIFNlbGVjdFN1Z2dlc3Rpb25LZXkuX3ZhbHVlcztcbiAgfVxufVxuIiwiaW1wb3J0IHR5cGUgeyBBcHAgfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB7IGdyb3VwQnkgfSBmcm9tIFwiLi4vdXRpbC9jb2xsZWN0aW9uLWhlbHBlclwiO1xuaW1wb3J0IHR5cGUgeyBXb3Jkc0J5Rmlyc3RMZXR0ZXIgfSBmcm9tIFwiLi9zdWdnZXN0ZXJcIjtcbmltcG9ydCB0eXBlIHsgVG9rZW5pemVyIH0gZnJvbSBcIi4uL3Rva2VuaXplci90b2tlbml6ZXJcIjtcbmltcG9ydCB0eXBlIHsgQXBwSGVscGVyIH0gZnJvbSBcIi4uL2FwcC1oZWxwZXJcIjtcbmltcG9ydCB0eXBlIHsgV29yZCB9IGZyb20gXCIuLi9tb2RlbC9Xb3JkXCI7XG5pbXBvcnQgeyBkaXJuYW1lIH0gZnJvbSBcIi4uL3V0aWwvcGF0aFwiO1xuXG5leHBvcnQgY2xhc3MgQ3VycmVudFZhdWx0V29yZFByb3ZpZGVyIHtcbiAgd29yZHNCeUZpcnN0TGV0dGVyOiBXb3Jkc0J5Rmlyc3RMZXR0ZXIgPSB7fTtcbiAgcHJpdmF0ZSB3b3JkczogV29yZFtdID0gW107XG4gIHByaXZhdGUgdG9rZW5pemVyOiBUb2tlbml6ZXI7XG4gIHByaXZhdGUgaW5jbHVkZVByZWZpeFBhdHRlcm5zOiBzdHJpbmdbXTtcbiAgcHJpdmF0ZSBleGNsdWRlUHJlZml4UGF0dGVybnM6IHN0cmluZ1tdO1xuICBwcml2YXRlIG9ubHlVbmRlckN1cnJlbnREaXJlY3Rvcnk6IGJvb2xlYW47XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBhcHA6IEFwcCwgcHJpdmF0ZSBhcHBIZWxwZXI6IEFwcEhlbHBlcikge31cblxuICBhc3luYyByZWZyZXNoV29yZHMoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdGhpcy5jbGVhcldvcmRzKCk7XG5cbiAgICBjb25zdCBjdXJyZW50RGlybmFtZSA9IHRoaXMuYXBwSGVscGVyLmdldEN1cnJlbnREaXJuYW1lKCk7XG5cbiAgICBjb25zdCBtYXJrZG93bkZpbGVQYXRocyA9IHRoaXMuYXBwLnZhdWx0XG4gICAgICAuZ2V0TWFya2Rvd25GaWxlcygpXG4gICAgICAubWFwKCh4KSA9PiB4LnBhdGgpXG4gICAgICAuZmlsdGVyKChwKSA9PiB0aGlzLmluY2x1ZGVQcmVmaXhQYXR0ZXJucy5ldmVyeSgoeCkgPT4gcC5zdGFydHNXaXRoKHgpKSlcbiAgICAgIC5maWx0ZXIoKHApID0+IHRoaXMuZXhjbHVkZVByZWZpeFBhdHRlcm5zLmV2ZXJ5KCh4KSA9PiAhcC5zdGFydHNXaXRoKHgpKSlcbiAgICAgIC5maWx0ZXIoXG4gICAgICAgIChwKSA9PiAhdGhpcy5vbmx5VW5kZXJDdXJyZW50RGlyZWN0b3J5IHx8IGRpcm5hbWUocCkgPT09IGN1cnJlbnREaXJuYW1lXG4gICAgICApO1xuXG4gICAgbGV0IHdvcmRCeVZhbHVlOiB7IFt2YWx1ZTogc3RyaW5nXTogV29yZCB9ID0ge307XG4gICAgZm9yIChjb25zdCBwYXRoIG9mIG1hcmtkb3duRmlsZVBhdGhzKSB7XG4gICAgICBjb25zdCBjb250ZW50ID0gYXdhaXQgdGhpcy5hcHAudmF1bHQuYWRhcHRlci5yZWFkKHBhdGgpO1xuXG4gICAgICBmb3IgKGNvbnN0IHRva2VuIG9mIHRoaXMudG9rZW5pemVyLnRva2VuaXplKGNvbnRlbnQpKSB7XG4gICAgICAgIHdvcmRCeVZhbHVlW3Rva2VuXSA9IHtcbiAgICAgICAgICB2YWx1ZTogdG9rZW4sXG4gICAgICAgICAgdHlwZTogXCJjdXJyZW50VmF1bHRcIixcbiAgICAgICAgICBjcmVhdGVkUGF0aDogcGF0aCxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogcGF0aCxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLndvcmRzID0gT2JqZWN0LnZhbHVlcyh3b3JkQnlWYWx1ZSk7XG4gICAgdGhpcy53b3Jkc0J5Rmlyc3RMZXR0ZXIgPSBncm91cEJ5KHRoaXMud29yZHMsICh4KSA9PiB4LnZhbHVlLmNoYXJBdCgwKSk7XG4gIH1cblxuICBjbGVhcldvcmRzKCk6IHZvaWQge1xuICAgIHRoaXMud29yZHMgPSBbXTtcbiAgICB0aGlzLndvcmRzQnlGaXJzdExldHRlciA9IHt9O1xuICB9XG5cbiAgZ2V0IHdvcmRDb3VudCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLndvcmRzLmxlbmd0aDtcbiAgfVxuXG4gIHNldFNldHRpbmdzKFxuICAgIHRva2VuaXplcjogVG9rZW5pemVyLFxuICAgIGluY2x1ZGVQcmVmaXhQYXR0ZXJuczogc3RyaW5nW10sXG4gICAgZXhjbHVkZVByZWZpeFBhdHRlcm5zOiBzdHJpbmdbXSxcbiAgICBvbmx5VW5kZXJDdXJyZW50RGlyZWN0b3J5OiBib29sZWFuXG4gICkge1xuICAgIHRoaXMudG9rZW5pemVyID0gdG9rZW5pemVyO1xuICAgIHRoaXMuaW5jbHVkZVByZWZpeFBhdHRlcm5zID0gaW5jbHVkZVByZWZpeFBhdHRlcm5zO1xuICAgIHRoaXMuZXhjbHVkZVByZWZpeFBhdHRlcm5zID0gZXhjbHVkZVByZWZpeFBhdHRlcm5zO1xuICAgIHRoaXMub25seVVuZGVyQ3VycmVudERpcmVjdG9yeSA9IG9ubHlVbmRlckN1cnJlbnREaXJlY3Rvcnk7XG4gIH1cbn1cbiIsImltcG9ydCB0eXBlIHsgTW9kaWZpZXIgfSBmcm9tIFwib2JzaWRpYW5cIjtcblxudHlwZSBOYW1lID0gXCJOb25lXCIgfCBcIkN0cmwvQ21kK0VudGVyXCIgfCBcIkFsdCtFbnRlclwiIHwgXCJTaGlmdCtFbnRlclwiO1xuaW50ZXJmYWNlIEtleUJpbmQge1xuICBtb2RpZmllcnM6IE1vZGlmaWVyW107XG4gIGtleTogc3RyaW5nIHwgbnVsbDtcbn1cblxuZXhwb3J0IGNsYXNzIE9wZW5Tb3VyY2VGaWxlS2V5cyB7XG4gIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IF92YWx1ZXM6IE9wZW5Tb3VyY2VGaWxlS2V5c1tdID0gW107XG5cbiAgc3RhdGljIHJlYWRvbmx5IE5PTkUgPSBuZXcgT3BlblNvdXJjZUZpbGVLZXlzKFwiTm9uZVwiLCB7XG4gICAgbW9kaWZpZXJzOiBbXSxcbiAgICBrZXk6IG51bGwsXG4gIH0pO1xuICBzdGF0aWMgcmVhZG9ubHkgTU9EX0VOVEVSID0gbmV3IE9wZW5Tb3VyY2VGaWxlS2V5cyhcIkN0cmwvQ21kK0VudGVyXCIsIHtcbiAgICBtb2RpZmllcnM6IFtcIk1vZFwiXSxcbiAgICBrZXk6IFwiRW50ZXJcIixcbiAgfSk7XG4gIHN0YXRpYyByZWFkb25seSBBTFRfRU5URVIgPSBuZXcgT3BlblNvdXJjZUZpbGVLZXlzKFwiQWx0K0VudGVyXCIsIHtcbiAgICBtb2RpZmllcnM6IFtcIkFsdFwiXSxcbiAgICBrZXk6IFwiRW50ZXJcIixcbiAgfSk7XG4gIHN0YXRpYyByZWFkb25seSBTSElGVF9FTlRFUiA9IG5ldyBPcGVuU291cmNlRmlsZUtleXMoXCJTaGlmdCtFbnRlclwiLCB7XG4gICAgbW9kaWZpZXJzOiBbXCJTaGlmdFwiXSxcbiAgICBrZXk6IFwiRW50ZXJcIixcbiAgfSk7XG5cbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcihyZWFkb25seSBuYW1lOiBOYW1lLCByZWFkb25seSBrZXlCaW5kOiBLZXlCaW5kKSB7XG4gICAgT3BlblNvdXJjZUZpbGVLZXlzLl92YWx1ZXMucHVzaCh0aGlzKTtcbiAgfVxuXG4gIHN0YXRpYyBmcm9tTmFtZShuYW1lOiBzdHJpbmcpOiBPcGVuU291cmNlRmlsZUtleXMge1xuICAgIHJldHVybiBPcGVuU291cmNlRmlsZUtleXMuX3ZhbHVlcy5maW5kKCh4KSA9PiB4Lm5hbWUgPT09IG5hbWUpITtcbiAgfVxuXG4gIHN0YXRpYyB2YWx1ZXMoKTogT3BlblNvdXJjZUZpbGVLZXlzW10ge1xuICAgIHJldHVybiBPcGVuU291cmNlRmlsZUtleXMuX3ZhbHVlcztcbiAgfVxufVxuIiwiaW1wb3J0IHR5cGUgeyBXb3JkIH0gZnJvbSBcIi4uL21vZGVsL1dvcmRcIjtcbmltcG9ydCB7IGJhc2VuYW1lIH0gZnJvbSBcIi4uL3V0aWwvcGF0aFwiO1xuXG5leHBvcnQgY2xhc3MgRGVzY3JpcHRpb25PblN1Z2dlc3Rpb24ge1xuICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBfdmFsdWVzOiBEZXNjcmlwdGlvbk9uU3VnZ2VzdGlvbltdID0gW107XG5cbiAgc3RhdGljIHJlYWRvbmx5IE5PTkUgPSBuZXcgRGVzY3JpcHRpb25PblN1Z2dlc3Rpb24oXCJOb25lXCIsICgpID0+IG51bGwpO1xuICBzdGF0aWMgcmVhZG9ubHkgU0hPUlQgPSBuZXcgRGVzY3JpcHRpb25PblN1Z2dlc3Rpb24oXCJTaG9ydFwiLCAod29yZCkgPT4ge1xuICAgIGlmICghd29yZC5kZXNjcmlwdGlvbikge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiB3b3JkLnR5cGUgPT09IFwiY3VzdG9tRGljdGlvbmFyeVwiXG4gICAgICA/IHdvcmQuZGVzY3JpcHRpb25cbiAgICAgIDogYmFzZW5hbWUod29yZC5kZXNjcmlwdGlvbik7XG4gIH0pO1xuICBzdGF0aWMgcmVhZG9ubHkgRlVMTCA9IG5ldyBEZXNjcmlwdGlvbk9uU3VnZ2VzdGlvbihcbiAgICBcIkZ1bGxcIixcbiAgICAod29yZCkgPT4gd29yZC5kZXNjcmlwdGlvbiA/PyBudWxsXG4gICk7XG5cbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcihcbiAgICByZWFkb25seSBuYW1lOiBzdHJpbmcsXG4gICAgcmVhZG9ubHkgdG9EaXNwbGF5OiAod29yZDogV29yZCkgPT4gc3RyaW5nIHwgbnVsbFxuICApIHtcbiAgICBEZXNjcmlwdGlvbk9uU3VnZ2VzdGlvbi5fdmFsdWVzLnB1c2godGhpcyk7XG4gIH1cblxuICBzdGF0aWMgZnJvbU5hbWUobmFtZTogc3RyaW5nKTogRGVzY3JpcHRpb25PblN1Z2dlc3Rpb24ge1xuICAgIHJldHVybiBEZXNjcmlwdGlvbk9uU3VnZ2VzdGlvbi5fdmFsdWVzLmZpbmQoKHgpID0+IHgubmFtZSA9PT0gbmFtZSkhO1xuICB9XG5cbiAgc3RhdGljIHZhbHVlcygpOiBEZXNjcmlwdGlvbk9uU3VnZ2VzdGlvbltdIHtcbiAgICByZXR1cm4gRGVzY3JpcHRpb25PblN1Z2dlc3Rpb24uX3ZhbHVlcztcbiAgfVxufVxuIiwiaW1wb3J0IHR5cGUgeyBBcHAsIFRGaWxlIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgdHlwZSB7IFdvcmRzQnlGaXJzdExldHRlciB9IGZyb20gXCIuL3N1Z2dlc3RlclwiO1xuaW1wb3J0IHR5cGUgeyBBcHBIZWxwZXIsIEZyb250TWF0dGVyVmFsdWUgfSBmcm9tIFwiLi4vYXBwLWhlbHBlclwiO1xuaW1wb3J0IHR5cGUgeyBGcm9udE1hdHRlcldvcmQgfSBmcm9tIFwiLi4vbW9kZWwvV29yZFwiO1xuaW1wb3J0IHsgZXhjbHVkZUVtb2ppIH0gZnJvbSBcIi4uL3V0aWwvc3RyaW5nc1wiO1xuaW1wb3J0IHsgZ3JvdXBCeSwgdW5pcVdpdGggfSBmcm9tIFwiLi4vdXRpbC9jb2xsZWN0aW9uLWhlbHBlclwiO1xuXG5mdW5jdGlvbiBzeW5vbnltQWxpYXNlcyhuYW1lOiBzdHJpbmcpOiBzdHJpbmdbXSB7XG4gIGNvbnN0IGxlc3NFbW9qaVZhbHVlID0gZXhjbHVkZUVtb2ppKG5hbWUpO1xuICByZXR1cm4gbmFtZSA9PT0gbGVzc0Vtb2ppVmFsdWUgPyBbXSA6IFtsZXNzRW1vamlWYWx1ZV07XG59XG5cbmZ1bmN0aW9uIGZyb250TWF0dGVyVG9Xb3JkcyhcbiAgZmlsZTogVEZpbGUsXG4gIGtleTogc3RyaW5nLFxuICB2YWx1ZXM6IEZyb250TWF0dGVyVmFsdWVcbik6IEZyb250TWF0dGVyV29yZFtdIHtcbiAgcmV0dXJuIHZhbHVlcy5tYXAoKHgpID0+ICh7XG4gICAga2V5LFxuICAgIHZhbHVlOiB4LFxuICAgIHR5cGU6IFwiZnJvbnRNYXR0ZXJcIixcbiAgICBjcmVhdGVkUGF0aDogZmlsZS5wYXRoLFxuICAgIGFsaWFzZXM6IHN5bm9ueW1BbGlhc2VzKHgpLFxuICB9KSk7XG59XG5cbmV4cG9ydCBjbGFzcyBGcm9udE1hdHRlcldvcmRQcm92aWRlciB7XG4gIHdvcmRzOiBGcm9udE1hdHRlcldvcmRbXTtcbiAgd29yZHNCeUZpcnN0TGV0dGVyQnlLZXk6IHsgW2tleTogc3RyaW5nXTogV29yZHNCeUZpcnN0TGV0dGVyIH07XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBhcHA6IEFwcCwgcHJpdmF0ZSBhcHBIZWxwZXI6IEFwcEhlbHBlcikge31cblxuICByZWZyZXNoV29yZHMoKTogdm9pZCB7XG4gICAgdGhpcy5jbGVhcldvcmRzKCk7XG5cbiAgICBjb25zdCBhY3RpdmVGaWxlID0gdGhpcy5hcHBIZWxwZXIuZ2V0QWN0aXZlRmlsZSgpO1xuXG4gICAgY29uc3Qgd29yZHMgPSB0aGlzLmFwcC52YXVsdC5nZXRNYXJrZG93bkZpbGVzKCkuZmxhdE1hcCgoZikgPT4ge1xuICAgICAgY29uc3QgZm0gPSB0aGlzLmFwcEhlbHBlci5nZXRGcm9udE1hdHRlcihmKTtcbiAgICAgIGlmICghZm0gfHwgYWN0aXZlRmlsZT8ucGF0aCA9PT0gZi5wYXRoKSB7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIE9iamVjdC5lbnRyaWVzKGZtKVxuICAgICAgICAuZmlsdGVyKFxuICAgICAgICAgIChbX2tleSwgdmFsdWVdKSA9PlxuICAgICAgICAgICAgdmFsdWUgIT0gbnVsbCAmJlxuICAgICAgICAgICAgKHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIiB8fCB0eXBlb2YgdmFsdWVbMF0gPT09IFwic3RyaW5nXCIpXG4gICAgICAgIClcbiAgICAgICAgLmZsYXRNYXAoKFtrZXksIHZhbHVlXSkgPT4gZnJvbnRNYXR0ZXJUb1dvcmRzKGYsIGtleSwgdmFsdWUpKTtcbiAgICB9KTtcblxuICAgIHRoaXMud29yZHMgPSB1bmlxV2l0aChcbiAgICAgIHdvcmRzLFxuICAgICAgKGEsIGIpID0+IGEua2V5ID09PSBiLmtleSAmJiBhLnZhbHVlID09PSBiLnZhbHVlXG4gICAgKTtcblxuICAgIGNvbnN0IHdvcmRzQnlLZXkgPSBncm91cEJ5KHRoaXMud29yZHMsICh4KSA9PiB4LmtleSk7XG4gICAgdGhpcy53b3Jkc0J5Rmlyc3RMZXR0ZXJCeUtleSA9IE9iamVjdC5mcm9tRW50cmllcyhcbiAgICAgIE9iamVjdC5lbnRyaWVzKHdvcmRzQnlLZXkpLm1hcChcbiAgICAgICAgKFtrZXksIHdvcmRzXTogW3N0cmluZywgRnJvbnRNYXR0ZXJXb3JkW11dKSA9PiBbXG4gICAgICAgICAga2V5LFxuICAgICAgICAgIGdyb3VwQnkod29yZHMsICh3KSA9PiB3LnZhbHVlLmNoYXJBdCgwKSksXG4gICAgICAgIF1cbiAgICAgIClcbiAgICApO1xuICB9XG5cbiAgY2xlYXJXb3JkcygpOiB2b2lkIHtcbiAgICB0aGlzLndvcmRzID0gW107XG4gICAgdGhpcy53b3Jkc0J5Rmlyc3RMZXR0ZXJCeUtleSA9IHt9O1xuICB9XG5cbiAgZ2V0IHdvcmRDb3VudCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLndvcmRzLmxlbmd0aDtcbiAgfVxufVxuIiwiaW1wb3J0IHR5cGUgeyBJbmRleGVkV29yZHMgfSBmcm9tIFwiLi4vdWkvQXV0b0NvbXBsZXRlU3VnZ2VzdFwiO1xuaW1wb3J0IHsgc3VnZ2VzdFdvcmRzLCBzdWdnZXN0V29yZHNCeVBhcnRpYWxNYXRjaCB9IGZyb20gXCIuL3N1Z2dlc3RlclwiO1xuaW1wb3J0IHR5cGUgeyBXb3JkIH0gZnJvbSBcIi4uL21vZGVsL1dvcmRcIjtcbmltcG9ydCB0eXBlIHsgU2VsZWN0aW9uSGlzdG9yeVN0b3JhZ2UgfSBmcm9tIFwiLi4vc3RvcmFnZS9TZWxlY3Rpb25IaXN0b3J5U3RvcmFnZVwiO1xuXG50eXBlIE5hbWUgPSBcImluaGVyaXRcIiB8IFwicHJlZml4XCIgfCBcInBhcnRpYWxcIjtcblxudHlwZSBIYW5kbGVyID0gKFxuICBpbmRleGVkV29yZHM6IEluZGV4ZWRXb3JkcyxcbiAgcXVlcnk6IHN0cmluZyxcbiAgbWF4OiBudW1iZXIsXG4gIGZyb250TWF0dGVyOiBzdHJpbmcgfCBudWxsLFxuICBzZWxlY3Rpb25IaXN0b3J5U3RvcmFnZT86IFNlbGVjdGlvbkhpc3RvcnlTdG9yYWdlXG4pID0+IFdvcmRbXTtcblxuY29uc3QgbmV2ZXJVc2VkSGFuZGxlciA9ICguLi5fYXJnczogYW55W10pID0+IFtdO1xuXG5leHBvcnQgY2xhc3MgU3BlY2lmaWNNYXRjaFN0cmF0ZWd5IHtcbiAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgX3ZhbHVlczogU3BlY2lmaWNNYXRjaFN0cmF0ZWd5W10gPSBbXTtcblxuICBzdGF0aWMgcmVhZG9ubHkgSU5IRVJJVCA9IG5ldyBTcGVjaWZpY01hdGNoU3RyYXRlZ3koXG4gICAgXCJpbmhlcml0XCIsXG4gICAgbmV2ZXJVc2VkSGFuZGxlclxuICApO1xuICBzdGF0aWMgcmVhZG9ubHkgUFJFRklYID0gbmV3IFNwZWNpZmljTWF0Y2hTdHJhdGVneShcInByZWZpeFwiLCBzdWdnZXN0V29yZHMpO1xuICBzdGF0aWMgcmVhZG9ubHkgUEFSVElBTCA9IG5ldyBTcGVjaWZpY01hdGNoU3RyYXRlZ3koXG4gICAgXCJwYXJ0aWFsXCIsXG4gICAgc3VnZ2VzdFdvcmRzQnlQYXJ0aWFsTWF0Y2hcbiAgKTtcblxuICBwcml2YXRlIGNvbnN0cnVjdG9yKHJlYWRvbmx5IG5hbWU6IE5hbWUsIHJlYWRvbmx5IGhhbmRsZXI6IEhhbmRsZXIpIHtcbiAgICBTcGVjaWZpY01hdGNoU3RyYXRlZ3kuX3ZhbHVlcy5wdXNoKHRoaXMpO1xuICB9XG5cbiAgc3RhdGljIGZyb21OYW1lKG5hbWU6IHN0cmluZyk6IFNwZWNpZmljTWF0Y2hTdHJhdGVneSB7XG4gICAgcmV0dXJuIFNwZWNpZmljTWF0Y2hTdHJhdGVneS5fdmFsdWVzLmZpbmQoKHgpID0+IHgubmFtZSA9PT0gbmFtZSkhO1xuICB9XG5cbiAgc3RhdGljIHZhbHVlcygpOiBTcGVjaWZpY01hdGNoU3RyYXRlZ3lbXSB7XG4gICAgcmV0dXJuIFNwZWNpZmljTWF0Y2hTdHJhdGVneS5fdmFsdWVzO1xuICB9XG59XG4iLCJpbXBvcnQgdHlwZSB7IFdvcmQgfSBmcm9tIFwiLi4vbW9kZWwvV29yZFwiO1xuaW1wb3J0IHR5cGUgeyBQYXJ0aWFsUmVxdWlyZWQgfSBmcm9tIFwiLi4vdHlwZXNcIjtcblxuZXhwb3J0IHR5cGUgSGl0V29yZCA9IFBhcnRpYWxSZXF1aXJlZDxXb3JkLCBcImhpdFwiPjtcbmV4cG9ydCB0eXBlIFNlbGVjdGlvbkhpc3RvcnkgPSB7XG4gIGNvdW50OiBudW1iZXI7XG4gIGxhc3RVcGRhdGVkOiBudW1iZXI7XG59O1xuXG5leHBvcnQgdHlwZSBTZWxlY3Rpb25IaXN0b3J5VHJlZSA9IHtcbiAgW2hpdDogc3RyaW5nXToge1xuICAgIFt2YWx1ZTogc3RyaW5nXToge1xuICAgICAgW3R5cGU6IHN0cmluZ106IFNlbGVjdGlvbkhpc3Rvcnk7XG4gICAgfTtcbiAgfTtcbn07XG5cbmNvbnN0IFNFQyA9IDEwMDA7XG5jb25zdCBNSU4gPSBTRUMgKiA2MDtcbmNvbnN0IEhPVVIgPSBNSU4gKiA2MDtcbmNvbnN0IERBWSA9IEhPVVIgKiAyNDtcbmNvbnN0IFdFRUsgPSBEQVkgKiA3O1xuXG5mdW5jdGlvbiBjYWxjU2NvcmUoaGlzdG9yeTogU2VsZWN0aW9uSGlzdG9yeSB8IHVuZGVmaW5lZCk6IG51bWJlciB7XG4gIGlmICghaGlzdG9yeSkge1xuICAgIHJldHVybiAwO1xuICB9XG5cbiAgY29uc3QgYmVoaW5kID0gRGF0ZS5ub3coKSAtIGhpc3RvcnkubGFzdFVwZGF0ZWQ7XG5cbiAgLy8gbm9pbnNwZWN0aW9uIElmU3RhdGVtZW50V2l0aFRvb01hbnlCcmFuY2hlc0pTXG4gIGlmIChiZWhpbmQgPCBNSU4pIHtcbiAgICByZXR1cm4gOCAqIGhpc3RvcnkuY291bnQ7XG4gIH0gZWxzZSBpZiAoYmVoaW5kIDwgSE9VUikge1xuICAgIHJldHVybiA0ICogaGlzdG9yeS5jb3VudDtcbiAgfSBlbHNlIGlmIChiZWhpbmQgPCBEQVkpIHtcbiAgICByZXR1cm4gMiAqIGhpc3RvcnkuY291bnQ7XG4gIH0gZWxzZSBpZiAoYmVoaW5kIDwgV0VFSykge1xuICAgIHJldHVybiAwLjUgKiBoaXN0b3J5LmNvdW50O1xuICB9IGVsc2Uge1xuICAgIHJldHVybiAwLjI1ICogaGlzdG9yeS5jb3VudDtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgU2VsZWN0aW9uSGlzdG9yeVN0b3JhZ2Uge1xuICBkYXRhOiBTZWxlY3Rpb25IaXN0b3J5VHJlZTtcbiAgdmVyc2lvbjogbnVtYmVyO1xuICBwZXJzaXN0ZWRWZXJzaW9uOiBudW1iZXI7XG5cbiAgY29uc3RydWN0b3IoZGF0YTogU2VsZWN0aW9uSGlzdG9yeVRyZWUgPSB7fSkge1xuICAgIHRoaXMuZGF0YSA9IGRhdGE7XG5cbiAgICBjb25zdCBub3cgPSBEYXRlLm5vdygpO1xuICAgIHRoaXMudmVyc2lvbiA9IG5vdztcbiAgICB0aGlzLnBlcnNpc3RlZFZlcnNpb24gPSBub3c7XG4gIH1cblxuICAvLyBub2luc3BlY3Rpb24gRnVuY3Rpb25XaXRoTXVsdGlwbGVMb29wc0pTXG4gIHB1cmdlKCkge1xuICAgIGZvciAoY29uc3QgaGl0IG9mIE9iamVjdC5rZXlzKHRoaXMuZGF0YSkpIHtcbiAgICAgIGZvciAoY29uc3QgdmFsdWUgb2YgT2JqZWN0LmtleXModGhpcy5kYXRhW2hpdF0pKSB7XG4gICAgICAgIGZvciAoY29uc3Qga2luZCBvZiBPYmplY3Qua2V5cyh0aGlzLmRhdGFbaGl0XVt2YWx1ZV0pKSB7XG4gICAgICAgICAgaWYgKERhdGUubm93KCkgLSB0aGlzLmRhdGFbaGl0XVt2YWx1ZV1ba2luZF0ubGFzdFVwZGF0ZWQgPiA0ICogV0VFSykge1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMuZGF0YVtoaXRdW3ZhbHVlXVtraW5kXTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoT2JqZWN0LmlzRW1wdHkodGhpcy5kYXRhW2hpdF1bdmFsdWVdKSkge1xuICAgICAgICAgIGRlbGV0ZSB0aGlzLmRhdGFbaGl0XVt2YWx1ZV07XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKE9iamVjdC5pc0VtcHR5KHRoaXMuZGF0YVtoaXRdKSkge1xuICAgICAgICBkZWxldGUgdGhpcy5kYXRhW2hpdF07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZ2V0U2VsZWN0aW9uSGlzdG9yeSh3b3JkOiBIaXRXb3JkKTogU2VsZWN0aW9uSGlzdG9yeSB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHRoaXMuZGF0YVt3b3JkLmhpdF0/Llt3b3JkLnZhbHVlXT8uW3dvcmQudHlwZV07XG4gIH1cblxuICBpbmNyZW1lbnQod29yZDogSGl0V29yZCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5kYXRhW3dvcmQuaGl0XSkge1xuICAgICAgdGhpcy5kYXRhW3dvcmQuaGl0XSA9IHt9O1xuICAgIH1cbiAgICBpZiAoIXRoaXMuZGF0YVt3b3JkLmhpdF1bd29yZC52YWx1ZV0pIHtcbiAgICAgIHRoaXMuZGF0YVt3b3JkLmhpdF1bd29yZC52YWx1ZV0gPSB7fTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5kYXRhW3dvcmQuaGl0XVt3b3JkLnZhbHVlXVt3b3JkLnR5cGVdKSB7XG4gICAgICB0aGlzLmRhdGFbd29yZC5oaXRdW3dvcmQudmFsdWVdW3dvcmQudHlwZV0gPSB7XG4gICAgICAgIGNvdW50OiB0aGlzLmRhdGFbd29yZC5oaXRdW3dvcmQudmFsdWVdW3dvcmQudHlwZV0uY291bnQgKyAxLFxuICAgICAgICBsYXN0VXBkYXRlZDogRGF0ZS5ub3coKSxcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZGF0YVt3b3JkLmhpdF1bd29yZC52YWx1ZV1bd29yZC50eXBlXSA9IHtcbiAgICAgICAgY291bnQ6IDEsXG4gICAgICAgIGxhc3RVcGRhdGVkOiBEYXRlLm5vdygpLFxuICAgICAgfTtcbiAgICB9XG5cbiAgICB0aGlzLnZlcnNpb24gPSBEYXRlLm5vdygpO1xuICB9XG5cbiAgY29tcGFyZSh3MTogSGl0V29yZCwgdzI6IEhpdFdvcmQpOiAtMSB8IDAgfCAxIHtcbiAgICBjb25zdCBzY29yZTEgPSBjYWxjU2NvcmUodGhpcy5nZXRTZWxlY3Rpb25IaXN0b3J5KHcxKSk7XG4gICAgY29uc3Qgc2NvcmUyID0gY2FsY1Njb3JlKHRoaXMuZ2V0U2VsZWN0aW9uSGlzdG9yeSh3MikpO1xuXG4gICAgaWYgKHNjb3JlMSA9PT0gc2NvcmUyKSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICByZXR1cm4gc2NvcmUxID4gc2NvcmUyID8gLTEgOiAxO1xuICB9XG5cbiAgZ2V0IHNob3VsZFBlcnNpc3QoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMudmVyc2lvbiA+IHRoaXMucGVyc2lzdGVkVmVyc2lvbjtcbiAgfVxuXG4gIHN5bmNQZXJzaXN0VmVyc2lvbigpOiB2b2lkIHtcbiAgICB0aGlzLnBlcnNpc3RlZFZlcnNpb24gPSB0aGlzLnZlcnNpb247XG4gIH1cbn1cbiIsImltcG9ydCB7XG4gIEFwcCxcbiAgZGVib3VuY2UsXG4gIHR5cGUgRGVib3VuY2VyLFxuICBFZGl0b3IsXG4gIHR5cGUgRWRpdG9yUG9zaXRpb24sXG4gIEVkaXRvclN1Z2dlc3QsXG4gIHR5cGUgRWRpdG9yU3VnZ2VzdENvbnRleHQsXG4gIHR5cGUgRWRpdG9yU3VnZ2VzdFRyaWdnZXJJbmZvLFxuICB0eXBlIEV2ZW50UmVmLFxuICB0eXBlIEtleW1hcEV2ZW50SGFuZGxlcixcbiAgTm90aWNlLFxuICBTY29wZSxcbiAgVEZpbGUsXG59IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHsgY3JlYXRlVG9rZW5pemVyLCB0eXBlIFRva2VuaXplciB9IGZyb20gXCIuLi90b2tlbml6ZXIvdG9rZW5pemVyXCI7XG5pbXBvcnQgeyBUb2tlbml6ZVN0cmF0ZWd5IH0gZnJvbSBcIi4uL3Rva2VuaXplci9Ub2tlbml6ZVN0cmF0ZWd5XCI7XG5pbXBvcnQgdHlwZSB7IFNldHRpbmdzIH0gZnJvbSBcIi4uL3NldHRpbmcvc2V0dGluZ3NcIjtcbmltcG9ydCB7IEFwcEhlbHBlciB9IGZyb20gXCIuLi9hcHAtaGVscGVyXCI7XG5pbXBvcnQgdHlwZSB7IFdvcmRzQnlGaXJzdExldHRlciB9IGZyb20gXCIuLi9wcm92aWRlci9zdWdnZXN0ZXJcIjtcbmltcG9ydCB7IEN1c3RvbURpY3Rpb25hcnlXb3JkUHJvdmlkZXIgfSBmcm9tIFwiLi4vcHJvdmlkZXIvQ3VzdG9tRGljdGlvbmFyeVdvcmRQcm92aWRlclwiO1xuaW1wb3J0IHsgQ3VycmVudEZpbGVXb3JkUHJvdmlkZXIgfSBmcm9tIFwiLi4vcHJvdmlkZXIvQ3VycmVudEZpbGVXb3JkUHJvdmlkZXJcIjtcbmltcG9ydCB7IEludGVybmFsTGlua1dvcmRQcm92aWRlciB9IGZyb20gXCIuLi9wcm92aWRlci9JbnRlcm5hbExpbmtXb3JkUHJvdmlkZXJcIjtcbmltcG9ydCB7IE1hdGNoU3RyYXRlZ3kgfSBmcm9tIFwiLi4vcHJvdmlkZXIvTWF0Y2hTdHJhdGVneVwiO1xuaW1wb3J0IHsgQ3ljbGVUaHJvdWdoU3VnZ2VzdGlvbnNLZXlzIH0gZnJvbSBcIi4uL29wdGlvbi9DeWNsZVRocm91Z2hTdWdnZXN0aW9uc0tleXNcIjtcbmltcG9ydCB7IENvbHVtbkRlbGltaXRlciB9IGZyb20gXCIuLi9vcHRpb24vQ29sdW1uRGVsaW1pdGVyXCI7XG5pbXBvcnQgeyBTZWxlY3RTdWdnZXN0aW9uS2V5IH0gZnJvbSBcIi4uL29wdGlvbi9TZWxlY3RTdWdnZXN0aW9uS2V5XCI7XG5pbXBvcnQgeyB1bmlxV2l0aCB9IGZyb20gXCIuLi91dGlsL2NvbGxlY3Rpb24taGVscGVyXCI7XG5pbXBvcnQgeyBDdXJyZW50VmF1bHRXb3JkUHJvdmlkZXIgfSBmcm9tIFwiLi4vcHJvdmlkZXIvQ3VycmVudFZhdWx0V29yZFByb3ZpZGVyXCI7XG5pbXBvcnQgdHlwZSB7IFByb3ZpZGVyU3RhdHVzQmFyIH0gZnJvbSBcIi4vUHJvdmlkZXJTdGF0dXNCYXJcIjtcbmltcG9ydCB0eXBlIHsgV29yZCB9IGZyb20gXCIuLi9tb2RlbC9Xb3JkXCI7XG5pbXBvcnQgeyBPcGVuU291cmNlRmlsZUtleXMgfSBmcm9tIFwiLi4vb3B0aW9uL09wZW5Tb3VyY2VGaWxlS2V5c1wiO1xuaW1wb3J0IHsgRGVzY3JpcHRpb25PblN1Z2dlc3Rpb24gfSBmcm9tIFwiLi4vb3B0aW9uL0Rlc2NyaXB0aW9uT25TdWdnZXN0aW9uXCI7XG5pbXBvcnQgeyBGcm9udE1hdHRlcldvcmRQcm92aWRlciB9IGZyb20gXCIuLi9wcm92aWRlci9Gcm9udE1hdHRlcldvcmRQcm92aWRlclwiO1xuaW1wb3J0IHsgU3BlY2lmaWNNYXRjaFN0cmF0ZWd5IH0gZnJvbSBcIi4uL3Byb3ZpZGVyL1NwZWNpZmljTWF0Y2hTdHJhdGVneVwiO1xuaW1wb3J0IHtcbiAgdHlwZSBIaXRXb3JkLFxuICBTZWxlY3Rpb25IaXN0b3J5U3RvcmFnZSxcbn0gZnJvbSBcIi4uL3N0b3JhZ2UvU2VsZWN0aW9uSGlzdG9yeVN0b3JhZ2VcIjtcblxuZnVuY3Rpb24gYnVpbGRMb2dNZXNzYWdlKG1lc3NhZ2U6IHN0cmluZywgbXNlYzogbnVtYmVyKSB7XG4gIHJldHVybiBgJHttZXNzYWdlfTogJHtNYXRoLnJvdW5kKG1zZWMpfVttc11gO1xufVxuXG5leHBvcnQgdHlwZSBJbmRleGVkV29yZHMgPSB7XG4gIGN1cnJlbnRGaWxlOiBXb3Jkc0J5Rmlyc3RMZXR0ZXI7XG4gIGN1cnJlbnRWYXVsdDogV29yZHNCeUZpcnN0TGV0dGVyO1xuICBjdXN0b21EaWN0aW9uYXJ5OiBXb3Jkc0J5Rmlyc3RMZXR0ZXI7XG4gIGludGVybmFsTGluazogV29yZHNCeUZpcnN0TGV0dGVyO1xuICBmcm9udE1hdHRlcjogeyBba2V5OiBzdHJpbmddOiBXb3Jkc0J5Rmlyc3RMZXR0ZXIgfTtcbn07XG5cbi8vIFRoaXMgaXMgYW4gdW5zYWZlIGNvZGUuLiEhXG5pbnRlcmZhY2UgVW5zYWZlRWRpdG9yU3VnZ2VzdEludGVyZmFjZSB7XG4gIHNjb3BlOiBTY29wZSAmIHsga2V5czogKEtleW1hcEV2ZW50SGFuZGxlciAmIHsgZnVuYzogQ2FsbGFibGVGdW5jdGlvbiB9KVtdIH07XG4gIHN1Z2dlc3Rpb25zOiB7XG4gICAgc2VsZWN0ZWRJdGVtOiBudW1iZXI7XG4gICAgdXNlU2VsZWN0ZWRJdGVtKGV2OiBQYXJ0aWFsPEtleWJvYXJkRXZlbnQ+KTogdm9pZDtcbiAgICBzZXRTZWxlY3RlZEl0ZW0oc2VsZWN0ZWQ6IG51bWJlciwgc2Nyb2xsOiBib29sZWFuKTogdm9pZDtcbiAgICB2YWx1ZXM6IFdvcmRbXTtcbiAgfTtcbiAgaXNPcGVuOiBib29sZWFuO1xufVxuXG5leHBvcnQgY2xhc3MgQXV0b0NvbXBsZXRlU3VnZ2VzdFxuICBleHRlbmRzIEVkaXRvclN1Z2dlc3Q8V29yZD5cbiAgaW1wbGVtZW50cyBVbnNhZmVFZGl0b3JTdWdnZXN0SW50ZXJmYWNlXG57XG4gIGFwcDogQXBwO1xuICBzZXR0aW5nczogU2V0dGluZ3M7XG4gIGFwcEhlbHBlcjogQXBwSGVscGVyO1xuICBzdGF0dXNCYXI6IFByb3ZpZGVyU3RhdHVzQmFyO1xuXG4gIGN1cnJlbnRGaWxlV29yZFByb3ZpZGVyOiBDdXJyZW50RmlsZVdvcmRQcm92aWRlcjtcbiAgY3VycmVudFZhdWx0V29yZFByb3ZpZGVyOiBDdXJyZW50VmF1bHRXb3JkUHJvdmlkZXI7XG4gIGN1c3RvbURpY3Rpb25hcnlXb3JkUHJvdmlkZXI6IEN1c3RvbURpY3Rpb25hcnlXb3JkUHJvdmlkZXI7XG4gIGludGVybmFsTGlua1dvcmRQcm92aWRlcjogSW50ZXJuYWxMaW5rV29yZFByb3ZpZGVyO1xuICBmcm9udE1hdHRlcldvcmRQcm92aWRlcjogRnJvbnRNYXR0ZXJXb3JkUHJvdmlkZXI7XG4gIHNlbGVjdGlvbkhpc3RvcnlTdG9yYWdlOiBTZWxlY3Rpb25IaXN0b3J5U3RvcmFnZSB8IHVuZGVmaW5lZDtcblxuICB0b2tlbml6ZXI6IFRva2VuaXplcjtcbiAgZGVib3VuY2VHZXRTdWdnZXN0aW9uczogRGVib3VuY2VyPFxuICAgIFtFZGl0b3JTdWdnZXN0Q29udGV4dCwgKHRva2VuczogV29yZFtdKSA9PiB2b2lkXVxuICA+O1xuICBkZWJvdW5jZUNsb3NlOiBEZWJvdW5jZXI8W10+O1xuXG4gIHJ1bk1hbnVhbGx5OiBib29sZWFuO1xuICBkZWNsYXJlIGlzT3BlbjogYm9vbGVhbjtcblxuICBjb250ZXh0U3RhcnRDaDogbnVtYmVyO1xuXG4gIHByZXZpb3VzQ3VycmVudExpbmUgPSBcIlwiO1xuXG4gIC8vIHVuc2FmZSEhXG4gIHNjb3BlOiBVbnNhZmVFZGl0b3JTdWdnZXN0SW50ZXJmYWNlW1wic2NvcGVcIl07XG4gIHN1Z2dlc3Rpb25zOiBVbnNhZmVFZGl0b3JTdWdnZXN0SW50ZXJmYWNlW1wic3VnZ2VzdGlvbnNcIl07XG5cbiAga2V5bWFwRXZlbnRIYW5kbGVyOiBLZXltYXBFdmVudEhhbmRsZXJbXSA9IFtdO1xuICBtb2RpZnlFdmVudFJlZjogRXZlbnRSZWY7XG4gIGFjdGl2ZUxlYWZDaGFuZ2VSZWY6IEV2ZW50UmVmO1xuXG4gIHByaXZhdGUgY29uc3RydWN0b3IoYXBwOiBBcHAsIHN0YXR1c0JhcjogUHJvdmlkZXJTdGF0dXNCYXIpIHtcbiAgICBzdXBlcihhcHApO1xuICAgIHRoaXMuYXBwSGVscGVyID0gbmV3IEFwcEhlbHBlcihhcHApO1xuICAgIHRoaXMuc3RhdHVzQmFyID0gc3RhdHVzQmFyO1xuICB9XG5cbiAgdHJpZ2dlckNvbXBsZXRlKCkge1xuICAgIGNvbnN0IGVkaXRvciA9IHRoaXMuYXBwSGVscGVyLmdldEN1cnJlbnRFZGl0b3IoKTtcbiAgICBjb25zdCBhY3RpdmVGaWxlID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKTtcbiAgICBpZiAoIWVkaXRvciB8fCAhYWN0aXZlRmlsZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFhYWDogVW5zYWZlXG4gICAgdGhpcy5ydW5NYW51YWxseSA9IHRydWU7XG4gICAgKHRoaXMgYXMgYW55KS50cmlnZ2VyKGVkaXRvciwgYWN0aXZlRmlsZSwgdHJ1ZSk7XG4gIH1cblxuICBzdGF0aWMgYXN5bmMgbmV3KFxuICAgIGFwcDogQXBwLFxuICAgIHNldHRpbmdzOiBTZXR0aW5ncyxcbiAgICBzdGF0dXNCYXI6IFByb3ZpZGVyU3RhdHVzQmFyLFxuICAgIG9uUGVyc2lzdFNlbGVjdGlvbkhpc3Rvcnk6ICgpID0+IHZvaWRcbiAgKTogUHJvbWlzZTxBdXRvQ29tcGxldGVTdWdnZXN0PiB7XG4gICAgY29uc3QgaW5zID0gbmV3IEF1dG9Db21wbGV0ZVN1Z2dlc3QoYXBwLCBzdGF0dXNCYXIpO1xuXG4gICAgaW5zLmN1cnJlbnRGaWxlV29yZFByb3ZpZGVyID0gbmV3IEN1cnJlbnRGaWxlV29yZFByb3ZpZGVyKFxuICAgICAgaW5zLmFwcCxcbiAgICAgIGlucy5hcHBIZWxwZXJcbiAgICApO1xuICAgIGlucy5jdXJyZW50VmF1bHRXb3JkUHJvdmlkZXIgPSBuZXcgQ3VycmVudFZhdWx0V29yZFByb3ZpZGVyKFxuICAgICAgaW5zLmFwcCxcbiAgICAgIGlucy5hcHBIZWxwZXJcbiAgICApO1xuICAgIGlucy5jdXN0b21EaWN0aW9uYXJ5V29yZFByb3ZpZGVyID0gbmV3IEN1c3RvbURpY3Rpb25hcnlXb3JkUHJvdmlkZXIoXG4gICAgICBpbnMuYXBwLFxuICAgICAgaW5zLmFwcEhlbHBlclxuICAgICk7XG4gICAgaW5zLmludGVybmFsTGlua1dvcmRQcm92aWRlciA9IG5ldyBJbnRlcm5hbExpbmtXb3JkUHJvdmlkZXIoXG4gICAgICBpbnMuYXBwLFxuICAgICAgaW5zLmFwcEhlbHBlclxuICAgICk7XG4gICAgaW5zLmZyb250TWF0dGVyV29yZFByb3ZpZGVyID0gbmV3IEZyb250TWF0dGVyV29yZFByb3ZpZGVyKFxuICAgICAgaW5zLmFwcCxcbiAgICAgIGlucy5hcHBIZWxwZXJcbiAgICApO1xuXG4gICAgaW5zLnNlbGVjdGlvbkhpc3RvcnlTdG9yYWdlID0gbmV3IFNlbGVjdGlvbkhpc3RvcnlTdG9yYWdlKFxuICAgICAgc2V0dGluZ3Muc2VsZWN0aW9uSGlzdG9yeVRyZWVcbiAgICApO1xuICAgIGlucy5zZWxlY3Rpb25IaXN0b3J5U3RvcmFnZS5wdXJnZSgpO1xuXG4gICAgYXdhaXQgaW5zLnVwZGF0ZVNldHRpbmdzKHNldHRpbmdzKTtcblxuICAgIGlucy5tb2RpZnlFdmVudFJlZiA9IGFwcC52YXVsdC5vbihcIm1vZGlmeVwiLCBhc3luYyAoXykgPT4ge1xuICAgICAgYXdhaXQgaW5zLnJlZnJlc2hDdXJyZW50RmlsZVRva2VucygpO1xuICAgICAgaWYgKGlucy5zZWxlY3Rpb25IaXN0b3J5U3RvcmFnZT8uc2hvdWxkUGVyc2lzdCkge1xuICAgICAgICBpbnMuc2V0dGluZ3Muc2VsZWN0aW9uSGlzdG9yeVRyZWUgPSBpbnMuc2VsZWN0aW9uSGlzdG9yeVN0b3JhZ2UuZGF0YTtcbiAgICAgICAgaW5zLnNlbGVjdGlvbkhpc3RvcnlTdG9yYWdlLnN5bmNQZXJzaXN0VmVyc2lvbigpO1xuICAgICAgICBvblBlcnNpc3RTZWxlY3Rpb25IaXN0b3J5KCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaW5zLmFjdGl2ZUxlYWZDaGFuZ2VSZWYgPSBhcHAud29ya3NwYWNlLm9uKFxuICAgICAgXCJhY3RpdmUtbGVhZi1jaGFuZ2VcIixcbiAgICAgIGFzeW5jIChfKSA9PiB7XG4gICAgICAgIGF3YWl0IGlucy5yZWZyZXNoQ3VycmVudEZpbGVUb2tlbnMoKTtcbiAgICAgICAgaW5zLnJlZnJlc2hJbnRlcm5hbExpbmtUb2tlbnMoKTtcbiAgICAgICAgaW5zLnJlZnJlc2hGcm9udE1hdHRlclRva2VucygpO1xuICAgICAgfVxuICAgICk7XG4gICAgLy8gQXZvaWQgcmVmZXJyaW5nIHRvIGluY29ycmVjdCBjYWNoZVxuICAgIGNvbnN0IGNhY2hlUmVzb2x2ZWRSZWYgPSBhcHAubWV0YWRhdGFDYWNoZS5vbihcInJlc29sdmVkXCIsIGFzeW5jICgpID0+IHtcbiAgICAgIGlucy5yZWZyZXNoSW50ZXJuYWxMaW5rVG9rZW5zKCk7XG4gICAgICBpbnMucmVmcmVzaEZyb250TWF0dGVyVG9rZW5zKCk7XG4gICAgICAvLyBub2luc3BlY3Rpb24gRVM2TWlzc2luZ0F3YWl0XG4gICAgICBpbnMucmVmcmVzaEN1c3RvbURpY3Rpb25hcnlUb2tlbnMoKTtcbiAgICAgIC8vIG5vaW5zcGVjdGlvbiBFUzZNaXNzaW5nQXdhaXRcbiAgICAgIGlucy5yZWZyZXNoQ3VycmVudFZhdWx0VG9rZW5zKCk7XG5cbiAgICAgIGlucy5hcHAubWV0YWRhdGFDYWNoZS5vZmZyZWYoY2FjaGVSZXNvbHZlZFJlZik7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gaW5zO1xuICB9XG5cbiAgcHJlZGljdGFibGVDb21wbGV0ZSgpIHtcbiAgICBjb25zdCBlZGl0b3IgPSB0aGlzLmFwcEhlbHBlci5nZXRDdXJyZW50RWRpdG9yKCk7XG4gICAgaWYgKCFlZGl0b3IpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBjdXJzb3IgPSBlZGl0b3IuZ2V0Q3Vyc29yKCk7XG4gICAgY29uc3QgY3VycmVudFRva2VuID0gdGhpcy50b2tlbml6ZXJcbiAgICAgIC50b2tlbml6ZShlZGl0b3IuZ2V0TGluZShjdXJzb3IubGluZSkuc2xpY2UoMCwgY3Vyc29yLmNoKSlcbiAgICAgIC5sYXN0KCk7XG4gICAgaWYgKCFjdXJyZW50VG9rZW4pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgc3VnZ2VzdGlvbiA9IHRoaXMudG9rZW5pemVyXG4gICAgICAudG9rZW5pemUoXG4gICAgICAgIGVkaXRvci5nZXRSYW5nZSh7IGxpbmU6IE1hdGgubWF4KGN1cnNvci5saW5lIC0gNTAsIDApLCBjaDogMCB9LCBjdXJzb3IpXG4gICAgICApXG4gICAgICAucmV2ZXJzZSgpXG4gICAgICAuc2xpY2UoMSlcbiAgICAgIC5maW5kKCh4KSA9PiB4LnN0YXJ0c1dpdGgoY3VycmVudFRva2VuKSk7XG4gICAgaWYgKCFzdWdnZXN0aW9uKSB7XG4gICAgICBzdWdnZXN0aW9uID0gdGhpcy50b2tlbml6ZXJcbiAgICAgICAgLnRva2VuaXplKFxuICAgICAgICAgIGVkaXRvci5nZXRSYW5nZShjdXJzb3IsIHtcbiAgICAgICAgICAgIGxpbmU6IE1hdGgubWluKGN1cnNvci5saW5lICsgNTAsIGVkaXRvci5saW5lQ291bnQoKSAtIDEpLFxuICAgICAgICAgICAgY2g6IDAsXG4gICAgICAgICAgfSlcbiAgICAgICAgKVxuICAgICAgICAuZmluZCgoeCkgPT4geC5zdGFydHNXaXRoKGN1cnJlbnRUb2tlbikpO1xuICAgIH1cbiAgICBpZiAoIXN1Z2dlc3Rpb24pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBlZGl0b3IucmVwbGFjZVJhbmdlKFxuICAgICAgc3VnZ2VzdGlvbixcbiAgICAgIHsgbGluZTogY3Vyc29yLmxpbmUsIGNoOiBjdXJzb3IuY2ggLSBjdXJyZW50VG9rZW4ubGVuZ3RoIH0sXG4gICAgICB7IGxpbmU6IGN1cnNvci5saW5lLCBjaDogY3Vyc29yLmNoIH1cbiAgICApO1xuXG4gICAgdGhpcy5jbG9zZSgpO1xuICAgIHRoaXMuZGVib3VuY2VDbG9zZSgpO1xuICB9XG5cbiAgdW5yZWdpc3RlcigpIHtcbiAgICB0aGlzLmFwcC52YXVsdC5vZmZyZWYodGhpcy5tb2RpZnlFdmVudFJlZik7XG4gICAgdGhpcy5hcHAud29ya3NwYWNlLm9mZnJlZih0aGlzLmFjdGl2ZUxlYWZDaGFuZ2VSZWYpO1xuICB9XG5cbiAgLy8gc2V0dGluZ3MgZ2V0dGVyc1xuICBnZXQgdG9rZW5pemVyU3RyYXRlZ3koKTogVG9rZW5pemVTdHJhdGVneSB7XG4gICAgcmV0dXJuIFRva2VuaXplU3RyYXRlZ3kuZnJvbU5hbWUodGhpcy5zZXR0aW5ncy5zdHJhdGVneSk7XG4gIH1cblxuICBnZXQgbWF0Y2hTdHJhdGVneSgpOiBNYXRjaFN0cmF0ZWd5IHtcbiAgICByZXR1cm4gTWF0Y2hTdHJhdGVneS5mcm9tTmFtZSh0aGlzLnNldHRpbmdzLm1hdGNoU3RyYXRlZ3kpO1xuICB9XG5cbiAgZ2V0IGZyb250TWF0dGVyQ29tcGxlbWVudFN0cmF0ZWd5KCk6IFNwZWNpZmljTWF0Y2hTdHJhdGVneSB7XG4gICAgcmV0dXJuIFNwZWNpZmljTWF0Y2hTdHJhdGVneS5mcm9tTmFtZShcbiAgICAgIHRoaXMuc2V0dGluZ3MuZnJvbnRNYXR0ZXJDb21wbGVtZW50TWF0Y2hTdHJhdGVneVxuICAgICk7XG4gIH1cblxuICBnZXQgbWluTnVtYmVyVHJpZ2dlcmVkKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIChcbiAgICAgIHRoaXMuc2V0dGluZ3MubWluTnVtYmVyT2ZDaGFyYWN0ZXJzVHJpZ2dlcmVkIHx8XG4gICAgICB0aGlzLnRva2VuaXplclN0cmF0ZWd5LnRyaWdnZXJUaHJlc2hvbGRcbiAgICApO1xuICB9XG5cbiAgZ2V0IGRlc2NyaXB0aW9uT25TdWdnZXN0aW9uKCk6IERlc2NyaXB0aW9uT25TdWdnZXN0aW9uIHtcbiAgICByZXR1cm4gRGVzY3JpcHRpb25PblN1Z2dlc3Rpb24uZnJvbU5hbWUoXG4gICAgICB0aGlzLnNldHRpbmdzLmRlc2NyaXB0aW9uT25TdWdnZXN0aW9uXG4gICAgKTtcbiAgfVxuXG4gIGdldCBleGNsdWRlSW50ZXJuYWxMaW5rUHJlZml4UGF0aFBhdHRlcm5zKCk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gdGhpcy5zZXR0aW5ncy5leGNsdWRlSW50ZXJuYWxMaW5rUGF0aFByZWZpeFBhdHRlcm5zXG4gICAgICAuc3BsaXQoXCJcXG5cIilcbiAgICAgIC5maWx0ZXIoKHgpID0+IHgpO1xuICB9XG5cbiAgLy8gLS0tIGVuZCAtLS1cblxuICBnZXQgaW5kZXhlZFdvcmRzKCk6IEluZGV4ZWRXb3JkcyB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGN1cnJlbnRGaWxlOiB0aGlzLmN1cnJlbnRGaWxlV29yZFByb3ZpZGVyLndvcmRzQnlGaXJzdExldHRlcixcbiAgICAgIGN1cnJlbnRWYXVsdDogdGhpcy5jdXJyZW50VmF1bHRXb3JkUHJvdmlkZXIud29yZHNCeUZpcnN0TGV0dGVyLFxuICAgICAgY3VzdG9tRGljdGlvbmFyeTogdGhpcy5jdXN0b21EaWN0aW9uYXJ5V29yZFByb3ZpZGVyLndvcmRzQnlGaXJzdExldHRlcixcbiAgICAgIGludGVybmFsTGluazogdGhpcy5pbnRlcm5hbExpbmtXb3JkUHJvdmlkZXIud29yZHNCeUZpcnN0TGV0dGVyLFxuICAgICAgZnJvbnRNYXR0ZXI6IHRoaXMuZnJvbnRNYXR0ZXJXb3JkUHJvdmlkZXIud29yZHNCeUZpcnN0TGV0dGVyQnlLZXksXG4gICAgfTtcbiAgfVxuXG4gIGFzeW5jIHVwZGF0ZVNldHRpbmdzKHNldHRpbmdzOiBTZXR0aW5ncykge1xuICAgIHRoaXMuc2V0dGluZ3MgPSBzZXR0aW5ncztcblxuICAgIHRoaXMuc3RhdHVzQmFyLnNldE1hdGNoU3RyYXRlZ3kodGhpcy5tYXRjaFN0cmF0ZWd5KTtcblxuICAgIHRoaXMudG9rZW5pemVyID0gY3JlYXRlVG9rZW5pemVyKHRoaXMudG9rZW5pemVyU3RyYXRlZ3kpO1xuICAgIHRoaXMuY3VycmVudEZpbGVXb3JkUHJvdmlkZXIuc2V0U2V0dGluZ3ModGhpcy50b2tlbml6ZXIpO1xuICAgIHRoaXMuY3VycmVudFZhdWx0V29yZFByb3ZpZGVyLnNldFNldHRpbmdzKFxuICAgICAgdGhpcy50b2tlbml6ZXIsXG4gICAgICBzZXR0aW5ncy5pbmNsdWRlQ3VycmVudFZhdWx0UGF0aFByZWZpeFBhdHRlcm5zXG4gICAgICAgIC5zcGxpdChcIlxcblwiKVxuICAgICAgICAuZmlsdGVyKCh4KSA9PiB4KSxcbiAgICAgIHNldHRpbmdzLmV4Y2x1ZGVDdXJyZW50VmF1bHRQYXRoUHJlZml4UGF0dGVybnNcbiAgICAgICAgLnNwbGl0KFwiXFxuXCIpXG4gICAgICAgIC5maWx0ZXIoKHgpID0+IHgpLFxuICAgICAgc2V0dGluZ3MuaW5jbHVkZUN1cnJlbnRWYXVsdE9ubHlGaWxlc1VuZGVyQ3VycmVudERpcmVjdG9yeVxuICAgICk7XG4gICAgdGhpcy5jdXN0b21EaWN0aW9uYXJ5V29yZFByb3ZpZGVyLnNldFNldHRpbmdzKFxuICAgICAgc2V0dGluZ3MuY3VzdG9tRGljdGlvbmFyeVBhdGhzLnNwbGl0KFwiXFxuXCIpLmZpbHRlcigoeCkgPT4geCksXG4gICAgICBDb2x1bW5EZWxpbWl0ZXIuZnJvbU5hbWUoc2V0dGluZ3MuY29sdW1uRGVsaW1pdGVyKVxuICAgICk7XG5cbiAgICB0aGlzLmRlYm91bmNlR2V0U3VnZ2VzdGlvbnMgPSBkZWJvdW5jZShcbiAgICAgIChjb250ZXh0OiBFZGl0b3JTdWdnZXN0Q29udGV4dCwgY2I6ICh3b3JkczogV29yZFtdKSA9PiB2b2lkKSA9PiB7XG4gICAgICAgIGNvbnN0IHN0YXJ0ID0gcGVyZm9ybWFuY2Uubm93KCk7XG5cbiAgICAgICAgdGhpcy5zaG93RGVidWdMb2coKCkgPT4gYFtjb250ZXh0LnF1ZXJ5XTogJHtjb250ZXh0LnF1ZXJ5fWApO1xuICAgICAgICBjb25zdCBwYXJzZWRRdWVyeSA9IEpTT04ucGFyc2UoY29udGV4dC5xdWVyeSkgYXMge1xuICAgICAgICAgIGN1cnJlbnRGcm9udE1hdHRlcjogc3RyaW5nIHwgbnVsbDtcbiAgICAgICAgICBxdWVyaWVzOiB7XG4gICAgICAgICAgICB3b3JkOiBzdHJpbmc7XG4gICAgICAgICAgICBvZmZzZXQ6IG51bWJlcjtcbiAgICAgICAgICB9W107XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3Qgd29yZHMgPSBwYXJzZWRRdWVyeS5xdWVyaWVzXG4gICAgICAgICAgLmZpbHRlcihcbiAgICAgICAgICAgICh4LCBpLCB4cykgPT5cbiAgICAgICAgICAgICAgcGFyc2VkUXVlcnkuY3VycmVudEZyb250TWF0dGVyIHx8XG4gICAgICAgICAgICAgICh0aGlzLnNldHRpbmdzLm1pbk51bWJlck9mV29yZHNUcmlnZ2VyZWRQaHJhc2UgKyBpIC0gMSA8XG4gICAgICAgICAgICAgICAgeHMubGVuZ3RoICYmXG4gICAgICAgICAgICAgICAgeC53b3JkLmxlbmd0aCA+PSB0aGlzLm1pbk51bWJlclRyaWdnZXJlZCAmJlxuICAgICAgICAgICAgICAgICF0aGlzLnRva2VuaXplci5zaG91bGRJZ25vcmUoeC53b3JkKSAmJlxuICAgICAgICAgICAgICAgICF4LndvcmQuZW5kc1dpdGgoXCIgXCIpKVxuICAgICAgICAgIClcbiAgICAgICAgICAubWFwKChxKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBoYW5kbGVyID1cbiAgICAgICAgICAgICAgcGFyc2VkUXVlcnkuY3VycmVudEZyb250TWF0dGVyICYmXG4gICAgICAgICAgICAgIHRoaXMuZnJvbnRNYXR0ZXJDb21wbGVtZW50U3RyYXRlZ3kgIT09XG4gICAgICAgICAgICAgICAgU3BlY2lmaWNNYXRjaFN0cmF0ZWd5LklOSEVSSVRcbiAgICAgICAgICAgICAgICA/IHRoaXMuZnJvbnRNYXR0ZXJDb21wbGVtZW50U3RyYXRlZ3kuaGFuZGxlclxuICAgICAgICAgICAgICAgIDogdGhpcy5tYXRjaFN0cmF0ZWd5LmhhbmRsZXI7XG4gICAgICAgICAgICByZXR1cm4gaGFuZGxlcihcbiAgICAgICAgICAgICAgdGhpcy5pbmRleGVkV29yZHMsXG4gICAgICAgICAgICAgIHEud29yZCxcbiAgICAgICAgICAgICAgdGhpcy5zZXR0aW5ncy5tYXhOdW1iZXJPZlN1Z2dlc3Rpb25zLFxuICAgICAgICAgICAgICBwYXJzZWRRdWVyeS5jdXJyZW50RnJvbnRNYXR0ZXIsXG4gICAgICAgICAgICAgIHRoaXMuc2VsZWN0aW9uSGlzdG9yeVN0b3JhZ2VcbiAgICAgICAgICAgICkubWFwKCh3b3JkKSA9PiAoeyAuLi53b3JkLCBvZmZzZXQ6IHEub2Zmc2V0IH0pKTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5mbGF0KCk7XG5cbiAgICAgICAgY2IoXG4gICAgICAgICAgdW5pcVdpdGgoXG4gICAgICAgICAgICB3b3JkcyxcbiAgICAgICAgICAgIChhLCBiKSA9PiBhLnZhbHVlID09PSBiLnZhbHVlICYmIGEudHlwZSA9PT0gYi50eXBlXG4gICAgICAgICAgKS5zbGljZSgwLCB0aGlzLnNldHRpbmdzLm1heE51bWJlck9mU3VnZ2VzdGlvbnMpXG4gICAgICAgICk7XG5cbiAgICAgICAgdGhpcy5zaG93RGVidWdMb2coKCkgPT5cbiAgICAgICAgICBidWlsZExvZ01lc3NhZ2UoXCJHZXQgc3VnZ2VzdGlvbnNcIiwgcGVyZm9ybWFuY2Uubm93KCkgLSBzdGFydClcbiAgICAgICAgKTtcbiAgICAgIH0sXG4gICAgICB0aGlzLnNldHRpbmdzLmRlbGF5TWlsbGlTZWNvbmRzLFxuICAgICAgdHJ1ZVxuICAgICk7XG5cbiAgICB0aGlzLmRlYm91bmNlQ2xvc2UgPSBkZWJvdW5jZSgoKSA9PiB7XG4gICAgICB0aGlzLmNsb3NlKCk7XG4gICAgfSwgdGhpcy5zZXR0aW5ncy5kZWxheU1pbGxpU2Vjb25kcyArIDUwKTtcblxuICAgIHRoaXMucmVnaXN0ZXJLZXltYXBzKCk7XG4gIH1cblxuICBwcml2YXRlIHJlZ2lzdGVyS2V5bWFwcygpIHtcbiAgICAvLyBDbGVhclxuICAgIHRoaXMua2V5bWFwRXZlbnRIYW5kbGVyLmZvckVhY2goKHgpID0+IHRoaXMuc2NvcGUudW5yZWdpc3Rlcih4KSk7XG4gICAgdGhpcy5rZXltYXBFdmVudEhhbmRsZXIgPSBbXTtcblxuICAgIHRoaXMuc2NvcGUudW5yZWdpc3Rlcih0aGlzLnNjb3BlLmtleXMuZmluZCgoeCkgPT4geC5rZXkgPT09IFwiRW50ZXJcIikhKTtcbiAgICBjb25zdCBzZWxlY3RTdWdnZXN0aW9uS2V5ID0gU2VsZWN0U3VnZ2VzdGlvbktleS5mcm9tTmFtZShcbiAgICAgIHRoaXMuc2V0dGluZ3Muc2VsZWN0U3VnZ2VzdGlvbktleXNcbiAgICApO1xuICAgIGlmIChzZWxlY3RTdWdnZXN0aW9uS2V5ICE9PSBTZWxlY3RTdWdnZXN0aW9uS2V5LkVOVEVSKSB7XG4gICAgICB0aGlzLmtleW1hcEV2ZW50SGFuZGxlci5wdXNoKFxuICAgICAgICB0aGlzLnNjb3BlLnJlZ2lzdGVyKFxuICAgICAgICAgIFNlbGVjdFN1Z2dlc3Rpb25LZXkuRU5URVIua2V5QmluZC5tb2RpZmllcnMsXG4gICAgICAgICAgU2VsZWN0U3VnZ2VzdGlvbktleS5FTlRFUi5rZXlCaW5kLmtleSxcbiAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIClcbiAgICAgICk7XG4gICAgfVxuICAgIGlmIChzZWxlY3RTdWdnZXN0aW9uS2V5ICE9PSBTZWxlY3RTdWdnZXN0aW9uS2V5LlRBQikge1xuICAgICAgdGhpcy5rZXltYXBFdmVudEhhbmRsZXIucHVzaChcbiAgICAgICAgdGhpcy5zY29wZS5yZWdpc3RlcihcbiAgICAgICAgICBTZWxlY3RTdWdnZXN0aW9uS2V5LlRBQi5rZXlCaW5kLm1vZGlmaWVycyxcbiAgICAgICAgICBTZWxlY3RTdWdnZXN0aW9uS2V5LlRBQi5rZXlCaW5kLmtleSxcbiAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIClcbiAgICAgICk7XG4gICAgfVxuICAgIHRoaXMua2V5bWFwRXZlbnRIYW5kbGVyLnB1c2goXG4gICAgICB0aGlzLnNjb3BlLnJlZ2lzdGVyKFxuICAgICAgICBzZWxlY3RTdWdnZXN0aW9uS2V5LmtleUJpbmQubW9kaWZpZXJzLFxuICAgICAgICBzZWxlY3RTdWdnZXN0aW9uS2V5LmtleUJpbmQua2V5LFxuICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgdGhpcy5zdWdnZXN0aW9ucy51c2VTZWxlY3RlZEl0ZW0oe30pO1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgKVxuICAgICk7XG5cbiAgICB0aGlzLnNjb3BlLmtleXMuZmluZCgoeCkgPT4geC5rZXkgPT09IFwiRXNjYXBlXCIpIS5mdW5jID0gKCkgPT4ge1xuICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgcmV0dXJuIHRoaXMuc2V0dGluZ3MucHJvcGFnYXRlRXNjO1xuICAgIH07XG5cbiAgICBjb25zdCBjeWNsZVRocm91Z2hTdWdnZXN0aW9uc0tleXMgPSBDeWNsZVRocm91Z2hTdWdnZXN0aW9uc0tleXMuZnJvbU5hbWUoXG4gICAgICB0aGlzLnNldHRpbmdzLmFkZGl0aW9uYWxDeWNsZVRocm91Z2hTdWdnZXN0aW9uc0tleXNcbiAgICApO1xuICAgIGlmIChjeWNsZVRocm91Z2hTdWdnZXN0aW9uc0tleXMgIT09IEN5Y2xlVGhyb3VnaFN1Z2dlc3Rpb25zS2V5cy5OT05FKSB7XG4gICAgICBpZiAoY3ljbGVUaHJvdWdoU3VnZ2VzdGlvbnNLZXlzID09PSBDeWNsZVRocm91Z2hTdWdnZXN0aW9uc0tleXMuVEFCKSB7XG4gICAgICAgIHRoaXMuc2NvcGUudW5yZWdpc3RlcihcbiAgICAgICAgICB0aGlzLnNjb3BlLmtleXMuZmluZCgoeCkgPT4geC5tb2RpZmllcnMgPT09IFwiXCIgJiYgeC5rZXkgPT09IFwiVGFiXCIpIVxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgdGhpcy5rZXltYXBFdmVudEhhbmRsZXIucHVzaChcbiAgICAgICAgdGhpcy5zY29wZS5yZWdpc3RlcihcbiAgICAgICAgICBjeWNsZVRocm91Z2hTdWdnZXN0aW9uc0tleXMubmV4dEtleS5tb2RpZmllcnMsXG4gICAgICAgICAgY3ljbGVUaHJvdWdoU3VnZ2VzdGlvbnNLZXlzLm5leHRLZXkua2V5LFxuICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc3VnZ2VzdGlvbnMuc2V0U2VsZWN0ZWRJdGVtKFxuICAgICAgICAgICAgICB0aGlzLnN1Z2dlc3Rpb25zLnNlbGVjdGVkSXRlbSArIDEsXG4gICAgICAgICAgICAgIHRydWVcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICApLFxuICAgICAgICB0aGlzLnNjb3BlLnJlZ2lzdGVyKFxuICAgICAgICAgIGN5Y2xlVGhyb3VnaFN1Z2dlc3Rpb25zS2V5cy5wcmV2aW91c0tleS5tb2RpZmllcnMsXG4gICAgICAgICAgY3ljbGVUaHJvdWdoU3VnZ2VzdGlvbnNLZXlzLnByZXZpb3VzS2V5LmtleSxcbiAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnN1Z2dlc3Rpb25zLnNldFNlbGVjdGVkSXRlbShcbiAgICAgICAgICAgICAgdGhpcy5zdWdnZXN0aW9ucy5zZWxlY3RlZEl0ZW0gLSAxLFxuICAgICAgICAgICAgICB0cnVlXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICBjb25zdCBvcGVuU291cmNlRmlsZUtleSA9IE9wZW5Tb3VyY2VGaWxlS2V5cy5mcm9tTmFtZShcbiAgICAgIHRoaXMuc2V0dGluZ3Mub3BlblNvdXJjZUZpbGVLZXlcbiAgICApO1xuICAgIGlmIChvcGVuU291cmNlRmlsZUtleSAhPT0gT3BlblNvdXJjZUZpbGVLZXlzLk5PTkUpIHtcbiAgICAgIHRoaXMua2V5bWFwRXZlbnRIYW5kbGVyLnB1c2goXG4gICAgICAgIHRoaXMuc2NvcGUucmVnaXN0ZXIoXG4gICAgICAgICAgb3BlblNvdXJjZUZpbGVLZXkua2V5QmluZC5tb2RpZmllcnMsXG4gICAgICAgICAgb3BlblNvdXJjZUZpbGVLZXkua2V5QmluZC5rZXksXG4gICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaXRlbSA9IHRoaXMuc3VnZ2VzdGlvbnMudmFsdWVzW3RoaXMuc3VnZ2VzdGlvbnMuc2VsZWN0ZWRJdGVtXTtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgaXRlbS50eXBlICE9PSBcImN1cnJlbnRWYXVsdFwiICYmXG4gICAgICAgICAgICAgIGl0ZW0udHlwZSAhPT0gXCJpbnRlcm5hbExpbmtcIiAmJlxuICAgICAgICAgICAgICBpdGVtLnR5cGUgIT09IFwiZnJvbnRNYXR0ZXJcIlxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgbWFya2Rvd25GaWxlID0gdGhpcy5hcHBIZWxwZXIuZ2V0TWFya2Rvd25GaWxlQnlQYXRoKFxuICAgICAgICAgICAgICBpdGVtLmNyZWF0ZWRQYXRoXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgaWYgKCFtYXJrZG93bkZpbGUpIHtcbiAgICAgICAgICAgICAgLy8gbm9pbnNwZWN0aW9uIE9iamVjdEFsbG9jYXRpb25JZ25vcmVkXG4gICAgICAgICAgICAgIG5ldyBOb3RpY2UoYENhbid0IG9wZW4gJHtpdGVtLmNyZWF0ZWRQYXRofWApO1xuICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmFwcEhlbHBlci5vcGVuTWFya2Rvd25GaWxlKG1hcmtkb3duRmlsZSwgdHJ1ZSk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICApXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIHJlZnJlc2hDdXJyZW50RmlsZVRva2VucygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBzdGFydCA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgIHRoaXMuc3RhdHVzQmFyLnNldEN1cnJlbnRGaWxlSW5kZXhpbmcoKTtcblxuICAgIGlmICghdGhpcy5zZXR0aW5ncy5lbmFibGVDdXJyZW50RmlsZUNvbXBsZW1lbnQpIHtcbiAgICAgIHRoaXMuc3RhdHVzQmFyLnNldEN1cnJlbnRGaWxlRGlzYWJsZWQoKTtcbiAgICAgIHRoaXMuY3VycmVudEZpbGVXb3JkUHJvdmlkZXIuY2xlYXJXb3JkcygpO1xuICAgICAgdGhpcy5zaG93RGVidWdMb2coKCkgPT5cbiAgICAgICAgYnVpbGRMb2dNZXNzYWdlKFxuICAgICAgICAgIFwi8J+RoiBTa2lwOiBJbmRleCBjdXJyZW50IGZpbGUgdG9rZW5zXCIsXG4gICAgICAgICAgcGVyZm9ybWFuY2Uubm93KCkgLSBzdGFydFxuICAgICAgICApXG4gICAgICApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGF3YWl0IHRoaXMuY3VycmVudEZpbGVXb3JkUHJvdmlkZXIucmVmcmVzaFdvcmRzKFxuICAgICAgdGhpcy5zZXR0aW5ncy5vbmx5Q29tcGxlbWVudEVuZ2xpc2hPbkN1cnJlbnRGaWxlQ29tcGxlbWVudFxuICAgICk7XG5cbiAgICB0aGlzLnN0YXR1c0Jhci5zZXRDdXJyZW50RmlsZUluZGV4ZWQoXG4gICAgICB0aGlzLmN1cnJlbnRGaWxlV29yZFByb3ZpZGVyLndvcmRDb3VudFxuICAgICk7XG4gICAgdGhpcy5zaG93RGVidWdMb2coKCkgPT5cbiAgICAgIGJ1aWxkTG9nTWVzc2FnZShcIkluZGV4IGN1cnJlbnQgZmlsZSB0b2tlbnNcIiwgcGVyZm9ybWFuY2Uubm93KCkgLSBzdGFydClcbiAgICApO1xuICB9XG5cbiAgYXN5bmMgcmVmcmVzaEN1cnJlbnRWYXVsdFRva2VucygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBzdGFydCA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgIHRoaXMuc3RhdHVzQmFyLnNldEN1cnJlbnRWYXVsdEluZGV4aW5nKCk7XG5cbiAgICBpZiAoIXRoaXMuc2V0dGluZ3MuZW5hYmxlQ3VycmVudFZhdWx0Q29tcGxlbWVudCkge1xuICAgICAgdGhpcy5zdGF0dXNCYXIuc2V0Q3VycmVudFZhdWx0RGlzYWJsZWQoKTtcbiAgICAgIHRoaXMuY3VycmVudFZhdWx0V29yZFByb3ZpZGVyLmNsZWFyV29yZHMoKTtcbiAgICAgIHRoaXMuc2hvd0RlYnVnTG9nKCgpID0+XG4gICAgICAgIGJ1aWxkTG9nTWVzc2FnZShcbiAgICAgICAgICBcIvCfkaIgU2tpcDogSW5kZXggY3VycmVudCB2YXVsdCB0b2tlbnNcIixcbiAgICAgICAgICBwZXJmb3JtYW5jZS5ub3coKSAtIHN0YXJ0XG4gICAgICAgIClcbiAgICAgICk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgYXdhaXQgdGhpcy5jdXJyZW50VmF1bHRXb3JkUHJvdmlkZXIucmVmcmVzaFdvcmRzKCk7XG5cbiAgICB0aGlzLnN0YXR1c0Jhci5zZXRDdXJyZW50VmF1bHRJbmRleGVkKFxuICAgICAgdGhpcy5jdXJyZW50VmF1bHRXb3JkUHJvdmlkZXIud29yZENvdW50XG4gICAgKTtcbiAgICB0aGlzLnNob3dEZWJ1Z0xvZygoKSA9PlxuICAgICAgYnVpbGRMb2dNZXNzYWdlKFwiSW5kZXggY3VycmVudCB2YXVsdCB0b2tlbnNcIiwgcGVyZm9ybWFuY2Uubm93KCkgLSBzdGFydClcbiAgICApO1xuICB9XG5cbiAgYXN5bmMgcmVmcmVzaEN1c3RvbURpY3Rpb25hcnlUb2tlbnMoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3Qgc3RhcnQgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICB0aGlzLnN0YXR1c0Jhci5zZXRDdXN0b21EaWN0aW9uYXJ5SW5kZXhpbmcoKTtcblxuICAgIGlmICghdGhpcy5zZXR0aW5ncy5lbmFibGVDdXN0b21EaWN0aW9uYXJ5Q29tcGxlbWVudCkge1xuICAgICAgdGhpcy5zdGF0dXNCYXIuc2V0Q3VzdG9tRGljdGlvbmFyeURpc2FibGVkKCk7XG4gICAgICB0aGlzLmN1c3RvbURpY3Rpb25hcnlXb3JkUHJvdmlkZXIuY2xlYXJXb3JkcygpO1xuICAgICAgdGhpcy5zaG93RGVidWdMb2coKCkgPT5cbiAgICAgICAgYnVpbGRMb2dNZXNzYWdlKFxuICAgICAgICAgIFwi8J+RolNraXA6IEluZGV4IGN1c3RvbSBkaWN0aW9uYXJ5IHRva2Vuc1wiLFxuICAgICAgICAgIHBlcmZvcm1hbmNlLm5vdygpIC0gc3RhcnRcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBhd2FpdCB0aGlzLmN1c3RvbURpY3Rpb25hcnlXb3JkUHJvdmlkZXIucmVmcmVzaEN1c3RvbVdvcmRzKFxuICAgICAgdGhpcy5zZXR0aW5ncy5jdXN0b21EaWN0aW9uYXJ5V29yZFJlZ2V4UGF0dGVyblxuICAgICk7XG5cbiAgICB0aGlzLnN0YXR1c0Jhci5zZXRDdXN0b21EaWN0aW9uYXJ5SW5kZXhlZChcbiAgICAgIHRoaXMuY3VzdG9tRGljdGlvbmFyeVdvcmRQcm92aWRlci53b3JkQ291bnRcbiAgICApO1xuICAgIHRoaXMuc2hvd0RlYnVnTG9nKCgpID0+XG4gICAgICBidWlsZExvZ01lc3NhZ2UoXG4gICAgICAgIFwiSW5kZXggY3VzdG9tIGRpY3Rpb25hcnkgdG9rZW5zXCIsXG4gICAgICAgIHBlcmZvcm1hbmNlLm5vdygpIC0gc3RhcnRcbiAgICAgIClcbiAgICApO1xuICB9XG5cbiAgcmVmcmVzaEludGVybmFsTGlua1Rva2VucygpOiB2b2lkIHtcbiAgICBjb25zdCBzdGFydCA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgIHRoaXMuc3RhdHVzQmFyLnNldEludGVybmFsTGlua0luZGV4aW5nKCk7XG5cbiAgICBpZiAoIXRoaXMuc2V0dGluZ3MuZW5hYmxlSW50ZXJuYWxMaW5rQ29tcGxlbWVudCkge1xuICAgICAgdGhpcy5zdGF0dXNCYXIuc2V0SW50ZXJuYWxMaW5rRGlzYWJsZWQoKTtcbiAgICAgIHRoaXMuaW50ZXJuYWxMaW5rV29yZFByb3ZpZGVyLmNsZWFyV29yZHMoKTtcbiAgICAgIHRoaXMuc2hvd0RlYnVnTG9nKCgpID0+XG4gICAgICAgIGJ1aWxkTG9nTWVzc2FnZShcbiAgICAgICAgICBcIvCfkaJTa2lwOiBJbmRleCBpbnRlcm5hbCBsaW5rIHRva2Vuc1wiLFxuICAgICAgICAgIHBlcmZvcm1hbmNlLm5vdygpIC0gc3RhcnRcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmludGVybmFsTGlua1dvcmRQcm92aWRlci5yZWZyZXNoV29yZHMoXG4gICAgICB0aGlzLnNldHRpbmdzLnN1Z2dlc3RJbnRlcm5hbExpbmtXaXRoQWxpYXMsXG4gICAgICB0aGlzLmV4Y2x1ZGVJbnRlcm5hbExpbmtQcmVmaXhQYXRoUGF0dGVybnNcbiAgICApO1xuXG4gICAgdGhpcy5zdGF0dXNCYXIuc2V0SW50ZXJuYWxMaW5rSW5kZXhlZChcbiAgICAgIHRoaXMuaW50ZXJuYWxMaW5rV29yZFByb3ZpZGVyLndvcmRDb3VudFxuICAgICk7XG4gICAgdGhpcy5zaG93RGVidWdMb2coKCkgPT5cbiAgICAgIGJ1aWxkTG9nTWVzc2FnZShcIkluZGV4IGludGVybmFsIGxpbmsgdG9rZW5zXCIsIHBlcmZvcm1hbmNlLm5vdygpIC0gc3RhcnQpXG4gICAgKTtcbiAgfVxuXG4gIHJlZnJlc2hGcm9udE1hdHRlclRva2VucygpOiB2b2lkIHtcbiAgICBjb25zdCBzdGFydCA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgIHRoaXMuc3RhdHVzQmFyLnNldEZyb250TWF0dGVySW5kZXhpbmcoKTtcblxuICAgIGlmICghdGhpcy5zZXR0aW5ncy5lbmFibGVGcm9udE1hdHRlckNvbXBsZW1lbnQpIHtcbiAgICAgIHRoaXMuc3RhdHVzQmFyLnNldEZyb250TWF0dGVyRGlzYWJsZWQoKTtcbiAgICAgIHRoaXMuZnJvbnRNYXR0ZXJXb3JkUHJvdmlkZXIuY2xlYXJXb3JkcygpO1xuICAgICAgdGhpcy5zaG93RGVidWdMb2coKCkgPT5cbiAgICAgICAgYnVpbGRMb2dNZXNzYWdlKFxuICAgICAgICAgIFwi8J+RolNraXA6IEluZGV4IGZyb250IG1hdHRlciB0b2tlbnNcIixcbiAgICAgICAgICBwZXJmb3JtYW5jZS5ub3coKSAtIHN0YXJ0XG4gICAgICAgIClcbiAgICAgICk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5mcm9udE1hdHRlcldvcmRQcm92aWRlci5yZWZyZXNoV29yZHMoKTtcblxuICAgIHRoaXMuc3RhdHVzQmFyLnNldEZyb250TWF0dGVySW5kZXhlZChcbiAgICAgIHRoaXMuZnJvbnRNYXR0ZXJXb3JkUHJvdmlkZXIud29yZENvdW50XG4gICAgKTtcbiAgICB0aGlzLnNob3dEZWJ1Z0xvZygoKSA9PlxuICAgICAgYnVpbGRMb2dNZXNzYWdlKFwiSW5kZXggZnJvbnQgbWF0dGVyIHRva2Vuc1wiLCBwZXJmb3JtYW5jZS5ub3coKSAtIHN0YXJ0KVxuICAgICk7XG4gIH1cblxuICBvblRyaWdnZXIoXG4gICAgY3Vyc29yOiBFZGl0b3JQb3NpdGlvbixcbiAgICBlZGl0b3I6IEVkaXRvcixcbiAgICBmaWxlOiBURmlsZVxuICApOiBFZGl0b3JTdWdnZXN0VHJpZ2dlckluZm8gfCBudWxsIHtcbiAgICBjb25zdCBzdGFydCA9IHBlcmZvcm1hbmNlLm5vdygpO1xuXG4gICAgaWYgKFxuICAgICAgIXRoaXMuc2V0dGluZ3MuY29tcGxlbWVudEF1dG9tYXRpY2FsbHkgJiZcbiAgICAgICF0aGlzLmlzT3BlbiAmJlxuICAgICAgIXRoaXMucnVuTWFudWFsbHlcbiAgICApIHtcbiAgICAgIHRoaXMuc2hvd0RlYnVnTG9nKCgpID0+IFwiRG9uJ3Qgc2hvdyBzdWdnZXN0aW9uc1wiKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGlmIChcbiAgICAgIHRoaXMuc2V0dGluZ3MuZGlzYWJsZVN1Z2dlc3Rpb25zRHVyaW5nSW1lT24gJiZcbiAgICAgIHRoaXMuYXBwSGVscGVyLmlzSU1FT24oKSAmJlxuICAgICAgIXRoaXMucnVuTWFudWFsbHlcbiAgICApIHtcbiAgICAgIHRoaXMuc2hvd0RlYnVnTG9nKCgpID0+IFwiRG9uJ3Qgc2hvdyBzdWdnZXN0aW9ucyBmb3IgSU1FXCIpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgY2wgPSB0aGlzLmFwcEhlbHBlci5nZXRDdXJyZW50TGluZShlZGl0b3IpO1xuICAgIGlmICh0aGlzLnByZXZpb3VzQ3VycmVudExpbmUgPT09IGNsICYmICF0aGlzLnJ1bk1hbnVhbGx5KSB7XG4gICAgICB0aGlzLnByZXZpb3VzQ3VycmVudExpbmUgPSBjbDtcbiAgICAgIHRoaXMuc2hvd0RlYnVnTG9nKFxuICAgICAgICAoKSA9PiBcIkRvbid0IHNob3cgc3VnZ2VzdGlvbnMgYmVjYXVzZSB0aGVyZSBhcmUgbm8gY2hhbmdlc1wiXG4gICAgICApO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHRoaXMucHJldmlvdXNDdXJyZW50TGluZSA9IGNsO1xuXG4gICAgY29uc3QgY3VycmVudExpbmVVbnRpbEN1cnNvciA9XG4gICAgICB0aGlzLmFwcEhlbHBlci5nZXRDdXJyZW50TGluZVVudGlsQ3Vyc29yKGVkaXRvcik7XG4gICAgaWYgKGN1cnJlbnRMaW5lVW50aWxDdXJzb3Iuc3RhcnRzV2l0aChcIi0tLVwiKSkge1xuICAgICAgdGhpcy5zaG93RGVidWdMb2coXG4gICAgICAgICgpID0+XG4gICAgICAgICAgXCJEb24ndCBzaG93IHN1Z2dlc3Rpb25zIGJlY2F1c2UgaXQgc3VwcG9zZXMgZnJvbnQgbWF0dGVyIG9yIGhvcml6b250YWwgbGluZVwiXG4gICAgICApO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmIChcbiAgICAgIGN1cnJlbnRMaW5lVW50aWxDdXJzb3Iuc3RhcnRzV2l0aChcIn5+flwiKSB8fFxuICAgICAgY3VycmVudExpbmVVbnRpbEN1cnNvci5zdGFydHNXaXRoKFwiYGBgXCIpXG4gICAgKSB7XG4gICAgICB0aGlzLnNob3dEZWJ1Z0xvZyhcbiAgICAgICAgKCkgPT4gXCJEb24ndCBzaG93IHN1Z2dlc3Rpb25zIGJlY2F1c2UgaXQgc3VwcG9zZXMgZnJvbnQgY29kZSBibG9ja1wiXG4gICAgICApO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgdG9rZW5zID0gdGhpcy50b2tlbml6ZXIudG9rZW5pemUoY3VycmVudExpbmVVbnRpbEN1cnNvciwgdHJ1ZSk7XG4gICAgdGhpcy5zaG93RGVidWdMb2coKCkgPT4gYFtvblRyaWdnZXJdIHRva2VucyBpcyAke3Rva2Vuc31gKTtcblxuICAgIGNvbnN0IHRva2VuaXplZCA9IHRoaXMudG9rZW5pemVyLnJlY3Vyc2l2ZVRva2VuaXplKGN1cnJlbnRMaW5lVW50aWxDdXJzb3IpO1xuICAgIGNvbnN0IGN1cnJlbnRUb2tlbnMgPSB0b2tlbml6ZWQuc2xpY2UoXG4gICAgICB0b2tlbml6ZWQubGVuZ3RoID4gdGhpcy5zZXR0aW5ncy5tYXhOdW1iZXJPZldvcmRzQXNQaHJhc2VcbiAgICAgICAgPyB0b2tlbml6ZWQubGVuZ3RoIC0gdGhpcy5zZXR0aW5ncy5tYXhOdW1iZXJPZldvcmRzQXNQaHJhc2VcbiAgICAgICAgOiAwXG4gICAgKTtcbiAgICB0aGlzLnNob3dEZWJ1Z0xvZyhcbiAgICAgICgpID0+IGBbb25UcmlnZ2VyXSBjdXJyZW50VG9rZW5zIGlzICR7SlNPTi5zdHJpbmdpZnkoY3VycmVudFRva2Vucyl9YFxuICAgICk7XG5cbiAgICBjb25zdCBjdXJyZW50VG9rZW4gPSBjdXJyZW50VG9rZW5zWzBdPy53b3JkO1xuICAgIHRoaXMuc2hvd0RlYnVnTG9nKCgpID0+IGBbb25UcmlnZ2VyXSBjdXJyZW50VG9rZW4gaXMgJHtjdXJyZW50VG9rZW59YCk7XG4gICAgaWYgKCFjdXJyZW50VG9rZW4pIHtcbiAgICAgIHRoaXMucnVuTWFudWFsbHkgPSBmYWxzZTtcbiAgICAgIHRoaXMuc2hvd0RlYnVnTG9nKFxuICAgICAgICAoKSA9PiBgRG9uJ3Qgc2hvdyBzdWdnZXN0aW9ucyBiZWNhdXNlIGN1cnJlbnRUb2tlbiBpcyBlbXB0eWBcbiAgICAgICk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBjdXJyZW50VG9rZW5TZXBhcmF0ZWRXaGl0ZVNwYWNlID1cbiAgICAgIGN1cnJlbnRMaW5lVW50aWxDdXJzb3Iuc3BsaXQoXCIgXCIpLmxhc3QoKSA/PyBcIlwiO1xuICAgIGlmIChcbiAgICAgIG5ldyBSZWdFeHAoYF5bJHt0aGlzLnNldHRpbmdzLmZpcnN0Q2hhcmFjdGVyc0Rpc2FibGVTdWdnZXN0aW9uc31dYCkudGVzdChcbiAgICAgICAgY3VycmVudFRva2VuU2VwYXJhdGVkV2hpdGVTcGFjZVxuICAgICAgKVxuICAgICkge1xuICAgICAgdGhpcy5ydW5NYW51YWxseSA9IGZhbHNlO1xuICAgICAgdGhpcy5zaG93RGVidWdMb2coXG4gICAgICAgICgpID0+XG4gICAgICAgICAgYERvbid0IHNob3cgc3VnZ2VzdGlvbnMgZm9yIGF2b2lkaW5nIHRvIGNvbmZsaWN0IHdpdGggdGhlIG90aGVyIGNvbW1hbmRzLmBcbiAgICAgICk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAoXG4gICAgICBjdXJyZW50VG9rZW4ubGVuZ3RoID09PSAxICYmXG4gICAgICBCb29sZWFuKGN1cnJlbnRUb2tlbi5tYXRjaCh0aGlzLnRva2VuaXplci5nZXRUcmltUGF0dGVybigpKSlcbiAgICApIHtcbiAgICAgIHRoaXMucnVuTWFudWFsbHkgPSBmYWxzZTtcbiAgICAgIHRoaXMuc2hvd0RlYnVnTG9nKFxuICAgICAgICAoKSA9PiBgRG9uJ3Qgc2hvdyBzdWdnZXN0aW9ucyBiZWNhdXNlIGN1cnJlbnRUb2tlbiBpcyBUUklNX1BBVFRFUk5gXG4gICAgICApO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgY3VycmVudEZyb250TWF0dGVyID0gdGhpcy5zZXR0aW5ncy5lbmFibGVGcm9udE1hdHRlckNvbXBsZW1lbnRcbiAgICAgID8gdGhpcy5hcHBIZWxwZXIuZ2V0Q3VycmVudEZyb250TWF0dGVyKClcbiAgICAgIDogbnVsbDtcbiAgICB0aGlzLnNob3dEZWJ1Z0xvZygoKSA9PiBgQ3VycmVudCBmcm9udCBtYXR0ZXIgaXMgJHtjdXJyZW50RnJvbnRNYXR0ZXJ9YCk7XG5cbiAgICBpZiAoIXRoaXMucnVuTWFudWFsbHkgJiYgIWN1cnJlbnRGcm9udE1hdHRlcikge1xuICAgICAgaWYgKGN1cnJlbnRUb2tlbi5sZW5ndGggPCB0aGlzLm1pbk51bWJlclRyaWdnZXJlZCkge1xuICAgICAgICB0aGlzLnNob3dEZWJ1Z0xvZyhcbiAgICAgICAgICAoKSA9PlxuICAgICAgICAgICAgXCJEb24ndCBzaG93IHN1Z2dlc3Rpb25zIGJlY2F1c2UgY3VycmVudFRva2VuIGlzIGxlc3MgdGhhbiBtaW5OdW1iZXJUcmlnZ2VyZWQgb3B0aW9uXCJcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy50b2tlbml6ZXIuc2hvdWxkSWdub3JlKGN1cnJlbnRUb2tlbikpIHtcbiAgICAgICAgdGhpcy5zaG93RGVidWdMb2coXG4gICAgICAgICAgKCkgPT4gXCJEb24ndCBzaG93IHN1Z2dlc3Rpb25zIGJlY2F1c2UgY3VycmVudFRva2VuIHNob3VsZCBpZ25vcmVkXCJcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5zaG93RGVidWdMb2coKCkgPT5cbiAgICAgIGJ1aWxkTG9nTWVzc2FnZShcIm9uVHJpZ2dlclwiLCBwZXJmb3JtYW5jZS5ub3coKSAtIHN0YXJ0KVxuICAgICk7XG4gICAgdGhpcy5ydW5NYW51YWxseSA9IGZhbHNlO1xuXG4gICAgLy8gSGFjayBpbXBsZW1lbnRhdGlvbiBmb3IgRnJvbnQgbWF0dGVyIGNvbXBsZW1lbnRcbiAgICBpZiAoY3VycmVudEZyb250TWF0dGVyICYmIGN1cnJlbnRUb2tlbnMubGFzdCgpPy53b3JkLm1hdGNoKC9bXiBdICQvKSkge1xuICAgICAgY3VycmVudFRva2Vucy5wdXNoKHsgd29yZDogXCJcIiwgb2Zmc2V0OiBjdXJyZW50TGluZVVudGlsQ3Vyc29yLmxlbmd0aCB9KTtcbiAgICB9XG5cbiAgICAvLyBGb3IgbXVsdGktd29yZCBjb21wbGV0aW9uXG4gICAgdGhpcy5jb250ZXh0U3RhcnRDaCA9IGN1cnNvci5jaCAtIGN1cnJlbnRUb2tlbi5sZW5ndGg7XG4gICAgcmV0dXJuIHtcbiAgICAgIHN0YXJ0OiB7XG4gICAgICAgIGNoOiBjdXJzb3IuY2ggLSAoY3VycmVudFRva2Vucy5sYXN0KCk/LndvcmQ/Lmxlbmd0aCA/PyAwKSwgLy8gRm9yIG11bHRpLXdvcmQgY29tcGxldGlvblxuICAgICAgICBsaW5lOiBjdXJzb3IubGluZSxcbiAgICAgIH0sXG4gICAgICBlbmQ6IGN1cnNvcixcbiAgICAgIHF1ZXJ5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgIGN1cnJlbnRGcm9udE1hdHRlcixcbiAgICAgICAgcXVlcmllczogY3VycmVudFRva2Vucy5tYXAoKHgpID0+ICh7XG4gICAgICAgICAgLi4ueCxcbiAgICAgICAgICBvZmZzZXQ6IHgub2Zmc2V0IC0gY3VycmVudFRva2Vuc1swXS5vZmZzZXQsXG4gICAgICAgIH0pKSxcbiAgICAgIH0pLFxuICAgIH07XG4gIH1cblxuICBnZXRTdWdnZXN0aW9ucyhjb250ZXh0OiBFZGl0b3JTdWdnZXN0Q29udGV4dCk6IFdvcmRbXSB8IFByb21pc2U8V29yZFtdPiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICB0aGlzLmRlYm91bmNlR2V0U3VnZ2VzdGlvbnMoY29udGV4dCwgKHdvcmRzKSA9PiB7XG4gICAgICAgIHJlc29sdmUod29yZHMpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBjcmVhdGVSZW5kZXJTdWdnZXN0aW9uKHdvcmQ6IFdvcmQpOiBzdHJpbmcge1xuICAgIGNvbnN0IHRleHQgPSB3b3JkLnZhbHVlO1xuXG4gICAgaWYgKFxuICAgICAgdGhpcy5zZXR0aW5ncy5kZWxpbWl0ZXJUb0RpdmlkZVN1Z2dlc3Rpb25zRm9yRGlzcGxheUZyb21JbnNlcnRpb24gJiZcbiAgICAgIHRleHQuaW5jbHVkZXMoXG4gICAgICAgIHRoaXMuc2V0dGluZ3MuZGVsaW1pdGVyVG9EaXZpZGVTdWdnZXN0aW9uc0ZvckRpc3BsYXlGcm9tSW5zZXJ0aW9uXG4gICAgICApXG4gICAgKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICB0ZXh0LnNwbGl0KFxuICAgICAgICAgIHRoaXMuc2V0dGluZ3MuZGVsaW1pdGVyVG9EaXZpZGVTdWdnZXN0aW9uc0ZvckRpc3BsYXlGcm9tSW5zZXJ0aW9uXG4gICAgICAgIClbMF0gKyB0aGlzLnNldHRpbmdzLmRpc3BsYXllZFRleHRTdWZmaXhcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKFxuICAgICAgdGhpcy5zZXR0aW5ncy5kZWxpbWl0ZXJUb0hpZGVTdWdnZXN0aW9uICYmXG4gICAgICB0ZXh0LmluY2x1ZGVzKHRoaXMuc2V0dGluZ3MuZGVsaW1pdGVyVG9IaWRlU3VnZ2VzdGlvbilcbiAgICApIHtcbiAgICAgIHJldHVybiBgJHt0ZXh0LnNwbGl0KHRoaXMuc2V0dGluZ3MuZGVsaW1pdGVyVG9IaWRlU3VnZ2VzdGlvbilbMF19IC4uLmA7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRleHQ7XG4gIH1cblxuICByZW5kZXJTdWdnZXN0aW9uKHdvcmQ6IFdvcmQsIGVsOiBIVE1MRWxlbWVudCk6IHZvaWQge1xuICAgIGNvbnN0IGJhc2UgPSBjcmVhdGVEaXYoKTtcblxuICAgIGJhc2UuY3JlYXRlRGl2KHtcbiAgICAgIHRleHQ6IHRoaXMuY3JlYXRlUmVuZGVyU3VnZ2VzdGlvbih3b3JkKSxcbiAgICAgIGNsczpcbiAgICAgICAgd29yZC50eXBlID09PSBcImludGVybmFsTGlua1wiICYmIHdvcmQuYWxpYXNNZXRhXG4gICAgICAgICAgPyBcInZhcmlvdXMtY29tcGxlbWVudHNfX3N1Z2dlc3Rpb24taXRlbV9fY29udGVudF9fYWxpYXNcIlxuICAgICAgICAgIDogdW5kZWZpbmVkLFxuICAgIH0pO1xuXG4gICAgY29uc3QgZGVzY3JpcHRpb24gPSB0aGlzLmRlc2NyaXB0aW9uT25TdWdnZXN0aW9uLnRvRGlzcGxheSh3b3JkKTtcbiAgICBpZiAoZGVzY3JpcHRpb24pIHtcbiAgICAgIGJhc2UuY3JlYXRlRGl2KHtcbiAgICAgICAgY2xzOiBcInZhcmlvdXMtY29tcGxlbWVudHNfX3N1Z2dlc3Rpb24taXRlbV9fZGVzY3JpcHRpb25cIixcbiAgICAgICAgdGV4dDogYCR7ZGVzY3JpcHRpb259YCxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGVsLmFwcGVuZENoaWxkKGJhc2UpO1xuXG4gICAgZWwuYWRkQ2xhc3MoXCJ2YXJpb3VzLWNvbXBsZW1lbnRzX19zdWdnZXN0aW9uLWl0ZW1cIik7XG4gICAgc3dpdGNoICh3b3JkLnR5cGUpIHtcbiAgICAgIGNhc2UgXCJjdXJyZW50RmlsZVwiOlxuICAgICAgICBlbC5hZGRDbGFzcyhcInZhcmlvdXMtY29tcGxlbWVudHNfX3N1Z2dlc3Rpb24taXRlbV9fY3VycmVudC1maWxlXCIpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJjdXJyZW50VmF1bHRcIjpcbiAgICAgICAgZWwuYWRkQ2xhc3MoXCJ2YXJpb3VzLWNvbXBsZW1lbnRzX19zdWdnZXN0aW9uLWl0ZW1fX2N1cnJlbnQtdmF1bHRcIik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImN1c3RvbURpY3Rpb25hcnlcIjpcbiAgICAgICAgZWwuYWRkQ2xhc3MoXCJ2YXJpb3VzLWNvbXBsZW1lbnRzX19zdWdnZXN0aW9uLWl0ZW1fX2N1c3RvbS1kaWN0aW9uYXJ5XCIpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJpbnRlcm5hbExpbmtcIjpcbiAgICAgICAgZWwuYWRkQ2xhc3MoXCJ2YXJpb3VzLWNvbXBsZW1lbnRzX19zdWdnZXN0aW9uLWl0ZW1fX2ludGVybmFsLWxpbmtcIik7XG4gICAgICAgIGlmICh3b3JkLnBoYW50b20pIHtcbiAgICAgICAgICBlbC5hZGRDbGFzcyhcInZhcmlvdXMtY29tcGxlbWVudHNfX3N1Z2dlc3Rpb24taXRlbV9fcGhhbnRvbVwiKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJmcm9udE1hdHRlclwiOlxuICAgICAgICBlbC5hZGRDbGFzcyhcInZhcmlvdXMtY29tcGxlbWVudHNfX3N1Z2dlc3Rpb24taXRlbV9fZnJvbnQtbWF0dGVyXCIpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBzZWxlY3RTdWdnZXN0aW9uKHdvcmQ6IFdvcmQsIGV2dDogTW91c2VFdmVudCB8IEtleWJvYXJkRXZlbnQpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuY29udGV4dCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBpbnNlcnRlZFRleHQgPSB3b3JkLnZhbHVlO1xuICAgIGlmICh3b3JkLnR5cGUgPT09IFwiaW50ZXJuYWxMaW5rXCIpIHtcbiAgICAgIGluc2VydGVkVGV4dCA9XG4gICAgICAgIHRoaXMuc2V0dGluZ3Muc3VnZ2VzdEludGVybmFsTGlua1dpdGhBbGlhcyAmJiB3b3JkLmFsaWFzTWV0YVxuICAgICAgICAgID8gYFtbJHt3b3JkLmFsaWFzTWV0YS5vcmlnaW59fCR7d29yZC52YWx1ZX1dXWBcbiAgICAgICAgICA6IGBbWyR7d29yZC52YWx1ZX1dXWA7XG4gICAgfVxuXG4gICAgaWYgKFxuICAgICAgd29yZC50eXBlID09PSBcImZyb250TWF0dGVyXCIgJiZcbiAgICAgIHRoaXMuc2V0dGluZ3MuaW5zZXJ0Q29tbWFBZnRlckZyb250TWF0dGVyQ29tcGxldGlvblxuICAgICkge1xuICAgICAgaW5zZXJ0ZWRUZXh0ID0gYCR7aW5zZXJ0ZWRUZXh0fSwgYDtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMuc2V0dGluZ3MuaW5zZXJ0QWZ0ZXJDb21wbGV0aW9uKSB7XG4gICAgICAgIGluc2VydGVkVGV4dCA9IGAke2luc2VydGVkVGV4dH0gYDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoXG4gICAgICB0aGlzLnNldHRpbmdzLmRlbGltaXRlclRvRGl2aWRlU3VnZ2VzdGlvbnNGb3JEaXNwbGF5RnJvbUluc2VydGlvbiAmJlxuICAgICAgaW5zZXJ0ZWRUZXh0LmluY2x1ZGVzKFxuICAgICAgICB0aGlzLnNldHRpbmdzLmRlbGltaXRlclRvRGl2aWRlU3VnZ2VzdGlvbnNGb3JEaXNwbGF5RnJvbUluc2VydGlvblxuICAgICAgKVxuICAgICkge1xuICAgICAgaW5zZXJ0ZWRUZXh0ID0gaW5zZXJ0ZWRUZXh0LnNwbGl0KFxuICAgICAgICB0aGlzLnNldHRpbmdzLmRlbGltaXRlclRvRGl2aWRlU3VnZ2VzdGlvbnNGb3JEaXNwbGF5RnJvbUluc2VydGlvblxuICAgICAgKVsxXTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5zZXR0aW5ncy5kZWxpbWl0ZXJUb0hpZGVTdWdnZXN0aW9uKSB7XG4gICAgICBpbnNlcnRlZFRleHQgPSBpbnNlcnRlZFRleHQucmVwbGFjZShcbiAgICAgICAgdGhpcy5zZXR0aW5ncy5kZWxpbWl0ZXJUb0hpZGVTdWdnZXN0aW9uLFxuICAgICAgICBcIlwiXG4gICAgICApO1xuICAgIH1cblxuICAgIGNvbnN0IGNhcmV0ID0gdGhpcy5zZXR0aW5ncy5jYXJldExvY2F0aW9uU3ltYm9sQWZ0ZXJDb21wbGVtZW50O1xuICAgIGNvbnN0IHBvc2l0aW9uVG9Nb3ZlID0gY2FyZXQgPyBpbnNlcnRlZFRleHQuaW5kZXhPZihjYXJldCkgOiAtMTtcbiAgICBpZiAocG9zaXRpb25Ub01vdmUgIT09IC0xKSB7XG4gICAgICBpbnNlcnRlZFRleHQgPSBpbnNlcnRlZFRleHQucmVwbGFjZShjYXJldCwgXCJcIik7XG4gICAgfVxuXG4gICAgY29uc3QgZWRpdG9yID0gdGhpcy5jb250ZXh0LmVkaXRvcjtcbiAgICBlZGl0b3IucmVwbGFjZVJhbmdlKFxuICAgICAgaW5zZXJ0ZWRUZXh0LFxuICAgICAge1xuICAgICAgICAuLi50aGlzLmNvbnRleHQuc3RhcnQsXG4gICAgICAgIGNoOiB0aGlzLmNvbnRleHRTdGFydENoICsgd29yZC5vZmZzZXQhLFxuICAgICAgfSxcbiAgICAgIHRoaXMuY29udGV4dC5lbmRcbiAgICApO1xuXG4gICAgaWYgKHBvc2l0aW9uVG9Nb3ZlICE9PSAtMSkge1xuICAgICAgZWRpdG9yLnNldEN1cnNvcihcbiAgICAgICAgZWRpdG9yLm9mZnNldFRvUG9zKFxuICAgICAgICAgIGVkaXRvci5wb3NUb09mZnNldChlZGl0b3IuZ2V0Q3Vyc29yKCkpIC1cbiAgICAgICAgICAgIGluc2VydGVkVGV4dC5sZW5ndGggK1xuICAgICAgICAgICAgcG9zaXRpb25Ub01vdmVcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyBUaGUgd29ya2Fyb3VuZCBvZiBzdHJhbmdlIGJlaGF2aW9yIGZvciB0aGF0IGN1cnNvciBkb2Vzbid0IG1vdmUgYWZ0ZXIgY29tcGxldGlvbiBvbmx5IGlmIGl0IGRvZXNuJ3QgaW5wdXQgYW55IHdvcmQuXG4gICAgaWYgKFxuICAgICAgdGhpcy5hcHBIZWxwZXIuZXF1YWxzQXNFZGl0b3JQb3N0aW9uKHRoaXMuY29udGV4dC5zdGFydCwgdGhpcy5jb250ZXh0LmVuZClcbiAgICApIHtcbiAgICAgIGVkaXRvci5zZXRDdXJzb3IoXG4gICAgICAgIGVkaXRvci5vZmZzZXRUb1BvcyhcbiAgICAgICAgICBlZGl0b3IucG9zVG9PZmZzZXQoZWRpdG9yLmdldEN1cnNvcigpKSArIGluc2VydGVkVGV4dC5sZW5ndGhcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICB0aGlzLnNlbGVjdGlvbkhpc3RvcnlTdG9yYWdlPy5pbmNyZW1lbnQod29yZCBhcyBIaXRXb3JkKTtcbiAgICBpZiAodGhpcy5zZXR0aW5ncy5zaG93TG9nQWJvdXRQZXJmb3JtYW5jZUluQ29uc29sZSkge1xuICAgICAgY29uc29sZS5sb2coXCItLS0gaGlzdG9yeSAtLS1cIik7XG4gICAgICBjb25zb2xlLmxvZyh0aGlzLnNlbGVjdGlvbkhpc3RvcnlTdG9yYWdlPy5kYXRhKTtcbiAgICB9XG5cbiAgICB0aGlzLmNsb3NlKCk7XG4gICAgdGhpcy5kZWJvdW5jZUNsb3NlKCk7XG4gIH1cblxuICBwcml2YXRlIHNob3dEZWJ1Z0xvZyh0b01lc3NhZ2U6ICgpID0+IHN0cmluZykge1xuICAgIGlmICh0aGlzLnNldHRpbmdzLnNob3dMb2dBYm91dFBlcmZvcm1hbmNlSW5Db25zb2xlKSB7XG4gICAgICBjb25zb2xlLmxvZyh0b01lc3NhZ2UoKSk7XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgeyBBcHAsIE5vdGljZSwgUGx1Z2luU2V0dGluZ1RhYiwgU2V0dGluZyB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHR5cGUgVmFyaW91c0NvbXBvbmVudHMgZnJvbSBcIi4uL21haW5cIjtcbmltcG9ydCB7IFRva2VuaXplU3RyYXRlZ3kgfSBmcm9tIFwiLi4vdG9rZW5pemVyL1Rva2VuaXplU3RyYXRlZ3lcIjtcbmltcG9ydCB7IE1hdGNoU3RyYXRlZ3kgfSBmcm9tIFwiLi4vcHJvdmlkZXIvTWF0Y2hTdHJhdGVneVwiO1xuaW1wb3J0IHsgQ3ljbGVUaHJvdWdoU3VnZ2VzdGlvbnNLZXlzIH0gZnJvbSBcIi4uL29wdGlvbi9DeWNsZVRocm91Z2hTdWdnZXN0aW9uc0tleXNcIjtcbmltcG9ydCB7IENvbHVtbkRlbGltaXRlciB9IGZyb20gXCIuLi9vcHRpb24vQ29sdW1uRGVsaW1pdGVyXCI7XG5pbXBvcnQgeyBTZWxlY3RTdWdnZXN0aW9uS2V5IH0gZnJvbSBcIi4uL29wdGlvbi9TZWxlY3RTdWdnZXN0aW9uS2V5XCI7XG5pbXBvcnQgeyBtaXJyb3JNYXAgfSBmcm9tIFwiLi4vdXRpbC9jb2xsZWN0aW9uLWhlbHBlclwiO1xuaW1wb3J0IHsgT3BlblNvdXJjZUZpbGVLZXlzIH0gZnJvbSBcIi4uL29wdGlvbi9PcGVuU291cmNlRmlsZUtleXNcIjtcbmltcG9ydCB7IERlc2NyaXB0aW9uT25TdWdnZXN0aW9uIH0gZnJvbSBcIi4uL29wdGlvbi9EZXNjcmlwdGlvbk9uU3VnZ2VzdGlvblwiO1xuaW1wb3J0IHsgU3BlY2lmaWNNYXRjaFN0cmF0ZWd5IH0gZnJvbSBcIi4uL3Byb3ZpZGVyL1NwZWNpZmljTWF0Y2hTdHJhdGVneVwiO1xuaW1wb3J0IHR5cGUgeyBTZWxlY3Rpb25IaXN0b3J5VHJlZSB9IGZyb20gXCIuLi9zdG9yYWdlL1NlbGVjdGlvbkhpc3RvcnlTdG9yYWdlXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgU2V0dGluZ3Mge1xuICAvLyBnZW5lcmFsXG4gIHN0cmF0ZWd5OiBzdHJpbmc7XG4gIG1hdGNoU3RyYXRlZ3k6IHN0cmluZztcbiAgbWF4TnVtYmVyT2ZTdWdnZXN0aW9uczogbnVtYmVyO1xuICBtYXhOdW1iZXJPZldvcmRzQXNQaHJhc2U6IG51bWJlcjtcbiAgbWluTnVtYmVyT2ZDaGFyYWN0ZXJzVHJpZ2dlcmVkOiBudW1iZXI7XG4gIG1pbk51bWJlck9mV29yZHNUcmlnZ2VyZWRQaHJhc2U6IG51bWJlcjtcbiAgY29tcGxlbWVudEF1dG9tYXRpY2FsbHk6IGJvb2xlYW47XG4gIGRlbGF5TWlsbGlTZWNvbmRzOiBudW1iZXI7XG4gIGRpc2FibGVTdWdnZXN0aW9uc0R1cmluZ0ltZU9uOiBib29sZWFuO1xuICAvLyBGSVhNRTogUmVuYW1lIGF0IG5leHQgbWFqb3IgdmVyc2lvbiB1cFxuICBpbnNlcnRBZnRlckNvbXBsZXRpb246IGJvb2xlYW47XG4gIGZpcnN0Q2hhcmFjdGVyc0Rpc2FibGVTdWdnZXN0aW9uczogc3RyaW5nO1xuXG4gIC8vIGFwcGVhcmFuY2VcbiAgc2hvd01hdGNoU3RyYXRlZ3k6IGJvb2xlYW47XG4gIHNob3dJbmRleGluZ1N0YXR1czogYm9vbGVhbjtcbiAgZGVzY3JpcHRpb25PblN1Z2dlc3Rpb246IHN0cmluZztcblxuICAvLyBrZXkgY3VzdG9taXphdGlvblxuICBzZWxlY3RTdWdnZXN0aW9uS2V5czogc3RyaW5nO1xuICBhZGRpdGlvbmFsQ3ljbGVUaHJvdWdoU3VnZ2VzdGlvbnNLZXlzOiBzdHJpbmc7XG4gIG9wZW5Tb3VyY2VGaWxlS2V5OiBzdHJpbmc7XG4gIHByb3BhZ2F0ZUVzYzogYm9vbGVhbjtcblxuICAvLyBjdXJyZW50IGZpbGUgY29tcGxlbWVudFxuICBlbmFibGVDdXJyZW50RmlsZUNvbXBsZW1lbnQ6IGJvb2xlYW47XG4gIG9ubHlDb21wbGVtZW50RW5nbGlzaE9uQ3VycmVudEZpbGVDb21wbGVtZW50OiBib29sZWFuO1xuXG4gIC8vIGN1cnJlbnQgdmF1bHQgY29tcGxlbWVudFxuICBlbmFibGVDdXJyZW50VmF1bHRDb21wbGVtZW50OiBib29sZWFuO1xuICBpbmNsdWRlQ3VycmVudFZhdWx0UGF0aFByZWZpeFBhdHRlcm5zOiBzdHJpbmc7XG4gIGV4Y2x1ZGVDdXJyZW50VmF1bHRQYXRoUHJlZml4UGF0dGVybnM6IHN0cmluZztcbiAgaW5jbHVkZUN1cnJlbnRWYXVsdE9ubHlGaWxlc1VuZGVyQ3VycmVudERpcmVjdG9yeTogYm9vbGVhbjtcblxuICAvLyBjdXN0b20gZGljdGlvbmFyeSBjb21wbGVtZW50XG4gIGVuYWJsZUN1c3RvbURpY3Rpb25hcnlDb21wbGVtZW50OiBib29sZWFuO1xuICBjdXN0b21EaWN0aW9uYXJ5UGF0aHM6IHN0cmluZztcbiAgY29sdW1uRGVsaW1pdGVyOiBzdHJpbmc7XG4gIGN1c3RvbURpY3Rpb25hcnlXb3JkUmVnZXhQYXR0ZXJuOiBzdHJpbmc7XG4gIGRlbGltaXRlclRvSGlkZVN1Z2dlc3Rpb246IHN0cmluZztcbiAgZGVsaW1pdGVyVG9EaXZpZGVTdWdnZXN0aW9uc0ZvckRpc3BsYXlGcm9tSW5zZXJ0aW9uOiBzdHJpbmc7XG4gIGNhcmV0TG9jYXRpb25TeW1ib2xBZnRlckNvbXBsZW1lbnQ6IHN0cmluZztcbiAgZGlzcGxheWVkVGV4dFN1ZmZpeDogc3RyaW5nO1xuXG4gIC8vIGludGVybmFsIGxpbmsgY29tcGxlbWVudFxuICBlbmFibGVJbnRlcm5hbExpbmtDb21wbGVtZW50OiBib29sZWFuO1xuICBzdWdnZXN0SW50ZXJuYWxMaW5rV2l0aEFsaWFzOiBib29sZWFuO1xuICBleGNsdWRlSW50ZXJuYWxMaW5rUGF0aFByZWZpeFBhdHRlcm5zOiBzdHJpbmc7XG5cbiAgLy8gZnJvbnQgbWF0dGVyIGNvbXBsZW1lbnRcbiAgZW5hYmxlRnJvbnRNYXR0ZXJDb21wbGVtZW50OiBib29sZWFuO1xuICBmcm9udE1hdHRlckNvbXBsZW1lbnRNYXRjaFN0cmF0ZWd5OiBzdHJpbmc7XG4gIGluc2VydENvbW1hQWZ0ZXJGcm9udE1hdHRlckNvbXBsZXRpb246IGJvb2xlYW47XG5cbiAgLy8gZGVidWdcbiAgc2hvd0xvZ0Fib3V0UGVyZm9ybWFuY2VJbkNvbnNvbGU6IGJvb2xlYW47XG5cbiAgLy8gb3RoZXJzXG4gIHNlbGVjdGlvbkhpc3RvcnlUcmVlOiBTZWxlY3Rpb25IaXN0b3J5VHJlZTtcbn1cblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfU0VUVElOR1M6IFNldHRpbmdzID0ge1xuICAvLyBnZW5lcmFsXG4gIHN0cmF0ZWd5OiBcImRlZmF1bHRcIixcbiAgbWF0Y2hTdHJhdGVneTogXCJwcmVmaXhcIixcblxuICBtYXhOdW1iZXJPZlN1Z2dlc3Rpb25zOiA1LFxuICBtYXhOdW1iZXJPZldvcmRzQXNQaHJhc2U6IDMsXG4gIG1pbk51bWJlck9mQ2hhcmFjdGVyc1RyaWdnZXJlZDogMCxcbiAgbWluTnVtYmVyT2ZXb3Jkc1RyaWdnZXJlZFBocmFzZTogMSxcbiAgY29tcGxlbWVudEF1dG9tYXRpY2FsbHk6IHRydWUsXG4gIGRlbGF5TWlsbGlTZWNvbmRzOiAwLFxuICBkaXNhYmxlU3VnZ2VzdGlvbnNEdXJpbmdJbWVPbjogZmFsc2UsXG4gIGluc2VydEFmdGVyQ29tcGxldGlvbjogdHJ1ZSxcbiAgZmlyc3RDaGFyYWN0ZXJzRGlzYWJsZVN1Z2dlc3Rpb25zOiBcIjovXlwiLFxuXG4gIC8vIGFwcGVhcmFuY2VcbiAgc2hvd01hdGNoU3RyYXRlZ3k6IHRydWUsXG4gIHNob3dJbmRleGluZ1N0YXR1czogdHJ1ZSxcbiAgZGVzY3JpcHRpb25PblN1Z2dlc3Rpb246IFwiU2hvcnRcIixcblxuICAvLyBrZXkgY3VzdG9taXphdGlvblxuICBzZWxlY3RTdWdnZXN0aW9uS2V5czogXCJFbnRlclwiLFxuICBhZGRpdGlvbmFsQ3ljbGVUaHJvdWdoU3VnZ2VzdGlvbnNLZXlzOiBcIk5vbmVcIixcbiAgb3BlblNvdXJjZUZpbGVLZXk6IFwiTm9uZVwiLFxuICBwcm9wYWdhdGVFc2M6IGZhbHNlLFxuXG4gIC8vIGN1cnJlbnQgZmlsZSBjb21wbGVtZW50XG4gIGVuYWJsZUN1cnJlbnRGaWxlQ29tcGxlbWVudDogdHJ1ZSxcbiAgb25seUNvbXBsZW1lbnRFbmdsaXNoT25DdXJyZW50RmlsZUNvbXBsZW1lbnQ6IGZhbHNlLFxuXG4gIC8vIGN1cnJlbnQgdmF1bHQgY29tcGxlbWVudFxuICBlbmFibGVDdXJyZW50VmF1bHRDb21wbGVtZW50OiBmYWxzZSxcbiAgaW5jbHVkZUN1cnJlbnRWYXVsdFBhdGhQcmVmaXhQYXR0ZXJuczogXCJcIixcbiAgZXhjbHVkZUN1cnJlbnRWYXVsdFBhdGhQcmVmaXhQYXR0ZXJuczogXCJcIixcbiAgaW5jbHVkZUN1cnJlbnRWYXVsdE9ubHlGaWxlc1VuZGVyQ3VycmVudERpcmVjdG9yeTogZmFsc2UsXG5cbiAgLy8gY3VzdG9tIGRpY3Rpb25hcnkgY29tcGxlbWVudFxuICBlbmFibGVDdXN0b21EaWN0aW9uYXJ5Q29tcGxlbWVudDogZmFsc2UsXG4gIGN1c3RvbURpY3Rpb25hcnlQYXRoczogYGh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9maXJzdDIwaG91cnMvZ29vZ2xlLTEwMDAwLWVuZ2xpc2gvbWFzdGVyL2dvb2dsZS0xMDAwMC1lbmdsaXNoLW5vLXN3ZWFycy50eHRgLFxuICBjb2x1bW5EZWxpbWl0ZXI6IFwiVGFiXCIsXG4gIGN1c3RvbURpY3Rpb25hcnlXb3JkUmVnZXhQYXR0ZXJuOiBcIlwiLFxuICBkZWxpbWl0ZXJUb0hpZGVTdWdnZXN0aW9uOiBcIlwiLFxuICBkZWxpbWl0ZXJUb0RpdmlkZVN1Z2dlc3Rpb25zRm9yRGlzcGxheUZyb21JbnNlcnRpb246IFwiXCIsXG4gIGNhcmV0TG9jYXRpb25TeW1ib2xBZnRlckNvbXBsZW1lbnQ6IFwiXCIsXG4gIGRpc3BsYXllZFRleHRTdWZmaXg6IFwiID0+IC4uLlwiLFxuXG4gIC8vIGludGVybmFsIGxpbmsgY29tcGxlbWVudFxuICBlbmFibGVJbnRlcm5hbExpbmtDb21wbGVtZW50OiB0cnVlLFxuICBzdWdnZXN0SW50ZXJuYWxMaW5rV2l0aEFsaWFzOiBmYWxzZSxcbiAgZXhjbHVkZUludGVybmFsTGlua1BhdGhQcmVmaXhQYXR0ZXJuczogXCJcIixcblxuICAvLyBmcm9udCBtYXR0ZXIgY29tcGxlbWVudFxuICBlbmFibGVGcm9udE1hdHRlckNvbXBsZW1lbnQ6IHRydWUsXG4gIGZyb250TWF0dGVyQ29tcGxlbWVudE1hdGNoU3RyYXRlZ3k6IFwiaW5oZXJpdFwiLFxuICBpbnNlcnRDb21tYUFmdGVyRnJvbnRNYXR0ZXJDb21wbGV0aW9uOiBmYWxzZSxcblxuICAvLyBkZWJ1Z1xuICBzaG93TG9nQWJvdXRQZXJmb3JtYW5jZUluQ29uc29sZTogZmFsc2UsXG5cbiAgLy8gb3RoZXJzXG4gIHNlbGVjdGlvbkhpc3RvcnlUcmVlOiB7fSxcbn07XG5cbmV4cG9ydCBjbGFzcyBWYXJpb3VzQ29tcGxlbWVudHNTZXR0aW5nVGFiIGV4dGVuZHMgUGx1Z2luU2V0dGluZ1RhYiB7XG4gIHBsdWdpbjogVmFyaW91c0NvbXBvbmVudHM7XG5cbiAgY29uc3RydWN0b3IoYXBwOiBBcHAsIHBsdWdpbjogVmFyaW91c0NvbXBvbmVudHMpIHtcbiAgICBzdXBlcihhcHAsIHBsdWdpbik7XG4gICAgdGhpcy5wbHVnaW4gPSBwbHVnaW47XG4gIH1cblxuICBkaXNwbGF5KCk6IHZvaWQge1xuICAgIGxldCB7IGNvbnRhaW5lckVsIH0gPSB0aGlzO1xuXG4gICAgY29udGFpbmVyRWwuZW1wdHkoKTtcblxuICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKFwiaDJcIiwgeyB0ZXh0OiBcIlZhcmlvdXMgQ29tcGxlbWVudHMgLSBTZXR0aW5nc1wiIH0pO1xuICAgIHRoaXMuYWRkTWFpblNldHRpbmdzKGNvbnRhaW5lckVsKTtcbiAgICB0aGlzLmFkZEFwcGVhcmFuY2VTZXR0aW5ncyhjb250YWluZXJFbCk7XG4gICAgdGhpcy5hZGRLZXlDdXN0b21pemF0aW9uU2V0dGluZ3MoY29udGFpbmVyRWwpO1xuICAgIHRoaXMuYWRkQ3VycmVudEZpbGVDb21wbGVtZW50U2V0dGluZ3MoY29udGFpbmVyRWwpO1xuICAgIHRoaXMuYWRkQ3VycmVudFZhdWx0Q29tcGxlbWVudFNldHRpbmdzKGNvbnRhaW5lckVsKTtcbiAgICB0aGlzLmFkZEN1c3RvbURpY3Rpb25hcnlDb21wbGVtZW50U2V0dGluZ3MoY29udGFpbmVyRWwpO1xuICAgIHRoaXMuYWRkSW50ZXJuYWxMaW5rQ29tcGxlbWVudFNldHRpbmdzKGNvbnRhaW5lckVsKTtcbiAgICB0aGlzLmFkZEZyb250TWF0dGVyQ29tcGxlbWVudFNldHRpbmdzKGNvbnRhaW5lckVsKTtcbiAgICB0aGlzLmFkZERlYnVnU2V0dGluZ3MoY29udGFpbmVyRWwpO1xuICB9XG5cbiAgcHJpdmF0ZSBhZGRNYWluU2V0dGluZ3MoY29udGFpbmVyRWw6IEhUTUxFbGVtZW50KSB7XG4gICAgY29udGFpbmVyRWwuY3JlYXRlRWwoXCJoM1wiLCB7IHRleHQ6IFwiTWFpblwiIH0pO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpLnNldE5hbWUoXCJTdHJhdGVneVwiKS5hZGREcm9wZG93bigodGMpID0+XG4gICAgICB0Y1xuICAgICAgICAuYWRkT3B0aW9ucyhtaXJyb3JNYXAoVG9rZW5pemVTdHJhdGVneS52YWx1ZXMoKSwgKHgpID0+IHgubmFtZSkpXG4gICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5zdHJhdGVneSlcbiAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnN0cmF0ZWd5ID0gdmFsdWU7XG4gICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKHtcbiAgICAgICAgICAgIGN1cnJlbnRGaWxlOiB0cnVlLFxuICAgICAgICAgICAgY3VycmVudFZhdWx0OiB0cnVlLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9KVxuICAgICk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbCkuc2V0TmFtZShcIk1hdGNoIHN0cmF0ZWd5XCIpLmFkZERyb3Bkb3duKCh0YykgPT5cbiAgICAgIHRjXG4gICAgICAgIC5hZGRPcHRpb25zKG1pcnJvck1hcChNYXRjaFN0cmF0ZWd5LnZhbHVlcygpLCAoeCkgPT4geC5uYW1lKSlcbiAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLm1hdGNoU3RyYXRlZ3kpXG4gICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5tYXRjaFN0cmF0ZWd5ID0gdmFsdWU7XG4gICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgIH0pXG4gICAgKTtcbiAgICBpZiAodGhpcy5wbHVnaW4uc2V0dGluZ3MubWF0Y2hTdHJhdGVneSA9PT0gTWF0Y2hTdHJhdGVneS5QQVJUSUFMLm5hbWUpIHtcbiAgICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKFwiZGl2XCIsIHtcbiAgICAgICAgdGV4dDogXCLimqAgYHBhcnRpYWxgIGlzIG1vcmUgdGhhbiAxMCB0aW1lcyBzbG93ZXIgdGhhbiBgcHJlZml4YFwiLFxuICAgICAgICBjbHM6IFwidmFyaW91cy1jb21wbGVtZW50c19fc2V0dGluZ3NfX3dhcm5pbmdcIixcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJNYXggbnVtYmVyIG9mIHN1Z2dlc3Rpb25zXCIpXG4gICAgICAuYWRkU2xpZGVyKChzYykgPT5cbiAgICAgICAgc2NcbiAgICAgICAgICAuc2V0TGltaXRzKDEsIDI1NSwgMSlcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MubWF4TnVtYmVyT2ZTdWdnZXN0aW9ucylcbiAgICAgICAgICAuc2V0RHluYW1pY1Rvb2x0aXAoKVxuICAgICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLm1heE51bWJlck9mU3VnZ2VzdGlvbnMgPSB2YWx1ZTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgIH0pXG4gICAgICApO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIk1heCBudW1iZXIgb2Ygd29yZHMgYXMgYSBwaHJhc2VcIilcbiAgICAgIC5zZXREZXNjKGBb4pqgV2FybmluZ10gSXQgbWFrZXMgc2xvd2VyIG1vcmUgdGhhbiBOIHRpbWVzIChOIGlzIHNldCB2YWx1ZSlgKVxuICAgICAgLmFkZFNsaWRlcigoc2MpID0+XG4gICAgICAgIHNjXG4gICAgICAgICAgLnNldExpbWl0cygxLCAxMCwgMSlcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MubWF4TnVtYmVyT2ZXb3Jkc0FzUGhyYXNlKVxuICAgICAgICAgIC5zZXREeW5hbWljVG9vbHRpcCgpXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MubWF4TnVtYmVyT2ZXb3Jkc0FzUGhyYXNlID0gdmFsdWU7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICB9KVxuICAgICAgKTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJNaW4gbnVtYmVyIG9mIGNoYXJhY3RlcnMgZm9yIHRyaWdnZXJcIilcbiAgICAgIC5zZXREZXNjKFwiSXQgdXNlcyBhIGRlZmF1bHQgdmFsdWUgb2YgU3RyYXRlZ3kgaWYgc2V0IDAuXCIpXG4gICAgICAuYWRkU2xpZGVyKChzYykgPT5cbiAgICAgICAgc2NcbiAgICAgICAgICAuc2V0TGltaXRzKDAsIDEwLCAxKVxuICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5taW5OdW1iZXJPZkNoYXJhY3RlcnNUcmlnZ2VyZWQpXG4gICAgICAgICAgLnNldER5bmFtaWNUb29sdGlwKClcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5taW5OdW1iZXJPZkNoYXJhY3RlcnNUcmlnZ2VyZWQgPSB2YWx1ZTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgIH0pXG4gICAgICApO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIk1pbiBudW1iZXIgb2Ygd29yZHMgZm9yIHRyaWdnZXJcIilcbiAgICAgIC5hZGRTbGlkZXIoKHNjKSA9PlxuICAgICAgICBzY1xuICAgICAgICAgIC5zZXRMaW1pdHMoMSwgMTAsIDEpXG4gICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLm1pbk51bWJlck9mV29yZHNUcmlnZ2VyZWRQaHJhc2UpXG4gICAgICAgICAgLnNldER5bmFtaWNUb29sdGlwKClcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5taW5OdW1iZXJPZldvcmRzVHJpZ2dlcmVkUGhyYXNlID0gdmFsdWU7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICB9KVxuICAgICAgKTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJDb21wbGVtZW50IGF1dG9tYXRpY2FsbHlcIilcbiAgICAgIC5hZGRUb2dnbGUoKHRjKSA9PiB7XG4gICAgICAgIHRjLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLmNvbXBsZW1lbnRBdXRvbWF0aWNhbGx5KS5vbkNoYW5nZShcbiAgICAgICAgICBhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmNvbXBsZW1lbnRBdXRvbWF0aWNhbGx5ID0gdmFsdWU7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgICB9KTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJEZWxheSBtaWxsaS1zZWNvbmRzIGZvciB0cmlnZ2VyXCIpXG4gICAgICAuYWRkU2xpZGVyKChzYykgPT5cbiAgICAgICAgc2NcbiAgICAgICAgICAuc2V0TGltaXRzKDAsIDEwMDAsIDEwKVxuICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5kZWxheU1pbGxpU2Vjb25kcylcbiAgICAgICAgICAuc2V0RHluYW1pY1Rvb2x0aXAoKVxuICAgICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmRlbGF5TWlsbGlTZWNvbmRzID0gdmFsdWU7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICB9KVxuICAgICAgKTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJEaXNhYmxlIHN1Z2dlc3Rpb25zIGR1cmluZyBJTUUgb25cIilcbiAgICAgIC5hZGRUb2dnbGUoKHRjKSA9PiB7XG4gICAgICAgIHRjLnNldFZhbHVlKFxuICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmRpc2FibGVTdWdnZXN0aW9uc0R1cmluZ0ltZU9uXG4gICAgICAgICkub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuZGlzYWJsZVN1Z2dlc3Rpb25zRHVyaW5nSW1lT24gPSB2YWx1ZTtcbiAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJJbnNlcnQgc3BhY2UgYWZ0ZXIgY29tcGxldGlvblwiKVxuICAgICAgLmFkZFRvZ2dsZSgodGMpID0+IHtcbiAgICAgICAgdGMuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MuaW5zZXJ0QWZ0ZXJDb21wbGV0aW9uKS5vbkNoYW5nZShcbiAgICAgICAgICBhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmluc2VydEFmdGVyQ29tcGxldGlvbiA9IHZhbHVlO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgfSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiRmlyc3QgY2hhcmFjdGVycyB0byBkaXNhYmxlIHN1Z2dlc3Rpb25zXCIpXG4gICAgICAuYWRkVGV4dCgoY2IpID0+IHtcbiAgICAgICAgY2Iuc2V0VmFsdWUoXG4gICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuZmlyc3RDaGFyYWN0ZXJzRGlzYWJsZVN1Z2dlc3Rpb25zXG4gICAgICAgICkub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuZmlyc3RDaGFyYWN0ZXJzRGlzYWJsZVN1Z2dlc3Rpb25zID0gdmFsdWU7XG4gICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGFkZEFwcGVhcmFuY2VTZXR0aW5ncyhjb250YWluZXJFbDogSFRNTEVsZW1lbnQpIHtcbiAgICBjb250YWluZXJFbC5jcmVhdGVFbChcImgzXCIsIHsgdGV4dDogXCJBcHBlYXJhbmNlXCIgfSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiU2hvdyBNYXRjaCBzdHJhdGVneVwiKVxuICAgICAgLnNldERlc2MoXG4gICAgICAgIFwiU2hvdyBNYXRjaCBzdHJhdGVneSBhdCB0aGUgc3RhdHVzIGJhci4gQ2hhbmdpbmcgdGhpcyBvcHRpb24gcmVxdWlyZXMgYSByZXN0YXJ0IHRvIHRha2UgZWZmZWN0LlwiXG4gICAgICApXG4gICAgICAuYWRkVG9nZ2xlKCh0YykgPT4ge1xuICAgICAgICB0Yy5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5zaG93TWF0Y2hTdHJhdGVneSkub25DaGFuZ2UoXG4gICAgICAgICAgYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5zaG93TWF0Y2hTdHJhdGVneSA9IHZhbHVlO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgfSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiU2hvdyBJbmRleGluZyBzdGF0dXNcIilcbiAgICAgIC5zZXREZXNjKFxuICAgICAgICBcIlNob3cgaW5kZXhpbmcgc3RhdHVzIGF0IHRoZSBzdGF0dXMgYmFyLiBDaGFuZ2luZyB0aGlzIG9wdGlvbiByZXF1aXJlcyBhIHJlc3RhcnQgdG8gdGFrZSBlZmZlY3QuXCJcbiAgICAgIClcbiAgICAgIC5hZGRUb2dnbGUoKHRjKSA9PiB7XG4gICAgICAgIHRjLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnNob3dJbmRleGluZ1N0YXR1cykub25DaGFuZ2UoXG4gICAgICAgICAgYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5zaG93SW5kZXhpbmdTdGF0dXMgPSB2YWx1ZTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgIH0pO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIkRlc2NyaXB0aW9uIG9uIGEgc3VnZ2VzdGlvblwiKVxuICAgICAgLmFkZERyb3Bkb3duKCh0YykgPT5cbiAgICAgICAgdGNcbiAgICAgICAgICAuYWRkT3B0aW9ucyhcbiAgICAgICAgICAgIG1pcnJvck1hcChEZXNjcmlwdGlvbk9uU3VnZ2VzdGlvbi52YWx1ZXMoKSwgKHgpID0+IHgubmFtZSlcbiAgICAgICAgICApXG4gICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLmRlc2NyaXB0aW9uT25TdWdnZXN0aW9uKVxuICAgICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmRlc2NyaXB0aW9uT25TdWdnZXN0aW9uID0gdmFsdWU7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICB9KVxuICAgICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgYWRkS2V5Q3VzdG9taXphdGlvblNldHRpbmdzKGNvbnRhaW5lckVsOiBIVE1MRWxlbWVudCkge1xuICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKFwiaDNcIiwgeyB0ZXh0OiBcIktleSBjdXN0b21pemF0aW9uXCIgfSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiU2VsZWN0IGEgc3VnZ2VzdGlvbiBrZXlcIilcbiAgICAgIC5hZGREcm9wZG93bigodGMpID0+XG4gICAgICAgIHRjXG4gICAgICAgICAgLmFkZE9wdGlvbnMobWlycm9yTWFwKFNlbGVjdFN1Z2dlc3Rpb25LZXkudmFsdWVzKCksICh4KSA9PiB4Lm5hbWUpKVxuICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5zZWxlY3RTdWdnZXN0aW9uS2V5cylcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5zZWxlY3RTdWdnZXN0aW9uS2V5cyA9IHZhbHVlO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgfSlcbiAgICAgICk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiQWRkaXRpb25hbCBjeWNsZSB0aHJvdWdoIHN1Z2dlc3Rpb25zIGtleXNcIilcbiAgICAgIC5hZGREcm9wZG93bigodGMpID0+XG4gICAgICAgIHRjXG4gICAgICAgICAgLmFkZE9wdGlvbnMoXG4gICAgICAgICAgICBtaXJyb3JNYXAoQ3ljbGVUaHJvdWdoU3VnZ2VzdGlvbnNLZXlzLnZhbHVlcygpLCAoeCkgPT4geC5uYW1lKVxuICAgICAgICAgIClcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MuYWRkaXRpb25hbEN5Y2xlVGhyb3VnaFN1Z2dlc3Rpb25zS2V5cylcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5hZGRpdGlvbmFsQ3ljbGVUaHJvdWdoU3VnZ2VzdGlvbnNLZXlzID0gdmFsdWU7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICB9KVxuICAgICAgKTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKS5zZXROYW1lKFwiT3BlbiBzb3VyY2UgZmlsZSBrZXlcIikuYWRkRHJvcGRvd24oKHRjKSA9PlxuICAgICAgdGNcbiAgICAgICAgLmFkZE9wdGlvbnMobWlycm9yTWFwKE9wZW5Tb3VyY2VGaWxlS2V5cy52YWx1ZXMoKSwgKHgpID0+IHgubmFtZSkpXG4gICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5vcGVuU291cmNlRmlsZUtleSlcbiAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLm9wZW5Tb3VyY2VGaWxlS2V5ID0gdmFsdWU7XG4gICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgIH0pXG4gICAgKTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJQcm9wYWdhdGUgRVNDXCIpXG4gICAgICAuc2V0RGVzYyhcbiAgICAgICAgXCJJdCBpcyBoYW5keSBpZiB5b3UgdXNlIFZpbSBtb2RlIGJlY2F1c2UgeW91IGNhbiBzd2l0Y2ggdG8gTm9ybWFsIG1vZGUgYnkgb25lIEVTQywgd2hldGhlciBpdCBzaG93cyBzdWdnZXN0aW9ucyBvciBub3QuXCJcbiAgICAgIClcbiAgICAgIC5hZGRUb2dnbGUoKHRjKSA9PiB7XG4gICAgICAgIHRjLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnByb3BhZ2F0ZUVzYykub25DaGFuZ2UoXG4gICAgICAgICAgYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5wcm9wYWdhdGVFc2MgPSB2YWx1ZTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBhZGRDdXJyZW50RmlsZUNvbXBsZW1lbnRTZXR0aW5ncyhjb250YWluZXJFbDogSFRNTEVsZW1lbnQpIHtcbiAgICBjb250YWluZXJFbC5jcmVhdGVFbChcImgzXCIsIHtcbiAgICAgIHRleHQ6IFwiQ3VycmVudCBmaWxlIGNvbXBsZW1lbnRcIixcbiAgICAgIGNsczogXCJ2YXJpb3VzLWNvbXBsZW1lbnRzX19zZXR0aW5nc19faGVhZGVyIHZhcmlvdXMtY29tcGxlbWVudHNfX3NldHRpbmdzX19oZWFkZXJfX2N1cnJlbnQtZmlsZVwiLFxuICAgIH0pO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIkVuYWJsZSBDdXJyZW50IGZpbGUgY29tcGxlbWVudFwiKVxuICAgICAgLmFkZFRvZ2dsZSgodGMpID0+IHtcbiAgICAgICAgdGMuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MuZW5hYmxlQ3VycmVudEZpbGVDb21wbGVtZW50KS5vbkNoYW5nZShcbiAgICAgICAgICBhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmVuYWJsZUN1cnJlbnRGaWxlQ29tcGxlbWVudCA9IHZhbHVlO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKHsgY3VycmVudEZpbGU6IHRydWUgfSk7XG4gICAgICAgICAgICB0aGlzLmRpc3BsYXkoKTtcbiAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgICB9KTtcblxuICAgIGlmICh0aGlzLnBsdWdpbi5zZXR0aW5ncy5lbmFibGVDdXJyZW50RmlsZUNvbXBsZW1lbnQpIHtcbiAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAuc2V0TmFtZShcIk9ubHkgY29tcGxlbWVudCBFbmdsaXNoIG9uIGN1cnJlbnQgZmlsZSBjb21wbGVtZW50XCIpXG4gICAgICAgIC5hZGRUb2dnbGUoKHRjKSA9PiB7XG4gICAgICAgICAgdGMuc2V0VmFsdWUoXG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5vbmx5Q29tcGxlbWVudEVuZ2xpc2hPbkN1cnJlbnRGaWxlQ29tcGxlbWVudFxuICAgICAgICAgICkub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5vbmx5Q29tcGxlbWVudEVuZ2xpc2hPbkN1cnJlbnRGaWxlQ29tcGxlbWVudCA9XG4gICAgICAgICAgICAgIHZhbHVlO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKHsgY3VycmVudEZpbGU6IHRydWUgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgYWRkQ3VycmVudFZhdWx0Q29tcGxlbWVudFNldHRpbmdzKGNvbnRhaW5lckVsOiBIVE1MRWxlbWVudCkge1xuICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKFwiaDNcIiwge1xuICAgICAgdGV4dDogXCJDdXJyZW50IHZhdWx0IGNvbXBsZW1lbnRcIixcbiAgICAgIGNsczogXCJ2YXJpb3VzLWNvbXBsZW1lbnRzX19zZXR0aW5nc19faGVhZGVyIHZhcmlvdXMtY29tcGxlbWVudHNfX3NldHRpbmdzX19oZWFkZXJfX2N1cnJlbnQtdmF1bHRcIixcbiAgICB9KTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJFbmFibGUgQ3VycmVudCB2YXVsdCBjb21wbGVtZW50XCIpXG4gICAgICAuYWRkVG9nZ2xlKCh0YykgPT4ge1xuICAgICAgICB0Yy5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5lbmFibGVDdXJyZW50VmF1bHRDb21wbGVtZW50KS5vbkNoYW5nZShcbiAgICAgICAgICBhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmVuYWJsZUN1cnJlbnRWYXVsdENvbXBsZW1lbnQgPSB2YWx1ZTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncyh7IGN1cnJlbnRWYXVsdDogdHJ1ZSB9KTtcbiAgICAgICAgICAgIHRoaXMuZGlzcGxheSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgIH0pO1xuXG4gICAgaWYgKHRoaXMucGx1Z2luLnNldHRpbmdzLmVuYWJsZUN1cnJlbnRWYXVsdENvbXBsZW1lbnQpIHtcbiAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAuc2V0TmFtZShcIkluY2x1ZGUgcHJlZml4IHBhdGggcGF0dGVybnNcIilcbiAgICAgICAgLnNldERlc2MoXCJQcmVmaXggbWF0Y2ggcGF0aCBwYXR0ZXJucyB0byBpbmNsdWRlIGZpbGVzLlwiKVxuICAgICAgICAuYWRkVGV4dEFyZWEoKHRhYykgPT4ge1xuICAgICAgICAgIGNvbnN0IGVsID0gdGFjXG4gICAgICAgICAgICAuc2V0VmFsdWUoXG4gICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmluY2x1ZGVDdXJyZW50VmF1bHRQYXRoUHJlZml4UGF0dGVybnNcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIC5zZXRQbGFjZWhvbGRlcihcIlByaXZhdGUvXCIpXG4gICAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmluY2x1ZGVDdXJyZW50VmF1bHRQYXRoUHJlZml4UGF0dGVybnMgPVxuICAgICAgICAgICAgICAgIHZhbHVlO1xuICAgICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIGVsLmlucHV0RWwuY2xhc3NOYW1lID1cbiAgICAgICAgICAgIFwidmFyaW91cy1jb21wbGVtZW50c19fc2V0dGluZ3NfX3RleHQtYXJlYS1wYXRoXCI7XG4gICAgICAgICAgcmV0dXJuIGVsO1xuICAgICAgICB9KTtcbiAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAuc2V0TmFtZShcIkV4Y2x1ZGUgcHJlZml4IHBhdGggcGF0dGVybnNcIilcbiAgICAgICAgLnNldERlc2MoXCJQcmVmaXggbWF0Y2ggcGF0aCBwYXR0ZXJucyB0byBleGNsdWRlIGZpbGVzLlwiKVxuICAgICAgICAuYWRkVGV4dEFyZWEoKHRhYykgPT4ge1xuICAgICAgICAgIGNvbnN0IGVsID0gdGFjXG4gICAgICAgICAgICAuc2V0VmFsdWUoXG4gICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmV4Y2x1ZGVDdXJyZW50VmF1bHRQYXRoUHJlZml4UGF0dGVybnNcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIC5zZXRQbGFjZWhvbGRlcihcIlByaXZhdGUvXCIpXG4gICAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmV4Y2x1ZGVDdXJyZW50VmF1bHRQYXRoUHJlZml4UGF0dGVybnMgPVxuICAgICAgICAgICAgICAgIHZhbHVlO1xuICAgICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIGVsLmlucHV0RWwuY2xhc3NOYW1lID1cbiAgICAgICAgICAgIFwidmFyaW91cy1jb21wbGVtZW50c19fc2V0dGluZ3NfX3RleHQtYXJlYS1wYXRoXCI7XG4gICAgICAgICAgcmV0dXJuIGVsO1xuICAgICAgICB9KTtcbiAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAuc2V0TmFtZShcIkluY2x1ZGUgb25seSBmaWxlcyB1bmRlciBjdXJyZW50IGRpcmVjdG9yeVwiKVxuICAgICAgICAuYWRkVG9nZ2xlKCh0YykgPT4ge1xuICAgICAgICAgIHRjLnNldFZhbHVlKFxuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3NcbiAgICAgICAgICAgICAgLmluY2x1ZGVDdXJyZW50VmF1bHRPbmx5RmlsZXNVbmRlckN1cnJlbnREaXJlY3RvcnlcbiAgICAgICAgICApLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuaW5jbHVkZUN1cnJlbnRWYXVsdE9ubHlGaWxlc1VuZGVyQ3VycmVudERpcmVjdG9yeSA9XG4gICAgICAgICAgICAgIHZhbHVlO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgYWRkQ3VzdG9tRGljdGlvbmFyeUNvbXBsZW1lbnRTZXR0aW5ncyhjb250YWluZXJFbDogSFRNTEVsZW1lbnQpIHtcbiAgICBjb250YWluZXJFbC5jcmVhdGVFbChcImgzXCIsIHtcbiAgICAgIHRleHQ6IFwiQ3VzdG9tIGRpY3Rpb25hcnkgY29tcGxlbWVudFwiLFxuICAgICAgY2xzOiBcInZhcmlvdXMtY29tcGxlbWVudHNfX3NldHRpbmdzX19oZWFkZXIgdmFyaW91cy1jb21wbGVtZW50c19fc2V0dGluZ3NfX2hlYWRlcl9fY3VzdG9tLWRpY3Rpb25hcnlcIixcbiAgICB9KTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJFbmFibGUgQ3VzdG9tIGRpY3Rpb25hcnkgY29tcGxlbWVudFwiKVxuICAgICAgLmFkZFRvZ2dsZSgodGMpID0+IHtcbiAgICAgICAgdGMuc2V0VmFsdWUoXG4gICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuZW5hYmxlQ3VzdG9tRGljdGlvbmFyeUNvbXBsZW1lbnRcbiAgICAgICAgKS5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5lbmFibGVDdXN0b21EaWN0aW9uYXJ5Q29tcGxlbWVudCA9IHZhbHVlO1xuICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncyh7IGN1c3RvbURpY3Rpb25hcnk6IHRydWUgfSk7XG4gICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICBpZiAodGhpcy5wbHVnaW4uc2V0dGluZ3MuZW5hYmxlQ3VzdG9tRGljdGlvbmFyeUNvbXBsZW1lbnQpIHtcbiAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAuc2V0TmFtZShcIkN1c3RvbSBkaWN0aW9uYXJ5IHBhdGhzXCIpXG4gICAgICAgIC5zZXREZXNjKFxuICAgICAgICAgIFwiU3BlY2lmeSBlaXRoZXIgYSByZWxhdGl2ZSBwYXRoIGZyb20gVmF1bHQgcm9vdCBvciBVUkwgZm9yIGVhY2ggbGluZS5cIlxuICAgICAgICApXG4gICAgICAgIC5hZGRUZXh0QXJlYSgodGFjKSA9PiB7XG4gICAgICAgICAgY29uc3QgZWwgPSB0YWNcbiAgICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5jdXN0b21EaWN0aW9uYXJ5UGF0aHMpXG4gICAgICAgICAgICAuc2V0UGxhY2Vob2xkZXIoXCJkaWN0aW9uYXJ5Lm1kXCIpXG4gICAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmN1c3RvbURpY3Rpb25hcnlQYXRocyA9IHZhbHVlO1xuICAgICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIGVsLmlucHV0RWwuY2xhc3NOYW1lID1cbiAgICAgICAgICAgIFwidmFyaW91cy1jb21wbGVtZW50c19fc2V0dGluZ3NfX3RleHQtYXJlYS1wYXRoXCI7XG4gICAgICAgICAgcmV0dXJuIGVsO1xuICAgICAgICB9KTtcblxuICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpLnNldE5hbWUoXCJDb2x1bW4gZGVsaW1pdGVyXCIpLmFkZERyb3Bkb3duKCh0YykgPT5cbiAgICAgICAgdGNcbiAgICAgICAgICAuYWRkT3B0aW9ucyhtaXJyb3JNYXAoQ29sdW1uRGVsaW1pdGVyLnZhbHVlcygpLCAoeCkgPT4geC5uYW1lKSlcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MuY29sdW1uRGVsaW1pdGVyKVxuICAgICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmNvbHVtbkRlbGltaXRlciA9IHZhbHVlO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgfSlcbiAgICAgICk7XG5cbiAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAuc2V0TmFtZShcIldvcmQgcmVnZXggcGF0dGVyblwiKVxuICAgICAgICAuc2V0RGVzYyhcIk9ubHkgbG9hZCB3b3JkcyB0aGF0IG1hdGNoIHRoZSByZWd1bGFyIGV4cHJlc3Npb24gcGF0dGVybi5cIilcbiAgICAgICAgLmFkZFRleHQoKGNiKSA9PiB7XG4gICAgICAgICAgY2Iuc2V0VmFsdWUoXG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5jdXN0b21EaWN0aW9uYXJ5V29yZFJlZ2V4UGF0dGVyblxuICAgICAgICAgICkub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5jdXN0b21EaWN0aW9uYXJ5V29yZFJlZ2V4UGF0dGVybiA9IHZhbHVlO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgLnNldE5hbWUoXCJEZWxpbWl0ZXIgdG8gaGlkZSBhIHN1Z2dlc3Rpb25cIilcbiAgICAgICAgLnNldERlc2MoXG4gICAgICAgICAgXCJJZiBzZXQgJzs7OycsICdhYmNkOzs7ZWZnJyBpcyBzaG93biBhcyAnYWJjZCcgb24gc3VnZ2VzdGlvbnMsIGJ1dCBjb21wbGV0ZXMgdG8gJ2FiY2RlZmcnLlwiXG4gICAgICAgIClcbiAgICAgICAgLmFkZFRleHQoKGNiKSA9PiB7XG4gICAgICAgICAgY2Iuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MuZGVsaW1pdGVyVG9IaWRlU3VnZ2VzdGlvbikub25DaGFuZ2UoXG4gICAgICAgICAgICBhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuZGVsaW1pdGVyVG9IaWRlU3VnZ2VzdGlvbiA9IHZhbHVlO1xuICAgICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICApO1xuICAgICAgICB9KTtcblxuICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAgIC5zZXROYW1lKFxuICAgICAgICAgIFwiRGVsaW1pdGVyIHRvIGRpdmlkZSBzdWdnZXN0aW9ucyBmb3IgZGlzcGxheSBmcm9tIG9uZXMgZm9yIGluc2VydGlvblwiXG4gICAgICAgIClcbiAgICAgICAgLnNldERlc2MoXG4gICAgICAgICAgXCJJZiBzZXQgJyA+Pj4gJywgJ2Rpc3BsYXllZCA+Pj4gaW5zZXJ0ZWQnIGlzIHNob3duIGFzICdkaXNwbGF5ZWQnIG9uIHN1Z2dlc3Rpb25zLCBidXQgY29tcGxldGVzIHRvICdpbnNlcnRlZCcuXCJcbiAgICAgICAgKVxuICAgICAgICAuYWRkVGV4dCgoY2IpID0+IHtcbiAgICAgICAgICBjYi5zZXRWYWx1ZShcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzXG4gICAgICAgICAgICAgIC5kZWxpbWl0ZXJUb0RpdmlkZVN1Z2dlc3Rpb25zRm9yRGlzcGxheUZyb21JbnNlcnRpb25cbiAgICAgICAgICApLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuZGVsaW1pdGVyVG9EaXZpZGVTdWdnZXN0aW9uc0ZvckRpc3BsYXlGcm9tSW5zZXJ0aW9uID1cbiAgICAgICAgICAgICAgdmFsdWU7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAuc2V0TmFtZShcIkNhcmV0IGxvY2F0aW9uIHN5bWJvbCBhZnRlciBjb21wbGVtZW50XCIpXG4gICAgICAgIC5zZXREZXNjKFxuICAgICAgICAgIFwiSWYgc2V0ICc8Q0FSRVQ+JyBhbmQgdGhlcmUgaXMgJzxsaT48Q0FSRVQ+PC9saT4nIGluIGN1c3RvbSBkaWN0aW9uYXJ5LCBpdCBjb21wbGVtZW50cyAnPGxpPjwvbGk+JyBhbmQgbW92ZSBhIGNhcmV0IHdoZXJlIGJldHdlZW4gJzxsaT4nIGFuZCBgPC9saT5gLlwiXG4gICAgICAgIClcbiAgICAgICAgLmFkZFRleHQoKGNiKSA9PiB7XG4gICAgICAgICAgY2Iuc2V0VmFsdWUoXG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5jYXJldExvY2F0aW9uU3ltYm9sQWZ0ZXJDb21wbGVtZW50XG4gICAgICAgICAgKS5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmNhcmV0TG9jYXRpb25TeW1ib2xBZnRlckNvbXBsZW1lbnQgPSB2YWx1ZTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAgIC5zZXROYW1lKFwiRGlzcGxheWVkIHRleHQgc3VmZml4XCIpXG4gICAgICAgIC5zZXREZXNjKFxuICAgICAgICAgIFwiSXQgc2hvd3MgYXMgYSBzdWZmaXggb2YgZGlzcGxheWVkIHRleHQgaWYgdGhlcmUgaXMgYSBkaWZmZXJlbmNlIGJldHdlZW4gZGlzcGxheWVkIGFuZCBpbnNlcnRlZFwiXG4gICAgICAgIClcbiAgICAgICAgLmFkZFRleHQoKGNiKSA9PiB7XG4gICAgICAgICAgY2Iuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MuZGlzcGxheWVkVGV4dFN1ZmZpeCkub25DaGFuZ2UoXG4gICAgICAgICAgICBhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuZGlzcGxheWVkVGV4dFN1ZmZpeCA9IHZhbHVlO1xuICAgICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICApO1xuICAgICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFkZEludGVybmFsTGlua0NvbXBsZW1lbnRTZXR0aW5ncyhjb250YWluZXJFbDogSFRNTEVsZW1lbnQpIHtcbiAgICBjb250YWluZXJFbC5jcmVhdGVFbChcImgzXCIsIHtcbiAgICAgIHRleHQ6IFwiSW50ZXJuYWwgbGluayBjb21wbGVtZW50XCIsXG4gICAgICBjbHM6IFwidmFyaW91cy1jb21wbGVtZW50c19fc2V0dGluZ3NfX2hlYWRlciB2YXJpb3VzLWNvbXBsZW1lbnRzX19zZXR0aW5nc19faGVhZGVyX19pbnRlcm5hbC1saW5rXCIsXG4gICAgfSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiRW5hYmxlIEludGVybmFsIGxpbmsgY29tcGxlbWVudFwiKVxuICAgICAgLmFkZFRvZ2dsZSgodGMpID0+IHtcbiAgICAgICAgdGMuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MuZW5hYmxlSW50ZXJuYWxMaW5rQ29tcGxlbWVudCkub25DaGFuZ2UoXG4gICAgICAgICAgYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5lbmFibGVJbnRlcm5hbExpbmtDb21wbGVtZW50ID0gdmFsdWU7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoeyBpbnRlcm5hbExpbms6IHRydWUgfSk7XG4gICAgICAgICAgICB0aGlzLmRpc3BsYXkoKTtcbiAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgICB9KTtcblxuICAgIGlmICh0aGlzLnBsdWdpbi5zZXR0aW5ncy5lbmFibGVJbnRlcm5hbExpbmtDb21wbGVtZW50KSB7XG4gICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgLnNldE5hbWUoXCJTdWdnZXN0IHdpdGggYW4gYWxpYXNcIilcbiAgICAgICAgLmFkZFRvZ2dsZSgodGMpID0+IHtcbiAgICAgICAgICB0Yy5zZXRWYWx1ZShcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnN1Z2dlc3RJbnRlcm5hbExpbmtXaXRoQWxpYXNcbiAgICAgICAgICApLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3Muc3VnZ2VzdEludGVybmFsTGlua1dpdGhBbGlhcyA9IHZhbHVlO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKHsgaW50ZXJuYWxMaW5rOiB0cnVlIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAuc2V0TmFtZShcIkV4Y2x1ZGUgcHJlZml4IHBhdGggcGF0dGVybnNcIilcbiAgICAgICAgLnNldERlc2MoXCJQcmVmaXggbWF0Y2ggcGF0aCBwYXR0ZXJucyB0byBleGNsdWRlIGZpbGVzLlwiKVxuICAgICAgICAuYWRkVGV4dEFyZWEoKHRhYykgPT4ge1xuICAgICAgICAgIGNvbnN0IGVsID0gdGFjXG4gICAgICAgICAgICAuc2V0VmFsdWUoXG4gICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmV4Y2x1ZGVJbnRlcm5hbExpbmtQYXRoUHJlZml4UGF0dGVybnNcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIC5zZXRQbGFjZWhvbGRlcihcIlByaXZhdGUvXCIpXG4gICAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmV4Y2x1ZGVJbnRlcm5hbExpbmtQYXRoUHJlZml4UGF0dGVybnMgPVxuICAgICAgICAgICAgICAgIHZhbHVlO1xuICAgICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIGVsLmlucHV0RWwuY2xhc3NOYW1lID1cbiAgICAgICAgICAgIFwidmFyaW91cy1jb21wbGVtZW50c19fc2V0dGluZ3NfX3RleHQtYXJlYS1wYXRoXCI7XG4gICAgICAgICAgcmV0dXJuIGVsO1xuICAgICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFkZEZyb250TWF0dGVyQ29tcGxlbWVudFNldHRpbmdzKGNvbnRhaW5lckVsOiBIVE1MRWxlbWVudCkge1xuICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKFwiaDNcIiwge1xuICAgICAgdGV4dDogXCJGcm9udCBtYXR0ZXIgY29tcGxlbWVudFwiLFxuICAgICAgY2xzOiBcInZhcmlvdXMtY29tcGxlbWVudHNfX3NldHRpbmdzX19oZWFkZXIgdmFyaW91cy1jb21wbGVtZW50c19fc2V0dGluZ3NfX2hlYWRlcl9fZnJvbnQtbWF0dGVyXCIsXG4gICAgfSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiRW5hYmxlIEZyb250IG1hdHRlciBjb21wbGVtZW50XCIpXG4gICAgICAuYWRkVG9nZ2xlKCh0YykgPT4ge1xuICAgICAgICB0Yy5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5lbmFibGVGcm9udE1hdHRlckNvbXBsZW1lbnQpLm9uQ2hhbmdlKFxuICAgICAgICAgIGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuZW5hYmxlRnJvbnRNYXR0ZXJDb21wbGVtZW50ID0gdmFsdWU7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoeyBmcm9udE1hdHRlcjogdHJ1ZSB9KTtcbiAgICAgICAgICAgIHRoaXMuZGlzcGxheSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgIH0pO1xuXG4gICAgaWYgKHRoaXMucGx1Z2luLnNldHRpbmdzLmVuYWJsZUZyb250TWF0dGVyQ29tcGxlbWVudCkge1xuICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAgIC5zZXROYW1lKFwiTWF0Y2ggc3RyYXRlZ3kgaW4gdGhlIGZyb250IG1hdHRlclwiKVxuICAgICAgICAuYWRkRHJvcGRvd24oKHRjKSA9PlxuICAgICAgICAgIHRjXG4gICAgICAgICAgICAuYWRkT3B0aW9ucyhcbiAgICAgICAgICAgICAgbWlycm9yTWFwKFNwZWNpZmljTWF0Y2hTdHJhdGVneS52YWx1ZXMoKSwgKHgpID0+IHgubmFtZSlcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5mcm9udE1hdHRlckNvbXBsZW1lbnRNYXRjaFN0cmF0ZWd5KVxuICAgICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5mcm9udE1hdHRlckNvbXBsZW1lbnRNYXRjaFN0cmF0ZWd5ID0gdmFsdWU7XG4gICAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgKTtcblxuICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAgIC5zZXROYW1lKFwiSW5zZXJ0IGNvbW1hIGFmdGVyIGNvbXBsZXRpb25cIilcbiAgICAgICAgLmFkZFRvZ2dsZSgodGMpID0+IHtcbiAgICAgICAgICB0Yy5zZXRWYWx1ZShcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmluc2VydENvbW1hQWZ0ZXJGcm9udE1hdHRlckNvbXBsZXRpb25cbiAgICAgICAgICApLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuaW5zZXJ0Q29tbWFBZnRlckZyb250TWF0dGVyQ29tcGxldGlvbiA9IHZhbHVlO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgYWRkRGVidWdTZXR0aW5ncyhjb250YWluZXJFbDogSFRNTEVsZW1lbnQpIHtcbiAgICBjb250YWluZXJFbC5jcmVhdGVFbChcImgzXCIsIHsgdGV4dDogXCJEZWJ1Z1wiIH0pO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIlNob3cgbG9nIGFib3V0IHBlcmZvcm1hbmNlIGluIGEgY29uc29sZVwiKVxuICAgICAgLmFkZFRvZ2dsZSgodGMpID0+IHtcbiAgICAgICAgdGMuc2V0VmFsdWUoXG4gICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3Muc2hvd0xvZ0Fib3V0UGVyZm9ybWFuY2VJbkNvbnNvbGVcbiAgICAgICAgKS5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5zaG93TG9nQWJvdXRQZXJmb3JtYW5jZUluQ29uc29sZSA9IHZhbHVlO1xuICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgdG9nZ2xlTWF0Y2hTdHJhdGVneSgpIHtcbiAgICBzd2l0Y2ggKHRoaXMucGx1Z2luLnNldHRpbmdzLm1hdGNoU3RyYXRlZ3kpIHtcbiAgICAgIGNhc2UgXCJwcmVmaXhcIjpcbiAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MubWF0Y2hTdHJhdGVneSA9IFwicGFydGlhbFwiO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJwYXJ0aWFsXCI6XG4gICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLm1hdGNoU3RyYXRlZ3kgPSBcInByZWZpeFwiO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIC8vIG5vaW5zcGVjdGlvbiBPYmplY3RBbGxvY2F0aW9uSWdub3JlZFxuICAgICAgICBuZXcgTm90aWNlKFwi4pqgVW5leHBlY3RlZCBlcnJvclwiKTtcbiAgICB9XG4gICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gIH1cblxuICBhc3luYyB0b2dnbGVDb21wbGVtZW50QXV0b21hdGljYWxseSgpIHtcbiAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5jb21wbGVtZW50QXV0b21hdGljYWxseSA9XG4gICAgICAhdGhpcy5wbHVnaW4uc2V0dGluZ3MuY29tcGxlbWVudEF1dG9tYXRpY2FsbHk7XG4gICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gIH1cblxuICBnZXRQbHVnaW5TZXR0aW5nc0FzSnNvblN0cmluZygpOiBzdHJpbmcge1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShcbiAgICAgIHtcbiAgICAgICAgdmVyc2lvbjogdGhpcy5wbHVnaW4ubWFuaWZlc3QudmVyc2lvbixcbiAgICAgICAgbW9iaWxlOiAodGhpcy5hcHAgYXMgYW55KS5pc01vYmlsZSxcbiAgICAgICAgc2V0dGluZ3M6IHsgLi4udGhpcy5wbHVnaW4uc2V0dGluZ3MsIHNlbGVjdGlvbkhpc3RvcnlUcmVlOiBudWxsIH0sXG4gICAgICB9LFxuICAgICAgbnVsbCxcbiAgICAgIDRcbiAgICApO1xuICB9XG59XG4iLCJpbXBvcnQgdHlwZSB7IE1hdGNoU3RyYXRlZ3kgfSBmcm9tIFwiLi4vcHJvdmlkZXIvTWF0Y2hTdHJhdGVneVwiO1xuXG5leHBvcnQgY2xhc3MgUHJvdmlkZXJTdGF0dXNCYXIge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgY3VycmVudEZpbGU6IEhUTUxFbGVtZW50IHwgbnVsbCxcbiAgICBwdWJsaWMgY3VycmVudFZhdWx0OiBIVE1MRWxlbWVudCB8IG51bGwsXG4gICAgcHVibGljIGN1c3RvbURpY3Rpb25hcnk6IEhUTUxFbGVtZW50IHwgbnVsbCxcbiAgICBwdWJsaWMgaW50ZXJuYWxMaW5rOiBIVE1MRWxlbWVudCB8IG51bGwsXG4gICAgcHVibGljIGZyb250TWF0dGVyOiBIVE1MRWxlbWVudCB8IG51bGwsXG4gICAgcHVibGljIG1hdGNoU3RyYXRlZ3k6IEhUTUxFbGVtZW50IHwgbnVsbFxuICApIHt9XG5cbiAgc3RhdGljIG5ldyhcbiAgICBzdGF0dXNCYXI6IEhUTUxFbGVtZW50LFxuICAgIHNob3dNYXRjaFN0cmF0ZWd5OiBib29sZWFuLFxuICAgIHNob3dJbmRleGluZ1N0YXR1czogYm9vbGVhblxuICApOiBQcm92aWRlclN0YXR1c0JhciB7XG4gICAgY29uc3QgY3VycmVudEZpbGUgPSBzaG93SW5kZXhpbmdTdGF0dXNcbiAgICAgID8gc3RhdHVzQmFyLmNyZWF0ZUVsKFwic3BhblwiLCB7XG4gICAgICAgICAgdGV4dDogXCItLS1cIixcbiAgICAgICAgICBjbHM6IFwidmFyaW91cy1jb21wbGVtZW50c19fZm9vdGVyIHZhcmlvdXMtY29tcGxlbWVudHNfX2Zvb3Rlcl9fY3VycmVudC1maWxlXCIsXG4gICAgICAgIH0pXG4gICAgICA6IG51bGw7XG4gICAgY29uc3QgY3VycmVudFZhdWx0ID0gc2hvd0luZGV4aW5nU3RhdHVzXG4gICAgICA/IHN0YXR1c0Jhci5jcmVhdGVFbChcInNwYW5cIiwge1xuICAgICAgICAgIHRleHQ6IFwiLS0tXCIsXG4gICAgICAgICAgY2xzOiBcInZhcmlvdXMtY29tcGxlbWVudHNfX2Zvb3RlciB2YXJpb3VzLWNvbXBsZW1lbnRzX19mb290ZXJfX2N1cnJlbnQtdmF1bHRcIixcbiAgICAgICAgfSlcbiAgICAgIDogbnVsbDtcbiAgICBjb25zdCBjdXN0b21EaWN0aW9uYXJ5ID0gc2hvd0luZGV4aW5nU3RhdHVzXG4gICAgICA/IHN0YXR1c0Jhci5jcmVhdGVFbChcInNwYW5cIiwge1xuICAgICAgICAgIHRleHQ6IFwiLS0tXCIsXG4gICAgICAgICAgY2xzOiBcInZhcmlvdXMtY29tcGxlbWVudHNfX2Zvb3RlciB2YXJpb3VzLWNvbXBsZW1lbnRzX19mb290ZXJfX2N1c3RvbS1kaWN0aW9uYXJ5XCIsXG4gICAgICAgIH0pXG4gICAgICA6IG51bGw7XG4gICAgY29uc3QgaW50ZXJuYWxMaW5rID0gc2hvd0luZGV4aW5nU3RhdHVzXG4gICAgICA/IHN0YXR1c0Jhci5jcmVhdGVFbChcInNwYW5cIiwge1xuICAgICAgICAgIHRleHQ6IFwiLS0tXCIsXG4gICAgICAgICAgY2xzOiBcInZhcmlvdXMtY29tcGxlbWVudHNfX2Zvb3RlciB2YXJpb3VzLWNvbXBsZW1lbnRzX19mb290ZXJfX2ludGVybmFsLWxpbmtcIixcbiAgICAgICAgfSlcbiAgICAgIDogbnVsbDtcbiAgICBjb25zdCBmcm9udE1hdHRlciA9IHNob3dJbmRleGluZ1N0YXR1c1xuICAgICAgPyBzdGF0dXNCYXIuY3JlYXRlRWwoXCJzcGFuXCIsIHtcbiAgICAgICAgICB0ZXh0OiBcIi0tLVwiLFxuICAgICAgICAgIGNsczogXCJ2YXJpb3VzLWNvbXBsZW1lbnRzX19mb290ZXIgdmFyaW91cy1jb21wbGVtZW50c19fZm9vdGVyX19mcm9udC1tYXR0ZXJcIixcbiAgICAgICAgfSlcbiAgICAgIDogbnVsbDtcblxuICAgIGNvbnN0IG1hdGNoU3RyYXRlZ3kgPSBzaG93TWF0Y2hTdHJhdGVneVxuICAgICAgPyBzdGF0dXNCYXIuY3JlYXRlRWwoXCJzcGFuXCIsIHtcbiAgICAgICAgICB0ZXh0OiBcIi0tLVwiLFxuICAgICAgICAgIGNsczogXCJ2YXJpb3VzLWNvbXBsZW1lbnRzX19mb290ZXIgdmFyaW91cy1jb21wbGVtZW50c19fZm9vdGVyX19tYXRjaC1zdHJhdGVneVwiLFxuICAgICAgICB9KVxuICAgICAgOiBudWxsO1xuXG4gICAgcmV0dXJuIG5ldyBQcm92aWRlclN0YXR1c0JhcihcbiAgICAgIGN1cnJlbnRGaWxlLFxuICAgICAgY3VycmVudFZhdWx0LFxuICAgICAgY3VzdG9tRGljdGlvbmFyeSxcbiAgICAgIGludGVybmFsTGluayxcbiAgICAgIGZyb250TWF0dGVyLFxuICAgICAgbWF0Y2hTdHJhdGVneVxuICAgICk7XG4gIH1cblxuICBzZXRPbkNsaWNrU3RyYXRlZ3lMaXN0ZW5lcihsaXN0ZW5lcjogKCkgPT4gdm9pZCkge1xuICAgIHRoaXMubWF0Y2hTdHJhdGVneT8uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGxpc3RlbmVyKTtcbiAgfVxuXG4gIHNldEN1cnJlbnRGaWxlRGlzYWJsZWQoKSB7XG4gICAgdGhpcy5jdXJyZW50RmlsZT8uc2V0VGV4dChcIi0tLVwiKTtcbiAgfVxuICBzZXRDdXJyZW50VmF1bHREaXNhYmxlZCgpIHtcbiAgICB0aGlzLmN1cnJlbnRWYXVsdD8uc2V0VGV4dChcIi0tLVwiKTtcbiAgfVxuICBzZXRDdXN0b21EaWN0aW9uYXJ5RGlzYWJsZWQoKSB7XG4gICAgdGhpcy5jdXN0b21EaWN0aW9uYXJ5Py5zZXRUZXh0KFwiLS0tXCIpO1xuICB9XG4gIHNldEludGVybmFsTGlua0Rpc2FibGVkKCkge1xuICAgIHRoaXMuaW50ZXJuYWxMaW5rPy5zZXRUZXh0KFwiLS0tXCIpO1xuICB9XG4gIHNldEZyb250TWF0dGVyRGlzYWJsZWQoKSB7XG4gICAgdGhpcy5mcm9udE1hdHRlcj8uc2V0VGV4dChcIi0tLVwiKTtcbiAgfVxuXG4gIHNldEN1cnJlbnRGaWxlSW5kZXhpbmcoKSB7XG4gICAgdGhpcy5jdXJyZW50RmlsZT8uc2V0VGV4dChcImluZGV4aW5nLi4uXCIpO1xuICB9XG4gIHNldEN1cnJlbnRWYXVsdEluZGV4aW5nKCkge1xuICAgIHRoaXMuY3VycmVudFZhdWx0Py5zZXRUZXh0KFwiaW5kZXhpbmcuLi5cIik7XG4gIH1cbiAgc2V0Q3VzdG9tRGljdGlvbmFyeUluZGV4aW5nKCkge1xuICAgIHRoaXMuY3VzdG9tRGljdGlvbmFyeT8uc2V0VGV4dChcImluZGV4aW5nLi4uXCIpO1xuICB9XG4gIHNldEludGVybmFsTGlua0luZGV4aW5nKCkge1xuICAgIHRoaXMuaW50ZXJuYWxMaW5rPy5zZXRUZXh0KFwiaW5kZXhpbmcuLi5cIik7XG4gIH1cbiAgc2V0RnJvbnRNYXR0ZXJJbmRleGluZygpIHtcbiAgICB0aGlzLmZyb250TWF0dGVyPy5zZXRUZXh0KFwiaW5kZXhpbmcuLi5cIik7XG4gIH1cblxuICBzZXRDdXJyZW50RmlsZUluZGV4ZWQoY291bnQ6IGFueSkge1xuICAgIHRoaXMuY3VycmVudEZpbGU/LnNldFRleHQoU3RyaW5nKGNvdW50KSk7XG4gIH1cbiAgc2V0Q3VycmVudFZhdWx0SW5kZXhlZChjb3VudDogYW55KSB7XG4gICAgdGhpcy5jdXJyZW50VmF1bHQ/LnNldFRleHQoU3RyaW5nKGNvdW50KSk7XG4gIH1cbiAgc2V0Q3VzdG9tRGljdGlvbmFyeUluZGV4ZWQoY291bnQ6IGFueSkge1xuICAgIHRoaXMuY3VzdG9tRGljdGlvbmFyeT8uc2V0VGV4dChTdHJpbmcoY291bnQpKTtcbiAgfVxuICBzZXRJbnRlcm5hbExpbmtJbmRleGVkKGNvdW50OiBhbnkpIHtcbiAgICB0aGlzLmludGVybmFsTGluaz8uc2V0VGV4dChTdHJpbmcoY291bnQpKTtcbiAgfVxuICBzZXRGcm9udE1hdHRlckluZGV4ZWQoY291bnQ6IGFueSkge1xuICAgIHRoaXMuZnJvbnRNYXR0ZXI/LnNldFRleHQoU3RyaW5nKGNvdW50KSk7XG4gIH1cblxuICBzZXRNYXRjaFN0cmF0ZWd5KHN0cmF0ZWd5OiBNYXRjaFN0cmF0ZWd5KSB7XG4gICAgdGhpcy5tYXRjaFN0cmF0ZWd5Py5zZXRUZXh0KHN0cmF0ZWd5Lm5hbWUpO1xuICB9XG59XG4iLCJmdW5jdGlvbiBub29wKCkgeyB9XG5jb25zdCBpZGVudGl0eSA9IHggPT4geDtcbmZ1bmN0aW9uIGFzc2lnbih0YXIsIHNyYykge1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBmb3IgKGNvbnN0IGsgaW4gc3JjKVxuICAgICAgICB0YXJba10gPSBzcmNba107XG4gICAgcmV0dXJuIHRhcjtcbn1cbmZ1bmN0aW9uIGlzX3Byb21pc2UodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgdmFsdWUudGhlbiA9PT0gJ2Z1bmN0aW9uJztcbn1cbmZ1bmN0aW9uIGFkZF9sb2NhdGlvbihlbGVtZW50LCBmaWxlLCBsaW5lLCBjb2x1bW4sIGNoYXIpIHtcbiAgICBlbGVtZW50Ll9fc3ZlbHRlX21ldGEgPSB7XG4gICAgICAgIGxvYzogeyBmaWxlLCBsaW5lLCBjb2x1bW4sIGNoYXIgfVxuICAgIH07XG59XG5mdW5jdGlvbiBydW4oZm4pIHtcbiAgICByZXR1cm4gZm4oKTtcbn1cbmZ1bmN0aW9uIGJsYW5rX29iamVjdCgpIHtcbiAgICByZXR1cm4gT2JqZWN0LmNyZWF0ZShudWxsKTtcbn1cbmZ1bmN0aW9uIHJ1bl9hbGwoZm5zKSB7XG4gICAgZm5zLmZvckVhY2gocnVuKTtcbn1cbmZ1bmN0aW9uIGlzX2Z1bmN0aW9uKHRoaW5nKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB0aGluZyA9PT0gJ2Z1bmN0aW9uJztcbn1cbmZ1bmN0aW9uIHNhZmVfbm90X2VxdWFsKGEsIGIpIHtcbiAgICByZXR1cm4gYSAhPSBhID8gYiA9PSBiIDogYSAhPT0gYiB8fCAoKGEgJiYgdHlwZW9mIGEgPT09ICdvYmplY3QnKSB8fCB0eXBlb2YgYSA9PT0gJ2Z1bmN0aW9uJyk7XG59XG5sZXQgc3JjX3VybF9lcXVhbF9hbmNob3I7XG5mdW5jdGlvbiBzcmNfdXJsX2VxdWFsKGVsZW1lbnRfc3JjLCB1cmwpIHtcbiAgICBpZiAoIXNyY191cmxfZXF1YWxfYW5jaG9yKSB7XG4gICAgICAgIHNyY191cmxfZXF1YWxfYW5jaG9yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgIH1cbiAgICBzcmNfdXJsX2VxdWFsX2FuY2hvci5ocmVmID0gdXJsO1xuICAgIHJldHVybiBlbGVtZW50X3NyYyA9PT0gc3JjX3VybF9lcXVhbF9hbmNob3IuaHJlZjtcbn1cbmZ1bmN0aW9uIG5vdF9lcXVhbChhLCBiKSB7XG4gICAgcmV0dXJuIGEgIT0gYSA/IGIgPT0gYiA6IGEgIT09IGI7XG59XG5mdW5jdGlvbiBpc19lbXB0eShvYmopIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXMob2JqKS5sZW5ndGggPT09IDA7XG59XG5mdW5jdGlvbiB2YWxpZGF0ZV9zdG9yZShzdG9yZSwgbmFtZSkge1xuICAgIGlmIChzdG9yZSAhPSBudWxsICYmIHR5cGVvZiBzdG9yZS5zdWJzY3JpYmUgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAnJHtuYW1lfScgaXMgbm90IGEgc3RvcmUgd2l0aCBhICdzdWJzY3JpYmUnIG1ldGhvZGApO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHN1YnNjcmliZShzdG9yZSwgLi4uY2FsbGJhY2tzKSB7XG4gICAgaWYgKHN0b3JlID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIG5vb3A7XG4gICAgfVxuICAgIGNvbnN0IHVuc3ViID0gc3RvcmUuc3Vic2NyaWJlKC4uLmNhbGxiYWNrcyk7XG4gICAgcmV0dXJuIHVuc3ViLnVuc3Vic2NyaWJlID8gKCkgPT4gdW5zdWIudW5zdWJzY3JpYmUoKSA6IHVuc3ViO1xufVxuZnVuY3Rpb24gZ2V0X3N0b3JlX3ZhbHVlKHN0b3JlKSB7XG4gICAgbGV0IHZhbHVlO1xuICAgIHN1YnNjcmliZShzdG9yZSwgXyA9PiB2YWx1ZSA9IF8pKCk7XG4gICAgcmV0dXJuIHZhbHVlO1xufVxuZnVuY3Rpb24gY29tcG9uZW50X3N1YnNjcmliZShjb21wb25lbnQsIHN0b3JlLCBjYWxsYmFjaykge1xuICAgIGNvbXBvbmVudC4kJC5vbl9kZXN0cm95LnB1c2goc3Vic2NyaWJlKHN0b3JlLCBjYWxsYmFjaykpO1xufVxuZnVuY3Rpb24gY3JlYXRlX3Nsb3QoZGVmaW5pdGlvbiwgY3R4LCAkJHNjb3BlLCBmbikge1xuICAgIGlmIChkZWZpbml0aW9uKSB7XG4gICAgICAgIGNvbnN0IHNsb3RfY3R4ID0gZ2V0X3Nsb3RfY29udGV4dChkZWZpbml0aW9uLCBjdHgsICQkc2NvcGUsIGZuKTtcbiAgICAgICAgcmV0dXJuIGRlZmluaXRpb25bMF0oc2xvdF9jdHgpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGdldF9zbG90X2NvbnRleHQoZGVmaW5pdGlvbiwgY3R4LCAkJHNjb3BlLCBmbikge1xuICAgIHJldHVybiBkZWZpbml0aW9uWzFdICYmIGZuXG4gICAgICAgID8gYXNzaWduKCQkc2NvcGUuY3R4LnNsaWNlKCksIGRlZmluaXRpb25bMV0oZm4oY3R4KSkpXG4gICAgICAgIDogJCRzY29wZS5jdHg7XG59XG5mdW5jdGlvbiBnZXRfc2xvdF9jaGFuZ2VzKGRlZmluaXRpb24sICQkc2NvcGUsIGRpcnR5LCBmbikge1xuICAgIGlmIChkZWZpbml0aW9uWzJdICYmIGZuKSB7XG4gICAgICAgIGNvbnN0IGxldHMgPSBkZWZpbml0aW9uWzJdKGZuKGRpcnR5KSk7XG4gICAgICAgIGlmICgkJHNjb3BlLmRpcnR5ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBsZXRzO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgbGV0cyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIGNvbnN0IG1lcmdlZCA9IFtdO1xuICAgICAgICAgICAgY29uc3QgbGVuID0gTWF0aC5tYXgoJCRzY29wZS5kaXJ0eS5sZW5ndGgsIGxldHMubGVuZ3RoKTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpICs9IDEpIHtcbiAgICAgICAgICAgICAgICBtZXJnZWRbaV0gPSAkJHNjb3BlLmRpcnR5W2ldIHwgbGV0c1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBtZXJnZWQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICQkc2NvcGUuZGlydHkgfCBsZXRzO1xuICAgIH1cbiAgICByZXR1cm4gJCRzY29wZS5kaXJ0eTtcbn1cbmZ1bmN0aW9uIHVwZGF0ZV9zbG90X2Jhc2Uoc2xvdCwgc2xvdF9kZWZpbml0aW9uLCBjdHgsICQkc2NvcGUsIHNsb3RfY2hhbmdlcywgZ2V0X3Nsb3RfY29udGV4dF9mbikge1xuICAgIGlmIChzbG90X2NoYW5nZXMpIHtcbiAgICAgICAgY29uc3Qgc2xvdF9jb250ZXh0ID0gZ2V0X3Nsb3RfY29udGV4dChzbG90X2RlZmluaXRpb24sIGN0eCwgJCRzY29wZSwgZ2V0X3Nsb3RfY29udGV4dF9mbik7XG4gICAgICAgIHNsb3QucChzbG90X2NvbnRleHQsIHNsb3RfY2hhbmdlcyk7XG4gICAgfVxufVxuZnVuY3Rpb24gdXBkYXRlX3Nsb3Qoc2xvdCwgc2xvdF9kZWZpbml0aW9uLCBjdHgsICQkc2NvcGUsIGRpcnR5LCBnZXRfc2xvdF9jaGFuZ2VzX2ZuLCBnZXRfc2xvdF9jb250ZXh0X2ZuKSB7XG4gICAgY29uc3Qgc2xvdF9jaGFuZ2VzID0gZ2V0X3Nsb3RfY2hhbmdlcyhzbG90X2RlZmluaXRpb24sICQkc2NvcGUsIGRpcnR5LCBnZXRfc2xvdF9jaGFuZ2VzX2ZuKTtcbiAgICB1cGRhdGVfc2xvdF9iYXNlKHNsb3QsIHNsb3RfZGVmaW5pdGlvbiwgY3R4LCAkJHNjb3BlLCBzbG90X2NoYW5nZXMsIGdldF9zbG90X2NvbnRleHRfZm4pO1xufVxuZnVuY3Rpb24gZ2V0X2FsbF9kaXJ0eV9mcm9tX3Njb3BlKCQkc2NvcGUpIHtcbiAgICBpZiAoJCRzY29wZS5jdHgubGVuZ3RoID4gMzIpIHtcbiAgICAgICAgY29uc3QgZGlydHkgPSBbXTtcbiAgICAgICAgY29uc3QgbGVuZ3RoID0gJCRzY29wZS5jdHgubGVuZ3RoIC8gMzI7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGRpcnR5W2ldID0gLTE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRpcnR5O1xuICAgIH1cbiAgICByZXR1cm4gLTE7XG59XG5mdW5jdGlvbiBleGNsdWRlX2ludGVybmFsX3Byb3BzKHByb3BzKSB7XG4gICAgY29uc3QgcmVzdWx0ID0ge307XG4gICAgZm9yIChjb25zdCBrIGluIHByb3BzKVxuICAgICAgICBpZiAoa1swXSAhPT0gJyQnKVxuICAgICAgICAgICAgcmVzdWx0W2tdID0gcHJvcHNba107XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIGNvbXB1dGVfcmVzdF9wcm9wcyhwcm9wcywga2V5cykge1xuICAgIGNvbnN0IHJlc3QgPSB7fTtcbiAgICBrZXlzID0gbmV3IFNldChrZXlzKTtcbiAgICBmb3IgKGNvbnN0IGsgaW4gcHJvcHMpXG4gICAgICAgIGlmICgha2V5cy5oYXMoaykgJiYga1swXSAhPT0gJyQnKVxuICAgICAgICAgICAgcmVzdFtrXSA9IHByb3BzW2tdO1xuICAgIHJldHVybiByZXN0O1xufVxuZnVuY3Rpb24gY29tcHV0ZV9zbG90cyhzbG90cykge1xuICAgIGNvbnN0IHJlc3VsdCA9IHt9O1xuICAgIGZvciAoY29uc3Qga2V5IGluIHNsb3RzKSB7XG4gICAgICAgIHJlc3VsdFtrZXldID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIG9uY2UoZm4pIHtcbiAgICBsZXQgcmFuID0gZmFsc2U7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICguLi5hcmdzKSB7XG4gICAgICAgIGlmIChyYW4pXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHJhbiA9IHRydWU7XG4gICAgICAgIGZuLmNhbGwodGhpcywgLi4uYXJncyk7XG4gICAgfTtcbn1cbmZ1bmN0aW9uIG51bGxfdG9fZW1wdHkodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgPT0gbnVsbCA/ICcnIDogdmFsdWU7XG59XG5mdW5jdGlvbiBzZXRfc3RvcmVfdmFsdWUoc3RvcmUsIHJldCwgdmFsdWUpIHtcbiAgICBzdG9yZS5zZXQodmFsdWUpO1xuICAgIHJldHVybiByZXQ7XG59XG5jb25zdCBoYXNfcHJvcCA9IChvYmosIHByb3ApID0+IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApO1xuZnVuY3Rpb24gYWN0aW9uX2Rlc3Ryb3llcihhY3Rpb25fcmVzdWx0KSB7XG4gICAgcmV0dXJuIGFjdGlvbl9yZXN1bHQgJiYgaXNfZnVuY3Rpb24oYWN0aW9uX3Jlc3VsdC5kZXN0cm95KSA/IGFjdGlvbl9yZXN1bHQuZGVzdHJveSA6IG5vb3A7XG59XG5cbmNvbnN0IGlzX2NsaWVudCA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnO1xubGV0IG5vdyA9IGlzX2NsaWVudFxuICAgID8gKCkgPT4gd2luZG93LnBlcmZvcm1hbmNlLm5vdygpXG4gICAgOiAoKSA9PiBEYXRlLm5vdygpO1xubGV0IHJhZiA9IGlzX2NsaWVudCA/IGNiID0+IHJlcXVlc3RBbmltYXRpb25GcmFtZShjYikgOiBub29wO1xuLy8gdXNlZCBpbnRlcm5hbGx5IGZvciB0ZXN0aW5nXG5mdW5jdGlvbiBzZXRfbm93KGZuKSB7XG4gICAgbm93ID0gZm47XG59XG5mdW5jdGlvbiBzZXRfcmFmKGZuKSB7XG4gICAgcmFmID0gZm47XG59XG5cbmNvbnN0IHRhc2tzID0gbmV3IFNldCgpO1xuZnVuY3Rpb24gcnVuX3Rhc2tzKG5vdykge1xuICAgIHRhc2tzLmZvckVhY2godGFzayA9PiB7XG4gICAgICAgIGlmICghdGFzay5jKG5vdykpIHtcbiAgICAgICAgICAgIHRhc2tzLmRlbGV0ZSh0YXNrKTtcbiAgICAgICAgICAgIHRhc2suZigpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgaWYgKHRhc2tzLnNpemUgIT09IDApXG4gICAgICAgIHJhZihydW5fdGFza3MpO1xufVxuLyoqXG4gKiBGb3IgdGVzdGluZyBwdXJwb3NlcyBvbmx5IVxuICovXG5mdW5jdGlvbiBjbGVhcl9sb29wcygpIHtcbiAgICB0YXNrcy5jbGVhcigpO1xufVxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IHRhc2sgdGhhdCBydW5zIG9uIGVhY2ggcmFmIGZyYW1lXG4gKiB1bnRpbCBpdCByZXR1cm5zIGEgZmFsc3kgdmFsdWUgb3IgaXMgYWJvcnRlZFxuICovXG5mdW5jdGlvbiBsb29wKGNhbGxiYWNrKSB7XG4gICAgbGV0IHRhc2s7XG4gICAgaWYgKHRhc2tzLnNpemUgPT09IDApXG4gICAgICAgIHJhZihydW5fdGFza3MpO1xuICAgIHJldHVybiB7XG4gICAgICAgIHByb21pc2U6IG5ldyBQcm9taXNlKGZ1bGZpbGwgPT4ge1xuICAgICAgICAgICAgdGFza3MuYWRkKHRhc2sgPSB7IGM6IGNhbGxiYWNrLCBmOiBmdWxmaWxsIH0pO1xuICAgICAgICB9KSxcbiAgICAgICAgYWJvcnQoKSB7XG4gICAgICAgICAgICB0YXNrcy5kZWxldGUodGFzayk7XG4gICAgICAgIH1cbiAgICB9O1xufVxuXG4vLyBUcmFjayB3aGljaCBub2RlcyBhcmUgY2xhaW1lZCBkdXJpbmcgaHlkcmF0aW9uLiBVbmNsYWltZWQgbm9kZXMgY2FuIHRoZW4gYmUgcmVtb3ZlZCBmcm9tIHRoZSBET01cbi8vIGF0IHRoZSBlbmQgb2YgaHlkcmF0aW9uIHdpdGhvdXQgdG91Y2hpbmcgdGhlIHJlbWFpbmluZyBub2Rlcy5cbmxldCBpc19oeWRyYXRpbmcgPSBmYWxzZTtcbmZ1bmN0aW9uIHN0YXJ0X2h5ZHJhdGluZygpIHtcbiAgICBpc19oeWRyYXRpbmcgPSB0cnVlO1xufVxuZnVuY3Rpb24gZW5kX2h5ZHJhdGluZygpIHtcbiAgICBpc19oeWRyYXRpbmcgPSBmYWxzZTtcbn1cbmZ1bmN0aW9uIHVwcGVyX2JvdW5kKGxvdywgaGlnaCwga2V5LCB2YWx1ZSkge1xuICAgIC8vIFJldHVybiBmaXJzdCBpbmRleCBvZiB2YWx1ZSBsYXJnZXIgdGhhbiBpbnB1dCB2YWx1ZSBpbiB0aGUgcmFuZ2UgW2xvdywgaGlnaClcbiAgICB3aGlsZSAobG93IDwgaGlnaCkge1xuICAgICAgICBjb25zdCBtaWQgPSBsb3cgKyAoKGhpZ2ggLSBsb3cpID4+IDEpO1xuICAgICAgICBpZiAoa2V5KG1pZCkgPD0gdmFsdWUpIHtcbiAgICAgICAgICAgIGxvdyA9IG1pZCArIDE7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBoaWdoID0gbWlkO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBsb3c7XG59XG5mdW5jdGlvbiBpbml0X2h5ZHJhdGUodGFyZ2V0KSB7XG4gICAgaWYgKHRhcmdldC5oeWRyYXRlX2luaXQpXG4gICAgICAgIHJldHVybjtcbiAgICB0YXJnZXQuaHlkcmF0ZV9pbml0ID0gdHJ1ZTtcbiAgICAvLyBXZSBrbm93IHRoYXQgYWxsIGNoaWxkcmVuIGhhdmUgY2xhaW1fb3JkZXIgdmFsdWVzIHNpbmNlIHRoZSB1bmNsYWltZWQgaGF2ZSBiZWVuIGRldGFjaGVkIGlmIHRhcmdldCBpcyBub3QgPGhlYWQ+XG4gICAgbGV0IGNoaWxkcmVuID0gdGFyZ2V0LmNoaWxkTm9kZXM7XG4gICAgLy8gSWYgdGFyZ2V0IGlzIDxoZWFkPiwgdGhlcmUgbWF5IGJlIGNoaWxkcmVuIHdpdGhvdXQgY2xhaW1fb3JkZXJcbiAgICBpZiAodGFyZ2V0Lm5vZGVOYW1lID09PSAnSEVBRCcpIHtcbiAgICAgICAgY29uc3QgbXlDaGlsZHJlbiA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBub2RlID0gY2hpbGRyZW5baV07XG4gICAgICAgICAgICBpZiAobm9kZS5jbGFpbV9vcmRlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgbXlDaGlsZHJlbi5wdXNoKG5vZGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNoaWxkcmVuID0gbXlDaGlsZHJlbjtcbiAgICB9XG4gICAgLypcbiAgICAqIFJlb3JkZXIgY2xhaW1lZCBjaGlsZHJlbiBvcHRpbWFsbHkuXG4gICAgKiBXZSBjYW4gcmVvcmRlciBjbGFpbWVkIGNoaWxkcmVuIG9wdGltYWxseSBieSBmaW5kaW5nIHRoZSBsb25nZXN0IHN1YnNlcXVlbmNlIG9mXG4gICAgKiBub2RlcyB0aGF0IGFyZSBhbHJlYWR5IGNsYWltZWQgaW4gb3JkZXIgYW5kIG9ubHkgbW92aW5nIHRoZSByZXN0LiBUaGUgbG9uZ2VzdFxuICAgICogc3Vic2VxdWVuY2Ugc3Vic2VxdWVuY2Ugb2Ygbm9kZXMgdGhhdCBhcmUgY2xhaW1lZCBpbiBvcmRlciBjYW4gYmUgZm91bmQgYnlcbiAgICAqIGNvbXB1dGluZyB0aGUgbG9uZ2VzdCBpbmNyZWFzaW5nIHN1YnNlcXVlbmNlIG9mIC5jbGFpbV9vcmRlciB2YWx1ZXMuXG4gICAgKlxuICAgICogVGhpcyBhbGdvcml0aG0gaXMgb3B0aW1hbCBpbiBnZW5lcmF0aW5nIHRoZSBsZWFzdCBhbW91bnQgb2YgcmVvcmRlciBvcGVyYXRpb25zXG4gICAgKiBwb3NzaWJsZS5cbiAgICAqXG4gICAgKiBQcm9vZjpcbiAgICAqIFdlIGtub3cgdGhhdCwgZ2l2ZW4gYSBzZXQgb2YgcmVvcmRlcmluZyBvcGVyYXRpb25zLCB0aGUgbm9kZXMgdGhhdCBkbyBub3QgbW92ZVxuICAgICogYWx3YXlzIGZvcm0gYW4gaW5jcmVhc2luZyBzdWJzZXF1ZW5jZSwgc2luY2UgdGhleSBkbyBub3QgbW92ZSBhbW9uZyBlYWNoIG90aGVyXG4gICAgKiBtZWFuaW5nIHRoYXQgdGhleSBtdXN0IGJlIGFscmVhZHkgb3JkZXJlZCBhbW9uZyBlYWNoIG90aGVyLiBUaHVzLCB0aGUgbWF4aW1hbFxuICAgICogc2V0IG9mIG5vZGVzIHRoYXQgZG8gbm90IG1vdmUgZm9ybSBhIGxvbmdlc3QgaW5jcmVhc2luZyBzdWJzZXF1ZW5jZS5cbiAgICAqL1xuICAgIC8vIENvbXB1dGUgbG9uZ2VzdCBpbmNyZWFzaW5nIHN1YnNlcXVlbmNlXG4gICAgLy8gbTogc3Vic2VxdWVuY2UgbGVuZ3RoIGogPT4gaW5kZXggayBvZiBzbWFsbGVzdCB2YWx1ZSB0aGF0IGVuZHMgYW4gaW5jcmVhc2luZyBzdWJzZXF1ZW5jZSBvZiBsZW5ndGggalxuICAgIGNvbnN0IG0gPSBuZXcgSW50MzJBcnJheShjaGlsZHJlbi5sZW5ndGggKyAxKTtcbiAgICAvLyBQcmVkZWNlc3NvciBpbmRpY2VzICsgMVxuICAgIGNvbnN0IHAgPSBuZXcgSW50MzJBcnJheShjaGlsZHJlbi5sZW5ndGgpO1xuICAgIG1bMF0gPSAtMTtcbiAgICBsZXQgbG9uZ2VzdCA9IDA7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBjdXJyZW50ID0gY2hpbGRyZW5baV0uY2xhaW1fb3JkZXI7XG4gICAgICAgIC8vIEZpbmQgdGhlIGxhcmdlc3Qgc3Vic2VxdWVuY2UgbGVuZ3RoIHN1Y2ggdGhhdCBpdCBlbmRzIGluIGEgdmFsdWUgbGVzcyB0aGFuIG91ciBjdXJyZW50IHZhbHVlXG4gICAgICAgIC8vIHVwcGVyX2JvdW5kIHJldHVybnMgZmlyc3QgZ3JlYXRlciB2YWx1ZSwgc28gd2Ugc3VidHJhY3Qgb25lXG4gICAgICAgIC8vIHdpdGggZmFzdCBwYXRoIGZvciB3aGVuIHdlIGFyZSBvbiB0aGUgY3VycmVudCBsb25nZXN0IHN1YnNlcXVlbmNlXG4gICAgICAgIGNvbnN0IHNlcUxlbiA9ICgobG9uZ2VzdCA+IDAgJiYgY2hpbGRyZW5bbVtsb25nZXN0XV0uY2xhaW1fb3JkZXIgPD0gY3VycmVudCkgPyBsb25nZXN0ICsgMSA6IHVwcGVyX2JvdW5kKDEsIGxvbmdlc3QsIGlkeCA9PiBjaGlsZHJlblttW2lkeF1dLmNsYWltX29yZGVyLCBjdXJyZW50KSkgLSAxO1xuICAgICAgICBwW2ldID0gbVtzZXFMZW5dICsgMTtcbiAgICAgICAgY29uc3QgbmV3TGVuID0gc2VxTGVuICsgMTtcbiAgICAgICAgLy8gV2UgY2FuIGd1YXJhbnRlZSB0aGF0IGN1cnJlbnQgaXMgdGhlIHNtYWxsZXN0IHZhbHVlLiBPdGhlcndpc2UsIHdlIHdvdWxkIGhhdmUgZ2VuZXJhdGVkIGEgbG9uZ2VyIHNlcXVlbmNlLlxuICAgICAgICBtW25ld0xlbl0gPSBpO1xuICAgICAgICBsb25nZXN0ID0gTWF0aC5tYXgobmV3TGVuLCBsb25nZXN0KTtcbiAgICB9XG4gICAgLy8gVGhlIGxvbmdlc3QgaW5jcmVhc2luZyBzdWJzZXF1ZW5jZSBvZiBub2RlcyAoaW5pdGlhbGx5IHJldmVyc2VkKVxuICAgIGNvbnN0IGxpcyA9IFtdO1xuICAgIC8vIFRoZSByZXN0IG9mIHRoZSBub2Rlcywgbm9kZXMgdGhhdCB3aWxsIGJlIG1vdmVkXG4gICAgY29uc3QgdG9Nb3ZlID0gW107XG4gICAgbGV0IGxhc3QgPSBjaGlsZHJlbi5sZW5ndGggLSAxO1xuICAgIGZvciAobGV0IGN1ciA9IG1bbG9uZ2VzdF0gKyAxOyBjdXIgIT0gMDsgY3VyID0gcFtjdXIgLSAxXSkge1xuICAgICAgICBsaXMucHVzaChjaGlsZHJlbltjdXIgLSAxXSk7XG4gICAgICAgIGZvciAoOyBsYXN0ID49IGN1cjsgbGFzdC0tKSB7XG4gICAgICAgICAgICB0b01vdmUucHVzaChjaGlsZHJlbltsYXN0XSk7XG4gICAgICAgIH1cbiAgICAgICAgbGFzdC0tO1xuICAgIH1cbiAgICBmb3IgKDsgbGFzdCA+PSAwOyBsYXN0LS0pIHtcbiAgICAgICAgdG9Nb3ZlLnB1c2goY2hpbGRyZW5bbGFzdF0pO1xuICAgIH1cbiAgICBsaXMucmV2ZXJzZSgpO1xuICAgIC8vIFdlIHNvcnQgdGhlIG5vZGVzIGJlaW5nIG1vdmVkIHRvIGd1YXJhbnRlZSB0aGF0IHRoZWlyIGluc2VydGlvbiBvcmRlciBtYXRjaGVzIHRoZSBjbGFpbSBvcmRlclxuICAgIHRvTW92ZS5zb3J0KChhLCBiKSA9PiBhLmNsYWltX29yZGVyIC0gYi5jbGFpbV9vcmRlcik7XG4gICAgLy8gRmluYWxseSwgd2UgbW92ZSB0aGUgbm9kZXNcbiAgICBmb3IgKGxldCBpID0gMCwgaiA9IDA7IGkgPCB0b01vdmUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgd2hpbGUgKGogPCBsaXMubGVuZ3RoICYmIHRvTW92ZVtpXS5jbGFpbV9vcmRlciA+PSBsaXNbal0uY2xhaW1fb3JkZXIpIHtcbiAgICAgICAgICAgIGorKztcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBhbmNob3IgPSBqIDwgbGlzLmxlbmd0aCA/IGxpc1tqXSA6IG51bGw7XG4gICAgICAgIHRhcmdldC5pbnNlcnRCZWZvcmUodG9Nb3ZlW2ldLCBhbmNob3IpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGFwcGVuZCh0YXJnZXQsIG5vZGUpIHtcbiAgICB0YXJnZXQuYXBwZW5kQ2hpbGQobm9kZSk7XG59XG5mdW5jdGlvbiBhcHBlbmRfc3R5bGVzKHRhcmdldCwgc3R5bGVfc2hlZXRfaWQsIHN0eWxlcykge1xuICAgIGNvbnN0IGFwcGVuZF9zdHlsZXNfdG8gPSBnZXRfcm9vdF9mb3Jfc3R5bGUodGFyZ2V0KTtcbiAgICBpZiAoIWFwcGVuZF9zdHlsZXNfdG8uZ2V0RWxlbWVudEJ5SWQoc3R5bGVfc2hlZXRfaWQpKSB7XG4gICAgICAgIGNvbnN0IHN0eWxlID0gZWxlbWVudCgnc3R5bGUnKTtcbiAgICAgICAgc3R5bGUuaWQgPSBzdHlsZV9zaGVldF9pZDtcbiAgICAgICAgc3R5bGUudGV4dENvbnRlbnQgPSBzdHlsZXM7XG4gICAgICAgIGFwcGVuZF9zdHlsZXNoZWV0KGFwcGVuZF9zdHlsZXNfdG8sIHN0eWxlKTtcbiAgICB9XG59XG5mdW5jdGlvbiBnZXRfcm9vdF9mb3Jfc3R5bGUobm9kZSkge1xuICAgIGlmICghbm9kZSlcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50O1xuICAgIGNvbnN0IHJvb3QgPSBub2RlLmdldFJvb3ROb2RlID8gbm9kZS5nZXRSb290Tm9kZSgpIDogbm9kZS5vd25lckRvY3VtZW50O1xuICAgIGlmIChyb290ICYmIHJvb3QuaG9zdCkge1xuICAgICAgICByZXR1cm4gcm9vdDtcbiAgICB9XG4gICAgcmV0dXJuIG5vZGUub3duZXJEb2N1bWVudDtcbn1cbmZ1bmN0aW9uIGFwcGVuZF9lbXB0eV9zdHlsZXNoZWV0KG5vZGUpIHtcbiAgICBjb25zdCBzdHlsZV9lbGVtZW50ID0gZWxlbWVudCgnc3R5bGUnKTtcbiAgICBhcHBlbmRfc3R5bGVzaGVldChnZXRfcm9vdF9mb3Jfc3R5bGUobm9kZSksIHN0eWxlX2VsZW1lbnQpO1xuICAgIHJldHVybiBzdHlsZV9lbGVtZW50LnNoZWV0O1xufVxuZnVuY3Rpb24gYXBwZW5kX3N0eWxlc2hlZXQobm9kZSwgc3R5bGUpIHtcbiAgICBhcHBlbmQobm9kZS5oZWFkIHx8IG5vZGUsIHN0eWxlKTtcbn1cbmZ1bmN0aW9uIGFwcGVuZF9oeWRyYXRpb24odGFyZ2V0LCBub2RlKSB7XG4gICAgaWYgKGlzX2h5ZHJhdGluZykge1xuICAgICAgICBpbml0X2h5ZHJhdGUodGFyZ2V0KTtcbiAgICAgICAgaWYgKCh0YXJnZXQuYWN0dWFsX2VuZF9jaGlsZCA9PT0gdW5kZWZpbmVkKSB8fCAoKHRhcmdldC5hY3R1YWxfZW5kX2NoaWxkICE9PSBudWxsKSAmJiAodGFyZ2V0LmFjdHVhbF9lbmRfY2hpbGQucGFyZW50RWxlbWVudCAhPT0gdGFyZ2V0KSkpIHtcbiAgICAgICAgICAgIHRhcmdldC5hY3R1YWxfZW5kX2NoaWxkID0gdGFyZ2V0LmZpcnN0Q2hpbGQ7XG4gICAgICAgIH1cbiAgICAgICAgLy8gU2tpcCBub2RlcyBvZiB1bmRlZmluZWQgb3JkZXJpbmdcbiAgICAgICAgd2hpbGUgKCh0YXJnZXQuYWN0dWFsX2VuZF9jaGlsZCAhPT0gbnVsbCkgJiYgKHRhcmdldC5hY3R1YWxfZW5kX2NoaWxkLmNsYWltX29yZGVyID09PSB1bmRlZmluZWQpKSB7XG4gICAgICAgICAgICB0YXJnZXQuYWN0dWFsX2VuZF9jaGlsZCA9IHRhcmdldC5hY3R1YWxfZW5kX2NoaWxkLm5leHRTaWJsaW5nO1xuICAgICAgICB9XG4gICAgICAgIGlmIChub2RlICE9PSB0YXJnZXQuYWN0dWFsX2VuZF9jaGlsZCkge1xuICAgICAgICAgICAgLy8gV2Ugb25seSBpbnNlcnQgaWYgdGhlIG9yZGVyaW5nIG9mIHRoaXMgbm9kZSBzaG91bGQgYmUgbW9kaWZpZWQgb3IgdGhlIHBhcmVudCBub2RlIGlzIG5vdCB0YXJnZXRcbiAgICAgICAgICAgIGlmIChub2RlLmNsYWltX29yZGVyICE9PSB1bmRlZmluZWQgfHwgbm9kZS5wYXJlbnROb2RlICE9PSB0YXJnZXQpIHtcbiAgICAgICAgICAgICAgICB0YXJnZXQuaW5zZXJ0QmVmb3JlKG5vZGUsIHRhcmdldC5hY3R1YWxfZW5kX2NoaWxkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRhcmdldC5hY3R1YWxfZW5kX2NoaWxkID0gbm9kZS5uZXh0U2libGluZztcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmIChub2RlLnBhcmVudE5vZGUgIT09IHRhcmdldCB8fCBub2RlLm5leHRTaWJsaW5nICE9PSBudWxsKSB7XG4gICAgICAgIHRhcmdldC5hcHBlbmRDaGlsZChub2RlKTtcbiAgICB9XG59XG5mdW5jdGlvbiBpbnNlcnQodGFyZ2V0LCBub2RlLCBhbmNob3IpIHtcbiAgICB0YXJnZXQuaW5zZXJ0QmVmb3JlKG5vZGUsIGFuY2hvciB8fCBudWxsKTtcbn1cbmZ1bmN0aW9uIGluc2VydF9oeWRyYXRpb24odGFyZ2V0LCBub2RlLCBhbmNob3IpIHtcbiAgICBpZiAoaXNfaHlkcmF0aW5nICYmICFhbmNob3IpIHtcbiAgICAgICAgYXBwZW5kX2h5ZHJhdGlvbih0YXJnZXQsIG5vZGUpO1xuICAgIH1cbiAgICBlbHNlIGlmIChub2RlLnBhcmVudE5vZGUgIT09IHRhcmdldCB8fCBub2RlLm5leHRTaWJsaW5nICE9IGFuY2hvcikge1xuICAgICAgICB0YXJnZXQuaW5zZXJ0QmVmb3JlKG5vZGUsIGFuY2hvciB8fCBudWxsKTtcbiAgICB9XG59XG5mdW5jdGlvbiBkZXRhY2gobm9kZSkge1xuICAgIG5vZGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChub2RlKTtcbn1cbmZ1bmN0aW9uIGRlc3Ryb3lfZWFjaChpdGVyYXRpb25zLCBkZXRhY2hpbmcpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGl0ZXJhdGlvbnMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgaWYgKGl0ZXJhdGlvbnNbaV0pXG4gICAgICAgICAgICBpdGVyYXRpb25zW2ldLmQoZGV0YWNoaW5nKTtcbiAgICB9XG59XG5mdW5jdGlvbiBlbGVtZW50KG5hbWUpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChuYW1lKTtcbn1cbmZ1bmN0aW9uIGVsZW1lbnRfaXMobmFtZSwgaXMpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChuYW1lLCB7IGlzIH0pO1xufVxuZnVuY3Rpb24gb2JqZWN0X3dpdGhvdXRfcHJvcGVydGllcyhvYmosIGV4Y2x1ZGUpIHtcbiAgICBjb25zdCB0YXJnZXQgPSB7fTtcbiAgICBmb3IgKGNvbnN0IGsgaW4gb2JqKSB7XG4gICAgICAgIGlmIChoYXNfcHJvcChvYmosIGspXG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICAmJiBleGNsdWRlLmluZGV4T2YoaykgPT09IC0xKSB7XG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICB0YXJnZXRba10gPSBvYmpba107XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRhcmdldDtcbn1cbmZ1bmN0aW9uIHN2Z19lbGVtZW50KG5hbWUpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsIG5hbWUpO1xufVxuZnVuY3Rpb24gdGV4dChkYXRhKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGRhdGEpO1xufVxuZnVuY3Rpb24gc3BhY2UoKSB7XG4gICAgcmV0dXJuIHRleHQoJyAnKTtcbn1cbmZ1bmN0aW9uIGVtcHR5KCkge1xuICAgIHJldHVybiB0ZXh0KCcnKTtcbn1cbmZ1bmN0aW9uIGxpc3Rlbihub2RlLCBldmVudCwgaGFuZGxlciwgb3B0aW9ucykge1xuICAgIG5vZGUuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgaGFuZGxlciwgb3B0aW9ucyk7XG4gICAgcmV0dXJuICgpID0+IG5vZGUucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudCwgaGFuZGxlciwgb3B0aW9ucyk7XG59XG5mdW5jdGlvbiBwcmV2ZW50X2RlZmF1bHQoZm4pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgcmV0dXJuIGZuLmNhbGwodGhpcywgZXZlbnQpO1xuICAgIH07XG59XG5mdW5jdGlvbiBzdG9wX3Byb3BhZ2F0aW9uKGZuKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICByZXR1cm4gZm4uY2FsbCh0aGlzLCBldmVudCk7XG4gICAgfTtcbn1cbmZ1bmN0aW9uIHNlbGYoZm4pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgaWYgKGV2ZW50LnRhcmdldCA9PT0gdGhpcylcbiAgICAgICAgICAgIGZuLmNhbGwodGhpcywgZXZlbnQpO1xuICAgIH07XG59XG5mdW5jdGlvbiB0cnVzdGVkKGZuKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIGlmIChldmVudC5pc1RydXN0ZWQpXG4gICAgICAgICAgICBmbi5jYWxsKHRoaXMsIGV2ZW50KTtcbiAgICB9O1xufVxuZnVuY3Rpb24gYXR0cihub2RlLCBhdHRyaWJ1dGUsIHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlID09IG51bGwpXG4gICAgICAgIG5vZGUucmVtb3ZlQXR0cmlidXRlKGF0dHJpYnV0ZSk7XG4gICAgZWxzZSBpZiAobm9kZS5nZXRBdHRyaWJ1dGUoYXR0cmlidXRlKSAhPT0gdmFsdWUpXG4gICAgICAgIG5vZGUuc2V0QXR0cmlidXRlKGF0dHJpYnV0ZSwgdmFsdWUpO1xufVxuZnVuY3Rpb24gc2V0X2F0dHJpYnV0ZXMobm9kZSwgYXR0cmlidXRlcykge1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBjb25zdCBkZXNjcmlwdG9ycyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKG5vZGUuX19wcm90b19fKTtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBhdHRyaWJ1dGVzKSB7XG4gICAgICAgIGlmIChhdHRyaWJ1dGVzW2tleV0gPT0gbnVsbCkge1xuICAgICAgICAgICAgbm9kZS5yZW1vdmVBdHRyaWJ1dGUoa2V5KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChrZXkgPT09ICdzdHlsZScpIHtcbiAgICAgICAgICAgIG5vZGUuc3R5bGUuY3NzVGV4dCA9IGF0dHJpYnV0ZXNba2V5XTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChrZXkgPT09ICdfX3ZhbHVlJykge1xuICAgICAgICAgICAgbm9kZS52YWx1ZSA9IG5vZGVba2V5XSA9IGF0dHJpYnV0ZXNba2V5XTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChkZXNjcmlwdG9yc1trZXldICYmIGRlc2NyaXB0b3JzW2tleV0uc2V0KSB7XG4gICAgICAgICAgICBub2RlW2tleV0gPSBhdHRyaWJ1dGVzW2tleV07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBhdHRyKG5vZGUsIGtleSwgYXR0cmlidXRlc1trZXldKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmZ1bmN0aW9uIHNldF9zdmdfYXR0cmlidXRlcyhub2RlLCBhdHRyaWJ1dGVzKSB7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gYXR0cmlidXRlcykge1xuICAgICAgICBhdHRyKG5vZGUsIGtleSwgYXR0cmlidXRlc1trZXldKTtcbiAgICB9XG59XG5mdW5jdGlvbiBzZXRfY3VzdG9tX2VsZW1lbnRfZGF0YShub2RlLCBwcm9wLCB2YWx1ZSkge1xuICAgIGlmIChwcm9wIGluIG5vZGUpIHtcbiAgICAgICAgbm9kZVtwcm9wXSA9IHR5cGVvZiBub2RlW3Byb3BdID09PSAnYm9vbGVhbicgJiYgdmFsdWUgPT09ICcnID8gdHJ1ZSA6IHZhbHVlO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgYXR0cihub2RlLCBwcm9wLCB2YWx1ZSk7XG4gICAgfVxufVxuZnVuY3Rpb24geGxpbmtfYXR0cihub2RlLCBhdHRyaWJ1dGUsIHZhbHVlKSB7XG4gICAgbm9kZS5zZXRBdHRyaWJ1dGVOUygnaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluaycsIGF0dHJpYnV0ZSwgdmFsdWUpO1xufVxuZnVuY3Rpb24gZ2V0X2JpbmRpbmdfZ3JvdXBfdmFsdWUoZ3JvdXAsIF9fdmFsdWUsIGNoZWNrZWQpIHtcbiAgICBjb25zdCB2YWx1ZSA9IG5ldyBTZXQoKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGdyb3VwLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGlmIChncm91cFtpXS5jaGVja2VkKVxuICAgICAgICAgICAgdmFsdWUuYWRkKGdyb3VwW2ldLl9fdmFsdWUpO1xuICAgIH1cbiAgICBpZiAoIWNoZWNrZWQpIHtcbiAgICAgICAgdmFsdWUuZGVsZXRlKF9fdmFsdWUpO1xuICAgIH1cbiAgICByZXR1cm4gQXJyYXkuZnJvbSh2YWx1ZSk7XG59XG5mdW5jdGlvbiB0b19udW1iZXIodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09ICcnID8gbnVsbCA6ICt2YWx1ZTtcbn1cbmZ1bmN0aW9uIHRpbWVfcmFuZ2VzX3RvX2FycmF5KHJhbmdlcykge1xuICAgIGNvbnN0IGFycmF5ID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCByYW5nZXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgYXJyYXkucHVzaCh7IHN0YXJ0OiByYW5nZXMuc3RhcnQoaSksIGVuZDogcmFuZ2VzLmVuZChpKSB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGFycmF5O1xufVxuZnVuY3Rpb24gY2hpbGRyZW4oZWxlbWVudCkge1xuICAgIHJldHVybiBBcnJheS5mcm9tKGVsZW1lbnQuY2hpbGROb2Rlcyk7XG59XG5mdW5jdGlvbiBpbml0X2NsYWltX2luZm8obm9kZXMpIHtcbiAgICBpZiAobm9kZXMuY2xhaW1faW5mbyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIG5vZGVzLmNsYWltX2luZm8gPSB7IGxhc3RfaW5kZXg6IDAsIHRvdGFsX2NsYWltZWQ6IDAgfTtcbiAgICB9XG59XG5mdW5jdGlvbiBjbGFpbV9ub2RlKG5vZGVzLCBwcmVkaWNhdGUsIHByb2Nlc3NOb2RlLCBjcmVhdGVOb2RlLCBkb250VXBkYXRlTGFzdEluZGV4ID0gZmFsc2UpIHtcbiAgICAvLyBUcnkgdG8gZmluZCBub2RlcyBpbiBhbiBvcmRlciBzdWNoIHRoYXQgd2UgbGVuZ3RoZW4gdGhlIGxvbmdlc3QgaW5jcmVhc2luZyBzdWJzZXF1ZW5jZVxuICAgIGluaXRfY2xhaW1faW5mbyhub2Rlcyk7XG4gICAgY29uc3QgcmVzdWx0Tm9kZSA9ICgoKSA9PiB7XG4gICAgICAgIC8vIFdlIGZpcnN0IHRyeSB0byBmaW5kIGFuIGVsZW1lbnQgYWZ0ZXIgdGhlIHByZXZpb3VzIG9uZVxuICAgICAgICBmb3IgKGxldCBpID0gbm9kZXMuY2xhaW1faW5mby5sYXN0X2luZGV4OyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IG5vZGUgPSBub2Rlc1tpXTtcbiAgICAgICAgICAgIGlmIChwcmVkaWNhdGUobm9kZSkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCByZXBsYWNlbWVudCA9IHByb2Nlc3NOb2RlKG5vZGUpO1xuICAgICAgICAgICAgICAgIGlmIChyZXBsYWNlbWVudCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIG5vZGVzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG5vZGVzW2ldID0gcmVwbGFjZW1lbnQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghZG9udFVwZGF0ZUxhc3RJbmRleCkge1xuICAgICAgICAgICAgICAgICAgICBub2Rlcy5jbGFpbV9pbmZvLmxhc3RfaW5kZXggPSBpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gbm9kZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBPdGhlcndpc2UsIHdlIHRyeSB0byBmaW5kIG9uZSBiZWZvcmVcbiAgICAgICAgLy8gV2UgaXRlcmF0ZSBpbiByZXZlcnNlIHNvIHRoYXQgd2UgZG9uJ3QgZ28gdG9vIGZhciBiYWNrXG4gICAgICAgIGZvciAobGV0IGkgPSBub2Rlcy5jbGFpbV9pbmZvLmxhc3RfaW5kZXggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgY29uc3Qgbm9kZSA9IG5vZGVzW2ldO1xuICAgICAgICAgICAgaWYgKHByZWRpY2F0ZShub2RlKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlcGxhY2VtZW50ID0gcHJvY2Vzc05vZGUobm9kZSk7XG4gICAgICAgICAgICAgICAgaWYgKHJlcGxhY2VtZW50ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgbm9kZXMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbm9kZXNbaV0gPSByZXBsYWNlbWVudDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCFkb250VXBkYXRlTGFzdEluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgIG5vZGVzLmNsYWltX2luZm8ubGFzdF9pbmRleCA9IGk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHJlcGxhY2VtZW50ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gU2luY2Ugd2Ugc3BsaWNlZCBiZWZvcmUgdGhlIGxhc3RfaW5kZXgsIHdlIGRlY3JlYXNlIGl0XG4gICAgICAgICAgICAgICAgICAgIG5vZGVzLmNsYWltX2luZm8ubGFzdF9pbmRleC0tO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gbm9kZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBJZiB3ZSBjYW4ndCBmaW5kIGFueSBtYXRjaGluZyBub2RlLCB3ZSBjcmVhdGUgYSBuZXcgb25lXG4gICAgICAgIHJldHVybiBjcmVhdGVOb2RlKCk7XG4gICAgfSkoKTtcbiAgICByZXN1bHROb2RlLmNsYWltX29yZGVyID0gbm9kZXMuY2xhaW1faW5mby50b3RhbF9jbGFpbWVkO1xuICAgIG5vZGVzLmNsYWltX2luZm8udG90YWxfY2xhaW1lZCArPSAxO1xuICAgIHJldHVybiByZXN1bHROb2RlO1xufVxuZnVuY3Rpb24gY2xhaW1fZWxlbWVudF9iYXNlKG5vZGVzLCBuYW1lLCBhdHRyaWJ1dGVzLCBjcmVhdGVfZWxlbWVudCkge1xuICAgIHJldHVybiBjbGFpbV9ub2RlKG5vZGVzLCAobm9kZSkgPT4gbm9kZS5ub2RlTmFtZSA9PT0gbmFtZSwgKG5vZGUpID0+IHtcbiAgICAgICAgY29uc3QgcmVtb3ZlID0gW107XG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgbm9kZS5hdHRyaWJ1dGVzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICBjb25zdCBhdHRyaWJ1dGUgPSBub2RlLmF0dHJpYnV0ZXNbal07XG4gICAgICAgICAgICBpZiAoIWF0dHJpYnV0ZXNbYXR0cmlidXRlLm5hbWVdKSB7XG4gICAgICAgICAgICAgICAgcmVtb3ZlLnB1c2goYXR0cmlidXRlLm5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJlbW92ZS5mb3JFYWNoKHYgPT4gbm9kZS5yZW1vdmVBdHRyaWJ1dGUodikpO1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH0sICgpID0+IGNyZWF0ZV9lbGVtZW50KG5hbWUpKTtcbn1cbmZ1bmN0aW9uIGNsYWltX2VsZW1lbnQobm9kZXMsIG5hbWUsIGF0dHJpYnV0ZXMpIHtcbiAgICByZXR1cm4gY2xhaW1fZWxlbWVudF9iYXNlKG5vZGVzLCBuYW1lLCBhdHRyaWJ1dGVzLCBlbGVtZW50KTtcbn1cbmZ1bmN0aW9uIGNsYWltX3N2Z19lbGVtZW50KG5vZGVzLCBuYW1lLCBhdHRyaWJ1dGVzKSB7XG4gICAgcmV0dXJuIGNsYWltX2VsZW1lbnRfYmFzZShub2RlcywgbmFtZSwgYXR0cmlidXRlcywgc3ZnX2VsZW1lbnQpO1xufVxuZnVuY3Rpb24gY2xhaW1fdGV4dChub2RlcywgZGF0YSkge1xuICAgIHJldHVybiBjbGFpbV9ub2RlKG5vZGVzLCAobm9kZSkgPT4gbm9kZS5ub2RlVHlwZSA9PT0gMywgKG5vZGUpID0+IHtcbiAgICAgICAgY29uc3QgZGF0YVN0ciA9ICcnICsgZGF0YTtcbiAgICAgICAgaWYgKG5vZGUuZGF0YS5zdGFydHNXaXRoKGRhdGFTdHIpKSB7XG4gICAgICAgICAgICBpZiAobm9kZS5kYXRhLmxlbmd0aCAhPT0gZGF0YVN0ci5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbm9kZS5zcGxpdFRleHQoZGF0YVN0ci5sZW5ndGgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbm9kZS5kYXRhID0gZGF0YVN0cjtcbiAgICAgICAgfVxuICAgIH0sICgpID0+IHRleHQoZGF0YSksIHRydWUgLy8gVGV4dCBub2RlcyBzaG91bGQgbm90IHVwZGF0ZSBsYXN0IGluZGV4IHNpbmNlIGl0IGlzIGxpa2VseSBub3Qgd29ydGggaXQgdG8gZWxpbWluYXRlIGFuIGluY3JlYXNpbmcgc3Vic2VxdWVuY2Ugb2YgYWN0dWFsIGVsZW1lbnRzXG4gICAgKTtcbn1cbmZ1bmN0aW9uIGNsYWltX3NwYWNlKG5vZGVzKSB7XG4gICAgcmV0dXJuIGNsYWltX3RleHQobm9kZXMsICcgJyk7XG59XG5mdW5jdGlvbiBmaW5kX2NvbW1lbnQobm9kZXMsIHRleHQsIHN0YXJ0KSB7XG4gICAgZm9yIChsZXQgaSA9IHN0YXJ0OyBpIDwgbm9kZXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgY29uc3Qgbm9kZSA9IG5vZGVzW2ldO1xuICAgICAgICBpZiAobm9kZS5ub2RlVHlwZSA9PT0gOCAvKiBjb21tZW50IG5vZGUgKi8gJiYgbm9kZS50ZXh0Q29udGVudC50cmltKCkgPT09IHRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBub2Rlcy5sZW5ndGg7XG59XG5mdW5jdGlvbiBjbGFpbV9odG1sX3RhZyhub2Rlcykge1xuICAgIC8vIGZpbmQgaHRtbCBvcGVuaW5nIHRhZ1xuICAgIGNvbnN0IHN0YXJ0X2luZGV4ID0gZmluZF9jb21tZW50KG5vZGVzLCAnSFRNTF9UQUdfU1RBUlQnLCAwKTtcbiAgICBjb25zdCBlbmRfaW5kZXggPSBmaW5kX2NvbW1lbnQobm9kZXMsICdIVE1MX1RBR19FTkQnLCBzdGFydF9pbmRleCk7XG4gICAgaWYgKHN0YXJ0X2luZGV4ID09PSBlbmRfaW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBIdG1sVGFnSHlkcmF0aW9uKCk7XG4gICAgfVxuICAgIGluaXRfY2xhaW1faW5mbyhub2Rlcyk7XG4gICAgY29uc3QgaHRtbF90YWdfbm9kZXMgPSBub2Rlcy5zcGxpY2Uoc3RhcnRfaW5kZXgsIGVuZF9pbmRleCAtIHN0YXJ0X2luZGV4ICsgMSk7XG4gICAgZGV0YWNoKGh0bWxfdGFnX25vZGVzWzBdKTtcbiAgICBkZXRhY2goaHRtbF90YWdfbm9kZXNbaHRtbF90YWdfbm9kZXMubGVuZ3RoIC0gMV0pO1xuICAgIGNvbnN0IGNsYWltZWRfbm9kZXMgPSBodG1sX3RhZ19ub2Rlcy5zbGljZSgxLCBodG1sX3RhZ19ub2Rlcy5sZW5ndGggLSAxKTtcbiAgICBmb3IgKGNvbnN0IG4gb2YgY2xhaW1lZF9ub2Rlcykge1xuICAgICAgICBuLmNsYWltX29yZGVyID0gbm9kZXMuY2xhaW1faW5mby50b3RhbF9jbGFpbWVkO1xuICAgICAgICBub2Rlcy5jbGFpbV9pbmZvLnRvdGFsX2NsYWltZWQgKz0gMTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBIdG1sVGFnSHlkcmF0aW9uKGNsYWltZWRfbm9kZXMpO1xufVxuZnVuY3Rpb24gc2V0X2RhdGEodGV4dCwgZGF0YSkge1xuICAgIGRhdGEgPSAnJyArIGRhdGE7XG4gICAgaWYgKHRleHQud2hvbGVUZXh0ICE9PSBkYXRhKVxuICAgICAgICB0ZXh0LmRhdGEgPSBkYXRhO1xufVxuZnVuY3Rpb24gc2V0X2lucHV0X3ZhbHVlKGlucHV0LCB2YWx1ZSkge1xuICAgIGlucHV0LnZhbHVlID0gdmFsdWUgPT0gbnVsbCA/ICcnIDogdmFsdWU7XG59XG5mdW5jdGlvbiBzZXRfaW5wdXRfdHlwZShpbnB1dCwgdHlwZSkge1xuICAgIHRyeSB7XG4gICAgICAgIGlucHV0LnR5cGUgPSB0eXBlO1xuICAgIH1cbiAgICBjYXRjaCAoZSkge1xuICAgICAgICAvLyBkbyBub3RoaW5nXG4gICAgfVxufVxuZnVuY3Rpb24gc2V0X3N0eWxlKG5vZGUsIGtleSwgdmFsdWUsIGltcG9ydGFudCkge1xuICAgIGlmICh2YWx1ZSA9PT0gbnVsbCkge1xuICAgICAgICBub2RlLnN0eWxlLnJlbW92ZVByb3BlcnR5KGtleSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBub2RlLnN0eWxlLnNldFByb3BlcnR5KGtleSwgdmFsdWUsIGltcG9ydGFudCA/ICdpbXBvcnRhbnQnIDogJycpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHNlbGVjdF9vcHRpb24oc2VsZWN0LCB2YWx1ZSkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2VsZWN0Lm9wdGlvbnMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgY29uc3Qgb3B0aW9uID0gc2VsZWN0Lm9wdGlvbnNbaV07XG4gICAgICAgIGlmIChvcHRpb24uX192YWx1ZSA9PT0gdmFsdWUpIHtcbiAgICAgICAgICAgIG9wdGlvbi5zZWxlY3RlZCA9IHRydWU7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICB9XG4gICAgc2VsZWN0LnNlbGVjdGVkSW5kZXggPSAtMTsgLy8gbm8gb3B0aW9uIHNob3VsZCBiZSBzZWxlY3RlZFxufVxuZnVuY3Rpb24gc2VsZWN0X29wdGlvbnMoc2VsZWN0LCB2YWx1ZSkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2VsZWN0Lm9wdGlvbnMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgY29uc3Qgb3B0aW9uID0gc2VsZWN0Lm9wdGlvbnNbaV07XG4gICAgICAgIG9wdGlvbi5zZWxlY3RlZCA9IH52YWx1ZS5pbmRleE9mKG9wdGlvbi5fX3ZhbHVlKTtcbiAgICB9XG59XG5mdW5jdGlvbiBzZWxlY3RfdmFsdWUoc2VsZWN0KSB7XG4gICAgY29uc3Qgc2VsZWN0ZWRfb3B0aW9uID0gc2VsZWN0LnF1ZXJ5U2VsZWN0b3IoJzpjaGVja2VkJykgfHwgc2VsZWN0Lm9wdGlvbnNbMF07XG4gICAgcmV0dXJuIHNlbGVjdGVkX29wdGlvbiAmJiBzZWxlY3RlZF9vcHRpb24uX192YWx1ZTtcbn1cbmZ1bmN0aW9uIHNlbGVjdF9tdWx0aXBsZV92YWx1ZShzZWxlY3QpIHtcbiAgICByZXR1cm4gW10ubWFwLmNhbGwoc2VsZWN0LnF1ZXJ5U2VsZWN0b3JBbGwoJzpjaGVja2VkJyksIG9wdGlvbiA9PiBvcHRpb24uX192YWx1ZSk7XG59XG4vLyB1bmZvcnR1bmF0ZWx5IHRoaXMgY2FuJ3QgYmUgYSBjb25zdGFudCBhcyB0aGF0IHdvdWxkbid0IGJlIHRyZWUtc2hha2VhYmxlXG4vLyBzbyB3ZSBjYWNoZSB0aGUgcmVzdWx0IGluc3RlYWRcbmxldCBjcm9zc29yaWdpbjtcbmZ1bmN0aW9uIGlzX2Nyb3Nzb3JpZ2luKCkge1xuICAgIGlmIChjcm9zc29yaWdpbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNyb3Nzb3JpZ2luID0gZmFsc2U7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LnBhcmVudCkge1xuICAgICAgICAgICAgICAgIHZvaWQgd2luZG93LnBhcmVudC5kb2N1bWVudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNyb3Nzb3JpZ2luID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY3Jvc3NvcmlnaW47XG59XG5mdW5jdGlvbiBhZGRfcmVzaXplX2xpc3RlbmVyKG5vZGUsIGZuKSB7XG4gICAgY29uc3QgY29tcHV0ZWRfc3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKG5vZGUpO1xuICAgIGlmIChjb21wdXRlZF9zdHlsZS5wb3NpdGlvbiA9PT0gJ3N0YXRpYycpIHtcbiAgICAgICAgbm9kZS5zdHlsZS5wb3NpdGlvbiA9ICdyZWxhdGl2ZSc7XG4gICAgfVxuICAgIGNvbnN0IGlmcmFtZSA9IGVsZW1lbnQoJ2lmcmFtZScpO1xuICAgIGlmcmFtZS5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJ2Rpc3BsYXk6IGJsb2NrOyBwb3NpdGlvbjogYWJzb2x1dGU7IHRvcDogMDsgbGVmdDogMDsgd2lkdGg6IDEwMCU7IGhlaWdodDogMTAwJTsgJyArXG4gICAgICAgICdvdmVyZmxvdzogaGlkZGVuOyBib3JkZXI6IDA7IG9wYWNpdHk6IDA7IHBvaW50ZXItZXZlbnRzOiBub25lOyB6LWluZGV4OiAtMTsnKTtcbiAgICBpZnJhbWUuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG4gICAgaWZyYW1lLnRhYkluZGV4ID0gLTE7XG4gICAgY29uc3QgY3Jvc3NvcmlnaW4gPSBpc19jcm9zc29yaWdpbigpO1xuICAgIGxldCB1bnN1YnNjcmliZTtcbiAgICBpZiAoY3Jvc3NvcmlnaW4pIHtcbiAgICAgICAgaWZyYW1lLnNyYyA9IFwiZGF0YTp0ZXh0L2h0bWwsPHNjcmlwdD5vbnJlc2l6ZT1mdW5jdGlvbigpe3BhcmVudC5wb3N0TWVzc2FnZSgwLCcqJyl9PC9zY3JpcHQ+XCI7XG4gICAgICAgIHVuc3Vic2NyaWJlID0gbGlzdGVuKHdpbmRvdywgJ21lc3NhZ2UnLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGlmIChldmVudC5zb3VyY2UgPT09IGlmcmFtZS5jb250ZW50V2luZG93KVxuICAgICAgICAgICAgICAgIGZuKCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgaWZyYW1lLnNyYyA9ICdhYm91dDpibGFuayc7XG4gICAgICAgIGlmcmFtZS5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICAgICAgICB1bnN1YnNjcmliZSA9IGxpc3RlbihpZnJhbWUuY29udGVudFdpbmRvdywgJ3Jlc2l6ZScsIGZuKTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgYXBwZW5kKG5vZGUsIGlmcmFtZSk7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgaWYgKGNyb3Nzb3JpZ2luKSB7XG4gICAgICAgICAgICB1bnN1YnNjcmliZSgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHVuc3Vic2NyaWJlICYmIGlmcmFtZS5jb250ZW50V2luZG93KSB7XG4gICAgICAgICAgICB1bnN1YnNjcmliZSgpO1xuICAgICAgICB9XG4gICAgICAgIGRldGFjaChpZnJhbWUpO1xuICAgIH07XG59XG5mdW5jdGlvbiB0b2dnbGVfY2xhc3MoZWxlbWVudCwgbmFtZSwgdG9nZ2xlKSB7XG4gICAgZWxlbWVudC5jbGFzc0xpc3RbdG9nZ2xlID8gJ2FkZCcgOiAncmVtb3ZlJ10obmFtZSk7XG59XG5mdW5jdGlvbiBjdXN0b21fZXZlbnQodHlwZSwgZGV0YWlsLCBidWJibGVzID0gZmFsc2UpIHtcbiAgICBjb25zdCBlID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0N1c3RvbUV2ZW50Jyk7XG4gICAgZS5pbml0Q3VzdG9tRXZlbnQodHlwZSwgYnViYmxlcywgZmFsc2UsIGRldGFpbCk7XG4gICAgcmV0dXJuIGU7XG59XG5mdW5jdGlvbiBxdWVyeV9zZWxlY3Rvcl9hbGwoc2VsZWN0b3IsIHBhcmVudCA9IGRvY3VtZW50LmJvZHkpIHtcbiAgICByZXR1cm4gQXJyYXkuZnJvbShwYXJlbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcikpO1xufVxuY2xhc3MgSHRtbFRhZyB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuZSA9IHRoaXMubiA9IG51bGw7XG4gICAgfVxuICAgIGMoaHRtbCkge1xuICAgICAgICB0aGlzLmgoaHRtbCk7XG4gICAgfVxuICAgIG0oaHRtbCwgdGFyZ2V0LCBhbmNob3IgPSBudWxsKSB7XG4gICAgICAgIGlmICghdGhpcy5lKSB7XG4gICAgICAgICAgICB0aGlzLmUgPSBlbGVtZW50KHRhcmdldC5ub2RlTmFtZSk7XG4gICAgICAgICAgICB0aGlzLnQgPSB0YXJnZXQ7XG4gICAgICAgICAgICB0aGlzLmMoaHRtbCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pKGFuY2hvcik7XG4gICAgfVxuICAgIGgoaHRtbCkge1xuICAgICAgICB0aGlzLmUuaW5uZXJIVE1MID0gaHRtbDtcbiAgICAgICAgdGhpcy5uID0gQXJyYXkuZnJvbSh0aGlzLmUuY2hpbGROb2Rlcyk7XG4gICAgfVxuICAgIGkoYW5jaG9yKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5uLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICBpbnNlcnQodGhpcy50LCB0aGlzLm5baV0sIGFuY2hvcik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcChodG1sKSB7XG4gICAgICAgIHRoaXMuZCgpO1xuICAgICAgICB0aGlzLmgoaHRtbCk7XG4gICAgICAgIHRoaXMuaSh0aGlzLmEpO1xuICAgIH1cbiAgICBkKCkge1xuICAgICAgICB0aGlzLm4uZm9yRWFjaChkZXRhY2gpO1xuICAgIH1cbn1cbmNsYXNzIEh0bWxUYWdIeWRyYXRpb24gZXh0ZW5kcyBIdG1sVGFnIHtcbiAgICBjb25zdHJ1Y3RvcihjbGFpbWVkX25vZGVzKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuZSA9IHRoaXMubiA9IG51bGw7XG4gICAgICAgIHRoaXMubCA9IGNsYWltZWRfbm9kZXM7XG4gICAgfVxuICAgIGMoaHRtbCkge1xuICAgICAgICBpZiAodGhpcy5sKSB7XG4gICAgICAgICAgICB0aGlzLm4gPSB0aGlzLmw7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBzdXBlci5jKGh0bWwpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGkoYW5jaG9yKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5uLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICBpbnNlcnRfaHlkcmF0aW9uKHRoaXMudCwgdGhpcy5uW2ldLCBhbmNob3IpO1xuICAgICAgICB9XG4gICAgfVxufVxuZnVuY3Rpb24gYXR0cmlidXRlX3RvX29iamVjdChhdHRyaWJ1dGVzKSB7XG4gICAgY29uc3QgcmVzdWx0ID0ge307XG4gICAgZm9yIChjb25zdCBhdHRyaWJ1dGUgb2YgYXR0cmlidXRlcykge1xuICAgICAgICByZXN1bHRbYXR0cmlidXRlLm5hbWVdID0gYXR0cmlidXRlLnZhbHVlO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gZ2V0X2N1c3RvbV9lbGVtZW50c19zbG90cyhlbGVtZW50KSB7XG4gICAgY29uc3QgcmVzdWx0ID0ge307XG4gICAgZWxlbWVudC5jaGlsZE5vZGVzLmZvckVhY2goKG5vZGUpID0+IHtcbiAgICAgICAgcmVzdWx0W25vZGUuc2xvdCB8fCAnZGVmYXVsdCddID0gdHJ1ZTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0O1xufVxuXG4vLyB3ZSBuZWVkIHRvIHN0b3JlIHRoZSBpbmZvcm1hdGlvbiBmb3IgbXVsdGlwbGUgZG9jdW1lbnRzIGJlY2F1c2UgYSBTdmVsdGUgYXBwbGljYXRpb24gY291bGQgYWxzbyBjb250YWluIGlmcmFtZXNcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9zdmVsdGVqcy9zdmVsdGUvaXNzdWVzLzM2MjRcbmNvbnN0IG1hbmFnZWRfc3R5bGVzID0gbmV3IE1hcCgpO1xubGV0IGFjdGl2ZSA9IDA7XG4vLyBodHRwczovL2dpdGh1Yi5jb20vZGFya3NreWFwcC9zdHJpbmctaGFzaC9ibG9iL21hc3Rlci9pbmRleC5qc1xuZnVuY3Rpb24gaGFzaChzdHIpIHtcbiAgICBsZXQgaGFzaCA9IDUzODE7XG4gICAgbGV0IGkgPSBzdHIubGVuZ3RoO1xuICAgIHdoaWxlIChpLS0pXG4gICAgICAgIGhhc2ggPSAoKGhhc2ggPDwgNSkgLSBoYXNoKSBeIHN0ci5jaGFyQ29kZUF0KGkpO1xuICAgIHJldHVybiBoYXNoID4+PiAwO1xufVxuZnVuY3Rpb24gY3JlYXRlX3N0eWxlX2luZm9ybWF0aW9uKGRvYywgbm9kZSkge1xuICAgIGNvbnN0IGluZm8gPSB7IHN0eWxlc2hlZXQ6IGFwcGVuZF9lbXB0eV9zdHlsZXNoZWV0KG5vZGUpLCBydWxlczoge30gfTtcbiAgICBtYW5hZ2VkX3N0eWxlcy5zZXQoZG9jLCBpbmZvKTtcbiAgICByZXR1cm4gaW5mbztcbn1cbmZ1bmN0aW9uIGNyZWF0ZV9ydWxlKG5vZGUsIGEsIGIsIGR1cmF0aW9uLCBkZWxheSwgZWFzZSwgZm4sIHVpZCA9IDApIHtcbiAgICBjb25zdCBzdGVwID0gMTYuNjY2IC8gZHVyYXRpb247XG4gICAgbGV0IGtleWZyYW1lcyA9ICd7XFxuJztcbiAgICBmb3IgKGxldCBwID0gMDsgcCA8PSAxOyBwICs9IHN0ZXApIHtcbiAgICAgICAgY29uc3QgdCA9IGEgKyAoYiAtIGEpICogZWFzZShwKTtcbiAgICAgICAga2V5ZnJhbWVzICs9IHAgKiAxMDAgKyBgJXske2ZuKHQsIDEgLSB0KX19XFxuYDtcbiAgICB9XG4gICAgY29uc3QgcnVsZSA9IGtleWZyYW1lcyArIGAxMDAlIHske2ZuKGIsIDEgLSBiKX19XFxufWA7XG4gICAgY29uc3QgbmFtZSA9IGBfX3N2ZWx0ZV8ke2hhc2gocnVsZSl9XyR7dWlkfWA7XG4gICAgY29uc3QgZG9jID0gZ2V0X3Jvb3RfZm9yX3N0eWxlKG5vZGUpO1xuICAgIGNvbnN0IHsgc3R5bGVzaGVldCwgcnVsZXMgfSA9IG1hbmFnZWRfc3R5bGVzLmdldChkb2MpIHx8IGNyZWF0ZV9zdHlsZV9pbmZvcm1hdGlvbihkb2MsIG5vZGUpO1xuICAgIGlmICghcnVsZXNbbmFtZV0pIHtcbiAgICAgICAgcnVsZXNbbmFtZV0gPSB0cnVlO1xuICAgICAgICBzdHlsZXNoZWV0Lmluc2VydFJ1bGUoYEBrZXlmcmFtZXMgJHtuYW1lfSAke3J1bGV9YCwgc3R5bGVzaGVldC5jc3NSdWxlcy5sZW5ndGgpO1xuICAgIH1cbiAgICBjb25zdCBhbmltYXRpb24gPSBub2RlLnN0eWxlLmFuaW1hdGlvbiB8fCAnJztcbiAgICBub2RlLnN0eWxlLmFuaW1hdGlvbiA9IGAke2FuaW1hdGlvbiA/IGAke2FuaW1hdGlvbn0sIGAgOiAnJ30ke25hbWV9ICR7ZHVyYXRpb259bXMgbGluZWFyICR7ZGVsYXl9bXMgMSBib3RoYDtcbiAgICBhY3RpdmUgKz0gMTtcbiAgICByZXR1cm4gbmFtZTtcbn1cbmZ1bmN0aW9uIGRlbGV0ZV9ydWxlKG5vZGUsIG5hbWUpIHtcbiAgICBjb25zdCBwcmV2aW91cyA9IChub2RlLnN0eWxlLmFuaW1hdGlvbiB8fCAnJykuc3BsaXQoJywgJyk7XG4gICAgY29uc3QgbmV4dCA9IHByZXZpb3VzLmZpbHRlcihuYW1lXG4gICAgICAgID8gYW5pbSA9PiBhbmltLmluZGV4T2YobmFtZSkgPCAwIC8vIHJlbW92ZSBzcGVjaWZpYyBhbmltYXRpb25cbiAgICAgICAgOiBhbmltID0+IGFuaW0uaW5kZXhPZignX19zdmVsdGUnKSA9PT0gLTEgLy8gcmVtb3ZlIGFsbCBTdmVsdGUgYW5pbWF0aW9uc1xuICAgICk7XG4gICAgY29uc3QgZGVsZXRlZCA9IHByZXZpb3VzLmxlbmd0aCAtIG5leHQubGVuZ3RoO1xuICAgIGlmIChkZWxldGVkKSB7XG4gICAgICAgIG5vZGUuc3R5bGUuYW5pbWF0aW9uID0gbmV4dC5qb2luKCcsICcpO1xuICAgICAgICBhY3RpdmUgLT0gZGVsZXRlZDtcbiAgICAgICAgaWYgKCFhY3RpdmUpXG4gICAgICAgICAgICBjbGVhcl9ydWxlcygpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGNsZWFyX3J1bGVzKCkge1xuICAgIHJhZigoKSA9PiB7XG4gICAgICAgIGlmIChhY3RpdmUpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIG1hbmFnZWRfc3R5bGVzLmZvckVhY2goaW5mbyA9PiB7XG4gICAgICAgICAgICBjb25zdCB7IHN0eWxlc2hlZXQgfSA9IGluZm87XG4gICAgICAgICAgICBsZXQgaSA9IHN0eWxlc2hlZXQuY3NzUnVsZXMubGVuZ3RoO1xuICAgICAgICAgICAgd2hpbGUgKGktLSlcbiAgICAgICAgICAgICAgICBzdHlsZXNoZWV0LmRlbGV0ZVJ1bGUoaSk7XG4gICAgICAgICAgICBpbmZvLnJ1bGVzID0ge307XG4gICAgICAgIH0pO1xuICAgICAgICBtYW5hZ2VkX3N0eWxlcy5jbGVhcigpO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVfYW5pbWF0aW9uKG5vZGUsIGZyb20sIGZuLCBwYXJhbXMpIHtcbiAgICBpZiAoIWZyb20pXG4gICAgICAgIHJldHVybiBub29wO1xuICAgIGNvbnN0IHRvID0gbm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBpZiAoZnJvbS5sZWZ0ID09PSB0by5sZWZ0ICYmIGZyb20ucmlnaHQgPT09IHRvLnJpZ2h0ICYmIGZyb20udG9wID09PSB0by50b3AgJiYgZnJvbS5ib3R0b20gPT09IHRvLmJvdHRvbSlcbiAgICAgICAgcmV0dXJuIG5vb3A7XG4gICAgY29uc3QgeyBkZWxheSA9IDAsIGR1cmF0aW9uID0gMzAwLCBlYXNpbmcgPSBpZGVudGl0eSwgXG4gICAgLy8gQHRzLWlnbm9yZSB0b2RvOiBzaG91bGQgdGhpcyBiZSBzZXBhcmF0ZWQgZnJvbSBkZXN0cnVjdHVyaW5nPyBPciBzdGFydC9lbmQgYWRkZWQgdG8gcHVibGljIGFwaSBhbmQgZG9jdW1lbnRhdGlvbj9cbiAgICBzdGFydDogc3RhcnRfdGltZSA9IG5vdygpICsgZGVsYXksIFxuICAgIC8vIEB0cy1pZ25vcmUgdG9kbzpcbiAgICBlbmQgPSBzdGFydF90aW1lICsgZHVyYXRpb24sIHRpY2sgPSBub29wLCBjc3MgfSA9IGZuKG5vZGUsIHsgZnJvbSwgdG8gfSwgcGFyYW1zKTtcbiAgICBsZXQgcnVubmluZyA9IHRydWU7XG4gICAgbGV0IHN0YXJ0ZWQgPSBmYWxzZTtcbiAgICBsZXQgbmFtZTtcbiAgICBmdW5jdGlvbiBzdGFydCgpIHtcbiAgICAgICAgaWYgKGNzcykge1xuICAgICAgICAgICAgbmFtZSA9IGNyZWF0ZV9ydWxlKG5vZGUsIDAsIDEsIGR1cmF0aW9uLCBkZWxheSwgZWFzaW5nLCBjc3MpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghZGVsYXkpIHtcbiAgICAgICAgICAgIHN0YXJ0ZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIHN0b3AoKSB7XG4gICAgICAgIGlmIChjc3MpXG4gICAgICAgICAgICBkZWxldGVfcnVsZShub2RlLCBuYW1lKTtcbiAgICAgICAgcnVubmluZyA9IGZhbHNlO1xuICAgIH1cbiAgICBsb29wKG5vdyA9PiB7XG4gICAgICAgIGlmICghc3RhcnRlZCAmJiBub3cgPj0gc3RhcnRfdGltZSkge1xuICAgICAgICAgICAgc3RhcnRlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHN0YXJ0ZWQgJiYgbm93ID49IGVuZCkge1xuICAgICAgICAgICAgdGljaygxLCAwKTtcbiAgICAgICAgICAgIHN0b3AoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXJ1bm5pbmcpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc3RhcnRlZCkge1xuICAgICAgICAgICAgY29uc3QgcCA9IG5vdyAtIHN0YXJ0X3RpbWU7XG4gICAgICAgICAgICBjb25zdCB0ID0gMCArIDEgKiBlYXNpbmcocCAvIGR1cmF0aW9uKTtcbiAgICAgICAgICAgIHRpY2sodCwgMSAtIHQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0pO1xuICAgIHN0YXJ0KCk7XG4gICAgdGljaygwLCAxKTtcbiAgICByZXR1cm4gc3RvcDtcbn1cbmZ1bmN0aW9uIGZpeF9wb3NpdGlvbihub2RlKSB7XG4gICAgY29uc3Qgc3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKG5vZGUpO1xuICAgIGlmIChzdHlsZS5wb3NpdGlvbiAhPT0gJ2Fic29sdXRlJyAmJiBzdHlsZS5wb3NpdGlvbiAhPT0gJ2ZpeGVkJykge1xuICAgICAgICBjb25zdCB7IHdpZHRoLCBoZWlnaHQgfSA9IHN0eWxlO1xuICAgICAgICBjb25zdCBhID0gbm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgbm9kZS5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICAgIG5vZGUuc3R5bGUud2lkdGggPSB3aWR0aDtcbiAgICAgICAgbm9kZS5zdHlsZS5oZWlnaHQgPSBoZWlnaHQ7XG4gICAgICAgIGFkZF90cmFuc2Zvcm0obm9kZSwgYSk7XG4gICAgfVxufVxuZnVuY3Rpb24gYWRkX3RyYW5zZm9ybShub2RlLCBhKSB7XG4gICAgY29uc3QgYiA9IG5vZGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgaWYgKGEubGVmdCAhPT0gYi5sZWZ0IHx8IGEudG9wICE9PSBiLnRvcCkge1xuICAgICAgICBjb25zdCBzdHlsZSA9IGdldENvbXB1dGVkU3R5bGUobm9kZSk7XG4gICAgICAgIGNvbnN0IHRyYW5zZm9ybSA9IHN0eWxlLnRyYW5zZm9ybSA9PT0gJ25vbmUnID8gJycgOiBzdHlsZS50cmFuc2Zvcm07XG4gICAgICAgIG5vZGUuc3R5bGUudHJhbnNmb3JtID0gYCR7dHJhbnNmb3JtfSB0cmFuc2xhdGUoJHthLmxlZnQgLSBiLmxlZnR9cHgsICR7YS50b3AgLSBiLnRvcH1weClgO1xuICAgIH1cbn1cblxubGV0IGN1cnJlbnRfY29tcG9uZW50O1xuZnVuY3Rpb24gc2V0X2N1cnJlbnRfY29tcG9uZW50KGNvbXBvbmVudCkge1xuICAgIGN1cnJlbnRfY29tcG9uZW50ID0gY29tcG9uZW50O1xufVxuZnVuY3Rpb24gZ2V0X2N1cnJlbnRfY29tcG9uZW50KCkge1xuICAgIGlmICghY3VycmVudF9jb21wb25lbnQpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignRnVuY3Rpb24gY2FsbGVkIG91dHNpZGUgY29tcG9uZW50IGluaXRpYWxpemF0aW9uJyk7XG4gICAgcmV0dXJuIGN1cnJlbnRfY29tcG9uZW50O1xufVxuZnVuY3Rpb24gYmVmb3JlVXBkYXRlKGZuKSB7XG4gICAgZ2V0X2N1cnJlbnRfY29tcG9uZW50KCkuJCQuYmVmb3JlX3VwZGF0ZS5wdXNoKGZuKTtcbn1cbmZ1bmN0aW9uIG9uTW91bnQoZm4pIHtcbiAgICBnZXRfY3VycmVudF9jb21wb25lbnQoKS4kJC5vbl9tb3VudC5wdXNoKGZuKTtcbn1cbmZ1bmN0aW9uIGFmdGVyVXBkYXRlKGZuKSB7XG4gICAgZ2V0X2N1cnJlbnRfY29tcG9uZW50KCkuJCQuYWZ0ZXJfdXBkYXRlLnB1c2goZm4pO1xufVxuZnVuY3Rpb24gb25EZXN0cm95KGZuKSB7XG4gICAgZ2V0X2N1cnJlbnRfY29tcG9uZW50KCkuJCQub25fZGVzdHJveS5wdXNoKGZuKTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZUV2ZW50RGlzcGF0Y2hlcigpIHtcbiAgICBjb25zdCBjb21wb25lbnQgPSBnZXRfY3VycmVudF9jb21wb25lbnQoKTtcbiAgICByZXR1cm4gKHR5cGUsIGRldGFpbCkgPT4ge1xuICAgICAgICBjb25zdCBjYWxsYmFja3MgPSBjb21wb25lbnQuJCQuY2FsbGJhY2tzW3R5cGVdO1xuICAgICAgICBpZiAoY2FsbGJhY2tzKSB7XG4gICAgICAgICAgICAvLyBUT0RPIGFyZSB0aGVyZSBzaXR1YXRpb25zIHdoZXJlIGV2ZW50cyBjb3VsZCBiZSBkaXNwYXRjaGVkXG4gICAgICAgICAgICAvLyBpbiBhIHNlcnZlciAobm9uLURPTSkgZW52aXJvbm1lbnQ/XG4gICAgICAgICAgICBjb25zdCBldmVudCA9IGN1c3RvbV9ldmVudCh0eXBlLCBkZXRhaWwpO1xuICAgICAgICAgICAgY2FsbGJhY2tzLnNsaWNlKCkuZm9yRWFjaChmbiA9PiB7XG4gICAgICAgICAgICAgICAgZm4uY2FsbChjb21wb25lbnQsIGV2ZW50KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcbn1cbmZ1bmN0aW9uIHNldENvbnRleHQoa2V5LCBjb250ZXh0KSB7XG4gICAgZ2V0X2N1cnJlbnRfY29tcG9uZW50KCkuJCQuY29udGV4dC5zZXQoa2V5LCBjb250ZXh0KTtcbn1cbmZ1bmN0aW9uIGdldENvbnRleHQoa2V5KSB7XG4gICAgcmV0dXJuIGdldF9jdXJyZW50X2NvbXBvbmVudCgpLiQkLmNvbnRleHQuZ2V0KGtleSk7XG59XG5mdW5jdGlvbiBnZXRBbGxDb250ZXh0cygpIHtcbiAgICByZXR1cm4gZ2V0X2N1cnJlbnRfY29tcG9uZW50KCkuJCQuY29udGV4dDtcbn1cbmZ1bmN0aW9uIGhhc0NvbnRleHQoa2V5KSB7XG4gICAgcmV0dXJuIGdldF9jdXJyZW50X2NvbXBvbmVudCgpLiQkLmNvbnRleHQuaGFzKGtleSk7XG59XG4vLyBUT0RPIGZpZ3VyZSBvdXQgaWYgd2Ugc3RpbGwgd2FudCB0byBzdXBwb3J0XG4vLyBzaG9ydGhhbmQgZXZlbnRzLCBvciBpZiB3ZSB3YW50IHRvIGltcGxlbWVudFxuLy8gYSByZWFsIGJ1YmJsaW5nIG1lY2hhbmlzbVxuZnVuY3Rpb24gYnViYmxlKGNvbXBvbmVudCwgZXZlbnQpIHtcbiAgICBjb25zdCBjYWxsYmFja3MgPSBjb21wb25lbnQuJCQuY2FsbGJhY2tzW2V2ZW50LnR5cGVdO1xuICAgIGlmIChjYWxsYmFja3MpIHtcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICBjYWxsYmFja3Muc2xpY2UoKS5mb3JFYWNoKGZuID0+IGZuLmNhbGwodGhpcywgZXZlbnQpKTtcbiAgICB9XG59XG5cbmNvbnN0IGRpcnR5X2NvbXBvbmVudHMgPSBbXTtcbmNvbnN0IGludHJvcyA9IHsgZW5hYmxlZDogZmFsc2UgfTtcbmNvbnN0IGJpbmRpbmdfY2FsbGJhY2tzID0gW107XG5jb25zdCByZW5kZXJfY2FsbGJhY2tzID0gW107XG5jb25zdCBmbHVzaF9jYWxsYmFja3MgPSBbXTtcbmNvbnN0IHJlc29sdmVkX3Byb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbmxldCB1cGRhdGVfc2NoZWR1bGVkID0gZmFsc2U7XG5mdW5jdGlvbiBzY2hlZHVsZV91cGRhdGUoKSB7XG4gICAgaWYgKCF1cGRhdGVfc2NoZWR1bGVkKSB7XG4gICAgICAgIHVwZGF0ZV9zY2hlZHVsZWQgPSB0cnVlO1xuICAgICAgICByZXNvbHZlZF9wcm9taXNlLnRoZW4oZmx1c2gpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHRpY2soKSB7XG4gICAgc2NoZWR1bGVfdXBkYXRlKCk7XG4gICAgcmV0dXJuIHJlc29sdmVkX3Byb21pc2U7XG59XG5mdW5jdGlvbiBhZGRfcmVuZGVyX2NhbGxiYWNrKGZuKSB7XG4gICAgcmVuZGVyX2NhbGxiYWNrcy5wdXNoKGZuKTtcbn1cbmZ1bmN0aW9uIGFkZF9mbHVzaF9jYWxsYmFjayhmbikge1xuICAgIGZsdXNoX2NhbGxiYWNrcy5wdXNoKGZuKTtcbn1cbi8vIGZsdXNoKCkgY2FsbHMgY2FsbGJhY2tzIGluIHRoaXMgb3JkZXI6XG4vLyAxLiBBbGwgYmVmb3JlVXBkYXRlIGNhbGxiYWNrcywgaW4gb3JkZXI6IHBhcmVudHMgYmVmb3JlIGNoaWxkcmVuXG4vLyAyLiBBbGwgYmluZDp0aGlzIGNhbGxiYWNrcywgaW4gcmV2ZXJzZSBvcmRlcjogY2hpbGRyZW4gYmVmb3JlIHBhcmVudHMuXG4vLyAzLiBBbGwgYWZ0ZXJVcGRhdGUgY2FsbGJhY2tzLCBpbiBvcmRlcjogcGFyZW50cyBiZWZvcmUgY2hpbGRyZW4uIEVYQ0VQVFxuLy8gICAgZm9yIGFmdGVyVXBkYXRlcyBjYWxsZWQgZHVyaW5nIHRoZSBpbml0aWFsIG9uTW91bnQsIHdoaWNoIGFyZSBjYWxsZWQgaW5cbi8vICAgIHJldmVyc2Ugb3JkZXI6IGNoaWxkcmVuIGJlZm9yZSBwYXJlbnRzLlxuLy8gU2luY2UgY2FsbGJhY2tzIG1pZ2h0IHVwZGF0ZSBjb21wb25lbnQgdmFsdWVzLCB3aGljaCBjb3VsZCB0cmlnZ2VyIGFub3RoZXJcbi8vIGNhbGwgdG8gZmx1c2goKSwgdGhlIGZvbGxvd2luZyBzdGVwcyBndWFyZCBhZ2FpbnN0IHRoaXM6XG4vLyAxLiBEdXJpbmcgYmVmb3JlVXBkYXRlLCBhbnkgdXBkYXRlZCBjb21wb25lbnRzIHdpbGwgYmUgYWRkZWQgdG8gdGhlXG4vLyAgICBkaXJ0eV9jb21wb25lbnRzIGFycmF5IGFuZCB3aWxsIGNhdXNlIGEgcmVlbnRyYW50IGNhbGwgdG8gZmx1c2goKS4gQmVjYXVzZVxuLy8gICAgdGhlIGZsdXNoIGluZGV4IGlzIGtlcHQgb3V0c2lkZSB0aGUgZnVuY3Rpb24sIHRoZSByZWVudHJhbnQgY2FsbCB3aWxsIHBpY2tcbi8vICAgIHVwIHdoZXJlIHRoZSBlYXJsaWVyIGNhbGwgbGVmdCBvZmYgYW5kIGdvIHRocm91Z2ggYWxsIGRpcnR5IGNvbXBvbmVudHMuIFRoZVxuLy8gICAgY3VycmVudF9jb21wb25lbnQgdmFsdWUgaXMgc2F2ZWQgYW5kIHJlc3RvcmVkIHNvIHRoYXQgdGhlIHJlZW50cmFudCBjYWxsIHdpbGxcbi8vICAgIG5vdCBpbnRlcmZlcmUgd2l0aCB0aGUgXCJwYXJlbnRcIiBmbHVzaCgpIGNhbGwuXG4vLyAyLiBiaW5kOnRoaXMgY2FsbGJhY2tzIGNhbm5vdCB0cmlnZ2VyIG5ldyBmbHVzaCgpIGNhbGxzLlxuLy8gMy4gRHVyaW5nIGFmdGVyVXBkYXRlLCBhbnkgdXBkYXRlZCBjb21wb25lbnRzIHdpbGwgTk9UIGhhdmUgdGhlaXIgYWZ0ZXJVcGRhdGVcbi8vICAgIGNhbGxiYWNrIGNhbGxlZCBhIHNlY29uZCB0aW1lOyB0aGUgc2Vlbl9jYWxsYmFja3Mgc2V0LCBvdXRzaWRlIHRoZSBmbHVzaCgpXG4vLyAgICBmdW5jdGlvbiwgZ3VhcmFudGVlcyB0aGlzIGJlaGF2aW9yLlxuY29uc3Qgc2Vlbl9jYWxsYmFja3MgPSBuZXcgU2V0KCk7XG5sZXQgZmx1c2hpZHggPSAwOyAvLyBEbyAqbm90KiBtb3ZlIHRoaXMgaW5zaWRlIHRoZSBmbHVzaCgpIGZ1bmN0aW9uXG5mdW5jdGlvbiBmbHVzaCgpIHtcbiAgICBjb25zdCBzYXZlZF9jb21wb25lbnQgPSBjdXJyZW50X2NvbXBvbmVudDtcbiAgICBkbyB7XG4gICAgICAgIC8vIGZpcnN0LCBjYWxsIGJlZm9yZVVwZGF0ZSBmdW5jdGlvbnNcbiAgICAgICAgLy8gYW5kIHVwZGF0ZSBjb21wb25lbnRzXG4gICAgICAgIHdoaWxlIChmbHVzaGlkeCA8IGRpcnR5X2NvbXBvbmVudHMubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb25zdCBjb21wb25lbnQgPSBkaXJ0eV9jb21wb25lbnRzW2ZsdXNoaWR4XTtcbiAgICAgICAgICAgIGZsdXNoaWR4Kys7XG4gICAgICAgICAgICBzZXRfY3VycmVudF9jb21wb25lbnQoY29tcG9uZW50KTtcbiAgICAgICAgICAgIHVwZGF0ZShjb21wb25lbnQuJCQpO1xuICAgICAgICB9XG4gICAgICAgIHNldF9jdXJyZW50X2NvbXBvbmVudChudWxsKTtcbiAgICAgICAgZGlydHlfY29tcG9uZW50cy5sZW5ndGggPSAwO1xuICAgICAgICBmbHVzaGlkeCA9IDA7XG4gICAgICAgIHdoaWxlIChiaW5kaW5nX2NhbGxiYWNrcy5sZW5ndGgpXG4gICAgICAgICAgICBiaW5kaW5nX2NhbGxiYWNrcy5wb3AoKSgpO1xuICAgICAgICAvLyB0aGVuLCBvbmNlIGNvbXBvbmVudHMgYXJlIHVwZGF0ZWQsIGNhbGxcbiAgICAgICAgLy8gYWZ0ZXJVcGRhdGUgZnVuY3Rpb25zLiBUaGlzIG1heSBjYXVzZVxuICAgICAgICAvLyBzdWJzZXF1ZW50IHVwZGF0ZXMuLi5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByZW5kZXJfY2FsbGJhY2tzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICBjb25zdCBjYWxsYmFjayA9IHJlbmRlcl9jYWxsYmFja3NbaV07XG4gICAgICAgICAgICBpZiAoIXNlZW5fY2FsbGJhY2tzLmhhcyhjYWxsYmFjaykpIHtcbiAgICAgICAgICAgICAgICAvLyAuLi5zbyBndWFyZCBhZ2FpbnN0IGluZmluaXRlIGxvb3BzXG4gICAgICAgICAgICAgICAgc2Vlbl9jYWxsYmFja3MuYWRkKGNhbGxiYWNrKTtcbiAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJlbmRlcl9jYWxsYmFja3MubGVuZ3RoID0gMDtcbiAgICB9IHdoaWxlIChkaXJ0eV9jb21wb25lbnRzLmxlbmd0aCk7XG4gICAgd2hpbGUgKGZsdXNoX2NhbGxiYWNrcy5sZW5ndGgpIHtcbiAgICAgICAgZmx1c2hfY2FsbGJhY2tzLnBvcCgpKCk7XG4gICAgfVxuICAgIHVwZGF0ZV9zY2hlZHVsZWQgPSBmYWxzZTtcbiAgICBzZWVuX2NhbGxiYWNrcy5jbGVhcigpO1xuICAgIHNldF9jdXJyZW50X2NvbXBvbmVudChzYXZlZF9jb21wb25lbnQpO1xufVxuZnVuY3Rpb24gdXBkYXRlKCQkKSB7XG4gICAgaWYgKCQkLmZyYWdtZW50ICE9PSBudWxsKSB7XG4gICAgICAgICQkLnVwZGF0ZSgpO1xuICAgICAgICBydW5fYWxsKCQkLmJlZm9yZV91cGRhdGUpO1xuICAgICAgICBjb25zdCBkaXJ0eSA9ICQkLmRpcnR5O1xuICAgICAgICAkJC5kaXJ0eSA9IFstMV07XG4gICAgICAgICQkLmZyYWdtZW50ICYmICQkLmZyYWdtZW50LnAoJCQuY3R4LCBkaXJ0eSk7XG4gICAgICAgICQkLmFmdGVyX3VwZGF0ZS5mb3JFYWNoKGFkZF9yZW5kZXJfY2FsbGJhY2spO1xuICAgIH1cbn1cblxubGV0IHByb21pc2U7XG5mdW5jdGlvbiB3YWl0KCkge1xuICAgIGlmICghcHJvbWlzZSkge1xuICAgICAgICBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgIHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBwcm9taXNlID0gbnVsbDtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBwcm9taXNlO1xufVxuZnVuY3Rpb24gZGlzcGF0Y2gobm9kZSwgZGlyZWN0aW9uLCBraW5kKSB7XG4gICAgbm9kZS5kaXNwYXRjaEV2ZW50KGN1c3RvbV9ldmVudChgJHtkaXJlY3Rpb24gPyAnaW50cm8nIDogJ291dHJvJ30ke2tpbmR9YCkpO1xufVxuY29uc3Qgb3V0cm9pbmcgPSBuZXcgU2V0KCk7XG5sZXQgb3V0cm9zO1xuZnVuY3Rpb24gZ3JvdXBfb3V0cm9zKCkge1xuICAgIG91dHJvcyA9IHtcbiAgICAgICAgcjogMCxcbiAgICAgICAgYzogW10sXG4gICAgICAgIHA6IG91dHJvcyAvLyBwYXJlbnQgZ3JvdXBcbiAgICB9O1xufVxuZnVuY3Rpb24gY2hlY2tfb3V0cm9zKCkge1xuICAgIGlmICghb3V0cm9zLnIpIHtcbiAgICAgICAgcnVuX2FsbChvdXRyb3MuYyk7XG4gICAgfVxuICAgIG91dHJvcyA9IG91dHJvcy5wO1xufVxuZnVuY3Rpb24gdHJhbnNpdGlvbl9pbihibG9jaywgbG9jYWwpIHtcbiAgICBpZiAoYmxvY2sgJiYgYmxvY2suaSkge1xuICAgICAgICBvdXRyb2luZy5kZWxldGUoYmxvY2spO1xuICAgICAgICBibG9jay5pKGxvY2FsKTtcbiAgICB9XG59XG5mdW5jdGlvbiB0cmFuc2l0aW9uX291dChibG9jaywgbG9jYWwsIGRldGFjaCwgY2FsbGJhY2spIHtcbiAgICBpZiAoYmxvY2sgJiYgYmxvY2subykge1xuICAgICAgICBpZiAob3V0cm9pbmcuaGFzKGJsb2NrKSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgb3V0cm9pbmcuYWRkKGJsb2NrKTtcbiAgICAgICAgb3V0cm9zLmMucHVzaCgoKSA9PiB7XG4gICAgICAgICAgICBvdXRyb2luZy5kZWxldGUoYmxvY2spO1xuICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRldGFjaClcbiAgICAgICAgICAgICAgICAgICAgYmxvY2suZCgxKTtcbiAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgYmxvY2subyhsb2NhbCk7XG4gICAgfVxufVxuY29uc3QgbnVsbF90cmFuc2l0aW9uID0geyBkdXJhdGlvbjogMCB9O1xuZnVuY3Rpb24gY3JlYXRlX2luX3RyYW5zaXRpb24obm9kZSwgZm4sIHBhcmFtcykge1xuICAgIGxldCBjb25maWcgPSBmbihub2RlLCBwYXJhbXMpO1xuICAgIGxldCBydW5uaW5nID0gZmFsc2U7XG4gICAgbGV0IGFuaW1hdGlvbl9uYW1lO1xuICAgIGxldCB0YXNrO1xuICAgIGxldCB1aWQgPSAwO1xuICAgIGZ1bmN0aW9uIGNsZWFudXAoKSB7XG4gICAgICAgIGlmIChhbmltYXRpb25fbmFtZSlcbiAgICAgICAgICAgIGRlbGV0ZV9ydWxlKG5vZGUsIGFuaW1hdGlvbl9uYW1lKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZ28oKSB7XG4gICAgICAgIGNvbnN0IHsgZGVsYXkgPSAwLCBkdXJhdGlvbiA9IDMwMCwgZWFzaW5nID0gaWRlbnRpdHksIHRpY2sgPSBub29wLCBjc3MgfSA9IGNvbmZpZyB8fCBudWxsX3RyYW5zaXRpb247XG4gICAgICAgIGlmIChjc3MpXG4gICAgICAgICAgICBhbmltYXRpb25fbmFtZSA9IGNyZWF0ZV9ydWxlKG5vZGUsIDAsIDEsIGR1cmF0aW9uLCBkZWxheSwgZWFzaW5nLCBjc3MsIHVpZCsrKTtcbiAgICAgICAgdGljaygwLCAxKTtcbiAgICAgICAgY29uc3Qgc3RhcnRfdGltZSA9IG5vdygpICsgZGVsYXk7XG4gICAgICAgIGNvbnN0IGVuZF90aW1lID0gc3RhcnRfdGltZSArIGR1cmF0aW9uO1xuICAgICAgICBpZiAodGFzaylcbiAgICAgICAgICAgIHRhc2suYWJvcnQoKTtcbiAgICAgICAgcnVubmluZyA9IHRydWU7XG4gICAgICAgIGFkZF9yZW5kZXJfY2FsbGJhY2soKCkgPT4gZGlzcGF0Y2gobm9kZSwgdHJ1ZSwgJ3N0YXJ0JykpO1xuICAgICAgICB0YXNrID0gbG9vcChub3cgPT4ge1xuICAgICAgICAgICAgaWYgKHJ1bm5pbmcpIHtcbiAgICAgICAgICAgICAgICBpZiAobm93ID49IGVuZF90aW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIHRpY2soMSwgMCk7XG4gICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoKG5vZGUsIHRydWUsICdlbmQnKTtcbiAgICAgICAgICAgICAgICAgICAgY2xlYW51cCgpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcnVubmluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAobm93ID49IHN0YXJ0X3RpbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdCA9IGVhc2luZygobm93IC0gc3RhcnRfdGltZSkgLyBkdXJhdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIHRpY2sodCwgMSAtIHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBydW5uaW5nO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgbGV0IHN0YXJ0ZWQgPSBmYWxzZTtcbiAgICByZXR1cm4ge1xuICAgICAgICBzdGFydCgpIHtcbiAgICAgICAgICAgIGlmIChzdGFydGVkKVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIHN0YXJ0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgZGVsZXRlX3J1bGUobm9kZSk7XG4gICAgICAgICAgICBpZiAoaXNfZnVuY3Rpb24oY29uZmlnKSkge1xuICAgICAgICAgICAgICAgIGNvbmZpZyA9IGNvbmZpZygpO1xuICAgICAgICAgICAgICAgIHdhaXQoKS50aGVuKGdvKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGdvKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGludmFsaWRhdGUoKSB7XG4gICAgICAgICAgICBzdGFydGVkID0gZmFsc2U7XG4gICAgICAgIH0sXG4gICAgICAgIGVuZCgpIHtcbiAgICAgICAgICAgIGlmIChydW5uaW5nKSB7XG4gICAgICAgICAgICAgICAgY2xlYW51cCgpO1xuICAgICAgICAgICAgICAgIHJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG59XG5mdW5jdGlvbiBjcmVhdGVfb3V0X3RyYW5zaXRpb24obm9kZSwgZm4sIHBhcmFtcykge1xuICAgIGxldCBjb25maWcgPSBmbihub2RlLCBwYXJhbXMpO1xuICAgIGxldCBydW5uaW5nID0gdHJ1ZTtcbiAgICBsZXQgYW5pbWF0aW9uX25hbWU7XG4gICAgY29uc3QgZ3JvdXAgPSBvdXRyb3M7XG4gICAgZ3JvdXAuciArPSAxO1xuICAgIGZ1bmN0aW9uIGdvKCkge1xuICAgICAgICBjb25zdCB7IGRlbGF5ID0gMCwgZHVyYXRpb24gPSAzMDAsIGVhc2luZyA9IGlkZW50aXR5LCB0aWNrID0gbm9vcCwgY3NzIH0gPSBjb25maWcgfHwgbnVsbF90cmFuc2l0aW9uO1xuICAgICAgICBpZiAoY3NzKVxuICAgICAgICAgICAgYW5pbWF0aW9uX25hbWUgPSBjcmVhdGVfcnVsZShub2RlLCAxLCAwLCBkdXJhdGlvbiwgZGVsYXksIGVhc2luZywgY3NzKTtcbiAgICAgICAgY29uc3Qgc3RhcnRfdGltZSA9IG5vdygpICsgZGVsYXk7XG4gICAgICAgIGNvbnN0IGVuZF90aW1lID0gc3RhcnRfdGltZSArIGR1cmF0aW9uO1xuICAgICAgICBhZGRfcmVuZGVyX2NhbGxiYWNrKCgpID0+IGRpc3BhdGNoKG5vZGUsIGZhbHNlLCAnc3RhcnQnKSk7XG4gICAgICAgIGxvb3Aobm93ID0+IHtcbiAgICAgICAgICAgIGlmIChydW5uaW5nKSB7XG4gICAgICAgICAgICAgICAgaWYgKG5vdyA+PSBlbmRfdGltZSkge1xuICAgICAgICAgICAgICAgICAgICB0aWNrKDAsIDEpO1xuICAgICAgICAgICAgICAgICAgICBkaXNwYXRjaChub2RlLCBmYWxzZSwgJ2VuZCcpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIS0tZ3JvdXAucikge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhpcyB3aWxsIHJlc3VsdCBpbiBgZW5kKClgIGJlaW5nIGNhbGxlZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNvIHdlIGRvbid0IG5lZWQgdG8gY2xlYW4gdXAgaGVyZVxuICAgICAgICAgICAgICAgICAgICAgICAgcnVuX2FsbChncm91cC5jKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChub3cgPj0gc3RhcnRfdGltZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0ID0gZWFzaW5nKChub3cgLSBzdGFydF90aW1lKSAvIGR1cmF0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgdGljaygxIC0gdCwgdCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJ1bm5pbmc7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoaXNfZnVuY3Rpb24oY29uZmlnKSkge1xuICAgICAgICB3YWl0KCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICBjb25maWcgPSBjb25maWcoKTtcbiAgICAgICAgICAgIGdvKCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgZ28oKTtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgICAgZW5kKHJlc2V0KSB7XG4gICAgICAgICAgICBpZiAocmVzZXQgJiYgY29uZmlnLnRpY2spIHtcbiAgICAgICAgICAgICAgICBjb25maWcudGljaygxLCAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChydW5uaW5nKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFuaW1hdGlvbl9uYW1lKVxuICAgICAgICAgICAgICAgICAgICBkZWxldGVfcnVsZShub2RlLCBhbmltYXRpb25fbmFtZSk7XG4gICAgICAgICAgICAgICAgcnVubmluZyA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZV9iaWRpcmVjdGlvbmFsX3RyYW5zaXRpb24obm9kZSwgZm4sIHBhcmFtcywgaW50cm8pIHtcbiAgICBsZXQgY29uZmlnID0gZm4obm9kZSwgcGFyYW1zKTtcbiAgICBsZXQgdCA9IGludHJvID8gMCA6IDE7XG4gICAgbGV0IHJ1bm5pbmdfcHJvZ3JhbSA9IG51bGw7XG4gICAgbGV0IHBlbmRpbmdfcHJvZ3JhbSA9IG51bGw7XG4gICAgbGV0IGFuaW1hdGlvbl9uYW1lID0gbnVsbDtcbiAgICBmdW5jdGlvbiBjbGVhcl9hbmltYXRpb24oKSB7XG4gICAgICAgIGlmIChhbmltYXRpb25fbmFtZSlcbiAgICAgICAgICAgIGRlbGV0ZV9ydWxlKG5vZGUsIGFuaW1hdGlvbl9uYW1lKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gaW5pdChwcm9ncmFtLCBkdXJhdGlvbikge1xuICAgICAgICBjb25zdCBkID0gKHByb2dyYW0uYiAtIHQpO1xuICAgICAgICBkdXJhdGlvbiAqPSBNYXRoLmFicyhkKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGE6IHQsXG4gICAgICAgICAgICBiOiBwcm9ncmFtLmIsXG4gICAgICAgICAgICBkLFxuICAgICAgICAgICAgZHVyYXRpb24sXG4gICAgICAgICAgICBzdGFydDogcHJvZ3JhbS5zdGFydCxcbiAgICAgICAgICAgIGVuZDogcHJvZ3JhbS5zdGFydCArIGR1cmF0aW9uLFxuICAgICAgICAgICAgZ3JvdXA6IHByb2dyYW0uZ3JvdXBcbiAgICAgICAgfTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZ28oYikge1xuICAgICAgICBjb25zdCB7IGRlbGF5ID0gMCwgZHVyYXRpb24gPSAzMDAsIGVhc2luZyA9IGlkZW50aXR5LCB0aWNrID0gbm9vcCwgY3NzIH0gPSBjb25maWcgfHwgbnVsbF90cmFuc2l0aW9uO1xuICAgICAgICBjb25zdCBwcm9ncmFtID0ge1xuICAgICAgICAgICAgc3RhcnQ6IG5vdygpICsgZGVsYXksXG4gICAgICAgICAgICBiXG4gICAgICAgIH07XG4gICAgICAgIGlmICghYikge1xuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZSB0b2RvOiBpbXByb3ZlIHR5cGluZ3NcbiAgICAgICAgICAgIHByb2dyYW0uZ3JvdXAgPSBvdXRyb3M7XG4gICAgICAgICAgICBvdXRyb3MuciArPSAxO1xuICAgICAgICB9XG4gICAgICAgIGlmIChydW5uaW5nX3Byb2dyYW0gfHwgcGVuZGluZ19wcm9ncmFtKSB7XG4gICAgICAgICAgICBwZW5kaW5nX3Byb2dyYW0gPSBwcm9ncmFtO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gaWYgdGhpcyBpcyBhbiBpbnRybywgYW5kIHRoZXJlJ3MgYSBkZWxheSwgd2UgbmVlZCB0byBkb1xuICAgICAgICAgICAgLy8gYW4gaW5pdGlhbCB0aWNrIGFuZC9vciBhcHBseSBDU1MgYW5pbWF0aW9uIGltbWVkaWF0ZWx5XG4gICAgICAgICAgICBpZiAoY3NzKSB7XG4gICAgICAgICAgICAgICAgY2xlYXJfYW5pbWF0aW9uKCk7XG4gICAgICAgICAgICAgICAgYW5pbWF0aW9uX25hbWUgPSBjcmVhdGVfcnVsZShub2RlLCB0LCBiLCBkdXJhdGlvbiwgZGVsYXksIGVhc2luZywgY3NzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChiKVxuICAgICAgICAgICAgICAgIHRpY2soMCwgMSk7XG4gICAgICAgICAgICBydW5uaW5nX3Byb2dyYW0gPSBpbml0KHByb2dyYW0sIGR1cmF0aW9uKTtcbiAgICAgICAgICAgIGFkZF9yZW5kZXJfY2FsbGJhY2soKCkgPT4gZGlzcGF0Y2gobm9kZSwgYiwgJ3N0YXJ0JykpO1xuICAgICAgICAgICAgbG9vcChub3cgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChwZW5kaW5nX3Byb2dyYW0gJiYgbm93ID4gcGVuZGluZ19wcm9ncmFtLnN0YXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgIHJ1bm5pbmdfcHJvZ3JhbSA9IGluaXQocGVuZGluZ19wcm9ncmFtLCBkdXJhdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIHBlbmRpbmdfcHJvZ3JhbSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoKG5vZGUsIHJ1bm5pbmdfcHJvZ3JhbS5iLCAnc3RhcnQnKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNzcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJfYW5pbWF0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBhbmltYXRpb25fbmFtZSA9IGNyZWF0ZV9ydWxlKG5vZGUsIHQsIHJ1bm5pbmdfcHJvZ3JhbS5iLCBydW5uaW5nX3Byb2dyYW0uZHVyYXRpb24sIDAsIGVhc2luZywgY29uZmlnLmNzcyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHJ1bm5pbmdfcHJvZ3JhbSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAobm93ID49IHJ1bm5pbmdfcHJvZ3JhbS5lbmQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpY2sodCA9IHJ1bm5pbmdfcHJvZ3JhbS5iLCAxIC0gdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwYXRjaChub2RlLCBydW5uaW5nX3Byb2dyYW0uYiwgJ2VuZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFwZW5kaW5nX3Byb2dyYW0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB3ZSdyZSBkb25lXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJ1bm5pbmdfcHJvZ3JhbS5iKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGludHJvIOKAlCB3ZSBjYW4gdGlkeSB1cCBpbW1lZGlhdGVseVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGVhcl9hbmltYXRpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIG91dHJvIOKAlCBuZWVkcyB0byBiZSBjb29yZGluYXRlZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIS0tcnVubmluZ19wcm9ncmFtLmdyb3VwLnIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBydW5fYWxsKHJ1bm5pbmdfcHJvZ3JhbS5ncm91cC5jKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBydW5uaW5nX3Byb2dyYW0gPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKG5vdyA+PSBydW5uaW5nX3Byb2dyYW0uc3RhcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHAgPSBub3cgLSBydW5uaW5nX3Byb2dyYW0uc3RhcnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ID0gcnVubmluZ19wcm9ncmFtLmEgKyBydW5uaW5nX3Byb2dyYW0uZCAqIGVhc2luZyhwIC8gcnVubmluZ19wcm9ncmFtLmR1cmF0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpY2sodCwgMSAtIHQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiAhIShydW5uaW5nX3Byb2dyYW0gfHwgcGVuZGluZ19wcm9ncmFtKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgIHJ1bihiKSB7XG4gICAgICAgICAgICBpZiAoaXNfZnVuY3Rpb24oY29uZmlnKSkge1xuICAgICAgICAgICAgICAgIHdhaXQoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgICAgICAgICBjb25maWcgPSBjb25maWcoKTtcbiAgICAgICAgICAgICAgICAgICAgZ28oYik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBnbyhiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZW5kKCkge1xuICAgICAgICAgICAgY2xlYXJfYW5pbWF0aW9uKCk7XG4gICAgICAgICAgICBydW5uaW5nX3Byb2dyYW0gPSBwZW5kaW5nX3Byb2dyYW0gPSBudWxsO1xuICAgICAgICB9XG4gICAgfTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlX3Byb21pc2UocHJvbWlzZSwgaW5mbykge1xuICAgIGNvbnN0IHRva2VuID0gaW5mby50b2tlbiA9IHt9O1xuICAgIGZ1bmN0aW9uIHVwZGF0ZSh0eXBlLCBpbmRleCwga2V5LCB2YWx1ZSkge1xuICAgICAgICBpZiAoaW5mby50b2tlbiAhPT0gdG9rZW4pXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIGluZm8ucmVzb2x2ZWQgPSB2YWx1ZTtcbiAgICAgICAgbGV0IGNoaWxkX2N0eCA9IGluZm8uY3R4O1xuICAgICAgICBpZiAoa2V5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNoaWxkX2N0eCA9IGNoaWxkX2N0eC5zbGljZSgpO1xuICAgICAgICAgICAgY2hpbGRfY3R4W2tleV0gPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBibG9jayA9IHR5cGUgJiYgKGluZm8uY3VycmVudCA9IHR5cGUpKGNoaWxkX2N0eCk7XG4gICAgICAgIGxldCBuZWVkc19mbHVzaCA9IGZhbHNlO1xuICAgICAgICBpZiAoaW5mby5ibG9jaykge1xuICAgICAgICAgICAgaWYgKGluZm8uYmxvY2tzKSB7XG4gICAgICAgICAgICAgICAgaW5mby5ibG9ja3MuZm9yRWFjaCgoYmxvY2ssIGkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGkgIT09IGluZGV4ICYmIGJsb2NrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBncm91cF9vdXRyb3MoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb25fb3V0KGJsb2NrLCAxLCAxLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluZm8uYmxvY2tzW2ldID09PSBibG9jaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmZvLmJsb2Nrc1tpXSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGVja19vdXRyb3MoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaW5mby5ibG9jay5kKDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYmxvY2suYygpO1xuICAgICAgICAgICAgdHJhbnNpdGlvbl9pbihibG9jaywgMSk7XG4gICAgICAgICAgICBibG9jay5tKGluZm8ubW91bnQoKSwgaW5mby5hbmNob3IpO1xuICAgICAgICAgICAgbmVlZHNfZmx1c2ggPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGluZm8uYmxvY2sgPSBibG9jaztcbiAgICAgICAgaWYgKGluZm8uYmxvY2tzKVxuICAgICAgICAgICAgaW5mby5ibG9ja3NbaW5kZXhdID0gYmxvY2s7XG4gICAgICAgIGlmIChuZWVkc19mbHVzaCkge1xuICAgICAgICAgICAgZmx1c2goKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAoaXNfcHJvbWlzZShwcm9taXNlKSkge1xuICAgICAgICBjb25zdCBjdXJyZW50X2NvbXBvbmVudCA9IGdldF9jdXJyZW50X2NvbXBvbmVudCgpO1xuICAgICAgICBwcm9taXNlLnRoZW4odmFsdWUgPT4ge1xuICAgICAgICAgICAgc2V0X2N1cnJlbnRfY29tcG9uZW50KGN1cnJlbnRfY29tcG9uZW50KTtcbiAgICAgICAgICAgIHVwZGF0ZShpbmZvLnRoZW4sIDEsIGluZm8udmFsdWUsIHZhbHVlKTtcbiAgICAgICAgICAgIHNldF9jdXJyZW50X2NvbXBvbmVudChudWxsKTtcbiAgICAgICAgfSwgZXJyb3IgPT4ge1xuICAgICAgICAgICAgc2V0X2N1cnJlbnRfY29tcG9uZW50KGN1cnJlbnRfY29tcG9uZW50KTtcbiAgICAgICAgICAgIHVwZGF0ZShpbmZvLmNhdGNoLCAyLCBpbmZvLmVycm9yLCBlcnJvcik7XG4gICAgICAgICAgICBzZXRfY3VycmVudF9jb21wb25lbnQobnVsbCk7XG4gICAgICAgICAgICBpZiAoIWluZm8uaGFzQ2F0Y2gpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIC8vIGlmIHdlIHByZXZpb3VzbHkgaGFkIGEgdGhlbi9jYXRjaCBibG9jaywgZGVzdHJveSBpdFxuICAgICAgICBpZiAoaW5mby5jdXJyZW50ICE9PSBpbmZvLnBlbmRpbmcpIHtcbiAgICAgICAgICAgIHVwZGF0ZShpbmZvLnBlbmRpbmcsIDApO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGlmIChpbmZvLmN1cnJlbnQgIT09IGluZm8udGhlbikge1xuICAgICAgICAgICAgdXBkYXRlKGluZm8udGhlbiwgMSwgaW5mby52YWx1ZSwgcHJvbWlzZSk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpbmZvLnJlc29sdmVkID0gcHJvbWlzZTtcbiAgICB9XG59XG5mdW5jdGlvbiB1cGRhdGVfYXdhaXRfYmxvY2tfYnJhbmNoKGluZm8sIGN0eCwgZGlydHkpIHtcbiAgICBjb25zdCBjaGlsZF9jdHggPSBjdHguc2xpY2UoKTtcbiAgICBjb25zdCB7IHJlc29sdmVkIH0gPSBpbmZvO1xuICAgIGlmIChpbmZvLmN1cnJlbnQgPT09IGluZm8udGhlbikge1xuICAgICAgICBjaGlsZF9jdHhbaW5mby52YWx1ZV0gPSByZXNvbHZlZDtcbiAgICB9XG4gICAgaWYgKGluZm8uY3VycmVudCA9PT0gaW5mby5jYXRjaCkge1xuICAgICAgICBjaGlsZF9jdHhbaW5mby5lcnJvcl0gPSByZXNvbHZlZDtcbiAgICB9XG4gICAgaW5mby5ibG9jay5wKGNoaWxkX2N0eCwgZGlydHkpO1xufVxuXG5jb25zdCBnbG9iYWxzID0gKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXG4gICAgPyB3aW5kb3dcbiAgICA6IHR5cGVvZiBnbG9iYWxUaGlzICE9PSAndW5kZWZpbmVkJ1xuICAgICAgICA/IGdsb2JhbFRoaXNcbiAgICAgICAgOiBnbG9iYWwpO1xuXG5mdW5jdGlvbiBkZXN0cm95X2Jsb2NrKGJsb2NrLCBsb29rdXApIHtcbiAgICBibG9jay5kKDEpO1xuICAgIGxvb2t1cC5kZWxldGUoYmxvY2sua2V5KTtcbn1cbmZ1bmN0aW9uIG91dHJvX2FuZF9kZXN0cm95X2Jsb2NrKGJsb2NrLCBsb29rdXApIHtcbiAgICB0cmFuc2l0aW9uX291dChibG9jaywgMSwgMSwgKCkgPT4ge1xuICAgICAgICBsb29rdXAuZGVsZXRlKGJsb2NrLmtleSk7XG4gICAgfSk7XG59XG5mdW5jdGlvbiBmaXhfYW5kX2Rlc3Ryb3lfYmxvY2soYmxvY2ssIGxvb2t1cCkge1xuICAgIGJsb2NrLmYoKTtcbiAgICBkZXN0cm95X2Jsb2NrKGJsb2NrLCBsb29rdXApO1xufVxuZnVuY3Rpb24gZml4X2FuZF9vdXRyb19hbmRfZGVzdHJveV9ibG9jayhibG9jaywgbG9va3VwKSB7XG4gICAgYmxvY2suZigpO1xuICAgIG91dHJvX2FuZF9kZXN0cm95X2Jsb2NrKGJsb2NrLCBsb29rdXApO1xufVxuZnVuY3Rpb24gdXBkYXRlX2tleWVkX2VhY2gob2xkX2Jsb2NrcywgZGlydHksIGdldF9rZXksIGR5bmFtaWMsIGN0eCwgbGlzdCwgbG9va3VwLCBub2RlLCBkZXN0cm95LCBjcmVhdGVfZWFjaF9ibG9jaywgbmV4dCwgZ2V0X2NvbnRleHQpIHtcbiAgICBsZXQgbyA9IG9sZF9ibG9ja3MubGVuZ3RoO1xuICAgIGxldCBuID0gbGlzdC5sZW5ndGg7XG4gICAgbGV0IGkgPSBvO1xuICAgIGNvbnN0IG9sZF9pbmRleGVzID0ge307XG4gICAgd2hpbGUgKGktLSlcbiAgICAgICAgb2xkX2luZGV4ZXNbb2xkX2Jsb2Nrc1tpXS5rZXldID0gaTtcbiAgICBjb25zdCBuZXdfYmxvY2tzID0gW107XG4gICAgY29uc3QgbmV3X2xvb2t1cCA9IG5ldyBNYXAoKTtcbiAgICBjb25zdCBkZWx0YXMgPSBuZXcgTWFwKCk7XG4gICAgaSA9IG47XG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgICBjb25zdCBjaGlsZF9jdHggPSBnZXRfY29udGV4dChjdHgsIGxpc3QsIGkpO1xuICAgICAgICBjb25zdCBrZXkgPSBnZXRfa2V5KGNoaWxkX2N0eCk7XG4gICAgICAgIGxldCBibG9jayA9IGxvb2t1cC5nZXQoa2V5KTtcbiAgICAgICAgaWYgKCFibG9jaykge1xuICAgICAgICAgICAgYmxvY2sgPSBjcmVhdGVfZWFjaF9ibG9jayhrZXksIGNoaWxkX2N0eCk7XG4gICAgICAgICAgICBibG9jay5jKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZHluYW1pYykge1xuICAgICAgICAgICAgYmxvY2sucChjaGlsZF9jdHgsIGRpcnR5KTtcbiAgICAgICAgfVxuICAgICAgICBuZXdfbG9va3VwLnNldChrZXksIG5ld19ibG9ja3NbaV0gPSBibG9jayk7XG4gICAgICAgIGlmIChrZXkgaW4gb2xkX2luZGV4ZXMpXG4gICAgICAgICAgICBkZWx0YXMuc2V0KGtleSwgTWF0aC5hYnMoaSAtIG9sZF9pbmRleGVzW2tleV0pKTtcbiAgICB9XG4gICAgY29uc3Qgd2lsbF9tb3ZlID0gbmV3IFNldCgpO1xuICAgIGNvbnN0IGRpZF9tb3ZlID0gbmV3IFNldCgpO1xuICAgIGZ1bmN0aW9uIGluc2VydChibG9jaykge1xuICAgICAgICB0cmFuc2l0aW9uX2luKGJsb2NrLCAxKTtcbiAgICAgICAgYmxvY2subShub2RlLCBuZXh0KTtcbiAgICAgICAgbG9va3VwLnNldChibG9jay5rZXksIGJsb2NrKTtcbiAgICAgICAgbmV4dCA9IGJsb2NrLmZpcnN0O1xuICAgICAgICBuLS07XG4gICAgfVxuICAgIHdoaWxlIChvICYmIG4pIHtcbiAgICAgICAgY29uc3QgbmV3X2Jsb2NrID0gbmV3X2Jsb2Nrc1tuIC0gMV07XG4gICAgICAgIGNvbnN0IG9sZF9ibG9jayA9IG9sZF9ibG9ja3NbbyAtIDFdO1xuICAgICAgICBjb25zdCBuZXdfa2V5ID0gbmV3X2Jsb2NrLmtleTtcbiAgICAgICAgY29uc3Qgb2xkX2tleSA9IG9sZF9ibG9jay5rZXk7XG4gICAgICAgIGlmIChuZXdfYmxvY2sgPT09IG9sZF9ibG9jaykge1xuICAgICAgICAgICAgLy8gZG8gbm90aGluZ1xuICAgICAgICAgICAgbmV4dCA9IG5ld19ibG9jay5maXJzdDtcbiAgICAgICAgICAgIG8tLTtcbiAgICAgICAgICAgIG4tLTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICghbmV3X2xvb2t1cC5oYXMob2xkX2tleSkpIHtcbiAgICAgICAgICAgIC8vIHJlbW92ZSBvbGQgYmxvY2tcbiAgICAgICAgICAgIGRlc3Ryb3kob2xkX2Jsb2NrLCBsb29rdXApO1xuICAgICAgICAgICAgby0tO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKCFsb29rdXAuaGFzKG5ld19rZXkpIHx8IHdpbGxfbW92ZS5oYXMobmV3X2tleSkpIHtcbiAgICAgICAgICAgIGluc2VydChuZXdfYmxvY2spO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGRpZF9tb3ZlLmhhcyhvbGRfa2V5KSkge1xuICAgICAgICAgICAgby0tO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGRlbHRhcy5nZXQobmV3X2tleSkgPiBkZWx0YXMuZ2V0KG9sZF9rZXkpKSB7XG4gICAgICAgICAgICBkaWRfbW92ZS5hZGQobmV3X2tleSk7XG4gICAgICAgICAgICBpbnNlcnQobmV3X2Jsb2NrKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHdpbGxfbW92ZS5hZGQob2xkX2tleSk7XG4gICAgICAgICAgICBvLS07XG4gICAgICAgIH1cbiAgICB9XG4gICAgd2hpbGUgKG8tLSkge1xuICAgICAgICBjb25zdCBvbGRfYmxvY2sgPSBvbGRfYmxvY2tzW29dO1xuICAgICAgICBpZiAoIW5ld19sb29rdXAuaGFzKG9sZF9ibG9jay5rZXkpKVxuICAgICAgICAgICAgZGVzdHJveShvbGRfYmxvY2ssIGxvb2t1cCk7XG4gICAgfVxuICAgIHdoaWxlIChuKVxuICAgICAgICBpbnNlcnQobmV3X2Jsb2Nrc1tuIC0gMV0pO1xuICAgIHJldHVybiBuZXdfYmxvY2tzO1xufVxuZnVuY3Rpb24gdmFsaWRhdGVfZWFjaF9rZXlzKGN0eCwgbGlzdCwgZ2V0X2NvbnRleHQsIGdldF9rZXkpIHtcbiAgICBjb25zdCBrZXlzID0gbmV3IFNldCgpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBrZXkgPSBnZXRfa2V5KGdldF9jb250ZXh0KGN0eCwgbGlzdCwgaSkpO1xuICAgICAgICBpZiAoa2V5cy5oYXMoa2V5KSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgaGF2ZSBkdXBsaWNhdGUga2V5cyBpbiBhIGtleWVkIGVhY2gnKTtcbiAgICAgICAgfVxuICAgICAgICBrZXlzLmFkZChrZXkpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZ2V0X3NwcmVhZF91cGRhdGUobGV2ZWxzLCB1cGRhdGVzKSB7XG4gICAgY29uc3QgdXBkYXRlID0ge307XG4gICAgY29uc3QgdG9fbnVsbF9vdXQgPSB7fTtcbiAgICBjb25zdCBhY2NvdW50ZWRfZm9yID0geyAkJHNjb3BlOiAxIH07XG4gICAgbGV0IGkgPSBsZXZlbHMubGVuZ3RoO1xuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgY29uc3QgbyA9IGxldmVsc1tpXTtcbiAgICAgICAgY29uc3QgbiA9IHVwZGF0ZXNbaV07XG4gICAgICAgIGlmIChuKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBvKSB7XG4gICAgICAgICAgICAgICAgaWYgKCEoa2V5IGluIG4pKVxuICAgICAgICAgICAgICAgICAgICB0b19udWxsX291dFtrZXldID0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAoY29uc3Qga2V5IGluIG4pIHtcbiAgICAgICAgICAgICAgICBpZiAoIWFjY291bnRlZF9mb3Jba2V5XSkge1xuICAgICAgICAgICAgICAgICAgICB1cGRhdGVba2V5XSA9IG5ba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgYWNjb3VudGVkX2ZvcltrZXldID0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXZlbHNbaV0gPSBuO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gbykge1xuICAgICAgICAgICAgICAgIGFjY291bnRlZF9mb3Jba2V5XSA9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgZm9yIChjb25zdCBrZXkgaW4gdG9fbnVsbF9vdXQpIHtcbiAgICAgICAgaWYgKCEoa2V5IGluIHVwZGF0ZSkpXG4gICAgICAgICAgICB1cGRhdGVba2V5XSA9IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgcmV0dXJuIHVwZGF0ZTtcbn1cbmZ1bmN0aW9uIGdldF9zcHJlYWRfb2JqZWN0KHNwcmVhZF9wcm9wcykge1xuICAgIHJldHVybiB0eXBlb2Ygc3ByZWFkX3Byb3BzID09PSAnb2JqZWN0JyAmJiBzcHJlYWRfcHJvcHMgIT09IG51bGwgPyBzcHJlYWRfcHJvcHMgOiB7fTtcbn1cblxuLy8gc291cmNlOiBodHRwczovL2h0bWwuc3BlYy53aGF0d2cub3JnL211bHRpcGFnZS9pbmRpY2VzLmh0bWxcbmNvbnN0IGJvb2xlYW5fYXR0cmlidXRlcyA9IG5ldyBTZXQoW1xuICAgICdhbGxvd2Z1bGxzY3JlZW4nLFxuICAgICdhbGxvd3BheW1lbnRyZXF1ZXN0JyxcbiAgICAnYXN5bmMnLFxuICAgICdhdXRvZm9jdXMnLFxuICAgICdhdXRvcGxheScsXG4gICAgJ2NoZWNrZWQnLFxuICAgICdjb250cm9scycsXG4gICAgJ2RlZmF1bHQnLFxuICAgICdkZWZlcicsXG4gICAgJ2Rpc2FibGVkJyxcbiAgICAnZm9ybW5vdmFsaWRhdGUnLFxuICAgICdoaWRkZW4nLFxuICAgICdpc21hcCcsXG4gICAgJ2xvb3AnLFxuICAgICdtdWx0aXBsZScsXG4gICAgJ211dGVkJyxcbiAgICAnbm9tb2R1bGUnLFxuICAgICdub3ZhbGlkYXRlJyxcbiAgICAnb3BlbicsXG4gICAgJ3BsYXlzaW5saW5lJyxcbiAgICAncmVhZG9ubHknLFxuICAgICdyZXF1aXJlZCcsXG4gICAgJ3JldmVyc2VkJyxcbiAgICAnc2VsZWN0ZWQnXG5dKTtcblxuY29uc3QgaW52YWxpZF9hdHRyaWJ1dGVfbmFtZV9jaGFyYWN0ZXIgPSAvW1xccydcIj4vPVxcdXtGREQwfS1cXHV7RkRFRn1cXHV7RkZGRX1cXHV7RkZGRn1cXHV7MUZGRkV9XFx1ezFGRkZGfVxcdXsyRkZGRX1cXHV7MkZGRkZ9XFx1ezNGRkZFfVxcdXszRkZGRn1cXHV7NEZGRkV9XFx1ezRGRkZGfVxcdXs1RkZGRX1cXHV7NUZGRkZ9XFx1ezZGRkZFfVxcdXs2RkZGRn1cXHV7N0ZGRkV9XFx1ezdGRkZGfVxcdXs4RkZGRX1cXHV7OEZGRkZ9XFx1ezlGRkZFfVxcdXs5RkZGRn1cXHV7QUZGRkV9XFx1e0FGRkZGfVxcdXtCRkZGRX1cXHV7QkZGRkZ9XFx1e0NGRkZFfVxcdXtDRkZGRn1cXHV7REZGRkV9XFx1e0RGRkZGfVxcdXtFRkZGRX1cXHV7RUZGRkZ9XFx1e0ZGRkZFfVxcdXtGRkZGRn1cXHV7MTBGRkZFfVxcdXsxMEZGRkZ9XS91O1xuLy8gaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy9tdWx0aXBhZ2Uvc3ludGF4Lmh0bWwjYXR0cmlidXRlcy0yXG4vLyBodHRwczovL2luZnJhLnNwZWMud2hhdHdnLm9yZy8jbm9uY2hhcmFjdGVyXG5mdW5jdGlvbiBzcHJlYWQoYXJncywgYXR0cnNfdG9fYWRkKSB7XG4gICAgY29uc3QgYXR0cmlidXRlcyA9IE9iamVjdC5hc3NpZ24oe30sIC4uLmFyZ3MpO1xuICAgIGlmIChhdHRyc190b19hZGQpIHtcbiAgICAgICAgY29uc3QgY2xhc3Nlc190b19hZGQgPSBhdHRyc190b19hZGQuY2xhc3NlcztcbiAgICAgICAgY29uc3Qgc3R5bGVzX3RvX2FkZCA9IGF0dHJzX3RvX2FkZC5zdHlsZXM7XG4gICAgICAgIGlmIChjbGFzc2VzX3RvX2FkZCkge1xuICAgICAgICAgICAgaWYgKGF0dHJpYnV0ZXMuY2xhc3MgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXMuY2xhc3MgPSBjbGFzc2VzX3RvX2FkZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXMuY2xhc3MgKz0gJyAnICsgY2xhc3Nlc190b19hZGQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHN0eWxlc190b19hZGQpIHtcbiAgICAgICAgICAgIGlmIChhdHRyaWJ1dGVzLnN0eWxlID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzLnN0eWxlID0gc3R5bGVfb2JqZWN0X3RvX3N0cmluZyhzdHlsZXNfdG9fYWRkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXMuc3R5bGUgPSBzdHlsZV9vYmplY3RfdG9fc3RyaW5nKG1lcmdlX3Nzcl9zdHlsZXMoYXR0cmlidXRlcy5zdHlsZSwgc3R5bGVzX3RvX2FkZCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGxldCBzdHIgPSAnJztcbiAgICBPYmplY3Qua2V5cyhhdHRyaWJ1dGVzKS5mb3JFYWNoKG5hbWUgPT4ge1xuICAgICAgICBpZiAoaW52YWxpZF9hdHRyaWJ1dGVfbmFtZV9jaGFyYWN0ZXIudGVzdChuYW1lKSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBhdHRyaWJ1dGVzW25hbWVdO1xuICAgICAgICBpZiAodmFsdWUgPT09IHRydWUpXG4gICAgICAgICAgICBzdHIgKz0gJyAnICsgbmFtZTtcbiAgICAgICAgZWxzZSBpZiAoYm9vbGVhbl9hdHRyaWJ1dGVzLmhhcyhuYW1lLnRvTG93ZXJDYXNlKCkpKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUpXG4gICAgICAgICAgICAgICAgc3RyICs9ICcgJyArIG5hbWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodmFsdWUgIT0gbnVsbCkge1xuICAgICAgICAgICAgc3RyICs9IGAgJHtuYW1lfT1cIiR7dmFsdWV9XCJgO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHN0cjtcbn1cbmZ1bmN0aW9uIG1lcmdlX3Nzcl9zdHlsZXMoc3R5bGVfYXR0cmlidXRlLCBzdHlsZV9kaXJlY3RpdmUpIHtcbiAgICBjb25zdCBzdHlsZV9vYmplY3QgPSB7fTtcbiAgICBmb3IgKGNvbnN0IGluZGl2aWR1YWxfc3R5bGUgb2Ygc3R5bGVfYXR0cmlidXRlLnNwbGl0KCc7JykpIHtcbiAgICAgICAgY29uc3QgY29sb25faW5kZXggPSBpbmRpdmlkdWFsX3N0eWxlLmluZGV4T2YoJzonKTtcbiAgICAgICAgY29uc3QgbmFtZSA9IGluZGl2aWR1YWxfc3R5bGUuc2xpY2UoMCwgY29sb25faW5kZXgpLnRyaW0oKTtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBpbmRpdmlkdWFsX3N0eWxlLnNsaWNlKGNvbG9uX2luZGV4ICsgMSkudHJpbSgpO1xuICAgICAgICBpZiAoIW5hbWUpXG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgc3R5bGVfb2JqZWN0W25hbWVdID0gdmFsdWU7XG4gICAgfVxuICAgIGZvciAoY29uc3QgbmFtZSBpbiBzdHlsZV9kaXJlY3RpdmUpIHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBzdHlsZV9kaXJlY3RpdmVbbmFtZV07XG4gICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgc3R5bGVfb2JqZWN0W25hbWVdID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBkZWxldGUgc3R5bGVfb2JqZWN0W25hbWVdO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzdHlsZV9vYmplY3Q7XG59XG5jb25zdCBlc2NhcGVkID0ge1xuICAgICdcIic6ICcmcXVvdDsnLFxuICAgIFwiJ1wiOiAnJiMzOTsnLFxuICAgICcmJzogJyZhbXA7JyxcbiAgICAnPCc6ICcmbHQ7JyxcbiAgICAnPic6ICcmZ3Q7J1xufTtcbmZ1bmN0aW9uIGVzY2FwZShodG1sKSB7XG4gICAgcmV0dXJuIFN0cmluZyhodG1sKS5yZXBsYWNlKC9bXCInJjw+XS9nLCBtYXRjaCA9PiBlc2NhcGVkW21hdGNoXSk7XG59XG5mdW5jdGlvbiBlc2NhcGVfYXR0cmlidXRlX3ZhbHVlKHZhbHVlKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgPyBlc2NhcGUodmFsdWUpIDogdmFsdWU7XG59XG5mdW5jdGlvbiBlc2NhcGVfb2JqZWN0KG9iaikge1xuICAgIGNvbnN0IHJlc3VsdCA9IHt9O1xuICAgIGZvciAoY29uc3Qga2V5IGluIG9iaikge1xuICAgICAgICByZXN1bHRba2V5XSA9IGVzY2FwZV9hdHRyaWJ1dGVfdmFsdWUob2JqW2tleV0pO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gZWFjaChpdGVtcywgZm4pIHtcbiAgICBsZXQgc3RyID0gJyc7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBzdHIgKz0gZm4oaXRlbXNbaV0sIGkpO1xuICAgIH1cbiAgICByZXR1cm4gc3RyO1xufVxuY29uc3QgbWlzc2luZ19jb21wb25lbnQgPSB7XG4gICAgJCRyZW5kZXI6ICgpID0+ICcnXG59O1xuZnVuY3Rpb24gdmFsaWRhdGVfY29tcG9uZW50KGNvbXBvbmVudCwgbmFtZSkge1xuICAgIGlmICghY29tcG9uZW50IHx8ICFjb21wb25lbnQuJCRyZW5kZXIpIHtcbiAgICAgICAgaWYgKG5hbWUgPT09ICdzdmVsdGU6Y29tcG9uZW50JylcbiAgICAgICAgICAgIG5hbWUgKz0gJyB0aGlzPXsuLi59JztcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGA8JHtuYW1lfT4gaXMgbm90IGEgdmFsaWQgU1NSIGNvbXBvbmVudC4gWW91IG1heSBuZWVkIHRvIHJldmlldyB5b3VyIGJ1aWxkIGNvbmZpZyB0byBlbnN1cmUgdGhhdCBkZXBlbmRlbmNpZXMgYXJlIGNvbXBpbGVkLCByYXRoZXIgdGhhbiBpbXBvcnRlZCBhcyBwcmUtY29tcGlsZWQgbW9kdWxlc2ApO1xuICAgIH1cbiAgICByZXR1cm4gY29tcG9uZW50O1xufVxuZnVuY3Rpb24gZGVidWcoZmlsZSwgbGluZSwgY29sdW1uLCB2YWx1ZXMpIHtcbiAgICBjb25zb2xlLmxvZyhge0BkZWJ1Z30gJHtmaWxlID8gZmlsZSArICcgJyA6ICcnfSgke2xpbmV9OiR7Y29sdW1ufSlgKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1jb25zb2xlXG4gICAgY29uc29sZS5sb2codmFsdWVzKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1jb25zb2xlXG4gICAgcmV0dXJuICcnO1xufVxubGV0IG9uX2Rlc3Ryb3k7XG5mdW5jdGlvbiBjcmVhdGVfc3NyX2NvbXBvbmVudChmbikge1xuICAgIGZ1bmN0aW9uICQkcmVuZGVyKHJlc3VsdCwgcHJvcHMsIGJpbmRpbmdzLCBzbG90cywgY29udGV4dCkge1xuICAgICAgICBjb25zdCBwYXJlbnRfY29tcG9uZW50ID0gY3VycmVudF9jb21wb25lbnQ7XG4gICAgICAgIGNvbnN0ICQkID0ge1xuICAgICAgICAgICAgb25fZGVzdHJveSxcbiAgICAgICAgICAgIGNvbnRleHQ6IG5ldyBNYXAoY29udGV4dCB8fCAocGFyZW50X2NvbXBvbmVudCA/IHBhcmVudF9jb21wb25lbnQuJCQuY29udGV4dCA6IFtdKSksXG4gICAgICAgICAgICAvLyB0aGVzZSB3aWxsIGJlIGltbWVkaWF0ZWx5IGRpc2NhcmRlZFxuICAgICAgICAgICAgb25fbW91bnQ6IFtdLFxuICAgICAgICAgICAgYmVmb3JlX3VwZGF0ZTogW10sXG4gICAgICAgICAgICBhZnRlcl91cGRhdGU6IFtdLFxuICAgICAgICAgICAgY2FsbGJhY2tzOiBibGFua19vYmplY3QoKVxuICAgICAgICB9O1xuICAgICAgICBzZXRfY3VycmVudF9jb21wb25lbnQoeyAkJCB9KTtcbiAgICAgICAgY29uc3QgaHRtbCA9IGZuKHJlc3VsdCwgcHJvcHMsIGJpbmRpbmdzLCBzbG90cyk7XG4gICAgICAgIHNldF9jdXJyZW50X2NvbXBvbmVudChwYXJlbnRfY29tcG9uZW50KTtcbiAgICAgICAgcmV0dXJuIGh0bWw7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgIHJlbmRlcjogKHByb3BzID0ge30sIHsgJCRzbG90cyA9IHt9LCBjb250ZXh0ID0gbmV3IE1hcCgpIH0gPSB7fSkgPT4ge1xuICAgICAgICAgICAgb25fZGVzdHJveSA9IFtdO1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0geyB0aXRsZTogJycsIGhlYWQ6ICcnLCBjc3M6IG5ldyBTZXQoKSB9O1xuICAgICAgICAgICAgY29uc3QgaHRtbCA9ICQkcmVuZGVyKHJlc3VsdCwgcHJvcHMsIHt9LCAkJHNsb3RzLCBjb250ZXh0KTtcbiAgICAgICAgICAgIHJ1bl9hbGwob25fZGVzdHJveSk7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGh0bWwsXG4gICAgICAgICAgICAgICAgY3NzOiB7XG4gICAgICAgICAgICAgICAgICAgIGNvZGU6IEFycmF5LmZyb20ocmVzdWx0LmNzcykubWFwKGNzcyA9PiBjc3MuY29kZSkuam9pbignXFxuJyksXG4gICAgICAgICAgICAgICAgICAgIG1hcDogbnVsbCAvLyBUT0RPXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBoZWFkOiByZXN1bHQudGl0bGUgKyByZXN1bHQuaGVhZFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSxcbiAgICAgICAgJCRyZW5kZXJcbiAgICB9O1xufVxuZnVuY3Rpb24gYWRkX2F0dHJpYnV0ZShuYW1lLCB2YWx1ZSwgYm9vbGVhbikge1xuICAgIGlmICh2YWx1ZSA9PSBudWxsIHx8IChib29sZWFuICYmICF2YWx1ZSkpXG4gICAgICAgIHJldHVybiAnJztcbiAgICBjb25zdCBhc3NpZ25tZW50ID0gKGJvb2xlYW4gJiYgdmFsdWUgPT09IHRydWUpID8gJycgOiBgPVwiJHtlc2NhcGVfYXR0cmlidXRlX3ZhbHVlKHZhbHVlLnRvU3RyaW5nKCkpfVwiYDtcbiAgICByZXR1cm4gYCAke25hbWV9JHthc3NpZ25tZW50fWA7XG59XG5mdW5jdGlvbiBhZGRfY2xhc3NlcyhjbGFzc2VzKSB7XG4gICAgcmV0dXJuIGNsYXNzZXMgPyBgIGNsYXNzPVwiJHtjbGFzc2VzfVwiYCA6ICcnO1xufVxuZnVuY3Rpb24gc3R5bGVfb2JqZWN0X3RvX3N0cmluZyhzdHlsZV9vYmplY3QpIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXMoc3R5bGVfb2JqZWN0KVxuICAgICAgICAuZmlsdGVyKGtleSA9PiBzdHlsZV9vYmplY3Rba2V5XSlcbiAgICAgICAgLm1hcChrZXkgPT4gYCR7a2V5fTogJHtzdHlsZV9vYmplY3Rba2V5XX07YClcbiAgICAgICAgLmpvaW4oJyAnKTtcbn1cbmZ1bmN0aW9uIGFkZF9zdHlsZXMoc3R5bGVfb2JqZWN0KSB7XG4gICAgY29uc3Qgc3R5bGVzID0gc3R5bGVfb2JqZWN0X3RvX3N0cmluZyhzdHlsZV9vYmplY3QpO1xuICAgIHJldHVybiBzdHlsZXMgPyBgIHN0eWxlPVwiJHtzdHlsZXN9XCJgIDogJyc7XG59XG5cbmZ1bmN0aW9uIGJpbmQoY29tcG9uZW50LCBuYW1lLCBjYWxsYmFjaykge1xuICAgIGNvbnN0IGluZGV4ID0gY29tcG9uZW50LiQkLnByb3BzW25hbWVdO1xuICAgIGlmIChpbmRleCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNvbXBvbmVudC4kJC5ib3VuZFtpbmRleF0gPSBjYWxsYmFjaztcbiAgICAgICAgY2FsbGJhY2soY29tcG9uZW50LiQkLmN0eFtpbmRleF0pO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGNyZWF0ZV9jb21wb25lbnQoYmxvY2spIHtcbiAgICBibG9jayAmJiBibG9jay5jKCk7XG59XG5mdW5jdGlvbiBjbGFpbV9jb21wb25lbnQoYmxvY2ssIHBhcmVudF9ub2Rlcykge1xuICAgIGJsb2NrICYmIGJsb2NrLmwocGFyZW50X25vZGVzKTtcbn1cbmZ1bmN0aW9uIG1vdW50X2NvbXBvbmVudChjb21wb25lbnQsIHRhcmdldCwgYW5jaG9yLCBjdXN0b21FbGVtZW50KSB7XG4gICAgY29uc3QgeyBmcmFnbWVudCwgb25fbW91bnQsIG9uX2Rlc3Ryb3ksIGFmdGVyX3VwZGF0ZSB9ID0gY29tcG9uZW50LiQkO1xuICAgIGZyYWdtZW50ICYmIGZyYWdtZW50Lm0odGFyZ2V0LCBhbmNob3IpO1xuICAgIGlmICghY3VzdG9tRWxlbWVudCkge1xuICAgICAgICAvLyBvbk1vdW50IGhhcHBlbnMgYmVmb3JlIHRoZSBpbml0aWFsIGFmdGVyVXBkYXRlXG4gICAgICAgIGFkZF9yZW5kZXJfY2FsbGJhY2soKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgbmV3X29uX2Rlc3Ryb3kgPSBvbl9tb3VudC5tYXAocnVuKS5maWx0ZXIoaXNfZnVuY3Rpb24pO1xuICAgICAgICAgICAgaWYgKG9uX2Rlc3Ryb3kpIHtcbiAgICAgICAgICAgICAgICBvbl9kZXN0cm95LnB1c2goLi4ubmV3X29uX2Rlc3Ryb3kpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gRWRnZSBjYXNlIC0gY29tcG9uZW50IHdhcyBkZXN0cm95ZWQgaW1tZWRpYXRlbHksXG4gICAgICAgICAgICAgICAgLy8gbW9zdCBsaWtlbHkgYXMgYSByZXN1bHQgb2YgYSBiaW5kaW5nIGluaXRpYWxpc2luZ1xuICAgICAgICAgICAgICAgIHJ1bl9hbGwobmV3X29uX2Rlc3Ryb3kpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29tcG9uZW50LiQkLm9uX21vdW50ID0gW107XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBhZnRlcl91cGRhdGUuZm9yRWFjaChhZGRfcmVuZGVyX2NhbGxiYWNrKTtcbn1cbmZ1bmN0aW9uIGRlc3Ryb3lfY29tcG9uZW50KGNvbXBvbmVudCwgZGV0YWNoaW5nKSB7XG4gICAgY29uc3QgJCQgPSBjb21wb25lbnQuJCQ7XG4gICAgaWYgKCQkLmZyYWdtZW50ICE9PSBudWxsKSB7XG4gICAgICAgIHJ1bl9hbGwoJCQub25fZGVzdHJveSk7XG4gICAgICAgICQkLmZyYWdtZW50ICYmICQkLmZyYWdtZW50LmQoZGV0YWNoaW5nKTtcbiAgICAgICAgLy8gVE9ETyBudWxsIG91dCBvdGhlciByZWZzLCBpbmNsdWRpbmcgY29tcG9uZW50LiQkIChidXQgbmVlZCB0b1xuICAgICAgICAvLyBwcmVzZXJ2ZSBmaW5hbCBzdGF0ZT8pXG4gICAgICAgICQkLm9uX2Rlc3Ryb3kgPSAkJC5mcmFnbWVudCA9IG51bGw7XG4gICAgICAgICQkLmN0eCA9IFtdO1xuICAgIH1cbn1cbmZ1bmN0aW9uIG1ha2VfZGlydHkoY29tcG9uZW50LCBpKSB7XG4gICAgaWYgKGNvbXBvbmVudC4kJC5kaXJ0eVswXSA9PT0gLTEpIHtcbiAgICAgICAgZGlydHlfY29tcG9uZW50cy5wdXNoKGNvbXBvbmVudCk7XG4gICAgICAgIHNjaGVkdWxlX3VwZGF0ZSgpO1xuICAgICAgICBjb21wb25lbnQuJCQuZGlydHkuZmlsbCgwKTtcbiAgICB9XG4gICAgY29tcG9uZW50LiQkLmRpcnR5WyhpIC8gMzEpIHwgMF0gfD0gKDEgPDwgKGkgJSAzMSkpO1xufVxuZnVuY3Rpb24gaW5pdChjb21wb25lbnQsIG9wdGlvbnMsIGluc3RhbmNlLCBjcmVhdGVfZnJhZ21lbnQsIG5vdF9lcXVhbCwgcHJvcHMsIGFwcGVuZF9zdHlsZXMsIGRpcnR5ID0gWy0xXSkge1xuICAgIGNvbnN0IHBhcmVudF9jb21wb25lbnQgPSBjdXJyZW50X2NvbXBvbmVudDtcbiAgICBzZXRfY3VycmVudF9jb21wb25lbnQoY29tcG9uZW50KTtcbiAgICBjb25zdCAkJCA9IGNvbXBvbmVudC4kJCA9IHtcbiAgICAgICAgZnJhZ21lbnQ6IG51bGwsXG4gICAgICAgIGN0eDogbnVsbCxcbiAgICAgICAgLy8gc3RhdGVcbiAgICAgICAgcHJvcHMsXG4gICAgICAgIHVwZGF0ZTogbm9vcCxcbiAgICAgICAgbm90X2VxdWFsLFxuICAgICAgICBib3VuZDogYmxhbmtfb2JqZWN0KCksXG4gICAgICAgIC8vIGxpZmVjeWNsZVxuICAgICAgICBvbl9tb3VudDogW10sXG4gICAgICAgIG9uX2Rlc3Ryb3k6IFtdLFxuICAgICAgICBvbl9kaXNjb25uZWN0OiBbXSxcbiAgICAgICAgYmVmb3JlX3VwZGF0ZTogW10sXG4gICAgICAgIGFmdGVyX3VwZGF0ZTogW10sXG4gICAgICAgIGNvbnRleHQ6IG5ldyBNYXAob3B0aW9ucy5jb250ZXh0IHx8IChwYXJlbnRfY29tcG9uZW50ID8gcGFyZW50X2NvbXBvbmVudC4kJC5jb250ZXh0IDogW10pKSxcbiAgICAgICAgLy8gZXZlcnl0aGluZyBlbHNlXG4gICAgICAgIGNhbGxiYWNrczogYmxhbmtfb2JqZWN0KCksXG4gICAgICAgIGRpcnR5LFxuICAgICAgICBza2lwX2JvdW5kOiBmYWxzZSxcbiAgICAgICAgcm9vdDogb3B0aW9ucy50YXJnZXQgfHwgcGFyZW50X2NvbXBvbmVudC4kJC5yb290XG4gICAgfTtcbiAgICBhcHBlbmRfc3R5bGVzICYmIGFwcGVuZF9zdHlsZXMoJCQucm9vdCk7XG4gICAgbGV0IHJlYWR5ID0gZmFsc2U7XG4gICAgJCQuY3R4ID0gaW5zdGFuY2VcbiAgICAgICAgPyBpbnN0YW5jZShjb21wb25lbnQsIG9wdGlvbnMucHJvcHMgfHwge30sIChpLCByZXQsIC4uLnJlc3QpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gcmVzdC5sZW5ndGggPyByZXN0WzBdIDogcmV0O1xuICAgICAgICAgICAgaWYgKCQkLmN0eCAmJiBub3RfZXF1YWwoJCQuY3R4W2ldLCAkJC5jdHhbaV0gPSB2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICBpZiAoISQkLnNraXBfYm91bmQgJiYgJCQuYm91bmRbaV0pXG4gICAgICAgICAgICAgICAgICAgICQkLmJvdW5kW2ldKHZhbHVlKTtcbiAgICAgICAgICAgICAgICBpZiAocmVhZHkpXG4gICAgICAgICAgICAgICAgICAgIG1ha2VfZGlydHkoY29tcG9uZW50LCBpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgIH0pXG4gICAgICAgIDogW107XG4gICAgJCQudXBkYXRlKCk7XG4gICAgcmVhZHkgPSB0cnVlO1xuICAgIHJ1bl9hbGwoJCQuYmVmb3JlX3VwZGF0ZSk7XG4gICAgLy8gYGZhbHNlYCBhcyBhIHNwZWNpYWwgY2FzZSBvZiBubyBET00gY29tcG9uZW50XG4gICAgJCQuZnJhZ21lbnQgPSBjcmVhdGVfZnJhZ21lbnQgPyBjcmVhdGVfZnJhZ21lbnQoJCQuY3R4KSA6IGZhbHNlO1xuICAgIGlmIChvcHRpb25zLnRhcmdldCkge1xuICAgICAgICBpZiAob3B0aW9ucy5oeWRyYXRlKSB7XG4gICAgICAgICAgICBzdGFydF9oeWRyYXRpbmcoKTtcbiAgICAgICAgICAgIGNvbnN0IG5vZGVzID0gY2hpbGRyZW4ob3B0aW9ucy50YXJnZXQpO1xuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1ub24tbnVsbC1hc3NlcnRpb25cbiAgICAgICAgICAgICQkLmZyYWdtZW50ICYmICQkLmZyYWdtZW50Lmwobm9kZXMpO1xuICAgICAgICAgICAgbm9kZXMuZm9yRWFjaChkZXRhY2gpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1ub24tbnVsbC1hc3NlcnRpb25cbiAgICAgICAgICAgICQkLmZyYWdtZW50ICYmICQkLmZyYWdtZW50LmMoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0aW9ucy5pbnRybylcbiAgICAgICAgICAgIHRyYW5zaXRpb25faW4oY29tcG9uZW50LiQkLmZyYWdtZW50KTtcbiAgICAgICAgbW91bnRfY29tcG9uZW50KGNvbXBvbmVudCwgb3B0aW9ucy50YXJnZXQsIG9wdGlvbnMuYW5jaG9yLCBvcHRpb25zLmN1c3RvbUVsZW1lbnQpO1xuICAgICAgICBlbmRfaHlkcmF0aW5nKCk7XG4gICAgICAgIGZsdXNoKCk7XG4gICAgfVxuICAgIHNldF9jdXJyZW50X2NvbXBvbmVudChwYXJlbnRfY29tcG9uZW50KTtcbn1cbmxldCBTdmVsdGVFbGVtZW50O1xuaWYgKHR5cGVvZiBIVE1MRWxlbWVudCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIFN2ZWx0ZUVsZW1lbnQgPSBjbGFzcyBleHRlbmRzIEhUTUxFbGVtZW50IHtcbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICBzdXBlcigpO1xuICAgICAgICAgICAgdGhpcy5hdHRhY2hTaGFkb3coeyBtb2RlOiAnb3BlbicgfSk7XG4gICAgICAgIH1cbiAgICAgICAgY29ubmVjdGVkQ2FsbGJhY2soKSB7XG4gICAgICAgICAgICBjb25zdCB7IG9uX21vdW50IH0gPSB0aGlzLiQkO1xuICAgICAgICAgICAgdGhpcy4kJC5vbl9kaXNjb25uZWN0ID0gb25fbW91bnQubWFwKHJ1bikuZmlsdGVyKGlzX2Z1bmN0aW9uKTtcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmUgdG9kbzogaW1wcm92ZSB0eXBpbmdzXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiB0aGlzLiQkLnNsb3R0ZWQpIHtcbiAgICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlIHRvZG86IGltcHJvdmUgdHlwaW5nc1xuICAgICAgICAgICAgICAgIHRoaXMuYXBwZW5kQ2hpbGQodGhpcy4kJC5zbG90dGVkW2tleV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhhdHRyLCBfb2xkVmFsdWUsIG5ld1ZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzW2F0dHJdID0gbmV3VmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgZGlzY29ubmVjdGVkQ2FsbGJhY2soKSB7XG4gICAgICAgICAgICBydW5fYWxsKHRoaXMuJCQub25fZGlzY29ubmVjdCk7XG4gICAgICAgIH1cbiAgICAgICAgJGRlc3Ryb3koKSB7XG4gICAgICAgICAgICBkZXN0cm95X2NvbXBvbmVudCh0aGlzLCAxKTtcbiAgICAgICAgICAgIHRoaXMuJGRlc3Ryb3kgPSBub29wO1xuICAgICAgICB9XG4gICAgICAgICRvbih0eXBlLCBjYWxsYmFjaykge1xuICAgICAgICAgICAgLy8gVE9ETyBzaG91bGQgdGhpcyBkZWxlZ2F0ZSB0byBhZGRFdmVudExpc3RlbmVyP1xuICAgICAgICAgICAgY29uc3QgY2FsbGJhY2tzID0gKHRoaXMuJCQuY2FsbGJhY2tzW3R5cGVdIHx8ICh0aGlzLiQkLmNhbGxiYWNrc1t0eXBlXSA9IFtdKSk7XG4gICAgICAgICAgICBjYWxsYmFja3MucHVzaChjYWxsYmFjayk7XG4gICAgICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gY2FsbGJhY2tzLmluZGV4T2YoY2FsbGJhY2spO1xuICAgICAgICAgICAgICAgIGlmIChpbmRleCAhPT0gLTEpXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICAkc2V0KCQkcHJvcHMpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLiQkc2V0ICYmICFpc19lbXB0eSgkJHByb3BzKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuJCQuc2tpcF9ib3VuZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy4kJHNldCgkJHByb3BzKTtcbiAgICAgICAgICAgICAgICB0aGlzLiQkLnNraXBfYm91bmQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG59XG4vKipcbiAqIEJhc2UgY2xhc3MgZm9yIFN2ZWx0ZSBjb21wb25lbnRzLiBVc2VkIHdoZW4gZGV2PWZhbHNlLlxuICovXG5jbGFzcyBTdmVsdGVDb21wb25lbnQge1xuICAgICRkZXN0cm95KCkge1xuICAgICAgICBkZXN0cm95X2NvbXBvbmVudCh0aGlzLCAxKTtcbiAgICAgICAgdGhpcy4kZGVzdHJveSA9IG5vb3A7XG4gICAgfVxuICAgICRvbih0eXBlLCBjYWxsYmFjaykge1xuICAgICAgICBjb25zdCBjYWxsYmFja3MgPSAodGhpcy4kJC5jYWxsYmFja3NbdHlwZV0gfHwgKHRoaXMuJCQuY2FsbGJhY2tzW3R5cGVdID0gW10pKTtcbiAgICAgICAgY2FsbGJhY2tzLnB1c2goY2FsbGJhY2spO1xuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaW5kZXggPSBjYWxsYmFja3MuaW5kZXhPZihjYWxsYmFjayk7XG4gICAgICAgICAgICBpZiAoaW5kZXggIT09IC0xKVxuICAgICAgICAgICAgICAgIGNhbGxiYWNrcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICB9O1xuICAgIH1cbiAgICAkc2V0KCQkcHJvcHMpIHtcbiAgICAgICAgaWYgKHRoaXMuJCRzZXQgJiYgIWlzX2VtcHR5KCQkcHJvcHMpKSB7XG4gICAgICAgICAgICB0aGlzLiQkLnNraXBfYm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy4kJHNldCgkJHByb3BzKTtcbiAgICAgICAgICAgIHRoaXMuJCQuc2tpcF9ib3VuZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkaXNwYXRjaF9kZXYodHlwZSwgZGV0YWlsKSB7XG4gICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChjdXN0b21fZXZlbnQodHlwZSwgT2JqZWN0LmFzc2lnbih7IHZlcnNpb246ICczLjQ3LjAnIH0sIGRldGFpbCksIHRydWUpKTtcbn1cbmZ1bmN0aW9uIGFwcGVuZF9kZXYodGFyZ2V0LCBub2RlKSB7XG4gICAgZGlzcGF0Y2hfZGV2KCdTdmVsdGVET01JbnNlcnQnLCB7IHRhcmdldCwgbm9kZSB9KTtcbiAgICBhcHBlbmQodGFyZ2V0LCBub2RlKTtcbn1cbmZ1bmN0aW9uIGFwcGVuZF9oeWRyYXRpb25fZGV2KHRhcmdldCwgbm9kZSkge1xuICAgIGRpc3BhdGNoX2RldignU3ZlbHRlRE9NSW5zZXJ0JywgeyB0YXJnZXQsIG5vZGUgfSk7XG4gICAgYXBwZW5kX2h5ZHJhdGlvbih0YXJnZXQsIG5vZGUpO1xufVxuZnVuY3Rpb24gaW5zZXJ0X2Rldih0YXJnZXQsIG5vZGUsIGFuY2hvcikge1xuICAgIGRpc3BhdGNoX2RldignU3ZlbHRlRE9NSW5zZXJ0JywgeyB0YXJnZXQsIG5vZGUsIGFuY2hvciB9KTtcbiAgICBpbnNlcnQodGFyZ2V0LCBub2RlLCBhbmNob3IpO1xufVxuZnVuY3Rpb24gaW5zZXJ0X2h5ZHJhdGlvbl9kZXYodGFyZ2V0LCBub2RlLCBhbmNob3IpIHtcbiAgICBkaXNwYXRjaF9kZXYoJ1N2ZWx0ZURPTUluc2VydCcsIHsgdGFyZ2V0LCBub2RlLCBhbmNob3IgfSk7XG4gICAgaW5zZXJ0X2h5ZHJhdGlvbih0YXJnZXQsIG5vZGUsIGFuY2hvcik7XG59XG5mdW5jdGlvbiBkZXRhY2hfZGV2KG5vZGUpIHtcbiAgICBkaXNwYXRjaF9kZXYoJ1N2ZWx0ZURPTVJlbW92ZScsIHsgbm9kZSB9KTtcbiAgICBkZXRhY2gobm9kZSk7XG59XG5mdW5jdGlvbiBkZXRhY2hfYmV0d2Vlbl9kZXYoYmVmb3JlLCBhZnRlcikge1xuICAgIHdoaWxlIChiZWZvcmUubmV4dFNpYmxpbmcgJiYgYmVmb3JlLm5leHRTaWJsaW5nICE9PSBhZnRlcikge1xuICAgICAgICBkZXRhY2hfZGV2KGJlZm9yZS5uZXh0U2libGluZyk7XG4gICAgfVxufVxuZnVuY3Rpb24gZGV0YWNoX2JlZm9yZV9kZXYoYWZ0ZXIpIHtcbiAgICB3aGlsZSAoYWZ0ZXIucHJldmlvdXNTaWJsaW5nKSB7XG4gICAgICAgIGRldGFjaF9kZXYoYWZ0ZXIucHJldmlvdXNTaWJsaW5nKTtcbiAgICB9XG59XG5mdW5jdGlvbiBkZXRhY2hfYWZ0ZXJfZGV2KGJlZm9yZSkge1xuICAgIHdoaWxlIChiZWZvcmUubmV4dFNpYmxpbmcpIHtcbiAgICAgICAgZGV0YWNoX2RldihiZWZvcmUubmV4dFNpYmxpbmcpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGxpc3Rlbl9kZXYobm9kZSwgZXZlbnQsIGhhbmRsZXIsIG9wdGlvbnMsIGhhc19wcmV2ZW50X2RlZmF1bHQsIGhhc19zdG9wX3Byb3BhZ2F0aW9uKSB7XG4gICAgY29uc3QgbW9kaWZpZXJzID0gb3B0aW9ucyA9PT0gdHJ1ZSA/IFsnY2FwdHVyZSddIDogb3B0aW9ucyA/IEFycmF5LmZyb20oT2JqZWN0LmtleXMob3B0aW9ucykpIDogW107XG4gICAgaWYgKGhhc19wcmV2ZW50X2RlZmF1bHQpXG4gICAgICAgIG1vZGlmaWVycy5wdXNoKCdwcmV2ZW50RGVmYXVsdCcpO1xuICAgIGlmIChoYXNfc3RvcF9wcm9wYWdhdGlvbilcbiAgICAgICAgbW9kaWZpZXJzLnB1c2goJ3N0b3BQcm9wYWdhdGlvbicpO1xuICAgIGRpc3BhdGNoX2RldignU3ZlbHRlRE9NQWRkRXZlbnRMaXN0ZW5lcicsIHsgbm9kZSwgZXZlbnQsIGhhbmRsZXIsIG1vZGlmaWVycyB9KTtcbiAgICBjb25zdCBkaXNwb3NlID0gbGlzdGVuKG5vZGUsIGV2ZW50LCBoYW5kbGVyLCBvcHRpb25zKTtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICBkaXNwYXRjaF9kZXYoJ1N2ZWx0ZURPTVJlbW92ZUV2ZW50TGlzdGVuZXInLCB7IG5vZGUsIGV2ZW50LCBoYW5kbGVyLCBtb2RpZmllcnMgfSk7XG4gICAgICAgIGRpc3Bvc2UoKTtcbiAgICB9O1xufVxuZnVuY3Rpb24gYXR0cl9kZXYobm9kZSwgYXR0cmlidXRlLCB2YWx1ZSkge1xuICAgIGF0dHIobm9kZSwgYXR0cmlidXRlLCB2YWx1ZSk7XG4gICAgaWYgKHZhbHVlID09IG51bGwpXG4gICAgICAgIGRpc3BhdGNoX2RldignU3ZlbHRlRE9NUmVtb3ZlQXR0cmlidXRlJywgeyBub2RlLCBhdHRyaWJ1dGUgfSk7XG4gICAgZWxzZVxuICAgICAgICBkaXNwYXRjaF9kZXYoJ1N2ZWx0ZURPTVNldEF0dHJpYnV0ZScsIHsgbm9kZSwgYXR0cmlidXRlLCB2YWx1ZSB9KTtcbn1cbmZ1bmN0aW9uIHByb3BfZGV2KG5vZGUsIHByb3BlcnR5LCB2YWx1ZSkge1xuICAgIG5vZGVbcHJvcGVydHldID0gdmFsdWU7XG4gICAgZGlzcGF0Y2hfZGV2KCdTdmVsdGVET01TZXRQcm9wZXJ0eScsIHsgbm9kZSwgcHJvcGVydHksIHZhbHVlIH0pO1xufVxuZnVuY3Rpb24gZGF0YXNldF9kZXYobm9kZSwgcHJvcGVydHksIHZhbHVlKSB7XG4gICAgbm9kZS5kYXRhc2V0W3Byb3BlcnR5XSA9IHZhbHVlO1xuICAgIGRpc3BhdGNoX2RldignU3ZlbHRlRE9NU2V0RGF0YXNldCcsIHsgbm9kZSwgcHJvcGVydHksIHZhbHVlIH0pO1xufVxuZnVuY3Rpb24gc2V0X2RhdGFfZGV2KHRleHQsIGRhdGEpIHtcbiAgICBkYXRhID0gJycgKyBkYXRhO1xuICAgIGlmICh0ZXh0Lndob2xlVGV4dCA9PT0gZGF0YSlcbiAgICAgICAgcmV0dXJuO1xuICAgIGRpc3BhdGNoX2RldignU3ZlbHRlRE9NU2V0RGF0YScsIHsgbm9kZTogdGV4dCwgZGF0YSB9KTtcbiAgICB0ZXh0LmRhdGEgPSBkYXRhO1xufVxuZnVuY3Rpb24gdmFsaWRhdGVfZWFjaF9hcmd1bWVudChhcmcpIHtcbiAgICBpZiAodHlwZW9mIGFyZyAhPT0gJ3N0cmluZycgJiYgIShhcmcgJiYgdHlwZW9mIGFyZyA9PT0gJ29iamVjdCcgJiYgJ2xlbmd0aCcgaW4gYXJnKSkge1xuICAgICAgICBsZXQgbXNnID0gJ3sjZWFjaH0gb25seSBpdGVyYXRlcyBvdmVyIGFycmF5LWxpa2Ugb2JqZWN0cy4nO1xuICAgICAgICBpZiAodHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyAmJiBhcmcgJiYgU3ltYm9sLml0ZXJhdG9yIGluIGFyZykge1xuICAgICAgICAgICAgbXNnICs9ICcgWW91IGNhbiB1c2UgYSBzcHJlYWQgdG8gY29udmVydCB0aGlzIGl0ZXJhYmxlIGludG8gYW4gYXJyYXkuJztcbiAgICAgICAgfVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IobXNnKTtcbiAgICB9XG59XG5mdW5jdGlvbiB2YWxpZGF0ZV9zbG90cyhuYW1lLCBzbG90LCBrZXlzKSB7XG4gICAgZm9yIChjb25zdCBzbG90X2tleSBvZiBPYmplY3Qua2V5cyhzbG90KSkge1xuICAgICAgICBpZiAoIX5rZXlzLmluZGV4T2Yoc2xvdF9rZXkpKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oYDwke25hbWV9PiByZWNlaXZlZCBhbiB1bmV4cGVjdGVkIHNsb3QgXCIke3Nsb3Rfa2V5fVwiLmApO1xuICAgICAgICB9XG4gICAgfVxufVxuZnVuY3Rpb24gdmFsaWRhdGVfZHluYW1pY19lbGVtZW50KHRhZykge1xuICAgIGlmICh0YWcgJiYgdHlwZW9mIHRhZyAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCc8c3ZlbHRlOmVsZW1lbnQ+IGV4cGVjdHMgXCJ0aGlzXCIgYXR0cmlidXRlIHRvIGJlIGEgc3RyaW5nLicpO1xuICAgIH1cbn1cbi8qKlxuICogQmFzZSBjbGFzcyBmb3IgU3ZlbHRlIGNvbXBvbmVudHMgd2l0aCBzb21lIG1pbm9yIGRldi1lbmhhbmNlbWVudHMuIFVzZWQgd2hlbiBkZXY9dHJ1ZS5cbiAqL1xuY2xhc3MgU3ZlbHRlQ29tcG9uZW50RGV2IGV4dGVuZHMgU3ZlbHRlQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgICAgIGlmICghb3B0aW9ucyB8fCAoIW9wdGlvbnMudGFyZ2V0ICYmICFvcHRpb25zLiQkaW5saW5lKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiJ3RhcmdldCcgaXMgYSByZXF1aXJlZCBvcHRpb25cIik7XG4gICAgICAgIH1cbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG4gICAgJGRlc3Ryb3koKSB7XG4gICAgICAgIHN1cGVyLiRkZXN0cm95KCk7XG4gICAgICAgIHRoaXMuJGRlc3Ryb3kgPSAoKSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ0NvbXBvbmVudCB3YXMgYWxyZWFkeSBkZXN0cm95ZWQnKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1jb25zb2xlXG4gICAgICAgIH07XG4gICAgfVxuICAgICRjYXB0dXJlX3N0YXRlKCkgeyB9XG4gICAgJGluamVjdF9zdGF0ZSgpIHsgfVxufVxuLyoqXG4gKiBCYXNlIGNsYXNzIHRvIGNyZWF0ZSBzdHJvbmdseSB0eXBlZCBTdmVsdGUgY29tcG9uZW50cy5cbiAqIFRoaXMgb25seSBleGlzdHMgZm9yIHR5cGluZyBwdXJwb3NlcyBhbmQgc2hvdWxkIGJlIHVzZWQgaW4gYC5kLnRzYCBmaWxlcy5cbiAqXG4gKiAjIyMgRXhhbXBsZTpcbiAqXG4gKiBZb3UgaGF2ZSBjb21wb25lbnQgbGlicmFyeSBvbiBucG0gY2FsbGVkIGBjb21wb25lbnQtbGlicmFyeWAsIGZyb20gd2hpY2hcbiAqIHlvdSBleHBvcnQgYSBjb21wb25lbnQgY2FsbGVkIGBNeUNvbXBvbmVudGAuIEZvciBTdmVsdGUrVHlwZVNjcmlwdCB1c2VycyxcbiAqIHlvdSB3YW50IHRvIHByb3ZpZGUgdHlwaW5ncy4gVGhlcmVmb3JlIHlvdSBjcmVhdGUgYSBgaW5kZXguZC50c2A6XG4gKiBgYGB0c1xuICogaW1wb3J0IHsgU3ZlbHRlQ29tcG9uZW50VHlwZWQgfSBmcm9tIFwic3ZlbHRlXCI7XG4gKiBleHBvcnQgY2xhc3MgTXlDb21wb25lbnQgZXh0ZW5kcyBTdmVsdGVDb21wb25lbnRUeXBlZDx7Zm9vOiBzdHJpbmd9PiB7fVxuICogYGBgXG4gKiBUeXBpbmcgdGhpcyBtYWtlcyBpdCBwb3NzaWJsZSBmb3IgSURFcyBsaWtlIFZTIENvZGUgd2l0aCB0aGUgU3ZlbHRlIGV4dGVuc2lvblxuICogdG8gcHJvdmlkZSBpbnRlbGxpc2Vuc2UgYW5kIHRvIHVzZSB0aGUgY29tcG9uZW50IGxpa2UgdGhpcyBpbiBhIFN2ZWx0ZSBmaWxlXG4gKiB3aXRoIFR5cGVTY3JpcHQ6XG4gKiBgYGBzdmVsdGVcbiAqIDxzY3JpcHQgbGFuZz1cInRzXCI+XG4gKiBcdGltcG9ydCB7IE15Q29tcG9uZW50IH0gZnJvbSBcImNvbXBvbmVudC1saWJyYXJ5XCI7XG4gKiA8L3NjcmlwdD5cbiAqIDxNeUNvbXBvbmVudCBmb289eydiYXInfSAvPlxuICogYGBgXG4gKlxuICogIyMjIyBXaHkgbm90IG1ha2UgdGhpcyBwYXJ0IG9mIGBTdmVsdGVDb21wb25lbnQoRGV2KWA/XG4gKiBCZWNhdXNlXG4gKiBgYGB0c1xuICogY2xhc3MgQVN1YmNsYXNzT2ZTdmVsdGVDb21wb25lbnQgZXh0ZW5kcyBTdmVsdGVDb21wb25lbnQ8e2Zvbzogc3RyaW5nfT4ge31cbiAqIGNvbnN0IGNvbXBvbmVudDogdHlwZW9mIFN2ZWx0ZUNvbXBvbmVudCA9IEFTdWJjbGFzc09mU3ZlbHRlQ29tcG9uZW50O1xuICogYGBgXG4gKiB3aWxsIHRocm93IGEgdHlwZSBlcnJvciwgc28gd2UgbmVlZCB0byBzZXBhcmF0ZSB0aGUgbW9yZSBzdHJpY3RseSB0eXBlZCBjbGFzcy5cbiAqL1xuY2xhc3MgU3ZlbHRlQ29tcG9uZW50VHlwZWQgZXh0ZW5kcyBTdmVsdGVDb21wb25lbnREZXYge1xuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICAgICAgc3VwZXIob3B0aW9ucyk7XG4gICAgfVxufVxuZnVuY3Rpb24gbG9vcF9ndWFyZCh0aW1lb3V0KSB7XG4gICAgY29uc3Qgc3RhcnQgPSBEYXRlLm5vdygpO1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgIGlmIChEYXRlLm5vdygpIC0gc3RhcnQgPiB0aW1lb3V0KSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0luZmluaXRlIGxvb3AgZGV0ZWN0ZWQnKTtcbiAgICAgICAgfVxuICAgIH07XG59XG5cbmV4cG9ydCB7IEh0bWxUYWcsIEh0bWxUYWdIeWRyYXRpb24sIFN2ZWx0ZUNvbXBvbmVudCwgU3ZlbHRlQ29tcG9uZW50RGV2LCBTdmVsdGVDb21wb25lbnRUeXBlZCwgU3ZlbHRlRWxlbWVudCwgYWN0aW9uX2Rlc3Ryb3llciwgYWRkX2F0dHJpYnV0ZSwgYWRkX2NsYXNzZXMsIGFkZF9mbHVzaF9jYWxsYmFjaywgYWRkX2xvY2F0aW9uLCBhZGRfcmVuZGVyX2NhbGxiYWNrLCBhZGRfcmVzaXplX2xpc3RlbmVyLCBhZGRfc3R5bGVzLCBhZGRfdHJhbnNmb3JtLCBhZnRlclVwZGF0ZSwgYXBwZW5kLCBhcHBlbmRfZGV2LCBhcHBlbmRfZW1wdHlfc3R5bGVzaGVldCwgYXBwZW5kX2h5ZHJhdGlvbiwgYXBwZW5kX2h5ZHJhdGlvbl9kZXYsIGFwcGVuZF9zdHlsZXMsIGFzc2lnbiwgYXR0ciwgYXR0cl9kZXYsIGF0dHJpYnV0ZV90b19vYmplY3QsIGJlZm9yZVVwZGF0ZSwgYmluZCwgYmluZGluZ19jYWxsYmFja3MsIGJsYW5rX29iamVjdCwgYnViYmxlLCBjaGVja19vdXRyb3MsIGNoaWxkcmVuLCBjbGFpbV9jb21wb25lbnQsIGNsYWltX2VsZW1lbnQsIGNsYWltX2h0bWxfdGFnLCBjbGFpbV9zcGFjZSwgY2xhaW1fc3ZnX2VsZW1lbnQsIGNsYWltX3RleHQsIGNsZWFyX2xvb3BzLCBjb21wb25lbnRfc3Vic2NyaWJlLCBjb21wdXRlX3Jlc3RfcHJvcHMsIGNvbXB1dGVfc2xvdHMsIGNyZWF0ZUV2ZW50RGlzcGF0Y2hlciwgY3JlYXRlX2FuaW1hdGlvbiwgY3JlYXRlX2JpZGlyZWN0aW9uYWxfdHJhbnNpdGlvbiwgY3JlYXRlX2NvbXBvbmVudCwgY3JlYXRlX2luX3RyYW5zaXRpb24sIGNyZWF0ZV9vdXRfdHJhbnNpdGlvbiwgY3JlYXRlX3Nsb3QsIGNyZWF0ZV9zc3JfY29tcG9uZW50LCBjdXJyZW50X2NvbXBvbmVudCwgY3VzdG9tX2V2ZW50LCBkYXRhc2V0X2RldiwgZGVidWcsIGRlc3Ryb3lfYmxvY2ssIGRlc3Ryb3lfY29tcG9uZW50LCBkZXN0cm95X2VhY2gsIGRldGFjaCwgZGV0YWNoX2FmdGVyX2RldiwgZGV0YWNoX2JlZm9yZV9kZXYsIGRldGFjaF9iZXR3ZWVuX2RldiwgZGV0YWNoX2RldiwgZGlydHlfY29tcG9uZW50cywgZGlzcGF0Y2hfZGV2LCBlYWNoLCBlbGVtZW50LCBlbGVtZW50X2lzLCBlbXB0eSwgZW5kX2h5ZHJhdGluZywgZXNjYXBlLCBlc2NhcGVfYXR0cmlidXRlX3ZhbHVlLCBlc2NhcGVfb2JqZWN0LCBlc2NhcGVkLCBleGNsdWRlX2ludGVybmFsX3Byb3BzLCBmaXhfYW5kX2Rlc3Ryb3lfYmxvY2ssIGZpeF9hbmRfb3V0cm9fYW5kX2Rlc3Ryb3lfYmxvY2ssIGZpeF9wb3NpdGlvbiwgZmx1c2gsIGdldEFsbENvbnRleHRzLCBnZXRDb250ZXh0LCBnZXRfYWxsX2RpcnR5X2Zyb21fc2NvcGUsIGdldF9iaW5kaW5nX2dyb3VwX3ZhbHVlLCBnZXRfY3VycmVudF9jb21wb25lbnQsIGdldF9jdXN0b21fZWxlbWVudHNfc2xvdHMsIGdldF9yb290X2Zvcl9zdHlsZSwgZ2V0X3Nsb3RfY2hhbmdlcywgZ2V0X3NwcmVhZF9vYmplY3QsIGdldF9zcHJlYWRfdXBkYXRlLCBnZXRfc3RvcmVfdmFsdWUsIGdsb2JhbHMsIGdyb3VwX291dHJvcywgaGFuZGxlX3Byb21pc2UsIGhhc0NvbnRleHQsIGhhc19wcm9wLCBpZGVudGl0eSwgaW5pdCwgaW5zZXJ0LCBpbnNlcnRfZGV2LCBpbnNlcnRfaHlkcmF0aW9uLCBpbnNlcnRfaHlkcmF0aW9uX2RldiwgaW50cm9zLCBpbnZhbGlkX2F0dHJpYnV0ZV9uYW1lX2NoYXJhY3RlciwgaXNfY2xpZW50LCBpc19jcm9zc29yaWdpbiwgaXNfZW1wdHksIGlzX2Z1bmN0aW9uLCBpc19wcm9taXNlLCBsaXN0ZW4sIGxpc3Rlbl9kZXYsIGxvb3AsIGxvb3BfZ3VhcmQsIG1lcmdlX3Nzcl9zdHlsZXMsIG1pc3NpbmdfY29tcG9uZW50LCBtb3VudF9jb21wb25lbnQsIG5vb3AsIG5vdF9lcXVhbCwgbm93LCBudWxsX3RvX2VtcHR5LCBvYmplY3Rfd2l0aG91dF9wcm9wZXJ0aWVzLCBvbkRlc3Ryb3ksIG9uTW91bnQsIG9uY2UsIG91dHJvX2FuZF9kZXN0cm95X2Jsb2NrLCBwcmV2ZW50X2RlZmF1bHQsIHByb3BfZGV2LCBxdWVyeV9zZWxlY3Rvcl9hbGwsIHJhZiwgcnVuLCBydW5fYWxsLCBzYWZlX25vdF9lcXVhbCwgc2NoZWR1bGVfdXBkYXRlLCBzZWxlY3RfbXVsdGlwbGVfdmFsdWUsIHNlbGVjdF9vcHRpb24sIHNlbGVjdF9vcHRpb25zLCBzZWxlY3RfdmFsdWUsIHNlbGYsIHNldENvbnRleHQsIHNldF9hdHRyaWJ1dGVzLCBzZXRfY3VycmVudF9jb21wb25lbnQsIHNldF9jdXN0b21fZWxlbWVudF9kYXRhLCBzZXRfZGF0YSwgc2V0X2RhdGFfZGV2LCBzZXRfaW5wdXRfdHlwZSwgc2V0X2lucHV0X3ZhbHVlLCBzZXRfbm93LCBzZXRfcmFmLCBzZXRfc3RvcmVfdmFsdWUsIHNldF9zdHlsZSwgc2V0X3N2Z19hdHRyaWJ1dGVzLCBzcGFjZSwgc3ByZWFkLCBzcmNfdXJsX2VxdWFsLCBzdGFydF9oeWRyYXRpbmcsIHN0b3BfcHJvcGFnYXRpb24sIHN1YnNjcmliZSwgc3ZnX2VsZW1lbnQsIHRleHQsIHRpY2ssIHRpbWVfcmFuZ2VzX3RvX2FycmF5LCB0b19udW1iZXIsIHRvZ2dsZV9jbGFzcywgdHJhbnNpdGlvbl9pbiwgdHJhbnNpdGlvbl9vdXQsIHRydXN0ZWQsIHVwZGF0ZV9hd2FpdF9ibG9ja19icmFuY2gsIHVwZGF0ZV9rZXllZF9lYWNoLCB1cGRhdGVfc2xvdCwgdXBkYXRlX3Nsb3RfYmFzZSwgdmFsaWRhdGVfY29tcG9uZW50LCB2YWxpZGF0ZV9keW5hbWljX2VsZW1lbnQsIHZhbGlkYXRlX2VhY2hfYXJndW1lbnQsIHZhbGlkYXRlX2VhY2hfa2V5cywgdmFsaWRhdGVfc2xvdHMsIHZhbGlkYXRlX3N0b3JlLCB4bGlua19hdHRyIH07XG4iLCI8c2NyaXB0IGxhbmc9XCJ0c1wiPlxuICBpbXBvcnQgeyBjcmVhdGVFdmVudERpc3BhdGNoZXIgfSBmcm9tIFwic3ZlbHRlXCI7XG5cbiAgZXhwb3J0IGxldCBwb3B1cDogc3RyaW5nO1xuICBleHBvcnQgbGV0IGRpc2FibGVkID0gZmFsc2U7XG5cbiAgY29uc3QgZGlzcGF0Y2hlciA9IGNyZWF0ZUV2ZW50RGlzcGF0Y2hlcigpO1xuICBjb25zdCBoYW5kbGVDbGljayA9ICgpID0+IHtcbiAgICBkaXNwYXRjaGVyKFwiY2xpY2tcIik7XG4gIH07XG48L3NjcmlwdD5cblxuPGJ1dHRvblxuICBhcmlhLWxhYmVsPXtwb3B1cH1cbiAgY2xhc3M6bW9kLWN0YT17IWRpc2FibGVkfVxuICB7ZGlzYWJsZWR9XG4gIG9uOmNsaWNrPXtoYW5kbGVDbGlja31cbj5cbiAgPHNsb3QgLz5cbjwvYnV0dG9uPlxuIiwiPHNjcmlwdD5cbiAgZXhwb3J0IGxldCBzaXplID0gMjRcbjwvc2NyaXB0PlxuPHN2Z1xuICB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCJcbiAgd2lkdGg9e3NpemV9XG4gIGhlaWdodD17c2l6ZX1cbiAgdmlld0JveD1cIjAgMCAyNCAyNFwiXG4gIGZpbGw9XCJub25lXCJcbiAgc3Ryb2tlPVwiY3VycmVudENvbG9yXCJcbiAgc3Ryb2tlLXdpZHRoPVwiMlwiXG4gIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIlxuICBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiXG4gIHsuLi4kJHJlc3RQcm9wc31cbj5cbiAgPHNsb3QgLz5cbiAgPHBhdGggZD1cIk0xNC41IDJINmEyIDIgMCAwMC0yIDJ2MTZhMiAyIDAgMDAyIDJoMTJhMiAyIDAgMDAyLTJWNy41TDE0LjUgMnpcIiAvPlxuICA8cG9seWxpbmUgcG9pbnRzPVwiMTQgMiAxNCA4IDIwIDhcIiAvPlxuPC9zdmc+IiwiPHNjcmlwdCBsYW5nPVwidHNcIj5cbiAgaW1wb3J0IHsgY3JlYXRlRXZlbnREaXNwYXRjaGVyIH0gZnJvbSBcInN2ZWx0ZVwiO1xuXG4gIGV4cG9ydCBsZXQgcG9wdXA6IHN0cmluZztcbiAgZXhwb3J0IGxldCBkaXNhYmxlZCA9IGZhbHNlO1xuXG4gIGNvbnN0IGRpc3BhdGNoZXIgPSBjcmVhdGVFdmVudERpc3BhdGNoZXIoKTtcbiAgY29uc3QgaGFuZGxlQ2xpY2sgPSAoKSA9PiB7XG4gICAgaWYgKCFkaXNhYmxlZCkge1xuICAgICAgZGlzcGF0Y2hlcihcImNsaWNrXCIpO1xuICAgIH1cbiAgfTtcbjwvc2NyaXB0PlxuXG48ZGl2IGNsYXNzPVwid3JhcHBlclwiPlxuICA8YnV0dG9uXG4gICAgYXJpYS1sYWJlbD17cG9wdXB9XG4gICAge2Rpc2FibGVkfVxuICAgIG9uOmNsaWNrPXtoYW5kbGVDbGlja31cbiAgICBjbGFzcz17ZGlzYWJsZWQgPyBcImJ1dHRvbi1kaXNhYmxlZFwiIDogXCJidXR0b24tZW5hYmxlZFwifVxuICAgIHN0eWxlPVwiYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7IHBhZGRpbmc6IDBcIlxuICA+XG4gICAgPHNsb3QgLz5cbiAgPC9idXR0b24+XG48L2Rpdj5cblxuPHN0eWxlPlxuICAud3JhcHBlciB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICBtYXJnaW46IDA7XG4gIH1cbiAgLmJ1dHRvbi1lbmFibGVkOmhvdmVyIHtcbiAgICAvKm5vaW5zcGVjdGlvbiBDc3NVbnJlc29sdmVkQ3VzdG9tUHJvcGVydHkqL1xuICAgIGNvbG9yOiB2YXIoLS1pbnRlcmFjdGl2ZS1hY2NlbnQpO1xuICB9XG4gIC5idXR0b24tZGlzYWJsZWQge1xuICAgIC8qbm9pbnNwZWN0aW9uIENzc1VucmVzb2x2ZWRDdXN0b21Qcm9wZXJ0eSovXG4gICAgY29sb3I6IHZhcigtLXRleHQtbXV0ZWQpO1xuICB9XG48L3N0eWxlPlxuIiwiPCEtLXN1cHByZXNzIExhYmVsZWRTdGF0ZW1lbnRKUyAtLT5cbjxzY3JpcHQgbGFuZz1cInRzXCI+XG4gIGltcG9ydCBPYnNpZGlhbkJ1dHRvbiBmcm9tIFwiLi9PYnNpZGlhbkJ1dHRvbi5zdmVsdGVcIjtcbiAgaW1wb3J0IHsgRmlsZSB9IGZyb20gXCJzdmVsdGUtbHVjaWRlLWljb25zXCI7XG4gIGltcG9ydCBPYnNpZGlhbkljb25CdXR0b24gZnJvbSBcIi4vT2JzaWRpYW5JY29uQnV0dG9uLnN2ZWx0ZVwiO1xuICBpbXBvcnQgdHlwZSB7IFdvcmQgfSBmcm9tIFwiLi4vLi4vbW9kZWwvV29yZFwiO1xuICBpbXBvcnQgeyBvbk1vdW50IH0gZnJvbSBcInN2ZWx0ZVwiO1xuXG4gIHR5cGUgRGljdGlvbmFyeSA9IHtcbiAgICBpZDogc3RyaW5nO1xuICAgIHBhdGg6IHN0cmluZztcbiAgfTtcblxuICBleHBvcnQgbGV0IGRpY3Rpb25hcmllczogRGljdGlvbmFyeVtdO1xuICBleHBvcnQgbGV0IHNlbGVjdGVkRGljdGlvbmFyeTogRGljdGlvbmFyeTtcbiAgZXhwb3J0IGxldCB3b3JkOiBzdHJpbmcgPSBcIlwiO1xuICBleHBvcnQgbGV0IHVzZURpc3BsYXllZFdvcmQgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBkaXNwbGF5ZWRXb3JkOiBzdHJpbmcgPSBcIlwiO1xuICBleHBvcnQgbGV0IGRlc2NyaXB0aW9uOiBzdHJpbmcgPSBcIlwiO1xuICBleHBvcnQgbGV0IGFsaWFzZXM6IHN0cmluZ1tdID0gW107XG4gIGV4cG9ydCBsZXQgZGl2aWRlckZvckRpc3BsYXkgPSBcIlwiO1xuXG4gIGV4cG9ydCBsZXQgb25TdWJtaXQ6IChkaWN0aW9uYXJ5UGF0aDogc3RyaW5nLCB3b3JkOiBXb3JkKSA9PiB2b2lkO1xuICBleHBvcnQgbGV0IG9uQ2xpY2tGaWxlSWNvbjogKGRpY3Rpb25hcnlQYXRoOiBzdHJpbmcpID0+IHZvaWQ7XG5cbiAgbGV0IGFsaWFzZXNTdHIgPSBhbGlhc2VzLmpvaW4oXCJcXG5cIik7XG4gIGxldCB3b3JkUmVmID0gbnVsbDtcbiAgbGV0IGRpc3BsYXllZFdvcmRSZWYgPSBudWxsO1xuXG4gICQ6IGVuYWJsZVN1Ym1pdCA9IHdvcmQubGVuZ3RoID4gMDtcbiAgJDogZW5hYmxlRGlzcGxheWVkV29yZCA9IEJvb2xlYW4oZGl2aWRlckZvckRpc3BsYXkpO1xuICAkOiBmaXJzdFdvcmRUaXRsZSA9IHVzZURpc3BsYXllZFdvcmQgPyBcIkluc2VydGVkIHdvcmRcIiA6IFwiV29yZFwiO1xuICAkOiB7XG4gICAgaWYgKHVzZURpc3BsYXllZFdvcmQpIHtcbiAgICAgIGRpc3BsYXllZFdvcmRSZWY/LmZvY3VzKCk7XG4gICAgfVxuICB9XG5cbiAgY29uc3QgaGFuZGxlU3VibWl0ID0gKCkgPT4ge1xuICAgIG9uU3VibWl0KHNlbGVjdGVkRGljdGlvbmFyeS5wYXRoLCB7XG4gICAgICB2YWx1ZTogZGlzcGxheWVkV29yZFxuICAgICAgICA/IGAke2Rpc3BsYXllZFdvcmR9JHtkaXZpZGVyRm9yRGlzcGxheX0ke3dvcmR9YFxuICAgICAgICA6IHdvcmQsXG4gICAgICBkZXNjcmlwdGlvbixcbiAgICAgIGNyZWF0ZWRQYXRoOiBzZWxlY3RlZERpY3Rpb25hcnkucGF0aCxcbiAgICAgIGFsaWFzZXM6IGFsaWFzZXNTdHIuc3BsaXQoXCJcXG5cIiksXG4gICAgICB0eXBlOiBcImN1c3RvbURpY3Rpb25hcnlcIixcbiAgICB9KTtcbiAgfTtcblxuICBvbk1vdW50KCgpID0+IHtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHdvcmRSZWYuZm9jdXMoKSwgNTApO1xuICB9KTtcbjwvc2NyaXB0PlxuXG48ZGl2PlxuICA8aDI+QWRkIGEgd29yZCB0byBhIGN1c3RvbSBkaWN0aW9uYXJ5PC9oMj5cblxuICA8aDM+RGljdGlvbmFyeTwvaDM+XG4gIDxkaXYgc3R5bGU9XCJkaXNwbGF5OiBmbGV4OyBnYXA6IDEwcHhcIj5cbiAgICA8c2VsZWN0IGJpbmQ6dmFsdWU9e3NlbGVjdGVkRGljdGlvbmFyeX0gY2xhc3M9XCJkcm9wZG93blwiPlxuICAgICAgeyNlYWNoIGRpY3Rpb25hcmllcyBhcyBkaWN0aW9uYXJ5fVxuICAgICAgICA8b3B0aW9uIHZhbHVlPXtkaWN0aW9uYXJ5fT5cbiAgICAgICAgICB7ZGljdGlvbmFyeS5wYXRofVxuICAgICAgICA8L29wdGlvbj5cbiAgICAgIHsvZWFjaH1cbiAgICA8L3NlbGVjdD5cbiAgICA8T2JzaWRpYW5JY29uQnV0dG9uXG4gICAgICBwb3B1cD1cIk9wZW4gdGhlIGZpbGVcIlxuICAgICAgb246Y2xpY2s9eygpID0+IG9uQ2xpY2tGaWxlSWNvbihzZWxlY3RlZERpY3Rpb25hcnkucGF0aCl9XG4gICAgPlxuICAgICAgPEZpbGUgLz5cbiAgICA8L09ic2lkaWFuSWNvbkJ1dHRvbj5cbiAgPC9kaXY+XG5cbiAgPGgzPntmaXJzdFdvcmRUaXRsZX08L2gzPlxuICA8dGV4dGFyZWFcbiAgICBiaW5kOnZhbHVlPXt3b3JkfVxuICAgIHN0eWxlPVwid2lkdGg6IDEwMCU7XCJcbiAgICByb3dzPVwiM1wiXG4gICAgYmluZDp0aGlzPXt3b3JkUmVmfVxuICAvPlxuXG4gIHsjaWYgZW5hYmxlRGlzcGxheWVkV29yZH1cbiAgICA8bGFiZWw+XG4gICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgYmluZDpjaGVja2VkPXt1c2VEaXNwbGF5ZWRXb3JkfSAvPlxuICAgICAgRGlzdGluZ3Vpc2ggYmV0d2VlbiBkaXNwbGF5IGFuZCBpbnNlcnRpb25cbiAgICA8L2xhYmVsPlxuICB7L2lmfVxuXG4gIHsjaWYgdXNlRGlzcGxheWVkV29yZH1cbiAgICA8aDM+RGlzcGxheWVkIFdvcmQ8L2gzPlxuICAgIDx0ZXh0YXJlYVxuICAgICAgYmluZDp2YWx1ZT17ZGlzcGxheWVkV29yZH1cbiAgICAgIHN0eWxlPVwid2lkdGg6IDEwMCU7XCJcbiAgICAgIHJvd3M9XCIzXCJcbiAgICAgIGJpbmQ6dGhpcz17ZGlzcGxheWVkV29yZFJlZn1cbiAgICAvPlxuICB7L2lmfVxuXG4gIDxoMz5EZXNjcmlwdGlvbjwvaDM+XG4gIDxpbnB1dCB0eXBlPVwidGV4dFwiIGJpbmQ6dmFsdWU9e2Rlc2NyaXB0aW9ufSBzdHlsZT1cIndpZHRoOiAxMDAlO1wiIC8+XG5cbiAgPGgzPkFsaWFzZXMgKGZvciBlYWNoIGxpbmUpPC9oMz5cbiAgPHRleHRhcmVhIGJpbmQ6dmFsdWU9e2FsaWFzZXNTdHJ9IHN0eWxlPVwid2lkdGg6IDEwMCU7XCIgcm93cz1cIjNcIiAvPlxuXG4gIDxkaXYgc3R5bGU9XCJ0ZXh0LWFsaWduOiBjZW50ZXI7IHdpZHRoOiAxMDAlOyBwYWRkaW5nLXRvcDogMTVweDtcIj5cbiAgICA8T2JzaWRpYW5CdXR0b24gZGlzYWJsZWQ9eyFlbmFibGVTdWJtaXR9IG9uOmNsaWNrPXtoYW5kbGVTdWJtaXR9XG4gICAgICA+U3VibWl0PC9PYnNpZGlhbkJ1dHRvblxuICAgID5cbiAgPC9kaXY+XG48L2Rpdj5cblxuPHN0eWxlPlxuPC9zdHlsZT5cbiIsImltcG9ydCB7IEFwcCwgTW9kYWwsIE5vdGljZSB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHsgQXBwSGVscGVyIH0gZnJvbSBcIi4uL2FwcC1oZWxwZXJcIjtcbmltcG9ydCB0eXBlIHsgV29yZCB9IGZyb20gXCIuLi9tb2RlbC9Xb3JkXCI7XG5pbXBvcnQgQ3VzdG9tRGljdGlvbmFyeVdvcmRBZGQgZnJvbSBcIi4vY29tcG9uZW50L0N1c3RvbURpY3Rpb25hcnlXb3JkQWRkLnN2ZWx0ZVwiO1xuXG5leHBvcnQgY2xhc3MgQ3VzdG9tRGljdGlvbmFyeVdvcmRBZGRNb2RhbCBleHRlbmRzIE1vZGFsIHtcbiAgY29tcG9uZW50OiBDdXN0b21EaWN0aW9uYXJ5V29yZEFkZDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBhcHA6IEFwcCxcbiAgICBkaWN0aW9uYXJ5UGF0aHM6IHN0cmluZ1tdLFxuICAgIGluaXRpYWxWYWx1ZTogc3RyaW5nID0gXCJcIixcbiAgICBkaXZpZGVyRm9yRGlzcGxheTogc3RyaW5nID0gXCJcIixcbiAgICBvblN1Ym1pdDogKGRpY3Rpb25hcnlQYXRoOiBzdHJpbmcsIHdvcmQ6IFdvcmQpID0+IHZvaWRcbiAgKSB7XG4gICAgc3VwZXIoYXBwKTtcbiAgICBjb25zdCBhcHBIZWxwZXIgPSBuZXcgQXBwSGVscGVyKGFwcCk7XG5cbiAgICBjb25zdCBkaWN0aW9uYXJpZXMgPSBkaWN0aW9uYXJ5UGF0aHMubWFwKCh4KSA9PiAoeyBpZDogeCwgcGF0aDogeCB9KSk7XG5cbiAgICBjb25zdCB7IGNvbnRlbnRFbCB9ID0gdGhpcztcbiAgICB0aGlzLmNvbXBvbmVudCA9IG5ldyBDdXN0b21EaWN0aW9uYXJ5V29yZEFkZCh7XG4gICAgICB0YXJnZXQ6IGNvbnRlbnRFbCxcbiAgICAgIHByb3BzOiB7XG4gICAgICAgIGRpY3Rpb25hcmllcyxcbiAgICAgICAgc2VsZWN0ZWREaWN0aW9uYXJ5OiBkaWN0aW9uYXJpZXNbMF0sXG4gICAgICAgIHdvcmQ6IGluaXRpYWxWYWx1ZSxcbiAgICAgICAgZGl2aWRlckZvckRpc3BsYXksXG4gICAgICAgIG9uU3VibWl0OiBvblN1Ym1pdCxcbiAgICAgICAgb25DbGlja0ZpbGVJY29uOiAoZGljdGlvbmFyeVBhdGg6IHN0cmluZykgPT4ge1xuICAgICAgICAgIGNvbnN0IG1hcmtkb3duRmlsZSA9IGFwcEhlbHBlci5nZXRNYXJrZG93bkZpbGVCeVBhdGgoZGljdGlvbmFyeVBhdGgpO1xuICAgICAgICAgIGlmICghbWFya2Rvd25GaWxlKSB7XG4gICAgICAgICAgICAvLyBub2luc3BlY3Rpb24gT2JqZWN0QWxsb2NhdGlvbklnbm9yZWRcbiAgICAgICAgICAgIG5ldyBOb3RpY2UoYENhbid0IG9wZW4gJHtkaWN0aW9uYXJ5UGF0aH1gKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICAgICAgYXBwSGVscGVyLm9wZW5NYXJrZG93bkZpbGUobWFya2Rvd25GaWxlLCB0cnVlKTtcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICBvbkNsb3NlKCkge1xuICAgIHN1cGVyLm9uQ2xvc2UoKTtcbiAgICB0aGlzLmNvbXBvbmVudC4kZGVzdHJveSgpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBkZWJvdW5jZSwgTm90aWNlLCBQbHVnaW4gfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB7IEF1dG9Db21wbGV0ZVN1Z2dlc3QgfSBmcm9tIFwiLi91aS9BdXRvQ29tcGxldGVTdWdnZXN0XCI7XG5pbXBvcnQge1xuICBERUZBVUxUX1NFVFRJTkdTLFxuICB0eXBlIFNldHRpbmdzLFxuICBWYXJpb3VzQ29tcGxlbWVudHNTZXR0aW5nVGFiLFxufSBmcm9tIFwiLi9zZXR0aW5nL3NldHRpbmdzXCI7XG5pbXBvcnQgeyBBcHBIZWxwZXIgfSBmcm9tIFwiLi9hcHAtaGVscGVyXCI7XG5pbXBvcnQgeyBQcm92aWRlclN0YXR1c0JhciB9IGZyb20gXCIuL3VpL1Byb3ZpZGVyU3RhdHVzQmFyXCI7XG5pbXBvcnQgeyBDdXN0b21EaWN0aW9uYXJ5V29yZEFkZE1vZGFsIH0gZnJvbSBcIi4vdWkvQ3VzdG9tRGljdGlvbmFyeVdvcmRBZGRNb2RhbFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBWYXJpb3VzQ29tcG9uZW50cyBleHRlbmRzIFBsdWdpbiB7XG4gIGFwcEhlbHBlcjogQXBwSGVscGVyO1xuICBzZXR0aW5nczogU2V0dGluZ3M7XG4gIHNldHRpbmdUYWI6IFZhcmlvdXNDb21wbGVtZW50c1NldHRpbmdUYWI7XG4gIHN1Z2dlc3RlcjogQXV0b0NvbXBsZXRlU3VnZ2VzdDtcbiAgc3RhdHVzQmFyPzogUHJvdmlkZXJTdGF0dXNCYXI7XG5cbiAgb251bmxvYWQoKSB7XG4gICAgc3VwZXIub251bmxvYWQoKTtcbiAgICB0aGlzLnN1Z2dlc3Rlci51bnJlZ2lzdGVyKCk7XG4gIH1cblxuICBhc3luYyBvbmxvYWQoKSB7XG4gICAgdGhpcy5hcHBIZWxwZXIgPSBuZXcgQXBwSGVscGVyKHRoaXMuYXBwKTtcblxuICAgIHRoaXMucmVnaXN0ZXJFdmVudChcbiAgICAgIHRoaXMuYXBwLndvcmtzcGFjZS5vbihcImVkaXRvci1tZW51XCIsIChtZW51KSA9PiB7XG4gICAgICAgIGlmICghdGhpcy5hcHBIZWxwZXIuZ2V0U2VsZWN0aW9uKCkpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBtZW51LmFkZEl0ZW0oKGl0ZW0pID0+XG4gICAgICAgICAgaXRlbVxuICAgICAgICAgICAgLnNldFRpdGxlKFwiQWRkIHRvIGN1c3RvbSBkaWN0aW9uYXJ5XCIpXG4gICAgICAgICAgICAuc2V0SWNvbihcInN0YWNrZWQtbGV2ZWxzXCIpXG4gICAgICAgICAgICAub25DbGljaygoKSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMuYWRkV29yZFRvQ3VzdG9tRGljdGlvbmFyeSgpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgKTtcbiAgICAgIH0pXG4gICAgKTtcblxuICAgIGF3YWl0IHRoaXMubG9hZFNldHRpbmdzKCk7XG5cbiAgICB0aGlzLnNldHRpbmdUYWIgPSBuZXcgVmFyaW91c0NvbXBsZW1lbnRzU2V0dGluZ1RhYih0aGlzLmFwcCwgdGhpcyk7XG4gICAgdGhpcy5hZGRTZXR0aW5nVGFiKHRoaXMuc2V0dGluZ1RhYik7XG5cbiAgICB0aGlzLnN0YXR1c0JhciA9IFByb3ZpZGVyU3RhdHVzQmFyLm5ldyhcbiAgICAgIHRoaXMuYWRkU3RhdHVzQmFySXRlbSgpLFxuICAgICAgdGhpcy5zZXR0aW5ncy5zaG93TWF0Y2hTdHJhdGVneSxcbiAgICAgIHRoaXMuc2V0dGluZ3Muc2hvd0luZGV4aW5nU3RhdHVzXG4gICAgKTtcbiAgICB0aGlzLnN0YXR1c0Jhci5zZXRPbkNsaWNrU3RyYXRlZ3lMaXN0ZW5lcihhc3luYyAoKSA9PiB7XG4gICAgICBhd2FpdCB0aGlzLnNldHRpbmdUYWIudG9nZ2xlTWF0Y2hTdHJhdGVneSgpO1xuICAgIH0pO1xuXG4gICAgY29uc3QgZGVib3VuY2VkU2F2ZURhdGEgPSBkZWJvdW5jZShhc3luYyAoKSA9PiB7XG4gICAgICBhd2FpdCB0aGlzLnNhdmVEYXRhKHRoaXMuc2V0dGluZ3MpO1xuICAgIH0sIDUwMDApO1xuXG4gICAgdGhpcy5zdWdnZXN0ZXIgPSBhd2FpdCBBdXRvQ29tcGxldGVTdWdnZXN0Lm5ldyhcbiAgICAgIHRoaXMuYXBwLFxuICAgICAgdGhpcy5zZXR0aW5ncyxcbiAgICAgIHRoaXMuc3RhdHVzQmFyLFxuICAgICAgZGVib3VuY2VkU2F2ZURhdGFcbiAgICApO1xuICAgIHRoaXMucmVnaXN0ZXJFZGl0b3JTdWdnZXN0KHRoaXMuc3VnZ2VzdGVyKTtcblxuICAgIHRoaXMuYWRkQ29tbWFuZCh7XG4gICAgICBpZDogXCJyZWxvYWQtY3VzdG9tLWRpY3Rpb25hcmllc1wiLFxuICAgICAgbmFtZTogXCJSZWxvYWQgY3VzdG9tIGRpY3Rpb25hcmllc1wiLFxuICAgICAgaG90a2V5czogW3sgbW9kaWZpZXJzOiBbXCJNb2RcIiwgXCJTaGlmdFwiXSwga2V5OiBcInJcIiB9XSxcbiAgICAgIGNhbGxiYWNrOiBhc3luYyAoKSA9PiB7XG4gICAgICAgIGF3YWl0IHRoaXMuc3VnZ2VzdGVyLnJlZnJlc2hDdXN0b21EaWN0aW9uYXJ5VG9rZW5zKCk7XG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgdGhpcy5hZGRDb21tYW5kKHtcbiAgICAgIGlkOiBcInJlbG9hZC1jdXJyZW50LXZhdWx0XCIsXG4gICAgICBuYW1lOiBcIlJlbG9hZCBjdXJyZW50IHZhdWx0XCIsXG4gICAgICBjYWxsYmFjazogYXN5bmMgKCkgPT4ge1xuICAgICAgICBhd2FpdCB0aGlzLnN1Z2dlc3Rlci5yZWZyZXNoQ3VycmVudFZhdWx0VG9rZW5zKCk7XG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgdGhpcy5hZGRDb21tYW5kKHtcbiAgICAgIGlkOiBcInRvZ2dsZS1tYXRjaC1zdHJhdGVneVwiLFxuICAgICAgbmFtZTogXCJUb2dnbGUgTWF0Y2ggc3RyYXRlZ3lcIixcbiAgICAgIGNhbGxiYWNrOiBhc3luYyAoKSA9PiB7XG4gICAgICAgIGF3YWl0IHRoaXMuc2V0dGluZ1RhYi50b2dnbGVNYXRjaFN0cmF0ZWd5KCk7XG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgdGhpcy5hZGRDb21tYW5kKHtcbiAgICAgIGlkOiBcInRvZ2dsZS1jb21wbGVtZW50LWF1dG9tYXRpY2FsbHlcIixcbiAgICAgIG5hbWU6IFwiVG9nZ2xlIENvbXBsZW1lbnQgYXV0b21hdGljYWxseVwiLFxuICAgICAgY2FsbGJhY2s6IGFzeW5jICgpID0+IHtcbiAgICAgICAgYXdhaXQgdGhpcy5zZXR0aW5nVGFiLnRvZ2dsZUNvbXBsZW1lbnRBdXRvbWF0aWNhbGx5KCk7XG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgdGhpcy5hZGRDb21tYW5kKHtcbiAgICAgIGlkOiBcInNob3ctc3VnZ2VzdGlvbnNcIixcbiAgICAgIG5hbWU6IFwiU2hvdyBzdWdnZXN0aW9uc1wiLFxuICAgICAgaG90a2V5czogW3sgbW9kaWZpZXJzOiBbXCJNb2RcIl0sIGtleTogXCIgXCIgfV0sXG4gICAgICBjYWxsYmFjazogYXN5bmMgKCkgPT4ge1xuICAgICAgICB0aGlzLnN1Z2dlc3Rlci50cmlnZ2VyQ29tcGxldGUoKTtcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICB0aGlzLmFkZENvbW1hbmQoe1xuICAgICAgaWQ6IFwiYWRkLXdvcmQtY3VzdG9tLWRpY3Rpb25hcnlcIixcbiAgICAgIG5hbWU6IFwiQWRkIGEgd29yZCB0byBhIGN1c3RvbSBkaWN0aW9uYXJ5XCIsXG4gICAgICBob3RrZXlzOiBbeyBtb2RpZmllcnM6IFtcIk1vZFwiLCBcIlNoaWZ0XCJdLCBrZXk6IFwiIFwiIH1dLFxuICAgICAgY2FsbGJhY2s6IGFzeW5jICgpID0+IHtcbiAgICAgICAgdGhpcy5hZGRXb3JkVG9DdXN0b21EaWN0aW9uYXJ5KCk7XG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgdGhpcy5hZGRDb21tYW5kKHtcbiAgICAgIGlkOiBcInByZWRpY3RhYmxlLWNvbXBsZW1lbnRzXCIsXG4gICAgICBuYW1lOiBcIlByZWRpY3RhYmxlIGNvbXBsZW1lbnRcIixcbiAgICAgIGNhbGxiYWNrOiBhc3luYyAoKSA9PiB7XG4gICAgICAgIHRoaXMuc3VnZ2VzdGVyLnByZWRpY3RhYmxlQ29tcGxldGUoKTtcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICB0aGlzLmFkZENvbW1hbmQoe1xuICAgICAgaWQ6IFwiY29weS1wbHVnaW4tc2V0dGluZ3NcIixcbiAgICAgIG5hbWU6IFwiQ29weSBwbHVnaW4gc2V0dGluZ3NcIixcbiAgICAgIGNhbGxiYWNrOiBhc3luYyAoKSA9PiB7XG4gICAgICAgIGF3YWl0IG5hdmlnYXRvci5jbGlwYm9hcmQud3JpdGVUZXh0KFxuICAgICAgICAgIHRoaXMuc2V0dGluZ1RhYi5nZXRQbHVnaW5TZXR0aW5nc0FzSnNvblN0cmluZygpXG4gICAgICAgICk7XG4gICAgICAgIC8vIG5vaW5zcGVjdGlvbiBPYmplY3RBbGxvY2F0aW9uSWdub3JlZFxuICAgICAgICBuZXcgTm90aWNlKFwiQ29weSBzZXR0aW5ncyBvZiBWYXJpb3VzIENvbXBsZW1lbnRzXCIpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIGxvYWRTZXR0aW5ncygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0aGlzLnNldHRpbmdzID0geyAuLi5ERUZBVUxUX1NFVFRJTkdTLCAuLi4oYXdhaXQgdGhpcy5sb2FkRGF0YSgpKSB9O1xuICB9XG5cbiAgYXN5bmMgc2F2ZVNldHRpbmdzKFxuICAgIG5lZWRVcGRhdGVUb2tlbnM6IHtcbiAgICAgIGN1cnJlbnRGaWxlPzogYm9vbGVhbjtcbiAgICAgIGN1cnJlbnRWYXVsdD86IGJvb2xlYW47XG4gICAgICBjdXN0b21EaWN0aW9uYXJ5PzogYm9vbGVhbjtcbiAgICAgIGludGVybmFsTGluaz86IGJvb2xlYW47XG4gICAgICBmcm9udE1hdHRlcj86IGJvb2xlYW47XG4gICAgfSA9IHt9XG4gICk6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IHRoaXMuc2F2ZURhdGEodGhpcy5zZXR0aW5ncyk7XG4gICAgYXdhaXQgdGhpcy5zdWdnZXN0ZXIudXBkYXRlU2V0dGluZ3ModGhpcy5zZXR0aW5ncyk7XG4gICAgaWYgKG5lZWRVcGRhdGVUb2tlbnMuY3VycmVudEZpbGUpIHtcbiAgICAgIGF3YWl0IHRoaXMuc3VnZ2VzdGVyLnJlZnJlc2hDdXJyZW50RmlsZVRva2VucygpO1xuICAgIH1cbiAgICBpZiAobmVlZFVwZGF0ZVRva2Vucy5jdXJyZW50VmF1bHQpIHtcbiAgICAgIGF3YWl0IHRoaXMuc3VnZ2VzdGVyLnJlZnJlc2hDdXJyZW50VmF1bHRUb2tlbnMoKTtcbiAgICB9XG4gICAgaWYgKG5lZWRVcGRhdGVUb2tlbnMuY3VzdG9tRGljdGlvbmFyeSkge1xuICAgICAgYXdhaXQgdGhpcy5zdWdnZXN0ZXIucmVmcmVzaEN1c3RvbURpY3Rpb25hcnlUb2tlbnMoKTtcbiAgICB9XG4gICAgaWYgKG5lZWRVcGRhdGVUb2tlbnMuaW50ZXJuYWxMaW5rKSB7XG4gICAgICBhd2FpdCB0aGlzLnN1Z2dlc3Rlci5yZWZyZXNoSW50ZXJuYWxMaW5rVG9rZW5zKCk7XG4gICAgfVxuICAgIGlmIChuZWVkVXBkYXRlVG9rZW5zLmZyb250TWF0dGVyKSB7XG4gICAgICBhd2FpdCB0aGlzLnN1Z2dlc3Rlci5yZWZyZXNoRnJvbnRNYXR0ZXJUb2tlbnMoKTtcbiAgICB9XG4gIH1cblxuICBhZGRXb3JkVG9DdXN0b21EaWN0aW9uYXJ5KCkge1xuICAgIGNvbnN0IHNlbGVjdGVkV29yZCA9IHRoaXMuYXBwSGVscGVyLmdldFNlbGVjdGlvbigpO1xuICAgIGNvbnN0IHByb3ZpZGVyID0gdGhpcy5zdWdnZXN0ZXIuY3VzdG9tRGljdGlvbmFyeVdvcmRQcm92aWRlcjtcbiAgICBjb25zdCBtb2RhbCA9IG5ldyBDdXN0b21EaWN0aW9uYXJ5V29yZEFkZE1vZGFsKFxuICAgICAgdGhpcy5hcHAsXG4gICAgICBwcm92aWRlci5lZGl0YWJsZVBhdGhzLFxuICAgICAgc2VsZWN0ZWRXb3JkLFxuICAgICAgdGhpcy5zZXR0aW5ncy5kZWxpbWl0ZXJUb0RpdmlkZVN1Z2dlc3Rpb25zRm9yRGlzcGxheUZyb21JbnNlcnRpb24sXG4gICAgICBhc3luYyAoZGljdGlvbmFyeVBhdGgsIHdvcmQpID0+IHtcbiAgICAgICAgaWYgKHByb3ZpZGVyLndvcmRCeVZhbHVlW3dvcmQudmFsdWVdKSB7XG4gICAgICAgICAgLy8gbm9pbnNwZWN0aW9uIE9iamVjdEFsbG9jYXRpb25JZ25vcmVkXG4gICAgICAgICAgbmV3IE5vdGljZShg4pqgICR7d29yZC52YWx1ZX0gYWxyZWFkeSBleGlzdHNgLCAwKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBhd2FpdCBwcm92aWRlci5hZGRXb3JkV2l0aERpY3Rpb25hcnkod29yZCwgZGljdGlvbmFyeVBhdGgpO1xuICAgICAgICAvLyBub2luc3BlY3Rpb24gT2JqZWN0QWxsb2NhdGlvbklnbm9yZWRcbiAgICAgICAgbmV3IE5vdGljZShgQWRkZWQgJHt3b3JkLnZhbHVlfWApO1xuICAgICAgICBtb2RhbC5jbG9zZSgpO1xuICAgICAgfVxuICAgICk7XG5cbiAgICBtb2RhbC5vcGVuKCk7XG4gIH1cbn1cbiJdLCJuYW1lcyI6WyJwYXJzZUZyb250TWF0dGVyQWxpYXNlcyIsInBhcnNlRnJvbnRNYXR0ZXJUYWdzIiwicGFyc2VGcm9udE1hdHRlclN0cmluZ0FycmF5IiwiTWFya2Rvd25WaWV3Iiwibm9ybWFsaXplUGF0aCIsInN5bm9ueW1BbGlhc2VzIiwicmVxdWVzdCIsIk5vdGljZSIsIkVkaXRvclN1Z2dlc3QiLCJkZWJvdW5jZSIsIlBsdWdpblNldHRpbmdUYWIiLCJTZXR0aW5nIiwiTW9kYWwiLCJQbHVnaW4iXSwibWFwcGluZ3MiOiI7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBNEJBO0FBQ08sU0FBUyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUM3QixJQUFJLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUNmLElBQUksS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztBQUN2RixRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDcEIsSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksT0FBTyxNQUFNLENBQUMscUJBQXFCLEtBQUssVUFBVTtBQUN2RSxRQUFRLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDaEYsWUFBWSxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDMUYsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxD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QUFHO0tBQ2hCLENBQUM7QUFDRixJQUFBLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO0FBQ3BCLElBQUEsS0FBSyxJQUFJLENBQUMsSUFBSSxRQUFRLEVBQUU7QUFDdEIsUUFBQSxJQUFJLE1BQU0sR0FBRyxJQUFJLE1BQU0sRUFBRSxDQUFDO0FBQzFCLFFBQUEsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNsQixRQUFBLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDNUMsS0FBQTtBQUVELElBQUEsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUNuQixJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDckQsSUFBSSxDQUFDLEtBQUssR0FBRztRQUNYLEVBQUUsRUFBRSxDQUFDLElBQUk7QUFDVCxRQUFBLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLENBQUMsR0FBRztRQUNSLEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxJQUFJO0FBQ1QsUUFBQSxFQUFFLEVBQUUsSUFBSTtBQUNSLFFBQUEsRUFBRSxFQUFFLElBQUk7QUFDUixRQUFBLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLElBQUk7QUFDVCxRQUFBLEVBQUUsRUFBRSxJQUFJO0FBQ1IsUUFBQSxFQUFFLEVBQUUsSUFBSTtBQUNSLFFBQUEsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsSUFBSTtBQUNULFFBQUEsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsQ0FBQyxJQUFJO0tBQ1YsQ0FBQztJQUNGLElBQUksQ0FBQyxLQUFLLEdBQUc7QUFDWCxRQUFBLEVBQUUsRUFBRSxHQUFHO0FBQ1AsUUFBQSxFQUFFLEVBQUUsR0FBRztRQUNQLEVBQUUsRUFBRSxDQUFDLEdBQUc7UUFDUixFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsR0FBRztRQUNSLEVBQUUsRUFBRSxDQUFDLEdBQUc7QUFDUixRQUFBLEVBQUUsRUFBRSxJQUFJO0FBQ1IsUUFBQSxFQUFFLEVBQUUsSUFBSTtBQUNSLFFBQUEsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsQ0FBQyxJQUFJO0FBQ1QsUUFBQSxFQUFFLEVBQUUsR0FBRztLQUNSLENBQUM7SUFDRixJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUM7QUFDckQsSUFBQSxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNuQyxJQUFJLENBQUMsS0FBSyxHQUFHO0FBQ1gsUUFBQSxHQUFHLEVBQUUsSUFBSTtBQUNULFFBQUEsR0FBRyxFQUFFLElBQUk7UUFDVCxHQUFHLEVBQUUsQ0FBQyxJQUFJO0FBQ1YsUUFBQSxHQUFHLEVBQUUsR0FBRztBQUNSLFFBQUEsR0FBRyxFQUFFLElBQUk7QUFDVCxRQUFBLEdBQUcsRUFBRSxHQUFHO1FBQ1IsR0FBRyxFQUFFLENBQUMsRUFBRTtRQUNSLEdBQUcsRUFBRSxDQUFDLElBQUk7QUFDVixRQUFBLEdBQUcsRUFBRSxHQUFHO1FBQ1IsR0FBRyxFQUFFLENBQUMsR0FBRztBQUNULFFBQUEsR0FBRyxFQUFFLElBQUk7UUFDVCxHQUFHLEVBQUUsQ0FBQyxJQUFJO0FBQ1YsUUFBQSxHQUFHLEVBQUUsR0FBRztBQUNSLFFBQUEsR0FBRyxFQUFFLElBQUk7S0FDVixDQUFDO0lBQ0YsSUFBSSxDQUFDLEtBQUssR0FBRztBQUNYLFFBQUEsR0FBRyxFQUFFLEdBQUc7UUFDUixHQUFHLEVBQUUsQ0FBQyxJQUFJO0FBQ1YsUUFBQSxHQUFHLEVBQUUsR0FBRztRQUNSLEdBQUcsRUFBRSxDQUFDLEdBQUc7UUFDVCxHQUFHLEVBQUUsQ0FBQyxJQUFJO0FBQ1YsUUFBQSxHQUFHLEVBQUUsR0FBRztRQUNSLEdBQUcsRUFBRSxDQUFDLElBQUk7UUFDVixHQUFHLEVBQUUsQ0FBQyxHQUFHO0FBQ1QsUUFBQSxHQUFHLEVBQUUsR0FBRztRQUNSLEdBQUcsRUFBRSxDQUFDLElBQUk7S0FDWCxDQUFDO0lBQ0YsSUFBSSxDQUFDLEtBQUssR0FBRztRQUNYLEdBQUcsRUFBRSxDQUFDLEdBQUc7QUFDVCxRQUFBLEdBQUcsRUFBRSxJQUFJO1FBQ1QsR0FBRyxFQUFFLENBQUMsR0FBRztBQUNULFFBQUEsR0FBRyxFQUFFLEdBQUc7QUFDUixRQUFBLEdBQUcsRUFBRSxHQUFHO0FBQ1IsUUFBQSxHQUFHLEVBQUUsSUFBSTtBQUNULFFBQUEsR0FBRyxFQUFFLEdBQUc7QUFDUixRQUFBLEdBQUcsRUFBRSxHQUFHO0FBQ1IsUUFBQSxHQUFHLEVBQUUsSUFBSTtBQUNULFFBQUEsR0FBRyxFQUFFLEdBQUc7QUFDUixRQUFBLEdBQUcsRUFBRSxHQUFHO0FBQ1IsUUFBQSxHQUFHLEVBQUUsSUFBSTtRQUNULEdBQUcsRUFBRSxDQUFDLEdBQUc7UUFDVCxHQUFHLEVBQUUsQ0FBQyxJQUFJO1FBQ1YsR0FBRyxFQUFFLENBQUMsSUFBSTtBQUNWLFFBQUEsR0FBRyxFQUFFLEtBQUs7S0FDWCxDQUFDO0lBQ0YsSUFBSSxDQUFDLEtBQUssR0FBRztRQUNYLEdBQUcsRUFBRSxDQUFDLElBQUk7QUFDVixRQUFBLEdBQUcsRUFBRSxJQUFJO1FBQ1QsR0FBRyxFQUFFLENBQUMsSUFBSTtBQUNWLFFBQUEsR0FBRyxFQUFFLElBQUk7UUFDVCxHQUFHLEVBQUUsQ0FBQyxJQUFJO1FBQ1YsR0FBRyxFQUFFLENBQUMsSUFBSTtRQUNWLEdBQUcsRUFBRSxDQUFDLEtBQUs7QUFDWCxRQUFBLEdBQUcsRUFBRSxHQUFHO0FBQ1IsUUFBQSxHQUFHLEVBQUUsR0FBRztRQUNSLEdBQUcsRUFBRSxDQUFDLElBQUk7UUFDVixHQUFHLEVBQUUsQ0FBQyxHQUFHO0tBQ1YsQ0FBQztJQUNGLElBQUksQ0FBQyxLQUFLLEdBQUc7QUFDWCxRQUFBLElBQUksRUFBRSxHQUFHO0FBQ1QsUUFBQSxJQUFJLEVBQUUsR0FBRztBQUNULFFBQUEsR0FBRyxFQUFFLElBQUk7QUFDVCxRQUFBLEdBQUcsRUFBRSxHQUFHO0FBQ1IsUUFBQSxJQUFJLEVBQUUsR0FBRztBQUNULFFBQUEsSUFBSSxFQUFFLEdBQUc7QUFDVCxRQUFBLElBQUksRUFBRSxJQUFJO0FBQ1YsUUFBQSxFQUFFLEVBQUUsSUFBSTtBQUNSLFFBQUEsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsQ0FBQyxJQUFJO0FBQ1QsUUFBQSxFQUFFLEVBQUUsR0FBRztRQUNQLEVBQUUsRUFBRSxDQUFDLElBQUk7QUFDVCxRQUFBLEVBQUUsRUFBRSxHQUFHO0FBQ1AsUUFBQSxFQUFFLEVBQUUsSUFBSTtBQUNSLFFBQUEsRUFBRSxFQUFFLEdBQUc7UUFDUCxFQUFFLEVBQUUsQ0FBQyxHQUFHO0FBQ1IsUUFBQSxFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxJQUFJO0FBQ1QsUUFBQSxFQUFFLEVBQUUsSUFBSTtBQUNSLFFBQUEsRUFBRSxFQUFFLElBQUk7QUFDUixRQUFBLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLENBQUMsSUFBSTtBQUNULFFBQUEsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsQ0FBQyxHQUFHO0FBQ1IsUUFBQSxFQUFFLEVBQUUsSUFBSTtBQUNSLFFBQUEsRUFBRSxFQUFFLEdBQUc7QUFDUCxRQUFBLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLENBQUMsR0FBRztBQUNSLFFBQUEsRUFBRSxFQUFFLEdBQUc7QUFDUCxRQUFBLEVBQUUsRUFBRSxJQUFJO0FBQ1IsUUFBQSxFQUFFLEVBQUUsSUFBSTtBQUNSLFFBQUEsRUFBRSxFQUFFLElBQUk7QUFDUixRQUFBLEVBQUUsRUFBRSxHQUFHO1FBQ1AsRUFBRSxFQUFFLENBQUMsSUFBSTtBQUNULFFBQUEsRUFBRSxFQUFFLElBQUk7QUFDUixRQUFBLEVBQUUsRUFBRSxJQUFJO0FBQ1IsUUFBQSxFQUFFLEVBQUUsSUFBSTtBQUNSLFFBQUEsRUFBRSxFQUFFLElBQUk7QUFDUixRQUFBLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLENBQUMsSUFBSTtBQUNULFFBQUEsRUFBRSxFQUFFLElBQUk7QUFDUixRQUFBLEVBQUUsRUFBRSxJQUFJO0FBQ1IsUUFBQSxFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxDQUFDLEdBQUc7UUFDUixFQUFFLEVBQUUsQ0FBQyxHQUFHO0FBQ1IsUUFBQSxFQUFFLEVBQUUsR0FBRztBQUNQLFFBQUEsRUFBRSxFQUFFLElBQUk7QUFDUixRQUFBLEVBQUUsRUFBRSxJQUFJO0FBQ1IsUUFBQSxFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsSUFBSTtBQUNULFFBQUEsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsQ0FBQyxHQUFHO0FBQ1IsUUFBQSxFQUFFLEVBQUUsSUFBSTtBQUNSLFFBQUEsRUFBRSxFQUFFLEdBQUc7UUFDUCxFQUFFLEVBQUUsQ0FBQyxJQUFJO0FBQ1QsUUFBQSxFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxJQUFJO0FBQ1QsUUFBQSxFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsR0FBRztRQUNSLEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsR0FBRztBQUNSLFFBQUEsR0FBRyxFQUFFLElBQUk7QUFDVCxRQUFBLEdBQUcsRUFBRSxHQUFHO0FBQ1IsUUFBQSxJQUFJLEVBQUUsSUFBSTtLQUNYLENBQUM7SUFDRixJQUFJLENBQUMsS0FBSyxHQUFHO1FBQ1gsSUFBSSxFQUFFLENBQUMsS0FBSztRQUNaLEVBQUUsRUFBRSxDQUFDLEdBQUc7UUFDUixJQUFJLEVBQUUsQ0FBQyxJQUFJO1FBQ1gsSUFBSSxFQUFFLENBQUMsS0FBSztRQUNaLEVBQUUsRUFBRSxDQUFDLElBQUk7QUFDVCxRQUFBLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLEdBQUc7UUFDUixFQUFFLEVBQUUsQ0FBQyxJQUFJO0FBQ1QsUUFBQSxFQUFFLEVBQUUsSUFBSTtBQUNSLFFBQUEsRUFBRSxFQUFFLEdBQUc7UUFDUCxFQUFFLEVBQUUsQ0FBQyxJQUFJO0FBQ1QsUUFBQSxFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsSUFBSTtBQUNULFFBQUEsRUFBRSxFQUFFLElBQUk7QUFDUixRQUFBLEVBQUUsRUFBRSxLQUFLO1FBQ1QsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxHQUFHO0FBQ1IsUUFBQSxFQUFFLEVBQUUsSUFBSTtBQUNSLFFBQUEsRUFBRSxFQUFFLEdBQUc7QUFDUCxRQUFBLEVBQUUsRUFBRSxHQUFHO1FBQ1AsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxHQUFHO1FBQ1IsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLEdBQUc7QUFDUixRQUFBLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLENBQUMsR0FBRztBQUNSLFFBQUEsRUFBRSxFQUFFLElBQUk7QUFDUixRQUFBLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLENBQUMsSUFBSTtBQUNULFFBQUEsRUFBRSxFQUFFLElBQUk7QUFDUixRQUFBLEVBQUUsRUFBRSxJQUFJO0FBQ1IsUUFBQSxFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxJQUFJO0FBQ1QsUUFBQSxFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLElBQUk7QUFDVCxRQUFBLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLElBQUk7QUFDVCxRQUFBLEVBQUUsRUFBRSxHQUFHO0FBQ1AsUUFBQSxFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLElBQUk7QUFDVCxRQUFBLEVBQUUsRUFBRSxJQUFJO0FBQ1IsUUFBQSxFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxDQUFDLElBQUk7QUFDVCxRQUFBLEVBQUUsRUFBRSxJQUFJO0FBQ1IsUUFBQSxFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxLQUFLO1FBQ1YsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLEtBQUs7QUFDVixRQUFBLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxJQUFJO0FBQ1QsUUFBQSxFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxJQUFJO0FBQ1QsUUFBQSxFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxJQUFJO0FBQ1QsUUFBQSxFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxDQUFDLElBQUk7QUFDVCxRQUFBLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLENBQUMsS0FBSztRQUNWLEVBQUUsRUFBRSxDQUFDLEdBQUc7UUFDUixFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsSUFBSTtBQUNULFFBQUEsRUFBRSxFQUFFLEdBQUc7QUFDUCxRQUFBLEVBQUUsRUFBRSxJQUFJO0FBQ1IsUUFBQSxFQUFFLEVBQUUsSUFBSTtBQUNSLFFBQUEsRUFBRSxFQUFFLEdBQUc7QUFDUCxRQUFBLEVBQUUsRUFBRSxJQUFJO0FBQ1IsUUFBQSxFQUFFLEVBQUUsSUFBSTtBQUNSLFFBQUEsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsQ0FBQyxLQUFLO0FBQ1YsUUFBQSxFQUFFLEVBQUUsR0FBRztRQUNQLEVBQUUsRUFBRSxDQUFDLElBQUk7QUFDVCxRQUFBLEVBQUUsRUFBRSxHQUFHO1FBQ1AsRUFBRSxFQUFFLENBQUMsSUFBSTtBQUNULFFBQUEsRUFBRSxFQUFFLEdBQUc7UUFDUCxFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLElBQUk7QUFDVCxRQUFBLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLENBQUMsSUFBSTtBQUNULFFBQUEsRUFBRSxFQUFFLEdBQUc7UUFDUCxFQUFFLEVBQUUsQ0FBQyxHQUFHO1FBQ1IsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxHQUFHO1FBQ1IsRUFBRSxFQUFFLENBQUMsSUFBSTtBQUNULFFBQUEsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsQ0FBQyxHQUFHO1FBQ1IsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxHQUFHO1FBQ1IsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxJQUFJLEVBQUUsQ0FBQyxHQUFHO0tBQ1gsQ0FBQztJQUNGLElBQUksQ0FBQyxLQUFLLEdBQUc7UUFDWCxFQUFFLEVBQUUsQ0FBQyxJQUFJO0FBQ1QsUUFBQSxFQUFFLEVBQUUsR0FBRztBQUNQLFFBQUEsRUFBRSxFQUFFLElBQUk7UUFDUixJQUFJLEVBQUUsQ0FBQyxJQUFJO1FBQ1gsSUFBSSxFQUFFLENBQUMsSUFBSTtBQUNYLFFBQUEsRUFBRSxFQUFFLElBQUk7QUFDUixRQUFBLEVBQUUsRUFBRSxJQUFJO0FBQ1IsUUFBQSxFQUFFLEVBQUUsSUFBSTtBQUNSLFFBQUEsRUFBRSxFQUFFLElBQUk7QUFDUixRQUFBLEVBQUUsRUFBRSxJQUFJO0FBQ1IsUUFBQSxFQUFFLEVBQUUsSUFBSTtBQUNSLFFBQUEsRUFBRSxFQUFFLElBQUk7QUFDUixRQUFBLEVBQUUsRUFBRSxJQUFJO0FBQ1IsUUFBQSxFQUFFLEVBQUUsSUFBSTtBQUNSLFFBQUEsRUFBRSxFQUFFLElBQUk7QUFDUixRQUFBLElBQUksRUFBRSxJQUFJO0FBQ1YsUUFBQSxJQUFJLEVBQUUsSUFBSTtRQUNWLEVBQUUsRUFBRSxDQUFDLEdBQUc7UUFDUixFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsR0FBRztBQUNSLFFBQUEsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsQ0FBQyxJQUFJO0FBQ1QsUUFBQSxJQUFJLEVBQUUsSUFBSTtBQUNWLFFBQUEsSUFBSSxFQUFFLElBQUk7UUFDVixFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLEdBQUc7UUFDUixFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsSUFBSTtBQUNULFFBQUEsRUFBRSxFQUFFLElBQUk7QUFDUixRQUFBLEVBQUUsRUFBRSxJQUFJO0FBQ1IsUUFBQSxFQUFFLEVBQUUsSUFBSTtBQUNSLFFBQUEsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsR0FBRztBQUNSLFFBQUEsRUFBRSxFQUFFLEdBQUc7QUFDUCxRQUFBLElBQUksRUFBRSxJQUFJO0FBQ1YsUUFBQSxJQUFJLEVBQUUsSUFBSTtRQUNWLEVBQUUsRUFBRSxDQUFDLElBQUk7QUFDVCxRQUFBLEVBQUUsRUFBRSxJQUFJO0FBQ1IsUUFBQSxFQUFFLEVBQUUsSUFBSTtBQUNSLFFBQUEsRUFBRSxFQUFFLElBQUk7QUFDUixRQUFBLEVBQUUsRUFBRSxJQUFJO1FBQ1IsSUFBSSxFQUFFLENBQUMsSUFBSTtRQUNYLElBQUksRUFBRSxDQUFDLElBQUk7QUFDWCxRQUFBLEVBQUUsRUFBRSxJQUFJO0FBQ1IsUUFBQSxJQUFJLEVBQUUsSUFBSTtBQUNWLFFBQUEsSUFBSSxFQUFFLElBQUk7QUFDVixRQUFBLEVBQUUsRUFBRSxHQUFHO0FBQ1AsUUFBQSxFQUFFLEVBQUUsR0FBRztBQUNQLFFBQUEsSUFBSSxFQUFFLElBQUk7QUFDVixRQUFBLElBQUksRUFBRSxJQUFJO1FBQ1YsRUFBRSxFQUFFLENBQUMsR0FBRztBQUNSLFFBQUEsRUFBRSxFQUFFLEdBQUc7UUFDUCxFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsR0FBRztBQUNSLFFBQUEsSUFBSSxFQUFFLElBQUk7QUFDVixRQUFBLElBQUksRUFBRSxJQUFJO0FBQ1YsUUFBQSxFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxDQUFDLElBQUk7QUFDVCxRQUFBLEVBQUUsRUFBRSxHQUFHO0FBQ1AsUUFBQSxFQUFFLEVBQUUsSUFBSTtBQUNSLFFBQUEsRUFBRSxFQUFFLEdBQUc7QUFDUCxRQUFBLEVBQUUsRUFBRSxHQUFHO0FBQ1AsUUFBQSxFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxDQUFDLElBQUk7QUFDVCxRQUFBLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLENBQUMsSUFBSTtBQUNULFFBQUEsRUFBRSxFQUFFLElBQUk7QUFDUixRQUFBLEVBQUUsRUFBRSxHQUFHO1FBQ1AsRUFBRSxFQUFFLENBQUMsSUFBSTtBQUNULFFBQUEsRUFBRSxFQUFFLElBQUk7QUFDUixRQUFBLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLENBQUMsR0FBRztBQUNSLFFBQUEsRUFBRSxFQUFFLElBQUk7UUFDUixJQUFJLEVBQUUsQ0FBQyxJQUFJO1FBQ1gsSUFBSSxFQUFFLENBQUMsSUFBSTtBQUNYLFFBQUEsRUFBRSxFQUFFLElBQUk7QUFDUixRQUFBLEVBQUUsRUFBRSxJQUFJO0FBQ1IsUUFBQSxFQUFFLEVBQUUsSUFBSTtRQUNSLElBQUksRUFBRSxDQUFDLEdBQUc7UUFDVixJQUFJLEVBQUUsQ0FBQyxHQUFHO1FBQ1YsRUFBRSxFQUFFLENBQUMsSUFBSTtBQUNULFFBQUEsSUFBSSxFQUFFLElBQUk7QUFDVixRQUFBLElBQUksRUFBRSxJQUFJO0FBQ1YsUUFBQSxFQUFFLEVBQUUsSUFBSTtBQUNSLFFBQUEsRUFBRSxFQUFFLElBQUk7QUFDUixRQUFBLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLENBQUMsSUFBSTtBQUNULFFBQUEsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsQ0FBQyxHQUFHO0FBQ1IsUUFBQSxFQUFFLEVBQUUsSUFBSTtBQUNSLFFBQUEsRUFBRSxFQUFFLElBQUk7QUFDUixRQUFBLEVBQUUsRUFBRSxJQUFJO0FBQ1IsUUFBQSxJQUFJLEVBQUUsR0FBRztBQUNULFFBQUEsSUFBSSxFQUFFLEdBQUc7QUFDVCxRQUFBLEVBQUUsRUFBRSxJQUFJO0FBQ1IsUUFBQSxFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxDQUFDLElBQUk7QUFDVCxRQUFBLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLENBQUMsR0FBRztBQUNSLFFBQUEsRUFBRSxFQUFFLEdBQUc7QUFDUCxRQUFBLEVBQUUsRUFBRSxHQUFHO0FBQ1AsUUFBQSxFQUFFLEVBQUUsR0FBRztBQUNQLFFBQUEsRUFBRSxFQUFFLEdBQUc7QUFDUCxRQUFBLEVBQUUsRUFBRSxJQUFJO0FBQ1IsUUFBQSxFQUFFLEVBQUUsSUFBSTtBQUNSLFFBQUEsRUFBRSxFQUFFLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxHQUFHO1FBQ04sRUFBRSxFQUFFLENBQUMsSUFBSTtBQUNULFFBQUEsSUFBSSxFQUFFLEdBQUc7QUFDVCxRQUFBLElBQUksRUFBRSxHQUFHO0FBQ1QsUUFBQSxFQUFFLEVBQUUsSUFBSTtBQUNSLFFBQUEsRUFBRSxFQUFFLEdBQUc7S0FDUixDQUFDO0lBQ0YsSUFBSSxDQUFDLEtBQUssR0FBRztBQUNYLFFBQUEsR0FBRyxFQUFFLElBQUk7QUFDVCxRQUFBLEdBQUcsRUFBRSxJQUFJO0FBQ1QsUUFBQSxHQUFHLEVBQUUsR0FBRztBQUNSLFFBQUEsR0FBRyxFQUFFLEdBQUc7UUFDUixHQUFHLEVBQUUsQ0FBQyxHQUFHO1FBQ1QsR0FBRyxFQUFFLENBQUMsR0FBRztBQUNULFFBQUEsR0FBRyxFQUFFLElBQUk7UUFDVCxHQUFHLEVBQUUsQ0FBQyxHQUFHO1FBQ1QsR0FBRyxFQUFFLENBQUMsSUFBSTtBQUNWLFFBQUEsR0FBRyxFQUFFLEdBQUc7QUFDUixRQUFBLEdBQUcsRUFBRSxHQUFHO1FBQ1IsR0FBRyxFQUFFLENBQUMsSUFBSTtLQUNYLENBQUM7SUFDRixJQUFJLENBQUMsS0FBSyxHQUFHO0FBQ1gsUUFBQSxHQUFHLEVBQUUsSUFBSTtRQUNULEdBQUcsRUFBRSxDQUFDLElBQUk7UUFDVixHQUFHLEVBQUUsQ0FBQyxJQUFJO1FBQ1YsR0FBRyxFQUFFLENBQUMsSUFBSTtBQUNWLFFBQUEsR0FBRyxFQUFFLEdBQUc7UUFDUixHQUFHLEVBQUUsQ0FBQyxJQUFJO0tBQ1gsQ0FBQztJQUNGLElBQUksQ0FBQyxLQUFLLEdBQUc7UUFDWCxHQUFHLEVBQUUsQ0FBQyxHQUFHO0FBQ1QsUUFBQSxHQUFHLEVBQUUsR0FBRztRQUNSLEdBQUcsRUFBRSxDQUFDLEdBQUc7UUFDVCxHQUFHLEVBQUUsQ0FBQyxJQUFJO0FBQ1YsUUFBQSxHQUFHLEVBQUUsR0FBRztRQUNSLEdBQUcsRUFBRSxDQUFDLElBQUk7QUFDVixRQUFBLEdBQUcsRUFBRSxHQUFHO1FBQ1IsR0FBRyxFQUFFLENBQUMsSUFBSTtRQUNWLEdBQUcsRUFBRSxDQUFDLElBQUk7UUFDVixHQUFHLEVBQUUsQ0FBQyxHQUFHO1FBQ1QsR0FBRyxFQUFFLENBQUMsSUFBSTtRQUNWLEdBQUcsRUFBRSxDQUFDLEdBQUc7UUFDVCxHQUFHLEVBQUUsQ0FBQyxJQUFJO0FBQ1YsUUFBQSxHQUFHLEVBQUUsR0FBRztRQUNSLEdBQUcsRUFBRSxDQUFDLElBQUk7UUFDVixHQUFHLEVBQUUsQ0FBQyxJQUFJO1FBQ1YsR0FBRyxFQUFFLENBQUMsSUFBSTtRQUNWLEdBQUcsRUFBRSxDQUFDLEdBQUc7QUFDVCxRQUFBLEdBQUcsRUFBRSxHQUFHO1FBQ1IsR0FBRyxFQUFFLENBQUMsR0FBRztRQUNULEdBQUcsRUFBRSxDQUFDLElBQUk7QUFDVixRQUFBLEdBQUcsRUFBRSxHQUFHO1FBQ1IsR0FBRyxFQUFFLENBQUMsSUFBSTtLQUNYLENBQUM7SUFDRixJQUFJLENBQUMsS0FBSyxHQUFHO1FBQ1gsR0FBRyxFQUFFLENBQUMsR0FBRztBQUNULFFBQUEsR0FBRyxFQUFFLElBQUk7QUFDVCxRQUFBLEdBQUcsRUFBRSxHQUFHO1FBQ1IsR0FBRyxFQUFFLENBQUMsR0FBRztBQUNULFFBQUEsR0FBRyxFQUFFLEdBQUc7QUFDUixRQUFBLEdBQUcsRUFBRSxHQUFHO0FBQ1IsUUFBQSxHQUFHLEVBQUUsR0FBRztBQUNSLFFBQUEsR0FBRyxFQUFFLEdBQUc7QUFDUixRQUFBLEdBQUcsRUFBRSxHQUFHO0FBQ1IsUUFBQSxHQUFHLEVBQUUsR0FBRztRQUNSLEdBQUcsRUFBRSxDQUFDLElBQUk7QUFDVixRQUFBLEdBQUcsRUFBRSxHQUFHO0FBQ1IsUUFBQSxHQUFHLEVBQUUsSUFBSTtBQUNULFFBQUEsR0FBRyxFQUFFLEdBQUc7QUFDUixRQUFBLEdBQUcsRUFBRSxFQUFFO0FBQ1AsUUFBQSxHQUFHLEVBQUUsSUFBSTtBQUNULFFBQUEsR0FBRyxFQUFFLElBQUk7QUFDVCxRQUFBLEdBQUcsRUFBRSxJQUFJO1FBQ1QsR0FBRyxFQUFFLENBQUMsR0FBRztBQUNULFFBQUEsR0FBRyxFQUFFLEdBQUc7UUFDUixHQUFHLEVBQUUsQ0FBQyxHQUFHO0FBQ1QsUUFBQSxHQUFHLEVBQUUsR0FBRztBQUNSLFFBQUEsR0FBRyxFQUFFLEdBQUc7S0FDVCxDQUFDO0lBQ0YsSUFBSSxDQUFDLEtBQUssR0FBRztRQUNYLElBQUksRUFBRSxDQUFDLEdBQUc7QUFDVixRQUFBLElBQUksRUFBRSxHQUFHO1FBQ1QsSUFBSSxFQUFFLENBQUMsR0FBRztBQUNWLFFBQUEsSUFBSSxFQUFFLEVBQUU7QUFDUixRQUFBLElBQUksRUFBRSxJQUFJO1FBQ1YsSUFBSSxFQUFFLENBQUMsR0FBRztBQUNWLFFBQUEsSUFBSSxFQUFFLEdBQUc7UUFDVCxJQUFJLEVBQUUsQ0FBQyxHQUFHO0FBQ1YsUUFBQSxJQUFJLEVBQUUsR0FBRztBQUNULFFBQUEsSUFBSSxFQUFFLEdBQUc7QUFDVCxRQUFBLElBQUksRUFBRSxHQUFHO0FBQ1QsUUFBQSxJQUFJLEVBQUUsR0FBRztRQUNULElBQUksRUFBRSxDQUFDLEVBQUU7S0FDVixDQUFDO0lBQ0YsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ25FLElBQUksQ0FBQyxLQUFLLEdBQUc7QUFDWCxRQUFBLElBQUksRUFBRSxHQUFHO1FBQ1QsSUFBSSxFQUFFLENBQUMsSUFBSTtBQUNYLFFBQUEsSUFBSSxFQUFFLEdBQUc7UUFDVCxJQUFJLEVBQUUsQ0FBQyxHQUFHO1FBQ1YsSUFBSSxFQUFFLENBQUMsR0FBRztRQUNWLElBQUksRUFBRSxDQUFDLEdBQUc7UUFDVixJQUFJLEVBQUUsQ0FBQyxHQUFHO1FBQ1YsSUFBSSxFQUFFLENBQUMsR0FBRztBQUNWLFFBQUEsSUFBSSxFQUFFLEdBQUc7QUFDVCxRQUFBLElBQUksRUFBRSxHQUFHO0FBQ1QsUUFBQSxJQUFJLEVBQUUsSUFBSTtBQUNWLFFBQUEsSUFBSSxFQUFFLEdBQUc7QUFDVCxRQUFBLElBQUksRUFBRSxHQUFHO0FBQ1QsUUFBQSxJQUFJLEVBQUUsR0FBRztBQUNULFFBQUEsSUFBSSxFQUFFLElBQUk7QUFDVixRQUFBLElBQUksRUFBRSxJQUFJO0FBQ1YsUUFBQSxJQUFJLEVBQUUsR0FBRztBQUNULFFBQUEsSUFBSSxFQUFFLEdBQUc7QUFDVCxRQUFBLElBQUksRUFBRSxHQUFHO1FBQ1QsSUFBSSxFQUFFLENBQUMsR0FBRztLQUNYLENBQUM7SUFDRixJQUFJLENBQUMsS0FBSyxHQUFHO1FBQ1gsSUFBSSxFQUFFLENBQUMsR0FBRztRQUNWLElBQUksRUFBRSxDQUFDLElBQUk7UUFDWCxJQUFJLEVBQUUsQ0FBQyxHQUFHO1FBQ1YsSUFBSSxFQUFFLENBQUMsR0FBRztRQUNWLElBQUksRUFBRSxDQUFDLElBQUk7UUFDWCxJQUFJLEVBQUUsQ0FBQyxJQUFJO0FBQ1gsUUFBQSxJQUFJLEVBQUUsR0FBRztRQUNULElBQUksRUFBRSxDQUFDLEdBQUc7QUFDVixRQUFBLElBQUksRUFBRSxJQUFJO0FBQ1YsUUFBQSxJQUFJLEVBQUUsR0FBRztRQUNULElBQUksRUFBRSxDQUFDLElBQUk7QUFDWCxRQUFBLElBQUksRUFBRSxJQUFJO1FBQ1YsSUFBSSxFQUFFLENBQUMsR0FBRztBQUNWLFFBQUEsSUFBSSxFQUFFLEdBQUc7UUFDVCxJQUFJLEVBQUUsQ0FBQyxJQUFJO1FBQ1gsSUFBSSxFQUFFLENBQUMsSUFBSTtLQUNaLENBQUM7QUFDRixJQUFBLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDO0lBQ3ZDLElBQUksQ0FBQyxLQUFLLEdBQUc7UUFDWCxHQUFHLEVBQUUsQ0FBQyxJQUFJO1FBQ1YsR0FBRyxFQUFFLENBQUMsSUFBSTtRQUNWLEdBQUcsRUFBRSxDQUFDLElBQUk7QUFDVixRQUFBLEdBQUcsRUFBRSxJQUFJO1FBQ1QsR0FBRyxFQUFFLENBQUMsSUFBSTtRQUNWLEdBQUcsRUFBRSxDQUFDLElBQUk7QUFDVixRQUFBLEdBQUcsRUFBRSxJQUFJO1FBQ1QsR0FBRyxFQUFFLENBQUMsSUFBSTtRQUNWLEdBQUcsRUFBRSxDQUFDLElBQUk7QUFDVixRQUFBLEdBQUcsRUFBRSxJQUFJO1FBQ1QsR0FBRyxFQUFFLENBQUMsR0FBRztRQUNULEdBQUcsRUFBRSxDQUFDLElBQUk7UUFDVixHQUFHLEVBQUUsQ0FBQyxJQUFJO1FBQ1YsR0FBRyxFQUFFLENBQUMsSUFBSTtRQUNWLEdBQUcsRUFBRSxDQUFDLElBQUk7UUFDVixHQUFHLEVBQUUsQ0FBQyxJQUFJO0tBQ1gsQ0FBQztJQUNGLElBQUksQ0FBQyxLQUFLLEdBQUc7UUFDWCxHQUFHLEVBQUUsQ0FBQyxJQUFJO0FBQ1YsUUFBQSxHQUFHLEVBQUUsSUFBSTtRQUNULEdBQUcsRUFBRSxDQUFDLElBQUk7UUFDVixHQUFHLEVBQUUsQ0FBQyxJQUFJO1FBQ1YsR0FBRyxFQUFFLENBQUMsSUFBSTtRQUNWLEdBQUcsRUFBRSxDQUFDLElBQUk7UUFDVixLQUFLLEVBQUUsQ0FBQyxHQUFHO1FBQ1gsS0FBSyxFQUFFLENBQUMsR0FBRztRQUNYLEdBQUcsRUFBRSxDQUFDLEdBQUc7UUFDVCxHQUFHLEVBQUUsQ0FBQyxJQUFJO1FBQ1YsR0FBRyxFQUFFLENBQUMsSUFBSTtLQUNYLENBQUM7SUFDRixJQUFJLENBQUMsS0FBSyxHQUFHO0FBQ1gsUUFBQSxLQUFLLEVBQUUsSUFBSTtBQUNYLFFBQUEsS0FBSyxFQUFFLElBQUk7UUFDWCxHQUFHLEVBQUUsQ0FBQyxJQUFJO0FBQ1YsUUFBQSxHQUFHLEVBQUUsSUFBSTtBQUNULFFBQUEsS0FBSyxFQUFFLElBQUk7QUFDWCxRQUFBLEtBQUssRUFBRSxJQUFJO0FBQ1gsUUFBQSxHQUFHLEVBQUUsSUFBSTtBQUNULFFBQUEsR0FBRyxFQUFFLElBQUk7QUFDVCxRQUFBLEdBQUcsRUFBRSxJQUFJO0FBQ1QsUUFBQSxHQUFHLEVBQUUsSUFBSTtRQUNULEdBQUcsRUFBRSxDQUFDLElBQUk7QUFDVixRQUFBLEdBQUcsRUFBRSxJQUFJO0tBQ1YsQ0FBQztJQUNGLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUNoRCxJQUFBLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO0FBQ25FLElBQUEsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUM7SUFDbkMsSUFBSSxDQUFDLEtBQUssR0FBRztRQUNYLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7S0FDUixDQUFDO0lBQ0YsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQzVELElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUMxRCxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDekIsSUFBQSxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7SUFDL0IsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztJQUN4QixJQUFJLENBQUMsS0FBSyxHQUFHO0FBQ1gsUUFBQSxFQUFFLEVBQUUsRUFBRTtRQUNOLEVBQUUsRUFBRSxDQUFDLEVBQUU7UUFDUCxFQUFFLEVBQUUsQ0FBQyxFQUFFO0FBQ1AsUUFBQSxFQUFFLEVBQUUsR0FBRztRQUNQLEVBQUUsRUFBRSxDQUFDLEVBQUU7UUFDUCxFQUFFLEVBQUUsQ0FBQyxFQUFFO0FBQ1AsUUFBQSxFQUFFLEVBQUUsR0FBRztBQUNQLFFBQUEsRUFBRSxFQUFFLEdBQUc7UUFDUCxFQUFFLEVBQUUsQ0FBQyxJQUFJO0tBQ1YsQ0FBQztBQUNGLElBQUEsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUM7SUFDNUMsSUFBSSxDQUFDLEtBQUssR0FBRztRQUNYLEVBQUUsRUFBRSxDQUFDLEdBQUc7QUFDUixRQUFBLEVBQUUsRUFBRSxFQUFFO0FBQ04sUUFBQSxFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxDQUFDLElBQUk7QUFDVCxRQUFBLEVBQUUsRUFBRSxJQUFJO0FBQ1IsUUFBQSxFQUFFLEVBQUUsSUFBSTtBQUNSLFFBQUEsRUFBRSxFQUFFLEtBQUs7UUFDVCxFQUFFLEVBQUUsQ0FBQyxHQUFHO1FBQ1IsRUFBRSxFQUFFLENBQUMsSUFBSTtLQUNWLENBQUM7SUFDRixJQUFJLENBQUMsS0FBSyxHQUFHO0FBQ1gsUUFBQSxHQUFHLEVBQUUsR0FBRztBQUNSLFFBQUEsR0FBRyxFQUFFLEdBQUc7UUFDUixHQUFHLEVBQUUsQ0FBQyxHQUFHO1FBQ1QsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO0FBQ1AsUUFBQSxDQUFDLEVBQUUsR0FBRztBQUNOLFFBQUEsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztBQUNQLFFBQUEsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxHQUFHO0FBQ1AsUUFBQSxDQUFDLEVBQUUsR0FBRztBQUNOLFFBQUEsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLEdBQUcsRUFBRSxDQUFDLEdBQUc7UUFDVCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7QUFDUCxRQUFBLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsR0FBRztBQUNQLFFBQUEsQ0FBQyxFQUFFLEdBQUc7QUFDTixRQUFBLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7QUFDUCxRQUFBLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsR0FBRyxFQUFFLENBQUMsR0FBRztRQUNULEdBQUcsRUFBRSxDQUFDLEdBQUc7S0FDVixDQUFDO0lBQ0YsSUFBSSxDQUFDLEtBQUssR0FBRztRQUNYLEdBQUcsRUFBRSxDQUFDLEdBQUc7UUFDVCxHQUFHLEVBQUUsQ0FBQyxHQUFHO0FBQ1QsUUFBQSxDQUFDLEVBQUUsR0FBRztRQUNOLEdBQUcsRUFBRSxDQUFDLEdBQUc7QUFDVCxRQUFBLEdBQUcsRUFBRSxJQUFJO1FBQ1QsQ0FBQyxFQUFFLENBQUMsR0FBRztBQUNQLFFBQUEsQ0FBQyxFQUFFLEdBQUc7QUFDTixRQUFBLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsR0FBRztBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxHQUFHO0FBQ04sUUFBQSxDQUFDLEVBQUUsR0FBRztBQUNOLFFBQUEsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO0FBQ1AsUUFBQSxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxHQUFHO0FBQ04sUUFBQSxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxHQUFHO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO0FBQ1AsUUFBQSxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztBQUNQLFFBQUEsQ0FBQyxFQUFFLEdBQUc7QUFDTixRQUFBLENBQUMsRUFBRSxHQUFHO0FBQ04sUUFBQSxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO0FBQ1AsUUFBQSxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLEdBQUc7QUFDUCxRQUFBLENBQUMsRUFBRSxHQUFHO0FBQ04sUUFBQSxDQUFDLEVBQUUsR0FBRztBQUNOLFFBQUEsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLEdBQUc7QUFDTixRQUFBLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLEdBQUc7QUFDTixRQUFBLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsR0FBRztBQUNQLFFBQUEsQ0FBQyxFQUFFLEdBQUc7QUFDTixRQUFBLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsR0FBRyxFQUFFLENBQUMsR0FBRztBQUNULFFBQUEsR0FBRyxFQUFFLElBQUk7QUFDVCxRQUFBLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsR0FBRztBQUNQLFFBQUEsQ0FBQyxFQUFFLEdBQUc7QUFDTixRQUFBLENBQUMsRUFBRSxHQUFHO0tBQ1AsQ0FBQztJQUNGLElBQUksQ0FBQyxLQUFLLEdBQUc7QUFDWCxRQUFBLEdBQUcsRUFBRSxJQUFJO1FBQ1QsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLEdBQUcsRUFBRSxDQUFDLElBQUk7QUFDVixRQUFBLEdBQUcsRUFBRSxJQUFJO1FBQ1QsQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLEdBQUcsRUFBRSxJQUFJO1FBQ1QsR0FBRyxFQUFFLENBQUMsSUFBSTtRQUNWLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsR0FBRztBQUNOLFFBQUEsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxHQUFHO0FBQ1AsUUFBQSxDQUFDLEVBQUUsR0FBRztBQUNOLFFBQUEsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxHQUFHO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztBQUNQLFFBQUEsQ0FBQyxFQUFFLEdBQUc7QUFDTixRQUFBLENBQUMsRUFBRSxHQUFHO0FBQ04sUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7QUFDUCxRQUFBLENBQUMsRUFBRSxHQUFHO0FBQ04sUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsR0FBRztBQUNOLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLEdBQUc7UUFDTixHQUFHLEVBQUUsQ0FBQyxJQUFJO1FBQ1YsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLEdBQUc7QUFDTixRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsR0FBRztBQUNOLFFBQUEsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsR0FBRztBQUNOLFFBQUEsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsR0FBRztBQUNOLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxHQUFHO0FBQ04sUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsR0FBRztBQUNOLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLEdBQUc7QUFDTixRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLEdBQUc7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLEdBQUc7QUFDTixRQUFBLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztBQUNQLFFBQUEsQ0FBQyxFQUFFLEdBQUc7QUFDTixRQUFBLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLEdBQUc7QUFDUCxRQUFBLENBQUMsRUFBRSxHQUFHO0FBQ04sUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsR0FBRztBQUNOLFFBQUEsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxHQUFHO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxHQUFHO0FBQ04sUUFBQSxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxHQUFHO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO1FBQ1AsR0FBRyxFQUFFLENBQUMsR0FBRztBQUNULFFBQUEsR0FBRyxFQUFFLElBQUk7UUFDVCxHQUFHLEVBQUUsQ0FBQyxJQUFJO1FBQ1YsQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLEdBQUc7QUFDTixRQUFBLEVBQUUsRUFBRSxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsR0FBRztBQUNOLFFBQUEsQ0FBQyxFQUFFLEdBQUc7QUFDTixRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxHQUFHO0tBQ1AsQ0FBQztJQUNGLElBQUksQ0FBQyxLQUFLLEdBQUc7QUFDWCxRQUFBLEdBQUcsRUFBRSxJQUFJO0FBQ1QsUUFBQSxHQUFHLEVBQUUsSUFBSTtRQUNULEdBQUcsRUFBRSxDQUFDLElBQUk7QUFDVixRQUFBLEdBQUcsRUFBRSxJQUFJO0FBQ1QsUUFBQSxHQUFHLEVBQUUsSUFBSTtBQUNULFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLEdBQUcsRUFBRSxJQUFJO0FBQ1QsUUFBQSxHQUFHLEVBQUUsSUFBSTtRQUNULEdBQUcsRUFBRSxDQUFDLElBQUk7QUFDVixRQUFBLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLEdBQUc7QUFDTixRQUFBLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLEdBQUc7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsR0FBRztBQUNOLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLEtBQUs7UUFDVCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxLQUFLO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixHQUFHLEVBQUUsQ0FBQyxJQUFJO1FBQ1YsQ0FBQyxFQUFFLENBQUMsS0FBSztRQUNULENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLEdBQUc7QUFDTixRQUFBLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLEdBQUc7QUFDTixRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsR0FBRztBQUNOLFFBQUEsQ0FBQyxFQUFFLEdBQUc7QUFDTixRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxHQUFHO0FBQ04sUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLEdBQUc7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLEdBQUc7QUFDTixRQUFBLENBQUMsRUFBRSxHQUFHO0FBQ04sUUFBQSxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxHQUFHO0FBQ04sUUFBQSxDQUFDLEVBQUUsR0FBRztBQUNOLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxHQUFHO0FBQ04sUUFBQSxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLEdBQUc7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztBQUNQLFFBQUEsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLEdBQUc7QUFDTixRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsR0FBRztBQUNOLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxHQUFHO0FBQ1AsUUFBQSxDQUFDLEVBQUUsR0FBRztBQUNOLFFBQUEsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7QUFDUCxRQUFBLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsR0FBRyxFQUFFLElBQUk7QUFDVCxRQUFBLEdBQUcsRUFBRSxJQUFJO1FBQ1QsR0FBRyxFQUFFLENBQUMsSUFBSTtRQUNWLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxLQUFLO0FBQ1QsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO0tBQ1QsQ0FBQztJQUNGLElBQUksQ0FBQyxLQUFLLEdBQUc7QUFDWCxRQUFBLEdBQUcsRUFBRSxHQUFHO1FBQ1IsR0FBRyxFQUFFLENBQUMsR0FBRztRQUNULENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxFQUFFLEVBQUUsQ0FBQyxLQUFLO1FBQ1YsR0FBRyxFQUFFLENBQUMsSUFBSTtBQUNWLFFBQUEsR0FBRyxFQUFFLEdBQUc7UUFDUixHQUFHLEVBQUUsQ0FBQyxHQUFHO0FBQ1QsUUFBQSxHQUFHLEVBQUUsR0FBRztBQUNSLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsR0FBRztBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxHQUFHO0FBQ04sUUFBQSxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLEdBQUc7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxFQUFFO0FBQ0wsUUFBQSxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLEVBQUU7UUFDTixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLEdBQUc7QUFDTixRQUFBLENBQUMsRUFBRSxHQUFHO0FBQ04sUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxHQUFHO0FBQ1AsUUFBQSxDQUFDLEVBQUUsR0FBRztBQUNOLFFBQUEsQ0FBQyxFQUFFLEdBQUc7QUFDTixRQUFBLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLEdBQUc7QUFDTixRQUFBLENBQUMsRUFBRSxHQUFHO0FBQ04sUUFBQSxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO0FBQ1AsUUFBQSxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxHQUFHO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7QUFDUCxRQUFBLENBQUMsRUFBRSxHQUFHO0FBQ04sUUFBQSxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxHQUFHO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsR0FBRztBQUNOLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsR0FBRztBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxHQUFHO0FBQ04sUUFBQSxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsR0FBRztBQUNQLFFBQUEsQ0FBQyxFQUFFLEdBQUc7QUFDTixRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxHQUFHLEVBQUUsQ0FBQyxHQUFHO1FBQ1QsRUFBRSxFQUFFLENBQUMsS0FBSztBQUNWLFFBQUEsR0FBRyxFQUFFLEdBQUc7QUFDUixRQUFBLENBQUMsRUFBRSxHQUFHO0FBQ04sUUFBQSxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLEdBQUc7S0FDUixDQUFDO0lBQ0YsSUFBSSxDQUFDLEtBQUssR0FBRztBQUNYLFFBQUEsR0FBRyxFQUFFLEdBQUc7QUFDUixRQUFBLEdBQUcsRUFBRSxHQUFHO1FBQ1IsQ0FBQyxFQUFFLENBQUMsR0FBRztBQUNQLFFBQUEsRUFBRSxFQUFFLEdBQUc7QUFDUCxRQUFBLEdBQUcsRUFBRSxHQUFHO0FBQ1IsUUFBQSxHQUFHLEVBQUUsR0FBRztRQUNSLENBQUMsRUFBRSxDQUFDLEdBQUc7QUFDUCxRQUFBLENBQUMsRUFBRSxHQUFHO0FBQ04sUUFBQSxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLEVBQUU7UUFDTixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsR0FBRztBQUNQLFFBQUEsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztBQUNQLFFBQUEsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxHQUFHO0FBQ1AsUUFBQSxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztBQUNQLFFBQUEsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxHQUFHO0FBQ1AsUUFBQSxDQUFDLEVBQUUsR0FBRztBQUNOLFFBQUEsQ0FBQyxFQUFFLEdBQUc7QUFDTixRQUFBLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxHQUFHO0FBQ1AsUUFBQSxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLEdBQUc7QUFDUCxRQUFBLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsR0FBRztBQUNQLFFBQUEsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxHQUFHO0FBQ1AsUUFBQSxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLEdBQUc7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsR0FBRztBQUNOLFFBQUEsQ0FBQyxFQUFFLElBQUk7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QUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3BCLElBQUksRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDcEIsSUFBSSxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNwQixRQUFBLElBQUksRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoQixJQUFJLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3BCLElBQUksRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDcEIsSUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN0QixJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDdEIsUUFBQSxJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbEIsSUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN0QixJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ3RCLFFBQUEsS0FBSyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2xDLFFBQUEsS0FBSyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2xDLFFBQUEsS0FBSyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2xDLFFBQUEsS0FBSyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN2QyxRQUFBLEtBQUssSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDdkMsUUFBQSxLQUFLLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDbEMsUUFBQSxLQUFLLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDbEMsUUFBQSxLQUFLLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDbEMsUUFBQSxLQUFLLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDbEMsUUFBQSxLQUFLLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDbEMsUUFBQSxLQUFLLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDbEMsUUFBQSxLQUFLLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3ZDLFFBQUEsS0FBSyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN2QyxRQUFBLEtBQUssSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDdkMsUUFBQSxLQUFLLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUM1QyxRQUFBLEtBQUssSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzVDLFFBQUEsS0FBSyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDNUMsUUFBQSxLQUFLLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUM1QyxRQUFBLEtBQUssSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNsQyxRQUFBLEtBQUssSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNsQyxRQUFBLEtBQUssSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNsQyxRQUFBLEtBQUssSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNsQyxRQUFBLEtBQUssSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNsQyxRQUFBLEtBQUssSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNsQyxRQUFBLEtBQUssSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDdkMsUUFBQSxLQUFLLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3ZDLFFBQUEsS0FBSyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN2QyxRQUFBLEtBQUssSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzVDLFFBQUEsS0FBSyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDNUMsUUFBQSxLQUFLLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUM1QyxRQUFBLEtBQUssSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDOztBQUU1QyxRQUFBLEtBQUssSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDdkMsUUFBQSxLQUFLLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3ZDLFFBQUEsS0FBSyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN2QyxRQUFBLEtBQUssSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzVDLFFBQUEsS0FBSyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDNUMsUUFBQSxLQUFLLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUM1QyxRQUFBLEtBQUssSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzVDLFFBQUEsS0FBSyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2pELFFBQUEsS0FBSyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2pELFFBQUEsS0FBSyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2pELFFBQUEsS0FBSyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FB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
