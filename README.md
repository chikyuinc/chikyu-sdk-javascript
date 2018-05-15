# Chikyu
## 概要
**内容は全てリリース前のものであり、予告なく変更となる場合があります**

ちきゅうのWeb APIをJavaScript(jQuery)から利用するためのライブラリです。

＊NodeJSでの利用は想定しておりません。

## APIの基本仕様について
こちらのレポジトリをご覧ください

https://github.com/chikyuinc/chikyu-api-specification

## インストール
htmlのヘッダ部に、以下のスクリプトを埋め込んで下さい。

```
<script src="https://sdk.amazonaws.com/js/aws-sdk-2.190.0.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/js-sha256/0.9.0/sha256.js"></script>
<script src="https://code.jquery.com/jquery-2.2.4.min.js"></script>
<script src="https://s3-ap-northeast-1.amazonaws.com/chikyu-cors/js/chikyu-sdk.min.js"></script>
```

## SDKを利用する
### テスト段階でのサンプルコード
```test.js
$(function() {
  chikyu = new Chikyu.Sdk();
  //2018/05/14現在、まだ本番環境が未構築であるため、こちらのテスト用の環境名を指定して下さい。
  chikyu.config.setMode('devdc');
  
  //セッションの生成
  chikyu.login('tokenName', 'loginToken', 'loginSecretToken').then(function(data) {
    //セッション生成後、APIが呼び出し可能となる
    chikyu.invokeSecure('/entity/prospects/list', {
      'items_per_page': 10,
      'page_index': 0
    }).then(function(data) {
      alert(JSON.stringify(data));
    }).fail(function(err) {
      alert(JSON.stringify(err));
    });
  }).fail(function(err) {
    alert(JSON.stringify(err));
  });
});
```

## 詳細
### class1(APIキーのみで呼び出し可能)
#### APIトークンを生成する
```token.js
chikyu = new Chikyu.Sdk();

// 2018/05/15現在、まだ本番環境が存在しないため、接続先の指定が必要。
chikyu.config.setMode('devdc');

//後述のclass2 apiを利用し、予めトークンを生成しておく。
//(APIキーを生成するAPIは、ログインした状態にならないと実行できない)
chikyu.login('token_name',  'login_token',  'login_secret_token').then(function(data) {
  // 引数にキー名称(任意)と、関連付けるロールのIDを指定する。
  // 関連付けるロールは、予め作成しておく。
  chikyu.invokeSecure('/system/api_auth_key/create', {
    'api_key_name': 'key_name',
    'role_id': 1234,
    'allowed_hosts': []
  }).then(function(data) {
    //生成されたキーを、ファイルなどに保存しておく
    alert(JSON.stringify(data));
  }).fail(function(err) {
    alert(JSON.stringify(err));
  });
}).fail(function(err) {
  alert(JSON.stringify(err));
});
```

#### 呼び出しを実行する
```invoke_public.js
chikyu = new Chikyu.Sdk();

// 2018/05/15現在、まだ本番環境が存在しないため、接続先の指定が必要。
chikyu.config.setMode('devdc');

//保存しておいたAPIキーをセットする
chikyu.setApiKeys('api_key', 'auth_key');

// 第一引数=APIのパスを指定(詳細については、ページ最下部のリンクを参照)
// 第二引数=リクエスト用JSONの「data」フィールド内の項目を指定
chikyu.invokePublic('/entity/prospects/list', {
  'items_per_page': 10,
  'page_index': 0
}).then(function(data) {
  //レスポンス用JSONの「data」フィールド内の項目が返ってくる。
  alert(JSON.stringify(data));
}).fail(function(err) {
  //APIの実行に失敗(httpエラーが発生 or has_errorがtrue)の場合は例外が発生する。
  alert(JSON.stringify(err));
});
```

### class2(APIトークンからセッションを生成)
#### APIトークンを生成する
```create_token.js
chikyu = new Chikyu.Sdk();

// 2018/05/15現在、まだ本番環境が存在しないため、接続先の指定が必要。
chikyu.config.setMode('devdc');

chikyu = new Chikyu.Sdk();
chikyu.createToken('token_name', 'email', 'password')
          .then(function(data) {
            //トークン情報をローカルストレージなどに保存しておく
            alert(JSON.stringify(data));
          }).fail(function(err) {
            alert(JSON.stringify(err));
          });

```

#### ログインしてセッションを生成する
```create_session.js
chikyu = new Chikyu.Sdk();

// 2018/05/15現在、まだ本番環境が存在しないため、接続先の指定が必要。
chikyu.config.setMode('devdc');

//セッションが存在するかチェックする
if (!chikyu.hasSession()) {
  //上で生成したトークン情報を保存しておき、展開する
  chikyu.login('token_name',  'login_token',  'login_secret_token').then(function(session) {
    alert(JSON.stringify(session));
    
    //セッション情報をテキストに変換する
    var text = chikyu.sessionToJson();
    
    //セッション情報をテキストから復元する
    session = chikyu.sessionFromJson(text);
    
    //処理対象の組織を変更する
    chikyu.changeOrgan(1234).then(function() {
      //ログアウトする
      chikyu.logout().then(function() {
        alert('ログアウトしました');
      }).fail(function(err) {
        alert(JSON.stringify(err));
      });
    }).fail(function(err) {
      alert(JSON.stringify(err));
    });
  }).fail(function(err) {
    alert(JSON.stringify(err));
  });
} else {
  //現在のセッション情報を取得
  alert(JSON.stringify(chikyu.session));
}
```


#### 呼び出しを実行する
```invoke_secure.js
chikyu = new Chikyu.Sdk();

// 2018/05/15現在、まだ本番環境が存在しないため、接続先の指定が必要。
chikyu.config.setMode('devdc');

// chikyu.loginを実行した後であれば実行可能。
// (他言語のSDKとは異なり、引数にセッション情報は不要)
chikyu.invokeSecure('/entity/prospects/list', {
  'items_per_page': 10,
  'page_index': 0
}).then(function(data) {
  //レスポンス用JSONの「data」フィールド内の項目が返ってくる。
  alert(JSON.stringify(data));
}).fail(function(err) {
  //APIの実行に失敗(httpエラーが発生 or has_errorがtrue)の場合は例外が発生する。
  alert(JSON.stringify(err));
});
```


## APIリスト
こちらをご覧ください。

http://dev-docs.chikyu.mobi/

