import 'isomorphic-fetch';
import Promise from 'bluebird';
import FormData from 'form-data';
import Config from './config';
const config = new Config();

const getDomainInfo = (domain) => (
  Promise.try(() => config.domainList[domain])
);

export const addRecord = (domain, subdomain) => (
  getDomainInfo(domain)
  .then(({ loginToken, domainId, ip }) => {
    const data = new FormData();
    data.append('login_token', loginToken);
    data.append('domain_id', domainId);
    data.append('format', 'json');
    data.append('sub_domain', subdomain);
    data.append('record_type', 'A');
    data.append('record_line', '默认');
    data.append('value', ip);
    return fetch('https://dnsapi.cn/Record.Create', {
      method: 'POST',
      body: data
    })
    .then(response => response.text())
    .then(text => JSON.parse(text))
    .then((json) => {
      // success
      if (json.status.code === '1') {
        return json;
      }

      // failure
      const error = new Error(json.status.message);
      error.code = json.status.code;
      throw error;
    });
  })
);

export const removeRecord = (domain, recordId) => (
  getDomainInfo(domain)
  .then(({ loginToken, domainId }) => {
    const data = new FormData();
    data.append('login_token', loginToken);
    data.append('domain_id', domainId);
    data.append('format', 'json');
    data.append('record_id', recordId);
    return fetch('https://dnsapi.cn/Record.Remove', {
      method: 'POST',
      body: data
    })
    .then(response => response.text())
    .then(text => JSON.parse(text))
    .then((json) => {
      // success
      if (json.status.code === '1') {
        return json;
      }

      // failure
      const error = new Error(json.status.message);
      error.code = json.status.code;
      throw error;
    });
  })
);

export const listRecord = (domain) => (
  getDomainInfo(domain)
  .then(({ loginToken, domainId }) => {
    const data = new FormData();
    data.append('login_token', loginToken);
    data.append('domain_id', domainId);
    data.append('format', 'json');
    return fetch('https://dnsapi.cn/Record.List', {
      method: 'POST',
      body: data
    })
    .then(response => response.text())
    .then(text => JSON.parse(text))
    .then(json => {
      // success
      if (json.status.code === '1') {
        return json;
      }

      // failure
      const error = new Error(json.status.message);
      error.code = json.status.code;
      throw error;
    });
  })
);
