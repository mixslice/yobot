module.exports = function config() {
  switch (process.env.NODE_ENV) {
    case 'production':
      return {
        slackToken: process.env.SLACK_TOKEN,
        domainList: {
          'example.com': {
            loginToken: 'your dnspod token here',
            domainId: 'your dnspod domain id',
            ip: 'domain ip'
          }
        }
      };

    default:
      return {
        slackToken: process.env.SLACK_TOKEN,
        domainList: {
          'example.com': {
            loginToken: 'your dnspod token here',
            domainId: 'your dnspod domain id',
            ip: 'domain ip'
          }
        }
      };
  }
};
