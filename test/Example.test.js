import fs from 'fs'
import { assert } from 'chai'
import { launch } from 'chrome-launcher'
import CDP from 'chrome-remote-interface'
import { dir } from '../gulp/dir.es6'
// import UpdateCopyright from '../src/modules/DetectViewport.js';

const URL = 'about:blank';
const HTML = 'test/Example.test.html';
// const JS = './src/modules/UpdateCopyright.js';

const fetch = (filename) => {
  const filepath = dir.root + '/' + filename;
  return fs.readFileSync(filepath, 'utf-8');
}

const launchChrome = async () => {
  try {
    return await launch({
      startingUrl: 'about:blank',
      chromeFlags: ['--headless', '--disable-gpu', '--no-sandbox']
    });
  } catch(error) {
    console.error(error);
  }
}

describe('Example', () => {
  it('titleを評価できるか', (done) => {

    launchChrome().then(async (chrome) => {
      const client = await CDP({ port: chrome.port });
      const { Page, Runtime, Console } = client;
      await Promise.all([
        Page.enable(),
        Runtime.enable(),
        Console.enable()
      ]);

      Console.messageAdded((msg) => console.log(msg));

      // await Page.addScriptToEvaluateOnLoad({
      //   scriptSource: fetch(JS)
      // });

      const frame = await Page.navigate({ url: URL });
      Page.loadEventFired();

      await Page.setDocumentContent({
        frameId: frame.frameId,
        html: fetch(HTML)
      });

      const exp = `(() => {
        const el = document.querySelector('title');
        // console.log(el);
        return el.innerHTML;
      })()`;
      const res = await Runtime.evaluate({ expression: exp });
      // console.log(res);

      try {
        assert.equal(res.result.value, 'example');
      } catch(error) {
        return done(error);
      } finally {
        client.close();
        chrome.kill();
      }

      done();
    });
  });
});
