import { useRef, useState, useCallback } from 'react'

export function useAmbientSound(src: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)

  const toggle = useCallback(() => {
    if (!audioRef.current) {
      const audio = new Audio(src)
      audio.loop = true
      audio.volume = 0
      audioRef.current = audio
    }

    const audio = audioRef.current

    if (playing) {
      fadeTo(audio, 0, () => audio.pause())
      setPlaying(false)
    } else {
      audio.play().then(() => {
        fadeTo(audio, 0.25)
        setPlaying(true)
      }).catch(() => {
        // Browser blocked autoplay — requires user gesture, which this already is
      })
    }
  }, [playing, src])

  return { playing, toggle }
}

function fadeTo(audio: HTMLAudioElement, target: number, onDone?: () => void) {
  const step = 0.025
  const interval = setInterval(() => {
    const next = target > audio.volume
      ? Math.min(audio.volume + step, target)
      : Math.max(audio.volume - step, target)
    audio.volume = next
    if (next === target) {
      clearInterval(interval)
      onDone?.()
    }
  }, 40)
}
