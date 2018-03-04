# 티스토리 댓글 마이그레이션 

[![Build Status](https://travis-ci.org/jojoldu/comments-migration.svg?branch=master)](https://travis-ci.org/jojoldu/comments-migration) [![Coverage Status](https://coveralls.io/repos/github/jojoldu/comments-migration/badge.svg?branch=master)](https://coveralls.io/github/jojoldu/comments-migration?branch=master)

## 소개

티스토리의 기본 댓글을 [utteranc](https://utteranc.es/)로 마이그레이션 하는 스크립트


## 사용

clone 받은 디렉토리에 token.json 을 아래 형태로 생성
 
```json
{
  "tistory": {
    "blogName": "티스토리 블로그 네임",
    "token": "티스토리 OAuth 토큰"
  },
  "github": {
    "owner": "깃헙 유저네임",
    "repo": "깃헙 댓글(utteranc) 저장소",
    "token": "깃헙 OAuth 토큰"
  }
}
```