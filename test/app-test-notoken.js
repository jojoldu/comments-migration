/**
 * Created by jojoldu@gmail.com on 2018. 3. 2.
 * Blog : http://jojoldu.tistory.com
 * Github : http://github.com/jojoldu
 */


const app = require('../app');
const async = require('async');
const assert = require('assert');

describe('app 테스트', () => {
    describe('유틸 테스트', () => {
        it("async.js로 동기실행", (done) => {
            const times = [1000, 500, 100];
            const callStack = [];
            async.eachSeries(times, (time, next) => {
                setTimeout(()=>{
                    callStack.push(time);
                    return next();
                }, time);
            }, () => {
                assert.equal(callStack[0], 1000);
                assert.equal(callStack[1], 500);
                assert.equal(callStack[2], 100);
                done();
            });
        });

        it('인코딩', () => {
            const unicode = '\uc5ed\uc2dc \ube60\ub974\uace0 \uc0dd\uc0dd\ud55c \ud6c4\uae30 \uc798 \ubd24\uc2b5\ub2c8\ub2e4.\\r\\n\ub9e4\ubc88 \ub3d9\uc6b1\ub2d8 \ube14\ub85c\uadf8 \ud1b5\ud574\uc11c \ub3c4\uc6c0 \ub9ce\uc774 \ubc1b\uace0 \uc788\uc5c8\ub294\ub370 \uc5b4\uc81c\ub294 \uc9c1\uc811 \ub9cc\ub098\uac8c \ub418\uc11c \ubc18\uac00\uc6e0\uc2b5\ub2c8\ub2e4.\\r\\n\uc880 \ub354 \uc598\uae30\ub97c \ub098\ub204\uace0 \uc2f6\uc5c8\ub294\ub370 \uc544\uc27d\ub354\ub77c\uad6c\uc694. \ub098\uc911\uc5d0 \uc5f0\ub77d\ub4dc\ub9ac\uace0 \uc7a0\uc2e4\ub85c \ud568 \ucc3e\uc544\uac08\uaed8\uc694.^^\\r\\n';
            const buffer = new Buffer(unicode, 'utf8');
            assert(buffer.toString(), '역시 빠르고 생생한 후기 잘 봤습니다.\\r\\n매번 동욱님 블로그 통해서 도움 많이 받고 있었는데 어제는 직접 만나게 되서 반가웠습니다.\\r\\n좀 더 얘기를 나누고 싶었는데 아쉽더라구요. 나중에 연락드리고 잠실로 함 찾아갈께요.^^\\r\\n');
        });

        it('시간순 정렬을 parentId를 기준으로 재정렬된다.', () => {
            const comments = [
                {
                    "id": "15202882",
                    "date": "2018-02-20 01:21:31",
                    "name": "sangsik",
                    "parentId": "",
                    "homepage": "",
                    "visibility": "2",
                    "comment": "\uae54\ub054\ud558\uac8c \uc815\ub9ac\ud574\uc8fc\uc2e0 \ub355\ubd84\uc5d0 \uc815\uc8fc\ud589\ud558\uba70 \uc644\uc8fc\ud560 \uc218 \uc788\uc5c8\uc2b5\ub2c8\ub2e4. \uc88b\uc740 \uae00 \uac10\uc0ac\ud569\ub2c8\ub2e4. \n\uc774\ubc88 KCD2018\uc758 \ubc1c\ud45c\uc790\ub85c \ucc38\uc5ec\ud558\uc2dc\ub098\uc694? ",
                    "open": "Y"
                },
                {
                    "id": "15202975",
                    "date": "2018-02-20 09:15:47",
                    "name": "\uae40\ubbfc\uc11d",
                    "parentId": "",
                    "homepage": "",
                    "visibility": "2",
                    "comment": "\uc774\ubc88 \uc2dc\ub9ac\uc988 \ucc98\uc74c\ubd80\ud130 \ub9e4\uc6b0 \uc7ac\ubbf8\uc788\uac8c \uc798 \ubd24\uc2b5\ub2c8\ub2e4. \ub108\ubb34\ub098 \ud6cc\ub96d\ud55c \ub0b4\uc6a9\uc774\uace0 \uc55e\uc73c\ub85c\ub3c4 \ub450\uace0\ub450\uace0 \ubcfc \uac83 \uac19\ub124\uc694.\n\uac10\uc0ac\ud569\ub2c8\ub2e4~",
                    "open": "Y"
                },
                {
                    "id": "15206535",
                    "date": "2018-02-25 17:53:57",
                    "name": "\uc815\ub9d0\uac10\uc0ac\ud574\uc694\uc624",
                    "parentId": "",
                    "homepage": "cizz3007@gmail.com",
                    "visibility": "2",
                    "comment": "https:\/\/github.com\/JisooJang\/Littleone\n\uc5ec\uae30 \uc785\ub2c8\ub2e4..\ud574\uacb0\ud558\uace0 \ud639\uc2dc \uac00\ub984\uce68 \uc8fc\uc2e0\ub2e4\uba74 \uc81c\uac00 \uae30\ud504\ud2f0\ucf58\uc73c\ub85c \ubcf4\ub2f5\ud560\uac8c\uc694.\n\uc815\ub9d0 \uc5b4\ub835\ub124\uc694..\uc544\ub2c8\uba74 \uc2dc\uac04\ub0b4\uc154\uc11c \ub3c4\uc6c0\uc744 \uc8fc\uc154\ub3c4 \uc81c\uac00 \ucc3e\uc544\uac00\uc11c \uac00\ub974\uce68 \ubc1b\uaca0\uc2b5\ub2c8\ub2e4.",
                    "open": "N"
                },
                {
                    "id": "15206536",
                    "date": "2018-02-25 17:56:02",
                    "name": "\ucc3d\ucc9c\ud5a5\ub85c \ucc3d\ucc9c\ud5a5\ub85c",
                    "parentId": "15202882",
                    "homepage": "http:\/\/jojoldu.tistory.com",
                    "visibility": "2",
                    "comment": "\ub135\ub135! \ubc1c\ud45c\uc790\ub85c \ucc38\uc11d\ud588\uc2b5\ub2c8\ub2e4^^;",
                    "open": "Y"
                },
                {
                    "id": "15206538",
                    "date": "2018-02-25 17:56:21",
                    "name": "\ucc3d\ucc9c\ud5a5\ub85c \ucc3d\ucc9c\ud5a5\ub85c",
                    "parentId": "15202975",
                    "homepage": "http:\/\/jojoldu.tistory.com",
                    "visibility": "2",
                    "comment": "\uace0\ub9d9\uc2b5\ub2c8\ub2e4^^ \uc88b\uc740 \uae00 \uacc4\uc18d \uc62c\ub9ac\ub3c4\ub85d \ub178\ub825\ud558\uaca0\uc2b5\ub2c8\ub2e4.\r\n\uc790\uc8fc \ubc29\ubb38 \ubd80\ud0c1\ub4dc\ub9ac\uaca0\uc2b5\ub2c8\ub2e4^^",
                    "open": "Y"
                },
                {
                    "id": "15206615",
                    "date": "2018-02-25 20:21:29",
                    "name": "\uc815\ub9d0\uac10\uc0ac\ud574\uc694\uc624",
                    "parentId": "",
                    "homepage": "",
                    "visibility": "2",
                    "comment": "https:\/\/github.com\/cizz3007\/myself\n\uc774\ub807\uac8c \uc7ac\uad6c\uc131 \ud6c4 \ud588\ub294\ub370\ub3c4 whitelabel error page\uac00 \ub728\ub124\uc694,,,,\n \ub300\uccb4 \uc65c \uc774\ub7f0 \uac83\uc778\uc9c0..\ubb50\uac00 \ubb38\uc81c \uc77c\uae4c\uc694..",
                    "open": "N"
                },
                {
                    "id": "15206617",
                    "date": "2018-02-25 20:25:35",
                    "name": "\ucc3d\ucc9c\ud5a5\ub85c \ucc3d\ucc9c\ud5a5\ub85c",
                    "parentId": "15206615",
                    "homepage": "http:\/\/jojoldu.tistory.com",
                    "visibility": "2",
                    "comment": "whitelabel error page \uac00 \ub5b4\uc73c\uba74 \uadf8\ub54c\ubd80\ud130 git & IntelliJ\uc758 \ubb38\uc81c\ub294 \uc544\ub2cc\uac83 \uac19\uc2b5\ub2c8\ub2e4.\r\n(\ud574\ub2f9 \ud398\uc774\uc9c0\ub294 \ubcf4\ud1b5 \uc11c\ubc84 \ucf54\ub4dc \uc624\ub958\uac00 \ub098\uc11c 500\uc5d0\ub7ec\uac00 \ubc1c\uc0dd\ud558\uba74 \ub098\ub294\uac70\ub77c\uc11c\uc694\r\n\ubd80\ud2b8\uac00 \uc81c\ub300\ub85c \uc2e4\ud589\uc548\ub410\uc73c\uba74 \uc544\uc5d0 \ud398\uc774\uc9c0\uac00 \ub178\ucd9c\uc790\uccb4\uac00 \uc548\ub410\uc744\uaebc\ub77c..)\r\n\r\n\ubd80\ud2b8\uac00 \uc2e4\ud589\uc740 \ub410\uc9c0\ub9cc \ucf54\ub4dc\uc5d0\uc11c \ud654\uba74\uc744 \ubabb\ubcf4\uc5ec\uc8fc\ub294 \ucf54\ub4dc\uc0c1\uc758 \ubb38\uc81c\uac00 \uc788\uc5b4\uc11c \uadf8\ub7f0\uac83 \uac19\uc2b5\ub2c8\ub2e4.\r\nIntelliJ \ucf58\uc194\ucc3d\uc5d0 \ub728\ub294 \uc624\ub958 \uba54\uc138\uc9c0\ub97c \ubcf4\uba74\uc11c \ud574\uacb0\ud558\uc154\uc57c\ud560\uac83 \uac19\uc544\uc694!",
                    "open": "Y"
                },
                {
                    "id": "15206623",
                    "date": "2018-02-25 20:34:45",
                    "name": "\uc815\ub9d0\uac10\uc0ac\ud574\uc694\uc624",
                    "parentId": "15206615",
                    "homepage": "",
                    "visibility": "2",
                    "comment": "\ub85c\uadf8\uc5d0\uc11c\ub294 \uc5b4\ub5a4 \uc5d0\ub7ec\uac00 \uc5c6\uc2b5\ub2c8\ub2e4.\r\nwhite label error\uac00 \uc65c \ub728\ub294 \uc9c0 ..\uc774\ub188\uc774 \uc815\ub9d0 \uc808 \uad34\ub86d\ud788\ub124\uc694.\u3160\u3160\r\n\uadf8\ub798\ub3c4 \uc2dc\uac04\ub0b4\uc11c \ub2f5\uae00 \ub0b4\uc918\uc11c \uac10\uc0ac\ud569\ub2c8\ub2e4!",
                    "open": "Y"
                },
                {
                    "id": "15206625",
                    "date": "2018-02-25 20:37:32",
                    "name": "\ucc3d\ucc9c\ud5a5\ub85c \ucc3d\ucc9c\ud5a5\ub85c",
                    "parentId": "15206615",
                    "homepage": "http:\/\/jojoldu.tistory.com",
                    "visibility": "2",
                    "comment": "\ub135 500\uc5d0\ub7ec\ub294 \uc774\uc288 \uc6d0\uc778\uc774 \uc6cc\ub099 \ub9ce\uc544\uc11c IDE\uc758 \ucf58\uc194\uc0c1 \ucd9c\ub825\ub418\ub294\uac83\uc5d0\uc11c \ubcfc\uc218\ubc16\uc5d0 \uc5c6\ub294\ub370 \uadf8\uac8c \uc548\ub418\uba74 \ub2e4 \ucd94\uce21\uc73c\ub85c \uc7a1\ub294\uc218\ubc16\uc5d0 \uc5c6\uaca0\ub124\uc694 \u3160\r\n\r\n\ud639\uc2dc\ub098 JSP\uac00 \ubb38\uc81c\uc77c\uc218\ub3c4 \uc788\uc73c\ub2c8\r\n@RestController \ud558\ub098 \uc0dd\uc131\ud574\uc11c JSP \uc0ac\uc6a9\ud558\uc9c0 \uc54a\uace0 \ub370\uc774\ud130\ub9cc \ucd9c\ub825\ud558\ub294 \ucee8\ud2b8\ub864\ub7ec\ub85c \ud14c\uc2a4\ud2b8 \ud574\ubcf4\uc138\uc694\r\n\uac70\uae30\uc11c \ub370\uc774\ud130 \uc798 \ucd9c\ub825\ub418\uba74 JSP \ubb38\uc81c\uace0\r\n\uac70\uae30\uc11c\ub3c4 \uc548\ub418\uba74 \ub2e4\ub978 \uc6d0\uc778\uc744 \ucc3e\uc544\ubcf4\uc154\uc57c\ud560\uac83 \uac19\uc544\uc6a4!",
                    "open": "Y"
                }
            ];

            const result = app.sort(comments);
            assert.equal(result.length, 9);
            assert.equal(result[0].id, '15202882');
            assert.equal(result[1].id, '15206536');
        });
    });

});