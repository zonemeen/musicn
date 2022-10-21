import rimraf from 'rimraf'
import { join } from 'path'
import { expect, describe, it, beforeEach, afterEach } from 'vitest'
import { pathExists } from 'path-exists'
import { globby } from 'globby'
import Checkbox from 'inquirer/lib/prompts/checkbox.js'
import ReadlineStub from './helpers/readline.js'
import fixtures from './helpers/fixtures.js'
import search from '../src/search'
import download from '../src/download'
import names from '../src/names'

describe('download', () => {
  let index = 0
  beforeEach(async () => {
    this.rl = new ReadlineStub()
    const { searchSongs, options } = await search(fixtures[index])
    this.checkbox = new Checkbox(
      {
        name: 'songs',
        message: '选择歌曲',
        choices: searchSongs.map((song, index) => names(song, index, options)),
      },
      this.rl,
      ''
    )
  })
  afterEach(async () => {
    const paths = await globby('./**/*.{flac,mp3,lrc}')
    for (const p of paths) {
      rimraf.sync(p)
    }
  })

  const downloadSingleSong = async () => {
    const promise = this.checkbox.run()
    this.rl.input.emit('keypress', ' ', { name: 'space' })
    this.rl.emit('line')
    const answer = await promise
    const { songName } = answer[0]
    expect(answer.length).toEqual(1)
    await download(answer)
    expect(pathExists(join(process.cwd(), songName))).toBeTruthy()
  }

  const downloadTwoSongs = async () => {
    const promise = this.checkbox.run()
    this.rl.input.emit('keypress', null, { name: 'down' })
    this.rl.input.emit('keypress', ' ', { name: 'space' })
    this.rl.input.emit('keypress', null, { name: 'down' })
    this.rl.input.emit('keypress', ' ', { name: 'space' })
    this.rl.emit('line')
    const answer = await promise
    const { songName: name1 } = answer[0]
    const { songName: name2 } = answer[1]
    expect(answer.length).toEqual(2)
    await download(answer)
    expect(pathExists(join(process.cwd(), name1))).toBeTruthy()
    expect(pathExists(join(process.cwd(), name2))).toBeTruthy()
  }

  const downloadSingleSongInNewDir = async () => {
    const promise = this.checkbox.run()
    this.rl.input.emit('keypress', ' ', { name: 'space' })
    this.rl.emit('line')
    const answer = await promise
    const {
      songName,
      options: { path: destDir },
    } = answer[0]
    expect(answer.length).toEqual(1)
    await download(answer)
    expect(pathExists(join(destDir, songName))).toBeTruthy()
  }

  const downloadSingleSongWithLyric = async () => {
    const promise = this.checkbox.run()
    this.rl.input.emit('keypress', ' ', { name: 'space' })
    this.rl.emit('line')
    const answer = await promise
    const { songName } = answer[0]
    const lrcName = `${songName.split('.')[0]}.lrc`
    expect(answer.length).toEqual(1)
    await download(answer)
    expect(pathExists(join(process.cwd(), songName))).toBeTruthy()
    expect(pathExists(join(process.cwd(), lrcName))).toBeTruthy()
  }

  it('should download a single song from the default page 1 of the migu service', async () => {
    await downloadSingleSong()
  })

  it('should download two songs from the default page 1 of the migu service', async () => {
    await downloadTwoSongs()
    index += 1
  })

  it('should download a single song from the page 2 of the migu service', async () => {
    await downloadSingleSong()
    index += 1
  })

  it('should download a single song in a new dir of the migu service', async () => {
    await downloadSingleSongInNewDir
    index += 1
  })

  it('should download a single song with lyric of the migu service', async () => {
    await downloadSingleSongWithLyric()
    index += 1
  })

  it('should download a single song from the default page 1 of the wangyi service', async () => {
    await downloadSingleSong()
  })

  it('should download two songs from the default page 1 of the wangyi service', async () => {
    await downloadTwoSongs()
    index += 1
  })

  it('should download a single song from the page 2 of the wangyi service', async () => {
    await downloadSingleSong()
    index += 1
  })

  it('should download a single song in a new dir of the wangyi service', async () => {
    await downloadSingleSongInNewDir
    index += 1
  })

  it('should download a single song with lyric of the wangyi service', async () => {
    await downloadSingleSongWithLyric()
  })
})
