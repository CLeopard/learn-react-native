### 创建文件夹  
直接输入“\”符号

### 更新Github到本地
```
git pull origin master
```
### 提交至Github
```
git add .
git commit -a -m "message"
git push origin master
```

### Github删除.DS_Store
- 删除原有的.DS_Store  

```
find . -name .DS_Store -print0 | xargs -0 git rm -f --ignore-unmatch
```

- 建立.gitignore文件  
```
vi .gitignore
```   
增加  
`.DS_Store`
- 提交到git  

```
git add .gitignore
git commit -m '.DS_Store banished!'
```