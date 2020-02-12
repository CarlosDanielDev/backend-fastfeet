# Configurando Projeto Backend

Primeiro inicializar o projeto Node, execute o comando abaixo para gerar o `package.json`.

```bash
yarn init -y
```

Construiremos uma aplicação baseada no Express, então esta sera a priemira dependencia que vamos instalar.

```bash
yarn add express
```

Começaremos criando a estrutura da nossa aplicação, crie uma pasta com o nome `src`, nessa pasta é onde ficará todo o nosso código.

## Estrutura Inicial

```bash
mkdir src
```

Agora dentro da pasta `src`, vamos criar os arquivos de configuração da nossa aplicação.

```bash
touch src/app.js src/server.js src/routes.js
```

## ES6+ Syntax

Antes de qualquer cosia, vamos configurar nosso projeto `node` para suportar a syntax do `ES6+`, para isso utilizaremos a lib `Sucrase` juntamente com o nodemon.

```bash
yarn add sucrase nodemon -D
```

> Observe que eu utilizei a flag `-D`, que sinaliza que eu só irei usar essas dependencias em modo de desenvolvimento.

Agora vamos editar o arquivo `package.json`, deixe-o exatamente(ignore as versões caso esteja vendo issi em futuro distante) assim:

```json
{
  "name": "backend",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "dependencies": {
    "express": "^4.17.1"
  },
  "scripts": {
    "dev": "nodemon src/server.js"
  },
  "devDependencies": {
    "nodemon": "^2.0.2",
    "sucrase": "^3.12.1"
  }
}
```

Agora vamos criar o arquivo de configuração do nodemon, execute o seguinte comando, ou crie um arquivo na raiz do projeto com este nome: `nodemon.json`.

```bash
touch nodemon.json
```

Agora vamos editar este arquivo, deixe-o dessa forma:

```json
{
  "execMap": {
    "js": "node -r sucrase/register"
  }
}
```

Isso nos permite utilizar o `Sucrase`, para que node possa compreeender a syntax do `ES6+`.

## Configurando o `Debug`.

No seu `package.json` vamos criar um script de `DEBUG`, coloque esta linha dentro do bloco de `scripts` no seu `package.json`:

```json
{
+ "dev:debug" : "nodemon --inspect src/server.js"
}
```

Crie uma pasta na raiz do projeto com o nome, `.vscode`, dentro dela crie um arquivo com o nome `launch.json`, dentro desse arquivo cole as seguintes configurações.

> Criar pasta

```bash
mkdir .vscode
```

> Criar arquivo

```bash
touch .vscode/launch.json
```

> Conteúdo `launch.json`

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "attach", // *
      "name": "Launch Program",
      "restart": true, // new
      "protocol": "inspect" // change
    }
  ]
}
```

## Configurando o servidor

Edite o arquivo `app.js`

```js
import express from 'express'; // Importei o express
import routes from './routes'; // Importei as rotas

class App {
  // defini uma classe
  constructor() {
    // criei um constructor
    this.server = express(); // crie minha variavel de server
    this.middlewares(); // inicializei o método middlewares()
    this.routes(); // inicilizei o metodo que recebe as rotas
  }

  middlewares() {
    // defini o metodo middlewares()
    this.server.use(express.json()); // expecifiquei pro express que ele vai usar JSON
  }

  routes() {
    // defini o metodo routes
    this.server.use(routes); // especifiquei meu arquivo com as rotas para o metodo inicializar junto com o servidor
  }
}

export default new App().server; // exportei meu server
```

Agora vamos editar o arquivo `server.js`:

```js
import app from './app'; // importei o app

app.listen(5555); // disse pro servidor pra ele ouvir a porta 5555
```

## Estilo de Código padronizado!

Vamos usar o `ESLint` para deixar nosso código padronizado, intale sua dependência:

```bash
yarn add eslint -D && yarn eslint --init
```

options:

1. To check syntax, find problems, and enforce code style
2. Javascript modules (import/export)
3. None of these (about frameworks front-end)
4. Node
5. Use a popular style guide
6. Airbnb (**link**)
7. Javascript
8. Y

Apague na raiza do projeto o arquivo `package.lock.json` e execute o seguinte comando:

```bash
yarn
```

Instale as seguintes dependências:

```bash
yarn add prettier eslint-config-prettier eslint-plugin-prettier -D
```

Agora, pegue as configurações deste [Arquivo](https://gist.github.com/DanPHP7/99a90bc9deb5496d13ab870990fe9600) e substitua o conteúdo do seu arquivo `.eslintrc.js` por este.

Agora, crie um arquivo na raiz do projeto com o nome `.prettierrc`.

cole este conteúdo dentro arquivo que você acabou de criar.

```json
{
  "singleQuote": true,
  "traillingComma": "es5"
}
```

Para aplicar o linting da na nossa pasta `src/`, execute o comando abaixo.

```bash
yarn eslint --fix src --ext .js
```

Crie um arquivo no raiz do peojeto com este nome `.editorconfig`, e cole o conteúdo abaixo dentro do mesmo.

```.editorconfig
root = true

[*]const userExists = await User.findOne({ where: { email: req.body.email } });
    if (userExists) {
      return res.status(400).json({ error: 'User Already exists' });
    }
trim_trailing_whitespace = true
insert_final_newline = true
```

## Esquema de Pastas

Crie uma pasta com o nome `config`, dentro dessa pasta crie um arquivo `database.js`, dentro dessa pasta, crie uma apsta com o nome `migrations`, nessa pasta é onde vamos criar nossas migrations do Banco de Dados, dentro de `src/` crie as seguintes pastas `src/controllers`, `src/models`.

```bash
mkdir src/config src/config/migrations src/app src/app/controllers src/app/models && touch src/config/database.js
```

Se esquema de pastas deve estar assim:

```
.
├── app
│   ├── controllers
│   └── models
├── config
│   ├── auth.js
│   └── database.js
├── database
│   ├── migrations
│   ├── seeds
│   └── index.js
├── app.js
├── routes.js
└── server.js
```

## DATABASE

Vamos utiliazar o ORM `Sequelize`, com o comando abaixo instale essa dependência.

```bash
yarn add sequelize && yarn add sequelize-cli -D
```

Agora, crie uma arquivo chamado `.sequelizerc`(Use a Syntax de `JS`).

```bash
touch .sequelizerc
```

Dentro deste arquivo cole este conteúdo.

```js
const { resolve } = require('path');

module.exports = {
  config: resolve(__dirname, 'src', 'config', 'database.js'),
  'models-path': resolve(__dirname, 'src', 'app', 'models'),
  'migrations-path': resolve(__dirname, 'src', 'database', 'migrations'),
  'seeders-path': resolve(__dirname, 'src', 'database', 'seeds')
};
```

## Migartions

Aqui vão algumas configurações para que o Sequelize entenda onde ele deve se situar, para criar as `migrations`, `connection`, `models` & `seeds`.

Agora precisamos instalar o `driver` do banco que decidimos utilizar, caso não esteja utilizando o `mysql`, consulte este [link](https://sequelize.org/v5/manual/dialects.html) e veja qual é a dependecia do driver que você escolheu.

```bash
yarn add mysql2
```

Agora vamos configurar o arquivo de `database.js`, passandoa algumas instruções para que o Sequelize possa se conectar com o nosso banco de dados.

Edite o arquivo `database.js`.

```js
module.exports = {
  dialect: 'mysql',
  host: 'localhost',
  username: 'root',
  password: 'root',
  database: 'fastfeet',
  port: 3307,
  define: {
    timestamps: true,
    camelCased: true
  }
};
```

Agora vamos gerar uma tabela generica, que básicamente existe em todos as aplicações.

```bash
yarn sequelize migration:create --name=users
```

Agora vamos editar a migration que foi gerada.

```js
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      passwordHash: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.STRING,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.STRING,
        allowNull: false
      }
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('users');
  }
};
```

Para rodar uma migration, basta executar:

```bash
yarn sequelize db:migrate
```

O próximo passo é criar um `Model`, na pasta Models vamos criar o `Model` para essa tabela de usuários.

```js
import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class Users extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        passwordHash: Sequelize.STRING,
        password: Sequelize.VIRTUAL
      },
      {
        sequelize
      }
    );
    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.passwordHash = await bcrypt.hash(user.password, 8);
      }
    });
    return this;
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.passwordHash);
  }
}

export default Users;
```

Depois de criar o Model, é importante criarmos o Controller deste Model, é sempre interessante seguir um padrão, visto que cada controller tem 5 faces, `ìndex`, `show`, `store` & `delete`

## Envio de Arquivos

Iremos utilizar a biblioteca `multer` pra envio de arquivos para o servidor.

```bash
yarn add multer
```

Na raiz do Projeto cie uma pasta chamada `tmp`, e dentro dessa pasta crie uma pasta com o nome `uploads`.

```bash
mkdir tmp tmp/uploads
```

Na pasta `config`, vamos criar o arquivo de configuração do Multer, vou chamar ele de `multerConfig.js`.

```bash
touch src/config/multerConfig.js
```

Agora, vamos editar esse arquivo de configuração do Multer.

```js
import multer from 'multer';
import crypto from 'crypto';

import { extname, resolve } from 'path';

export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, res) => {
        if (err) return cb(err);

        return cb(null, res.toString('hex') + extname(file.originalname));
      });
    }
  })
};
```

Para utilizar essa configuração, importe o muler, e o arquivo que acabamos de criar, e passe ele como um middleware da rota na qual você deseja enviar arquivos.

```js
import multer from 'multer';
import multerConfig from './config/multerConfig';

const upload = multer(multerConfig).single('file');

routes.post('/files', upload, MeuControllerDeFiles);
```

## Comandos Úteis

### Migrations

Rodar Migrations

```bash
yarn sequelize db:migrate
```

Criar uma Migration

```bash
yarn sequelize migration:create --name=my-migration
```

Desfazer útilma migration

```bash
yarn sequelize db:migrate:undo
```

Desfazer todas as migrations

```bash
yarn sequelize db:migrate:undo:all
```

Desfazer uma migration específica

```bash
yarn sequelize db:migrate:undo:all --to XXXXXXXXXXXXXX-create-users.js
```

### Seeds

Rodar seeds

```bash
yarn sequelize db:seed:all
```

Criar uma seed

```bash
yarn sequelize seed:generate --name users
```

Desfazer última seed

```bash
yarn sequelize seed:generate --name users
```

Desfazer uma seed especificayarn sequelize db:seed:undo:all

```bash
yarn sequelize db:seed:undo:all
```

## Banco Chave&Valor **Redis**

Utilizando o docker crie um container

```bash
docker run --name redisfastfeet -p 6379:6379 -d -t redis:alpine
```
