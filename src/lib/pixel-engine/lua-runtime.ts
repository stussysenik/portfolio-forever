// Fengari Lua VM bridge for entity behavior scripting
// Each entity type gets a Lua script that defines update(dt, self, ctx)

import type { Entity, EngineContext } from "./engine";

let fengari: any = null;
let loaded = false;

export async function loadLuaRuntime(): Promise<boolean> {
	if (loaded) return true;
	try {
		fengari = await import("fengari-web");
		loaded = true;
		return true;
	} catch (e) {
		console.warn("Fengari failed to load:", e);
		return false;
	}
}

export function isLoaded(): boolean {
	return loaded;
}

// Compile a Lua script into an update function for entities
export function compileBehavior(
	scriptSource: string
): ((dt: number, entity: Entity, ctx: EngineContext) => void) | null {
	if (!fengari) return null;

	const { lua, lauxlib, lualib } = fengari;

	try {
		const L = lauxlib.luaL_newstate();
		lualib.luaL_openlibs(L);

		// Load the script
		const status = lauxlib.luaL_dostring(L, fengari.to_luastring(scriptSource));
		if (status !== 0) {
			const err = lua.lua_tojsstring(L, -1);
			console.warn("Lua compile error:", err);
			lua.lua_close(L);
			return null;
		}

		return (dt: number, entity: Entity, ctx: EngineContext) => {
			// Push the update function
			lua.lua_getglobal(L, fengari.to_luastring("update"));
			if (!lua.lua_isfunction(L, -1)) {
				lua.lua_pop(L, 1);
				return;
			}

			// Push dt
			lua.lua_pushnumber(L, dt);

			// Push self table
			lua.lua_newtable(L);
			const pushField = (key: string, val: number) => {
				lua.lua_pushstring(L, fengari.to_luastring(key));
				lua.lua_pushnumber(L, val);
				lua.lua_settable(L, -3);
			};
			pushField("x", entity.x);
			pushField("y", entity.y);
			pushField("vx", entity.vx);
			pushField("vy", entity.vy);
			pushField("width", entity.width);
			pushField("height", entity.height);

			// Push ctx table
			lua.lua_newtable(L);
			pushField("scrollY", ctx.scrollY);
			pushField("scrollVelocity", ctx.scrollVelocity);
			pushField("mouseX", ctx.mouseX);
			pushField("mouseY", ctx.mouseY);
			pushField("viewportW", ctx.viewportW);
			pushField("viewportH", ctx.viewportH);

			// Call update(dt, self, ctx) -> returns table with x, y, vx, vy
			const callStatus = lua.lua_pcall(L, 3, 1, 0);
			if (callStatus !== 0) {
				lua.lua_pop(L, 1);
				return;
			}

			// Read back results
			if (lua.lua_istable(L, -1)) {
				const readField = (key: string): number | null => {
					lua.lua_pushstring(L, fengari.to_luastring(key));
					lua.lua_gettable(L, -2);
					const val = lua.lua_isnumber(L, -1) ? lua.lua_tonumber(L, -1) : null;
					lua.lua_pop(L, 1);
					return val;
				};
				const nx = readField("x");
				const ny = readField("y");
				const nvx = readField("vx");
				const nvy = readField("vy");
				if (nx !== null) entity.x = nx;
				if (ny !== null) entity.y = ny;
				if (nvx !== null) entity.vx = nvx;
				if (nvy !== null) entity.vy = nvy;
			}
			lua.lua_pop(L, 1);
		};
	} catch (e) {
		console.warn("Lua runtime error:", e);
		return null;
	}
}
