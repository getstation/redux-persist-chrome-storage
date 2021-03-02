/**
 * Copyright (c) 2018 Robin Malburn
 *
 * Released under the MIT license.
 * See the file LICENSE for copying permission.
 */

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import chrome from 'sinon-chrome';
import { ChromeStorage } from '../src/index';

chai.use(chaiAsPromised);

describe('ChromeStorage', function () {
  let storage: ChromeStorage;

  beforeEach(function () {
    storage = new ChromeStorage(chrome.storage.sync, chrome.runtime as any);
  });

  afterEach(function () {
    // @ts-ignore
    chrome.runtime.lastError = undefined;
    chrome.reset();
  });

  it(`should set an item in the sync storage instance.`, function () {
    chrome.storage.sync.set.yields(undefined);

    const stored = storage.setItem('foo', 'bar');

    chai.assert.ok(
      chrome.storage.sync.set.withArgs({ foo: 'bar' }).calledOnce,
      `Assert that chrome.storage.DRIVER.set should be called once with the key and payload.`,
    );

    chai.expect(stored).to.be.a('promise');

    return chai.expect(stored).to.eventually.be.undefined;
  });

  it(`should handle failing to set an item in the DRIVER storage instance.`, function () {
    chrome.runtime.lastError = {
      message: 'Failed'
    }
    chrome.storage.sync.set.yields(undefined);

    const stored = storage.setItem('foo', 'bar');

    chai.assert.ok(
      chrome.storage.sync.set.withArgs({ foo: 'bar' }).calledOnce,
      `Assert that chrome.storage.DRIVER.set should be called once with the key and payload.`,
    );

    chai.expect(stored).to.be.a('promise');

    return chai.expect(stored).to.eventually.be.rejectedWith('Failed');
  });

  it(`should get an item from the DRIVER storage instance.`, function () {
    chrome.storage.sync.get.yields({ foo: 'bar' });

    const retrieved = storage.getItem('foo');

    chai.assert.ok(
      chrome.storage.sync.get.withArgs('foo').calledOnce,
      `Assert that chrome.storage.DRIVER.get should be called once with the key.`,
    );

    chai.expect(retrieved).to.be.a('promise');

    return chai.expect(retrieved).to.eventually.be.equal('bar');
  });

  it(`should handle failing to get an item from the DRIVER storage instance.`, function () {
    chrome.runtime.lastError = {
      message: 'Failed'
    }
    chrome.storage.sync.get.yields(undefined);

    const retrieved = storage.getItem('foo');

    chai.assert.ok(
      chrome.storage.sync.get.withArgs('foo').calledOnce,
      `Assert that chrome.storage.DRIVER.get should be called once with the key.`,
    );

    chai.expect(retrieved).to.be.a('promise');

    return chai.expect(retrieved).to.eventually.be.rejectedWith('Failed');
  });

  it(`should remove an item from the DRIVER storage instance.`, function () {
    chrome.storage.sync.remove.yields(undefined);

    const cleared = storage.removeItem('foo');

    chai.assert.ok(
      chrome.storage.sync.remove.withArgs('foo'),
      `Assert that chrome.storage.DRIVER.remove should be called once with the key.`,
    );

    chai.expect(cleared).to.be.a('promise');

    return chai.expect(cleared).to.eventually.be.undefined;
  });

  it(`should handle failing to remove an item from the DRIVER storage instance.`, function () {
    chrome.runtime.lastError = {
      message: 'Failed'
    }
    chrome.storage.sync.remove.yields(undefined);

    const cleared = storage.removeItem('foo');

    chai.assert.ok(
      chrome.storage.sync.remove.withArgs('foo'),
      `Assert that chrome.storage.DRIVER.remove should be called once with the key.`,
    );

    chai.expect(cleared).to.be.a('promise');

    return chai.expect(cleared).to.eventually.be.rejectedWith('Failed');
  });
});
