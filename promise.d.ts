/*
This file is included as a HACK for export maps not working in TypeScript
https://github.com/microsoft/TypeScript/issues/33079
*/
import { Options } from './dist/utils';
declare function live(command: string | string[], options?: Options): Promise<void>;
export = live;
