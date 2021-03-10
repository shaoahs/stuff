# 修訂
舊的 framework 轉為新的, 修改規則說明

## 舊專案轉至新專案
下面為專案名稱為 test 的轉換範例
### 專案名稱為 test 的舊專案
- [複製]  表示需複製到新專案相同名稱的資料夾下
- [參考]  表示需參照舊專案的內容做修改
- [比對]  表示需與新專案的內容比較, 將自行修改過得程式碼加入新專案的

專案樹狀圖如下
````bash
.
├── content.config.yml
├── Gruntfile.js
├── jspm.build.json
├── package.json
├── raw
├── readme.md
├── res.config.yml
├── server
├── tasks
├── template
│   ├── gamecard.yml  [參考]
│   ├── index.html
│   └── theOther.yml 
└── web
    ├── app
    ├── config
    ├── data
    ├── dependence
    ├── favicon.ico
    ├── favicon.png
    ├── gamecard
    ├── index.html
    ├── lobby
    ├── res             [複製] 取消 <群組名稱><專案名稱> 資料夾
    ├── src
    │   └── slot
    │       └── test
    │           ├── component.js          [比對]
    │           ├── entities     
    │           ├── entity.js             [比對]
    │           ├── event
    │           ├── loading
    │           ├── main.js               [比對]
    │           ├── net
    │           ├── res
    │           ├── scene.js              [比對]
    │           └── strings
    ├── style
    └── test            [參考]
````
### 建立一個新專案 名稱為 test 的專案
- [複製]  表示需複製到新專案相同名稱的資料夾下
- [參考]  表示需參照舊專案的內容做修改
- [比對]  表示需與新專案的內容比較, 將自行修改過得程式碼加入新專案的
- [說明]  額外的說明

專案樹狀圖如下
````bash
.
├── config
│   └── gamecard.txt              [參考]
├── content.config.yml
├── debug
│   └── debug.config.js
├── gamecard              [說明]取消<專案群組>與<專案名稱>的資料夾
│   ├── background.png
│   ├── icon.png
│   └── logo.png
├── Gruntfile.js
├── raw
│   ├── main
│   │   ├── asset
│   │   ├── base
│   │   ├── bg
│   │   ├── sound
│   │   └── spine
│   ├── main.config.yml
│   └── sub
│       ├── bones
│       └── image
├── readme.md
├── res   [說明]取消<專案群組>與<專案名稱>的資料夾
│   ├── loading
│   │   ├── background.png
│   │   ├── Loading_01.png
│   │   ├── Loading_02.png
│   │   ├── Loading_03.png
│   │   ├── Loading_04.png
│   │   ├── Loading_05.png
│   │   ├── Loading_06.png
│   │   ├── Loading_07.png
│   │   ├── Loading_08.png
│   │   ├── Loading_09.png
│   │   ├── Loading_10.png
│   │   ├── Loading_11.png
│   │   └── Loading_12.png
│   ├── main
│   │   ├── asset
│   │   ├── base
│   │   ├── base.config.yml
│   │   ├── base.objectList.yml
│   │   ├── base.soundList.yml  
│   │   ├── base.spineList.yml
│   │   ├── base.textureList.yml
│   │   ├── bg
│   │   ├── button
│   │   ├── en.textureList.yml
│   │   ├── loading
│   │   ├── sound
│   │   ├── spine
│   │   ├── zh-cn.textureList.yml
│   │   └── zh-tw.textureList.yml
│   └── sub
│       ├── base.bonesList.yml
│       ├── base.config.yml
│       ├── base.objectList.yml
│       ├── base.spineList.yml
│       ├── base.textureList.yml
│       ├── bones
│       ├── en.textureList.yml
│       ├── image
│       ├── spine
│       ├── zh-cn.textureList.yml
│       └── zh-tw.textureList.yml
├── res.config.yml  [說明] 加入專案修改過的設定
├── src   [說明]取消<專案群組>與<專案名稱>的資料夾
│   ├── component.js   [比對]
│   ├── entities
│   │   ├── app.js
│   │   ├── main.js
│   │   ├── mainSet.js
│   │   ├── seed.js
│   │   ├── seedSet.js
│   │   ├── sub.js
│   │   └── subSet.js
│   ├── entity.js  [比對]
│   ├── event
│   │   ├── demo.js
│   │   └── keys.js
│   ├── loading
│   │   └── base.js
│   ├── main.js  [比對]
│   ├── net
│   │   ├── command
│   │   ├── command.js
│   │   ├── event.js
│   │   └── network.js
│   ├── res
│   │   ├── main.js
│   │   └── sub.js
│   ├── scene.js  [比對]
│   └── strings
│       ├── en.js
│       ├── strings.js
│       ├── zh-cn.js
│       └── zh-tw.js
├── system.set.yml   [參考]
├── template         [參考]
│   ├── gamecard.yml
│   └── theOther.yml
├── test
│   └── data
│       └── game.json     [參考]
└── tsconfig.json
````
