/**
 * Created by jojoldu@gmail.com on 2018. 3. 2.
 * Blog : http://jojoldu.tistory.com
 * Github : http://github.com/jojoldu
 */

const request = require('request-promise');
const fs = require('fs-extra');

const URL_TISTORY_GET_POSTS = 'https://www.tistory.com/apis/post/list';
const URL_TISTORY_GET_COMMENTS = 'https://www.tistory.com/apis/comment/list';
const URL_GITHUB_CREATE_ISSUE = 'https://api.github.com/repos/{github.owner}/{github.repo}/issues';
const URL_GITHUB_CREATE_ISSUE_COMMENT = 'https://api.github.com/repos/{github.owner}/{github.repo}/issues/{github.issueNo}/comments';

fs.readJson('./token.json', {throws: false})
    .then(tokenJson => {
        const options = {
            method: 'GET',
            uri: URL_TISTORY_GET_POSTS,
            qs: {
                access_token: tokenJson.tistory.token,
                blogName: tokenJson.tistory.blogName,
                output: 'json'
            }
        };
        return request(options)
    })
    .then(posts => {
        const lastId = JSON.parse(posts).tistory.item.posts[0].id;
        console.log(lastId);
    })
    .catch((err) => {
        console.log(err);
    });


function createIssueAndComments(postId, tokenJson) {

}

function createIssueUrl(tokenJson) {
    return URL_GITHUB_CREATE_ISSUE
        .replace('{github.owner}', tokenJson.github.owner)
        .replace('{github.repo}', tokenJson.github.repo);
}

function createIssueCommentUrl(tokenJson, issueNo) {
    return URL_GITHUB_CREATE_ISSUE_COMMENT
        .replace('{github.owner}', tokenJson.github.owner)
        .replace('{github.repo}', tokenJson.github.repo)
        .replace('{github.issueNo}', issueNo);
}

