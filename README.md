![logo](https://i.imgur.com/vpGUGLz.png)

Backend da aplicação `fastfeet`.

## Install dependencies

> É necessário que o serviço [Docker](https://www.docker.com/) esteja intalado em sua máquina.

Utilizei o driver [mysql](https://www.mysql.com/) para criar o banco de dados da aplicação.

Execute o seguinte comando para baixar a imagem do `mysql` e criar um container da mesma em sua máquina.

```bash
 docker run --name mysql_docker -p 3306:3306 -e MYSQL_ROOT_PASSWORD=root -t cytopia/mysql-5.7
```

Para as filas de email utilizei o driver [redis](https://redis.io/) por ser um banco chave & valor extremamete performático.

Execute o comando abaixo para baixar a imagem do `redis` e criar o container em sua máquina.

```bash
docker run --name redisfastfeet -p 6379:6379 -d -t redis:alpine
```

Por fim instale as dependencias do projeto na raiz do projeto.

```bash
yarn
```

## Migrations

Execute este comando para rodas as `migrations` do banco de dados.

```bash
yarn sequelize db:migrate
```

## Seeds

Execute este comando para gerar a seed do User admin da aplicação

```bash
yarn sequelize db:seed:all
```

## Executar

Para executar a aplicação, basta executar os seguintes coamndos.

### Aplicação

```bash
yarn dev
```

### Filas

```bash
yarn queue
```

## Usuário da aplicação

- Email: admin@fastfeet.com
- Senha: 123456
