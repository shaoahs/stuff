# 網頁遊戲開發環境設定與專案建立

基本說明

- - - -

## 開發環境設定

### 提示

````bash
$> 此畫面為 command line interface (console 終端機)
````

### 相關需求

- nodejs  v12.x.x [下載](https://nodejs.org/dist/latest-v12.x/)
- git [下載](https://git-scm.com/downloads)

確認是否安裝完成，請參考如下畫面

````bash
$> node --version
v12.x.x

$> git --version
git version x.x.x

````

確認上面步驟完成後  

### 專案用工具程式

- grunt-cli

安裝步驟如下

````bash
$> npm install -g grunt-cli
$> grunt --version
grunt-cli v1.3.2
````

確認上面步驟完成後

### 安裝 game framework

game  framework 根目錄說明

````bash
.
├── builder               [產生設定檔用]
├── CHANGELOG.md          [更動歷程]]
├── dependence            [共用的第三方程式庫]
├── developer             [專案測試用工具程式]
├── favicon.ico
├── Gruntfile.js          [專案開發流程設定檔]
├── node_modules
├── package.json         
├── package-lock.json
├── project               [專案存放路徑]
├── README.md             [說明]
├── schema
├── server                [測試用服務器]
├── systemjs              [管理 javascript 用]
├── tasks                 [自動化流程用]
├── template           
├── tools
├── updateManager.sh
````

在 game framework 根目錄 , 如下輸入

````bash
$> npm install
````

確認上面步驟完成後，即可建立新專案

### game framework 命令說明

下面命令 , 須在 game framework 根目錄下輸入

````bash
- grunt  serve       [啟動測試用伺服器,所有專案共用一個服務]
- grunt  create      [建立新專案用]
````

## 啟動測試用伺服器

所有專案共用一個服務, 在不同專案間切換時,也不需要重新啟動
開啟新的 console 後(在 game framework 根目錄) 輸入下面命令

````bash
$> grunt serve
````

開啟瀏覽器 輸入網址 http://localhost:3000/developer/agent/index.html

## 建立新專案

### 範例

- 主專案 https://git.astrocorp.com.tw/gti-demo/game-client/demo/sample
- 附屬專案 https://git.astrocorp.com.tw/gti-demo/game-client/demo/jackpot

### 產生新專案

在game framework 根目錄下 步驟如下所示

````bash
$> grunt create

"webgame" template notes:
新專案

Please answer the following:
[?] group (slot) [輸入群組名稱,如果是 slot 則可直接按下 <enter鍵>]
[?] Project name (sample) [輸入專案名稱後按下 <enter鍵>]
[?] package [直接按下 <enter鍵>]
[?] Do you need to make any changes to the above before continuing? (y/N) [直接按下 <enter鍵>]
````

完成後, 可看到如下面所示

````bash
Initialized from template "webgame".
專案建立完成

Done, without errors.

Done.
````

完成後, 專案會產生在 project 之中
在 game framework 根目錄下 , 如下輸入,進入專案目錄 

````bash
$> cd project
$> cd <群組名稱>
$> cd <專案名稱>
````

### 專案目錄說明

````bash
.
├── app                 [自動產生, public 模式用]
├── ci                   [CI 用]
├── config              [自動產生, build public 模式用]
├── content.config.yml  [專案設定檔]]
├── data                [自動產生, public 模式用]
├── debug               [自動產生, debug 模式用]
├── gamecard            [遊戲卡片圖檔]
├── Gruntfile.js        [自動化流程設定檔]
├── raw                 [grunt filelist 命令用, 產生資源設定檔用]
├── readme.md           [專案說明]
├── release             [自動產生, build public 模式用]
├── res                 [遊戲資源存放位置]
├── res.config.yml      [遊戲資源設定檔]
├── src                 [程式碼存放位置]
├── system.set.yml      [程式碼設定檔]
├── template            [遊戲設定檔]
├── test                [測試網路封包用]
├── tmp                 [暫存]
└── tsconfig.json       [typescript 用]
````

## 專案開發流程

相關命令, 以下命令須在專案資料夾下才行使用

````bash
- grunt makeres   [產生指定語言的資源檔,預設為英文]
- grunt source    [產生除錯版]
- grunt build     [產生最佳化版, 預設值為不顯示 log]
- grunt public    [產生公開版, 預設值為不顯示 log]
- grunt filelist  [產生資源檔清單]
- grunt clean     [清除暫存檔用]
- grunt report    [產生程式碼分析報告]
- grunt test      [產生測試用程式碼]
- grunt tag       [自動產生專案版本標籤]
````

### 產生除錯版 輸入下面命令

````bash
$> grunt source
````

完成後,即可看到除錯用的版本

### 產生最佳化版 輸入下面命令

````bash
$> grunt build
````

完成後,即可看到最佳化用的版本

### 產生公開版 輸入下面命令

````bash
$> grunt public
````

完成後,即可看到公開用的版本

### 本機測試用網址

開啟瀏覽器 輸入網址  (http://localhost:3000/developer/agent/index.html)

### 產生資源設定檔 輸入下面命令

````bash
$> grunt filelist
````

修改輸出設定請參考 gruntfile.js 的 filelist 部份
專案 template 定義了三個場景設定

- main     (主場景)
- sub      (次要場景)

所以產生資源檔命令有下面四種產生方式

````bash
$> grunt filelist          [產生全部場景資源設定]
$> grunt filelist:main     [產生主場景資源設定]
$> grunt filelist:sub      [產生次要場景資源設定]
````

### 產生程式碼分析報告

````bash
$> grunt report
````

輸入上面命令完成後會在專案根目錄下, 產生 statistics.html 檔案, 用瀏覽器開啟即可。

### 自動產生專案版本標籤

根據專案設定檔 content.config.yml 的 version 屬性,自動產生版本標籤,然後上傳至預設定 gitlab server , 輸入下面命令即可

````bash
$> grunt tag
````

grunt tag  命令, 是執行 git tag -a '文字描述' -m '文字描述' 與 git push --tags 的組合

## 專案間切換

### 當專案是主專案時

在專案的根目錄下 (project/<群組名稱>/<專案名稱>) 輸入下面其中一個命令即可

````bash
$> grunt source
$> grunt build
$> grunt public
````

完成後 重新更新網頁 http://localhost:3000/developer/agent/index.html 就可以看要指定的專案

### 當專案為附屬專案或子專案時

例如

- JP 遊戲
- 小遊戲
- 需要遊戲大廳的遊戲

需要修改專案的 context.config.yml  檔 , 將 下面的註解取消

````bash
#excluded:
#  autoTest: true
````

改為如下所示即可

````bash
excluded:
  autoTest: true
````

## 建立附屬專案

在game framework 根目錄下 步驟如下所示

````bash
$> grunt create:other

"webgame" template notes:
新專案

Please answer the following:
[?] group (slot) [輸入群組名稱,如果是 slot 則可直接按下 <enter鍵>]
[?] Project name (other) [輸入專案名稱後按下 <enter鍵>]
[?] package [直接按下 <enter鍵>]
[?] Do you need to make any changes to the above before continuing? (y/N) [直接按下 <enter鍵>]
````

完成後, 可看到如下面所示

````bash
Initialized from template "other".
專案建立完成

Done, without errors.

Done.
````


