# node-alias
node module alias

# install
```shell
npm i @dangao/node-alias --save
```
or
```shell
yarn add @dangao/node-alias
```

# Fix
- To solve the problem that nodejs cannot use path mapping

>before
```typescript
// in {workspace}/src/service/xx/xxx.ts
import file from "../../../utils/xx";
```
>after
```typescript
// in {workspace}/src/env.ts
// Configuration alias
import alias from "@dangao/node-alias";
alias.add("~", __dirname);
```
```typescript
// in {workspace}/src/main.ts
// Import it in your entry file
import "./env";
```
```typescript
// in {workspace}/src/service/xxx.ts
// Use it anywhere in the project
import file from "~/utils/xx";
```
- Resolve module dependency alias conflicts
