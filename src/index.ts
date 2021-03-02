/**
 * Copyright (c) 2018 Robin Malburn
 *
 * Released under the MIT license.
 * See the file LICENSE for copying permission.
 */

/**
 * Copyright (c) 2018 Robin Malburn
 *
 * Released under the MIT license.
 * See the file LICENSE for copying permission.
 */

export type Runtime = typeof browser.runtime | typeof chrome.runtime;
export type Driver =
  typeof browser.storage.local | typeof browser.storage.sync | typeof browser.storage.managed |
  typeof chrome.storage.local | typeof chrome.storage.sync | typeof chrome.storage.managed;

type FnCallback<T, R> = (param: T, callback: (result: R) => void) => void;
type FnPromise<T, R> = (param: T) => Promise<R>;

export class ChromeStorage {
  private driver: Driver;
  private runtime: Runtime;

  /**
   * Construct a new class instance.
   *
   * @param driver - Browser/Chrome Storage Area driver.
   * @param runtime - Browser/Chrome runtime.
   *
   * @return void
   */
  constructor(driver: Driver, runtime: Runtime) {
    this.driver = driver;
    this.runtime = runtime;
  }

  wrapPromise<T, R>(fn: FnCallback<T, R> | FnPromise<T, R>): (param: T) => Promise<R> {
    if (fn.length === 1) {
      return fn as FnPromise<T, R>;
    }

    return param => new Promise((resolve, reject) => {
      try {
        fn(param, result => {
          if (this.runtime.lastError) {
            reject(this.runtime.lastError);
          } else {
            resolve(result);
          }
        });
      } catch (e) {
        // fix for webextension-polyfill
        if (e.message.startsWith('Expected at most')) {
          (fn as FnPromise<T, R>)(param).then(resolve).catch(reject);
        } else {
          throw e;
        }
      }
    });
  }

  /**
   * Set an item in storage.
   *
   * @param key
   * @param item
   *
   * @return
   */
  setItem(key: string, item: unknown): Promise<void> {
    return this.wrapPromise(this.driver.set)({ [key]: item });
  }

  /**
   * Get an item from storage.
   *
   * @param key
   *
   * @return
   */
  getItem(key: string): unknown {
    return this.wrapPromise(this.driver.get as typeof chrome.storage.local.get)(key).then(res => res[key]);
  }

  /**
   * Remove an item from storage.
   *
   * @param key
   *
   * @return
   */
  removeItem(key: string): Promise<void> {
    return this.wrapPromise(this.driver.remove)(key);
  }
}


/**
 * Create a ChromeStorage instance from the given chrome instance
 * and requested driver.
 *
 * @param browserOrChrome
 * @param driver
 *
 */
export default function createChromeStorage(browserOrChrome: typeof browser | typeof chrome, driver: 'local' | 'sync' | 'managed'): ChromeStorage {
  return new ChromeStorage(browserOrChrome.storage[driver], browserOrChrome.runtime);
}
