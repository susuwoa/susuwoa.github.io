---
title: 快速上手click
createTime: 2025/06/05 13:51:07
permalink: /article/p8jdb7tb/
tags:
- CLI
- Python
- 上手教程
---
## 安装
```bash
pip install click
```

## Hello World!
```python
import click

@click.command()
def hello():
	click.echo("Hello, World!")

if __name__ == "__main__":
	hello()
```
通过装饰器`@click.command()`可以将函数包装成命令行工具，并且得到相应的帮助页面
```bash
$ python cli.py
Hello, World!
$ python hello.py --help
Usage: hello.py [OPTIONS]

Options:
  --help  Show this message and exit.
```

## 组
```python
import click


@click.group()
def cli():
	pass


@cli.command()
def hello():
	click.echo("Hello, World!")


@cli.command()
def bye():
	click.echo("Goodbye, World!")


if __name__ == "__main__":
	cli()
```
装饰器`@click.group()`可以将函数包装为`Group`对象，之后可以使用装饰器`@cli.command()`将命令附加到组中，成为子命令，从而将命令组织起来
```bash
$ python cli.py --help
Usage: cli.py [OPTIONS] COMMAND [ARGS]...

Options:
  --help  Show this message and exit.

Commands:
  bye
  hello
```

> 也可以在使用`@click.command()`装饰器后再使用`cli.add_command()`方法将命令附加到组中

## 参数
```python
import click


@click.group()
def cli():
    pass


@cli.command()
@click.option(
    "-n",
    "--name",
    required=False,
    default=None,
    help="The person to greet.",
    show_default=True,
)
def hello(name):
    if name:
        click.echo(f"Hello, {name}!")
    else:
        click.echo("Hello, World!")


@cli.command()
def bye():
    click.echo("Goodbye, Everyone!")


if __name__ == "__main__":
    cli()
```

通过装饰器`@click.option()`可以添加可选参数。在上面的例子中，我们为`hello`命令添加了一个`--name`参数（简写为`-n`）。这个参数不是必需的（`required=False`），默认值为`None`（`default=None`），并且帮助信息中会显示默认值（`show_default=True`）。

除了可选参数之外，还可以使用`@click.argument()`来添加位置参数：

```python
import click


@click.group()
def cli():
    pass


@cli.command()
@click.argument("name", required=False)
def hello(name):
    if name:
        click.echo(f"Hello, {name}!")
    else:
        click.echo("Hello, World!")


if __name__ == "__main__":
    cli()
```

```bash
$ python cli.py hello John
Hello, John!

$ python cli.py hello
Hello, World!
```

在这个例子中，`name`是一个位置参数。与`option`不同，`argument`是直接输入而不带前缀标志（如`--`或`-`）。

## 进阶功能

### 多层命令组

Click 支持多层命令组，你可以将多个命令组嵌套起来以实现更复杂的命令行结构。

```python
import click


@click.group()
def cli():
    pass


@cli.group()
def user():
    """User management commands."""
    pass


@user.command()
@click.option("--username", required=True, help="The username to create.")
def create(username):
    click.echo(f"Creating user: {username}")


@user.command()
@click.option("--username", required=True, help="The username to delete.")
def delete(username):
    click.echo(f"Deleting user: {username}")


if __name__ == "__main__":
    cli()
```

运行结果：

```bash
$ python cli.py user create --username=admin
Creating user: admin

$ python cli.py user delete --username=admin
Deleting user: admin
```

通过这种方式，你可以构建出具有层级结构的命令行工具，例如 Git 中的 `git remote add`、`git remote remove` 等。

### 输入提示和密码隐藏

Click 提供了用于获取用户输入的功能，比如 `click.prompt()` 和 `click.password_option()`。

```python
import click


@click.command()
@click.option("--username", prompt="Your username", help="The username to greet.")
def greet(username):
    click.echo(f"Hello, {username}!")


if __name__ == "__main__":
    greet()
```

运行时会提示用户输入用户名：

```bash
$ python cli.py
Your username: John
Hello, John!
```

如果你希望输入的是密码并隐藏内容，可以使用 `hide_input=True`：

```python
@click.command()
@click.option(
    "--password",
    prompt="Enter your password",
    hide_input=True,
    confirmation_prompt=True,
)
def login(password):
    click.echo("Logging in...")
```

这段代码会提示用户输入密码，并且不会显示在终端上，同时还会让用户再次确认密码（因为用了 `confirmation_prompt=True`）。

### 自定义类型和验证

你还可以自定义参数类型或进行参数验证。Click 支持通过 `type` 参数指定特定类型，如 `int`、`float` 或 `click.Path()` 等。

```python
import click


@click.command()
@click.option("--age", type=int, prompt="Your age", help="Your age in years.")
def info(age):
    click.echo(f"You are {age} years old.")
```

也可以使用 `callback` 来做额外的验证：

```python
def validate_age(ctx, param, value):
    if value < 0:
        raise click.BadParameter("Age cannot be negative.")
    return value


@click.command()
@click.option(
    "--age",
    type=int,
    prompt="Your age",
    help="Your age in years.",
    callback=validate_age,
)
def info(age):
    click.echo(f"You are {age} years old.")
```

### 颜色输出

Click 还支持彩色输出，可以通过 `click.secho()` 函数实现：

```python
import click


@click.command()
def status():
    click.secho("Success!", fg="green")
    click.secho("Warning!", fg="yellow")
    click.secho("Error!", fg="red", bold=True)
```

支持的颜色包括：`black`, `red`, `green`, `yellow`, `blue`, `magenta`, `cyan`, `white`。  
背景色可以用 `bg` 指定，文本样式可以用 `bold`, `dim`, `underline`, `blink`, `reverse`, `hide` 控制。