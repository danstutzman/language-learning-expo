import type { Leaf } from './Leaf'
import { LEAF_TYPE_TO_FIELDS } from './LeafType'

function expectString(value: any, field: string, expected: any, leaf: Leaf) {
  if (expected) {
    if (typeof value !== 'string') {
      throw new Error(
        `Unexpected non-string ${field} on ${JSON.stringify(leaf)}`)
    }
  } else {
    if (value !== undefined) {
      throw new Error(
        `Unexpected non-undefined ${field} on ${JSON.stringify(leaf)}`)
    }
  }
}

export default function validateLeafFields(leaf: Leaf): Leaf {
  const fieldExpectedOnType = LEAF_TYPE_TO_FIELDS[leaf.type]
  if (fieldExpectedOnType === undefined) {
    throw new Error(`Unexpected type ${leaf.type} on ${JSON.stringify(leaf)}`)
  }
  expectString(leaf.es, 'es', true, leaf)
  expectString(leaf.en, 'en', true, leaf)
  expectString(leaf.mnemonic, 'mnemonic', true, leaf)

  expectString(leaf.gender, 'gender', fieldExpectedOnType.gender, leaf)

  return leaf
}