
const $ = new Env("���Ӽ�");
const notify = $.isNode() ? require('./sendNotify') : '';
message = ""
let dsj_header= $.isNode() ? (process.env.dsj_header ? process.env.dsj_header : "") : ($.getdata('dsj_header') ? $.getdata('dsj_header') : "")
let dsj_headerArr = []
let dsj_headers = ""

const dianshijia_API = 'http://api.gaoqingdianshi.com/api'
const walkstep = '20000';
const gametimes = "1999";

var time = Date.parse( new Date() ).toString();


 if (typeof $request !== "undefined") {
    getdsj_header()
     $.done()
 }

if (!dsj_header) {
     $.msg($.name, '����ʾ��û�е��Ӽ�cookie����ȡcookie������һ�νű�', '��֪��˵ɶ��', {
         "open-url": "�����������"
     });
     $.done()
 }
 else if (dsj_header.indexOf("@") == -1 && dsj_header.indexOf("@") == -1) {
            dsj_headerArr.push(dsj_header)
 }
 else if (dsj_header.indexOf("@") > -1) {
            dsj_headers = dsj_header.split("@")
 }
 else if (process.env.dsj_header && process.env.dsj_header.indexOf('@') > -1) {
            dsj_headerArr = process.env.dsj_header.split('@');
            console.log(`��ѡ�������"@"����\n`)
 }
 else {
            dsj_headers = [process.env.dsj_header]
 };
    Object.keys(dsj_headers).forEach((item) => {
        if (dsj_headers[item]) {
            dsj_headerArr.push(dsj_headers[item])
        }
    })



!(async () => {
        console.log(`��${dsj_headerArr.length}��cookie`)
	        for (let k = 0; k < dsj_headerArr.length; k++) {
                $.message = ""
                dsj_header1 = dsj_headerArr[k]
                console.log(`--------�� ${k + 1} ���˺�������--------\n`)

                    await dsj_rwzt();
            await signin()
            //await signinfo()
            await dsj_led()
            await run()
            await run_rw()

            await dsj_lqp()
            for (let k = 0; k<5;k++){
                await lhz()
                await $.wait(60000)
            }
            await tasks(); // ����״̬
            await wx_tasks()
            await getGametime(); // ��Ϸʱ��
            await dsj_getinfo()// �û���Ϣ
            //await coinlist(); //�ܼ�
            //await total(); // ���״̬
            await cash(); // �ֽ�״̬


                console.log("\n\n")
            }
     })()
    .catch((e) => $.logErr(e))
    .finally(() => $.done())


//�ܼ�
function coinlist() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let url = {
                url: `${dianshijia_API}/coin/detail`,
                headers: JSON.parse(dsj_header1),
            }
            $.get(url, (error, response, data) => {
                //console.log(`����б�: ${data}`)
                let result = JSON.parse(data)
                let onlamount = 0,
                    vdamount = 0,
                    gamestime = 0,
                    todaysign = 0;
                try {
                    for (i = 0; i < result.data.length && result.data[i].ctime >= time; i++) {
                        if (result.data[i].from == "��ȡ��·���") {
                            detail += `����·����? ��ý��` + result.data[i].amount + '\n'
                        }
                        if (result.data[i].from == "��ȡ˯�����") {
                            detail += `��˯������? ��ý��` + result.data[i].amount + '\n'
                        }
                        if (result.data[i].from == "�ֻ�����") {
                            detail += `����������? ��ý��` + result.data[i].amount + '\n'
                        }
                        if (result.data[i].from == "˫�˻�Ծ") {
                            detail += `��˫�˻�Ծ��? ��ý��` + result.data[i].amount + '\n'
                        }
                        if (result.data[i].from == "��������") {
                            detail += `����������? ��ý��` + result.data[i].amount + '\n'
                        }
                        if (result.data[i].from == "��ȡ�Ϸֽ��") {
                            detail += `���Ϸֽ�ҡ�? ��ý��` + result.data[i].amount + '\n'
                        }
                        if (result.data[i].from == "��Ϸʱ������") {
                            gamestime += result.data[i].amount
                        }
                        if (result.data[i].from == "������Ƶ") {
                            vdamount += result.data[i].amount
                        }
                        if (result.data[i].from == "�ֻ�����") {
                            onlamount += result.data[i].amount
                        }
                        if (result.data[i].from == "ǩ��") {
                            todaysign += result.data[i].amount
                        }
                    }
                    if (todaysign) {
                        detail += `��ÿ��ǩ����? ��ý��` + todaysign + '\n'
                    }
                    if (vdamount) {
                        detail += `��������Ƶ��? ��ý��` + vdamount + '\n'
                    }
                    if (onlamount) {
                        detail += `���ֻ����ߡ�? ��ý��` + onlamount + '\n'
                    }
                    if (gamestime) {
                        detail += `����Ϸʱ����? ��ý��` + gamestime + '\n'
                    }
                    if (i > 0) {
                        detail += `������ͳ�ơ������${i+1}������??`
                    }
                    $.msg($.name + `  ` + sleeping, subTitle, detail)


                } catch (e) {
                    console.log(`��ȡ�������б�ʧ�ܣ��������${e}+ \n��Ӧ����:${data}`)
                    //$.msg($.name + ` ��ȡ�������ʧ�� `, subTitle, detail)
                }
                /*if ($.isNode()) {
                    notify.sendNotify(`��${$.name}���˺� ${i} , ${subTitle} '\n' ${detail}`)
                }
                return*/
                resolve()
            })
        }, 1000)
    })
}


function total() {
    return new Promise((resolve, reject) => {
        $.get({
            url: `${dianshijia_API}/coin/info`,
            headers: JSON.parse(dsj_header1),
        }, (error, response, data) => {
            let result = JSON.parse(data)
            console.log(`\n����ǰ���״̬�����һ����: ${result.data.coin}`)
            try {
                if (result.data.tempCoin) {
                    for (i = 0; i < result.data.tempCoin.length; i++) {
                        coinid = result.data.tempCoin[i].id
                        $.get({
                            url: `http://api.gaoqingdianshi.com/api/coin/temp/exchange?id=` + coinid,
                            headers: DSJ_headers
                        }, (error, response, data))
                    }
                }
                resolve()
            } catch (e) {

            resolve()
            }
        })
    })
}

function wx_tasks(tkcode) {
    return new Promise(async(resolve, reject) => {
        let taskcode = ['1M002','SpWatchVideo', 'Mobilewatchvideo', 'MutilPlatformActive','MiniLoginIn','MiniWatchVideo','FirstDownLoginMobile','FirstDownLoginTv']
        for (code of taskcode) {
            await wx_dotask(code)
            await $.wait(10000);
        }
        resolve()
    })
}
//С��������
function wx_dotask(code) {
    return new Promise((resolve, reject) => {
        let url = {
            url: `https://api.dianshihome.com/api/v4/task/complete?code=${code}&comType=1`,
            headers: JSON.parse(`{"userid":"${JSON.parse(dsj_header1).userid}","authorization":"${JSON.parse(dsj_header1).authorization}","appid":"3c3065a6f979f9b2b49e98ea1d02f313","Host":"api.dianshihome.com","content-type":"application/x-www-form-urlencoded","Referer":"https://servicewechat.com/wx9e8718eb2360dfb8/109/page-frame.html"}`)
        }
        $.get(url, (error, response, data) => {
            //console.log(data)
            let result = JSON.parse(data)
            if(result.errCode == 0){
                console.log('\n��΢��������롿��' + code + '����ý��:' + result.data.getCoin)
            }else{
              console.log('\n��΢��������롿: '+code+'��'+result.msg)
            }
         resolve()
        })
    })
}

function tasks(tkcode) {
    return new Promise(async(resolve, reject) => {
        let taskcode = ['1M002','SpWatchVideo', 'Mobilewatchvideo', 'MutilPlatformActive','MiniLoginIn','MiniWatchVideo','FirstDownLoginMobile','FirstDownLoginTv']
        for (code of taskcode) {
            await dotask(code)
            await $.wait(10000);
        }
        resolve()
    })
}
//����ʱ��
function dotask(code) {
    return new Promise((resolve, reject) => {
        let url = {
            url: `${dianshijia_API}/v4/task/complete?code=${code}`,
            headers: JSON.parse(dsj_header1),
        }
        $.get(url, (error, response, data) => {
            //console.log(data)
            let result = JSON.parse(data)
            if(result.errCode == 0){
                console.log('\n��������롿��' + code + '����ý��:' + result.data.getCoin)
            }else{
              console.log('\n��������롿: '+code+ '��'+result.msg)
            }
        resolve()
        })
    })
}

//�����б�鿴�����޸�
function dsj_rwzt() {
  return new Promise((resolve) => {
let url = {
      url : `http://act.gaoqingdianshi.com/api/v5/task/get`,
     headers : JSON.parse(dsj_header1),
}
      $.get(url, async (err, resp, data) => {
      try {
         //console.log(data)
     data = JSON.parse(data)

     if(data.errCode==0){
         console.log(`\n������״̬��: \n`)
         //���쿴��Ƶ����8��
         if(data.data[0].dayCompCount==8){
             console.log(`${data.data[0].name}: �����`)
             task_xiaoman = 1
         }else{
             console.log(`${data.data[0].name}: δ���`)
             task_xiaoman = 0
         }
         //������׬
          if(data.data[2].dayCompCount==5){
            console.log(`${data.data[2].name}: �����`)
            H5Page_4 = 1
          }else{
              console.log(`${data.data[2].name}: δ���`)
            H5Page_4 = 0
          }

          //��������
          if(data.data[11].dayCompCount==9){
              console.log(`${data.data[11].name}: �����`)
              playTask = 1
          }else{
             console.log(`${data.data[11].name}: δ���`)
              playTask = 0
          }
          //�ֻ������
          if(data.data[7].dayCompCount==1){
              console.log(`${data.data[7].name}: �����`)
              M005 =1
          }else{
              console.log(`${data.data[7].name}: δ���`)
              M005 =0
          }
          //ˢ����Ƶ
          if(data.data[12].dayCompCount==5){
              console.log(`${data.data[12].name}: �����`)
              ShortvideoPlay = 1
          }else{
              console.log(`${data.data[12].name}: δ���`)
              ShortvideoPlay = 0
          }
          //���ʵ��̨
          if(data.data[13].dayCompCount==1){
              console.log(`${data.data[13].name}: �����`)
              task_mobile_visit_song = 1
          }else{
              console.log(`${data.data[13].name}: δ���`)
              task_mobile_visit_song = 0
          }
          //����������
          if(data.data[14].dayCompCount==1){
              console.log(`${data.data[14].name}: �����`)
              task_mobile_visit_album = 1
          }else{
              console.log(`${data.data[14].name}: δ���`)
              task_mobile_visit_album = 0
          }
          //����ϵ���task_mobile_upload_album
          if(data.data[15].dayCompCount==1){
              console.log(`${data.data[15].name}: �����`)
              task_mobile_upload_album = 1
          }else{
              console.log(`${data.data[15].name}: δ���`)
              task_mobile_upload_album = 0
          }
          //����ͥ��task_mobile_create_family
          if(data.data[16].dayCompCount==1){
              console.log(`${data.data[16].name}: �����`)
              task_mobile_create_family = 1
          }else{
              console.log(`${data.data[16].name}: δ���`)
              task_mobile_create_family = 0
          }


     }else{
         //console.log(`${data.data[2].name}: �����`)
         console.log(data)
     }

        } catch (e) {
        } finally {
          resolve()
        }
    })
  })
}
//����Ƶ����
function video() {
    return new Promise((resolve, reject) => {
        let url = {
            url : 'http://api.gaoqingdianshi.com/api/v5/task/complete?code=task_xiaoman&comType=0',
            headers : JSON.parse(dsj_header1),
        }
        $.get(url, async (err, resp, data) => {
            try {
                const result = JSON.parse(data)
                if (result.errCode === 0) {
               console.log(`\n������Ƶ׬Ǯ��:��� ${result.data.getCoin} ���`)
            } else {
                console.log( `\n������Ƶ׬Ǯ��: ${result.msg}`)
                }

            } catch (e) {
                $.logErr(e+resp);
            } finally {
                resolve()
            }
            })
    })
}
//ǩ��
function signin() {
    return new Promise((resolve, reject) => {
        let url = {
            url : 'http://api.gaoqingdianshi.com/api/v5/sign/signin?accelerate=0&ext=0&ticket=',
            headers : JSON.parse(dsj_header1),
        }
        $.get(url, async(error, response, data) => {
            //console.log(data)
            //{"errCode":4,"msg":"�����ظ�ǩ��"}
            //if (logs) $.log(`${$.name}, ǩ�����: ${data}\n`)
            let result = JSON.parse(data)
            if (result.errCode == 0) {
                //signinres = `\nǩ���ɹ� `
                console.log( `\n��ǩ�����桿: ${result.data.reward[0].count} ��� `)
                /*var h = result.data.reward.length
                if (h > 1) {
                    dconsole.log( `\n��ǩ�����桿` + signinres + `${result.data.reward[0].count}��ң�����${result.data.reward[1].name} `)
                } else {
                    console.log( `\n��ǩ�����桿` + signinres + `+${result.data.reward[0].count}��� `)
                }*/
            } else if (result.errCode == 4) {
                console.log(`\n��ǩ������� �ظ�ǩ�� ?? `)
            } else if (result.errCode == 6) {
                console.log(`\n��ǩ������� ʧ��`)
                //detail = `\nԭ��: ${result.msg}`
                /*if ($.isNode()) {
                    await notify.sendNotify($.name, subTitle + '\n' + detail)
                }
                return*/
            }
            resolve()
        })
    })
}

//��������
function dsj_led() {
    return new Promise((resolve, reject) => {
        let url = {
            url: `http://api.gaoqingdianshi.com/api/sign/chooseAdditionalReward?rewardId=55`,
            headers: JSON.parse(dsj_header1),
        }
        $.get(url, (error, response, data) => {
            //console.log(data)
        resolve()
        })
    })
}

async function run() {
    if ( new Date().getTimezoneOffset() == '0') {
        if ($.time('HH') > 11) {
            await sleep();
            await $.wait(10000);
            await CarveUp();
        } else if ($.time('HH') > 3 && $.time('HH') < 5) {
            await getCUpcoin();
            await $.wait(10000);
            await walk();
        } else if ($.time('HH') > 22) {
            await wakeup()
        }
    } else {
        if ($.time('HH') > 17) {
            await sleep();
            await $.wait(10000);
            await CarveUp();
        } else if ($.time('HH') > 11 && $.time('HH') < 14) {
            await getCUpcoin();
            await $.wait(10000);
            await walk();
        } else if ($.time('HH') > 6 && $.time('HH') < 9) {
            await wakeup()
        }
    }
}

//˯������
function sleep() {
    return new Promise((resolve, reject) => {
        let url = {
            url: `http://api.gaoqingdianshi.com/api/taskext/getSleep?ext=1`,
            headers: JSON.parse(dsj_header1),
        }
        $.get(url, (error, response, data) => {
            try {
                 $.log(`˯������: ${data}\n`)
                let sleepres = JSON.parse(data)
                if (sleepres.errCode == 0) {
                    sleeping = sleepres.data.name + '�����ɹ� ??'
                } else if (sleepres.errCode == 4006) {
                    sleeping = '˯����??'
                } else {
                    sleeping = ''
                }
                resolve()
            } catch (e) {
                $.msg($.name, `˯�����: ʧ��`, `˵��: ${e}`)
            }
            console.log(`\n��˯������: ${sleeping}`)
            resolve()
        })
    })
}
//�Ϸְ�����
function CarveUp() {
    return new Promise((resolve, reject) => {
        let url = {
            url: `${dianshijia_API}/v2/taskext/getCarveUp?ext=1`,
            headers: JSON.parse(dsj_header1),
        }
        $.get(url, (error, response, data) => {
             $.log(`�Ϸְ�����: ${data}`)
            const result = JSON.parse(data)
            if (result.errCode == 0) {
                //detail += `����ҹϷ֡�? �����ɹ�\n`
		    $.log(`��ҹϷ֡�? �����ɹ�\n`)
            }
            resolve()
        })
    })
}

//�Ϸְ�Ԫ
function getCUpcoin() {
    return new Promise((resolve, reject) => {
        $.get({
            url: `${dianshijia_API}/taskext/getCoin?ext=0&code=carveUp`,
            headers: JSON.parse(dsj_header1),
        }, (error, response, data) => {
            //console.log(data)
             $.log(`���Ϸְ����ҡ�: ��� ${data} ���`)
        })
        resolve()
    })
}

function walk() {
    return new Promise((resolve, reject) => {
        let url = {
            url: `${dianshijia_API}/taskext/getWalk?step=${walkstep}`,
            headers: JSON.parse(dsj_header1),
        }
        $.get(url, (error, response, data) => {
             $.log(`��·����: ${data}\n`)
            let result = JSON.parse(data)
            if (result.data.unGetCoin > 10) {
                $.get({
                    url: `${dianshijia_API}/taskext/getCoin?code=walk&coin=${result.data.unGetCoin}&ext=1`,
                    headers: JSON.parse(dsj_header1),
                }, (error, response, data) => {})
            }
            resolve()
        })
    })
}

function wakeup() {
    return new Promise((resolve, reject) => {
        let url = {
            url: `${dianshijia_API}/taskext/getCoin?code=sleep&coin=1910&ext=1`,
            headers: JSON.parse(dsj_header1),
        }
        $.get(url, (error, response, data) => {
            $.log(`˯����: ${data}\n`)
        })
        resolve()
    })
}

async function run_rw(){
    //����ǩ������Ƶ����8��
    if(task_xiaoman == 0){
        await video()//����ǩ������Ƶ����8��
        await $.wait(10000);
    }
    //������׬
    if(H5Page_4 == 0){
        await dsj_ggz()//������׬
        await $.wait(10000);
    }
    //��������
    if(playTask == 0){
        await dsj_jrydz()//�����Ķ�׬
        await $.wait(10000);
    }
    //�ֻ������
    if(M005 == 0){
        await dsj_sjbfx()//�ֻ�����
        await $.wait(10000);
    }
    //���ʵ��̨
    if(task_mobile_visit_song == 0){
        await dsj_dgt()
        await $.wait(10000);
    }
    //����������
    if(task_mobile_visit_album == 0){
        await dsj_fwxc()//�������
        await $.wait(10000);
    }
    //����ϵ���task_mobile_upload_album
    if(task_mobile_upload_album == 0){
        await dsj_xcsds()//����ϵ���
        await $.wait(10000);
    }
    //����ͥ��task_mobile_create_family
    if(task_mobile_create_family == 0){
        await dsj_kjth() //����ͥ��
        await $.wait(10000);
    }
    //ˢ����Ƶ
    if(ShortvideoPlay == 0){
        await dsj_sdsp()//ˢ����Ƶ
        await $.wait(10000);
    }

}
//������׬
function dsj_ggz() {
    return new Promise((resolve, reject) => {
        $.get({
            url: `${dianshijia_API}/v5/task/complete?code=H5Page_4&comType=0`,
            headers: JSON.parse(dsj_header1),
        }, async(error, response, data) => {
            //console.log(data)
            //{"errCode":4,"msg":"�����ظ�ǩ��"}
            //if (logs) $.log(`${$.name}, ǩ�����: ${data}\n`)
            let result = JSON.parse(data)
            if (result.errCode == 0) {
                console.log(`\n��������׬��:��� ${result.data.getCoin} ���`)
            } else {
               console.log(`\n��������׬��: ${result.msg}`)
            }
            resolve()
        })
    })
}
//�����Ķ�׬
function dsj_jrydz() {
    return new Promise((resolve, reject) => {
        $.get({
            url: `${dianshijia_API}/v5/task/complete?code=playTask&comType=0`,
            headers: JSON.parse(dsj_header1),
        }, async(error, response, data) => {
            //console.log(data)
            //{"errCode":4,"msg":"�����ظ�ǩ��"}
            //if (logs) $.log(`${$.name}, ǩ�����: ${data}\n`)
            let result = JSON.parse(data)
            if (result.errCode == 0) {
                console.log(`\n����������:��� ${result.data.getCoin} ���`)
            } else {
               console.log(`\n����������: ${result.msg}`)
            }
            resolve()
        })
    })
}
//�ֻ������
function dsj_sjbfx() {
    return new Promise((resolve, reject) => {
        $.get({
            url: `${dianshijia_API}/v5/task/complete?code=1M005&comType=0`,
            headers: JSON.parse(dsj_header1),
        }, async(error, response, data) => {
            //console.log(data)
            //{"errCode":4,"msg":"�����ظ�ǩ��"}
            //if (logs) $.log(`${$.name}, ǩ�����: ${data}\n`)
            let result = JSON.parse(data)
            if (result.errCode == 0) {
                console.log(`\n���ֻ������:��� ${result.data.getCoin} ���`)
            } else {
               console.log(`\n���ֻ������: ${result.msg}`)
            }
            resolve()
        })
    })
}

//���ʵ��̨
function dsj_dgt() {
    return new Promise((resolve, reject) => {
        let url = {
            url: `${dianshijia_API}/v5/task/complete?code=task_mobile_visit_song&comType=0`,
            headers: JSON.parse(dsj_header1),
        }
        $.get(url, (error, response, data) => {
            //console.log(data)
            let result = JSON.parse(data)
            //console.log(`\n�������Ķ�׬��: �ɹ�`)
            if(result.errCode == 0){
                console.log(`\n�����ʵ��̨��:��� ${result.data.getCoin} ���`)
            }else{
              console.log(`\n�����ʵ��̨��: ${result.msg}`)
            }

        resolve()
        })
    })
}

//�������
function dsj_fwxc() {
    return new Promise((resolve, reject) => {
        let url = {
            url: `${dianshijia_API}/v5/task/complete?code=task_mobile_visit_album&comType=0`,
            headers: JSON.parse(dsj_header1),
        }
        $.get(url, (error, response, data) => {
            //console.log(data)
            let result = JSON.parse(data)
            if(result.errCode == 0){
                console.log(`\n��������᡿:��� ${result.data.getCoin} ���`)
            }else{
              console.log(`\n��������᡿: ${result}`)
            }

        resolve()
        })
    })
}

//����ϵ���
function dsj_xcsds() {
    return new Promise((resolve, reject) => {
        let url = {
            url: `${dianshijia_API}/v5/task/complete?code=task_mobile_upload_album&comType=0`,
            headers: JSON.parse(dsj_header1),
        }
        $.get(url, (error, response, data) => {
            //console.log(data)
            let result = JSON.parse(data)
            if(result.errCode == 0){
                console.log(`\n������ϵ��ӡ�:��� ${result.data.getCoin} ���`)
            }else{
              console.log(`\n������ϵ��ӡ�: ${result.msg}`)
            }

        resolve()
        })
    })
}
//����ͥ��
function dsj_kjth() {
    return new Promise((resolve, reject) => {
        let url = {
            url: `${dianshijia_API}/v5/task/complete?code=task_mobile_create_family&comType=0`,
            headers: JSON.parse(dsj_header1),
        }
        $.get(url, (error, response, data) => {
            //console.log(data)
            let result = JSON.parse(data)
            if(result.errCode == 0){
                console.log(`\n������ͥ�š�:��� ${result.data.getCoin} ���`)
            }else{
              console.log(`\n������ͥ�š�: ${result.msg}`)
            }

        resolve()
        })
    })
}

//ˢ����Ƶ
function dsj_sdsp() {
    return new Promise((resolve, reject) => {
        let url = {
            url: `${dianshijia_API}/v5/task/complete?code=ShortvideoPlay&comType=0`,
            headers: JSON.parse(dsj_header1),
        }
        $.get(url, (error, response, data) => {
            //console.log(data)
            let result = JSON.parse(data)
            if(result.errCode == 0){
                console.log(`\n��ˢ����Ƶ��:��� ${result.data.getCoin} ���`)
            }else{
              console.log(`\n��ˢ����Ƶ��: ${result.msg}`)
            }

        resolve()
        })
    })
}

//�г�������Ϣ
function dsj_lqp() {
    return new Promise((resolve, reject) => {
        $.get({
            url: `${dianshijia_API}/coin/info`,
            headers: JSON.parse(dsj_header1),
        }, async(error, response, data) => {
            //console.log(data)
            //{"errCode":4,"msg":"�����ظ�ǩ��"}
            //if (logs) $.log(`${$.name}, ǩ�����: ${data}\n`)
            let result = JSON.parse(data)
            if (result.errCode == 0) {
                if(!result.data.tempCoin){
                    console.log(`\n��${$.name}��: ��ҳû��������`)
                }else{
                  for(let a=0;a<result.data.tempCoin.length;a++){
                  await dsj_dqp(result.data.tempCoin[a].id)
                      await $.wait(3000)
               }
                }

            } else {
               //console.log(`\n��${$.name}��: ${result.msg}`
                //subTitle = `������Ƶ׬Ǯ�� ʧ��`
                /*detail = `ԭ��: ${result.msg}`
                if ($.isNode()) {
                    await notify.sendNotify($.name, subTitle + '\n' + detail)
                }
                return*/
            }
            resolve()
        })
    })
}
 //������
function dsj_dqp(code) {
    return new Promise((resolve, reject) => {
        $.get({
            url: `${dianshijia_API}/coin/temp/exchange?id=${code}`,
            headers: JSON.parse(dsj_header1),
        }, async(error, response, data) => {
            //console.log(data)
            let result = JSON.parse(data)
            console.log(`\n��${$.name}��: �����ݳɹ�`)
            resolve()
        })
    })
}

//��Ϸʱ��
function getGametime() {
    return new Promise((resolve, reject) => {
        let url = {
            url: `${dianshijia_API}/v4/task/complete?code=gameTime&time=${gametimes}`,
            headers: JSON.parse(dsj_header1),
        }
        $.get(url, (error, response, data) => {
             $.log(`��Ϸʱ��: ${data}\n`)
        })
        resolve()
    })
}

//�û���Ϣ�����õĺ������޸�
function dsj_getinfo() {
    return new Promise((resolve, reject) => {
        let url = {
            url: `${dianshijia_API}/v3/user/info`,
            headers: JSON.parse(dsj_header1),
        }
        $.get(url, (error, response, data) => {
            let result = JSON.parse(data)
            if(result.errCode == 0){
                nickname=result.data.nickname
                headImgUrl=result.data.headImgUrl
                dsj_info()
            }else{
              console.log(`\n�����Ӽ���ʾ��: ${result.msg}`)
            }

        resolve()
        })
    })
}
function dsj_info() {
    return new Promise((resolve, reject) => {
        let url = {
            url: `${dianshijia_API}/activity/invite/bind?ename=${nickname}&eavatar=${headImgUrl}&uid=${JSON.parse(dsj_header1).userid}&inviteCode=1118265`,
            headers: JSON.parse(dsj_header1),
        }
        $.get(url, (error, response, data) => {
            //console.log(data)
            let result = JSON.parse(data)
            if(result.errCode == 0){

            }else{
              //console.log(`\n�����Ӽ���ʾ��: ${result.msg}`)
            }

        resolve()
        })
    })
}

async function getdsj_header() {
    if ($request.url.match(/\/v3\/user\/info/)) {
          bodyVal1 = JSON.stringify($request.headers)
        result = JSON.parse(bodyVal1)
          uuid = result.uuid
          userid = result.userid
          authorization = result.authorization
          deviceId = result.deviceId
          let bodyVal = {'uuid' :uuid, 'userid' :userid, 'authorization' :authorization, 'deviceId':deviceId, 'Host':'api.gaoqingdianshi.com', "appid": "0990028e54b2329f2dfb4e5aeea6d625"}
          bodyVal2 =JSON.stringify(bodyVal)

        if (dsj_header) {
            if (dsj_header.indexOf(userid) > -1) {
                $.log("��cookie�Ѵ��ڣ���������")
            } else if (dsj_header.indexOf(userid) === -1) {
                dsj_headers = dsj_header + "@" + bodyVal2;
                console.log(bodyVal2)
                $.setdata(dsj_headers, 'dsj_header');
                $.log(`${$.name}��ȡcookie: �ɹ�, dsj_headers: ${bodyVal}`);
                bodys = dsj_headers.split("@")
                // $.msg($.name, "��ȡ��" + bodys.length + "���Ķ�����: �ɹ�??", ``)
            }
        } else {
            $.setdata(bodyVal2, 'dsj_header');
            console.log(bodyVal2)
            $.log(`${$.name}��ȡcookie: �ɹ�, dsj_headers: ${bodyVal}`);
            $.msg($.name, `��ȡ��һ��cookie: �ɹ�??`, ``)
        }
    }

  }

  //�ֽ�����
function cash() {
    return new Promise((resolve, reject) => {
        $.get({
            url: `${dianshijia_API}/cash/info`,
            headers: JSON.parse(dsj_header1),
        }, (error, response, data) => {
            //if (logs) $.log(`�ֽ�: ${data}\n`)
            let cashresult = JSON.parse(data)
            if (cashresult.errCode == "0") {
               console.log(`\n����ǰ�ֽ�״̬�����ֽ�: ${cashresult.data.amount/100} , ���ֶ��: ${cashresult.data.withdrawalQuota/100}`)
                //subTitle += `\n���˺� ${k+1} �ֽ�״̬�����ֽ�: ${cashresult.data.amount/100} , ���ֶ��: ${cashresult.data.withdrawalQuota/100}`
                //cashtotal = cashresult.data.totalWithdrawn / 100
                /*zh=i
                if ($.isNode()) {
                 notify.sendNotify($.name,'�˺�: '+i+'\n'+ subTitle + '\n')
                }
                return*/

            }
            resolve()
        })
    })
}

//�㻨׬
function lhz() {
    return new Promise((resolve, reject) => {
        let url = {
            url: `${dianshijia_API}/v5/task/complete?code=H5Page_2&comType=0`,
            headers: JSON.parse(dsj_header1),
        }
        $.get(url, (error, response, data) => {
            //console.log(data)
            let result = JSON.parse(data)
            if(result.errCode == 0){
                console.log('\n�Ķ��㻨׬��' + '�Ķ�����:' + result.data.dayCompCount)
            }else{
              console.log('\n���Ķ��㻨׬: '+result.msg)
            }
        resolve()
        })
    })
}

function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),a={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t){let e={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let s in e)new RegExp("("+s+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?e[s]:("00"+e[s]).substr((""+e[s]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r)));let h=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];h.push(e),s&&h.push(s),i&&h.push(i),console.log(h.join("\n")),this.logs=this.logs.concat(h)}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}