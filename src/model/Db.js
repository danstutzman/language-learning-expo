export type Tx = {
  executeSql: (
    string,
    Array<any>,
    (tx: Tx, { rows: { _array: Array<any> } }) => any
  ) => void,
}

export type Db = {
  transaction: ((tx: Tx) => void, Error => void) => void,
}