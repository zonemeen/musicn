import { expect, describe, it } from 'vitest'
import * as utils from '../src/utils/index.ts'

describe('utils', () => {
  it('should remove special characters from the string', () => {
    expect(utils.removePunctuation('**you are not alone./')).toEqual('you are not alone')
  })

  it('should combine the name property in the array object into a name string', () => {
    expect(
      utils.joinSingersName([{ name: '周杰伦' }, { name: '蔡依林' }, { name: '侯佩岑' }])
    ).toEqual('周杰伦,蔡依林,侯佩岑')
  })

  it('should get the size of the song from the url', async () => {
    const size = await utils.getSongSizeByUrl(
      'https://freetyst.nf.migu.cn/public/product9th/product43/2021/04/1416/2021年04月13日17点19分内容准入海蝶时代数码1首/标清高清/MP3_128_16_Stero/6008460PLB0165742.mp3'
    )
    expect(size).toEqual(3416192)
  })
})
