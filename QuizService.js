import React, {Component} from 'react';
import SQLite from 'react-native-sqlite-storage';
import NetInfo from '@react-native-community/netinfo';

let db;
class QuizService extends Component {
  baseURL = 'http://tgryl.pl/quiz';

  constructor() {
    super();
    let db = SQLite.openDatabase({
      name: 'tests',
      createFromLocation: '~tests.db',
      location: 'Library',
    });
  }

  executeQuery = (sqlQuery, params = []) =>
    new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          sqlQuery,
          params,
          (tx, results) => {
            console.log(results.rows.item(0));
            resolve(results);
          },
          (error) => {
            console.log(error);
            reject(error);
          },
        );
      });
    });

  // getTestsWithInternetCheck = async () => {
  //   let tests = [];
  //   if (
  //     await NetInfo.fetch().then((state) => {
  //       return state.isConnected;
  //     })
  //   ) {
  //     tests = await this.getTests();
  //   } else {
  //     const testQuery = await this.executeQuery('SELECT * FROM tests', []);
  //     for (let i = 0; i < testQuery.rows.length; i++) {
  //       tests.push(await testQuery.rows.item(i));
  //     }
  //   }
  //   return shuffle(tests);
  // };

  // getDetailsTestsWithInternetCheck = async (id) => {
  //   let detailsTests = null;
  //   if (
  //     await NetInfo.fetch().then((state) => {
  //       return state.isConnected;
  //     })
  //   ) {
  //     detailsTests = await this.getDetailsTests(id);
  //   } else {
  //     const testQuery = await this.executeQuery(
  //       'SELECT * FROM testsDetails WHERE id=?',
  //       [id],
  //     );
  //     detailsTests = await testQuery.rows.item(0);
  //   }
  //   return detailsTests;
  // };

  getResult = async () => {
    return await fetch(this.baseURL + '/results?last=10')
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        return json;
      })
      .catch((error) => {
        console.log('Api call error' + error);
      });
  };

  postResult = async (nick, score, total, type) => {
    return await fetch(this.baseURL + '/result', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nick,
        score,
        total,
        type,
      }),
    }).catch((error) => {
      console.log('POST error: ' + error);
    });
  };

  getTests = async () => {
    return await fetch(this.baseURL + '/tests')
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        return json;
      })
      .catch((error) => {
        console.log('Api call error' + error);
      });
  };

  getDetailsTests = async (id) => {
    return await fetch(this.baseURL + '/test/' + id)
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        return json;
      })
      .catch((error) => {
        console.log('Api call error' + error);
      });
  };
}
export default QuizService;
