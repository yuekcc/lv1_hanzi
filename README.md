# Lv1 汉字

访问：[lambdadriver.space/lv1_hanzi/index.html]

[lambdadriver.space/lv1_hanzi/index.html]: https://lambdadriver.space/lv1_hanzi/index.html

## 更新数据

```shell
cd data/scripts

# 创建数据库
node init_db.mjs

# 文本数据转换为 JSON
node gen_lv1_data.mjs
node gen_lv2_data.mjs

# 创建 sqlite 数据库
node save_to_db.mjs
```


## LICENCE

MIT
