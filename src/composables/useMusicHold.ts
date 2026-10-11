/*
 * A video playing with sound "holds" the background music, and gives it back when it stops.
 * MusicButton owns the <audio>; it pauses on a hold only if the song was playing, and on the
 * release resumes only what it paused itself — a guest who paused the music keeps it paused.
 */
export const MUSIC_HOLD = 'music:hold'
export const MUSIC_RELEASE = 'music:release'

export function holdMusic() {
  window.dispatchEvent(new Event(MUSIC_HOLD))
}

export function releaseMusic() {
  window.dispatchEvent(new Event(MUSIC_RELEASE))
}
