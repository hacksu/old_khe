import type { FieldPath, FieldPathValue } from 'react-hook-form';
import { get, merge } from 'lodash';
import getConfig from 'next/config';



export type ServerRuntimeConfig = ServerRuntime.Config;
namespace ServerRuntime {
    export type Config = {
        
        
    }
}

export type PublicRuntimeConfig = PublicRuntime.Config;
namespace PublicRuntime {
    export type Config = {
        mode: 'development' | 'production' | 'test';
    }
}



/** Retrieves an entry from PublicRuntimeConfig
 * @param path A list of keys to scope into a config entry.
 * 
 * Example: `{ path: { to: { entry: 'value' }}}`
 * - `Config('path', 'to', 'entry'): 'value'`
 */
function Config<
    P extends FieldPath<PublicRuntimeConfig>
>(path: P): FieldPathValue<PublicRuntimeConfig, P> {
    return get(getConfig().publicRuntimeConfig, path);
}

/** Retrieves an entry from ServerRuntimeConfig or PublicRuntimeConfig
 * @param path A list of keys to scope into a config entry.
 * 
 * Example: `{ path: { to: { entry: 'value' }}}`
 * - `Config.Server('path', 'to', 'entry'): 'value'`
 */
Config.Server = function <
    P extends FieldPath<ServerRuntimeConfig & PublicRuntimeConfig>
>(path: P): FieldPathValue<ServerRuntimeConfig & PublicRuntimeConfig, P> {
    const merged = merge({}, getConfig().serverRuntimeConfig, getConfig().publicRuntimeConfig)
    return get(merged, path);
}

export { Config };

