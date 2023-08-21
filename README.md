# EC2を作成するCDKコード

## 何するコードか
- SDK： キーペア作成
- CDK： EC2作成

## 事前知識
- https://qiita.com/ryome/items/ff2804be600cd5dcd61a

## 使い方

- リソースをクローン
```
git clone https://github.com/ryomeblog/ec2-cdk-sample.git
```

- 階層移動
```
cd SDK
```

- 依存関係解決
```
npm install
```

- SDK実行
```
node index.js <keyPairName>
```

- 階層移動
```
cd ../CDK
```

- 依存関係解決
```
npm install
```

- CDK初期設定
```
cdk bootstrap
```
（CloudFormationにCDKToolkitがあれば不要）

- リソース作成
```
cdk deploy
```

---

- リソース全消し
```
cdk destroy
```
