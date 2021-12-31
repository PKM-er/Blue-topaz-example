'use strict';

var obsidian = require('obsidian');

/*
*****************************************************************************
使用声明
本插件基于多款社区插件改编而成，蚕子水平有限，代码或许存在缺陷，不能保证任何用户或任何操作均为正常，
请您在使用本插件之前，先备份好Obsidian笔记库再进行操作测试，谢谢配合。
开发：蚕子 QQ：312815311 更新时间：2021-12-31
*****************************************************************************
*/

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
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

var Settings = /** @class */ (function () {
    function Settings() {
        this.defaultChar = '\n、';
        this.简体字表 = "啊阿埃挨哎唉哀皑癌蔼矮艾碍爱隘鞍氨安俺按暗岸胺案肮昂盎凹敖熬翱袄傲奥懊澳芭捌扒叭吧笆八疤巴拔跋靶把耙坝霸罢爸白柏百摆佰败拜稗斑班搬扳般颁板版扮拌伴瓣半办绊邦帮梆榜膀绑棒磅蚌镑傍谤苞胞包褒剥薄雹保堡饱宝抱报暴豹鲍爆杯碑悲卑北辈背贝钡倍狈备惫焙被奔苯本笨崩绷甭泵蹦迸逼鼻比鄙笔彼碧蓖蔽毕毙毖币庇痹闭敝弊必辟壁臂避陛鞭边编贬扁便变卞辨辩辫遍标彪膘表鳖憋别瘪彬斌濒滨宾摈兵冰柄丙秉饼炳病并玻菠播拨钵波博勃搏铂箔伯帛舶脖膊渤泊驳捕卜哺补埠不布步簿部怖擦猜裁材才财睬踩采彩菜蔡餐参蚕残惭惨灿苍舱仓沧藏操糙槽曹草厕策侧册测层蹭插叉茬茶查碴搽察岔差诧拆柴豺搀掺蝉馋谗缠铲产阐颤昌猖场尝常长偿肠厂敞畅唱倡超抄钞朝嘲潮巢吵炒车扯撤掣彻澈郴臣辰尘晨忱沉陈趁衬撑称城橙成呈乘程惩澄诚承逞骋秤吃痴持匙池迟弛驰耻齿侈尺赤翅斥炽充冲虫崇宠抽酬畴踌稠愁筹仇绸瞅丑臭初出橱厨躇锄雏滁除楚础储矗搐触处揣川穿椽传船喘串疮窗幢床闯创吹炊捶锤垂春椿醇唇淳纯蠢戳绰疵茨磁雌辞慈瓷词此刺赐次聪葱囱匆从丛凑粗醋簇促蹿篡窜摧崔催脆瘁粹淬翠村存寸磋撮搓措挫错搭达答瘩打大呆歹傣戴带殆代贷袋待逮怠耽担丹单郸掸胆旦氮但惮淡诞弹蛋当挡党荡档刀捣蹈倒岛祷导到稻悼道盗德得的蹬灯登等瞪凳邓堤低滴迪敌笛狄涤翟嫡抵底地蒂第帝弟递缔颠掂滇碘点典靛垫电佃甸店惦奠淀殿碉叼雕凋刁掉吊钓调跌爹碟蝶迭谍叠丁盯叮钉顶鼎锭定订丢东冬董懂动栋侗恫冻洞兜抖斗陡豆逗痘都督毒犊独读堵睹赌杜镀肚度渡妒端短锻段断缎堆兑队对墩吨蹲敦顿囤钝盾遁掇哆多夺垛躲朵跺舵剁惰堕蛾峨鹅俄额讹娥恶厄扼遏鄂饿恩而儿耳尔饵洱二贰发罚筏伐乏阀法珐藩帆番翻樊矾钒繁凡烦反返范贩犯饭泛坊芳方肪房防妨仿访纺放菲非啡飞肥匪诽吠肺废沸费芬酚吩氛分纷坟焚汾粉奋份忿愤粪丰封枫蜂峰锋风疯烽逢冯缝讽奉凤佛否夫敷肤孵扶拂辐幅氟符伏俘服浮涪福袱弗甫抚辅俯釜斧脯腑府腐赴副覆赋复傅付阜父腹负富讣附妇缚咐噶嘎该改概钙盖溉干甘杆柑竿肝赶感秆敢赣冈刚钢缸肛纲岗港杠篙皋高膏羔糕搞镐稿告哥歌搁戈鸽胳疙割革葛格蛤阁隔铬个各给根跟耕更庚羹埂耿梗工攻功恭龚供躬公宫弓巩汞拱贡共钩勾沟苟狗垢构购够辜菇咕箍估沽孤姑鼓古蛊骨谷股故顾固雇刮瓜剐寡挂褂乖拐怪棺关官冠观管馆罐惯灌贯光广逛瑰规圭硅归龟闺轨鬼诡癸桂柜跪贵刽辊滚棍锅郭国果裹过哈骸孩海氦亥害骇酣憨邯韩含涵寒函喊罕翰撼捍旱憾悍焊汗汉夯杭航壕嚎豪毫郝好耗号浩呵喝荷菏核禾和何合盒貉阂河涸赫褐鹤贺嘿黑痕很狠恨哼亨横衡恒轰哄烘虹鸿洪宏弘红喉侯猴吼厚候后呼乎忽瑚壶葫胡蝴狐糊湖弧虎唬护互沪户花哗华猾滑画划化话槐徊怀淮坏欢环桓还缓换患唤痪豢焕涣宦幻荒慌黄磺蝗簧皇凰惶煌晃幌恍谎灰挥辉徽恢蛔回毁悔慧卉惠晦贿秽会烩汇讳诲绘荤昏婚魂浑混豁活伙火获或惑霍货祸击圾基机畸稽积箕肌饥迹激讥鸡姬绩缉吉极棘辑籍集及急疾汲即嫉级挤几脊己蓟技冀季伎祭剂悸济寄寂计记既忌际继纪嘉枷夹佳家加荚颊贾甲钾假稼价架驾嫁歼监坚尖笺间煎兼肩艰奸缄茧检柬碱硷拣捡简俭剪减荐槛鉴践贱见键箭件健舰剑饯渐溅涧建僵姜将浆江疆蒋桨奖讲匠酱降蕉椒礁焦胶交郊浇骄娇嚼搅铰矫侥脚狡角饺缴绞剿教酵轿较叫窖揭接皆秸街阶截劫节茎睛晶鲸京惊精粳经井警景颈静境敬镜径痉靖竟竞净炯窘揪究纠玖韭久灸九酒厩救旧臼舅咎就疚鞠拘狙疽居驹菊局咀矩举沮聚拒据巨具距踞锯俱句惧炬剧捐鹃娟倦眷卷绢撅攫抉掘倔爵桔杰捷睫竭洁结解姐戒藉芥界借介疥诫届巾筋斤金今津襟紧锦仅谨进靳晋禁近烬浸尽劲荆兢觉决诀绝均菌钧军君峻俊竣浚郡骏喀咖卡咯开揩楷凯慨刊堪勘坎砍看康慷糠扛抗亢炕考拷烤靠坷苛柯棵磕颗科壳咳可渴克刻客课肯啃垦恳坑吭空恐孔控抠口扣寇枯哭窟苦酷库裤夸垮挎跨胯块筷侩快宽款匡筐狂框矿眶旷况亏盔岿窥葵奎魁傀馈愧溃坤昆捆困括扩廓阔垃拉喇蜡腊辣啦莱来赖蓝婪栏拦篮阑兰澜谰揽览懒缆烂滥琅榔狼廊郎朗浪捞劳牢老佬姥酪烙涝勒乐雷镭蕾磊累儡垒擂肋类泪棱楞冷厘梨犁黎篱狸离漓理李里鲤礼莉荔吏栗丽厉励砾历利傈例俐痢立粒沥隶力璃哩俩联莲连镰廉怜涟帘敛脸链恋炼练粮凉梁粱良两辆量晾亮谅撩聊僚疗燎寥辽潦了撂镣廖料列裂烈劣猎琳林磷霖临邻鳞淋凛赁吝拎玲菱零龄铃伶羚凌灵陵岭领另令溜琉榴硫馏留刘瘤流柳六龙聋咙笼窿隆垄拢陇楼娄搂篓漏陋芦卢颅庐炉掳卤虏鲁麓碌露路赂鹿潞禄录陆戮驴吕铝侣旅履屡缕虑氯律率滤绿峦挛孪滦卵乱掠略抡轮伦仑沦纶论萝螺罗逻锣箩骡裸落洛骆络妈麻玛码蚂马骂嘛吗埋买麦卖迈脉瞒馒蛮满蔓曼慢漫谩芒茫盲氓忙莽猫茅锚毛矛铆卯茂冒帽貌贸么玫枚梅酶霉煤没眉媒镁每美昧寐妹媚门闷们萌蒙檬盟锰猛梦孟眯醚靡糜迷谜弥米秘觅泌蜜密幂棉眠绵冕免勉娩缅面苗描瞄藐秒渺庙妙蔑灭民抿皿敏悯闽明螟鸣铭名命谬摸摹蘑模膜磨摩魔抹末莫墨默沫漠寞陌谋牟某拇牡亩姆母墓暮幕募慕木目睦牧穆拿哪呐钠那娜纳氖乃奶耐奈南男难囊挠脑恼闹淖呢馁内嫩能妮霓倪泥尼拟你匿腻逆溺蔫拈年碾撵捻念娘酿鸟尿捏聂孽啮镊镍涅您柠狞凝宁拧泞牛扭钮纽脓浓农弄奴努怒女暖虐疟挪懦糯诺哦欧鸥殴藕呕偶沤啪趴爬帕怕琶拍排牌徘湃派攀潘盘磐盼畔判叛乓庞旁耪胖抛咆刨炮袍跑泡呸胚培裴赔陪配佩沛喷盆砰抨烹澎彭蓬棚硼篷膨朋鹏捧碰坯砒霹批披劈琵毗啤脾疲皮匹痞僻屁譬篇偏片骗飘漂瓢票撇瞥拼频贫品聘乒坪苹萍平凭瓶评屏坡泼颇婆破魄迫粕剖扑铺仆莆葡菩蒲埔朴圃普浦谱曝瀑期欺栖戚妻七凄漆柒沏其棋奇歧畦崎脐齐旗祈祁骑起岂乞企启契砌器气迄弃汽泣讫掐洽牵扦钎铅千迁签仟谦乾黔钱钳前潜遣浅谴堑嵌欠歉枪呛腔羌墙蔷强抢橇锹敲悄桥瞧乔侨巧鞘撬翘峭俏窍切茄且怯窃钦侵亲秦琴勤芹擒禽寝沁青轻氢倾卿清擎晴氰情顷请庆琼穷秋丘邱球求囚酋泅趋区蛆曲躯屈驱渠取娶龋趣去圈颧权醛泉全痊拳犬券劝缺炔瘸却鹊榷确雀裙群然燃冉染瓤壤攘嚷让饶扰绕惹热壬仁人忍韧任认刃妊纫扔仍日戎茸蓉荣融熔溶容绒冗揉柔肉茹蠕儒孺如辱乳汝入褥软阮蕊瑞锐闰润若弱撒洒萨腮鳃塞赛三叁伞散桑嗓丧搔骚扫嫂瑟色涩森僧莎砂杀刹沙纱傻啥煞筛晒珊苫杉山删煽衫闪陕擅赡膳善汕扇缮墒伤商赏晌上尚裳梢捎稍烧芍勺韶少哨邵绍奢赊蛇舌舍赦摄射慑涉社设砷申呻伸身深娠绅神沈审婶甚肾慎渗声生甥牲升绳省盛剩胜圣师失狮施湿诗尸虱十石拾时什食蚀实识史矢使屎驶始式示士世柿事拭誓逝势是嗜噬适仕侍释饰氏市恃室视试收手首守寿授售受瘦兽蔬枢梳殊抒输叔舒淑疏书赎孰熟薯暑曙署蜀黍鼠属术述树束戍竖墅庶数漱恕刷耍摔衰甩帅栓拴霜双爽谁水睡税吮瞬顺舜说硕朔烁斯撕嘶思私司丝死肆寺嗣四伺似饲巳松耸怂颂送宋讼诵搜艘擞嗽苏酥俗素速粟僳塑溯宿诉肃酸蒜算虽隋随绥髓碎岁穗遂隧祟孙损笋蓑梭唆缩琐索锁所塌他它她塔獭挞蹋踏胎苔抬台泰酞太态汰坍摊贪瘫滩坛檀痰潭谭谈坦毯袒碳探叹炭汤塘搪堂棠膛唐糖倘躺淌趟烫掏涛滔绦萄桃逃淘陶讨套特藤腾疼誊梯剔踢锑提题蹄啼体替嚏惕涕剃屉天添填田甜恬舔腆挑条迢眺跳贴铁帖厅听烃汀廷停亭庭挺艇通桐酮瞳同铜彤童桶捅筒统痛偷投头透凸秃突图徒途涂屠土吐兔湍团推颓腿蜕褪退吞屯臀拖托脱鸵陀驮驼椭妥拓唾挖哇蛙洼娃瓦袜歪外豌弯湾玩顽丸烷完碗挽晚皖惋宛婉万腕汪王亡枉网往旺望忘妄威巍微危韦违桅围唯惟为潍维苇萎委伟伪尾纬未蔚味畏胃喂魏位渭谓尉慰卫瘟温蚊文闻纹吻稳紊问嗡翁瓮挝蜗涡窝我斡卧握沃巫呜钨乌污诬屋无芜梧吾吴毋武五捂午舞伍侮坞戊雾晤物勿务悟误昔熙析西硒矽晰嘻吸锡牺稀息希悉膝夕惜熄烯溪汐犀檄袭席习媳喜铣洗系隙戏细瞎虾匣霞辖暇峡侠狭下厦夏吓掀锨先仙鲜纤咸贤衔舷闲涎弦嫌显险现献县腺馅羡宪陷限线相厢镶香箱襄湘乡翔祥详想响享项巷橡像向象萧硝霄削哮嚣销消宵淆晓小孝校肖啸笑效楔些歇蝎鞋协挟携邪斜胁谐写械卸蟹懈泄泻谢屑薪芯锌欣辛新忻心信衅星腥猩惺兴刑型形邢行醒幸杏性姓兄凶胸匈汹雄熊休修羞朽嗅锈秀袖绣墟戌需虚嘘须徐许蓄酗叙旭序畜恤絮婿绪续轩喧宣悬旋玄选癣眩绚靴薛学穴雪血勋熏循旬询寻驯巡殉汛训讯逊迅压押鸦鸭呀丫芽牙蚜崖衙涯雅哑亚讶焉咽阉烟淹盐严研蜒岩延言颜阎炎沿奄掩眼衍演艳堰燕厌砚雁唁彦焰宴谚验殃央鸯秧杨扬佯疡羊洋阳氧仰痒养样漾邀腰妖瑶摇尧遥窑谣姚咬舀药要耀椰噎耶爷野冶也页掖业叶曳腋夜液一壹医揖铱依伊衣颐夷遗移仪胰疑沂宜姨彝椅蚁倚已乙矣以艺抑易邑屹亿役臆逸肄疫亦裔意毅忆义益溢诣议谊译异翼翌绎茵荫因殷音阴姻吟银淫寅饮尹引隐印英樱婴鹰应缨莹萤营荧蝇迎赢盈影颖硬映哟拥佣臃痈庸雍踊蛹咏泳涌永恿勇用幽优悠忧尤由邮铀犹油游酉有友右佑釉诱又幼迂淤于盂榆虞愚舆余俞逾鱼愉渝渔隅予娱雨与屿禹宇语羽玉域芋郁吁遇喻峪御愈欲狱育誉浴寓裕预豫驭鸳渊冤元垣袁原援辕园员圆猿源缘远苑愿怨院曰约越跃钥岳粤月悦阅耘云郧匀陨允运蕴酝晕韵孕匝砸杂栽哉灾宰载再在咱攒暂赞赃脏葬遭糟凿藻枣早澡蚤躁噪造皂灶燥责择则泽贼怎增憎曾赠扎喳渣札轧铡闸眨栅榨咋乍炸诈摘斋宅窄债寨瞻毡詹粘沾盏斩辗崭展蘸栈占战站湛绽樟章彰漳张掌涨杖丈帐账仗胀瘴障招昭找沼赵照罩兆肇召遮折哲蛰辙者锗蔗这浙珍斟真甄砧臻贞针侦枕疹诊震振镇阵蒸挣睁征狰争怔整拯正政帧症郑证芝枝支吱蜘知肢脂汁之织职直植殖执值侄址指止趾只旨纸志挚掷至致置帜峙制智秩稚质炙痔滞治窒中盅忠钟衷终种肿重仲众舟周州洲诌粥轴肘帚咒皱宙昼骤珠株蛛朱猪诸诛逐竹烛煮拄瞩嘱主著柱助蛀贮铸筑住注祝驻抓爪拽专砖转撰赚篆桩庄装妆撞壮状椎锥追赘坠缀谆准捉拙卓桌琢茁酌啄着灼浊兹咨资姿滋淄孜紫仔籽滓子自渍字鬃棕踪宗综总纵邹走奏揍租足卒族祖诅阻组钻纂嘴醉最罪尊遵昨左佐柞做作坐座锕嗳嫒瑷暧霭谙铵鹌媪骜鳌钯呗钣鸨龅鹎贲锛荜哔滗铋筚跸苄缏笾骠飑飙镖镳鳔傧缤槟殡膑镔髌鬓禀饽钹鹁钸骖黪恻锸侪钗冁谄谶蒇忏婵骣觇禅镡伥苌怅阊鲳砗伧谌榇碜龀枨柽铖铛饬鸱铳俦帱雠刍绌蹰钏怆缍鹑辍龊鹚苁骢枞辏撺锉鹾哒鞑骀绐殚赕瘅箪谠砀裆焘镫籴诋谛绨觌镝巅钿癫铫鲷鲽铤铥岽鸫窦渎椟牍笃黩簖怼镦炖趸铎谔垩阏轭锇锷鹗颚颛鳄诶迩铒鸸鲕钫鲂绯镄鲱偾沣凫驸绂绋赙麸鲋鳆钆赅尴擀绀戆睾诰缟锆纥镉颍亘赓绠鲠诟缑觏诂毂钴锢鸪鹄鹘鸹掴诖掼鹳鳏犷匦刿妫桧鲑鳜衮绲鲧埚呙帼椁蝈铪阚绗颉灏颢诃阖蛎黉讧荭闳鲎浒鹕骅桦铧奂缳锾鲩鳇诙荟哕浍缋珲晖诨馄阍钬镬讦诘荠叽哜骥玑觊齑矶羁虿跻霁鲚鲫郏浃铗镓蛲谏缣戋戬睑鹣笕鲣鞯绛缰挢峤鹪鲛疖颌鲒卺荩馑缙赆觐刭泾迳弪胫靓阄鸠鹫讵屦榉飓钜锔窭龃锩镌隽谲珏皲剀垲忾恺铠锴龛闶钪铐骒缂轲钶锞颔龈铿喾郐哙脍狯髋诓诳邝圹纩贶匮蒉愦聩篑阃锟鲲蛴崃徕涞濑赉睐铼癞籁岚榄斓镧褴阆锒唠崂铑铹痨鳓诔缧俪郦坜苈莅蓠呖逦骊缡枥栎轹砺锂鹂疠粝跞雳鲡鳢蔹奁潋琏殓裢裣鲢魉缭钌鹩蔺廪檩辚躏绫棂蛏鲮浏骝绺镏鹨茏泷珑栊胧砻偻蒌喽嵝镂瘘耧蝼髅垆撸噜闾泸渌栌橹轳辂辘氇胪鸬鹭舻鲈脔娈栾鸾銮囵荦猡泺椤脶镙榈褛锊呒唛嬷杩劢缦镘颡鳗麽扪焖懑钔芈谧猕祢渑腼黾缈缪闵缗谟蓦馍殁镆钼铙讷铌鲵辇鲶茑袅陧蘖嗫颟蹑苎咛聍侬哝驽钕傩讴怄瓯蹒疱辔纰罴铍谝骈缥嫔钋镤镨蕲骐绮桤碛颀颃鳍佥荨悭骞缱椠钤嫱樯戗炝锖锵镪羟跄诮谯荞缲硗跷惬锲箧锓揿鲭茕蛱巯赇虮鳅诎岖阒觑鸲诠绻辁铨阕阙悫荛娆桡饪轫嵘蝾缛铷颦蚬飒毵糁缫啬铯穑铩鲨酾讪姗骟钐鳝垧殇觞厍滠畲诜谂渖谥埘莳弑轼贳铈鲥绶摅纾闩铄厮驷缌锶鸶薮馊飕锼谡稣谇荪狲唢睃闼铊鳎钛鲐昙钽锬顸傥饧铴镗韬铽缇鹈阗粜龆鲦恸钭钍抟饨箨鼍娲腽纨绾辋诿帏闱沩涠玮韪炜鲔阌莴龌邬庑怃妩骛鹉鹜饩阋玺觋硖苋莶藓岘猃娴鹇痫蚝籼跹芗饷骧缃飨哓潇骁绡枭箫亵撷绁缬陉荥馐鸺诩顼谖铉镟谑泶鳕埙浔鲟垭娅桠氩厣赝俨兖谳恹闫酽魇餍鼹炀轺鹞鳐靥谒邺晔烨诒呓峄饴怿驿缢轶贻钇镒镱瘗舣铟瘾茔莺萦蓥撄嘤滢潆璎鹦瘿颏罂镛莸铕鱿伛俣谀谕蓣嵛饫阈妪纡觎欤钰鹆鹬龉橼鸢鼋钺郓芸恽愠纭韫殒氲瓒趱錾驵赜啧帻箦谮缯谵诏钊谪辄鹧浈缜桢轸赈祯鸩诤峥钲铮筝骘栉栀轵轾贽鸷蛳絷踬踯觯锺纣绉伫槠铢啭馔颞骓缒诼镯谘缁辎赀眦锱龇鲻偬诹驺鲰镞缵躜鳟讠谫郄勐凼坂垅垴埯埝苘荬荮莜莼菰藁揸吒吣咔咝咴噘噼嚯幞岙嵴彷徼犸狍馀馇馓馕愣憷懔丬溆滟溷漤潴澹甯纟绔绱珉枧桊桉槔橥轱轷赍肷胨飚煳煅熘愍淼砜磙眍钚钷铘铞锃锍锎锏锘锝锪锫锿镅镎镢镥镩镲稆鹋鹛鹱疬疴痖癯裥襁耢颥螨麴鲅鲆鲇鲞鲴鲺鲼鳊鳋鳘鳙鞒鞴齄";
        this.繁体字表 = "啊阿埃挨哎唉哀皚癌藹矮艾礙愛隘鞍氨安俺按暗岸胺案骯昂盎凹敖熬翺襖傲奧懊澳芭捌扒叭吧笆八疤巴拔跋靶把耙壩霸罷爸白柏百擺佰敗拜稗斑班搬扳般頒板版扮拌伴瓣半辦絆邦幫梆榜膀綁棒磅蚌鎊傍謗苞胞包褒剝薄雹保堡飽寶抱報暴豹鮑爆杯碑悲卑北輩背貝鋇倍狽備憊焙被奔苯本笨崩繃甭泵蹦迸逼鼻比鄙筆彼碧蓖蔽畢斃毖幣庇痹閉敝弊必辟壁臂避陛鞭邊編貶扁便變卞辨辯辮遍標彪膘表鱉憋別癟彬斌瀕濱賓擯兵冰柄丙秉餅炳病並玻菠播撥缽波博勃搏鉑箔伯帛舶脖膊渤泊駁捕蔔哺補埠不布步簿部怖擦猜裁材才財睬踩采彩菜蔡餐參蠶殘慚慘燦蒼艙倉滄藏操糙槽曹草廁策側冊測層蹭插叉茬茶查碴搽察岔差詫拆柴豺攙摻蟬饞讒纏鏟產闡顫昌猖場嘗常長償腸廠敞暢唱倡超抄鈔朝嘲潮巢吵炒車扯撤掣徹澈郴臣辰塵晨忱沈陳趁襯撐稱城橙成呈乘程懲澄誠承逞騁秤吃癡持匙池遲弛馳恥齒侈尺赤翅斥熾充沖蟲崇寵抽酬疇躊稠愁籌仇綢瞅醜臭初出櫥廚躇鋤雛滁除楚礎儲矗搐觸處揣川穿椽傳船喘串瘡窗幢床闖創吹炊捶錘垂春椿醇唇淳純蠢戳綽疵茨磁雌辭慈瓷詞此刺賜次聰蔥囪匆從叢湊粗醋簇促躥篡竄摧崔催脆瘁粹淬翠村存寸磋撮搓措挫錯搭達答瘩打大呆歹傣戴帶殆代貸袋待逮怠耽擔丹單鄲撣膽旦氮但憚淡誕彈蛋當擋黨蕩檔刀搗蹈倒島禱導到稻悼道盜德得的蹬燈登等瞪凳鄧堤低滴迪敵笛狄滌翟嫡抵底地蒂第帝弟遞締顛掂滇碘點典靛墊電佃甸店惦奠澱殿碉叼雕雕刁掉吊釣調跌爹碟蝶叠諜疊丁盯叮釘頂鼎錠定訂丟東冬董懂動棟侗恫凍洞兜抖鬥陡豆逗痘都督毒犢獨讀堵睹賭杜鍍肚度渡妒端短鍛段斷緞堆兌隊對墩噸蹲敦頓囤鈍盾遁掇哆多奪垛躲朵跺舵剁惰墮蛾峨鵝俄額訛娥惡厄扼遏鄂餓恩而兒耳爾餌洱二貳發罰筏伐乏閥法琺藩帆番翻樊礬釩繁凡煩反返範販犯飯泛坊芳方肪房防妨仿訪紡放菲非啡飛肥匪誹吠肺廢沸費芬酚吩氛分紛墳焚汾粉奮份忿憤糞豐封楓蜂峰鋒風瘋烽逢馮縫諷奉鳳佛否夫敷膚孵扶拂輻幅氟符伏俘服浮涪福袱弗甫撫輔俯釜斧脯腑府腐赴副覆賦復傅付阜父腹負富訃附婦縛咐噶嘎該改概鈣蓋溉幹甘桿柑竿肝趕感稈敢贛岡剛鋼缸肛綱崗港杠篙臯高膏羔糕搞鎬稿告哥歌擱戈鴿胳疙割革葛格蛤閣隔鉻個各給根跟耕更庚羹埂耿梗工攻功恭龔供躬公宮弓鞏汞拱貢共鉤勾溝茍狗垢構購夠辜菇咕箍估沽孤姑鼓古蠱骨谷股故顧固雇刮瓜剮寡掛褂乖拐怪棺關官冠觀管館罐慣灌貫光廣逛瑰規圭矽歸龜閨軌鬼詭癸桂櫃跪貴劊輥滾棍鍋郭國果裹過哈骸孩海氦亥害駭酣憨邯韓含涵寒函喊罕翰撼捍旱憾悍焊汗漢夯杭航壕嚎豪毫郝好耗號浩呵喝荷菏核禾和何合盒貉閡河涸赫褐鶴賀嘿黑痕很狠恨哼亨橫衡恒轟哄烘虹鴻洪宏弘紅喉侯猴吼厚候後呼乎忽瑚壺葫胡蝴狐糊湖弧虎唬護互滬戶花嘩華猾滑畫劃化話槐徊懷淮壞歡環桓還緩換患喚瘓豢煥渙宦幻荒慌黃磺蝗簧皇凰惶煌晃幌恍謊灰揮輝徽恢蛔回毀悔慧卉惠晦賄穢會燴匯諱誨繪葷昏婚魂渾混豁活夥火獲或惑霍貨禍擊圾基機畸稽積箕肌饑跡激譏雞姬績緝吉極棘輯籍集及急疾汲即嫉級擠幾脊己薊技冀季伎祭劑悸濟寄寂計記既忌際繼紀嘉枷夾佳家加莢頰賈甲鉀假稼價架駕嫁殲監堅尖箋間煎兼肩艱奸緘繭檢柬堿鹼揀撿簡儉剪減薦檻鑒踐賤見鍵箭件健艦劍餞漸濺澗建僵姜將漿江疆蔣槳獎講匠醬降蕉椒礁焦膠交郊澆驕嬌嚼攪鉸矯僥腳狡角餃繳絞剿教酵轎較叫窖揭接皆稭街階截劫節莖睛晶鯨京驚精粳經井警景頸靜境敬鏡徑痙靖竟競凈炯窘揪究糾玖韭久灸九酒廄救舊臼舅咎就疚鞠拘狙疽居駒菊局咀矩舉沮聚拒據巨具距踞鋸俱句懼炬劇捐鵑娟倦眷卷絹撅攫抉掘倔爵桔傑捷睫竭潔結解姐戒藉芥界借介疥誡屆巾筋斤金今津襟緊錦僅謹進靳晉禁近燼浸盡勁荊兢覺決訣絕均菌鈞軍君峻俊竣浚郡駿喀咖卡咯開揩楷凱慨刊堪勘坎砍看康慷糠扛抗亢炕考拷烤靠坷苛柯棵磕顆科殼咳可渴克刻客課肯啃墾懇坑吭空恐孔控摳口扣寇枯哭窟苦酷庫褲誇垮挎跨胯塊筷儈快寬款匡筐狂框礦眶曠況虧盔巋窺葵奎魁傀饋愧潰坤昆捆困括擴廓闊垃拉喇蠟臘辣啦萊來賴藍婪欄攔籃闌蘭瀾讕攬覽懶纜爛濫瑯榔狼廊郎朗浪撈勞牢老佬姥酪烙澇勒樂雷鐳蕾磊累儡壘擂肋類淚棱楞冷厘梨犁黎籬貍離漓理李裏鯉禮莉荔吏栗麗厲勵礫歷利傈例俐痢立粒瀝隸力璃哩倆聯蓮連鐮廉憐漣簾斂臉鏈戀煉練糧涼梁粱良兩輛量晾亮諒撩聊僚療燎寥遼潦了撂鐐廖料列裂烈劣獵琳林磷霖臨鄰鱗淋凜賃吝拎玲菱零齡鈴伶羚淩靈陵嶺領另令溜琉榴硫餾留劉瘤流柳六龍聾嚨籠窿隆壟攏隴樓婁摟簍漏陋蘆盧顱廬爐擄鹵虜魯麓碌露路賂鹿潞祿錄陸戮驢呂鋁侶旅履屢縷慮氯律率濾綠巒攣孿灤卵亂掠略掄輪倫侖淪綸論蘿螺羅邏鑼籮騾裸落洛駱絡媽麻瑪碼螞馬罵嘛嗎埋買麥賣邁脈瞞饅蠻滿蔓曼慢漫謾芒茫盲氓忙莽貓茅錨毛矛鉚卯茂冒帽貌貿麽玫枚梅酶黴煤沒眉媒鎂每美昧寐妹媚門悶們萌蒙檬盟錳猛夢孟瞇醚靡糜迷謎彌米秘覓泌蜜密冪棉眠綿冕免勉娩緬面苗描瞄藐秒渺廟妙蔑滅民抿皿敏憫閩明螟鳴銘名命謬摸摹蘑模膜磨摩魔抹末莫墨默沫漠寞陌謀牟某拇牡畝姆母墓暮幕募慕木目睦牧穆拿哪吶鈉那娜納氖乃奶耐奈南男難囊撓腦惱鬧淖呢餒內嫩能妮霓倪泥尼擬妳匿膩逆溺蔫拈年碾攆撚念娘釀鳥尿捏聶孽嚙鑷鎳涅您檸獰凝寧擰濘牛扭鈕紐膿濃農弄奴努怒女暖虐瘧挪懦糯諾哦歐鷗毆藕嘔偶漚啪趴爬帕怕琶拍排牌徘湃派攀潘盤磐盼畔判叛乓龐旁耪胖拋咆刨炮袍跑泡呸胚培裴賠陪配佩沛噴盆砰抨烹澎彭蓬棚硼篷膨朋鵬捧碰坯砒霹批披劈琵毗啤脾疲皮匹痞僻屁譬篇偏片騙飄漂瓢票撇瞥拼頻貧品聘乒坪蘋萍平憑瓶評屏坡潑頗婆破魄迫粕剖撲鋪仆莆葡菩蒲埔樸圃普浦譜曝瀑期欺棲戚妻七淒漆柒沏其棋奇歧畦崎臍齊旗祈祁騎起豈乞企啟契砌器氣迄棄汽泣訖掐洽牽扡釬鉛千遷簽仟謙乾黔錢鉗前潛遣淺譴塹嵌欠歉槍嗆腔羌墻薔強搶橇鍬敲悄橋瞧喬僑巧鞘撬翹峭俏竅切茄且怯竊欽侵親秦琴勤芹擒禽寢沁青輕氫傾卿清擎晴氰情頃請慶瓊窮秋丘邱球求囚酋泅趨區蛆曲軀屈驅渠取娶齲趣去圈顴權醛泉全痊拳犬券勸缺炔瘸卻鵲榷確雀裙群然燃冉染瓤壤攘嚷讓饒擾繞惹熱壬仁人忍韌任認刃妊紉扔仍日戎茸蓉榮融熔溶容絨冗揉柔肉茹蠕儒孺如辱乳汝入褥軟阮蕊瑞銳閏潤若弱撒灑薩腮鰓塞賽三三傘散桑嗓喪搔騷掃嫂瑟色澀森僧莎砂殺剎沙紗傻啥煞篩曬珊苫杉山刪煽衫閃陜擅贍膳善汕扇繕墑傷商賞晌上尚裳梢捎稍燒芍勺韶少哨邵紹奢賒蛇舌舍赦攝射懾涉社設砷申呻伸身深娠紳神沈審嬸甚腎慎滲聲生甥牲升繩省盛剩勝聖師失獅施濕詩屍虱十石拾時什食蝕實識史矢使屎駛始式示士世柿事拭誓逝勢是嗜噬適仕侍釋飾氏市恃室視試收手首守壽授售受瘦獸蔬樞梳殊抒輸叔舒淑疏書贖孰熟薯暑曙署蜀黍鼠屬術述樹束戍豎墅庶數漱恕刷耍摔衰甩帥栓拴霜雙爽誰水睡稅吮瞬順舜說碩朔爍斯撕嘶思私司絲死肆寺嗣四伺似飼巳松聳慫頌送宋訟誦搜艘擻嗽蘇酥俗素速粟僳塑溯宿訴肅酸蒜算雖隋隨綏髓碎歲穗遂隧祟孫損筍蓑梭唆縮瑣索鎖所塌他它她塔獺撻蹋踏胎苔擡臺泰酞太態汰坍攤貪癱灘壇檀痰潭譚談坦毯袒碳探嘆炭湯塘搪堂棠膛唐糖倘躺淌趟燙掏濤滔絳萄桃逃淘陶討套特藤騰疼謄梯剔踢銻提題蹄啼體替嚏惕涕剃屜天添填田甜恬舔腆挑條迢眺跳貼鐵帖廳聽烴汀廷停亭庭挺艇通桐酮瞳同銅彤童桶捅筒統痛偷投頭透凸禿突圖徒途塗屠土吐兔湍團推頹腿蛻褪退吞屯臀拖托脫鴕陀馱駝橢妥拓唾挖哇蛙窪娃瓦襪歪外豌彎灣玩頑丸烷完碗挽晚皖惋宛婉萬腕汪王亡枉網往旺望忘妄威巍微危韋違桅圍唯惟為濰維葦萎委偉偽尾緯未蔚味畏胃餵魏位渭謂尉慰衛瘟溫蚊文聞紋吻穩紊問嗡翁甕撾蝸渦窩我斡臥握沃巫嗚鎢烏汙誣屋無蕪梧吾吳毋武五捂午舞伍侮塢戊霧晤物勿務悟誤昔熙析西硒矽晰嘻吸錫犧稀息希悉膝夕惜熄烯溪汐犀檄襲席習媳喜銑洗系隙戲細瞎蝦匣霞轄暇峽俠狹下廈夏嚇掀鍁先仙鮮纖鹹賢銜舷閑涎弦嫌顯險現獻縣腺餡羨憲陷限線相廂鑲香箱襄湘鄉翔祥詳想響享項巷橡像向象蕭硝霄削哮囂銷消宵淆曉小孝校肖嘯笑效楔些歇蠍鞋協挾攜邪斜脅諧寫械卸蟹懈泄瀉謝屑薪芯鋅欣辛新忻心信釁星腥猩惺興刑型形邢行醒幸杏性姓兄兇胸匈洶雄熊休修羞朽嗅銹秀袖繡墟戌需虛噓須徐許蓄酗敘旭序畜恤絮婿緒續軒喧宣懸旋玄選癬眩絢靴薛學穴雪血勛熏循旬詢尋馴巡殉汛訓訊遜迅壓押鴉鴨呀丫芽牙蚜崖衙涯雅啞亞訝焉咽閹煙淹鹽嚴研蜒巖延言顏閻炎沿奄掩眼衍演艷堰燕厭硯雁唁彥焰宴諺驗殃央鴦秧楊揚佯瘍羊洋陽氧仰癢養樣漾邀腰妖瑤搖堯遙窯謠姚咬舀藥要耀椰噎耶爺野冶也頁掖業葉曳腋夜液壹壹醫揖銥依伊衣頤夷遺移儀胰疑沂宜姨彜椅蟻倚已乙矣以藝抑易邑屹億役臆逸肄疫亦裔意毅憶義益溢詣議誼譯異翼翌繹茵蔭因殷音陰姻吟銀淫寅飲尹引隱印英櫻嬰鷹應纓瑩螢營熒蠅迎贏盈影穎硬映喲擁傭臃癰庸雍踴蛹詠泳湧永恿勇用幽優悠憂尤由郵鈾猶油遊酉有友右佑釉誘又幼迂淤於盂榆虞愚輿余俞逾魚愉渝漁隅予娛雨與嶼禹宇語羽玉域芋郁籲遇喻峪禦愈欲獄育譽浴寓裕預豫馭鴛淵冤元垣袁原援轅園員圓猿源緣遠苑願怨院曰約越躍鑰嶽粵月悅閱耘雲鄖勻隕允運蘊醞暈韻孕匝砸雜栽哉災宰載再在咱攢暫贊贓臟葬遭糟鑿藻棗早澡蚤躁噪造皂竈燥責擇則澤賊怎增憎曾贈紮喳渣劄軋鍘閘眨柵榨咋乍炸詐摘齋宅窄債寨瞻氈詹粘沾盞斬輾嶄展蘸棧占戰站湛綻樟章彰漳張掌漲杖丈帳賬仗脹瘴障招昭找沼趙照罩兆肇召遮折哲蟄轍者鍺蔗這浙珍斟真甄砧臻貞針偵枕疹診震振鎮陣蒸掙睜征猙爭怔整拯正政幀癥鄭證芝枝支吱蜘知肢脂汁之織職直植殖執值侄址指止趾只旨紙誌摯擲至致置幟峙制智秩稚質炙痔滯治窒中盅忠鐘衷終種腫重仲眾舟周州洲謅粥軸肘帚咒皺宙晝驟珠株蛛朱豬諸誅逐竹燭煮拄矚囑主著柱助蛀貯鑄築住註祝駐抓爪拽專磚轉撰賺篆樁莊裝妝撞壯狀椎錐追贅墜綴諄準捉拙卓桌琢茁酌啄著灼濁茲咨資姿滋淄孜紫仔籽滓子自漬字鬃棕蹤宗綜總縱鄒走奏揍租足卒族祖詛阻組鉆纂嘴醉最罪尊遵昨左佐柞做作坐座錒噯嬡璦曖靄諳銨鵪媼驁鰲鈀唄鈑鴇齙鵯賁錛蓽嗶潷鉍篳蹕芐緶籩驃颮飆鏢鑣鰾儐繽檳殯臏鑌髕鬢稟餑鈸鵓鈽驂黲惻鍤儕釵囅諂讖蕆懺嬋驏覘禪鐔倀萇悵閶鯧硨傖諶櫬磣齔棖檉鋮鐺飭鴟銃儔幬讎芻絀躕釧愴綞鶉輟齪鶿蓯驄樅輳攛銼鹺噠韃駘紿殫賧癉簞讜碭襠燾鐙糴詆諦綈覿鏑巔鈿癲銚鯛鰈鋌銩崠鶇竇瀆櫝牘篤黷籪懟鐓燉躉鐸諤堊閼軛鋨鍔鶚顎顓鱷誒邇鉺鴯鮞鈁魴緋鐨鯡僨灃鳧駙紱紼賻麩鮒鰒釓賅尷搟紺戇睪誥縞鋯紇鎘潁亙賡綆鯁詬緱覯詁轂鈷錮鴣鵠鶻鴰摑詿摜鸛鰥獷匭劌媯檜鮭鱖袞緄鯀堝咼幗槨蟈鉿闞絎頡灝顥訶闔蠣黌訌葒閎鱟滸鶘驊樺鏵奐繯鍰鯇鰉詼薈噦澮繢琿暉諢餛閽鈥鑊訐詰薺嘰嚌驥璣覬齏磯羈蠆躋霽鱭鯽郟浹鋏鎵蟯諫縑戔戩瞼鶼筧鰹韉絳韁撟嶠鷦鮫癤頜鮚巹藎饉縉贐覲剄涇逕弳脛靚鬮鳩鷲詎屨櫸颶鉅鋦窶齟錈鐫雋譎玨皸剴塏愾愷鎧鍇龕閌鈧銬騍緙軻鈳錁頷齦鏗嚳鄶噲膾獪髖誆誑鄺壙纊貺匱蕢憒聵簣閫錕鯤蠐崍徠淶瀨賚睞錸癩籟嵐欖斕鑭襤閬鋃嘮嶗銠鐒癆鰳誄縲儷酈壢藶蒞蘺嚦邐驪縭櫪櫟轢礪鋰鸝癘糲躒靂鱺鱧蘞奩瀲璉殮褳襝鰱魎繚釕鷯藺廩檁轔躪綾欞蟶鯪瀏騮綹鎦鷚蘢瀧瓏櫳朧礱僂蔞嘍嶁鏤瘺耬螻髏壚擼嚕閭瀘淥櫨櫓轤輅轆氌臚鸕鷺艫鱸臠孌欒鸞鑾圇犖玀濼欏腡鏍櫚褸鋝嘸嘜嬤榪勱縵鏝顙鰻麼捫燜懣鍆羋謐獼禰澠靦黽緲繆閔緡謨驀饃歿鏌鉬鐃訥鈮鯢輦鯰蔦裊隉蘗囁顢躡苧嚀聹儂噥駑釹儺謳慪甌蹣皰轡紕羆鈹諞駢縹嬪釙鏷鐠蘄騏綺榿磧頎頏鰭僉蕁慳騫繾槧鈐嬙檣戧熗錆鏘鏹羥蹌誚譙蕎繰磽蹺愜鍥篋鋟撳鯖煢蛺巰賕蟣鰍詘嶇闃覷鴝詮綣輇銓闋闕愨蕘嬈橈飪軔嶸蠑縟銣顰蜆颯毿糝繅嗇銫穡鎩鯊釃訕姍騸釤鱔坰殤觴厙灄畬詵諗瀋謚塒蒔弒軾貰鈰鰣綬攄紓閂鑠廝駟緦鍶鷥藪餿颼鎪謖穌誶蓀猻嗩脧闥鉈鰨鈦鮐曇鉭錟頇儻餳鐋鏜韜鋱緹鵜闐糶齠鰷慟鈄釷摶飩籜鼉媧膃紈綰輞諉幃闈溈潿瑋韙煒鮪閿萵齷鄔廡憮嫵騖鵡鶩餼鬩璽覡硤莧薟蘚峴獫嫻鷴癇蠔秈躚薌餉驤緗饗嘵瀟驍綃梟簫褻擷紲纈陘滎饈鵂詡頊諼鉉鏇謔澩鱈塤潯鱘埡婭椏氬厴贗儼兗讞懨閆釅魘饜鼴煬軺鷂鰩靨謁鄴曄燁詒囈嶧飴懌驛縊軼貽釔鎰鐿瘞艤銦癮塋鶯縈鎣攖嚶瀅瀠瓔鸚癭頦罌鏞蕕銪魷傴俁諛諭蕷崳飫閾嫗紆覦歟鈺鵒鷸齬櫞鳶黿鉞鄆蕓惲慍紜韞殞氳瓚趲鏨駔賾嘖幘簀譖繒譫詔釗謫輒鷓湞縝楨軫賑禎鴆諍崢鉦錚箏騭櫛梔軹輊贄鷙螄縶躓躑觶鍾紂縐佇櫧銖囀饌顳騅縋諑鐲諮緇輜貲眥錙齜鯔傯諏騶鯫鏃纘躦鱒訁譾郤猛氹阪壟堖垵墊檾蕒葤蓧蒓菇槁摣咤唚哢噝噅撅劈謔襆嶴脊仿僥獁麅餘餷饊饢楞怵懍爿漵灩混濫瀦淡寧糸絝緔瑉梘棬案橰櫫軲軤賫膁腖飈糊煆溜湣渺碸滾瞘鈈鉕鋣銱鋥鋶鐦鐧鍩鍀鍃錇鎄鎇鎿鐝鑥鑹鑔穭鶓鶥鸌癧屙瘂臒襇繈耮顬蟎麯鮁鮃鮎鯗鯝鯴鱝鯿鰠鰵鱅鞽韝齇";
    }
    Settings.prototype.toJson = function () {
        return JSON.stringify(this);
    };
    Settings.prototype.fromJson = function (content) {
        var obj = JSON.parse(content);
        this.defaultChar = obj['defaultChar'];
    };
    return Settings;
}());

var MyPlugin = /** @class */ (function (_super) {
	var allText = "";
    var cursorPosition;
    __extends(MyPlugin, _super);
    function MyPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.settings = new Settings();
        _this.SETTINGS_PATH = '.obsidian/text.json';
        return _this;
    }
    MyPlugin.prototype.onload = function () {
    	return __awaiter(this, void 0, void 0,
        function() {
            var _this = this;
            return __generator(this,
            function(_a) {
		        console.log('加载插件');
		        _this.addCommand({
		            id: 'internal-link',
		            name: '[[链接]]语法',
		            callback: function () {	_this.转换内链();},
		            hotkeys: [{ modifiers: ["Alt"], key: "Z" } ]
		        });
                _this.addCommand({
		            id: 'internal-link2',
		            name: '[[链接|同名]]语法',
		            callback: function () {	_this.转换同义链接();},
		            hotkeys: [{ modifiers: ["Alt"], key: "Q" } ]
		        });
                _this.addCommand({
		            id: 'biaoti0-text',
		            name: '取消标题',
		            callback: function () {	_this.标题语法("");},
		            hotkeys: [{ modifiers: ["Mod"], key: "`" } ]
		        });
                _this.addCommand({
		            id: 'biaoti1-text',
		            name: 'H1标题',
		            callback: function () {	_this.标题语法("#");},
		            hotkeys: [{ modifiers: ["Mod"], key: "1" } ]
		        });
                _this.addCommand({
		            id: 'biaoti2-text',
		            name: 'H2标题',
		            callback: function () {	_this.标题语法("##");},
		            hotkeys: [{ modifiers: ["Mod"], key: "2" } ]
		        }); 
                _this.addCommand({
		            id: 'biaoti3-text',
		            name: 'H3标题',
		            callback: function () {	_this.标题语法("###");},
		            hotkeys: [{ modifiers: ["Mod"], key: "3" } ]
		        }); 
                _this.addCommand({
		            id: 'biaoti4-text',
		            name: 'H4标题',
		            callback: function () {	_this.标题语法("####");},
		            hotkeys: [{ modifiers: ["Mod"], key: "4" } ]
		        }); 
                _this.addCommand({
		            id: 'biaoti5-text',
		            name: 'H5标题',
		            callback: function () {	_this.标题语法("#####");},
		            hotkeys: [{ modifiers: ["Mod"], key: "5" } ]
		        }); 
                _this.addCommand({
		            id: 'biaoti6-text',
		            name: 'H6标题',
		            callback: function () {	_this.标题语法("######");},
		            hotkeys: [{ modifiers: ["Mod"], key: "6" } ]
		        });                  
                _this.addCommand({
		            id: 'cuti-text',
		            name: '**粗体**',
		            callback: function () {	_this.转换粗体();},
		            hotkeys: [{ modifiers: ["Alt"], key: "C" } ]
		        }); 
                _this.addCommand({
		            id: 'gaoliang-text',
		            name: '==高亮==',
		            callback: function () {	_this.转换高亮();},
		            hotkeys: [{ modifiers: ["Alt"], key: "G" } ]
		        });
                _this.addCommand({
		            id: 'xieti-text',
		            name: '_斜体_',
		            callback: function () {	_this.转换斜体();},
		            hotkeys: [{ modifiers: ["Alt"], key: "X" } ]
		        });
                _this.addCommand({
		            id: 'shanchu-text',
		            name: '~~删除线~~',
		            callback: function () {	_this.转换删除线();},
		            hotkeys: [{ modifiers: ["Alt"], key: "S" } ]
		        });
                _this.addCommand({
		            id: 'xiahua-text',
		            name: '_下划线_',
		            callback: function () {	_this.转换下划线();},
		            hotkeys: [{ modifiers: ["Alt"], key: "H" } ]
		        });
                _this.addCommand({
		            id: 'zhuozhong-text',
		            name: '`行内代码`',
		            callback: function () {	_this.转换行内代码();},
		            hotkeys: [{ modifiers: ["Alt"], key: "D" } ]
		        });     
                _this.addCommand({
		            id: 'add-daima',
		            name: '```代码块```',
		            callback: function () {	_this.转换代码块();},
		            hotkeys: [{ modifiers: ["Mod","Shift"], key: "m" } ]
		        });
                _this.addCommand({
		            id: 'add-langxian',
		            name: '~~~三浪线~~~',
		            callback: function () {	_this.转换三浪线();}
		        });
                _this.addCommand({
		            id: 'add-up',
		            name: '上标语法',
		            callback: function () {	_this.转换上标();},
		            hotkeys: [{ modifiers: ["Alt"], key: "U" } ]
		        });
                _this.addCommand({
		            id: 'add-ub',
		            name: '下标语法',
		            callback: function () {	_this.转换下标();},
		            hotkeys: [{ modifiers: ["Alt"], key: "N" } ]
		        });
                _this.addCommand({
		            id: 'add-todo',
		            name: '转换待办状态',
		            callback: function () {	_this.转换待办列表();}
		        });

                _this.addCommand({
		            id: 'text-Color1',
		            name: '转换红色文字',
		            callback: function () {	_this.转换文字颜色("#ff0000");},
		            hotkeys: [{ modifiers: ["Mod","Shift"], key: "1" } ]
		        });
                _this.addCommand({
		            id: 'text-Color2',
		            name: '转换橙色文字',
		            callback: function () {	_this.转换文字颜色("#ff9900");},
		            hotkeys: [{ modifiers: ["Mod","Shift"], key: "2" } ]
		        });
                _this.addCommand({
		            id: 'text-Color3',
		            name: '转换黄色文字',
		            callback: function () {	_this.转换文字颜色("#ffff00");},
		            hotkeys: [{ modifiers: ["Mod","Shift"], key: "3" } ]
		        });
                _this.addCommand({
		            id: 'text-Color4',
		            name: '转换绿色文字',
		            callback: function () {	_this.转换文字颜色("#00ff00");},
		            hotkeys: [{ modifiers: ["Mod","Shift"], key: "4" } ]
		        });
                _this.addCommand({
		            id: 'text-Color5',
		            name: '转换青色文字',
		            callback: function () {	_this.转换文字颜色("#00ffff");},
		            hotkeys: [{ modifiers: ["Mod","Shift"], key: "5" } ]
		        });
                _this.addCommand({
		            id: 'text-Color6',
		            name: '转换蓝色文字',
		            callback: function () {	_this.转换文字颜色("#0000ff");},
		            hotkeys: [{ modifiers: ["Mod","Shift"], key: "6" } ]
		        });
                _this.addCommand({
		            id: 'text-Color7',
		            name: '转换紫色文字',
		            callback: function () {	_this.转换文字颜色("#ff00ff");},
		            hotkeys: [{ modifiers: ["Mod","Shift"], key: "7" } ]
		        });


                _this.addCommand({
		            id: 'text-background1',
		            name: '转换红色背景',
		            callback: function () {	_this.转换背景颜色("#ff0000");},
		            hotkeys: [{ modifiers: ["Mod","Alt"], key: "1" } ]
		        });
                _this.addCommand({
		            id: 'text-background2',
		            name: '转换橙色背景',
		            callback: function () {	_this.转换背景颜色("#ff9900");},
		            hotkeys: [{ modifiers: ["Mod","Alt"], key: "2" } ]
		        });
                _this.addCommand({
		            id: 'text-background3',
		            name: '转换黄色背景',
		            callback: function () {	_this.转换背景颜色("#ffff00");},
		            hotkeys: [{ modifiers: ["Mod","Alt"], key: "3" } ]
		        });
                _this.addCommand({
		            id: 'text-background4',
		            name: '转换绿色背景',
		            callback: function () {	_this.转换背景颜色("#00ff00");},
		            hotkeys: [{ modifiers: ["Mod","Alt"], key: "4" } ]
		        });
                _this.addCommand({
		            id: 'text-background5',
		            name: '转换青色背景',
		            callback: function () {	_this.转换背景颜色("#00ffff");},
		            hotkeys: [{ modifiers: ["Mod","Alt"], key: "5" } ]
		        });
                _this.addCommand({
		            id: 'text-background6',
		            name: '转换蓝色背景',
		            callback: function () {	_this.转换背景颜色("#0000ff");},
		            hotkeys: [{ modifiers: ["Mod","Alt"], key: "6" } ]
		        });
                _this.addCommand({
		            id: 'text-background7',
		            name: '转换紫色背景',
		            callback: function () {	_this.转换背景颜色("#ff00ff");},
		            hotkeys: [{ modifiers: ["Mod","Alt"], key: "7" } ]
		        });
                _this.addCommand({
		            id: 'common-text',
		            name: '转换无语法文本',
		            callback: function () {	_this.转换无语法文本();},
		            hotkeys: [{ modifiers: ["Mod","Alt"],key: "Z"}]
		        });
                _this.addCommand({
		            id: 'copy-text',
		            name: '获取无语法文本',
		            callback: function () {	_this.获取无语法文本();},
		            hotkeys: [{ modifiers: ["Mod","Alt"],key: "C"}]
		        });

                _this.addCommand({
		            id: 'add-kh1',
		            name: '【选文】',
		            callback: function () {	_this.括选文本1();},
		        });
                _this.addCommand({
		            id: 'add-kh2',
		            name: '（选文）',
		            callback: function () {	_this.括选文本2();},
		        });
                _this.addCommand({
		            id: 'add-kh3',
		            name: '「选文」',
		            callback: function () {	_this.括选文本3();},
		        });
                _this.addCommand({
		            id: 'add-kh4',
		            name: '《选文》',
		            callback: function () {	_this.括选文本4();},
		        });
                _this.addCommand({
		            id: 'auto-texts',
		            name: '自动设置标题',
		            callback: function() { _this.自动设置标题(); },
		            hotkeys: [{ modifiers: ["Mod","Shift","Alt"], key: "T" } ]    
		        });
                _this.addCommand({
		            id: 'ying-zhong',
		            name: '英转中文标点',
		            callback: function() { _this.英转中文标点(); },
		            hotkeys: [{ modifiers: ["Mod","Shift","Alt"], key: "Z" } ]
		        });
                _this.addCommand({
		            id: 'zhong-ying',
		            name: '中转英文标点',
		            callback: function() { _this.中转英文标点(); },
		            hotkeys: [{ modifiers: ["Mod","Shift","Alt"], key: "Y" } ]
		        });
                _this.addCommand({
		            id: 'file-path',
		            name: '转换路径',
		            callback: function() { _this.转换路径(); },
		            hotkeys: [{ modifiers: ["Shift","Alt"], key: "F" } ]
		        });
                _this.addCommand({
		            id: 'jian-fan',
		            name: '简体转繁',
		            callback: function() { _this.简体转繁(); }
		        });
                _this.addCommand({
		            id: 'fan-jian',
		            name: '繁体转简',
		            callback: function() { _this.繁体转简(); }
		        });

                _this.addCommand({
		            id: 'paste-form',
		            name: '粘贴表格',
		            callback: function() { _this.粘贴表格(); },
		            hotkeys: [{ modifiers: ["Mod","Alt"], key: "V" } ]
		        });
                _this.addCommand({
		            id: 'edit-jiucuo',
		            name: '修复错误语法',
		            callback: function() { _this.修复错误语法(); },
		            hotkeys: [{ modifiers: ["Mod","Shift"], key: "J" } ]    
		        });
                _this.addCommand({
		            id: 'del-line2',
		            name: '修复意外断行',
		            callback: function() { _this.修复意外断行(); },
		            hotkeys: [{ modifiers: ["Mod","Alt"], key: "D" } ]
		        });
                _this.addCommand({
		            id: 'search-text',
		            name: '搜索当前文本',
		            callback: function() { _this.搜索当前文本(); }
		        });
                /*_this.addCommand({
		            id: 'next-mdfile',
		            name: '同目录下一笔记',
		            callback: function() { _this.同目录下一笔记(); },
		            hotkeys: [{ modifiers: ["Mod","Shift","Alt"], key: "N" } ]
		        });
                _this.addCommand({
		            id: 'view-time',
		            name: '获取时间信息',
		            callback: function () {	_this.获取时间信息();},
		            hotkeys: [{ modifiers: ["Mod","Shift"],key: "T"}]
		        }); */
                _this.addCommand({
		            id: 'tiqu-text',
		            name: '获取标注文本',
		            callback: function () {	_this.获取标注文本();},
		            hotkeys: [{ modifiers: ["Mod","Shift"],key: "B"}]
		        });
                _this.addCommand({
		            id: 'copy-filePath',
		            name: '获取相对路径',
		            callback: function() { _this.获取相对路径(); }  
		        });
		        _this.addCommand({
		            id: 'add-lines',
		            name: '批量插入空行',
		            callback: function() { _this.批量插入空行(); },
		            hotkeys: [{ modifiers: ["Mod","Shift"], key: "L" } ]    
		        });
                _this.addCommand({
		            id: 'add-line1',
		            name: '上方插入空行',
		            callback: function() { _this.上方插入空行(); },
		            hotkeys: [{ modifiers: ["Shift","Alt"], key: "o" } ]    
		        });
                _this.addCommand({
		            id: 'add-line2',
		            name: '下方插入空行',
		            callback: function() { _this.下方插入空行(); },
		            hotkeys: [{ modifiers: ["Shift","Alt"], key: "l" } ]    
		        });
		        _this.addCommand({
		            id: 'del-lines',
		            name: '批量去除空行',
		            callback: function() { _this.批量去除空行(); },
		            hotkeys: [{ modifiers: ["Mod","Alt"], key: "l" } ]
		        });
                _this.addCommand({
		            id: 'add-space',
		            name: '末尾追加空格',
		            callback: function() { _this.末尾追加空格(); },
		            hotkeys: [{ modifiers: ["Mod","Shift"], key: "K" } ]    
		        });
		        _this.addCommand({
		            id: 'del-space',
		            name: '去除末尾空格',
		            callback: function() { _this.去除末尾空格(); },
		            hotkeys: [{ modifiers: ["Mod","Alt"], key: "K" } ]
		        });
                _this.addCommand({
		            id: 'add-allSpspace',
		            name: '添加中英间隔',
		            callback: function() { _this.添加中英间隔(); }
		        });
                _this.addCommand({
		            id: 'del-allSpspace',
		            name: '去除所有空格',
		            callback: function() { _this.去除所有空格(); }
		        });

                _this.addSettingTab(new SettingsTab(_this.app, _this));
		        _this.loadSettings();
                return [2];
             });
        });
    };
    MyPlugin.prototype.onunload = function () {
        console.log('卸载插件');
    };
    MyPlugin.prototype.saveSettings = function () {
        /* var _this = this;
        var settings = _this.settings.toJson();
        _this.app.vault.adapter.write(_this.SETTINGS_PATH, settings); */
    };
    MyPlugin.prototype.loadSettings = function () {
    	console.log("加载插件");
        /* var _this = this;
        _this.app.vault.adapter.read(_this.SETTINGS_PATH).
            then(function (content) { return _this.settings.fromJson(content); }).
            catch(function (error) { console.log("未找到设置文件。"); }); */
    };

    MyPlugin.prototype.获取相对路径 = function () {
        var activeFile = this.app.workspace.getActiveFile();
        var noteFilePath = activeFile.path;
        navigator.clipboard.writeText(noteFilePath)
        new obsidian.Notice("已获取当前笔记的相对路径！");
    };

    MyPlugin.prototype.转换内链 = function() {
    	var _defaultChar = this.settings.defaultChar;
        var lines = this.获取所选文本 (this.获取编辑模式 ());
        if (!lines) {
        	this.替换所选文本 (this.获取编辑模式 (), "[[");
        	return;
        }
        var link = /[\"\|\[\]\?\\\*\<\>\/:]/g;	//是否包含[]()及标点符号
        var link0 = /\[\[|\]\]/g;
        var link1 = /^([^\[\]]*)!\[+([^\[\]]*)$|^([^\[\]]*)\[+([^\[\]]*)$|^([^\[\]]*)\]+([^\[\]]*)$|^([^\[\]]*)\[([^\[\]]*)\]([^\[\]]*)$/g;	//是否只包含一侧的[[或]]
  		var link2 = /^[^\[\]]*(\[\[[^\[\]]*\]\][^\[\]]*)+$/g;	//是否包含N组成对的内链语法
  		var link4 = /([^\[\]\(\)\r\n]*)(\n*)(http.*)/mg;	//是否包含 说明文本&网址
	  	var link5 = /!?\[([^\[\]\r\n]*)(\n*)\]\((http[^\(\)]*)\)/mg;	//是否包含 [说明文本](网址)
  		var link8 = /([\n、;])/g;
	  	if (link.test(lines)) {
	  		if (link1.test(lines)){
                new obsidian.Notice("划选内容不符合内链语法格式！");
	  			return;
	  		}else if (link2.test(lines)){
                //new obsidian.Notice("划选内容包含内链语法格式！");
	  			lines = lines.replace(/(\[\[(.*\|)*)/g,"");
                  lines = lines.replace(/\]\]/g,"");
	  		}else if(link5.test(lines)){
	  			lines = lines.replace(link5,"$1$3");
                new obsidian.Notice("划选内容包含有[]()链接语法！");
	  		}else if(link4.test(lines)){
	  			lines = lines.replace(link4,"[$1]($3)");
	  			lines = lines.replace("[\r\n]","");
                 new obsidian.Notice("划选内容包含有说明文本和网址！");
	  		}else{
                new obsidian.Notice("文件名不能包含下列字符:\*\"\\\/\<\>\:\|\?");
                return;
            }
		}else{
			if (link8.test(lines)){
				lines = lines.replace(link8, "]]$1[[");
			}
			lines = "[[" + lines + "]]";
		}
        this.替换所选文本 (this.获取编辑模式 (), lines);        
    };

    MyPlugin.prototype.转换同义链接 = function() {
    	var _defaultChar = this.settings.defaultChar;
        var lines = this.获取所选文本 (this.获取编辑模式 ());
        var lNum = lines.length +3
        if (!lines) {
        	this.替换所选文本 (this.获取编辑模式 (), "[[");
        	return;
        }
        var link = /[\"\|\[\]\?\\\*\<\>\/:\n]/g;	//是否包含[]()及标点符号
  	  	if (link.test(lines)) {
            return;
		}else{
			lines = "[[|" + lines + "]]";
		}
        this.替换所选文本 (this.获取编辑模式 (), lines);
        var cmEditor = this.获取编辑模式 ();
        var i=0;
        while (i<lNum){
            cmEditor.execCommand('goColumnLeft');
            i++;
        }
    };

    MyPlugin.prototype.转换粗体 = function() {
        var lines = this.获取所选文本 (this.获取编辑模式 ());
        var link = /\*\*[^\*]*\*\*/;	//是否包含高亮符号
        var link1 = /^[^\*]*\*\*[^\*]*$/;	//是否只包含一侧的**
        if (link1.test(lines)){
            return; //new obsidian.Notice("只有一侧出现==符号");
        }else if (link.test(lines)){
            lines = lines.replace(/\*\*/g,"");    //new obsidian.Notice("成对出现**符号");
        }else{
            lines = lines.replace(/^(.*)$/mg,"**$1**");
            lines = lines.replace(/^\*\*\*\*$/mg,"");
        }
        this.替换所选文本 (this.获取编辑模式 (), lines);
        var cmEditor = this.获取编辑模式 ();
        cmEditor.execCommand('goColumnLeft');
        cmEditor.execCommand('goColumnLeft');
    };
    MyPlugin.prototype.转换高亮 = function() {
        var lines = this.获取所选文本 (this.获取编辑模式 ());
        var link = /==[^=]*==/;	//是否包含高亮符号
        var link1 = /^[^=]*==[^=]*$/;	//是否只包含一侧的==
        if (link1.test(lines)){
            return; //new obsidian.Notice("只有一侧出现==符号");
        }else if (link.test(lines)){
            lines = lines.replace(/==/g,"");    //new obsidian.Notice("成对出现==符号");
        }else{
            lines = lines.replace(/^(.*)$/mg,"==$1==");
            lines = lines.replace(/^====$/mg,"");
        }
        this.替换所选文本 (this.获取编辑模式 (), lines);
        var cmEditor = this.获取编辑模式 ();
        cmEditor.execCommand('goColumnLeft');
        cmEditor.execCommand('goColumnLeft');
    };
    MyPlugin.prototype.转换斜体 = function() {
        var lines = this.获取所选文本 (this.获取编辑模式 ());
        var link = /_[^_]*_/;	//是否包含高亮符号
        var link1 = /^[^_]*_[^_]*$/;	//是否只包含一侧的_
        if (link1.test(lines)){
            return; //new obsidian.Notice("只有一侧出现_符号");
        }else if (link.test(lines)){
            lines = lines.replace(/_/g,"");    //new obsidian.Notice("成对出现_符号");
        }else{
            lines = lines.replace(/^(.*)$/mg,"_$1_");
            lines = lines.replace(/^__$/mg,"");
        }
        this.替换所选文本 (this.获取编辑模式 (), lines);
        var cmEditor = this.获取编辑模式 ();
        cmEditor.execCommand('goColumnLeft');
    };
    MyPlugin.prototype.转换删除线 = function() {
        var lines = this.获取所选文本 (this.获取编辑模式 ());
        var link = /~~[^~]*~~/;	//是否包含删除线符号
        var link1 = /^[^~]*~~[^~]*$/;	//是否只包含一侧的~~
        if (link1.test(lines)){
            return; //new obsidian.Notice("只有一侧出现~~符号");
        }else if (link.test(lines)){
            lines = lines.replace(/~~/g,"");    //new obsidian.Notice("成对出现~~符号");
        }else{
            lines = lines.replace(/^(.*)$/mg,"~~$1~~");
            lines = lines.replace(/^~~~~$/mg,"");
        }
        this.替换所选文本 (this.获取编辑模式 (), lines);
        var cmEditor = this.获取编辑模式 ();
        cmEditor.execCommand('goColumnLeft');
        cmEditor.execCommand('goColumnLeft');
    };
    MyPlugin.prototype.转换下划线 = function() {
        var lines = this.获取所选文本 (this.获取编辑模式 ());
        var link = /\<u\>([^\<\>]*)\<\/u\>/mg;	//是否包含下划符号
        var link1 = /^[^\<\>]*\<\/?u\>[^\<\>]*$/;	//是否只包含一侧的<>
        if (link1.test(lines)){
            return; //new obsidian.Notice("只有一侧出现<>符号");
        }else if (link.test(lines)){
            lines = lines.replace(link,"$1");
        }else{
            lines = lines.replace(/^(.*)$/mg,"<u>$1</u>");
            lines = lines.replace(/^\<u\>\<\/u\>$/mg,"");
        }
        this.替换所选文本 (this.获取编辑模式 (), lines);
    };
    MyPlugin.prototype.转换行内代码 = function() {
        var lines = this.获取所选文本 (this.获取编辑模式 ());
        var link = /`[^`]*`/;	//是否包含代码行符号
        var link1 = /^[^`]*`[^`]*$/;	//是否只包含一侧的`

        if (link1.test(lines)){
            //new obsidian.Notice("只有一侧出现`符号");
            return;
        }else if (link.test(lines)){
            //new obsidian.Notice("成对出现`符号");
            lines = lines.replace(/`/g,"");
        }else{
            //new obsidian.Notice("需要补充`符号");
            lines = lines.replace(/^(.*)$/mg,"`$1`");
        }
        this.替换所选文本 (this.获取编辑模式 (), lines);
    };

    MyPlugin.prototype.转换代码块 = function() {
        var lines = this.获取所选文本 (this.获取编辑模式 ());
        var link = /```[^`]+```/;	//是否包含代码行符号
        var link1 = /^[^`]*```[^`]*$/m;	//是否只包含一侧的`

        lines = lines.replace(/\n/g,"↫");
        if (link1.test(lines)){
            //new obsidian.Notice("只有一侧出现```符号");
            return;
        }else if (link.test(lines)){
            //new obsidian.Notice("成对出现```符号");
            lines = lines.replace(/```↫?|↫?```/g,"");
        }else{
            //new obsidian.Notice("需要补充```符号");
            lines = lines.replace(/^(.*)$/m,"```$1↫```");
        }
        lines = lines.replace(/↫/g,"\n");
        this.替换所选文本 (this.获取编辑模式 (), lines);
        var cmEditor = this.获取编辑模式 ();
        cmEditor.execCommand('goLineUp');
        cmEditor.execCommand('goLineEnd');
    };

    MyPlugin.prototype.转换三浪线 = function() {
        var lines = this.获取所选文本 (this.获取编辑模式 ());
        var link = /~~~[^~]+~~~/;	//是否包含代码行符号
        var link1 = /^[^~]*~~~[^~]*$/m;	//是否只包含一侧的~

        lines = lines.replace(/\n/g,"↫");
        if (link1.test(lines)){
            //new obsidian.Notice("只有一侧出现~~~符号");
            return;
        }else if (link.test(lines)){
            //new obsidian.Notice("成对出现~~~符号");
            lines = lines.replace(/~~~↫?|↫?~~~/g,"");
        }else{
            //new obsidian.Notice("需要补充~~~符号");
            lines = lines.replace(/^(.*)$/m,"~~~↫$1↫~~~");
        }
        lines = lines.replace(/↫/g,"\n");
        this.替换所选文本 (this.获取编辑模式 (), lines);
        var cmEditor = this.获取编辑模式 ();
        cmEditor.execCommand('goLineUp');
        cmEditor.execCommand('goLineEnd');
    };

    MyPlugin.prototype.转换上标 = function() {
        var lines = this.获取所选文本 (this.获取编辑模式 ());
        var link = /\<sup\>[^\<\>]*\<\/sup\>/g;	//是否包含<sup>下标</sup>
        var link1 = /\<sup\>[^\<\>\/]*$|^[^\<\>]*\<\/sup\>/g;	//是否只包含一侧的<sup>下标</sup>

        if (link1.test(lines)){
            //new obsidian.Notice("只有一侧出现<sup>下标</sup>符号");
            return;
        }else if (link.test(lines)){
            lines = lines.replace(/(\<sup\>|\<\/sup\>)/g,"");
        }else{
            lines = lines.replace(/^(.+)$/mg,"\<sup\>$1\<\/sup\>");
            lines = lines.replace(/^\<sup\>\s*\<\/sup\>$/mg,"");
        }
        this.替换所选文本 (this.获取编辑模式 (), lines);
    };

    MyPlugin.prototype.转换下标 = function() {
        var lines = this.获取所选文本 (this.获取编辑模式 ());
        var link = /\<sub\>[^\<\>]*\<\/sub\>/g;	//是否包含<sub>下标</sub>
        var link1 = /\<sub\>[^\<\>\/]*$|^[^\<\>]*\<\/sub\>/g;	//是否只包含一侧的<sub>下标</sub>

        if (link1.test(lines)){
            return;
        }else if (link.test(lines)){
            lines = lines.replace(/(\<sub\>|\<\/sub\>)/g,"");
        }else{
            lines = lines.replace(/^(.+)$/mg,"\<sub\>$1\<\/sub\>");
            lines = lines.replace(/^\<sub\>\s*\<\/sub\>$/mg,"");
        }
        this.替换所选文本 (this.获取编辑模式 (), lines);
    };

    MyPlugin.prototype.标题语法 = function(_str) {
        var link = eval("/^"+_str+" ([^#]+)/mg");	//是否包含几个#符号
        var mdView = this.app.workspace.activeLeaf.view;
        if (mdView.sourceMode == undefined)
            return false;
        var editor = mdView.sourceMode.cmEditor;
        var doc = editor.getDoc();
        var cursorline = editor.getCursor().line;
        var line0 = editor.getLine(cursorline);

        if (link.test(line0)){
            var line1 = line0.replace(link,"$1");
        }else{
            var line1 = line0.replace(/^#+[ ]+/m,"");
            if(_str==""){
                line1 = _str+" "
            }else{
                line1 = line1.replace(/^/m,_str+" ");
            }
        }
        //new obsidian.Notice(line1);
        doc.replaceRange(line1, {line:cursorline,ch:0},{line:cursorline,ch:line0.length});
        /*
        if(line1.length>line0.length){
            doc.replaceRange(line1, {line:cursorline,ch:0},{line:cursorline,ch:line1.length});
        }else{
        }*/
    };

    MyPlugin.prototype.转换文字颜色 = function(_color) {
        var lines = this.获取所选文本 (this.获取编辑模式 ());
        var _html0 = /\<span style=[\"'][^\<\>]*color:[0-9a-zA-Z#]+[\"'][^\<\>]*\>[^\<\>]+\<\/span\>/g;
        var _html1 = /^\<span style=[\"'][^\<\>]*color:[0-9a-zA-Z#]+[\"'][^\<\>]*\>([^\<\>]+)\<\/span\>$/;
        var _html2 = '\<span style=\"color:'+_color+'\"\>$1\<\/span\>';
        var _html3 = /\<span style=[^\<]*$|^[^\>]*span\>/g;	//是否只包含一侧的<>
        //new obsidian.Notice(lines);

        if (_html3.test(lines)){
            return; //new obsidian.Notice("不能转换颜色！");
        }else if (_html0.test(lines)){
            if(_html1.test(lines)){
                //new obsidian.Notice("替换颜色！");
                lines = lines.replace(_html1,_html2);
            }else{
                lines = lines.replace(/\<span style=[\"'][^\<\>]*color:[0-9a-zA-Z#]+[\"'][^\<\>]*?\>|\<\/span\>/g,""); 
            }
        }else{
            lines = lines.replace(/^(.+)$/mg,_html2);  //new obsidian.Notice("可以转换颜色！");
        }
        this.替换所选文本 (this.获取编辑模式 (), lines);
    };

    MyPlugin.prototype.转换背景颜色 = function(_color) {
        var lines = this.获取所选文本 (this.获取编辑模式 ());
        var _html0 = /\<span style=[\"'][^\<\>]*color:[0-9a-zA-Z#]+[\"'][^\<\>]*\>[^\<\>]+\<\/span\>/g;
        var _html1 = /^\<span style=[\"'][^\<\>]*color:[0-9a-zA-Z#]+[\"'][^\<\>]*\>([^\<\>]+)\<\/span\>$/;
        var _html2 = '\<span style=\"background\-color:'+_color+'\"\>$1\<\/span\>';
        var _html3 = /\<span style=[^\<]*$|^[^\>]*span\>/g;	//是否只包含一侧的<>
        //new obsidian.Notice(lines);

        if (_html3.test(lines)){
            return; //new obsidian.Notice("不能转换颜色！");
        }else if (_html0.test(lines)){
            if(_html1.test(lines)){
                lines = lines.replace(_html1,_html2); 
            }else{
                lines = lines.replace(/\<span style=[\"'][^\<\>]*color:[0-9a-zA-Z#]+[\"'][^\<\>]*\>|\<\/span\>/g,"");
                //new obsidian.Notice("需要去除颜色！");
            }
        }else{
            lines = lines.replace(/^(.+)$/mg,_html2);  //new obsidian.Notice("可以转换颜色！");
        }
        this.替换所选文本 (this.获取编辑模式 (), lines);
    };
    
    MyPlugin.prototype.转换无语法文本 = function() {
        //this.指定编辑模式();
        var selection = this.获取所选文本 (this.获取编辑模式 ());
        var mdText = /(^#+\s|(?<=^|\s*)#|^>|^\- \[( |x)\]|^\+ |<[^<>]+>|^1\. |^\s*\- |^\-+$|^\*+$)/mg;
        if(selection == ""){
            new obsidian.Notice("请先划选部分文本，再执行命令！");
        }else{
            selection = selection.replace(mdText,"");
            selection = selection.replace(/^[ ]+|[ ]+$/mg,"");
            selection = selection.replace(/\!?\[\[([^\(\)\[\]]+)\]\]/g,"$1");
            selection = selection.replace(/\!?\[+([^\[\]\(\)]+)\]+\(([^\(\)]+)\)/g,"$1");
            selection = selection.replace(/`([^`]+)`/g,"$1");
            selection = selection.replace(/_([^_]+)_/g,"$1");
            selection = selection.replace(/==([^=]+)==/g,"$1");
            selection = selection.replace(/\*\*([^\*]+)\*\*/g,"$1");
            selection = selection.replace(/~~([^~]+)~~/g,"$1");
            selection = selection.replace(/(\r*\n)+/mg,"\r\n");
            this.替换所选文本 (this.获取编辑模式 (), selection);
        }
    };

    MyPlugin.prototype.括选文本1 = function() {
        var lines = this.获取所选文本 (this.获取编辑模式 ());
        var link = /.*【[^【】]+】.*/g;	//是否包含【】
        var link1 = /【[^【】]*$|^[^【】]*】/g;	//是否只包含一侧的【】

        if (link1.test(lines)){
            return;
        }else if (link.test(lines)){
            lines = lines.replace(/[【】]/g,"");
        }else{
            lines = lines.replace(/^(.+)$/mg,"【$1】");
            lines = lines.replace(/^【\s*】$/mg,"");
        }
        this.替换所选文本 (this.获取编辑模式 (), lines);
    };

    MyPlugin.prototype.括选文本2 = function() {
        var lines = this.获取所选文本 (this.获取编辑模式 ());
        var link = /.*（[^（）]*）.*/g;	//是否包含【】
        var link1 = /（[^（）]*$|^[^（）]*）/g;	//是否只包含一侧的【】

        if (link1.test(lines)){
            return;
        }else if (link.test(lines)){
            lines = lines.replace(/[（）]/g,"");
        }else{
            lines = lines.replace(/^(.+)$/mg,"($1)");
            lines = lines.replace(/^(\s*)$/mg,"");
        }
        this.替换所选文本 (this.获取编辑模式 (), lines);
    };

    MyPlugin.prototype.括选文本3 = function() {
        var lines = this.获取所选文本 (this.获取编辑模式 ());
        var link = /.*「[^「」]*」.*/g;	//是否包含「」
        var link1 = /「[^「」]*$|^[^「」]*」/g;	//是否只包含一侧的「

        if (link1.test(lines)){
            return;
        }else if (link.test(lines)){
            lines = lines.replace(/[「」]/g,"");
        }else{
            lines = lines.replace(/^(.+)$/mg,"「$1」");
            lines = lines.replace(/^「\s*」$/mg,"");
        }
        this.替换所选文本 (this.获取编辑模式 (), lines);
    };

    MyPlugin.prototype.括选文本4 = function() {
        var lines = this.获取所选文本 (this.获取编辑模式 ());
        var link = /.*《[^《》]*》.*/;	//是否包含《》
        var link1 = /《[^《》]*$|^[^《》]*》/;	//是否只包含一侧的《

        if (link1.test(lines)){
            return;
        }else if (link.test(lines)){
            lines = lines.replace(/[《》]/g,"");
        }else{
            lines = lines.replace(/^(.+)$/mg,"《$1》");
            lines = lines.replace(/^《\s*》$/mg,"");
        }
        this.替换所选文本 (this.获取编辑模式 (), lines);
    };


    MyPlugin.prototype.转换有序列表 = function() {
        var lines = this.获取所选文本 (this.获取编辑模式 ());

        var link = /^[0-9]\.\s.*/;	//是否包含有序符号
        var link1 = /(^[0-9]\.\s)(?=[^\s])/mg;	//选中n. 前缀
        var link2 = /(^[\-\+]\s)(?=[^\s])/mg;	//选中-. 前缀

        if (link.test(lines)){
            //new obsidian.Notice("包含有序符号");
            lines = lines.replace(link1,"");
        }else{
            //new obsidian.Notice("需要补充有序符号");
            lines = lines.replace(link2,"");
            lines = lines.replace(/^(?=[^\n\r])/mg,"1. ");
        }
        this.替换所选文本 (this.获取编辑模式 (), lines);
    };

    MyPlugin.prototype.转换待办列表 = function() {
        var lines = this.获取所选文本 (this.获取编辑模式 ());
        lines = lines.replace(/(?<=^\s*([\-\+]|[0-9]+\.)\s\[) (?=\]\s[^\s])/mg,"x☀");
        lines = lines.replace(/(?<=^\s*([\-\+]|[0-9]+\.)\s\[)x(?=\]\s[^\s])/mg,"-☀");
        lines = lines.replace(/(?<=^\s*([\-\+]|[0-9]+\.)\s\[)\-(?=\]\s[^\s])/mg,"!☀");
        lines = lines.replace(/(?<=^\s*([\-\+]|[0-9]+\.)\s\[)\!(?=\]\s[^\s])/mg,"?☀");
        lines = lines.replace(/(?<=^\s*([\-\+]|[0-9]+\.)\s\[)\?(?=\]\s[^\s])/mg,">☀");
        lines = lines.replace(/(?<=^\s*([\-\+]|[0-9]+\.)\s\[)\>(?=\]\s[^\s])/mg,"<☀");
        lines = lines.replace(/(?<=^\s*([\-\+]|[0-9]+\.)\s\[)\<(?=\]\s[^\s])/mg,"+☀");
        lines = lines.replace(/(?<=^\s*([\-\+]|[0-9]+\.)\s\[)\+(?=\]\s[^\s])/mg," ☀");
        lines = lines.replace(/(?<=^\s*([\-\+]|[0-9]+\.)\s\[[\sx\-\+\?\!\<\>])☀(?=\]\s[^\s])/mg,"");
        this.替换所选文本 (this.获取编辑模式 (), lines);
    };

    MyPlugin.prototype.自动设置标题 = function() {
		var lines = this.获取笔记全文 (this.获取编辑模式 ());
        if (!lines) return;
        lines = lines.replace(/\r?\n/g,"↫");
        lines = lines.replace(/↫\s*↫/g,"↫↫");
        lines = lines.replace(/\s*(?=↫)/g,"");
        lines = lines.replace(/(?<=^|↫)([^#`\[\]\(\)↫]{3,}[^\.\?\!:,0-9，：。？！）↫])(?=↫|$)/g,"↫### $1↫");
        lines = lines.replace(/#+([^#↫]+)↫*$/mg,"$1");    //取消末行标题
        lines = lines.replace(/↫{3,}/g,"\r\n\r\n");
        lines = lines.replace(/↫/g,"\r\n");
        this.替换笔记全文 (this.获取编辑模式 (), lines);
    };

    MyPlugin.prototype.粘贴表格 = function() {
    	let leaf = this.app.workspace.activeLeaf;
    	var xlsText = ""
    	var 分隔行 = ""
        const mdView = leaf.view;
        //获取 当前窗口  //其中const是【常数】
        if (mdView.sourceMode == undefined)
            return false;
        const doc = mdView.sourceMode.cmEditor;
        //获取 编辑模式
        let editor = doc;
        var selection = editor.getSelection();
        navigator.clipboard.readText()
		.then(xlsText => {
			xlsText = xlsText.replace(/\n/g,"■");
			xlsText = xlsText.replace(/\"([^■\|\"]+)■([^\|\n\"]+)\"/g,"$1<br>$2");
			分隔行 = xlsText.replace(/■.*/g,"");
			//new obsidian.Notice("分隔行　"+ 分隔行);
			分隔行 = 分隔行.replace(/\t/g,"|");
			分隔行 = 分隔行.replace(/([^\|]*)/g,"--");
			xlsText = xlsText.replace(/\t/g,"\|");
			xlsText = xlsText.replace(/^([^■]+)/,"$1■"+分隔行);
			xlsText = xlsText.replace(/■/g,"\n");
            xlsText = xlsText.replace(/^\|/mg,"　\|");
            xlsText = xlsText.replace(/\|$/mg,"\|　");
            xlsText = xlsText.replace(/^(?=[^\r\n])|(?<=[^\r\n])$/mg,"\|");
            xlsText = xlsText.replace(/(?<=\|)(?=\|)/g,"　");
			//navigator.clipboard.writeText(xlsText)
			editor.replaceSelection(xlsText);
			//将当前光标位置替换为处理后的md语法表格数据
			//mdView.setMode(mdView.previewMode)
		})
		.catch(err => {
			console.error('Failed to read clipboard contents: ', err);
		});
    }
    
    MyPlugin.prototype.获取标注文本 = function() {
        var lines = this.获取笔记全文 (this.获取编辑模式 ());
        if (!lines) return;
        //new obsidian.Notice(lines);
        var tmp = lines.replace(/^(?!#+ |#注释|#标注|#批注|#反思|#备注|.*==|.*%%).*$|^[^#\n%=]*(==|%%)|(==|%%)[^\n%=]*$|(==|%%)[^\n%=]*(==|%%)/mg,"\n");
        tmp = tmp.replace(/[\r\n|\n]+/g,"\n")
        
        new obsidian.Notice("已成功获取，请粘贴！");
        navigator.clipboard.writeText(tmp);
    };

    MyPlugin.prototype.获取无语法文本 = function() {
        //this.指定编辑模式();
        var selection = this.获取所选文本 (this.获取编辑模式 ());
        var mdText = /(^#+\s|(?<=^|\s*)#|^>|^\- \[( |x)\]|^\+ |<[^<>]+>|^1\. |^\-+$|^\*+$|==|\*+|~~|```|!*\[\[|\]\])/mg;
        if(selection == ""){
            new obsidian.Notice("请先划选部分文本，再执行命令！");
        }else{
            selection = selection.replace(/\[([^\[\]]*)\]\([^\(\)]+\)/img,"$1");
            selection = selection.replace(mdText,"");
            selection = selection.replace(/^[ ]+|[ ]+$/mg,"");
            selection = selection.replace(/(\r\n|\n)+/mg,"\n");
            new obsidian.Notice("无语法文本 已成功获取，请粘贴！");
            navigator.clipboard.writeText(selection);
        }
    };

    MyPlugin.prototype.获取时间信息 = function() {
        var mdView = this.app.workspace.activeLeaf.view;
        if (mdView.sourceMode == undefined)
            return false;
        var editor = mdView.sourceMode.cmEditor;
        var markdownText = mdView.data;        //获取 文档正文
        var cursorPosition = editor.getCursor();        //获取 当前光标位置
        var lineText = editor.getLine(cursorPosition.line);        //获取 光标所在行的文本
        //new obsidian.Notice(lineText);
        var shi = lineText.match(/\d\d(?=:\d\d:\d+\.\d\d\d)/);
        var fen = lineText.match(/\d\d(?=:\d\d\.\d\d\d|:\d\d\s)/);
        var miao = lineText.match(/\d\d(?=\.\d\d\d|\s)/);
        //new obsidian.Notice(shi + " " + fen + " " + miao);
        if(shi == null){shi="0"};
        if(fen == null){fen ="0"};
        if(miao == null){miao = "0"};
        var _time = Number(shi)*3600+Number(fen)*60+Number(miao);
        new obsidian.Notice(_time);

        var lines = this.获取笔记全文 (this.获取编辑模式 ());
        var _mdName = lines.match(/(?<=视频页面\[\[)[^\[\]]+(?=\]\])/mg)
        new obsidian.Notice(_mdName);

        var 文件名列表 = this.app.vault.getMarkdownFiles().map(
    		function (_tmpFiles) {
    			new obsidian.Notice("路径　"+_tmpFiles.path);
    			return _tmpFiles.path;
    	});
        //new obsidian.Notice(文件名列表);
        var _mdPath = 文件名列表.find(checkAdult);
        new obsidian.Notice(_mdPath);
        //return _mdPath

        function checkAdult(age) {
            return age.includes(_mdName)
        }

        var _mdPathA = this.app.vault.getAbstractFileByPath(_mdPath)
        var _mdText = this.app.vault.read(_mdPathA)
        _mdText.then((value) => {
            var oldValue = value.replace(/&t=\d+/,"&t=0")
            value = value.replace(/&t=\d+/,"&t="+_time)
            new obsidian.Notice(value);
            this.app.vault.modify(_mdPathA,oldValue)
            this.app.vault.modify(_mdPathA,value)
        });
    }

    MyPlugin.prototype.批量插入空行 = function() {
		var lines = this.获取笔记全文 (this.获取编辑模式 ());
        if (!lines) return;
        lines = lines.replace(/([^\n])\n([^\n])/g,"$1\n\n$2");
        this.替换笔记全文 (this.获取编辑模式 (), lines);
    };
    
    MyPlugin.prototype.批量去除空行 = function() {
        var lines = this.获取笔记全文 (this.获取编辑模式 ());
        if (!lines) return;
        lines = lines.replace(/(\r\n|\n)[\t\s]*(\r\n|\n)/g,"\n");
        this.替换笔记全文 (this.获取编辑模式 (), lines);
    };

    MyPlugin.prototype.末尾追加空格 = function() {
		var lines = this.获取笔记全文 (this.获取编辑模式 ());
        if (!lines) return;
        lines = lines.replace(/(?<!(\-\-\-|\*\*\*|\s\s))\n/g,"  \n");
        this.替换笔记全文 (this.获取编辑模式 (), lines);
    };
        
    MyPlugin.prototype.去除末尾空格 = function() {
        var lines = this.获取笔记全文 (this.获取编辑模式 ());
        if (!lines) return;
        lines = lines.replace(/\s\s\n/g,"\n")
        this.替换笔记全文 (this.获取编辑模式 (), lines);
    };

    MyPlugin.prototype.上方插入空行 = function(_str) {
        var mdView = this.app.workspace.activeLeaf.view;
        if (mdView.sourceMode == undefined)
            return false;
        var editor = mdView.sourceMode.cmEditor;
        var doc = editor.getDoc();
        var cursorline = editor.getCursor().line;
        var line0 = editor.getLine(cursorline);
        var line1 = line0.replace(/^([^\r\n]*)$/,"\r\n$1");
        doc.replaceRange(line1, {line:cursorline,ch:0},{line:cursorline,ch:line0.length});
    };

    MyPlugin.prototype.下方插入空行 = function(_str) {
        var mdView = this.app.workspace.activeLeaf.view;
        if (mdView.sourceMode == undefined)
            return false;
        var editor = mdView.sourceMode.cmEditor;
        var doc = editor.getDoc();
        var cursorline = editor.getCursor().line;
        var line0 = editor.getLine(cursorline);
        var line1 = line0.replace(/^([^\r\n]*)$/,"$1\r\n");
        doc.replaceRange(line1, {line:cursorline,ch:0},{line:cursorline,ch:line0.length});
    };
   
    MyPlugin.prototype.添加中英间隔 = function() {
        var lines = this.获取笔记全文 (this.获取编辑模式 ());
        if (!lines) return;
        lines = lines.replace(/([a-zA-Z]+)([一-鿆]+)/g,"$1 $2")
        lines = lines.replace(/([一-鿆]+)([a-zA-Z]+)/g,"$1 $2")
        this.替换笔记全文 (this.获取编辑模式 (), lines);
    };

    MyPlugin.prototype.去除所有空格 = function() {
        var lines = this.获取笔记全文 (this.获取编辑模式 ());
        if (!lines) return;
        lines = lines.replace(/[ 　]+/g,"")
        this.替换笔记全文 (this.获取编辑模式 (), lines);
    };

    MyPlugin.prototype.同目录下一笔记 = function() {
        var activeFile = this.app.workspace.getActiveFile();
        var noteFilePath = activeFile.path;
        //noteFilePath = noteFilePath.replace(/\.md/,"")
        //new obsidian.Notice(noteFilePath);

        var fileList = this.app.vault.getMarkdownFiles().map((file) => {
            return file.path;
        });

        var _string = fileList.toString();
        _string = _string.replace(/(^|,)([^\/,]+)(?=\/)/img,"$1■$2");
        new obsidian.Notice(_string);
        var newList = _string.split(",");
        newList.sort();

        navigator.clipboard.writeText(newList.toString().replace(/,/g,"\n"));
        new obsidian.Notice("文件列表已写入剪贴板！");
        
        var _mdID = fileList.findIndex(checkAdult);
        new obsidian.Notice(_mdID + " " + noteFilePath + "\n" + Number(_mdID-1) + " " + fileList[_mdID-1]);

        function checkAdult(age) {
            return age.includes(noteFilePath)
        }
    }

    MyPlugin.prototype.搜索当前文本 = function() {
        var activeFile = this.app.workspace.getActiveFile();
        var noteFilePath = activeFile.name;
        new obsidian.Notice(noteFilePath);
        noteFilePath = noteFilePath.replace(/\.md$/,"")
        var view = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
        var _txt = view.getSelection();
        _txt = _txt.replace(/^/,"path:"+noteFilePath+" /")
        this.app.internalPlugins.getPluginById('global-search').instance.openGlobalSearch(_txt)
    };

    MyPlugin.prototype.修复意外断行 = function() {
        var lines = this.获取笔记全文 (this.获取编辑模式 ());
        if (!lines) return;
        lines = lines.replace(/([^。？！\.\?\!])[\r\n]*\n([^\.\?\!。？！])/g,"$1$2")
        this.替换笔记全文 (this.获取编辑模式 (), lines);
    };

    MyPlugin.prototype.修复错误语法 = function() {
        this.指定编辑模式 ();
        var lines = this.获取笔记全文 (this.获取编辑模式 ());
        if (!lines) return;
        lines = lines.replace(/[\[【]([^\[\]【】]*)[】\]][（|\(]([^\(\)（）]*)[）|\)]/g,"\[$1\]\($2\)");
        //将 【】（）或【】() 转换为[]()
        lines = lines.replace(/\[+([^\[\]]*)\]+\(/g,"\[$1\](");
        //处理 bookXnote 回链语法，将 [[链接]]() 转换为 []()
        lines = lines.replace(/(?<=^|\s)    /mg,"\t");
        //把 四个空格转换为 制表符
        lines = lines.replace(/\*\s+\>\s+/g,"- ");
        //处理 bookXnote 回链语法中的列表
        lines = lines.replace(/(?<=\s)[0-9]+。 /g,"1. ");
        //把 1。 转换为 有序列表样式
        this.替换笔记全文 (this.获取编辑模式 (), lines);
    };

    MyPlugin.prototype.英转中文标点 = function() {
        var lines = this.获取笔记全文 (this.获取编辑模式 ());
        if (!lines) return;
        lines = lines.replace(/,/g,"，")
        lines = lines.replace(/(?<=[^0-9])\./g,"。")
        lines = lines.replace(/\?/g,"？")
        lines = lines.replace(/!/g,"！")
        lines = lines.replace(/;/g,"；")
        lines = lines.replace(/:/g,"：")
        lines = lines.replace(/\(/g,"（")
        lines = lines.replace(/\)/g,"）")
        lines = lines.replace(/\{([^{}]*)\}/g,"｛$1｝")
        lines = lines.replace(/\"([^\"]*?)\"/g,"“$1”")
        this.替换笔记全文 (this.获取编辑模式 (), lines);
    };

    MyPlugin.prototype.中转英文标点 = function() {
        var lines = this.获取笔记全文 (this.获取编辑模式 ());
        if (!lines) return;
        lines = lines.replace(/，/g,",")
        lines = lines.replace(/。/g,"\.")
        lines = lines.replace(/？/g,"\?")
        lines = lines.replace(/！/g,"!")
        lines = lines.replace(/；/g,";")
        lines = lines.replace(/：/g,":")
        lines = lines.replace(/（/g,"\(")
        lines = lines.replace(/）/g,"\)")
        lines = lines.replace(/｛([^｛｝]*)｝/g,"{$1}")
        lines = lines.replace(/“([^“”]*)”/g,"\"$1\"")
        this.替换笔记全文 (this.获取编辑模式 (), lines);
    };

    MyPlugin.prototype.转换路径 = function() {
        var lines = this.获取笔记全文 (this.获取编辑模式 ());
        if (!lines) return;
        var link1 = /^[a-zA-Z]:\\/;	//符合普通路径格式
        var link2 = /^(\[[^\[\]]*\]\()*file:\/\/\/[^\(\)]*\)*/;	//符合[](file路径)格式
        var link3 = /^\[[^\[\]]*\]\(([a-zA-Z]:\\[^\(\)]*)\)*/;	//意外路径格式
        if (link1.test(lines)){
            lines = lines.replace(/\s/mg,"%20");
            lines = lines.replace(/^(.*)$/m,"\[file\]\(file:///$1\)");
            lines = lines.replace(/\\/img,"\/");
            this.替换笔记全文 (this.获取编辑模式 (), lines);
        }else if(link2.test(lines)){
            lines = lines.replace(/%20/mg," ");
            lines = lines.replace(/^(\[[^\[\]]*\]\()*file:\/\/\/([^\(\)]*)\)*/m,"$2");
            lines = lines.replace(/\//mg,"\\");
            this.替换笔记全文 (this.获取编辑模式 (), lines);
        }else if(link3.test(lines)){
            lines = lines.replace(/^\[[^\[\]]*\]\(([a-zA-Z]:\\[^\(\)]*)\)*/m,"$1");
            this.替换笔记全文 (this.获取编辑模式 (), lines);
        }else{
            new obsidian.Notice("您划选的路径格式不正确！");
            return
        }
    };

    MyPlugin.prototype.简体转繁 = function(){
        var lines = this.获取笔记全文 (this.获取编辑模式 ());
        if (!lines) return;
        var _list1 = this.settings.简体字表;
        var _list2 = this.settings.繁体字表;
        
        for (var i=0;i<_list1.length;i++)
        { 
            lines = lines.replace(eval("/"+_list1[i]+"/g"),_list2[i]);
        }
        this.替换笔记全文 (this.获取编辑模式 (), lines);
    }

    MyPlugin.prototype.繁体转简 = function(){
        var lines = this.获取笔记全文 (this.获取编辑模式 ());
        if (!lines) return;
        var _list1 = this.settings.简体字表;
        var _list2 = this.settings.繁体字表;
        
        for (var i=0;i<_list1.length;i++)
        { 
            lines = lines.replace(eval("/"+_list2[i]+"/g"),_list1[i]);
        }
        this.替换笔记全文 (this.获取编辑模式 (), lines);
    }

    MyPlugin.prototype.获取所选文本 = function(editor) {
        if (!editor) return;
        var editor = this.app.workspace.activeLeaf.view.sourceMode.cmEditor;
        var selection = editor.getSelection();
       	return selection;
    };

    MyPlugin.prototype.获取笔记全文 = function(editor) {
    	if (!editor) return;
        var selection = editor.getSelection();
        if (selection != "") {
       		return selection;
        } else {
            return editor.getValue();         
        }
    };

    MyPlugin.prototype.替换所选文本 = function(editor, lines) {
        var selection = editor.getSelection();
        editor.replaceSelection(lines);
    };

    MyPlugin.prototype.替换笔记全文 = function(editor, lines) {
	    var selection = editor.getSelection();
        if (selection != "") {
            editor.replaceSelection(lines);
        } else {
            editor.setValue(lines);
        }
    };

    MyPlugin.prototype.获取编辑模式 = function () {
        var view = this.app.workspace.activeLeaf.view;
        if (view.getViewType() == 'markdown') {
            var cmEditor = this.app.workspace.activeLeaf.view.sourceMode.cmEditor;
            return cmEditor;
        }
        return null;
    };

    MyPlugin.prototype.指定编辑模式 = function () {
		var view = this.app.workspace.activeLeaf.view;
		view.setMode(view.sourceMode)
		view.setEphemeralState({ focus: !0 });
		//指定编辑模式，并将焦点切换到当前笔记面板
    };

    return MyPlugin;
}(obsidian.Plugin));

var SettingsTab = /** @class */ (function (_super) {
    __extends(SettingsTab, _super);
    function SettingsTab(app, plugin) {
        var _this = _super.call(this, app, plugin) || this;
        _this.plugin = plugin;
        _this.settings = plugin.settings;
        return _this;
    }
    SettingsTab.prototype.display = function () {
        var _this = this;
        var containerEl = this.containerEl;
        containerEl.empty();
        containerEl.createEl('h2', { text: '增强编辑 0.3.4' });
        new obsidian.Setting(containerEl)
            .setName('转换内部链接「Alt+Z」：在选文两端添加或去除 [[ ]] 符号')
            .setDesc('支持批量转换用换行符分隔的多行文本或顿号分隔的多句文本。')
             
            .addText(function (text) {
            return text
                .setPlaceholder('禁用 "|[]?\*<>/: 等符号')
                .setValue(_this.settings.defaultChar)
                .onChange(function (value) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _this.settings.defaultChar = value;
                            return [4 , _this.plugin.saveSettings()];   //保存缓存数据，取消
                        case 1:
                            _a.sent();
                            return [2];
                    }
                });
            }); });
        }); 

        new obsidian.Setting(containerEl)
            .setName('增强功能「快捷键」：功能说明......')
        var div = containerEl.createEl('p', {
            cls: 'recent-files-donation',
        });
        var donateText = document.createDocumentFragment();
        donateText.appendText('转换同义链接「Alt+Q」：将选文转换为 [[|选文]] 样式后再选择文档')
        donateText.appendChild(document.createElement('br'));
        donateText.appendText('转换粗体语法「Alt+C」∶将选文转为或去除 **粗体** 效果');
        donateText.appendChild(document.createElement('br'));
        donateText.appendText('转换斜体语法「Alt+X」∶将选文转为或去除 _斜体_ 效果');
        donateText.appendChild(document.createElement('br'));
        donateText.appendText('转换行内代码「Alt+D」∶将选文转为或去除 `行内代码` 效果');
        donateText.appendChild(document.createElement('br'));
        donateText.appendText('转换删除线「Alt+S」∶将选文转为或去除 ~~删除线~~ 效果');
        donateText.appendChild(document.createElement('br'));
        donateText.appendText('转换下划线「Alt+H」∶将选文转为或去除 <u>下划线</u> 效果');
        donateText.appendChild(document.createElement('br'));
        donateText.appendText('转换代码块「Alt+M」∶将选文转为或去除 ```代码块``` 效果');
        donateText.appendChild(document.createElement('br'));
        donateText.appendText('转换上标语法「Alt+U」∶将选文转为或去除 <sup>上标</sup> 效果');
        donateText.appendChild(document.createElement('br'));
        donateText.appendText('转换下标语法「Alt+N」∶将选文转为或去除 <sub>下标</sub> 效果');
        donateText.appendChild(document.createElement('br'));
        donateText.appendText('转换待办状态「未设置」：转换选文行首的待办状态，顺序为 -[ x-!?><+] 效果');
        donateText.appendChild(document.createElement('br'));
        donateText.appendChild(document.createElement('br'));
        donateText.appendText('转换标题语法「Ctrl+1-6」∶指定或取消当前行文本为N级标题');
        donateText.appendChild(document.createElement('br'));
        donateText.appendText('转换文字颜色「Ctrl+Shift+1-7」∶将选文转为或去除 赤橙黄绿青蓝紫 颜色');
        donateText.appendChild(document.createElement('br'));
        donateText.appendText('转换背景颜色「Ctrl+Alt+1-7」∶将选文背景转为或去除 赤橙黄绿青蓝紫 颜色');
        donateText.appendChild(document.createElement('br'));
        donateText.appendChild(document.createElement('br'));
        donateText.appendText('转换无语法文本「Ctrl+Alt+Z」∶去除选文中所有markdown语法字符');
        donateText.appendChild(document.createElement('br'));
        donateText.appendText('获取无语法文本「Ctrl+Alt+C」∶去除选文中的所有markdown语法字符，并写入剪贴板');
        donateText.appendChild(document.createElement('br'));
        donateText.appendChild(document.createElement('br'));
        donateText.appendText('【选文】「未设置」：在选文两端添加或去除 【】符号');
        donateText.appendChild(document.createElement('br'));
        donateText.appendText('（选文）「未设置」：在选文两端添加或去除 （）符号');
        donateText.appendChild(document.createElement('br'));
        donateText.appendText('「选文」「未设置」：在选文两端添加或去除 「」符号');
        donateText.appendChild(document.createElement('br'));
        donateText.appendText('《选文》「未设置」：在选文两端添加或去除 《》符号');
        donateText.appendChild(document.createElement('br'));
        donateText.appendChild(document.createElement('br'));
        donateText.appendText('自动设置标题「Ctrl+Shift+Alt+T」∶将选文中的单行文本（末尾非标点或数字）转为标题');
        donateText.appendChild(document.createElement('br'));
        donateText.appendText('英转中文标点「Ctrl+Shift+Alt+Z」∶将笔记中的英文标点转换为中文标点，如,.?!"等');
        donateText.appendChild(document.createElement('br'));
        donateText.appendText('中转英文标点「Ctrl+Shift+Alt+Y」∶将笔记中的中文标点转换为英文标点，如，。？！“等');
        donateText.appendChild(document.createElement('br'));
        donateText.appendText('转换路径语法「Shift+Alt+F」∶将 c:\\windows 与 [](file:///c:\/windows) 路径语法相互转换');
        donateText.appendChild(document.createElement('br'));
        donateText.appendText('简体转为繁体「未设置」：将笔记中的简体汉字转换为繁体汉字');
        donateText.appendChild(document.createElement('br'));
        donateText.appendText('繁体转为简体「未设置」：将笔记中的繁体汉字转换为简体汉字');
        donateText.appendChild(document.createElement('br'));
        donateText.appendChild(document.createElement('br'));
        donateText.appendText('粘贴MD表格「Ctrl+Alt+V」∶将复制的Office表格直接粘贴为MarkDown语法表格');
        donateText.appendChild(document.createElement('br'));
        donateText.appendText('修复错误语法「Ctrl+Shift+J」∶修复错误的MD语法，如1。列表、【】（）链接、[[]]()回链等');
        donateText.appendChild(document.createElement('br'));
        donateText.appendText('修复意外断行「Ctrl+Alt+D」∶修复笔记中的意外断行（删除结尾不是句式标点的换行符）');
        donateText.appendChild(document.createElement('br'));
        donateText.appendText('搜索当前文本「未设置」：通过搜索面板在当前文档中搜索划选内容。');
        //donateText.appendChild(document.createElement('br'));
        //donateText.appendText('获取时间信息「Ctrl+Shift+T」∶获取当前行中的时间信息，并控制链接笔记中的视频进行跳转播放');
        donateText.appendChild(document.createElement('br'));
        donateText.appendText('获取标注文本「Ctrl+Shift+B」∶获取标题、高亮、注释及前缀(#标注\批注\反思)等文本内容');
        donateText.appendChild(document.createElement('br'));
        donateText.appendText('获取相对路径「未设置」：获取当前笔记在库目录内的相对路径。');
        donateText.appendChild(document.createElement('br'));
        donateText.appendChild(document.createElement('br'));
        donateText.appendText('批量插入空行「Ctrl+Shift+L」∶在划选的文本行或全文中间批量插入空白行');
        donateText.appendChild(document.createElement('br'));
        donateText.appendText('批量去除空行「Ctrl+Alt+L」∶批量去除划选文本或全文中的空白行');
        donateText.appendChild(document.createElement('br'));
        donateText.appendText('上方插入空行「Shift+Alt+O」∶在当前文本行的上行插入空白行');
        donateText.appendChild(document.createElement('br'));
        donateText.appendText('下方插入空行「Shift+Alt+L」∶在当前文本行的下行插入空白行');
        donateText.appendChild(document.createElement('br'));
        donateText.appendText('末尾追加空格「Ctrl+Shift+K」∶在每行文本的末尾追加两个空格');
        donateText.appendChild(document.createElement('br'));
        donateText.appendText('去除末尾空格「Ctrl+Alt+K」∶批量去除每个文本行末尾的空格字符');
        donateText.appendChild(document.createElement('br'));
        donateText.appendText('添加中英间隔「未设置」：在正文的汉字与字母之间批量添加空格，如 china 中国。');
        donateText.appendChild(document.createElement('br'));
        donateText.appendText('去除所有空格「未设置」：去除正文中所有的全、半角空格');
        donateText.appendChild(document.createElement('br'));
        donateText.appendChild(document.createElement('br'));
        donateText.appendText('欢迎向蚕子(QQ:312815311) 提出操作需求和建议，我们为增强编辑功能来共同努力！');
        div.appendChild(donateText);
    };
    return SettingsTab;
}(obsidian.PluginSettingTab));

module.exports = MyPlugin;