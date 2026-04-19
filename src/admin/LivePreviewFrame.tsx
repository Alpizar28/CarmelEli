import { type ReactNode, type RefObject } from 'react'

interface LivePreviewFrameProps {
  title: string
  iframeTitle: string
  src: string
  onLoad?: () => void
  headerRight?: ReactNode
  iframeRef?: RefObject<HTMLIFrameElement>
}

export default function LivePreviewFrame({
  title,
  iframeTitle,
  src,
  onLoad,
  headerRight,
  iframeRef,
}: LivePreviewFrameProps) {
  return (
    <div className="h-full min-h-[65vh] lg:min-h-full border-l border-divider flex flex-col bg-[#eef1ef]">
      <div className="h-12 border-b border-divider bg-white px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="text-xs tracking-[2px] uppercase text-ink/80">{title}</p>
          <span className="text-[11px] text-ink/60">Real-time</span>
        </div>

        <div className="flex items-center gap-4">{headerRight}</div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="h-full mx-auto w-full">
          <iframe
            ref={iframeRef}
            src={src}
            title={iframeTitle}
            className="w-full h-full bg-white border border-divider"
            onLoad={onLoad}
          />
        </div>
      </div>
    </div>
  )
}
