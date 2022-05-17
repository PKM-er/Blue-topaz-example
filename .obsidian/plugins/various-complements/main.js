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
                    ? `[[${word.aliasMeta.origin}|${word.value}]]`
                    : `[[${word.value}]]`;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsInNyYy91dGlsL3N0cmluZ3MudHMiLCJzcmMvdG9rZW5pemVyL3Rva2VuaXplcnMvRGVmYXVsdFRva2VuaXplci50cyIsInNyYy90b2tlbml6ZXIvdG9rZW5pemVycy9BcmFiaWNUb2tlbml6ZXIudHMiLCJzcmMvZXh0ZXJuYWwvdGlueS1zZWdtZW50ZXIudHMiLCJzcmMvdG9rZW5pemVyL3Rva2VuaXplcnMvSmFwYW5lc2VUb2tlbml6ZXIudHMiLCJzcmMvdG9rZW5pemVyL3Rva2VuaXplcnMvRW5nbGlzaE9ubHlUb2tlbml6ZXIudHMiLCJzcmMvdG9rZW5pemVyL3Rva2VuaXplci50cyIsInNyYy90b2tlbml6ZXIvVG9rZW5pemVTdHJhdGVneS50cyIsInNyYy9hcHAtaGVscGVyLnRzIiwic3JjL3V0aWwvY29sbGVjdGlvbi1oZWxwZXIudHMiLCJzcmMvbW9kZWwvV29yZC50cyIsInNyYy9wcm92aWRlci9zdWdnZXN0ZXIudHMiLCJzcmMvdXRpbC9wYXRoLnRzIiwic3JjL3Byb3ZpZGVyL0N1c3RvbURpY3Rpb25hcnlXb3JkUHJvdmlkZXIudHMiLCJzcmMvcHJvdmlkZXIvQ3VycmVudEZpbGVXb3JkUHJvdmlkZXIudHMiLCJzcmMvcHJvdmlkZXIvSW50ZXJuYWxMaW5rV29yZFByb3ZpZGVyLnRzIiwic3JjL3Byb3ZpZGVyL01hdGNoU3RyYXRlZ3kudHMiLCJzcmMvb3B0aW9uL0N5Y2xlVGhyb3VnaFN1Z2dlc3Rpb25zS2V5cy50cyIsInNyYy9vcHRpb24vQ29sdW1uRGVsaW1pdGVyLnRzIiwic3JjL29wdGlvbi9TZWxlY3RTdWdnZXN0aW9uS2V5LnRzIiwic3JjL3Byb3ZpZGVyL0N1cnJlbnRWYXVsdFdvcmRQcm92aWRlci50cyIsInNyYy9vcHRpb24vT3BlblNvdXJjZUZpbGVLZXlzLnRzIiwic3JjL29wdGlvbi9EZXNjcmlwdGlvbk9uU3VnZ2VzdGlvbi50cyIsInNyYy9wcm92aWRlci9Gcm9udE1hdHRlcldvcmRQcm92aWRlci50cyIsInNyYy9wcm92aWRlci9TcGVjaWZpY01hdGNoU3RyYXRlZ3kudHMiLCJzcmMvc3RvcmFnZS9TZWxlY3Rpb25IaXN0b3J5U3RvcmFnZS50cyIsInNyYy91aS9BdXRvQ29tcGxldGVTdWdnZXN0LnRzIiwic3JjL3NldHRpbmcvc2V0dGluZ3MudHMiLCJzcmMvdWkvUHJvdmlkZXJTdGF0dXNCYXIudHMiLCJub2RlX21vZHVsZXMvc3ZlbHRlL2ludGVybmFsL2luZGV4Lm1qcyIsInNyYy91aS9jb21wb25lbnQvT2JzaWRpYW5CdXR0b24uc3ZlbHRlIiwibm9kZV9tb2R1bGVzL3N2ZWx0ZS1sdWNpZGUtaWNvbnMvaWNvbnMvRmlsZS5zdmVsdGUiLCJzcmMvdWkvY29tcG9uZW50L09ic2lkaWFuSWNvbkJ1dHRvbi5zdmVsdGUiLCJzcmMvdWkvY29tcG9uZW50L0N1c3RvbURpY3Rpb25hcnlXb3JkQWRkLnN2ZWx0ZSIsInNyYy91aS9DdXN0b21EaWN0aW9uYXJ5V29yZEFkZE1vZGFsLnRzIiwic3JjL21haW4udHMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5Db3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi5cclxuXHJcblBlcm1pc3Npb24gdG8gdXNlLCBjb3B5LCBtb2RpZnksIGFuZC9vciBkaXN0cmlidXRlIHRoaXMgc29mdHdhcmUgZm9yIGFueVxyXG5wdXJwb3NlIHdpdGggb3Igd2l0aG91dCBmZWUgaXMgaGVyZWJ5IGdyYW50ZWQuXHJcblxyXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiIEFORCBUSEUgQVVUSE9SIERJU0NMQUlNUyBBTEwgV0FSUkFOVElFUyBXSVRIXHJcblJFR0FSRCBUTyBUSElTIFNPRlRXQVJFIElOQ0xVRElORyBBTEwgSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWVxyXG5BTkQgRklUTkVTUy4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUiBCRSBMSUFCTEUgRk9SIEFOWSBTUEVDSUFMLCBESVJFQ1QsXHJcbklORElSRUNULCBPUiBDT05TRVFVRU5USUFMIERBTUFHRVMgT1IgQU5ZIERBTUFHRVMgV0hBVFNPRVZFUiBSRVNVTFRJTkcgRlJPTVxyXG5MT1NTIE9GIFVTRSwgREFUQSBPUiBQUk9GSVRTLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgTkVHTElHRU5DRSBPUlxyXG5PVEhFUiBUT1JUSU9VUyBBQ1RJT04sIEFSSVNJTkcgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgVVNFIE9SXHJcblBFUkZPUk1BTkNFIE9GIFRISVMgU09GVFdBUkUuXHJcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXHJcbi8qIGdsb2JhbCBSZWZsZWN0LCBQcm9taXNlICovXHJcblxyXG52YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uKGQsIGIpIHtcclxuICAgIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGIsIHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXh0ZW5kcyhkLCBiKSB7XHJcbiAgICBpZiAodHlwZW9mIGIgIT09IFwiZnVuY3Rpb25cIiAmJiBiICE9PSBudWxsKVxyXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDbGFzcyBleHRlbmRzIHZhbHVlIFwiICsgU3RyaW5nKGIpICsgXCIgaXMgbm90IGEgY29uc3RydWN0b3Igb3IgbnVsbFwiKTtcclxuICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxufVxyXG5cclxuZXhwb3J0IHZhciBfX2Fzc2lnbiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uIF9fYXNzaWduKHQpIHtcclxuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcclxuICAgICAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKSB0W3BdID0gc1twXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVzdChzLCBlKSB7XHJcbiAgICB2YXIgdCA9IHt9O1xyXG4gICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApICYmIGUuaW5kZXhPZihwKSA8IDApXHJcbiAgICAgICAgdFtwXSA9IHNbcF07XHJcbiAgICBpZiAocyAhPSBudWxsICYmIHR5cGVvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzID09PSBcImZ1bmN0aW9uXCIpXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIHAgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHMpOyBpIDwgcC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoZS5pbmRleE9mKHBbaV0pIDwgMCAmJiBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwocywgcFtpXSkpXHJcbiAgICAgICAgICAgICAgICB0W3BbaV1dID0gc1twW2ldXTtcclxuICAgICAgICB9XHJcbiAgICByZXR1cm4gdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpIHtcclxuICAgIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aCwgciA9IGMgPCAzID8gdGFyZ2V0IDogZGVzYyA9PT0gbnVsbCA/IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSA6IGRlc2MsIGQ7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO1xyXG4gICAgZWxzZSBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgaWYgKGQgPSBkZWNvcmF0b3JzW2ldKSByID0gKGMgPCAzID8gZChyKSA6IGMgPiAzID8gZCh0YXJnZXQsIGtleSwgcikgOiBkKHRhcmdldCwga2V5KSkgfHwgcjtcclxuICAgIHJldHVybiBjID4gMyAmJiByICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgciksIHI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3BhcmFtKHBhcmFtSW5kZXgsIGRlY29yYXRvcikge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIGtleSkgeyBkZWNvcmF0b3IodGFyZ2V0LCBrZXksIHBhcmFtSW5kZXgpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKSB7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QubWV0YWRhdGEgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIFJlZmxlY3QubWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdGVyKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xyXG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZ2VuZXJhdG9yKHRoaXNBcmcsIGJvZHkpIHtcclxuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XHJcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xyXG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcclxuICAgICAgICB3aGlsZSAoXykgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xyXG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XHJcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxyXG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgdmFyIF9fY3JlYXRlQmluZGluZyA9IE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICB2YXIgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobSwgayk7XHJcbiAgICBpZiAoIWRlc2MgfHwgKFwiZ2V0XCIgaW4gZGVzYyA/ICFtLl9fZXNNb2R1bGUgOiBkZXNjLndyaXRhYmxlIHx8IGRlc2MuY29uZmlndXJhYmxlKSkge1xyXG4gICAgICAgIGRlc2MgPSB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBtW2tdOyB9IH07XHJcbiAgICB9XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgazIsIGRlc2MpO1xyXG59KSA6IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xyXG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcclxuICAgIG9bazJdID0gbVtrXTtcclxufSk7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHBvcnRTdGFyKG0sIG8pIHtcclxuICAgIGZvciAodmFyIHAgaW4gbSkgaWYgKHAgIT09IFwiZGVmYXVsdFwiICYmICFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobywgcCkpIF9fY3JlYXRlQmluZGluZyhvLCBtLCBwKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fdmFsdWVzKG8pIHtcclxuICAgIHZhciBzID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIFN5bWJvbC5pdGVyYXRvciwgbSA9IHMgJiYgb1tzXSwgaSA9IDA7XHJcbiAgICBpZiAobSkgcmV0dXJuIG0uY2FsbChvKTtcclxuICAgIGlmIChvICYmIHR5cGVvZiBvLmxlbmd0aCA9PT0gXCJudW1iZXJcIikgcmV0dXJuIHtcclxuICAgICAgICBuZXh0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmIChvICYmIGkgPj0gby5sZW5ndGgpIG8gPSB2b2lkIDA7XHJcbiAgICAgICAgICAgIHJldHVybiB7IHZhbHVlOiBvICYmIG9baSsrXSwgZG9uZTogIW8gfTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihzID8gXCJPYmplY3QgaXMgbm90IGl0ZXJhYmxlLlwiIDogXCJTeW1ib2wuaXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZWFkKG8sIG4pIHtcclxuICAgIHZhciBtID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXTtcclxuICAgIGlmICghbSkgcmV0dXJuIG87XHJcbiAgICB2YXIgaSA9IG0uY2FsbChvKSwgciwgYXIgPSBbXSwgZTtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgd2hpbGUgKChuID09PSB2b2lkIDAgfHwgbi0tID4gMCkgJiYgIShyID0gaS5uZXh0KCkpLmRvbmUpIGFyLnB1c2goci52YWx1ZSk7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZXJyb3IpIHsgZSA9IHsgZXJyb3I6IGVycm9yIH07IH1cclxuICAgIGZpbmFsbHkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChyICYmICFyLmRvbmUgJiYgKG0gPSBpW1wicmV0dXJuXCJdKSkgbS5jYWxsKGkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmaW5hbGx5IHsgaWYgKGUpIHRocm93IGUuZXJyb3I7IH1cclxuICAgIH1cclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuLyoqIEBkZXByZWNhdGVkICovXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZCgpIHtcclxuICAgIGZvciAodmFyIGFyID0gW10sIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIGFyID0gYXIuY29uY2F0KF9fcmVhZChhcmd1bWVudHNbaV0pKTtcclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuLyoqIEBkZXByZWNhdGVkICovXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZEFycmF5cygpIHtcclxuICAgIGZvciAodmFyIHMgPSAwLCBpID0gMCwgaWwgPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgaWw7IGkrKykgcyArPSBhcmd1bWVudHNbaV0ubGVuZ3RoO1xyXG4gICAgZm9yICh2YXIgciA9IEFycmF5KHMpLCBrID0gMCwgaSA9IDA7IGkgPCBpbDsgaSsrKVxyXG4gICAgICAgIGZvciAodmFyIGEgPSBhcmd1bWVudHNbaV0sIGogPSAwLCBqbCA9IGEubGVuZ3RoOyBqIDwgamw7IGorKywgaysrKVxyXG4gICAgICAgICAgICByW2tdID0gYVtqXTtcclxuICAgIHJldHVybiByO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWRBcnJheSh0bywgZnJvbSwgcGFjaykge1xyXG4gICAgaWYgKHBhY2sgfHwgYXJndW1lbnRzLmxlbmd0aCA9PT0gMikgZm9yICh2YXIgaSA9IDAsIGwgPSBmcm9tLmxlbmd0aCwgYXI7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICBpZiAoYXIgfHwgIShpIGluIGZyb20pKSB7XHJcbiAgICAgICAgICAgIGlmICghYXIpIGFyID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZnJvbSwgMCwgaSk7XHJcbiAgICAgICAgICAgIGFyW2ldID0gZnJvbVtpXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdG8uY29uY2F0KGFyIHx8IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGZyb20pKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXQodikge1xyXG4gICAgcmV0dXJuIHRoaXMgaW5zdGFuY2VvZiBfX2F3YWl0ID8gKHRoaXMudiA9IHYsIHRoaXMpIDogbmV3IF9fYXdhaXQodik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jR2VuZXJhdG9yKHRoaXNBcmcsIF9hcmd1bWVudHMsIGdlbmVyYXRvcikge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBnID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pLCBpLCBxID0gW107XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaWYgKGdbbl0pIGlbbl0gPSBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKGEsIGIpIHsgcS5wdXNoKFtuLCB2LCBhLCBiXSkgPiAxIHx8IHJlc3VtZShuLCB2KTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHJlc3VtZShuLCB2KSB7IHRyeSB7IHN0ZXAoZ1tuXSh2KSk7IH0gY2F0Y2ggKGUpIHsgc2V0dGxlKHFbMF1bM10sIGUpOyB9IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAocikgeyByLnZhbHVlIGluc3RhbmNlb2YgX19hd2FpdCA/IFByb21pc2UucmVzb2x2ZShyLnZhbHVlLnYpLnRoZW4oZnVsZmlsbCwgcmVqZWN0KSA6IHNldHRsZShxWzBdWzJdLCByKTsgfVxyXG4gICAgZnVuY3Rpb24gZnVsZmlsbCh2YWx1ZSkgeyByZXN1bWUoXCJuZXh0XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gcmVqZWN0KHZhbHVlKSB7IHJlc3VtZShcInRocm93XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKGYsIHYpIHsgaWYgKGYodiksIHEuc2hpZnQoKSwgcS5sZW5ndGgpIHJlc3VtZShxWzBdWzBdLCBxWzBdWzFdKTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0RlbGVnYXRvcihvKSB7XHJcbiAgICB2YXIgaSwgcDtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiwgZnVuY3Rpb24gKGUpIHsgdGhyb3cgZTsgfSksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4sIGYpIHsgaVtuXSA9IG9bbl0gPyBmdW5jdGlvbiAodikgeyByZXR1cm4gKHAgPSAhcCkgPyB7IHZhbHVlOiBfX2F3YWl0KG9bbl0odikpLCBkb25lOiBuID09PSBcInJldHVyblwiIH0gOiBmID8gZih2KSA6IHY7IH0gOiBmOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jVmFsdWVzKG8pIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgbSA9IG9bU3ltYm9sLmFzeW5jSXRlcmF0b3JdLCBpO1xyXG4gICAgcmV0dXJuIG0gPyBtLmNhbGwobykgOiAobyA9IHR5cGVvZiBfX3ZhbHVlcyA9PT0gXCJmdW5jdGlvblwiID8gX192YWx1ZXMobykgOiBvW1N5bWJvbC5pdGVyYXRvcl0oKSwgaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGkpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlbbl0gPSBvW25dICYmIGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7IHYgPSBvW25dKHYpLCBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCB2LmRvbmUsIHYudmFsdWUpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgZCwgdikgeyBQcm9taXNlLnJlc29sdmUodikudGhlbihmdW5jdGlvbih2KSB7IHJlc29sdmUoeyB2YWx1ZTogdiwgZG9uZTogZCB9KTsgfSwgcmVqZWN0KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tYWtlVGVtcGxhdGVPYmplY3QoY29va2VkLCByYXcpIHtcclxuICAgIGlmIChPYmplY3QuZGVmaW5lUHJvcGVydHkpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvb2tlZCwgXCJyYXdcIiwgeyB2YWx1ZTogcmF3IH0pOyB9IGVsc2UgeyBjb29rZWQucmF3ID0gcmF3OyB9XHJcbiAgICByZXR1cm4gY29va2VkO1xyXG59O1xyXG5cclxudmFyIF9fc2V0TW9kdWxlRGVmYXVsdCA9IE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgdikge1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIFwiZGVmYXVsdFwiLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2IH0pO1xyXG59KSA6IGZ1bmN0aW9uKG8sIHYpIHtcclxuICAgIG9bXCJkZWZhdWx0XCJdID0gdjtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydFN0YXIobW9kKSB7XHJcbiAgICBpZiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSByZXR1cm4gbW9kO1xyXG4gICAgdmFyIHJlc3VsdCA9IHt9O1xyXG4gICAgaWYgKG1vZCAhPSBudWxsKSBmb3IgKHZhciBrIGluIG1vZCkgaWYgKGsgIT09IFwiZGVmYXVsdFwiICYmIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtb2QsIGspKSBfX2NyZWF0ZUJpbmRpbmcocmVzdWx0LCBtb2QsIGspO1xyXG4gICAgX19zZXRNb2R1bGVEZWZhdWx0KHJlc3VsdCwgbW9kKTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydERlZmF1bHQobW9kKSB7XHJcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IGRlZmF1bHQ6IG1vZCB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19jbGFzc1ByaXZhdGVGaWVsZEdldChyZWNlaXZlciwgc3RhdGUsIGtpbmQsIGYpIHtcclxuICAgIGlmIChraW5kID09PSBcImFcIiAmJiAhZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlByaXZhdGUgYWNjZXNzb3Igd2FzIGRlZmluZWQgd2l0aG91dCBhIGdldHRlclwiKTtcclxuICAgIGlmICh0eXBlb2Ygc3RhdGUgPT09IFwiZnVuY3Rpb25cIiA/IHJlY2VpdmVyICE9PSBzdGF0ZSB8fCAhZiA6ICFzdGF0ZS5oYXMocmVjZWl2ZXIpKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IHJlYWQgcHJpdmF0ZSBtZW1iZXIgZnJvbSBhbiBvYmplY3Qgd2hvc2UgY2xhc3MgZGlkIG5vdCBkZWNsYXJlIGl0XCIpO1xyXG4gICAgcmV0dXJuIGtpbmQgPT09IFwibVwiID8gZiA6IGtpbmQgPT09IFwiYVwiID8gZi5jYWxsKHJlY2VpdmVyKSA6IGYgPyBmLnZhbHVlIDogc3RhdGUuZ2V0KHJlY2VpdmVyKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fY2xhc3NQcml2YXRlRmllbGRTZXQocmVjZWl2ZXIsIHN0YXRlLCB2YWx1ZSwga2luZCwgZikge1xyXG4gICAgaWYgKGtpbmQgPT09IFwibVwiKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiUHJpdmF0ZSBtZXRob2QgaXMgbm90IHdyaXRhYmxlXCIpO1xyXG4gICAgaWYgKGtpbmQgPT09IFwiYVwiICYmICFmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiUHJpdmF0ZSBhY2Nlc3NvciB3YXMgZGVmaW5lZCB3aXRob3V0IGEgc2V0dGVyXCIpO1xyXG4gICAgaWYgKHR5cGVvZiBzdGF0ZSA9PT0gXCJmdW5jdGlvblwiID8gcmVjZWl2ZXIgIT09IHN0YXRlIHx8ICFmIDogIXN0YXRlLmhhcyhyZWNlaXZlcikpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3Qgd3JpdGUgcHJpdmF0ZSBtZW1iZXIgdG8gYW4gb2JqZWN0IHdob3NlIGNsYXNzIGRpZCBub3QgZGVjbGFyZSBpdFwiKTtcclxuICAgIHJldHVybiAoa2luZCA9PT0gXCJhXCIgPyBmLmNhbGwocmVjZWl2ZXIsIHZhbHVlKSA6IGYgPyBmLnZhbHVlID0gdmFsdWUgOiBzdGF0ZS5zZXQocmVjZWl2ZXIsIHZhbHVlKSksIHZhbHVlO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19jbGFzc1ByaXZhdGVGaWVsZEluKHN0YXRlLCByZWNlaXZlcikge1xyXG4gICAgaWYgKHJlY2VpdmVyID09PSBudWxsIHx8ICh0eXBlb2YgcmVjZWl2ZXIgIT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIHJlY2VpdmVyICE9PSBcImZ1bmN0aW9uXCIpKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IHVzZSAnaW4nIG9wZXJhdG9yIG9uIG5vbi1vYmplY3RcIik7XHJcbiAgICByZXR1cm4gdHlwZW9mIHN0YXRlID09PSBcImZ1bmN0aW9uXCIgPyByZWNlaXZlciA9PT0gc3RhdGUgOiBzdGF0ZS5oYXMocmVjZWl2ZXIpO1xyXG59XHJcbiIsImNvbnN0IHJlZ0Vtb2ppID0gbmV3IFJlZ0V4cChcbiAgL1tcXHUyNzAwLVxcdTI3QkZdfFtcXHVFMDAwLVxcdUY4RkZdfFxcdUQ4M0NbXFx1REMwMC1cXHVERkZGXXxcXHVEODNEW1xcdURDMDAtXFx1REZGRl18W1xcdTIwMTEtXFx1MjZGRl18XFx1RDgzRVtcXHVERDEwLVxcdURERkZdfFtcXHVGRTBFLVxcdUZFMEZdLyxcbiAgXCJnXCJcbik7XG5cbmV4cG9ydCBmdW5jdGlvbiBhbGxBbHBoYWJldHModGV4dDogc3RyaW5nKTogYm9vbGVhbiB7XG4gIHJldHVybiBCb29sZWFuKHRleHQubWF0Y2goL15bYS16QS1aMC05Xy1dKyQvKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBleGNsdWRlRW1vamkodGV4dDogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHRleHQucmVwbGFjZShyZWdFbW9qaSwgXCJcIik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBleGNsdWRlU3BhY2UodGV4dDogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHRleHQucmVwbGFjZSgvIC9nLCBcIlwiKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxvd2VySW5jbHVkZXMob25lOiBzdHJpbmcsIG90aGVyOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuIG9uZS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKG90aGVyLnRvTG93ZXJDYXNlKCkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbG93ZXJJbmNsdWRlc1dpdGhvdXRTcGFjZShvbmU6IHN0cmluZywgb3RoZXI6IHN0cmluZyk6IGJvb2xlYW4ge1xuICByZXR1cm4gbG93ZXJJbmNsdWRlcyhleGNsdWRlU3BhY2Uob25lKSwgZXhjbHVkZVNwYWNlKG90aGVyKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsb3dlclN0YXJ0c1dpdGgoYTogc3RyaW5nLCBiOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuIGEudG9Mb3dlckNhc2UoKS5zdGFydHNXaXRoKGIudG9Mb3dlckNhc2UoKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsb3dlclN0YXJ0c1dpdGhvdXRTcGFjZShvbmU6IHN0cmluZywgb3RoZXI6IHN0cmluZyk6IGJvb2xlYW4ge1xuICByZXR1cm4gbG93ZXJTdGFydHNXaXRoKGV4Y2x1ZGVTcGFjZShvbmUpLCBleGNsdWRlU3BhY2Uob3RoZXIpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNhcGl0YWxpemVGaXJzdExldHRlcihzdHI6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiBzdHIuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzdHIuc2xpY2UoMSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiogc3BsaXRSYXcoXG4gIHRleHQ6IHN0cmluZyxcbiAgcmVnZXhwOiBSZWdFeHBcbik6IEl0ZXJhYmxlSXRlcmF0b3I8c3RyaW5nPiB7XG4gIGxldCBwcmV2aW91c0luZGV4ID0gMDtcbiAgZm9yIChsZXQgciBvZiB0ZXh0Lm1hdGNoQWxsKHJlZ2V4cCkpIHtcbiAgICBpZiAocHJldmlvdXNJbmRleCAhPT0gci5pbmRleCEpIHtcbiAgICAgIHlpZWxkIHRleHQuc2xpY2UocHJldmlvdXNJbmRleCwgci5pbmRleCEpO1xuICAgIH1cbiAgICB5aWVsZCB0ZXh0W3IuaW5kZXghXTtcbiAgICBwcmV2aW91c0luZGV4ID0gci5pbmRleCEgKyAxO1xuICB9XG5cbiAgaWYgKHByZXZpb3VzSW5kZXggIT09IHRleHQubGVuZ3RoKSB7XG4gICAgeWllbGQgdGV4dC5zbGljZShwcmV2aW91c0luZGV4LCB0ZXh0Lmxlbmd0aCk7XG4gIH1cbn1cbiIsImltcG9ydCB0eXBlIHsgVG9rZW5pemVyIH0gZnJvbSBcIi4uL3Rva2VuaXplclwiO1xuaW1wb3J0IHsgc3BsaXRSYXcgfSBmcm9tIFwiLi4vLi4vdXRpbC9zdHJpbmdzXCI7XG5cbmZ1bmN0aW9uIHBpY2tUb2tlbnMoY29udGVudDogc3RyaW5nLCB0cmltUGF0dGVybjogUmVnRXhwKTogc3RyaW5nW10ge1xuICByZXR1cm4gY29udGVudC5zcGxpdCh0cmltUGF0dGVybikuZmlsdGVyKCh4KSA9PiB4ICE9PSBcIlwiKTtcbn1cblxuZXhwb3J0IGNvbnN0IFRSSU1fQ0hBUl9QQVRURVJOID0gL1tcXG5cXHRcXFtcXF0kLzo/IT0oKTw+XCInLix8Oyp+IGBdL2c7XG5leHBvcnQgY2xhc3MgRGVmYXVsdFRva2VuaXplciBpbXBsZW1lbnRzIFRva2VuaXplciB7XG4gIHRva2VuaXplKGNvbnRlbnQ6IHN0cmluZywgcmF3PzogYm9vbGVhbik6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gcmF3XG4gICAgICA/IEFycmF5LmZyb20oc3BsaXRSYXcoY29udGVudCwgdGhpcy5nZXRUcmltUGF0dGVybigpKSkuZmlsdGVyKFxuICAgICAgICAgICh4KSA9PiB4ICE9PSBcIiBcIlxuICAgICAgICApXG4gICAgICA6IHBpY2tUb2tlbnMoY29udGVudCwgdGhpcy5nZXRUcmltUGF0dGVybigpKTtcbiAgfVxuXG4gIHJlY3Vyc2l2ZVRva2VuaXplKGNvbnRlbnQ6IHN0cmluZyk6IHsgd29yZDogc3RyaW5nOyBvZmZzZXQ6IG51bWJlciB9W10ge1xuICAgIGNvbnN0IHRyaW1JbmRleGVzID0gQXJyYXkuZnJvbShjb250ZW50Lm1hdGNoQWxsKHRoaXMuZ2V0VHJpbVBhdHRlcm4oKSkpXG4gICAgICAuc29ydCgoYSwgYikgPT4gYS5pbmRleCEgLSBiLmluZGV4ISlcbiAgICAgIC5tYXAoKHgpID0+IHguaW5kZXghKTtcbiAgICByZXR1cm4gW1xuICAgICAgeyB3b3JkOiBjb250ZW50LCBvZmZzZXQ6IDAgfSxcbiAgICAgIC4uLnRyaW1JbmRleGVzLm1hcCgoaSkgPT4gKHtcbiAgICAgICAgd29yZDogY29udGVudC5zbGljZShpICsgMSksXG4gICAgICAgIG9mZnNldDogaSArIDEsXG4gICAgICB9KSksXG4gICAgXTtcbiAgfVxuXG4gIGdldFRyaW1QYXR0ZXJuKCk6IFJlZ0V4cCB7XG4gICAgcmV0dXJuIFRSSU1fQ0hBUl9QQVRURVJOO1xuICB9XG5cbiAgc2hvdWxkSWdub3JlKHN0cjogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG4iLCJpbXBvcnQgeyBEZWZhdWx0VG9rZW5pemVyIH0gZnJvbSBcIi4vRGVmYXVsdFRva2VuaXplclwiO1xuXG5jb25zdCBBUkFCSUNfVFJJTV9DSEFSX1BBVFRFUk4gPSAvW1xcblxcdFxcW1xcXSQvOj8hPSgpPD5cIicuLHw7Kn4gYNiM2JtdL2c7XG5leHBvcnQgY2xhc3MgQXJhYmljVG9rZW5pemVyIGV4dGVuZHMgRGVmYXVsdFRva2VuaXplciB7XG4gIGdldFRyaW1QYXR0ZXJuKCk6IFJlZ0V4cCB7XG4gICAgcmV0dXJuIEFSQUJJQ19UUklNX0NIQVJfUEFUVEVSTjtcbiAgfVxufVxuIiwiLy8gQHRzLW5vY2hlY2tcbi8vIEJlY2F1c2UgdGhpcyBjb2RlIGlzIG9yaWdpbmFsbHkgamF2YXNjcmlwdCBjb2RlLlxuLy8gbm9pbnNwZWN0aW9uIEZ1bmN0aW9uVG9vTG9uZ0pTLEZ1bmN0aW9uV2l0aE11bHRpcGxlTG9vcHNKUyxFcXVhbGl0eUNvbXBhcmlzb25XaXRoQ29lcmNpb25KUyxQb2ludGxlc3NCb29sZWFuRXhwcmVzc2lvbkpTLEpTRGVjbGFyYXRpb25zQXRTY29wZVN0YXJ0XG5cbi8vIFRpbnlTZWdtZW50ZXIgMC4xIC0tIFN1cGVyIGNvbXBhY3QgSmFwYW5lc2UgdG9rZW5pemVyIGluIEphdmFzY3JpcHRcbi8vIChjKSAyMDA4IFRha3UgS3VkbyA8dGFrdUBjaGFzZW4ub3JnPlxuLy8gVGlueVNlZ21lbnRlciBpcyBmcmVlbHkgZGlzdHJpYnV0YWJsZSB1bmRlciB0aGUgdGVybXMgb2YgYSBuZXcgQlNEIGxpY2VuY2UuXG4vLyBGb3IgZGV0YWlscywgc2VlIGh0dHA6Ly9jaGFzZW4ub3JnL350YWt1L3NvZnR3YXJlL1RpbnlTZWdtZW50ZXIvTElDRU5DRS50eHRcblxuZnVuY3Rpb24gVGlueVNlZ21lbnRlcigpIHtcbiAgdmFyIHBhdHRlcm5zID0ge1xuICAgIFwiW+S4gOS6jOS4ieWbm+S6lOWFreS4g+WFq+S5neWNgeeZvuWNg+S4h+WEhOWFhl1cIjogXCJNXCIsXG4gICAgXCJb5LiALem+oOOAheOAhuODteODtl1cIjogXCJIXCIsXG4gICAgXCJb44GBLeOCk11cIjogXCJJXCIsXG4gICAgXCJb44KhLeODtOODvO+9sS3vvp3vvp7vvbBdXCI6IFwiS1wiLFxuICAgIFwiW2EtekEtWu+9gS3vvZrvvKEt77y6XVwiOiBcIkFcIixcbiAgICBcIlswLTnvvJAt77yZXVwiOiBcIk5cIixcbiAgfTtcbiAgdGhpcy5jaGFydHlwZV8gPSBbXTtcbiAgZm9yICh2YXIgaSBpbiBwYXR0ZXJucykge1xuICAgIHZhciByZWdleHAgPSBuZXcgUmVnRXhwKCk7XG4gICAgcmVnZXhwLmNvbXBpbGUoaSk7XG4gICAgdGhpcy5jaGFydHlwZV8ucHVzaChbcmVnZXhwLCBwYXR0ZXJuc1tpXV0pO1xuICB9XG5cbiAgdGhpcy5CSUFTX18gPSAtMzMyO1xuICB0aGlzLkJDMV9fID0geyBISDogNiwgSUk6IDI0NjEsIEtIOiA0MDYsIE9IOiAtMTM3OCB9O1xuICB0aGlzLkJDMl9fID0ge1xuICAgIEFBOiAtMzI2NyxcbiAgICBBSTogMjc0NCxcbiAgICBBTjogLTg3OCxcbiAgICBISDogLTQwNzAsXG4gICAgSE06IC0xNzExLFxuICAgIEhOOiA0MDEyLFxuICAgIEhPOiAzNzYxLFxuICAgIElBOiAxMzI3LFxuICAgIElIOiAtMTE4NCxcbiAgICBJSTogLTEzMzIsXG4gICAgSUs6IDE3MjEsXG4gICAgSU86IDU0OTIsXG4gICAgS0k6IDM4MzEsXG4gICAgS0s6IC04NzQxLFxuICAgIE1IOiAtMzEzMixcbiAgICBNSzogMzMzNCxcbiAgICBPTzogLTI5MjAsXG4gIH07XG4gIHRoaXMuQkMzX18gPSB7XG4gICAgSEg6IDk5NixcbiAgICBISTogNjI2LFxuICAgIEhLOiAtNzIxLFxuICAgIEhOOiAtMTMwNyxcbiAgICBITzogLTgzNixcbiAgICBJSDogLTMwMSxcbiAgICBLSzogMjc2MixcbiAgICBNSzogMTA3OSxcbiAgICBNTTogNDAzNCxcbiAgICBPQTogLTE2NTIsXG4gICAgT0g6IDI2NixcbiAgfTtcbiAgdGhpcy5CUDFfXyA9IHsgQkI6IDI5NSwgT0I6IDMwNCwgT086IC0xMjUsIFVCOiAzNTIgfTtcbiAgdGhpcy5CUDJfXyA9IHsgQk86IDYwLCBPTzogLTE3NjIgfTtcbiAgdGhpcy5CUTFfXyA9IHtcbiAgICBCSEg6IDExNTAsXG4gICAgQkhNOiAxNTIxLFxuICAgIEJJSTogLTExNTgsXG4gICAgQklNOiA4ODYsXG4gICAgQk1IOiAxMjA4LFxuICAgIEJOSDogNDQ5LFxuICAgIEJPSDogLTkxLFxuICAgIEJPTzogLTI1OTcsXG4gICAgT0hJOiA0NTEsXG4gICAgT0lIOiAtMjk2LFxuICAgIE9LQTogMTg1MSxcbiAgICBPS0g6IC0xMDIwLFxuICAgIE9LSzogOTA0LFxuICAgIE9PTzogMjk2NSxcbiAgfTtcbiAgdGhpcy5CUTJfXyA9IHtcbiAgICBCSEg6IDExOCxcbiAgICBCSEk6IC0xMTU5LFxuICAgIEJITTogNDY2LFxuICAgIEJJSDogLTkxOSxcbiAgICBCS0s6IC0xNzIwLFxuICAgIEJLTzogODY0LFxuICAgIE9ISDogLTExMzksXG4gICAgT0hNOiAtMTgxLFxuICAgIE9JSDogMTUzLFxuICAgIFVISTogLTExNDYsXG4gIH07XG4gIHRoaXMuQlEzX18gPSB7XG4gICAgQkhIOiAtNzkyLFxuICAgIEJISTogMjY2NCxcbiAgICBCSUk6IC0yOTksXG4gICAgQktJOiA0MTksXG4gICAgQk1IOiA5MzcsXG4gICAgQk1NOiA4MzM1LFxuICAgIEJOTjogOTk4LFxuICAgIEJPSDogNzc1LFxuICAgIE9ISDogMjE3NCxcbiAgICBPSE06IDQzOSxcbiAgICBPSUk6IDI4MCxcbiAgICBPS0g6IDE3OTgsXG4gICAgT0tJOiAtNzkzLFxuICAgIE9LTzogLTIyNDIsXG4gICAgT01IOiAtMjQwMixcbiAgICBPT086IDExNjk5LFxuICB9O1xuICB0aGlzLkJRNF9fID0ge1xuICAgIEJISDogLTM4OTUsXG4gICAgQklIOiAzNzYxLFxuICAgIEJJSTogLTQ2NTQsXG4gICAgQklLOiAxMzQ4LFxuICAgIEJLSzogLTE4MDYsXG4gICAgQk1JOiAtMzM4NSxcbiAgICBCT086IC0xMjM5NixcbiAgICBPQUg6IDkyNixcbiAgICBPSEg6IDI2NixcbiAgICBPSEs6IC0yMDM2LFxuICAgIE9OTjogLTk3MyxcbiAgfTtcbiAgdGhpcy5CVzFfXyA9IHtcbiAgICBcIizjgahcIjogNjYwLFxuICAgIFwiLOWQjFwiOiA3MjcsXG4gICAgQjHjgYI6IDE0MDQsXG4gICAgQjHlkIw6IDU0MixcbiAgICBcIuOAgeOBqFwiOiA2NjAsXG4gICAgXCLjgIHlkIxcIjogNzI3LFxuICAgIFwi44CN44GoXCI6IDE2ODIsXG4gICAg44GC44GjOiAxNTA1LFxuICAgIOOBhOOBhjogMTc0MyxcbiAgICDjgYTjgaM6IC0yMDU1LFxuICAgIOOBhOOCizogNjcyLFxuICAgIOOBhuOBlzogLTQ4MTcsXG4gICAg44GG44KTOiA2NjUsXG4gICAg44GL44KJOiAzNDcyLFxuICAgIOOBjOOCiTogNjAwLFxuICAgIOOBk+OBhjogLTc5MCxcbiAgICDjgZPjgag6IDIwODMsXG4gICAg44GT44KTOiAtMTI2MixcbiAgICDjgZXjgok6IC00MTQzLFxuICAgIOOBleOCkzogNDU3MyxcbiAgICDjgZfjgZ86IDI2NDEsXG4gICAg44GX44GmOiAxMTA0LFxuICAgIOOBmeOBpzogLTMzOTksXG4gICAg44Gd44GTOiAxOTc3LFxuICAgIOOBneOCjDogLTg3MSxcbiAgICDjgZ/jgaE6IDExMjIsXG4gICAg44Gf44KBOiA2MDEsXG4gICAg44Gj44GfOiAzNDYzLFxuICAgIOOBpOOBhDogLTgwMixcbiAgICDjgabjgYQ6IDgwNSxcbiAgICDjgabjgY06IDEyNDksXG4gICAg44Gn44GNOiAxMTI3LFxuICAgIOOBp+OBmTogMzQ0NSxcbiAgICDjgafjga86IDg0NCxcbiAgICDjgajjgYQ6IC00OTE1LFxuICAgIOOBqOOBvzogMTkyMixcbiAgICDjganjgZM6IDM4ODcsXG4gICAg44Gq44GEOiA1NzEzLFxuICAgIOOBquOBozogMzAxNSxcbiAgICDjgarjgak6IDczNzksXG4gICAg44Gq44KTOiAtMTExMyxcbiAgICDjgavjgZc6IDI0NjgsXG4gICAg44Gr44GvOiAxNDk4LFxuICAgIOOBq+OCgjogMTY3MSxcbiAgICDjgavlr746IC05MTIsXG4gICAg44Gu5LiAOiAtNTAxLFxuICAgIOOBruS4rTogNzQxLFxuICAgIOOBvuOBmzogMjQ0OCxcbiAgICDjgb7jgac6IDE3MTEsXG4gICAg44G+44G+OiAyNjAwLFxuICAgIOOBvuOCizogLTIxNTUsXG4gICAg44KE44KAOiAtMTk0NyxcbiAgICDjgojjgaM6IC0yNTY1LFxuICAgIOOCjOOBnzogMjM2OSxcbiAgICDjgozjgac6IC05MTMsXG4gICAg44KS44GXOiAxODYwLFxuICAgIOOCkuimizogNzMxLFxuICAgIOS6oeOBjzogLTE4ODYsXG4gICAg5Lqs6YO9OiAyNTU4LFxuICAgIOWPluOCijogLTI3ODQsXG4gICAg5aSn44GNOiAtMjYwNCxcbiAgICDlpKfpmKo6IDE0OTcsXG4gICAg5bmz5pa5OiAtMjMxNCxcbiAgICDlvJXjgY06IC0xMzM2LFxuICAgIOaXpeacrDogLTE5NSxcbiAgICDmnKzlvZM6IC0yNDIzLFxuICAgIOavjuaXpTogLTIxMTMsXG4gICAg55uu5oyHOiAtNzI0LFxuICAgIO+8ou+8keOBgjogMTQwNCxcbiAgICDvvKLvvJHlkIw6IDU0MixcbiAgICBcIu+9o+OBqFwiOiAxNjgyLFxuICB9O1xuICB0aGlzLkJXMl9fID0ge1xuICAgIFwiLi5cIjogLTExODIyLFxuICAgIDExOiAtNjY5LFxuICAgIFwi4oCV4oCVXCI6IC01NzMwLFxuICAgIFwi4oiS4oiSXCI6IC0xMzE3NSxcbiAgICDjgYTjgYY6IC0xNjA5LFxuICAgIOOBhuOBizogMjQ5MCxcbiAgICDjgYvjgZc6IC0xMzUwLFxuICAgIOOBi+OCgjogLTYwMixcbiAgICDjgYvjgok6IC03MTk0LFxuICAgIOOBi+OCjDogNDYxMixcbiAgICDjgYzjgYQ6IDg1MyxcbiAgICDjgYzjgok6IC0zMTk4LFxuICAgIOOBjeOBnzogMTk0MSxcbiAgICDjgY/jgao6IC0xNTk3LFxuICAgIOOBk+OBqDogLTgzOTIsXG4gICAg44GT44GuOiAtNDE5MyxcbiAgICDjgZXjgZs6IDQ1MzMsXG4gICAg44GV44KMOiAxMzE2OCxcbiAgICDjgZXjgpM6IC0zOTc3LFxuICAgIOOBl+OBhDogLTE4MTksXG4gICAg44GX44GLOiAtNTQ1LFxuICAgIOOBl+OBnzogNTA3OCxcbiAgICDjgZfjgaY6IDk3MixcbiAgICDjgZfjgao6IDkzOSxcbiAgICDjgZ3jga46IC0zNzQ0LFxuICAgIOOBn+OBhDogLTEyNTMsXG4gICAg44Gf44GfOiAtNjYyLFxuICAgIOOBn+OBoDogLTM4NTcsXG4gICAg44Gf44GhOiAtNzg2LFxuICAgIOOBn+OBqDogMTIyNCxcbiAgICDjgZ/jga86IC05MzksXG4gICAg44Gj44GfOiA0NTg5LFxuICAgIOOBo+OBpjogMTY0NyxcbiAgICDjgaPjgag6IC0yMDk0LFxuICAgIOOBpuOBhDogNjE0NCxcbiAgICDjgabjgY06IDM2NDAsXG4gICAg44Gm44GPOiAyNTUxLFxuICAgIOOBpuOBrzogLTMxMTAsXG4gICAg44Gm44KCOiAtMzA2NSxcbiAgICDjgafjgYQ6IDI2NjYsXG4gICAg44Gn44GNOiAtMTUyOCxcbiAgICDjgafjgZc6IC0zODI4LFxuICAgIOOBp+OBmTogLTQ3NjEsXG4gICAg44Gn44KCOiAtNDIwMyxcbiAgICDjgajjgYQ6IDE4OTAsXG4gICAg44Go44GTOiAtMTc0NixcbiAgICDjgajjgag6IC0yMjc5LFxuICAgIOOBqOOBrjogNzIwLFxuICAgIOOBqOOBvzogNTE2OCxcbiAgICDjgajjgoI6IC0zOTQxLFxuICAgIOOBquOBhDogLTI0ODgsXG4gICAg44Gq44GMOiAtMTMxMyxcbiAgICDjgarjgak6IC02NTA5LFxuICAgIOOBquOBrjogMjYxNCxcbiAgICDjgarjgpM6IDMwOTksXG4gICAg44Gr44GKOiAtMTYxNSxcbiAgICDjgavjgZc6IDI3NDgsXG4gICAg44Gr44GqOiAyNDU0LFxuICAgIOOBq+OCiDogLTcyMzYsXG4gICAg44Gr5a++OiAtMTQ5NDMsXG4gICAg44Gr5b6TOiAtNDY4OCxcbiAgICDjgavplqI6IC0xMTM4OCxcbiAgICDjga7jgYs6IDIwOTMsXG4gICAg44Gu44GnOiAtNzA1OSxcbiAgICDjga7jgas6IC02MDQxLFxuICAgIOOBruOBrjogLTYxMjUsXG4gICAg44Gv44GEOiAxMDczLFxuICAgIOOBr+OBjDogLTEwMzMsXG4gICAg44Gv44GaOiAtMjUzMixcbiAgICDjgbDjgow6IDE4MTMsXG4gICAg44G+44GXOiAtMTMxNixcbiAgICDjgb7jgac6IC02NjIxLFxuICAgIOOBvuOCjDogNTQwOSxcbiAgICDjgoHjgaY6IC0zMTUzLFxuICAgIOOCguOBhDogMjIzMCxcbiAgICDjgoLjga46IC0xMDcxMyxcbiAgICDjgonjgYs6IC05NDQsXG4gICAg44KJ44GXOiAtMTYxMSxcbiAgICDjgonjgas6IC0xODk3LFxuICAgIOOCiuOBlzogNjUxLFxuICAgIOOCiuOBvjogMTYyMCxcbiAgICDjgozjgZ86IDQyNzAsXG4gICAg44KM44GmOiA4NDksXG4gICAg44KM44GwOiA0MTE0LFxuICAgIOOCjeOBhjogNjA2NyxcbiAgICDjgo/jgow6IDc5MDEsXG4gICAg44KS6YCaOiAtMTE4NzcsXG4gICAg44KT44GgOiA3MjgsXG4gICAg44KT44GqOiAtNDExNSxcbiAgICDkuIDkuro6IDYwMixcbiAgICDkuIDmlrk6IC0xMzc1LFxuICAgIOS4gOaXpTogOTcwLFxuICAgIOS4gOmDqDogLTEwNTEsXG4gICAg5LiK44GMOiAtNDQ3OSxcbiAgICDkvJrnpL46IC0xMTE2LFxuICAgIOWHuuOBpjogMjE2MyxcbiAgICDliIbjga46IC03NzU4LFxuICAgIOWQjOWFmjogOTcwLFxuICAgIOWQjOaXpTogLTkxMyxcbiAgICDlpKfpmKo6IC0yNDcxLFxuICAgIOWnlOWToTogLTEyNTAsXG4gICAg5bCR44GqOiAtMTA1MCxcbiAgICDlubTluqY6IC04NjY5LFxuICAgIOW5tOmWkzogLTE2MjYsXG4gICAg5bqc55yMOiAtMjM2MyxcbiAgICDmiYvmqKk6IC0xOTgyLFxuICAgIOaWsOiBnjogLTQwNjYsXG4gICAg5pel5pawOiAtNzIyLFxuICAgIOaXpeacrDogLTcwNjgsXG4gICAg5pel57GzOiAzMzcyLFxuICAgIOabnOaXpTogLTYwMSxcbiAgICDmnJ3prq46IC0yMzU1LFxuICAgIOacrOS6ujogLTI2OTcsXG4gICAg5p2x5LqsOiAtMTU0MyxcbiAgICDnhLbjgag6IC0xMzg0LFxuICAgIOekvuS8mjogLTEyNzYsXG4gICAg56uL44GmOiAtOTkwLFxuICAgIOesrOOBqzogLTE2MTIsXG4gICAg57Gz5Zu9OiAtNDI2OCxcbiAgICBcIu+8ke+8kVwiOiAtNjY5LFxuICB9O1xuICB0aGlzLkJXM19fID0ge1xuICAgIOOBguOBnzogLTIxOTQsXG4gICAg44GC44KKOiA3MTksXG4gICAg44GC44KLOiAzODQ2LFxuICAgIFwi44GELlwiOiAtMTE4NSxcbiAgICBcIuOBhOOAglwiOiAtMTE4NSxcbiAgICDjgYTjgYQ6IDUzMDgsXG4gICAg44GE44GIOiAyMDc5LFxuICAgIOOBhOOBjzogMzAyOSxcbiAgICDjgYTjgZ86IDIwNTYsXG4gICAg44GE44GjOiAxODgzLFxuICAgIOOBhOOCizogNTYwMCxcbiAgICDjgYTjgo86IDE1MjcsXG4gICAg44GG44GhOiAxMTE3LFxuICAgIOOBhuOBqDogNDc5OCxcbiAgICDjgYjjgag6IDE0NTQsXG4gICAgXCLjgYsuXCI6IDI4NTcsXG4gICAgXCLjgYvjgIJcIjogMjg1NyxcbiAgICDjgYvjgZE6IC03NDMsXG4gICAg44GL44GjOiAtNDA5OCxcbiAgICDjgYvjgas6IC02NjksXG4gICAg44GL44KJOiA2NTIwLFxuICAgIOOBi+OCijogLTI2NzAsXG4gICAgXCLjgYwsXCI6IDE4MTYsXG4gICAgXCLjgYzjgIFcIjogMTgxNixcbiAgICDjgYzjgY06IC00ODU1LFxuICAgIOOBjOOBkTogLTExMjcsXG4gICAg44GM44GjOiAtOTEzLFxuICAgIOOBjOOCiTogLTQ5NzcsXG4gICAg44GM44KKOiAtMjA2NCxcbiAgICDjgY3jgZ86IDE2NDUsXG4gICAg44GR44GpOiAxMzc0LFxuICAgIOOBk+OBqDogNzM5NyxcbiAgICDjgZPjga46IDE1NDIsXG4gICAg44GT44KNOiAtMjc1NyxcbiAgICDjgZXjgYQ6IC03MTQsXG4gICAg44GV44KSOiA5NzYsXG4gICAgXCLjgZcsXCI6IDE1NTcsXG4gICAgXCLjgZfjgIFcIjogMTU1NyxcbiAgICDjgZfjgYQ6IC0zNzE0LFxuICAgIOOBl+OBnzogMzU2MixcbiAgICDjgZfjgaY6IDE0NDksXG4gICAg44GX44GqOiAyNjA4LFxuICAgIOOBl+OBvjogMTIwMCxcbiAgICBcIuOBmS5cIjogLTEzMTAsXG4gICAgXCLjgZnjgIJcIjogLTEzMTAsXG4gICAg44GZ44KLOiA2NTIxLFxuICAgIFwi44GaLFwiOiAzNDI2LFxuICAgIFwi44Ga44CBXCI6IDM0MjYsXG4gICAg44Ga44GrOiA4NDEsXG4gICAg44Gd44GGOiA0MjgsXG4gICAgXCLjgZ8uXCI6IDg4NzUsXG4gICAgXCLjgZ/jgIJcIjogODg3NSxcbiAgICDjgZ/jgYQ6IC01OTQsXG4gICAg44Gf44GuOiA4MTIsXG4gICAg44Gf44KKOiAtMTE4MyxcbiAgICDjgZ/jgos6IC04NTMsXG4gICAgXCLjgaAuXCI6IDQwOTgsXG4gICAgXCLjgaDjgIJcIjogNDA5OCxcbiAgICDjgaDjgaM6IDEwMDQsXG4gICAg44Gj44GfOiAtNDc0OCxcbiAgICDjgaPjgaY6IDMwMCxcbiAgICDjgabjgYQ6IDYyNDAsXG4gICAg44Gm44GKOiA4NTUsXG4gICAg44Gm44KCOiAzMDIsXG4gICAg44Gn44GZOiAxNDM3LFxuICAgIOOBp+OBqzogLTE0ODIsXG4gICAg44Gn44GvOiAyMjk1LFxuICAgIOOBqOOBhjogLTEzODcsXG4gICAg44Go44GXOiAyMjY2LFxuICAgIOOBqOOBrjogNTQxLFxuICAgIOOBqOOCgjogLTM1NDMsXG4gICAg44Gp44GGOiA0NjY0LFxuICAgIOOBquOBhDogMTc5NixcbiAgICDjgarjgY86IC05MDMsXG4gICAg44Gq44GpOiAyMTM1LFxuICAgIFwi44GrLFwiOiAtMTAyMSxcbiAgICBcIuOBq+OAgVwiOiAtMTAyMSxcbiAgICDjgavjgZc6IDE3NzEsXG4gICAg44Gr44GqOiAxOTA2LFxuICAgIOOBq+OBrzogMjY0NCxcbiAgICBcIuOBrixcIjogLTcyNCxcbiAgICBcIuOBruOAgVwiOiAtNzI0LFxuICAgIOOBruWtkDogLTEwMDAsXG4gICAgXCLjga8sXCI6IDEzMzcsXG4gICAgXCLjga/jgIFcIjogMTMzNyxcbiAgICDjgbnjgY06IDIxODEsXG4gICAg44G+44GXOiAxMTEzLFxuICAgIOOBvuOBmTogNjk0MyxcbiAgICDjgb7jgaM6IC0xNTQ5LFxuICAgIOOBvuOBpzogNjE1NCxcbiAgICDjgb7jgow6IC03OTMsXG4gICAg44KJ44GXOiAxNDc5LFxuICAgIOOCieOCjDogNjgyMCxcbiAgICDjgovjgos6IDM4MTgsXG4gICAgXCLjgowsXCI6IDg1NCxcbiAgICBcIuOCjOOAgVwiOiA4NTQsXG4gICAg44KM44GfOiAxODUwLFxuICAgIOOCjOOBpjogMTM3NSxcbiAgICDjgozjgbA6IC0zMjQ2LFxuICAgIOOCjOOCizogMTA5MSxcbiAgICDjgo/jgow6IC02MDUsXG4gICAg44KT44GgOiA2MDYsXG4gICAg44KT44GnOiA3OTgsXG4gICAg44Kr5pyIOiA5OTAsXG4gICAg5Lya6K2wOiA4NjAsXG4gICAg5YWl44KKOiAxMjMyLFxuICAgIOWkp+S8mjogMjIxNyxcbiAgICDlp4vjgoE6IDE2ODEsXG4gICAg5biCOiA5NjUsXG4gICAg5paw6IGeOiAtNTA1NSxcbiAgICBcIuaXpSxcIjogOTc0LFxuICAgIFwi5pel44CBXCI6IDk3NCxcbiAgICDnpL7kvJo6IDIwMjQsXG4gICAg77225pyIOiA5OTAsXG4gIH07XG4gIHRoaXMuVEMxX18gPSB7XG4gICAgQUFBOiAxMDkzLFxuICAgIEhISDogMTAyOSxcbiAgICBISE06IDU4MCxcbiAgICBISUk6IDk5OCxcbiAgICBIT0g6IC0zOTAsXG4gICAgSE9NOiAtMzMxLFxuICAgIElISTogMTE2OSxcbiAgICBJT0g6IC0xNDIsXG4gICAgSU9JOiAtMTAxNSxcbiAgICBJT006IDQ2NyxcbiAgICBNTUg6IDE4NyxcbiAgICBPT0k6IC0xODMyLFxuICB9O1xuICB0aGlzLlRDMl9fID0ge1xuICAgIEhITzogMjA4OCxcbiAgICBISUk6IC0xMDIzLFxuICAgIEhNTTogLTExNTQsXG4gICAgSUhJOiAtMTk2NSxcbiAgICBLS0g6IDcwMyxcbiAgICBPSUk6IC0yNjQ5LFxuICB9O1xuICB0aGlzLlRDM19fID0ge1xuICAgIEFBQTogLTI5NCxcbiAgICBISEg6IDM0NixcbiAgICBISEk6IC0zNDEsXG4gICAgSElJOiAtMTA4OCxcbiAgICBISUs6IDczMSxcbiAgICBIT0g6IC0xNDg2LFxuICAgIElISDogMTI4LFxuICAgIElISTogLTMwNDEsXG4gICAgSUhPOiAtMTkzNSxcbiAgICBJSUg6IC04MjUsXG4gICAgSUlNOiAtMTAzNSxcbiAgICBJT0k6IC01NDIsXG4gICAgS0hIOiAtMTIxNixcbiAgICBLS0E6IDQ5MSxcbiAgICBLS0g6IC0xMjE3LFxuICAgIEtPSzogLTEwMDksXG4gICAgTUhIOiAtMjY5NCxcbiAgICBNSE06IC00NTcsXG4gICAgTUhPOiAxMjMsXG4gICAgTU1IOiAtNDcxLFxuICAgIE5OSDogLTE2ODksXG4gICAgTk5POiA2NjIsXG4gICAgT0hPOiAtMzM5MyxcbiAgfTtcbiAgdGhpcy5UQzRfXyA9IHtcbiAgICBISEg6IC0yMDMsXG4gICAgSEhJOiAxMzQ0LFxuICAgIEhISzogMzY1LFxuICAgIEhITTogLTEyMixcbiAgICBISE46IDE4MixcbiAgICBISE86IDY2OSxcbiAgICBISUg6IDgwNCxcbiAgICBISUk6IDY3OSxcbiAgICBIT0g6IDQ0NixcbiAgICBJSEg6IDY5NSxcbiAgICBJSE86IC0yMzI0LFxuICAgIElJSDogMzIxLFxuICAgIElJSTogMTQ5NyxcbiAgICBJSU86IDY1NixcbiAgICBJT086IDU0LFxuICAgIEtBSzogNDg0NSxcbiAgICBLS0E6IDMzODYsXG4gICAgS0tLOiAzMDY1LFxuICAgIE1ISDogLTQwNSxcbiAgICBNSEk6IDIwMSxcbiAgICBNTUg6IC0yNDEsXG4gICAgTU1NOiA2NjEsXG4gICAgTU9NOiA4NDEsXG4gIH07XG4gIHRoaXMuVFExX18gPSB7XG4gICAgQkhISDogLTIyNyxcbiAgICBCSEhJOiAzMTYsXG4gICAgQkhJSDogLTEzMixcbiAgICBCSUhIOiA2MCxcbiAgICBCSUlJOiAxNTk1LFxuICAgIEJOSEg6IC03NDQsXG4gICAgQk9ISDogMjI1LFxuICAgIEJPT086IC05MDgsXG4gICAgT0FLSzogNDgyLFxuICAgIE9ISEg6IDI4MSxcbiAgICBPSElIOiAyNDksXG4gICAgT0lISTogMjAwLFxuICAgIE9JSUg6IC02OCxcbiAgfTtcbiAgdGhpcy5UUTJfXyA9IHsgQklISDogLTE0MDEsIEJJSUk6IC0xMDMzLCBCS0FLOiAtNTQzLCBCT09POiAtNTU5MSB9O1xuICB0aGlzLlRRM19fID0ge1xuICAgIEJISEg6IDQ3OCxcbiAgICBCSEhNOiAtMTA3MyxcbiAgICBCSElIOiAyMjIsXG4gICAgQkhJSTogLTUwNCxcbiAgICBCSUlIOiAtMTE2LFxuICAgIEJJSUk6IC0xMDUsXG4gICAgQk1ISTogLTg2MyxcbiAgICBCTUhNOiAtNDY0LFxuICAgIEJPTUg6IDYyMCxcbiAgICBPSEhIOiAzNDYsXG4gICAgT0hISTogMTcyOSxcbiAgICBPSElJOiA5OTcsXG4gICAgT0hNSDogNDgxLFxuICAgIE9JSEg6IDYyMyxcbiAgICBPSUlIOiAxMzQ0LFxuICAgIE9LQUs6IDI3OTIsXG4gICAgT0tISDogNTg3LFxuICAgIE9LS0E6IDY3OSxcbiAgICBPT0hIOiAxMTAsXG4gICAgT09JSTogLTY4NSxcbiAgfTtcbiAgdGhpcy5UUTRfXyA9IHtcbiAgICBCSEhIOiAtNzIxLFxuICAgIEJISE06IC0zNjA0LFxuICAgIEJISUk6IC05NjYsXG4gICAgQklJSDogLTYwNyxcbiAgICBCSUlJOiAtMjE4MSxcbiAgICBPQUFBOiAtMjc2MyxcbiAgICBPQUtLOiAxODAsXG4gICAgT0hISDogLTI5NCxcbiAgICBPSEhJOiAyNDQ2LFxuICAgIE9ISE86IDQ4MCxcbiAgICBPSElIOiAtMTU3MyxcbiAgICBPSUhIOiAxOTM1LFxuICAgIE9JSEk6IC00OTMsXG4gICAgT0lJSDogNjI2LFxuICAgIE9JSUk6IC00MDA3LFxuICAgIE9LQUs6IC04MTU2LFxuICB9O1xuICB0aGlzLlRXMV9fID0geyDjgavjgaTjgYQ6IC00NjgxLCDmnbHkuqzpg706IDIwMjYgfTtcbiAgdGhpcy5UVzJfXyA9IHtcbiAgICDjgYLjgovnqIs6IC0yMDQ5LFxuICAgIOOBhOOBo+OBnzogLTEyNTYsXG4gICAg44GT44KN44GMOiAtMjQzNCxcbiAgICDjgZfjgofjgYY6IDM4NzMsXG4gICAg44Gd44Gu5b6MOiAtNDQzMCxcbiAgICDjgaDjgaPjgaY6IC0xMDQ5LFxuICAgIOOBpuOBhOOBnzogMTgzMyxcbiAgICDjgajjgZfjgaY6IC00NjU3LFxuICAgIOOBqOOCguOBqzogLTQ1MTcsXG4gICAg44KC44Gu44GnOiAxODgyLFxuICAgIOS4gOawl+OBqzogLTc5MixcbiAgICDliJ3jgoHjgaY6IC0xNTEyLFxuICAgIOWQjOaZguOBqzogLTgwOTcsXG4gICAg5aSn44GN44GqOiAtMTI1NSxcbiAgICDlr77jgZfjgaY6IC0yNzIxLFxuICAgIOekvuS8muWFmjogLTMyMTYsXG4gIH07XG4gIHRoaXMuVFczX18gPSB7XG4gICAg44GE44Gf44GgOiAtMTczNCxcbiAgICDjgZfjgabjgYQ6IDEzMTQsXG4gICAg44Go44GX44GmOiAtNDMxNCxcbiAgICDjgavjgaTjgYQ6IC01NDgzLFxuICAgIOOBq+OBqOOBozogLTU5ODksXG4gICAg44Gr5b2T44GfOiAtNjI0NyxcbiAgICBcIuOBruOBpyxcIjogLTcyNyxcbiAgICBcIuOBruOBp+OAgVwiOiAtNzI3LFxuICAgIOOBruOCguOBrjogLTYwMCxcbiAgICDjgozjgYvjgok6IC0zNzUyLFxuICAgIOWNgeS6jOaciDogLTIyODcsXG4gIH07XG4gIHRoaXMuVFc0X18gPSB7XG4gICAgXCLjgYTjgYYuXCI6IDg1NzYsXG4gICAgXCLjgYTjgYbjgIJcIjogODU3NixcbiAgICDjgYvjgonjgao6IC0yMzQ4LFxuICAgIOOBl+OBpuOBhDogMjk1OCxcbiAgICBcIuOBn+OBjCxcIjogMTUxNixcbiAgICBcIuOBn+OBjOOAgVwiOiAxNTE2LFxuICAgIOOBpuOBhOOCizogMTUzOCxcbiAgICDjgajjgYTjgYY6IDEzNDksXG4gICAg44G+44GX44GfOiA1NTQzLFxuICAgIOOBvuOBm+OCkzogMTA5NyxcbiAgICDjgojjgYbjgag6IC00MjU4LFxuICAgIOOCiOOCi+OBqDogNTg2NSxcbiAgfTtcbiAgdGhpcy5VQzFfXyA9IHsgQTogNDg0LCBLOiA5MywgTTogNjQ1LCBPOiAtNTA1IH07XG4gIHRoaXMuVUMyX18gPSB7IEE6IDgxOSwgSDogMTA1OSwgSTogNDA5LCBNOiAzOTg3LCBOOiA1Nzc1LCBPOiA2NDYgfTtcbiAgdGhpcy5VQzNfXyA9IHsgQTogLTEzNzAsIEk6IDIzMTEgfTtcbiAgdGhpcy5VQzRfXyA9IHtcbiAgICBBOiAtMjY0MyxcbiAgICBIOiAxODA5LFxuICAgIEk6IC0xMDMyLFxuICAgIEs6IC0zNDUwLFxuICAgIE06IDM1NjUsXG4gICAgTjogMzg3NixcbiAgICBPOiA2NjQ2LFxuICB9O1xuICB0aGlzLlVDNV9fID0geyBIOiAzMTMsIEk6IC0xMjM4LCBLOiAtNzk5LCBNOiA1MzksIE86IC04MzEgfTtcbiAgdGhpcy5VQzZfXyA9IHsgSDogLTUwNiwgSTogLTI1MywgSzogODcsIE06IDI0NywgTzogLTM4NyB9O1xuICB0aGlzLlVQMV9fID0geyBPOiAtMjE0IH07XG4gIHRoaXMuVVAyX18gPSB7IEI6IDY5LCBPOiA5MzUgfTtcbiAgdGhpcy5VUDNfXyA9IHsgQjogMTg5IH07XG4gIHRoaXMuVVExX18gPSB7XG4gICAgQkg6IDIxLFxuICAgIEJJOiAtMTIsXG4gICAgQks6IC05OSxcbiAgICBCTjogMTQyLFxuICAgIEJPOiAtNTYsXG4gICAgT0g6IC05NSxcbiAgICBPSTogNDc3LFxuICAgIE9LOiA0MTAsXG4gICAgT086IC0yNDIyLFxuICB9O1xuICB0aGlzLlVRMl9fID0geyBCSDogMjE2LCBCSTogMTEzLCBPSzogMTc1OSB9O1xuICB0aGlzLlVRM19fID0ge1xuICAgIEJBOiAtNDc5LFxuICAgIEJIOiA0MixcbiAgICBCSTogMTkxMyxcbiAgICBCSzogLTcxOTgsXG4gICAgQk06IDMxNjAsXG4gICAgQk46IDY0MjcsXG4gICAgQk86IDE0NzYxLFxuICAgIE9JOiAtODI3LFxuICAgIE9OOiAtMzIxMixcbiAgfTtcbiAgdGhpcy5VVzFfXyA9IHtcbiAgICBcIixcIjogMTU2LFxuICAgIFwi44CBXCI6IDE1NixcbiAgICBcIuOAjFwiOiAtNDYzLFxuICAgIOOBgjogLTk0MSxcbiAgICDjgYY6IC0xMjcsXG4gICAg44GMOiAtNTUzLFxuICAgIOOBjTogMTIxLFxuICAgIOOBkzogNTA1LFxuICAgIOOBpzogLTIwMSxcbiAgICDjgag6IC01NDcsXG4gICAg44GpOiAtMTIzLFxuICAgIOOBqzogLTc4OSxcbiAgICDjga46IC0xODUsXG4gICAg44GvOiAtODQ3LFxuICAgIOOCgjogLTQ2NixcbiAgICDjgoQ6IC00NzAsXG4gICAg44KIOiAxODIsXG4gICAg44KJOiAtMjkyLFxuICAgIOOCijogMjA4LFxuICAgIOOCjDogMTY5LFxuICAgIOOCkjogLTQ0NixcbiAgICDjgpM6IC0xMzcsXG4gICAgXCLjg7tcIjogLTEzNSxcbiAgICDkuLs6IC00MDIsXG4gICAg5LqsOiAtMjY4LFxuICAgIOWMujogLTkxMixcbiAgICDljYg6IDg3MSxcbiAgICDlm706IC00NjAsXG4gICAg5aSnOiA1NjEsXG4gICAg5aeUOiA3MjksXG4gICAg5biCOiAtNDExLFxuICAgIOaXpTogLTE0MSxcbiAgICDnkIY6IDM2MSxcbiAgICDnlJ86IC00MDgsXG4gICAg55yMOiAtMzg2LFxuICAgIOmDvTogLTcxOCxcbiAgICBcIu+9olwiOiAtNDYzLFxuICAgIFwi772lXCI6IC0xMzUsXG4gIH07XG4gIHRoaXMuVVcyX18gPSB7XG4gICAgXCIsXCI6IC04MjksXG4gICAgXCLjgIFcIjogLTgyOSxcbiAgICDjgIc6IDg5MixcbiAgICBcIuOAjFwiOiAtNjQ1LFxuICAgIFwi44CNXCI6IDMxNDUsXG4gICAg44GCOiAtNTM4LFxuICAgIOOBhDogNTA1LFxuICAgIOOBhjogMTM0LFxuICAgIOOBijogLTUwMixcbiAgICDjgYs6IDE0NTQsXG4gICAg44GMOiAtODU2LFxuICAgIOOBjzogLTQxMixcbiAgICDjgZM6IDExNDEsXG4gICAg44GVOiA4NzgsXG4gICAg44GWOiA1NDAsXG4gICAg44GXOiAxNTI5LFxuICAgIOOBmTogLTY3NSxcbiAgICDjgZs6IDMwMCxcbiAgICDjgZ06IC0xMDExLFxuICAgIOOBnzogMTg4LFxuICAgIOOBoDogMTgzNyxcbiAgICDjgaQ6IC05NDksXG4gICAg44GmOiAtMjkxLFxuICAgIOOBpzogLTI2OCxcbiAgICDjgag6IC05ODEsXG4gICAg44GpOiAxMjczLFxuICAgIOOBqjogMTA2MyxcbiAgICDjgas6IC0xNzY0LFxuICAgIOOBrjogMTMwLFxuICAgIOOBrzogLTQwOSxcbiAgICDjgbI6IC0xMjczLFxuICAgIOOBuTogMTI2MSxcbiAgICDjgb46IDYwMCxcbiAgICDjgoI6IC0xMjYzLFxuICAgIOOChDogLTQwMixcbiAgICDjgog6IDE2MzksXG4gICAg44KKOiAtNTc5LFxuICAgIOOCizogLTY5NCxcbiAgICDjgow6IDU3MSxcbiAgICDjgpI6IC0yNTE2LFxuICAgIOOCkzogMjA5NSxcbiAgICDjgqI6IC01ODcsXG4gICAg44KrOiAzMDYsXG4gICAg44KtOiA1NjgsXG4gICAg44ODOiA4MzEsXG4gICAg5LiJOiAtNzU4LFxuICAgIOS4jTogLTIxNTAsXG4gICAg5LiWOiAtMzAyLFxuICAgIOS4rTogLTk2OCxcbiAgICDkuLs6IC04NjEsXG4gICAg5LqLOiA0OTIsXG4gICAg5Lq6OiAtMTIzLFxuICAgIOS8mjogOTc4LFxuICAgIOS/nTogMzYyLFxuICAgIOWFpTogNTQ4LFxuICAgIOWInTogLTMwMjUsXG4gICAg5YmvOiAtMTU2NixcbiAgICDljJc6IC0zNDE0LFxuICAgIOWMujogLTQyMixcbiAgICDlpKc6IC0xNzY5LFxuICAgIOWkqTogLTg2NSxcbiAgICDlpKo6IC00ODMsXG4gICAg5a2QOiAtMTUxOSxcbiAgICDlraY6IDc2MCxcbiAgICDlrp86IDEwMjMsXG4gICAg5bCPOiAtMjAwOSxcbiAgICDluII6IC04MTMsXG4gICAg5bm0OiAtMTA2MCxcbiAgICDlvLc6IDEwNjcsXG4gICAg5omLOiAtMTUxOSxcbiAgICDmj7o6IC0xMDMzLFxuICAgIOaUvzogMTUyMixcbiAgICDmloc6IC0xMzU1LFxuICAgIOaWsDogLTE2ODIsXG4gICAg5pelOiAtMTgxNSxcbiAgICDmmI46IC0xNDYyLFxuICAgIOacgDogLTYzMCxcbiAgICDmnJ06IC0xODQzLFxuICAgIOacrDogLTE2NTAsXG4gICAg5p2xOiAtOTMxLFxuICAgIOaenDogLTY2NSxcbiAgICDmrKE6IC0yMzc4LFxuICAgIOawkTogLTE4MCxcbiAgICDmsJc6IC0xNzQwLFxuICAgIOeQhjogNzUyLFxuICAgIOeZujogNTI5LFxuICAgIOebrjogLTE1ODQsXG4gICAg55u4OiAtMjQyLFxuICAgIOecjDogLTExNjUsXG4gICAg56uLOiAtNzYzLFxuICAgIOesrDogODEwLFxuICAgIOexszogNTA5LFxuICAgIOiHqjogLTEzNTMsXG4gICAg6KGMOiA4MzgsXG4gICAg6KW/OiAtNzQ0LFxuICAgIOimizogLTM4NzQsXG4gICAg6Kq/OiAxMDEwLFxuICAgIOitsDogMTE5OCxcbiAgICDovrw6IDMwNDEsXG4gICAg6ZaLOiAxNzU4LFxuICAgIOmWkzogLTEyNTcsXG4gICAgXCLvvaJcIjogLTY0NSxcbiAgICBcIu+9o1wiOiAzMTQ1LFxuICAgIO+9rzogODMxLFxuICAgIO+9sTogLTU4NyxcbiAgICDvvbY6IDMwNixcbiAgICDvvbc6IDU2OCxcbiAgfTtcbiAgdGhpcy5VVzNfXyA9IHtcbiAgICBcIixcIjogNDg4OSxcbiAgICAxOiAtODAwLFxuICAgIFwi4oiSXCI6IC0xNzIzLFxuICAgIFwi44CBXCI6IDQ4ODksXG4gICAg44CFOiAtMjMxMSxcbiAgICDjgIc6IDU4MjcsXG4gICAgXCLjgI1cIjogMjY3MCxcbiAgICBcIuOAk1wiOiAtMzU3MyxcbiAgICDjgYI6IC0yNjk2LFxuICAgIOOBhDogMTAwNixcbiAgICDjgYY6IDIzNDIsXG4gICAg44GIOiAxOTgzLFxuICAgIOOBijogLTQ4NjQsXG4gICAg44GLOiAtMTE2MyxcbiAgICDjgYw6IDMyNzEsXG4gICAg44GPOiAxMDA0LFxuICAgIOOBkTogMzg4LFxuICAgIOOBkjogNDAxLFxuICAgIOOBkzogLTM1NTIsXG4gICAg44GUOiAtMzExNixcbiAgICDjgZU6IC0xMDU4LFxuICAgIOOBlzogLTM5NSxcbiAgICDjgZk6IDU4NCxcbiAgICDjgZs6IDM2ODUsXG4gICAg44GdOiAtNTIyOCxcbiAgICDjgZ86IDg0MixcbiAgICDjgaE6IC01MjEsXG4gICAg44GjOiAtMTQ0NCxcbiAgICDjgaQ6IC0xMDgxLFxuICAgIOOBpjogNjE2NyxcbiAgICDjgac6IDIzMTgsXG4gICAg44GoOiAxNjkxLFxuICAgIOOBqTogLTg5OSxcbiAgICDjgao6IC0yNzg4LFxuICAgIOOBqzogMjc0NSxcbiAgICDjga46IDQwNTYsXG4gICAg44GvOiA0NTU1LFxuICAgIOOBsjogLTIxNzEsXG4gICAg44G1OiAtMTc5OCxcbiAgICDjgbg6IDExOTksXG4gICAg44G7OiAtNTUxNixcbiAgICDjgb46IC00Mzg0LFxuICAgIOOBvzogLTEyMCxcbiAgICDjgoE6IDEyMDUsXG4gICAg44KCOiAyMzIzLFxuICAgIOOChDogLTc4OCxcbiAgICDjgog6IC0yMDIsXG4gICAg44KJOiA3MjcsXG4gICAg44KKOiA2NDksXG4gICAg44KLOiA1OTA1LFxuICAgIOOCjDogMjc3MyxcbiAgICDjgo86IC0xMjA3LFxuICAgIOOCkjogNjYyMCxcbiAgICDjgpM6IC01MTgsXG4gICAg44KiOiA1NTEsXG4gICAg44KwOiAxMzE5LFxuICAgIOOCuTogODc0LFxuICAgIOODgzogLTEzNTAsXG4gICAg44OIOiA1MjEsXG4gICAg44OgOiAxMTA5LFxuICAgIOODqzogMTU5MSxcbiAgICDjg606IDIyMDEsXG4gICAg44OzOiAyNzgsXG4gICAgXCLjg7tcIjogLTM3OTQsXG4gICAg5LiAOiAtMTYxOSxcbiAgICDkuIs6IC0xNzU5LFxuICAgIOS4ljogLTIwODcsXG4gICAg5LihOiAzODE1LFxuICAgIOS4rTogNjUzLFxuICAgIOS4uzogLTc1OCxcbiAgICDkuog6IC0xMTkzLFxuICAgIOS6jDogOTc0LFxuICAgIOS6ujogMjc0MixcbiAgICDku4o6IDc5MixcbiAgICDku5Y6IDE4ODksXG4gICAg5LulOiAtMTM2OCxcbiAgICDkvY46IDgxMSxcbiAgICDkvZU6IDQyNjUsXG4gICAg5L2cOiAtMzYxLFxuICAgIOS/nTogLTI0MzksXG4gICAg5YWDOiA0ODU4LFxuICAgIOWFmjogMzU5MyxcbiAgICDlhag6IDE1NzQsXG4gICAg5YWsOiAtMzAzMCxcbiAgICDlha06IDc1NSxcbiAgICDlhbE6IC0xODgwLFxuICAgIOWGhjogNTgwNyxcbiAgICDlho06IDMwOTUsXG4gICAg5YiGOiA0NTcsXG4gICAg5YidOiAyNDc1LFxuICAgIOWIpTogMTEyOSxcbiAgICDliY06IDIyODYsXG4gICAg5YmvOiA0NDM3LFxuICAgIOWKmzogMzY1LFxuICAgIOWLlTogLTk0OSxcbiAgICDli5k6IC0xODcyLFxuICAgIOWMljogMTMyNyxcbiAgICDljJc6IC0xMDM4LFxuICAgIOWMujogNDY0NixcbiAgICDljYM6IC0yMzA5LFxuICAgIOWNiDogLTc4MyxcbiAgICDljZQ6IC0xMDA2LFxuICAgIOWPozogNDgzLFxuICAgIOWPszogMTIzMyxcbiAgICDlkIQ6IDM1ODgsXG4gICAg5ZCIOiAtMjQxLFxuICAgIOWQjDogMzkwNixcbiAgICDlkow6IC04MzcsXG4gICAg5ZOhOiA0NTEzLFxuICAgIOWbvTogNjQyLFxuICAgIOWeizogMTM4OSxcbiAgICDloLQ6IDEyMTksXG4gICAg5aSWOiAtMjQxLFxuICAgIOWmuzogMjAxNixcbiAgICDlraY6IC0xMzU2LFxuICAgIOWuiTogLTQyMyxcbiAgICDlrp86IC0xMDA4LFxuICAgIOWutjogMTA3OCxcbiAgICDlsI86IC01MTMsXG4gICAg5bCROiAtMzEwMixcbiAgICDlt546IDExNTUsXG4gICAg5biCOiAzMTk3LFxuICAgIOW5szogLTE4MDQsXG4gICAg5bm0OiAyNDE2LFxuICAgIOW6gzogLTEwMzAsXG4gICAg5bqcOiAxNjA1LFxuICAgIOW6pjogMTQ1MixcbiAgICDlu7o6IC0yMzUyLFxuICAgIOW9kzogLTM4ODUsXG4gICAg5b6XOiAxOTA1LFxuICAgIOaAnTogLTEyOTEsXG4gICAg5oCnOiAxODIyLFxuICAgIOaIuDogLTQ4OCxcbiAgICDmjIc6IC0zOTczLFxuICAgIOaUvzogLTIwMTMsXG4gICAg5pWZOiAtMTQ3OSxcbiAgICDmlbA6IDMyMjIsXG4gICAg5paHOiAtMTQ4OSxcbiAgICDmlrA6IDE3NjQsXG4gICAg5pelOiAyMDk5LFxuICAgIOaXpzogNTc5MixcbiAgICDmmKg6IC02NjEsXG4gICAg5pmCOiAtMTI0OCxcbiAgICDmm5w6IC05NTEsXG4gICAg5pyAOiAtOTM3LFxuICAgIOaciDogNDEyNSxcbiAgICDmnJ86IDM2MCxcbiAgICDmnY46IDMwOTQsXG4gICAg5p2ROiAzNjQsXG4gICAg5p2xOiAtODA1LFxuICAgIOaguDogNTE1NixcbiAgICDmo646IDI0MzgsXG4gICAg5qWtOiA0ODQsXG4gICAg5rCPOiAyNjEzLFxuICAgIOawkTogLTE2OTQsXG4gICAg5rG6OiAtMTA3MyxcbiAgICDms5U6IDE4NjgsXG4gICAg5rW3OiAtNDk1LFxuICAgIOeEoTogOTc5LFxuICAgIOeJqTogNDYxLFxuICAgIOeJuTogLTM4NTAsXG4gICAg55SfOiAtMjczLFxuICAgIOeUqDogOTE0LFxuICAgIOeUujogMTIxNSxcbiAgICDnmoQ6IDczMTMsXG4gICAg55u0OiAtMTgzNSxcbiAgICDnnIE6IDc5MixcbiAgICDnnIw6IDYyOTMsXG4gICAg55+lOiAtMTUyOCxcbiAgICDnp4E6IDQyMzEsXG4gICAg56iOOiA0MDEsXG4gICAg56uLOiAtOTYwLFxuICAgIOesrDogMTIwMSxcbiAgICDnsbM6IDc3NjcsXG4gICAg57O7OiAzMDY2LFxuICAgIOe0hDogMzY2MyxcbiAgICDntJo6IDEzODQsXG4gICAg57WxOiAtNDIyOSxcbiAgICDnt486IDExNjMsXG4gICAg57eaOiAxMjU1LFxuICAgIOiAhTogNjQ1NyxcbiAgICDog706IDcyNSxcbiAgICDoh6o6IC0yODY5LFxuICAgIOiLsTogNzg1LFxuICAgIOimizogMTA0NCxcbiAgICDoqr86IC01NjIsXG4gICAg6LKhOiAtNzMzLFxuICAgIOiyuzogMTc3NyxcbiAgICDou4o6IDE4MzUsXG4gICAg6LuNOiAxMzc1LFxuICAgIOi+vDogLTE1MDQsXG4gICAg6YCaOiAtMTEzNixcbiAgICDpgbg6IC02ODEsXG4gICAg6YOOOiAxMDI2LFxuICAgIOmDoTogNDQwNCxcbiAgICDpg6g6IDEyMDAsXG4gICAg6YeROiAyMTYzLFxuICAgIOmVtzogNDIxLFxuICAgIOmWizogLTE0MzIsXG4gICAg6ZaTOiAxMzAyLFxuICAgIOmWojogLTEyODIsXG4gICAg6ZuoOiAyMDA5LFxuICAgIOmbuzogLTEwNDUsXG4gICAg6Z2eOiAyMDY2LFxuICAgIOmnhTogMTYyMCxcbiAgICBcIu+8kVwiOiAtODAwLFxuICAgIFwi772jXCI6IDI2NzAsXG4gICAgXCLvvaVcIjogLTM3OTQsXG4gICAg772vOiAtMTM1MCxcbiAgICDvvbE6IDU1MSxcbiAgICDvvbjvvp46IDEzMTksXG4gICAg7729OiA4NzQsXG4gICAg776EOiA1MjEsXG4gICAg776ROiAxMTA5LFxuICAgIO++mTogMTU5MSxcbiAgICDvvps6IDIyMDEsXG4gICAg776dOiAyNzgsXG4gIH07XG4gIHRoaXMuVVc0X18gPSB7XG4gICAgXCIsXCI6IDM5MzAsXG4gICAgXCIuXCI6IDM1MDgsXG4gICAgXCLigJVcIjogLTQ4NDEsXG4gICAgXCLjgIFcIjogMzkzMCxcbiAgICBcIuOAglwiOiAzNTA4LFxuICAgIOOAhzogNDk5OSxcbiAgICBcIuOAjFwiOiAxODk1LFxuICAgIFwi44CNXCI6IDM3OTgsXG4gICAgXCLjgJNcIjogLTUxNTYsXG4gICAg44GCOiA0NzUyLFxuICAgIOOBhDogLTM0MzUsXG4gICAg44GGOiAtNjQwLFxuICAgIOOBiDogLTI1MTQsXG4gICAg44GKOiAyNDA1LFxuICAgIOOBizogNTMwLFxuICAgIOOBjDogNjAwNixcbiAgICDjgY06IC00NDgyLFxuICAgIOOBjjogLTM4MjEsXG4gICAg44GPOiAtMzc4OCxcbiAgICDjgZE6IC00Mzc2LFxuICAgIOOBkjogLTQ3MzQsXG4gICAg44GTOiAyMjU1LFxuICAgIOOBlDogMTk3OSxcbiAgICDjgZU6IDI4NjQsXG4gICAg44GXOiAtODQzLFxuICAgIOOBmDogLTI1MDYsXG4gICAg44GZOiAtNzMxLFxuICAgIOOBmjogMTI1MSxcbiAgICDjgZs6IDE4MSxcbiAgICDjgZ06IDQwOTEsXG4gICAg44GfOiA1MDM0LFxuICAgIOOBoDogNTQwOCxcbiAgICDjgaE6IC0zNjU0LFxuICAgIOOBozogLTU4ODIsXG4gICAg44GkOiAtMTY1OSxcbiAgICDjgaY6IDM5OTQsXG4gICAg44GnOiA3NDEwLFxuICAgIOOBqDogNDU0NyxcbiAgICDjgao6IDU0MzMsXG4gICAg44GrOiA2NDk5LFxuICAgIOOBrDogMTg1MyxcbiAgICDjga06IDE0MTMsXG4gICAg44GuOiA3Mzk2LFxuICAgIOOBrzogODU3OCxcbiAgICDjgbA6IDE5NDAsXG4gICAg44GyOiA0MjQ5LFxuICAgIOOBszogLTQxMzQsXG4gICAg44G1OiAxMzQ1LFxuICAgIOOBuDogNjY2NSxcbiAgICDjgbk6IC03NDQsXG4gICAg44G7OiAxNDY0LFxuICAgIOOBvjogMTA1MSxcbiAgICDjgb86IC0yMDgyLFxuICAgIOOCgDogLTg4MixcbiAgICDjgoE6IC01MDQ2LFxuICAgIOOCgjogNDE2OSxcbiAgICDjgoM6IC0yNjY2LFxuICAgIOOChDogMjc5NSxcbiAgICDjgoc6IC0xNTQ0LFxuICAgIOOCiDogMzM1MSxcbiAgICDjgok6IC0yOTIyLFxuICAgIOOCijogLTk3MjYsXG4gICAg44KLOiAtMTQ4OTYsXG4gICAg44KMOiAtMjYxMyxcbiAgICDjgo06IC00NTcwLFxuICAgIOOCjzogLTE3ODMsXG4gICAg44KSOiAxMzE1MCxcbiAgICDjgpM6IC0yMzUyLFxuICAgIOOCqzogMjE0NSxcbiAgICDjgrM6IDE3ODksXG4gICAg44K7OiAxMjg3LFxuICAgIOODgzogLTcyNCxcbiAgICDjg4g6IC00MDMsXG4gICAg44OhOiAtMTYzNSxcbiAgICDjg6k6IC04ODEsXG4gICAg44OqOiAtNTQxLFxuICAgIOODqzogLTg1NixcbiAgICDjg7M6IC0zNjM3LFxuICAgIFwi44O7XCI6IC00MzcxLFxuICAgIOODvDogLTExODcwLFxuICAgIOS4gDogLTIwNjksXG4gICAg5LitOiAyMjEwLFxuICAgIOS6iDogNzgyLFxuICAgIOS6izogLTE5MCxcbiAgICDkupU6IC0xNzY4LFxuICAgIOS6ujogMTAzNixcbiAgICDku6U6IDU0NCxcbiAgICDkvJo6IDk1MCxcbiAgICDkvZM6IC0xMjg2LFxuICAgIOS9nDogNTMwLFxuICAgIOWBtDogNDI5MixcbiAgICDlhYg6IDYwMSxcbiAgICDlhZo6IC0yMDA2LFxuICAgIOWFsTogLTEyMTIsXG4gICAg5YaFOiA1ODQsXG4gICAg5YaGOiA3ODgsXG4gICAg5YidOiAxMzQ3LFxuICAgIOWJjTogMTYyMyxcbiAgICDlia86IDM4NzksXG4gICAg5YqbOiAtMzAyLFxuICAgIOWLlTogLTc0MCxcbiAgICDli5k6IC0yNzE1LFxuICAgIOWMljogNzc2LFxuICAgIOWMujogNDUxNyxcbiAgICDljZQ6IDEwMTMsXG4gICAg5Y+COiAxNTU1LFxuICAgIOWQiDogLTE4MzQsXG4gICAg5ZKMOiAtNjgxLFxuICAgIOWToTogLTkxMCxcbiAgICDlmag6IC04NTEsXG4gICAg5ZueOiAxNTAwLFxuICAgIOWbvTogLTYxOSxcbiAgICDlnJI6IC0xMjAwLFxuICAgIOWcsDogODY2LFxuICAgIOWgtDogLTE0MTAsXG4gICAg5aGBOiAtMjA5NCxcbiAgICDlo6s6IC0xNDEzLFxuICAgIOWkmjogMTA2NyxcbiAgICDlpKc6IDU3MSxcbiAgICDlrZA6IC00ODAyLFxuICAgIOWtpjogLTEzOTcsXG4gICAg5a6aOiAtMTA1NyxcbiAgICDlr7o6IC04MDksXG4gICAg5bCPOiAxOTEwLFxuICAgIOWxizogLTEzMjgsXG4gICAg5bGxOiAtMTUwMCxcbiAgICDls7Y6IC0yMDU2LFxuICAgIOW3nTogLTI2NjcsXG4gICAg5biCOiAyNzcxLFxuICAgIOW5tDogMzc0LFxuICAgIOW6gTogLTQ1NTYsXG4gICAg5b6MOiA0NTYsXG4gICAg5oCnOiA1NTMsXG4gICAg5oSfOiA5MTYsXG4gICAg5omAOiAtMTU2NixcbiAgICDmlK86IDg1NixcbiAgICDmlLk6IDc4NyxcbiAgICDmlL86IDIxODIsXG4gICAg5pWZOiA3MDQsXG4gICAg5paHOiA1MjIsXG4gICAg5pa5OiAtODU2LFxuICAgIOaXpTogMTc5OCxcbiAgICDmmYI6IDE4MjksXG4gICAg5pyAOiA4NDUsXG4gICAg5pyIOiAtOTA2NixcbiAgICDmnKg6IC00ODUsXG4gICAg5p2lOiAtNDQyLFxuICAgIOagoTogLTM2MCxcbiAgICDmpa06IC0xMDQzLFxuICAgIOawjzogNTM4OCxcbiAgICDmsJE6IC0yNzE2LFxuICAgIOawlzogLTkxMCxcbiAgICDmsqI6IC05MzksXG4gICAg5riIOiAtNTQzLFxuICAgIOeJqTogLTczNSxcbiAgICDnjoc6IDY3MixcbiAgICDnkIM6IC0xMjY3LFxuICAgIOeUnzogLTEyODYsXG4gICAg55SjOiAtMTEwMSxcbiAgICDnlLA6IC0yOTAwLFxuICAgIOeUujogMTgyNixcbiAgICDnmoQ6IDI1ODYsXG4gICAg55uuOiA5MjIsXG4gICAg55yBOiAtMzQ4NSxcbiAgICDnnIw6IDI5OTcsXG4gICAg56m6OiAtODY3LFxuICAgIOerizogLTIxMTIsXG4gICAg56ysOiA3ODgsXG4gICAg57GzOiAyOTM3LFxuICAgIOezuzogNzg2LFxuICAgIOe0hDogMjE3MSxcbiAgICDntYw6IDExNDYsXG4gICAg57WxOiAtMTE2OSxcbiAgICDnt486IDk0MCxcbiAgICDnt5o6IC05OTQsXG4gICAg572yOiA3NDksXG4gICAg6ICFOiAyMTQ1LFxuICAgIOiDvTogLTczMCxcbiAgICDoiKw6IC04NTIsXG4gICAg6KGMOiAtNzkyLFxuICAgIOimjzogNzkyLFxuICAgIOitpjogLTExODQsXG4gICAg6K2wOiAtMjQ0LFxuICAgIOiwtzogLTEwMDAsXG4gICAg6LOeOiA3MzAsXG4gICAg6LuKOiAtMTQ4MSxcbiAgICDou406IDExNTgsXG4gICAg6LyqOiAtMTQzMyxcbiAgICDovrw6IC0zMzcwLFxuICAgIOi/kTogOTI5LFxuICAgIOmBkzogLTEyOTEsXG4gICAg6YG4OiAyNTk2LFxuICAgIOmDjjogLTQ4NjYsXG4gICAg6YO9OiAxMTkyLFxuICAgIOmHjjogLTExMDAsXG4gICAg6YqAOiAtMjIxMyxcbiAgICDplbc6IDM1NyxcbiAgICDplpM6IC0yMzQ0LFxuICAgIOmZojogLTIyOTcsXG4gICAg6ZqbOiAtMjYwNCxcbiAgICDpm7s6IC04NzgsXG4gICAg6aCYOiAtMTY1OSxcbiAgICDpoYw6IC03OTIsXG4gICAg6aSoOiAtMTk4NCxcbiAgICDpppY6IDE3NDksXG4gICAg6auYOiAyMTIwLFxuICAgIFwi772iXCI6IDE4OTUsXG4gICAgXCLvvaNcIjogMzc5OCxcbiAgICBcIu+9pVwiOiAtNDM3MSxcbiAgICDvva86IC03MjQsXG4gICAg772wOiAtMTE4NzAsXG4gICAg7722OiAyMTQ1LFxuICAgIO+9ujogMTc4OSxcbiAgICDvvb46IDEyODcsXG4gICAg776EOiAtNDAzLFxuICAgIO++kjogLTE2MzUsXG4gICAg776XOiAtODgxLFxuICAgIO++mDogLTU0MSxcbiAgICDvvpk6IC04NTYsXG4gICAg776dOiAtMzYzNyxcbiAgfTtcbiAgdGhpcy5VVzVfXyA9IHtcbiAgICBcIixcIjogNDY1LFxuICAgIFwiLlwiOiAtMjk5LFxuICAgIDE6IC01MTQsXG4gICAgRTI6IC0zMjc2OCxcbiAgICBcIl1cIjogLTI3NjIsXG4gICAgXCLjgIFcIjogNDY1LFxuICAgIFwi44CCXCI6IC0yOTksXG4gICAgXCLjgIxcIjogMzYzLFxuICAgIOOBgjogMTY1NSxcbiAgICDjgYQ6IDMzMSxcbiAgICDjgYY6IC01MDMsXG4gICAg44GIOiAxMTk5LFxuICAgIOOBijogNTI3LFxuICAgIOOBizogNjQ3LFxuICAgIOOBjDogLTQyMSxcbiAgICDjgY06IDE2MjQsXG4gICAg44GOOiAxOTcxLFxuICAgIOOBjzogMzEyLFxuICAgIOOBkjogLTk4MyxcbiAgICDjgZU6IC0xNTM3LFxuICAgIOOBlzogLTEzNzEsXG4gICAg44GZOiAtODUyLFxuICAgIOOBoDogLTExODYsXG4gICAg44GhOiAxMDkzLFxuICAgIOOBozogNTIsXG4gICAg44GkOiA5MjEsXG4gICAg44GmOiAtMTgsXG4gICAg44GnOiAtODUwLFxuICAgIOOBqDogLTEyNyxcbiAgICDjgak6IDE2ODIsXG4gICAg44GqOiAtNzg3LFxuICAgIOOBqzogLTEyMjQsXG4gICAg44GuOiAtNjM1LFxuICAgIOOBrzogLTU3OCxcbiAgICDjgbk6IDEwMDEsXG4gICAg44G/OiA1MDIsXG4gICAg44KBOiA4NjUsXG4gICAg44KDOiAzMzUwLFxuICAgIOOChzogODU0LFxuICAgIOOCijogLTIwOCxcbiAgICDjgos6IDQyOSxcbiAgICDjgow6IDUwNCxcbiAgICDjgo86IDQxOSxcbiAgICDjgpI6IC0xMjY0LFxuICAgIOOCkzogMzI3LFxuICAgIOOCpDogMjQxLFxuICAgIOODqzogNDUxLFxuICAgIOODszogLTM0MyxcbiAgICDkuK06IC04NzEsXG4gICAg5LqsOiA3MjIsXG4gICAg5LyaOiAtMTE1MyxcbiAgICDlhZo6IC02NTQsXG4gICAg5YuZOiAzNTE5LFxuICAgIOWMujogLTkwMSxcbiAgICDlkYo6IDg0OCxcbiAgICDlk6E6IDIxMDQsXG4gICAg5aSnOiAtMTI5NixcbiAgICDlraY6IC01NDgsXG4gICAg5a6aOiAxNzg1LFxuICAgIOW1kDogLTEzMDQsXG4gICAg5biCOiAtMjk5MSxcbiAgICDluK06IDkyMSxcbiAgICDlubQ6IDE3NjMsXG4gICAg5oCdOiA4NzIsXG4gICAg5omAOiAtODE0LFxuICAgIOaMmTogMTYxOCxcbiAgICDmlrA6IC0xNjgyLFxuICAgIOaXpTogMjE4LFxuICAgIOaciDogLTQzNTMsXG4gICAg5p+7OiA5MzIsXG4gICAg5qC8OiAxMzU2LFxuICAgIOapnzogLTE1MDgsXG4gICAg5rCPOiAtMTM0NyxcbiAgICDnlLA6IDI0MCxcbiAgICDnlLo6IC0zOTEyLFxuICAgIOeahDogLTMxNDksXG4gICAg55u4OiAxMzE5LFxuICAgIOecgTogLTEwNTIsXG4gICAg55yMOiAtNDAwMyxcbiAgICDnoJQ6IC05OTcsXG4gICAg56S+OiAtMjc4LFxuICAgIOepujogLTgxMyxcbiAgICDntbE6IDE5NTUsXG4gICAg6ICFOiAtMjIzMyxcbiAgICDooag6IDY2MyxcbiAgICDoqp46IC0xMDczLFxuICAgIOitsDogMTIxOSxcbiAgICDpgbg6IC0xMDE4LFxuICAgIOmDjjogLTM2OCxcbiAgICDplbc6IDc4NixcbiAgICDplpM6IDExOTEsXG4gICAg6aGMOiAyMzY4LFxuICAgIOmkqDogLTY4OSxcbiAgICBcIu+8kVwiOiAtNTE0LFxuICAgIO+8pe+8kjogLTMyNzY4LFxuICAgIFwi772iXCI6IDM2MyxcbiAgICDvvbI6IDI0MSxcbiAgICDvvpk6IDQ1MSxcbiAgICDvvp06IC0zNDMsXG4gIH07XG4gIHRoaXMuVVc2X18gPSB7XG4gICAgXCIsXCI6IDIyNyxcbiAgICBcIi5cIjogODA4LFxuICAgIDE6IC0yNzAsXG4gICAgRTE6IDMwNixcbiAgICBcIuOAgVwiOiAyMjcsXG4gICAgXCLjgIJcIjogODA4LFxuICAgIOOBgjogLTMwNyxcbiAgICDjgYY6IDE4OSxcbiAgICDjgYs6IDI0MSxcbiAgICDjgYw6IC03MyxcbiAgICDjgY86IC0xMjEsXG4gICAg44GTOiAtMjAwLFxuICAgIOOBmDogMTc4MixcbiAgICDjgZk6IDM4MyxcbiAgICDjgZ86IC00MjgsXG4gICAg44GjOiA1NzMsXG4gICAg44GmOiAtMTAxNCxcbiAgICDjgac6IDEwMSxcbiAgICDjgag6IC0xMDUsXG4gICAg44GqOiAtMjUzLFxuICAgIOOBqzogLTE0OSxcbiAgICDjga46IC00MTcsXG4gICAg44GvOiAtMjM2LFxuICAgIOOCgjogLTIwNixcbiAgICDjgoo6IDE4NyxcbiAgICDjgos6IC0xMzUsXG4gICAg44KSOiAxOTUsXG4gICAg44OrOiAtNjczLFxuICAgIOODszogLTQ5NixcbiAgICDkuIA6IC0yNzcsXG4gICAg5LitOiAyMDEsXG4gICAg5Lu2OiAtODAwLFxuICAgIOS8mjogNjI0LFxuICAgIOWJjTogMzAyLFxuICAgIOWMujogMTc5MixcbiAgICDlk6E6IC0xMjEyLFxuICAgIOWnlDogNzk4LFxuICAgIOWtpjogLTk2MCxcbiAgICDluII6IDg4NyxcbiAgICDluoM6IC02OTUsXG4gICAg5b6MOiA1MzUsXG4gICAg5qWtOiAtNjk3LFxuICAgIOebuDogNzUzLFxuICAgIOekvjogLTUwNyxcbiAgICDnpo86IDk3NCxcbiAgICDnqbo6IC04MjIsXG4gICAg6ICFOiAxODExLFxuICAgIOmAozogNDYzLFxuICAgIOmDjjogMTA4MixcbiAgICBcIu+8kVwiOiAtMjcwLFxuICAgIO+8pe+8kTogMzA2LFxuICAgIO++mTogLTY3MyxcbiAgICDvvp06IC00OTYsXG4gIH07XG5cbiAgcmV0dXJuIHRoaXM7XG59XG5cblRpbnlTZWdtZW50ZXIucHJvdG90eXBlLmN0eXBlXyA9IGZ1bmN0aW9uIChzdHIpIHtcbiAgZm9yICh2YXIgaSBpbiB0aGlzLmNoYXJ0eXBlXykge1xuICAgIGlmIChzdHIubWF0Y2godGhpcy5jaGFydHlwZV9baV1bMF0pKSB7XG4gICAgICByZXR1cm4gdGhpcy5jaGFydHlwZV9baV1bMV07XG4gICAgfVxuICB9XG4gIHJldHVybiBcIk9cIjtcbn07XG5cblRpbnlTZWdtZW50ZXIucHJvdG90eXBlLnRzXyA9IGZ1bmN0aW9uICh2KSB7XG4gIGlmICh2KSB7XG4gICAgcmV0dXJuIHY7XG4gIH1cbiAgcmV0dXJuIDA7XG59O1xuXG5UaW55U2VnbWVudGVyLnByb3RvdHlwZS5zZWdtZW50ID0gZnVuY3Rpb24gKGlucHV0KSB7XG4gIGlmIChpbnB1dCA9PSBudWxsIHx8IGlucHV0ID09IHVuZGVmaW5lZCB8fCBpbnB1dCA9PSBcIlwiKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgdmFyIHNlZyA9IFtcIkIzXCIsIFwiQjJcIiwgXCJCMVwiXTtcbiAgdmFyIGN0eXBlID0gW1wiT1wiLCBcIk9cIiwgXCJPXCJdO1xuICB2YXIgbyA9IGlucHV0LnNwbGl0KFwiXCIpO1xuICBmb3IgKGkgPSAwOyBpIDwgby5sZW5ndGg7ICsraSkge1xuICAgIHNlZy5wdXNoKG9baV0pO1xuICAgIGN0eXBlLnB1c2godGhpcy5jdHlwZV8ob1tpXSkpO1xuICB9XG4gIHNlZy5wdXNoKFwiRTFcIik7XG4gIHNlZy5wdXNoKFwiRTJcIik7XG4gIHNlZy5wdXNoKFwiRTNcIik7XG4gIGN0eXBlLnB1c2goXCJPXCIpO1xuICBjdHlwZS5wdXNoKFwiT1wiKTtcbiAgY3R5cGUucHVzaChcIk9cIik7XG4gIHZhciB3b3JkID0gc2VnWzNdO1xuICB2YXIgcDEgPSBcIlVcIjtcbiAgdmFyIHAyID0gXCJVXCI7XG4gIHZhciBwMyA9IFwiVVwiO1xuICBmb3IgKHZhciBpID0gNDsgaSA8IHNlZy5sZW5ndGggLSAzOyArK2kpIHtcbiAgICB2YXIgc2NvcmUgPSB0aGlzLkJJQVNfXztcbiAgICB2YXIgdzEgPSBzZWdbaSAtIDNdO1xuICAgIHZhciB3MiA9IHNlZ1tpIC0gMl07XG4gICAgdmFyIHczID0gc2VnW2kgLSAxXTtcbiAgICB2YXIgdzQgPSBzZWdbaV07XG4gICAgdmFyIHc1ID0gc2VnW2kgKyAxXTtcbiAgICB2YXIgdzYgPSBzZWdbaSArIDJdO1xuICAgIHZhciBjMSA9IGN0eXBlW2kgLSAzXTtcbiAgICB2YXIgYzIgPSBjdHlwZVtpIC0gMl07XG4gICAgdmFyIGMzID0gY3R5cGVbaSAtIDFdO1xuICAgIHZhciBjNCA9IGN0eXBlW2ldO1xuICAgIHZhciBjNSA9IGN0eXBlW2kgKyAxXTtcbiAgICB2YXIgYzYgPSBjdHlwZVtpICsgMl07XG4gICAgc2NvcmUgKz0gdGhpcy50c18odGhpcy5VUDFfX1twMV0pO1xuICAgIHNjb3JlICs9IHRoaXMudHNfKHRoaXMuVVAyX19bcDJdKTtcbiAgICBzY29yZSArPSB0aGlzLnRzXyh0aGlzLlVQM19fW3AzXSk7XG4gICAgc2NvcmUgKz0gdGhpcy50c18odGhpcy5CUDFfX1twMSArIHAyXSk7XG4gICAgc2NvcmUgKz0gdGhpcy50c18odGhpcy5CUDJfX1twMiArIHAzXSk7XG4gICAgc2NvcmUgKz0gdGhpcy50c18odGhpcy5VVzFfX1t3MV0pO1xuICAgIHNjb3JlICs9IHRoaXMudHNfKHRoaXMuVVcyX19bdzJdKTtcbiAgICBzY29yZSArPSB0aGlzLnRzXyh0aGlzLlVXM19fW3czXSk7XG4gICAgc2NvcmUgKz0gdGhpcy50c18odGhpcy5VVzRfX1t3NF0pO1xuICAgIHNjb3JlICs9IHRoaXMudHNfKHRoaXMuVVc1X19bdzVdKTtcbiAgICBzY29yZSArPSB0aGlzLnRzXyh0aGlzLlVXNl9fW3c2XSk7XG4gICAgc2NvcmUgKz0gdGhpcy50c18odGhpcy5CVzFfX1t3MiArIHczXSk7XG4gICAgc2NvcmUgKz0gdGhpcy50c18odGhpcy5CVzJfX1t3MyArIHc0XSk7XG4gICAgc2NvcmUgKz0gdGhpcy50c18odGhpcy5CVzNfX1t3NCArIHc1XSk7XG4gICAgc2NvcmUgKz0gdGhpcy50c18odGhpcy5UVzFfX1t3MSArIHcyICsgdzNdKTtcbiAgICBzY29yZSArPSB0aGlzLnRzXyh0aGlzLlRXMl9fW3cyICsgdzMgKyB3NF0pO1xuICAgIHNjb3JlICs9IHRoaXMudHNfKHRoaXMuVFczX19bdzMgKyB3NCArIHc1XSk7XG4gICAgc2NvcmUgKz0gdGhpcy50c18odGhpcy5UVzRfX1t3NCArIHc1ICsgdzZdKTtcbiAgICBzY29yZSArPSB0aGlzLnRzXyh0aGlzLlVDMV9fW2MxXSk7XG4gICAgc2NvcmUgKz0gdGhpcy50c18odGhpcy5VQzJfX1tjMl0pO1xuICAgIHNjb3JlICs9IHRoaXMudHNfKHRoaXMuVUMzX19bYzNdKTtcbiAgICBzY29yZSArPSB0aGlzLnRzXyh0aGlzLlVDNF9fW2M0XSk7XG4gICAgc2NvcmUgKz0gdGhpcy50c18odGhpcy5VQzVfX1tjNV0pO1xuICAgIHNjb3JlICs9IHRoaXMudHNfKHRoaXMuVUM2X19bYzZdKTtcbiAgICBzY29yZSArPSB0aGlzLnRzXyh0aGlzLkJDMV9fW2MyICsgYzNdKTtcbiAgICBzY29yZSArPSB0aGlzLnRzXyh0aGlzLkJDMl9fW2MzICsgYzRdKTtcbiAgICBzY29yZSArPSB0aGlzLnRzXyh0aGlzLkJDM19fW2M0ICsgYzVdKTtcbiAgICBzY29yZSArPSB0aGlzLnRzXyh0aGlzLlRDMV9fW2MxICsgYzIgKyBjM10pO1xuICAgIHNjb3JlICs9IHRoaXMudHNfKHRoaXMuVEMyX19bYzIgKyBjMyArIGM0XSk7XG4gICAgc2NvcmUgKz0gdGhpcy50c18odGhpcy5UQzNfX1tjMyArIGM0ICsgYzVdKTtcbiAgICBzY29yZSArPSB0aGlzLnRzXyh0aGlzLlRDNF9fW2M0ICsgYzUgKyBjNl0pO1xuICAgIC8vICBzY29yZSArPSB0aGlzLnRzXyh0aGlzLlRDNV9fW2M0ICsgYzUgKyBjNl0pO1xuICAgIHNjb3JlICs9IHRoaXMudHNfKHRoaXMuVVExX19bcDEgKyBjMV0pO1xuICAgIHNjb3JlICs9IHRoaXMudHNfKHRoaXMuVVEyX19bcDIgKyBjMl0pO1xuICAgIHNjb3JlICs9IHRoaXMudHNfKHRoaXMuVVEzX19bcDMgKyBjM10pO1xuICAgIHNjb3JlICs9IHRoaXMudHNfKHRoaXMuQlExX19bcDIgKyBjMiArIGMzXSk7XG4gICAgc2NvcmUgKz0gdGhpcy50c18odGhpcy5CUTJfX1twMiArIGMzICsgYzRdKTtcbiAgICBzY29yZSArPSB0aGlzLnRzXyh0aGlzLkJRM19fW3AzICsgYzIgKyBjM10pO1xuICAgIHNjb3JlICs9IHRoaXMudHNfKHRoaXMuQlE0X19bcDMgKyBjMyArIGM0XSk7XG4gICAgc2NvcmUgKz0gdGhpcy50c18odGhpcy5UUTFfX1twMiArIGMxICsgYzIgKyBjM10pO1xuICAgIHNjb3JlICs9IHRoaXMudHNfKHRoaXMuVFEyX19bcDIgKyBjMiArIGMzICsgYzRdKTtcbiAgICBzY29yZSArPSB0aGlzLnRzXyh0aGlzLlRRM19fW3AzICsgYzEgKyBjMiArIGMzXSk7XG4gICAgc2NvcmUgKz0gdGhpcy50c18odGhpcy5UUTRfX1twMyArIGMyICsgYzMgKyBjNF0pO1xuICAgIHZhciBwID0gXCJPXCI7XG4gICAgaWYgKHNjb3JlID4gMCkge1xuICAgICAgcmVzdWx0LnB1c2god29yZCk7XG4gICAgICB3b3JkID0gXCJcIjtcbiAgICAgIHAgPSBcIkJcIjtcbiAgICB9XG4gICAgcDEgPSBwMjtcbiAgICBwMiA9IHAzO1xuICAgIHAzID0gcDtcbiAgICB3b3JkICs9IHNlZ1tpXTtcbiAgfVxuICByZXN1bHQucHVzaCh3b3JkKTtcblxuICByZXR1cm4gcmVzdWx0O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgVGlueVNlZ21lbnRlcjtcbiIsImltcG9ydCBUaW55U2VnbWVudGVyIGZyb20gXCIuLi8uLi9leHRlcm5hbC90aW55LXNlZ21lbnRlclwiO1xuaW1wb3J0IHsgVFJJTV9DSEFSX1BBVFRFUk4gfSBmcm9tIFwiLi9EZWZhdWx0VG9rZW5pemVyXCI7XG5pbXBvcnQgdHlwZSB7IFRva2VuaXplciB9IGZyb20gXCIuLi90b2tlbml6ZXJcIjtcbi8vIEB0cy1pZ25vcmVcbmNvbnN0IHNlZ21lbnRlciA9IG5ldyBUaW55U2VnbWVudGVyKCk7XG5cbmZ1bmN0aW9uIHBpY2tUb2tlbnNBc0phcGFuZXNlKGNvbnRlbnQ6IHN0cmluZywgdHJpbVBhdHRlcm46IFJlZ0V4cCk6IHN0cmluZ1tdIHtcbiAgcmV0dXJuIGNvbnRlbnRcbiAgICAuc3BsaXQodHJpbVBhdHRlcm4pXG4gICAgLmZpbHRlcigoeCkgPT4geCAhPT0gXCJcIilcbiAgICAuZmxhdE1hcDxzdHJpbmc+KCh4KSA9PiBzZWdtZW50ZXIuc2VnbWVudCh4KSk7XG59XG5cbi8qKlxuICogSmFwYW5lc2UgbmVlZHMgb3JpZ2luYWwgbG9naWMuXG4gKi9cbmV4cG9ydCBjbGFzcyBKYXBhbmVzZVRva2VuaXplciBpbXBsZW1lbnRzIFRva2VuaXplciB7XG4gIHRva2VuaXplKGNvbnRlbnQ6IHN0cmluZywgcmF3PzogYm9vbGVhbik6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gcGlja1Rva2Vuc0FzSmFwYW5lc2UoY29udGVudCwgcmF3ID8gLyAvZyA6IHRoaXMuZ2V0VHJpbVBhdHRlcm4oKSk7XG4gIH1cblxuICByZWN1cnNpdmVUb2tlbml6ZShjb250ZW50OiBzdHJpbmcpOiB7IHdvcmQ6IHN0cmluZzsgb2Zmc2V0OiBudW1iZXIgfVtdIHtcbiAgICBjb25zdCB0b2tlbnM6IHN0cmluZ1tdID0gc2VnbWVudGVyXG4gICAgICAuc2VnbWVudChjb250ZW50KVxuICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3RhZGFzaGktYWlrYXdhL29ic2lkaWFuLXZhcmlvdXMtY29tcGxlbWVudHMtcGx1Z2luL2lzc3Vlcy83N1xuICAgICAgLmZsYXRNYXAoKHg6IHN0cmluZykgPT5cbiAgICAgICAgeCA9PT0gXCIgXCIgPyB4IDogeC5zcGxpdChcIiBcIikubWFwKCh0KSA9PiAodCA9PT0gXCJcIiA/IFwiIFwiIDogdCkpXG4gICAgICApO1xuXG4gICAgY29uc3QgcmV0ID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0b2tlbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChcbiAgICAgICAgaSA9PT0gMCB8fFxuICAgICAgICB0b2tlbnNbaV0ubGVuZ3RoICE9PSAxIHx8XG4gICAgICAgICFCb29sZWFuKHRva2Vuc1tpXS5tYXRjaCh0aGlzLmdldFRyaW1QYXR0ZXJuKCkpKVxuICAgICAgKSB7XG4gICAgICAgIHJldC5wdXNoKHtcbiAgICAgICAgICB3b3JkOiB0b2tlbnMuc2xpY2UoaSkuam9pbihcIlwiKSxcbiAgICAgICAgICBvZmZzZXQ6IHRva2Vucy5zbGljZSgwLCBpKS5qb2luKFwiXCIpLmxlbmd0aCxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJldDtcbiAgfVxuXG4gIGdldFRyaW1QYXR0ZXJuKCk6IFJlZ0V4cCB7XG4gICAgcmV0dXJuIFRSSU1fQ0hBUl9QQVRURVJOO1xuICB9XG5cbiAgc2hvdWxkSWdub3JlKHN0cjogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIEJvb2xlYW4oc3RyLm1hdGNoKC9eW+OBgS3jgpPvvYEt772a77yhLe+8uuOAguOAgeODvOOAgF0qJC8pKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgRGVmYXVsdFRva2VuaXplciB9IGZyb20gXCIuL0RlZmF1bHRUb2tlbml6ZXJcIjtcblxudHlwZSBQcmV2aW91c1R5cGUgPSBcIm5vbmVcIiB8IFwidHJpbVwiIHwgXCJlbmdsaXNoXCIgfCBcIm90aGVyc1wiO1xuY29uc3QgRU5HTElTSF9QQVRURVJOID0gL1thLXpBLVowLTlfXFwtXFxcXF0vO1xuZXhwb3J0IGNsYXNzIEVuZ2xpc2hPbmx5VG9rZW5pemVyIGV4dGVuZHMgRGVmYXVsdFRva2VuaXplciB7XG4gIHRva2VuaXplKGNvbnRlbnQ6IHN0cmluZywgcmF3PzogYm9vbGVhbik6IHN0cmluZ1tdIHtcbiAgICBjb25zdCB0b2tlbml6ZWQgPSBBcnJheS5mcm9tKHRoaXMuX3Rva2VuaXplKGNvbnRlbnQpKS5maWx0ZXIoKHgpID0+XG4gICAgICB4LndvcmQubWF0Y2goRU5HTElTSF9QQVRURVJOKVxuICAgICk7XG4gICAgcmV0dXJuIHJhd1xuICAgICAgPyB0b2tlbml6ZWQubWFwKCh4KSA9PiB4LndvcmQpXG4gICAgICA6IHRva2VuaXplZFxuICAgICAgICAgIC5tYXAoKHgpID0+IHgud29yZClcbiAgICAgICAgICAuZmlsdGVyKCh4KSA9PiAheC5tYXRjaCh0aGlzLmdldFRyaW1QYXR0ZXJuKCkpKTtcbiAgfVxuXG4gIHJlY3Vyc2l2ZVRva2VuaXplKGNvbnRlbnQ6IHN0cmluZyk6IHsgd29yZDogc3RyaW5nOyBvZmZzZXQ6IG51bWJlciB9W10ge1xuICAgIGNvbnN0IG9mZnNldHMgPSBBcnJheS5mcm9tKHRoaXMuX3Rva2VuaXplKGNvbnRlbnQpKVxuICAgICAgLmZpbHRlcigoeCkgPT4gIXgud29yZC5tYXRjaCh0aGlzLmdldFRyaW1QYXR0ZXJuKCkpKVxuICAgICAgLm1hcCgoeCkgPT4geC5vZmZzZXQpO1xuICAgIHJldHVybiBbXG4gICAgICAuLi5vZmZzZXRzLm1hcCgoaSkgPT4gKHtcbiAgICAgICAgd29yZDogY29udGVudC5zbGljZShpKSxcbiAgICAgICAgb2Zmc2V0OiBpLFxuICAgICAgfSkpLFxuICAgIF07XG4gIH1cblxuICBwcml2YXRlICpfdG9rZW5pemUoXG4gICAgY29udGVudDogc3RyaW5nXG4gICk6IEl0ZXJhYmxlPHsgd29yZDogc3RyaW5nOyBvZmZzZXQ6IG51bWJlciB9PiB7XG4gICAgbGV0IHN0YXJ0SW5kZXggPSAwO1xuICAgIGxldCBwcmV2aW91c1R5cGU6IFByZXZpb3VzVHlwZSA9IFwibm9uZVwiO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb250ZW50Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoY29udGVudFtpXS5tYXRjaChzdXBlci5nZXRUcmltUGF0dGVybigpKSkge1xuICAgICAgICB5aWVsZCB7IHdvcmQ6IGNvbnRlbnQuc2xpY2Uoc3RhcnRJbmRleCwgaSksIG9mZnNldDogc3RhcnRJbmRleCB9O1xuICAgICAgICBwcmV2aW91c1R5cGUgPSBcInRyaW1cIjtcbiAgICAgICAgc3RhcnRJbmRleCA9IGk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoY29udGVudFtpXS5tYXRjaChFTkdMSVNIX1BBVFRFUk4pKSB7XG4gICAgICAgIGlmIChwcmV2aW91c1R5cGUgPT09IFwiZW5nbGlzaFwiIHx8IHByZXZpb3VzVHlwZSA9PT0gXCJub25lXCIpIHtcbiAgICAgICAgICBwcmV2aW91c1R5cGUgPSBcImVuZ2xpc2hcIjtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHlpZWxkIHsgd29yZDogY29udGVudC5zbGljZShzdGFydEluZGV4LCBpKSwgb2Zmc2V0OiBzdGFydEluZGV4IH07XG4gICAgICAgIHByZXZpb3VzVHlwZSA9IFwiZW5nbGlzaFwiO1xuICAgICAgICBzdGFydEluZGV4ID0gaTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChwcmV2aW91c1R5cGUgPT09IFwib3RoZXJzXCIgfHwgcHJldmlvdXNUeXBlID09PSBcIm5vbmVcIikge1xuICAgICAgICBwcmV2aW91c1R5cGUgPSBcIm90aGVyc1wiO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgeWllbGQgeyB3b3JkOiBjb250ZW50LnNsaWNlKHN0YXJ0SW5kZXgsIGkpLCBvZmZzZXQ6IHN0YXJ0SW5kZXggfTtcbiAgICAgIHByZXZpb3VzVHlwZSA9IFwib3RoZXJzXCI7XG4gICAgICBzdGFydEluZGV4ID0gaTtcbiAgICB9XG5cbiAgICB5aWVsZCB7XG4gICAgICB3b3JkOiBjb250ZW50LnNsaWNlKHN0YXJ0SW5kZXgsIGNvbnRlbnQubGVuZ3RoKSxcbiAgICAgIG9mZnNldDogc3RhcnRJbmRleCxcbiAgICB9O1xuICB9XG59XG4iLCJpbXBvcnQgeyBBcmFiaWNUb2tlbml6ZXIgfSBmcm9tIFwiLi90b2tlbml6ZXJzL0FyYWJpY1Rva2VuaXplclwiO1xuaW1wb3J0IHsgRGVmYXVsdFRva2VuaXplciB9IGZyb20gXCIuL3Rva2VuaXplcnMvRGVmYXVsdFRva2VuaXplclwiO1xuaW1wb3J0IHsgSmFwYW5lc2VUb2tlbml6ZXIgfSBmcm9tIFwiLi90b2tlbml6ZXJzL0phcGFuZXNlVG9rZW5pemVyXCI7XG5pbXBvcnQgdHlwZSB7IFRva2VuaXplU3RyYXRlZ3kgfSBmcm9tIFwiLi9Ub2tlbml6ZVN0cmF0ZWd5XCI7XG5pbXBvcnQgeyBFbmdsaXNoT25seVRva2VuaXplciB9IGZyb20gXCIuL3Rva2VuaXplcnMvRW5nbGlzaE9ubHlUb2tlbml6ZXJcIjtcblxuZXhwb3J0IGludGVyZmFjZSBUb2tlbml6ZXIge1xuICB0b2tlbml6ZShjb250ZW50OiBzdHJpbmcsIHJhdz86IGJvb2xlYW4pOiBzdHJpbmdbXTtcbiAgcmVjdXJzaXZlVG9rZW5pemUoY29udGVudDogc3RyaW5nKTogeyB3b3JkOiBzdHJpbmc7IG9mZnNldDogbnVtYmVyIH1bXTtcbiAgZ2V0VHJpbVBhdHRlcm4oKTogUmVnRXhwO1xuICBzaG91bGRJZ25vcmUocXVlcnk6IHN0cmluZyk6IGJvb2xlYW47XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVUb2tlbml6ZXIoc3RyYXRlZ3k6IFRva2VuaXplU3RyYXRlZ3kpOiBUb2tlbml6ZXIge1xuICBzd2l0Y2ggKHN0cmF0ZWd5Lm5hbWUpIHtcbiAgICBjYXNlIFwiZGVmYXVsdFwiOlxuICAgICAgcmV0dXJuIG5ldyBEZWZhdWx0VG9rZW5pemVyKCk7XG4gICAgY2FzZSBcImVuZ2xpc2gtb25seVwiOlxuICAgICAgcmV0dXJuIG5ldyBFbmdsaXNoT25seVRva2VuaXplcigpO1xuICAgIGNhc2UgXCJhcmFiaWNcIjpcbiAgICAgIHJldHVybiBuZXcgQXJhYmljVG9rZW5pemVyKCk7XG4gICAgY2FzZSBcImphcGFuZXNlXCI6XG4gICAgICByZXR1cm4gbmV3IEphcGFuZXNlVG9rZW5pemVyKCk7XG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVW5leHBlY3RlZCBzdHJhdGVneSBuYW1lOiAke3N0cmF0ZWd5fWApO1xuICB9XG59XG4iLCJ0eXBlIE5hbWUgPSBcImRlZmF1bHRcIiB8IFwiZW5nbGlzaC1vbmx5XCIgfCBcImphcGFuZXNlXCIgfCBcImFyYWJpY1wiO1xuXG5leHBvcnQgY2xhc3MgVG9rZW5pemVTdHJhdGVneSB7XG4gIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IF92YWx1ZXM6IFRva2VuaXplU3RyYXRlZ3lbXSA9IFtdO1xuXG4gIHN0YXRpYyByZWFkb25seSBERUZBVUxUID0gbmV3IFRva2VuaXplU3RyYXRlZ3koXCJkZWZhdWx0XCIsIDMpO1xuICBzdGF0aWMgcmVhZG9ubHkgRU5HTElTSF9PTkxZID0gbmV3IFRva2VuaXplU3RyYXRlZ3koXCJlbmdsaXNoLW9ubHlcIiwgMyk7XG4gIHN0YXRpYyByZWFkb25seSBKQVBBTkVTRSA9IG5ldyBUb2tlbml6ZVN0cmF0ZWd5KFwiamFwYW5lc2VcIiwgMik7XG4gIHN0YXRpYyByZWFkb25seSBBUkFCSUMgPSBuZXcgVG9rZW5pemVTdHJhdGVneShcImFyYWJpY1wiLCAzKTtcblxuICBwcml2YXRlIGNvbnN0cnVjdG9yKHJlYWRvbmx5IG5hbWU6IE5hbWUsIHJlYWRvbmx5IHRyaWdnZXJUaHJlc2hvbGQ6IG51bWJlcikge1xuICAgIFRva2VuaXplU3RyYXRlZ3kuX3ZhbHVlcy5wdXNoKHRoaXMpO1xuICB9XG5cbiAgc3RhdGljIGZyb21OYW1lKG5hbWU6IHN0cmluZyk6IFRva2VuaXplU3RyYXRlZ3kge1xuICAgIHJldHVybiBUb2tlbml6ZVN0cmF0ZWd5Ll92YWx1ZXMuZmluZCgoeCkgPT4geC5uYW1lID09PSBuYW1lKSE7XG4gIH1cblxuICBzdGF0aWMgdmFsdWVzKCk6IFRva2VuaXplU3RyYXRlZ3lbXSB7XG4gICAgcmV0dXJuIFRva2VuaXplU3RyYXRlZ3kuX3ZhbHVlcztcbiAgfVxufVxuIiwiaW1wb3J0IHtcbiAgQXBwLFxuICBFZGl0b3IsXG4gIHR5cGUgRWRpdG9yUG9zaXRpb24sXG4gIE1hcmtkb3duVmlldyxcbiAgbm9ybWFsaXplUGF0aCxcbiAgcGFyc2VGcm9udE1hdHRlckFsaWFzZXMsXG4gIHBhcnNlRnJvbnRNYXR0ZXJTdHJpbmdBcnJheSxcbiAgcGFyc2VGcm9udE1hdHRlclRhZ3MsXG4gIFRGaWxlLFxuICBWYXVsdCxcbn0gZnJvbSBcIm9ic2lkaWFuXCI7XG5cbmludGVyZmFjZSBVbnNhZmVBcHBJbnRlcmZhY2Uge1xuICB2YXVsdDogVmF1bHQgJiB7XG4gICAgY29uZmlnOiB7XG4gICAgICBzcGVsbGNoZWNrRGljdGlvbmFyeT86IHN0cmluZ1tdO1xuICAgIH07XG4gIH07XG59XG5cbmV4cG9ydCB0eXBlIEZyb250TWF0dGVyVmFsdWUgPSBzdHJpbmdbXTtcblxuZXhwb3J0IGNsYXNzIEFwcEhlbHBlciB7XG4gIHByaXZhdGUgdW5zYWZlQXBwOiBBcHAgJiBVbnNhZmVBcHBJbnRlcmZhY2U7XG5cbiAgY29uc3RydWN0b3IoYXBwOiBBcHApIHtcbiAgICB0aGlzLnVuc2FmZUFwcCA9IGFwcCBhcyBhbnk7XG4gIH1cblxuICBlcXVhbHNBc0VkaXRvclBvc3Rpb24ob25lOiBFZGl0b3JQb3NpdGlvbiwgb3RoZXI6IEVkaXRvclBvc2l0aW9uKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIG9uZS5saW5lID09PSBvdGhlci5saW5lICYmIG9uZS5jaCA9PT0gb3RoZXIuY2g7XG4gIH1cblxuICBnZXRBbGlhc2VzKGZpbGU6IFRGaWxlKTogc3RyaW5nW10ge1xuICAgIHJldHVybiAoXG4gICAgICBwYXJzZUZyb250TWF0dGVyQWxpYXNlcyhcbiAgICAgICAgdGhpcy51bnNhZmVBcHAubWV0YWRhdGFDYWNoZS5nZXRGaWxlQ2FjaGUoZmlsZSk/LmZyb250bWF0dGVyXG4gICAgICApID8/IFtdXG4gICAgKTtcbiAgfVxuXG4gIGdldEZyb250TWF0dGVyKGZpbGU6IFRGaWxlKTogeyBba2V5OiBzdHJpbmddOiBGcm9udE1hdHRlclZhbHVlIH0gfCB1bmRlZmluZWQge1xuICAgIGNvbnN0IGZyb250TWF0dGVyID1cbiAgICAgIHRoaXMudW5zYWZlQXBwLm1ldGFkYXRhQ2FjaGUuZ2V0RmlsZUNhY2hlKGZpbGUpPy5mcm9udG1hdHRlcjtcbiAgICBpZiAoIWZyb250TWF0dGVyKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIC8vIHJlbW92ZSAjXG4gICAgY29uc3QgdGFncyA9XG4gICAgICBwYXJzZUZyb250TWF0dGVyVGFncyhmcm9udE1hdHRlcik/Lm1hcCgoeCkgPT4geC5zbGljZSgxKSkgPz8gW107XG4gICAgY29uc3QgYWxpYXNlcyA9IHBhcnNlRnJvbnRNYXR0ZXJBbGlhc2VzKGZyb250TWF0dGVyKSA/PyBbXTtcbiAgICBjb25zdCB7IHBvc2l0aW9uLCAuLi5yZXN0IH0gPSBmcm9udE1hdHRlcjtcbiAgICByZXR1cm4ge1xuICAgICAgLi4uT2JqZWN0LmZyb21FbnRyaWVzKFxuICAgICAgICBPYmplY3QuZW50cmllcyhyZXN0KS5tYXAoKFtrLCBfdl0pID0+IFtcbiAgICAgICAgICBrLFxuICAgICAgICAgIHBhcnNlRnJvbnRNYXR0ZXJTdHJpbmdBcnJheShmcm9udE1hdHRlciwgayksXG4gICAgICAgIF0pXG4gICAgICApLFxuICAgICAgdGFncyxcbiAgICAgIHRhZzogdGFncyxcbiAgICAgIGFsaWFzZXMsXG4gICAgICBhbGlhczogYWxpYXNlcyxcbiAgICB9O1xuICB9XG5cbiAgZ2V0TWFya2Rvd25WaWV3SW5BY3RpdmVMZWFmKCk6IE1hcmtkb3duVmlldyB8IG51bGwge1xuICAgIGlmICghdGhpcy51bnNhZmVBcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoTWFya2Rvd25WaWV3KSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMudW5zYWZlQXBwLndvcmtzcGFjZS5hY3RpdmVMZWFmIS52aWV3IGFzIE1hcmtkb3duVmlldztcbiAgfVxuXG4gIGdldEFjdGl2ZUZpbGUoKTogVEZpbGUgfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy51bnNhZmVBcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKTtcbiAgfVxuXG4gIGlzQWN0aXZlRmlsZShmaWxlOiBURmlsZSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmdldEFjdGl2ZUZpbGUoKT8ucGF0aCA9PT0gZmlsZS5wYXRoO1xuICB9XG5cbiAgZ2V0UHJldmlvdXNGaWxlKCk6IFRGaWxlIHwgbnVsbCB7XG4gICAgY29uc3QgZk5hbWUgPSB0aGlzLnVuc2FmZUFwcC53b3Jrc3BhY2UuZ2V0TGFzdE9wZW5GaWxlcygpPy5bMV07XG4gICAgaWYgKCFmTmFtZSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuZ2V0TWFya2Rvd25GaWxlQnlQYXRoKGZOYW1lKTtcbiAgfVxuXG4gIGdldEN1cnJlbnREaXJuYW1lKCk6IHN0cmluZyB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLmdldEFjdGl2ZUZpbGUoKT8ucGFyZW50LnBhdGggPz8gbnVsbDtcbiAgfVxuXG4gIGdldEN1cnJlbnRFZGl0b3IoKTogRWRpdG9yIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0TWFya2Rvd25WaWV3SW5BY3RpdmVMZWFmKCk/LmVkaXRvciA/PyBudWxsO1xuICB9XG5cbiAgZ2V0U2VsZWN0aW9uKCk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0Q3VycmVudEVkaXRvcigpPy5nZXRTZWxlY3Rpb24oKTtcbiAgfVxuXG4gIGdldEN1cnJlbnRPZmZzZXQoZWRpdG9yOiBFZGl0b3IpOiBudW1iZXIge1xuICAgIHJldHVybiBlZGl0b3IucG9zVG9PZmZzZXQoZWRpdG9yLmdldEN1cnNvcigpKTtcbiAgfVxuXG4gIGdldEN1cnJlbnRMaW5lKGVkaXRvcjogRWRpdG9yKTogc3RyaW5nIHtcbiAgICByZXR1cm4gZWRpdG9yLmdldExpbmUoZWRpdG9yLmdldEN1cnNvcigpLmxpbmUpO1xuICB9XG5cbiAgZ2V0Q3VycmVudExpbmVVbnRpbEN1cnNvcihlZGl0b3I6IEVkaXRvcik6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0Q3VycmVudExpbmUoZWRpdG9yKS5zbGljZSgwLCBlZGl0b3IuZ2V0Q3Vyc29yKCkuY2gpO1xuICB9XG5cbiAgc2VhcmNoUGhhbnRvbUxpbmtzKCk6IHsgcGF0aDogc3RyaW5nOyBsaW5rOiBzdHJpbmcgfVtdIHtcbiAgICByZXR1cm4gT2JqZWN0LmVudHJpZXModGhpcy51bnNhZmVBcHAubWV0YWRhdGFDYWNoZS51bnJlc29sdmVkTGlua3MpLmZsYXRNYXAoXG4gICAgICAoW3BhdGgsIG9ial0pID0+IE9iamVjdC5rZXlzKG9iaikubWFwKChsaW5rKSA9PiAoeyBwYXRoLCBsaW5rIH0pKVxuICAgICk7XG4gIH1cblxuICBnZXRNYXJrZG93bkZpbGVCeVBhdGgocGF0aDogc3RyaW5nKTogVEZpbGUgfCBudWxsIHtcbiAgICBpZiAoIXBhdGguZW5kc1dpdGgoXCIubWRcIikpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGFic3RyYWN0RmlsZSA9IHRoaXMudW5zYWZlQXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChwYXRoKTtcbiAgICBpZiAoIWFic3RyYWN0RmlsZSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIGFic3RyYWN0RmlsZSBhcyBURmlsZTtcbiAgfVxuXG4gIG9wZW5NYXJrZG93bkZpbGUoZmlsZTogVEZpbGUsIG5ld0xlYWY6IGJvb2xlYW4sIG9mZnNldDogbnVtYmVyID0gMCkge1xuICAgIGNvbnN0IGxlYWYgPSB0aGlzLnVuc2FmZUFwcC53b3Jrc3BhY2UuZ2V0TGVhZihuZXdMZWFmKTtcblxuICAgIGxlYWZcbiAgICAgIC5vcGVuRmlsZShmaWxlLCB0aGlzLnVuc2FmZUFwcC53b3Jrc3BhY2UuYWN0aXZlTGVhZj8uZ2V0Vmlld1N0YXRlKCkpXG4gICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgIHRoaXMudW5zYWZlQXBwLndvcmtzcGFjZS5zZXRBY3RpdmVMZWFmKGxlYWYsIHRydWUsIHRydWUpO1xuICAgICAgICBjb25zdCB2aWV3T2ZUeXBlID1cbiAgICAgICAgICB0aGlzLnVuc2FmZUFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlVmlld09mVHlwZShNYXJrZG93blZpZXcpO1xuICAgICAgICBpZiAodmlld09mVHlwZSkge1xuICAgICAgICAgIGNvbnN0IGVkaXRvciA9IHZpZXdPZlR5cGUuZWRpdG9yO1xuICAgICAgICAgIGNvbnN0IHBvcyA9IGVkaXRvci5vZmZzZXRUb1BvcyhvZmZzZXQpO1xuICAgICAgICAgIGVkaXRvci5zZXRDdXJzb3IocG9zKTtcbiAgICAgICAgICBlZGl0b3Iuc2Nyb2xsSW50b1ZpZXcoeyBmcm9tOiBwb3MsIHRvOiBwb3MgfSwgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICB9XG5cbiAgZ2V0Q3VycmVudEZyb250TWF0dGVyKCk6IHN0cmluZyB8IG51bGwge1xuICAgIGNvbnN0IGVkaXRvciA9IHRoaXMuZ2V0Q3VycmVudEVkaXRvcigpO1xuICAgIGlmICghZWRpdG9yKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuZ2V0QWN0aXZlRmlsZSgpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAoZWRpdG9yLmdldExpbmUoMCkgIT09IFwiLS0tXCIpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCBlbmRQb3NpdGlvbiA9IGVkaXRvci5nZXRWYWx1ZSgpLmluZGV4T2YoXCItLS1cIiwgMyk7XG5cbiAgICBjb25zdCBjdXJyZW50T2Zmc2V0ID0gdGhpcy5nZXRDdXJyZW50T2Zmc2V0KGVkaXRvcik7XG4gICAgaWYgKGVuZFBvc2l0aW9uICE9PSAtMSAmJiBjdXJyZW50T2Zmc2V0ID49IGVuZFBvc2l0aW9uKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBrZXlMb2NhdGlvbnMgPSBBcnJheS5mcm9tKGVkaXRvci5nZXRWYWx1ZSgpLm1hdGNoQWxsKC8uKzovZykpO1xuICAgIGlmIChrZXlMb2NhdGlvbnMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBjdXJyZW50S2V5TG9jYXRpb24gPSBrZXlMb2NhdGlvbnNcbiAgICAgIC5maWx0ZXIoKHgpID0+IHguaW5kZXghIDwgY3VycmVudE9mZnNldClcbiAgICAgIC5sYXN0KCk7XG4gICAgaWYgKCFjdXJyZW50S2V5TG9jYXRpb24pIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiBjdXJyZW50S2V5TG9jYXRpb25bMF0uc3BsaXQoXCI6XCIpWzBdO1xuICB9XG5cbiAgLyoqXG4gICAqIFVuc2FmZSBtZXRob2RcbiAgICovXG4gIGlzSU1FT24oKTogYm9vbGVhbiB7XG4gICAgaWYgKCF0aGlzLnVuc2FmZUFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlVmlld09mVHlwZShNYXJrZG93blZpZXcpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgbWFya2Rvd25WaWV3ID0gdGhpcy51bnNhZmVBcHAud29ya3NwYWNlLmFjdGl2ZUxlYWYhXG4gICAgICAudmlldyBhcyBNYXJrZG93blZpZXc7XG4gICAgY29uc3QgY201b3I2OiBhbnkgPSAobWFya2Rvd25WaWV3LmVkaXRvciBhcyBhbnkpLmNtO1xuXG4gICAgLy8gY202XG4gICAgaWYgKGNtNW9yNj8uaW5wdXRTdGF0ZT8uY29tcG9zaW5nID4gMCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgLy8gY201XG4gICAgcmV0dXJuICEhY201b3I2Py5kaXNwbGF5Py5pbnB1dD8uY29tcG9zaW5nO1xuICB9XG5cbiAgYXN5bmMgd3JpdGVMb2cobG9nOiBzdHJpbmcpIHtcbiAgICBhd2FpdCB0aGlzLnVuc2FmZUFwcC52YXVsdC5hZGFwdGVyLmFwcGVuZChub3JtYWxpemVQYXRoKFwibG9nLm1kXCIpLCBsb2cpO1xuICB9XG59XG4iLCJleHBvcnQgY29uc3Qga2V5QnkgPSA8VD4oXG4gIHZhbHVlczogVFtdLFxuICB0b0tleTogKHQ6IFQpID0+IHN0cmluZ1xuKTogeyBba2V5OiBzdHJpbmddOiBUIH0gPT5cbiAgdmFsdWVzLnJlZHVjZShcbiAgICAocHJldiwgY3VyLCBfMSwgXzIsIGsgPSB0b0tleShjdXIpKSA9PiAoKHByZXZba10gPSBjdXIpLCBwcmV2KSxcbiAgICB7fSBhcyB7IFtrZXk6IHN0cmluZ106IFQgfVxuICApO1xuXG5leHBvcnQgY29uc3QgZ3JvdXBCeSA9IDxUPihcbiAgdmFsdWVzOiBUW10sXG4gIHRvS2V5OiAodDogVCkgPT4gc3RyaW5nXG4pOiB7IFtrZXk6IHN0cmluZ106IFRbXSB9ID0+XG4gIHZhbHVlcy5yZWR1Y2UoXG4gICAgKHByZXYsIGN1ciwgXzEsIF8yLCBrID0gdG9LZXkoY3VyKSkgPT4gKFxuICAgICAgKHByZXZba10gfHwgKHByZXZba10gPSBbXSkpLnB1c2goY3VyKSwgcHJldlxuICAgICksXG4gICAge30gYXMgeyBba2V5OiBzdHJpbmddOiBUW10gfVxuICApO1xuXG5leHBvcnQgZnVuY3Rpb24gdW5pcTxUPih2YWx1ZXM6IFRbXSk6IFRbXSB7XG4gIHJldHVybiBbLi4ubmV3IFNldCh2YWx1ZXMpXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVuaXFCeTxUPih2YWx1ZXM6IFRbXSwgZm46ICh4OiBUKSA9PiBzdHJpbmcgfCBudW1iZXIpOiBUW10ge1xuICBjb25zdCBtID0gbmV3IE1hcDxzdHJpbmcgfCBudW1iZXIsIFQ+KCk7XG4gIHZhbHVlcy5mb3JFYWNoKCh4KSA9PiB7XG4gICAgY29uc3QgayA9IGZuKHgpO1xuICAgIGlmICghbS5oYXMoaykpIHtcbiAgICAgIG0uc2V0KGssIHgpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBBcnJheS5mcm9tKG0udmFsdWVzKCkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdW5pcVdpdGg8VD4oYXJyOiBUW10sIGZuOiAob25lOiBULCBvdGhlcjogVCkgPT4gYm9vbGVhbikge1xuICByZXR1cm4gYXJyLmZpbHRlcihcbiAgICAoZWxlbWVudCwgaW5kZXgpID0+IGFyci5maW5kSW5kZXgoKHN0ZXApID0+IGZuKGVsZW1lbnQsIHN0ZXApKSA9PT0gaW5kZXhcbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFycmF5RXF1YWxzKFxuICBhcnIxOiB1bmtub3duW10sXG4gIGFycjI6IHVua25vd25bXSxcbiAgbGVuZ3RoPzogbnVtYmVyXG4pOiBib29sZWFuIHtcbiAgbGV0IGwgPSBNYXRoLm1heChhcnIxLmxlbmd0aCwgYXJyMi5sZW5ndGgpO1xuICBpZiAobGVuZ3RoICE9PSB1bmRlZmluZWQpIHtcbiAgICBsID0gTWF0aC5taW4obCwgbGVuZ3RoKTtcbiAgfVxuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbDsgaSsrKSB7XG4gICAgaWYgKGFycjFbaV0gIT09IGFycjJbaV0pIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFycmF5RXF1YWxzVW50aWwoYXJyMTogdW5rbm93bltdLCBhcnIyOiB1bmtub3duW10pOiBudW1iZXIge1xuICBsZXQgbCA9IE1hdGgubWluKGFycjEubGVuZ3RoLCBhcnIyLmxlbmd0aCk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbDsgaSsrKSB7XG4gICAgaWYgKGFycjFbaV0gIT09IGFycjJbaV0pIHtcbiAgICAgIHJldHVybiBpIC0gMTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbCAtIDE7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtaXJyb3JNYXA8VD4oXG4gIGNvbGxlY3Rpb246IFRbXSxcbiAgdG9WYWx1ZTogKHQ6IFQpID0+IHN0cmluZ1xuKTogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSB7XG4gIHJldHVybiBjb2xsZWN0aW9uLnJlZHVjZSgocCwgYykgPT4gKHsgLi4ucCwgW3RvVmFsdWUoYyldOiB0b1ZhbHVlKGMpIH0pLCB7fSk7XG59XG4iLCJleHBvcnQgdHlwZSBXb3JkVHlwZSA9XG4gIHwgXCJjdXJyZW50RmlsZVwiXG4gIHwgXCJjdXJyZW50VmF1bHRcIlxuICB8IFwiY3VzdG9tRGljdGlvbmFyeVwiXG4gIHwgXCJpbnRlcm5hbExpbmtcIlxuICB8IFwiZnJvbnRNYXR0ZXJcIjtcblxuZXhwb3J0IGludGVyZmFjZSBEZWZhdWx0V29yZCB7XG4gIHZhbHVlOiBzdHJpbmc7XG4gIGRlc2NyaXB0aW9uPzogc3RyaW5nO1xuICBhbGlhc2VzPzogc3RyaW5nW107XG4gIHR5cGU6IFdvcmRUeXBlO1xuICBjcmVhdGVkUGF0aDogc3RyaW5nO1xuICAvLyBBZGQgYWZ0ZXIganVkZ2VcbiAgb2Zmc2V0PzogbnVtYmVyO1xuICBoaXQ/OiBzdHJpbmc7XG59XG5leHBvcnQgaW50ZXJmYWNlIEN1cnJlbnRGaWxlV29yZCBleHRlbmRzIERlZmF1bHRXb3JkIHtcbiAgdHlwZTogXCJjdXJyZW50RmlsZVwiO1xufVxuZXhwb3J0IGludGVyZmFjZSBDdXJyZW50VmF1bHRXb3JkIGV4dGVuZHMgRGVmYXVsdFdvcmQge1xuICB0eXBlOiBcImN1cnJlbnRWYXVsdFwiO1xufVxuZXhwb3J0IGludGVyZmFjZSBDdXN0b21EaWN0aW9uYXJ5V29yZCBleHRlbmRzIERlZmF1bHRXb3JkIHtcbiAgdHlwZTogXCJjdXN0b21EaWN0aW9uYXJ5XCI7XG4gIGNhcmV0U3ltYm9sPzogc3RyaW5nO1xuICAvKiogVXNlIGZvciBpbnNlcnRpbmcgaW5zdGVhZCBvZiB2YWx1ZSAqKi9cbiAgaW5zZXJ0ZWRUZXh0Pzogc3RyaW5nO1xuICAvKiogSWYgdHJ1ZSwgaWdub3JlIGBJbnNlcnQgc3BhY2UgYWZ0ZXIgY29tcGxldGlvbmAgb3B0aW9uICoqL1xuICBpZ25vcmVTcGFjZUFmdGVyQ29tcGxldGlvbj86IGJvb2xlYW47XG59XG5leHBvcnQgaW50ZXJmYWNlIEludGVybmFsTGlua1dvcmQgZXh0ZW5kcyBEZWZhdWx0V29yZCB7XG4gIHR5cGU6IFwiaW50ZXJuYWxMaW5rXCI7XG4gIHBoYW50b20/OiBib29sZWFuO1xuICBhbGlhc01ldGE/OiB7XG4gICAgb3JpZ2luOiBzdHJpbmc7XG4gIH07XG59XG5leHBvcnQgaW50ZXJmYWNlIEZyb250TWF0dGVyV29yZCBleHRlbmRzIERlZmF1bHRXb3JkIHtcbiAgdHlwZTogXCJmcm9udE1hdHRlclwiO1xuICBrZXk6IHN0cmluZztcbn1cblxuZXhwb3J0IHR5cGUgV29yZCA9XG4gIHwgQ3VycmVudEZpbGVXb3JkXG4gIHwgQ3VycmVudFZhdWx0V29yZFxuICB8IEN1c3RvbURpY3Rpb25hcnlXb3JkXG4gIHwgSW50ZXJuYWxMaW5rV29yZFxuICB8IEZyb250TWF0dGVyV29yZDtcblxuZXhwb3J0IGNsYXNzIFdvcmRUeXBlTWV0YSB7XG4gIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IF92YWx1ZXM6IFdvcmRUeXBlTWV0YVtdID0gW107XG4gIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IF9kaWN0OiB7IFt0eXBlOiBzdHJpbmddOiBXb3JkVHlwZU1ldGEgfSA9IHt9O1xuXG4gIHN0YXRpYyByZWFkb25seSBGUk9OVF9NQVRURVIgPSBuZXcgV29yZFR5cGVNZXRhKFxuICAgIFwiZnJvbnRNYXR0ZXJcIixcbiAgICAxMDAsXG4gICAgXCJmcm9udE1hdHRlclwiXG4gICk7XG4gIHN0YXRpYyByZWFkb25seSBJTlRFUk5BTF9MSU5LID0gbmV3IFdvcmRUeXBlTWV0YShcbiAgICBcImludGVybmFsTGlua1wiLFxuICAgIDkwLFxuICAgIFwiaW50ZXJuYWxMaW5rXCJcbiAgKTtcbiAgc3RhdGljIHJlYWRvbmx5IENVU1RPTV9ESUNUSU9OQVJZID0gbmV3IFdvcmRUeXBlTWV0YShcbiAgICBcImN1c3RvbURpY3Rpb25hcnlcIixcbiAgICA4MCxcbiAgICBcInN1Z2dlc3Rpb25cIlxuICApO1xuICBzdGF0aWMgcmVhZG9ubHkgQ1VSUkVOVF9GSUxFID0gbmV3IFdvcmRUeXBlTWV0YShcbiAgICBcImN1cnJlbnRGaWxlXCIsXG4gICAgNzAsXG4gICAgXCJzdWdnZXN0aW9uXCJcbiAgKTtcbiAgc3RhdGljIHJlYWRvbmx5IENVUlJFTlRfVkFVTFQgPSBuZXcgV29yZFR5cGVNZXRhKFxuICAgIFwiY3VycmVudFZhdWx0XCIsXG4gICAgNjAsXG4gICAgXCJzdWdnZXN0aW9uXCJcbiAgKTtcblxuICBwcml2YXRlIGNvbnN0cnVjdG9yKFxuICAgIHJlYWRvbmx5IHR5cGU6IFdvcmRUeXBlLFxuICAgIHJlYWRvbmx5IHByaW9yaXR5OiBudW1iZXIsXG4gICAgcmVhZG9ubHkgZ3JvdXA6IHN0cmluZ1xuICApIHtcbiAgICBXb3JkVHlwZU1ldGEuX3ZhbHVlcy5wdXNoKHRoaXMpO1xuICAgIFdvcmRUeXBlTWV0YS5fZGljdFt0eXBlXSA9IHRoaXM7XG4gIH1cblxuICBzdGF0aWMgb2YodHlwZTogV29yZFR5cGUpOiBXb3JkVHlwZU1ldGEge1xuICAgIHJldHVybiBXb3JkVHlwZU1ldGEuX2RpY3RbdHlwZV07XG4gIH1cblxuICBzdGF0aWMgdmFsdWVzKCk6IFdvcmRUeXBlTWV0YVtdIHtcbiAgICByZXR1cm4gV29yZFR5cGVNZXRhLl92YWx1ZXM7XG4gIH1cbn1cbiIsImltcG9ydCB7XG4gIGNhcGl0YWxpemVGaXJzdExldHRlcixcbiAgbG93ZXJJbmNsdWRlcyxcbiAgbG93ZXJTdGFydHNXaXRoLFxufSBmcm9tIFwiLi4vdXRpbC9zdHJpbmdzXCI7XG5pbXBvcnQgdHlwZSB7IEluZGV4ZWRXb3JkcyB9IGZyb20gXCIuLi91aS9BdXRvQ29tcGxldGVTdWdnZXN0XCI7XG5pbXBvcnQgeyB1bmlxV2l0aCB9IGZyb20gXCIuLi91dGlsL2NvbGxlY3Rpb24taGVscGVyXCI7XG5pbXBvcnQgeyB0eXBlIFdvcmQsIFdvcmRUeXBlTWV0YSB9IGZyb20gXCIuLi9tb2RlbC9Xb3JkXCI7XG5pbXBvcnQgdHlwZSB7XG4gIEhpdFdvcmQsXG4gIFNlbGVjdGlvbkhpc3RvcnlTdG9yYWdlLFxufSBmcm9tIFwiLi4vc3RvcmFnZS9TZWxlY3Rpb25IaXN0b3J5U3RvcmFnZVwiO1xuXG5leHBvcnQgdHlwZSBXb3Jkc0J5Rmlyc3RMZXR0ZXIgPSB7IFtmaXJzdExldHRlcjogc3RyaW5nXTogV29yZFtdIH07XG5cbmludGVyZmFjZSBKdWRnZW1lbnQge1xuICB3b3JkOiBXb3JkO1xuICAvLyBUT0RPOiByZW1vdmUgdmFsdWUuIHVzZSB3b3JkLmhpdCBpbnN0ZWFkXG4gIHZhbHVlPzogc3RyaW5nO1xuICBhbGlhczogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHB1c2hXb3JkKFxuICB3b3Jkc0J5Rmlyc3RMZXR0ZXI6IFdvcmRzQnlGaXJzdExldHRlcixcbiAga2V5OiBzdHJpbmcsXG4gIHdvcmQ6IFdvcmRcbikge1xuICBpZiAod29yZHNCeUZpcnN0TGV0dGVyW2tleV0gPT09IHVuZGVmaW5lZCkge1xuICAgIHdvcmRzQnlGaXJzdExldHRlcltrZXldID0gW3dvcmRdO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHdvcmRzQnlGaXJzdExldHRlcltrZXldLnB1c2god29yZCk7XG59XG5cbi8vIFB1YmxpYyBmb3IgdGVzdHNcbmV4cG9ydCBmdW5jdGlvbiBqdWRnZShcbiAgd29yZDogV29yZCxcbiAgcXVlcnk6IHN0cmluZyxcbiAgcXVlcnlTdGFydFdpdGhVcHBlcjogYm9vbGVhblxuKTogSnVkZ2VtZW50IHtcbiAgaWYgKHF1ZXJ5ID09PSBcIlwiKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHdvcmQ6IHtcbiAgICAgICAgLi4ud29yZCxcbiAgICAgICAgaGl0OiB3b3JkLnZhbHVlLFxuICAgICAgfSxcbiAgICAgIHZhbHVlOiB3b3JkLnZhbHVlLFxuICAgICAgYWxpYXM6IGZhbHNlLFxuICAgIH07XG4gIH1cblxuICBpZiAobG93ZXJTdGFydHNXaXRoKHdvcmQudmFsdWUsIHF1ZXJ5KSkge1xuICAgIGlmIChcbiAgICAgIHF1ZXJ5U3RhcnRXaXRoVXBwZXIgJiZcbiAgICAgIHdvcmQudHlwZSAhPT0gXCJpbnRlcm5hbExpbmtcIiAmJlxuICAgICAgd29yZC50eXBlICE9PSBcImZyb250TWF0dGVyXCJcbiAgICApIHtcbiAgICAgIGNvbnN0IGMgPSBjYXBpdGFsaXplRmlyc3RMZXR0ZXIod29yZC52YWx1ZSk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB3b3JkOiB7XG4gICAgICAgICAgLi4ud29yZCxcbiAgICAgICAgICB2YWx1ZTogYyxcbiAgICAgICAgICBoaXQ6IGMsXG4gICAgICAgIH0sXG4gICAgICAgIHZhbHVlOiBjLFxuICAgICAgICBhbGlhczogZmFsc2UsXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB3b3JkOiB7XG4gICAgICAgICAgLi4ud29yZCxcbiAgICAgICAgICBoaXQ6IHdvcmQudmFsdWUsXG4gICAgICAgIH0sXG4gICAgICAgIHZhbHVlOiB3b3JkLnZhbHVlLFxuICAgICAgICBhbGlhczogZmFsc2UsXG4gICAgICB9O1xuICAgIH1cbiAgfVxuICBjb25zdCBtYXRjaGVkQWxpYXMgPSB3b3JkLmFsaWFzZXM/LmZpbmQoKGEpID0+IGxvd2VyU3RhcnRzV2l0aChhLCBxdWVyeSkpO1xuICBpZiAobWF0Y2hlZEFsaWFzKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHdvcmQ6IHtcbiAgICAgICAgLi4ud29yZCxcbiAgICAgICAgaGl0OiBtYXRjaGVkQWxpYXMsXG4gICAgICB9LFxuICAgICAgdmFsdWU6IG1hdGNoZWRBbGlhcyxcbiAgICAgIGFsaWFzOiB0cnVlLFxuICAgIH07XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHdvcmQsXG4gICAgYWxpYXM6IGZhbHNlLFxuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc3VnZ2VzdFdvcmRzKFxuICBpbmRleGVkV29yZHM6IEluZGV4ZWRXb3JkcyxcbiAgcXVlcnk6IHN0cmluZyxcbiAgbWF4OiBudW1iZXIsXG4gIGZyb250TWF0dGVyOiBzdHJpbmcgfCBudWxsLFxuICBzZWxlY3Rpb25IaXN0b3J5U3RvcmFnZT86IFNlbGVjdGlvbkhpc3RvcnlTdG9yYWdlXG4pOiBXb3JkW10ge1xuICBjb25zdCBxdWVyeVN0YXJ0V2l0aFVwcGVyID0gY2FwaXRhbGl6ZUZpcnN0TGV0dGVyKHF1ZXJ5KSA9PT0gcXVlcnk7XG5cbiAgY29uc3QgZmxhdHRlbkZyb250TWF0dGVyV29yZHMgPSAoKSA9PiB7XG4gICAgaWYgKGZyb250TWF0dGVyID09PSBcImFsaWFzXCIgfHwgZnJvbnRNYXR0ZXIgPT09IFwiYWxpYXNlc1wiKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuICAgIGlmIChmcm9udE1hdHRlciAmJiBpbmRleGVkV29yZHMuZnJvbnRNYXR0ZXI/Lltmcm9udE1hdHRlcl0pIHtcbiAgICAgIHJldHVybiBPYmplY3QudmFsdWVzKGluZGV4ZWRXb3Jkcy5mcm9udE1hdHRlcj8uW2Zyb250TWF0dGVyXSkuZmxhdCgpO1xuICAgIH1cbiAgICByZXR1cm4gW107XG4gIH07XG5cbiAgY29uc3Qgd29yZHMgPSBxdWVyeVN0YXJ0V2l0aFVwcGVyXG4gICAgPyBmcm9udE1hdHRlclxuICAgICAgPyBmbGF0dGVuRnJvbnRNYXR0ZXJXb3JkcygpXG4gICAgICA6IFtcbiAgICAgICAgICAuLi4oaW5kZXhlZFdvcmRzLmN1cnJlbnRGaWxlW3F1ZXJ5LmNoYXJBdCgwKV0gPz8gW10pLFxuICAgICAgICAgIC4uLihpbmRleGVkV29yZHMuY3VycmVudEZpbGVbcXVlcnkuY2hhckF0KDApLnRvTG93ZXJDYXNlKCldID8/IFtdKSxcbiAgICAgICAgICAuLi4oaW5kZXhlZFdvcmRzLmN1cnJlbnRWYXVsdFtxdWVyeS5jaGFyQXQoMCldID8/IFtdKSxcbiAgICAgICAgICAuLi4oaW5kZXhlZFdvcmRzLmN1cnJlbnRWYXVsdFtxdWVyeS5jaGFyQXQoMCkudG9Mb3dlckNhc2UoKV0gPz8gW10pLFxuICAgICAgICAgIC4uLihpbmRleGVkV29yZHMuY3VzdG9tRGljdGlvbmFyeVtxdWVyeS5jaGFyQXQoMCldID8/IFtdKSxcbiAgICAgICAgICAuLi4oaW5kZXhlZFdvcmRzLmN1c3RvbURpY3Rpb25hcnlbcXVlcnkuY2hhckF0KDApLnRvTG93ZXJDYXNlKCldID8/XG4gICAgICAgICAgICBbXSksXG4gICAgICAgICAgLi4uKGluZGV4ZWRXb3Jkcy5pbnRlcm5hbExpbmtbcXVlcnkuY2hhckF0KDApXSA/PyBbXSksXG4gICAgICAgICAgLi4uKGluZGV4ZWRXb3Jkcy5pbnRlcm5hbExpbmtbcXVlcnkuY2hhckF0KDApLnRvTG93ZXJDYXNlKCldID8/IFtdKSxcbiAgICAgICAgXVxuICAgIDogZnJvbnRNYXR0ZXJcbiAgICA/IGZsYXR0ZW5Gcm9udE1hdHRlcldvcmRzKClcbiAgICA6IFtcbiAgICAgICAgLi4uKGluZGV4ZWRXb3Jkcy5jdXJyZW50RmlsZVtxdWVyeS5jaGFyQXQoMCldID8/IFtdKSxcbiAgICAgICAgLi4uKGluZGV4ZWRXb3Jkcy5jdXJyZW50VmF1bHRbcXVlcnkuY2hhckF0KDApXSA/PyBbXSksXG4gICAgICAgIC4uLihpbmRleGVkV29yZHMuY3VzdG9tRGljdGlvbmFyeVtxdWVyeS5jaGFyQXQoMCldID8/IFtdKSxcbiAgICAgICAgLi4uKGluZGV4ZWRXb3Jkcy5pbnRlcm5hbExpbmtbcXVlcnkuY2hhckF0KDApXSA/PyBbXSksXG4gICAgICAgIC4uLihpbmRleGVkV29yZHMuaW50ZXJuYWxMaW5rW3F1ZXJ5LmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpXSA/PyBbXSksXG4gICAgICBdO1xuXG4gIGNvbnN0IGNhbmRpZGF0ZSA9IEFycmF5LmZyb20od29yZHMpXG4gICAgLm1hcCgoeCkgPT4ganVkZ2UoeCwgcXVlcnksIHF1ZXJ5U3RhcnRXaXRoVXBwZXIpKVxuICAgIC5maWx0ZXIoKHgpID0+IHgudmFsdWUgIT09IHVuZGVmaW5lZClcbiAgICAuc29ydCgoYSwgYikgPT4ge1xuICAgICAgY29uc3QgYVdvcmQgPSBhLndvcmQgYXMgSGl0V29yZDtcbiAgICAgIGNvbnN0IGJXb3JkID0gYi53b3JkIGFzIEhpdFdvcmQ7XG5cbiAgICAgIGNvbnN0IG5vdFNhbWVXb3JkVHlwZSA9IGFXb3JkLnR5cGUgIT09IGJXb3JkLnR5cGU7XG4gICAgICBpZiAoZnJvbnRNYXR0ZXIgJiYgbm90U2FtZVdvcmRUeXBlKSB7XG4gICAgICAgIHJldHVybiBiV29yZC50eXBlID09PSBcImZyb250TWF0dGVyXCIgPyAxIDogLTE7XG4gICAgICB9XG5cbiAgICAgIGlmIChzZWxlY3Rpb25IaXN0b3J5U3RvcmFnZSkge1xuICAgICAgICBjb25zdCByZXQgPSBzZWxlY3Rpb25IaXN0b3J5U3RvcmFnZS5jb21wYXJlKFxuICAgICAgICAgIGFXb3JkIGFzIEhpdFdvcmQsXG4gICAgICAgICAgYldvcmQgYXMgSGl0V29yZFxuICAgICAgICApO1xuICAgICAgICBpZiAocmV0ICE9PSAwKSB7XG4gICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoYS52YWx1ZSEubGVuZ3RoICE9PSBiLnZhbHVlIS5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIGEudmFsdWUhLmxlbmd0aCA+IGIudmFsdWUhLmxlbmd0aCA/IDEgOiAtMTtcbiAgICAgIH1cbiAgICAgIGlmIChub3RTYW1lV29yZFR5cGUpIHtcbiAgICAgICAgcmV0dXJuIFdvcmRUeXBlTWV0YS5vZihiV29yZC50eXBlKS5wcmlvcml0eSA+XG4gICAgICAgICAgV29yZFR5cGVNZXRhLm9mKGFXb3JkLnR5cGUpLnByaW9yaXR5XG4gICAgICAgICAgPyAxXG4gICAgICAgICAgOiAtMTtcbiAgICAgIH1cbiAgICAgIGlmIChhLmFsaWFzICE9PSBiLmFsaWFzKSB7XG4gICAgICAgIHJldHVybiBhLmFsaWFzID8gMSA6IC0xO1xuICAgICAgfVxuICAgICAgcmV0dXJuIDA7XG4gICAgfSlcbiAgICAubWFwKCh4KSA9PiB4LndvcmQpXG4gICAgLnNsaWNlKDAsIG1heCk7XG5cbiAgLy8gWFhYOiBUaGVyZSBpcyBubyBndWFyYW50ZWUgdGhhdCBlcXVhbHMgd2l0aCBtYXgsIGJ1dCBpdCBpcyBpbXBvcnRhbnQgZm9yIHBlcmZvcm1hbmNlXG4gIHJldHVybiB1bmlxV2l0aChcbiAgICBjYW5kaWRhdGUsXG4gICAgKGEsIGIpID0+XG4gICAgICBhLnZhbHVlID09PSBiLnZhbHVlICYmXG4gICAgICBXb3JkVHlwZU1ldGEub2YoYS50eXBlKS5ncm91cCA9PT0gV29yZFR5cGVNZXRhLm9mKGIudHlwZSkuZ3JvdXBcbiAgKTtcbn1cblxuLy8gVE9ETzogcmVmYWN0b3Jpbmdcbi8vIFB1YmxpYyBmb3IgdGVzdHNcbmV4cG9ydCBmdW5jdGlvbiBqdWRnZUJ5UGFydGlhbE1hdGNoKFxuICB3b3JkOiBXb3JkLFxuICBxdWVyeTogc3RyaW5nLFxuICBxdWVyeVN0YXJ0V2l0aFVwcGVyOiBib29sZWFuXG4pOiBKdWRnZW1lbnQge1xuICBpZiAocXVlcnkgPT09IFwiXCIpIHtcbiAgICByZXR1cm4ge1xuICAgICAgd29yZDogeyAuLi53b3JkLCBoaXQ6IHdvcmQudmFsdWUgfSxcbiAgICAgIHZhbHVlOiB3b3JkLnZhbHVlLFxuICAgICAgYWxpYXM6IGZhbHNlLFxuICAgIH07XG4gIH1cblxuICBpZiAobG93ZXJTdGFydHNXaXRoKHdvcmQudmFsdWUsIHF1ZXJ5KSkge1xuICAgIGlmIChcbiAgICAgIHF1ZXJ5U3RhcnRXaXRoVXBwZXIgJiZcbiAgICAgIHdvcmQudHlwZSAhPT0gXCJpbnRlcm5hbExpbmtcIiAmJlxuICAgICAgd29yZC50eXBlICE9PSBcImZyb250TWF0dGVyXCJcbiAgICApIHtcbiAgICAgIGNvbnN0IGMgPSBjYXBpdGFsaXplRmlyc3RMZXR0ZXIod29yZC52YWx1ZSk7XG4gICAgICByZXR1cm4geyB3b3JkOiB7IC4uLndvcmQsIHZhbHVlOiBjLCBoaXQ6IGMgfSwgdmFsdWU6IGMsIGFsaWFzOiBmYWxzZSB9O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB3b3JkOiB7IC4uLndvcmQsIGhpdDogd29yZC52YWx1ZSB9LFxuICAgICAgICB2YWx1ZTogd29yZC52YWx1ZSxcbiAgICAgICAgYWxpYXM6IGZhbHNlLFxuICAgICAgfTtcbiAgICB9XG4gIH1cblxuICBjb25zdCBtYXRjaGVkQWxpYXNTdGFydHMgPSB3b3JkLmFsaWFzZXM/LmZpbmQoKGEpID0+XG4gICAgbG93ZXJTdGFydHNXaXRoKGEsIHF1ZXJ5KVxuICApO1xuICBpZiAobWF0Y2hlZEFsaWFzU3RhcnRzKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHdvcmQ6IHsgLi4ud29yZCwgaGl0OiBtYXRjaGVkQWxpYXNTdGFydHMgfSxcbiAgICAgIHZhbHVlOiBtYXRjaGVkQWxpYXNTdGFydHMsXG4gICAgICBhbGlhczogdHJ1ZSxcbiAgICB9O1xuICB9XG5cbiAgaWYgKGxvd2VySW5jbHVkZXMod29yZC52YWx1ZSwgcXVlcnkpKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHdvcmQ6IHsgLi4ud29yZCwgaGl0OiB3b3JkLnZhbHVlIH0sXG4gICAgICB2YWx1ZTogd29yZC52YWx1ZSxcbiAgICAgIGFsaWFzOiBmYWxzZSxcbiAgICB9O1xuICB9XG5cbiAgY29uc3QgbWF0Y2hlZEFsaWFzSW5jbHVkZWQgPSB3b3JkLmFsaWFzZXM/LmZpbmQoKGEpID0+XG4gICAgbG93ZXJJbmNsdWRlcyhhLCBxdWVyeSlcbiAgKTtcbiAgaWYgKG1hdGNoZWRBbGlhc0luY2x1ZGVkKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHdvcmQ6IHsgLi4ud29yZCwgaGl0OiBtYXRjaGVkQWxpYXNJbmNsdWRlZCB9LFxuICAgICAgdmFsdWU6IG1hdGNoZWRBbGlhc0luY2x1ZGVkLFxuICAgICAgYWxpYXM6IHRydWUsXG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiB7IHdvcmQ6IHdvcmQsIGFsaWFzOiBmYWxzZSB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc3VnZ2VzdFdvcmRzQnlQYXJ0aWFsTWF0Y2goXG4gIGluZGV4ZWRXb3JkczogSW5kZXhlZFdvcmRzLFxuICBxdWVyeTogc3RyaW5nLFxuICBtYXg6IG51bWJlcixcbiAgZnJvbnRNYXR0ZXI6IHN0cmluZyB8IG51bGwsXG4gIHNlbGVjdGlvbkhpc3RvcnlTdG9yYWdlPzogU2VsZWN0aW9uSGlzdG9yeVN0b3JhZ2Vcbik6IFdvcmRbXSB7XG4gIGNvbnN0IHF1ZXJ5U3RhcnRXaXRoVXBwZXIgPSBjYXBpdGFsaXplRmlyc3RMZXR0ZXIocXVlcnkpID09PSBxdWVyeTtcblxuICBjb25zdCBmbGF0T2JqZWN0VmFsdWVzID0gKG9iamVjdDogeyBbZmlyc3RMZXR0ZXI6IHN0cmluZ106IFdvcmRbXSB9KSA9PlxuICAgIE9iamVjdC52YWx1ZXMob2JqZWN0KS5mbGF0KCk7XG5cbiAgY29uc3QgZmxhdHRlbkZyb250TWF0dGVyV29yZHMgPSAoKSA9PiB7XG4gICAgaWYgKGZyb250TWF0dGVyID09PSBcImFsaWFzXCIgfHwgZnJvbnRNYXR0ZXIgPT09IFwiYWxpYXNlc1wiKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuICAgIGlmIChmcm9udE1hdHRlciAmJiBpbmRleGVkV29yZHMuZnJvbnRNYXR0ZXI/Lltmcm9udE1hdHRlcl0pIHtcbiAgICAgIHJldHVybiBPYmplY3QudmFsdWVzKGluZGV4ZWRXb3Jkcy5mcm9udE1hdHRlcj8uW2Zyb250TWF0dGVyXSkuZmxhdCgpO1xuICAgIH1cbiAgICByZXR1cm4gW107XG4gIH07XG5cbiAgY29uc3Qgd29yZHMgPSBmcm9udE1hdHRlclxuICAgID8gZmxhdHRlbkZyb250TWF0dGVyV29yZHMoKVxuICAgIDogW1xuICAgICAgICAuLi5mbGF0T2JqZWN0VmFsdWVzKGluZGV4ZWRXb3Jkcy5jdXJyZW50RmlsZSksXG4gICAgICAgIC4uLmZsYXRPYmplY3RWYWx1ZXMoaW5kZXhlZFdvcmRzLmN1cnJlbnRWYXVsdCksXG4gICAgICAgIC4uLmZsYXRPYmplY3RWYWx1ZXMoaW5kZXhlZFdvcmRzLmN1c3RvbURpY3Rpb25hcnkpLFxuICAgICAgICAuLi5mbGF0T2JqZWN0VmFsdWVzKGluZGV4ZWRXb3Jkcy5pbnRlcm5hbExpbmspLFxuICAgICAgXTtcblxuICBjb25zdCBjYW5kaWRhdGUgPSBBcnJheS5mcm9tKHdvcmRzKVxuICAgIC5tYXAoKHgpID0+IGp1ZGdlQnlQYXJ0aWFsTWF0Y2goeCwgcXVlcnksIHF1ZXJ5U3RhcnRXaXRoVXBwZXIpKVxuICAgIC5maWx0ZXIoKHgpID0+IHgudmFsdWUgIT09IHVuZGVmaW5lZClcbiAgICAuc29ydCgoYSwgYikgPT4ge1xuICAgICAgY29uc3QgYVdvcmQgPSBhLndvcmQgYXMgSGl0V29yZDtcbiAgICAgIGNvbnN0IGJXb3JkID0gYi53b3JkIGFzIEhpdFdvcmQ7XG5cbiAgICAgIGNvbnN0IG5vdFNhbWVXb3JkVHlwZSA9IGFXb3JkLnR5cGUgIT09IGJXb3JkLnR5cGU7XG4gICAgICBpZiAoZnJvbnRNYXR0ZXIgJiYgbm90U2FtZVdvcmRUeXBlKSB7XG4gICAgICAgIHJldHVybiBiV29yZC50eXBlID09PSBcImZyb250TWF0dGVyXCIgPyAxIDogLTE7XG4gICAgICB9XG5cbiAgICAgIGlmIChzZWxlY3Rpb25IaXN0b3J5U3RvcmFnZSkge1xuICAgICAgICBjb25zdCByZXQgPSBzZWxlY3Rpb25IaXN0b3J5U3RvcmFnZS5jb21wYXJlKFxuICAgICAgICAgIGFXb3JkIGFzIEhpdFdvcmQsXG4gICAgICAgICAgYldvcmQgYXMgSGl0V29yZFxuICAgICAgICApO1xuICAgICAgICBpZiAocmV0ICE9PSAwKSB7XG4gICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zdCBhcyA9IGxvd2VyU3RhcnRzV2l0aChhLnZhbHVlISwgcXVlcnkpO1xuICAgICAgY29uc3QgYnMgPSBsb3dlclN0YXJ0c1dpdGgoYi52YWx1ZSEsIHF1ZXJ5KTtcbiAgICAgIGlmIChhcyAhPT0gYnMpIHtcbiAgICAgICAgcmV0dXJuIGJzID8gMSA6IC0xO1xuICAgICAgfVxuXG4gICAgICBpZiAoYS52YWx1ZSEubGVuZ3RoICE9PSBiLnZhbHVlIS5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIGEudmFsdWUhLmxlbmd0aCA+IGIudmFsdWUhLmxlbmd0aCA/IDEgOiAtMTtcbiAgICAgIH1cbiAgICAgIGlmIChub3RTYW1lV29yZFR5cGUpIHtcbiAgICAgICAgcmV0dXJuIFdvcmRUeXBlTWV0YS5vZihiV29yZC50eXBlKS5wcmlvcml0eSA+XG4gICAgICAgICAgV29yZFR5cGVNZXRhLm9mKGFXb3JkLnR5cGUpLnByaW9yaXR5XG4gICAgICAgICAgPyAxXG4gICAgICAgICAgOiAtMTtcbiAgICAgIH1cbiAgICAgIGlmIChhLmFsaWFzICE9PSBiLmFsaWFzKSB7XG4gICAgICAgIHJldHVybiBhLmFsaWFzID8gMSA6IC0xO1xuICAgICAgfVxuICAgICAgcmV0dXJuIDA7XG4gICAgfSlcbiAgICAubWFwKCh4KSA9PiB4LndvcmQpXG4gICAgLnNsaWNlKDAsIG1heCk7XG5cbiAgLy8gWFhYOiBUaGVyZSBpcyBubyBndWFyYW50ZWUgdGhhdCBlcXVhbHMgd2l0aCBtYXgsIGJ1dCBpdCBpcyBpbXBvcnRhbnQgZm9yIHBlcmZvcm1hbmNlXG4gIHJldHVybiB1bmlxV2l0aChcbiAgICBjYW5kaWRhdGUsXG4gICAgKGEsIGIpID0+XG4gICAgICBhLnZhbHVlID09PSBiLnZhbHVlICYmXG4gICAgICBXb3JkVHlwZU1ldGEub2YoYS50eXBlKS5ncm91cCA9PT0gV29yZFR5cGVNZXRhLm9mKGIudHlwZSkuZ3JvdXBcbiAgKTtcbn1cbiIsImV4cG9ydCBmdW5jdGlvbiBiYXNlbmFtZShwYXRoOiBzdHJpbmcsIGV4dD86IHN0cmluZyk6IHN0cmluZyB7XG4gIGNvbnN0IG5hbWUgPSBwYXRoLm1hdGNoKC8uK1tcXFxcL10oW15cXFxcL10rKVtcXFxcL10/JC8pPy5bMV0gPz8gcGF0aDtcbiAgcmV0dXJuIGV4dCAmJiBuYW1lLmVuZHNXaXRoKGV4dCkgPyBuYW1lLnJlcGxhY2UoZXh0LCBcIlwiKSA6IG5hbWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBleHRuYW1lKHBhdGg6IHN0cmluZyk6IHN0cmluZyB7XG4gIGNvbnN0IGV4dCA9IGJhc2VuYW1lKHBhdGgpLnNwbGl0KFwiLlwiKS5zbGljZSgxKS5wb3AoKTtcbiAgcmV0dXJuIGV4dCA/IGAuJHtleHR9YCA6IFwiXCI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkaXJuYW1lKHBhdGg6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiBwYXRoLm1hdGNoKC8oLispW1xcXFwvXS4rJC8pPy5bMV0gPz8gXCIuXCI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1VSTChwYXRoOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuIEJvb2xlYW4ocGF0aC5tYXRjaChuZXcgUmVnRXhwKFwiXmh0dHBzPzovL1wiKSkpO1xufVxuIiwiaW1wb3J0IHsgQXBwLCBGaWxlU3lzdGVtQWRhcHRlciwgTm90aWNlLCByZXF1ZXN0IH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgeyBwdXNoV29yZCwgdHlwZSBXb3Jkc0J5Rmlyc3RMZXR0ZXIgfSBmcm9tIFwiLi9zdWdnZXN0ZXJcIjtcbmltcG9ydCB0eXBlIHsgQ29sdW1uRGVsaW1pdGVyIH0gZnJvbSBcIi4uL29wdGlvbi9Db2x1bW5EZWxpbWl0ZXJcIjtcbmltcG9ydCB7IGlzVVJMIH0gZnJvbSBcIi4uL3V0aWwvcGF0aFwiO1xuaW1wb3J0IHR5cGUgeyBDdXN0b21EaWN0aW9uYXJ5V29yZCB9IGZyb20gXCIuLi9tb2RlbC9Xb3JkXCI7XG5pbXBvcnQgeyBleGNsdWRlRW1vamkgfSBmcm9tIFwiLi4vdXRpbC9zdHJpbmdzXCI7XG5pbXBvcnQgdHlwZSB7IEFwcEhlbHBlciB9IGZyb20gXCIuLi9hcHAtaGVscGVyXCI7XG5cbnR5cGUgSnNvbkRpY3Rpb25hcnkgPSB7XG4gIC8qKiBJZiBzZXQsIHRha2UgcHJlY2VkZW5jZSBvdmVyIFtcIkNhcmV0IGxvY2F0aW9uIHN5bWJvbCBhZnRlciBjb21wbGVtZW50XCJdKGh0dHBzOi8vdGFkYXNoaS1haWthd2EuZ2l0aHViLmlvL2RvY3Mtb2JzaWRpYW4tdmFyaW91cy1jb21wbGVtZW50cy1wbHVnaW4vNC4lMjBPcHRpb25zLzQuNi4lMjBDdXN0b20lMjBkaWN0aW9uYXJ5JTIwY29tcGxlbWVudC8lRTIlOUElOTklRUYlQjglOEZDYXJldCUyMGxvY2F0aW9uJTIwc3ltYm9sJTIwYWZ0ZXIlMjBjb21wbGVtZW50LykgKi9cbiAgY2FyZXRTeW1ib2w/OiBzdHJpbmc7XG4gIC8qKiBJZiBzZXQsIGlnbm9yZSBbXCJJbnNlcnQgc3BhY2UgYWZ0ZXIgY29tcGxldGlvblwiXShodHRwczovL3RhZGFzaGktYWlrYXdhLmdpdGh1Yi5pby9kb2NzLW9ic2lkaWFuLXZhcmlvdXMtY29tcGxlbWVudHMtcGx1Z2luLzQuJTIwT3B0aW9ucy80LjEuJTIwTWFpbi8lRTIlOUElOTklRUYlQjglOEZJbnNlcnQlMjBzcGFjZSUyMGFmdGVyJTIwY29tcGxldGlvbi8pICovXG4gIGlnbm9yZVNwYWNlQWZ0ZXJDb21wbGV0aW9uPzogYm9vbGVhbjtcbiAgd29yZHM6IHtcbiAgICB2YWx1ZTogc3RyaW5nO1xuICAgIGRlc2NyaXB0aW9uPzogc3RyaW5nO1xuICAgIGFsaWFzZXM/OiBzdHJpbmdbXTtcbiAgICAvKiogSWYgc2V0LCB1c2UgdGhpcyB2YWx1ZSBmb3Igc2VhcmNoaW5nIGFuZCByZW5kZXJpbmcgaW5zdGVhZCBvZiBgdmFsdWVgICovXG4gICAgZGlzcGxheWVkPzogc3RyaW5nO1xuICB9W107XG59O1xuXG5mdW5jdGlvbiBlc2NhcGUodmFsdWU6IHN0cmluZyk6IHN0cmluZyB7XG4gIC8vIFRoaXMgdHJpY2t5IGxvZ2ljcyBmb3IgU2FmYXJpXG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS90YWRhc2hpLWFpa2F3YS9vYnNpZGlhbi12YXJpb3VzLWNvbXBsZW1lbnRzLXBsdWdpbi9pc3N1ZXMvNTZcbiAgcmV0dXJuIHZhbHVlXG4gICAgLnJlcGxhY2UoL1xcXFwvZywgXCJfX1ZhcmlvdXNDb21wbGVtZW50c0VzY2FwZV9fXCIpXG4gICAgLnJlcGxhY2UoL1xcbi9nLCBcIlxcXFxuXCIpXG4gICAgLnJlcGxhY2UoL1xcdC9nLCBcIlxcXFx0XCIpXG4gICAgLnJlcGxhY2UoL19fVmFyaW91c0NvbXBsZW1lbnRzRXNjYXBlX18vZywgXCJcXFxcXFxcXFwiKTtcbn1cblxuZnVuY3Rpb24gdW5lc2NhcGUodmFsdWU6IHN0cmluZyk6IHN0cmluZyB7XG4gIC8vIFRoaXMgdHJpY2t5IGxvZ2ljcyBmb3IgU2FmYXJpXG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS90YWRhc2hpLWFpa2F3YS9vYnNpZGlhbi12YXJpb3VzLWNvbXBsZW1lbnRzLXBsdWdpbi9pc3N1ZXMvNTZcbiAgcmV0dXJuIHZhbHVlXG4gICAgLnJlcGxhY2UoL1xcXFxcXFxcL2csIFwiX19WYXJpb3VzQ29tcGxlbWVudHNFc2NhcGVfX1wiKVxuICAgIC5yZXBsYWNlKC9cXFxcbi9nLCBcIlxcblwiKVxuICAgIC5yZXBsYWNlKC9cXFxcdC9nLCBcIlxcdFwiKVxuICAgIC5yZXBsYWNlKC9fX1ZhcmlvdXNDb21wbGVtZW50c0VzY2FwZV9fL2csIFwiXFxcXFwiKTtcbn1cblxuZnVuY3Rpb24ganNvblRvV29yZHMoXG4gIGpzb246IEpzb25EaWN0aW9uYXJ5LFxuICBwYXRoOiBzdHJpbmcsXG4gIHN5c3RlbUNhcmV0U3ltYm9sPzogc3RyaW5nXG4pOiBDdXN0b21EaWN0aW9uYXJ5V29yZFtdIHtcbiAgcmV0dXJuIGpzb24ud29yZHMubWFwKCh4KSA9PiAoe1xuICAgIHZhbHVlOiB4LmRpc3BsYXllZCB8fCB4LnZhbHVlLFxuICAgIGRlc2NyaXB0aW9uOiB4LmRlc2NyaXB0aW9uLFxuICAgIGFsaWFzZXM6IHguYWxpYXNlcyxcbiAgICB0eXBlOiBcImN1c3RvbURpY3Rpb25hcnlcIixcbiAgICBjcmVhdGVkUGF0aDogcGF0aCxcbiAgICBpbnNlcnRlZFRleHQ6IHguZGlzcGxheWVkID8geC52YWx1ZSA6IHVuZGVmaW5lZCxcbiAgICBjYXJldFN5bWJvbDoganNvbi5jYXJldFN5bWJvbCA/PyBzeXN0ZW1DYXJldFN5bWJvbCxcbiAgICBpZ25vcmVTcGFjZUFmdGVyQ29tcGxldGlvbjoganNvbi5pZ25vcmVTcGFjZUFmdGVyQ29tcGxldGlvbixcbiAgfSkpO1xufVxuXG5mdW5jdGlvbiBsaW5lVG9Xb3JkKFxuICBsaW5lOiBzdHJpbmcsXG4gIGRlbGltaXRlcjogQ29sdW1uRGVsaW1pdGVyLFxuICBwYXRoOiBzdHJpbmcsXG4gIGRlbGltaXRlckZvckRpc3BsYXk/OiBzdHJpbmcsXG4gIGRlbGltaXRlckZvckhpZGU/OiBzdHJpbmcsXG4gIHN5c3RlbUNhcmV0U3ltYm9sPzogc3RyaW5nXG4pOiBDdXN0b21EaWN0aW9uYXJ5V29yZCB7XG4gIGNvbnN0IFt2LCBkZXNjcmlwdGlvbiwgLi4uYWxpYXNlc10gPSBsaW5lLnNwbGl0KGRlbGltaXRlci52YWx1ZSk7XG5cbiAgbGV0IHZhbHVlID0gdW5lc2NhcGUodik7XG4gIGxldCBpbnNlcnRlZFRleHQ6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgbGV0IGRpc3BsYXllZFRleHQgPSB2YWx1ZTtcblxuICBpZiAoZGVsaW1pdGVyRm9yRGlzcGxheSAmJiB2YWx1ZS5pbmNsdWRlcyhkZWxpbWl0ZXJGb3JEaXNwbGF5KSkge1xuICAgIFtkaXNwbGF5ZWRUZXh0LCBpbnNlcnRlZFRleHRdID0gdmFsdWUuc3BsaXQoZGVsaW1pdGVyRm9yRGlzcGxheSk7XG4gIH1cbiAgaWYgKGRlbGltaXRlckZvckhpZGUgJiYgdmFsdWUuaW5jbHVkZXMoZGVsaW1pdGVyRm9ySGlkZSkpIHtcbiAgICBpbnNlcnRlZFRleHQgPSB2YWx1ZS5yZXBsYWNlKGRlbGltaXRlckZvckhpZGUsIFwiXCIpO1xuICAgIGRpc3BsYXllZFRleHQgPSBgJHt2YWx1ZS5zcGxpdChkZWxpbWl0ZXJGb3JIaWRlKVswXX0gLi4uYDtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgdmFsdWU6IGRpc3BsYXllZFRleHQsXG4gICAgZGVzY3JpcHRpb24sXG4gICAgYWxpYXNlcyxcbiAgICB0eXBlOiBcImN1c3RvbURpY3Rpb25hcnlcIixcbiAgICBjcmVhdGVkUGF0aDogcGF0aCxcbiAgICBpbnNlcnRlZFRleHQsXG4gICAgY2FyZXRTeW1ib2w6IHN5c3RlbUNhcmV0U3ltYm9sLFxuICB9O1xufVxuXG5mdW5jdGlvbiB3b3JkVG9MaW5lKFxuICB3b3JkOiBDdXN0b21EaWN0aW9uYXJ5V29yZCxcbiAgZGVsaW1pdGVyOiBDb2x1bW5EZWxpbWl0ZXIsXG4gIGRpdmlkZXJGb3JEaXNwbGF5OiBzdHJpbmcgfCBudWxsXG4pOiBzdHJpbmcge1xuICBjb25zdCB2YWx1ZSA9XG4gICAgd29yZC5pbnNlcnRlZFRleHQgJiYgZGl2aWRlckZvckRpc3BsYXlcbiAgICAgID8gYCR7d29yZC52YWx1ZX0ke2RpdmlkZXJGb3JEaXNwbGF5fSR7d29yZC5pbnNlcnRlZFRleHR9YFxuICAgICAgOiB3b3JkLnZhbHVlO1xuXG4gIGNvbnN0IGVzY2FwZWRWYWx1ZSA9IGVzY2FwZSh2YWx1ZSk7XG4gIGlmICghd29yZC5kZXNjcmlwdGlvbiAmJiAhd29yZC5hbGlhc2VzKSB7XG4gICAgcmV0dXJuIGVzY2FwZWRWYWx1ZTtcbiAgfVxuICBpZiAoIXdvcmQuYWxpYXNlcykge1xuICAgIHJldHVybiBbZXNjYXBlZFZhbHVlLCB3b3JkLmRlc2NyaXB0aW9uXS5qb2luKGRlbGltaXRlci52YWx1ZSk7XG4gIH1cbiAgcmV0dXJuIFtlc2NhcGVkVmFsdWUsIHdvcmQuZGVzY3JpcHRpb24sIC4uLndvcmQuYWxpYXNlc10uam9pbihcbiAgICBkZWxpbWl0ZXIudmFsdWVcbiAgKTtcbn1cblxuZnVuY3Rpb24gc3lub255bUFsaWFzZXMobmFtZTogc3RyaW5nKTogc3RyaW5nW10ge1xuICBjb25zdCBsZXNzRW1vamlWYWx1ZSA9IGV4Y2x1ZGVFbW9qaShuYW1lKTtcbiAgcmV0dXJuIG5hbWUgPT09IGxlc3NFbW9qaVZhbHVlID8gW10gOiBbbGVzc0Vtb2ppVmFsdWVdO1xufVxuXG50eXBlIE9wdGlvbiA9IHtcbiAgcmVnZXhwOiBzdHJpbmc7XG4gIGRlbGltaXRlckZvckhpZGU/OiBzdHJpbmc7XG4gIGRlbGltaXRlckZvckRpc3BsYXk/OiBzdHJpbmc7XG4gIGNhcmV0U3ltYm9sPzogc3RyaW5nO1xufTtcblxuZXhwb3J0IGNsYXNzIEN1c3RvbURpY3Rpb25hcnlXb3JkUHJvdmlkZXIge1xuICBwcml2YXRlIHdvcmRzOiBDdXN0b21EaWN0aW9uYXJ5V29yZFtdID0gW107XG4gIHdvcmRCeVZhbHVlOiB7IFt2YWx1ZTogc3RyaW5nXTogQ3VzdG9tRGljdGlvbmFyeVdvcmQgfSA9IHt9O1xuICB3b3Jkc0J5Rmlyc3RMZXR0ZXI6IFdvcmRzQnlGaXJzdExldHRlciA9IHt9O1xuXG4gIHByaXZhdGUgYXBwSGVscGVyOiBBcHBIZWxwZXI7XG4gIHByaXZhdGUgZmlsZVN5c3RlbUFkYXB0ZXI6IEZpbGVTeXN0ZW1BZGFwdGVyO1xuICBwcml2YXRlIHBhdGhzOiBzdHJpbmdbXTtcbiAgcHJpdmF0ZSBkZWxpbWl0ZXI6IENvbHVtbkRlbGltaXRlcjtcbiAgcHJpdmF0ZSBkaXZpZGVyRm9yRGlzcGxheTogc3RyaW5nIHwgbnVsbDtcblxuICBjb25zdHJ1Y3RvcihhcHA6IEFwcCwgYXBwSGVscGVyOiBBcHBIZWxwZXIpIHtcbiAgICB0aGlzLmFwcEhlbHBlciA9IGFwcEhlbHBlcjtcbiAgICB0aGlzLmZpbGVTeXN0ZW1BZGFwdGVyID0gYXBwLnZhdWx0LmFkYXB0ZXIgYXMgRmlsZVN5c3RlbUFkYXB0ZXI7XG4gIH1cblxuICBnZXQgZWRpdGFibGVQYXRocygpOiBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIHRoaXMucGF0aHMuZmlsdGVyKCh4KSA9PiAhaXNVUkwoeCkgJiYgIXguZW5kc1dpdGgoXCIuanNvblwiKSk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGxvYWRXb3JkcyhcbiAgICBwYXRoOiBzdHJpbmcsXG4gICAgb3B0aW9uOiBPcHRpb25cbiAgKTogUHJvbWlzZTxDdXN0b21EaWN0aW9uYXJ5V29yZFtdPiB7XG4gICAgY29uc3QgY29udGVudHMgPSBpc1VSTChwYXRoKVxuICAgICAgPyBhd2FpdCByZXF1ZXN0KHsgdXJsOiBwYXRoIH0pXG4gICAgICA6IGF3YWl0IHRoaXMuZmlsZVN5c3RlbUFkYXB0ZXIucmVhZChwYXRoKTtcblxuICAgIGNvbnN0IHdvcmRzID0gcGF0aC5lbmRzV2l0aChcIi5qc29uXCIpXG4gICAgICA/IGpzb25Ub1dvcmRzKEpTT04ucGFyc2UoY29udGVudHMpLCBwYXRoLCBvcHRpb24uY2FyZXRTeW1ib2wpXG4gICAgICA6IGNvbnRlbnRzXG4gICAgICAgICAgLnNwbGl0KC9cXHJcXG58XFxuLylcbiAgICAgICAgICAubWFwKCh4KSA9PiB4LnJlcGxhY2UoLyUlLiolJS9nLCBcIlwiKSlcbiAgICAgICAgICAuZmlsdGVyKCh4KSA9PiB4KVxuICAgICAgICAgIC5tYXAoKHgpID0+XG4gICAgICAgICAgICBsaW5lVG9Xb3JkKFxuICAgICAgICAgICAgICB4LFxuICAgICAgICAgICAgICB0aGlzLmRlbGltaXRlcixcbiAgICAgICAgICAgICAgcGF0aCxcbiAgICAgICAgICAgICAgb3B0aW9uLmRlbGltaXRlckZvckRpc3BsYXksXG4gICAgICAgICAgICAgIG9wdGlvbi5kZWxpbWl0ZXJGb3JIaWRlLFxuICAgICAgICAgICAgICBvcHRpb24uY2FyZXRTeW1ib2xcbiAgICAgICAgICAgIClcbiAgICAgICAgICApO1xuXG4gICAgcmV0dXJuIHdvcmRzLmZpbHRlcihcbiAgICAgICh4KSA9PiAhb3B0aW9uLnJlZ2V4cCB8fCB4LnZhbHVlLm1hdGNoKG5ldyBSZWdFeHAob3B0aW9uLnJlZ2V4cCkpXG4gICAgKTtcbiAgfVxuXG4gIGFzeW5jIHJlZnJlc2hDdXN0b21Xb3JkcyhvcHRpb246IE9wdGlvbik6IFByb21pc2U8dm9pZD4ge1xuICAgIHRoaXMuY2xlYXJXb3JkcygpO1xuXG4gICAgZm9yIChjb25zdCBwYXRoIG9mIHRoaXMucGF0aHMpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHdvcmRzID0gYXdhaXQgdGhpcy5sb2FkV29yZHMocGF0aCwgb3B0aW9uKTtcbiAgICAgICAgd29yZHMuZm9yRWFjaCgoeCkgPT4gdGhpcy53b3Jkcy5wdXNoKHgpKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gbm9pbnNwZWN0aW9uIE9iamVjdEFsbG9jYXRpb25JZ25vcmVkXG4gICAgICAgIG5ldyBOb3RpY2UoXG4gICAgICAgICAgYOKaoCBGYWlsIHRvIGxvYWQgJHtwYXRofSAtLSBWYXJpb3VzIENvbXBsZW1lbnRzIFBsdWdpbiAtLSBcXG4gJHtlfWAsXG4gICAgICAgICAgMFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMud29yZHMuZm9yRWFjaCgoeCkgPT4gdGhpcy5hZGRXb3JkKHgpKTtcbiAgfVxuXG4gIGFzeW5jIGFkZFdvcmRXaXRoRGljdGlvbmFyeShcbiAgICB3b3JkOiBDdXN0b21EaWN0aW9uYXJ5V29yZCxcbiAgICBkaWN0aW9uYXJ5UGF0aDogc3RyaW5nXG4gICk6IFByb21pc2U8dm9pZD4ge1xuICAgIHRoaXMuYWRkV29yZCh3b3JkKTtcbiAgICBhd2FpdCB0aGlzLmZpbGVTeXN0ZW1BZGFwdGVyLmFwcGVuZChcbiAgICAgIGRpY3Rpb25hcnlQYXRoLFxuICAgICAgXCJcXG5cIiArIHdvcmRUb0xpbmUod29yZCwgdGhpcy5kZWxpbWl0ZXIsIHRoaXMuZGl2aWRlckZvckRpc3BsYXkpXG4gICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgYWRkV29yZCh3b3JkOiBDdXN0b21EaWN0aW9uYXJ5V29yZCkge1xuICAgIC8vIEFkZCBhbGlhc2VzIGFzIGEgc3lub255bVxuICAgIGNvbnN0IHdvcmRXaXRoU3lub255bSA9IHtcbiAgICAgIC4uLndvcmQsXG4gICAgICBhbGlhc2VzOiBbLi4uKHdvcmQuYWxpYXNlcyA/PyBbXSksIC4uLnN5bm9ueW1BbGlhc2VzKHdvcmQudmFsdWUpXSxcbiAgICB9O1xuXG4gICAgdGhpcy53b3JkQnlWYWx1ZVt3b3JkV2l0aFN5bm9ueW0udmFsdWVdID0gd29yZFdpdGhTeW5vbnltO1xuICAgIHB1c2hXb3JkKFxuICAgICAgdGhpcy53b3Jkc0J5Rmlyc3RMZXR0ZXIsXG4gICAgICB3b3JkV2l0aFN5bm9ueW0udmFsdWUuY2hhckF0KDApLFxuICAgICAgd29yZFdpdGhTeW5vbnltXG4gICAgKTtcbiAgICB3b3JkV2l0aFN5bm9ueW0uYWxpYXNlcz8uZm9yRWFjaCgoYSkgPT5cbiAgICAgIHB1c2hXb3JkKHRoaXMud29yZHNCeUZpcnN0TGV0dGVyLCBhLmNoYXJBdCgwKSwgd29yZFdpdGhTeW5vbnltKVxuICAgICk7XG4gIH1cblxuICBjbGVhcldvcmRzKCk6IHZvaWQge1xuICAgIHRoaXMud29yZHMgPSBbXTtcbiAgICB0aGlzLndvcmRCeVZhbHVlID0ge307XG4gICAgdGhpcy53b3Jkc0J5Rmlyc3RMZXR0ZXIgPSB7fTtcbiAgfVxuXG4gIGdldCB3b3JkQ291bnQoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy53b3Jkcy5sZW5ndGg7XG4gIH1cblxuICBzZXRTZXR0aW5ncyhcbiAgICBwYXRoczogc3RyaW5nW10sXG4gICAgZGVsaW1pdGVyOiBDb2x1bW5EZWxpbWl0ZXIsXG4gICAgZGl2aWRlckZvckRpc3BsYXk6IHN0cmluZyB8IG51bGxcbiAgKSB7XG4gICAgdGhpcy5wYXRocyA9IHBhdGhzO1xuICAgIHRoaXMuZGVsaW1pdGVyID0gZGVsaW1pdGVyO1xuICAgIHRoaXMuZGl2aWRlckZvckRpc3BsYXkgPSBkaXZpZGVyRm9yRGlzcGxheTtcbiAgfVxufVxuIiwiaW1wb3J0IHR5cGUgeyBBcHAgfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB7IGdyb3VwQnksIHVuaXEgfSBmcm9tIFwiLi4vdXRpbC9jb2xsZWN0aW9uLWhlbHBlclwiO1xuaW1wb3J0IHR5cGUgeyBXb3Jkc0J5Rmlyc3RMZXR0ZXIgfSBmcm9tIFwiLi9zdWdnZXN0ZXJcIjtcbmltcG9ydCB0eXBlIHsgVG9rZW5pemVyIH0gZnJvbSBcIi4uL3Rva2VuaXplci90b2tlbml6ZXJcIjtcbmltcG9ydCB0eXBlIHsgQXBwSGVscGVyIH0gZnJvbSBcIi4uL2FwcC1oZWxwZXJcIjtcbmltcG9ydCB7IGFsbEFscGhhYmV0cyB9IGZyb20gXCIuLi91dGlsL3N0cmluZ3NcIjtcbmltcG9ydCB0eXBlIHsgV29yZCB9IGZyb20gXCIuLi9tb2RlbC9Xb3JkXCI7XG5cbmV4cG9ydCBjbGFzcyBDdXJyZW50RmlsZVdvcmRQcm92aWRlciB7XG4gIHdvcmRzQnlGaXJzdExldHRlcjogV29yZHNCeUZpcnN0TGV0dGVyID0ge307XG4gIHByaXZhdGUgd29yZHM6IFdvcmRbXSA9IFtdO1xuICBwcml2YXRlIHRva2VuaXplcjogVG9rZW5pemVyO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgYXBwOiBBcHAsIHByaXZhdGUgYXBwSGVscGVyOiBBcHBIZWxwZXIpIHt9XG5cbiAgYXN5bmMgcmVmcmVzaFdvcmRzKG9ubHlFbmdsaXNoOiBib29sZWFuKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdGhpcy5jbGVhcldvcmRzKCk7XG5cbiAgICBjb25zdCBlZGl0b3IgPSB0aGlzLmFwcEhlbHBlci5nZXRDdXJyZW50RWRpdG9yKCk7XG4gICAgaWYgKCFlZGl0b3IpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBmaWxlID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKTtcbiAgICBpZiAoIWZpbGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBjdXJyZW50VG9rZW4gPSB0aGlzLnRva2VuaXplclxuICAgICAgLnRva2VuaXplKFxuICAgICAgICBlZGl0b3IuZ2V0TGluZShlZGl0b3IuZ2V0Q3Vyc29yKCkubGluZSkuc2xpY2UoMCwgZWRpdG9yLmdldEN1cnNvcigpLmNoKVxuICAgICAgKVxuICAgICAgLmxhc3QoKTtcblxuICAgIGNvbnN0IGNvbnRlbnQgPSBhd2FpdCB0aGlzLmFwcC52YXVsdC5jYWNoZWRSZWFkKGZpbGUpO1xuICAgIGNvbnN0IHRva2VucyA9IG9ubHlFbmdsaXNoXG4gICAgICA/IHRoaXMudG9rZW5pemVyLnRva2VuaXplKGNvbnRlbnQpLmZpbHRlcihhbGxBbHBoYWJldHMpXG4gICAgICA6IHRoaXMudG9rZW5pemVyLnRva2VuaXplKGNvbnRlbnQpO1xuICAgIHRoaXMud29yZHMgPSB1bmlxKHRva2VucylcbiAgICAgIC5maWx0ZXIoKHgpID0+IHggIT09IGN1cnJlbnRUb2tlbilcbiAgICAgIC5tYXAoKHgpID0+ICh7XG4gICAgICAgIHZhbHVlOiB4LFxuICAgICAgICB0eXBlOiBcImN1cnJlbnRGaWxlXCIsXG4gICAgICAgIGNyZWF0ZWRQYXRoOiBmaWxlLnBhdGgsXG4gICAgICB9KSk7XG4gICAgdGhpcy53b3Jkc0J5Rmlyc3RMZXR0ZXIgPSBncm91cEJ5KHRoaXMud29yZHMsICh4KSA9PiB4LnZhbHVlLmNoYXJBdCgwKSk7XG4gIH1cblxuICBjbGVhcldvcmRzKCk6IHZvaWQge1xuICAgIHRoaXMud29yZHMgPSBbXTtcbiAgICB0aGlzLndvcmRzQnlGaXJzdExldHRlciA9IHt9O1xuICB9XG5cbiAgZ2V0IHdvcmRDb3VudCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLndvcmRzLmxlbmd0aDtcbiAgfVxuXG4gIHNldFNldHRpbmdzKHRva2VuaXplcjogVG9rZW5pemVyKSB7XG4gICAgdGhpcy50b2tlbml6ZXIgPSB0b2tlbml6ZXI7XG4gIH1cbn1cbiIsImltcG9ydCB0eXBlIHsgQXBwIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgeyBwdXNoV29yZCwgdHlwZSBXb3Jkc0J5Rmlyc3RMZXR0ZXIgfSBmcm9tIFwiLi9zdWdnZXN0ZXJcIjtcbmltcG9ydCB0eXBlIHsgQXBwSGVscGVyIH0gZnJvbSBcIi4uL2FwcC1oZWxwZXJcIjtcbmltcG9ydCB7IGV4Y2x1ZGVFbW9qaSB9IGZyb20gXCIuLi91dGlsL3N0cmluZ3NcIjtcbmltcG9ydCB0eXBlIHsgSW50ZXJuYWxMaW5rV29yZCwgV29yZCB9IGZyb20gXCIuLi9tb2RlbC9Xb3JkXCI7XG5cbmV4cG9ydCBjbGFzcyBJbnRlcm5hbExpbmtXb3JkUHJvdmlkZXIge1xuICBwcml2YXRlIHdvcmRzOiBXb3JkW10gPSBbXTtcbiAgd29yZHNCeUZpcnN0TGV0dGVyOiBXb3Jkc0J5Rmlyc3RMZXR0ZXIgPSB7fTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGFwcDogQXBwLCBwcml2YXRlIGFwcEhlbHBlcjogQXBwSGVscGVyKSB7fVxuXG4gIHJlZnJlc2hXb3JkcyhcbiAgICB3b3JkQXNJbnRlcm5hbExpbmtBbGlhczogYm9vbGVhbixcbiAgICBleGNsdWRlUGF0aFByZWZpeFBhdHRlcm5zOiBzdHJpbmdbXVxuICApOiB2b2lkIHtcbiAgICB0aGlzLmNsZWFyV29yZHMoKTtcblxuICAgIGNvbnN0IHN5bm9ueW1BbGlhc2VzID0gKG5hbWU6IHN0cmluZyk6IHN0cmluZ1tdID0+IHtcbiAgICAgIGNvbnN0IGxlc3NFbW9qaVZhbHVlID0gZXhjbHVkZUVtb2ppKG5hbWUpO1xuICAgICAgcmV0dXJuIG5hbWUgPT09IGxlc3NFbW9qaVZhbHVlID8gW10gOiBbbGVzc0Vtb2ppVmFsdWVdO1xuICAgIH07XG5cbiAgICBjb25zdCByZXNvbHZlZEludGVybmFsTGlua1dvcmRzOiBJbnRlcm5hbExpbmtXb3JkW10gPSB0aGlzLmFwcC52YXVsdFxuICAgICAgLmdldE1hcmtkb3duRmlsZXMoKVxuICAgICAgLmZpbHRlcigoZikgPT5cbiAgICAgICAgZXhjbHVkZVBhdGhQcmVmaXhQYXR0ZXJucy5ldmVyeSgoeCkgPT4gIWYucGF0aC5zdGFydHNXaXRoKHgpKVxuICAgICAgKVxuICAgICAgLmZsYXRNYXAoKHgpID0+IHtcbiAgICAgICAgY29uc3QgYWxpYXNlcyA9IHRoaXMuYXBwSGVscGVyLmdldEFsaWFzZXMoeCk7XG5cbiAgICAgICAgaWYgKHdvcmRBc0ludGVybmFsTGlua0FsaWFzKSB7XG4gICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgdmFsdWU6IHguYmFzZW5hbWUsXG4gICAgICAgICAgICAgIHR5cGU6IFwiaW50ZXJuYWxMaW5rXCIsXG4gICAgICAgICAgICAgIGNyZWF0ZWRQYXRoOiB4LnBhdGgsXG4gICAgICAgICAgICAgIGFsaWFzZXM6IHN5bm9ueW1BbGlhc2VzKHguYmFzZW5hbWUpLFxuICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogeC5wYXRoLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC4uLmFsaWFzZXMubWFwKChhKSA9PiAoe1xuICAgICAgICAgICAgICB2YWx1ZTogYSxcbiAgICAgICAgICAgICAgdHlwZTogXCJpbnRlcm5hbExpbmtcIixcbiAgICAgICAgICAgICAgY3JlYXRlZFBhdGg6IHgucGF0aCxcbiAgICAgICAgICAgICAgYWxpYXNlczogc3lub255bUFsaWFzZXMoYSksXG4gICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiB4LnBhdGgsXG4gICAgICAgICAgICAgIGFsaWFzTWV0YToge1xuICAgICAgICAgICAgICAgIG9yaWdpbjogeC5iYXNlbmFtZSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0pKSxcbiAgICAgICAgICBdIGFzIEludGVybmFsTGlua1dvcmRbXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICB2YWx1ZTogeC5iYXNlbmFtZSxcbiAgICAgICAgICAgICAgdHlwZTogXCJpbnRlcm5hbExpbmtcIixcbiAgICAgICAgICAgICAgY3JlYXRlZFBhdGg6IHgucGF0aCxcbiAgICAgICAgICAgICAgYWxpYXNlczogW1xuICAgICAgICAgICAgICAgIC4uLnN5bm9ueW1BbGlhc2VzKHguYmFzZW5hbWUpLFxuICAgICAgICAgICAgICAgIC4uLmFsaWFzZXMsXG4gICAgICAgICAgICAgICAgLi4uYWxpYXNlcy5mbGF0TWFwKHN5bm9ueW1BbGlhc2VzKSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHgucGF0aCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSBhcyBJbnRlcm5hbExpbmtXb3JkW107XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgY29uc3QgdW5yZXNvbHZlZEludGVybmFsTGlua1dvcmRzOiBJbnRlcm5hbExpbmtXb3JkW10gPSB0aGlzLmFwcEhlbHBlclxuICAgICAgLnNlYXJjaFBoYW50b21MaW5rcygpXG4gICAgICAubWFwKCh7IHBhdGgsIGxpbmsgfSkgPT4ge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHZhbHVlOiBsaW5rLFxuICAgICAgICAgIHR5cGU6IFwiaW50ZXJuYWxMaW5rXCIsXG4gICAgICAgICAgY3JlYXRlZFBhdGg6IHBhdGgsXG4gICAgICAgICAgYWxpYXNlczogc3lub255bUFsaWFzZXMobGluayksXG4gICAgICAgICAgZGVzY3JpcHRpb246IGBBcHBlYXJlZCBpbiAtPiAke3BhdGh9YCxcbiAgICAgICAgICBwaGFudG9tOiB0cnVlLFxuICAgICAgICB9O1xuICAgICAgfSk7XG5cbiAgICB0aGlzLndvcmRzID0gWy4uLnJlc29sdmVkSW50ZXJuYWxMaW5rV29yZHMsIC4uLnVucmVzb2x2ZWRJbnRlcm5hbExpbmtXb3Jkc107XG4gICAgZm9yIChjb25zdCB3b3JkIG9mIHRoaXMud29yZHMpIHtcbiAgICAgIHB1c2hXb3JkKHRoaXMud29yZHNCeUZpcnN0TGV0dGVyLCB3b3JkLnZhbHVlLmNoYXJBdCgwKSwgd29yZCk7XG4gICAgICB3b3JkLmFsaWFzZXM/LmZvckVhY2goKGEpID0+XG4gICAgICAgIHB1c2hXb3JkKHRoaXMud29yZHNCeUZpcnN0TGV0dGVyLCBhLmNoYXJBdCgwKSwgd29yZClcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgY2xlYXJXb3JkcygpOiB2b2lkIHtcbiAgICB0aGlzLndvcmRzID0gW107XG4gICAgdGhpcy53b3Jkc0J5Rmlyc3RMZXR0ZXIgPSB7fTtcbiAgfVxuXG4gIGdldCB3b3JkQ291bnQoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy53b3Jkcy5sZW5ndGg7XG4gIH1cbn1cbiIsImltcG9ydCB0eXBlIHsgSW5kZXhlZFdvcmRzIH0gZnJvbSBcIi4uL3VpL0F1dG9Db21wbGV0ZVN1Z2dlc3RcIjtcbmltcG9ydCB7IHN1Z2dlc3RXb3Jkcywgc3VnZ2VzdFdvcmRzQnlQYXJ0aWFsTWF0Y2ggfSBmcm9tIFwiLi9zdWdnZXN0ZXJcIjtcbmltcG9ydCB0eXBlIHsgV29yZCB9IGZyb20gXCIuLi9tb2RlbC9Xb3JkXCI7XG5pbXBvcnQgdHlwZSB7IFNlbGVjdGlvbkhpc3RvcnlTdG9yYWdlIH0gZnJvbSBcIi4uL3N0b3JhZ2UvU2VsZWN0aW9uSGlzdG9yeVN0b3JhZ2VcIjtcblxudHlwZSBOYW1lID0gXCJwcmVmaXhcIiB8IFwicGFydGlhbFwiO1xuXG50eXBlIEhhbmRsZXIgPSAoXG4gIGluZGV4ZWRXb3JkczogSW5kZXhlZFdvcmRzLFxuICBxdWVyeTogc3RyaW5nLFxuICBtYXg6IG51bWJlcixcbiAgZnJvbnRNYXR0ZXI6IHN0cmluZyB8IG51bGwsXG4gIHNlbGVjdGlvbkhpc3RvcnlTdG9yYWdlPzogU2VsZWN0aW9uSGlzdG9yeVN0b3JhZ2VcbikgPT4gV29yZFtdO1xuXG5leHBvcnQgY2xhc3MgTWF0Y2hTdHJhdGVneSB7XG4gIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IF92YWx1ZXM6IE1hdGNoU3RyYXRlZ3lbXSA9IFtdO1xuXG4gIHN0YXRpYyByZWFkb25seSBQUkVGSVggPSBuZXcgTWF0Y2hTdHJhdGVneShcInByZWZpeFwiLCBzdWdnZXN0V29yZHMpO1xuICBzdGF0aWMgcmVhZG9ubHkgUEFSVElBTCA9IG5ldyBNYXRjaFN0cmF0ZWd5KFxuICAgIFwicGFydGlhbFwiLFxuICAgIHN1Z2dlc3RXb3Jkc0J5UGFydGlhbE1hdGNoXG4gICk7XG5cbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcihyZWFkb25seSBuYW1lOiBOYW1lLCByZWFkb25seSBoYW5kbGVyOiBIYW5kbGVyKSB7XG4gICAgTWF0Y2hTdHJhdGVneS5fdmFsdWVzLnB1c2godGhpcyk7XG4gIH1cblxuICBzdGF0aWMgZnJvbU5hbWUobmFtZTogc3RyaW5nKTogTWF0Y2hTdHJhdGVneSB7XG4gICAgcmV0dXJuIE1hdGNoU3RyYXRlZ3kuX3ZhbHVlcy5maW5kKCh4KSA9PiB4Lm5hbWUgPT09IG5hbWUpITtcbiAgfVxuXG4gIHN0YXRpYyB2YWx1ZXMoKTogTWF0Y2hTdHJhdGVneVtdIHtcbiAgICByZXR1cm4gTWF0Y2hTdHJhdGVneS5fdmFsdWVzO1xuICB9XG59XG4iLCJpbXBvcnQgdHlwZSB7IE1vZGlmaWVyIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5cbnR5cGUgTmFtZSA9XG4gIHwgXCJOb25lXCJcbiAgfCBcIlRhYiwgU2hpZnQrVGFiXCJcbiAgfCBcIkN0cmwvQ21kK04sIEN0cmwvQ21kK1BcIlxuICB8IFwiQ3RybC9DbWQrSiwgQ3RybC9DbWQrS1wiO1xuaW50ZXJmYWNlIEtleUJpbmQge1xuICBtb2RpZmllcnM6IE1vZGlmaWVyW107XG4gIGtleTogc3RyaW5nIHwgbnVsbDtcbn1cblxuZXhwb3J0IGNsYXNzIEN5Y2xlVGhyb3VnaFN1Z2dlc3Rpb25zS2V5cyB7XG4gIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IF92YWx1ZXM6IEN5Y2xlVGhyb3VnaFN1Z2dlc3Rpb25zS2V5c1tdID0gW107XG5cbiAgc3RhdGljIHJlYWRvbmx5IE5PTkUgPSBuZXcgQ3ljbGVUaHJvdWdoU3VnZ2VzdGlvbnNLZXlzKFxuICAgIFwiTm9uZVwiLFxuICAgIHsgbW9kaWZpZXJzOiBbXSwga2V5OiBudWxsIH0sXG4gICAgeyBtb2RpZmllcnM6IFtdLCBrZXk6IG51bGwgfVxuICApO1xuICBzdGF0aWMgcmVhZG9ubHkgVEFCID0gbmV3IEN5Y2xlVGhyb3VnaFN1Z2dlc3Rpb25zS2V5cyhcbiAgICBcIlRhYiwgU2hpZnQrVGFiXCIsXG4gICAgeyBtb2RpZmllcnM6IFtdLCBrZXk6IFwiVGFiXCIgfSxcbiAgICB7IG1vZGlmaWVyczogW1wiU2hpZnRcIl0sIGtleTogXCJUYWJcIiB9XG4gICk7XG4gIHN0YXRpYyByZWFkb25seSBFTUFDUyA9IG5ldyBDeWNsZVRocm91Z2hTdWdnZXN0aW9uc0tleXMoXG4gICAgXCJDdHJsL0NtZCtOLCBDdHJsL0NtZCtQXCIsXG4gICAgeyBtb2RpZmllcnM6IFtcIk1vZFwiXSwga2V5OiBcIk5cIiB9LFxuICAgIHsgbW9kaWZpZXJzOiBbXCJNb2RcIl0sIGtleTogXCJQXCIgfVxuICApO1xuICBzdGF0aWMgcmVhZG9ubHkgVklNID0gbmV3IEN5Y2xlVGhyb3VnaFN1Z2dlc3Rpb25zS2V5cyhcbiAgICBcIkN0cmwvQ21kK0osIEN0cmwvQ21kK0tcIixcbiAgICB7IG1vZGlmaWVyczogW1wiTW9kXCJdLCBrZXk6IFwiSlwiIH0sXG4gICAgeyBtb2RpZmllcnM6IFtcIk1vZFwiXSwga2V5OiBcIktcIiB9XG4gICk7XG5cbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcihcbiAgICByZWFkb25seSBuYW1lOiBOYW1lLFxuICAgIHJlYWRvbmx5IG5leHRLZXk6IEtleUJpbmQsXG4gICAgcmVhZG9ubHkgcHJldmlvdXNLZXk6IEtleUJpbmRcbiAgKSB7XG4gICAgQ3ljbGVUaHJvdWdoU3VnZ2VzdGlvbnNLZXlzLl92YWx1ZXMucHVzaCh0aGlzKTtcbiAgfVxuXG4gIHN0YXRpYyBmcm9tTmFtZShuYW1lOiBzdHJpbmcpOiBDeWNsZVRocm91Z2hTdWdnZXN0aW9uc0tleXMge1xuICAgIHJldHVybiBDeWNsZVRocm91Z2hTdWdnZXN0aW9uc0tleXMuX3ZhbHVlcy5maW5kKCh4KSA9PiB4Lm5hbWUgPT09IG5hbWUpITtcbiAgfVxuXG4gIHN0YXRpYyB2YWx1ZXMoKTogQ3ljbGVUaHJvdWdoU3VnZ2VzdGlvbnNLZXlzW10ge1xuICAgIHJldHVybiBDeWNsZVRocm91Z2hTdWdnZXN0aW9uc0tleXMuX3ZhbHVlcztcbiAgfVxufVxuIiwidHlwZSBEZWxpbWl0ZXIgPSBcIlxcdFwiIHwgXCIsXCIgfCBcInxcIjtcblxuZXhwb3J0IGNsYXNzIENvbHVtbkRlbGltaXRlciB7XG4gIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IF92YWx1ZXM6IENvbHVtbkRlbGltaXRlcltdID0gW107XG5cbiAgc3RhdGljIHJlYWRvbmx5IFRBQiA9IG5ldyBDb2x1bW5EZWxpbWl0ZXIoXCJUYWJcIiwgXCJcXHRcIik7XG4gIHN0YXRpYyByZWFkb25seSBDT01NQSA9IG5ldyBDb2x1bW5EZWxpbWl0ZXIoXCJDb21tYVwiLCBcIixcIik7XG4gIHN0YXRpYyByZWFkb25seSBQSVBFID0gbmV3IENvbHVtbkRlbGltaXRlcihcIlBpcGVcIiwgXCJ8XCIpO1xuXG4gIHByaXZhdGUgY29uc3RydWN0b3IocmVhZG9ubHkgbmFtZTogc3RyaW5nLCByZWFkb25seSB2YWx1ZTogRGVsaW1pdGVyKSB7XG4gICAgQ29sdW1uRGVsaW1pdGVyLl92YWx1ZXMucHVzaCh0aGlzKTtcbiAgfVxuXG4gIHN0YXRpYyBmcm9tTmFtZShuYW1lOiBzdHJpbmcpOiBDb2x1bW5EZWxpbWl0ZXIge1xuICAgIHJldHVybiBDb2x1bW5EZWxpbWl0ZXIuX3ZhbHVlcy5maW5kKCh4KSA9PiB4Lm5hbWUgPT09IG5hbWUpITtcbiAgfVxuXG4gIHN0YXRpYyB2YWx1ZXMoKTogQ29sdW1uRGVsaW1pdGVyW10ge1xuICAgIHJldHVybiBDb2x1bW5EZWxpbWl0ZXIuX3ZhbHVlcztcbiAgfVxufVxuIiwiaW1wb3J0IHR5cGUgeyBNb2RpZmllciB9IGZyb20gXCJvYnNpZGlhblwiO1xuXG50eXBlIE5hbWUgPVxuICB8IFwiRW50ZXJcIlxuICB8IFwiVGFiXCJcbiAgfCBcIkN0cmwvQ21kK0VudGVyXCJcbiAgfCBcIkFsdCtFbnRlclwiXG4gIHwgXCJTaGlmdCtFbnRlclwiXG4gIHwgXCJTcGFjZVwiO1xuaW50ZXJmYWNlIEtleUJpbmQge1xuICBtb2RpZmllcnM6IE1vZGlmaWVyW107XG4gIGtleTogc3RyaW5nIHwgbnVsbDtcbn1cblxuZXhwb3J0IGNsYXNzIFNlbGVjdFN1Z2dlc3Rpb25LZXkge1xuICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBfdmFsdWVzOiBTZWxlY3RTdWdnZXN0aW9uS2V5W10gPSBbXTtcblxuICBzdGF0aWMgcmVhZG9ubHkgRU5URVIgPSBuZXcgU2VsZWN0U3VnZ2VzdGlvbktleShcIkVudGVyXCIsIHtcbiAgICBtb2RpZmllcnM6IFtdLFxuICAgIGtleTogXCJFbnRlclwiLFxuICB9KTtcbiAgc3RhdGljIHJlYWRvbmx5IFRBQiA9IG5ldyBTZWxlY3RTdWdnZXN0aW9uS2V5KFwiVGFiXCIsIHtcbiAgICBtb2RpZmllcnM6IFtdLFxuICAgIGtleTogXCJUYWJcIixcbiAgfSk7XG4gIHN0YXRpYyByZWFkb25seSBNT0RfRU5URVIgPSBuZXcgU2VsZWN0U3VnZ2VzdGlvbktleShcIkN0cmwvQ21kK0VudGVyXCIsIHtcbiAgICBtb2RpZmllcnM6IFtcIk1vZFwiXSxcbiAgICBrZXk6IFwiRW50ZXJcIixcbiAgfSk7XG4gIHN0YXRpYyByZWFkb25seSBBTFRfRU5URVIgPSBuZXcgU2VsZWN0U3VnZ2VzdGlvbktleShcIkFsdCtFbnRlclwiLCB7XG4gICAgbW9kaWZpZXJzOiBbXCJBbHRcIl0sXG4gICAga2V5OiBcIkVudGVyXCIsXG4gIH0pO1xuICBzdGF0aWMgcmVhZG9ubHkgU0hJRlRfRU5URVIgPSBuZXcgU2VsZWN0U3VnZ2VzdGlvbktleShcIlNoaWZ0K0VudGVyXCIsIHtcbiAgICBtb2RpZmllcnM6IFtcIlNoaWZ0XCJdLFxuICAgIGtleTogXCJFbnRlclwiLFxuICB9KTtcbiAgc3RhdGljIHJlYWRvbmx5IFNQQUNFID0gbmV3IFNlbGVjdFN1Z2dlc3Rpb25LZXkoXCJTcGFjZVwiLCB7XG4gICAgbW9kaWZpZXJzOiBbXSxcbiAgICBrZXk6IFwiIFwiLFxuICB9KTtcblxuICBwcml2YXRlIGNvbnN0cnVjdG9yKHJlYWRvbmx5IG5hbWU6IE5hbWUsIHJlYWRvbmx5IGtleUJpbmQ6IEtleUJpbmQpIHtcbiAgICBTZWxlY3RTdWdnZXN0aW9uS2V5Ll92YWx1ZXMucHVzaCh0aGlzKTtcbiAgfVxuXG4gIHN0YXRpYyBmcm9tTmFtZShuYW1lOiBzdHJpbmcpOiBTZWxlY3RTdWdnZXN0aW9uS2V5IHtcbiAgICByZXR1cm4gU2VsZWN0U3VnZ2VzdGlvbktleS5fdmFsdWVzLmZpbmQoKHgpID0+IHgubmFtZSA9PT0gbmFtZSkhO1xuICB9XG5cbiAgc3RhdGljIHZhbHVlcygpOiBTZWxlY3RTdWdnZXN0aW9uS2V5W10ge1xuICAgIHJldHVybiBTZWxlY3RTdWdnZXN0aW9uS2V5Ll92YWx1ZXM7XG4gIH1cbn1cbiIsImltcG9ydCB0eXBlIHsgQXBwIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgeyBncm91cEJ5IH0gZnJvbSBcIi4uL3V0aWwvY29sbGVjdGlvbi1oZWxwZXJcIjtcbmltcG9ydCB0eXBlIHsgV29yZHNCeUZpcnN0TGV0dGVyIH0gZnJvbSBcIi4vc3VnZ2VzdGVyXCI7XG5pbXBvcnQgdHlwZSB7IFRva2VuaXplciB9IGZyb20gXCIuLi90b2tlbml6ZXIvdG9rZW5pemVyXCI7XG5pbXBvcnQgdHlwZSB7IEFwcEhlbHBlciB9IGZyb20gXCIuLi9hcHAtaGVscGVyXCI7XG5pbXBvcnQgdHlwZSB7IFdvcmQgfSBmcm9tIFwiLi4vbW9kZWwvV29yZFwiO1xuaW1wb3J0IHsgZGlybmFtZSB9IGZyb20gXCIuLi91dGlsL3BhdGhcIjtcblxuZXhwb3J0IGNsYXNzIEN1cnJlbnRWYXVsdFdvcmRQcm92aWRlciB7XG4gIHdvcmRzQnlGaXJzdExldHRlcjogV29yZHNCeUZpcnN0TGV0dGVyID0ge307XG4gIHByaXZhdGUgd29yZHM6IFdvcmRbXSA9IFtdO1xuICBwcml2YXRlIHRva2VuaXplcjogVG9rZW5pemVyO1xuICBwcml2YXRlIGluY2x1ZGVQcmVmaXhQYXR0ZXJuczogc3RyaW5nW107XG4gIHByaXZhdGUgZXhjbHVkZVByZWZpeFBhdHRlcm5zOiBzdHJpbmdbXTtcbiAgcHJpdmF0ZSBvbmx5VW5kZXJDdXJyZW50RGlyZWN0b3J5OiBib29sZWFuO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgYXBwOiBBcHAsIHByaXZhdGUgYXBwSGVscGVyOiBBcHBIZWxwZXIpIHt9XG5cbiAgYXN5bmMgcmVmcmVzaFdvcmRzKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHRoaXMuY2xlYXJXb3JkcygpO1xuXG4gICAgY29uc3QgY3VycmVudERpcm5hbWUgPSB0aGlzLmFwcEhlbHBlci5nZXRDdXJyZW50RGlybmFtZSgpO1xuXG4gICAgY29uc3QgbWFya2Rvd25GaWxlUGF0aHMgPSB0aGlzLmFwcC52YXVsdFxuICAgICAgLmdldE1hcmtkb3duRmlsZXMoKVxuICAgICAgLm1hcCgoeCkgPT4geC5wYXRoKVxuICAgICAgLmZpbHRlcigocCkgPT4gdGhpcy5pbmNsdWRlUHJlZml4UGF0dGVybnMuZXZlcnkoKHgpID0+IHAuc3RhcnRzV2l0aCh4KSkpXG4gICAgICAuZmlsdGVyKChwKSA9PiB0aGlzLmV4Y2x1ZGVQcmVmaXhQYXR0ZXJucy5ldmVyeSgoeCkgPT4gIXAuc3RhcnRzV2l0aCh4KSkpXG4gICAgICAuZmlsdGVyKFxuICAgICAgICAocCkgPT4gIXRoaXMub25seVVuZGVyQ3VycmVudERpcmVjdG9yeSB8fCBkaXJuYW1lKHApID09PSBjdXJyZW50RGlybmFtZVxuICAgICAgKTtcblxuICAgIGxldCB3b3JkQnlWYWx1ZTogeyBbdmFsdWU6IHN0cmluZ106IFdvcmQgfSA9IHt9O1xuICAgIGZvciAoY29uc3QgcGF0aCBvZiBtYXJrZG93bkZpbGVQYXRocykge1xuICAgICAgY29uc3QgY29udGVudCA9IGF3YWl0IHRoaXMuYXBwLnZhdWx0LmFkYXB0ZXIucmVhZChwYXRoKTtcblxuICAgICAgZm9yIChjb25zdCB0b2tlbiBvZiB0aGlzLnRva2VuaXplci50b2tlbml6ZShjb250ZW50KSkge1xuICAgICAgICB3b3JkQnlWYWx1ZVt0b2tlbl0gPSB7XG4gICAgICAgICAgdmFsdWU6IHRva2VuLFxuICAgICAgICAgIHR5cGU6IFwiY3VycmVudFZhdWx0XCIsXG4gICAgICAgICAgY3JlYXRlZFBhdGg6IHBhdGgsXG4gICAgICAgICAgZGVzY3JpcHRpb246IHBhdGgsXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy53b3JkcyA9IE9iamVjdC52YWx1ZXMod29yZEJ5VmFsdWUpO1xuICAgIHRoaXMud29yZHNCeUZpcnN0TGV0dGVyID0gZ3JvdXBCeSh0aGlzLndvcmRzLCAoeCkgPT4geC52YWx1ZS5jaGFyQXQoMCkpO1xuICB9XG5cbiAgY2xlYXJXb3JkcygpOiB2b2lkIHtcbiAgICB0aGlzLndvcmRzID0gW107XG4gICAgdGhpcy53b3Jkc0J5Rmlyc3RMZXR0ZXIgPSB7fTtcbiAgfVxuXG4gIGdldCB3b3JkQ291bnQoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy53b3Jkcy5sZW5ndGg7XG4gIH1cblxuICBzZXRTZXR0aW5ncyhcbiAgICB0b2tlbml6ZXI6IFRva2VuaXplcixcbiAgICBpbmNsdWRlUHJlZml4UGF0dGVybnM6IHN0cmluZ1tdLFxuICAgIGV4Y2x1ZGVQcmVmaXhQYXR0ZXJuczogc3RyaW5nW10sXG4gICAgb25seVVuZGVyQ3VycmVudERpcmVjdG9yeTogYm9vbGVhblxuICApIHtcbiAgICB0aGlzLnRva2VuaXplciA9IHRva2VuaXplcjtcbiAgICB0aGlzLmluY2x1ZGVQcmVmaXhQYXR0ZXJucyA9IGluY2x1ZGVQcmVmaXhQYXR0ZXJucztcbiAgICB0aGlzLmV4Y2x1ZGVQcmVmaXhQYXR0ZXJucyA9IGV4Y2x1ZGVQcmVmaXhQYXR0ZXJucztcbiAgICB0aGlzLm9ubHlVbmRlckN1cnJlbnREaXJlY3RvcnkgPSBvbmx5VW5kZXJDdXJyZW50RGlyZWN0b3J5O1xuICB9XG59XG4iLCJpbXBvcnQgdHlwZSB7IE1vZGlmaWVyIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5cbnR5cGUgTmFtZSA9IFwiTm9uZVwiIHwgXCJDdHJsL0NtZCtFbnRlclwiIHwgXCJBbHQrRW50ZXJcIiB8IFwiU2hpZnQrRW50ZXJcIjtcbmludGVyZmFjZSBLZXlCaW5kIHtcbiAgbW9kaWZpZXJzOiBNb2RpZmllcltdO1xuICBrZXk6IHN0cmluZyB8IG51bGw7XG59XG5cbmV4cG9ydCBjbGFzcyBPcGVuU291cmNlRmlsZUtleXMge1xuICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBfdmFsdWVzOiBPcGVuU291cmNlRmlsZUtleXNbXSA9IFtdO1xuXG4gIHN0YXRpYyByZWFkb25seSBOT05FID0gbmV3IE9wZW5Tb3VyY2VGaWxlS2V5cyhcIk5vbmVcIiwge1xuICAgIG1vZGlmaWVyczogW10sXG4gICAga2V5OiBudWxsLFxuICB9KTtcbiAgc3RhdGljIHJlYWRvbmx5IE1PRF9FTlRFUiA9IG5ldyBPcGVuU291cmNlRmlsZUtleXMoXCJDdHJsL0NtZCtFbnRlclwiLCB7XG4gICAgbW9kaWZpZXJzOiBbXCJNb2RcIl0sXG4gICAga2V5OiBcIkVudGVyXCIsXG4gIH0pO1xuICBzdGF0aWMgcmVhZG9ubHkgQUxUX0VOVEVSID0gbmV3IE9wZW5Tb3VyY2VGaWxlS2V5cyhcIkFsdCtFbnRlclwiLCB7XG4gICAgbW9kaWZpZXJzOiBbXCJBbHRcIl0sXG4gICAga2V5OiBcIkVudGVyXCIsXG4gIH0pO1xuICBzdGF0aWMgcmVhZG9ubHkgU0hJRlRfRU5URVIgPSBuZXcgT3BlblNvdXJjZUZpbGVLZXlzKFwiU2hpZnQrRW50ZXJcIiwge1xuICAgIG1vZGlmaWVyczogW1wiU2hpZnRcIl0sXG4gICAga2V5OiBcIkVudGVyXCIsXG4gIH0pO1xuXG4gIHByaXZhdGUgY29uc3RydWN0b3IocmVhZG9ubHkgbmFtZTogTmFtZSwgcmVhZG9ubHkga2V5QmluZDogS2V5QmluZCkge1xuICAgIE9wZW5Tb3VyY2VGaWxlS2V5cy5fdmFsdWVzLnB1c2godGhpcyk7XG4gIH1cblxuICBzdGF0aWMgZnJvbU5hbWUobmFtZTogc3RyaW5nKTogT3BlblNvdXJjZUZpbGVLZXlzIHtcbiAgICByZXR1cm4gT3BlblNvdXJjZUZpbGVLZXlzLl92YWx1ZXMuZmluZCgoeCkgPT4geC5uYW1lID09PSBuYW1lKSE7XG4gIH1cblxuICBzdGF0aWMgdmFsdWVzKCk6IE9wZW5Tb3VyY2VGaWxlS2V5c1tdIHtcbiAgICByZXR1cm4gT3BlblNvdXJjZUZpbGVLZXlzLl92YWx1ZXM7XG4gIH1cbn1cbiIsImltcG9ydCB0eXBlIHsgV29yZCB9IGZyb20gXCIuLi9tb2RlbC9Xb3JkXCI7XG5pbXBvcnQgeyBiYXNlbmFtZSB9IGZyb20gXCIuLi91dGlsL3BhdGhcIjtcblxuZXhwb3J0IGNsYXNzIERlc2NyaXB0aW9uT25TdWdnZXN0aW9uIHtcbiAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgX3ZhbHVlczogRGVzY3JpcHRpb25PblN1Z2dlc3Rpb25bXSA9IFtdO1xuXG4gIHN0YXRpYyByZWFkb25seSBOT05FID0gbmV3IERlc2NyaXB0aW9uT25TdWdnZXN0aW9uKFwiTm9uZVwiLCAoKSA9PiBudWxsKTtcbiAgc3RhdGljIHJlYWRvbmx5IFNIT1JUID0gbmV3IERlc2NyaXB0aW9uT25TdWdnZXN0aW9uKFwiU2hvcnRcIiwgKHdvcmQpID0+IHtcbiAgICBpZiAoIXdvcmQuZGVzY3JpcHRpb24pIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gd29yZC50eXBlID09PSBcImN1c3RvbURpY3Rpb25hcnlcIlxuICAgICAgPyB3b3JkLmRlc2NyaXB0aW9uXG4gICAgICA6IGJhc2VuYW1lKHdvcmQuZGVzY3JpcHRpb24pO1xuICB9KTtcbiAgc3RhdGljIHJlYWRvbmx5IEZVTEwgPSBuZXcgRGVzY3JpcHRpb25PblN1Z2dlc3Rpb24oXG4gICAgXCJGdWxsXCIsXG4gICAgKHdvcmQpID0+IHdvcmQuZGVzY3JpcHRpb24gPz8gbnVsbFxuICApO1xuXG4gIHByaXZhdGUgY29uc3RydWN0b3IoXG4gICAgcmVhZG9ubHkgbmFtZTogc3RyaW5nLFxuICAgIHJlYWRvbmx5IHRvRGlzcGxheTogKHdvcmQ6IFdvcmQpID0+IHN0cmluZyB8IG51bGxcbiAgKSB7XG4gICAgRGVzY3JpcHRpb25PblN1Z2dlc3Rpb24uX3ZhbHVlcy5wdXNoKHRoaXMpO1xuICB9XG5cbiAgc3RhdGljIGZyb21OYW1lKG5hbWU6IHN0cmluZyk6IERlc2NyaXB0aW9uT25TdWdnZXN0aW9uIHtcbiAgICByZXR1cm4gRGVzY3JpcHRpb25PblN1Z2dlc3Rpb24uX3ZhbHVlcy5maW5kKCh4KSA9PiB4Lm5hbWUgPT09IG5hbWUpITtcbiAgfVxuXG4gIHN0YXRpYyB2YWx1ZXMoKTogRGVzY3JpcHRpb25PblN1Z2dlc3Rpb25bXSB7XG4gICAgcmV0dXJuIERlc2NyaXB0aW9uT25TdWdnZXN0aW9uLl92YWx1ZXM7XG4gIH1cbn1cbiIsImltcG9ydCB0eXBlIHsgQXBwLCBURmlsZSB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHR5cGUgeyBXb3Jkc0J5Rmlyc3RMZXR0ZXIgfSBmcm9tIFwiLi9zdWdnZXN0ZXJcIjtcbmltcG9ydCB0eXBlIHsgQXBwSGVscGVyLCBGcm9udE1hdHRlclZhbHVlIH0gZnJvbSBcIi4uL2FwcC1oZWxwZXJcIjtcbmltcG9ydCB0eXBlIHsgRnJvbnRNYXR0ZXJXb3JkIH0gZnJvbSBcIi4uL21vZGVsL1dvcmRcIjtcbmltcG9ydCB7IGV4Y2x1ZGVFbW9qaSB9IGZyb20gXCIuLi91dGlsL3N0cmluZ3NcIjtcbmltcG9ydCB7IGdyb3VwQnksIHVuaXFCeSB9IGZyb20gXCIuLi91dGlsL2NvbGxlY3Rpb24taGVscGVyXCI7XG5cbmZ1bmN0aW9uIHN5bm9ueW1BbGlhc2VzKG5hbWU6IHN0cmluZyk6IHN0cmluZ1tdIHtcbiAgY29uc3QgbGVzc0Vtb2ppVmFsdWUgPSBleGNsdWRlRW1vamkobmFtZSk7XG4gIHJldHVybiBuYW1lID09PSBsZXNzRW1vamlWYWx1ZSA/IFtdIDogW2xlc3NFbW9qaVZhbHVlXTtcbn1cblxuZnVuY3Rpb24gZnJvbnRNYXR0ZXJUb1dvcmRzKFxuICBmaWxlOiBURmlsZSxcbiAga2V5OiBzdHJpbmcsXG4gIHZhbHVlczogRnJvbnRNYXR0ZXJWYWx1ZVxuKTogRnJvbnRNYXR0ZXJXb3JkW10ge1xuICByZXR1cm4gdmFsdWVzLm1hcCgoeCkgPT4gKHtcbiAgICBrZXksXG4gICAgdmFsdWU6IHgsXG4gICAgdHlwZTogXCJmcm9udE1hdHRlclwiLFxuICAgIGNyZWF0ZWRQYXRoOiBmaWxlLnBhdGgsXG4gICAgYWxpYXNlczogc3lub255bUFsaWFzZXMoeCksXG4gIH0pKTtcbn1cblxuZnVuY3Rpb24gcGlja1dvcmRzKGZpbGU6IFRGaWxlLCBmbTogeyBba2V5OiBzdHJpbmddOiBGcm9udE1hdHRlclZhbHVlIH0pIHtcbiAgcmV0dXJuIE9iamVjdC5lbnRyaWVzKGZtKVxuICAgIC5maWx0ZXIoXG4gICAgICAoW19rZXksIHZhbHVlXSkgPT5cbiAgICAgICAgdmFsdWUgIT0gbnVsbCAmJlxuICAgICAgICAodHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiIHx8IHR5cGVvZiB2YWx1ZVswXSA9PT0gXCJzdHJpbmdcIilcbiAgICApXG4gICAgLmZsYXRNYXAoKFtrZXksIHZhbHVlXSkgPT4gZnJvbnRNYXR0ZXJUb1dvcmRzKGZpbGUsIGtleSwgdmFsdWUpKTtcbn1cblxuLy8gbm9pbnNwZWN0aW9uIEZ1bmN0aW9uV2l0aE11bHRpcGxlTG9vcHNKU1xuZnVuY3Rpb24gZXh0cmFjdEFuZFVuaXFXb3JkcyhcbiAgd29yZHNCeUNyZWF0ZWRQYXRoOiBGcm9udE1hdHRlcldvcmRQcm92aWRlcltcIndvcmRzQnlDcmVhdGVkUGF0aFwiXVxuKTogRnJvbnRNYXR0ZXJXb3JkW10ge1xuICByZXR1cm4gdW5pcUJ5KFxuICAgIE9iamVjdC52YWx1ZXMod29yZHNCeUNyZWF0ZWRQYXRoKS5mbGF0KCksXG4gICAgKHcpID0+IHcua2V5ICsgdy52YWx1ZS50b0xvd2VyQ2FzZSgpXG4gICk7XG59XG5cbmZ1bmN0aW9uIGluZGV4aW5nV29yZHMoXG4gIHdvcmRzOiBGcm9udE1hdHRlcldvcmRbXVxuKTogRnJvbnRNYXR0ZXJXb3JkUHJvdmlkZXJbXCJ3b3Jkc0J5Rmlyc3RMZXR0ZXJCeUtleVwiXSB7XG4gIGNvbnN0IHdvcmRzQnlLZXkgPSBncm91cEJ5KHdvcmRzLCAoeCkgPT4geC5rZXkpO1xuICByZXR1cm4gT2JqZWN0LmZyb21FbnRyaWVzKFxuICAgIE9iamVjdC5lbnRyaWVzKHdvcmRzQnlLZXkpLm1hcChcbiAgICAgIChba2V5LCB3b3Jkc106IFtzdHJpbmcsIEZyb250TWF0dGVyV29yZFtdXSkgPT4gW1xuICAgICAgICBrZXksXG4gICAgICAgIGdyb3VwQnkod29yZHMsICh3KSA9PiB3LnZhbHVlLmNoYXJBdCgwKSksXG4gICAgICBdXG4gICAgKVxuICApO1xufVxuXG5leHBvcnQgY2xhc3MgRnJvbnRNYXR0ZXJXb3JkUHJvdmlkZXIge1xuICBwcml2YXRlIHdvcmRzQnlDcmVhdGVkUGF0aDogeyBbcGF0aDogc3RyaW5nXTogRnJvbnRNYXR0ZXJXb3JkW10gfSA9IHt9O1xuICB3b3JkczogRnJvbnRNYXR0ZXJXb3JkW107XG4gIHdvcmRzQnlGaXJzdExldHRlckJ5S2V5OiB7IFtrZXk6IHN0cmluZ106IFdvcmRzQnlGaXJzdExldHRlciB9O1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgYXBwOiBBcHAsIHByaXZhdGUgYXBwSGVscGVyOiBBcHBIZWxwZXIpIHt9XG5cbiAgcmVmcmVzaFdvcmRzKCk6IHZvaWQge1xuICAgIHRoaXMuY2xlYXJXb3JkcygpO1xuXG4gICAgdGhpcy5hcHAudmF1bHQuZ2V0TWFya2Rvd25GaWxlcygpLmZvckVhY2goKGYpID0+IHtcbiAgICAgIGNvbnN0IGZtID0gdGhpcy5hcHBIZWxwZXIuZ2V0RnJvbnRNYXR0ZXIoZik7XG4gICAgICBpZiAoIWZtKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdGhpcy53b3Jkc0J5Q3JlYXRlZFBhdGhbZi5wYXRoXSA9IHBpY2tXb3JkcyhmLCBmbSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLndvcmRzID0gZXh0cmFjdEFuZFVuaXFXb3Jkcyh0aGlzLndvcmRzQnlDcmVhdGVkUGF0aCk7XG4gICAgdGhpcy53b3Jkc0J5Rmlyc3RMZXR0ZXJCeUtleSA9IGluZGV4aW5nV29yZHModGhpcy53b3Jkcyk7XG4gIH1cblxuICB1cGRhdGVXb3JkSW5kZXgoZmlsZTogVEZpbGUpOiB2b2lkIHtcbiAgICBjb25zdCBmbSA9IHRoaXMuYXBwSGVscGVyLmdldEZyb250TWF0dGVyKGZpbGUpO1xuICAgIGlmICghZm0pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLndvcmRzQnlDcmVhdGVkUGF0aFtmaWxlLnBhdGhdID0gcGlja1dvcmRzKGZpbGUsIGZtKTtcbiAgfVxuXG4gIHVwZGF0ZVdvcmRzKCk6IHZvaWQge1xuICAgIHRoaXMud29yZHMgPSBleHRyYWN0QW5kVW5pcVdvcmRzKHRoaXMud29yZHNCeUNyZWF0ZWRQYXRoKTtcbiAgICB0aGlzLndvcmRzQnlGaXJzdExldHRlckJ5S2V5ID0gaW5kZXhpbmdXb3Jkcyh0aGlzLndvcmRzKTtcbiAgfVxuXG4gIGNsZWFyV29yZHMoKTogdm9pZCB7XG4gICAgdGhpcy53b3Jkc0J5Q3JlYXRlZFBhdGggPSB7fTtcbiAgICB0aGlzLndvcmRzID0gW107XG4gICAgdGhpcy53b3Jkc0J5Rmlyc3RMZXR0ZXJCeUtleSA9IHt9O1xuICB9XG5cbiAgZ2V0IHdvcmRDb3VudCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLndvcmRzLmxlbmd0aDtcbiAgfVxufVxuIiwiaW1wb3J0IHR5cGUgeyBJbmRleGVkV29yZHMgfSBmcm9tIFwiLi4vdWkvQXV0b0NvbXBsZXRlU3VnZ2VzdFwiO1xuaW1wb3J0IHsgc3VnZ2VzdFdvcmRzLCBzdWdnZXN0V29yZHNCeVBhcnRpYWxNYXRjaCB9IGZyb20gXCIuL3N1Z2dlc3RlclwiO1xuaW1wb3J0IHR5cGUgeyBXb3JkIH0gZnJvbSBcIi4uL21vZGVsL1dvcmRcIjtcbmltcG9ydCB0eXBlIHsgU2VsZWN0aW9uSGlzdG9yeVN0b3JhZ2UgfSBmcm9tIFwiLi4vc3RvcmFnZS9TZWxlY3Rpb25IaXN0b3J5U3RvcmFnZVwiO1xuXG50eXBlIE5hbWUgPSBcImluaGVyaXRcIiB8IFwicHJlZml4XCIgfCBcInBhcnRpYWxcIjtcblxudHlwZSBIYW5kbGVyID0gKFxuICBpbmRleGVkV29yZHM6IEluZGV4ZWRXb3JkcyxcbiAgcXVlcnk6IHN0cmluZyxcbiAgbWF4OiBudW1iZXIsXG4gIGZyb250TWF0dGVyOiBzdHJpbmcgfCBudWxsLFxuICBzZWxlY3Rpb25IaXN0b3J5U3RvcmFnZT86IFNlbGVjdGlvbkhpc3RvcnlTdG9yYWdlXG4pID0+IFdvcmRbXTtcblxuY29uc3QgbmV2ZXJVc2VkSGFuZGxlciA9ICguLi5fYXJnczogYW55W10pID0+IFtdO1xuXG5leHBvcnQgY2xhc3MgU3BlY2lmaWNNYXRjaFN0cmF0ZWd5IHtcbiAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgX3ZhbHVlczogU3BlY2lmaWNNYXRjaFN0cmF0ZWd5W10gPSBbXTtcblxuICBzdGF0aWMgcmVhZG9ubHkgSU5IRVJJVCA9IG5ldyBTcGVjaWZpY01hdGNoU3RyYXRlZ3koXG4gICAgXCJpbmhlcml0XCIsXG4gICAgbmV2ZXJVc2VkSGFuZGxlclxuICApO1xuICBzdGF0aWMgcmVhZG9ubHkgUFJFRklYID0gbmV3IFNwZWNpZmljTWF0Y2hTdHJhdGVneShcInByZWZpeFwiLCBzdWdnZXN0V29yZHMpO1xuICBzdGF0aWMgcmVhZG9ubHkgUEFSVElBTCA9IG5ldyBTcGVjaWZpY01hdGNoU3RyYXRlZ3koXG4gICAgXCJwYXJ0aWFsXCIsXG4gICAgc3VnZ2VzdFdvcmRzQnlQYXJ0aWFsTWF0Y2hcbiAgKTtcblxuICBwcml2YXRlIGNvbnN0cnVjdG9yKHJlYWRvbmx5IG5hbWU6IE5hbWUsIHJlYWRvbmx5IGhhbmRsZXI6IEhhbmRsZXIpIHtcbiAgICBTcGVjaWZpY01hdGNoU3RyYXRlZ3kuX3ZhbHVlcy5wdXNoKHRoaXMpO1xuICB9XG5cbiAgc3RhdGljIGZyb21OYW1lKG5hbWU6IHN0cmluZyk6IFNwZWNpZmljTWF0Y2hTdHJhdGVneSB7XG4gICAgcmV0dXJuIFNwZWNpZmljTWF0Y2hTdHJhdGVneS5fdmFsdWVzLmZpbmQoKHgpID0+IHgubmFtZSA9PT0gbmFtZSkhO1xuICB9XG5cbiAgc3RhdGljIHZhbHVlcygpOiBTcGVjaWZpY01hdGNoU3RyYXRlZ3lbXSB7XG4gICAgcmV0dXJuIFNwZWNpZmljTWF0Y2hTdHJhdGVneS5fdmFsdWVzO1xuICB9XG59XG4iLCJpbXBvcnQgdHlwZSB7IFdvcmQgfSBmcm9tIFwiLi4vbW9kZWwvV29yZFwiO1xuaW1wb3J0IHR5cGUgeyBQYXJ0aWFsUmVxdWlyZWQgfSBmcm9tIFwiLi4vdHlwZXNcIjtcblxuZXhwb3J0IHR5cGUgSGl0V29yZCA9IFBhcnRpYWxSZXF1aXJlZDxXb3JkLCBcImhpdFwiPjtcbmV4cG9ydCB0eXBlIFNlbGVjdGlvbkhpc3RvcnkgPSB7XG4gIGNvdW50OiBudW1iZXI7XG4gIGxhc3RVcGRhdGVkOiBudW1iZXI7XG59O1xuXG5leHBvcnQgdHlwZSBTZWxlY3Rpb25IaXN0b3J5VHJlZSA9IHtcbiAgW2hpdDogc3RyaW5nXToge1xuICAgIFt2YWx1ZTogc3RyaW5nXToge1xuICAgICAgW3R5cGU6IHN0cmluZ106IFNlbGVjdGlvbkhpc3Rvcnk7XG4gICAgfTtcbiAgfTtcbn07XG5cbmNvbnN0IFNFQyA9IDEwMDA7XG5jb25zdCBNSU4gPSBTRUMgKiA2MDtcbmNvbnN0IEhPVVIgPSBNSU4gKiA2MDtcbmNvbnN0IERBWSA9IEhPVVIgKiAyNDtcbmNvbnN0IFdFRUsgPSBEQVkgKiA3O1xuXG5mdW5jdGlvbiBjYWxjU2NvcmUoaGlzdG9yeTogU2VsZWN0aW9uSGlzdG9yeSB8IHVuZGVmaW5lZCk6IG51bWJlciB7XG4gIGlmICghaGlzdG9yeSkge1xuICAgIHJldHVybiAwO1xuICB9XG5cbiAgY29uc3QgYmVoaW5kID0gRGF0ZS5ub3coKSAtIGhpc3RvcnkubGFzdFVwZGF0ZWQ7XG5cbiAgLy8gbm9pbnNwZWN0aW9uIElmU3RhdGVtZW50V2l0aFRvb01hbnlCcmFuY2hlc0pTXG4gIGlmIChiZWhpbmQgPCBNSU4pIHtcbiAgICByZXR1cm4gOCAqIGhpc3RvcnkuY291bnQ7XG4gIH0gZWxzZSBpZiAoYmVoaW5kIDwgSE9VUikge1xuICAgIHJldHVybiA0ICogaGlzdG9yeS5jb3VudDtcbiAgfSBlbHNlIGlmIChiZWhpbmQgPCBEQVkpIHtcbiAgICByZXR1cm4gMiAqIGhpc3RvcnkuY291bnQ7XG4gIH0gZWxzZSBpZiAoYmVoaW5kIDwgV0VFSykge1xuICAgIHJldHVybiAwLjUgKiBoaXN0b3J5LmNvdW50O1xuICB9IGVsc2Uge1xuICAgIHJldHVybiAwLjI1ICogaGlzdG9yeS5jb3VudDtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgU2VsZWN0aW9uSGlzdG9yeVN0b3JhZ2Uge1xuICBkYXRhOiBTZWxlY3Rpb25IaXN0b3J5VHJlZTtcbiAgdmVyc2lvbjogbnVtYmVyO1xuICBwZXJzaXN0ZWRWZXJzaW9uOiBudW1iZXI7XG5cbiAgY29uc3RydWN0b3IoZGF0YTogU2VsZWN0aW9uSGlzdG9yeVRyZWUgPSB7fSkge1xuICAgIHRoaXMuZGF0YSA9IGRhdGE7XG5cbiAgICBjb25zdCBub3cgPSBEYXRlLm5vdygpO1xuICAgIHRoaXMudmVyc2lvbiA9IG5vdztcbiAgICB0aGlzLnBlcnNpc3RlZFZlcnNpb24gPSBub3c7XG4gIH1cblxuICAvLyBub2luc3BlY3Rpb24gRnVuY3Rpb25XaXRoTXVsdGlwbGVMb29wc0pTXG4gIHB1cmdlKCkge1xuICAgIGZvciAoY29uc3QgaGl0IG9mIE9iamVjdC5rZXlzKHRoaXMuZGF0YSkpIHtcbiAgICAgIGZvciAoY29uc3QgdmFsdWUgb2YgT2JqZWN0LmtleXModGhpcy5kYXRhW2hpdF0pKSB7XG4gICAgICAgIGZvciAoY29uc3Qga2luZCBvZiBPYmplY3Qua2V5cyh0aGlzLmRhdGFbaGl0XVt2YWx1ZV0pKSB7XG4gICAgICAgICAgaWYgKERhdGUubm93KCkgLSB0aGlzLmRhdGFbaGl0XVt2YWx1ZV1ba2luZF0ubGFzdFVwZGF0ZWQgPiA0ICogV0VFSykge1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMuZGF0YVtoaXRdW3ZhbHVlXVtraW5kXTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoT2JqZWN0LmlzRW1wdHkodGhpcy5kYXRhW2hpdF1bdmFsdWVdKSkge1xuICAgICAgICAgIGRlbGV0ZSB0aGlzLmRhdGFbaGl0XVt2YWx1ZV07XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKE9iamVjdC5pc0VtcHR5KHRoaXMuZGF0YVtoaXRdKSkge1xuICAgICAgICBkZWxldGUgdGhpcy5kYXRhW2hpdF07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZ2V0U2VsZWN0aW9uSGlzdG9yeSh3b3JkOiBIaXRXb3JkKTogU2VsZWN0aW9uSGlzdG9yeSB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHRoaXMuZGF0YVt3b3JkLmhpdF0/Llt3b3JkLnZhbHVlXT8uW3dvcmQudHlwZV07XG4gIH1cblxuICBpbmNyZW1lbnQod29yZDogSGl0V29yZCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5kYXRhW3dvcmQuaGl0XSkge1xuICAgICAgdGhpcy5kYXRhW3dvcmQuaGl0XSA9IHt9O1xuICAgIH1cbiAgICBpZiAoIXRoaXMuZGF0YVt3b3JkLmhpdF1bd29yZC52YWx1ZV0pIHtcbiAgICAgIHRoaXMuZGF0YVt3b3JkLmhpdF1bd29yZC52YWx1ZV0gPSB7fTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5kYXRhW3dvcmQuaGl0XVt3b3JkLnZhbHVlXVt3b3JkLnR5cGVdKSB7XG4gICAgICB0aGlzLmRhdGFbd29yZC5oaXRdW3dvcmQudmFsdWVdW3dvcmQudHlwZV0gPSB7XG4gICAgICAgIGNvdW50OiB0aGlzLmRhdGFbd29yZC5oaXRdW3dvcmQudmFsdWVdW3dvcmQudHlwZV0uY291bnQgKyAxLFxuICAgICAgICBsYXN0VXBkYXRlZDogRGF0ZS5ub3coKSxcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZGF0YVt3b3JkLmhpdF1bd29yZC52YWx1ZV1bd29yZC50eXBlXSA9IHtcbiAgICAgICAgY291bnQ6IDEsXG4gICAgICAgIGxhc3RVcGRhdGVkOiBEYXRlLm5vdygpLFxuICAgICAgfTtcbiAgICB9XG5cbiAgICB0aGlzLnZlcnNpb24gPSBEYXRlLm5vdygpO1xuICB9XG5cbiAgY29tcGFyZSh3MTogSGl0V29yZCwgdzI6IEhpdFdvcmQpOiAtMSB8IDAgfCAxIHtcbiAgICBjb25zdCBzY29yZTEgPSBjYWxjU2NvcmUodGhpcy5nZXRTZWxlY3Rpb25IaXN0b3J5KHcxKSk7XG4gICAgY29uc3Qgc2NvcmUyID0gY2FsY1Njb3JlKHRoaXMuZ2V0U2VsZWN0aW9uSGlzdG9yeSh3MikpO1xuXG4gICAgaWYgKHNjb3JlMSA9PT0gc2NvcmUyKSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICByZXR1cm4gc2NvcmUxID4gc2NvcmUyID8gLTEgOiAxO1xuICB9XG5cbiAgZ2V0IHNob3VsZFBlcnNpc3QoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMudmVyc2lvbiA+IHRoaXMucGVyc2lzdGVkVmVyc2lvbjtcbiAgfVxuXG4gIHN5bmNQZXJzaXN0VmVyc2lvbigpOiB2b2lkIHtcbiAgICB0aGlzLnBlcnNpc3RlZFZlcnNpb24gPSB0aGlzLnZlcnNpb247XG4gIH1cbn1cbiIsImltcG9ydCB7XG4gIEFwcCxcbiAgZGVib3VuY2UsXG4gIHR5cGUgRGVib3VuY2VyLFxuICBFZGl0b3IsXG4gIHR5cGUgRWRpdG9yUG9zaXRpb24sXG4gIEVkaXRvclN1Z2dlc3QsXG4gIHR5cGUgRWRpdG9yU3VnZ2VzdENvbnRleHQsXG4gIHR5cGUgRWRpdG9yU3VnZ2VzdFRyaWdnZXJJbmZvLFxuICB0eXBlIEV2ZW50UmVmLFxuICB0eXBlIEtleW1hcEV2ZW50SGFuZGxlcixcbiAgTm90aWNlLFxuICBTY29wZSxcbiAgVEZpbGUsXG59IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHsgY3JlYXRlVG9rZW5pemVyLCB0eXBlIFRva2VuaXplciB9IGZyb20gXCIuLi90b2tlbml6ZXIvdG9rZW5pemVyXCI7XG5pbXBvcnQgeyBUb2tlbml6ZVN0cmF0ZWd5IH0gZnJvbSBcIi4uL3Rva2VuaXplci9Ub2tlbml6ZVN0cmF0ZWd5XCI7XG5pbXBvcnQgdHlwZSB7IFNldHRpbmdzIH0gZnJvbSBcIi4uL3NldHRpbmcvc2V0dGluZ3NcIjtcbmltcG9ydCB7IEFwcEhlbHBlciB9IGZyb20gXCIuLi9hcHAtaGVscGVyXCI7XG5pbXBvcnQgdHlwZSB7IFdvcmRzQnlGaXJzdExldHRlciB9IGZyb20gXCIuLi9wcm92aWRlci9zdWdnZXN0ZXJcIjtcbmltcG9ydCB7IEN1c3RvbURpY3Rpb25hcnlXb3JkUHJvdmlkZXIgfSBmcm9tIFwiLi4vcHJvdmlkZXIvQ3VzdG9tRGljdGlvbmFyeVdvcmRQcm92aWRlclwiO1xuaW1wb3J0IHsgQ3VycmVudEZpbGVXb3JkUHJvdmlkZXIgfSBmcm9tIFwiLi4vcHJvdmlkZXIvQ3VycmVudEZpbGVXb3JkUHJvdmlkZXJcIjtcbmltcG9ydCB7IEludGVybmFsTGlua1dvcmRQcm92aWRlciB9IGZyb20gXCIuLi9wcm92aWRlci9JbnRlcm5hbExpbmtXb3JkUHJvdmlkZXJcIjtcbmltcG9ydCB7IE1hdGNoU3RyYXRlZ3kgfSBmcm9tIFwiLi4vcHJvdmlkZXIvTWF0Y2hTdHJhdGVneVwiO1xuaW1wb3J0IHsgQ3ljbGVUaHJvdWdoU3VnZ2VzdGlvbnNLZXlzIH0gZnJvbSBcIi4uL29wdGlvbi9DeWNsZVRocm91Z2hTdWdnZXN0aW9uc0tleXNcIjtcbmltcG9ydCB7IENvbHVtbkRlbGltaXRlciB9IGZyb20gXCIuLi9vcHRpb24vQ29sdW1uRGVsaW1pdGVyXCI7XG5pbXBvcnQgeyBTZWxlY3RTdWdnZXN0aW9uS2V5IH0gZnJvbSBcIi4uL29wdGlvbi9TZWxlY3RTdWdnZXN0aW9uS2V5XCI7XG5pbXBvcnQgeyB1bmlxV2l0aCB9IGZyb20gXCIuLi91dGlsL2NvbGxlY3Rpb24taGVscGVyXCI7XG5pbXBvcnQgeyBDdXJyZW50VmF1bHRXb3JkUHJvdmlkZXIgfSBmcm9tIFwiLi4vcHJvdmlkZXIvQ3VycmVudFZhdWx0V29yZFByb3ZpZGVyXCI7XG5pbXBvcnQgdHlwZSB7IFByb3ZpZGVyU3RhdHVzQmFyIH0gZnJvbSBcIi4vUHJvdmlkZXJTdGF0dXNCYXJcIjtcbmltcG9ydCB0eXBlIHsgV29yZCB9IGZyb20gXCIuLi9tb2RlbC9Xb3JkXCI7XG5pbXBvcnQgeyBPcGVuU291cmNlRmlsZUtleXMgfSBmcm9tIFwiLi4vb3B0aW9uL09wZW5Tb3VyY2VGaWxlS2V5c1wiO1xuaW1wb3J0IHsgRGVzY3JpcHRpb25PblN1Z2dlc3Rpb24gfSBmcm9tIFwiLi4vb3B0aW9uL0Rlc2NyaXB0aW9uT25TdWdnZXN0aW9uXCI7XG5pbXBvcnQgeyBGcm9udE1hdHRlcldvcmRQcm92aWRlciB9IGZyb20gXCIuLi9wcm92aWRlci9Gcm9udE1hdHRlcldvcmRQcm92aWRlclwiO1xuaW1wb3J0IHsgU3BlY2lmaWNNYXRjaFN0cmF0ZWd5IH0gZnJvbSBcIi4uL3Byb3ZpZGVyL1NwZWNpZmljTWF0Y2hTdHJhdGVneVwiO1xuaW1wb3J0IHtcbiAgdHlwZSBIaXRXb3JkLFxuICBTZWxlY3Rpb25IaXN0b3J5U3RvcmFnZSxcbn0gZnJvbSBcIi4uL3N0b3JhZ2UvU2VsZWN0aW9uSGlzdG9yeVN0b3JhZ2VcIjtcblxuZnVuY3Rpb24gYnVpbGRMb2dNZXNzYWdlKG1lc3NhZ2U6IHN0cmluZywgbXNlYzogbnVtYmVyKSB7XG4gIHJldHVybiBgJHttZXNzYWdlfTogJHtNYXRoLnJvdW5kKG1zZWMpfVttc11gO1xufVxuXG5leHBvcnQgdHlwZSBJbmRleGVkV29yZHMgPSB7XG4gIGN1cnJlbnRGaWxlOiBXb3Jkc0J5Rmlyc3RMZXR0ZXI7XG4gIGN1cnJlbnRWYXVsdDogV29yZHNCeUZpcnN0TGV0dGVyO1xuICBjdXN0b21EaWN0aW9uYXJ5OiBXb3Jkc0J5Rmlyc3RMZXR0ZXI7XG4gIGludGVybmFsTGluazogV29yZHNCeUZpcnN0TGV0dGVyO1xuICBmcm9udE1hdHRlcjogeyBba2V5OiBzdHJpbmddOiBXb3Jkc0J5Rmlyc3RMZXR0ZXIgfTtcbn07XG5cbi8vIFRoaXMgaXMgYW4gdW5zYWZlIGNvZGUuLiEhXG5pbnRlcmZhY2UgVW5zYWZlRWRpdG9yU3VnZ2VzdEludGVyZmFjZSB7XG4gIHNjb3BlOiBTY29wZSAmIHsga2V5czogKEtleW1hcEV2ZW50SGFuZGxlciAmIHsgZnVuYzogQ2FsbGFibGVGdW5jdGlvbiB9KVtdIH07XG4gIHN1Z2dlc3Rpb25zOiB7XG4gICAgc2VsZWN0ZWRJdGVtOiBudW1iZXI7XG4gICAgdXNlU2VsZWN0ZWRJdGVtKGV2OiBQYXJ0aWFsPEtleWJvYXJkRXZlbnQ+KTogdm9pZDtcbiAgICBzZXRTZWxlY3RlZEl0ZW0oc2VsZWN0ZWQ6IG51bWJlciwgc2Nyb2xsOiBib29sZWFuKTogdm9pZDtcbiAgICB2YWx1ZXM6IFdvcmRbXTtcbiAgfTtcbiAgaXNPcGVuOiBib29sZWFuO1xufVxuXG5leHBvcnQgY2xhc3MgQXV0b0NvbXBsZXRlU3VnZ2VzdFxuICBleHRlbmRzIEVkaXRvclN1Z2dlc3Q8V29yZD5cbiAgaW1wbGVtZW50cyBVbnNhZmVFZGl0b3JTdWdnZXN0SW50ZXJmYWNlXG57XG4gIGFwcDogQXBwO1xuICBzZXR0aW5nczogU2V0dGluZ3M7XG4gIGFwcEhlbHBlcjogQXBwSGVscGVyO1xuICBzdGF0dXNCYXI6IFByb3ZpZGVyU3RhdHVzQmFyO1xuXG4gIGN1cnJlbnRGaWxlV29yZFByb3ZpZGVyOiBDdXJyZW50RmlsZVdvcmRQcm92aWRlcjtcbiAgY3VycmVudFZhdWx0V29yZFByb3ZpZGVyOiBDdXJyZW50VmF1bHRXb3JkUHJvdmlkZXI7XG4gIGN1c3RvbURpY3Rpb25hcnlXb3JkUHJvdmlkZXI6IEN1c3RvbURpY3Rpb25hcnlXb3JkUHJvdmlkZXI7XG4gIGludGVybmFsTGlua1dvcmRQcm92aWRlcjogSW50ZXJuYWxMaW5rV29yZFByb3ZpZGVyO1xuICBmcm9udE1hdHRlcldvcmRQcm92aWRlcjogRnJvbnRNYXR0ZXJXb3JkUHJvdmlkZXI7XG4gIHNlbGVjdGlvbkhpc3RvcnlTdG9yYWdlOiBTZWxlY3Rpb25IaXN0b3J5U3RvcmFnZSB8IHVuZGVmaW5lZDtcblxuICB0b2tlbml6ZXI6IFRva2VuaXplcjtcbiAgZGVib3VuY2VHZXRTdWdnZXN0aW9uczogRGVib3VuY2VyPFxuICAgIFtFZGl0b3JTdWdnZXN0Q29udGV4dCwgKHRva2VuczogV29yZFtdKSA9PiB2b2lkXVxuICA+O1xuICBkZWJvdW5jZUNsb3NlOiBEZWJvdW5jZXI8W10+O1xuXG4gIHJ1bk1hbnVhbGx5OiBib29sZWFuO1xuICBkZWNsYXJlIGlzT3BlbjogYm9vbGVhbjtcblxuICBjb250ZXh0U3RhcnRDaDogbnVtYmVyO1xuXG4gIHByZXZpb3VzQ3VycmVudExpbmUgPSBcIlwiO1xuXG4gIC8vIHVuc2FmZSEhXG4gIHNjb3BlOiBVbnNhZmVFZGl0b3JTdWdnZXN0SW50ZXJmYWNlW1wic2NvcGVcIl07XG4gIHN1Z2dlc3Rpb25zOiBVbnNhZmVFZGl0b3JTdWdnZXN0SW50ZXJmYWNlW1wic3VnZ2VzdGlvbnNcIl07XG5cbiAga2V5bWFwRXZlbnRIYW5kbGVyOiBLZXltYXBFdmVudEhhbmRsZXJbXSA9IFtdO1xuICBtb2RpZnlFdmVudFJlZjogRXZlbnRSZWY7XG4gIGFjdGl2ZUxlYWZDaGFuZ2VSZWY6IEV2ZW50UmVmO1xuICBtZXRhZGF0YUNhY2hlQ2hhbmdlUmVmOiBFdmVudFJlZjtcblxuICBwcml2YXRlIGNvbnN0cnVjdG9yKGFwcDogQXBwLCBzdGF0dXNCYXI6IFByb3ZpZGVyU3RhdHVzQmFyKSB7XG4gICAgc3VwZXIoYXBwKTtcbiAgICB0aGlzLmFwcEhlbHBlciA9IG5ldyBBcHBIZWxwZXIoYXBwKTtcbiAgICB0aGlzLnN0YXR1c0JhciA9IHN0YXR1c0JhcjtcbiAgfVxuXG4gIHRyaWdnZXJDb21wbGV0ZSgpIHtcbiAgICBjb25zdCBlZGl0b3IgPSB0aGlzLmFwcEhlbHBlci5nZXRDdXJyZW50RWRpdG9yKCk7XG4gICAgY29uc3QgYWN0aXZlRmlsZSA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk7XG4gICAgaWYgKCFlZGl0b3IgfHwgIWFjdGl2ZUZpbGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBYWFg6IFVuc2FmZVxuICAgIHRoaXMucnVuTWFudWFsbHkgPSB0cnVlO1xuICAgICh0aGlzIGFzIGFueSkudHJpZ2dlcihlZGl0b3IsIGFjdGl2ZUZpbGUsIHRydWUpO1xuICB9XG5cbiAgc3RhdGljIGFzeW5jIG5ldyhcbiAgICBhcHA6IEFwcCxcbiAgICBzZXR0aW5nczogU2V0dGluZ3MsXG4gICAgc3RhdHVzQmFyOiBQcm92aWRlclN0YXR1c0JhcixcbiAgICBvblBlcnNpc3RTZWxlY3Rpb25IaXN0b3J5OiAoKSA9PiB2b2lkXG4gICk6IFByb21pc2U8QXV0b0NvbXBsZXRlU3VnZ2VzdD4ge1xuICAgIGNvbnN0IGlucyA9IG5ldyBBdXRvQ29tcGxldGVTdWdnZXN0KGFwcCwgc3RhdHVzQmFyKTtcblxuICAgIGlucy5jdXJyZW50RmlsZVdvcmRQcm92aWRlciA9IG5ldyBDdXJyZW50RmlsZVdvcmRQcm92aWRlcihcbiAgICAgIGlucy5hcHAsXG4gICAgICBpbnMuYXBwSGVscGVyXG4gICAgKTtcbiAgICBpbnMuY3VycmVudFZhdWx0V29yZFByb3ZpZGVyID0gbmV3IEN1cnJlbnRWYXVsdFdvcmRQcm92aWRlcihcbiAgICAgIGlucy5hcHAsXG4gICAgICBpbnMuYXBwSGVscGVyXG4gICAgKTtcbiAgICBpbnMuY3VzdG9tRGljdGlvbmFyeVdvcmRQcm92aWRlciA9IG5ldyBDdXN0b21EaWN0aW9uYXJ5V29yZFByb3ZpZGVyKFxuICAgICAgaW5zLmFwcCxcbiAgICAgIGlucy5hcHBIZWxwZXJcbiAgICApO1xuICAgIGlucy5pbnRlcm5hbExpbmtXb3JkUHJvdmlkZXIgPSBuZXcgSW50ZXJuYWxMaW5rV29yZFByb3ZpZGVyKFxuICAgICAgaW5zLmFwcCxcbiAgICAgIGlucy5hcHBIZWxwZXJcbiAgICApO1xuICAgIGlucy5mcm9udE1hdHRlcldvcmRQcm92aWRlciA9IG5ldyBGcm9udE1hdHRlcldvcmRQcm92aWRlcihcbiAgICAgIGlucy5hcHAsXG4gICAgICBpbnMuYXBwSGVscGVyXG4gICAgKTtcblxuICAgIGlucy5zZWxlY3Rpb25IaXN0b3J5U3RvcmFnZSA9IG5ldyBTZWxlY3Rpb25IaXN0b3J5U3RvcmFnZShcbiAgICAgIHNldHRpbmdzLnNlbGVjdGlvbkhpc3RvcnlUcmVlXG4gICAgKTtcbiAgICBpbnMuc2VsZWN0aW9uSGlzdG9yeVN0b3JhZ2UucHVyZ2UoKTtcblxuICAgIGF3YWl0IGlucy51cGRhdGVTZXR0aW5ncyhzZXR0aW5ncyk7XG5cbiAgICBpbnMubW9kaWZ5RXZlbnRSZWYgPSBhcHAudmF1bHQub24oXCJtb2RpZnlcIiwgYXN5bmMgKF8pID0+IHtcbiAgICAgIGF3YWl0IGlucy5yZWZyZXNoQ3VycmVudEZpbGVUb2tlbnMoKTtcbiAgICAgIGlmIChpbnMuc2VsZWN0aW9uSGlzdG9yeVN0b3JhZ2U/LnNob3VsZFBlcnNpc3QpIHtcbiAgICAgICAgaW5zLnNldHRpbmdzLnNlbGVjdGlvbkhpc3RvcnlUcmVlID0gaW5zLnNlbGVjdGlvbkhpc3RvcnlTdG9yYWdlLmRhdGE7XG4gICAgICAgIGlucy5zZWxlY3Rpb25IaXN0b3J5U3RvcmFnZS5zeW5jUGVyc2lzdFZlcnNpb24oKTtcbiAgICAgICAgb25QZXJzaXN0U2VsZWN0aW9uSGlzdG9yeSgpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGlucy5hY3RpdmVMZWFmQ2hhbmdlUmVmID0gYXBwLndvcmtzcGFjZS5vbihcbiAgICAgIFwiYWN0aXZlLWxlYWYtY2hhbmdlXCIsXG4gICAgICBhc3luYyAoXykgPT4ge1xuICAgICAgICBhd2FpdCBpbnMucmVmcmVzaEN1cnJlbnRGaWxlVG9rZW5zKCk7XG4gICAgICAgIGlucy5yZWZyZXNoSW50ZXJuYWxMaW5rVG9rZW5zKCk7XG4gICAgICAgIGlucy51cGRhdGVGcm9udE1hdHRlclRva2VuKCk7XG4gICAgICB9XG4gICAgKTtcblxuICAgIGlucy5tZXRhZGF0YUNhY2hlQ2hhbmdlUmVmID0gYXBwLm1ldGFkYXRhQ2FjaGUub24oXCJjaGFuZ2VkXCIsIChmKSA9PiB7XG4gICAgICBpbnMudXBkYXRlRnJvbnRNYXR0ZXJUb2tlbkluZGV4KGYpO1xuICAgICAgaWYgKCFpbnMuYXBwSGVscGVyLmlzQWN0aXZlRmlsZShmKSkge1xuICAgICAgICBpbnMudXBkYXRlRnJvbnRNYXR0ZXJUb2tlbigpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gQXZvaWQgcmVmZXJyaW5nIHRvIGluY29ycmVjdCBjYWNoZVxuICAgIGNvbnN0IGNhY2hlUmVzb2x2ZWRSZWYgPSBhcHAubWV0YWRhdGFDYWNoZS5vbihcInJlc29sdmVkXCIsIGFzeW5jICgpID0+IHtcbiAgICAgIGlucy5yZWZyZXNoSW50ZXJuYWxMaW5rVG9rZW5zKCk7XG4gICAgICBpbnMucmVmcmVzaEZyb250TWF0dGVyVG9rZW5zKCk7XG4gICAgICAvLyBub2luc3BlY3Rpb24gRVM2TWlzc2luZ0F3YWl0XG4gICAgICBpbnMucmVmcmVzaEN1c3RvbURpY3Rpb25hcnlUb2tlbnMoKTtcbiAgICAgIC8vIG5vaW5zcGVjdGlvbiBFUzZNaXNzaW5nQXdhaXRcbiAgICAgIGlucy5yZWZyZXNoQ3VycmVudFZhdWx0VG9rZW5zKCk7XG5cbiAgICAgIGlucy5hcHAubWV0YWRhdGFDYWNoZS5vZmZyZWYoY2FjaGVSZXNvbHZlZFJlZik7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gaW5zO1xuICB9XG5cbiAgcHJlZGljdGFibGVDb21wbGV0ZSgpIHtcbiAgICBjb25zdCBlZGl0b3IgPSB0aGlzLmFwcEhlbHBlci5nZXRDdXJyZW50RWRpdG9yKCk7XG4gICAgaWYgKCFlZGl0b3IpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBjdXJzb3IgPSBlZGl0b3IuZ2V0Q3Vyc29yKCk7XG4gICAgY29uc3QgY3VycmVudFRva2VuID0gdGhpcy50b2tlbml6ZXJcbiAgICAgIC50b2tlbml6ZShlZGl0b3IuZ2V0TGluZShjdXJzb3IubGluZSkuc2xpY2UoMCwgY3Vyc29yLmNoKSlcbiAgICAgIC5sYXN0KCk7XG4gICAgaWYgKCFjdXJyZW50VG9rZW4pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgc3VnZ2VzdGlvbiA9IHRoaXMudG9rZW5pemVyXG4gICAgICAudG9rZW5pemUoXG4gICAgICAgIGVkaXRvci5nZXRSYW5nZSh7IGxpbmU6IE1hdGgubWF4KGN1cnNvci5saW5lIC0gNTAsIDApLCBjaDogMCB9LCBjdXJzb3IpXG4gICAgICApXG4gICAgICAucmV2ZXJzZSgpXG4gICAgICAuc2xpY2UoMSlcbiAgICAgIC5maW5kKCh4KSA9PiB4LnN0YXJ0c1dpdGgoY3VycmVudFRva2VuKSk7XG4gICAgaWYgKCFzdWdnZXN0aW9uKSB7XG4gICAgICBzdWdnZXN0aW9uID0gdGhpcy50b2tlbml6ZXJcbiAgICAgICAgLnRva2VuaXplKFxuICAgICAgICAgIGVkaXRvci5nZXRSYW5nZShjdXJzb3IsIHtcbiAgICAgICAgICAgIGxpbmU6IE1hdGgubWluKGN1cnNvci5saW5lICsgNTAsIGVkaXRvci5saW5lQ291bnQoKSAtIDEpLFxuICAgICAgICAgICAgY2g6IDAsXG4gICAgICAgICAgfSlcbiAgICAgICAgKVxuICAgICAgICAuZmluZCgoeCkgPT4geC5zdGFydHNXaXRoKGN1cnJlbnRUb2tlbikpO1xuICAgIH1cbiAgICBpZiAoIXN1Z2dlc3Rpb24pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBlZGl0b3IucmVwbGFjZVJhbmdlKFxuICAgICAgc3VnZ2VzdGlvbixcbiAgICAgIHsgbGluZTogY3Vyc29yLmxpbmUsIGNoOiBjdXJzb3IuY2ggLSBjdXJyZW50VG9rZW4ubGVuZ3RoIH0sXG4gICAgICB7IGxpbmU6IGN1cnNvci5saW5lLCBjaDogY3Vyc29yLmNoIH1cbiAgICApO1xuXG4gICAgdGhpcy5jbG9zZSgpO1xuICAgIHRoaXMuZGVib3VuY2VDbG9zZSgpO1xuICB9XG5cbiAgdW5yZWdpc3RlcigpIHtcbiAgICB0aGlzLmFwcC52YXVsdC5vZmZyZWYodGhpcy5tb2RpZnlFdmVudFJlZik7XG4gICAgdGhpcy5hcHAud29ya3NwYWNlLm9mZnJlZih0aGlzLmFjdGl2ZUxlYWZDaGFuZ2VSZWYpO1xuICAgIHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUub2ZmcmVmKHRoaXMubWV0YWRhdGFDYWNoZUNoYW5nZVJlZik7XG4gIH1cblxuICAvLyBzZXR0aW5ncyBnZXR0ZXJzXG4gIGdldCB0b2tlbml6ZXJTdHJhdGVneSgpOiBUb2tlbml6ZVN0cmF0ZWd5IHtcbiAgICByZXR1cm4gVG9rZW5pemVTdHJhdGVneS5mcm9tTmFtZSh0aGlzLnNldHRpbmdzLnN0cmF0ZWd5KTtcbiAgfVxuXG4gIGdldCBtYXRjaFN0cmF0ZWd5KCk6IE1hdGNoU3RyYXRlZ3kge1xuICAgIHJldHVybiBNYXRjaFN0cmF0ZWd5LmZyb21OYW1lKHRoaXMuc2V0dGluZ3MubWF0Y2hTdHJhdGVneSk7XG4gIH1cblxuICBnZXQgZnJvbnRNYXR0ZXJDb21wbGVtZW50U3RyYXRlZ3koKTogU3BlY2lmaWNNYXRjaFN0cmF0ZWd5IHtcbiAgICByZXR1cm4gU3BlY2lmaWNNYXRjaFN0cmF0ZWd5LmZyb21OYW1lKFxuICAgICAgdGhpcy5zZXR0aW5ncy5mcm9udE1hdHRlckNvbXBsZW1lbnRNYXRjaFN0cmF0ZWd5XG4gICAgKTtcbiAgfVxuXG4gIGdldCBtaW5OdW1iZXJUcmlnZ2VyZWQoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gKFxuICAgICAgdGhpcy5zZXR0aW5ncy5taW5OdW1iZXJPZkNoYXJhY3RlcnNUcmlnZ2VyZWQgfHxcbiAgICAgIHRoaXMudG9rZW5pemVyU3RyYXRlZ3kudHJpZ2dlclRocmVzaG9sZFxuICAgICk7XG4gIH1cblxuICBnZXQgZGVzY3JpcHRpb25PblN1Z2dlc3Rpb24oKTogRGVzY3JpcHRpb25PblN1Z2dlc3Rpb24ge1xuICAgIHJldHVybiBEZXNjcmlwdGlvbk9uU3VnZ2VzdGlvbi5mcm9tTmFtZShcbiAgICAgIHRoaXMuc2V0dGluZ3MuZGVzY3JpcHRpb25PblN1Z2dlc3Rpb25cbiAgICApO1xuICB9XG5cbiAgZ2V0IGV4Y2x1ZGVJbnRlcm5hbExpbmtQcmVmaXhQYXRoUGF0dGVybnMoKTogc3RyaW5nW10ge1xuICAgIHJldHVybiB0aGlzLnNldHRpbmdzLmV4Y2x1ZGVJbnRlcm5hbExpbmtQYXRoUHJlZml4UGF0dGVybnNcbiAgICAgIC5zcGxpdChcIlxcblwiKVxuICAgICAgLmZpbHRlcigoeCkgPT4geCk7XG4gIH1cblxuICAvLyAtLS0gZW5kIC0tLVxuXG4gIGdldCBpbmRleGVkV29yZHMoKTogSW5kZXhlZFdvcmRzIHtcbiAgICByZXR1cm4ge1xuICAgICAgY3VycmVudEZpbGU6IHRoaXMuY3VycmVudEZpbGVXb3JkUHJvdmlkZXIud29yZHNCeUZpcnN0TGV0dGVyLFxuICAgICAgY3VycmVudFZhdWx0OiB0aGlzLmN1cnJlbnRWYXVsdFdvcmRQcm92aWRlci53b3Jkc0J5Rmlyc3RMZXR0ZXIsXG4gICAgICBjdXN0b21EaWN0aW9uYXJ5OiB0aGlzLmN1c3RvbURpY3Rpb25hcnlXb3JkUHJvdmlkZXIud29yZHNCeUZpcnN0TGV0dGVyLFxuICAgICAgaW50ZXJuYWxMaW5rOiB0aGlzLmludGVybmFsTGlua1dvcmRQcm92aWRlci53b3Jkc0J5Rmlyc3RMZXR0ZXIsXG4gICAgICBmcm9udE1hdHRlcjogdGhpcy5mcm9udE1hdHRlcldvcmRQcm92aWRlci53b3Jkc0J5Rmlyc3RMZXR0ZXJCeUtleSxcbiAgICB9O1xuICB9XG5cbiAgYXN5bmMgdXBkYXRlU2V0dGluZ3Moc2V0dGluZ3M6IFNldHRpbmdzKSB7XG4gICAgdGhpcy5zZXR0aW5ncyA9IHNldHRpbmdzO1xuXG4gICAgdGhpcy5zdGF0dXNCYXIuc2V0TWF0Y2hTdHJhdGVneSh0aGlzLm1hdGNoU3RyYXRlZ3kpO1xuXG4gICAgdGhpcy50b2tlbml6ZXIgPSBjcmVhdGVUb2tlbml6ZXIodGhpcy50b2tlbml6ZXJTdHJhdGVneSk7XG4gICAgdGhpcy5jdXJyZW50RmlsZVdvcmRQcm92aWRlci5zZXRTZXR0aW5ncyh0aGlzLnRva2VuaXplcik7XG4gICAgdGhpcy5jdXJyZW50VmF1bHRXb3JkUHJvdmlkZXIuc2V0U2V0dGluZ3MoXG4gICAgICB0aGlzLnRva2VuaXplcixcbiAgICAgIHNldHRpbmdzLmluY2x1ZGVDdXJyZW50VmF1bHRQYXRoUHJlZml4UGF0dGVybnNcbiAgICAgICAgLnNwbGl0KFwiXFxuXCIpXG4gICAgICAgIC5maWx0ZXIoKHgpID0+IHgpLFxuICAgICAgc2V0dGluZ3MuZXhjbHVkZUN1cnJlbnRWYXVsdFBhdGhQcmVmaXhQYXR0ZXJuc1xuICAgICAgICAuc3BsaXQoXCJcXG5cIilcbiAgICAgICAgLmZpbHRlcigoeCkgPT4geCksXG4gICAgICBzZXR0aW5ncy5pbmNsdWRlQ3VycmVudFZhdWx0T25seUZpbGVzVW5kZXJDdXJyZW50RGlyZWN0b3J5XG4gICAgKTtcbiAgICB0aGlzLmN1c3RvbURpY3Rpb25hcnlXb3JkUHJvdmlkZXIuc2V0U2V0dGluZ3MoXG4gICAgICBzZXR0aW5ncy5jdXN0b21EaWN0aW9uYXJ5UGF0aHMuc3BsaXQoXCJcXG5cIikuZmlsdGVyKCh4KSA9PiB4KSxcbiAgICAgIENvbHVtbkRlbGltaXRlci5mcm9tTmFtZShzZXR0aW5ncy5jb2x1bW5EZWxpbWl0ZXIpLFxuICAgICAgc2V0dGluZ3MuZGVsaW1pdGVyVG9EaXZpZGVTdWdnZXN0aW9uc0ZvckRpc3BsYXlGcm9tSW5zZXJ0aW9uIHx8IG51bGxcbiAgICApO1xuXG4gICAgdGhpcy5kZWJvdW5jZUdldFN1Z2dlc3Rpb25zID0gZGVib3VuY2UoXG4gICAgICAoY29udGV4dDogRWRpdG9yU3VnZ2VzdENvbnRleHQsIGNiOiAod29yZHM6IFdvcmRbXSkgPT4gdm9pZCkgPT4ge1xuICAgICAgICBjb25zdCBzdGFydCA9IHBlcmZvcm1hbmNlLm5vdygpO1xuXG4gICAgICAgIHRoaXMuc2hvd0RlYnVnTG9nKCgpID0+IGBbY29udGV4dC5xdWVyeV06ICR7Y29udGV4dC5xdWVyeX1gKTtcbiAgICAgICAgY29uc3QgcGFyc2VkUXVlcnkgPSBKU09OLnBhcnNlKGNvbnRleHQucXVlcnkpIGFzIHtcbiAgICAgICAgICBjdXJyZW50RnJvbnRNYXR0ZXI6IHN0cmluZyB8IG51bGw7XG4gICAgICAgICAgcXVlcmllczoge1xuICAgICAgICAgICAgd29yZDogc3RyaW5nO1xuICAgICAgICAgICAgb2Zmc2V0OiBudW1iZXI7XG4gICAgICAgICAgfVtdO1xuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IHdvcmRzID0gcGFyc2VkUXVlcnkucXVlcmllc1xuICAgICAgICAgIC5maWx0ZXIoXG4gICAgICAgICAgICAoeCwgaSwgeHMpID0+XG4gICAgICAgICAgICAgIHBhcnNlZFF1ZXJ5LmN1cnJlbnRGcm9udE1hdHRlciB8fFxuICAgICAgICAgICAgICAodGhpcy5zZXR0aW5ncy5taW5OdW1iZXJPZldvcmRzVHJpZ2dlcmVkUGhyYXNlICsgaSAtIDEgPFxuICAgICAgICAgICAgICAgIHhzLmxlbmd0aCAmJlxuICAgICAgICAgICAgICAgIHgud29yZC5sZW5ndGggPj0gdGhpcy5taW5OdW1iZXJUcmlnZ2VyZWQgJiZcbiAgICAgICAgICAgICAgICAhdGhpcy50b2tlbml6ZXIuc2hvdWxkSWdub3JlKHgud29yZCkgJiZcbiAgICAgICAgICAgICAgICAheC53b3JkLmVuZHNXaXRoKFwiIFwiKSlcbiAgICAgICAgICApXG4gICAgICAgICAgLm1hcCgocSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaGFuZGxlciA9XG4gICAgICAgICAgICAgIHBhcnNlZFF1ZXJ5LmN1cnJlbnRGcm9udE1hdHRlciAmJlxuICAgICAgICAgICAgICB0aGlzLmZyb250TWF0dGVyQ29tcGxlbWVudFN0cmF0ZWd5ICE9PVxuICAgICAgICAgICAgICAgIFNwZWNpZmljTWF0Y2hTdHJhdGVneS5JTkhFUklUXG4gICAgICAgICAgICAgICAgPyB0aGlzLmZyb250TWF0dGVyQ29tcGxlbWVudFN0cmF0ZWd5LmhhbmRsZXJcbiAgICAgICAgICAgICAgICA6IHRoaXMubWF0Y2hTdHJhdGVneS5oYW5kbGVyO1xuICAgICAgICAgICAgcmV0dXJuIGhhbmRsZXIoXG4gICAgICAgICAgICAgIHRoaXMuaW5kZXhlZFdvcmRzLFxuICAgICAgICAgICAgICBxLndvcmQsXG4gICAgICAgICAgICAgIHRoaXMuc2V0dGluZ3MubWF4TnVtYmVyT2ZTdWdnZXN0aW9ucyxcbiAgICAgICAgICAgICAgcGFyc2VkUXVlcnkuY3VycmVudEZyb250TWF0dGVyLFxuICAgICAgICAgICAgICB0aGlzLnNlbGVjdGlvbkhpc3RvcnlTdG9yYWdlXG4gICAgICAgICAgICApLm1hcCgod29yZCkgPT4gKHsgLi4ud29yZCwgb2Zmc2V0OiBxLm9mZnNldCB9KSk7XG4gICAgICAgICAgfSlcbiAgICAgICAgICAuZmxhdCgpO1xuXG4gICAgICAgIGNiKFxuICAgICAgICAgIHVuaXFXaXRoKFxuICAgICAgICAgICAgd29yZHMsXG4gICAgICAgICAgICAoYSwgYikgPT4gYS52YWx1ZSA9PT0gYi52YWx1ZSAmJiBhLnR5cGUgPT09IGIudHlwZVxuICAgICAgICAgICkuc2xpY2UoMCwgdGhpcy5zZXR0aW5ncy5tYXhOdW1iZXJPZlN1Z2dlc3Rpb25zKVxuICAgICAgICApO1xuXG4gICAgICAgIHRoaXMuc2hvd0RlYnVnTG9nKCgpID0+XG4gICAgICAgICAgYnVpbGRMb2dNZXNzYWdlKFwiR2V0IHN1Z2dlc3Rpb25zXCIsIHBlcmZvcm1hbmNlLm5vdygpIC0gc3RhcnQpXG4gICAgICAgICk7XG4gICAgICB9LFxuICAgICAgdGhpcy5zZXR0aW5ncy5kZWxheU1pbGxpU2Vjb25kcyxcbiAgICAgIHRydWVcbiAgICApO1xuXG4gICAgdGhpcy5kZWJvdW5jZUNsb3NlID0gZGVib3VuY2UoKCkgPT4ge1xuICAgICAgdGhpcy5jbG9zZSgpO1xuICAgIH0sIHRoaXMuc2V0dGluZ3MuZGVsYXlNaWxsaVNlY29uZHMgKyA1MCk7XG5cbiAgICB0aGlzLnJlZ2lzdGVyS2V5bWFwcygpO1xuICB9XG5cbiAgcHJpdmF0ZSByZWdpc3RlcktleW1hcHMoKSB7XG4gICAgLy8gQ2xlYXJcbiAgICB0aGlzLmtleW1hcEV2ZW50SGFuZGxlci5mb3JFYWNoKCh4KSA9PiB0aGlzLnNjb3BlLnVucmVnaXN0ZXIoeCkpO1xuICAgIHRoaXMua2V5bWFwRXZlbnRIYW5kbGVyID0gW107XG5cbiAgICB0aGlzLnNjb3BlLnVucmVnaXN0ZXIodGhpcy5zY29wZS5rZXlzLmZpbmQoKHgpID0+IHgua2V5ID09PSBcIkVudGVyXCIpISk7XG4gICAgY29uc3Qgc2VsZWN0U3VnZ2VzdGlvbktleSA9IFNlbGVjdFN1Z2dlc3Rpb25LZXkuZnJvbU5hbWUoXG4gICAgICB0aGlzLnNldHRpbmdzLnNlbGVjdFN1Z2dlc3Rpb25LZXlzXG4gICAgKTtcbiAgICBpZiAoc2VsZWN0U3VnZ2VzdGlvbktleSAhPT0gU2VsZWN0U3VnZ2VzdGlvbktleS5FTlRFUikge1xuICAgICAgdGhpcy5rZXltYXBFdmVudEhhbmRsZXIucHVzaChcbiAgICAgICAgdGhpcy5zY29wZS5yZWdpc3RlcihcbiAgICAgICAgICBTZWxlY3RTdWdnZXN0aW9uS2V5LkVOVEVSLmtleUJpbmQubW9kaWZpZXJzLFxuICAgICAgICAgIFNlbGVjdFN1Z2dlc3Rpb25LZXkuRU5URVIua2V5QmluZC5rZXksXG4gICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICApXG4gICAgICApO1xuICAgIH1cbiAgICBpZiAoc2VsZWN0U3VnZ2VzdGlvbktleSAhPT0gU2VsZWN0U3VnZ2VzdGlvbktleS5UQUIpIHtcbiAgICAgIHRoaXMua2V5bWFwRXZlbnRIYW5kbGVyLnB1c2goXG4gICAgICAgIHRoaXMuc2NvcGUucmVnaXN0ZXIoXG4gICAgICAgICAgU2VsZWN0U3VnZ2VzdGlvbktleS5UQUIua2V5QmluZC5tb2RpZmllcnMsXG4gICAgICAgICAgU2VsZWN0U3VnZ2VzdGlvbktleS5UQUIua2V5QmluZC5rZXksXG4gICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICApXG4gICAgICApO1xuICAgIH1cbiAgICB0aGlzLmtleW1hcEV2ZW50SGFuZGxlci5wdXNoKFxuICAgICAgdGhpcy5zY29wZS5yZWdpc3RlcihcbiAgICAgICAgc2VsZWN0U3VnZ2VzdGlvbktleS5rZXlCaW5kLm1vZGlmaWVycyxcbiAgICAgICAgc2VsZWN0U3VnZ2VzdGlvbktleS5rZXlCaW5kLmtleSxcbiAgICAgICAgKCkgPT4ge1xuICAgICAgICAgIHRoaXMuc3VnZ2VzdGlvbnMudXNlU2VsZWN0ZWRJdGVtKHt9KTtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIClcbiAgICApO1xuXG4gICAgdGhpcy5zY29wZS5rZXlzLmZpbmQoKHgpID0+IHgua2V5ID09PSBcIkVzY2FwZVwiKSEuZnVuYyA9ICgpID0+IHtcbiAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgIHJldHVybiB0aGlzLnNldHRpbmdzLnByb3BhZ2F0ZUVzYztcbiAgICB9O1xuXG4gICAgY29uc3QgY3ljbGVUaHJvdWdoU3VnZ2VzdGlvbnNLZXlzID0gQ3ljbGVUaHJvdWdoU3VnZ2VzdGlvbnNLZXlzLmZyb21OYW1lKFxuICAgICAgdGhpcy5zZXR0aW5ncy5hZGRpdGlvbmFsQ3ljbGVUaHJvdWdoU3VnZ2VzdGlvbnNLZXlzXG4gICAgKTtcbiAgICBpZiAoY3ljbGVUaHJvdWdoU3VnZ2VzdGlvbnNLZXlzICE9PSBDeWNsZVRocm91Z2hTdWdnZXN0aW9uc0tleXMuTk9ORSkge1xuICAgICAgaWYgKGN5Y2xlVGhyb3VnaFN1Z2dlc3Rpb25zS2V5cyA9PT0gQ3ljbGVUaHJvdWdoU3VnZ2VzdGlvbnNLZXlzLlRBQikge1xuICAgICAgICB0aGlzLnNjb3BlLnVucmVnaXN0ZXIoXG4gICAgICAgICAgdGhpcy5zY29wZS5rZXlzLmZpbmQoKHgpID0+IHgubW9kaWZpZXJzID09PSBcIlwiICYmIHgua2V5ID09PSBcIlRhYlwiKSFcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIHRoaXMua2V5bWFwRXZlbnRIYW5kbGVyLnB1c2goXG4gICAgICAgIHRoaXMuc2NvcGUucmVnaXN0ZXIoXG4gICAgICAgICAgY3ljbGVUaHJvdWdoU3VnZ2VzdGlvbnNLZXlzLm5leHRLZXkubW9kaWZpZXJzLFxuICAgICAgICAgIGN5Y2xlVGhyb3VnaFN1Z2dlc3Rpb25zS2V5cy5uZXh0S2V5LmtleSxcbiAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnN1Z2dlc3Rpb25zLnNldFNlbGVjdGVkSXRlbShcbiAgICAgICAgICAgICAgdGhpcy5zdWdnZXN0aW9ucy5zZWxlY3RlZEl0ZW0gKyAxLFxuICAgICAgICAgICAgICB0cnVlXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgKSxcbiAgICAgICAgdGhpcy5zY29wZS5yZWdpc3RlcihcbiAgICAgICAgICBjeWNsZVRocm91Z2hTdWdnZXN0aW9uc0tleXMucHJldmlvdXNLZXkubW9kaWZpZXJzLFxuICAgICAgICAgIGN5Y2xlVGhyb3VnaFN1Z2dlc3Rpb25zS2V5cy5wcmV2aW91c0tleS5rZXksXG4gICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zdWdnZXN0aW9ucy5zZXRTZWxlY3RlZEl0ZW0oXG4gICAgICAgICAgICAgIHRoaXMuc3VnZ2VzdGlvbnMuc2VsZWN0ZWRJdGVtIC0gMSxcbiAgICAgICAgICAgICAgdHJ1ZVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIClcbiAgICAgICk7XG4gICAgfVxuXG4gICAgY29uc3Qgb3BlblNvdXJjZUZpbGVLZXkgPSBPcGVuU291cmNlRmlsZUtleXMuZnJvbU5hbWUoXG4gICAgICB0aGlzLnNldHRpbmdzLm9wZW5Tb3VyY2VGaWxlS2V5XG4gICAgKTtcbiAgICBpZiAob3BlblNvdXJjZUZpbGVLZXkgIT09IE9wZW5Tb3VyY2VGaWxlS2V5cy5OT05FKSB7XG4gICAgICB0aGlzLmtleW1hcEV2ZW50SGFuZGxlci5wdXNoKFxuICAgICAgICB0aGlzLnNjb3BlLnJlZ2lzdGVyKFxuICAgICAgICAgIG9wZW5Tb3VyY2VGaWxlS2V5LmtleUJpbmQubW9kaWZpZXJzLFxuICAgICAgICAgIG9wZW5Tb3VyY2VGaWxlS2V5LmtleUJpbmQua2V5LFxuICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSB0aGlzLnN1Z2dlc3Rpb25zLnZhbHVlc1t0aGlzLnN1Z2dlc3Rpb25zLnNlbGVjdGVkSXRlbV07XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgIGl0ZW0udHlwZSAhPT0gXCJjdXJyZW50VmF1bHRcIiAmJlxuICAgICAgICAgICAgICBpdGVtLnR5cGUgIT09IFwiaW50ZXJuYWxMaW5rXCIgJiZcbiAgICAgICAgICAgICAgaXRlbS50eXBlICE9PSBcImZyb250TWF0dGVyXCJcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IG1hcmtkb3duRmlsZSA9IHRoaXMuYXBwSGVscGVyLmdldE1hcmtkb3duRmlsZUJ5UGF0aChcbiAgICAgICAgICAgICAgaXRlbS5jcmVhdGVkUGF0aFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmICghbWFya2Rvd25GaWxlKSB7XG4gICAgICAgICAgICAgIC8vIG5vaW5zcGVjdGlvbiBPYmplY3RBbGxvY2F0aW9uSWdub3JlZFxuICAgICAgICAgICAgICBuZXcgTm90aWNlKGBDYW4ndCBvcGVuICR7aXRlbS5jcmVhdGVkUGF0aH1gKTtcbiAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5hcHBIZWxwZXIub3Blbk1hcmtkb3duRmlsZShtYXJrZG93bkZpbGUsIHRydWUpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgKVxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyByZWZyZXNoQ3VycmVudEZpbGVUb2tlbnMoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3Qgc3RhcnQgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICB0aGlzLnN0YXR1c0Jhci5zZXRDdXJyZW50RmlsZUluZGV4aW5nKCk7XG5cbiAgICBpZiAoIXRoaXMuc2V0dGluZ3MuZW5hYmxlQ3VycmVudEZpbGVDb21wbGVtZW50KSB7XG4gICAgICB0aGlzLnN0YXR1c0Jhci5zZXRDdXJyZW50RmlsZURpc2FibGVkKCk7XG4gICAgICB0aGlzLmN1cnJlbnRGaWxlV29yZFByb3ZpZGVyLmNsZWFyV29yZHMoKTtcbiAgICAgIHRoaXMuc2hvd0RlYnVnTG9nKCgpID0+XG4gICAgICAgIGJ1aWxkTG9nTWVzc2FnZShcbiAgICAgICAgICBcIvCfkaIgU2tpcDogSW5kZXggY3VycmVudCBmaWxlIHRva2Vuc1wiLFxuICAgICAgICAgIHBlcmZvcm1hbmNlLm5vdygpIC0gc3RhcnRcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBhd2FpdCB0aGlzLmN1cnJlbnRGaWxlV29yZFByb3ZpZGVyLnJlZnJlc2hXb3JkcyhcbiAgICAgIHRoaXMuc2V0dGluZ3Mub25seUNvbXBsZW1lbnRFbmdsaXNoT25DdXJyZW50RmlsZUNvbXBsZW1lbnRcbiAgICApO1xuXG4gICAgdGhpcy5zdGF0dXNCYXIuc2V0Q3VycmVudEZpbGVJbmRleGVkKFxuICAgICAgdGhpcy5jdXJyZW50RmlsZVdvcmRQcm92aWRlci53b3JkQ291bnRcbiAgICApO1xuICAgIHRoaXMuc2hvd0RlYnVnTG9nKCgpID0+XG4gICAgICBidWlsZExvZ01lc3NhZ2UoXCJJbmRleCBjdXJyZW50IGZpbGUgdG9rZW5zXCIsIHBlcmZvcm1hbmNlLm5vdygpIC0gc3RhcnQpXG4gICAgKTtcbiAgfVxuXG4gIGFzeW5jIHJlZnJlc2hDdXJyZW50VmF1bHRUb2tlbnMoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3Qgc3RhcnQgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICB0aGlzLnN0YXR1c0Jhci5zZXRDdXJyZW50VmF1bHRJbmRleGluZygpO1xuXG4gICAgaWYgKCF0aGlzLnNldHRpbmdzLmVuYWJsZUN1cnJlbnRWYXVsdENvbXBsZW1lbnQpIHtcbiAgICAgIHRoaXMuc3RhdHVzQmFyLnNldEN1cnJlbnRWYXVsdERpc2FibGVkKCk7XG4gICAgICB0aGlzLmN1cnJlbnRWYXVsdFdvcmRQcm92aWRlci5jbGVhcldvcmRzKCk7XG4gICAgICB0aGlzLnNob3dEZWJ1Z0xvZygoKSA9PlxuICAgICAgICBidWlsZExvZ01lc3NhZ2UoXG4gICAgICAgICAgXCLwn5GiIFNraXA6IEluZGV4IGN1cnJlbnQgdmF1bHQgdG9rZW5zXCIsXG4gICAgICAgICAgcGVyZm9ybWFuY2Uubm93KCkgLSBzdGFydFxuICAgICAgICApXG4gICAgICApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGF3YWl0IHRoaXMuY3VycmVudFZhdWx0V29yZFByb3ZpZGVyLnJlZnJlc2hXb3JkcygpO1xuXG4gICAgdGhpcy5zdGF0dXNCYXIuc2V0Q3VycmVudFZhdWx0SW5kZXhlZChcbiAgICAgIHRoaXMuY3VycmVudFZhdWx0V29yZFByb3ZpZGVyLndvcmRDb3VudFxuICAgICk7XG4gICAgdGhpcy5zaG93RGVidWdMb2coKCkgPT5cbiAgICAgIGJ1aWxkTG9nTWVzc2FnZShcIkluZGV4IGN1cnJlbnQgdmF1bHQgdG9rZW5zXCIsIHBlcmZvcm1hbmNlLm5vdygpIC0gc3RhcnQpXG4gICAgKTtcbiAgfVxuXG4gIGFzeW5jIHJlZnJlc2hDdXN0b21EaWN0aW9uYXJ5VG9rZW5zKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHN0YXJ0ID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgdGhpcy5zdGF0dXNCYXIuc2V0Q3VzdG9tRGljdGlvbmFyeUluZGV4aW5nKCk7XG5cbiAgICBpZiAoIXRoaXMuc2V0dGluZ3MuZW5hYmxlQ3VzdG9tRGljdGlvbmFyeUNvbXBsZW1lbnQpIHtcbiAgICAgIHRoaXMuc3RhdHVzQmFyLnNldEN1c3RvbURpY3Rpb25hcnlEaXNhYmxlZCgpO1xuICAgICAgdGhpcy5jdXN0b21EaWN0aW9uYXJ5V29yZFByb3ZpZGVyLmNsZWFyV29yZHMoKTtcbiAgICAgIHRoaXMuc2hvd0RlYnVnTG9nKCgpID0+XG4gICAgICAgIGJ1aWxkTG9nTWVzc2FnZShcbiAgICAgICAgICBcIvCfkaJTa2lwOiBJbmRleCBjdXN0b20gZGljdGlvbmFyeSB0b2tlbnNcIixcbiAgICAgICAgICBwZXJmb3JtYW5jZS5ub3coKSAtIHN0YXJ0XG4gICAgICAgIClcbiAgICAgICk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgYXdhaXQgdGhpcy5jdXN0b21EaWN0aW9uYXJ5V29yZFByb3ZpZGVyLnJlZnJlc2hDdXN0b21Xb3Jkcyh7XG4gICAgICByZWdleHA6IHRoaXMuc2V0dGluZ3MuY3VzdG9tRGljdGlvbmFyeVdvcmRSZWdleFBhdHRlcm4sXG4gICAgICBkZWxpbWl0ZXJGb3JIaWRlOiB0aGlzLnNldHRpbmdzLmRlbGltaXRlclRvSGlkZVN1Z2dlc3Rpb24gfHwgdW5kZWZpbmVkLFxuICAgICAgZGVsaW1pdGVyRm9yRGlzcGxheTpcbiAgICAgICAgdGhpcy5zZXR0aW5ncy5kZWxpbWl0ZXJUb0RpdmlkZVN1Z2dlc3Rpb25zRm9yRGlzcGxheUZyb21JbnNlcnRpb24gfHxcbiAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgY2FyZXRTeW1ib2w6XG4gICAgICAgIHRoaXMuc2V0dGluZ3MuY2FyZXRMb2NhdGlvblN5bWJvbEFmdGVyQ29tcGxlbWVudCB8fCB1bmRlZmluZWQsXG4gICAgfSk7XG5cbiAgICB0aGlzLnN0YXR1c0Jhci5zZXRDdXN0b21EaWN0aW9uYXJ5SW5kZXhlZChcbiAgICAgIHRoaXMuY3VzdG9tRGljdGlvbmFyeVdvcmRQcm92aWRlci53b3JkQ291bnRcbiAgICApO1xuICAgIHRoaXMuc2hvd0RlYnVnTG9nKCgpID0+XG4gICAgICBidWlsZExvZ01lc3NhZ2UoXG4gICAgICAgIFwiSW5kZXggY3VzdG9tIGRpY3Rpb25hcnkgdG9rZW5zXCIsXG4gICAgICAgIHBlcmZvcm1hbmNlLm5vdygpIC0gc3RhcnRcbiAgICAgIClcbiAgICApO1xuICB9XG5cbiAgcmVmcmVzaEludGVybmFsTGlua1Rva2VucygpOiB2b2lkIHtcbiAgICBjb25zdCBzdGFydCA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgIHRoaXMuc3RhdHVzQmFyLnNldEludGVybmFsTGlua0luZGV4aW5nKCk7XG5cbiAgICBpZiAoIXRoaXMuc2V0dGluZ3MuZW5hYmxlSW50ZXJuYWxMaW5rQ29tcGxlbWVudCkge1xuICAgICAgdGhpcy5zdGF0dXNCYXIuc2V0SW50ZXJuYWxMaW5rRGlzYWJsZWQoKTtcbiAgICAgIHRoaXMuaW50ZXJuYWxMaW5rV29yZFByb3ZpZGVyLmNsZWFyV29yZHMoKTtcbiAgICAgIHRoaXMuc2hvd0RlYnVnTG9nKCgpID0+XG4gICAgICAgIGJ1aWxkTG9nTWVzc2FnZShcbiAgICAgICAgICBcIvCfkaJTa2lwOiBJbmRleCBpbnRlcm5hbCBsaW5rIHRva2Vuc1wiLFxuICAgICAgICAgIHBlcmZvcm1hbmNlLm5vdygpIC0gc3RhcnRcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmludGVybmFsTGlua1dvcmRQcm92aWRlci5yZWZyZXNoV29yZHMoXG4gICAgICB0aGlzLnNldHRpbmdzLnN1Z2dlc3RJbnRlcm5hbExpbmtXaXRoQWxpYXMsXG4gICAgICB0aGlzLmV4Y2x1ZGVJbnRlcm5hbExpbmtQcmVmaXhQYXRoUGF0dGVybnNcbiAgICApO1xuXG4gICAgdGhpcy5zdGF0dXNCYXIuc2V0SW50ZXJuYWxMaW5rSW5kZXhlZChcbiAgICAgIHRoaXMuaW50ZXJuYWxMaW5rV29yZFByb3ZpZGVyLndvcmRDb3VudFxuICAgICk7XG4gICAgdGhpcy5zaG93RGVidWdMb2coKCkgPT5cbiAgICAgIGJ1aWxkTG9nTWVzc2FnZShcIkluZGV4IGludGVybmFsIGxpbmsgdG9rZW5zXCIsIHBlcmZvcm1hbmNlLm5vdygpIC0gc3RhcnQpXG4gICAgKTtcbiAgfVxuXG4gIHJlZnJlc2hGcm9udE1hdHRlclRva2VucygpOiB2b2lkIHtcbiAgICBjb25zdCBzdGFydCA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgIHRoaXMuc3RhdHVzQmFyLnNldEZyb250TWF0dGVySW5kZXhpbmcoKTtcblxuICAgIGlmICghdGhpcy5zZXR0aW5ncy5lbmFibGVGcm9udE1hdHRlckNvbXBsZW1lbnQpIHtcbiAgICAgIHRoaXMuc3RhdHVzQmFyLnNldEZyb250TWF0dGVyRGlzYWJsZWQoKTtcbiAgICAgIHRoaXMuZnJvbnRNYXR0ZXJXb3JkUHJvdmlkZXIuY2xlYXJXb3JkcygpO1xuICAgICAgdGhpcy5zaG93RGVidWdMb2coKCkgPT5cbiAgICAgICAgYnVpbGRMb2dNZXNzYWdlKFxuICAgICAgICAgIFwi8J+RolNraXA6IEluZGV4IGZyb250IG1hdHRlciB0b2tlbnNcIixcbiAgICAgICAgICBwZXJmb3JtYW5jZS5ub3coKSAtIHN0YXJ0XG4gICAgICAgIClcbiAgICAgICk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5mcm9udE1hdHRlcldvcmRQcm92aWRlci5yZWZyZXNoV29yZHMoKTtcblxuICAgIHRoaXMuc3RhdHVzQmFyLnNldEZyb250TWF0dGVySW5kZXhlZChcbiAgICAgIHRoaXMuZnJvbnRNYXR0ZXJXb3JkUHJvdmlkZXIud29yZENvdW50XG4gICAgKTtcbiAgICB0aGlzLnNob3dEZWJ1Z0xvZygoKSA9PlxuICAgICAgYnVpbGRMb2dNZXNzYWdlKFwiSW5kZXggZnJvbnQgbWF0dGVyIHRva2Vuc1wiLCBwZXJmb3JtYW5jZS5ub3coKSAtIHN0YXJ0KVxuICAgICk7XG4gIH1cblxuICB1cGRhdGVGcm9udE1hdHRlclRva2VuSW5kZXgoZmlsZTogVEZpbGUpOiB2b2lkIHtcbiAgICBjb25zdCBzdGFydCA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgIGlmICghdGhpcy5zZXR0aW5ncy5lbmFibGVGcm9udE1hdHRlckNvbXBsZW1lbnQpIHtcbiAgICAgIHRoaXMuc2hvd0RlYnVnTG9nKCgpID0+XG4gICAgICAgIGJ1aWxkTG9nTWVzc2FnZShcbiAgICAgICAgICBcIvCfkaJTa2lwOiBVcGRhdGUgZnJvbnQgbWF0dGVyIHRva2VuIGluZGV4XCIsXG4gICAgICAgICAgcGVyZm9ybWFuY2Uubm93KCkgLSBzdGFydFxuICAgICAgICApXG4gICAgICApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuZnJvbnRNYXR0ZXJXb3JkUHJvdmlkZXIudXBkYXRlV29yZEluZGV4KGZpbGUpO1xuXG4gICAgdGhpcy5zaG93RGVidWdMb2coKCkgPT5cbiAgICAgIGJ1aWxkTG9nTWVzc2FnZShcbiAgICAgICAgXCJVcGRhdGUgZnJvbnQgbWF0dGVyIHRva2VuIGluZGV4XCIsXG4gICAgICAgIHBlcmZvcm1hbmNlLm5vdygpIC0gc3RhcnRcbiAgICAgIClcbiAgICApO1xuICB9XG5cbiAgdXBkYXRlRnJvbnRNYXR0ZXJUb2tlbigpOiB2b2lkIHtcbiAgICBjb25zdCBzdGFydCA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgIGlmICghdGhpcy5zZXR0aW5ncy5lbmFibGVGcm9udE1hdHRlckNvbXBsZW1lbnQpIHtcbiAgICAgIHRoaXMuc2hvd0RlYnVnTG9nKCgpID0+XG4gICAgICAgIGJ1aWxkTG9nTWVzc2FnZShcbiAgICAgICAgICBcIvCfkaJTa2lwOiBVcGRhdGUgZnJvbnQgbWF0dGVyIHRva2VuXCIsXG4gICAgICAgICAgcGVyZm9ybWFuY2Uubm93KCkgLSBzdGFydFxuICAgICAgICApXG4gICAgICApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuZnJvbnRNYXR0ZXJXb3JkUHJvdmlkZXIudXBkYXRlV29yZHMoKTtcbiAgICB0aGlzLnN0YXR1c0Jhci5zZXRGcm9udE1hdHRlckluZGV4ZWQoXG4gICAgICB0aGlzLmZyb250TWF0dGVyV29yZFByb3ZpZGVyLndvcmRDb3VudFxuICAgICk7XG5cbiAgICB0aGlzLnNob3dEZWJ1Z0xvZygoKSA9PlxuICAgICAgYnVpbGRMb2dNZXNzYWdlKFwiVXBkYXRlIGZyb250IG1hdHRlciB0b2tlblwiLCBwZXJmb3JtYW5jZS5ub3coKSAtIHN0YXJ0KVxuICAgICk7XG4gIH1cblxuICBvblRyaWdnZXIoXG4gICAgY3Vyc29yOiBFZGl0b3JQb3NpdGlvbixcbiAgICBlZGl0b3I6IEVkaXRvcixcbiAgICBmaWxlOiBURmlsZVxuICApOiBFZGl0b3JTdWdnZXN0VHJpZ2dlckluZm8gfCBudWxsIHtcbiAgICBjb25zdCBzdGFydCA9IHBlcmZvcm1hbmNlLm5vdygpO1xuXG4gICAgaWYgKFxuICAgICAgIXRoaXMuc2V0dGluZ3MuY29tcGxlbWVudEF1dG9tYXRpY2FsbHkgJiZcbiAgICAgICF0aGlzLmlzT3BlbiAmJlxuICAgICAgIXRoaXMucnVuTWFudWFsbHlcbiAgICApIHtcbiAgICAgIHRoaXMuc2hvd0RlYnVnTG9nKCgpID0+IFwiRG9uJ3Qgc2hvdyBzdWdnZXN0aW9uc1wiKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGlmIChcbiAgICAgIHRoaXMuc2V0dGluZ3MuZGlzYWJsZVN1Z2dlc3Rpb25zRHVyaW5nSW1lT24gJiZcbiAgICAgIHRoaXMuYXBwSGVscGVyLmlzSU1FT24oKSAmJlxuICAgICAgIXRoaXMucnVuTWFudWFsbHlcbiAgICApIHtcbiAgICAgIHRoaXMuc2hvd0RlYnVnTG9nKCgpID0+IFwiRG9uJ3Qgc2hvdyBzdWdnZXN0aW9ucyBmb3IgSU1FXCIpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgY2wgPSB0aGlzLmFwcEhlbHBlci5nZXRDdXJyZW50TGluZShlZGl0b3IpO1xuICAgIGlmICh0aGlzLnByZXZpb3VzQ3VycmVudExpbmUgPT09IGNsICYmICF0aGlzLnJ1bk1hbnVhbGx5KSB7XG4gICAgICB0aGlzLnByZXZpb3VzQ3VycmVudExpbmUgPSBjbDtcbiAgICAgIHRoaXMuc2hvd0RlYnVnTG9nKFxuICAgICAgICAoKSA9PiBcIkRvbid0IHNob3cgc3VnZ2VzdGlvbnMgYmVjYXVzZSB0aGVyZSBhcmUgbm8gY2hhbmdlc1wiXG4gICAgICApO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHRoaXMucHJldmlvdXNDdXJyZW50TGluZSA9IGNsO1xuXG4gICAgY29uc3QgY3VycmVudExpbmVVbnRpbEN1cnNvciA9XG4gICAgICB0aGlzLmFwcEhlbHBlci5nZXRDdXJyZW50TGluZVVudGlsQ3Vyc29yKGVkaXRvcik7XG4gICAgaWYgKGN1cnJlbnRMaW5lVW50aWxDdXJzb3Iuc3RhcnRzV2l0aChcIi0tLVwiKSkge1xuICAgICAgdGhpcy5zaG93RGVidWdMb2coXG4gICAgICAgICgpID0+XG4gICAgICAgICAgXCJEb24ndCBzaG93IHN1Z2dlc3Rpb25zIGJlY2F1c2UgaXQgc3VwcG9zZXMgZnJvbnQgbWF0dGVyIG9yIGhvcml6b250YWwgbGluZVwiXG4gICAgICApO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmIChcbiAgICAgIGN1cnJlbnRMaW5lVW50aWxDdXJzb3Iuc3RhcnRzV2l0aChcIn5+flwiKSB8fFxuICAgICAgY3VycmVudExpbmVVbnRpbEN1cnNvci5zdGFydHNXaXRoKFwiYGBgXCIpXG4gICAgKSB7XG4gICAgICB0aGlzLnNob3dEZWJ1Z0xvZyhcbiAgICAgICAgKCkgPT4gXCJEb24ndCBzaG93IHN1Z2dlc3Rpb25zIGJlY2F1c2UgaXQgc3VwcG9zZXMgZnJvbnQgY29kZSBibG9ja1wiXG4gICAgICApO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgdG9rZW5zID0gdGhpcy50b2tlbml6ZXIudG9rZW5pemUoY3VycmVudExpbmVVbnRpbEN1cnNvciwgdHJ1ZSk7XG4gICAgdGhpcy5zaG93RGVidWdMb2coKCkgPT4gYFtvblRyaWdnZXJdIHRva2VucyBpcyAke3Rva2Vuc31gKTtcblxuICAgIGNvbnN0IHRva2VuaXplZCA9IHRoaXMudG9rZW5pemVyLnJlY3Vyc2l2ZVRva2VuaXplKGN1cnJlbnRMaW5lVW50aWxDdXJzb3IpO1xuICAgIGNvbnN0IGN1cnJlbnRUb2tlbnMgPSB0b2tlbml6ZWQuc2xpY2UoXG4gICAgICB0b2tlbml6ZWQubGVuZ3RoID4gdGhpcy5zZXR0aW5ncy5tYXhOdW1iZXJPZldvcmRzQXNQaHJhc2VcbiAgICAgICAgPyB0b2tlbml6ZWQubGVuZ3RoIC0gdGhpcy5zZXR0aW5ncy5tYXhOdW1iZXJPZldvcmRzQXNQaHJhc2VcbiAgICAgICAgOiAwXG4gICAgKTtcbiAgICB0aGlzLnNob3dEZWJ1Z0xvZyhcbiAgICAgICgpID0+IGBbb25UcmlnZ2VyXSBjdXJyZW50VG9rZW5zIGlzICR7SlNPTi5zdHJpbmdpZnkoY3VycmVudFRva2Vucyl9YFxuICAgICk7XG5cbiAgICBjb25zdCBjdXJyZW50VG9rZW4gPSBjdXJyZW50VG9rZW5zWzBdPy53b3JkO1xuICAgIHRoaXMuc2hvd0RlYnVnTG9nKCgpID0+IGBbb25UcmlnZ2VyXSBjdXJyZW50VG9rZW4gaXMgJHtjdXJyZW50VG9rZW59YCk7XG4gICAgaWYgKCFjdXJyZW50VG9rZW4pIHtcbiAgICAgIHRoaXMucnVuTWFudWFsbHkgPSBmYWxzZTtcbiAgICAgIHRoaXMuc2hvd0RlYnVnTG9nKFxuICAgICAgICAoKSA9PiBgRG9uJ3Qgc2hvdyBzdWdnZXN0aW9ucyBiZWNhdXNlIGN1cnJlbnRUb2tlbiBpcyBlbXB0eWBcbiAgICAgICk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBjdXJyZW50VG9rZW5TZXBhcmF0ZWRXaGl0ZVNwYWNlID1cbiAgICAgIGN1cnJlbnRMaW5lVW50aWxDdXJzb3Iuc3BsaXQoXCIgXCIpLmxhc3QoKSA/PyBcIlwiO1xuICAgIGlmIChcbiAgICAgIG5ldyBSZWdFeHAoYF5bJHt0aGlzLnNldHRpbmdzLmZpcnN0Q2hhcmFjdGVyc0Rpc2FibGVTdWdnZXN0aW9uc31dYCkudGVzdChcbiAgICAgICAgY3VycmVudFRva2VuU2VwYXJhdGVkV2hpdGVTcGFjZVxuICAgICAgKVxuICAgICkge1xuICAgICAgdGhpcy5ydW5NYW51YWxseSA9IGZhbHNlO1xuICAgICAgdGhpcy5zaG93RGVidWdMb2coXG4gICAgICAgICgpID0+XG4gICAgICAgICAgYERvbid0IHNob3cgc3VnZ2VzdGlvbnMgZm9yIGF2b2lkaW5nIHRvIGNvbmZsaWN0IHdpdGggdGhlIG90aGVyIGNvbW1hbmRzLmBcbiAgICAgICk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAoXG4gICAgICBjdXJyZW50VG9rZW4ubGVuZ3RoID09PSAxICYmXG4gICAgICBCb29sZWFuKGN1cnJlbnRUb2tlbi5tYXRjaCh0aGlzLnRva2VuaXplci5nZXRUcmltUGF0dGVybigpKSlcbiAgICApIHtcbiAgICAgIHRoaXMucnVuTWFudWFsbHkgPSBmYWxzZTtcbiAgICAgIHRoaXMuc2hvd0RlYnVnTG9nKFxuICAgICAgICAoKSA9PiBgRG9uJ3Qgc2hvdyBzdWdnZXN0aW9ucyBiZWNhdXNlIGN1cnJlbnRUb2tlbiBpcyBUUklNX1BBVFRFUk5gXG4gICAgICApO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgY3VycmVudEZyb250TWF0dGVyID0gdGhpcy5zZXR0aW5ncy5lbmFibGVGcm9udE1hdHRlckNvbXBsZW1lbnRcbiAgICAgID8gdGhpcy5hcHBIZWxwZXIuZ2V0Q3VycmVudEZyb250TWF0dGVyKClcbiAgICAgIDogbnVsbDtcbiAgICB0aGlzLnNob3dEZWJ1Z0xvZygoKSA9PiBgQ3VycmVudCBmcm9udCBtYXR0ZXIgaXMgJHtjdXJyZW50RnJvbnRNYXR0ZXJ9YCk7XG5cbiAgICBpZiAoIXRoaXMucnVuTWFudWFsbHkgJiYgIWN1cnJlbnRGcm9udE1hdHRlcikge1xuICAgICAgaWYgKGN1cnJlbnRUb2tlbi5sZW5ndGggPCB0aGlzLm1pbk51bWJlclRyaWdnZXJlZCkge1xuICAgICAgICB0aGlzLnNob3dEZWJ1Z0xvZyhcbiAgICAgICAgICAoKSA9PlxuICAgICAgICAgICAgXCJEb24ndCBzaG93IHN1Z2dlc3Rpb25zIGJlY2F1c2UgY3VycmVudFRva2VuIGlzIGxlc3MgdGhhbiBtaW5OdW1iZXJUcmlnZ2VyZWQgb3B0aW9uXCJcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy50b2tlbml6ZXIuc2hvdWxkSWdub3JlKGN1cnJlbnRUb2tlbikpIHtcbiAgICAgICAgdGhpcy5zaG93RGVidWdMb2coXG4gICAgICAgICAgKCkgPT4gXCJEb24ndCBzaG93IHN1Z2dlc3Rpb25zIGJlY2F1c2UgY3VycmVudFRva2VuIHNob3VsZCBpZ25vcmVkXCJcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5zaG93RGVidWdMb2coKCkgPT5cbiAgICAgIGJ1aWxkTG9nTWVzc2FnZShcIm9uVHJpZ2dlclwiLCBwZXJmb3JtYW5jZS5ub3coKSAtIHN0YXJ0KVxuICAgICk7XG4gICAgdGhpcy5ydW5NYW51YWxseSA9IGZhbHNlO1xuXG4gICAgLy8gSGFjayBpbXBsZW1lbnRhdGlvbiBmb3IgRnJvbnQgbWF0dGVyIGNvbXBsZW1lbnRcbiAgICBpZiAoY3VycmVudEZyb250TWF0dGVyICYmIGN1cnJlbnRUb2tlbnMubGFzdCgpPy53b3JkLm1hdGNoKC9bXiBdICQvKSkge1xuICAgICAgY3VycmVudFRva2Vucy5wdXNoKHsgd29yZDogXCJcIiwgb2Zmc2V0OiBjdXJyZW50TGluZVVudGlsQ3Vyc29yLmxlbmd0aCB9KTtcbiAgICB9XG5cbiAgICAvLyBGb3IgbXVsdGktd29yZCBjb21wbGV0aW9uXG4gICAgdGhpcy5jb250ZXh0U3RhcnRDaCA9IGN1cnNvci5jaCAtIGN1cnJlbnRUb2tlbi5sZW5ndGg7XG4gICAgcmV0dXJuIHtcbiAgICAgIHN0YXJ0OiB7XG4gICAgICAgIGNoOiBjdXJzb3IuY2ggLSAoY3VycmVudFRva2Vucy5sYXN0KCk/LndvcmQ/Lmxlbmd0aCA/PyAwKSwgLy8gRm9yIG11bHRpLXdvcmQgY29tcGxldGlvblxuICAgICAgICBsaW5lOiBjdXJzb3IubGluZSxcbiAgICAgIH0sXG4gICAgICBlbmQ6IGN1cnNvcixcbiAgICAgIHF1ZXJ5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgIGN1cnJlbnRGcm9udE1hdHRlcixcbiAgICAgICAgcXVlcmllczogY3VycmVudFRva2Vucy5tYXAoKHgpID0+ICh7XG4gICAgICAgICAgLi4ueCxcbiAgICAgICAgICBvZmZzZXQ6IHgub2Zmc2V0IC0gY3VycmVudFRva2Vuc1swXS5vZmZzZXQsXG4gICAgICAgIH0pKSxcbiAgICAgIH0pLFxuICAgIH07XG4gIH1cblxuICBnZXRTdWdnZXN0aW9ucyhjb250ZXh0OiBFZGl0b3JTdWdnZXN0Q29udGV4dCk6IFdvcmRbXSB8IFByb21pc2U8V29yZFtdPiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICB0aGlzLmRlYm91bmNlR2V0U3VnZ2VzdGlvbnMoY29udGV4dCwgKHdvcmRzKSA9PiB7XG4gICAgICAgIHJlc29sdmUod29yZHMpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICByZW5kZXJTdWdnZXN0aW9uKHdvcmQ6IFdvcmQsIGVsOiBIVE1MRWxlbWVudCk6IHZvaWQge1xuICAgIGNvbnN0IGJhc2UgPSBjcmVhdGVEaXYoKTtcblxuICAgIGxldCB0ZXh0ID0gd29yZC52YWx1ZTtcbiAgICBpZiAoXG4gICAgICB3b3JkLnR5cGUgPT09IFwiY3VzdG9tRGljdGlvbmFyeVwiICYmXG4gICAgICB3b3JkLmluc2VydGVkVGV4dCAmJlxuICAgICAgdGhpcy5zZXR0aW5ncy5kaXNwbGF5ZWRUZXh0U3VmZml4XG4gICAgKSB7XG4gICAgICB0ZXh0ICs9IHRoaXMuc2V0dGluZ3MuZGlzcGxheWVkVGV4dFN1ZmZpeDtcbiAgICB9XG5cbiAgICBiYXNlLmNyZWF0ZURpdih7XG4gICAgICB0ZXh0LFxuICAgICAgY2xzOlxuICAgICAgICB3b3JkLnR5cGUgPT09IFwiaW50ZXJuYWxMaW5rXCIgJiYgd29yZC5hbGlhc01ldGFcbiAgICAgICAgICA/IFwidmFyaW91cy1jb21wbGVtZW50c19fc3VnZ2VzdGlvbi1pdGVtX19jb250ZW50X19hbGlhc1wiXG4gICAgICAgICAgOiB1bmRlZmluZWQsXG4gICAgfSk7XG5cbiAgICBjb25zdCBkZXNjcmlwdGlvbiA9IHRoaXMuZGVzY3JpcHRpb25PblN1Z2dlc3Rpb24udG9EaXNwbGF5KHdvcmQpO1xuICAgIGlmIChkZXNjcmlwdGlvbikge1xuICAgICAgYmFzZS5jcmVhdGVEaXYoe1xuICAgICAgICBjbHM6IFwidmFyaW91cy1jb21wbGVtZW50c19fc3VnZ2VzdGlvbi1pdGVtX19kZXNjcmlwdGlvblwiLFxuICAgICAgICB0ZXh0OiBgJHtkZXNjcmlwdGlvbn1gLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgZWwuYXBwZW5kQ2hpbGQoYmFzZSk7XG5cbiAgICBlbC5hZGRDbGFzcyhcInZhcmlvdXMtY29tcGxlbWVudHNfX3N1Z2dlc3Rpb24taXRlbVwiKTtcbiAgICBzd2l0Y2ggKHdvcmQudHlwZSkge1xuICAgICAgY2FzZSBcImN1cnJlbnRGaWxlXCI6XG4gICAgICAgIGVsLmFkZENsYXNzKFwidmFyaW91cy1jb21wbGVtZW50c19fc3VnZ2VzdGlvbi1pdGVtX19jdXJyZW50LWZpbGVcIik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImN1cnJlbnRWYXVsdFwiOlxuICAgICAgICBlbC5hZGRDbGFzcyhcInZhcmlvdXMtY29tcGxlbWVudHNfX3N1Z2dlc3Rpb24taXRlbV9fY3VycmVudC12YXVsdFwiKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiY3VzdG9tRGljdGlvbmFyeVwiOlxuICAgICAgICBlbC5hZGRDbGFzcyhcInZhcmlvdXMtY29tcGxlbWVudHNfX3N1Z2dlc3Rpb24taXRlbV9fY3VzdG9tLWRpY3Rpb25hcnlcIik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImludGVybmFsTGlua1wiOlxuICAgICAgICBlbC5hZGRDbGFzcyhcInZhcmlvdXMtY29tcGxlbWVudHNfX3N1Z2dlc3Rpb24taXRlbV9faW50ZXJuYWwtbGlua1wiKTtcbiAgICAgICAgaWYgKHdvcmQucGhhbnRvbSkge1xuICAgICAgICAgIGVsLmFkZENsYXNzKFwidmFyaW91cy1jb21wbGVtZW50c19fc3VnZ2VzdGlvbi1pdGVtX19waGFudG9tXCIpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImZyb250TWF0dGVyXCI6XG4gICAgICAgIGVsLmFkZENsYXNzKFwidmFyaW91cy1jb21wbGVtZW50c19fc3VnZ2VzdGlvbi1pdGVtX19mcm9udC1tYXR0ZXJcIik7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHNlbGVjdFN1Z2dlc3Rpb24od29yZDogV29yZCwgZXZ0OiBNb3VzZUV2ZW50IHwgS2V5Ym9hcmRFdmVudCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5jb250ZXh0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IGluc2VydGVkVGV4dCA9IHdvcmQudmFsdWU7XG4gICAgaWYgKHdvcmQudHlwZSA9PT0gXCJpbnRlcm5hbExpbmtcIikge1xuICAgICAgaW5zZXJ0ZWRUZXh0ID1cbiAgICAgICAgdGhpcy5zZXR0aW5ncy5zdWdnZXN0SW50ZXJuYWxMaW5rV2l0aEFsaWFzICYmIHdvcmQuYWxpYXNNZXRhXG4gICAgICAgICAgPyBgW1ske3dvcmQuYWxpYXNNZXRhLm9yaWdpbn18JHt3b3JkLnZhbHVlfV1dYFxuICAgICAgICAgIDogYFtbJHt3b3JkLnZhbHVlfV1dYDtcbiAgICB9XG5cbiAgICBpZiAoXG4gICAgICB3b3JkLnR5cGUgPT09IFwiZnJvbnRNYXR0ZXJcIiAmJlxuICAgICAgdGhpcy5zZXR0aW5ncy5pbnNlcnRDb21tYUFmdGVyRnJvbnRNYXR0ZXJDb21wbGV0aW9uXG4gICAgKSB7XG4gICAgICBpbnNlcnRlZFRleHQgPSBgJHtpbnNlcnRlZFRleHR9LCBgO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoXG4gICAgICAgIHRoaXMuc2V0dGluZ3MuaW5zZXJ0QWZ0ZXJDb21wbGV0aW9uICYmXG4gICAgICAgICEod29yZC50eXBlID09PSBcImN1c3RvbURpY3Rpb25hcnlcIiAmJiB3b3JkLmlnbm9yZVNwYWNlQWZ0ZXJDb21wbGV0aW9uKVxuICAgICAgKSB7XG4gICAgICAgIGluc2VydGVkVGV4dCA9IGAke2luc2VydGVkVGV4dH0gYDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgcG9zaXRpb25Ub01vdmUgPSAtMTtcblxuICAgIGlmICh3b3JkLnR5cGUgPT09IFwiY3VzdG9tRGljdGlvbmFyeVwiKSB7XG4gICAgICBpZiAod29yZC5pbnNlcnRlZFRleHQpIHtcbiAgICAgICAgaW5zZXJ0ZWRUZXh0ID0gd29yZC5pbnNlcnRlZFRleHQ7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGNhcmV0ID0gd29yZC5jYXJldFN5bWJvbDtcbiAgICAgIGlmIChjYXJldCkge1xuICAgICAgICBwb3NpdGlvblRvTW92ZSA9IGluc2VydGVkVGV4dC5pbmRleE9mKGNhcmV0KTtcbiAgICAgICAgaW5zZXJ0ZWRUZXh0ID0gaW5zZXJ0ZWRUZXh0LnJlcGxhY2UoY2FyZXQsIFwiXCIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGVkaXRvciA9IHRoaXMuY29udGV4dC5lZGl0b3I7XG4gICAgZWRpdG9yLnJlcGxhY2VSYW5nZShcbiAgICAgIGluc2VydGVkVGV4dCxcbiAgICAgIHtcbiAgICAgICAgLi4udGhpcy5jb250ZXh0LnN0YXJ0LFxuICAgICAgICBjaDogdGhpcy5jb250ZXh0U3RhcnRDaCArIHdvcmQub2Zmc2V0ISxcbiAgICAgIH0sXG4gICAgICB0aGlzLmNvbnRleHQuZW5kXG4gICAgKTtcblxuICAgIGlmIChwb3NpdGlvblRvTW92ZSAhPT0gLTEpIHtcbiAgICAgIGVkaXRvci5zZXRDdXJzb3IoXG4gICAgICAgIGVkaXRvci5vZmZzZXRUb1BvcyhcbiAgICAgICAgICBlZGl0b3IucG9zVG9PZmZzZXQoZWRpdG9yLmdldEN1cnNvcigpKSAtXG4gICAgICAgICAgICBpbnNlcnRlZFRleHQubGVuZ3RoICtcbiAgICAgICAgICAgIHBvc2l0aW9uVG9Nb3ZlXG4gICAgICAgIClcbiAgICAgICk7XG4gICAgfVxuXG4gICAgLy8gVGhlIHdvcmthcm91bmQgb2Ygc3RyYW5nZSBiZWhhdmlvciBmb3IgdGhhdCBjdXJzb3IgZG9lc24ndCBtb3ZlIGFmdGVyIGNvbXBsZXRpb24gb25seSBpZiBpdCBkb2Vzbid0IGlucHV0IGFueSB3b3JkLlxuICAgIGlmIChcbiAgICAgIHRoaXMuYXBwSGVscGVyLmVxdWFsc0FzRWRpdG9yUG9zdGlvbih0aGlzLmNvbnRleHQuc3RhcnQsIHRoaXMuY29udGV4dC5lbmQpXG4gICAgKSB7XG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yKFxuICAgICAgICBlZGl0b3Iub2Zmc2V0VG9Qb3MoXG4gICAgICAgICAgZWRpdG9yLnBvc1RvT2Zmc2V0KGVkaXRvci5nZXRDdXJzb3IoKSkgKyBpbnNlcnRlZFRleHQubGVuZ3RoXG4gICAgICAgIClcbiAgICAgICk7XG4gICAgfVxuXG4gICAgdGhpcy5zZWxlY3Rpb25IaXN0b3J5U3RvcmFnZT8uaW5jcmVtZW50KHdvcmQgYXMgSGl0V29yZCk7XG4gICAgaWYgKHRoaXMuc2V0dGluZ3Muc2hvd0xvZ0Fib3V0UGVyZm9ybWFuY2VJbkNvbnNvbGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiLS0tIGhpc3RvcnkgLS0tXCIpO1xuICAgICAgY29uc29sZS5sb2codGhpcy5zZWxlY3Rpb25IaXN0b3J5U3RvcmFnZT8uZGF0YSk7XG4gICAgfVxuXG4gICAgdGhpcy5jbG9zZSgpO1xuICAgIHRoaXMuZGVib3VuY2VDbG9zZSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBzaG93RGVidWdMb2codG9NZXNzYWdlOiAoKSA9PiBzdHJpbmcpIHtcbiAgICBpZiAodGhpcy5zZXR0aW5ncy5zaG93TG9nQWJvdXRQZXJmb3JtYW5jZUluQ29uc29sZSkge1xuICAgICAgY29uc29sZS5sb2codG9NZXNzYWdlKCkpO1xuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IHsgQXBwLCBOb3RpY2UsIFBsdWdpblNldHRpbmdUYWIsIFNldHRpbmcgfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB0eXBlIFZhcmlvdXNDb21wb25lbnRzIGZyb20gXCIuLi9tYWluXCI7XG5pbXBvcnQgeyBUb2tlbml6ZVN0cmF0ZWd5IH0gZnJvbSBcIi4uL3Rva2VuaXplci9Ub2tlbml6ZVN0cmF0ZWd5XCI7XG5pbXBvcnQgeyBNYXRjaFN0cmF0ZWd5IH0gZnJvbSBcIi4uL3Byb3ZpZGVyL01hdGNoU3RyYXRlZ3lcIjtcbmltcG9ydCB7IEN5Y2xlVGhyb3VnaFN1Z2dlc3Rpb25zS2V5cyB9IGZyb20gXCIuLi9vcHRpb24vQ3ljbGVUaHJvdWdoU3VnZ2VzdGlvbnNLZXlzXCI7XG5pbXBvcnQgeyBDb2x1bW5EZWxpbWl0ZXIgfSBmcm9tIFwiLi4vb3B0aW9uL0NvbHVtbkRlbGltaXRlclwiO1xuaW1wb3J0IHsgU2VsZWN0U3VnZ2VzdGlvbktleSB9IGZyb20gXCIuLi9vcHRpb24vU2VsZWN0U3VnZ2VzdGlvbktleVwiO1xuaW1wb3J0IHsgbWlycm9yTWFwIH0gZnJvbSBcIi4uL3V0aWwvY29sbGVjdGlvbi1oZWxwZXJcIjtcbmltcG9ydCB7IE9wZW5Tb3VyY2VGaWxlS2V5cyB9IGZyb20gXCIuLi9vcHRpb24vT3BlblNvdXJjZUZpbGVLZXlzXCI7XG5pbXBvcnQgeyBEZXNjcmlwdGlvbk9uU3VnZ2VzdGlvbiB9IGZyb20gXCIuLi9vcHRpb24vRGVzY3JpcHRpb25PblN1Z2dlc3Rpb25cIjtcbmltcG9ydCB7IFNwZWNpZmljTWF0Y2hTdHJhdGVneSB9IGZyb20gXCIuLi9wcm92aWRlci9TcGVjaWZpY01hdGNoU3RyYXRlZ3lcIjtcbmltcG9ydCB0eXBlIHsgU2VsZWN0aW9uSGlzdG9yeVRyZWUgfSBmcm9tIFwiLi4vc3RvcmFnZS9TZWxlY3Rpb25IaXN0b3J5U3RvcmFnZVwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIFNldHRpbmdzIHtcbiAgLy8gZ2VuZXJhbFxuICBzdHJhdGVneTogc3RyaW5nO1xuICBtYXRjaFN0cmF0ZWd5OiBzdHJpbmc7XG4gIG1heE51bWJlck9mU3VnZ2VzdGlvbnM6IG51bWJlcjtcbiAgbWF4TnVtYmVyT2ZXb3Jkc0FzUGhyYXNlOiBudW1iZXI7XG4gIG1pbk51bWJlck9mQ2hhcmFjdGVyc1RyaWdnZXJlZDogbnVtYmVyO1xuICBtaW5OdW1iZXJPZldvcmRzVHJpZ2dlcmVkUGhyYXNlOiBudW1iZXI7XG4gIGNvbXBsZW1lbnRBdXRvbWF0aWNhbGx5OiBib29sZWFuO1xuICBkZWxheU1pbGxpU2Vjb25kczogbnVtYmVyO1xuICBkaXNhYmxlU3VnZ2VzdGlvbnNEdXJpbmdJbWVPbjogYm9vbGVhbjtcbiAgLy8gRklYTUU6IFJlbmFtZSBhdCBuZXh0IG1ham9yIHZlcnNpb24gdXBcbiAgaW5zZXJ0QWZ0ZXJDb21wbGV0aW9uOiBib29sZWFuO1xuICBmaXJzdENoYXJhY3RlcnNEaXNhYmxlU3VnZ2VzdGlvbnM6IHN0cmluZztcblxuICAvLyBhcHBlYXJhbmNlXG4gIHNob3dNYXRjaFN0cmF0ZWd5OiBib29sZWFuO1xuICBzaG93SW5kZXhpbmdTdGF0dXM6IGJvb2xlYW47XG4gIGRlc2NyaXB0aW9uT25TdWdnZXN0aW9uOiBzdHJpbmc7XG5cbiAgLy8ga2V5IGN1c3RvbWl6YXRpb25cbiAgc2VsZWN0U3VnZ2VzdGlvbktleXM6IHN0cmluZztcbiAgYWRkaXRpb25hbEN5Y2xlVGhyb3VnaFN1Z2dlc3Rpb25zS2V5czogc3RyaW5nO1xuICBvcGVuU291cmNlRmlsZUtleTogc3RyaW5nO1xuICBwcm9wYWdhdGVFc2M6IGJvb2xlYW47XG5cbiAgLy8gY3VycmVudCBmaWxlIGNvbXBsZW1lbnRcbiAgZW5hYmxlQ3VycmVudEZpbGVDb21wbGVtZW50OiBib29sZWFuO1xuICBvbmx5Q29tcGxlbWVudEVuZ2xpc2hPbkN1cnJlbnRGaWxlQ29tcGxlbWVudDogYm9vbGVhbjtcblxuICAvLyBjdXJyZW50IHZhdWx0IGNvbXBsZW1lbnRcbiAgZW5hYmxlQ3VycmVudFZhdWx0Q29tcGxlbWVudDogYm9vbGVhbjtcbiAgaW5jbHVkZUN1cnJlbnRWYXVsdFBhdGhQcmVmaXhQYXR0ZXJuczogc3RyaW5nO1xuICBleGNsdWRlQ3VycmVudFZhdWx0UGF0aFByZWZpeFBhdHRlcm5zOiBzdHJpbmc7XG4gIGluY2x1ZGVDdXJyZW50VmF1bHRPbmx5RmlsZXNVbmRlckN1cnJlbnREaXJlY3Rvcnk6IGJvb2xlYW47XG5cbiAgLy8gY3VzdG9tIGRpY3Rpb25hcnkgY29tcGxlbWVudFxuICBlbmFibGVDdXN0b21EaWN0aW9uYXJ5Q29tcGxlbWVudDogYm9vbGVhbjtcbiAgY3VzdG9tRGljdGlvbmFyeVBhdGhzOiBzdHJpbmc7XG4gIGNvbHVtbkRlbGltaXRlcjogc3RyaW5nO1xuICBjdXN0b21EaWN0aW9uYXJ5V29yZFJlZ2V4UGF0dGVybjogc3RyaW5nO1xuICBkZWxpbWl0ZXJUb0hpZGVTdWdnZXN0aW9uOiBzdHJpbmc7XG4gIGRlbGltaXRlclRvRGl2aWRlU3VnZ2VzdGlvbnNGb3JEaXNwbGF5RnJvbUluc2VydGlvbjogc3RyaW5nO1xuICBjYXJldExvY2F0aW9uU3ltYm9sQWZ0ZXJDb21wbGVtZW50OiBzdHJpbmc7XG4gIGRpc3BsYXllZFRleHRTdWZmaXg6IHN0cmluZztcblxuICAvLyBpbnRlcm5hbCBsaW5rIGNvbXBsZW1lbnRcbiAgZW5hYmxlSW50ZXJuYWxMaW5rQ29tcGxlbWVudDogYm9vbGVhbjtcbiAgc3VnZ2VzdEludGVybmFsTGlua1dpdGhBbGlhczogYm9vbGVhbjtcbiAgZXhjbHVkZUludGVybmFsTGlua1BhdGhQcmVmaXhQYXR0ZXJuczogc3RyaW5nO1xuXG4gIC8vIGZyb250IG1hdHRlciBjb21wbGVtZW50XG4gIGVuYWJsZUZyb250TWF0dGVyQ29tcGxlbWVudDogYm9vbGVhbjtcbiAgZnJvbnRNYXR0ZXJDb21wbGVtZW50TWF0Y2hTdHJhdGVneTogc3RyaW5nO1xuICBpbnNlcnRDb21tYUFmdGVyRnJvbnRNYXR0ZXJDb21wbGV0aW9uOiBib29sZWFuO1xuXG4gIC8vIGRlYnVnXG4gIHNob3dMb2dBYm91dFBlcmZvcm1hbmNlSW5Db25zb2xlOiBib29sZWFuO1xuXG4gIC8vIG90aGVyc1xuICBzZWxlY3Rpb25IaXN0b3J5VHJlZTogU2VsZWN0aW9uSGlzdG9yeVRyZWU7XG59XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX1NFVFRJTkdTOiBTZXR0aW5ncyA9IHtcbiAgLy8gZ2VuZXJhbFxuICBzdHJhdGVneTogXCJkZWZhdWx0XCIsXG4gIG1hdGNoU3RyYXRlZ3k6IFwicHJlZml4XCIsXG5cbiAgbWF4TnVtYmVyT2ZTdWdnZXN0aW9uczogNSxcbiAgbWF4TnVtYmVyT2ZXb3Jkc0FzUGhyYXNlOiAzLFxuICBtaW5OdW1iZXJPZkNoYXJhY3RlcnNUcmlnZ2VyZWQ6IDAsXG4gIG1pbk51bWJlck9mV29yZHNUcmlnZ2VyZWRQaHJhc2U6IDEsXG4gIGNvbXBsZW1lbnRBdXRvbWF0aWNhbGx5OiB0cnVlLFxuICBkZWxheU1pbGxpU2Vjb25kczogMCxcbiAgZGlzYWJsZVN1Z2dlc3Rpb25zRHVyaW5nSW1lT246IGZhbHNlLFxuICBpbnNlcnRBZnRlckNvbXBsZXRpb246IHRydWUsXG4gIGZpcnN0Q2hhcmFjdGVyc0Rpc2FibGVTdWdnZXN0aW9uczogXCI6L15cIixcblxuICAvLyBhcHBlYXJhbmNlXG4gIHNob3dNYXRjaFN0cmF0ZWd5OiB0cnVlLFxuICBzaG93SW5kZXhpbmdTdGF0dXM6IHRydWUsXG4gIGRlc2NyaXB0aW9uT25TdWdnZXN0aW9uOiBcIlNob3J0XCIsXG5cbiAgLy8ga2V5IGN1c3RvbWl6YXRpb25cbiAgc2VsZWN0U3VnZ2VzdGlvbktleXM6IFwiRW50ZXJcIixcbiAgYWRkaXRpb25hbEN5Y2xlVGhyb3VnaFN1Z2dlc3Rpb25zS2V5czogXCJOb25lXCIsXG4gIG9wZW5Tb3VyY2VGaWxlS2V5OiBcIk5vbmVcIixcbiAgcHJvcGFnYXRlRXNjOiBmYWxzZSxcblxuICAvLyBjdXJyZW50IGZpbGUgY29tcGxlbWVudFxuICBlbmFibGVDdXJyZW50RmlsZUNvbXBsZW1lbnQ6IHRydWUsXG4gIG9ubHlDb21wbGVtZW50RW5nbGlzaE9uQ3VycmVudEZpbGVDb21wbGVtZW50OiBmYWxzZSxcblxuICAvLyBjdXJyZW50IHZhdWx0IGNvbXBsZW1lbnRcbiAgZW5hYmxlQ3VycmVudFZhdWx0Q29tcGxlbWVudDogZmFsc2UsXG4gIGluY2x1ZGVDdXJyZW50VmF1bHRQYXRoUHJlZml4UGF0dGVybnM6IFwiXCIsXG4gIGV4Y2x1ZGVDdXJyZW50VmF1bHRQYXRoUHJlZml4UGF0dGVybnM6IFwiXCIsXG4gIGluY2x1ZGVDdXJyZW50VmF1bHRPbmx5RmlsZXNVbmRlckN1cnJlbnREaXJlY3Rvcnk6IGZhbHNlLFxuXG4gIC8vIGN1c3RvbSBkaWN0aW9uYXJ5IGNvbXBsZW1lbnRcbiAgZW5hYmxlQ3VzdG9tRGljdGlvbmFyeUNvbXBsZW1lbnQ6IGZhbHNlLFxuICBjdXN0b21EaWN0aW9uYXJ5UGF0aHM6IGBodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vZmlyc3QyMGhvdXJzL2dvb2dsZS0xMDAwMC1lbmdsaXNoL21hc3Rlci9nb29nbGUtMTAwMDAtZW5nbGlzaC1uby1zd2VhcnMudHh0YCxcbiAgY29sdW1uRGVsaW1pdGVyOiBcIlRhYlwiLFxuICBjdXN0b21EaWN0aW9uYXJ5V29yZFJlZ2V4UGF0dGVybjogXCJcIixcbiAgZGVsaW1pdGVyVG9IaWRlU3VnZ2VzdGlvbjogXCJcIixcbiAgZGVsaW1pdGVyVG9EaXZpZGVTdWdnZXN0aW9uc0ZvckRpc3BsYXlGcm9tSW5zZXJ0aW9uOiBcIlwiLFxuICBjYXJldExvY2F0aW9uU3ltYm9sQWZ0ZXJDb21wbGVtZW50OiBcIlwiLFxuICBkaXNwbGF5ZWRUZXh0U3VmZml4OiBcIiA9PiAuLi5cIixcblxuICAvLyBpbnRlcm5hbCBsaW5rIGNvbXBsZW1lbnRcbiAgZW5hYmxlSW50ZXJuYWxMaW5rQ29tcGxlbWVudDogdHJ1ZSxcbiAgc3VnZ2VzdEludGVybmFsTGlua1dpdGhBbGlhczogZmFsc2UsXG4gIGV4Y2x1ZGVJbnRlcm5hbExpbmtQYXRoUHJlZml4UGF0dGVybnM6IFwiXCIsXG5cbiAgLy8gZnJvbnQgbWF0dGVyIGNvbXBsZW1lbnRcbiAgZW5hYmxlRnJvbnRNYXR0ZXJDb21wbGVtZW50OiB0cnVlLFxuICBmcm9udE1hdHRlckNvbXBsZW1lbnRNYXRjaFN0cmF0ZWd5OiBcImluaGVyaXRcIixcbiAgaW5zZXJ0Q29tbWFBZnRlckZyb250TWF0dGVyQ29tcGxldGlvbjogZmFsc2UsXG5cbiAgLy8gZGVidWdcbiAgc2hvd0xvZ0Fib3V0UGVyZm9ybWFuY2VJbkNvbnNvbGU6IGZhbHNlLFxuXG4gIC8vIG90aGVyc1xuICBzZWxlY3Rpb25IaXN0b3J5VHJlZToge30sXG59O1xuXG5leHBvcnQgY2xhc3MgVmFyaW91c0NvbXBsZW1lbnRzU2V0dGluZ1RhYiBleHRlbmRzIFBsdWdpblNldHRpbmdUYWIge1xuICBwbHVnaW46IFZhcmlvdXNDb21wb25lbnRzO1xuXG4gIGNvbnN0cnVjdG9yKGFwcDogQXBwLCBwbHVnaW46IFZhcmlvdXNDb21wb25lbnRzKSB7XG4gICAgc3VwZXIoYXBwLCBwbHVnaW4pO1xuICAgIHRoaXMucGx1Z2luID0gcGx1Z2luO1xuICB9XG5cbiAgZGlzcGxheSgpOiB2b2lkIHtcbiAgICBsZXQgeyBjb250YWluZXJFbCB9ID0gdGhpcztcblxuICAgIGNvbnRhaW5lckVsLmVtcHR5KCk7XG5cbiAgICBjb250YWluZXJFbC5jcmVhdGVFbChcImgyXCIsIHsgdGV4dDogXCJWYXJpb3VzIENvbXBsZW1lbnRzIC0gU2V0dGluZ3NcIiB9KTtcbiAgICB0aGlzLmFkZE1haW5TZXR0aW5ncyhjb250YWluZXJFbCk7XG4gICAgdGhpcy5hZGRBcHBlYXJhbmNlU2V0dGluZ3MoY29udGFpbmVyRWwpO1xuICAgIHRoaXMuYWRkS2V5Q3VzdG9taXphdGlvblNldHRpbmdzKGNvbnRhaW5lckVsKTtcbiAgICB0aGlzLmFkZEN1cnJlbnRGaWxlQ29tcGxlbWVudFNldHRpbmdzKGNvbnRhaW5lckVsKTtcbiAgICB0aGlzLmFkZEN1cnJlbnRWYXVsdENvbXBsZW1lbnRTZXR0aW5ncyhjb250YWluZXJFbCk7XG4gICAgdGhpcy5hZGRDdXN0b21EaWN0aW9uYXJ5Q29tcGxlbWVudFNldHRpbmdzKGNvbnRhaW5lckVsKTtcbiAgICB0aGlzLmFkZEludGVybmFsTGlua0NvbXBsZW1lbnRTZXR0aW5ncyhjb250YWluZXJFbCk7XG4gICAgdGhpcy5hZGRGcm9udE1hdHRlckNvbXBsZW1lbnRTZXR0aW5ncyhjb250YWluZXJFbCk7XG4gICAgdGhpcy5hZGREZWJ1Z1NldHRpbmdzKGNvbnRhaW5lckVsKTtcbiAgfVxuXG4gIHByaXZhdGUgYWRkTWFpblNldHRpbmdzKGNvbnRhaW5lckVsOiBIVE1MRWxlbWVudCkge1xuICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKFwiaDNcIiwgeyB0ZXh0OiBcIk1haW5cIiB9KTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKS5zZXROYW1lKFwiU3RyYXRlZ3lcIikuYWRkRHJvcGRvd24oKHRjKSA9PlxuICAgICAgdGNcbiAgICAgICAgLmFkZE9wdGlvbnMobWlycm9yTWFwKFRva2VuaXplU3RyYXRlZ3kudmFsdWVzKCksICh4KSA9PiB4Lm5hbWUpKVxuICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3Muc3RyYXRlZ3kpXG4gICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5zdHJhdGVneSA9IHZhbHVlO1xuICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncyh7XG4gICAgICAgICAgICBjdXJyZW50RmlsZTogdHJ1ZSxcbiAgICAgICAgICAgIGN1cnJlbnRWYXVsdDogdHJ1ZSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSlcbiAgICApO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpLnNldE5hbWUoXCJNYXRjaCBzdHJhdGVneVwiKS5hZGREcm9wZG93bigodGMpID0+XG4gICAgICB0Y1xuICAgICAgICAuYWRkT3B0aW9ucyhtaXJyb3JNYXAoTWF0Y2hTdHJhdGVneS52YWx1ZXMoKSwgKHgpID0+IHgubmFtZSkpXG4gICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5tYXRjaFN0cmF0ZWd5KVxuICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MubWF0Y2hTdHJhdGVneSA9IHZhbHVlO1xuICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgIHRoaXMuZGlzcGxheSgpO1xuICAgICAgICB9KVxuICAgICk7XG4gICAgaWYgKHRoaXMucGx1Z2luLnNldHRpbmdzLm1hdGNoU3RyYXRlZ3kgPT09IE1hdGNoU3RyYXRlZ3kuUEFSVElBTC5uYW1lKSB7XG4gICAgICBjb250YWluZXJFbC5jcmVhdGVFbChcImRpdlwiLCB7XG4gICAgICAgIHRleHQ6IFwi4pqgIGBwYXJ0aWFsYCBpcyBtb3JlIHRoYW4gMTAgdGltZXMgc2xvd2VyIHRoYW4gYHByZWZpeGBcIixcbiAgICAgICAgY2xzOiBcInZhcmlvdXMtY29tcGxlbWVudHNfX3NldHRpbmdzX193YXJuaW5nXCIsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiTWF4IG51bWJlciBvZiBzdWdnZXN0aW9uc1wiKVxuICAgICAgLmFkZFNsaWRlcigoc2MpID0+XG4gICAgICAgIHNjXG4gICAgICAgICAgLnNldExpbWl0cygxLCAyNTUsIDEpXG4gICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLm1heE51bWJlck9mU3VnZ2VzdGlvbnMpXG4gICAgICAgICAgLnNldER5bmFtaWNUb29sdGlwKClcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5tYXhOdW1iZXJPZlN1Z2dlc3Rpb25zID0gdmFsdWU7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICB9KVxuICAgICAgKTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJNYXggbnVtYmVyIG9mIHdvcmRzIGFzIGEgcGhyYXNlXCIpXG4gICAgICAuc2V0RGVzYyhgW+KaoFdhcm5pbmddIEl0IG1ha2VzIHNsb3dlciBtb3JlIHRoYW4gTiB0aW1lcyAoTiBpcyBzZXQgdmFsdWUpYClcbiAgICAgIC5hZGRTbGlkZXIoKHNjKSA9PlxuICAgICAgICBzY1xuICAgICAgICAgIC5zZXRMaW1pdHMoMSwgMTAsIDEpXG4gICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLm1heE51bWJlck9mV29yZHNBc1BocmFzZSlcbiAgICAgICAgICAuc2V0RHluYW1pY1Rvb2x0aXAoKVxuICAgICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLm1heE51bWJlck9mV29yZHNBc1BocmFzZSA9IHZhbHVlO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgfSlcbiAgICAgICk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiTWluIG51bWJlciBvZiBjaGFyYWN0ZXJzIGZvciB0cmlnZ2VyXCIpXG4gICAgICAuc2V0RGVzYyhcIkl0IHVzZXMgYSBkZWZhdWx0IHZhbHVlIG9mIFN0cmF0ZWd5IGlmIHNldCAwLlwiKVxuICAgICAgLmFkZFNsaWRlcigoc2MpID0+XG4gICAgICAgIHNjXG4gICAgICAgICAgLnNldExpbWl0cygwLCAxMCwgMSlcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MubWluTnVtYmVyT2ZDaGFyYWN0ZXJzVHJpZ2dlcmVkKVxuICAgICAgICAgIC5zZXREeW5hbWljVG9vbHRpcCgpXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MubWluTnVtYmVyT2ZDaGFyYWN0ZXJzVHJpZ2dlcmVkID0gdmFsdWU7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICB9KVxuICAgICAgKTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJNaW4gbnVtYmVyIG9mIHdvcmRzIGZvciB0cmlnZ2VyXCIpXG4gICAgICAuYWRkU2xpZGVyKChzYykgPT5cbiAgICAgICAgc2NcbiAgICAgICAgICAuc2V0TGltaXRzKDEsIDEwLCAxKVxuICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5taW5OdW1iZXJPZldvcmRzVHJpZ2dlcmVkUGhyYXNlKVxuICAgICAgICAgIC5zZXREeW5hbWljVG9vbHRpcCgpXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MubWluTnVtYmVyT2ZXb3Jkc1RyaWdnZXJlZFBocmFzZSA9IHZhbHVlO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgfSlcbiAgICAgICk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiQ29tcGxlbWVudCBhdXRvbWF0aWNhbGx5XCIpXG4gICAgICAuYWRkVG9nZ2xlKCh0YykgPT4ge1xuICAgICAgICB0Yy5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5jb21wbGVtZW50QXV0b21hdGljYWxseSkub25DaGFuZ2UoXG4gICAgICAgICAgYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5jb21wbGVtZW50QXV0b21hdGljYWxseSA9IHZhbHVlO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgfSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiRGVsYXkgbWlsbGktc2Vjb25kcyBmb3IgdHJpZ2dlclwiKVxuICAgICAgLmFkZFNsaWRlcigoc2MpID0+XG4gICAgICAgIHNjXG4gICAgICAgICAgLnNldExpbWl0cygwLCAxMDAwLCAxMClcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MuZGVsYXlNaWxsaVNlY29uZHMpXG4gICAgICAgICAgLnNldER5bmFtaWNUb29sdGlwKClcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5kZWxheU1pbGxpU2Vjb25kcyA9IHZhbHVlO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgfSlcbiAgICAgICk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiRGlzYWJsZSBzdWdnZXN0aW9ucyBkdXJpbmcgSU1FIG9uXCIpXG4gICAgICAuYWRkVG9nZ2xlKCh0YykgPT4ge1xuICAgICAgICB0Yy5zZXRWYWx1ZShcbiAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5kaXNhYmxlU3VnZ2VzdGlvbnNEdXJpbmdJbWVPblxuICAgICAgICApLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmRpc2FibGVTdWdnZXN0aW9uc0R1cmluZ0ltZU9uID0gdmFsdWU7XG4gICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiSW5zZXJ0IHNwYWNlIGFmdGVyIGNvbXBsZXRpb25cIilcbiAgICAgIC5hZGRUb2dnbGUoKHRjKSA9PiB7XG4gICAgICAgIHRjLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLmluc2VydEFmdGVyQ29tcGxldGlvbikub25DaGFuZ2UoXG4gICAgICAgICAgYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5pbnNlcnRBZnRlckNvbXBsZXRpb24gPSB2YWx1ZTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgIH0pO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIkZpcnN0IGNoYXJhY3RlcnMgdG8gZGlzYWJsZSBzdWdnZXN0aW9uc1wiKVxuICAgICAgLmFkZFRleHQoKGNiKSA9PiB7XG4gICAgICAgIGNiLnNldFZhbHVlKFxuICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmZpcnN0Q2hhcmFjdGVyc0Rpc2FibGVTdWdnZXN0aW9uc1xuICAgICAgICApLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmZpcnN0Q2hhcmFjdGVyc0Rpc2FibGVTdWdnZXN0aW9ucyA9IHZhbHVlO1xuICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBhZGRBcHBlYXJhbmNlU2V0dGluZ3MoY29udGFpbmVyRWw6IEhUTUxFbGVtZW50KSB7XG4gICAgY29udGFpbmVyRWwuY3JlYXRlRWwoXCJoM1wiLCB7IHRleHQ6IFwiQXBwZWFyYW5jZVwiIH0pO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIlNob3cgTWF0Y2ggc3RyYXRlZ3lcIilcbiAgICAgIC5zZXREZXNjKFxuICAgICAgICBcIlNob3cgTWF0Y2ggc3RyYXRlZ3kgYXQgdGhlIHN0YXR1cyBiYXIuIENoYW5naW5nIHRoaXMgb3B0aW9uIHJlcXVpcmVzIGEgcmVzdGFydCB0byB0YWtlIGVmZmVjdC5cIlxuICAgICAgKVxuICAgICAgLmFkZFRvZ2dsZSgodGMpID0+IHtcbiAgICAgICAgdGMuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3Muc2hvd01hdGNoU3RyYXRlZ3kpLm9uQ2hhbmdlKFxuICAgICAgICAgIGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3Muc2hvd01hdGNoU3RyYXRlZ3kgPSB2YWx1ZTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgIH0pO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIlNob3cgSW5kZXhpbmcgc3RhdHVzXCIpXG4gICAgICAuc2V0RGVzYyhcbiAgICAgICAgXCJTaG93IGluZGV4aW5nIHN0YXR1cyBhdCB0aGUgc3RhdHVzIGJhci4gQ2hhbmdpbmcgdGhpcyBvcHRpb24gcmVxdWlyZXMgYSByZXN0YXJ0IHRvIHRha2UgZWZmZWN0LlwiXG4gICAgICApXG4gICAgICAuYWRkVG9nZ2xlKCh0YykgPT4ge1xuICAgICAgICB0Yy5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5zaG93SW5kZXhpbmdTdGF0dXMpLm9uQ2hhbmdlKFxuICAgICAgICAgIGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3Muc2hvd0luZGV4aW5nU3RhdHVzID0gdmFsdWU7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgICB9KTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJEZXNjcmlwdGlvbiBvbiBhIHN1Z2dlc3Rpb25cIilcbiAgICAgIC5hZGREcm9wZG93bigodGMpID0+XG4gICAgICAgIHRjXG4gICAgICAgICAgLmFkZE9wdGlvbnMoXG4gICAgICAgICAgICBtaXJyb3JNYXAoRGVzY3JpcHRpb25PblN1Z2dlc3Rpb24udmFsdWVzKCksICh4KSA9PiB4Lm5hbWUpXG4gICAgICAgICAgKVxuICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5kZXNjcmlwdGlvbk9uU3VnZ2VzdGlvbilcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5kZXNjcmlwdGlvbk9uU3VnZ2VzdGlvbiA9IHZhbHVlO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgfSlcbiAgICAgICk7XG4gIH1cblxuICBwcml2YXRlIGFkZEtleUN1c3RvbWl6YXRpb25TZXR0aW5ncyhjb250YWluZXJFbDogSFRNTEVsZW1lbnQpIHtcbiAgICBjb250YWluZXJFbC5jcmVhdGVFbChcImgzXCIsIHsgdGV4dDogXCJLZXkgY3VzdG9taXphdGlvblwiIH0pO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIlNlbGVjdCBhIHN1Z2dlc3Rpb24ga2V5XCIpXG4gICAgICAuYWRkRHJvcGRvd24oKHRjKSA9PlxuICAgICAgICB0Y1xuICAgICAgICAgIC5hZGRPcHRpb25zKG1pcnJvck1hcChTZWxlY3RTdWdnZXN0aW9uS2V5LnZhbHVlcygpLCAoeCkgPT4geC5uYW1lKSlcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3Muc2VsZWN0U3VnZ2VzdGlvbktleXMpXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3Muc2VsZWN0U3VnZ2VzdGlvbktleXMgPSB2YWx1ZTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgIH0pXG4gICAgICApO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIkFkZGl0aW9uYWwgY3ljbGUgdGhyb3VnaCBzdWdnZXN0aW9ucyBrZXlzXCIpXG4gICAgICAuYWRkRHJvcGRvd24oKHRjKSA9PlxuICAgICAgICB0Y1xuICAgICAgICAgIC5hZGRPcHRpb25zKFxuICAgICAgICAgICAgbWlycm9yTWFwKEN5Y2xlVGhyb3VnaFN1Z2dlc3Rpb25zS2V5cy52YWx1ZXMoKSwgKHgpID0+IHgubmFtZSlcbiAgICAgICAgICApXG4gICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLmFkZGl0aW9uYWxDeWNsZVRocm91Z2hTdWdnZXN0aW9uc0tleXMpXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuYWRkaXRpb25hbEN5Y2xlVGhyb3VnaFN1Z2dlc3Rpb25zS2V5cyA9IHZhbHVlO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgfSlcbiAgICAgICk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbCkuc2V0TmFtZShcIk9wZW4gc291cmNlIGZpbGUga2V5XCIpLmFkZERyb3Bkb3duKCh0YykgPT5cbiAgICAgIHRjXG4gICAgICAgIC5hZGRPcHRpb25zKG1pcnJvck1hcChPcGVuU291cmNlRmlsZUtleXMudmFsdWVzKCksICh4KSA9PiB4Lm5hbWUpKVxuICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3Mub3BlblNvdXJjZUZpbGVLZXkpXG4gICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5vcGVuU291cmNlRmlsZUtleSA9IHZhbHVlO1xuICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICB9KVxuICAgICk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiUHJvcGFnYXRlIEVTQ1wiKVxuICAgICAgLnNldERlc2MoXG4gICAgICAgIFwiSXQgaXMgaGFuZHkgaWYgeW91IHVzZSBWaW0gbW9kZSBiZWNhdXNlIHlvdSBjYW4gc3dpdGNoIHRvIE5vcm1hbCBtb2RlIGJ5IG9uZSBFU0MsIHdoZXRoZXIgaXQgc2hvd3Mgc3VnZ2VzdGlvbnMgb3Igbm90LlwiXG4gICAgICApXG4gICAgICAuYWRkVG9nZ2xlKCh0YykgPT4ge1xuICAgICAgICB0Yy5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5wcm9wYWdhdGVFc2MpLm9uQ2hhbmdlKFxuICAgICAgICAgIGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MucHJvcGFnYXRlRXNjID0gdmFsdWU7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgYWRkQ3VycmVudEZpbGVDb21wbGVtZW50U2V0dGluZ3MoY29udGFpbmVyRWw6IEhUTUxFbGVtZW50KSB7XG4gICAgY29udGFpbmVyRWwuY3JlYXRlRWwoXCJoM1wiLCB7XG4gICAgICB0ZXh0OiBcIkN1cnJlbnQgZmlsZSBjb21wbGVtZW50XCIsXG4gICAgICBjbHM6IFwidmFyaW91cy1jb21wbGVtZW50c19fc2V0dGluZ3NfX2hlYWRlciB2YXJpb3VzLWNvbXBsZW1lbnRzX19zZXR0aW5nc19faGVhZGVyX19jdXJyZW50LWZpbGVcIixcbiAgICB9KTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJFbmFibGUgQ3VycmVudCBmaWxlIGNvbXBsZW1lbnRcIilcbiAgICAgIC5hZGRUb2dnbGUoKHRjKSA9PiB7XG4gICAgICAgIHRjLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLmVuYWJsZUN1cnJlbnRGaWxlQ29tcGxlbWVudCkub25DaGFuZ2UoXG4gICAgICAgICAgYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5lbmFibGVDdXJyZW50RmlsZUNvbXBsZW1lbnQgPSB2YWx1ZTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncyh7IGN1cnJlbnRGaWxlOiB0cnVlIH0pO1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgfSk7XG5cbiAgICBpZiAodGhpcy5wbHVnaW4uc2V0dGluZ3MuZW5hYmxlQ3VycmVudEZpbGVDb21wbGVtZW50KSB7XG4gICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgLnNldE5hbWUoXCJPbmx5IGNvbXBsZW1lbnQgRW5nbGlzaCBvbiBjdXJyZW50IGZpbGUgY29tcGxlbWVudFwiKVxuICAgICAgICAuYWRkVG9nZ2xlKCh0YykgPT4ge1xuICAgICAgICAgIHRjLnNldFZhbHVlKFxuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3Mub25seUNvbXBsZW1lbnRFbmdsaXNoT25DdXJyZW50RmlsZUNvbXBsZW1lbnRcbiAgICAgICAgICApLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3Mub25seUNvbXBsZW1lbnRFbmdsaXNoT25DdXJyZW50RmlsZUNvbXBsZW1lbnQgPVxuICAgICAgICAgICAgICB2YWx1ZTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncyh7IGN1cnJlbnRGaWxlOiB0cnVlIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFkZEN1cnJlbnRWYXVsdENvbXBsZW1lbnRTZXR0aW5ncyhjb250YWluZXJFbDogSFRNTEVsZW1lbnQpIHtcbiAgICBjb250YWluZXJFbC5jcmVhdGVFbChcImgzXCIsIHtcbiAgICAgIHRleHQ6IFwiQ3VycmVudCB2YXVsdCBjb21wbGVtZW50XCIsXG4gICAgICBjbHM6IFwidmFyaW91cy1jb21wbGVtZW50c19fc2V0dGluZ3NfX2hlYWRlciB2YXJpb3VzLWNvbXBsZW1lbnRzX19zZXR0aW5nc19faGVhZGVyX19jdXJyZW50LXZhdWx0XCIsXG4gICAgfSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiRW5hYmxlIEN1cnJlbnQgdmF1bHQgY29tcGxlbWVudFwiKVxuICAgICAgLmFkZFRvZ2dsZSgodGMpID0+IHtcbiAgICAgICAgdGMuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MuZW5hYmxlQ3VycmVudFZhdWx0Q29tcGxlbWVudCkub25DaGFuZ2UoXG4gICAgICAgICAgYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5lbmFibGVDdXJyZW50VmF1bHRDb21wbGVtZW50ID0gdmFsdWU7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoeyBjdXJyZW50VmF1bHQ6IHRydWUgfSk7XG4gICAgICAgICAgICB0aGlzLmRpc3BsYXkoKTtcbiAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgICB9KTtcblxuICAgIGlmICh0aGlzLnBsdWdpbi5zZXR0aW5ncy5lbmFibGVDdXJyZW50VmF1bHRDb21wbGVtZW50KSB7XG4gICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgLnNldE5hbWUoXCJJbmNsdWRlIHByZWZpeCBwYXRoIHBhdHRlcm5zXCIpXG4gICAgICAgIC5zZXREZXNjKFwiUHJlZml4IG1hdGNoIHBhdGggcGF0dGVybnMgdG8gaW5jbHVkZSBmaWxlcy5cIilcbiAgICAgICAgLmFkZFRleHRBcmVhKCh0YWMpID0+IHtcbiAgICAgICAgICBjb25zdCBlbCA9IHRhY1xuICAgICAgICAgICAgLnNldFZhbHVlKFxuICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5pbmNsdWRlQ3VycmVudFZhdWx0UGF0aFByZWZpeFBhdHRlcm5zXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAuc2V0UGxhY2Vob2xkZXIoXCJQcml2YXRlL1wiKVxuICAgICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5pbmNsdWRlQ3VycmVudFZhdWx0UGF0aFByZWZpeFBhdHRlcm5zID1cbiAgICAgICAgICAgICAgICB2YWx1ZTtcbiAgICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICBlbC5pbnB1dEVsLmNsYXNzTmFtZSA9XG4gICAgICAgICAgICBcInZhcmlvdXMtY29tcGxlbWVudHNfX3NldHRpbmdzX190ZXh0LWFyZWEtcGF0aFwiO1xuICAgICAgICAgIHJldHVybiBlbDtcbiAgICAgICAgfSk7XG4gICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgLnNldE5hbWUoXCJFeGNsdWRlIHByZWZpeCBwYXRoIHBhdHRlcm5zXCIpXG4gICAgICAgIC5zZXREZXNjKFwiUHJlZml4IG1hdGNoIHBhdGggcGF0dGVybnMgdG8gZXhjbHVkZSBmaWxlcy5cIilcbiAgICAgICAgLmFkZFRleHRBcmVhKCh0YWMpID0+IHtcbiAgICAgICAgICBjb25zdCBlbCA9IHRhY1xuICAgICAgICAgICAgLnNldFZhbHVlKFxuICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5leGNsdWRlQ3VycmVudFZhdWx0UGF0aFByZWZpeFBhdHRlcm5zXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAuc2V0UGxhY2Vob2xkZXIoXCJQcml2YXRlL1wiKVxuICAgICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5leGNsdWRlQ3VycmVudFZhdWx0UGF0aFByZWZpeFBhdHRlcm5zID1cbiAgICAgICAgICAgICAgICB2YWx1ZTtcbiAgICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICBlbC5pbnB1dEVsLmNsYXNzTmFtZSA9XG4gICAgICAgICAgICBcInZhcmlvdXMtY29tcGxlbWVudHNfX3NldHRpbmdzX190ZXh0LWFyZWEtcGF0aFwiO1xuICAgICAgICAgIHJldHVybiBlbDtcbiAgICAgICAgfSk7XG4gICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgLnNldE5hbWUoXCJJbmNsdWRlIG9ubHkgZmlsZXMgdW5kZXIgY3VycmVudCBkaXJlY3RvcnlcIilcbiAgICAgICAgLmFkZFRvZ2dsZSgodGMpID0+IHtcbiAgICAgICAgICB0Yy5zZXRWYWx1ZShcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzXG4gICAgICAgICAgICAgIC5pbmNsdWRlQ3VycmVudFZhdWx0T25seUZpbGVzVW5kZXJDdXJyZW50RGlyZWN0b3J5XG4gICAgICAgICAgKS5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmluY2x1ZGVDdXJyZW50VmF1bHRPbmx5RmlsZXNVbmRlckN1cnJlbnREaXJlY3RvcnkgPVxuICAgICAgICAgICAgICB2YWx1ZTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFkZEN1c3RvbURpY3Rpb25hcnlDb21wbGVtZW50U2V0dGluZ3MoY29udGFpbmVyRWw6IEhUTUxFbGVtZW50KSB7XG4gICAgY29udGFpbmVyRWwuY3JlYXRlRWwoXCJoM1wiLCB7XG4gICAgICB0ZXh0OiBcIkN1c3RvbSBkaWN0aW9uYXJ5IGNvbXBsZW1lbnRcIixcbiAgICAgIGNsczogXCJ2YXJpb3VzLWNvbXBsZW1lbnRzX19zZXR0aW5nc19faGVhZGVyIHZhcmlvdXMtY29tcGxlbWVudHNfX3NldHRpbmdzX19oZWFkZXJfX2N1c3RvbS1kaWN0aW9uYXJ5XCIsXG4gICAgfSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiRW5hYmxlIEN1c3RvbSBkaWN0aW9uYXJ5IGNvbXBsZW1lbnRcIilcbiAgICAgIC5hZGRUb2dnbGUoKHRjKSA9PiB7XG4gICAgICAgIHRjLnNldFZhbHVlKFxuICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmVuYWJsZUN1c3RvbURpY3Rpb25hcnlDb21wbGVtZW50XG4gICAgICAgICkub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuZW5hYmxlQ3VzdG9tRGljdGlvbmFyeUNvbXBsZW1lbnQgPSB2YWx1ZTtcbiAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoeyBjdXN0b21EaWN0aW9uYXJ5OiB0cnVlIH0pO1xuICAgICAgICAgIHRoaXMuZGlzcGxheSgpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgaWYgKHRoaXMucGx1Z2luLnNldHRpbmdzLmVuYWJsZUN1c3RvbURpY3Rpb25hcnlDb21wbGVtZW50KSB7XG4gICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgLnNldE5hbWUoXCJDdXN0b20gZGljdGlvbmFyeSBwYXRoc1wiKVxuICAgICAgICAuc2V0RGVzYyhcbiAgICAgICAgICBcIlNwZWNpZnkgZWl0aGVyIGEgcmVsYXRpdmUgcGF0aCBmcm9tIFZhdWx0IHJvb3Qgb3IgVVJMIGZvciBlYWNoIGxpbmUuXCJcbiAgICAgICAgKVxuICAgICAgICAuYWRkVGV4dEFyZWEoKHRhYykgPT4ge1xuICAgICAgICAgIGNvbnN0IGVsID0gdGFjXG4gICAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MuY3VzdG9tRGljdGlvbmFyeVBhdGhzKVxuICAgICAgICAgICAgLnNldFBsYWNlaG9sZGVyKFwiZGljdGlvbmFyeS5tZFwiKVxuICAgICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5jdXN0b21EaWN0aW9uYXJ5UGF0aHMgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICBlbC5pbnB1dEVsLmNsYXNzTmFtZSA9XG4gICAgICAgICAgICBcInZhcmlvdXMtY29tcGxlbWVudHNfX3NldHRpbmdzX190ZXh0LWFyZWEtcGF0aFwiO1xuICAgICAgICAgIHJldHVybiBlbDtcbiAgICAgICAgfSk7XG5cbiAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKS5zZXROYW1lKFwiQ29sdW1uIGRlbGltaXRlclwiKS5hZGREcm9wZG93bigodGMpID0+XG4gICAgICAgIHRjXG4gICAgICAgICAgLmFkZE9wdGlvbnMobWlycm9yTWFwKENvbHVtbkRlbGltaXRlci52YWx1ZXMoKSwgKHgpID0+IHgubmFtZSkpXG4gICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLmNvbHVtbkRlbGltaXRlcilcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5jb2x1bW5EZWxpbWl0ZXIgPSB2YWx1ZTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgIH0pXG4gICAgICApO1xuXG4gICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgLnNldE5hbWUoXCJXb3JkIHJlZ2V4IHBhdHRlcm5cIilcbiAgICAgICAgLnNldERlc2MoXCJPbmx5IGxvYWQgd29yZHMgdGhhdCBtYXRjaCB0aGUgcmVndWxhciBleHByZXNzaW9uIHBhdHRlcm4uXCIpXG4gICAgICAgIC5hZGRUZXh0KChjYikgPT4ge1xuICAgICAgICAgIGNiLnNldFZhbHVlKFxuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuY3VzdG9tRGljdGlvbmFyeVdvcmRSZWdleFBhdHRlcm5cbiAgICAgICAgICApLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuY3VzdG9tRGljdGlvbmFyeVdvcmRSZWdleFBhdHRlcm4gPSB2YWx1ZTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAgIC5zZXROYW1lKFwiRGVsaW1pdGVyIHRvIGhpZGUgYSBzdWdnZXN0aW9uXCIpXG4gICAgICAgIC5zZXREZXNjKFxuICAgICAgICAgIFwiSWYgc2V0ICc7OzsnLCAnYWJjZDs7O2VmZycgaXMgc2hvd24gYXMgJ2FiY2QnIG9uIHN1Z2dlc3Rpb25zLCBidXQgY29tcGxldGVzIHRvICdhYmNkZWZnJy5cIlxuICAgICAgICApXG4gICAgICAgIC5hZGRUZXh0KChjYikgPT4ge1xuICAgICAgICAgIGNiLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLmRlbGltaXRlclRvSGlkZVN1Z2dlc3Rpb24pLm9uQ2hhbmdlKFxuICAgICAgICAgICAgYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmRlbGltaXRlclRvSGlkZVN1Z2dlc3Rpb24gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgKTtcbiAgICAgICAgfSk7XG5cbiAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAuc2V0TmFtZShcbiAgICAgICAgICBcIkRlbGltaXRlciB0byBkaXZpZGUgc3VnZ2VzdGlvbnMgZm9yIGRpc3BsYXkgZnJvbSBvbmVzIGZvciBpbnNlcnRpb25cIlxuICAgICAgICApXG4gICAgICAgIC5zZXREZXNjKFxuICAgICAgICAgIFwiSWYgc2V0ICcgPj4+ICcsICdkaXNwbGF5ZWQgPj4+IGluc2VydGVkJyBpcyBzaG93biBhcyAnZGlzcGxheWVkJyBvbiBzdWdnZXN0aW9ucywgYnV0IGNvbXBsZXRlcyB0byAnaW5zZXJ0ZWQnLlwiXG4gICAgICAgIClcbiAgICAgICAgLmFkZFRleHQoKGNiKSA9PiB7XG4gICAgICAgICAgY2Iuc2V0VmFsdWUoXG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5nc1xuICAgICAgICAgICAgICAuZGVsaW1pdGVyVG9EaXZpZGVTdWdnZXN0aW9uc0ZvckRpc3BsYXlGcm9tSW5zZXJ0aW9uXG4gICAgICAgICAgKS5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmRlbGltaXRlclRvRGl2aWRlU3VnZ2VzdGlvbnNGb3JEaXNwbGF5RnJvbUluc2VydGlvbiA9XG4gICAgICAgICAgICAgIHZhbHVlO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgLnNldE5hbWUoXCJDYXJldCBsb2NhdGlvbiBzeW1ib2wgYWZ0ZXIgY29tcGxlbWVudFwiKVxuICAgICAgICAuc2V0RGVzYyhcbiAgICAgICAgICBcIklmIHNldCAnPENBUkVUPicgYW5kIHRoZXJlIGlzICc8bGk+PENBUkVUPjwvbGk+JyBpbiBjdXN0b20gZGljdGlvbmFyeSwgaXQgY29tcGxlbWVudHMgJzxsaT48L2xpPicgYW5kIG1vdmUgYSBjYXJldCB3aGVyZSBiZXR3ZWVuICc8bGk+JyBhbmQgYDwvbGk+YC5cIlxuICAgICAgICApXG4gICAgICAgIC5hZGRUZXh0KChjYikgPT4ge1xuICAgICAgICAgIGNiLnNldFZhbHVlKFxuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuY2FyZXRMb2NhdGlvblN5bWJvbEFmdGVyQ29tcGxlbWVudFxuICAgICAgICAgICkub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5jYXJldExvY2F0aW9uU3ltYm9sQWZ0ZXJDb21wbGVtZW50ID0gdmFsdWU7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAuc2V0TmFtZShcIkRpc3BsYXllZCB0ZXh0IHN1ZmZpeFwiKVxuICAgICAgICAuc2V0RGVzYyhcbiAgICAgICAgICBcIkl0IHNob3dzIGFzIGEgc3VmZml4IG9mIGRpc3BsYXllZCB0ZXh0IGlmIHRoZXJlIGlzIGEgZGlmZmVyZW5jZSBiZXR3ZWVuIGRpc3BsYXllZCBhbmQgaW5zZXJ0ZWRcIlxuICAgICAgICApXG4gICAgICAgIC5hZGRUZXh0KChjYikgPT4ge1xuICAgICAgICAgIGNiLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLmRpc3BsYXllZFRleHRTdWZmaXgpLm9uQ2hhbmdlKFxuICAgICAgICAgICAgYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmRpc3BsYXllZFRleHRTdWZmaXggPSB2YWx1ZTtcbiAgICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBhZGRJbnRlcm5hbExpbmtDb21wbGVtZW50U2V0dGluZ3MoY29udGFpbmVyRWw6IEhUTUxFbGVtZW50KSB7XG4gICAgY29udGFpbmVyRWwuY3JlYXRlRWwoXCJoM1wiLCB7XG4gICAgICB0ZXh0OiBcIkludGVybmFsIGxpbmsgY29tcGxlbWVudFwiLFxuICAgICAgY2xzOiBcInZhcmlvdXMtY29tcGxlbWVudHNfX3NldHRpbmdzX19oZWFkZXIgdmFyaW91cy1jb21wbGVtZW50c19fc2V0dGluZ3NfX2hlYWRlcl9faW50ZXJuYWwtbGlua1wiLFxuICAgIH0pO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIkVuYWJsZSBJbnRlcm5hbCBsaW5rIGNvbXBsZW1lbnRcIilcbiAgICAgIC5hZGRUb2dnbGUoKHRjKSA9PiB7XG4gICAgICAgIHRjLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLmVuYWJsZUludGVybmFsTGlua0NvbXBsZW1lbnQpLm9uQ2hhbmdlKFxuICAgICAgICAgIGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuZW5hYmxlSW50ZXJuYWxMaW5rQ29tcGxlbWVudCA9IHZhbHVlO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKHsgaW50ZXJuYWxMaW5rOiB0cnVlIH0pO1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgfSk7XG5cbiAgICBpZiAodGhpcy5wbHVnaW4uc2V0dGluZ3MuZW5hYmxlSW50ZXJuYWxMaW5rQ29tcGxlbWVudCkge1xuICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAgIC5zZXROYW1lKFwiU3VnZ2VzdCB3aXRoIGFuIGFsaWFzXCIpXG4gICAgICAgIC5hZGRUb2dnbGUoKHRjKSA9PiB7XG4gICAgICAgICAgdGMuc2V0VmFsdWUoXG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5zdWdnZXN0SW50ZXJuYWxMaW5rV2l0aEFsaWFzXG4gICAgICAgICAgKS5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnN1Z2dlc3RJbnRlcm5hbExpbmtXaXRoQWxpYXMgPSB2YWx1ZTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncyh7IGludGVybmFsTGluazogdHJ1ZSB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgLnNldE5hbWUoXCJFeGNsdWRlIHByZWZpeCBwYXRoIHBhdHRlcm5zXCIpXG4gICAgICAgIC5zZXREZXNjKFwiUHJlZml4IG1hdGNoIHBhdGggcGF0dGVybnMgdG8gZXhjbHVkZSBmaWxlcy5cIilcbiAgICAgICAgLmFkZFRleHRBcmVhKCh0YWMpID0+IHtcbiAgICAgICAgICBjb25zdCBlbCA9IHRhY1xuICAgICAgICAgICAgLnNldFZhbHVlKFxuICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5leGNsdWRlSW50ZXJuYWxMaW5rUGF0aFByZWZpeFBhdHRlcm5zXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAuc2V0UGxhY2Vob2xkZXIoXCJQcml2YXRlL1wiKVxuICAgICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5leGNsdWRlSW50ZXJuYWxMaW5rUGF0aFByZWZpeFBhdHRlcm5zID1cbiAgICAgICAgICAgICAgICB2YWx1ZTtcbiAgICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICBlbC5pbnB1dEVsLmNsYXNzTmFtZSA9XG4gICAgICAgICAgICBcInZhcmlvdXMtY29tcGxlbWVudHNfX3NldHRpbmdzX190ZXh0LWFyZWEtcGF0aFwiO1xuICAgICAgICAgIHJldHVybiBlbDtcbiAgICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBhZGRGcm9udE1hdHRlckNvbXBsZW1lbnRTZXR0aW5ncyhjb250YWluZXJFbDogSFRNTEVsZW1lbnQpIHtcbiAgICBjb250YWluZXJFbC5jcmVhdGVFbChcImgzXCIsIHtcbiAgICAgIHRleHQ6IFwiRnJvbnQgbWF0dGVyIGNvbXBsZW1lbnRcIixcbiAgICAgIGNsczogXCJ2YXJpb3VzLWNvbXBsZW1lbnRzX19zZXR0aW5nc19faGVhZGVyIHZhcmlvdXMtY29tcGxlbWVudHNfX3NldHRpbmdzX19oZWFkZXJfX2Zyb250LW1hdHRlclwiLFxuICAgIH0pO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIkVuYWJsZSBGcm9udCBtYXR0ZXIgY29tcGxlbWVudFwiKVxuICAgICAgLmFkZFRvZ2dsZSgodGMpID0+IHtcbiAgICAgICAgdGMuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MuZW5hYmxlRnJvbnRNYXR0ZXJDb21wbGVtZW50KS5vbkNoYW5nZShcbiAgICAgICAgICBhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmVuYWJsZUZyb250TWF0dGVyQ29tcGxlbWVudCA9IHZhbHVlO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKHsgZnJvbnRNYXR0ZXI6IHRydWUgfSk7XG4gICAgICAgICAgICB0aGlzLmRpc3BsYXkoKTtcbiAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgICB9KTtcblxuICAgIGlmICh0aGlzLnBsdWdpbi5zZXR0aW5ncy5lbmFibGVGcm9udE1hdHRlckNvbXBsZW1lbnQpIHtcbiAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAuc2V0TmFtZShcIk1hdGNoIHN0cmF0ZWd5IGluIHRoZSBmcm9udCBtYXR0ZXJcIilcbiAgICAgICAgLmFkZERyb3Bkb3duKCh0YykgPT5cbiAgICAgICAgICB0Y1xuICAgICAgICAgICAgLmFkZE9wdGlvbnMoXG4gICAgICAgICAgICAgIG1pcnJvck1hcChTcGVjaWZpY01hdGNoU3RyYXRlZ3kudmFsdWVzKCksICh4KSA9PiB4Lm5hbWUpXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MuZnJvbnRNYXR0ZXJDb21wbGVtZW50TWF0Y2hTdHJhdGVneSlcbiAgICAgICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuZnJvbnRNYXR0ZXJDb21wbGVtZW50TWF0Y2hTdHJhdGVneSA9IHZhbHVlO1xuICAgICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICk7XG5cbiAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAuc2V0TmFtZShcIkluc2VydCBjb21tYSBhZnRlciBjb21wbGV0aW9uXCIpXG4gICAgICAgIC5hZGRUb2dnbGUoKHRjKSA9PiB7XG4gICAgICAgICAgdGMuc2V0VmFsdWUoXG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5pbnNlcnRDb21tYUFmdGVyRnJvbnRNYXR0ZXJDb21wbGV0aW9uXG4gICAgICAgICAgKS5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmluc2VydENvbW1hQWZ0ZXJGcm9udE1hdHRlckNvbXBsZXRpb24gPSB2YWx1ZTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFkZERlYnVnU2V0dGluZ3MoY29udGFpbmVyRWw6IEhUTUxFbGVtZW50KSB7XG4gICAgY29udGFpbmVyRWwuY3JlYXRlRWwoXCJoM1wiLCB7IHRleHQ6IFwiRGVidWdcIiB9KTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJTaG93IGxvZyBhYm91dCBwZXJmb3JtYW5jZSBpbiBhIGNvbnNvbGVcIilcbiAgICAgIC5hZGRUb2dnbGUoKHRjKSA9PiB7XG4gICAgICAgIHRjLnNldFZhbHVlKFxuICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnNob3dMb2dBYm91dFBlcmZvcm1hbmNlSW5Db25zb2xlXG4gICAgICAgICkub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3Muc2hvd0xvZ0Fib3V0UGVyZm9ybWFuY2VJbkNvbnNvbGUgPSB2YWx1ZTtcbiAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIHRvZ2dsZU1hdGNoU3RyYXRlZ3koKSB7XG4gICAgc3dpdGNoICh0aGlzLnBsdWdpbi5zZXR0aW5ncy5tYXRjaFN0cmF0ZWd5KSB7XG4gICAgICBjYXNlIFwicHJlZml4XCI6XG4gICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLm1hdGNoU3RyYXRlZ3kgPSBcInBhcnRpYWxcIjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwicGFydGlhbFwiOlxuICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5tYXRjaFN0cmF0ZWd5ID0gXCJwcmVmaXhcIjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICAvLyBub2luc3BlY3Rpb24gT2JqZWN0QWxsb2NhdGlvbklnbm9yZWRcbiAgICAgICAgbmV3IE5vdGljZShcIuKaoFVuZXhwZWN0ZWQgZXJyb3JcIik7XG4gICAgfVxuICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICB9XG5cbiAgYXN5bmMgdG9nZ2xlQ29tcGxlbWVudEF1dG9tYXRpY2FsbHkoKSB7XG4gICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuY29tcGxlbWVudEF1dG9tYXRpY2FsbHkgPVxuICAgICAgIXRoaXMucGx1Z2luLnNldHRpbmdzLmNvbXBsZW1lbnRBdXRvbWF0aWNhbGx5O1xuICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICB9XG5cbiAgYXN5bmMgZW5zdXJlQ3VzdG9tRGljdGlvbmFyeVBhdGgoXG4gICAgcGF0aDogc3RyaW5nLFxuICAgIHN0YXRlOiBcInByZXNlbnRcIiB8IFwiYWJzZW50XCJcbiAgKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3QgcGF0aHMgPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy5jdXN0b21EaWN0aW9uYXJ5UGF0aHMuc3BsaXQoXCJcXG5cIik7XG4gICAgY29uc3QgZXhpc3RzID0gcGF0aHMuc29tZSgoeCkgPT4geCA9PT0gcGF0aCk7XG4gICAgaWYgKChleGlzdHMgJiYgc3RhdGUgPT09IFwicHJlc2VudFwiKSB8fCAoIWV4aXN0cyAmJiBzdGF0ZSA9PT0gXCJhYnNlbnRcIikpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCBuZXdQYXRocyA9XG4gICAgICBzdGF0ZSA9PT0gXCJwcmVzZW50XCIgPyBbLi4ucGF0aHMsIHBhdGhdIDogcGF0aHMuZmlsdGVyKCh4KSA9PiB4ICE9PSBwYXRoKTtcbiAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5jdXN0b21EaWN0aW9uYXJ5UGF0aHMgPSBuZXdQYXRocy5qb2luKFwiXFxuXCIpO1xuICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncyh7IGN1c3RvbURpY3Rpb25hcnk6IHRydWUgfSk7XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGdldFBsdWdpblNldHRpbmdzQXNKc29uU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KFxuICAgICAge1xuICAgICAgICB2ZXJzaW9uOiB0aGlzLnBsdWdpbi5tYW5pZmVzdC52ZXJzaW9uLFxuICAgICAgICBtb2JpbGU6ICh0aGlzLmFwcCBhcyBhbnkpLmlzTW9iaWxlLFxuICAgICAgICBzZXR0aW5nczogeyAuLi50aGlzLnBsdWdpbi5zZXR0aW5ncywgc2VsZWN0aW9uSGlzdG9yeVRyZWU6IG51bGwgfSxcbiAgICAgIH0sXG4gICAgICBudWxsLFxuICAgICAgNFxuICAgICk7XG4gIH1cbn1cbiIsImltcG9ydCB0eXBlIHsgTWF0Y2hTdHJhdGVneSB9IGZyb20gXCIuLi9wcm92aWRlci9NYXRjaFN0cmF0ZWd5XCI7XG5cbmV4cG9ydCBjbGFzcyBQcm92aWRlclN0YXR1c0JhciB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBjdXJyZW50RmlsZTogSFRNTEVsZW1lbnQgfCBudWxsLFxuICAgIHB1YmxpYyBjdXJyZW50VmF1bHQ6IEhUTUxFbGVtZW50IHwgbnVsbCxcbiAgICBwdWJsaWMgY3VzdG9tRGljdGlvbmFyeTogSFRNTEVsZW1lbnQgfCBudWxsLFxuICAgIHB1YmxpYyBpbnRlcm5hbExpbms6IEhUTUxFbGVtZW50IHwgbnVsbCxcbiAgICBwdWJsaWMgZnJvbnRNYXR0ZXI6IEhUTUxFbGVtZW50IHwgbnVsbCxcbiAgICBwdWJsaWMgbWF0Y2hTdHJhdGVneTogSFRNTEVsZW1lbnQgfCBudWxsXG4gICkge31cblxuICBzdGF0aWMgbmV3KFxuICAgIHN0YXR1c0JhcjogSFRNTEVsZW1lbnQsXG4gICAgc2hvd01hdGNoU3RyYXRlZ3k6IGJvb2xlYW4sXG4gICAgc2hvd0luZGV4aW5nU3RhdHVzOiBib29sZWFuXG4gICk6IFByb3ZpZGVyU3RhdHVzQmFyIHtcbiAgICBjb25zdCBjdXJyZW50RmlsZSA9IHNob3dJbmRleGluZ1N0YXR1c1xuICAgICAgPyBzdGF0dXNCYXIuY3JlYXRlRWwoXCJzcGFuXCIsIHtcbiAgICAgICAgICB0ZXh0OiBcIi0tLVwiLFxuICAgICAgICAgIGNsczogXCJ2YXJpb3VzLWNvbXBsZW1lbnRzX19mb290ZXIgdmFyaW91cy1jb21wbGVtZW50c19fZm9vdGVyX19jdXJyZW50LWZpbGVcIixcbiAgICAgICAgfSlcbiAgICAgIDogbnVsbDtcbiAgICBjb25zdCBjdXJyZW50VmF1bHQgPSBzaG93SW5kZXhpbmdTdGF0dXNcbiAgICAgID8gc3RhdHVzQmFyLmNyZWF0ZUVsKFwic3BhblwiLCB7XG4gICAgICAgICAgdGV4dDogXCItLS1cIixcbiAgICAgICAgICBjbHM6IFwidmFyaW91cy1jb21wbGVtZW50c19fZm9vdGVyIHZhcmlvdXMtY29tcGxlbWVudHNfX2Zvb3Rlcl9fY3VycmVudC12YXVsdFwiLFxuICAgICAgICB9KVxuICAgICAgOiBudWxsO1xuICAgIGNvbnN0IGN1c3RvbURpY3Rpb25hcnkgPSBzaG93SW5kZXhpbmdTdGF0dXNcbiAgICAgID8gc3RhdHVzQmFyLmNyZWF0ZUVsKFwic3BhblwiLCB7XG4gICAgICAgICAgdGV4dDogXCItLS1cIixcbiAgICAgICAgICBjbHM6IFwidmFyaW91cy1jb21wbGVtZW50c19fZm9vdGVyIHZhcmlvdXMtY29tcGxlbWVudHNfX2Zvb3Rlcl9fY3VzdG9tLWRpY3Rpb25hcnlcIixcbiAgICAgICAgfSlcbiAgICAgIDogbnVsbDtcbiAgICBjb25zdCBpbnRlcm5hbExpbmsgPSBzaG93SW5kZXhpbmdTdGF0dXNcbiAgICAgID8gc3RhdHVzQmFyLmNyZWF0ZUVsKFwic3BhblwiLCB7XG4gICAgICAgICAgdGV4dDogXCItLS1cIixcbiAgICAgICAgICBjbHM6IFwidmFyaW91cy1jb21wbGVtZW50c19fZm9vdGVyIHZhcmlvdXMtY29tcGxlbWVudHNfX2Zvb3Rlcl9faW50ZXJuYWwtbGlua1wiLFxuICAgICAgICB9KVxuICAgICAgOiBudWxsO1xuICAgIGNvbnN0IGZyb250TWF0dGVyID0gc2hvd0luZGV4aW5nU3RhdHVzXG4gICAgICA/IHN0YXR1c0Jhci5jcmVhdGVFbChcInNwYW5cIiwge1xuICAgICAgICAgIHRleHQ6IFwiLS0tXCIsXG4gICAgICAgICAgY2xzOiBcInZhcmlvdXMtY29tcGxlbWVudHNfX2Zvb3RlciB2YXJpb3VzLWNvbXBsZW1lbnRzX19mb290ZXJfX2Zyb250LW1hdHRlclwiLFxuICAgICAgICB9KVxuICAgICAgOiBudWxsO1xuXG4gICAgY29uc3QgbWF0Y2hTdHJhdGVneSA9IHNob3dNYXRjaFN0cmF0ZWd5XG4gICAgICA/IHN0YXR1c0Jhci5jcmVhdGVFbChcInNwYW5cIiwge1xuICAgICAgICAgIHRleHQ6IFwiLS0tXCIsXG4gICAgICAgICAgY2xzOiBcInZhcmlvdXMtY29tcGxlbWVudHNfX2Zvb3RlciB2YXJpb3VzLWNvbXBsZW1lbnRzX19mb290ZXJfX21hdGNoLXN0cmF0ZWd5XCIsXG4gICAgICAgIH0pXG4gICAgICA6IG51bGw7XG5cbiAgICByZXR1cm4gbmV3IFByb3ZpZGVyU3RhdHVzQmFyKFxuICAgICAgY3VycmVudEZpbGUsXG4gICAgICBjdXJyZW50VmF1bHQsXG4gICAgICBjdXN0b21EaWN0aW9uYXJ5LFxuICAgICAgaW50ZXJuYWxMaW5rLFxuICAgICAgZnJvbnRNYXR0ZXIsXG4gICAgICBtYXRjaFN0cmF0ZWd5XG4gICAgKTtcbiAgfVxuXG4gIHNldE9uQ2xpY2tTdHJhdGVneUxpc3RlbmVyKGxpc3RlbmVyOiAoKSA9PiB2b2lkKSB7XG4gICAgdGhpcy5tYXRjaFN0cmF0ZWd5Py5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgbGlzdGVuZXIpO1xuICB9XG5cbiAgc2V0Q3VycmVudEZpbGVEaXNhYmxlZCgpIHtcbiAgICB0aGlzLmN1cnJlbnRGaWxlPy5zZXRUZXh0KFwiLS0tXCIpO1xuICB9XG4gIHNldEN1cnJlbnRWYXVsdERpc2FibGVkKCkge1xuICAgIHRoaXMuY3VycmVudFZhdWx0Py5zZXRUZXh0KFwiLS0tXCIpO1xuICB9XG4gIHNldEN1c3RvbURpY3Rpb25hcnlEaXNhYmxlZCgpIHtcbiAgICB0aGlzLmN1c3RvbURpY3Rpb25hcnk/LnNldFRleHQoXCItLS1cIik7XG4gIH1cbiAgc2V0SW50ZXJuYWxMaW5rRGlzYWJsZWQoKSB7XG4gICAgdGhpcy5pbnRlcm5hbExpbms/LnNldFRleHQoXCItLS1cIik7XG4gIH1cbiAgc2V0RnJvbnRNYXR0ZXJEaXNhYmxlZCgpIHtcbiAgICB0aGlzLmZyb250TWF0dGVyPy5zZXRUZXh0KFwiLS0tXCIpO1xuICB9XG5cbiAgc2V0Q3VycmVudEZpbGVJbmRleGluZygpIHtcbiAgICB0aGlzLmN1cnJlbnRGaWxlPy5zZXRUZXh0KFwiaW5kZXhpbmcuLi5cIik7XG4gIH1cbiAgc2V0Q3VycmVudFZhdWx0SW5kZXhpbmcoKSB7XG4gICAgdGhpcy5jdXJyZW50VmF1bHQ/LnNldFRleHQoXCJpbmRleGluZy4uLlwiKTtcbiAgfVxuICBzZXRDdXN0b21EaWN0aW9uYXJ5SW5kZXhpbmcoKSB7XG4gICAgdGhpcy5jdXN0b21EaWN0aW9uYXJ5Py5zZXRUZXh0KFwiaW5kZXhpbmcuLi5cIik7XG4gIH1cbiAgc2V0SW50ZXJuYWxMaW5rSW5kZXhpbmcoKSB7XG4gICAgdGhpcy5pbnRlcm5hbExpbms/LnNldFRleHQoXCJpbmRleGluZy4uLlwiKTtcbiAgfVxuICBzZXRGcm9udE1hdHRlckluZGV4aW5nKCkge1xuICAgIHRoaXMuZnJvbnRNYXR0ZXI/LnNldFRleHQoXCJpbmRleGluZy4uLlwiKTtcbiAgfVxuXG4gIHNldEN1cnJlbnRGaWxlSW5kZXhlZChjb3VudDogYW55KSB7XG4gICAgdGhpcy5jdXJyZW50RmlsZT8uc2V0VGV4dChTdHJpbmcoY291bnQpKTtcbiAgfVxuICBzZXRDdXJyZW50VmF1bHRJbmRleGVkKGNvdW50OiBhbnkpIHtcbiAgICB0aGlzLmN1cnJlbnRWYXVsdD8uc2V0VGV4dChTdHJpbmcoY291bnQpKTtcbiAgfVxuICBzZXRDdXN0b21EaWN0aW9uYXJ5SW5kZXhlZChjb3VudDogYW55KSB7XG4gICAgdGhpcy5jdXN0b21EaWN0aW9uYXJ5Py5zZXRUZXh0KFN0cmluZyhjb3VudCkpO1xuICB9XG4gIHNldEludGVybmFsTGlua0luZGV4ZWQoY291bnQ6IGFueSkge1xuICAgIHRoaXMuaW50ZXJuYWxMaW5rPy5zZXRUZXh0KFN0cmluZyhjb3VudCkpO1xuICB9XG4gIHNldEZyb250TWF0dGVySW5kZXhlZChjb3VudDogYW55KSB7XG4gICAgdGhpcy5mcm9udE1hdHRlcj8uc2V0VGV4dChTdHJpbmcoY291bnQpKTtcbiAgfVxuXG4gIHNldE1hdGNoU3RyYXRlZ3koc3RyYXRlZ3k6IE1hdGNoU3RyYXRlZ3kpIHtcbiAgICB0aGlzLm1hdGNoU3RyYXRlZ3k/LnNldFRleHQoc3RyYXRlZ3kubmFtZSk7XG4gIH1cbn1cbiIsImZ1bmN0aW9uIG5vb3AoKSB7IH1cbmNvbnN0IGlkZW50aXR5ID0geCA9PiB4O1xuZnVuY3Rpb24gYXNzaWduKHRhciwgc3JjKSB7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGZvciAoY29uc3QgayBpbiBzcmMpXG4gICAgICAgIHRhcltrXSA9IHNyY1trXTtcbiAgICByZXR1cm4gdGFyO1xufVxuZnVuY3Rpb24gaXNfcHJvbWlzZSh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHR5cGVvZiB2YWx1ZS50aGVuID09PSAnZnVuY3Rpb24nO1xufVxuZnVuY3Rpb24gYWRkX2xvY2F0aW9uKGVsZW1lbnQsIGZpbGUsIGxpbmUsIGNvbHVtbiwgY2hhcikge1xuICAgIGVsZW1lbnQuX19zdmVsdGVfbWV0YSA9IHtcbiAgICAgICAgbG9jOiB7IGZpbGUsIGxpbmUsIGNvbHVtbiwgY2hhciB9XG4gICAgfTtcbn1cbmZ1bmN0aW9uIHJ1bihmbikge1xuICAgIHJldHVybiBmbigpO1xufVxuZnVuY3Rpb24gYmxhbmtfb2JqZWN0KCkge1xuICAgIHJldHVybiBPYmplY3QuY3JlYXRlKG51bGwpO1xufVxuZnVuY3Rpb24gcnVuX2FsbChmbnMpIHtcbiAgICBmbnMuZm9yRWFjaChydW4pO1xufVxuZnVuY3Rpb24gaXNfZnVuY3Rpb24odGhpbmcpIHtcbiAgICByZXR1cm4gdHlwZW9mIHRoaW5nID09PSAnZnVuY3Rpb24nO1xufVxuZnVuY3Rpb24gc2FmZV9ub3RfZXF1YWwoYSwgYikge1xuICAgIHJldHVybiBhICE9IGEgPyBiID09IGIgOiBhICE9PSBiIHx8ICgoYSAmJiB0eXBlb2YgYSA9PT0gJ29iamVjdCcpIHx8IHR5cGVvZiBhID09PSAnZnVuY3Rpb24nKTtcbn1cbmxldCBzcmNfdXJsX2VxdWFsX2FuY2hvcjtcbmZ1bmN0aW9uIHNyY191cmxfZXF1YWwoZWxlbWVudF9zcmMsIHVybCkge1xuICAgIGlmICghc3JjX3VybF9lcXVhbF9hbmNob3IpIHtcbiAgICAgICAgc3JjX3VybF9lcXVhbF9hbmNob3IgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgfVxuICAgIHNyY191cmxfZXF1YWxfYW5jaG9yLmhyZWYgPSB1cmw7XG4gICAgcmV0dXJuIGVsZW1lbnRfc3JjID09PSBzcmNfdXJsX2VxdWFsX2FuY2hvci5ocmVmO1xufVxuZnVuY3Rpb24gbm90X2VxdWFsKGEsIGIpIHtcbiAgICByZXR1cm4gYSAhPSBhID8gYiA9PSBiIDogYSAhPT0gYjtcbn1cbmZ1bmN0aW9uIGlzX2VtcHR5KG9iaikge1xuICAgIHJldHVybiBPYmplY3Qua2V5cyhvYmopLmxlbmd0aCA9PT0gMDtcbn1cbmZ1bmN0aW9uIHZhbGlkYXRlX3N0b3JlKHN0b3JlLCBuYW1lKSB7XG4gICAgaWYgKHN0b3JlICE9IG51bGwgJiYgdHlwZW9mIHN0b3JlLnN1YnNjcmliZSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCcke25hbWV9JyBpcyBub3QgYSBzdG9yZSB3aXRoIGEgJ3N1YnNjcmliZScgbWV0aG9kYCk7XG4gICAgfVxufVxuZnVuY3Rpb24gc3Vic2NyaWJlKHN0b3JlLCAuLi5jYWxsYmFja3MpIHtcbiAgICBpZiAoc3RvcmUgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gbm9vcDtcbiAgICB9XG4gICAgY29uc3QgdW5zdWIgPSBzdG9yZS5zdWJzY3JpYmUoLi4uY2FsbGJhY2tzKTtcbiAgICByZXR1cm4gdW5zdWIudW5zdWJzY3JpYmUgPyAoKSA9PiB1bnN1Yi51bnN1YnNjcmliZSgpIDogdW5zdWI7XG59XG5mdW5jdGlvbiBnZXRfc3RvcmVfdmFsdWUoc3RvcmUpIHtcbiAgICBsZXQgdmFsdWU7XG4gICAgc3Vic2NyaWJlKHN0b3JlLCBfID0+IHZhbHVlID0gXykoKTtcbiAgICByZXR1cm4gdmFsdWU7XG59XG5mdW5jdGlvbiBjb21wb25lbnRfc3Vic2NyaWJlKGNvbXBvbmVudCwgc3RvcmUsIGNhbGxiYWNrKSB7XG4gICAgY29tcG9uZW50LiQkLm9uX2Rlc3Ryb3kucHVzaChzdWJzY3JpYmUoc3RvcmUsIGNhbGxiYWNrKSk7XG59XG5mdW5jdGlvbiBjcmVhdGVfc2xvdChkZWZpbml0aW9uLCBjdHgsICQkc2NvcGUsIGZuKSB7XG4gICAgaWYgKGRlZmluaXRpb24pIHtcbiAgICAgICAgY29uc3Qgc2xvdF9jdHggPSBnZXRfc2xvdF9jb250ZXh0KGRlZmluaXRpb24sIGN0eCwgJCRzY29wZSwgZm4pO1xuICAgICAgICByZXR1cm4gZGVmaW5pdGlvblswXShzbG90X2N0eCk7XG4gICAgfVxufVxuZnVuY3Rpb24gZ2V0X3Nsb3RfY29udGV4dChkZWZpbml0aW9uLCBjdHgsICQkc2NvcGUsIGZuKSB7XG4gICAgcmV0dXJuIGRlZmluaXRpb25bMV0gJiYgZm5cbiAgICAgICAgPyBhc3NpZ24oJCRzY29wZS5jdHguc2xpY2UoKSwgZGVmaW5pdGlvblsxXShmbihjdHgpKSlcbiAgICAgICAgOiAkJHNjb3BlLmN0eDtcbn1cbmZ1bmN0aW9uIGdldF9zbG90X2NoYW5nZXMoZGVmaW5pdGlvbiwgJCRzY29wZSwgZGlydHksIGZuKSB7XG4gICAgaWYgKGRlZmluaXRpb25bMl0gJiYgZm4pIHtcbiAgICAgICAgY29uc3QgbGV0cyA9IGRlZmluaXRpb25bMl0oZm4oZGlydHkpKTtcbiAgICAgICAgaWYgKCQkc2NvcGUuZGlydHkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIGxldHM7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBsZXRzID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgY29uc3QgbWVyZ2VkID0gW107XG4gICAgICAgICAgICBjb25zdCBsZW4gPSBNYXRoLm1heCgkJHNjb3BlLmRpcnR5Lmxlbmd0aCwgbGV0cy5sZW5ndGgpO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkgKz0gMSkge1xuICAgICAgICAgICAgICAgIG1lcmdlZFtpXSA9ICQkc2NvcGUuZGlydHlbaV0gfCBsZXRzW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG1lcmdlZDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJCRzY29wZS5kaXJ0eSB8IGxldHM7XG4gICAgfVxuICAgIHJldHVybiAkJHNjb3BlLmRpcnR5O1xufVxuZnVuY3Rpb24gdXBkYXRlX3Nsb3RfYmFzZShzbG90LCBzbG90X2RlZmluaXRpb24sIGN0eCwgJCRzY29wZSwgc2xvdF9jaGFuZ2VzLCBnZXRfc2xvdF9jb250ZXh0X2ZuKSB7XG4gICAgaWYgKHNsb3RfY2hhbmdlcykge1xuICAgICAgICBjb25zdCBzbG90X2NvbnRleHQgPSBnZXRfc2xvdF9jb250ZXh0KHNsb3RfZGVmaW5pdGlvbiwgY3R4LCAkJHNjb3BlLCBnZXRfc2xvdF9jb250ZXh0X2ZuKTtcbiAgICAgICAgc2xvdC5wKHNsb3RfY29udGV4dCwgc2xvdF9jaGFuZ2VzKTtcbiAgICB9XG59XG5mdW5jdGlvbiB1cGRhdGVfc2xvdChzbG90LCBzbG90X2RlZmluaXRpb24sIGN0eCwgJCRzY29wZSwgZGlydHksIGdldF9zbG90X2NoYW5nZXNfZm4sIGdldF9zbG90X2NvbnRleHRfZm4pIHtcbiAgICBjb25zdCBzbG90X2NoYW5nZXMgPSBnZXRfc2xvdF9jaGFuZ2VzKHNsb3RfZGVmaW5pdGlvbiwgJCRzY29wZSwgZGlydHksIGdldF9zbG90X2NoYW5nZXNfZm4pO1xuICAgIHVwZGF0ZV9zbG90X2Jhc2Uoc2xvdCwgc2xvdF9kZWZpbml0aW9uLCBjdHgsICQkc2NvcGUsIHNsb3RfY2hhbmdlcywgZ2V0X3Nsb3RfY29udGV4dF9mbik7XG59XG5mdW5jdGlvbiBnZXRfYWxsX2RpcnR5X2Zyb21fc2NvcGUoJCRzY29wZSkge1xuICAgIGlmICgkJHNjb3BlLmN0eC5sZW5ndGggPiAzMikge1xuICAgICAgICBjb25zdCBkaXJ0eSA9IFtdO1xuICAgICAgICBjb25zdCBsZW5ndGggPSAkJHNjb3BlLmN0eC5sZW5ndGggLyAzMjtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgZGlydHlbaV0gPSAtMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGlydHk7XG4gICAgfVxuICAgIHJldHVybiAtMTtcbn1cbmZ1bmN0aW9uIGV4Y2x1ZGVfaW50ZXJuYWxfcHJvcHMocHJvcHMpIHtcbiAgICBjb25zdCByZXN1bHQgPSB7fTtcbiAgICBmb3IgKGNvbnN0IGsgaW4gcHJvcHMpXG4gICAgICAgIGlmIChrWzBdICE9PSAnJCcpXG4gICAgICAgICAgICByZXN1bHRba10gPSBwcm9wc1trXTtcbiAgICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gY29tcHV0ZV9yZXN0X3Byb3BzKHByb3BzLCBrZXlzKSB7XG4gICAgY29uc3QgcmVzdCA9IHt9O1xuICAgIGtleXMgPSBuZXcgU2V0KGtleXMpO1xuICAgIGZvciAoY29uc3QgayBpbiBwcm9wcylcbiAgICAgICAgaWYgKCFrZXlzLmhhcyhrKSAmJiBrWzBdICE9PSAnJCcpXG4gICAgICAgICAgICByZXN0W2tdID0gcHJvcHNba107XG4gICAgcmV0dXJuIHJlc3Q7XG59XG5mdW5jdGlvbiBjb21wdXRlX3Nsb3RzKHNsb3RzKSB7XG4gICAgY29uc3QgcmVzdWx0ID0ge307XG4gICAgZm9yIChjb25zdCBrZXkgaW4gc2xvdHMpIHtcbiAgICAgICAgcmVzdWx0W2tleV0gPSB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gb25jZShmbikge1xuICAgIGxldCByYW4gPSBmYWxzZTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKC4uLmFyZ3MpIHtcbiAgICAgICAgaWYgKHJhbilcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgcmFuID0gdHJ1ZTtcbiAgICAgICAgZm4uY2FsbCh0aGlzLCAuLi5hcmdzKTtcbiAgICB9O1xufVxuZnVuY3Rpb24gbnVsbF90b19lbXB0eSh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSA9PSBudWxsID8gJycgOiB2YWx1ZTtcbn1cbmZ1bmN0aW9uIHNldF9zdG9yZV92YWx1ZShzdG9yZSwgcmV0LCB2YWx1ZSkge1xuICAgIHN0b3JlLnNldCh2YWx1ZSk7XG4gICAgcmV0dXJuIHJldDtcbn1cbmNvbnN0IGhhc19wcm9wID0gKG9iaiwgcHJvcCkgPT4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCk7XG5mdW5jdGlvbiBhY3Rpb25fZGVzdHJveWVyKGFjdGlvbl9yZXN1bHQpIHtcbiAgICByZXR1cm4gYWN0aW9uX3Jlc3VsdCAmJiBpc19mdW5jdGlvbihhY3Rpb25fcmVzdWx0LmRlc3Ryb3kpID8gYWN0aW9uX3Jlc3VsdC5kZXN0cm95IDogbm9vcDtcbn1cblxuY29uc3QgaXNfY2xpZW50ID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCc7XG5sZXQgbm93ID0gaXNfY2xpZW50XG4gICAgPyAoKSA9PiB3aW5kb3cucGVyZm9ybWFuY2Uubm93KClcbiAgICA6ICgpID0+IERhdGUubm93KCk7XG5sZXQgcmFmID0gaXNfY2xpZW50ID8gY2IgPT4gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGNiKSA6IG5vb3A7XG4vLyB1c2VkIGludGVybmFsbHkgZm9yIHRlc3RpbmdcbmZ1bmN0aW9uIHNldF9ub3coZm4pIHtcbiAgICBub3cgPSBmbjtcbn1cbmZ1bmN0aW9uIHNldF9yYWYoZm4pIHtcbiAgICByYWYgPSBmbjtcbn1cblxuY29uc3QgdGFza3MgPSBuZXcgU2V0KCk7XG5mdW5jdGlvbiBydW5fdGFza3Mobm93KSB7XG4gICAgdGFza3MuZm9yRWFjaCh0YXNrID0+IHtcbiAgICAgICAgaWYgKCF0YXNrLmMobm93KSkge1xuICAgICAgICAgICAgdGFza3MuZGVsZXRlKHRhc2spO1xuICAgICAgICAgICAgdGFzay5mKCk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAodGFza3Muc2l6ZSAhPT0gMClcbiAgICAgICAgcmFmKHJ1bl90YXNrcyk7XG59XG4vKipcbiAqIEZvciB0ZXN0aW5nIHB1cnBvc2VzIG9ubHkhXG4gKi9cbmZ1bmN0aW9uIGNsZWFyX2xvb3BzKCkge1xuICAgIHRhc2tzLmNsZWFyKCk7XG59XG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgdGFzayB0aGF0IHJ1bnMgb24gZWFjaCByYWYgZnJhbWVcbiAqIHVudGlsIGl0IHJldHVybnMgYSBmYWxzeSB2YWx1ZSBvciBpcyBhYm9ydGVkXG4gKi9cbmZ1bmN0aW9uIGxvb3AoY2FsbGJhY2spIHtcbiAgICBsZXQgdGFzaztcbiAgICBpZiAodGFza3Muc2l6ZSA9PT0gMClcbiAgICAgICAgcmFmKHJ1bl90YXNrcyk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcHJvbWlzZTogbmV3IFByb21pc2UoZnVsZmlsbCA9PiB7XG4gICAgICAgICAgICB0YXNrcy5hZGQodGFzayA9IHsgYzogY2FsbGJhY2ssIGY6IGZ1bGZpbGwgfSk7XG4gICAgICAgIH0pLFxuICAgICAgICBhYm9ydCgpIHtcbiAgICAgICAgICAgIHRhc2tzLmRlbGV0ZSh0YXNrKTtcbiAgICAgICAgfVxuICAgIH07XG59XG5cbi8vIFRyYWNrIHdoaWNoIG5vZGVzIGFyZSBjbGFpbWVkIGR1cmluZyBoeWRyYXRpb24uIFVuY2xhaW1lZCBub2RlcyBjYW4gdGhlbiBiZSByZW1vdmVkIGZyb20gdGhlIERPTVxuLy8gYXQgdGhlIGVuZCBvZiBoeWRyYXRpb24gd2l0aG91dCB0b3VjaGluZyB0aGUgcmVtYWluaW5nIG5vZGVzLlxubGV0IGlzX2h5ZHJhdGluZyA9IGZhbHNlO1xuZnVuY3Rpb24gc3RhcnRfaHlkcmF0aW5nKCkge1xuICAgIGlzX2h5ZHJhdGluZyA9IHRydWU7XG59XG5mdW5jdGlvbiBlbmRfaHlkcmF0aW5nKCkge1xuICAgIGlzX2h5ZHJhdGluZyA9IGZhbHNlO1xufVxuZnVuY3Rpb24gdXBwZXJfYm91bmQobG93LCBoaWdoLCBrZXksIHZhbHVlKSB7XG4gICAgLy8gUmV0dXJuIGZpcnN0IGluZGV4IG9mIHZhbHVlIGxhcmdlciB0aGFuIGlucHV0IHZhbHVlIGluIHRoZSByYW5nZSBbbG93LCBoaWdoKVxuICAgIHdoaWxlIChsb3cgPCBoaWdoKSB7XG4gICAgICAgIGNvbnN0IG1pZCA9IGxvdyArICgoaGlnaCAtIGxvdykgPj4gMSk7XG4gICAgICAgIGlmIChrZXkobWlkKSA8PSB2YWx1ZSkge1xuICAgICAgICAgICAgbG93ID0gbWlkICsgMTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGhpZ2ggPSBtaWQ7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGxvdztcbn1cbmZ1bmN0aW9uIGluaXRfaHlkcmF0ZSh0YXJnZXQpIHtcbiAgICBpZiAodGFyZ2V0Lmh5ZHJhdGVfaW5pdClcbiAgICAgICAgcmV0dXJuO1xuICAgIHRhcmdldC5oeWRyYXRlX2luaXQgPSB0cnVlO1xuICAgIC8vIFdlIGtub3cgdGhhdCBhbGwgY2hpbGRyZW4gaGF2ZSBjbGFpbV9vcmRlciB2YWx1ZXMgc2luY2UgdGhlIHVuY2xhaW1lZCBoYXZlIGJlZW4gZGV0YWNoZWQgaWYgdGFyZ2V0IGlzIG5vdCA8aGVhZD5cbiAgICBsZXQgY2hpbGRyZW4gPSB0YXJnZXQuY2hpbGROb2RlcztcbiAgICAvLyBJZiB0YXJnZXQgaXMgPGhlYWQ+LCB0aGVyZSBtYXkgYmUgY2hpbGRyZW4gd2l0aG91dCBjbGFpbV9vcmRlclxuICAgIGlmICh0YXJnZXQubm9kZU5hbWUgPT09ICdIRUFEJykge1xuICAgICAgICBjb25zdCBteUNoaWxkcmVuID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IG5vZGUgPSBjaGlsZHJlbltpXTtcbiAgICAgICAgICAgIGlmIChub2RlLmNsYWltX29yZGVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBteUNoaWxkcmVuLnB1c2gobm9kZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY2hpbGRyZW4gPSBteUNoaWxkcmVuO1xuICAgIH1cbiAgICAvKlxuICAgICogUmVvcmRlciBjbGFpbWVkIGNoaWxkcmVuIG9wdGltYWxseS5cbiAgICAqIFdlIGNhbiByZW9yZGVyIGNsYWltZWQgY2hpbGRyZW4gb3B0aW1hbGx5IGJ5IGZpbmRpbmcgdGhlIGxvbmdlc3Qgc3Vic2VxdWVuY2Ugb2ZcbiAgICAqIG5vZGVzIHRoYXQgYXJlIGFscmVhZHkgY2xhaW1lZCBpbiBvcmRlciBhbmQgb25seSBtb3ZpbmcgdGhlIHJlc3QuIFRoZSBsb25nZXN0XG4gICAgKiBzdWJzZXF1ZW5jZSBzdWJzZXF1ZW5jZSBvZiBub2RlcyB0aGF0IGFyZSBjbGFpbWVkIGluIG9yZGVyIGNhbiBiZSBmb3VuZCBieVxuICAgICogY29tcHV0aW5nIHRoZSBsb25nZXN0IGluY3JlYXNpbmcgc3Vic2VxdWVuY2Ugb2YgLmNsYWltX29yZGVyIHZhbHVlcy5cbiAgICAqXG4gICAgKiBUaGlzIGFsZ29yaXRobSBpcyBvcHRpbWFsIGluIGdlbmVyYXRpbmcgdGhlIGxlYXN0IGFtb3VudCBvZiByZW9yZGVyIG9wZXJhdGlvbnNcbiAgICAqIHBvc3NpYmxlLlxuICAgICpcbiAgICAqIFByb29mOlxuICAgICogV2Uga25vdyB0aGF0LCBnaXZlbiBhIHNldCBvZiByZW9yZGVyaW5nIG9wZXJhdGlvbnMsIHRoZSBub2RlcyB0aGF0IGRvIG5vdCBtb3ZlXG4gICAgKiBhbHdheXMgZm9ybSBhbiBpbmNyZWFzaW5nIHN1YnNlcXVlbmNlLCBzaW5jZSB0aGV5IGRvIG5vdCBtb3ZlIGFtb25nIGVhY2ggb3RoZXJcbiAgICAqIG1lYW5pbmcgdGhhdCB0aGV5IG11c3QgYmUgYWxyZWFkeSBvcmRlcmVkIGFtb25nIGVhY2ggb3RoZXIuIFRodXMsIHRoZSBtYXhpbWFsXG4gICAgKiBzZXQgb2Ygbm9kZXMgdGhhdCBkbyBub3QgbW92ZSBmb3JtIGEgbG9uZ2VzdCBpbmNyZWFzaW5nIHN1YnNlcXVlbmNlLlxuICAgICovXG4gICAgLy8gQ29tcHV0ZSBsb25nZXN0IGluY3JlYXNpbmcgc3Vic2VxdWVuY2VcbiAgICAvLyBtOiBzdWJzZXF1ZW5jZSBsZW5ndGggaiA9PiBpbmRleCBrIG9mIHNtYWxsZXN0IHZhbHVlIHRoYXQgZW5kcyBhbiBpbmNyZWFzaW5nIHN1YnNlcXVlbmNlIG9mIGxlbmd0aCBqXG4gICAgY29uc3QgbSA9IG5ldyBJbnQzMkFycmF5KGNoaWxkcmVuLmxlbmd0aCArIDEpO1xuICAgIC8vIFByZWRlY2Vzc29yIGluZGljZXMgKyAxXG4gICAgY29uc3QgcCA9IG5ldyBJbnQzMkFycmF5KGNoaWxkcmVuLmxlbmd0aCk7XG4gICAgbVswXSA9IC0xO1xuICAgIGxldCBsb25nZXN0ID0gMDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGN1cnJlbnQgPSBjaGlsZHJlbltpXS5jbGFpbV9vcmRlcjtcbiAgICAgICAgLy8gRmluZCB0aGUgbGFyZ2VzdCBzdWJzZXF1ZW5jZSBsZW5ndGggc3VjaCB0aGF0IGl0IGVuZHMgaW4gYSB2YWx1ZSBsZXNzIHRoYW4gb3VyIGN1cnJlbnQgdmFsdWVcbiAgICAgICAgLy8gdXBwZXJfYm91bmQgcmV0dXJucyBmaXJzdCBncmVhdGVyIHZhbHVlLCBzbyB3ZSBzdWJ0cmFjdCBvbmVcbiAgICAgICAgLy8gd2l0aCBmYXN0IHBhdGggZm9yIHdoZW4gd2UgYXJlIG9uIHRoZSBjdXJyZW50IGxvbmdlc3Qgc3Vic2VxdWVuY2VcbiAgICAgICAgY29uc3Qgc2VxTGVuID0gKChsb25nZXN0ID4gMCAmJiBjaGlsZHJlblttW2xvbmdlc3RdXS5jbGFpbV9vcmRlciA8PSBjdXJyZW50KSA/IGxvbmdlc3QgKyAxIDogdXBwZXJfYm91bmQoMSwgbG9uZ2VzdCwgaWR4ID0+IGNoaWxkcmVuW21baWR4XV0uY2xhaW1fb3JkZXIsIGN1cnJlbnQpKSAtIDE7XG4gICAgICAgIHBbaV0gPSBtW3NlcUxlbl0gKyAxO1xuICAgICAgICBjb25zdCBuZXdMZW4gPSBzZXFMZW4gKyAxO1xuICAgICAgICAvLyBXZSBjYW4gZ3VhcmFudGVlIHRoYXQgY3VycmVudCBpcyB0aGUgc21hbGxlc3QgdmFsdWUuIE90aGVyd2lzZSwgd2Ugd291bGQgaGF2ZSBnZW5lcmF0ZWQgYSBsb25nZXIgc2VxdWVuY2UuXG4gICAgICAgIG1bbmV3TGVuXSA9IGk7XG4gICAgICAgIGxvbmdlc3QgPSBNYXRoLm1heChuZXdMZW4sIGxvbmdlc3QpO1xuICAgIH1cbiAgICAvLyBUaGUgbG9uZ2VzdCBpbmNyZWFzaW5nIHN1YnNlcXVlbmNlIG9mIG5vZGVzIChpbml0aWFsbHkgcmV2ZXJzZWQpXG4gICAgY29uc3QgbGlzID0gW107XG4gICAgLy8gVGhlIHJlc3Qgb2YgdGhlIG5vZGVzLCBub2RlcyB0aGF0IHdpbGwgYmUgbW92ZWRcbiAgICBjb25zdCB0b01vdmUgPSBbXTtcbiAgICBsZXQgbGFzdCA9IGNoaWxkcmVuLmxlbmd0aCAtIDE7XG4gICAgZm9yIChsZXQgY3VyID0gbVtsb25nZXN0XSArIDE7IGN1ciAhPSAwOyBjdXIgPSBwW2N1ciAtIDFdKSB7XG4gICAgICAgIGxpcy5wdXNoKGNoaWxkcmVuW2N1ciAtIDFdKTtcbiAgICAgICAgZm9yICg7IGxhc3QgPj0gY3VyOyBsYXN0LS0pIHtcbiAgICAgICAgICAgIHRvTW92ZS5wdXNoKGNoaWxkcmVuW2xhc3RdKTtcbiAgICAgICAgfVxuICAgICAgICBsYXN0LS07XG4gICAgfVxuICAgIGZvciAoOyBsYXN0ID49IDA7IGxhc3QtLSkge1xuICAgICAgICB0b01vdmUucHVzaChjaGlsZHJlbltsYXN0XSk7XG4gICAgfVxuICAgIGxpcy5yZXZlcnNlKCk7XG4gICAgLy8gV2Ugc29ydCB0aGUgbm9kZXMgYmVpbmcgbW92ZWQgdG8gZ3VhcmFudGVlIHRoYXQgdGhlaXIgaW5zZXJ0aW9uIG9yZGVyIG1hdGNoZXMgdGhlIGNsYWltIG9yZGVyXG4gICAgdG9Nb3ZlLnNvcnQoKGEsIGIpID0+IGEuY2xhaW1fb3JkZXIgLSBiLmNsYWltX29yZGVyKTtcbiAgICAvLyBGaW5hbGx5LCB3ZSBtb3ZlIHRoZSBub2Rlc1xuICAgIGZvciAobGV0IGkgPSAwLCBqID0gMDsgaSA8IHRvTW92ZS5sZW5ndGg7IGkrKykge1xuICAgICAgICB3aGlsZSAoaiA8IGxpcy5sZW5ndGggJiYgdG9Nb3ZlW2ldLmNsYWltX29yZGVyID49IGxpc1tqXS5jbGFpbV9vcmRlcikge1xuICAgICAgICAgICAgaisrO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGFuY2hvciA9IGogPCBsaXMubGVuZ3RoID8gbGlzW2pdIDogbnVsbDtcbiAgICAgICAgdGFyZ2V0Lmluc2VydEJlZm9yZSh0b01vdmVbaV0sIGFuY2hvcik7XG4gICAgfVxufVxuZnVuY3Rpb24gYXBwZW5kKHRhcmdldCwgbm9kZSkge1xuICAgIHRhcmdldC5hcHBlbmRDaGlsZChub2RlKTtcbn1cbmZ1bmN0aW9uIGFwcGVuZF9zdHlsZXModGFyZ2V0LCBzdHlsZV9zaGVldF9pZCwgc3R5bGVzKSB7XG4gICAgY29uc3QgYXBwZW5kX3N0eWxlc190byA9IGdldF9yb290X2Zvcl9zdHlsZSh0YXJnZXQpO1xuICAgIGlmICghYXBwZW5kX3N0eWxlc190by5nZXRFbGVtZW50QnlJZChzdHlsZV9zaGVldF9pZCkpIHtcbiAgICAgICAgY29uc3Qgc3R5bGUgPSBlbGVtZW50KCdzdHlsZScpO1xuICAgICAgICBzdHlsZS5pZCA9IHN0eWxlX3NoZWV0X2lkO1xuICAgICAgICBzdHlsZS50ZXh0Q29udGVudCA9IHN0eWxlcztcbiAgICAgICAgYXBwZW5kX3N0eWxlc2hlZXQoYXBwZW5kX3N0eWxlc190bywgc3R5bGUpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGdldF9yb290X2Zvcl9zdHlsZShub2RlKSB7XG4gICAgaWYgKCFub2RlKVxuICAgICAgICByZXR1cm4gZG9jdW1lbnQ7XG4gICAgY29uc3Qgcm9vdCA9IG5vZGUuZ2V0Um9vdE5vZGUgPyBub2RlLmdldFJvb3ROb2RlKCkgOiBub2RlLm93bmVyRG9jdW1lbnQ7XG4gICAgaWYgKHJvb3QgJiYgcm9vdC5ob3N0KSB7XG4gICAgICAgIHJldHVybiByb290O1xuICAgIH1cbiAgICByZXR1cm4gbm9kZS5vd25lckRvY3VtZW50O1xufVxuZnVuY3Rpb24gYXBwZW5kX2VtcHR5X3N0eWxlc2hlZXQobm9kZSkge1xuICAgIGNvbnN0IHN0eWxlX2VsZW1lbnQgPSBlbGVtZW50KCdzdHlsZScpO1xuICAgIGFwcGVuZF9zdHlsZXNoZWV0KGdldF9yb290X2Zvcl9zdHlsZShub2RlKSwgc3R5bGVfZWxlbWVudCk7XG4gICAgcmV0dXJuIHN0eWxlX2VsZW1lbnQuc2hlZXQ7XG59XG5mdW5jdGlvbiBhcHBlbmRfc3R5bGVzaGVldChub2RlLCBzdHlsZSkge1xuICAgIGFwcGVuZChub2RlLmhlYWQgfHwgbm9kZSwgc3R5bGUpO1xufVxuZnVuY3Rpb24gYXBwZW5kX2h5ZHJhdGlvbih0YXJnZXQsIG5vZGUpIHtcbiAgICBpZiAoaXNfaHlkcmF0aW5nKSB7XG4gICAgICAgIGluaXRfaHlkcmF0ZSh0YXJnZXQpO1xuICAgICAgICBpZiAoKHRhcmdldC5hY3R1YWxfZW5kX2NoaWxkID09PSB1bmRlZmluZWQpIHx8ICgodGFyZ2V0LmFjdHVhbF9lbmRfY2hpbGQgIT09IG51bGwpICYmICh0YXJnZXQuYWN0dWFsX2VuZF9jaGlsZC5wYXJlbnRFbGVtZW50ICE9PSB0YXJnZXQpKSkge1xuICAgICAgICAgICAgdGFyZ2V0LmFjdHVhbF9lbmRfY2hpbGQgPSB0YXJnZXQuZmlyc3RDaGlsZDtcbiAgICAgICAgfVxuICAgICAgICAvLyBTa2lwIG5vZGVzIG9mIHVuZGVmaW5lZCBvcmRlcmluZ1xuICAgICAgICB3aGlsZSAoKHRhcmdldC5hY3R1YWxfZW5kX2NoaWxkICE9PSBudWxsKSAmJiAodGFyZ2V0LmFjdHVhbF9lbmRfY2hpbGQuY2xhaW1fb3JkZXIgPT09IHVuZGVmaW5lZCkpIHtcbiAgICAgICAgICAgIHRhcmdldC5hY3R1YWxfZW5kX2NoaWxkID0gdGFyZ2V0LmFjdHVhbF9lbmRfY2hpbGQubmV4dFNpYmxpbmc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5vZGUgIT09IHRhcmdldC5hY3R1YWxfZW5kX2NoaWxkKSB7XG4gICAgICAgICAgICAvLyBXZSBvbmx5IGluc2VydCBpZiB0aGUgb3JkZXJpbmcgb2YgdGhpcyBub2RlIHNob3VsZCBiZSBtb2RpZmllZCBvciB0aGUgcGFyZW50IG5vZGUgaXMgbm90IHRhcmdldFxuICAgICAgICAgICAgaWYgKG5vZGUuY2xhaW1fb3JkZXIgIT09IHVuZGVmaW5lZCB8fCBub2RlLnBhcmVudE5vZGUgIT09IHRhcmdldCkge1xuICAgICAgICAgICAgICAgIHRhcmdldC5pbnNlcnRCZWZvcmUobm9kZSwgdGFyZ2V0LmFjdHVhbF9lbmRfY2hpbGQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGFyZ2V0LmFjdHVhbF9lbmRfY2hpbGQgPSBub2RlLm5leHRTaWJsaW5nO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKG5vZGUucGFyZW50Tm9kZSAhPT0gdGFyZ2V0IHx8IG5vZGUubmV4dFNpYmxpbmcgIT09IG51bGwpIHtcbiAgICAgICAgdGFyZ2V0LmFwcGVuZENoaWxkKG5vZGUpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGluc2VydCh0YXJnZXQsIG5vZGUsIGFuY2hvcikge1xuICAgIHRhcmdldC5pbnNlcnRCZWZvcmUobm9kZSwgYW5jaG9yIHx8IG51bGwpO1xufVxuZnVuY3Rpb24gaW5zZXJ0X2h5ZHJhdGlvbih0YXJnZXQsIG5vZGUsIGFuY2hvcikge1xuICAgIGlmIChpc19oeWRyYXRpbmcgJiYgIWFuY2hvcikge1xuICAgICAgICBhcHBlbmRfaHlkcmF0aW9uKHRhcmdldCwgbm9kZSk7XG4gICAgfVxuICAgIGVsc2UgaWYgKG5vZGUucGFyZW50Tm9kZSAhPT0gdGFyZ2V0IHx8IG5vZGUubmV4dFNpYmxpbmcgIT0gYW5jaG9yKSB7XG4gICAgICAgIHRhcmdldC5pbnNlcnRCZWZvcmUobm9kZSwgYW5jaG9yIHx8IG51bGwpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGRldGFjaChub2RlKSB7XG4gICAgbm9kZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG5vZGUpO1xufVxuZnVuY3Rpb24gZGVzdHJveV9lYWNoKGl0ZXJhdGlvbnMsIGRldGFjaGluZykge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaXRlcmF0aW9ucy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBpZiAoaXRlcmF0aW9uc1tpXSlcbiAgICAgICAgICAgIGl0ZXJhdGlvbnNbaV0uZChkZXRhY2hpbmcpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGVsZW1lbnQobmFtZSkge1xuICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KG5hbWUpO1xufVxuZnVuY3Rpb24gZWxlbWVudF9pcyhuYW1lLCBpcykge1xuICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KG5hbWUsIHsgaXMgfSk7XG59XG5mdW5jdGlvbiBvYmplY3Rfd2l0aG91dF9wcm9wZXJ0aWVzKG9iaiwgZXhjbHVkZSkge1xuICAgIGNvbnN0IHRhcmdldCA9IHt9O1xuICAgIGZvciAoY29uc3QgayBpbiBvYmopIHtcbiAgICAgICAgaWYgKGhhc19wcm9wKG9iaiwgaylcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgICYmIGV4Y2x1ZGUuaW5kZXhPZihrKSA9PT0gLTEpIHtcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgIHRhcmdldFtrXSA9IG9ialtrXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGFyZ2V0O1xufVxuZnVuY3Rpb24gc3ZnX2VsZW1lbnQobmFtZSkge1xuICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgbmFtZSk7XG59XG5mdW5jdGlvbiB0ZXh0KGRhdGEpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoZGF0YSk7XG59XG5mdW5jdGlvbiBzcGFjZSgpIHtcbiAgICByZXR1cm4gdGV4dCgnICcpO1xufVxuZnVuY3Rpb24gZW1wdHkoKSB7XG4gICAgcmV0dXJuIHRleHQoJycpO1xufVxuZnVuY3Rpb24gbGlzdGVuKG5vZGUsIGV2ZW50LCBoYW5kbGVyLCBvcHRpb25zKSB7XG4gICAgbm9kZS5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBoYW5kbGVyLCBvcHRpb25zKTtcbiAgICByZXR1cm4gKCkgPT4gbm9kZS5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50LCBoYW5kbGVyLCBvcHRpb25zKTtcbn1cbmZ1bmN0aW9uIHByZXZlbnRfZGVmYXVsdChmbikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICByZXR1cm4gZm4uY2FsbCh0aGlzLCBldmVudCk7XG4gICAgfTtcbn1cbmZ1bmN0aW9uIHN0b3BfcHJvcGFnYXRpb24oZm4pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIHJldHVybiBmbi5jYWxsKHRoaXMsIGV2ZW50KTtcbiAgICB9O1xufVxuZnVuY3Rpb24gc2VsZihmbikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICBpZiAoZXZlbnQudGFyZ2V0ID09PSB0aGlzKVxuICAgICAgICAgICAgZm4uY2FsbCh0aGlzLCBldmVudCk7XG4gICAgfTtcbn1cbmZ1bmN0aW9uIHRydXN0ZWQoZm4pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgaWYgKGV2ZW50LmlzVHJ1c3RlZClcbiAgICAgICAgICAgIGZuLmNhbGwodGhpcywgZXZlbnQpO1xuICAgIH07XG59XG5mdW5jdGlvbiBhdHRyKG5vZGUsIGF0dHJpYnV0ZSwgdmFsdWUpIHtcbiAgICBpZiAodmFsdWUgPT0gbnVsbClcbiAgICAgICAgbm9kZS5yZW1vdmVBdHRyaWJ1dGUoYXR0cmlidXRlKTtcbiAgICBlbHNlIGlmIChub2RlLmdldEF0dHJpYnV0ZShhdHRyaWJ1dGUpICE9PSB2YWx1ZSlcbiAgICAgICAgbm9kZS5zZXRBdHRyaWJ1dGUoYXR0cmlidXRlLCB2YWx1ZSk7XG59XG5mdW5jdGlvbiBzZXRfYXR0cmlidXRlcyhub2RlLCBhdHRyaWJ1dGVzKSB7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGNvbnN0IGRlc2NyaXB0b3JzID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMobm9kZS5fX3Byb3RvX18pO1xuICAgIGZvciAoY29uc3Qga2V5IGluIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgaWYgKGF0dHJpYnV0ZXNba2V5XSA9PSBudWxsKSB7XG4gICAgICAgICAgICBub2RlLnJlbW92ZUF0dHJpYnV0ZShrZXkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGtleSA9PT0gJ3N0eWxlJykge1xuICAgICAgICAgICAgbm9kZS5zdHlsZS5jc3NUZXh0ID0gYXR0cmlidXRlc1trZXldO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGtleSA9PT0gJ19fdmFsdWUnKSB7XG4gICAgICAgICAgICBub2RlLnZhbHVlID0gbm9kZVtrZXldID0gYXR0cmlidXRlc1trZXldO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGRlc2NyaXB0b3JzW2tleV0gJiYgZGVzY3JpcHRvcnNba2V5XS5zZXQpIHtcbiAgICAgICAgICAgIG5vZGVba2V5XSA9IGF0dHJpYnV0ZXNba2V5XTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGF0dHIobm9kZSwga2V5LCBhdHRyaWJ1dGVzW2tleV0pO1xuICAgICAgICB9XG4gICAgfVxufVxuZnVuY3Rpb24gc2V0X3N2Z19hdHRyaWJ1dGVzKG5vZGUsIGF0dHJpYnV0ZXMpIHtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBhdHRyaWJ1dGVzKSB7XG4gICAgICAgIGF0dHIobm9kZSwga2V5LCBhdHRyaWJ1dGVzW2tleV0pO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHNldF9jdXN0b21fZWxlbWVudF9kYXRhKG5vZGUsIHByb3AsIHZhbHVlKSB7XG4gICAgaWYgKHByb3AgaW4gbm9kZSkge1xuICAgICAgICBub2RlW3Byb3BdID0gdHlwZW9mIG5vZGVbcHJvcF0gPT09ICdib29sZWFuJyAmJiB2YWx1ZSA9PT0gJycgPyB0cnVlIDogdmFsdWU7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBhdHRyKG5vZGUsIHByb3AsIHZhbHVlKTtcbiAgICB9XG59XG5mdW5jdGlvbiB4bGlua19hdHRyKG5vZGUsIGF0dHJpYnV0ZSwgdmFsdWUpIHtcbiAgICBub2RlLnNldEF0dHJpYnV0ZU5TKCdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJywgYXR0cmlidXRlLCB2YWx1ZSk7XG59XG5mdW5jdGlvbiBnZXRfYmluZGluZ19ncm91cF92YWx1ZShncm91cCwgX192YWx1ZSwgY2hlY2tlZCkge1xuICAgIGNvbnN0IHZhbHVlID0gbmV3IFNldCgpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZ3JvdXAubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgaWYgKGdyb3VwW2ldLmNoZWNrZWQpXG4gICAgICAgICAgICB2YWx1ZS5hZGQoZ3JvdXBbaV0uX192YWx1ZSk7XG4gICAgfVxuICAgIGlmICghY2hlY2tlZCkge1xuICAgICAgICB2YWx1ZS5kZWxldGUoX192YWx1ZSk7XG4gICAgfVxuICAgIHJldHVybiBBcnJheS5mcm9tKHZhbHVlKTtcbn1cbmZ1bmN0aW9uIHRvX251bWJlcih2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gJycgPyBudWxsIDogK3ZhbHVlO1xufVxuZnVuY3Rpb24gdGltZV9yYW5nZXNfdG9fYXJyYXkocmFuZ2VzKSB7XG4gICAgY29uc3QgYXJyYXkgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJhbmdlcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBhcnJheS5wdXNoKHsgc3RhcnQ6IHJhbmdlcy5zdGFydChpKSwgZW5kOiByYW5nZXMuZW5kKGkpIH0pO1xuICAgIH1cbiAgICByZXR1cm4gYXJyYXk7XG59XG5mdW5jdGlvbiBjaGlsZHJlbihlbGVtZW50KSB7XG4gICAgcmV0dXJuIEFycmF5LmZyb20oZWxlbWVudC5jaGlsZE5vZGVzKTtcbn1cbmZ1bmN0aW9uIGluaXRfY2xhaW1faW5mbyhub2Rlcykge1xuICAgIGlmIChub2Rlcy5jbGFpbV9pbmZvID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgbm9kZXMuY2xhaW1faW5mbyA9IHsgbGFzdF9pbmRleDogMCwgdG90YWxfY2xhaW1lZDogMCB9O1xuICAgIH1cbn1cbmZ1bmN0aW9uIGNsYWltX25vZGUobm9kZXMsIHByZWRpY2F0ZSwgcHJvY2Vzc05vZGUsIGNyZWF0ZU5vZGUsIGRvbnRVcGRhdGVMYXN0SW5kZXggPSBmYWxzZSkge1xuICAgIC8vIFRyeSB0byBmaW5kIG5vZGVzIGluIGFuIG9yZGVyIHN1Y2ggdGhhdCB3ZSBsZW5ndGhlbiB0aGUgbG9uZ2VzdCBpbmNyZWFzaW5nIHN1YnNlcXVlbmNlXG4gICAgaW5pdF9jbGFpbV9pbmZvKG5vZGVzKTtcbiAgICBjb25zdCByZXN1bHROb2RlID0gKCgpID0+IHtcbiAgICAgICAgLy8gV2UgZmlyc3QgdHJ5IHRvIGZpbmQgYW4gZWxlbWVudCBhZnRlciB0aGUgcHJldmlvdXMgb25lXG4gICAgICAgIGZvciAobGV0IGkgPSBub2Rlcy5jbGFpbV9pbmZvLmxhc3RfaW5kZXg7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3Qgbm9kZSA9IG5vZGVzW2ldO1xuICAgICAgICAgICAgaWYgKHByZWRpY2F0ZShub2RlKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlcGxhY2VtZW50ID0gcHJvY2Vzc05vZGUobm9kZSk7XG4gICAgICAgICAgICAgICAgaWYgKHJlcGxhY2VtZW50ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgbm9kZXMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbm9kZXNbaV0gPSByZXBsYWNlbWVudDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCFkb250VXBkYXRlTGFzdEluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgIG5vZGVzLmNsYWltX2luZm8ubGFzdF9pbmRleCA9IGk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBub2RlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIE90aGVyd2lzZSwgd2UgdHJ5IHRvIGZpbmQgb25lIGJlZm9yZVxuICAgICAgICAvLyBXZSBpdGVyYXRlIGluIHJldmVyc2Ugc28gdGhhdCB3ZSBkb24ndCBnbyB0b28gZmFyIGJhY2tcbiAgICAgICAgZm9yIChsZXQgaSA9IG5vZGVzLmNsYWltX2luZm8ubGFzdF9pbmRleCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICBjb25zdCBub2RlID0gbm9kZXNbaV07XG4gICAgICAgICAgICBpZiAocHJlZGljYXRlKG5vZGUpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVwbGFjZW1lbnQgPSBwcm9jZXNzTm9kZShub2RlKTtcbiAgICAgICAgICAgICAgICBpZiAocmVwbGFjZW1lbnQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBub2Rlcy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBub2Rlc1tpXSA9IHJlcGxhY2VtZW50O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIWRvbnRVcGRhdGVMYXN0SW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgbm9kZXMuY2xhaW1faW5mby5sYXN0X2luZGV4ID0gaTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAocmVwbGFjZW1lbnQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBTaW5jZSB3ZSBzcGxpY2VkIGJlZm9yZSB0aGUgbGFzdF9pbmRleCwgd2UgZGVjcmVhc2UgaXRcbiAgICAgICAgICAgICAgICAgICAgbm9kZXMuY2xhaW1faW5mby5sYXN0X2luZGV4LS07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBub2RlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIElmIHdlIGNhbid0IGZpbmQgYW55IG1hdGNoaW5nIG5vZGUsIHdlIGNyZWF0ZSBhIG5ldyBvbmVcbiAgICAgICAgcmV0dXJuIGNyZWF0ZU5vZGUoKTtcbiAgICB9KSgpO1xuICAgIHJlc3VsdE5vZGUuY2xhaW1fb3JkZXIgPSBub2Rlcy5jbGFpbV9pbmZvLnRvdGFsX2NsYWltZWQ7XG4gICAgbm9kZXMuY2xhaW1faW5mby50b3RhbF9jbGFpbWVkICs9IDE7XG4gICAgcmV0dXJuIHJlc3VsdE5vZGU7XG59XG5mdW5jdGlvbiBjbGFpbV9lbGVtZW50X2Jhc2Uobm9kZXMsIG5hbWUsIGF0dHJpYnV0ZXMsIGNyZWF0ZV9lbGVtZW50KSB7XG4gICAgcmV0dXJuIGNsYWltX25vZGUobm9kZXMsIChub2RlKSA9PiBub2RlLm5vZGVOYW1lID09PSBuYW1lLCAobm9kZSkgPT4ge1xuICAgICAgICBjb25zdCByZW1vdmUgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBub2RlLmF0dHJpYnV0ZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGF0dHJpYnV0ZSA9IG5vZGUuYXR0cmlidXRlc1tqXTtcbiAgICAgICAgICAgIGlmICghYXR0cmlidXRlc1thdHRyaWJ1dGUubmFtZV0pIHtcbiAgICAgICAgICAgICAgICByZW1vdmUucHVzaChhdHRyaWJ1dGUubmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmVtb3ZlLmZvckVhY2godiA9PiBub2RlLnJlbW92ZUF0dHJpYnV0ZSh2KSk7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfSwgKCkgPT4gY3JlYXRlX2VsZW1lbnQobmFtZSkpO1xufVxuZnVuY3Rpb24gY2xhaW1fZWxlbWVudChub2RlcywgbmFtZSwgYXR0cmlidXRlcykge1xuICAgIHJldHVybiBjbGFpbV9lbGVtZW50X2Jhc2Uobm9kZXMsIG5hbWUsIGF0dHJpYnV0ZXMsIGVsZW1lbnQpO1xufVxuZnVuY3Rpb24gY2xhaW1fc3ZnX2VsZW1lbnQobm9kZXMsIG5hbWUsIGF0dHJpYnV0ZXMpIHtcbiAgICByZXR1cm4gY2xhaW1fZWxlbWVudF9iYXNlKG5vZGVzLCBuYW1lLCBhdHRyaWJ1dGVzLCBzdmdfZWxlbWVudCk7XG59XG5mdW5jdGlvbiBjbGFpbV90ZXh0KG5vZGVzLCBkYXRhKSB7XG4gICAgcmV0dXJuIGNsYWltX25vZGUobm9kZXMsIChub2RlKSA9PiBub2RlLm5vZGVUeXBlID09PSAzLCAobm9kZSkgPT4ge1xuICAgICAgICBjb25zdCBkYXRhU3RyID0gJycgKyBkYXRhO1xuICAgICAgICBpZiAobm9kZS5kYXRhLnN0YXJ0c1dpdGgoZGF0YVN0cikpIHtcbiAgICAgICAgICAgIGlmIChub2RlLmRhdGEubGVuZ3RoICE9PSBkYXRhU3RyLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBub2RlLnNwbGl0VGV4dChkYXRhU3RyLmxlbmd0aCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBub2RlLmRhdGEgPSBkYXRhU3RyO1xuICAgICAgICB9XG4gICAgfSwgKCkgPT4gdGV4dChkYXRhKSwgdHJ1ZSAvLyBUZXh0IG5vZGVzIHNob3VsZCBub3QgdXBkYXRlIGxhc3QgaW5kZXggc2luY2UgaXQgaXMgbGlrZWx5IG5vdCB3b3J0aCBpdCB0byBlbGltaW5hdGUgYW4gaW5jcmVhc2luZyBzdWJzZXF1ZW5jZSBvZiBhY3R1YWwgZWxlbWVudHNcbiAgICApO1xufVxuZnVuY3Rpb24gY2xhaW1fc3BhY2Uobm9kZXMpIHtcbiAgICByZXR1cm4gY2xhaW1fdGV4dChub2RlcywgJyAnKTtcbn1cbmZ1bmN0aW9uIGZpbmRfY29tbWVudChub2RlcywgdGV4dCwgc3RhcnQpIHtcbiAgICBmb3IgKGxldCBpID0gc3RhcnQ7IGkgPCBub2Rlcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBjb25zdCBub2RlID0gbm9kZXNbaV07XG4gICAgICAgIGlmIChub2RlLm5vZGVUeXBlID09PSA4IC8qIGNvbW1lbnQgbm9kZSAqLyAmJiBub2RlLnRleHRDb250ZW50LnRyaW0oKSA9PT0gdGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5vZGVzLmxlbmd0aDtcbn1cbmZ1bmN0aW9uIGNsYWltX2h0bWxfdGFnKG5vZGVzLCBpc19zdmcpIHtcbiAgICAvLyBmaW5kIGh0bWwgb3BlbmluZyB0YWdcbiAgICBjb25zdCBzdGFydF9pbmRleCA9IGZpbmRfY29tbWVudChub2RlcywgJ0hUTUxfVEFHX1NUQVJUJywgMCk7XG4gICAgY29uc3QgZW5kX2luZGV4ID0gZmluZF9jb21tZW50KG5vZGVzLCAnSFRNTF9UQUdfRU5EJywgc3RhcnRfaW5kZXgpO1xuICAgIGlmIChzdGFydF9pbmRleCA9PT0gZW5kX2luZGV4KSB7XG4gICAgICAgIHJldHVybiBuZXcgSHRtbFRhZ0h5ZHJhdGlvbih1bmRlZmluZWQsIGlzX3N2Zyk7XG4gICAgfVxuICAgIGluaXRfY2xhaW1faW5mbyhub2Rlcyk7XG4gICAgY29uc3QgaHRtbF90YWdfbm9kZXMgPSBub2Rlcy5zcGxpY2Uoc3RhcnRfaW5kZXgsIGVuZF9pbmRleCAtIHN0YXJ0X2luZGV4ICsgMSk7XG4gICAgZGV0YWNoKGh0bWxfdGFnX25vZGVzWzBdKTtcbiAgICBkZXRhY2goaHRtbF90YWdfbm9kZXNbaHRtbF90YWdfbm9kZXMubGVuZ3RoIC0gMV0pO1xuICAgIGNvbnN0IGNsYWltZWRfbm9kZXMgPSBodG1sX3RhZ19ub2Rlcy5zbGljZSgxLCBodG1sX3RhZ19ub2Rlcy5sZW5ndGggLSAxKTtcbiAgICBmb3IgKGNvbnN0IG4gb2YgY2xhaW1lZF9ub2Rlcykge1xuICAgICAgICBuLmNsYWltX29yZGVyID0gbm9kZXMuY2xhaW1faW5mby50b3RhbF9jbGFpbWVkO1xuICAgICAgICBub2Rlcy5jbGFpbV9pbmZvLnRvdGFsX2NsYWltZWQgKz0gMTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBIdG1sVGFnSHlkcmF0aW9uKGNsYWltZWRfbm9kZXMsIGlzX3N2Zyk7XG59XG5mdW5jdGlvbiBzZXRfZGF0YSh0ZXh0LCBkYXRhKSB7XG4gICAgZGF0YSA9ICcnICsgZGF0YTtcbiAgICBpZiAodGV4dC53aG9sZVRleHQgIT09IGRhdGEpXG4gICAgICAgIHRleHQuZGF0YSA9IGRhdGE7XG59XG5mdW5jdGlvbiBzZXRfaW5wdXRfdmFsdWUoaW5wdXQsIHZhbHVlKSB7XG4gICAgaW5wdXQudmFsdWUgPSB2YWx1ZSA9PSBudWxsID8gJycgOiB2YWx1ZTtcbn1cbmZ1bmN0aW9uIHNldF9pbnB1dF90eXBlKGlucHV0LCB0eXBlKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaW5wdXQudHlwZSA9IHR5cGU7XG4gICAgfVxuICAgIGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGRvIG5vdGhpbmdcbiAgICB9XG59XG5mdW5jdGlvbiBzZXRfc3R5bGUobm9kZSwga2V5LCB2YWx1ZSwgaW1wb3J0YW50KSB7XG4gICAgaWYgKHZhbHVlID09PSBudWxsKSB7XG4gICAgICAgIG5vZGUuc3R5bGUucmVtb3ZlUHJvcGVydHkoa2V5KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIG5vZGUuc3R5bGUuc2V0UHJvcGVydHkoa2V5LCB2YWx1ZSwgaW1wb3J0YW50ID8gJ2ltcG9ydGFudCcgOiAnJyk7XG4gICAgfVxufVxuZnVuY3Rpb24gc2VsZWN0X29wdGlvbihzZWxlY3QsIHZhbHVlKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzZWxlY3Qub3B0aW9ucy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBjb25zdCBvcHRpb24gPSBzZWxlY3Qub3B0aW9uc1tpXTtcbiAgICAgICAgaWYgKG9wdGlvbi5fX3ZhbHVlID09PSB2YWx1ZSkge1xuICAgICAgICAgICAgb3B0aW9uLnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIH1cbiAgICBzZWxlY3Quc2VsZWN0ZWRJbmRleCA9IC0xOyAvLyBubyBvcHRpb24gc2hvdWxkIGJlIHNlbGVjdGVkXG59XG5mdW5jdGlvbiBzZWxlY3Rfb3B0aW9ucyhzZWxlY3QsIHZhbHVlKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzZWxlY3Qub3B0aW9ucy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBjb25zdCBvcHRpb24gPSBzZWxlY3Qub3B0aW9uc1tpXTtcbiAgICAgICAgb3B0aW9uLnNlbGVjdGVkID0gfnZhbHVlLmluZGV4T2Yob3B0aW9uLl9fdmFsdWUpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHNlbGVjdF92YWx1ZShzZWxlY3QpIHtcbiAgICBjb25zdCBzZWxlY3RlZF9vcHRpb24gPSBzZWxlY3QucXVlcnlTZWxlY3RvcignOmNoZWNrZWQnKSB8fCBzZWxlY3Qub3B0aW9uc1swXTtcbiAgICByZXR1cm4gc2VsZWN0ZWRfb3B0aW9uICYmIHNlbGVjdGVkX29wdGlvbi5fX3ZhbHVlO1xufVxuZnVuY3Rpb24gc2VsZWN0X211bHRpcGxlX3ZhbHVlKHNlbGVjdCkge1xuICAgIHJldHVybiBbXS5tYXAuY2FsbChzZWxlY3QucXVlcnlTZWxlY3RvckFsbCgnOmNoZWNrZWQnKSwgb3B0aW9uID0+IG9wdGlvbi5fX3ZhbHVlKTtcbn1cbi8vIHVuZm9ydHVuYXRlbHkgdGhpcyBjYW4ndCBiZSBhIGNvbnN0YW50IGFzIHRoYXQgd291bGRuJ3QgYmUgdHJlZS1zaGFrZWFibGVcbi8vIHNvIHdlIGNhY2hlIHRoZSByZXN1bHQgaW5zdGVhZFxubGV0IGNyb3Nzb3JpZ2luO1xuZnVuY3Rpb24gaXNfY3Jvc3NvcmlnaW4oKSB7XG4gICAgaWYgKGNyb3Nzb3JpZ2luID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY3Jvc3NvcmlnaW4gPSBmYWxzZTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cucGFyZW50KSB7XG4gICAgICAgICAgICAgICAgdm9pZCB3aW5kb3cucGFyZW50LmRvY3VtZW50O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY3Jvc3NvcmlnaW4gPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjcm9zc29yaWdpbjtcbn1cbmZ1bmN0aW9uIGFkZF9yZXNpemVfbGlzdGVuZXIobm9kZSwgZm4pIHtcbiAgICBjb25zdCBjb21wdXRlZF9zdHlsZSA9IGdldENvbXB1dGVkU3R5bGUobm9kZSk7XG4gICAgaWYgKGNvbXB1dGVkX3N0eWxlLnBvc2l0aW9uID09PSAnc3RhdGljJykge1xuICAgICAgICBub2RlLnN0eWxlLnBvc2l0aW9uID0gJ3JlbGF0aXZlJztcbiAgICB9XG4gICAgY29uc3QgaWZyYW1lID0gZWxlbWVudCgnaWZyYW1lJyk7XG4gICAgaWZyYW1lLnNldEF0dHJpYnV0ZSgnc3R5bGUnLCAnZGlzcGxheTogYmxvY2s7IHBvc2l0aW9uOiBhYnNvbHV0ZTsgdG9wOiAwOyBsZWZ0OiAwOyB3aWR0aDogMTAwJTsgaGVpZ2h0OiAxMDAlOyAnICtcbiAgICAgICAgJ292ZXJmbG93OiBoaWRkZW47IGJvcmRlcjogMDsgb3BhY2l0eTogMDsgcG9pbnRlci1ldmVudHM6IG5vbmU7IHotaW5kZXg6IC0xOycpO1xuICAgIGlmcmFtZS5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcbiAgICBpZnJhbWUudGFiSW5kZXggPSAtMTtcbiAgICBjb25zdCBjcm9zc29yaWdpbiA9IGlzX2Nyb3Nzb3JpZ2luKCk7XG4gICAgbGV0IHVuc3Vic2NyaWJlO1xuICAgIGlmIChjcm9zc29yaWdpbikge1xuICAgICAgICBpZnJhbWUuc3JjID0gXCJkYXRhOnRleHQvaHRtbCw8c2NyaXB0Pm9ucmVzaXplPWZ1bmN0aW9uKCl7cGFyZW50LnBvc3RNZXNzYWdlKDAsJyonKX08L3NjcmlwdD5cIjtcbiAgICAgICAgdW5zdWJzY3JpYmUgPSBsaXN0ZW4od2luZG93LCAnbWVzc2FnZScsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgaWYgKGV2ZW50LnNvdXJjZSA9PT0gaWZyYW1lLmNvbnRlbnRXaW5kb3cpXG4gICAgICAgICAgICAgICAgZm4oKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBpZnJhbWUuc3JjID0gJ2Fib3V0OmJsYW5rJztcbiAgICAgICAgaWZyYW1lLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgICAgIHVuc3Vic2NyaWJlID0gbGlzdGVuKGlmcmFtZS5jb250ZW50V2luZG93LCAncmVzaXplJywgZm4pO1xuICAgICAgICB9O1xuICAgIH1cbiAgICBhcHBlbmQobm9kZSwgaWZyYW1lKTtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICBpZiAoY3Jvc3NvcmlnaW4pIHtcbiAgICAgICAgICAgIHVuc3Vic2NyaWJlKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodW5zdWJzY3JpYmUgJiYgaWZyYW1lLmNvbnRlbnRXaW5kb3cpIHtcbiAgICAgICAgICAgIHVuc3Vic2NyaWJlKCk7XG4gICAgICAgIH1cbiAgICAgICAgZGV0YWNoKGlmcmFtZSk7XG4gICAgfTtcbn1cbmZ1bmN0aW9uIHRvZ2dsZV9jbGFzcyhlbGVtZW50LCBuYW1lLCB0b2dnbGUpIHtcbiAgICBlbGVtZW50LmNsYXNzTGlzdFt0b2dnbGUgPyAnYWRkJyA6ICdyZW1vdmUnXShuYW1lKTtcbn1cbmZ1bmN0aW9uIGN1c3RvbV9ldmVudCh0eXBlLCBkZXRhaWwsIHsgYnViYmxlcyA9IGZhbHNlLCBjYW5jZWxhYmxlID0gZmFsc2UgfSA9IHt9KSB7XG4gICAgY29uc3QgZSA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdDdXN0b21FdmVudCcpO1xuICAgIGUuaW5pdEN1c3RvbUV2ZW50KHR5cGUsIGJ1YmJsZXMsIGNhbmNlbGFibGUsIGRldGFpbCk7XG4gICAgcmV0dXJuIGU7XG59XG5mdW5jdGlvbiBxdWVyeV9zZWxlY3Rvcl9hbGwoc2VsZWN0b3IsIHBhcmVudCA9IGRvY3VtZW50LmJvZHkpIHtcbiAgICByZXR1cm4gQXJyYXkuZnJvbShwYXJlbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcikpO1xufVxuY2xhc3MgSHRtbFRhZyB7XG4gICAgY29uc3RydWN0b3IoaXNfc3ZnID0gZmFsc2UpIHtcbiAgICAgICAgdGhpcy5pc19zdmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5pc19zdmcgPSBpc19zdmc7XG4gICAgICAgIHRoaXMuZSA9IHRoaXMubiA9IG51bGw7XG4gICAgfVxuICAgIGMoaHRtbCkge1xuICAgICAgICB0aGlzLmgoaHRtbCk7XG4gICAgfVxuICAgIG0oaHRtbCwgdGFyZ2V0LCBhbmNob3IgPSBudWxsKSB7XG4gICAgICAgIGlmICghdGhpcy5lKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5pc19zdmcpXG4gICAgICAgICAgICAgICAgdGhpcy5lID0gc3ZnX2VsZW1lbnQodGFyZ2V0Lm5vZGVOYW1lKTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICB0aGlzLmUgPSBlbGVtZW50KHRhcmdldC5ub2RlTmFtZSk7XG4gICAgICAgICAgICB0aGlzLnQgPSB0YXJnZXQ7XG4gICAgICAgICAgICB0aGlzLmMoaHRtbCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pKGFuY2hvcik7XG4gICAgfVxuICAgIGgoaHRtbCkge1xuICAgICAgICB0aGlzLmUuaW5uZXJIVE1MID0gaHRtbDtcbiAgICAgICAgdGhpcy5uID0gQXJyYXkuZnJvbSh0aGlzLmUuY2hpbGROb2Rlcyk7XG4gICAgfVxuICAgIGkoYW5jaG9yKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5uLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICBpbnNlcnQodGhpcy50LCB0aGlzLm5baV0sIGFuY2hvcik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcChodG1sKSB7XG4gICAgICAgIHRoaXMuZCgpO1xuICAgICAgICB0aGlzLmgoaHRtbCk7XG4gICAgICAgIHRoaXMuaSh0aGlzLmEpO1xuICAgIH1cbiAgICBkKCkge1xuICAgICAgICB0aGlzLm4uZm9yRWFjaChkZXRhY2gpO1xuICAgIH1cbn1cbmNsYXNzIEh0bWxUYWdIeWRyYXRpb24gZXh0ZW5kcyBIdG1sVGFnIHtcbiAgICBjb25zdHJ1Y3RvcihjbGFpbWVkX25vZGVzLCBpc19zdmcgPSBmYWxzZSkge1xuICAgICAgICBzdXBlcihpc19zdmcpO1xuICAgICAgICB0aGlzLmUgPSB0aGlzLm4gPSBudWxsO1xuICAgICAgICB0aGlzLmwgPSBjbGFpbWVkX25vZGVzO1xuICAgIH1cbiAgICBjKGh0bWwpIHtcbiAgICAgICAgaWYgKHRoaXMubCkge1xuICAgICAgICAgICAgdGhpcy5uID0gdGhpcy5sO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgc3VwZXIuYyhodG1sKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpKGFuY2hvcikge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubi5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgaW5zZXJ0X2h5ZHJhdGlvbih0aGlzLnQsIHRoaXMubltpXSwgYW5jaG9yKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmZ1bmN0aW9uIGF0dHJpYnV0ZV90b19vYmplY3QoYXR0cmlidXRlcykge1xuICAgIGNvbnN0IHJlc3VsdCA9IHt9O1xuICAgIGZvciAoY29uc3QgYXR0cmlidXRlIG9mIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgcmVzdWx0W2F0dHJpYnV0ZS5uYW1lXSA9IGF0dHJpYnV0ZS52YWx1ZTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIGdldF9jdXN0b21fZWxlbWVudHNfc2xvdHMoZWxlbWVudCkge1xuICAgIGNvbnN0IHJlc3VsdCA9IHt9O1xuICAgIGVsZW1lbnQuY2hpbGROb2Rlcy5mb3JFYWNoKChub2RlKSA9PiB7XG4gICAgICAgIHJlc3VsdFtub2RlLnNsb3QgfHwgJ2RlZmF1bHQnXSA9IHRydWU7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLy8gd2UgbmVlZCB0byBzdG9yZSB0aGUgaW5mb3JtYXRpb24gZm9yIG11bHRpcGxlIGRvY3VtZW50cyBiZWNhdXNlIGEgU3ZlbHRlIGFwcGxpY2F0aW9uIGNvdWxkIGFsc28gY29udGFpbiBpZnJhbWVzXG4vLyBodHRwczovL2dpdGh1Yi5jb20vc3ZlbHRlanMvc3ZlbHRlL2lzc3Vlcy8zNjI0XG5jb25zdCBtYW5hZ2VkX3N0eWxlcyA9IG5ldyBNYXAoKTtcbmxldCBhY3RpdmUgPSAwO1xuLy8gaHR0cHM6Ly9naXRodWIuY29tL2Rhcmtza3lhcHAvc3RyaW5nLWhhc2gvYmxvYi9tYXN0ZXIvaW5kZXguanNcbmZ1bmN0aW9uIGhhc2goc3RyKSB7XG4gICAgbGV0IGhhc2ggPSA1MzgxO1xuICAgIGxldCBpID0gc3RyLmxlbmd0aDtcbiAgICB3aGlsZSAoaS0tKVxuICAgICAgICBoYXNoID0gKChoYXNoIDw8IDUpIC0gaGFzaCkgXiBzdHIuY2hhckNvZGVBdChpKTtcbiAgICByZXR1cm4gaGFzaCA+Pj4gMDtcbn1cbmZ1bmN0aW9uIGNyZWF0ZV9zdHlsZV9pbmZvcm1hdGlvbihkb2MsIG5vZGUpIHtcbiAgICBjb25zdCBpbmZvID0geyBzdHlsZXNoZWV0OiBhcHBlbmRfZW1wdHlfc3R5bGVzaGVldChub2RlKSwgcnVsZXM6IHt9IH07XG4gICAgbWFuYWdlZF9zdHlsZXMuc2V0KGRvYywgaW5mbyk7XG4gICAgcmV0dXJuIGluZm87XG59XG5mdW5jdGlvbiBjcmVhdGVfcnVsZShub2RlLCBhLCBiLCBkdXJhdGlvbiwgZGVsYXksIGVhc2UsIGZuLCB1aWQgPSAwKSB7XG4gICAgY29uc3Qgc3RlcCA9IDE2LjY2NiAvIGR1cmF0aW9uO1xuICAgIGxldCBrZXlmcmFtZXMgPSAne1xcbic7XG4gICAgZm9yIChsZXQgcCA9IDA7IHAgPD0gMTsgcCArPSBzdGVwKSB7XG4gICAgICAgIGNvbnN0IHQgPSBhICsgKGIgLSBhKSAqIGVhc2UocCk7XG4gICAgICAgIGtleWZyYW1lcyArPSBwICogMTAwICsgYCV7JHtmbih0LCAxIC0gdCl9fVxcbmA7XG4gICAgfVxuICAgIGNvbnN0IHJ1bGUgPSBrZXlmcmFtZXMgKyBgMTAwJSB7JHtmbihiLCAxIC0gYil9fVxcbn1gO1xuICAgIGNvbnN0IG5hbWUgPSBgX19zdmVsdGVfJHtoYXNoKHJ1bGUpfV8ke3VpZH1gO1xuICAgIGNvbnN0IGRvYyA9IGdldF9yb290X2Zvcl9zdHlsZShub2RlKTtcbiAgICBjb25zdCB7IHN0eWxlc2hlZXQsIHJ1bGVzIH0gPSBtYW5hZ2VkX3N0eWxlcy5nZXQoZG9jKSB8fCBjcmVhdGVfc3R5bGVfaW5mb3JtYXRpb24oZG9jLCBub2RlKTtcbiAgICBpZiAoIXJ1bGVzW25hbWVdKSB7XG4gICAgICAgIHJ1bGVzW25hbWVdID0gdHJ1ZTtcbiAgICAgICAgc3R5bGVzaGVldC5pbnNlcnRSdWxlKGBAa2V5ZnJhbWVzICR7bmFtZX0gJHtydWxlfWAsIHN0eWxlc2hlZXQuY3NzUnVsZXMubGVuZ3RoKTtcbiAgICB9XG4gICAgY29uc3QgYW5pbWF0aW9uID0gbm9kZS5zdHlsZS5hbmltYXRpb24gfHwgJyc7XG4gICAgbm9kZS5zdHlsZS5hbmltYXRpb24gPSBgJHthbmltYXRpb24gPyBgJHthbmltYXRpb259LCBgIDogJyd9JHtuYW1lfSAke2R1cmF0aW9ufW1zIGxpbmVhciAke2RlbGF5fW1zIDEgYm90aGA7XG4gICAgYWN0aXZlICs9IDE7XG4gICAgcmV0dXJuIG5hbWU7XG59XG5mdW5jdGlvbiBkZWxldGVfcnVsZShub2RlLCBuYW1lKSB7XG4gICAgY29uc3QgcHJldmlvdXMgPSAobm9kZS5zdHlsZS5hbmltYXRpb24gfHwgJycpLnNwbGl0KCcsICcpO1xuICAgIGNvbnN0IG5leHQgPSBwcmV2aW91cy5maWx0ZXIobmFtZVxuICAgICAgICA/IGFuaW0gPT4gYW5pbS5pbmRleE9mKG5hbWUpIDwgMCAvLyByZW1vdmUgc3BlY2lmaWMgYW5pbWF0aW9uXG4gICAgICAgIDogYW5pbSA9PiBhbmltLmluZGV4T2YoJ19fc3ZlbHRlJykgPT09IC0xIC8vIHJlbW92ZSBhbGwgU3ZlbHRlIGFuaW1hdGlvbnNcbiAgICApO1xuICAgIGNvbnN0IGRlbGV0ZWQgPSBwcmV2aW91cy5sZW5ndGggLSBuZXh0Lmxlbmd0aDtcbiAgICBpZiAoZGVsZXRlZCkge1xuICAgICAgICBub2RlLnN0eWxlLmFuaW1hdGlvbiA9IG5leHQuam9pbignLCAnKTtcbiAgICAgICAgYWN0aXZlIC09IGRlbGV0ZWQ7XG4gICAgICAgIGlmICghYWN0aXZlKVxuICAgICAgICAgICAgY2xlYXJfcnVsZXMoKTtcbiAgICB9XG59XG5mdW5jdGlvbiBjbGVhcl9ydWxlcygpIHtcbiAgICByYWYoKCkgPT4ge1xuICAgICAgICBpZiAoYWN0aXZlKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBtYW5hZ2VkX3N0eWxlcy5mb3JFYWNoKGluZm8gPT4ge1xuICAgICAgICAgICAgY29uc3QgeyBzdHlsZXNoZWV0IH0gPSBpbmZvO1xuICAgICAgICAgICAgbGV0IGkgPSBzdHlsZXNoZWV0LmNzc1J1bGVzLmxlbmd0aDtcbiAgICAgICAgICAgIHdoaWxlIChpLS0pXG4gICAgICAgICAgICAgICAgc3R5bGVzaGVldC5kZWxldGVSdWxlKGkpO1xuICAgICAgICAgICAgaW5mby5ydWxlcyA9IHt9O1xuICAgICAgICB9KTtcbiAgICAgICAgbWFuYWdlZF9zdHlsZXMuY2xlYXIoKTtcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlX2FuaW1hdGlvbihub2RlLCBmcm9tLCBmbiwgcGFyYW1zKSB7XG4gICAgaWYgKCFmcm9tKVxuICAgICAgICByZXR1cm4gbm9vcDtcbiAgICBjb25zdCB0byA9IG5vZGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgaWYgKGZyb20ubGVmdCA9PT0gdG8ubGVmdCAmJiBmcm9tLnJpZ2h0ID09PSB0by5yaWdodCAmJiBmcm9tLnRvcCA9PT0gdG8udG9wICYmIGZyb20uYm90dG9tID09PSB0by5ib3R0b20pXG4gICAgICAgIHJldHVybiBub29wO1xuICAgIGNvbnN0IHsgZGVsYXkgPSAwLCBkdXJhdGlvbiA9IDMwMCwgZWFzaW5nID0gaWRlbnRpdHksIFxuICAgIC8vIEB0cy1pZ25vcmUgdG9kbzogc2hvdWxkIHRoaXMgYmUgc2VwYXJhdGVkIGZyb20gZGVzdHJ1Y3R1cmluZz8gT3Igc3RhcnQvZW5kIGFkZGVkIHRvIHB1YmxpYyBhcGkgYW5kIGRvY3VtZW50YXRpb24/XG4gICAgc3RhcnQ6IHN0YXJ0X3RpbWUgPSBub3coKSArIGRlbGF5LCBcbiAgICAvLyBAdHMtaWdub3JlIHRvZG86XG4gICAgZW5kID0gc3RhcnRfdGltZSArIGR1cmF0aW9uLCB0aWNrID0gbm9vcCwgY3NzIH0gPSBmbihub2RlLCB7IGZyb20sIHRvIH0sIHBhcmFtcyk7XG4gICAgbGV0IHJ1bm5pbmcgPSB0cnVlO1xuICAgIGxldCBzdGFydGVkID0gZmFsc2U7XG4gICAgbGV0IG5hbWU7XG4gICAgZnVuY3Rpb24gc3RhcnQoKSB7XG4gICAgICAgIGlmIChjc3MpIHtcbiAgICAgICAgICAgIG5hbWUgPSBjcmVhdGVfcnVsZShub2RlLCAwLCAxLCBkdXJhdGlvbiwgZGVsYXksIGVhc2luZywgY3NzKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWRlbGF5KSB7XG4gICAgICAgICAgICBzdGFydGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiBzdG9wKCkge1xuICAgICAgICBpZiAoY3NzKVxuICAgICAgICAgICAgZGVsZXRlX3J1bGUobm9kZSwgbmFtZSk7XG4gICAgICAgIHJ1bm5pbmcgPSBmYWxzZTtcbiAgICB9XG4gICAgbG9vcChub3cgPT4ge1xuICAgICAgICBpZiAoIXN0YXJ0ZWQgJiYgbm93ID49IHN0YXJ0X3RpbWUpIHtcbiAgICAgICAgICAgIHN0YXJ0ZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzdGFydGVkICYmIG5vdyA+PSBlbmQpIHtcbiAgICAgICAgICAgIHRpY2soMSwgMCk7XG4gICAgICAgICAgICBzdG9wKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFydW5uaW5nKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHN0YXJ0ZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IHAgPSBub3cgLSBzdGFydF90aW1lO1xuICAgICAgICAgICAgY29uc3QgdCA9IDAgKyAxICogZWFzaW5nKHAgLyBkdXJhdGlvbik7XG4gICAgICAgICAgICB0aWNrKHQsIDEgLSB0KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9KTtcbiAgICBzdGFydCgpO1xuICAgIHRpY2soMCwgMSk7XG4gICAgcmV0dXJuIHN0b3A7XG59XG5mdW5jdGlvbiBmaXhfcG9zaXRpb24obm9kZSkge1xuICAgIGNvbnN0IHN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZShub2RlKTtcbiAgICBpZiAoc3R5bGUucG9zaXRpb24gIT09ICdhYnNvbHV0ZScgJiYgc3R5bGUucG9zaXRpb24gIT09ICdmaXhlZCcpIHtcbiAgICAgICAgY29uc3QgeyB3aWR0aCwgaGVpZ2h0IH0gPSBzdHlsZTtcbiAgICAgICAgY29uc3QgYSA9IG5vZGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIG5vZGUuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgICBub2RlLnN0eWxlLndpZHRoID0gd2lkdGg7XG4gICAgICAgIG5vZGUuc3R5bGUuaGVpZ2h0ID0gaGVpZ2h0O1xuICAgICAgICBhZGRfdHJhbnNmb3JtKG5vZGUsIGEpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGFkZF90cmFuc2Zvcm0obm9kZSwgYSkge1xuICAgIGNvbnN0IGIgPSBub2RlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGlmIChhLmxlZnQgIT09IGIubGVmdCB8fCBhLnRvcCAhPT0gYi50b3ApIHtcbiAgICAgICAgY29uc3Qgc3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKG5vZGUpO1xuICAgICAgICBjb25zdCB0cmFuc2Zvcm0gPSBzdHlsZS50cmFuc2Zvcm0gPT09ICdub25lJyA/ICcnIDogc3R5bGUudHJhbnNmb3JtO1xuICAgICAgICBub2RlLnN0eWxlLnRyYW5zZm9ybSA9IGAke3RyYW5zZm9ybX0gdHJhbnNsYXRlKCR7YS5sZWZ0IC0gYi5sZWZ0fXB4LCAke2EudG9wIC0gYi50b3B9cHgpYDtcbiAgICB9XG59XG5cbmxldCBjdXJyZW50X2NvbXBvbmVudDtcbmZ1bmN0aW9uIHNldF9jdXJyZW50X2NvbXBvbmVudChjb21wb25lbnQpIHtcbiAgICBjdXJyZW50X2NvbXBvbmVudCA9IGNvbXBvbmVudDtcbn1cbmZ1bmN0aW9uIGdldF9jdXJyZW50X2NvbXBvbmVudCgpIHtcbiAgICBpZiAoIWN1cnJlbnRfY29tcG9uZW50KVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Z1bmN0aW9uIGNhbGxlZCBvdXRzaWRlIGNvbXBvbmVudCBpbml0aWFsaXphdGlvbicpO1xuICAgIHJldHVybiBjdXJyZW50X2NvbXBvbmVudDtcbn1cbmZ1bmN0aW9uIGJlZm9yZVVwZGF0ZShmbikge1xuICAgIGdldF9jdXJyZW50X2NvbXBvbmVudCgpLiQkLmJlZm9yZV91cGRhdGUucHVzaChmbik7XG59XG5mdW5jdGlvbiBvbk1vdW50KGZuKSB7XG4gICAgZ2V0X2N1cnJlbnRfY29tcG9uZW50KCkuJCQub25fbW91bnQucHVzaChmbik7XG59XG5mdW5jdGlvbiBhZnRlclVwZGF0ZShmbikge1xuICAgIGdldF9jdXJyZW50X2NvbXBvbmVudCgpLiQkLmFmdGVyX3VwZGF0ZS5wdXNoKGZuKTtcbn1cbmZ1bmN0aW9uIG9uRGVzdHJveShmbikge1xuICAgIGdldF9jdXJyZW50X2NvbXBvbmVudCgpLiQkLm9uX2Rlc3Ryb3kucHVzaChmbik7XG59XG5mdW5jdGlvbiBjcmVhdGVFdmVudERpc3BhdGNoZXIoKSB7XG4gICAgY29uc3QgY29tcG9uZW50ID0gZ2V0X2N1cnJlbnRfY29tcG9uZW50KCk7XG4gICAgcmV0dXJuICh0eXBlLCBkZXRhaWwsIHsgY2FuY2VsYWJsZSA9IGZhbHNlIH0gPSB7fSkgPT4ge1xuICAgICAgICBjb25zdCBjYWxsYmFja3MgPSBjb21wb25lbnQuJCQuY2FsbGJhY2tzW3R5cGVdO1xuICAgICAgICBpZiAoY2FsbGJhY2tzKSB7XG4gICAgICAgICAgICAvLyBUT0RPIGFyZSB0aGVyZSBzaXR1YXRpb25zIHdoZXJlIGV2ZW50cyBjb3VsZCBiZSBkaXNwYXRjaGVkXG4gICAgICAgICAgICAvLyBpbiBhIHNlcnZlciAobm9uLURPTSkgZW52aXJvbm1lbnQ/XG4gICAgICAgICAgICBjb25zdCBldmVudCA9IGN1c3RvbV9ldmVudCh0eXBlLCBkZXRhaWwsIHsgY2FuY2VsYWJsZSB9KTtcbiAgICAgICAgICAgIGNhbGxiYWNrcy5zbGljZSgpLmZvckVhY2goZm4gPT4ge1xuICAgICAgICAgICAgICAgIGZuLmNhbGwoY29tcG9uZW50LCBldmVudCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiAhZXZlbnQuZGVmYXVsdFByZXZlbnRlZDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9O1xufVxuZnVuY3Rpb24gc2V0Q29udGV4dChrZXksIGNvbnRleHQpIHtcbiAgICBnZXRfY3VycmVudF9jb21wb25lbnQoKS4kJC5jb250ZXh0LnNldChrZXksIGNvbnRleHQpO1xuICAgIHJldHVybiBjb250ZXh0O1xufVxuZnVuY3Rpb24gZ2V0Q29udGV4dChrZXkpIHtcbiAgICByZXR1cm4gZ2V0X2N1cnJlbnRfY29tcG9uZW50KCkuJCQuY29udGV4dC5nZXQoa2V5KTtcbn1cbmZ1bmN0aW9uIGdldEFsbENvbnRleHRzKCkge1xuICAgIHJldHVybiBnZXRfY3VycmVudF9jb21wb25lbnQoKS4kJC5jb250ZXh0O1xufVxuZnVuY3Rpb24gaGFzQ29udGV4dChrZXkpIHtcbiAgICByZXR1cm4gZ2V0X2N1cnJlbnRfY29tcG9uZW50KCkuJCQuY29udGV4dC5oYXMoa2V5KTtcbn1cbi8vIFRPRE8gZmlndXJlIG91dCBpZiB3ZSBzdGlsbCB3YW50IHRvIHN1cHBvcnRcbi8vIHNob3J0aGFuZCBldmVudHMsIG9yIGlmIHdlIHdhbnQgdG8gaW1wbGVtZW50XG4vLyBhIHJlYWwgYnViYmxpbmcgbWVjaGFuaXNtXG5mdW5jdGlvbiBidWJibGUoY29tcG9uZW50LCBldmVudCkge1xuICAgIGNvbnN0IGNhbGxiYWNrcyA9IGNvbXBvbmVudC4kJC5jYWxsYmFja3NbZXZlbnQudHlwZV07XG4gICAgaWYgKGNhbGxiYWNrcykge1xuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIGNhbGxiYWNrcy5zbGljZSgpLmZvckVhY2goZm4gPT4gZm4uY2FsbCh0aGlzLCBldmVudCkpO1xuICAgIH1cbn1cblxuY29uc3QgZGlydHlfY29tcG9uZW50cyA9IFtdO1xuY29uc3QgaW50cm9zID0geyBlbmFibGVkOiBmYWxzZSB9O1xuY29uc3QgYmluZGluZ19jYWxsYmFja3MgPSBbXTtcbmNvbnN0IHJlbmRlcl9jYWxsYmFja3MgPSBbXTtcbmNvbnN0IGZsdXNoX2NhbGxiYWNrcyA9IFtdO1xuY29uc3QgcmVzb2x2ZWRfcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xubGV0IHVwZGF0ZV9zY2hlZHVsZWQgPSBmYWxzZTtcbmZ1bmN0aW9uIHNjaGVkdWxlX3VwZGF0ZSgpIHtcbiAgICBpZiAoIXVwZGF0ZV9zY2hlZHVsZWQpIHtcbiAgICAgICAgdXBkYXRlX3NjaGVkdWxlZCA9IHRydWU7XG4gICAgICAgIHJlc29sdmVkX3Byb21pc2UudGhlbihmbHVzaCk7XG4gICAgfVxufVxuZnVuY3Rpb24gdGljaygpIHtcbiAgICBzY2hlZHVsZV91cGRhdGUoKTtcbiAgICByZXR1cm4gcmVzb2x2ZWRfcHJvbWlzZTtcbn1cbmZ1bmN0aW9uIGFkZF9yZW5kZXJfY2FsbGJhY2soZm4pIHtcbiAgICByZW5kZXJfY2FsbGJhY2tzLnB1c2goZm4pO1xufVxuZnVuY3Rpb24gYWRkX2ZsdXNoX2NhbGxiYWNrKGZuKSB7XG4gICAgZmx1c2hfY2FsbGJhY2tzLnB1c2goZm4pO1xufVxuLy8gZmx1c2goKSBjYWxscyBjYWxsYmFja3MgaW4gdGhpcyBvcmRlcjpcbi8vIDEuIEFsbCBiZWZvcmVVcGRhdGUgY2FsbGJhY2tzLCBpbiBvcmRlcjogcGFyZW50cyBiZWZvcmUgY2hpbGRyZW5cbi8vIDIuIEFsbCBiaW5kOnRoaXMgY2FsbGJhY2tzLCBpbiByZXZlcnNlIG9yZGVyOiBjaGlsZHJlbiBiZWZvcmUgcGFyZW50cy5cbi8vIDMuIEFsbCBhZnRlclVwZGF0ZSBjYWxsYmFja3MsIGluIG9yZGVyOiBwYXJlbnRzIGJlZm9yZSBjaGlsZHJlbi4gRVhDRVBUXG4vLyAgICBmb3IgYWZ0ZXJVcGRhdGVzIGNhbGxlZCBkdXJpbmcgdGhlIGluaXRpYWwgb25Nb3VudCwgd2hpY2ggYXJlIGNhbGxlZCBpblxuLy8gICAgcmV2ZXJzZSBvcmRlcjogY2hpbGRyZW4gYmVmb3JlIHBhcmVudHMuXG4vLyBTaW5jZSBjYWxsYmFja3MgbWlnaHQgdXBkYXRlIGNvbXBvbmVudCB2YWx1ZXMsIHdoaWNoIGNvdWxkIHRyaWdnZXIgYW5vdGhlclxuLy8gY2FsbCB0byBmbHVzaCgpLCB0aGUgZm9sbG93aW5nIHN0ZXBzIGd1YXJkIGFnYWluc3QgdGhpczpcbi8vIDEuIER1cmluZyBiZWZvcmVVcGRhdGUsIGFueSB1cGRhdGVkIGNvbXBvbmVudHMgd2lsbCBiZSBhZGRlZCB0byB0aGVcbi8vICAgIGRpcnR5X2NvbXBvbmVudHMgYXJyYXkgYW5kIHdpbGwgY2F1c2UgYSByZWVudHJhbnQgY2FsbCB0byBmbHVzaCgpLiBCZWNhdXNlXG4vLyAgICB0aGUgZmx1c2ggaW5kZXggaXMga2VwdCBvdXRzaWRlIHRoZSBmdW5jdGlvbiwgdGhlIHJlZW50cmFudCBjYWxsIHdpbGwgcGlja1xuLy8gICAgdXAgd2hlcmUgdGhlIGVhcmxpZXIgY2FsbCBsZWZ0IG9mZiBhbmQgZ28gdGhyb3VnaCBhbGwgZGlydHkgY29tcG9uZW50cy4gVGhlXG4vLyAgICBjdXJyZW50X2NvbXBvbmVudCB2YWx1ZSBpcyBzYXZlZCBhbmQgcmVzdG9yZWQgc28gdGhhdCB0aGUgcmVlbnRyYW50IGNhbGwgd2lsbFxuLy8gICAgbm90IGludGVyZmVyZSB3aXRoIHRoZSBcInBhcmVudFwiIGZsdXNoKCkgY2FsbC5cbi8vIDIuIGJpbmQ6dGhpcyBjYWxsYmFja3MgY2Fubm90IHRyaWdnZXIgbmV3IGZsdXNoKCkgY2FsbHMuXG4vLyAzLiBEdXJpbmcgYWZ0ZXJVcGRhdGUsIGFueSB1cGRhdGVkIGNvbXBvbmVudHMgd2lsbCBOT1QgaGF2ZSB0aGVpciBhZnRlclVwZGF0ZVxuLy8gICAgY2FsbGJhY2sgY2FsbGVkIGEgc2Vjb25kIHRpbWU7IHRoZSBzZWVuX2NhbGxiYWNrcyBzZXQsIG91dHNpZGUgdGhlIGZsdXNoKClcbi8vICAgIGZ1bmN0aW9uLCBndWFyYW50ZWVzIHRoaXMgYmVoYXZpb3IuXG5jb25zdCBzZWVuX2NhbGxiYWNrcyA9IG5ldyBTZXQoKTtcbmxldCBmbHVzaGlkeCA9IDA7IC8vIERvICpub3QqIG1vdmUgdGhpcyBpbnNpZGUgdGhlIGZsdXNoKCkgZnVuY3Rpb25cbmZ1bmN0aW9uIGZsdXNoKCkge1xuICAgIGNvbnN0IHNhdmVkX2NvbXBvbmVudCA9IGN1cnJlbnRfY29tcG9uZW50O1xuICAgIGRvIHtcbiAgICAgICAgLy8gZmlyc3QsIGNhbGwgYmVmb3JlVXBkYXRlIGZ1bmN0aW9uc1xuICAgICAgICAvLyBhbmQgdXBkYXRlIGNvbXBvbmVudHNcbiAgICAgICAgd2hpbGUgKGZsdXNoaWR4IDwgZGlydHlfY29tcG9uZW50cy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbnN0IGNvbXBvbmVudCA9IGRpcnR5X2NvbXBvbmVudHNbZmx1c2hpZHhdO1xuICAgICAgICAgICAgZmx1c2hpZHgrKztcbiAgICAgICAgICAgIHNldF9jdXJyZW50X2NvbXBvbmVudChjb21wb25lbnQpO1xuICAgICAgICAgICAgdXBkYXRlKGNvbXBvbmVudC4kJCk7XG4gICAgICAgIH1cbiAgICAgICAgc2V0X2N1cnJlbnRfY29tcG9uZW50KG51bGwpO1xuICAgICAgICBkaXJ0eV9jb21wb25lbnRzLmxlbmd0aCA9IDA7XG4gICAgICAgIGZsdXNoaWR4ID0gMDtcbiAgICAgICAgd2hpbGUgKGJpbmRpbmdfY2FsbGJhY2tzLmxlbmd0aClcbiAgICAgICAgICAgIGJpbmRpbmdfY2FsbGJhY2tzLnBvcCgpKCk7XG4gICAgICAgIC8vIHRoZW4sIG9uY2UgY29tcG9uZW50cyBhcmUgdXBkYXRlZCwgY2FsbFxuICAgICAgICAvLyBhZnRlclVwZGF0ZSBmdW5jdGlvbnMuIFRoaXMgbWF5IGNhdXNlXG4gICAgICAgIC8vIHN1YnNlcXVlbnQgdXBkYXRlcy4uLlxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJlbmRlcl9jYWxsYmFja3MubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGNvbnN0IGNhbGxiYWNrID0gcmVuZGVyX2NhbGxiYWNrc1tpXTtcbiAgICAgICAgICAgIGlmICghc2Vlbl9jYWxsYmFja3MuaGFzKGNhbGxiYWNrKSkge1xuICAgICAgICAgICAgICAgIC8vIC4uLnNvIGd1YXJkIGFnYWluc3QgaW5maW5pdGUgbG9vcHNcbiAgICAgICAgICAgICAgICBzZWVuX2NhbGxiYWNrcy5hZGQoY2FsbGJhY2spO1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmVuZGVyX2NhbGxiYWNrcy5sZW5ndGggPSAwO1xuICAgIH0gd2hpbGUgKGRpcnR5X2NvbXBvbmVudHMubGVuZ3RoKTtcbiAgICB3aGlsZSAoZmx1c2hfY2FsbGJhY2tzLmxlbmd0aCkge1xuICAgICAgICBmbHVzaF9jYWxsYmFja3MucG9wKCkoKTtcbiAgICB9XG4gICAgdXBkYXRlX3NjaGVkdWxlZCA9IGZhbHNlO1xuICAgIHNlZW5fY2FsbGJhY2tzLmNsZWFyKCk7XG4gICAgc2V0X2N1cnJlbnRfY29tcG9uZW50KHNhdmVkX2NvbXBvbmVudCk7XG59XG5mdW5jdGlvbiB1cGRhdGUoJCQpIHtcbiAgICBpZiAoJCQuZnJhZ21lbnQgIT09IG51bGwpIHtcbiAgICAgICAgJCQudXBkYXRlKCk7XG4gICAgICAgIHJ1bl9hbGwoJCQuYmVmb3JlX3VwZGF0ZSk7XG4gICAgICAgIGNvbnN0IGRpcnR5ID0gJCQuZGlydHk7XG4gICAgICAgICQkLmRpcnR5ID0gWy0xXTtcbiAgICAgICAgJCQuZnJhZ21lbnQgJiYgJCQuZnJhZ21lbnQucCgkJC5jdHgsIGRpcnR5KTtcbiAgICAgICAgJCQuYWZ0ZXJfdXBkYXRlLmZvckVhY2goYWRkX3JlbmRlcl9jYWxsYmFjayk7XG4gICAgfVxufVxuXG5sZXQgcHJvbWlzZTtcbmZ1bmN0aW9uIHdhaXQoKSB7XG4gICAgaWYgKCFwcm9taXNlKSB7XG4gICAgICAgIHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHByb21pc2UgPSBudWxsO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHByb21pc2U7XG59XG5mdW5jdGlvbiBkaXNwYXRjaChub2RlLCBkaXJlY3Rpb24sIGtpbmQpIHtcbiAgICBub2RlLmRpc3BhdGNoRXZlbnQoY3VzdG9tX2V2ZW50KGAke2RpcmVjdGlvbiA/ICdpbnRybycgOiAnb3V0cm8nfSR7a2luZH1gKSk7XG59XG5jb25zdCBvdXRyb2luZyA9IG5ldyBTZXQoKTtcbmxldCBvdXRyb3M7XG5mdW5jdGlvbiBncm91cF9vdXRyb3MoKSB7XG4gICAgb3V0cm9zID0ge1xuICAgICAgICByOiAwLFxuICAgICAgICBjOiBbXSxcbiAgICAgICAgcDogb3V0cm9zIC8vIHBhcmVudCBncm91cFxuICAgIH07XG59XG5mdW5jdGlvbiBjaGVja19vdXRyb3MoKSB7XG4gICAgaWYgKCFvdXRyb3Mucikge1xuICAgICAgICBydW5fYWxsKG91dHJvcy5jKTtcbiAgICB9XG4gICAgb3V0cm9zID0gb3V0cm9zLnA7XG59XG5mdW5jdGlvbiB0cmFuc2l0aW9uX2luKGJsb2NrLCBsb2NhbCkge1xuICAgIGlmIChibG9jayAmJiBibG9jay5pKSB7XG4gICAgICAgIG91dHJvaW5nLmRlbGV0ZShibG9jayk7XG4gICAgICAgIGJsb2NrLmkobG9jYWwpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHRyYW5zaXRpb25fb3V0KGJsb2NrLCBsb2NhbCwgZGV0YWNoLCBjYWxsYmFjaykge1xuICAgIGlmIChibG9jayAmJiBibG9jay5vKSB7XG4gICAgICAgIGlmIChvdXRyb2luZy5oYXMoYmxvY2spKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBvdXRyb2luZy5hZGQoYmxvY2spO1xuICAgICAgICBvdXRyb3MuYy5wdXNoKCgpID0+IHtcbiAgICAgICAgICAgIG91dHJvaW5nLmRlbGV0ZShibG9jayk7XG4gICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICBpZiAoZGV0YWNoKVxuICAgICAgICAgICAgICAgICAgICBibG9jay5kKDEpO1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBibG9jay5vKGxvY2FsKTtcbiAgICB9XG59XG5jb25zdCBudWxsX3RyYW5zaXRpb24gPSB7IGR1cmF0aW9uOiAwIH07XG5mdW5jdGlvbiBjcmVhdGVfaW5fdHJhbnNpdGlvbihub2RlLCBmbiwgcGFyYW1zKSB7XG4gICAgbGV0IGNvbmZpZyA9IGZuKG5vZGUsIHBhcmFtcyk7XG4gICAgbGV0IHJ1bm5pbmcgPSBmYWxzZTtcbiAgICBsZXQgYW5pbWF0aW9uX25hbWU7XG4gICAgbGV0IHRhc2s7XG4gICAgbGV0IHVpZCA9IDA7XG4gICAgZnVuY3Rpb24gY2xlYW51cCgpIHtcbiAgICAgICAgaWYgKGFuaW1hdGlvbl9uYW1lKVxuICAgICAgICAgICAgZGVsZXRlX3J1bGUobm9kZSwgYW5pbWF0aW9uX25hbWUpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBnbygpIHtcbiAgICAgICAgY29uc3QgeyBkZWxheSA9IDAsIGR1cmF0aW9uID0gMzAwLCBlYXNpbmcgPSBpZGVudGl0eSwgdGljayA9IG5vb3AsIGNzcyB9ID0gY29uZmlnIHx8IG51bGxfdHJhbnNpdGlvbjtcbiAgICAgICAgaWYgKGNzcylcbiAgICAgICAgICAgIGFuaW1hdGlvbl9uYW1lID0gY3JlYXRlX3J1bGUobm9kZSwgMCwgMSwgZHVyYXRpb24sIGRlbGF5LCBlYXNpbmcsIGNzcywgdWlkKyspO1xuICAgICAgICB0aWNrKDAsIDEpO1xuICAgICAgICBjb25zdCBzdGFydF90aW1lID0gbm93KCkgKyBkZWxheTtcbiAgICAgICAgY29uc3QgZW5kX3RpbWUgPSBzdGFydF90aW1lICsgZHVyYXRpb247XG4gICAgICAgIGlmICh0YXNrKVxuICAgICAgICAgICAgdGFzay5hYm9ydCgpO1xuICAgICAgICBydW5uaW5nID0gdHJ1ZTtcbiAgICAgICAgYWRkX3JlbmRlcl9jYWxsYmFjaygoKSA9PiBkaXNwYXRjaChub2RlLCB0cnVlLCAnc3RhcnQnKSk7XG4gICAgICAgIHRhc2sgPSBsb29wKG5vdyA9PiB7XG4gICAgICAgICAgICBpZiAocnVubmluZykge1xuICAgICAgICAgICAgICAgIGlmIChub3cgPj0gZW5kX3RpbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGljaygxLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgZGlzcGF0Y2gobm9kZSwgdHJ1ZSwgJ2VuZCcpO1xuICAgICAgICAgICAgICAgICAgICBjbGVhbnVwKCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBydW5uaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChub3cgPj0gc3RhcnRfdGltZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0ID0gZWFzaW5nKChub3cgLSBzdGFydF90aW1lKSAvIGR1cmF0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgdGljayh0LCAxIC0gdCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJ1bm5pbmc7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBsZXQgc3RhcnRlZCA9IGZhbHNlO1xuICAgIHJldHVybiB7XG4gICAgICAgIHN0YXJ0KCkge1xuICAgICAgICAgICAgaWYgKHN0YXJ0ZWQpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgc3RhcnRlZCA9IHRydWU7XG4gICAgICAgICAgICBkZWxldGVfcnVsZShub2RlKTtcbiAgICAgICAgICAgIGlmIChpc19mdW5jdGlvbihjb25maWcpKSB7XG4gICAgICAgICAgICAgICAgY29uZmlnID0gY29uZmlnKCk7XG4gICAgICAgICAgICAgICAgd2FpdCgpLnRoZW4oZ28pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZ28oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgaW52YWxpZGF0ZSgpIHtcbiAgICAgICAgICAgIHN0YXJ0ZWQgPSBmYWxzZTtcbiAgICAgICAgfSxcbiAgICAgICAgZW5kKCkge1xuICAgICAgICAgICAgaWYgKHJ1bm5pbmcpIHtcbiAgICAgICAgICAgICAgICBjbGVhbnVwKCk7XG4gICAgICAgICAgICAgICAgcnVubmluZyA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZV9vdXRfdHJhbnNpdGlvbihub2RlLCBmbiwgcGFyYW1zKSB7XG4gICAgbGV0IGNvbmZpZyA9IGZuKG5vZGUsIHBhcmFtcyk7XG4gICAgbGV0IHJ1bm5pbmcgPSB0cnVlO1xuICAgIGxldCBhbmltYXRpb25fbmFtZTtcbiAgICBjb25zdCBncm91cCA9IG91dHJvcztcbiAgICBncm91cC5yICs9IDE7XG4gICAgZnVuY3Rpb24gZ28oKSB7XG4gICAgICAgIGNvbnN0IHsgZGVsYXkgPSAwLCBkdXJhdGlvbiA9IDMwMCwgZWFzaW5nID0gaWRlbnRpdHksIHRpY2sgPSBub29wLCBjc3MgfSA9IGNvbmZpZyB8fCBudWxsX3RyYW5zaXRpb247XG4gICAgICAgIGlmIChjc3MpXG4gICAgICAgICAgICBhbmltYXRpb25fbmFtZSA9IGNyZWF0ZV9ydWxlKG5vZGUsIDEsIDAsIGR1cmF0aW9uLCBkZWxheSwgZWFzaW5nLCBjc3MpO1xuICAgICAgICBjb25zdCBzdGFydF90aW1lID0gbm93KCkgKyBkZWxheTtcbiAgICAgICAgY29uc3QgZW5kX3RpbWUgPSBzdGFydF90aW1lICsgZHVyYXRpb247XG4gICAgICAgIGFkZF9yZW5kZXJfY2FsbGJhY2soKCkgPT4gZGlzcGF0Y2gobm9kZSwgZmFsc2UsICdzdGFydCcpKTtcbiAgICAgICAgbG9vcChub3cgPT4ge1xuICAgICAgICAgICAgaWYgKHJ1bm5pbmcpIHtcbiAgICAgICAgICAgICAgICBpZiAobm93ID49IGVuZF90aW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIHRpY2soMCwgMSk7XG4gICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoKG5vZGUsIGZhbHNlLCAnZW5kJyk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghLS1ncm91cC5yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGlzIHdpbGwgcmVzdWx0IGluIGBlbmQoKWAgYmVpbmcgY2FsbGVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gc28gd2UgZG9uJ3QgbmVlZCB0byBjbGVhbiB1cCBoZXJlXG4gICAgICAgICAgICAgICAgICAgICAgICBydW5fYWxsKGdyb3VwLmMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKG5vdyA+PSBzdGFydF90aW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHQgPSBlYXNpbmcoKG5vdyAtIHN0YXJ0X3RpbWUpIC8gZHVyYXRpb24pO1xuICAgICAgICAgICAgICAgICAgICB0aWNrKDEgLSB0LCB0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcnVubmluZztcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChpc19mdW5jdGlvbihjb25maWcpKSB7XG4gICAgICAgIHdhaXQoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgIGNvbmZpZyA9IGNvbmZpZygpO1xuICAgICAgICAgICAgZ28oKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBnbygpO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgICBlbmQocmVzZXQpIHtcbiAgICAgICAgICAgIGlmIChyZXNldCAmJiBjb25maWcudGljaykge1xuICAgICAgICAgICAgICAgIGNvbmZpZy50aWNrKDEsIDApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHJ1bm5pbmcpIHtcbiAgICAgICAgICAgICAgICBpZiAoYW5pbWF0aW9uX25hbWUpXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZV9ydWxlKG5vZGUsIGFuaW1hdGlvbl9uYW1lKTtcbiAgICAgICAgICAgICAgICBydW5uaW5nID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xufVxuZnVuY3Rpb24gY3JlYXRlX2JpZGlyZWN0aW9uYWxfdHJhbnNpdGlvbihub2RlLCBmbiwgcGFyYW1zLCBpbnRybykge1xuICAgIGxldCBjb25maWcgPSBmbihub2RlLCBwYXJhbXMpO1xuICAgIGxldCB0ID0gaW50cm8gPyAwIDogMTtcbiAgICBsZXQgcnVubmluZ19wcm9ncmFtID0gbnVsbDtcbiAgICBsZXQgcGVuZGluZ19wcm9ncmFtID0gbnVsbDtcbiAgICBsZXQgYW5pbWF0aW9uX25hbWUgPSBudWxsO1xuICAgIGZ1bmN0aW9uIGNsZWFyX2FuaW1hdGlvbigpIHtcbiAgICAgICAgaWYgKGFuaW1hdGlvbl9uYW1lKVxuICAgICAgICAgICAgZGVsZXRlX3J1bGUobm9kZSwgYW5pbWF0aW9uX25hbWUpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBpbml0KHByb2dyYW0sIGR1cmF0aW9uKSB7XG4gICAgICAgIGNvbnN0IGQgPSAocHJvZ3JhbS5iIC0gdCk7XG4gICAgICAgIGR1cmF0aW9uICo9IE1hdGguYWJzKGQpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYTogdCxcbiAgICAgICAgICAgIGI6IHByb2dyYW0uYixcbiAgICAgICAgICAgIGQsXG4gICAgICAgICAgICBkdXJhdGlvbixcbiAgICAgICAgICAgIHN0YXJ0OiBwcm9ncmFtLnN0YXJ0LFxuICAgICAgICAgICAgZW5kOiBwcm9ncmFtLnN0YXJ0ICsgZHVyYXRpb24sXG4gICAgICAgICAgICBncm91cDogcHJvZ3JhbS5ncm91cFxuICAgICAgICB9O1xuICAgIH1cbiAgICBmdW5jdGlvbiBnbyhiKSB7XG4gICAgICAgIGNvbnN0IHsgZGVsYXkgPSAwLCBkdXJhdGlvbiA9IDMwMCwgZWFzaW5nID0gaWRlbnRpdHksIHRpY2sgPSBub29wLCBjc3MgfSA9IGNvbmZpZyB8fCBudWxsX3RyYW5zaXRpb247XG4gICAgICAgIGNvbnN0IHByb2dyYW0gPSB7XG4gICAgICAgICAgICBzdGFydDogbm93KCkgKyBkZWxheSxcbiAgICAgICAgICAgIGJcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKCFiKSB7XG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlIHRvZG86IGltcHJvdmUgdHlwaW5nc1xuICAgICAgICAgICAgcHJvZ3JhbS5ncm91cCA9IG91dHJvcztcbiAgICAgICAgICAgIG91dHJvcy5yICs9IDE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJ1bm5pbmdfcHJvZ3JhbSB8fCBwZW5kaW5nX3Byb2dyYW0pIHtcbiAgICAgICAgICAgIHBlbmRpbmdfcHJvZ3JhbSA9IHByb2dyYW07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBpZiB0aGlzIGlzIGFuIGludHJvLCBhbmQgdGhlcmUncyBhIGRlbGF5LCB3ZSBuZWVkIHRvIGRvXG4gICAgICAgICAgICAvLyBhbiBpbml0aWFsIHRpY2sgYW5kL29yIGFwcGx5IENTUyBhbmltYXRpb24gaW1tZWRpYXRlbHlcbiAgICAgICAgICAgIGlmIChjc3MpIHtcbiAgICAgICAgICAgICAgICBjbGVhcl9hbmltYXRpb24oKTtcbiAgICAgICAgICAgICAgICBhbmltYXRpb25fbmFtZSA9IGNyZWF0ZV9ydWxlKG5vZGUsIHQsIGIsIGR1cmF0aW9uLCBkZWxheSwgZWFzaW5nLCBjc3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGIpXG4gICAgICAgICAgICAgICAgdGljaygwLCAxKTtcbiAgICAgICAgICAgIHJ1bm5pbmdfcHJvZ3JhbSA9IGluaXQocHJvZ3JhbSwgZHVyYXRpb24pO1xuICAgICAgICAgICAgYWRkX3JlbmRlcl9jYWxsYmFjaygoKSA9PiBkaXNwYXRjaChub2RlLCBiLCAnc3RhcnQnKSk7XG4gICAgICAgICAgICBsb29wKG5vdyA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHBlbmRpbmdfcHJvZ3JhbSAmJiBub3cgPiBwZW5kaW5nX3Byb2dyYW0uc3RhcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgcnVubmluZ19wcm9ncmFtID0gaW5pdChwZW5kaW5nX3Byb2dyYW0sIGR1cmF0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgcGVuZGluZ19wcm9ncmFtID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgZGlzcGF0Y2gobm9kZSwgcnVubmluZ19wcm9ncmFtLmIsICdzdGFydCcpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY3NzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGVhcl9hbmltYXRpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdGlvbl9uYW1lID0gY3JlYXRlX3J1bGUobm9kZSwgdCwgcnVubmluZ19wcm9ncmFtLmIsIHJ1bm5pbmdfcHJvZ3JhbS5kdXJhdGlvbiwgMCwgZWFzaW5nLCBjb25maWcuY3NzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocnVubmluZ19wcm9ncmFtKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChub3cgPj0gcnVubmluZ19wcm9ncmFtLmVuZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGljayh0ID0gcnVubmluZ19wcm9ncmFtLmIsIDEgLSB0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoKG5vZGUsIHJ1bm5pbmdfcHJvZ3JhbS5iLCAnZW5kJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXBlbmRpbmdfcHJvZ3JhbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHdlJ3JlIGRvbmVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocnVubmluZ19wcm9ncmFtLmIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaW50cm8g4oCUIHdlIGNhbiB0aWR5IHVwIGltbWVkaWF0ZWx5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFyX2FuaW1hdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gb3V0cm8g4oCUIG5lZWRzIHRvIGJlIGNvb3JkaW5hdGVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghLS1ydW5uaW5nX3Byb2dyYW0uZ3JvdXAucilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJ1bl9hbGwocnVubmluZ19wcm9ncmFtLmdyb3VwLmMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJ1bm5pbmdfcHJvZ3JhbSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAobm93ID49IHJ1bm5pbmdfcHJvZ3JhbS5zdGFydCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcCA9IG5vdyAtIHJ1bm5pbmdfcHJvZ3JhbS5zdGFydDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHQgPSBydW5uaW5nX3Byb2dyYW0uYSArIHJ1bm5pbmdfcHJvZ3JhbS5kICogZWFzaW5nKHAgLyBydW5uaW5nX3Byb2dyYW0uZHVyYXRpb24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGljayh0LCAxIC0gdCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuICEhKHJ1bm5pbmdfcHJvZ3JhbSB8fCBwZW5kaW5nX3Byb2dyYW0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcnVuKGIpIHtcbiAgICAgICAgICAgIGlmIChpc19mdW5jdGlvbihjb25maWcpKSB7XG4gICAgICAgICAgICAgICAgd2FpdCgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZyA9IGNvbmZpZygpO1xuICAgICAgICAgICAgICAgICAgICBnbyhiKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGdvKGIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBlbmQoKSB7XG4gICAgICAgICAgICBjbGVhcl9hbmltYXRpb24oKTtcbiAgICAgICAgICAgIHJ1bm5pbmdfcHJvZ3JhbSA9IHBlbmRpbmdfcHJvZ3JhbSA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9O1xufVxuXG5mdW5jdGlvbiBoYW5kbGVfcHJvbWlzZShwcm9taXNlLCBpbmZvKSB7XG4gICAgY29uc3QgdG9rZW4gPSBpbmZvLnRva2VuID0ge307XG4gICAgZnVuY3Rpb24gdXBkYXRlKHR5cGUsIGluZGV4LCBrZXksIHZhbHVlKSB7XG4gICAgICAgIGlmIChpbmZvLnRva2VuICE9PSB0b2tlbilcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgaW5mby5yZXNvbHZlZCA9IHZhbHVlO1xuICAgICAgICBsZXQgY2hpbGRfY3R4ID0gaW5mby5jdHg7XG4gICAgICAgIGlmIChrZXkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY2hpbGRfY3R4ID0gY2hpbGRfY3R4LnNsaWNlKCk7XG4gICAgICAgICAgICBjaGlsZF9jdHhba2V5XSA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGJsb2NrID0gdHlwZSAmJiAoaW5mby5jdXJyZW50ID0gdHlwZSkoY2hpbGRfY3R4KTtcbiAgICAgICAgbGV0IG5lZWRzX2ZsdXNoID0gZmFsc2U7XG4gICAgICAgIGlmIChpbmZvLmJsb2NrKSB7XG4gICAgICAgICAgICBpZiAoaW5mby5ibG9ja3MpIHtcbiAgICAgICAgICAgICAgICBpbmZvLmJsb2Nrcy5mb3JFYWNoKChibG9jaywgaSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaSAhPT0gaW5kZXggJiYgYmxvY2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwX291dHJvcygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbl9vdXQoYmxvY2ssIDEsIDEsICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5mby5ibG9ja3NbaV0gPT09IGJsb2NrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZm8uYmxvY2tzW2ldID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoZWNrX291dHJvcygpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpbmZvLmJsb2NrLmQoMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBibG9jay5jKCk7XG4gICAgICAgICAgICB0cmFuc2l0aW9uX2luKGJsb2NrLCAxKTtcbiAgICAgICAgICAgIGJsb2NrLm0oaW5mby5tb3VudCgpLCBpbmZvLmFuY2hvcik7XG4gICAgICAgICAgICBuZWVkc19mbHVzaCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaW5mby5ibG9jayA9IGJsb2NrO1xuICAgICAgICBpZiAoaW5mby5ibG9ja3MpXG4gICAgICAgICAgICBpbmZvLmJsb2Nrc1tpbmRleF0gPSBibG9jaztcbiAgICAgICAgaWYgKG5lZWRzX2ZsdXNoKSB7XG4gICAgICAgICAgICBmbHVzaCgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmIChpc19wcm9taXNlKHByb21pc2UpKSB7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRfY29tcG9uZW50ID0gZ2V0X2N1cnJlbnRfY29tcG9uZW50KCk7XG4gICAgICAgIHByb21pc2UudGhlbih2YWx1ZSA9PiB7XG4gICAgICAgICAgICBzZXRfY3VycmVudF9jb21wb25lbnQoY3VycmVudF9jb21wb25lbnQpO1xuICAgICAgICAgICAgdXBkYXRlKGluZm8udGhlbiwgMSwgaW5mby52YWx1ZSwgdmFsdWUpO1xuICAgICAgICAgICAgc2V0X2N1cnJlbnRfY29tcG9uZW50KG51bGwpO1xuICAgICAgICB9LCBlcnJvciA9PiB7XG4gICAgICAgICAgICBzZXRfY3VycmVudF9jb21wb25lbnQoY3VycmVudF9jb21wb25lbnQpO1xuICAgICAgICAgICAgdXBkYXRlKGluZm8uY2F0Y2gsIDIsIGluZm8uZXJyb3IsIGVycm9yKTtcbiAgICAgICAgICAgIHNldF9jdXJyZW50X2NvbXBvbmVudChudWxsKTtcbiAgICAgICAgICAgIGlmICghaW5mby5oYXNDYXRjaCkge1xuICAgICAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgLy8gaWYgd2UgcHJldmlvdXNseSBoYWQgYSB0aGVuL2NhdGNoIGJsb2NrLCBkZXN0cm95IGl0XG4gICAgICAgIGlmIChpbmZvLmN1cnJlbnQgIT09IGluZm8ucGVuZGluZykge1xuICAgICAgICAgICAgdXBkYXRlKGluZm8ucGVuZGluZywgMCk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgaWYgKGluZm8uY3VycmVudCAhPT0gaW5mby50aGVuKSB7XG4gICAgICAgICAgICB1cGRhdGUoaW5mby50aGVuLCAxLCBpbmZvLnZhbHVlLCBwcm9taXNlKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGluZm8ucmVzb2x2ZWQgPSBwcm9taXNlO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHVwZGF0ZV9hd2FpdF9ibG9ja19icmFuY2goaW5mbywgY3R4LCBkaXJ0eSkge1xuICAgIGNvbnN0IGNoaWxkX2N0eCA9IGN0eC5zbGljZSgpO1xuICAgIGNvbnN0IHsgcmVzb2x2ZWQgfSA9IGluZm87XG4gICAgaWYgKGluZm8uY3VycmVudCA9PT0gaW5mby50aGVuKSB7XG4gICAgICAgIGNoaWxkX2N0eFtpbmZvLnZhbHVlXSA9IHJlc29sdmVkO1xuICAgIH1cbiAgICBpZiAoaW5mby5jdXJyZW50ID09PSBpbmZvLmNhdGNoKSB7XG4gICAgICAgIGNoaWxkX2N0eFtpbmZvLmVycm9yXSA9IHJlc29sdmVkO1xuICAgIH1cbiAgICBpbmZvLmJsb2NrLnAoY2hpbGRfY3R4LCBkaXJ0eSk7XG59XG5cbmNvbnN0IGdsb2JhbHMgPSAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCdcbiAgICA/IHdpbmRvd1xuICAgIDogdHlwZW9mIGdsb2JhbFRoaXMgIT09ICd1bmRlZmluZWQnXG4gICAgICAgID8gZ2xvYmFsVGhpc1xuICAgICAgICA6IGdsb2JhbCk7XG5cbmZ1bmN0aW9uIGRlc3Ryb3lfYmxvY2soYmxvY2ssIGxvb2t1cCkge1xuICAgIGJsb2NrLmQoMSk7XG4gICAgbG9va3VwLmRlbGV0ZShibG9jay5rZXkpO1xufVxuZnVuY3Rpb24gb3V0cm9fYW5kX2Rlc3Ryb3lfYmxvY2soYmxvY2ssIGxvb2t1cCkge1xuICAgIHRyYW5zaXRpb25fb3V0KGJsb2NrLCAxLCAxLCAoKSA9PiB7XG4gICAgICAgIGxvb2t1cC5kZWxldGUoYmxvY2sua2V5KTtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGZpeF9hbmRfZGVzdHJveV9ibG9jayhibG9jaywgbG9va3VwKSB7XG4gICAgYmxvY2suZigpO1xuICAgIGRlc3Ryb3lfYmxvY2soYmxvY2ssIGxvb2t1cCk7XG59XG5mdW5jdGlvbiBmaXhfYW5kX291dHJvX2FuZF9kZXN0cm95X2Jsb2NrKGJsb2NrLCBsb29rdXApIHtcbiAgICBibG9jay5mKCk7XG4gICAgb3V0cm9fYW5kX2Rlc3Ryb3lfYmxvY2soYmxvY2ssIGxvb2t1cCk7XG59XG5mdW5jdGlvbiB1cGRhdGVfa2V5ZWRfZWFjaChvbGRfYmxvY2tzLCBkaXJ0eSwgZ2V0X2tleSwgZHluYW1pYywgY3R4LCBsaXN0LCBsb29rdXAsIG5vZGUsIGRlc3Ryb3ksIGNyZWF0ZV9lYWNoX2Jsb2NrLCBuZXh0LCBnZXRfY29udGV4dCkge1xuICAgIGxldCBvID0gb2xkX2Jsb2Nrcy5sZW5ndGg7XG4gICAgbGV0IG4gPSBsaXN0Lmxlbmd0aDtcbiAgICBsZXQgaSA9IG87XG4gICAgY29uc3Qgb2xkX2luZGV4ZXMgPSB7fTtcbiAgICB3aGlsZSAoaS0tKVxuICAgICAgICBvbGRfaW5kZXhlc1tvbGRfYmxvY2tzW2ldLmtleV0gPSBpO1xuICAgIGNvbnN0IG5ld19ibG9ja3MgPSBbXTtcbiAgICBjb25zdCBuZXdfbG9va3VwID0gbmV3IE1hcCgpO1xuICAgIGNvbnN0IGRlbHRhcyA9IG5ldyBNYXAoKTtcbiAgICBpID0gbjtcbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgIGNvbnN0IGNoaWxkX2N0eCA9IGdldF9jb250ZXh0KGN0eCwgbGlzdCwgaSk7XG4gICAgICAgIGNvbnN0IGtleSA9IGdldF9rZXkoY2hpbGRfY3R4KTtcbiAgICAgICAgbGV0IGJsb2NrID0gbG9va3VwLmdldChrZXkpO1xuICAgICAgICBpZiAoIWJsb2NrKSB7XG4gICAgICAgICAgICBibG9jayA9IGNyZWF0ZV9lYWNoX2Jsb2NrKGtleSwgY2hpbGRfY3R4KTtcbiAgICAgICAgICAgIGJsb2NrLmMoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChkeW5hbWljKSB7XG4gICAgICAgICAgICBibG9jay5wKGNoaWxkX2N0eCwgZGlydHkpO1xuICAgICAgICB9XG4gICAgICAgIG5ld19sb29rdXAuc2V0KGtleSwgbmV3X2Jsb2Nrc1tpXSA9IGJsb2NrKTtcbiAgICAgICAgaWYgKGtleSBpbiBvbGRfaW5kZXhlcylcbiAgICAgICAgICAgIGRlbHRhcy5zZXQoa2V5LCBNYXRoLmFicyhpIC0gb2xkX2luZGV4ZXNba2V5XSkpO1xuICAgIH1cbiAgICBjb25zdCB3aWxsX21vdmUgPSBuZXcgU2V0KCk7XG4gICAgY29uc3QgZGlkX21vdmUgPSBuZXcgU2V0KCk7XG4gICAgZnVuY3Rpb24gaW5zZXJ0KGJsb2NrKSB7XG4gICAgICAgIHRyYW5zaXRpb25faW4oYmxvY2ssIDEpO1xuICAgICAgICBibG9jay5tKG5vZGUsIG5leHQpO1xuICAgICAgICBsb29rdXAuc2V0KGJsb2NrLmtleSwgYmxvY2spO1xuICAgICAgICBuZXh0ID0gYmxvY2suZmlyc3Q7XG4gICAgICAgIG4tLTtcbiAgICB9XG4gICAgd2hpbGUgKG8gJiYgbikge1xuICAgICAgICBjb25zdCBuZXdfYmxvY2sgPSBuZXdfYmxvY2tzW24gLSAxXTtcbiAgICAgICAgY29uc3Qgb2xkX2Jsb2NrID0gb2xkX2Jsb2Nrc1tvIC0gMV07XG4gICAgICAgIGNvbnN0IG5ld19rZXkgPSBuZXdfYmxvY2sua2V5O1xuICAgICAgICBjb25zdCBvbGRfa2V5ID0gb2xkX2Jsb2NrLmtleTtcbiAgICAgICAgaWYgKG5ld19ibG9jayA9PT0gb2xkX2Jsb2NrKSB7XG4gICAgICAgICAgICAvLyBkbyBub3RoaW5nXG4gICAgICAgICAgICBuZXh0ID0gbmV3X2Jsb2NrLmZpcnN0O1xuICAgICAgICAgICAgby0tO1xuICAgICAgICAgICAgbi0tO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKCFuZXdfbG9va3VwLmhhcyhvbGRfa2V5KSkge1xuICAgICAgICAgICAgLy8gcmVtb3ZlIG9sZCBibG9ja1xuICAgICAgICAgICAgZGVzdHJveShvbGRfYmxvY2ssIGxvb2t1cCk7XG4gICAgICAgICAgICBvLS07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoIWxvb2t1cC5oYXMobmV3X2tleSkgfHwgd2lsbF9tb3ZlLmhhcyhuZXdfa2V5KSkge1xuICAgICAgICAgICAgaW5zZXJ0KG5ld19ibG9jayk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZGlkX21vdmUuaGFzKG9sZF9rZXkpKSB7XG4gICAgICAgICAgICBvLS07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZGVsdGFzLmdldChuZXdfa2V5KSA+IGRlbHRhcy5nZXQob2xkX2tleSkpIHtcbiAgICAgICAgICAgIGRpZF9tb3ZlLmFkZChuZXdfa2V5KTtcbiAgICAgICAgICAgIGluc2VydChuZXdfYmxvY2spO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgd2lsbF9tb3ZlLmFkZChvbGRfa2V5KTtcbiAgICAgICAgICAgIG8tLTtcbiAgICAgICAgfVxuICAgIH1cbiAgICB3aGlsZSAoby0tKSB7XG4gICAgICAgIGNvbnN0IG9sZF9ibG9jayA9IG9sZF9ibG9ja3Nbb107XG4gICAgICAgIGlmICghbmV3X2xvb2t1cC5oYXMob2xkX2Jsb2NrLmtleSkpXG4gICAgICAgICAgICBkZXN0cm95KG9sZF9ibG9jaywgbG9va3VwKTtcbiAgICB9XG4gICAgd2hpbGUgKG4pXG4gICAgICAgIGluc2VydChuZXdfYmxvY2tzW24gLSAxXSk7XG4gICAgcmV0dXJuIG5ld19ibG9ja3M7XG59XG5mdW5jdGlvbiB2YWxpZGF0ZV9lYWNoX2tleXMoY3R4LCBsaXN0LCBnZXRfY29udGV4dCwgZ2V0X2tleSkge1xuICAgIGNvbnN0IGtleXMgPSBuZXcgU2V0KCk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGtleSA9IGdldF9rZXkoZ2V0X2NvbnRleHQoY3R4LCBsaXN0LCBpKSk7XG4gICAgICAgIGlmIChrZXlzLmhhcyhrZXkpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBoYXZlIGR1cGxpY2F0ZSBrZXlzIGluIGEga2V5ZWQgZWFjaCcpO1xuICAgICAgICB9XG4gICAgICAgIGtleXMuYWRkKGtleSk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBnZXRfc3ByZWFkX3VwZGF0ZShsZXZlbHMsIHVwZGF0ZXMpIHtcbiAgICBjb25zdCB1cGRhdGUgPSB7fTtcbiAgICBjb25zdCB0b19udWxsX291dCA9IHt9O1xuICAgIGNvbnN0IGFjY291bnRlZF9mb3IgPSB7ICQkc2NvcGU6IDEgfTtcbiAgICBsZXQgaSA9IGxldmVscy5sZW5ndGg7XG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgICBjb25zdCBvID0gbGV2ZWxzW2ldO1xuICAgICAgICBjb25zdCBuID0gdXBkYXRlc1tpXTtcbiAgICAgICAgaWYgKG4pIHtcbiAgICAgICAgICAgIGZvciAoY29uc3Qga2V5IGluIG8pIHtcbiAgICAgICAgICAgICAgICBpZiAoIShrZXkgaW4gbikpXG4gICAgICAgICAgICAgICAgICAgIHRvX251bGxfb3V0W2tleV0gPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gbikge1xuICAgICAgICAgICAgICAgIGlmICghYWNjb3VudGVkX2ZvcltrZXldKSB7XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZVtrZXldID0gbltrZXldO1xuICAgICAgICAgICAgICAgICAgICBhY2NvdW50ZWRfZm9yW2tleV0gPSAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldmVsc1tpXSA9IG47XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBvKSB7XG4gICAgICAgICAgICAgICAgYWNjb3VudGVkX2ZvcltrZXldID0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBmb3IgKGNvbnN0IGtleSBpbiB0b19udWxsX291dCkge1xuICAgICAgICBpZiAoIShrZXkgaW4gdXBkYXRlKSlcbiAgICAgICAgICAgIHVwZGF0ZVtrZXldID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICByZXR1cm4gdXBkYXRlO1xufVxuZnVuY3Rpb24gZ2V0X3NwcmVhZF9vYmplY3Qoc3ByZWFkX3Byb3BzKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBzcHJlYWRfcHJvcHMgPT09ICdvYmplY3QnICYmIHNwcmVhZF9wcm9wcyAhPT0gbnVsbCA/IHNwcmVhZF9wcm9wcyA6IHt9O1xufVxuXG4vLyBzb3VyY2U6IGh0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvbXVsdGlwYWdlL2luZGljZXMuaHRtbFxuY29uc3QgYm9vbGVhbl9hdHRyaWJ1dGVzID0gbmV3IFNldChbXG4gICAgJ2FsbG93ZnVsbHNjcmVlbicsXG4gICAgJ2FsbG93cGF5bWVudHJlcXVlc3QnLFxuICAgICdhc3luYycsXG4gICAgJ2F1dG9mb2N1cycsXG4gICAgJ2F1dG9wbGF5JyxcbiAgICAnY2hlY2tlZCcsXG4gICAgJ2NvbnRyb2xzJyxcbiAgICAnZGVmYXVsdCcsXG4gICAgJ2RlZmVyJyxcbiAgICAnZGlzYWJsZWQnLFxuICAgICdmb3Jtbm92YWxpZGF0ZScsXG4gICAgJ2hpZGRlbicsXG4gICAgJ2lzbWFwJyxcbiAgICAnbG9vcCcsXG4gICAgJ211bHRpcGxlJyxcbiAgICAnbXV0ZWQnLFxuICAgICdub21vZHVsZScsXG4gICAgJ25vdmFsaWRhdGUnLFxuICAgICdvcGVuJyxcbiAgICAncGxheXNpbmxpbmUnLFxuICAgICdyZWFkb25seScsXG4gICAgJ3JlcXVpcmVkJyxcbiAgICAncmV2ZXJzZWQnLFxuICAgICdzZWxlY3RlZCdcbl0pO1xuXG5jb25zdCB2b2lkX2VsZW1lbnRfbmFtZXMgPSAvXig/OmFyZWF8YmFzZXxicnxjb2x8Y29tbWFuZHxlbWJlZHxocnxpbWd8aW5wdXR8a2V5Z2VufGxpbmt8bWV0YXxwYXJhbXxzb3VyY2V8dHJhY2t8d2JyKSQvO1xuZnVuY3Rpb24gaXNfdm9pZChuYW1lKSB7XG4gICAgcmV0dXJuIHZvaWRfZWxlbWVudF9uYW1lcy50ZXN0KG5hbWUpIHx8IG5hbWUudG9Mb3dlckNhc2UoKSA9PT0gJyFkb2N0eXBlJztcbn1cblxuY29uc3QgaW52YWxpZF9hdHRyaWJ1dGVfbmFtZV9jaGFyYWN0ZXIgPSAvW1xccydcIj4vPVxcdXtGREQwfS1cXHV7RkRFRn1cXHV7RkZGRX1cXHV7RkZGRn1cXHV7MUZGRkV9XFx1ezFGRkZGfVxcdXsyRkZGRX1cXHV7MkZGRkZ9XFx1ezNGRkZFfVxcdXszRkZGRn1cXHV7NEZGRkV9XFx1ezRGRkZGfVxcdXs1RkZGRX1cXHV7NUZGRkZ9XFx1ezZGRkZFfVxcdXs2RkZGRn1cXHV7N0ZGRkV9XFx1ezdGRkZGfVxcdXs4RkZGRX1cXHV7OEZGRkZ9XFx1ezlGRkZFfVxcdXs5RkZGRn1cXHV7QUZGRkV9XFx1e0FGRkZGfVxcdXtCRkZGRX1cXHV7QkZGRkZ9XFx1e0NGRkZFfVxcdXtDRkZGRn1cXHV7REZGRkV9XFx1e0RGRkZGfVxcdXtFRkZGRX1cXHV7RUZGRkZ9XFx1e0ZGRkZFfVxcdXtGRkZGRn1cXHV7MTBGRkZFfVxcdXsxMEZGRkZ9XS91O1xuLy8gaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy9tdWx0aXBhZ2Uvc3ludGF4Lmh0bWwjYXR0cmlidXRlcy0yXG4vLyBodHRwczovL2luZnJhLnNwZWMud2hhdHdnLm9yZy8jbm9uY2hhcmFjdGVyXG5mdW5jdGlvbiBzcHJlYWQoYXJncywgYXR0cnNfdG9fYWRkKSB7XG4gICAgY29uc3QgYXR0cmlidXRlcyA9IE9iamVjdC5hc3NpZ24oe30sIC4uLmFyZ3MpO1xuICAgIGlmIChhdHRyc190b19hZGQpIHtcbiAgICAgICAgY29uc3QgY2xhc3Nlc190b19hZGQgPSBhdHRyc190b19hZGQuY2xhc3NlcztcbiAgICAgICAgY29uc3Qgc3R5bGVzX3RvX2FkZCA9IGF0dHJzX3RvX2FkZC5zdHlsZXM7XG4gICAgICAgIGlmIChjbGFzc2VzX3RvX2FkZCkge1xuICAgICAgICAgICAgaWYgKGF0dHJpYnV0ZXMuY2xhc3MgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXMuY2xhc3MgPSBjbGFzc2VzX3RvX2FkZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXMuY2xhc3MgKz0gJyAnICsgY2xhc3Nlc190b19hZGQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHN0eWxlc190b19hZGQpIHtcbiAgICAgICAgICAgIGlmIChhdHRyaWJ1dGVzLnN0eWxlID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzLnN0eWxlID0gc3R5bGVfb2JqZWN0X3RvX3N0cmluZyhzdHlsZXNfdG9fYWRkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXMuc3R5bGUgPSBzdHlsZV9vYmplY3RfdG9fc3RyaW5nKG1lcmdlX3Nzcl9zdHlsZXMoYXR0cmlidXRlcy5zdHlsZSwgc3R5bGVzX3RvX2FkZCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGxldCBzdHIgPSAnJztcbiAgICBPYmplY3Qua2V5cyhhdHRyaWJ1dGVzKS5mb3JFYWNoKG5hbWUgPT4ge1xuICAgICAgICBpZiAoaW52YWxpZF9hdHRyaWJ1dGVfbmFtZV9jaGFyYWN0ZXIudGVzdChuYW1lKSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBhdHRyaWJ1dGVzW25hbWVdO1xuICAgICAgICBpZiAodmFsdWUgPT09IHRydWUpXG4gICAgICAgICAgICBzdHIgKz0gJyAnICsgbmFtZTtcbiAgICAgICAgZWxzZSBpZiAoYm9vbGVhbl9hdHRyaWJ1dGVzLmhhcyhuYW1lLnRvTG93ZXJDYXNlKCkpKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUpXG4gICAgICAgICAgICAgICAgc3RyICs9ICcgJyArIG5hbWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodmFsdWUgIT0gbnVsbCkge1xuICAgICAgICAgICAgc3RyICs9IGAgJHtuYW1lfT1cIiR7dmFsdWV9XCJgO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHN0cjtcbn1cbmZ1bmN0aW9uIG1lcmdlX3Nzcl9zdHlsZXMoc3R5bGVfYXR0cmlidXRlLCBzdHlsZV9kaXJlY3RpdmUpIHtcbiAgICBjb25zdCBzdHlsZV9vYmplY3QgPSB7fTtcbiAgICBmb3IgKGNvbnN0IGluZGl2aWR1YWxfc3R5bGUgb2Ygc3R5bGVfYXR0cmlidXRlLnNwbGl0KCc7JykpIHtcbiAgICAgICAgY29uc3QgY29sb25faW5kZXggPSBpbmRpdmlkdWFsX3N0eWxlLmluZGV4T2YoJzonKTtcbiAgICAgICAgY29uc3QgbmFtZSA9IGluZGl2aWR1YWxfc3R5bGUuc2xpY2UoMCwgY29sb25faW5kZXgpLnRyaW0oKTtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBpbmRpdmlkdWFsX3N0eWxlLnNsaWNlKGNvbG9uX2luZGV4ICsgMSkudHJpbSgpO1xuICAgICAgICBpZiAoIW5hbWUpXG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgc3R5bGVfb2JqZWN0W25hbWVdID0gdmFsdWU7XG4gICAgfVxuICAgIGZvciAoY29uc3QgbmFtZSBpbiBzdHlsZV9kaXJlY3RpdmUpIHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBzdHlsZV9kaXJlY3RpdmVbbmFtZV07XG4gICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgc3R5bGVfb2JqZWN0W25hbWVdID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBkZWxldGUgc3R5bGVfb2JqZWN0W25hbWVdO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzdHlsZV9vYmplY3Q7XG59XG5jb25zdCBlc2NhcGVkID0ge1xuICAgICdcIic6ICcmcXVvdDsnLFxuICAgIFwiJ1wiOiAnJiMzOTsnLFxuICAgICcmJzogJyZhbXA7JyxcbiAgICAnPCc6ICcmbHQ7JyxcbiAgICAnPic6ICcmZ3Q7J1xufTtcbmZ1bmN0aW9uIGVzY2FwZShodG1sKSB7XG4gICAgcmV0dXJuIFN0cmluZyhodG1sKS5yZXBsYWNlKC9bXCInJjw+XS9nLCBtYXRjaCA9PiBlc2NhcGVkW21hdGNoXSk7XG59XG5mdW5jdGlvbiBlc2NhcGVfYXR0cmlidXRlX3ZhbHVlKHZhbHVlKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgPyBlc2NhcGUodmFsdWUpIDogdmFsdWU7XG59XG5mdW5jdGlvbiBlc2NhcGVfb2JqZWN0KG9iaikge1xuICAgIGNvbnN0IHJlc3VsdCA9IHt9O1xuICAgIGZvciAoY29uc3Qga2V5IGluIG9iaikge1xuICAgICAgICByZXN1bHRba2V5XSA9IGVzY2FwZV9hdHRyaWJ1dGVfdmFsdWUob2JqW2tleV0pO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gZWFjaChpdGVtcywgZm4pIHtcbiAgICBsZXQgc3RyID0gJyc7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBzdHIgKz0gZm4oaXRlbXNbaV0sIGkpO1xuICAgIH1cbiAgICByZXR1cm4gc3RyO1xufVxuY29uc3QgbWlzc2luZ19jb21wb25lbnQgPSB7XG4gICAgJCRyZW5kZXI6ICgpID0+ICcnXG59O1xuZnVuY3Rpb24gdmFsaWRhdGVfY29tcG9uZW50KGNvbXBvbmVudCwgbmFtZSkge1xuICAgIGlmICghY29tcG9uZW50IHx8ICFjb21wb25lbnQuJCRyZW5kZXIpIHtcbiAgICAgICAgaWYgKG5hbWUgPT09ICdzdmVsdGU6Y29tcG9uZW50JylcbiAgICAgICAgICAgIG5hbWUgKz0gJyB0aGlzPXsuLi59JztcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGA8JHtuYW1lfT4gaXMgbm90IGEgdmFsaWQgU1NSIGNvbXBvbmVudC4gWW91IG1heSBuZWVkIHRvIHJldmlldyB5b3VyIGJ1aWxkIGNvbmZpZyB0byBlbnN1cmUgdGhhdCBkZXBlbmRlbmNpZXMgYXJlIGNvbXBpbGVkLCByYXRoZXIgdGhhbiBpbXBvcnRlZCBhcyBwcmUtY29tcGlsZWQgbW9kdWxlc2ApO1xuICAgIH1cbiAgICByZXR1cm4gY29tcG9uZW50O1xufVxuZnVuY3Rpb24gZGVidWcoZmlsZSwgbGluZSwgY29sdW1uLCB2YWx1ZXMpIHtcbiAgICBjb25zb2xlLmxvZyhge0BkZWJ1Z30gJHtmaWxlID8gZmlsZSArICcgJyA6ICcnfSgke2xpbmV9OiR7Y29sdW1ufSlgKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1jb25zb2xlXG4gICAgY29uc29sZS5sb2codmFsdWVzKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1jb25zb2xlXG4gICAgcmV0dXJuICcnO1xufVxubGV0IG9uX2Rlc3Ryb3k7XG5mdW5jdGlvbiBjcmVhdGVfc3NyX2NvbXBvbmVudChmbikge1xuICAgIGZ1bmN0aW9uICQkcmVuZGVyKHJlc3VsdCwgcHJvcHMsIGJpbmRpbmdzLCBzbG90cywgY29udGV4dCkge1xuICAgICAgICBjb25zdCBwYXJlbnRfY29tcG9uZW50ID0gY3VycmVudF9jb21wb25lbnQ7XG4gICAgICAgIGNvbnN0ICQkID0ge1xuICAgICAgICAgICAgb25fZGVzdHJveSxcbiAgICAgICAgICAgIGNvbnRleHQ6IG5ldyBNYXAoY29udGV4dCB8fCAocGFyZW50X2NvbXBvbmVudCA/IHBhcmVudF9jb21wb25lbnQuJCQuY29udGV4dCA6IFtdKSksXG4gICAgICAgICAgICAvLyB0aGVzZSB3aWxsIGJlIGltbWVkaWF0ZWx5IGRpc2NhcmRlZFxuICAgICAgICAgICAgb25fbW91bnQ6IFtdLFxuICAgICAgICAgICAgYmVmb3JlX3VwZGF0ZTogW10sXG4gICAgICAgICAgICBhZnRlcl91cGRhdGU6IFtdLFxuICAgICAgICAgICAgY2FsbGJhY2tzOiBibGFua19vYmplY3QoKVxuICAgICAgICB9O1xuICAgICAgICBzZXRfY3VycmVudF9jb21wb25lbnQoeyAkJCB9KTtcbiAgICAgICAgY29uc3QgaHRtbCA9IGZuKHJlc3VsdCwgcHJvcHMsIGJpbmRpbmdzLCBzbG90cyk7XG4gICAgICAgIHNldF9jdXJyZW50X2NvbXBvbmVudChwYXJlbnRfY29tcG9uZW50KTtcbiAgICAgICAgcmV0dXJuIGh0bWw7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgIHJlbmRlcjogKHByb3BzID0ge30sIHsgJCRzbG90cyA9IHt9LCBjb250ZXh0ID0gbmV3IE1hcCgpIH0gPSB7fSkgPT4ge1xuICAgICAgICAgICAgb25fZGVzdHJveSA9IFtdO1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0geyB0aXRsZTogJycsIGhlYWQ6ICcnLCBjc3M6IG5ldyBTZXQoKSB9O1xuICAgICAgICAgICAgY29uc3QgaHRtbCA9ICQkcmVuZGVyKHJlc3VsdCwgcHJvcHMsIHt9LCAkJHNsb3RzLCBjb250ZXh0KTtcbiAgICAgICAgICAgIHJ1bl9hbGwob25fZGVzdHJveSk7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGh0bWwsXG4gICAgICAgICAgICAgICAgY3NzOiB7XG4gICAgICAgICAgICAgICAgICAgIGNvZGU6IEFycmF5LmZyb20ocmVzdWx0LmNzcykubWFwKGNzcyA9PiBjc3MuY29kZSkuam9pbignXFxuJyksXG4gICAgICAgICAgICAgICAgICAgIG1hcDogbnVsbCAvLyBUT0RPXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBoZWFkOiByZXN1bHQudGl0bGUgKyByZXN1bHQuaGVhZFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSxcbiAgICAgICAgJCRyZW5kZXJcbiAgICB9O1xufVxuZnVuY3Rpb24gYWRkX2F0dHJpYnV0ZShuYW1lLCB2YWx1ZSwgYm9vbGVhbikge1xuICAgIGlmICh2YWx1ZSA9PSBudWxsIHx8IChib29sZWFuICYmICF2YWx1ZSkpXG4gICAgICAgIHJldHVybiAnJztcbiAgICBjb25zdCBhc3NpZ25tZW50ID0gKGJvb2xlYW4gJiYgdmFsdWUgPT09IHRydWUpID8gJycgOiBgPVwiJHtlc2NhcGVfYXR0cmlidXRlX3ZhbHVlKHZhbHVlLnRvU3RyaW5nKCkpfVwiYDtcbiAgICByZXR1cm4gYCAke25hbWV9JHthc3NpZ25tZW50fWA7XG59XG5mdW5jdGlvbiBhZGRfY2xhc3NlcyhjbGFzc2VzKSB7XG4gICAgcmV0dXJuIGNsYXNzZXMgPyBgIGNsYXNzPVwiJHtjbGFzc2VzfVwiYCA6ICcnO1xufVxuZnVuY3Rpb24gc3R5bGVfb2JqZWN0X3RvX3N0cmluZyhzdHlsZV9vYmplY3QpIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXMoc3R5bGVfb2JqZWN0KVxuICAgICAgICAuZmlsdGVyKGtleSA9PiBzdHlsZV9vYmplY3Rba2V5XSlcbiAgICAgICAgLm1hcChrZXkgPT4gYCR7a2V5fTogJHtzdHlsZV9vYmplY3Rba2V5XX07YClcbiAgICAgICAgLmpvaW4oJyAnKTtcbn1cbmZ1bmN0aW9uIGFkZF9zdHlsZXMoc3R5bGVfb2JqZWN0KSB7XG4gICAgY29uc3Qgc3R5bGVzID0gc3R5bGVfb2JqZWN0X3RvX3N0cmluZyhzdHlsZV9vYmplY3QpO1xuICAgIHJldHVybiBzdHlsZXMgPyBgIHN0eWxlPVwiJHtzdHlsZXN9XCJgIDogJyc7XG59XG5cbmZ1bmN0aW9uIGJpbmQoY29tcG9uZW50LCBuYW1lLCBjYWxsYmFjaykge1xuICAgIGNvbnN0IGluZGV4ID0gY29tcG9uZW50LiQkLnByb3BzW25hbWVdO1xuICAgIGlmIChpbmRleCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNvbXBvbmVudC4kJC5ib3VuZFtpbmRleF0gPSBjYWxsYmFjaztcbiAgICAgICAgY2FsbGJhY2soY29tcG9uZW50LiQkLmN0eFtpbmRleF0pO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGNyZWF0ZV9jb21wb25lbnQoYmxvY2spIHtcbiAgICBibG9jayAmJiBibG9jay5jKCk7XG59XG5mdW5jdGlvbiBjbGFpbV9jb21wb25lbnQoYmxvY2ssIHBhcmVudF9ub2Rlcykge1xuICAgIGJsb2NrICYmIGJsb2NrLmwocGFyZW50X25vZGVzKTtcbn1cbmZ1bmN0aW9uIG1vdW50X2NvbXBvbmVudChjb21wb25lbnQsIHRhcmdldCwgYW5jaG9yLCBjdXN0b21FbGVtZW50KSB7XG4gICAgY29uc3QgeyBmcmFnbWVudCwgb25fbW91bnQsIG9uX2Rlc3Ryb3ksIGFmdGVyX3VwZGF0ZSB9ID0gY29tcG9uZW50LiQkO1xuICAgIGZyYWdtZW50ICYmIGZyYWdtZW50Lm0odGFyZ2V0LCBhbmNob3IpO1xuICAgIGlmICghY3VzdG9tRWxlbWVudCkge1xuICAgICAgICAvLyBvbk1vdW50IGhhcHBlbnMgYmVmb3JlIHRoZSBpbml0aWFsIGFmdGVyVXBkYXRlXG4gICAgICAgIGFkZF9yZW5kZXJfY2FsbGJhY2soKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgbmV3X29uX2Rlc3Ryb3kgPSBvbl9tb3VudC5tYXAocnVuKS5maWx0ZXIoaXNfZnVuY3Rpb24pO1xuICAgICAgICAgICAgaWYgKG9uX2Rlc3Ryb3kpIHtcbiAgICAgICAgICAgICAgICBvbl9kZXN0cm95LnB1c2goLi4ubmV3X29uX2Rlc3Ryb3kpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gRWRnZSBjYXNlIC0gY29tcG9uZW50IHdhcyBkZXN0cm95ZWQgaW1tZWRpYXRlbHksXG4gICAgICAgICAgICAgICAgLy8gbW9zdCBsaWtlbHkgYXMgYSByZXN1bHQgb2YgYSBiaW5kaW5nIGluaXRpYWxpc2luZ1xuICAgICAgICAgICAgICAgIHJ1bl9hbGwobmV3X29uX2Rlc3Ryb3kpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29tcG9uZW50LiQkLm9uX21vdW50ID0gW107XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBhZnRlcl91cGRhdGUuZm9yRWFjaChhZGRfcmVuZGVyX2NhbGxiYWNrKTtcbn1cbmZ1bmN0aW9uIGRlc3Ryb3lfY29tcG9uZW50KGNvbXBvbmVudCwgZGV0YWNoaW5nKSB7XG4gICAgY29uc3QgJCQgPSBjb21wb25lbnQuJCQ7XG4gICAgaWYgKCQkLmZyYWdtZW50ICE9PSBudWxsKSB7XG4gICAgICAgIHJ1bl9hbGwoJCQub25fZGVzdHJveSk7XG4gICAgICAgICQkLmZyYWdtZW50ICYmICQkLmZyYWdtZW50LmQoZGV0YWNoaW5nKTtcbiAgICAgICAgLy8gVE9ETyBudWxsIG91dCBvdGhlciByZWZzLCBpbmNsdWRpbmcgY29tcG9uZW50LiQkIChidXQgbmVlZCB0b1xuICAgICAgICAvLyBwcmVzZXJ2ZSBmaW5hbCBzdGF0ZT8pXG4gICAgICAgICQkLm9uX2Rlc3Ryb3kgPSAkJC5mcmFnbWVudCA9IG51bGw7XG4gICAgICAgICQkLmN0eCA9IFtdO1xuICAgIH1cbn1cbmZ1bmN0aW9uIG1ha2VfZGlydHkoY29tcG9uZW50LCBpKSB7XG4gICAgaWYgKGNvbXBvbmVudC4kJC5kaXJ0eVswXSA9PT0gLTEpIHtcbiAgICAgICAgZGlydHlfY29tcG9uZW50cy5wdXNoKGNvbXBvbmVudCk7XG4gICAgICAgIHNjaGVkdWxlX3VwZGF0ZSgpO1xuICAgICAgICBjb21wb25lbnQuJCQuZGlydHkuZmlsbCgwKTtcbiAgICB9XG4gICAgY29tcG9uZW50LiQkLmRpcnR5WyhpIC8gMzEpIHwgMF0gfD0gKDEgPDwgKGkgJSAzMSkpO1xufVxuZnVuY3Rpb24gaW5pdChjb21wb25lbnQsIG9wdGlvbnMsIGluc3RhbmNlLCBjcmVhdGVfZnJhZ21lbnQsIG5vdF9lcXVhbCwgcHJvcHMsIGFwcGVuZF9zdHlsZXMsIGRpcnR5ID0gWy0xXSkge1xuICAgIGNvbnN0IHBhcmVudF9jb21wb25lbnQgPSBjdXJyZW50X2NvbXBvbmVudDtcbiAgICBzZXRfY3VycmVudF9jb21wb25lbnQoY29tcG9uZW50KTtcbiAgICBjb25zdCAkJCA9IGNvbXBvbmVudC4kJCA9IHtcbiAgICAgICAgZnJhZ21lbnQ6IG51bGwsXG4gICAgICAgIGN0eDogbnVsbCxcbiAgICAgICAgLy8gc3RhdGVcbiAgICAgICAgcHJvcHMsXG4gICAgICAgIHVwZGF0ZTogbm9vcCxcbiAgICAgICAgbm90X2VxdWFsLFxuICAgICAgICBib3VuZDogYmxhbmtfb2JqZWN0KCksXG4gICAgICAgIC8vIGxpZmVjeWNsZVxuICAgICAgICBvbl9tb3VudDogW10sXG4gICAgICAgIG9uX2Rlc3Ryb3k6IFtdLFxuICAgICAgICBvbl9kaXNjb25uZWN0OiBbXSxcbiAgICAgICAgYmVmb3JlX3VwZGF0ZTogW10sXG4gICAgICAgIGFmdGVyX3VwZGF0ZTogW10sXG4gICAgICAgIGNvbnRleHQ6IG5ldyBNYXAob3B0aW9ucy5jb250ZXh0IHx8IChwYXJlbnRfY29tcG9uZW50ID8gcGFyZW50X2NvbXBvbmVudC4kJC5jb250ZXh0IDogW10pKSxcbiAgICAgICAgLy8gZXZlcnl0aGluZyBlbHNlXG4gICAgICAgIGNhbGxiYWNrczogYmxhbmtfb2JqZWN0KCksXG4gICAgICAgIGRpcnR5LFxuICAgICAgICBza2lwX2JvdW5kOiBmYWxzZSxcbiAgICAgICAgcm9vdDogb3B0aW9ucy50YXJnZXQgfHwgcGFyZW50X2NvbXBvbmVudC4kJC5yb290XG4gICAgfTtcbiAgICBhcHBlbmRfc3R5bGVzICYmIGFwcGVuZF9zdHlsZXMoJCQucm9vdCk7XG4gICAgbGV0IHJlYWR5ID0gZmFsc2U7XG4gICAgJCQuY3R4ID0gaW5zdGFuY2VcbiAgICAgICAgPyBpbnN0YW5jZShjb21wb25lbnQsIG9wdGlvbnMucHJvcHMgfHwge30sIChpLCByZXQsIC4uLnJlc3QpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gcmVzdC5sZW5ndGggPyByZXN0WzBdIDogcmV0O1xuICAgICAgICAgICAgaWYgKCQkLmN0eCAmJiBub3RfZXF1YWwoJCQuY3R4W2ldLCAkJC5jdHhbaV0gPSB2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICBpZiAoISQkLnNraXBfYm91bmQgJiYgJCQuYm91bmRbaV0pXG4gICAgICAgICAgICAgICAgICAgICQkLmJvdW5kW2ldKHZhbHVlKTtcbiAgICAgICAgICAgICAgICBpZiAocmVhZHkpXG4gICAgICAgICAgICAgICAgICAgIG1ha2VfZGlydHkoY29tcG9uZW50LCBpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgIH0pXG4gICAgICAgIDogW107XG4gICAgJCQudXBkYXRlKCk7XG4gICAgcmVhZHkgPSB0cnVlO1xuICAgIHJ1bl9hbGwoJCQuYmVmb3JlX3VwZGF0ZSk7XG4gICAgLy8gYGZhbHNlYCBhcyBhIHNwZWNpYWwgY2FzZSBvZiBubyBET00gY29tcG9uZW50XG4gICAgJCQuZnJhZ21lbnQgPSBjcmVhdGVfZnJhZ21lbnQgPyBjcmVhdGVfZnJhZ21lbnQoJCQuY3R4KSA6IGZhbHNlO1xuICAgIGlmIChvcHRpb25zLnRhcmdldCkge1xuICAgICAgICBpZiAob3B0aW9ucy5oeWRyYXRlKSB7XG4gICAgICAgICAgICBzdGFydF9oeWRyYXRpbmcoKTtcbiAgICAgICAgICAgIGNvbnN0IG5vZGVzID0gY2hpbGRyZW4ob3B0aW9ucy50YXJnZXQpO1xuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1ub24tbnVsbC1hc3NlcnRpb25cbiAgICAgICAgICAgICQkLmZyYWdtZW50ICYmICQkLmZyYWdtZW50Lmwobm9kZXMpO1xuICAgICAgICAgICAgbm9kZXMuZm9yRWFjaChkZXRhY2gpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1ub24tbnVsbC1hc3NlcnRpb25cbiAgICAgICAgICAgICQkLmZyYWdtZW50ICYmICQkLmZyYWdtZW50LmMoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0aW9ucy5pbnRybylcbiAgICAgICAgICAgIHRyYW5zaXRpb25faW4oY29tcG9uZW50LiQkLmZyYWdtZW50KTtcbiAgICAgICAgbW91bnRfY29tcG9uZW50KGNvbXBvbmVudCwgb3B0aW9ucy50YXJnZXQsIG9wdGlvbnMuYW5jaG9yLCBvcHRpb25zLmN1c3RvbUVsZW1lbnQpO1xuICAgICAgICBlbmRfaHlkcmF0aW5nKCk7XG4gICAgICAgIGZsdXNoKCk7XG4gICAgfVxuICAgIHNldF9jdXJyZW50X2NvbXBvbmVudChwYXJlbnRfY29tcG9uZW50KTtcbn1cbmxldCBTdmVsdGVFbGVtZW50O1xuaWYgKHR5cGVvZiBIVE1MRWxlbWVudCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIFN2ZWx0ZUVsZW1lbnQgPSBjbGFzcyBleHRlbmRzIEhUTUxFbGVtZW50IHtcbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICBzdXBlcigpO1xuICAgICAgICAgICAgdGhpcy5hdHRhY2hTaGFkb3coeyBtb2RlOiAnb3BlbicgfSk7XG4gICAgICAgIH1cbiAgICAgICAgY29ubmVjdGVkQ2FsbGJhY2soKSB7XG4gICAgICAgICAgICBjb25zdCB7IG9uX21vdW50IH0gPSB0aGlzLiQkO1xuICAgICAgICAgICAgdGhpcy4kJC5vbl9kaXNjb25uZWN0ID0gb25fbW91bnQubWFwKHJ1bikuZmlsdGVyKGlzX2Z1bmN0aW9uKTtcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmUgdG9kbzogaW1wcm92ZSB0eXBpbmdzXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiB0aGlzLiQkLnNsb3R0ZWQpIHtcbiAgICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlIHRvZG86IGltcHJvdmUgdHlwaW5nc1xuICAgICAgICAgICAgICAgIHRoaXMuYXBwZW5kQ2hpbGQodGhpcy4kJC5zbG90dGVkW2tleV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhhdHRyLCBfb2xkVmFsdWUsIG5ld1ZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzW2F0dHJdID0gbmV3VmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgZGlzY29ubmVjdGVkQ2FsbGJhY2soKSB7XG4gICAgICAgICAgICBydW5fYWxsKHRoaXMuJCQub25fZGlzY29ubmVjdCk7XG4gICAgICAgIH1cbiAgICAgICAgJGRlc3Ryb3koKSB7XG4gICAgICAgICAgICBkZXN0cm95X2NvbXBvbmVudCh0aGlzLCAxKTtcbiAgICAgICAgICAgIHRoaXMuJGRlc3Ryb3kgPSBub29wO1xuICAgICAgICB9XG4gICAgICAgICRvbih0eXBlLCBjYWxsYmFjaykge1xuICAgICAgICAgICAgLy8gVE9ETyBzaG91bGQgdGhpcyBkZWxlZ2F0ZSB0byBhZGRFdmVudExpc3RlbmVyP1xuICAgICAgICAgICAgY29uc3QgY2FsbGJhY2tzID0gKHRoaXMuJCQuY2FsbGJhY2tzW3R5cGVdIHx8ICh0aGlzLiQkLmNhbGxiYWNrc1t0eXBlXSA9IFtdKSk7XG4gICAgICAgICAgICBjYWxsYmFja3MucHVzaChjYWxsYmFjayk7XG4gICAgICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gY2FsbGJhY2tzLmluZGV4T2YoY2FsbGJhY2spO1xuICAgICAgICAgICAgICAgIGlmIChpbmRleCAhPT0gLTEpXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICAkc2V0KCQkcHJvcHMpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLiQkc2V0ICYmICFpc19lbXB0eSgkJHByb3BzKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuJCQuc2tpcF9ib3VuZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy4kJHNldCgkJHByb3BzKTtcbiAgICAgICAgICAgICAgICB0aGlzLiQkLnNraXBfYm91bmQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG59XG4vKipcbiAqIEJhc2UgY2xhc3MgZm9yIFN2ZWx0ZSBjb21wb25lbnRzLiBVc2VkIHdoZW4gZGV2PWZhbHNlLlxuICovXG5jbGFzcyBTdmVsdGVDb21wb25lbnQge1xuICAgICRkZXN0cm95KCkge1xuICAgICAgICBkZXN0cm95X2NvbXBvbmVudCh0aGlzLCAxKTtcbiAgICAgICAgdGhpcy4kZGVzdHJveSA9IG5vb3A7XG4gICAgfVxuICAgICRvbih0eXBlLCBjYWxsYmFjaykge1xuICAgICAgICBjb25zdCBjYWxsYmFja3MgPSAodGhpcy4kJC5jYWxsYmFja3NbdHlwZV0gfHwgKHRoaXMuJCQuY2FsbGJhY2tzW3R5cGVdID0gW10pKTtcbiAgICAgICAgY2FsbGJhY2tzLnB1c2goY2FsbGJhY2spO1xuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaW5kZXggPSBjYWxsYmFja3MuaW5kZXhPZihjYWxsYmFjayk7XG4gICAgICAgICAgICBpZiAoaW5kZXggIT09IC0xKVxuICAgICAgICAgICAgICAgIGNhbGxiYWNrcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICB9O1xuICAgIH1cbiAgICAkc2V0KCQkcHJvcHMpIHtcbiAgICAgICAgaWYgKHRoaXMuJCRzZXQgJiYgIWlzX2VtcHR5KCQkcHJvcHMpKSB7XG4gICAgICAgICAgICB0aGlzLiQkLnNraXBfYm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy4kJHNldCgkJHByb3BzKTtcbiAgICAgICAgICAgIHRoaXMuJCQuc2tpcF9ib3VuZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkaXNwYXRjaF9kZXYodHlwZSwgZGV0YWlsKSB7XG4gICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChjdXN0b21fZXZlbnQodHlwZSwgT2JqZWN0LmFzc2lnbih7IHZlcnNpb246ICczLjQ4LjAnIH0sIGRldGFpbCksIHsgYnViYmxlczogdHJ1ZSB9KSk7XG59XG5mdW5jdGlvbiBhcHBlbmRfZGV2KHRhcmdldCwgbm9kZSkge1xuICAgIGRpc3BhdGNoX2RldignU3ZlbHRlRE9NSW5zZXJ0JywgeyB0YXJnZXQsIG5vZGUgfSk7XG4gICAgYXBwZW5kKHRhcmdldCwgbm9kZSk7XG59XG5mdW5jdGlvbiBhcHBlbmRfaHlkcmF0aW9uX2Rldih0YXJnZXQsIG5vZGUpIHtcbiAgICBkaXNwYXRjaF9kZXYoJ1N2ZWx0ZURPTUluc2VydCcsIHsgdGFyZ2V0LCBub2RlIH0pO1xuICAgIGFwcGVuZF9oeWRyYXRpb24odGFyZ2V0LCBub2RlKTtcbn1cbmZ1bmN0aW9uIGluc2VydF9kZXYodGFyZ2V0LCBub2RlLCBhbmNob3IpIHtcbiAgICBkaXNwYXRjaF9kZXYoJ1N2ZWx0ZURPTUluc2VydCcsIHsgdGFyZ2V0LCBub2RlLCBhbmNob3IgfSk7XG4gICAgaW5zZXJ0KHRhcmdldCwgbm9kZSwgYW5jaG9yKTtcbn1cbmZ1bmN0aW9uIGluc2VydF9oeWRyYXRpb25fZGV2KHRhcmdldCwgbm9kZSwgYW5jaG9yKSB7XG4gICAgZGlzcGF0Y2hfZGV2KCdTdmVsdGVET01JbnNlcnQnLCB7IHRhcmdldCwgbm9kZSwgYW5jaG9yIH0pO1xuICAgIGluc2VydF9oeWRyYXRpb24odGFyZ2V0LCBub2RlLCBhbmNob3IpO1xufVxuZnVuY3Rpb24gZGV0YWNoX2Rldihub2RlKSB7XG4gICAgZGlzcGF0Y2hfZGV2KCdTdmVsdGVET01SZW1vdmUnLCB7IG5vZGUgfSk7XG4gICAgZGV0YWNoKG5vZGUpO1xufVxuZnVuY3Rpb24gZGV0YWNoX2JldHdlZW5fZGV2KGJlZm9yZSwgYWZ0ZXIpIHtcbiAgICB3aGlsZSAoYmVmb3JlLm5leHRTaWJsaW5nICYmIGJlZm9yZS5uZXh0U2libGluZyAhPT0gYWZ0ZXIpIHtcbiAgICAgICAgZGV0YWNoX2RldihiZWZvcmUubmV4dFNpYmxpbmcpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGRldGFjaF9iZWZvcmVfZGV2KGFmdGVyKSB7XG4gICAgd2hpbGUgKGFmdGVyLnByZXZpb3VzU2libGluZykge1xuICAgICAgICBkZXRhY2hfZGV2KGFmdGVyLnByZXZpb3VzU2libGluZyk7XG4gICAgfVxufVxuZnVuY3Rpb24gZGV0YWNoX2FmdGVyX2RldihiZWZvcmUpIHtcbiAgICB3aGlsZSAoYmVmb3JlLm5leHRTaWJsaW5nKSB7XG4gICAgICAgIGRldGFjaF9kZXYoYmVmb3JlLm5leHRTaWJsaW5nKTtcbiAgICB9XG59XG5mdW5jdGlvbiBsaXN0ZW5fZGV2KG5vZGUsIGV2ZW50LCBoYW5kbGVyLCBvcHRpb25zLCBoYXNfcHJldmVudF9kZWZhdWx0LCBoYXNfc3RvcF9wcm9wYWdhdGlvbikge1xuICAgIGNvbnN0IG1vZGlmaWVycyA9IG9wdGlvbnMgPT09IHRydWUgPyBbJ2NhcHR1cmUnXSA6IG9wdGlvbnMgPyBBcnJheS5mcm9tKE9iamVjdC5rZXlzKG9wdGlvbnMpKSA6IFtdO1xuICAgIGlmIChoYXNfcHJldmVudF9kZWZhdWx0KVxuICAgICAgICBtb2RpZmllcnMucHVzaCgncHJldmVudERlZmF1bHQnKTtcbiAgICBpZiAoaGFzX3N0b3BfcHJvcGFnYXRpb24pXG4gICAgICAgIG1vZGlmaWVycy5wdXNoKCdzdG9wUHJvcGFnYXRpb24nKTtcbiAgICBkaXNwYXRjaF9kZXYoJ1N2ZWx0ZURPTUFkZEV2ZW50TGlzdGVuZXInLCB7IG5vZGUsIGV2ZW50LCBoYW5kbGVyLCBtb2RpZmllcnMgfSk7XG4gICAgY29uc3QgZGlzcG9zZSA9IGxpc3Rlbihub2RlLCBldmVudCwgaGFuZGxlciwgb3B0aW9ucyk7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgZGlzcGF0Y2hfZGV2KCdTdmVsdGVET01SZW1vdmVFdmVudExpc3RlbmVyJywgeyBub2RlLCBldmVudCwgaGFuZGxlciwgbW9kaWZpZXJzIH0pO1xuICAgICAgICBkaXNwb3NlKCk7XG4gICAgfTtcbn1cbmZ1bmN0aW9uIGF0dHJfZGV2KG5vZGUsIGF0dHJpYnV0ZSwgdmFsdWUpIHtcbiAgICBhdHRyKG5vZGUsIGF0dHJpYnV0ZSwgdmFsdWUpO1xuICAgIGlmICh2YWx1ZSA9PSBudWxsKVxuICAgICAgICBkaXNwYXRjaF9kZXYoJ1N2ZWx0ZURPTVJlbW92ZUF0dHJpYnV0ZScsIHsgbm9kZSwgYXR0cmlidXRlIH0pO1xuICAgIGVsc2VcbiAgICAgICAgZGlzcGF0Y2hfZGV2KCdTdmVsdGVET01TZXRBdHRyaWJ1dGUnLCB7IG5vZGUsIGF0dHJpYnV0ZSwgdmFsdWUgfSk7XG59XG5mdW5jdGlvbiBwcm9wX2Rldihub2RlLCBwcm9wZXJ0eSwgdmFsdWUpIHtcbiAgICBub2RlW3Byb3BlcnR5XSA9IHZhbHVlO1xuICAgIGRpc3BhdGNoX2RldignU3ZlbHRlRE9NU2V0UHJvcGVydHknLCB7IG5vZGUsIHByb3BlcnR5LCB2YWx1ZSB9KTtcbn1cbmZ1bmN0aW9uIGRhdGFzZXRfZGV2KG5vZGUsIHByb3BlcnR5LCB2YWx1ZSkge1xuICAgIG5vZGUuZGF0YXNldFtwcm9wZXJ0eV0gPSB2YWx1ZTtcbiAgICBkaXNwYXRjaF9kZXYoJ1N2ZWx0ZURPTVNldERhdGFzZXQnLCB7IG5vZGUsIHByb3BlcnR5LCB2YWx1ZSB9KTtcbn1cbmZ1bmN0aW9uIHNldF9kYXRhX2Rldih0ZXh0LCBkYXRhKSB7XG4gICAgZGF0YSA9ICcnICsgZGF0YTtcbiAgICBpZiAodGV4dC53aG9sZVRleHQgPT09IGRhdGEpXG4gICAgICAgIHJldHVybjtcbiAgICBkaXNwYXRjaF9kZXYoJ1N2ZWx0ZURPTVNldERhdGEnLCB7IG5vZGU6IHRleHQsIGRhdGEgfSk7XG4gICAgdGV4dC5kYXRhID0gZGF0YTtcbn1cbmZ1bmN0aW9uIHZhbGlkYXRlX2VhY2hfYXJndW1lbnQoYXJnKSB7XG4gICAgaWYgKHR5cGVvZiBhcmcgIT09ICdzdHJpbmcnICYmICEoYXJnICYmIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnICYmICdsZW5ndGgnIGluIGFyZykpIHtcbiAgICAgICAgbGV0IG1zZyA9ICd7I2VhY2h9IG9ubHkgaXRlcmF0ZXMgb3ZlciBhcnJheS1saWtlIG9iamVjdHMuJztcbiAgICAgICAgaWYgKHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiYgYXJnICYmIFN5bWJvbC5pdGVyYXRvciBpbiBhcmcpIHtcbiAgICAgICAgICAgIG1zZyArPSAnIFlvdSBjYW4gdXNlIGEgc3ByZWFkIHRvIGNvbnZlcnQgdGhpcyBpdGVyYWJsZSBpbnRvIGFuIGFycmF5Lic7XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1zZyk7XG4gICAgfVxufVxuZnVuY3Rpb24gdmFsaWRhdGVfc2xvdHMobmFtZSwgc2xvdCwga2V5cykge1xuICAgIGZvciAoY29uc3Qgc2xvdF9rZXkgb2YgT2JqZWN0LmtleXMoc2xvdCkpIHtcbiAgICAgICAgaWYgKCF+a2V5cy5pbmRleE9mKHNsb3Rfa2V5KSkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKGA8JHtuYW1lfT4gcmVjZWl2ZWQgYW4gdW5leHBlY3RlZCBzbG90IFwiJHtzbG90X2tleX1cIi5gKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmZ1bmN0aW9uIHZhbGlkYXRlX2R5bmFtaWNfZWxlbWVudCh0YWcpIHtcbiAgICBjb25zdCBpc19zdHJpbmcgPSB0eXBlb2YgdGFnID09PSAnc3RyaW5nJztcbiAgICBpZiAodGFnICYmICFpc19zdHJpbmcpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCc8c3ZlbHRlOmVsZW1lbnQ+IGV4cGVjdHMgXCJ0aGlzXCIgYXR0cmlidXRlIHRvIGJlIGEgc3RyaW5nLicpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHZhbGlkYXRlX3ZvaWRfZHluYW1pY19lbGVtZW50KHRhZykge1xuICAgIGlmICh0YWcgJiYgaXNfdm9pZCh0YWcpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgPHN2ZWx0ZTplbGVtZW50IHRoaXM9XCIke3RhZ31cIj4gaXMgc2VsZi1jbG9zaW5nIGFuZCBjYW5ub3QgaGF2ZSBjb250ZW50LmApO1xuICAgIH1cbn1cbi8qKlxuICogQmFzZSBjbGFzcyBmb3IgU3ZlbHRlIGNvbXBvbmVudHMgd2l0aCBzb21lIG1pbm9yIGRldi1lbmhhbmNlbWVudHMuIFVzZWQgd2hlbiBkZXY9dHJ1ZS5cbiAqL1xuY2xhc3MgU3ZlbHRlQ29tcG9uZW50RGV2IGV4dGVuZHMgU3ZlbHRlQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgICAgIGlmICghb3B0aW9ucyB8fCAoIW9wdGlvbnMudGFyZ2V0ICYmICFvcHRpb25zLiQkaW5saW5lKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiJ3RhcmdldCcgaXMgYSByZXF1aXJlZCBvcHRpb25cIik7XG4gICAgICAgIH1cbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG4gICAgJGRlc3Ryb3koKSB7XG4gICAgICAgIHN1cGVyLiRkZXN0cm95KCk7XG4gICAgICAgIHRoaXMuJGRlc3Ryb3kgPSAoKSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ0NvbXBvbmVudCB3YXMgYWxyZWFkeSBkZXN0cm95ZWQnKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1jb25zb2xlXG4gICAgICAgIH07XG4gICAgfVxuICAgICRjYXB0dXJlX3N0YXRlKCkgeyB9XG4gICAgJGluamVjdF9zdGF0ZSgpIHsgfVxufVxuLyoqXG4gKiBCYXNlIGNsYXNzIHRvIGNyZWF0ZSBzdHJvbmdseSB0eXBlZCBTdmVsdGUgY29tcG9uZW50cy5cbiAqIFRoaXMgb25seSBleGlzdHMgZm9yIHR5cGluZyBwdXJwb3NlcyBhbmQgc2hvdWxkIGJlIHVzZWQgaW4gYC5kLnRzYCBmaWxlcy5cbiAqXG4gKiAjIyMgRXhhbXBsZTpcbiAqXG4gKiBZb3UgaGF2ZSBjb21wb25lbnQgbGlicmFyeSBvbiBucG0gY2FsbGVkIGBjb21wb25lbnQtbGlicmFyeWAsIGZyb20gd2hpY2hcbiAqIHlvdSBleHBvcnQgYSBjb21wb25lbnQgY2FsbGVkIGBNeUNvbXBvbmVudGAuIEZvciBTdmVsdGUrVHlwZVNjcmlwdCB1c2VycyxcbiAqIHlvdSB3YW50IHRvIHByb3ZpZGUgdHlwaW5ncy4gVGhlcmVmb3JlIHlvdSBjcmVhdGUgYSBgaW5kZXguZC50c2A6XG4gKiBgYGB0c1xuICogaW1wb3J0IHsgU3ZlbHRlQ29tcG9uZW50VHlwZWQgfSBmcm9tIFwic3ZlbHRlXCI7XG4gKiBleHBvcnQgY2xhc3MgTXlDb21wb25lbnQgZXh0ZW5kcyBTdmVsdGVDb21wb25lbnRUeXBlZDx7Zm9vOiBzdHJpbmd9PiB7fVxuICogYGBgXG4gKiBUeXBpbmcgdGhpcyBtYWtlcyBpdCBwb3NzaWJsZSBmb3IgSURFcyBsaWtlIFZTIENvZGUgd2l0aCB0aGUgU3ZlbHRlIGV4dGVuc2lvblxuICogdG8gcHJvdmlkZSBpbnRlbGxpc2Vuc2UgYW5kIHRvIHVzZSB0aGUgY29tcG9uZW50IGxpa2UgdGhpcyBpbiBhIFN2ZWx0ZSBmaWxlXG4gKiB3aXRoIFR5cGVTY3JpcHQ6XG4gKiBgYGBzdmVsdGVcbiAqIDxzY3JpcHQgbGFuZz1cInRzXCI+XG4gKiBcdGltcG9ydCB7IE15Q29tcG9uZW50IH0gZnJvbSBcImNvbXBvbmVudC1saWJyYXJ5XCI7XG4gKiA8L3NjcmlwdD5cbiAqIDxNeUNvbXBvbmVudCBmb289eydiYXInfSAvPlxuICogYGBgXG4gKlxuICogIyMjIyBXaHkgbm90IG1ha2UgdGhpcyBwYXJ0IG9mIGBTdmVsdGVDb21wb25lbnQoRGV2KWA/XG4gKiBCZWNhdXNlXG4gKiBgYGB0c1xuICogY2xhc3MgQVN1YmNsYXNzT2ZTdmVsdGVDb21wb25lbnQgZXh0ZW5kcyBTdmVsdGVDb21wb25lbnQ8e2Zvbzogc3RyaW5nfT4ge31cbiAqIGNvbnN0IGNvbXBvbmVudDogdHlwZW9mIFN2ZWx0ZUNvbXBvbmVudCA9IEFTdWJjbGFzc09mU3ZlbHRlQ29tcG9uZW50O1xuICogYGBgXG4gKiB3aWxsIHRocm93IGEgdHlwZSBlcnJvciwgc28gd2UgbmVlZCB0byBzZXBhcmF0ZSB0aGUgbW9yZSBzdHJpY3RseSB0eXBlZCBjbGFzcy5cbiAqL1xuY2xhc3MgU3ZlbHRlQ29tcG9uZW50VHlwZWQgZXh0ZW5kcyBTdmVsdGVDb21wb25lbnREZXYge1xuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICAgICAgc3VwZXIob3B0aW9ucyk7XG4gICAgfVxufVxuZnVuY3Rpb24gbG9vcF9ndWFyZCh0aW1lb3V0KSB7XG4gICAgY29uc3Qgc3RhcnQgPSBEYXRlLm5vdygpO1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgIGlmIChEYXRlLm5vdygpIC0gc3RhcnQgPiB0aW1lb3V0KSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0luZmluaXRlIGxvb3AgZGV0ZWN0ZWQnKTtcbiAgICAgICAgfVxuICAgIH07XG59XG5cbmV4cG9ydCB7IEh0bWxUYWcsIEh0bWxUYWdIeWRyYXRpb24sIFN2ZWx0ZUNvbXBvbmVudCwgU3ZlbHRlQ29tcG9uZW50RGV2LCBTdmVsdGVDb21wb25lbnRUeXBlZCwgU3ZlbHRlRWxlbWVudCwgYWN0aW9uX2Rlc3Ryb3llciwgYWRkX2F0dHJpYnV0ZSwgYWRkX2NsYXNzZXMsIGFkZF9mbHVzaF9jYWxsYmFjaywgYWRkX2xvY2F0aW9uLCBhZGRfcmVuZGVyX2NhbGxiYWNrLCBhZGRfcmVzaXplX2xpc3RlbmVyLCBhZGRfc3R5bGVzLCBhZGRfdHJhbnNmb3JtLCBhZnRlclVwZGF0ZSwgYXBwZW5kLCBhcHBlbmRfZGV2LCBhcHBlbmRfZW1wdHlfc3R5bGVzaGVldCwgYXBwZW5kX2h5ZHJhdGlvbiwgYXBwZW5kX2h5ZHJhdGlvbl9kZXYsIGFwcGVuZF9zdHlsZXMsIGFzc2lnbiwgYXR0ciwgYXR0cl9kZXYsIGF0dHJpYnV0ZV90b19vYmplY3QsIGJlZm9yZVVwZGF0ZSwgYmluZCwgYmluZGluZ19jYWxsYmFja3MsIGJsYW5rX29iamVjdCwgYnViYmxlLCBjaGVja19vdXRyb3MsIGNoaWxkcmVuLCBjbGFpbV9jb21wb25lbnQsIGNsYWltX2VsZW1lbnQsIGNsYWltX2h0bWxfdGFnLCBjbGFpbV9zcGFjZSwgY2xhaW1fc3ZnX2VsZW1lbnQsIGNsYWltX3RleHQsIGNsZWFyX2xvb3BzLCBjb21wb25lbnRfc3Vic2NyaWJlLCBjb21wdXRlX3Jlc3RfcHJvcHMsIGNvbXB1dGVfc2xvdHMsIGNyZWF0ZUV2ZW50RGlzcGF0Y2hlciwgY3JlYXRlX2FuaW1hdGlvbiwgY3JlYXRlX2JpZGlyZWN0aW9uYWxfdHJhbnNpdGlvbiwgY3JlYXRlX2NvbXBvbmVudCwgY3JlYXRlX2luX3RyYW5zaXRpb24sIGNyZWF0ZV9vdXRfdHJhbnNpdGlvbiwgY3JlYXRlX3Nsb3QsIGNyZWF0ZV9zc3JfY29tcG9uZW50LCBjdXJyZW50X2NvbXBvbmVudCwgY3VzdG9tX2V2ZW50LCBkYXRhc2V0X2RldiwgZGVidWcsIGRlc3Ryb3lfYmxvY2ssIGRlc3Ryb3lfY29tcG9uZW50LCBkZXN0cm95X2VhY2gsIGRldGFjaCwgZGV0YWNoX2FmdGVyX2RldiwgZGV0YWNoX2JlZm9yZV9kZXYsIGRldGFjaF9iZXR3ZWVuX2RldiwgZGV0YWNoX2RldiwgZGlydHlfY29tcG9uZW50cywgZGlzcGF0Y2hfZGV2LCBlYWNoLCBlbGVtZW50LCBlbGVtZW50X2lzLCBlbXB0eSwgZW5kX2h5ZHJhdGluZywgZXNjYXBlLCBlc2NhcGVfYXR0cmlidXRlX3ZhbHVlLCBlc2NhcGVfb2JqZWN0LCBlc2NhcGVkLCBleGNsdWRlX2ludGVybmFsX3Byb3BzLCBmaXhfYW5kX2Rlc3Ryb3lfYmxvY2ssIGZpeF9hbmRfb3V0cm9fYW5kX2Rlc3Ryb3lfYmxvY2ssIGZpeF9wb3NpdGlvbiwgZmx1c2gsIGdldEFsbENvbnRleHRzLCBnZXRDb250ZXh0LCBnZXRfYWxsX2RpcnR5X2Zyb21fc2NvcGUsIGdldF9iaW5kaW5nX2dyb3VwX3ZhbHVlLCBnZXRfY3VycmVudF9jb21wb25lbnQsIGdldF9jdXN0b21fZWxlbWVudHNfc2xvdHMsIGdldF9yb290X2Zvcl9zdHlsZSwgZ2V0X3Nsb3RfY2hhbmdlcywgZ2V0X3NwcmVhZF9vYmplY3QsIGdldF9zcHJlYWRfdXBkYXRlLCBnZXRfc3RvcmVfdmFsdWUsIGdsb2JhbHMsIGdyb3VwX291dHJvcywgaGFuZGxlX3Byb21pc2UsIGhhc0NvbnRleHQsIGhhc19wcm9wLCBpZGVudGl0eSwgaW5pdCwgaW5zZXJ0LCBpbnNlcnRfZGV2LCBpbnNlcnRfaHlkcmF0aW9uLCBpbnNlcnRfaHlkcmF0aW9uX2RldiwgaW50cm9zLCBpbnZhbGlkX2F0dHJpYnV0ZV9uYW1lX2NoYXJhY3RlciwgaXNfY2xpZW50LCBpc19jcm9zc29yaWdpbiwgaXNfZW1wdHksIGlzX2Z1bmN0aW9uLCBpc19wcm9taXNlLCBpc192b2lkLCBsaXN0ZW4sIGxpc3Rlbl9kZXYsIGxvb3AsIGxvb3BfZ3VhcmQsIG1lcmdlX3Nzcl9zdHlsZXMsIG1pc3NpbmdfY29tcG9uZW50LCBtb3VudF9jb21wb25lbnQsIG5vb3AsIG5vdF9lcXVhbCwgbm93LCBudWxsX3RvX2VtcHR5LCBvYmplY3Rfd2l0aG91dF9wcm9wZXJ0aWVzLCBvbkRlc3Ryb3ksIG9uTW91bnQsIG9uY2UsIG91dHJvX2FuZF9kZXN0cm95X2Jsb2NrLCBwcmV2ZW50X2RlZmF1bHQsIHByb3BfZGV2LCBxdWVyeV9zZWxlY3Rvcl9hbGwsIHJhZiwgcnVuLCBydW5fYWxsLCBzYWZlX25vdF9lcXVhbCwgc2NoZWR1bGVfdXBkYXRlLCBzZWxlY3RfbXVsdGlwbGVfdmFsdWUsIHNlbGVjdF9vcHRpb24sIHNlbGVjdF9vcHRpb25zLCBzZWxlY3RfdmFsdWUsIHNlbGYsIHNldENvbnRleHQsIHNldF9hdHRyaWJ1dGVzLCBzZXRfY3VycmVudF9jb21wb25lbnQsIHNldF9jdXN0b21fZWxlbWVudF9kYXRhLCBzZXRfZGF0YSwgc2V0X2RhdGFfZGV2LCBzZXRfaW5wdXRfdHlwZSwgc2V0X2lucHV0X3ZhbHVlLCBzZXRfbm93LCBzZXRfcmFmLCBzZXRfc3RvcmVfdmFsdWUsIHNldF9zdHlsZSwgc2V0X3N2Z19hdHRyaWJ1dGVzLCBzcGFjZSwgc3ByZWFkLCBzcmNfdXJsX2VxdWFsLCBzdGFydF9oeWRyYXRpbmcsIHN0b3BfcHJvcGFnYXRpb24sIHN1YnNjcmliZSwgc3ZnX2VsZW1lbnQsIHRleHQsIHRpY2ssIHRpbWVfcmFuZ2VzX3RvX2FycmF5LCB0b19udW1iZXIsIHRvZ2dsZV9jbGFzcywgdHJhbnNpdGlvbl9pbiwgdHJhbnNpdGlvbl9vdXQsIHRydXN0ZWQsIHVwZGF0ZV9hd2FpdF9ibG9ja19icmFuY2gsIHVwZGF0ZV9rZXllZF9lYWNoLCB1cGRhdGVfc2xvdCwgdXBkYXRlX3Nsb3RfYmFzZSwgdmFsaWRhdGVfY29tcG9uZW50LCB2YWxpZGF0ZV9keW5hbWljX2VsZW1lbnQsIHZhbGlkYXRlX2VhY2hfYXJndW1lbnQsIHZhbGlkYXRlX2VhY2hfa2V5cywgdmFsaWRhdGVfc2xvdHMsIHZhbGlkYXRlX3N0b3JlLCB2YWxpZGF0ZV92b2lkX2R5bmFtaWNfZWxlbWVudCwgeGxpbmtfYXR0ciB9O1xuIiwiPHNjcmlwdCBsYW5nPVwidHNcIj5cbiAgaW1wb3J0IHsgY3JlYXRlRXZlbnREaXNwYXRjaGVyIH0gZnJvbSBcInN2ZWx0ZVwiO1xuXG4gIGV4cG9ydCBsZXQgcG9wdXA6IHN0cmluZztcbiAgZXhwb3J0IGxldCBkaXNhYmxlZCA9IGZhbHNlO1xuXG4gIGNvbnN0IGRpc3BhdGNoZXIgPSBjcmVhdGVFdmVudERpc3BhdGNoZXIoKTtcbiAgY29uc3QgaGFuZGxlQ2xpY2sgPSAoKSA9PiB7XG4gICAgZGlzcGF0Y2hlcihcImNsaWNrXCIpO1xuICB9O1xuPC9zY3JpcHQ+XG5cbjxidXR0b25cbiAgYXJpYS1sYWJlbD17cG9wdXB9XG4gIGNsYXNzOm1vZC1jdGE9eyFkaXNhYmxlZH1cbiAge2Rpc2FibGVkfVxuICBvbjpjbGljaz17aGFuZGxlQ2xpY2t9XG4+XG4gIDxzbG90IC8+XG48L2J1dHRvbj5cbiIsIjxzY3JpcHQ+XG4gIGV4cG9ydCBsZXQgc2l6ZSA9IDI0XG48L3NjcmlwdD5cbjxzdmdcbiAgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiXG4gIHdpZHRoPXtzaXplfVxuICBoZWlnaHQ9e3NpemV9XG4gIHZpZXdCb3g9XCIwIDAgMjQgMjRcIlxuICBmaWxsPVwibm9uZVwiXG4gIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiXG4gIHN0cm9rZS13aWR0aD1cIjJcIlxuICBzdHJva2UtbGluZWNhcD1cInJvdW5kXCJcbiAgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIlxuICB7Li4uJCRyZXN0UHJvcHN9XG4+XG4gIDxzbG90IC8+XG4gIDxwYXRoIGQ9XCJNMTQuNSAySDZhMiAyIDAgMDAtMiAydjE2YTIgMiAwIDAwMiAyaDEyYTIgMiAwIDAwMi0yVjcuNUwxNC41IDJ6XCIgLz5cbiAgPHBvbHlsaW5lIHBvaW50cz1cIjE0IDIgMTQgOCAyMCA4XCIgLz5cbjwvc3ZnPiIsIjxzY3JpcHQgbGFuZz1cInRzXCI+XG4gIGltcG9ydCB7IGNyZWF0ZUV2ZW50RGlzcGF0Y2hlciB9IGZyb20gXCJzdmVsdGVcIjtcblxuICBleHBvcnQgbGV0IHBvcHVwOiBzdHJpbmc7XG4gIGV4cG9ydCBsZXQgZGlzYWJsZWQgPSBmYWxzZTtcblxuICBjb25zdCBkaXNwYXRjaGVyID0gY3JlYXRlRXZlbnREaXNwYXRjaGVyKCk7XG4gIGNvbnN0IGhhbmRsZUNsaWNrID0gKCkgPT4ge1xuICAgIGlmICghZGlzYWJsZWQpIHtcbiAgICAgIGRpc3BhdGNoZXIoXCJjbGlja1wiKTtcbiAgICB9XG4gIH07XG48L3NjcmlwdD5cblxuPGRpdiBjbGFzcz1cIndyYXBwZXJcIj5cbiAgPGJ1dHRvblxuICAgIGFyaWEtbGFiZWw9e3BvcHVwfVxuICAgIHtkaXNhYmxlZH1cbiAgICBvbjpjbGljaz17aGFuZGxlQ2xpY2t9XG4gICAgY2xhc3M9e2Rpc2FibGVkID8gXCJidXR0b24tZGlzYWJsZWRcIiA6IFwiYnV0dG9uLWVuYWJsZWRcIn1cbiAgICBzdHlsZT1cImJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50OyBwYWRkaW5nOiAwXCJcbiAgPlxuICAgIDxzbG90IC8+XG4gIDwvYnV0dG9uPlxuPC9kaXY+XG5cbjxzdHlsZT5cbiAgLndyYXBwZXIge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgbWFyZ2luOiAwO1xuICB9XG4gIC5idXR0b24tZW5hYmxlZDpob3ZlciB7XG4gICAgLypub2luc3BlY3Rpb24gQ3NzVW5yZXNvbHZlZEN1c3RvbVByb3BlcnR5Ki9cbiAgICBjb2xvcjogdmFyKC0taW50ZXJhY3RpdmUtYWNjZW50KTtcbiAgfVxuICAuYnV0dG9uLWRpc2FibGVkIHtcbiAgICAvKm5vaW5zcGVjdGlvbiBDc3NVbnJlc29sdmVkQ3VzdG9tUHJvcGVydHkqL1xuICAgIGNvbG9yOiB2YXIoLS10ZXh0LW11dGVkKTtcbiAgfVxuPC9zdHlsZT5cbiIsIjwhLS1zdXBwcmVzcyBMYWJlbGVkU3RhdGVtZW50SlMgLS0+XG48c2NyaXB0IGxhbmc9XCJ0c1wiPlxuICBpbXBvcnQgT2JzaWRpYW5CdXR0b24gZnJvbSBcIi4vT2JzaWRpYW5CdXR0b24uc3ZlbHRlXCI7XG4gIGltcG9ydCB7IEZpbGUgfSBmcm9tIFwic3ZlbHRlLWx1Y2lkZS1pY29uc1wiO1xuICBpbXBvcnQgT2JzaWRpYW5JY29uQnV0dG9uIGZyb20gXCIuL09ic2lkaWFuSWNvbkJ1dHRvbi5zdmVsdGVcIjtcbiAgaW1wb3J0IHR5cGUgeyBDdXN0b21EaWN0aW9uYXJ5V29yZCB9IGZyb20gXCIuLi8uLi9tb2RlbC9Xb3JkXCI7XG4gIGltcG9ydCB7IG9uTW91bnQgfSBmcm9tIFwic3ZlbHRlXCI7XG5cbiAgdHlwZSBEaWN0aW9uYXJ5ID0ge1xuICAgIGlkOiBzdHJpbmc7XG4gICAgcGF0aDogc3RyaW5nO1xuICB9O1xuXG4gIGV4cG9ydCBsZXQgZGljdGlvbmFyaWVzOiBEaWN0aW9uYXJ5W107XG4gIGV4cG9ydCBsZXQgc2VsZWN0ZWREaWN0aW9uYXJ5OiBEaWN0aW9uYXJ5O1xuICBleHBvcnQgbGV0IHdvcmQ6IHN0cmluZyA9IFwiXCI7XG4gIGV4cG9ydCBsZXQgdXNlRGlzcGxheWVkV29yZCA9IGZhbHNlO1xuICBleHBvcnQgbGV0IGRpc3BsYXllZFdvcmQ6IHN0cmluZyA9IFwiXCI7XG4gIGV4cG9ydCBsZXQgZGVzY3JpcHRpb246IHN0cmluZyA9IFwiXCI7XG4gIGV4cG9ydCBsZXQgYWxpYXNlczogc3RyaW5nW10gPSBbXTtcbiAgZXhwb3J0IGxldCBkaXZpZGVyRm9yRGlzcGxheSA9IFwiXCI7XG5cbiAgZXhwb3J0IGxldCBvblN1Ym1pdDogKFxuICAgIGRpY3Rpb25hcnlQYXRoOiBzdHJpbmcsXG4gICAgd29yZDogQ3VzdG9tRGljdGlvbmFyeVdvcmRcbiAgKSA9PiB2b2lkO1xuICBleHBvcnQgbGV0IG9uQ2xpY2tGaWxlSWNvbjogKGRpY3Rpb25hcnlQYXRoOiBzdHJpbmcpID0+IHZvaWQ7XG5cbiAgbGV0IGFsaWFzZXNTdHIgPSBhbGlhc2VzLmpvaW4oXCJcXG5cIik7XG4gIGxldCB3b3JkUmVmID0gbnVsbDtcbiAgbGV0IGRpc3BsYXllZFdvcmRSZWYgPSBudWxsO1xuXG4gICQ6IGVuYWJsZVN1Ym1pdCA9IHdvcmQubGVuZ3RoID4gMDtcbiAgJDogZW5hYmxlRGlzcGxheWVkV29yZCA9IEJvb2xlYW4oZGl2aWRlckZvckRpc3BsYXkpO1xuICAkOiBmaXJzdFdvcmRUaXRsZSA9IHVzZURpc3BsYXllZFdvcmQgPyBcIkluc2VydGVkIHdvcmRcIiA6IFwiV29yZFwiO1xuICAkOiB7XG4gICAgaWYgKHVzZURpc3BsYXllZFdvcmQpIHtcbiAgICAgIGRpc3BsYXllZFdvcmRSZWY/LmZvY3VzKCk7XG4gICAgfVxuICB9XG5cbiAgY29uc3QgaGFuZGxlU3VibWl0ID0gKCkgPT4ge1xuICAgIG9uU3VibWl0KHNlbGVjdGVkRGljdGlvbmFyeS5wYXRoLCB7XG4gICAgICB2YWx1ZTogZGlzcGxheWVkV29yZCB8fCB3b3JkLFxuICAgICAgZGVzY3JpcHRpb24sXG4gICAgICBhbGlhc2VzOiBhbGlhc2VzU3RyLnNwbGl0KFwiXFxuXCIpLFxuICAgICAgdHlwZTogXCJjdXN0b21EaWN0aW9uYXJ5XCIsXG4gICAgICBjcmVhdGVkUGF0aDogc2VsZWN0ZWREaWN0aW9uYXJ5LnBhdGgsXG4gICAgICBpbnNlcnRlZFRleHQ6IGRpc3BsYXllZFdvcmQgPyB3b3JkIDogdW5kZWZpbmVkLFxuICAgIH0pO1xuICB9O1xuXG4gIG9uTW91bnQoKCkgPT4ge1xuICAgIHNldFRpbWVvdXQoKCkgPT4gd29yZFJlZi5mb2N1cygpLCA1MCk7XG4gIH0pO1xuPC9zY3JpcHQ+XG5cbjxkaXY+XG4gIDxoMj5BZGQgYSB3b3JkIHRvIGEgY3VzdG9tIGRpY3Rpb25hcnk8L2gyPlxuXG4gIDxoMz5EaWN0aW9uYXJ5PC9oMz5cbiAgPGRpdiBzdHlsZT1cImRpc3BsYXk6IGZsZXg7IGdhcDogMTBweFwiPlxuICAgIDxzZWxlY3QgYmluZDp2YWx1ZT17c2VsZWN0ZWREaWN0aW9uYXJ5fSBjbGFzcz1cImRyb3Bkb3duXCI+XG4gICAgICB7I2VhY2ggZGljdGlvbmFyaWVzIGFzIGRpY3Rpb25hcnl9XG4gICAgICAgIDxvcHRpb24gdmFsdWU9e2RpY3Rpb25hcnl9PlxuICAgICAgICAgIHtkaWN0aW9uYXJ5LnBhdGh9XG4gICAgICAgIDwvb3B0aW9uPlxuICAgICAgey9lYWNofVxuICAgIDwvc2VsZWN0PlxuICAgIDxPYnNpZGlhbkljb25CdXR0b25cbiAgICAgIHBvcHVwPVwiT3BlbiB0aGUgZmlsZVwiXG4gICAgICBvbjpjbGljaz17KCkgPT4gb25DbGlja0ZpbGVJY29uKHNlbGVjdGVkRGljdGlvbmFyeS5wYXRoKX1cbiAgICA+XG4gICAgICA8RmlsZSAvPlxuICAgIDwvT2JzaWRpYW5JY29uQnV0dG9uPlxuICA8L2Rpdj5cblxuICA8aDM+e2ZpcnN0V29yZFRpdGxlfTwvaDM+XG4gIDx0ZXh0YXJlYVxuICAgIGJpbmQ6dmFsdWU9e3dvcmR9XG4gICAgc3R5bGU9XCJ3aWR0aDogMTAwJTtcIlxuICAgIHJvd3M9XCIzXCJcbiAgICBiaW5kOnRoaXM9e3dvcmRSZWZ9XG4gIC8+XG5cbiAgeyNpZiBlbmFibGVEaXNwbGF5ZWRXb3JkfVxuICAgIDxsYWJlbD5cbiAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBiaW5kOmNoZWNrZWQ9e3VzZURpc3BsYXllZFdvcmR9IC8+XG4gICAgICBEaXN0aW5ndWlzaCBiZXR3ZWVuIGRpc3BsYXkgYW5kIGluc2VydGlvblxuICAgIDwvbGFiZWw+XG4gIHsvaWZ9XG5cbiAgeyNpZiB1c2VEaXNwbGF5ZWRXb3JkfVxuICAgIDxoMz5EaXNwbGF5ZWQgV29yZDwvaDM+XG4gICAgPHRleHRhcmVhXG4gICAgICBiaW5kOnZhbHVlPXtkaXNwbGF5ZWRXb3JkfVxuICAgICAgc3R5bGU9XCJ3aWR0aDogMTAwJTtcIlxuICAgICAgcm93cz1cIjNcIlxuICAgICAgYmluZDp0aGlzPXtkaXNwbGF5ZWRXb3JkUmVmfVxuICAgIC8+XG4gIHsvaWZ9XG5cbiAgPGgzPkRlc2NyaXB0aW9uPC9oMz5cbiAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgYmluZDp2YWx1ZT17ZGVzY3JpcHRpb259IHN0eWxlPVwid2lkdGg6IDEwMCU7XCIgLz5cblxuICA8aDM+QWxpYXNlcyAoZm9yIGVhY2ggbGluZSk8L2gzPlxuICA8dGV4dGFyZWEgYmluZDp2YWx1ZT17YWxpYXNlc1N0cn0gc3R5bGU9XCJ3aWR0aDogMTAwJTtcIiByb3dzPVwiM1wiIC8+XG5cbiAgPGRpdiBzdHlsZT1cInRleHQtYWxpZ246IGNlbnRlcjsgd2lkdGg6IDEwMCU7IHBhZGRpbmctdG9wOiAxNXB4O1wiPlxuICAgIDxPYnNpZGlhbkJ1dHRvbiBkaXNhYmxlZD17IWVuYWJsZVN1Ym1pdH0gb246Y2xpY2s9e2hhbmRsZVN1Ym1pdH1cbiAgICAgID5TdWJtaXQ8L09ic2lkaWFuQnV0dG9uXG4gICAgPlxuICA8L2Rpdj5cbjwvZGl2PlxuXG48c3R5bGU+XG48L3N0eWxlPlxuIiwiaW1wb3J0IHsgQXBwLCBNb2RhbCwgTm90aWNlIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgeyBBcHBIZWxwZXIgfSBmcm9tIFwiLi4vYXBwLWhlbHBlclwiO1xuaW1wb3J0IHR5cGUgeyBDdXN0b21EaWN0aW9uYXJ5V29yZCB9IGZyb20gXCIuLi9tb2RlbC9Xb3JkXCI7XG5pbXBvcnQgQ3VzdG9tRGljdGlvbmFyeVdvcmRBZGQgZnJvbSBcIi4vY29tcG9uZW50L0N1c3RvbURpY3Rpb25hcnlXb3JkQWRkLnN2ZWx0ZVwiO1xuXG5leHBvcnQgY2xhc3MgQ3VzdG9tRGljdGlvbmFyeVdvcmRBZGRNb2RhbCBleHRlbmRzIE1vZGFsIHtcbiAgY29tcG9uZW50OiBDdXN0b21EaWN0aW9uYXJ5V29yZEFkZDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBhcHA6IEFwcCxcbiAgICBkaWN0aW9uYXJ5UGF0aHM6IHN0cmluZ1tdLFxuICAgIGluaXRpYWxWYWx1ZTogc3RyaW5nID0gXCJcIixcbiAgICBkaXZpZGVyRm9yRGlzcGxheTogc3RyaW5nID0gXCJcIixcbiAgICBvblN1Ym1pdDogKGRpY3Rpb25hcnlQYXRoOiBzdHJpbmcsIHdvcmQ6IEN1c3RvbURpY3Rpb25hcnlXb3JkKSA9PiB2b2lkXG4gICkge1xuICAgIHN1cGVyKGFwcCk7XG4gICAgY29uc3QgYXBwSGVscGVyID0gbmV3IEFwcEhlbHBlcihhcHApO1xuXG4gICAgY29uc3QgZGljdGlvbmFyaWVzID0gZGljdGlvbmFyeVBhdGhzLm1hcCgoeCkgPT4gKHsgaWQ6IHgsIHBhdGg6IHggfSkpO1xuXG4gICAgY29uc3QgeyBjb250ZW50RWwgfSA9IHRoaXM7XG4gICAgdGhpcy5jb21wb25lbnQgPSBuZXcgQ3VzdG9tRGljdGlvbmFyeVdvcmRBZGQoe1xuICAgICAgdGFyZ2V0OiBjb250ZW50RWwsXG4gICAgICBwcm9wczoge1xuICAgICAgICBkaWN0aW9uYXJpZXMsXG4gICAgICAgIHNlbGVjdGVkRGljdGlvbmFyeTogZGljdGlvbmFyaWVzWzBdLFxuICAgICAgICB3b3JkOiBpbml0aWFsVmFsdWUsXG4gICAgICAgIGRpdmlkZXJGb3JEaXNwbGF5LFxuICAgICAgICBvblN1Ym1pdDogb25TdWJtaXQsXG4gICAgICAgIG9uQ2xpY2tGaWxlSWNvbjogKGRpY3Rpb25hcnlQYXRoOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICBjb25zdCBtYXJrZG93bkZpbGUgPSBhcHBIZWxwZXIuZ2V0TWFya2Rvd25GaWxlQnlQYXRoKGRpY3Rpb25hcnlQYXRoKTtcbiAgICAgICAgICBpZiAoIW1hcmtkb3duRmlsZSkge1xuICAgICAgICAgICAgLy8gbm9pbnNwZWN0aW9uIE9iamVjdEFsbG9jYXRpb25JZ25vcmVkXG4gICAgICAgICAgICBuZXcgTm90aWNlKGBDYW4ndCBvcGVuICR7ZGljdGlvbmFyeVBhdGh9YCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgICAgIGFwcEhlbHBlci5vcGVuTWFya2Rvd25GaWxlKG1hcmtkb3duRmlsZSwgdHJ1ZSk7XG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgb25DbG9zZSgpIHtcbiAgICBzdXBlci5vbkNsb3NlKCk7XG4gICAgdGhpcy5jb21wb25lbnQuJGRlc3Ryb3koKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgZGVib3VuY2UsIE5vdGljZSwgUGx1Z2luIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgeyBBdXRvQ29tcGxldGVTdWdnZXN0IH0gZnJvbSBcIi4vdWkvQXV0b0NvbXBsZXRlU3VnZ2VzdFwiO1xuaW1wb3J0IHtcbiAgREVGQVVMVF9TRVRUSU5HUyxcbiAgdHlwZSBTZXR0aW5ncyxcbiAgVmFyaW91c0NvbXBsZW1lbnRzU2V0dGluZ1RhYixcbn0gZnJvbSBcIi4vc2V0dGluZy9zZXR0aW5nc1wiO1xuaW1wb3J0IHsgQXBwSGVscGVyIH0gZnJvbSBcIi4vYXBwLWhlbHBlclwiO1xuaW1wb3J0IHsgUHJvdmlkZXJTdGF0dXNCYXIgfSBmcm9tIFwiLi91aS9Qcm92aWRlclN0YXR1c0JhclwiO1xuaW1wb3J0IHsgQ3VzdG9tRGljdGlvbmFyeVdvcmRBZGRNb2RhbCB9IGZyb20gXCIuL3VpL0N1c3RvbURpY3Rpb25hcnlXb3JkQWRkTW9kYWxcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVmFyaW91c0NvbXBvbmVudHMgZXh0ZW5kcyBQbHVnaW4ge1xuICBhcHBIZWxwZXI6IEFwcEhlbHBlcjtcbiAgc2V0dGluZ3M6IFNldHRpbmdzO1xuICBzZXR0aW5nVGFiOiBWYXJpb3VzQ29tcGxlbWVudHNTZXR0aW5nVGFiO1xuICBzdWdnZXN0ZXI6IEF1dG9Db21wbGV0ZVN1Z2dlc3Q7XG4gIHN0YXR1c0Jhcj86IFByb3ZpZGVyU3RhdHVzQmFyO1xuXG4gIG9udW5sb2FkKCkge1xuICAgIHN1cGVyLm9udW5sb2FkKCk7XG4gICAgdGhpcy5zdWdnZXN0ZXIudW5yZWdpc3RlcigpO1xuICB9XG5cbiAgYXN5bmMgb25sb2FkKCkge1xuICAgIHRoaXMuYXBwSGVscGVyID0gbmV3IEFwcEhlbHBlcih0aGlzLmFwcCk7XG5cbiAgICB0aGlzLnJlZ2lzdGVyRXZlbnQoXG4gICAgICB0aGlzLmFwcC53b3Jrc3BhY2Uub24oXCJlZGl0b3ItbWVudVwiLCAobWVudSkgPT4ge1xuICAgICAgICBpZiAoIXRoaXMuYXBwSGVscGVyLmdldFNlbGVjdGlvbigpKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbWVudS5hZGRJdGVtKChpdGVtKSA9PlxuICAgICAgICAgIGl0ZW1cbiAgICAgICAgICAgIC5zZXRUaXRsZShcIkFkZCB0byBjdXN0b20gZGljdGlvbmFyeVwiKVxuICAgICAgICAgICAgLnNldEljb24oXCJzdGFja2VkLWxldmVsc1wiKVxuICAgICAgICAgICAgLm9uQ2xpY2soKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLmFkZFdvcmRUb0N1c3RvbURpY3Rpb25hcnkoKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICk7XG4gICAgICB9KVxuICAgICk7XG5cbiAgICBhd2FpdCB0aGlzLmxvYWRTZXR0aW5ncygpO1xuXG4gICAgdGhpcy5zZXR0aW5nVGFiID0gbmV3IFZhcmlvdXNDb21wbGVtZW50c1NldHRpbmdUYWIodGhpcy5hcHAsIHRoaXMpO1xuICAgIHRoaXMuYWRkU2V0dGluZ1RhYih0aGlzLnNldHRpbmdUYWIpO1xuXG4gICAgdGhpcy5zdGF0dXNCYXIgPSBQcm92aWRlclN0YXR1c0Jhci5uZXcoXG4gICAgICB0aGlzLmFkZFN0YXR1c0Jhckl0ZW0oKSxcbiAgICAgIHRoaXMuc2V0dGluZ3Muc2hvd01hdGNoU3RyYXRlZ3ksXG4gICAgICB0aGlzLnNldHRpbmdzLnNob3dJbmRleGluZ1N0YXR1c1xuICAgICk7XG4gICAgdGhpcy5zdGF0dXNCYXIuc2V0T25DbGlja1N0cmF0ZWd5TGlzdGVuZXIoYXN5bmMgKCkgPT4ge1xuICAgICAgYXdhaXQgdGhpcy5zZXR0aW5nVGFiLnRvZ2dsZU1hdGNoU3RyYXRlZ3koKTtcbiAgICB9KTtcblxuICAgIGNvbnN0IGRlYm91bmNlZFNhdmVEYXRhID0gZGVib3VuY2UoYXN5bmMgKCkgPT4ge1xuICAgICAgYXdhaXQgdGhpcy5zYXZlRGF0YSh0aGlzLnNldHRpbmdzKTtcbiAgICB9LCA1MDAwKTtcblxuICAgIHRoaXMuc3VnZ2VzdGVyID0gYXdhaXQgQXV0b0NvbXBsZXRlU3VnZ2VzdC5uZXcoXG4gICAgICB0aGlzLmFwcCxcbiAgICAgIHRoaXMuc2V0dGluZ3MsXG4gICAgICB0aGlzLnN0YXR1c0JhcixcbiAgICAgIGRlYm91bmNlZFNhdmVEYXRhXG4gICAgKTtcbiAgICB0aGlzLnJlZ2lzdGVyRWRpdG9yU3VnZ2VzdCh0aGlzLnN1Z2dlc3Rlcik7XG5cbiAgICB0aGlzLmFkZENvbW1hbmQoe1xuICAgICAgaWQ6IFwicmVsb2FkLWN1c3RvbS1kaWN0aW9uYXJpZXNcIixcbiAgICAgIG5hbWU6IFwiUmVsb2FkIGN1c3RvbSBkaWN0aW9uYXJpZXNcIixcbiAgICAgIGhvdGtleXM6IFt7IG1vZGlmaWVyczogW1wiTW9kXCIsIFwiU2hpZnRcIl0sIGtleTogXCJyXCIgfV0sXG4gICAgICBjYWxsYmFjazogYXN5bmMgKCkgPT4ge1xuICAgICAgICBhd2FpdCB0aGlzLnN1Z2dlc3Rlci5yZWZyZXNoQ3VzdG9tRGljdGlvbmFyeVRva2VucygpO1xuICAgICAgfSxcbiAgICB9KTtcblxuICAgIHRoaXMuYWRkQ29tbWFuZCh7XG4gICAgICBpZDogXCJyZWxvYWQtY3VycmVudC12YXVsdFwiLFxuICAgICAgbmFtZTogXCJSZWxvYWQgY3VycmVudCB2YXVsdFwiLFxuICAgICAgY2FsbGJhY2s6IGFzeW5jICgpID0+IHtcbiAgICAgICAgYXdhaXQgdGhpcy5zdWdnZXN0ZXIucmVmcmVzaEN1cnJlbnRWYXVsdFRva2VucygpO1xuICAgICAgfSxcbiAgICB9KTtcblxuICAgIHRoaXMuYWRkQ29tbWFuZCh7XG4gICAgICBpZDogXCJ0b2dnbGUtbWF0Y2gtc3RyYXRlZ3lcIixcbiAgICAgIG5hbWU6IFwiVG9nZ2xlIE1hdGNoIHN0cmF0ZWd5XCIsXG4gICAgICBjYWxsYmFjazogYXN5bmMgKCkgPT4ge1xuICAgICAgICBhd2FpdCB0aGlzLnNldHRpbmdUYWIudG9nZ2xlTWF0Y2hTdHJhdGVneSgpO1xuICAgICAgfSxcbiAgICB9KTtcblxuICAgIHRoaXMuYWRkQ29tbWFuZCh7XG4gICAgICBpZDogXCJ0b2dnbGUtY29tcGxlbWVudC1hdXRvbWF0aWNhbGx5XCIsXG4gICAgICBuYW1lOiBcIlRvZ2dsZSBDb21wbGVtZW50IGF1dG9tYXRpY2FsbHlcIixcbiAgICAgIGNhbGxiYWNrOiBhc3luYyAoKSA9PiB7XG4gICAgICAgIGF3YWl0IHRoaXMuc2V0dGluZ1RhYi50b2dnbGVDb21wbGVtZW50QXV0b21hdGljYWxseSgpO1xuICAgICAgfSxcbiAgICB9KTtcblxuICAgIHRoaXMuYWRkQ29tbWFuZCh7XG4gICAgICBpZDogXCJzaG93LXN1Z2dlc3Rpb25zXCIsXG4gICAgICBuYW1lOiBcIlNob3cgc3VnZ2VzdGlvbnNcIixcbiAgICAgIGhvdGtleXM6IFt7IG1vZGlmaWVyczogW1wiTW9kXCJdLCBrZXk6IFwiIFwiIH1dLFxuICAgICAgY2FsbGJhY2s6IGFzeW5jICgpID0+IHtcbiAgICAgICAgdGhpcy5zdWdnZXN0ZXIudHJpZ2dlckNvbXBsZXRlKCk7XG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgdGhpcy5hZGRDb21tYW5kKHtcbiAgICAgIGlkOiBcImFkZC13b3JkLWN1c3RvbS1kaWN0aW9uYXJ5XCIsXG4gICAgICBuYW1lOiBcIkFkZCBhIHdvcmQgdG8gYSBjdXN0b20gZGljdGlvbmFyeVwiLFxuICAgICAgaG90a2V5czogW3sgbW9kaWZpZXJzOiBbXCJNb2RcIiwgXCJTaGlmdFwiXSwga2V5OiBcIiBcIiB9XSxcbiAgICAgIGNhbGxiYWNrOiBhc3luYyAoKSA9PiB7XG4gICAgICAgIHRoaXMuYWRkV29yZFRvQ3VzdG9tRGljdGlvbmFyeSgpO1xuICAgICAgfSxcbiAgICB9KTtcblxuICAgIHRoaXMuYWRkQ29tbWFuZCh7XG4gICAgICBpZDogXCJwcmVkaWN0YWJsZS1jb21wbGVtZW50c1wiLFxuICAgICAgbmFtZTogXCJQcmVkaWN0YWJsZSBjb21wbGVtZW50XCIsXG4gICAgICBjYWxsYmFjazogYXN5bmMgKCkgPT4ge1xuICAgICAgICB0aGlzLnN1Z2dlc3Rlci5wcmVkaWN0YWJsZUNvbXBsZXRlKCk7XG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgdGhpcy5hZGRDb21tYW5kKHtcbiAgICAgIGlkOiBcImNvcHktcGx1Z2luLXNldHRpbmdzXCIsXG4gICAgICBuYW1lOiBcIkNvcHkgcGx1Z2luIHNldHRpbmdzXCIsXG4gICAgICBjYWxsYmFjazogYXN5bmMgKCkgPT4ge1xuICAgICAgICBhd2FpdCBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dChcbiAgICAgICAgICB0aGlzLnNldHRpbmdUYWIuZ2V0UGx1Z2luU2V0dGluZ3NBc0pzb25TdHJpbmcoKVxuICAgICAgICApO1xuICAgICAgICAvLyBub2luc3BlY3Rpb24gT2JqZWN0QWxsb2NhdGlvbklnbm9yZWRcbiAgICAgICAgbmV3IE5vdGljZShcIkNvcHkgc2V0dGluZ3Mgb2YgVmFyaW91cyBDb21wbGVtZW50c1wiKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICBhc3luYyBsb2FkU2V0dGluZ3MoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdGhpcy5zZXR0aW5ncyA9IHsgLi4uREVGQVVMVF9TRVRUSU5HUywgLi4uKGF3YWl0IHRoaXMubG9hZERhdGEoKSkgfTtcbiAgfVxuXG4gIGFzeW5jIHNhdmVTZXR0aW5ncyhcbiAgICBuZWVkVXBkYXRlVG9rZW5zOiB7XG4gICAgICBjdXJyZW50RmlsZT86IGJvb2xlYW47XG4gICAgICBjdXJyZW50VmF1bHQ/OiBib29sZWFuO1xuICAgICAgY3VzdG9tRGljdGlvbmFyeT86IGJvb2xlYW47XG4gICAgICBpbnRlcm5hbExpbms/OiBib29sZWFuO1xuICAgICAgZnJvbnRNYXR0ZXI/OiBib29sZWFuO1xuICAgIH0gPSB7fVxuICApOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCB0aGlzLnNhdmVEYXRhKHRoaXMuc2V0dGluZ3MpO1xuICAgIGF3YWl0IHRoaXMuc3VnZ2VzdGVyLnVwZGF0ZVNldHRpbmdzKHRoaXMuc2V0dGluZ3MpO1xuICAgIGlmIChuZWVkVXBkYXRlVG9rZW5zLmN1cnJlbnRGaWxlKSB7XG4gICAgICBhd2FpdCB0aGlzLnN1Z2dlc3Rlci5yZWZyZXNoQ3VycmVudEZpbGVUb2tlbnMoKTtcbiAgICB9XG4gICAgaWYgKG5lZWRVcGRhdGVUb2tlbnMuY3VycmVudFZhdWx0KSB7XG4gICAgICBhd2FpdCB0aGlzLnN1Z2dlc3Rlci5yZWZyZXNoQ3VycmVudFZhdWx0VG9rZW5zKCk7XG4gICAgfVxuICAgIGlmIChuZWVkVXBkYXRlVG9rZW5zLmN1c3RvbURpY3Rpb25hcnkpIHtcbiAgICAgIGF3YWl0IHRoaXMuc3VnZ2VzdGVyLnJlZnJlc2hDdXN0b21EaWN0aW9uYXJ5VG9rZW5zKCk7XG4gICAgfVxuICAgIGlmIChuZWVkVXBkYXRlVG9rZW5zLmludGVybmFsTGluaykge1xuICAgICAgYXdhaXQgdGhpcy5zdWdnZXN0ZXIucmVmcmVzaEludGVybmFsTGlua1Rva2VucygpO1xuICAgIH1cbiAgICBpZiAobmVlZFVwZGF0ZVRva2Vucy5mcm9udE1hdHRlcikge1xuICAgICAgYXdhaXQgdGhpcy5zdWdnZXN0ZXIucmVmcmVzaEZyb250TWF0dGVyVG9rZW5zKCk7XG4gICAgfVxuICB9XG5cbiAgYWRkV29yZFRvQ3VzdG9tRGljdGlvbmFyeSgpIHtcbiAgICBjb25zdCBzZWxlY3RlZFdvcmQgPSB0aGlzLmFwcEhlbHBlci5nZXRTZWxlY3Rpb24oKTtcbiAgICBjb25zdCBwcm92aWRlciA9IHRoaXMuc3VnZ2VzdGVyLmN1c3RvbURpY3Rpb25hcnlXb3JkUHJvdmlkZXI7XG4gICAgY29uc3QgbW9kYWwgPSBuZXcgQ3VzdG9tRGljdGlvbmFyeVdvcmRBZGRNb2RhbChcbiAgICAgIHRoaXMuYXBwLFxuICAgICAgcHJvdmlkZXIuZWRpdGFibGVQYXRocyxcbiAgICAgIHNlbGVjdGVkV29yZCxcbiAgICAgIHRoaXMuc2V0dGluZ3MuZGVsaW1pdGVyVG9EaXZpZGVTdWdnZXN0aW9uc0ZvckRpc3BsYXlGcm9tSW5zZXJ0aW9uLFxuICAgICAgYXN5bmMgKGRpY3Rpb25hcnlQYXRoLCB3b3JkKSA9PiB7XG4gICAgICAgIGlmIChwcm92aWRlci53b3JkQnlWYWx1ZVt3b3JkLnZhbHVlXSkge1xuICAgICAgICAgIC8vIG5vaW5zcGVjdGlvbiBPYmplY3RBbGxvY2F0aW9uSWdub3JlZFxuICAgICAgICAgIG5ldyBOb3RpY2UoYOKaoCAke3dvcmQudmFsdWV9IGFscmVhZHkgZXhpc3RzYCwgMCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgYXdhaXQgcHJvdmlkZXIuYWRkV29yZFdpdGhEaWN0aW9uYXJ5KHdvcmQsIGRpY3Rpb25hcnlQYXRoKTtcbiAgICAgICAgLy8gbm9pbnNwZWN0aW9uIE9iamVjdEFsbG9jYXRpb25JZ25vcmVkXG4gICAgICAgIG5ldyBOb3RpY2UoYEFkZGVkICR7d29yZC52YWx1ZX1gKTtcbiAgICAgICAgbW9kYWwuY2xvc2UoKTtcbiAgICAgIH1cbiAgICApO1xuXG4gICAgbW9kYWwub3BlbigpO1xuICB9XG59XG4iXSwibmFtZXMiOlsicGFyc2VGcm9udE1hdHRlckFsaWFzZXMiLCJwYXJzZUZyb250TWF0dGVyVGFncyIsInBhcnNlRnJvbnRNYXR0ZXJTdHJpbmdBcnJheSIsIk1hcmtkb3duVmlldyIsIm5vcm1hbGl6ZVBhdGgiLCJzeW5vbnltQWxpYXNlcyIsInJlcXVlc3QiLCJOb3RpY2UiLCJFZGl0b3JTdWdnZXN0IiwiZGVib3VuY2UiLCJQbHVnaW5TZXR0aW5nVGFiIiwiU2V0dGluZyIsIk1vZGFsIiwiUGx1Z2luIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQTRCQTtBQUNPLFNBQVMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDN0IsSUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDZixJQUFJLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7QUFDdkYsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3BCLElBQUksSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLE9BQU8sTUFBTSxDQUFDLHFCQUFxQixLQUFLLFVBQVU7QUFDdkUsUUFBUSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ2hGLFlBQVksSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzFGLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFD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QixDQUFDO0FBQ0YsSUFBQSxJQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztBQUNwQixJQUFBLEtBQUssSUFBSSxDQUFDLElBQUksUUFBUSxFQUFFO0FBQ3RCLFFBQUEsSUFBSSxNQUFNLEdBQUcsSUFBSSxNQUFNLEVBQUUsQ0FBQztBQUMxQixRQUFBLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbEIsUUFBQSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzVDLEtBQUE7QUFFRCxJQUFBLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFDbkIsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ3JELElBQUksQ0FBQyxLQUFLLEdBQUc7UUFDWCxFQUFFLEVBQUUsQ0FBQyxJQUFJO0FBQ1QsUUFBQSxFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxDQUFDLEdBQUc7UUFDUixFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsSUFBSTtBQUNULFFBQUEsRUFBRSxFQUFFLElBQUk7QUFDUixRQUFBLEVBQUUsRUFBRSxJQUFJO0FBQ1IsUUFBQSxFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxJQUFJO0FBQ1QsUUFBQSxFQUFFLEVBQUUsSUFBSTtBQUNSLFFBQUEsRUFBRSxFQUFFLElBQUk7QUFDUixRQUFBLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLElBQUk7QUFDVCxRQUFBLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLENBQUMsSUFBSTtLQUNWLENBQUM7SUFDRixJQUFJLENBQUMsS0FBSyxHQUFHO0FBQ1gsUUFBQSxFQUFFLEVBQUUsR0FBRztBQUNQLFFBQUEsRUFBRSxFQUFFLEdBQUc7UUFDUCxFQUFFLEVBQUUsQ0FBQyxHQUFHO1FBQ1IsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLEdBQUc7UUFDUixFQUFFLEVBQUUsQ0FBQyxHQUFHO0FBQ1IsUUFBQSxFQUFFLEVBQUUsSUFBSTtBQUNSLFFBQUEsRUFBRSxFQUFFLElBQUk7QUFDUixRQUFBLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLENBQUMsSUFBSTtBQUNULFFBQUEsRUFBRSxFQUFFLEdBQUc7S0FDUixDQUFDO0lBQ0YsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDO0FBQ3JELElBQUEsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDbkMsSUFBSSxDQUFDLEtBQUssR0FBRztBQUNYLFFBQUEsR0FBRyxFQUFFLElBQUk7QUFDVCxRQUFBLEdBQUcsRUFBRSxJQUFJO1FBQ1QsR0FBRyxFQUFFLENBQUMsSUFBSTtBQUNWLFFBQUEsR0FBRyxFQUFFLEdBQUc7QUFDUixRQUFBLEdBQUcsRUFBRSxJQUFJO0FBQ1QsUUFBQSxHQUFHLEVBQUUsR0FBRztRQUNSLEdBQUcsRUFBRSxDQUFDLEVBQUU7UUFDUixHQUFHLEVBQUUsQ0FBQyxJQUFJO0FBQ1YsUUFBQSxHQUFHLEVBQUUsR0FBRztRQUNSLEdBQUcsRUFBRSxDQUFDLEdBQUc7QUFDVCxRQUFBLEdBQUcsRUFBRSxJQUFJO1FBQ1QsR0FBRyxFQUFFLENBQUMsSUFBSTtBQUNWLFFBQUEsR0FBRyxFQUFFLEdBQUc7QUFDUixRQUFBLEdBQUcsRUFBRSxJQUFJO0tBQ1YsQ0FBQztJQUNGLElBQUksQ0FBQyxLQUFLLEdBQUc7QUFDWCxRQUFBLEdBQUcsRUFBRSxHQUFHO1FBQ1IsR0FBRyxFQUFFLENBQUMsSUFBSTtBQUNWLFFBQUEsR0FBRyxFQUFFLEdBQUc7UUFDUixHQUFHLEVBQUUsQ0FBQyxHQUFHO1FBQ1QsR0FBRyxFQUFFLENBQUMsSUFBSTtBQUNWLFFBQUEsR0FBRyxFQUFFLEdBQUc7UUFDUixHQUFHLEVBQUUsQ0FBQyxJQUFJO1FBQ1YsR0FBRyxFQUFFLENBQUMsR0FBRztBQUNULFFBQUEsR0FBRyxFQUFFLEdBQUc7UUFDUixHQUFHLEVBQUUsQ0FBQyxJQUFJO0tBQ1gsQ0FBQztJQUNGLElBQUksQ0FBQyxLQUFLLEdBQUc7UUFDWCxHQUFHLEVBQUUsQ0FBQyxHQUFHO0FBQ1QsUUFBQSxHQUFHLEVBQUUsSUFBSTtRQUNULEdBQUcsRUFBRSxDQUFDLEdBQUc7QUFDVCxRQUFBLEdBQUcsRUFBRSxHQUFHO0FBQ1IsUUFBQSxHQUFHLEVBQUUsR0FBRztBQUNSLFFBQUEsR0FBRyxFQUFFLElBQUk7QUFDVCxRQUFBLEdBQUcsRUFBRSxHQUFHO0FBQ1IsUUFBQSxHQUFHLEVBQUUsR0FBRztBQUNSLFFBQUEsR0FBRyxFQUFFLElBQUk7QUFDVCxRQUFBLEdBQUcsRUFBRSxHQUFHO0FBQ1IsUUFBQSxHQUFHLEVBQUUsR0FBRztBQUNSLFFBQUEsR0FBRyxFQUFFLElBQUk7UUFDVCxHQUFHLEVBQUUsQ0FBQyxHQUFHO1FBQ1QsR0FBRyxFQUFFLENBQUMsSUFBSTtRQUNWLEdBQUcsRUFBRSxDQUFDLElBQUk7QUFDVixRQUFBLEdBQUcsRUFBRSxLQUFLO0tBQ1gsQ0FBQztJQUNGLElBQUksQ0FBQyxLQUFLLEdBQUc7UUFDWCxHQUFHLEVBQUUsQ0FBQyxJQUFJO0FBQ1YsUUFBQSxHQUFHLEVBQUUsSUFBSTtRQUNULEdBQUcsRUFBRSxDQUFDLElBQUk7QUFDVixRQUFBLEdBQUcsRUFBRSxJQUFJO1FBQ1QsR0FBRyxFQUFFLENBQUMsSUFBSTtRQUNWLEdBQUcsRUFBRSxDQUFDLElBQUk7UUFDVixHQUFHLEVBQUUsQ0FBQyxLQUFLO0FBQ1gsUUFBQSxHQUFHLEVBQUUsR0FBRztBQUNSLFFBQUEsR0FBRyxFQUFFLEdBQUc7UUFDUixHQUFHLEVBQUUsQ0FBQyxJQUFJO1FBQ1YsR0FBRyxFQUFFLENBQUMsR0FBRztLQUNWLENBQUM7SUFDRixJQUFJLENBQUMsS0FBSyxHQUFHO0FBQ1gsUUFBQSxJQUFJLEVBQUUsR0FBRztBQUNULFFBQUEsSUFBSSxFQUFFLEdBQUc7QUFDVCxRQUFBLEdBQUcsRUFBRSxJQUFJO0FBQ1QsUUFBQSxHQUFHLEVBQUUsR0FBRztBQUNSLFFBQUEsSUFBSSxFQUFFLEdBQUc7QUFDVCxRQUFBLElBQUksRUFBRSxHQUFHO0FBQ1QsUUFBQSxJQUFJLEVBQUUsSUFBSTtBQUNWLFFBQUEsRUFBRSxFQUFFLElBQUk7QUFDUixRQUFBLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLENBQUMsSUFBSTtBQUNULFFBQUEsRUFBRSxFQUFFLEdBQUc7UUFDUCxFQUFFLEVBQUUsQ0FBQyxJQUFJO0FBQ1QsUUFBQSxFQUFFLEVBQUUsR0FBRztBQUNQLFFBQUEsRUFBRSxFQUFFLElBQUk7QUFDUixRQUFBLEVBQUUsRUFBRSxHQUFHO1FBQ1AsRUFBRSxFQUFFLENBQUMsR0FBRztBQUNSLFFBQUEsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsSUFBSTtBQUNULFFBQUEsRUFBRSxFQUFFLElBQUk7QUFDUixRQUFBLEVBQUUsRUFBRSxJQUFJO0FBQ1IsUUFBQSxFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxDQUFDLElBQUk7QUFDVCxRQUFBLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLENBQUMsR0FBRztBQUNSLFFBQUEsRUFBRSxFQUFFLElBQUk7QUFDUixRQUFBLEVBQUUsRUFBRSxHQUFHO0FBQ1AsUUFBQSxFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxDQUFDLEdBQUc7QUFDUixRQUFBLEVBQUUsRUFBRSxHQUFHO0FBQ1AsUUFBQSxFQUFFLEVBQUUsSUFBSTtBQUNSLFFBQUEsRUFBRSxFQUFFLElBQUk7QUFDUixRQUFBLEVBQUUsRUFBRSxJQUFJO0FBQ1IsUUFBQSxFQUFFLEVBQUUsR0FBRztRQUNQLEVBQUUsRUFBRSxDQUFDLElBQUk7QUFDVCxRQUFBLEVBQUUsRUFBRSxJQUFJO0FBQ1IsUUFBQSxFQUFFLEVBQUUsSUFBSTtBQUNSLFFBQUEsRUFBRSxFQUFFLElBQUk7QUFDUixRQUFBLEVBQUUsRUFBRSxJQUFJO0FBQ1IsUUFBQSxFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxDQUFDLElBQUk7QUFDVCxRQUFBLEVBQUUsRUFBRSxJQUFJO0FBQ1IsUUFBQSxFQUFFLEVBQUUsSUFBSTtBQUNSLFFBQUEsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsQ0FBQyxHQUFHO1FBQ1IsRUFBRSxFQUFFLENBQUMsR0FBRztBQUNSLFFBQUEsRUFBRSxFQUFFLEdBQUc7QUFDUCxRQUFBLEVBQUUsRUFBRSxJQUFJO0FBQ1IsUUFBQSxFQUFFLEVBQUUsSUFBSTtBQUNSLFFBQUEsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLElBQUk7QUFDVCxRQUFBLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLENBQUMsR0FBRztBQUNSLFFBQUEsRUFBRSxFQUFFLElBQUk7QUFDUixRQUFBLEVBQUUsRUFBRSxHQUFHO1FBQ1AsRUFBRSxFQUFFLENBQUMsSUFBSTtBQUNULFFBQUEsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsSUFBSTtBQUNULFFBQUEsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLEdBQUc7UUFDUixFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLEdBQUc7QUFDUixRQUFBLEdBQUcsRUFBRSxJQUFJO0FBQ1QsUUFBQSxHQUFHLEVBQUUsR0FBRztBQUNSLFFBQUEsSUFBSSxFQUFFLElBQUk7S0FDWCxDQUFDO0lBQ0YsSUFBSSxDQUFDLEtBQUssR0FBRztRQUNYLElBQUksRUFBRSxDQUFDLEtBQUs7UUFDWixFQUFFLEVBQUUsQ0FBQyxHQUFHO1FBQ1IsSUFBSSxFQUFFLENBQUMsSUFBSTtRQUNYLElBQUksRUFBRSxDQUFDLEtBQUs7UUFDWixFQUFFLEVBQUUsQ0FBQyxJQUFJO0FBQ1QsUUFBQSxFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxHQUFHO1FBQ1IsRUFBRSxFQUFFLENBQUMsSUFBSTtBQUNULFFBQUEsRUFBRSxFQUFFLElBQUk7QUFDUixRQUFBLEVBQUUsRUFBRSxHQUFHO1FBQ1AsRUFBRSxFQUFFLENBQUMsSUFBSTtBQUNULFFBQUEsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLElBQUk7QUFDVCxRQUFBLEVBQUUsRUFBRSxJQUFJO0FBQ1IsUUFBQSxFQUFFLEVBQUUsS0FBSztRQUNULEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsR0FBRztBQUNSLFFBQUEsRUFBRSxFQUFFLElBQUk7QUFDUixRQUFBLEVBQUUsRUFBRSxHQUFHO0FBQ1AsUUFBQSxFQUFFLEVBQUUsR0FBRztRQUNQLEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsR0FBRztRQUNSLEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxHQUFHO0FBQ1IsUUFBQSxFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxDQUFDLEdBQUc7QUFDUixRQUFBLEVBQUUsRUFBRSxJQUFJO0FBQ1IsUUFBQSxFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxDQUFDLElBQUk7QUFDVCxRQUFBLEVBQUUsRUFBRSxJQUFJO0FBQ1IsUUFBQSxFQUFFLEVBQUUsSUFBSTtBQUNSLFFBQUEsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsSUFBSTtBQUNULFFBQUEsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxJQUFJO0FBQ1QsUUFBQSxFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxJQUFJO0FBQ1QsUUFBQSxFQUFFLEVBQUUsR0FBRztBQUNQLFFBQUEsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxJQUFJO0FBQ1QsUUFBQSxFQUFFLEVBQUUsSUFBSTtBQUNSLFFBQUEsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsQ0FBQyxJQUFJO0FBQ1QsUUFBQSxFQUFFLEVBQUUsSUFBSTtBQUNSLFFBQUEsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsS0FBSztRQUNWLEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxLQUFLO0FBQ1YsUUFBQSxFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsSUFBSTtBQUNULFFBQUEsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsSUFBSTtBQUNULFFBQUEsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsSUFBSTtBQUNULFFBQUEsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsQ0FBQyxJQUFJO0FBQ1QsUUFBQSxFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxDQUFDLEtBQUs7UUFDVixFQUFFLEVBQUUsQ0FBQyxHQUFHO1FBQ1IsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLElBQUk7QUFDVCxRQUFBLEVBQUUsRUFBRSxHQUFHO0FBQ1AsUUFBQSxFQUFFLEVBQUUsSUFBSTtBQUNSLFFBQUEsRUFBRSxFQUFFLElBQUk7QUFDUixRQUFBLEVBQUUsRUFBRSxHQUFHO0FBQ1AsUUFBQSxFQUFFLEVBQUUsSUFBSTtBQUNSLFFBQUEsRUFBRSxFQUFFLElBQUk7QUFDUixRQUFBLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLENBQUMsS0FBSztBQUNWLFFBQUEsRUFBRSxFQUFFLEdBQUc7UUFDUCxFQUFFLEVBQUUsQ0FBQyxJQUFJO0FBQ1QsUUFBQSxFQUFFLEVBQUUsR0FBRztRQUNQLEVBQUUsRUFBRSxDQUFDLElBQUk7QUFDVCxRQUFBLEVBQUUsRUFBRSxHQUFHO1FBQ1AsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxJQUFJO0FBQ1QsUUFBQSxFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxDQUFDLElBQUk7QUFDVCxRQUFBLEVBQUUsRUFBRSxHQUFHO1FBQ1AsRUFBRSxFQUFFLENBQUMsR0FBRztRQUNSLEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsR0FBRztRQUNSLEVBQUUsRUFBRSxDQUFDLElBQUk7QUFDVCxRQUFBLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLENBQUMsR0FBRztRQUNSLEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsR0FBRztRQUNSLEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsSUFBSSxFQUFFLENBQUMsR0FBRztLQUNYLENBQUM7SUFDRixJQUFJLENBQUMsS0FBSyxHQUFHO1FBQ1gsRUFBRSxFQUFFLENBQUMsSUFBSTtBQUNULFFBQUEsRUFBRSxFQUFFLEdBQUc7QUFDUCxRQUFBLEVBQUUsRUFBRSxJQUFJO1FBQ1IsSUFBSSxFQUFFLENBQUMsSUFBSTtRQUNYLElBQUksRUFBRSxDQUFDLElBQUk7QUFDWCxRQUFBLEVBQUUsRUFBRSxJQUFJO0FBQ1IsUUFBQSxFQUFFLEVBQUUsSUFBSTtBQUNSLFFBQUEsRUFBRSxFQUFFLElBQUk7QUFDUixRQUFBLEVBQUUsRUFBRSxJQUFJO0FBQ1IsUUFBQSxFQUFFLEVBQUUsSUFBSTtBQUNSLFFBQUEsRUFBRSxFQUFFLElBQUk7QUFDUixRQUFBLEVBQUUsRUFBRSxJQUFJO0FBQ1IsUUFBQSxFQUFFLEVBQUUsSUFBSTtBQUNSLFFBQUEsRUFBRSxFQUFFLElBQUk7QUFDUixRQUFBLEVBQUUsRUFBRSxJQUFJO0FBQ1IsUUFBQSxJQUFJLEVBQUUsSUFBSTtBQUNWLFFBQUEsSUFBSSxFQUFFLElBQUk7UUFDVixFQUFFLEVBQUUsQ0FBQyxHQUFHO1FBQ1IsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLEdBQUc7QUFDUixRQUFBLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLENBQUMsSUFBSTtBQUNULFFBQUEsSUFBSSxFQUFFLElBQUk7QUFDVixRQUFBLElBQUksRUFBRSxJQUFJO1FBQ1YsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxHQUFHO1FBQ1IsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLElBQUk7QUFDVCxRQUFBLEVBQUUsRUFBRSxJQUFJO0FBQ1IsUUFBQSxFQUFFLEVBQUUsSUFBSTtBQUNSLFFBQUEsRUFBRSxFQUFFLElBQUk7QUFDUixRQUFBLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLEdBQUc7QUFDUixRQUFBLEVBQUUsRUFBRSxHQUFHO0FBQ1AsUUFBQSxJQUFJLEVBQUUsSUFBSTtBQUNWLFFBQUEsSUFBSSxFQUFFLElBQUk7UUFDVixFQUFFLEVBQUUsQ0FBQyxJQUFJO0FBQ1QsUUFBQSxFQUFFLEVBQUUsSUFBSTtBQUNSLFFBQUEsRUFBRSxFQUFFLElBQUk7QUFDUixRQUFBLEVBQUUsRUFBRSxJQUFJO0FBQ1IsUUFBQSxFQUFFLEVBQUUsSUFBSTtRQUNSLElBQUksRUFBRSxDQUFDLElBQUk7UUFDWCxJQUFJLEVBQUUsQ0FBQyxJQUFJO0FBQ1gsUUFBQSxFQUFFLEVBQUUsSUFBSTtBQUNSLFFBQUEsSUFBSSxFQUFFLElBQUk7QUFDVixRQUFBLElBQUksRUFBRSxJQUFJO0FBQ1YsUUFBQSxFQUFFLEVBQUUsR0FBRztBQUNQLFFBQUEsRUFBRSxFQUFFLEdBQUc7QUFDUCxRQUFBLElBQUksRUFBRSxJQUFJO0FBQ1YsUUFBQSxJQUFJLEVBQUUsSUFBSTtRQUNWLEVBQUUsRUFBRSxDQUFDLEdBQUc7QUFDUixRQUFBLEVBQUUsRUFBRSxHQUFHO1FBQ1AsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLEdBQUc7QUFDUixRQUFBLElBQUksRUFBRSxJQUFJO0FBQ1YsUUFBQSxJQUFJLEVBQUUsSUFBSTtBQUNWLFFBQUEsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsQ0FBQyxJQUFJO0FBQ1QsUUFBQSxFQUFFLEVBQUUsR0FBRztBQUNQLFFBQUEsRUFBRSxFQUFFLElBQUk7QUFDUixRQUFBLEVBQUUsRUFBRSxHQUFHO0FBQ1AsUUFBQSxFQUFFLEVBQUUsR0FBRztBQUNQLFFBQUEsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsQ0FBQyxJQUFJO0FBQ1QsUUFBQSxFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxDQUFDLElBQUk7QUFDVCxRQUFBLEVBQUUsRUFBRSxJQUFJO0FBQ1IsUUFBQSxFQUFFLEVBQUUsR0FBRztRQUNQLEVBQUUsRUFBRSxDQUFDLElBQUk7QUFDVCxRQUFBLEVBQUUsRUFBRSxJQUFJO0FBQ1IsUUFBQSxFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxDQUFDLEdBQUc7QUFDUixRQUFBLEVBQUUsRUFBRSxJQUFJO1FBQ1IsSUFBSSxFQUFFLENBQUMsSUFBSTtRQUNYLElBQUksRUFBRSxDQUFDLElBQUk7QUFDWCxRQUFBLEVBQUUsRUFBRSxJQUFJO0FBQ1IsUUFBQSxFQUFFLEVBQUUsSUFBSTtBQUNSLFFBQUEsRUFBRSxFQUFFLElBQUk7UUFDUixJQUFJLEVBQUUsQ0FBQyxHQUFHO1FBQ1YsSUFBSSxFQUFFLENBQUMsR0FBRztRQUNWLEVBQUUsRUFBRSxDQUFDLElBQUk7QUFDVCxRQUFBLElBQUksRUFBRSxJQUFJO0FBQ1YsUUFBQSxJQUFJLEVBQUUsSUFBSTtBQUNWLFFBQUEsRUFBRSxFQUFFLElBQUk7QUFDUixRQUFBLEVBQUUsRUFBRSxJQUFJO0FBQ1IsUUFBQSxFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxDQUFDLElBQUk7QUFDVCxRQUFBLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLENBQUMsR0FBRztBQUNSLFFBQUEsRUFBRSxFQUFFLElBQUk7QUFDUixRQUFBLEVBQUUsRUFBRSxJQUFJO0FBQ1IsUUFBQSxFQUFFLEVBQUUsSUFBSTtBQUNSLFFBQUEsSUFBSSxFQUFFLEdBQUc7QUFDVCxRQUFBLElBQUksRUFBRSxHQUFHO0FBQ1QsUUFBQSxFQUFFLEVBQUUsSUFBSTtBQUNSLFFBQUEsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsQ0FBQyxJQUFJO0FBQ1QsUUFBQSxFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxDQUFDLEdBQUc7QUFDUixRQUFBLEVBQUUsRUFBRSxHQUFHO0FBQ1AsUUFBQSxFQUFFLEVBQUUsR0FBRztBQUNQLFFBQUEsRUFBRSxFQUFFLEdBQUc7QUFDUCxRQUFBLEVBQUUsRUFBRSxHQUFHO0FBQ1AsUUFBQSxFQUFFLEVBQUUsSUFBSTtBQUNSLFFBQUEsRUFBRSxFQUFFLElBQUk7QUFDUixRQUFBLEVBQUUsRUFBRSxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsR0FBRztRQUNOLEVBQUUsRUFBRSxDQUFDLElBQUk7QUFDVCxRQUFBLElBQUksRUFBRSxHQUFHO0FBQ1QsUUFBQSxJQUFJLEVBQUUsR0FBRztBQUNULFFBQUEsRUFBRSxFQUFFLElBQUk7QUFDUixRQUFBLEVBQUUsRUFBRSxHQUFHO0tBQ1IsQ0FBQztJQUNGLElBQUksQ0FBQyxLQUFLLEdBQUc7QUFDWCxRQUFBLEdBQUcsRUFBRSxJQUFJO0FBQ1QsUUFBQSxHQUFHLEVBQUUsSUFBSTtBQUNULFFBQUEsR0FBRyxFQUFFLEdBQUc7QUFDUixRQUFBLEdBQUcsRUFBRSxHQUFHO1FBQ1IsR0FBRyxFQUFFLENBQUMsR0FBRztRQUNULEdBQUcsRUFBRSxDQUFDLEdBQUc7QUFDVCxRQUFBLEdBQUcsRUFBRSxJQUFJO1FBQ1QsR0FBRyxFQUFFLENBQUMsR0FBRztRQUNULEdBQUcsRUFBRSxDQUFDLElBQUk7QUFDVixRQUFBLEdBQUcsRUFBRSxHQUFHO0FBQ1IsUUFBQSxHQUFHLEVBQUUsR0FBRztRQUNSLEdBQUcsRUFBRSxDQUFDLElBQUk7S0FDWCxDQUFDO0lBQ0YsSUFBSSxDQUFDLEtBQUssR0FBRztBQUNYLFFBQUEsR0FBRyxFQUFFLElBQUk7UUFDVCxHQUFHLEVBQUUsQ0FBQyxJQUFJO1FBQ1YsR0FBRyxFQUFFLENBQUMsSUFBSTtRQUNWLEdBQUcsRUFBRSxDQUFDLElBQUk7QUFDVixRQUFBLEdBQUcsRUFBRSxHQUFHO1FBQ1IsR0FBRyxFQUFFLENBQUMsSUFBSTtLQUNYLENBQUM7SUFDRixJQUFJLENBQUMsS0FBSyxHQUFHO1FBQ1gsR0FBRyxFQUFFLENBQUMsR0FBRztBQUNULFFBQUEsR0FBRyxFQUFFLEdBQUc7UUFDUixHQUFHLEVBQUUsQ0FBQyxHQUFHO1FBQ1QsR0FBRyxFQUFFLENBQUMsSUFBSTtBQUNWLFFBQUEsR0FBRyxFQUFFLEdBQUc7UUFDUixHQUFHLEVBQUUsQ0FBQyxJQUFJO0FBQ1YsUUFBQSxHQUFHLEVBQUUsR0FBRztRQUNSLEdBQUcsRUFBRSxDQUFDLElBQUk7UUFDVixHQUFHLEVBQUUsQ0FBQyxJQUFJO1FBQ1YsR0FBRyxFQUFFLENBQUMsR0FBRztRQUNULEdBQUcsRUFBRSxDQUFDLElBQUk7UUFDVixHQUFHLEVBQUUsQ0FBQyxHQUFHO1FBQ1QsR0FBRyxFQUFFLENBQUMsSUFBSTtBQUNWLFFBQUEsR0FBRyxFQUFFLEdBQUc7UUFDUixHQUFHLEVBQUUsQ0FBQyxJQUFJO1FBQ1YsR0FBRyxFQUFFLENBQUMsSUFBSTtRQUNWLEdBQUcsRUFBRSxDQUFDLElBQUk7UUFDVixHQUFHLEVBQUUsQ0FBQyxHQUFHO0FBQ1QsUUFBQSxHQUFHLEVBQUUsR0FBRztRQUNSLEdBQUcsRUFBRSxDQUFDLEdBQUc7UUFDVCxHQUFHLEVBQUUsQ0FBQyxJQUFJO0FBQ1YsUUFBQSxHQUFHLEVBQUUsR0FBRztRQUNSLEdBQUcsRUFBRSxDQUFDLElBQUk7S0FDWCxDQUFDO0lBQ0YsSUFBSSxDQUFDLEtBQUssR0FBRztRQUNYLEdBQUcsRUFBRSxDQUFDLEdBQUc7QUFDVCxRQUFBLEdBQUcsRUFBRSxJQUFJO0FBQ1QsUUFBQSxHQUFHLEVBQUUsR0FBRztRQUNSLEdBQUcsRUFBRSxDQUFDLEdBQUc7QUFDVCxRQUFBLEdBQUcsRUFBRSxHQUFHO0FBQ1IsUUFBQSxHQUFHLEVBQUUsR0FBRztBQUNSLFFBQUEsR0FBRyxFQUFFLEdBQUc7QUFDUixRQUFBLEdBQUcsRUFBRSxHQUFHO0FBQ1IsUUFBQSxHQUFHLEVBQUUsR0FBRztBQUNSLFFBQUEsR0FBRyxFQUFFLEdBQUc7UUFDUixHQUFHLEVBQUUsQ0FBQyxJQUFJO0FBQ1YsUUFBQSxHQUFHLEVBQUUsR0FBRztBQUNSLFFBQUEsR0FBRyxFQUFFLElBQUk7QUFDVCxRQUFBLEdBQUcsRUFBRSxHQUFHO0FBQ1IsUUFBQSxHQUFHLEVBQUUsRUFBRTtBQUNQLFFBQUEsR0FBRyxFQUFFLElBQUk7QUFDVCxRQUFBLEdBQUcsRUFBRSxJQUFJO0FBQ1QsUUFBQSxHQUFHLEVBQUUsSUFBSTtRQUNULEdBQUcsRUFBRSxDQUFDLEdBQUc7QUFDVCxRQUFBLEdBQUcsRUFBRSxHQUFHO1FBQ1IsR0FBRyxFQUFFLENBQUMsR0FBRztBQUNULFFBQUEsR0FBRyxFQUFFLEdBQUc7QUFDUixRQUFBLEdBQUcsRUFBRSxHQUFHO0tBQ1QsQ0FBQztJQUNGLElBQUksQ0FBQyxLQUFLLEdBQUc7UUFDWCxJQUFJLEVBQUUsQ0FBQyxHQUFHO0FBQ1YsUUFBQSxJQUFJLEVBQUUsR0FBRztRQUNULElBQUksRUFBRSxDQUFDLEdBQUc7QUFDVixRQUFBLElBQUksRUFBRSxFQUFFO0FBQ1IsUUFBQSxJQUFJLEVBQUUsSUFBSTtRQUNWLElBQUksRUFBRSxDQUFDLEdBQUc7QUFDVixRQUFBLElBQUksRUFBRSxHQUFHO1FBQ1QsSUFBSSxFQUFFLENBQUMsR0FBRztBQUNWLFFBQUEsSUFBSSxFQUFFLEdBQUc7QUFDVCxRQUFBLElBQUksRUFBRSxHQUFHO0FBQ1QsUUFBQSxJQUFJLEVBQUUsR0FBRztBQUNULFFBQUEsSUFBSSxFQUFFLEdBQUc7UUFDVCxJQUFJLEVBQUUsQ0FBQyxFQUFFO0tBQ1YsQ0FBQztJQUNGLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNuRSxJQUFJLENBQUMsS0FBSyxHQUFHO0FBQ1gsUUFBQSxJQUFJLEVBQUUsR0FBRztRQUNULElBQUksRUFBRSxDQUFDLElBQUk7QUFDWCxRQUFBLElBQUksRUFBRSxHQUFHO1FBQ1QsSUFBSSxFQUFFLENBQUMsR0FBRztRQUNWLElBQUksRUFBRSxDQUFDLEdBQUc7UUFDVixJQUFJLEVBQUUsQ0FBQyxHQUFHO1FBQ1YsSUFBSSxFQUFFLENBQUMsR0FBRztRQUNWLElBQUksRUFBRSxDQUFDLEdBQUc7QUFDVixRQUFBLElBQUksRUFBRSxHQUFHO0FBQ1QsUUFBQSxJQUFJLEVBQUUsR0FBRztBQUNULFFBQUEsSUFBSSxFQUFFLElBQUk7QUFDVixRQUFBLElBQUksRUFBRSxHQUFHO0FBQ1QsUUFBQSxJQUFJLEVBQUUsR0FBRztBQUNULFFBQUEsSUFBSSxFQUFFLEdBQUc7QUFDVCxRQUFBLElBQUksRUFBRSxJQUFJO0FBQ1YsUUFBQSxJQUFJLEVBQUUsSUFBSTtBQUNWLFFBQUEsSUFBSSxFQUFFLEdBQUc7QUFDVCxRQUFBLElBQUksRUFBRSxHQUFHO0FBQ1QsUUFBQSxJQUFJLEVBQUUsR0FBRztRQUNULElBQUksRUFBRSxDQUFDLEdBQUc7S0FDWCxDQUFDO0lBQ0YsSUFBSSxDQUFDLEtBQUssR0FBRztRQUNYLElBQUksRUFBRSxDQUFDLEdBQUc7UUFDVixJQUFJLEVBQUUsQ0FBQyxJQUFJO1FBQ1gsSUFBSSxFQUFFLENBQUMsR0FBRztRQUNWLElBQUksRUFBRSxDQUFDLEdBQUc7UUFDVixJQUFJLEVBQUUsQ0FBQyxJQUFJO1FBQ1gsSUFBSSxFQUFFLENBQUMsSUFBSTtBQUNYLFFBQUEsSUFBSSxFQUFFLEdBQUc7UUFDVCxJQUFJLEVBQUUsQ0FBQyxHQUFHO0FBQ1YsUUFBQSxJQUFJLEVBQUUsSUFBSTtBQUNWLFFBQUEsSUFBSSxFQUFFLEdBQUc7UUFDVCxJQUFJLEVBQUUsQ0FBQyxJQUFJO0FBQ1gsUUFBQSxJQUFJLEVBQUUsSUFBSTtRQUNWLElBQUksRUFBRSxDQUFDLEdBQUc7QUFDVixRQUFBLElBQUksRUFBRSxHQUFHO1FBQ1QsSUFBSSxFQUFFLENBQUMsSUFBSTtRQUNYLElBQUksRUFBRSxDQUFDLElBQUk7S0FDWixDQUFDO0FBQ0YsSUFBQSxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQztJQUN2QyxJQUFJLENBQUMsS0FBSyxHQUFHO1FBQ1gsR0FBRyxFQUFFLENBQUMsSUFBSTtRQUNWLEdBQUcsRUFBRSxDQUFDLElBQUk7UUFDVixHQUFHLEVBQUUsQ0FBQyxJQUFJO0FBQ1YsUUFBQSxHQUFHLEVBQUUsSUFBSTtRQUNULEdBQUcsRUFBRSxDQUFDLElBQUk7UUFDVixHQUFHLEVBQUUsQ0FBQyxJQUFJO0FBQ1YsUUFBQSxHQUFHLEVBQUUsSUFBSTtRQUNULEdBQUcsRUFBRSxDQUFDLElBQUk7UUFDVixHQUFHLEVBQUUsQ0FBQyxJQUFJO0FBQ1YsUUFBQSxHQUFHLEVBQUUsSUFBSTtRQUNULEdBQUcsRUFBRSxDQUFDLEdBQUc7UUFDVCxHQUFHLEVBQUUsQ0FBQyxJQUFJO1FBQ1YsR0FBRyxFQUFFLENBQUMsSUFBSTtRQUNWLEdBQUcsRUFBRSxDQUFDLElBQUk7UUFDVixHQUFHLEVBQUUsQ0FBQyxJQUFJO1FBQ1YsR0FBRyxFQUFFLENBQUMsSUFBSTtLQUNYLENBQUM7SUFDRixJQUFJLENBQUMsS0FBSyxHQUFHO1FBQ1gsR0FBRyxFQUFFLENBQUMsSUFBSTtBQUNWLFFBQUEsR0FBRyxFQUFFLElBQUk7UUFDVCxHQUFHLEVBQUUsQ0FBQyxJQUFJO1FBQ1YsR0FBRyxFQUFFLENBQUMsSUFBSTtRQUNWLEdBQUcsRUFBRSxDQUFDLElBQUk7UUFDVixHQUFHLEVBQUUsQ0FBQyxJQUFJO1FBQ1YsS0FBSyxFQUFFLENBQUMsR0FBRztRQUNYLEtBQUssRUFBRSxDQUFDLEdBQUc7UUFDWCxHQUFHLEVBQUUsQ0FBQyxHQUFHO1FBQ1QsR0FBRyxFQUFFLENBQUMsSUFBSTtRQUNWLEdBQUcsRUFBRSxDQUFDLElBQUk7S0FDWCxDQUFDO0lBQ0YsSUFBSSxDQUFDLEtBQUssR0FBRztBQUNYLFFBQUEsS0FBSyxFQUFFLElBQUk7QUFDWCxRQUFBLEtBQUssRUFBRSxJQUFJO1FBQ1gsR0FBRyxFQUFFLENBQUMsSUFBSTtBQUNWLFFBQUEsR0FBRyxFQUFFLElBQUk7QUFDVCxRQUFBLEtBQUssRUFBRSxJQUFJO0FBQ1gsUUFBQSxLQUFLLEVBQUUsSUFBSTtBQUNYLFFBQUEsR0FBRyxFQUFFLElBQUk7QUFDVCxRQUFBLEdBQUcsRUFBRSxJQUFJO0FBQ1QsUUFBQSxHQUFHLEVBQUUsSUFBSTtBQUNULFFBQUEsR0FBRyxFQUFFLElBQUk7UUFDVCxHQUFHLEVBQUUsQ0FBQyxJQUFJO0FBQ1YsUUFBQSxHQUFHLEVBQUUsSUFBSTtLQUNWLENBQUM7SUFDRixJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDaEQsSUFBQSxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztBQUNuRSxJQUFBLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDO0lBQ25DLElBQUksQ0FBQyxLQUFLLEdBQUc7UUFDWCxDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO0tBQ1IsQ0FBQztJQUNGLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUM1RCxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDMUQsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ3pCLElBQUEsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO0lBQy9CLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7SUFDeEIsSUFBSSxDQUFDLEtBQUssR0FBRztBQUNYLFFBQUEsRUFBRSxFQUFFLEVBQUU7UUFDTixFQUFFLEVBQUUsQ0FBQyxFQUFFO1FBQ1AsRUFBRSxFQUFFLENBQUMsRUFBRTtBQUNQLFFBQUEsRUFBRSxFQUFFLEdBQUc7UUFDUCxFQUFFLEVBQUUsQ0FBQyxFQUFFO1FBQ1AsRUFBRSxFQUFFLENBQUMsRUFBRTtBQUNQLFFBQUEsRUFBRSxFQUFFLEdBQUc7QUFDUCxRQUFBLEVBQUUsRUFBRSxHQUFHO1FBQ1AsRUFBRSxFQUFFLENBQUMsSUFBSTtLQUNWLENBQUM7QUFDRixJQUFBLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDO0lBQzVDLElBQUksQ0FBQyxLQUFLLEdBQUc7UUFDWCxFQUFFLEVBQUUsQ0FBQyxHQUFHO0FBQ1IsUUFBQSxFQUFFLEVBQUUsRUFBRTtBQUNOLFFBQUEsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsQ0FBQyxJQUFJO0FBQ1QsUUFBQSxFQUFFLEVBQUUsSUFBSTtBQUNSLFFBQUEsRUFBRSxFQUFFLElBQUk7QUFDUixRQUFBLEVBQUUsRUFBRSxLQUFLO1FBQ1QsRUFBRSxFQUFFLENBQUMsR0FBRztRQUNSLEVBQUUsRUFBRSxDQUFDLElBQUk7S0FDVixDQUFDO0lBQ0YsSUFBSSxDQUFDLEtBQUssR0FBRztBQUNYLFFBQUEsR0FBRyxFQUFFLEdBQUc7QUFDUixRQUFBLEdBQUcsRUFBRSxHQUFHO1FBQ1IsR0FBRyxFQUFFLENBQUMsR0FBRztRQUNULENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztBQUNQLFFBQUEsQ0FBQyxFQUFFLEdBQUc7QUFDTixRQUFBLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7QUFDUCxRQUFBLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsR0FBRztBQUNQLFFBQUEsQ0FBQyxFQUFFLEdBQUc7QUFDTixRQUFBLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxHQUFHLEVBQUUsQ0FBQyxHQUFHO1FBQ1QsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO0FBQ1AsUUFBQSxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLEdBQUc7QUFDUCxRQUFBLENBQUMsRUFBRSxHQUFHO0FBQ04sUUFBQSxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO0FBQ1AsUUFBQSxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLEdBQUcsRUFBRSxDQUFDLEdBQUc7UUFDVCxHQUFHLEVBQUUsQ0FBQyxHQUFHO0tBQ1YsQ0FBQztJQUNGLElBQUksQ0FBQyxLQUFLLEdBQUc7UUFDWCxHQUFHLEVBQUUsQ0FBQyxHQUFHO1FBQ1QsR0FBRyxFQUFFLENBQUMsR0FBRztBQUNULFFBQUEsQ0FBQyxFQUFFLEdBQUc7UUFDTixHQUFHLEVBQUUsQ0FBQyxHQUFHO0FBQ1QsUUFBQSxHQUFHLEVBQUUsSUFBSTtRQUNULENBQUMsRUFBRSxDQUFDLEdBQUc7QUFDUCxRQUFBLENBQUMsRUFBRSxHQUFHO0FBQ04sUUFBQSxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLEdBQUc7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsR0FBRztBQUNOLFFBQUEsQ0FBQyxFQUFFLEdBQUc7QUFDTixRQUFBLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztBQUNQLFFBQUEsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsR0FBRztBQUNOLFFBQUEsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsR0FBRztBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztBQUNQLFFBQUEsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7QUFDUCxRQUFBLENBQUMsRUFBRSxHQUFHO0FBQ04sUUFBQSxDQUFDLEVBQUUsR0FBRztBQUNOLFFBQUEsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztBQUNQLFFBQUEsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxHQUFHO0FBQ1AsUUFBQSxDQUFDLEVBQUUsR0FBRztBQUNOLFFBQUEsQ0FBQyxFQUFFLEdBQUc7QUFDTixRQUFBLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxHQUFHO0FBQ04sUUFBQSxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxHQUFHO0FBQ04sUUFBQSxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLEdBQUc7QUFDUCxRQUFBLENBQUMsRUFBRSxHQUFHO0FBQ04sUUFBQSxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLEdBQUcsRUFBRSxDQUFDLEdBQUc7QUFDVCxRQUFBLEdBQUcsRUFBRSxJQUFJO0FBQ1QsUUFBQSxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLEdBQUc7QUFDUCxRQUFBLENBQUMsRUFBRSxHQUFHO0FBQ04sUUFBQSxDQUFDLEVBQUUsR0FBRztLQUNQLENBQUM7SUFDRixJQUFJLENBQUMsS0FBSyxHQUFHO0FBQ1gsUUFBQSxHQUFHLEVBQUUsSUFBSTtRQUNULENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxHQUFHLEVBQUUsQ0FBQyxJQUFJO0FBQ1YsUUFBQSxHQUFHLEVBQUUsSUFBSTtRQUNULENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxHQUFHLEVBQUUsSUFBSTtRQUNULEdBQUcsRUFBRSxDQUFDLElBQUk7UUFDVixDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLEdBQUc7QUFDTixRQUFBLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsR0FBRztBQUNQLFFBQUEsQ0FBQyxFQUFFLEdBQUc7QUFDTixRQUFBLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsR0FBRztBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7QUFDUCxRQUFBLENBQUMsRUFBRSxHQUFHO0FBQ04sUUFBQSxDQUFDLEVBQUUsR0FBRztBQUNOLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO0FBQ1AsUUFBQSxDQUFDLEVBQUUsR0FBRztBQUNOLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLEdBQUc7QUFDTixRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxHQUFHO1FBQ04sR0FBRyxFQUFFLENBQUMsSUFBSTtRQUNWLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxHQUFHO0FBQ04sUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLEdBQUc7QUFDTixRQUFBLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLEdBQUc7QUFDTixRQUFBLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLEdBQUc7QUFDTixRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsR0FBRztBQUNOLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLEdBQUc7QUFDTixRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxHQUFHO0FBQ04sUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxHQUFHO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxHQUFHO0FBQ04sUUFBQSxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7QUFDUCxRQUFBLENBQUMsRUFBRSxHQUFHO0FBQ04sUUFBQSxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxHQUFHO0FBQ1AsUUFBQSxDQUFDLEVBQUUsR0FBRztBQUNOLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLEdBQUc7QUFDTixRQUFBLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsR0FBRztBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsR0FBRztBQUNOLFFBQUEsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsR0FBRztBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtRQUNQLEdBQUcsRUFBRSxDQUFDLEdBQUc7QUFDVCxRQUFBLEdBQUcsRUFBRSxJQUFJO1FBQ1QsR0FBRyxFQUFFLENBQUMsSUFBSTtRQUNWLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxHQUFHO0FBQ04sUUFBQSxFQUFFLEVBQUUsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLEdBQUc7QUFDTixRQUFBLENBQUMsRUFBRSxHQUFHO0FBQ04sUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsR0FBRztLQUNQLENBQUM7SUFDRixJQUFJLENBQUMsS0FBSyxHQUFHO0FBQ1gsUUFBQSxHQUFHLEVBQUUsSUFBSTtBQUNULFFBQUEsR0FBRyxFQUFFLElBQUk7UUFDVCxHQUFHLEVBQUUsQ0FBQyxJQUFJO0FBQ1YsUUFBQSxHQUFHLEVBQUUsSUFBSTtBQUNULFFBQUEsR0FBRyxFQUFFLElBQUk7QUFDVCxRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxHQUFHLEVBQUUsSUFBSTtBQUNULFFBQUEsR0FBRyxFQUFFLElBQUk7UUFDVCxHQUFHLEVBQUUsQ0FBQyxJQUFJO0FBQ1YsUUFBQSxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxHQUFHO0FBQ04sUUFBQSxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxHQUFHO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLEdBQUc7QUFDTixRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxLQUFLO1FBQ1QsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsS0FBSztRQUNSLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsR0FBRyxFQUFFLENBQUMsSUFBSTtRQUNWLENBQUMsRUFBRSxDQUFDLEtBQUs7UUFDVCxDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxHQUFHO0FBQ04sUUFBQSxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxHQUFHO0FBQ04sUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLEdBQUc7QUFDTixRQUFBLENBQUMsRUFBRSxHQUFHO0FBQ04sUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsR0FBRztBQUNOLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxHQUFHO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxHQUFHO0FBQ04sUUFBQSxDQUFDLEVBQUUsR0FBRztBQUNOLFFBQUEsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsR0FBRztBQUNOLFFBQUEsQ0FBQyxFQUFFLEdBQUc7QUFDTixRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsR0FBRztBQUNOLFFBQUEsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxHQUFHO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7QUFDUCxRQUFBLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxHQUFHO0FBQ04sUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLEdBQUc7QUFDTixRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsR0FBRztBQUNQLFFBQUEsQ0FBQyxFQUFFLEdBQUc7QUFDTixRQUFBLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO0FBQ1AsUUFBQSxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLEdBQUcsRUFBRSxJQUFJO0FBQ1QsUUFBQSxHQUFHLEVBQUUsSUFBSTtRQUNULEdBQUcsRUFBRSxDQUFDLElBQUk7UUFDVixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsS0FBSztBQUNULFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtLQUNULENBQUM7SUFDRixJQUFJLENBQUMsS0FBSyxHQUFHO0FBQ1gsUUFBQSxHQUFHLEVBQUUsR0FBRztRQUNSLEdBQUcsRUFBRSxDQUFDLEdBQUc7UUFDVCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsRUFBRSxFQUFFLENBQUMsS0FBSztRQUNWLEdBQUcsRUFBRSxDQUFDLElBQUk7QUFDVixRQUFBLEdBQUcsRUFBRSxHQUFHO1FBQ1IsR0FBRyxFQUFFLENBQUMsR0FBRztBQUNULFFBQUEsR0FBRyxFQUFFLEdBQUc7QUFDUixRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLEdBQUc7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsR0FBRztBQUNOLFFBQUEsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxHQUFHO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsRUFBRTtBQUNMLFFBQUEsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxFQUFFO1FBQ04sQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxHQUFHO0FBQ04sUUFBQSxDQUFDLEVBQUUsR0FBRztBQUNOLFFBQUEsQ0FBQyxFQUFFLElBQUk7QUFDUCxRQUFBLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsR0FBRztBQUNQLFFBQUEsQ0FBQyxFQUFFLEdBQUc7QUFDTixRQUFBLENBQUMsRUFBRSxHQUFHO0FBQ04sUUFBQSxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxHQUFHO0FBQ04sUUFBQSxDQUFDLEVBQUUsR0FBRztBQUNOLFFBQUEsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztBQUNQLFFBQUEsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsR0FBRztBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO0FBQ1AsUUFBQSxDQUFDLEVBQUUsR0FBRztBQUNOLFFBQUEsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsR0FBRztBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLEdBQUc7QUFDTixRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLEdBQUc7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsR0FBRztBQUNOLFFBQUEsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ1IsUUFBQSxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLEdBQUc7QUFDUCxRQUFBLENBQUMsRUFBRSxHQUFHO0FBQ04sUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsR0FBRyxFQUFFLENBQUMsR0FBRztRQUNULEVBQUUsRUFBRSxDQUFDLEtBQUs7QUFDVixRQUFBLEdBQUcsRUFBRSxHQUFHO0FBQ1IsUUFBQSxDQUFDLEVBQUUsR0FBRztBQUNOLFFBQUEsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxHQUFHO0tBQ1IsQ0FBQztJQUNGLElBQUksQ0FBQyxLQUFLLEdBQUc7QUFDWCxRQUFBLEdBQUcsRUFBRSxHQUFHO0FBQ1IsUUFBQSxHQUFHLEVBQUUsR0FBRztRQUNSLENBQUMsRUFBRSxDQUFDLEdBQUc7QUFDUCxRQUFBLEVBQUUsRUFBRSxHQUFHO0FBQ1AsUUFBQSxHQUFHLEVBQUUsR0FBRztBQUNSLFFBQUEsR0FBRyxFQUFFLEdBQUc7UUFDUixDQUFDLEVBQUUsQ0FBQyxHQUFHO0FBQ1AsUUFBQSxDQUFDLEVBQUUsR0FBRztBQUNOLFFBQUEsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxFQUFFO1FBQ04sQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7QUFDUCxRQUFBLENBQUMsRUFBRSxJQUFJO0FBQ1AsUUFBQSxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLEdBQUc7QUFDUCxRQUFBLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNSLFFBQUEsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7QUFDUCxRQUFBLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsR0FBRztBQUNQLFFBQUEsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7QUFDUCxRQUFBLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsR0FBRztBQUNQLFFBQUEsQ0FBQyxFQUFFLEdBQUc7QUFDTixRQUFBLENBQUMsRUFBRSxHQUFHO0FBQ04sUUFBQSxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7QUFDUixRQUFBLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsR0FBRztBQUNQLFFBQUEsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxHQUFHO0FBQ1AsUUFBQSxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLEdBQUc7QUFDUCxRQUFBLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsR0FBRztBQUNQLFFBQUEsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxHQUFHO0FBQ1AsUUFBQSxDQUFDLEVBQUUsSUFBSTtBQUNQLFFBQUEsQ0FBQyxFQUFFLEdBQUc7QUFDTixRQUFBLENBQUMsRUFBRSxJQUFJO1FBQ1AsR0FBRyxFQUFFLENBQUMsR0FBRztBQUNULFFBQUEsRUFBRSxFQUFFLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztLQUNSLENBQUM7QUFFRixJQUFBLE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQUVELGFBQWEsQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLFVBQVUsR0FBRyxFQUFBO0FBQzVDLElBQUEsS0FBSyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO0FBQzVCLFFBQUEsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUNuQyxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDN0IsU0FBQTtBQUNGLEtBQUE7QUFDRCxJQUFBLE9BQU8sR0FBRyxDQUFDO0FBQ2IsQ0FBQyxDQUFDO0FBRUYsYUFBYSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEdBQUcsVUFBVSxDQUFDLEVBQUE7QUFDdkMsSUFBQSxJQUFJLENBQUMsRUFBRTtBQUNMLFFBQUEsT0FBTyxDQUFDLENBQUM7QUFDVixLQUFBO0FBQ0QsSUFBQSxPQUFPLENBQUMsQ0FBQztBQUNYLENBQUMsQ0FBQztBQUVGLGFBQWEsQ0FBQyxTQUFTLENBQUMsT0FBTyxHQUFHLFVBQVUsS0FBSyxFQUFBO0lBQy9DLElBQUksS0FBSyxJQUFJLElBQUksSUFBSSxLQUFLLElBQUksU0FBUyxJQUFJLEtBQUssSUFBSSxFQUFFLEVBQUU7QUFDdEQsUUFBQSxPQUFPLEVBQUUsQ0FBQztBQUNYLEtBQUE7SUFDRCxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7SUFDaEIsSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzdCLElBQUksS0FBSyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUM1QixJQUFJLENBQUMsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3hCLElBQUEsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFO1FBQzdCLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDZixRQUFBLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQy9CLEtBQUE7QUFDRCxJQUFBLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDZixJQUFBLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDZixJQUFBLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDZixJQUFBLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDaEIsSUFBQSxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2hCLElBQUEsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNoQixJQUFBLElBQUksSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNsQixJQUFJLEVBQUUsR0FBRyxHQUFHLENBQUM7SUFDYixJQUFJLEVBQUUsR0FBRyxHQUFHLENBQUM7SUFDYixJQUFJLEVBQUUsR0FBRyxHQUFHLENBQUM7QUFDYixJQUFBLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRTtBQUN2QyxRQUFBLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDeEIsSUFBSSxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNwQixJQUFJLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3BCLElBQUksRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDcEIsUUFBQSxJQUFJLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDaEIsSUFBSSxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNwQixJQUFJLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3BCLElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDdEIsSUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN0QixJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ3RCLFFBQUEsSUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xCLElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDdEIsSUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUN0QixRQUFBLEtBQUssSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNsQyxRQUFBLEtBQUssSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNsQyxRQUFBLEtBQUssSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNsQyxRQUFBLEtBQUssSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDdkMsUUFBQSxLQUFLLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3ZDLFFBQUEsS0FBSyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2xDLFFBQUEsS0FBSyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2xDLFFBQUEsS0FBSyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2xDLFFBQUEsS0FBSyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2xDLFFBQUEsS0FBSyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2xDLFFBQUEsS0FBSyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2xDLFFBQUEsS0FBSyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN2QyxRQUFBLEtBQUssSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDdkMsUUFBQSxLQUFLLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3ZDLFFBQUEsS0FBSyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDNUMsUUFBQSxLQUFLLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUM1QyxRQUFBLEtBQUssSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzVDLFFBQUEsS0FBSyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDNUMsUUFBQSxLQUFLLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDbEMsUUFBQSxLQUFLLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDbEMsUUFBQSxLQUFLLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDbEMsUUFBQSxLQUFLLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDbEMsUUFBQSxLQUFLLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDbEMsUUFBQSxLQUFLLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDbEMsUUFBQSxLQUFLLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3ZDLFFBQUEsS0FBSyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN2QyxRQUFBLEtBQUssSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDdkMsUUFBQSxLQUFLLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUM1QyxRQUFBLEtBQUssSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzVDLFFBQUEsS0FBSyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDNUMsUUFBQSxLQUFLLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQzs7QUFFNUMsUUFBQSxLQUFLLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3ZDLFFBQUEsS0FBSyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN2QyxRQUFBLEtBQUssSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDdkMsUUFBQSxLQUFLLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUM1QyxRQUFBLEtBQUssSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzVDLFFBQUEsS0FBSyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDNUMsUUFBQSxLQUFLLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUM1QyxRQUFBLEtBQUssSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNqRCxRQUFBLEtBQUssSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNqRCxRQUFBLEtBQUssSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNqRCxRQUFBLEtBQUssSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNqRCxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUM7UUFDWixJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUU7QUFDYixZQUFBLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbEIsSUFBSSxHQUFHLEVBQUUsQ0FBQztZQUNWLENBQUMsR0FBRyxHQUFHLENBQUM7QUFDVCxTQUFBO1FBQ0QsRUFBRSxHQUFHLEVBQUUsQ0FBQztRQUNSLEVBQUUsR0FBRyxFQUFFLENBQUM7UUFDUixFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ1AsUUFBQSxJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2hCLEtBQUE7QUFDRCxJQUFBLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFFbEIsSUFBQSxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDOztBQzc5Q0Q7QUFDQSxNQUFNLFNBQVMsR0FBRyxJQUFJLGFBQWEsRUFBRSxDQUFDO0FBRXRDLFNBQVMsb0JBQW9CLENBQUMsT0FBZSxFQUFFLFdBQW1CLEVBQUE7QUFDaEUsSUFBQSxPQUFPLE9BQU87U0FDWCxLQUFLLENBQUMsV0FBVyxDQUFDO1NBQ2xCLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQ3ZCLFNBQUEsT0FBTyxDQUFTLENBQUMsQ0FBQyxLQUFLLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNsRCxDQUFDO0FBRUQ7O0FBRUc7TUFDVSxpQkFBaUIsQ0FBQTtJQUM1QixRQUFRLENBQUMsT0FBZSxFQUFFLEdBQWEsRUFBQTtBQUNyQyxRQUFBLE9BQU8sb0JBQW9CLENBQUMsT0FBTyxFQUFFLEdBQUcsR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUM7S0FDMUU7QUFFRCxJQUFBLGlCQUFpQixDQUFDLE9BQWUsRUFBQTtRQUMvQixNQUFNLE1BQU0sR0FBYSxTQUFTO2FBQy9CLE9BQU8sQ0FBQyxPQUFPLENBQUM7O2FBRWhCLE9BQU8sQ0FBQyxDQUFDLENBQVMsS0FDakIsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FDOUQsQ0FBQztRQUVKLE1BQU0sR0FBRyxHQUFHLEVBQUUsQ0FBQztBQUNmLFFBQUEsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDdEMsSUFDRSxDQUFDLEtBQUssQ0FBQztBQUNQLGdCQUFBLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQztBQUN0QixnQkFBQSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDLEVBQ2hEO2dCQUNBLEdBQUcsQ0FBQyxJQUFJLENBQUM7b0JBQ1AsSUFBSSxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztBQUM5QixvQkFBQSxNQUFNLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU07QUFDM0MsaUJBQUEsQ0FBQyxDQUFDO0FBQ0osYUFBQTtBQUNGLFNBQUE7QUFFRCxRQUFBLE9BQU8sR0FBRyxDQUFDO0tBQ1o7SUFFRCxjQUFjLEdBQUE7QUFDWixRQUFBLE9BQU8saUJBQWlCLENBQUM7S0FDMUI7QUFFRCxJQUFBLFlBQVksQ0FBQyxHQUFXLEVBQUE7UUFDdEIsT0FBTyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUM7S0FDakQ7QUFDRjs7QUNsREQsTUFBTSxlQUFlLEdBQUcsa0JBQWtCLENBQUM7QUFDckMsTUFBTyxvQkFBcUIsU0FBUSxnQkFBZ0IsQ0FBQTtJQUN4RCxRQUFRLENBQUMsT0FBZSxFQUFFLEdBQWEsRUFBQTtBQUNyQyxRQUFBLE1BQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FDN0QsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQzlCLENBQUM7QUFDRixRQUFBLE9BQU8sR0FBRztBQUNSLGNBQUUsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDO0FBQzlCLGNBQUUsU0FBUztpQkFDTixHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQztBQUNsQixpQkFBQSxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDdkQ7QUFFRCxJQUFBLGlCQUFpQixDQUFDLE9BQWUsRUFBQTtBQUMvQixRQUFBLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNoRCxhQUFBLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDO2FBQ25ELEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDeEIsT0FBTztZQUNMLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsTUFBTTtBQUNyQixnQkFBQSxJQUFJLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDdEIsZ0JBQUEsTUFBTSxFQUFFLENBQUM7QUFDVixhQUFBLENBQUMsQ0FBQztTQUNKLENBQUM7S0FDSDtJQUVPLENBQUMsU0FBUyxDQUNoQixPQUFlLEVBQUE7UUFFZixJQUFJLFVBQVUsR0FBRyxDQUFDLENBQUM7UUFDbkIsSUFBSSxZQUFZLEdBQWlCLE1BQU0sQ0FBQztBQUV4QyxRQUFBLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ3ZDLFlBQUEsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQyxFQUFFO0FBQzVDLGdCQUFBLE1BQU0sRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxDQUFDO2dCQUNqRSxZQUFZLEdBQUcsTUFBTSxDQUFDO2dCQUN0QixVQUFVLEdBQUcsQ0FBQyxDQUFDO2dCQUNmLFNBQVM7QUFDVixhQUFBO1lBRUQsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxFQUFFO0FBQ3JDLGdCQUFBLElBQUksWUFBWSxLQUFLLFNBQVMsSUFBSSxZQUFZLEtBQUssTUFBTSxFQUFFO29CQUN6RCxZQUFZLEdBQUcsU0FBUyxDQUFDO29CQUN6QixTQUFTO0FBQ1YsaUJBQUE7QUFFRCxnQkFBQSxNQUFNLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsQ0FBQztnQkFDakUsWUFBWSxHQUFHLFNBQVMsQ0FBQztnQkFDekIsVUFBVSxHQUFHLENBQUMsQ0FBQztnQkFDZixTQUFTO0FBQ1YsYUFBQTtBQUVELFlBQUEsSUFBSSxZQUFZLEtBQUssUUFBUSxJQUFJLFlBQVksS0FBSyxNQUFNLEVBQUU7Z0JBQ3hELFlBQVksR0FBRyxRQUFRLENBQUM7Z0JBQ3hCLFNBQVM7QUFDVixhQUFBO0FBRUQsWUFBQSxNQUFNLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsQ0FBQztZQUNqRSxZQUFZLEdBQUcsUUFBUSxDQUFDO1lBQ3hCLFVBQVUsR0FBRyxDQUFDLENBQUM7QUFDaEIsU0FBQTtRQUVELE1BQU07WUFDSixJQUFJLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQztBQUMvQyxZQUFBLE1BQU0sRUFBRSxVQUFVO1NBQ25CLENBQUM7S0FDSDtBQUNGOztBQ3hESyxTQUFVLGVBQWUsQ0FBQyxRQUEwQixFQUFBO0lBQ3hELFFBQVEsUUFBUSxDQUFDLElBQUk7QUFDbkIsUUFBQSxLQUFLLFNBQVM7WUFDWixPQUFPLElBQUksZ0JBQWdCLEVBQUUsQ0FBQztBQUNoQyxRQUFBLEtBQUssY0FBYztZQUNqQixPQUFPLElBQUksb0JBQW9CLEVBQUUsQ0FBQztBQUNwQyxRQUFBLEtBQUssUUFBUTtZQUNYLE9BQU8sSUFBSSxlQUFlLEVBQUUsQ0FBQztBQUMvQixRQUFBLEtBQUssVUFBVTtZQUNiLE9BQU8sSUFBSSxpQkFBaUIsRUFBRSxDQUFDO0FBQ2pDLFFBQUE7QUFDRSxZQUFBLE1BQU0sSUFBSSxLQUFLLENBQUMsNkJBQTZCLFFBQVEsQ0FBQSxDQUFFLENBQUMsQ0FBQztBQUM1RCxLQUFBO0FBQ0g7O01DeEJhLGdCQUFnQixDQUFBO0lBUTNCLFdBQTZCLENBQUEsSUFBVSxFQUFXLGdCQUF3QixFQUFBO1FBQTdDLElBQUksQ0FBQSxJQUFBLEdBQUosSUFBSSxDQUFNO1FBQVcsSUFBZ0IsQ0FBQSxnQkFBQSxHQUFoQixnQkFBZ0IsQ0FBUTtBQUN4RSxRQUFBLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDckM7SUFFRCxPQUFPLFFBQVEsQ0FBQyxJQUFZLEVBQUE7QUFDMUIsUUFBQSxPQUFPLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksS0FBSyxJQUFJLENBQUUsQ0FBQztLQUMvRDtBQUVELElBQUEsT0FBTyxNQUFNLEdBQUE7UUFDWCxPQUFPLGdCQUFnQixDQUFDLE9BQU8sQ0FBQztLQUNqQzs7QUFqQnVCLGdCQUFPLENBQUEsT0FBQSxHQUF1QixFQUFFLENBQUM7QUFFekMsZ0JBQU8sQ0FBQSxPQUFBLEdBQUcsSUFBSSxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDN0MsZ0JBQVksQ0FBQSxZQUFBLEdBQUcsSUFBSSxnQkFBZ0IsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDdkQsZ0JBQVEsQ0FBQSxRQUFBLEdBQUcsSUFBSSxnQkFBZ0IsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDL0MsZ0JBQU0sQ0FBQSxNQUFBLEdBQUcsSUFBSSxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDOztNQ2UvQyxTQUFTLENBQUE7QUFHcEIsSUFBQSxXQUFBLENBQVksR0FBUSxFQUFBO0FBQ2xCLFFBQUEsSUFBSSxDQUFDLFNBQVMsR0FBRyxHQUFVLENBQUM7S0FDN0I7SUFFRCxxQkFBcUIsQ0FBQyxHQUFtQixFQUFFLEtBQXFCLEVBQUE7QUFDOUQsUUFBQSxPQUFPLEdBQUcsQ0FBQyxJQUFJLEtBQUssS0FBSyxDQUFDLElBQUksSUFBSSxHQUFHLENBQUMsRUFBRSxLQUFLLEtBQUssQ0FBQyxFQUFFLENBQUM7S0FDdkQ7QUFFRCxJQUFBLFVBQVUsQ0FBQyxJQUFXLEVBQUE7O1FBQ3BCLFFBQ0UsTUFBQUEsZ0NBQXVCLENBQ3JCLE1BQUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxNQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsS0FBQSxDQUFBLEdBQUEsS0FBQSxDQUFBLEdBQUEsRUFBQSxDQUFFLFdBQVcsQ0FDN0QsTUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLEtBQUEsQ0FBQSxHQUFBLEVBQUEsR0FBSSxFQUFFLEVBQ1A7S0FDSDtBQUVELElBQUEsY0FBYyxDQUFDLElBQVcsRUFBQTs7QUFDeEIsUUFBQSxNQUFNLFdBQVcsR0FDZixDQUFBLEVBQUEsR0FBQSxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLE1BQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxLQUFBLENBQUEsR0FBQSxLQUFBLENBQUEsR0FBQSxFQUFBLENBQUUsV0FBVyxDQUFDO1FBQy9ELElBQUksQ0FBQyxXQUFXLEVBQUU7QUFDaEIsWUFBQSxPQUFPLFNBQVMsQ0FBQztBQUNsQixTQUFBOztRQUdELE1BQU0sSUFBSSxHQUNSLENBQUEsRUFBQSxHQUFBLENBQUEsRUFBQSxHQUFBQyw2QkFBb0IsQ0FBQyxXQUFXLENBQUMsTUFBRSxJQUFBLElBQUEsRUFBQSxLQUFBLEtBQUEsQ0FBQSxHQUFBLEtBQUEsQ0FBQSxHQUFBLEVBQUEsQ0FBQSxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFJLElBQUEsSUFBQSxFQUFBLEtBQUEsS0FBQSxDQUFBLEdBQUEsRUFBQSxHQUFBLEVBQUUsQ0FBQztRQUNsRSxNQUFNLE9BQU8sR0FBRyxDQUFBLEVBQUEsR0FBQUQsZ0NBQXVCLENBQUMsV0FBVyxDQUFDLE1BQUksSUFBQSxJQUFBLEVBQUEsS0FBQSxLQUFBLENBQUEsR0FBQSxFQUFBLEdBQUEsRUFBRSxDQUFDO1FBQ3JELE1BQWUsSUFBSSxHQUFBLE1BQUEsQ0FBSyxXQUFXLEVBQW5DLENBQXFCLFVBQUEsQ0FBQSxFQUFlO1FBQzFDLE9BQ0ssTUFBQSxDQUFBLE1BQUEsQ0FBQSxNQUFBLENBQUEsTUFBQSxDQUFBLEVBQUEsRUFBQSxNQUFNLENBQUMsV0FBVyxDQUNuQixNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxLQUFLO1lBQ3BDLENBQUM7QUFDRCxZQUFBRSxvQ0FBMkIsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO0FBQzVDLFNBQUEsQ0FBQyxDQUNILENBQUEsRUFBQSxFQUNELElBQUksRUFDSixHQUFHLEVBQUUsSUFBSSxFQUNULE9BQU8sRUFDUCxLQUFLLEVBQUUsT0FBTyxFQUNkLENBQUEsQ0FBQTtLQUNIO0lBRUQsMkJBQTJCLEdBQUE7UUFDekIsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLG1CQUFtQixDQUFDQyxxQkFBWSxDQUFDLEVBQUU7QUFDL0QsWUFBQSxPQUFPLElBQUksQ0FBQztBQUNiLFNBQUE7UUFFRCxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLFVBQVcsQ0FBQyxJQUFvQixDQUFDO0tBQ2xFO0lBRUQsYUFBYSxHQUFBO1FBQ1gsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxhQUFhLEVBQUUsQ0FBQztLQUNqRDtBQUVELElBQUEsWUFBWSxDQUFDLElBQVcsRUFBQTs7QUFDdEIsUUFBQSxPQUFPLENBQUEsQ0FBQSxFQUFBLEdBQUEsSUFBSSxDQUFDLGFBQWEsRUFBRSxNQUFFLElBQUEsSUFBQSxFQUFBLEtBQUEsS0FBQSxDQUFBLEdBQUEsS0FBQSxDQUFBLEdBQUEsRUFBQSxDQUFBLElBQUksTUFBSyxJQUFJLENBQUMsSUFBSSxDQUFDO0tBQ2pEO0lBRUQsZUFBZSxHQUFBOztBQUNiLFFBQUEsTUFBTSxLQUFLLEdBQUcsQ0FBQSxFQUFBLEdBQUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLEVBQUUsTUFBRyxJQUFBLElBQUEsRUFBQSxLQUFBLEtBQUEsQ0FBQSxHQUFBLEtBQUEsQ0FBQSxHQUFBLEVBQUEsQ0FBQSxDQUFDLENBQUMsQ0FBQztRQUMvRCxJQUFJLENBQUMsS0FBSyxFQUFFO0FBQ1YsWUFBQSxPQUFPLElBQUksQ0FBQztBQUNiLFNBQUE7QUFFRCxRQUFBLE9BQU8sSUFBSSxDQUFDLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQzFDO0lBRUQsaUJBQWlCLEdBQUE7O0FBQ2YsUUFBQSxPQUFPLENBQUEsRUFBQSxHQUFBLENBQUEsRUFBQSxHQUFBLElBQUksQ0FBQyxhQUFhLEVBQUUsTUFBRSxJQUFBLElBQUEsRUFBQSxLQUFBLEtBQUEsQ0FBQSxHQUFBLEtBQUEsQ0FBQSxHQUFBLEVBQUEsQ0FBQSxNQUFNLENBQUMsSUFBSSxNQUFJLElBQUEsSUFBQSxFQUFBLEtBQUEsS0FBQSxDQUFBLEdBQUEsRUFBQSxHQUFBLElBQUksQ0FBQztLQUNsRDtJQUVELGdCQUFnQixHQUFBOztRQUNkLE9BQU8sQ0FBQSxFQUFBLEdBQUEsQ0FBQSxFQUFBLEdBQUEsSUFBSSxDQUFDLDJCQUEyQixFQUFFLE1BQUUsSUFBQSxJQUFBLEVBQUEsS0FBQSxLQUFBLENBQUEsR0FBQSxLQUFBLENBQUEsR0FBQSxFQUFBLENBQUEsTUFBTSxNQUFJLElBQUEsSUFBQSxFQUFBLEtBQUEsS0FBQSxDQUFBLEdBQUEsRUFBQSxHQUFBLElBQUksQ0FBQztLQUMzRDtJQUVELFlBQVksR0FBQTs7UUFDVixPQUFPLENBQUEsRUFBQSxHQUFBLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxNQUFFLElBQUEsSUFBQSxFQUFBLEtBQUEsS0FBQSxDQUFBLEdBQUEsS0FBQSxDQUFBLEdBQUEsRUFBQSxDQUFBLFlBQVksRUFBRSxDQUFDO0tBQ2hEO0FBRUQsSUFBQSxnQkFBZ0IsQ0FBQyxNQUFjLEVBQUE7UUFDN0IsT0FBTyxNQUFNLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDO0tBQy9DO0FBRUQsSUFBQSxjQUFjLENBQUMsTUFBYyxFQUFBO1FBQzNCLE9BQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDaEQ7QUFFRCxJQUFBLHlCQUF5QixDQUFDLE1BQWMsRUFBQTtBQUN0QyxRQUFBLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztLQUNwRTtJQUVELGtCQUFrQixHQUFBO1FBQ2hCLE9BQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxlQUFlLENBQUMsQ0FBQyxPQUFPLENBQ3pFLENBQUMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLEtBQUssTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLE1BQU0sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUNsRSxDQUFDO0tBQ0g7QUFFRCxJQUFBLHFCQUFxQixDQUFDLElBQVksRUFBQTtBQUNoQyxRQUFBLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFO0FBQ3pCLFlBQUEsT0FBTyxJQUFJLENBQUM7QUFDYixTQUFBO0FBRUQsUUFBQSxNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN0RSxJQUFJLENBQUMsWUFBWSxFQUFFO0FBQ2pCLFlBQUEsT0FBTyxJQUFJLENBQUM7QUFDYixTQUFBO0FBRUQsUUFBQSxPQUFPLFlBQXFCLENBQUM7S0FDOUI7QUFFRCxJQUFBLGdCQUFnQixDQUFDLElBQVcsRUFBRSxPQUFnQixFQUFFLFNBQWlCLENBQUMsRUFBQTs7QUFDaEUsUUFBQSxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFdkQsSUFBSTtBQUNELGFBQUEsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFBLEVBQUEsR0FBQSxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxVQUFVLE1BQUUsSUFBQSxJQUFBLEVBQUEsS0FBQSxLQUFBLENBQUEsR0FBQSxLQUFBLENBQUEsR0FBQSxFQUFBLENBQUEsWUFBWSxFQUFFLENBQUM7YUFDbkUsSUFBSSxDQUFDLE1BQUs7QUFDVCxZQUFBLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3pELFlBQUEsTUFBTSxVQUFVLEdBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsbUJBQW1CLENBQUNBLHFCQUFZLENBQUMsQ0FBQztBQUM3RCxZQUFBLElBQUksVUFBVSxFQUFFO0FBQ2QsZ0JBQUEsTUFBTSxNQUFNLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQztnQkFDakMsTUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN2QyxnQkFBQSxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3RCLGdCQUFBLE1BQU0sQ0FBQyxjQUFjLENBQUMsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNyRCxhQUFBO0FBQ0gsU0FBQyxDQUFDLENBQUM7S0FDTjtJQUVELHFCQUFxQixHQUFBO0FBQ25CLFFBQUEsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7UUFDdkMsSUFBSSxDQUFDLE1BQU0sRUFBRTtBQUNYLFlBQUEsT0FBTyxJQUFJLENBQUM7QUFDYixTQUFBO0FBRUQsUUFBQSxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxFQUFFO0FBQ3pCLFlBQUEsT0FBTyxJQUFJLENBQUM7QUFDYixTQUFBO1FBRUQsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLEtBQUssRUFBRTtBQUMvQixZQUFBLE9BQU8sSUFBSSxDQUFDO0FBQ2IsU0FBQTtBQUNELFFBQUEsTUFBTSxXQUFXLEdBQUcsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFeEQsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3BELElBQUksV0FBVyxLQUFLLENBQUMsQ0FBQyxJQUFJLGFBQWEsSUFBSSxXQUFXLEVBQUU7QUFDdEQsWUFBQSxPQUFPLElBQUksQ0FBQztBQUNiLFNBQUE7QUFFRCxRQUFBLE1BQU0sWUFBWSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBQ3BFLFFBQUEsSUFBSSxZQUFZLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtBQUM3QixZQUFBLE9BQU8sSUFBSSxDQUFDO0FBQ2IsU0FBQTtRQUVELE1BQU0sa0JBQWtCLEdBQUcsWUFBWTthQUNwQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQU0sR0FBRyxhQUFhLENBQUM7QUFDdkMsYUFBQSxJQUFJLEVBQUUsQ0FBQztRQUNWLElBQUksQ0FBQyxrQkFBa0IsRUFBRTtBQUN2QixZQUFBLE9BQU8sSUFBSSxDQUFDO0FBQ2IsU0FBQTtBQUVELFFBQUEsT0FBTyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDNUM7QUFFRDs7QUFFRztJQUNILE9BQU8sR0FBQTs7UUFDTCxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsbUJBQW1CLENBQUNBLHFCQUFZLENBQUMsRUFBRTtBQUMvRCxZQUFBLE9BQU8sS0FBSyxDQUFDO0FBQ2QsU0FBQTtRQUVELE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLFVBQVc7QUFDdEQsYUFBQSxJQUFvQixDQUFDO0FBQ3hCLFFBQUEsTUFBTSxNQUFNLEdBQVMsWUFBWSxDQUFDLE1BQWMsQ0FBQyxFQUFFLENBQUM7O0FBR3BELFFBQUEsSUFBSSxDQUFBLENBQUEsRUFBQSxHQUFBLE1BQU0sS0FBQSxJQUFBLElBQU4sTUFBTSxLQUFBLEtBQUEsQ0FBQSxHQUFBLEtBQUEsQ0FBQSxHQUFOLE1BQU0sQ0FBRSxVQUFVLE1BQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxLQUFBLENBQUEsR0FBQSxLQUFBLENBQUEsR0FBQSxFQUFBLENBQUUsU0FBUyxJQUFHLENBQUMsRUFBRTtBQUNyQyxZQUFBLE9BQU8sSUFBSSxDQUFDO0FBQ2IsU0FBQTs7QUFHRCxRQUFBLE9BQU8sQ0FBQyxFQUFDLENBQUEsRUFBQSxHQUFBLENBQUEsRUFBQSxHQUFBLE1BQU0sS0FBTixJQUFBLElBQUEsTUFBTSxLQUFOLEtBQUEsQ0FBQSxHQUFBLEtBQUEsQ0FBQSxHQUFBLE1BQU0sQ0FBRSxPQUFPLE1BQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxLQUFBLENBQUEsR0FBQSxLQUFBLENBQUEsR0FBQSxFQUFBLENBQUUsS0FBSyxNQUFFLElBQUEsSUFBQSxFQUFBLEtBQUEsS0FBQSxDQUFBLEdBQUEsS0FBQSxDQUFBLEdBQUEsRUFBQSxDQUFBLFNBQVMsQ0FBQSxDQUFDO0tBQzVDO0FBRUssSUFBQSxRQUFRLENBQUMsR0FBVyxFQUFBOztBQUN4QixZQUFBLE1BQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQ0Msc0JBQWEsQ0FBQyxRQUFRLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztTQUN6RSxDQUFBLENBQUE7QUFBQSxLQUFBO0FBQ0Y7O0FDNU1NLE1BQU0sT0FBTyxHQUFHLENBQ3JCLE1BQVcsRUFDWCxLQUF1QixLQUV2QixNQUFNLENBQUMsTUFBTSxDQUNYLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQ2hDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUM1QyxFQUNELEVBQTRCLENBQzdCLENBQUM7QUFFRSxTQUFVLElBQUksQ0FBSSxNQUFXLEVBQUE7SUFDakMsT0FBTyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUM5QixDQUFDO0FBRWUsU0FBQSxNQUFNLENBQUksTUFBVyxFQUFFLEVBQTZCLEVBQUE7QUFDbEUsSUFBQSxNQUFNLENBQUMsR0FBRyxJQUFJLEdBQUcsRUFBc0IsQ0FBQztBQUN4QyxJQUFBLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUk7QUFDbkIsUUFBQSxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDaEIsUUFBQSxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRTtBQUNiLFlBQUEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDYixTQUFBO0FBQ0gsS0FBQyxDQUFDLENBQUM7SUFDSCxPQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7QUFDaEMsQ0FBQztBQUVlLFNBQUEsUUFBUSxDQUFJLEdBQVEsRUFBRSxFQUFpQyxFQUFBO0FBQ3JFLElBQUEsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUNmLENBQUMsT0FBTyxFQUFFLEtBQUssS0FBSyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxLQUFLLEVBQUUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUMsS0FBSyxLQUFLLENBQ3pFLENBQUM7QUFDSixDQUFDO0FBZ0NlLFNBQUEsU0FBUyxDQUN2QixVQUFlLEVBQ2YsT0FBeUIsRUFBQTtBQUV6QixJQUFBLE9BQU8sVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE1BQUssTUFBQSxDQUFBLE1BQUEsQ0FBQSxNQUFBLENBQUEsTUFBQSxDQUFBLEVBQUEsRUFBTSxDQUFDLENBQUEsRUFBQSxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBQSxDQUFBLENBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUMvRTs7TUMxQmEsWUFBWSxDQUFBO0FBOEJ2QixJQUFBLFdBQUEsQ0FDVyxJQUFjLEVBQ2QsUUFBZ0IsRUFDaEIsS0FBYSxFQUFBO1FBRmIsSUFBSSxDQUFBLElBQUEsR0FBSixJQUFJLENBQVU7UUFDZCxJQUFRLENBQUEsUUFBQSxHQUFSLFFBQVEsQ0FBUTtRQUNoQixJQUFLLENBQUEsS0FBQSxHQUFMLEtBQUssQ0FBUTtBQUV0QixRQUFBLFlBQVksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2hDLFFBQUEsWUFBWSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUM7S0FDakM7SUFFRCxPQUFPLEVBQUUsQ0FBQyxJQUFjLEVBQUE7QUFDdEIsUUFBQSxPQUFPLFlBQVksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDakM7QUFFRCxJQUFBLE9BQU8sTUFBTSxHQUFBO1FBQ1gsT0FBTyxZQUFZLENBQUMsT0FBTyxDQUFDO0tBQzdCOztBQTVDdUIsWUFBTyxDQUFBLE9BQUEsR0FBbUIsRUFBRSxDQUFDO0FBQzdCLFlBQUssQ0FBQSxLQUFBLEdBQXFDLEVBQUUsQ0FBQztBQUVyRCxZQUFZLENBQUEsWUFBQSxHQUFHLElBQUksWUFBWSxDQUM3QyxhQUFhLEVBQ2IsR0FBRyxFQUNILGFBQWEsQ0FDZCxDQUFDO0FBQ2MsWUFBYSxDQUFBLGFBQUEsR0FBRyxJQUFJLFlBQVksQ0FDOUMsY0FBYyxFQUNkLEVBQUUsRUFDRixjQUFjLENBQ2YsQ0FBQztBQUNjLFlBQWlCLENBQUEsaUJBQUEsR0FBRyxJQUFJLFlBQVksQ0FDbEQsa0JBQWtCLEVBQ2xCLEVBQUUsRUFDRixZQUFZLENBQ2IsQ0FBQztBQUNjLFlBQVksQ0FBQSxZQUFBLEdBQUcsSUFBSSxZQUFZLENBQzdDLGFBQWEsRUFDYixFQUFFLEVBQ0YsWUFBWSxDQUNiLENBQUM7QUFDYyxZQUFhLENBQUEsYUFBQSxHQUFHLElBQUksWUFBWSxDQUM5QyxjQUFjLEVBQ2QsRUFBRSxFQUNGLFlBQVksQ0FDYjs7U0N4RGEsUUFBUSxDQUN0QixrQkFBc0MsRUFDdEMsR0FBVyxFQUNYLElBQVUsRUFBQTtBQUVWLElBQUEsSUFBSSxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsS0FBSyxTQUFTLEVBQUU7QUFDekMsUUFBQSxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2pDLE9BQU87QUFDUixLQUFBO0lBRUQsa0JBQWtCLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3JDLENBQUM7QUFFRDtTQUNnQixLQUFLLENBQ25CLElBQVUsRUFDVixLQUFhLEVBQ2IsbUJBQTRCLEVBQUE7O0lBRTVCLElBQUksS0FBSyxLQUFLLEVBQUUsRUFBRTtRQUNoQixPQUFPO1lBQ0wsSUFBSSxFQUFBLE1BQUEsQ0FBQSxNQUFBLENBQUEsTUFBQSxDQUFBLE1BQUEsQ0FBQSxFQUFBLEVBQ0MsSUFBSSxDQUNQLEVBQUEsRUFBQSxHQUFHLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFDaEIsQ0FBQTtZQUNELEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztBQUNqQixZQUFBLEtBQUssRUFBRSxLQUFLO1NBQ2IsQ0FBQztBQUNILEtBQUE7SUFFRCxJQUFJLGVBQWUsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxFQUFFO0FBQ3RDLFFBQUEsSUFDRSxtQkFBbUI7WUFDbkIsSUFBSSxDQUFDLElBQUksS0FBSyxjQUFjO0FBQzVCLFlBQUEsSUFBSSxDQUFDLElBQUksS0FBSyxhQUFhLEVBQzNCO1lBQ0EsTUFBTSxDQUFDLEdBQUcscUJBQXFCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzVDLE9BQU87Z0JBQ0wsSUFBSSxFQUFBLE1BQUEsQ0FBQSxNQUFBLENBQUEsTUFBQSxDQUFBLE1BQUEsQ0FBQSxFQUFBLEVBQ0MsSUFBSSxDQUFBLEVBQUEsRUFDUCxLQUFLLEVBQUUsQ0FBQyxFQUNSLEdBQUcsRUFBRSxDQUFDLEVBQ1AsQ0FBQTtBQUNELGdCQUFBLEtBQUssRUFBRSxDQUFDO0FBQ1IsZ0JBQUEsS0FBSyxFQUFFLEtBQUs7YUFDYixDQUFDO0FBQ0gsU0FBQTtBQUFNLGFBQUE7WUFDTCxPQUFPO2dCQUNMLElBQUksRUFBQSxNQUFBLENBQUEsTUFBQSxDQUFBLE1BQUEsQ0FBQSxNQUFBLENBQUEsRUFBQSxFQUNDLElBQUksQ0FDUCxFQUFBLEVBQUEsR0FBRyxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQ2hCLENBQUE7Z0JBQ0QsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO0FBQ2pCLGdCQUFBLEtBQUssRUFBRSxLQUFLO2FBQ2IsQ0FBQztBQUNILFNBQUE7QUFDRixLQUFBO0lBQ0QsTUFBTSxZQUFZLEdBQUcsQ0FBQSxFQUFBLEdBQUEsSUFBSSxDQUFDLE9BQU8sTUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLEtBQUEsQ0FBQSxHQUFBLEtBQUEsQ0FBQSxHQUFBLEVBQUEsQ0FBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssZUFBZSxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQzFFLElBQUEsSUFBSSxZQUFZLEVBQUU7UUFDaEIsT0FBTztBQUNMLFlBQUEsSUFBSSxrQ0FDQyxJQUFJLENBQUEsRUFBQSxFQUNQLEdBQUcsRUFBRSxZQUFZLEVBQ2xCLENBQUE7QUFDRCxZQUFBLEtBQUssRUFBRSxZQUFZO0FBQ25CLFlBQUEsS0FBSyxFQUFFLElBQUk7U0FDWixDQUFDO0FBQ0gsS0FBQTtJQUVELE9BQU87UUFDTCxJQUFJO0FBQ0osUUFBQSxLQUFLLEVBQUUsS0FBSztLQUNiLENBQUM7QUFDSixDQUFDO0FBRUssU0FBVSxZQUFZLENBQzFCLFlBQTBCLEVBQzFCLEtBQWEsRUFDYixHQUFXLEVBQ1gsV0FBMEIsRUFDMUIsdUJBQWlELEVBQUE7O0lBRWpELE1BQU0sbUJBQW1CLEdBQUcscUJBQXFCLENBQUMsS0FBSyxDQUFDLEtBQUssS0FBSyxDQUFDO0lBRW5FLE1BQU0sdUJBQXVCLEdBQUcsTUFBSzs7QUFDbkMsUUFBQSxJQUFJLFdBQVcsS0FBSyxPQUFPLElBQUksV0FBVyxLQUFLLFNBQVMsRUFBRTtBQUN4RCxZQUFBLE9BQU8sRUFBRSxDQUFDO0FBQ1gsU0FBQTtRQUNELElBQUksV0FBVyxLQUFJLENBQUEsRUFBQSxHQUFBLFlBQVksQ0FBQyxXQUFXLE1BQUcsSUFBQSxJQUFBLEVBQUEsS0FBQSxLQUFBLENBQUEsR0FBQSxLQUFBLENBQUEsR0FBQSxFQUFBLENBQUEsV0FBVyxDQUFDLENBQUEsRUFBRTtBQUMxRCxZQUFBLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFBLFlBQVksQ0FBQyxXQUFXLE1BQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxLQUFBLENBQUEsR0FBQSxLQUFBLENBQUEsR0FBQSxFQUFBLENBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUN0RSxTQUFBO0FBQ0QsUUFBQSxPQUFPLEVBQUUsQ0FBQztBQUNaLEtBQUMsQ0FBQztJQUVGLE1BQU0sS0FBSyxHQUFHLG1CQUFtQjtBQUMvQixVQUFFLFdBQVc7Y0FDVCx1QkFBdUIsRUFBRTtBQUMzQixjQUFFO0FBQ0UsZ0JBQUEsSUFBSSxDQUFBLEVBQUEsR0FBQSxZQUFZLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLEtBQUEsQ0FBQSxHQUFBLEVBQUEsR0FBSSxFQUFFLENBQUM7QUFDcEQsZ0JBQUEsSUFBSSxDQUFBLEVBQUEsR0FBQSxZQUFZLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsTUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLEtBQUEsQ0FBQSxHQUFBLEVBQUEsR0FBSSxFQUFFLENBQUM7QUFDbEUsZ0JBQUEsSUFBSSxDQUFBLEVBQUEsR0FBQSxZQUFZLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLEtBQUEsQ0FBQSxHQUFBLEVBQUEsR0FBSSxFQUFFLENBQUM7QUFDckQsZ0JBQUEsSUFBSSxDQUFBLEVBQUEsR0FBQSxZQUFZLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsTUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLEtBQUEsQ0FBQSxHQUFBLEVBQUEsR0FBSSxFQUFFLENBQUM7QUFDbkUsZ0JBQUEsSUFBSSxDQUFBLEVBQUEsR0FBQSxZQUFZLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsS0FBQSxDQUFBLEdBQUEsRUFBQSxHQUFJLEVBQUUsQ0FBQztBQUN6RCxnQkFBQSxJQUFJLENBQUEsRUFBQSxHQUFBLFlBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLE1BQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxLQUFBLENBQUEsR0FBQSxFQUFBLEdBQzlELEVBQUUsQ0FBQztBQUNMLGdCQUFBLElBQUksQ0FBQSxFQUFBLEdBQUEsWUFBWSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxLQUFBLENBQUEsR0FBQSxFQUFBLEdBQUksRUFBRSxDQUFDO0FBQ3JELGdCQUFBLElBQUksQ0FBQSxFQUFBLEdBQUEsWUFBWSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdB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
