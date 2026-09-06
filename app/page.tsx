import { LinePainterGame } from '@/components/game/line-painter-game'

export default function Page() {
  return (
    <main
      style={{
        maxWidth: 1000,
        margin: '0 auto',
        padding: '40px 24px 96px',
      }}
    >
      <LinePainterGame />
    </main>
  )
}
