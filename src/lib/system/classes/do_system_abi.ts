import type { SysAbi } from "$lib/system/types/sys_abi";

export class DO_SystemAbi implements SysAbi {
    c_name: string;
    data: any;

    constructor(partial?: Partial<SysAbi>) {
        this.c_name = partial?.c_name || "";
        this.data = partial?.data || {} as JSON;
    }
}
