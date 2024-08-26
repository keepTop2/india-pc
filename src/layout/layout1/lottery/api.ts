export function mockDoGetReward() {
  // 返回一个 Promise 对象
  return new Promise((resolve, reject) => {
    // 模拟延迟
    setTimeout(() => {
      // 模拟固定的数据
      const res = {
        "code": 0,
        "msg": "Success",
        "data": {
          id: '1782447017050890240',
          coin: '8888.00',
          currency: 'CZK',
          sort: 16,
          freeNum: null,
        },
      };
      // 解决 Promise 并传递数据
      resolve(res);
    }, 2000); // 模拟 2 秒延迟
  });
}


export function mockGetSpinList() {
  // 返回一个 Promise 对象
  return new Promise((resolve, reject) => {
    // 模拟延迟
    setTimeout(() => {
      // 模拟固定的数据
      const res = {
        "code": 0,
        "msg": "Success",
        "data": [
          {
            id: '1782447017013141504',
            coin: '1000.00',
            currency: 'VND',
            sort: 1,
            freeNum: null,
          },
          {
            id: '1782447017021530112',
            coin: '2.00',
            currency: 'ETH',
            sort: 2,
            freeNum: null,
          },
          {
            id: '1782447017021530113',
            coin: '10.00',
            currency: 'GPL',
            sort: 3,
            freeNum: null,
          },
          {
            id: '1782447017021530114',
            coin: '1.00',
            currency: 'LTC',
            sort: 4,
            freeNum: null,
          },
          {
            id: '1782447017021530115',
            coin: '1.00',
            currency: 'APE',
            sort: 5,
            freeNum: null,
          },
          {
            id: '1782447017038307328',
            coin: '5.00',
            currency: 'DAI',
            sort: 6,
            freeNum: null,
          },
          {
            id: '1782447017042501632',
            coin: '100.00',
            currency: 'DOGE',
            sort: 7,
            freeNum: null,
          },
          {
            id: '1782447017042501633',
            coin: '80.00',
            currency: 'TRX',
            sort: 8,
            freeNum: null,
          },
          {
            id: '1782447017046695936',
            coin: '10.00',
            currency: 'USDT',
            sort: 9,
            freeNum: null,
          },
          {
            id: '1782447017046695937',
            coin: '0.10',
            currency: 'MATIC',
            sort: 10,
            freeNum: null,
          },
          {
            id: '1782447017046695938',
            coin: '2.00',
            currency: 'USDT',
            sort: 11,
            freeNum: null,
          },
          {
            id: '1782447017046695939',
            coin: '6.00',
            currency: 'GPL',
            sort: 12,
            freeNum: null,
          },
          {
            id: '1782447017046695940',
            coin: '10.00',
            currency: 'USDT',
            sort: 13,
            freeNum: null,
          },
          {
            id: '1782447017046695941',
            coin: '8.00',
            currency: 'USDC',
            sort: 14,
            freeNum: null,
          },
          {
            id: '1782447017046695942',
            coin: '6.00',
            currency: 'USD',
            sort: 15,
            freeNum: null,
          },
          {
            id: '1782447017050890240',
            coin: '8888.00',
            currency: 'CZK',
            sort: 16,
            freeNum: null,
          },
        ],
      };
      resolve(res);
    }, 2000); // 模拟 2 秒延迟
  });
}
