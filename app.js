/**
 * Created by jojoldu@gmail.com on 2018. 3. 2.
 * Blog : http://jojoldu.tistory.com
 * Github : http://github.com/jojoldu
 */

const request = require('request-promise');
const fs = require('fs-extra');
const asyncp = require('async-promises');

/**
 * 1. Tistory에서 가장 최신 포스팅 ID Get
 * 2. 해당 ID를 마지막 index로 하여 1 ~ 마지막 ID까지 loop
 * 3. 이슈 및 댓글 등록
 *  3-1) Tistory ID로 포스팅된 글이 있는지 체크
 *  3-2) 있으면 해당 ID로 Github Issue 생성, 없으면 Pass
 *  3-3) 생성한 Github Issue ID로 댓글 생성
 *  3-4) 이슈 댓글은 부모 댓글을 보고 순서 재정렬
 */

let githubApiUseCount = 1;
const interval = 10000;
let globalToken;
function execute() {
    readToken()
        .then(tokenJson => {

            setGlobalToken(tokenJson);

            const URL_TISTORY_GET_POSTS = 'https://www.tistory.com/apis/post/list';
            const options = {
                method: 'GET',
                uri: URL_TISTORY_GET_POSTS,
                qs: {
                    access_token: globalToken.tistory.token,
                    blogName: globalToken.tistory.blogName,
                    output: 'json'
                }
            };

            return request(options)
        })
        .then(posts => {
            const lastId = JSON.parse(posts).tistory.item.posts[0].id;
            const postIds = [];
            for(let i=72; i<=lastId; i++){
                postIds.push(i);
            }

            return asyncp.eachSeries(postIds, (postId) => {
                if(githubApiUseCount % 100 === 0){
                    return new Promise((resolve) =>{
                        setTimeout(() => {
                            resolve();
                        }, 20 * 60 * 1000);
                    }).then(() => {
                        return createGithubIssueAndComments(postId, globalToken);
                    })
                }
                return createGithubIssueAndComments(postId, globalToken);
            });

        })
        .then(() => {
            console.log('Migration Finished!');
        })
        .catch((err) => {
            console.log(err);
        });
}


function readToken() {
    return fs.readJson('./token.json', {throws: false});
}

function setGlobalToken(tokenJson) {
    if(tokenJson.tistory.token
    && tokenJson.tistory.blogName
    && tokenJson.github.owner
    && tokenJson.github.repo
    && tokenJson.github.token){
        globalToken = tokenJson;
    } else {
        console.log('./token.json에 빈 항목이 있습니다.');
    }
}

function createGithubIssueAndComments(postId, tokenJson) {
    let comments;
    return getTistoryComments(postId, tokenJson)
        .then(body => {
            const notSorted = JSON.parse(body).tistory.item.comments;
            if(!notSorted || notSorted.length === 0){
                throw new Error(postId+'는 댓글이 없는 포스팅입니다.');
            }
            comments = sort(notSorted);
            return getOrCreateGithubIssue(postId, tokenJson);
        })
        .then(body => {
            const issueNo = body.number;
            return createIssueComments(comments, tokenJson, issueNo);
        })
        .then(body => {
            console.log(tokenJson.tistory.blogName+'.tistory.com/'+postId+' Migration 성공');
        })
        .catch((err) => {
            console.log('postId: '+postId);
            console.log(err.message);
        });
}

function getTistoryComments(postId, tokenJson) {
    const URL_TISTORY_GET_COMMENTS = 'https://www.tistory.com/apis/comment/list';
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

function sort(comments) {
    function createComment (comment) {
        function toUtf8(message) {
            return new Buffer(message, 'utf8').toString();
        }

        return {
            "id": comment.id,
            "author": '작성자: '+toUtf8(comment.name),
            "content": toUtf8(comment.comment),
            "child": []
        }
    }

    const treeObject = {};

    for(let i=0; i<comments.length; i++){
        let comment = comments[i];
        if(!comment.parentId){
            treeObject[comment.id] = createComment(comment);
        } else {
            treeObject[comment.parentId].child.push(createComment(comment));
        }
    }

    const flatArray = [];
    for(let prop in treeObject){
        let parent = treeObject[prop];
        flatArray.push(parent);

        for(let i=0; i<parent.child.length;i++){
            flatArray.push(parent.child[i]);
        }
    }

    return flatArray;
}

function getOrCreateGithubIssue(postId, tokenJson) {
    return searchIssue(postId, tokenJson)
        .then(body => {
            if(body['total_count'] > 0){
                return new Promise((resolve) =>{
                    resolve({
                        number: body.items[0].number
                    });
                });
            } else {
                return createGithubIssue(postId, tokenJson);
            }
        });
}

function createGithubIssue(postId, tokenJson) {
    return new Promise((resolve) =>{
        setTimeout(() => {
            resolve();
        }, interval);
    }).then(()=>{
        githubApiUseCount++;
        const url = 'http://jojoldu.tistory.com/'+postId;
        const options = {
            method: 'POST',
            uri: createIssueUrl(tokenJson),
            body: {
                title: url,
                body: url
            },
            headers: {
                'Authorization': 'token '+tokenJson.github.token,
                'User-Agent': 'https://api.github.com/meta'
            },
            json: true
        };
        return request(options);
    });
}

function createIssueUrl(tokenJson) {
    const URL_GITHUB_CREATE_ISSUE = 'https://api.github.com/repos/{github.owner}/{github.repo}/issues';
    return URL_GITHUB_CREATE_ISSUE
        .replace('{github.owner}', tokenJson.github.owner)
        .replace('{github.repo}', tokenJson.github.repo);
}

function searchIssue(postId, tokenJson) {
    const url = createSearchIssueUrl(postId, tokenJson);
    const options = {
        method: 'GET',
        uri: url,
        headers: {
            'Authorization': 'token '+tokenJson.github.token,
            'User-Agent': 'https://api.github.com/meta'
        },
        json: true
    };

    return request(options);
}

function createSearchIssueUrl(postId, tokenJson) {
    const URL_GITHUB_SEARCH_ISSUE = 'https://api.github.com/search/issues?q=repo:{github.owner/repo}+http://{tistory.blogName}.tistory.com/{postId} in:title';

    return URL_GITHUB_SEARCH_ISSUE
        .replace('{github.owner/repo}', tokenJson.github.owner+'/'+tokenJson.github.repo)
        .replace('{tistory.blogName}', tokenJson.tistory.blogName)
        .replace('{postId}', postId);
}

function createIssueComments(comments, tokenJson, issueNo) {
    asyncp.eachSeries(comments, (comment) => {
        return new Promise((resolve) =>{
            setTimeout(() => {
                resolve();
            }, interval);
        }).then(()=> {
            githubApiUseCount++;
            const options = {
                method: 'POST',
                uri: createIssueCommentUrl(tokenJson, issueNo),
                body: {
                    body: comment.author+'\n\n'+comment.content
                },
                headers: {
                    'Authorization': 'token '+tokenJson.github.token,
                    'User-Agent': 'https://api.github.com/meta'
                },
                json: true
            };
            return request(options);
        })
    });
}

function createIssueCommentUrl(tokenJson, issueNo) {
    const URL_GITHUB_CREATE_ISSUE_COMMENT = 'https://api.github.com/repos/{github.owner}/{github.repo}/issues/{github.issueNo}/comments';

    return URL_GITHUB_CREATE_ISSUE_COMMENT
        .replace('{github.owner}', tokenJson.github.owner)
        .replace('{github.repo}', tokenJson.github.repo)
        .replace('{github.issueNo}', issueNo);
}


function createSearchLastIssueUrl(tokenJson) {
    const URL_GITHUB_SEARCH_ISSUE = 'https://api.github.com/search/issues?order=desc&q=repo:{github.owner/repo}';

    return URL_GITHUB_SEARCH_ISSUE
        .replace('{github.owner/repo}', tokenJson.github.owner + '/' + tokenJson.github.repo);
}

function cleanAll() {
    let tokenJson;
    readToken()
        .then(body => {
            tokenJson = body;
            const url = createSearchLastIssueUrl(tokenJson);
            const options = {
                method: 'GET',
                uri: url,
                headers: {
                    'Authorization': 'token '+tokenJson.github.token,
                    'User-Agent': 'https://api.github.com/meta'
                },
                json: true
            };

            return request(options);
        })
        .then(body => {
            const lastNo = body['total_count'];
            const issueNos = [];
            for(let i=1;i<=lastNo;i++){
                issueNos.push(i);
            }
            asyncp.eachSeries(issueNos, (issueNo) => {
                console.log(issueNo+'를 삭제합니다.');
                const options = {
                    method: 'PATCH',
                    uri: createIssueUrl(tokenJson)+'/'+issueNo,
                    body: {
                        title: '[removed]',
                        state: 'closed'
                    },
                    headers: {
                        'Authorization': 'token '+tokenJson.github.token,
                        'User-Agent': 'https://api.github.com/meta'
                    },
                    json: true
                };
                return request(options);
            });
        })
        .catch((err) => {
            console.log(err);
    });
}

exports.print = function () {
    console.log('aaa');
};

exports.cleanAll = cleanAll;
exports.execute = execute;
exports.createGithubIssueAndComments = createGithubIssueAndComments;
exports.getOrCreateGithubIssue = getOrCreateGithubIssue;
exports.createSearchIssueUrl = createSearchIssueUrl;
exports.createIssueUrl = createIssueUrl;
exports.createIssueCommentUrl = createIssueCommentUrl;
exports.sort = sort;
exports.readToken = readToken;
exports.createGithubIssue = createGithubIssue;

require('make-runnable');