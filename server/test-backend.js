const http = require('http');

const BASE_URL = 'http://localhost:4000';

async function makeRequest(path, method = 'GET', body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: data ? JSON.parse(data) : null,
        });
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('Testing MemoFlip Backend\n');

  try {
    // Test 1: Health check
    console.log('1️⃣  Testing /health endpoint...');
    const health = await makeRequest('/health');
    console.log(`   Status: ${health.status}`);
    console.log(`   Response: ${JSON.stringify(health.body)}\n`);

    // Test 2: Register mutation
    console.log('2️⃣  Testing register mutation...');
    const registerRes = await makeRequest('/graphql', 'POST', {
      query: `mutation {
        register(input: {
          email: "testuser@example.com"
          password: "Test@Password123"
          displayName: "TestPlayer"
        }) {
          token
          user {
            id
            email
            displayName
          }
        }
      }`,
    });
    console.log(`   Status: ${registerRes.status}`);
    if (registerRes.body.errors) {
      console.log(`   Errors: ${JSON.stringify(registerRes.body.errors, null, 2)}`);
    }
    if (registerRes.body.data) {
      console.log(`   Response: ${JSON.stringify(registerRes.body.data, null, 2)}`);
    }

    let token = null;
    if (registerRes.body.data?.register?.token) {
      token = registerRes.body.data.register.token;
      console.log(`   ✅ Token captured: ${token.substring(0, 20)}...\n`);
    } else {
      console.log(`   ❌ No token in response\n`);
    }

    // Test 3: Login mutation
    console.log('3️⃣  Testing login mutation...');
    const loginRes = await makeRequest('/graphql', 'POST', {
      query: `mutation {
        login(input: {
          email: "testuser@example.com"
          password: "Test@Password123"
        }) {
          token
          user {
            id
            email
            displayName
          }
        }
      }`,
    });
    console.log(`   Status: ${loginRes.status}`);
    if (loginRes.body.errors) {
      console.log(`   Errors: ${JSON.stringify(loginRes.body.errors, null, 2)}`);
    }
    if (loginRes.body.data) {
      console.log(`   Response: ${JSON.stringify(loginRes.body.data, null, 2)}`);
    }
    if (loginRes.body.data?.login?.token) {
      token = loginRes.body.data.login.token;
      console.log(`   ✅ Login token captured: ${token.substring(0, 20)}...\n`);
    }

    // Test 4: Me query (authenticated)
    if (token) {
      console.log('4️⃣  Testing me query (authenticated)...');
      const meRes = await makeRequest(
        '/graphql',
        'POST',
        {
          query: `query {
            me {
              id
              email
              displayName
            }
          }`,
        },
        { Authorization: `Bearer ${token}` }
      );
      console.log(`   Status: ${meRes.status}`);
      if (meRes.body.errors) {
        console.log(`   Errors: ${JSON.stringify(meRes.body.errors, null, 2)}`);
      }
      if (meRes.body.data) {
        console.log(`   Response: ${JSON.stringify(meRes.body.data, null, 2)}`);
      }
      console.log();
    }

    // Test 5: Leaderboard query
    console.log('5️⃣  Testing leaderboard query...');
    const leaderboardRes = await makeRequest('/graphql', 'POST', {
      query: `query {
        leaderboard(difficulty: EASY, limit: 5) {
          rank
          player {
            email
            displayName
          }
          stats {
            matchesCount
            averageMoves
            averageTime
            bestTime
          }
        }
      }`,
    });
    console.log(`   Status: ${leaderboardRes.status}`);
    if (leaderboardRes.body.errors) {
      console.log(`   Errors: ${JSON.stringify(leaderboardRes.body.errors, null, 2)}`);
    }
    if (leaderboardRes.body.data) {
      console.log(`   Response: ${JSON.stringify(leaderboardRes.body.data, null, 2)}`);
    }
    console.log();

    // Test 6: Submit match mutation (if token exists)
    if (token) {
      console.log('6️⃣  Testing submitMatch mutation...');
      const submitRes = await makeRequest(
        '/graphql',
        'POST',
        {
          query: `mutation {
            submitMatch(input: {
              difficulty: EASY
              gridSize: 16
              moves: 12
              timeSeconds: 45
            }) {
              id
              difficulty
              gridSize
              moves
              timeSeconds
              completedAt
            }
          }`,
        },
        { Authorization: `Bearer ${token}` }
      );
      console.log(`   Status: ${submitRes.status}`);
      if (submitRes.body.errors) {
        console.log(`   Errors: ${JSON.stringify(submitRes.body.errors, null, 2)}`);
      }
      if (submitRes.body.data) {
        console.log(`   Response: ${JSON.stringify(submitRes.body.data, null, 2)}`);
      }
      console.log();
    }

    console.log('✅ All tests completed!\n');
  } catch (error) {
    console.error('❌ Test error:', error.message);
    process.exit(1);
  }
}

runTests();
