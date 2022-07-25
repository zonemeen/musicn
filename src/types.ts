export interface Artist {
  name: string
}

export interface RateFormat {
  size?: string
  androidSize?: string
  fileType?: string
  androidFileType?: string
  url: string
  androidUrl: string
}

export interface CommandOptions {
  lyric?: string
  path?: string
  service: string
  number: string
}

export interface SearchSongInfo {
  id: string
  contentId: string
  copyrightId: string
  url: string
  size: number
  extension: string
  name: string
  lyricUrl: string
  DC_TARGETID: string
  NAME: string
  ARTIST: string
  artists: Artist[]
  singers: Artist[]
  newRateFormats: RateFormat[]
  rateFormats: RateFormat[]
}

export interface SongInfo {
  songName: string
  songDownloadUrl: string
  lyricDownloadUrl: string
  songSize: number
  options: CommandOptions
  searchSongs: SearchSongInfo[]
  text: string
}
