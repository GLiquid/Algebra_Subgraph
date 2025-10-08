# ReflexRouter Tests

This directory contains unit tests for the ReflexRouter event handlers using [matchstick-as](https://github.com/LimeChain/matchstick).

## Setup

Install dependencies:

```bash
yarn install
```

## Platform Support

⚠️ **Important**: Matchstick-as does not support Windows natively. To run tests on Windows, use one of these options:

1. **WSL (Windows Subsystem for Linux)** - Recommended

   ```bash
   # In WSL terminal
   cd /mnt/c/dev/gliquid/Algebra_Subgraph/Algebra
   yarn install
   yarn test
   ```

2. **Docker** - Run tests in a Linux container

3. **CI/CD** - Set up GitHub Actions to run tests on Linux

## Running Tests

Run all tests (Linux/Mac/WSL only):

```bash
yarn test
```

Run specific test file:

```bash
graph test tests/reflex-router.test.ts
```

## Test Coverage

### reflex-router.test.ts

Tests for the `handleSplitExecuted` event handler:

1. **Should create ReflexMevReward entity with correct data**:

   - Verifies that a `ReflexMevReward` entity is created with the correct values from the event
   - Uses the example event data:
     - configId: `0x0e6ab589f26633ac764b8c677e0ccfa63d9d9b05cac179b44390028736c39764`
     - token: `0x5555555555555555555555555555555555555555`
     - totalAmount: `617539633678810906`
     - recipients: `[0x4069c99e708b9395c7A519f97F7c09644f1B471C, 0xaF1918967644d315df2C2F324EE9C439a9e03098, 0xb4ffb33F6aC3FC7E75E26dc1802aA86a5D9857BD]`
     - amounts: `[185261890103643271, 247015853471524362, 123507926735762181]`
     - variedRecipient: `0x87e4393fB6d07E728Bc3831233359DF740907F9e`
     - variedAmount: `61753963367881092`
   - Checks USD values are correctly calculated
   - Verifies Transaction entity is created

2. **Should not create entity for non-matching configId**:

   - Verifies that events with a different configId are ignored

3. **Should handle missing token with default decimals**:
   - Verifies that the handler gracefully handles tokens that don't exist in the subgraph
   - Uses default decimals value of 18

## Test Utilities

### reflex-router-utils.ts

Contains helper functions for creating mock events:

- `createSplitExecutedEvent()`: Creates a mock `SplitExecuted` event with all required parameters

## Notes

- Tests use mock data and don't interact with an actual blockchain
- The `beforeEach` hook sets up required entities (Bundle, Token) before each test
- The `afterEach` hook clears the store to ensure test isolation
