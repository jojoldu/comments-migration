/**
 * Created by jojoldu@gmail.com on 2018. 3. 2.
 * Blog : http://jojoldu.tistory.com
 * Github : http://github.com/jojoldu
 */

const request = require('request-promise');
const fs = require('fs-extra');

const URL_TISTORY_GET_POSTS = 'https://www.tistory.com/apis/post/list?output=json&access_token={accessToken}&blogName={blogName}&targetUrl={blogName}';
const URL_TISTORY_GET_COMMENTS = 'https://www.tistory.com/apis/comment/list';
const URL_GITHUB_CREATE_ISSUE = 'https://api.github.com/repos/jojoldu/blog-comments/issues';
const URL_GITHUB_CREATE_ISSUE_COMMENT = 'https://api.github.com/repos/jojoldu/blog-comments/issues/{issueNo}/comments';

fs.readJson('./token.json', { throws: false })
    .then(obj => request;

