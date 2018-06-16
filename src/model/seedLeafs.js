/* eslint-disable */
import type { Leaf } from './Leaf'

export default (

// Paste the JSON from the export email directly below this line:
[{"type":"EsN","en":"skin","es":"piel","gender":"F","mnemonic":"skin is burnt and peeled"},
{"type":"EsN","en":"arm","es":"brazo","gender":"M","mnemonic":"arm armor made of bronze"},
{"type":"EsN","en":"leg","es":"pierna","gender":"F","mnemonic":"leggo my leg or I'll pee urine"},
{"type":"EsN","en":"heart","es":"corazón","gender":"M"},
{"type":"EsN","en":"stomach","es":"estómago","gender":"M"},
{"type":"EsN","en":"eye","es":"ojo","gender":"M"},
{"type":"EsN","en":"nose","es":"nariz","gender":"F"},
{"type":"EsN","en":"mouth","es":"boca","gender":"F"},
{"type":"EsN","en":"ear","es":"oreja","gender":"F","mnemonic":"ear rings of oreos"},
{"type":"EsN","en":"face","es":"cara","gender":"F","mnemonic":"face got cut off"},
{"type":"EsN","en":"neck","es":"cuello","gender":"M","mnemonic":"neck vein was cut way open"},
{"type":"EsN","en":"finger","es":"dedo","gender":"M","mnemonic":"finger technique by Dedone"},
{"type":"EsN","en":"foot","es":"pie","gender":"M","mnemonic":"foot stays in the state of PA"},
{"type":"EsN","en":"thigh","es":"muslo","gender":"M","mnemonic":"thigh-high boots from wild moose"},
{"type":"EsN","en":"ankle","es":"tobillo","gender":"M","mnemonic":"ankle stung to be young"},
{"type":"EsN","en":"elbow","es":"codo","gender":"M","mnemonic":"elbow grease coats my coat"},
{"type":"EsN","en":"wrist","es":"muñeca","gender":"F","mnemonic":"wrist watch says 'Moon not yet come!'"},
{"type":"EsN","en":"body","es":"cuerpo","gender":"M","mnemonic":"body bag for corpse"},
{"type":"EsN","en":"tooth","es":"diente","gender":"M"},
{"type":"EsN","en":"hand","es":"mano","gender":"F","mnemonic":"hand me the manual"},
{"type":"EsN","en":"back","es":"espalda","gender":"F","mnemonic":"back hair is bald"},
{"type":"EsN","en":"hip","es":"cadera","gender":"F","mnemonic":"hipster can't dare"},
{"type":"EsN","en":"jaw","es":"mandíbula","gender":"F","mnemonic":"jaws of gold: “man I got dibs on that”"},
{"type":"EsN","en":"shoulder","es":"hombro","gender":"M","mnemonic":"shoulder on, bro"},
{"type":"EsN","en":"thumb","es":"pulgar","gender":"M","mnemonic":"thumb war: push and pull hard"},
{"type":"EsN","en":"tongue","es":"lengua","gender":"F","mnemonic":"tongue strength from long length "},
{"type":"EsN","en":"throat","es":"garganta","gender":"F","mnemonic":"throat can't gargle gargantuan"},
{"type":"EsD","en":"the","es":"el","gender":"M"},
{"type":"EsD","en":"the","es":"la","gender":"F"},
{"type":"EsD","en":"a","es":"un","gender":"M"},
{"type":"EsD","en":"a","es":"una","gender":"F"},
{"type":"EsD","en":"my","es":"mi","gender":""},
{"type":"EsD","en":"this","es":"este","gender":"M"},
{"type":"EsD","en":"this","es":"esta","gender":"F"},
{"type":"EsD","en":"every","es":"cada","gender":""}]

.map(seed => ({
  ...seed,
  mnemonic: seed.mnemonic || '',
  leafId: 0,
  suspended: false,
})): Array<Leaf>)
