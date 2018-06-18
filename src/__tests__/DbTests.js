import openDatabase from 'websql'

it('works', done => {
  const db = openDatabase(':memory:', '1.0', 'description', 1)
  db.transaction(
    tx => {
      tx.executeSql(
        'SELECT 1',
        [],
        (tx: any, result: { rows: { _array: Array<any> } }) => {
          expect(result.rows._array).toEqual([{ '1': 1 }])
          done()
        })
    },
    e => { done.fail(e); done() }
  )
})
