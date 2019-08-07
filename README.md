[![CircleCI](https://circleci.com/gh/kobabasu/micro-postcss.svg?style=shield&circle-token=c181a31aabfe59d8f79ece75e1af85b0726555a6)](https://circleci.com/gh/kobabasu/micro-postcss)

# micro-postcss
postcssを利用するためnodejs環境とpostcss-cli, clean-css-cliのインストールが必要

```
git submodule add git@github.com-kobabasu:kobabasu/micro-postcss.git postcss  
git submodule update
```

## yarn
preinstallでひとつ上の階層にcss/, stylesheet/が作成される
変更はその中で行う
1. 必要があればdevelopブランチを使う  
   `git checkout develop`
1. `yarn start`
1. `yarn install`

## circleci
1. githubとcircleciとslackを連携させる
1. .cicrleci/config.ymlをプロジェクトルートにコピー
1. config.ymlの`working_directory`を編集
1. プロジェクトのREADME.mdのbadgeを編集
1. git push してみて成功するか確認

## Dockerfile
もしcircleciのコンテナになにか追加する必要があれば、
Dockerfileを編集しbuildしdocker hubにpush

1. `hub clone cores/cores-vagrant coreos`
1. config.rb, user-dataをコピー
1. config.rbを編集
1. `shared_folder`でレポジトリのルートを共有
1. `docker build -t kobabasu/alpine-chrome:0.xx` /home/core/share`
1. `docker login`
1. `docker push kobabasu/alpine-chrome:0.xx`
1. docker-composeをインストール
1. `docker-compose up`
1. `docker-compose start`
1. `docker exec chrome gulp mocha:report`や`vagrant ssh -c 'docker exec chrome gulp mocha:report'`で確認
1. 問題なければ`.circleci/config.yml`のimagesのバージョンを変更
1. git pushで確認

## npm script
1. `yarn run copy`  
   css, stylesheetをひとつ上の階層にコピー
1. `yarn run minify`  
   ../css/*.min.css以外のminifyしたファイルを../css以下に作成
1. `yarn run build`  
   build.shとminifyをあわせて行う
1. `yarn run postinstall`  
   `yarn install`直後に実行される copyとbuild
1. `yarn run test`  
    mochaによるtestの実行
1. `yarn run reporter`  
   circleci用のレポートを出力 
1. `yarn run coverage`  
   テストのカバレッジを計測
1. `yarn run watch`  
   ../styleheet内のファイルを更新したらbuildを実行する

## build files
`yarn run build`で一つ上の階層の../css, ../stylesheetに以下が生成される

1. css/style.css (src/からビルドされたstyle.css), pages/*.cssが出力される
1. css/*.css (pages/*.cssから出力される)
1. stylesheet/configs (各種設定、vars, base, fonts, modulesなど)
1. stylesheet/fonts (使用するfontsファイル)
1. stylesheet/layouts (レイアウトに関するcss header, footerなど0
1. stylesheet/pages (各ページ固有のスタイル)

## edit
1. `yarn install`
1. 生成した../stylesheet内で必要なファイルを編集
1. `yarn run build` 

## font update
icomoonなどfontを追加した場合など、アップデートするには以下の手順を実行
1. icomoonのサイトからzipをダウンロード
1. 解答したicomoonのディレクトリの中身すべてを./stylesheet/fonts/icomoon/内に上書き
1. ./stylesheet/configs/fonts.css内のicomoonのスタイルにicomoon/style.cssの該当箇所をコピー
1. min含めbuildして完了

## postcss repository update
1. postcssディレクリに移動
1. git pullでアップデート
1. `yarn run build`
1. ../css, ../stylesheetはディレクトリが存在した場合コピーしないので注意する

## test
1. test/*.jsが対象となる
1. describe, itのタイトルの先頭にEXCLUDEをつけるとそのテストを無視する
1. package.json内のscriptは省略しているがmocha, nycのオプションはtest/mocha.opts, .nycrc, .babelrcに記述


---

## npm packages
|name                    |desc                                                |
|:-----------------------|:---------------------------------------------------|
|postcss                 |cssを変換                                           |
|postcss-preset-env      |必要なセットを用意                                  |
|postcss-url             |img srcのパスなどを解決                             |
|postcss-import          |import構文を実現する                                |
|postcss-for             |for文が書けるようになる                             |
|postcss-for-variables   |for文内で変数が使えるようになる                     |
|clean-css-cli           |cssファイルをminify globalにも必要                  |
|@babel/core             |mochaのes6用 circleci用にglobalにも必要             |
|@babel/register         |.nycrcでrequireしてる circleci用にglobalにも必要    |
|@babel/preset-env       |.babelrcでrequireしてる circleci用にglobalにも必要  |
|babel-plugin-istanbul   |.babelrcでrequireしてる circleci用にglobalにも必要  |
|chrome-launcher         |E2Eテストで利用                                     |
|chrome-remote-interface |E2Eテストコードを書きやすくする                     |
|jsdom                   |テストコードを書きやすくする                        |
|mocha                   |テスト用 globalにも必要                             |
|mocha-junit-reporter    |circleci用のレポート出力に必要 test/mocha.optsで設定|
|chai                    |テスト用ライブラリ                                  |
|sinon                   |テスト用 spy, stub, mock                            |


---


## trouble shooting
1. `yarn run build`と`yarn run  minify`がエラーとなる場合はsrc/{build.sh, minify.sh}の実行権限を確認


---


## todo
- [ ] exampleのフォントが太字になっている原因を調べる
