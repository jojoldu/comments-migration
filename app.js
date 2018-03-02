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

/**
 * 1. Tistory에서 가장 최신 포스팅 ID Get
 * 2. 해당 ID를 마지막 index로 하여 1 ~ 마지막 ID까지 loop
 * 3. 이슈 및 댓글 등록
 *  3-1) Tistory ID로 포스팅된 글이 있는지 체크
 *  3-2) 있으면 해당 ID로 Github Issue 생성, 없으면 Pass
 *  3-3) 생성한 Github Issue ID로 댓글 생성
 *  3-4) 이슈 댓글은 부모 댓글을 보고 순서 재정렬
 */
let globalToken;
function execute() {
    readToken()
        .then(tokenJson => {
            globalToken = tokenJson;
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
            console.log(JSON.stringify(globalToken));

            for(let i=1; i<=lastId; i++){
                createIssueAndComments(i, globalToken);
            }
        })
        .catch((err) => {
            console.log(err);
        });
}


function readToken() {
    return fs.readJson('./token.json', {throws: false});
}

function createIssueAndComments(postId, tokenJson) {
    return getTistoryComments(postId, tokenJson)
        .then(body => {
            const comments = sort(body.tistory.item.comments);
            console.log(JSON.stringify(comments));
            /**
             * 1) Github 이슈 생성
             * 2) comments로 이슈 댓글 추가
             */
        })
        .catch((err) => {
            console.log(postId+' Not Found');
        });
}

function sort(comments) {
    function createComment (comment) {
        return {
            "id": comment.id,
            "comment": new Buffer(comment.comment, 'utf8').toString(),
            "child": []
        }
    }

    const result = {};

    for(let i=0; i<comments.length; i++){
        let comment = comments[i];
        if(!comment.parentId){
            result[comment.id] = createComment(comment);
        } else {
            result[comment.parentId].child.push(createComment(comment));
        }
    }
    return result;
}

function getTistoryComments(postId, tokenJson) {
    const options = {
        method: 'GET',
        uri: URL_TISTORY_GET_COMMENTS,
        qs: {
            access_token: tokenJson.tistory.token,
            blogName: tokenJson.tistory.blogName,
            targetUrl: tokenJson.tistory.blogName,
            postId: postId,
            output: 'json'
        }
    };

    return request(options);
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

exports.sort = sort;