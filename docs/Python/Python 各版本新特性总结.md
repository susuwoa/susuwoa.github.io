---
title: Python 各版本新特性总结
createTime: 2025/06/05 13:51:33
permalink: /article/ytjekhx3/
tags:
- Python
---
## Python 3.10

### 结构化模式匹配

#### 核心语法

```python
match 待匹配的值:
    case 模式1:
        # 处理模式1匹配的情况
    case 模式2 if 守卫条件:  # 可选守卫条件
        # 处理模式2匹配的情况
    case _:
        # 默认情况（通配符）
```

#### 基本值匹配

```python
# 直接匹配常量值
status = 404
match status:
    case 200:
        print("成功")
    case 404:
        print("未找到")
    case 500:
        print("服务器错误")
```

#### 通配符 `_`

```python
# 匹配任意值，类似 else
match value:
    case 0:
        print("零")
    case _:
        print("非零")
```

#### 解构序列（列表、元组）

```python
# 提取序列中的元素
point = (3, 5)
match point:
    case (0, 0):
        print("原点")
    case (x, y):
        print(f"坐标：({x}, {y})")
```

#### 解构字典

```python
data = {"name": "Alice", "age": 30}
match data:
    case {"name": str(name), "age": int(age)}:
        print(f"{name}, {age}岁")
```

#### 类型匹配

```python
value = 3.14
match value:
    case int():
        print("整数")
    case float():
        print("浮点数")
    case str():
        print("字符串")
```

#### 类与对象解构

```python
class Point:
    __match_args__ = ("x", "y")  # 定义匹配顺序
    def __init__(self, x, y):
        self.x = x
        self.y = y

p = Point(2, 3)
match p:
    case Point(0, 0):
        print("原点")
    case Point(x, y):
        print(f"点位于 ({x}, {y})")
```

#### 守卫条件（Guard Clauses）

```python
# 在匹配模式后添加if条件进一步过滤
match point:
    case (x, y) if x == y:
        print("在斜线上")
    case (x, y) if x > 0 and y > 0:
        print("第一象限")
```

### 带括号的上下文管理器

```python
# 使用括号以提高可读性with语句的可读性
# 此功能亦允许你将多个上下文管理器组合在一起
with (open('text1.txt'), open('text2.txt')) as (f1, f2):
    text1 = f1.read()
    text2 = f2.read()
```

### 类型注解联合运算符

```python
def plus_one(number: int | float) -> int | float:
    return number + 1
```



## Python 3.9

### 字典合并运算符

```python
dict1 = {"name":"tom","age":16}
dict2 = {"name":"tom","age":18,"is_adult":True}

dict3 = dict1 | dict2
print(dict3) # 输出{'name': 'tom', 'age': 18, 'is_adult': True}
# 也支持以下写法
dict1 |= dict2
print(dict1) # 输出{'name': 'tom', 'age': 18, 'is_adult': True}
```

#### 移除前缀和后缀的字符串新方法

```python
# 如果字符串有给定的前缀/后缀，则返回移除该前缀/后缀后的新字符串则返回原始字符串。
text = 'hello world'
print(text.removeprefix('hello '))  # 'world'
print(text.removesuffix(' world'))  # 'hello'
```

## Python 3.8

### 海象运算符

#### if语句

```python
if n>0:
 """一些操作"""
 n-=1

# 改用海象运算符
if (n := n - 1)>0
 """一些操作"""
```

#### while语句

有限循环的情况：

```python
line = f.readLine()
while line:
   """一些操作"""
   line = f.readLine()

# 改用海象运算符
while line := f.readLine():
   """一些操作"""
```

无限循环的情况：

```python
while True:
 name = input()
 if name == "Tom":
  break

# 改用海象运算符

while (p := input()) != "Tom":
   continue
```

### f-string记录表达式

#### 快速调试变量值

```python
x = 10
y = 20
print(f"{x=}, {y=}")  # 输出: x=10, y=20
```

#### 调试条件判断

```python
price = 100
tax = 0.05
print(f"{price * (1 + tax)=}")  # 输出: price * (1 + tax)=105.0
```

