'use strict';

var obsidian = require('obsidian');

/* *****************************************************************************
使用声明
ZH增强编辑插件基于多款社区插件开发而成，蚕子水平有限，代码或许存有缺陷，不能保证任何用户或任何操作均为正常，
请您在使用本插件之前，先备份好Obsidian笔记库，谢谢配合。
开发：蚕子 QQ：312815311 更新时间：2022-3-10
***************************************************************************** */

class Settings {
    constructor() {
        this.twoEnter = false;
    }
    toJson() {
        return JSON.stringify(this);
    }
    fromJson(content) {
        var obj = JSON.parse(content);
        this.twoEnter = obj['twoEnter'];
    }
}

var 简体字表 = "皑蔼碍爱肮翱袄奥坝罢摆败颁办绊帮绑镑谤剥饱宝报鲍辈贝钡狈备惫绷笔毕毙币闭边编贬变辩辫标鳖别瘪濒滨宾摈饼并拨钵铂驳卜补财参蚕残惭惨灿苍舱仓沧厕侧册测层诧搀掺蝉馋谗缠铲产阐颤场尝长偿肠厂畅钞车彻尘沉陈衬撑称惩诚骋痴迟驰耻齿炽冲虫宠畴踌筹绸丑橱厨锄雏础储触处传疮闯创锤纯绰辞词赐聪葱囱从丛凑蹿窜错达带贷担单郸掸胆惮诞弹当挡党荡档捣岛祷导盗灯邓敌涤递缔颠点垫电淀凋钓调迭谍叠钉顶锭订丢东动栋冻斗犊独读赌镀锻断缎兑队对吨顿钝夺堕鹅额讹恶饿儿尔饵贰发罚阀珐矾钒烦范贩饭访纺飞诽废费纷坟奋愤粪丰枫锋风疯冯缝讽凤肤辐抚辅赋复负讣妇缚该钙盖干杆赶秆赣冈刚钢纲岗皋镐搁鸽阁铬个给龚宫巩贡钩沟苟构购够蛊顾剐挂关观馆惯贯广规硅归龟闺轨诡柜贵刽辊滚锅国过骇韩汉号阂鹤贺横轰鸿红后壶护沪户哗华画划话怀坏欢环还缓换唤痪焕涣黄谎挥辉毁贿秽会烩汇讳诲绘荤浑伙获货祸击机积饥迹讥鸡绩缉极辑级挤几蓟剂济计记际继纪夹荚颊贾钾价驾歼监坚笺间艰缄茧检碱硷拣捡简俭减荐槛鉴践贱见键舰剑饯渐溅涧将浆蒋桨奖讲酱胶浇骄娇搅铰矫侥脚饺缴绞轿较秸阶节茎鲸惊经颈静镜径痉竞净纠厩旧驹举据锯惧剧鹃绢杰洁结诫届紧锦仅谨进晋烬尽劲荆觉决诀绝钧军骏开凯颗壳课垦恳抠库裤夸块侩宽矿旷况亏岿窥馈溃扩阔蜡腊莱来赖蓝栏拦篮阑兰澜谰揽览懒缆烂滥琅捞劳涝乐镭垒类泪篱狸离里鲤礼丽厉励砾历沥隶俩联莲连镰怜涟帘敛脸链恋炼练粮凉两辆谅疗辽镣猎临邻鳞凛赁龄铃凌灵岭领馏刘龙聋咙笼垄拢陇楼娄搂篓芦卢颅庐炉掳卤虏鲁赂禄录陆驴吕铝侣屡缕虑滤绿峦挛孪滦乱抡轮伦仑沦纶论萝罗逻锣箩骡骆络妈玛码蚂马骂吗买麦卖迈脉瞒馒蛮满谩猫锚铆贸么霉没镁门闷们锰梦眯谜弥觅幂绵缅庙灭悯闽鸣铭谬谋亩呐钠纳难挠脑恼闹馁内拟你腻撵捻酿鸟聂啮镊镍柠狞宁拧泞钮纽脓浓农疟诺欧鸥殴呕沤盘庞抛赔喷鹏骗飘频贫苹凭评泼颇扑铺朴谱栖凄脐齐骑岂启气弃讫牵扦钎铅迁签谦钱钳潜浅谴堑枪呛墙蔷强抢锹桥乔侨翘窍窃钦亲寝轻氢倾顷请庆琼穷趋区躯驱龋颧权劝却鹊确让饶扰绕热韧认纫荣绒软锐闰润洒萨鳃赛叁伞丧骚扫涩杀刹纱筛晒删闪陕赡缮墒伤赏烧绍赊摄慑设绅审婶肾渗声绳胜圣师狮湿诗尸时蚀实识驶势适释饰视试寿兽枢输书赎属术树竖数帅双谁税顺说硕烁丝饲耸怂颂讼诵擞苏诉肃虽随绥岁孙损笋缩琐锁獭挞抬台态摊贪瘫滩坛谭谈叹汤烫涛绦讨腾誊锑题体屉条贴铁厅听烃铜统头秃图涂团颓蜕脱鸵驮驼椭洼袜弯湾顽万网韦违围为潍维苇伟伪纬喂谓卫温闻纹稳问瓮挝蜗涡窝卧呜钨乌污诬无芜吴坞雾务误锡牺袭习铣戏细虾辖峡侠狭厦吓锨鲜纤咸贤衔闲显险现献县馅羡宪线厢镶乡详响项萧嚣销晓啸蝎协挟携胁谐写泻谢锌衅兴凶汹锈绣虚嘘须许叙绪续轩悬选癣绚学勋询寻驯训讯逊压鸦鸭哑亚讶阉烟盐严岩颜阎艳厌砚彦谚验鸯杨扬疡阳痒养样瑶摇尧遥窑谣药爷页业叶一医铱颐遗仪彝蚁艺亿忆义诣议谊译异绎荫阴银饮隐樱婴鹰应缨莹萤营荧蝇赢颖哟拥佣痈踊咏涌优忧邮铀犹游诱于舆鱼渔娱与屿语吁御狱誉预驭鸳渊辕园员圆缘远愿约跃钥岳粤悦阅云郧匀陨运蕴酝晕韵杂灾载攒暂赞赃脏凿枣灶责择则泽贼赠扎札轧铡闸栅诈斋债毡盏斩辗崭栈战绽张涨帐账胀赵蛰辙锗这贞针侦诊镇阵挣睁狰争帧症郑证织职执纸志挚掷帜质滞钟终种肿众诌轴皱昼骤猪诸诛烛瞩嘱贮铸筑注驻专砖转赚桩庄装妆壮状锥赘坠缀谆准着浊兹资渍踪综总纵邹诅组钻锕嗳嫒瑷暧霭谙铵鹌媪骜鳌钯呗钣鸨龅鹎贲锛荜哔滗铋筚跸苄缏笾骠飑飙镖镳鳔傧缤槟殡膑镔髌鬓禀饽钹鹁钸骖黪恻锸侪钗冁谄谶蒇忏婵骣觇禅镡伥苌怅阊鲳砗伧谌榇碜龀枨柽铖铛饬鸱铳俦帱雠刍绌蹰钏怆缍鹑辍龊鹚苁骢枞辏撺锉鹾哒鞑骀绐殚赕瘅箪谠砀裆焘镫籴诋谛绨觌镝巅钿癫铫鲷鲽铤铥岽鸫窦渎椟牍笃黩簖怼镦炖趸铎谔垩阏轭锇锷鹗颚颛鳄诶迩铒鸸鲕钫鲂绯镄鲱偾沣凫驸绂绋赙麸鲋鳆钆赅尴擀绀戆睾诰缟锆纥镉颍亘赓绠鲠诟缑觏诂毂钴锢鸪鹄鹘鸹掴诖掼鹳鳏犷匦刿妫桧鲑鳜衮绲鲧埚呙帼椁蝈铪阚绗颉灏颢诃阖蛎黉讧荭闳鲎浒鹕骅桦铧奂缳锾鲩鳇诙荟哕浍缋珲晖诨馄阍钬镬讦诘荠叽哜骥玑觊齑矶羁虿跻霁鲚鲫郏浃铗镓蛲谏缣戋戬睑鹣笕鲣鞯绛缰挢峤鹪鲛疖颌鲒卺荩馑缙赆觐刭泾迳弪胫靓阄鸠鹫讵屦榉飓钜锔窭龃锩镌隽谲珏皲剀垲忾恺铠锴龛闶钪铐骒缂轲钶锞颔龈铿喾郐哙脍狯髋诓诳邝圹纩贶匮蒉愦聩篑阃锟鲲蛴崃徕涞濑赉睐铼癞籁岚榄斓镧褴阆锒唠崂铑铹痨鳓诔缧俪郦坜苈莅蓠呖逦骊缡枥栎轹砺锂鹂疠粝跞雳鲡鳢蔹奁潋琏殓裢裣鲢魉缭钌鹩蔺廪檩辚躏绫棂蛏鲮浏骝绺镏鹨茏泷珑栊胧砻偻蒌喽嵝镂瘘耧蝼髅垆撸噜闾泸渌栌橹轳辂辘氇胪鸬鹭舻鲈脔娈栾鸾銮囵荦猡泺椤脶镙榈褛锊呒唛嬷杩劢缦镘颡鳗麽扪焖懑钔芈谧猕祢渑腼黾缈缪闵缗谟蓦馍殁镆钼铙讷铌鲵辇鲶茑袅陧蘖嗫颟蹑苎咛聍侬哝驽钕傩讴怄瓯蹒疱辔纰罴铍谝骈缥嫔钋镤镨蕲骐绮桤碛颀颃鳍佥荨悭骞缱椠钤嫱樯戗炝锖锵镪羟跄诮谯荞缲硗跷惬锲箧锓揿鲭茕蛱巯赇虮鳅诎岖阒觑鸲诠绻辁铨阕阙悫荛娆桡饪轫嵘蝾缛铷颦蚬飒毵糁缫啬铯穑铩鲨酾讪姗骟钐鳝垧殇觞厍滠畲诜谂渖谥埘莳弑轼贳铈鲥绶摅纾闩铄厮驷缌锶鸶薮馊飕锼谡稣谇荪狲唢睃闼铊鳎钛鲐昙钽锬顸傥饧铴镗韬铽缇鹈阗粜龆鲦恸钭钍抟饨箨鼍娲腽纨绾辋诿帏闱沩涠玮韪炜鲔阌莴龌邬庑怃妩骛鹉鹜饩阋玺觋硖苋莶藓岘猃娴鹇痫蚝籼跹芗饷骧缃飨哓潇骁绡枭箫亵撷绁缬陉荥馐鸺诩顼谖铉镟谑泶鳕埙浔鲟垭娅桠氩厣赝俨兖谳恹闫酽魇餍鼹炀轺鹞鳐靥谒邺晔烨诒呓峄饴怿驿缢轶贻钇镒镱瘗舣铟瘾茔莺萦蓥撄嘤滢潆璎鹦瘿颏罂镛莸铕鱿伛俣谀谕蓣嵛饫阈妪纡觎欤钰鹆鹬龉橼鸢鼋钺郓芸恽愠纭韫殒氲瓒趱錾驵赜啧帻箦谮缯谵诏钊谪辄鹧浈缜桢轸赈祯鸩诤峥钲铮筝骘栉栀轵轾贽鸷蛳絷踬踯觯锺纣绉伫槠铢啭馔颞骓缒诼镯谘缁辎赀眦锱龇鲻偬诹驺鲰镞缵躜鳟讠谫郄勐凼坂垅垴埯埝苘荬荮莜莼菰藁揸吒吣咔咝咴噘噼嚯幞岙嵴彷徼犸狍馀馇馓馕愣憷懔丬溆滟溷漤潴澹甯纟绔绱珉枧桊桉槔橥轱轷赍肷胨飚煳煅熘愍淼砜磙眍钚钷铘铞锃锍锎锏锘锝锪锫锿镅镎镢镥镩镲稆鹋鹛鹱疬疴痖癯裥襁耢颥螨麴鲅鲆鲇鲞鲴鲺鲼鳊鳋鳘鳙鞒鞴齄";
var 繁体字表 = "皚藹礙愛骯翺襖奧壩罷擺敗頒辦絆幫綁鎊謗剝飽寶報鮑輩貝鋇狽備憊繃筆畢斃幣閉邊編貶變辯辮標鱉別癟瀕濱賓擯餅並撥缽鉑駁蔔補財參蠶殘慚慘燦蒼艙倉滄廁側冊測層詫攙摻蟬饞讒纏鏟產闡顫場嘗長償腸廠暢鈔車徹塵沈陳襯撐稱懲誠騁癡遲馳恥齒熾沖蟲寵疇躊籌綢醜櫥廚鋤雛礎儲觸處傳瘡闖創錘純綽辭詞賜聰蔥囪從叢湊躥竄錯達帶貸擔單鄲撣膽憚誕彈當擋黨蕩檔搗島禱導盜燈鄧敵滌遞締顛點墊電澱雕釣調叠諜疊釘頂錠訂丟東動棟凍鬥犢獨讀賭鍍鍛斷緞兌隊對噸頓鈍奪墮鵝額訛惡餓兒爾餌貳發罰閥琺礬釩煩範販飯訪紡飛誹廢費紛墳奮憤糞豐楓鋒風瘋馮縫諷鳳膚輻撫輔賦復負訃婦縛該鈣蓋幹桿趕稈贛岡剛鋼綱崗臯鎬擱鴿閣鉻個給龔宮鞏貢鉤溝茍構購夠蠱顧剮掛關觀館慣貫廣規矽歸龜閨軌詭櫃貴劊輥滾鍋國過駭韓漢號閡鶴賀橫轟鴻紅後壺護滬戶嘩華畫劃話懷壞歡環還緩換喚瘓煥渙黃謊揮輝毀賄穢會燴匯諱誨繪葷渾夥獲貨禍擊機積饑跡譏雞績緝極輯級擠幾薊劑濟計記際繼紀夾莢頰賈鉀價駕殲監堅箋間艱緘繭檢堿鹼揀撿簡儉減薦檻鑒踐賤見鍵艦劍餞漸濺澗將漿蔣槳獎講醬膠澆驕嬌攪鉸矯僥腳餃繳絞轎較稭階節莖鯨驚經頸靜鏡徑痙競凈糾廄舊駒舉據鋸懼劇鵑絹傑潔結誡屆緊錦僅謹進晉燼盡勁荊覺決訣絕鈞軍駿開凱顆殼課墾懇摳庫褲誇塊儈寬礦曠況虧巋窺饋潰擴闊蠟臘萊來賴藍欄攔籃闌蘭瀾讕攬覽懶纜爛濫瑯撈勞澇樂鐳壘類淚籬貍離裏鯉禮麗厲勵礫歷瀝隸倆聯蓮連鐮憐漣簾斂臉鏈戀煉練糧涼兩輛諒療遼鐐獵臨鄰鱗凜賃齡鈴淩靈嶺領餾劉龍聾嚨籠壟攏隴樓婁摟簍蘆盧顱廬爐擄鹵虜魯賂祿錄陸驢呂鋁侶屢縷慮濾綠巒攣孿灤亂掄輪倫侖淪綸論蘿羅邏鑼籮騾駱絡媽瑪碼螞馬罵嗎買麥賣邁脈瞞饅蠻滿謾貓錨鉚貿麽黴沒鎂門悶們錳夢瞇謎彌覓冪綿緬廟滅憫閩鳴銘謬謀畝吶鈉納難撓腦惱鬧餒內擬妳膩攆撚釀鳥聶嚙鑷鎳檸獰寧擰濘鈕紐膿濃農瘧諾歐鷗毆嘔漚盤龐拋賠噴鵬騙飄頻貧蘋憑評潑頗撲鋪樸譜棲淒臍齊騎豈啟氣棄訖牽扡釬鉛遷簽謙錢鉗潛淺譴塹槍嗆墻薔強搶鍬橋喬僑翹竅竊欽親寢輕氫傾頃請慶瓊窮趨區軀驅齲顴權勸卻鵲確讓饒擾繞熱韌認紉榮絨軟銳閏潤灑薩鰓賽三傘喪騷掃澀殺剎紗篩曬刪閃陜贍繕墑傷賞燒紹賒攝懾設紳審嬸腎滲聲繩勝聖師獅濕詩屍時蝕實識駛勢適釋飾視試壽獸樞輸書贖屬術樹豎數帥雙誰稅順說碩爍絲飼聳慫頌訟誦擻蘇訴肅雖隨綏歲孫損筍縮瑣鎖獺撻擡臺態攤貪癱灘壇譚談嘆湯燙濤絳討騰謄銻題體屜條貼鐵廳聽烴銅統頭禿圖塗團頹蛻脫鴕馱駝橢窪襪彎灣頑萬網韋違圍為濰維葦偉偽緯餵謂衛溫聞紋穩問甕撾蝸渦窩臥嗚鎢烏汙誣無蕪吳塢霧務誤錫犧襲習銑戲細蝦轄峽俠狹廈嚇鍁鮮纖鹹賢銜閑顯險現獻縣餡羨憲線廂鑲鄉詳響項蕭囂銷曉嘯蠍協挾攜脅諧寫瀉謝鋅釁興兇洶銹繡虛噓須許敘緒續軒懸選癬絢學勛詢尋馴訓訊遜壓鴉鴨啞亞訝閹煙鹽嚴巖顏閻艷厭硯彥諺驗鴦楊揚瘍陽癢養樣瑤搖堯遙窯謠藥爺頁業葉壹醫銥頤遺儀彜蟻藝億憶義詣議誼譯異繹蔭陰銀飲隱櫻嬰鷹應纓瑩螢營熒蠅贏穎喲擁傭癰踴詠湧優憂郵鈾猶遊誘於輿魚漁娛與嶼語籲禦獄譽預馭鴛淵轅園員圓緣遠願約躍鑰嶽粵悅閱雲鄖勻隕運蘊醞暈韻雜災載攢暫贊贓臟鑿棗竈責擇則澤賊贈紮劄軋鍘閘柵詐齋債氈盞斬輾嶄棧戰綻張漲帳賬脹趙蟄轍鍺這貞針偵診鎮陣掙睜猙爭幀癥鄭證織職執紙誌摯擲幟質滯鐘終種腫眾謅軸皺晝驟豬諸誅燭矚囑貯鑄築註駐專磚轉賺樁莊裝妝壯狀錐贅墜綴諄準著濁茲資漬蹤綜總縱鄒詛組鉆錒噯嬡璦曖靄諳銨鵪媼驁鰲鈀唄鈑鴇齙鵯賁錛蓽嗶潷鉍篳蹕芐緶籩驃颮飆鏢鑣鰾儐繽檳殯臏鑌髕鬢稟餑鈸鵓鈽驂黲惻鍤儕釵囅諂讖蕆懺嬋驏覘禪鐔倀萇悵閶鯧硨傖諶櫬磣齔棖檉鋮鐺飭鴟銃儔幬讎芻絀躕釧愴綞鶉輟齪鶿蓯驄樅輳攛銼鹺噠韃駘紿殫賧癉簞讜碭襠燾鐙糴詆諦綈覿鏑巔鈿癲銚鯛鰈鋌銩崠鶇竇瀆櫝牘篤黷籪懟鐓燉躉鐸諤堊閼軛鋨鍔鶚顎顓鱷誒邇鉺鴯鮞鈁魴緋鐨鯡僨灃鳧駙紱紼賻麩鮒鰒釓賅尷搟紺戇睪誥縞鋯紇鎘潁亙賡綆鯁詬緱覯詁轂鈷錮鴣鵠鶻鴰摑詿摜鸛鰥獷匭劌媯檜鮭鱖袞緄鯀堝咼幗槨蟈鉿闞絎頡灝顥訶闔蠣黌訌葒閎鱟滸鶘驊樺鏵奐繯鍰鯇鰉詼薈噦澮繢琿暉諢餛閽鈥鑊訐詰薺嘰嚌驥璣覬齏磯羈蠆躋霽鱭鯽郟浹鋏鎵蟯諫縑戔戩瞼鶼筧鰹韉絳韁撟嶠鷦鮫癤頜鮚巹藎饉縉贐覲剄涇逕弳脛靚鬮鳩鷲詎屨櫸颶鉅鋦窶齟錈鐫雋譎玨皸剴塏愾愷鎧鍇龕閌鈧銬騍緙軻鈳錁頷齦鏗嚳鄶噲膾獪髖誆誑鄺壙纊貺匱蕢憒聵簣閫錕鯤蠐崍徠淶瀨賚睞錸癩籟嵐欖斕鑭襤閬鋃嘮嶗銠鐒癆鰳誄縲儷酈壢藶蒞蘺嚦邐驪縭櫪櫟轢礪鋰鸝癘糲躒靂鱺鱧蘞奩瀲璉殮褳襝鰱魎繚釕鷯藺廩檁轔躪綾欞蟶鯪瀏騮綹鎦鷚蘢瀧瓏櫳朧礱僂蔞嘍嶁鏤瘺耬螻髏壚擼嚕閭瀘淥櫨櫓轤輅轆氌臚鸕鷺艫鱸臠孌欒鸞鑾圇犖玀濼欏腡鏍櫚褸鋝嘸嘜嬤榪勱縵鏝顙鰻麼捫燜懣鍆羋謐獼禰澠靦黽緲繆閔緡謨驀饃歿鏌鉬鐃訥鈮鯢輦鯰蔦裊隉蘗囁顢躡苧嚀聹儂噥駑釹儺謳慪甌蹣皰轡紕羆鈹諞駢縹嬪釙鏷鐠蘄騏綺榿磧頎頏鰭僉蕁慳騫繾槧鈐嬙檣戧熗錆鏘鏹羥蹌誚譙蕎繰磽蹺愜鍥篋鋟撳鯖煢蛺巰賕蟣鰍詘嶇闃覷鴝詮綣輇銓闋闕愨蕘嬈橈飪軔嶸蠑縟銣顰蜆颯毿糝繅嗇銫穡鎩鯊釃訕姍騸釤鱔坰殤觴厙灄畬詵諗瀋謚塒蒔弒軾貰鈰鰣綬攄紓閂鑠廝駟緦鍶鷥藪餿颼鎪謖穌誶蓀猻嗩脧闥鉈鰨鈦鮐曇鉭錟頇儻餳鐋鏜韜鋱緹鵜闐糶齠鰷慟鈄釷摶飩籜鼉媧膃紈綰輞諉幃闈溈潿瑋韙煒鮪閿萵齷鄔廡憮嫵騖鵡鶩餼鬩璽覡硤莧薟蘚峴獫嫻鷴癇蠔秈躚薌餉驤緗饗嘵瀟驍綃梟簫褻擷紲纈陘滎饈鵂詡頊諼鉉鏇謔澩鱈塤潯鱘埡婭椏氬厴贗儼兗讞懨閆釅魘饜鼴煬軺鷂鰩靨謁鄴曄燁詒囈嶧飴懌驛縊軼貽釔鎰鐿瘞艤銦癮塋鶯縈鎣攖嚶瀅瀠瓔鸚癭頦罌鏞蕕銪魷傴俁諛諭蕷崳飫閾嫗紆覦歟鈺鵒鷸齬櫞鳶黿鉞鄆蕓惲慍紜韞殞氳瓚趲鏨駔賾嘖幘簀譖繒譫詔釗謫輒鷓湞縝楨軫賑禎鴆諍崢鉦錚箏騭櫛梔軹輊贄鷙螄縶躓躑觶鍾紂縐佇櫧銖囀饌顳騅縋諑鐲諮緇輜貲眥錙齜鯔傯諏騶鯫鏃纘躦鱒訁譾郤猛氹阪壟堖垵墊檾蕒葤蓧蒓菇槁摣咤唚哢噝噅撅劈謔襆嶴脊仿僥獁麅餘餷饊饢楞怵懍爿漵灩混濫瀦淡寧糸絝緔瑉梘棬案橰櫫軲軤賫膁腖飈糊煆溜湣渺碸滾瞘鈈鉕鋣銱鋥鋶鐦鐧鍩鍀鍃錇鎄鎇鎿鐝鑥鑹鑔穭鶓鶥鸌癧屙瘂臒襇繈耮顬蟎麯鮁鮃鮎鯗鯝鯴鱝鯿鰠鰵鱅鞽韝齇";
var 当前文件;
var 当前文件路径;
var 编辑模式;
var 所选文本 = "";
var 笔记正文 = "";
var 笔记全文;
var 当前行文本 = "";
var 当前光标;
var 当前行号;
var 选至行首 = "";
var 选至行尾 = "";
var 末行行号;
var 末行文本 = "";
var 选至文首 = "";
var 选至文末 = "";
var 编辑中 = false;
var 历史缩进 = "";
var 按上档键 = false;
var isGLS = false;
var isCTS = false;
var isXTS = false;
var isSCS = false;
var isXHS = false;
var isSB = false;
var isXB = false;

class MyPlugin extends obsidian.Plugin {
    constructor() {
        super(...arguments);
        this.settings = new Settings();
        this.SETTINGS_PATH = '.obsidian/plugins/ZH增强编辑/data.json';
    };

    onload() {
        console.log('加载增强编辑插件');
        this.addCommand({
            id: 'internal-link',
            name: '[[链接]]语法',
            callback: () => this.转换内部链接(),
            hotkeys: [{ modifiers: ["Alt"], key: "Z" } ]
        });

        this.addCommand({
            id: 'internal-link2',
            name: '[[链接|同名]]语法',
            callback: () => this.转换同义链接(),
            hotkeys: [{ modifiers: ["Alt"], key: "Q" } ]
        });
        this.addCommand({
            id: 'auto-text',
            name: '智能符号',
            callback: () => this.智能符号(),
            hotkeys: [{ modifiers: ["Alt"], key: ";"}]
        });

        this.addCommand({
            id: 'open-up',
            name: '查看同级上方文件',
            callback: () => this.切换文件列表(-1),
            hotkeys: [{ modifiers: ["Alt","Shift"], key: "I" } ]
        });

        this.addCommand({
            id: 'open-down',
            name: '查看同级下方文件',
            callback: () => this.切换文件列表(1),
            hotkeys: [{ modifiers: ["Alt","Shift"], key: "K" } ]
        });
        this.addCommand({
                id: 'mouse-up',
                name: '游标上移',
                callback: () => this.游标上移(),
                hotkeys: [{ modifiers: ["Alt"], key: "I" } ]
        });
        this.addCommand({
                id: 'mouse-down',
                name: '游标下移',
                callback: () => this.游标下移(),
                hotkeys: [{ modifiers: ["Alt"], key: "K" } ]
        });
        this.addCommand({
            id: 'mouse-left',
            name: '游标左移',
            callback: () => this.游标左移(),
            hotkeys: [{ modifiers: ["Alt"], key: "J" } ]
        });
        this.addCommand({
            id: 'mouse-right',
            name: '游标右移',
            callback: () => this.游标右移(),
            hotkeys: [{ modifiers: ["Alt"], key: "L" } ]
        });
        this.addCommand({
            id: 'mouse-start',
            name: '游标置首',
            callback: () => this.游标置首(),
            hotkeys: [{ modifiers: ["Alt"], key: "U" } ]
        });
        this.addCommand({
            id: 'mouse-end',
            name: '游标置尾',
            callback: () => this.游标置尾(),
            hotkeys: [{ modifiers: ["Alt"], key: "O" } ]
        });
        
        this.addCommand({
            id: 'biaoti0-text',
            name: '取消标题',
            callback: () => this.标题语法(""),
            hotkeys: [{ modifiers: ["Mod"], key: "`" } ]
        });
        this.addCommand({
            id: 'biaoti1-text',
            name: 'H1标题',
            callback: () => this.标题语法("#"),
            hotkeys: [{ modifiers: ["Mod"], key: "1" } ]
        });
        this.addCommand({
            id: 'biaoti2-text',
            name: 'H2标题',
            callback: () => this.标题语法("##"),
            hotkeys: [{ modifiers: ["Mod"], key: "2" } ]
        }); 
        this.addCommand({
            id: 'biaoti3-text',
            name: 'H3标题',
            callback: () => this.标题语法("###"),
            hotkeys: [{ modifiers: ["Mod"], key: "3" } ]
        }); 
        this.addCommand({
            id: 'biaoti4-text',
            name: 'H4标题',
            callback: () => this.标题语法("####"),
            hotkeys: [{ modifiers: ["Mod"], key: "4" } ]
        }); 
        this.addCommand({
            id: 'biaoti5-text',
            name: 'H5标题',
            callback: () => this.标题语法("#####"),
            hotkeys: [{ modifiers: ["Mod"], key: "5" } ]
        }); 
        this.addCommand({
            id: 'biaoti6-text',
            name: 'H6标题',
            callback: () => this.标题语法("######"),
            hotkeys: [{ modifiers: ["Mod"], key: "6" } ]
        });
        this.addCommand({
            id: 'auto-texts',
            name: '自动设置标题',
            callback: () => this.自动设置标题()
        });

        this.addCommand({
            id: 'cuti-text',
            name: '**粗体**',
            callback: () => this.转换粗体(),
            hotkeys: [{ modifiers: ["Alt"], key: "C" } ]
        }); 
        this.addCommand({
            id: 'gaoliang-text',
            name: '==高亮==',
            callback: () => this.转换高亮(),
            hotkeys: [{ modifiers: ["Alt"], key: "G" } ]
        });
        this.addCommand({
            id: 'xieti-text',
            name: '*斜体*',
            callback: () => this.转换斜体(),
            hotkeys: [{ modifiers: ["Alt"], key: "X" } ]
        });
        this.addCommand({
            id: 'shanchu-text',
            name: '~~删除线~~',
            callback: () => this.转换删除线(),
            hotkeys: [{ modifiers: ["Alt"], key: "S" } ]
        });
        this.addCommand({
            id: 'xiahua-text',
            name: '_下划线_',
            callback: () => this.转换下划线(),
            hotkeys: [{ modifiers: ["Alt"], key: "H" } ]
        });
        this.addCommand({
            id: 'zhuozhong-text',
            name: '`行内代码`',
            callback: () => this.转换行内代码(),
            hotkeys: [{ modifiers: ["Alt"], key: "D" } ]
        });     
        this.addCommand({
            id: 'add-daima',
            name: '```代码块```',
            callback: () => this.转换代码块()
        });
        this.addCommand({
            id: 'add-langxian',
            name: '~~~三浪线~~~',
            callback: () => this.转换三浪线()
        });
        this.addCommand({
            id: 'common-text',
            name: '转换无语法文本',
            callback: () => this.转换无语法文本(),
            hotkeys: [{ modifiers: ["Mod","Alt"],key: "Z"}]
        });
        this.addCommand({
            id: 'common-link',
            name: '转为超链接语法()',
            callback: () => this.转为超链接语法()(),
            hotkeys: [{ modifiers: ["Mod","Shift","Alt"],key: "Z"}]
        });
        this.addCommand({
            id: 'copy-text',
            name: '获取无语法文本',
            callback: () => this.获取无语法文本(),
            hotkeys: [{ modifiers: ["Mod","Alt"],key: "C"}]
        });

        this.addCommand({
            id: 'add-up',
            name: '上标语法',
            callback: () => this.转换上标()
        });
        this.addCommand({
            id: 'add-ub',
            name: '下标语法',
            callback: () => this.转换下标()
        });
        this.addCommand({
            id: 'text-Color1',
            name: '转换红色文字',
            callback: () => this.转换文字颜色("#ff0000"),
            hotkeys: [{ modifiers: ["Mod","Shift"], key: "1" } ]
        });
        this.addCommand({
            id: 'text-Color2',
            name: '转换橙色文字',
            callback: () => this.转换文字颜色("#ff9900"),
            hotkeys: [{ modifiers: ["Mod","Shift"], key: "2" } ]
        });
        this.addCommand({
            id: 'text-Color3',
            name: '转换黄色文字',
            callback: () => this.转换文字颜色("#ffff00"),
            hotkeys: [{ modifiers: ["Mod","Shift"], key: "3" } ]
        });
        this.addCommand({
            id: 'text-Color4',
            name: '转换绿色文字',
            callback: () => this.转换文字颜色("#00ff00"),
            hotkeys: [{ modifiers: ["Mod","Shift"], key: "4" } ]
        });
        this.addCommand({
            id: 'text-Color5',
            name: '转换青色文字',
            callback: () => this.转换文字颜色("#6495ED"),
            hotkeys: [{ modifiers: ["Mod","Shift"], key: "5" } ]
        });
        this.addCommand({
            id: 'text-Color6',
            name: '转换蓝色文字',
            callback: () => this.转换文字颜色("#7B68EE"),
            hotkeys: [{ modifiers: ["Mod","Shift"], key: "6" } ]
        });
        this.addCommand({
            id: 'text-Color7',
            name: '转换紫色文字',
            callback: () => this.转换文字颜色("#ff00ff"),
            hotkeys: [{ modifiers: ["Mod","Shift"], key: "7" } ]
        });
        this.addCommand({
            id: 'text-background1',
            name: '转换红色背景',
            callback: () => this.转换背景颜色("#ff0000"),
            hotkeys: [{ modifiers: ["Mod","Alt"], key: "1" } ]
        });
        this.addCommand({
            id: 'text-background2',
            name: '转换橙色背景',
            callback: () => this.转换背景颜色("#ff9900"),
            hotkeys: [{ modifiers: ["Mod","Alt"], key: "2" } ]
        });
        this.addCommand({
            id: 'text-background3',
            name: '转换黄色背景',
            callback: () => this.转换背景颜色("#ffff00"),
            hotkeys: [{ modifiers: ["Mod","Alt"], key: "3" } ]
        });
        this.addCommand({
            id: 'text-background4',
            name: '转换绿色背景',
            callback: () => this.转换背景颜色("#00ff00"),
            hotkeys: [{ modifiers: ["Mod","Alt"], key: "4" } ]
        });
        this.addCommand({
            id: 'text-background5',
            name: '转换青色背景',
            callback: () => this.转换背景颜色("#6495ED"),
            hotkeys: [{ modifiers: ["Mod","Alt"], key: "5" } ]
        });
        this.addCommand({
            id: 'text-background6',
            name: '转换蓝色背景',
            callback: () => this.转换背景颜色("#7B68EE"),
            hotkeys: [{ modifiers: ["Mod","Alt"], key: "6" } ]
        });
        this.addCommand({
            id: 'text-background7',
            name: '转换紫色背景',
            callback: () => this.转换背景颜色("#ff00ff"),
            hotkeys: [{ modifiers: ["Mod","Alt"], key: "7" } ]
        });

        this.addCommand({
            id: 'add-todo',
            name: '转换待办状态',
            callback: () => this.转换待办列表()
        });
        this.addCommand({
            id: 'add-tiankong',
            name: '转换挖空',
            callback: () => this.转换挖空()
        });
        this.addCommand({
            id: 'ying-zhong',
            name: '英转中文标点',
            callback: () => this.英转中文标点()
        });
        this.addCommand({
            id: 'zhong-ying',
            name: '中转英文标点',
            callback: () => this.中转英文标点()
        });
        this.addCommand({
            id: 'list-mermaid',
            name: '列表转为图示',
            callback: () => this.列表转为图示() 
        });
        this.addCommand({
            id: 'file-path',
            name: '转换路径',
            callback: () => this.转换路径()
        });
        this.addCommand({
            id: 'jian-fan',
            name: '简体转繁',
            callback: () => this.简体转繁()
        });
        this.addCommand({
            id: 'fan-jian',
            name: '繁体转简',
            callback: () => this.繁体转简()
        }); 
        this.addCommand({
            id: 'add-kh1',
            name: '【选文】',
            callback: () => this.括选文本1(),
        });
        this.addCommand({
            id: 'add-kh2',
            name: '（选文）',
            callback: () => this.括选文本2(),
        });
        this.addCommand({
            id: 'add-kh3',
            name: '「选文」',
            callback: () => this.括选文本3(),
        });
        this.addCommand({
            id: 'add-kh4',
            name: '《选文》',
            callback: () => this.括选文本4(),
        });
        
        this.addCommand({
            id: 'paste-html',
            name: '获取富文本()',
            callback: () => this.获取富文本()(),
            hotkeys: [{ modifiers: ["Mod","Shift","Alt"], key: "V" } ]
        });
        this.addCommand({
            id: 'paste-form',
            name: '智能粘贴',
            callback: () => this.智能粘贴(),
            hotkeys: [{ modifiers: ["Mod","Alt"], key: "V" } ]
        });
        this.addCommand({
            id: 'edit-jiucuo',
            name: '修复错误语法',
            callback: () => this.修复错误语法()
        });
        this.addCommand({
            id: 'del-line2',
            name: '修复意外断行',
            callback: () => this.修复意外断行()
        });
        this.addCommand({
            id: 'search-text',
            name: '搜索当前文本',
            callback: () => this.搜索当前文本()
        });
        this.addCommand({
            id: 'delete-list',
            name: '删除当前段落',
            callback: () => this.删除当前段落()
        });

        this.addCommand({
            id: 'parent-biaozhu',
            name: '光标向上跳转',
            callback: () => this.光标跳转("上"),
            hotkeys: [{ modifiers: ["Alt","Shift"], key: "J" } ]
        });
        this.addCommand({
            id: 'next-biaozhu',
            name: '光标向下跳转',
            callback: () => this.光标跳转("下"),
            hotkeys: [{ modifiers: ["Alt","Shift"], key: "L" } ]
        });
        
        this.addCommand({
            id: 'Selection-text',
            name: '选择当前整段',
            callback: () => this.选择当前整段()
        });
        this.addCommand({
            id: 'Selection-juzi',
            name: '选择当前整句',
            callback: () => this.选择当前整句()
        });
        this.addCommand({
            id: 'Selection-markdown',
            name: '选择当前语法',
            callback: () => this.选择当前语法()
        });
        this.addCommand({
            id: 'tiqu-text',
            name: '获取标注文本',
            callback: () => this.获取标注文本()
        });
        this.addCommand({
            id: 'copy-filePath',
            name: '获取相对路径',
            callback: () => this.获取相对路径()  
        });
        this.addCommand({
            id: 'modify-fileName',
            name: '指定当前文件名',
            callback: () => this.指定当前文件名()  
        });
        this.addCommand({
            id: 'iframe-URL',
            name: '嵌入当前网址页面',
            callback: () => this.嵌入当前网址页面() 
        });

        this.addCommand({
            id: 'zhe-lines',
            name: '折叠当前同级标题',
            callback: () => this.折叠当前同级标题(),
            hotkeys: [{ modifiers: ["Mod","Shift","Alt"], key: "D" } ]
        });
        this.addCommand({
            id: 'add-lines',
            name: '批量插入空行',
            callback: () => this.批量插入空行(),
            hotkeys: [{ modifiers: ["Mod","Shift"], key: "L" } ]    
        });
        this.addCommand({
            id: 'add-line1',
            name: '上方插入空行',
            callback: () => this.上方插入空行(), 
        });
        this.addCommand({
            id: 'add-line2',
            name: '下方插入空行',
            callback: () => this.下方插入空行()
        });
        this.addCommand({
            id: 'del-lines',
            name: '批量去除空行',
            callback: () => this.批量去除空行(),
            hotkeys: [{ modifiers: ["Mod","Alt"], key: "l" } ]
        });
        this.addCommand({
            id: 'add-twoSpace',
            name: '首行缩进两字符',
            callback: () => this.首行缩进两字符()
        });
        this.addCommand({
            id: 'add-space',
            name: '末尾追加空格',
            callback: () => this.末尾追加空格()
        });
        this.addCommand({
            id: 'del-space',
            name: '去除末尾空格',
            callback: () => this.去除末尾空格()
        });
        this.addCommand({
            id: 'add-allSpspace',
            name: '添加中英间隔',
            callback: () => this.添加中英间隔()
        });
        this.addCommand({
            id: 'del-allSpspace',
            name: '去除所有空格',
            callback: () => this.去除所有空格()
        });

        this.addSettingTab(new editSettingsTab(this.app, this));
        this.loadSettings();

        this.registerEvent(this.app.workspace.on('editor-change', function (file) {
            if (file) {
                编辑中 = true;
                按上档键 =false
            };
        }));

        document.addEventListener('mouseup', (e) => {
            所选文本 = this.获取所选文本 ();
            if(所选文本==null){
                return
            }else if(isGLS){
                this.转换高亮();
            }else if(isCTS){
                this.转换粗体();
            }else if(isXTS){
                this.转换斜体();
            }else if(isSCS){
                this.转换删除线();
            }else if(isXHS){
                this.转换下划线();
            }else if(isSB){
                this.转换上标();
            }else if(isXB){
                this.转换下标();
            };               
        });

        document.addEventListener('keydown',(e) =>{
            if(e.key == "Shift"){
                按上档键 = true;
            }

            if (e.key == "Enter"){
                var dn1,dn2;
                let 代码块内 = false;
                this.获取编辑器信息 ();
                let 上行文本 = 编辑模式.getLine(当前行号-1);
                var 缩进字符 = 上行文本.match(/^[\t\s]*/)[0];
                //console.log("上行文本\n"+上行文本);
                if(编辑中){
                    var 头代码 = 选至文首.match(/^```/mg);
                    var 尾代码 = 选至文末.match(/^```/mg);
                    let 在列表行 = 当前行文本.search(/^[\t ]*(\-|\d+\.) /);
                    //console.log(this.settings.twoEnter+" 缓存"+在列表行);
                    var reg1 = /^[\t ]+$/m;
                    var reg2 = /^[\t ]*\/\//m;
                    if(头代码!=null && 尾代码!=null){
                        dn1 = 头代码.length;
                        dn2 = 尾代码.length;

                        if(dn1%2==1 && dn2%2==1){
                            代码块内 = true;
                            console.log("当前光标处在代码块内！");
                            //在代码块内换行，视上行代码末尾符号的特点进行恰当缩进。
                            var 缩进文本 = "";
                            var 缩进次数,i=0;
                            //console.log("|"+缩进字符+"|");
                            if(上行文本.match(reg1)!=null){
                                缩进文本=历史缩进;
                            }else if(上行文本.match(/[;\}]$/m)!=null || 上行文本.match(reg2)!=null){
                                缩进文本 = 缩进字符+"";
                            }else if(上行文本.match(/[\{\)]$/m)!=null){
                                //console.log("|"+缩进字符+"||||");
                                缩进文本 = 缩进字符+"	";
                            }else if(上行文本==""){
                                缩进文本="";
                            }
                            //缩进文本=缩进文本.replace(/[\t\s]/g,"|")
                            if(缩进文本 == ""){
                                缩进次数=0;
                            }else{
                                缩进次数 = 缩进文本.length;
                                笔记全文.replaceRange(缩进文本, 当前光标, 当前光标);
                                while (i<缩进次数){
                                    编辑模式.exec("goRight");
                                    i++;
                                }
                            }
                            历史缩进 = 缩进文本;
                        };
                        //console.log("其它位置回车测试");
                    }else if(this.settings.twoEnter && !代码块内 && 在列表行<0){
                        //启用补行功能，且没在列表中，每按下回车补加换行，同时按下Shift键时普通换行
                        //console.log("当前光标在普通文本中");
                        if(按上档键){
                            //console.log("当前为普通换行！");
                            笔记全文.replaceRange("", 当前光标, 当前光标);
                        }else{
                            //console.log("当前为补加换行！");
                            笔记全文.replaceRange("\n", 当前光标, 当前光标);
                            编辑模式.exec("goRight");
                        }
                        
                    };    
                    //console.log("编辑区内回车测试");
                    编辑中 = false;
                }
            };
        });

        /** 以下四个侦听函数备用 */
        /*
        this.registerEvent(this.app.workspace.on('file-open', (file) => {
            if (file && file.path) {
                当前文件 = file;
                当前文件路径 = file.path;
            }
        }));

        this.registerEvent(this.app.vault.on('delete', (file) => {
            if (file && file.path) {
                this.saveSettings();
            }
        }));

        this.registerEvent(this.app.vault.on('rename', (file, oldPath) => {
            if (file && file.path) {
                this.saveSettings();
            }
        }));
        
        this.registerCodeMirror((cm) => {
            let cmEditor = cm;
            let currentExtraKeys = cmEditor.getOption('extraKeys');
            let moreKeys = {
                'Enter': (cm) => {
                    编辑模式 = this.获取编辑模式 ();
                    当前光标 = 编辑模式.getCursor();
                    当前光标.ch = 1000;
                    编辑模式.setCursor(当前光标);
                    编辑模式.refresh();
                }
            };            
        });
        */
    };


    onunload() {
        console.log('卸载插件');
    }

    saveSettings() {
        var settings = this.settings.toJson();
        this.app.vault.adapter.write(this.SETTINGS_PATH, settings);
    }
    loadSettings() {
        this.app.vault.adapter.read(this.SETTINGS_PATH).
            then((content) => this.settings.fromJson(content)).
            catch(error => { console.log("未发现增强插件"); });
    }
    
    /** 以下为基础功能函数 */
    
    获取所选文本() {
        var cmEditor = this.获取编辑模式 ();
        if (!cmEditor) return;
        if (cmEditor.getSelection() == "") {
       		return null;
        } else {
            return cmEditor.getSelection();
        }
    };
    

    获取笔记正文() {
        var cmEditor = this.获取编辑模式 ();
    	if (!cmEditor) return;
        if (cmEditor.getSelection() == "") {
       		return cmEditor.getValue();
        } else {
            return cmEditor.getSelection();
        }
    };

    替换所选文本(Selection) {
        var cmEditor = this.获取编辑模式 ();
        if(Selection==null){
            return;
        }else{
            cmEditor.replaceSelection(Selection);
        };
    };

    替换笔记正文(lines) {
        var cmEditor = this.获取编辑模式 ();
        if (cmEditor.getSelection() == "") {
            cmEditor.setValue(lines);
        } else {
            cmEditor.replaceSelection(lines);
        }
    };

    获取编辑模式() {
        let view = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
        if (!view){return;};
        let cm = view.sourceMode.cmEditor;
        return cm;
    };

    获取编辑器信息 = function() {
        //初始信息获取，最基本函数
        编辑模式 = this.获取编辑模式 ();
        if(编辑模式 == null){return;};
        
        笔记全文 = 编辑模式.getDoc();
        笔记正文 = this.获取笔记正文 ();
        所选文本 = this.获取所选文本 ();
        当前光标 = 编辑模式.getCursor();
        当前行号 = 当前光标.line;
        当前行文本 = 编辑模式.getLine(当前行号);
        选至行首 = 编辑模式.getRange({line:当前行号,ch:0}, 当前光标);
        if(当前行文本!=""){
            选至行尾 = 编辑模式.getRange(当前光标,{line:当前行号,ch:当前行文本.length});
        }else{
            选至行尾 = 编辑模式.getRange(当前光标,{line:当前行号,ch:0});
        };        
        
        末行行号 = 编辑模式.lastLine();
        末行文本 = 编辑模式.getLine(末行行号);
        选至文首 = 编辑模式.getRange({line:0,ch:0},{line:当前行号,ch:0});
        if(末行文本!=""){
            选至文末 = 编辑模式.getRange({line:当前行号,ch:0},{line:末行行号,ch:末行文本.length});
        }else{
            选至文末 = 编辑模式.getRange({line:当前行号,ch:0},{line:末行行号,ch:0});
        };
    };

    /** 以下为自定义功能函数 */
    光标跳转(方向) {
        this.获取编辑器信息 ();
        //var 选择字数=0;
        var 表达式;
        if(编辑模式 == null){return;};
        //new obsidian.Notice(所选文本+"\n"+当前行文本);
        if(所选文本==null){
            var 标题式 = /^\s*#+ [^#]+$/;
            var 列表式 = /^\s*(\- [^\[]|\d+\. ).*$/;
            var 待办式 = /^\s*\- \[[^\[\]]] .*$/;
            var 代码式 = /^```[^`]*$/;
            var 引用式 = /^\>.*$/;
            if(标题式.test(当前行文本)){
                表达式 = 标题式;
            }else if(待办式.test(当前行文本)){
                表达式 = 待办式;
            }else if(列表式.test(当前行文本)){
                表达式 = 列表式;
            }else if(代码式.test(当前行文本)){
                表达式 = 代码式;
            }else if(引用式.test(当前行文本)){
                表达式 = 引用式;
            }else{
                this.选择当前语法 ();
                return;
            }
            console.log('表达式 '+表达式);
            //逐行判断是否符合指定表达式
            for (var i=1;i<=末行行号;i++){
                var 新行号;
                if(方向=="下"){
                    新行号= 当前行号+i;
                }else if(方向=="上"){
                    新行号= 当前行号-i;
                };
                if(新行号<0 || 新行号>末行行号){
                    return;
                }
                var 临时行文本 = 编辑模式.getLine(新行号);
                if(表达式.test(临时行文本)){
                    编辑模式.setCursor({line:新行号,ch:临时行文本.length});
                    break
                };
            };
        }else{
            var 搜索范围="";
            var 加粗式 = /^\*\*[^\*]+\*\*$/;
            var 高亮式 = /^==[^=]+==$/;
            var 注释式 = /^%%[^%]*%%$/;
            var 删除式 = /^~~[^~]*~~$/;
            var 链接式 = /^\[\[[^\[\]]+\]\]$/;
            if(加粗式.test(所选文本)){
                表达式 = /\*\*[^\*]+\*\*/g;
            }else if(高亮式.test(所选文本)){
                表达式 = /==[^=]+==/g;
            }else if(注释式.test(所选文本)){
                表达式 = /%%[^%]*%%/g;
            }else if(删除式.test(所选文本)){
                表达式 = /~~[^~]*~~/g;
            }else if(链接式.test(所选文本)){
                表达式 = /\[\[[^\[\]]+\]\]/g;
            }else{
                表达式 = 所选文本;
            }
            console.log('表达式 '+表达式);
            选至文首 = 编辑模式.getRange({line:0,ch:0},当前光标);
            var 以前字数 = 选至文首.length;
            var 返回位置 = 0;
            var 搜索结果,起始位置,结束位置;
            if(方向=="下"){
                搜索范围 = 编辑模式.getRange(当前光标,{line:末行行号,ch:末行文本.length});
                返回位置 = 搜索范围.search(表达式);
                if(返回位置<0){
                    return
                };
                搜索结果 = 搜索范围.match(表达式)[0];
                //new obsidian.Notice(搜索结果.length);
                起始位置 = 以前字数+返回位置;
                结束位置 = 起始位置+搜索结果.length;
                编辑模式.setSelection({line:0,ch:起始位置}, {line:0,ch:结束位置});
            }else if(方向=="上"){
                搜索范围 = 编辑模式.getRange({line:0,ch:0},{line:当前光标.line,ch:当前光标.ch-所选文本.length});
                if(搜索范围.search(表达式)<0){
                    return
                };
                搜索结果 = 搜索范围.match(表达式).pop();
                返回位置 = 搜索范围.lastIndexOf(搜索结果);
                //new obsidian.Notice(搜索结果);
                结束位置 = 返回位置+搜索结果.length;
                编辑模式.setSelection({line:0,ch:返回位置}, {line:0,ch:结束位置});
            };
            
            
        }
    }

    关闭格式刷() {
        //关闭所有格式刷
        isGLS =false;
        isCTS =false;
        isXTS = false;
        isSCS = false;
        isXHS = false;
        isSB = false;
        isXB = false;
    };

    游标上移() {
        this.获取编辑器信息 ();
        编辑模式.exec("goUp");
    };
    游标下移() {
        this.获取编辑器信息 ();
        编辑模式.exec("goDown");
    };
    游标左移() {
        this.获取编辑器信息 ();
        编辑模式.exec("goLeft");
    };
    游标右移() {
        this.获取编辑器信息 ();
        编辑模式.exec("goRight");
    };
    游标置首() {
        this.获取编辑器信息 ();
        编辑模式.exec("goStart");
    };
    游标置尾() {
        this.获取编辑器信息 ();
        编辑模式.exec("goEnd");
    };

    切换文件列表(_num) {
        this.获取编辑器信息 ();
        当前文件 = this.app.workspace.getActiveFile();
        当前文件路径 = 当前文件.path;
        var 父级文件夹 = 当前文件路径.replace(/[^\\\/]+$/,"");
        
        var 同级文件列表=[];
        this.app.vault.getMarkdownFiles().map((file) => {
            if(file.path==父级文件夹+file.basename+".md"){
                同级文件列表.push(file);
            }
        });
        同级文件列表 = 同级文件列表.sort(function (str1, str2) {
            return str1.path.localeCompare(str2.path, 'zh');
            });
        //new obsidian.Notice(同级文件列表.join("\n"));
        var thisID = 同级文件列表.indexOf(当前文件)+_num;
        if(thisID>同级文件列表.length-1){
            thisID=0;
        }else if(thisID<0){
            thisID=同级文件列表.length-1;
        }
        var xinFile = 同级文件列表[thisID];
        //new obsidian.Notice(父级文件夹+" "+thisID+" "+xinFile);
        this.app.workspace.activeLeaf.openFile(xinFile);
    };

     转换内部链接() {
        let 提示语="";
        let 旧文本="";
        this.获取编辑器信息 ();
        if(所选文本==null){
        	this.替换所选文本 ("[[");
        	return;
        }
        旧文本=所选文本;

        var link = /[\"\|\[\]\?\\\*\<\>\/:]/g;	//是否包含[]()及标点符号
        var link1 = /^([^\[\]]*)!\[+([^\[\]]*)$|^([^\[\]]*)\[+([^\[\]]*)$|^([^\[\]]*)\]+([^\[\]]*)$|^([^\[\]]*)\[([^\[\]]*)\]([^\[\]]*)$/g;	//是否只包含一侧的[[或]]
  		var link2 = /^[^\[\]]*(\[\[[^\[\]]*\]\][^\[\]]*)+$/g;	//是否包含N组成对的内链语法
  		var link4 = /([^\[\]\(\)\r\n]*)(\n*)(http.*)/mg;	//是否包含 说明文本&网址
	  	var link5 = /!?\[([^\[\]\r\n]*)(\n*)\]\((http[^\(\)]*)\)/mg;	//是否包含 [说明文本](网址)
  		var link8 = /([、\n])/g;
	  	if (link.test(所选文本)) {
	  		if (link1.test(所选文本)){
                new obsidian.Notice("划选内容不符合内链语法格式！");
	  			return;
	  		}else if (link2.test(所选文本)){
                提示语="内容包含内链语法格式，已经去除[[]]！";
	  			所选文本 = 所选文本.replace(/(\[\[(.*\|)*)/g,"");
                所选文本 = 所选文本.replace(/\]\]/g,"");
	  		}else if(link5.test(所选文本)){
	  			所选文本 = 所选文本.replace(link5,"$1$3");
                提示语="内容包含有[]()链接语法，已经去除符号！";
	  		}else if(link4.test(所选文本)){
	  			所选文本 = 所选文本.replace(link4,"[$1]($3)");
	  			所选文本 = 所选文本.replace("[\r\n]","");
                提示语="内容包含有说明文本和网址，已经转换！";
	  		}else{
                new obsidian.Notice("文件名不能包含下列字符:\*\"\\\/\<\>\:\|\?");
                return;
            }
		}else{
            提示语="内容未包含内链语法格式，需要转换";
			if (link8.test(所选文本)){
				所选文本 = 所选文本.replace(link8, "]]$1[[");
			}
			所选文本 = "[[" + 所选文本 + "]]";
		}
        console.log("您划选了 "+旧文本+"\n"+提示语);
        this.替换所选文本 (所选文本);        
    };

    转换同义链接() {
        this.获取编辑器信息 ();
        if(所选文本==null){
            this.替换所选文本 ("[[");
            return;
        }
        var lNum = 所选文本.length +3
        var link = /[\"\|\[\]\?\\\*\<\>\/:\n]/g;	//是否包含[]()及标点符号
  	  	if (link.test(所选文本)) {
            return;
		}else{
			所选文本 = "[[|" + 所选文本 + "]]";
		}
        this.替换所选文本 (所选文本);
        
        var i=0;
        while (i<lNum){
            编辑模式.exec("goLeft");
            i++;
        }
    };

    转换粗体() {
        this.获取编辑器信息 ();
        if(所选文本==null){
            if(isCTS){
                isCTS = false;
                new obsidian.Notice("已关闭格式刷！");
            }else{
                this.关闭格式刷();
                isCTS = true;
                new obsidian.Notice("「粗体」刷已打开！\n提醒：首尾不要选中标点。");
            }
        }else{
            var link = /(\<b\>|\*\*)([^\*]*)(\<\/b\>|\*\*)/g;	//是否包含加粗符号
            var link1 = /^[^\*](\<\/?b\>|\*\*)[^\*]*$/;	//是否只包含一侧的**
            if (link1.test(所选文本)){
                return; //new obsidian.Notice("只有一侧出现==符号");
            }else if (link.test(所选文本)){
                所选文本 = 所选文本.replace(/(\<\/?b\>|\*\*)/g,"");    //new obsidian.Notice("成对出现**符号");
            }else{
                if(/^\<.*\>$/.test(所选文本)){
                    所选文本 = 所选文本.replace(/^/,"<b>");
                    所选文本 = 所选文本.replace(/$/,"</b>");
                }else{
                    所选文本 = 所选文本.replace(/^([\t\s]*)([^\t\s])/mg,"$1**$2").replace(/([^\t\s])([\t\s]*)$/mg,"$1**$2");
                    所选文本 = 所选文本.replace(/^\*\*\*\*$/mg,"");
                }
                
            }
            this.替换所选文本 (所选文本);
            编辑模式.exec("goRight");
        }
        
    };
    转换高亮() {
        this.获取编辑器信息 ();
        if(所选文本==null){
            if(isGLS){
                isGLS = false;
                new obsidian.Notice("已关闭格式刷！");
            }else{
                this.关闭格式刷();
                isGLS = true;
                new obsidian.Notice("「高亮」刷已打开！");
            }
        }else{
            var link = /==[^=]*==/;	//是否包含高亮符号
            var link1 = /^[^=]*==[^=]*$/;	//是否只包含一侧的==
            if (link1.test(所选文本)){
                return; //new obsidian.Notice("只有一侧出现==符号");
            }else if (link.test(所选文本)){
                所选文本 = 所选文本.replace(/==/g,"");    //new obsidian.Notice("成对出现==符号");
            }else{
                所选文本 = 所选文本.replace(/^([\t\s]*)([^\t\s])/mg,"$1==$2").replace(/([^\t\s])([\t\s]*)$/mg,"$1==$2");
                所选文本 = 所选文本.replace(/^====$/mg,"");
            }
            this.替换所选文本 (所选文本);
            编辑模式.exec("goRight");
        }
        
    };
    转换斜体() {
        this.获取编辑器信息 ();
        if(所选文本==null){
            if(isXTS){
                isXTS = false;
                new obsidian.Notice("已关闭格式刷！");
            }else{
                this.关闭格式刷();
                isXTS = true;
                new obsidian.Notice("「斜体」刷已打开！\n提醒：首尾不要选中标点。");
            }
        }else{
            var link = /\*[^\*]*\*/;	//是否包含高亮符号
            var link1 = /^[^\*]*\*[^\*]*$/;	//是否只包含一侧的\*
            if (link1.test(所选文本)){
                return; //new obsidian.Notice("只有一侧出现\*符号");
            }else if (link.test(所选文本)){
                所选文本 = 所选文本.replace(/\*/g,"");    //new obsidian.Notice("成对出现\*符号");
            }else{
                所选文本 = 所选文本.replace(/^(.*)$/mg,"\*$1\*");
                所选文本 = 所选文本.replace(/^\*\*$/mg,"");
            }
            this.替换所选文本 (所选文本);
            编辑模式.exec("goRight");
        }
    };
    转换删除线() {
        this.获取编辑器信息 ();
        if(所选文本==null){
            if(isSCS){
                isSCS = false;
                new obsidian.Notice("已关闭格式刷！");
            }else{
                this.关闭格式刷();
                isSCS = true;
                new obsidian.Notice("「删除线」刷已打开！");
            }
        }else{
            var link = /~~[^~]*~~/;	//是否包含删除线符号
            var link1 = /^[^~]*~~[^~]*$/;	//是否只包含一侧的~~
            if (link1.test(所选文本)){
                return; //new obsidian.Notice("只有一侧出现~~符号");
            }else if (link.test(所选文本)){
                所选文本 = 所选文本.replace(/~~/g,"");    //new obsidian.Notice("成对出现~~符号");
            }else{
                所选文本 = 所选文本.replace(/^(.*)$/mg,"~~$1~~");
                所选文本 = 所选文本.replace(/^~~~~$/mg,"");
            }
            this.替换所选文本 (所选文本);
            编辑模式.exec("goRight");
        }
        
    };
    转换下划线() {
        this.获取编辑器信息 ();
        if(所选文本==null){
            if(isXHS){
                isXHS = false;
                new obsidian.Notice("已关闭格式刷！");
            }else{
                this.关闭格式刷();
                isXHS = true;
                new obsidian.Notice("「下划线」刷已打开！");
            }
        }else{
            var link = /\<u\>([^\<\>]*)\<\/u\>/mg;	//是否包含下划符号
            var link1 = /^[^\<\>]*\<\/?u\>[^\<\>]*$/;	//是否只包含一侧的<>
            if (link1.test(所选文本)){
                return; //new obsidian.Notice("只有一侧出现<>符号");
            }else if (link.test(所选文本)){
                所选文本 = 所选文本.replace(link,"$1");
            }else{
                所选文本 = 所选文本.replace(/^(.*)$/mg,"<u>$1</u>");
                所选文本 = 所选文本.replace(/^\<u\>\<\/u\>$/mg,"");
            }
            this.替换所选文本 (所选文本);
            编辑模式.exec("goRight");
        }
        
    };
    转换行内代码() {
        this.获取编辑器信息 ();
        if(所选文本==null){return};
        var link = /`[^`]*`/;	//是否包含代码行符号
        var link1 = /^[^`]*`[^`]*$/;	//是否只包含一侧的`

        if (link1.test(所选文本)){
            //new obsidian.Notice("只有一侧出现`符号");
            return;
        }else if (link.test(所选文本)){
            //new obsidian.Notice("成对出现`符号");
            所选文本 = 所选文本.replace(/`/g,"");
        }else{
            //new obsidian.Notice("需要补充`符号");
            所选文本 = 所选文本.replace(/^(.*)$/mg,"`$1`");
        }
        this.替换所选文本 (所选文本);
        编辑模式.exec("goRight");
    };

    转换代码块() {
        this.获取编辑器信息 ();
        var link = /```[^`]+```/;	//是否包含代码行符号
        var link1 = /^[^`]*```[^`]*$/m;	//是否只包含一侧的`
        if(所选文本==null){return};
        所选文本 = 所选文本.replace(/\n/g,"↫");
        if (link1.test(所选文本)){
            //new obsidian.Notice("只有一侧出现```符号");
            return;
        }else if (link.test(所选文本)){
            //new obsidian.Notice("成对出现```符号");
            所选文本 = 所选文本.replace(/↫*```↫?|↫?```↫*/g,"");
        }else{
            //new obsidian.Notice("需要补充```符号");
            所选文本 = 所选文本.replace(/^(.*)$/m,"↫```↫$1↫```↫");
        }
        所选文本 = 所选文本.replace(/↫/g,"\n");
        this.替换所选文本 (所选文本);
        编辑模式.exec("goLeft");
        编辑模式.exec("goLeft");
        编辑模式.exec("goLeft");
        编辑模式.exec("goLeft");
    };

    转换三浪线() {
        this.获取编辑器信息 ();
        var link = /~~~[^~]+~~~/;	//是否包含代码行符号
        var link1 = /^[^~]*~~~[^~]*$/m;	//是否只包含一侧的~
        if(所选文本==null){return};
        所选文本 = 所选文本.replace(/\n/g,"↫");
        if (link1.test(所选文本)){
            //new obsidian.Notice("只有一侧出现~~~符号");
            return;
        }else if (link.test(所选文本)){
            //new obsidian.Notice("成对出现~~~符号");
            所选文本 = 所选文本.replace(/~~~↫?|↫?~~~/g,"");
        }else{
            //new obsidian.Notice("需要补充~~~符号");
            所选文本 = 所选文本.replace(/^(.*)$/m,"~~~↫$1↫~~~");
        }
        所选文本 = 所选文本.replace(/↫/g,"\n");
        this.替换所选文本 (所选文本);
        编辑模式.exec("goRight");
    };

    转换上标() {
        this.获取编辑器信息 ();
        if(所选文本==null){
            if(isSB){
                isSB = false;
                new obsidian.Notice("已关闭格式刷！");
            }else{
                this.关闭格式刷();
                isSB = true;
                new obsidian.Notice("「上标」刷已打开！");
            }
        }else{
            var link = /\<sup\>[^\<\>]*\<\/sup\>/g;	//是否包含<sup>下标</sup>
            var link1 = /\<sup\>[^\<\>\/]*$|^[^\<\>]*\<\/sup\>/g;	//是否只包含一侧的<sup>下标</sup>
            if (link1.test(所选文本)){
                //new obsidian.Notice("只有一侧出现<sup>下标</sup>符号");
                return;
            }else if (link.test(所选文本)){
                所选文本 = 所选文本.replace(/(\<sup\>|\<\/sup\>)/g,"");
            }else{
                所选文本 = 所选文本.replace(/^(.+)$/mg,"\<sup\>$1\<\/sup\>");
                所选文本 = 所选文本.replace(/^\<sup\>\s*\<\/sup\>$/mg,"");
            }
            this.替换所选文本 (所选文本);
            编辑模式.exec("goRight");
        };
    };

    转换下标() {
        this.获取编辑器信息 ();
        if(所选文本==null){
            if(isXB){
                isXB = false;
                new obsidian.Notice("已关闭格式刷！");
            }else{
                this.关闭格式刷();
                isXB = true;
                new obsidian.Notice("「下标」刷已打开！");
            }
        }else{
            var link = /\<sub\>[^\<\>]*\<\/sub\>/g;	//是否包含<sub>下标</sub>
            var link1 = /\<sub\>[^\<\>\/]*$|^[^\<\>]*\<\/sub\>/g;	//是否只包含一侧的<sub>下标</sub>
            if (link1.test(所选文本)){
                return;
            }else if (link.test(所选文本)){
                所选文本 = 所选文本.replace(/(\<sub\>|\<\/sub\>)/g,"");
            }else{
                所选文本 = 所选文本.replace(/^(.+)$/mg,"\<sub\>$1\<\/sub\>");
                所选文本 = 所选文本.replace(/^\<sub\>\s*\<\/sub\>$/mg,"");
            }
            this.替换所选文本 (所选文本);
            编辑模式.exec("goRight");
        };
    };

    转换挖空() {
        this.获取编辑器信息 ();
        var link = /\{\{c\d::[^\{\}]+\}\}/g;	//是否包含{{c*::}}
        var link1 = /\{\{c[^\{\}]*$|^[^\{\}]*\}\}/g;	//是否只包含一侧的{{c*::}}

        if (link1.test(所选文本)){
            return;
        }else if (link.test(所选文本)){
            所选文本 = 所选文本.replace(/(\{\{c\d::|\}\})/g,"");
        }else{
            所选文本 = 所选文本.replace(/^(.+)$/mg,"\{\{c1::$1\}\}");
        }
        this.替换所选文本 (所选文本);
    };

    选择当前整段 () {    
        this.获取编辑器信息 ();
        if(当前行文本!=""){
            编辑模式.setSelection({line:当前行号,ch:0}, {line:当前行号,ch:当前行文本.length});
        };
    };

    选择当前整句 () {
        this.获取编辑器信息 ();
        var 句前 = 选至行首.match(/(?<=(^|[。？！]))[^。？！]*$/)[0];
        var 句后 = 选至行尾.match(/^[^。？！]*([。？！]|$)/)[0];
        var _length1 = 选至行首.length-句前.length;
        var _length2 = 选至行首.length+句后.length;
        //new obsidian.Notice(句前+"\n光标\n"+句后);
        编辑模式.setSelection({line:当前行号,ch:_length1}, {line:当前行号,ch:_length2});
    };

    选择当前语法 () {
        this.获取编辑器信息 ();
        var 句前 = 选至行首.match(/(\*\*|==|~~|%%|\[\[)[^\*=~%\[\]]*$/m)[0];
        var 句后 = 选至行尾.match(/^[^\*=~%\[\]]*(\*\*|==|~~|%%|\]\])/m)[0];
        var _length1 = 选至行首.length-句前.length;
        var _length2 = 选至行首.length+句后.length;
        //new obsidian.Notice(句前+"\n光标\n"+句后);
        编辑模式.setSelection({line:当前行号,ch:_length1}, {line:当前行号,ch:_length2});
    };

    重复当前行 () {
        this.获取编辑器信息 ();
        var 新行文本 = "\n" + 当前行文本;
        笔记全文.replaceRange(新行文本, {line:当前行号,ch:当前行文本.length}, {line:当前行号,ch:当前行文本.length});
    };

    智能符号 () {
        var 标前两字 = 编辑模式.getRange({line:当前行号,ch:选至行首.length-2}, 当前光标);
        var 标后两字 = 编辑模式.getRange(当前光标,{line:当前行号,ch:选至行首.length+2});
        //new obsidian.Notice("标前两字\n"+标前两字+"\n\n标后两字：\n"+标后两字);

        if(选至行尾.match(/^(\]\]|\=\=|\*\*|\~\~)/)){
            编辑模式.exec("goRight");
            编辑模式.exec("goRight");   //如果下个字符是后括号，则跃过
        }else if(选至行尾.match(/^[$》〉］｝】〗〕』」）}\)]/)){
            编辑模式.exec("goRight");   //如果下个字符是后括号，则跃过
        }else if(标前两字.match(/^[【\[][（\(]$/)){
            笔记全文.replaceRange("〖", {line:当前行号,ch:选至行首.length-2}, 当前光标);
        }else if(标前两字.match(/^[（\(][《\<]$/)){
            笔记全文.replaceRange("〈", {line:当前行号,ch:选至行首.length-2}, 当前光标);
        }else if(标前两字.match(/^[\(（][【\[]$/)){
            笔记全文.replaceRange("〔", {line:当前行号,ch:选至行首.length-2}, 当前光标);
        }else if(标前两字.match(/^[“\"][【\[]$/)){
            笔记全文.replaceRange("『", {line:当前行号,ch:选至行首.length-2}, 当前光标);
        }else if(标前两字.match(/^[‘\'][【\[]$/)){
            笔记全文.replaceRange("「", {line:当前行号,ch:选至行首.length-2}, 当前光标);
        }else if(标前两字.match(/^……$/)){
            笔记全文.replaceRange("^", {line:当前行号,ch:选至行首.length-2}, 当前光标);
        }else if(标前两字.match(/^￥￥$/)){
            笔记全文.replaceRange("$$", {line:当前行号,ch:选至行首.length-2}, 当前光标);
            编辑模式.exec("goLeft");
        }else if(选至行首.match(/《[^《》〈〉｛｝【】〖〗〔〕（）『』「」]*$/)){
            笔记全文.replaceRange("》", 当前光标, 当前光标);
            编辑模式.exec("goRight");
        }else if(选至行首.match(/〈[^《》〈〉［］｛｝【】〖〗〔〕（）『』「」]*$/)){
            笔记全文.replaceRange("〉", 当前光标, 当前光标);
            编辑模式.exec("goRight");
        }else if(选至行首.match(/［[^《》〈〉［］｛｝【】〖〗〔〕（）『』「」]*$/)){
            笔记全文.replaceRange("］", 当前光标, 当前光标);
            编辑模式.exec("goRight");
        }else if(选至行首.match(/｛[^《》〈〉［］｛｝【】〖〗〔〕（）『』「」]*$/)){
            笔记全文.replaceRange("｝", 当前光标, 当前光标);
            编辑模式.exec("goRight");
        }else if(选至行首.match(/【[^《》〈〉［］｛｝【】〖〗〔〕（）『』「」]*$/)){
            笔记全文.replaceRange("】", 当前光标, 当前光标);
            编辑模式.exec("goRight");
        }else if(选至行首.match(/〖[^《》〈〉［］｛｝【】〖〗〔〕（）『』「」]*$/)){
            笔记全文.replaceRange("〗", 当前光标, 当前光标);
            编辑模式.exec("goRight");
        }else if(选至行首.match(/〔[^《》〈〉［］｛｝【】〖〗〔〕（）『』「」]*$/)){
            笔记全文.replaceRange("〕", 当前光标, 当前光标);
            编辑模式.exec("goRight");
        }else if(选至行首.match(/『[^《》〈〉［］｛｝【】〖〗〔〕（）『』「」]*$/)){
            笔记全文.replaceRange("』", 当前光标, 当前光标);
            编辑模式.exec("goRight");
        }else if(选至行首.match(/「[^《》〈〉［］｛｝【】〖〗〔〕（）『』「」]*$/)){
            笔记全文.replaceRange("」", 当前光标, 当前光标);
            编辑模式.exec("goRight");
        }else if(选至行首.match(/（[^《》〈〉［］｛｝【】〖〗〔〕（）『』「」]*$/)){
            笔记全文.replaceRange("）", 当前光标, 当前光标);
            编辑模式.exec("goRight");
        }else if(选至行首.match(/^》$/)){
            笔记全文.replaceRange(">", {line:当前行号,ch:0}, 当前光标);
        }else if(选至行首.match(/^、$/)){
            笔记全文.replaceRange("/", {line:当前行号,ch:0}, 当前光标);
        }else if(选至行首.match(/\[\[[^=\[\]\*~]*$/)){
            笔记全文.replaceRange("]]", 当前光标, 当前光标);
            编辑模式.exec("goRight");
            编辑模式.exec("goRight");
        }else if(选至行首.match(/==[^=\[\]\*~]*$/)){
            笔记全文.replaceRange("==", 当前光标, 当前光标);
            编辑模式.exec("goRight");
            编辑模式.exec("goRight");
        }else if(选至行首.match(/\*\*[^=\[\]\*~]*$/)){
            笔记全文.replaceRange("**", 当前光标, 当前光标);
            编辑模式.exec("goRight");
            编辑模式.exec("goRight");
        }else if(选至行首.match(/%%[^=\[\]\*~%]*$/)){
            笔记全文.replaceRange("%%", 当前光标, 当前光标);
            编辑模式.exec("goRight");
            编辑模式.exec("goRight");
        }else if(选至行首.match(/~~[^=\[\]\*~]*$/)){
            笔记全文.replaceRange("~~", 当前光标, 当前光标);
            编辑模式.exec("goRight");
            编辑模式.exec("goRight");
        }else if(选至行首.match(/^(dataview|dv)$/i)){
            笔记全文.replaceRange("```dataview\n\n```\n", {line:当前行号,ch:0}, 当前光标);
            编辑模式.exec("goLeft");
            编辑模式.exec("goUp");
        }else if(选至行首.match(/^(mermaid|mm)$/i)){
            笔记全文.replaceRange("```mermaid\ngraph TD\n\nA[2021]\nB[2022]\n\nA-->B\n```\n", {line:当前行号,ch:0}, 当前光标);
        }else if(选至行首.match(/^(query|qy)$/i)){
            笔记全文.replaceRange("```query\n\n```\n", {line:当前行号,ch:0}, 当前光标);
            编辑模式.exec("goLeft");
            编辑模式.exec("goUp");
        }else if(选至行首.match(/^(JavaScript|js)$/i)){
            笔记全文.replaceRange("```JavaScript\n\n```\n", {line:当前行号,ch:0}, 当前光标);
            编辑模式.exec("goLeft");
            编辑模式.exec("goUp");
        }else if(选至行首.match(/^```js$/i)){
            笔记全文.replaceRange("```JavaScript", {line:当前行号,ch:0}, 当前光标);
            编辑模式.exec("goDown");
        }else if(选至行首.match(/^(Java|ja)$/i)){
            笔记全文.replaceRange("```Java\n\n```\n", {line:当前行号,ch:0}, 当前光标);
            编辑模式.exec("goLeft");
            编辑模式.exec("goUp");
        }else if(选至行首.match(/^```ja$/i)){
            笔记全文.replaceRange("```Java", {line:当前行号,ch:0}, 当前光标);
            编辑模式.exec("goDown");
        }else if(选至行首.match(/^(Python|py)$/i)){
            笔记全文.replaceRange("```Python\n\n```\n", {line:当前行号,ch:0}, 当前光标);
            编辑模式.exec("goLeft");
            编辑模式.exec("goUp");
        }else if(选至行首.match(/^```py$/i)){
            笔记全文.replaceRange("```Python", {line:当前行号,ch:0}, 当前光标);
            编辑模式.exec("goDown");
        }else if(选至行首.match(/^(CSS)$/i)){
            笔记全文.replaceRange("```CSS\n\n```\n", {line:当前行号,ch:0}, 当前光标);
            编辑模式.exec("goLeft");
            编辑模式.exec("goUp");
        }
    };

    标题语法(_str) {
        var link = eval("/^"+_str+" ([^#]+)/");	//是否包含几个#符号
       this.获取编辑器信息 ();
        var 新文本 = "";
        var 新定位 = 选至行首.replace(/^#+\s/,"");
        if(_str==""){
            新文本 = 当前行文本.replace(/^\s*#+\s/,"");
        }else if (link.test(当前行文本)){
            新文本 = 当前行文本.replace(link,"$1");
        }else{
            新文本 = 当前行文本.replace(/^#+[ ]+/,"");
            新文本 = 新文本.replace(/^\s*/,_str+" ");
            新定位 = _str+" "+新定位;
        }
        笔记全文.replaceRange(新文本, {line:当前行号,ch:0}, {line:当前行号,ch:当前行文本.length});
        编辑模式.setCursor({line:当前行号,ch:新定位.length});
    };

    转换文字颜色(_color) {
        var _html0 = /\<font color=[0-9a-zA-Z#]+[^\<\>]*\>[^\<\>]+\<\/font\>/g;
        var _html1 = /^\<font color=[0-9a-zA-Z#]+[^\<\>]*\>([^\<\>]+)\<\/font\>$/;
        var _html2 = '\<font color='+_color+'\>$1\<\/font\>';
        var _html3 = /\<font color=[^\<]*$|^[^\>]*font\>/g;	//是否只包含一侧的<>
        //new obsidian.Notice(所选文本);
        this.获取编辑器信息 ();
        if(所选文本==null){return};
        if (_html3.test(所选文本)){
            return; //new obsidian.Notice("不能转换颜色！");
        }else if (_html0.test(所选文本)){
            if(_html1.test(所选文本)){
                //new obsidian.Notice("替换颜色！");
                所选文本 = 所选文本.replace(_html1,_html2);
            }else{
                所选文本 = 所选文本.replace(/\<font color=[0-9a-zA-Z#]+[^\<\>]*?\>|\<\/font\>/g,""); 
            }
        }else{
            所选文本 = 所选文本.replace(/^(.+)$/mg,_html2);  //new obsidian.Notice("可以转换颜色！");
        }
        this.替换所选文本 (所选文本);
    };

    转换背景颜色(_color) {
        var _html0 = /\<span style=[\"'][^\<\>]*color:[0-9a-zA-Z#]+[\"'][^\<\>]*\>[^\<\>]+\<\/span\>/g;
        var _html1 = /^\<span style=[\"'][^\<\>]*color:[0-9a-zA-Z#]+[\"'][^\<\>]*\>([^\<\>]+)\<\/span\>$/;
        var _html2 = '\<span style=\"background\-color:'+_color+'\"\>$1\<\/span\>';
        var _html3 = /\<span style=[^\<]*$|^[^\>]*span\>/g;	//是否只包含一侧的<>
        //new obsidian.Notice(所选文本);
        this.获取编辑器信息 ();
        if(所选文本==null){return};
        if (_html3.test(所选文本)){
            return; //new obsidian.Notice("不能转换颜色！");
        }else if (_html0.test(所选文本)){
            if(_html1.test(所选文本)){
                所选文本 = 所选文本.replace(_html1,_html2); 
            }else{
                所选文本 = 所选文本.replace(/\<span style=[\"'][^\<\>]*color:[0-9a-zA-Z#]+[\"'][^\<\>]*\>|\<\/span\>/g,"");
                //new obsidian.Notice("需要去除颜色！");
            }
        }else{
            所选文本 = 所选文本.replace(/^(.+)$/mg,_html2);  //new obsidian.Notice("可以转换颜色！");
        }
        this.替换所选文本 (所选文本);
    };
    
    转换无语法文本() {
        this.获取编辑器信息 ();
        var mdText = /(^#+\s|(?<=^|\s*)#|^\>|^\- \[( |x)\]|^\+ |\<[^\<\>]+?\>|^1\. |^\s*\- |^\-+$|^\*+$)/mg;
        if(所选文本 == null){
            if(isCTS || isGLS || isSB || isSCS || isXB || isXHS || isXTS){
                this.关闭格式刷();
                new obsidian.Notice("已关闭格式刷！");
            }else{
                //new obsidian.Notice("请先划选部分文本，再执行命令！");
                var reg1 = /(~~|%%|==|\*\*?|\<[^\<\>]*?\>|!?\[\[*|`|_|!?\[)([^!#=\[\]\<\>\`_\*~\(\)]*)$/;
                var reg2 = /^([^!=\[\]\<\>\`_\*~\(\)]*)(~~|%%|==|\*\*?|\<[^\<\>]*\>|\]\]|`|_|\]\([^\(\)\[\]]*\))/;
                if(选至行首.match(reg1)!=null && 选至行尾.match(reg2)!=null){
                    选至行首 = 选至行首.replace(reg1,"$2");
                    选至行尾 = 选至行尾.replace(reg2,"$1");
                    var _ch = 选至行首.length;
                    笔记全文.replaceRange(选至行首+选至行尾, {line:当前行号,ch:0},{line:当前行号,ch:当前行文本.length});
                    编辑模式.setCursor({line:当前行号,ch:_ch});
                }
            }
        }else{
            所选文本 = 所选文本.replace(mdText,"");
            所选文本 = 所选文本.replace(/^[ ]+|[ ]+$/mg,"");
            所选文本 = 所选文本.replace(/\!?\[\[([^\[\]\|]*\|)*([^\(\)\[\]]+)\]\]/g,"$2");
            所选文本 = 所选文本.replace(/\!?\[+([^\[\]\(\)]+)\]+\(([^\(\)]+)\)/g,"$1");
            所选文本 = 所选文本.replace(/`([^`]+)`/g,"$1");
            所选文本 = 所选文本.replace(/_([^_]+)_/g,"$1");
            所选文本 = 所选文本.replace(/==([^=]+)==/g,"$1");
            所选文本 = 所选文本.replace(/\*\*?([^\*]+)\*\*?/g,"$1");
            所选文本 = 所选文本.replace(/~~([^~]+)~~/g,"$1");
            所选文本 = 所选文本.replace(/(\r*\n)+/mg,"\r\n");
            this.替换所选文本 (所选文本);
        }
    };

    转为超链接语法() {
		this.获取编辑器信息 ();
        if (!笔记正文) return;
        笔记正文 = 笔记正文.replace(/\[\[([^\[\]]+)\]\]/g,"[$1]($1)");
        笔记正文 = 笔记正文.replace(/(?<=\]\([^\s]*)\s(?=[^\s]*\))/g,"%20");
        this.替换笔记正文 (笔记正文);
    };

    括选文本1() {
        var link = /.*【[^【】]+】.*/g;	//是否包含【】
        var link1 = /【[^【】]*$|^[^【】]*】/g;	//是否只包含一侧的【】
        this.获取编辑器信息 ();
        if(所选文本==null){return};
        if (link1.test(所选文本)){
            return;
        }else if (link.test(所选文本)){
            所选文本 = 所选文本.replace(/[【】]/g,"");
        }else{
            所选文本 = 所选文本.replace(/^(.+)$/mg,"【$1】");
            所选文本 = 所选文本.replace(/^【\s*】$/mg,"");
        }
        this.替换所选文本 (所选文本);
    };

    括选文本2() {
        var link = /.*（[^（）]*）.*/g;	//是否包含【】
        var link1 = /（[^（）]*$|^[^（）]*）/g;	//是否只包含一侧的【】
        this.获取编辑器信息 ();
        if(所选文本==null){return};
        if (link1.test(所选文本)){
            return;
        }else if (link.test(所选文本)){
            所选文本 = 所选文本.replace(/[（）]/g,"");
        }else{
            所选文本 = 所选文本.replace(/^(.+)$/mg,"($1)");
            所选文本 = 所选文本.replace(/^(\s*)$/mg,"");
        }
        this.替换所选文本 (所选文本);
    };

    括选文本3() {
        var link = /.*「[^「」]*」.*/g;	//是否包含「」
        var link1 = /「[^「」]*$|^[^「」]*」/g;	//是否只包含一侧的「
        this.获取编辑器信息 ();
        if(所选文本==null){return};
        if (link1.test(所选文本)){
            return;
        }else if (link.test(所选文本)){
            所选文本 = 所选文本.replace(/[「」]/g,"");
        }else{
            所选文本 = 所选文本.replace(/^(.+)$/mg,"「$1」");
            所选文本 = 所选文本.replace(/^「\s*」$/mg,"");
        }
        this.替换所选文本 (所选文本);
    };

    括选文本4() {
        var link = /.*《[^《》]*》.*/;	//是否包含《》
        var link1 = /《[^《》]*$|^[^《》]*》/;	//是否只包含一侧的《
        this.获取编辑器信息 ();
        if(所选文本==null){return};
        if (link1.test(所选文本)){
            return;
        }else if (link.test(所选文本)){
            所选文本 = 所选文本.replace(/[《》]/g,"");
        }else{
            所选文本 = 所选文本.replace(/^(.+)$/mg,"《$1》");
            所选文本 = 所选文本.replace(/^《\s*》$/mg,"");
        }
        this.替换所选文本 (所选文本);
    };

    删除当前段落() {
        //优化Ob自带功能，支持删除光标所在链接文本，修正有序列表的序号
        this.获取编辑器信息 ();
        var reg = /^[\t\s]*\d+(?=\.\s[^\s])/mg;
        if(当前行文本.match(reg)==null){
            console.log("当前不是列表");
            var reg1 =/^(.*\[\[)[^\[]+$/;
            var reg2 = /^[^\]]+(\]\].*)$/;

            //当前光标在[[]]中间，只删除链接文字
            if(reg1.test(选至行首) && reg2.test(选至行尾)){
                new obsidian.Notice("优先删除内部链接，可以切换标题！");
                选至行首 = 选至行首.replace(reg1,"$1");
                选至行尾 = 选至行尾.replace(reg2,"$1");
                笔记全文.replaceRange(选至行首+选至行尾, {line:当前行号,ch:0},{line:当前行号,ch:当前行文本.length});
                编辑模式.setCursor({line:当前行号,ch:选至行首.length});
            }else{
                //当前所在行为普通文本，直接删除
                笔记全文.replaceRange("", {line:当前行号,ch:0},{line:Number(当前行号+1),ch:0});
            }
        }else{
            //当前所在行为有序列表的一项，则调小后表部分的序号
            选至文末 = 选至文末.replace(/\n/g,"↫");
            var 后表部分 = 选至文末.match(/^([\t\s]*\d+\.\s[^↫]*↫)+/)[0].replace(/↫/g,"\n"); //替换为单行文本，再截取后表部分
            var 后表行数 = 后表部分.match(/\n/g).length;    //计算换行次数
            var 缩进字符 = 当前行文本.match(/^[\t\s]*(?=\d)/)[0];
            var reg3 = eval("/(?<=^"+缩进字符+")\\d+(?=\\.*\\s)/mg");    //按当前行的缩进格式进行查找替换
            后表部分 = 后表部分.replace(reg3, function(a){return a*1-1;});
            后表部分 = 后表部分.replace(/^[^\n]*\n/,"");
            //new obsidian.Notice("选至文末\n"+选至文末);
            笔记全文.replaceRange(后表部分, {line:当前行号,ch:0},{line:当前行号+后表行数,ch:编辑模式.getLine(当前行号+后表行数).length});
        };
    };
    
    转换待办列表() {
        this.获取编辑器信息 ();
        var 当前新文本 = 当前行文本.replace(/(?<=^\s*([\-\+]|[0-9]+\.)\s\[) (?=\]\s[^\s])/mg,"x☀");
        当前新文本 = 当前新文本.replace(/(?<=^\s*([\-\+]|[0-9]+\.)\s\[)x(?=\]\s[^\s])/mg,"-☀");
        当前新文本 = 当前新文本.replace(/(?<=^\s*([\-\+]|[0-9]+\.)\s\[)\-(?=\]\s[^\s])/mg,"!☀");
        当前新文本 = 当前新文本.replace(/(?<=^\s*([\-\+]|[0-9]+\.)\s\[)\!(?=\]\s[^\s])/mg,"?☀");
        当前新文本 = 当前新文本.replace(/(?<=^\s*([\-\+]|[0-9]+\.)\s\[)\?(?=\]\s[^\s])/mg,">☀");
        当前新文本 = 当前新文本.replace(/(?<=^\s*([\-\+]|[0-9]+\.)\s\[)\>(?=\]\s[^\s])/mg,"<☀");
        当前新文本 = 当前新文本.replace(/(?<=^\s*([\-\+]|[0-9]+\.)\s\[)\<(?=\]\s[^\s])/mg,"+☀");
        当前新文本 = 当前新文本.replace(/(?<=^\s*([\-\+]|[0-9]+\.)\s\[)\+(?=\]\s[^\s])/mg," ☀");
        当前新文本 = 当前新文本.replace(/(?<=^\s*([\-\+]|[0-9]+\.)\s\[[\sx\-\+\?\!\<\>])☀(?=\]\s[^\s])/mg,"");
        笔记全文.replaceRange(当前新文本, {line:当前行号,ch:0},{line:当前行号,ch:当前行文本.length});
    };

    自动设置标题() {
		this.获取编辑器信息 ();
        if (!笔记正文) return;
        笔记正文 = 笔记正文.replace(/\r?\n/g,"↫");
        笔记正文 = 笔记正文.replace(/↫\s*↫/g,"↫↫");
        笔记正文 = 笔记正文.replace(/\s*(?=↫)/g,"");
        笔记正文 = 笔记正文.replace(/(?<=^|↫)([^#`\[\]\(\)↫]{3,}[^\.\?\!:,0-9，：。？！）↫])(?=↫|$)/g,"↫### $1↫");
        笔记正文 = 笔记正文.replace(/#+([^#↫]+)↫*$/mg,"$1");    //取消末行标题
        笔记正文 = 笔记正文.replace(/↫{3,}/g,"\r\n\r\n");
        笔记正文 = 笔记正文.replace(/↫/g,"\r\n");
        this.替换笔记正文 (笔记正文);
    };

    指定当前文件名 () {
        this.获取编辑器信息 ();
        当前文件路径 = this.app.workspace.getActiveFile().path;
        if (所选文本 == ""){return};
        //navigator.clipboard.writeText(所选文本);
        //this.app.workspace.activeLeaf.replaceSelection(所选文本);
        this.app.vault.adapter.rename(当前文件路径, 所选文本+".md"); //强行重命名，不能全局更新
        console.log(当前文件路径+"\n"+所选文本);
    };

    获取相对路径 () {
        当前文件 = this.app.workspace.getActiveFile();
        当前文件路径 = 当前文件.path;
        //navigator.clipboard.writeText(当前文件路径)
        var 相对目录 = 当前文件路径.replace(/(?<=\/)[^\/]+$/m,"");
        new obsidian.Notice("当前笔记位于："+相对目录);
    };

    智能粘贴() {
    	this.获取编辑器信息 ();
    	var 分隔行 = "";        //获取 当前窗口  //其中const是【常数】
        navigator.clipboard.readText()
		.then(clipText => {
            var bgReg = /([^\t]+[\t]){3,}[^\t]+/;
            var urlReg = /^(https?:\/\/[^:]+)$/
            var pathReg = /^([c-z]:\\[^\/:\*\?\<\>\|]+)$/i
            var htmlReg = /^.*(\<\body[^\<\>]+\>.*\<\/body\>).*$/
            var tmpText = clipText.replace(/[\n ]/g,"");
            console.log("获取到如下数据：\n"+ tmpText);
            if(urlReg.test(tmpText)){
                clipText = clipText.replace(urlReg,"[链接]($1)");
                new obsidian.Notice("剪贴板数据已转为网址超链接！");
            }else if(pathReg.test(tmpText)){
                clipText = clipText.replace(pathReg,"[本地]($1)");
                new obsidian.Notice("剪贴板数据已转为本地文件超链接！");
            }else if(bgReg.test(tmpText)){
                clipText = clipText.replace(/\n/g,"■");
                clipText = clipText.replace(/\"([^■\|\"]+)■([^\|\n\"]+)\"/g,"$1<br>$2");
                分隔行 = clipText.replace(/■.*/g,"");
                分隔行 = 分隔行.replace(/\t/g,"|");
                分隔行 = 分隔行.replace(/([^\|]*)/g,":---");
                clipText = clipText.replace(/\t/g,"\|");
                clipText = clipText.replace(/^([^■]+)/,"$1■"+分隔行);
                clipText = clipText.replace(/■/g,"\n");
                clipText = clipText.replace(/^\|/mg,"　\|");
                clipText = clipText.replace(/\|$/mg,"\|　");
                clipText = clipText.replace(/^(?=[^\r\n])|(?<=[^\r\n])$/mg,"\|");
                clipText = clipText.replace(/(?<=\|)(?=\|)/g,"　");
                new obsidian.Notice("剪贴板数据已转为MD语法表格！");
            }else if(htmlReg.test(tmpText)){
                console.log('获取到富文本');
            }else/* if(codeReg.test(tmpText))*/{
                clipText = "```\n"+clipText+"\n```\n"
                new obsidian.Notice("剪贴板数据已转为代码块格式！");
            }
			编辑模式.replaceSelection(clipText);
            //在当前光标位置写入处理后的数据
		})
		.catch(err => {
			console.error('未能读取到剪贴板上的内容: ', err);
		});
    }
    
    获取标注文本() {
        this.获取编辑器信息 ();
        if (!笔记正文) return;
        var tmp = 笔记正文.replace(/^(?!#+ |#注释|#标注|#批注|#反思|#备注|.*==|.*%%).*$|^[^#\n%=]*(==|%%)|(==|%%)[^\n%=]*$|(==|%%)[^\n%=]*(==|%%)/mg,"\n");
        tmp = tmp.replace(/[\r\n|\n]+/g,"\n")        
        new obsidian.Notice("已成功获取标注类文本，可以粘贴！");
        navigator.clipboard.writeText(tmp);
    };

    获取无语法文本() {
        this.获取编辑器信息 ();
        var mdText = /(^#+\s|(?<=^|\s*)#|^>|^\- \[( |x)\]|^\+ |<[^<>]+>|^1\. |^\-+$|^\*+$|==|\*+|~~|```|!*\[\[|\]\])/mg;
        if(所选文本 == ""){
            new obsidian.Notice("请先划选部分文本，再执行命令！");
        }else{
            所选文本 = 所选文本.replace(/\[([^\[\]]*)\]\([^\(\)]+\)/img,"$1");
            所选文本 = 所选文本.replace(mdText,"");
            所选文本 = 所选文本.replace(/^[ ]+|[ ]+$/mg,"");
            所选文本 = 所选文本.replace(/(\r\n|\n)+/mg,"\n");
            new obsidian.Notice("已成功获取无语法文本，可以粘贴！");
            navigator.clipboard.writeText(所选文本);
        }
    };

    嵌入当前网址页面 () {
        this.获取编辑器信息 (); 
        var vid,web;
        var 基本格式 = '\n<iframe src="■" width=100% height="500px" frameborder="0" scrolling="auto"></iframe>';
        if(所选文本.match(/^https?:\/\/[^:]+/)){
            if(所选文本.match(/^https?:\/\/v\.qq\.com/)){
                vid = 所选文本.replace(/^http.*\/([^\/=\?\.]+)(\.html.*)?$/,"$1");
                web = "https://v.qq.com/txp/iframe/player.html?vid="+vid;
            }else if(所选文本.match(/^https?:\/\/www\.bilibili\.com/)){
                vid = 所选文本.replace(/^http.*\/([^\/=\?\.]+)(\?spm.*)?$/,"$1");
                web = "https://player.bilibili.com/player.html?bvid="+vid;
            }else if(所选文本.match(/^https?:\/\/www\.youtube\.com/)){
                vid = 所选文本.replace(/^http.*?v=([^\/=\?\.]+)(\/.*)?$/,"$1");
                web = "https://www.youtube.com/embed/"+vid;
            }else{
                web = 所选文本;
            }
            基本格式 = 基本格式.replace(/■/,web);
            笔记全文.replaceRange(基本格式, {line:当前行号,ch:当前行文本.length},{line:当前行号,ch:当前行文本.length});
            编辑模式.exec("goRight");
        }else{
            new obsidian.Notice("所选文本不符合网址格式，无法嵌入！");
        }
    };

    列表转为图示 () {
        var 大纲文本 = 所选文本.replace(/(    |\t)/mg,"■");
        大纲文本 = 大纲文本.replace(/(\-\s|\d+\.\s)/mg,"");   //对所有文本行的行首进行替换整理,去除-
        大纲文本 = 大纲文本.replace(/\s+$/mg,"");   //对所有文本行的行尾进行替换去除
        大纲文本 = 大纲文本.replace(/\n/g,"↵");
        大纲文本 = 大纲文本.replace(/↵+$/,"");   //去除末尾多余换行符
        var tagAry = 大纲文本.split("↵");
        //new obsidian.Notice(tagAry[0]);
        var fName = "";
        var 主要语法 = "";
        for(var i =0;i<tagAry.length;i++){
            var thisLine = tagAry[i];   //此行文本
            var n = thisLine.lastIndexOf("■");
            if(i>0){
                var upLine = tagAry[i-1];   //上行文本
                var m = upLine.lastIndexOf("■");
            }
            
            if(n<0){//无■，即为根级大纲,可创建@导航页面
                fName = thisLine;
            }else{
                //new obsidian.Notice(upLine+"  "+m+"\n"+thisLine+"  "+n);
                //比较下行与当前行的■数，三种情况，下行多，两行同，下行少
                thisLine = thisLine.replace(/^■+/,"");  //去除标识符号
                if(n>m){
                    //本行多，追加-当前行，前缀@
                    fName = fName+"-->"+thisLine;
                }else if(n==m){
                    //替换末尾-旧名称 为 -当前行
                    fName = fName.replace(/(?<=(^|\-\-\>))[^\-\>]+$/,thisLine);
                }else{
                    var cha=Number(m-n)+1;  //计算上行、本行的■数
                    fName = fName.replace(eval("/(\-\-\>[^\-\>]+){"+cha+"}$/"),"-->"+thisLine);
                }
                var 行语法 = fName.replace(/^.*\-\-\>(?=[^\-\>]+\-\-\>[^\-\>]+$)/mg,"");
                主要语法 = 主要语法 + "↵"+ 行语法;
            }
        }
        var 输出语法 = "%%此图示由列表文本转换而成！%%↵"+主要语法
        编辑模式.setCursor({line:0,ch:0});
        笔记正文 = this.获取笔记正文();
        var 新正文 = 笔记正文.replace(/\n/g,"↵");
        if(新正文.includes("%%此图示由列表文本转换而成！%%")){
            新正文 = 新正文.replace(/%%此图示由列表文本转换而成！%%↵.+?(?=↵```)/g, 输出语法);
            新正文 = 新正文.replace(/↵/g,"\n");
            this.替换笔记正文 (新正文);
        }else{
            new obsidian.Notice("列表文本已转为MerMaid语法。\n可以粘贴！");
            输出语法 = 输出语法.replace(/↵/g,"\n");
            navigator.clipboard.writeText("```mermaid\ngraph TD\n"+输出语法+"\n```\n");
        };
    }

    折叠当前同级标题() {
		this.获取编辑器信息 ();
        if (!笔记全文) return;
        if(/^#+\s/.test(当前行文本)){
            this.app.commands.executeCommandById('editor:unfold-all');
            var _str = 当前行文本.replace(/^(#+)\s.*$/,"$1");   //获取前面的多个#号
            //new obsidian.Notice("当前为标题行 "+_str);
            var 末行行号 = 编辑模式.lastLine();
            for(var i= 末行行号;i>=0;i--){
                编辑模式.setCursor({line:i,ch:0});
                //new obsidian.Notice(本行文本);
                var 本行文本 = 编辑模式.getLine(i);
                if(eval("/^"+_str+"(?=[^#])/").test(本行文本)){
                    this.app.commands.executeCommandById('editor:toggle-fold');
                }
            }
        }
    };

    批量插入空行() {
		this.获取编辑器信息 ();
        if (!笔记正文) return;
        笔记正文 = 笔记正文.replace(/(?<!^(\s*\- |\s*[0-9]+\.|\s*\>|\n)[^\n]*)\n(?!(\s*\- |\s*[0-9]+\.|\s*\>|\n))/g,"$1\n\n");
        this.替换笔记正文 (笔记正文);
    };
    
    批量去除空行() {
        this.获取编辑器信息 ();
        if (!笔记正文) return;
        笔记正文 = 笔记正文.replace(/(\r\n|\n)[\t\s]*(\r\n|\n)/g,"\n");
        this.替换笔记正文 (笔记正文);
    };

    首行缩进两字符() {
		this.获取编辑器信息 ();
        let isIndent = true;
        if (!笔记正文) return;
        //new obsidian.Notice(笔记正文);
        if(isIndent){
            笔记正文 = 笔记正文.replace(/^[‌‌‌　]+/mg,"");
            笔记正文 = 笔记正文.replace(/^(?!([\n\s\>#]+|```|\-\-\-|\|[^\|]|\*\*\*))/mg,"‌‌‌　　");
            isIndent = false;
        }else{
            笔记正文 = 笔记正文.replace(/^[‌‌‌　]+/mg,"");
            isIndent = true;
        }
        this.替换笔记正文 (笔记正文);
    };

    末尾追加空格() {
		this.获取编辑器信息 ();
        if (!笔记正文) return;
        笔记正文 = 笔记正文.replace(/(?<!(\-\-\-|\*\*\*|\s\s))\n/g,"  \n");
        this.替换笔记正文 (笔记正文);
    };
        
    去除末尾空格() {
        this.获取编辑器信息 ();
        if (!笔记正文) return;
        笔记正文 = 笔记正文.replace(/\s\s\n/g,"\n")
        this.替换笔记正文 (笔记正文);
    };

    上方插入空行(_str) {
        this.获取编辑器信息 ();
        var 新文本 = "\r\n"+当前行文本;
        笔记全文.replaceRange(新文本, {line:当前行号,ch:0},{line:当前行号,ch:当前行文本.length});
    };

    下方插入空行(_str) {
        this.获取编辑器信息 ();
        var 新文本 = 当前行文本+"\r\n";  //.replace(/^([^\r\n]*)$/,"$1\n");
        笔记全文.replaceRange(新文本, {line:当前行号,ch:0},{line:当前行号,ch:当前行文本.length});
        编辑模式.setSelection({line:当前行号,ch:当前行文本.length+1}, {line:当前行号,ch:当前行文本.length+1});
    };
   
    添加中英间隔() {
        this.获取编辑器信息 ();
        if (!笔记正文) return;
        笔记正文 = 笔记正文.replace(/([a-zA-Z]+)([一-鿆]+)/g,"$1 $2")
        笔记正文 = 笔记正文.replace(/([一-鿆]+)([a-zA-Z]+)/g,"$1 $2")
        this.替换笔记正文 (笔记正文);
    };

    去除所有空格() {
        this.获取编辑器信息 ();
        if (!笔记正文) return;
        笔记正文 = 笔记正文.replace(/[ 　]+/g,"")
        this.替换笔记正文 (笔记正文);
    };

    /* 此功能暂未启用。*/
     续选当前文本() { 
        this.获取编辑器信息 ();
        var lang = 选至行尾.indexOf(所选文本);
        var 起始 = 选至行首.length+lang;
        var 结束 = 起始 + 所选文本.length;
        if(lang<0){ return};
        编辑模式.setSelection({line:当前行号,ch:起始}, {line:当前行号,ch:结束});
    };

    搜索当前文本() {
        var 当前文件 = this.app.workspace.getActiveFile();
        var 当前文件路径 = 当前文件.name;
        //new obsidian.Notice(当前文件路径);
        当前文件路径 = 当前文件路径.replace(/\.md$/,"")
        var view = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
        var _txt = view.getSelection();
        _txt = _txt.replace(/^/,"path:"+当前文件路径+" /")
        this.app.internalPlugins.getPluginById('global-search').instance.openGlobalSearch(_txt)
    };

    修复意外断行() {
        this.获取编辑器信息 ();
        if (!笔记正文) return;
        笔记正文 = 笔记正文.replace(/(?<=[^a-zA-Z])\s+(?=\r*\n)/g,"")
        笔记正文 = 笔记正文.replace(/(?<=[a-zA-Z])\s+(?=\r*\n)/g," ")
        //去除末尾非字母后的空格，将末尾字母后的多个空格保留一个
        笔记正文 = 笔记正文.replace(/([^。？！\.\?\!])(\r?\n)+/g,"$1")
        this.替换笔记正文 (笔记正文);
    };

    修复错误语法() {
        this.获取编辑器信息 ();
        if (!笔记正文) return;
        笔记正文 = 笔记正文.replace(/[\[【]([^\[\]【】]*)[】\]][（|\(]([^\(\)（）]*)[）|\)]/g,"\[$1\]\($2\)");
        //将 【】（）或【】() 转换为[]()
        笔记正文 = 笔记正文.replace(/\[+([^\[\]]*)\]+\(/g,"\[$1\](");
        //处理 bookXnote 回链语法，将 [[链接]]() 转换为 []()
        笔记正文 = 笔记正文.replace(/(?<=^|\s)    /mg,"\t");
        //把 四个空格转换为 制表符
        笔记正文 = 笔记正文.replace(/(?<=\]\([^\(\)]+\))$/g,"  ");
        //在超链接末尾处补加两空格
        笔记正文 = 笔记正文.replace(/\*\s+\>\s+/g,"- ");
        //处理 bookXnote 回链语法中的列表
        笔记正文 = 笔记正文.replace(/(?<=\s)[0-9]+。 /g,"1. ");
        //把 1。 转换为 有序列表样式
        this.替换笔记正文 (笔记正文);
    };

    英转中文标点() {
        this.获取编辑器信息 ();
        if (!笔记正文) return;
        笔记正文 = 笔记正文.replace(/(?<=[^a-z0-9\>\]]),/g,"，")
        笔记正文 = 笔记正文.replace(/(?<=[^a-z0-9\>\]])\./isg,"。");   //数字后的黑点不转为句号
        笔记正文 = 笔记正文.replace(/(?<=[^a-z0-9\>\]])\?/g,"？")
        笔记正文 = 笔记正文.replace(/(?<=[^a-z0-9\>\]])!(?=[^\[])/g,"！")
        笔记正文 = 笔记正文.replace(/;/g,"；")
        笔记正文 = 笔记正文.replace(/(?<=[^:]):|:(?=[^:])/g,"：")
        笔记正文 = 笔记正文.replace(/\(/g,"（")
        笔记正文 = 笔记正文.replace(/\)/g,"）")
        笔记正文 = 笔记正文.replace(/\{([^{}]*)\}/g,"｛$1｝")
        笔记正文 = 笔记正文.replace(/\"([^\"]*?)\"/g,"“$1”")
        this.替换笔记正文 (笔记正文);
    };

    中转英文标点() {
        this.获取编辑器信息 ();
        if (!笔记正文) return;
        笔记正文 = 笔记正文.replace(/，/g,",")
        笔记正文 = 笔记正文.replace(/。/g,"\.")
        笔记正文 = 笔记正文.replace(/？/g,"\?")
        笔记正文 = 笔记正文.replace(/！/g,"!")
        笔记正文 = 笔记正文.replace(/；/g,";")
        笔记正文 = 笔记正文.replace(/：/g,":")
        笔记正文 = 笔记正文.replace(/（/g,"\(")
        笔记正文 = 笔记正文.replace(/）/g,"\)")
        笔记正文 = 笔记正文.replace(/｛([^｛｝]*)｝/g,"{$1}")
        笔记正文 = 笔记正文.replace(/“([^“”]*)”/g,"\"$1\"")
        this.替换笔记正文 (笔记正文);
    };

    转换路径() {
        this.获取编辑器信息 ();
        if(所选文本==null || 笔记正文==null){return};
        var link1 = /^[a-zA-Z]:\\/;	//符合普通路径格式
        var link2 = /^(\[[^\[\]]*\]\()*file:\/\/\/[^\(\)]*\)*/;	//符合[](file路径)格式
        var link3 = /^\[[^\[\]]*\]\(([a-zA-Z]:\\[^\(\)]*)\)*/;	//意外路径格式
        if (link1.test(所选文本)){
            所选文本 = 所选文本.replace(/\s/mg,"%20");
            所选文本 = 所选文本.replace(/^(.*)$/m,"\[file\]\(file:///$1\)");
            所选文本 = 所选文本.replace(/\\/img,"\/");
            this.替换所选文本 (所选文本);
        }else if(link2.test(所选文本)){
            所选文本 = 所选文本.replace(/%20/mg," ");
            所选文本 = 所选文本.replace(/^(\[[^\[\]]*\]\()*file:\/\/\/([^\(\)]*)\)*/m,"$2");
            所选文本 = 所选文本.replace(/\//mg,"\\");
            this.替换所选文本 (所选文本);
        }else if(link3.test(所选文本)){
            所选文本 = 所选文本.replace(/^\[[^\[\]]*\]\(([a-zA-Z]:\\[^\(\)]*)\)*/m,"$1");
            this.替换所选文本 (所选文本);
        }else{
            new obsidian.Notice("您划选的路径格式不正确！");
            return;
        }
    };

    简体转繁() {
        笔记正文 = this.获取笔记正文();
        if (!笔记正文) return;
        for (var i=0;i<简体字表.length;i++){ 
            笔记正文 = 笔记正文.replace(eval("/"+简体字表[i]+"/g"),繁体字表[i]);
        }
        this.替换笔记正文 (笔记正文);
    }

    繁体转简() {
        笔记正文 = this.获取笔记正文();
        if (!笔记正文) return;
        for (var i=0;i<繁体字表.length;i++){ 
            笔记正文 = 笔记正文.replace(eval("/"+繁体字表[i]+"/g"),简体字表[i]);
        }
        this.替换笔记正文 (笔记正文);
    }
}

class editSettingsTab extends obsidian.PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
        this.settings = plugin.settings;
    }
    display() {
        var containerEl = this.containerEl;
        containerEl.empty();
        containerEl.createEl('h2', { text: '增强编辑 0.4.4' });
        new obsidian.Setting(containerEl)
            .setName('📣 转换内部链接「Alt+Z」 在选文两端添加或去除 [[ ]] 符号')
            .setDesc('支持批量转换用换行符分隔的多行文本或顿号分隔的多句文本。')
  
        var div0 = containerEl.createEl('p', {
            cls: 'recent-files-donation',
        });
        var linkText = document.createDocumentFragment();
        linkText.appendText('转换同义链接「Alt+Q」：将选文转换为 [[|选文]] 样式后再选择文档')
        linkText.appendChild(document.createElement('br'));
        div0.appendChild(linkText);

        new obsidian.Setting(containerEl)
            .setName('📣 智能换行「Enter」 默认支持```代码块```内换行缩进效果')
            .setDesc('启用此项后，在非列表或代码块的文本中按下回车后补加一次换行；如想普通换行，可按下 Shift+Enter 键。')
            .addToggle(toggle => toggle.setValue(this.settings.twoEnter)
            .onChange((value) => {
            this.settings.twoEnter = value;
            this.plugin.saveSettings();
        }));
        new obsidian.Setting(containerEl)
            .setName('📣 键控游标「Alt+I +J +K +L」 使用主键盘控制编辑区内的游标位置')
            .setDesc('按下Alt+ I上 J左 K下 L右 U首 O尾 快捷键，控制游标移动位置。')

        new obsidian.Setting(containerEl)
            .setName('📣 键控游标跳转「Alt+Shift+J +L」 控制游标在同类文本行或选区间跳转')
            .setDesc('控制游标在标题、列表项、待办项、代码块、引用等文本行或加粗、高亮、注释、删除、链接等MarkDown语法间前后跳转')
        
        new obsidian.Setting(containerEl)
            .setName('📣 键控切换文件列表「Alt+Shift+I +K」 使用键盘控制切换文件列表中的文件显示')
            .setDesc('按下Alt+Shift+ I上 K下 快捷键，控制打开同文件夹内其它文件。')
        
        new obsidian.Setting(containerEl)
            .setName('📣 智能语法「Alt+;」 自动转换、匹配或跳过各种类型的括号或代码块语法')
            .setDesc('可将[( (< ([ "[ \'[等组合转为〖〈〔『「，或将dv、qy、mm、CSS、js、ja、ty等字符串转为代码块语法。')

        new obsidian.Setting(containerEl)
            .setName('📣 智能粘贴「Ctrl+Alt+V」∶将复制的内容粘贴为Md语法样式')
            .setDesc('依据复制内容的类型，将表格、网址、本地路径或代码直接粘贴为MD表格、超链接或代码块格式。')

        new obsidian.Setting(containerEl)
            .setName('📣 设置标题及粗、斜、删、亮等效果（MarkDown语法）功能。')
            .setDesc('启用后，当未选文本时按下Alt+C +G +S +U +N 等快捷键，即会开启或关闭 相应的MD语法「格式刷」功能。')

        var div1 = containerEl.createEl('p', {
            cls: 'recent-files-donation',
        });
        var mdText = document.createDocumentFragment();
        mdText.appendText('转换标题语法「Ctrl+1-6」∶指定或取消当前行文本为N级标题');
        mdText.appendChild(document.createElement('br'));
        mdText.appendText('转换粗体语法「Alt+C」∶将选文转为或去除 **粗体** 效果');
        mdText.appendChild(document.createElement('br'));
        mdText.appendText('转换斜体语法「Alt+X」∶将选文转为或去除 *斜体* 效果');
        mdText.appendChild(document.createElement('br'));
        mdText.appendText('转换行内代码「Alt+D」∶将选文转为或去除 `行内代码` 效果');
        mdText.appendChild(document.createElement('br'));
        mdText.appendText('转换删除线「Alt+S」∶将选文转为或去除 ~~删除线~~ 效果');
        mdText.appendChild(document.createElement('br'));
        mdText.appendText('转换下划线「Alt+H」∶将选文转为或去除 <u>下划线</u> 效果');
        mdText.appendChild(document.createElement('br'));
        mdText.appendText('转换代码块「未设置」∶将选文转为或去除 ```代码块``` 效果');
        mdText.appendChild(document.createElement('br'));
        mdText.appendText('转换无语法文本「Ctrl+Alt+Z」∶鼠标点击或划选文本的语法部分，可去除相应的MarkDown语法字符');
        mdText.appendChild(document.createElement('br'));
        mdText.appendText('转为超链接语法「未设置」∶将选文转为[]()样式的MarkDown超链接语法');
        mdText.appendChild(document.createElement('br'));
        mdText.appendText('获取无语法文本「Ctrl+Alt+C」∶去除选文中的所有MarkDown语法字符，并写入剪贴板');
        mdText.appendChild(document.createElement('br'));
        div1.appendChild(mdText);

        new obsidian.Setting(containerEl)
            .setName('📣 设置设置彩色文字及背景、上下标等效果（Html语法）功能。')

        var div2 = containerEl.createEl('p', {
            cls: 'recent-files-donation',
        });
        var htmlText = document.createDocumentFragment();
        htmlText.appendText('转换文字颜色「Ctrl+Shift+1-7」∶将选文转为或去除 赤橙黄绿青蓝紫 颜色');
        htmlText.appendChild(document.createElement('br'));
        htmlText.appendText('转换背景颜色「Ctrl+Alt+1-7」∶将选文背景转为或去除 赤橙黄绿青蓝紫 颜色');
        htmlText.appendChild(document.createElement('br'));
        htmlText.appendText('转换上标语法「未设置」∶将选文转为或去除 <sup>上标</sup> 效果');
        htmlText.appendChild(document.createElement('br'));
        htmlText.appendText('转换下标语法「未设置」∶将选文转为或去除 <sub>下标</sub> 效果');
        htmlText.appendChild(document.createElement('br'));
        div2.appendChild(htmlText);

        new obsidian.Setting(containerEl)
            .setName('📣 设置字符、标点、状态等转换功能。')

        var div3 = containerEl.createEl('p', {
            cls: 'recent-files-donation',
        });
        var charText = document.createDocumentFragment();
        charText.appendText('英转中文标点「未设置」∶将笔记中的英文标点转换为中文标点，如,.?!"等');
        charText.appendChild(document.createElement('br'));
        charText.appendText('中转英文标点「未设置」∶将笔记中的中文标点转换为英文标点，如，。？！“等');
        charText.appendChild(document.createElement('br'));
        charText.appendText('转换路径语法「未设置」∶将 c:\\windows 与 [](file:///c:\/windows) 路径语法相互转换');
        charText.appendChild(document.createElement('br'));
        charText.appendText('简体转为繁体「未设置」：将笔记中的简体汉字转换为繁体汉字');
        charText.appendChild(document.createElement('br'));
        charText.appendText('繁体转为简体「未设置」：将笔记中的繁体汉字转换为简体汉字');
        charText.appendChild(document.createElement('br'));
        charText.appendText('列表转为图示「未设置」：选中列表文本，转换为相应层级的MerMaid语法图示，支持修改列表后更新图示。');
        charText.appendChild(document.createElement('br'));
        charText.appendText('转换待办状态「未设置」：转换选文行首的待办状态，顺序为 -[ x-!?><+] 效果');
        charText.appendChild(document.createElement('br'));
        charText.appendText('转换挖空「未设置」：将选文转为或去除 {{c1::选文}} 效果');
        charText.appendChild(document.createElement('br'));
        charText.appendText('【选文】「未设置」：在选文两端添加或去除 【】符号');
        charText.appendChild(document.createElement('br'));
        charText.appendText('（选文）「未设置」：在选文两端添加或去除 （）符号');
        charText.appendChild(document.createElement('br'));
        charText.appendText('「选文」「未设置」：在选文两端添加或去除 「」符号');
        charText.appendChild(document.createElement('br'));
        charText.appendText('《选文》「未设置」：在选文两端添加或去除 《》符号');
        div3.appendChild(charText);

        new obsidian.Setting(containerEl)
            .setName('📣 设置修复语法、选择段句、嵌入网页等功能。')

        var div4 = containerEl.createEl('p', {
            cls: 'recent-files-donation',
        });
        var toolText = document.createDocumentFragment();        
        toolText.appendText('修复错误语法「未设置」∶修复错误的MD语法，如1。列表、【】（）链接、[[]]()回链等');
        toolText.appendChild(document.createElement('br'));
        toolText.appendText('修复意外断行「未设置」∶修复笔记中的意外断行（删除结尾不是句式标点的换行符）');
        toolText.appendChild(document.createElement('br'));
        toolText.appendText('搜索当前文本「未设置」：通过搜索面板在当前文档中搜索划选内容。');
        toolText.appendChild(document.createElement('br'));
        toolText.appendText('选择当前整段「未设置」：选择光标所在的当前整段文本。');
        toolText.appendChild(document.createElement('br'));
        toolText.appendText('选择当前整句「未设置」：选择光标所在的当前整句（中文）文本。');
        toolText.appendChild(document.createElement('br'));
        toolText.appendText('选择当前语法「未设置」：选择光标所在的当前MrakDown语法（如加粗、高亮、删除、链接等效果）文本。');
        toolText.appendChild(document.createElement('br'));
        toolText.appendText('获取标注文本「未设置」∶获取标题、高亮、注释及前缀(#标注\批注\反思)等文本内容');
        toolText.appendChild(document.createElement('br'));
        toolText.appendText('自动设置标题「未设置」∶将选文中的单行文本（末尾非标点或数字）转为标题');
        toolText.appendChild(document.createElement('br'));
        toolText.appendText('指定当前文件名「未设置」：划选文字后指定为当前笔记的文件名。');
        toolText.appendChild(document.createElement('br'));
        toolText.appendText('嵌入当前网址页面「未设置」∶在行末插入iframe代码来嵌入所选网址页面');
        toolText.appendChild(document.createElement('br'));
        toolText.appendText('获取相对路径「未设置」：获取当前笔记在库目录内的相对路径。');
        toolText.appendChild(document.createElement('br'));
        div4.appendChild(toolText);


        new obsidian.Setting(containerEl)
            .setName('📣 设置折叠标题、增减空行或空格等功能。')

        var div5 = containerEl.createEl('p', {
            cls: 'recent-files-donation',
        });
        var lineText = document.createDocumentFragment();
        lineText.appendText('折叠当前同级标题「Ctrl+Shift+Alt+D」∶判断当前行的标题层级，将正文中同级标题一次性折叠起来。');
        lineText.appendChild(document.createElement('br'));
        lineText.appendText('删除当前段落「Ctrl+D」∶去除当前段落文本;若在[[]]内会先删除链接内容;当遇有序列表项时会正常调小后面序号。');
        lineText.appendChild(document.createElement('br'));
        lineText.appendText('批量插入空行「Ctrl+Shift+L」∶在划选的文本行或全文中间批量插入空白行');
        lineText.appendChild(document.createElement('br'));
        lineText.appendText('批量去除空行「Ctrl+Alt+L」∶批量去除划选文本或全文中的空白行');
        lineText.appendChild(document.createElement('br'));
        lineText.appendText('上方插入空行「未设置」∶在当前文本行的上行插入空白行');
        lineText.appendChild(document.createElement('br'));
        lineText.appendText('下方插入空行「未设置」∶在当前文本行的下行插入空白行');
        lineText.appendChild(document.createElement('br'));
        lineText.appendText('末尾追加空格「未设置」∶在每行文本的末尾追加两个空格');
        lineText.appendChild(document.createElement('br'));
        lineText.appendText('去除末尾空格「未设置」∶批量去除每个文本行末尾的空格字符');
        lineText.appendChild(document.createElement('br'));
        lineText.appendText('添加中英间隔「未设置」：在正文的汉字与字母之间批量添加空格，如 china 中国。');
        lineText.appendChild(document.createElement('br'));
        lineText.appendText('去除所有空格「未设置」：去除正文中所有的全、半角空格');
        lineText.appendChild(document.createElement('br'));
        div5.appendChild(lineText);

        var div6 = containerEl.createEl('p', {
            cls: 'recent-files-donation',
        });
        var qqText = document.createDocumentFragment();
        qqText.appendText('🆗 欢迎向蚕子(QQ:312815311) 提出操作需求和建议，我们来共同增强Obsidian软件的编辑功能！');
        div6.appendChild(qqText);
    };
};

module.exports = MyPlugin;