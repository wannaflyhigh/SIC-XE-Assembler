# SIC-XE-Assembler

## 支援指令

[./opCode.js](./opCode.js)或是[./Fig2_5.txt](./Fig2_5.txt)

根據老師要求，避免抄襲，所以只做課本fig2.5的指令

## 使用方法

修改[./readFile.js](./readFile.js)裡的filePath或是修改[./Fig2_5.txt](./Fig2_5.txt)中的程式碼，然後

```
npm start
```

終端機會依序秀出symbol table、objectCodes、objectProgram

執行方式及結果可以參考[./執行紀錄.txt](./執行紀錄.txt)

## 程式說明

在[pass 1](./pass1.js)中建立symbol table、對應機器碼、及format 2位址對應(這次實作不包含format 1)

在[pass 2](./pass2.js)中把format 3和4地址對應回去

## 可能及已知問題

因為實作時基本上只有考慮pc relative

- 當位址出現負數時，2的補數處理上可能會出錯(fig2.5沒問題，但demo時有一筆錯誤)
- Bass relative可能有漏洞
- 未測試直接定址
