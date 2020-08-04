import { Module } from "module";
import { stackParsing } from "@dangao/node-stack";

const originResolveFilename = (Module as any)._resolveFilename;
const NodeAliasInstanceSymbol = Symbol("NodeAlias");

export interface NodeAliasMap {
  [key: string]: string;
}

class NodeAlias {
  private aliasNames: RegExp[] = [];

  private paths: string[] = [];

  constructor(_map: NodeAliasMap) {
    Object.entries(_map).forEach(([name, path]) => {
      this.add(name, path);
    });

    this.hack();
  }

  private hack = () => {
    const { aliasNames, paths } = this;
    (Module as any)._resolveFilename = function () {
      const filename = arguments[0] as string;
      const dir = stackParsing()[1].dir;

      for(let i = 0; i<paths.length;i++) {
        const p = paths[i];
        if(new RegExp(`^${dir}`).test(p) && aliasNames[i].test(filename)) {
          arguments[0] = filename.replace(aliasNames[i], p);
          break;
        }
        
      }

      return originResolveFilename.call(this, ...arguments);
    };
  };

  public add = (alias: string, path: string) => {
    const reg = new RegExp(`^${alias}`);
    if(this.paths.length > 0) {
      for(const p of this.paths) {
        if(path.length >= p.length) {
          this.paths.unshift(path);
          this.aliasNames.unshift(reg);
          return;
        }
      }
    }
  
    this.paths.push(path);
    this.aliasNames.push(reg);
    
  };
}

let instance = (Module as any)[NodeAliasInstanceSymbol] as NodeAlias;

if (!instance) {
  instance = (Module as any)[NodeAliasInstanceSymbol] = new NodeAlias({});
}

export const add = instance.add;
export default instance;
