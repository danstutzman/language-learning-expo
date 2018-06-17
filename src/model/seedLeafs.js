/* eslint-disable */
import type { Leaf } from './Leaf'

export default (

// Paste the JSON from the export email directly below this line:
[{"type":"N","en":"skin","es":"piel","gender":"F","mnemonic":"skin is burnt and peeled"},
{"type":"N","en":"arm","es":"brazo","gender":"M","mnemonic":"arm armor made of bronze"},
{"type":"N","en":"leg","es":"pierna","gender":"F","mnemonic":"leggo my leg or I'll pee urine"},
{"type":"N","en":"heart","es":"corazón","gender":"M"},
{"type":"N","en":"stomach","es":"estómago","gender":"M"},
{"type":"N","en":"eye","es":"ojo","gender":"M"},
{"type":"N","en":"nose","es":"nariz","gender":"F"},
{"type":"N","en":"mouth","es":"boca","gender":"F"},
{"type":"N","en":"ear","es":"oreja","gender":"F","mnemonic":"ear rings of oreos"},
{"type":"N","en":"face","es":"cara","gender":"F","mnemonic":"face got cut off"},
{"type":"N","en":"neck","es":"cuello","gender":"M","mnemonic":"neck vein was cut way open"},
{"type":"N","en":"finger","es":"dedo","gender":"M","mnemonic":"finger technique by Dedone"},
{"type":"N","en":"foot","es":"pie","gender":"M","mnemonic":"foot stays in the state of PA"},
{"type":"N","en":"thigh","es":"muslo","gender":"M","mnemonic":"thigh-high boots from wild moose"},
{"type":"N","en":"ankle","es":"tobillo","gender":"M","mnemonic":"ankle stung to be young"},
{"type":"N","en":"elbow","es":"codo","gender":"M","mnemonic":"elbow grease coats my coat"},
{"type":"N","en":"wrist","es":"muñeca","gender":"F","mnemonic":"wrist watch says 'Moon not yet come!'"},
{"type":"N","en":"body","es":"cuerpo","gender":"M","mnemonic":"body bag for corpse"},
{"type":"N","en":"tooth","es":"diente","gender":"M"},
{"type":"N","en":"hand","es":"mano","gender":"F","mnemonic":"hand me the manual"},
{"type":"N","en":"back","es":"espalda","gender":"F","mnemonic":"back hair is bald"},
{"type":"N","en":"hip","es":"cadera","gender":"F","mnemonic":"hipster can't dare"},
{"type":"N","en":"jaw","es":"mandíbula","gender":"F","mnemonic":"jaws of gold: “man I got dibs on that”"},
{"type":"N","en":"shoulder","es":"hombro","gender":"M","mnemonic":"shoulder on, bro"},
{"type":"N","en":"thumb","es":"pulgar","gender":"M","mnemonic":"thumb war: push and pull hard"},
{"type":"N","en":"tongue","es":"lengua","gender":"F","mnemonic":"tongue strength from long length "},
{"type":"N","en":"throat","es":"garganta","gender":"F","mnemonic":"throat can't gargle gargantuan"},
{"type":"Det","en":"the","es":"el","gender":"M"},
{"type":"Det","en":"the","es":"la","gender":"F"},
{"type":"Det","en":"a","es":"un","gender":"M"},
{"type":"Det","en":"a","es":"una","gender":"F"},
{"type":"Det","en":"my","es":"mi","gender":""},
{"type":"Det","en":"this","es":"este","gender":"M"},
{"type":"Det","en":"this","es":"esta","gender":"F"},
{"type":"Det","en":"every","es":"cada","gender":""}]

.map(seed => ({
  ...seed,
  mnemonic: seed.mnemonic || '',
  leafId: 0,
  suspended: false,
})): Array<Leaf>)
