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
}

export interface SearchSongInfo {
  id: string
  url: string
  size: number
  extension: string
  name: string
  lyricUrl: string
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
  serviceName: string
  searchSongs: SearchSongInfo[]
  text: string
}
