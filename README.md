# tello-with-google-cloud-speech-to-text

## 概要
Google Cloud Speeth-To-Text API を使用して、  
音声で Ryze Tech Tello を操作します

## 動作確認環境
- Ryze Tech Tello
- MacBook (macOS Mojave Version10.14.6)
- nodeJS (v12.10.0)
- ffmpeg (v4.2.1)

Tello との接続では WiFi が必須です  
これとは別に Google API へ接続するネットワーク、ネットワーク機器が必要です  
ヘッドセットを使用して発話することをおすすめします

## nodeJS で使用するモジュール
- @google-cloud/speech v3.3.0
- dotenv v8.1.0
- node-record-lpcm16 v1.0.1

## インストール
1. nodeJS のパッケージをインストールする
```
$ npm install
```
2. Google Cloud Plathome で Speech-To-Text を使用したプロジェクトを作成して、
クレデンシャル用の JSON ファイルをダウンロードする
3. ファイル「.env-sample」を参考にして、ファイル「.env」を作成し、  
環境変数 GOOGLE_APPLICATION_CREDENTIALS へダウンロードした JSON ファイルを指定する

## 実行
1. Google API にアクセスできるようにネットワーク接続する
2. Tello と WiFi で接続する
3. nodeJS プログラムを実行
```
$ node app.js
```
4. 発話します

## 音声命令
- 離陸  
SDKモードへの移行命令、撮影開始命令を出してから離陸命令を出します
- 着陸  
着陸命令を出し、撮影停止命令を出します
- 「前」が含まれる言葉(例:前進)および「全身」(前進の誤認識用/以下同様)  
50cm 前進します
- 「後」が含まれる言葉(例:後退)および「交代」「交替」「抗体」  
50cm 後退します
- 右  
時計回りに90度回転します
- 左  
反時計回りに90度回転します
- 「上」が含まれる言葉(例:上昇)  
50cm 上昇します
- 「下」が含まれる言葉(例:下降)および「舌」「した」「加工」「火口」  
50cm 下降します
