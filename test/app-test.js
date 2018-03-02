/**
 * Created by jojoldu@gmail.com on 2018. 3. 2.
 * Blog : http://jojoldu.tistory.com
 * Github : http://github.com/jojoldu
 */

const app = require('../app');
const assert  = require('assert');

describe('app 테스트', () => {
    describe('유틸 function 테스트', () => {
        const tokenJson = {
            "tistory.blogName": "jojoldu",
            "tistory.token": "tistoryToken",
            "github.owner": "jojoldu",
            "github.repo": "blog-comments",
            "github.token": "githubToken"
        };

        it('json prop를 기준으로 URL이 템플릿 된다.', () => {
            const url = 'https://api.github.com/repos/{github.owner}/{github.repo}/issues';
        });
    });

});