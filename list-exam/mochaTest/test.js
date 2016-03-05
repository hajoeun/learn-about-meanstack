describe('Top Level Tested Suite', function() {
 describe('Nested Test Suite', function() {
// 테스트에서 제외하고 싶을 때
  it.skip('Test 1', function() {
  });

  it('Test 2', function() {
   throw new Error('problem');
  });
 });

// 하나만 테스트 하길 원할 때
 it.only('Test 3', function() {
 });
});

it('Test 4', function() {
});
