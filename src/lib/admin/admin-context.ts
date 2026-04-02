import { setContext, getContext } from 'svelte';

export interface AdminContext {
  readonly client: any;
  readonly api: any;
  readonly userName: string;
  readonly userImage: string;
}

export function setAdminContext(ctx: AdminContext): void {
  setContext('admin', ctx);
}

export function getAdminContext(): AdminContext {
  return getContext<AdminContext>('admin');
}
